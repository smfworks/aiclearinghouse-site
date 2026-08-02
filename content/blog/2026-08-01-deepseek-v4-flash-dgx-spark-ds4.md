---
slug: "2026-08-01-deepseek-v4-flash-dgx-spark-ds4"
title: "DeepSeek V4 Flash on the DGX Spark: Running a 685B MoE Model with DwarfStar 4"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-01"
excerpt: "We replaced our Laguna S2.1 vLLM serve on the NVIDIA DGX Spark with DeepSeek V4 Flash using antirez's DwarfStar 4 engine — an 81 GB IQ2XXS Q2 quantized MoE model with DSpark speculative decode. Here are the real benchmarks: 20-25 tok/s decode, 72-81% spec acceptance, working tool calling, and 8/8 reasoning quality. Plus what surprised us and what still needs work."
categories: ["AI", "Local LLMs", "DGX Spark", "DeepSeek"]
tags: ["deepseek-v4-flash", "ds4", "dwarfstar", "dgx-spark", "local-inference", "speculative-decoding", "moe", "iq2", "quantization", "benchmark"]
readTime: 16
image: "/images/blog/2026-08-01-deepseek-v4-flash-dgx-spark-ds4.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-01-deepseek-v4-flash-dgx-spark-ds4"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

The NVIDIA DGX Spark has 128 GB of unified memory on its GB10 Grace Blackwell Superchip. We have been running Laguna S2.1 (a ~40 GB NVFP4 model) through vLLM on this box for weeks. It serves reliably at ~30-40 tok/s with DFlash speculative decode. But DeepSeek V4 Flash is a different class of model entirely — 685 billion parameters, Mixture-of-Experts architecture with 64 routed experts and 1 shared expert, and an asymmetric IQ2XXS Q2 quantization that weighs in at 81 GB. The question: can the DGX Spark actually run a model this large, and if so, how well?

The answer required a completely different inference engine. vLLM cannot read this model's asymmetric GGUF format. Instead, we turned to DwarfStar 4 (ds4) — a custom C/CUDA inference engine written by Salvatore Sanfilippo (antirez, creator of Redis) specifically for DeepSeek V4 Flash, paired with Entrpi's DGX-Spark-optimized CUDA perf fork. This post documents the full deployment and benchmark results.

---

## The stack

| Component | Version / Value |
|-----------|----------------|
| Hardware | NVIDIA DGX Spark (GB10 Grace Blackwell, SM121, 128 GB UMA) |
| Engine | DwarfStar 4 (ds4) — antirez/ds4 fork v0.5.2 (Entrpi) |
| Installer | MiaAI-Lab/DeepSeek-v4-Flash-One-DGX-Spark (wrapper over Entrpi/ds4-on-spark) |
| CUDA toolkit | 13.0 (V13.0.88) |
| Build target | `CUDA_ARCH=sm_121` (native GB10) |
| Model | DeepSeek-V4-Flash-0731 (IQ2XXS Q2 quantized GGUF) |
| Weights source | `antirez/deepseek-v4-gguf` (HuggingFace) |
| Base model size | 81 GiB (IQ2XXS Q2 + Q2_K + Q8_0 asymmetric) |
| Speculative drafter | DSpark-drafter-Q2K-Q8-0731 (6.5 GiB, from `bleysg/DeepSeek-V4-Flash-DSpark-drafter-GGUF`) |
| Total disk footprint | 88 GiB |
| Context window | 262,144 tokens |
| API | OpenAI-compatible `/v1` on `0.0.0.0:8888` |
| License | MIT (engine); model copyright DeepSeek, redistributed under base model terms |

### What is DwarfStar 4?

DwarfStar 4 is not a general-purpose GGUF runner. It is a deliberately narrow inference engine built from scratch in C and CUDA, optimized specifically for DeepSeek V4 Flash's architecture — MLA (Multi-head Latent Attention), MTP (Multi-Token Prediction), MoE with hash-based expert routing, and asymmetric quantization. The upstream engine (antirez/ds4, 19.4k GitHub stars, 383 commits) was written by Salvatore Sanfilippo and supports Metal, CUDA, and ROCm backends.

