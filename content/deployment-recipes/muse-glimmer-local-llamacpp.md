---
slug: muse-glimmer-local-llamacpp
title: "Run Muse Glimmer 30B Locally with llama.cpp and DFlash"
excerpt: "Deploy Meta's open-weight 30B agentic model on a single consumer GPU using llama.cpp with DFlash speculative decoding for 2-3x throughput improvement."
category: Self-Hosting
tags:
  - llama-cpp
  - local-model
  - open-weight
  - meta
  - gpu
  - speculative-decoding
order: 99
last_verified: "2026-08-12"
difficulty: Intermediate
estimated_time: "30 min"
---

# Run Muse Glimmer 30B Locally with llama.cpp and DFlash

## Overview

Meta's Muse Glimmer 30B is an Apache 2.0-licensed open-weight model that runs on a single consumer GPU with 24GB+ VRAM. This recipe deploys it using llama.cpp with DFlash speculative decoding — a block-diffusion drafter that proposes 16 tokens at a time for parallel verification, delivering 2-3x throughput improvement over standard autoregressive generation.

## Prerequisites

- **GPU**: 24GB+ VRAM (RTX 4090, RTX 5090, or Mac with 32GB+ unified memory)
- **llama.cpp**: Latest build with DFlash support (shipped day-0 with Muse Glimmer release)
- **Disk space**: ~17GB for the smallest GGUF quantization
- **OS**: Linux, macOS, or Windows (WSL2)

## Step 1: Install llama.cpp

```bash
# Clone and build llama.cpp with CUDA support
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j $(nproc)
```

For macOS with Metal:
```bash
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j $(sysctl -n hw.ncpu)
```

## Step 2: Download the model

```bash
# Download the official K-quant GGUF from Hugging Face
huggingface-cli download meta-models/Muse-Glimmer-30B-GGUF \
  --local-dir ./models/muse-glimmer \
  --include "*.gguf"
```

The smallest quantization is approximately 16.76GB. Total working memory (weights + KV cache + vision encoder + DFlash drafter) targets 24GB.

## Step 3: Start the server with DFlash

```bash
# Start the llama.cpp server with DFlash speculative decoding
llama serve \
  -hf meta-models/Muse-Glimmer-30B-GGUF \
  --spec-type draft-dflash \
  --spec-draft-n-max 15
```

The `--spec-draft-n-max 15` argument controls how many future tokens DFlash proposes per step. Muse Glimmer's DFlash model was trained with a block size of 16 (one anchor token plus 15 proposed tokens), so values above 15 are clamped.

## Step 4: Use the CLI with speculative decoding

```bash
# Interactive CLI with DFlash
llama cli \
  -hf meta-models/Muse-Glimmer-30B-GGUF \
  --spec-type draft-dflash
```

## Step 5: Deploy with vLLM (production)

For production deployments with higher throughput:

```bash
pip install vllm transformers

# vLLM supports Muse Glimmer via the transformers backend
python -m vllm.entrypoints.openai.api_server \
  --model meta-models/Muse-Glimmer-30B \
  --backend transformers \
  --port 8000
```

## Step 6: Connect your agent

Point your agent at the local endpoint:

```bash
# Example: Hermes Agent configuration
export OPENAI_API_BASE=http://localhost:8000/v1
export MODEL_NAME=muse-glimmer-30b
```

## Performance notes

- **DFlash with greedy decoding**: DFlash works best with deterministic (greedy) decoding, which maximizes speculative token acceptance. Sampling may reduce the speed advantage.
- **Sliding-window attention**: 39 of 52 layers use 2,048-token sliding windows, keeping long-context inference tractable. Only 13 layers perform global attention.
- **Context window**: 131,072 tokens stated. For long-context tasks, monitor KV cache memory usage.

## Troubleshooting

- **OOM at 24GB**: Use the smaller K-quant variant or reduce `--n-gpu-layers` to offload some layers to CPU
- **DFlash not accelerating**: Ensure you're using greedy decoding (`--temp 0` or `do_sample: false`). Sampling increases variance and reduces speculative token acceptance.
- **Slow on Mac**: Ensure Metal acceleration is enabled. Unified memory architectures benefit from the sliding-window attention pattern.

## References

- Meta Research blog: "Introducing Muse Glimmer" (August 10, 2026)
- Hugging Face model card: `meta-models/Muse-Glimmer-30B`
- DFlash paper: arXiv 2602.06036