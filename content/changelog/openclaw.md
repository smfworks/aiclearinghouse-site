---
slug: openclaw
title: OpenClaw
excerpt: Recent updates to the OpenClaw agent platform, skills system, and security model.
category: Platform
tags:
  - OpenClaw
  - agent platform
  - skills
  - Codex
  - changelog
last_updated: 2026-06-16
last_verified: 2026-06-18
---

# OpenClaw Changelog

## 2026-06

### OpenClaw 2026.6.8 stable
Released June 16, 2026. The 2026.6.8 stable release introduced:
- **Verified Apps:** a verification layer for apps installed through the platform.
- **Hardened Codex execution policy:** stricter controls around how Codex runs shell commands and external code.
- **OpenAI Image CLI controls:** better controls for image-generation provider calls.
- **ClawHub skill install improvements:** smoother installation and wiring of community skills.

### 2026.6.8-beta.2
Released June 15, 2026. The beta added the verified-apps plumbing and Codex policy changes before they reached stable.

## 2026-05

### Skills and registry work
OpenClaw continued investing in its skills system, making it easier to discover, install, and update reusable agent capabilities. The platform is positioning skills as the primary way to extend agent behavior without rewriting core code.

## What this means for users

OpenClaw is maturing from a personal AI assistant into a general agent operating system. The verified-apps and hardened-Codex changes show the project taking security seriously as it gains adoption. If you are building agents on OpenClaw, the skills registry is worth watching closely — it may become the dominant extension model.

## What to watch

- How the verified-apps model compares to traditional package-manager trust.
- Native support for additional models and providers.
- Whether OpenClaw can maintain its "any OS, any platform" promise as complexity grows.

Source: [OpenClaw releases](https://github.com/openclaw/openclaw/releases)
