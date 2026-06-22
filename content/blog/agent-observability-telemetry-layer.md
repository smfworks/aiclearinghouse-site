---
slug: "agent-observability-telemetry-layer"
title: "Agent Observability: Building the Telemetry Layer Your Autonomous Agent Needs"
excerpt: "You can't debug what you can't see. Most teams ship AI agents into production with no structured logging, no trace propagation, and no replay capability — then act surprised when the agent silently goes off the rails. Here's the telemetry layer I built for my own agents and the three signals that actually correlate with quality."
date: "2026-06-22"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["AI Engineering", "Hermes AI", "Software Architecture", "Developer Tools"]
tags: []
readTime: 12
image: "/images/blog/agent-observability-telemetry-layer.svg"
originalUrl: "https://smfworks.com/blog/agent-observability-telemetry-layer"
canonicalUrl: "https://www.smfclearinghouse.com/blog/agent-observability-telemetry-layer"
---
# Agent Observability: Building the Telemetry Layer Your Autonomous Agent Needs

Here's a confession: for the first three months of running autonomous Hermes agents, my debugging workflow was `tail -f gateway.log` and vibes. An agent would publish a blog post, ship a PR, or run a cron job, and I'd find out something went wrong when a human complained — or worse, when a URL returned a 404 that was supposed to return a 200.

The logs were there. They just weren't *structured*. A terminal tool call, a file patch, a git push — each one dumped a free-text line into a flat file with no trace ID, no turn number, no correlation to the task that triggered it. When an agent ran twelve tools across six turns and the final output was wrong, I had no way to reconstruct *which* tool call went sideways without reading 4,000 lines of interleaved log spam.

This is the gap almost every team has with autonomous agents. We took distributed systems observability — traces, spans, metrics — and applied it to microservices a decade ago. Then we built AI agents that chain together dozens of stateful tool calls across delegation boundaries and gave them... `print()`.

It's time to fix that. Here's the telemetry layer I built for my own agents, the three signals that actually correlate with output quality, and the replay debugging technique that turned my 3am incident response from archaeology into engineering.

## Why Agent Observability Is Different From Service Observability

Standard service observability assumes deterministic execution: the same request hits the same code path and produces the same result. Agents break that assumption in three ways:

**1. Non-deterministic control flow.** The same task prompt can produce wildly different tool-call sequences depending on model temperature, context state, and which skills are loaded. You can't replay a trace by re-sending the request — you need the *exact* tool inputs and outputs, not just the request.

**2. Stateful context accumulation.** Each tool call mutates the context window. Turn 8's behavior depends on what turns 1-7 returned. A bug at turn 3 might not surface until turn 11. Without turn-level correlation, you're debugging a symptom that's eight hops from its cause.

**3. Delegation boundaries.** When a parent agent delegates a subtask, the child runs in a separate conversation with its own context. Traditional trace propagation stops at the subprocess boundary. If you don't explicitly thread a trace ID through, the child's tool calls are invisible to the parent's trace.

This means agent observability needs three things service observability treats as optional: **full tool I/O capture** (not just metadata), **turn-level correlation** baked into every span, and **trace propagation across delegation**.

## The Three Layers

### Layer 1: Structured Tool-Call Logging

Every tool call — every `read_file`, every `terminal`, every `patch`, every `search` — gets a structured log entry with a consistent schema. Not free text. A JSON object you can query.

```json
{
  "trace_id": "7f3a1b9c",
  "turn": 4,
  "span_id": "s_012",
  "tool": "patch",
  "toolset": "file",
  "inputs": {
    "path": "content/blog/agent-observability-telemetry-layer.md",
    "old_string": "## The Three Layers",
    "new_string": "## The Three Layers\n\n### Layer 1: Structured Tool-Call Logging"
  },
  "outputs": {
    "status": "ok",
    "diff_lines": 3,
    "duration_ms": 47
  },
  "error": null,
  "retries": 0,
  "ts": "2026-06-22T08:14:23.118Z"
}
```

The fields that matter:

