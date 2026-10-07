---
slug: hermes-homeassistant-plugin
title: Hermes Home Assistant plugin
category: Integrations
excerpt: Official Hermes plugin, installed with hermes plugins install homeassistant. It left core in the October 3, 2026 docs update and needs Hermes 0.21.5 or newer.
tags:
  - hermes
  - home-assistant
  - plugins
  - smart-home
for: Hermes Agent 0.21.5+
author: Nous Research
install: hermes plugins install homeassistant
dependencies:
  - Hermes Agent 0.21.5 or newer
  - aiohttp >=3.9,<4
  - A Home Assistant long-lived access token
image: /images/skills/integrations.svg
source: https://github.com/NousResearch/hermes-homeassistant
order: 99
last_verified: "2026-10-07"
---

# Hermes Home Assistant plugin

## What it is

This is a plugin, not a hub skill. Do not run `hermes skill install` for it.

Nous Research moved Home Assistant out of Hermes core and into the plugin catalog. The docs commit is `0f7a95f1`, dated October 3, 2026. The live messaging page and the plugin README both say the install is:

```bash
hermes plugins install homeassistant
```

Plugins are per profile. Another profile needs its own install:

```bash
hermes -p <profile> plugins install homeassistant
```

The README says the only Python dependency is `aiohttp` (`>=3.9,<4`), resolved under Hermes's pins, and that you need Hermes Agent `0.21.5` or newer. The old `hermes-agent[homeassistant]` extra is gone. The docs page says there is no pip extra to install.

If a profile already had Home Assistant configured, the README says you do not reconfigure it. `hermes update`, or the first start after updating, installs the plugin. The same `HASS_TOKEN`, `HASS_URL`, platform name, tool names, and cron `deliver: homeassistant` syntax carry over.

## What you get

Two surfaces, same token.

1. Gateway platform `homeassistant`. It subscribes to `state_changed` on the WebSocket and can answer as a Home Assistant persistent notification titled "Hermes Agent". Cron can deliver with `deliver=homeassistant[:target]` through `notify.notify`, without a running gateway.
2. Toolset `homeassistant`: `ha_list_entities`, `ha_get_state`, `ha_list_services`, `ha_call_service`.

The four tools appear only when `HASS_TOKEN` is set.

## Setup that the README actually requires

Create a long-lived access token in your Home Assistant profile. Put it in `~/.hermes/.env`:

```bash
HASS_TOKEN=your-long-lived-access-token
# optional, default http://homeassistant.local:8123
HASS_URL=http://192.168.1.100:8123
# optional default notify target
HASS_HOME_CHANNEL=mobile_app_my_phone
```

By default, no events are forwarded. Set at least one of `watch_domains`, `watch_entities`, or `watch_all` under `platforms.homeassistant.extra`. Otherwise the README says a warning is logged and every state change is dropped. `watch_all` defaults to false. `cooldown_seconds` defaults to 30.

## The refusal list

`ha_call_service` refuses domains that can run code on the Home Assistant host or send requests from that host. The README's list is `shell_command`, `command_line`, `python_script`, `pyscript`, `hassio`, and `rest_command`. Home Assistant has no service-level access control, so that blocklist is the guard the plugin ships. Domain and service names must match `^[a-z][a-z0-9_]*$`.

The plugin talks only to the Home Assistant URL you set, over REST and WebSocket, using your token. The README says it stores no state and sends no telemetry.

## Sources

- README: https://github.com/NousResearch/hermes-homeassistant
- Docs: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/homeassistant
- Docs commit, October 3, 2026: https://github.com/NousResearch/hermes-agent/commit/0f7a95f1
