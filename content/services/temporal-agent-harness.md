---
slug: temporal-agent-harness
title: "Temporal Agent Harness: Durable Agent Infrastructure"
excerpt: "An open-source outer harness that wraps your existing agent SDK with durable execution, approval policies, typed operations, and structured event streams. Every agent becomes a Temporal Workflow that survives crashes, deployments, and multi-day waits."
category: Agent Infrastructure
tags:
  - durable-execution
  - open-source
  - temporal
  - agent-harness
  - approvals
  - multi-agent
  - production
provider: Temporal Technologies
pricing_model: Open-source (self-hosted) / Temporal Cloud (paid)
price: "Free self-hosted (Apache 2.0); Temporal Cloud pricing varies"
website: https://temporal.io/blog/temporal-agent-harness-durable-agent-infrastructure
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-26"
---

# Temporal Agent Harness: Durable Agent Infrastructure

## What it is

The Temporal Agent Harness is an open-source "outer harness" that sits around the agent SDK you already use and provides the machinery production agents need: durable execution, approval policies, typed operations, structured event streams, and multi-agent coordination. It launched in August 2026 and is available on GitHub with documentation and examples.

The key insight is that most agent frameworks fall into two extremes. Full-featured harnesses (Claude Code, Cowork) do a lot but make it hard to own the controls that matter to your application. Agent SDKs (OpenAI Agents SDK, PydanticAI, LangGraph) give you control but stop short of everything you need for production. Temporal's harness is the middle ground: you keep your inner harness of choice and add production controls on top.

## Core concept: Every agent is a Temporal Workflow

Every agent built with the harness runs as a Temporal Workflow. This means durability is foundational, not bolted on:

- Agents survive worker crashes and deployments
- Agents can wait minutes or days for external events without keeping a process alive
- Failed model or tool calls retry according to policy
- Agents resume exactly where they left off without rerunning completed work

## Key features

- **Durable execution**: Long-running agents pause, retry, and resume without losing state. No process needs to stay alive during waits.
- **Approval policies**: Layered, runtime-changeable policies around tool execution. Let an agent retrieve an order autonomously but require human approval before it refunds one. Pause execution when approval is required, resume durably when the decision arrives — even hours or days later.
- **Turns**: A higher-level concept above the inner harness loop. A turn invokes the inner harness once, with its loop free to execute as many times as needed. The harness stitches turns together, carrying context forward.
- **Typed operations**: Agents expose named, strongly typed operations with typed inputs and outputs. This makes agents self-describing and callable programmatically — not just by a person typing into a chat box.
- **Multi-agent coordination**: One agent can invoke another through the same typed contract. The harness exposes an agent's operations as a toolset to another agent, enabling multi-agent systems without reducing communication to strings pasted into prompts.
- **Code Mode**: The model can write a Python program over provided tools, using normal control flow (loops, conditions, concurrency) to orchestrate many tool calls within a single turn — all governed by the harness's approval and durability machinery.
- **AgentEvents stream**: Turns, model interactions, tool calls, approvals, handoffs, and responses all appear as a structured event stream. Frontends, approval services, analytics, and audit systems can consume the stream independently.

## Current integrations

The harness currently integrates with three inner harnesses:

- Google Gemini
- OpenAI Agents SDK
- PydanticAI

More integrations are in development. The project is explicitly early — APIs will change, there are rough edges, and abstractions are still evolving.

## Who it's for

- **Teams with production agents** that need durability, governance, and observability beyond what their agent SDK provides
- **Multi-agent system builders** who want typed inter-agent communication instead of prompt-based handoffs
- **Platforms with compliance requirements** where every agent action must be auditable and approval-gated

## Limitations

- **Very early** — earlier than public preview. Expect API changes and rough edges.
- **Three inner harness integrations** at launch. If your stack uses LangGraph, CrewAI, or AWS Strands, you'll wait or contribute.
- **Temporal dependency** — adopting the harness means adopting Temporal's execution model, which has its own learning curve and operational requirements.

## Alternatives to consider

- **DigitalOcean M.A.R.S.** — managed, less control, less setup
- **LangChain Managed Deep Agents** — public beta, less durable-execution focus
- **Raw Temporal + your own agent loop** — maximum control, maximum build effort