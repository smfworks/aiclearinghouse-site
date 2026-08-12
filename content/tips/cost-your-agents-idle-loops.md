---
slug: cost-your-agents-idle-loops
title: Cost Your Agent's Idle Loops
category: Performance
excerpt: Reasoning models that think before answering can burn tokens during idle reasoning loops. Measure idle cost before it surprises you.
tags:
  - cost
  - reasoning
  - optimization
  - production
  - agents
order: 36
last_verified: "2026-08-12"
---

# Cost Your Agent's Idle Loops

## The principle

Reasoning models — Ling 3.0 Flash, Claude Opus 5, GPT-5.6 — think before they answer. That thinking generates tokens. When your agent is stuck in a loop (retrying a failed tool call, re-evaluating context, waiting for a resource that timed out), it is still generating reasoning tokens. You are paying for thinking that produces no output. Most teams never measure this cost because it does not appear in any single billing line — it is spread across runs that "worked eventually" but cost 3x what they should have.

## Why it matters

We observed this pattern testing Ling 3.0 Flash: the model generated 240M output tokens during its Intelligence Index evaluation, vs a median of 57M for similar models. That is 4x the output tokens — all billable. When a reasoning model gets stuck in a loop, it does not stop thinking. It thinks harder. Each retry, each re-evaluation, each "let me try a different approach" generates tokens you pay for.

The same applies to Claude Opus 5's effort control: if you set effort to "high" and the agent encounters a retry loop, you are paying premium reasoning-token rates for a model that is going in circles.

Without measuring idle cost, you will discover it when the monthly bill is 3x your estimate and you cannot explain why.

## How to apply it

1. **Instrument token usage per tool call, not just per run.** Your trace should record tokens consumed between tool calls — not just the final output. This is where idle reasoning hides.

```python
# Pseudocode — wrap your tool execution loop
for step in agent.steps:
    tokens_before = get_token_count()
    result = execute_tool_call(step)
    tokens_after = get_token_count()
    idle_tokens = tokens_after - tokens_before - result.output_tokens
    log(f"[{trace_id}] Step {step.name}: {idle_tokens} idle reasoning tokens")
```

2. **Set a per-step token budget.** If a single tool call consumes more than N reasoning tokens, abort and log it. Most production agents should not spend 10,000 tokens thinking about a single web search.

3. **Measure the "retry tax."** When a tool call fails and the agent retries, how many tokens does the retry reasoning cost? Track this separately. If your retry rate is 15% and each retry burns 2,000 reasoning tokens, your retry tax is real money at scale.

4. **Compare reasoning models on verbosity, not just price per token.** A model at $0.22/1M output that generates 4x the tokens is more expensive than a model at $0.40/1M that generates 1x. Always calculate: `price_per_1M × expected_token_count = actual_cost_per_task`.

5. **Set a hard token ceiling per run.** If a run exceeds N total tokens (input + output + reasoning), abort. This is your circuit breaker against runaway loops.

```python
MAX_TOKENS_PER_RUN = 50000

if total_tokens > MAX_TOKENS_PER_RUN:
    log(f"[{trace_id}] ABORT: token ceiling hit ({total_tokens})")
    abort_run(trace_id, reason="token_budget_exceeded")
```

## Red flags

- Your monthly token bill is 2-3x your per-task estimate and you cannot explain the gap
- Your agent's average tokens-per-task is climbing over time without a corresponding quality improvement
- You are using a reasoning model with effort set to "high" or "medium" and have never measured idle reasoning tokens
- Your retry rate is above 10% and you are not tracking the token cost of retries
- You cannot answer "how many tokens did the agent spend thinking between tool calls on the last run?"

## Quick win

Run this query against your observability data (Langfuse, Helicone, or your own logs) for the last 7 days:

```sql
SELECT 
    trace_id,
    SUM(output_tokens) as total_output,
    COUNT(*) as tool_calls,
    SUM(output_tokens) / COUNT(*) as avg_tokens_per_step
FROM agent_traces
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY trace_id
HAVING SUM(output_tokens) / COUNT(*) > 2000
ORDER BY avg_tokens_per_step DESC
LIMIT 20;
```

This finds the 20 runs with the highest average tokens per tool call — your worst idle-reasoning offenders. Investigate the top 5. You will likely find retry loops, confused reasoning, or effort settings that are too high for the task.