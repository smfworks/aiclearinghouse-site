---
slug: "2026-07-27-agent-framework-declarative-workflows-1-0"
title: "Agent Framework Declarative Workflows 1.0: Orchestration as Reviewable YAML"
excerpt: "Microsoft Agent Framework Declarative Workflows hit 1.0 on Python and .NET. Move multi-agent routing, Power Fx state, human-in-the-loop, and checkpoint/resume out of call graphs into versioned YAML that still runs as a first-class Workflow."
date: "2026-07-27"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-27-agent-framework-declarative-workflows-1-0"
categories: ["Microsoft", "AI Agents", "Azure AI", "Developer Tools"]
tags: ["Microsoft Agent Framework", "Declarative Workflows", "Foundry", "YAML", "multi-agent", "Power Fx", "orchestration"]
readTime: 14
image: "/images/blog/2026-07-27-agent-framework-declarative-workflows-1-0-hero.png"
---

# Agent Framework Declarative Workflows 1.0: Orchestration as Reviewable YAML

**By Jeff | SMF Works | July 27, 2026**

---

## Why this ship matters

Most multi-agent systems still hide their real product behavior in application code. The triage step, the billing branch, the escalation gate, the human approval pause—those decisions live inside `if` chains, builder graphs, and private helpers. Architects cannot review them without reading the framework. Product owners cannot propose a routing change without a pull request that also recompiles the host. Ops cannot tell whether last week’s incident was a model failure or a handoff that never fired.

On **July 23, 2026**, Microsoft Agent Framework closed that gap for production teams: **Declarative Workflows reached 1.0 across both SDKs**. Python’s `agent-framework-declarative` package is now **1.0.0**, joining the already-stable .NET package `Microsoft.Agents.AI.Workflows.Declarative`. You author orchestration in YAML, load it into the **same `Workflow` type** as code-first graphs, then run, stream, checkpoint, and compose it like any other workflow.

This Clearinghouse post is a field playbook: what 1.0 actually gives you, how YAML maps to Foundry agents and tools, when to stay declarative versus drop to code, and a practical week-one path that pairs cleanly with Harness, Toolboxes, and hosted Foundry runtimes we have covered in recent dailies.

---

## What 1.0 freezes

Declarative workflows are not a separate runtime. They are an **authoring surface** that compiles into the standard Agent Framework workflow model:

| Capability | What 1.0 makes durable |
|------------|------------------------|
| **Authoring** | YAML definitions for multi-agent orchestration |
| **Python package** | `agent-framework-declarative` **1.0.0** |
| **.NET package** | `Microsoft.Agents.AI.Workflows.Declarative` (stable) |
| **Runtime shape** | Loads into ordinary `Workflow` — run, stream, compose with code-first graphs |
| **Expressions** | Power Fx-style formulas over workflow state (`=Local…`, `=System…`, `=If(…)`) |
| **Samples** | Support routing, marketing pipelines, HITL, checkpoint/resume, MCP/HTTP/function tools |

The design intent, in Microsoft’s words, is separation: *orchestration as a document rather than a call graph*, so product, architecture, and engineering can review behavior without reading framework internals—and so changing an approval step or handoff is often a YAML diff rather than a control-flow rewrite.

You still keep full runtime fidelity. A declarative workflow is not a toy subset that “mostly” works. It is the same execution surface you already trust for code-built graphs.

---

## Anatomy: two YAML dialects, one idea

Agent Framework exposes **two closely related YAML shapes**. Both describe actions; they differ in how the document is rooted.

### C# / trigger-style (Foundry-friendly)

```yaml
kind: Workflow
trigger:
  kind: OnConversationStart
  id: support_router
  actions:
    - kind: InvokeAzureAgent
      id: triage
      conversationId: =System.ConversationId
      agent:
        name: TriageAgent
      output:
        responseObject: Local.Triage

    - kind: If
      id: route
      condition: =Local.Triage.Category = "Billing"
      then:
        - kind: InvokeAzureAgent
          id: billing
          agent:
            name: BillingAgent
      else:
        - kind: If
          condition: =Local.Triage.Category = "Sales"
          then:
            - kind: InvokeAzureAgent
              id: sales
              agent:
                name: SalesAgent
          else:
            - kind: InvokeAzureAgent
              id: support
              agent:
                name: SupportAgent
```

Required structure: `kind: Workflow`, a `trigger` (`OnConversationStart` is the common path), a unique `trigger.id`, and an `actions` list. Agents named in the document resolve against your **Microsoft Foundry** project.

### Python / name-style

```yaml
name: my-workflow
description: A simple workflow example
inputs:
  parameterName:
    type: string
    description: Optional typed inputs
actions:
  - kind: SetValue
    path: turn.greeting
    value: Hello, World!
  - kind: SendActivity
    activity:
      text: =turn.greeting
```

Python samples under `python/samples/03-workflows/declarative/` also show richer patterns—customer support with ticket creation and routing, marketing sequences, deep research, Foundry Toolbox MCP invocation, and human-in-the-loop.

