---
slug: incident-response
title: Incident Response for Agent Failures
excerpt: Runbooks, kill switches, and recovery steps for when an agent causes a security, cost, or reliability incident.
category: Trust
tags:
  - safety
  - incident response
  - runbook
  - recovery
last_verified: 2026-06-18
---

# Incident Response for Agent Failures

Agents fail differently from traditional software. They can act on ambiguous prompts, get stuck in loops, leak data through tool calls, or be manipulated by users. An incident response plan tailored to agent behavior will save time and limit damage.

## Common agent incidents

| Incident | Signs |
|---|---|
| Prompt injection | Unexpected tool calls, replies mentioning hidden instructions |
| Runaway loop | Token usage spike, repeated tool calls, high latency |
| Data leak | Sensitive content in outputs, unexpected external API calls |
| Tool misuse | Writes or deletions outside the workspace, unapproved deploys |
| Cost spike | Sudden increase in API spend or token consumption |
| Model drift | Quality drops, wrong answers, refusal patterns change |
| Credential exposure | Secret appears in logs or model output |

## The first five minutes

When you suspect an agent incident:

1. **Stop the agent.** Use the kill switch or revoke its credentials.
2. **Preserve logs.** Capture request logs, tool call logs, and approval logs.
3. **Identify scope.** Determine what data and systems were involved.
4. **Notify owners.** Alert the agent owner, security, and any affected stakeholders.
5. **Do not delete evidence.** You need the trace to understand what happened.

## Kill switch checklist

A kill switch should let you:

- Disable the agent immediately.
- Revoke its API keys and tokens.
- Block its network egress.
- Prevent new sessions from starting.
- Alert the team that the agent was disabled.

Test the kill switch in a drill. A switch that does not work under pressure is not a switch.

## Investigation questions

After containment, ask:

- What was the initial input or trigger?
- Which tools were called, in what order?
- What data was read or written?
- Did a human approve any of the actions?
- Was the model version or tool set recently changed?
- Has this pattern happened before?

## Recovery

Recovery steps depend on the incident:

- **Data leak.** Identify affected data, notify impacted parties, rotate exposed credentials.
- **Unauthorized writes.** Revert changes from version control or backups.
- **Cost spike.** Cap quotas, review rate limits, identify the trigger.
- **Prompt injection.** Update defenses, review system prompt, re-test.
- **Credential exposure.** Rotate all affected secrets and review access logs.

## Post-incident review

Hold a blameless post-mortem within a few days. Focus on:

- How the incident started.
- What detection and containment worked.
- What failed or was too slow.
- Which safety controls need to be added or tightened.
- How to prevent recurrence.

Update your runbooks, checklists, and monitoring based on what you learn.

## Runbook template

Keep a short runbook for each agent:

```markdown
# Agent: {name}
Owner: {person}
Kill switch: {link or command}
Credentials: {where to revoke}
Logs: {where to find them}
High-risk tools: {list}
Common incident signs: {list}
Recovery steps: {numbered list}
```

## Communication

Have a communication plan:

- Internal Slack or Teams channel for incident coordination.
- Escalation path for security, legal, and executive teams.
- Customer notification template if external data is affected.
- Regulatory notification checklist if required.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Agent Permission Models](/safety/permission-models)
- [Sandboxing Agent Runtimes](/safety/sandboxing)

> Last verified: 2026-06-18.
