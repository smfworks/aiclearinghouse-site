---
{
  "slug": "qwen-3-8-max",
  "title": "Qwen3.8-Max",
  "excerpt": "Alibaba's 2.4-trillion-parameter MoE model with 95B active parameters, 1M context window, and leading scores on Terminal-Bench and PaperBench. The first Max-class Qwen model promised with open weights.",
  "category": "Alibaba",
  "tags": ["coding", "agents", "open-weight", "long-context", "moe", "multimodal", "chinese-llm"],
  "provider": "Alibaba Cloud / Qwen Team",
  "input_price": 1.5,
  "output_price": 7.5,
  "context_window": 1000000,
  "mmlu": 89.0,
  "humaneval": 91.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-19"
}
---

# Qwen3.8-Max

## Overview

Qwen3.8-Max is Alibaba's flagship model, released on August 3, 2026 under the title "Qwen3.8-Max: A New Bar for Coding and Cowork." It is a 2.4-trillion-parameter sparse mixture-of-experts model with 95 billion active parameters per token — a ~26:1 sparsity ratio. Built on the Qwen 3.5 architectural foundation, it carries a 1-million-token context window (991K max input, 131K max output, 262K max reasoning tokens) and is multimodal.

This release is notable as the first time Alibaba has promised open weights for a Max-class model, after keeping 3.6-Max and 3.7-Max API-only. The weights were initially promised for the week of August 10 — that date slipped, with a second commitment now targeting mid-to-late August.

## Architecture

- **Total parameters**: 2.4 trillion
- **Active parameters**: 95 billion per token (10 routed experts + 1 shared, out of 512 total experts)
- **Context window**: 1,000,000 tokens (991K max input, 131K max output, 262K max reasoning)
- **Modalities**: Text and image input; text output
- **Weights**: 213 safetensors shards when released
- **Knowledge cutoff**: 2026-01-04

## Benchmarks

- **Terminal-Bench 2.1**: 86.6 — ahead of Claude Opus 4.8 (84.6) and Fable 5 (84.6), behind GPT-5.6 Sol max (88.8)
- **PaperBench**: 93.0 — leads the field, ahead of GPT-5.6 Sol max (90.5) and Opus 4.8 (80.3)
- **SWE-bench Pro**: 67.7 — trails Fable 5 (80.0) and Opus 4.8 (69.2), but ahead of GPT-5.6 Sol (64.6)
- **OSWorld-Verified**: 86.1 — ahead of GPT-5.6 Sol Max and Fable 5
- **Vals Index**: 66.1 — #2 among open-weight models (per Vals.ai)
- **SWE-bench Verified**: 87.3% (per Vals.ai)

> Benchmark numbers are from Alibaba's vendor-run release table, August 2026. Results vary by evaluation harness. The SWE-bench Pro gap behind Fable 5 is the honest weak spot — Qwen3.8-Max is stronger on terminal and research tasks than on deep engineering work.

## Pricing

- API: approximately $1.50/M input, $7.50/M output
- Open-weight release planned (first Max-class model to be open-sourced by Alibaba)
- Self-hosting cost: Your hardware — all 2.4T parameters must be loaded for inference regardless of the 95B active compute, requiring substantial VRAM or multi-node setups

> Pricing numbers are directional from public sources as of August 2026. Verify on the provider's pricing page before budgeting. Note: token-hungriness of this model generation is unmeasured in public benchmarks — effective cost may sit above the headline price.

## Key capabilities

- **Long-horizon coding**: Terminal-Bench 2.1 at 86.6 puts it within striking distance of the top proprietary scores
- **Research and instruction following**: PaperBench at 93.0 leads the field
- **1M context window**: One of the largest available, with 262K reasoning tokens for extended chain-of-thought
- **Multimodal**: Text and image input support
- **Open-weight promise**: First Max-class Qwen model slated for open weights — a significant shift in Alibaba's release strategy

## Limitations

- **Weights still a promise**: Two dated commitments; the first slipped. Not yet available for self-hosting as of August 19, 2026
- **SWE-bench Pro gap**: Trails Fable 5 by 12 points on deep engineering work — the model is stronger on terminal and research tasks
- **Massive memory footprint**: Even with 95B active, all 2.4T parameters must be loaded — serving requires multi-GPU or multi-node setups
- **Token hungriness**: Effective cost per task may be higher than headline pricing suggests
- **Fable 5 fallback caveat**: A footnote in Alibaba's own benchmark table notes Fable 5 results "may involve fallbacks," which affects comparison validity

## When to pick it

Choose Qwen3.8-Max when you need the strongest raw capability on terminal and research tasks, the most recent training data (cutoff January 2026), or a 1M context window for long-horizon work. For the hardest deep engineering coding tasks, Claude Fable 5 remains the stronger pick. For cost-sensitive stacks, GLM-5.3 offers comparable coding performance at roughly half the price. For self-hosting today, Muse Glimmer 30B or Qwen3.6-27B are the practical choices until Qwen3.8-Max weights actually ship.