---
slug: agent-plugins-standard-2026
title: "Agent Plugins 1.0: What the New Packaging Standard Means for Your Stack"
excerpt: "A vendor-neutral standard that bundles Agent Skills and MCP servers into one portable directory. Published August 2026 by Vercel, AWS, GitHub, Microsoft, OpenAI, and Google. Here is what changes for agent developers."
category: Guides
tags:
  - agent-plugins
  - mcp
  - skills
  - standards
  - interoperability
  - packaging
order: 102
last_verified: "2026-09-09"
---

# Agent Plugins 1.0: What the New Packaging Standard Means for Your Stack

On August 6, 2026, a group of vendors including Vercel, AWS, Anysphere (Cursor), GitHub, Microsoft, OpenAI, and Google published Agent Plugins 1.0 — a portable directory format that bundles Agent Skills and MCP server configurations into one installable package. Hermes Agent and OpenClaw joined the compatibility matrix shortly after.

This is not a new model protocol, a new MCP spec, or a new skill format. It is a packaging layer that says: put your skills, your MCP config, and your manifest in one directory, and any compatible agent client can load them.

## What a plugin is

A plugin is a directory with a required `plugin.json` manifest:

```
my-plugin/
├── plugin.json          # $schema + name required; version, description, license, author, repository
├── skills/
│   └── {name}/SKILL.md  # Agent Skills in the existing Agent Skills format
├── mcp.json             # mcpServers: stdio | streamable-http | sse
└── com.vendor.client/   # namespaced client-specific extensions
```

Key design decisions in the spec:

- **Skills keep their existing format.** If you already ship a `SKILL.md`, you do not rewrite it. You move it into `skills/{name}/SKILL.md`.
- **MCP config uses a closed schema.** You cannot paste a Cursor or VS Code MCP config and expect it to work. The `mcp.json` uses explicit `stdio`, `streamable-http`, or `sse` transport variants.
- **Path containment is enforced.** Runtime variables `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` resolve at load time. The `command` field does no shell interpolation. Credentials must not be embedded in the manifest.
- **Failure isolation.** One plugin failing does not break other plugins or the agent itself.

## What this changes

### For skill authors

If you already write Hermes skills or Agent Skills, the migration is structural, not semantic. Move your `SKILL.md` into `skills/{name}/`, add a `plugin.json`, and you have a plugin. The skill content — the frontmatter, the scripts, the references — stays the same.

The win is distribution. A plugin that conforms to the spec can be loaded by ChatGPT, Cursor, GitHub Copilot, VS Code, Hermes, and OpenClaw without modification. One package, multiple agent clients.

### For MCP server authors

The `mcp.json` in a plugin is a closed schema, not a copy of your existing client config. If you ship an MCP server, you need to write a plugin-compatible `mcp.json` that declares your server's transport type and arguments. This is extra work but the payoff is portability — your MCP server becomes installable across the entire compatible client matrix.

### For agent platform teams

Agent Plugins 1.0 defines only the packaging layer. It does not make installation, registries, permissions, or update systems portable. Each client still handles its own install flow, permission model, and update mechanism. The spec is an interoperability floor, not a full platform.

## What it does not solve

- **No portable permissions model.** Each client decides what a plugin is allowed to do. The spec does not define a cross-client permission system.
- **No registry or marketplace.** The spec defines the package format, not where you find or publish packages. Distribution is still per-ecosystem.
- **No installer standard.** How a plugin gets onto a user's machine is out of scope. `hermes plugins install` and `cursor plugins install` are different commands with different flows.
- **No update mechanism.** Version checking and updates are the client's responsibility.

## Decision framework

| Situation | Recommendation |
|-----------|---------------|
| You ship a single Hermes skill | Migrate to plugin format now. The cost is low and you get cross-client distribution. |
| You ship an MCP server | Write a plugin-compatible `mcp.json`. Test across at least two clients before publishing. |
| You maintain a private internal skill set | Optional. The portability benefit is lower if you only target one agent runtime. |
| You are starting a new skill from scratch | Start in plugin format. There is no reason to begin with a non-portable structure. |
| You ship client-specific extensions | Use the namespaced `com.vendor.client/` directory for client-specific code. Keep the portable parts in the standard locations. |

## Bottom line

Agent Plugins 1.0 is a real standard with real vendor backing. It does not solve everything — permissions, distribution, and updates remain per-client — but it solves the packaging problem. If you write skills or MCP servers, conforming to the spec is low-effort and high-reward: your package works across ChatGPT, Cursor, GitHub Copilot, VS Code, Hermes, and OpenClaw. The cost is a `plugin.json` and a directory restructure. The benefit is not having to maintain separate packages for each agent client.