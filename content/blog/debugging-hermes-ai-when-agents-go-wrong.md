---
slug: "debugging-hermes-ai-when-agents-go-wrong"
title: "Debugging Hermes AI: When Your Agent Goes Wrong and How to Fix It"
excerpt: "Agents don't always do what you expect. Learn how to read Hermes AI logs, diagnose hallucinated tool calls, recover from broken sessions, and build debugging skills that keep your workflows running."
date: "2026-05-26"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI", "Tutorial"]
tags: []
readTime: 10
originalUrl: "https://smfworks.com/blog/debugging-hermes-ai-when-agents-go-wrong"
canonicalUrl: "https://www.smfclearinghouse.com/blog/debugging-hermes-ai-when-agents-go-wrong"
---
# Debugging Hermes AI: When Your Agent Goes Wrong and How to Fix It

You've set up Hermes AI. You've built skills. You've automated your cron jobs. Everything is humming along — until it isn't.

The agent loops on the same error. A skill runs but produces garbage output. A cron job silently fails at 5 AM and you don't find out until noon. Your terminal session disconnects mid-task and you lose an hour of context.

This post is about what happens when things break, and the systematic approach I use to fix them. Because here's the truth: **agents fail. A lot.** The difference between someone who gives up on AI tooling and someone who ships with it is knowing how to debug.

## The Debugging Mindset

Before we get into specific tools and techniques, understand the mental model. Debugging an AI agent is not like debugging a Python script. Traditional debugging assumes:

1. **Deterministic execution** — same input, same output
2. **Clear error messages** — stack traces tell you what went wrong
3. **Reproducibility** — you can run it again and get the same failure

AI agents break all three. The same prompt can produce different results on each run. Error "messages" from an agent are often just the agent's interpretation of what happened — which may itself be wrong. And context window state is ephemeral; you can't always recreate the exact conditions.

So the debugging mindset shifts from "what went wrong?" to "what does the agent *think* went wrong, and why does it think that?"

This means reading the agent's output critically. When the agent says "I couldn't find the file," it might mean:
- The file genuinely doesn't exist
- The file exists but the agent searched the wrong directory
- The file exists, the agent found it, but a permission error prevented reading it
- The agent hallucinated the entire search and never actually ran `ls`

You need to verify, not trust.

## Where to Look: The Logs

Hermes AI logs everything. The primary log locations:

**Session logs** — every conversation, every tool call, every response:
```bash
~/.hermes/profiles/<profile>/sessions/
```

Each session is a JSON file containing the full message history. When something goes wrong, this is your first stop. Search for the session that corresponds to the failed task:

```bash
# Find recent sessions
ls -lt ~/.hermes/profiles/liam/sessions/ | head -10

# Search for error-related content
grep -l "ERROR\|failed\|timeout" ~/.hermes/profiles/liam/sessions/*.json
```

**Cron job logs** — scheduled task output and status:
```bash
# Check cron status
hermes cron list

# View most recent output for a specific job
hermes cron log <job-id> --last
```

Cron jobs log their full output. If a scheduled blog publish fails at 5 AM, the cron log will tell you exactly what the agent tried and where it broke.

**Skill execution** — when a skill fails, check its directory:
```bash
# Skills live here
~/.hermes/profiles/<profile>/skills/

# Check for error output in the session that ran the skill
```

## Common Failure Modes

Let me walk through the failures I see most often and how to fix each one.

### 1. The Infinite Loop

The agent keeps calling the same tool with the same arguments, getting the same result, and trying again. This usually happens when:

- The agent doesn't understand the error message from a tool
- The agent's context is too full to recognize it already tried this
- The success condition is ambiguous (the agent doesn't know what "done" looks like)

**Fix**: Kill the session and start fresh with a more specific prompt. Add an explicit exit condition: "Try up to 3 times, then stop and report what you found." For cron jobs, Hermes has built-in loop detection, but manual sessions can spiral.

**Prevention**: Write prompts with clear termination conditions. Instead of "fix the failing tests," say "fix the failing tests — run the test suite, identify failures, make fixes, re-run once to confirm. If tests still fail after one fix attempt, report back."

### 2. Hallucinated Tool Calls

The agent references files that don't exist, calls APIs with wrong parameters, or describes tool outputs that never happened. This is the agent filling in gaps with plausible-sounding fiction.

**How to spot it**: The agent says it "ran a command" or "checked a file" but the described output doesn't match reality. Cross-reference with session logs.

**Fix**: Don't argue with the agent. Instead, give it the ground truth directly: "The file is at /path/to/actual/file. Read it again." For recurring hallucination patterns, add the correct info to a skill so the agent always has it.

**Prevention**: Keep context lean. The more tokens in the context window, the more likely the agent is to hallucinate. Use skills to store facts rather than repeating them in prompts.

### 3. Context Window Overflow

The agent reads too many files, runs too many commands, and fills its context window. Symptoms: truncated responses, forgotten instructions from earlier in the session, or the agent "losing the thread."

**How to spot it**: The agent stops following instructions it clearly received earlier, or starts giving noticeably shorter, less detailed responses.

**Fix**: Start a new session. Seriously. There's no way to "compress" a context window mid-session. Copy the key findings from the old session into the new prompt and continue.

**Prevention**: This is exactly what the delegation system is for. Instead of one agent doing everything, spawn subagents for isolated tasks. The parent agent only sees the summary. Use `delegate_task` for research-heavy work, large refactors, or anything that involves reading more than 5-6 files.

### 4. Skill Failures

A skill loads but doesn't work — wrong commands, outdated paths, missing prerequisites.

**How to spot it**: The agent loads a skill (you'll see it in the session log) but then ignores it, or follows the skill but the commands fail.

**Fix**: Read the skill file yourself and verify it's current:
```bash
cat ~/.hermes/profiles/liam/skills/<category>/<skill-name>/SKILL.md
```

Check if the paths, commands, and API endpoints in the skill still exist. Skills go stale when the underlying tools change. Update the skill with `hermes skill edit` or edit the SKILL.md file directly.

**Prevention**: Add version checks or validation commands to your skills. A skill that checks `git --version` before running git commands will fail fast instead of silently.

### 5. Cron Job Silent Failures

A scheduled task runs at 5 AM, fails silently, and you don't discover it until hours later.

**How to spot it**: Check `hermes cron list` — the `last_status` column shows `error` for failed runs. The `last_run_at` timestamp tells you when it last attempted.

**Fix**: Read the cron log to see what happened. Common causes:
- Network timeouts (API calls to model providers)
- File path issues (the repo was moved or renamed)
- Authentication failures (expired tokens)
- Model errors (the provider is down or rate-limited)

**Prevention**: Use the `notify_on_complete` option for cron jobs. This sends you a message when the job finishes — success or failure. For critical daily tasks, add a simple health-check skill that verifies the infrastructure is reachable before the real job runs.

## Building a Debugging Skill

One of the most meta things you can do is build a debugging skill for your agent — a reusable set of diagnostic steps the agent can follow when something goes wrong. Here's a template:

```markdown
---
name: systematic-debugging
description: When encountering any bug, test failure, or unexpected behavior, follow this systematic approach.
---

## Step 1: Reproduce
- Run the failing command yourself
- Note the exact error message
- Check if it's deterministic (same input → same error?)

## Step 2: Isolate
- What changed since it last worked? Check git log.
- Can you reproduce with a minimal test case?
- Is the failure in your code, your config, or your environment?

## Step 3: Verify
- Check file paths actually exist
- Check environment variables are set
- Check that dependencies are installed and at the right versions

## Step 4: Fix and Confirm
- Make the smallest possible change
- Re-run the failing test/command
- Verify the fix didn't break anything else
```

This skill gives the agent a structured approach instead of thrashing. Most agent debugging failures come from the agent *not having a plan*, not from the agent being fundamentally broken.

## Session Recovery

Sometimes a session crashes — your terminal disconnects, the model provider times out, or the agent process gets killed. Here's what to do:

**1. Don't panic.** Hermes stores session state persistently. The conversation isn't lost.

**2. Search past sessions.** Use session search to find where you left off:
```bash
# From within Hermes
# Use session_search to find relevant past conversations
```

**3. Summarize and continue.** Start a new session with a brief summary of where you were:
> "I was in the middle of refactoring the auth module. I'd completed the token rotation logic but hadn't finished the session invalidation. The test suite passes for token rotation but I haven't written tests for invalidation yet. Continue from there."

**4. For cron jobs**, check the last run status and output. If the job partially completed (e.g., wrote the blog post but failed to push), you can pick up from the failure point rather than redoing everything.

## The Debugging Checklist

When something goes wrong with Hermes AI, run through this list:

| Check | How |
|-------|-----|
| Is the model provider up? | Try a simple prompt. Check provider status pages. |
| Are tool calls actually executing? | Read session logs — compare what the agent says it did vs. what the logs show. |
| Is the context window too full? | Start a new session and carry forward only the essentials. |
| Is the skill current? | Read the SKILL.md — are the commands and paths still valid? |
| Did the cron job run at all? | Check `hermes cron list` for last_run_at and last_status. |
| Are environment variables set? | Check `env | grep API_KEY` or whatever the skill requires. |
| Is there a known issue? | Check the Hermes AI GitHub issues or docs. |

## Closing Thoughts

Debugging AI agents is a different skill from debugging code. You're debugging *reasoning*, not just execution. The agent's outputs are suggestions, not ground truth. When something goes wrong, verify what the agent claims before you act on it.

The developers who get the most out of Hermes AI — the ones who ship daily with it — aren't the ones who never hit errors. They're the ones who know how to recover fast: read the logs, start a fresh session, give better prompts, update stale skills, and get back to work.

Your agent will fail. The question is whether you're back up in two minutes or two hours.

---

*This post is part of the Hermes AI series on Liam's Landing. Check out the [getting started guide](/blog/getting-started-with-hermes-ai-terminal-coding-partner), [custom skills tutorial](/blog/building-custom-hermes-ai-skills), [cron jobs automation](/blog/automate-your-dev-life-with-hermes-ai-cron-jobs), and [subagent delegation patterns](/blog/subagent-delegation-patterns-hermes-ai) for more.*