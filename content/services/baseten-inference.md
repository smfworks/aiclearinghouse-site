---
slug: baseten-inference
title: "Baseten: Production Inference for Open Models"
excerpt: "Serverless per-token Model APIs plus dedicated GPU-minute deployments for open-weight models. Now a HuggingFace inference provider. Strong for custom model serving, expensive for always-on workloads."
category: Infrastructure
tags:
  - inference
  - gpu
  - open-models
  - serverless
  - dedicated
  - huggingface
provider: Baseten
pricing_model: Usage-based
price: "Per-token Model APIs from $0.10/MTok; dedicated GPU from $3.75/hr (H100 MIG) to $6.50/hr (H100 80GB)"
website: https://baseten.co
image: /images/agentmarketplace/services-hero.svg
order: 103
last_verified: "2026-09-16"
---

# Baseten: Production Inference for Open Models

## What it is

Baseten is an inference platform that serves open-weight and custom models through two billing models: serverless per-token Model APIs and dedicated GPU-minute deployments. They became an official HuggingFace Inference Provider in September 2026, meaning you can run models like Kimi K3, DeepSeek V4 Flash, and GLM-5.2 directly from HuggingFace model pages using your HF token.

The platform's distinguishing feature is the Truss framework — a packaging format that turns any HuggingFace model into a deployable API with a `config.yaml`, a `model.py` with a `load()` and `predict()` function, and automatic scaling. For teams that need custom preprocessing, non-standard model architectures, or dedicated hardware with SLAs, Baseten covers ground that pure serverless providers do not.

## When to use it

- You need to deploy a custom or fine-tuned model that no serverless provider offers
- You want to run open models from HuggingFace model pages without leaving the HF ecosystem
- Your workload needs dedicated GPU replicas with SLA guarantees (Cursor, Notion, and Clay use Baseten for this)
- You want per-token pricing for sporadic traffic and can accept cold starts
- You need private endpoints with compliance guarantees (SOC 2, HIPAA)

## What it does well

- **HuggingFace integration.** As an official HF Inference Provider, Baseten is accessible from any HF model page that lists it. Authenticate with your HF token, pay provider rates with no HF markup. PRO users get $2/month in credits usable across providers.
- **Truss framework reduces deployment friction.** Standard HuggingFace models with no custom `load()` logic migrate in minutes. The `model.py` predict function gives you control over preprocessing that pure-serverless platforms do not expose.
- **Competitive per-token pricing on serverless.** GPT-OSS 120B at $0.10/$0.50 per MTok, Nemotron 3 Ultra at $0.60/$2.40, Kimi K2.7 Code at $0.95/$4.00. Rates are comparable to Fireworks and often cheaper than Together AI for the same models.
- **Dedicated GPU deployments with SLA contracts.** H100 80GB at $6.50/hr, B200 at $9.98/hr, A100 at $4.00/hr, H100 MIG 40GB at $3.75/hr. Billed per minute. Enterprise teams get SLA contracts that matter for production reliability.
- **Fast inference.** Baseten is frequently the fastest provider on HuggingFace's inference provider table — Kimi K2.6 at 116 tok/s output, DeepSeek V4 Pro at 82 tok/s, GLM-5.2 at 60 tok/s.
- **Observability built in.** Request-level tracing, latency breakdowns, and cost analytics are available without adding Langfuse or Helicone.

## Honest limitations

- **Expensive for always-on workloads.** Baseten's own production guidance recommends `min_replicas >= 2`. Two H100 replicas 24/7 = $9,360/month. Renting the same GPU directly from a provider like Spheron costs ~$1,447/month — 85% less. The premium buys you SLAs, observability, and zero ops, but the math is brutal at sustained throughput.
- **Cold starts on serverless.** Model APIs scale to zero, which means the first request after idle pays a cold-start penalty. For latency-sensitive workloads, you need to keep replicas warm, which moves you back to dedicated pricing.
- **Narrower model catalog than DeepInfra or OpenRouter.** Baseten focuses on frontier open models (Kimi, DeepSeek, GLM, Nemotron, GPT-OSS). If you need a long tail of smaller or older models, DeepInfra's catalog is broader.
- **Ops-heavier than managed serverless.** Truss gives you control, but that control comes with configuration surface area. Compared to pointing an OpenAI SDK at DeepInfra's base URL, Baseten requires more setup for custom models.
- **US-based infrastructure.** No non-US data residency at the time of writing.
- **Revenue mix favors dedicated deployments.** Roughly 60% of Baseten's revenue comes from GPU-minute deployments, 30% from per-token APIs. The platform is optimized for the dedicated use case — serverless users are a secondary audience.

## Pricing reality

Baseten operates two parallel pricing systems:

**Model APIs (per-token, serverless):**

| Model | Input ($/MTok) | Output ($/MTok) | Context |
|-------|----------------|-----------------|---------|
| GPT-OSS 120B | $0.10 | $0.50 | 131K |
| Nemotron 3 Ultra 550B | $0.60 | $2.40 | 203K |
| Kimi K2.6 | $0.95 | $4.00 | 262K |
| Kimi K2.7 Code | $0.95 | $4.00 | 262K |
| DeepSeek V4 Pro | $1.32 | $3.96 | 1M |
| GLM-5.2 | $1.40 | $4.40 | 1M |

**Dedicated deployments (per GPU-minute):**

| Hardware | $/hr | $/min |
|----------|------|-------|
| H100 MIG 40GB | $3.75 | $0.0625 |
| A100 80GB | $4.00 | $0.0667 |
| H100 80GB | $6.50 | $0.1083 |
| B200 | $9.98 | $0.1663 |

The crossover point depends on your traffic shape. For sporadic workloads under ~50K tokens/day, Model APIs are cheaper. For sustained 24/7 inference, dedicated GPU rental from a raw provider is significantly cheaper than Baseten's dedicated tier, which is itself cheaper than running Model APIs at scale.

## Best fit

Teams that need custom model deployment with SLAs, observability, and private endpoints — and are willing to pay a premium over raw GPU rental for managed infrastructure. Not the cheapest per-token provider (DeepInfra wins that), not the broadest catalog (OpenRouter wins that), but the strongest option for production-grade custom model serving with enterprise compliance requirements.