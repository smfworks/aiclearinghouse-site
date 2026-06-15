---
slug: pick-a-local-model
title: How to Pick a Local Model for Coding
excerpt: Choose the right quantized model for your hardware, task, and quality bar.
category: Tip
tags:
  - local models
  - Ollama
  - quantization
  - hardware
  - coding
last_verified: 2026-06-14
---

# How to Pick a Local Model for Coding

Local models trade capability for control. The right choice depends on your hardware and the task, not just the leaderboard.

## Match model size to memory

| VRAM / unified memory | Suggested size | Notes |
|-----------------------|----------------|-------|
| 8 GB | 7B–9B Q4 | Fast, limited reasoning |
| 16 GB | 13B–14B Q4 | Good balance for coding |
| 24 GB | 32B Q4 | Strong coding assistant |
| 48 GB+ | 70B Q4 or unquantized | Near-frontier quality locally |

## Match model to task

| Task | Suggested models |
|------|------------------|
| Autocomplete / small edits | Qwen3.5:9b, Qwen2.5-Coder:7b |
| Code generation / refactoring | Qwen3-Coder:32b, DeepSeek-V4 Pro |
| Reasoning / debugging | Minimax-M3, Gemma 4 12B/27B |
| General chat / planning | Qwen3.5:9b, Llama 4 8B |

## Test before you trust

Benchmark scores are misleading. Run your real prompts through the model:

1. Pick 5 representative tasks from your codebase.
2. Run each one with the same prompt across 2–3 models.
3. Grade output for correctness, style, and safety.
4. Measure latency and token cost if using an API gateway.

## Quantization trade-offs

- **Q4_K_M**: good balance of quality and size. Start here.
- **Q5_K_M**: slightly better quality, larger files.
- **Q8_0**: near-unquantized quality, needs more VRAM.
- **FP16**: best quality, requires the most memory.

Start with Q4 and only move up if you see quality loss on your specific tasks.

## Common mistakes

- Downloading a 70B model on 16 GB VRAM. It will run on CPU and be unusably slow.
- Trusting one benchmark. MMLU does not measure your codebase.
- Ignoring context window. Some models drop long files silently.

## Related

- [Run Ollama on Ubuntu with NVIDIA CUDA](/deployment-recipes/ollama-ubuntu-cuda)
- [Use Cline with a Local Model](/deployment-recipes/cline-local)
- [Local Model Agents](/use-cases/local-models)
