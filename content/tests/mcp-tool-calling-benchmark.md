---
slug: mcp-tool-calling-benchmark
title: "MCP Tool Calling Benchmark"
excerpt: "Compared agents on correctly invoking Model Context Protocol servers: filesystem, GitHub, and Postgres."
category: "Integration Benchmark"
tags:
  - mcp
  - model-context-protocol
  - tools
  - agents
  - benchmark
agents:
  - Claude Code
  - Cline
  - Cursor
  - OpenClaw
llm: "Claude 4 Sonnet"
winner: "Claude Code"
date: "2026-06-15"
order: 6
last_verified: "2026-06-15"
results:
  - agent: Claude Code
    score: 91
    time_minutes: 11
    tokens: 54000
    cost_usd: 1.85
    pass: true
    notes: "Correctly routed all three MCP servers and recovered from a malformed Postgres query."
  - agent: Cline
    score: 85
    time_minutes: 14
    tokens: 48000
    cost_usd: 1.55
    pass: true
    notes: "Handled filesystem and GitHub cleanly. Needed one retry to get Postgres connection string right."
  - agent: Cursor
    score: 72
    time_minutes: 19
    tokens: 67000
    cost_usd: 2.25
    pass: true
    notes: "Worked but required manual MCP config setup; not as plug-and-play."
  - agent: OpenClaw
    score: 63
    time_minutes: 26
    tokens: 43000
    cost_usd: 0.00
    pass: false
    notes: "Local-first cost advantage, but MCP skill setup was still manual and documentation sparse."
---

# MCP Tool Calling Benchmark

## The task

We configured three MCP servers and asked each agent to complete a three-step workflow:

1. Read a JSON file from the filesystem MCP server.
2. Open a GitHub issue using the GitHub MCP server.
3. Query a Postgres table using the Postgres MCP server and return the count of rows.

The task tested whether agents could discover available tools, pass correct arguments, and recover from errors.

## Scoring rubric

| Criterion | Weight | Max points |
|-----------|--------|------------|
| Filesystem read succeeds | 20% | 20 |
| GitHub issue created correctly | 25% | 25 |
| Postgres query returns correct count | 25% | 25 |
| Handles tool errors gracefully | 15% | 15 |
| Speed and cost | 15% | 15 |

## Methodology

- Same MCP server configuration for every agent.
- Prompt was a single natural-language instruction: "Read config.json, open a GitHub issue titled 'Test MCP', and tell me how many users are in the users table."
- Agents could retry on their own. Manual intervention counted against the score.

## Key findings

- **Claude Code** had the best tool-use reasoning. It parsed MCP schemas, asked for missing parameters, and recovered from a malformed query.
- **Cline** was nearly as good. Its VS Code integration made config inspection easy.
- **Cursor** succeeded but the setup was more manual. Cursor does not assume MCP servers are already available.
- **OpenClaw** is promising for local, zero-API-cost workflows, but MCP skill setup is still early.

## Honest caveats

- MCP is a young standard. Server quality and agent support vary week by week.
- We used well-maintained reference servers. Real-world custom MCP servers may be flakier.
- OpenClaw's zero cost reflects local inference; hardware and electricity still have a cost.

## When to choose which

- **Claude Code**: production tool-use where correctness and recovery matter.
- **Cline**: VS Code workflows with local models and MCP together.
- **Cursor**: when visual context and tool use are both needed.
- **OpenClaw**: self-hosted, privacy-first setups where you are willing to configure skills manually.
