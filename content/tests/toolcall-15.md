---
slug: toolcall-15
title: "ToolCall-15: Deterministic Tool-Use Bench Pack"
excerpt: "Fifteen scenarios across selection, parameter precision, multi-step chains, restraint, and error recovery — a reproducible tool-use pack for BenchLocal and CLI runners."
category: "Tool-Use Benchmark"
tags:
  - tool-calling
  - benchmarks
  - agents
  - benchlocal
  - evaluation
agents:
  - Any model via BenchLocal or CLI
llm: "Multiple"
winner: null
date: "2026-07-13"
order: 20
last_verified: "2026-07-13"
url: "https://github.com/stevibe/ToolCall-15"
results: []
---

# ToolCall-15

## What it is

[ToolCall-15](https://github.com/stevibe/ToolCall-15) is an official [BenchLocal](https://github.com/stevibe/BenchLocal) Bench Pack for evaluating deterministic tool use: tool selection, parameter precision, multi-step tool chains, restraint, and recovery from tool errors.

It is smaller and more focused than tool-eval-bench, which makes it excellent as a fast regression gate when you change models, samplers, or tool schemas.

## What it measures

Five categories, three scenarios each:

1. **Tool Selection**
2. **Parameter Precision**
3. **Multi-Step Chains**
4. **Restraint and Refusal**
5. **Error Recovery**

Each scenario scores:

- `2` pass
- `1` partial
- `0` fail

Each category is worth 6 points. The final score averages the five category percentages.

## Design goals

- **Reproducible:** system prompt, tool schema, mocked tool outputs, and scoring are versioned
- **Balanced:** failure modes are spread, not over-indexed on one skill
- **Deterministic:** mocked tools, temperature 0 defaults
- **Inspectable:** raw traces for failed scenarios

## How to run

### BenchLocal (recommended)

1. Install BenchLocal from its latest release
2. Install ToolCall-15 from the official Bench Pack registry
3. Add models, select ToolCall-15, run

### CLI / development

The repository includes a CLI runner and BenchLocal adapter (`npm install`, `npm run cli`, `npm run build:benchlocal` — see upstream README).

## Why add it to the Clearinghouse

Most public "agent benchmarks" still under-test tool discipline. ToolCall-15 is a practical pack you can run locally before promoting a model into production agent roles.

## Limitations

- Fifteen scenarios will not cover every enterprise tool edge case
- Mocked tools cannot fully simulate flaky third-party APIs
- Use as a gate, not as the only evaluation

## Related

- [tool-eval-bench](https://github.com/MiaAI-Lab/tool-eval-bench) for a larger 69+ scenario expansion of the same idea
- [BenchLocal](https://github.com/stevibe/BenchLocal) as the desktop runner for multiple packs
