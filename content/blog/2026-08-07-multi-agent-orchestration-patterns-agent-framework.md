---
slug: "2026-08-07-multi-agent-orchestration-patterns-agent-framework"
title: "Multi-Agent Orchestration Patterns in Microsoft Agent Framework: Concurrent, Sequential, Group Chat, Handoff, and Magentic"
excerpt: "The August 2026 updates to Microsoft Agent Framework deliver five production orchestration patterns with unified builders, FoundryChatClient integration, and explicit support for human-in-the-loop. Learn how Concurrent, Sequential, Group Chat, Handoff, and Magentic workflows let you compose specialized agents into reliable, scalable systems on Azure AI Foundry."
date: "2026-08-07"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-07-multi-agent-orchestration-patterns-agent-framework"
categories: ["Microsoft", "AI Agents", "Azure AI"]
tags: ["Microsoft Agent Framework", "Multi-Agent Orchestration", "Foundry", "Concurrent Orchestration", "Sequential Orchestration", "Group Chat", "Handoff", "Magentic", "Workflows", "AI Agents", "Copilot Studio"]
readTime: 15
image: "/images/blog/2026-08-07-multi-agent-orchestration-patterns-agent-framework-hero.png"
---

Microsoft Agent Framework reached another milestone this week with detailed guidance on five distinct orchestration patterns for multi-agent systems. The patterns—Concurrent, Sequential, Group Chat, Handoff, and Magentic—come with concrete code examples using the FoundryChatClient and the new builder APIs in `agent_framework.orchestrations`. 

Paired with the recent general availability of declarative workflows (YAML-defined orchestration), these capabilities make it straightforward to move from prototype agents to governed, observable, production multi-agent applications inside Microsoft Foundry.

## Why orchestration patterns matter

Single agents are useful for focused tasks. Real enterprise value appears when specialized agents collaborate on complex processes: one gathers context, another analyzes options, a third validates outputs, and a coordinator keeps the goal in view. Without explicit orchestration, teams end up with ad-hoc message passing, duplicated state logic, and fragile handoff code that is hard to review, test, or version.

The Microsoft Agent Framework provides a unified runtime and a set of builder classes so the same agent definitions can participate in different coordination styles. The patterns are not mutually exclusive; many production systems combine them. All of them run on top of Foundry resources with the same authentication, tracing, and evaluation surface you already use for single agents.

## Core setup with FoundryChatClient

All examples in the new guidance start from a consistent foundation:

```python
import os
import asyncio
from typing import cast
from agent_framework import Message, AgentResponseUpdate
from agent_framework.foundry import FoundryChatClient
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv

load_dotenv()

credential = DefaultAzureCredential()
chat_client = FoundryChatClient(
    credential=credential,
    project_endpoint=os.getenv("AZURE_AI_PROJECT_ENDPOINT"),
    model=os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME"),
)
```

Use `DefaultAzureCredential` in production (works with Managed Identity). Store the project endpoint and deployment name in environment variables or Azure Key Vault. Agents are created with `chat_client.as_agent(...)` and carry instructions, descriptions, and options such as `store=False` for client-managed history when you need full control over conversation state.

## The five orchestration patterns

### 1. Concurrent Orchestration

Multiple agents receive the identical input in parallel. Their independent responses are collected and returned together.

**When to use:**
- Different analytical perspectives are valuable (sentiment + category + priority).
- Voting or ensemble-style decisions.
- You want maximum parallelism for speed on independent subtasks.

**Example (Ticket Assessment):**

```python
from agent_framework.orchestrations import ConcurrentBuilder

sentiment_agent = chat_client.as_agent(
    name="Sentiment Agent",
    instructions="You are a helpful assistant that analyzes the sentiment of a support ticket."
)
category_agent = chat_client.as_agent(
    name="Category Agent",
    instructions="You are a helpful assistant that categorizes a support ticket into categories such as Billing, Technical, Refund, or Account."
)
priority_agent = chat_client.as_agent(
    name="Priority Agent",
    instructions="You are a helpful assistant that determines the priority of a support ticket as High, Medium, or Low."
)

workflow = ConcurrentBuilder(
    participants=[sentiment_agent, category_agent, priority_agent]
).build()

result = await workflow.run("I was charged twice and I'm furious — refund me now!")
outputs = result.get_outputs()
for i, response in enumerate(outputs, 1):
    for msg in cast(list[Message], response.messages):
        name = msg.author_name or ("assistant" if msg.role == "assistant" else "user")
        print(f"{'-' * 60}\n{i:02d} [{name}]\n{msg.text}")
```

