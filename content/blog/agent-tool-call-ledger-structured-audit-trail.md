---
slug: "agent-tool-call-ledger-structured-audit-trail"
title: "The Tool Call Ledger: Building a Structured Audit Trail for AI Agents"
excerpt: "Your agent ran 47 tool calls across a 20-minute session. Which ones succeeded? Which retried? What did they cost? If you can't answer in under five seconds, you don't have observability — you have hope. Here is the ledger pattern: one JSONL record per tool call, the schema that makes it queryable, and the three layers that turn raw logs into answers."
date: "2026-08-24"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Observability", "Local LLMs", "Linux", "Open Source"]
tags: ["audit-trail", "observability", "tool-calls", "agent-reliability", "jsonl", "debugging", "cost-tracking", "structured-logging"]
readTime: 14
image: "/images/blog/agent-tool-call-ledger-structured-audit-trail-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/agent-tool-call-ledger-structured-audit-trail"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

An agent finishes a task. The user asks a simple question: "What did it actually do?"

You open the session transcript. It's 40,000 tokens of conversation — interleaved assistant messages, tool call arguments, tool result blobs, reasoning traces, retry notices. The answer is in there somewhere. You scroll for five minutes, grep for `tool_call`, find eighteen hits, try to reconstruct the timeline by hand, and give the user a summary you're not fully confident in.

Now the user asks a harder question: "How much did that cost?"

The transcript doesn't say. The model provider's dashboard lags 24 hours and aggregates across all sessions. Your local inference server logged request latencies but not token counts for cloud calls. You can estimate, but you can't answer.

And the hardest question — the one that matters when something went wrong: "The agent said it deployed the fix, but production is still broken. Did it actually run the deploy command, or did it just say it did?"

The transcript shows the assistant *claiming* it ran the command. It does not show the command's exit code, because you never captured it. The tool result was truncated to fit the context window. The real evidence is gone.

## The Problem: Observability After the Fact Is Not Observability

Most agent frameworks treat logging as a side effect. The agent loop runs, tool calls happen, results come back, and somewhere — in a log file, a stdout stream, a session database — the fragments land in whatever format was convenient at write time. When you need to answer questions later, you're doing digital archaeology: parsing unstructured logs, correlating timestamps, guessing at causality.

This is the same mistake that microservice teams made before distributed tracing became standard. Every service logged. Nobody could answer "what happened in this request?" without spending an hour in Kibana. The fix wasn't better logs — it was *structured* logs with correlation IDs, spans, and a schema that a machine could query.

AI agents need the same treatment, but the problem is harder. A microservice call graph is deterministic — the same request hits the same downstream services in the same order. An agent's tool call sequence is emergent: the model decides which tool to call next based on the results of the previous call. You can't predict the call graph before the session starts. You can only record it as it happens and make the record queryable afterward.

## The Ledger: One Record Per Tool Call

The core data structure is simple. Every tool call — every execution of every tool by the agent loop — produces exactly one structured record. Not a log line, not a print statement, not a fragment buried in a conversation history. One complete, self-contained, queryable record.

```
tool_call_id          string, globally unique within the session
session_id            string, the agent session this call belongs to
turn                  int, which conversation turn triggered this call
tool_name             string, e.g. "terminal", "read_file", "web_search"
risk_class            string, "READ" | "DRAFT" | "SEND" | "DESTRUCTIVE"
status                string, "success" | "error" | "timeout" | "blocked" | "retry"
attempt               int, 1 for first try, 2+ for retries
started_at            ISO 8601 timestamp with milliseconds
ended_at              ISO 8601 timestamp with milliseconds
duration_ms           int, ended_at - started_at
input_summary         string, truncated human-readable description of what was requested
input_hash            SHA-256 of the full input arguments JSON
output_summary        string, truncated human-readable description of the result
output_hash           SHA-256 of the full output
output_bytes          int, size of the full output before truncation
error_type            string or null, e.g. "FileNotFoundError", "TimeoutError"
error_message         string or null, first line of the error
model                 string or null, which model was active (null for non-LLM tools)
provider              string or null, e.g. "ollama", "openrouter", "anthropic"
input_tokens          int or null, tokens consumed (LLM calls only)
output_tokens         int or null, tokens generated (LLM calls only)
estimated_cost_usd    float or null, rough cost estimate
parent_call_id        string or null, for subagent/delegated calls
approval_status       string or null, "approved" | "denied" | "autonomous" | null
```

