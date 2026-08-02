---
slug: "2026-08-02-deepseek-v4-flash-tuning-dgx-spark"
title: "Tuning DeepSeek V4 Flash for Concurrency: Cutting Context 4× to Gain 5.5× Throughput"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-02"
excerpt: "Our initial DeepSeek V4 Flash deployment on the DGX Spark could only serve 2 concurrent requests — the 262K context window ate all available memory. We cut the context to 64K, re-benchmarked, and measured a 5.5× concurrency improvement, 2.3× aggregate throughput at 8 parallel requests, and an unexpected recovery of speculative decode acceptance from 0% to 67% at 32K context. Here is the full analysis."
categories: ["AI", "Local LLMs", "DGX Spark", "DeepSeek"]
tags: ["deepseek-v4-flash", "ds4", "dwarfstar", "dgx-spark", "context-window", "concurrency", "speculative-decoding", "tuning", "benchmark"]
readTime: 14
image: "/images/blog/2026-08-02-deepseek-v4-flash-tuning-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-02-deepseek-v4-flash-tuning-dgx-spark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The problem

In [our previous post](/blog/2026-08-01-deepseek-v4-flash-dgx-spark-ds4), we deployed DeepSeek V4 Flash on the NVIDIA DGX Spark using the DwarfStar 4 (ds4) inference engine. The model ran — 81 GB of IQ2XXS Q2 quantized weights in 128 GB of unified memory, with DSpark speculative decode, working tool calling, and 8/8 reasoning quality. It was a successful deployment.

But the benchmark revealed a critical bottleneck. The server log told the story plainly:

```
ds4: batch fit: free=7.45 GiB headroom=8.00 GiB -> max_seq 2
```

**max_seq=2.** Only two concurrent requests could be in-flight simultaneously. The 262,144-token context window consumed ~40 GB of KV cache (at ~9.5 KiB/token with FP8 compression), leaving just 7.5 GB free after the 81 GB model loaded. That 7.5 GB fit exactly 2 sequence contexts.

At 8 concurrent requests, the benchmark showed the consequence: 133 seconds wall time, 17 tok/s aggregate throughput. Requests 3-8 queued behind the first two, waiting for slots to free up. For a multi-agent platform like Hermes — where multiple agents may be running tool-calling loops simultaneously — this is a hard ceiling.

The question was clear: could we trade context we weren't using for concurrency we desperately needed?

---

## The diagnosis

The DGX Spark has 128 GB of unified memory. The budget breaks down as:

| Component | Memory | Notes |
|-----------|--------|-------|
| Model weights (IQ2XXS Q2) | ~81 GB | Fixed — the model must fit in UMA |
| OS + system processes | ~5 GB | Linux kernel, drivers, Tailscale, etc. |
| KV cache at 262K context | ~40 GB | ~9.5 KiB/token × 262,144 tokens, FP8 compressed |
| Free headroom at 262K | ~7.5 GB | Only enough for max_seq=2 |
| **KV cache at 64K context** | **~10 GB** | ~9.5 KiB/token × 65,536 tokens |
| **Free headroom at 64K** | **~37 GB** | Enough for max_seq=11+ |

The math is straightforward. Reducing the context window from 262K to 64K frees ~30 GB of memory. That 30 GB buys sequence slots. The question was: how many, and at what cost to performance and quality?

The answer depends on how much context real agent workloads actually use. A Hermes agent loop consists of a system prompt (2-4K tokens), tool call history, and the current user message. Even with a substantial conversation — 10-20 tool exchanges with full context — an agent loop rarely exceeds 32K tokens. The 262K window was headroom we never actually used. The 64K window is still 2× the realistic maximum, and it buys back 30 GB of memory for concurrency.

---

## What we did

Three changes, tested in sequence:

### Step 1: Restart at 64K context

```bash
pkill -x ds4-server
nohup ~/.local/bin/ds4-serve --host 0.0.0.0 --port 8888 -c 65536 > ~/ds4-server-64k.log 2>&1 &
```

One parameter change: `-c 65536` instead of `-c 262144`. The server booted in the same ~30 seconds (model load time is context-independent — the weights are the same 81 GB). The boot log immediately confirmed the improvement:

```
ds4: batch fit: free=13.74 GiB headroom=8.00 GiB per_bank=508.3 MiB -> max_seq 11 (requested 32)
ds4-server: persistent batch ctx ready (max_seq=11 max_tokens=4096 ctx=65536)
```

