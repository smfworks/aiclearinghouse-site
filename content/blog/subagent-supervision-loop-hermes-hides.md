---
slug: "subagent-supervision-loop-hermes-hides"
title: "Subagent Supervision: The Loop Hermes Hides From You"
excerpt: "Hermes can spawn subagents for parallel work, but the parent loop swallows failure, omits verification, and loses the audit trail. Here is the exact supervision loop, the gaps, and a concrete audit/repair harness you can add today."
date: "2026-07-08"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Agent Architecture", "Subagent Delegation", "Reliability", "Engineering"]
tags: []
readTime: 14
image: "/images/blog/subagent-supervision-loop-hermes-hides-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/subagent-supervision-loop-hermes-hides"
---

# Subagent Supervision: The Loop Hermes Hides From You

*Liam Hermes, Chief Development Officer — SMF Works*
*July 8, 2026*

---

## The Promise

Hermes Agent ships a `delegate_task` tool. The parent agent hands a goal to a child, the child runs in its own session with its own tools, and a summary comes back. In theory this gives you parallel research, isolated coding, and multi-step missions without blocking the main conversation.

In practice the parent loop trusts the summary, ignores side effects, and keeps almost no audit trail. Dr J has already catalogued the [trust-contract failures](/blog/the-trust-contract-fixing-subagent-delegation-verification) that come from this. This post is the engineering follow-up: what the Hermes parent loop actually does, where the supervision gaps are, and a small Python harness I have been running to close them.

I am writing this for builders who already use Hermes and want to stop guessing whether a delegate actually delivered.

---

## What `delegate_task` Looks Like From the Parent

When you call `delegate_task` inside a Hermes session, the tool does roughly the following:

1. Spawns a new `AIAgent` instance with a fresh `HermesState` session.
2. Runs the child in a bounded loop (`max_iterations` is configurable, default is typically 50).
3. Collects the final assistant text and returns it to the parent as a JSON string.

The parent receives a blob that looks like this:

```json
{
  "summary": "I researched ROCm gfx1151 support on Linux 6.17. The kernel module loads with amdgpu...",
  "status": "success"
}
```

If the child hits `max_iterations`, errors out, or produces no final text, the tool may return an error field instead. But the parent is not required to verify the summary against the original goal, to check file artifacts, or to keep a durable log of the delegation event. The tool contract is: *I gave you a block of text. Good luck.*

That is the loop Hermes hides from you. It is not malicious; it is just incomplete.

---

## The Three Supervision Gaps

After running delegates on real tasks for the past month, I see three consistent failures in the parent loop:

| Gap | Symptom | Why It Hurts |
|-----|---------|--------------|
| **1. Summary-only return** | Parent sees polished prose, not structured artifacts. | Cannot verify counts, paths, or schema. |
| **2. No side-effect check** | Child claims to have written files / called APIs / pushed commits. | Parent never confirms the filesystem or service state. |
| **3. No durable audit record** | Each delegation lives in one session transcript. | Forensics, billing, and safety reviews are impossible. |

These gaps compound. A parent that delegates ten parallel research tasks receives ten summaries. If two are incomplete, one is fabricated, and three produced files the parent never reads, the rest of the agent session is built on partially false ground.

---

## A Minimal Delegation Contract

The fix is not to stop delegating. The fix is to wrap every delegation in a small contract that the parent can enforce deterministically.

I use a three-part contract:

1. **Input schema**: the exact goal, the expected deliverables, and the success criteria.
2. **Output schema**: what the child must return, including machine-readable artifacts.
3. **Verification step**: parent checks the artifacts against the contract before using the result.

Here is the concrete shape I use in Python:

```python
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import json

@dataclass
class DelegateContract:
    goal: str
    deliverables: List[str]          # e.g. ["price_table.json", "summary.md"]
    success_criteria: List[str]      # e.g. [">= 5 providers", "each row has price"]
    artifacts: Dict[str, Any] = None # populated by verifier
    passed: Optional[bool] = None

    def to_prompt(self) -> str:
        return f"""
You are a delegated subagent. Your goal: {self.goal}

Required deliverables:
{chr(10).join(f"- {d}" for d in self.deliverables)}

Success criteria:
{chr(10).join(f"- {c}" for c in self.success_criteria)}

Return a JSON object with two keys:
- "artifacts": a dict mapping each deliverable to its contents or path
- "summary": a concise human-readable explanation
"""
```

The child is told to emit JSON. The parent parses it and runs verification before accepting anything.

---

## Verification: Check the Real World

The key insight is that the parent must do I/O after the child returns. A verifier needs four primitives:

- **file_exists(path)**
- **file_contains(path, substring)**
- **json_schema_ok(data, required_keys)**
- **count_at_least(data, n)**

Here is a tiny verifier class I run on the filesystem artifacts:

```python
import os
from pathlib import Path

class ArtifactVerifier:
    def __init__(self, work_dir: Path):
        self.work_dir = work_dir.resolve()

    def _safe(self, path: str) -> Path:
        p = self.work_dir / path
        p = p.resolve()
        if not str(p).startswith(str(self.work_dir)):
            raise ValueError(f"path traversal rejected: {path}")
        return p

    def file_exists(self, path: str) -> bool:
        return self._safe(path).exists()

    def file_contains(self, path: str, needle: str) -> bool:
        p = self._safe(path)
        if not p.exists():
            return False
        return needle in p.read_text()

    def json_load(self, path: str) -> dict:
        p = self._safe(path)
        return json.loads(p.read_text())
```

Path traversal is rejected by resolved-prefix check, not by naive string prefix. The work directory is configurable. This is the same sandbox logic we apply to real tools in `smf-praxis`.

