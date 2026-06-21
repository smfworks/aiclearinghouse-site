---
slug: swe-bench-verified-june-2026
title: "SWE-bench Verified Leaderboard — June 2026"
excerpt: "Real-world coding benchmark update: Claude Mythos 5 takes the top spot at ~78%, DeepSeek V4.1 Pro sits within 6 points of frontier closed models."
category: "Coding Benchmark"
tags:
  - coding
  - benchmarks
  - github
  - agents
  - swebench
agents:
  - Claude Mythos 5
  - Claude Opus 4.7
  - GPT-5.6 Pro
  - GPT-5.6
  - DeepSeek V4.1 Pro
  - Qwen 3.7
llm: "Multiple"
winner: "Claude Mythos 5"
date: "2026-06-21"
order: 2
last_verified: "2026-06-21"
results:
  - agent: Claude Mythos 5
    score: 78
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Top score on SWE-bench Verified as of June 2026. Took the lead from Claude Opus 4.7."
  - agent: Claude Opus 4.7
    score: 75
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Previous leader. Still within 3 points of the top."
  - agent: GPT-5.6 Pro
    score: 73
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "OpenAI's strongest coding-oriented configuration on this snapshot."
  - agent: GPT-5.6
    score: 70
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Base GPT-5.6 configuration; strong but below its Pro variant."
  - agent: DeepSeek V4.1 Pro
    score: 69
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Open-weight model within ~6 points of the closed-model leader."
  - agent: Claude Sonnet 4.6
    score: 68
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Mid-tier Claude Sonnet; competitive on cost-to-capability ratio."
  - agent: Qwen 3.7
    score: 66
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Leads the Chinese-frontier model set on this coding evaluation."
---

# SWE-bench Verified Leaderboard — June 2026

## The task

SWE-bench Verified is a curated subset of real GitHub issues from popular Python repositories. The benchmark measures whether an agent can reproduce a bug, implement a fix, and pass the repository's own test suite end-to-end. It is the most-cited real-world coding benchmark for frontier LLMs.

The June 2026 leaderboard snapshot shows the top of the field clustered within a 12-point band, with open-weight models now within single digits of the frontier.

## Scoring rubric

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Resolved issue rate | 100% | Percentage of benchmark instances where the agent's patch passes all tests. |

Scores are rounded/directional; treat as approximate pending independent verification.

## Methodology

- Source: vendor disclosures, public SWE-bench Verified leaderboard at swebench.com, and third-party replication where available.
- Updated monthly by Presenc AI.
- Scores reflect the strongest reported configuration for each model/agent pairing.

## Key findings

- **Claude Mythos 5 GA** takes the top spot at ~78%, displacing Claude Opus 4.7.
- **DeepSeek V4.1 Pro** closes the gap: open-weight performance is now ~6 points behind the leader.
- **Qwen 3.7** leads the Chinese frontier set on coding tasks.
- **GPT-5.6 Pro** is competitive at ~73%, but lags Anthropic's top Claude variants on this benchmark.
- The gap between top closed and top open-weight models has narrowed to single digits over the last 12 months.

## Honest caveats

- Scores are vendor-reported or aggregated; independent replication is limited.
- Scaffold and tool access heavily influence results. The same model with different agent tooling may score differently.
- SWE-bench focuses on Python open-source bugs; it does not cover proprietary codebases, security fixes, or cross-language maintenance.

## When to choose which

- **Claude Mythos 5 / Opus 4.7:** highest reported success rate on real GitHub issues; best for high-stakes code repair.
- **DeepSeek V4.1 Pro:** strong open-weight option when data residency or cost matters.
- **Qwen 3.7:** strong option for Chinese-language or regionally hosted deployments.
- **GPT-5.6 Pro:** good balance of general capability and coding; verify in your own stack before betting on it.

## Source

- Presenc AI June 2026 snapshot: https://presenc.ai/research/swe-bench-verified-leaderboard-june-2026
- Official leaderboard: https://www.swebench.com/
