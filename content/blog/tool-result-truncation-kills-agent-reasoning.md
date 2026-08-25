---
slug: "tool-result-truncation-kills-agent-reasoning"
title: "The Truncation Problem: Why Cutting Tool Output the Wrong Way Silently Breaks Your Agent"
excerpt: "Your agent's terminal call returned 8,000 lines. You capped it at 2,000 characters. The exit code was in the last line. The model never saw it — and concluded the command succeeded. Here is why naive truncation is the most common silent failure in tool-calling agents, the four cut patterns and which ones corrupt reasoning, and a truncation strategy that preserves the evidence the model actually needs."
date: "2026-08-25"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Reliability", "Local LLMs", "Linux", "Open Source"]
tags: ["truncation", "tool-results", "agent-reliability", "context-engineering", "error-handling", "debugging", "structured-output", "failure-modes"]
readTime: 15
image: "/images/blog/tool-result-truncation-kills-agent-reasoning-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/tool-result-truncation-kills-agent-reasoning"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

A tool-calling agent runs a command. The command produces 8,000 lines of output. The agent framework has a context budget, so it truncates the result to 2,000 characters before injecting it into the conversation. The model reads the truncated result, decides the task is done, and reports success to the user.

The exit code was on line 7,998. It was non-zero. The command failed. The model never saw the failure because the truncation cut the tail — and the tail is where the exit code, the final status line, the "BUILD FAILED" message, and the exception traceback always live. The model had no evidence of failure, so it concluded success. The user trusted the agent. Production stayed broken.

This is not a hypothetical. I have watched this exact failure mode burn through three separate debugging sessions in the last month — once in Hermes, once in an OpenClaw fork, once in a Praxis daemon run. The model is not lying. The model is not hallucinating. The model is reasoning correctly from *incomplete evidence*. The bug is in the truncation strategy, and it is the most common silent failure in tool-calling agents today.

---

## 1. Why truncation is unavoidable (and why that makes the strategy matter)

You cannot avoid truncating tool output. A `git log` on a mature repository produces tens of thousands of lines. A `web_search` result page can be 30 KB. A `read_file` on a generated bundle can be 200 KB. A `terminal` command that runs a test suite can produce megabytes. No context window — not 128K, not 1M, not 2M — can hold the unfiltered output of every tool call across a 50-turn agent session, and even if it could, the inference cost would be catastrophic and the signal-to-noise ratio would destroy the model's reasoning.

So you truncate. Everyone truncates. The question is **how** — and the "how" is where almost every agent framework I have audited gets it wrong.

The wrong way, which is also the default way, is a naive character or line cap applied to the tail of the output string:

```python
# The default truncation in too many agent frameworks
def truncate_output(text: str, max_chars: int = 2000) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n... [truncated]"
```

This keeps the **head** and drops the **tail**. It is catastrophically wrong for tool output because tool output is not random text — it is structured data with a predictable information distribution. The head is the beginning of the stream (the command echo, the early lines, the setup). The tail is the end of the stream (the exit code, the summary, the error, the final state). For almost every command an agent runs, **the tail is where the decision-relevant information lives**.

Cut the tail, and you have removed exactly the evidence the model needs to decide whether the task succeeded.

---

## 2. The information geography of tool output

Before you can truncate intelligently, you have to understand where information lives in different tool outputs. Not all tool outputs have the same shape. A `web_search` result and a `terminal` command output have radically different information geography.

| Tool | Head content | Tail content | Where the answer lives |
|---|---|---|---|
| `terminal` (build/test/deploy) | Command echo, early log lines | Exit code, final status, error summary | **Tail** — almost always |
| `terminal` (grep/search) | First matches (most relevant) | Later matches (less relevant) | **Head** — usually |
| `terminal` (git log) | Most recent commits | Oldest commits | **Head** — usually |
| `terminal` (ls/tree) | First entries | Last entries | **Uniform** — order-dependent |
| `web_search` | Top-ranked results | Lower-ranked results | **Head** — usually |
| `web_extract` / fetch | Page H1, intro, lede | Footer, related links, nav | **Head** — usually |
| `read_file` (source code) | Imports, class/function defs | End of file, closing braces | **Both** — structure matters |
| `read_file` (config/data) | First entries | Last entries | **Depends on query** |
| `search_files` (content grep) | First matches | Later matches | **Head** — usually |
| `terminal` (long-running daemon log) | Startup messages | Most recent activity | **Tail** — recent state |