- **`trace_id`** — ties every span in a task to the same root. Generate it at task start, thread it through every tool call.
- **`turn`** — which model turn this tool call belongs to. This is the single most useful field for debugging. When an agent goes wrong, you almost always see it as "the tool calls in turn N started diverging from the task."
- **`span_id`** — unique within the trace. Lets you build a span tree when a single turn fans out parallel tool calls.
- **`inputs` and `outputs`** — full capture, not summaries. This is what makes replay possible. Yes, it's verbose. Disk is cheap; debugging time isn't.
- **`error`** — null on success, structured object on failure. Never a string. A string error message can't be queried.
- **`retries`** — how many times the tool was retried before succeeding (or giving up). A high retry count on `terminal` is a leading indicator of flaky commands.

In Hermes, I emit these by wrapping the tool dispatch layer. Every tool handler already returns a JSON string — I intercept that return value, stamp it with the trace metadata, and write a structured line to a per-trace JSONL file before returning to the agent loop. Zero changes to individual tool code.

```python
def instrumented_dispatch(tool_name, args, trace_id, turn, **kw):
    span_id = f"s_{next_span_counter()}"
    start = time.monotonic()
    error = None
    retries = 0
    for attempt in range(MAX_RETRIES + 1):
        try:
            result = registry.dispatch(tool_name, args, **kw)
            break
        except Exception as e:
            error = {"type": type(e).__name__, "message": str(e)}
            retries += 1
            if attempt == MAX_RETRIES:
                result = json.dumps({"error": str(e)})
                break
    duration_ms = int((time.monotonic() - start) * 1000)
    log_span(trace_id, turn, span_id, tool_name, args, result, error, retries, duration_ms)
    return result
```

### Layer 2: Trace Propagation Across Delegation

When a parent agent delegates a subtask, the child agent starts a fresh conversation. Without explicit propagation, the child's tool calls get a new trace ID and you lose the causal chain.

The fix is simple but easy to forget: pass the parent's `trace_id` into the child's task prompt as structured metadata, and have the child's tool dispatch layer pick it up.

```python
# Parent side — delegation
delegation_prompt = f"""
[DELEGATION METADATA]
parent_trace_id: {current_trace_id}
parent_turn: {current_turn}
parent_span_id: {current_span_id}
[/DELEGATION METADATA]

Task: {subtask_description}
"""
```

The child's dispatch layer parses the metadata block, adopts the parent's `trace_id`, and emits a `span_id` that continues the sequence. Now the parent's trace and the child's trace are a single tree you can visualize as a flame graph.

```python
# Child side — trace adoption
def extract_parent_trace(task_prompt: str) -> str | None:
    match = re.search(r"parent_trace_id:\s*([a-f0-9]+)", task_prompt)
    return match.group(1) if match else generate_trace_id()
```

This sounds trivial. It is not trivial in practice, because delegation can be nested three levels deep (parent → child → grandchild), and each level needs to preserve not just the trace ID but the span hierarchy. If you skip this, you'll have three disconnected traces that look fine individually and are impossible to correlate when something goes wrong in the middle layer.

### Layer 3: Replay Debugging

This is where the investment pays off. With full tool I/O captured and traces threaded through delegation, you can *replay* a failed task exactly — same inputs, same tool outputs, same context evolution — without re-running the model.

Replay doesn't mean re-running the LLM. It means reconstructing the *agent's state* at each turn by feeding the captured tool outputs back into a dry-run harness that simulates the tool layer:

```python
def replay_trace(trace_file: str):
    spans = read_jsonl(trace_file)  # ordered by (turn, span_id)
    tool_mocks = {s["span_id"]: s["outputs"] for s in spans}
    
    # Reconstruct context turn by turn
    context = []
    for turn, turn_spans in group_by_turn(spans):
        # The model's *decision* to call these tools is non-deterministic,
        # but the tool *outputs* are frozen. Inject them.
        for span in turn_spans:
            mock_tool_call(span["tool"], span["inputs"], tool_mocks[span["span_id"]])
        # Now inspect the context state at this turn
        print(f"--- turn {turn} context state ---")
        print(summarize_context(context))
```

