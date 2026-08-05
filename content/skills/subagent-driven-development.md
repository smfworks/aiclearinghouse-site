---
slug: subagent-driven-development
title: Subagent-Driven Development
category: Workflow
excerpt: Fan out complex multi-step tasks across parallel subagents — each with isolated context, clear deliverables, and a coordinator that merges results.
tags:
  - hermes
  - subagents
  - multi-agent
  - orchestration
  - parallel
for: Hermes Agent
author: SMF Works
install: hermes skill install subagent-driven-development
dependencies:
  - Hermes Agent
  - Python 3.11+
image: /images/skills/workflow.svg
source: https://github.com/NousResearch/hermes-agent
order: 99
last_verified: "2026-08-05"
---

# Subagent-Driven Development

## What it is

A Hermes skill that codifies the subagent fan-out pattern for complex tasks. Instead of running one agent through a long sequential workflow, the coordinator agent breaks the task into independent sub-tasks, dispatches each to a subagent with its own clean context, and merges the results. Each subagent's failures stay isolated — one bad branch does not poison the others.

## Who it targets

- Multi-agent teams running parallel workstreams
- Agent operators handling complex tasks that exceed a single context window's effective budget
- Anyone who has watched a single agent degrade over a 50-step conversation

## What it does

- Defines a task-decomposition step that splits work into independent sub-tasks
- Spawns subagents with isolated contexts, each receiving only what its sub-task needs
- Collects results and runs a merge/validation step in the coordinator
- Handles partial failures — if one subagent fails, the coordinator retries or reports the gap
- Logs per-subagent token usage and cost for budget tracking

## How to install

```
hermes skill install subagent-driven-development
```

Or copy `SKILL.md` into `~/.hermes/profiles/<name>/skills/workflow/subagent-driven-development/`.

## Example usage

Task: "Research and draft a competitive analysis report." The coordinator splits this into: (1) market research subagent, (2) feature comparison subagent, (3) pricing analysis subagent, (4) draft writer subagent. Each runs in parallel with its own context. The coordinator merges the three research outputs into the draft writer's input, producing a final report faster and with higher quality than a single sequential agent.