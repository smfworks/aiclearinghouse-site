---
slug: cline-local
title: Use Cline with a Local Ollama Model
category: IDE Integration
tags:
  - cline
  - ollama
  - vscode
  - local-llm
  - byok
---

## What you'll get

Cline running inside VS Code, sending prompts to a local Ollama model instead of a cloud API. This setup keeps your code and prompts on your machine and removes per-token billing.

## Prerequisites

- VS Code installed
- Ollama running locally with at least one model pulled
- Cline extension installed from the VS Code marketplace

## Step 1: Pull a local model

```bash
ollama pull qwen3.5:9b
ollama pull qwen3-coder:32b
```

Verify:

```bash
ollama list
```

## Step 2: Install Cline

Open VS Code, go to Extensions, search "Cline", and install it. Cline appears as a new panel in the sidebar.

## Step 3: Switch Cline to Ollama

Open the Cline panel and click the model selector. Choose **Ollama** as the provider. Cline will list the models available at `http://localhost:11434`.

Select `qwen3.5:9b` or `qwen3-coder:32b`.

If the model list does not load:

1. Confirm Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```
2. Make sure Cline's Ollama host setting points to `http://localhost:11434`.

## Step 4: Verify the loop

Open any code file and ask Cline a small, safe task:

> "Add a JSDoc comment to the current function."

Cline should:

1. Read the file.
2. Propose an edit.
3. Show a diff.
4. Apply it when you approve.

Watch `nvidia-smi` or `ollama ps` to confirm the local model is loaded.

## Step 5: Pick the right model for each task

| Task | Suggested model |
|------|----------------|
| Quick chat / planning | `qwen3.5:9b` |
| Code generation | `qwen3-coder:32b` |
| Reasoning / debugging | `minimax-m3:cloud` or `gemma4:12b` |

Switch models inside Cline's provider dropdown. You do not need to restart VS Code.

## Step 6: Keep costs at zero

Because you are using Ollama, Cline's only cost is your local electricity and hardware. There is no API meter running. This makes it ideal for:

- Iterating on prompts
- Testing new models
- Sensitive code you do not want to send to a third party

## Trade-offs

- Local models are usually less capable than frontier cloud models. Complex multi-file refactors may need Claude or a larger cloud model.
- You manage model downloads, VRAM limits, and quantization yourself.
- Initial setup is slower than clicking "Use Claude."

## Next step

Combine this with the [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda) for GPU acceleration, or add [Aider](/agents/aider) for terminal-based git-aware edits on the same local model.
