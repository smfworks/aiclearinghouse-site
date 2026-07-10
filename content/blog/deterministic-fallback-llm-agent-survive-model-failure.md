---
slug: "deterministic-fallback-llm-agent-survive-model-failure"
title: "The Deterministic Fallback: Keeping Your LLM Agent Alive When the Model Dies"
excerpt: "An LLM planner is a single point of failure: outages, rate limits, malformed JSON, and empty plans all stop your agent cold. Here is the Planner abstraction, a deterministic heuristic fallback, schema validation that fails closed, and the tests that prove the agent keeps executing when the model is gone."
date: "2026-07-10"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Agent Architecture", "Engineering", "Reliability", "Open-Source"]
tags: ["agent-architecture", "llm-planner", "fallback", "deterministic", "reliability", "schema-validation", "hermes", "smf-praxis", "python"]
readTime: 16
image: "/images/blog/deterministic-fallback-llm-agent-survive-model-failure-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/deterministic-fallback-llm-agent-survive-model-failure"
---

Most AI agents ship with one planner. One model. One path from *goal* to *plan*. That is a single point of failure dressed up as an architecture.

When the model returns a 503, rate-limits you, emits malformed JSON, or — worse — returns a syntactically valid plan that is semantically empty, the whole agent stalls. The user sees a spinner. The cron job silently produces nothing. The subagent that was supposed to recover the fleet is itself waiting on a model that is down.

The fix is not "use a more reliable model." It is to stop treating the planner as a monolith and treat it as a swappable strategy with a deterministic floor. Below is the pattern we use in `smf-praxis`, the code that implements it, and the failure modes that will actually bite you.

## The core idea: a Planner abstraction

Define one interface. The agent depends on the interface, never on a specific model. The LLM planner is one implementation; a deterministic heuristic planner is another. The agent tries the smart one, and on any failure it transparently drops to the dumb one.

```python
from dataclasses import dataclass, field
from typing import Protocol, Sequence

@dataclass
class Step:
    tool: str                 # registered tool name, e.g. "read_file"
    args: dict = field(default_factory=dict)
    rationale: str = ""

@dataclass
class Plan:
    goal: str
    steps: list[Step] = field(default_factory=list)
    source: str = "unknown"   # "llm" | "heuristic" | "cache"

    def is_empty(self) -> bool:
        return len(self.steps) == 0

class Planner(Protocol):
    name: str
    def plan(self, goal: str, *, tools: Sequence[str], context: str = "") -> Plan: ...
```

Note what the contract guarantees: `plan()` **always returns a `Plan`**, never `None`, never an exception. A planner that raises is a planner that has not earned the right to be called `Planner`.

## Implementation 1: the LLM planner (smart, fragile)

The LLM planner maps the goal to available tools via a schema-validated completion. The fragility lives entirely in the boundary — network, quotas, and the model's willingness to emit valid JSON.

```python
import json
from dataclasses import asdict

class LLMPlanner:
    name = "llm"

    def __init__(self, llm, *, model: str = "deepseek-v4-pro", timeout: float = 30.0):
        self.llm = llm
        self.model = model
        self.timeout = timeout

    def plan(self, goal, *, tools, context="") -> Plan:
        prompt = self._build_prompt(goal, list(tools), context)
        try:
            raw = self.llm.complete(
                prompt, model=self.model, temperature=0, timeout=self.timeout
            )
        except Exception as exc:           # network, 503, quota
            raise PlannerUnavailable(exc) from exc

        data = self._extract_json(raw)    # may raise MalformedPlan
        steps = [Step(**s) for s in data["steps"]]
        return Plan(goal=goal, steps=steps, source="llm")

    @staticmethod
    def _extract_json(raw: str) -> dict:
        # pull the first {...} block; fail closed on anything ambiguous
        start, end = raw.find("{"), raw.rfind("}")
        if start == -1 or end == -1:
            raise MalformedPlan("no JSON object in LLM output")
        try:
            return json.loads(raw[start:end + 1])
        except json.JSONDecodeError as exc:
            raise MalformedPlan(str(exc))
```

Two failure categories are already explicit: `PlannerUnavailable` (infrastructure) and `MalformedPlan` (model output). Both are caught by the agent, not propagated.

## Implementation 2: the heuristic planner (dumb, invincible)

The fallback must run with **no network, no model, no API key**. It is a deterministic function of `(goal, available_tools)`. It will never win a planning contest, but it will always return a legal, executable plan.

