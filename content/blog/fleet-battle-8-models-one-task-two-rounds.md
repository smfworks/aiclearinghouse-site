---
slug: "fleet-battle-8-models-one-task-two-rounds"
title: "Fleet Battle: 8 Models, 1 Task, 2 Rounds"
excerpt: "We ran the same complex multi-part prompt across 8 cloud model backends through Ollama proxies. Five models scored perfect. One failed before producing a single token. The real story is in the failure modes."
date: "2026-08-06"
author: "Dr J"
authorKey: "drj"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Benchmark", "SMF Works"]
tags: ["ollama", "cloud-llm", "fleet-battle", "model-comparison"]
readTime: 12
image: "/images/blog/fleet-battle-8-models-one-task-two-rounds.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/fleet-battle-8-models-one-task-two-rounds"
---

## Why This Matters

Most model comparisons run canned benchmarks behind clean API endpoints. We wanted something messier: the same complex prompt sent to 8 different cloud model backends through Ollama's proxy layer, scored on whether they could actually deliver a multi-part response that holds together.

The question is not "which model is best." It is: when you wire heterogeneous cloud backends into the same agent infrastructure, which ones hold up under a realistic mixed task — and which ones break in ways that matter?

## The Setup

**Infrastructure:** All models accessed via Ollama's `:cloud` proxy tags on the same local Ollama instance. No direct API calls to model providers. This is the real path agent code takes.

**Models tested (8):**

- **GLM-5.2** (glm-5.2:cloud)
- **Kimi K2.7 Code** (kimi-k2.7-code:cloud)
- **Kimi K3** (kimi-k3:cloud)
- **MiniMax M3** (minimax-m3:cloud)
- **Nemotron 3 Ultra** (nemotron-3-ultra:cloud)
- **DeepSeek V4 Flash** (deepseek-v4-flash:cloud)
- **DeepSeek V4 Pro** (deepseek-v4-pro:cloud)
- **Gemma 4 31B** (gemma4:31b-cloud)

**Controls:** Same prompt, same `max_tokens=4096`, same `temperature=0.3`, same Ollama endpoint, back-to-back runs. Each model got one shot per round — no retries, no cherry-picking.

**Scoring:** Automated rubric checking for section completion, code quality indicators (type hints, docstrings, edge cases), bug identification accuracy, security vulnerability identification, and trade-off analysis completeness.

## Round 1: DevOps Multi-Task

The prompt asked for four things in a single response: explain blue-green vs canary deployment (research), write a Python function with type hints and edge case handling (code), identify and fix a bug in a rolling update function (debug), and summarize deployment best practices (report).

**Results:**

- **Kimi K2.7 Code:** 100/100 — 17.2s, 1428 tokens. Identified the rolling-update bug correctly.
- **MiniMax M3:** 100/100 — 43.6s, 2724 tokens. Most verbose, included a comparison table.
- **Nemotron 3 Ultra:** 100/100 — 42.8s, 1311 tokens. Concise, correct bug identification.
- **DeepSeek V4 Flash:** 100/100 — 12.2s, 1179 tokens. Fast, efficient, correct.
- **DeepSeek V4 Pro:** 100/100 — 9.3s, 1420 tokens. Fastest in Round 1, correct.
- **GLM-5.2:** 90/100 — 14.6s, 2606 tokens. Completed all sections but **missed the rolling-update bug** — identified a rollback issue instead of the core problem (all instances replaced before any health check).
- **Gemma 4 31B:** 90/100 — 10.8s, 688 tokens. Most token-efficient but also **missed the bug**. No reasoning tokens produced — this model has no internal reasoning capability.
- **Kimi K3:** 0/100 — HTTP 402 Payment Required. Account credits exhausted. Zero output.

## Round 2: Distributed Systems & Security

Harder prompt: design a distributed rate limiter (system design), write a thread-safe sliding window log class (code), identify a SQL injection vulnerability (security), and explain when to choose sliding window over fixed window (trade-off analysis).

**Results:**

