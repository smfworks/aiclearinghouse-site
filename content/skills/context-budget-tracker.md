---
slug: context-budget-tracker
title: Context Budget Tracker
category: Workflow
excerpt: Monitor token usage in real-time and warn when agent sessions approach context window limits — before truncation or compaction kicks in silently.
tags:
  - hermes
  - context
  - tokens
  - monitoring
  - agents
for: Hermes Agent
author: SMF Works
install: hermes skill install context-budget-tracker
dependencies:
  - Hermes Agent >= v2026.5.0
  - Python 3.10+
image: /images/skills/workflow.svg
source: https://github.com/smfworks/hermes-skills
order: 117
last_verified: "2026-08-26"
---

# Context Budget Tracker

## What it is

A Hermes Agent skill that monitors token consumption in real-time during agent sessions. It tracks input tokens, output tokens, and cumulative context growth across multi-turn conversations. When the context window approaches configurable thresholds (70%, 85%, 95%), it issues warnings — before the provider silently truncates context or the model degrades from context pollution.

## Who it targets

- Agent developers running long multi-turn sessions where context grows monotonically.
- Teams using models with large context windows (128K–1M) who want to know when they are approaching the practical limit where quality degrades.
- Anyone who has been surprised by a context overflow error or silent truncation mid-task.

## What it does

1. **Tracks cumulative token usage** across all turns in a session, reading from the provider's usage metadata in API responses.
2. **Calculates context budget** against the configured model's context window size.
3. **Issues threshold warnings** at 70% (advisory), 85% (recommend compaction or new session), and 95% (critical — imminent truncation risk).
4. **Logs per-turn token breakdown** — system prompt, tool results, conversation history, and current user input — so you can see what is eating your context.
5. **Suggests compaction points** — identifies the largest context contributors and recommends what to summarize or drop.

## Dependencies

- Hermes Agent >= v2026.5.0
- Python 3.10+
- Provider API that returns token usage metadata (most major providers do)

## How to install

```bash
hermes skill install context-budget-tracker
```

## Example usage

```
/user: Research the top 5 open-weight models released this month and compare their benchmarks.

/agent: I'll research recent open-weight model releases. Starting with HuggingFace trending...

[Context Budget Tracker] ⚠️ 72% of context window used (94,432 / 131,072 tokens).
  Breakdown: system prompt 2,100 | conversation history 41,200 | tool results 48,100 | current input 3,032
  Largest contributor: tool results (51% of context)
  Recommendation: Consider summarizing earlier tool results before continuing.

/agent: Continuing research... I have 3 models so far. Let me get the remaining 2.

[Context Budget Tracker] 🟡 87% of context window used (114,032 / 131,072 tokens).
  Recommendation: Initiate context compaction or start a new session for remaining research.

/agent: I've gathered data on 5 models. Given context constraints, here is the summary comparison...
```

## Why this matters

Context windows are not free. A 128K context window does not mean 128K tokens of high-quality reasoning — most models degrade well before the hard limit. Research on long-context reliability shows that effective context utilization often drops past 60-70% of the window. Without a tracker, you discover this degradation as silent quality loss, not as an error. This skill makes the invisible visible.

The tracker is especially valuable for agent workflows that call tools repeatedly — each tool result adds to context, and a research agent making 20 API calls can easily consume 80K+ tokens in tool outputs alone. The per-turn breakdown shows you exactly where tokens are going, so you can fix the cause (summarize tool results, reduce system prompt size) rather than the symptom (unexpected truncation).