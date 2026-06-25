---
slug: "hermes-subagent-orchestration-map-reduce-patterns"
title: "Hermes Subagent Orchestration: Map, Reduce, and Fan-Out Patterns That Actually Ship"
excerpt: "Go beyond simple delegation. Learn the map-reduce, fan-out, and orchestration patterns we use at SMF Works to run parallel subagents, merge their outputs, and keep parent context clean."
date: "2026-06-25"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Agent Architecture", "Subagents"]
tags: ["hermes", "subagents", "delegation", "map-reduce", "fan-out", "agent-orchestration", "parallel-agents"]
readTime: 10
image: "/images/blog/liam-subagent-orchestration-map-reduce-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-subagent-orchestration-map-reduce-patterns"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

You already know how to spawn a subagent. You've used `delegate_task` to research a problem, review some code, or pull context from a distant corner of your codebase.

But one subagent is a convenience. Ten subagents working in parallel is an architecture. The difference between a demo and a production agent system is **orchestration**: how you split work, run it concurrently, and collapse the results back into something the parent agent can act on without drowning in context.

This post covers the three patterns I use at SMF Works when a single task needs more than one brain:

1. **Map** — split a big task into independent chunks, run them in parallel.
2. **Reduce** — merge subagent outputs into a single decision or artifact.
3. **Fan-out with verification** — run parallel attempts and vote on the best result.

Each pattern has runnable Python code, failure modes I've hit, and the guardrails that keep it from becoming a context bomb.

---

## Why Orchestration Beats One Big Prompt

A single agent with a 200K context window can read a lot. But reading isn't the same as reasoning cleanly across it. The more moving pieces you stuff into one context, the more the model:

- Loses track of details in the middle of long outputs.
- Gets distracted by tool noise from earlier steps.
- Confuses reasoning about file A with reasoning about file B.

Subagents fix this by isolating each work unit. The parent agent keeps the high-level plan. The workers handle the details. You only pay attention to what matters.

The cost is coordination. Someone has to decide how to split the work, dispatch it, collect results, and synthesize. That's what this post is about.

---

## Pattern 1: Map — Split and Conquer

**Best for:** batch tasks where each chunk is independent. Auditing every route in a FastAPI app, linting every file, generating summaries for each section of a long document, testing every model in a benchmark suite.

The idea is simple:

1. Identify the work units.
2. Delegate each unit to a subagent with identical instructions.
3. Collect the results as a list.

### Example: Audit every API endpoint

```python
from hermes_tools import delegate_task
from pathlib import Path
import json

ENDPOINTS = [
    "GET /api/v1/users",
    "POST /api/v1/users",
    "GET /api/v1/users/{id}",
    "PATCH /api/v1/users/{id}",
    "DELETE /api/v1/users/{id}",
]

def audit_endpoint(method_path: str) -> dict:
    """Run a focused security and correctness audit on one endpoint."""
    result = delegate_task(
        goal=f"Audit {method_path} for security, input validation, and error handling",
        context=(
            f"Review the implementation of {method_path} in our FastAPI app. "
            "Check for missing input validation, improper auth checks, leaky error messages, "
            "and inconsistent response shapes. Return a JSON object with: "
            "endpoint, risk_level (low/medium/high), issues (list), and recommendations (list)."
        ),
        toolsets=["file", "terminal"],
    )
    return json.loads(result["output"])

# Map: run each audit in parallel via concurrent delegation
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=5) as pool:
    audit_results = list(pool.map(audit_endpoint, ENDPOINTS))

print(json.dumps(audit_results, indent=2))
```

### What makes this work

- **Identical instructions** keep the output shape predictable.
- **Bounded concurrency** (`max_workers=5`) prevents you from hammering the filesystem or spawning 50 agents at once.
- **JSON contract** in the subagent prompt means parsing the result is trivial.

### Failure mode: output shape drift

If one subagent returns a paragraph instead of JSON, your `json.loads` explodes. Fix it in the prompt, not the parser. Add an explicit example:

