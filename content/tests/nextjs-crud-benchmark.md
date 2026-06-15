---
slug: nextjs-crud-benchmark
title: "Next.js CRUD App Benchmark"
excerpt: "Measured how long each agent takes to scaffold a working Next.js CRUD app with authentication."
category: "Coding Benchmark"
tags:
  - nextjs
  - crud
  - auth
  - agents
  - benchmark
agents:
  - Hermes Agent
  - Claude Code
  - OpenHands
  - Aider
llm: "Claude 4 Sonnet"
winner: "Claude Code"
date: "2026-06-01"
order: 1
last_verified: "2026-06-15"
results:
  - agent: Claude Code
    score: 92
    time_minutes: 18
    tokens: 145000
    cost_usd: 4.85
    pass: true
    notes: "Fastest complete implementation. Auth, CRUD, and basic UI all worked on first run."
  - agent: Aider
    score: 84
    time_minutes: 27
    tokens: 112000
    cost_usd: 2.40
    pass: true
    notes: "Excellent git-aware edits. Required one manual fix for NextAuth session typing."
  - agent: Hermes Agent
    score: 71
    time_minutes: 42
    tokens: 98000
    cost_usd: 1.95
    pass: true
    notes: "Got the structure right but needed guidance on Prisma schema and auth flow."
  - agent: OpenHands
    score: 58
    time_minutes: 55
    tokens: 210000
    cost_usd: 6.20
    pass: false
    notes: "Produced many files but missed the auth wiring. UI rendered but login failed."
---

# Next.js CRUD App Benchmark

## The task

Each agent was given the same prompt: scaffold a Next.js 14 app with Prisma, SQLite, NextAuth credentials-based auth, and full CRUD for a `Task` model. The app had to list, create, edit, and delete tasks, and protect all task routes behind authentication.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Runs without errors | 30% | 30 |
| Auth works end-to-end | 25% | 25 |
| All CRUD operations work | 25% | 25 |
| Code quality / structure | 10% | 10 |
| Time to first working build | 10% | 10 |

## Methodology

- Same starter repo template for every agent.
- Same prompt, no follow-up help unless the agent explicitly asked a clarifying question.
- Time measured from first prompt to `npm run build` succeeding.
- Each run used Claude 4 Sonnet where the agent supported model selection.

## Key findings

- **Claude Code** won on integration speed. Its diff-aware editing and test-running loop caught missing environment variables early.
- **Aider** was the most cost-effective. Slower than Claude Code but produced the cleanest git history and least rework.
- **Hermes Agent** needed more steering. Strong on structure, weaker on nuanced framework conventions.
- **OpenHands** spent a lot of tokens exploring. It generated many files but failed to connect auth to the task routes.

## Honest caveats

- We tested one representative task, not every Next.js pattern.
- Cost figures are approximate and include retries from the agent's own loop.
- Your mileage will vary based on how well your existing project matches the agent's training distribution.

## When to choose which

- **Claude Code**: complex greenfield apps where speed and correctness matter more than cost.
- **Aider**: existing codebases where you want surgical, reviewable edits.
- **Hermes Agent**: workflows where messaging, memory, or multi-step skills are the real requirement.
- **OpenHands**: research and experimentation; not yet our first choice for production scaffolding.