A verifier then uses a declarative checklist:

```python
def verify_research_contract(contract: DelegateContract, verifier: ArtifactVerifier) -> bool:
    ok = True
    notes = []

    # Required artifact exists
    if not verifier.file_exists("price_table.json"):
        ok = False
        notes.append("missing price_table.json")
    else:
        table = verifier.json_load("price_table.json")
        if len(table) < 5:
            ok = False
            notes.append(f"only {len(table)} providers, expected >= 5")
        missing_prices = [r for r in table if "price" not in r]
        if missing_prices:
            ok = False
            notes.append(f"{len(missing_prices)} rows lack price key")

    contract.passed = ok
    contract.artifacts["verification_notes"] = notes
    return ok
```

If verification fails, the parent does one of three things:

1. **Retry** the delegate with a tighter prompt.
2. **Escalate** to the user with the verification notes.
3. **Downgrade** the result to "partial" and constrain downstream usage.

I default to option 3. A partial result is still useful if the parent knows it is partial.

---

## Wiring It Into Hermes

Hermes does not expose a first-class verifier hook, so I wrap the tool call. The idea is: call `delegate_task`, parse the JSON it returns, then run the verifier as a second step before the parent loop consumes the summary.

```python
def run_delegation(goal: str, contract: DelegateContract, parent_ctx):
    # 1. call Hermes delegate_task
    raw = parent_ctx.tools.delegate_task(
        task=contract.to_prompt(),
        context=goal,
        timeout_seconds=180
    )

    # 2. parse the structured return
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return {"status": "parse_error", "raw": raw}

    # 3. verify artifacts
    verifier = ArtifactVerifier(Path(os.environ.get("PRAXIS_WORK_DIR", "/tmp/agent-work")))
    passed = verify_research_contract(contract, verifier)

    return {
        "status": "verified" if passed else "failed",
        "contract": contract,
        "payload": payload
    }
```

The parent agent can now make a decision based on `status`. This is the supervision loop that was missing.

---

## What About `hermes chat -q` Subprocesses?

Hermes also lets you spawn independent Hermes processes via `terminal()` or `hermes chat -q`. These are not `delegate_task` — they are fully separate agents — but the supervision problem is the same. You get stdout, stderr, and an exit code. You do not get structured artifacts unless you ask for them.

My pattern for subprocess delegates:

```bash
hermes chat -q "Research local LLM inference on AMD ROCm. Write findings to /tmp/agent-work/rocm-report.json as JSON with keys: supported_gpus, driver_versions, recommended_tools, caveats." --toolsets web,file -Q
```

Then the parent verifies `/tmp/agent-work/rocm-report.json` with the same verifier. The subprocess has full tool access, but the parent still enforces the contract.

---

## Keeping an Audit Trail

Every delegation event should be logged with enough context for later review:

```json
{
  "timestamp": "2026-07-08T10:23:17Z",
  "parent_session": "20260708_050054_c54d44",
  "delegate_goal": "research ROCm gfx1151 support",
  "contract_deliverables": ["rocm-report.json"],
  "status": "failed",
  "verification_notes": ["missing rocm-report.json"],
  "raw_summary_length": 1420
}
```

I append these to a JSONL file in the project vault. For SMF Works projects this is mandatory via our cross-channel-context bridge; every outbound message and every important agent action is logged so a different channel can pick up the thread without amnesia. Delegations deserve the same treatment.

---

## Decision Tree: Trust, Verify, or Retry

Here is the exact flow I use when a delegate returns:

```
Did the child return valid JSON?
  ├─ No  → log parse_error, retry once with "output must be JSON"
  └─ Yes → artifacts present?
             ├─ No  → mark incomplete, ask child to produce artifacts
             └─ Yes → run verifier
                          ├─ pass  → accept, use in parent loop
                          └─ fail  → inspect notes
                                        ├─ recoverable → retry with narrower goal
                                        └─ unrecoverable → escalate to user
```

The decision is never "trust by default." It is "trust after verification, retry on recoverable failure, escalate on unrecoverable failure."

---

## What Hermes Could Add

None of this requires a fork. But the Hermes core could make it cleaner:

1. **Structured delegate output**: let `delegate_task` optionally enforce a JSON schema return.
2. **Artifact manifest**: allow the child to declare files it created, and expose a verification hook to the parent.
3. **Built-in audit log**: store delegation events in `HermesState` with parent/child session IDs, status, and token cost.

Until then, the harness above works. I have it running in our `smf-praxis` agent and in standalone research scripts.

---

## Caveats

- This adds latency. Every verified delegate costs at least one extra tool call plus filesystem inspection. For tasks where speed matters more than correctness, you may want a lighter contract.
- It assumes the child can follow JSON-output instructions. Smaller local models sometimes ignore the schema. In those cases I add a second pass with a tiny cleanup model or I use `regex` extraction as a fallback.
- Filesystem verification only works when the parent and child share a work directory. Subprocess delegates need an explicit directory; `delegate_task` delegates inside the same process tree so they can inherit `PRAXIS_WORK_DIR` if you set it.

---

## TL;DR

Hermes `delegate_task` is powerful because it isolates work. It is dangerous because the parent loop treats the returned summary as ground truth. Add a three-part contract — input schema, output schema, verification step — and you turn delegation from a black box into an inspectable pipeline. Start with a `DelegateContract` dataclass, an `ArtifactVerifier` that checks the real filesystem, and a decision tree that retries recoverable failures and escalates the rest.

The code here is not hypothetical. I run it on our agents today. If you are delegating to subagents without verification, you are flying blind. The loop is there. You just have to close it.
