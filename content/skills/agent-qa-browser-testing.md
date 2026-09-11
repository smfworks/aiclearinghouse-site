---
slug: agent-qa-browser-testing
title: Agent QA
category: Tooling
excerpt: Natural-language browser and mobile test suite for Hermes agents — writes tests that survive UI churn, triages failures from captured evidence, and applies scoped fixes.
tags:
  - hermes
  - testing
  - qa
  - browser
  - playwright
  - agent-qa
for: Hermes Agent
author: Community
install: hermes skills install agent-qa
dependencies:
  - Hermes Agent
  - Playwright or compatible browser automation
image: /images/skills/tooling.svg
source: https://github.com/ZeroPointRepo/awesome-hermes-skills
order: 119
last_verified: "2026-09-09"
---

# Agent QA

## What it does

The Agent QA skill bundle gives Hermes agents the ability to write, run, and triage browser and mobile tests using natural language instead of brittle selectors. Three `SKILL.md` files work together:

- **Agent QA Authoring** — writes test specs in natural language that survive UI churn (class name changes, layout shifts, refactored components)
- **`agent-qa-result-triage`** — when a test run fails, reads the actual captured evidence (screenshots, DOM snapshots, network logs) and determines whether the app broke or the test drifted. This distinction is the entire cost of a flaky suite, and it is normally the thing a human burns twenty minutes on.
- **`agent-qa-debug-fix`** — applies a scoped fix to the test spec rather than rewriting it from scratch

## Why it matters

Flaky tests are the most expensive problem in QA automation. A test that fails intermittently erodes trust in the entire suite. The traditional fix is a human reading logs, comparing screenshots, and deciding whether the failure is real or drift. Agent QA automates that triage step — the agent reads the evidence and tells you what actually changed.

The scoped-fix skill is equally important. Instead of regenerating an entire test spec when one assertion breaks, it patches the specific failing part. This preserves the test author's intent and avoids the "LLM rewrote my test and now it tests something different" problem.

## Who it targets

- QA engineers who maintain browser test suites that break on every UI refactor
- Teams using Playwright, Puppeteer, or similar browser automation where selector churn is a constant maintenance cost
- Agent-driven CI pipelines where a failing test should auto-triage before a human looks at it
- Any Hermes workflow that needs to distinguish "the app broke" from "the test is stale"

## Installation

```shell
hermes skills install agent-qa
```

## Dependencies

- Hermes Agent (v0.20.0 or later recommended)
- Playwright or a compatible browser automation runtime
- Internet access for any web-based test targets

## Example usage

Ask the agent to triage a failed run:

```
The smoke suite failed on the checkout flow. Triage the failure — did the app break or did the test drift?
```

The agent reads the captured screenshots, DOM snapshots, and network logs from the failed run, then reports whether the failure is a real regression or a stale test. If the test drifted, `agent-qa-debug-fix` can apply a scoped patch to the spec.

## Source

Featured as "Skill of the Week" in the [awesome-hermes-skills](https://github.com/ZeroPointRepo/awesome-hermes-skills) community catalog. Three `SKILL.md` files, usable from the CLI or through the MCP server.