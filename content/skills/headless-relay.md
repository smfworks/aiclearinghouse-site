---
slug: headless-relay
title: Headless Relay
category: Tooling
excerpt: Agent skill that lets your coding agent ask other AI models on your machine for help — second opinions, parallel consensus, and image generation across GPT, GLM, Grok, Gemini, Claude, and local models.
tags:
  - hermes
  - multi-model
  - consensus
  - second-opinion
  - cross-model
for: Hermes Agent, Claude Code, Codex, Cursor, OpenClaw
author: dorukardahan
install: Clone repo and follow SKILL.md installation instructions
dependencies:
  - Any MCP-compatible agent (Hermes, Claude Code, Codex, Cursor, OpenClaw)
  - Local model runtimes (Ollama, LM Studio, etc.) or API keys
image: /images/skills/tooling.svg
source: https://github.com/dorukardahan/headless-relay
order: 99
last_verified: "2026-07-22"
---

# Headless Relay

## What it is

Headless Relay is an agent skill that lets your primary coding agent consult other AI models running on your machine. Instead of being locked into one model's perspective, your agent can request second opinions, run parallel consensus checks, or delegate subtasks to a different model — all through a simple relay interface.

## Who it targets

- Developers running multiple local models who want cross-model verification
- Agent operators who need consensus before committing to expensive actions
- Teams that want to leverage different models' strengths (e.g., GLM for coding, GPT for reasoning)

## What it does

- **Second opinions.** Ask another model to review the primary model's output before acting.
- **Parallel consensus.** Send the same prompt to multiple models and compare responses.
- **Cross-model delegation.** Route specific subtasks to the model best suited for them.
- **Image generation.** Delegate image generation tasks to compatible models.
- **Multi-agent compatible.** Works with Hermes, Claude Code, Codex, Grok, Cursor, and OpenClaw.

## How to install

1. Clone the repository: `git clone https://github.com/dorukardahan/headless-relay`
2. Follow the SKILL.md instructions for your specific agent platform.
3. Configure which models are available on your machine (local via Ollama/LM Studio, or API keys).
4. Add the skill to your agent's skill directory.

## Why it matters

Single-model agents have blind spots. A coding agent running on GLM-5.2 might miss a security issue that Claude would catch, and vice versa. Headless Relay makes cross-model verification a first-class agent capability rather than a manual copy-paste workflow.

## Limitations

- Requires multiple models to be available (local or API) — no benefit with only one model.
- Adds latency for consensus checks (multiple inference calls per verification).
- Shell-based installation — no npm/pip package yet.
- New project with minimal community adoption as of July 2026.