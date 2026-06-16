---
slug: litellm-gateway
title: "LiteLLM: Universal LLM Gateway"
excerpt: "One API for 100+ LLM providers with load balancing, fallbacks, rate-limiting, and spend tracking."
category: Infrastructure
tags:
  - llm-gateway
  - routing
  - cost-control
  - observability
provider: LiteLLM
pricing_model: Open source + Enterprise
price: "Open source self-hosted; enterprise from $250/mo"
website: https://www.litellm.ai
image: /images/agentmarketplace/services-hero.svg
order: 9
last_verified: 2026-06-16
---

# LiteLLM: Universal LLM Gateway

## What it is

LiteLLM is an open-source proxy and SDK that normalizes calls across OpenAI, Anthropic, Google, Cohere, Azure, local models, and dozens of other providers behind a single OpenAI-compatible API. It adds production controls that most agents need but few providers offer out of the box.

## When to use it

- Your agent calls multiple models or providers and you are tired of maintaining separate clients.
- You need failover when a provider is rate-limited, down, or too expensive for a given request.
- You want unified spend tracking across OpenAI, Anthropic, local, and fine-tuned endpoints.
- You are building a multi-tenant or team product and need key management and budget caps.

## What it does well

- **Provider abstraction.** Change models without rewriting prompts. The same call can hit GPT-4o, Claude 3.7 Sonnet, Gemini 2.5 Pro, or a local Llama endpoint.
- **Load balancing and fallbacks.** Route by model, cost, latency, or priority. Failover happens automatically.
- **Spend controls.** Set budget limits per key, team, or model. Get unified logs of who spent what.
- **Caching.** Cache identical prompts to reduce API bills and latency.
- **Self-hostable.** Run it inside your own infrastructure for full control.

## Honest limitations

- **Self-hosted ops.** The open-source proxy is powerful but you operate it. Monitoring, backups, and upgrades are on you.
- **Enterprise features cost.** Advanced SSO, audit logs, and team-level governance sit behind the paid tier.
- **Latency overhead.** Every call routes through the proxy; for latency-sensitive agents, placement matters.
- **Not a model.** LiteLLM does not host models. You still need provider keys or local model serving.

## Pricing reality

- Open-source: free to self-host.
- Enterprise: starts around $250/month for managed features and support.
- The real savings come from routing cheaper models to simpler tasks and caching repeated calls.

## Best fit

Teams running agents across multiple LLM providers who want one integration surface, unified observability, and cost guardrails. Especially useful for products where different users or workflows need different models.

## Common integrations

- **OpenClaw / Hermes / Pydantic AI** agents through the OpenAI-compatible endpoint.
- **Langfuse** for tracing and cost attribution.
- **Modal / RunPod** for hosting local or fine-tuned models behind the same gateway.
