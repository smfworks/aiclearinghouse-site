---
slug: brig-microvm-coding-agent-deploy
title: "Deploy AI Coding Agents in Brig microVM Sandboxes"
excerpt: "Run Claude Code, Codex, Cursor, or any coding agent inside a hardware-enforced microVM sandbox using Brig — Apache 2.0, low-overhead, macOS and Linux."
category: Self-Hosting
tags:
  - docker
  - security
  - sandbox
  - microvm
  - coding-agent
  - production
order: 99
last_verified: "2026-09-16"
difficulty: Intermediate
estimated_time: "20 min"
---

# Deploy AI Coding Agents in Brig microVM Sandboxes

## What you will build

A secure, isolated environment for running AI coding agents (Claude Code, Codex, Cursor, Gemini, Grok, opencode) inside a hardware-enforced microVM using Brig — so agents can install packages, execute commands, and use the network without risking your host operating system.

## Prerequisites

- macOS (Apple Silicon) or Linux (x86_64 or ARM)
- A coding agent you want to sandbox (Claude Code, Codex, Cursor, etc.)
- Basic familiarity with containers and OCI images

## Step 1: Install Brig

```bash
# macOS (Apple Silicon)
brew install brig

# Linux
curl -fsSL https://brig.sh/install.sh | sudo bash
```

Verify the installation:

```bash
brig --version
```

## Step 2: Choose a curated agent profile

Brig ships with pre-built profiles for common coding agents:

```bash
brig profiles list
```

Available profiles:
- Claude Code
- Codex
- Cursor
- Gemini
- Grok
- opencode

## Step 3: Launch your agent in a microVM

```bash
# Example: Claude Code in an isolated microVM
brig run claude-code --workspace ~/my-project

# Example: Codex in an isolated microVM
brig run codex --workspace ~/my-project
```

The agent now runs inside an ephemeral microVM with:
- Hardware-enforced process boundaries
- Isolated filesystem (only `--workspace` is mounted)
- Controlled network access (configurable egress policy)
- No access to host credentials or SSH keys

## Step 4: Configure network egress (optional but recommended)

By default, the microVM has limited network access. Configure egress rules to allow only what the agent needs:

```bash
# Allow only API endpoints the agent needs
brig run claude-code \
  --workspace ~/my-project \
  --allow-host api.anthropic.com \
  --allow-host github.com \
  --deny-host *
```

## Step 5: Use a custom OCI image (advanced)

If you need a specific environment (e.g., Python 3.12 + Node 22 + specific system packages):

```bash
# Build or pull a custom OCI image
docker pull ubuntu:24.04

# Run with custom image
brig run claude-code \
  --workspace ~/my-project \
  --image ubuntu:24.04 \
  --setup-script ./setup-env.sh
```

## Step 6: Verify isolation

```bash
# Check that the agent cannot see your home directory
brig exec <session-id> -- ls ~/.ssh  # Should fail or be empty

# Check network boundaries
brig exec <session-id> -- curl https://blocked-site.example  # Should be denied
```

## Security model

Brig uses **hardware-level virtualization** to enforce process boundaries physically. The microVMM code that a security-aware enterprise would need to audit is less than 20K lines of code — making it one of the lowest-overhead sandbox technologies available.

Key security properties:
- **Ephemeral**: Each session gets a fresh microVM; nothing persists after teardown
- **Hardware-enforced**: Boundaries are at the hardware level, not OS-level permissions
- **Credential isolation**: Agent cannot access host SSH keys, API keys, or credentials outside the mounted workspace
- **Network scoping**: Egress is configurable; deny by default

## When to use this recipe

- You run coding agents locally and want protection from supply-chain attacks
- Your agent installs third-party packages that could be compromised
- You need to run untrusted agent skills or experimental tools safely
- Your security team requires hardware-level isolation for agent deployment

## Pitfalls

- **Resource overhead**: microVMs add memory and CPU overhead; allocate accordingly
- **macOS Apple Silicon only**: No Intel Mac support
- **Workspace mount**: Only the `--workspace` directory is shared; plan your project structure
- **OCI image size**: Custom images increase startup time; use minimal base images