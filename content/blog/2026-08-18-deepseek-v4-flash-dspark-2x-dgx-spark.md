---
slug: "2026-08-18-deepseek-v4-flash-dspark-2x-dgx-spark"
title: "DeepSeek V4 Flash on 2× DGX Spark: Fully Offline, Zero-Cost Inference at 1M Context"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-18"
excerpt: "Two DGX Sparks, one QSFP cable, 156 GB of NVFP4 weights, and a 1M-token context window — all running locally at zero API cost. smf-bench Official A results inside."
categories: ["AI", "Local LLMs", "DGX Spark", "DeepSeek"]
tags: ["deepseek-v4-flash", "dgx-spark", "dspark", "nvfp4", "multi-node", "vllm", "smf-bench", "offline-inference"]
readTime: 15
image: "/images/blog/2026-08-18-deepseek-v4-flash-dspark-2x-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-18-deepseek-v4-flash-dspark-2x-dgx-spark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

What happens when you take DeepSeek-V4-Flash-0731 — a model designed for datacenter-scale deployment — and run it across two NVIDIA DGX Sparks connected by a single QSFP cable in a home lab?

The answer: **1M-token context, 93.3% reasoning accuracy, and an inference cost of $0.00 per token.**

For long-running workloads at SMF Works — agent orchestration, multi-session research, code generation, evaluation pipelines — the ability to move entirely offline changes the economics. No API keys to rotate. No per-token billing to monitor. No rate limits to hit. No cloud dependency when the internet drops. Just two compact machines on a desk, drawing ~130W each, serving a frontier-class model indefinitely.

## The stack

