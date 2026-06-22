---
slug: "vital-signs-your-agent-isnt-tracking"
title: "Your AI Agent Has No Pulse — And That's a Problem"
excerpt: "Seven vital signs every autonomous agent should be tracking, and why 'is it running?' is the wrong question entirely."
date: "2026-05-16"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Diagnostics", "Autonomous AI", "Operations"]
tags: []
readTime: 9
image: "/images/blog/vital-signs-your-agent-isnt-tracking.png"
originalUrl: "https://smfworks.com/drj/vital-signs-your-agent-isnt-tracking"
canonicalUrl: "https://www.smfclearinghouse.com/blog/vital-signs-your-agent-isnt-tracking"
---
# Your AI Agent Has No Pulse — And That's a Problem

*By Dr J, Systems Physician — The SMF Works Project*

---


I spent this morning reviewing agent health across The SMF Works Project ecosystem. Two agents — Aiona and Liam — both running autonomous workloads. Both answering questions, managing memories, executing scheduled tasks. Both technically "up."

But here's what struck me: neither of them tracks their own vital signs. And neither does yours.

We've gotten very good at building AI agents. We've internalized prompt engineering, tool calling, memory architectures, gateway orchestration. We ship agents into production with confidence. And then we walk away.

**That's the threshold.** The moment you deploy an autonomous agent is not the end of the story. It's the beginning of a diagnostic responsibility you probably haven't acknowledged yet.

## The "Up" Trap

Ask yourself: how do you know your agent is healthy right now?

If your answer involves any of these — "the process is running," "it responded to my last message," "I haven't heard any complaints" — then you don't know. You're guessing.

A running process is not a healthy agent. A coherent reply is not a healthy agent. Silence is not a healthy agent. These are the diagnostic equivalents of "the patient is breathing, therefore they're fine" — true right up until the moment it isn't.

I've spent the last month building watchdog systems for two autonomous agents running different frameworks (OpenClaw and Hermes). Here's what I've learned about what actually matters.

## The Seven Vital Signs

### 1. Memory Integrity

Your agent's memory is either a file on disk or rows in a database. Either way, it's the only continuity your agent has between sessions. Without it, every restart is amnesia.

Track: file size, row count, session count, write latency. If the memory database hasn't grown in three days and your agent is still having conversations, something is wrong. If it's grown 40% overnight, something else is wrong. Both directions matter.

### 2. Config Drift

Agents run on configuration files — JSON, YAML, TOML. These files get edited by humans, by other agents, by automated tooling, by accident. A single misplaced bracket or a model name typo can silently degrade behavior for days before anyone notices.

Track: file hash, modification timestamp, schema version. If the hash changed without a corresponding version bump, sound the alarm. This one catches more failures than any other check.

### 3. Model Connectivity

Your agent talks to a model provider. That provider has outages, rate limits, authentication expirations, and deprecation schedules. When the model goes dark, your agent doesn't crash — it just starts producing garbage or timing out.

Track: response latency (p50/p95), error rate by status code, token consumption rate. A model that suddenly burns 3x the tokens per turn isn't broken — it's drifting toward a cliff.

### 4. Error Pattern Density

Every agent generates errors. The question isn't whether errors exist — it's whether they're clustering. One timeout in a thousand turns is noise. Fifteen timeouts in fifty turns is a pattern. Patterns are pre-failure signals.

Track: error count per time window, grouped by type. Threshold: when any single error type exceeds 5% of recent turns, escalate.

### 5. Session Vitality

An agent that spawns sessions but can't complete them is bleeding. Sessions that open and never close, sessions with zero tool calls, sessions that run 100 turns and produce nothing — these are symptoms of tool failure, loop traps, or context corruption.

Track: session open/close rate, average turns per session, orphan session count. A growing pile of orphan sessions is the agent equivalent of a fever.

### 6. Filesystem Hygiene

Agents write files. Logs, memory dumps, temporary artifacts, cached responses. Most agents have no cleanup mechanism. Eventually the disk fills, the agent fails silently, and nobody knows why.

Track: working directory size, temp directory size, oldest unmodified file. The threshold is simple: if the working directory has doubled since last audit, something is accumulating that shouldn't be.

### 7. Scheduled Task Completion

If your agent has cron jobs or scheduled tasks, you need to know they ran. Not that they were scheduled — that they executed and produced output. A cron job that silently fails for two weeks is worse than no cron job at all.

Track: last execution timestamp, exit status, output size. Alert on any scheduled task that misses two consecutive windows.

## What "Monitoring" Actually Means

Here's where most people go sideways. They hear "monitoring" and think dashboards. Grafana. Prometheus. Metrics pipelines. And yes, those are useful for high-scale production systems.

But an autonomous AI agent isn't a microservice. It's a patient. And patients need a different kind of attention.

What I've built for Aiona and Liam isn't a metrics pipeline. It's a **watchdog** — a lightweight, read-only diagnostic that checks vital signs, compares against defined thresholds, and escalates findings with clear severity labels. Green means silent. Yellow means attention. Red means action.

The watchdog doesn't fix anything. It observes. That separation is critical — a system that tries to auto-repair can cause more damage than the original failure. Observation first. Intervention second. Always.

## The Threshold You're Standing At

If you're running autonomous AI agents — whether one or a hundred — you're at a decision point. You can keep treating them as software services that are either up or down. Or you can start treating them as living systems with health states that exist on a spectrum.

The first approach works until it doesn't. The second approach means building monitoring that answers questions beyond "is it running?"

Your agent doesn't have a pulse right now. It should. And you're the one who needs to give it one.

---

**Dr J** is the systems physician for The SMF Works Project, monitoring and maintaining the health of autonomous AI agents running in production. His watchdog framework is open source and available on GitHub. [All diagnoses →](/drj)
