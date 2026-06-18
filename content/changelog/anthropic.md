---
slug: anthropic
title: Anthropic
excerpt: Recent updates to Anthropic models, Claude Code, and the Claude API.
category: Model / API
tags:
  - Anthropic
  - Claude
  - Claude Opus
  - Claude Sonnet
  - Claude Code
  - changelog
last_updated: 2026-05-28
last_verified: 2026-06-18
---

# Anthropic Changelog

## 2026-05

### Claude Opus 4.8
Released May 28, 2026. Anthropic positions Opus 4.8 as a more effective collaborator than Opus 4.7, with improvements across reasoning, coding, and long-context work. It is available at the same price point as the previous version.

### Claude Sonnet 4.6
Released February 17, 2026. Sonnet 4.6 is a full upgrade across coding, computer use, long-context reasoning, agent planning, knowledge work, and design. For most production workloads, Sonnet remains the sensible default between cost and capability.

### Claude Code updates
Claude Code is now generally available for Claude Pro and Team subscribers. Recent additions include:
- **Checkpoint rollback:** save mid-task states and roll back if the agent drifts.
- **Command preview:** see bash commands before they run.
- **`/cost` command:** estimate token spend before long agent runs.
- **Improved diff rendering** for multi-file edits.

### API and platform
- The Claude Platform now has a consolidated release notes hub covering the API, SDKs, and console.
- Extended context windows for long files and multi-file sessions.
- Better CI integration previews for bash commands.

## What this means for users

Anthropic is iterating on reliability and control more than raw benchmark numbers. Checkpoint rollback and command preview are practical safety features that make Claude Code more trustworthy for production work. If you have not tried Claude Code recently, the GA release is a good reason to revisit it.

## What to watch

- Whether Anthropic releases a smaller, faster model to compete with GPT-4o-class endpoints.
- Pricing pressure as Chinese labs and Google drive down inference costs.
- How Claude Code integrates with enterprise source control and review systems.

Sources: [Anthropic news](https://www.anthropic.com/news), [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
