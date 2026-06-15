---
slug: cross-channel-context
title: Cross-Channel Context
excerpt: Continue the same conversation across Telegram, Discord, Slack, and email.
category: Communication
tags:
  - hermes
  - gateway
  - continuity
  - messaging
for: Hermes Agent
author: Nous Research
install: hermes gateway setup
dependencies:
  - Hermes Agent
  - Two or more messaging platforms configured
  - Shared user identity across channels
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway
order: 45
last_verified: 2026-06-15
---

# Cross-Channel Context

Talk to your Hermes agent from wherever you are. Start a task on Telegram, follow up from Slack, and receive the final result by email — all within the same thread.

## What it is

A gateway feature that maps users and conversations across messaging platforms so the agent remembers context even when you switch apps. It is especially useful for teams and mobile workflows.

## Who it targets

- Users who move between phone, desktop, and email throughout the day.
- Teams that use multiple chat platforms.
- Anyone who wants an always-on assistant without being locked to one app.

## Dependencies

- Hermes Agent
- Two or more messaging platforms configured
- Shared user identity across channels

## How to install

```bash
hermes gateway setup
```

Then connect Telegram, Discord, Slack, WhatsApp, Signal, or Email.

## Skill source

- [Hermes Agent gateway directory](https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway)
