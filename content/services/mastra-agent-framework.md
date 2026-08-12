---
slug: mastra-agent-framework
title: "Mastra: TypeScript-First AI Agent Framework"
excerpt: "Production-grade TypeScript framework for building AI agents with workflows, memory, evals, and observability. Apache 2.0 open source with managed platform tier."
category: Tools
tags: [agents, typescript, framework, workflows, memory, evals]
provider: Mastra
pricing_model: Free
price: "Apache 2.0 open source; Enterprise self-hosted custom pricing"
website: https://mastra.ai
image: /images/agentmarketplace/services-hero.svg
order: 37
last_verified: "2026-08-12"
---

# Mastra: TypeScript-First AI Agent Framework

## What it is

Mastra is a TypeScript-first framework for building AI agents and multi-step workflows. It provides the primitives most production agent systems need — agents, tools, memory, workflows, evals, and observability — in a single package rather than requiring you to stitch together separate libraries. The framework is Apache 2.0 licensed and runs on any Node.js-compatible environment including Bun, Deno, and Cloudflare Workers.

Mastra is used in production by Replit (Agent 3), SoftBank, PayPal, Marsh McLennan, and Sanity, among others.

## When to use it

- You are building agents in TypeScript/JavaScript and want a framework built for that ecosystem (not a Python-first framework with a JS port)
- You need multi-step workflows with suspend/resume, human-in-the-loop, and replay — not just single-call agents
- You want built-in observability, evals, and guardrails rather than wiring them separately
- You need supervisor-agent patterns for splitting work across specialized agents
- You want a visual development studio (Mastra Studio) for testing, tracing, and prompt refinement

## What it does well

- **Unified primitives.** Agents, tools, memory, workflows, evals, and observability in one framework. This eliminates the "stitch together five libraries" problem that plagues many JS agent setups.

- **Type-safe workflows.** Workflows are fully typed with sequential steps, parallel branches, conditional logic, and loops. You get compile-time safety on your control flow, which catches errors that Python agent frameworks only find at runtime.

- **Human-in-the-loop is first-class.** Any workflow step can suspend execution, hand control to a human, and resume when input arrives. State is persisted automatically — suspend today, resume next week.

- **Rewind and replay.** Workflow state is snapshotted at every step. You can time-travel back to any step with its original context to debug or replay from a specific point. This is genuinely useful for post-mortem analysis.

- **Mastra Studio.** A visual development environment where you run agents, trace execution, edit prompts, and create eval datasets. Non-technical team members (product managers, domain experts) can refine prompts and annotate traces without writing code. This is a real differentiator — most agent frameworks have no equivalent.

- **Observational Memory.** Mastra's memory system goes beyond simple message persistence. It learns about users across sessions and provides context-aware recall, reducing the need for manual context engineering.

- **Model-agnostic.** Connect to 1000+ models through a unified router. Switching providers is a configuration change, not a rewrite.

- **MCP integration.** Tools can be defined and shared via MCP, so your Mastra agents can use the same MCP servers as your Hermes, Claude, or other framework agents.

- **Tool approval gates.** Require human or external approval before any tool call executes — a governance pattern most frameworks leave to you to implement.

## Honest limitations

- **TypeScript-only.** If your team is Python-first, Mastra is the wrong choice. Pydantic AI, CrewAI, or LangChain serve Python teams better. Mastra does not have a Python SDK.

- **Younger than LangChain.** The ecosystem of community integrations, tutorials, and Stack Overflow answers is smaller. You will read official docs and source code more often than community posts.

- **Enterprise features are custom-priced.** The framework is free and open source. But RBAC, SSO, IAM integration, and enterprise observability are behind the Enterprise tier, which is "contact sales." No public per-seat or per-trace pricing for managed features.

- **Studio is a development tool, not a production dashboard.** Mastra Studio is excellent for development and testing. For production monitoring at scale, you may still want to integrate with an external observability platform (Langfuse, Datadog) for alerting and long-term retention.

- **Workflow complexity has a learning curve.** The type-safe workflow system is powerful but has its own mental model — steps, suspend/resume, snapshots. Teams used to simple chain-of-calls patterns will need time to learn it.

- **No built-in code execution sandbox.** If your agents need to write and execute code (like smolagents), Mastra does not provide this natively. You would integrate an external sandbox (E2B, Modal, Daytona).

## Pricing reality

- **Free tier:** Apache 2.0 licensed. Build and host agents anywhere. No feature gating on the core framework — agents, workflows, memory, tools, evals, and tracing are all free.
- **Enterprise tier:** Custom pricing. Adds RBAC, SSO, IAM, network policy integration, and guaranteed data stays in your VPC. One flat annual fee — no per-trace or per-seat metering.
- **Mastra Cloud:** Managed hosting for Mastra projects. Pricing not publicly listed as of August 2026.

> Pricing verified against mastra.ai on 2026-08-12. Enterprise pricing requires a sales conversation.

## Best fit

TypeScript teams building production agent systems who want a single framework that covers agents, workflows, memory, evals, and observability without stitching together separate libraries. Particularly strong for teams that need human-in-the-loop workflows, multi-agent supervisor patterns, or a visual development studio for non-technical collaborators.

Not the right choice for Python-first teams, teams that need code-execution agents, or teams that want the largest community ecosystem (use LangChain for that).