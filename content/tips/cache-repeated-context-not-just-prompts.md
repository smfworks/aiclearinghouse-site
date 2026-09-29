---
slug: cache-repeated-context-not-just-prompts
title: Cache Your Repeated Context, Not Just Your Prompts
category: Performance
excerpt: "Prompt caching saves 50-90% on input tokens for repeated context. Most teams cache system prompts but forget the big wins: tool schemas, knowledge base excerpts, and few-shot examples."
tags:
  - caching
  - cost
  - performance
  - prompting
  - api
order: 103
last_verified: "2026-09-16"
---

# Cache Your Repeated Context, Not Just Your Prompts

## The principle

Prompt caching is the single highest-ROI cost optimization for agent workloads. Most providers now support it: OpenAI, Anthropic, GLM, DeepSeek, and others offer 50-90% discounts on cached input tokens. The catch is that caching only applies to identical prefix sequences — change one token and the cache misses.

Most teams cache their system prompt and stop there. That is the obvious win, but it is usually the smallest one. The real savings come from caching the large, stable context blocks that sit between your system prompt and the user's actual query: tool definitions, RAG document excerpts, few-shot examples, and agent skill instructions.

## Why it matters

A typical agent request looks like this:

- System prompt: ~500 tokens (cached, saved 90%)
- Tool schemas: ~3,000 tokens (often not cached — different tools loaded per request)
- RAG context: ~5,000 tokens (almost never cached — different chunks per query)
- Few-shot examples: ~2,000 tokens (sometimes cached, sometimes not)
- User message + conversation: ~1,000 tokens (never cached)

The system prompt is 500 tokens out of ~11,500 total. Caching it saves ~450 tokens at 90% discount. But the tool schemas and RAG context are 8,000 tokens. If those are stable across requests and you cache them, you save ~7,200 tokens at 90% — 16x more than the system prompt alone.

On GLM-5.2 at $1.40/MTok input, cached input drops to $0.14/MTok (90% discount). For an agent making 100K requests/day with 8,000 tokens of cacheable context, that is $1,120/day down to $112/day. The system prompt caching alone would have saved $63/day. The difference is an order of magnitude.

## How to apply it

1. **Map your request structure.** Break down a typical request into: system prompt, tool schemas, RAG/context, few-shot examples, conversation history, user message. Measure token counts for each block.
2. **Identify stable blocks.** Which blocks are identical across requests? System prompts are. Tool schemas often are — if you load the same tools every time. RAG context is stable if you cache the same document set. Few-shot examples are stable if you use the same ones.
3. **Order blocks by stability, most stable first.** Cache hits require a matching prefix. Put your most stable content at the top of the request, followed by progressively more dynamic content. The typical order: system prompt > tool schemas > few-shot examples > RAG context > conversation history > user message.
4. **Keep tool schemas stable.** If you dynamically load different tools per request, the tool schema block changes and the cache misses. If most requests use the same tool set, load all of them every time — the caching savings on the stable prefix outweigh the token cost of unused tool definitions.
5. **Cache RAG document sets, not per-query chunks.** If you retrieve the same top-K documents for a session, include them as a stable block. If each query retrieves different chunks, you cannot cache them — but you can cache the document set and append only the query-specific chunks after it.
6. **Measure cache hit rates.** Most providers report cache hit/miss in their API response. Track this. If your hit rate is below 80% on your stable blocks, something in your prefix is changing when it should not be.

## Red flags

- You enabled prompt caching for your system prompt but not your tool schemas.
- Your tool set changes per request, breaking the cache on a 3,000-token block.
- You include timestamps, request IDs, or other dynamic values in the first 500 tokens.
- You do not know your cache hit rate because you are not tracking it.
- Your RAG context is inserted before your tool schemas, forcing a cache miss on tools whenever the RAG chunks change.
- You are paying full input price on 10K+ tokens of stable context that could be cached.

## Quick win

Log your last 100 agent requests. For each one, identify the longest stable prefix — the portion that is byte-for-byte identical across all 100 requests. That prefix is your caching candidate. If it is more than 2,000 tokens and you are not caching it, you are leaving money on the table. Reorder your request to put that prefix first, ensure no dynamic content precedes it, and measure the cost difference next week.