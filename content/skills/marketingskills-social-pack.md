---
slug: marketingskills-social-pack
title: Marketing Skills Social Pack
excerpt: Curated social, copy, and content-strategy skills from marketingskills, adapted under SMF brand guardrails.
category: Marketing
tags:
  - marketing
  - social
  - copywriting
  - content-strategy
  - hermes
for: Hermes Agent
author: Community + SMF Works
install: Copy curated skills from coreyhaines31/marketingskills into profile skills/marketing/
dependencies:
  - Hermes Agent
  - SMF product-marketing context
image: /images/skills/marketing.svg
source: https://github.com/coreyhaines31/marketingskills
order: 108
last_verified: "2026-07-13"
---

# Marketing Skills Social Pack

## What it is

A curated subset of marketingskills — social, copywriting, content-strategy, marketing-loops, video, and related craft skills — installed for Hermes CMO and social operators.

## Who it targets

- SMF Works marketing agents
- Research brands that need craft playbooks without SaaS funnel defaults

## What it does

- Hooks, calendars, and repurposing systems
- Content strategy frameworks
- Marketing loop anatomy (draft free, publish held)
- Cross-links to product-marketing context documents

## Dependencies

Must load SMF product-marketing context and brand guardrails first — upstream skills assume SaaS offers and packages.

## How to install

```bash
rsync -a --exclude evals marketingskills/skills/social/ ~/.hermes/profiles/pamela/skills/marketing/social/
```

## Honest limitations

Generic skills invent clients and offers unless policy skills override them. Publish still goes through Postiz or xurl, not the skill pack.
