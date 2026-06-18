---
slug: permission-models
title: Agent Permission Models
excerpt: Compare how agents handle file access, command execution, and human approval so you can choose the right default for your risk level.
category: Trust
tags:
  - safety
  - permissions
  - agent
  - security
last_verified: 2026-06-18
---

# Agent Permission Models

Every agent needs a permission model. It defines what the agent can read, what it can change, and when a human must be involved. The model you choose is the single biggest factor in how much damage a confused, compromised, or misled agent can do.

## The five common patterns

| Pattern | Description | Risk level | Examples |
|---|---|---|---|
| Read-only | Agent can inspect files and logs but cannot write or run commands. | Low | Static analysis tools, doc search agents |
| Suggested edits | Agent proposes diffs; a human applies them. | Low | GitHub Copilot, code review agents |
| Command preview | Agent generates shell commands; a human approves each. | Medium | Claude Code, Cline |
| Auto-approve safe ops | Low-risk commands run automatically; destructive ones are gated. | Medium–High | Cursor agent mode, some CI agents |
| Full auto | Agent runs commands, writes files, and commits without approval. | High | Some autonomous CI/CD agents |

## How to choose

Start with the lowest-privilege model that still solves the problem. Most teams overestimate how much autonomy they need and underestimate how quickly an agent can make a mess.

- **Read-only** is the right default for research, analysis, and review tasks.
- **Suggested edits** is the right default for coding assistants that touch production code.
- **Command preview** is the minimum acceptable model for any agent that touches infrastructure.
- **Auto-approve safe ops** should only be used after you have defined "safe" explicitly and logged every decision.
- **Full auto** should be reserved for well-scoped, reversible workflows with strong observability.

## What "safe ops" means

If you use auto-approve, you must define the allowlist. A safe operation typically has all of these properties:

1. **Reversible.** You can undo it quickly.
2. **Observable.** You can see that it happened.
3. **Scoped.** It cannot affect systems outside the target.
4. **Tested.** The same operation has succeeded many times before.
5. **Low blast radius.** Failure does not impact customers or revenue.

Examples: running a linter, formatting code, regenerating a known config file, or fetching public data. Examples that are rarely safe: database migrations, secret rotation, customer-data exports, and deploys.

## Environment-based escalation

A sound practice is to tighten the model as you move toward production:

| Environment | Recommended model |
|-------------|-------------------|
| Local dev   | Read-only → Suggested edits → Command preview |
| Staging     | Suggested edits → Command preview |
| Production  | Read-only → Suggested edits (human applies all changes) |

Never let the production agent run in full-auto mode unless you have an explicit, reviewed exception.

## Permission models and human attention

The model also changes how humans interact with the agent:

- **Read-only and suggested edits** keep the human in control. The agent informs; the human decides.
- **Command preview** keeps the human informed but can create approval fatigue if every command requires a click.
- **Auto-approve safe ops** requires trust in the allowlist, not just in the model.
- **Full auto** removes the human from the loop entirely. That should be a deliberate architectural choice, not the default.

## Common mistakes

- **Defaulting to full auto because it feels fast.** Speed without control is debt.
- **Using a human user's credentials for the agent.** The agent needs its own identity so permissions can be reviewed and revoked independently.
- **Allowlisting broad commands.** "Safe" should describe the operation, not the tool. `rm` is not safe just because it is familiar.
- **Ignoring approval fatigue.** If users click "approve" on every prompt, you do not have human-in-the-loop; you have theater.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Agent Identity and Access Control](/safety/agent-identity-and-access)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Tip: Keep a Human in the Loop](/tips/keep-a-human-in-the-loop)

> Last verified: 2026-06-18.
