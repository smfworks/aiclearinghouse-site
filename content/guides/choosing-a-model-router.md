---
slug: choosing-a-model-router
title: "Choosing a Model Router: RouteLLM vs vLLM Semantic Router vs LiteLLM"
excerpt: "Three routers, three philosophies. This guide breaks down when to use each — from simple cost routing to full Mixture-of-Models with semantic caching and safety filtering."
category: Guides
tags:
  - routing
  - cost
  - benchmarking
  - models
  - infrastructure
order: 99
last_verified: "2026-08-05"
---

# Choosing a Model Router: RouteLLM vs vLLM Semantic Router vs LiteLLM

## Why this guide exists

Model routing is no longer optional. With the frontier being a cluster of models within 3 points of each other on most benchmarks but varying by 10x in price, the question is not "which model is best?" but "which model is best for this request?" A model router sits between your application and your model backends, making that decision automatically.

Three routers dominate the open-source landscape in 2026: RouteLLM, vLLM Semantic Router, and LiteLLM. They solve overlapping but distinct problems. This guide helps you pick the right one.

---

## The three routers at a glance

| | RouteLLM | vLLM Semantic Router | LiteLLM |
|---|---|---|---|
| **Primary use case** | Simple cost routing | Full Mixture-of-Models | Multi-provider API management |
| **Routing method** | ML classifier on request complexity | Signal-driven: intent, complexity, safety, cache | Rule-based (by model, cost, latency) |
| **Semantic caching** | No | Yes (built-in) | No (via plugins) |
| **Safety filtering** | No | Yes (jailbreak, PII, hallucination) | No |
| **Self-hosted inference** | No (API backends) | Yes (requires vLLM or OpenAI-compatible) | Yes (via proxy) |
| **Setup complexity** | Low | High | Medium |
| **Best for** | Quick cost savings on API spend | Production self-hosted multi-model | Teams using many API providers |

---

## RouteLLM — Simple Cost Routing

### What it is

RouteLLM uses a trained ML classifier to predict whether a request needs a frontier model or can be handled by a cheaper one. It routes based on a complexity threshold you set.

### When to pick it

- You use API-based models (OpenAI, Anthropic, etc.) and want to cut costs
- You want something running in under an hour
- You do not need semantic caching or safety filtering
- Your routing logic is binary: cheap model or expensive model

### When to skip it

- You self-host models with vLLM and want deeper integration
- You need semantic caching, safety filtering, or hallucination detection
- You have more than two tiers of models

---

## vLLM Semantic Router — Full Mixture-of-Models

### What it is

A Go-based ExtProc router that runs behind an Envoy proxy. It classifies requests by intent, complexity, and safety signals, then routes to the appropriate model backend. Includes semantic caching, jailbreak detection, PII filtering, and hallucination detection.

### When to pick it

- You self-host models with vLLM and want intelligent routing across them
- You need semantic caching to reduce redundant inference
- You want built-in safety filtering without a separate service
- You are running production agent infrastructure and need fine-grained control

### When to skip it

- You only use API-based models (no self-hosted backends)
- You need something running today without Envoy/Go configuration
- Your routing needs are simple enough for RouteLLM

---

## LiteLLM — Multi-Provider API Management

### What it is

LiteLLM is primarily an API gateway that normalizes 100+ LLM providers behind a single OpenAI-compatible interface. Its routing features are rule-based: route by model name, cost, latency, or fallback chain.

### When to pick it

- You use many API providers and need a unified interface
- You want rule-based routing (e.g., "try OpenAI first, fall back to Anthropic")
- You need budget tracking, rate limiting, and key management across providers
- You want a managed proxy option (LiteLLM Cloud) without self-hosting

### When to skip it

- You need signal-driven or ML-based routing (use RouteLLM or vLLM SR)
- You need semantic caching (not natively supported)
- You are only self-hosting models (vLLM SR is better integrated)

---

## How to decide

1. **If you just want to cut API costs quickly:** RouteLLM. Set a threshold, point it at your API keys, and start saving. You can migrate to something more sophisticated later.

2. **If you self-host models and want production-grade routing:** vLLM Semantic Router. It is the most powerful option but requires the most setup. The semantic caching and safety filtering are worth the complexity if you are running real production traffic.

3. **If you use many API providers and need unified management:** LiteLLM. It is the best API gateway with good-enough routing for most teams. Add RouteLLM in front of it if you need ML-based complexity routing.

4. **If you are not sure:** Start with LiteLLM. It gives you provider normalization, basic routing, and budget tracking. If you later need ML-based routing or semantic caching, add RouteLLM or vLLM SR as a layer.

---

## The bottom line

There is no single best router. The right choice depends on whether you use APIs or self-host, how many model tiers you have, and whether you need caching and safety features. Start simple (RouteLLM or LiteLLM), measure your cost savings, and upgrade to vLLM Semantic Router only when you need its advanced features. Do not over-engineer your routing layer before you have measured your actual traffic patterns.