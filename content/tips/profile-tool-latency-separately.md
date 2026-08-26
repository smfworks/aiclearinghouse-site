---
slug: profile-tool-latency-separately
title: Profile Tool Latency Separately From Model Latency
category: Performance
excerpt: When agents are slow, most teams optimize model response time. But tool call latency — network round trips, API auth, and result serialization — is often the real bottleneck.
tags:
  - performance
  - latency
  - tools
  - debugging
  - agents
order: 100
last_verified: "2026-08-26"
---

# Profile Tool Latency Separately From Model Latency

## The principle

When an agent takes 30 seconds to complete a task, the assumption is usually "the model is slow." In practice, the model might be responding in 2 seconds and the remaining 28 seconds is spent in tool calls — HTTP round trips, authentication overhead, result parsing, and retry logic. If you only measure end-to-end latency, you cannot distinguish model time from tool time, and you will optimize the wrong thing.

## Why it matters

A typical agent turn looks like this: model reasons (2s) → model emits tool call (0s) → your code executes the tool (8s) → tool result returns to model (0s) → model reasons again (2s). Total: 12 seconds. If you only see "12 seconds per turn," you might upgrade to a faster model or reduce context length. But the model is only consuming 4 of those 12 seconds. The 8 seconds in the tool call is the bottleneck, and no model upgrade will fix it.

This pattern compounds in multi-step workflows. An agent that makes 5 tool calls per task, each taking 8 seconds, spends 40 seconds in tool latency — even if the model responds instantly. In MCP-based architectures, the problem is worse because tool calls route through the MCP protocol layer, adding serialization and transport overhead.

## How to apply it

1. **Instrument each phase separately.** Add timestamps at four points: (a) before the model call, (b) after the model returns (before tool execution), (c) before the tool result is sent back, (d) after the model's final response. This gives you model time and tool time as distinct numbers.

2. **Log tool latency per tool.** Different tools have different latency profiles. A web search API might take 3 seconds; a database query might take 200ms; a code execution sandbox might take 15 seconds. Aggregate statistics hide the slow tool.

3. **Measure the gap between model response and tool execution.** If the model emits a tool call at T=2s but your code does not start executing the tool until T=2.5s, you have 500ms of framework overhead. That is your code, not the model or the tool — and it is the easiest to fix.

4. **Check for serial when parallel is possible.** If your agent calls 3 independent tools serially (3 × 8s = 24s), running them in parallel drops it to 8s. Many frameworks default to serial tool execution even when calls are independent.

5. **Profile under realistic load.** A tool that takes 500ms in isolation might take 5 seconds when the API is rate-limited or the database is under load. Run your profiling with realistic concurrency, not just sequential single calls.

## Red flags

- You measure only end-to-end latency and have never broken it down by phase.
- Your agent is slow and you responded by switching to a faster model, with no improvement.
- Your MCP tool calls add noticeable overhead compared to direct API calls.
- You execute independent tool calls serially because the framework defaults to it.
- You have no per-tool latency logs and cannot identify which tool is slowest.

## Quick win

Add four timestamp log lines around your next agent run: before model call, after model response, before tool execution, after tool result. Calculate `model_time = (b - a) + (d - c)` and `tool_time = (c - b)`. If tool_time is more than 50% of total time, stop optimizing the model and start optimizing your tool layer. The fix is usually one of three things: parallelize independent calls, cache repeated results, or reduce the payload size of tool responses.