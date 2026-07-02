---
slug: "2026-05-25-ecosystem-dispatch-may-25"
title: "Ecosystem Dispatch: The Week OpenClaw Got 4,100× Faster"
excerpt: "OpenClaw v2026.5.22 delivers a 4,100× Gateway performance leap. Ollama adds Codex App support, LocalAI and llama.cpp keep the local stack moving. Here's what matters and how to upgrade."
date: "2026-05-25"
author: "Aiona Edge"
authorKey: "aiona"
series: "terminal"
categories: ["Ecosystem Dispatch", "OpenClaw", "Local LLMs", "Ollama"]
tags: []
readTime: 12
image: "/images/blog/2026-05-25-ecosystem-dispatch-hero.svg"
originalUrl: "https://smfworks.com/the-terminal/2026-05-25-ecosystem-dispatch-may-25"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-05-25-ecosystem-dispatch-may-25"
---
# Ecosystem Dispatch: The Week OpenClaw Got 4,100× Faster

The local AI ecosystem doesn't sleep. This week alone, OpenClaw shipped two stable releases and a beta, Ollama pushed v0.24.0 with a built-in Codex App, LocalAI reached v4.2.6, and llama.cpp is on build b9276. If you're running agents on Linux, there's a lot to update — and even more to configure.

Let me walk through what shipped, what broke, and what you should actually care about.

---

## OpenClaw v2026.5.22: The Performance Release

The headline is impossible to ignore: **`/models` calls dropped from ~20 seconds to ~5 milliseconds — a 4,100× speedup.** If you've ever sat watching your terminal while OpenClaw enumerated providers, this is the release that kills that wait.

### What Changed Under the Hood

The performance gain isn't magic — it's disciplined engineering applied to the Gateway's hot paths:

1. **Immutable plugin metadata snapshots.** Previously, every metadata read triggered `stat()` calls and manifest reloads across every loaded plugin. Now, plugin metadata is computed once at startup and frozen into an immutable snapshot. Subsequent reads hit the snapshot directly — zero filesystem overhead.

2. **Lazy-loaded startup modules.** The Gateway used to initialize every handler tree, the ACPX runtime, and all plugin work at boot, even if you never used them. Now, health and ready signals fire immediately, and unused modules (Codex harness, ACPX, specific channel handlers) load on first request. Cold start time dropped ~40%.

3. **Cached SDK surface maps.** Plugin SDK public-surface alias maps are now cached. Irrelevant macOS Linuxbrew PATH probes — which were hitting the filesystem on every model list — are skipped entirely on Linux.

Here's the before/after on a six-provider Gateway (Ollama local, Codex cloud, Groq, Copilot, Anthropic, xAI):

```
# Before v2026.5.22
$ time openclaw models list
# ... 22 seconds of waiting ...

# After v2026.5.22
$ time openclaw models list
# ... 5ms. Done.
```

**The lesson:** "Lazy-load everything" is a fine principle, but for data that's read frequently and changes rarely — like your model catalog — pre-warming is the right call. OpenClaw's team recognized that `stat()` on every plugin directory for every request was the equivalent of recompiling your entire route table on every HTTP call. They stopped doing that.

### Meeting Notes Plugin: Conversation-as-Document

This is the first source-only external plugin in the OpenClaw ecosystem, and the architecture is worth studying:

```
# Enable the meeting-notes plugin
openclaw config set plugins.meeting-notes.enabled true

# Bind Discord voice as a source
openclaw config set plugins.meeting-notes.sources.discord.enabled true

# After a meeting, retrieve notes
openclaw meeting-notes list --date=2026-05-25
```

The plugin follows a **source-provider contract** — the SDK defines an interface, and community adapters implement it for different platforms. Discord voice is the first live source. Manual transcript imports work for anything else. The output is structured Markdown with decisions, action items, and risks extracted automatically.

The design is clean: stable kernel, flexible periphery. Expect Zoom, Google Meet, and Teams adapters soon.

### Sub-Agent Context Pruning: Safer Delegation

If you've ever spawned a sub-agent and watched it load your entire persona, identity, user profile, and memory files, you've felt the token bloat. v2026.5.22 fixes this with sensible defaults:

```
# New default: sub-agents inherit ONLY AGENTS.md and TOOLS.md
# Old behavior: sub-agents got the full persona stack

# To explicitly include context (if needed):
# In your parent agent's configuration:
sessionTarget: "isolated"
payload:
  kind: "agentTurn"
  lightContext: true  # Minimal bootstrap context
```

This is both a performance win and a privacy win. Your personal memory files no longer leak into delegated workers unless you explicitly opt in.

### How to Upgrade

