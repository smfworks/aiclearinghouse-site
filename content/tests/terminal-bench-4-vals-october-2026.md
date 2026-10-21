---
slug: terminal-bench-4-vals-october-2026
title: "Terminal-Bench 4.0 on Vals, October 19 snapshot"
excerpt: "Vals updated Terminal-Bench 4.0 on October 19, 2026. Mini-SWE-agent, avg@3, no partial credit. Claude Opus 5.5 leads at 65.15%. That is not the September Codex card."
category: "Agent Benchmark"
tags:
  - benchmark
  - terminal
  - agents
  - coding
agents:
  - Mini-SWE-agent
llm: "Claude Opus 5.5, Claude Sonnet 5.5, GPT-6 Astra, Claude Fable 5.1, Wonder Full, Gemini 4 Argon"
winner: "Claude Opus 5.5 (Mini-SWE-agent)"
date: "2026-10-19"
order: 99
last_verified: "2026-10-21"
results:
  - agent: Claude Opus 5.5 (Mini-SWE-agent)
    score: 65.15
    time_minutes: 64
    tokens: 0
    cost_usd: 13.20
    pass: true
    notes: "Rank 1 on the October 19, 2026 Vals page. 65.15%. Cost per test $13.20. Listed token rates $4 / $20. Duration 1h04m. Tokens were not on the row, so tokens is 0 here rather than a guess."
  - agent: Claude Sonnet 5.5 (Mini-SWE-agent)
    score: 64.14
    time_minutes: 82
    tokens: 0
    cost_usd: 16.51
    pass: true
    notes: "Rank 2. 64.14%. $16.51 per test. $2 / $10. Duration 1h22m."
  - agent: GPT-6 Astra (Mini-SWE-agent)
    score: 59.60
    time_minutes: 35
    tokens: 0
    cost_usd: 9.58
    pass: true
    notes: "Rank 3. 59.60%. $9.58 per test. $10 / $50. Duration 35m42s. time_minutes drops the 42 seconds."
  - agent: Claude Fable 5.1 (Mini-SWE-agent)
    score: 58.08
    time_minutes: 60
    tokens: 0
    cost_usd: 17.18
    pass: true
    notes: "Rank 4. 58.08%. $17.18 per test. $10 / $50. Duration 1h00m."
  - agent: Wonder Full (Mini-SWE-agent)
    score: 58.08
    time_minutes: 72
    tokens: 0
    cost_usd: 10.53
    pass: true
    notes: "Rank 5. 58.08%, tied on the printed score with Fable 5.1 and ranked below it on the page. $10.53 per test. $4 / $20. Duration 1h12m."
  - agent: Gemini 4 Argon (Mini-SWE-agent)
    score: 57.58
    time_minutes: 53
    tokens: 0
    cost_usd: 17.64
    pass: true
    notes: "Rank 6. 57.58%. $17.64 per test. $4 / $20. Duration 53m35s. time_minutes drops the 35 seconds."
---

# Terminal-Bench 4.0 on Vals, October 19 snapshot

## Read this before you quote a winner

The page at https://www.vals.ai/benchmarks/terminal-bench-4 says it was updated 10/19/2026. The harness on every row below is Mini-SWE-agent. The score is avg@3: three full runs, each scored pass@1, then the mean of those three run scores. A task gets credit only if the verifier's full test suite passes. There is no partial credit.

This directory did not run the benchmark. The numbers are Vals' rows, copied from that page on October 21, 2026.

If you already have the September card `terminal-bench-4-september-2026`, don't merge the two tables. That card's top row is Codex plus GPT-6 Astra at 58.2%. This page's top row is Mini-SWE-agent plus Claude Opus 5.5 at 65.15%. Same benchmark name, different harness. A higher number on this page is not a win over the September Codex run.

## The top six rows

| Rank | Model | Score | Cost / test | Token rates | Duration |
|------|-------|------:|------------:|-------------|----------|
| 1 | Claude Opus 5.5 | 65.15% | $13.20 | $4 / $20 | 1h04m |
| 2 | Claude Sonnet 5.5 | 64.14% | $16.51 | $2 / $10 | 1h22m |
| 3 | GPT-6 Astra | 59.60% | $9.58 | $10 / $50 | 35m42s |
| 4 | Claude Fable 5.1 | 58.08% | $17.18 | $10 / $50 | 1h00m |
| 5 | Wonder Full | 58.08% | $10.53 | $4 / $20 | 1h12m |
| 6 | Gemini 4 Argon | 57.58% | $17.64 | $4 / $20 | 53m35s |

Opus 5.5 and Sonnet 5.5 are a point apart. Sonnet's listed per-test cost on this page is higher ($16.51 vs $13.20) even though its token rates are lower ($2 / $10 vs $4 / $20). The page is charging you for what the run consumed, not for the rate card alone. GPT-6 Astra is third on accuracy and the cheapest of these six at $9.58 a test, and it finished in 35m42s.

Token counts were not on these rows. The results block uses 0 so a blank doesn't get filled in later by a guess.

## What the page says the test is

Vals describes Terminal-Bench 4.0 as 66 community-contributed, maintainer-reviewed tasks. None of them appear in Terminal-Bench 2.1. Their 2.1 results used the Terminus 2 harness and 89 tasks. This page uses mini-swe-agent. Daytona sandboxes and pass@1 scoring are the same, in their comparison section.

Category counts I could read on this fetch: Software 18, Science 14, ML 11, Operations 9, Hardware 5. The page says there are seven categories and later names security and media along with the others. I did not copy task counts for security or media from this fetch, so those two stay out of the table.

Each task allows the agent 8 hours. The verifier has its own timeout. An agent that exceeds the limit, or a verifier that can't score the submission, gets zero for that task. Three tasks require a GPU. The page says those still run in the Daytona setup.

## What to do with the number

Pick the harness you will actually run, then read the row for that harness. If your agent is Mini-SWE-agent, start with this page. If your agent is Codex or Claude Code, the September card is the closer document, and it is a different measurement.

Don't average 65.15 and 58.2. They are not two attempts at the same job.

## Source

- https://www.vals.ai/benchmarks/terminal-bench-4 — updated 10/19/2026, read October 21, 2026
- The page links the upstream project at https://www.tbench.ai/. This card did not re-fetch that site.
