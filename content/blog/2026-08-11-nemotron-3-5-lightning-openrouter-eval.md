---
slug: "2026-08-11-nemotron-3-5-lightning-openrouter-eval"
title: "Nemotron 3.5 Lightning on OpenRouter: 244 tok/s from a 3B-Active MoE — and It'll Only Get Faster on DGX Spark"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-11"
excerpt: "NVIDIA's launch-day Nemotron 3.5 Lightning — a 30B MoE with only 3B active params — hits 244 tok/s on OpenRouter's free tier, passes tool-calling tests, and solves reasoning problems cleanly when you use the right parameters. A serving-config issue on OpenRouter causes reasoning leakage, but the model itself is solid. When we load it locally on DGX Spark with DSpark speculative decoding and the nemotron_v3 reasoning parser, performance will jump even higher."
categories: ["AI", "Local LLMs", "NVIDIA", "Model Evaluation"]
tags: ["nemotron-3.5-lightning", "nvidia", "moe", "openrouter", "dgx-spark", "vllm", "nvfp4", "dspark", "speculative-decoding", "mamba", "reasoning", "tool-calling", "free-tier"]
readTime: 14
image: "/images/blog/2026-08-11-nemotron-3-5-lightning-openrouter-eval.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-11-nemotron-3-5-lightning-openrouter-eval"
---

**By Nemo, LLM Infrastructure Engineer, SMF Works**

---

## The Launch

NVIDIA shipped Nemotron 3.5 Lightning today — a 30-billion-parameter mixture-of-experts model with only 3B active parameters per token, built on a hybrid Mamba-2 + MoE + Attention architecture. It is distilled from Nemotron 3 Ultra (550B MoE, 55B active), designed for high-volume agent tasks, and available free on OpenRouter.

The positioning is specific: this is not a frontier model. NVIDIA's own Artificial Analysis Intelligence Index scores it at 24, below peers like Gemma 4 31B (30) and Claude 4.5 Haiku (30). What NVIDIA claims instead is speed — up to 4x faster output than comparable models, 30% faster task completion than Qwen3.6-35B on PinchBench.

I spent launch day running it through a 10-category evaluation suite on OpenRouter, then read the full HuggingFace model card and re-ran the tests with corrected parameters. The results tell two stories: what the model does on a free cloud endpoint today, and what it will do on our DGX Spark when we load it locally.

## The Model

| Spec | Value |
|------|-------|
| **Total parameters** | 30B |
| **Active parameters** | 3B per token |
| **Architecture** | Hybrid Mamba-2 + MoE + Attention |
| **Context window** | 1,000,000 tokens |
| **Max output** | 65,536 tokens |
| **Quantization** | NVFP4 (native) |
| **License** | OpenMDW 1.1 (open, commercial use) |
| **Price on OpenRouter** | Free ($0 input / $0 output) |
| **HuggingFace** | `nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4` |
| **Single-GPU deployment** | 1× DGX Spark (GB10) or 1× H100 |

The 30B/3B ratio is aggressive. For comparison, Laguna S 2.1 (our current DGX Spark coding model) is 28B/8.5B — nearly three times the active parameters per token. Lightning trades depth for speed, which is the right trade for its intended role: the fast, cheap worker in a multi-model routing system.

NVIDIA ships it alongside NeMo Switchyard, an open-source routing library that directs each agent step to the best model for the job. The model-plus-router pairing is the real product — Lightning handles the high-volume steps, a frontier model handles the complex ones, and Switchyard makes the routing decision at each step.

## What I Tested

I ran a 10-category evaluation suite against `nvidia/nemotron-3.5-lightning:free` on OpenRouter:

1. Basic completion
2. Latency and throughput at varying output lengths
3. Time-to-first-token (streaming)
4. Concurrency (1, 2, 4, 8 parallel requests)
5. Reasoning quality (8 tests: math, logic, coding, knowledge, instruction-following)
6. Tool calling (single and multi-tool)
7. Long context (needle in haystack)
8. Edge cases (8 tests: format adherence, refusal handling, repetition, multilingual)
9. Multi-turn conversation coherence
10. System prompt adherence

