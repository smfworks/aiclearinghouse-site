---
slug: "2026-07-14-agent-tool-governance-risk-classes-approval-gates"
title: "Agent Tool Governance: Risk Classes, Approval Gates, and the Boundary Between Autonomous and Dangerous"
excerpt: "Every agent tool has a blast radius. A four-class risk taxonomy — READ, DRAFT, SEND, DESTRUCTIVE — and a governance broker that enforces approval gates is the difference between an agent that ships and one that burns your infrastructure down."
date: "2026-07-14"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Agents", "Engineering Architecture", "Hermes AI", "Agent Governance", "Open Source"]
tags: ["agent governance", "tool risk classification", "approval gates", "autonomous agents", "LLM agents", "safety engineering"]
readTime: 14
image: "/images/blog/2026-07-14-agent-tool-governance-risk-classes-approval-gates-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-14-agent-tool-governance-risk-classes-approval-gates"
---

Every AI agent framework that connects to real systems — filesystems, APIs, email, cloud resources — has the same structural problem: **how do you let the agent do useful work without giving it the power to destroy something you can't undo?**

Most frameworks punt on this. They give the agent a flat list of tools, all with the same privilege level, and hope the prompt is good enough. That works for demos. It does not work when the agent is running unattended at 3 AM, the LLM hallucinates a path, and your tool has no concept of "this action is irreversible."

I've been building and operating agent systems at SMF Works for months — Hermes, Praxis, Swarm — and the pattern that actually works is a **risk-class taxonomy** combined with a **governance broker** that sits between the agent's plan and the tool's execution. This post is the full architecture: the four risk classes, the broker design, the approval gate protocol, and the failure modes that will bite you if you skip any of it.

## The Core Insight: Blast Radius Is the Unit of Risk

An agent's tool is not just a function. It's a **capability with a blast radius** — the set of things that change in the real world when it runs, and how reversible those changes are.

| Tool | What It Does | Blast Radius | Reversible? |
|------|-------------|-------------|-------------|
| `read_file` | Reads a file from disk | Zero — nothing changes | N/A |
| `write_file` | Creates/overwrites a file | One file changes | Maybe (git) |
| `send_email` | Sends an email to a real person | External party receives it | No |
| `delete_file` | Deletes a file | File is gone | No (unless backed up) |
| `shell_exec("rm -rf /")` | Recursive delete | Everything | Absolutely not |

If your tool system treats all of these the same way, you have a safety problem. The risk-class taxonomy makes the blast radius **first-class in the type system**, not a comment in a README.

## The Four Risk Classes

I use a four-class taxonomy. It's not arbitrary — each class maps to a distinct operational posture:

```
READ         → Autonomous, no approval needed
DRAFT        → Autonomous, no approval needed (but logged)
SEND         → Approval gate (human must approve before execution)
DESTRUCTIVE  → Approval gate (human must approve, double-confirm for irreversible)
```

### Class 1: READ

Tools that observe state without modifying it. These are always safe to run autonomously.

```python
class ReadFileTool(Tool):
    name = "read_file"
    risk_class = RiskClass.READ
    parameters = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Path to read (relative to work dir)"}
        },
        "required": ["path"]
    }
    
    def run(self, path: str, **kwargs) -> str:
        safe_path = self._resolve_safely(path)
        if not safe_path.exists():
            return json.dumps({"error": "File not found", "path": path})
        return json.dumps({"content": safe_path.read_text()})
```

**Examples:** `read_file`, `list_dir`, `fetch_url`, `search_files`, `get_status`

**Why autonomous:** Reading is side-effect-free. The agent can explore, research, and gather context without risk. This is where 70% of agent work happens — reading code, fetching docs, listing directories. Gating reads behind approval would make the agent unusably slow.

### Class 2: DRAFT

Tools that create or modify state **locally and reversibly**. The changes haven't left the system yet.

```python
class WriteFileTool(Tool):
    name = "write_file"
    risk_class = RiskClass.DRAFT
    parameters = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Path to write (relative to work dir)"},
            "content": {"type": "string", "description": "File content"}
        },
        "required": ["path", "content"]
    }
    
    def run(self, path: str, content: str, **kwargs) -> str:
        safe_path = self._resolve_safely(path)
        safe_path.parent.mkdir(parents=True, exist_ok=True)
        safe_path.write_text(content)
        return json.dumps({"success": True, "path": str(safe_path), "bytes": len(content)})
```

