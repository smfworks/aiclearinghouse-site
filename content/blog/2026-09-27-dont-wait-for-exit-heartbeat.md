---
slug: "2026-09-27-dont-wait-for-exit-heartbeat"
title: "Don't Wait for Exit: Heartbeat on Long Terminal Jobs"
excerpt: "notify=true tells you when a job ends. It does not tell you the suite failed at minute eight of forty. heartbeat=N is the mid-run signal: delta output, a sequence number, and a chance to kill or steer before the process dies on its own."
date: "2026-09-27"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Terminal Automation", "Tutorial"]
tags: ["hermes", "terminal", "heartbeat", "background-jobs", "persist_on_release", "process", "tutorial"]
readTime: 10
image: "/images/blog/liam-dont-wait-for-exit-heartbeat-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-09-27-dont-wait-for-exit-heartbeat"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-27-dont-wait-for-exit-heartbeat"
---

`notify=true` is one event, at the end. That is the right signal for a four-minute Next.js build. It is the wrong signal for a forty-minute test suite that fails at minute eight. You sit in silence for half an hour, then you get a completion dump and discover the useful line was printed thirty-two minutes ago.

I already wrote the spawn / notify / log / verify contract in [Don't Block the Loop](/blog/2026-09-01-dont-block-the-loop-background-terminal). This post is the missing middle: **heartbeat**. The parameter is on the `terminal` tool. Most sessions never set it.

## What heartbeat actually is

The schema is short. `heartbeat` is an integer, minimum 60, background-only. It implies `notify=true`. Every N seconds the runtime posts a notification carrying the output produced since the last notice.

The implementation lives in `tools/process_registry.py`. Three constants pin the shape:

- **`HEARTBEAT_MIN_SECONDS = 60`** — `arm_heartbeat` clamps anything smaller up to 60. A model cannot turn this into a 5-second poll.
- **`HEARTBEAT_OUTPUT_CHARS = 2000`** — each tick is a delta slice, not the whole log. Longer deltas keep the last 2000 characters with an omitted-count prefix.
- **`HEARTBEAT_TICK_SECONDS = 5`** — one daemon thread, named `process-heartbeat`, wakes every 5 seconds and emits for any session whose interval has elapsed. Not one timer per job.

A tick is not a completion. The payload type is `"heartbeat"`. It has `seq`, `interval`, `elapsed`, and `output`. The process is still running. If there was no new stdout, the renderer still delivers the event and fills in `(no new output since the last heartbeat)`. Silence is information: the job is alive and stuck, or alive and quiet. Either way you get a turn.

The floor exists so heartbeat cannot replace `process(action="poll")` as a busy loop. Sixty seconds is the smallest legal sample. If you need faster than that, you are polling. Don't.

## The call

A long bounded job — pytest, a merge train, `npx next build` on a cold cache — looks like this:

```text
terminal(
  command="python3 progress_job.py 12 > /tmp/progress-job.log 2>&1; printf 'EXIT:%s\\n' $? >> /tmp/progress-job.log",
  workdir="/home/you/projects/forge",
  background=true,
  notify=true,
  heartbeat=60
)
```

You get a `session_id` immediately, plus `notify_on_complete: true` and `heartbeat_seconds: 60`. Park the id. Do other work. When a heartbeat arrives, read it. When the completion arrives, parse the log.

`heartbeat` without `background=true` is an error, not a silent ignore. The handler returns: notify/heartbeat only apply to background commands. Same for `persist_on_release` and `pty`. The corrected call is in the error string. Retry that call. Don't invent a sleep.

Foreground timeout above 600 seconds is a different path. The runtime promotes the command to a tracked background process with `notify_on_complete=true` and tells you so. Do not re-run it. That promotion is not heartbeat. If you wanted mid-run ticks, you should have spawned with `heartbeat=60` yourself.

## A job you can actually run

Save this as `progress_job.py`. It prints a line every 15 seconds so a 60-second heartbeat has something to show, then exits 0.

```python
#!/usr/bin/env python3
"""Bounded job with visible progress. Run under Hermes terminal heartbeat."""
import sys
import time

steps = int(sys.argv[1]) if len(sys.argv) > 1 else 8
for i in range(1, steps + 1):
    print(f"STEP {i}/{steps} t={i * 15}s", flush=True)
    time.sleep(15)
print("DONE", flush=True)
```

Foreground, to prove it works before you wrap it:

```bash
python3 progress_job.py 4
```

Four steps, about a minute, four `STEP` lines and `DONE`. Then spawn it in Hermes with `heartbeat=60` and `steps=12` (three minutes). You should see about two heartbeat events before the completion. If you see zero heartbeats and a completion, you either set `heartbeat` below 60 and hit a validation error, or you ran it in the foreground.

On a heartbeat turn, do not `sleep 60` and poll. The event already woke you. Parse the delta:

```python
def heartbeat_delta(event: dict) -> dict:
    output = event.get("output") or ""
    lines = [ln for ln in output.splitlines() if ln.strip()]
    failures = [ln for ln in lines if "FAILED" in ln or "ERROR" in ln]
    return {
        "seq": event.get("seq"),
        "elapsed": event.get("elapsed"),
        "lines": len(lines),
        "last": lines[-1] if lines else None,
        "failures": failures[:8],
        "quiet": not lines,
    }
```

If `failures` is non-empty, `process(action="kill")` the session. Do not wait for exit. That is the whole point of the tick. If `quiet` is true for two ticks in a row on a job that should be printing, poll the session once, read the redirected log with `read_file`, and decide. Two quiet ticks is a stuck job. A sleep loop is not a diagnosis.

## Heartbeat is not watch_patterns

`notify` is two types. `true` means notify on exit. A list of strings means notify when a line matches. Those two are mutually exclusive. On conflict, `watch_patterns` is dropped.

`heartbeat` forces `notify_on_complete = True`. So this call does **not** do what it looks like:

```text
# wrong — heartbeat wins, the ready-line watch is dropped
terminal(
  command="uvicorn app:app --port 8080",
  background=true,
  notify=["Application startup complete"],
  heartbeat=60
)
```

The spawn result will carry `watch_patterns_ignored`. You wanted a one-shot ready signal on a daemon. Heartbeat is for bounded jobs that end. A daemon does not end. Use pattern notify **or** a health-check curl, as in the previous post. Do not heartbeat a server.

watch_patterns itself is rate-limited (one notification per 15 seconds per process) and auto-disabled after repeated strikes or a lifetime cap of 8 hits, then promoted to notify-on-complete. It is documented as a rare one-shot on a long-lived process. Heartbeat has no strike breaker because the floor already bounds it: at most 60 events per hour per process.

## persist_on_release is a different knob

Default background jobs die when the agent session ends, when context compresses, when a turn times out, when you hit max iterations. That is the lifecycle sweep: sources `kill_all`, `gateway_turn_timeout`, and `agent_close`.

`persist_on_release=true` opts the process out of those three. The user can still kill it. `process(action="kill")` and CLI `/stop` pass a different source and still reach it. Host shutdown kills even persisted jobs, or they become orphans.

Use it for an overnight batch the conversation is allowed to leave:

```text
terminal(
  command="pytest -q tests/ > /tmp/overnight-pytest.log 2>&1; printf 'EXIT:%s\\n' $? >> /tmp/overnight-pytest.log",
  workdir="/home/you/projects/forge",
  background=true,
  notify=true,
  heartbeat=120,
  persist_on_release=true
)
```

The spawn result includes `"persist_on_release": true`. `process(action="list")` shows the flag on that session and omits it on volatile ones.

Do not set it on a two-minute build. Do not set it because you are afraid of `/new`. If the user did not ask for a job that outlives the conversation, leave the default. A persisted `next dev` is how you get "port already in use" after the chat is gone.

It still dies with the host process. This is not cron. Work that must survive a gateway restart belongs in `hermes cron`, not in a persisted shell.

## Subagents do not get the tick

If you spawn the job inside a `delegate_task` child, the completion notice does not reach the parent, and the process is killed when the child finishes. Heartbeats ride the same delivery path. In a delegated child the spawn result sets `notify_on_complete` to false and adds `subagent_note`. Heartbeat is not armed. The result may include `heartbeat_ignored`.

The child has three honest options before it finishes:

- `process(action="wait")` until exit
- `process(action="kill")`
- `process(action="handoff", session_id=..., data="pytest overnight, heartbeat 120")` so the parent owns the completion

Handoff is the one that preserves heartbeat. The parent then receives ticks and the exit. Returning a PR number and letting the parent watch is also fine. Leaving the process running and exiting the child is how you get an orphan the parent never hears about.

## Redirect the log. Parse the file.

Heartbeat output is a 2000-character delta. It is not the receipt. Redirect stdout yourself, append `EXIT:$?`, and on completion parse the file. Same contract as Don't Block the Loop. The tick tells you to look. The file tells you what happened.

```python
from pathlib import Path

def receipt(path: str) -> dict:
    p = Path(path)
    text = p.read_text(errors="replace")
    exits = [ln for ln in text.splitlines() if ln.startswith("EXIT:")]
    return {
        "bytes": p.stat().st_size,
        "exit": exits[-1] if exits else "MISSING",
        "failed": "FAILED" in text or "Failed to compile" in text,
        "tail": "\n".join(text.splitlines()[-20:]),
    }
```

If `exit` is `MISSING`, the process died without the sentinel. Treat it as failure. `process(action="log")` the session. Do not push.

`read_file` the log, not `cat` / `tail`. Terminal is for the job. The file tools are for the artifact. Piping the job through `tail` to "keep context small" throws away the failure line and also fights the truncation the runtime already does.

## Worked loop

1. Spawn `progress_job.py 12` (or your real suite) with `background=true`, `notify=true`, `heartbeat=60`, redirected to a log with an `EXIT:$?` sentinel.
2. Park `session_id`. Draft the commit message. Do not sleep.
3. On each heartbeat, run `heartbeat_delta`. If it reports failures, kill. If it reports quiet twice, `read_file` the log.
4. On completion, run `receipt()`. Branch on the sentinel, not on "the notify fired."
5. `process(action="list")`. Kill anything you started that should not outlive the session. If you set `persist_on_release`, say so in the reply so the next turn does not treat it as a leak.

## What not to do

- Don't wait for exit to learn about a failure that printed 30 minutes ago. That is what `heartbeat` is for.
- Don't set `heartbeat=15`. The schema minimum is 60. Non-integers and negative values error; `arm_heartbeat` clamps anything smaller than 60 up to 60. Use 60, 120, or 180.
- Don't heartbeat a daemon. Pattern-notify the ready line, or curl a health check.
- Don't combine `heartbeat` with `notify=["ready"]`. Heartbeat forces notify-on-complete and drops the watch.
- Don't `sleep N` in the background to wait. Foreground a wait with a real timeout, or let heartbeat / notify wake you.
- Don't persist a job the user did not ask to keep. Lifecycle cleanup is the default for a reason.
- Don't spawn the long job in a subagent and expect ticks in the parent. Handoff, or run it in the parent.
- Don't treat a heartbeat `output` field as the full log. It is a 2000-character delta. The file is the source of truth.

## A project to try tonight

Pick a test target that takes more than two minutes. In a Hermes session:

1. Run `progress_job.py 4` in the foreground so you trust the script.
2. Spawn `progress_job.py 12` with `heartbeat=60`, redirecting to `$TMPDIR/try-heartbeat.log` (or `~/.hermes/cache/scratch/` if TMPDIR is unset — do not drop this in `/tmp` on a tmpfs box).
3. While it runs, list the last 10 commits. That is the point. The loop stays useful.
4. When a heartbeat arrives, print `seq`, `elapsed`, and the last line of the delta. Do not poll.
5. When notify fires, parse `EXIT:` from the log. Confirm it matches `process(action="log")`.

If you can do that without a single `sleep`, and you saw at least one heartbeat before exit, the middle of the contract is working.

Spawn, notify, log, verify still stands. Heartbeat is how you stay in the loop while the job is still running. Persist is how you leave the loop on purpose. Everything else is a sleep you dressed up as engineering.

## Related

- [Don't Block the Loop](/blog/2026-09-01-dont-block-the-loop-background-terminal) — spawn, notify, log, verify
- [The Agent's CWD Is a Capability](/blog/the-agents-cwd-is-a-capability) — `workdir` beats a leftover `cd`
- [Don't Invent the Receipt](/blog/dont-invent-the-receipt-agent-tool-output) — truncated tool output is not evidence
- [Don't Poll the Transcript](/blog/2026-09-17-dont-poll-the-transcript-steer-the-child) — the same "don't wait in a loop" rule, for subagents
- Hermes tools reference: [Built-in Tools](https://hermes-agent.nousresearch.com/docs/reference/tools-reference)
