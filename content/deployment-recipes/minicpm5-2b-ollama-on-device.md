---
slug: minicpm5-2b-ollama-on-device
title: Deploy MiniCPM5-2B with Ollama for On-Device Inference
excerpt: Run OpenBMB's 2.5B on-device model locally with Ollama — no GPU required, no API bills, no prompts leaving your machine. Works on laptops, desktops, and edge boxes.
category: Deployment
tags:
  - ollama
  - on-device
  - minicpm
  - self-hosting
  - local
  - open-weight
order: 103
last_verified: "2026-09-16"
difficulty: Beginner
estimated_time: "15 min"
---

# Deploy MiniCPM5-2B with Ollama for On-Device Inference

## The promise

Run MiniCPM5-2B — OpenBMB's 2.5B parameter on-device model — on your own machine with Ollama. No GPU required (though one helps). No API keys, no per-token costs, no prompts sent to a remote server. The model runs entirely locally and is accessible through an OpenAI-compatible API at `http://localhost:11434`.

## What you will get

- A local Ollama server serving MiniCPM5-2B
- An OpenAI-compatible API endpoint for agent integration
- A model that runs on 16GB RAM laptops without a GPU at 15-25 tok/s
- Full privacy — no prompt data leaves your machine

## Prerequisites

- **Ollama** installed (v0.5.0 or later). Install from [ollama.com](https://ollama.com) or `curl -fsSL https://ollama.com/install.sh | sh`
- **8GB+ RAM** (16GB recommended for comfortable multitasking)
- **10GB disk space** for the model weights
- **Optional:** NVIDIA GPU with 6GB+ VRAM for faster inference (CPU-only works fine for this model size)

## Step-by-step

### 1. Verify Ollama is installed

```shell
ollama --version
```

If Ollama is not installed:

```shell
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull the MiniCPM5-2B model

Ollama automatically selects the right quantization for your hardware. For most laptops without a discrete GPU, it will pull the Q4_K_M GGUF:

```shell
ollama pull minicpm5:2b
```

If the model name is not yet in the Ollama registry, pull it from HuggingFace directly:

```shell
ollama pull hf.co/openbmb/MiniCPM5-2B-GGUF:Q4_K_M
```

This downloads ~1.8GB for the Q4_K_M quantization. Download time depends on your connection; the file is a single GGUF.

### 3. Run the model

```shell
ollama run minicpm5:2b
```

You are now in an interactive chat session with MiniCPM5-2B running entirely on your machine. Type a message and press Enter.

### 4. Serve the OpenAI-compatible API

Ollama runs a server on `http://localhost:11434` by default. It exposes an OpenAI-compatible endpoint at `/v1/chat/completions`. You do not need to start anything extra — the server runs alongside the CLI.

Test it:

```shell
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minicpm5:2b",
    "messages": [{"role": "user", "content": "Explain what a context window is in two sentences."}],
    "stream": false
  }'
```

### 5. Point your agent at the local model

Any OpenAI SDK client works. Set the base URL to Ollama and use any string as the API key (Ollama does not require authentication for local requests):

**Python:**
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # placeholder, not checked
)

response = client.chat.completions.create(
    model="minicpm5:2b",
    messages=[{"role": "user", "content": "Summarize the key features of MiniCPM5-2B."}]
)
print(response.choices[0].message.content)
```

**Hermes Agent config** (in your provider settings):
```json
{
  "provider": "openai-compatible",
  "base_url": "http://localhost:11434/v1",
  "model": "minicpm5:2b",
  "api_key": "ollama"
}
```

### 6. Set the context window

MiniCPM5-2B supports 131,072 tokens natively. Ollama defaults to 2048. Increase it for longer conversations:

```shell
ollama run minicpm5:2b --context-window 131072
```

Or via the API, pass `options` in your request:

```json
{
  "model": "minicpm5:2b",
  "messages": [...],
  "options": {
    "num_ctx": 32768
  }
}
```

Start with 32K (enough for most agent tasks) and increase if needed. Full 131K context will use more RAM.

## Verification

Check that the model is running and serving correctly:

```shell
# List loaded models
ollama list

# Check server health
curl http://localhost:11434/api/tags

# Run a quick benchmark
time echo "Write a Python function to check if a string is a palindrome." | ollama run minicpm5:2b
```

Expected output: a working Python function in 5-15 seconds on CPU, 2-5 seconds with a GPU.

## Troubleshooting

**Out of memory error:** Drop to a smaller quantization. `Q3_K_S` uses ~1.3GB RAM and still performs well for a 2.5B model. Pull it with `ollama pull hf.co/openbmb/MiniCPM5-2B-GGUF:Q3_K_S`.

**Slow inference on CPU:** MiniCPM5-2B at Q4 runs at 15-25 tok/s on a modern laptop CPU. If you are seeing under 10 tok/s, check that you are not running other memory-heavy applications. Close browsers with many tabs. The model competes for RAM bandwidth.

**Model not found in Ollama registry:** Use the HuggingFace pull path: `ollama pull hf.co/openbmb/MiniCPM5-2B-GGUF:Q4_K_M`. Ollama supports pulling GGUF files directly from HuggingFace.

**Context window truncation:** If responses seem to ignore earlier context, check `num_ctx`. Ollama silently truncates at the configured window. Set it explicitly via `--context-window` or the `options.num_ctx` API parameter.

**GPU not being used:** Run `ollama ps` to see which model is loaded and on what device. If it shows CPU, ensure you have the NVIDIA Container Toolkit installed (`nvidia-ctk`) and that Ollama detected your GPU at startup. Check `ollama logs` for CUDA initialization messages.