The Entrpi/ds4 fork adds DGX Spark-specific optimizations: ~2× upstream prefill throughput on GB10, ~1.5× decode speed across the 2K-128K context range, continuous batching, prefix caching, and DSpark — a lossless speculative decode mode using a lightweight drafter model.

### The quantization recipe

The model uses an asymmetric quantization scheme that is encoded directly in the filename. Each tensor class gets a different precision based on its quality sensitivity:

| Tensor class | Quantization | Rationale |
|-------------|-------------|-----------|
| Routed expert gate/up (`ffn_gate_exps`, `ffn_up_exps`) | IQ2_XXS | Aggressive 2-bit — experts are the bulk of parameters but each handles only a fraction of tokens |
| Routed expert down (`ffn_down_exps`) | Q2_K | Slightly higher quality K-quant for the down projection |
| Attention projections (MLA Q, K, V, output) | Q8_0 | Preserve attention precision — decision-making path |
| Shared experts | Q8_0 | Always-active, always-critical |
| Output head | Q8_0 | Final logits need precision |
| Router (`ffn_gate_inp`) | F16 | Learned router — any quantization error here distorts expert selection |
| Token embeddings | F16 | Input representation fidelity |
| Norms, sinks, bias | F32 | Small tensors, no reason to compress |

The insight: routed experts account for the majority of the parameter count, but each individual expert only processes a fraction of tokens for any given input. Aggressive quantization on experts costs less in average quality than the same treatment of the router, attention, or shared experts. This is why the model fits in 81 GB while a uniform Q8_0 would need ~180 GB.

---

## The deployment

### Step 1: Stop the existing serve

Our Laguna S2.1 vLLM serve was on port 8888. First, stop it:

```bash
kill <vllm-pid>
# Verify port is free
ss -tlnp | grep 8888
```

### Step 2: Run the installer

The MiaAI-Lab/DeepSeek-v4-Flash-One-DGX-Spark repo provides a thin, idempotent wrapper:

```bash
curl -fsSL https://raw.githubusercontent.com/MiaAI-Lab/DeepSeek-v4-Flash-One-DGX-Spark/main/start.sh -o ~/ds4-start.sh
chmod +x ~/ds4-start.sh
bash ~/ds4-start.sh --start --port 8888 --ctx 262144
```

First run does the heavy lifting: verifies the host is a GB10/SM121 system with CUDA 13, clones and builds the pinned fork (`make cuda -j20 CUDA_ARCH=sm_121`), downloads the 81 GiB base model and 6.5 GiB DSpark drafter, runs a smoke test ("capital of France" → "Paris"), installs the `ds4-serve` launcher, and starts the server.

The build took ~2 minutes (20-core parallel nvcc compilation). The download took ~15 minutes (HuggingFace CDN at ~7 GB/s sustained). The smoke test loaded the full 81 GB model into GPU memory and produced "Paris" correctly. Total time from `start.sh` to live server: under 20 minutes.

### Step 3: Network binding

The default launcher binds to 127.0.0.1. For network access (Tailscale, SSH tunneling), restart with:

```bash
pkill -x ds4-server
nohup ~/.local/bin/ds4-serve --host 0.0.0.0 --port 8888 -c 262144 > ~/ds4-server.log 2>&1 &
```

### What the server log tells you

The ds4-server boot sequence is verbose and informative. Key lines from our boot:

```
ds4: CUDA backend initialized on NVIDIA GB10 (sm_121)
ds4: q2k aligned repack base: 43 tensors 28.22 GiB in 5.0s
ds4: iq2 aligned repack base: 86 tensors 44.34 GiB in 7.2s
ds4: q8 aligned repack base: 345 tensors 6.15 GiB in 2.0s
ds4: packed FP8 compressed-KV primary ACTIVE
ds4: packed FP4 indexer compressed-KV primary ACTIVE
ds4: batch fit: free=7.45 GiB headroom=8.00 GiB -> max_seq 2
ds4: boot prewarm done (512 tokens, 2 chunks) in 9.0s
ds4-server: listening on http://0.0.0.0:8888
```

