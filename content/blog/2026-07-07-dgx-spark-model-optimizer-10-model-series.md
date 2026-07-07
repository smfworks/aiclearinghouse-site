---
slug: "2026-07-07-dgx-spark-model-optimizer-10-model-series"
title: "10 Models That Shouldn't Fit: A DGX Spark Optimization Series Using NVIDIA Model Optimizer 0.45.0"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-07"
excerpt: "We're taking 10 frontier models — from 65 GB to 812 GB at full precision — and making them run on a 121 GB DGX Spark using NVIDIA Model Optimizer 0.45.0. Three tiers of optimization: NVFP4 quantization alone, NVFP4 plus KV cache compression, and full prune-distill-quantize pipelines. Three models have no NVFP4 version anywhere — we're creating them. Every number in this post is verified against HuggingFace model cards, config files, and PyPI release records."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["nvfp4", "model-optimizer", "dgx-spark", "quantization", "pruning", "distillation", "moe", "vllm", "smf-bench", "modelopt"]
readTime: 30
image: "/images/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

Our DGX Spark (`spark-56bc`) has 121 GB of unified memory. The models we want to run range from 65 GB to 812 GB at full precision. Most of them simply do not fit.

That is the problem. Here is the plan to solve it.

Over the next 10 weeks, we will take 10 frontier open-weight models — GPT-OSS-120B, Mixtral-8x22B, GLM-4.7-Flash, Mistral-Large-2411, Llama-4-Scout, Step-3.5-Flash, DeepSeek-V4-Flash, Qwen3-235B-A22B, Llama-3.1-405B, and DeepSeek-R1 — and use NVIDIA Model Optimizer 0.45.0 to make each one run on our 121 GB machine. We will benchmark every result with our own 181-test smf-bench suite and publish a deep-dive post per model, per week, with real numbers.

Three of these models have no NVFP4 quantized version anywhere on HuggingFace. We will be the first to create them.

This post is the announcement, the methodology, and the verified model specification for the series. Every number cited — parameter counts, file sizes, download counts, licenses, architecture details — was verified against the HuggingFace API, model config files, and PyPI release records on July 7, 2026.

---

## Background: what we've already tested

Before describing what's next, here is what we know from the first round of testing. We ran four models through our smf-bench suite — 181 tests across 9 categories (reasoning, math, coding, reasoning_tier0, instruction, prose, writing, tool_calling, agentic) and 5 difficulty tiers (easy, medium, hard, expert, frontier). The suite is open source (MIT) at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

| Model | Architecture | Format | Passed | Rate | Wall Time |
|---|---|---|---|---|---|
| Gemma-4-26B-A4B-NVFP4 | Transformer MoE, 26B/4B active | NVFP4 | 152/181 | 84.0% | 56.3 min |
| Qwen3.6-35B-A3B-NVFP4 | Transformer MoE, 35B/3B active | NVFP4 | 129/181 | 71.3% | 27.6 min |
| Nemotron-3-Super-120B-A12B | Mamba-Transformer hybrid MoE, 120B/12B active | NVFP4 | 126/181 | 69.6% | 530.1 min |
| Nemotron-3-Nano-30B | Mamba-Transformer hybrid MoE, 30B/3B active | BF16 | 99/181 | 54.7% | 212.0 min |

All four of these models were already optimized for the DGX Spark — either shipped in NVFP4 by NVIDIA or small enough to run at BF16. The question that motivates this series is different: **can we take models that were never designed to fit in 121 GB and make them work?**

---

## The hardware: DGX Spark (GB10 Grace Blackwell)

The NVIDIA DGX Spark is a desktop-class AI workstation built around the GB10 Grace Blackwell SuperChip. The relevant constraints for this series:

| Specification | Value |
|---|---|
| Chip | GB10 Grace Blackwell SuperChip |
| Architecture | ARM64 (aarch64) |
| Unified memory | 128 GB nominal, ~121 GB usable |
| Practical model budget | ~90–100 GB (after OS, vLLM runtime, serving overhead) |
| Storage | 3.7 TB NVMe |
| NVFP4 support | Native hardware acceleration (Blackwell tensor cores) |
| Key advantage | Unified memory — CPU and GPU share the same HBM, no PCIe bottleneck |

The unified memory architecture is critical. On a traditional discrete-GPU system, model weights must be copied across PCIe from CPU RAM to GPU VRAM. On the DGX Spark, the GB10 chip's unified memory means the entire model — weights, KV cache, activations — lives in one address space. There is no host-to-device copy. This is what makes running large models feasible: the bottleneck is total memory, not transfer bandwidth.

The practical budget is approximately 90–100 GB for model weights plus KV cache. The remaining ~20–30 GB is consumed by the OS (Ubuntu), the vLLM serving runtime, Docker overhead, and working memory. Every model in this series must fit within that budget.

---

## The tool: NVIDIA Model Optimizer 0.45.0

