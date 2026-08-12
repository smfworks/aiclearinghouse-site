---
slug: a2a-agent-bridge
title: "A2A Agent Bridge"
category: Protocol
excerpt: "Configure and manage Agent-to-Agent (A2A) protocol connections in Hermes Agent v0.20+ for cross-vendor multi-agent orchestration."
tags:
  - a2a
  - protocol
  - multi-agent
  - hermes
  - orchestration
for: Hermes Agent
author: SMF Works
install: hermes skill install a2a-agent-bridge
dependencies:
  - Hermes Agent v0.20+
  - Python 3.11+
image: /images/skills/protocol.svg
source: https://github.com/smfworks/hermes-skills
order: 99
last_verified: "2026-08-12"
---

# A2A Agent Bridge

## Overview

The A2A Agent Bridge skill configures and manages Agent-to-Agent (A2A) protocol connections in Hermes Agent v0.20 and later. A2A is an open protocol — governed under the Linux Foundation, originally proposed by Google — that enables AI agents from different vendors, running on different models, hosted on different clouds, to cooperate over a single standardized contract.

Hermes Agent v0.20 ("The Herald Release") shipped native A2A protocol support, and this skill provides the configuration layer for establishing, managing, and debugging A2A connections between your Hermes agent and remote agents.

## What it does

- **Agent discovery**: Discover and register remote A2A-capable agents via their HTTP endpoints
- **Task delegation**: Delegate tasks to remote agents using JSON-RPC 2.0 over HTTP, with SSE streaming for progress updates
- **Context management**: Manage the optional context identifiers that logically group related tasks across agents
- **Extension support**: Handle A2A extensions — additional functionality or data beyond the core specification
- **Connection health**: Monitor A2A connection health and surface failures in the Hermes dashboard

## How A2A differs from MCP

A2A and MCP solve different problems and are designed to be used together:

- **MCP** (Model Context Protocol): Connects an agent to its tools — filesystem, databases, APIs. The agent is the client; the tool is the server.
- **A2A** (Agent-to-Agent): Connects agents to other agents. Each A2A-capable agent can also run as an MCP client to access its own tools. The orchestrator delegates via A2A; each sub-agent executes using its MCP tool connections.

This skill handles the A2A layer. For MCP tool configuration, use the built-in MCP server management or the `mcp-filesystem-server` skill.

## Installation

```bash
hermes skill install a2a-agent-bridge
```

Requires Hermes Agent v0.20.0 or later.

## Quick start

1. Install the skill
2. Register a remote agent: `hermes a2a register --url https://remote-agent.example.com --name "Research Agent"`
3. Delegate a task: `hermes a2a delegate --agent "Research Agent" --task "Analyze Q3 revenue trends"`
4. Stream updates arrive via SSE; final result is stored in the conversation context

## Use cases

- **Multi-vendor orchestration**: Let your Hermes agent delegate research tasks to a Claude-based agent running elsewhere
- **Specialized agents**: Route legal analysis to a Harvey-powered agent, code review to a Codex agent, and data analysis to a local model — all from one Hermes session
- **Enterprise federation**: Connect agents across organizational boundaries with a standardized protocol