---
slug: tau-tau-bench-september-2026
title: "ττ-bench: Can Coding Agents Build a Customer-Service Agent? (23.9% vs 82.2% Ceiling)"
excerpt: "A new arXiv benchmark makes agent construction the task — a coding agent must deliver a complete customer-service agent from real business records, a client, a production API, and a cost budget. The best system passes just 23.9% vs an 82.2% expert ceiling."
category: "Agent Construction Benchmark"
tags:
  - benchmark
  - agents
  - coding-agent
  - customer-service
  - evaluation
agents:
  - Claude Opus 5 (under Claude Code)
  - Claude Fable 5.1 (under Claude Code)
llm: "Claude Opus 5"
winner: "Claude Opus 5 (under Claude Code) — 23.9%"
date: "2026-09-04"
order: 99
last_verified: "2026-09-09"
results:
  - agent: Claude Opus 5 (under Claude Code)
    score: 24
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Best configuration. 23.9% pass rate on held-out simulated users. 53 tasks across 4 domains."
  - agent: Expert-authored reference ceiling
    score: 82
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Human-authored reference agent. 82.2% — the gap to the best automated system is 58 points."
---

# ττ-bench: Can Coding Agents Build a Customer-Service Agent?

## What it tests

ττ-bench (pronounced *hyper-tau-bench*), published on arXiv September 4, 2026, flips the usual benchmark framing: instead of measuring how well an agent *uses* tools, it measures how well a **coding agent can build a complete customer-service agent** under the conditions of a real client engagement.

A developer agent is given:

- the records a business actually keeps
- a client who holds requirements
- a production API that operations must run through
- a codebase to inherit
- limits on serving cost and models

From these it must deliver a complete customer-service agent, scored by **deploying that agent against held-out simulated users**. Across 53 tasks spanning four domains, the strongest configuration — Claude Opus 5 under Claude Code — passes just **23.9%** of evaluation simulations. An expert-authored reference ceiling scores **82.2%**.

## Results

| Configuration | Pass rate | Notes |
|---|---|---|
| Claude Opus 5 (under Claude Code) | 23.9% | Best automated system tested |
| Expert-authored reference ceiling | 82.2% | Human-authored reference agent |

The 58-point gap between the best automated system and the human ceiling is the headline. This is not a near-saturated benchmark; it is a wide-open problem.

## What the failures look like

The failures mirror the ones human agent developers actually see:

- **Shallow queries in place of deep comprehension**: models issue surface-level queries instead of deeply understanding the business records
- **Almost no communication with the client**: the agent rarely clarifies requirements or surfaces assumptions, shipping the first design that runs
- **Too little experimentation with architecture and serving spend**: the agent does not explore agent architectures or trade off serving cost, it commits to the first runnable design

These are exactly the failure modes that separate a junior agent builder from a senior one — and ττ-bench makes them measurable.

## Why it matters

- **Agent construction is becoming production software work.** LLM agents are increasingly deployed to handle customer service, adjudicate disputes, and operate internal systems — and the work of building them is increasingly handed to coding agents. Existing benchmarks said little about whether an AI system can deliver one under real engagement conditions.
- **The benchmark measures the *meta*-task.** Most agent benchmarks test tool use or task completion. ττ-bench tests whether a coding agent can produce a *deployable agent* — a qualitatively different and harder capability.
- **The ceiling is far away.** 23.9% vs 82.2% means there is enormous headroom. This is a benchmark to track over time, not a leaderboard to declare a winner on.

## Limitations

- **Single best system reported**: the paper focuses on the strongest configuration (Claude Opus 5 under Claude Code); broader model coverage may follow.
- **Four domains, 53 tasks**: a focused scope — generalization to other domains (e.g., internal-tools agents, developer-tools agents) is not yet shown.
- **Simulated-user scoring**: the evaluation agent is deployed against held-out simulated users, which is a reasonable proxy but not identical to real end-users.
- **Reference ceiling is human-authored**: it represents what an expert *can* do, not what is trivially achievable.

## What this means for agent builders

If you are using a coding agent to build a customer-service (or similar) agent, expect it to produce a first-pass design that runs but misses deep comprehension, client communication, and architecture/serving-cost optimization. Plan for a human to close the 58-point gap through requirements clarification, architecture review, and serving-cost tuning — the exact skills the benchmark shows automated systems currently lack.