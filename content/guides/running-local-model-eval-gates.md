---
slug: running-local-model-eval-gates
title: "Running Local Model Eval Gates Before Promotion"
excerpt: "A practical gate sequence for promoting open-weight models in agent stacks: smoke chat, tool-use suite, task pilot, then production traffic."
category: Guides
tags:
  - evaluation
  - local-llm
  - vllm
  - agents
  - quality
order: 21
last_verified: "2026-07-13"
---

# Running Local Model Eval Gates Before Promotion

Swapping a local model because a blog post said it was "SOTA" is how production agents regress.

Use gates.

## Gate 0 — Serve and smoke

- Model loads without OOM at target context
- Chat completion returns
- Latency acceptable for interactive use

## Gate 1 — Tool-use suite

Run a deterministic tool-calling pack:

- ToolCall-15 for a fast signal
- tool-eval-bench when the decision is expensive

Fail the gate if safety/restraint categories collapse even if the average score looks fine.

## Gate 2 — Task pilot

Pick 3 real tasks from your agent:

1. A research/summarize job
2. A tool-using job
3. A long-context job

Score with a fixed rubric and the same seeds/prompts.

## Gate 3 — Canary traffic

Route a small percentage of production agent traffic (or shadow traffic) and watch:

- Tool error rates
- Human edit distance on drafts
- Token cost per accepted output

## Promotion rule

Promote only if Gates 0–2 pass and Gate 3 does not regress key metrics beyond your threshold.

## Anti-patterns

- Promoting on MMLU alone
- Changing temperature and model at the same time
- No trace retention for failed tool calls

## Bottom line

Local models are cheap to serve and expensive to trust. Gates make trust measurable.
