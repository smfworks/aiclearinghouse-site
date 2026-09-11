---
slug: hermes-blueprint-automation
title: "Hermes Blueprint Automation"
category: Automation
excerpt: "Turn any Hermes skill into a shareable, scheduled automation — a blueprint declares a cron schedule in its frontmatter and flows through the full skills pipeline (search, install, security scan, publish) with nothing new to learn."
tags:
  - hermes
  - automation
  - cron
  - scheduling
  - blueprints
for: Hermes Agent
author: Nous Research
install: "Built into Hermes Agent (no install required)"
dependencies:
  - Hermes Agent (current version)
image: /images/skills/automation.svg
source: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
order: 99
last_verified: "2026-09-09"
---

# Hermes Blueprint Automation

## Overview

A **blueprint** in Hermes Agent is an ordinary skill that additionally declares a schedule in its `SKILL.md` frontmatter. Because a blueprint is still a skill, it flows through the entire skills pipeline unchanged — search, inspect, install, security scan, provenance, taps, the centralized index, and `hermes skills publish` for sharing. Nothing new to learn.

This lets you take a workflow you have already captured as a skill and make it runnable on a schedule, then export and share it so others can install it with one command.

## How it works

Add a `metadata.hermes.blueprint` block to any skill's frontmatter:

```yaml
metadata:
  hermes:
    tags: [blueprint, email]
    blueprint:
      schedule: "0 8 * * *"        # cron expression / "every 2h" / ISO timestamp
      deliver: telegram             # optional (default: origin)
      prompt: "Summarize my unread email and today's calendar."
      no_agent: false               # optional
```

The presence of the `blueprint:` block is what marks the skill as a runnable automation.

## Installing a blueprint

Installing a skill that carries a `blueprint:` block does **not** silently create a recurring job. Hermes registers it as a *suggested* cron job instead. Scheduling is opt-in — installing never schedules anything automatically. You review and accept it via `/suggestions`:

```
/suggestions
```

This keeps automations explicit and prevents an installed skill from surprising you with background runs.

## Sharing an automation you built

A blueprint loaded by a cron job (`hermes cron create --skill ...`) can be exported back to a `SKILL.md` and published like any other skill, so an automation you tuned for yourself becomes a one-command install for someone else:

```bash
# Publish to the Skills Hub
hermes skills publish skills/my-skill --to github --repo owner/repo

# Or publish to a custom tap
hermes skills tap add owner/repo
```

## Schedule formats

The `schedule` field accepts:

- **Cron expression**: `"0 8 * * *"` (every day at 8 AM)
- **Interval shorthand**: `"every 2h"`
- **ISO timestamp**: a one-shot run at a specific time

## Delivery options

The `deliver` field controls where the automation's output goes:

- `origin` (default) — delivered back to the originating session/channel
- `telegram` — delivered via Telegram
- Other configured delivery targets

## Use cases

- **Daily digest**: "Summarize my unread email and today's calendar" at 8 AM
- **Weekly content publish**: run a publishing routine every Wednesday
- **Periodic monitoring**: check a service or dashboard every 2 hours and alert on anomalies
- **One-shot future task**: schedule a single run at a specific ISO timestamp

## Limitations

- **Opt-in scheduling**: installing a blueprint never auto-schedules — you must accept it via `/suggestions`. This is a safety feature, not a bug.
- **Requires Hermes Agent**: blueprints are a Hermes-specific feature; the skill text itself is portable but the scheduling runtime is not.
- **Environment variables**: if the blueprint needs API keys, declare them via `required_environment_variables` so they are prompted for and passed through to sandboxed execution.

## Related

- [Hermes Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Creating Skills](https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills)