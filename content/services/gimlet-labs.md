---
slug: gimlet-labs
title: "Gimlet Labs: Multi-Silicon Inference Cloud for Agentic AI"
excerpt: "A multi-silicon inference platform that disaggregates AI models to run each phase of inference on the most appropriate chip — GPUs, CPUs, near-memory compute, and dataflow accelerators — built for low-latency agentic workloads."
category: Infrastructure
tags:
  - inference
  - multi-silicon
  - gpu
  - agentic
  - serverless
  - cost-optimization
provider: "Gimlet Labs"
pricing_model: Usage-based
price: "Serverless inference pricing; contact for enterprise managed service"
website: https://gimletlabs.ai
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-27"
---

# Gimlet Labs: Multi-Silicon Inference Cloud for Agentic AI

## What it is

Gimlet Labs is an applied AI research company that runs what it calls the first multi-silicon inference cloud. Its software splits a single AI workload across different chip types — GPUs, near-memory compute, CPUs, and dataflow accelerators — so each phase of inference runs on the hardware best suited to it. The company emerged from stealth in October 2025 and raised a $300M Series B at a $3B valuation on September 4, 2026, led by Andreessen Horowitz with Arm and Microsoft's M12 joining as new backers.

The core thesis: existing GPU fleets run at only 10–50% utilization, and the binding constraints are power and capacity, not chips. A heterogeneous inference layer that orchestrates workloads across silicon types delivers better throughput per megawatt than a single-architecture stack.

## Products

- **Gimlet Cloud:** A serverless inference platform for AI agents — deploy models without managing GPU infrastructure
- **kForge:** A tool that auto-generates optimized inference kernels from PyTorch, targeting CUDA, ROCm, and Metal for hardware portability

## Core capabilities

- **Multi-silicon disaggregation:** Splits a model's inference phases across GPUs, CPUs, near-memory compute, and dataflow accelerators — each phase runs on the silicon optimized for it
- **Serverless agent inference:** Run agentic workloads without provisioning or managing GPU instances
- **Cross-platform kernel generation:** kForge generates optimized kernels across CUDA, ROCm, and Metal, enabling hardware portability
- **Managed service option:** Available as Gimlet Cloud or as a managed service deployed in customer environments
- **MLCommons member:** Joined MLCommons in June 2026 to help establish vendor-agnostic benchmarks for agentic inference

## When to use it

- You're running high-volume agentic inference and GPU utilization is a bottleneck
- You want to reduce inference latency for interactive agentic workloads without over-provisioning GPUs
- You need to run across heterogeneous hardware (NVIDIA + AMD + custom accelerators) without rewriting kernels
- You want serverless inference pricing for agent workloads without managing infrastructure

## When to skip it

- You're running small-scale inference where a single GPU provider is sufficient
- You need a fully open-source, self-hosted inference stack (look at vLLM or SGLang instead)
- You require detailed public pricing before committing (Gimlet's pricing is contact-based for enterprise)

## Market context

Gimlet reports billions of dollars of contracted revenue from customers including one of the world's three largest frontier AI labs and one of the top three hyperscalers. The $3B valuation — tripled from ~$980M six months earlier — signals investor confidence in multi-silicon as the inference architecture for agentic AI. Gartner projects AI infrastructure spend reaching $2.8T by 2030, the majority for inference, and Gimlet is betting that spend will be heterogeneous, not single-architecture.

## Alternatives

- **Modal** — serverless GPU functions with simpler single-architecture model; less optimization across silicon types
- **RunPod** — GPU cloud with serverless endpoints and pod-based deployment; broader community template ecosystem
- **Replicate** — managed model hosting with per-request pricing; simpler but less infrastructure control
- **vLLM (self-hosted)** — open-source inference engine; you own the hardware and optimization