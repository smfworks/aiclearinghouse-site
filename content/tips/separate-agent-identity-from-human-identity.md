---
slug: separate-agent-identity-from-human-identity
title: Separate Agent Identity From Human Identity
category: Security
excerpt: "Agents squeezed into human identity categories create a governance gap — when an agent calls an MCP server, there is often no policy layer at all. Give agents their own verifiable identities."
tags:
  - security
  - identity
  - governance
  - mcp
  - production
order: 99
last_verified: "2026-09-16"
---

# Separate Agent Identity From Human Identity

## The principle

Agents are still being squeezed into identity categories built for people. The moment an agent calls a tool or an MCP server, there is often no policy layer at all. Identity has to be central to any control plane, not an afterthought bolted on later.

## Why it matters

When you authenticate an agent using a human's API key or OAuth token, three things go wrong:

1. **No attribution**: The audit log says "Michael called the production deploy tool" when an agent did. You cannot distinguish human actions from agent actions.
2. **No scoping**: The agent inherits everything the human can do. If Michael has production access, so does the agent — even if you only wanted it to read deployment history.
3. **No revocation path**: When an agent misbehaves, you have to revoke the human's credentials, which takes down their access too.

## How to apply it

### 1. Give each agent its own identity

```python
# Instead of this:
agent_credentials = human_user.api_key  # Wrong

# Do this:
agent_identity = {
    "agent_id": "research-agent-001",
    "agent_type": "research",
    "owner": "michael@smfworks.com",
    "created": "2026-09-16",
    "scopes": ["read:deployment_history", "read:cluster_health"],
    "expires": "2026-12-16"
}
```

### 2. Map agent identity to policy, not human identity

Your policy engine should answer: "Can `research-agent-001` call `mcp:filesystem:read`?" — not "Can Michael call it?"

```
# Policy rule example (CEL)
allow if agent.type == "research" 
     and tool.scope in agent.scopes
     and environment == "non-production"
```

### 3. Log under the agent's identity

Every audit entry should record:
- Which agent made the call (agent_id)
- Which human connected/owns the agent (owner)
- What tool was called and with what parameters
- Whether the policy allowed or denied it

### 4. Set expiration and rotation

Agent identities should expire. Unlike human identities, agents are purpose-built and temporary. Set a 90-day expiration by default and require re-authorization.

### 5. Separate credentials from identity

The agent's identity (who it is) should be separate from its credentials (how it authenticates). Use short-lived tokens, not long-lived API keys.

## What this looks like in practice

Tools like WSO2 Agent Manager (GA September 15, 2026) and Akuity's Agentic Control Plane (September 14, 2026) implement this pattern natively:

- **WSO2 Agent Manager**: Per-agent, per-environment identity controls with MCP-level governance
- **Akuity**: Agent acts as the connected person but with guardrail levels that can block agents from sensitive actions even when the human has permission

If you are not using a control plane, implement the pattern yourself: agent IDs, scoped tokens, policy rules, and audit logs that distinguish agent actions from human actions.

## Red flags

- Your audit log cannot distinguish agent actions from human actions
- An agent is using a human's personal API key
- You cannot revoke an agent's access without also revoking the human's
- An agent has more permissions than it needs because it inherited a human's full scope
- No one on your team can answer "what can agent X do right now?"

## Quick win

Inventory your agents today. For each one, answer: what identity does it use? If the answer is "a human's credentials," that agent has a governance gap. Create a scoped API key or service account for it this week, and update your audit logging to record the agent identity alongside every action.