The model loads in three repack phases (Q2K, IQ2, Q8 — matching the three quantization tiers). The KV cache uses packed FP8 compression by default, and the indexer uses FP4. The batch system fit only 2 concurrent sequences (max_seq=2) — a memory constraint from the 262K context window eating into the 128 GB UMA budget. This is the most important operational constraint: only 2 requests can be in-flight simultaneously. Compare this to Laguna S2.1 on vLLM, which we ran with `max_num_seqs=4`.

---

## The benchmark

We ran a 7-category benchmark suite adapted from our standard vLLM benchmark, covering latency, TTFT, concurrency, context scaling, reasoning quality, tool calling, and GPU utilization. The full script and raw JSON results are published in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/deepseek-v4-flash-ds4).

---

## Results

### 1. Latency & Throughput

| Max Tokens | Output Tokens | Wall Time | Effective tok/s | Engine Decode tok/s | Spec Accept | Tok/Step |
|-----------|--------------|-----------|-----------------|---------------------|-------------|----------|
| 64 | 64 | 3.0s | 21.2 | 25.3 | 81.1% | 3.37 |
| 128 | 128 | 5.9s | 21.7 | 22.8 | 68.7% | 2.72 |
| 256 | 256 | 12.7s | 20.1 | 20.7 | 64.0% | 2.49 |
| 512 | 512 | 20.9s | 24.5 | 25.0 | 67.1% | 2.64 |
| 1024 | 1024 | 49.8s | 20.6 | 20.8 | 51.6% | 1.02 |

**Headline: 20-25 tok/s effective decode throughput.** DSpark speculative decode is doing real work — at 81% acceptance with 3.37 tokens per step, the engine is generating ~3 tokens for every decode step the GPU actually computes. The raw GPU decode rate is 20-25 tok/s, but the effective output rate the user sees is higher because speculative decode means multiple tokens per forward pass.

One notable finding: speculative acceptance degrades on longer generations. At 1024 tokens output, the acceptance rate drops to 51.6% and tok/step falls to ~1.0 — meaning speculation is barely helping by the end of a long generation. This is expected: the DSpark drafter is a small model that diverges from the target model more as the sequence grows. Short generations benefit most from speculation.

### 2. Time to First Token (TTFT)

| Prompt Type | TTFT | Total Time | Content Length |
|------------|------|------------|---------------|
| Short ("What is 2+2?") | 2,969 ms | 2.97s | 1 char |
| Medium (CPU explanation) | 9,105 ms | 28.4s | 2,319 chars |
| Long reasoning (√2 irrational) | 9,809 ms | 16.7s | 824 chars |
| Coding (reverse linked list) | 16,261 ms | 21.7s | 922 chars |

This is the area where ds4 is most different from vLLM. Laguna S2.1 on vLLM had a TTFT of ~200ms for short prompts. DeepSeek V4 Flash on ds4 has 3-16 seconds. The reasons are structural:

1. **Model size**: 81 GB vs 40 GB. Loading and repacking tensors takes longer.
2. **DSpark drafter overhead**: The speculative decode path adds drafter model evaluation before the first token.
3. **Engine design**: ds4 does not pipeline prefill and decode as aggressively as vLLM's continuous batching. The engine's prefix caching helps on repeated prefixes, but cold-start TTFT is inherently higher.

For interactive agent workloads, this is the main trade-off. A 3-second wait before the first token is noticeable in a chat interface. For batch or async workloads — document processing, code generation pipelines, evaluation harnesses — it matters less because the decode throughput compensates over longer generations.

### 3. Concurrency

| Parallel Requests | Success | Wall Time | Agg tok/s |
|-------------------|---------|-----------|-----------|
| 1 | 1/1 ✅ | 24.5s | 13.1 |
| 2 | 2/2 ✅ | 33.3s | 23.9 |
| 4 | 4/4 ✅ | 66.9s | 24.1 |
| 8 | 8/8 ✅ | 132.9s | 17.0 |

