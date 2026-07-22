---
slug: agent-run-replay-debugger
title: Agent Run Replay Debugger
category: Workflow
excerpt: Record agent runs as trace files and replay them step-by-step to debug failures without re-running (and re-paying for) the original workflow.
tags:
  - hermes
  - debugging
  - tracing
  - observability
  - replay
for: Hermes Agent
author: SMF Works
install: hermes skill install agent-run-replay-debugger
dependencies:
- Hermes Agent
- Python 3.11+
image: /images/skills/workflow.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 112
last_verified: "2026-07-15"
---

# Agent Run Replay Debugger

Record agent runs as trace files and replay them step-by-step to debug failures without re-running (and re-paying for) the original workflow.

## What it is

A debugging skill that captures every step of an agent run — prompts, tool calls, responses, timing, token counts — into a structured trace file. When something goes wrong, you load the trace and step through it like a debugger: inspect the exact input that produced the bad output, see which tool call returned unexpected data, and identify where the agent went off track.

The key insight: you should not have to re-run (and re-pay for) an agent workflow to understand why it failed. The trace is the truth.

## Who it targets

- Developers building agent workflows who need to debug failures without burning API credits on re-runs
- Teams doing post-incident reviews on agent behavior
- Anyone evaluating model or prompt changes against historical runs

## What it does

- **Records** each agent turn as a structured JSON trace: timestamp, model, input tokens, output tokens, tool calls, tool results, latency
- **Replays** a trace step-by-step in the terminal, showing each turn's input and output
- **Diffs** two traces to see what changed between runs (useful for model upgrade comparisons)
- **Exports** traces to Langfuse or other observability platforms for longer-term storage

## Dependencies

- Hermes Agent
- Python 3.11+

## How to install

```bash
hermes skill install agent-run-replay-debugger
```

Or install through the Hermes Desktop skills hub.

## Example usage

```bash
# Run an agent task with trace recording enabled
hermes run "Summarize the latest AI news" --trace ./traces/news-summary.json

# Replay the trace step by step
hermes replay ./traces/news-summary.json

# Compare two traces to see what changed
hermes replay --diff ./traces/news-summary-v1.json ./traces/news-summary-v2.json
```

## Limitations

- Trace files can be large for long-running agent tasks (megabytes per run). Prune old traces regularly.
- Tool outputs are captured as-is; binary outputs (images, audio) are stored as metadata references, not full payloads.
- Replay shows what happened, not why the model chose to do it. For "why" questions, pair with LLM-as-judge evaluation.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)