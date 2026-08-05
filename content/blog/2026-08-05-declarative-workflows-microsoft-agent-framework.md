---
slug: "2026-08-05-declarative-workflows-microsoft-agent-framework"
title: "Declarative Workflows 1.0 in Microsoft Agent Framework: Author Multi-Agent Orchestration in YAML"
excerpt: "Microsoft Agent Framework now ships declarative workflows at 1.0 across Python and .NET. Define complex multi-agent orchestration, control flow, human-in-the-loop steps, and tool invocations in readable YAML instead of wiring everything in application code. The same runtime executes both declarative and code-first workflows, making it easy to mix approaches while gaining reviewability, versioning, and team collaboration benefits."
date: "2026-08-05"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-05-declarative-workflows-microsoft-agent-framework"
categories: ["Microsoft", "AI Agents", "Azure AI"]
tags: ["Microsoft Agent Framework", "Declarative Workflows", "YAML", "Multi-Agent Orchestration", "Foundry", "Copilot Studio", "Workflows", "Agent Skills", "MCP"]
readTime: 16
image: "/images/blog/2026-08-05-declarative-workflows-microsoft-agent-framework-hero.png"
---

Microsoft Agent Framework reached a significant milestone with the general availability of declarative workflows at version 1.0. Developers can now describe how agents coordinate, when to branch, how state flows, and when to involve humans—all in portable YAML files rather than embedded control flow in Python or C#.

This capability complements the recent general availability of the GitHub Copilot harness in Copilot Studio and the unified model endpoints in Foundry. Together they form a more complete picture of how Microsoft is making production-grade agent systems approachable for both developers and the teams that need to govern them.

## Why move orchestration out of code

Most early multi-agent prototypes hard-code the sequence of steps, conditions, and handoffs directly in the application. The logic lives inside classes, methods, and if-statements. That works for a demo, but it creates real friction in production:

- Product owners and architects cannot easily review or propose changes without reading framework code.
- Every modification requires a code change, PR, build, and deploy.
- Versioning the behavior separately from the host application becomes difficult.
- Testing different orchestration patterns means touching the same source files.

Declarative workflows solve this by treating the orchestration definition as data. You author a YAML document that the framework loads into the same `Workflow` object used by code-first implementations. The runtime, streaming, checkpointing, and composition APIs remain identical.

The result is that you keep the full power of the Agent Framework while gaining the operational advantages of configuration-as-code for the parts of the system that change most often.

## Core concepts and YAML structure

A declarative workflow is a document that starts with a `kind: Workflow` declaration and a trigger. The two SDKs use slightly different top-level shapes, but both compile to the same executable workflow graph.

### Python structure

```yaml
name: support-router
description: Route incoming requests to the appropriate specialist agent
inputs:
  request: 
    type: string
    description: The support request text
actions:
  - kind: InvokeAzureAgent
    id: triage
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

Load it with:

```python
from agent_framework.declarative import WorkflowFactory

factory = WorkflowFactory()
workflow = factory.create_workflow_from_yaml_path("support-router.yaml")
```

The resulting `workflow` is a standard `Workflow` instance. You run it, stream it, or compose it exactly as you would a code-defined workflow.

### .NET structure

.NET uses a trigger-oriented form with `kind: Workflow` and explicit `trigger` section:

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
```

Build it with:

```csharp
using Microsoft.Agents.AI.Workflows;
using Microsoft.Agents.AI.Workflows.Declarative;

Workflow workflow = DeclarativeWorkflowBuilder.Build(
    "support_router.yaml", 
    options);
```

Both languages support the same rich set of action kinds.

## Supported action types

The declarative language includes a comprehensive set of primitives:

| Action Kind              | Purpose                                      | Example Use Case                     |
|--------------------------|----------------------------------------------|--------------------------------------|
| SetVariable              | Store or compute values in workflow state    | Capture user input, calculate totals |
| InvokeAzureAgent         | Call a deployed Foundry agent                | Triage, specialist processing        |
| If / Else                | Conditional branching                        | Route by category or confidence      |
| InvokeFunctionTool       | Call local .NET or Python functions          | Business logic, calculations         |
| InvokeMcpTool            | Call tools exposed by an MCP server          | Enterprise systems, file operations  |
| InvokeHttpRequest        | Make outbound HTTP calls                     | Call external APIs or services       |
| Question                 | Pause for human input                        | Clarification or approval            |
| SendActivity             | Emit messages back to the caller             | Status updates, final answers        |
| Loop / While             | Repeated execution until condition met       | Retry with backoff, polling          |
| Checkpoint               | Persist state for later resume               | Long-running processes               |

Expressions use PowerFx syntax prefixed with `=`. You can reference `Local.*` variables, `System.*` context (ConversationId, LastMessage), and call functions such as `Concat`, `If`, `IsBlank`, `Upper`, and more.

## Practical example: customer support routing with human escalation