The mental model is the same either way: **actions are first-class ops** (set state, branch, invoke agent, call tool, ask a human, send activity), and **expressions bind them** to conversation and local state.

---

## Load path: three lines to a real Workflow

**Python**

```python
from agent_framework.declarative import WorkflowFactory

factory = WorkflowFactory()
workflow = factory.create_workflow_from_yaml_path("support_router.yaml")
# workflow is a standard Workflow — run, stream, or compose
```

Install: `pip install agent-framework-declarative`

**.NET**

```csharp
using Microsoft.Agents.AI.Workflows;
using Microsoft.Agents.AI.Workflows.Declarative;

Workflow workflow = DeclarativeWorkflowBuilder.Build<string>(
    "CustomerSupport.yaml",
    options); // agent provider + configuration
```

Packages commonly paired with Foundry:

```bash
dotnet add package Microsoft.Agents.AI.Workflows.Declarative
dotnet add package Microsoft.Agents.AI.Workflows.Declarative.AzureAI
# optional MCP actions:
dotnet add package Microsoft.Agents.AI.Workflows.Declarative.Mcp
```

After load, treat the object like any other workflow: unit-test it, attach observability, host it behind an API, or compose it inside a larger graph when one slice truly needs custom executors.

---

## Action catalog that covers real multi-agent work

Microsoft’s samples and Learn overview group actions into practical buckets. Use this as a design checklist when you migrate an orchestration out of code:

| Bucket | Representative kinds | Use when |
|--------|----------------------|----------|
| **State** | `SetValue`, `SetVariable`, `ResetVariable` | Capture triage results, ticket IDs, flags |
| **Control flow** | `If`, `ConditionGroup`, `Foreach`, `GotoAction` | Route categories, multi-way fan-out, loops |
| **Agents** | `InvokeAzureAgent` | Call Foundry-hosted specialists by name |
| **Tools** | `InvokeFunctionTool`, MCP invoke, HTTP request | App code, Toolbox MCP, external APIs |
| **Conversation** | `CreateConversation`, `SendActivity` | Scoped sub-threads, user-visible updates |
| **Human-in-the-loop** | `Question`, `RequestExternalInput` | Approvals, missing data, policy gates |
| **Durability** | checkpoint / resume patterns in samples | Long-running support and research jobs |

The customer-support sample shows the pattern in production shape: a self-service agent loops until resolved or ticket-needed, a ticketing agent creates the case, a routing agent chooses a team, conditional branches open a support conversation, and activity messages keep the user informed (`Created ticket #…`, `Routing to …`). That is the class of flow teams previously buried in service code—and then feared to change.

Power Fx-style expressions keep the YAML dense but readable:

```text
=If(IsBlank(inputs.name), "World", inputs.name)
=Local.Triage.Category = "Billing"
=Not(Local.ServiceParameters.IsResolved) And Not(Local.ServiceParameters.NeedsTicket)
```

State is explicit. Branch predicates are reviewable. Diffs are human-scale.

---

## When declarative wins (and when code still wins)

Learn’s guidance is clear enough to put on a team wiki:

| Scenario | Prefer |
|----------|--------|
| Standard orchestration patterns | **Declarative** |
| Workflows that change frequently | **Declarative** |
| Non-developers need to modify flows | **Declarative** |
| Complex custom logic | **Programmatic** |
| Maximum flexibility and control | **Programmatic** |
| Tight integration with existing Python/.NET internals | **Programmatic** |

The productive enterprise pattern is **hybrid**, not purity. Put routing, approvals, and specialist handoffs in YAML. Keep proprietary scoring, exotic concurrency, or deep library glue in code-first executors. Because declarative loads into the same `Workflow` type, you can compose both styles in one system instead of maintaining two platforms.

That composition story pairs with other July Agent Framework and Foundry ships:

- **Harness** (stable batteries-included agent shell with skills, compaction, approvals, OTel) for the *agent interior*.
- **Declarative Workflows 1.0** for the *multi-agent exterior* (who calls whom, when humans step in).
- **Foundry Toolboxes + user delegation** for the *tool plane* agents invoke from workflow steps.
- **Routines** for *time- and event-triggered* dispatch of agents that already know their tools.

Orchestration-as-YAML is the missing review surface between those layers.

---

## Operations: treat YAML like production config

Shipping declarative workflows well is less about syntax and more about **change control**.

**1. Version the document with the product.**  
Keep `*.yaml` next to the host app or in a dedicated orchestration repo. Require PR review from at least one engineer *and* one owner of the business path (support lead, ops architect). The whole point of 1.0 is that those people can read the diff.

**2. Name agents as stable contracts.**  
`InvokeAzureAgent` resolves by agent name in your Foundry project. Treat those names like API routes. Renaming `TriageAgent` without a workflow update is an outage. Prefer explicit environment overlays (dev/stage/prod agent names) over silent defaults.

**3. Make expressions fail closed in tests.**  
Branch conditions on `Local.*` fields should be covered by fixture conversations: billing path, sales path, default support path, “needs ticket” path, “resolved” short-circuit. Snapshot the action sequence (or OpenTelemetry spans) so a YAML edit cannot silently drop an escalation.

