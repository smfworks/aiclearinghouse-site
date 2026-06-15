---
slug: csv-data-cleaner
title: CSV Data Cleaner
excerpt: Fix formatting, deduplicate rows, and infer schemas from messy CSVs.
category: Data
tags:
  - hermes
  - csv
  - cleaning
for: Hermes Agent
author: Community
install: hermes skill install csv-data-cleaner
dependencies:
- Hermes Agent
- CSV files
image: /images/skills/data.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 50
last_verified: 2026-06-15
---

# CSV Data Cleaner

Fix formatting, deduplicate rows, and infer schemas from messy CSVs.

## What it is

This skill gives your agent a structured way to handle csv data cleaner tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- CSV files

## How to install

```bash
hermes skill install csv-data-cleaner
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
