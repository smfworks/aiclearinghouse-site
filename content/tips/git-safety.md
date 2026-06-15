---
slug: git-safety
title: Commit Often
category: Quality
excerpt: Give your agent a clean branch and frequent commits. Rollback is your friend.
tags:
  - git
  - safety
  - workflow
  - rollback
order: 8
last_verified: 2026-06-15
---

# Commit Often

## The principle

Give your agent a clean branch and frequent commits. Rollback is your friend when the agent goes wrong.

## Why it matters

Agents can make large changes quickly. Without frequent commits, undoing a bad turn means manually reverting dozens of files. With small, frequent commits, you can `git reset` or `git revert` to a known-good state in seconds.

## How to apply it

1. **Create a feature branch for every agent session.** Never let an agent touch `main` directly.
2. **Commit after every meaningful change.** "Agent added input validation" is a good commit message.
3. **Use the agent's own commits if it supports them.** Tools like Aider and Claude Code can commit as they work.
4. **Push regularly.** Local branches can be lost. Remote branches are safer.
5. **Review the commit history.** It tells the story of what the agent actually did.

## Red flags

- You are running an agent on `main`.
- There is one giant commit with the message "updates" or "agent work."
- You are afraid to revert because you cannot remember what changed.
- The agent deleted code you now need to recover.

## Quick win

Before your next agent session, run `git checkout -b agent/try-thing`. Commit after the first change. Future-you will thank present-you.