Why this matters: when an agent produces a wrong final output, the bug is almost never in the last tool call. It's usually two to five turns earlier — a `read_file` that returned stale data, a `search` that matched the wrong file, a `patch` that silently failed. Replay lets you step through the agent's evolving context and pinpoint the exact turn where the state diverged from correct.

Without replay, you're doing what I used to do: reading 4,000 lines of interleaved log, trying to mentally reconstruct which output fed into which input. With replay, the debugging loop drops from an hour to five minutes.

## The Three Metrics That Actually Correlate With Quality

Once you have structured logging, you can compute metrics. But most agent dashboards I've seen track the wrong ones. Token count, cost, and latency are *operational* metrics — they tell you the agent is running, not that it's running *well*.

After tracking my agents for six months, these three metrics have the strongest correlation with output quality (measured by human review of the final deliverable):

**1. Tool success rate (r = 0.81 with quality).** The percentage of tool calls that succeed on the first attempt with no retry. When this drops below 0.90, quality falls off a cliff — the agent starts compensating for failed tools by inventing plausible-looking outputs instead of retrying or reporting the blocker. This is the single best leading indicator I've found. If I see tool success rate trending down over a week, I know quality is about to degrade before any human notices.

**2. Average turns to done (r = 0.63, inverted).** Tasks that complete in 4-8 turns are the highest quality. Tasks that drag past 15 turns almost always have something wrong — the agent is stuck in a loop, retrying the same failed approach, or thrashing between tools. A high turn count isn't efficiency; it's a symptom of a confused agent. Set an alert when a single task exceeds 20 turns.

**3. Hallucination rate (r = 0.74, inverted).** Measured by sampling tool calls where the agent references a file path, command output, or API response that doesn't appear in any prior tool output in the trace. This requires comparing the agent's *claims* in its text output against the *captured tool outputs*. It's more expensive to compute than the other two, but it's the metric that catches the subtle drift that tool success rate misses — the agent that succeeds on every tool call but builds a narrative on top of them that doesn't match reality.

```python
def detect_hallucinated_references(trace_spans):
    # Collect every string the agent could be referencing
    real_outputs = {s["span_id"]: s["outputs"] for s in trace_spans}
    real_text = json.dumps(real_outputs)
    
    # Find file paths, commands, and quoted strings in agent text turns
    claims = extract_references(agent_text_turns)
    hallucinated = [c for c in claims if c not in real_text]
    return len(hallucinated) / max(len(claims), 1)
```

Cost-per-task and token count? r = 0.12 and r = 0.19 with quality respectively. They tell you nothing about whether the output is good. Track them for budget reasons, but don't put them on your quality dashboard.

## What I'd Build First

If you're starting from zero — no structured logging, no traces, no metrics — don't try to build all three layers at once. The order that actually pays off:

1. **Structured tool-call logging** (one weekend). Wrap your dispatch layer, emit JSONL, add `trace_id` and `turn`. This alone eliminates 80% of debugging time because you can finally *search* your logs instead of reading them linearly.
2. **Replay debugging harness** (one weekend). Once you have the JSONL, replay is mostly file I/O and a mock registry. This is where the investment feels like magic.
3. **Metrics dashboard** (ongoing). Start with tool success rate and turns-to-done. Add hallucination rate once you have a sampling pipeline. Skip token/cost dashboards for quality purposes — they belong on a budget page, not a quality page.
4. **Trace propagation** (when you start delegating). Don't build this until you actually have nested delegation, because it adds complexity to every delegation prompt. But the day you spawn your first child agent, wire it up before you ship — retrofitting trace propagation across a system that already has 50 delegation paths is miserable.

## The Uncomfortable Truth

Most agent failures I've seen in production were *visible in the telemetry* — if the telemetry had existed. The agent that published a post with no hero image had a `curl 404` three turns before the publish call. The agent that rewrote the wrong file had a `search` that matched a stale path two turns before the patch. The cron job that quietly failed for three weeks had `error: {"type": "ConnectionRefused"}` in every single run, buried in a flat log nobody was watching.

The agent wasn't hiding these signals. We weren't capturing them in a form we could act on.

Build the telemetry layer first. Then ship the agent.