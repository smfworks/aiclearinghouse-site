---
slug: agent-ui-regression-benchmark
title: "UI Regression Fix Benchmark"
excerpt: "Compared agents on finding and fixing a responsive CSS regression in an existing React app."
category: "Coding Benchmark"
tags:
  - css
  - react
  - regression
  - ui
  - agents
  - benchmark
agents:
  - Cursor
  - Windsurf
  - Claude Code
  - Cline
llm: "Claude 4 Sonnet"
winner: "Cursor"
date: "2026-06-08"
order: 2
last_verified: "2026-06-15"
results:
  - agent: Cursor
    score: 90
    time_minutes: 8
    tokens: 42000
    cost_usd: 1.40
    pass: true
    notes: "Composer UI made it trivial to point at the broken layout and apply a scoped Tailwind fix."
  - agent: Cline
    score: 84
    time_minutes: 12
    tokens: 38000
    cost_usd: 1.25
    pass: true
    notes: "Correct fix but required one extra prompt to narrow down the file."
  - agent: Windsurf
    score: 76
    time_minutes: 16
    tokens: 51000
    cost_usd: 1.75
    pass: true
    notes: "Fix worked but changed unrelated spacing alongside the targeted regression."
  - agent: Claude Code
    score: 68
    time_minutes: 22
    tokens: 67000
    cost_usd: 2.30
    pass: true
    notes: "Solved it but over-investigated; tried multiple approaches before settling."
---

# UI Regression Fix Benchmark

## The task

We introduced a responsive CSS regression into an existing Next.js + Tailwind dashboard: on screens narrower than 640px, the sidebar collapsed into the content area, breaking layout. Each agent was asked to identify and fix the regression without changing anything else.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Fixes the regression | 35% | 35 |
| No unrelated changes | 25% | 25 |
| Speed to verified fix | 20% | 20 |
| Explains the root cause | 10% | 10 |
| Cost efficiency | 10% | 10 |

## Methodology

- All agents ran with the same broken commit checked out.
- Prompt included a screenshot and the text: "Mobile layout is broken. Fix it with the smallest change possible."
- Time measured until the fix rendered correctly in a local dev server at 375px width.

## Key findings

- **Cursor** won because visual context is its strength. The Composer UI let us point at the screenshot, and Cursor traced it to a missing `md:` breakpoint.
- **Cline** was close. The VS Code extension made file navigation easy, but it needed a second prompt to avoid touching global styles.
- **Windsurf** fixed the issue but also adjusted unrelated spacing. Acceptable for a prototype, not ideal for a regression fix.
- **Claude Code** solved it but took the longest. It explored several hypotheses before committing, which is good for hard bugs and overkill for a CSS regression.

## Honest caveats

- Single-component regression. Multi-page layout bugs would change the ranking.
- Visual agents (Cursor, Windsurf) benefit from screenshots; terminal agents (Claude Code, Cline) don't natively ingest them.
- All fixes were manually reviewed. An automated visual diff test might have caught the unrelated Windsurf changes.

## When to choose which

- **Cursor**: UI-heavy work where pointing at the screen beats describing the problem.
- **Cline**: VS Code native workflows with a local model and strict scope control.
- **Windsurf**: fast prototyping where minor collateral changes are acceptable.
- **Claude Code**: complex debugging where root-cause reasoning matters more than speed.
