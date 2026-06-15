---
slug: keep-a-human-in-the-loop
title: Keep a Human in the Loop
category: Safety
excerpt: Autonomous does not mean unsupervised. Gate destructive actions behind approval.
tags:
  - agents
  - safety
  - governance
  - trust
order: 6
last_verified: 2026-06-15
---

# Keep a Human in the Loop

## The principle

Autonomous does not mean unsupervised. The more power an agent has, the more important it is to gate destructive actions behind human approval.

## Why it matters

Agents make mistakes at machine speed. A wrong `git push --force`, a destructive database migration, or an ill-considered email can happen in milliseconds. Human checkpoints are friction by design — they convert irreversible actions into deliberate decisions.

## How to apply it

1. **Classify actions.** Read = safe. Write = caution. Delete / send / spend / deploy = require approval.
2. **Configure approval gates.** Use your agent platform's settings to require confirmation for high-impact tools.
3. **Start restrictive.** Default to ask-first. Loosen only after stable behavior over time.
4. **Log everything.** Even approved actions should leave an audit trail.
5. **Have a kill switch.** Know how to stop the agent instantly if it goes off track.

## Red flags

- The agent can delete production data without asking.
- You don't know what tools the agent has access to.
- Approval fatigue has made you click "approve all" out of habit.
- There is no log of what the agent did.

## Quick win

List the five tools your agent can use. Mark each as "auto", "ask", or "disable". Change at least one from "auto" to "ask" today.
