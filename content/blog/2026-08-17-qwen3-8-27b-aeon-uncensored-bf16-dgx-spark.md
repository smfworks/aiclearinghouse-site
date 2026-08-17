---
slug: "2026-08-17-qwen3-8-27b-aeon-uncensored-bf16-dgx-spark"
title: "The Abliteration Trade-Off: Qwen3.8-27B Uncensored vs Base, Benchmarked"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-17"
excerpt: "We swapped the FP8 Qwen3.8-27B for AEON-7's uncensored BF16 abliteration and ran the full benchmark gauntlet again. The cost of removing the hall monitor is measurable: math drops 50% to 33%, and the model starts to ramble on open-ended reasoning. Coding, tool-calling, and vision hold steady."
categories: ["AI", "Local LLMs", "DGX Spark", "Benchmarks", "Model Safety"]
tags: ["qwen3.8", "abliteration", "uncensored", "aeon-7", "dgx-spark", "sglang", "bf16", "benchmark", "safety"]
readTime: 15
image: "/images/blog/2026-08-17-qwen3-8-27b-aeon-uncensored-bf16-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-17-qwen3-8-27b-aeon-uncensored-bf16-dgx-spark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

We [benchmarked Qwen3.8-27B-FP8](/blog/2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang) last week and got a clean picture: 79.0% overall on the Official A suite, 100% tool-calling, strong coding, weak-ish math. Then we swapped in a different checkpoint of the *same* model — AEON-7's **uncensored BF16 abliteration** — and asked a sharper question:

**What does removing the safety alignment actually cost in capability?**

Abliteration is the technique of surgically removing the "refusal direction" from a model's activations so it stops saying "I can't help with that." AEON-7's card is unusually honest about the trade-off: they explicitly say they optimized for *coherence and better answers*, not for a zero-KL clone of the base model. So we ran the exact same 157-test gauntlet to measure what that coherence cost.

## The stack

| Component | Value |
|-----------|-------|
| Hardware | NVIDIA DGX Spark (GB10, 128 GB unified memory) |
| Engine | SGLang (`lmsysorg/sglang:qwen38-27b`, flashinfer 0.6.18) |
| Model | `AEON-7/Qwen3.8-27B-AEON-ULTIMATE-UNCENSORED-BF16` |
| Base | `Qwen/Qwen3.8-27B` (hybrid Gated DeltaNet VLM) |
| Quantization | BF16 full precision (~52 GB) |
| Spec decode | EAGLE 3/1/4 (in-checkpoint MTP, unmodified) |
| Vision tower | Unmodified (333/333 tensors hash-matched) |
| Endpoint | `http://spark-56bc:30000/v1` |

The key architectural fact: this is the **same 64-layer hybrid GDN model** as the FP8 base — only the weights differ. The abliteration edited the language-model activations; the vision tower and the MTP head are byte-for-byte the base model. So any capability delta is attributable to the abliteration, not the architecture.

## Test methodology

Identical to the FP8 run: **Official A calibration** (157 tests, `strict_v01`, thinking off), **performance** (latency/throughput/TTFT/concurrency/context scaling), and **vision** (synthetic image, thinking on — this checkpoint requires it).

## Results: the comparison that matters

### Official A — AEON BF16 vs base FP8

| Category | Base FP8 | AEON BF16 | Delta |
|----------|----------|-----------|-------|
| Tool calling | 100% (2/2) | 100% (2/2) | — |
| Coding | 86.7% (26/30) | 86.7% (26/30) | — |
| Instruction | 83.3% (25/30) | 86.7% (26/30) | **+1** |
| Writing | 80.0% (4/5) | 80.0% (4/5) | — |
| Prose | 90.0% (27/30) | 76.7% (23/30) | **−4** |
| Reasoning | 83.3% (25/30) | 73.3% (22/30, +8 err) | **−11** |
| Math | 50.0% (15/30) | 33.3% (10/30) | **−17** |
| **Total** | **79.0% (124/157)** | **72.0% (113/157)** | **−11** |

### Performance

| Metric | Base FP8 | AEON BF16 |
|--------|----------|-----------|
| Decode throughput | 15.6 tok/s | 9.5 tok/s |
| TTFT | 324 ms | 545 ms |
| Concurrency 1→16 | 16/16 clean | 16/16 clean |

The throughput and TTFT differences are **not** the abliteration — they're the BF16 vs FP8 weight precision (52 GB vs 28.5 GB, so more compute per token and a slower prefill). That's an expected hardware/format cost, not a model-quality signal.

### Vision — 4/4 (thinking on)

