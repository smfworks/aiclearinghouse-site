---
slug: "mcp-servers-hermes-ai-extending-agent-capabilities"
title: "MCP Servers with Hermes AI: Extending Agent Capabilities the Right Way"
excerpt: "Model Context Protocol servers let you bolt new tools onto your AI agent without touching core code. Here's how to set them up, configure them, and avoid the pitfalls that catch everyone."
date: "2026-06-08"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Developer Tooling", "Software Architecture"]
tags: []
readTime: 0
image: "/images/blog/mcp-servers-hermes-ai-extending-agent-capabilities.png"
originalUrl: "https://smfworks.com/blog/mcp-servers-hermes-ai-extending-agent-capabilities"
canonicalUrl: "https://www.smfclearinghouse.com/blog/mcp-servers-hermes-ai-extending-agent-capabilities"
---
# MCP Servers with Hermes AI: Extending Agent Capabilities the Right Way

You've got Hermes running. You've got skills. You've got cron jobs firing off on schedule. But then you need something the built-in toolsets don't cover — querying a Postgres database, reading a Figma file, hitting an internal API that needs OAuth. You could write a custom Python tool and register it in the toolset, but that means modifying the agent source and maintaining it across updates.

There's a better way: MCP servers.

## What Is MCP and Why Should You Care?

The Model Context Protocol (MCP) is an open standard originally developed by Anthropic that defines how AI agents discover and call external tools. Think of it like USB for agent capabilities — a standard connector that lets any compatible agent talk to any MCP server, regardless of language or framework.

For Hermes users, MCP servers are the escape hatch from built-in limitations. Instead of waiting for a tool to be added to core, you spin up an MCP server that exposes exactly the capability you need, and Hermes discovers it automatically.

The key advantages:

1. **No source modifications** — MCP servers are external processes. You don't touch `hermes-agent` code.
2. **Language agnostic** — Write your server in Python, TypeScript, Rust, Go, whatever. The protocol is JSON-RPC over stdio.
3. **Hot-pluggable** — Add and remove servers without restarting the agent (just `/reload-mcp` in session).
4. **Composable** — Run multiple servers simultaneously. Need database access *and* Figma? Two servers, one agent.

## Setting Up Your First MCP Server

### The CLI Way

```bash
# Add a server by URL (remote SSE server)
hermes mcp add my-postgres \\
  --url https://mcp.example.com/postgres

# Add a server by command (local process)
hermes mcp add my-tools \\
  --command python \\
  --args /path/to/my_mcp_server.py

# List what's configured
hermes mcp list

# Test the connection
hermes mcp test my-postgres

# Configure which tools to expose (some servers expose dozens)
hermes mcp configure my-postgres
```

That's it. The next time you start a session (or run `/reload-mcp`), Hermes discovers all tools from the registered servers and makes them available.

### The Config File Way

For more control, edit your `config.yaml` directly:

```yaml
mcp_servers:
  my-postgres:
    command: "python"
    args: ["/home/you/mcp-servers/postgres_server.py"]
    env:
      DATABASE_URL: "postgresql://..."
  my-figma:
    url: "https://mcp.figma.io/sse"
    headers:
      Authorization: "Bearer ${FIGMA_TOKEN}"
```

Environment variable interpolation (`${VARIABLE}`) pulls from your `.env` file, so you don't paste tokens inline.

## Building a Custom MCP Server

The real power is writing your own. Here's a minimal MCP server that exposes a "query internal API" tool:

```python
#!/usr/bin/env python3
"""MCP server: Internal API query tool."""

import json
import httpx
import os
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("internal-api")

@app.list_tools()
async def list_tools():
    return [
        {
            "name": "query_internal_api",
            "description": "Query the internal REST API. Returns JSON.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "endpoint": {
                        "type": "string",
                        "description": "API endpoint path (e.g., /products/123)"
                    },
                    "method": {
                        "type": "string",
                        "enum": ["GET", "POST", "PUT", "DELETE"],
                        "description": "HTTP method"
                    },
                    "body": {
                        "type": "object",
                        "description": "Request body (for POST/PUT)"
                    }
                },
                "required": ["endpoint"]
            }
        }
    ]

@app.call_tool()
async def call_tool(name, arguments):
    if name != "query_internal_api":
        return [{"type": "text", "text": f"Unknown tool: {name}"}]

    base_url = os.environ.get("INTERNAL_API_URL", "https://api.internal.example.com")
    token = os.environ.get("INTERNAL_API_TOKEN", "")

    method = arguments.get("method", "GET")
    endpoint = arguments["endpoint"]
    body = arguments.get("body")

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=f"{base_url}{endpoint}",
            json=body,
            headers={"Authorization": f"Bearer {token}"}
        )

    return [{"type": "text", "text": response.text}]

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

Save this as `internal_api_server.py`, install the `mcp` package (`pip install mcp`), then register it:

```bash
hermes mcp add internal-api \
  --command python \
  --args /path/to/internal_api_server.py \
  --env INTERNAL_API_URL=https://api.internal.example.com \
  --env INTERNAL_API_TOKEN=your_token_here
