---
slug: building-self-improving-agents
title: "Building Self-Improving Agents: From Static Serving to Continual Evolution"
excerpt: "A practical guide to building agents that learn from live traffic — evolving both model weights and harness through evaluation-gated release pipelines."
category: Guides
tags:
  - continual-learning
  - rsi
  - evaluation
  - infrastructure
  - agents
  - production
order: 99
last_verified: "2026-09-16"
---

# Building Self-Improving Agents: From Static Serving to Continual Evolution

## Why this matters now

Traditional inference servers are static throughout their lifecycle. They serve, they log, they never change — until someone manually trains a new model and swaps it in. That model is a decoupled artifact, disconnected from the live traffic that revealed what needed improving.

Reef (open-sourced September 15, 2026 by the Human-Agent-Society) argues that infrastructure for continual self-improvement must start from **live inference** and build training capacity around it. The system serves real applications, collects test-time experience, and lets learning recipes continuously consume it.

This guide walks through the architecture, components, and practical decisions for building a self-improving agent.

## The three things you must own end-to-end

A continual self-improving infrastructure must own three things:

1. **The experience**: Learning from live traffic — not offline datasets
2. **The agent**: Updating both the model AND the harness (prompts, tools, skills, orchestration)
3. **The updates**: Properly evaluating, versioning, and controlling how updates are released

## Architecture overview

```
Live Traffic → Inference Endpoint → Experience Stream
                                        ↓
                                 Learning Recipe
                                   ↓        ↓
                           Model Update   Harness Update
                               ↓                ↓
                          Eval Gate        Eval Gate
                               ↓                ↓
                          Release           Release
                          (LoRA/CKPT)    (Harness v2)
                               ↓                ↓
                          Hot-swap         Installable
                          (NCCL sync)       update
```

## Component 1: Stateful inference

Your inference endpoint must be **stateful** — it does not just serve, it records.

What to collect per inference call:
- The full prompt and context
- Tool calls made and their results
- Intermediate outputs
- User feedback (explicit or implicit)
- Final output
- Tokens consumed, latency, cost
- Trace ID for correlation

Key challenges:
- **Off-policy staleness**: Experience collected from an older model version may not reflect current behavior. Tag every trace with the model/harness version that produced it.
- **Session merging**: Multi-turn conversations may span multiple inference calls. Group them.
- **Deduplication**: Identical prompts produce identical experience. Don't store duplicates.

## Component 2: Learning recipes

A learning recipe defines:
- How the experience stream is processed (filtering, sampling, weighting)
- Which learning algorithm is used
- When updates are evaluated and deployed

### Model-side recipes

- **RL from verifiable rewards**: Use environment-verified outcomes (tests pass/fail, builds succeed/fail, user accepts/rejects) as reward signals
- **LoRA fine-tuning**: Lightweight weight updates from collected trajectories — no full retraining
- **DPO/preference learning**: Use pairs of good/bad outputs from the experience stream

### Harness-side recipes

The harness (prompts, tools, skills, orchestration logic) is just as important as the model. Harness evolution recipes:
- Analyze agent trajectories and feedback
- Propose edits to prompts, tool definitions, or orchestration logic
- Release evolved harness versions as installable updates

## Component 3: Evaluation gates

Every evolved candidate must pass evaluation before replacing the current serving artifact.

- **Holdout evaluation**: Run the candidate against a held-out set of tasks
- **A/B shadow**: Serve the candidate in shadow mode alongside the current model, compare outputs
- **Regression tests**: A fixed suite of 50-200 tests that every candidate must pass
- **Human approval**: For high-stakes updates, require a human to approve the release

If a candidate is rejected, serving remains unchanged. Never let a bad update reach production.

## Component 4: Versioned releases

Each scenario has an **append-only release chain**. The release head advances using compare-and-swap, so a stale publisher cannot overwrite a newer release.

Artifacts to version:
- Model checkpoints
- LoRA adapters
- Harness configurations (prompts, tools, skills)
- Routing policies

Use Git LFS for large artifacts (model weights). Tag every release with:
- Version number
- Parent version
- Evaluation results
- Approval record
- Timestamp and publisher

## Component 5: Hot-swap deployment

When a candidate passes evaluation and is approved:

- **Model side**: Hot-update the serving engine using NCCL-based weight synchronization — no service restart required
- **Harness side**: Publish as an installable update; the next time the user opens the harness, they get the new version

## Practical decisions

### Should you evolve the model or the harness first?

Start with the harness. Prompt and tool-definition improvements are cheaper, faster, and lower-risk than weight updates. Many agent failures are harness problems (bad tool descriptions, missing context, poor orchestration) that no amount of model training will fix.

### How often should you update?

- **Harness**: Weekly or per-release cycle. Low risk, fast feedback.
- **Model (LoRA)**: Monthly. Medium risk, requires evaluation.
- **Model (full retrain)**: Quarterly or less. High risk, high cost.

### What experience should you learn from?

Not all traffic is worth learning from. Prioritize:
- **Failed tasks**: Where the agent produced a wrong or rejected output — these carry the most signal
- **High-cost tasks**: Where tokens or time were wasted — efficiency improvements compound
- **User-corrected tasks**: Where the user explicitly fixed the agent's output — direct training signal

### How do you prevent catastrophic forgetting?

- Always evaluate against your full regression suite, not just the new task
- Mix old experience with new in your training data
- Use LoRA (not full fine-tuning) to preserve base model capabilities
- Keep the previous version as a fallback; revert if the new version regresses on any key metric

## When NOT to build self-improving agents

- **Low traffic**: If you don't have enough live traffic to generate meaningful experience, offline training is more efficient
- **High-stakes, low-tolerance domains**: If a bad update could cause real harm (medical, legal, financial), the risk of automated evolution may exceed the benefit
- **No evaluation infrastructure**: Without robust eval gates, self-improvement becomes self-degradation. Build eval first.

## The takeaway

Self-improving agents are not science fiction — the infrastructure exists today (Reef is open-source and MIT-licensed). But the hard part is not the training; it is the **evaluation, versioning, and release governance** that ensures improvements are real and bad updates never reach production.

Start with harness evolution (cheaper, safer). Build your evaluation gates first. Collect experience from live traffic. And only add model evolution when your eval pipeline is robust enough to catch regressions before they ship.