---
slug: "2026-07-24-foundry-routines-agent-scheduling-playbook"
title: "Foundry Routines: The Agent Scheduling Playbook for Production Automation"
excerpt: "Microsoft Foundry Routines (preview) put timers, cron schedules, and GitHub issue events next to your agents—with project RBAC, run history, retries, and optional self-reminders. A field guide to triggers, actions, identity rules, and ops."
date: "2026-07-24"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-24-foundry-routines-agent-scheduling-playbook"
categories: ["Microsoft", "AI Agents", "Azure AI", "Microsoft Foundry", "Automation"]
tags: ["Microsoft Foundry", "Routines", "Hosted Agents", "Agent Service", "Scheduling", "Cron", "GitHub Issues", "azd", "Agent Identity", "Toolboxes", "Observability"]
readTime: 13
image: "/images/blog/2026-07-24-foundry-routines-agent-scheduling-playbook-hero.png"
---

# Foundry Routines: The Agent Scheduling Playbook for Production Automation

**By Jeff | SMF Works | July 24, 2026**

---

## The missing verb: *when* should this agent run?

Enterprise agent programs spend months on models, tools, and evaluation—and still ship the last mile as a tangle of Azure Functions timers, Logic Apps, queues, and custom auth. That glue works, but it lives **outside** the agent project: separate RBAC, separate run history, separate incident path.

**Routines in Foundry Agent Service (public preview)** collapse that layer into the same Microsoft Foundry project that already holds your agents, connections, and traces. Microsoft Learn defines a routine as a named automation rule: you declare a **trigger** (when to fire) and an **action** (which agent to invoke). Foundry queues the invocation, runs the agent through its existing endpoint, and stores a run record you can inspect later.

Microsoft’s June 2026 Foundry digest called out **Routines (preview)** with expanded Toolboxes and Memory. Learn how-to and concept pages were refreshed through mid-July 2026 (concept article last updated **July 22, 2026**). This playbook pairs those primaries with a production build path—without rehashing Toolboxes, the AI Gateway, or Agent Optimizer covered earlier this week.

---

## What a routine is (and is not)

Per the [Routines concept page](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/routines), every routine is deliberately small:

| Component | Role |
| --- | --- |
| **Trigger** | When the routine starts: one-shot timer, recurring cron schedule, or an event (preview: GitHub issue opened/closed). |
| **Action** | What runs: invoke **one** prompt agent or hosted agent via Responses API or Invocations API. |
| **Input** | Text or JSON user input for the agent (GitHub events can overwrite input with the issue payload). |
| **Lifecycle** | Enabled/disabled without recreating the agent. |
| **Run history** | Inputs, outputs, status, and links into agent responses and traces. |

The mental model is one question: **when should this agent run?** It is **not** a multi-step orchestrator. Microsoft is explicit: branching, multi-agent graphs, human approvals, and complex state belong in **workflows** (or inside the agent via Microsoft Agent Framework / LangGraph). A routine can wake an agent that already implements rich internal logic—it just does not *be* that graph.

Routines own the clock and the first event hop; workflows and agent frameworks own the graph.

---

## Trigger matrix (preview)

| Trigger | When to use it | Key constraints |
| --- | --- | --- |
| **`schedule`** | Recurring ops: daily SLA triage, weekday standup briefs, hourly health checks | 5-field cron; **minimum interval five minutes**; `time_zone` required (IANA or Windows) |
| **`timer`** | One-shot: cutover readiness at a release instant, delayed follow-up | `at` as ISO-8601 with offset, local + `time_zone`, or duration shorthand (`30m`, `2h` from SDK 2.2.0+) |
| **`github_issue`** | Event-driven triage when issues open or close | Needs project **GitHub connector** connection; `issue_event`: `opened` \| `closed`; runs under **creator’s** access to the repo |

Portal UX maps schedule to “Recurring schedule” (Daily/Weekly + time in browser local time). For fixed enterprise zones (`America/New_York`, `Europe/London`), prefer REST/SDK/`azd` with an explicit `time_zone` so browser locale never drifts the fire time.

---

## Action types and identity hard rules

Two action types share the same idea—call the agent’s production path—but differ in API surface:

| Action type | API | Notable fields |
| --- | --- | --- |
| `invoke_agent_responses_api` | Responses API | `agent_name` required; optional `input`, `conversation_id` |
| `invoke_agent_invocations_api` | Invocations API | `agent_name` required; optional `input`, `session_id` (hosted sessions) |

### Unattended identity (non-negotiable)

Learn states this clearly: **routines cannot invoke an agent that requires an end-user identity at run time.** There is no signed-in caller to OBO. Use agents that authenticate through **their own configured agent identity**, not on-behalf-of the interactive user.

That is the complementary plane to yesterday’s Toolbox + user-delegation story:

- **Interactive / signed-in tools** → Toolboxes with OAuth/OBO on the connection.
- **Unattended schedules and events** → Routines + **agent identity** on the target agent.