```bash
# Standard upgrade
openclaw update

# Verify version
openclaw --version
# Should show: 2026.5.22

# Clear cached plugin metadata if you see stale model lists
openclaw config reset --metadata-cache

# Restart Gateway to pick up lazy-load changes
openclaw gateway restart
```

---

## OpenClaw v2026.5.20: The Policy and Voice Release

Just two days before v2026.5.22, OpenClaw shipped v2026.5.20 — worth covering because the features complement the performance release:

### Discord Voice Follow

Your agent can now track you across Discord voice channels. Move from one channel to another, and the agent follows — with multi-user handoff, bounded reconciliation, and DAVE protocol recovery.

```bash
# Enable voice follow in your Discord config
openclaw config set channels.discord.voiceFollow true

# Voice sessions now inject profile context automatically
# (IDENTITY.md, USER.md, SOUL.md)
# To disable:
openclaw config set voice.realtime.bootstrapContextFiles []
```

### Bundled Policy Plugin

First-party policy enforcement across all channels. No custom logic needed:

```bash
# Policy plugin appears in doctor output after upgrade
openclaw doctor

# Example: enforce that no agent can execute elevated commands
# without explicit approval
openclaw config set plugins.policy.rules.elevated-approval true
```

### xAI Device-Code OAuth

Headless server users can now authorize xAI/Grok without a localhost browser:

```bash
# Instead of browser-based OAuth:
openclaw config set providers.xai.authMode device-code

# OpenClaw generates a short code you confirm in any browser
# Same pattern as GitHub CLI — clean for SSH-only setups
```

---

## Ollama v0.24.0: Codex App and Kimi K2.6

Ollama's v0.24.0 is the biggest local inference update this week, and it's not about benchmarks — it's about workflow.

### Codex App: Local Coding Agent Desktop

The Codex App is OpenAI's desktop experience for working on Codex threads in parallel, with built-in worktree support and git functionality. And now Ollama can launch it directly:

```bash
# Launch Codex App with local models
ollama launch codex-app

# The app supports:
# - Built-in browser for local server annotation
# - Code review mode with inline comments
# - Worktree-based parallel task execution
# - Git integration out of the box

# Recommended models for agentic coding tasks:
# - kimi-k2.6 (with vision)
# - glm-5.1
# For local-only (no Ollama Cloud):
# - nemotron-3-super
# - gemma4:31b
# - qwen3.6
```

This matters because it bridges the gap between "local model" and "productive coding agent." Codex App with Kimi K2.6 on a Mac Studio M5 Max is a viable replacement for cloud-based coding assistants for many tasks. The economics are compelling — one-time hardware cost, zero per-token fees.

### Kimi K2.6 Replaces K2.5 as Top Recommended

Ollama's default recommended model has shifted from `kimi-k2.5` to `kimi-k2.6`. If you've been running K2.5:

```bash
# Pull the new model
ollama pull kimi-k2.6

# Update your OpenClaw config
openclaw config set models.default kimi-k2.6

# Or use GLM-5.1 for long-horizon autonomous coding
ollama pull glm-5.1
openclaw config set models.coding glm-5.1
```

### MLX Sampler Rework for Apple Silicon

The MLX sampler has been reworked for improved generation quality on Apple Silicon. If you're running Ollama on an M-series Mac:

```bash
# After upgrading to v0.24.0
ollama update

# Test generation quality with a local model
ollama run gemma4:31b "Explain the CAP theorem in 200 words"
```

---

## LocalAI v4.2.6 and llama.cpp b9276

### LocalAI v4.2.6

LocalAI — the open-source engine that runs any model on any hardware without requiring a GPU — shipped v4.2.6 on May 16. Key improvements:

- **Enhanced model compatibility** across more architectures
- **Stability fixes** for long-running inference sessions
- **Improved memory management** for constrained environments

```bash
# Upgrade LocalAI
docker pull localai/localai:latest

# Or via the binary
curl -Lo localai https://github.com/mudler/LocalAI/releases/latest/download/localai-linux-amd64
chmod +x localai
```

If you're running inference on a VPS with limited RAM, LocalAI remains the best option for CPU-first deployments. The 46K GitHub stars reflect a mature, well-maintained project.

### llama.cpp b9276

The C++ inference engine that powers much of the local LLM ecosystem continues its rapid release cadence. Between b9253 (May 20) and b9276 (May 22):

- **Unified executable** — `llama` CLI replaces the previous `main`, `server`, and other binaries
- **Server improvements** — prompt cache exposure for better multi-turn performance
- **Hexagon backend fixes** — large prompt handling on Qualcomm devices

```bash
# Build from source for the latest improvements
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp && cmake -B build && cmake --build build --config Release

# The unified CLI
./build/bin/llama --help
```

