---
slug: deepinfra-inference-api
title: "DeepInfra: Low-Cost Inference API"
excerpt: "Usage-based inference cloud with OpenAI-compatible API, some of the cheapest per-token pricing in the market, and on-demand GPU rental."
category: Infrastructure
tags:
  - inference
  - api
  - gpu
  - cost
  - openai-compatible
provider: DeepInfra
pricing_model: Usage-based
price: "Per-token; no free tier. Models from $0.02 to $2.85 per MTok."
website: https://deepinfra.com
image: /images/agentmarketplace/services-hero.svg
order: 102
last_verified: "2026-09-09"
---

# DeepInfra: Low-Cost Inference API

## What it is

DeepInfra is an inference cloud that serves open-weight models through an OpenAI-compatible API. You point any OpenAI SDK client at their base URL and it works. No fine-tuning platform, no agent framework, no managed RAG — just cheap, fast tokens from a large catalog of open models.

They also rent GPUs directly: A100 at $0.89/hr, H100 at $1.79/hr, H200 at $2.19/hr, B200 at $2.79/hr. Billed per minute, postpaid.

## When to use it

- You need the cheapest per-token price for open-weight models like DeepSeek, GLM, Qwen, or Nemotron
- Your agent stack already speaks the OpenAI API and you want to swap base URLs
- You want to test multiple open models side-by-side without self-hosting
- You need on-demand GPU hours for batch inference or eval runs without committing to a cluster

## What it does well

- **Aggressive pricing.** DeepInfra consistently lands at the low end of per-token pricing across model families. DeepSeek-V4-Flash at $0.08/$0.18, GLM-5.2 at $0.75/$2.40, Nemotron 3 Ultra at $0.50/$2.20. Cached input pricing drops further (e.g., $0.14/MTok cached for GLM-5.2).
- **OpenAI-compatible API.** No SDK changes needed — swap the base URL and API key. Works with Hermes Agent, LiteLLM, LangChain, and any OpenAI SDK client.
- **Broad model catalog.** Covers DeepSeek, GLM, Qwen, Llama, Gemma, Nemotron, Kimi, and others. New models appear within days of release.
- **GPU rental at competitive rates.** On-demand, per-minute billing with no commitment. Useful for eval runs or batch jobs.
- **SOC 2, ISO 27001, GDPR, HIPAA compliance.** Certifications are published and current.

## Honest limitations

- **No free tier.** You pay from the first token. There is a postpaid model with mid-month invoices at $20, $100, $500, $2,000, and $10,000 thresholds, but no trial credit.
- **200 concurrent request cap per account.** Hard limit. If your agent fleet needs higher concurrency, you need to negotiate or shard across accounts.
- **No fine-tuning or training.** DeepInfra serves inference only. If you need LoRA, full fine-tuning, or training pipelines, look at Together AI or Modal.
- **No managed agent framework.** You get tokens, not agents. Orchestration, tool calling, and memory are your responsibility.
- **US-based infrastructure only.** Data residency outside the US is not available.
- **API surface is basic.** No prompt management, no evaluation tooling, no observability. Pair with Langfuse or Helicone for production visibility.

## Pricing reality

DeepInfra uses a three-tier system: Flex (0.8x), Standard (1x), Priority (1.5x). Prices scale symmetrically across all models — no model-specific exceptions. Per-token rates span roughly 140x, from $0.02/MTok (Llama 3.1 8B) to $2.85/MTok (Kimi K3 input). GPU rental is separate and billed per instance-hour.

For teams whose primary cost driver is token volume on open-weight models, DeepInfra is typically 30-60% cheaper per token than Together AI and significantly cheaper than OpenAI or Anthropic for equivalent open-weight workloads. The trade-off is the absence of platform features — you get inference, not a full ML platform.

## Best fit

Agent stacks that run on open-weight models and want the lowest token bill without self-hosting infrastructure. DeepInfra is the cheapest path from "I have an OpenAI SDK client" to "I'm running GLM-5.2 in production" if you do not need training, fine-tuning, or managed observability.