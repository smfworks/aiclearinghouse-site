---
slug: "2026-09-03-cron-job-is-not-the-profile"
title: "The Cron Job Is Not the Profile: Pins, Notepads, and Continuity"
excerpt: "Changing model.default does not retarget your Tuesday publishing job. Hermes cron pins, notepads, continuity, and monitor scripts are how a scheduled coding agent keeps its own model, its own state, and its own memory of last night. Here is the contract I use, with commands you can run tonight."
date: "2026-09-03T09:00:00-04:00"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Cron Job Automation", "Tutorial"]
tags: ["hermes", "cron", "notepad", "continuity", "monitor-script", "model-pin", "automation", "tutorial"]
readTime: 11
image: "/images/blog/liam-cron-job-is-not-the-profile-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-09-03-cron-job-is-not-the-profile"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-03-cron-job-is-not-the-profile"
---

I switched my chat model last month. The next morning the nightly research job still ran on the local 26B I had pinned in February. A different job, unpinned, did not follow the new default either — it failed closed, skipped the inference call, and sat silent until I noticed the gap in the output folder. Both outcomes are correct. Both surprised me the first time.

A Hermes cron job is not "the profile, later." It is its own process with its own model, its own state, and no memory of yesterday unless you give it some. This post is the contract I now write at create time: **pin, notepad, continuity, monitor.** Plus the three commands I run when a job goes quiet.

## The Job Does Not Inherit Your Afternoon

Resolution at fire time is a chain, not a vibe:

- Per-job `--model` / `--provider` if you set them.
- Else `cron.model` / `cron.model_provider` in `config.yaml`.
- Else the global default that was **snapshotted at create time**.

That last one is the trap. Hermes does not let an unpinned recurring job silently pick up a new paid provider because you ran `hermes model` at 2pm. The drift guard skips the run, makes no inference call, and alerts once. After that the job stays skipped until you pin it or restore the old default. I have watched people "fix" this by disabling `cron.model_drift_guard`. Don't. Pin the job.

The agent's `cronjob` tool cannot set `--model`. Inference pins are user-owned on purpose — a scheduled agent is not allowed to retarget spend. You set them from the CLI, the dashboard, or by editing `jobs.json`.

```bash
hermes cron create "0 23 * * *" \
  --name "nightly-research" \
  --model "gemma-4-26B" \
  --provider "local" \
  --reasoning-effort medium \
  --deliver local \
  --failure-deliver telegram \
  --skill nightly-research \
  --skill obsidian \
  "Run the nightly research pipeline. Write notes to the vault. If nothing new shipped, respond with only [SILENT]."
```

`--reasoning-effort` is a separate pin. It overrides both `agent.reasoning_effort` and any per-model `agent.reasoning_overrides` for that job. Levels the model cannot do are clamped at request time — `xhigh` on a model that tops out at `high` runs at `high`. Pin it anyway. A local 26B that rejects `xhigh` will degrade in ways that look like a prompt regression, not a config bug.

To retarget later without recreating the job:

```bash
hermes cron edit nightly-research \
  --model glm-5.2 \
  --provider ollama-cloud \
  --reasoning-effort medium
```

Pass an empty string to clear a pin and fall back to `cron.model`. Name lookup works; if two jobs share a name the command refuses and prints the candidate IDs.

## Structured State Lives in the Notepad

Continuity (next section) dumps last night's prose into tonight's prompt. That is useful for "don't repeat the same HN stories." It is the wrong tool for a cursor, a SHA, or a last-green build.

Each job has a durable KV scratchpad in `~/.hermes/cron/notepad.db` (profile-local). Caps, because the notepad is prompt-injected every run:

- 16 KB per value
- 64 KB per job total
- 128 characters per key

Oversized writes raise `ValueError` and leave the store untouched. Write through the CLI — there is no model tool for this, by design. The running agent calls it via `terminal`:

```bash
hermes cron notepad 0f87f33ce1c4 set last_green_sha 9f86d081884c
hermes cron notepad 0f87f33ce1c4 set last_fail_summary "auth tests: 2 failed in tests/test_session.py"
hermes cron notepad 0f87f33ce1c4 get last_green_sha
hermes cron notepad 0f87f33ce1c4 list
hermes cron notepad 0f87f33ce1c4 delete last_fail_summary
```

When the notepad is non-empty, Hermes prepends a section to the job prompt that names every key and shows the exact `set`/`delete` command with **that job's id already filled in**. When it is empty, the section is omitted on purpose — empty notepad must keep the prompt byte-identical so prompt cache and drift checks stay stable.

That last sentence is the gotcha. A brand-new job does not tell the agent how to write the notepad, because there is nothing to inject. Seed one key at create time so the first LLM run sees the CLI:

```bash
JOB=$(hermes cron list | awk '/nightly-research/{print prev} {prev=$1}' )
# or copy the 12-hex id the create command printed
hermes cron notepad "$JOB" set last_green_sha unknown
```

I keep three keys on coding jobs: `last_green_sha`, `last_fail_sha`, `last_report_date`. Not a diary. Watermarks.

## Continuity Is Last Night's Output, Not a Database

