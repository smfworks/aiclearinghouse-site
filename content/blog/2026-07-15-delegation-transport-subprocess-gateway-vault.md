---
slug: "2026-07-15-delegation-transport-subprocess-gateway-vault"
title: "Delegation Transport: Picking Between Subprocess, Gateway, Vault, and Cron in a Multi-Agent System"
excerpt: "Most multi-agent breakage is a transport-layer mistake, not a model mistake. A field-tested decision tree for choosing between subprocess, gateway HTTP, shared-vault, and cron delegation — with the exact timeouts, ports, and failure modes for each."
date: "2026-07-15"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Agents", "Engineering Architecture", "Hermes AI", "Linux", "Distributed Systems"]
tags: ["multi-agent", "delegation", "subprocess", "gateway", "distributed systems", "agent orchestration", "linux", "durable execution"]
readTime: 13
image: "/images/blog/2026-07-15-delegation-transport-subprocess-gateway-vault-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-15-delegation-transport-subprocess-gateway-vault"
---

Every multi-agent failure I've debugged in the last six months had the same shape. The model was fine. The tools were fine. The prompt was fine. What broke was the **transport** — the mechanism the orchestrator used to hand work to a worker agent and get a result back. The model said "I'll delegate this." The delegation never landed, or it landed and the response was lost, or it landed and blocked the parent for forty minutes while a subprocess that nobody was watching timed out.

This is the layer nobody writes about. Agent frameworks ship a `delegate_task` function and a friendly tutorial, and that's the end of the story. In production you have four genuinely different transport mechanisms — **subprocess**, **gateway HTTP**, **shared vault**, and **cron** — and they are not interchangeable. Picking the wrong one is the difference between a delegation that completes in seconds and one that hangs your orchestrator until a 300-second timeout fires and you lose the partial work.

This post is the decision tree I actually use, built from running Hermes orchestration across content publishing, repo remediation, and research pipelines. Every number in here is a number I've been bitten by.

## The Four Transports, At a Glance

| Transport | Latency | Isolation | Duration limit | State survives restart? | Best for |
|-----------|---------|-----------|----------------|--------------------------|----------|
| Subprocess (`chat -q`) | Low (in-process) | Shared process tree | **~300s hard ceiling** | No — killed with parent | < 2 min subtasks, oversight |
| Gateway HTTP | Low (network) | Separate process | Unbounded (server stays up) | Yes (server) | Real-time pair programming, long sessions |
| Shared vault | Async (poll-based) | Fully separate agent | Unbounded | **Yes (durable)** | Day-to-day work, paper trail |
| Cron | Async (scheduled) | Fully separate agent | Unbounded | Yes (rescheduled) | Recurring duties, audits |

The single most important column is **duration limit**. That's where 80% of the breakage lives.

## Transport 1: Subprocess (`chat -q`)

The simplest delegation: the orchestrator shells out to the agent CLI in a one-shot query mode and captures stdout.

```bash
terminal(command="hermes chat -q 'Research GRPO papers and write summary to ~/research/grpo.md'", timeout=300)
```

### Where it works

Synchronous oversight where you need the result *now* and the task is short. "Summarize this file," "run this test and tell me what failed," "draft a commit message for this diff." Anything that completes in under two minutes.

### Where it breaks — the 300-second trap

Here is the failure mode I see repeated in every agent-on-agent setup the first time someone tries it:

```bash
terminal(command="hermes chat -q 'Set up CI/CD for ~/myapp'", timeout=300)
```

That looks reasonable. It is not. The default 300-second timeout is nowhere near enough for a multi-step build-and-configure task. Even bumping to 600 doesn't help, because the agent won't finish, and worse — **you lose visibility into what it actually did**. The subprocess is killed mid-work. Files are half-written. Tests are half-run. There is no partial result returned to the orchestrator, no session to resume, no log of where it stopped.

The orchestrator sees a timeout. The worker saw a half-finished CI config. These two views of the world diverge silently, and the next delegation assumes the work is either done or cleanly aborted. It is neither.

### The rule

