---
slug: log-token-cost-per-task
title: Log Token Cost Per Task, Not Per Day
category: Cost
excerpt: Daily spend hides which agent workflows are expensive. Attribute tokens to named tasks so you can kill or rewrite the wasteful ones.
tags:
  - cost
  - observability
  - agents
  - metrics
order: 21
last_verified: "2026-07-13"
---

# Log Token Cost Per Task, Not Per Day

## The principle

A $40 day tells you nothing. An $18 research-synthesis task and a $1 inbox-triage task tell you what to fix.

## Why it matters

Agent fleets multiply quiet waste: retries, oversized context dumps, and tool loops that re-read the same files. Without per-task attribution, you optimize the wrong workflow.

## How to apply it

1. Name every agent goal (`daily-ai-news-draft`, `blog-amplify-pack`).
2. Log input/output tokens and model id on completion.
3. Weekly: rank tasks by cost and by cost-per-accepted-output.
4. Cap retries and context size on the top cost offenders first.

## Red flags

- One shared API key with no task tags
- "The model is expensive" complaints without a top-5 task list

## Quick win

Add a single `task_id` field to your agent run logger this week. Even a CSV is enough to start.