That's the ledger entry. One JSON object per tool call, written to a JSONL file (one line per record) or a SQLite table (one row per record). The full inputs and outputs are stored separately — hashed in the ledger, with the full content persisted to a content-addressed store keyed by the hash. The ledger references the hash; the store has the bytes. This keeps the ledger small and queryable while preserving the ability to retrieve the full evidence when you need it.

### Why hash the inputs and outputs?

Because tool outputs are large. A `terminal` call that runs `git log --oneline -100` produces 8 KB of text. A `web_search` result can be 20 KB. A `read_file` on a large source file can be 50 KB. If you inline all of that into the ledger, it becomes a multi-megabyte file that's painful to scan, grep, or load into a SQLite browser.

By hashing the full content and storing the hash in the ledger, you get:

1. **A compact, queryable index** — scan the ledger for all `status == "error"` calls in a session without loading megabytes of tool output.
2. **Content-addressed retrieval** — when you need the full output, fetch it from `store/{hash[:2]}/{hash}.txt`. If the same output appears in multiple calls (e.g., a `read_file` called twice on the same file), it's stored once.
3. **Integrity verification** — re-hash the stored content and compare to the ledger hash. If they don't match, the stored content was tampered with or corrupted.

### Why include `risk_class` in the ledger?

Because the governance story is part of the audit story. When you're reviewing a session and you see a `DESTRUCTIVE` call succeeded autonomously at 3 AM, that's a flag regardless of the outcome. The ledger makes policy violations visible: "this session included a `SEND`-class email tool call that was not approved — it ran autonomously because `autonomous_risks` was misconfigured."

## Writing the Ledger: Where to Hook In

The ledger is written by the agent loop, not by individual tools. This is important: tools should not be responsible for logging themselves, because (a) tools don't know the session context, (b) tools don't know the turn number or which model is active, and (c) if a tool crashes before logging, you lose the record.

The hook point is the tool dispatch function — the single place in the agent loop that receives a tool call from the model, executes it, and returns the result. Every tool call goes through this function. This is where you wrap the execution in a ledger entry.

Here's the pattern in Python, agnostic to framework:

```python
import hashlib
import json
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

LEDGER_PATH = Path("~/.hermes/profiles/liam/data/tool-call-ledger.jsonl")
CONTENT_STORE = Path("~/.hermes/profiles/liam/data/tool-output-store")
LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
CONTENT_STORE.mkdir(parents=True, exist_ok=True)


def _ts() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def _hash_content(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def _store_content(data: str, h: str) -> None:
    """Store full content in a content-addressed layout. Idempotent."""
    dest = CONTENT_STORE / h[:2] / f"{h}.txt"
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(data, encoding="utf-8")


def _summarize(text: str, max_len: int = 300) -> str:
    """Truncate to a human-readable summary, collapsing whitespace."""
    clean = " ".join(text.split())
    return clean[:max_len] + ("..." if len(clean) > max_len else "")


def execute_with_ledger(
    tool_name: str,
    tool_fn,
    args: dict,
    *,
    session_id: str,
    turn: int,
    risk_class: str = "READ",
    model: str | None = None,
    provider: str | None = None,
    input_tokens: int | None = None,
    output_tokens: int | None = None,
    parent_call_id: str | None = None,
    approval_status: str | None = None,
) -> str:
    """Execute a tool call and write a structured ledger entry.

    Returns the tool's output string (same as calling tool_fn directly).
    The ledger entry is written as a side effect. If the tool raises,
    the ledger entry captures the error and the exception propagates.
    """
    call_id = f"{session_id}_{turn}_{uuid.uuid4().hex[:8]}"
    input_json = json.dumps(args, sort_keys=True, default=str)
    input_hash = _hash_content(input_json)
    _store_content(input_json, input_hash)

    started = _ts()
    start_perf = time.perf_counter()
    status = "success"
    error_type = None
    error_message = None
    output = ""

    try:
        output = tool_fn(**args)
    except Exception as exc:
        status = "error"
        error_type = type(exc).__name__
        error_message = str(exc).split("\n")[0]
        output = f"[EXCEPTION] {error_type}: {error_message}"
        raise
    finally:
        end_perf = time.perf_counter()
        ended = _ts()
        duration_ms = int((end_perf - start_perf) * 1000)

        output_str = str(output)
        output_hash = _hash_content(output_str)
        _store_content(output_str, output_hash)

        entry = {
            "tool_call_id": call_id,
            "session_id": session_id,
            "turn": turn,
            "tool_name": tool_name,
            "risk_class": risk_class,
            "status": status,
            "attempt": 1,  # incremented by retry wrapper
            "started_at": started,
            "ended_at": ended,
            "duration_ms": duration_ms,
            "input_summary": _summarize(input_json),
            "input_hash": input_hash,
            "output_summary": _summarize(output_str),
            "output_hash": output_hash,
            "output_bytes": len(output_str.encode("utf-8")),
            "error_type": error_type,
            "error_message": error_message,
            "model": model,
            "provider": provider,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "estimated_cost_usd": _estimate_cost(
                provider, model, input_tokens, output_tokens
            ),
            "parent_call_id": parent_call_id,
            "approval_status": approval_status,
        }
        _append_ledger(entry)

    return output


def _append_ledger(entry: dict) -> None:
    """Append one JSON line to the ledger file. Atomic via temp + rename."""
    line = json.dumps(entry, ensure_ascii=False, default=str)
    with open(LEDGER_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# --- Cost estimation table (expand per provider) ---
_COST_PER_M = {
    # (provider, model_fragment): (input_per_M, output_per_M) in USD
    ("ollama", None): (0.0, 0.0),  # local inference, no marginal cost
    ("openrouter", "claude"): (3.0, 15.0),
    ("openrouter", "gpt-4o"): (2.5, 10.0),
    ("openrouter", "deepseek"): (0.14, 0.28),
    ("anthropic", "claude"): (3.0, 15.0),
    ("openai", "gpt-4o"): (2.5, 10.0),
}


def _estimate_cost(provider, model, in_tok, out_tok) -> float | None:
    if not provider or in_tok is None or out_tok is None:
        return None
    for (p, frag), (in_rate, out_rate) in _COST_PER_M.items():
        if p == provider and (frag is None or (model and frag in model.lower())):
            return round(in_tok * in_rate / 1_000_000 + out_tok * out_rate / 1_000_000, 6)
    return None
```

The key design decisions in this implementation:

**The `finally` block ensures the ledger entry is written even when the tool crashes.** This is non-negotiable. If a `FileNotFoundError` kills the tool before it can log, the ledger still records the call, the error, and the duration. The exception still propagates to the agent loop for handling, but the record persists.

**Inputs and outputs are stored separately, referenced by hash.** The ledger stays compact — each entry is roughly 500 bytes. A 200-call session produces a 100 KB ledger file. The full tool outputs, potentially megabytes, live in the content store and are retrieved on demand.

**Cost estimation is a lookup table, not a live API call.** You don't want observability infrastructure making network calls. The rates are hardcoded and updated when pricing changes. Local inference (Ollama) has zero marginal cost — the ledger records `0.0` and you know it was local.

## Querying the Ledger: Three Layers

A JSONL file on disk is useless if you can't query it. The ledger pattern has three layers of access, each serving a different need:

### Layer 1: CLI queries (ad hoc, during debugging)

When an agent session goes wrong and you're debugging, you need answers in seconds. A small CLI script that reads the JSONL file and filters is sufficient:

```python
#!/usr/bin/env python3
"""ledger.py — query the tool call ledger. Usage:

  python3 ledger.py session <session_id>
  python3 ledger.py errors --session <sid>
  python3 ledger.py cost --session <sid>
  python3 ledger.py slow --threshold 5000
  python3 ledger.py timeline <session_id>
"""
import json, sys
from pathlib import Path
from collections import defaultdict

LEDGER = Path("~/.hermes/profiles/liam/data/tool-call-ledger.jsonl")
LEDGER = LEDGER.expanduser()

def load():
    with open(LEDGER) as f:
        return [json.loads(line) for line in f if line.strip()]

def cmd_session(sid):
    calls = [c for c in load() if c["session_id"] == sid]
    print(f"Session {sid}: {len(calls)} tool calls")
    for c in calls:
        status_mark = {"success": "✓", "error": "✗", "timeout": "⏱", "retry": "↻"}.get(c["status"], "?")
        print(f"  {status_mark} turn {c['turn']:>2} {c['tool_name']:<20} "
              f"{c['duration_ms']:>6}ms  {c['status']:<8} "
              f"{c.get('output_bytes', 0):>8}B")

def cmd_errors(sid=None):
    calls = load()
    if sid:
        calls = [c for c in calls if c["session_id"] == sid]
    errors = [c for c in calls if c["status"] == "error"]
    print(f"Errors: {len(errors)} / {len(calls)} total calls")
    for c in errors:
        print(f"  turn {c['turn']} {c['tool_name']}: {c['error_type']}: {c['error_message']}")

def cmd_cost(sid):
    calls = [c for c in load() if c["session_id"] == sid]
    total = sum(c.get("estimated_cost_usd") or 0 for c in calls)
    by_provider = defaultdict(float)
    for c in calls:
        if c.get("estimated_cost_usd"):
            by_provider[c.get("provider", "unknown")] += c["estimated_cost_usd"]
    print(f"Session {sid} cost: ${total:.4f}")
    for prov, amt in sorted(by_provider.items(), key=lambda x: -x[1]):
        print(f"  {prov:<15} ${amt:.4f}")
    # token totals
    in_tok = sum(c.get("input_tokens") or 0 for c in calls)
    out_tok = sum(c.get("output_tokens") or 0 for c in calls)
    print(f"  input tokens:  {in_tok:>10,}")
    print(f"  output tokens: {out_tok:>10,}")

def cmd_slow(threshold_ms):
    calls = [c for c in load() if c["duration_ms"] >= threshold_ms]
    calls.sort(key=lambda c: -c["duration_ms"])
    print(f"Calls slower than {threshold_ms}ms: {len(calls)}")
    for c in calls[:20]:
        print(f"  {c['duration_ms']:>7}ms  {c['tool_name']:<20} turn {c['turn']}  {c['session_id'][:12]}")

def cmd_timeline(sid):
    calls = [c for c in load() if c["session_id"] == sid]
    calls.sort(key=lambda c: c["started_at"])
    print(f"Timeline for {sid} ({len(calls)} calls):")
    for c in calls:
        bar = "█" * min(40, c["duration_ms"] // 100)
        print(f"  {c['started_at'][11:19]} {c['tool_name']:<20} {bar} {c['duration_ms']}ms")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "session"
    if cmd == "session": cmd_session(sys.argv[2])
    elif cmd == "errors": cmd_errors(sys.argv[2] if len(sys.argv) > 2 else None)
    elif cmd == "cost": cmd_cost(sys.argv[2])
    elif cmd == "slow": cmd_slow(int(sys.argv[2]))
    elif cmd == "timeline": cmd_timeline(sys.argv[2])
```

Example session debugging:

```
$ python3 ledger.py session 20260824_140522_a1b2c3
Session 20260824_140522_a1b2c3: 23 tool calls
  ✓ turn  1 web_search            3400ms  success     18432B
  ✓ turn  2 web_extract            8200ms  success     45211B
  ✓ turn  3 read_file               12ms  success       420B
  ✗ turn  4 terminal             18000ms  error          0B
  ↻ turn  4 terminal             12000ms  retry         0B
  ✓ turn  5 write_file             45ms  success       120B
  ...

$ python3 ledger.py errors --session 20260824_140522_a1b2c3
Errors: 1 / 23 total calls
  turn 4 terminal: TimeoutError: Command exceeded 15s timeout

$ python3 ledger.py cost 20260824_140522_a1b2c3
Session 20260824_140522_a1b2c3 cost: $0.0342
  openrouter       $0.0342
  input tokens:      42,180
  output tokens:      3,240

$ python3 ledger.py timeline 20260824_140522_a1b2c3
Timeline for 20260824_140522_a1b2c3 (23 calls):
  14:05:22 web_search            ████ 3400ms
  14:05:26 web_extract            ████████ 8200ms
  14:05:35 read_file               12ms
  14:05:35 terminal               ██████████████████ 18000ms
  14:05:54 terminal               ████████████ 12000ms
  ...
```

