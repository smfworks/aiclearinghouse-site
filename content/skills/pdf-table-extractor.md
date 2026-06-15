---
slug: pdf-table-extractor
title: PDF Table Extractor
excerpt: Extract tables from PDFs into structured CSV or JSON.
category: Data
tags:
- hermes
- pdf
- extraction
for: Hermes Agent
author: Community
install: hermes skill install pdf-table-extractor
dependencies:
- Hermes Agent
- PDF files
- 'Optional: pdfplumber or Camelot'
image: /images/skills/data.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 53
last_verified: 2026-06-15
---


# PDF Table Extractor

Extract tables from PDFs into structured CSV or JSON.

## What it is

This skill gives your agent a structured way to handle pdf table extractor tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- PDF files
- Optional: pdfplumber or Camelot

## How to install

```bash
hermes skill install pdf-table-extractor
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
