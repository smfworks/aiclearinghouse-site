---
slug: compress-context-as-you-go
title: Compress Context As You Go, Not After It Breaks
category: Performance
excerpt: Summarize resolved sub-tasks and trim verbose tool outputs before the context window fills — waiting until auto-compact triggers means you already lost quality.
tags:
  - context
  - performance
  - compression
  - agents
  - cost
order: 99
last_verified: "2026-07-29"
---

# Compress Context As You Go, Not After It Breaks

## The principle

Most agent frameworks now ship auto-compaction — when the context window hits ~95% capacity, the framework summarizes the conversation and continues. That is a safety net, not a strategy. By the time auto-compact triggers, the model has already been working with a degraded attention budget for many turns. The quality loss happened silently, turns before the trigger fired.

The fix: compress proactively. Replace completed sub-task histories with tight recaps before moving to the next step. Truncate verbose tool outputs to their decision-relevant lines. Drop retrieved chunks below a relevance threshold. Keep the working window under 40% capacity so the model has headroom to reason.

## Why it matters

Context effectiveness degrades as the window fills — not linearly, but with a "lost in the middle" effect where information in the center of a long context gets less attention. An agent that carries 80K tokens of stale conversation history is not just slower and more expensive; it is measurably worse at the task in front of it.

Compression is what lets an agent work on a task longer than its raw context window would otherwise allow. Without it, long-horizon tasks break at the context boundary. With it, the agent can run for hundreds of turns while maintaining quality.

## How to do it

1. **Summarize resolved sub-tasks immediately.** When a sub-task completes, replace its full history in context with a 2–3 sentence recap: what was tried, what worked, what the result was.
2. **Truncate tool outputs.** A `git log` that returns 500 lines? Keep the 5 that matter. A test run with 200 lines of output? Keep the pass/fail summary and any failures.
3. **Drop low-relevance retrieval.** If your RAG pipeline returned 10 chunks and 3 are clearly relevant, drop the other 7 before they enter context. Set a relevance threshold.
4. **Cap retrieval candidates.** Limit how many chunks each retrieval call can contribute to context — 3–5 is usually enough.
5. **Keep headroom.** Target under 40% capacity. Headroom is not waste; it is working space for the model to reason.

## When to compress

- After every completed sub-task in a multi-step workflow
- After any tool call that returns more than ~500 tokens of output
- Before starting a new sub-task that will add its own context
- When you notice the agent repeating itself or losing track of earlier decisions

## The anti-pattern

Do not wait for auto-compact. Do not assume a 200K context window means you can carry 190K of history. Do not stuff context with "just in case" information — it dilutes attention and degrades every subsequent turn.