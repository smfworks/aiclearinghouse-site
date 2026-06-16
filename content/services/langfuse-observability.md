---
slug: langfuse-observability
title: "Langfuse: Observability for LLM Agents"
excerpt: "Open-source tracing, evaluation, and cost monitoring for production LLM and agent workflows."
category: Operations
tags:
  - observability
  - tracing
  - evaluation
  - cost-monitoring
provider: Langfuse
pricing_model: Open source + Cloud
price: "Open source self-hosted; cloud free tier, paid from $25/mo"
website: https://langfuse.com
image: /images/agentmarketplace/services-hero.svg
order: 12
last_verified: 2026-06-16
---

# Langfuse: Observability for LLM Agents

## What it is

Langfuse is open-source observability built for LLM applications and agents. It captures traces, spans, prompts, costs, latency, and evaluations so you can debug agent behavior, measure quality, and understand spend in production.

## When to use it

- Your agent runs multi-step workflows and you need to see what happened when it failed.
- You want to track cost per user, per session, or per workflow across models.
- You are iterating on prompts and need to compare versions against real traces.
- You need human feedback or automated scoring loops to improve agent quality.

## What it does well

- **End-to-end tracing.** See the full chain of thought, tool calls, retries, and model invocations.
- **Cost and latency attribution.** Break down spend and latency by step, model, and user.
- **Prompt management.** Version prompts and link them directly to traces.
- **Evaluations and scores.** Attach manual or automated scores to traces and track quality over time.
- **Self-hostable.** Run it locally or in your own cloud for full data control.

## Honest limitations

- **Instrumentation required.** You need to add tracing calls to your agent code.
- **Learning curve.** Powerful features take time to configure for complex workflows.
- **Cloud vs. self-hosted tradeoff.** Managed cloud is easier but may be a compliance concern for sensitive data.
- **Not a replacement for tests.** Traces help you find problems; they do not prevent them.

## Pricing reality

- Open-source self-hosted: free aside from infrastructure costs.
- Cloud: generous free tier for small projects; paid plans from $25/month for teams.
- Enterprise: higher volume, SSO, audit logs, and support.

## Best fit

Teams running agents in production who need visibility into the black box. Essential once your agent does more than single-turn Q&A — especially when tools, loops, or multiple models are involved.

## Common integrations

- **LangChain / LlamaIndex** native instrumentation.
- **LiteLLM** for unified model routing and cost attribution.
- **OpenClaw / Hermes** agents through manual or SDK-based tracing.