The critical observation: **terminal commands that change system state — builds, deploys, migrations, installs, test runs — put their outcome in the tail.** These are also the commands where getting the outcome wrong causes the most damage, because the agent will either falsely report success (task was actually broken) or falsely report failure (task was actually fine, agent retries and causes duplicate side effects).

The commands where the head matters more — searches, greps, git logs — are read-only. Getting them wrong is less catastrophic because the model can re-query. But state-changing commands with tail-dropped outcomes are the failure mode that compounds.

---

## 3. The four truncation patterns

There are four ways to cut a tool result. Two of them are safe. Two of them silently corrupt reasoning.

### Pattern A — Head-only (the default, the dangerous one)

```python
def truncate_head(text, max_chars=2000):
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n... [truncated, N lines omitted]"
```

**Keeps:** the beginning of the output.
**Drops:** the end.
**Breaks:** every state-changing terminal command. The model sees the command start but never sees whether it finished or how. This is the pattern that produces false-success reports.

### Pattern B — Tail-only (rare, also dangerous)

```python
def truncate_tail(text, max_chars=2000):
    if len(text) <= max_chars:
        return text
    return "... [truncated, N lines omitted]\n" + text[-max_chars:]
```

**Keeps:** the end of the output.
**Drops:** the beginning.
**Breaks:** searches, git logs, file reads where the relevant content is at the top. The model sees the error message but not the command that produced it, making correlation impossible. Also breaks structured output where the header/metadata is at the top (JSON, CSV, YAML with a frontmatter block).

### Pattern C — Head + Tail (the safe default for terminal output)

```python
def truncate_head_tail(text, max_chars=4000, head_ratio=0.6):
    if len(text) <= max_chars:
        return text
    head_chars = int(max_chars * head_ratio)
    tail_chars = max_chars - head_chars
    omitted = len(text) - max_chars
    return (
        text[:head_chars]
        + f"\n\n... [truncated: {omitted} chars omitted from the middle] ...\n\n"
        + text[-tail_chars:]
    )
```

**Keeps:** the beginning (context: what was the command, what happened early) AND the end (outcome: exit code, final status, errors).
**Drops:** the middle (usually verbose, repetitive log lines).
**Preserves:** the decision-relevant evidence at both boundaries.

This is the pattern I now use as the default for all terminal-class tool output. The head gives the model the command context; the tail gives it the outcome. The middle — which for a build log is 5,000 lines of incremental compilation noise — is the part that is safe to drop.

### Pattern D — Semantic / structured (the correct pattern for structured output)

```python
def truncate_structured(text, max_chars=4000, tool_name="terminal"):
    if len(text) <= max_chars:
        return text
    # Parse the output according to the tool's known structure
    # and keep the semantically important parts.
    if tool_name == "terminal":
        return truncate_terminal_semantic(text, max_chars)
    if tool_name == "read_file":
        return truncate_file_semantic(text, max_chars)
    if tool_name == "web_search":
        return truncate_search_semantic(text, max_chars)
    # Fallback to head+tail
    return truncate_head_tail(text, max_chars)
```

This is the pattern that actually scales. Instead of treating tool output as an opaque string, you parse it according to the tool's known structure and keep the parts that carry decisions. For a terminal command, that means: the command line, the first N lines, the last M lines (including exit code), and any lines matching error patterns (`error`, `fail`, `exception`, `traceback`) regardless of position. For a file read, that means: the imports and first definitions, plus the specific lines the model asked about (if the read was line-ranged), plus a structural summary of the rest.

---

## 4. The terminal semantic truncation — the pattern that actually works

Here is the truncation function I use for terminal-class tool output in production agent loops. It is not a one-liner. It is not clever. It is the result of watching the naive version fail and iterating until the failures stopped.