The builder handles fan-out and collection. You get structured outputs from each participant without writing custom asyncio gather logic.

### 2. Sequential Orchestration

Output of one agent becomes input to the next. Each stage can refine or transform the previous result.

**When to use:**
- Multi-step pipelines where order is fixed (summarize → classify → route).
- Iterative refinement loops (draft → review → improve).
- Processes that naturally build on prior context.

**Example (Support Ticket Triage):**

```python
from agent_framework.orchestrations import SequentialBuilder

summarizer_agent = chat_client.as_agent(
    name="Summarizer Agent",
    description="Summarizes a support ticket into 1-2 sentences of core intent.",
    instructions="You are a helpful assistant that summarizes support tickets into concise summaries."
)
classifier_agent = chat_client.as_agent(
    name="Classifier Agent",
    description="Classifies a ticket summary into: Billing, Technical, Refund, or Urgent.",
    instructions="You are a helpful assistant that classifies a support ticket summary strictly into one of the following categories: Billing, Technical, Refund, or Urgent."
)

workflow = SequentialBuilder(
    participants=[summarizer_agent, classifier_agent],
    output_from="all"
).build()

ticket = "I was charged twice for my subscription this month and need a refund ASAP."
result = await workflow.run(ticket)
# Process outputs sequentially
```

`output_from="all"` ensures every stage’s messages are available downstream if needed. The framework manages the handoff of context automatically.

### 3. Group Chat Orchestration

A manager agent orchestrates a shared conversation among specialist agents. The manager selects the next speaker each turn and can request human input.

**When to use:**
- Cross-functional reviews or debates (product, engineering, design, security).
- Scenarios where the right next expert depends on what was just said.
- Human-in-the-loop governance points.

**Key code pattern (abridged):**

```python
from agent_framework.orchestrations import GroupChatBuilder

# Define specialist agents + manager with instructions that enforce single-speaker selection and termination rules
workflow = GroupChatBuilder(
    participants=[product_agent, engineering_agent, design_agent, security_agent, manager_agent]
).build()

# Run and stream updates; manager decides flow
```

The manager’s instructions are critical: “Never select the same participant twice in a row. Once every perspective has been heard and a clear decision is reached, terminate the conversation with a short recommendation.”

### 4. Handoff Orchestration

Agents decide for themselves when and to whom to pass the conversation based on declared expertise. No central manager dictates the order.

**When to use:**
- Routing scenarios where the path is not known in advance.
- Dynamic customer support or troubleshooting flows.
- Situations where specialists need to escalate back to triage or other peers.

**Example structure:**

```python
from agent_framework.orchestrations import HandoffBuilder

triage_agent = chat_client.as_agent(...)
refund_agent = chat_client.as_agent(...)
order_status_agent = chat_client.as_agent(...)

workflow = (
    HandoffBuilder(participants=[triage_agent, refund_agent, order_status_agent])
    .with_start_agent(triage_agent)
    .add_handoff(triage_agent, [refund_agent, order_status_agent])
    .add_handoff(refund_agent, [triage_agent])
    .add_handoff(order_status_agent, [triage_agent])
    .build()
)

# Interactive loop that accepts follow-up responses
responses = None
while True:
    if responses is not None:
        stream = workflow.run(responses=responses, stream=True)
    else:
        stream = workflow.run("Hi, I was charged twice for order #12345 and want a refund.", stream=True)
    # Process stream, collect new responses for next turn
```

`require_per_service_call_history_persistence=True` on agents ensures the framework maintains the right context across handoffs.

### 5. Magentic Orchestration

The most dynamic pattern. A dedicated manager agent maintains a task ledger and a progress ledger. It plans, assigns work, tracks what has been learned, replans on stalls, and synthesizes the final answer.

**When to use:**
- Open-ended or complex research and creation tasks.
- Problems where the exact sequence of steps cannot be known upfront.
- Autonomous multi-step projects that benefit from explicit planning and recovery.

**Example (Autonomous Blog Drafting):**

