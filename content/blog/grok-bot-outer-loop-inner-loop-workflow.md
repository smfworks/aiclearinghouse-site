---
slug: "grok-bot-outer-loop-inner-loop-workflow"
title: "The Outer Loop / Inner Loop Trick That Makes Grok Bot 10x More Effective"
excerpt: "Most people hand one Grok Bot a task and hope for the best. The real power move is splitting context-gathering from execution — an outer-loop bot that researches, and inner-loop specialists that build. Here's exactly how to set it up."
date: "2026-09-14"
author: "Wesley Williams"
authorKey: "wesley"
series: "clearinghouse"
categories: ["AI", "Agent Workflows", "Productivity"]
tags: ["grok-bot", "multi-agent", "workflow", "xAI", "agent-orchestration"]
readTime: 8
image: "/images/blog/grok-bot-outer-loop-inner-loop-workflow.png"
---

Grok Bot is xAI's always-on AI teammate. It has its own cloud computer, signs into your tools, and finishes jobs end to end. You message it like a colleague — no workflow builder, no node-and-edge canvas, no JSON config. Just chat.

That simplicity is a double-edged sword. Because it's so easy to start, most people do the obvious thing: they create one bot, hand it everything, and wonder why the output degrades on complex multi-step tasks. The bot reads Slack, browses Notion, scrolls GitHub, writes a prompt, and then tries to execute — all in the same conversation. By the time it reaches the actual work, its context window is stuffed with navigation noise, intermediate reasoning, and half-explored dead ends.

There's a better way. It comes straight from the SpaceXAI team's own playbook, and it's the single most impactful workflow tip I've found for Grok Bot.

## The Problem: Dirty Context

Here's what happens when you ask a single bot to do a complex job end to end:

1. **It gathers context.** It reads files, checks Slack threads, scans docs, opens URLs. Each step dumps tokens into the context window — most of which are irrelevant to the final task.
2. **It reasons about what to do.** It debates approaches, considers alternatives, rejects dead ends. More tokens. More noise.
3. **It executes.** By now the context window is polluted. The bot is working from a position of "I read 47 things and here's what I remember" rather than "here is a clean, focused prompt."

This is what the SpaceXAI team calls **dirty context** — the accumulation of exploration artifacts in the same context that does the execution. It's the same reason you wouldn't write a production deploy script in the same shell session where you just `grep`ed through 30 log files. The garbage compounds.

## The Trick: Split Outer Loop from Inner Loop

The fix is to use **two types of bots** with a clean handoff between them:

### The Outer-Loop Bot (Researcher / Orchestrator)

This bot's entire job is to **gather and synthesize context**. It reads Slack, Notion, GitHub, docs, emails — whatever sources are relevant. It figures out what actually needs to be done. Then it writes a **clean, self-contained prompt** and hands it off.

It never executes the actual work. It never writes the code, files the ticket, or sends the email. It is a specialist in *understanding the problem*.

**Example outer-loop bot setup:**

```
Name: Context Scout
Title: Research and synthesize before delegation
Description: You are a research specialist. Your job is to gather
context from Slack, Notion, GitHub, and docs. You read threads,
scan code, and understand requirements. You NEVER execute the
actual task. Instead, you produce a clean, self-contained prompt
that contains everything a specialist bot needs to do the job —
no more, no less. Hand that prompt to the appropriate specialist.
```

### The Inner-Loop Bot (Executor / Specialist)

This bot receives a **clean prompt** with all the context it needs — and nothing it doesn't. It starts fresh, focused, and executes the work. Because its context window isn't polluted with exploration, it produces higher-quality output.

**Example inner-loop bot setup:**

```
Name: Code Builder
Title: Execute coding tasks from clean prompts
Description: You receive fully-specified prompts from Context
Scout. You do not research or explore. You execute: write code,
run tests, open PRs. If the prompt is missing something, ask
Context Scout rather than going to find it yourself.
```

### The Handoff

The magic is in the handoff. The outer-loop bot produces a prompt that is:

- **Self-contained** — the executor doesn't need to re-read any sources
- **Focused** — only the information relevant to the task, not everything that was explored
- **Actionable** — clear steps, acceptance criteria, and constraints

This is the same principle behind good delegation between humans. A senior engineer doesn't dump their entire browser history on a junior developer and say "figure it out." They write a ticket with context, requirements, and constraints. The outer-loop bot does the same thing for the inner-loop bot.

