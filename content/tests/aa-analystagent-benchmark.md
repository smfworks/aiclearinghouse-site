---
slug: aa-analystagent-benchmark
title: "AA-AnalystAgent: Quantitative Analysis on Real Spreadsheets"
excerpt: "Artificial Analysis's agentic benchmark testing models on 80 private quantitative analysis questions across 14 business and science domains — scored with pass^5 reliability."
category: "Agentic Benchmark"
tags:
  - benchmark
  - agents
  - quantitative-analysis
  - reliability
  - artificial-analysis
agents:
  - Claude Opus 5
  - GPT-5.5
  - Claude Fable 5
  - Muse Spark 1.2
llm: "Multiple (cross-model)"
winner: "Claude Opus 5"
date: "2026-08-10"
order: 99
last_verified: "2026-08-12"
results:
  - agent: Claude Opus 5
    score: 54
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "54% pass^5 — best overall. Solved 43 of 80 tasks on all five attempts."
  - agent: GPT-5.5
    score: 50
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "50% pass^5. Strong on finance domain, weaker on scientific data."
  - agent: Claude Fable 5
    score: 49
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "49% pass^5. Close to GPT-5.5 but higher variance across domains."
  - agent: Muse Spark 1.2
    score: 0
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Not yet evaluated on AA-AnalystAgent at time of publication. GDPval-AA v2 score improved 260 Elo over 1.1."
---

# AA-AnalystAgent: Quantitative Analysis on Real Spreadsheets

## Overview

AA-AnalystAgent is an agentic benchmark developed by Artificial Analysis, announced on August 10, 2026. It tests AI agents on 80 private quantitative analysis questions across 14 business and scientific domains. Each question is answered from a folder of real source spreadsheets and documents — the agent must read, parse, and reason over actual data files, not synthetic inputs.

The benchmark's defining feature is its scoring methodology: every question is run **five times** and the headline metric is **pass^5** — solved on all five attempts. This makes it one of the few public benchmarks that measures agent reliability, not just capability.

## Methodology

- **80 tasks** across 14 domains (finance, operations, science, business analysis)
- **Real source data**: Each task includes a folder of actual spreadsheets and documents the agent must process
- **Pass^5 scoring**: A task counts as solved only if the agent gets it right on all five independent attempts
- **No shared state**: Each run is independent — no warm-up, no cross-run memory

## Why pass^5 matters

An agent that solves a task 60% of the time will eventually get it right if you run it enough. Pass@1 captures that lucky run. Pass^5 captures whether you can trust the agent without checking every output.

The results show that even the best frontier models are unreliable on quantitative analysis:

- **Claude Opus 5**: 54% pass^5 — fails 46% of the time on all attempts
- **GPT-5.5**: 50% pass^5
- **Claude Fable 5**: 49% pass^5

No model exceeds 54% pass^5. This means every model in the top tier still requires human review for nearly half of all quantitative analysis tasks.

## Key findings

1. **No model is reliable enough for unsupervised quantitative analysis**. The best model fails on all five attempts 46% of the time.
2. **The gap between pass@1 and pass^5 is large**. Models that look strong on single-run benchmarks show significant reliability drops under pass^5 scoring.
3. **Domain matters**. Models perform differently across the 14 domains — finance tasks see different success rates than scientific data analysis.
4. **Variance is a signal**. Beyond the pass^5 rate, the variance across attempts indicates whether a model is consistently good or inconsistently lucky.

## Implications for agent builders

- **Budget for human review**: No current model can be trusted to produce quantitative analysis without verification. Plan your pipeline with a human-in-the-loop checkpoint.
- **Use pass-k in your own evals**: If your internal benchmarks use pass@1, you are overestimating your agent's reliability. Run tasks 5x and score pass^5.
- **Model selection is domain-specific**: Don't pick a model based on overall score alone. Check domain breakdowns for your use case.
- **Reliability is the frontier**: The next jump in agent value will come from reliability, not raw capability. A model that scores 45% pass^5 but is consistent is more useful than one that scores 60% pass@1 but is erratic.

## Source

Artificial Analysis, "Announcing AA-AnalystAgent: an agentic benchmark for quantitative analysis on real-world spreadsheets and documents," August 10, 2026.