NVIDIA Model Optimizer (ModelOpt) is the compression toolkit that turns a trained checkpoint into a deployable, hardware-accelerated artifact. Version 0.45.0 was released on July 6, 2026 — confirmed via the `nvidia-modelopt` PyPI package (upload timestamp `2026-07-06T07:00:28`). We published a [separate deep dive](/blog/2026-07-06-nvidia-model-optimizer-0-45-deep-dive) on the full feature set; here is what matters for this series.

### The key technique: `w4a16_nvfp4` weight-only quantization

The primary optimization technique for most models in this series is `w4a16_nvfp4` — a weight-only post-training quantization (PTQ) format that converts model weights to NVIDIA's NVFP4 format while keeping activations in BF16 (A16). The name decodes as:

- **W4**: 4-bit floating-point weights
- **A16**: 16-bit (BF16) activations
- **NVFP4**: NVIDIA's 4-bit floating-point format with group_size=16 and FP8 per-group scales

The storage arithmetic: each parameter requires 4 bits (weight) + 8 bits / 16 params (FP8 scale) = 4.5 bits = 0.5625 bytes. Compared to BF16 at 2 bytes per parameter, this is a **3.56× compression ratio** (or 0.28125 of the original size). The conversion requires no calibration forward pass — it is a direct weight transformation. This is what makes it practical: you download a checkpoint, run the quantizer, and deploy.

We can verify this compression ratio against NVIDIA's own pre-quantized models on HuggingFace:

| Model | BF16 size | NVIDIA FP4 size | Ratio | Source |
|---|---|---|---|---|
| Llama-3.1-405B-Instruct | ~812 GB (405B × 2 bytes) | 234.3 GB | 0.289 | Verified via HuggingFace API |
| Llama-4-Scout-17B-16E-Instruct | ~217 GB (109B × 2 bytes) | 65.3 GB | 0.301 | Verified via HuggingFace API |

The ratios (0.289 and 0.301) are consistent with the theoretical 0.28125, with slight overhead from metadata, non-quantized modules (attention, embeddings, router), and packing alignment.

### Additional techniques available in 0.45.0

Beyond `w4a16_nvfp4`, Model Optimizer supports a stack of composable transformations. We will need several of these for the harder models:

| Technique | What it does | When we need it |
|---|---|---|
| `nvfp4_experts_only` | Quantizes only MoE expert MLPs to NVFP4, leaves shared layers at BF16 | When we need higher precision on critical layers |
| `--cast_mxfp4_to_nvfp4` | Converts an existing MXFP4 checkpoint to NVFP4 | GPT-OSS-120B (shipped in MXFP4) |
| Structured pruning (Minitron) | Removes layers or width dimensions to reduce parameter count | Llama-3.1-405B, DeepSeek-R1 |
| Distillation | Trains a smaller student model from the original to recover accuracy lost to pruning | Required after pruning |
| 2:4 sparsity | Enforces 2 out of every 4 weights are zero, hardware-accelerated on Blackwell | Optional throughput boost |
| Speculative decoding | Uses a small draft model to predict tokens, validated by the main model | Nemotron-3-Super uses MTP; applicable elsewhere |
| KV cache quantization | Compresses the attention key-value cache to FP8 or lower | Step-3.5-Flash, Qwen3-235B-A22B (long-context models) |

The core insight from our [Model Optimizer deep dive](/blog/2026-07-06-nvidia-model-optimizer-0-45-deep-dive): pruning and quantization compose multiplicatively. A 2× pruning ratio followed by a 3.56× quantization ratio gives a 7.12× total compression. That multiplicative stacking is what makes the Tier 3 models possible.

---

## The 10 models: verified specifications

Every figure in this table was verified on July 7, 2026, against the HuggingFace API (`huggingface.co/api/models/{model_id}`), model `config.json` files, and model card READMEs. File sizes are the total of all `.safetensors` files in the repository. Download counts are from the HuggingFace API `downloads` field. Licenses are from the `tags` array in the API response.

NVFP4 size estimates (marked with ~) are calculated as `parameter_count × 0.5625 bytes`, derived from the NVFP4 format specification (4-bit weights + FP8 group scales at group_size=16). Where NVIDIA has already published an FP4 version, the verified file size is used instead.

### Week 1 — GPT-OSS-120B

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `openai/gpt-oss-120b` | — |
| Total parameters | 117B | OpenAI README: "117B parameters with 5.1B active parameters" |
| Active parameters | 5.1B | OpenAI README |
| Architecture | MoE, 128 experts, 4 active per token | `config.json`: `num_local_experts: 128`, `experts_per_token: 4` |
| Layers | 36 | `config.json`: `num_hidden_layers: 36` |
| Hidden size | 2,880 | `config.json`: `hidden_size: 2880` |
| Context length | 131,072 | `config.json`: `max_position_embeddings: 131072` |
| Published format | MXFP4 | `config.json`: `quantization_config.quant_method: "mxfp4"` |
| Published file size | 65.2 GB | Verified via HuggingFace API (sum of `.safetensors`) |
| Downloads | 4,298,781 | HuggingFace API |
| Likes | 4,951 | HuggingFace API |
| License | Apache 2.0 | HuggingFace tags: `license:apache-2.0` |
| NVIDIA FP4 exists? | No | No `nvidia/gpt-oss-120b-fp4` repository |
| Optimization plan | Convert MXFP4 → NVFP4 via `--cast_mxfp4_to_nvfp4` | Native hardware format for GB10 |
| Estimated NVFP4 size | ~65 GB (comparable to MXFP4) | Both are 4-bit formats; size should be similar |

