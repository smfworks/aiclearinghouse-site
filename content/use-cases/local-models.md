---
slug: local-models
title: Local Model Agents
excerpt: "Agents and stacks that run entirely on your own hardware for privacy, compliance, cost predictability, and control."
category: Use Case
tags:
  - local
  - self-hosted
  - privacy
  - Ollama
  - llama.cpp
last_verified: 2026-06-16
---

# Local Model Agents

## What they do

Local model agents run entirely on your own hardware. They are the right choice when privacy, compliance, cost predictability, or vendor independence matters more than having the absolute latest frontier model.

## Common tasks

- **Private chat.** Run conversational agents on sensitive documents.
- **Local coding assistance.** Use Aider, Cline, or Continue with a local endpoint.
- **Edge deployment.** Serve models on devices or in air-gapped environments.
- **Batch processing.** Run inference over private datasets without leaving your network.
- **Hybrid fallback.** Use local models for safe tasks and cloud models for harder ones.

## Top picks

### Ollama + Open WebUI
Best for quick setup and a web chat interface on macOS, Linux, or Windows.

### llama.cpp
Best for maximum control, custom quantization, and unusual or edge hardware.

### Jan
Best for a polished desktop app with model management and conversations.

### LM Studio
Best for a GUI model loader with good GPU offload and chat/completion modes.

### Aider + Ollama
Best for git-aware, private coding assistance in the terminal.

## How to choose

| Situation | Best choice |
|-----------|-------------|
| Quick setup + web chat | Ollama + Open WebUI |
| Maximum control and edge deployment | llama.cpp |
| Polished desktop app | Jan |
| GUI loader with GPU offload | LM Studio |
| Private coding assistant | Aider + Ollama |
| IDE-integrated local agent | Cline + Ollama |

## Key design decisions

- **Hardware fit.** Match model size and quantization to your GPU VRAM or unified memory.
- **Quantization trade-off.** Smaller quants run faster but can reduce quality.
- **Fallback strategy.** Use a cloud model for tasks the local model cannot handle.
- **Security.** Keep model files and logs on encrypted storage if data is sensitive.
- **Testing.** Evaluate on your real prompts, not just generic benchmarks.

## Honest limitations

- Local models are usually smaller and less capable than cloud frontier models.
- VRAM limits force hard choices about model size and context length.
- Latency can be higher than cloud APIs on consumer hardware.
- Maintenance is your responsibility.

## Getting started

1. Check your GPU VRAM or Apple Silicon memory.
2. Install Ollama or llama.cpp with GPU offload.
3. Download a quantized model that fits comfortably in memory.
4. Wire an agent like Cline, Aider, or OpenClaw to the local endpoint.
5. See [Self-Hosting](/self-hosting) for hardware and OS guidance.

**Related:**
- [NVIDIA-Based Self-Hosting](/self-hosting/nvidia-based)
- [AMD-Based Self-Hosting](/self-hosting/amd-based)
- [Local Model Code Generation Benchmark](/tests/local-model-code-generation-benchmark)
