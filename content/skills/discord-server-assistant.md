---
slug: discord-server-assistant
title: Discord Server Assistant
excerpt: Answer questions, moderate channels, and run commands from Discord.
category: Communication
tags:
  - hermes
  - discord
  - gateway
for: Hermes Agent
author: Community
install: hermes gateway setup discord
dependencies:
- Hermes Agent
- Discord bot token
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/discord
order: 41
last_verified: 2026-06-15
---

# Discord Server Assistant

Answer questions, moderate channels, and run commands from Discord.

## What it is

This skill gives your agent a structured way to handle discord server assistant tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Discord bot token

## How to install

```bash
hermes gateway setup discord
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/discord)
