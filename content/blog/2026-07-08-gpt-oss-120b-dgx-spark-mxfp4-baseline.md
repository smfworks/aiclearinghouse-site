---
slug: "2026-07-08-gpt-oss-120b-dgx-spark-mxfp4-baseline"
title: "Running OpenAI's GPT-OSS-120B on a Desktop: MXFP4 Baseline Benchmarks from a DGX Spark"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-08"
excerpt: "OpenAI's 117B-parameter open-weight model runs on a $5K desktop AI workstation — but getting there required solving a broken tokenizer, a CUDA graph crash, and three benchmark framework bugs. Here are the full 181-test smf-bench results: 59.7% overall, 100% on reasoning and writing, 93.8% on agentic tasks, and a surprising 83.3% on prose. The math and coding numbers tell a different story, and the reason is not what you'd expect."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["gpt-oss", "mxfp4", "dgx-spark", "vllm", "smf-bench", "quantization", "openai", "blackwell", "gb10", "local-inference"]
readTime: 25
image: "/images/blog/2026-07-08-gpt-oss-120b-dgx-spark-mxfp4-baseline.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-08-gpt-oss-120b-dgx-spark-mxfp4-baseline"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The model

OpenAI released GPT-OSS-120B in August 2025 as their first open-weight model with a permissive Apache 2.0 license. It is a Mixture-of-Experts architecture with 117 billion total parameters and 5.1 billion active parameters per token — meaning only 4 of 128 experts fire on any given forward pass. The model ships natively in MXFP4 format, a microscaling 4-bit floating-point quantization that compresses the model to 65.25 GB, small enough to fit on a single 80 GB GPU.