**Never use `chat -q` for any task that could plausibly take more than two minutes.** The timeout is a cliff, not a cushion. If you can't bound the task at under 120 seconds, use a different transport.

### Worktree isolation when you do use it

When the subprocess will edit code, always pass `-w` (worktree mode). Without it, two concurrent subprocess delegations editing the same repo will produce git conflicts that neither agent knows how to resolve:

```bash
# Good — isolated worktree, no conflict risk
terminal(command="hermes -w chat -q 'Refactor the auth module in ~/api'", timeout=120)

# Bad — shared working tree, race condition
terminal(command="hermes chat -q 'Refactor the auth module in ~/api'", timeout=120)
```

The `-w` flag creates a git worktree so the subprocess operates on its own checkout. The orchestrator can merge the worktree's branch back when the subprocess returns.

## Transport 2: Gateway HTTP

When the worker agent has a running gateway with an HTTP API server, the orchestrator delegates by making an HTTP request to the chat completions endpoint. This is what the Hermes Workspace Swarm view does under the hood.

```bash
curl -s http://127.0.0.1:8642/v1/chat/completions -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_SERVER_KEY" \
  -d '{"model":"default","messages":[{"role":"user","content":"Build a FastAPI auth service"}]}'
```

### Where it works

Real-time, long-running interactive sessions. Pair programming where the orchestrator and worker exchange multiple messages. Anything that needs session continuity across turns without resubmitting the whole context.

### Where it breaks — the silent port guard

This is the bug that cost me an afternoon. You set up a profile gateway for a worker agent, configure it for remote access from your phone over Tailscale, and restart. The gateway process runs. The port doesn't bind. The orchestrator's `curl` gets connection refused, but the gateway log looks like it started fine.

The cause is an explicit security guard in the API server code:

```python
if is_network_accessible(self._host) and not self._api_key:
    logger.error("Refusing to start: binding to %s requires API_SERVER_KEY...", self._host)
    return False
```

If you set `API_SERVER_HOST=0.0.0.0` (required for anything off-localhost, including Tailscale) but forget `API_SERVER_KEY`, the gateway **silently refuses to bind the port**. The process is alive. The log has one easily-missed error line. The orchestrator sees connection refused and has no idea why.

### Diagnosis checklist

```bash
# 1. Is the gateway listening at all?
ss -tlnp | grep -E '864[0-9]'

# 2. Is the API server enabled in the profile?
grep API_SERVER_ENABLED ~/.hermes/profiles/<worker>/.env

# 3. If binding to 0.0.0.0, is the key set and non-placeholder?
grep API_SERVER_KEY ~/.hermes/profiles/<worker>/.env

# 4. Does the gateway log explain it?
tail -20 ~/.hermes/profiles/<worker>/logs/gateway.log | grep -i "refusing\|api_server"
```

The fix is always the same: generate a real key and set both vars.

```bash
echo "API_SERVER_ENABLED=true" >> ~/.hermes/profiles/<worker>/.env
echo "API_SERVER_HOST=0.0.0.0" >> ~/.hermes/profiles/<worker>/.env
echo "API_SERVER_KEY=$(openssl rand -hex 32)" >> ~/.hermes/profiles/<worker>/.env
hermes --profile <worker> gateway restart
```

### The port-conflict multiplier

Every worker profile needs a **unique** `API_SERVER_PORT`. When you spawn a second worker gateway with `hermes --profile worker2 gateway run`, if you forget the unique port, you get a silent bind failure on the second one. Worse: if you use the `--replace` flag on the second gateway, it kills the first one.

```bash
# Worker 1
API_SERVER_PORT=8642

# Worker 2 — MUST differ
API_SERVER_PORT=8643
```

Check before assigning:

```bash
ss -tlnp | grep -E '864[0-9]'   # anything already bound in that range?
```

## Transport 3: Shared Vault (Async)

This is the transport that took me the longest to appreciate, and it's the one I now default to for any non-trivial delegation. Instead of the orchestrator calling the worker, **both agents read and write to a shared directory** — an Obsidian vault, a tasks directory, a shared scratch space.

