---
slug: pick-a-local-model
title: How to Pick a Local Model for Coding
category: Tip
excerpt: Choose the right quantized model for your hardware, task, and quality bar.
tags:
  - local models
  - Ollama
  - quantization
  - hardware
  - coding
order: 9
last_verified: 2026-06-15
---

# How to Pick a Local Model for Coding

## The principle

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
| Quick chat / planning | `qwen3.5:9b`, `llama3.2:3b` |
| Code generation / refactoring | `qwen2.5-coder:14b`, `codellama:13b` |
| Reasoning / debugging | `qwq:32b`, `deepseek-r1:14b` |
| Tab completion | `qwen2.5-coder:1.5b`, `starcoder2:3b` |

## Why quantization matters

Quantization reduces model size by lowering numerical precision. Q4 is the sweet spot: small enough to fit on consumer GPUs, capable enough for coding. Lower than Q4 (Q3, Q2) saves memory but degrades quality noticeably. Unquantized is best if you have the VRAM.

## How to apply it

1. **Benchmark on your hardware.** Latency matters as much as benchmark scores.
2. **Start with a 9B model.** It runs on almost anything and gives you a baseline.
3. **Upgrade for hard tasks.** Switch to 14B or 32B only when the smaller model fails.
4. **Match model family to task.** Coder models for code, reasoning models for debugging, small models for speed.

## Red flags

- You are running a 70B model on a laptop and wondering why it is slow.
- You picked a model because it topped a leaderboard, not because it fits your task.
- Every task uses the same model regardless of complexity.

## Quick win

Pull `qwen3.5:9b` and `qwen2.5-coder:14b` in Ollama. Try the same coding prompt with both. Pick the one that gives you acceptable output at acceptable speed.