**Examples:** `write_file`, `create_draft`, `create_branch`, `stage_changes`

**Why autonomous:** Drafts are local and version-controlled. If the agent writes garbage, you `git checkout` and it's gone. The key insight is that **drafting is not committing** — the work product exists but hasn't been pushed, sent, or deployed. Gating drafts would make the agent unable to iterate, which is its core value proposition.

The critical boundary: a DRAFT tool must **never have external side effects**. Writing a file to disk is DRAFT. Pushing to GitHub is SEND. Sending an email draft to the outbox is DRAFT. Actually sending it is SEND.

### Class 3: SEND

Tools that produce **irreversible external side effects**. Once executed, the action has left the system and cannot be taken back.

```python
class SendEmailTool(Tool):
    name = "send_email"
    risk_class = RiskClass.SEND
    parameters = {
        "type": "object",
        "properties": {
            "to": {"type": "array", "items": {"type": "string"}, "description": "Recipient addresses"},
            "subject": {"type": "string"},
            "body": {"type": "string"}
        },
        "required": ["to", "subject", "body"]
    }
    
    def run(self, to: list, subject: str, body: str, **kwargs) -> str:
        # This should never be reached without broker approval
        # The broker intercepts before run() is called
        result = self._smtp_client.send(to, subject, body)
        return json.dumps({"success": True, "message_id": result.id})
```

**Examples:** `send_email`, `post_message`, `git_push`, `deploy_to_prod`, `call_external_api`

**Why gated:** You can't unsend an email. You can't un-push a commit to a public repo. You can't un-deploy a broken version. The agent can *plan* the send — it can draft the email, compose the commit message, prepare the deployment — but the actual execution requires a human to say "yes, do this."

### Class 4: DESTRUCTIVE

Tools that **destroy state** — and the destruction is permanent.

```python
class DeleteFileTool(Tool):
    name = "delete_file"
    risk_class = RiskClass.DESTRUCTIVE
    parameters = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Path to delete (relative to work dir)"},
            "force": {"type": "boolean", "description": "Bypass safety checks", "default": False}
        },
        "required": ["path"]
    }
```

**Examples:** `delete_file`, `drop_database`, `delete_branch`, `rm_recursive`, `destroy_resource`

**Why gated (and worse):** DESTRUCTIVE is worse than SEND because SEND at least *creates* something in the world (an email exists, a commit exists). DESTRUCTIVE removes something that existed. If the agent deletes the wrong file, there may be no recovery path at all — especially if the deletion also removes the backup.

DESTRUCTIVE tools should require **double confirmation** and, where possible, a **grace period** (move to trash, not hard delete). If you're building a DESTRUCTIVE tool and it doesn't have a soft-delete fallback, ask yourself why.

## The Governance Broker

The risk classes are just labels until something enforces them. That something is the **governance broker** — a middleware layer that sits between the agent's plan and the tool's execution.

```
Agent Plan: "I want to run send_email(to=client, subject='Q3 Report', body=...)"
         │
         ▼
   ┌─────────────────────┐
   │  Governance Broker  │
   │                     │
   │  1. Look up tool    │
   │  2. Check risk class│
   │  3. Evaluate policy │
   │  4. Return decision │
   └─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
 ALLOW    APPROVE_REQUIRED
 (run it)  (pause, ask human)
              │
              ▼
         Human approves
              │
              ▼
          (run it)
```

### Broker Implementation

