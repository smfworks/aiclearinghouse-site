---
slug: hermes-skill-bundles
title: Hermes Skill Bundles
category: Workflow
excerpt: Load multiple Hermes Agent skills at once with a single slash command — define named groups like /writing-day to activate several skills for the session in one step.
tags:
  - hermes
  - skills
  - workflow
  - productivity
  - configuration
for: Hermes Agent
author: Nous Research
install: Built into Hermes Agent v0.21.4+ (September 2026)
dependencies:
  - Hermes Agent
  - Python 3.11+
image: /images/skills/workflow.svg
source: https://hermes-agent.nousresearch.com/docs
order: 99
last_verified: "2026-09-27"
---

# Hermes Skill Bundles

## What it is

Skill bundles are a Hermes Agent feature that lets you define a named group of skills and load them all at once with a single slash command. Instead of activating skills one by one at session start, you create a bundle — say, your "writing day" set — and invoke it with `/writing-day` to activate all four skills for the session simultaneously.

The feature shipped as part of Hermes Agent's September 2026 updates alongside the v0.21.4 release (tag v2026.9.21), which rolled up roughly 1,800 merged pull requests.

## Who it targets

- Power users who always activate the same set of skills for a particular workflow
- Teams standardizing on a shared skill configuration across members
- Anyone who finds themselves manually loading 3+ skills at the start of every session

## What it does

- **Named skill groups:** Define a bundle with a name and a list of skills to include
- **One-command activation:** `/<bundle-name>` loads all skills in the bundle for the current session
- **Composable:** Bundles can mix bundled and optional skills (e.g., humanizer + ideation + obsidian + youtube-content)
- **Skills Hub integration:** The Skills Hub now includes health checks, a freshness badge, and a watchdog cron to monitor bundle integrity

## How to use it

1. Define a skill bundle in your Hermes configuration, naming the skills to include
2. Start a Hermes session
3. Type `/<bundle-name>` (e.g., `/writing-day`) to activate all skills in the bundle
4. All bundled skills are loaded into the session prompt at once

## Why it matters

Before skill bundles, you relied on either the agent auto-detecting relevant skills or manually invoking each one. For users with consistent workflows — a coding setup, a research setup, a content-creation setup — this means one command instead of four or five. Combined with the v0.21.4 skills auto-load setting (which pins chosen skills into every session's prompt unconditionally), bundles give you both unconditional always-on skills and on-demand workflow groups.

## Limitations

- Available in Hermes Agent v0.21.4+ — earlier versions do not support bundles
- Too many skills in a bundle can inflate the session prompt; be selective
- Bundles are a configuration feature, not a skill marketplace — you define them yourself
- No built-in sharing mechanism for bundle definitions across users (share via config files)