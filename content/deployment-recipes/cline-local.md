---
slug: cline-local
title: Use Cline with a Local Ollama Model
excerpt: Run the Cline coding agent inside VS Code, sending every prompt to a local model so your code never leaves your machine.
category: IDE Integration
tags:
  - cline
  - ollama
  - vscode
  - local-llm
  - byok
  - coding-agent
order: 3
last_verified: 2026-06-15
difficulty: Beginner
estimated_time: 20 min
---

# Use Cline with a Local Ollama Model

## The promise

Cline is the most popular open-source coding agent for VS Code. It can read files, propose edits, run terminal commands, and manage whole tasks from a chat panel. By default it sends your code and prompts to cloud providers like Claude or GPT-4. That is fast and capable — but it is also expensive, and it sends your intellectual property off-device.

This recipe wires Cline to a local Ollama model. The result: a coding agent inside your IDE that costs nothing per token, works offline, and keeps every line of code on your machine.

## What you'll get

- Cline installed in VS Code
- Ollama running locally with at least one coding-capable model
- Cline configured to use Ollama as its provider
- A verified edit loop on a real file

## Prerequisites

- VS Code installed
- Ollama running locally with at least one model pulled
- Cline extension installed from the VS Code marketplace
- Basic comfort with diffs and terminal output

## Step 1: Pull a local coding model

Two models cover most local coding work:

```bash
ollama pull qwen3.5:9b
ollama pull qwen2.5-coder:14b
```

Verify they are available:

```bash
ollama list
```

If you are short on VRAM, `qwen3.5:9b` is the safer starter. If you have 16 GB+ VRAM, `qwen2.5-coder:14b` gives noticeably better code reasoning.

## Step 2: Install Cline in VS Code

1. Open VS Code.
2. Go to **Extensions** (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search **"Cline"**.
4. Click **Install** on the extension by Cline (formerly Cline Bot).

Cline appears as a new panel in the sidebar, usually on the left.

## Step 3: Switch Cline to Ollama

1. Open the Cline panel.
2. Click the model selector at the top.
3. Choose **Ollama** as the provider.
4. Select one of the models you pulled, such as `qwen3.5:9b`.

If the model list does not load:

1. Confirm Ollama is running:

   ```bash
   curl http://localhost:11434/api/tags
   ```

2. Make sure Cline's Ollama host setting is `http://localhost:11434`.
3. Restart the Cline panel if needed.

## Step 4: Verify the edit loop

Open any code file and ask Cline a small, safe task:

> "Add a JSDoc comment to the current function."

Cline should:

1. Read the active file.
2. Propose an edit.
3. Show a diff in the chat.
4. Wait for your approval.
5. Apply the change when you confirm.

Watch `nvidia-smi` or `ollama ps` to confirm the local model is loaded into GPU memory.

## Step 5: Pick the right model for the job

| Task | Suggested model |
|------|----------------|
| Quick chat / planning | `qwen3.5:9b` |
| Code generation / refactoring | `qwen2.5-coder:14b` |
| Reasoning / debugging | `qwq:32b` or `minimax-m3:cloud` |
| High-speed classification | `qwen3.5:9b` or `llama3.2:3b` |

Switch models inside Cline's provider dropdown. You do not need to restart VS Code.

## Step 6: Set expectations for local models

Local models are cheaper and more private, but they are not frontier models. Adjust how you use them:

- **Break large tasks into small, explicit prompts.** "Refactor this function" works better than "fix the whole codebase."
- **Use Cline's diff view carefully.** Local models can produce slightly malformed edits. Always review before applying.
- **Watch VRAM usage.** Running a 14B model with a large context window can exhaust GPU memory. Use `ollama ps` to monitor.
- **Combine with cloud for hard problems.** Keep Cline on Ollama for routine work, then switch to Claude or GPT-4 for the one task that needs maximum reasoning.

## Sanity checks

| Check | Command / Action |
|-------|------------------|
| Ollama running | `curl http://localhost:11434/api/tags` |
| Model pulled | `ollama list` |
| Cline installed | Look for the Cline icon in the VS Code sidebar |
| Model selected | Open Cline panel, check provider dropdown |
| GPU active | `nvidia-smi` or `ollama ps` |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Model list empty in Cline | Confirm Ollama is on `http://localhost:11434` and at least one model is pulled. |
| Cline says "provider error" | Check that the model name matches exactly, including the tag (`qwen3.5:9b`, not `qwen3.5`). |
| Slow generation | Use a smaller model, enable GPU offload, or reduce Cline's max context. |
| Bad diffs | Ask Cline to show the proposed change before applying. Local models are more error-prone on multi-file edits. |
| Out of memory | Stop other Ollama models (`ollama stop <model>`) or pull a smaller quantized model. |

## Next step

Combine this recipe with the [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda) for GPU acceleration. Then add [Aider](/agents/aider) for terminal-based, git-aware edits on the same local model.
