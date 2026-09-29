---
slug: openai-agents-api
title: "OpenAI Agents API: Managed Codex Harness as a Product"
excerpt: "OpenAI's public-beta API that exposes the Codex harness — session orchestration, context compaction, subagents, and sandboxes — as a fully managed service behind a single API call."
category: Infrastructure
tags:
  - managed-harness
  - agents
  - openai
  - sandbox
  - orchestration
  - codex
provider: "OpenAI"
pricing_model: Usage-based
price: "Pay for tokens, tools, and container time — no extra harness fee"
website: https://openai.com/index/introducing-the-agents-api
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-27"
---

# OpenAI Agents API: Managed Codex Harness as a Product

## What it is

On September 10, 2026, OpenAI released the Agents API in public beta, exposing the same harness that powers Codex and ChatGPT — session orchestration, context management, tool coordination, subagent spawning, error recovery, and sandboxed execution — as a general-purpose managed service. The one-line pitch from OpenAI's announcement: "Build and run cloud agents with the Codex harness, fully managed by OpenAI."

The structural signal is clear: intelligence is commoditizing, and value is migrating up the stack from the model to the harness that turns a model into a reliable process. The Agents API is OpenAI's bid to own that layer.

## Core capabilities

- **Managed Codex harness:** OpenAI operates and maintains the session loop, context compaction, tool search, programmatic tool calling, and parallel subagents — the same machinery that runs Codex
- **Three execution environments:** OpenAI-managed sandbox, your own infrastructure, or one of 9 partner sandboxes (including Vercel, Oracle, Cloudflare)
- **Persistent sessions:** Agents run for hours or days with saved turns, items, and intermediate state
- **Automatic context compaction:** The harness manages context window overflow so you don't hand-roll it
- **Subagent coordination:** Built-in parallel subagent spawning and coordination
- **Open-source harness codebase:** The Codex harness is open source, so you can inspect the core logic even though OpenAI runs it for you

## When to use it

- You want a reliable long-running agent without building and maintaining your own harness
- You need managed sandboxes with code execution, file handling, and artifact production
- You want to skip the orchestration-layer framework tax (LangChain, CrewAI, etc.) and use the harness that already runs at OpenAI's scale
- You're migrating from the sunset Assistants API (deprecated August 26, 2026)

## When to skip it

- You need full control over the harness logic and don't want a managed dependency
- You need data residency outside the US (current beta is US-only data residency)
- You need Zero Data Retention for regulated workloads (not yet supported in beta)
- You want to use non-OpenAI models as the agent's brain (the harness is OpenAI-ecosystem)

## API objects

The API is organized around 4 core concepts: **Agent** (configuration), **Environment** (compute/sandbox), **Session** (state), and the harness loop that ties them together. There is no extra fee for the harness itself — you pay for tokens, tools, and container time.

## Pricing

- **No harness surcharge:** You pay for model tokens, tool usage, and container/sandbox time only
- Token pricing follows standard OpenAI model rates
- Container time billed for sandbox compute usage

## Alternatives

- **Claude Agent SDK** — Anthropic's equivalent; harness that powers Claude Code, Python/TypeScript SDK, bills against Claude subscription plans
- **Google ADK 2.0** — Google's Agent Development Kit with Antigravity CLI and Managed Agents API
- **LangGraph / CrewAI** — self-managed orchestration frameworks; more control but you own the infrastructure
- **Temporal** — durable execution framework for long-running workflows; not AI-native but battle-tested for session management