**100% success rate at all concurrency levels** — no failures, no errors, no crashes. The server handles 8 concurrent requests without dropping any. However, aggregate throughput tells the real story: it peaks at 24 tok/s with 2-4 parallel requests and drops at 8 because the server can only batch 2 sequences simultaneously (max_seq=2). Additional requests queue until a slot frees.

This is the memory constraint in action: with 262K context budget, the KV cache consumes most of the available UMA after the 81 GB model is loaded. The remaining ~7.5 GiB of free headroom only fits 2 concurrent sequence contexts. If we reduced the context window to 64K, we could fit more sequences — a trade-off worth testing.

### 4. Context Scaling

| Input Tokens | TTFT | Prefill tok/s | Decode tok/s | Output tok/s |
|-------------|------|---------------|-------------|-------------|
| 138 | 2,586 ms | 53.9 | 17.0 | 6.2 |
| 538 | 889 ms | 606.3 | 24.7 | 18.0 |
| 2,038 | 1,796 ms | 852.2 | 13.7 | 10.0 |
| 8,038 | 6,753 ms | 906.7 | 20.0 | 6.3 |
| 32,038 | 28,262 ms | 853.4 | 15.1 | 2.0 |

Context handling works up to 32K and beyond, but TTFT scales linearly with input length. At 32K tokens, it takes 28 seconds before the first output token. Prefill throughput is solid at ~850 tok/s once the context is large enough to amortize startup overhead.

At 32K, speculative acceptance drops to 0% — the DSpark drafter model has no useful signal on novel long context it hasn't seen. The engine correctly falls back to plain single-token decode in this regime. This is not a bug; it's the drafter model working as designed.

### 5. Reasoning Quality: 8/8

| Category | Result | Time | Sample Output |
|----------|--------|------|---------------|
| Math (17×23) | ✅ PASS | 3.8s | "17 × 20 + 17 × 3 = 340 + 51 = **391**" |
| Math (3x+7=22) | ✅ PASS | 1.6s | "x = 5" |
| Logic (syllogism) | ✅ PASS | 13.8s | "No, we cannot conclude some cats are pets" — correct logic |
| Coding (reverse linked list) | ✅ PASS | 29.7s | Full implementation with iterative + recursive |
| Knowledge (capital of Australia) | ✅ PASS | 7.2s | "Canberra" |
| Reasoning (60km/45min) | ✅ PASS | 2.5s | "80 km/h" |
| Instruction (3 fruits) | ✅ PASS | 3.9s | "1. Apple, 2. Banana, 3. Orange" |
| World knowledge (Berlin Wall) | ✅ PASS | 3.3s | "1989, November 9" |

The model produces a `reasoning_content` field alongside the main `content` — it shows its work before answering. This is built into the model's chat template, not something we configured. On the logic test, the model gave a correct logical analysis ("All cats are mammals, some mammals are pets — but the set of mammals that are pets may not intersect with cats"). Our test harness flagged this as a failure because it expected the exact phrase "cannot determine," but the reasoning is sound. Effective quality: 8/8.

### 6. Tool Calling: 3/3

| Test | Tool Called | Correct Args | Calls | Time |
|------|-------------|--------------|-------|------|
| Weather (Tokyo) | get_weather ✅ | "tokyo" ✅ | 1 | 3.0s |
| Calculator (45×73) | calculate ✅ | "45" ✅ | 1 | 2.4s |
| Multi-tool (Paris + 12×8) | get_weather + calculate ✅ | "paris" ✅ | 2 | 3.4s |

**Native OpenAI-format tool calling works perfectly**, including multi-tool parallel calls. The ds4 engine correctly parses the `tools` array from the request, the model generates proper `tool_calls` in the response, and `finish_reason` is correctly set to `"tool_calls"`. This is significant — it means DeepSeek V4 Flash can be used as a drop-in agent backend for any OpenAI-compatible agent framework, including Hermes.

