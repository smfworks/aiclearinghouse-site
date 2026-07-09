---
slug: "agent-tool-governance-risk-classes-approval-gates"
title: "Agent Tool Governance: Risk Classes and the Approval Gate Pattern"
excerpt: "Giving an LLM agent real tools means giving it real consequences. A concrete risk-class taxonomy (READ, DRAFT, SEND, DESTRUCTIVE), a governance broker that gates the dangerous ones behind human approval, and the code to wire it — with the failure modes that will actually bite you."
date: "2026-07-09"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Agent Architecture", "Engineering", "Reliability", "Local LLMs"]
tags: ["agent-governance", "tool-risk", "approval-gate", "hermes", "smf-praxis", "broker", "safety", "open-source"]
readTime: 15
image: "/images/blog/agent-tool-governance-risk-classes-approval-gates-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/agent-tool-governance-risk-classes-approval-gates"
---

# Agent Tool Governance: Risk Classes and the Approval Gate Pattern

An agent without tools is a chatbot. An agent *with* tools is a chatbot that can `rm -rf`. The hard part of agent engineering is not making the model call functions — modern LLMs do that fluently. The hard part is deciding **which** function calls should execute without asking, and which should stop and wait for a human.

This post is the governance layer I shipped into `smf-praxis` (the SMF Works agent runtime) after watching an autonomous loop draft a perfectly reasonable plan, then immediately try to send an email to a real person and delete a directory in the same turn. Neither was wrong per the plan. Both were wrong per the world. The fix was not more prompting. The fix was a broker.

## The Core Problem: Reversibility Is Not Symmetric

Most "agent safety" advice bottoms out at a familiar hand-wave: *give the agent read-only tools, and only escalate when needed.* That is correct as a principle and useless as an architecture. It tells you nothing about:

- What counts as "read" vs. "write" when a tool does both (`git log` is read; `git commit` is write; `git push` is... send?).
- Where the gate lives — in the tool, in the planner, in the runtime, or in the model's prompt?
- What happens to a running plan when one step needs approval and the rest don't.
- How a daemon recovers an approved-but-interrupted action after a crash.

The unifying insight is cheap to state and expensive to implement well: **classify every tool by the real-world cost of its worst-case execution, then route that class through a broker that can pause the loop.** Reversibility is the axis. A tool that reads a file can be re-run; a tool that sends an email cannot be un-sent. The broker exists to turn that asymmetry into a control-flow seam.

## The Four Risk Classes

I use four classes. Three is too few (merging "send" and "destructive" lets a bug email thousands of people), five is too many (splitting "draft" into "local-draft" and "staged-draft" produces no additional gating decisions). The taxonomy:

| Class | Reversible? | Side effects | Default autonomy | Examples |
|-------|-------------|--------------|------------------|----------|
| `READ` | Yes (idempotent) | None external | **Autonomous** | `read_file`, `list_dir`, `fetch_url`, `git log`, `grep` |
| `DRAFT` | Yes (local-only) | Local filesystem, staged changes | **Autonomous** | `write_file` (sandboxed), `git add`, `npm install --dry-run`, draft composer |
| `SEND` | **No** — observable by third parties | Network egress to humans/systems | **Approval-gated** | real email, Slack/Telegram post, `git push`, API call mutating a remote service |
| `DESTRUCTIVE` | **No** — data loss | Deletes, overwrites, force-pushes, irreversible state | **Approval-gated** | `rm -rf`, `git push --force`, `DROP TABLE`, file delete, `git reset --hard` |

Two design points that matter more than they look:

1. **`DRAFT` is autonomous by default.** Drafting is the bulk of an agent's useful work. If you gate drafts behind approval, your "autonomous" loop is actually a chatbot that pauses every paragraph. The cost of a bad draft is a `git checkout`. The cost of a bad send is a real-world apology. Treat them differently.

2. **`SEND` and `DESTRUCTIVE` are separate because their failure modes differ.** A rogue `SEND` is a reputational/legal problem; a rogue `DESTRUCTIVE` is a recovery/backup problem. They share the *gate* but need different *resume* semantics — see the broker section.

### Why not just "read vs. write"?

Because `git commit` (write, local) and `git push` (write, remote) have nothing in common operationally. The first is free to redo; the second publishes. Collapsing them into "write" forces you to gate all writes or none, and either choice is wrong. The four-class split lets the broker be precise.

## Architecture: The Governance Broker

The broker sits between the agent's planner (which decides *what* to do) and the tool executor (which does it). It is a pure routing layer — it does not plan, it does not execute. This separation is the whole point: you can unit-test the broker without an LLM, and you can unit-test the planner without the broker.

