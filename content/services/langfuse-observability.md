---
slug: langfuse-observability
title: "Langfuse: Open-Source LLM Observability"
excerpt: "Trace LLM and agent runs, score outputs, manage prompts, and debug multi-step tool loops — self-host or cloud."
category: Operations
tags:
  - observability
  - tracing
  - evaluation
  - open-source
  - agents
provider: Langfuse
pricing_model: Usage-based
price: "OSS self-host free; cloud free tier + paid plans"
website: https://langfuse.com
image: /images/agentmarketplace/services-hero.svg
order: 26
last_verified: "2026-07-13"
---

# Langfuse: Open-Source LLM Observability

## What it is

Langfuse is an open-source observability platform for LLM apps and agents. It captures traces (prompts, tool calls, latencies, costs), supports evaluations and scores, and helps teams version prompts without guessing what changed in production.

## When to use it

- Multi-step agents where you need step-level traces
- Teams comparing model versions or prompt variants
- Self-hosting requirements (data residency, air-gapped stacks)

## What it does well

- Open-source core with a real self-host path
- Trace trees that match agent tool loops
- Prompt management and scoring hooks for evals
- Works with many SDKs and OpenAI-compatible gateways

## Honest limitations

- Traces alone do not fix bad prompts — you still need an evaluation policy
- Self-host ops (Postgres, upgrades, backups) are real work
- Cost attribution is only as good as your token reporting instrumentation

## Pricing reality

Self-host is free software with infrastructure cost. Cloud free tier is useful for experiments; paid plans scale with events and retention. Model token costs remain separate.
