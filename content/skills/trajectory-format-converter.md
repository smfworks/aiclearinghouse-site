---
slug: trajectory-format-converter
title: Trajectory Format Converter
category: Research
excerpt: Normalize coding-agent session logs from Claude Code, Codex, Letta Code, and other harnesses into one token-efficient format for agents learning from past experience.
tags:
  - hermes
  - agents
  - memory
  - research
  - learning
  - trajectory
for: Hermes Agent / Any agent framework
author: Letta (formerly MemGPT)
install: pip install trajectory
dependencies:
  - Python 3.10+
  - Agent session logs (Claude Code, Codex, Letta Code, or compatible)
image: /images/skills/research.svg
source: https://github.com/letta-ai/trajectory
order: 99
last_verified: "2026-07-29"
---

# Trajectory Format Converter

## What it is

Trajectory is an open-source Python package from Letta (formerly MemGPT) that normalizes coding-agent session logs from multiple harnesses — Claude Code, Codex CLI, Letta Code, and others — into a single, token-efficient format designed for agents that learn from past experience. Released in July 2026, it is part of Letta's broader research program on memory models and continual learning for AI agents.

## The problem it solves

Every major coding agent (Claude Code, Codex, Letta Code, OpenHands) records its sessions differently — different JSON schemas, different tool-call representations, different state-tracking conventions. If you want to build a system where an agent learns from its own past sessions or from sessions across different harnesses, you first need to parse all these formats into something common.

Trajectory solves this by ingesting session logs from any supported harness and emitting a normalized, token-efficient representation that preserves the essential information — what the agent did, what tools it called, what it observed, and what the outcome was — while stripping harness-specific noise.

## What it gives you

### Multi-harness ingestion
- Claude Code session logs
- Codex CLI session logs
- Letta Code session logs
- Other agentskills.io-compatible harness outputs

### Token-efficient output
- Compressed representation optimized for feeding back into an LLM context
- Preserves decision points and tool-call sequences
- Drops verbose intermediate output that doesn't contribute to learning

### Learning-ready format
- Designed for Letta's memory models and continual learning research
- Compatible with trajectory-evaluation pipelines
- Usable as training/evaluation data for agent improvement

## When to use it

- You are building a system where agents learn from their own past sessions
- You want to evaluate agent trajectories across different harnesses using a common format
- You are doing research on agent memory, continual learning, or experience replay
- You need to audit what an agent did across multiple tools and sessions

## Quick start

```bash
pip install trajectory

# Convert a Claude Code session
trajectory convert --input claude-code-session.json --format claude-code

# Convert a Codex session
trajectory convert --input codex-session.json --format codex

# Batch convert a directory
trajectory convert-dir ./sessions/ --output ./normalized/
```

## Notes

- Part of Letta's research on memory models trained with memory-native RL
- Pairs with Letta's Context Constitution principles for agent context management
- Open-source under Apache 2.0 license
- Community contribution welcome — additional harness formats can be added via plugins