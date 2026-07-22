---
slug: ferrogate-self-hosted-gateway
title: Deploy Ferrogate as a Self-Hosted AI Gateway
excerpt: Stand up a Rust-based AI gateway with provider routing, virtual API keys, budget enforcement, and MCP tool execution — a high-performance alternative to LiteLLM or Portkey.
category: Model Serving
tags:
  - gateway
  - self-hosting
  - rust
  - llm-proxy
  - api-keys
  - production
order: 99
last_verified: "2026-07-22"
difficulty: Advanced
estimated_time: "60 min"
---

# Deploy Ferrogate as a Self-Hosted AI Gateway

## The promise

Ferrogate is an open-source AI gateway built in Rust on Cloudflare's Pingora framework. Deploy it as a reverse proxy in front of your LLM providers to get provider routing, virtual API keys, per-key budgets, response caching, MCP tool execution, and observability — all self-hosted, no third-party SaaS dependency.

## What you will get

- An OpenAI-compatible endpoint your agents can target as a single base URL
- Provider routing with fallback chains (e.g., primary → OpenAI, fallback → DeepSeek)
- Virtual API keys with per-key budget enforcement and usage tracking
- Exact-match response caching to reduce redundant inference costs
- MCP tool execution proxied through the gateway
- An admin dashboard for key management and observability
- Automatic HTTPS with TLS termination

## Prerequisites

- A server with Rust toolchain installed (Cargo 1.75+)
- API keys for at least two LLM providers (for fallback routing)
- A domain name or subdomain for the gateway
- Basic familiarity with YAML configuration

## Steps

1. **Clone and build.**
   ```bash
   git clone https://github.com/lianluo-esign/ferrogate
   cd ferrogate
   cargo build --release
   ```

2. **Create a configuration file.** Ferrogate uses YAML for configuration. Define your providers, routing rules, cache settings, and admin credentials.

   ```yaml
   providers:
     - name: openai
       api_key: ${OPENAI_API_KEY}
       base_url: https://api.openai.com/v1
     - name: deepseek
       api_key: ${DEEPSEEK_API_KEY}
       base_url: https://api.deepseek.com/v1

   routing:
     default:
       primary: openai
       fallback: deepseek

   cache:
     enabled: true
     type: exact-match
     ttl: 3600

   admin:
     username: admin
     password: ${ADMIN_PASSWORD}
   ```

3. **Launch the gateway.**
   ```bash
   ./target/release/ferrogate --config config.yaml
   ```

4. **Create virtual API keys.** Use the admin dashboard or CLI to issue scoped keys for different teams or projects. Set per-key budgets and rate limits.

5. **Point your agents at the gateway.** Set your agents' `base_url` to `http://your-gateway:port/v1`. Agents see a standard OpenAI-compatible API — no code changes needed.

6. **Enable MCP tool execution (optional).** Configure MCP tool endpoints in the gateway config. Tool calls are now proxied and logged through Ferrogate.

7. **Set up TLS.** Ferrogate handles automatic HTTPS via its built-in TLS termination. Point your domain at the gateway and configure the certificate settings.

## Post-deployment

- **Monitor usage:** Check the admin dashboard for per-key token usage and cost tracking.
- **Tune cache:** Monitor cache hit rates and adjust TTL based on your workload patterns.
- **Add providers:** As you onboard new LLM providers, add them to the config and update routing rules.
- **Set up alerting:** Wire Ferrogate's observability endpoints into your existing monitoring stack (Prometheus/Grafana or equivalent).

## Limitations

- Rust build required — no pre-compiled binaries yet.
- New project (mid-2026) — documentation is still maturing.
- No managed cloud offering — strictly self-hosted.
- Cluster mode requires additional infrastructure (not covered in this recipe).

## Resources

- **GitHub:** [lianluo-esign/ferrogate](https://github.com/lianluo-esign/ferrogate)
- **Language:** Rust (Pingora framework)