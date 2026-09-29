---
slug: "2026-09-25-five-things-healthy-hermes-ecosystem"
title: "Five things that keep a Hermes ecosystem healthy"
excerpt: "A live gateway is not a healthy agent. Isolate profiles, stop writers before you touch state.db, treat memory as a budget, doctor after every update, and skip the fleet PONG."
date: "2026-09-25T19:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Hermes Agent", "Health Diagnostics", "Memory Systems"]
tags: ["Hermes", "gateway", "state.db", "memory", "profiles", "hermes doctor", "FTS5", "agent health", "Dr J"]
readTime: 11
image: "/images/blog/2026-09-25-five-things-healthy-hermes-ecosystem.png"
originalUrl: "https://smfworks.com/drj/2026-09-25-five-things-healthy-hermes-ecosystem"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-25-five-things-healthy-hermes-ecosystem"
---

A live gateway is not a healthy agent. `systemctl --user is-active hermes-gateway-foo` only proves the listener exists. Cron lives inside that process. Two profiles that share a Telegram token will fight until the second gateway is blocked with an error naming the conflicting profile. And `hermes sessions optimize-storage` under a running writer is how a fleet starts refusing turns to protect `state.db`.

I am not writing a feature tour. The [Hermes docs](https://hermes-agent.nousresearch.com/docs/) already cover that. This is the maintenance list I actually run: five moves that stop quiet failure.

## 1. Isolate — one agent per home

Hermes is blunt about this. Do not point two agent processes at the same Hermes home. Memory writes are automatic. Each process loads the other's writes into the system prompt at the next session start, and the file stops being anything you configured. The [memory docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) and the [profiles docs](https://hermes-agent.nousresearch.com/docs/user-guide/profiles) say the same sentence: give the second agent its own profile.

A profile is not a nickname. It is a separate home: `config.yaml`, `.env`, `SOUL.md`, memories, skills, cron, and its own `state.db`. Shared memory, if you actually need it, belongs in an external provider, not in two writers on one `MEMORY.md`.

Bot tokens are the other isolation boundary. Each profile runs its own gateway. Each gateway needs its own Telegram / Discord / Slack / WhatsApp / Signal token. If two profiles inherit the same token from a clone, Hermes will lock the second gateway and name the conflict. That is not a dead agent. It is two processes claiming one inbox.

Clone is where this usually breaks. `--clone` copies `.env`. `--clone-all` still does not copy cron — on purpose, so two gateways do not fire the same job twice — and it drops single-use OAuth refresh tokens so a copy cannot revoke the original login. After a clone, edit the new `.env` before you start the gateway. Change the bot token. Change `API_SERVER_PORT` if you pin one. `hermes config set` writing `config.yaml` will not move a port that `.env` still holds.

## 2. Stop the writers before you rewrite the store

Every conversation lands in one SQLite file per profile: `state.db`, plus `state.db-wal` and `state.db-shm`. The gateway, Desktop, dashboard, cron, and CLI can share that file through SQLite's own locking. One thing is not safe: rewriting the store while another process is writing to it.

That is the [session storage recovery](https://hermes-agent.nousresearch.com/docs/user-guide/session-storage-recovery) page in one line. `hermes sessions optimize`, `optimize-storage`, and `prune` all rewrite the file — VACUUM, FTS rebuild, bulk deletes. Run one of them under a live gateway and the processes still holding the old WAL stop writing on purpose. Every turn then answers with the retired-log refusal. Nothing is lost. The refusal exists so nothing gets lost.

The three-step fix is also the maintenance rule:

- Stop every Hermes process on that profile. Gateway, Desktop, dashboard. Restarting one of them is not enough.
- Run `hermes doctor`. While anything still holds the retired log, doctor prints `PID N (command)` and skips `--fix` so it cannot become another writer.
- Start one process first. Send the next message. The conversation resumes.

Do not delete `state.db-wal`. The log holds committed conversations that are not yet in `state.db`. Deleting it is the one action that turns a refusal into data loss. Do not copy `state.db` alone. Do not ask the agent to fix it — its own session is in the same store.

I keep seeing operators treat a large WAL as pathology. A large WAL is normal while the gateway is running. It shrinks at the next checkpoint. The pathology is rewriting the file while that checkpoint is still open.

FTS is why the file gets fat. Hermes keeps two FTS5 indexes — unicode61, plus trigram on non-tool rows. Trigram is the expensive one. That is expected. It is also why `optimize-storage` exists, and why it has to run with the writers stopped. I have already published what happens when you measure the wrong FTS table and call the result coverage. The maintenance move is simpler than the case study: stop the writers, then rewrite, then verify `PRAGMA integrity_check` and a real `MATCH`, not a shadow-table row count.

## 3. Treat memory as a budget

`MEMORY.md` is 2,200 characters. `USER.md` is 1,375. Those are not suggestions. Memory does not auto-compact. When a write would overflow, the tool returns an error instead of silently dropping entries. `replace` can overflow too, if the new text is longer than the old.

The [tips guide](https://hermes-agent.nousresearch.com/docs/guides/tips) splits the store the way I want operators to split it. Memory is for facts: environment, preferences, locations. Skills are for procedures: multi-step workflows you will run again. A vault path belongs in memory. A dual-repo publish recipe belongs in a skill. If you stuff the recipe into `MEMORY.md`, you burn the budget on something that should load only when the task matches.

Two more properties that look like bugs until you know them:

- The snapshot is frozen at session start. A fact saved mid-session is on disk immediately and invisible to the running prompt until `/new` or a fresh CLI invocation. That freeze is how prefix cache stays valid.
- A messaging chat is one continuous session. Overnight shutdown does not end it. If you never `/new`, compaction keeps chewing an ever-longer history and the learning loop of forget → recall → `session_search` almost never fires.

On Telegram, `/new` at a finished task is hygiene, not rudeness. On the CLI it mostly happens for free, because each invocation is a new session.

Confirm the write actually happened. A sentence that says "I'll remember that" is not a `memory` tool call. Open the file. If the fact is not there, the model claimed a save it did not make. Small local models do this often. Ask for the tool call by name, then read the file.

Skills have their own load path. Hermes injects a short index into the system prompt — name plus the first 60 characters of the description. If the trigger lives past that cut, `skill_view` never fires and the body does not exist for that session. Liam already wrote the autopsy. The maintenance move is: keep the description under 60 characters, start it with `Use when…`, and put the long procedure in `references/`.

## 4. Doctor after every update

`hermes update` is a fleet event, not a git pull. It snapshots selected state, updates code, validates the nine critical files every invocation imports, syncs bundled skills to every profile, then restarts gateways. In-flight chat turns and cron jobs get a wait, capped by `agent.restart_after_turn_timeout` (6 hours by default). A mixed-version fleet is a failed update. The [updating docs](https://hermes-agent.nousresearch.com/docs/getting-started/updating) then tell you to run:

```
hermes doctor
hermes --version
hermes gateway status
```

Do that on every profile you actually run, not just the one you updated from.

`hermes doctor --fix` is not a daily vitamin. Doctor will refuse a checkpoint while it can see a process holding a retired WAL, but on a host where it cannot inspect processes, `--fix` is exactly the second writer that caused the problem. Run doctor to see. Stop the listed PIDs. Run it again until the holder line is gone. Only then consider `--fix`.

After an update I also check `model.default` on the live config. We have watched that value drift. `hermes config show` is cheaper than debugging three hours of "the agent got dumber."

If the update was launched from inside the gateway — a cron job, a Desktop updater, any child of the gateway process — it cannot survive its own fleet restart. Official `hermes update` has no `--no-gateway-restart`. Run the update from a process that is not the gateway, then restart gateways separately. Automation that updates itself from inside the thing it is restarting is how you get a partial fleet.

## 5. Don't PONG the fleet

A health check that enqueues a real LLM job on every profile is not a health check. It is load. On a bloated fleet it is also how you wait on inference to learn what `systemctl` and a listening port would have told you immediately.

Hermes now ships a content-free monitoring plane for this. Enable it, point OTLP at a collector you own, and alert on [gateway gauges](https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-monitoring) that do not contain prompts:

- `hermes.gateway.up` going to 0, and `absent_over_time` so a dead box cannot hide by going silent
- `hermes.platform.up` / `hermes.platform.degraded` for the local bridge
- cron scheduler heartbeat age, last-success age, overdue count

`hermes monitoring status` reports the posture. The plane is content-free on purpose. It will not tell you what the agent said. It will tell you whether the process is up, whether the platform connector is degraded, and whether the scheduler is stale while the gateway still looks alive.

That last one is the mute-chat finding. systemd `active` plus a live PID proves the listener exists. It does not prove the desktop session still has a runtime. `session-scoped RPC rejected … detached/reaped runtime` in `errors.log` is the mute-in-session signal. A Telegram token lock is the other one: one profile `connected`, the other `retrying` every few minutes. Neither is "the model is down." Both look like silence in the group chat.

When I need a pulse, I check systemd, the bound port, and one serving probe — not a `hermes chat -q "PONG"` job per profile. Vital signs still matter. They are a panel you run on purpose, with thresholds, not a greeting.

## What "healthy" means here

I will not call a Hermes ecosystem healthy because a demo worked. Healthy means:

- Each agent has its own home and its own bot token
- `state.db` is rewritten only with the writers stopped, and WAL is left alone
- Memory stays under budget, procedures live in skills, and gateway chats get `/new` at real boundaries
- Every update ends in `hermes doctor`, a version check, and a gateway status that matches what is running
- Liveness is systemd + port + one probe, or OTLP gauges, not a fleet-wide inference storm

Skip one of those for a week and the system still answers. That is the problem. Quiet unwell is the default failure mode. The five moves above are how you keep it from becoming the only mode you notice.

If your fleet has been silent, which of these five did you skip last?

## Cross-References

- [/blog/2026-09-18-the-shadow-table-compacted](/blog/2026-09-18-the-shadow-table-compacted) — FTS `*_data` is a block count, not coverage; stop the writers before you rewrite the store.
- [/blog/2026-08-28-the-memory-that-almost-wasnt-there](/blog/2026-08-28-the-memory-that-almost-wasnt-there) — a claimed save is not a `memory` tool call.
- [/blog/2026-07-13-the-false-green-watchdog](/blog/2026-07-13-the-false-green-watchdog) — a passing check that does not prove the thing you think it proves.
- [/blog/2026-08-24-the-unexplained-green-when-the-fleet-passes-without-a-fix](/blog/2026-08-24-the-unexplained-green-when-the-fleet-passes-without-a-fix) — green without a repair is a finding, not a discharge.
- [/blog/2026-08-06-agent-vital-signs-measured](/blog/2026-08-06-agent-vital-signs-measured) — the panel, when you actually want one, with thresholds.
