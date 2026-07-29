---
slug: cursor-router
title: "Cursor Router: Request-Level Model Routing"
excerpt: "Cursor's classifier that routes each coding request to the optimal model based on query complexity — cutting AI coding spend 30-60% by matching routine work to cheaper models."
category: Tools
tags:
  - model-routing
  - cost-optimization
  - coding-agent
  - cursor
  - ai-infrastructure
provider: Cursor (Anysphere)
pricing_model: Subscription
price: "Included in Cursor Teams and Enterprise plans; no separate pricing"
website: https://cursor.com
image: /images/agentmarketplace/services-hero.svg
order: 30
last_verified: "2026-07-29"
---

# Cursor Router: Request-Level Model Routing

## What it is

Cursor Router is a request-level model routing system released by Cursor (Anysphere) in July 2026. It sits between the developer's request and the model backend, classifying each request by complexity and routing it to the model that delivers adequate quality at the lowest cost. Trained on 600K+ live requests and evaluated across millions of live requests in an online A/B test, it represents a maturation of AI coding tooling from "pick one model" to "pick the right model per task."

## When to use it

- Your team uses Cursor and spends more than you'd like on frontier-model API calls for routine coding tasks
- You want automatic cost optimization without manually switching models between simple and complex tasks
- You are on a Cursor Teams or Enterprise plan (Router is not available on individual plans)

## What it does well

- **Automatic cost reduction** — Cursor reports 30-60% cost savings by routing routine work to cheaper models while reserving frontier models for complex reasoning
- **Cache-aware training** — the router is trained on data where routing decisions result in cache misses, so reported savings account for the real cost of routing overhead, not just model price
- **Transparent admin controls** — admins can enable Router for specific groups, choose which modes are available, set defaults, and block individual underlying models
- **Cross-platform** — available on desktop, web, iOS, CLI, and Cursor's SDK
- **Designed for iteration** — as new models ship, Cursor can update the router to route to them without users changing anything

## Honest limitations

- **Teams/Enterprise only** — individual plan users cannot access Router. This is a deliberate upsell, not a technical limitation
- **Routing decisions are opaque** — the classifier does not expose why a specific request was routed to a specific model. If you need auditability of model selection for compliance, you need to log the routing decisions yourself
- **Optimizes for satisfaction, not quality** — the training reward is "Automatic Feedback Code" (user satisfaction), not code correctness. A model that makes users happy with fast plausible-looking but subtly wrong code can win routing over a slower, correct model
- **Vendor lock-in deepens** — the more you rely on Cursor's router, the harder it becomes to move to a different coding tool. You are buying into Cursor's model-of-models
- **No BYOK routing** — if you bring your own API keys (BYOK), Router does not apply. You are choosing between cost optimization and provider flexibility
- **Post-SpaceX acquisition** — Cursor was acquired by SpaceX; the long-term roadmap and pricing stability are uncertain. Router is a feature, not a guarantee

## Pricing reality

Router is included in Cursor Teams and Enterprise plans at no additional charge. The cost savings come from reduced API token spend on the underlying models. There is no separate billing line item for Router itself. Your actual savings depend on your task mix — teams doing mostly routine boilerplate will save more than teams doing complex architecture work.