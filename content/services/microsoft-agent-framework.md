---
slug: microsoft-agent-framework
title: "Microsoft Agent Framework 1.0"
excerpt: "The production-ready merger of AutoGen and Semantic Kernel into a single SDK for building multi-agent workflows in .NET and Python."
category: Infrastructure
tags:
  - agent-framework
  - multi-agent
  - microsoft
  - orchestration
  - dotnet
  - python
provider: Microsoft
pricing_model: Free
price: "Open source (MIT). Infrastructure costs apply when using Azure-hosted agents."
website: https://learn.microsoft.com/en-us/agent-framework/overview
image: /images/agentmarketplace/services-hero.svg
order: 40
last_verified: "2026-08-19"
---

# Microsoft Agent Framework 1.0

## What it is

Microsoft Agent Framework (MAF) is the unified SDK that merged AutoGen and Semantic Kernel into a single, production-supported platform. It reached 1.0 GA on April 3, 2026, with the same concepts and APIs across .NET and Python.

For three years, Microsoft ran parallel bets: Semantic Kernel handled model connectors, memory, and tool calling; AutoGen handled multi-agent conversation patterns. Teams had to pick one or stitch them together with custom glue. MAF ends that split. Semantic Kernel becomes the foundation layer; AutoGen-style orchestration sits on top as a graph workflow engine. One install, stable APIs, long-term support.

## When to use it

- You are building agents in the Microsoft ecosystem (.NET, Azure, Microsoft 365).
- You need multi-agent orchestration with explicit graph-based workflows.
- You want a single framework that handles both single-agent tool calling and multi-agent collaboration.
- You are already invested in Semantic Kernel or AutoGen and want the migration path.

## What it does well

- **Unified API surface.** Chat clients, tools, MCP integrations, context providers, middleware, and multi-step workflows in one programming model. Same concepts across .NET and Python.
- **Graph-based workflows.** Explicit control over multi-agent execution paths — not just conversation patterns, but structured state-machine workflows with branching, parallelism, and human-in-the-loop.
- **Session-based state management.** Long-running and human-in-the-loop scenarios are first-class. State persists across steps, not just in-memory.
- **MCP support.** Native Model Context Protocol integration for connecting agents to external tools and data sources.
- **Enterprise features inherited from Semantic Kernel.** Type safety, filters, telemetry, middleware, extensive model and embedding support.
- **BUILD 2026 additions.** Agent Harness, Hosted Agents, and CodeAct were previewed, adding managed execution and code-based agent actions.
- **Open source.** MIT-licensed, with active development from the same teams that built AutoGen and Semantic Kernel.

## Honest limitations

- **.NET and Azure-native bias.** MAF is the obvious default for .NET and Azure teams. For Python-first or polyglot teams already on LangGraph or CrewAI, the calculus is less clear. The Python parity is good but the ecosystem gravity is .NET.
- **Migration effort.** If you have existing AutoGen or Semantic Kernel code, the migration path exists but is not zero-effort. The workflow API is new and requires rewriting orchestration logic.
- **Young ecosystem.** Despite the 1.0 label, community content, tutorials, and patterns are still maturing compared to LangGraph's deeper community base. Expect to read source code more often than blog posts.
- **Azure-hosted agents add cost.** The framework is free, but Hosted Agents and Agent Harness (BUILD 2026 previews) run on Azure infrastructure with associated costs. Budget for compute, not just the SDK.
- **Python and .NET feature parity is not always simultaneous.** New features may land in one language first. Check the release notes for your target language.

## Pricing reality

The framework itself is free and open source under MIT. You pay for:

- **Compute infrastructure** if you self-host (VMs, containers, AKS).
- **Azure-hosted agents** if you use the BUILD 2026 Hosted Agents preview (usage-based Azure pricing).
- **Model API costs** from whatever provider you connect (OpenAI, Azure OpenAI, or others via MCP).

## Best fit

Teams already in the Microsoft ecosystem who want a single, supported framework for both single-agent and multi-agent workflows. Especially strong for .NET shops that previously had to choose between Semantic Kernel's enterprise features and AutoGen's multi-agent patterns. For Python-first teams evaluating frameworks, compare directly against LangGraph 1.x and the OpenAI Agents SDK — the right choice depends on your existing stack and workflow complexity.