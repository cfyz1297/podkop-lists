#!/usr/bin/env node
// Дозаписывает новые домены Anthropic/Claude из публичных geosite-списков,
// пересобирает подсети из RIPE Stat и проверяет синтаксис всех txt-списков.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ASN = "AS399358"; // ANTHROPIC, PBC
const PREFIXES_FILE = "claude/claude-ipv4-anthropic.txt";
const DOMAINS_FILE = "claude/claude-extended-domains.txt";
const RIPE_URL = `https://stat.ripe.net/data/announced-prefixes/data.json?resource=${ASN}`;

// Курируемые списки доменов Anthropic: оба плоским текстом, оба обновляются апстримом.
const DOMAIN_SOURCES = [
  "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/anthropic.list",
  "https://raw.githubusercontent.com/v2fly/domain-list-community/master/data/anthropic",
];

const DOMAIN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/** Домены из geosite-файла: `+.x`, `full:x`, `domain:x` и комментарии. */
export function parseDomainList(text) {
  return text
    .split("\n")
    .map((line) => line.split("#")[0].trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\+\./, "").replace(/^(?:full|domain):/, ""))
    .filter((line) => DOMAIN.test(line));
}

/** Приводит файл к объединению источников: по алфавиту, без дублей и ручных строк. */
export function buildDomainsFile(existingText, discovered) {
  const before = existingText.split("\n").map((line) => line.trim()).filter(Boolean);
  const text = [...new Set(discovered.map((domain) => domain.toLowerCase()))].sort().map((d) => `${d}\n`).join("");
  const after = new Set(text.split("\n").filter(Boolean));
  const have = new Set(before.map((domain) => domain.toLowerCase()));
  return {
    text,
    added: [...after].filter((domain) => !have.has(domain)),
    removed: before.filter((domain) => !after.has(domain)),
  };
}

function isIpv4Cidr(value) {
  const [ip, length, ...rest] = String(value).split("/");
  if (rest.length || !ip || !length) return false;
  const octets = ip.split(".");
  const validOctets = octets.length === 4 && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
  return validOctets && /^\d{1,2}$/.test(length) && Number(length) <= 32;
}

/** Возвращает номера строк, которые Podkop молча выбросит. */
export function findBadLines(name, text) {
  const check = /ipv4/i.test(name) ? isIpv4Cidr : (line) => DOMAIN.test(line);
  return text
    .split("\n")
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter(({ line }) => line && !line.startsWith("#"))
    .filter(({ line }) => !check(line))
    .map(({ line, number }) => `${number}: ${line}`);
}

/** IPv4-префиксы из ответа RIPE Stat, отсортированные по адресу и длине маски. */
export function ipv4Prefixes(payload) {
  const list = payload?.data?.prefixes;
  if (!Array.isArray(list)) throw new Error("RIPE Stat: неожиданный формат ответа");
  const unique = [...new Set(list.map((item) => item?.prefix).filter((prefix) => isIpv4Cidr(prefix) && /^\d+\.\d+\.\d+\.\d+\/\d+$/.test(prefix)))];
  return unique.sort((a, b) => {
    const [ipA, lenA] = a.split("/");
    const [ipB, lenB] = b.split("/");
    const bytesA = ipA.split(".").map(Number);
    const bytesB = ipB.split(".").map(Number);
    for (let i = 0; i < 4; i += 1) if (bytesA[i] !== bytesB[i]) return bytesA[i] - bytesB[i];
    return Number(lenA) - Number(lenB);
  });
}

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === ".git" || entry.name === "scripts" ? [] : listFiles(full);
      return entry.name.endsWith(".txt") ? [full] : [];
    });
}

async function main() {
  const root = process.cwd();
  let broken = 0;
  for (const file of listFiles(root)) {
    const name = path.basename(file);
    const bad = findBadLines(name, fs.readFileSync(file, "utf8"));
    if (!bad.length) continue;
    broken += bad.length;
    console.error(`${path.relative(root, file)}: ${bad.length} строк(и) не пройдут фильтр Podkop`);
    for (const line of bad) console.error(`  ${line}`);
  }
  if (broken) throw new Error(`битых строк: ${broken}`);

  const discovered = [];
  for (const url of DOMAIN_SOURCES) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}, файлы не трогаю`);
    const domains = parseDomainList(await response.text());
    if (!domains.length) throw new Error(`${url}: пустой ответ, файлы не трогаю`);
    discovered.push(...domains);
    console.log(`${url}: ${domains.length} доменов`);
  }

  const domainsTarget = path.join(root, DOMAINS_FILE);
  const built = buildDomainsFile(fs.readFileSync(domainsTarget, "utf8").replace(/\r\n/g, "\n"), discovered);
  if (built.text !== fs.readFileSync(domainsTarget, "utf8").replace(/\r\n/g, "\n")) {
    fs.writeFileSync(domainsTarget, built.text, "utf8");
    console.log(
      `${DOMAINS_FILE}: приведён к списку сообщества (${built.text.split("\n").filter(Boolean).length} доменов)` +
        `, добавлено ${built.added.length}${built.added.length ? ` → ${built.added.join(", ")}` : ""}` +
        `, удалено ${built.removed.length}${built.removed.length ? ` → ${built.removed.join(", ")}` : ""}`,
    );
  } else {
    console.log(`${DOMAINS_FILE}: совпадает со списком сообщества`);
  }

  const response = await fetch(RIPE_URL, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`RIPE Stat ответил ${response.status}`);
  const prefixes = ipv4Prefixes(await response.json());
  if (!prefixes.length) throw new Error("RIPE Stat не вернул ни одного IPv4-префикса, файл не трогаю");

  const target = path.join(root, PREFIXES_FILE);
  const text = `${prefixes.join("\n")}\n`;
  if (fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") === text) {
    console.log(`${PREFIXES_FILE}: без изменений (${prefixes.join(", ")})`);
    return;
  }
  fs.writeFileSync(target, text, "utf8");
  console.log(`${PREFIXES_FILE}: обновлён → ${prefixes.join(", ")}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
