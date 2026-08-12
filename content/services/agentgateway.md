---
slug: agentgateway
title: "agentgateway: Kubernetes-Native AI Gateway for MCP and A2A Traffic"
excerpt: "A Rust-based, Linux Foundation-governed gateway that unifies MCP tool routing, A2A agent communication, LLM inference proxying, and Kubernetes Gateway API — purpose-built for production agentic systems."
category: Infrastructure
tags:
  - gateway
  - mcp
  - a2a
  - kubernetes
  - routing
  - security
  - rust
provider: "Solo.io / Linux Foundation"
pricing_model: Open-source
price: "Free (MIT-licensed); enterprise support from Solo.io"
website: https://agentgateway.dev
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-12"
---

# agentgateway: Kubernetes-Native AI Gateway for MCP and A2A Traffic

## What it is

agentgateway is a Rust-based, AI-native gateway originally contributed by Solo.io to the Linux Foundation in August 2025. It has since evolved into a full-featured gateway that combines deep MCP (Model Context Protocol) and A2A (Agent-to-Agent) protocol awareness, robust traffic policy controls, inference gateway support, Kubernetes Gateway API support, and unified access to major LLMs.

The gateway targets platform engineers who own the deployment layer and want vendor-neutral governance with broad industry backing. It uses a Rust-based data plane for performance and a CEL-based policy engine for MCP tool RBAC.

## Core capabilities

- **MCP tool routing**: Route and manage Model Context Protocol server traffic with rate limiting, observability, and policy controls
- **A2A protocol support**: Native handling of Agent-to-Agent communication, enabling multi-agent orchestration across different vendors and clouds
- **Inference gateway**: Unified access to major LLMs with traffic management, cost controls, and budget enforcement
- **Kubernetes Gateway API**: Full integration with Kubernetes Gateway API for cloud-native deployments
- **Real-time cost controls**: Configurable budgets, approval workflows, and per-team spend limits with automatic rejection when budgets are exhausted
- **Built-in UI**: Explore agent-to-agent and agent-to-tool connections visually

## When to use it

- You are running agents in Kubernetes and need a production-grade gateway for MCP and A2A traffic
- You need RBAC policies on which agents can call which tools
- You want to enforce per-team or per-project AI budgets with automatic cutoff
- You need a vendor-neutral, foundation-governed alternative to proprietary AI gateways

## When to skip it

- You are running a single agent with no tool-routing complexity
- You need a fully managed SaaS gateway with no infrastructure to manage (consider Portkey or Helicone)
- Your team does not use Kubernetes

## Getting started

**Standalone quickstart:**

```bash
# Install agentgateway locally
agentgateway start --config agentgateway.yaml
```

**Kubernetes quickstart:**

Deploy using the built-in controller and Gateway API CRDs. See the official docs at agentgateway.dev/docs/kubernetes.

## Pricing

- **Open source**: MIT-licensed, free to use
- **Enterprise support**: Available from Solo.io

## Alternatives

- **Portkey AI Gateway** — managed SaaS, broader LLM provider support, no Kubernetes requirement
- **LiteLLM Gateway** — Python-based, simpler setup, lighter on MCP/A2A protocol support
- **Helicone AI Gateway** — observability-focused, less gateway policy depth