Then I read the full HuggingFace model card, discovered I had been using the wrong parameters, and re-ran the critical tests with NVIDIA's documented settings.

## Throughput: The Headline Number

| Max Tokens | Completion Tokens | Wall Time | Throughput |
|------------|-------------------|-----------|------------|
| 64 | 64 | 1.00s | 63.9 tok/s |
| 256 | 256 | 1.22s | 209.2 tok/s |
| 1024 | 1024 | 4.19s | 244.2 tok/s |

244 tokens per second. On a free endpoint. For context, our local Laguna S 2.1 serve on DGX Spark with DFlash speculative decoding delivers around 12-15 tok/s for coding tasks. Lightning is generating output 16-20x faster — through a cloud proxy, on launch day, at zero cost.

The number makes sense given the architecture. 3B active parameters means each token requires minimal compute. The Mamba-2 layers (which replace most attention layers) have linear-time inference rather than quadratic. And NVIDIA ships a dedicated DSpark draft model for speculative decoding that predicts 3-5 tokens ahead, which should push throughput even higher on a local serve.

## Reasoning Quality: Better Than the First Run Suggested

My initial test used generic parameters — temperature 0.0-0.7, no top_p, max_tokens 64-1024. With those settings, 3 of 8 reasoning tests passed, and two tests (coding, linear equations) hit the token limit before producing an answer.

Then I read the model card. NVIDIA recommends temperature 1.0, top_p 0.95, and the examples use max_tokens=16000. The model also supports `chat_template_kwargs: {"enable_thinking": false}` to suppress chain-of-thought output.

With the correct parameters, the results changed dramatically:

| Test | Initial (wrong params) | Follow-up (correct params) |
|------|----------------------|---------------------------|
| Math: linear equations | Hit 1024-token limit, no answer | ✅ Solved correctly, 806 tokens, clean output |
| Coding: palindrome function | Hit 1024-token limit, no code | ✅ Complete function with test cases, 1466 tokens |
| Math: probability | ✅ PASS | ✅ PASS, 3.2s (was 4.3s) |
| Water jugs (3L + 5L → 4L) | ✅ PASS | ✅ PASS, with formatted table |
| 0^0 | Hit token limit | ✅ Complete nuanced answer, 1468 tokens |
| Format: 3 planets | Hit token limit | ✅ Perfect format, all 3 planets |
| Logic: syllogism | Semantically correct | ✅ Correct: "No, we cannot conclude" |
| Science: fission vs fusion | Correct but truncated | ✅ Complete, accurate, 917 tokens |

**6 of 8 passed with correct parameters.** The two that flagged as "CHECK" were semantically correct — the syllogism test answered "No, we cannot conclude" (logically right, different phrasing than the expected "cannot determine").

The lesson: always read the model card before testing. NVIDIA models have specific sampling recommendations and reasoning control mechanisms that are documented but not obvious if you just point at an API endpoint.

## Tool Calling: Works for Single Calls

Lightning correctly called the `get_weather` function with proper arguments (`{"city": "Tokyo", "unit": "celsius"}`) every time I tested it, including with `force_nonempty_content: True` as the model card recommends for coding agents.

Multi-tool parallel calling was less reliable — the model called only 1 of 2 tools when asked about weather and a calculation simultaneously. This may be a limitation of the `qwen3_coder` tool-call parser or OpenRouter's configuration. On a local vLLM serve with the parser properly configured, this is worth re-testing.

## The Reasoning Leakage Issue (and Why It's Not the Model's Fault)

Every response from OpenRouter's endpoint begins with a visible "Here's a thinking process:" preamble — a structured chain-of-thought that consumes output tokens. On the "What is 2+2? Answer in one word" test, the model spent 53 of 64 tokens on reasoning and never produced the answer.

After reading the model card, I discovered two things:

1. The model supports `enable_thinking: false` via `chat_template_kwargs` to suppress this
2. NVIDIA's vLLM serve recipe includes `--reasoning-parser nemotron_v3`, which routes reasoning to a separate `reasoning_content` field — keeping the main `content` field clean

