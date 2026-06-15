---
slug: local-models
title: Local Model Agents
excerpt: Agents and stacks that run entirely on your own hardware for privacy, compliance, and control.
category: Use Case
tags:
  - local
  - self-hosted
  - privacy
  - Ollama
  - llama.cpp
last_verified: 2026-06-14
---

# Local Model Agents

Local model agents run entirely on your own hardware. They are the right choice when privacy, compliance, cost predictability, or vendor independence matters more than having the absolute latest frontier model.

## Top picks

### Ollama + Open WebUI
Simplest way to download, run, and chat with local models on macOS, Linux, or Windows. Best for terminal-first users who want a web UI for non-technical teammates.

### llama.cpp
Best for squeezing performance out of consumer hardware and custom quantization. The standard for edge deployment and unusual hardware.

### Jan
Clean desktop app for local AI with model management and built-in conversations. Best for a polished local desktop experience.

### LM Studio
User-friendly model loader with good GPU offload and chat/completion modes. Best for users who want a GUI but still run everything locally.

### Aider + Ollama
Terminal-native coding agent that uses local models. Best for git-aware, private coding assistance.

## How to choose

| Situation | Best choice |
|-----------|-------------|
| Quick setup + web chat interface | Ollama + Open WebUI |
| Maximum control and edge deployment | llama.cpp |
| Polished desktop app | Jan |
| GUI model loader with GPU offload | LM Studio |
| Private coding assistant | Aider + Ollama |
| IDE-integrated local agent | Cline + Ollama |

## Recommended workflow

1. Pick your hardware target (GPU VRAM or Apple Silicon unified memory).
2. Choose a quantized model that fits: 7B Q4 for 8 GB, 13B Q4 for 16 GB, 32B Q4 for 24 GB.
3. Set up Ollama or llama.cpp with GPU offload enabled.
4. Test your real prompts against the local model; do not assume benchmark scores.
5. Wire an agent (Cline, Aider, OpenClaw) to the local endpoint.
6. Monitor latency and quality. Fallback to a cloud model for tasks the local model cannot handle.

## Common gotchas

- Quantization trades quality for speed. Test on your actual prompts, not just generic benchmarks.
- Local agents need enough VRAM or unified memory. Running out of memory causes silent CPU fallback.
- Keep model files and logs on encrypted storage if you handle sensitive data.
- Local models drift in capability less than cloud APIs, but still update them for security fixes.

## Getting started

1. [Run Ollama on Ubuntu with NVIDIA CUDA](/deployment-recipes/ollama-ubuntu-cuda).
2. [Deploy Open WebUI](/deployment-recipes/open-webui) for a chat interface.
3. [Use Cline with a local model](/deployment-recipes/cline-local) for IDE-integrated coding help.
4. See the [Self-Hosting](/self-hosting) section for hardware and OS guidance.
