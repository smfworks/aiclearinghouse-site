---
slug: choosing-an-agent-browser-2026
title: "Choosing an Agent Browser in 2026: Kitesurf vs Browserbase vs Self-Hosted"
excerpt: "Three approaches to agent browser automation — Cloudflare's V8-isolate Kitesurf, managed Chromium via Browserbase, and self-hosted Playwright. Which fits your stack?"
category: Guides
tags:
  - browser-automation
  - agents
  - infrastructure
  - cloudflare
  - browserbase
  - comparison
order: 99
last_verified: "2026-08-19"
---

# Choosing an Agent Browser in 2026: Kitesurf vs Browserbase vs Self-Hosted

## The decision

Your agent needs to navigate the web — take screenshots, extract HTML, fill forms, click buttons. You have three viable approaches in 2026:

1. **Cloudflare Kitesurf** — V8 isolates, not Chromium. 3-7x less CPU and memory. Agent-first. Beta.
2. **Browserbase** — Managed Chromium in the cloud. Stealth, session persistence, CDP-compatible. Production-ready.
3. **Self-hosted Playwright** — Your own browser cluster. Maximum control, maximum operational burden.

The right choice depends on what you are optimizing for: cost, fidelity, scale, or control.

## Comparison

| Dimension | Cloudflare Kitesurf | Browserbase | Self-Hosted Playwright |
|-----------|-------------------|-------------|------------------------|
| **Engine** | V8 isolates (not Chromium) | Full Chromium | Full Chromium |
| **CPU/Memory** | 3-7x less than Chromium | Standard Chromium overhead | Standard Chromium overhead |
| **Visual fidelity** | Trade-off: lower fidelity for efficiency | Full Chromium fidelity | Full Chromium fidelity |
| **CDP-compatible** | Yes (in design; verify coverage in beta) | Yes, fully | Yes, natively |
| **Puppeteer/Playwright** | Intended to work with minimal changes | Yes, drop-in | Yes, native |
| **Session persistence** | Via Cloudflare Durable Objects | Yes, by session ID | You build it |
| **Stealth / anti-bot** | Not a focus area | Built in | You configure it |
| **Scale** | Cloudflare's global network | Managed, scales on demand | You manage the cluster |
| **Self-hosting** | No — Cloudflare only | No — managed service | Yes — full control |
| **Pricing** | Free during beta | Usage-based (~$0.005/session + compute) | Your hardware + ops cost |
| **Maturity** | Beta (August 2026) | Production | Production |
| **Best for** | Lightweight agent web tasks at scale | Production agent web automation with stealth | Teams with DevOps capacity and strict data control |

## When to choose Kitesurf

- Your agent does lightweight web tasks: screenshots, HTML extraction, simple navigation
- You are already in the Cloudflare ecosystem (Workers, Durable Objects, Computer)
- You want to minimize per-session cost and resource overhead
- You can tolerate beta-level reliability and CDP coverage gaps
- You do not need pixel-perfect rendering or complex JavaScript execution

**Risk**: Beta status means the feature set and CDP coverage may change. Do not build production dependencies without testing your specific use case.

## When to choose Browserbase

- Your agent needs full Chromium fidelity — complex JavaScript, pixel-perfect rendering
- You need stealth and anti-bot detection for sites that block automation
- You want session persistence across multi-step agent tasks
- You need production reliability today, not in beta
- You do not want to operate browser infrastructure

**Risk**: Usage-based costs add up at scale. Less control than self-hosted for fine-tuned browser configuration.

## When to choose self-hosted Playwright

- You have DevOps capacity to operate a browser cluster
- You need maximum control over browser configuration, proxies, and network
- Your data cannot leave your infrastructure (data residency, compliance)
- You are running at very high volume where managed services become expensive
- You need custom browser extensions or modifications

**Risk**: Operational burden — you manage updates, scaling, crash recovery, and security. Browser clusters are surprisingly hard to operate at scale.

## Hybrid approach

You do not have to pick one. A common 2026 pattern:

- **Kitesurf** for lightweight, high-volume web tasks (HTML extraction, screenshot monitoring)
- **Browserbase** for complex, low-volume tasks that need full Chromium and stealth
- **Self-hosted Playwright** for tasks with strict data residency requirements

Route by task type using a model router or a simple task classifier. The cost savings from using Kitesurf for lightweight tasks can fund the Browserbase budget for complex ones.

## Decision framework

1. **What is your task type?** Lightweight (screenshots, HTML) → Kitesurf. Complex (JS, forms, stealth) → Browserbase. Specialized (custom config, data residency) → Self-hosted.
2. **What is your scale?** High volume → Kitesurf for cost efficiency. Low volume → Browserbase for simplicity. Any volume with DevOps → Self-hosted.
3. **What is your reliability tolerance?** Production today → Browserbase or self-hosted. Can tolerate beta → Kitesurf.
4. **What is your data residency requirement?** Must stay on your infrastructure → Self-hosted. Cloud is fine → Kitesurf or Browserbase.
5. **What is your budget?** Free during beta → Kitesurf. Usage-based → Browserbase. Hardware you already own → Self-hosted.

## Related

- [Cloudflare Kitesurf](/services/cloudflare-kitesurf) — the service
- [Browserbase](/services/browserbase) — the service
- [Cloudflare Computer Agent Sandbox](/deployment-recipes/cloudflare-computer-agent-sandbox) — deployment recipe for Kitesurf's parent platform