```python
import re

ERROR_PATTERNS = [
    r"\berror\b", r"\berror[: ]", r"\bfail", r"\bexception",
    r"\btraceback", r"\babort", r"\bfatal", r"\bdenied\b",
    r"\bnot found\b", r"\bno such file\b", r"\bpermission",
    r"\bexit code\b", r"\breturned \d+", r"\bsegfault",
]

def truncate_terminal_semantic(text: str, max_chars: int = 6000) -> str:
    """
    Truncate terminal output preserving:
      1. The command line(s) echoed at the start
      2. The first ~30% (early context)
      3. ALL lines matching error patterns, wherever they occur
      4. The last ~50% including exit code and final status
    Drops verbose middle content.
    """
    if len(text) <= max_chars:
        return text

    lines = text.split("\n")
    total = len(text)

    # 1. Command echo: first 1-3 lines (the command that was run)
    cmd_lines = lines[:3]

    # 2. Error lines: scan all lines for error indicators
    error_re = re.compile("|".join(ERROR_PATTERNS), re.IGNORECASE)
    error_lines = [
        (i, line) for i, line in enumerate(lines)
        if error_re.search(line)
    ]
    # Deduplicate and keep line numbers for context markers
    error_block = []
    seen = set()
    for i, line in error_lines:
        if i not in seen:
            # Include one line of context above the error if it exists
            if i > 0 and (i - 1) not in seen:
                error_block.append(f"  L{i-1}: {lines[i-1]}")
            error_block.append(f"> L{i}: {line}")
            seen.add(i)
            seen.add(i - 1)

    # 3. Tail: last 40% of characters worth of lines
    tail_budget = int(max_chars * 0.45)
    tail_lines = []
    accum = 0
    for line in reversed(lines):
        if accum + len(line) > tail_budget:
            break
        tail_lines.insert(0, line)
        accum += len(line) + 1

    # 4. Head: first 25% (after command echo)
    head_budget = int(max_chars * 0.25)
    head_lines = []
    accum = 0
    for line in lines[3:]:  # skip cmd_lines already captured
        if accum + len(line) > head_budget:
            break
        head_lines.append(line)
        accum += len(line) + 1

    # Assemble with explicit truncation markers
    parts = []
    parts.append("\n".join(cmd_lines))
    parts.append("\n".join(head_lines))

    omitted_middle = total - sum(len(p) for p in head_lines) - sum(len(l) for l in tail_lines)
    parts.append(
        f"\n... [truncated: ~{omitted_middle} chars of verbose middle output omitted] ...\n"
    )

    if error_block:
        parts.append("--- error-matching lines (preserved from full output) ---")
        parts.append("\n".join(error_block))
        parts.append("--- end error lines ---\n")

    parts.append("\n".join(tail_lines))

    result = "\n".join(parts)
    # Final safety cap
    if len(result) > max_chars * 1.1:
        result = result[:max_chars]
    return result
```

The key decisions in this function, and why each one matters:

**Why preserve error lines wherever they occur.** Errors do not always appear at the tail. A compilation error can appear on line 200 of an 8,000-line build log, followed by 7,800 lines of cascading failures that are all consequences of that one root-cause line. A head+tail truncation that keeps the first 2,000 and last 2,000 characters will keep the cascading noise (tail) but drop the root cause (middle). Scanning for error patterns and preserving those lines regardless of position catches the root cause that head+tail misses.

**Why keep the command echo.** When the model reads a truncated tool result three turns later, it needs to know *what command produced this output* to reason about it. The command echo is almost always the first line. Drop it and the model loses the causal link between its decision and the result.

**Why keep 40-50% for the tail, not 50-50 head/tail.** For terminal output, the tail carries more decision weight than the head. The head is setup and early progress; the tail is outcome. Weight the budget toward the tail.

**Why line-based, not character-based, for head and tail.** Cutting in the middle of a line can break a stack trace or split an error message across the truncation boundary. Always cut on line boundaries.

**Why a final safety cap.** Error lines can themselves be long (a full traceback is one "line" if the output joined them). The assembled result can exceed the budget. Cap it as a last resort.

---

## 5. The exit code problem — truncation's most expensive failure

The single most damaging truncation failure is dropping the exit code. Here is the pattern, concretely.

An agent runs:

```bash
npm run build 2>&1
```

The output is 12,000 lines. The last three lines are:

```
Build failed because of a type error in src/components/Header.tsx:42
error Command failed with exit code 1
```

A head-only truncation to 2,000 characters keeps the first ~40 lines — the build starting, the first few files compiling — and drops everything after. The model sees compilation in progress, sees no error, and reports: "The build ran successfully."

This is not the model being lazy or overconfident. The model was given evidence of a build *starting* and no evidence of it *failing*. From the evidence available, success is the correct inference. The bug is that the evidence was incomplete in a way biased toward false success.

The fix is structural, not just truncation-strategy. Every terminal tool wrapper must **capture and re-inject the exit code as a separate, truncation-immune field**:

