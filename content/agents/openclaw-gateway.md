---
slug: openclaw-gateway
title: OpenClaw Gateway
excerpt: The OpenClaw process supervisor — channels, cron, sessions, and routing — exposed as a single daemon.
category: Open Source
tags:
  - gateway
  - multi-agent
  - orchestration
  - open-source
  - daemon
website: https://openclaw.ai
repository: https://github.com/openclaw/openclaw
categories:
  - Multi-Agent
  - Orchestration
  - Gateway
  - Open Source
pricing: Open Source
runtime: Hybrid
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
  - API
  - Linux
  - macOS
  - Windows
features:
  - Single-process gateway daemon (`openclaw gateway start`)
  - Channel routing across 20+ platforms (Telegram, Discord, Slack, iMessage, Matrix, Signal, WhatsApp, Google Chat, Teams, Email, etc.)
  - Cron scheduler with isolated / main / session targets
  - Session lifecycle management (direct, cron, group, isolated)
  - Skill Workshop: installable, versionable agent skills
  - MCP (Model Context Protocol) server integration
  - Work Board for fleet coordination
  - Provider/model routing with fallbacks
  - SecretRef contract for secrets handling
releaseYear: 2025
company: OpenClaw Community
last_verified: 2026-06-19
install_command: "curl -fsSL https://openclaw.ai/install | sh"
lar_test_id: openclaw_gateway_status_v1
---

The OpenClaw gateway is the long-running supervisor process that sits
behind the agent layer. While `openclaw-agent` is the runtime for a single
session, the gateway is what holds channels, crons, sessions, and routing
in a single daemon — the thing you actually leave running on a host.

This entry is distinct from the top-level `openclaw` directory entry,
which scopes to the agent runtime itself. The gateway piece covers
`openclaw gateway start|status|stop`, the channel matrix, the cron
subsystem, and the session lifecycle. v2026.6.8 (build 844f405, verified
on this host) is the current stable line; v2026.6.8-beta.1 added GLM-5.2
and Claude Haiku 4.5 provider routing, a WhatsApp ACP channel, a usage
footer renderer, and an iOS gateway reconnect fix.