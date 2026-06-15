---
slug: competitive-intelligence-tracker
title: Competitive Intelligence Tracker
excerpt: Watch competitor websites, press releases, and changelogs for strategic signals.
category: Research
tags:
  - hermes
  - competitive-intelligence
  - monitoring
  - business
for: Hermes Agent
author: Community
install: hermes skill install competitive-intelligence-tracker
dependencies:
  - Hermes Agent
  - Web fetch or Firecrawl access
  - Cron scheduler enabled
image: /images/skills/research.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 13
last_verified: 2026-06-15
---

# Competitive Intelligence Tracker

Keep tabs on competitors without manual browsing. This skill periodically checks target websites, blogs, and changelog feeds, then diffs the results and flags what changed.

## What it is

A scheduled monitoring skill that scrapes or fetches competitor pages, detects changes, and summarizes strategic signals such as pricing updates, feature launches, hiring posts, and partnerships.

## Who it targets

- Founders and product managers.
- Sales teams preparing for competitive calls.
- Investors tracking portfolio companies.

## Dependencies

- Hermes Agent
- Web fetch tool or Firecrawl API key
- Cron scheduler enabled

## How to install

```bash
hermes skill install competitive-intelligence-tracker
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
