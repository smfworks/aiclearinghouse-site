---
slug: langfuse-observability
title: "Langfuse: AI Observability"
excerpt: "Trace, evaluate, and monitor LLM calls, agent steps, and production workflows."
category: Operations
tags:
  - observability
  - tracing
  - llm-ops
  - monitoring
provider: Langfuse
pricing_model: Freemium
price: "Free self-hosted; Cloud from $49/mo"
website: https://langfuse.com
image: /images/agentmarketplace/services-hero.svg
order: 6
last_verified: 2026-06-15
---

# Langfuse: AI Observability

## What it is

Langfuse is an open-source observability platform for LLM applications and agents. It traces every model call, tool invocation, and decision step so you can debug failures, measure quality, and control costs in production.

## When to use it

- You have an agent running in production and no visibility into what it actually does.
- Costs are unpredictable and you need per-request attribution.
- You want to build evaluation datasets from real traces.
- You prefer self-hosted infrastructure or need EU data residency.

## What it does well

- **Full trace view.** See the full agent execution tree: prompts, completions, tool calls, latencies, errors.
- **Cost tracking.** Aggregate spend by model, user, session, or agent.
- **Prompt versioning.** Track prompt changes and their impact on output quality.
- **Evaluations.** Connect datasets, run automated evals, and score agent outputs.
- **Open source + managed cloud.** Self-host for free or use the cloud managed service.

## Honest limitations

- **Instrumentation required.** You have to add Langfuse SDK calls to your agent code.
- **Data volume.** Heavy-traffic agents generate a lot of traces; retention and storage become real concerns.
- **Learning curve.** The UI is powerful but dense. Teams need time to build useful dashboards.
- **Alerting is basic.** You may still want PagerDuty or custom alerts for critical failures.

## Pricing reality

- Self-hosted: free if you run the infrastructure.
- Cloud: free tier for small projects; paid plans from $49/month.
- Production teams usually pay $200–$1,000+/month depending on trace volume and retention.

## Best fit

Teams running agents in production who need to answer "What happened?" and "How much did it cost?" Pair it with the [Local LLMs vs. API](/guides/local-llms-vs-api) guide for cost modeling context.

## Common integrations

- **OpenClaw / Hermes** agents via instrumentation hooks.
- **LangChain / LlamaIndex** native integrations.
- **Slack / PagerDuty** for alerting on top of Langfuse metrics.
