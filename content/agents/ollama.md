---
slug: ollama
title: Ollama
excerpt: Local-first LLM runtime — single-binary server, model registry, and OpenAI-compatible API.
category: Open Source
tags:
  - runtime
  - local-llm
  - inference-server
  - open-source
website: https://ollama.com
repository: https://github.com/ollama/ollama
categories:
  - Runtime
  - Local LLM
  - Inference Server
  - Open Source
pricing: Open Source
runtime: Local
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
  - API
  - macOS
  - Linux
  - Windows
features:
  - Single-binary local model server
  - OpenAI-compatible /v1 API
  - Modelfile-based packaging and quantization
  - Built-in model registry (ollama.com/library)
  - GGUF backend with MLX, CUDA, ROCm, Vulkan, and CPU fallbacks
  - Prompt caching (decoupled from context shift in v0.30.x)
  - Recurrent model support (RWKV, Mamba) as of v0.30.8
  - Hermes Desktop companion launcher (`ollama launch hermes-desktop`)
releaseYear: 2023
company: Ollama
last_verified: 2026-06-19
install_command: "curl -fsSL https://ollama.com/install.sh | sh"
lar_test_id: ollama_version_check_v1
---

Ollama is a local-first LLM runtime. It packages quantized GGUF models
behind a single binary, exposes an OpenAI-compatible HTTP API on
`http://127.0.0.1:11434`, and ships a curated registry at
`ollama.com/library`. It is the runtime layer that most local coding
agents (Hermes Agent, Aider, Cline) and the OpenClaw gateway default to.

As of June 2026, Ollama is on the 0.30.x line (0.30.6 verified on this
host, 0.30.8 latest at time of writing). The v0.30 release added prompt
caching decoupled from context shifts (better KV reuse), MLX snapshot
stability for Apple Silicon, and recurrent-model support for non-transformer
architectures. `ollama launch hermes-desktop` is a packaged launcher for
the Hermes Agent companion UI.