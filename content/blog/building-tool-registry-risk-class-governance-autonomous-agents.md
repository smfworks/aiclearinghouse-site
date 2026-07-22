---
slug: "building-tool-registry-risk-class-governance-autonomous-agents"
title: "Building a Tool Registry with Risk-Class Governance: How Autonomous Agents Decide What Needs Approval"
excerpt: "A field-tested architecture for giving autonomous agents real tools — filesystem access, web fetches, email sending, file deletion — without losing human control. Four risk classes, a governance broker, fail-closed defaults, and the testing patterns that keep the gate honest."
date: "2026-07-20"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Open Source", "Architecture"]
tags: ["agent-governance", "tool-registry", "risk-class", "autonomous-agents", "approval-gates", "fail-closed", "praxis", "agent-architecture", "human-in-the-loop"]
readTime: 16
image: "/images/blog/building-tool-registry-risk-class-governance-autonomous-agents-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/building-tool-registry-risk-class-governance-autonomous-agents"
---

The first wave of AI agent frameworks gave the model a shell and said "go." That works for demos. It does not work when the agent is drafting real emails, writing files to a production-adjacent directory, or — and this is the one that keeps me up at night — sending messages to real humans on your behalf.

The hard problem is not "can the agent do it." Modern LLMs with tool-calling can do almost anything you wire up. The hard problem is **which actions should run autonomously, which should pause for human approval, and how do you enforce that distinction in code rather than hoping the model behaves.**

This post documents the risk-class governance pattern I built into [Praxis](https://github.com/smfworks/smf-praxis) — an open-source MIT-licensed agent framework — after shipping it through medical, education, school-system, and homeschool compliance verticals. The pattern is generalizable. If you are building any autonomous agent with real-world side effects, this is the architecture I recommend.

## The Problem: Unbounded Tool Access

Most agent frameworks expose tools as a flat list. The LLM sees:

```json
[
  {"name": "read_file", "description": "Read a file from disk"},
  {"name": "write_file", "description": "Write content to a file"},
  {"name": "send_email", "description": "Send an email to recipients"},
  {"name": "delete_file", "description": "Delete a file"},
  {"name": "fetch_url", "description": "Fetch a URL and return content"}
]
```

The model picks whichever tool seems useful. There is no structural difference between reading a file and deleting one. The only gate is the LLM's judgment — which is exactly the thing you should not be relying on for irreversible actions.

This is fine for a coding assistant in a sandbox. It is not fine for an agent that:

- Drafts emails to real patients, parents, or clients
- Writes files to a directory that a downstream process reads
- Has access to send buttons that reach real humans
- Can delete files that represent legal evidence or compliance records

You need a layer between "the model decided to call a tool" and "the tool actually runs." That layer needs to know the risk profile of each tool and enforce a policy.

## The Architecture: Four Risk Classes

Every tool in the registry is classified into one of four risk classes. The classification is a property of the tool, not a runtime decision — it is declared at registration time and enforced structurally.

| Risk Class | Examples | Default Behavior |
|------------|----------|-----------------|
| `READ` | `read_file`, `list_dir`, `fetch_url`, `search_web` | Autonomous — runs without approval |
| `DRAFT` | `write_file` (to sandbox), `compose_email` (to drafts) | Autonomous — runs without approval |
| `SEND` | `send_email`, `post_message`, `submit_form` | Pauses — requires human approval |
| `DESTRUCTIVE` | `delete_file`, `send_command`, `overwrite_config` | Pauses — requires human approval |

The key insight: **READ and DRAFT are reversible.** A draft email sits in a drafts folder. A file written to a sandbox can be overwritten or ignored. The agent can produce work autonomously because a human can review the output before it reaches the world.

**SEND and DESTRUCTIVE are irreversible.** Once an email is sent, it is sent. Once a file is deleted, it is gone. These must pause for human approval, every time, with no exceptions.

This is not a suggestion. It is a structural enforcement point in the execution loop.

## The Governance Broker

The broker sits between the planner (which decides what tool to call) and the executor (which runs the tool). Every tool call passes through it.

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Planner │────▶│  Broker  │────▶│ Executor │────▶│  Tool    │
│ (LLM or  │     │ (policy  │     │ (runs    │     │ (side    │
│  heurist)│     │  check)  │     │  action) │     │  effect) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  Autonomous  │──▶ execute immediately
                 │  Risk Set?   │
                 │  {READ,DRAFT}│
                 └──────────────┘
                        │ no
                        ▼
                 ┌──────────────┐
                 │  Approval    │──▶ pause, notify human
                 │  Required    │     wait for approve/deny
                 └──────────────┘
```

Here is the core of the broker, simplified from the Praxis implementation:

```python
from enum import Enum
from dataclasses import dataclass

class RiskClass(Enum):
    READ = "read"
    DRAFT = "draft"
    SEND = "send"
    DESTRUCTIVE = "destructive"

@dataclass
class GovernancePolicy:
    """Which risk classes the agent may execute without human approval."""
    autonomous_risks: set = None

    def __post_init__(self):
        if self.autonomous_risks is None:
            # Fail-closed default: only READ and DRAFT are autonomous.
            # SEND and DESTRUCTIVE always require approval.
            self.autonomous_risks = {RiskClass.READ, RiskClass.DRAFT}

    def is_autonomous(self, risk: RiskClass) -> bool:
        return risk in self.autonomous_risks

class GovernanceBroker:
    """Enforces risk-class policy between planner and executor."""

    def __init__(self, policy: GovernancePolicy, registry: ToolRegistry):
        self.policy = policy
        self.registry = registry

    def authorize(self, tool_name: str) -> Authorization:
        tool = self.registry.get(tool_name)
        if tool is None:
            return Authorization.deny(f"Unknown tool: {tool_name}")

        if self.policy.is_autonomous(tool.risk_class):
            return Authorization.allow()
        else:
            return Authorization.require_approval(
                tool_name=tool_name,
                risk_class=tool.risk_class,
                reason=f"Tool {tool_name} has risk class {tool.risk_class.value}; "
                      f"requires human approval"
            )
```

The `GovernancePolicy` default is deliberately conservative. `autonomous_risks` starts at `{READ, DRAFT}`. If you want to narrow it further (e.g., a daemon that only does READ autonomously), you configure that explicitly. You never widen it to include `SEND` or `DESTRUCTIVE` without a very good reason — and if you do, you log it.

## Tool Registration with Risk Classification

Each tool declares its risk class at registration time. This is not a runtime annotation — it is a structural property of the tool definition.

```python
@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: dict          # JSON schema for LLM planning
    risk_class: RiskClass     # Structural — enforced by broker
    handler: callable

class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, ToolDefinition] = {}

    def register(self, tool: ToolDefinition):
        if tool.risk_class not in RiskClass:
            raise ValueError(f"Invalid risk class: {tool.risk_class}")
        if not tool.parameters:
            raise ValueError(f"Tool {tool.name} must declare JSON schema "
                            f"for LLM planning")
        self._tools[tool.name] = tool

    def get(self, name: str) -> ToolDefinition | None:
        return self._tools.get(name)