The official samples include a complete customer support workflow that demonstrates several capabilities in one definition:

1. Triage the incoming ticket with a specialized agent.
2. Route to billing, sales, or general support based on category.
3. If the specialist agent cannot resolve within a confidence threshold, escalate to a human.
4. Log the resolution and update the ticket system via MCP tool.

Because the entire flow lives in YAML, the support team can propose new routing rules or escalation thresholds by editing the file. Developers review the diff the same way they would review infrastructure-as-code.

The Python sample lives at:

https://github.com/microsoft/agent-framework/tree/main/python/samples/03-workflows/declarative/customer_support

The .NET equivalent is at:

https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/03-workflows/Declarative/CustomerSupport

Other samples cover:

- Human-in-the-loop approval for tool use
- MCP tool invocation directly from a workflow step
- Function tool integration
- Checkpointing and resume for long-running work
- Marketing campaign orchestration with multiple specialist agents

## Integration with Microsoft Foundry and existing agents

Declarative workflows are designed to run against agents you have already deployed in a Foundry project. You supply an `AzureAgentProvider` (or equivalent) when building the workflow. The provider handles authentication (including keyless Entra ID), model selection per agent name, and content safety configuration.

This means you can:

- Point the same YAML at different Foundry projects for dev, test, and prod.
- Swap underlying models by changing the deployment name in the Foundry portal without touching the workflow definition.
- Reuse the same agents across both declarative workflows and code-first orchestrations.

When you combine this with the unified OpenAI-compatible endpoints announced earlier this month, the client code inside your host application stays stable while the orchestration definition and the model catalog evolve independently.

## How declarative workflows fit the broader Microsoft agent platform

The July 23 release of declarative workflows 1.0 sits alongside several other stabilizing pieces:

- The GitHub Copilot harness (GA in Copilot Studio August 4) brings frontier reasoning and file-handling capabilities to low-code agents.
- Unified Foundry model endpoints give a single OpenAI-compatible surface for 10,000+ models with consistent Entra ID auth.
- Agent Skills (stable in both Python and .NET) let you package domain expertise that agents discover on demand.
- Toolboxes and MCP integration let agents act safely on behalf of users with proper identity.

Declarative workflows give you a way to compose these capabilities without locking the orchestration logic into one host language or deployment artifact. A team can maintain the workflow definition in a shared repo, apply the same review and CI processes used for other configuration, and still execute it inside a full .NET or Python host that adds custom tools, telemetry, or UI.

## Getting started today

1. Ensure you have a Foundry project with at least one deployed agent (the samples use simple triage and specialist agents).
2. Install the declarative package:

   ```bash
   pip install agent-framework-declarative --pre
   # or
   dotnet add package Microsoft.Agents.AI.Workflows.Declarative
   ```

3. Clone the samples and run the customer support or human-in-the-loop example.
4. Author your first YAML definition for a workflow you currently have in code.
5. Load it in your existing host application and compare behavior.

Full documentation:

- Declarative workflows overview: https://learn.microsoft.com/en-us/agent-framework/workflows/declarative
- Agent Framework GitHub: https://github.com/microsoft/agent-framework

## What to try this week

- Take one existing multi-step agent flow in your codebase and extract the orchestration into a declarative YAML file.
- Add a human-in-the-loop step for any action that touches sensitive systems or requires approval.
- Wire an MCP server that exposes internal tools and invoke it from a declarative step.
- Version the YAML alongside your application and set up a simple review process with your product or operations team.
- Measure the reduction in time from "idea for a new branch" to "running in test."

## Summary

Declarative workflows 1.0 give Microsoft Agent Framework users a first-class way to separate *what* the system should do from *how* the host application runs it. The same runtime, observability, and composition surface work for both styles. For teams building production agents on Foundry and Copilot Studio, this means faster iteration, better cross-team collaboration, and orchestration definitions that can be audited and governed like any other critical configuration.

The Microsoft ecosystem continues to deliver the building blocks—unified endpoints, stable harnesses, discoverable skills, and now declarative orchestration—at a pace that lets developers focus on the business logic that matters while the platform handles the scaffolding.

---

**Sources**

- "Move Agent Orchestration/Workflows out of Code with Agent Framework Declarative Workflows 1.0" – https://devblogs.microsoft.com/agent-framework/move-agent-orchestration-workflows-out-of-code-with-agent-framework-declarative-workflows-1-0/ (July 23, 2026)
- "Declarative Workflows - Overview" – https://learn.microsoft.com/en-us/agent-framework/workflows/declarative
- Agent Framework samples repository – https://github.com/microsoft/agent-framework/tree/main/python/samples/03-workflows/declarative and dotnet equivalent
- "GitHub Copilot Harness Generally Available in Microsoft Copilot Studio" – recent Clearinghouse coverage and primary Copilot Studio announcements (August 2026)
- Unified Foundry Models Endpoints announcement context (August 3, 2026)
