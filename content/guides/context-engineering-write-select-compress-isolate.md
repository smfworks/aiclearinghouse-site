---
slug: context-engineering-write-select-compress-isolate
title: "Context Engineering: The Four Operations Every Agent Builder Must Master"
excerpt: "Write, Select, Compress, Isolate — the canonical framework for managing what enters and stays in an agent's context window. This guide shows when to use each and how they combine."
category: Guides
tags:
  - context-engineering
  - context
  - performance
  - architecture
  - agents
  - prompting
order: 99
last_verified: "2026-07-29"
---

# Context Engineering: The Four Operations Every Agent Builder Must Master

## Why this guide exists

Prompt engineering is over. Not because prompts don't matter — they do — but because the system around the prompt matters more. An AI agent runs in a loop, uses tools, gathers state, and makes decisions at step 47 with the residue of steps 1 through 46 still in its context window. The token budget is finite, the attention budget is finite, and most context failures stem from how that budget is spent, not from a bad opening prompt.

Context engineering is the discipline of managing what enters the context window, what stays there, and what gets removed. The four canonical operations — **Write**, **Select**, **Compress**, and **Isolate** — cover every context management decision you will make. This guide explains each, when to use it, and how they combine.

---

## 1. Write — Persist Context Outside the Window

**The problem:** The agent establishes facts in step 3 that it needs in step 30, but by step 30 the context window has filled with intermediate work and the facts are buried or lost.

**The fix:** Write important state to an external store — a scratchpad file, a memory database, a task list — so the agent can retrieve it deliberately instead of relying on conversation history.

### When to use Write

- Long-running tasks where the agent needs to recall earlier decisions
- Multi-session agents that must persist state across restarts
- Complex plans that the agent should re-read rather than re-derive
- Any state that is too important to leave in the attention lottery of a long context

### How to do it

- Write plans to `.hermes/plans/` or a project scratchpad
- Use a memory store (Letta, Mem0, Zep) for facts that span sessions
- Write task lists to a file the agent re-reads each turn
- Keep written state small and reviewed — persisting bad context makes the next step worse

### Anti-pattern

Do not write everything. Persisting low-value context just creates a different kind of noise. Write only what the agent will genuinely need later and cannot cheaply re-derive.

---

## 2. Select — Bring In Only What's Relevant Now

**The problem:** The agent retrieves 10 documents from RAG and stuffs all 10 into context. Three are relevant; seven are noise that dilutes attention and degrades the answer.

**The fix:** Select narrowly. Pull the specific facts a step needs, not whole documents. Set a relevance threshold and drop anything below it.

### When to use Select

- RAG pipelines where over-eager retrieval is poisoning context
- Tool calls that return large outputs (keep only the decision-relevant lines)
- Multi-source workflows where the agent has access to more than it needs

### How to do it

- Cap retrieval candidates at 3–5 per call
- Set a relevance score threshold (e.g., drop chunks below 0.7 cosine similarity)
- Truncate tool outputs to their essential lines before they enter context
- Use scoped MCP connections or targeted RAG lookups tied to a specific record, not the whole database

### Anti-pattern

Do not retrieve "just in case." More data does not mean better answers — it means more noise. The model's attention is not infinite; every irrelevant token competes with the relevant ones.

---

## 3. Compress — Reduce What's Already There

**The problem:** The context window is 80% full of completed sub-task histories, verbose tool outputs, and stale conversation. The model is working with 20% headroom and degraded attention.

**The fix:** Compress proactively. Replace completed sub-task histories with tight recaps. Truncate verbose outputs. Drop finished work.

### When to use Compress

- After every completed sub-task in a multi-step workflow
- When context exceeds ~40% capacity (don't wait for 95% auto-compact)
- Before starting a new sub-task that will add its own context
- When you notice the agent repeating itself or losing track

### How to do it

- Summarize resolved sub-tasks into 2–3 sentence recaps
- Replace long histories with condensed running summaries
- Truncate tool outputs to pass/fail summaries and key lines
- Drop retrieved chunks below the relevance threshold

### Anti-pattern

Do not wait for auto-compact. By the time it triggers at 95%, the model has been working with degraded attention for many turns. Compress early and often.

---

## 4. Isolate — Split Context Across Boundaries

**The problem:** One agent carries multiple domains of work in a single context window. Domain A's noise contaminates domain B's reasoning. A debugging session's failed attempts bleed into the next feature's implementation.

**The fix:** Give each distinct sub-task its own clean context. Use sub-agents, separate sessions, or sandboxed steps so one task's residue never poisons another's decisions.

### When to use Isolate

- Multi-step workflows where each step has a different information need
- Multi-agent systems where agents specialize by role or domain
- Long-running agents that handle a queue of unrelated tasks
- Any workflow where one task's failure should not affect the next task's starting state

### How to do it

- Split by role: research agent, drafting agent, approval agent — each with its own context
- Split by domain: finance work and engineering work in separate sessions
- Use sub-agents for distinct jobs — the parent receives only the result
- Reset between unrelated top-level tasks
- Keep shared definitions in a governed source context that each isolated agent reads but does not pollute

### Anti-pattern

Do not run everything through one giant context window. A 1M-token context does not mean you should fill it. Isolation is not overhead — it is quality insurance.

---

## How they combine

No single operation is sufficient. Real agent systems use all four:

1. **Write** the plan to a file so the agent can re-read it
2. **Select** narrowly from the knowledge base for each step
3. **Compress** completed steps into recaps before moving on
4. **Isolate** each sub-task into its own context to prevent cross-contamination

The order matters: Write keeps information available, Select keeps it relevant, Compress keeps it lean, and Isolate keeps it clean. Skip any one and you get a predictable failure mode.

## The bottom line

Context engineering replaces prompt engineering as the core skill for agent builders in 2026. The four operations — Write, Select, Compress, Isolate — are the toolkit. Master them, and your agents will work better, longer, and cheaper than any prompt tweak can achieve.