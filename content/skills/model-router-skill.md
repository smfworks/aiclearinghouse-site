---
slug: model-router-skill
title: Model Router Skill
category: Tooling
excerpt: A Hermes skill that classifies each agent task and routes it to the most cost-effective model — frontier for complex reasoning, smaller models for routine work.
tags:
  - hermes
  - model-routing
  - cost-optimization
  - agents
  - performance
for: Hermes Agent
author: SMF Works
install: hermes skill install model-router-skill
dependencies:
  - Hermes Agent
  - Access to multiple model providers (OpenAI, Anthropic, local via Ollama)
image: /images/skills/tooling.svg
source: https://github.com/smfworks/hermes-skills
order: 113
last_verified: "2026-07-29"
---

# Model Router Skill

## What it is

A Hermes skill that implements request-level model routing for agent workflows. Instead of running every task through your most expensive model, this skill classifies each task by type and complexity, then routes it to the model that delivers adequate quality at the lowest cost. It is the same pattern Cursor Router uses, but for your own agent stack — you control the routing rules, not a vendor.

## Who it targets

- Agent operators spending more than they need on frontier-model API calls for routine tasks
- Teams running mixed workloads where 60-70% of tasks are simple (triage, formatting, lookup) and 30-40% require reasoning
- Anyone who wants cost optimization without giving up control over model selection logic

## What it does

- **Task classification** — categorizes incoming tasks by type (code generation, summarization, lookup, reasoning, tool-use) and complexity (simple, moderate, complex)
- **Configurable routing rules** — define which model handles which task type/complexity combination. Example: simple lookups route to Qwen3.6-27B local, complex reasoning routes to Claude Opus 4.8, moderate tasks route to GLM-5.2
- **Cost tracking per route** — logs token usage and cost per task, broken down by which model handled it, so you can verify savings
- **Fallback chain** — if the routed model is unavailable (rate limit, downtime), falls back to the next model in the priority chain for that task type
- **Dry-run mode** — routes tasks but logs what would happen without actually sending to the cheaper model, so you can validate routing decisions before committing

## Dependencies

- Hermes Agent (for skill loading and execution)
- Access to multiple model providers via OpenAI-compatible APIs (Ollama for local, OpenRouter or direct provider APIs for cloud)

## How to install

```bash
hermes skill install model-router-skill
```

Or manually place `SKILL.md` under `~/.hermes/profiles/<name>/skills/tooling/model-router-skill/SKILL.md`.

## Example usage

Configure routing rules in the skill's config:

```yaml
routing_rules:
  - task_type: lookup
    complexity: simple
    model: ollama/qwen3.6-27b
    fallback: openrouter/glm-5.2
  - task_type: summarization
    complexity: simple
    model: ollama/qwen3.6-27b
    fallback: openrouter/hy3
  - task_type: code_generation
    complexity: moderate
    model: openrouter/glm-5.2
    fallback: anthropic/claude-opus-4.8
  - task_type: reasoning
    complexity: complex
    model: anthropic/claude-opus-4.8
    fallback: openai/gpt-5.6-sol
  - task_type: default
    complexity: any
    model: openrouter/glm-5.2
    fallback: ollama/qwen3.6-27b

cost_log: ~/.hermes/profiles/pamela/logs/model-routing-costs.json
dry_run: false
```

The skill intercepts each task before it reaches the model, classifies it, and routes accordingly. The cost log lets you review actual spend by model and task type weekly.

## Limitations

- **Classification is itself a model call** — the router uses a small, fast model to classify the task, which adds ~200ms latency and a small per-task cost. For very high-volume workloads, this overhead can eat into savings
- **Routing rules need tuning** — the default rules are a starting point. You need to review your cost logs and adjust which models handle which tasks based on your actual quality requirements
- **No automatic quality scoring** — the router routes by rules, not by measuring output quality. A task routed to a cheaper model that produces inadequate output will not be caught unless you have downstream validation
- **Model availability changes** — if a local model is unloaded from VRAM by Ollama's idle timeout, the router needs to handle the cold-start delay or fall back to a cloud model