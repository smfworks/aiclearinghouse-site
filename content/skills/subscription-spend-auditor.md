---
slug: subscription-spend-auditor
title: Subscription Spend Auditor
excerpt: Find unused or duplicate SaaS subscriptions across billing sources.
category: Finance
tags:
  - hermes
  - subscriptions
  - spend
for: Hermes Agent
author: Community
install: hermes skill install subscription-spend-auditor
dependencies:
- Hermes Agent
- Billing emails or CSV export
image: /images/skills/finance.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 94
last_verified: 2026-06-15
---

# Subscription Spend Auditor

Find unused or duplicate SaaS subscriptions across billing sources.

## What it is

This skill gives your agent a structured way to handle subscription spend auditor tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Billing emails or CSV export

## How to install

```bash
hermes skill install subscription-spend-auditor
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
