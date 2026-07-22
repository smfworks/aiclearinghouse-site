---
slug: agent-context-window-budgeting
title: Budget Your Context Window Like a Paycheck
category: Performance
excerpt: Context window is not free space — it is a finite resource. Allocate it deliberately or your agent will spend it on noise and starve on signal.
tags:
  - context
  - performance
  - prompting
  - agents
  - cost
order: 25
last_verified: "2026-07-15"
---

# Budget Your Context Window Like a Paycheck

## The principle

A 128K context window feels infinite until your agent loads three full files, a system prompt, ten tool outputs, and a conversation history — and now it is working with 4K tokens of headroom for actual reasoning. Treat context as a budget, not a bucket.

## Why it matters

Every token in context costs twice: once in inference latency (the model reads it every turn) and once in quality (irrelevant tokens dilute attention). Agents that stuff context with "just in case" information produce worse answers, not better ones. This is not a theory — it is the single most common performance regression we see in agent deployments.

## How to apply it

1. **Set a context budget per task type.** A code review gets 30K. A research synthesis gets 50K. A quick triage gets 8K. Write it down.
2. **Load files lazily, not eagerly.** Do not dump an entire codebase into context "for context." Let the agent search and read specific files on demand.
3. **Summarize conversation history.** After 10 turns, compress earlier exchanges into a summary rather than carrying full transcripts.
4. **Prune tool outputs.** A 2,000-line API response does not belong in context. Extract the relevant fields and discard the rest before it enters the prompt.
5. **Measure actual context usage.** Log input token counts per turn. If a task routinely hits 80%+ of the window, your budget is too small or your loading strategy is wrong.

## Red flags

- "Let me just include the whole file to be safe"
- Input token counts growing monotonically across turns instead of stabilizing
- Agent quality degrades on longer conversations despite the same model
- You have never checked how many tokens your system prompt actually consumes

## Quick win

This week, log the input token count for your three most common agent tasks. If any task uses more than 50% of the context window on loading (not reasoning), you have an easy optimization target.