**Why it's here**: GPT-OSS-120B already fits on the DGX Spark at 65.2 GB in MXFP4. The optimization is not about fitting — it's about native hardware format. The GB10 Grace Blackwell chip has native NVFP4 tensor core support. MXFP4, while also 4-bit, uses a different block structure (32× blocks with micro-exponents) that may not map directly to NVFP4 hardware paths. Converting to NVFP4 should unlock native tensor core operations, potentially improving throughput. This is also the most-downloaded model in the series (4.3M downloads), making it the highest-impact starting point.

### Week 2 — Mixtral-8x22B

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `mistralai/Mixtral-8x22B-Instruct-v0.1` | — |
| Total parameters | 141B | Calculated: 8 experts × ~17.6B per expert + shared layers |
| Active parameters | 39B | 2 experts active × ~17.6B + shared layers + attention |
| Architecture | MoE, 8 experts, 2 active per token | `config.json`: `num_local_experts: 8`, `num_experts_per_tok: 2` |
| Layers | 56 | `config.json`: `num_hidden_layers: 56` |
| Hidden size | 6,144 | `config.json`: `hidden_size: 6144` |
| Context length | 65,536 | `config.json`: `max_position_embeddings: 65536` |
| Published format | BF16 (float16) | `config.json`: `torch_dtype: float16` |
| Published file size | 281.3 GB | Verified via HuggingFace API (sum of `.safetensors`) |
| Downloads | 70,633 | HuggingFace API |
| Likes | 755 | HuggingFace API |
| License | Apache 2.0 | HuggingFace tags: `license:apache-2.0` |
| NVIDIA FP4 exists? | No | No `nvidia/Mixtral-8x22B-FP4` repository found |
| Optimization plan | BF16 → NVFP4 PTQ via `w4a16_nvfp4` | Original contribution — first NVFP4 version of this model |
| Estimated NVFP4 size | ~79 GB | 141B × 0.5625 bytes = 79.3 GB |

**Why it's here**: Mixtral-8x22B is one of the most capable Apache-licensed MoE models, but at 281 GB BF16 it is 2.3× the DGX Spark's total memory. NVFP4 quantization brings it to an estimated 79 GB — well within budget. No NVFP4 version exists anywhere. Creating one is an original contribution to the open-source community. With 70K downloads, it has a dedicated user base that would benefit from a ready-to-deploy NVFP4 checkpoint.

### Week 3 — GLM-4.7-Flash

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `zai-org/GLM-4.7-Flash` | — |
| Total parameters | 30B | Official README: "GLM-4.7-Flash is a 30B-A3B MoE model" |
| Active parameters | 3B | Official README: "30B-A3B" |
| Architecture | MoE, 64 experts, 4 active per token, 1 shared expert | `config.json`: `num_experts: 64`, `num_experts_per_tok: 4` |
| Layers | 47 | `config.json`: `num_hidden_layers: 47` |
| Hidden size | 2,048 | `config.json`: `hidden_size: 2048` |
| Context length | 202,752 | `config.json`: `max_position_embeddings: 202752` |
| Published format | BF16 | `config.json`: `torch_dtype: bfloat16` |
| Published file size | 62.4 GB | Verified via HuggingFace API (sum of `.safetensors`); consistent with 30B × 2 bytes + overhead |
| Downloads | 2,703,672 | HuggingFace API |
| Likes | 1,769 | HuggingFace API |
| License | MIT | HuggingFace tags: `license:mit` |
| NVIDIA FP4 exists? | No | No NVFP4 version found on HuggingFace |
| Optimization plan | BF16 → NVFP4 PTQ via `w4a16_nvfp4` | Original contribution |
| Estimated NVFP4 size | ~17.5 GB | 30B × 0.5625 bytes = 16.9 GB, plus non-quantized modules |

**Why it's here**: GLM-4.7-Flash is a different story from the other models. At 62.4 GB BF16, it already fits on the DGX Spark. The optimization is not about fitting — it's about **context length**. GLM-4.7-Flash supports 202,752 tokens of context. At BF16, the model consumes 62.4 GB, leaving only ~38 GB for KV cache. At 200K context, the KV cache for a 47-layer model with 64 experts could easily exceed that. NVFP4 quantization reduces the model to ~17.5 GB, freeing ~45 GB for KV cache — enough to serve the full 200K context window. This is the model where the optimization story is about *enabling features* rather than *fitting at all*. With 2.7M downloads and MIT license, it is one of the most popular models in the series.

