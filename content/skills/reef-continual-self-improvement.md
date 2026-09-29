---
slug: reef-continual-self-improvement
title: Reef Continual Self-Improvement Infrastructure
category: Workflow
excerpt: "Open-source infrastructure that turns your inference server into a learner — agents evolve both model weights and harness from live traffic with evaluation gates."
tags:
  - hermes
  - continual-learning
  - rsi
  - inference
  - training
  - open-source
for: Any Agent Framework
author: Human-Agent-Society
install: pip install reef-agent
dependencies:
  - Python 3.11+
  - CUDA-capable GPU(s) for model updates
  - Git LFS for artifact management
image: /images/skills/workflow.svg
source: https://github.com/Human-Agent-Society/reef
order: 99
last_verified: "2026-09-16"
---

# Reef Continual Self-Improvement Infrastructure

## What it is

Reef is an open-source infrastructure for building agents that do not merely serve, but **continually learn and evolve from experience**. Published on Hugging Face September 15, 2026, by the Human-Agent-Society, Reef rethinks the relationship between inference and training: instead of decoupling them, it makes inference native and builds training capacity around live traffic.

The core idea: your inference server is secretly a learner. Reef collects inference traces and feedback as a structured experience stream, then lets learning recipes process that stream to update both the model and the harness.

## What makes it different

Traditional RL infrastructure (Slime, veRL) incorporates an inference engine for generating training data, but these systems are designed for model training, not model serving. Reef inverts this:

1. **Inference is native**: Reef exposes standard inference endpoints so existing applications can integrate without changes
2. **Stateful inference**: Stores traces and feedback as a structured experience stream, handling off-policy staleness, session merging, and deduplication
3. **Whole-agent evolution**: Updates both model weights (via LoRA adapters or checkpoints) AND the harness (prompts, memory, skills, tools, orchestration logic)
4. **Evaluation-gated releases**: Each evolved candidate must pass evaluation before replacing the current serving artifact

## How it works

### Experience collection
Reef wraps your existing inference endpoint. As the agent serves real applications, Reef records traces, tool calls, feedback, and outcomes as a structured experience stream.

### Learning recipes
You configure a learning recipe that defines:
- How the experience stream is processed
- Which learning algorithm is used (model-side or harness-side)
- When updates are evaluated and deployed

### Model evolution
Training runs asynchronously with live serving using a distributed training backend (adapted from Slime). Candidates are published as LoRA adapters or checkpoints.

### Harness evolution
Reef uses Cordis as a "training backend" for harness evolution. It analyzes agent trajectories and feedback, then proposes edits to prompts, tools, and orchestration logic. Each evolved harness version is released as an installable update.

### Release governance
Each scenario has an append-only release chain. Reef advances the release head using compare-and-swap, so a stale publisher cannot overwrite a newer release. If a candidate is rejected, serving remains unchanged.

## When to use it

- You want your agent to improve from real production traffic, not just offline training data
- You need to evolve both the model and the harness (prompts, tools, skills) together
- You want evaluation-gated releases so bad updates never reach production
- You are building continual self-improvement systems and want production-grade infrastructure

## Install

```bash
pip install reef-agent
```

Then configure your scenario, learning recipe, and evaluation gates in the Reef config.

## Skill source

- [GitHub: Human-Agent-Society/reef](https://github.com/Human-Agent-Society/reef)
- [Hugging Face blog post](https://huggingface.co/blog/quao627/your-inference-server-is-secretly-a-learner-reef)