```
            ┌─────────────┐     plan step      ┌───────────────┐
 LLM/Planner│  planner    │ ─────────────────▶ │   broker      │
            │ (decides)   │                    │  (classifies, │
            └─────────────┘                    │   gates)      │
                                               └───────┬───────┘
                                  autonomous  ┌────────┼────────┐
                                   READ/DRAFT │        │        │ SEND/DESTRUCTIVE
                                              ▼        │        ▼
                                       ┌──────────┐    │   ┌────────────────────┐
                                       │ executor │    │   │ TaskManager        │
                                       │ tool.run │    │   │ state=waiting_     │
                                       └────┬─────┘    │   │   approval         │
                                            │          │   └─────────┬──────────┘
                                            ▼          │             │
                                       result log     │      human grants/denies
                                                          │             │
                                                          ▼             ▼
                                                    approve()      deny()
                                                          │             │
                                                          ▼             ▼
                                                    resume()      task ends
                                                    executes the
                                                    approved action
```

The broker holds a `GovernancePolicy` that maps each `RiskClass` to one of two dispositions: `AUTONOMOUS` or `REQUIRES_APPROVAL`. The policy is data, not code — you can load it from config, override it per-deployment, and test it without spinning up tools.

### The policy object

```python
from dataclasses import dataclass, field
from enum import Enum

class RiskClass(Enum):
    READ = "read"
    DRAFT = "draft"
    SEND = "send"
    DESTRUCTIVE = "destructive"

class Disposition(Enum):
    AUTONOMOUS = "autonomous"
    REQUIRES_APPROVAL = "requires_approval"

@dataclass(frozen=True)
class GovernancePolicy:
    # Tools in these classes run without asking.
    autonomous_risks: frozenset = field(
        default_factory=lambda: frozenset({RiskClass.READ, RiskClass.DRAFT})
    )

    def disposition_for(self, risk: RiskClass) -> Disposition:
        if risk in self.autonomous_risks:
            return Disposition.AUTONOMOUS
        return Disposition.REQUIRES_APPROVAL
```

The default keeps `READ` and `DRAFT` autonomous. **Do not narrow this to `{READ}` in the default policy.** I made that mistake once: every test that expected a draft to land silently started failing with `waiting_approval`, and the daemon loop stalled on the first `write_file`. Narrow the set only in explicit daemon configuration where you have a human in the loop for every step.

### The broker decision

```python
@dataclass
class ToolCall:
    name: str
    args: dict
    risk: RiskClass

@dataclass
class BrokerDecision:
    tool_call: ToolCall
    disposition: Disposition
    reason: str

class GovernanceBroker:
    def __init__(self, policy: GovernancePolicy, registry: ToolRegistry):
        self.policy = policy
        self.registry = registry

    def evaluate(self, call: ToolCall) -> BrokerDecision:
        risk = self.registry.risk_for(call.name)
        if risk is None:
            # Unknown tool: fail closed. Never default to autonomous.
            return BrokerDecision(call, Disposition.REQUIRES_APPROVAL,
                                  f"unknown tool '{call.name}' — failing closed")
        disp = self.policy.disposition_for(risk)
        return BrokerDecision(call, disp, f"risk={risk.value} → {disp.value}")
```

The one-line rule that saves you at 2am: **unknown tools fail closed.** A planner that hallucinates a tool name (`send_slack_message` when the registered tool is `slack_post`) must not slip through as "probably read-only." If the registry doesn't know it, it waits for a human.

## Wiring It Into the Agent Loop

The agent loop is a `while` over planned steps. The broker's job is to either run the step, or park it and return a `waiting_approval` status. The key is that the loop does **not** die when it parks — it records state and yields, so a daemon can `resume()` later.

```python
from enum import Enum

class TaskState(Enum):
    PLANNING = "planning"
    RUNNING = "running"
    WAITING_APPROVAL = "waiting_approval"
    APPROVED = "approved"
    DENIED = "denied"
    DONE = "done"
    FAILED = "failed"

class PraxisAgent:
    def __init__(self, planner, broker, executor, task_manager, policy):
        self.planner = planner
        self.broker = broker
        self.executor = executor
        self.task_manager = task_manager
        self.policy = policy

    def handle(self, goal: str, task_id: str | None = None) -> dict:
        task_id = task_id or self.task_manager.create(goal)
        steps = self.planner.plan(goal)
        for step in steps:
            call = self._to_tool_call(step)
            decision = self.broker.evaluate(call)
            if decision.disposition is Disposition.AUTONOMOUS:
                result = self.executor.run(call)
                self.task_manager.append_result(task_id, step, result)
            else:
                # Park the exact call so resume() can execute it unchanged.
                self.task_manager.park_for_approval(task_id, call, decision)
                return {"task_id": task_id, "state": TaskState.WAITING_APPROVAL.value,
                        "decision": decision.reason}
        return {"task_id": task_id, "state": TaskState.DONE.value,
                "summary": self.task_manager.summarize(task_id)}
```

