---
slug: litellm-proxy-multi-provider
title: LiteLLM Proxy for Multi-Provider Routing
excerpt: Put one OpenAI-compatible proxy in front of OpenAI, Anthropic, Gemini, and local endpoints so agents can switch models with config, not code rewrites.
category: Gateways
tags:
  - litellm
  - gateway
  - multi-provider
  - openai-compatible
  - agents
order: 19
last_verified: "2026-07-13"
difficulty: Intermediate
estimated_time: "30 min"
---

# LiteLLM Proxy for Multi-Provider Routing

## The promise

Agents and tools speak OpenAI-style APIs. Providers do not. LiteLLM proxy gives you a single base URL and model aliases across clouds and local servers.

## What you will get

- One endpoint for mixed providers
- Model aliases like `smart`, `cheap`, `local-coder`
- A place to attach logging and spend limits later

## Prerequisites

- API keys for the providers you will route to
- Optional local OpenAI-compatible server (vLLM, Ollama-compatible gateway, etc.)
- Python environment or Docker for LiteLLM proxy

## Steps

1. **Install LiteLLM proxy** via the current upstream recommended method.
2. **Create a config** mapping model aliases to provider model ids.
3. **Export provider keys** in the environment (never commit them).
4. **Start the proxy** on a local port.
5. **Point one agent client** at the proxy base URL and call an alias.

Illustrative config shape:

```yaml
model_list:
  - model_name: cheap
    litellm_params:
      model: openai/gpt-4o-mini
  - model_name: smart
    litellm_params:
      model: anthropic/claude-opus-4-8
```

## Verification

- `curl` chat completion against an alias
- Confirm the upstream provider dashboard shows the request
- Fail closed when a key is missing (do not silently fall through to the wrong model)

## Troubleshooting

- **401/403:** wrong key or org permissions
- **Model not found:** alias vs upstream id mismatch
- **Tool calls fail for one provider only:** schema differences — test tool-use per provider

## Honest notes

A proxy is not governance. Approval gates, allowlists, and spend caps still belong in the agent broker or gateway policy layer.
