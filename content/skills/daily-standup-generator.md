---
slug: daily-standup-generator
title: Daily Standup Generator
excerpt: Read commits, tickets, and calendar events to draft a daily update.
category: Productivity
tags:
- hermes
- standup
- agile
for: Hermes Agent
author: Community
install: hermes skill install daily-standup-generator
dependencies:
- Hermes Agent
- Git and Linear/GitHub access
- 'Optional: calendar integration'
image: /images/skills/productivity.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 30
last_verified: 2026-06-15
---


# Daily Standup Generator

Read commits, tickets, and calendar events to draft a daily update.

## What it is

This skill gives your agent a structured way to handle daily standup generator tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Git and Linear/GitHub access
- Optional: calendar integration

## How to install

```bash
hermes skill install daily-standup-generator
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