Five seconds to any answer. No scrolling through transcripts.

### Layer 2: SQLite for cross-session analysis

JSONL is fine for single-session debugging. For cross-session analysis — "which tools fail most often?", "what's our daily spend?", "which sessions hit the most retries?" — load the ledger into SQLite:

```python
import json, sqlite3
from pathlib import Path

LEDGER = Path("~/.hermes/profiles/liam/data/tool-call-ledger.jsonl").expanduser()
DB = Path("~/.hermes/profiles/liam/data/ledger.db").expanduser()

conn = sqlite3.connect(DB)
conn.execute("""
CREATE TABLE IF NOT EXISTS tool_calls (
    tool_call_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    turn INTEGER,
    tool_name TEXT,
    risk_class TEXT,
    status TEXT,
    attempt INTEGER,
    started_at TEXT,
    ended_at TEXT,
    duration_ms INTEGER,
    input_hash TEXT,
    output_hash TEXT,
    output_bytes INTEGER,
    error_type TEXT,
    error_message TEXT,
    model TEXT,
    provider TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    estimated_cost_usd REAL,
    parent_call_id TEXT,
    approval_status TEXT
)
""")

# Bulk load from JSONL
with open(LEDGER) as f:
    for line in f:
        if not line.strip():
            continue
        entry = json.loads(line)
        conn.execute("""
        INSERT OR REPLACE INTO tool_calls VALUES (
            :tool_call_id, :session_id, :turn, :tool_name, :risk_class,
            :status, :attempt, :started_at, :ended_at, :duration_ms,
            :input_hash, :output_hash, :output_bytes, :error_type,
            :error_message, :model, :provider, :input_tokens,
            :output_tokens, :estimated_cost_usd, :parent_call_id,
            :approval_status
        )""", entry)
conn.commit()
```

Now cross-session questions are SQL:

```sql
-- Which tools fail most?
SELECT tool_name, COUNT(*) AS total,
       SUM(CASE WHEN status='error' THEN 1 ELSE 0 END) AS errors,
       ROUND(100.0 * SUM(CASE WHEN status='error' THEN 1 ELSE 0 END) / COUNT(*), 1) AS error_pct
FROM tool_calls
GROUP BY tool_name
ORDER BY error_pct DESC;

-- Daily spend by provider
SELECT DATE(started_at) AS day, provider,
       COUNT(*) AS calls,
       SUM(input_tokens) AS in_tok,
       SUM(output_tokens) AS out_tok,
       ROUND(SUM(estimated_cost_usd), 4) AS cost
FROM tool_calls
WHERE provider IS NOT NULL
GROUP BY day, provider
ORDER BY day DESC;

-- Sessions with the most retries
SELECT session_id, COUNT(*) AS retry_count
FROM tool_calls
WHERE attempt > 1
GROUP BY session_id
ORDER BY retry_count DESC
LIMIT 10;

-- Any autonomous DESTRUCTIVE calls? (policy check)
SELECT session_id, tool_name, started_at, approval_status
FROM tool_calls
WHERE risk_class = 'DESTRUCTIVE' AND approval_status = 'autonomous';
```

### Layer 3: Anomaly detection with simple thresholds

You don't need a machine learning model to catch the most common agent anomalies. Simple thresholds on ledger data catch 90% of problems:

```python
"""Anomaly checks against the tool call ledger."""
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime, timezone, timedelta

LEDGER = Path("~/.hermes/profiles/liam/data/tool-call-ledger.jsonl").expanduser()

def load():
    with open(LEDGER) as f:
        return [json.loads(l) for l in f if l.strip()]

def check_anomalies():
    calls = load()

    # 1. Error rate spike: any session with >30% error rate
    by_session = defaultdict(lambda: {"total": 0, "errors": 0})
    for c in calls:
        s = by_session[c["session_id"]]
        s["total"] += 1
        if c["status"] == "error":
            s["errors"] += 1
    for sid, s in by_session.items():
        if s["total"] >= 5:  # only check sessions with enough calls
            rate = s["errors"] / s["total"]
            if rate > 0.30:
                print(f"⚠ HIGH ERROR RATE: {sid} — {s['errors']}/{s['total']} ({rate:.0%})")

    # 2. Runaway retries: any call that retried 3+ times
    for c in calls:
        if c.get("attempt", 1) >= 3:
            print(f"⚠ EXCESSIVE RETRY: {c['tool_name']} in {c['session_id']} "
                  f"— attempt {c['attempt']}")

    # 3. Cost spike: any single session > $5
    by_session_cost = defaultdict(float)
    for c in calls:
        by_session_cost[c["session_id"]] += c.get("estimated_cost_usd") or 0
    for sid, cost in by_session_cost.items():
        if cost > 5.0:
            print(f"⚠ COST SPIKE: {sid} — ${cost:.2f}")

    # 4. Slow calls: anything > 60s (might be a hung subprocess)
    for c in calls:
        if c["duration_ms"] > 60_000:
            print(f"⚠ SLOW CALL: {c['tool_name']} in {c['session_id']} "
                  f"— {c['duration_ms']/1000:.1f}s")

    # 5. Unapproved high-risk: DESTRUCTIVE/SEND calls without approval
    for c in calls:
        if c["risk_class"] in ("DESTRUCTIVE", "SEND") and c["approval_status"] == "autonomous":
            print(f"⚠ POLICY VIOLATION: {c['tool_name']} ({c['risk_class']}) "
                  f"ran autonomously in {c['session_id']}")

    # 6. Late-night autonomous actions (between 1am-5am local)
    for c in calls:
        hour = int(c["started_at"][11:13])
        if 1 <= hour <= 5 and c["risk_class"] in ("SEND", "DESTRUCTIVE"):
            print(f"⚠ LATE-NIGHT ACTION: {c['tool_name']} ({c['risk_class']}) "
                  f"at {c['started_at'][11:19]} in {c['session_id']}")
```

Run this as a cron job every hour. It prints nothing when everything is healthy. When it prints, you have a specific, actionable alert — not a vague "something seems off."

## The Full Picture: How the Layers Fit Together

```
┌──────────────────────────────────────────────────────────────┐
│                    AGENT LOOP                                 │
│                                                              │
│  model call ──► tool_calls ──► execute_with_ledger()         │
│                                    │                         │
│                         ┌──────────┴──────────┐              │
│                         │                     │              │
│                    tool_fn()             ledger entry        │
│                         │               (JSON line)           │
│                    result                  │                   │
│                         │                     │               │
│                         ▼                     ▼               │
│                    return result     tool-call-ledger.jsonl   │
│                                              │               │
│                                    content-addressed store    │
│                                    store/{hash}.txt           │
└──────────────────────────────────────────────────────────────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
         ┌─────────────────────┐    ┌──────────────────┐
         │  Layer 1: CLI       │    │  Layer 2: SQLite  │
         │  (single session)   │    │  (cross-session)   │
         │  ledger.py session  │    │  SQL queries       │
         │  ledger.py errors   │    │  spend, error rate │
         │  ledger.py cost     │    │  retry patterns    │
         └─────────────────────┘    └──────────────────┘
                    │                         │
                    └────────┬────────────────┘
                             ▼
                   ┌─────────────────────┐
                   │  Layer 3: Anomaly    │
                   │  Detection (cron)    │
                   │  - error rate spike  │
                   │  - cost spike        │
                   │  - policy violation  │
                   │  - excessive retry   │
                   │  - slow calls        │
                   │  - late-night action │
                   └─────────────────────┘
```

## What This Buys You: Five Concrete Answers

With the ledger in place, the questions that took five minutes of transcript archaeology become five-second queries:

**1. "What did the agent do?"**
```bash
python3 ledger.py session <sid>
```
Twenty-three calls, their status, duration, and output size. The timeline view shows the sequence. You can drill into any call's full output via the content store using the hash.

**2. "How much did it cost?"**
```bash
python3 ledger.py cost <sid>
```
Total spend, broken down by provider, with token counts. Local calls show $0.00 — you know which work was done on-prem and which went to the cloud.