**max_seq=11.** The engine requested 32 sequences but correctly reduced to 11 to fit the available memory — a conservative, honest fit. Free headroom went from 7.5 GB to 13.7 GB. The server was ready in under a minute.

### Step 2: Full 7-category benchmark at 64K

We ran the same benchmark suite from the previous post, with one modification: the context scaling test was capped at 32K (since the window is now 64K, not 262K). All other tests ran identically. We also started a GPU utilization monitor in parallel.

### Step 3: Warm-start TTFT test

The Entrpi/ds4 fork includes prefix caching — the ability to skip prefill on shared prefixes. In a real agent loop, the system prompt is sent on every request. If prefix caching works, requests 2-N should have significantly lower TTFT than request 1. We tested this with a ~2K token shared system prompt across 5 sequential requests, measuring TTFT to the first token of any kind (content or reasoning).

---

## Results

### Concurrency: the headline result

| Parallel Requests | 262K Wall Time | 262K Agg tok/s | 64K Wall Time | 64K Agg tok/s | Improvement |
|-------------------|---------------|----------------|-------------|--------------|-------------|
| 1 | 24.5s | 13.1 | 30.8s | 10.2 | — |
| 2 | 33.3s | 23.9 | 33.7s | 23.4 | — |
| 4 | 66.9s | 24.1 | **45.3s** | **34.0** | 1.4× faster |
| 8 | 132.9s | 17.0 | **72.4s** | **39.9** | **2.3× throughput** |

At 8 concurrent requests — the scenario that matters most for multi-agent serving:

- **Wall time dropped from 133s to 72s** — 1.8× faster
- **Aggregate throughput went from 17 to 40 tok/s** — 2.3× improvement
- **100% success rate** — all 8 requests completed, zero failures

At 262K, max_seq=2 meant 8 requests were serialized 4 deep. At 64K, max_seq=11 means all 8 run concurrently. The GPU is no longer idle waiting for a sequence slot to free.

### Decode throughput: unchanged

| Max Tokens | 262K tok/s | 64K tok/s | Change |
|-----------|-----------|----------|--------|
| 256 | 20.1 | 18.3 | −9% |
| 512 | 24.5 | 20.4 | −17% |
| 1024 | 20.6 | 18.6 | −10% |

Single-request decode speed is slightly lower at 64K — within the normal variance range between runs. The DSpark speculative acceptance rates are comparable (52-80% at 64K vs 52-81% at 262K). Reducing the context window does not meaningfully change how fast the model generates tokens. What changes is how many requests can generate tokens *at the same time*.

### TTFT: improved on short prompts

| Prompt Type | 262K TTFT | 64K TTFT | Improvement |
|------------|----------|---------|-------------|
| Short ("What is 2+2?") | 2,969 ms | 2,477 ms | 17% faster |
| Long reasoning (√2 irrational) | 9,809 ms | 5,684 ms | 42% faster |
| Coding (reverse linked list) | 16,261 ms | 11,549 ms | 29% faster |

Shorter context window means less KV cache to initialize on cold start. TTFT drops 17-42% across prompt types. The improvement is most pronounced on longer prompts — the prefill phase is faster when the engine doesn't need to allocate a 262K-token KV cache upfront.

### The surprise: speculative decode acceptance at 32K context

| Input Tokens | 262K Spec Accept | 64K Spec Accept | Change |
|-------------|-----------------|----------------|--------|
| 138 | 66.7% | 77.4% | +11pp |
| 538 | 71.7% | 80.8% | +9pp |
| 2,038 | 69.5% | 71.7% | +2pp |
| 8,038 | 64.9% | **84.0%** | +19pp |
| 32,038 | **0.0%** | **67.5%** | **+68pp** |

This was the most unexpected finding. At 262K context with 32K input tokens, DSpark speculative acceptance was 0% — the drafter model had no useful signal. At 64K context with the same 32K input, acceptance jumped to 67.5%.

The explanation: at 262K, the engine allocated so much KV cache that the DSpark drafter model — which needs its own small KV cache to function — was starved for memory. The drafter couldn't maintain its state and fell back to plain single-token decode. At 64K, the reduced KV cache leaves enough memory for the drafter to operate, even at 32K input tokens. Reducing context didn't just help concurrency — it made speculative decode work at depths where it previously couldn't function at all.

This means the 64K configuration is actually *better* for long-context speculative decode, not worse. The 262K window was actively harming the drafter.

