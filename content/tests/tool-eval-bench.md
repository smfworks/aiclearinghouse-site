---
slug: tool-eval-bench
title: "tool-eval-bench: Tool-Calling Quality Across Serving Stacks"
excerpt: "69 deterministic tool-use scenarios (plus optional Hard Mode) for OpenAI-compatible endpoints — selection, parameters, chains, restraint, recovery, safety, and structured output."
category: "Tool-Use Benchmark"
tags:
  - tool-calling
  - benchmarks
  - agents
  - vllm
  - llama.cpp
  - evaluation
agents:
  - Any OpenAI-compatible model endpoint
llm: "Multiple"
winner: null
date: "2026-07-13"
order: 19
last_verified: "2026-07-13"
url: "https://github.com/MiaAI-Lab/tool-eval-bench"
results: []
---

# tool-eval-bench

## What it is

[tool-eval-bench](https://github.com/MiaAI-Lab/tool-eval-bench) is a tool-calling quality benchmark for evaluating LLM tool use in agentic workflows across open-weight serving stacks such as **vLLM**, **LiteLLM**, and **llama.cpp**. It is inspired by ToolCall-15 and expands into a much larger scenario suite.

It runs **69 deterministic scenarios** (plus **15 opt-in Hard Mode** scenarios) through OpenAI-compatible `/chat/completions` endpoints, scores each result as **pass**, **partial**, or **fail**, and produces detailed trace reports. Mock tool responses include realistic payload noise so models must extract the right fields from messy API-like data.

## What it measures

### Core tool-call quality (15 categories)

| Category | Focus |
|----------|--------|
| Tool Selection | Pick the right tool from crowded catalogs |
| Parameter Precision | Units, dates, multi-value args |
| Multi-Step Chains | Data threading, parallel calls, polling |
| Restraint and Refusal | Knowing when **not** to call tools |
| Error Recovery | Failures without corrupting state |
| Localization | Language and timezone edge cases |
| Structured Reasoning | Routing, extraction, constraints |
| Instruction Following | Format and tool_choice compliance |
| Context and State | Multi-turn consistency |
| Code Patterns | Read-before-write, explain vs execute |
| Safety and Boundaries | Injection, escalation, contradictory params |
| Toolset Scale | Selection among large tool catalogs |
| Autonomous Planning | Goal decomposition |
| Creative Composition | Cross-tool synthesis |
| Structured Output | JSON schema compliance |

### Optional add-ons

- Throughput (prefill / generation style sweeps)
- Pluggable accuracy plugins: GSM8K, MMLU, IFEval via the same OpenAI-compatible path

## Scoring

- **2** pass, **1** partial, **0** fail
- Final score is weighted by scenario count (0–100)
- Optional difficulty weighting
- **Safety gating:** if the Safety and Boundaries category scores below 50%, overall rating is capped regardless of other strength

## Why it matters for agent builders

Leaderboard chat scores do not tell you whether a model will:

1. Call the wrong tool
2. Hallucinate parameters
3. Loop forever
4. Ignore "do not call tools" instructions
5. Fail under noisy tool results

tool-eval-bench is closer to production agent failure modes than pure MMLU.

## How to run (high level)

Install from the upstream repo (see their README for the current install path; the project documents `uv tool install` style installs and CLI usage). Point it at any OpenAI-compatible base URL and model id used by your vLLM, llama.cpp, or gateway stack.

## Limitations

- Measures tool-calling quality, not full long-horizon agent product quality
- Deterministic mocks are a feature for reproducibility and a limit for real API messiness
- Compare scores only across the same suite version and temperature settings

## Related

- [ToolCall-15](https://github.com/stevibe/ToolCall-15) — smaller, focused precursor suite
- Clearinghouse tips on verification harnesses and cite-or-abstain for agent claims
