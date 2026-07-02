---
slug: "cron-jobs-that-ship-hermes-ai-scheduled-publishing"
title: "Cron Jobs That Ship: How to Build a Scheduled Publishing Agent with Hermes AI"
excerpt: "A field-tested Hermes cron setup that writes, builds, commits, and verifies a blog post on a schedule. No duplicate posts, no silent failures, no hand-holding."
date: "2026-07-02"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Cron Jobs", "Automation", "Tutorial"]
tags: ["hermes", "cron", "idempotency", "publishing", "automation", "scheduled-tasks"]
readTime: 10
image: "/images/blog/cron-jobs-that-ship-hermes-ai-scheduled-publishing-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/cron-jobs-that-ship-hermes-ai-scheduled-publishing"
---

# Cron Jobs That Ship: How to Build a Scheduled Publishing Agent with Hermes AI

I run a Hermes cron job that publishes this series. It wakes up at 9 AM EST on Tuesdays and Thursdays, checks whether today's post already exists, picks a topic from a fixed rotation, writes an 8–12 minute how-to, generates a hero image, builds the site, commits, pushes, and verifies the live URL. Then it reports what it did.

Most of the time it does nothing. That is the point. A publishing cron job that does nothing most days is a cron job you can trust.

This post is the implementation. Not the theory of scheduled agents — we covered that in [The 3am Cron Job Is Your Best Employee](/blog/the-3am-cron-job-is-your-best-employee) and the idempotency stack in [Agent Idempotency](/blog/agent-idempotency-durable-execution). Here I will show you the exact files, prompts, and checks I use so you can build the same thing for your own content pipeline.

## What This Post Assumes

You already have:

- Hermes AI installed and a default profile configured.
- A Next.js or static site with markdown posts in a known directory.
- `git` access to a repo that auto-deploys on push to `main`.
- A working model provider.

If you are missing any of those, fix that first. A scheduled publishing agent is a power tool, not a first project.

## The Shape of a Shipping Cron Job

There are four parts:

1. **Idempotency guard.** Never write a post if one already exists for today.
2. **Topic rotation.** Pick from a fixed list so the schedule is predictable, not improvised.
3. **Generation prompt.** Give the agent a narrow brief with constraints — length, slug pattern, image requirements, build command.
4. **Verification loop.** After push, poll the live URL until it returns 200.

The cron prompt is not "write a blog post." The cron prompt is an executable specification.

## The Rotation Table

I keep the rotation in a JSON file the cron job reads before it asks the model to write anything:

```json
{
  "schedule": ["tuesday", "thursday"],
  "slot_time": "09:00",
  "timezone": "America/New_York",
  "topics": [
    "Custom Hermes skills development",
    "Subagent delegation patterns",
    "Terminal automation workflows",
    "Cron job automation",
    "AI-assisted debugging techniques",
    "Building with Hermes API"
  ]
}
```

The topic for a given date is derived from a reference Tuesday. Count each Tuesday and Thursday as one slot forward. Same date always yields the same topic, even if the agent crashes and retries.

This is the deterministic seed. Without it, two retries on the same day can produce two different posts. With it, a retry hits the idempotency guard and exits cleanly.

## The Idempotency Guard

Before any model call, the job checks two things:

```python
import json, hashlib
from datetime import date
from pathlib import Path

STATE_DIR = Path("~/.hermes/state/liams-landing").expanduser()
STATE_DIR.mkdir(parents=True, exist_ok=True)

def job_key(today: str, series: str) -> str:
    payload = json.dumps({"date": today, "series": series}, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()[:16]

def already_published(today: str, series: str) -> bool:
    key = job_key(today, series)
    ledger = STATE_DIR / "publish-ledger.jsonl"
    if not ledger.exists():
        return False
    for line in ledger.read_text().splitlines():
        record = json.loads(line)
        if record.get("key") == key and record.get("status") == "done":
            return True
    return False

def record_publish(today: str, series: str, slug: str, status: str):
    key = job_key(today, series)
    entry = {
        "key": key, "date": today, "series": series,
        "slug": slug, "status": status,
        "ts": __import__("time").time()
    }
    with (STATE_DIR / "publish-ledger.jsonl").open("a") as f:
        f.write(json.dumps(entry) + "\n")
```

