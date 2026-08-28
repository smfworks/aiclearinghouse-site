---
slug: "tool-dispatch-execution-wrapper-retries-idempotency"
title: "The Dispatch Layer: Building a Tool Execution Wrapper That Survives Real Agent Workloads"
excerpt: "Governance decides whether a tool is allowed to run. Selection decides which tool the model picks. But between the model emitting a tool_call and the tool actually executing, there is a layer almost nobody writes about: argument validation, per-tool timeouts, safe retry, idempotency for side-effecting tools, and malformed-result recovery. This is the dispatch layer, and it is where most production agent failures actually happen."
date: "2026-08-28"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Linux", "Open Source"]
tags: ["tool-dispatch", "execution-wrapper", "retries", "idempotency", "agent-reliability", "tool-timeouts", "error-recovery", "production-agents"]
readTime: 16
image: "/images/blog/tool-dispatch-execution-wrapper-retries-idempotency-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/tool-dispatch-execution-wrapper-retries-idempotency"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

There is a layer in every tool-calling agent that gets almost no attention in the literature, and it is where most of my production failures actually live. It is not the governance layer — that decides *whether* a tool is allowed to run, based on risk class and approval gates. It is not the selection layer — that decides *which* tool the model should pick from the registry. It is the layer in between: the code that takes a raw `tool_call` object from the model, validates it, executes it safely, handles what comes back, and feeds the result back into context. I call it the **dispatch layer**, and its quality is the single biggest factor in whether an agent degrades gracefully under real workloads or falls apart the first time a tool hiccups.

This post is a practical engineering guide to building it. Everything here comes from running tool-calling agents in production on Hermes — local models on NVIDIA DGX Spark and AMD Strix Halo hardware, cloud models via OpenRouter and direct provider APIs. Where a claim is hardware- or deployment-dependent, I say so. The code patterns are Python because that is what I ship, but the principles are language-agnostic.

---

## 1. The three-layer model (and the gap in the middle)

Most writing about agent tool use collapses to two concerns:

| Layer | Question it answers | What people write about |
|-------|---------------------|------------------------|
| **Governance** | Is this tool *allowed* to run? | Risk classes, approval gates, permission brokers, human-in-the-loop |
| **Selection** | Which tool should the model call? | Tool registries, JSON schemas, prompt engineering, toolset curation |
| **Dispatch** | How do we *execute* the call safely? | *(crickets)* |

The dispatch layer is where the tool_call becomes a function invocation. It handles everything the other two layers assume away: the model passed a string where the schema wanted an integer, the HTTP request timed out at 30 seconds, the tool returned a 47 KB blob that will blow the context window, the same send-email tool got called three times in a row because the model retried after a transient error, the tool raised an unhandled exception and the agent loop crashed.

Governance and selection are necessary. They are not sufficient. An agent with perfect risk classification and a beautifully curated tool registry will still fail in production if its dispatch layer is a bare `tool.run(**args)` with no timeout, no retry, no validation, and no error formatting.

Here is the architecture I build to:

```
Model emits tool_call
       │
       ▼
┌──────────────────────────────────────────────┐
│  DISPATCH LAYER                              │
│                                              │
│  1. Schema-validate arguments                │
│  2. Classify operation (read / side-effect)  │
│  3. Resolve idempotency key (if side-effect) │
│  4. Check timeout budget                     │
│  5. Execute with per-tool timeout            │
│  6. On failure: retry policy decision        │
│  7. Normalize + bound result                 │
│  8. Format error for context injection       │
└──────────────────────────────────────────────┘
       │
       ▼
   Tool result → next model turn
```

Each step is a failure boundary. Let's walk through them.

---

## 2. Argument validation before execution

The model is not a compiler. It will emit arguments that do not match your schema. This is not a model quality problem — it is a fundamental property of probabilistic systems asked to produce structured output. Even with grammar-constrained generation and strict JSON mode, you get type mismatches, missing required fields, and enum values that are close-but-wrong.

The mistake is to pass model output directly to the tool function and let Python blow up. An unhandled `TypeError` in the dispatch path kills the entire agent loop. The correct pattern is to validate against the JSON schema *before* the tool sees the arguments, and to feed a structured error back to the model so it can self-correct:

