---
slug: tool-permissions-and-governance
title: "Tool Permissions and Governance for AI Agents"
excerpt: "How to design permission models, approval flows, and audit policies for agents that use tools. Keep capabilities aligned with intent."
category: Guides
tags:
  - governance
  - permissions
  - tools
  - security
order: 8
last_verified: 2026-06-16
---

# Tool Permissions and Governance for AI Agents

## Tools are capabilities

Every tool you give an agent is a capability. A tool that sends email can send bad email. A tool that edits code can break production. A tool that queries a database can leak data.

Governance is the work of making sure each capability is granted deliberately, used safely, and auditable afterward.

---

## The permission pyramid

Think of tool permissions in four layers:

| Layer | What it controls | Example |
|-------|------------------|---------|
| **Identity** | Who can invoke the agent | User login, API key, role |
| **Scope** | What the agent can touch | Allowed directories, databases, endpoints |
| **Action** | What the tool can do | Read, write, delete, execute |
| **Approval** | Whether a human must confirm | Auto-execute, suggest, or require approval |

A secure agent system answers all four layers for every tool.

---

## Permission model patterns

### Pattern 1: Deny by default

The agent starts with no tool access. Tools are granted explicitly with the minimum scope needed.

- Start with an empty allow-list.
- Add tools one at a time with documented justification.
- Review the allow-list weekly at first, then monthly.

### Pattern 2: Role-based tool access

Different users or agents get different tool sets based on role.

| Role | Allowed tools | Approval required |
|------|---------------|-------------------|
| **Viewer** | Search, read | None |
| **Editor** | Search, read, write suggested | For writes |
| **Admin** | All tools | None for low-risk; approval for destructive |
| **Service account** | Narrow, task-specific set | Auto-execute within scope |

### Pattern 3: Time-bound grants

Tool access expires after a session, a day, or a task. This limits the window of misuse.

- Generate temporary credentials.
- Set TTL on API keys.
- Rotate tokens after high-risk operations.

---

## Approval flows

Not every action needs a human, but the ones that matter do.

| Risk level | Examples | Default behavior |
|------------|----------|------------------|
| **Low** | Read files, search web, summarize | Auto-execute |
| **Medium** | Write to non-production files, send internal messages | Suggest, one-click approve |
| **High** | Delete data, send external email, deploy code | Require explicit multi-step approval |
| **Critical** | Change permissions, access secrets, financial transactions | Require second human approver |

The approval UI should show:

- What the agent plans to do
- Why it plans to do it
- What could go wrong
- Which tools and scopes are involved

---

## Audit requirements

Trustworthy agent governance produces a record. For every tool call, log:

- Timestamp
- Agent identity and version
- User who invoked the agent
- Tool name and parameters
- Input context (sanitized)
- Output or result
- Approval status and approver
- Success or failure

Store logs where the agent cannot modify them. Retain according to your compliance policy.

---

## Governance policies

Write these down before production:

1. **Tool registration policy.** Every tool must be registered, reviewed, and approved before an agent can use it.
2. **Scope policy.** Each tool has a maximum scope. The agent cannot exceed it.
3. **Approval policy.** Which actions require human approval, and who can approve.
4. **Data handling policy.** What data the agent can read, write, and transmit.
5. **Incident response policy.** What to do when an agent misuses a tool or causes harm.
6. **Review cadence.** How often permissions and logs are audited.

---

## Implementing with Composio, Unkey, and Portkey

| Tool | Role in governance |
|------|--------------------|
| **Composio** | Managed SaaS tool integrations with built-in auth scoping |
| **Unkey** | API key management with rate limits and per-key permissions |
| **Portkey** | AI gateway with guardrails, budget caps, and audit logs |
| **Langfuse** | Trace every tool call and model interaction |
| **OpenClaw** | Skill-based permissions where each skill declares its required tools |

---

## Common governance failures

- **"The agent is just a chatbot."** If it has tools, it is not just a chatbot.
- **"Prompt instructions are enough."** System-level enforcement is required.
- **"We'll add approvals later."** Approvals are easier to design in from the start.
- **"One admin role covers everything."** Different users need different scopes.
- **"Logs are optional."** Logs are the foundation of incident response.

---

## Quick-start governance template

For a new agent:

1. List every tool the agent uses.
2. For each tool, define read/write/execute scope.
3. Assign a default approval level.
4. Map users to roles.
5. Enable logging for every tool call.
6. Set a review date 30 days after launch.

Repeat for every new agent or major capability addition.

**Related:**
- [Agent Security Checklist](/guides/agent-security-checklist)
- [Services: Composio, Unkey, Portkey, Langfuse](/services)