```python
from agent_framework.orchestrations import MagenticBuilder

writer_agent = chat_client.as_agent(
    name="Writer Agent",
    instructions="You write clear, engaging blog posts on the requested topic."
)
editor_agent = chat_client.as_agent(
    name="Editor Agent",
    instructions="You review drafts for clarity and length, and suggest concise improvements."
)
manager_agent = chat_client.as_agent(
    name="Manager Agent",
    instructions="You coordinate the writer and editor to produce a polished final blog post."
)

workflow = MagenticBuilder(
    participants=[writer_agent, editor_agent],
    manager_agent=manager_agent,
    max_stall_count=2,
    max_round_count=10,
    intermediate_output_from="all"
).build()

stream = workflow.run(
    "Write a 300-word blog post explaining why sleep matters for productivity.",
    stream=True,
)

async for event in stream:
    if event.type in ("intermediate", "output") and isinstance(event.data, AgentResponseUpdate):
        # Print with executor labels
        ...
result = await stream.get_final_response()
```

The ledgers give the manager a persistent view of planned vs completed work, which is invaluable for observability and debugging long-running agent teams.

## Comparison of the advanced patterns

| Pattern       | Control Model                  | Best For                          | Human-in-the-Loop | Deterministic Order |
|---------------|--------------------------------|-----------------------------------|-------------------|---------------------|
| Group Chat    | Manager picks next speaker     | Debates, reviews, brainstorming   | Yes (explicit)    | No                  |
| Handoff       | Agents route by expertise      | Dynamic routing, support          | Via instructions  | No                  |
| Magentic      | Manager maintains ledgers + replans | Open-ended research & creation | Via manager       | No (planner driven) |

Concurrent and Sequential are simpler building blocks you often embed inside the three more advanced patterns.

## Getting started today

1. Provision a Microsoft Foundry resource and deploy a model (gpt-4.1-mini or stronger works well for orchestration).
2. Set `AZURE_AI_PROJECT_ENDPOINT` and `AZURE_AI_MODEL_DEPLOYMENT_NAME`.
3. Install the latest `agent-framework` package (the patterns are part of the 1.0+ surface).
4. Start with Concurrent or Sequential for your first workflow; they require the least orchestration code.
5. Add `az monitor` or Application Insights tracing to observe the full conversation graph.

The same agents you define for code-first workflows can participate in declarative YAML workflows. You can therefore version the high-level coordination in Git while keeping specialized agent instructions in code or in the Foundry project.

## How this fits the broader Microsoft stack

These orchestration primitives sit alongside:
- Declarative workflows (YAML) for reviewability and governance.
- Foundry IQ for grounding agents in organizational knowledge.
- Copilot Studio for low-code composition and publishing to Microsoft 365.
- Agent 365 governance and evaluation tooling.

The result is a continuum: makers start in Copilot Studio, developers add custom orchestration in the Agent Framework on Foundry, and operations teams get unified observability and policy enforcement.

## What to try this week

- Clone the example repository referenced in the August 5 guidance (https://github.com/SonakshiA/Multi-Agent-MAF) and run the five patterns against your own Foundry deployment.
- Take one of your existing single-agent prototypes and wrap it in a Concurrent or Handoff workflow to see the immediate lift in capability.
- Add a simple Group Chat review step to a content-generation pipeline and measure the quality improvement from specialist perspectives.

Microsoft continues to invest in making multi-agent systems first-class citizens of the Azure AI platform. The combination of stable orchestration builders, declarative definitions, and deep integration with the rest of the Microsoft 365 and Azure ecosystem gives teams a practical path from experimentation to production-grade agentic applications.

## Sources

- “Exploring Multi-Agent Workflows with Microsoft Agent Framework”, Microsoft Foundry Blog, August 5, 2026. https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/exploring-multi-agent-workflows-with-microsoft-agent-framework/4542512
- “Orchestrate a multi-agent solution using the Microsoft Agent Framework” training module, Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/orchestrate-semantic-kernel-multi-agent-solution/
- “Declarative Workflows 1.0 in Microsoft Agent Framework”, The Clearinghouse Log, August 5, 2026.
- Microsoft Foundry documentation and Azure AI Search / Copilot Studio integration notes (August 2026 updates).

*All code examples adapted from the official guidance with minor formatting for readability. Always consult the latest SDK documentation and your organization’s security and compliance requirements before deploying to production.*
