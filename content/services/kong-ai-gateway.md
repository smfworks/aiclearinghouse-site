---
slug: kong-ai-gateway
title: "Kong AI Gateway 2.0: Governed MCP, A2A, and LLM Traffic"
excerpt: "Kong's GA AI gateway with MCP Server Bundling, identity-aware policies, and native support for Microsoft Foundry, SageMaker, and Bedrock AgentCore."
category: Infrastructure
tags:
  - api-gateway
  - mcp
  - governance
  - routing
  - a2a
  - cost-control
provider: Kong Inc.
pricing_model: Usage-based + subscription
price: "Free open-source runtime; Kong Konnect subscription for control plane"
website: https://konghq.com/products/kong-ai-gateway
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-02"
---

# Kong AI Gateway 2.0: Governed MCP, A2A, and LLM Traffic

## What it is

Kong AI Gateway 2.0 is the generally available production release of Kong's AI traffic management platform, separated from the Kong API Gateway release train so it can ship at the speed of the AI ecosystem. It provides governed routing for LLM calls, MCP tool access, and A2A agent communication through a single gateway.

## Key features

- **MCP Server Bundling:** Collapse multiple MCP servers behind a single Kong route. The gateway handles the full MCP handshake, executes `tools/list` across all mapped upstream servers, and presents a unified tool catalog. Integrated with Kong's MCP ACL plugin, so two agents hitting the same route can see entirely different tool lists based on identity. Unauthorized tools are invisible at discovery time, not just blocked at execution.

- **Identity-aware AI policies:** Rate limiting, analytics, cost attribution, and model/route access control can all key on authenticated Kong Identity Principals — not just gateway-local Consumers. When an agent acts on behalf of a user or team, you can answer "who made this call" consistently across your Kong footprint.

- **Dynamic, modality-aware cost management:** A reusable pricing catalog supports text, audio, image, and video dimensions plus cache read/write fields. Per-target overrides take precedence by default, with an opt-in catalog-wins override.

- **Expanded provider coverage:** Native support for Kimi, Microsoft Foundry (consolidated Azure OpenAI + Azure AI Studio + Azure AI Services with path-prefix routing for OpenAI and Anthropic deployments), and Amazon SageMaker (TGI, TEI, HuggingFace Inference, LMI containers via OpenAI-compatible format).

- **AWS IAM auth for Bedrock AgentCore:** The `ai-a2a-proxy` and `ai-mcp-proxy` plugins now support declarative AWS SigV4 authentication for outbound requests to AgentCore Agents and MCP servers.

## When to use it

- You need MCP governance with per-caller tool visibility and access control.
- You are consolidating Azure AI workloads onto Microsoft Foundry and need schema-validated routing.
- You need identity-based cost attribution across agents acting on behalf of different users or teams.
- You want a single gateway for LLM, MCP, and A2A traffic with production support and compliance posture.

## What it does well

- **MCP governance that works like API governance** — one endpoint, one policy, per-caller access control.
- **Principal-aware policies** — cost showback, rate limiting, and access decisions keyed on organization-wide identity.
- **Migration tooling** — `kongctl` converts existing decK configurations to native AI Gateway 2.0 config.

## Pricing

- **Free tier:** Open-source runtime on Kong Gateway 3.x (LTS through 3.14).
- **Kong Konnect:** Subscription for the managed control plane. Create an AI Gateway control plane, connect providers, and route traffic in minutes.
- **Migration:** AI plugins remain supported in Kong Gateway 3.14 LTS. Kong Gateway 3.18 makes AI plugins opt-in — plan migration before then.