# OpenCode Zen / Go: списки для Podkop

Проверено 19 октября 2026 года. Списки составлены вручную по документации и
исходникам OpenCode. Это не официальный список OpenCode. Автоматического поиска
новых доменов или обновления снимка IPv4 нет.

## Подключение

В Podkop откройте нужную секцию с вашим прокси и добавьте в поле
**Внешние списки доменов / Remote Domains Lists** одну из ссылок:

- [Рекомендуемый расширенный список](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/opencode/domains.txt)
- [Минимальный список сервисов OpenCode](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/opencode/domains-core.txt)

Сохраните и примените настройки. Выбирать оба списка не требуется: расширенный
уже содержит минимальный. Ссылки на `main` остаются прежними при обновлении файлов.

Podkop импортирует текстовые списки как `domain_suffix`: запись `opencode.ai`
охватывает домен и все его поддомены. Префикс `*.` и протокол в строках не нужны.
Списки содержат только домены, по одному на строку.

## Состав

| Домен | Назначение |
| --- | --- |
| `opencode.ai` | Zen/Go, сайт, консоль, API и поддомены, включая `models.opencode.ai` |
| `opncd.ai` | Ссылки на опубликованные сессии |
| `models.dev` | Каталог моделей, в том числе для прежних версий OpenCode |
| `mcp.exa.ai` | Дополнительный инструмент поиска Exa |
| `search.parallel.ai` | Дополнительный инструмент поиска Parallel |
| `registry.npmjs.org` | Установка, обновления и загрузка npm-пакетов |
| `github.com` | Вход через GitHub, релизы и интеграции |
| `githubusercontent.com` | Файлы и ресурсы GitHub, включая релизные загрузки |
| `githubassets.com` | Ресурсы веб-интерфейса GitHub |

Последние шесть доменов входят только в расширенный список. Правила GitHub и npm
проксируют весь трафик к указанным доменам, включая обращения других программ.

Списки предназначены для Zen/Go и встроенных бесплатных моделей. Прямое
подключение других провайдеров, вход через Google, оплата, дополнительные
инструменты, MCP и загрузки языковых серверов могут требовать других адресов.
Произвольные сайты, которые агент открывает через веб-инструменты, сюда не входят.
DNS-запросы устройства должны обрабатываться способом, совместимым с правилами
вашей установки Podkop.

## IPv4: только снимок DNS

[Снимок IPv4 от 19 октября 2026 года](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/opencode/ipv4-snapshot-2026-10-19.txt)
содержит A-записи, полученные через Google Public DNS (`https://dns.google/resolve`).
TTL полученных ответов — 300 секунд. Снимок не обновляется автоматически и
не является полным постоянным диапазоном адресов OpenCode.

| Имя | IPv4 в снимке |
| --- | --- |
| `opencode.ai` | `172.65.90.20`, `172.65.90.21`, `172.65.90.22`, `172.65.90.23` |
| `api.opencode.ai`, `models.opencode.ai`, `app.opencode.ai` | `8.6.112.5`, `8.47.69.5` |
| `opncd.ai` | `188.114.96.1`, `188.114.97.1` |
| `models.dev` | `104.26.8.108`, `104.26.9.108`, `172.67.69.147` |

Рекомендуется использовать доменный список. Адреса CDN могут меняться и
обслуживать посторонние сайты. Не подключайте снимок IPv4 как постоянный
список. Для диагностического применения его формат — отдельный IPv4 `/32`
на строку; поле Podkop — **Внешние списки подсетей / Remote Subnet Lists**,
а не список доменов.

## Источники

- [Podkop: секции и внешние списки](https://podkop.net/docs/sections/)
- [Podkop: импорт как domain_suffix](https://github.com/itdoginfo/podkop/blob/main/podkop/files/usr/lib/rulesets.sh)
- [OpenCode Go: API](https://opencode.ai/v2/docs/console/go/)
- [OpenCode: домены инфраструктуры](https://github.com/anomalyco/opencode/blob/dev/infra/stage.ts)
- [OpenCode: каталог моделей](https://github.com/anomalyco/opencode/blob/dev/packages/core/src/models-dev.ts)
- [OpenCode: Exa](https://github.com/anomalyco/opencode/blob/dev/packages/core/src/plugin/websearch/exa.ts)
- [OpenCode: Parallel](https://github.com/anomalyco/opencode/blob/dev/packages/core/src/plugin/websearch/parallel.ts)
- [OpenCode: установщик и npm](https://github.com/anomalyco/opencode/blob/dev/install)
- [Cloudflare: общие IP-адреса](https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/)