```python
from enum import Enum
from dataclasses import dataclass
from typing import Set, Optional

class RiskClass(Enum):
    READ = "read"
    DRAFT = "draft"
    SEND = "send"
    DESTRUCTIVE = "destructive"

@dataclass
class GovernancePolicy:
    """Defines which risk classes can run autonomously."""
    autonomous_risks: Set[RiskClass]
    require_double_confirm: Set[RiskClass]
    
    @classmethod
    def default(cls) -> "GovernancePolicy":
        return cls(
            autonomous_risks={RiskClass.READ, RiskClass.DRAFT},
            require_double_confirm={RiskClass.DESTRUCTIVE}
        )

@dataclass
class BrokerDecision:
    allowed: bool
    needs_approval: bool
    reason: str
    risk_class: RiskClass

class GovernanceBroker:
    def __init__(self, policy: GovernancePolicy, approval_callback=None):
        self.policy = policy
        self.approval_callback = approval_callback  # Called for SEND/DESTRUCTIVE
    
    def evaluate(self, tool: "Tool", args: dict) -> BrokerDecision:
        risk = tool.risk_class
        
        if risk in self.policy.autonomous_risks:
            return BrokerDecision(
                allowed=True,
                needs_approval=False,
                reason=f"Risk class {risk.value} is autonomous",
                risk_class=risk
            )
        
        # SEND and DESTRUCTIVE need approval
        if self.approval_callback:
            approved = self.approval_callback(tool, args)
            return BrokerDecision(
                allowed=approved,
                needs_approval=not approved,
                reason=f"Risk class {risk.value} requires approval",
                risk_class=risk
            )
        
        # No callback configured — deny by default
        return BrokerDecision(
            allowed=False,
            needs_approval=True,
            reason=f"Risk class {risk.value} requires approval but no callback is configured",
            risk_class=risk
        )
```

### The Critical Default

Notice the default policy:

```python
autonomous_risks={RiskClass.READ, RiskClass.DRAFT}
```

This is the most important line in the entire system. It says: **the agent can read and draft freely, but it cannot send or destroy without approval.** This is the boundary between "useful autonomous agent" and "dangerous autonomous agent."

If you narrow this to `{RiskClass.READ}` — only reads are autonomous — then every file write pauses for approval. The agent becomes unusable for any real work. I've seen this mistake: someone reads a security best practice about "principle of least privilege," applies it to agent tools, and makes every DRAFT tool require approval. The agent grinds to a halt.

If you widen this to `{RiskClass.READ, RiskClass.DRAFT, RiskClass.SEND}` — now the agent can send emails and push commits without asking. This is fine for a trusted CI/CD pipeline. It is **not fine** for an agent running on a workstation with access to production systems.

The default `{READ, DRAFT}` is the sweet spot: the agent can work autonomously on local artifacts, but anything that reaches the outside world requires a human.

## The Approval Gate Protocol

When the broker returns `needs_approval=True`, the agent doesn't crash. It **pauses**. The execution loop shifts from "run the plan" to "wait for human input."

### State Machine

```
                  ┌──────────┐
                  │ PLANNING  │
                  └────┬─────┘
                       │ agent produces a plan
                       ▼
                  ┌──────────┐
                  │ EXECUTING │◄─────────────────┐
                  └────┬─────┘                   │
                       │ broker evaluates each  │
                       │ action                 │
              ┌────────┴────────┐               │
              ▼                 ▼               │
         ALLOW            NEEDS_APPROVAL        │
              │                 │               │
              ▼          ┌──────┴──────┐        │
         (run tool)     │             │        │
              │     APPROVED       DENIED      │
              │         │             │        │
              │         ▼             ▼        │
              │    (run tool)    (skip/replan)──┘
              │         │
              ▼         ▼
         ┌──────────────┐
         │  COMPLETE     │
         └──────────────┘
```

### Implementation: The Daemon Pattern

For long-running agents, the approval gate needs to be **durable** — the agent can pause, wait for a human (who might be asleep), and resume when approval arrives. This requires a persistent state store, not just an in-memory flag.

```python
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import json

class TaskState(Enum):
    PLANNING = "planning"
    EXECUTING = "executing"
    WAITING_APPROVAL = "waiting_approval"
    APPROVED = "approved"
    DENIED = "denied"
    COMPLETE = "complete"
    FAILED = "failed"

@dataclass
class PendingAction:
    tool_name: str
    args: dict
    risk_class: str
    requested_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    
    def to_dict(self) -> dict:
        return {
            "tool": self.tool_name,
            "args": self.args,
            "risk_class": self.risk_class,
            "requested_at": self.requested_at
        }

@dataclass 
class Task:
    id: str
    goal: str
    state: TaskState
    plan: list = field(default_factory=list)
    pending_action: Optional[PendingAction] = None
    result: Optional[str] = None
    
    def to_row(self) -> dict:
        return {
            "id": self.id,
            "goal": self.goal,
            "state": self.state.value,
            "plan": json.dumps(self.plan),
            "pending_action": json.dumps(self.pending_action.to_dict()) if self.pending_action else None,
            "result_json": json.dumps(self.result) if self.result else None,
        }
```

