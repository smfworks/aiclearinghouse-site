---
{
  "slug": "qwen-3-8-flash-next",
  "title": "Qwen3.8-Flash-Next",
  "excerpt": "Alibaba's experimental preview of the Qwen4 architecture — 125B total parameters with only 6B active, plus a novel 51B n-gram embedding layer. Introduces Qwen Sparse Attention, Gated Residual, and n-gram parameter scaling for dramatically efficient long-context inference.",
  "category": "Alibaba",
  "tags": ["coding", "agents", "open-weight", "long-context", "moe", "multimodal", "chinese-llm", "architecture"],
  "provider": "Alibaba Cloud / Qwen Team",
  "input_price": 0.15,
  "output_price": 0.47,
  "context_window": 262144,
  "mmlu": null,
  "humaneval": null,
  "arena": "Experimental",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 101,
  "last_verified": "2026-09-02"
}
---

# Qwen3.8-Flash-Next

## Overview

Qwen3.8-Flash-Next is an experimental architecture preview released by Alibaba's Qwen team on August 24, 2026. It is not a standard model release — it is a public window into the architecture that will underpin Qwen4. The model introduces three structural innovations that differentiate it from everything else in the current open-weight landscape: Qwen Sparse Attention (QSA), Gated Residual streams, and an n-gram embedding layer that scales parameters without scaling compute.

The headline numbers: 125B total parameters, only 6B activated per token (10 routed experts + 1 shared out of 512), plus a 51B n-gram embedding table and 4B multi-token prediction (MTP) head. Context length is 262K natively, extensible to 1M. It is multimodal — text and image input, text output. The production version, called Qwen3.8-Flash, is available via API with 1M context and built-in tools; Flash-Next is the open-weight experimental artifact.

## Architecture

- **Total parameters**: 125B (6B activated per token) + 51B n-gram embedding + 4B MTP
- **Hidden dimension**: 2,560
- **Layers**: 48, arranged as 12 × (3 × (Gated DeltaNet → MoE) → 1 × (Qwen Sparse Attention → MoE))
- **MoE**: 512 experts, 10 routed + 1 shared activated, expert intermediate dimension 640
- **Gated DeltaNet**: 48 V heads / 16 QK heads, head dimension 128
- **Qwen Sparse Attention**: 24 Q heads / 2 KV heads, head dimension 256, budget 512 blocks (2048 tokens)
- **Gated Residual**: 4 branches, bottleneck rank 320
- **Context window**: 262,144 natively, extensible to 1,000,000
- **License**: Qwen Community License 1.0 (not Apache 2.0 — check terms for commercial use)

## Benchmarks

All benchmarks are vendor-reported from Alibaba's release table, August 2026. Independent replication pending.

| Benchmark | Qwen3.8-Flash-Next | Qwen3.8-27B | Qwen3.7-Plus | DeepSeek-V4-Flash |
|-----------|---------------------|-------------|--------------|---------------------|
| DeepSWE 1.1 (agentic coding) | **58.7** | 42.2 | 16.5 | 54.4 |
| SWE-bench Pro | **62.5** | 61.7 | 55.8 | 56.0 |
| SWE-bench Multilingual | **81.0** | 73.8 | 75.8 | — |
| CoWorkBench (office work) | **73.9** | 70.7 | 65.1 | 45.1 |
| JobBench (professional tasks) | **55.7** | 33.4 | 27.6 | 41.3 |
| Agents' Last Exam (Score) | **51.2** | 42.9 | 33.6 | — |
| Toolathlon Verified (Pass@1) | **73.5** | 67.1 | 50.6 | 70.3 |
| IFBench (instruction following) | **81.3** | 79.5 | 79.1 | 79.2 |

> These are vendor-run benchmarks. The architecture is new enough that no independent evaluator has published results. Treat the numbers as directional, not confirmed.

## Pricing

- **Open weights**: Free to download from HuggingFace under Qwen Community License 1.0
- **Production API (Qwen3.8-Flash)**: approximately $0.15/M input, $0.47/M output (via OpenRouter and Alibaba DashScope)
- **Cache pricing**: $0.02/M cache read, $0.20/M cache write
- **Self-hosting**: Your hardware. The model is 125B total parameters — even with only 6B active, all parameters must be loaded into memory. The n-gram embedding table adds 51B parameters that are offload-friendly (embedding lookups are memory-bandwidth-bound, not compute-bound)

> Pricing numbers are from OpenRouter as of September 2026. Verify on the provider's pricing page before budgeting.

## Key capabilities

- **Extremely low active parameter count**: 6B active out of 125B total means inference compute is closer to a 6B dense model, not a 125B one. The 26:1 sparsity ratio is among the highest in open-weight models.
- **N-gram embedding scaling**: The 51B n-gram embedding table provides a new axis for parameter scaling that is memory-bandwidth-bound, not compute-bound — making it efficient for memory-constrained accelerators. This is the architectural innovation most likely to be adopted by other labs.
- **Qwen Sparse Attention (QSA)**: Operates at the micro-block level rather than individual tokens, cutting long-context latency significantly. With agentic workloads dominating real-world usage, this directly addresses the latency tax of long sessions.
- **Strong agentic coding scores**: DeepSWE 1.1 at 58.7 and SWE-bench Pro at 62.5 put it ahead of Qwen3.8-27B and DeepSeek-V4-Flash on vendor-run benchmarks, despite using far fewer active parameters.
- **Multimodal**: Text and image input support with a 27-layer vision encoder.
- **Open weights**: Available now, unlike Qwen3.8-Max which is still API-only.

## Limitations

- **Experimental architecture**: This is a preview of Qwen4, not a production model. The production version (Qwen3.8-Flash) has additional features (1M context by default, official built-in tools) that Flash-Next lacks. Use Flash-Next for research and experimentation, not production deployment.
- **Vendor-reported benchmarks only**: No independent evaluation exists yet. The architecture is novel enough that evaluators have not yet run it. The impressive numbers could change under independent testing.
- **Massive total memory footprint**: 125B total + 51B n-gram = 176B parameters to load. Even though only 6B are active per token, you need hardware that can hold the full model. The n-gram table is offload-friendly (it is embedding lookups, not matrix multiplication), but you still need the VRAM or system RAM for it.
- **New architecture, limited ecosystem support**: The `qwen4_exp` model type requires recent versions of transformers, vLLM, and SGLang. Older inference stacks will not support it. Expect compatibility issues with tooling that has not been updated.
- **Qwen Community License 1.0 is not Apache 2.0**: Commercial use is permitted but with specific terms. Read the license before deploying in a commercial product. The license includes acceptable-use restrictions that Apache 2.0 does not.
- **No published MMLU or HumanEval scores**: The benchmark table focuses on agentic and coding benchmarks. Traditional general-knowledge benchmarks (MMLU, HumanEval) are not published for this model, making direct comparison with standard LLM directories difficult.
- **Context extensible to 1M, but only natively 262K**: The 1M context requires the production API (Qwen3.8-Flash) or additional configuration. The open-weight Flash-Next defaults to 262K.

## When to pick it

Choose Qwen3.8-Flash-Next when you want to experiment with the next generation of efficient LLM architecture — specifically n-gram embedding scaling, QSA, and Gated Residual — on your own hardware. It is a research artifact, not a production model. For production use, the Qwen3.8-Flash API offers the same architecture with production features (1M context, built-in tools, streaming). For cost-sensitive production coding agents, GLM-5.3 offers comparable coding performance with a proven track record. For the strongest raw capability on coding and research tasks, Qwen3.8-Max remains the flagship — but its weights are still not available.