```python
import re

# intent -> ordered candidate tools. First registered match wins.
INTENT_RULES: list[tuple[re.Pattern, list[str]]] = [
    (re.compile(r"\b(read|open|show|view|list)\b", re.I),
        ["read_file", "list_dir", "search_files"]),
    (re.compile(r"\b(write|create|draft|save|edit|patch)\b", re.I),
        ["draft_file", "patch"]),
    (re.compile(r"\b(fetch|download|url|http)\b", re.I),
        ["fetch_url"]),
    (re.compile(r"\b(send|email|notify|message)\b", re.I),
        ["send_email"]),
    (re.compile(r"\b(delete|remove|rm)\b", re.I),
        ["delete_file"]),
]

class HeuristicPlanner:
    name = "heuristic"

    def plan(self, goal, *, tools, context="") -> Plan:
        steps: list[Step] = []
        for pattern, candidates in INTENT_RULES:
            if not pattern.search(goal):
                continue
            for tool in candidates:
                if tool in tools:
                    steps.append(Step(
                        tool=tool,
                        args={"query": goal, "name": goal},
                        rationale=f"regex match: {pattern.pattern}",
                    ))
                    break
        # If nothing matched, fall back to a single read so the agent
        # at least grounds itself instead of doing nothing.
        if not steps and "read_file" in tools:
            steps.append(Step(
                tool="read_file",
                args={"query": goal},
                rationale="no intent matched; grounding read",
            ))
        return Plan(goal=goal, steps=steps, source="heuristic")
```

The deterministic floor has three properties worth stating plainly:

- **Offline-safe.** No `llm` attribute, no network call. It runs in a unit test with zero credentials.
- **Always returns.** Worst case it returns a single grounding read. The agent never stalls.
- **Predictable.** Given the same goal and tool set, it returns the same plan. That is what makes it testable.

## The agent: try smart, drop to dumb, never block

The agent owns the fallback decision. It does **not** let the planner raise.

```python
class PraxisAgent:
    def __init__(self, tools, *, planner=None, llm=None, heuristic=None):
        self.tools = tools
        self.planner = planner or LLMPlanner(llm) if llm else None
        self.heuristic = heuristic or HeuristicPlanner()
        self.last_fallback = False

    def plan(self, goal, *, context="") -> Plan:
        tool_names = [t.name for t in self.tools]
        if self.planner is not None:
            try:
                p = self.planner.plan(goal, tools=tool_names, context=context)
                if not p.is_empty():
                    self.last_fallback = False
                    return p
            except (PlannerUnavailable, MalformedPlan) as exc:
                # log it; this is an operational signal, not an error to surface
                print(f"[planner] {type(exc).__name__}: {exc}; using heuristic")
        # deterministic floor
        self.last_fallback = (self.planner is not None)
        return self.heuristic.plan(goal, tools=tool_names, context=context)
```

A subtle but important detail: the fallback triggers on an **empty** plan, not just on an exception. A model can return valid JSON with `steps: []`. That is a successful call that achieved nothing — and it must not be allowed to slip through as "the plan."

## Decision tree: which planner answers?

```
                        ┌─────────────────────────┐
                        │  goal received           │
                        └───────────┬─────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │ LLM planner configured?        │
                    └───────┬───────────────┬────────┘
                     no     │               │    yes
                            │               │
                            ▼               ▼
                  ┌─────────────┐   ┌─────────────────┐
                  │ heuristic   │   │ call LLM planner │
                  │ (always)    │   └────────┬────────┘
                  └─────────────┘            │
                                            ▼
                                  ┌───────────────────┐
                                  │ success + non-empty?│
                                  └───┬───────────┬───┘
                               no │           │ yes
                                  │           │
                                  ▼           ▼
                        ┌───────────────┐  ┌────────────┐
                        │ heuristic      │  │ use LLM plan│
                        │ (fallback)     │  └────────────┘
                        └───────────────┘
```

The heuristic is not a "backup you hope never runs." It is the baseline the LLM plan must *beat*. If the model is down, you degrade to a predictable, auditable agent — not to a dead one.

## Failure modes that actually happen

| Failure | Where | Symptom | Fallback saves you? |
|---|---|---|---|
| Provider 503 / timeout | `llm.complete()` | `PlannerUnavailable` | ✅ drops to heuristic |
| Rate limit (429) | `llm.complete()` | `PlannerUnavailable` | ✅ drops to heuristic |
| Malformed JSON | `_extract_json` | `MalformedPlan` | ✅ drops to heuristic |
| Empty `steps: []` | `plan()` return | Silent no-op | ✅ caught by `is_empty()` |
| Schema drift (renamed field) | `Step(**s)` | `TypeError` | ⚠️ must be caught too |
| Hallucinated tool name | `tool not in registry` | `KeyError` at act() | ⚠️ validate against registry |
| Mid-stream model change | completion format | `MalformedPlan` | ✅ drops to heuristic |

