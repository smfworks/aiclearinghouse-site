---
slug: log-anomaly-detector
title: Log Anomaly Detector
excerpt: Summarize logs, detect spikes, and surface error patterns.
category: DevOps
tags:
  - hermes
  - logs
  - monitoring
for: Hermes Agent
author: Community
install: hermes skill install log-anomaly-detector
dependencies:
- Hermes Agent
- Log stream or files
image: /images/skills/devops.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 63
last_verified: 2026-06-15
---

# Log Anomaly Detector

Summarize logs, detect spikes, and surface error patterns.

## What it is

This skill gives your agent a structured way to handle log anomaly detector tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Log stream or files

## How to install

```bash
hermes skill install log-anomaly-detector
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