- **GLM-5.2:** 100/100 — 13.2s, 1931 tokens. Perfect across all categories. Recovered from Round 1's bug miss with strong security identification and thread-safe implementation.
- **MiniMax M3:** 100/100 — 26.8s, 3125 tokens. Perfect again. Most verbose model in the fleet.
- **Nemotron 3 Ultra:** 100/100 — 38.0s, 1973 tokens. Consistent perfection, slow but correct.
- **DeepSeek V4 Flash:** 100/100 — 9.5s, 1696 tokens. Perfect and fast.
- **Gemma 4 31B:** 100/100 — 15.4s, 836 tokens. Perfect with the fewest tokens of any model. No reasoning capability but nailed the security and trade-off sections.
- **DeepSeek V4 Pro:** 93/100 — 9.8s, 1446 tokens. Minor deduction in code quality (missing one type hint indicator) and trade-off (less specific downside naming). Still strong.
- **Kimi K2.7 Code:** 75/100 — 42.6s, 4096 tokens. **Hit the token limit** (`finish_reason: length`) after spending 15,569 tokens on hidden reasoning. The visible output was truncated before reaching the trade-off analysis section. Scored 0/25 on trade-off.
- **Kimi K3:** Not tested — still HTTP 402.

## The Combined Scorecard

**Perfect across both rounds (200/200):**

- **MiniMax M3** — 200/200, 5849 total tokens, 70.4s combined
- **Nemotron 3 Ultra** — 200/200, 3284 total tokens, 80.8s combined
- **DeepSeek V4 Flash** — 200/200, 2875 total tokens, 21.7s combined

**Near-perfect (190/200):**

- **GLM-5.2** — 190/200, 4537 total tokens, 27.8s combined
- **Gemma 4 31B** — 190/200, 1524 total tokens, 26.2s combined

**Strong but flawed (193/200):**

- **DeepSeek V4 Pro** — 193/200, 2866 total tokens, 19.2s combined (fastest)

**Failed:**

- **Kimi K2.7 Code** — 175/200, 5524 total tokens. Perfect Round 1, collapsed in Round 2 due to reasoning-token overflow.
- **Kimi K3** — 0/200. HTTP 402. Account billing issue, not a model issue.

## The Findings That Matter

### 1. The Thinking-Budget Cliff

Kimi K2.7 Code spent **15,569 tokens on hidden reasoning** in Round 2 — more than 3x the visible output tokens. The response hit the 4096 `max_tokens` limit before the model could complete all four sections. The trade-off analysis section was never written.

This is the same pattern seen in prior benchmarks: models with internal reasoning capabilities can burn through their token budget on thinking and arrive at the answer — but never write it down. If you are wiring these models into agent infrastructure, you need to either raise `max_tokens` significantly for reasoning models or accept that complex multi-part prompts will get truncated.

**The fix:** For reasoning models, set `max_tokens = THINK_RESERVE + VISIBLE_BUDGET` where `THINK_RESERVE` accounts for internal reasoning. For Kimi K2.7 Code, `THINK_RESERVE=4000` and `VISIBLE_BUDGET=4096` (so `max_tokens=8096`) would have given enough room.

### 2. No Reasoning Does Not Mean No Quality

Gemma 4 31B produced **zero reasoning tokens** across both rounds — it has no internal reasoning capability. Yet it scored 190/200, matching GLM-5.2 (which produced 12,736 reasoning tokens across both rounds) and beating DeepSeek V4 Pro (193/200 with 5,728 reasoning tokens).

Gemma was also the most token-efficient model in the fleet by a wide margin: 1,524 total output tokens across both rounds vs the fleet average of 3,753. It produced clean, correct, concise answers without thinking out loud.

**The takeaway:** For straightforward coding and security tasks, reasoning capability does not necessarily improve output quality. It increases token consumption and latency without a measurable accuracy gain. Reasoning models earn their keep on harder problems — not on tasks that any competent model can solve.

### 3. Speed Does Not Predict Quality

DeepSeek V4 Pro was the fastest model in both rounds (9.3s and 9.8s) but scored 193/200 — lower than three models that were 2-4x slower. MiniMax M3 was the slowest successful model (43.6s in Round 1) but scored a perfect 200/200.

The fleet splits into three speed tiers:

- **Fast (under 15s per round):** DeepSeek V4 Flash, DeepSeek V4 Pro, Gemma 4 31B, GLM-5.2
- **Medium (15-30s):** Kimi K2.7 Code (R1), MiniMax M3 (R2), Gemma 4 31B (R2)
- **Slow (30s+):** MiniMax M3 (R1), Nemotron 3 Ultra

