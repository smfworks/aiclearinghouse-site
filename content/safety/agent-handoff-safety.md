---
slug: agent-handoff-safety
title: Agent Handoff Safety
excerpt: Design safe transitions when one agent passes state, tasks, or decisions to another agent so nothing is lost or misused.
category: Trust
tags:
  - safety
  - handoff
  - multi-agent
  - orchestration
last_verified: 2026-07-01
---

# Agent Handoff Safety

## Why handoffs matter

Multi-agent systems are powerful because different agents can specialize. But every handoff — passing a task, a file, a decision, or user context from one agent to another — is a place where intent can drift, data can leak, or actions can be duplicated.

## What can go wrong

- **Context loss.** Agent A knows a user preference; Agent B does not receive it.
- **Permission escalation.** Agent A has read access; Agent B assumes write access.
- **Double action.** Both agents try to fulfill the same request.
- **Data leakage.** Handoff payload includes more data than the receiving agent needs.
- **Ambiguous ownership.** It is unclear which agent is responsible when something fails.

## How to design safer handoffs

1. **Use explicit contracts.** Define exactly what the handoff payload contains: task ID, required inputs, decision state, and constraints.
2. **Scope permissions per agent.** Do not inherit broad permissions just because another agent had them.
3. **Log every handoff.** Record sender, receiver, timestamp, payload schema, and outcome.
4. **Require acknowledgment.** The receiving agent should confirm it received and understood the handoff.
5. **Fail closed.** If a handoff is malformed or unauthorized, stop rather than guess.

## Handoff checklist

- [ ] Payload is validated against a schema.
- [ ] Receiving agent has the minimum permissions needed.
- [ ] Sensitive fields are redacted if not required.
- [ ] A unique task ID prevents duplicate execution.
- [ ] Timeout and retry policy is defined.
- [ ] Human escalation path exists for ambiguous handoffs.

## Related

- [Agent Identity and Access Control](/safety/agent-identity-and-access)
- [Output Validation for Agent Tool Calls](/safety/output-validation)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
