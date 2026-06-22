---
slug: "debugging-with-ai-agents-hermes"
title: "Debugging with an AI Agent: How Hermes Finds Bugs I Would Have Missed"
excerpt: "A real-world walkthrough of debugging a production issue using Hermes AI — from reading stack traces to isolating race conditions, and the debugging patterns that actually work when you pair human intuition with machine speed."
date: "2026-05-26"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Tutorial"]
tags: []
readTime: 12
originalUrl: "https://smfworks.com/blog/debugging-with-ai-agents-hermes"
canonicalUrl: "https://www.smfclearinghouse.com/blog/debugging-with-ai-agents-hermes"
---
# Debugging with an AI Agent: How Hermes Finds Bugs I Would Have Missed

Here's what nobody tells you about debugging with AI: it's not about asking the agent to find your bug. It's about building a feedback loop where the agent runs the experiments you don't have patience for, and you provide the intuition the agent doesn't have.

I've been debugging production issues with Hermes for months now. This post is a walkthrough of how that actually works — the patterns, the dead ends, and the moments where the agent catches something I'd have missed entirely.

## The Setup: A Real Bug

Last week, a cron job in our pipeline started silently failing. No error output, no non-zero exit code — just no results in the database. The job had been running fine for weeks. Nothing in the deploy log changed. Classic.

Here's what the cron job looked like:

```bash
# Health check job — runs daily at 8 AM
0 8 * * * /home/user/scripts/health-check.sh >> /var/log/health.log 2>&1
```

Simple, right? A shell script that hits an API, parses the response, and writes a row to the database. Except one day it stopped writing rows. The log file was empty. No errors. No output at all.

This is exactly the kind of bug where an AI agent shines — because the fix requires reading multiple files, checking config, running commands, and correlating timestamps. Not hard, but tedious. And tedium is where humans skip steps.

## Pattern 1: Start with the Stack Trace (or Lack Thereof)

First thing I do with Hermes: dump the evidence.

```
> Read /var/log/health.log and tell me the last 20 lines
```

Empty. The log file existed but had zero bytes.

```
> Run: journalctl -u cron --since "3 days ago" | grep health-check
```

That's when Hermes found it — the job was running, but the shell script it was calling had a shebang pointing to a Python binary that got upgraded overnight:

```bash
#!/usr/bin/env python3.11
```

The system had Python 3.12 now. The script's virtualenv was still pointing at 3.11. The shebang resolved to a binary that no longer existed. The script exited silently with code 127 (command not found), which the `2>&1` redirect swallowed because the shell interpreter itself failed before producing any output.

**The insight**: Hermes didn't just read the script. It checked what `python3.11` resolved to, found it was a broken symlink, and traced it to a system upgrade that happened three days prior. I'd have eventually figured that out — but it would have taken me 45 minutes of head-scratching. It took the agent 12 seconds.

## Pattern 2: The Bisect

Sometimes the bug isn't in one file. It's in the interaction between two changes that happened days apart. When that happens, I use what I call the "bisect pattern" — named after `git bisect`, because it's the same idea.

**How it works:**

1. Find the last known-good commit and the first known-bad commit.
2. Ask the agent to check out each one and run the failing test.
3. Narrow the window until you've isolated the breaking change.

Here's how that looks in practice:

```
> I know this test passed at commit a3f7c2d and fails at d8e1b4f.
  Check out the midpoint commit and run: npm test -- --grep "pipeline sync"
  Tell me if it passes or fails.
```

Hermes runs the test, reports the result, and I give the next instruction. Usually 3-4 bisection steps and we've found the exact commit that introduced the regression.

**Why this matters**: `git bisect` exists, but it can't run a full test suite that takes 20 minutes per iteration. With Hermes, I can go do something else while each bisection step runs. The agent handles the boring part.

## Pattern 3: The Reproduce-Then-Trace Loop

The hardest bugs are the ones you can't reproduce on demand. Race conditions, timing issues, state-dependent failures that only happen every 100th run.

For these, I set up a reproduce loop and let the agent watch:

```
> Run this test 50 times in a loop and capture any failures:
  for i in $(seq 1 50); do
    npm test -- --grep "concurrent write" 2>&1 | tee -a /tmp/test-run-$i.log
  done
  Report which iterations failed and what the error was.
```

Hermes runs all 50 iterations, reads through the logs, and tells me exactly which iterations failed and what the error patterns were. From there, I can see it's a race condition — certain timing windows trigger the failure.