Two of these are **not** caught by the code above yet: schema-drift `TypeError` and hallucinated tool names. Both are fixed at the same seam — validate the plan against the tool registry before acting, not after.

```python
class Broker:
    def __init__(self, registry):
        self.registry = registry

    def validate(self, plan: Plan) -> Plan:
        kept = []
        for step in plan.steps:
            if step.tool not in self.registry:
                print(f"[broker] dropping unknown tool: {step.tool}")
                continue
            kept.append(step)
        return Plan(goal=plan.goal, steps=kept, source=plan.source)
```

Now a malformed or hallucinated step is dropped by the broker, not by a `KeyError` mid-execution. The plan degrades gracefully instead of crashing.

## Schema validation that fails closed

The hardest rule in fallback design: **never let a partial failure become a silent success.** Validate hard, and when validation fails, return the deterministic plan — not a half-parsed LLM plan.

```python
from pydantic import BaseModel, ValidationError

class StepSchema(BaseModel):
    tool: str
    args: dict = {}
    rationale: str = ""

class PlanSchema(BaseModel):
    steps: list[StepSchema]

# inside LLMPlanner.plan, replace the manual parse:
try:
    plan = PlanSchema.model_validate_json(raw[start:end + 1])
except ValidationError as exc:
    raise MalformedPlan(str(exc))
```

Pydantic turns "model returned a slightly wrong shape" into a clean `MalformedPlan` that the agent's `except` already handles. The LLM planner stays fragile at the edges but never leaks bad data downstream.

## Tests that prove the floor holds

The deterministic fallback is only real if it is tested without credentials. These run on any machine, including CI without secrets.

```python
def test_heuristic_runs_without_model():
    h = HeuristicPlanner()
    plan = h.plan("read the config file", tools=["read_file", "list_dir"])
    assert plan.source == "heuristic"
    assert plan.steps[0].tool == "read_file"
    assert not plan.is_empty()

def test_agent_falls_back_on_unavailable():
    class BoomPlanner:
        name = "llam"
        def plan(self, goal, *, tools, context=""):
            raise PlannerUnavailable("503")
    agent = PraxisAgent(tools=[fake_tool("read_file")], planner=BoomPlanner())
    plan = agent.plan("open the log")
    assert plan.source == "heuristic"
    assert agent.last_fallback is True

def test_empty_llm_plan_triggers_fallback():
    class EmptyPlanner:
        name = "llm"
        def plan(self, goal, *, tools, context=""):
            return Plan(goal=goal, steps=[], source="llm")
    agent = PraxisAgent(tools=[fake_tool("read_file")], planner=EmptyPlanner())
    plan = agent.plan("do something")
    assert plan.source == "heuristic"   # empty plan is not accepted
```

The second and third tests are the ones that matter: they assert the agent keeps executing when the model is gone or returns nothing. If those pass, your agent survives a provider outage by construction.

## What the fallback is *not*

Be honest about the trade. The heuristic planner:

- **Cannot sequence multi-step reasoning.** It matches intents independently; it will not infer "read A, then use A's contents to write B."
- **Cannot decompose a vague goal.** "Improve the test coverage" becomes a grounding read, which is honest but useless.
- **Is not cheaper per call** — it is cheaper because it makes *zero* calls. Its value is availability, not economy.

So the architecture is: spend model tokens when available for quality, and accept a predictable, lower-quality-but-always-on agent when they are not. You do not ship one or the other. You ship both, with the LLM as the ceiling and the heuristic as the floor.

## Where this fits in the stack

This pairs directly with the governance layer: once a plan exists — from either planner — the broker gates `SEND`/`DESTRUCTIVE` tools behind approval regardless of which planner produced them. A fallback plan is still a plan, and a `delete_file` step from the heuristic planner deserves the same human gate as one from the LLM. Treat the planner as interchangeable; treat the broker as non-negotiable.

## Bottom line

Stop building agents with a single point of planning failure. Define one `Planner` interface, implement an LLM version and a deterministic heuristic version, validate plans against the tool registry, fail closed on malformed output, and test the fallback with zero credentials. The result is an agent that degrades to predictable rather than to dead — and that is the difference between a tool your users trust and a spinner they learn to refresh.
