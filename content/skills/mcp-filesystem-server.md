---
slug: mcp-filesystem-server
title: MCP Filesystem Server
category: Tooling
excerpt: Give agents scoped, read-write access to a specific directory through the Model Context Protocol. A safe default for file operations.
tags:
  - hermes
  - mcp
  - filesystem
  - tools
for: Hermes Agent
author: Community
install: hermes skill install mcp-filesystem-server
dependencies:
  - Hermes Agent
  - Node.js 18+
  - A dedicated workspace directory
image: /images/skills/tooling.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 13
last_verified: 2026-06-24
---

# MCP Filesystem Server

Filesystem access is one of the most common things an agent needs and one of the easiest ways to cause accidental damage. This skill exposes a scoped filesystem server through the Model Context Protocol so the agent can read, write, and list files only inside a directory you define.

## What it is

A lightweight MCP server that exposes directory-scoped file operations to an agent. It runs as a separate process, registers its tools with the Hermes gateway, and rejects any path that escapes the configured workspace.

## Who it targets

- Agent builders who need safe file access without giving the agent free rein over the whole machine.
- Teams running Hermes or OpenClaw who want file tools to follow the MCP standard.
- Users who want to isolate each agent to its own workspace directory.

## What it does

- `read_file` — read text or binary files within scope.
- `write_file` — create or overwrite files within scope.
- `list_directory` — list files and folders.
- `search_files` — grep-style search inside the workspace.
- `get_file_info` — metadata, size, and modification time.

All paths are canonicalized and checked against the configured root. Any attempt to access files outside the root returns an error.

## Dependencies

- Hermes Agent
- Node.js 18+
- A dedicated workspace directory

## How to install

```bash
hermes skill install mcp-filesystem-server
```

Then configure the root directory in your agent config:

```yaml
skills:
  mcp-filesystem-server:
    root: /home/agent/workspace
    allow_write: true
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
