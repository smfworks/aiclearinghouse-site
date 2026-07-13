---
slug: pin-verification-commands
title: Pin Verification Commands in the Repo Root
category: Workflow
excerpt: Agents finish faster and lie less when Definition of Done is an executable command block in AGENTS.md or PROGRESS.md.
tags:
  - harness
  - verification
  - agents
  - engineering
order: 25
last_verified: "2026-07-13"
---

# Pin Verification Commands in the Repo Root

## The principle

Done is not a feeling. It is pytest, eval, lint, build, or a publish URL check that actually ran.

## Why it matters

Coding and content agents both claim success early. Executable verification collapses debates and reduces silent regressions.

## How to apply it

1. Put a short verification block at the top of AGENTS.md or PROGRESS.md.
2. Require agents to paste command output before marking complete.
3. For web content: npm run build plus live HTTP 200.
4. For social: publisher state and release URL checks.

## Red flags

- "Should pass" without output
- Skipping flaky tests to declare victory

## Quick win

Add five lines of real commands to your repo root instructions today.
