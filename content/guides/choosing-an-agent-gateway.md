---
slug: choosing-an-agent-gateway
title: "Choosing an Agent Gateway: MCP, A2A, and LLM Traffic Management"
excerpt: "A practical guide to selecting between agentgateway, Portkey, LiteLLM, Helicone, and other AI gateways based on your protocol needs, deployment model, and governance requirements."
category: Guides
tags:
  - gateway
  - mcp
  - a2a
  - infrastructure
  - routing
  - cost-control
order: 99
last_verified: "2026-08-12"
---

# Choosing an Agent Gateway: MCP, A2A, and LLM Traffic Management

## Why you need an agent gateway

As agents move from prototypes to production, the traffic between agents, tools, and LLM providers becomes a critical infrastructure layer. Without a gateway, you face:

- **No cost controls**: Agents can burn through API budgets with no automatic cutoff
- **No tool access governance**: Any agent can call any tool, including destructive operations
- **No protocol normalization**: MCP, A2A, and direct LLM API calls each need separate handling
- **No observability**: You can't see which agent called which tool, when, or at what cost
- **No failover**: A single provider outage takes down all agents

An agent gateway sits between your agents and everything they touch — LLM APIs, MCP tool servers, and other agents via A2A — and provides routing, policy, cost controls, and observability.

## The decision framework

### 1. What protocols do you need to manage?

| Protocol | What it connects | When you need it |
|----------|-----------------|------------------|
| LLM API proxying | Agents → LLM providers | Always (unless fully self-hosted) |
| MCP routing | Agents → tool servers | When you use MCP tools (filesystem, databases, APIs) |
| A2A routing | Agents → other agents | When you orchestrate multi-agent workflows across vendors |

If you only need LLM API proxying, a lightweight gateway (LiteLLM, Portkey) is sufficient. If you need MCP and A2A routing, you need a protocol-aware gateway (agentgateway).

### 2. What is your deployment model?

| Model | Best for | Examples |
|-------|----------|----------|
| Managed SaaS | Teams without infra experience | Portkey, Helicone |
| Self-hosted (Docker) | Teams with a single server | LiteLLM, agentgateway standalone |
| Kubernetes-native | Platform teams in cloud-native environments | agentgateway |
| BYOC (Bring Your Own Cloud) | Regulated industries | agentgateway on your cluster, Northflank |

### 3. What governance do you need?

- **Cost controls**: Per-team budgets, automatic cutoff, spend alerts
- **RBAC**: Which agents can call which tools, with which operations
- **Audit logging**: Who called what, when, with what result
- **Foundation governance**: Linux Foundation vs vendor-controlled matters for procurement and compliance

### 4. What is your scale?

- **Single team, few agents**: A lightweight gateway is enough
- **Multi-team, many agents**: You need RBAC, per-team budgets, and observability
- **Enterprise, regulated**: You need BYOC, audit trails, and foundation governance

## The gateways compared

### agentgateway (Solo.io / Linux Foundation)

- **Protocols**: MCP, A2A, LLM inference
- **Deployment**: Kubernetes-native, standalone
- **Governance**: Linux Foundation (vendor-neutral)
- **Data plane**: Rust (high performance)
- **Policy engine**: CEL-based RBAC for MCP tools
- **Cost controls**: Per-team budgets with automatic rejection
- **Best for**: Platform teams running agents in Kubernetes who need MCP/A2A protocol awareness and foundation governance

### Portkey AI Gateway

- **Protocols**: LLM inference (broad provider support)
- **Deployment**: Managed SaaS, self-hosted
- **Governance**: Vendor-controlled
- **Best for**: Teams that need broad LLM provider support and managed SaaS, without MCP/A2A protocol needs

### LiteLLM Gateway

- **Protocols**: LLM inference (OpenAI-compatible API)
- **Deployment**: Self-hosted (Python, Docker)
- **Governance**: Open-source (MIT)
- **Best for**: Teams that need a simple, Python-based LLM proxy with cost tracking and failover, without MCP/A2A protocol support

### Helicone AI Gateway

- **Protocols**: LLM inference
- **Deployment**: Managed SaaS
- **Governance**: Vendor-controlled
- **Strength**: Observability and analytics
- **Best for**: Teams that prioritize observability and analytics over gateway policy depth

## Decision tree

1. **Do you use MCP tools or A2A agents?**
   - Yes → You need agentgateway (the only gateway with native MCP + A2A support)
   - No → Continue

2. **Do you run in Kubernetes?**
   - Yes → agentgateway (Kubernetes Gateway API integration)
   - No → Continue

3. **Do you need managed SaaS or self-hosted?**
   - Managed SaaS → Portkey or Helicone
   - Self-hosted → LiteLLM (simple) or agentgateway standalone (full-featured)

4. **Is foundation governance required for procurement?**
   - Yes → agentgateway (Linux Foundation) or LiteLLM (MIT)
   - No → Any option works

5. **Is observability your primary need?**
   - Yes → Helicone
   - No → Continue with cost/policy-focused options

## Common patterns

### Pattern 1: Simple LLM proxy
LiteLLM in Docker, proxying OpenAI/Anthropic/Google APIs, with cost tracking. No MCP, no A2A. Works for teams with a few agents calling LLM APIs directly.

### Pattern 2: Full agent infrastructure
agentgateway on Kubernetes, managing MCP tool routing, A2A agent communication, per-team budgets, and LLM inference. Works for platform teams running many agents with tool access.

### Pattern 3: Observability-first
Helicone as a managed proxy in front of your LLM calls, with agentgateway for MCP/A2A if needed. Works for teams that need deep analytics on agent behavior.

## The takeaway

The agent gateway market is differentiating along protocol support (MCP/A2A vs LLM-only), deployment model (managed vs self-hosted vs Kubernetes-native), and governance (foundation vs vendor). Match the gateway to your protocol needs first, then optimize for deployment model and governance.