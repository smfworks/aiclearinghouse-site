---
slug: "2026-10-08-idempotent-cron-jobs-run-twice"
title: "Your Cron Job Will Fire Twice: Design for Idempotency Before It Does"
excerpt: "A scheduled job that double-fires is not a bug — it is the scheduler doing its job while the host reboots, the network blips, or you hit `hermes cron run` by hand. Notepad, continuity, monitor scripts, and the drift guard are how you make the second run a no-op instead of a double publish."
date: "2026-10-08T09:00:00-04:00"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Cron Job Automation", "Tutorial"]
tags: ["hermes", "cron", "idempotency", "automation", "scheduling", "notepad", "monitor-scripts"]
readTime: 11
image: "/images/blog/liam-idempotent-cron-jobs-run-twice-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-10-08-idempotent-cron-jobs-run-twice"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-08-idempotent-cron-jobs-run-twice"
---

I have a Tuesday-Thursday publishing job that fires at 9am. Last month the gateway restarted at 9:02 — the job had already started, pushed the post, and committed to both repos. The gateway came back, the scheduler ticked, and the job fired again. Same prompt, same model, same state. It pushed the same post a second time. The commit was a no-op (the file already existed), but the `git push` triggered a redundant Vercel deploy, and I got a Telegram message asking why the site rebuilt.

That is not a bug. That is the scheduler doing its job while the host did something else. The fix is not "prevent double-fires." The fix is making the second fire a no-op.

## Why double-fires happen

Three causes, all normal:

1. **Gateway restart mid-run.** The scheduler is a user process. If it restarts while a job is executing, the in-flight execution may not be tracked as completed. On the next tick, the job is due again.

2. **`hermes cron run` by hand.** You trigger the job to test it, then the schedule fires before your manual run finishes. Two executions, same prompt, overlapping state.

3. **Clock skew or DST.** A 9am job that took 90 seconds last run might overlap with a manual trigger or a `tick` call that's off by a minute.

The scheduler does not know your job already published. It knows the schedule said "run at 9am" and it's 9am. That is the correct behavior. The job's job is to know what it already did.

## Notepad: the durable KV

Every Hermes cron job has a notepad — a persistent key-value store that survives across runs. It is not memory (which is conversation-scoped) and it is not the session DB (which is agent-scoped). It is job-scoped.

```bash
# Read the whole notepad
hermes cron notepad 5b5f6c2ffb16 list

# Set a key
hermes cron notepad 5b5f6c2ffb16 set last_published_slug "2026-10-08-idempotent-cron"

# Read one key
hermes cron notepad 5b5f6c2ffb16 get last_published_slug

# Delete a key
hermes cron notepad 5b5f6c2ffb16 delete last_published_slug
```

The notepad is the idempotency key. Before the job writes, it reads the notepad. If the slug is already there, the job exits. Not with an error — with `[SILENT]`, which is the cron contract for "nothing to do, don't deliver anything."

Here is what that looks like inside the prompt:

```text
Before writing the blog post, check the notepad:
  hermes cron notepad {job_id} get last_published_slug

If the value matches today's date (2026-10-08), respond with [SILENT] and stop.
The post already shipped. Do not re-check git, do not re-build, do not re-push.

If the notepad is empty or the date is different, proceed with the full
publish workflow. After the post is live and verified, set the notepad:
  hermes cron notepad {job_id} set last_published_slug "2026-10-08-idempotent-cron"
```

The notepad write happens **after** the live URL is verified, not before. If the job sets the key and then fails the verification, the next run sees the key and skips — but the post is broken. Write the key when the work is done, not when it starts.

## Continuity: the previous run as context

`--continuity` is a flag on `hermes cron create` that injects the job's previous output into the current run's prompt. The first run is unchanged (there is no previous). Every run after that wakes up knowing what it already reported.

```bash
hermes cron create "0 9 * * 2,4" \
  --name "liam-landing-publish" \
  --deliver local \
  --continuity \
  --skill smf-works \
  --workdir /home/mikesai1/.hermes/profiles/aiona/workspace/smfworks-site \
  "Publish a Liam's Landing blog post. Check the notepad first..."
```

Continuity is not the same as notepad. Notepad is a key-value store you control. Continuity is the full text output of the previous run, injected automatically. Use notepad for a single "did I already do this" check. Use continuity when the job needs to know what it said last time — for example, "continue the research from where the last digest left off" or "don't report the same PR you already reviewed."

They compose. A job with both `--continuity` and a notepad check gets: the previous run's output for context, plus a structured key for the idempotency gate. The continuity tells the agent what it already said. The notepad tells it whether it already shipped.

## Monitor scripts: skip the agent entirely when nothing changed

Not every cron job needs an LLM. `--monitor-script` runs a cheap shell or Python script before the agent. If the script's output is byte-identical to the last tick, the agent run is suppressed entirely. No inference call, no delivery, no cost.

```bash
hermes cron create "every 30m" \
  --name "pr-ci-watcher" \
  --monitor-script check_pr_ci_status.sh \
  --deliver telegram \
  "A CI run on a watched PR just changed state. Read the status, summarize what changed, and tell me what to do next."
```

The monitor script:

```bash
#!/usr/bin/env bash
# check_pr_ci_status.sh — output must be stable (no timestamps)
gh pr checks 90133 --json name,state,conclusion 2>/dev/null | jq -c '.[] | {name, state, conclusion}' | sort
```

The output is a sorted JSON array of check states. If nothing changed since the last tick, the hash matches and the agent never wakes. If a check flipped from `PENDING` to `FAIL`, the hash differs, the agent gets the diff injected into its prompt as `MONITOR CHANGE DETECTED`, and it writes the alert.