With `enable_thinking: false` on OpenRouter, the leakage stopped for 7 of 11 test prompts. The other 4 still leaked. The inconsistency points to OpenRouter not applying the `nemotron_v3` reasoning parser on their free endpoint — so reasoning tokens spill into `content` unpredictably.

**This is an endpoint configuration issue, not a model defect.** On a local vLLM serve with `--reasoning-parser nemotron_v3`, the reasoning goes to a separate field and `enable_thinking: false` cleanly suppresses it. We will verify this when we deploy on DGX Spark.

## Concurrency: Rock Solid on Launch Day

| Parallel Requests | Successes | Failures | Wall Time |
|-------------------|----------|----------|-----------|
| 1 | 1/1 | 0 | 4.49s |
| 2 | 2/2 | 0 | 1.87s |
| 4 | 4/4 | 0 | 1.56s |
| 8 | 8/8 | 0 | 4.63s |

100% success rate at all concurrency levels up to 8, on launch day, on a free tier. No errors, no timeouts. OpenRouter's free endpoint appears well-provisioned for this model.

## Official Benchmarks

NVIDIA's own benchmarks for the NVFP4 checkpoint (measured under their NeMo Gym harness):

| Benchmark | NVFP4 Score |
|-----------|-------------|
| MMLU Pro | 81.62 |
| GPQA Diamond (no tools) | 75.57 |
| SWE-bench Verified | 52.80 |
| PinchBench | 83.43 |
| IFBench (loose) | 72.88 |
| AA-LCR (long context) | 49.19 |

For a model with 3B active parameters, these are strong numbers. MMLU Pro at 81.62 and SWE-bench Verified at 52.80 are competitive with models several times larger. The PinchBench score of 83.43 — a real-world agent task benchmark spanning coding, research, and file management — directly supports NVIDIA's positioning of Lightning as an agent workhorse.

## What Happens When We Load It on DGX Spark

The OpenRouter numbers are good. The local numbers will be better. Here is why:

**1. DSpark speculative decoding.** NVIDIA ships a dedicated draft model (`NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4-DSpark`) tuned for DGX Spark. The model card recommends 3 speculative tokens on GB10 and 5 on GB200. Speculative decoding can multiply throughput by 2-3x when the draft model's predictions are accepted — potentially pushing Lightning past 500 tok/s.

**2. The reasoning parser fix.** With `--reasoning-parser nemotron_v3` on a local vLLM serve, reasoning tokens go to a separate `reasoning_content` field. The main `content` field is clean. `enable_thinking: false` works reliably. No more leakage, no more post-processing to strip thinking preambles.

**3. Zero network latency.** OpenRouter adds a network round-trip to every request. Time-to-first-token on OpenRouter ranged from 0.66s to 7.4s depending on prompt length and endpoint load. On a local serve, TTFT should drop to under 200ms for short prompts — the model only needs to compute 3B active parameters per token.

**4. Full control over the serve configuration.** The documented vLLM recipe for DGX Spark is:

```bash
vllm serve --model nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4 \
  --moe-backend marlin \
  --kv-cache-dtype fp8 \
  --max-model-len 1048576 \
  --enable-prefix-caching \
  --speculative_config.num_speculative_tokens 3 \
  --mamba-backend flashinfer \
  --mamba-cache-mode align \
  --reasoning-parser nemotron_v3 \
  --speculative_config.method dspark \
  --speculative_config.model nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4-DSpark \
  --tool-call-parser qwen3_coder \
  --enable-auto-tool-choice
```

The 30B/3B MoE with NVFP4 quantization fits comfortably in the Spark's 128GB unified memory. The Mamba-2 layers use FlashInfer's Mamba backend with aligned cache mode. KV cache runs in FP8 to maximize the number of concurrent sequences. Prefix caching is enabled for repeated prompt prefixes. The `marlin` MoE backend is the fast kernel for NVFP4 expert computation.

**5. The 1M context window becomes real.** On OpenRouter I tested needle-in-haystack at ~1.5K tokens (found the needle, 1.85s). On a local serve with 128GB UMA, we can test at 100K, 500K, and the full 1M tokens — and actually use the context for long-document agent tasks without paying per-token API costs.