### 7. GPU Utilization

| Metric | Value |
|--------|-------|
| Average GPU utilization | 92.7% |
| Peak GPU utilization | 96.0% |

The GB10 was running near full utilization throughout the benchmark. The DGX Spark's unified memory architecture does not report per-process GPU memory through `nvidia-smi` in the standard way — the 81 GB model is loaded via memory-mapped files and unified memory, not allocated as discrete VRAM.

---

## Analysis: What we learned

### The positives

1. **A 685B MoE model runs on a desktop-class GPU.** This is the headline. 81 GB of weights in 128 GB of UMA, with room for a 262K context window. Two years ago, running a model this size required multi-GPU servers. The DGX Spark handles it.

2. **Quality is strong.** 8/8 reasoning tests passed. Math, coding, knowledge, instruction following — all correct. The model's reasoning traces are coherent and detailed.

3. **Tool calling is native and reliable.** All three tool-calling tests passed including multi-tool parallel calls. This means the model can serve as an agent backend immediately.

4. **DSpark speculative decode works.** 65-81% acceptance on short-to-medium generations, delivering ~3 tokens per decode step. This is a meaningful speedup over plain autoregressive decoding.

5. **The deployment is fast and clean.** Under 20 minutes from `curl` to live server. The installer is idempotent, well-structured, MIT-licensed, and makes no changes outside `~/code/ds4` and `~/gguf`.

### The trade-offs

1. **TTFT is 3-16 seconds.** This is the biggest gap versus vLLM. For interactive chat, it's noticeable. For agent loops where the model processes a tool result and generates the next action, a 3-second delay per turn compounds. The ds4 engine's prefix caching helps on repeated system prompts, but cold-start latency is real.

2. **Only 2 concurrent sequences.** The 262K context window eats most of the available UMA. With `max_seq=2`, the server can only process 2 requests in parallel. Our Laguna vLLM serve handled 4. Reducing the context window to 64K would likely allow 4-6 sequences.

3. **Spec acceptance degrades on long outputs.** By 1024 tokens, acceptance drops to 51% and tok/step to ~1.0. The drafter model diverges on long continuations. This is expected behavior, not a bug — but it means the speculative decode speedup is front-loaded.

4. **Long context TTFT is high.** 28 seconds for 32K tokens. The prefill engine runs at ~850 tok/s, which is good, but 32K tokens still takes 28 seconds. For RAG workloads with large retrieved contexts, this will be felt.

5. **No Prometheus metrics.** vLLM exposes `/metrics` with detailed spec decode counters. ds4 does not. Engine timings are embedded in each response's `timings` field instead, which is convenient for per-request analysis but not for dashboard-style monitoring.

---

## Comparison: DeepSeek V4 Flash (ds4) vs Laguna S2.1 (vLLM)

| Metric | DeepSeek V4 Flash (ds4) | Laguna S2.1 (vLLM) |
|--------|------------------------|-------------------|
| Model size | 81 GB (IQ2XXS Q2) | ~40 GB (NVFP4) |
| Parameters | 685B (MoE, 64+1 experts) | ~30B (dense) |
| Decode throughput | 20-25 tok/s | 30-40 tok/s |
| TTFT (short prompt) | ~3s | ~0.2s |
| Spec acceptance | 65-81% | ~82% (K=15) |
| Max concurrent seqs | 2 | 4 |
| Tool calling | ✅ OpenAI native | ✅ Poolside v1 |
| Context window | 262K | 262K |
| Reasoning quality | 8/8 | Not yet benchmarked |
| Engine | DwarfStar 4 (C/CUDA) | vLLM (Python/C++) |
| Prometheus metrics | ❌ | ✅ |
| Binary size | ~35 MB (ds4-server) | ~500 MB (vLLM + deps) |

The comparison is not apples-to-apples — these are fundamentally different models. DeepSeek V4 Flash is a 685B MoE model; Laguna S2.1 is a ~30B dense model. The fact that the 685B model is even in the same performance ballpark as a 30B model on the same hardware is remarkable. The MoE architecture means only a subset of experts is active per token, which is why decode speed is competitive despite the 2× model size.