```python
import jsonschema
from typing import Any

class DispatchError(Exception):
    """Structured error for context injection."""
    def __init__(self, message: str, recoverable: bool = True):
        self.message = message
        self.recoverable = recoverable
        super().__init__(message)

def validate_tool_args(tool_name: str, schema: dict, args: dict) -> None:
    try:
        jsonschema.validate(instance=args, schema=schema)
    except jsonschema.ValidationError as e:
        # Give the model a precise, actionable error — not a stack trace.
        raise DispatchError(
            f"Tool '{tool_name}' argument validation failed: "
            f"{e.message} at path {'/'.join(str(p) for p in e.absolute_path) or '(root)'}. "
            f"Schema expects: {json.dumps(e.schema, separators=(',', ':'))}",
            recoverable=True,
        )
```

The key design decision is the **error message format**. When validation fails, the model gets another turn. What you feed back determines whether it self-corrects or flails. Compare:

**Bad** (what a raw exception gives you):
```
TypeError: argument of type 'NoneType' is not iterable
```

**Good** (what the dispatch layer should inject):
```
Tool 'fetch_url' argument validation failed: None is not of type 'string' 
at path 'url'. Schema expects: {"type": "string", "format": "uri"}.
```

The first tells the model nothing useful. The second tells it exactly which field is wrong, what was passed, and what was expected. In my testing, well-formatted validation errors cause the model to self-correct on the next turn in roughly 80–90% of cases. Raw exception strings cause retry loops — the model guesses, fails differently, guesses again, burns turns.

### The missing-field trap

One subtle pattern: models frequently omit optional fields rather than passing `null`. Your validation should treat missing optional fields as "use the default," not as an error. Only reject on missing *required* fields. This sounds obvious, but I have seen dispatch implementations that reject any deviation from the schema, including absent optionals, and the model dutifully passes `null` for every optional parameter — which then fails a `type: ["string", "null"]` check if the schema did not explicitly allow null. Be permissive on optionals, strict on requireds.

---

## 3. Per-tool timeouts (the silent killer)

A tool with no timeout is a denial-of-service vector against your own agent. This is not hypothetical. I have watched a `fetch_url` tool hang for 180 seconds because the target server accepted the TCP connection and then never sent a response body. The agent loop blocked. The user stared at a spinner. When the request finally timed out at the OS level, the agent had already exhausted its turn budget on a single tool call.

Every tool execution must be wrapped in a timeout, and the timeout must be **per-tool**, not global. A `read_file` call should time out in 5 seconds. A `fetch_url` should get 15–30 seconds. A `web_search` might need 30. A `code_execution` sandbox might need 60. A single global timeout is wrong because it is simultaneously too long for fast tools and too short for slow ones.

```python
import subprocess
from functools import partial

# Per-tool timeout registry — set when you register the tool.
TOOL_TIMEOUTS = {
    "read_file": 5,
    "list_dir": 5,
    "fetch_url": 20,
    "web_search": 30,
    "code_execution": 60,
    "send_message": 10,
}

DEFAULT_TIMEOUT = 30

def execute_with_timeout(tool_fn, args, tool_name, timeout=None):
    timeout = timeout or TOOL_TIMEOUTS.get(tool_name, DEFAULT_TIMEOUT)
    try:
        # For subprocess-based tools, use the subprocess timeout directly.
        # For in-process tools, use a threading timeout or signal-based alarm.
        result = tool_fn(timeout=timeout, **args)
        return result
    except subprocess.TimeoutExpired:
        raise DispatchError(
            f"Tool '{tool_name}' timed out after {timeout}s. "
            f"The operation may still be running server-side. "
            f"Do not retry blindly — the target may be slow or unresponsive.",
            recoverable=False,  # A timeout is NOT a safe retry candidate
        )
```

### Why timeouts are not retryable

This is a critical design decision and most implementations get it wrong. A timeout means *we do not know whether the operation completed*. For a `read_file` that timed out, the file is still there, retrying is safe. For a `send_message` or a `file_delete` that timed out, the operation may have succeeded server-side — we just never got the response. Retrying a timed-out side-effecting tool is how you send the same email twice or delete a file that was already deleted (and then error on the second attempt).

The rule: **timeouts on read-only tools are retryable. Timeouts on side-effecting tools are not.** This requires the dispatch layer to know which class the tool belongs to — which it should, because the governance layer already classified it.

