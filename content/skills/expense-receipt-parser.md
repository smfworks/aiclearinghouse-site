---
slug: expense-receipt-parser
title: Expense Receipt Parser
excerpt: Extract line items, tax, and totals from receipt images or PDFs.
category: Finance
tags:
  - hermes
  - receipts
  - expenses
for: Hermes Agent
author: Community
install: hermes skill install expense-receipt-parser
dependencies:
- Hermes Agent
- Receipt images or PDFs
image: /images/skills/finance.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 90
last_verified: 2026-06-15
---

# Expense Receipt Parser

Extract line items, tax, and totals from receipt images or PDFs.

## What it is

This skill gives your agent a structured way to handle expense receipt parser tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Receipt images or PDFs

## How to install

```bash
hermes skill install expense-receipt-parser
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
