---
slug: autonomous-work-signaling
title: Autonomous Work Signaling
category: Workflow
excerpt: "Cross-session work status synchronization for multi-agent teams — lets autonomous agents signal what they're doing so teammates and orchestrators stay informed."
tags:
  - hermes
  - multi-agent
  - coordination
  - status-sync
  - autonomous
for: Hermes Agent, Claude Code, OpenAI Codex CLI, Cursor, GitHub Copilot
author: ChrisLamDev
install: hermes skill install autonomous-work-signaling
dependencies:
  - Hermes Agent or any MCP-compatible agent
  - Shared filesystem or networked status endpoint
image: /images/skills/workflow.svg
source: https://github.com/ChrisLamDev/hermes-core-skills
order: 99
last_verified: "2026-08-26"
---

# Autonomous Work Signaling

## What it is

Autonomous Work Signaling is a skill from the `ChrisLamDev/hermes-core-skills` pack that solves a specific multi-agent coordination problem: when multiple autonomous agents are running concurrently, they often have no way to know what each other is doing. This skill provides a structured protocol for cross-session work status synchronization.

The skill is part of a 26-skill pack focused on debugging, planning, token efficiency, and security for AI coding agents. It is MIT-licensed and works with Hermes Agent, Claude Code, OpenAI Codex CLI, Cursor, GitHub Copilot, and any MCP-compatible agent.

## The problem it solves

When you run multiple autonomous agents in parallel — say, one handling frontend, one handling backend, one running tests — they operate in isolation. Without a signaling mechanism:

- Two agents may work on the same file unknowingly
- An orchestrator can't tell if a subagent is stuck or making progress
- A teammate can't tell if it's safe to pick up where an agent left off
- Dependencies between agent tasks become invisible

## How it works

The skill defines a work-signaling protocol where each agent:

1. **Broadcasts intent** before starting a task — what it's about to do, which files it will touch
2. **Posts progress** at defined checkpoints — completed steps, current state, estimated remaining work
3. **Signals completion or failure** when done — final status, artifacts produced, blockers encountered

The protocol uses a shared status file or endpoint that all agents and human coordinators can read. This is deliberately low-tech — no message bus, no distributed lock manager — because the goal is reliability, not sophistication.

## The broader skill pack

The `hermes-core-skills` pack includes 26 executable skills across several categories:

- **AI Agent Ecosystem** (6 skills): capability comparison methodology, open-source adaptation patterns, multi-agent browser text extraction, skill size optimization, batch skill description fixing, Hermes improvement multiphase planning
- **Agent Integration** (3 skills): OpenClaw-Hermes architecture docs, Hermes setup guide, this work signaling skill
- **Session/Planning** (3 skills): structured planning and session management
- **Debugging, token efficiency, and security** skills

## Installation

```bash
git clone https://github.com/ChrisLamDev/hermes-core-skills.git
# Copy the skill to your Hermes skills directory
cp -r hermes-core-skills/skills/autonomous-work-signaling ~/.hermes/skills/
```

## When to use it

- **Multi-agent development teams** where 2+ autonomous agents work on the same codebase
- **Orchestrator-worker patterns** where a coordinator needs to track subagent progress
- **Human-agent handoff scenarios** where a teammate needs to know an agent's state before taking over