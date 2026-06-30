---
slug: "model-routing-agent-systems-deterministic-fallback"
title: "Model Routing for Agent Systems: A Deterministic Fallback Policy That Doesn't Panic"
excerpt: "How SMF Works routes agent model calls between local Ollama backends and cloud frontier APIs without letting a slow day, a full GPU, or a flaky key turn into a cascading failure."
date: "2026-06-30"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Agent Architecture", "Engineering", "Local LLMs", "Linux"]
tags: ["model-routing", "ollama", "subagents", "fallback", "agent-orchestration"]
readTime: 13
image: "/images/blog/model-routing-agent-systems-deterministic-fallback-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/model-routing-agent-systems-deterministic-fallback"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

Every agent system that reaches production eventually needs a model router. Not a fancy one. A boring one that decides, for each request, whether to call the local Qwen model, the cheap cloud endpoint, or the frontier model, and what to do when the chosen path fails.

The mistake I keep seeing is routing by *optimism*. Developers build a router that always prefers local inference for cost reasons, then fall back to cloud only when local throws an exception. That sounds reasonable until you live with it. A full GPU makes the request queue back up for thirty seconds. A misquantized model hallucinates structured-output parsing. A cloud key rate-limits and the whole subagent tree collapses because no one taught the router to *degrade gracefully*.

At SMF Works we run Hermes on Linux with local Ollama backends on AMD GPUs and a small set of cloud fallbacks. The router is deterministic: it never relies on an LLM to decide where the next LLM call goes. It uses the request's risk class, the current capacity of each backend, a latency budget, and a cost ceiling. This post is the policy we use, the code that implements it, and the failure modes we learned the hard way.

---

## 1. Why Deterministic Routing Matters

A stochastic router — "let the big model decide" — has two failure modes that are hard to debug:

1. **Cost drift.** The router learns to prefer frontier models because they produce cleaner outputs. Over a month your bill triples without a design change.
2. **Latency cliffs.** A bad routing decision puts a simple summarization task on a loaded cloud API during peak hours. The user experience degrades but the dashboard looks green because requests eventually complete.

Deterministic rules are not perfect, but they are *auditable*. You can read the router output and explain why a request went to cloud, local, or queue. That matters when the agent is making subagent calls in a loop.

The router's job is not to maximize quality per call. It is to keep the *system* inside a latency and cost envelope while meeting a minimum quality bar. Quality is enforced by model selection per task type, not by runtime improvisation.

---

## 2. The Decision Dimensions

We route on four inputs. Each is cheap to compute at request time.

| Dimension | Source | Used For |
|---|---|---|
| `RiskClass` | Tool/task metadata: `READ`, `DRAFT`, `SEND`, `DESTRUCTIVE` | Safety and approval gates. `READ`/`DRAFT` default local; `SEND`/`DESTRUCTIVE` require explicit routing and often frontier capability. |
| Backend capacity | Ollama `/api/ps`, local VRAM estimate, queue depth | Avoid loading a model into a full GPU or queueing behind a long generation. |
| Latency budget | Per-request SLA from the planner, e.g. `budget_ms` | If local cannot meet it, route to cloud; if cloud also fails, degrade to a smaller model. |
| Cost ceiling | Per-call and per-task caps configured per API key | Hard cap per route; if exceeded, switch provider or fail open with a warning. |

The most important rule is at the bottom: **degrade to a smaller model before you fail**. A good answer from a 7B model in 400 ms beats a timeout from a 70B model.

---

## 3. Risk Classes Map to Defaults

In our agent framework every tool declares a `RiskClass`. The router uses it as the starting point, not the final word.

```python
from enum import Enum, auto

class RiskClass(Enum):
    READ = auto()          # fetch, list, grep, read_file
    DRAFT = auto()         # write draft files, generate plans, summarize
    SEND = auto()          # email, post, deploy, merge
    DESTRUCTIVE = auto()   # delete, terminate, wipe, mutate production
```

The default routing policy is conservative:

| RiskClass | Default backend | May escalate to cloud if... |
|---|---|---|
| `READ` | Local small model | Task needs reasoning over long context or coding heavy lifting |
| `DRAFT` | Local medium model | Output must follow strict schema and local parser keeps failing |
| `SEND` | Frontier model + approval gate | Always frontier unless explicitly sandboxed |
| `DESTRUCTIVE` | Frontier model + approval gate | Never local by default; requires human sign-off |

`SEND` and `DESTRUCTIVE` are not routing decisions. They are governance decisions. The router can refuse to execute them autonomously even if a cloud API is available. If you conflate routing with authorization you will eventually ship an action you cannot explain.

---

## 4. The Router in Code

The core is a small policy class. It has no LLM dependency and unit tests run in milliseconds.

```python
from dataclasses import dataclass
from typing import Optional
import time

@dataclass(frozen=True)
class Route:
    provider: str           # "ollama", "openrouter", "deepseek", ...
    model: str
    reason: str             # human-readable routing decision
    requires_approval: bool

@dataclass
class Capacity:
    gpu_vram_free_mb: int
    queue_depth: int
    last_latency_ms: float
    healthy: bool

class ModelRouter:
    LOCAL_SMALL = Route("ollama", "qwen3:8b-q4_K_M", "local default small", False)
    LOCAL_MEDIUM = Route("ollama", "qwen3.6:27b-q4_K_M", "local default medium", False)
    CLOUD_CHEAP = Route("openrouter", "deepseek/deepseek-chat-v3-0324", "cloud cheap fallback", False)
    CLOUD_STRONG = Route("openrouter", "anthropic/claude-sonnet-4-20250514", "frontier required", True)

    def __init__(self, latency_budget_ms: int = 2000, cost_ceiling_per_call: float = 0.05):
        self.latency_budget_ms = latency_budget_ms
        self.cost_ceiling_per_call = cost_ceiling_per_call

    def route(self, risk: RiskClass, capacity: Capacity, needs_structured_output: bool = False) -> Route:
        # 1. Hard safety gate
        if risk in (RiskClass.SEND, RiskClass.DESTRUCTIVE):
            return self.CLOUD_STRONG

        # 2. Health and capacity gate
        if not capacity.healthy or capacity.queue_depth > 4:
            return self._cloud_fallback(needs_structured_output)

        # 3. Latency budget gate
        if capacity.last_latency_ms > self.latency_budget_ms * 0.7:
            return self._cloud_fallback(needs_structured_output)

        # 4. VRAM fit for medium model
        if capacity.gpu_vram_free_mb > 22_000:
            return self.LOCAL_MEDIUM

        # 5. Degrade to small local model
        if capacity.gpu_vram_free_mb > 6_000:
            return self.LOCAL_SMALL

        # 6. No local capacity left
        return self._cloud_fallback(needs_structured_output)

    def _cloud_fallback(self, needs_structured_output: bool) -> Route:
        if needs_structured_output:
            return self.CLOUD_STRONG._replace(requires_approval=False, reason="cloud fallback for structured output")
        return self.CLOUD_CHEAP
```

The key invariant is that `route()` always returns a `Route`. It never raises. Callers handle `requires_approval` separately. This separation keeps the router testable and the governance layer independent.

---

## 5. YAML Policy Configuration

We keep the policy in config so it can be tuned without redeploying code. The numbers below are for our production host with a 64 GB AMD MI210 and a 32 GB MI100.

```yaml
router:
  latency_budget_ms: 2500
  cost_ceiling_per_call_usd: 0.08
  local:
    base_url: http://127.0.0.1:11434
    max_queue_depth: 4
    vram_threshold_mb: 6000
    models:
      small: qwen3:8b-q4_K_M      # ~6 GB VRAM, fast
      medium: qwen3.6:27b-q4_K_M  # ~20 GB VRAM, strong
  cloud:
    providers:
      - name: openrouter
        cheap_model: deepseek/deepseek-chat-v3-0324
        strong_model: anthropic/claude-sonnet-4-20250514
      - name: deepseek
        cheap_model: deepseek-chat
        strong_model: deepseek-reasoner
    circuit_breaker:
      consecutive_errors: 3
      open_duration_seconds: 60
```

The circuit breaker is critical. If a provider returns three consecutive errors — timeout, 429, 5xx, bad JSON — we stop sending it traffic for sixty seconds and shift to the next provider. Without this, a flaky key can dominate the error budget of the whole pipeline.

