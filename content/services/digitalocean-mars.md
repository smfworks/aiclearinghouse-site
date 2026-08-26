---
slug: digitalocean-mars
title: "DigitalOcean M.A.R.S.: Managed Agents Runtime Services"
excerpt: "A fully managed runtime for coding agents and long-running agentic workflows — durable sessions in Firecracker microVMs, governed tool access via Action Gateway, and harness flexibility for Claude Code, Codex, LangGraph, and CrewAI."
category: Agent Infrastructure
tags:
  - managed-runtime
  - agent-infrastructure
  - firecracker
  - durable-sessions
  - governance
  - coding-agents
provider: DigitalOcean
pricing_model: Usage-based (Private Preview)
price: "Pricing TBD — currently invite-only Private Preview"
website: https://www.digitalocean.com/blog/managed-agents-runtime-services-private-preview
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-26"
---

# DigitalOcean M.A.R.S.: Managed Agents Runtime Services

## What it is

DigitalOcean Managed Agents Runtime Services (M.A.R.S.) is a fully managed infrastructure layer for operating coding agents and long-running, multi-tool agentic workflows. It launched in Private Preview in August 2026 and addresses the core problem of running agents in production: you need durable execution environments, session persistence, secure tool access, human-in-the-loop approvals, and observability — all without building and managing the underlying infrastructure yourself.

M.A.R.S. combines two products:

- **Harness Runtime**: The managed execution environment where agents run, persist, and scale. Sessions start in under a second and resume from pause in 200 milliseconds while preserving files, processes, and working state.
- **Action Gateway**: Governed access to external tools, APIs, and SaaS systems. Authentication, permissions, approvals, and audit controls are managed centrally. OAuth credentials are brokered through Secrets Manager and are never exposed to the model or the execution environment.

## Key capabilities

- **Durable sessions**: Pause and resume work without losing the session's environment or state. Continue from another device, hand work to a teammate mid-task, or run multiple agents in parallel.
- **Isolated execution**: Each session runs inside a dedicated Firecracker microVM, separating agent-generated code from local machines and shared infrastructure.
- **Human approvals**: Define which actions agents take autonomously and which require sign-off. Configurable per-tool and per-session.
- **Native GitHub support**: Agents can clone repositories, create branches, commit changes, and open pull requests.
- **Managed tool access**: Connect agents to GitHub, Jira, Notion, Linear, Postgres, and other systems through centrally governed authentication and policy controls.
- **Harness flexibility**: Works with Claude Code, Codex CLI, OpenCode, and agents built with LangGraph or CrewAI. No proprietary framework lock-in.

## Who it's for

M.A.R.S. targets developers, teams, and ISVs who want to run coding agents in production without building the execution, persistence, isolation, scaling, and governed access layers from scratch. It is especially relevant for teams that have working agent prototypes but struggle to move them to durable, multi-user, production-grade deployments.

## How it works

Rather than requiring you to rebuild your agent around a proprietary framework, M.A.R.S. lets you define an environment template that packages your preferred harness, dependencies, tools, and configuration. The runtime manages the Firecracker microVM lifecycle, session persistence, and the Action Gateway's authentication and policy enforcement underneath.

The 200ms resume time is the standout technical detail. It means a paused agent session — with its files, processes, and working state intact — can be resumed nearly instantly, whether by the same user on a different device, a teammate, or a scheduled trigger. This is what makes long-running, multi-step agent workflows practical without keeping a process alive continuously.

## Limitations

- **Private Preview** — invite-only access. Request through DigitalOcean.
- **Pricing** not yet published.
- **Supported harnesses** are coding-agent-focused (Claude Code, Codex CLI, OpenCode, LangGraph, CrewAI). Custom harnesses may require additional integration work.

## Alternatives to consider

- **Temporal Agent Harness** — open-source, durable execution, more control but more setup
- **LangChain Managed Deep Agents** — public beta, LangSmith-integrated, TypeScript/Python
- **Self-managed Firecracker** — maximum control, maximum operational burden