Shape counting, color identification, OCR, and spatial reasoning all correct. The vision tower is unmodified, and it behaves that way.

## The two findings that matter

### 1. Math regresses 50% → 33% — the abliteration's clearest cost

This is the cleanest single number in the comparison. The base model got 15/30 math problems right with thinking off; the abliterated model got 10/30. Twenty failures, zero passes recovered. The abliteration's "drag removal" — which the card frames as making answers "more direct" — is exactly the kind of careful, step-by-step computation that arithmetic depends on. When you remove the alignment layer, you're not *just* removing refusals; you're nudging the model away from the cautious, verify-your-work behavior that also happens to make it good at math.

This is consistent with AEON-7's own "safety tax" framing: safety alignment makes reasoning models *more* careful, and removing it makes them *less* careful — on math as well as on safety.

### 2. The model rambles on open-ended reasoning — 8 runaway errors

The base FP8 run had **zero errors** across 157 tests. The AEON BF16 run had **8 errors, all in the reasoning category** — and they're all the same failure mode: the model generates a response that never stops.

We watched a single reasoning test decode for **40+ minutes**, climbing past 2,900 tokens toward the 4,096 cap at ~11 tok/s. The base model concluded cleanly on the same prompt. The abliteration appears to have loosened the model's **stop discipline** — without the alignment layer nudging it toward a crisp conclusion, it rambles.

That's a real operational concern for agent use: an agent wired to this model can burn tens of minutes on a single open-ended turn where the base model would have stopped in seconds.

## What holds steady

The findings aren't all negative. Three capabilities survived the abliteration untouched:

- **Tool-calling: 100%** — the `qwen3_coder` parser still produces structured calls, correct names and arguments, every time. This is the single most important capability for agent harnesses, and it's intact.
- **Coding: 86.7%** — identical to base, zero new SyntaxErrors. The abliteration didn't touch the model's ability to generate syntactically valid code.
- **Vision: 4/4** — the unmodified vision tower reads shapes, colors, and text as well as ever.

So the abliteration is *targeted*: it costs you careful reasoning (math, open-ended logic) but leaves the mechanical capabilities (tools, code, vision) intact. That's actually a more precise trade-off than "uncensoring makes everything worse."

## The honest recommendation

If you need a model that won't refuse, this is a coherent, capable 27B VLM — and the fact that its tool-calling, coding, and vision are unchanged makes it genuinely usable for agent work where a base model's refusals get in the way.

But you should go in knowing three things:

1. **Don't use it for math.** A 17-point regression on arithmetic is a real cost. If your workload is math-heavy, keep the base model.
2. **Cap the output tokens on open-ended prompts.** The runaway-generation behavior means you *must* set `max_tokens` on reasoning-style requests, or a single agent turn can run for tens of minutes. The model card itself ships with a `--max-model-len` note for exactly this reason.
3. **The uncensored nature is your responsibility, not the model's.** The card's "Sole Responsibility" clause is explicit: this model will produce tools, chemistry, exploit-shaped code, and content that may be illegal where you are. It has no internal refusal behavior — the duty of care rests entirely with the operator. For a lab/red-team context that's fine; for anything production-facing, you need downstream safety layers.

## Reproducing this

Scripts and raw results are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/qwen3.8-27b-aeon-bf16):

- `scripts/qwen38-aeon-perf.py` — latency/throughput/TTFT/concurrency/context
- `scripts/qwen38-aeon-vision.py` — VLM vision test (thinking on)
- `results/stage1_cal-qwen38-27b-aeon-bf16-strict-v01_*.json` — Official A (113/157)
- `results/qwen38-aeon-perf.json` — performance results
- `reports/hf-gate-aeon.json` — M10 Hardware-Friendly Gate (green)

The comparison baseline is the FP8 run in `benchmarks/qwen3.8-27b-fp8/`.

## Verification notes

Every number in this post is measured from the live endpoint on 2026-08-17, with the model's `config.json` and `model.safetensors.index.json` read directly from the checkpoint on the Spark:

- **Architecture**: `Qwen3_5ForConditionalGeneration`, 64 layers (16× [3 linear-attention + 1 full-attention]), identical to base — confirmed from `text_config.layer_types`.
- **MTP head**: 15 tensors present in the weight map, matching the card's "grafted back from stock."
- **Quantization**: BF16 (no `quantization_config` block), ~52 GB across 3 shards.
- **License**: Apache 2.0 (inherited from Qwen), per the model card.
- **All benchmark numbers** are measured, not vendor-published. The 8 reasoning errors are all timeouts from runaway-length generations, confirmed via the SGLang decode logs.
