---
slug: securing-agent-tool-permissions
title: "Securing Agent Tool Permissions: A Practical Security Framework"
excerpt: "How to scope what your agent can touch without blocking useful work. Threat models, permission matrices, approval workflows, and real configuration examples."
category: Guides
tags:
  - security
  - permissions
  - mcp
  - threat-model
  - audit
order: 5
last_verified: 2026-06-15
---

# Securing Agent Tool Permissions: A Practical Security Framework

## The agent security problem

AI agents are not like traditional software. Traditional software does what you program it to do. Agents do what they *think* you want — and they are often wrong. An agent with broad permissions can delete production databases, send emails to the wrong people, or leak proprietary code to external APIs.

This guide gives you a practical security framework. Not theory. Real configurations, real threat models, and real workflows you can implement today.

---

## Threat model: What can go wrong

### Threat 1: The over-eager deletion

**Scenario:** You ask an agent to "clean up old files." It deletes your `.env` file, your migration history, and your backup scripts because they were "old."

**Impact:** Service outage, data loss, hours of recovery.

**Prevention:** Default-deny permissions. The agent cannot delete anything without explicit approval.

### Threat 2: The credential leak

**Scenario:** An agent reads your `.env` file to understand your database schema. Later, it includes those credentials in a code snippet it posts to a public GitHub issue or chat channel.

**Impact:** Credential exposure, security incident, compliance violation.

**Prevention:** Sensitive file exclusion. The agent never reads files matching `*.env`, `*secret*`, `*key*`.

### Threat 3: The rogue API call

**Scenario:** An agent with a web-search tool decides to "verify" your API key by sending it to a third-party service. Or it calls a payment API to "test" functionality.

**Impact:** Fraudulent charges, rate limit exhaustion, account suspension.

**Prevention:** API allow-list. The agent can only call APIs you explicitly approve.

### Threat 4: The scope creep

**Scenario:** You give an agent access to one repository for a bug fix. It notices a related issue in another repository and "helpfully" modifies that too, breaking a production service.

**Impact:** Unplanned deployment, broken builds, angry teammates.

**Prevention:** Repository isolation. Each agent session is scoped to one repo unless explicitly expanded.

### Threat 5: The audit gap

**Scenario:** An agent makes a change that introduces a subtle security bug. Six months later, during a security review, you cannot determine which change was made by an agent vs. a human. You cannot trace the decision chain.

**Impact:** Compliance failure, extended incident response, loss of trust.

**Prevention:** Comprehensive audit logs with agent attribution, tool inputs, and tool outputs.

---

## The five principles

### Principle 1: Default deny

Start with zero permissions. Add permissions one at a time, with justification.

**Wrong:**
```
Agent has full filesystem access.
Agent can call any API.
Agent can send emails.
```

**Right:**
```
Agent can read: /project/src/**
Agent can write: /project/src/** (with approval)
Agent can call APIs: api.github.com (read-only)
Agent cannot: send emails, delete files, access /etc/
```

### Principle 2: Read before write

Reading is safe. Writing is dangerous. Deleting is catastrophic. Require escalating approval for each level.

| Action | Default | Approval required |
|--------|---------|-------------------|
| Read code | Allow | None |
| Read docs | Allow | None |
| Read config | Allow | None (but mask secrets) |
| Write code | Deny | One-click approval |
| Write config | Deny | Manager approval |
| Delete file | Deny | Two-person approval |
| Call API | Deny | Pre-approved list only |
| Send message | Deny | Explicit per-message |

### Principle 3: Environment boundaries

Never let an agent touch production directly. Use this hierarchy:

```
Local dev → Staging → Production
     ↑         ↑          ↑
   Agent     Agent      Human only
```

**Agent rules:**
- Can read production logs (read-only, masked)
- Can write to local dev and staging
- Cannot write to production
- Cannot access production credentials

### Principle 4: Audit everything

Every tool invocation must be logged with:
- Timestamp
- Agent identity
- Tool name
- Input parameters
- Output summary
- User approval status
- Duration

**Example log entry:**
```json
{
  "timestamp": "2026-06-15T14:32:01Z",
  "agent_id": "pamela-workspace-001",
  "tool": "file_write",
  "input": "/project/src/auth.ts",
  "output_size": 1240,
  "approval": "auto-approved (dev environment)",
  "user": "pamela@smfworks.com",
  "duration_ms": 230
}
```

### Principle 5: Scope per task

An agent should have exactly the permissions it needs for its current task — no more.

**Task: Fix a bug in the authentication module**
- Can read: `/project/src/auth/**`, `/project/src/types/**`
- Can write: `/project/src/auth/**`
- Cannot read: `/project/src/payment/**`, `/project/src/user-data/**`
- Cannot write: anything outside `/project/src/auth/**`

**Task: Update documentation**
- Can read: `/project/src/**` (to understand code)
- Can write: `/project/docs/**`
- Cannot write: `/project/src/**`

---

## MCP server security configuration

Model Context Protocol (MCP) servers are the standard way agents connect to tools. Here is how to secure them.

### File system MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/project/src",
        "/project/docs"
      ],
      "env": {
        "MCP_READONLY": "false",
        "MCP_APPROVAL_REQUIRED": "true",
        "MCP_EXCLUDE_PATTERNS": "*.env,*.secret,*password*,*key*"
      }
    }
  }
}
```

**Security features:**
- Only `/project/src` and `/project/docs` are accessible
- Writes require approval
- Sensitive files are excluded by pattern

### GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_READONLY": "true",
        "GITHUB_ALLOWED_REPOS": "smfworks/aiclearinghouse-site,smfworks/smf-chat"
      }
    }
  }
}
```