```
project-vault/
├── tasks/           # orchestrator writes briefs here
│   ├── 2026-07-15-refactor-auth.md
│   └── 2026-07-15-write-benchmark-post.md
└── reports/         # worker writes results here
    └── 2026-07-15-refactor-auth-report.md
```

The orchestrator writes a task brief. The worker discovers it on its own schedule (next session, next cron tick, next manual run), does the work, writes a report. The orchestrator reads the report on its next pass.

### Where it works

Day-to-day work that doesn't need real-time oversight. Anything where you want a **paper trail**. Multi-session projects where state must survive restarts of either agent. This is the only transport where the delegation is genuinely decoupled — the orchestrator can crash, reboot, switch models, and the brief is still sitting in the vault waiting for the worker.

### Where it breaks — the polling tax

The naive implementation is a sleep loop: the worker wakes every N seconds, scans the tasks directory, picks up new briefs. This works but it's wasteful and it means latency is bounded by your poll interval. The better pattern is to pair the vault with a **cron trigger** (see Transport 4) so the worker runs on a schedule rather than polling.

The other failure mode is **orphaned briefs** — a task is written, the worker picks it up, crashes mid-work, and the brief sits in `tasks/` forever with no report in `reports/`. Every vault consumer needs an orphan-recovery pass: if a brief is older than the expected completion window and has no report, either requeue it or surface it as failed.

### The brief format that works

A task brief is not a chat message. It's a structured document the worker can execute against without clarification:

```markdown
# Task: Refactor auth module

**Repo:** ~/api
**Branch:** refactor/auth-2026-07-15
**Due:** 2026-07-16

## Context
The auth module in src/auth/ has grown to 800 lines with circular imports.

## Deliverables
- [ ] Split into auth/session.py, auth/tokens.py, auth/middleware.py
- [ ] All existing tests pass: python3 -m pytest tests/auth/
- [ ] No new dependencies
- [ ] Commit with message "refactor: split auth module"

## Constraints
- Do NOT touch src/auth/legacy.py (frozen for compliance)
- PR must be < 500 lines diff

## Report
Write your report to reports/2026-07-15-refactor-auth-report.md with:
- Files changed
- Test results (paste pytest output)
- Any deviations from the brief and why
```

Notice the **Due** field and the explicit **Report** section. The due field lets the orchestrator's orphan-recovery know when to flag the task. The report section means the worker knows exactly where to write its output, so the orchestrator doesn't have to search for it.

## Transport 4: Cron

Cron is the transport for **recurring** delegation. The orchestrator doesn't call the worker — a scheduler does, on a fixed cadence.

```bash
hermes cron create '0 9 * * 1,4' --prompt "Check for stale PRs in smfworks/* repos and post a summary to reports/"
```

### Where it works

Recurring duties that have a natural schedule: PR monitoring, dependency audits, log rotation checks, news digests, scheduled publishing. The defining property is that **the schedule is the trigger**, not an event from the orchestrator.

### Where it breaks — the silent cron

A cron job that fails silently is worse than no cron job, because you believe the work is happening. Two failure modes dominate:

1. **The job runs but the model errors** (rate limit, bad model name, expired credential). The job "completes" from the scheduler's perspective but produced nothing. Unless the job's prompt includes an explicit "if you hit an error, write the error to reports/errors/" instruction, the failure is invisible.

2. **The schedule drifts.** You set `0 9 * * *` thinking it's 9 AM your time. It's 9 AM server time. The server is UTC. The job runs at 5 AM your time, before anyone is watching, and the output lands in a report nobody reads until days later.

Always verify the schedule's actual fire time:

```bash
hermes cron list          # shows next fire time
hermes cron status        # scheduler health
```

### The idempotency requirement

A cron-triggered worker must be **idempotent**. If it runs twice in the same window (manual trigger + scheduled fire, or a retry after a transient error), it must not produce duplicate output. The simplest pattern: check for today's output file before doing work.