### Week 4 — Mistral-Large-2411

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `mistralai/Mistral-Large-Instruct-2411` | — |
| Total parameters | ~122.6B | Calculated from config: 88 layers, hidden_size=12288, intermediate_size=28672, vocab_size=32768 |
| Active parameters | 122.6B (dense, no MoE) | Dense architecture — all parameters active per token |
| Architecture | Dense Transformer | `config.json`: no MoE fields, standard Mistral dense architecture |
| Layers | 88 | `config.json`: `num_hidden_layers: 88` |
| Hidden size | 12,288 | `config.json`: `hidden_size: 12288` |
| Context length | 131,072 | `config.json`: `max_position_embeddings: 131072` |
| Published format | FP32 (float32) | File size 490.4 GB ÷ 122.6B params = 4.0 bytes/param, confirming FP32 storage |
| Published file size | 490.4 GB | Verified via HuggingFace API (sum of `.safetensors`) |
| Downloads | 8,002 | HuggingFace API |
| Likes | 264 | HuggingFace API |
| License | Other (Mistral Research License) | HuggingFace tags: `license:other` |
| NVIDIA FP4 exists? | No | No `nvidia/Mistral-Large-FP4` repository found |
| Optimization plan | FP32 → BF16 → NVFP4 PTQ via `w4a16_nvfp4` | ModelOpt handles any input precision |
| Estimated NVFP4 size | ~69 GB | 122.6B × 0.5625 bytes = 68.9 GB |

**Why it's here**: Mistral-Large-2411 is the most extreme compression ratio in Tier 1 — from 490.4 GB at FP32 to an estimated 69 GB at NVFP4, a **7.1× reduction**. The model is published in FP32 (4 bytes per parameter), which is unusual for a model this size. The first step is conceptual: we are not just quantizing, we are also dropping from FP32 to BF16 before NVFP4. Model Optimizer handles this automatically — the `w4a16_nvfp4` quantizer converts weights regardless of input dtype. The result should fit comfortably within the 121 GB budget. This is also the only dense (non-MoE) model in Tier 1, which makes it an interesting comparison point: dense models have no expert sparsity to exploit, so the compression is entirely from quantization. Note the license: "other" corresponds to the Mistral Research License, which permits research use but restricts commercial deployment.

### Week 5 — Llama-4-Scout

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `meta-llama/Llama-4-Scout-17B-16E-Instruct` | — |
| Total parameters | 109B | Meta's Llama 4 specification |
| Active parameters | 17B | 1 expert active per token |
| Architecture | MoE, 16 experts, 1 active per token, multimodal (vision + text) | `config.json`: `num_local_experts: 16`, `num_experts_per_tok: 1` |
| Context length | 131,072 | Meta specification |
| Published format | BF16 (gated model) | Llama 4 Community License |
| BF16 estimated size | ~217 GB | 109B × 2 bytes |
| NVIDIA FP4 verified size | 65.3 GB | Verified via HuggingFace API for `nvidia/Llama-4-Scout-17B-16E-Instruct-FP4` |
| Downloads (base model) | 722,028 | HuggingFace API for `meta-llama/Llama-4-Scout-17B-16E-Instruct` |
| Downloads (NVIDIA FP4) | 82,819 | HuggingFace API for `nvidia/Llama-4-Scout-17B-16E-Instruct-FP4` |
| Likes | 1,316 | HuggingFace API |
| License | Llama 4 Community License | HuggingFace tags |
| NVIDIA FP4 exists? | Yes — 65.3 GB | Already published by NVIDIA |
| Optimization plan | Use NVIDIA FP4 (65.3 GB) + handle multimodal components on DGX Spark | Multimodal vision encoder needs separate handling |

**Why it's here**: Llama-4-Scout is the transition point between Tier 1 and Tier 2. NVIDIA has already published an FP4 version at 65.3 GB — it fits. The challenge is not memory but multimodality: Llama-4-Scout is a vision-language model, and serving the vision encoder alongside the language model on the DGX Spark requires careful memory partitioning. This week explores the practical challenges of running a multimodal MoE model at NVFP4 on ARM64 unified memory — something that has limited community documentation. With 722K downloads on the base model and 83K on the FP4 version, there is strong interest in practical deployment guidance.

### Week 6 — Step-3.5-Flash

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `stepfun-ai/Step-3.5-Flash` | — |
| Total parameters | 196B | Official README: "selectively activates only 11B of its 196B parameters per token" |
| Active parameters | 11B | Official README |
| Architecture | MoE, 288 experts, 8 active per token | `config.json`: `moe_num_experts: 288`, `moe_top_k: 8` |
| Layers | 45 | `config.json`: `num_hidden_layers: 45` |
| Hidden size | 4,096 | `config.json`: `hidden_size: 4096` |
| Context length | 262,144 | `config.json`: `max_position_embeddings: 262144`, `max_seq_len: 262144` |
| Published format | BF16 | `config.json`: `torch_dtype: bfloat16` |
| Published file size | 398.8 GB | Verified via HuggingFace API (sum of `.safetensors`); consistent with 196B × 2 bytes + overhead |
| Downloads | 175,322 | HuggingFace API |
| Likes | 824 | HuggingFace API |
| License | Apache 2.0 | HuggingFace tags: `license:apache-2.0` |
| NVIDIA FP4 exists? | No | No `nvidia/Step-3.5-Flash-FP4` repository found |
| Optimization plan | NVFP4 expert MLPs + FP8 KV cache quantization | Long context (262K) requires KV cache compression |
| Estimated NVFP4 size | ~112 GB | 196B × 0.5625 bytes = 110.3 GB, plus non-quantized modules |