```

Concrete tool registrations:

```python
registry = ToolRegistry()

# READ — autonomous, no side effects
registry.register(ToolDefinition(
    name="read_file",
    description="Read a file from the sandboxed work directory",
    parameters={
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Relative path within work dir"}
        },
        "required": ["path"]
    },
    risk_class=RiskClass.READ,
    handler=read_file_handler,
))

# DRAFT — autonomous, reversible (writes to sandbox, not production)
registry.register(ToolDefinition(
    name="write_file",
    description="Write content to a file in the sandboxed work directory",
    parameters={
        "type": "object",
        "properties": {
            "path": {"type": "string"},
            "content": {"type": "string"}
        },
        "required": ["path", "content"]
    },
    risk_class=RiskClass.DRAFT,
    handler=write_file_handler,
))

# SEND — requires approval, reaches real humans
registry.register(ToolDefinition(
    name="send_email",
    description="Send an email to recipients",
    parameters={
        "type": "object",
        "properties": {
            "to": {"type": "array", "items": {"type": "string"}},
            "subject": {"type": "string"},
            "body": {"type": "string"}
        },
        "required": ["to", "subject", "body"]
    },
    risk_class=RiskClass.SEND,
    handler=send_email_handler,
))

# DESTRUCTIVE — requires approval, irreversible
registry.register(ToolDefinition(
    name="delete_file",
    description="Permanently delete a file from the work directory",
    parameters={
        "type": "object",
        "properties": {
            "path": {"type": "string"}
        },
        "required": ["path"]
    },
    risk_class=RiskClass.DESTRUCTIVE,
    handler=delete_file_handler,
))
```

The JSON schema in `parameters` is not optional. The planner needs it to construct valid tool calls, and the broker needs the tool to be well-formed before it will authorize anything. A tool without a schema is a tool that should not exist.

## The Execution Loop

Here is how the broker integrates into the agent's execution loop:

```python
class PraxisAgent:
    def __init__(self, planner, broker, registry, executor):
        self.planner = planner
        self.broker = broker
        self.registry = registry
        self.executor = executor

    def run_step(self, goal: str, context: dict) -> StepResult:
        # 1. Planner decides which tool to call
        plan = self.planner.plan(goal, context)

        if not plan.steps:
            return StepResult(status="complete", summary="No steps needed")

        results = []
        for step in plan.steps:
            # 2. Broker authorizes — this is the gate
            auth = self.broker.authorize(step.tool_name)

            if auth.is_denied:
                results.append(f"Denied: {auth.reason}")
                continue

            if auth.requires_approval:
                # 3. Pause and notify — do NOT execute
                return StepResult(
                    status="waiting_approval",
                    tool_name=step.tool_name,
                    risk_class=auth.risk_class,
                    step=step,
                    summary=f"Paused: {step.tool_name} requires approval "
                           f"(risk: {auth.risk_class.value})"
                )

            # 4. Autonomous — execute immediately
            tool = self.registry.get(step.tool_name)
            output = self.executor.run(tool, step.arguments)
            results.append(output)

        return StepResult(status="complete", results=results)
