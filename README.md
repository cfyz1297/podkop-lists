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

Файл подсетей `claude/claude-ipv4-anthropic.txt` пересобирается ежедневно
workflow [`.github/workflows/update-lists.yml`](.github/workflows/update-lists.yml)
из RIPE Stat (AS399358) и коммитится только при изменениях. Остальные списки
поддерживаются вручную: у них нет машинного источника, а снимки IPv4 в папках
`opencode` и `claude` предназначены для диагностики и не рекомендуются как
постоянное правило проксирования; для подсетей используйте файлы с
фиксированными диапазонами.

Тот же workflow проверяет синтаксис всех `*.txt`: строка, которую Podkop молча
выбросит, роняет запуск. Локально: `node scripts/update-lists.mjs` (проверка и
обновление), `node --test` (тесты).