And the resume path, which is where most implementations get it wrong:

```python
    def resume(self, task_id: str, granted: bool) -> dict:
        parked = self.task_manager.get_parked_call(task_id)
        if parked is None:
            return {"task_id": task_id, "state": TaskState.FAILED.value,
                    "reason": "no parked call to resume"}
        if not granted:
            self.task_manager.mark(task_id, TaskState.DENIED)
            return {"task_id": task_id, "state": TaskState.DENIED.value}
        # Execute the EXACT parked call — do not re-plan.
        result = self.executor.run(parked.call)
        self.task_manager.append_result(task_id, parked.call, result)
        # Then continue the remaining steps from the original plan.
        return self.handle(parked.goal, task_id=task_id)
```

The critical line is the comment: **execute the exact parked call, do not re-plan.** If you re-plan on resume, the LLM will produce a different plan (it is nondeterministic), and the action the human approved may not be the action that runs. The parked call is the contract between the human and the runtime. Re-planning on resume breaks that contract silently.

## The Decision Tree (Print This)

When a tool call arrives at the broker, the full path:

```
tool call
  │
  ├─ is the tool registered?
  │     NO  → REQUIRES_APPROVAL (fail closed)
  │     YES → lookup RiskClass
  │              │
  │              ├─ READ       → AUTONOMOUS          → executor.run()
  │              ├─ DRAFT      → AUTONOMOUS          → executor.run()
  │              ├─ SEND       → REQUIRES_APPROVAL   → park + WAITING_APPROVAL
  │              └─ DESTRUCTIVE→ REQUIRES_APPROVAL   → park + WAITING_APPROVAL
  │
  └─ (parked) human response
        ├─ deny  → task = DENIED, stop
        └─ grant → resume(): execute parked call exactly, continue plan
```

## Sandbox Discipline for `DRAFT` and `READ` Tools

Because `READ` and `DRAFT` run without approval, they must be sandboxed so that a bug or prompt injection cannot escalate them. Three rules, enforced in the tool, not the prompt:

1. **All filesystem paths resolve inside a work directory** (`PRAXIS_WORK_DIR`, default `./work`). Reject absolute paths before any I/O.
2. **Reject traversal** by checking the *resolved* path, not a string prefix. `../work` passes a prefix check for `work` and escapes the sandbox.
3. **Every tool declares a JSON schema and a `RiskClass`.** No schema, no registration. The broker refuses unclassified tools.

```python
import os
from pathlib import Path

class Sandbox:
    def __init__(self, work_dir: str):
        self.root = Path(work_dir).resolve()

    def resolve(self, relative: str) -> Path:
        # Reject absolute paths outright.
        if os.path.isabs(relative):
            raise ValueError(f"absolute paths not allowed: {relative}")
        candidate = (self.root / relative).resolve()
        # Traversal check on the resolved path, not the string.
        if self.root not in candidate.parents and candidate != self.root:
            raise ValueError(f"escape attempt: {relative} resolves outside sandbox")
        return candidate
```

That `self.root not in candidate.parents` check is the one that catches `../../etc/passwd` after symlink resolution. The string-prefix version (`relative.startswith("..")`) does not.

## `SEND` vs. `DESTRUCTIVE` Resume Semantics

Both classes park, but they resume differently:

| Aspect | `SEND` | `DESTRUCTIVE` |
|--------|--------|---------------|
| Pre-execute check | Confirm recipient, throttle batch size | Confirm exact path/branch, require dry-run log |
| Idempotency on retry | **Not idempotent** — never auto-retry; one execute per grant | Often idempotent (`rm` of an absent file is a no-op) but still one execute per grant |
| Crash recovery | If process dies after send started, **do not re-execute** — mark `NEEDS_HUMAN_VERIFICATION` | If process dies mid-delete, re-scan and report remaining state |
| Audit trail | Recipient, subject, timestamp, message hash | Target path, before/after listing, command |

The general rule: a `SEND` that may have partially completed is the worst case in the whole system, because you cannot tell from the outside whether it went. Treat "send started, process died" as a hard stop requiring human verification — never as a retry candidate.

## Common Failure Modes (Field Notes)

