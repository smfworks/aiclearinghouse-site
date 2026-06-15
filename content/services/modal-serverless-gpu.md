---
slug: modal-serverless-gpu
title: "Modal: Serverless GPU Compute"
excerpt: "Run training, fine-tuning, and inference workloads on serverless GPUs without managing infrastructure."
category: Infrastructure
tags:
  - gpu
  - serverless
  - inference
  - training
provider: Modal
pricing_model: Usage-based
price: "From ~$0.0005 / GPU-second"
website: https://modal.com
image: /images/agentmarketplace/services-hero.svg
order: 1
last_verified: 2026-06-15
---

# Modal: Serverless GPU Compute

## What it is

Modal is a serverless GPU platform. You write Python functions, decorate them, and Modal provisions GPUs only when those functions run. No clusters to maintain, no idle machines, and no DevOps ceremony for scaling from zero.

It is especially useful for AI agents that occasionally need heavy compute — embedding generation, batch inference, fine-tuning, image generation, or long-context calls — but don't justify a permanently rented GPU.

## When to use it

- You need GPU access sporadically rather than 24/7.
- Your workload has huge variance (idle most of the day, burst during spikes).
- You want code-defined infrastructure, not click-ops dashboards.
- You are comfortable writing Python and want colocated data + model logic.

## What it does well

- **Cold start to GPU in seconds.** Modal keeps a warm pool; typical first-call latency is under 10 seconds.
- **Per-second billing.** You pay only for execution time, not for provisioned capacity.
- **Data stays near compute.** Modal has its own distributed filesystem and volumes, so model weights and datasets don't have to move around.
- **Supports the common stack.** PyTorch, JAX, Hugging Face Transformers, vLLM, LlamaIndex, and arbitrary Docker containers all work.

## Honest limitations

- **Python-first.** Modal is not the right fit if your team lives in Go, Rust, or Node.
- **Vendor lock-in.** The decorators and filesystem are Modal-specific. Migrating off means rewriting infrastructure code.
- **Cost surprises.** Per-second billing is cheap at low volume, but a runaway batch job or an infinite retry loop can rack up costs fast.
- **Debugging is different.** "Works on my machine" still matters; debugging distributed GPU traces requires Modal's observability tools.

## Pricing reality

- Billed per GPU-second, with memory and CPU as separate line items.
- H100s and A100s are available; L4 and T4 are cheaper options for lighter inference.
- You will typically spend less than a dedicated RunPod or AWS instance if utilization is below ~40%.

## Best fit

Python-heavy teams building agents that need elastic GPU. Great as a backend for RAG pipelines, image generation, fine-tuning jobs, or any agent task that spikes unpredictably.

## Common integrations

- **OpenClaw / Hermes agents** for embedding and generation backends.
- **Pinecone / pgvector** for vector retrieval with Modal doing the inference layer.
- **LangChain / LlamaIndex** agents that call Modal functions as tools.
