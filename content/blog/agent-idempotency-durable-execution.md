---
slug: "agent-idempotency-durable-execution"
title: "Agent Idempotency: Why Your Cron-Driven AI Agent Runs the Same Task Twice (and How to Stop It)"
excerpt: "Your autonomous agent fired the same deployment twice, published the same post twice, sent the same Slack message twice. The bug isn't the agent — it's the missing idempotency layer. A deep dive into making AI agent actions safe to retry: idempotency keys, deterministic planning, durable execution, and the lock patterns that actually work for LLM-driven workflows."
date: "2026-06-19"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["AI Engineering", "Hermes AI", "Software Architecture", "Production Engineering"]
tags: []
readTime: 12
image: "/images/blog/agent-idempotency-durable-execution.png"
originalUrl: "https://smfworks.com/blog/agent-idempotency-durable-execution"
canonicalUrl: "https://www.smfclearinghouse.com/blog/agent-idempotency-durable-execution"
---
# Agent Idempotency: Why Your Cron-Driven AI Agent Runs the Same Task Twice (and How to Stop It)

Last week one of our cron-driven agents published the same blog post twice. Same content, same hero image, same commit — two identical files in `content/blog/` with slugs that differed by one character. The second run happened because the first run's gateway process hit a transient 502 from the model provider, the cron scheduler retried the job four minutes later, and the agent — fresh session, no memory of the prior run — happily wrote the post again.

This wasn't an agent bug. The agent did exactly what it was told: "publish a blog post for today." It had no way to know it had already done it. The bug was in the *contract* between the scheduler and the agent: a non-idempotent operation being called by a system that assumes retries are safe.

If you're running autonomous agents on cron, on webhooks, on message queues, or on anything that can redeliver — and that's basically everything in production — idempotency is not a nice-to-have. It's the difference between an agent that's safe to retry and one that doubles your side effects every time something hiccups.

This post is the idempotency layer for AI agents: the patterns, the failure modes, and the code I actually run in production at SMF Works.

## Why Agents Are Worse Than Regular Cron Jobs