---

## 4. Retry policy: what is safe to retry, and how

Retry is the most dangerous feature in the dispatch layer, and the most commonly misimplemented. The naive approach — "catch all exceptions, retry three times with exponential backoff" — is correct for read-only HTTP calls and catastrophically wrong for anything with side effects.

### The retry decision tree

```
Tool call failed.
  │
  ├─ Is the tool READ-ONLY (no side effects)?
  │    ├─ YES → Retry is safe. Apply backoff + max attempts.
  │    └─ NO  → Go to side-effect branch ↓
  │
  └─ Side-effecting tool failed.
       │
       ├─ Did it fail BEFORE execution started?
       │    (validation error, connection refused, DNS failure)
       │    └─ YES → Retry is safe. Operation never ran.
       │
       ├─ Did it fail DURING execution (timeout, connection reset)?
       │    └─ NO RETRY. State is unknown. Report to model, let it decide.
       │
       └─ Did it fail AFTER execution with a clear error response?
            (HTTP 4xx with error body, explicit API error)
            └─ NO RETRY. The operation ran and returned an error. 
               Report to model. The model may choose to call the tool
               again with different arguments — that is NOT a retry.
```

The distinction between a **retry** (same tool, same arguments, automatic) and a **re-call** (same tool, possibly different arguments, model-initiated) is important. The dispatch layer handles retries. The model handles re-calls. Never blur the two.

### A safe retry implementation

```python
import time
import random

def retry_policy(tool_name, is_readonly, error, attempt, max_attempts=2):
    """Decide whether to retry and how long to wait."""
    
    # Never retry side-effecting tools that failed during execution.
    if not is_readonly and isinstance(error, (TimeoutError, ConnectionError)):
        return None  # No retry — state unknown
    
    # Never retry validation errors — they will fail identically.
    if isinstance(error, DispatchError) and not error.recoverable:
        return None
    
    # Never retry permanent HTTP errors.
    if hasattr(error, 'status_code') and error.status_code in (400, 401, 403, 404, 422):
        return None
    
    # Exhausted attempts.
    if attempt >= max_attempts:
        return None
    
    # Exponential backoff with jitter to avoid thundering herd.
    base_delay = 1.0 * (2 ** (attempt - 1))
    jitter = random.uniform(0, 0.5 * base_delay)
    return base_delay + jitter
```

The `max_attempts=2` default is deliberate. For read-only tools, two attempts (initial + one retry) catches transient network blips without turning a 2-second call into a 15-second saga. If you need more resilience, raise it per-tool, not globally. I have never needed more than 3 attempts for any read-only tool in production.

---

## 5. Idempotency for side-effecting tools

If you are going to retry anything — or if the model is going to re-call a side-effecting tool after a transient failure — you need idempotency. Without it, a retry or a model re-call produces duplicate side effects: double-sent messages, duplicate file writes, double-charged API calls.

The pattern is an **idempotency key**: a unique identifier attached to each tool call that the downstream system can use to deduplicate. If the tool supports idempotency natively (Stripe, many modern APIs), you pass the key through. If it does not, you track it locally.

```python
import hashlib
import uuid

def make_idempotency_key(tool_name, args, session_id):
    """Generate a deterministic key for a tool call.
    
    For model re-calls with identical arguments, this produces the same key,
    allowing the downstream system to deduplicate. For genuinely new calls
    (different arguments), it produces a different key.
    """
    args_hash = hashlib.sha256(
        json.dumps(args, sort_keys=True).encode()
    ).hexdigest()[:16]
    return f"{session_id}:{tool_name}:{args_hash}"

def execute_side_effecting(tool_fn, args, tool_name, session_id, idempotency_store):
    key = make_idempotency_key(tool_name, args, session_id)
    
    # Check if we already executed this exact call.
    if key in idempotency_store:
        cached = idempotency_store[key]
        return cached  # Return the original result, do NOT re-execute
    
    result = tool_fn(idempotency_key=key, **args)
    
    # Cache the result so a retry or re-call returns the same outcome.
    idempotency_store[key] = result
    return result
```

### The argument-hash pitfall

