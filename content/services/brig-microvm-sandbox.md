---
slug: brig-microvm-sandbox
title: "Brig: microVM Sandbox for AI Coding Agents"
excerpt: "Apache 2.0 open-source microVM that runs AI coding agents inside a secure, low-overhead isolation layer on Mac or Linux — hardware-enforced boundaries for Claude Code, Codex, Cursor, and more."
category: Agent Security
tags:
  - sandbox
  - security
  - microvm
  - coding-agent
  - open-source
  - isolation
provider: NOFire AI
pricing_model: Open-source
price: "Free (Apache 2.0)"
website: https://brig.sh
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-16"
---

# Brig: microVM Sandbox for AI Coding Agents

## What it is

Brig is an Apache 2.0 open-source microVM sandbox released by NOFire AI on September 15, 2026. It runs AI coding agents inside a secure, low-overhead isolation layer on macOS (Apple Silicon) or Linux (x86_64 and ARM), using hardware-level virtualization to enforce process boundaries physically rather than relying on OS-level permissions.

## The problem it solves

AI coding agents can install packages, execute arbitrary commands, use the network, and access developer credentials. Supply-chain attacks (like the Axios incident) become existential when an agent has full system access. The entire operating system is at risk during AI-accelerated development.

Brig closes this gap by containing the agent within the boundaries of an **ephemeral microVM** — enforced via hardware-level virtualization, not software process isolation.

## What it does

- **Hardware-enforced isolation**: Process boundaries are physically enforced through hardware virtualization, not OS-level sandboxes
- **Curated agent profiles**: Pre-built profiles for Claude Code, Codex, Cursor, Gemini, Grok, and opencode
- **Custom OCI images**: Bring your own using OCI images (e.g., Ubuntu)
- **Cross-platform**: macOS on Apple Silicon, Linux on x86_64 and ARM
- **Ephemeral sessions**: Each agent run gets a fresh, disposable microVM
- **Low audit surface**: The microVMM code that a security-aware enterprise would audit is less than 20K lines — one of the lowest-overhead sandbox technologies available

## When to use it

- You run AI coding agents locally and want to prevent supply-chain attacks from reaching your host OS
- Your security team requires hardware-level isolation before approving agent use
- You need to run untrusted or experimental agent skills without risking your development machine
- You want to sandbox agent network access and credential exposure

## What it does well

- **Minimal audit surface**: <20K lines of code in the security-critical microVMM component
- **No daemon overhead**: Lightweight startup and teardown per agent session
- **Familiar tooling**: Curated profiles mean Claude Code, Cursor, etc. work without custom configuration
- **Truly open**: All components are Apache 2.0, free and open for audit by any security researcher

## Honest limitations

- **macOS Apple Silicon only**: No Intel Mac support; Linux requires x86_64 or ARM
- **Resource overhead**: microVMs add memory and CPU overhead vs. running agents directly, though Brig minimizes this
- **Setup complexity**: Initial configuration and OCI image preparation requires container knowledge
- **New project**: Released September 15, 2026 — production track record is still forming

## Best fit

Developers and security-conscious teams running AI coding agents on macOS or Linux who need hardware-enforced isolation without the overhead of a full virtual machine. Particularly valuable for teams where agents handle untrusted code, install third-party packages, or access sensitive credentials.