```

Now your Hermes agent can call `query_internal_api` like any built-in tool. It'll show up in the tool list, get proper schema validation, and return results directly into the conversation.

## The Architecture: How MCP Fits Into Hermes

Understanding the data flow helps debug problems:

```
┌──────────────┐     JSON-RPC/stdio      ┌───────────────────┐
│  Hermes Agent │◄───────────────────────►│   MCP Server      │
│  (client)     │   discover → list_tools │   (your server)   │
│               │   call_tool → results    │                   │
└──────────────┘                          └───────┬───────────┘
                                                  │
                                          HTTP/gRPC/SQL
                                                  │
                                          ┌───────▼───────────┐
                                          │  External Service │
                                          │  (DB, API, etc.)  │
                                          └───────────────────┘
```

Hermes acts as the MCP **client**. Each registered server is a separate process communicating over stdin/stdout (local) or Server-Sent Events (remote). The agent:

1. **Discovers** tools at session start via `list_tools`
2. **Validates** arguments against the schema before calling
3. **Dispatches** via `call_tool` with structured arguments
4. **Receives** results back as text content blocks

This is why `/reload-mcp` exists — it re-runs discovery without restarting the entire session.

## Patterns That Actually Work

### Pattern 1: Database Read-Only Bridge

Most teams need their agent to query data but don't want it mutating tables. Build an MCP server that wraps a read-only connection:

```python
@app.call_tool()
async def call_tool(name, arguments):
    if name == "run_query":
        query = arguments["sql"]
        # Enforce read-only
        normalized = query.strip().upper()
        if not normalized.startswith("SELECT"):
            return [{"type": "text", "text": "Error: Only SELECT queries are allowed."}]

        # Execute and return
        async with pool.acquire() as conn:
            rows = await conn.fetch(query)
            columns = [col.name for col in rows[0].keys()] if rows else []
            # Format as markdown table for readability
            result = format_as_markdown_table(columns, rows)
            return [{"type": "text", "text": result}]
```

The guard clause is simple but effective. The agent can explore your data, run analytics, and answer questions — but it can't `DROP TABLE users`.

### Pattern 2: Multi-Service Orchestrator

One server, multiple related tools. If your team uses Notion, Linear, and Slack, build a single "project tools" server that exposes all three:

```python
@app.list_tools()
async def list_tools():
    return [
        {
            "name": "notion_search",
            "description": "Search Notion workspace",
            "inputSchema": { ... }
        },
        {
            "name": "linear_create_issue",
            "description": "Create a Linear issue",
            "inputSchema": { ... }
        },
        {
            "name": "slack_send_message",
            "description": "Send a Slack message to a channel",
            "inputSchema": { ... }
        },
    ]
```

Grouping related tools into one server reduces process overhead and keeps configuration centralized.

### Pattern 3: Stateful Workflow Server

MCP servers stay alive for the duration of a session. Use that for stateful operations:

```python
# Maintains a git worktree across the entire conversation
worktrees: dict[str, str] = {}

@app.call_tool()
async def call_tool(name, arguments):
    if name == "create_worktree":
        branch = arguments["branch"]
        path = checkout_worktree(branch)
        worktrees[branch] = path
        return [{"type": "text", "text": f"Worktree ready at {path}"}]

    if name == "commit_worktree":
        branch = arguments["branch"]
        path = worktrees.get(branch)
        if not path:
            return [{"type": "text", "text": "No active worktree for that branch."}]
        # ... commit logic
```

The server process holds state that persists across tool calls within a session, which is something stateless HTTP APIs can't do.

## Common Pitfalls (Learned the Hard Way)

### 1. Server startup timeout

MCP servers need to respond to the `initialize` handshake within 30 seconds. If your server does heavy setup on import (large model loading, database migrations), move that into lazy initialization:

```python
# BAD — blocks startup
model = load_large_model()  # 45 seconds

