---
slug: multi-turn-tool-consistency-benchmark
title: "Multi-Turn Tool Consistency Benchmark"
excerpt: "Measures whether agents keep track of prior tool outputs and use them correctly across several turns without losing the thread."
category: "Integration Benchmark"
tags:
  - memory
  - tool-calling
  - context
  - agents
  - benchmark
agents:
  - Claude Code
  - OpenClaw
  - Hermes Agent
  - OpenHands
llm: "Multiple"
winner: "Claude Code"
date: "2026-07-01"
order: 16
last_verified: "2026-07-01"
results:
  - agent: Claude Code
    score: 88
    time_minutes: 18
    tokens: 54000
    cost_usd: 1.85
    pass: true
    notes: "Strongest at remembering prior tool outputs and folding them into the next step."
  - agent: OpenClaw
    score: 81
    time_minutes: 22
    tokens: 48000
    cost_usd: 1.10
    pass: true
    notes: "Skills persisted intermediate results well; routing between skills occasionally lost context."
  - agent: Hermes Agent
    score: 74
    time_minutes: 26
    tokens: 62000
    cost_usd: 1.45
    pass: true
    notes: "Good within a single conversation; cross-turn references needed explicit reminders."
  - agent: OpenHands
    score: 69
    time_minutes: 29
    tokens: 71000
    cost_usd: 1.20
    pass: false
    notes: "Capable on single-turn tool calls but drifted on later turns without restatement."
---

# Multi-Turn Tool Consistency Benchmark

## The task

We ran a scripted 5-turn workflow with each agent. Each turn required the agent to call a tool, then use the result in the next turn. The workflow included:

- A filesystem search in turn 1 whose output was needed in turn 3.
- A configuration value returned in turn 2 that had to be referenced in turn 4.
- A user preference stated in turn 1 that constrained the final action in turn 5.

Agents were scored on whether they used prior tool outputs correctly without being reminded.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Tool output recall | 35% | 35 |
| Correct chaining | 30% | 30 |
| User preference recall | 20% | 20 |
| No hallucinated prior results | 15% | 15 |

## Methodology

- Same script and tool set for every agent.
- No explicit reminders after turn 1 unless the agent asked.
- We scored each turn independently and averaged across runs.

## Key findings

- **Claude Code** retained the most context across turns, especially for chained tool use.
- **OpenClaw** performed well when skills were designed to emit structured state.
- **Hermes Agent** handled session continuity but sometimes needed restatement for older turns.
- **OpenHands** was strong on individual tool calls but drifted on later turns.

## Honest caveats

- The workflow is synthetic. Real user conversations are less predictable.
- Results depend on how each agent is configured for memory and context.

## When to choose which

- **Claude Code:** complex multi-turn workflows where context carries across many steps.
- **OpenClaw:** self-hosted agents that persist state through skills and gateways.
- **Hermes Agent:** messaging agents where most turns stay within a focused session.
- **OpenHands:** single-turn or lightly chained tool tasks.
