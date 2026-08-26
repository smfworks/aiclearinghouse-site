---
slug: granite-4-2-sglang-deploy
title: Deploy IBM Granite 4.2 with SGLang
excerpt: Serve the 30B reasoning model with switchable thinking mode using SGLang on a single H200 or B200 — with Docker, thinking-mode examples, and benchmark validation.
category: Self-Hosting
tags:
  - granite
  - ibm
  - sglang
  - reasoning
  - self-hosting
  - docker
  - gpu
order: 99
last_verified: "2026-08-26"
difficulty: Intermediate
estimated_time: "30 min"
---

# Deploy IBM Granite 4.2 with SGLang

## The promise

IBM Granite 4.2 30B is an open-weight reasoning model with 57% on SWE-bench Verified — competitive with closed models several times its size. With SGLang, you can serve it on a single H200 or B200 GPU with switchable thinking modes, speculative decoding, and production-grade throughput. Everything ships under Apache 2.0.

## What you'll get

- Granite 4.2 30B running on SGLang with full thinking-mode support
- Toggleable reasoning: full thinking, non-thinking, and low-effort from a single endpoint
- An OpenAI-compatible API for drop-in integration with agent frameworks
- Docker-based deployment that survives restarts

## Prerequisites

- NVIDIA H200 (80GB) or B200 GPU (or equivalent with 60GB+ VRAM)
- Docker with NVIDIA Container Toolkit
- 60GB disk space for model weights

## Step 1: Pull the model

```bash
# Create a directory for model weights
mkdir -p /data/models/granite-4.2-30b

# Clone from Hugging Face
git clone https://huggingface.co/ibm-granite/granite-4.2-30b /data/models/granite-4.2-30b
```

For faster downloads, use `huggingface-cli`:

```bash
pip install huggingface-hub
huggingface-cli download ibm-granite/granite-4.2-30b --local-dir /data/models/granite-4.2-30b
```

## Step 2: Start SGLang with Docker

```bash
docker run --gpus all \
  --shm-size 32g \
  -v /data/models/granite-4.2-30b:/models/granite-4.2-30b \
  -p 30000:30000 \
  --name granite-sglang \
  lmsysorg/sglang:latest \
  python3 -m sglang.launch_server \
  --model-path /models/granite-4.2-30b \
  --port 30000 \
  --tp 1 \
  --trust-remote-code \
  --reasoning-parser granite
```

Wait for the server to log "Server is ready" — this takes 2-5 minutes on first load while weights transfer to GPU.

## Step 3: Verify the endpoint

```bash
curl http://localhost:30000/v1/models | jq .
```

You should see `granite-4.2-30b` in the model list.

## Step 4: Test thinking mode

```bash
# Full thinking mode (default)
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "granite-4.2-30b",
    "messages": [{"role": "user", "content": "Solve: what is 17 * 23 + 42?"}],
    "temperature": 1.0,
    "top_p": 0.95,
    "max_tokens": 8192,
    "thinking": {"type": "enabled"}
  }'
```

```bash
# Non-thinking mode (fast, direct)
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "granite-4.2-30b",
    "messages": [{"role": "user", "content": "Summarize this code in two sentences."}],
    "temperature": 1.0,
    "top_p": 0.95,
    "max_tokens": 2048,
    "thinking": {"type": "disabled"}
  }'
```

## Step 5: Connect an agent framework

The SGLang endpoint is OpenAI-compatible, so most agent frameworks work with minimal configuration:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:30000/v1",
    api_key="none"  # SGLang doesn't require auth by default
)

response = client.chat.completions.create(
    model="granite-4.2-30b",
    messages=[{"role": "user", "content": "Write a Python function to merge two sorted lists."}],
    temperature=1.0,
    top_p=0.95,
    max_tokens=8192,
)
print(response.choices[0].message.content)
```

## Recommended sampling parameters

| Mode | Temperature | top_p | max_tokens |
|------|------------|-------|------------|
| Full thinking | 1.0 | 0.95 | 8192 |
| Low-effort thinking | 1.0 | 0.95 | 4096 |
| Non-thinking | 1.0 | 0.95 | 2048 |

Temperature must be > 0 for all modes. `do_sample=True` is required when temperature > 0.

## Troubleshooting

- **OOM on load**: The 30B model in bfloat16 needs ~60GB VRAM. If you have less, use the FP8 or INT4 quantized variants: `ibm-granite/granite-4.2-30b-FP8`
- **Slow first response**: SGLang compiles CUDA graphs on first request. Subsequent requests will be faster.
- **Thinking mode not working**: Ensure you're using SGLang v0.4.x+ and passing `--reasoning-parser granite` at startup.
- **8B model instead**: For smaller GPUs, swap `granite-4.2-30b` for `granite-4.2-8b` (fits in 24GB VRAM)