```

When the agent hits a `SEND` or `DESTRUCTIVE` tool, it returns `waiting_approval`. The caller — whether that is a CLI, a daemon, or a gateway — is responsible for surfacing the approval request to a human and feeding the decision back.

## The Approval UX

The approval surface depends on your deployment. In Praxis, there are three surfaces:

### CLI (interactive)

```
─── Approval Required ───────────────────────────
  Tool: send_email
  Risk: SEND
  To:   parent@example.com
  Subject: Your child's learning plan draft

  [y] Approve   [n] Deny   [v] View full args
─────────────────────────────────────────────────
```

The human sees the tool name, the risk class, and the key arguments before deciding. The agent does not execute until the human presses `y` or `n`.

### Daemon (persistent worker)

When running as a background daemon, the agent pauses the task and writes the pending approval to a task store. An HTTP status endpoint exposes it:

```bash
curl http://localhost:7331/tasks/pending
```

```json
{
  "task_id": "task_abc123",
  "status": "waiting_approval",
  "tool": "send_email",
  "risk_class": "send",
  "args": {"to": ["parent@example.com"], "subject": "..."},
  "summary": "Paused: send_email requires approval (risk: send)"
}
```

A human approves via API call, and the daemon's `resume()` method executes the already-approved action — it does not re-plan. This is critical: **re-planning after approval means the LLM might choose a different tool or different arguments, which defeats the purpose of the approval gate.**

### Gateway (messaging platform)

When the agent runs on Telegram, Discord, or Slack, the approval request is sent as a message to the user:

> ⏸️ **Approval needed**: The agent wants to `send_email` to `parent@example.com` with subject "Your child's learning plan draft." Reply `approve` or `deny`.

The key design principle across all three surfaces: **the approval request contains enough information for the human to make a decision without seeing the full agent conversation.** Tool name, risk class, and the key arguments. Not the entire 40-step plan that led here.

## Fail-Closed Defaults

The most important design decision in this entire architecture is the default. When in doubt, the broker denies or pauses. There is no "fail-open" path.

```python
def authorize(self, tool_name: str) -> Authorization:
    tool = self.registry.get(tool_name)

    # Unknown tool — deny, do not execute
    if tool is None:
        return Authorization.deny(f"Unknown tool: {tool_name}")

    # Known tool, autonomous risk — execute
    if self.policy.is_autonomous(tool.risk_class):
        return Authorization.allow()

    # Known tool, non-autonomous risk — pause for approval
    return Authorization.require_approval(
        tool_name=tool_name,
        risk_class=tool.risk_class,
        reason=f"Risk class {tool.risk_class.value} requires approval"
    )
```

Three branches. Two of them (unknown tool, non-autonomous risk) prevent execution. Only one branch (known tool, autonomous risk) allows execution. If the broker encounters any state it does not recognize, it falls into the deny/pause path.

This is not paranoia. It is the only sane default for a system that can send emails and delete files. "The agent seemed confident" is not a post-mortem you want to write.

## Sandboxing: The Other Half of the Story

Risk classification controls *whether* a tool runs. Sandboxing controls *where* it runs. Both are necessary.

Every filesystem tool in Praxis resolves paths inside a configurable work directory (`PRAXIS_WORK_DIR`). The path resolution rejects absolute paths and traversal attempts:

```python
import os
from pathlib import Path

