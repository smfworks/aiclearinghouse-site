---
slug: glm-5-3-coding-agent-benchmark-august-2026
title: "GLM-5.3 vs Frontier Coding Agents: Terminal-Bench 3.0 Showdown"
excerpt: "GLM-5.3's post-training gains push Terminal-Bench 3.0 from 4.6 to 28.3 — but how does it compare to Fable 5 and GPT-5.6 Sol on independent benchmarks?"
category: "Coding Agent Benchmark"
tags:
  - benchmark
  - coding
  - agents
  - terminal-bench
  - open-weight
agents:
  - GLM-5.3
  - Claude Fable 5
  - GPT-5.6 Sol
llm: "Multiple"
winner: "Claude Fable 5"
date: "2026-08-19"
order: 99
last_verified: "2026-08-19"
results:
  - agent: GLM-5.3
    score: 1769
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "GDPval-AA v2 score (independently scored by Artificial Analysis). Terminal-Bench 3.0 jumped from 4.6 (GLM-5.2) to 28.3. Same 743B base model — all gains from post-training."
  - agent: Claude Fable 5
    score: 1743
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "GDPval-AA v2 score. Leads SWE-bench Pro at 80.0 — the honest weak spot for GLM-5.3. Fable 5 results may involve fallbacks per Alibaba's footnote."
  - agent: GPT-5.6 Sol
    score: 1730
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "GDPval-AA v2 score. Leads Terminal-Bench 2.1 at 88.8 (max). SWE-bench Pro at 64.6 — behind both GLM-5.3 and Fable 5."
---

# GLM-5.3 vs Frontier Coding Agents: Terminal-Bench 3.0 Showdown

## What it is

A comparison of the three leading coding agents as of August 2026, using the one independently scored benchmark available on GLM-5.3's launch day: GDPval-AA v2, scored by Artificial Analysis (not by any of the model vendors).

## Why this benchmark matters

Most coding agent benchmark numbers are vendor-reported. GLM-5.3's internal Code Bench and in-harness cyber scores are all Z.ai-run. Claude Fable 5's numbers come from Anthropic. GPT-5.6 Sol's come from OpenAI. The one row that is worth more than the rest combined is GDPval-AA v2 — because Artificial Analysis ran it independently across all three models.

## Results

| Agent | GDPval-AA v2 | Terminal-Bench 3.0 | SWE-bench Pro | Notes |
|-------|-------------|-------------------|---------------|-------|
| GLM-5.3 | **1769** | 28.3 (vendor) | ~67 (est.) | Same base as GLM-5.2; all gains from post-training. Weights not yet open. |
| Claude Fable 5 | 1743 | 84.6 (vendor) | **80.0** (vendor) | Strongest on deep engineering work. Fallback caveat noted by Alibaba. |
| GPT-5.6 Sol | 1730 | **88.8** (vendor, max) | 64.6 (vendor) | Leads terminal tasks but trails on SWE-bench Pro. |

## Key findings

1. **GLM-5.3 wins the independent row.** GDPval-AA v2 at 1769 puts it ahead of both Western flagships — and this is the one number not run by the model's own vendor.
2. **Terminal-Bench 3.0 jump is real but vendor-reported.** GLM-5.3 went from 4.6 to 28.3 on Terminal-Bench 3.0 — a massive jump, but Z.ai ran this benchmark themselves. Independent replication pending.
3. **Fable 5 still leads on deep engineering.** SWE-bench Pro at 80.0 is the honest weak spot for both GLM-5.3 and GPT-5.6 Sol. If your agents do deep codebase work, Fable 5 remains the pick.
4. **GPT-5.6 Sol leads on terminal tasks.** Terminal-Bench 2.1 at 88.8 (max) is the highest score, but this is a vendor-reported max configuration.
5. **Price matters.** GLM-5.3 at $0.80/$3.00 per 1M tokens is roughly 6x cheaper than GPT-5.6 Sol and 10x cheaper than Fable 5. The independent benchmark lead at that price point is remarkable.

## Caveats

- **Weights not yet open**: GLM-5.3's weights are expected end of August 2026. Until then, API-only — and API results may differ from self-hosted.
- **Vendor benchmarks dominate**: Only GDPval-AA v2 is independently scored. Terminal-Bench and SWE-bench numbers are vendor-run and may involve different harnesses, tool configurations, and sampling.
- **Fallback caveat**: Alibaba's own benchmark table notes Fable 5 results "may involve fallbacks" — this affects the validity of the SWE-bench Pro comparison.
- **Pass-k not measured**: These are single-run scores. Pass^4 reliability — the metric that matters for production — is not yet available for GLM-5.3.

## When to use this comparison

Use this benchmark to decide which coding agent to try for your workflow. For terminal-heavy agent tasks at low cost, GLM-5.3 is the leading candidate. For deep codebase engineering, Fable 5 remains the pick. For maximum terminal performance regardless of cost, GPT-5.6 Sol leads.

Do not use this as your only evaluation. Run your own tasks through each model before committing — vendor benchmarks and even independent benchmarks do not predict your specific workload perfectly.