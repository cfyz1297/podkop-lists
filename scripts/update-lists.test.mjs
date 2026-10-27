import assert from "node:assert/strict";
import test from "node:test";
import { findBadLines, ipv4Prefixes } from "./update-lists.mjs";

test("findBadLines: домены, комментарии и пустые строки проходят", () => {
  assert.deepEqual(findBadLines("claude-domains.txt", "# список\nclaude.ai\n\nsub.domain.com\n"), []);
});

test("findBadLines: мусор в доменном списке ловится с номером строки", () => {
  assert.deepEqual(findBadLines("claude-domains.txt", "claude.ai\n+.bad\n160.79.104.0/23\n"), [
    "2: +.bad",
    "3: 160.79.104.0/23",
  ]);
});

test("findBadLines: в ipv4-файле домены запрещены, а кривые октеты тоже", () => {
  assert.deepEqual(findBadLines("claude-ipv4-anthropic.txt", "160.79.104.0/23\n999.1.1.1/8\nclaude.ai\n"), [
    "2: 999.1.1.1/8",
    "3: claude.ai",
  ]);
});

test("ipv4Prefixes: только IPv4, без дублей, по порядку адресов", () => {
  const payload = {
    data: {
      prefixes: [
        { prefix: "160.79.106.0/24" },
        { prefix: "2607:6bc0::/48" },
        { prefix: "160.79.104.0/23" },
        { prefix: "160.79.104.0/23" },
      ],
    },
  };
  assert.deepEqual(ipv4Prefixes(payload), ["160.79.104.0/23", "160.79.106.0/24"]);
});

test("ipv4Prefixes: неожиданный формат ответа — ошибка, а не пустой файл", () => {
  assert.throws(() => ipv4Prefixes({}), /неожиданный формат/);
});
