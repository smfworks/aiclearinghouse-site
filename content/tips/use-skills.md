---
slug: use-skills
title: Build Skills, Not Prompts
category: Hermes
excerpt: Reusable skills capture your workflow. One-time prompts get lost.
tags:
  - hermes
  - skills
  - workflow
  - reusability
order: 3
last_verified: 2026-06-15
---

# Build Skills, Not Prompts

## The principle

A great prompt used once is a wasted asset. Turn repeatable workflows into reusable skills that any agent can invoke the same way every time.

## Why it matters

Prompts rot in chat history. They get rewritten slightly differently each time, producing inconsistent results. Skills are versioned, tested, and composable. They turn individual expertise into team infrastructure.

## How to apply it

1. **Notice repetition.** If you find yourself typing the same instructions twice, make a skill.
2. **Name it clearly.** `generate-tests`, `deploy-to-vercel`, `summarize-pr` — action-oriented names.
3. **Define inputs and outputs.** What does the skill need? What does it produce?
4. **Keep it focused.** One skill should do one thing well. Composability beats Swiss-army knives.
5. **Test and iterate.** Run the skill on real inputs, fix failures, and update the version.

## Red flags

- Your prompts live only in Slack threads or personal notes.
- Different team members use different prompts for the same task.
- A prompt is longer than 500 words and tries to do everything.

## Quick win

Pick the last good prompt you wrote. Wrap it into a skill file with a one-sentence description and two example inputs. Share it with the team.
