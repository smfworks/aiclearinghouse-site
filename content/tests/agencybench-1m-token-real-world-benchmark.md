---
slug: agencybench-1m-token-real-world-benchmark
title: "AgencyBench: 1M-Token Real-World Agent Benchmark (138 Tasks, 32 Scenarios)"
excerpt: "A comprehensive benchmark where agents tackle 138 real-world tasks across 32 scenarios — averaging 90 tool calls, 1M tokens, and hours of execution per task, with Docker sandbox evaluation."
category: "Real-World Agent Benchmark"
tags:
  - benchmark
  - agents
  - long-horizon
  - tool-use
  - evaluation
  - real-world
agents:
  - Various LLM agents (model-agnostic)
llm: "Multiple (benchmark is model-agnostic)"
winner: "Benchmark framework, not a single model"
date: "2026-09-16"
order: 99
last_verified: "2026-09-16"
results:
  - agent: AgencyBench (benchmark framework)
    score: null
    time_minutes: null
    tokens: 1000000
    cost_usd: null
    pass: true
    notes: "138 tasks across 32 scenarios. Avg 90 tool calls, 1M tokens, hours of execution per task. Docker sandbox + user simulation agent for automated evaluation."
---

# AgencyBench: 1M-Token Real-World Agent Benchmark

## What it tests

AgencyBench, from GAIR-NLP (arXiv:2601.11044), is a comprehensive benchmark designed to evaluate agent capabilities through **highly long-horizon, diverse, and authentic real-world tasks**. It evaluates 6 core agentic capabilities across 32 real-world scenarios, comprising 138 tasks with specific queries, deliverables, and rubrics.

The six capabilities:

1. **Game development** (36.2% of tasks) — board, puzzle, arcade, action, casual games
2. **Code generation** (21.0%)
3. **Front-end development** (10.9%)
4. **Back-end development** (10.9%)
5. **Research** (13.8%)
6. **MCP tool use** (7.2%)

## Why it is different

Existing agent benchmarks focus on single agentic capabilities and short interactions. AgencyBench captures **long-horizon real-world scenarios**:

| Benchmark | Avg Tokens | Avg Turns | Diverse Agentic | User Sim. | Docker Sandbox |
|-----------|-----------|-----------|-----------------|-----------|----------------|
| BrowseComp | — | — | No | No | No |
| Terminal-bench | — | — | No | No | No |
| SWE-verified | — | 15 | No | No | Yes |
| MCPUniverse | — | 7.5 | No | No | No |
| GAIA2 | 10K | 22.5 | Yes | No | No |
| Toolathlon | 15K | 26.8 | Yes | No | Yes |
| UltraHorizon | 200K | 60 | Yes | No | No |
| **AgencyBench** | **1M** | **90** | **Yes** | **Yes** | **Yes** |

AgencyBench is the only benchmark that combines million-token contexts, 90 average tool calls, diverse agentic capabilities, user simulation, AND Docker sandbox evaluation.

## How evaluation works

### Workspace + Eval-space + Scaffold

Each task operates within an **isolated workspace** to ensure reproducibility and prevent state interference. The evaluation framework is entirely rubric-based:

1. **User Simulation Agent**: Provides iterative feedback to the agent during task execution, simulating real client interactions
2. **Docker-based remote sandbox**: Conducts visual and functional rubric-based assessment
3. **Text and vision agents**: Evaluate code and visual deliverables respectively, providing scores and qualitative feedback

### Automated evaluation

The user simulation agent serves as a reliable surrogate for human experts. The final average score reached 4.69 (on a rubric scale), demonstrating high alignment with human judgment — meaning the automated evaluation can replace human-in-the-loop processes for scaling.

## Why it matters

- **Real-world authenticity**: Tasks are derived from daily AI usage, not synthetic scenarios
- **Long-horizon stress test**: 1M tokens and 90 tool calls per task exposes failures that short benchmarks miss — context degradation, tool-call inconsistency, trajectory errors
- **Automated evaluation**: The user simulation agent + Docker sandbox means the benchmark can scale without human graders
- **MCP tool use included**: One of the few benchmarks that evaluates MCP-specific agent capabilities
- **Open toolkit**: Full benchmark and evaluation toolkit released at [github.com/GAIR-NLP/AgencyBench](https://github.com/GAIR-NLP/AgencyBench)

## Limitations

- **Resource intensive**: Running 138 tasks at 1M tokens each requires significant compute and time
- **Rubric-based scoring**: Depends on the quality of the rubrics and the text/vision evaluation agents
- **Game development heavy**: 36.2% of tasks are game development, which may skew results for teams focused on other domains
- **User simulation is not real users**: The simulation agent is a proxy, not identical to real end-user feedback

## What this means for agent builders

If your agent passes SWE-bench but fails AgencyBench, you have a long-horizon problem: context management, tool-call consistency, or trajectory planning. AgencyBench is the benchmark to run when you need to know whether your agent can handle real-world, multi-hour, multi-tool tasks — not just isolated coding challenges.

The Docker sandbox and user simulation agent mean you can run it in CI without human graders, making it suitable for regression testing as you iterate on your agent stack.