---

## 6. Cost and Latency Table

These are rough numbers from our production logs over two weeks. They depend on quantization, prompt length, and whether the model is already loaded. Treat them as relative, not contractual.

| Backend | Model | ~VRAM | ~Latency (loaded) | Cost per 1K output tokens |
|---|---|---|---|---|
| Local (small) | qwen3:8b-q4_K_M | 6 GB | 80–250 ms | $0.00 (amortized hardware) |
| Local (medium) | qwen3.6:27b-q4_K_M | 20 GB | 250–900 ms | $0.00 (amortized hardware) |
| Cloud cheap | DeepSeek V3 | n/a | 400–1500 ms | ~$0.0007 |
| Cloud strong | Claude Sonnet 4 | n/a | 800–3000 ms | ~$0.015 |

The local numbers assume the model is already resident. A cold load adds one to four seconds. We mitigate that by keeping the two most common agent models loaded via `OLLAMA_KEEP_ALIVE` and by pinning small models to the MI100 while the MI210 handles the big ones.

---

## 7. Failure Modes and Graceful Degradation

Real routing gets interesting when nothing is perfect. Here is how the policy behaves in common failure scenarios.

| Failure | Router behavior |
|---|---|
| Local GPU full | Route to cloud cheap; if cloud is broken, queue and retry local in 500 ms. |
| Local model returns malformed JSON | Mark model degraded for 60 s; route structured-output requests to cloud strong. |
| Cloud provider 429 | Circuit-break that provider; try next provider; if all open, fall back to local medium. |
| Cloud cost ceiling hit | Hard stop. Return a `BudgetExceeded` signal so the planner can shorten context or split tasks. |
| Latency budget exceeded mid-stream | For streaming, return partial output if usable; for structured output, fail and retry with smaller model. |
| All backends down | Fail open into a deterministic safe mode: queue the task and surface a `waiting_approval` state. |

The last row is the most important. A router that panics propagates failure up the agent tree. A router that stops and asks for help keeps the system coherent.

---

## 8. Integration with the Hermes Planner

The router does not replace the planner. It sits below it. The planner emits goals and subgoals; the router decides where each subgoal executes.

```
Planner  →  subgoal  →  risk class + context length + latency budget  →  Router  →  backend
```

We expose this in the agent runtime as a small tool called `select_model`, which returns the route and a short explanation. That lets subagents log not just *what* they did but *why* they chose a backend. When a monthly cost review shows a spike, we can trace it back to a risk class or a capacity threshold.

The planner also passes a `retry_policy`. A `READ` task can retry on any backend. A `SEND` task that already failed once must not silently downgrade to a cheaper model and try again; it must surface the failure to the governance broker.

---

## 9. What We Learned

A few practical lessons from running this for several months:

- **Keep the router stateless.** Any state it needs — capacity, circuit breaker, cost counters — should come from external sources at call time. Stateful routers hide bugs across restarts.
- **Measure queue depth, not just VRAM.** A GPU with free memory and one long generation can still block everything behind it.
- **Don't route by model quality alone.** The best model is the one that meets the latency and cost envelope for this specific task.
- **Separate routing from approval.** Routing decides *where*; governance decides *whether*. Mixing them creates hard-to-test logic.
- **Log every route.** At minimum: risk class, chosen backend, reason, latency, and token count. Without logs you cannot optimize.

---

## 10. Summary

A deterministic model router is not the sexiest part of an agent system, but it is one of the highest-leverage pieces to get right. It turns local GPUs and cloud APIs into a single reliable substrate, keeps costs bounded, and prevents one bad provider from cascading through your subagent tree.

The SMF Works router is intentionally boring: risk class sets the default, capacity and latency choose the size, cost caps prevent runaway spending, and circuit breakers isolate failure. If you are building agents that make more than a handful of model calls per task, you need this layer sooner than you think.

The code in this post is a simplified version of what we run internally. It is enough to start from. The hard part is not the code; it is committing to the policy and measuring whether it actually holds.

---

*Liam Hermes is Chief Development Officer at SMF Works, where he builds agent infrastructure, local inference stacks, and the systems that keep them honest.*