The daemon loop:

```python
class Daemon:
    def __init__(self, agent, broker, task_store):
        self.agent = agent
        self.broker = broker
        self.task_store = task_store
    
    def run_task(self, goal: str) -> str:
        task = self.task_store.create(goal=goal)
        
        while task.state not in (TaskState.COMPLETE, TaskState.FAILED, TaskState.DENIED):
            if task.state == TaskState.WAITING_APPROVAL:
                # Don't re-plan — wait for human
                time.sleep(self._poll_interval)
                task = self.task_store.get(task.id)
                continue
            
            # Execute next action from plan
            action = task.plan.pop(0)
            tool = self.agent.registry.get(action["tool"])
            
            decision = self.broker.evaluate(tool, action["args"])
            
            if decision.needs_approval:
                task.pending_action = PendingAction(
                    tool_name=tool.name,
                    args=action["args"],
                    risk_class=tool.risk_class.value
                )
                task.state = TaskState.WAITING_APPROVAL
                self.task_store.save(task)
                # Notify human: "Action requires approval: send_email to client@example.com"
                self._notify_human(task)
                continue
            
            if decision.allowed:
                result = tool.run(**action["args"])
                task.result = result
            
        return task.result
    
    def resume(self, task_id: str):
        """Called when a human approves or denies a pending action."""
        task = self.task_store.get(task_id)
        
        if task.state != TaskState.WAITING_APPROVAL:
            return  # Not waiting — nothing to resume
        
        # Check if approved or denied
        approval = self._check_approval_status(task_id)
        
        if approval.approved:
            # Execute the pending action
            tool = self.agent.registry.get(task.pending_action.tool_name)
            result = tool.run(**task.pending_action.args)
            task.result = result
            task.pending_action = None
            task.state = TaskState.EXECUTING
        else:
            task.state = TaskState.DENIED
        
        self.task_store.save(task)
```

The key insight in the daemon: **`resume()` executes the already-approved action, it does not re-plan.** If the daemon re-plans on resume, the LLM might produce a different plan, and the approved action never runs. The approved action is stored in `pending_action` and executed directly.

## Sandboxing: The Other Half of Governance

Risk classes control *what* the agent can do. Sandboxing controls *where* it can do it. You need both.

Every filesystem tool must resolve paths relative to a **configurable work directory** — never the agent's CWD, never the user's home directory.

```python
import os
from pathlib import Path
from typing import Optional

class PathSafetyError(Exception):
    """Raised when a path escapes the sandbox."""

class Tool:
    work_dir: Path  # Set at initialization, e.g. from PRAXIS_WORK_DIR env var
    
    def _resolve_safely(self, path: str) -> Path:
        """Resolve a path relative to work_dir, rejecting traversal and absolute paths."""
        if os.path.isabs(path):
            raise PathSafetyError(f"Absolute paths are not allowed: {path}")
        
        # Resolve relative to work_dir
        resolved = (self.work_dir / path).resolve()
        
        # Verify the resolved path is still inside work_dir
        try:
            resolved.relative_to(self.work_dir.resolve())
        except ValueError:
            raise PathSafetyError(
                f"Path traversal detected: {path} resolves to {resolved}, "
                f"which is outside {self.work_dir}"
            )
        
        return resolved
```

### What This Catches

| Attack | Naive Path | Sandboxed Path |
|--------|-----------|----------------|
| Absolute path | `path="/etc/passwd"` → reads it | `PathSafetyError: Absolute paths not allowed` |
| Traversal | `path="../../../etc/passwd"` → reads it | `PathSafetyError: Path traversal detected` |
| Symlink escape | `path="symlink_to_etc"` → follows it | `PathSafetyError: resolves outside work_dir` |
| Null byte | `path="file\x00/etc/passwd"` → may truncate | `PathSafetyError` (resolve() handles this) |

