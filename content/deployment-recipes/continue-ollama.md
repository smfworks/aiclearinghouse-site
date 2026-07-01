---
slug: continue-ollama
title: "VS Code + Continue with Local Ollama Models"
excerpt: "Set up the Continue extension in VS Code to autocomplete, chat, and edit with local Ollama models so your code never leaves your machine."
category: "IDE Integration"
tags:
  - vscode
  - continue
  - ollama
  - local-llm
  - coding
order: 14
last_verified: "2026-07-01"
difficulty: Beginner
estimated_time: 15 min
---

# VS Code + Continue with Local Ollama Models

## The promise

Continue is an open-source AI code assistant for VS Code. When paired with a local Ollama model, you get autocomplete, chat, and inline edits without sending code to a cloud API. This recipe installs and configures Continue to talk to Ollama.

## Prerequisites

- VS Code installed.
- Ollama installed and running locally (see [Run Ollama on macOS with Apple Silicon](/deployment-recipes/macos-ollama-silicon/) or [Run Ollama on Ubuntu 24.04 with NVIDIA CUDA](/deployment-recipes/ollama-ubuntu-cuda/)).
- A local model pulled, such as `qwen3.5:9b` or `qwen2.5-coder:14b`.

## Step 1: Install Continue

Open VS Code, go to Extensions, and search for **Continue**. Install the official Continue extension.

## Step 2: Configure Ollama as the provider

Open Continue's settings and add an Ollama config:

```json
{
  "models": [
    {
      "title": "Ollama Qwen 9B",
      "provider": "ollama",
      "model": "qwen3.5:9b",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

## Step 3: Set autocomplete

In Continue settings, enable autocomplete and point it at a fast local model:

```json
{
  "tabAutocompleteModel": {
    "title": "Ollama Fast Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:1.5b",
    "apiBase": "http://localhost:11434"
  }
}
```

## Step 4: Test

Open a file in VS Code. Use the Continue chat panel to ask a question about your code. Try tab completion. Both should use the local model.

## Troubleshooting

- **Continue cannot connect:** Verify Ollama is running: `curl http://localhost:11434`.
- **Autocomplete is slow:** Use a smaller model or reduce the context window.
- **Model quality is low:** Try a larger coder model or quantize to fit your hardware.

## Best fit

Developers who want IDE-native AI assistance with full privacy and no API costs.
