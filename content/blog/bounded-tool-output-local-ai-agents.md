---
slug: "bounded-tool-output-local-ai-agents"
title: "Your Agent's Context Window Is Not a Log Sink: Designing Bounded Tool Outputs for Local Models"
excerpt: "A single unbounded shell command can consume more context than the planner, conversation, and answer combined. Here is a three-layer architecture for filtering, persisting, and budgeting tool results so local AI agents stay reliable under real workloads."
date: "2026-07-22"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Local LLMs", "Linux", "Open Source", "Architecture"]
tags: ["tool-output", "context-window", "local-llms", "ollama", "agent-architecture", "linux", "reliability", "hermes"]
readTime: 15
image: "/images/blog/bounded-tool-output-local-ai-agents-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/bounded-tool-output-local-ai-agents"
---

A coding agent runs `journalctl` against a noisy service, receives 2.4 MB of logs, and then appears to get stupid.

The planner forgets a constraint from three turns ago. The next model call takes much longer. A local model returns an empty response or an HTTP error because the request no longer fits its configured context. The agent retries, adding another error payload to the same conversation. What looked like a weak model is actually an input-shaping failure.

**Tool output is model input.** Every byte returned by a shell, browser, search, database, or MCP tool competes with the system prompt, tool schemas, conversation history, retrieved memory, and the model's next answer. A tool is not complete when it has executed successfully. It is complete when it has returned the smallest result that preserves the evidence the agent needs.

This matters on every model, but local inference exposes the failure first. A 32K context running through Ollama or llama.cpp has far less room for accidental megabytes than a hosted 200K model. Prompt ingestion is not free, KV-cache memory is finite, and the exact cost varies by architecture, cache precision, runtime, and hardware. You should measure it on your stack rather than treating the advertised context length as a free storage tier.

The architecture I recommend has three layers:

1. **Reduce at the tool boundary.** Filter, aggregate, paginate, and return structured evidence instead of raw exhaust.
2. **Persist oversized individual results.** Put the full artifact in the active sandbox and return a bounded preview plus a path.
3. **Enforce an aggregate per-turn budget.** Several medium results can be as destructive as one huge result; spill the largest until the turn fits.

That pattern now exists in Hermes Agent. The implementation is useful beyond Hermes because it addresses a general systems problem: preserving evidence without injecting the entire evidence store into the reasoning loop.

## The actual data path

Most agent diagrams stop at “tool call.” The return path is where reliability is usually lost.

```text
                         model context
┌─────────┐  tool call  ┌──────────┐  bounded result  ┌─────────────┐
│ Planner │────────────▶│ Executor │─────────────────▶│ Next model  │
└─────────┘             └────┬─────┘                  │ invocation  │
                              │                        └─────────────┘
                              │ raw output
                              ▼
                    ┌────────────────────┐
                    │ 1. Tool reduction  │  filter / count / paginate
                    ├────────────────────┤
                    │ 2. Result spill    │  preview + sandbox artifact
                    ├────────────────────┤
                    │ 3. Turn budget     │  largest-first enforcement
                    └────────────────────┘
```

The first layer belongs inside the tool because only the tool understands its data. A log tool knows timestamps and severity. A search tool knows ranking and result count. A database tool knows columns and row boundaries. Generic middleware only sees a string.

The second and third layers belong in the agent runtime. Tool authors will miss edge cases, third-party MCP servers will return whatever they return, and parallel tool calls can create an oversized aggregate even when each result is individually reasonable.

## Start with a context budget, not a magic byte limit

A fixed 100,000-character cap works differently against an 8K model and a 200K model. The cap should scale with the active model's context window and still leave most of that window for everything that is not tool output.

A pragmatic starting point is:

```text
estimated_window_chars = context_tokens × 4
per_result_limit       = min(100,000, estimated_window_chars × 0.15)
per_turn_limit         = min(200,000, estimated_window_chars × 0.30)
preview_size           = 1,500 characters
```

Four characters per token is an estimate, not a tokenizer. Source code, JSON, Unicode text, and base64 all tokenize differently. Use the real tokenizer when your runtime exposes it. Character budgets are still valuable because they are fast, provider-neutral, and available before the next model call.

Hermes currently applies 15% per result and 30% per tool turn, capped at 100K and 200K characters, with 8K/16K floors. The resulting budget table is:

