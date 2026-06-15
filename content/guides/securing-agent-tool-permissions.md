---
{
  "slug": "securing-agent-tool-permissions",
  "title": "Securing Agent Tool Permissions",
  "excerpt": "How to scope what your agent can touch without blocking useful work.",
  "category": "Security",
  "tags": [
    "agents",
    "security",
    "permissions",
    "mcp"
  ],
  "order": 5,
  "last_verified": "2026-06-14"
}
---

# Securing Agent Tool Permissions

How to scope what your agent can touch without blocking useful work.

## Principles

- **Default deny** — Give the agent access to nothing by default. Add permissions one at a time.
- **Read before write** — Let it read code, docs, and logs. Require approval for writes, deletes, and external API calls.
- **Environment boundaries** — Use separate keys or sandboxes for dev, staging, and production.
- **Audit logs** — Log every tool invocation, including inputs and outputs. Review weekly at first.
- **Scope per task** — If the agent only needs one repo, restrict it to that repo. If it only needs email read, do not grant send.

MCP servers and tool brokers like the SMF Works M365 Access Broker make this easier by centralizing scopes and approval gates.
