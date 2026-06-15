---
slug: start-with-a-thin-prompt
title: Start With a Thin Prompt
category: Workflow
excerpt: Give the agent one focused task first, then expand scope once it proves itself.
tags:
  - agents
  - prompting
  - onboarding
  - iteration
order: 7
last_verified: 2026-06-15
---

# Start With a Thin Prompt

## The principle

A common failure mode is dumping a multi-page spec into an agent and hoping for a finished product. Instead, start with a thin slice: one file, one endpoint, one test.

## Why it matters

Thin prompts surface model/tool mismatches early. They build trust between you and the agent. They also keep token costs low and make failures cheap. You can always widen scope once the agent proves it understands the task.

## How to apply it

1. **Identify the smallest version.** What is the 20% of this task that proves the approach?
2. **Write a one-paragraph prompt.** If it needs bullet points, it may still be too big.
3. **Run it and inspect.** Judge output quality before adding more context.
4. **Add constraints next.** "Now keep the same pattern but handle the error case."
5. **Only then ask for the full feature.** By then the agent has context and you have confidence.

## Red flags

- Your prompt has sections and subsections.
- You are explaining business context, architecture, and desired output in one message.
- The agent asks for clarification before doing anything.
- You feel anxious hitting send because the request is too large.

## Quick win

Take a task you were about to give an agent and cut it in half. Then cut it in half again. Send that version first.