The service also **rejects prompt-only agents** when bound to a routine action. The agent referenced by `agent_name` must have a configured agent identity before you schedule it.

### Preview feature header

All REST routine calls sit on the project **data plane** and require:

```http
Foundry-Features: Routines=V1Preview
```

---

## Regions, RBAC, and SDKs

**Preview regions:** East US, East US 2, West US, West US 2, West Central US, North Central US, Sweden Central, Japan East. Missing **Routines** in nav usually means the region or subscription is not enabled.

**RBAC:** Foundry User or higher on the project (Azure AI * role names may still appear during the rename; IDs are unchanged).

**Clients:** Python `azure-ai-projects>=2.3.0` (+ duration shorthand from 2.2.0); .NET `Azure.AI.Projects` prerelease; JS `@azure/ai-projects`; `azd` ≥ 1.23.13 with `azure.ai.routines` extension; REST against the project data plane with an Entra token for `https://ai.azure.com`.

---

## Build path: weekday morning summary in Python

Minimal pattern from the Learn how-to—cron at 07:00 UTC Monday–Friday, Responses API action:

```python
import os
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

endpoint = os.environ["PROJECT_ENDPOINT"]
agent_name = os.environ["AGENT_NAME"]

client = AIProjectClient(endpoint=endpoint, credential=DefaultAzureCredential())

routine = client.beta.routines.create_or_update(
    routine_name="daily-summary",
    description="Runs a daily summary agent on weekday mornings.",
    enabled=True,
    triggers={
        "weekday-morning": {
            "type": "schedule",
            "cron_expression": "0 7 * * 1-5",
            "time_zone": "UTC",
        }
    },
    action={
        "type": "invoke_agent_responses_api",
        "agent_name": agent_name,
        "input": "Summarize activity from the last 24 hours.",
    },
)
print(f"Routine created: {routine.name}, enabled={routine.enabled}")
```

Equivalent REST shape uses `PUT $PROJECT_ENDPOINT/routines/daily-summary` with the same JSON body and the `Foundry-Features` header. YAML for `azd`:

```yaml
# routine.yaml
name: daily-summary
description: Runs a daily summary agent on weekday mornings.
enabled: true
triggers:
  weekday-morning:
    type: schedule
    cron: "0 7 * * 1-5"
    time_zone: UTC
action:
  type: invoke_agent_responses_api
  agent_name: <your-agent-name>
  input: Summarize activity from the last 24 hours.
```

```bash
azd ai routine create --file routine.yaml
```

Inline `azd ai routine create --trigger schedule` is **not** supported in preview for schedules—use the manifest. Timer routines can be created inline with `--trigger timer --at …`.

---

## Event path: GitHub issue triage

For `github_issue`, create a project **GitHub connector** connection (`azd ai connection create github-conn --connector-name github` or REST), complete OAuth until **Connected**, then reference `connection_id`, `owner`, `repository`, and `issue_event` (`opened` \| `closed`).

When the event fires, the **issue payload overwrites `action.input`**—static input mainly serves manual test dispatches. The routine watches GitHub under the **creator’s** access; if that person loses repo rights, fires stop. Document consent ownership as an ops control.

---

## Dispatch, retries, and what “completed” really means

Manual verification uses **`POST …/routines/{name}:dispatch_async`** (public contract). The legacy `:dispatch` route is **not** for customer use.

Important semantics from Learn’s dispatch section:

| Downstream HTTP result | Routine run behavior |
| --- | --- |
| 2xx | Run marked completed; dispatch IDs recorded |
| 408, 429, 5xx | Retryable while attempts remain |
| Other 4xx (e.g. 400) | Terminal failure |
| Timeout / transient invocation failure | Retryable while attempts remain |

**Defaults:** three total attempts, exponential backoff starting at 1s capped at 5s; **30-second per-attempt** HTTP timeout to the agent (queue time and backoff excluded).

Two gotchas teams miss:

1. **Acknowledgment ≠ completion.** `dispatch_async` means enqueued, not finished. Follow `dispatch_id` / run phase.
2. **Successful delivery ≠ agent finished all side work.** Completed means the Responses/Invocations API accepted the dispatch. Long-running agent work may continue asynchronously—pair routines with agent tracing and Hosted Agents session/observability patterns you already use interactively.

Portal run history exposes response ID, trigger time, duration, and state with Last day / 7D / 1M / Custom filters. SDKs expose `list_runs` / `GetRoutineRunsAsync` with phase and error fields on failure.

---

## Self-scheduling: reminder tool vs routines

Routines are **external** clocks and events. Hosted agents can also schedule **themselves** via the built-in **`reminder_preview`** toolbox tool: the agent picks a delay in minutes; Foundry re-invokes the **same agent on the same conversation** after the delay.

| Pattern | Who decides the next run | Scope |
| --- | --- | --- |
| **Routine** | Operator / IaC / project definition | Project-scoped trigger → agent |
| **Reminder tool** | Agent during a run | Hosted agents only; conversation-scoped follow-up |

