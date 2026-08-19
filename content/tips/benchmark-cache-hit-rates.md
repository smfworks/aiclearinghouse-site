---
slug: benchmark-cache-hit-rates
title: Benchmark Cache-Hit Rates, Not Just List Prices
category: Performance
excerpt: A model with 90% cache-hit discounting can be cheaper than a model with half the list price — but only if your workload actually hits the cache.
tags:
  - pricing
  - cache
  - cost
  - coding-agents
  - evaluation
order: 29
last_verified: "2026-08-19"
---

# Benchmark Cache-Hit Rates, Not Just List Prices

## The principle

List price per million tokens is the wrong number to compare when your agent resends the same context every turn. Providers like Moonshot (Kimi K3), Anthropic, and OpenAI all offer prompt caching with steep discounts — Kimi K3 charges $0.30/M for cache-hit input vs $3.00/M for cache-miss, a 90% discount. But the discount only matters if your workload actually hits the cache.

## Why it matters

Coding agents are the canonical case. Every turn, the agent resends the system prompt, the repository context, the conversation history, and the current file contents. If the provider caches that prefix, you pay the discounted rate on 90%+ of input tokens. If it does not — because your agent rewrites context, the provider evicts the cache, or your prefix is unstable — you pay full price on every token.

A model at $3/M input with a 90% cache-hit rate on a coding workload effectively costs $0.30/M for most input tokens. A model at $1.50/M with no caching costs $1.50/M for every input token. The "cheaper" model is 5x more expensive in practice.

## How to apply it

1. **Measure your actual cache-hit rate.** Run 50 representative agent turns through each provider. Log cache-hit vs cache-miss token counts from the API response (most providers expose this in usage metadata).
2. **Calculate effective input cost.** `(cache_miss_tokens × list_price + cache_hit_tokens × cache_price) / total_tokens`. This is your real per-million input cost, not the list price.
3. **Test prefix stability.** If your agent prepends timestamps, random IDs, or changing system prompts to every request, the cache will miss every time. Fix your prompt structure to keep prefixes stable.
4. **Compare total task cost, not per-token cost.** A model that uses fewer tokens per task but has a higher list price can still be cheaper overall. Run the same 50 tasks on each model and compare total cost.
5. **Check provider cache TTLs.** Some providers evict cache after 5 minutes of inactivity. If your agent has long thinking pauses, you may miss the cache window.

## Red flags

- You are comparing models on list price alone and ignoring cache pricing.
- Your agent prepends changing content (timestamps, UUIDs) to every request, defeating the cache.
- You assume the provider's published cache-hit rate (e.g., Moonshot's ">90% for coding") applies to your workload without measuring.
- You have never checked your API response usage metadata for cache-hit fields.

## Quick win

Pull your last 100 agent API calls from your observability tool (Langfuse, Helicone, or raw logs). Check how many input tokens were served from cache vs full price. If the ratio is below 70% and you are on a provider with cache pricing, you are leaving money on the table — and the fix is usually prompt structure, not a model swap.