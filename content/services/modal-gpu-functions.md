---
slug: modal-gpu-functions
title: "Modal: Serverless GPUs for Inference and Agents"
excerpt: "Run GPU inference, fine-tunes, and agent workers as serverless Python functions — scale to zero, pay for compute seconds."
category: Infrastructure
tags:
  - gpu
  - serverless
  - inference
  - python
  - agents
provider: Modal
pricing_model: Usage-based
price: "Pay per compute; free starter credits often available"
website: https://modal.com
image: /images/agentmarketplace/services-hero.svg
order: 27
last_verified: "2026-07-13"
---

# Modal: Serverless GPUs for Inference and Agents

## What it is

Modal is a serverless compute platform popular with ML teams. You write Python functions, attach GPU types, and Modal packages, scales, and bills for the runtime. Common uses: model serving, batch inference, fine-tunes, and agent side-workers.

## When to use it

- You need GPUs without owning cluster operations
- Burst workloads that should scale to zero
- Python-native ML and agent code rather than Kubernetes YAML first

## What it does well

- Fast path from local function to remote GPU
- Image caching and dependency packaging
- Autoscaling and concurrency controls for inference endpoints
- Good fit for experimental agent tools (OCR, embeddings, batch jobs)

## Honest limitations

- Cold starts still matter for interactive UX
- Costs can surprise you if long GPU jobs are misconfigured
- Not a full substitute for a multi-tenant production Kubernetes platform with custom networking policies

## Pricing reality

Billed on compute and GPU time plus storage. Always set timeouts, concurrency caps, and budget alerts before giving agents permission to spawn jobs.