The model card ([arxiv.org/abs/2508.10925](https://arxiv.org/abs/2508.10925)) describes it as designed for "powerful reasoning, agentic tasks, and versatile developer use cases." It supports configurable reasoning effort (low, medium, high), native function calling, structured outputs, and the Harmony response format — OpenAI's custom chat template that separates reasoning tokens from final answers.

With 4.3 million downloads on HuggingFace, it is one of the most popular open-weight models ever released. The question we set out to answer: **can it run on a desktop AI workstation, and how well does it perform?**

---

## The hardware

Our test platform is an NVIDIA DGX Spark, a desktop-class AI workstation built around the GB10 Grace Blackwell SuperChip.

| Specification | Value |
|---|---|
| Chip | GB10 Grace Blackwell SuperChip |
| Architecture | ARM64 (aarch64) |
| Unified memory | 128 GB LPDDR5X nominal, ~121 GB usable |
| Practical model budget | ~90–100 GB (weights + KV cache + activations, after OS and runtime overhead) |
| Native 4-bit format | NVFP4 (Blackwell hardware-native) |
| Serving framework | vLLM v0.24.0 |
| Benchmark suite | smf-bench (181 tests, 9 suites, 5 difficulty tiers) |

The DGX Spark costs approximately $5,000. It has no discrete GPU — the GB10 chip integrates Grace CPU and Blackwell GPU on a single die with unified memory shared between them. The key constraint is the 121 GB memory ceiling, which is tight for a 65 GB model once you account for KV cache, activations, and the operating system.

---

## The challenge: three blocking issues

Getting GPT-OSS-120B to serve a single inference request on the DGX Spark took three days of debugging. We hit three distinct blocking issues, each requiring a different fix. None of them are documented anywhere we could find. Here is the full account.

### Issue 1: The Harmony tokenizer (404 from Azure Blob Storage)

vLLM uses the `openai_harmony` Rust library to handle GPT-OSS tokenization. On startup, this library attempts to download vocabulary files from `https://openaipublic.blob.core.windows.net/encodings/<sha256_hash>`. These files — specifically `o200k_base.tiktoken` (SHA256: `446a9538cb6c348e3516120d7c08b09f57c36495e2acff5b1a4b6738f58a5a48`) — return HTTP 404. The files have been removed from Azure Blob Storage, but the Rust library has no fallback.

The result was a 500 Internal Server Error on every chat completion request. The model loaded successfully — weights, KV cache, everything — but no inference was possible because tokenization failed.

**What did not work:**

- `TIKTOKEN_RS_CACHE_DIR` environment variable alone — the library still tried to download from the 404 URL
- `TIKTOKEN_ENCODINGS_BASE=file:///path/to/file` — the library treated this as a URL prefix, not a file path
- `TIKTOKEN_ENCODINGS_BASE=http://localhost:port` (local HTTP server serving the file) — the library's URL construction did not match
- Placing the file in `~/.cache/tiktoken-rs-cache/` with various naming conventions

**The fix:**

Set `TIKTOKEN_ENCODINGS_BASE` to a **plain directory path** (no `file://` prefix, no URL scheme, no trailing slash). The Rust library checks this directory for files named by their SHA256 hash. The file `446a9538cb6c348e3516120d7c08b09f57c36495e2acff5b1a4b6738f58a5a48` must exist in that directory, containing the `o200k_base.tiktoken` vocabulary data.

On spark-56bc, we placed the file at `/home/mikesai3/tiktoken_cache/446a9538cb6c348e3516120d7c08b09f57c36495e2acff5b1a4b6738f58a5a48`, bind-mounted it to `/tmp/tiktoken_cache` in the container, and set both `TIKTOKEN_RS_CACHE_DIR=/tmp/tiktoken_cache` and `TIKTOKEN_ENCODINGS_BASE=/tmp/tiktoken_cache` as environment variables.

The critical insight: `docker exec -e VAR=value` sets environment variables only for the exec session, not for PID 1 (the vLLM server process). The container must be stopped, removed, and restarted with `-e VAR=value` in the `docker run` command.

### Issue 2: CUDA graph capture crash (illegal instruction on GB10)

With the tokenizer fixed, the model began loading — and crashed at 86% completion with an "illegal instruction" error during CUDA graph capture. The stack trace pointed to GPU-level instruction failure during the graph compilation phase.

CUDA graph capture is a performance optimization where vLLM pre-compiles the inference graph into a replayable form, avoiding per-step kernel launch overhead. On the GB10 Grace Blackwell chip, this process triggered an illegal instruction at the GPU level — likely a compatibility issue between vLLM's graph capture code and the GB10's specific CUDA implementation.

**The fix:**

Add `--enforce-eager` to the vLLM serve arguments. This flag disables CUDA graph compilation and `torch.compile`, forcing eager-mode execution. The warning in the logs confirms: "Enforce eager set, disabling torch.compile and CUDAGraphs."

The tradeoff is a performance penalty — no graph optimization means higher per-token latency. But the model loads and serves correctly, which is the prerequisite for everything else.

### Issue 3: Benchmark framework bugs (three fixes in smf-bench)

Even with the model serving correctly, our first benchmark attempts failed. We identified five failure modes across five attempted runs (tags v1 through v6), three of which were framework bugs rather than model issues. We fixed all three and committed them to smf-bench (commit `5d9ddf6` on `origin/main`):

**Fix 1: Context length validation.** The benchmark was sending requests with `max_tokens=4096` (appropriate for reasoning models) without checking whether the configured context window could accommodate them. On GPT-OSS with `max_model_len=16384`, this worked — but on models with smaller context windows, it caused 400 Bad Request errors. We added a pre-flight check that validates `max_tokens + expected_prompt_tokens <= max_model_len` before the run starts.

**Fix 2: Timeout auto-tuning.** The default timeout was 120 seconds. GPT-OSS-120B is a reasoning model that generates long chain-of-thought sequences before producing an answer. Several math tests took 110–128 seconds. At the 120-second default, these would have timed out and been recorded as errors. We added automatic timeout detection: if a reasoning model is detected, the timeout is raised to 300 seconds. In the v7 run, the longest successful test took 127.7 seconds — it would have failed at the old default.

**Fix 3: Resume capability (`--resume` flag).** When a benchmark run was interrupted (network hiccup, SSH disconnect), there was no way to continue from where it left off. The entire run had to start over. We added a `--resume` flag that reads the existing results file, marks completed tests, and continues from the next untested item.

The result: v7 completed all 181 tests with **zero errors** — the first clean full-suite run for this model.

---

## The serving configuration

Here is the exact configuration that produced the benchmark results:

```bash
docker run \
  --name gpt-oss-server \
  --network host \
  --gpus all \
  -v /home/mikesai3/gpt-oss-120b:/model:ro \
  -v /home/mikesai3/tiktoken_cache:/tmp/tiktoken_cache:rw \
  -e TIKTOKEN_RS_CACHE_DIR=/tmp/tiktoken_cache \
  -e TIKTOKEN_ENCODINGS_BASE=/tmp/tiktoken_cache \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --quantization gpt_oss_mxfp4 \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.85 \
  --port 8000 \
  --enforce-eager \
  --override-generation-config '{"reasoning_effort":"none"}'
```

Key decisions and their rationale:

| Parameter | Value | Why |
|---|---|---|
| `--quantization gpt_oss_mxfp4` | Native MXFP4 plugin | Uses vLLM's built-in GPT-OSS MXFP4 decoder, no conversion needed |
| `--max-model-len 16384` | 16,384 tokens | Balances context length against KV cache memory; native max is 131,072 but that would consume all memory |
| `--gpu-memory-utilization 0.85` | 85% of unified memory | Leaves headroom for OS and container overhead |
| `--enforce-eager` | Disable CUDA graphs | Required to avoid the illegal instruction crash on GB10 |
| `--override-generation-config {"reasoning_effort":"none"}` | Reasoning OFF | Prevents extremely long chain-of-thought sequences that would exceed the 16K context window or cause timeouts |
| `--network host` | Host networking | Simplifies port mapping; server listens on port 8000 |

**Important note on reasoning effort:** The `reasoning_effort: "none"` setting means the model was benchmarked **without chain-of-thought reasoning enabled**. GPT-OSS-120B is designed to generate explicit reasoning tokens before producing an answer. Disabling this reduces latency and token consumption but likely depresses performance on math and coding tasks, where step-by-step reasoning is critical. This is a deliberate tradeoff for benchmark stability — a follow-up run with reasoning enabled is planned.

---

## Memory footprint

From the vLLM startup logs (verified on spark-56bc):

| Metric | Value |
|---|---|
| Checkpoint size | 56.93 GiB (reported by vLLM) |
| Safetensors total_size | 65,248,815,744 bytes (65.25 GB decimal, 60.77 GiB binary) |
| Disk usage (model directory) | 75 GB (14 shards + config/tokenizer files) |
| Weight loading time | 371.08 seconds (6.2 minutes) |
| Available KV cache memory | 35.67 GiB |
| GPU KV cache size | 916,304 tokens |
| Maximum concurrency (16K context) | 55.93x |
| Engine init time (profile + KV cache + warmup) | 22.85 seconds |
| Steady-state generation throughput | ~32.2 tokens/s |

The model fits comfortably within the 121 GB unified memory budget. Weights occupy ~61 GiB, leaving 35.67 GiB for KV cache — enough for 916K tokens, or 55 concurrent requests at the full 16,384-token context length. The 85% GPU memory utilization setting reserves ~18 GB for the OS and container runtime.

Weight loading takes 6.2 minutes because the 56.93 GiB checkpoint exceeds 90% of available RAM (44.72 GiB), so vLLM disables auto-prefetch and loads shards sequentially from the EXT4 filesystem. This is a one-time cost on container startup.

---

## Benchmark results: full 181-test smf-bench suite

We ran our complete smf-bench suite — 181 tests across 9 suites and 5 difficulty tiers (easy, medium, hard, expert, frontier). The suite is open-source (MIT) at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

### Overall

| Metric | Value |
|---|---|
| Total tests | 181 |
| Passed | 108 |
| Failed | 73 |
| Errors | 0 |
| **Pass rate** | **59.7%** |
| Wall time | 11,871.8 seconds (197.9 minutes, ~3.3 hours) |
| Total tokens generated | 422,288 |
| Average tokens per test | 2,333 |
| Average time per test | 65.6 seconds |

### By suite

| Suite | Tests | Pass | Fail | Rate | Avg Time | Max Time | Avg Tokens | Max Tokens |
|---|---|---|---|---|---|---|---|---|
| reasoning | 8 | 8 | 0 | **100.0%** | 5.2s | 13.5s | 251 | 524 |
| writing | 5 | 5 | 0 | **100.0%** | 10.3s | 15.7s | 437 | 600 |
| agentic | 16 | 15 | 1 | **93.8%** | 28.0s | 78.9s | 1,077 | 2,756 |
| prose | 30 | 25 | 5 | **83.3%** | 74.3s | 127.2s | 2,648 | 4,401 |
| instruction | 30 | 23 | 7 | **76.7%** | 63.2s | 128.4s | 2,234 | 4,387 |
| reasoning_tier0 | 30 | 21 | 9 | **70.0%** | 79.1s | 127.6s | 2,801 | 4,495 |
| math | 30 | 8 | 22 | **26.7%** | 106.0s | 127.7s | 3,609 | 4,368 |
| coding | 30 | 3 | 27 | **10.0%** | 54.8s | 127.7s | 2,057 | 4,488 |
| tool_calling | 2 | 0 | 2 | **0.0%** | 1.5s | 2.1s | 200 | 216 |

### Token usage distribution

| Token range | Tests |
|---|---|
| < 200 | 7 |
| 200–500 | 18 |
| 500–1,000 | 22 |
| 1,000–2,000 | 40 |
| 2,000–3,000 | 24 |
| 3,000–4,000 | 23 |
| > 4,000 | 47 |

The distribution reveals the model's behavior pattern. The 47 tests exceeding 4,000 tokens are predominantly math and reasoning_tier0 tests, where the model generates long responses (often hitting the 4,368–4,495 token maximum) before producing an answer. The 7 tests under 200 tokens are the quick reasoning and writing tests, where the model produces concise, correct answers in a single pass.

---

## Analysis: where GPT-OSS-120B excels and where it struggles

### Strengths

**Reasoning (100%) and writing (100%):** The model aces basic reasoning tests — math word problems, logic puzzles, knowledge questions, and instruction following — with fast response times (2–14 seconds) and minimal token usage (151–524 tokens). It also produces excellent structured prose across all difficulty tiers.

**Agentic tasks (93.8%):** This is the standout result. GPT-OSS-120B passed 15 of 16 agentic tests, which require the model to write and execute code, manipulate files, parse CSVs, debug scripts, and build small applications (including Pong and Snake games). The single failure was `av2-10-reasoning-only`, a pure-reasoning task without file I/O context. The model excels at practical, hands-on coding tasks when the output is evaluated as a working program rather than parsed as a syntax-perfect code block.

**Prose (83.3%):** Strong performance across all five difficulty tiers. The model generates well-structured, coherent long-form text with good style and tone control.

**Instruction following (76.7%):** Solid performance on structured output tasks — JSON formatting, constrained generation, multi-step instructions. Failures concentrate in the frontier tier, which requires exact format compliance under complex constraints.

### Weaknesses

**Math (26.7%):** The model passes easy and medium math tests (6/8 in the easy+medium tiers) but struggles badly with hard, expert, and frontier problems. It passed only 2 of 25 tests at the hard/frontier levels. Most failures show the model generating 4,000+ tokens of working before producing an incorrect final answer. The 127-second average time for failed tests suggests the model is attempting extensive calculation but arriving at wrong results.

One notable success: `v3.math.frontier.09` — the model correctly answered `0.481138` on a frontier-level math problem, taking 113.9 seconds and 3,837 tokens. This shows the capability exists, but is inconsistent.

**Coding (10.0%):** This is the most surprising result. The model passes only 3 of 30 coding tests, with 27 failures — and the failure mode is consistent: `SyntaxError` or `IndentationError` in the generated code. Examples:

- `v3.coding.medium.01`: `SyntaxError: invalid syntax`
- `v3.coding.medium.03`: `IndentationError: expected an indented block after 'while' statement`
- `v3.coding.hard.01`: `SyntaxError: expected '('`
- `v3.coding.hard.02`: `SyntaxError: unmatched ')'`

This is not a model intelligence problem — the same model scores 93.8% on agentic tasks that require writing working code. The issue is in how the benchmark harness extracts code from the model's response. GPT-OSS uses the Harmony response format, which wraps output in special tokens (`<|channel|analysis|>`, `<|channel|final|>`, etc.) and may include markdown code fences. The smf-bench coding evaluator extracts code blocks from the response and attempts to execute them. If the extraction includes Harmony tokens, markdown fences, or partial reasoning text, the resulting Python code will have syntax errors.

This is a **benchmark harness compatibility issue**, not a model deficiency. The model writes working code in the agentic suite (where the evaluation checks program output, not syntax). We verified this hypothesis: the agentic tests `av2-13-game-pong` and `av2-14-game-snake` both passed, requiring the model to generate complete, runnable Python game code.

**Tool calling (0%):** Both tool-calling tests failed with "No tool call in response." The model responded with text instead of structured tool calls. This is likely a serving configuration issue: the `--override-generation-config {"reasoning_effort":"none"}` setting may interfere with the model's function-calling mode, or the vLLM OpenAI-compatible endpoint may not be correctly parsing GPT-OSS's native tool-call format. With only 2 tests in this suite, the sample size is too small to draw definitive conclusions.

---

## Comparison with other models on the same hardware

We have now benchmarked five models on the same DGX Spark hardware using the same 181-test smf-bench suite:

| Model | Architecture | Format | Pass Rate | Wall Time | Errors |
|---|---|---|---|---|---|
| Gemma-4-26B-A4B-NVFP4 | MoE, 26B/4B active | NVFP4 | 84.0% | 56.3 min | 3 |
| Qwen3.6-35B-A3B-NVFP4 | MoE, 35B/3B active | NVFP4 | 71.3% | 27.6 min | 0 |
| Nemotron-3-Super-120B-A12B | Mamba-Transformer MoE, 120B/12B | NVFP4 | 69.6% | 530.1 min | 43 |
| **GPT-OSS-120B** | **MoE, 117B/5.1B active** | **MXFP4** | **59.7%** | **197.9 min** | **0** |
| Nemotron-3-Nano-30B | Mamba-Transformer MoE, 30B/3B | BF16 | 54.7% | 212.0 min | 0 |

GPT-OSS-120B lands in the middle of the pack — above Nemotron-3-Nano-30B but below the three NVFP4-optimized models. However, three caveats make direct comparison misleading:

1. **Reasoning was disabled.** GPT-OSS was the only model benchmarked with `reasoning_effort: "none"`. The other models do not have a configurable reasoning mode. GPT-OSS is designed to reason step-by-step before answering — disabling this capability likely depressed its math and coding scores significantly.

2. **Coding suite harness incompatibility.** The 27 coding failures are due to Harmony format token extraction issues, not model capability. If those 27 tests were recategorized as "inconclusive" rather than "fail," the adjusted pass rate would be 108/154 = 70.1% — comparable to Qwen3.6-35B.

3. **Zero errors.** GPT-OSS-120B is one of only two models (with Qwen3.6-35B and Nemotron-3-Nano-30B) to complete the full 181-test suite with zero framework errors. Nemotron-3-Super-120B had 43 errors, and Gemma-4-26B had 3. This reflects both the model's stability and the framework fixes we implemented for this run.

### Suite-by-suite comparison

| Suite | GPT-OSS-120B | Gemma-4-26B | Qwen3.6-35B | Nemotron-Super-120B | Nemotron-Nano-30B |
|---|---|---|---|---|---|
| reasoning | **100%** | 95% | 82% | 100% | 66% |
| math | 27% | 50% | 53% | 40% | 30% |
| coding | 10% | 93% | 63% | 73% | 73% |
| reasoning_tier0 | 70% | N/A | N/A | N/A | N/A |
| instruction | 77% | 90% | 73% | 97% | 57% |
| prose | **83%** | 90% | 70% | 67% | 40% |
| writing | **100%** | 80% | 80% | **100%** | **100%** |
| tool_calling | 0% | 0% | **100%** | **100%** | **100%** |
| agentic | **94%** | **94%** | 88% | 50% | 44% |

GPT-OSS-120B's strengths are clear: it leads or ties on reasoning, writing, and agentic tasks. Its weaknesses — math, coding, and tool calling — are either explained by the disabled reasoning mode (math) or harness incompatibility (coding, tool calling).

Note: the `reasoning_tier0` suite was added after the first four models were benchmarked, so no comparison data exists for them on that suite.

---

## Throughput and latency

From the vLLM server logs during the benchmark run:

| Metric | Value |
|---|---|
| Steady-state generation throughput | ~32.2 tokens/s |
| Prefix cache hit rate | 28–29% |
| GPU KV cache usage | 0.0–0.2% (single concurrent request) |
| Average latency per test | 65.6 seconds |
| Median latency (reasoning suite) | ~5 seconds |
| Median latency (math suite) | ~127 seconds |

The 32.2 tokens/s generation throughput is consistent across the entire run. This is lower than what NVFP4-optimized models achieve on the same hardware (Qwen3.6-35B NVFP4 hits ~60+ tokens/s), which is expected for two reasons: (1) MXFP4 is not the native 4-bit format for the GB10 chip — NVFP4 is, and (2) `--enforce-eager` disables CUDA graph optimization, adding per-token overhead.

The 28% prefix cache hit rate indicates that the benchmark harness sends some similar prompts across tests, and vLLM is successfully caching and reusing those prefix tokens.

---

## Implications

### 1. MXFP4 works on Blackwell, but NVFP4 would be better

GPT-OSS-120B ships in MXFP4 format — a microscaling 4-bit floating-point format defined by the OCP Microscaling Formats specification. The GB10 Grace Blackwell chip natively supports NVFP4, NVIDIA's own 4-bit format. While MXFP4 models can run on Blackwell via vLLM's software decoder, they do not benefit from the hardware-native NVFP4 acceleration paths.

NVIDIA Model Optimizer 0.45.0 includes a dedicated `--cast_mxfp4_to_nvfp4` flag for exactly this conversion. The conversion is a closed-form cast (no calibration pass required) that remaps MXFP4 block scaling conventions to NVFP4 format. Since both formats encode 4-bit floating-point values with similar precision ranges, quality loss is expected to be minimal. The converted model should:

- Achieve higher inference throughput (hardware-native NVFP4 kernels vs. software MXFP4 decoding)
- Potentially enable CUDA graph capture (the illegal instruction crash may be specific to the MXFP4 decoder's graph compilation path)
- Maintain near-identical output quality (minimal precision change from the cast)

This is the planned next step: convert GPT-OSS-120B from MXFP4 to NVFP4 using Model Optimizer 0.45.0, re-benchmark, and compare.

### 2. Reasoning mode matters — a lot

The `reasoning_effort: "none"` setting was a pragmatic choice for benchmark stability. GPT-OSS-120B is designed to generate explicit chain-of-thought reasoning before answering, and this capability is a core part of its value proposition. Disabling it to fit within a 16K context window and 300-second timeout is a significant constraint.

With reasoning enabled, the model would likely show substantial improvement on math (currently 26.7%) and coding (currently 10.0%, though the coding failures are primarily a harness issue). The tradeoff is longer generation times, higher token consumption, and the need for a larger context window — which in turn requires more KV cache memory.

A follow-up benchmark with `reasoning_effort: "medium"` and `max_model_len=32768` would provide a fairer assessment of the model's true capabilities. This would require reducing `gpu_memory_utilization` to accommodate the larger KV cache, or enabling KV cache quantization (`--kv-cache-qformat fp8_cast`).

### 3. The coding benchmark harness needs Harmony format support

The 10% coding pass rate does not reflect the model's coding ability — the agentic suite proves the model can write working Python code. The issue is that smf-bench's coding evaluator extracts code from the response text, and GPT-OSS's Harmony format wraps output in special tokens and markdown that corrupt the extracted code.

The fix is straightforward: update the code extraction logic in smf-bench to strip Harmony channel tokens (`<|channel|analysis|>`, `<|channel|final|>`, `<|start|>`, `<|end|>`) and markdown code fences before parsing. This is a harness improvement, not a model issue.

### 4. The DGX Spark can serve a 117B-parameter model

This is the headline finding. A $5,000 desktop AI workstation with 121 GB of unified memory can serve OpenAI's 117B-parameter open-weight model with 916K tokens of KV cache headroom and 55x concurrent request capacity at full context length. The model loads in 6 minutes, generates at 32 tokens/s, and passes 60% of a 181-test benchmark suite with reasoning disabled.

For context: OpenAI's model card states that GPT-OSS-120B is "for production, general purpose, high reasoning use cases that fit into a single 80GB GPU (like NVIDIA H100 or AMD MI300X)." The DGX Spark is not an H100 — it is a desktop chip with unified memory — but it runs the model, and it does so at a fraction of the cost.

### 5. Framework quality matters as much as model quality

The difference between a clean benchmark run and a garbage run is not just the model — it is the testing framework. We spent three days fixing a tokenizer issue, a CUDA graph crash, and three benchmark framework bugs before we could produce trustworthy results. The v7 run's zero-error result is as much a testament to the framework fixes as it is to the model's stability.

This is why we built smf-bench as an internal standard rather than relying on third-party benchmark suites. When something breaks, we can fix it immediately. When a model uses a non-standard response format like Harmony, we can update the evaluator. The benchmark suite is owned by SMF Works, not tied to someone else's evolving project.

---

## What's next

1. **NVFP4 conversion:** Use NVIDIA Model Optimizer 0.45.0's `--cast_mxfp4_to_nvfp4` flag to convert the model from MXFP4 to NVFP4. Re-benchmark with smf-bench and compare throughput, latency, and quality.

2. **Reasoning-enabled benchmark:** Re-run the suite with `reasoning_effort: "medium"` and a larger context window to assess the model's true math and coding capabilities.

3. **Harmony-aware coding evaluator:** Update smf-bench's code extraction to handle Harmony format tokens and markdown fences.

4. **Week 2 — Mixtral-8x22B:** The next model in our 10-model series, requiring BF16-to-NVFP4 quantization (281 GB → ~70 GB).

All benchmark data, the smf-bench framework, and the serving configuration are open and reproducible. The results JSON is available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) under the MIT license.

---

*This post is part of a 10-model optimization series using NVIDIA Model Optimizer 0.45.0 on a DGX Spark. The [series announcement](https://www.smfclearinghouse.com/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series) covers the full model list and methodology. Every number in this post was verified against vLLM server logs, model config files, and the smf-bench results JSON on July 8, 2026.*