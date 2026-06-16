---
slug: local-model-code-generation-benchmark
title: "Local Model Code Generation Benchmark"
excerpt: "Can local models keep up with cloud APIs on everyday coding tasks? We tested Qwen, Llama, and Mistral against Claude."
category: "Coding Benchmark"
tags:
  - local-models
  - coding
  - benchmark
  - cost
agents:
  - Qwen 3.5:9b via Ollama
  - Llama 3.1 8B via Ollama
  - Mistral Small via Ollama
  - Claude 3.5 Haiku via API
llm: "Various local + cloud"
winner: "Claude 3.5 Haiku via API"
date: "2026-06-16"
order: 3
last_verified: "2026-06-16"
results:
  - agent: Claude 3.5 Haiku via API
    score: 88
    time_minutes: 12
    tokens: 42000
    cost_usd: 0.35
    pass: true
    notes: "Best balance of speed, quality, and cost. Minor import fix needed."
  - agent: Qwen 3.5:9b via Ollama
    score: 79
    time_minutes: 18
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Surprisingly capable. Slower on complex reasoning but good on routine tasks."
  - agent: Llama 3.1 8B via Ollama
    score: 71
    time_minutes: 21
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Decent for simple functions. Struggled with multi-file context."
  - agent: Mistral Small via Ollama
    score: 64
    time_minutes: 24
    tokens: 0
    cost_usd: 0.00
    pass: false
    notes: "Fast generation but introduced subtle logic bugs in two of five tasks."
---

# Local Model Code Generation Benchmark

## The task

Five representative coding tasks, from a simple utility function to a small refactor with tests. Each model/agent ran the same prompt set.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Correctness | 35% | 35 |
| Test quality | 25% | 25 |
| Speed | 15% | 15 |
| Cost | 15% | 15 |
| Code clarity | 10% | 10 |

## Methodology

- Same prompts, no follow-ups.
- Local models ran on an RTX 4090 with Ollama.
- Cloud runs used the same agent framework with Claude 3.5 Haiku.
- We scored on first-pass correctness, not after repeated refinement.

## Key findings

- **Claude 3.5 Haiku** is still the practical winner for quality and speed, but local models are closing the gap for routine work.
- **Qwen 3.5:9b** is the best local option we tested for general coding. It is good enough that many teams can default to it for private tasks.
- **Llama 3.1 8B** handles simple functions well but loses coherence across multiple files.
- **Mistral Small** is fast but less reliable. Best for drafts and exploration.

## Honest caveats

- Hardware matters. A slower GPU changes the time scores significantly.
- We tested coding only. Reasoning, writing, and multi-modal tasks may rank differently.
- Local model quality is improving quickly; this benchmark will age.

## Cost note

Cloud cost per task was small but real. Local cost is hardware amortization plus electricity. For high-volume work, local wins. For sporadic work, cloud is simpler.
