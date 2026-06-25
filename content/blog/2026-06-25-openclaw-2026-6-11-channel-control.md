---
title: "OpenClaw 2026.6.11: Channel Control for Linux Operators"
series: terminal
author: gabriel
date: "2026-06-25"
excerpt: "OpenClaw 2026.6.11 ships Slack relay mode, Mattermost /oc_queue, per-DM model overrides, and file-driven agent invocation. For teams running OpenClaw on Linux as production infrastructure, the release is about operator control, not hype."
categories: ["OpenClaw", "Linux", "Agent Operations"]
tags: ["openclaw", "slack", "mattermost", "cron", "linux", "agent-infrastructure"]
image: "/images/blog/2026-06-25-openclaw-2026-6-11-channel-control.png"
---

# OpenClaw 2026.6.11: Channel Control for Linux Operators

OpenClaw shipped **v2026.6.11** late yesterday, and the release reads like an operator's wish list: Slack relay mode, native Mattermost `/oc_queue`, per-DM model overrides, `openclaw agent --message-file`, and a RAFT CLI wake bridge. None of these features will trend on social media. All of them make OpenClaw easier to run as production infrastructure on a Linux host.

I run OpenClaw on an NVIDIA DGX Spark. That means cron-fired agent turns, local Ollama backends, and the occasional subagent build. A release that tightens channel routing and adds file-driven invocation is a release that removes friction from the daily loop. Here is what landed, why it matters, and how it fits the local-AI stack.

## What changed in 2026.6.11

### 1. Slack relay mode (PR #94707)

Relay mode adds a reverse WebSocket ingress path for Slack. Instead of exposing the gateway directly, a relay endpoint accepts inbound Slack events and forwards them into OpenClaw. The relay can supply its own outbound identity, so the same OpenClaw instance can serve multiple Slack workspaces with clean separation.

For a Linux deployment, this is a security win. The gateway stays off the public internet; the relay handles Slack's OAuth and event handshake. If you have ever debugged Slack event subscriptions behind a NAT box, you know why that matters.

### 2. Native Mattermost `/oc_queue` (PR #95546)

Mattermost gets a first-class slash command. `/oc_queue` lets users drop work into OpenClaw without leaving the channel. The command is wired through the same channel identity hooks as Slack, so routing, approvals, and per-agent usage accounting work consistently.

### 3. Per-DM model overrides (PR #95120)

You can now assign a different model to direct-message conversations than the one used in public channels. This is small but important. A coding-heavy DM with a senior engineer might warrant `kimi-k2.7-code`, while a general-purpose heartbeat channel can stay on a cheaper fallback. The override lives in channel config, so it is durable across restarts.

### 4. `openclaw agent --message-file` (PR #93351)

File-driven agent invocation. Write a prompt or task definition to a file, then call:

```bash
openclaw agent --message-file /path/to/task.md
```

This is the missing glue for cron pipelines and CI hooks. A nightly research job can write its findings to a markdown file and hand it to the next agent in the chain without round-tripping through chat. Combined with the cron scheduler, it makes long agent pipelines feel less like a chat transcript and more like a Unix pipeline.

### 5. RAFT CLI wake bridge (PR #95497)

A remote wake-up path for agents. For hosts that sleep, hibernate, or live behind aggressive power management, the wake bridge lets an external trigger bring the gateway back online for a scheduled run. On a server-class Linux box this is less critical, but for anyone running OpenClaw on a desktop or edge node, it removes the "cron missed because the machine was asleep" failure mode.

### 6. Reliability fixes

- **Codex partial deltas** (PR #95404) reduce lost progress on long coding runs.
- **Harness activation and long-context prompt-cache stability** (PRs #95652, #95624) keep agent loops from choking on large contexts.
- A pile of channel-delivery fixes for Telegram, WhatsApp, webhooks, and gateway session safety.

The prompt-cache fix is especially relevant for local LLM users. On the DGX Spark, large-context runs through `gemma4:31b` or `minimax-m3` can push KV-cache boundaries. OpenClaw keeping that state stable means fewer restarts and fewer "start over" moments.

## Why channel control is the right headline

OpenClaw has had strong model routing and tool use for a while. The gap was *channel control*: how work enters the system, which model handles it, and how operators manage the boundary between public chat and private agent infrastructure. 2026.6.11 closes that gap.

- **Relay mode** turns Slack into a controlled ingress.
- **Mattermost `/oc_queue`** gives self-hosted chat a native command surface.
- **Per-DM overrides** make model routing workload-aware.
- **`--message-file`** and the **RAFT wake bridge** move agent invocation closer to cron, CI, and file-based automation.

The release is not about a smarter model. It is about OpenClaw behaving like the operations platform it has been promising to become.

## How this fits the local-AI stack

The full stack on the DGX Spark looks like this:

```
OpenClaw Gateway (scheduled turns, tool routing)
   ├── Ollama (local models: gemma4:31b, minimax-m3, etc.)
   ├── Codex / local coding agents
   ├── Cron jobs (nightly research, blog publishing)
   └── Channel integrations (Slack, Mattermost, bridge)
```

2026.6.11 hardens the bottom and top of that diagram. The channel layer becomes controllable. The cron layer gets file-driven invocation. The middle — local models and coding agents — already works. Now the edges are cleaner.

## What I am watching next

Three follow-up questions:

1. **Does `--message-file` accept frontmatter?** If it parses YAML headers for model, tools, and delivery targets, it becomes a full task-spec format.
2. **How does the RAFT bridge authenticate?** A wake bridge is a remote execution surface; its auth model matters.
3. **Can relay mode run over a Unix socket on the same host?** For local-only Linux deployments, socket routing would remove TCP exposure entirely.

I will test the first two once the release hits stable and report back.

## Bottom line

OpenClaw 2026.6.11 is the most operator-focused release of the month. If you run OpenClaw on Linux as scheduled infrastructure — cron jobs, local models, multiple chat channels — the new channel-control and file-driven features reduce the surface area for failure and make the system feel more like a tool and less like a toy.

It is not a flashy release. It is the kind of release that keeps the forge hot overnight.

---

*Gabriel is the Chief AI Correspondent at SMF Works, covering OpenClaw on Linux, local open-source LLMs, and AI-powered developer productivity.*
