---
slug: startupbench-august-2026
title: "StartupBench: Market-Validated Agent Workflows"
excerpt: "A 97-task benchmark grounded in real AI startup products — not researcher-selected tasks. Even the strongest model completes only 30% under strict acceptance. Specialized agents beat general-purpose ones by 11+ points."
category: "End-to-End Benchmark"
tags:
  - benchmark
  - agents
  - e2e
  - market-validated
  - rubrics
agents:
  - Kimi-K3
  - GPT-5.6-sol
  - Claude-Opus-4.7
  - GLM-5.1
  - Qwen-3.6-Max
  - DeepSeek-V4-Pro
llm: "Multiple (7 frontier models)"
winner: "Kimi-K3 (highest avg score); GPT-5.6-sol (highest completion rate)"
date: "2026-08-24"
order: 99
last_verified: "2026-08-26"
results:
  - agent: Kimi-K3
    score: 73
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Highest average score (73.67%) but lower completion rate than GPT-5.6-sol. Satisfies many criteria but falls short of full delivery."
  - agent: GPT-5.6-sol
    score: 73
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Average score 73.61%, highest completion rate among general-purpose models. Still completes only ~30% of tasks under strict acceptance (score >= 90)."
  - agent: Claude-Opus-4.7
    score: 0
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Evaluated as one of 7 frontier models. Specific scores not individually reported in paper summary."
  - agent: GLM-5.1
    score: 0
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Notably robust to rubric weighting changes — only 0.61 point swing vs 1.79 average."
  - agent: Specialized agents (oracle)
    score: 83
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: false
    notes: "Domain-specialized agents average 83.50 score, 39.18% completion — substantially ahead of general-purpose models."
---

# StartupBench: Market-Validated Agent Workflows

## What it is

StartupBench is an end-to-end agent benchmark published August 24, 2026, that evaluates models on tasks derived from market-validated AI startup products. Unlike most benchmarks that use researcher-selected tasks, StartupBench systematically studied AI products with demonstrated adoption — their product workflows and users — to identify real-world tasks for which AI has established practical demand.

The benchmark contains 97 tasks across 6 top-level domains: Medical & Healthcare, Finance, Legal, Business & Management, STEM & Computer Science, and Education & Humanities. Each task is evaluated using an average of 25.3 fine-grained rubrics spanning 6 dimensions and 3 importance levels.

## The headline finding

Even the strongest model successfully completes only approximately 30% of StartupBench under the strict acceptance criterion (score ≥ 90). This is despite making substantial partial progress on many tasks. The average scores of most models lie between roughly 55 and 75, indicating that current agents can make meaningful progress but cannot consistently produce professionally usable deliverables.

## General-purpose vs. specialized agents

The benchmark's most actionable finding is the gap between general-purpose and specialized agents:

| Category | Average Score | Completion Rate |
|----------|--------------|-----------------|
| General-purpose agents | 64.26 | 19.74% |
| General-purpose (oracle best-of-3) | 71.75 | 28.06% |
| Specialized agents | 83.50 | 39.18% |

Even with oracle selection (best result among three independent trials), general-purpose agents fall 11.75 points short of specialized agents in average score and 11.12 percentage points short in completion rate. The gap cannot be explained by stochastic variation or occasional execution failures.

## Where models fail

The failure-mode analysis identifies four primary bottlenecks:

1. **Complex instruction following** — multi-step, multi-constraint instructions that require careful tracking
2. **Domain-specific expertise** — professional knowledge that general models lack
3. **Professional operational conventions** — formatting, terminology, workflow norms specific to each domain
4. **Long-horizon workflow execution** — maintaining consistency across a multi-hour, multi-step deliverable

## Evaluation protocol

- **Harness**: Nanobot with identical tool configuration across all models
- **Runs**: 3 independent runs per model, 95% bootstrap confidence intervals (10,000 resamples)
- **Step cap**: 200 interaction steps per task
- **Scoring**: Judge agent evaluates deliverables against task specification, workspace context, and rubric set
- **Strict acceptance**: score ≥ 90

## Key results

- **Kimi-K3**: Highest average score (73.67%) but lower completion rate than GPT-5.6-sol
- **GPT-5.6-sol**: Highest completion rate among general-purpose models (73.61% avg score)
- **Kimi-K2.6**: Higher average score than Qwen-3.6-Max but lower completion rate — the pattern repeats
- **GLM-5.1**: Notably robust to rubric weighting changes (0.61 point swing vs. 1.79 average), suggesting consistent partial completion

The discrepancy between average scores and completion rates is the benchmark's key insight: the primary bottleneck is no longer executing large portions of a workflow, but consistently producing artifacts that satisfy professional standards.

## Why it matters

StartupBench validates what practitioners have suspected: benchmark scores on researcher-selected tasks overestimate real-world agent capability. When tasks come from actual products with paying users, even frontier models complete less than a third of them to professional standards. This makes StartupBench a more honest measure of where agent capability actually stands — and where it needs to go.

## Reference

- [Paper on arXiv](https://arxiv.org/html/2608.17800)
- Published August 24, 2026