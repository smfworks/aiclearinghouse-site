---
slug: code-atlas
title: "Code Atlas"
excerpt: "A code intelligence graph that gives AI coding agents deep, token-efficient understanding of your codebase — structure, docs, and dependencies in one searchable graph. MCP-compatible, self-hosted, Apache 2.0."
category: Tools
tags:
  - code-intelligence
  - mcp
  - graph
  - semantic-search
  - agents
  - self-hosting
  - open-source
provider: SerPeter (open source)
pricing_model: Free
price: "Open source (Apache 2.0). Self-hosted with Docker. No API costs."
website: https://github.com/SerPeter/code-atlas
image: /images/agentmarketplace/services-hero.svg
order: 101
last_verified: "2026-09-02"
---

# Code Atlas

## What it is

Code Atlas builds a graph database of your entire codebase — code structure, documentation, and dependencies — and exposes it as 23 MCP tools that AI coding agents can query to understand, navigate, and reason about your code. It combines three search modalities in one system: graph traversal (who calls this function?), semantic search (find code by meaning), and BM25 keyword search (exact name/message matches). All powered by Memgraph as the backend, with a SQLite fallback when Docker is not available.

The core problem it solves: every time an AI agent touches a codebase, it burns tokens figuring out where things are. On large projects, agents can spend 30–50% of their context window on orientation before writing a single line of code. Code Atlas externalizes the mental model a developer builds of a codebase — structure, meaning, names — as a queryable graph, so agents can orient in one tool call instead of grepping through five files.

Apache 2.0 licensed, self-hosted, MCP-compatible with Claude Code, Cursor, Windsurf, and any MCP client. Available on PyPI as `code-atlas-mcp`.

## When to use it

- Your AI coding agent is burning context on codebase orientation before it gets to the actual task.
- You have a monorepo with cross-project dependencies that agents struggle to navigate.
- You want agents to understand documentation alongside code (ADRs, READMEs, design docs linked to the code they describe).
- You need "blast radius" analysis — what breaks if I change this function — as an agent query.
- You want all of this self-hosted with no data leaving your machine and no additional API costs.

## What it does well

- **Three search modes, one system.** Graph traversal, semantic search, and BM25 keyword search are fused via reciprocal rank fusion (RRF) in the `hybrid_search` tool. The agent does not need to know which search mode to use — hybrid search auto-adjusts weights by query shape.
- **AST-level incremental indexing.** Only re-indexes entities that actually changed, not entire files. This makes re-indexing fast even on large codebases.
- **Documentation as first-class.** Markdown docs, ADRs, and READMEs are indexed with links to the code they describe. An agent can ask "what does the authentication documentation say about token refresh?" and get a grounded answer.
- **Monorepo-native.** Auto-detects sub-projects, tracks cross-project dependencies, supports scoped queries.
- **Blast radius analysis.** The `blast_radius` tool computes transitive closure of callers and callees — "what breaks if I change this" — with every hit reporting the path it was found via.
- **Token-efficient by design.** Tool definitions are self-documented so agents can one-shot any tool without calling a guide first. Search results are budget-aware — the tool prioritizes what matters most rather than dumping everything.
- **Self-hosted, no API costs.** Local embeddings via TEI (Text Embeddings Inference), no extra API keys. All intelligence runs through your existing agent subscription.
- **Human-readable too.** `atlas ui` serves the same graph as a local web interface with an architecture-health view (DSM, propagation cost, dependency cycles) for spotting codebase decay.

## Honest limitations

- **Very small community.** 6 GitHub stars as of September 2026. This is a single-developer project, not an ecosystem. Expect to read source code for edge cases and file issues yourself.
- **Requires Python 3.14+.** This is an unusually high floor. Most production environments are on 3.10–3.12. If your agent runtime does not have 3.14 available, you cannot use it without a separate environment.
- **Memgraph dependency for full features.** The SQLite fallback works but loses community detection (`find_communities`) and some analyses differ. You need Docker running with Memgraph for the full feature set.
- **23 MCP tools is a lot of context.** The full tool definitions total 5,791 tokens. For agents with tight context budgets, this is a significant overhead cost just for registration. The "Search" subset (name + description only) is 2,360 tokens, which is more manageable but still substantial.
- **No hosted option.** Self-hosted only. If you do not want to run Docker and Memgraph, this is not for you.
- **New project, untested at scale.** The README mentions a ~1,400 entity test repo. Performance on codebases with 100K+ entities is unverified.
- **No multi-language benchmark.** Works on Python codebases. Support for other languages depends on AST parsing coverage, which is not documented.

## Pricing reality

Code Atlas is free and open source under Apache 2.0. You pay for:

- **Compute infrastructure** if you self-host: Docker, Memgraph, and TEI all run locally. A modest workstation is sufficient for the SQLite fallback; Memgraph wants Docker with adequate RAM.
- **No additional API costs.** Embeddings are local via TEI. No OpenAI or Anthropic API keys needed for the intelligence layer.
- **Your agent's existing API costs** are the only ongoing cost. Code Atlas reduces those by cutting orientation tokens, but it does not eliminate them.

Install: `pip install code-atlas-mcp` (requires Python 3.14+).