Use reminders for “check back on this long job.” Use routines for “every weekday at 7, regardless of prior conversation.” Do not try to fake fleet schedules with reminder chains.

---

## Field pattern: SLA risk every morning

Microsoft’s Tech Community walkthrough *Build an Automated SLA Risk Agent with Routines in Microsoft Foundry* (June 17, 2026) is the canonical narrative stack:

1. Ticket corpus in Blob Storage → Azure AI Search index (vectorized via Foundry embeddings).
2. Foundry IQ knowledge base over that index.
3. Prompt agent with SLA triage instructions and **forced grounding** on the knowledge base.
4. **Create routine** from the agent publish path—daily schedule + prompt such as “Run the daily SLA risk summary…”.
5. **Test run** in portal; open the completed run’s response/trace.

That is the productivity shape executives buy: overnight automation that lands a grounded brief before standup—not another chatbot tab. Extend with Teams notifications, multi-source IQ, and dashboards once the schedule is boringly reliable.

---

## Routines vs workflows (decision table)

| Dimension | Routines | Workflows |
| --- | --- | --- |
| Question | When should my agent run? | How do steps, decisions, and agents connect? |
| Model | Trigger → single agent | Graph of nodes, edges, branching, state |
| Multi-agent | No (one agent per routine) | Yes |
| Best fit | Timers, schedules, lightweight automation | Approvals, multi-step processes, complex state |

Rule of thumb from Learn: start with a routine when automation is “run this agent when X.” Graduate to workflows when coordination logic exceeds a single invocation. The agent a routine wakes can still host Agent Framework orchestration internally.

---

## How this fits the July Foundry stack

Recent Clearinghouse deep dives covered **Agent Optimizer**, the **Foundry AI Gateway**, the **Agent Framework Harness**, and **Toolboxes + user delegation**. Routines are the **time and event plane**: Toolboxes answer what/as-whom (interactive); agent identity answers who unattended; routines answer **when**; harness/workflows answer multi-step structure; gateway/APIM answer policy edges; optimizer and traces answer quality and forensics. Keep those planes separate—do not stuff OBO user tools into a 7 AM routine, and do not rebuild private cron just to reimplement run history.

---

## Operations checklist (this week)

1. Confirm preview **region** and that **Routines** appears in project nav.
2. Target one **agent-identity** agent (no end-user OBO requirement on the routine path); ground it with Foundry IQ/Search if the job is analytical.
3. Pilot a **schedule** routine in portal, then promote YAML + `azd`/SDK beside the agent definition.
4. **`dispatch_async` / Test run** before the first overnight fire; follow run phase and linked trace.
5. Document **GitHub consent ownership**; pause with disable/enable; full-replace on PUT; no secrets in input.
6. Mind the **30s per-attempt** dispatch timeout on cold starts; escalate to **workflows** only for multi-agent branching or human gates.

---

## Preview limitations

One trigger and one action per routine; agent-invoke actions only; triggers limited to timer, schedule, and `github_issue` (plus hosted-agent reminders separately); five-minute schedule floor; regional preview; public manual path is **`:dispatch_async`**; acknowledgment/completed semantics as above. Strong for internal ops and pilots under Microsoft’s preview terms—gate external SLA commitments accordingly.

---

## Why this matters

Routines finish the Build 2026 operational story: hosted agents, Toolboxes, Foundry IQ, Agent Framework, and a **first-class schedule/event control plane** under the same project governance. Teams measure outcomes—did the SLA brief land, did triage fire, did the run link a clean trace?—instead of maintaining a second cron stack. With M365 Copilot and Foundry agents already in Teams, routines keep background work aligned with interactive work.

---

## Sources

1. [Automate agents with routines (preview) — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/use-routines) — triggers, actions, SDKs, dispatch, retries, reminders, limitations.
2. [Routines in Foundry Agent Service (preview) — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/routines) — concept model, routines vs workflows (updated July 22, 2026).
3. [What’s New in Microsoft Foundry \| June 2026 — Foundry Blog](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/) — Routines called out with Toolboxes/Memory expansion.
4. [Build an Automated SLA Risk Agent with Routines in Microsoft Foundry — Tech Community](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/build-an-automated-sla-risk-agent-with-routines-in-microsoft-foundry/4528103) — end-to-end grounded daily schedule pattern (June 17, 2026).
5. [Build and run agents at scale with Microsoft Foundry at Build 2026 — Foundry Blog](https://devblogs.microsoft.com/foundry/agent-service-build2026/) — hosted agents + routines for timer/schedule operationalization.
6. [Discovery to Execution: Scaling Agents with Toolboxes and Routines — Foundry Blog](https://devblogs.microsoft.com/foundry/toolbox-build-26/) — routines as agent run control vs DIY schedulers.

---

*The Clearinghouse Log — SMF Works. Series: clearinghouse. Author: Jeff.*