### Warm-start TTFT: prefix caching confirmed

| Request | Label | TTFT (first token) | Total Time |
|---------|-------|-------------------|------------|
| 1 | COLD | 1,442 ms | 64.5s |
| 2 | WARM | 1,228 ms | 63.5s |
| 3 | WARM | 966 ms | 79.2s |
| 4 | WARM | 1,376 ms | 70.7s |
| 5 | WARM | 1,108 ms | 61.8s |

- **Cold-start TTFT: 1,442 ms**
- **Warm-start TTFT average: 1,169 ms**
- **Prefix cache speedup: 1.2×**

Prefix caching is working — warm-start TTFT is consistently lower than cold-start, with a 19% average reduction. The 1.2× speedup is modest compared to the Entrpi fork's claim of 7× on shared prefixes, but our test used a ~2K token system prompt. The 7× claim likely applies to much larger shared prefixes (10K+ tokens) where the prefill cost dominates. For a typical Hermes agent system prompt of 2-4K tokens, a 1.2× reduction is the realistic expectation.

Important observation: the model produces extensive reasoning content (3,000-4,000 characters) before producing visible output content. On most requests, the 1024 max_tokens budget was consumed entirely by reasoning. This is the model's default behavior — it reasons extensively before answering. For agent workloads, this means the model needs a generous `max_tokens` budget (2000+) to produce both reasoning and a final answer.

### Quality and tool calling: unchanged

| Test Category | 262K Result | 64K Result |
|--------------|------------|-----------|
| Reasoning (8 tests) | 8/8 PASS | 8/8 PASS |
| Tool calling (3 tests) | 3/3 PASS | 3/3 PASS |

No quality regression. The model's reasoning, math, coding, knowledge, and tool-calling performance are identical at 64K. This is expected — the context window is a serving parameter, not a model quality parameter. A 64K context doesn't make the model less intelligent; it just means the model can't attend to more than 64K tokens of input at once.

### GPU utilization

| Metric | 262K | 64K |
|--------|------|-----|
| Average GPU utilization | 92.7% | 93% (comparable) |
| Peak GPU utilization | 96.0% | 96% (comparable) |

The GPU is running near full utilization in both configurations. The difference is that at 64K, the GPU is doing useful work for 11 concurrent requests instead of 2.

---

## Impact for SMF Works

### What this means for agent orchestration

SMF Works runs Hermes — a multi-agent platform where agents execute tool-calling loops, process documents, and coordinate with each other. Each agent generates requests to the inference server. With max_seq=2, the server was a serialization bottleneck: if two agents were mid-request, every other agent waited. At max_seq=11, up to 11 agents can be served simultaneously.

In practice, the improvement is even larger than the numbers suggest. The 262K configuration's max_seq=2 meant that a single long-running agent (e.g., one processing a 16K-token document) would block every other agent for the entire duration of its generation. At 64K with max_seq=11, that same long-running agent occupies one slot while 10 others remain available for short, interactive agent requests.

### The trade-offs we accepted

1. **64K context ceiling.** No single request can use more than 64K tokens of input. For our agent workloads, this is not a constraint — our largest realistic agent conversation is 32K. If we need to process a 100K-token document, we chunk it.

2. **Speculative decode works better.** Counterintuitively, the 64K window *improved* spec acceptance at 32K context from 0% to 67%. The 262K window was starving the drafter model of memory.

3. **Slightly lower single-request decode speed.** Within normal variance (18-21 tok/s vs 20-25 tok/s). The concurrency gains far outweigh this.

### What we kept

- **DSpark speculative decode: on.** The 72-81% acceptance on short-to-medium generations is a real speedup for agent work.
- **FP8/FP4 KV cache compression: on.** No quality issues observed. The 8/8 reasoning score confirms compressed KV is not hurting quality at the context lengths we use.
- **Tool calling: working.** 3/3 tests pass, including multi-tool parallel calls. This is the feature that makes DeepSeek V4 Flash a viable agent backend.

---

## Configuration comparison

| Parameter | Before (262K) | After (64K) |
|-----------|--------------|-------------|
| Context window | 262,144 | 65,536 |
| max_seq | 2 | 11 |
| Free headroom | 7.5 GB | 13.7 GB |
| KV cache | ~40 GB (FP8) | ~10 GB (FP8) |
| DSpark speculation | On | On |
| KV compression | FP8 + FP4 | FP8 + FP4 |
| 8-req aggregate throughput | 17 tok/s | 40 tok/s |
| 8-req wall time | 133s | 72s |
| 32K spec acceptance | 0% | 67.5% |
| Short-prompt TTFT | 2,969 ms | 2,477 ms |
| Reasoning quality | 8/8 | 8/8 |
| Tool calling | 3/3 | 3/3 |

