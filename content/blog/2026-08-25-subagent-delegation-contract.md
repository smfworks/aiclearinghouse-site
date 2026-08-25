---
slug: "2026-08-25-subagent-delegation-contract"
title: "The Delegation Contract: Writing Hermes Subagent Briefs That Come Back Right"
excerpt: "Most botched subagent runs aren't a model problem — they're a brief problem. The delegate looked at a goal that assumed knowledge it never received, worked from a context blob full of noise, and returned a self-report you believed. This post is the contract: self-contained goals, tight context budgets, machine-checkable output schemas, and a verification step that treats every subagent summary as a claim, not a fact."
date: "2026-08-25T09:00:00-04:00"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Subagent Delegation", "Tutorial"]
tags: ["hermes", "subagent", "delegation", "context", "json-schema", "automation", "tutorial"]
readTime: 10
image: "/images/blog/liam-subagent-delegation-contract-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-08-25-subagent-delegation-contract"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-25-subagent-delegation-contract"
---

Delegation in Hermes is not "ask a subagent to do the thing." It's a contract negotiation between you and a process that knows nothing about this conversation, has its own context window, and — here's the part everyone learns the hard way — will confidently summarize work it did not actually finish.

I've shipped a lot of subagent pipelines. The ones that failed failed in the same four ways: the goal referenced context the child never received, the context blob was so large the child hallucinated the important part, the output contract was an English sentence instead of a schema, and the parent trusted the child's summary without verification. Every one of those failures is preventable. This post is the prevention.

## The Real Failure Mode

Here's a delegation that looks correct on the surface:

```python
from hermes_tools import delegate_task

result = delegate_task(
    goal="Review the changes and report any bugs.",
    context="We discussed the migration last week. Please be thorough.",
)
```

Two problems jump out immediately. First, the child has no idea what "the changes" are — there's no path, no diff, no repository. Second, the context references "we discussed" as if the child was in that conversation. It wasn't. Every child runs in an isolated context with only what you pass in the `context` field. References to conversations the child never saw are not hints — they're hallucinations waiting to happen.

The fix is a contract. A delegation contract has five parts, and when all five are present the child either returns what you asked for or fails loudly doing it.

## The Five-Part Contract

- **Goal:** one sentence, self-contained, with a measurable outcome. No pronouns, no references to prior conversations.
- **Context:** everything the child physically needs, verbatim, in the `context` field. Paths, file contents, schemas, constraints. Nothing implied.
- **Output:** a machine-checkable contract. A JSON schema or an explicit structure, not "report your findings."
- **Verification:** a step that treats the child's summary as a claim and confirms it against reality.
- **Escalation:** known failure modes and what to do when they appear — steer, stop, or re-spawn.

Let's build each one with real code.

## Part 1: The Self-Contained Goal

A goal is self-contained when it contains every noun it uses. "Fix the bug" fails. "Fix the null-dereference in `lib/auth.py` at lines 142-148, described in the paste below" succeeds.

Look at what a bad goal implies. "Review the changes" — which changes? "Make it faster" — than what? In what units? A testable goal names the artifact, the criterion, and the acceptance test:

```python
goal = (
    "Review the GitHub PR at https://github.com/smfworks/forge/pull/214 "
    "for security issues only. Output one JSON object: "
    "a list of findings with severity, file, line, and a concrete fix. "
    "Return the literal string NO_FINDINGS if the diff is clean."
)
```

The acceptance test is embedded: either findings or the exact sentinel `NO_FINDINGS`. There is no third option, no "I think it's mostly fine," no prose. This is what makes it a contract rather than a request.

## Part 2: Context — What To Send, What To Leave Out

The #1 cause of subagent failure is a bloated context. When you paste 60,000 tokens of repo dump and hope the child finds what matters, you're not delegating — you're outsourcing the hard part of the job and calling it a short cut. The child's single most valuable resource is accurate, bounded context, and you control exactly what it gets.

The rule I now follow: **include only what the child must read to do the task, and include it in full.** Three categories:

- **Required verbatim:** file paths, function signatures, schemas, exact error messages, the diff under review.
- **Referenced by path only:** large files the child can open itself through its own tools. Don't paste the whole repo; give the path and what to look for.
- **Excluded entirely:** prior conversation summaries ("as we discussed"), generic company background, and anything the child can self-serve.

```python
context = "\n".join([
    "Repo: /home/user/projects/forge",
    "Target file: lib/auth.py (open it yourself, 214 lines)",
    "Reviewing commit range: d41d8c..9f86d0",
    "",
    "The exact error driving this review:",
    error_text,  # verbatim traceback — the single most important line
    "",
    "Constraints: security findings only. Ignore style, performance, and",
    "naming. Output format must match these_examples exactly.",
])
```

Notice what's not in there: no "we've been working on this for weeks," no project backstory, no "be careful." Every token is load-bearing. If a child still gets confused with this kind of context, it's a goal problem, not a context problem — go back to Part 1.

## Part 3: The Output Contract

The single most transformative change in my delegation workflow was switching from "report back" to a schema. When the output is free-form prose, the parent can't reliably parse it, merge it, or diff it across runs. When it's a schema, the parent can validate it, re-run failures, and trust the starts of fields even if the content needs scrutiny.

Hermes' `delegate_task` accepts an `output_schema`, and a per-task batch can carry a schema on each sub-task:

```python
from hermes_tools import delegate_task

review_schema = {
    "type": "object",
    "required": ["summary", "findings", "verdict"],
    "properties": {
        "summary": {"type": "string"},
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["severity", "file", "line", "issue", "fix"],
                "properties": {
                    "severity": {"enum": ["critical", "high", "medium", "low"]},
                    "file": {"type": "string"},
                    "line": {"type": "integer"},
                    "issue": {"type": "string"},
                    "fix": {"type": "string"},
                },
            },
        },
        "verdict": {"enum": ["ship", "blocked", "needs_work"]},
    },
}

result = delegate_task(
    goal="Apply the security review contract defined below to PR #214.",
    context="Target: https://github.com/smfworks/forge/pull/214",
    output_schema=review_schema,
)
```

Now the parent code can validate the result before doing anything with it:

```python
import json, jsonschema

payload = json.loads(result)
jsonschema.validate(payload, review_schema)  # raises if the contract is broken

critical = [f for f in payload["findings"] if f["severity"] == "critical"]
if payload["verdict"] == "blocked" or critical:
    fail_build("PR has unresolved security findings")
```

Four lines of validation turn a successful-looking but malformed response into a loud failure. That's the whole point. A contract you can't validate is just a suggestion.

## Part 4: The Verification Step (Treat Self-Reports as Claims)

Here is the lesson that cost me the most trust in my own pipeline: **a subagent's summary is a self-report, not a verified fact.** Children are extremely good at writing polished summaries. They are not automatically good at doing the thing, and nothing in the tooling guarantees the summary maps to reality. The parent's job — your job — is verification, and it should be cheap and mechanical.

The pattern is: ask the child for the *evidence*, not just the conclusion:

```python
verification_schema = {
    "type": "object",
    "required": ["files_changed", "commands_run", "test_result"],
    "properties": {
        "files_changed": {"type": "array", "items": {"type": "string"}},
        "commands_run": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["command", "exit_code", "output_tail"],
                "properties": {
                    "command": {"type": "string"},
                    "exit_code": {"type": "integer"},
                    "output_tail": {"type": "string"},
                },
            },
        },
        "test_result": {"enum": ["all_pass", "failures", "not_run"]},
    },
}
```

Then, in the parent, confirm the artifacts actually exist:

```python
import os

result = json.loads(delegate_task(goal=..., output_schema=verification_schema))

# Claims, cross-checked against the filesystem:
for path in result["files_changed"]:
    assert os.path.exists(path), f"Child claimed {path} but it does not exist"

for run in result["commands_run"]:
    assert run["exit_code"] == 0, (
        f"Command failed: {run['command']} "
        f"(exit {run['exit_code']}, tail: {run['output_tail']})"
    )
```

This is not paranoia, it's determinism. You validate schemas automatically, so validate the world the same way. Does the file the child claims to have edited exist? Does it differ from the base commit? Does the claimed test actually pass if the parent re-runs it? Each check converts "trust me" into "verify me," and after a while you stop shipping summaries and start shipping results.

## Part 5: Escalation — Steer, Stop, Re-Spawn

Contracts also define failure modes. For a live delegation, know your escalation ladder before you need it, not after the child drifts.

- **Steer:** the child is on the right track but heading somewhere useless. Mid-run course corrections are possible — you send a directive ("Stop exploring X, focus on Y") and the child incorporates it. This is cheaper than a full re-run and it keeps the partial work.
- **Stop:** the child is producing garbage or burning tokens with no progress. Cut it and keep whatever partial result it already returned — most frameworks return partial output on an early stop, and that partial output is often enough to salvage the run.
- **Re-spawn:** steer and stop both failed, which usually means the contract itself was wrong. Tear it down, shorten the goal, tighten the context, and launch a fresh child. Re-spawning with the same broken contract is how you burn the same tokens twice.

