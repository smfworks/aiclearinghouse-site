---
slug: audit-benchmarks-adversarially
title: Audit Your Benchmarks Adversarially Before Trusting Them
category: Evaluation
excerpt: A benchmark that a zero-capability agent can pass is not measuring capability — it is measuring your test's bugs. Run a null agent before publishing any score.
tags:
  - benchmarks
  - evaluation
  - testing
  - agents
  - security
order: 99
last_verified: "2026-08-05"
---

# Audit Your Benchmarks Adversarially Before Trusting Them

## The principle

A 2026 study showed that SWE-bench Verified can be gamed to 100% via pytest hook manipulation. Terminal-Bench trusts reward files written by scripts the agent can tamper with. When the test infrastructure can be compromised by the system under test, the results are meaningless. Before you trust any benchmark score — yours or a vendor's — test it adversarially.

## Why it matters

Benchmark scores drive real decisions: model selection, hiring, funding, procurement. If your evaluation can be passed without solving the task, you are not measuring what you think you are measuring. The cost of a false benchmark signal is deploying a model that fails in production while your dashboards say it is performing well.

## How to apply it

1. **Run a null agent.** Build an agent that takes no actions, produces no output, and does not attempt the task. Its score is your floor. If the floor is not zero, your benchmark has a bug.
2. **Run an exploit agent.** Build an agent that does everything except solve the task — it manipulates test files, hooks into the evaluation harness, writes reward files directly. If it scores above baseline, your evaluation can be gamed.
3. **Check execution-based verification.** Does your benchmark verify the end state (database updated, test suite passed, file created) or just the final message? A benchmark that checks text output will pass agents that "look right" and do the wrong thing.
4. **Use held-out test sets.** If the agent can see your test cases, it can optimize for them. Accept model outputs and run them against a private test set the submitter never sees.
5. **Trust no infrastructure the agent controls.** If the agent runs inside a container that also generates the test output, the results are suspect. Isolate the evaluator from the system under test.

## Red flags

- Your benchmark only checks the final message, not the system state
- The test runner executes inside the agent's own environment
- You have never run a null agent against your eval suite
- A vendor's benchmark score seems too good to be true and they will not share methodology

## Quick win

This week, run a null agent (no tools, no actions, empty output) against your most-trusted benchmark. If it scores anything above zero, you have found a bug that invalidates every score you have published using that benchmark.