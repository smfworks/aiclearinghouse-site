---
slug: air-security-firewall
title: "AIR Security: Inline Firewall for AI Agents"
excerpt: "Sequoia/Greenoaks-backed inline firewall that discovers and screens every skill, plugin, MCP server, and add-on entering an agent's context before the agent acts — blocking malicious instructions, untrusted data, and compromised tools at runtime."
category: Security
tags:
  - agent-security
  - prompt-injection
  - firewall
  - mcp
  - supply-chain
  - enterprise
provider: AIR Security Inc.
pricing_model: Subscription
price: "Enterprise pricing (contact vendor)"
website: https://air.security
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-09"
---

# AIR Security: Inline Firewall for AI Agents

## What it is

AIR (AIR Security Inc.) emerged from stealth on September 1, 2026 with $50M in funding led by Sequoia Capital and Greenoaks. The product is an inline firewall for AI agents — it sits in the path between external tools/data and the agent's context, screening instructions, tools, and data *before* the agent acts on them.

The core thesis: agents autonomously install skills, plugins, and MCP servers from sources no security team has reviewed. AIR continuously discovers and evaluates every component in an organization's AI agent supply chain, before and after deployment, and blocks malicious or unapproved add-ons at runtime.

## When to use it

- You have coding or business agents reaching for third-party skills, plugins, or MCP servers without security review
- You need to inventory every AI agent running across endpoints, cloud accounts, and SaaS apps
- A skill that passed review months ago may have been rewritten by its maintainer — you need continuous re-verification, not a one-time scan
- You are in a regulated industry (financial services and pharma are the strongest early adopters) where agent actions carry compliance weight

## What it does well

- **Discovery first.** Maps every agent already running across endpoints, cloud, and SaaS, then keeps re-checking the components those agents depend on.
- **Inline context screening.** Filters instructions, tools, and data heading into an agent's context before the agent acts — blocking prompt-injection payloads and compromised tool output at the boundary.
- **Continuous re-verification.** A skill that passed review in March can be rewritten in June. AIR re-evaluates continuously rather than treating approval as permanent.
- **Trace and revoke.** When an add-on is found to be malicious, vulnerable, or unapproved, AIR traces every agent and workflow that depends on it and revokes it across the organization.
- **Pre-vetted marketplace.** Provides a marketplace of add-ons already cleared, giving teams a safe path to expand agent capabilities.
- **Supply-chain research baked in.** AIR's own research uncovered 17,800 public AI add-ons (6.7M installations) drawing from unverified external sources, plus skills impersonating Anthropic and OpenAI capable of running arbitrary code. ~27% of online add-ons get filtered out.

## Honest limitations

- **Early-stage company**: launched September 2026; ~20 customers, about a quarter are large enterprises. Product maturity still developing.
- **Enterprise sales motion**: no self-serve pricing; contact vendor.
- **Not a replacement for endpoint or network security**: it is a new layer focused specifically on agent context and supply chain, not a substitute for existing controls.
- **US-centric launch**: hiring and sales focused on US and Europe initially.

## Best fit

Security teams at enterprises where coding and business agents are already deployed at scale and where the agent supply chain (skills, plugins, MCP servers) is unmanaged. Strongest early demand from financial services and pharmaceutical firms. Not for teams that are still in single-agent pilot mode — the discovery and governance value scales with the number of agents and add-ons in production.