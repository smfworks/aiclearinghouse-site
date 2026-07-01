---
slug: local-llm-reasoning-benchmark
title: "Local LLM Reasoning Benchmark"
excerpt: "Compares open-weight local models on reasoning, math, and code tasks to find the best on-premise balance of capability and cost."
category: "Coding Benchmark"
tags:
  - local-models
  - reasoning
  - coding
  - benchmark
agents:
  - Qwen3.6-27B
  - Llama 4 Maverick
  - Gemma 4 QAT 32B
  - DeepSeek-V4
llm: "Local open-weight models"
winner: "Qwen3.6-27B"
date: "2026-07-01"
order: 18
last_verified: "2026-07-01"
results:
  - agent: Qwen3.6-27B
    score: 76
    time_minutes: 45
    tokens: null
    cost_usd: 0.15
    pass: true
    notes: "Best balance of reasoning and coding among tested local models; runs well on 24GB VRAM."
  - agent: DeepSeek-V4
    score: 73
    time_minutes: 52
    tokens: null
    cost_usd: 0.18
    pass: true
    notes: "Strong math and long-context reasoning; slightly slower inference."
  - agent: Llama 4 Maverick
    score: 71
    time_minutes: 48
    tokens: null
    cost_usd: 0.14
    pass: true
    notes: "Good general reasoning; coding trailed Qwen and DeepSeek by a few points."
  - agent: Gemma 4 QAT 32B
    score: 67
    time_minutes: 38
    tokens: null
    cost_usd: 0.10
    pass: false
    notes: "Efficient and fast; strongest on smaller reasoning tasks, weaker on long-context code."
---

# Local LLM Reasoning Benchmark

## The task

We tested four open-weight local models on a mixed reasoning and coding benchmark:

- 20 math word problems of varying difficulty.
- 20 short Python coding tasks.
- 5 long-context synthesis tasks over ~50K tokens.
- 10 logic puzzles requiring multi-step reasoning.

Models ran locally via Ollama and vLLM on identical NVIDIA hardware.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Math correctness | 25% | 25 |
| Coding correctness | 25% | 25 |
| Long-context accuracy | 25% | 25 |
| Logic puzzles | 15% | 15 |
| Inference cost efficiency | 10% | 10 |

## Methodology

- Identical prompts and test set for every model.
- Quantized to 4-bit where applicable; Gemma 4 QAT used native quantization.
- Cost estimated from local electricity and hardware depreciation.
- Each task was run once; no cherry-picking.

## Key findings

- **Qwen3.6-27B** led on the combined benchmark, especially on coding and long-context tasks.
- **DeepSeek-V4** was close behind with stronger math performance.
- **Llama 4 Maverick** was competitive on general reasoning but slightly behind on code.
- **Gemma 4 QAT 32B** was the most efficient; best for teams with limited VRAM.

## Honest caveats

- Benchmarks do not capture every real-world task.
- Quantization affects performance; full-precision results may differ.
- Hardware choices favor NVIDIA; AMD or Intel runs may reorder results.

## When to choose which

- **Qwen3.6-27B:** best default for local coding and reasoning agents.
- **DeepSeek-V4:** math-heavy or long-context reasoning workloads.
- **Llama 4 Maverick:** general-purpose local agent with a broad ecosystem.
- **Gemma 4 QAT 32B:** efficiency-first deployments on modest hardware.
