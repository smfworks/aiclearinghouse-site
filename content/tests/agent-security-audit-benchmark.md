---
slug: agent-security-audit-benchmark
title: "Agent Security Audit Benchmark"
excerpt: "Tested whether agents can find prompt injection vectors, unsafe tool permissions, and secret leakage in a deliberately vulnerable agent app."
category: "Security Benchmark"
tags:
  - security
  - prompt-injection
  - audit
  - agents
  - benchmark
agents:
  - Claude Code
  - OpenHands
  - Cursor
  - Aider
llm: "Claude 4 Sonnet"
winner: "Claude Code"
date: "2026-06-12"
order: 4
last_verified: "2026-06-15"
results:
  - agent: Claude Code
    score: 86
    time_minutes: 34
    tokens: 98000
    cost_usd: 3.40
    pass: true
    notes: "Found hardcoded API key, overly broad file tool, and one indirect injection vector."
  - agent: Aider
    score: 78
    time_minutes: 41
    tokens: 72000
    cost_usd: 1.95
    pass: true
    notes: "Strong on secret detection and git history review. Missed the prompt injection path."
  - agent: Cursor
    score: 64
    time_minutes: 38
    tokens: 85000
    cost_usd: 2.90
    pass: false
    notes: "Found the hardcoded key but treated the audit as a code review, missing runtime attack paths."
  - agent: OpenHands
    score: 45
    time_minutes: 52
    tokens: 155000
    cost_usd: 4.60
    pass: false
    notes: "Generated a generic security checklist but failed to map it to actual code paths."
---

# Agent Security Audit Benchmark

## The task

We built a small Express + LangChain agent with three deliberate vulnerabilities:

1. **Hardcoded API key** in `config.ts`
2. **Overly broad file tool** that could read `.env` and `/etc/passwd`
3. **Indirect prompt injection** via a user-controlled document fed into the system prompt

Each agent was asked: "Audit this agent for security issues. List concrete findings with file paths and remediation steps."

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Finds hardcoded secret | 25% | 25 |
| Identifies unsafe tool scope | 25% | 25 |
| Finds prompt injection vector | 25% | 25 |
| Remediation advice is actionable | 15% | 15 |
| Speed | 10% | 10 |

## Methodology

- Same repo, same prompt, no hints.
- Agents were allowed to read files and run static analysis commands.
- Findings were scored manually against the known vulnerability list.

## Key findings

- **Claude Code** performed best on reasoning through indirect attack paths. It traced user input into the system prompt and flagged the risk.
- **Aider** excelled at finding secrets and permission issues in code, but prompt injection is not its strength.
- **Cursor** was fast and found obvious issues, but its audit was shallow — it missed runtime semantics.
- **OpenHands** produced a long checklist with few specific citations. Volume does not equal accuracy.

## Honest caveats

- Three vulnerabilities is a small sample. A real audit covers many more attack surfaces.
- None of the agents replaced a human security reviewer. They accelerated the first pass.
- Results depend heavily on how the prompt frames "audit." A narrower prompt might have helped Cursor focus.

## When to choose which

- **Claude Code**: reasoning-heavy audits where tracing data flow matters.
- **Aider**: code-centric reviews with strict diff control and secret scanning.
- **Cursor**: quick triage of obvious security smells.
- **OpenHands**: not recommended for security audits until it improves citation precision.
