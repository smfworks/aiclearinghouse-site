---
slug: cron-job-scheduler
title: Cron Job Scheduler
excerpt: Schedule recurring tasks in natural language and deliver them to any channel.
category: Productivity
tags:
  - hermes
  - cron
  - scheduling
  - automation
for: Hermes Agent
author: Nous Research
install: Built into Hermes core (hermes cron add ...)
dependencies:
  - Hermes Agent
  - Enabled cron scheduler
  - At least one connected channel or log target
image: /images/skills/productivity.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/cron
order: 36
last_verified: 2026-06-15
---

# Cron Job Scheduler

Hermes includes a built-in cron scheduler that lets you run tasks on a schedule using plain English. Results can be delivered back to Telegram, Discord, Slack, Email, or stored to disk.

## What it is

A lightweight job scheduler inside the agent runtime. You describe the schedule and the task in natural language, and Hermes handles the rest — waking the right tools, running the workflow, and routing the output.

## Who it targets

- Anyone running daily reports, nightly backups, or weekly audits.
- Teams that want agent-driven alerts without building a separate pipeline.
- Users who prefer chat-style scheduling over crontab syntax.

## Dependencies

- Hermes Agent
- Cron scheduler enabled
- At least one connected channel or log target

## How to install

The cron scheduler is built into Hermes core. Add a job with:

```bash
hermes cron add "every day at 8am" "Summarize my unread newsletters"
```

## Skill source

- [Hermes Agent cron directory](https://github.com/NousResearch/hermes-agent/tree/main/hermes/cron)