**3. "Did it actually run the command, or just say it did?"**
The ledger entry for a `terminal` call includes `status`, `duration_ms`, `output_hash`, and `output_bytes`. If `output_bytes == 0` and `status == "error"`, the command failed. If there's no ledger entry for that turn at all, the model never called the tool — it fabricated the result in its text response. The ledger is the ground truth; the transcript is the model's narrative about the ground truth.

**4. "Why did the agent retry three times?"**
The ledger shows the retry chain: same `tool_name`, same `turn`, `attempt` 1→2→3, with `status` transitioning from `error`/`timeout` to `success` (or not). The `error_type` and `error_message` on the failed attempts tell you what was wrong. The `duration_ms` tells you whether it was a timeout or an immediate failure.

**5. "Did any high-risk actions run without approval?"**
```sql
SELECT * FROM tool_calls
WHERE risk_class IN ('SEND','DESTRUCTIVE')
  AND approval_status = 'autonomous';
```
If this query returns rows, your governance policy has a gap. The ledger makes the gap visible in seconds rather than discovering it after damage is done.

## Pitfalls and Design Notes

**Don't let the ledger block the agent loop.** The ledger write is a file append — microseconds. The content store write is a file write — milliseconds. Neither should be a network call. If you move the ledger to a database, use a fire-and-forget queue so a slow DB doesn't stall the agent. The agent's primary job is executing tools, not writing telemetry.

**Don't store secrets in the content store.** Tool inputs can contain API keys, tokens, file paths with sensitive names. Before writing to the content store, run a redaction pass: mask anything matching common secret patterns (`sk-`, `Bearer`, `AKIA`, `ghp_`, `xoxb-`, private key headers). Store the redacted version; keep the hash of the redacted version. You lose the ability to replay the exact input, but you gain the ability to share the ledger and content store without leaking credentials.

**Don't conflate the ledger with the session transcript.** The transcript is the conversation — model messages, tool calls, tool results, all interleaved. The ledger is the *index* of tool executions with metadata. They serve different purposes. The transcript is for understanding what the model reasoned about. The ledger is for understanding what actually happened in the system. You need both.

**Rotate and archive.** A busy agent running 50 sessions a day, each with 20 tool calls, produces 1,000 ledger entries per day — roughly 500 KB. After a year, that's 180 MB of JSONL. Not catastrophic, but worth archiving monthly. Keep the last 30 days hot, move older entries to a compressed archive, and load them into SQLite only when needed. The content store grows faster — archive it by session age, keeping recent sessions' outputs accessible.

**The ledger is not a substitute for the agent's own error handling.** If a tool call fails, the agent loop should handle the failure (retry, report to user, try alternative). The ledger records what happened, including the failure. It does not *cause* retries or *prevent* failures. It makes failures visible and queryable so you can improve the system.

**Include non-LLM tool calls too.** Every tool call goes in the ledger — `read_file`, `terminal`, `web_search`, `write_file` — not just LLM model calls. The `model` and `provider` fields are null for non-LLM tools. This gives you the full execution trace, not just the expensive part. When you're debugging "why did the agent spend 45 seconds on this task," you need to see that 38 seconds was a `web_extract` call, not a slow model.

## From Ledger to Practice

The tool call ledger is not a framework feature you wait for. It's a pattern you implement in your agent loop today, in under 200 lines of Python. The payoff is immediate: the next time an agent session goes wrong, you answer "what happened?" in five seconds instead of five minutes. The next time someone asks "what's our monthly LLM spend?", you run a SQL query instead of guessing. The next time a `DESTRUCTIVE` tool call runs without approval at 3 AM, you know about it before the damage spreads.

The ledger doesn't make agents smarter. It makes them *accountable* — to you, to your users, and to the systems they operate on. That accountability is the difference between an agent you trust to run unattended and one you don't.

---

*The patterns in this post are drawn from the Hermes Agent observability layer and the SMF Praxis governance broker, where every tool call passes through a dispatch function that records risk class, approval status, duration, and outcome. The full implementation lives in the agent loop, not in the tools themselves — because observability is a property of the system, not of its components.*