The traversal check must be on the **resolved** path, not a string prefix check. `../../../etc` starts with `..` but `./a/../../etc` doesn't — string matching misses it. `Path.resolve()` normalizes the path and follows symlinks, so `resolved.relative_to(work_dir)` catches both.

## JSON Schemas: Making Tools LLM-Plannable

A risk class tells the broker what to gate. A JSON schema tells the LLM what the tool expects. Both are required — a tool without a schema is invisible to the planner.

```python
class Tool:
    name: str
    risk_class: RiskClass
    parameters: dict  # JSON Schema object
    
    def run(self, **kwargs) -> str:
        raise NotImplementedError
```

Every tool must declare its `parameters` as a JSON Schema object. This is what the LLM planner uses to decide which tool to call and what arguments to provide.

```python
# Good — schema present, LLM can plan with it
class FetchUrlTool(Tool):
    name = "fetch_url"
    risk_class = RiskClass.READ
    parameters = {
        "type": "object",
        "properties": {
            "url": {"type": "string", "format": "uri", "description": "URL to fetch"},
            "method": {"type": "string", "enum": ["GET", "POST"], "default": "GET"}
        },
        "required": ["url"]
    }

# Bad — no schema, LLM has to guess
class MysteryTool(Tool):
    name = "do_thing"
    risk_class = RiskClass.SEND
    # No parameters field — the planner can't reason about this
```

If a tool has no schema, the LLM planner will either skip it (bad — the tool is invisible) or hallucinate arguments (worse — the tool runs with garbage input). **No schema = no tool.** Enforce this at registration time:

```python
class ToolRegistry:
    def register(self, tool: Tool):
        if not hasattr(tool, 'parameters') or not tool.parameters:
            raise ValueError(f"Tool {tool.name} has no JSON schema — refusing to register")
        if not hasattr(tool, 'risk_class'):
            raise ValueError(f"Tool {tool.name} has no risk class — refusing to register")
        self._tools[tool.name] = tool
```

## The Full Architecture

Putting it all together:

```
┌──────────────────────────────────────────────────────┐
│                    Agent Loop                         │
│                                                      │
│  1. LLM produces a plan (list of tool calls)        │
│  2. For each action in plan:                        │
│     a. Look up tool in registry                    │
│     b. Broker evaluates risk class                  │
│     c. If autonomous (READ/DRAFT) → execute now    │
│     d. If gated (SEND/DESTRUCTIVE) → pause + ask   │
│  3. If paused, daemon stores pending action        │
│  4. Human approves/denies via notification         │
│  5. On approval, daemon executes pending action    │
│  6. Continue plan or report completion             │
│                                                      │
└────────────────┬─────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
┌──────────┐          ┌──────────────┐
│ Registry │          │    Broker    │
│          │          │              │
│ Tools    │          │ Policy:      │
│ + schema │          │ autonomous:  │
│ + risk   │          │  {READ,      │
│          │          │   DRAFT}     │
│          │          │ gated:       │
│          │          │  {SEND,      │
│          │          │   DESTRUCT}  │
└──────────┘          └──────────────┘
```

## Failure Modes I've Actually Hit

### 1. The `autonomous_risks` Narrowing Bug

I changed the default policy from `{READ, DRAFT}` to `{READ}` thinking it was "more secure." Every test that expected the agent to write a file failed with `waiting_approval`. The agent couldn't draft anything without asking permission.

**Fix:** Keep the default at `{READ, DRAFT}`. If you need a stricter policy for a specific deployment (e.g., production CI), configure it explicitly, don't change the default.

### 2. The Re-Plan on Resume Bug

When a human approved a pending SEND action, the daemon called `agent.handle(goal)` again — which re-planned from scratch. The LLM produced a *different* plan, and the approved action was never executed. The agent sat in an infinite loop of planning, asking for approval, re-planning, asking again.

**Fix:** `resume()` must execute the stored `pending_action` directly, not re-plan. The approved action is already decided — just run it.

### 3. The `tool.run()` Signature Mismatch

The perception layer called `tool.run(query=goal, name=goal)`. The tool's `run` method didn't accept `query` or `name` kwargs. Execution failed with a `TypeError`.

**Fix:** Every tool's `run` method should accept `**kwargs`:

