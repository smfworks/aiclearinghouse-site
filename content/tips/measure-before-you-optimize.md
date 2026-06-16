---
slug: measure-before-you-optimize
title: Measure Before You Optimize
category: Cost
excerpt: "Don't swap models, chunkers, or databases on a hunch. Measure first. The bottleneck is rarely where you think it is."
tags:
  - cost
  - benchmarking
  - performance
order: 9
last_verified: 2026-06-16
---

# Measure Before You Optimize

## The trap

Agent builders love to optimize. Swap a cheaper model. Change the chunk size. Try a new vector database. These changes feel productive, but without measurement they are guesses.

## Why measurement comes first

The slow part of your agent workflow might not be the LLM. It might be:
- Network calls to a tool API
- Repeated retrieval of the same chunks
- Inefficient tool loops
- Large input prompts
- Cold starts on local models

Until you measure, you are optimizing a mirror.

## What to measure

| Metric | Why it matters |
|--------|----------------|
| **Latency per task** | End-to-end time, not just model time |
| **Cost per task** | Tokens + tool calls + compute |
| **Success rate** | Did the agent complete the task correctly? |
| **Retry rate** | How often do you have to re-prompt? |
| **Review time** | How long does human validation take? |

## The minimum benchmark

Pick 5–10 representative tasks. Run each one three times. Record latency, cost, and quality. That baseline tells you where to focus.

## Common mispredictions

- "A cheaper model will save money." It might fail more and cost more in retries.
- "A bigger context window will help." It might just make retrieval noisier.
- "Local is cheaper." It might be slower and require expensive hardware.
- "More tools are better." Each tool adds latency and failure surface.

## Quick win

Before your next optimization, write down the one metric you expect to improve and by how much. Measure after the change. Did it happen?