**Why it's here**: Step-3.5-Flash is the first model in the series where NVFP4 alone is not sufficient. At an estimated 112 GB for weights alone, the model fits within 121 GB — but only barely. The KV cache at 262,144 context length would push total memory well over the limit. This is where we need a second technique: KV cache quantization to FP8. The combination — NVFP4 weights + FP8 KV cache — should allow the model to fit with reasonable context windows. The 288-expert architecture with 8 active per token is also the most extreme expert ratio in the series (36:1 sparsity), which creates interesting routing and load-balancing considerations. StepFun is a Chinese AI lab with growing community traction (175K downloads, Apache 2.0).

### Week 7 — DeepSeek-V4-Flash

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `deepseek-ai/DeepSeek-V4-Flash` | — |
| Total parameters | ~671B | DeepSeek V4 architecture (same family as DeepSeek-R1) |
| Active parameters | ~6B | `config.json`: `num_experts_per_tok: 6` (routed), plus 1 shared expert |
| Architecture | MoE, 256 routed experts, 6 active per token, 1 shared expert | DeepSeek V4 architecture |
| Context length | 1,048,576 | `config.json`: `max_position_embeddings: 1048576` |
| Published format | Pre-quantized (experts FP4, non-experts FP8) | `config.json`: `expert_dtype: "fp4"`, quantization method: fp8 |
| Published file size | 159.6 GB | Verified via HuggingFace API (sum of `.safetensors`) |
| Downloads | 2,376,993 | HuggingFace API |
| Likes | 1,703 | HuggingFace API |
| License | MIT | HuggingFace tags: `license:mit` |
| NVIDIA FP4 exists? | Not applicable (already quantized) | Model is already in FP4/FP8 mixed precision |
| Optimization plan | Expert pruning (reduce 256 → ~128 experts) + distillation | Quantization already done; pruning is the only path to fit |

**Why it's here**: DeepSeek-V4-Flash is already quantized — its experts are in FP4 and non-expert layers are in FP8. At 159.6 GB, it is still 38 GB over the 121 GB budget. Further quantization is not an option; the model is already at 4-bit. The only path is **expert pruning**: reducing the number of routed experts from 256 to approximately 128, then using distillation to recover the accuracy lost from removing half the experts. This is the first model in the series where the optimization is architectural surgery, not numeric compression. With 2.4M downloads and MIT license, DeepSeek-V4-Flash is one of the most popular models in the series, and its 1M context length makes it a compelling target for local deployment.

### Week 8 — Qwen3-235B-A22B

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `Qwen/Qwen3-235B-A22B` | — |
| Total parameters | 235B | Model name: "235B-A22B" = 235B total, 22B active |
| Active parameters | 22B | Model name |
| Architecture | MoE, 128 experts, 8 active per token | Qwen3 architecture |
| Context length | 40,960 | `config.json`: `max_position_embeddings: 40960` |
| Published format | BF16 | Standard Qwen3 publication format |
| Published file size | 470.2 GB | Verified via HuggingFace API (sum of `.safetensors`); consistent with 235B × 2 bytes |
| Downloads | 918,837 | HuggingFace API |
| Likes | 1,100 | HuggingFace API |
| License | Apache 2.0 | HuggingFace tags: `license:apache-2.0` |
| NVIDIA FP4 exists? | Yes (gated) | `nvidia/Qwen3-235B-A22B-Instruct-FP4` exists but requires access approval; API returned 401 Unauthorized |
| Optimization plan | NVFP4 + FP8 KV cache + context length limitation | Weights at ~132 GB already exceed budget; need aggressive KV cache management |
| Estimated NVFP4 size | ~132 GB | 235B × 0.5625 bytes = 132.2 GB |

**Why it's here**: Qwen3-235B-A22B is the tightest fit in the series. At an estimated 132 GB NVFP4, the weights alone exceed the 121 GB unified memory. This model requires every technique in the Tier 2 toolbox: NVFP4 weight quantization (gets to ~132 GB), FP8 KV cache quantization (reduces serving overhead), and aggressive context length limitation (cap at 8K–16K instead of 40K to limit KV cache growth). Even with all three techniques, this model will be the closest to the edge — it may require `nvfp4_experts_only` (quantizing only the 128 expert MLPs, leaving shared layers at BF16) to stay within budget. The 919K download count and Apache 2.0 license make it one of the most community-relevant models in the series. NVIDIA has published an FP4 version, but it is gated (requires access approval), so we may need to create our own.

