---
slug: secret-leak-detector
title: Secret Leak Detector
excerpt: Scan commits and files for API keys, tokens, and passwords.
category: Security
tags:
  - hermes
  - secrets
  - leak
for: Hermes Agent
author: Community
install: hermes skill install secret-leak-detector
dependencies:
- Hermes Agent
- Git repository access
image: /images/skills/security.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 81
last_verified: 2026-06-15
---

# Secret Leak Detector

Scan commits and files for API keys, tokens, and passwords.

## What it is

This skill gives your agent a structured way to handle secret leak detector tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Git repository access

## How to install

```bash
hermes skill install secret-leak-detector
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
