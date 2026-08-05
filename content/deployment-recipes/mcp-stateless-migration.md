---
slug: mcp-stateless-migration
title: Migrate MCP Servers to the 2026-07-28 Stateless Spec
excerpt: The MCP specification went stateless on July 28, 2026. This recipe walks through migrating your MCP servers from the old stateful protocol to the new stateless HTTP model.
category: Self-Hosting
tags:
  - mcp
  - protocol
  - migration
  - api
  - production
order: 99
last_verified: "2026-08-05"
difficulty: Intermediate
estimated_time: "30 min"
---

# Migrate MCP Servers to the 2026-07-28 Stateless Spec

## The promise

The Model Context Protocol specification was finalized on July 28, 2026, replacing the bidirectional stateful protocol with a stateless HTTP model. This recipe walks through migrating your MCP servers to the new spec.

## What you will get

- MCP servers that handle stateless HTTP requests without persistent connections
- Load-balancer-friendly architecture (any request can land on any server)
- Header-based routing with `Mcp-Method` and `Mcp-Name` headers
- Cacheable tool catalogs and server discovery via `server/discover` RPC

## Prerequisites

- An existing MCP server using the pre-July-2026 stateful protocol
- An MCP SDK (TypeScript, Python, Go, or Rust — all four have been updated)
- A test client to verify the migration

## Steps

1. **Audit for session dependencies.** Search your server code for `Mcp-Session-Id`, `initialize`/`initialized` exchanges, and any state stored between requests. Every dependency on session continuity must be removed or moved to an external store.

2. **Update your MCP SDK.** Pull the latest version of your SDK. All four official SDKs (TypeScript, Python, Go, Rust) shipped stable releases supporting the 2026-07-28 spec.

```bash
# Example for Python SDK
pip install --upgrade mcp
```

3. **Remove the initialize handshake.** The `initialize`/`initialized` exchange and `Mcp-Session-Id` header are retired. Each request now carries its protocol version, client identity, and capabilities in `_meta`.

4. **Implement server/discover (optional).** If your clients need to learn server capabilities before acting, implement the new `server/discover` RPC. This is not required — any request can land on any server without discovery.

5. **Add header-based routing.** The new spec adds `Mcp-Method` and `Mcp-Name` HTTP headers. Use these for routing, logging, and caching:

```
Mcp-Method: tools/call
Mcp-Name: search
```

6. **Move stateful data to external stores.** If your server maintained state between requests (user sessions, conversation history, tool-call chains), move that state to Redis, a database, or the client's `_meta` payload.

7. **Update your load balancer.** The stateless model means you can put MCP servers behind any HTTP load balancer without sticky sessions. Remove session affinity rules.

8. **Test with updated clients.** Point your MCP clients at the migrated server. Verify tool listing, tool calls, and resource reads all work without session establishment.

## Verification

- Requests succeed without a prior `initialize` handshake
- Two identical requests to different server instances return the same result
- `Mcp-Method` and `Mcp-Name` headers appear in request logs
- Load balancer does not require sticky sessions
- Tool catalog is cacheable (same response from any instance)

## Troubleshooting

- **Client errors about missing session:** The client SDK is outdated. Update to the latest version that supports the 2026-07-28 spec.
- **State lost between requests:** You are still relying on in-memory session state. Move it to an external store.
- **Tool catalog changes between instances:** Ensure all instances load the same tool definitions from a shared config, not local state.

## Honest notes

If you only use MCP servers through an agent (Hermes, Claude, etc.), you do not need to migrate your own servers today — your client and server providers handle the upgrade. This recipe is for teams running their own MCP servers. Read the official migration notes for your SDK before starting, as details vary by language.