A traditional cron job runs a deterministic script. If it fails halfway through, you know exactly where it failed — the script exited with a non-zero code, the partial work is either committed or rolled back, and re-running it from the top is safe because the script was written with idempotency in mind (or it wasn't, and you learned the hard way).

An LLM-driven cron job is different in three ways that compound:

1. **The plan is non-deterministic.** Each invocation, the agent re-reasons from scratch. It may choose a different topic, a different approach, a different set of tools. You can't assume run N+1 will detect that run N already did the work — the agent has no memory of run N unless you give it one.

2. **The side effects are external.** Agents publish files, push commits, send messages, call APIs. These aren't transactional. There's no `ROLLBACK` for a pushed git commit or a sent Slack message.

3. **The failure surface is fuzzy.** A 502 from the model provider looks the same as a tool error looks the same as the agent giving up. The scheduler can't tell "the agent tried and failed to produce output" from "the agent produced output and then the network dropped." So it retries everything.

The result: any agent action that touches the outside world is a candidate for duplication unless you explicitly design it to be idempotent.

## The Three Levels of Agent Idempotency

Idempotency for agents isn't one technique — it's a stack. Each layer catches a different class of duplicate.

### Level 1: The Action Idempotency Key

Borrowed directly from payment systems. Before the agent performs an external side effect, it derives a unique key for that action and checks whether it has already performed it.

```python
import hashlib, json, os
from pathlib import Path

LEDGER = Path("~/.hermes/state/action-ledger.jsonl").expanduser()

def action_idempotency_key(action_type: str, payload: dict) -> str:
    """Stable hash of what the action intends to do."""
    canonical = json.dumps({"type": action_type, "payload": payload}, sort_keys=True)
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]

def already_done(key: str) -> bool:
    if not LEDGER.exists():
        return False
    for line in LEDGER.read_text().splitlines():
        if line.strip() and json.loads(line).get("key") == key:
            return True
    return False

def record_done(key: str, meta: dict) -> None:
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    with LEDGER.open("a") as f:
        f.write(json.dumps({"key": key, "ts": __import__("time").time(), **meta}) + "\n")
```

Before publishing a blog post, the agent checks:

```python
key = action_idempotency_key("publish_blog_post", {
    "date": "2026-06-19",
    "series": "liams-landing",
})
if already_done(key):
    print(f"Already published today's Liam's Landing post (key={key}). Skipping.")
    return
# ... perform the publish ...
record_done(key, {"slug": "agent-idempotency-durable-execution"})
```

The key insight: **the idempotency key is derived from the *intent*, not the output.** If you hash the final markdown content, a re-run produces slightly different prose and the key changes — defeating the purpose. Hash what the agent was *asked to do* (the date, the series, the task ID), not what it produced.

This catches the "same cron tick fires twice" case. It does not catch the case where the agent starts the work, crashes before recording completion, and the retry re-runs from scratch. For that you need level 2.

### Level 2: The Durable Execution Ledger

The action key tells you "this was done." The durable ledger tells you "this is *being done*, don't start it again." The distinction matters for long-running agent tasks — anything that takes more than a few seconds has a window where a retry will overlap with the in-flight run.

```python
import time, fcntl

LOCK_DIR = Path("~/.hermes/state/locks").expanduser()

def with_run_lock(job_id: str, ttl_seconds: int = 1800):
    """
    File-lock based mutex with a TTL.
    If the lock is held and fresh, the retry skips.
    If the lock is held but stale (older than TTL), the retry takes over.
    """
    LOCK_DIR.mkdir(parents=True, exist_ok=True)
    lockpath = LOCK_DIR / f"{job_id}.lock"
    lockfile = open(lockpath, "w")
    try:
        fcntl.flock(lockfile, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        # Lock held. Check if it's stale.
        age = time.time() - lockpath.stat().st_mtime
        if age < ttl_seconds:
            return None  # signal caller to skip
        # Stale lock — take it (in practice, use a newer lockfile)
        return None  # simplified; see repo for the full stale-claim logic
    lockpath.touch()
    return lockfile  # caller holds the lock until close
```

The TTL matters. Without it, a crashed agent leaves the lock held forever and the next run never fires. With it, a stale lock gets reclaimed after a reasonable timeout — long enough that a legitimately slow run isn't interrupted, short enough that a dead process doesn't block the schedule indefinitely.

For most agent workloads, I set the TTL to ~3x the expected run time. If a blog post takes 4 minutes to generate and publish, the TTL is 15 minutes. If the lock is still held after 15 minutes, something is wrong and the next run should take over.

### Level 3: Deterministic Plan Seeding

The hardest duplication to catch is *semantic* duplication: the agent runs twice, produces two different outputs, and both "count" as valid completions of the task. Two blog posts on different topics, both dated today. Two dependency audit reports with different findings. Two PR review comments on different files.

The ledger and the lock don't help here because the agent genuinely did different work. The fix is to **seed the agent's plan deterministically** so that two runs of the same task produce the same starting plan.

```python
# In the cron prompt template
task_seed = {
    "date": "2026-06-19",
    "day_of_week": "Friday",
    "format": "deep",
    "assigned_topic_bucket": "production-reliability",  # rotated deterministically
    "excluded_slugs": last_10_published_slugs(),  # so it doesn't repeat
}
prompt = f"""You are writing today's Liam's Landing post.
Date: {task_seed['date']} ({task_seed['day_of_week']})
Format: {task_seed['format']} (800-1500 words)
Topic bucket: {task_seed['assigned_topic_bucket']}
Do NOT write about any of these recently covered slugs: {task_seed['excluded_slugs']}
"""
```

The `assigned_topic_bucket` is the critical piece. It's derived from the date alone — not from the agent's whim. `topic_buckets[hash(date) % len(buckets)]`. Two runs on the same date get the same bucket. They may still produce different posts within that bucket, but you've collapsed the search space from "anything" to "one of N pre-assigned themes," which makes the action key much more effective at catching duplicates.

## The Trap: Idempotency Keys on Output

The most common mistake I see (and made myself, twice) is deriving the idempotency key from the agent's *output* instead of its *intent*.

```python
# WRONG — this will never deduplicate
key = action_idempotency_key("publish_blog_post", {
    "content": generated_markdown,  # changes every run
})
```

LLM output varies between runs even with temperature=0 — provider-side batching, minor token differences, and model version drift all introduce noise. If your key includes the output, every run looks unique and the ledger never catches the duplicate.

The fix is structural: **decide what the agent is going to do before you let it do it, and key on that decision.** For a blog post, that's `{date, series}`. For a deployment, that's `{service, environment, git_sha}`. For a PR review, that's `{repo, pr_number, commit_sha}`. These are stable identifiers that don't depend on the agent's reasoning.

## Where the Ledger Lives

The action ledger needs to survive agent restarts, gateway restarts, and machine reboots. A JSONL file on disk works for single-host setups and is what I use in production. For multi-host or distributed agent fleets, you need a shared store — Redis, a database table, or even an S3 object with a conditional PUT. The pattern is identical; only the storage backend changes.

One non-obvious requirement: **the ledger write must happen before the side effect, not after.** If you write to the ledger after the git push, a crash between the push and the write leaves you with a published post and no ledger entry — and the retry publishes again. Write the ledger entry first (marked "in_progress"), perform the side effect, then update the entry to "done." If a retry sees "in_progress" with a fresh timestamp, it skips. If it sees "in_progress" with a stale timestamp, it takes over.

## Putting It Together: A Cron Job That's Safe to Retry

Here's the shape of every cron-driven agent task I run at SMF Works:

```python
def run_blog_cron():
    job_id = f"liams-landing-{date_today()}"
    key = action_idempotency_key("publish_blog_post", {
        "date": date_today(), "series": "liams-landing"
    })

    # 1. Already completed? Skip.
    if already_done(key):
        return {"status": "skipped", "reason": "already_published"}

    # 2. Already in flight? Skip.
    lock = with_run_lock(job_id, ttl_seconds=900)
    if lock is None:
        return {"status": "skipped", "reason": "in_flight"}

    # 3. Record intent before side effects.
    record_done(key, {"status": "in_progress", "started": time.time()})

    try:
        # 4. Deterministic seed so a re-run produces the same plan.
        plan = build_deterministic_plan(date_today())
        # 5. Agent does the work.
        result = agent.run(plan)
        # 6. Mark complete.
        update_done(key, {"status": "done", "slug": result.slug})
    except Exception as e:
        # 7. On failure, mark failed — don't delete the entry.
        # The retry will see it's not "done" and can take over,
        # but the in_progress timestamp prevents overlap.
        update_done(key, {"status": "failed", "error": str(e)})
        raise
    finally:
        lock.close()
```

Every layer has a job. The `already_done` check catches the "scheduler retried after success" case. The lock catches the "scheduler retried while in-flight" case. The deterministic seed catches the "agent produced different output on retry" case. The before-side-effect ledger write catches the "crash between side effect and record" case.

## When You Don't Need All Three

Not every agent task needs the full stack. A quick read-only analysis (summarize today's logs, generate a daily metrics report) has no external side effects — a duplicate run just wastes compute. Skip the ledger and the lock; the cost of a duplicate is a few cents of API spend.

The full stack is for **write operations that touch systems you can't easily undo**: publishing content, pushing commits, sending messages to humans, modifying databases, deploying code. For those, the cost of a duplicate is reputational or operational, and the three-layer stack pays for itself the first time a 502 makes your scheduler retry.

## The Meta-Lesson

The hardest part of agent idempotency isn't the code — it's accepting that **your agent is not the source of truth for what has been done.** The agent's context window is ephemeral. Its session is ephemeral. Its memory is best-effort. The only durable record of "did this task complete" is the one you build outside the agent, in a ledger the agent reads but doesn't own.

Treat the agent as a stateless function. Treat the scheduler as unreliable. Put the truth in a file. That's the whole pattern — and it's the difference between an agent you can safely retry at 3 AM and one you have to babysit.

---

*This post is part of the [Liam's Landing](/liams-landing) series on AI engineering, multi-agent systems, and shipping production code with Hermes AI. Follow along at [smfworks.com](https://smfworks.com).*