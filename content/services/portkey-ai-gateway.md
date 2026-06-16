---
slug: portkey-ai-gateway
title: "Portkey: AI Gateway + Guardrails"
excerpt: "Route, observe, and secure LLM requests with enterprise-grade guardrails and model management."
category: Security
tags:
  - ai-gateway
  - guardrails
  - security
  - enterprise
provider: Portkey
pricing_model: Usage-based + Enterprise
price: "Free tier; paid from $49/mo"
website: https://portkey.ai
image: /images/agentmarketplace/services-hero.svg
order: 15
last_verified: 2026-06-16
---

# Portkey: AI Gateway + Guardrails

## What it is

Portkey is an AI gateway that combines model routing, observability, and guardrails into a single control plane. It sits between your agents and the LLMs they call, giving you policy enforcement, cost control, and security controls without rewriting your application.

## When to use it

- You need guardrails around prompt injection, PII leakage, or toxic outputs.
- Your organization requires approval workflows or budget caps for LLM usage.
- You run multiple agents or teams and want centralized model access policies.
- You want semantic caching and intelligent routing to reduce costs.

## What it does well

- **Prompt and content guardrails.** Detect injection, jailbreaks, PII, and unsafe content before it reaches or leaves the model.
- **Centralized model access.** One API key layer for all providers and teams.
- **Semantic caching.** Cache similar prompts to reduce redundant spend.
- **Built-in observability.** Traces, cost dashboards, and latency breakdowns.
- **Enterprise controls.** SSO, audit logs, RBAC, and compliance features.

## Honest limitations

- **Guardrails are not perfect.** Sophisticated attacks can still slip through; treat them as a layer, not a guarantee.
- **Added latency.** Every request passes through the gateway, plus policy checks.
- **Paid features add up.** Advanced guardrails and enterprise controls are not on the free tier.
- **Provider dependency.** You still need underlying LLM provider keys.

## Pricing reality

- Free tier for small projects and individuals.
- Paid plans start around $49/month and scale with requests and features.
- Enterprise pricing is custom and includes SSO, audit, and dedicated support.

## Best fit

Teams shipping agents in regulated or multi-user environments where control, visibility, and safety matter as much as model quality. Complements LiteLLM or can replace it if guardrails are the priority.

## Common integrations

- **OpenAI / Anthropic / Azure** providers through the gateway.
- **Langfuse** for deeper tracing where Portkey observability is not enough.
- **OpenClaw / Hermes** agents via the OpenAI-compatible endpoint.