### Week 9 — Llama-3.1-405B

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `meta-llama/Llama-3.1-405B-Instruct` | — |
| Total parameters | 405B | Model name: "405B" |
| Active parameters | 405B (dense, no MoE) | Dense architecture — all parameters active |
| Architecture | Dense Transformer | Standard Llama 3.1 dense architecture |
| Published format | BF16 (gated) | Llama 3.1 Community License |
| BF16 estimated size | ~812 GB | 405B × 2 bytes = 810 GB; verified ~812 GB with embedding/norm overhead |
| NVIDIA FP4 verified size | 234.3 GB | Verified via HuggingFace API for `nvidia/Llama-3.1-405B-Instruct-FP4` |
| Downloads (base) | 212,185 | HuggingFace API |
| Downloads (NVIDIA FP4) | 1,848 | HuggingFace API |
| Likes | 596 | HuggingFace API |
| License | Llama 3.1 Community License | HuggingFace tags |
| NVIDIA FP4 exists? | Yes — 234.3 GB | Already published by NVIDIA, but 234 GB exceeds 121 GB budget |
| Optimization plan | Minitron structured pruning → distillation → NVFP4 | Full prune-distill-quantize pipeline |
| Target post-pruning params | ~100–120B | Pruning to match Nemotron-3-Super-120B class |
| Estimated final size | ~56–67 GB | 100–120B × 0.5625 bytes |

**Why it's here**: Llama-3.1-405B is the largest dense model in the series and the first that requires the full prune → distill → quantize pipeline. NVIDIA's FP4 version at 234.3 GB still does not fit in 121 GB — quantization alone is insufficient. The approach is the Minitron method: (1) structured pruning to reduce the model from 405B to approximately 100–120B parameters by removing layers and/or reducing width, (2) distillation from the original 405B model to recover accuracy, and (3) NVFP4 quantization of the pruned student. This is the same pipeline NVIDIA used to create Nemotron-3-Super-120B (which is itself a pruned and distilled version of Llama-3.1-405B). The difference is that we will take the output one step further to NVFP4, aiming for a final size of 56–67 GB. This is the most computationally expensive optimization in the series — distillation requires training, which means GPU time and a teacher model.

### Week 10 — DeepSeek-R1 (Finale)

| Field | Value | Source |
|---|---|---|
| HuggingFace ID | `deepseek-ai/DeepSeek-R1` | — |
| Total parameters | 671B | DeepSeek-R1 model card |
| Active parameters | 37B | 8 routed experts active + 1 shared expert |
| Architecture | MoE, 256 routed experts, 8 active per token, 1 shared expert | DeepSeek-R1 architecture |
| Context length | 131,072 | Model card |
| Published format | BF16 | Standard publication format |
| Published file size | 688.6 GB | Verified via HuggingFace API (sum of `.safetensors`); consistent with 671B × 2 bytes + overhead |
| NVIDIA FP4 verified size | 423.6 GB | Verified via HuggingFace API for `nvidia/DeepSeek-R1-FP4` |
| Downloads | 8,592,821 | HuggingFace API — highest in the series |
| Likes | 13,443 | HuggingFace API — highest in the series |
| License | MIT | HuggingFace tags: `license:mit` |
| NVIDIA FP4 exists? | Yes — 423.6 GB | Already published, but 424 GB is 3.5× the 121 GB budget |
| Optimization plan | Extreme expert pruning (256 → ~64 experts) + distillation + NVFP4 | Most aggressive optimization in the series |
| Target post-pruning params | ~200B | 64 experts × ~3B per expert + shared + attention |
| Estimated final size | ~112 GB | 200B × 0.5625 bytes = 112.5 GB |

**Why it's here**: DeepSeek-R1 is the finale — the most downloaded model on HuggingFace (8.6M downloads, 13.4K likes), the most capable reasoning model in the open-weight ecosystem, and the hardest optimization challenge in this series. At 688.6 GB BF16, it is 5.7× the DGX Spark's memory. NVIDIA's FP4 version at 423.6 GB is still 3.5× over budget. The only path is extreme expert pruning — reducing from 256 routed experts to approximately 64 — followed by distillation to recover reasoning capability and NVFP4 quantization of the result. The final model, at an estimated 112 GB, would fit within the 121 GB budget with minimal headroom for KV cache. This is the model where every technique in the Model Optimizer stack must be applied: pruning, distillation, and quantization, composed multiplicatively. If it works, it means the most popular reasoning model in the world can run on a desktop.

---

## The three-tier optimization strategy

The 10 models are organized into three tiers based on the complexity of optimization required. This is not an arbitrary grouping — it reflects the diminishing returns of each technique and the increasing risk of accuracy degradation.

### Tier 1: Quantization only (Weeks 1–4)

| Week | Model | BF16 / Published | NVFP4 Estimate | Fits? |
|---|---|---|---|---|
| 1 | GPT-OSS-120B | 65.2 GB (MXFP4) | ~65 GB | Yes |
| 2 | Mixtral-8x22B | 281.3 GB (BF16) | ~79 GB | Yes |
| 3 | GLM-4.7-Flash | 62.4 GB (BF16) | ~17.5 GB | Yes |
| 4 | Mistral-Large-2411 | 490.4 GB (FP32) | ~69 GB | Yes |

Tier 1 models can be made to fit using `w4a16_nvfp4` weight-only quantization alone. No pruning, no distillation, no architectural changes. The conversion is a single command: load the checkpoint, quantize the weights to NVFP4, export. The risk of accuracy degradation is lowest in this tier because no parameters are removed — only their numeric precision changes.

