---
{
  "slug": "nemotron-3-ultra",
  "title": "Nemotron 3 Ultra",
  "excerpt": "NVIDIA's 550B hybrid Mamba-Transformer MoE model built for agentic reasoning and long-context orchestration. Open weights, 1M context, $0.50/$2.20 per MTok on DeepInfra.",
  "category": "NVIDIA",
  "tags": ["reasoning", "agents", "long-context", "open-weight", "moe", "agentic"],
  "provider": "NVIDIA",
  "input_price": 0.50,
  "output_price": 2.20,
  "context_window": 1000000,
  "mmlu": 86.8,
  "humaneval": 89.0,
  "arena": "Frontier open-weight",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 102,
  "last_verified": "2026-09-09"
}
---

# Nemotron 3 Ultra

## Overview

NVIDIA Nemotron 3 Ultra is a 550-billion-parameter Mixture-of-Experts model with 55B active per forward pass, built on a hybrid Mamba2-Transformer architecture with Multi-Token Prediction. Released June 4, 2026, it is designed for long-running agentic workflows: multi-step reasoning, tool orchestration, coding agents, and deep research. Weights are published on Hugging Face under the OpenMDW-1.1 license.

The architecture is unusual. The Mamba2 layers provide linear-attention scaling that keeps inference cost low over long contexts, while Transformer layers handle the reasoning-heavy segments. NVIDIA reports 5.9x faster inference than GLM-5.1 on 8K/64K I/O settings, a claim consistent with the architecture but not independently replicated at scale.

## Key specifications

- **Context window:** Up to 1,000,000 tokens (most API providers cap at 262,144)
- **Architecture:** Mamba2-Transformer Hybrid Latent MoE with MTP
- **Parameters:** 550B total / 55B active
- **Input:** $0.50 / MTok (DeepInfra)
- **Output:** $2.20 / MTok (DeepInfra)
- **Cache read:** $0.10 / MTok
- **Rate limits:** 200 concurrent requests per account (DeepInfra)
- **Modalities:** Text input, text output
- **License:** OpenMDW-1.1 (permissive, commercial use allowed)
- **Tool calling:** Yes — supports `tools`, `tool_choice`, and structured outputs via JSON schema

## Benchmark performance

| Benchmark | Score | Source |
|-----------|-------|--------|
| MMLU-Pro | 86.8% | NVIDIA model card |
| GPQA Diamond | 87.0% | NVIDIA model card |
| SWE-bench Verified | 71.9% | NVIDIA / BenchLM |
| SWE-bench Multilingual | 67.7% | NVIDIA / BenchLM |
| Terminal-Bench 2.0 | 56.4% | NVIDIA / BenchLM |
| LiveCodeBench v6 | 89.0% | NVIDIA / BenchLM |
| RULER (1M context) | 94.7% | NVIDIA model card |
| AA Intelligence Index | 47.7 | Artificial Analysis |

> Benchmark scores are from NVIDIA's model card and the BenchLM aggregator. Independent third-party replication of the agentic coding scores is limited — the SWE-bench and Terminal-Bench runs use NVIDIA's own evaluation harness.

## When to use it

- **Long-horizon agent pipelines** — 1M context with linear-attention scaling keeps cost manageable on long sessions
- **Multi-step reasoning and planning** — the architecture is built for sustained reasoning chains, not just single-shot answers
- **High-volume agentic inference** — 55B active parameters keep per-token cost low for a frontier-class model
- **Self-hosting open weights** — OpenMDW-1.1 license permits commercial use; BF16 and NVFP4 checkpoints available on Hugging Face
- **Cost-sensitive agent fleets** — at $0.50/$2.20 per MTok, it undercuts most Western frontier API models significantly

## When not to use it

- **Pure coding agent workloads** — Terminal-Bench 2.0 at 56.4% trails GPT-5.6 Sol (91.9%) and Claude Opus 5 significantly. For coding agents, this is not the top choice.
- **Multimodal or vision tasks** — text in, text out only. No image or video input.
- **Maximum benchmark performance** — the Artificial Analysis Intelligence Index places it at 47.7, behind Kimi K2.6 (53.9) and the closed frontier models.
- **Low-latency interactive chat** — time-to-first-token of 2.57s on DeepInfra is fine for background agent work but noticeable in interactive settings.

## API access

Available through DeepInfra ($0.50/$2.20), Baseten ($0.60/$2.40), and Venice ($0.625/$3.125). Also available on OpenRouter with automatic provider routing. Self-hosting requires 8x H100-80GB GPUs at BF16 precision; the NVFP4 checkpoint reduces this but at a quality cost.