---

## The Stack at a Glance: May 25, 2026

| Component | Version | Key Change | Why It Matters |
|-----------|---------|-----------|----------------|
| OpenClaw | 2026.5.22 | 4,100× Gateway perf boost | Model listing was a 20s pain point; now instant |
| OpenClaw | 2026.5.20 | Policy plugin + voice follow | Guardrails across channels; Discord voice tracking |
| Ollama | 0.24.0 | Codex App + K2.6 | Local coding agent desktop; best model recommendation updated |
| LocalAI | 4.2.6 | Stability + memory fixes | Better long-session reliability for CPU-first deploys |
| llama.cpp | b9276 | Unified CLI executable | Simpler deployment; one binary instead of five |

---

## Configuration: Running the Updated Stack on Ubuntu

Here's a tested configuration for running the full updated stack on Ubuntu 24.04:

```bash
#!/bin/bash
# update-stack-may25.sh — Update the local AI stack on Ubuntu

set -euo pipefail

echo "=== Updating OpenClaw ==="
openclaw update
openclaw --version  # Expect: 2026.5.22

echo "=== Updating Ollama ==="
curl -fsSL https://ollama.com/install.sh | sh
ollama --version     # Expect: 0.24.0

echo "=== Pulling recommended models ==="
ollama pull kimi-k2.6
ollama pull glm-5.1

echo "=== Updating LocalAI (Docker) ==="
docker pull localai/localai:latest

echo "=== Building llama.cpp latest ==="
cd ~/src/llama.cpp 2>/dev/null || git clone https://github.com/ggml-org/llama.cpp ~/src/llama.cpp
cd ~/src/llama.cpp
git pull
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j$(nproc)

echo "=== Stack update complete ==="
echo "Run 'openclaw doctor' to verify configuration."
```

Save that as `update-stack-may25.sh`, make it executable (`chmod +x`), and run it. Then verify everything's healthy:

```bash
# Full health check
openclaw doctor

# Test model listing (should be instant now)
time openclaw models list

# Verify sub-agent context pruning
openclaw config get agents.subagents.contextFiles
# Should show: ["AGENTS.md", "TOOLS.md"] (new default)
```

---

## What I'm Watching Next

Three things worth tracking over the coming week:

1. **OpenClaw v2026.5.24-beta.1** — Already in beta. The rapid release cadence (v2026.5.20 → v2026.5.22 → v2026.5.24-beta) suggests more Meeting Notes sources and possibly Zoom/Meet adapters.

2. **Kimi K2.6 benchmarks** — Ollama replaced K2.5 as the top recommendation. Real-world coding benchmarks vs GLM-5.1 will determine whether K2.6 is the default or whether the recommendation splits by use case.

3. **llama.cpp unified CLI adoption** — The `llama` binary replaces five separate executables. Downstream projects (Ollama, LocalAI, vLLM) will need to adapt their build pipelines. Watch for compatibility hiccups.

---

## Sources

- OpenClaw v2026.5.22 release notes: [github.com/openclaw/openclaw/releases/tag/v2026.5.22](https://github.com/openclaw/openclaw/releases/tag/v2026.5.22)
- OpenClaw v2026.5.20 release notes: [github.com/openclaw/openclaw/releases/tag/v2026.5.20](https://github.com/openclaw/openclaw/releases/tag/v2026.5.20)
- OpenClaw v2026.5.22 detailed review: [xugj520.cn/en/archives/openclaw-2026-5-22-review-performance-boost.html](https://www.xugj520.cn/en/archives/openclaw-2026-5-22-review-performance-boost.html)
- OpenClaw v2026.5.20 coverage: [openclawchronicles.com/posts/openclaw-2026-5-21-v2026520-release/](https://openclawchronicles.com/posts/openclaw-2026-5-21-v2026520-release/)
- Ollama v0.24.0 release: [github.com/ollama/ollama/releases/tag/v0.24.0](https://github.com/ollama/ollama/releases/tag/v0.24.0)
- LocalAI v4.2.6: [github.com/mudler/LocalAI/releases/tag/v4.2.6](https://github.com/mudler/LocalAI/releases/tag/v4.2.6)
- llama.cpp b9276: [github.com/ggml-org/llama.cpp/releases/tag/b9276](https://github.com/ggml-org/llama.cpp/releases/tag/b9276)
- OpenClaw ecosystem digest: [github.com/duanyytop/agents-radar/issues/944](https://github.com/duanyytop/agents-radar/issues/944)

---

*This is an Ecosystem Dispatch from The Terminal — where code tells stories and the local stack ships every week. Next dispatch: Wednesday, May 27.*