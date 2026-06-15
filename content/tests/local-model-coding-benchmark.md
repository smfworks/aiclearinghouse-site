---
slug: local-model-coding-benchmark
title: "Local Model Coding Benchmark"
excerpt: "Compared quantized local models running through Ollama on real coding tasks: refactoring, bug fixing, and test generation."
category: "Coding Benchmark"
tags:
  - local-models
  - ollama
  - quantization
  - coding
  - benchmark
agents:
  - qwen3.5:9b
  - qwen2.5-coder:14b
  - llama3.2:3b
  - deepseek-r1:14b
llm: "Local (Ollama)"
winner: "qwen2.5-coder:14b"
date: "2026-06-14"
order: 5
last_verified: "2026-06-15"
results:
  - agent: qwen2.5-coder:14b
    score: 87
    time_minutes: 6
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Best balance of correctness and speed. Refactors were clean and tests mostly ran."
  - agent: deepseek-r1:14b
    score: 81
    time_minutes: 9
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Strong reasoning but verbose. Great for debugging, slower for routine edits."
  - agent: qwen3.5:9b
    score: 74
    time_minutes: 4
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Fast and good enough for simple changes. Struggled with multi-file reasoning."
  - agent: llama3.2:3b
    score: 52
    time_minutes: 3
    tokens: 0
    cost_usd: 0.00
    pass: false
    notes: "Very fast but produced incorrect refactors and hallucinated APIs."
---

# Local Model Coding Benchmark

## The task

We tested four local models available through Ollama on three coding tasks using the Continue extension in VS Code:

1. **Refactor:** Extract a duplicated validation block into a shared utility function.
2. **Bug fix:** Find and fix an off-by-one error in a pagination helper.
3. **Test generation:** Write unit tests for a small authentication helper.

All models ran Q4 quantization on the same NVIDIA RTX 4090 (24 GB VRAM).

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Correctness of output | 40% | 40 |
| Code quality | 20% | 20 |
| Time to first useful response | 15% | 15 |
| Scope control (doesn't change unrelated files) | 15% | 15 |
| Cost efficiency | 10% | 10 |

## Methodology

- Same codebase checked out for every run.
- Same prompts, no follow-up unless the model asked a clarifying question.
- Models were evaluated on a 0–100 scale by a human reviewer blind to which model produced which output.
- Local inference means no token cost, but electricity and hardware amortization are real.

## Key findings

- **qwen2.5-coder:14b** is the sweet spot for consumer hardware. Fast enough, correct enough, and good at following instructions.
- **deepseek-r1:14b** is excellent for reasoning-heavy tasks but over-explains and is slower. Use it for debugging, not boilerplate.
- **qwen3.5:9b** is the best default for quick edits, autocomplete, and simple refactors on modest GPUs.
- **llama3.2:3b** is too small for serious coding work. Fast, but you will spend more time correcting it than it saves.

## Honest caveats

- 14B models require a strong GPU. On 8 GB VRAM you will need smaller quantizations or cloud GPUs.
- Coding performance is task-dependent. These rankings could shift for a different codebase or language.
- We did not fine-tune prompts per model. A model-specific prompt might close some gaps.

## When to choose which

- **qwen2.5-coder:14b**: default local coding model if you have 16 GB+ VRAM.
- **deepseek-r1:14b**: hard bugs where chain-of-thought reasoning helps.
- **qwen3.5:9b**: fast everyday edits, chat, and planning.
- **llama3.2:3b**: tab completion or classification where latency is everything.