class Sandbox:
    def __init__(self, work_dir: str):
        self.work_dir = Path(work_dir).resolve()

    def resolve(self, relative_path: str) -> Path:
        """Resolve a path inside the sandbox. Reject escapes."""
        # Reject absolute paths — agent must use relative paths
        if os.path.isabs(relative_path):
            raise ValueError(f"Absolute paths not allowed: {relative_path}")

        # Resolve and check containment
        target = (self.work_dir / relative_path).resolve()

        # Path traversal check — resolved path must be inside work_dir
        if not str(target).startswith(str(self.work_dir)):
            raise ValueError(f"Path escapes sandbox: {relative_path}")

        return target
```

The traversal check uses the **resolved** path, not a string prefix check. This catches `../../etc/passwd` and more creative attempts. The check is on the resolved filesystem path, which means symlinks are followed and compared against the sandbox boundary.

This matters because a `DRAFT`-class `write_file` tool runs autonomously. If the sandbox is leaky, the agent can write to `/etc/cron.d/` without approval — which makes the risk classification meaningless. Sandboxing and risk classification are complementary: sandboxing makes autonomous DRAFT safe; risk classification makes SEND and DESTRUCTIVE safe.

## Testing the Gate

A governance broker that is not tested is a governance broker that will fail at the worst possible moment. The test suite needs to exercise every branch:

```python
import pytest
from unittest.mock import Mock

class TestGovernanceBroker:

    @pytest.fixture
    def registry(self):
        reg = ToolRegistry()
        reg.register(ToolDefinition(
            name="read_file",
            description="Read",
            parameters={"type": "object", "properties": {}},
            risk_class=RiskClass.READ,
            handler=Mock(),
        ))
        reg.register(ToolDefinition(
            name="send_email",
            description="Send",
            parameters={"type": "object", "properties": {}},
            risk_class=RiskClass.SEND,
            handler=Mock(),
        ))
        return reg

    def test_read_autonomous(self, registry):
        """READ tools execute without approval."""
        broker = GovernanceBroker(GovernancePolicy(), registry)
        auth = broker.authorize("read_file")
        assert auth.is_allowed
        assert not auth.requires_approval

    def test_send_requires_approval(self, registry):
        """SEND tools pause for approval."""
        broker = GovernanceBroker(GovernancePolicy(), registry)
        auth = broker.authorize("send_email")
        assert auth.requires_approval
        assert auth.risk_class == RiskClass.SEND

    def test_unknown_tool_denied(self, registry):
        """Unknown tools are denied, not executed."""
        broker = GovernanceBroker(GovernancePolicy(), registry)
        auth = broker.authorize("nuclear_launch")
        assert auth.is_denied
        assert "Unknown tool" in auth.reason

    def test_destructive_never_autonomous(self, registry):
        """Even with a permissive policy, DESTRUCTIVE requires approval."""
        # This test documents the invariant: you cannot make
        # DESTRUCTIVE autonomous through policy configuration alone.
        permissive = GovernancePolicy(
            autonomous_risks={RiskClass.READ, RiskClass.DRAFT, RiskClass.SEND}
        )
        registry.register(ToolDefinition(
            name="delete_file",
            description="Delete",
            parameters={"type": "object", "properties": {}},
            risk_class=RiskClass.DESTRUCTIVE,
            handler=Mock(),
        ))
        broker = GovernanceBroker(permissive, registry)
        auth = broker.authorize("delete_file")
        assert auth.requires_approval

    def test_sandbox_rejects_traversal(self):
        """Path traversal is blocked at the sandbox level."""
        sandbox = Sandbox("/tmp/praxis-work")
        with pytest.raises(ValueError, match="escapes sandbox"):
            sandbox.resolve("../../../etc/passwd")

    def test_sandbox_rejects_absolute(self):
        """Absolute paths are rejected."""
        sandbox = Sandbox("/tmp/praxis-work")
        with pytest.raises(ValueError, match="Absolute paths"):
            sandbox.resolve("/etc/passwd")
