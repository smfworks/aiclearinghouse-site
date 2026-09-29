---
slug: route-by-token-shape-not-just-difficulty
title: Route by Token Shape, Not Just Task Difficulty
category: Cost
excerpt: "The lopsided input-to-output ratio of real agentic workloads — 400K tokens in, 1.5K out — should drive your model routing, not just 'is this hard?'"
tags:
  - routing
  - cost
  - architecture
  - agentic
  - kv-cache
order: 99
last_verified: "2026-09-16"
---

# Route by Token Shape, Not Just Task Difficulty

## The principle

Most model routing strategies ask one question: "Is this task hard?" If yes, route to the frontier model. If no, route to the cheap model. That question misses something that matters more in 2026 agentic workloads: **the shape of the token flow**.

Real agentic tasks are deeply lopsided. A coding agent reads a 400K-token repository and produces a 1.5K-token patch. A research agent ingests 50K tokens of search results and writes a 2K-token summary. The input dwarfs the output by 100x or more. This shape — not just difficulty — determines cost, latency, and KV cache pressure.

## Why it matters

DeepSeek-V4.1-Flash's Causal Encoder-Decoder architecture is purpose-built for exactly this pattern. It processes the prompt once with a dedicated encoder (8B active params) and generates output with a smaller decoder (16B active). The result: KV cache storage at a quarter of HBM and an eighth of SSD, with input pricing at $0.003/M tokens off-peak.

If you route a 400K-in / 1.5K-out task to a traditional decoder-only model, you pay full price for KV cache on the entire input. If you route it to a CED-style model, you pay a fraction. The difficulty of the task may be identical; the cost is not.

## How to apply it

### 1. Measure your token shapes

Log the input-to-output ratio for your agent's common tasks:

```python
# In your routing layer
token_shape = {
    "input_tokens": response.usage.prompt_tokens,
    "output_tokens": response.usage.completion_tokens,
    "ratio": response.usage.prompt_tokens / max(response.usage.completion_tokens, 1)
}
logger.info(f"[{trace_id}] Token shape: {token_shape}")
```

### 2. Classify tasks by shape, not just difficulty

| Shape | Characteristic | Best model type |
|-------|---------------|-----------------|
| High-input / low-output (100:1+) | Repository analysis, document Q&A, long-context research | CED-style models (DeepSeek V4.1-Flash), KV-cache-optimized |
| Balanced (10:1 to 1:1) | Conversation, brainstorming, drafting | Standard decoder-only models |
| Low-input / high-output | Creative generation, code from scratch | Output-optimized models |
| High-difficulty + any shape | Complex reasoning, multi-step tool use | Frontier models regardless of shape |

### 3. Add shape to your routing policy

```python
def route_model(task_difficulty, token_ratio):
    if task_difficulty == "frontier":
        return "claude-opus-5"
    if token_ratio > 50:  # High-input, low-output
        return "deepseek-flash"  # CED architecture
    if token_ratio < 2:  # Low-input, high-output
        return "output-optimized-model"
    return "balanced-model"
```

### 4. Watch for shape shifts during a task

An agent's token shape can change mid-task. The initial context ingestion is high-input/low-output. Follow-up turns may be more balanced. If your router uses a single model for the entire session, you may be overpaying for the ingestion phase or underpowering the generation phase.

## Red flags

- Your routing logic only considers "easy" vs "hard" with no token-shape dimension
- Your cost dashboard shows high spend but you cannot attribute it to input processing vs output generation
- You are using a frontier decoder-only model for long-context ingestion tasks where a CED-style model would be 10-100x cheaper
- Your KV cache costs are growing faster than your token volume

## Quick win

Add input-to-output ratio logging to your most expensive agent workflow this week. After 100 runs, look at the distribution. If the majority are high-input/low-output, you are likely overpaying by routing them to models that charge full price for KV cache on the entire input.