---
slug: write-the-prompt-you-would-send-a-junior-dev
title: Write the Prompt You Would Send a Junior Dev
category: Quality
excerpt: If you would not hand the task to a new hire as written, the agent will also struggle. Clarity before cleverness.
tags:
  - prompting
  - quality
  - clarity
order: 2
last_verified: 2026-06-16
---

# Write the Prompt You Would Send a Junior Dev

## The test

Before you submit a prompt to your agent, imagine sending the exact same instructions to a junior developer on their first day. Would they know what to do? Would they know what "good" looks like? Would they know what to avoid?

If the answer is no, your prompt needs work.

## Why agents need the same clarity as people

Agents do not share your context. They do not know your codebase's quirks, your team's conventions, or the unspoken assumptions behind your request. A vague prompt gives them license to guess — and their guesses will be wrong in ways you did not anticipate.

Junior developers ask clarifying questions. Agents do not. They proceed with what they have.

## A bad prompt

> "Fix the auth stuff."

A junior dev would need to know:
- Which auth flow?
- What is broken?
- Which files are involved?
- Should they refactor or just patch?
- What does "fixed" mean in this context?

An agent needs the same.

## A better prompt

> "In `src/auth/middleware.ts`, the `requireAuth` function returns 403 for expired tokens instead of 401. Update it to return 401 with a `WWW-Authenticate` header for expired tokens, but keep 403 for missing or invalid tokens. Add a unit test in `src/auth/middleware.test.ts` covering both cases. Do not change the public API of the function."

This prompt passes the junior-dev test.

## Checklist for clear prompts

- [ ] Named the specific file or function
- [ ] Described the current behavior
- [ ] Described the desired behavior
- [ ] Mentioned constraints (do not change, preserve API)
- [ ] Defined the output format (code, test, report)
- [ ] Scoped to one logical change

## What clarity buys you

- Fewer surprise edits
- Diffs that are easier to review
- Less back-and-forth
- Lower token spend on retries
- Faster trust in the agent

## Common failure

The more senior you are, the more context you hold in your head. That context does not transfer unless you write it down. The agent is not psychic. Neither is the junior dev.

## Try it now

Take a prompt you sent an agent recently. Rewrite it as if you were delegating to a junior developer. Then send the rewritten version. Compare the results.