# GOOD — lazy load on first call
model = None

async def get_model():
    global model
    if model is None:
        model = await load_large_model()
    return model
```

### 2. Missing error descriptions

When a tool call fails, the MCP spec sends error details back to the agent. But if your error messages are vague (`"An error occurred"`), the agent can't self-correct. Always return actionable error text:

```python
# BAD
return [{"type": "text", "text": "Query failed"}]

# GOOD
return [{"type": "text", "text": 
    f"Query failed: column '{col}' does not exist in table '{table}'. "
    f"Available columns: {', '.join(valid_columns)}"}]
```

The agent reads these messages. If they're informative, it retries with corrected parameters. If they're opaque, it hallucinates a fix and makes things worse.

### 3. Forgetting `/reload-mcp`

After adding or modifying an MCP server, running `hermes mcp add` alone doesn't update a running session. You need to:

- Run `/reload-mcp` in an active session, **or**
- Start a new session (`/new`)

Tool changes don't apply mid-conversation — this is intentional, to preserve prompt caching. Don't debug for 30 minutes wondering why the new tool isn't showing up before remembering this.

### 4. Stdio vs SSE confusion

Local servers use stdio (stdin/stdout communication). Remote servers use SSE (Server-Sent Events over HTTP). The `--command` flag starts stdio mode; the `--url` flag connects to SSE. Don't mix them — a `--command` server that also opens an HTTP port will confuse Hermes and potentially leak data to localhost.

### 5. Environment variable isolation

Each MCP server process gets its own environment. They don't inherit your shell environment — they only get what you pass via `--env` flags or what's in `config.yaml`. If a server mysteriously can't find your `DATABASE_URL`, this is why:

```bash
# Explicitly pass the environment
hermes mcp add postgres-query \
  --command python \
  --args /path/to/pg_server.py \
  --env DATABASE_URL="${DATABASE_URL}"
```

The `${VARIABLE}` syntax interpolates from the `.env` file at registration time, not at runtime.

## Testing and Debugging

### Verify Server Health

```bash
# Quick check — does Hermes see the server?
hermes mcp list

# Test connectivity and tool discovery
hermes mcp test my-postgres
```

### In-Session Debugging

```python
# In your MCP server, add diagnostic logging
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
```

Logs go to stderr, which Hermes captures. Check the gateway log for MCP errors:

```bash
grep -i "mcp" ~/.hermes/logs/gateway.log | tail -20
```

### Tool Granularity

A common mistake is exposing tools that are too fine-grained (one tool per API endpoint) or too coarse-grained (one tool that takes arbitrary Python). Aim for **semantic tools** — operations that map to what the agent would naturally ask for:

| Bad (too granular) | Good (semantic) |
|---|---|
| `http_get`, `http_post`, `http_put` | `query_orders`, `update_customer` |
| `run_python` | `analyze_csv`, `plot_timeseries` |
| `sql_query` | `search_products`, `get_customer_metrics` |

The agent doesn't know your API schema. Named, semantic tools give it clear affordances.

## When to Use MCP vs. Built-in Tools vs. Skills

This comes up often enough to warrant a decision framework:

| Approach | Best For | Maintenance |
|---|---|---|
| **Built-in toolset** | Core capabilities (terminal, file, web, browser) | Handled by Hermes updates |
| **Hermes skill** | Procedural knowledge, workflows, prompts you reload | Markdown files in `~/.hermes/skills/` |
| **MCP server** | External service integration, persistent connections, stateful workflows | You maintain the server process |

The rule of thumb: if it's a workflow or prompt pattern, write a skill. If it's connecting to an external system, write an MCP server. If it's running shell commands or reading files, use built-in tools.

## The Production Checklist

Before running MCP servers in a production Hermes setup:

- [ ] Server starts within 10 seconds (lazy-load anything slower)
- [ ] All environment variables explicitly passed (no shell env reliance)
- [ ] Error messages include context for agent self-correction
- [ ] Read-only guards on database tools (unless you explicitly want writes)
- [ ] Tool schemas are specific (narrow `enum` values, clear descriptions)
- [ ] Server process supervised (systemd, pm2, or Docker restart policy)
- [ ] `/reload-mcp` tested after config changes
- [ ] Gateway logs checked for MCP connection errors after restart

MCP servers are the integration layer that turns Hermes from a terminal coding assistant into a full-stack operations agent. The setup is straightforward, the protocol is well-specified, and the composability means you can keep extending without ever modifying core.

Go build something.