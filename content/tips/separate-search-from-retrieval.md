---
slug: separate-search-from-retrieval
title: Separate Search from Retrieval in Agent Tool Design
category: Workflow
excerpt: When agents call a single "search" tool that both finds and fetches, they burn context on irrelevant results. Split into a cheap search call and a targeted fetch call to cut token waste by 60-80%.
tags:
  - agents
  - tools
  - rag
  - context
  - token-optimization
order: 101
last_verified: "2026-09-02"
---

# Separate Search from Retrieval in Agent Tool Design

## The principle

When an agent needs to find information in a codebase, document store, or knowledge base, the natural tool design is a single `search(query)` that returns full results — file contents, document text, code snippets. This is wrong. It conflates two distinct operations: finding what is relevant, and fetching what is relevant. Separating them into two tools — a cheap `search` that returns metadata only, and a `fetch` that retrieves full content by ID — cuts context consumption by 60-80% in practice.

## Why it matters

A single `search(query)` tool that returns full content forces the agent to accept whatever the search returns. If the search returns 10 results at 2,000 tokens each, that is 20,000 tokens consumed — regardless of whether the agent needed all 10, or only the 3rd result. The agent cannot preview results and selectively fetch.

This pattern compounds in multi-step agent workflows. A research agent making 5 search calls in a session can easily consume 100,000+ tokens in search results alone — most of which are irrelevant. The agent reads the first result, determines it is not what it needs, and searches again. Each search dumps another 20,000 tokens into context.

The separated pattern looks like this:

1. Agent calls `search(query)` → gets back a list of IDs, titles, and one-line excerpts (200-500 tokens total)
2. Agent evaluates the list, picks the 1-3 most relevant results
3. Agent calls `fetch(id)` for each → gets full content (only what it needs)

Total context for the same task: 500 tokens (search) + 6,000 tokens (3 fetches) = 6,500 tokens. Versus 20,000+ for the unified pattern. That is a 67% reduction for a single search cycle, and it compounds across multi-step workflows.

## How to apply it

1. **Audit your current agent tools.** Look for any tool that returns large payloads — file contents, search results, API responses. Count the average tokens per call. If a single call can return more than 2,000 tokens, it is a candidate for splitting.

2. **Split into search + fetch.** Design two tools:
   - `search(query, limit)` → returns `[{id, title, excerpt, score}]` where excerpt is 1-2 sentences, not full content
   - `fetch(id)` → returns the full content for a single resource by ID

3. **Make search cheap and fast.** The search call should be sub-100ms if possible. It is a filtering step, not a retrieval step. Use BM25 or vector search for ranking, return only metadata.

4. **Let the agent decide what to fetch.** The agent's reasoning over the search results — "result 3 looks most relevant because it mentions token budgeting" — is where the value is. This is the step the unified pattern skips.

5. **Set a fetch limit.** Allow the agent to fetch at most N results per search call (3-5 is reasonable). This prevents the failure mode where the agent fetches everything because it can.

6. **Log search vs fetch separately.** In your observability stack, track how many search results the agent saw vs how many it fetched. The ratio tells you whether your search ranking is good — if the agent always fetches result #1, your ranking is working. If it fetches #3 and #7, your ranking needs work.

## Red flags

- Your agent's context fills up before it finishes the task, and the context breakdown shows search results as the largest contributor
- The agent searches, reads one result, searches again with a different query — it is treating search as a full-retrieval step and discarding most of each result
- Your search tool returns more than 2,000 tokens per call on average
- You have a `search` tool but no `fetch` tool — the agent has no way to selectively retrieve

## Quick win

Today, take your highest-token agent tool and measure its average response size. If it returns more than 2,000 tokens, split it into `search` (metadata only) and `fetch` (full content by ID). Re-run the same task and compare total token consumption. In our experience, the split pays for itself within the first session — the agent makes more tool calls but consumes fewer total tokens because it fetches only what it needs.