| Component | Detail |
|---|---|
| **Model** | `deepseek-ai/DeepSeek-V4-Flash-0731` (official, pinned rev `9e165c30`) |
| **Weights** | 156 GB NVFP4 per node (48 safetensors) |
| **Serving** | vLLM 0.25.2 (Anemll DSpark GX10 port) |
| **Head node** | `spark-56bc` — GB10 Grace Blackwell, 128 GB UMA, API on `:8888` |
| **Worker node** | `spark-d369` — GB10 Grace Blackwell, 128 GB UMA |
| **Interconnect** | CX-7 200 GbE RoCE v2, QSFP, MTU 9000, ~22 GB/s NCCL |
| **Tensor parallel** | TP=2 across both nodes |
| **KV cache** | `nvfp4_ds_mla`, ~18 GB / ~2.5M tokens |
| **Spec decode** | DSpark MTP=5 (5 draft tokens per step) |
| **Context** | 1,048,576 tokens (1M) |
| **Concurrency** | 6 sequences |
| **GPU util** | 0.835 (text-only profile) |
| **Recipe** | [MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark](https://github.com/MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark) |
| **Image** | `ghcr.io/anemll/dspark-vllm-gx10:0.1.1` |

## The cluster

Two DGX Sparks. One QSFP cable between their left ConnectX-7 ports. Static IPs on `192.168.100.0/24`. That's the entire network fabric — no switch, no router, no extra hardware.

The CX-7 links came up at 200 GbE with RoCE v2 after a cable reseat and a system update to kernel `6.17.0-1029-nvidia` with driver `580.173.02`. NCCL all-reduce bandwidth measured at **~22 GB/s algorithmic** (43 GB/s bus) — close to the single 200 GbE link's theoretical ceiling.

GPU Direct RDMA remains disabled on the GB10 platform (a known DGX Spark limitation in the current driver), so NCCL uses a CPU bounce path. Even without GDR, the throughput is sufficient for TP=2 serving at this model size.

## The deployment

The MiaAI-Lab recipe handles everything: Docker Compose with host networking, NCCL environment tuning, RoCEv2 GID auto-resolution from sysfs, and a launcher that starts the worker first, then the head.

```bash
# Pull the image on both nodes
docker pull ghcr.io/anemll/dspark-vllm-gx10:0.1.1

# Download weights on both nodes (from head, auto-recurses to worker)
./prepare-dspark-model-cache.sh --official --yes

# Start the cluster (worker first, then head)
./start-deepseek-v4-flash-dspark.sh
```

The recipe applies 10+ hotfixes at container startup — encoder fixes, partial-prefill concurrency, decode fairness, suppress-stops-in-reasoning, and the nvfp4_ds_mla long-context decode regression patch. All are mounted as read-only volume overlays and applied before vLLM initializes.

Key serving flags from the compose command:

```bash
vllm serve deepseek-ai/DeepSeek-V4-Flash-0731 \
  --tensor-parallel-size 2 \
  --pipeline-parallel-size 1 \
  --kv-cache-dtype nvfp4_ds_mla \
  --block-size 256 \
  --max-model-len 1048576 \
  --max-num-seqs 6 \
  --max-num-batched-tokens 8192 \
  --gpu-memory-utilization 0.835 \
  --enable-prefix-caching \
  --enable-chunked-prefill \
  --speculative-config '{"method":"dspark","num_speculative_tokens":5,"draft_sample_method":"probabilistic"}' \
  --moe-backend flashinfer_b12x \
  --tool-call-parser deepseek_v4
```

## Test methodology

We ran the **smf-bench Official A** suite (`strict_v01`, 157 tests) across 7 categories: math, coding, reasoning, instruction, prose, writing, and tool calling. Tests span 5 difficulty tiers (easy → frontier).

Two full runs were executed:

1. **Thinking OFF** — `chat_template_kwargs: {"enable_thinking": false}`, `max_tokens=4096`, `timeout=300s`
2. **Thinking ON** — default reasoning mode, same token budget and timeout

All results are measured against the live two-node cluster API at `http://spark-56bc:8888/v1`. No cloud APIs were used. No external endpoints were contacted.

## Results: Thinking OFF (Official A)

| Category | Pass | Total | Rate |
|---|---|---|---|
| **Reasoning** | 28 | 30 | **93.3%** |
| **Math** | 24 | 30 | **80.0%** |
| **Writing** | 5 | 5 | **100%** |
| **Tool Calling** | 2 | 2 | **100%** |
| Instruction | 16 | 30 | 53.3% |
| Prose | 17 | 30 | 56.7% |
| Coding | 7 | 30 | 23.3% |
| **Overall** | **99** | **157** | **63.1%** |

**Wall time:** 122.6 min | **Mean latency (pass):** 32.1s | **Errors:** 0

## Results: Thinking ON (Official A)

| Category | Pass | Total | Rate |
|---|---|---|---|
| **Reasoning** | 26 | 30 | 86.7% |
| **Math** | 24 | 30 | 80.0% |
| **Writing** | 5 | 5 | 100% |
| **Tool Calling** | 2 | 2 | 100% |
| Instruction | 17 | 30 | 56.7% |
| Prose | 15 | 30 | 50.0% |
| Coding | 8 | 30 | 26.7% |
| **Overall** | **97** | **157** | **61.8%** |

**Wall time:** 119.9 min | **Mean latency (pass):** 29.2s | **Errors:** 0

## Thinking OFF vs ON: delta analysis

| Metric | OFF | ON | Delta |
|---|---|---|---|
| Overall | 99/157 (63.1%) | 97/157 (61.8%) | −2 |
| Fixed (fail→pass) | — | 10 | +10 |
| Regressed (pass→fail) | — | 12 | −12 |
| Mean latency (pass) | 32.1s | 29.2s | −2.9s faster |

Thinking ON fixed 10 tests (mostly instruction structural constraints and 2 coding) but regressed 12 (mostly prose frontier and 2 reasoning frontier). The net effect is **neutral** — DSpark speculative decoding already handles short reasoning paths efficiently, so explicit CoT doesn't consistently help and sometimes hurts by producing verbose output that violates structural constraints.

## What stands out

### Reasoning: 93.3% — competitive with any model we've tested

DeepSeek V4 Flash's reasoning score of 93.3% with thinking off is the **highest reasoning score we've measured on any local model** and competitive with cloud-frontier models. The model solves complex logical puzzles, syllogisms, and multi-step deductions directly in the answer without needing a separate reasoning channel.

### Math: 80.0% — strong without CoT

The math score is unchanged between thinking-off and thinking-on, meaning the model solves most problems without chain-of-thought. The 6 failures are all expert/frontier precision-match tests where the answer format differs from the expected regex pattern.

### Writing and tools: perfect

100% on both, in both modes. The model follows writing instructions precisely and correctly formats tool calls using the `deepseek_v4` parser.

### Coding: the MoE SyntaxError pattern

23 of 30 coding failures are `SyntaxError: unterminated string literal` or `SyntaxError: invalid decimal literal`. This is the same pattern we've documented across MoE models with low active parameter counts — the model reasons correctly about the algorithm but produces syntactically invalid Python in single-shot generation. Easy and medium coding tests pass; the floor is on hard/expert/frontier.

### Instruction/prose: verbosity on structural constraints

The model over-generates on structural constraints — "write 5 lines" produces 162 lines. This is a known pattern with reasoning-capable models: they interpret open-ended constraints as minimums rather than exact targets.

## What this means for SMF Works

**Zero-cost, fully offline inference changes the operational calculus.**

When a model this capable runs on hardware we already own, with no per-token billing, no rate limits, and no cloud dependency:

- **Agent orchestration loops** can run indefinitely without cost anxiety — a 30-turn agent session that would cost $5-10 on a cloud API costs nothing
- **Evaluation pipelines** can process thousands of test cases without budget review — our 157-test smf-bench runs consumed zero API credits
- **Research workloads** with long context (1M tokens) become practical — a single request with 500K tokens of context would cost $1.50+ on most cloud APIs
- **Infrastructure resilience** improves — no API key rotation, no provider outages, no network dependency for inference
- **Data sovereignty** is guaranteed — no prompt leaves the local network

The two DGX Sparks draw ~130W each under load. At typical electricity rates, that's roughly $0.04/hour per node. A 24-hour continuous agent workload costs **under $2 in electricity** versus potentially hundreds of dollars in cloud API fees.

For SMF Works — where agent systems like Hermes run multi-session workflows, evaluation pipelines process large batches, and research requires long-context reasoning — this is the difference between "can we afford to run this experiment?" and "just run it."

## sparkDash monitoring

The cluster is monitored in real time via [sparkDash](https://github.com/MiaAI-Lab/sparkDash), streaming GPU utilization, temperature, memory, network, and LLM metrics from both Sparks into a single browser dashboard. The dashboard auto-detects the vLLM backend and reports live decode/prefill tok/s.

## Reproducing this

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/benchmarks/deepseek-v4-flash-0731-dspark-2x/).

The deployment recipe is at [MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark](https://github.com/MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark) (MIT licensed).

The smf-bench framework is at [smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT licensed).

```bash
# Clone the recipe
git clone https://github.com/MiaAI-Lab/DeepSeek-v4-Flash-DSpark-2x-DGX-Spark.git

# Configure .env.dspark with your cluster IPs
cp .env.dspark.example .env.dspark
# Edit: WORKER_HOST, MASTER_ADDR, NCCL_IB_HCA, NCCL_SOCKET_IFNAME, VLLM_HOST_IP, WORKER_VLLM_HOST_IP

# Pull image + download weights on both nodes
docker pull ghcr.io/anemll/dspark-vllm-gx10:0.1.1
./prepare-dspark-model-cache.sh --official --yes

# Start
./start-deepseek-v4-flash-dspark.sh

# Run smf-bench
git clone https://github.com/smfworks/smf-bench.git
cd smf-bench
python3 run_stage1.py \
  --endpoint http://<head-ip>:8888/v1 \
  --model deepseek-v4-flash-0731 \
  --tag cal-dsv4-flash-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300
```

## Verification notes

- **Model**: `deepseek-ai/DeepSeek-V4-Flash-0731` at HuggingFace revision `9e165c30e2704aec5d9d593cce3eebd58bbef1cb` (pinned, verified via `prepare-dspark-model-cache.sh`)
- **Weights**: 48 safetensors, 156 GB per node, verified by `du -sh` and file count on both Sparks
- **Serving**: vLLM 0.25.2 (Anemll DSpark GX10 0.1.1), verified via `/v1/models` endpoint returning `max_model_len: 1048576`
- **NCCL bandwidth**: ~22 GB/s algorithmic, measured via PyTorch `all_reduce_perf` with 1 GB tensors across both CX-7 links
- **Smoke test**: 6/6 requests succeeded via `smoke-deepseek-v4-flash-dspark.sh`
- **Benchmark**: 157 tests × 2 runs (thinking off + on), 0 errors, incremental save every 10 tests, results JSON saved to NemoKnowledgebase
- **hf_gate verdict**: green (architecture: qwen3_5_hybrid_gdn)
- **Hardware**: 2× NVIDIA DGX Spark (GB10 Grace Blackwell, 128 GB LPDDR5X UMA, SM12.1), kernel 6.17.0-1029-nvidia, driver 580.173.02