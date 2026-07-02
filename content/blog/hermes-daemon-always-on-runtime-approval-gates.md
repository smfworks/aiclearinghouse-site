---
slug: "hermes-daemon-always-on-runtime-approval-gates"
title: "From One-Shot to Always-On: Building a Hermes Daemon with Approval-Gated Autonomy"
excerpt: "How to move a Hermes agent from a single `handle()` invocation to a persistent daemon that runs READ/DRAFT work autonomously, pauses on SEND/DESTRUCTIVE actions for human approval, and exposes task state over HTTP."
date: "2026-07-02"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Agent Architecture", "Engineering", "Local LLMs", "Linux"]
tags: ["hermes-agent", "daemon", "agent-runtime", "approval-gates", "autonomy"]
readTime: 15
image: "/images/blog/hermes-daemon-always-on-runtime-approval-gates-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-daemon-always-on-runtime-approval-gates"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

Most agent demos are one-shot: you type a goal, the agent executes a plan, and then it exits. That is fine for a benchmark or a prototype, but it is not how agents survive in production. Production agents run while you are asleep. They wake up from a queue, execute the safe steps, pause when the work is irreversible, and let a human sign off before it goes out the door.

At SMF Works we are extending `smf-praxis` — a Hermes-style agent framework — from a one-shot `handle()` call to a persistent daemon/runtime worker with an HTTP status server and explicit approval gating. This post is the architecture we are building, the code shape we settled on, the pitfalls we already hit, and how you can apply the same pattern to any agent system that needs to move from reactive to ambient.

---

## 1. Why a Daemon, and Why Now

A one-shot agent has a simple lifecycle:

```
user goal → planner → tool calls → final report
```

That model breaks down as soon as the agent starts doing real work. A goal like *"audit every repository in the smfworks org, open issues for outdated dependencies, and delete archived repos"* contains three very different kinds of actions:

- `READ`: listing repos, reading `pyproject.toml`, checking release dates.
- `DRAFT`: opening draft issues with proposed changes.
- `SEND`/`DESTRUCTIVE`: posting public issues and deleting repositories.

If you run the whole thing as a single `handle()` call, you have two bad choices:

1. **Fully autonomous**: the agent deletes repositories without asking. This is not a feature; it is a liability.
2. **Fully supervised**: the agent stops and asks for approval on every single step, including safe reads. This is not autonomy; it is a chatbot with extra latency.

The right model splits the work into lanes. Safe work runs unsupervised. Irreversible work pauses and waits. The agent persists state so it can resume after a crash, an SSH disconnect, or an overnight shutdown.

That is what a daemon gives you: **state persistence, asynchronous approval, and graceful degradation across sessions.**

---

## 2. The Runtime Model

We keep four pieces of state at the center of the runtime:

| Component | Responsibility | Storage |
|---|---|---|
| `TaskManager` | Owns the task queue, priority, lifecycle | SQLite + `TaskState` dataclass |
| `Daemon` | Runs the main loop, recovers orphans, starts HTTP server | In-memory + config |
| `Planner` | Produces the ordered list of `Action`s for a goal | LLM-driven with deterministic fallback |
| `GovernancePolicy` / `Broker` | Decides whether an action can run autonomously | `autonomous_risks: set[RiskClass]` |

The task state machine is small and explicit:

```
queued → planning → in_progress → waiting_approval
                          ↓
                    completed / failed
```

When a task reaches `waiting_approval`, the daemon stops executing and exposes the pending action over HTTP. A human or another system `POST /approve/{id}`, and `Daemon.resume()` executes the already-approved broker action without re-planning.

This last point is important. A naive implementation calls the planner again on resume. If the planner is LLM-driven, it may produce a *different* plan, or worse, decide the goal has changed and create new unapproved actions. `resume()` must run the stored action, not re-plan.

---

## 3. Risk Classes Are the Policy Boundary

We already use a `RiskClass` model for tools. The daemon reuses it for the autonomy boundary:

```python
from enum import Enum, auto

class RiskClass(Enum):
    READ = auto()          # inspect, fetch, summarize, list
    DRAFT = auto()         # write draft files, plans, schemas
    SEND = auto()          # publish, email, post, merge, notify
    DESTRUCTIVE = auto()   # delete, terminate, reset, mutate production
```

The default governance policy is intentionally conservative:

```python
class GovernancePolicy:
    autonomous_risks: set[RiskClass] = {RiskClass.READ, RiskClass.DRAFT}
```

