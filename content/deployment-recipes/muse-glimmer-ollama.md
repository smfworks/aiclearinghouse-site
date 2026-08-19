---
slug: muse-glimmer-ollama
title: Deploy Meta Muse Glimmer 30B Locally with Ollama
excerpt: Run Meta's open-weight 30B agentic multimodal model on a single consumer GPU for local agent development — no API keys, no cloud.
category: Model Serving
tags:
  - ollama
  - muse-glimmer
  - meta
  - local-models
  - multimodal
  - self-hosting
order: 24
last_verified: "2026-08-19"
difficulty: Beginner
estimated_time: "15 min"
---

# Deploy Meta Muse Glimmer 30B Locally with Ollama

## The promise

Meta released Muse Glimmer 30B on August 10, 2026 — a 30-billion-parameter open-weight model under Apache 2.0 that runs on a single consumer GPU. It is agentic (tool-use, agent workflows), multimodal (vision + text), and competitive with much larger models on coding and reasoning benchmarks. With Ollama, you can have it running locally in under 15 minutes.

## What you will get

- A local Muse Glimmer 30B server accessible at `http://localhost:11434`
- An OpenAI-compatible API endpoint for agents, coding tools, and test harnesses
- Vision capabilities — send images alongside text prompts
- No API keys, no cloud dependencies, no per-token costs

## Prerequisites

- **NVIDIA GPU with at least 24GB VRAM** (RTX 3090, 4090, 5090, or A-series). Muse Glimmer 30B in Q4 quantization uses roughly 18–20GB.
- **Ollama installed** (if not, run `curl -fsSL https://ollama.com/install.sh | sh`)
- **Recent NVIDIA drivers** (CUDA 12+ recommended)

## Steps

### 1. Pull the model

```bash
ollama pull muse-glimmer
```

Ollama will download the GGUF quantized version from its registry. This is approximately 18GB for the default Q4_K_M quantization. The download may take 10–30 minutes depending on your connection.

### 2. Run the model

```bash
ollama run muse-glimmer
```

This loads the model into VRAM and drops you into an interactive chat. Test it:

```
>>> What is 17 * 23?
389

>>> Describe what you see in this image: [paste image path]
```

### 3. Serve via the OpenAI-compatible API

Ollama automatically exposes an OpenAI-compatible endpoint. Point any OpenAI SDK client at it:

```bash
curl http://127.0.0.1:11434/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "muse-glimmer",
    "messages": [{"role": "user", "content": "Write a Python function to check if a number is prime."}]
  }'
```

### 4. Point your agent at it

In your agent's configuration, set the base URL:

```
base_url: http://localhost:11434/v1
model: muse-glimmer
api_key: ollama (any non-empty string works)
```

Hermes Agent, Continue, Open WebUI, and any OpenAI-compatible client will work without code changes.

### 5. Test multimodal (vision)

```bash
curl http://127.0.0.1:11434/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "muse-glimmer",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "What is in this image?"},
        {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
      ]
    }]
  }'
```

## Verification

- `ollama ps` shows `muse-glimmer` loaded with memory usage
- The curl chat completion returns a valid response
- `ollama show muse-glimmer` displays model metadata and parameters
- An agent pointed at `localhost:11434/v1` completes a task successfully

## Troubleshooting

- **OOM on load:** You need at least 24GB VRAM for Q4. If you have 16GB, try a smaller quantization or use a smaller model. Ollama does not let you pick quantization from the CLI — you would need to import a specific GGUF file for a lower quant.
- **Slow first response:** Cold load is expected. The first prompt loads weights into VRAM. Subsequent prompts are fast. Ollama unloads models after idle timeout (configurable via `OLLAMA_KEEP_ALIVE`).
- **Vision not working:** Ensure you are using the latest Ollama version that supports multimodal models. Check `ollama --version` is recent.
- **Out of memory with other GPU workloads:** Ollama keeps the model in VRAM until idle timeout. If you are running other GPU tasks, reduce the timeout: `OLLAMA_KEEP_ALIVE=5m ollama run muse-glimmer`.

## Honest notes

- **Throughput is for development, not production serving.** Ollama is optimized for developer convenience, not high concurrency. If you need to serve many concurrent requests, use vLLM with Muse Glimmer instead. Ollama is for development and testing; vLLM is for production.
- **Q4 quantization loses some quality.** The full-precision model scores higher on benchmarks. For development and testing, Q4 is fine. For production quality, consider Q8 or FP16 if your VRAM allows.
- **Muse Glimmer is new.** The model shipped August 10, 2026. Ollama registry support and community quantizations are still maturing. If `ollama pull muse-glimmer` fails, check HuggingFace for GGUF files and import manually: `ollama create muse-glimmer -f Modelfile`.