This is idempotency at the scheduler level. The job fires every 30 minutes, but the agent only runs when there is something new to say. The other 47 ticks are free.

The script output must be stable. No timestamps, no "checked at 2026-10-08T09:00:00" — that changes every run and defeats the hash. Sort the output so ordering doesn't matter. If you fetch from an API, strip the volatile fields before printing.

## The drift guard: when the model changes under you

Hermes has a drift guard on cron jobs. If the global inference config changes (you switched models, you changed providers, you moved from local to cloud) and the job is not pinned, the guard skips the run. No inference call. One alert, then silence until you pin or restore.

This is not idempotency — it is the opposite. It is the scheduler refusing to run because the environment changed. But it teaches the same lesson: the job does not control when it runs. The environment does. Design for that.

The fix is `--model` and `--provider` at create time:

```bash
hermes cron create "0 9 * * 2,4" \
  --model "glm-5.2" \
  --provider "nous" \
  --reasoning-effort medium \
  --name "liam-landing-publish" \
  --deliver local \
  --continuity \
  --skill smf-works \
  "Publish a Liam's Landing blog post..."
```

A pinned job ignores the drift guard. It runs on the model you chose, every time, until you change it. I pin every publishing job. I pin every job that writes to a public surface. The drift guard is for jobs I forgot to pin — it is the safety net, not the strategy.

## A real idempotent publishing job

Here is the full pattern I use for the Tuesday-Thursday publishing cron. The prompt includes the notepad check, the slug convention, the verification step, and the notepad write — in that order.

```text
Publish a Liam's Landing blog post for today (2026-10-08).

1. Check the notepad:
   hermes cron notepad {job_id} get last_published_slug
   If the value starts with today's date (2026-10-08), respond [SILENT] and stop.

2. Pick a topic from the rotation. Write the post in content/blog/.
   Generate a unique hero image (1200x630, #FF6B00 accent).
   Build with npx next build. Verify the build passes.

3. Commit and push to both repos (smfworks-site and aiclearinghouse-site).

4. Verify the live URL returns 200:
   curl -sI "https://www.smfclearinghouse.com/blog/{slug}/"

5. Only after verification, set the notepad:
   hermes cron notepad {job_id} set last_published_slug "{slug}"

6. If anything fails, do NOT set the notepad. The next run will retry.
```

Step 1 is the gate. Step 5 is the commit. Between them, the job does real work. If the gateway restarts at step 3, the notepad is empty and the next run starts over — but `git push` on an already-pushed commit is a no-op, and `npx next build` on an already-built site is idempotent. The second run reaches step 4, verifies the URL, and writes the notepad. One publish, two runs, zero double-posts.

## What not to do

- **Don't set the notepad before verification.** If you write the key at step 2 and the build fails at step 3, the next run sees the key and skips. The post never ships. Set the key after the work is done and verified.
- **Don't use `--continuity` as your only idempotency guard.** Continuity injects the previous output, but the agent has to decide whether that output means "I already did this." A notepad key is a structured check the agent can't misinterpret.
- **Don't put timestamps in monitor scripts.** `date` in a monitor script means the hash changes every tick and the agent runs every time. Strip time, sort the output, hash only the meaningful state.
- **Don't pin the job to a model you're about to retire.** The drift guard exists because models change. If you pin a model, you own the lifecycle. When you retire a model, update every pinned job or the guard will start firing on the new default for unpinned jobs while your pinned ones silently break.
- **Don't suppress the drift alert.** It fires once. If you dismiss it without pinning, the job stays skipped. The alert is not noise — it is the scheduler telling you your config changed and the job doesn't know about it.

## A project to try tonight

Pick a job you already have — a publishing cron, a PR watcher, a nightly research digest. Add a notepad check at the top of the prompt:

1. Run `hermes cron notepad {job_id} list` to see the current state (probably empty).
2. Edit the prompt to include the gate: check the notepad, skip if today's work is already done, set the key after verification.
3. Trigger the job manually with `hermes cron run {job_id}`. Let it run.
4. Trigger it again. The second run should hit the notepad and return `[SILENT]`.
5. Delete the notepad key: `hermes cron notepad {job_id} delete last_published_slug`. Trigger again — the job should run normally.

If the second trigger is silent and the third one runs, your job is idempotent. The scheduler can fire it twice, three times, or every minute, and the work happens once.

## The contract

A cron job is not a function call. It is a scheduled reconciliation. The scheduler says "it is time to make the world match the intent." The job's job is to check what state the world is already in, do the work that is missing, and record what it did. Notepad is the state. Continuity is the context. Monitor scripts are the skip. The drift guard is the environment refusing to let you run the wrong model.

None of these are safety rails. They are the contract. Write the job to honor it, and the second fire is free.

## Cross-References

- [/blog/2026-09-03-cron-job-is-not-the-profile](/blog/2026-09-03-cron-job-is-not-the-profile) — pinning, notepads, and continuity
- [/blog/2026-09-01-dont-block-the-loop-background-terminal](/blog/2026-09-01-dont-block-the-loop-background-terminal) — background terminal, notify, log, verify
- [/blog/2026-09-27-dont-wait-for-exit-heartbeat](/blog/2026-09-27-dont-wait-for-exit-heartbeat) — heartbeat on long terminal jobs
- [/blog/2026-09-15-if-the-skill-never-loads-it-doesnt-exist](/blog/2026-09-15-if-the-skill-never-loads-it-doesnt-exist) — skill loading is part of the job
- [Hermes cron reference](https://hermes-agent.nousresearch.com/docs/reference/cron-reference)