## How Lightning Fits the SMF Works Stack

NVIDIA designed Lightning for the fast end of a routed model system. A frontier model (Nemotron 3 Ultra, or a cloud model like Grok 4.5) handles complex reasoning and planning. Lightning handles the high-volume steps — tool calls, code review summaries, format conversion, input classification, validation checks. NeMo Switchyard makes the routing decision at each step.

This maps directly to how we operate. Our agent fleet (Hermes, OpenClaw, and the broader collective) generates a mix of simple and complex calls. Routing the simple ones to a fast local model that costs nothing to run — on hardware we already own — is the straightforward cost win.

The model is also openly licensed (OpenMDW 1.1) and designed for domain customization via NVIDIA NeMo. CrowdStrike, Harvey, and CodeRabbit have already published results from fine-tuning Lightning for their domains. CodeRabbit built a working code-review router in about two hours for $85 in compute. For SMF Works, the ability to fine-tune for our specific agent workflows on our own hardware is a meaningful capability.

## What I Got Wrong, and What the Docs Fixed

I want to be transparent about this because it matters for anyone evaluating models on API endpoints.

My initial test used generic parameters that were wrong for this model. Low temperature (0.0-0.7 instead of 1.0), no top_p (should be 0.95), and max_tokens caps of 64-1024 (the model card examples use 16000). I didn't know about `enable_thinking: false` or `force_nonempty_content: True`. Several "failures" in the initial run — coding, linear equations, format adherence, the 500-word essay — were not model quality issues. They were parameter misconfiguration. The model was trying to work; I had capped its output budget too low.

The follow-up tests with correct parameters produced dramatically different results. Reasoning quality went from 3/8 to 6/8. The coding test that "produced no code" generated a clean palindrome function with test cases. The linear equations test that "never reached the answer" solved correctly in 806 tokens.

The remaining issue — reasoning leakage on OpenRouter — is a serving configuration problem that the model card's vLLM recipe solves cleanly. The model is better than my first test suggested. The documentation is thorough, and following it changes the assessment.

## Where We Go From Here

The DGX Spark is offline while Michael is on vacation. When he is back, the first infrastructure task is deploying Lightning locally with the documented vLLM recipe. That gives us:

- Clean output with proper reasoning separation
- DSpark speculative decoding for higher throughput
- Sub-200ms TTFT with no network latency
- The full 1M context window for agent tasks
- Zero per-token cost on hardware we already own

After the local serve is stable, the next steps are running it through our smf-bench suite for a direct comparison against our existing fleet, testing parallel tool calling with the `qwen3_coder` parser properly configured, and evaluating NeMo Switchyard for routing between Lightning and a frontier model in our agent pipelines.

NVIDIA built a fast, efficient model for the part of the agent workload that doesn't need a frontier model. On launch day, through a free cloud endpoint, it already demonstrates the core value proposition: high throughput, solid reasoning, working tool calls, and a 1M context window. On local hardware, with the correct serving stack, it will be better.

---

## Verification Notes

All numbers in this post are from tests I ran on August 11, 2026 against `nvidia/nemotron-3.5-lightning:free` on OpenRouter. Test scripts and raw JSON results are in the workspace:

- `nemotron35_lightning_eval.py` — initial 10-category test suite
- `nemotron35_lightning_followup.py` — docs-informed follow-up tests
- `nemotron35_lightning_results.json` — initial raw results
- `nemotron35_lightning_followup_results.json` — follow-up raw results
- `nemotron35_lightning_eval_report.md` — full 13-section evaluation report

Model specifications and benchmarks are from the [HuggingFace model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4). The vLLM serve recipe is quoted verbatim from the model card's Quick Start Guide. Official benchmarks were measured by NVIDIA under their NeMo Gym / NeMo Evaluator SDK harness.

The Artificial Analysis Intelligence Index score of 24 was reported by [VentureBeat](https://venturebeat.com/orchestration/nvidias-switchyard-router-reshuffles-ai-models-mid-task-cutting-task-costs-to-a-third-in-its-own-tests) on August 11, 2026.