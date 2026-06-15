---
slug: telegram-gateway
title: Telegram Gateway
excerpt: Run your Hermes agent as a Telegram bot with group and DM support.
category: Communication
tags:
  - hermes
  - telegram
  - gateway
for: Hermes Agent
author: Nous Research
install: hermes gateway setup telegram
dependencies:
- Hermes Agent
- Telegram Bot token
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/telegram
order: 40
last_verified: 2026-06-15
---

# Telegram Gateway

Run your Hermes agent as a Telegram bot with group and DM support.

## What it is

This skill gives your agent a structured way to handle telegram gateway tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Telegram Bot token

## How to install

```bash
hermes gateway setup telegram
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/telegram)
