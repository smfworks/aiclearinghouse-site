---
slug: context-budget-enforcer
title: Context Budget Enforcer
category: Tooling
excerpt: A skill that enforces per-task context window budgets — tracks token counts, warns on threshold breach, and triggers summarization before quality degrades.
tags:
  - hermes
  - context
  - performance
  - cost
  - agents
for: Hermes Agent
author: SMF Works
install: hermes skill install context-budget-enforcer
dependencies:
  - Hermes Agent
  - Token counting (tiktoken or provider usage headers)
image: /images/skills/tooling.svg
source: https://github.com/smfworks/hermes-skills
order: 111
last_verified: "2026-07-22"
---

# Context Budget Enforcer

## What it is

A Hermes skill that enforces context window budgets per task type. Instead of letting an agent accumulate tool outputs and conversation history until quality degrades, this skill tracks token counts, warns when usage crosses configurable thresholds, and triggers automatic summarization of earlier turns before the budget is exhausted.

## Who it targets

- Agent operators running long multi-step workflows where context creep degrades output quality
- Teams that have experienced the "agent was great for 15 minutes then got worse" pattern
- Anyone who wants to turn context budgeting from a manual discipline into an automated guardrail

## What it does

- **Per-task budget configuration** — set context limits by task type (e.g., code review: 30K, research synthesis: 50K, triage: 8K)
- **Threshold monitoring** — tracks input token counts per turn and compares against the configured budget
- **Early warning** — warns at 70% budget usage so the agent can wind down gracefully
- **Auto-summarization trigger** — at 85% budget, compresses earlier conversation turns into a structured summary
- **Budget logging** — records actual context usage per task for post-run analysis

## Dependencies

- Hermes Agent (for skill loading and execution)
- Token counting via `tiktoken` (Python) or provider usage headers from the API response

## How to install

```bash
hermes skill install context-budget-enforcer
```

Or manually place `SKILL.md` under `~/.hermes/profiles/<name>/skills/tooling/context-budget-enforcer/SKILL.md`.

## Example usage

Configure budgets in the skill's config:

```yaml
task_budgets:
  code-review: 30000
  research-synthesis: 50000
  inbox-triage: 8000
  default: 20000
warn_threshold: 0.70
summarize_threshold: 0.85
```

The skill automatically activates on each agent turn, checks current context usage, and intervenes when thresholds are crossed. No manual intervention needed once configured.

## Limitations

- Token counting is approximate when using provider usage headers — some providers round or batch token counts
- Auto-summarization adds a latency hit at the trigger point (one extra model call to compress history)
- Does not replace manual context hygiene — it is a safety net, not a license to skip lazy-loading practices
- Budget numbers are input-token focused; output token costs are tracked separately via the cost logging tip