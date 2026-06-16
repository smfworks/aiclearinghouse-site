---
slug: keep-a-human-in-the-loop
title: Keep a Human in the Loop
category: Safety
excerpt: "Autonomy is a dial, not a switch. Start with suggestions, move to approvals, and only automate after the agent proves itself."
tags:
  - safety
  - governance
  - autonomy
order: 12
last_verified: 2026-06-16
---

# Keep a Human in the Loop

## The autonomy dial

Agent autonomy is not binary. It is a dial you can turn:

1. **Suggest only.** The agent proposes. You decide.
2. **Approve required.** The agent shows its plan. You approve each step.
3. **Auto within rules.** The agent acts within a bounded scope.
4. **Fully autonomous.** The agent runs and reports.

Most teams should stay at 1 or 2 for a long time.

## Why humans stay necessary

Agents are good at pattern matching and fast execution. They are bad at:

- Judgment under uncertainty
- Understanding business context
- Evaluating tradeoffs that are not encoded
- Recovering from novel failures
- Knowing when not to act

A human in the loop catches the cases the agent does not know it cannot handle.

## What to automate first

Start with low-stakes, reversible actions:

- Formatting code
- Generating summaries
- Running test suites
- Drafting messages
- Updating internal documentation

Only move to high-stakes actions after consistent success:

- Committing to main
- Sending external email
- Modifying production config
- Spending money or using credits

## Approval UX that works

Good approval flows show:

- What the agent is about to do
- Why it thinks this is the right action
- What could go wrong
- How to undo it
- A clear approve / reject / modify path

Bad approval flows show a wall of JSON and a yes/no button.

## Quick win

For the next agent task that would normally auto-execute, add one approval checkpoint. Observe what you catch.
