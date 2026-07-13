---
slug: helicone-ai-gateway
title: "Helicone: LLM Gateway, Logging, and Cost Controls"
excerpt: "Open-source-friendly gateway for routing, logging, caching, and cost controls across OpenAI-compatible providers."
category: Operations
tags:
  - gateway
  - observability
  - cost-control
  - caching
  - open-source
provider: Helicone
pricing_model: Usage-based
price: "Free tier / OSS options; paid cloud plans"
website: https://www.helicone.ai
image: /images/agentmarketplace/services-hero.svg
order: 28
last_verified: "2026-07-13"
---

# Helicone: LLM Gateway, Logging, and Cost Controls

## What it is

Helicone sits in front of LLM APIs as a gateway: one endpoint for multiple providers, with logging, caching, rate limits, and cost visibility. It is popular for teams that outgrow raw SDK calls but are not ready for a full internal AI platform.

## When to use it

- Multi-provider routing (OpenAI, Anthropic, open-weight via proxies)
- Need request/response logs without building a warehouse first
- Want simple caching for repeated prompts

## What it does well

- Drop-in proxy patterns for OpenAI-compatible clients
- Cost and latency dashboards
- Caching and user/session tracking hooks
- Useful for agent fleets where every tool loop multiplies token spend

## Honest limitations

- Gateway is another hop — latency and reliability must be monitored
- Advanced policy (per-tool budgets, dual-approval) still belongs in your agent broker
- Feature depth varies between OSS self-host and managed cloud

## Pricing reality

Start on free or OSS for logging. Paid plans make sense when seats, retention, and SSO matter. Token spend remains the dominant bill.