```python
import datetime, pathlib
today = datetime.date.today().isoformat()
out = pathlib.Path(f"reports/{today}-pr-audit.md")
if out.exists():
    print(f"Already ran for {today}, exiting.")
    sys.exit(0)
# ... do the work ...
```

## The Decision Tree

```
Is the task recurring on a fixed schedule?
├─ YES → Cron (Transport 4)
│        └─ Verify fire time, require idempotency, write errors to a report file
└─ NO
   │
   Is the task < 2 minutes and you need the result now?
   ├─ YES → Subprocess (Transport 1)
   │        └─ Use -w if it edits code, cap timeout at 120s, never 300s+
   └─ NO
      │
      Do you need real-time back-and-forth with the worker?
      ├─ YES → Gateway HTTP (Transport 2)
      │        └─ Verify port binds, unique port per profile, API_SERVER_KEY set
      └─ NO → Shared vault (Transport 3)
               └─ Structured brief, explicit report path, orphan-recovery pass
```

## The Composite Pattern: Three-Layer Delegation

In practice you don't pick one transport — you layer them. This is the pattern I use for managing subordinate Hermes agents, and it's the only setup that has survived months of operation without silent state loss.

| Layer | Transport | When |
|-------|-----------|------|
| Project Vault | Shared vault (Transport 3) | Day-to-day work, paper trail, anything durable |
| Direct spawn | Subprocess or gateway (Transport 1/2) | Real-time oversight, pair programming, < 2 min checks |
| Cron | Cron (Transport 4) | Recurring duties, scheduled audits |

The vault is the backbone. It's where briefs live, where reports land, where state persists across restarts. Subprocess and gateway are for when you need to poke a worker in real time — "what's the status of that task?", "run this one test". Cron handles anything with a natural schedule.

The critical insight: **the vault is the source of truth, not the orchestrator's in-memory state**. If the orchestrator forgets what it delegated, it reads the vault. If the worker forgets where it left off, it reads the vault. Neither agent's session memory is load-bearing for the delegation contract.

## Failure Modes I've Actually Hit

| Symptom | Root cause | Transport |
|---------|-----------|-----------|
| Orchestrator hangs 300s, then "timeout" | `chat -q` on a multi-minute task | Subprocess |
| Worker "didn't do anything" but no error | Gateway refused to bind (missing `API_SERVER_KEY`) | Gateway |
| Second worker's port won't bind | Same `API_SERVER_PORT` as first, or `--replace` killed first | Gateway |
| Brief sits in vault forever | No orphan-recovery pass; worker crashed mid-task | Vault |
| Duplicate output on consecutive runs | Cron job not idempotent; ran twice in same window | Cron |
| Two workers clobber each other's edits | No `-w` worktree isolation on subprocess code edits | Subprocess |
| Worker report exists but orchestrator ignores it | Orchestrator checks session memory, not vault | Vault (misuse) |
| Job runs at wrong hour | Schedule interpreted as server time, not local | Cron |

## The Mental Model

Stop thinking of delegation as a function call. A function call is synchronous, bounded, and returns a value. Agent delegation is **a message sent across a transport to an autonomous process that may take minutes, hours, or days, and may crash, restart, or change models before it responds.**

The transport you pick encodes your assumptions about all of that. Subprocess assumes "fast and synchronous." Gateway assumes "alive and reachable." Vault assumes "eventually, durably." Cron assumes "on a schedule, repeatedly." When your assumption is wrong, the failure is not in the model — it's in the mismatch between the transport's contract and the task's reality.

Pick the transport that matches the task's actual duration and durability requirements, not the one that's easiest to type. The two minutes you spend running the decision tree saves the forty minutes you'd spend debugging a hung orchestrator at 3 AM.

---

*This is the third post in an informal series on multi-agent reliability. The supervision-loop gap is covered in [Subagent Supervision Loops: What Hermes Hides](/blog/subagent-supervision-loop-hermes-hides), the trust contract for verification in [Fixing Subagent Delegation Verification](/blog/the-trust-contract-fixing-subagent-delegation-verification), and the capacity-planning angle in [Context Window Capacity Planning for Long-Running Agents](/blog/agent-context-budget-capacity-planning).*