```
Return ONLY valid JSON in this exact shape:
{
  "endpoint": "GET /api/v1/users",
  "risk_level": "medium",
  "issues": ["no pagination limit"],
  "recommendations": ["add max_page_size"]
}
```

---

## Pattern 2: Reduce — Merge Into a Single Decision

**Best for:** turning many subagent outputs into one artifact. A single incident report, a single refactor plan, a single test strategy, a single go/no-go decision.

Map gives you a list. Reduce turns the list into a coherent output.

### Example: Merge five code reviews into one action plan

```python
import json

def review_file(filepath: str) -> dict:
    """Ask a subagent to review one file in isolation."""
    result = delegate_task(
        goal=f"Review {filepath}",
        context=(
            f"Perform a focused code review of {filepath}. Look for bugs, performance issues, "
            "security risks, and maintainability problems. Return JSON with: "
            "filepath, summary, issues (each with severity and line_number if known), "
            "and the single most important recommendation."
        ),
        toolsets=["file", "terminal"],
    )
    return json.loads(result["output"])

files_to_review = [
    "app/api/users.py",
    "lib/db.py",
    "components/AuthForm.tsx",
    "lib/email.ts",
    "cron/sync.py",
]

# Map: review each file
with ThreadPoolExecutor(max_workers=5) as pool:
    reviews = list(pool.map(review_file, files_to_review))

# Reduce: ask a single subagent to merge into a prioritized action plan
reduce_output = delegate_task(
    goal="Merge file-level code reviews into a single prioritized action plan",
    context=(
        "You are given code reviews for individual files. Synthesize them into "
        "a single engineering action plan. Group related issues, remove duplicates, "
        "and rank by severity and impact. Return JSON with: "
        "summary, top_priorities (list), quick_wins (list), and estimated_effort_hours.\n\n"
        f"Reviews: {json.dumps(reviews, indent=2)}"
    ),
    toolsets=["file"],
)

plan = json.loads(reduce_output["output"])
print(json.dumps(plan, indent=2))
```

### What makes this work

- The **reduce subagent only sees structured inputs**. It doesn't read the files again. Its job is synthesis, not investigation.
- The parent agent keeps the original reviews in case the reduce step misses nuance.
- The output is actionable. A list of 47 raw comments is useless. Five grouped priorities with owners is useful.

### Failure mode: reduce agent re-reviews everything

If your reduce prompt isn't explicit, the subagent may try to re-read every file and duplicate work. Lock it down:

```
Do NOT re-read the source files. Use ONLY the provided reviews.
Your job is synthesis, not investigation.
```

---

## Pattern 3: Fan-Out With Verification

**Best for:** tasks where correctness matters more than speed and you want to catch bad answers before they propagate. Generating complex code, diagnosing tricky bugs, evaluating alternative designs.

Instead of one subagent doing the work, you run multiple independent attempts and then ask another subagent to pick the best one — or combine the strongest parts.

### Example: Generate a migration script with consensus

```python
def generate_migration(strategy: str) -> dict:
    """Ask one subagent to generate a migration script using a specific strategy."""
    result = delegate_task(
        goal="Generate a SQL migration script to add soft-delete to the users table",
        context=(
            f"Approach this as a {strategy} migration. Generate a safe PostgreSQL migration "
            "that adds deleted_at without breaking existing queries. Include a rollback. "
            "Return JSON with: strategy, sql (the migration script), rollback_sql, and risks (list)."
        ),
        toolsets=["file", "terminal"],
    )
    return json.loads(result["output"])

strategies = ["zero-downtime", "batched-backfill", "trigger-based"]

with ThreadPoolExecutor(max_workers=3) as pool:
    attempts = list(pool.map(generate_migration, strategies))

# Verification step: pick or synthesize the best attempt
verifier_output = delegate_task(
    goal="Select the safest migration strategy for production",
    context=(
        "Three subagents generated different migration strategies. Compare them on: "
        "safety, downtime, rollback ease, and operational complexity. "
        "Return JSON with: chosen_strategy, justification, final_sql, final_rollback_sql, "
        "and any modifications you made.\n\n"
        f"Attempts: {json.dumps(attempts, indent=2)}"
    ),
    toolsets=["file"],
)

final = json.loads(verifier_output["output"])
print(final["final_sql"])
```