**The key principle**: You provide the hypothesis ("this only fails under concurrent writes"). The agent provides the brute force. You converge on the answer faster than either of you could alone.

## Pattern 4: The Dependency Audit

Ever had a bug caused by a transitive dependency update? A patch release in `event-stream` or `left-pad` that silently changed behavior?

When I suspect a dependency issue, I have Hermes run the audit:

```
> Compare package-lock.json between the last known-good branch and current.
  List every dependency that changed, including transitive deps.
  For each one, check the changelog on GitHub and flag any breaking changes.
```

This would take me 30-45 minutes manually. Hermes does it in under a minute. And it catches things I'd miss — like when a minor version bump of a sub-dependency changes default behavior.

## Pattern 5: The Smoke Test After the Fix

Once I've identified and fixed the bug, I don't just run the original failing test. I ask Hermes to write and run a regression test:

```
> The bug was: health-check.sh failed silently when python3.11 was removed.
  Write a regression test that:
  1. Creates a temporary script with a broken shebang
  2. Runs it with shell redirection
  3. Asserts the failure is visible (non-zero exit code or stderr output)
  Save it as tests/regression/broken-shebang-detection.test.sh
```

This does two things. First, it makes sure the fix actually works. Second, it creates a permanent guard against the same class of bug happening again.

## What Hermes Is Bad At

Let's be honest about the limitations:

1. **UI debugging.** If the bug is "the button is 3px too far left," the agent can't see it. You need visual debugging tools for that.

2. **Intermittent issues that require hours of observation.** If a bug only shows up once every 8 hours under production load, the agent can help analyze logs — but it can't sit there watching a live system for 8 hours any better than you can.

3. **Architectural decisions hidden in bugs.** Sometimes a bug reveals that your architecture is wrong. The agent can surface the symptoms, but deciding whether to refactor or patch requires human judgment.

4. **Context-heavy bugs.** "This feature doesn't match what the customer asked for" — that's a product problem, not a debugging problem. The agent can help implement the fix, but you need to define what "correct" looks like.

## The Real Workflow

Here's what a typical debugging session with Hermes actually looks like:

```
Me:     The /api/sync endpoint is returning 500s intermittently.
        Here's the stack trace from Sentry.

Hermes: I see three likely causes. Let me check each one...
        [reads code, runs queries, checks logs]

Hermes: The issue is a null pointer in the sync handler — when the
        upstream service returns an empty response, the parser
        dereferences without checking. The fix is on line 147 of
        sync-handler.ts. Want me to patch it?

Me:     Yes, and add a test that covers the empty response case.

Hermes: [patches code, writes test, runs suite, confirms green]

Me:     Ship it.
```

Total time: maybe 10 minutes. Without the agent? I'd be reading stack traces for 20 minutes, then spending another 30 tracing through the codebase to find the exact line. The fix itself is a one-liner. The debugging is the time sink — and that's exactly what the agent accelerates.

## Debugging Prompts That Actually Work

After months of this, here are the prompts that consistently produce good results:

### The Evidence Dump
```
Here's what I know:
- Error message: [paste]
- Last thing that changed: [describe]
- What I've already tried: [list]

Find the root cause.
```

### The Comparison
```
This worked at commit X and broke at commit Y.
What changed between those two commits that could explain this behavior?
```

### The Hypothesis Check
```
I think this bug is caused by [your theory].
Check these files for evidence that supports or contradicts this:
- [list relevant files]
```

### The Brute Force Reproduce
```
Run this test N times and report which iterations fail.
Look for patterns in the failures — timing, order, state.
```

### The Regression Guard
```
The bug was [describe]. Write a test that would have caught this.
Make it fast — no external dependencies, no network calls.
```

## Closing Thought

Debugging with an AI agent isn't about replacing your debugging skills. It's about amplifying them. The agent handles the tedious parts — running experiments, reading logs, bisecting commits — while you focus on the part that actually requires judgment: forming hypotheses and deciding which experiments to run next.

The best debuggers I know aren't the ones who read stack traces fastest. They're the ones who ask the right questions. With Hermes, I ask better questions because I get answers faster, and I can test more hypotheses in the same amount of time.

If you're not using an agent for debugging yet, start with something small — a flaky test, a weird error message, a dependency audit. You don't need to hand over your entire workflow on day one. Just find one tedious step and let the agent carry that weight.

You'll be surprised how fast it adds up.

---

*This is part of Liam's Landing, a blog series from Liam Hermes, Chief Development Officer at The SMF Works Project. Follow along for weekly deep-dives into building with AI agents — from the trenches, not the whiteboard.*