| Model context | Per-result cap | Aggregate tool-turn cap | Inline preview |
|---:|---:|---:|---:|
| 8,192 tokens | 8,000 chars | 16,000 chars | 1,500 chars |
| 16,384 tokens | 9,830 chars | 19,660 chars | 1,500 chars |
| 32,768 tokens | 19,660 chars | 39,321 chars | 1,500 chars |
| 65,536 tokens | 39,321 chars | 78,643 chars | 1,500 chars |
| 131,072 tokens | 78,643 chars | 157,286 chars | 1,500 chars |
| 200,000 tokens | 100,000 chars | 200,000 chars | 1,500 chars |

Those are implementation defaults, not universal constants. The floors deliberately preserve a usable result on small models, but a large system prompt may make them too generous for an 8K deployment. If your prompt and tool schemas already consume 4K tokens, you do not really have an 8K context for tools. Budget against the **remaining** window when you can measure it.

A stronger production formula is:

```text
remaining = context_limit
          - system_prompt
          - tool_schemas
          - conversation_history
          - reserved_completion
          - safety_margin

tool_turn_budget = min(configured_cap, remaining × 0.40)
```

The percentage is a policy choice. The invariant is more important: tool results must have a defined share of the request rather than consuming whatever happens to be left.

## Layer 1: make every tool summarize itself

Do not make generic middleware repair a badly designed tool. Return a result envelope with explicit completeness and continuation fields:

```json
{
  "ok": true,
  "summary": "37 test failures across 4 modules; 29 are assertion mismatches",
  "items": [
    {"file": "tests/test_auth.py", "failures": 14},
    {"file": "tests/test_api.py", "failures": 9}
  ],
  "total_items": 37,
  "returned_items": 2,
  "truncated": true,
  "artifact_path": "/tmp/agent-results/pytest-20260722.log",
  "next_cursor": "failure:3"
}
```

That envelope tells the model what it knows, what it does not know, and how to retrieve more. Silent truncation is dangerous because the model cannot distinguish “these are all the failures” from “these are the first failures that fit.”

On Linux, bound the command before it becomes a tool result:

| Unbounded habit | Bounded replacement |
|---|---|
| `journalctl -u myapp` | `journalctl -u myapp --since "2 hours ago" -p warning -n 300 --no-pager` |
| `docker logs api` | `docker logs --since 10m --tail 300 api` |
| `pytest -vv` | `pytest -q --tb=short --maxfail=20` |
| `git diff` in a large refactor | `git diff --stat`, then `git diff -- path/to/target.py` |
| dump an entire JSON response | `jq '{status, count: (.items|length), errors: [.items[] | select(.status=="error")][0:20]}'` |
| recursively print a repository | search by filename/content first, then read targeted ranges |

A tool should support at least one of these reduction mechanisms:

- server-side or source-side filters;
- `limit` plus a stable cursor;
- field projection;
- aggregation (`count`, histogram, top-N);
- time ranges;
- relevance ranking;
- line or record ranges;
- an artifact path for full fidelity.

If it supports none of them, it is a demo tool, not a production tool.

### Keep errors bounded too

Success paths are not the only risk. Compilers, package managers, and HTTP clients can produce enormous error bodies. Limit stderr separately and preserve the exit status:

```bash
set +e
pytest -q --tb=short --maxfail=20 > /tmp/pytest-agent.log 2>&1
status=$?

printf 'exit_code=%s\n' "$status"
printf '%s\n' 'failure_summary:'
rg -n --max-count 40 'FAILED|ERROR|short test summary' /tmp/pytest-agent.log
printf 'full_log=%s\n' '/tmp/pytest-agent.log'
exit "$status"
```

The full log remains available. The model receives the status, the high-signal lines, and the artifact location—not 80,000 lines of dependency warnings.

## Layer 2: spill the full result, never just discard it

Truncation protects the context window but destroys evidence. Persistence gives you both safety and recoverability.

The runtime should:

1. compare the result size with the active per-tool threshold;
2. write the full result into the same environment where the tool ran;
3. return a small preview, original size, and artifact path;
4. tell the agent how to page through the artifact;
5. fall back to explicit inline truncation if persistence fails.

The “same environment” requirement matters. If the tool executed over SSH or inside a container, saving the result on the orchestrator host and returning that host path is useless to an agent whose `read_file` tool resolves inside the remote environment. Hermes writes through its environment abstraction so local, SSH, Docker, Modal, and other backends can keep the artifact where subsequent tools can reach it.

Here is a compact reference implementation:

```python
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from pathlib import Path

_SAFE = re.compile(r"[^A-Za-z0-9_.-]+")

@dataclass(frozen=True)
class Budget:
    per_result: int
    per_turn: int
    preview: int = 1_500


def budget_for_window(context_tokens: int) -> Budget:
    window_chars = context_tokens * 4
    return Budget(
        per_result=max(8_000, min(100_000, int(window_chars * 0.15))),
        per_turn=max(16_000, min(200_000, int(window_chars * 0.30))),
    )


def safe_name(tool_call_id: str) -> str:
    raw = tool_call_id or "tool-result"
    stem = _SAFE.sub("_", raw).strip("._-") or "tool-result"
    digest = hashlib.sha256(raw.encode()).hexdigest()[:12]
    return f"{stem[:80]}-{digest}.txt"


def spill_result(
    content: str,
    tool_call_id: str,
    budget: Budget,
    result_dir: Path,
) -> str:
    if len(content) <= budget.per_result:
        return content

    result_dir.mkdir(parents=True, exist_ok=True)
    path = result_dir / safe_name(tool_call_id)

    preview = content[: budget.preview]
    try:
        path.write_text(content, encoding="utf-8")
    except OSError as exc:
        return (
            f"{preview}\n\n"
            f"[TRUNCATED: original={len(content)} chars; "
            f"artifact write failed: {type(exc).__name__}]"
        )

    return (
        "<persisted-output>\n"
        f"original_chars: {len(content)}\n"
        f"artifact: {path}\n"
        f"preview_chars: {len(preview)}\n\n"
        f"{preview}\n...\n"
        "</persisted-output>"
    )
```

Two details are easy to miss.

First, sanitize the tool-call ID before using it as a filename. Tool IDs normally come from a provider, but treating `../../outside` or `$(whoami)` as trusted path material is unnecessary risk. Keep the result directory fixed, strip path and shell metacharacters, and add a digest to avoid collisions.

Second, move large content through stdin or a file API—not inside a shell command string. Linux places a limit on the size of individual argument strings. A persistence mechanism designed for large results should not fail because it tried to embed the large result in `bash -c '...'`.

## Layer 3: budget the entire tool turn

Per-result limits do not protect parallel tool calls. Four results of 18,000 characters each pass a 20,000-character individual cap and still inject 72,000 characters into the next request.

After all calls in a model turn finish, calculate the aggregate size. If it exceeds the turn budget, persist the largest unpersisted result first, recalculate, and continue until the turn fits.

```python
def enforce_turn_budget(messages, budget, persist):
    """messages: [{id, content, persisted}, ...]"""
    total = sum(len(m["content"]) for m in messages)
    if total <= budget.per_turn:
        return messages

    candidates = sorted(
        (m for m in messages if not m.get("persisted")),
        key=lambda m: len(m["content"]),
        reverse=True,
    )

    for message in candidates:
        if total <= budget.per_turn:
            break
        before = len(message["content"])
        message["content"] = persist(message["content"], message["id"])
        message["persisted"] = True
        total += len(message["content"]) - before

    return messages
```

Largest-first is not mathematically exotic; it is operationally useful. It reaches the target with fewer artifact writes and preserves more medium-sized results inline. Already-persisted blocks must be skipped or the middleware can recursively persist its own preview.

One special case also needs a policy: the file-reading tool used to retrieve a persisted result. If the generic middleware persists that output again at the same threshold, the agent can enter a `persist → read → persist` loop. Hermes pins `read_file` outside the generic spill threshold and gives the file tool its own line-aware character cap plus `offset`/`limit` continuation. That separation is the right design: **artifact retrieval must be bounded, but it cannot be governed by a rule that makes retrieval impossible.**

## Local-model configuration is not the fix

You can increase context in Ollama with a Modelfile:

```text
FROM qwen3:14b
PARAMETER num_ctx 32768
PARAMETER num_predict 2048
```

```bash
ollama create qwen3-agent-32k -f Modelfile
ollama run qwen3-agent-32k
```

That may be appropriate, but it is capacity planning—not output hygiene. Larger context can increase KV-cache memory and prompt-processing cost. The effect is model- and runtime-dependent, and the serving layer or API request may override the Modelfile. Confirm the effective context in your runtime logs and benchmark the full agent loop.

A bad tool can fill 128K almost as easily as 32K. Raising the ceiling without bounding producers just delays the incident.

## Instrument the boundary

If you cannot see tool-result pressure, you will diagnose it as random model degradation. Emit metrics before and after reduction:

```json
{
  "event": "tool_result_budget",
  "tool": "terminal",
  "tool_call_id": "call_8f31",
  "raw_chars": 248302,
  "inline_chars": 1784,
  "estimated_raw_tokens": 62075,
  "threshold_chars": 19660,
  "turn_total_before": 271905,
  "turn_total_after": 25387,
  "persisted": true,
  "artifact": "/tmp/agent-results/call_8f31.txt",
  "duration_ms": 842
}
```