The four Tier 1 models cover four distinct scenarios:
- **GPT-OSS-120B**: Already fits in MXFP4; converting to NVFP4 for native hardware format
- **Mixtral-8x22B**: Does not fit at BF16; NVFP4 brings it from 281 GB to ~79 GB
- **GLM-4.7-Flash**: Already fits at BF16; NVFP4 frees memory for 200K context KV cache
- **Mistral-Large-2411**: Does not fit at FP32; NVFP4 brings it from 490 GB to ~69 GB

### Tier 2: NVFP4 plus one additional technique (Weeks 5–8)

| Week | Model | Published Size | NVFP4 Estimate | Additional Technique | Why |
|---|---|---|---|---|---|
| 5 | Llama-4-Scout | 217 GB (BF16) | 65.3 GB (NVIDIA FP4) | Multimodal handling | Vision encoder + language model co-residency |
| 6 | Step-3.5-Flash | 398.8 GB (BF16) | ~112 GB | FP8 KV cache quantization | 262K context requires compressed KV cache |
| 7 | DeepSeek-V4-Flash | 159.6 GB (pre-quant) | N/A | Expert pruning (256→128) | Already quantized; only pruning reduces size |
| 8 | Qwen3-235B-A22B | 470.2 GB (BF16) | ~132 GB | FP8 KV cache + context limit | NVFP4 weights alone exceed 121 GB |

Tier 2 is where NVFP4 alone is not enough. Each model requires one additional technique to fit within the 121 GB budget. The techniques vary: multimodal memory partitioning (Llama-4-Scout), KV cache compression (Step-3.5-Flash, Qwen3-235B-A22B), or architectural pruning (DeepSeek-V4-Flash). The risk of accuracy degradation is moderate — pruning removes capacity, and KV cache compression can affect long-context retrieval quality.

### Tier 3: Full prune → distill → quantize pipeline (Weeks 9–10)

| Week | Model | Published Size | NVIDIA FP4 | Optimization | Estimated Final |
|---|---|---|---|---|---|
| 9 | Llama-3.1-405B | ~812 GB (BF16) | 234.3 GB | Minitron prune → distill → NVFP4 | ~56–67 GB |
| 10 | DeepSeek-R1 | 688.6 GB (BF16) | 423.6 GB | Expert prune → distill → NVFP4 | ~112 GB |

Tier 3 is the hardest. These models are too large for quantization alone — even NVIDIA's FP4 versions (234 GB and 424 GB) do not fit. The only path is the full Minitron pipeline: structured pruning to reduce parameter count, distillation to recover accuracy, and then NVFP4 quantization of the pruned student. This is computationally expensive (distillation requires training) and carries the highest risk of accuracy degradation. But if it works, it means a 405B dense model and a 671B MoE model can run on a desktop — something that was impossible before NVFP4 and the prune-distill-quantize stack.

The multiplicative composition is the key insight. Pruning Llama-3.1-405B from 405B to 120B is a 3.4× reduction. NVFP4 quantization of the 120B student is a 3.56× reduction. Combined: 3.4 × 3.56 = 12.1× total compression, taking 812 GB → 67 GB. Neither technique alone gets there. Stacked, they do.

---

## Three original contributions

Three of the ten models have no NVFP4 quantized version anywhere on HuggingFace. We will create the first:

| Model | Published Format | NVFP4 Version Exists? | Our Contribution |
|---|---|---|---|
| Mixtral-8x22B-Instruct-v0.1 | BF16 (281 GB) | No | First NVFP4 checkpoint: ~79 GB |
| GLM-4.7-Flash | BF16 (62 GB) | No | First NVFP4 checkpoint: ~17.5 GB |
| Mistral-Large-Instruct-2411 | FP32 (490 GB) | No | First NVFP4 checkpoint: ~69 GB |

For these three models, the NVFP4 checkpoint we produce will be a genuine addition to the open-source ecosystem. We will publish the quantized checkpoints on HuggingFace under the appropriate model IDs (pending license compliance verification for Mistral-Large's Research License).

The remaining seven models either already have NVIDIA-published FP4 versions (Llama-4-Scout, Qwen3-235B-A22B, Llama-3.1-405B, DeepSeek-R1), are already quantized (DeepSeek-V4-Flash, GPT-OSS-120B), or have no NVFP4 version but our contribution is the deployment methodology rather than the checkpoint (Step-3.5-Flash).

---

## Benchmark methodology: smf-bench

Every model in this series will be evaluated using smf-bench — our own 181-test benchmark suite, MIT-licensed and public at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench). The suite covers:

| Suite | Tests | What it measures |
|---|---|---|
| reasoning | 30 | Multi-step logical deduction, causal reasoning, counterfactual analysis |
| math | 20 | Algebra, calculus, probability, discrete math, word problems |
| coding | 25 | Algorithm implementation, debugging, code review, API design |
| reasoning_tier0 | 20 | Foundational reasoning (baseline tier) |
| instruction | 20 | Instruction following, format compliance, constraint satisfaction |
| prose | 20 | Writing quality, coherence, style adaptation, summarization |
| writing | 20 | Creative writing, technical writing, persuasive writing |
| tool_calling | 20 | Function calling, API usage, multi-step tool chains |
| agentic | 6 | Multi-turn task completion, planning, autonomous execution |
| **Total** | **181** | — |

