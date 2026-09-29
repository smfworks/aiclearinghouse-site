---
slug: tag-cost-at-request-time
title: Tag Every Request for Trace-Level Cost Attribution
category: Cost
excerpt: The provider invoice tells you spend went up, not which feature, prompt change, or agent run caused it. Tag at request time or accept a slow investigation every time the bill spikes.
tags:
  - cost
  - observability
  - attribution
  - production
order: 99
last_verified: "2026-09-27"
---

# Tag Every Request for Trace-Level Cost Attribution

## The problem

LLM cost tracking breaks when the provider invoice is the only source of truth. The invoice can show that spending increased, but it cannot explain which customer, feature, prompt change, retry pattern, or agent run caused the increase. The result is a slow investigation across logs, dashboards, and product context every time the bill spikes.

## The fix

Tag every LLM request at call time with structured metadata — `feature`, `deployment`, `prompt_version`, `model`, `user_id`, `agent_run_id` — so when costs move, you can drill from the invoice down to the exact requests responsible without crossing between systems.

## Cardinality rules

Not all tags are created equal. Split them by cardinality:

**Low-cardinality (safe to alert on and chart as separate series):**
- `feature` — which product surface made the call
- `deployment` — which environment (prod, staging, canary)
- `prompt_version` — which prompt template version
- `model` — which model handled the request

**High-cardinality (safe to store and filter on, but don't chart as separate series):**
- `user_id` — charting a series per user makes dashboards unusable
- `agent_run_id` — filter and drill into individual runs in the trace view

The practical pattern: alert on the cross-product of `feature` × `deployment` × `model`, then drill into individual users or agent runs in the trace view when a spike appears.

## Why this matters for agents

Agent workloads amplify the attribution problem. A single agent run can make dozens of LLM calls across multiple models, tools, and subagents. Without per-request tags, you cannot answer "which agent run cost $47?" — you can only see that $47 was spent. In production agent systems, where a looping agent can cost hundreds in hours, that gap turns into real money lost to investigation time.

## Context bloat detection

Tagging also catches a silent cost driver: context bloat. A longer system prompt, additional retrieved context, or a larger prompt template increases input token counts across all sessions. Each change looks small when it ships, but average cost per feature request moves long before total spend becomes a billing problem. With `prompt_version` tagged, you can see exactly which version introduced the cost shift.

## Implementation

Most LLM providers and gateway products (Helicone, Langfuse, Portkey, Braintrust) support request-level metadata. The work is not building the tagging system — it's the discipline of tagging every call, including the ones from background agents, cron jobs, and retry paths that engineers tend to forget.