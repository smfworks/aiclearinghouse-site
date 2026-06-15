---
slug: agent-safety-checklist
title: Agent Safety Checklist
excerpt: A practical checklist for deploying autonomous AI agents without exposing your systems or data.
category: Trust
tags:
  - safety
  - security
  - checklist
  - deployment
last_verified: 2026-06-14
---

# Agent Safety Checklist

Use this checklist before giving an agent access to code, production data, or customer systems. Treat it as a pre-flight safety check, not a one-time audit.

## 1. Scope what the agent can touch

- [ ] List every tool the agent can call.
- [ ] Remove tools the task does not require.
- [ ] Restrict file system access to a dedicated workspace.
- [ ] Use read-only access unless the task explicitly requires writes.

## 2. Require human approval for risky actions

- [ ] Shell commands require approval.
- [ ] File writes outside the workspace require approval.
- [ ] Network calls to external services require approval.
- [ ] Commits, deploys, and database migrations require approval.

## 3. Validate tool inputs and outputs

- [ ] Every tool call is parsed against a strict JSON schema.
- [ ] Unexpected parameters are rejected, not coerced.
- [ ] Tool results are sanitized before being returned to the LLM.
- [ ] Timeouts and retries are configured for every tool.

## 4. Defend against prompt injection

- [ ] Untrusted user content is isolated from system instructions.
- [ ] Delimiters or base64 encoding are used for user-provided files.
- [ ] The system prompt includes a warning not to override safety rules.
- [ ] Instructions from the user are treated as requests, not commands to the agent.

## 5. Run in a sandbox

- [ ] The agent runs inside a container, VM, or restricted user account.
- [ ] Secrets are never present in the agent's environment unless required.
- [ ] Network egress is limited to known endpoints.
- [ ] The host filesystem is mounted read-only where possible.

## 6. Log everything

- [ ] Every LLM request and response is logged.
- [ ] Every tool invocation and result is logged.
- [ ] Approval decisions are logged with user identity.
- [ ] Logs are retained long enough for incident review.

## 7. Monitor for drift and abuse

- [ ] Tool call rate and error rate are graphed.
- [ ] Unusual tool sequences trigger alerts.
- [ ] Model output quality is sampled regularly.
- [ ] A kill switch can disable the agent quickly.

## 8. Plan for model death

- [ ] The agent can switch models without a full rewrite.
- [ ] Prompts are versioned and tested against new models.
- [ ] A fallback model is configured for every critical task.
- [ ] Model deprecation notices are monitored.

## Approval levels by environment

| Environment | Read-only | Suggest edits | Auto-approve safe ops | Full auto |
|-------------|-----------|---------------|-----------------------|-----------|
| Local dev   | ✅        | ✅            | ✅ with logging       | ⚠️ limited |
| Staging     | ✅        | ✅            | ✅ with approval log  | ❌         |
| Production  | ✅        | ✅            | ❌                    | ❌         |

## When to stop

Pause the agent deployment if:

- You cannot list every tool it can call.
- You cannot explain why it needs write access.
- You cannot recover from a bad action in under five minutes.
- You have not tested it on realistic inputs.

## Related

- [Agent Permission Models](/safety/permission-models)
- [Prompt Injection Defenses](/safety/prompt-injection)
