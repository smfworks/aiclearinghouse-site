---
slug: "2026-08-02-gpt-oss-120b-mxfp4-dgx-spark-benchmark"
title: "GPT-OSS-120B in MXFP4 on DGX Spark: 32:1 Expert Sparsity, Catastrophic Coding, and the Agentic Surprise"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-02"
excerpt: "We benchmarked GPT-OSS-120B in native MXFP4 on a single DGX Spark with 181 SMF-Bench tests. The model shows extreme capability asymmetry: 76% reasoning, 94% agentic, but only 10% coding and 27% math. Zero errors across 181 tests — stable deployment. Here is the per-capability analysis and what 32:1 expert sparsity means for quantization."
categories: ["AI", "Local LLMs", "DGX Spark", "Open Weights", "Beyond the Leaderboard"]
tags: ["gpt-oss", "mxfp4", "vllm", "dgx-spark", "moe", "expert-sparsity", "benchmark", "quantization", "per-capability"]
readTime: 16
image: "/images/blog/2026-08-02-gpt-oss-120b-mxfp4-dgx-spark-benchmark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-02-gpt-oss-120b-mxfp4-dgx-spark-benchmark"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

## The Model

GPT-OSS-120B is OpenAI's open-weight model — 128 experts with 4 active per token, giving it a 32:1 expert sparsity ratio. That's the highest sparsity in our optimization study. For context: Mixtral-8x22B runs 8 experts / 2 active (4:1), and Laguna S 2.1 operates at roughly 8.5B active parameters. GPT-OSS-120B ships in native MXFP4 format — the weights are already 4-bit, so this is not a post-training quantization story. It's a deployment and capability profiling story.

The model is a reasoning model. Its `reasoning_model` flag is `True` in our benchmark harness, meaning it uses a dedicated reasoning parser and chain-of-thought is part of its inference path. This matters for interpreting the results: reasoning models trade latency for deliberation, and the capability profile reflects that design choice.

## Constraints on a Single DGX Spark

The DGX Spark provides 128 GB of unified memory on a Blackwell GB10 chip. After OS overhead (~30 GB), the usable budget is roughly 98 GB. GPT-OSS-120B in MXFP4 fits this budget — the 4-bit weights compress the 120B total parameters into approximately 60 GB, leaving room for KV cache and the 262K context window the model supports.

The key architectural advantage: with only 4 experts active per token, the *compute* path is small regardless of the total parameter count. The 124 inactive experts sit in memory but don't participate in the forward pass. This is why high expert sparsity is favorable for memory-constrained deployment — you get the capacity of a 120B model with the compute cost of a much smaller one.

## How We Served It

The model was served with vLLM on the DGX Spark, using the native MXFP4 format (no additional quantization applied). The serve configuration used the model's native reasoning parser. We ran SMF-Bench's standard 181-test suite across 8 capability categories: reasoning, math, coding, instruction, prose, writing, tool_calling, and agentic.

Wall time: 11,872 seconds (~3.3 hours) for the full 181-test suite. This is the reasoning model tax — each test involves chain-of-thought deliberation that adds latency. For comparison, Laguna S 2.1 (non-reasoning, with DFlash speculative decoding) completed 157 tests in 1,946 seconds.

## Results: Per-Capability Breakdown

| Suite | Pass | Total | Rate | Fail | Error |
|-------|-----:|------:|-----:|-----:|------:|
| Reasoning | 29 | 38 | 76.3% | 9 | 0 |
| Math | 8 | 30 | 26.7% | 22 | 0 |
| Coding | 3 | 30 | 10.0% | 27 | 0 |
| Instruction | 23 | 30 | 76.7% | 7 | 0 |
| Prose | 25 | 30 | 83.3% | 5 | 0 |
| Writing | 5 | 5 | 100.0% | 0 | 0 |
| Tool Calling | 0 | 2 | 0.0% | 2 | 0 |
| Agentic | 15 | 16 | 93.8% | 1 | 0 |
| **TOTAL** | **108** | **181** | **59.7%** | **73** | **0** |

**Zero errors.** Every single test completed without timeout, OOM, or crash. This is the stability signal that makes GPT-OSS-120B deployable — it ran the full suite at the memory ceiling without resource exhaustion. Contrast this with Nemotron-3-Super-120B, which hit 69.6% overall but accumulated 43 errors out of 181 tests. A model at 59.7% with 0 errors is a different deployment story than a model at 69.6% with 24% error rate.

## The Capability Asymmetry

The most striking feature of GPT-OSS-120B is its extreme capability asymmetry. This is not a model that's uniformly mediocre or uniformly strong — it's a model that's excellent at some things and catastrophically bad at others.

### What Works: Agentic (94%), Prose (83%), Writing (100%), Reasoning (76%), Instruction (77%)

The agentic result is the surprise. 15/16 agentic tests passed — the highest agentic pass rate in our entire 8-model study. GPT-OSS-120B's chain-of-thought reasoning, combined with its large expert pool (128 experts covering diverse domains), appears to excel at multi-step task decomposition and tool orchestration. The reasoning model architecture pays off here: deliberation before action produces better agentic outcomes.

