---
slug: migrating-to-mcp-2026-07-28
title: "Migrating to MCP 2026-07-28: The Stateless Protocol Update"
excerpt: "The MCP spec went stateless on July 28, 2026. Here is what actually breaks, what is deprecated, and how to migrate your servers without downtime."
category: Guides
tags: [mcp, protocol, migration, stateless, agents, architecture]
order: 28
last_verified: "2026-08-12"
---

# Migrating to MCP 2026-07-28: The Stateless Protocol Update

The Model Context Protocol released its 2026-07-28 specification on July 28, 2026. It is the most significant MCP update since the protocol launched — and it is a breaking change. This guide covers what actually changes, what breaks, and how to migrate without downtime.

## What changed in one paragraph

The MCP transport layer went stateless. The protocol removed the initialization handshake, eliminated protocol-level sessions, shifted to a stateless HTTP core, and moved tasks and subscriptions into extension namespaces. Enterprise-managed authorization was added. This is not a deprecation — it is a wire protocol change. Servers that relied on session state or the initialization handshake will break against clients implementing the new spec.

## The four changes that matter

### 1. The session is gone

The `initialize` handshake and protocol-level session IDs are removed. Every request is now self-contained — it carries everything the server needs to process it. There is no "start a session, then make calls within it" flow anymore.

**What breaks:** Servers that store state per session (connection state, user context, tool registries scoped to a session) will not work against 2026-07-28 clients. The server must be able to process any request without prior context from a session.

**What to do:** Move any session-scoped state into the request payload or into a backing store keyed by an identifier the client provides per-request. If your server genuinely needs stateful behavior (streaming responses, long-running tasks), use the new Tasks extension.

### 2. Subscriptions replace long-polling

Change notifications moved from HTTP GET long-polling endpoints to a single `subscriptions/listen` stream that clients opt into per notification type. The old notification endpoint is gone.

**What breaks:** Any server using HTTP GET endpoints for change notifications.

**What to do:** Implement the `subscriptions/listen` stream endpoint. Clients subscribe to specific notification types and receive updates through a single stream. This is cleaner than long-polling and works better behind load balancers.

### 3. Tasks moved to an extension

Tasks graduated from the experimental core into the `io.modelcontextprotocol/tasks` extension. The new interface uses poll-based `tasks/get` and a new `tasks/update`. This means tasks are no longer a core protocol concern — they are an extension that servers can choose to implement.

**What breaks:** Servers implementing tasks using the old experimental core API. The wire format changed.

**What to do:** Migrate task handling to the new extension namespace. Update your task creation, polling, and update endpoints to the new `tasks/get` and `tasks/update` methods.

### 4. Enterprise-managed authorization

The new spec adds enterprise-managed authorization flows. An administrator can define which MCP servers employees may access, and joining, changing roles, and leaving the company follows normal identity policies. This is not automatic SSO — the client, server, authorization service, and identity provider must all support the flow.

**What breaks:** Nothing directly. But servers that want to participate in enterprise auth flows need to implement the new authorization patterns.

**What to do:** If you are building enterprise MCP servers, implement the authorization patterns from the spec. If you are running internal MCP servers for a small team, this is optional.

## Migration decision matrix

| Your server pattern | Breaking? | Priority | Action |
|---|---|---|---|
| Uses `initialize` handshake | Yes — high | Fix first | Remove handshake. Make every request self-contained. |
| Stores state per session | Yes — high | Fix first | Move state to request payload or backing store. |
| Uses HTTP GET long-polling for notifications | Yes — medium | Fix second | Migrate to `subscriptions/listen` stream. |
| Implements tasks in experimental core | Yes — medium | Fix second | Migrate to `io.modelcontextprotocol/tasks` extension. |
| Uses bearer token auth (stateless) | No | None | Already compatible. |
| HTTP-based transport only | No | None | Already compatible. |
| Uses stdio transport | No | None | stdio is unaffected by the stateless change. |

## Recommended migration approach

1. **Audit first.** Use our [MCP Stateless Migration Helper skill](/skills/mcp-stateless-migration-helper) to scan your server source for breaking patterns. Do not guess — scan.

2. **Run both versions during migration.** Keep your 2025-11-25 server running alongside the new 2026-07-28 version. Route clients to the new version progressively. This avoids a big-bang migration where everything breaks at once.

3. **Fix breaking changes first.** The session removal and handshake elimination are the highest priority. If your server is already stateless (uses bearer tokens, no session storage), you may be closer than you think.

4. **Test against a 2026-07-28 client.** Claude Code, Hermes Agent, and other MCP clients are updating to the new spec. Test your migrated server against a client running the new spec before declaring migration complete.

5. **Deprecate the old server on a timeline.** Set a date (30-60 days) after which the old server stops accepting connections. Communicate this to your clients.

## What you do not need to change

- **stdio transport servers** are unaffected. The stateless change applies to HTTP transport.
- **Tool definitions and schemas** do not change. Your tool catalog stays the same.
- **Resource definitions** do not change.
- **Server capabilities negotiation** is simplified (no handshake) but the capability list itself is compatible.

## The strategic context

The move to stateless is not arbitrary. It reflects where agent infrastructure is heading. Stateless servers are easier to deploy behind load balancers, easier to scale horizontally, and easier to operate in serverless environments. The session model worked for development but created operational friction at production scale — sticky sessions, connection draining, state replication. Going stateless removes all of that.

If you are building new MCP servers today, build them stateless from the start. Do not add session state. Do not implement a handshake. Every request should be processable independently. This is the forward-compatible architecture, and it is also the simpler one.

## Bottom line

The 2026-07-28 spec is a real breaking change, not a version bump. But the scope of what breaks is narrower than it sounds: if your server is already stateless and uses bearer token auth, you may need zero changes. If your server relies on sessions and the handshake, you need to migrate — and the migration is straightforward once you identify what depends on session state. Audit, fix breaking changes, test against a new-spec client, and ship.