Using a hash of the arguments as the idempotency key has a subtle failure mode: if the model re-calls the tool with *slightly* different arguments (e.g., it rephrased the email body by one word), the hash changes, and you get a new call instead of a deduplicated one. This is sometimes correct (the model intentionally changed the content) and sometimes not (the model is flailing and re-trying with trivial variations).

For tools where the *intent* matters more than the exact arguments (send an email to this person about this topic), consider a **semantic idempotency key** that hashes only the identifying fields (recipient, subject) rather than the full payload. For tools where exact content matters (write this exact file), hash everything. The choice is tool-specific — encode it in the tool registration, not in the dispatch layer.

### The idempotency store lifecycle

The idempotency store should live for the duration of a session and be cleared when the session ends. Storing it in process memory is fine for single-session agents. For multi-session or daemon-style agents (like the Praxis daemon), persist it to disk (SQLite is ideal) so a process restart does not lose deduplication state. The store should have a TTL — I use 1 hour for most tools, 24 hours for financial tools — to prevent unbounded growth.

---

## 6. Result normalization and bounding

A tool that returns a 50 KB JSON blob will blow your context window. This is the single most common cause of "the agent was working fine and then suddenly got stupid" — a large tool result fills the context, pushes the system prompt and conversation history past the attention horizon, and the model starts ignoring instructions.

The dispatch layer must **bound every tool result** before it enters context. This is not the tool's job — the tool should return complete data. It is the dispatch layer's job to decide how much of that data the model needs to see.

```python
MAX_RESULT_CHARS = 8000  # ~2000 tokens, leaves room for reasoning

def bound_result(result: str, tool_name: str, max_chars=MAX_RESULT_CHARS) -> str:
    if len(result) <= max_chars:
        return result
    
    # Head + tail truncation preserves both the beginning (context)
    # and the end (final state / error messages).
    head = result[:max_chars // 2]
    tail = result[-max_chars // 2:]
    omitted = len(result) - max_chars
    return (
        f"{head}\n"
        f"\n... [{omitted} characters omitted by dispatch layer] ...\n"
        f"\n{tail}"
    )
```

### Why head + tail, not head only

The instinct is to truncate from the end. That is usually wrong. For a `fetch_url` result, the beginning has the title and opening context. The end has the conclusion and any footer links. For a `read_file` result, the beginning has imports and class definitions. The end has the main function and the `if __name__` block. For a command output, the beginning has the invocation context. The end has the exit status and final error messages. Truncating the tail loses the most decision-relevant information.

Head-plus-tail is not free — you lose the middle, which sometimes contains the exact line the model needed. But it is strictly better than losing the end, and the omission marker tells the model that data exists but was elided, so it can issue a targeted `read_file` with a line offset if it needs the middle.

### Structured results, not free-form strings

Tools should return JSON, not prose. A tool that returns `{"success": true, "path": "/tmp/out.txt", "bytes": 4096}` is parseable, boundable, and cacheable. A tool that returns "The file was written successfully to /tmp/out.txt and is 4096 bytes" is none of those. The dispatch layer should enforce JSON results and reject tools that return raw strings. In Hermes, all tool handlers return JSON strings — this is not a convention, it is a requirement enforced by the registry.

---

## 7. Error injection: what the model sees when a tool fails

When a tool fails, the model gets another turn. What you inject as the tool result determines whether the model recovers or spirals. The principle is the same as for validation errors: **give the model a precise, actionable error, not a stack trace.**

The error format I use, proven across thousands of tool calls:

```python
def format_tool_error(tool_name, error, attempt, retried):
    return json.dumps({
        "error": True,
        "tool": tool_name,
        "message": str(error.message if hasattr(error, 'message') else error),
        "recoverable": getattr(error, 'recoverable', True),
        "attempts": attempt,
        "retried": retried,
        "suggestion": _error_suggestion(tool_name, error),
    }, indent=2)

def _error_suggestion(tool_name, error):
    """Give the model a concrete next step, not just a diagnosis."""
    if isinstance(error, TimeoutError):
        return "The operation timed out. If this is a network call, the target may be slow. Consider trying a different approach or a different data source."
    if hasattr(error, 'status_code'):
        if error.status_code == 401:
            return "Authentication failed. Check credentials. Do not retry with the same arguments."
        if error.status_code == 404:
            return "The requested resource was not found. Verify the path/URL is correct."
        if error.status_code == 429:
            return "Rate limited. Wait before retrying or reduce request frequency."
    return "Review the error message and adjust your approach. Do not repeat the exact same call."
```

