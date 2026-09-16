---
{
  "slug": "deepseek-v4-1-flash",
  "title": "DeepSeek-V4.1-Flash",
  "excerpt": "DeepSeek's new Causal Encoder-Decoder MoE cuts KV cache 8x while matching frontier reasoning — 552B total, 8B active prefill, $0.003/M input off-peak.",
  "category": "DeepSeek",
  "tags": [
    "reasoning",
    "long-context",
    "open-weights",
    "agentic",
    "moe"
  ],
  "provider": "DeepSeek",
  "input_price": 0.003,
  "output_price": 0.21,
  "context_window": 400000,
  "mmlu": null,
  "humaneval": null,
  "arena": "Frontier-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-16"
}
---

# DeepSeek-V4.1-Flash

## Overview

DeepSeek-V4.1-Flash shipped on September 10, 2026 — and despite the `.1` version number, it is a **genuinely new architecture**, not a point release. DeepSeek calls it a **Causal Encoder-Decoder (CED)**: a dedicated causal encoder builds the input representation once, while a smaller decoder reads a projection of that representation to generate output cheaply. This decouples prompt-processing from generation in a way no prior DeepSeek decoder-only model did.

The result: 552B total parameters (MoE), but only **8B active during prefill** and **16B during decode**. KV cache storage shrinks to a quarter of HBM and an eighth of SSD compared to the prior generation. This is purpose-built for the lopsided shape of real 2026 agentic workloads — 400K tokens in, 1.5K tokens out.

## Key benchmarks (self-reported)

| Benchmark | Score |
|-----------|-------|
| GPQA Diamond | 90.9 |
| Codeforces rating | 3471 |
| Terminal-Bench 2.1 | 90.6 |

These are self-reported until independent evaluation confirms them, but the Terminal-Bench 2.1 score — which measures real agentic tool use, not isolated code snippets — is particularly notable.

## Pricing

- **Input**: $0.003 / 1M tokens (off-peak), flat-rate per-layer KV caching
- **Output**: ~$0.21 / 1M tokens
- **Context window**: 400,000 tokens
- **Output billed at zero for the encoder pass** — the CED architecture means prompt processing is essentially free

## Open weights

MIT-licensed weights published on Hugging Face the same day as the API release. Model ID: `deepseek-flash`.

## Migration note

As of September 14, 2026 at 04:00 UTC, all requests to `deepseek-v4-pro`, `deepseek-v4-flash`, and `deepseek-v4-flash-vision-exp` are **automatically routed to V4.1-Flash** and billed at V4.1-Flash rates. If your production code still specifies the old model strings, you are already talking to V4.1-Flash — likely at a lower price than you budgeted for. Update your model string to `deepseek-flash` explicitly rather than relying on the compatibility redirect.

## Native multimodal

Vision and multimodal understanding are now built into the main V4.1-Flash line directly, superseding the experimental V4-Flash-Vision-Exp branch from August 21, 2026.

## When to use it

- **Long-context agentic workloads** where input dwarfs output (codebase analysis, document Q&A, repository-level coding)
- **Cost-sensitive production** where KV cache storage was the bottleneck
- **Terminal/command-line agent tasks** (Terminal-Bench 2.1: 90.6)
- **Self-hosted deployments** via the open MIT weights

## Limitations

- Benchmark numbers are self-reported; no independent Artificial Analysis entry yet
- No V4.1-Pro yet — Pro traffic is being routed through Flash temporarily
- 552B total parameters means self-hosting requires multi-GPU hardware even with low active parameters