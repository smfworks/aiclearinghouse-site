---
slug: test-with-continuous-validation
title: Run Continuous Validation on Agent Benchmarks
category: Testing
excerpt: Agent benchmarks rot when external dependencies change. Run continuous validation against your eval suite or your benchmark scores will silently drift from reality.
tags:
  - benchmarks
  - testing
  - agents
  - validation
  - ci
order: 99
last_verified: "2026-09-02"
---

# Run Continuous Validation on Agent Benchmarks

## The principle

Agent benchmarks interact with real environments — Docker images, package repositories, APIs, file systems. These change over time. A benchmark that was valid when published can become invalid months later without anyone noticing, because the environment drifted, not because the agent got worse. Terminal-Bench 2.1 fixed 28 of 89 tasks from v2.0 for exactly this reason: external dependencies changed, resource budgets were too tight, and instructions did not match tests.

## Why it matters

If you are using a benchmark to decide which model to deploy, which agent to ship, or whether a change improved performance, a decaying benchmark gives you wrong answers. You might see a score drop from 80% to 75% and blame your code change, when the real cause is that a pip package the benchmark installs is now a different version.

Terminal-Bench 2.1 introduced continuous validation as part of the benchmark itself — a per-task check that the environment and tests still align. This is the right pattern for any team running agent evaluations in CI.

## How to apply it

1. **Pin every external dependency.** Docker images, package versions, API endpoints, and model versions should all be pinned. If a benchmark task installs `requests`, pin `requests==2.31.0`, not `requests`. Terminal-Bench 2.0's drift came from unpinned Docker images that changed after publication.

2. **Run a canary pass on a known-good agent weekly.** Pick your best-performing agent and run the full benchmark suite once a week. If its score drops by more than 2 percentage points with no code change, investigate environment drift before trusting any new results.

3. **Validate instructions match tests.** Terminal-Bench 2.1 found tasks where instructions asked for PostgreSQL but tests expected Spark SQL. Audit your eval tasks to confirm the instructions, the environment, and the verification tests are consistent.

4. **Check resource budgets.** Terminal-Bench 2.0 had 8 tasks where valid solutions — including oracle solutions — could not finish because CPU, memory, or time budgets were too tight. If your eval tasks have timeouts, verify that a correct solution can complete within the budget on your hardware.

5. **Track no-solve tasks.** If a task has zero pass rate across all agents over multiple runs, it may be broken, not hard. Terminal-Bench 2.1 ensured no task was unsolved. A permanently unsolved task is a signal that the environment or tests are wrong, not that every model is incapable.