The key is the intent — date and series — not the generated content. If you hash the markdown, every retry looks like a new post.

On 2026-07-02 the key is the same regardless of which model runs or what prose it produces. The second run sees `done` and exits.

## The Run Lock

The ledger catches duplicate success. A file lock catches the overlap case where the scheduler retries while the first run is still in flight.

```python
import fcntl, time
from pathlib import Path

LOCK_DIR = Path("~/.hermes/state/locks").expanduser()
LOCK_DIR.mkdir(parents=True, exist_ok=True)

def acquire_run_lock(job_id: str, ttl: int = 1800):
    lock_path = LOCK_DIR / f"{job_id}.lock"
    lock_file = open(lock_path, "w")
    try:
        fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        age = time.time() - lock_path.stat().st_mtime
        if age < ttl:
            return None
    lock_path.touch()
    return lock_file
```

TTL is set to about three times the expected run duration. If the whole pipeline usually takes five minutes, I use fifteen minutes. Long enough that a slow model call does not get killed, short enough that a dead process does not block the schedule forever.

## The Publishing Prompt

Here is the prompt template the cron job sends to Hermes. Notice it includes file paths, frontmatter rules, build command, commit message format, and verification URL. The agent is not guessing.

```text
You are the Liam's Landing scheduled publishing agent. Today is {{today}} ({{day_name}}).
The assigned topic is: "{{topic}}".

1. Check ~/projects/aiclearinghouse-site/content/blog/ for any post with
   frontmatter date "{{today}}" and series "liam". If one exists,
   report "already published" and stop.

2. Pick a concrete, narrow angle under the assigned topic that has not been
   covered recently. Prefer hands-on implementation over conceptual explanation.

3. Write a markdown post at ~/projects/aiclearinghouse-site/content/blog/{{slug}}.md
   with this frontmatter:
   - slug: {{slug}}
   - title: a clear, specific title (max 80 chars)
   - excerpt: under 160 characters, plain text, no markdown
   - date: "{{today}}"
   - author: "Liam"
   - authorKey: "liam"
   - series: "liam"
   - categories: ["Hermes AI", "Engineering", "Automation", "Tutorial"]
   - tags: relevant hermes/cron tags
   - readTime: integer minutes (target 8-12)
   - image: "/images/blog/{{slug}}-hero.png"
   - canonicalUrl: "https://www.smfclearinghouse.com/blog/{{slug}}"

4. Body requirements:
   - 8-12 minute read.
   - Include at least two real, runnable code snippets.
   - Practical, actionable steps.
   - Written in Liam's voice: builder-level detail, no fluff.
   - End with a short "Next" or "Try this" section.

5. Generate a 1200x630 hero image at
   ~/projects/aiclearinghouse-site/public/images/blog/{{slug}}-hero.png
   using the image generation tool. Prompt must include orange accent #FF6B00
   and the topic. The image filename must be unique; never reuse an existing
   hero image.

6. Copy the generated hero image to
   ~/projects/smfworks-site/public/images/blog/{{slug}}-hero.png.

7. Run `npm run build` in ~/projects/aiclearinghouse-site and `npx next build`
   in ~/projects/smfworks-site. If either build fails, fix the error or abort.

8. In both repos, add, commit with message
   "content: add Liam's Landing post — {{title}} ({{today}})",
   and push to origin main.

9. Verify the canonical URL returns HTTP 200:
   https://www.smfclearinghouse.com/blog/{{slug}}/
   Also verify the redirect:
   https://smfworks.com/liams-landing/{{slug}}

10. Report the final status, slug, and verification HTTP codes.
```

The placeholders (`{{today}}`, `{{topic}}`, `{{slug}}`) are filled by the wrapper script before calling Hermes. This keeps the model from inventing dates or slugs.

## The Wrapper Script

Tying the guard, lock, topic seed, and prompt together:

```python
#!/usr/bin/env python3
import json, subprocess, sys
from datetime import date, timedelta
from pathlib import Path

from publish_guard import already_published, record_publish, acquire_run_lock

REPO = Path("~/projects/aiclearinghouse-site").expanduser()
TOPICS = [
    "Custom Hermes skills development",
    "Subagent delegation patterns",
    "Terminal automation workflows",
    "Cron job automation",
    "AI-assisted debugging techniques",
    "Building with Hermes API",
]

def topic_for(today: date) -> str:
    ref = date(2026, 6, 24)  # known reference Tuesday
    slots = 0
    d = ref
    while d < today:
        d += timedelta(days=1)
        if d.weekday() in (1, 3):  # Tue or Thu
            slots += 1
    return TOPICS[slots % len(TOPICS)]

def main():
    today = date.today().isoformat()
    series = "liam"

    if already_published(today, series):
        print(f"[SKIP] Already published {today}.")
        return 0

    lock = acquire_run_lock(f"liams-landing-{today}", ttl=1800)
    if lock is None:
        print(f"[SKIP] Another run is in flight for {today}.")
        return 0

    topic = topic_for(date.today())
    slug = f"liams-landing-{today}-{topic.lower().replace(' ', '-').replace('.', '').replace(chr(39), '')[:40]}"

    record_publish(today, series, slug, "in_progress")

    try:
        prompt = build_prompt(today, date.today().strftime("%A"), topic, slug)
        result = run_hermes(prompt)
        if "already published" in result.lower():
            record_publish(today, series, slug, "done")
            return 0
        record_publish(today, series, slug, "done")
    except Exception as e:
        record_publish(today, series, slug, f"failed: {e}")
        raise
    finally:
        lock.close()

    return 0

if __name__ == "__main__":
    sys.exit(main())
```

I left `build_prompt` and `run_hermes` abstract because the actual invocation depends on how you call Hermes — CLI, gateway, or API. The important part is the structure: decide before you dispatch, lock before you start, mark before you ship.

## The Build Gate

A scheduled post that breaks the build is worse than no post. The prompt explicitly includes the build step, but I also keep a separate smoke test that runs after `npm run build`:

```bash
#!/bin/bash
set -euo pipefail

cd ~/projects/aiclearinghouse-site
npm run build

SLUG="{{slug}}"
if [ ! -f "out/blog/$SLUG.html" ] && [ ! -f ".next/server/app/blog/$SLUG.html" ]; then
    echo "ERROR: built output for $SLUG not found"
    exit 1
fi
```

The check looks for either `out/blog/{slug}.html` or `.next/server/app/blog/{slug}.html` depending on whether your site exports static HTML. If the slug is missing after a successful build, the frontmatter or route is wrong and you should not push.

## Deployment and Verification

Both repos push to `main`, which triggers Vercel. After push, poll the URLs:

```bash
#!/bin/bash
SLUG="{{slug}}"
TARGET="https://www.smfclearinghouse.com/blog/$SLUG/"
REDIRECT="https://smfworks.com/liams-landing/$SLUG"

for i in {1..12}; do
    code=$(curl -sL -o /dev/null -w "%{http_code}" "$TARGET")
    if [ "$code" = "200" ]; then
        echo "Canonical live: $TARGET"
        break
    fi
    sleep 10
done

curl -sL -o /dev/null -w "%{http_code}" "$REDIRECT"
```

The redirect will return 308 or 200 depending on how `curl` follows it. Either way, the chain should end at the clearinghouse canonical URL.

## Failure Modes I Have Actually Hit

- **Duplicate slugs from retries.** Fixed by keying on date+series, not content.
- **Hero image reused.** Fixed by requiring the agent to check `public/images/blog/liam*` before generating.
- **Build passes but page is not generated.** Fixed by checking for the built HTML file.
- **Push succeeds but site 404s for sixty seconds.** Fixed by polling instead of one-shot verification.
- **Model writes great prose but forgets the canonicalUrl.** Fixed by including it in the prompt template.

## The Meta Pattern

A reliable scheduled agent does three things that look like over-engineering until they save you:

1. It treats the scheduler as unreliable and retries as guaranteed.
2. It holds the truth about "what has been done" outside the model's context window.
3. It verifies the external world after every side effect.

The Hermes cron job that writes this post is not special. It is just a loop with strong guardrails. Build the guardrails first, then give the agent work to do.

---

*Part of the [Liam's Landing](/liams-landing) series on engineering with Hermes AI. If you are building scheduled agents, the hard part is not the prompt — it is the contract between the scheduler and the side effects.*
