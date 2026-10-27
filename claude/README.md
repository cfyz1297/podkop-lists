# Claude / Anthropic: списки для Podkop

Проверено 27 октября 2026 года. Списки составлены вручную по официальной
документации Anthropic (требования к сети для Claude Desktop и Claude Code),
по опубликованным IP-диапазонам API и по community-категории `anthropic`
(v2fly / MetaCubeX). Это не официальный список Anthropic.

Готового списка именно для Podkop в публичных репозиториях нет: в
[itdoginfo/allow-domains](https://github.com/itdoginfo/allow-domains), откуда
Podkop берёт большинство community-листов, нет ни одного домена Anthropic или
Claude. Ближайший готовый источник — `geosite:anthropic`, см.
[Готовые альтернативы](#готовые-альтернативы).

## Подключение

В Podkop откройте нужную секцию с вашим прокси и добавьте:

- в поле **Внешние списки доменов / Remote Domains Lists** — один из списков доменов;
- в поле **Внешние списки подсетей / Remote Subnet Lists** — файл подсетей.

Списки доменов:

- [Расширенный список — рекомендуемый](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-extended-domains.txt)
- [Минимальный список](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-domains.txt)
- [CDN артефактов — опционально](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-artifacts-cdn-domains.txt)

Списки подсетей:

- [Подсети Anthropic](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-ipv4-anthropic.txt)
- [Снимок IPv4 от 27 октября 2026 года](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-ipv4-snapshot-2026-10-27.txt)
  — только для диагностики, постоянным правилом подключать не нужно.

Сохраните и примените настройки. Расширенный список уже содержит минимальный:
выбирать оба не требуется. Ссылки на `main` остаются прежними при обновлении файлов.

Podkop импортирует текстовые списки как `domain_suffix`: запись `claude.ai`
охватывает домен и все его поддомены, поэтому `api.anthropic.com`,
`platform.claude.com`, `sso.claude.com`, `downloads.claude.ai`,
`bridge.claudeusercontent.com` и остальные поддомены отдельными строками не
нужны. Префикс `*.` и протокол в строках не пишутся. В файлах только домены,
по одному на строку; в файлах подсетей — только CIDR или одиночные IPv4.

## Имена файлов

- `claude-domains.txt` — минимальный набор: домены из официальной документации
  Anthropic, без которых не работают ни веб-версия, ни Desktop, ни Claude Code.
- `claude-extended-domains.txt` — минимальный набор, домены из `geosite:anthropic`
  и служебные зависимости: плагины Claude Code, npm, GitHub, фичефлаги, телеметрия.
- `claude-artifacts-cdn-domains.txt` — шрифты и JS-библиотеки, которые грузят
  артефакты. Отдельный файл, потому что это общие CDN, см. ниже.
- `claude-ipv4-anthropic.txt` — официальный диапазон Anthropic для входящих
  подключений, `160.79.104.0/23`.
- `claude-ipv4-snapshot-2026-10-27.txt` — снимок A-записей ключевых хостов,
  одиночные `/32`.

## Состав

### Минимальный список

| Домен | Назначение |
| --- | --- |
| `anthropic.com` | `api.anthropic.com`, консоль, документация, статус, поддержка, CDN `assets-proxy`, `a-cdn`, `s-cdn`, прокси MCP-коннекторов |
| `claude.ai` | Веб-приложение, вход, OAuth, `assets`, `downloads`, `*.livepreview`, `bridge` для Claude in Chrome |
| `claude.app` | Claude Desktop и его `*.livepreview` |
| `claude.com` | Сайт, страница входа, `platform.claude.com` (консоль разработчика), `sso.claude.com` |
| `claudeusercontent.com` | Артефакты и файлы пользователя, содержимое артефактов (`*.frame`) |
| `claudemcpcontent.com` | Интерактивные виджеты MCP Apps внутри диалога |

Список взят из таблиц «Network access requirements» для Claude Code и Claude
Desktop; поддомены покрыты суффиксом, поэтому в файле только корневые домены.

### Расширенный список

Дополнительно к минимальному:

- `ant.dev`, `anthropic.team`, `antspace.dev`, `chatbotclaude.com`, `clau.de`,
  `claude.dev`, `claude.new`, `claude.site`, `claudeacademy.com`,
  `claudemcpclient.com`, `claudepages.dev`, `claudestudio.com`,
  `servd-anthropic-website.b-cdn.net` — категория `anthropic` из
  `domain-list-community`: короткие ссылки, лендинги, клиентские хосты.
- `code.claude.com` — документация Claude Code, которую открывает встроенный агент.
- `github.com`, `raw.githubusercontent.com`, `registry.npmjs.org` — установка
  плагинов Claude Code, changelog для `/release-notes`, `npx` MCP-серверы.
- `storage.googleapis.com` — метаданные плагинов и старые версии установщика.
- `featuregates.org`, `featureassets.org`, `prodregistryv2.org`, `statsig.com`,
  `statsigapi.net` — фичефлаги веб-приложения (Statsig).
- `sentry.io`, `datadoghq.com` — отчёты об ошибках и телеметрия Claude Code и
  Desktop; отключаются через `DISABLE_TELEMETRY`, `DISABLE_ERROR_REPORTING` и
  `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.
- `challenges.cloudflare.com`, `static.cloudflareinsights.com` — проверка
  браузера и аналитика на страницах Anthropic.

Правила GitHub и npm проксируют весь трафик к этим доменам, включая обращения
других программ. Если это не нужно, удалите эти строки из списка.

### CDN артефактов

`cdn.jsdelivr.net`, `cdn.tailwindcss.com`, `cdnjs.cloudflare.com`,
`code.jquery.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com` —
хосты, с которых артефакты берут шрифты и JS-библиотеки. Они задокументированы,
но это общие CDN: те же адреса используют тысячи других сайтов, и весь их
трафик тоже пойдёт в туннель. Подключайте файл только при необходимости; без
него артефакты теряют часть оформления, остальное приложение работает.

## Подсети

Anthropic публикует фиксированные диапазоны в документации API:

- `160.79.104.0/23` — входящие подключения к сервисам Anthropic (в файле);
- `160.79.104.0/21` — исходящие запросы самой Anthropic (MCP, web search, web
  fetch); для маршрутизации клиентского трафика не нужен.

Диапазон `160.79.104.0/23` совпадает с анонсами AS399358 по данным RIPE RIS,
поэтому годится как постоянное правило. Снимок `/32` содержит адреса CDN
(`a-cdn`, `s-cdn`, `assets`, `downloads`): это Google Cloud Load Balancer,
адреса меняются и обслуживают сторонние сервисы, поэтому снимок — диагностика,
а не правило.

Для маршрутизации по доменам подсети обычно не нужны. Они помогают, когда
клиент обращается по IP или когда DNS-ответы приходят повреждёнными. Не
включайте в списки подсетей диапазоны Cloudflare целиком: `claude.ai` и
`api.anthropic.com` отдаются из `160.79.104.0/23`, а Cloudflare обслуживает
множество посторонних сайтов.

## Готовые альтернативы

Категория `anthropic` из community-наборов geosite уже собрана и обновляется
сообществом. Podkop принимает `.srs` и `.json` во **Внешних списках доменов**,
так что её можно подключить напрямую вместо этого репозитория:

- `https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-anthropic.srs`
- `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/anthropic.srs`

Плюс: обновляется без вашего участия. Минус: внутри только домены из geosite —
нет хостов плагинов, npm, GitHub, телеметрии и CDN артефактов. Расширенный
список этого репозитория содержит geosite-набор целиком плюс зависимости.

## Если что-то не работает

- Пустая белая страница вместо claude.ai — не открываются `assets-proxy.anthropic.com`
  или `*.claudeusercontent.com`; проверьте, что список добавлен именно в поле
  доменов, а не подсетей.
- Не грузятся виджеты внутри диалога — нужен `*.claudemcpcontent.com`.
- Артефакт без оформления или без графиков — подключите CDN артефактов.
- Claude Code не ставит плагины — нужны `github.com` и `registry.npmjs.org`.
- Точный список недоступных хостов виден в DevTools браузера: вкладка Network,
  фильтр по неудачным запросам, колонка Domain. Добавляйте только те домены,
  которые действительно не открываются: вход через Google и Apple, платёжные
  страницы и прочее обычно работают напрямую.

## Источники

- [Claude Code: enterprise network configuration](https://code.claude.com/docs/en/network-config#network-access-requirements)
- [Claude Desktop: network access requirements](https://code.claude.com/docs/en/desktop#network-access-requirements)
- [Anthropic API: IP addresses](https://platform.claude.com/docs/en/api/ip-addresses)
- [v2fly/domain-list-community: data/anthropic](https://github.com/v2fly/domain-list-community/blob/master/data/anthropic)
- [MetaCubeX/meta-rules-dat: geosite anthropic](https://github.com/MetaCubeX/meta-rules-dat/blob/sing/geo/geosite/anthropic.json)
- [itdoginfo/allow-domains](https://github.com/itdoginfo/allow-domains) — проверено, домены Anthropic отсутствуют