**Security features:**
- Read-only access (no writes, no deletes)
- Token is scoped to specific repos
- Cannot access other organizations

### Database MCP

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://readonly:${DB_PASS}@localhost:5432/project_dev",
        "MCP_READONLY": "true",
        "MCP_ALLOWED_TABLES": "users,projects,tasks",
        "MCP_ROW_LIMIT": "100"
      }
    }
  }
}
```

**Security features:**
- Read-only database user
- Only specific tables accessible
- Row limit prevents full table scans
- Connects to dev database, not production

---

## Approval workflow implementation

### Simple: One-click approval

For low-risk environments (local dev, personal projects):

```
Agent requests: write to /project/src/auth.ts
User sees: diff preview
User clicks: [Approve] [Reject]
Agent proceeds or aborts
```

### Medium: Delayed approval

For team environments:

```
Agent requests: write to /project/src/auth.ts
System queues: request in approval queue
Teammate sees: notification in Slack/Discord
Teammate reviews: diff and context
Teammate clicks: [Approve] [Reject] [Request changes]
Agent proceeds, aborts, or revises
```

### High: Two-person approval

For production-adjacent changes:

```
Agent requests: modify production config
Reviewer 1 approves: +1
Reviewer 2 approves: +1
Change deploys: automatically or via CI/CD
If either rejects: abort and notify
```

---

## Secret management

### Never let agents read secrets

**Environment variable files:**
```bash
# .env — NEVER let agent read this
cp .env .env.agent-safe  # Strip secrets first
# Or better: exclude entirely
```

**MCP configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "env": {
        "MCP_EXCLUDE_PATTERNS": "*.env,.env*,*secret*,*password*,*key*,*token*"
      }
    }
  }
}
```

**Runtime isolation:**
```bash
# Start agent with sanitized environment
env -i HOME=$HOME PATH=$PATH ollama run agent
```

### Use secret references, not values

Instead of:
```javascript
const apiKey = "sk-abc123...";
```

Use:
```javascript
const apiKey = process.env.API_KEY; // Agent sees reference, not value
```

The agent knows the variable exists but cannot read its value.

---

## Monitoring and incident response

### Weekly audit checklist

- [ ] Review all agent write operations. Any surprises?
- [ ] Check for access outside approved scopes.
- [ ] Verify no secrets appeared in logs or outputs.
- [ ] Confirm approval workflows were followed.
- [ ] Review failed approvals — were they legitimate rejections or workflow friction?

### Incident response: Agent makes unauthorized change

**Step 1: Stop the agent**
```bash
pkill -f "agent-name"
```

**Step 2: Assess damage**
```bash
git diff HEAD~1  # See what changed
git log --agent-authored  # See agent commits
```

**Step 3: Revert if needed**
```bash
git revert HEAD
```

**Step 4: Review logs**
```bash
cat /var/log/agent/2026-06-15.log | grep "file_write\|api_call\|delete"
```

**Step 5: Tighten permissions**
- Add the violated scope to the deny list
- Increase approval requirements
- Brief the team on the incident

**Step 6: Document lessons learned**
Add to runbook: "Agent attempted X due to Y permission. Fixed by Z."

---

## Configuration examples by role

### Junior developer agent

```json
{
  "permissions": {
    "read": ["/project/src/**", "/project/docs/**"],
    "write": ["/project/src/**"],
    "approval_required": true,
    "exclude": ["*.env", "*.secret", "*password*", "*key*", "/project/src/payment/**"],
    "apis": ["api.github.com:read", "npmjs.org:read"],
    "max_file_size_mb": 5,
    "max_tokens_per_request": 4000
  }
}
```

### Senior developer agent

```json
{
  "permissions": {
    "read": ["/project/**"],
    "write": ["/project/src/**", "/project/config/**"],
    "approval_required": false,
    "exclude": ["*.env", "*.secret"],
    "apis": ["api.github.com:read_write", "npmjs.org:read"],
    "max_file_size_mb": 10,
    "max_tokens_per_request": 8000
  }
}
```

### DevOps agent

```json
{
  "permissions": {
    "read": ["/project/**", "/var/log/**"],
    "write": ["/project/deploy/**"],
    "approval_required": true,
    "exclude": ["*.env", "*.secret", "*password*", "*key*", "*token*"],
    "apis": ["api.github.com:read_write", "api.aws.amazon.com:read"],
    "max_file_size_mb": 50,
    "max_tokens_per_request": 16000
  }
}
```

---

## Red flags: When to revoke permissions immediately

1. **Agent accesses files outside its scope.** Even once. This means the permission model is broken.
2. **Agent attempts to call unapproved APIs.** It is probing boundaries. Treat this as an attack.
3. **Agent includes sensitive data in outputs.** It does not understand data classification. Restrict its outputs.
4. **Agent makes changes during off-hours without scheduling.** This could indicate a runaway loop or compromise.
5. **Agent ignores explicit denials.** If you say "do not touch X" and it touches X, the agent is not safe to use.

---

## Summary: The minimum viable security

If you do nothing else, do these five things:

1. **Default deny.** Start with zero permissions. Add one at a time.
2. **Exclude secrets.** Never let agents read `.env`, `*secret*`, `*key*`, `*password*`.
3. **Require approval for writes.** One click is enough for dev. Two-person for production.
4. **Log everything.** Timestamp, agent ID, tool, input, output, approval status.
5. **Scope per task.** Each session gets exactly the permissions it needs.

**Related:**
- [Deployment Recipes](/deployment-recipes)
- [Agent Directory](/agents) — filter by security features
- [Local LLMs vs. API LLMs](/guides/local-llms-vs-api)