At minimum, track:

| Metric | Why it matters |
|---|---|
| Raw and inline characters by tool | Finds the noisiest producers |
| Spill count and spill-write failures | Distinguishes healthy reduction from data loss |
| Aggregate tool characters per turn | Catches parallel-call amplification |
| Prompt tokens and prompt-eval latency | Connects output volume to inference cost |
| Context-overflow and length errors | Confirms the user-visible failure mode |
| Follow-up artifact reads | Shows whether previews preserve enough signal |

A high spill rate is not automatically bad. Browser extraction and test logs legitimately produce large artifacts. A high spill rate followed by frequent artifact reads suggests the preview is too weak or the tool should return a better structured summary.

## Test the failure paths, not only the happy path

A reliable output-budget layer needs tests for the places where “just truncate it” breaks:

| Test | Required assertion |
|---|---|
| Result below threshold | Returned byte-for-byte unchanged |
| Result exactly at threshold | Not spilled due to off-by-one error |
| Oversized result | Full content persisted; preview is smaller |
| Multiple medium results | Aggregate enforcement spills largest first |
| Artifact write fails | Explicit truncation marker; no exception loop |
| Malicious tool-call ID | Cannot escape result directory or execute shell syntax |
| Unicode payload | Preview and artifact preserve valid text |
| Remote/container temp path | Returned path is readable in the active environment |
| Retrieval of persisted artifact | Paginates instead of recursively spilling |
| Model context changes | Budget scales down for the smaller window |

Hermes' current regression suite includes the non-obvious Linux case: a 200 KB result must travel to the persistence command through stdin rather than as part of the command string. That is exactly the kind of test that separates an architectural diagram from a mechanism that survives production.

## The decision tree

Use this when designing any tool return path:

```text
Can the source filter or aggregate the result?
├─ yes → filter there; include total_count and completeness metadata
└─ no
   └─ Does the model need the full result immediately?
      ├─ no → return summary + top-N + cursor/artifact
      └─ yes
         └─ Does it fit the per-result budget?
            ├─ yes → return inline
            └─ no → persist full artifact + return bounded preview

After all tools finish:
Does aggregate output fit the per-turn budget?
├─ yes → continue to model
└─ no → spill largest unpersisted results until it does

If persistence fails:
Return bounded preview + explicit data-loss marker; never fail silently.
```

## Practical operating rules

The architecture reduces damage automatically. Good agent behavior prevents the damage in the first place.

1. **Search before reading.** Locate matching files or log lines, then retrieve narrow ranges.
2. **Ask for counts before records.** Cardinality changes the retrieval plan.
3. **Run quiet test modes first.** Escalate verbosity only around a failure.
4. **Keep raw artifacts out of canonical conversation history.** Store pointers and summaries.
5. **Treat MCP tools as untrusted producers.** Apply the same runtime budget to third-party servers.
6. **Preserve status and completeness.** Exit code, total count, truncation state, and cursor matter more than decorative prose.
7. **Batch for latency, budget for the aggregate.** Parallel execution does not make the context window parallel.
8. **Benchmark on the smallest supported model.** A design validated only against a 200K cloud model is not validated for local use.

Hermes' official tool guidance already points in this direction: use targeted file reads with pagination, use search to reduce the candidate set, use code execution when several calls can be filtered before their outputs enter the main context, and use delegation when intermediate tool traces do not belong in the parent context. The [built-in tools reference](https://hermes-agent.nousresearch.com/docs/reference/tools-reference) documents those surfaces. The current budget implementation is visible in the open-source [`budget_config.py`](https://github.com/NousResearch/hermes-agent/blob/7de554277de632364c74fcf8641daa58a9a977d9/tools/budget_config.py) and [`tool_result_storage.py`](https://github.com/NousResearch/hermes-agent/blob/7de554277de632364c74fcf8641daa58a9a977d9/tools/tool_result_storage.py).

## The engineering conclusion

Context overflow is not primarily a model problem. It is backpressure failure.

Databases have query limits. Message buses have payload limits. HTTP servers have body limits. Production agent runtimes need the same discipline at the tool boundary. The model should receive enough evidence to decide what to do next—not every byte the operating system was willing to print.

Filter at the producer. Persist for fidelity. Budget the aggregate. Mark incompleteness explicitly. Then test the ugly paths: full disks, malicious IDs, remote sandboxes, Unicode, parallel calls, and small context windows.

Do that, and a local model stops looking mysteriously unreliable. More often than not, it was never the model. We were using its context window as a log sink.