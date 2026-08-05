---
slug: vllm-semantic-router-deploy
title: Deploy vLLM Semantic Router for Mixture-of-Models Routing
excerpt: Stand up the vLLM Semantic Router in front of your LLM backends to automatically route requests by intent, cache semantically, and filter unsafe inputs.
category: Model Serving
tags:
  - vllm
  - routing
  - cost-optimization
  - self-hosting
  - production
order: 99
last_verified: "2026-08-05"
difficulty: Advanced
estimated_time: "45 min"
---

# Deploy vLLM Semantic Router for Mixture-of-Models Routing

## The promise

Run an intelligent router in front of your LLM backends that classifies each request by intent and complexity, routes it to the right model, caches semantically, and filters unsafe inputs — all self-hosted and open-source.

## What you will get

- A Go-based ExtProc router behind an Envoy proxy
- Automatic model selection per request based on intent signals
- Semantic caching to reduce redundant inference costs
- Built-in jailbreak detection and PII filtering

## Prerequisites

- A machine or cluster running vLLM or any OpenAI-compatible inference server
- At least two model backends (e.g., a cheap model and a frontier model)
- Docker and basic Envoy proxy familiarity
- Go 1.21+ for building the router (or use pre-built containers)

## Steps

1. **Clone the repository.**

```bash
git clone https://github.com/vllm-project/semantic-router.git
cd semantic-router
```

2. **Configure your model backends.** Define the models you want to route between in the router config. Each backend needs a name, endpoint, and role (e.g., `triage`, `reasoning`, `coding`).

3. **Configure routing signals.** Define the signals the router uses to classify requests: intent classification, complexity estimation, and safety checks. The MoM family of models provides pre-trained classifiers for these tasks.

4. **Start the Envoy proxy with ExtProc.** The router runs as an Envoy External Processor. Configure Envoy to forward LLM requests through the ExtProc filter.

```bash
# Illustrative — check the repo's installation guide for your version
envoy -c envoy-config.yaml --concurrency 4
```

5. **Start your model backends.** Launch vLLM instances for each model tier:

```bash
# Cheap tier
vllm serve <small-model> --port 8001

# Frontier tier
vllm serve <large-model> --port 8002
```

6. **Smoke test.** Send a simple query and a complex query. Verify the router sends them to different backends.

```bash
curl http://localhost:8899/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"auto","messages":[{"role":"user","content":"What is 2+2?"}]}'
```

7. **Enable semantic caching.** Configure the cache backend (Redis or in-memory) to store responses by semantic hash. Monitor cache hit rates and adjust TTL.

## Verification

- Simple queries route to the cheap model; complex queries route to the frontier model
- Semantic cache hit rate is non-zero for repeated query patterns
- Safety filter blocks known jailbreak patterns
- Per-model token usage logs show cost distribution across tiers

## Troubleshooting

- **All requests go to one model:** Check your signal thresholds — the complexity classifier may be misconfigured
- **Cache hit rate is zero:** Verify the embedding model is loaded and cache TTL is not zero
- **Envoy crashes on startup:** Check ExtProc configuration and ensure the Go router binary is in the expected path
- **High latency:** The router adds classification overhead. Profile the classifier model — it should be small and fast

## Honest notes

vLLM Semantic Router is actively developed (v0.3 Themis as of June 2026). Configuration options change between releases. Treat this recipe as the workflow — always re-read the upstream installation guide for your specific version before deploying.