```python
def run(self, path: str, content: str, **kwargs) -> str:
    # kwargs absorbs unexpected parameters from the caller
    ...
```

### 4. The Path Traversal That String Matching Missed

I checked `if "../" in path: raise` — which caught `../etc` but missed `./a/../../etc`. The `..` wasn't at the start, so the string check passed, and the tool read a file outside the work directory.

**Fix:** Always resolve the path first, then check if it's inside the work directory:

```python
resolved = (work_dir / path).resolve()
resolved.relative_to(work_dir.resolve())  # Raises ValueError if outside
```

### 5. The Mock LLM That Returned an Empty Plan

In tests, the mock LLM planner returned an empty plan. The daemon had zero actions to execute, so it reported "complete" immediately — with no work done. Tests passed because the state machine was correct, but the test wasn't actually testing anything.

**Fix:** Inject a test-only planner subclass that returns a deterministic plan, rather than relying on the mock LLM to produce something sensible:

```python
class _EchoSendPlanner(Planner):
    """Test-only planner that always plans a single send_email action."""
    def plan(self, goal: str, tools: list) -> list:
        return [{"tool": "send_email", "args": {"to": ["test@example.com"], "subject": "test", "body": goal}}]
```

## Decision Tree: Should This Tool Be Autonomous?

```
Does the tool modify external state?
├── No (read-only, no side effects)
│   └── READ — autonomous
└── Yes
    ├── Is the change local and reversible (git, trash, undo)?
    │   └── DRAFT — autonomous
    └── Is the change external or irreversible?
        ├── Does it create something (send email, push commit, deploy)?
        │   └── SEND — approval gate
        └── Does it destroy something (delete file, drop table, rm)?
            └── DESTRUCTIVE — approval gate + double-confirm
```

## The MCP Integration Question

If you're exposing your agent's tools via MCP (Model Context Protocol), the risk class needs to map to MCP's `ToolAnnotations`:

```python
def risk_to_mcp_annotations(risk: RiskClass) -> dict:
    mapping = {
        RiskClass.READ:        {"readOnlyHint": True},
        RiskClass.DRAFT:       {"readOnlyHint": False, "destructiveHint": False},
        RiskClass.SEND:        {"readOnlyHint": False, "destructiveHint": False},
        RiskClass.DESTRUCTIVE: {"readOnlyHint": False, "destructiveHint": True},
    }
    return mapping.get(risk, {})
```

The MCP client should respect these annotations — but don't trust them blindly. The **broker is the enforcement layer**, not the annotation. Annotations are advisory; the broker is mandatory. If an external MCP server claims a tool is `readOnlyHint: True` but the tool actually deletes files, your broker should still classify it based on your own analysis, not the server's claim.

## What This Buys You

| Without Governance | With Governance |
|---------------------|-----------------|
| Agent sends 200 emails at 3 AM | Agent drafts 200 emails, waits for approval |
| Agent deletes the wrong directory | Agent asks before deleting anything |
| Agent pushes broken code to prod | Agent creates a PR (DRAFT), human merges (SEND) |
| You can't trust the agent unattended | You can leave the agent running overnight |
| Every tool is equally dangerous | Risk is proportional to blast radius |
| Failures are catastrophic | Failures are contained and reversible |

## The Bottom Line

Agent tool governance is not a feature you add later. It's the architecture. If you build the agent first and bolt on governance, you'll end up with a flat tool list and a `--yolo` flag — which is what most frameworks ship with. That's fine for a demo. It's not fine for production.

The four-class taxonomy (READ, DRAFT, SEND, DESTRUCTIVE) plus a governance broker with a sensible default policy (`autonomous = {READ, DRAFT}`) is the minimum viable safety architecture for any agent that touches real systems. Everything else — sandboxing, JSON schemas, durable approval state, MCP annotation mapping — builds on top of this foundation.

The boundary between autonomous and gated is the whole game. Get it right, and your agent can work unattended for hours. Get it wrong, and you're one hallucinated path away from a 3 AM incident.

---

*This architecture is implemented in [smf-praxis](https://github.com/smfworks/smf-praxis) and operational across SMF Works agent deployments. The governance broker has been gating SEND and DESTRUCTIVE actions in production since June 2026.*