`--continuity` injects the job's own most recent delivered output into the next run, framed as "avoid repeating what was already reported." First run is unchanged. Internally it is stored as a reserved `self` entry in `context_from`, so it composes with upstream jobs.

```bash
hermes cron create "every 6h" \
  --name "agent-tooling-scout" \
  --continuity \
  --deliver local \
  --model glm-5.2 \
  --provider ollama-cloud \
  "Scan HN and arXiv for new agent-tooling papers. Report only items NOT already covered in your previous run's output. If nothing new, respond with only [SILENT]."
```

Toggle later with `hermes cron edit agent-tooling-scout --continuity` or `--no-continuity`. `--no-continuity` leaves other `context_from` refs alone.

Use continuity for prose you want to dedupe. Use the notepad for values you want to branch on. If you stuff a SHA into continuity, the agent will bury it in a paragraph and you will parse it wrong next Tuesday.

`[SILENT]` on a successful run suppresses delivery. The output still lands in `~/.hermes/cron/output/` for audit. Failed runs always deliver, marker or not. Quiet monitors belong in the prompt as "if healthy, respond with only `[SILENT]`."

## Don't Wake the Model If the Input Did Not Change

`--monitor-script` (or `--monitor-url`) runs a cheap source **before** the agent. Exact-bytes hash of stdout. Unchanged → the LLM never starts. Changed → the prompt gets a `MONITOR CHANGE DETECTED` diff and the agent runs. Incompatible with `--no-agent`. Output must be stable — no timestamps, no `date`, no locale-dependent `ls -l`.

Scripts resolve inside `$HERMES_HOME/scripts/`. Provider API keys are stripped from the subprocess environment.

```bash
# ~/.hermes/scripts/forge-head.sh
#!/usr/bin/env bash
set -euo pipefail
cd /home/you/projects/forge
git rev-parse HEAD
git diff --stat origin/main
git status --porcelain
```

```bash
chmod +x ~/.hermes/scripts/forge-head.sh

hermes cron create "*/15 * * * *" \
  --name "forge-test-watch" \
  --monitor-script forge-head.sh \
  --workdir /home/you/projects/forge \
  --model glm-5.2 \
  --provider ollama-cloud \
  --reasoning-effort low \
  --continuity \
  --deliver local \
  --failure-deliver telegram \
  --skill hermes-agent \
  "You watch /home/you/projects/forge. The monitor diff is the only reason you woke up.
Read the notepad keys last_green_sha and last_fail_sha.
Run pytest -q. Redirect to /tmp/forge-watch.log and append EXIT:$?.
If tests pass: set last_green_sha to HEAD, delete last_fail_sha, respond [SILENT].
If tests fail: set last_fail_sha to HEAD, set last_fail_summary to the failing node ids, report the failures.
Do not re-report a SHA you already stored as last_fail_sha."
```

`--workdir` is the other half. Without it the job has no `AGENTS.md`, no `.cursorrules`, and the terminal cwd is wherever the gateway started. Pass an absolute directory that exists. Relative paths are rejected at create time.

For a check that does not need a model at all, skip the agent:

```bash
hermes cron create "every 5m" \
  --name "disk-watchdog" \
  --no-agent \
  --script disk-watchdog.sh \
  --deliver telegram
```

Empty stdout is a silent tick. Non-zero exit delivers an error, so a broken watchdog cannot fail quiet. That is the right shape for disk, memory, and "is the gateway up" checks. It is the wrong shape for "did the tests fail and what should I patch."

## When It Goes Quiet, Don't Guess

Three read-only commands. I run them in this order.

```bash
hermes cron doctor
hermes cron runs forge-test-watch --limit 20
hermes cron incidents --state alerted
```

`doctor` exits `1` when anything is actionable, `0` when healthy. It checks: last run failed, last delivery failed, `next_run_at` missing or parked in the past beyond a 15-minute grace window, script missing or outside `HERMES_HOME/scripts`, `no_agent` with no script, `workdir` that no longer exists. It never mutates.

`runs` is the attempt ledger in `executions.db`. States: `claimed` → `running` → `completed` | `failed` | `unknown`. After a gateway restart, an abandoned attempt becomes `unknown` only when the original PID is gone. Unknown is an audit record. It is not retried.

`incidents` groups recurring failures by job plus a normalized error signature. Acknowledge a known one to stop the per-run ping for **that signature only**:

```bash
hermes cron incidents ack <incident_id>
```

A different error mints a new incident and alerts again. A successful run does not close incidents — they are per-signature, not per-job.

`--failure-deliver` is the other half of quiet. `deliver=local` is correct for jobs whose output is a file. It is a bad place for the failure notice. I set `--failure-deliver telegram` (or whatever home channel you actually read) so a `blocked_config` or a 503 shows up where I will see it. `failure-deliver local` suppresses the notice entirely; the run still shows in `hermes cron list`. Preflight already blocks a job whose API key is missing or whose attached skill is missing a credential — `last_status` becomes `blocked_config`, one alert, no LLM call. I have a job right now flagged by doctor because an attached skill wants `google_token.json` that is not on disk. The job is not "broken." It is correctly refusing to spend tokens.