## How to Set It Up in Grok Bot

Grok Bot supports **multi-bot chains** — bots can message each other and trigger each other. Here's the step-by-step:

1. **Create your outer-loop bot.** Give it access to your knowledge sources (Slack, Notion, GitHub, Google Drive via MCP connections). Set its description to emphasize that it researches and writes prompts — it does not execute.

2. **Create one or more inner-loop specialist bots.** These should have access to the tools needed for execution (Cursor, GitHub, email, etc.) but their instructions should say: "You receive prompts from [outer-loop bot name]. Execute them. Don't explore."

3. **Chain them together.** In Grok Bot, you can place bots in a group chat where they coordinate, or you can set up a routine where the outer-loop bot routes work to specialists.

4. **Set permissions appropriately.** The outer-loop bot might only need read access to most tools. The inner-loop specialists need write access. Use Grok Bot's natural-language permission rules to enforce this — for example: "Context Scout may read Slack, Notion, and GitHub but may not send messages or push code."

5. **Iterate on the handoff prompt.** The first few times, check what the outer-loop bot is passing to the executor. Is it too vague? Too verbose? Missing constraints? Refine the outer-loop bot's instructions until the handoff prompts are consistently clean and actionable.

## A Real Example: Bug Triage Pipeline

Here's how this looks in practice for a software team:

**You message your outer-loop bot:** "There's a report that the login page crashes on Safari. Figure out what's going on and get it fixed."

**The outer-loop bot:**
- Searches Slack for recent login-related complaints
- Checks GitHub issues for Safari/CK login bugs
- Reads the relevant code files and recent commits
- Reproduces the issue description from the reports
- Writes a clean prompt: *"The login page throws a TypeError in Safari 17 when the password field is empty. The bug is in `auth/handler.ts` line 42 — `password.trim()` fails because Safari returns `null` for empty input fields. Fix: add a null check before `.trim()`. Add a test case for empty password submission. Target branch: `fix/safari-login-crash`."*

**The inner-loop code bot:**
- Receives the prompt
- Creates the branch
- Makes the one-line fix
- Writes the test
- Opens the PR
- Reports back with the PR link

The outer-loop bot did the detective work. The inner-loop bot did the surgery. Neither was burdened with the other's context.

## Why This Works So Well

The outer-loop / inner-loop pattern works because it respects a fundamental constraint of LLMs: **context windows are finite, and signal-to-noise ratio matters**. Every token of irrelevant context in the window dilutes the model's attention on what actually matters.

By splitting the work:

- **The researcher** can be thorough — read 20 files, explore 5 dead ends, check 3 Slack channels. None of that noise reaches the executor.
- **The executor** starts with a clean slate and maximum attention budget focused on the task.
- **Both bots get sharper over time.** The researcher learns what context the executor needs. The executor learns your coding style and PR conventions. They improve independently.
- **You can swap specialists.** Need a different executor for a different kind of task? The outer-loop bot just routes to a different specialist. The research doesn't need to be redone.

## Beyond Two Bots: The Chief of Staff Pattern

Once you're comfortable with the two-bot split, you can extend it. The SpaceXAI team uses a **chief of staff** pattern: one orchestrator bot sits on top, with multiple specialists below it — one for inbox, one for code, one for research, one for operations.

The chief of staff is the ultimate outer-loop bot. It triages incoming work, decides which specialist should handle it, gathers the minimum context needed, and routes. You only talk to the chief of staff. The specialists never talk to you directly.

This scales. Instead of managing five bots, you manage one. The chief of staff manages the other four. And because each specialist has a clean context window focused on its domain, each one produces better work than a single generalist bot trying to do everything.

## Getting Started

You don't need a complex setup to try this. Create two bots today:

1. A **scout** that reads your tools and writes clean prompts
2. A **builder** that receives those prompts and executes

Give the scout a real task — "research the next feature we should build, based on customer feedback in Slack and support tickets." Check the prompt it produces. Hand it to the builder. Compare the result to what you'd get from a single bot doing both.

The difference will be obvious. And once you see it, you won't go back to the single-bot approach for anything complex.

---

Grok Bot's biggest strength is that it feels effortless to start. Its biggest trap is that the effortless path — one bot, one chat, everything in one context — is the wrong architecture for real work. Split your loops, keep your context clean, and watch the quality of output transform.