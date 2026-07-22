---
slug: ferrogate
title: "Ferrogate: Self-Hosted AI Gateway"
excerpt: "Open-source Rust/Pingora AI gateway for self-hosted LLM traffic control — provider routing, virtual API keys, budgets, caching, MCP tool execution, and observability."
category: Infrastructure
tags:
  - ai-gateway
  - self-hosting
  - llm-proxy
  - mcp
  - rust
  - open-source
provider: Lianluo E-Sign
pricing_model: Self-hosted (free)
price: "Free / open-source"
website: https://github.com/lianluo-esign/ferrogate
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-07-22"
---

# Ferrogate: Self-Hosted AI Gateway

## What it is

Ferrogate is an open-source AI gateway and reverse proxy built in Rust on top of Pingora. It gives you production-grade LLM traffic control for self-hosted deployments: OpenAI-compatible Chat/Responses endpoints, multi-provider routing with fallback, virtual API keys, per-key budgets, exact-match caching, MCP tool execution, observability, an admin dashboard, cluster operations, and automatic HTTPS.

## When to use it

- You need a self-hosted alternative to LiteLLM or Portkey with stronger performance characteristics.
- You want provider routing and fallback without sending traffic through a third-party SaaS.
- You need per-team or per-project API key management with budget enforcement.
- You want to cache LLM responses at the gateway level to reduce costs.
- You need MCP tool execution proxied through your gateway.

## What it does well

- **Rust + Pingora performance.** Built on Cloudflare's Pingora framework — async, zero-copy, high throughput.
- **OpenAI-compatible API.** Drop-in base URL for agents and tools that speak OpenAI protocol.
- **Provider routing.** Route requests to different providers with fallback chains and load balancing.
- **Virtual API keys.** Issue scoped keys with per-key budgets, rate limits, and usage tracking.
- **Exact-match cache.** Cache identical requests to avoid redundant inference costs.
- **MCP tool execution.** Proxy and execute MCP tool calls through the gateway.
- **Observability.** Built-in request tracing and an admin dashboard for monitoring.
- **Automatic HTTPS.** TLS termination handled by the gateway itself.
- **Cluster ops.** Designed for multi-node deployments, not just single-instance.

## Limitations

- New project (launched mid-2026) — smaller community than LiteLLM or Portkey.
- Rust expertise helpful for deep customization or contribution.
- Documentation is still maturing compared to established gateways.
- No managed cloud offering — strictly self-hosted.

## How to get started

Clone the repository, build with Cargo, and configure providers via YAML. The admin dashboard provides a UI for key management and monitoring.

- **GitHub:** [lianluo-esign/ferrogate](https://github.com/lianluo-esign/ferrogate)
- **Language:** Rust
- **License:** See repository