The `suggestion` field is the highest-leverage addition. Without it, the model tends to retry the exact same call — because from its perspective, the call was correct and the failure was external. With a suggestion, the model gets a concrete redirect: "do not retry," "try a different source," "check credentials." This cuts retry-loop frequency dramatically.

### The anti-pattern: swallowing errors

The worst dispatch pattern is the silent catch — wrapping tool execution in a try/except that returns an empty string or `{"error": "something went wrong"}` on any failure. This tells the model nothing. The model cannot distinguish a network failure from a validation failure from a permission denial. It will guess, and it will guess wrong, and it will keep guessing until it runs out of turns. **Errors are information. Format them well and the model will use them. Swallow them and the model will flail.**

---

## 8. The complete dispatch wrapper

Putting it all together — this is the shape of the dispatch layer I run in production. It is deliberately boring. Every branch handles a failure mode I have actually hit:

```python
import json
import time
import logging

logger = logging.getLogger("dispatch")

def dispatch_tool_call(
    tool_name: str,
    tool_fn: callable,
    schema: dict,
    args: dict,
    is_readonly: bool,
    session_id: str,
    idempotency_store: dict,
    max_attempts: int = 2,
):
    """Execute a tool call with full dispatch-layer protection."""
    
    # 1. Validate arguments against schema.
    try:
        validate_tool_args(tool_name, schema, args)
    except DispatchError as e:
        logger.warning(f"Validation failed for {tool_name}: {e.message}")
        return format_tool_error(tool_name, e, attempt=0, retried=False)
    
    # 2. Idempotency check for side-effecting tools.
    if not is_readonly:
        key = make_idempotency_key(tool_name, args, session_id)
        if key in idempotency_store:
            logger.info(f"Idempotent hit for {tool_name} key={key}")
            return idempotency_store[key]
    
    # 3. Execute with retry.
    last_error = None
    for attempt in range(1, max_attempts + 1):
        try:
            raw_result = execute_with_timeout(
                tool_fn, args, tool_name
            )
            result = bound_result(raw_result, tool_name)
            
            # Cache side-effecting results for idempotency.
            if not is_readonly:
                idempotency_store[key] = result
            
            return result
            
        except DispatchError as e:
            last_error = e
            wait = retry_policy(tool_name, is_readonly, e, attempt, max_attempts)
            if wait is None:
                break
            logger.info(f"Retrying {tool_name} in {wait:.1f}s (attempt {attempt})")
            time.sleep(wait)
        except Exception as e:
            # Unexpected error — wrap it, do not crash the loop.
            last_error = DispatchError(
                f"Unexpected error in {tool_name}: {type(e).__name__}: {e}",
                recoverable=False,
            )
            logger.exception(f"Unexpected error in {tool_name}")
            break
    
    # 4. All attempts exhausted or retry not attempted.
    return format_tool_error(tool_name, last_error, attempt, retried=attempt > 1)
```

### What this does not do

This is the *execution* layer. It does not decide whether the tool is *allowed* — that is the governance broker's job, and it runs before dispatch. It does not decide *which* tool to call — that is the model's job, guided by the tool schemas in the system prompt. It does not handle approval gates for `SEND` or `DESTRUCTIVE` tools — that is the governance layer pausing execution for human input. The dispatch layer sits downstream of all of that, and it assumes the call has already been authorized. Its job is purely: execute safely, recover gracefully, report clearly.

---

## 9. Operational signals from the dispatch layer

A well-instrumented dispatch layer is also your best observability surface for agent health. The metrics that matter:

| Metric | What it tells you | Action threshold |
|--------|-------------------|------------------|
| **Validation failure rate** | Model is producing bad tool args — schema mismatch or model confusion | >15% → review schema clarity, consider fewer/simpler tools |
| **Timeout rate** | Tools are hitting their time budget — target is slow or budget is too low | >5% → raise timeout or investigate target |
| **Retry rate** | Transient failures are common — network instability or rate limiting | >10% → check provider health, consider longer backoff |
| **Idempotent-hit rate** | Model is re-calling side-effecting tools with identical args | >5% → model is stuck in a loop, check error messages |
| **Result bounding rate** | Tools are returning oversized results | >20% → tools need internal pagination, not just truncation |
| **Unexpected-exception rate** | Tools are crashing with unhandled errors — a bug | >0% → investigate immediately, this is a code defect |

