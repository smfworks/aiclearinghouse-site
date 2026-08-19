---
slug: cloudflare-kitesurf
title: "Cloudflare Kitesurf: Agent-First Browser"
excerpt: "Cloud-hosted browser built specifically for AI agents — runs in V8 isolates instead of Chromium, using 3-7x less CPU and memory per screenshot. Free during beta."
category: Infrastructure
tags:
  - browser-automation
  - agents
  - cloudflare
  - v8-isolates
  - web-navigation
provider: Cloudflare
pricing_model: Usage-based
price: "Free during beta (per-account limits apply)"
website: https://blog.cloudflare.com/kitesurf
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-19"
---

# Cloudflare Kitesurf: Agent-First Browser

## What it is

Kitesurf is Cloudflare's cloud-hosted browser built specifically for AI agents, launched on August 6, 2026. Unlike traditional headless browser solutions that run full Chromium instances, Kitesurf runs in V8 isolates on Cloudflare Workers — the same lightweight execution environment that powers Cloudflare's edge compute. The bet: software navigating the web does not always need the weight or visual fidelity of a full browser engine.

## When to use it

- Your agent needs to navigate websites, take screenshots, or extract HTML at scale
- You want to avoid the CPU and memory overhead of running Chromium instances per session
- You need CDP (Chrome DevTools Protocol) compatibility for existing Puppeteer/Playwright code
- You are already in the Cloudflare ecosystem and want edge-proximate browser automation

## What it does well

- **Resource efficiency.** In Cloudflare's benchmark across 14 URLs (5 runs each), Kitesurf used 3.1x less CPU and 4.7x less memory per screenshot compared to a warm Chromium pool. The range was 3-7x depending on the task.
- **CDP-compatible.** Existing clients that speak Chrome DevTools Protocol — including Puppeteer, Playwright, and chrome-remote-interface — are intended to work without adopting a proprietary control protocol. Select Kitesurf at the CDP endpoint in Browser Run.
- **Agent-optimized.** Built for the two tasks agents run most: taking screenshots and extracting HTML. Not designed for human browsing fidelity.
- **Edge-proximate.** Runs on Cloudflare's global network, reducing latency for geographically distributed agent workloads.
- **Free during beta.** Available at no cost during the beta period, subject to per-account limits.

## Honest limitations

- **Beta status.** Kitesurf is in active beta — check the Cloudflare Blog and Browser Run docs for current WPT coverage, CDP support, and open-source availability before production use.
- **Trade-off: speed vs. fidelity.** Kitesurf trades visual fidelity for efficiency. It is not a drop-in replacement for Chromium when you need pixel-perfect rendering or complex JavaScript execution.
- **CDP coverage gaps.** While CDP-compatible in design, not all CDP endpoints may be fully implemented during beta. Test your specific client library against Kitesurf before migrating.
- **Not open-source yet.** Open-source availability has not been confirmed as of the August 2026 launch.
- **Vendor lock-in risk.** Runs exclusively on Cloudflare's infrastructure — no self-hosting option.

## Pricing reality

- Free during beta with per-account limits
- Post-beta pricing not yet announced — expect usage-based pricing aligned with Cloudflare Workers pricing model
- Compare against Browserbase and self-hosted Playwright for cost at scale

## Best fit

Agent builders who need scalable, lightweight web navigation without the overhead of full Chromium instances. Common pairings include web research agents, data extraction pipelines, and monitoring bots running on Cloudflare Workers.

## Common integrations

- **Cloudflare Computer** — Durable Object workspace that routes agent work across isolates and containers
- **Cloudflare Wallets** — programmable payments for agents that need to purchase data or access priced APIs
- **Puppeteer / Playwright** — existing CDP clients should work with minimal changes
- **Hermes Agent** — web research skills can delegate browser tasks to Kitesurf endpoints