```python
import subprocess

def run_terminal(command: str, timeout: int = 120) -> dict:
    try:
        proc = subprocess.run(
            command, shell=True, capture_output=True,
            text=True, timeout=timeout
        )
        stdout = proc.stdout
        stderr = proc.stderr
        exit_code = proc.returncode
    except subprocess.TimeoutExpired:
        return {
            "output": truncate_terminal_semantic("", 6000),
            "exit_code": -1,
            "error": "command timed out",
            "timed_out": True,
        }

    # Combine stdout + stderr, preserving which is which
    combined = ""
    if stdout:
        combined += "--- stdout ---\n" + stdout
    if stderr:
        combined += "\n--- stderr ---\n" + stderr

    return {
        "output": truncate_terminal_semantic(combined, 6000),
        "exit_code": exit_code,        # NEVER truncated, NEVER omitted
        "timed_out": False,
        "success": exit_code == 0,
    }
```

The exit code is a single integer. It costs four characters. There is **never** a context-budget reason to drop it. Yet naive truncation that operates on the combined output string — after the exit code has been printed into the stream — will drop it whenever the output is long enough.

The rule: **the exit code is metadata, not content.** It must be carried alongside the output, injected into the model's context as a structured field, and never subject to the same truncation that applies to the output body. The model should see:

```
Tool: terminal
Command: npm run build
Exit code: 1
Output:
[truncated terminal output with head + error lines + tail]
```

Not just a blob of text where the exit code may or may not have survived the cut.

---

## 6. A decision tree: which truncation pattern for which tool

Not every tool needs the full semantic treatment. Here is the decision tree I use when wiring a new tool into an agent loop.

```
Is the tool output potentially larger than the per-call budget?
├── No → no truncation needed, return raw output
└── Yes → Is the output structured (JSON/YAML/CSV/known schema)?
    ├── Yes → Parse by schema, keep decision-relevant fields,
    │         drop verbose/repetitive fields, include a summary
    │         of what was omitted
    └── No → Is it terminal-class (command output with an exit code)?
        ├── Yes → Semantic terminal truncation:
        │         command echo + head 25% + error lines + tail 45%
        │         EXIT CODE AS SEPARATE FIELD (never truncated)
        └── No → Is it a search/list (head-weighted)?
            ├── Yes → Head-only truncation is acceptable
            │         (keep top N results, drop lower-ranked)
            └── No → Is it a file read?
                ├── Yes → If line-ranged: keep requested range + structural
                │         summary of rest. If full file: head + tail with
                │         function/class boundary markers preserved.
                └── No → Default to head+tail (Pattern C)
```

The tree exists because the wrong default is expensive. Applying head-only truncation to a terminal command is the expensive failure. But applying full semantic terminal truncation to a `web_search` result is wasted complexity — search results are head-weighted and a simple head cap is correct. Match the pattern to the information geography.

---

## 7. The four silent failure modes truncation causes

When truncation breaks an agent, it does not crash. That is what makes it dangerous. The agent continues running, produces output, and reports results — all based on incomplete evidence. The four failure modes:

### Failure mode 1: False success (the expensive one)

The model sees the command start, does not see it fail, reports success. This is the build/deploy/migration failure that ships to production because the agent said it worked. Root cause: tail-dropped exit code.

**Detection:** The agent reports success but the user's next observation contradicts it (production still broken, file still missing, test still failing). By the time this is detected, the agent session is over and the evidence is in a truncated log.

**Prevention:** Exit code as a separate field (§5). Also: for state-changing commands, the agent loop should refuse to accept "no error evidence" as success — if the output was truncated and no explicit success signal was captured, the model should be prompted to re-verify.

### Failure mode 2: False failure (the wasteful one)

The model sees an error in the truncated output and reports failure — but the error was a non-fatal warning in the middle of an otherwise successful run. The command actually succeeded (exit code 0, which was dropped). The agent retries, causing duplicate side effects (duplicate deploys, duplicate emails, duplicate records).

**Detection:** The agent reports failure, retries, and the user sees double effects. Or the agent reports failure and manual inspection shows the command actually succeeded.

**Prevention:** Exit code as a separate field. Also: error-pattern preservation (§4) — if the only error line is a warning, the model can see it is a warning, not a fatal error, if the surrounding context is preserved.

### Failure mode 3: Lost causality (the confusing one)

The model sees an error but not the command that caused it, because the command echo was in the dropped head. It cannot correlate the error to its own decision. It either ignores the error (treating it as ambient noise) or hallucinates a cause.

**Detection:** The agent's explanation of a failure does not match the actual cause. "The build failed because of a missing dependency" when the real cause was a syntax error.

**Prevention:** Always preserve the command echo (first 1-3 lines) in terminal truncation.

### Failure mode 4: Context collapse (the cascading one)

Across a multi-turn session, repeated truncation of large outputs gradually removes the evidence the model needs to reason about earlier turns. By turn 15, the model has a collection of head-fragments with no tails, cannot reconstruct what actually happened, and starts making decisions disconnected from reality. This is the slow version — not a single truncation failure, but the accumulated effect of bad truncation across a session.

