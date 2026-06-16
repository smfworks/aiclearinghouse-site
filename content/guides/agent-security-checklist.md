---
slug: agent-security-checklist
title: "Agent Security Checklist: 12 Questions Before Production"
excerpt: "A practical security checklist for AI agents. Covers permissions, data leakage, tool access, logging, and human-in-the-loop controls."
category: Guides
tags:
  - security
  - production
  - checklist
  - governance
order: 4
last_verified: 2026-06-16
---

# Agent Security Checklist: 12 Questions Before Production

## Why agent security is different

AI agents do not just generate text. They call tools, read files, send messages, and make changes. That means every security principle that applies to scripts, integrations, and employees also applies to agents — but agents are harder to reason about because their behavior is probabilistic.

This checklist is designed to be reviewed before an agent touches production data or production systems.

---

## 1. What can the agent read?

Agents often receive broad access to files, databases, or APIs to "be helpful." That is a mistake.

- [ ] The agent can only access data required for its task.
- [ ] Sensitive directories, tables, or endpoints are explicitly denied.
- [ ] Access is enforced at the system level, not just in the prompt.
- [ ] The agent cannot escalate its own permissions.

**Bad pattern:** "Here is my whole project. Fix whatever looks wrong."  
**Better pattern:** "Review these three files for memory leaks. Do not modify anything outside them."

---

## 2. What can the agent write?

Write access is where most damage happens.

- [ ] The agent has a sandbox or staging area for changes.
- [ ] Production writes require human approval or a second agent review.
- [ ] Git diffs are reviewed before merging.
- [ ] Rollback is possible within minutes.

---

## 3. Which tools can the agent call?

Every tool is a capability. Capabilities should be granted deliberately.

- [ ] Tools are enumerated and documented.
- [ ] Each tool has a permission level.
- [ ] Dangerous tools require explicit user confirmation.
- [ ] The agent cannot discover or enable new tools at runtime.

**Related services:** [Unkey](/services/unkey-api-management), [Portkey](/services/portkey-ai-gateway)

---

## 4. Is there a human-in-the-loop?

Fully autonomous agents are risky for destructive operations.

- [ ] High-impact actions require approval.
- [ ] The default is suggest, not execute.
- [ ] Users can inspect what the agent plans to do before it runs.
- [ ] The agent explains its reasoning in human-readable form.

---

## 5. Is prompt injection mitigated?

Prompt injection lets untrusted input override your instructions.

- [ ] Untrusted content is separated from system instructions.
- [ ] The agent does not act on commands embedded in user data.
- [ ] Input from the web, email, or documents is treated as untrusted.
- [ ] Output is validated before tool execution.

---

## 6. Are secrets handled safely?

Agents often need API keys, credentials, or tokens.

- [ ] Secrets are not hardcoded in prompts or logs.
- [ ] Keys are rotated and scoped to the minimum required access.
- [ ] The agent cannot read its own environment variables arbitrarily.
- [ ] Key usage is monitored for anomalies.

---

## 7. Is output logged and auditable?

If something goes wrong, you need to reconstruct what happened.

- [ ] Every agent action is logged with timestamp, input, output, and tool called.
- [ ] Logs are retained according to your compliance policy.
- [ ] Sensitive data is masked in logs.
- [ ] Logs are protected from tampering by the agent.

**Related services:** [Langfuse](/services/langfuse-observability), [Weights & Biases Weave](/services/weights-biases-weave)

---

## 8. Can the agent leak data?

Agents can inadvertently include sensitive information in outputs.

- [ ] PII and secrets are redacted before leaving the system.
- [ ] The agent is not allowed to call external APIs with sensitive input unless approved.
- [ ] Generated content is reviewed before sharing externally.
- [ ] Training-data protections are confirmed with providers.

---

## 9. Is the runtime isolated?

The environment the agent runs in limits the blast radius.

- [ ] The agent runs in a container, VM, or sandbox.
- [ ] Network egress is restricted.
- [ ] File system access is limited.
- [ ] The agent cannot spawn arbitrary processes.

---

## 10. Is there a kill switch?

Every autonomous system needs an off button.

- [ ] The agent can be paused or stopped immediately.
- [ ] Long-running agents have time limits.
- [ ] Failed loops do not run forever.
- [ ] Admins can revoke permissions instantly.

---

## 11. Is behavior monitored in production?

Security is not a one-time configuration.

- [ ] Anomaly detection alerts on unusual tool usage.
- [ ] Cost spikes trigger investigation.
- [ ] User reports of bad behavior are captured.
- [ ] Regular red-team exercises test the agent's guardrails.

---

## 12. Is ownership clear?

When an agent causes a problem, someone needs to be responsible.

- [ ] The agent has a named owner.
- [ ] The owner reviews access and scope regularly.
- [ ] There is an incident response plan for agent failures.
- [ ] The team knows who to contact if the agent misbehaves.

---

## Scoring

- **0–3 unchecked:** High risk. Do not deploy.
- **4–7 unchecked:** Medium risk. Deploy with restrictions and a remediation plan.
- **8–12 unchecked:** Low risk. Treat like any other production service.

---

## Common excuses that fail

- **"It's just a prototype."** Prototypes become production. Fix security before the boundary blurs.
- **"The LLM provider handles safety."** Provider safety is not your application security.
- **"We trust our users."** Trust is not a control.
- **"We'll lock it down later.""** Later rarely comes before an incident.

**Related:**
- [Securing Agent Tool Permissions](/guides/securing-agent-tool-permissions)
- [Services: Portkey, Unkey](/services)
