---
slug: separate-inference-from-orchestration
title: Separate Inference from Orchestration in Your Agent Stack
category: Architecture
excerpt: Keep the LLM inference layer and the agent orchestration layer as independent components — swap models without rewriting logic, and swap logic without re-tuning models.
tags:
  - architecture
  - inference
  - orchestration
  - modularity
  - agents
order: 99
last_verified: "2026-07-22"
---

# Separate Inference from Orchestration in Your Agent Stack

## The principle

Many agent implementations hardcode the LLM call directly inside the orchestration logic — the same code that decides "should I call a tool?" also constructs the API request, handles the response, and parses tool calls. This coupling makes both layers harder to change.

## Why it matters

When inference and orchestration are tangled together:

- **Swapping models** requires editing orchestration code — every model change risks breaking agent logic.
- **Testing orchestration** requires real LLM calls — you cannot test "did the agent pick the right tool?" without spending tokens.
- **A/B testing models** means duplicating the entire agent codebase.
- **Rate limits and failures** in the inference layer crash the orchestration layer instead of being handled gracefully.

When they are separated:

- **Swap models** by changing a base URL or model ID — zero orchestration code changes.
- **Test orchestration** with mocked inference responses — fast, free, deterministic.
- **A/B test** by routing to different inference endpoints with a gateway.
- **Handle failures** at the inference layer (retries, fallback) without orchestration knowing.

## How to apply it

1. **Define a clean inference interface.** Your orchestration code should call a function like `complete(messages, tools) -> response` and never see HTTP, API keys, or token counts directly.

2. **Put a gateway in between.** Use LiteLLM, Ferrogate, or Portkey as an inference proxy. The orchestration layer talks to the gateway; the gateway handles provider routing, retries, and fallback.

3. **Mock the inference interface for tests.** Your test suite should be able to run the full orchestration logic with zero LLM calls by providing canned responses through the interface.

4. **Log at the boundary.** Token usage, latency, and cost belong at the inference layer. Tool selection, reasoning quality, and task completion belong at the orchestration layer. Do not mix the logs.

5. **Version both layers independently.** Your orchestration logic has a version. Your inference config (model, temperature, max tokens) has a version. Changing one should not require changing the other.

## Red flags

- "I need to update the agent logic" when what you actually want is to try a different model
- Test suite requires API keys to run
- A single model outage takes down your entire agent
- You cannot tell whether a regression came from a model change or a logic change