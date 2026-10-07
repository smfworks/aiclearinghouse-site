---
slug: hermes-plugin-catalog
title: Hermes plugin catalog install
category: Workflow
excerpt: Catalog installs use hermes plugins install, stay disabled until you enable them, and do not auto-run from a hermes:// link. Home Assistant moved onto this path on October 3, 2026.
tags:
  - hermes
  - plugins
  - install
  - consent
for: Hermes Agent
author: Nous Research
install: hermes plugins search <term>
dependencies:
  - Hermes Agent
image: /images/skills/tooling.svg
source: https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins
order: 99
last_verified: "2026-10-07"
---

# Hermes plugin catalog install

## What it is

A catalog plugin is not a skill file under `~/.hermes/skills/`. The install command is `hermes plugins`, not `hermes skills`.

The plugins guide fetched this run says a bare name resolves to a reviewed pin in the Hermes plugin catalog. Search, then install:

```bash
hermes plugins search telegram
hermes plugins install homeassistant
```

`homeassistant` is the concrete case from this week. The docs commit `0f7a95f1` on October 3, 2026 moved that integration out of core and onto the catalog. The same install shape is what the guide documents for other catalog names. Do not invent a name that `hermes plugins search` does not return.

## What the guide says happens next

General plugins and user-installed backends are disabled by default. Install is not the same as enable. The guide says `hermes plugins install` goes through a consent flow, and that declining leaves declared capabilities off.

A chat link does not skip that. The guide documents:

```text
hermes://plugin/install?catalog=NAME
hermes://plugin/install?repo=owner/repo
```

It also says deep links never auto-install. Agent-plugin installs go through the same `hermes plugins install` consent flow. `enable=1` on a link is still not a silent bypass.

Capabilities you have not granted stay off across an update. The guide says a plugin update cannot silently turn new capabilities on. Check with:

```bash
hermes plugins capabilities
hermes plugins list
```

## Trust, stated plainly

The guide says plugins run as in-process Python. A granted capability is a statement of trust in the author. It is not a code audit, and Hermes has not reviewed the plugin's code. Install from a source you trust. Isolation mode exists in the same guide (`plugins.isolation`). The default described there is not a sandbox that makes an untrusted plugin safe.

If `security.allow_lazy_installs` is off, the Home Assistant docs say the automatic first-start install is skipped and you install the plugin yourself.

## When to use it

Use the catalog command when the thing you want used to be "just in Hermes" and the current docs call it a plugin. Use `hermes skills` only when the artifact is a skill. Mixing the two commands is how a profile ends up with neither.

## Sources

- Plugins guide: https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins
- Home Assistant move, October 3, 2026: https://github.com/NousResearch/hermes-agent/commit/0f7a95f1
