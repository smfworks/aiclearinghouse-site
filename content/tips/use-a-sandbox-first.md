---
slug: use-a-sandbox-first
title: Use a Sandbox First
category: Safety
excerpt: "Run agent-generated code in isolation before it touches your main project. A cheap container beats a broken production environment."
tags:
  - safety
  - sandbox
  - testing
order: 5
last_verified: 2026-06-16
---

# Use a Sandbox First

## The principle

Agent-generated code should run somewhere harmless before it runs somewhere important. A sandbox, a throwaway branch, a container, or a cloud VM — pick your isolation layer, but always use one.

## Why it matters

Agents can generate code that:
- Deletes files
- Makes irreversible API calls
- Consumes expensive resources
- Changes system configuration
- Opens network connections

You do not want any of that happening in your main working directory or production account by surprise.

## Sandbox options

| Option | Best for | Effort |
|--------|----------|--------|
| **Git branch** | Code changes that need review | Low |
| **Docker container** | Code with dependencies or side effects | Medium |
| **Cloud VM / Codespace** | Long-running or resource-heavy tasks | Medium |
| **Virtual environment** | Python/Node projects | Low |
| **Browser sandbox** | Agent-driven web actions | Low |

## Minimum viable sandbox

For most coding agents:

1. Create a feature branch: `git checkout -b agent/short-description`
2. Run the agent on that branch.
3. Review the diff before leaving the branch.
4. Run tests in a clean environment.
5. Merge only after review.

## What to protect

- **Production credentials.** Use scoped test keys.
- **Databases.** Point to a staging or throwaway instance.
- **File system.** Restrict write access to the working directory.
- **Network.** Block egress except to known test endpoints.
- **Cost.** Cap API usage and compute budgets.

## The 5-minute rule

If setting up a sandbox takes less than 5 minutes and could prevent a serious mistake, do it. The time you spend is cheaper than the time you spend recovering.

## When no sandbox is available

If you cannot isolate fully, at least:

- Make a commit or snapshot before running the agent.
- Read the diff before applying it.
- Avoid destructive commands (`rm`, `drop`, `delete`).
- Run with minimal permissions.

## Quick win

Set up one reusable sandbox environment for your most common agent task. Use it every time. The habit is the safety net.
