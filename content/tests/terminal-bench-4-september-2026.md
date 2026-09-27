---
slug: terminal-bench-4-september-2026
title: "Terminal-Bench 4.0: September 2026 Coding Agent Leaderboard"
excerpt: "66 frontier-difficulty terminal tasks across 7 domains, 5 trials per task with an 8-hour timeout. GPT-6 Astra + Codex leads at 58.2%; GLM-5.3 is the top open-weight at 41.8%."
category: "Agent Benchmark"
tags:
  - benchmark
  - coding-agents
  - terminal
  - agentic
  - swe
agents:
  - Codex (OpenAI)
  - Claude Code (Anthropic)
  - Grok Build (xAI)
llm: "Multiple — GPT-6 Astra, Claude Fable 5.1, Claude Opus 5, GLM-5.3, Grok 4.7, GPT-5.6 Sol"
winner: "Codex + GPT-6 Astra (max)"
date: "2026-09-23"
order: 99
last_verified: "2026-09-27"
results:
  - agent: Codex (OpenAI)
    score: 58
    time_minutes: 0
    tokens: 1500000000
    cost_usd: 3300
    pass: true
    notes: "GPT-6 Astra (max reasoning). 58.2% resolution rate. 1.5B tokens, $3.3k eval cost. Top of the leaderboard."
  - agent: Claude Code (Anthropic)
    score: 58
    time_minutes: 0
    tokens: 2700000000
    cost_usd: 6200
    pass: true
    notes: "Fable 5.1 (max reasoning). 57.9% resolution rate. 2.7B tokens, $6.2k eval cost. Neck-and-neck on accuracy but nearly 2× the cost."
  - agent: Codex (OpenAI)
    score: 58
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "GPT-6 Astra (xhigh reasoning). 57.88% resolution rate."
  - agent: Claude Code (Anthropic)
    score: 55
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "Fable 5.1 (high reasoning). 54.5% resolution rate."
  - agent: Claude Code (Anthropic)
    score: 52
    time_minutes: 0
    tokens: 6500000000
    cost_usd: 6000
    pass: true
    notes: "Opus 5 (max reasoning). 51.8% resolution rate. 6.5B tokens — highest token count in the top tier."
  - agent: Claude Code (Anthropic)
    score: 42
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "GLM-5.3 (max reasoning). 41.8% resolution rate. Top open-weight model on the benchmark — surpasses GPT-5.6 Sol (37.3%) and Opus 4.8 (23.6%)."
  - agent: Grok Build (xAI)
    score: 38
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "Grok 4.7 (xhigh reasoning). 37.6% resolution rate."
  - agent: Codex (OpenAI)
    score: 37
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "GPT-5.6 Sol (max reasoning). 37.3% resolution rate."
---

# Terminal-Bench 4.0: September 2026 Coding Agent Leaderboard

## What it measures

Terminal-Bench 4.0 is an open-source benchmark that measures how well an agent can complete long, realistic pieces of work in a sandboxed terminal. Version 4.0 is a fresh set of 66 community-contributed, maintainer-reviewed tasks — none of which appear in Terminal-Bench 2.1. Tasks span software engineering, machine learning, science, operations, security, hardware, and media.

Each task is built around a real deliverable — a working service, a proof, a CAD model, a trained kernel, a forensic report. The median task is estimated at 4 hours of expert work. Each model is run through the full benchmark 3 times (avg@3), each run scored as pass@1, and the displayed score is the mean with error bars showing standard error.

Version 4.0 removed 8 tasks that became saturated, refusal-prone, or leaked public solutions. 20 tasks received revised environments and tighter validation verifiers to avoid false-positive passes. An 8-hour agent timeout applies per task.

## September 23, 2026 snapshot — top results

| Rank | Agent | Model | Effort | Resolution Rate | Tokens | Eval Cost |
|------|-------|-------|--------|-----------------|--------|-----------|
| 1 | Codex | GPT-6 Astra | max | 58.2% | 1.5B | $3.3k |
| 2 | Claude Code | Fable 5.1 | max | 57.9% | 2.7B | $6.2k |
| 3 | Codex | GPT-6 Astra | xhigh | 57.9% | — | — |
| 4 | Claude Code | Fable 5.1 | high | 54.5% | — | — |
| 5 | Claude Code | Opus 5 | xhigh | 53.9% | — | — |
| 6 | Claude Code | Opus 5 | max | 51.8% | 6.5B | $6.0k |
| 7 | Claude Code | GLM-5.3 | max | 41.8% | — | — |
| 8 | Grok Build | Grok 4.7 | xhigh | 37.6% | — | — |
| 9 | Codex | GPT-5.6 Sol | max | 37.3% | — | — |

> 27 models evaluated in the September 23, 2026 snapshot. Full leaderboard at benchlm.ai/benchmarks/terminal-bench-4 and tbench.ai.

## Key takeaways

### 1. The efficiency divide is the story

GPT-6 Astra and Claude Fable 5.1 are neck-and-neck at 58.2% vs 57.9%, but Astra needed only 1.5B tokens ($3.3k) compared to 2.7B tokens ($6.2k) for Fable 5.1. On a cost-per-solved-task basis, Astra is nearly 2× more efficient. Opus 5 consumed 6.5B tokens ($6.0k) to reach 51.8% — the most token-hungry model in the top tier.

### 2. GLM-5.3 is the open-weight breakthrough

Z.ai's GLM-5.3 achieved 41.8% inside the Claude Code harness — surpassing GPT-5.6 Sol (37.3%) and Opus 4.8 (23.6%) while running at accessible pricing. This is the strongest open-weight showing on a frontier-difficulty agent benchmark, and it signals that the gap between open and closed models on agentic tasks is narrowing.

### 3. Grok 4.7 underperforms expectations

Grok 4.7 (xHigh) managed only 37.6% via Grok Build — behind GPT-5.6 Sol and well behind the frontier tier. This is consistent with independent testing showing high token consumption and modest Intelligence Index gains over Grok 4.6.

### 4. Lowest run cost vs highest capability

The lowest per-run cost was GPT-5.6 Luna at ~$0.3k (using $6/1M API pricing), but it scores far below the frontier. The cheapest frontier-tier model is GPT-6 Astra at $3.3k for the full benchmark — a data point worth noting for teams evaluating agent economics at scale.

## Methodology notes

- Each score is avg@3: 3 full benchmark runs, pass@1 per task, mean displayed
- Each task graded by its own verifier — inspects final environment state or produced artifact
- A model must pass the verifier's full test suite to score — partial credit is not given
- 8-hour timeout per task; tasks requiring more time score zero
- Results reflect specific agent+model+configuration variants, not generic product names
- Model choice, settings, and execution configuration materially change outcomes

## Sources

- BenchLM Terminal-Bench 4.0 leaderboard (benchlm.ai/benchmarks/terminal-bench-4, September 23, 2026 snapshot)
- tbench.ai official results
- Vals.ai Terminal-Bench 4.0 page (updated September 16, 2026)
- Morph LLM coding agent leaderboard (updated September 22, 2026)