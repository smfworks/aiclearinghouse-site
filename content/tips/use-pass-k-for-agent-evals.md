---
slug: use-pass-k-for-agent-evals
title: "Use Pass-k Scoring for Agent Evaluations"
category: Evaluation
excerpt: "Single-run pass rates hide unreliability. Score your agents with pass-k (pass on all k attempts) to surface models that are only sometimes right — and would require manual checking in production."
tags:
  - evaluation
  - benchmarks
  - reliability
  - agents
order: 99
last_verified: "2026-08-12"
---

# Use Pass-k Scoring for Agent Evaluations

## The problem

Most agent benchmarks report pass@1 — the percentage of tasks the agent solves on a single attempt. This metric hides a critical failure mode: an agent that solves a task 60% of the time reports the same pass@1 as one that solves it 100% of the time, if you get lucky on the single run. In production, the 60% agent means 40% of outputs need manual review, which destroys the economic case for automation.

## What pass-k measures

Pass-k (also written pass^k) asks: did the agent solve the task on **all k attempts**? This is a much stricter test:

- **pass@1**: Solved on at least 1 of k attempts (optimistic — hides inconsistency)
- **pass-k**: Solved on all k attempts (pessimistic — surfaces unreliability)

An agent with 90% pass@1 but 40% pass-5 is unreliable. It sometimes gets the right answer, but you can't trust it without checking every time.

## Real-world evidence

Artificial Analysis's new AA-AnalystAgent benchmark (August 2026) uses pass^5 scoring — each of 80 quantitative analysis questions is run five times, and the headline metric is whether the agent solved it on all five attempts. The results are telling:

- **Claude Opus 5**: 54% pass^5 — the best, but still fails 46% of the time on all attempts
- **GPT-5.5**: 50% pass^5
- **Claude Fable 5**: 49% pass^5

Even the best frontier models fail to reliably solve quantitative analysis tasks on repeated attempts. If you evaluated these with pass@1, the numbers would look much better — and you'd deploy agents that silently fail in production.

## How to implement pass-k in your evals

### 1. Run each task k times

Set k=5 as a starting point. For high-stakes tasks, use k=10. Each run should be independent — no shared state, no warm-up effect.

### 2. Score strictly

A task is pass-k only if all k attempts succeed. Partial success on some attempts does not count.

### 3. Track variance

Beyond the pass-k rate, track the variance across attempts. High variance (some runs solve it in 30 seconds, others time out at 5 minutes) signals instability even when pass-k looks acceptable.

### 4. Report both pass@1 and pass-k

Pass@1 tells you the ceiling. Pass-k tells you the floor. The gap between them is your reliability risk.

## When to use pass-k

- **Production agents**: Always. If you're deploying without human review, you need to know the floor, not the ceiling.
- **Model selection**: When comparing models for a task, pass-k reveals which one you can actually trust.
- **Regression testing**: Track pass-k over time to catch reliability regressions that pass@1 would miss.

## When pass@1 is sufficient

- **Exploratory research**: When you're just checking if a task is feasible
- **Creative tasks**: Where there's no single correct answer
- **Human-in-the-loop**: Where a human reviews every output anyway

## The takeaway

If your evaluation doesn't measure reliability, you're not evaluating — you're hoping. Pass-k scoring adds a few minutes of compute per task and saves you from deploying agents that look good in benchmarks but fail unpredictably in production.