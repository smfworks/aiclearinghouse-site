---
slug: openrouter-review
title: "OpenRouter Review"
excerpt: "After six months of routing agent traffic through OpenRouter across 12+ models, here is where it earns its keep and where it falls short as a multi-model gateway."
category: "Service"
tags: ["openrouter", "model-gateway", "multi-model", "api", "review"]
rating: 4.3
product: "OpenRouter"
tested_by: "Pamela Flannery"
last_verified: "2026-07-29"
url: "https://openrouter.ai"
order: 6
---

## What we tested

We have been using OpenRouter as our primary multi-model API gateway for approximately six months across these workflows:

- **Agent development:** Routing between Claude Opus 4.8, GPT-5.6, GLM-5.2, and local models via a single endpoint
- **Cost optimization:** Sending routine agent tasks to cheaper models (Hy3, Qwen3.6) and complex tasks to frontier models
- **Model evaluation:** A/B testing model outputs on the same prompts without changing agent code
- **Fallback reliability:** Using OpenRouter's automatic fallback when a provider has downtime

We route traffic from Hermes Agent, custom Python scripts, and LiteLLM through OpenRouter. Volume is moderate — several thousand requests per week across 12+ models.

## What it does well

**Single endpoint, many models.** This is the core value proposition and it delivers. One API key, one base URL, one SDK — access to every major model from OpenAI, Anthropic, Google, Zhipu, Tencent, Meta, Alibaba, and dozens of smaller providers. New models appear on OpenRouter within hours of release. Hy3 was available on launch day. Inkling appeared within 48 hours.

**Pricing is transparent and often cheaper.** OpenRouter aggregates providers and shows effective pricing after prompt caching. For models like Inkling, OpenRouter's $1.00/$4.05 per 1M was cheaper than Thinking Machines' own Tinker pricing ($1.87/$4.68) on launch. The pricing page shows what you actually pay, including cached token discounts.

**Routing modes work as advertised.** Balanced (price + speed), Nitro (fastest), and Exacto (highest tool-calling accuracy) are not marketing labels — they measurably route to different providers with different latency and quality profiles. For tool-use agents, Exacto mode consistently routes to providers with better structured-output compliance.

**Free tiers for new models.** Hy3 was free on OpenRouter for two weeks after launch. This let us evaluate the model at zero cost before committing. Multiple models maintain free tiers that are genuinely usable for testing.

**Usage analytics are useful.** The dashboard breaks down spend by model, tokens, and time period. You can see which models you are actually using and how much each costs. No need to build your own cost tracking from API response headers.

**Fallback is automatic.** When a provider goes down (and they do), OpenRouter routes to the next available provider for the same model. We have had zero failed requests due to provider outages in six months. This alone justifies the service for production agent stacks.

## Honest limitations

**You are adding a hop.** Every request goes through OpenRouter's servers. This adds 20-100ms of latency depending on geography. For interactive agent workflows where the user waits for each response, this is noticeable but tolerable. For high-frequency batch processing, it adds up.

**No streaming guarantee across all providers.** While OpenRouter supports streaming, not all underlying providers stream consistently. Some buffer the full response before sending it through. If your agent depends on streaming for UX (showing tokens as they arrive), test each model individually.

**Tool-calling compatibility varies by provider.** The same model served by different providers behind OpenRouter can have different tool-calling behavior. Provider A may format tool calls slightly differently than Provider B. OpenRouter's Exacto mode mitigates this, but it is not perfect. If you need guaranteed tool-calling consistency, pin to a specific provider, not "Balanced" routing.

**Privacy is a consideration.** Your prompts pass through OpenRouter's servers. They state they do not log or train on prompts, but if your compliance environment requires zero third-party data transit, OpenRouter is not an option. You need direct API contracts with each provider.

**Rate limits are shared.** OpenRouter has its own rate limits on top of provider rate limits. Under heavy load, you can hit OpenRouter's limits even if the underlying provider would accept the request. For high-volume production, you need to discuss enterprise rate limits.

**Pricing can change.** OpenRouter adjusts prices as provider costs change. A model that was cheap last month may be more expensive this month if the provider raised prices. Your cost projections need to account for this variability.

## Who it's for

OpenRouter is the right choice for any team that uses multiple models and wants one integration point. If you are evaluating models, building agents that need fallback, or optimizing costs across providers, it saves significant engineering time.

It is not the right choice if you need guaranteed data sovereignty (prompts must not pass through a third party), if you need sub-20ms added latency, or if you use a single model and want direct provider support relationships.

## Verdict

OpenRouter earns a 4.3 after six months of daily use. It loses points for the added latency hop, streaming inconsistency across providers, and privacy considerations for regulated environments. It gains points for the best multi-model coverage in the market, transparent pricing that is often cheaper than going direct, automatic fallback that has never failed us, and day-one availability of new models. For agent development and cost-optimized production routing, it is the default we recommend — with the caveat that compliance-sensitive workloads need direct provider contracts.