| Failure | What happens | Fix |
|---------|--------------|-----|
| Re-planning on resume | Human approves action A; runtime executes action B | Park the exact `ToolCall` object; `resume()` executes it without calling the planner |
| Unknown tool runs autonomous | Hallucinated tool name slips past | Fail closed on unknown tools in the broker |
| `DRAFT` gated by default | Daemon stalls on first `write_file`; every draft test fails | Keep default `autonomous_risks = {READ, DRAFT}`; narrow only in explicit config |
| Sandbox prefix-only check | `../work` escapes via symlink | Check resolved path containment, not string prefix |
| `tool.run()` signature mismatch | Perception layer calls `run(query=goal, name=goal)`; tool rejects kwargs | Accept `**kwargs` on all tool `run` signatures, or make callers fallback-tolerant |
| `TaskState.result` lost on resume | Approved task shows empty result after restart | Deserialize `result_json` in `TaskState.from_row`; verify round-trip in tests |
| Send-then-crash auto-retried | Recipient gets two emails | Mark partial-send as `NEEDS_HUMAN_VERIFICATION`; never auto-retry `SEND` |
| Approval UX missing but `SEND` tools wired | Tasks park forever, no one sees them | Do not wire `SEND`/`DESTRUCTIVE` tools until the approval CLI/UX exists |

The last row is the one teams skip. It is tempting to wire up the real email tool "because it works in tests." It does not work in production — it parks forever because no human is watching. Wire `SEND`/`DESTRUCTIVE` tools **only** when the approval surface (CLI prompt, gateway `/approve`, dashboard button) is live.

## The Test That Catches The Whole Pattern

You do not need an LLM to test governance. Inject a deterministic planner that returns a fixed plan, and assert the broker routes each step correctly:

```python
def test_broker_gates_send_but_not_draft():
    registry = ToolRegistry()
    registry.register("read_file", risk=RiskClass.READ, schema={...})
    registry.register("write_file", risk=RiskClass.DRAFT, schema={...})
    registry.register("send_email", risk=RiskClass.SEND, schema={...})
    registry.register("delete_file", risk=RiskClass.DESTRUCTIVE, schema={...})

    broker = GovernanceBroker(GovernancePolicy(), registry)

    assert broker.evaluate(call("read_file")).disposition is Disposition.AUTONOMOUS
    assert broker.evaluate(call("write_file")).disposition is Disposition.AUTONOMOUS
    assert broker.evaluate(call("send_email")).disposition is Disposition.REQUIRES_APPROVAL
    assert broker.evaluate(call("delete_file")).disposition is Disposition.REQUIRES_APPROVAL
    # Fail closed on hallucinated tool
    assert broker.evaluate(call("send_slack_message")).disposition is Disposition.REQUIRES_APPROVAL

def test_resume_executes_parked_call_not_replan():
    # _EchoSendPlanner returns a plan that ends with send_email.
    agent = PraxisAgent(planner=_EchoSendPlanner(), broker=broker,
                        executor=recording_executor, ...)
    result = agent.handle("tell the team we shipped")
    assert result["state"] == "waiting_approval"
    captured = recording_executor.calls  # []
    result = agent.resume(result["task_id"], granted=True)
    # The parked send_email ran exactly once, no re-plan drift.
    assert [c.name for c in recording_executor.calls] == ["send_email"]
```

The second test is the one that catches the re-plan bug. If `resume()` re-plans, `_EchoSendPlanner` returns the plan again and you get a second `waiting_approval` instead of execution — the test fails loudly instead of silently in production.

## When To Use This Pattern

- You are giving an agent tools with real side effects (filesystem, network, money, people).
- You want autonomy for the cheap reversible stuff and a human-in-the-loop for the expensive irreversible stuff.
- You have (or will build) an approval surface and a persistent task store so parked tasks survive restarts.

## When NOT To Use It

- **Pure read-only agents.** If every tool is `READ`, the broker is overhead. Skip it; add it the day you add the first `SEND`.
- **Single-shot scripts.** A one-shot `chat -q` that runs for 30 seconds and exits does not need a task manager. The pattern pays off when the loop is long-lived or daemonized.
- **Fully-trusted sandboxed eval harnesses.** If a crash is free and reversible by design, gating adds latency without safety.

## TL;DR

Classify tools by reversibility into `READ`, `DRAFT`, `SEND`, `DESTRUCTIVE`. Run the first two without asking; park the last two behind a broker that records the exact call and waits. On approval, execute the parked call verbatim — never re-plan. Sandbox the autonomous tools so a bug can't escalate them. Fail closed on unknown tools. And do not wire `SEND` or `DESTRUCTIVE` tools at all until the approval surface exists, because a gate no one is watching is just a deadlock.

The code above is distilled from the `smf-praxis` runtime and is MIT-licensed. The patterns are portable to any agent loop — Hermes, OpenClaw, a custom Python harness — because the broker is a 40-line object that doesn't know what an LLM is. That is the feature: governance that survives a model swap.

---

*This is part of an ongoing series on building production agent infrastructure. Previously: [Subagent Supervision: The Loop Hermes Hides From You](/blog/subagent-supervision-loop-hermes-hides) and [Building Hermes API Workflows: Code as Action](/blog/hermes-api-code-as-action-workflows).*