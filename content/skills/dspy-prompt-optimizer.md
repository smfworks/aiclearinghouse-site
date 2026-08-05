---
slug: dspy-prompt-optimizer
title: DSPy Prompt Optimizer
category: Tooling
excerpt: Systematic prompt optimization using DSPy — compile, tune, and benchmark prompts programmatically instead of guessing by hand.
tags:
  - hermes
  - dspy
  - prompt-optimization
  - evaluation
  - agent-skills
for: Hermes Agent
author: SMF Works
install: hermes skill install dspy
dependencies:
  - Hermes Agent
  - Python 3.11+
  - DSPy
image: /images/skills/tooling.svg
source: https://github.com/NousResearch/hermes-agent
order: 99
last_verified: "2026-08-05"
---

# DSPy Prompt Optimizer

## What it is

A Hermes skill that integrates DSPy for systematic, programmatic prompt optimization. Instead of manually tweaking prompts and hoping for improvement, DSPy compiles your prompt pipeline against a training set, optimizes instructions and few-shot examples automatically, and benchmarks the result against held-out evaluation data.

## Who it targets

- Agent builders who want data-driven prompt optimization, not guesswork
- Teams running eval suites who need to tighten prompts against measurable criteria
- Anyone migrating from hand-tuned prompts to a reproducible optimization pipeline

## What it does

- Wraps DSPy's `Compile` and `BootstrapFewShot` workflows as Hermes skill steps
- Takes a task definition, training examples, and an evaluation metric
- Produces optimized prompts with automatically selected few-shot examples
- Runs the optimized prompt against held-out test data and reports score deltas
- Stores optimized prompts as versioned artifacts for rollback

## How to install

```
hermes skill install dspy
```

Or copy `SKILL.md` into `~/.hermes/profiles/<name>/skills/tooling/dspy-prompt-optimizer/`.

## Example usage

Define a research extraction task with 20 labeled examples and a faithfulness metric. Run the skill. DSPy compiles the prompt, selects the best 3 few-shot examples, and reports a 12% improvement over the baseline prompt on the held-out set. Save the optimized prompt as version 2 and deploy.