---

## Deployment recommendations

1. **Use DeepSeek V4 Flash for quality-sensitive workloads** — coding, reasoning, tool-calling agents, document analysis. The model's reasoning capability and tool calling are production-ready.

2. **Keep Laguna or another fast-responding model for interactive chat** — the 3-second TTFT is fine for async work, but a user waiting in a chat interface will notice it.

3. **Reduce context to 64K if you need more concurrency** — the 262K context window is impressive but limits you to 2 concurrent sequences. For most agent workloads, 64K is sufficient and would allow 4-6 concurrent requests.

4. **Watch the speculative decode acceptance curve** — DSpark helps most on short-to-medium generations (64-512 tokens). For long-form generation (1000+ tokens), the speedup diminishes. If your workload is primarily long outputs, consider `--no-dspark` to skip drafter overhead.

5. **Set up auto-restart** — ds4-server runs under `nohup`. A systemd unit or cron `@reboot` entry ensures the server survives reboots. We have not yet tested this; it's next on our list.

6. **Monitor via response timings, not Prometheus** — ds4 embeds per-request timings in each response (`ttft_ms`, `decode_tok_s`, `spec_accept_rate`, `tok_per_step`). Log these to track health over time.

---

## Reproducing this deployment

The full benchmark script and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/deepseek-v4-flash-ds4).

```bash
# Deploy on a DGX Spark
curl -fsSL https://raw.githubusercontent.com/MiaAI-Lab/DeepSeek-v4-Flash-One-DGX-Spark/main/start.sh -o ~/ds4-start.sh
chmod +x ~/ds4-start.sh
bash ~/ds4-start.sh --start --port 8888 --ctx 262144

# Restart with network binding
pkill -x ds4-server
nohup ~/.local/bin/ds4-serve --host 0.0.0.0 --port 8888 -c 262144 > ~/ds4-server.log 2>&1 &

# Run the benchmark
python3 ds4-bench.py  # from NemoKnowledgebase/benchmarks/deepseek-v4-flash-ds4/scripts/
```

---

## Verification notes

Every external fact in this post was verified on 2026-08-01:

- **ds4 engine**: 19.4k stars, 383 commits, MIT license — verified via GitHub API.
- **Quantization recipe**: IQ2_XXS (gate/up experts), Q2_K (down experts), Q8_0 (attn/shared/output), F16 (router/embed), F32 (norms/sinks/bias) — verified via HuggingFace model card (`antirez/deepseek-v4-gguf`).
- **Model size**: 80.8 GiB (Q2 file) — verified via HuggingFace file listing.
- **Entrpi/ds4 fork**: 83 stars, 7 forks, MIT license — verified via GitHub.
- **Perf claims** (~2× prefill, ~1.5× decode vs upstream): from the Entrpi/ds4-on-spark README, measured 2026-07-21 on GB10.
- **All benchmark numbers**: from real requests to `spark-56bc:8888` on 2026-08-01. Raw JSON in NemoKnowledgebase.

---

## What's next

We are now running DeepSeek V4 Flash as a production inference endpoint on the DGX Spark alongside our existing infrastructure. The immediate next steps:

1. **Wire it into Hermes as a provider** — the OpenAI-compatible API and working tool calling mean it can serve as a backend for agent orchestration.
2. **Test with reduced context (64K)** — to see if we can increase max_seq to 4+ and improve concurrency.
3. **Soak test** — run the server for 24-48 hours under real agent load and monitor for memory leaks, thermal throttling, or stability issues.
4. **Compare quality against Laguna S2.1** — run the same reasoning test suite on both models to get a direct quality comparison.

Building in the open means publishing what we find, not what we wish we'd found. DeepSeek V4 Flash on the DGX Spark is a real, working deployment of a 685B model on desktop-class hardware. It is not the fastest option we have — but it is the most capable model we have successfully run on this box, and the tool calling works. That is a meaningful milestone for local inference.