---
slug: monitoring-and-auditing
title: Monitoring and Auditing Agents
excerpt: Log, alert on, and review agent behavior so you can catch drift, misuse, and failures before they become incidents.
category: Trust
tags:
  - safety
  - monitoring
  - observability
  - audit
last_verified: 2026-06-18
---

# Monitoring and Auditing Agents

You cannot secure what you cannot see. Agents make decisions asynchronously, call tools, and process untrusted content. Without good monitoring, a problem can run for hours or days before anyone notices.

## What to log

Log at least these events:

- Every LLM request, with model name, prompt tokens, and timestamp
- Every LLM response, including tool calls and finish reason
- Every tool invocation, with inputs and outputs
- Every approval decision, including who approved and when
- Every error, rejection, or timeout
- Every change to the agent's configuration or tool set

Logs should be structured and queryable. Plaintext logs are hard to aggregate and alert on.

## Metrics to watch

| Metric | Why it matters |
|---|---|
| Tool call rate | Spikes may indicate a loop, attack, or runaway task |
| Error rate | A rising error rate can signal model drift or tool breakage |
| Latency | Sudden jumps may mean the model is struggling or a tool is failing |
| Token usage | Unusual increases can indicate prompt injection loops or inefficiency |
| Rejection rate | High validation rejections may signal an attack or bad schema fit |
| Approval rate | Too many approvals may mean users are clicking through warnings |
| Unique tools used | New tools being called can signal scope creep or exploration |

## Alerting rules

Start with simple, high-signal alerts:

- More than N tool calls in a single session.
- A high-risk tool is called for the first time in 24 hours.
- Multiple validation rejections from one user or session.
- An agent calls a tool outside its approved set.
- Error rate exceeds a baseline threshold.
- Token usage is more than 3 standard deviations above the norm.

Avoid alert fatigue. A noisy alert gets ignored.

## The kill switch

Every agent deployment needs a way to stop it quickly:

- A manual disable switch in your admin dashboard.
- An automated circuit breaker triggered by alerts.
- The ability to revoke the agent's credentials instantly.
- A clear runbook for disabling the agent during an incident.

Test the kill switch before you need it.

## Audit reviews

Monitoring is not only for live incidents. Schedule regular reviews:

- **Weekly.** Review alert trends and any escalations.
- **Monthly.** Sample sessions to check for drift or quality issues.
- **Quarterly.** Review the agent's tool set, permissions, and approval model.
- **After incidents.** Update logging, alerts, and runbooks based on what you learned.

## Tool-specific observability

Some tools need extra attention:

- **Shell execution.** Log the full command, exit code, and output. Alert on commands outside an allowlist.
- **Database queries.** Log the query shape, not sensitive values. Alert on write operations.
- **Network calls.** Log destination, method, status code, and latency. Alert on new domains.
- **File operations.** Log reads and writes, especially outside the workspace.

## Retention and privacy

- Keep logs long enough to support incident review, but not forever.
- Redact or tokenize PII before long-term retention.
- Restrict access to logs to people who genuinely need it.
- Consider compliance requirements for your industry.

## Common mistakes

- **Logging everything except the model's reasoning.** If you only log tool calls, you miss the chain of thought that led to them.
- **No alerting on anomalies.** Logs without alerts are a post-mortem tool, not a safety tool.
- **Letting the agent read its own logs.** That can leak secrets or provide feedback loops for attacks.
- **Ignoring approval fatigue.** If users approve everything, your human-in-the-loop is decorative.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Incident Response for Agent Failures](/safety/incident-response)
- [Agent Permission Models](/safety/permission-models)
- [Tip: Watch Costs](/tips/watch-costs)

> Last verified: 2026-06-18.
