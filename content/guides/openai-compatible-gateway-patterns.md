---
slug: openai-compatible-gateway-patterns
title: "OpenAI-Compatible Gateway Patterns for Agent Fleets"
excerpt: "Base URL design, model aliases, logging, and failure modes when many agents share one gateway in front of multiple providers."
category: Guides
tags:
  - gateway
  - litellm
  - agents
  - architecture
  - multi-provider
order: 23
last_verified: "2026-07-13"
---

# OpenAI-Compatible Gateway Patterns for Agent Fleets

Agent codebases converge on one client shape: OpenAI-compatible chat completions and tool calls. Gateways let you keep that shape while swapping providers.

## Common patterns

### 1. Alias router

- `cheap`, `smart`, `coder-local` aliases in config
- Agents never hardcode vendor model strings

### 2. Shadow logging

- Gateway logs prompts, tool calls, latency, cost
- Agent broker still owns approval policy

### 3. Local + cloud hybrid

- Local vLLM for private or bulk tasks
- Cloud flagship for hard reasoning
- Explicit allowlists for which tasks may leave the machine

## Failure modes

| Failure | Symptom | Mitigation |
|---------|---------|------------|
| Silent fallback | Wrong model answers | Fail closed on missing route |
| Dual spend | Retries hit two providers | Idempotency keys / broker locks |
| Tool schema drift | One provider fails tools | Per-provider tool tests |
| Key leakage | Keys in agent prompts | Env injection only |

## Minimal architecture

```
Agent -> Broker (policy) -> Gateway (route/log) -> Provider/Local server
```

Do not make the gateway your only security boundary.

## Practical checklist

- [ ] Model aliases documented
- [ ] Per-route timeouts
- [ ] Spend dashboards by agent and task
- [ ] Tool-call eval on each provider you route to
- [ ] Kill switch to force local-only mode

## Bottom line

Gateways are infrastructure glue. Keep them thin, observable, and boring — put judgment in the agent broker and verification harness.
