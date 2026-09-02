---
slug: budget-cache-reads
title: Budget Your Cache Reads, Not Just Your Output
category: Cost
excerpt: Cache-read pricing can dominate long agentic sessions. Track cache-hit economics separately from output-token costs or your agent budget will silently blow up.
tags:
  - cache
  - cost
  - agents
  - long-context
order: 99
last_verified: "2026-09-02"
---

# Budget Your Cache Reads, Not Just Your Output

## The principle

When agents run long sessions — re-reading system prompts, tool schemas, and conversation history on every turn — cache reads can exceed output token costs. Most teams budget for input and output tokens but never separately account for cache reads. That is where the money leaks.

## Why it matters

Claude Fable 5.1 cut cache reads 75% to $0.25/MTok specifically because long agentic sessions were spending most of their budget re-reading cached prefixes. Before the cut, a 1M-context agent session that re-reads a 200K cached prefix on every turn for 50 turns burns 10M cache-read tokens. At Fable 5's $1.00/MTok, that is $10 in cache reads alone — before any output. At Fable 5.1's $0.25/MTok, the same session costs $2.50.

If you are not tracking cache reads as a separate line item, you cannot see this. You will see "input tokens" as a big number and assume it is the model reading new context, when it is actually the cache serving the same prefix repeatedly.

## How to apply it

1. **Separate cache-read costs in your observability.** Most providers report cache-hit and cache-miss tokens separately in their usage responses. Log them as distinct cost categories, not bundled into "input."

2. **Compare cache-read pricing across models before committing.** As of September 2026: Claude Fable 5.1 charges $0.25/MTok for cache reads (0.025x input). Claude Opus 5 charges $0.50/MTok (0.1x input). Qwen3.8-Max-0902 charges $0.17/MTok for explicit cache reads and $0.25/MTok for implicit cache. These differences compound over long sessions.

3. **Structure prompts for cache hits.** Put stable content (system prompts, tool schemas, reference documents) at the beginning of the prompt. Variable content (user messages, recent tool results) goes at the end. This maximizes the cached prefix length.

4. **Use 1-hour cache writes for sessions longer than 5 minutes.** The 1h cache write costs more upfront (e.g., $20/MTok for Fable 5.1 vs $12.50 for 5m), but if the session will span multiple turns over more than 5 minutes, the longer TTL prevents cache evictions that force full re-reads.

5. **Set a cache-read budget alert.** If cache reads exceed 40% of total token cost for a session, investigate whether your prompt structure is preventing cache hits or whether a cheaper model with better cache economics would serve the workload.