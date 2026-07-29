---
slug: hermes-workspace-gui
title: Hermes Workspace GUI
category: Productivity
excerpt: Web-based command center for Hermes Agent — chat, files, memory browser, skills manager, and full PTY terminal in one browser interface.
tags:
  - hermes
  - gui
  - web-ui
  - productivity
  - management
for: Hermes Agent
author: outsourc-e (community)
install: git clone https://github.com/outsourc-e/hermes-workspace
dependencies:
  - Hermes Agent
  - Hermes WebAPI backend (hermes webapi)
  - Python 3.11+
  - Modern browser
image: /images/skills/productivity.svg
source: https://github.com/outsourc-e/hermes-workspace
order: 99
last_verified: "2026-07-29"
---

# Hermes Workspace GUI

## What it is

Hermes Workspace is a unified, web-based command center for the Hermes Agent that consolidates chat (with SSE streaming and tool-call rendering), file and memory browsers, skill management, and a full PTY terminal into one interface. Built during the Nous Hackathon 2026, it is the most complete browser-based GUI for Hermes — giving power users a visual agent IDE to inspect and edit agent internals without leaving the browser.

## What it gives you

### Chat Panel
- SSE streaming responses with tool-call rendering
- Real-time conversation with your Hermes agent profile
- Clean rendering of multi-step agent workflows

### Memory Browser
- Inspect and edit agent memory files (MEMORY.md, USER.md, SOUL.md)
- Visibility into the agent's internal state — what it remembers and why
- Direct editing without terminal commands

### Skills Browser
- Manage per-session skills from a 2,000+ skill registry
- Toggle skills on/off as needed
- Start lean (web search, browser, memory, files) and add more as needed

### File Browser
- Navigate and edit workspace files with the Monaco editor
- Full filesystem visibility alongside conversational workflows

### Terminal
- Persistent PTY shell sessions
- Run shell commands without leaving the workspace

## When to use it

- You want to operate inside your agent environment rather than chat with it from a terminal
- You need to edit memory, browse skills, run shell commands, and manage files in one place
- You are a power user who wants genuine visibility into the agent's internal state
- You manage multiple Hermes profiles and need a visual switcher

## Setup

```bash
# Requires the WebAPI backend from the outsourc-e fork
hermes webapi  # Starts FastAPI on port 8642

# Verify backend
curl http://localhost:8642/health  # Should return {"status": "ok"}

# Clone and run workspace
git clone https://github.com/outsourc-e/hermes-workspace
cd hermes-workspace
# Follow README for frontend setup
```

Supported providers: Anthropic (Claude), OpenAI, OpenRouter, and local models via Ollama.

## Notes

- Workspace is a progressive web app — installable on iPhone or Android via browser
- Start with a "default" profile, then add specialized profiles (Researcher, Writer, Customer Ops)
- Do not enable all 2,000+ skills upfront — start lean and add as needed
- Community-maintained, not an official Nous Research project