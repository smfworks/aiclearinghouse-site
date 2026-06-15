---
slug: letta
title: Letta
excerpt: Self-editing memory system for agents that remembers facts, relationships, and context across unlimited conversations. Best for building persistent AI companions and long-running automation.
category: Framework
tags:
  - memory
  - framework
  - open-source
  - persistent
website: https://www.letta.com
repository: https://github.com/letta-ai/letta
pricing: Open Source
runtime: Local
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
  - Python
  - Docker
features:
  - Persistent memory across sessions
  - Self-editing memory (agents modify their own memory)
  - Multi-agent orchestration
  - REST API and SDK
  - Supports any LLM provider
  - Docker deployment
  - Web UI for management
releaseYear: 2023
company: Letta AI
last_verified: 2026-06-15
---

## When to choose Letta

Choose Letta when your agent needs to remember things. Most agents start each conversation with a blank slate. Letta gives agents a long-term memory they can read, write, and update — like a diary that persists across sessions. This is essential for personal assistants, companion agents, customer service bots, and any automation that needs continuity.

## What it does well

- **Persistent memory.** Letta stores facts, relationships, and preferences in a structured database. Ask it about a conversation from three months ago and it recalls the context, not just the transcript.
- **Self-editing memory.** Agents can reflect on their own memory, correct outdated facts, and consolidate redundant entries. The memory system improves over time rather than accumulating noise.
- **Multi-agent support.** Deploy fleets of agents with shared or isolated memory stores. One agent can delegate to another and retrieve the results later.
- **Provider agnostic.** Works with OpenAI, Anthropic, local models, and any OpenAI-compatible endpoint. The memory layer is independent of the model layer.
- **REST API.** Build applications on top of Letta's memory system without managing the infrastructure. The API handles authentication, memory storage, and agent lifecycle.

## Honest limitations

- **Framework, not product.** Letta is a building block. You need to write code or use the web UI to create agents. There is no consumer chat interface out of the box.
- **Memory management overhead.** Unbounded memory growth is a real problem. Letta has pruning and summarization, but you must monitor and tune memory policies for production deployments.
- **Local setup required.** The hosted version exists but the open-source version is where the value is. Expect Docker, Python, and database configuration.
- **Not a coding agent.** Letta provides memory and orchestration. It does not edit files, run tests, or integrate with git. Pair it with a coding agent for full workflows.

## Best fit

Developers building persistent AI applications, companion apps, customer service bots, research assistants, and any system where context continuity matters more than single-turn brilliance.

## Pricing

- **Open Source (free):** Full framework, local deployment, community support.
- **Cloud (pay-as-you-go):** Managed hosting with auto-scaling, monitoring, and enterprise SLA.
- **Enterprise:** Custom deployment, dedicated infrastructure, priority support.
