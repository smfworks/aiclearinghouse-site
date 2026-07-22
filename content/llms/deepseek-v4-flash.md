---
{
  "slug": "deepseek-v4-flash",
  "title": "DeepSeek-V4-Flash",
  "excerpt": "DeepSeek's efficient MoE model with 284B parameters (13B activated) and 1M token context — the lighter sibling of V4-Pro with DSpark speculative decoding for fast inference.",
  "category": "DeepSeek",
  "tags": ["reasoning", "long-context", "moe", "open-weight", "speculative-decoding", "coding"],
  "provider": "DeepSeek",
  "input_price": 0.11,
  "output_price": 0.44,
  "context_window": 1000000,
  "mmlu": 86.2,
  "humaneval": 91.6,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-07-22"
}
---

# DeepSeek-V4-Flash

## Overview

DeepSeek-V4-Flash is the lighter variant of the DeepSeek-V4 series, featuring 284B total parameters with only 13B activated per token. Released in July 2026 alongside the V4-Pro (1.6T/49B active), it supports a **1 million token context window** and ships with DSpark speculative decoding for significantly faster inference.

The V4 series incorporates a hybrid attention architecture (Compressed Sparse Attention + Heavily Compressed Attention) that reduces long-context inference FLOPs to 27% and KV cache to 10% compared to DeepSeek-V3.2 at 1M tokens.

## Key specs

- **Parameters:** 284B total, 13B activated (MoE)
- **Context Length:** 1,048,576 tokens (1M)
- **Precision:** FP4 + FP8 mixed (MoE experts in FP4, rest in FP8)
- **License:** MIT
- **Speculative Decoding:** DSpark module (7 speculative tokens, greedy draft)

## Benchmarks (Max thinking mode)

| Benchmark | V4-Flash Max | V4-Pro Max |
|-----------|:-----------:|:----------:|
| MMLU-Pro (EM) | 86.2 | **87.5** |
| GPQA Diamond | 88.1 | **90.1** |
| LiveCodeBench | 91.6 | **93.5** |
| SWE Verified | 79.0 | **80.6** |
| Terminal Bench 2.0 | 56.9 | **67.9** |
| BrowseComp | 73.2 | **83.4** |
| MRCR 1M | 78.7 | **83.5** |

V4-Flash-Max achieves comparable reasoning to the Pro version with a larger thinking budget, though its smaller scale naturally places it slightly behind on pure knowledge tasks and the most complex agentic workflows.

## Why it matters for agent builders

- **1M context** at a fraction of V4-Pro cost — ideal for long-context agent workflows
- **MIT license** — fully open, no usage restrictions
- **DSpark speculative decoding** — 7 speculative tokens dramatically reduce latency for agentic loops
- **Strong coding** — LiveCodeBench 91.6% and SWE Verified 79% make it a serious coding agent backend
- **vLLM compatible** — served with a single `--speculative-config` flag

## Pricing

- **API (DeepSeek official):** approximately $0.11 input / $0.44 output per 1M tokens
- **Open-weight (MIT):** self-host with vLLM on a 4×GB300 node; no per-token cost
- **DSpark variant:** same checkpoint with speculative decoding module — no accuracy loss, faster throughput

> Pricing is directional from public sources as of July 2026. Verify on DeepSeek's pricing page.

## Limitations

- 284B parameters still requires serious hardware (multi-GPU) for self-hosting
- No Jinja chat template — uses custom encoding scripts for message formatting
- Smaller activated param count means slightly weaker on pure knowledge tasks vs V4-Pro
- FP4 precision for MoE experts requires compatible inference frameworks

## Resources

- **HuggingFace:** [deepseek-ai/DeepSeek-V4-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash)
- **HuggingFace (DSpark):** [deepseek-ai/DeepSeek-V4-Flash-DSpark](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-DSpark)
- **Paper:** [arXiv:2606.19348](https://arxiv.org/abs/2606.19348)
- **vLLM Recipe:** [recipes.vllm.ai](https://recipes.vllm.ai/deepseek-ai/DeepSeek-V4-Flash)