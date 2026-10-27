# Списки для Podkop

Публичные доменные списки для OpenWrt / Podkop.

## OpenCode Zen / Go

Добавьте одну ссылку в поле **Внешние списки доменов** нужной секции Podkop:

- [Расширенный список — рекомендуемый](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/opencode/opencode-zen-go-extended-domains.txt)
- [Минимальный список](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/opencode/opencode-zen-go-domains.txt)

[Состав, источники и инструкция](opencode/README.md).

## Claude / Anthropic

Домены — в поле **Внешние списки доменов**, подсети — в поле **Внешние списки
подсетей** нужной секции Podkop:

- [Расширенный список доменов — рекомендуемый](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-extended-domains.txt)
- [Минимальный список доменов](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-domains.txt)
- [CDN артефактов — опционально](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-artifacts-cdn-domains.txt)
- [Подсети Anthropic](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-ipv4-anthropic.txt)

[Состав, источники и инструкция](claude/README.md).

## Общее

Workflow [`.github/workflows/update-lists.yml`](.github/workflows/update-lists.yml)
запускается ежедневно в 04:17 UTC и коммитит только реальные изменения:

- `claude/claude-extended-domains.txt` — дозаписываются новые домены Anthropic,
  найденные в публичных geosite-списках
  ([MetaCubeX](https://github.com/MetaCubeX/meta-rules-dat),
  [v2fly](https://github.com/v2fly/domain-list-community));
- `claude/claude-ipv4-anthropic.txt` — пересобирается из RIPE Stat по AS399358.

Только добавление: существующие строки и ручные записи не удаляются и не
переупорядочиваются. Минимальный и CDN-список, а также списки `opencode`
остаются ручными — снимки IPv4 в этих папках предназначены для диагностики и не
рекомендуются как постоянное правило проксирования.

Тот же workflow проверяет синтаксис всех `*.txt`: строка, которую Podkop молча
выбросит, роняет запуск. Локально: `node scripts/update-lists.mjs` (проверка и
обновление), `node --test` (тесты).

