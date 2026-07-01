---
slug: migrating-to-local-models
title: "Migrating from Cloud APIs to Local Models"
excerpt: "A practical migration guide for moving agent workloads from cloud LLM APIs to local open-weight models."
category: Guides
tags:
  - local-llm
  - migration
  - privacy
  - cost
order: 17
last_verified: 2026-07-01
---

# Migrating from Cloud APIs to Local Models

## When to migrate

Move agent workloads to local models when privacy, cost predictability, latency, or compliance matters more than raw frontier performance. Not every task needs the most expensive cloud model.

## What to migrate first

1. **Classification and routing tasks.** These are narrow, low-risk, and easy to evaluate.
2. **Repetitive formatting and extraction.** Local models handle structured output reliably.
3. **High-volume, low-creativity tasks.** Reducing API calls here saves the most money.
4. **Sensitive data workflows.** Anything involving PII, customer data, or proprietary code.

## What to leave in the cloud

- Complex reasoning and long-context tasks.
- Tasks where the latest frontier model is the only one that performs well.
- Workloads with unpredictable spikes where renting GPUs is cheaper than owning them.

## Migration checklist

- [ ] Pick a local runtime: Ollama for ease, vLLM for throughput, llama.cpp for GGUF flexibility.
- [ ] Choose a model family: Qwen3 for coding, Llama 4 for general tasks, Gemma for efficiency.
- [ ] Quantize to fit your hardware. 4-bit is usually the best balance.
- [ ] Set up a local gateway so the agent can fall back to cloud APIs when needed.
- [ ] Build an evaluation set and compare local vs. cloud outputs before switching.
- [ ] Monitor latency and memory. Local inference is fast once a model is loaded, but loading can be slow.

## Common pitfalls

- **Underestimating VRAM.** A 70B model at 4-bit still needs ~40GB.
- **Forgetting context windows.** Local models often have shorter effective context than cloud counterparts.
- **No fallback.** Set up cloud fallback for tasks the local model cannot handle.
- **Ignoring throughput.** One user on a local model is fine; ten concurrent users may not be.

## Quick win

Start with one low-stakes classification task. Run it locally for a week. Measure quality, cost, and latency. If it works, migrate the next task.

**Related:**
- [Local LLMs vs. API LLMs](/guides/local-llms-vs-api)
- [Running Local Models for Agents](/guides/running-local-models-for-agents)
- [Self-Hosting](/self-hosting)
