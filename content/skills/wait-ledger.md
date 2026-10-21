---
slug: wait-ledger
title: Count how long Hermes waited on you
category: Workflow
excerpt: "wait-ledger records approval, clarify, and password waits locally. /waits shows counts and durations. It cannot answer a prompt. The v0.22.2 catalog card is the source. This directory did not install it."
tags:
  - hermes
  - plugins
  - approvals
  - observability
for: Hermes Agent
author: Community
install: hermes plugins install wait-ledger
dependencies:
  - Hermes Agent >= 0.21.6
image: /images/skills/tooling.svg
source: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/wait-ledger.yaml
order: 125
last_verified: "2026-10-21"
---

# Count how long Hermes waited on you

## What it is

`wait-ledger` is a catalog plugin that keeps a local log of the times Hermes stopped to wait. The kinds named on the card are approval prompts, clarify questions, and password prompts.

It is not `hermes skill install wait-ledger`. The catalog README at tag v0.22.2 says the install command is `hermes plugins install <name>`.

The YAML fetched from that tag says the repo is `https://github.com/olric3015/hermes-plugins`, the pin is `c44b60aa6a6621147ce5b3168b7841bf1f8ac006`, and the plugin lives in the `wait-ledger` subdirectory. Version `1.0.0`. Maintainer olric3015. It requires Hermes `>=0.21.6`. Hooks on the card: `on_human_input_request` and `on_human_input_resolved`. No tools. No required env vars.

The v0.22.2 notes list both "add the wait-ledger catalog card" and "add wait-ledger" in the 0.22 line since v0.22.0. This directory did not install it and did not run `/waits`.

## Who it targets

Someone who wants a count of how often a Hermes session stopped for a person, and how long those stops lasted, without sending that log off the machine. If you need the prompt text or the answer, this plugin is the wrong row. The card says it does not store those.

## What the card says it records

`/waits` shows how many waits there were, how many were answered or left unanswered, and how long Hermes stood still in total, typically, and at most. You can split that by kind of prompt, by platform, or by day. The windows on the card are the last 24 hours, any number of hours or days, the latest session, or everything recorded.

`/waits recent` lists the newest waits. Ten is the default. You can ask for up to 100, and the card's example is `/waits recent 50`.

The file is `plugin-data/wait-ledger/waits.jsonl`. Fields named on the card: session id, platform, kind of prompt, how it ended, wait time. Not stored: prompt text, answer, session key. The file is trimmed to 5,000 rows once it passes 2 MB.

The card says it is an observer. It cannot answer, delay, or change a prompt. It says no network.

## How to install

1. Check that Hermes is at least 0.21.6 before you install. That floor is the YAML. This card did not run a version command.
2. Install with `hermes plugins install wait-ledger`. The catalog README says the install checks out the pinned commit. The YAML also sets `subdir: wait-ledger`, so the plugin is not the root of that repo.
3. Use a session that actually stops for approval or a clarify question. Then run `/waits`. If the command is missing, the plugin is not loaded. Do not invent a dashboard URL. The card does not name one.
4. Read `/waits recent` when you want the latest rows, not a second product. The cap on that list is 100.

## Honest limits

- No prompt text. A long wait tells you that Hermes stopped. It does not tell you what it asked.
- Observer only. It will not approve a tool call for you, and it will not slow one down.
- Local file, trimmed. After the trim, older rows are gone. The card says 5,000 rows past 2 MB. It does not say the trim keeps a backup.
- This directory did not open the upstream tree beyond the catalog YAML and did not confirm the screenshot URL on the card. The image line is not a measurement.
- A password prompt is a kind of wait the card says it can log. The card says it does not store the answer. Do not add a wrapper that does.

## Sources

- Catalog file: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/wait-ledger.yaml
- Catalog install rule: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/README.md
- Release notes: https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.2
