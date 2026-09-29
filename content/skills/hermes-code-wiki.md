---
slug: hermes-code-wiki
title: Code Wiki (LLM-Wiki for Hermes)
category: Software Development
excerpt: Optional Hermes Agent skill that maintains a persistent, indexed developer wiki — inspired by Karpathy's LLM-Wiki — so project knowledge accumulates across sessions instead of being rebuilt from scratch.
tags:
  - hermes
  - documentation
  - knowledge-management
  - coding
  - persistence
for: Hermes Agent
author: Hermes Agent Community
install: hermes skill install code-wiki (optional skill)
dependencies:
  - Hermes Agent
  - Python 3.11+
image: /images/skills/workflow.svg
source: https://hermes-agent.nousresearch.com/docs/reference/skills-catalog
order: 99
last_verified: "2026-09-27"
---

# Code Wiki (LLM-Wiki for Hermes)

## What it is

Code Wiki is an optional Hermes Agent skill that maintains a persistent, indexed developer wiki — inspired by Karpathy's LLM-Wiki concept. It landed as one of three new optional skills in Hermes Agent's September 2026 changelog, alongside the OpenHands orchestration skill and skill bundles.

The core idea: most agents rebuild project context from scratch at the start of every session. Code Wiki instead writes what it learns about a codebase — architecture decisions, file relationships, gotchas, API contracts — into a persistent, searchable wiki that future sessions can read from.

## Who it targets

- Developers using Hermes Agent for ongoing codebase work across multiple sessions
- Teams that want accumulated project knowledge to persist rather than disappear when a session ends
- Anyone maintaining a large or unfamiliar codebase where onboarding context is expensive to regenerate

## What it does

- **Persistent indexed wiki:** Stores project knowledge in a structured, searchable format that survives across sessions
- **Automatic knowledge capture:** As the agent works on a codebase, it writes observations, decisions, and relationships into the wiki
- **Cross-session retrieval:** Future sessions read from the wiki instead of re-deriving the same context, cutting the cold-start cost
- **LLM-Wiki lineage:** Based on Karpathy's LLM-Wiki concept — a living document that an LLM both reads and writes

## How to install

```bash
hermes skill install code-wiki
```

This is an optional skill under Hermes Agent's optional skills catalog. Once installed, the agent will use it when working on codebases where a wiki would help.

## Why it matters

The cold-start problem is one of the most expensive parts of running agents at scale. Every new session that starts work on an existing codebase has to re-build context — file structure, conventions, dependencies, prior decisions — from scratch. That's token cost, latency, and the risk of the agent making decisions that contradict earlier ones. Code Wiki turns that one-time context-building into an investment that pays off across every future session.

## Limitations

- **Optional skill:** Must be explicitly installed; not part of the default skill set
- **Wiki quality depends on usage:** The wiki is only as good as what the agent writes into it — review and prune periodically
- **Storage overhead:** The wiki is a real artifact on disk; plan for it in your workspace
- **Not a replacement for code comments:** It complements, not replaces, in-code documentation