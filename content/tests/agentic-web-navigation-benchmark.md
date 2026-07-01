---
slug: agentic-web-navigation-benchmark
title: "Agentic Web Navigation Benchmark"
excerpt: "Tests how well agents can navigate real websites: find information, fill forms, click buttons, and recover from common UI changes."
category: "Integration Benchmark"
tags:
  - web
  - browser
  - agents
  - benchmark
agents:
  - Claude Code
  - OpenClaw
  - Manus
  - Devin
llm: "Multiple"
winner: "Manus"
date: "2026-07-01"
order: 17
last_verified: "2026-07-01"
results:
  - agent: Manus
    score: 79
    time_minutes: 24
    tokens: 82000
    cost_usd: 4.50
    pass: true
    notes: "Best end-to-end task completion on unfamiliar sites; recovered from layout changes well."
  - agent: Devin
    score: 72
    time_minutes: 31
    tokens: 94000
    cost_usd: 5.20
    pass: true
    notes: "Strong planner but slower; handled structured forms better than dynamic pages."
  - agent: Claude Code
    score: 65
    time_minutes: 27
    tokens: 61000
    cost_usd: 2.90
    pass: false
    notes: "Good when given exact instructions; struggled with exploration and recovery."
  - agent: OpenClaw
    score: 58
    time_minutes: 35
    tokens: 55000
    cost_usd: 1.60
    pass: false
    notes: "Relied on provided browser tools; needs tighter integration for open-ended navigation."
---

# Agentic Web Navigation Benchmark

## The task

We asked each agent to complete five realistic web tasks on live sites:

1. Find a specific product on an e-commerce site and add it to cart.
2. Book a meeting slot on a scheduling page.
3. Locate a buried policy document and extract a clause.
4. Submit a support ticket with the correct category.
5. Recover from a 404 by finding the moved page.

Agents were scored on task completion, correctness, and whether they handled errors gracefully.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Task completion | 50% | 50 |
| Correct data extracted/entered | 25% | 25 |
| Error recovery | 15% | 15 |
| Efficiency | 10% | 10 |

## Methodology

- Live sites, not mock pages.
- Agents used browser tools or built-in web access.
- Each task was attempted up to three times; best run scored.
- We did not modify sites; real-world variability is part of the test.

## Key findings

- **Manus** completed the most tasks end to end, including recovery from UI changes.
- **Devin** planned carefully but was slower; excelled at structured workflows.
- **Claude Code** worked best with explicit step-by-step direction.
- **OpenClaw** needs closer browser-tool integration for open-ended navigation.

## Honest caveats

- Live sites change; results may not replicate exactly.
- Some agents rely on specific browser providers, which affects performance.
- Ethical and terms-of-service considerations limit the sites we can test.

## When to choose which

- **Manus:** delegating complex web tasks end to end.
- **Devin:** structured, multi-step web workflows that need planning.
- **Claude Code:** web tasks embedded in a coding or terminal workflow.
- **OpenClaw:** self-hosted agents with custom browser tooling.
