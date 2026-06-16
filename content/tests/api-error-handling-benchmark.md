---
slug: api-error-handling-benchmark
title: "API Error Handling Benchmark"
excerpt: "Which agents produce correct, defensive error handling for REST endpoints with edge cases?"
category: "Coding Benchmark"
tags:
  - api
  - error-handling
  - agents
  - benchmark
agents:
  - Claude Code
  - Aider
  - Cursor Composer
  - Cline
llm: "Claude 3.7 Sonnet"
winner: "Aider"
date: "2026-06-16"
order: 2
last_verified: "2026-06-16"
results:
  - agent: Aider
    score: 89
    time_minutes: 22
    tokens: 94000
    cost_usd: 2.05
    pass: true
    notes: "Generated clean try/catch blocks, meaningful error messages, and tests for 4xx and 5xx paths."
  - agent: Claude Code
    score: 86
    time_minutes: 19
    tokens: 118000
    cost_usd: 2.60
    pass: true
    notes: "Fast and correct. One retry loop was slightly too aggressive; fixed with one prompt."
  - agent: Cursor Composer
    score: 81
    time_minutes: 25
    tokens: 105000
    cost_usd: 2.30
    pass: true
    notes: "Good structure, but error response schema drifted between endpoints."
  - agent: Cline
    score: 74
    time_minutes: 31
    tokens: 87000
    cost_usd: 1.80
    pass: true
    notes: "Correct basics but missed timeout and retry handling without explicit prompting."
---

# API Error Handling Benchmark

## The task

Each agent was asked to implement a small Express API with three endpoints and robust error handling for:

- Invalid JSON payloads (400)
- Missing required fields (422)
- Resource not found (404)
- Downstream timeout (504)
- Unhandled server errors (500)
- Consistent error response schema

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Correct status codes | 25% | 25 |
| Consistent error schema | 20% | 20 |
| Timeout and retry handling | 20% | 20 |
| Test coverage for error paths | 20% | 20 |
| Code clarity | 15% | 15 |

## Methodology

- Same starter repo with one happy-path endpoint provided.
- Agents were told to make error handling defensive and consistent.
- We ran a test suite with 12 error scenarios after each attempt.
- No hand-holding after the initial prompt.

## Key findings

- **Aider** produced the most defensive code. Its git-aware approach made it easy to see the guard clauses land in the right places.
- **Claude Code** was fastest and nearly as good, but needed a small correction on retry policy.
- **Cursor Composer** got the architecture right but let the error schema drift across endpoints.
- **Cline** handled the basics well but required explicit mention of timeout handling to include it.

## Honest caveats

- This is a small API surface. Larger APIs might surface different weaknesses.
- We used Claude 3.7 Sonnet as the underlying model for all agents that supported it.

## When to choose which

- **Aider**: existing APIs where consistency and reviewability matter.
- **Claude Code**: fast iteration where you will validate edge cases afterward.
- **Cursor Composer**: greenfield endpoints where architecture is still forming.
- **Cline**: budget-conscious teams who can add explicit constraints in prompts.