The most diagnostic single metric is the **validation failure rate per tool**. If one tool has a 30% validation failure rate and the rest are under 5%, the problem is that tool's schema — usually a field that is ambiguously typed or a required field the model does not understand. Fix the schema, not the model.

---

## 10. The local-model complication

Everything above applies to any tool-calling agent. On local models — which is where I do most of my work — there are three additional dispatch-layer concerns that cloud-first designs miss.

**First, tool-call format unreliability.** Local models, especially smaller or quantized ones, are more likely to emit malformed tool calls: missing the function name, nesting arguments incorrectly, or emitting the tool call as prose instead of a structured object. The dispatch layer needs a *tolerant parser* that can extract a tool call from partially-structured output, not just a strict JSON parser that rejects anything non-conforming. Hermes does this with a fallback parser that uses regex extraction when the strict parse fails. The cost is occasional false positives (extracting a "tool call" from prose that was not one), but the benefit is that the agent keeps working with models that would otherwise be unusable for tool calling.

**Second, quantization-induced argument drift.** A model served in NVFP4 or INT4 quantization will occasionally produce arguments that are *almost* right — a file path with a transposed character, a numeric argument off by one decimal place, an enum value that is a synonym of the correct one. Strict schema validation rejects these. A local-model dispatch layer should consider a **fuzzy enum match** for string fields with known enumerations: if the model passes `"creat"` instead of `"create"`, and `"create"` is the only enum value within Levenshtein distance 2, accept it. This is a tradeoff — it masks genuine errors — but for local models it meaningfully improves tool-call success rates.

**Third, the thinking-model timeout trap.** Reasoning models (Qwen3 with thinking enabled, DeepSeek-R1, Kimi thinking mode) can spend 20–60 seconds generating a chain-of-thought before they emit a tool call. If your dispatch layer measures timeout from the *start of the model turn*, the thinking eats the tool's timeout budget. Measure tool timeout from the moment the tool function is *invoked*, not from the start of the model turn. This sounds obvious, but I have seen implementations that conflate the two and wonder why their tool calls keep timing out on reasoning models.

---

## 11. What to build, what to buy

If you are using an existing agent framework, check whether its dispatch layer does these things before you build your own. Hermes has a solid dispatch path with timeout handling and result bounding, but the retry policy and idempotency layer are things I add on top for production workloads — they are not in the default loop because the right policy is application-specific. If you are building from scratch, the dispatch layer is the first thing I would harden, before governance, before sophisticated tool selection. A bare `tool.run()` with no protection will fail in production within a day. A dispatch layer with validation, timeouts, retry, and error formatting will run for weeks.

The investment is not large. The complete wrapper above is about 150 lines of Python. The payoff is the difference between an agent that falls apart when a tool hiccups and one that recovers, reports clearly, and keeps working.

---

## Summary

| Concern | Pattern | Failure if skipped |
|---------|---------|-------------------|
| Argument validation | JSON schema check before execution, structured error to model | Unhandled TypeError kills the agent loop |
| Per-tool timeouts | Individual timeout per tool, not global | One slow tool blocks the entire agent |
| Retry policy | Read-only: retry with backoff. Side-effect: only retry pre-execution failures. | Duplicate emails, double deletes, retry storms |
| Idempotency | Deterministic key from session + tool + args, cache results | Model re-calls produce duplicate side effects |
| Result bounding | Head + tail truncation with omission marker | Large tool results blow the context window |
| Error injection | Structured JSON with `recoverable`, `attempts`, and `suggestion` fields | Model flails on opaque errors, burns turns |
| Observability | Per-tool validation/timeout/retry/bounding rates | You do not know which tools are failing until a user complains |

The dispatch layer is not glamorous. It does not appear in architecture diagrams. It is the plumbing between the model and the tools, and like all plumbing, nobody thinks about it until it fails. But it is the layer that determines whether your agent is a demo or a system — and the difference between the two is about 150 lines of disciplined, failure-aware code.

---