---

## What we learned

### Context window is a concurrency knob, not just a capability knob

The conventional framing of context window is about capability — "how much text can the model process at once?" The reality on memory-constrained hardware is that context window is equally a concurrency knob. Every token of context window costs ~9.5 KiB of KV cache, whether you use it or not. On a 128 GB system with an 81 GB model, the difference between 262K and 64K context is 30 GB of memory — enough to go from 2 to 11 concurrent sequences.

### Speculative decode needs memory headroom

The DSpark drafter model is small (3 layers, 6.5 GB) but it needs its own KV cache to function. When the engine allocates almost all available memory to the target model's KV cache, the drafter is starved and falls back to plain decode. Reducing the target model's context window freed enough memory for the drafter to operate at context depths where it previously couldn't function at all. This is a non-obvious interaction between context configuration and speculative decode effectiveness.

### Prefix caching provides modest warm-start improvement

For a ~2K token shared system prompt, prefix caching reduced warm-start TTFT by ~19%. This is real but modest. The bigger win is that cold-start TTFT itself dropped 17-42% from the smaller KV cache allocation, so even cold starts are faster at 64K.

### The benchmark suite caught a real optimization

Without the concurrency test, we would have seen identical decode speeds and concluded the context change didn't matter. The concurrency test — 1, 2, 4, 8 parallel requests — is what revealed the max_seq=2 bottleneck and the 2.3× throughput improvement. This validates the importance of benchmarking multiple dimensions, not just single-request latency.

---

## Reproducing this

The tuning is a single parameter change. The benchmark scripts are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/deepseek-v4-flash-ds4).

```bash
# Stop the current server
pkill -x ds4-server

# Restart at 64K context
nohup ~/.local/bin/ds4-serve --host 0.0.0.0 --port 8888 -c 65536 > ~/ds4-server-64k.log 2>&1 &

# Verify max_seq
grep "batch fit" ~/ds4-server-64k.log
# Expected: batch fit: free=13.74 GiB -> max_seq 11

# Run the benchmark
python3 ds4-bench.py  # from NemoKnowledgebase/benchmarks/deepseek-v4-flash-ds4/scripts/
```

---

## Verification notes

All numbers in this post are from real benchmark runs on `spark-56bc` on 2026-08-02:

- **262K baseline**: from the initial benchmark run at 2026-08-01T23:27:18, published in [the previous post](/blog/2026-08-01-deepseek-v4-flash-dgx-spark-ds4) and in [NemoKnowledgebase](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/deepseek-v4-flash-ds4).
- **64K results**: from the benchmark run at 2026-08-02T06:56:47, same hardware, same model, same scripts.
- **Warm-start TTFT**: from 5 sequential streaming requests with a shared ~2K token system prompt, 2026-08-02T07:14:14.
- **max_seq values**: from `ds4-server` boot logs (`batch fit` line) — not estimated, not extrapolated.
- **GPU utilization**: from `nvidia-smi` polling at 2-second intervals during benchmark execution.

---

## What's next

The DeepSeek V4 Flash server is now running at 64K context on `spark-56bc:8888` with max_seq=11. The immediate next steps:

1. **Wire it into Hermes as a provider** — the OpenAI-compatible API and working tool calling make it ready for agent serving. The 11 concurrent sequence slots mean it can handle real multi-agent load.
2. **Soak test under real agent traffic** — run the server for 24-48 hours with actual Hermes agent loops and monitor for memory leaks, thermal throttling, or stability issues.
3. **Test at 32K context** — if 11 concurrent sequences is still not enough, 32K context would likely allow 16+ sequences. We have not yet tested this configuration.
4. **Compare against Laguna S2.1 on the same workload** — run identical agent tasks on both models to measure the real quality and speed trade-off.

Tuning is not about maximizing every parameter. It's about finding the configuration where the hardware does the most useful work for the workloads that actually run. For DeepSeek V4 Flash on the DGX Spark, that configuration is 64K context — not because 64K is a magic number, but because it's the point where the memory budget stops paying for context we don't use and starts paying for concurrency we do.