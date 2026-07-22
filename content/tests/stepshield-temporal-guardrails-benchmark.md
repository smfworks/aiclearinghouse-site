---
slug: stepshield-temporal-guardrails-benchmark
title: "StepShield: Temporal Agent Guardrails Benchmark"
excerpt: "NeurIPS 2026 benchmark with 9,429 trajectories and step-level annotations for evaluating when (not whether) to intervene on rogue AI agents — temporal evaluation of guardrails."
category: "Agent Safety Benchmark"
tags:
  - agent-safety
  - guardrails
  - benchmark
  - temporal-evaluation
  - neurips-2026
agents:
  - Any agent with guardrail/intervention system
llm: "Multiple (evaluates guardrail systems, not specific LLMs)"
winner: null
date: "2026-07-22"
order: 99
last_verified: "2026-07-22"
url: "https://github.com/glo26/stepshield"
results: []
---

# StepShield: Temporal Agent Guardrails Benchmark

## What it is

[StepShield](https://github.com/glo26/stepshield) is a NeurIPS 2026 benchmark for evaluating AI agent guardrails from a temporal perspective. Rather than asking "can a guardrail detect a rogue agent?" (a binary question), StepShield asks "when should a guardrail intervene?" — evaluating the timing of intervention decisions across 9,429 agent trajectories with step-level annotations.

## What it measures

The benchmark evaluates guardrail systems on a critical distinction: **intervening too early** wastes compute and disrupts legitimate agent behavior, while **intervening too late** allows damage. Step-level annotations enable precise scoring of when a guardrail fired versus when it should have fired.

Key dimensions:

1. **Detection accuracy** — does the guardrail correctly identify the step where the agent goes rogue?
2. **Intervention timing** — how many steps after the rogue action did the guardrail intervene?
3. **False positive rate** — how often does the guardrail intervene on legitimate agent behavior?
4. **Coverage** — across how many of the 9,429 trajectories does the guardrail fire correctly?

## Dataset

- **9,429 trajectories** with step-level annotations
- Diverse agent failure modes (prompt injection, goal drift, unsafe tool use, etc.)
- Includes both rogue and benign trajectories for false positive evaluation
- Each trajectory has expert-labeled intervention points

## Design goals

- **Temporal evaluation.** Not just "did you catch it?" but "did you catch it at the right time?"
- **Step-level granularity.** Evaluations are per-step, not per-trajectory, enabling precise scoring.
- **Realistic trajectories.** Trajectories are sourced from real agent runs, not synthetic scenarios.
- **Reproducible.** Dataset, evaluation scripts, and scoring are versioned in the repository.

## How to run

1. Clone the repository: `git clone https://github.com/glo26/stepshield`
2. Download the dataset (instructions in the README).
3. Run your guardrail system against each trajectory.
4. Use the provided evaluation script to score detection accuracy, timing, and false positive rate.

## Why it matters

Most agent safety benchmarks evaluate whether a guardrail can detect a problem at all. In production, the harder question is when to intervene. StepShield is the first benchmark to formalize this temporal dimension with step-level annotations at scale, making it essential for teams deploying guardrails in real agent systems.

## Limitations

- Guardrail-system benchmark, not a model benchmark — requires a guardrail implementation to evaluate.
- Trajectories are pre-recorded, not live — does not evaluate guardrail overhead in real-time.
- 9,429 trajectories may not cover all failure modes in your specific deployment.

## Resources

- **GitHub:** [glo26/stepshield](https://github.com/glo26/stepshield)
- **Venue:** NeurIPS 2026
- **Stars:** 82+