`READ` and `DRAFT` run without asking. `SEND` and `DESTRUCTIVE` require approval. The policy is configurable, but the default should not be narrowed unless the caller explicitly opts in. Changing the default to `{RiskClass.READ}` silently breaks every daemon test and every CLI path that expects drafts to run autonomously.

This is the same boundary we use in our model router and our skill classification. Risk classes give us one consistent language for tools, skills, and runtime autonomy.

---

## 4. What `Daemon.resume()` Actually Does

The trickiest part of daemon design is resuming a task that is already in `waiting_approval`. Here is the shape we use:

```python
async def resume(self, task_id: str, approved: bool = True) -> TaskState:
    task = self.task_manager.get(task_id)
    if task.state != TaskState.WAITING_APPROVAL:
        raise DaemonError(f"Task {task_id} is not waiting approval")

    if not approved:
        task.state = TaskState.FAILED
        task.result = ApprovalResult(approved=False, reason="user denied")
        self.task_manager.save(task)
        return task

    # Execute the *stored* broker action, not a fresh plan.
    action = task.pending_action
    if action is None:
        raise DaemonError(f"Task {task_id} has no pending action")

    result = await self.broker.execute(action)
    task.state = TaskState.COMPLETED if result.ok else TaskState.FAILED
    task.result = result
    self.task_manager.save(task)
    return task
```

Key rules:

1. **Never re-plan on resume.** The pending action was approved. Run it.
2. **Serialize the pending action in `result_json` or a dedicated column.** SQLite can store JSON; use it.
3. **Mark the task failed if approval is denied.** Do not leave it stuck in `waiting_approval`.
4. **Expose the result through `TaskState.result`.** The HTTP status endpoints read from this field.

If your task manager does not expose `TaskState.result` as a deserialized object, your HTTP `/tasks/{id}` endpoint will return raw JSON strings and every consumer will parse them twice.

---

## 5. The HTTP Status Surface

A daemon that nobody can observe is a daemon nobody trusts. We expose a minimal HTTP API that does not execute work — it only reports state and accepts approvals.

| Endpoint | Purpose |
|---|---|
| `GET /health` | Is the daemon alive? |
| `GET /tasks` | List tasks with optional state filter |
| `GET /tasks/{id}` | Full task details, including `pending_action` if waiting |
| `POST /tasks` | Submit a new goal (returns task ID) |
| `POST /tasks/{id}/approve` | Approve a pending `SEND`/`DESTRUCTIVE` action |
| `POST /tasks/{id}/deny` | Deny and fail the pending action |

The status server runs in a separate thread so a long-running tool call does not block the API. Do not put expensive work inside a request handler; queue it and return the task ID immediately.

Here is a minimal FastAPI-style router (the real implementation can use `http.server` or FastAPI depending on dependencies):

```python
@app.get("/tasks/{task_id}")
async def get_task(task_id: str):
    task = daemon.task_manager.get(task_id)
    return {
        "id": task.id,
        "state": task.state.value,
        "goal": task.goal,
        "result": task.result,
        "pending_action": task.pending_action.to_dict() if task.pending_action else None,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }
```

Notice that `result` is a deserialized object, not a raw JSON string. This is the difference between an API that is pleasant to consume and one that leaks storage details.

---

## 6. Orphan Recovery

A daemon crashes. A server reboots. SSH drops. The task queue survives in SQLite, but the in-memory `Daemon` state is gone. On startup, the daemon must recover orphans.

```python
def recover_orphans(self):
    for task in self.task_manager.list(state=TaskState.IN_PROGRESS):
        # If the task was running, mark it for retry.
        task.state = TaskState.QUEUED
        task.retries += 1
        if task.retries > self.max_retries:
            task.state = TaskState.FAILED
            task.result = DaemonError("max retries exceeded")
        self.task_manager.save(task)
```

Tasks in `WAITING_APPROVAL` are left alone — they are intentionally paused and a human is expected to act. Tasks in `QUEUED` or `PLANNING` can be restarted. Tasks in `IN_PROGRESS` are ambiguous; we retry once, then fail.

This is not perfect distributed systems engineering, but it is correct for a single-node daemon. If you need multi-node fault tolerance, promote the task queue to a real job system (Redis, RabbitMQ, or Postgres) and treat the daemon as a worker.

---

## 7. CLI Shape

We add one subcommand to the existing CLI:

```bash
praxis daemon start --port 8080 --work-dir ./praxis-work
```

Optional flags:

| Flag | Purpose |
|---|---|
| `--port` | HTTP status server port |
| `--host` | Bind address (default `127.0.0.1`) |
| `--work-dir` | Sandbox for filesystem tools |
| `--reset` | Clear the task queue on startup |
| `--autonomous-risks` | Override default `READ,DRAFT` (use with care) |

The daemon also supports one-shot mode for backward compatibility:

```bash
praxis handle "summarize the repo README"
```

One-shot mode skips the queue and runs synchronously, but still uses the same planner and broker. This keeps the existing test suite useful.

---

## 8. Tool Signatures and the Perception Layer

One subtle bug almost broke our first daemon tests. The perception/skills layer calls `tool.run(...)` with keyword arguments that match the tool schema. If a tool's `run` function does not accept `**kwargs`, any extra argument from the planner causes a `TypeError`.

For example, a `read_file` tool might be called as:

```python
tool.run(query="read the README", name="read_file", path="README.md")
```

The `query` and `name` arguments come from the planner's action format; they are not part of the tool's own schema. Either the tool accepts `**kwargs`, or the caller must filter arguments before invoking the tool.

We chose to make the caller tolerant: the perception layer maps the action's `parameters` dict directly to the tool schema, dropping any keys the schema does not define. This keeps tool implementations clean while letting the planner pass metadata.

---

## 9. Testing a Daemon Without Flaky LLM Planners

Daemons are hard to test because they depend on a planner that may call an LLM. We use two techniques to make tests deterministic.

### 9.1 Inject a test-only planner

```python
class _EchoSendPlanner(Planner):
    def plan(self, goal: str, **kwargs) -> list[Action]:
        return [
            Action(tool="read_file", parameters={"path": "README.md"}, risk=RiskClass.READ),
            Action(tool="send_email", parameters={"to": "team@smf.works"}, risk=RiskClass.SEND),
        ]

agent = PraxisAgent(planner=_EchoSendPlanner())
```

Passing the planner into `PraxisAgent.__init__` keeps production planner classes untouched. The daemon test asserts that the `SEND` action produces a `waiting_approval` state and that `resume()` completes it.

### 9.2 Smoke-test the planner first

Before writing the daemon test, run:

```python
report = agent.handle(goal="open a draft issue and notify the team")
print(report.summary)
```

If this produces zero actions, the planner is the problem, not the daemon.

---

## 10. A Concrete Linux Deployment

On an Ubuntu 24.04 host with Ollama running locally, the daemon can be managed as a systemd user service, similar to how we run the Hermes gateway:

```ini
# ~/.config/systemd/user/praxis-daemon.service
[Unit]
Description=SMF Praxis daemon
After=network.target ollama.service

[Service]
Type=simple
ExecStart=%h/.local/bin/praxis daemon start --port 8080 --work-dir %h/praxis-work
Restart=on-failure
RestartSec=10
Environment=PRAXIS_WORK_DIR=%h/praxis-work

[Install]
WantedBy=default.target
```

Enable and start:

```bash
systemctl --user daemon-reload
systemctl --user enable praxis-daemon
systemctl --user start praxis-daemon
systemctl --user status praxis-daemon
```

For remote access behind Tailscale, bind to `0.0.0.0` and set an API key. Never expose the status/approval API to the public internet without authentication.

---

## 11. Summary

Moving an agent from one-shot to daemon is not just about adding a loop. It is about designing a runtime that understands risk, persists state, pauses for human approval, and exposes enough observability that humans trust it.

The essential pieces are:

- A `TaskManager` with explicit states and serialized results.
- A `Daemon` that recovers orphans, runs the main loop, and serves HTTP status.
- A `GovernancePolicy` that defaults `READ`/`DRAFT` to autonomous and gates `SEND`/`DESTRUCTIVE`.
- A `resume()` path that executes the already-approved action without re-planning.
- Tool-call plumbing that tolerates planner metadata without leaking into tool signatures.
- Deterministic tests that inject a fake planner and assert state transitions.

If you are building agents that touch real systems, this is the architecture that separates a demo from a product. Autonomy is not all-or-nothing. It is a gradient, and the approval gate is the boundary that makes the rest of it safe.

---

*Liam Hermes is Chief Development Officer at SMF Works, where he builds agent infrastructure, local inference stacks, and the reusable procedures that keep them coherent.*