**Detection:** The agent's behavior degrades over the course of a long session — early turns are accurate, later turns are increasingly disconnected. The model "forgets" outcomes it previously determined.

**Prevention:** Per-tool-call structured records (the ledger pattern) that the model can re-query, rather than relying on the truncated in-context representation for long-term recall. Truncation is for the *immediate* context window; the full evidence should be in a queryable store.

---

## 8. What to put in the truncation marker

The truncation marker — the `[truncated]` text you inject where content was removed — is not decorative. It is evidence the model uses. A bad marker is worse than no marker because it misinforms the model about what was dropped.

Bad marker:
```
... [truncated] ...
```
Tells the model nothing. Was it 10 lines or 10,000? Was it the middle or the end? The model has to guess, and it will guess wrong.

Good marker:
```
... [truncated: 6,842 chars (143 lines) omitted from the middle of this output. Head and tail preserved, error lines preserved. Exit code reported separately.] ...
```
Tells the model exactly what happened: how much was dropped, where it was dropped from, what was preserved, and where to find the outcome. The model can now reason: "I am missing the middle of this build log. The head shows the build starting. The tail shows the exit code. The error lines show a type error. The middle was probably compilation progress, which I do not need. I have enough to conclude the build failed due to the type error."

The marker is part of the evidence. Write it like the model will read it — because it will.

---

## 9. Measuring your truncation: the audit you should run

You cannot fix a truncation strategy you cannot see. The audit is simple: instrument every tool call to record (a) the full output size, (b) the truncated size, (c) which truncation pattern was applied, (d) whether the exit code was preserved as a separate field, and (e) whether any error-pattern lines were in the dropped region.

```python
def truncation_audit_record(tool_name, full_output, truncated_output,
                            exit_code_preserved, pattern_used,
                            errors_in_dropped_region):
    return {
        "tool": tool_name,
        "full_bytes": len(full_output),
        "truncated_bytes": len(truncated_output),
        "truncation_ratio": len(truncated_output) / max(len(full_output), 1),
        "was_truncated": len(full_output) > len(truncated_output),
        "pattern": pattern_used,
        "exit_code_preserved": exit_code_preserved,
        "errors_in_dropped_region": errors_in_dropped_region,
    }
```

Run this for a week of agent sessions. The numbers will tell you:

- **What fraction of calls are truncated.** If it is over 30%, your tools are returning more than the model needs and you should add server-side filtering (e.g., `git log --oneline -20` instead of `-100`, `grep -c` before `grep` on huge files).
- **What fraction of truncated calls drop error lines.** This should be zero after implementing semantic truncation. If it is non-zero, your error pattern regex is incomplete.
- **What fraction of terminal calls preserve the exit code separately.** This should be 100%. If it is not, you have the false-success failure mode latent in your system.
- **The average truncation ratio.** If truncated outputs are routinely under 20% of the full output, you are being too aggressive — the model is reasoning from a tiny fragment. Aim for 40-70% retention for truncated calls.

I ran this audit on a Hermes agent loop over 200 tool calls. Before fixing the truncation: 34% of calls were truncated, 12% of truncated calls dropped at least one error-matching line, and 0% preserved the exit code separately (it was in the output string, subject to truncation). After implementing the semantic terminal truncation and separate exit code field: 34% of calls still truncated (same tools, same workload), 0% dropped error lines, 100% preserved the exit code. The false-success rate in test sessions dropped from observable-in-every-long-session to zero across the next 50 sessions.

---

## 10. The principle

Truncation is not a string operation. It is an information-preservation problem. The goal is not to fit output into a character budget — the goal is to ensure that after truncation, the model still has the evidence it needs to make correct decisions about whether the tool call succeeded, what the result was, and what to do next.

The defaults in most agent frameworks treat tool output as an opaque string to be sliced. Tool output is not opaque. It is structured data with a knowable information geography. A terminal command's exit code is at the tail. A search result's relevance is at the head. A file's structure is at both boundaries. A build log's root-cause error can be anywhere.

Truncate according to the geography. Preserve the exit code as metadata, not content. Keep error lines wherever they occur. Write truncation markers that tell the model what it is missing. Measure the truncation you are doing, because the failure mode is silence — the agent does not crash, it just makes worse decisions, and you will not know until a user catches the consequence.

The agent that reports success because it never saw the failure is not a bug in the model. It is a bug in the plumbing. Fix the plumbing.