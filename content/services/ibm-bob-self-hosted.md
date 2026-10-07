---
slug: ibm-bob-self-hosted
title: "IBM Bob self-hosted"
excerpt: "IBM's announcement says the self-hosted deployment of Bob is generally available. The fetched page does not list a price or an install command."
category: Infrastructure
tags:
  - ibm
  - coding-agent
  - self-hosted
  - air-gap
  - byol
provider: IBM
pricing_model: "Not published"
price: "Not stated on the announcement page"
website: https://www.ibm.com/new/announcements/ibm-bob-expands-to-self-hosted-environments-for-sensitive-and-mission-critical-enterprise-software
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-10-07"
---

# IBM Bob self-hosted

## What it is

IBM's announcement says the self-hosted deployment option for IBM Bob is generally available. The page describes Bob as a development partner for understanding, planning, executing, and validating software work. The new line is where it runs: a customer-managed environment, including air-gapped and hybrid model setups, not only a vendor cloud.

The article prose does not spell out a calendar date. The page's `article:published_time` meta is `2026-10-01`. That meta is the date used here. It is not a sentence in the announcement body.

It also does not show a price, a SKU, or an install command. Do not invent a `docker compose` for it.

## What GA claims

From the announcement, at general availability the self-hosted deployment can:

- Use the core Bob experience the page names: IDE, BobShell, parallel tool calling, agent harness, skills, and modes
- Choose among supported self-hosted, air-gapped, and hybrid model configurations
- Bring an eligible existing model license (BYOL)
- Connect to supported IDE and infrastructure environments
- Add optional Premium Packages for Java modernization, IBM i, and IBM Z, subject to those packages' licensing and deployment rules

Customers source and provide a supported model. The page splits that into two methods.

On premises, the customer installs and manages the model. The page names Poolside Laguna in that list. It also names one other on-prem model. This directory is not covering that other name. Read the announcement if you need the full on-prem list.

For external services, the page names Claude Sonnet 5.0, Claude Opus 4.8, Gemini 3.7 Flash, and OpenAI GPT 5.6 Sol, through an approved private SaaS path. Those names are IBM's supported list, not a ranking.

The page says a future release is planned to add more models and multi-model routing. The same page says statements about future direction are not a commitment to deliver them. Do not budget the routing feature as if it shipped.

## What the page does not give you

- No price
- No install steps, ports, or hardware bill
- No benchmark table
- No calendar date in the article prose. The page meta `article:published_time` is 2026-10-01

The financial-institution sketch on the page is IBM's example. It is not a deployment this directory ran.

## When to use the note

Use it when a team already has a Bob conversation and needs the self-hosted option distinguished from the hosted one. The decision is whether code and build context must stay in a customer-managed environment, and whether a model on IBM's supported list is one you can actually license. If the page does not name your model, do not assume BYOL covers it.

## Sources

- Announcement: https://www.ibm.com/new/announcements/ibm-bob-expands-to-self-hosted-environments-for-sensitive-and-mission-critical-enterprise-software
