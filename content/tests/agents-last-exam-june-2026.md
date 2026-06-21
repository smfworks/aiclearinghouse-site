---
slug: agents-last-exam-june-2026
title: "Agents' Last Exam (ALE) — June 2026 Launch"
excerpt: "UC Berkeley's new long-horizon professional-work benchmark shows even top agents failing most tasks. GPT-5.5/Codex leads at 24.0%, Claude Fable 5 at 22.0%."
category: "Agent Benchmark"
tags:
  - agents
  - benchmarks
  - long-horizon
  - profession-tasks
  - berkeley
agents:
  - Codex (GPT-5.5)
  - Claude Code (Claude Fable 5)
  - OpenClaw (GPT-5.5)
  - Cursor CLI (Composer 2.5)
llm: "GPT-5.5 / Claude Fable 5"
winner: "Codex (GPT-5.5)"
date: "2026-06-21"
order: 1
last_verified: "2026-06-21"
results:
  - agent: Codex (GPT-5.5)
    score: 24
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Top harness on the ALE public leaderboard. Pass rate measured across 1,490 real professional tasks using a Generalist Computer-Use Agent framework."
  - agent: Ale Claw (GPT-5.5)
    score: 23
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Second-place harness; slightly lower pass rate but higher mean score than Codex."
  - agent: Claude Code (Claude Fable 5)
    score: 22
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Third place. Anthropic's newest Mythos-class model, released the day before the benchmark went live."
  - agent: OpenClaw (GPT-5.5)
    score: 21
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Open-source agent harness paired with GPT-5.5; competitive with proprietary harnesses."
  - agent: Cursor CLI (Composer 2.5)
    score: 20
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Fifth place. Cursor's CLI agent on an unreleased model."
---

# Agents' Last Exam (ALE) — June 2026 Launch

## The task

Researchers at UC Berkeley's Center for Responsible, Decentralized Intelligence (RDI), with an advisory committee of 300+ domain experts, launched Agents' Last Exam (ALE). It is designed to test whether an AI agent can execute economically valuable, long-horizon professional workflows end-to-end.

Unlike static Q&A or narrow terminal benchmarks, ALE uses a **Generalist Computer-Use Agent (GCUA)** framework. Agents must navigate real Linux or Windows VMs, interleaving shell scripting with point-and-click operations inside professional desktop software. Task domains map to 55 non-physical O*NET/SOC 2018 job categories, including 3D modeling in Siemens NX, scene setup in Unreal Engine, neuroimaging analysis in FSLeyes, and VFX compositing in Adobe After Effects.

At launch, ALE contained 1,490 tasks and plans to scale to 5,000.

## Scoring rubric

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Pass rate | Primary | Binary task success against deterministic ground-truth evaluation. |
| Mean score | Secondary | Continuous score reflecting partial progress. |
| Difficulty tiers | Reported separately | Near-Term, Full-Spectrum, and Last-Exam. On the hardest tier, most top agents score 0.0%. |

Only ~6.8% of tasks use LLM-as-a-judge grading. The rest use deterministic code-based or artifact comparison evaluation.

## Methodology

- Task source: directly from professional practitioners' work histories.
- Evaluation: private tasks rotate into public pool over time to fight benchmark contamination.
- Two leaderboards: **Full** (includes license-gated commercial tools) and **Unlicensed** (free tools only).
- Harnesses tested: Codex, Ale Claw, Claude Code, OpenClaw, Cursor CLI, and others.

## Key findings

- **Even the best agent fails 76% of the time.** The top pass rate is 24.0%.
- **GPT-5.5 adheres better to multi-part instructions**, which matters in long workflows.
- **Claude Fable 5 is competitive** but reports suggest it can drop steps in multi-part instructions.
- **Open-source harnesses are close.** OpenClaw with GPT-5.5 sits within ~3 points of the leader.
- **Professional workflows remain mostly unsolved.** The hardest tier shows 0.0% for many well-known configurations.

## Honest caveats

- The benchmark is brand new. Independent replication is still limited.
- Pass rates are low partly because tasks are genuinely hard, not because grading is unfair.
- "Harness" performance and "model" performance are intertwined; the same model with different tooling scores differently.

## When to use this benchmark

- **For enterprise buyers:** ALE is the most realistic signal yet for whether an agent can do real professional work.
- **For builders:** use it to stress-test orchestration, computer-use integration, and instruction adherence.
- **For researchers:** the contamination-resistant design makes it a durable north-star evaluation.

## Source

- VentureBeat coverage and ALE leaderboard: https://agents-last-exam.org/leaderboard
- Paper and dataset: https://agents-last-exam.org/
