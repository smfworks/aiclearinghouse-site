---
slug: choosing-managed-agent-harness-2026
title: "Choosing a Managed Agent Harness in 2026"
excerpt: "OpenAI Agents API, Claude Agent SDK, and Google ADK 2.0 all expose a managed harness — the loop that turns a model into a reliable agent. This guide compares what each gives you, what they lock you into, and when to roll your own."
category: Guides
tags:
  - harness
  - managed
  - openai
  - anthropic
  - google
  - orchestration
  - agents
order: 99
last_verified: "2026-09-27"
---

# Choosing a Managed Agent Harness in 2026

## The shift

September 2026 crystallized a structural shift in the agent stack: the harness — the loop that manages context, calls tools, coordinates subagents, and recovers from errors — is becoming a product, not something every team builds from scratch. Three major labs now expose their internal harness as a managed service:

- **OpenAI Agents API** (public beta, September 10, 2026) — the Codex harness behind one API call
- **Claude Agent SDK** — the Claude Code harness in Python/TypeScript, billing against Claude plans
- **Google ADK 2.0** — Agent Development Kit with Antigravity CLI and Managed Agents API

The value is migrating up the stack from the model to the harness. Here's how to choose.

## What a harness actually does

Before comparing products, understand what you're buying (or building):

1. **Session management** — keeping state across turns, hours, or days
2. **Context compaction** — managing context window overflow so the agent doesn't crash mid-task
3. **Tool coordination** — calling tools efficiently, handling failures, retries
4. **Subagent orchestration** — spawning and coordinating parallel subagents
5. **Sandboxed execution** — secure code execution environments
6. **Error recovery** — detecting when something went wrong and course-correcting

If you're building a simple chatbot, you don't need a harness. If you're building an agent that runs for hours, calls 10+ tools, and spawns subagents — you need one, and the question is build vs buy.

## OpenAI Agents API

**What it is:** The Codex harness (session orchestration, context compaction, tool search, programmatic tool calling, parallel subagents) as a fully managed API. OpenAI runs and maintains it.

**Strengths:**
- Zero infrastructure — OpenAI manages the harness, sandbox, and scaling
- Three execution environments: OpenAI-managed sandbox, your infrastructure, or 9 partner sandboxes
- Open-source harness codebase — you can inspect the logic even though OpenAI runs it
- No harness surcharge — pay for tokens, tools, and container time only

**Trade-offs:**
- US-only data residency in beta
- No Zero Data Retention for regulated workloads yet
- Tied to OpenAI models as the agent brain
- Beta — features and API surface may change

**Choose it when:** You want the least infrastructure overhead, you're already in the OpenAI ecosystem, and you need sessions that run for hours or days without you managing them.

## Claude Agent SDK

**What it is:** The Claude Code harness as a Python/TypeScript SDK with a bundled CLI. Ships with subagents, sessions, MCP support, and a hosted execution model that bills against Claude subscription plans.

**Strengths:**
- Python and TypeScript SDKs — integrate into existing codebases
- MCP support is first-class — broad tool ecosystem
- Subagents and session management built in
- Beneath Anthropic Managed Agents (2026), which add scheduling, dreaming passes, and rubric-based outcome grading

**Trade-offs:**
- Billing complexity — usage draws from subscription limits; Anthropic has changed the metering model multiple times (announced a separate credit pool June 15, 2026, then paused it the same day)
- Tied to Claude models
- More integration work than the fully managed Agents API

**Choose it when:** You want code-level integration with a harness that's proven at Claude Code's scale, you need MCP tool ecosystem access, and you're building in Python or TypeScript.

## Google ADK 2.0

**What it is:** Google's Agent Development Kit with the Antigravity CLI, an SDK for self-hosting the same harness, and the Managed Agents API for cloud-hosted agent execution. Announced at I/O 2026 alongside Gemini 3.5 Flash.

**Strengths:**
- Multiple surfaces: desktop app, CLI, SDK, and cloud-managed
- Can host the same agent harness on your own infrastructure
- Plugs directly into Gemini Enterprise Agent Platform for Cloud customers — agents run inside your security boundary
- A2A (Agent-to-Agent) protocol support for multi-agent systems
- Native integration with Google Search grounding and Google Maps

**Trade-offs:**
- Google ecosystem-centric — strongest when using Gemini models and Google Cloud
- Newer managed offering — less production track record than OpenAI's
- Multiple surfaces can be confusing (which one do you use?)

**Choose it when:** You're in Google Cloud, you want the option to self-host the harness, or you need native Google Search/Maps grounding in your agent.

## When to build your own

A managed harness is not always the right answer. Build your own when:

- **You need non-OpenAI/Anthropic/Google models** as the primary brain (e.g., self-hosted DeepSeek, GLM, Qwen)
- **You need full control over the harness logic** — custom context compaction strategies, domain-specific error recovery, specialized subagent coordination
- **You need data residency or compliance** that the managed offerings don't support yet
- **You're using a durable execution framework** like Temporal that already handles session management and retries — adding a managed harness on top may be redundant

For self-built harnesses, the building blocks are: a model with tool calling, a tool execution layer (often MCP), a session/state store, and a loop. Frameworks like LangGraph, CrewAI, or Smolagents provide structure without taking over the harness entirely.

## Decision framework

| Priority | Recommendation |
|----------|---------------|
| Least infrastructure, fastest start | OpenAI Agents API |
| Code-level integration, MCP ecosystem | Claude Agent SDK |
| Google Cloud, self-host option, A2A | Google ADK 2.0 |
| Non-proprietary models, full control | Build with LangGraph / Smolagents |
| Durable execution already in your stack | Temporal + your own loop |
| Regulated data, US-only not sufficient | Build your own with self-hosted models |

## The bottom line

The managed harness market is real and moving fast. For most teams building production agents in September 2026, starting with a managed harness (OpenAI, Claude, or Google depending on your ecosystem) is the right default — it eliminates months of harness engineering. Switch to a self-built harness only when you hit a constraint the managed offerings don't solve: model flexibility, data residency, or custom orchestration logic that doesn't fit their abstraction.