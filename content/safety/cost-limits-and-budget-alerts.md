---
slug: cost-limits-and-budget-alerts
title: Cost Limits and Budget Alerts
excerpt: Set spending caps, rate limits, and budget alerts before your agent deployment surprises you with an expensive bill.
category: Trust
tags:
  - safety
  - cost
  - budget
  - alerts
  - limits
  - deployment
last_verified: 2026-06-24
---

# Cost Limits and Budget Alerts

Agents can spend money fast. A loop that retries a failing tool, a runaway reasoning session, or a sudden traffic spike can turn a $50 day into a $500 day. Cost limits and budget alerts are the cheapest insurance you can buy against bill shock.

## 1. Set hard spending caps

- [ ] Configure a monthly or per-project spending cap at the provider.
- [ ] Set per-API-key limits if your provider supports them.
- [ ] Use pre-paid credits instead of post-paid billing for experiments.
- [ ] Require human approval to raise a cap.

Hard caps stop the bleeding. Soft alerts only tell you that the bleeding started.

## 2. Rate-limit agent actions

- [ ] Limit tool calls per minute per agent.
- [ ] Limit LLM requests per hour.
- [ ] Cap the maximum context length the agent can send.
- [ ] Restrict the number of retries on failure.

Rate limits protect against both bugs and abuse. A stuck loop should hit a ceiling quickly.

## 3. Configure budget alerts

- [ ] Alert at 50%, 75%, and 90% of the monthly budget.
- [ ] Alert on unusual daily spend spikes, not just cumulative totals.
- [ ] Send alerts to more than one channel: email, Slack, and PagerDuty.
- [ ] Test that alerts actually reach someone who can act.

An unread alert is not a control.

## 4. Track cost per task

- [ ] Tag every LLM request and tool call with a task or session ID.
- [ ] Record token counts, model used, and cost per request.
- [ ] Surface cost in the agent's output or admin dashboard.
- [ ] Compare actual spend to expected spend for recurring workflows.

Per-task cost tracking catches drift. A workflow that suddenly costs 3x more usually has a bug.

## 5. Right-size models

- [ ] Use smaller, cheaper models for classification and routing.
- [ ] Reserve expensive reasoning models for genuinely hard steps.
- [ ] Cache repeated context where possible.
- [ ] Measure cost versus accuracy for each model choice.

The most expensive model is rarely the most cost-effective for every step.

## 6. Plan for runaway agents

- [ ] Define a kill switch that disables the agent immediately.
- [ ] Auto-pause the agent if daily spend exceeds a threshold.
- [ ] Require re-approval after any budget alert.
- [ ] Keep a recent log of actions for incident review.

A runaway agent is a safety incident, not just a cost incident.

## Budget levels by environment

| Environment | Monthly cap | Daily alert | Per-request limit |
|-------------|-------------|-------------|-------------------|
| Local dev   | $50         | $10         | 32K tokens        |
| Staging     | $200        | $25         | 64K tokens        |
| Production  | $2,000+     | $100        | Per-task approval |

## When to stop

Pause the deployment if:

- You cannot set a hard cap at your provider.
- No one is on call to respond to budget alerts.
- You do not know the cost of a typical task.
- The agent can approve its own spending increases.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [LLM Pricing](/llms)

> Last verified: 2026-06-24. Provider billing controls change; review them quarterly.