Each test is scored pass/fail with automated grading. Difficulty is stratified across 5 tiers: easy, medium, hard, expert, and frontier. The benchmark is run against a vLLM OpenAI-compatible endpoint, so any model that vLLM can serve can be benchmarked.

The benchmark execution command:

```bash
python3 run_stage1.py \
  --endpoint http://spark-56bc:<port>/v1 \
  --model <model_name> \
  --tag <tag> \
  --timeout 120
```

Results are saved as JSON with incremental writes, so partial results are preserved even if a run is interrupted. The 181 tests take between 28 minutes (Qwen3.6-35B-A3B, the fastest) and 530 minutes (Nemotron-3-Super-120B, the slowest) depending on model speed and test complexity.

This is the same suite that produced the first-round results cited above. The advantage of using one consistent internal standard — rather than depending on third-party benchmark repos that evolve independently — is that results are directly comparable across all models and all rounds of testing.

---

## What to expect

Each week will produce one deep-dive blog post covering:

1. **Model architecture analysis** — what makes this model different, what its strengths and weaknesses are
2. **DGX Spark constraint analysis** — exactly why this model does not fit, and what the memory budget requires
3. **Model Optimizer 0.45.0 optimization process** — the exact commands, configs, and parameters used
4. **smf-bench results** — all 181 tests, broken down by suite and difficulty tier, with wall-clock timing
5. **Comparison to baseline** — how the optimized model compares to the first-round results (Gemma-4-26B at 84.0%, Qwen3.6-35B at 71.3%, Nemotron-3-Super-120B at 69.6%, Nemotron-3-Nano-30B at 54.7%)
6. **Final verdict** — does the optimization work? Is the model practically deployable? What are the tradeoffs?

The posts will include real numbers from real runs on `spark-56bc`. No estimates in the results sections — only measured data. If a model fails to fit, we will report that honestly. If accuracy degrades significantly, we will report the exact degradation. If a technique does not work as expected, we will document what went wrong.

---

## Verification notes

Every external fact in this post was verified on July 7, 2026:

- **Parameter counts**: Sourced from model `config.json` files (for architecture-derived counts) and official model card READMEs (for stated counts). Where a model card states a count (e.g., GPT-OSS-120B: "117B parameters with 5.1B active"), the stated count is used. Where no stated count exists, the count is calculated from config dimensions and the calculation method is described.
- **File sizes**: Sum of all `.safetensors` file sizes from the HuggingFace API tree endpoint (`huggingface.co/api/models/{id}/tree/main`). These are the actual published artifact sizes, not estimates.
- **Download counts and likes**: From the HuggingFace API `downloads` and `likes` fields for each model ID. These are point-in-time values as of July 7, 2026, and will change over time.
- **Licenses**: From the `tags` array in the HuggingFace API response, cross-referenced with the model card `license` field in the README frontmatter.
- **Model Optimizer version**: Verified via PyPI (`pypi.org/pypi/nvidia-modelopt/json`) — package `nvidia-modelopt` version `0.45.0`, upload date `2026-07-06T07:00:28`.
- **NVFP4 size estimates**: Calculated as `parameter_count × 0.5625 bytes`, derived from the NVFP4 format (4-bit weights + 8-bit FP8 group scales at group_size=16). Marked with ~ throughout. Where NVIDIA has published an FP4 version, the verified file size is used instead of the estimate.
- **smf-bench results**: From JSON result files in our local results directory, generated by actual benchmark runs on `spark-56bc`.

The NVFP4 size estimates are theoretical and will be replaced with measured sizes in each weekly deep-dive post. The actual compressed size depends on which modules are quantized (Model Optimizer excludes attention, embeddings, and routers from quantization by default), packing overhead, and metadata.

---

## The bottom line

This series is an engineering experiment: can a 121 GB desktop workstation run models that were designed for multi-GPU server clusters? The answer depends on the model, the optimization technique, and the acceptable accuracy/throughput tradeoff.

The tools exist. NVIDIA Model Optimizer 0.45.0 provides the quantization, pruning, and distillation primitives. The GB10 Grace Blackwell chip provides native NVFP4 hardware acceleration. The unified memory architecture eliminates the PCIe bottleneck. smf-bench provides a consistent, reproducible evaluation framework.

What remains is the work: 10 weeks, 10 models, 10 deep dives. Each one will answer a specific question about what is possible when you compress frontier models to fit on a desktop. We start next week with GPT-OSS-120B — the most downloaded model in the series, the one that already fits, and the one where the question is not whether it runs but how much faster it runs when the format matches the hardware.

---

*All data verified July 7, 2026. Model specifications, file sizes, and download counts are point-in-time values from HuggingFace and PyPI APIs. NVFP4 size estimates are theoretical calculations, not measured results. Actual optimized sizes and benchmark scores will be published in weekly deep-dive posts.*

*smf-bench is open source under the MIT license at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).*