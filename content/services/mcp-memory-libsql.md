---
slug: mcp-memory-libsql
title: "MCP Memory (libSQL): Persistent Agent Memory"
excerpt: "High-performance persistent memory system for Model Context Protocol powered by libSQL — vector search, semantic knowledge storage, and relationship management for AI agents."
category: Memory
tags:
  - mcp
  - memory
  - vector-search
  - libsql
  - agents
  - persistence
provider: Steven (spences10)
pricing_model: Self-hosted (free)
price: "Free / open-source"
website: https://github.com/spences10/mcp-memory-libsql
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-07-22"
---

# MCP Memory (libSQL): Persistent Agent Memory

## What it is

MCP Memory (libSQL) is a high-performance persistent memory system built for the Model Context Protocol. It uses libSQL (Turso's open-source SQLite fork) as the backing store, providing vector search, semantic knowledge storage, and efficient relationship management — all exposed through the MCP interface so any compatible agent can use it.

## When to use it

- Your agent needs to remember facts, preferences, or context across sessions.
- You want semantic recall (find similar past interactions) without standing up a full vector database.
- You already use MCP-compatible agents (Hermes, Claude, Cursor, etc.) and want plug-and-play memory.
- You prefer a lightweight SQLite-based store over Pinecone or Chroma for simpler deployments.
- You need structured relationship management (entity A relates to entity B) alongside vector search.

## What it does well

- **MCP-native.** Works out of the box with any agent that speaks MCP — no custom integration needed.
- **Vector search.** Built-in semantic similarity search for finding relevant memories by meaning, not just keywords.
- **Knowledge graph support.** Store and query relationships between entities, not just flat key-value pairs.
- **libSQL performance.** SQLite-derived engine is fast for single-node workloads and easy to deploy.
- **TypeScript implementation.** Easy to extend, audit, and contribute to.
- **Active community.** 87+ stars on GitHub with regular updates as of July 2026.

## Limitations

- Not designed for distributed/multi-node deployments (libSQL replication is optional but adds complexity).
- Vector search quality depends on embedding model choice — you bring your own embeddings.
- No built-in UI for browsing memories — CLI and API access only.
- MCP protocol knowledge required for advanced configuration.

## How to get started

Install via npm, configure your libSQL database URL, and add the MCP server to your agent's configuration. The server exposes memory storage and retrieval endpoints through the standard MCP protocol.

- **GitHub:** [spences10/mcp-memory-libsql](https://github.com/spences10/mcp-memory-libsql)
- **Language:** TypeScript
- **Stars:** 87+