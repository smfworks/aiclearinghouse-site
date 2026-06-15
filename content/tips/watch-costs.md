---
slug: watch-costs
title: Watch Token Costs
category: Cost
excerpt: A looped agent can burn tokens fast. Set budgets and use cheaper models for iteration.
tags:
  - cost
  - llm
  - budgeting
  - efficiency
order: 4
last_verified: 2026-06-15
---

# Watch Token Costs

## The principle

Agent loops are invisible money fires. A task that looks free can cost $5. A task that looks cheap can cost $50. Cost awareness is part of the operator's job.

## Why it matters

Frontier models charge per token. Agents send context back and forth repeatedly, often with large code files attached. Without a budget, a single debugging session can exceed a restaurant dinner in API spend.

## How to apply it

1. **Set a daily or weekly budget.** Use provider dashboards or tools like Langfuse to track spend.
2. **Use cheaper models first.** Start with a fast, cheap model. Escalate to an expensive one only when needed.
3. **Limit context.** Don't paste entire codebases into every prompt. Send only relevant files.
4. **Cap retries.** A stuck agent can loop forever. Set max iteration counts.
5. **Review weekly.** Look for spikes and patterns. One expensive workflow is worth optimizing.

## Red flags

- You don't know what you spent this week.
- Every task uses the most expensive model by default.
- The agent re-reads the same large files in every turn.
- You are surprised by monthly bills.

## Quick win

Set a $10 daily budget in your LLM provider dashboard and turn on spend alerts. The first alert will teach you more than any article.
