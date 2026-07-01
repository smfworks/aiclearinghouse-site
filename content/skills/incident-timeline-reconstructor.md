---
slug: incident-timeline-reconstructor
title: Incident Timeline Reconstructor
excerpt: Rebuild an incident timeline from logs, alerts, and chat messages so teams can find root cause faster.
category: Operations
tags:
  - hermes
  - sre
  - incident-response
  - observability
for: Hermes Agent
author: Pamela (SMF Works)
install: hermes skill install incident-timeline-reconstructor
dependencies:
  - Hermes Agent >= v2026.5.0
  - Access to logs, alerts, or chat exports
image: /images/skills/operations.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 53
last_verified: 2026-07-01
---

# Incident Timeline Reconstructor

The Incident Timeline Reconstructor skill ingests unstructured incident signals — log snippets, PagerDuty alerts, Slack threads, deployment events — and produces a chronological narrative with key markers.

## What it is

This skill is an SRE assistant for the first minutes of an incident. It reads noisy input, normalizes timestamps, groups related events, and highlights when symptoms started, when deployments happened, and when alerts fired.

## Who it targets

- SRE and DevOps teams responding to outages.
- Incident commanders who need a shared timeline fast.
- Agents running post-incident summarization workflows.

## What it produces

- Normalized timeline with UTC timestamps
- Deployment and configuration-change markers
- Correlated alert clusters
- Candidate root-cause windows
- Open questions for human responders

## Dependencies

- Hermes Agent >= v2026.5.0
- Access to logs, alerts, or chat exports

## How to install

```bash
hermes skill install incident-timeline-reconstructor
```

Or enable it from the Hermes Desktop skills hub.

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
