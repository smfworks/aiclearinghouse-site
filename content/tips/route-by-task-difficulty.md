---
slug: route-by-task-difficulty
title: Route by Task Difficulty, Not by Brand
category: Cost
excerpt: The cheapest frontier tier now outscored last quarter's flagship. Stop sending every request to your most expensive model — route by difficulty.
tags:
  - routing
  - cost
  - models
  - agents
  - performance
order: 99
last_verified: "2026-08-05"
---

# Route by Task Difficulty, Not by Brand

## The principle

In July 2026, GPT-5.6 Luna — OpenAI's cheapest tier at $1/$6 per 1M tokens — scored 93% on SWE-bench Verified, higher than the previous Opus-tier model (Claude Opus 4.8 at 89%, priced at $5/$25). The price of near-frontier capability has collapsed. If you are still sending every request to your most expensive model, you are burning money for no quality gain.

## Why it matters

Model routing by task difficulty is now the dominant cost strategy. The frontier is a cluster of models within 3 points of each other on coding benchmarks, but their prices vary by 10x. The question is no longer "which model is best?" but "which model is best for this specific request?"

## How to apply it

1. **Classify your requests.** Not every agent turn needs frontier reasoning. A file lookup, a formatting task, or a simple tool call can run on a cheap model. Reserve the expensive model for complex reasoning, multi-step planning, and difficult code generation.
2. **Set up a router.** Use vLLM Semantic Router, RouteLLM, or LiteLLM's routing rules to automatically send requests to the right model based on signals.
3. **Start with a two-tier split.** Don't overcomplicate it. One cheap model for 80% of requests, one frontier model for 20%. Measure the cost savings and quality impact before adding more tiers.
4. **Benchmark on your workload, not leaderboards.** SWE-bench scores tell you about GitHub issues, not your CRM integration. Run your own eval set against each tier before trusting the routing.
5. **Monitor for quality regressions.** When you route a hard task to a cheap model and it fails, you pay for the failure and the retry. Track retry rates per tier.

## Red flags

- Every API call goes to the same model regardless of complexity
- You cannot answer "what percentage of your requests use your cheapest model?"
- Your model bill grows linearly with usage instead of sub-linearly
- You have never measured the quality difference between your cheapest and most expensive model on your actual workload

## Quick win

This week, pull your last 100 API requests. Classify each as "simple" or "complex" based on token count and task type. If more than 50% of simple requests went to your most expensive model, you have an immediate cost optimization target.