**4. Human-in-the-loop is a first-class SLA.**  
`Question` / `RequestExternalInput` pause execution. Design timeout, reminder, and reassignment *outside* the model prompt—either as sibling workflow steps or as host policy. Declarative makes the pause visible; you still own the clock.

**5. Checkpoint long work.**  
Support and research samples demonstrate persist-and-resume. For any flow that can outlive a single HTTP request, checkpoint after expensive agent turns and after external side effects (ticket created). That is how you survive process restarts without double-filing cases.

**6. Observability inherits the workflow runtime.**  
Because you run a standard `Workflow`, wire the same tracing and evaluation hooks you use for code-first graphs. When a user says “it routed wrong,” you want the condition evaluation and agent name in the trace—not a black-box LLM apology.

**7. Foundry Toolkit / VS Code path.**  
For teams authoring closer to Foundry, Learn also documents adding declarative agent workflows through the **Microsoft Foundry Toolkit for Visual Studio Code**, so canvas-oriented builders and YAML-oriented engineers can land on the same workflow assets.

---

## A week-one migration plan

Use this if you already have a code-first multi-agent path and want 1.0 benefits without a rewrite.

| Day | Outcome |
|-----|---------|
| **1** | Inventory one production flow (support router, lead qualifier, or content pipeline). List agents, branches, tools, and human gates. |
| **2** | Install packages; run the official `customer_support` (or `simple_workflow`) sample against a non-prod Foundry project. |
| **3** | Port *only* triage + three-way route to YAML. Keep tool implementations in code. Prove parity with three golden transcripts. |
| **4** | Add ticket/escalation or approval step as declarative actions. Add checkpoint after side effects. |
| **5** | PR the YAML with architecture + ops reviewers. Attach OTel screenshots of branch decisions. |
| **6–7** | Shadow traffic or dogfood; freeze code-path router behind a feature flag; promote declarative as default. |

Do **not** start by declaring your most exotic graph. Start with the flow whose bugs are “we changed the wrong `if`.” That is where YAML ROI is immediate.

---

## How this fits the Microsoft agent stack

Zoomed out, Declarative Workflows 1.0 is the **orchestration contract** for Microsoft Agent Framework multi-agent systems:

1. **Models and agents** live in Microsoft Foundry (including long-horizon models and hosted agents).
2. **Knowledge** arrives through Foundry IQ / Microsoft IQ when answers must be grounded.
3. **Tools** arrive through MCP, function tools, HTTP, and Foundry Toolboxes with proper user delegation.
4. **Single-agent competence** is amplified by the Agent Framework Harness (skills, memory hooks, approvals).
5. **Multi-agent choreography**—the thing enterprises rewrite every quarter—is now a **1.0 declarative document** that loads into the same workflow engine as code.

That is a coherent story for platform teams: one framework, two authoring modes, one runtime, Foundry as the agent and tool home.

---

## What to do this week

1. Read the [Declarative Workflows 1.0 announcement](https://devblogs.microsoft.com/agent-framework/move-agent-orchestration-workflows-out-of-code-with-agent-framework-declarative-workflows-1-0/) and skim the [Learn overview](https://learn.microsoft.com/en-us/agent-framework/workflows/declarative).
2. `pip install agent-framework-declarative` or add the .NET Declarative packages; run one sample from [python/samples/03-workflows/declarative](https://github.com/microsoft/agent-framework/tree/main/python/samples/03-workflows/declarative) or the matching .NET tree.
3. Pick a single router you own. Extract it to YAML. Require a non-engineer to approve the PR description of the branches.
4. Add one human gate or checkpoint you currently handle with ad-hoc sleeps or “just ask the model again.”
5. Wire traces so condition outcomes and `InvokeAzureAgent` names are searchable when support escalates a misfire.

---

## Sources

- [Move Agent Orchestration/Workflows out of Code with Agent Framework Declarative Workflows 1.0](https://devblogs.microsoft.com/agent-framework/move-agent-orchestration-workflows-out-of-code-with-agent-framework-declarative-workflows-1-0/) — Peter Ibekwe, July 23, 2026 (primary)
- [Declarative Workflows – Overview (Microsoft Learn)](https://learn.microsoft.com/en-us/agent-framework/workflows/declarative)
- [Microsoft Agent Framework workflows hub](https://learn.microsoft.com/en-us/agent-framework/workflows/)
- [Declarative samples (Python)](https://github.com/microsoft/agent-framework/tree/main/python/samples/03-workflows/declarative) and [customer_support workflow.yaml](https://github.com/microsoft/agent-framework/tree/main/python/samples/03-workflows/declarative/customer_support)
- [Add declarative agent workflows in VS Code (Foundry Toolkit)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/vs-code-agents-workflow-low-code)
- Related stack context: [Agent Framework Harness released](https://devblogs.microsoft.com/agent-framework/the-microsoft-agent-framework-harness-is-now-released/) (July 22, 2026)

---

*The Clearinghouse Log — technical notes for builders shipping on the Microsoft agent platform. Series: clearinghouse.*
