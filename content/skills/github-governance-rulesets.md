---
slug: github-governance-rulesets
title: "GitHub Governance Rulesets & Properties"
category: Workflow
excerpt: "Wraps GitHub MCP Server 1.12.0 governance tools — let an agent read and manage repository rulesets and custom properties across repository, organization, and enterprise levels, plus faster safer feature flags."
tags:
  - github
  - governance
  - mcp
  - rulesets
  - automation
for: Any MCP-compatible agent
author: SMF Works
install: "Configure GitHub MCP Server (github/github-mcp-server) v1.12.0+"
dependencies:
  - GitHub MCP Server v1.12.0+
  - GitHub account with appropriate scope
image: /images/skills/workflow.svg
source: https://github.com/github/github-mcp-server/releases
order: 99
last_verified: "2026-09-09"
---

# GitHub Governance Rulesets & Properties

## Overview

GitHub MCP Server v1.12.0 (released September 3, 2026) added new governance tools for agents: the ability to read and manage **repository rulesets** and **custom properties** across repository, organization, and enterprise levels, plus faster, safer feature flags. This skill wraps those capabilities into a reusable agent workflow for auditing and enforcing governance policy at scale.

Rulesets are GitHub's mechanism for enforcing branch protection, required status checks, required reviewers, commit signing, and more — scoped to target branches, tags, or paths. Custom properties let you tag repositories with structured metadata (e.g. `data-classification: sensitive`, `team: payments`) that you can then query and build governance rules on.

## When to use it

- You need an agent to audit which repositories enforce (or lack) a given policy across an organization
- You want to programmatically apply rulesets to many repos based on custom-property tags
- You are migrating governance policy and need an agent to read current rulesets, diff them against a target state, and propose changes
- You want feature-flag-gated rollout of new agent-driven governance changes

## What it does

- **Read rulesets** at repository, organization, and enterprise levels
- **Manage rulesets** — create, update, and delete rulesets to enforce branch protection, required checks, required reviewers, and more
- **Read and set custom properties** on repositories for structured, queryable metadata
- **Feature-flag gating** — the MCP server's faster, safer feature flags let you gate new governance operations behind flags before rolling them broadly
- **Tool-specific configuration** — use the `X-MCP-Tools` header (remote) or the corresponding flag (local) to enable only the governance tools you need, minimizing context window usage

## Quick start

1. Install or update the GitHub MCP Server to v1.12.0+
2. Authenticate with a GitHub token that has the required scopes (repo, org, enterprise as applicable)
3. Enable only the governance tools you need via `X-MCP-Tools` to keep the agent's context lean
4. Ask the agent to audit current rulesets, compare against your policy, and propose a diff

## Lockdown mode for untrusted contributors

The GitHub MCP Server also ships a **Lockdown mode** that restricts content from untrusted contributors in public repositories, with comprehensive content sanitization enabled by default to protect against prompt injection attacks. Use it when an agent operates on public repos with external contributors.

## Limitations

- **Scope requirements**: managing organization- and enterprise-level rulesets and properties requires tokens with org/enterprise admin scopes — not just repo access
- **Ruleset precedence**: GitHub merges rulesets by enforcement level (evaluate, enforce) — agents should understand the precedence model before proposing changes, or they may under- or over-enforce
- **Feature-flag maturity**: some governance tools may still be behind flags in your MCP server configuration; verify availability before scripting against them
- **Not a policy authoring tool**: this wraps reading and managing existing GitHub governance primitives; authoring the policy itself is a human decision

## Related

- [GitHub MCP Server releases](https://github.com/github/github-mcp-server/releases)
- [GitHub repository rulesets documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets)