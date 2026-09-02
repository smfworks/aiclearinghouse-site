---
slug: building-durable-agent-workflows
title: "Building Durable Agent Workflows: Recovery, Checkpoints, and Attestation"
excerpt: "A practical guide to adding durable execution to AI agent workflows — when to checkpoint, when to use durable runtimes, and how to choose between Temporal, Restate, LangGraph persistence, and Diagrid Catalyst."
category: Guides
tags:
  - durable-execution
  - agents
  - reliability
  - orchestration
  - recovery
order: 99
last_verified: "2026-09-02"
---

# Building Durable Agent Workflows: Recovery, Checkpoints, and Attestation

## Why durability matters for agents

AI agents are nonlinear programs that wait for external inputs, call tools, and run for minutes or hours. When something fails — a model API times out, a tool returns an error, a pod crashes, a deploy restarts the container — the agent loses all in-flight progress unless the workflow is durable.

Traditional checkpointing (save state at graph boundaries) is better than nothing but has gaps:

- **Checkpoint granularity:** If you checkpoint at graph superstep boundaries, you lose all work done within a step when a failure happens mid-step.
- **Recovery logic:** The developer writes custom recovery code to detect where the failure occurred and what to replay.
- **Attestation:** No cryptographic proof of what the agent did. For compliance, audit, or security, "the agent said it did X" is not sufficient without a verifiable record.

## The durability spectrum

| Approach | Granularity | Recovery | Attestation | Framework Lock-in |
|----------|-------------|----------|-------------|-------------------|
| Manual checkpointing | Per-step | Custom code | None | None |
| LangGraph persistence | Graph superstep | Resume from checkpoint | None | LangGraph |
| Temporal / Restate | Per-activity | Replay-based | Limited | Framework-specific |
| Diagrid Catalyst 2.0 | Per model/tool call | Automatic | Cryptographic | Multi-framework |

## When to use each

### Manual checkpointing

Use for: Simple, short-lived agents where a full retry is cheap.
Do not use for: Multi-step agents where re-running a step has side effects (sending emails, writing files, charging credit cards).

### LangGraph persistence

Use for: LangGraph-native workflows where you are okay with checkpointing at graph boundaries. LangGraph's Agent Server provides persistent task execution.
Do not use for: Workflows spanning multiple frameworks, or when you need cryptographic attestation.

### Temporal or Restate

Use for: Long-running workflows with replay-based execution. Both are battle-tested in production for non-AI workloads and can host agent workflows.
Do not use for: If you need agent-specific features like MCP server management, agent identity, or multi-framework support without custom integration.

### Diagrid Catalyst 2.0

Use for: Multi-framework agent deployments (LangGraph, Google ADK, Microsoft Agent Framework, CrewAI, OpenAI Agents SDK, Pydantic AI, AWS Strands, Claude Managed Agents) where you want:
- Automatic recovery from individual model and tool call failures (not just graph boundaries)
- Cryptographic attestation of every step
- Agent identity with mTLS
- MCP server catalog and governance
- Air-gapped or sovereign deployment

Do not use for: Simple agents where durability overhead is not justified, or if you are deeply committed to a single framework's native persistence.

## Design principles for durable agent workflows

### 1. Make every side effect idempotent

If your agent sends an email, includes a unique transaction ID. If it writes to a database, use upserts. If it calls a payment API, use idempotency keys. When the workflow resumes from a failure, it will replay the step — and the side effect should be a no-op, not a duplicate.

### 2. Separate durable state from ephemeral context

Durable state is what the agent needs to resume: the task, the plan, completed steps, pending steps. Ephemeral context is the current conversation window, tool outputs being processed, and intermediate reasoning. Checkpoint durable state explicitly; let ephemeral context be reconstructed.

### 3. Tag every step with a trace ID

Each step in the workflow should carry a unique trace ID that links to the durable execution log. When you replay a failed step, the trace ID lets you verify that the replayed result matches the original attempt — or detect divergence.

### 4. Set explicit timeouts per step

Model calls, tool calls, and external API calls should each have explicit timeouts. Without them, a hung API call can block the entire workflow indefinitely. The durable runtime can then treat a timeout as a failure and trigger recovery.

### 5. Use verifiable execution for compliance-sensitive workflows

If your agent makes decisions that require audit (financial, healthcare, regulated industries), use a runtime that provides cryptographic attestation. Diagrid Catalyst 2.0 signs every step into a tamper-evident record validated by the Dapr Sentry trust anchor. This lets security teams confirm an agent did what it claimed to do.

## Common pitfalls

- **Checkpointing too coarsely.** If you only checkpoint at the end of a multi-step plan, a failure at step 9 of 10 means re-running steps 1–9. Checkpoint after each step.
- **Not handling partial failures.** A tool call that returns a partial result (some data but with an error) is harder to recover from than a clean failure. Decide upfront: do you retry, skip, or fail the workflow?
- **Ignoring token costs during recovery.** When a workflow resumes and replays a step, the model call happens again — and you pay for the tokens again. Budget for replay costs in your cost model.
- **Assuming the agent will be the same after recovery.** If the model has been updated between the original run and the recovery, the agent may produce different outputs. Pin your model version.