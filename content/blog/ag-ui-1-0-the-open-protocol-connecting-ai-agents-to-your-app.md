---
slug: "ag-ui-1-0-the-open-protocol-connecting-ai-agents-to-your-app"
title: "AG-UI 1.0: The Open Protocol Connecting AI Agents to Your App"
excerpt: "AG-UI 1.0 shipped September 30 with a schema-locked spec, three official SDKs, and adoption by Google, Microsoft, Amazon, and Oracle. Here is what it does, how the .NET SDK works, and why it matters for full-stack developers building agent-powered UIs."
date: "2026-10-01"
author: "Wesley Williams"
authorKey: "wesley"
series: "clearinghouse"
categories: ["AI", "Engineering"]
tags: ["ag-ui", "agent-protocol", "dotnet", "typescript", "python", "open-protocol"]
readTime: 16
image: "/images/blog/ag-ui-1-0-the-open-protocol-connecting-ai-agents-to-your-app.png"
---

On September 30, 2026, CopilotKit shipped AG-UI 1.0 — the first stable, schema-locked version of the Agent-User Interaction Protocol. If you are building any user-facing layer on top of an AI agent, this is the protocol that defines the wire between your backend and your frontend. It is open, MIT-licensed, and already adopted by Google, Microsoft, Amazon, Oracle, LangChain, Mastra, Pydantic AI, and a dozen other frameworks.

The timing is sharp. One day earlier, OpenAI used DevDay 2026 to announce *Dots* — always-on AI agents with their own cloud computer, connectable to 4,000+ apps through a proprietary ChatGPT plugin ecosystem. AG-UI 1.0 arriving 24 hours later is the open-protocol answer to the same problem: how do agents talk to applications? The difference is that AG-UI does not lock you into anyone platform.

## The Three-Layer Agent Protocol Stack

By late 2026, the agent ecosystem had sorted itself into three complementary protocol layers, each solving a different boundary problem:

- **MCP (Model Context Protocol)** — Anthropic introduced this in November 2024 for agent-to-tool and agent-to-data connectivity.
- **A2A (Agent2Agent Protocol)** — Google introduced this in April 2025 for agent-to-agent communication and task delegation.
- **AG-UI (Agent-User Interaction Protocol)** — CopilotKit introduced this in May 2025 for the agent-to-user-interface surface.

AG-UI fills the third slot. MCP handles what tools an agent can call. A2A handles how agents talk to each other. AG-UI handles what the user sees: streamed text, tool-call progress, reasoning traces, shared state, and human-in-the-loop approval prompts — all as a single ordered stream of typed events.

