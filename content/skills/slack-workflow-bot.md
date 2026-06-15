---
slug: slack-workflow-bot
title: Slack Workflow Bot
excerpt: Integrate Hermes into Slack channels for Q&A, approvals, and alerts.
category: Communication
tags:
  - hermes
  - slack
  - gateway
for: Hermes Agent
author: Community
install: hermes gateway setup slack
dependencies:
- Hermes Agent
- Slack app token
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/slack
order: 42
last_verified: 2026-06-15
---

# Slack Workflow Bot

Integrate Hermes into Slack channels for Q&A, approvals, and alerts.

## What it is

This skill gives your agent a structured way to handle slack workflow bot tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Slack app token

## How to install

```bash
hermes gateway setup slack
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/slack)
