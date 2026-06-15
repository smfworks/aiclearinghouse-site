---
slug: macos-ollama-silicon
title: Run Ollama on macOS with Apple Silicon
excerpt: Install Ollama on M1/M2/M3 Macs with Metal GPU acceleration. The easiest path to local LLMs for macOS developers.
category: Self-Hosting
tags:
  - ollama
  - macos
  - apple-silicon
  - metal
  - local-llm
  - m1
  - m2
  - m3
order: 1
last_verified: 2026-06-15
difficulty: Beginner
estimated_time: 15 min
---

# Run Ollama on macOS with Apple Silicon

## The promise

Apple Silicon Macs are the most pleasant hardware for running local LLMs. The unified memory architecture means your 32GB MacBook Pro can load a 30B parameter model that would need a dedicated GPU on Linux. Metal performance shaders handle inference efficiently, and the fan barely spins up for moderate workloads.

This recipe gets Ollama running with Metal acceleration on any Apple Silicon Mac. It is the recommended starting point for macOS users who want local agents.

## What you'll get

- Ollama installed via Homebrew or official installer
- Metal GPU acceleration automatically enabled
- One or more local models pulled and verified
- The Ollama REST API available at `http://localhost:11434`

## Prerequisites

- macOS Sonoma (14.x) or newer
- Apple Silicon Mac (M1, M2, M3, or M4)
- 16GB RAM minimum (32GB recommended for larger models)
- Homebrew installed (optional but recommended)
- Internet access during install

## Step 1: Install Ollama

### Option A: Homebrew (recommended)

```bash
brew install ollama
```

### Option B: Official installer

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Both methods install the `ollama` CLI and a LaunchAgent that starts the server automatically.

## Step 2: Verify Metal acceleration

Ollama detects Apple Silicon automatically and uses Metal. Verify with:

```bash
ollama --version
```

You should see version 0.3.x or newer. Metal support is automatic — no configuration needed.

## Step 3: Pull your first model

Start with a small, capable model:

```bash
ollama pull qwen3.5:9b
ollama run qwen3.5:9b
```

When you see the prompt, try:

> "Say hello and confirm you are running locally with Metal acceleration."

If you get a response, Ollama is serving requests on Metal.

## Step 4: Check memory usage

In a new terminal:

```bash
ollama ps
```

This shows loaded models and their memory footprint. On a 16GB Mac, you can typically run one 9B model comfortably. On 32GB, two 9B models or one 14B model.

## Model recommendations by RAM

| Mac RAM | Comfortable model | Maximum model |
|---------|-------------------|---------------|
| 16GB | qwen3.5:9b | llama3.1:8b |
| 24GB | qwen2.5-coder:14b | qwen3.5:14b |
| 32GB | qwen3.5:14b + 9b | qwen3.5:32b |
| 64GB+ | qwen3.5:32b | mixtral:47b |

## Step 5: Integrate with your agent

### Cline (VS Code extension)

1. Install the Continue or Cline extension
2. In settings, set the API provider to "Ollama"
3. Set the model to `qwen3.5:9b` or your preferred model
4. The extension now talks to `http://localhost:11434`

### OpenClaw

```bash
openclaw configure
# Select "Local (Ollama)" as provider
# Enter http://localhost:11434 as endpoint
```

### Aider

```bash
aider --model ollama/qwen3.5:9b
```

## Troubleshooting

### "ollama: command not found"

Homebrew may not be in your PATH. Add to `~/.zshrc`:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Then `source ~/.zshrc`.

### "Error: model requires more system memory"

Your Mac does not have enough unified memory for the model. Either:
- Close other applications
- Use a smaller model (try `:7b` instead of `:14b`)
- Use quantized models (Ollama defaults to 4-bit quantization)

### Slow inference

- Check Activity Monitor for other memory-heavy apps
- Try a smaller context window: `ollama run qwen3.5:9b --ctx-size 2048`
- Ensure you are on macOS Sonoma or newer (Metal 3 performance)

### Model download hangs

```bash
ollama rm qwen3.5:9b
ollama pull qwen3.5:9b
```

## Best fit

macOS developers who want local LLMs without managing Linux drivers, CUDA toolkits, or Docker containers. Apple Silicon makes this the simplest platform for local-first AI.