### What makes this work

- **Independent attempts** avoid a single bad local minimum.
- **Explicit criteria** in the verifier prompt prevent it from defaulting to the longest or most confident answer.
- The parent agent gets one vetted result, not three raw guesses.

### Failure mode: verifier picks the prettiest answer

Models can be biased toward confident-sounding garbage. Give the verifier a rubric:

```
Score each attempt 1-5 on: correctness, safety, rollback quality, operational simplicity.
Choose the highest total score. Explain your scoring in the justification.
```

---

## Handling Partial Failures

In parallel orchestration, some subagents will fail. Maybe a file is missing, maybe the prompt was ambiguous, maybe the model hallucinated an output shape. Your parent agent needs to decide what to do.

### Strategies

1. **Fail fast** — if any subagent fails, abort the whole job. Good for tightly coupled tasks.
2. **Best-effort reduce** — drop failed results and reduce the survivors. Good for loosely coupled audits.
3. **Retry with narrower scope** — retry failed units individually with simplified prompts.

### Example: best-effort with retries

```python
from hermes_tools import delegate_task
import json, time

def robust_audit(endpoint: str, retries: int = 2) -> dict:
    for attempt in range(retries + 1):
        try:
            result = delegate_task(
                goal=f"Audit {endpoint}",
                context=(
                    f"Review {endpoint}. Return JSON: endpoint, risk_level, issues, recommendations. "
                    "If the endpoint does not exist, say so explicitly."
                ),
                toolsets=["file", "terminal"],
            )
            return json.loads(result["output"])
        except Exception as e:
            if attempt == retries:
                return {
                    "endpoint": endpoint,
                    "risk_level": "unknown",
                    "issues": [f"subagent failed after {retries} retries: {str(e)}"],
                    "recommendations": ["investigate manually"],
                }
            time.sleep(1)

# Use this inside your ThreadPoolExecutor map.
```

---

## Keeping Parent Context Clean

The whole point of subagents is to keep the parent context small. But it's easy to accidentally dump everything back in.

### Bad: forwarding full tool logs

```python
# Don't do this
for result in results:
    parent_context += result["full_terminal_output"]
```

### Good: forwarding only summaries

```python
# Keep the parent context to structured metadata
parent_context = {
    "work_units": len(results),
    "failed_units": sum(1 for r in results if r["risk_level"] == "unknown"),
    "high_risk_count": sum(1 for r in results if r["risk_level"] == "high"),
    "top_priorities": reduce_step_output["top_priorities"],
}
```

The parent agent should know what happened. It does not need to see every `git diff` and every `pytest` stack trace that the subagents produced.

---

## Real-World Checklist

Before you ship a multi-subagent workflow:

- **Define the output contract for every subagent.** JSON shape, required fields, example response.
- **Cap concurrency.** Five parallel workers usually beats fifty.
- **Separate map from reduce.** Don't let your synthesizer re-investigate.
- **Handle failures explicitly.** Fail fast, best-effort, or retry — but decide.
- **Keep parent context small.** Only summaries and decisions flow upward.
- **Add a verifier for high-stakes outputs.** One answer is fragile; consensus is stronger.

---

## Try This Today

Pick one task in your current project that touches multiple files or multiple decisions. Examples:

- Audit every route in your API.
- Generate tests for every public function in a module.
- Compare three implementation strategies for a refactor.

Write the map step first. Get five parallel subagents returning the same JSON shape. Then add the reduce step. You'll be surprised how much cleaner the parent agent's reasoning becomes when it's not carrying the whole codebase in its head.

Subagents are not just a way to offload work. They're a way to structure thinking. Map, reduce, verify, ship.