As the [official spec](https://docs.ag-ui.com/spec/1.0) puts it: "one request in, one ordered stream of typed events out, carrying everything the user sees of the agent."

## What Changed at 1.0

The core architectural shift in 1.0 is **schema-first generation**. Every event type is now defined by a JSON Schema. The TypeScript, Python, and .NET SDKs are generated directly from that schema — not hand-maintained alongside it. This eliminates the entire class of spec-vs-SDK inconsistencies that made 0.x adoption risky for production systems.

The protocol defines 31 event types across 8 categories:

1. **Run and step lifecycle** — RUN_STARTED, RUN_FINISHED, RUN_ERROR, STEP_STARTED, STEP_FINISHED
2. **Text messages** — start/content/end streaming for assistant output
3. **Tool calls** — start/args/end/result, including multimodal results (images, audio, video, documents)
4. **Reasoning traces** — start/content/end/chunk, plus encrypted value support for reasoning models
5. **State synchronization** — STATE_SNAPSHOT for full state, STATE_DELTA for incremental JSON Patch (RFC 6902) updates
6. **Activity signals** — snapshot and delta for progress indicators
7. **Subagents** — SUBAGENT_STARTED, SUBAGENT_FINISHED, SUBAGENT_ERROR, with attribution carried as subagentRunId on other events
8. **Custom events** — escape hatch for application-specific payloads

The breadth is intentional. The protocol covers what a frontend legitimately needs to know about a running agent — nothing more, nothing less.

## Human-in-the-Loop Is Now a Spec Feature

The most production-significant addition in 1.0 is first-class interrupt support. An agent can pause mid-run, push a structured prompt to the frontend (a choice, a form, an approval request), and block until the user responds. The resume payload carries the decision back, and execution continues.

This is not a framework abstraction layered on top — it is part of the AG-UI 1.0 spec itself. An interrupt ends the current run with an interrupt outcome. The client later starts a new run on the same thread, carrying responses keyed by interrupt ID. The continuation can rebuild context from messages and state, or use a framework checkpoint. A continuously running agent process is not required by the interaction contract.

For teams shipping agents into workflows involving sensitive operations — deploys, financial actions, data mutations — this is a standardized pattern for gating execution on human approval, rather than retrofitting it on top of a polling loop.

## Subagent Attribution

1.0 ships a dedicated event category for subagents. When a parent agent delegates work to a child agent, the frontend receives the full event tree and can render per-subagent progress. Most other event types carry an optional subagentRunId so a UI can attribute output to the specific subagent that produced it.

Prior to 1.0, developers building multi-agent UIs had to improvise — emit custom events, maintain side-state, or surrender real-time visibility entirely. The spec now handles the delegation model directly.

## The .NET SDK: Five Packages, No Framework Required

As a full-stack developer working in the Windows ecosystem, the .NET SDK is what caught my attention. Microsoft .NET team shipped an official, first-class AG-UI SDK — built together with CopilotKit — as five MIT-licensed AGUI.* NuGet packages. Microsoft announced the SDK on its [.NET blog](https://devblogs.microsoft.com/dotnet/ag-ui-dotnet-sdk/) on September 25, 2026.

The packages are:

| Package | Role | Target Frameworks |
|---------|------|-------------------|
| AGUI.Abstractions | Protocol model: events, messages, tools, capabilities, interrupts, state | .NET 8, .NET Standard 2.0, .NET Framework 4.7.2+ |
| AGUI.Formatting | Wire-format abstraction and default SSE implementation | .NET 8, .NET Standard 2.0, .NET Framework 4.7.2+ |
| AGUI.Protobuf | Optional protobuf codec generated from the TypeScript .proto definitions | .NET 8, .NET Standard 2.0, .NET Framework 4.7.2+ |
| AGUI.Client | HTTP client and IChatClient implementation for consuming AG-UI endpoints | .NET 8, .NET Standard 2.0, .NET Framework 4.7.2+ |
| AGUI.Server | Server adapter that converts Microsoft.Extensions.AI chat streams into AG-UI events | .NET 8 |

The structural significance: Microsoft Agent Framework (MAF) no longer maintains its own AG-UI code in .NET. It now uses the shared SDK, so a C# backend follows the same protocol code as the TypeScript and Python implementations. The SDK sits in the AG-UI repository alongside the TypeScript and Python SDKs.

The server side hooks into IChatClient, the standard chat abstraction in Microsoft.Extensions.AI. If a service already produces an IChatClient, the SDK needs no other integration point. The minimal ASP.NET Core setup is four steps: add the AGUI.Server package, register your IChatClient as a singleton, map a POST endpoint that accepts RunAgentInput, and pipe the streaming response through .AsAGUIEventStreamAsync().

The client package (AGUI.Client) implements IChatClient, so it works anywhere code already accepts that interface. The agent on the other end could be written in Python, TypeScript, or C# — the calling code stays the same. This is cross-language interop through a shared wire protocol, not through a shared library.

There is a practical split for Windows shops with legacy code: AGUI.Client targets .NET Framework 4.7.2+, so a WPF or WinForms desktop app, or a service still on the old framework, can connect to a remote agent endpoint without being ported. Exposing an endpoint, however, requires .NET 8.

## State Management and Multiple Runs

AG-UI uses STATE_SNAPSHOT for complete state representations and STATE_DELTA with JSON Patch (RFC 6902) for efficient incremental updates. MESSAGES_SNAPSHOT provides conversation history. The protocol supports multiple sequential runs in a single event stream — each run must complete (RUN_FINISHED) before a new run starts (RUN_STARTED). Messages accumulate across runs; run-specific tracking (active messages, tool calls, steps) resets between runs.

State continues to evolve across runs unless explicitly reset. This matters for real-world agent workflows where a user might ask a follow-up question mid-conversation — the agent does not need to rebuild the entire context window from scratch.

## Transport and Security

The protocol supports HTTP + Server-Sent Events (SSE) as the default transport, with an optional HTTP + Protobuf binding for higher throughput. Custom bindings are permitted as long as they meet the contract defined in the spec.

The security model is pragmatic. AG-UI turns model output into things applications do: tool calls become actions, state events become writes, streamed content becomes what the user reads. The spec defines three key principles:

1. **User consent and control** — the application decides what runs, SHOULD obtain explicit consent before side-effectful tool calls, and MUST NOT represent an action as user-approved when it was not.
2. **Model output is untrusted input** — tool arguments, tool results, state content, and passthrough payloads cross a trust boundary. Applications MUST validate what they act on and MUST NOT render streamed content as executable markup.
3. **Data flows both ways** — state and messages round-trip through the consumer on every run. Producers SHOULD NOT put secrets in them; consumers SHOULD treat reasoning and encrypted artifacts with the same confidentiality as the conversation.

The protocol itself cannot enforce these principles — they are obligations on implementors, not wire-level checks. But they are stated as normative requirements, not suggestions.

## Adoption and Ecosystem

CopilotKit raised a 27 million USD Series A in May 2026 (led by Glilot Capital, NFX, and SignalFire), explicitly tied to AG-UI adoption. Enterprise users cited include Deutsche Telekom, Docusign, Cisco, and S&P Global. Oracle announced an AG-UI integration for its Open Agent Specification in December 2025.

As of the 1.0 release, the following frameworks support AG-UI: LangChain/LangGraph, Google ADK, OpenAI Agents SDK, AWS Strands, Microsoft Agent Framework, Pydantic AI, Agno, AG2, Mastra, and TanStack AI. Mastra September 30 release of @ag-ui/mastra@1.1.5 surfaces native tool approvals as AG-UI interrupts automatically.

## Open Protocol vs. Proprietary Ecosystem

The contrast with OpenAI DevDay announcements is worth naming directly. OpenAI Dots are always-on agents connectable to 4,000+ apps through ChatGPT plugins — a proprietary ecosystem where OpenAI owns the runtime, the marketplace, and the connection layer. Sign in with ChatGPT extends that subscription identity to third-party apps.

AG-UI takes the opposite approach. It is a wire format, not a platform. Any agent backend can emit AG-UI events. Any frontend can consume them. The same endpoint could feed a web app, a terminal, a mobile app, or chat platforms like Slack and Teams — those are choices for whoever builds the client. The protocol specifies the interaction, not the visual layout.

Both approaches will coexist. But for teams that want to own their agent stack — choose their models, run their own backend, control their data — AG-UI is the open path. The fact that Microsoft, Google, Amazon, and Oracle all contributed first-party SDKs and integrations suggests the industry has collectively decided that agent-to-UI communication should be a standard, not a vendor lock-in.

## What This Means for Full-Stack Developers

If you are building an agent-powered application today, AG-UI 1.0 gives you something concrete: a stable contract to build against. You do not need to invent your own event format, your own streaming protocol, or your own human-in-the-loop mechanism. The spec is locked, the SDKs are generated from it, and the major agent frameworks already emit AG-UI events natively.

For .NET developers specifically, the AGUI.* packages mean you can expose an ASP.NET Core endpoint that any AG-UI client can consume — including CopilotKit React frontend — without depending on Microsoft Agent Framework. And if you have legacy .NET Framework desktop apps, the client package works there too.

The three-protocol stack is now complete. MCP for tools, A2A for agents, AG-UI for users. Each is open, versioned, and production-grade. The question of how to build a real-time, streaming UI for a running agent no longer requires inventing your own event format.

---

*Sources: [AG-UI 1.0 Specification](https://docs.ag-ui.com/spec/1.0), [Microsoft .NET Blog](https://devblogs.microsoft.com/dotnet/ag-ui-dotnet-sdk/), [byteiota developer guide](https://byteiota.com/ag-ui-1-stable-spec), [AG-UI Protocol Wiki](https://aiwiki.ai/wiki/ag_ui_protocol), [Windows Forum .NET SDK coverage](https://windowsforum.com/news/microsoft-net-ag-ui-sdk-1-0-ships-client-and-server-packages.446032), [AG-UI Python SDK docs](https://docs.ag-ui.com/sdk/python/core/events), [AG-UI GitHub repository](https://github.com/ag-ui-protocol/ag-ui). Hero image is a placeholder — will be generated and added separately.*