None of this runs if the gateway is down. Cron lives inside the gateway process. `hermes cron status` first. If you have no messaging platforms configured, the gateway can TEMPFAIL on exit 75 and systemd will restart it forever. An API-server platform is enough to keep it alive for cron-only profiles.

## Worked Example: A Repo Watcher You Can Paste

Assume `/home/you/projects/forge` takes two minutes to test and you want an agent to notice HEAD moving, run pytest, and only talk when something is red.

**1. Write the monitor.** Stable bytes only.

```bash
cat > ~/.hermes/scripts/forge-head.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /home/you/projects/forge
git rev-parse HEAD
git diff --stat origin/main
git status --porcelain
EOF
chmod +x ~/.hermes/scripts/forge-head.sh
```

**2. Create the job with every pin filled in.** Do not leave model, reasoning, deliver, or workdir to profile defaults.

```bash
hermes cron create "*/15 * * * *" \
  --name "forge-test-watch" \
  --monitor-script forge-head.sh \
  --workdir /home/you/projects/forge \
  --model glm-5.2 \
  --provider ollama-cloud \
  --reasoning-effort low \
  --continuity \
  --deliver local \
  --failure-deliver telegram \
  "Watch /home/you/projects/forge. You woke because the monitor hash changed.
Run: pytest -q > /tmp/forge-watch.log 2>&1; printf 'EXIT:%s
' $? >> /tmp/forge-watch.log
Read /tmp/forge-watch.log.
If EXIT:0, update notepad last_green_sha to HEAD and respond [SILENT].
If EXIT non-zero, update last_fail_sha and last_fail_summary, then report the failing node ids and the first error block.
Never invent a green run from a missing log."
```

**3. Seed the notepad** so the first run sees the write path.

```bash
hermes cron notepad <job_id> set last_green_sha unknown
```

**4. Prove the scheduler, not the prompt.**

```bash
hermes cron status
hermes cron run forge-test-watch
# wait one tick
hermes cron runs forge-test-watch --limit 5
hermes cron doctor
```

`hermes cron run` queues the job for the next tick. It is not a synchronous execute. If status says the scheduler is down, the queue never drains.

**5. Confirm the pin survived a chat-model change.** Switch your interactive model, then:

```bash
hermes cron list   # still shows the job's own model
```

If list does not show a model line, the job is unpinned and you are on the snapshot/drift-guard path. Edit it.

## What Not to Do

- Don't assume `hermes model` retargets existing jobs. It doesn't.
- Don't disable `cron.model_drift_guard` to "make jobs follow me." Pin them.
- Don't ask the agent to set `--model`. It cannot. You set it.
- Don't use continuity as a key-value store. Use the notepad.
- Don't leave the notepad empty and expect the agent to discover the CLI on run one. Seed a key.
- Don't put timestamps in a monitor script. The hash will change every tick and you will pay for a no-op.
- Don't use `--no-agent` for a job that has to decide anything. Scripts report; agents decide.
- Don't set `deliver=origin` on a profile with no messaging platform. You get `no delivery target resolved for deliver=origin` on every run. Use `local`.
- Don't treat `doctor` exit 0 as "the tests passed." It means the job machinery is healthy. The pytest log is a different receipt.
- Don't create cron jobs from inside cron jobs unless you have set `cron.allow_agent_scheduling: true`. The default is off so a scheduled agent cannot fork the table.

## A Project to Try Tonight

Pick a repo with a test suite. In your own shell, not in a chat:

1. Write `~/.hermes/scripts/<repo>-head.sh` that prints `git rev-parse HEAD` and nothing else.
2. Create a `*/15` job with `--monitor-script`, `--workdir`, `--model`, `--reasoning-effort`, `--continuity`, `--deliver local`, `--failure-deliver` to a channel you actually read.
3. Seed `last_green_sha=unknown`.
4. `hermes cron run` it once. Read `hermes cron runs` and the file in `~/.hermes/cron/output/`.
5. Change nothing in the repo. Wait for the next tick. Confirm doctor stays clean and no new LLM run appears in `runs` — that is the monitor hash doing its job.
6. Break a test on purpose. Wait. Confirm you get a failure notice on `--failure-deliver`, the notepad has `last_fail_sha`, and the next unchanged tick does not re-page you.

If step 5 still bills a model call, the monitor output is not stable. Print `date` in the script and you will see why.

The profile is where you chat. The job is where unattended work lives. Treat them as different machines that happen to share a disk.

## Related

- [Don't Block the Loop](/blog/2026-09-01-dont-block-the-loop-background-terminal) — spawn, notify, log, verify for long terminal jobs
- [Agent Idempotency](/blog/agent-idempotency-durable-execution) — why the same cron task must be safe to run twice
- [The Unattended Agent](/blog/unattended-agent-cron-driven-ai-workflows) — designing scheduled workflows that don't silently rot
- [Cron Jobs That Ship](/blog/cron-jobs-that-ship-hermes-ai-scheduled-publishing) — a publishing agent on a schedule
- [The Delegation Contract](/blog/2026-08-25-subagent-delegation-contract) — the same "don't trust a self-report" rule, for subagents
