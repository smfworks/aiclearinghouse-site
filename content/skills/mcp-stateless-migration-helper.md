---
slug: mcp-stateless-migration-helper
title: MCP Stateless Migration Helper
category: Integration
excerpt: Audit your MCP servers against the 2026-07-28 stateless spec and generate a migration checklist for breaking changes.
tags:
  - mcp
  - migration
  - stateless
  - protocol
  - hermes
for: Hermes Agent
author: SMF Works
install: hermes skill install mcp-stateless-migration-helper
dependencies:
  - Hermes Agent
  - Node.js 18+
  - One or more MCP server implementations to audit
image: /images/skills/integration.svg
source: https://github.com/smfworks/aiclearinghouse-site
order: 115
last_verified: "2026-08-12"
---

# MCP Stateless Migration Helper

## What it is

A Hermes skill that audits your existing MCP server implementations against the Model Context Protocol 2026-07-28 specification and generates a migration checklist. The 2026-07-28 spec is a breaking update — it removes protocol-level sessions, eliminates the initialization handshake, shifts to a stateless HTTP core, and changes how authorization, tasks, and subscriptions work. This skill helps you find what breaks before your users do.

## Who it targets

- Teams running MCP servers built against the 2025-11-25 or earlier spec
- Agent platform maintainers who need to audit multiple MCP integrations
- Developers who saw the 2026-07-28 announcement and need to know "does this affect me?"

## What it does

- Scans MCP server source directories for patterns that the stateless spec breaks:
  - Protocol-level session usage (`session_id`, `initialize` handshake, stateful connections)
  - HTTP GET long-polling endpoints (replaced by `subscriptions/listen` stream)
  - Tasks implementation using the old experimental core (now in `io.modelcontextprotocol/tasks` extension)
  - Authorization flows that relied on server-side session state
- Generates a per-server report: what to change, what is already compatible, what is deprecated
- Produces a migration checklist with priority ordering (breaking changes first, deprecations second)
- Flags servers that need no changes (already stateless)

## Dependencies

- Hermes Agent (for execution)
- Node.js 18+ (for source scanning)
- Your MCP server source code accessible on the filesystem

## How to install

```bash
hermes skill install mcp-stateless-migration-helper
```

## Example usage

Audit a single MCP server:

```bash
hermes mcp-migrate --path ./my-mcp-server --spec 2026-07-28
```

Audit all MCP servers in a monorepo:

```bash
hermes mcp-migrate --path ./mcp-servers/ --recursive --output migration-report.md
```

Example report output:

```
MCP Migration Report: my-mcp-server
Spec target: 2026-07-28

BREAKING CHANGES (must fix before upgrading):
  1. server.ts:42 — Uses session_id in initialize handshake
     Action: Remove initialize handshake. Every request is now self-contained.
  2. routes/notify.ts:8 — HTTP GET long-polling for change notifications
     Action: Migrate to subscriptions/listen stream endpoint.

DEPRECATIONS (fix before next spec version):
  3. tasks/handler.ts:15 — Tasks in experimental core
     Action: Move to io.modelcontextprotocol/tasks extension. Use tasks/get and tasks/update.

ALREADY COMPATIBLE:
  - Authorization uses bearer tokens (no session state) ✓
  - Transport is HTTP-based ✓

Priority: Fix items 1-2 before deploying against 2026-07-28 clients.
```

## Why this matters

The MCP 2026-07-28 spec is the most significant protocol update since MCP launched. The shift to stateless means servers that relied on session state, initialization handshakes, or long-polling will break against clients implementing the new spec. This is not a "nice to have" migration — it is a "your server stops working" migration if your clients upgrade. This skill turns a manual code review into a 30-second scan.