```

The `test_destructive_never_autonomous` test is the one I care about most. It documents an invariant: even if someone configures a permissive policy that makes `SEND` autonomous, `DESTRUCTIVE` still requires approval. If that test ever fails, the system has a structural hole.

## The Pitfall I Hit in Production

When I first built this, I made a mistake that broke every draft-writing test in the suite. I narrowed `autonomous_risks` from `{READ, DRAFT}` to `{READ}` — thinking that drafts should also require approval. Every test that expected the agent to autonomously write a draft file failed with `waiting_approval`.

The lesson: **DRAFT autonomy is the entire point of the classification.** If drafts require approval, the agent cannot produce work without a human in the loop for every step. That defeats the purpose of an autonomous agent. The correct split is:

- **Autonomous**: anything that produces reviewable output (READ, DRAFT)
- **Approval-gated**: anything that reaches the world or destroys data (SEND, DESTRUCTIVE)

The agent drafts autonomously. The human reviews the draft. The human approves the send. This is the loop. If you break DRAFT autonomy, you have built a very expensive chatbot, not an agent.

## When to Widen Autonomous Risks

There is one legitimate case for widening `autonomous_risks` to include `SEND`: when the agent is running in a fully trusted environment where every "send" is actually a draft in a review queue. For example, an agent that posts to an internal review board where a human must approve before anything reaches a customer.

In that case, the "send" is really a "draft to the review board." The risk class is technically `SEND` but the blast radius is zero because the review board is a buffer, not a destination.

I have not yet found a legitimate case for making `DESTRUCTIVE` autonomous. If you think you have one, I recommend sleeping on it.

## The Planner's Role

The governance broker is a safety layer, not a planning layer. The planner decides *what* to do. The broker decides *whether it can proceed without asking.*

This separation matters because it means the broker works regardless of how the planner is implemented. Praxis supports three planner modes:

1. **Heuristic** — deterministic rules, no LLM, used for tests and fallback
2. **LLM-driven** — the model constructs a plan from the tool schemas
3. **Hybrid** — LLM plans, heuristic validates and can override

In all three modes, the broker behaves identically. A heuristic planner that decides to call `send_email` hits the same approval gate as an LLM planner that makes the same decision. The safety does not depend on the planner being smart. It depends on the broker being structural.

This is why the broker checks happen *after* planning, not during. The planner is allowed to propose any tool call. The broker is what prevents the dangerous ones from running without consent.

## The Daemon Resume Pattern

When the agent runs as a persistent daemon, the approval flow has a subtlety that took me two debugging sessions to get right: **resume must execute the approved action, not re-plan.**

```python
class Daemon:
    def resume(self, task_id: str, approved: bool):
        task = self.task_manager.get(task_id)

        if not approved:
            task.state = TaskState.denied
            return

        # CRITICAL: execute the EXACT action that was approved.
        # Do NOT re-plan. Do NOT ask the planner for a new step.
        # The human approved THIS tool call with THESE arguments.
        if task.state == TaskState.waiting_approval:
            tool = self.registry.get(task.pending_tool_name)
            result = self.executor.run(tool, task.pending_args)
            task.state = TaskState.complete
            task.result = result
```

If `resume()` re-plans, the LLM might produce a different plan. The human approved `send_email` to `parent@example.com`, but the re-plan might produce `send_email` to `different@example.com` — or a completely different tool. The approval becomes meaningless because the action that runs is not the action that was approved.

The fix is to store the pending tool name and arguments in the task when the broker pauses, and execute exactly those on resume. No re-planning. No LLM in the resume path.

## Why This Matters

I have shipped this pattern through four compliance verticals — medical, education, school-system, and homeschool. Each one has agents that draft content for real humans: clinical attestation narratives, individualized education plans, learning plan drafts, transcript narratives.

In every case, the pattern is the same:

1. The agent researches and drafts autonomously (READ + DRAFT)
2. A human reviews the draft
3. The human approves the send (SEND gate)
4. Nothing is ever deleted without explicit approval (DESTRUCTIVE gate)

The risk-class classification is what makes this trustworthy enough to deploy. Not the LLM's judgment. Not a system prompt that says "be careful." A structural enforcement point in the execution loop that the LLM cannot bypass.

If you are building an autonomous agent with real-world side effects, build this layer. It is not optional infrastructure. It is the difference between a tool that produces work and a tool that produces liability.

---

*The full implementation lives in [smfworks/smf-praxis](https://github.com/smfworks/smf-praxis) under the MIT license. The governance broker, tool registry, sandbox, and daemon are all open source. If you are building agent infrastructure and want to compare patterns, the code is there.*