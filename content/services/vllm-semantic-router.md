---
slug: vllm-semantic-router
title: "vLLM Semantic Router: Mixture-of-Models Routing"
excerpt: "Open-source intelligent router that classifies LLM requests and routes them to the right model — semantic caching, safety filtering, and cost optimization across heterogeneous backends."
category: Model Routing
tags:
  - routing
  - vllm
  - cost-optimization
  - open-source
  - inference
  - self-hosting
provider: vLLM Project
pricing_model: Open-source
price: "Free / self-hosted"
website: https://github.com/vllm-project/semantic-router
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-05"
---

# vLLM Semantic Router: Mixture-of-Models Routing

## What it is

vLLM Semantic Router is an open-source Mixture-of-Models (MoM) router that lives between your clients and LLM backends. It classifies incoming requests by intent, complexity, and safety signals, then routes each request to the model best suited for it — reducing cost and latency without sacrificing quality.

## When to use it

- You run multiple LLM backends and want automatic model selection per request
- You need semantic caching to avoid redundant inference costs
- You want built-in safety filtering (jailbreak detection, PII filtering, hallucination detection)
- You are self-hosting with vLLM or any OpenAI-compatible inference server

## What it does well

- **Intent-based routing.** Classifies requests and sends simple queries to cheap models, complex ones to frontier models.
- **Semantic caching.** Caches responses by meaning, not exact string match — significant cost savings for repeated query patterns.
- **Safety layer.** Built-in jailbreak detection, PII filtering, and hallucination detection without a separate service.
- **Open-source and self-hosted.** No vendor lock-in; runs on your infrastructure behind an Envoy proxy.
- **Active development.** v0.1 Iris (Jan 2026), v0.2 Athena (Mar 2026), v0.3 Themis (Jun 2026) — rapid release cadence.

## Honest limitations

- **More complex setup than RouteLLM.** Requires configuring signals, decisions, and model backends.
- **Self-hosted only.** No managed version; you operate the router and backends.
- **Requires vLLM or OpenAI-compatible backend.** Not a standalone inference engine.
- **Newer project.** Production hardening at scale is still maturing as of mid-2026.

## Pricing reality

- Open-source (Apache-2.0), free to self-host
- You pay only for your model backends (API or self-hosted GPU compute)
- Semantic caching can reduce backend inference costs by 30–60% depending on query overlap

## Best fit

Teams running heterogeneous LLM fleets (e.g., a cheap model for triage, a frontier model for hard tasks) who want automatic, signal-driven routing without a commercial gateway. Pairs naturally with vLLM for self-hosted inference and LiteLLM for API-based multi-provider routing.

## Common integrations

- **vLLM** as the primary inference backend
- **Envoy AI Gateway** for production traffic management
- **LiteLLM** for API-based multi-provider routing alongside self-hosted models