A practical rule of thumb: steer once, check the response, and if the child still isn't converging, stop and re-spawn rather than steering a second or third time. Two steers on a drifting child is one steer too many. The contract, not the child, is usually wrong.

## The Contract Template

Here's the reusable template I drop into every delegation skill. Copy it, fill in the four fields, and it covers the intent, the boundary, and the failure handling:

```markdown
# Delegation Contract

## Goal
One sentence. Self-contained. Names the artifact, the criterion,
and the acceptance test. (If you used a pronoun, start over.)

## Context (verbatim — nothing implied)
- Paths to the artifacts under work
- Exact error messages / diffs / schemas the child must see
- Explicit "ignore" list (what NOT to spend tokens on)
- Output format with one worked example

## Output contract
Structured JSON per this schema (paste schema). Return the literal
sentinel for the "nothing to report" case so the parent can tell
empty from failed.

## Verification
The parent will cross-check: files claimed exist and changed,
commands claimed to run actually ran with exit 0, and the parent
re-runs any test claimed as passing.

## Failure modes
- Drifting topic: parent steers once.
- Still drifting after steer: parent stops, salvages partial output.
- Contract ambiguity surfaced: parent re-spawns with a tighter brief.
```

## Putting It Together: A Runnable Example

Here is a full, self-contained subagent task that ties the contract together — runnable as-is if you have `delegate_task` in your environment:

```python
from hermes_tools import delegate_task
import json, jsonschema, os

BRIEF_SCHEMA = {
    "type": "object",
    "required": ["reviewed", "findings", "files_touched"],
    "properties": {
        "reviewed": {"type": "boolean"},
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["severity", "file", "line", "issue"],
                "properties": {
                    "severity": {"enum": ["critical", "high", "medium", "low"]},
                    "file": {"type": "string"},
                    "line": {"type": "integer"},
                    "issue": {"type": "string"},
                },
            },
        },
        "files_touched": {"type": "array", "items": {"type": "string"}},
    },
}

def review_with_contract(diff_path: str, repo_path: str) -> dict:
    goal = (
        "Review the diff in " + diff_path + " for security bugs. "
        "The repository is at " + repo_path + " — open files there. "
        "Return findings as JSON matching the schema. "
        "If the diff is clean, return findings: [] and reviewed: true."
    )
    context = (
        "You are reviewing a real diff for a real repository. Nothing "
        "was 'discussed before' — everything you need is either in the "
        "diff file or in the repo at the path given. Security bugs only:\n"
        "SQL injection, shell injection, auth bypass, path traversal, "
        "crypto misuse, deserialization. Ignore style and performance.\n"
        "Each finding needs severity, file, line, and a one-sentence issue."
    )

    raw = delegate_task(goal=goal, context=context, output_schema=BRIEF_SCHEMA)
    result = json.loads(raw)
    jsonschema.validate(result, BRIEF_SCHEMA)          # schema check first

    for path in result["files_touched"]:               # then reality check
        assert os.path.exists(os.path.join(repo_path, path)), (
            f"Child claimed {path} exists — it does not"
        )
    return result
```

The child cannot succeed silently. If the output violates the schema, `jsonschema.validate` raises. If a claimed file doesn't exist, the assertion fails. If the diff is truly clean, the sentinel empties come back and you ship. Every run either returns validated, cross-checked findings or throws.

## When NOT to Use a Contract

Contracts are overhead. Some delegations genuinely don't need all five parts, and forcing them on everything is cargo culting:

- **One-shot questions** — "Summarize this error" — need a goal and a couple of lines of context, not a JSON schema. If the output is going straight to a human eyeball, human format is fine.
- **Generative or creative work** — prose, design exploration, naming. A strict schema fights the task. Use a loose contract: goal, context, and an exit criterion.
- **Tiny, fully-specified micro-tasks** — "run `pytest -x tests/unit`". The shell is a better tool than a subagent.

The test: if you cannot write the four fields of the contract template in under two minutes, either the task is too vague to delegate or it's small enough to do inline. Delegation should make things easier, not add ceremony to things that were already easy.

## The Bottom Line

Subagent delegation gives you parallelism and focus, but it hands all of that to a process that starts with a blank memory and ends with a self-report. The delegation contract is how you close both gaps:

- **Goal + context** control what the child believes it is doing.
- **Output schema** controls what it can return.
- **Verification** controls whether you can trust what it did.
- **Escalation** controls what happens when trust breaks.

Treat the summary as a claim, and the run as successful only after the claim survives the cross-check. Do that and your subagents stop being a gamble and start being a force multiplier — exactly what delegation was supposed to be in the first place.
