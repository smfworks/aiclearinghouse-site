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
last_verified: 2026-06-18
---

# Agent Safety Checklist

Use this checklist before giving an agent access to code, production data, or customer systems. It is a pre-flight safety check, not a one-time audit. Run it again whenever you add a tool, change a model, or expand the agent's scope.

## 1. Scope what the agent can touch

- [ ] List every tool the agent can call.
- [ ] Remove tools the task does not require.
- [ ] Restrict file system access to a dedicated workspace.
- [ ] Use read-only access unless the task explicitly requires writes.

**Why this matters.** An agent with too many tools has too many ways to fail. Each tool is an attack surface and a source of ambiguity. The safest default is the smallest set of capabilities that still completes the task.

## 2. Require human approval for risky actions

- [ ] Shell commands require approval.
- [ ] File writes outside the workspace require approval.
- [ ] Network calls to external services require approval.
- [ ] Commits, deploys, and database migrations require approval.

Approval should be meaningful. A one-click "approve all" button trains users to ignore prompts. Require the human to read the specific action, and log who approved what.

## 3. Validate tool inputs and outputs

- [ ] Every tool call is parsed against a strict JSON schema.
- [ ] Unexpected parameters are rejected, not coerced.
- [ ] Tool results are sanitized before being returned to the LLM.
- [ ] Timeouts and retries are configured for every tool.

See [Output Validation for Agent Tool Calls](/safety/output-validation) for a deeper treatment.

## 4. Defend against prompt injection

- [ ] Untrusted user content is isolated from system instructions.
- [ ] Delimiters or base64 encoding are used for user-provided files.
- [ ] The system prompt includes a warning not to override safety rules.
- [ ] Instructions from the user are treated as requests, not commands to the agent.

Prompt injection is the most common way an agent is tricked into misbehaving. See [Prompt Injection Defenses](/safety/prompt-injection).

## 5. Run in a sandbox

- [ ] The agent runs inside a container, VM, or restricted user account.
- [ ] Secrets are never present in the agent's environment unless required.
- [ ] Network egress is limited to known endpoints.
- [ ] The host filesystem is mounted read-only where possible.

Sandboxing limits the blast radius when something goes wrong. See [Sandboxing Agent Runtimes](/safety/sandboxing).

## 6. Log everything

- [ ] Every LLM request and response is logged.
- [ ] Every tool invocation and result is logged.
- [ ] Approval decisions are logged with user identity.
- [ ] Logs are retained long enough for incident review.

Logs are your only source of truth after an incident. If you cannot reconstruct what the agent did, you cannot fix it. See [Monitoring and Auditing Agents](/safety/monitoring-and-auditing).

## 7. Monitor for drift and abuse

- [ ] Tool call rate and error rate are graphed.
- [ ] Unusual tool sequences trigger alerts.
- [ ] Model output quality is sampled regularly.
- [ ] A kill switch can disable the agent quickly.

Agents can drift silently. A sudden spike in file reads, an unusual sequence of API calls, or a drop in output quality can all be early warnings.

## 8. Plan for model death

- [ ] The agent can switch models without a full rewrite.
- [ ] Prompts are versioned and tested against new models.
- [ ] A fallback model is configured for every critical task.
- [ ] Model deprecation notices are monitored.

Models change, get deprecated, or degrade in quality. A safety boundary that only works on one model version is a temporary boundary.

## 9. Manage secrets carefully

- [ ] API keys live in a vault or secret manager, not in prompts or code.
- [ ] Keys are scoped to the minimum permissions required.
- [ ] Keys are rotated on a schedule and after personnel changes.
- [ ] The agent cannot read its own secrets unless absolutely necessary.

See [Secrets Management for Agents](/safety/secrets-management).

## 10. Define who the agent is

- [ ] The agent has its own service account or identity.
- [ ] Permissions are tied to that identity, not a human user's credentials.
- [ ] Offboarding includes disabling the agent's access.
- [ ] Periodic access reviews include agent identities.

See [Agent Identity and Access Control](/safety/agent-identity-and-access).

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
- You do not know who approved its last risky action.

## Related

- [Agent Permission Models](/safety/permission-models)
- [Prompt Injection Defenses](/safety/prompt-injection)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Secrets Management for Agents](/safety/secrets-management)
- [Agent Identity and Access Control](/safety/agent-identity-and-access)

> Last verified: 2026-06-18. Safety practices evolve quickly; review this checklist quarterly.
