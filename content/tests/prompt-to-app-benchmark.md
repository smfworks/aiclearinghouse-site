---
slug: prompt-to-app-benchmark
title: "Prompt-to-App Benchmark"
excerpt: "Measured how far four no-code agents get from a single prompt: a task tracker with auth and a database."
category: "No-Code Benchmark"
tags:
  - no-code
  - vibe-coding
  - auth
  - database
  - agents
  - benchmark
agents:
  - Bolt.new
  - Lovable
  - Replit Agent
  - v0
llm: "Mixed"
winner: "Lovable"
date: "2026-06-10"
order: 3
last_verified: "2026-06-15"
results:
  - agent: Lovable
    score: 88
    time_minutes: 14
    tokens: 0
    cost_usd: 8.00
    pass: true
    notes: "Working UI, auth, and Supabase schema in one shot. Best prompt-to-deploy experience."
  - agent: Bolt.new
    score: 82
    time_minutes: 18
    tokens: 0
    cost_usd: 12.00
    pass: true
    notes: "Very close second. Burned more tokens refining the UI beyond the prompt scope."
  - agent: Replit Agent
    score: 74
    time_minutes: 25
    tokens: 0
    cost_usd: 5.50
    pass: true
    notes: "Handled deployment end-to-end. UI was functional but least polished."
  - agent: v0
    score: 65
    time_minutes: 35
    tokens: 0
    cost_usd: 0.00
    pass: false
    notes: "Outstanding frontend generation. Required manual backend wiring; not a full-stack one-shot."
---

# Prompt-to-App Benchmark

## The task

We gave four no-code / low-code agents the same one-paragraph prompt:

> Build a task tracker app. Users sign up, sign in, add tasks, mark them complete, and delete them. Store tasks in a real database. Deploy it.

No follow-up prompts. The agents had to infer the stack, design the UI, wire auth, and produce a live URL.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Working deployed URL | 30% | 30 |
| Auth works | 25% | 25 |
| Database persists tasks | 20% | 20 |
| UI quality | 15% | 15 |
| Cost / speed | 10% | 10 |

## Methodology

- Same prompt, no screenshots, no clarification.
- Time measured from prompt submission to a deployable / deployed app.
- We manually tested signup, login, add task, complete task, delete task, and refresh persistence.
- Token counts are not applicable because these platforms abstract the LLM layer; costs are platform estimates.

## Key findings

- **Lovable** delivered the cleanest end-to-end experience. It chose Supabase, built a reasonable schema, and deployed without manual steps.
- **Bolt.new** produced excellent code but overshot on UI polish. It kept refining visual details after the core app already worked.
- **Replit Agent** was the most deployment-native. The app was live in Replit immediately, though the interface was plain.
- **v0** generated the best-looking UI components but is not a full-stack one-shot tool. It left backend wiring to the user.

## Honest caveats

- These platforms change fast. Results may shift within weeks.
- Cost estimates include platform subscription or usage tiers, not just LLM tokens.
- "Pass" means the core flow worked, not that the app was production-ready.

## When to choose which

- **Lovable**: fastest path from idea to live full-stack app.
- **Bolt.new**: when you want generated code you can later export and own.
- **Replit Agent**: when deployment and sharing are the priority.
- **v0**: when you already have a backend and need a polished frontend quickly.
