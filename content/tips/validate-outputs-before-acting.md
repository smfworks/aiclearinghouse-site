---
slug: validate-outputs-before-acting
title: Validate Outputs Before Acting
category: Quality
excerpt: "Never let an agent fire a destructive tool based on unverified output. A fast sanity check prevents irreversible mistakes."
tags:
  - validation
  - tool-calls
  - safety
  - quality
order: 18
last_verified: 2026-07-01
---

# Validate Outputs Before Acting

## The trust problem

An agent can write a SQL query that drops a table, call an API that refunds a customer, or delete files based on a misunderstood prompt. Speed is not the enemy — unchecked action is.

## What to validate

- **File paths.** Confirm the path is inside the intended workspace.
- **SQL and shell commands.** Run an explain or dry-run before execution.
- **API payloads.** Check that IDs, amounts, and statuses match the intended operation.
- **Tool selection.** Make sure the agent picked the right tool for the task.
- **Human-in-the-loop gates.** For destructive or high-stakes actions, require explicit approval.

## How to build the check

1. Parse the agent's output into a structured object.
2. Compare fields against allowed values or patterns.
3. Reject anything outside the expected scope.
4. Log the rejection and return a clear error to the agent.
5. Require the agent to retry with corrected input.

## Quick win

Add a pre-execution validator to the tool your agent uses most often. For one week, review every rejection. The patterns you find will teach you more about failure modes than any benchmark.
