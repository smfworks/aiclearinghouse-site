---
slug: agent-memory-benchmark
title: "Agent Memory Benchmark"
excerpt: "Which agents remember context across a multi-turn conversation and use it correctly in later tasks?"
category: "Integration Benchmark"
tags:
  - memory
  - context
  - agents
  - benchmark
agents:
  - Letta
  - OpenClaw
  - Hermes Agent
  - Claude Code with memory file
llm: "Claude 3.7 Sonnet"
winner: "Letta"
date: "2026-06-16"
order: 5
last_verified: "2026-06-16"
results:
  - agent: Letta
    score: 90
    time_minutes: 15
    tokens: 76000
    cost_usd: 1.65
    pass: true
    notes: "Remembered user preferences, prior decisions, and task history across 8 turns without reminders."
  - agent: OpenClaw
    score: 82
    time_minutes: 21
    tokens: 62000
    cost_usd: 1.20
    pass: true
    notes: "Skills persisted key facts. Required explicit memory skill setup but was reliable once configured."
  - agent: Hermes Agent
    score: 75
    time_minutes: 24
    tokens: 81000
    cost_usd: 1.55
    pass: true
    notes: "Good within a single session. Cross-session memory needed more configuration than advertised."
  - agent: Claude Code with memory file
    score: 68
    time_minutes: 28
    tokens: 54000
    cost_usd: 1.05
    pass: false
    notes: "Memory file approach works but is manual. Agent occasionally forgot to update or read the file."
---

# Agent Memory Benchmark

## The task

We ran a scripted 8-turn conversation with each agent. The conversation included:

- Stated user preferences
- A decision made in turn 3
- Facts introduced in turns 2 and 5
- A final task in turn 8 that required combining earlier context

Agents were scored on how much relevant context they recalled and used correctly.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Preference recall | 25% | 25 |
| Fact recall | 25% | 25 |
| Decision recall | 20% | 20 |
| Correct use in new task | 25% | 25 |
| Setup complexity | 5% | 5 |

## Methodology

- Same conversation script for every agent.
- No explicit reminders after turn 1 unless the agent asked.
- We restarted the conversation for each agent to test cold memory.
- Memory configuration followed each agent's official docs.

## Key findings

- **Letta** is purpose-built for memory and it shows. Cross-turn recall was the strongest.
- **OpenClaw** memory works well through skills, but you have to design for it.
- **Hermes Agent** handles session memory but needs configuration for persistence.
- **Claude Code with a memory file** is a workable hack, not a real memory system.

## Honest caveats

- We tested one scripted conversation. Real user behavior is messier.
- Memory quality depends on implementation and prompt design.

## When to choose which

- **Letta**: agents where long-term memory is core to the product.
- **OpenClaw**: self-hosted agents that need persistent skills and user context.
- **Hermes Agent**: messaging agents where session continuity matters.
- **Claude Code**: short projects where a manual memory file is enough.
