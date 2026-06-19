---
slug: vllm
title: vLLM
excerpt: High-throughput, memory-efficient LLM inference and serving engine with PagedAttention.
category: Open Source
tags:
  - runtime
  - inference-server
  - open-source
  - python
website: https://vllm.ai
repository: https://github.com/vllm-project/vllm
categories:
  - Runtime
  - Inference Server
  - High-Throughput
  - Open Source
pricing: Open Source
runtime: Local
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - Python
  - Docker
  - Kubernetes
  - API
features:
  - PagedAttention KV-cache manager
  - OpenAI-compatible HTTP server
  - Continuous batching and speculative decoding
  - Multi-LoRA serving
  - Tensor, pipeline, expert, and data parallelism
  - Pluggable attention backends (FlashAttention, FlashInfer, xFormers)
  - Multi-tier KV-cache offloading (CPU/SSD)
  - Unified tool/parser pipeline (replaces per-model parsers)
  - Rust frontend (streaming, LoRA, tool parsers) — production-grade in v0.23
  - OpenTelemetry-compatible /metrics endpoint
releaseYear: 2023
company: vLLM Project (UC Berkeley RISELab origin)
last_verified: 2026-06-19
install_command: "pip install vllm"
lar_test_id: vllm_smoke_serve_v1
---

vLLM is the reference open-source high-throughput LLM serving engine. It
introduced PagedAttention (block-level KV-cache management à la virtual
memory) and continuous batching, which together made multi-tenant LLM
serving tractable on commodity GPUs. It exposes an OpenAI-compatible API
and is widely used as the backend for self-hosted models in production.

The v0.23.0 release (June 15, 2026) shipped 408 commits across ~200
contributors and promoted the Rust frontend to production-grade for
streaming, LoRA, and tool parsers. The MRv2 scheduler is now the default
for Llama and Mistral families. New models added in this cycle include
Step-3.7-Flash, Cosmos3 Reasoner, Granite Speech Plus, and Cohere Mini
Code. The unified tool/parser pipeline replaced per-model parsers, and
multi-tier KV-cache offloading to CPU and SSD is stable.