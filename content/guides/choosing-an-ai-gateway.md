---
slug: choosing-an-ai-gateway
title: "Choosing an AI Gateway: LiteLLM vs Portkey vs Ferrogate vs OpenRouter"
excerpt: "Compare self-hosted and managed AI gateways for LLM traffic control — provider routing, caching, key management, observability, and cost."
category: Guides
tags:
  - gateway
  - llm-proxy
  - comparison
  - infrastructure
  - cost
  - self-hosting
order: 99
last_verified: "2026-07-22"
---

# Choosing an AI Gateway: LiteLLM vs Portkey vs Ferrogate vs OpenRouter

## Why you need a gateway

If your agent stack calls LLM APIs directly, you will eventually hit these problems:

- **Vendor lock-in.** Switching from OpenAI to DeepSeek requires code changes across your codebase.
- **No budget control.** A runaway agent can burn through your API budget in minutes.
- **No fallback.** When OpenAI has an outage, your agents are dead.
- **No observability.** You cannot see which agents, which tasks, or which users are consuming the most tokens.
- **Key management chaos.** API keys hardcoded in environment variables, shared across services, with no per-team scoping.

An AI gateway sits between your agents and the LLM providers, solving all of these problems.

## Comparison

| Feature | LiteLLM | Portkey | Ferrogate | OpenRouter |
|---------|---------|---------|-----------|------------|
| **Deployment** | Self-hosted or managed | Managed (SaaS) | Self-hosted only | Managed (SaaS) |
| **Language** | Python | TypeScript | Rust | N/A (API only) |
| **Provider routing** | Yes | Yes | Yes | Yes (built-in) |
| **Fallback chains** | Yes | Yes | Yes | No |
| **Virtual API keys** | Yes | Yes | Yes | No |
| **Budget enforcement** | Yes | Yes | Yes | No |
| **Response caching** | Yes (Redis) | Yes | Yes (exact-match) | No |
| **MCP tool execution** | No | No | Yes | No |
| **Observability** | Via Langfuse/Slack | Built-in | Built-in dashboard | Basic |
| **Admin UI** | Yes | Yes | Yes | No |
| **Open source** | Yes | Partial | Yes | No |
| **Cost** | Free (self-hosted) | $ + usage | Free | % of usage |

## When to choose each

### LiteLLM — the safe default

Choose LiteLLM if you want a mature, well-documented, Python-based gateway with a large community. It supports 100+ providers, has a managed option, and integrates with Langfuse for observability. The trade-off: Python performance is lower than Rust-based alternatives, and the feature set is broad but not always deep.

### Portkey — the managed choice

Choose Portkey if you do not want to operate infrastructure. It is a managed SaaS with strong observability, caching, and guardrails built in. The trade-off: your LLM traffic flows through a third party, and you pay a managed-service premium.

### Ferrogate — the performance choice

Choose Ferrogate if you need maximum throughput and low latency. Built in Rust on Cloudflare's Pingora framework, it is the fastest option for high-traffic self-hosted deployments. It is also the only gateway with built-in MCP tool execution. The trade-off: it is a new project (mid-2026) with a smaller community and less mature documentation.

### OpenRouter — the zero-ops choice

Choose OpenRouter if you want to skip gateway management entirely. It is a managed API that routes to multiple providers with a single API key. The trade-off: no virtual keys, no budget enforcement, no caching, and you pay a percentage on top of provider pricing. Best for prototyping, not production at scale.

## Decision framework

1. **Are you prototyping?** Use OpenRouter. Zero setup, instant multi-provider access.
2. **Do you need self-hosting (compliance, cost, control)?** Choose LiteLLM or Ferrogate.
3. **Is raw throughput critical (high-traffic production)?** Choose Ferrogate.
4. **Do you want managed without self-hosting?** Choose Portkey.
5. **Do you need MCP tool execution at the gateway?** Choose Ferrogate (only option with this feature).
6. **Are you already using Langfuse for observability?** Choose LiteLLM (best integration).

## What to avoid

- **No gateway at all.** Direct API calls from agents work for prototypes but do not scale. You will regret it at the first outage or budget overrun.
- **Building your own.** A simple proxy is easy; a production gateway with caching, key management, and observability is months of work. Use an existing project.
- **Using OpenRouter for production at scale.** The percentage-based pricing and lack of caching/budget controls make it expensive at high volume.