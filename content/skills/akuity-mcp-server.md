---
slug: akuity-mcp-server
title: Akuity MCP Server + Agentic Control Plane
category: DevOps
excerpt: "Governed MCP server from the Argo CD creators that lets coding agents work on your software pipeline under strict identity, policy, and audit controls."
tags:
  - mcp
  - devops
  - argo-cd
  - governance
  - kubernetes
  - ci-cd
for: Any MCP-capable agent (Claude, Cursor, Codex)
author: Akuity
install: See Akuity Platform docs
dependencies:
  - Akuity Platform account
  - Argo CD or Kargo (optional but recommended)
  - MCP-capable agent (Claude Code, Cursor, Codex)
image: /images/skills/devops.svg
source: https://akuity.cloud
order: 99
last_verified: "2026-09-16"
---

# Akuity MCP Server + Agentic Control Plane

## What it is

Akuity, the company built by the creators of Argo CD and Kargo, launched two products on September 14, 2026: the **Agentic Control Plane** and the **Akuity MCP Server**. Together they let AI coding agents like Claude, Cursor, or Codex work on your software delivery pipeline — but only under strict rules, identity boundaries, and full audit logging.

## How it works

1. **The agent logs in as the person it acts for.** One login carries that person's permissions everywhere. No new credentials to create.
2. **Every request goes through the Control Plane.** It checks the request against the human's permissions and company guardrails.
3. **The action runs or gets refused.** Policy enforcement happens before execution, not after.
4. **Every change is written to the audit log** under that person's name, marked as agent-made.

## What makes it different from a raw MCP server

A raw open-source MCP server gives an agent access with no identity, policy, or audit layer. The Akuity MCP Server is the connection point; the Control Plane behind it is what does identity, policy, and audit.

- **Agent acts as the connected person**: The agent inherits only the permissions of the human who connected it — no more, no less.
- **Guardrail levels**: A senior engineer may have production access, but the company can still rule that no agent may touch a sensitive production action.
- **Unified audit trail**: Whether a release goes out from the UI, the CLI, or an AI agent, the same audit log records it — and a human with the right role must approve or reject.

## When to use it

- You run Argo CD or Kargo and want to safely let coding agents interact with your deployment pipeline
- Your security team requires that agent actions are attributed to a specific human with an audit trail
- You want to give Claude Code, Cursor, or Codex read-only access to cluster health and deployment history as a first step
- You need guardrail levels that can block agents from sensitive actions even when the connected human has permission

## What it does well

- **Fastest win for Argo CD/Kargo shops**: Governance layers onto tools you already run
- **Start read-only**: Security teams can test a read-only agent first, then expand
- **Framework-agnostic**: Any MCP-capable agent connects — Claude, Cursor, Codex, Hermes, and others
- **Created by Argo CD maintainers**: Deep integration with the CD ecosystem

## Honest limitations

- **Pricing not published**: The Control Plane and MCP Server pricing is not listed; the existing Pro tier ($495/mo) predates this launch
- **Akuity Platform required**: Not a standalone install — runs on the Akuity Platform
- **Argo CD/Kargo optimized**: Teams without Argo CD get less value since the governance layers onto those tools

## Install

Available on the Akuity Platform today with a free trial at [akuity.cloud](https://akuity.cloud). See the official docs for MCP Server connection instructions.

## Skill source

- [Akuity Platform](https://akuity.cloud)