---
slug: qwen-vllm-nvfp4
title: Run Qwen3.6-27B on vLLM with NVFP4
excerpt: Production recipe for serving Qwen3.6-27B efficiently on NVIDIA hardware using vLLM and NVFP4 quantization. Cut VRAM and boost throughput without major accuracy loss.
category: Self-Hosting
tags:
  - vllm
  - qwen
  - nvfp4
  - quantization
  - nvidia
  - inference
  - self-hosting
order: 4
last_verified: 2026-06-24
difficulty: Advanced
estimated_time: 45 min
---

# Run Qwen3.6-27B on vLLM with NVFP4

## The promise

Qwen3.6-27B is a dense, capable model, but running it at full precision requires a lot of VRAM. NVFP4 quantization on NVIDIA Blackwell and compatible hardware lets you serve it with roughly half the memory and higher throughput, while keeping accuracy close to FP16. This recipe deploys Qwen3.6-27B with vLLM and NVFP4.

## What you'll get

- Qwen3.6-27B served via the OpenAI-compatible vLLM API
- NVFP4 weight and activation quantization
- Reduced VRAM footprint for single-GPU or multi-GPU deployment
- Docker-based setup for reproducibility

## Prerequisites

- NVIDIA GPU with NVFP4 support (Blackwell generation or later)
- CUDA 12.8+ and NVIDIA Container Toolkit
- Docker and Docker Compose
- 24GB+ VRAM after quantization (exact requirement varies by hardware)
- A Hugging Face token if the model is gated

## Step 1: Verify hardware and drivers

```bash
nvidia-smi
python3 -c "import torch; print(torch.version.cuda)"
```

Ensure CUDA is 12.8 or newer. NVFP4 requires a recent NVIDIA software stack.

## Step 2: Pull the vLLM image with NVFP4 support

```bash
docker pull vllm/vllm-openai:latest
```

For pre-release NVFP4 support, check the vLLM documentation for the correct image tag.

## Step 3: Create the launch script

```bash
mkdir -p ~/vllm-qwen-nvfp4
cd ~/vllm-qwen-nvfp4
```

Create `run.sh`:

```bash
#!/bin/bash
export HF_TOKEN=your_huggingface_token
export MODEL_NAME=Qwen/Qwen3.6-27B-Instruct

docker run --rm -it \
  --gpus all \
  -p 8000:8000 \
  -e HF_TOKEN=$HF_TOKEN \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model $MODEL_NAME \
  --quantization nvfp4 \
  --dtype bfloat16 \
  --max-model-len 32768 \
  --tensor-parallel-size 1 \
  --gpu-memory-utilization 0.92
```

For multi-GPU, set `--tensor-parallel-size` to the number of GPUs.

## Step 4: Start the server

```bash
chmod +x run.sh
./run.sh
```

Wait for the model to download and quantize. First launch can take several minutes depending on bandwidth and hardware.

## Step 5: Test the endpoint

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3.6-27B-Instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Explain structured output for tool calls."}
    ],
    "temperature": 0.2,
    "max_tokens": 512
  }'
```

## Step 6: Configure your agent

Point OpenClaw, Cline, Aider, or another agent at:

```
base_url: http://localhost:8000/v1
model: Qwen/Qwen3.6-27B-Instruct
```

## Tuning for throughput

| Setting | Recommendation |
|---------|----------------|
| `--max-model-len` | Set to the longest context you actually need |
| `--gpu-memory-utilization` | 0.92 is a safe default; lower if you run sidecar processes |
| `--tensor-parallel-size` | Use multiple GPUs only if one GPU cannot fit the model |
| `--max-num-batched-tokens` | Increase if you serve many concurrent requests |
| `--enable-prefix-caching` | Enable for chat and agent workloads with repeated prompts |

## Accuracy and verification

Before production use, run your own benchmarks:

1. Compare FP16 and NVFP4 outputs on a sample of real queries.
2. Measure pass rates on coding or reasoning benchmarks you care about.
3. Watch for degradation in long-context recall or multi-step reasoning.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| NVFP4 option not recognized | vLLM version too old or Docker image lacks the feature |
| OOM during load | `--max-model-len` too high or VRAM fragmented |
| Slow first request | Model downloading or JIT compilation; warm up the server |
| Wrong outputs | Wrong chat template; verify the model's Instruct variant |

## Best fit

Teams running Qwen3.6-27B on NVIDIA hardware who want lower serving costs and higher throughput than FP16. Best for agent backends, chat APIs, and coding assistants where a small accuracy trade-off is acceptable.

**Related:**
- [Docker Compose Full AI Stack](/deployment-recipes/docker-compose-ai-stack)
- [Linux Self-Hosting](/self-hosting/linux)
- [vLLM Agent](/agents/vllm)
