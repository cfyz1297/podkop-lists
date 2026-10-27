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
  — обновляется ежедневно из RIPE Stat по AS399358.
- [Снимок IPv4 от 27 октября 2026 года](https://raw.githubusercontent.com/cfyz1297/podkop-lists/main/claude/claude-ipv4-snapshot-2026-10-27.txt)
  — только для диагностики, постоянным правилом подключать не нужно.

Сохраните и примените настройки. Расширенный список уже содержит минимальный:
выбирать оба не требуется. Ссылки на `main` остаются прежними при обновлении файлов.

После коммита ссылки на `main` могут ещё несколько минут отдавать прежнюю версию:
GitHub кэширует raw на минуты, jsDelivr — до 12 часов. Кэш jsDelivr сбрасывается
запросом к `https://purge.jsdelivr.net/gh/cfyz1297/podkop-lists@main/<путь>`.
Чтобы получить гарантированно конкретную версию, замените `main` на SHA коммита.

Podkop импортирует текстовые списки как `domain_suffix`: запись `claude.ai`
охватывает домен и все его поддомены, поэтому `api.anthropic.com`,
`platform.claude.com`, `sso.claude.com`, `downloads.claude.ai`,
`bridge.claudeusercontent.com` и остальные поддомены отдельными строками не
нужны. Префикс `*.` и протокол в строках не пишутся. В файлах только домены,
по одному на строку; в файлах подсетей — только CIDR или одиночные IPv4.

## Имена файлов

- `claude-domains.txt` — минимальный набор: домены из официальной документации
  Anthropic, без которых не работают ни веб-версия, ни Desktop, ни Claude Code.
- `claude-extended-domains.txt` — весь набор `geosite:anthropic`, тот же, что у
  MetaCubeX и v2fly. Файл ежедневно приводится к их объединению: новые домены
  добавляются, лишние удаляются, порядок алфавитный. Править вручную нет смысла —
  следующая ночь перезапишет.
- `claude-artifacts-cdn-domains.txt` — шрифты и JS-библиотеки, которые грузят
  артефакты. Отдельный файл, потому что это общие CDN, см. ниже.
- `claude-ipv4-anthropic.txt` — все IPv4-префиксы, анонсируемые AS399358
  (Anthropic, PBC); файл пересобирается ежедневно из RIPE Stat workflow
  `update-lists`, вручную править не нужно.
- `claude-ipv4-snapshot-2026-10-27.txt` — снимок A-записей ключевых хостов,
  одиночные `/32`.

## Состав

### Минимальный список

| Домен | Назначение |
| --- | --- |
| `anthropic.com` | `api.anthropic.com`, консоль, документация, статус, поддержка, CDN `assets-proxy`, `a-cdn`, `s-cdn`, прокси MCP-коннекторов |
| `claude.ai` | Веб-приложение, вход, OAuth, `assets`, `downloads`, `*.livepreview`, `bridge` для Claude in Chrome |
| `claude.app` | Claude Desktop и его `*.livepreview` |
| `claude.com` | Сайт, страница входа, `platform.claude.com` (консоль разработчика), `sso.claude.com`, `code.claude.com` (документация Claude Code) |
| `claudeusercontent.com` | Артефакты и файлы пользователя, содержимое артефактов (`*.frame`) |
| `claudemcpcontent.com` | Интерактивные виджеты MCP Apps внутри диалога |

Список взят из таблиц «Network access requirements» для Claude Code и Claude
Desktop; поддомены покрыты суффиксом, поэтому в файле только корневые домены.

### Расширенный список

Остальные 13 доменов сверх минимального набора — категория `anthropic` из
`domain-list-community` и MetaCubeX: `ant.dev`, `anthropic.team`,
`antspace.dev`, `chatbotclaude.com`, `clau.de`, `claude.dev`, `claude.new`,
`claude.site`, `claudeacademy.com`, `claudemcpclient.com`, `claudepages.dev`,
`claudestudio.com`, `servd-anthropic-website.b-cdn.net`. Это короткие ссылки,
лендинги и клиентские хосты самой Anthropic.

Сторонних сервисов в файле нет. Хосты зависимостей Claude Code — `github.com`,
`registry.npmjs.org`, `storage.googleapis.com`, фичефлаги Statsig
(`featuregates.org`, `statsig.com`), телеметрия (`sentry.io`, `datadoghq.com`),
проверка Cloudflare (`challenges.cloudflare.com`) — из файла удалены: сообщество
их не проксирует, потому что эти домены общие и увезут в туннель трафик
посторонних программ. Если плагины Claude Code или `npx` MCP-серверы должны
работать через прокси, добавьте нужные строки локально, но не в этот
репозиторий: ночной workflow выровняет файл по сообществу и удалит их снова.

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
(`a-cdn`, `s-cdn`, `assets`, `downloads`): обратные записи вида
`103.57.36.34.bc.googleusercontent.com` показывают, что это Google Cloud, а не
Anthropic. Адреса меняются и обслуживают сторонние сервисы, поэтому снимок —
диагностика, а не правило.

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

Плюс: обновляется без вашего участия. Файл `claude-extended-domains.txt` этого
репозитория теперь содержит ровно тот же набор, что и `.srs` сообщества, — он
удобен, когда списки ведутся текстом, а не rule-set. Минус обоих вариантов:
домены зависимостей Claude Code (GitHub, npm, Statsig, телеметрия) в них не
входят, их нужно проксировать отдельными правилами.

## Какие форматы принимает Podkop

Проверено по коду `/usr/bin/podkop` (`configure_remote_domain_or_subnet_list_handler`,
`import_domains_from_remote_domain_list_handler`): внешние списки делятся на два
пути. `.json` и `.srs` подключаются как rule-set и отдаются на разбор sing-box,
всё остальное скачивается и импортируется как плоский текст, где каждая строка
проверяется через `is_domain_suffix` (для доменов) или `is_ipv4` / `is_ipv4_cidr`
(для подсетей). Отсюда три следствия:

- `.yaml` из MetaCubeX (формат `payload:` + `- +.domain`) **не поддерживается**:
  все строки файла отбраковываются как невалидные домены, список получается
  пустым и в лог пишется только debug-сообщение. Для тех же категорий берите
  `.srs` из ветки `sing`: `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/<категория>.srs`.
- CIDR-файл, добавленный в поле **Внешние списки доменов**, тоже даёт пустой
  список — такие файлы относятся в **Внешние списки подсетей**.
- Текстовые списки подсетей принимают только IPv4: IPv6-строки отбрасываются,
  для IPv6 нужен `.json`/`.srs`.

## Сверка с community-набором

Категория `anthropic` из geosite (v2fly, MetaCubeX и её `.srs` в sing-geosite)
содержит 19 доменов. Сверка выполнена 27 октября 2026 года декомпиляцией `.srs`
через `sing-box rule-set decompile` (sing-box 1.14.4): обе сборки `.srs` дают
один и тот же набор, хотя сериализованы в разных версиях формата.

- В расширенном списке присутствуют все 19 доменов community-набора: ничего не
  потеряно, дополнять его не нужно.
- В минимальном списке 6 из 19; остальные 13 — лендинги, короткие ссылки и
  клиентские хосты, они только в расширенном.
- `code.claude.com` отдельной строкой не нужен: это поддомен `claude.com`.
- Расширенный список добавляет 14 доменов, которых в geosite нет:
  `challenges.cloudflare.com`, `static.cloudflareinsights.com`, `datadoghq.com`,
  `browser-intake-us5-datadoghq.com`, `sentry.io`, `statsig.com`,
  `statsigapi.net`, `featureassets.org`, `featuregates.org`,
  `prodregistryv2.org`, `storage.googleapis.com`, `github.com`,
  `raw.githubusercontent.com`, `registry.npmjs.org`.
- В подсетях пересечений нет и быть не может: geosite содержит только домены
  (в декомпилированном `.srs` поля `domain` и `domain_suffix`, `ip_cidr` = 0),
  а IP-наборы `allow-domains` собирает лишь для 11 провайдерских ASN —
  Cloudflare, CloudFront, Discord, DigitalOcean, Google Meet, Hetzner, Meta, OVH,
  Roblox, Telegram, Twitter. Anthropic в них отсутствует, поэтому `160.79.104.0/23`
  взят из документации Anthropic и совпадает с анонсом AS399358.

Оба `.srs` дополнительно проверены `sing-box check` на версии 1.14.4:
конфигурация с ними валидна, формат загружается.

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



