---
slug: terminal-bench-2-1-september-2026
title: "Terminal-Bench v2.1: Claude Fable 5.1 Leads at 91.4%"
excerpt: "The verified refresh of Terminal-Bench fixes 28 of 89 tasks and introduces continuous validation. Claude Fable 5.1 takes the top spot at 91.4%, with GPT-5.6 Sol and Claude Opus 5 close behind."
category: "Coding Benchmark"
tags:
  - coding
  - benchmarks
  - agents
  - terminal
  - terminal-bench
agents:
  - Claude Fable 5.1
  - GPT-5.6 Sol
  - Claude Opus 5
  - Grok 4.6
  - Qwen3.8-Flash-Next
  - Gemini 3.7 Flash
  - Kimi K3
  - GLM-5.3
llm: "Multiple"
winner: "Claude Fable 5.1"
date: "2026-09-02"
order: 99
last_verified: "2026-09-02"
results:
  - agent: Claude Fable 5.1 (Adaptive Reasoning, Max Effort)
    score: 91
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Top score on Terminal-Bench v2.1. $10/$50 pricing. 1M context. Released Sep 1, 2026."
  - agent: GPT-5.6 Sol (xhigh)
    score: 89
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Close second. $8/MTok blended. OpenAI's strongest coding agent."
  - agent: Claude Opus 5 (Adaptive Reasoning, Max Effort)
    score: 89
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Half the price of Fable 5.1 at $5/$25. Near-frontier coding performance."
  - agent: Grok 4.6 (high)
    score: 88
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Strong showing at $3/MTok. xAI's best coding result."
  - agent: Qwen3.8-Flash-Next
    score: 86
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Exceptional value at $0.23/MTok. Top open-weight coding model on this benchmark."
  - agent: Gemini 3.7 Flash (high)
    score: 85
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Google's Flash workhorse at $1.50/MTok. Strong agentic terminal performance."
  - agent: Kimi K3 (max)
    score: 85
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Kimi's flagship at $6/MTok. Competitive with frontier models."
  - agent: GLM-5.3 (max)
    score: 83
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Open-weight from Z.ai at $2.15/MTok. Provider-run snapshot scores 88.2% per BenchLM."
---

# Terminal-Bench v2.1: Claude Fable 5.1 Leads at 91.4%

## What changed

Terminal-Bench v2.1 is a verified refresh of Terminal-Bench v2.0, developed by the Laude Institute, Stanford University researchers, and the open-source Terminal-Bench community. The benchmark keeps the same 89 curated tasks across software engineering, system administration, data processing, model training, and security — but fixes 28 of the 89 tasks and introduces continuous validation for agentic benchmarks.

The 28 fixed tasks fell into three categories:

- **External dependency drift (9 tasks):** Docker images pinned for reproducibility had external dependencies that changed over time. Fixed by pinning or removing internet access where it was not essential.
- **Insufficient resource budgets (8 tasks):** CPU, memory, or time budgets were too tight for valid solutions — including oracle solutions — to finish consistently. Budgets expanded to accommodate correct approaches.
- **Instruction-test mismatches (11 tasks):** Instructions asked for one thing but tests expected another (e.g., instructions said PostgreSQL but tests expected Spark SQL). Rewritten for consistency.

After these fixes, no task is unsolved in Terminal-Bench v2.1.

## Top results (Artificial Analysis, September 2, 2026)

The independently scored leaderboard by Artificial Analysis runs Terminal-Bench v2.1 with the Terminus 2 agent harness in an e2b sandbox, reporting pass@1 averaged over 3 repeats per task.

| Rank | Model | Score | Price/1M |
|------|-------|-------|----------|
| 1 | Claude Fable 5.1 (Max Effort) | 91.4% | $20 |
| 2 | GPT-5.6 Sol (xhigh) | 89.5% | $8.00 |
| 3 | Claude Opus 5 (Max Effort) | 89.1% | $10 |
| 4 | Grok 4.6 (high) | 88.4% | $3.00 |
| 5 | Qwen3.8-Flash-Next | 86.1% | $0.23 |
| 6 | Gemini 3.7 Flash (high) | 85.8% | $1.50 |
| 7 | Kimi K3 (max) | 85.0% | $6.00 |
| 8 | GLM-5.3 (max) | 83.9% | $2.15 |

## Provider-run snapshot (BenchLM, September 1, 2026)

A separate provider-run snapshot published on BenchLM shows GLM-5.3 leading at 88.2%, followed by DeepSeek V4 Pro 0813 at 87.9% and Qwen3.8 Max at 86.6%. These results use different agent harnesses and effort settings and are displayed separately from the Artificial Analysis independent run.

## What this means

- **Claude Fable 5.1 is the new coding agent frontier.** Released September 1, 2026, it immediately took the top spot on the most rigorous agentic coding benchmark. The 75% cache-read price cut makes long coding sessions economically viable.
- **The open-weight gap is narrowing.** Qwen3.8-Flash-Next at 86.1% for $0.23/MTok is within 5 points of the closed-weight leader at 1/87th the price. GLM-5.3 at 83.9% (or 88.2% in the provider run) is also within striking distance.
- **Continuous validation is now a requirement.** The 28 task fixes in v2.1 show that benchmarks without continuous validation produce misleading results. Any team running agent evaluations should adopt the same pattern.