Speed correlates with model size and infrastructure, not with accuracy. The fastest perfect model (DeepSeek V4 Flash at 21.7s combined) and the slowest perfect model (Nemotron 3 Ultra at 80.8s combined) scored identically.

### 4. The Proxy Layer Is Part of the Test

Kimi K3 returned HTTP 402 — Payment Required — through the Ollama cloud proxy. This is not a model quality issue. It is an infrastructure reality: cloud proxy backends have account limits, and they fail without warning.

In a production agent fleet, this would surface as a silent model failure. The agent would receive an empty response, potentially retry, and burn cycles on a backend that cannot serve. A fleet health check that probes each `:cloud` model for a 200 response before routing work to it would catch this before it becomes a user-visible failure.

### 5. Bug Identification Is the Weak Point

Two models (GLM-5.2 and Gemma 4 31B) scored 90/100 in Round 1 because they failed to identify the core bug in the rolling update function. The bug: the function replaces all instances with `new_version` before checking health, so a failure mid-loop leaves the fleet in a partially-updated state.

GLM-5.2 identified a rollback issue instead. Gemma 4 31B identified a similar but wrong problem. Both produced correct code, correct security analysis, and correct deployment explanations — but the debugging section is where the reasoning gap showed.

In Round 2, both models recovered with perfect scores on the SQL injection identification. The Round 1 bug was subtle (required understanding of state mutation across loop iterations); the Round 2 vulnerability was textbook (string interpolation in SQL).

**The pattern:** Models without reasoning capability (Gemma) or with moderate reasoning (GLM-5.2) handle textbook security issues well but struggle with subtle logic bugs that require tracing state through code. Reasoning-heavy models (Kimi K2.7, MiniMax M3, Nemotron 3 Ultra) caught the subtle bug in Round 1 — but Kimi paid for it with a token overflow in Round 2.

## What This Means for Agent Fleet Operators

- **DeepSeek V4 Flash is the efficiency champion.** Perfect scores, fast, low token count. If you need a reliable workhorse for coding and analysis tasks, this is the default choice.
- **MiniMax M3 is the thoroughness champion.** Perfect scores, most verbose, includes comparison tables and richer formatting. Use when output quality matters more than speed or cost.
- **Gemma 4 31B is the budget champion.** Near-perfect scores with the fewest tokens. No reasoning overhead. Ideal for high-volume, straightforward tasks.
- **Kimi K2.7 Code needs a bigger token budget.** Its reasoning is excellent but it will eat through 4096 tokens on thinking alone for complex prompts. Raise `max_tokens` or use it for single-task prompts where it can focus.
- **Kimi K3 needs a billing check.** The model itself may be fine — the proxy account is exhausted. Always probe cloud backends before routing production work.
- **GLM-5.2 is solid but has a reasoning gap on subtle bugs.** Strong on security, code quality, and system design. Weaker on debugging tasks that require tracing state through code.

## Reproducibility

The test harness and raw results are available. To reproduce:

```bash
# Prerequisites: Ollama running locally with cloud proxy models configured
# The test script sends identical prompts to each model via the Ollama API

# Run Round 1 (DevOps multi-task)
python3 fleet_battle_r1.py

# Run Round 2 (Distributed systems & security)
python3 fleet_battle_r2.py
```

**Environment:** Ollama with cloud proxy tags, `max_tokens=4096`, `temperature=0.3`, single-shot per model per round (no retries). Total wall time: approximately 5 minutes across both rounds.

**Raw data:** Full JSON results for both rounds including complete model responses, token counts, reasoning token counts, and per-category scoring are saved in the fleet-battle results directory.

## What I Would Do Next

1. **Add a Round 3 with executable code testing.** The current rubric checks for code quality indicators but does not execute the generated code. A Docker-sandboxed execution pass (the EvalPlus pattern) would catch runtime errors that static analysis misses.
2. **Test with raised `max_tokens` for reasoning models.** Give Kimi K2.7 Code `max_tokens=8192` and re-run Round 2. If it completes all four sections, the thinking-budget cliff hypothesis is confirmed.
3. **Add a multi-turn conversation round.** Both rounds were single-shot. Agent infrastructure relies on multi-turn context — a Round 3 that requires the model to maintain context across 3-4 turns would surface different failure modes.

## Byline

Dr J does not trust leaderboard numbers. He runs the same prompt through the same proxy layer and publishes the raw results — including the HTTP 402.