Prose at 83% and writing at 100% confirm that the model's language generation capabilities are intact under MXFP4. These capabilities depend on broad knowledge representation, which the 128-expert pool provides — there's likely an expert for nearly any domain the prose tests touch.

### What Fails: Coding (10%), Tool Calling (0%), Math (27%)

The coding result is the shock. 3/30 — 10%. This is not quantization degradation; it's a capability gap. For context, Laguna S 2.1 (8.5B active, NVFP4) hit 80% coding. Gemma-4-26B (4B active, NVFP4) hit 93%. A 120B model with 128 experts scoring 10% on coding is a design choice, not a compression artifact.

The likely explanation: GPT-OSS-120B's training distribution emphasized reasoning and agentic tasks over code generation. The 128 experts may not include specialists for programming language syntax and semantics. The 4-active-expert routing means that even if code-relevant experts exist, they may not be activated for coding prompts if the router wasn't trained to select them.

Tool calling at 0/2 compounds this picture. The model's native tool-call parser couldn't produce valid tool invocations in our harness. This is a format compatibility issue, not a capability issue — the agentic tests (which involve multi-step planning) passed at 94%, but the direct tool-call format tests failed. The model can *do* agentic work; it can't *format* tool calls in the way our parser expects.

Math at 27% fits the universal pattern in our study: every model we tested showed significant math degradation under 4-bit quantization. GPT-OSS-120B's 27% is consistent with Laguna S 2.1 (27%) and below Qwen3.6-35B (53%). The reasoning model architecture helps (chain-of-thought can catch arithmetic errors), but 4-bit activation precision limits the benefit.

## What 32:1 Expert Sparsity Means for Quantization

GPT-OSS-120B's 32:1 expert sparsity is the key architectural insight from this benchmark. Here's why it matters:

**The inactive expert advantage.** With 128 experts and 4 active, 124 experts are dormant during any single inference step. These dormant experts occupy memory but don't participate in computation. Quantizing them to 4-bit (MXFP4) costs almost nothing in quality — they're not on the critical compute path. This is why GPT-OSS-120B can run at 59.7% with zero errors despite 4-bit weights: the experts that actually compute are the 4 active ones, and the routing mechanism that selects them operates in higher precision.

**Contrast with Mixtral-8x22B (4:1 sparsity).** Mixtral has 8 experts with 2 active. At any given step, 6 experts are dormant — but 2 of 8 is 25% active, vs. GPT-OSS's 3.1% active. Mixtral's experts are on the critical path more often, so quantization impacts more of the compute. This is reflected in the results: Mixtral-8x22B scored 40.9% overall with 0% coding — the worst performance in our study.

**The implication for NVFP4 conversion.** GPT-OSS ships in MXFP4. On Blackwell hardware (DGX Spark's GB10), converting to NVFP4 would enable native tensor core operations. The 32:1 sparsity means this conversion would primarily affect inactive experts — the quality impact should be minimal. This is a Tier 1 optimization scenario (format conversion, not compression): the model already fits, the question is whether native format improves throughput.

## Implications

1. **Capability profiling beats aggregate scoring.** GPT-OSS-120B at 59.7% aggregate tells you almost nothing useful. The model is excellent at agentic tasks (94%) and catastrophic at coding (10%). A deployment decision based on the aggregate would be wrong in either direction — you'd either over-deploy it for coding or under-deploy it for agentic work.

2. **Zero errors is the deployability signal.** The 0/181 error rate means GPT-OSS-120B runs stably at the DGX Spark's memory ceiling. This is the difference between a benchmark result and a production result. Models that error out under load (Nemotron-3-Super-120B: 43 errors) may produce good answers when they complete, but they can't be trusted for unattended deployment.

3. **Reasoning models have a latency tax.** 11,872 seconds for 181 tests vs. Laguna S 2.1's 1,946 seconds for 157 tests. The chain-of-thought overhead is real. For interactive use, this may be acceptable. For batch processing, it's a throughput constraint.

4. **Expert sparsity is a quantization advantage.** The 32:1 ratio means most parameters are dormant during inference. This makes aggressive weight quantization safer — the inactive experts that take up the bulk of the memory are not on the critical compute path. Dense models (Mistral-Large-2411: 123B, 1:1) don't have this protection.

## Final Verdict

GPT-OSS-120B in MXFP4 on DGX Spark is a **specialist deployable for agentic and reasoning workloads, not a generalist.** The 94% agentic pass rate and 76% reasoning rate make it a strong candidate for agent orchestration and complex task decomposition. The 10% coding rate makes it unsuitable for code generation without augmentation. The zero-error stability makes it trustworthy for unattended deployment.

The 32:1 expert sparsity is its structural superpower — it enables 120B-scale capacity at 4B-scale compute cost, and it makes the 4-bit weight format nearly free in quality terms for the inactive expert majority. For agentic pipelines on edge hardware, this architecture is compelling. For coding and math, you need a different model.

---

*Follow @MichaelGannotti on X for daily updates on this optimization study.*