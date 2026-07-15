---
slug: "foundry-hosted-agents-ga-production-stack-july-2026"
title: "Foundry Hosted Agents Are GA: The Production Stack for Enterprise AI Agents"
excerpt: "Microsoft Foundry’s July wave makes hosted agents, toolboxes, Foundry IQ, and frontier GPT-5.6 models generally available—giving builders a governed path from containerized agent code to Teams and Microsoft 365 Copilot."
date: "2026-07-15"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/foundry-hosted-agents-ga-production-stack-july-2026"
categories: ["Microsoft", "Azure AI", "AI Agents", "Copilot"]
tags: ["Microsoft Foundry", "Hosted Agents", "Foundry Agent Service", "GPT-5.6", "Toolboxes", "Foundry IQ", "Microsoft 365 Copilot", "Teams"]
readTime: 9
image: "/images/blog/foundry-hosted-agents-ga-production-stack-july-2026.png"
---

# Foundry Hosted Agents Are GA: The Production Stack for Enterprise AI Agents

Prototype agents are easy. Production agents are a platform problem.

In early July 2026, Microsoft moved several Microsoft Foundry pieces from “Build preview roadmap” to **generally available production surface**: **hosted agents** in Foundry Agent Service, **toolboxes**, **Foundry IQ** as the knowledge layer, **OpenAI’s GPT-5.6 series** in Foundry Models and Agent Service, the **Asia-Pacific Data Zone**, and a clearer path to put those agents in front of people in **Microsoft Teams** and **Microsoft 365 Copilot**. The primary announcement is Tina Schuchman’s Azure Blog post, *Frontier models and production agents: Advancing Microsoft Foundry for the agentic era* ([July 9, 2026](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/)).

This Clearinghouse Log post is a practitioner deep dive: what actually GA’d, how the runtime works, how models and knowledge plug in, and a concrete build path for engineers and architects.

## Thesis: one factory, not a pile of demos

Foundry’s pitch is no longer “another model endpoint.” It is an **agent factory** with three durable jobs:

1. **Build** where developers already work (VS Code / GitHub Copilot, Microsoft Agent Framework, and other harnesses).
2. **Run** on managed infrastructure with isolation, identity, tools, and memory.
3. **Govern and distribute** with tracing, evaluation, cost controls, and channels users already open (Teams, Microsoft 365 Copilot).

That framing matters. Most failed agent pilots die between a notebook and a compliance review—not because the model was weak, but because session isolation, tool auth, knowledge grounding, and distribution were re-invented per project. Foundry’s July GA wave is about removing that re-invention.

## What shipped (and why it is different from last year’s Agent Service GA)

Microsoft Foundry has shipped several “GA” moments over the last year. The May 2025-era Agent Service GA and the Build 2026 previews established multi-agent patterns and a managed service. The **July 2026** wave is specifically about **production runtime maturity** for **bring-your-own-code** agents:

| Capability | Status (per Microsoft) | Why builders care |
| --- | --- | --- |
| Hosted agents (Foundry Agent Service) | **Generally available** | Managed sandboxes for containerized agents; framework-agnostic |
| Toolboxes | **Generally available** | Curated, dynamic tool access instead of stuffing every tool schema into every turn |
| Foundry IQ | **Generally available** | SLA-backed knowledge layer over Work IQ / Fabric IQ / Web IQ |
| GPT-5.6 Sol / Terra / Luna | **Generally available** in Foundry | Workload-tuned frontier series with Global and Data Zone options |
| Asia-Pacific Data Zone | **Generally available** | Regional processing option for APAC frontier OpenAI workloads |
| Hosted agents + Voice Live | **Generally available** | Real-time voice on the same hosted runtime |
| Tracing & evaluation for hosted agents | **Generally available** | See and score production behavior |
| Agent optimizer | **Public preview** | Closed-loop improve prompts/skills/models/tools |
| Memory & routines | **Public preview** | Cross-session memory + schedule/event-driven runs |
| Publish to Teams / M365 Copilot | Live path (portal + docs; channel GA timeline called out at Build/June) | Stable agent endpoint → store → org catalog |

Sources: [Azure Blog — Frontier models and production agents](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/), [Foundry June 2026 digest](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/), [Learn — What’s new in Foundry](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry).

## Hosted agents: container in, production endpoint out

### What a hosted agent is

Per Microsoft Learn, a **hosted agent** is a **containerized agentic application** that runs on Foundry Agent Service. Your code owns orchestration; Foundry models provide reasoning; the platform owns container lifecycle, scaling, session isolation, identity, and endpoints ([Hosted agents concept](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)).

That is a deliberate split from **prompt-based agents** defined only in the portal. Choose hosted agents when you need:

- **Bring-your-own code/framework** (Microsoft Agent Framework, LangGraph, Semantic Kernel, custom, and—explicitly called out in the July post—harnesses such as GitHub Copilot SDK and others).
- **Custom protocols** (webhooks / non-OpenAI payloads via Invocations).
- **Controlled compute** (CPU/memory for the sandbox).
- **Stateful workloads** (persist under `$HOME` and `/files` across turns).

### Isolation model that matches enterprise ops

Hosted agents run in **per-session VM-isolated sandboxes**. Each session gets dedicated compute, memory, and a **persistent filesystem**, enabling scale-to-zero with **stateful resume** and predictable cold starts. Sessions are isolated from each other; state restores when a session resumes after idle timeout ([Learn: isolation model](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents#isolation-model)).

For architects, that is the difference between “chatbot process that shares memory with whatever else is on the box” and “each conversation is a sandboxed unit of work with a durable home directory.” Long-running loops, intermediate artifacts, and human-in-the-loop pauses become platform features instead of ad-hoc blob hacks.

### Protocols: pick the contract, not just the model

Hosted agents expose one or more protocols via lightweight libraries that handle HTTP/WebSocket, health checks, and OpenTelemetry:

| Scenario | Protocol | Why |
| --- | --- | --- |
| Conversational assistant, RAG + tools, background jobs | **Responses** | Platform manages conversation history, streaming lifecycle, background polling |
| Agent published to Teams / Microsoft 365 | **Responses + Activity** | Platform bridges Responses to Activity for channel delivery |
| Webhooks (GitHub, Stripe, Jira…), custom JSON, AG-UI, proprietary bridges | **Invocations** | Arbitrary JSON in/out; full HTTP control |
| Real-time voice | **Invocations (WebSocket)** | Bidirectional stream; pair with Voice Live / Pipecat / LiveKit patterns |

Microsoft’s practical tip: **start with Responses**; add Invocations later—both can coexist on one agent ([protocol guidance](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents#which-protocol-should-i-use)).

### Identity and endpoints without DIY plumbing

Every hosted agent gets a **dedicated Microsoft Entra agent identity** and **dedicated endpoint** at deploy time. Programmatic paths (abbreviated from docs):

- Responses: `{project_endpoint}/agents/{name}/endpoint/protocols/openai/responses`
- Invocations: `{project_endpoint}/agents/{name}/endpoint/protocols/invocations`
- Invocations WebSocket: `wss://…/protocols/invocations_ws?api-version=v1`
- A2A (preview): `…/protocols/a2a`

Publishing to channels is separate from having a callable endpoint—you can integrate programmatically immediately after deploy ([agent identity and endpoint](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents#agent-identity-and-endpoint)).

### Deploy path practitioners actually use

The operational pattern is familiar container ops, not a mystery portal-only path:

1. Package agent as a container image → Azure Container Registry.
2. Deploy via Foundry / `azd` / Foundry SDK; Agent Service pulls the image, provisions compute, assigns identity, exposes endpoint.
3. Agent code calls Foundry models, Toolbox tools, and Azure services under the agent identity.
4. Platform handles scale, session persistence, observability, lifecycle.

Quickstarts and workshops Microsoft points to include the [hosted agent quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-hosted-agent), [Hosted Agents Workshop (.NET)](https://github.com/microsoft/Hosted_Agents_Workshop_dotNET), and [Foundry Toolkit for VS Code lab](https://github.com/microsoft-foundry/Foundry_Toolkit_for_VSCode_Lab/).

Region footprint is broad for a new runtime class (East US 2, West US, Sweden Central, Southeast Asia, Japan East, Australia East, and many others listed in Learn as of mid-July 2026)—check the [region availability table](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents#region-availability) before architecture freezes.

## Models: GPT-5.6 as three workload knobs, not one flagship

The July announcement makes **GPT-5.6 Sol, Terra, and Luna** generally available in Foundry Models and Foundry Agent Service, with Global Standard / Data Zone options and day-one regional breadth called out for existing footprints.

Microsoft’s positioning (paraphrased from the Azure Blog):

- **GPT-5.6 Sol** — advanced reasoning, agentic workflows, code-heavy enterprise work.
- **GPT-5.6 Terra** — balanced everyday work; competitive with prior flagship class at lower cost for scale.
- **GPT-5.6 Luna** — fastest / most affordable tier for high-volume, latency-sensitive paths.

Published Standard Global list prices in the post (USD per million tokens): Sol $5 / $30, Terra $2.50 / $15, Luna $1 / $6 (input/output). Treat pricing as time-sensitive—always re-check the portal before finance locks a model.

**APAC Data Zone GA** adds a regional processing option for frontier OpenAI models so APAC customers can align residency with compliance without a separate frankenstack of environments.

For agent builders, the design move is explicit: **route by workload**. Pair Sol with planner/critic steps, Terra with mainline business agents, Luna with classification, routing, and high-QPS helpers—optionally behind Foundry’s **model router** and **prompt caching** to control spend ([model router](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router), [prompt caching](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/prompt-caching)).

Also in the ecosystem: **Claude in Microsoft Foundry is GA** (late June), hosted on Azure with Messages API, prompt caching, extended thinking, tool streaming, Entra auth, and Azure billing via Claude Consumption Units ([Claude GA post](https://azure.microsoft.com/en-us/blog/claude-in-microsoft-foundry-is-now-generally-available/)). Foundry Agent Service can use Claude as the reasoning core for multi-step agents—model choice without leaving Azure procurement and governance.

## Toolboxes and Foundry IQ: knowledge and actions without DIY RAG glue

### Toolboxes (GA)

A **toolbox** is the layer where agents **discover, access, and use tools at runtime**. Instead of shipping every tool definition on every request, a toolbox **selects relevant tools** for the turn—cutting token bloat and wrong-tool selection when catalogs grow large ([July Azure Blog](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/), [toolbox how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox)).

The June Foundry digest and Learn docs also document preview/GA progression for:

- **Skills** in project-scoped catalogs
- **Work IQ** and **Fabric IQ** connectors
- **Browser Automation** (MCP-native, Playwright workspaces)
- **Tool Search** (`tool_search` / `call_tool` meta-tools) for large catalogs
- **Routines** for schedule/trigger-driven agent runs

A practical `azd` pattern from the June digest: init from a hosted-agent sample, then `azd ai toolbox create … --from-file toolbox.yaml` and wire the versioned MCP endpoint into the agent.

### Foundry IQ (GA)

**Foundry IQ** is positioned as the **SLA-backed knowledge layer** unifying:

- **Work IQ** — real-time Microsoft 365 work context  
- **Fabric IQ** — structured enterprise data  
- **Web IQ** — live web grounding  

without forcing every team to hand-build a full RAG pipeline ([July Azure Blog](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/)). For agent architects, that is “grounding as a platform service,” not “another vector DB ticket.”

## Distribution: stable endpoint → Teams and Microsoft 365 Copilot

Publishing from Foundry to **Microsoft 365 Copilot and Teams** publishes the agent’s **stable endpoint**. Consumers hit a consistent entity while you roll versions behind the endpoint ([publish how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot)).

Operational details that matter in real tenants:

- Portal publish builds a Teams app manifest package, submits to the agent catalogs, enables the **Activity** protocol bridge, and sets auth scheme based on scope.
- **Just you / Shared** vs **People in your organization / Tenant** controls discovery and whether admin approval is required in the Microsoft 365 admin center.
- Version selector: **Always use latest** vs pin a specific version for controlled rollouts.
- Projects with **public network access disabled** cannot use one-click portal publish; use the [VNet publish flow](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot-virtual-network) so the agent stays private while channel adapters reach it through your reverse proxy.

The June Foundry digest also introduced **autopilot agents** (public preview): agents with full **Entra Agent ID** user-style presence (email, calendar, Teams, org chart seat) designed for **group chats and ongoing work**, with the **Workstream Manager** sample as a reference ([June 2026 digest](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/)). Treat that as the next step after a solid hosted Responses agent—not day-one for every pilot.

## Govern: tracing, evaluation, optimizer, ROI

Production means you can answer “what did it do, was it good, and was it worth it?”

- **Tracing and evaluation for hosted agents — GA**: end-to-end visibility and systematic scoring ([tracing quickstart](https://learn.microsoft.com/en-us/azure/foundry/observability/quickstarts/quickstart-tracing-hosted-agent), [evaluate quickstart](https://learn.microsoft.com/en-us/azure/foundry/observability/quickstarts/quickstart-evaluate-hosted-agent)).
- **Agent optimizer — public preview**: evaluate → generate candidates → rank → deploy for prompts, skills, models, and tools ([optimizer overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview)).
- **ROI for agents — private preview**: connect traces, business-value evaluations, and operating cost in one view (announced in the July post).

This is the Agent DevOps loop: ship → observe → improve → re-ship without leaving Foundry.

## Architecture sketch for a production team

```
[ Dev: Agent Framework / LangGraph / custom ]
        |  container image → ACR
        v
[ Foundry Agent Service — Hosted agent sandbox ]
   |  Entra agent identity
   |-- Models: GPT-5.6 Sol/Terra/Luna | Claude | catalog
   |-- Tools:  Toolbox (+ Tool Search, Work/Fabric IQ, browser)
   |-- Knowledge: Foundry IQ
   |-- Memory / Routines (preview) as needed
   |-- Trace + Eval (GA) → Optimizer (preview)
        |
        +--> API clients (Responses / Invocations)
        +--> Publish → Teams + Microsoft 365 Copilot (stable endpoint)
```

Network isolation with **VNet integration** is called out for enterprise boundaries; resilient long-running task support for hosted agents is in private preview for failure-surviving multi-turn work.

## Practical implications for builders and IT

**For application engineers**

- Prefer **hosted agents** when the agent is real software (retries, tools, state), not a prompt demo.
- Default to **Responses** protocol; add Invocations for webhooks and non-chat payloads.
- Put tools in a **toolbox** early—do not wait until you have 50 tools and a token bill surprise.
- Ground with **Foundry IQ / Work IQ / Fabric IQ** before inventing a custom RAG monorepo for M365/Fabric scenarios.
- Pin model choice by **workload tier** (Sol/Terra/Luna) and measure; re-run evals after the GPT-5.6 cutover.

**For platform / cloud architects**

- Treat Foundry project + agent identity + toolbox + publish scope as a **landing zone**, not a side project.
- Map **data zones** (Global / US / APAC) and private networking before the first production agent.
- Align RBAC: Foundry project roles for agents **and** Azure Bot Service permissions for publish ([publish prerequisites](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot)).
- Require **tracing + evaluation** as a release gate; use optimizer once you have production traces.

**For IT / M365 admins**

- Plan the **Tenant-scope approval** path in Microsoft 365 admin center for org-wide agents.
- Decide which agents are “just me” experiments vs “Built by your org.”
- Coordinate identity: agent Entra IDs, licenses for autopilot-class agents, and Purview/Defender policies as agents become first-class actors.

## Also noted (adjacent Microsoft AI, same window)

- **GitHub Copilot upgrade for .NET** now surfaces an interactive **Upgrade Dashboard / canvas** in the GitHub Copilot app, with the same agent workflow available from Visual Studio, VS Code, and Copilot CLI ([.NET Blog, July 9](https://devblogs.microsoft.com/dotnet/modernize-dotnet-in-github-copilot-app/)).
- **Claude in Foundry GA** (June 29) gives Azure-native procurement and governance for Anthropic models ([Azure Blog](https://azure.microsoft.com/en-us/blog/claude-in-microsoft-foundry-is-now-generally-available/)).
- Yesterday’s Clearinghouse deep dive covered **Visual Studio built-in Agent Skills** for .NET and Azure—complementary to Foundry’s production runtime, not a substitute.

## Actionable next steps

1. **Read the primary posts**  
   - [Frontier models and production agents (July 9)](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/)  
   - [What’s New in Microsoft Foundry | June 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/)  
   - [Hosted agents concept (Learn)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)

2. **Ship a thin vertical slice this week**  
   - Containerize a single agent (Responses protocol).  
   - Deploy as a **hosted agent** in a non-prod Foundry project.  
   - Attach a small **toolbox** (even 2–3 tools).  
   - Enable **tracing**.  
   - Publish to **Just you** in Teams and exercise the stable endpoint.

3. **Add grounding and model policy**  
   - Wire **Work IQ / Foundry IQ** for M365 context if that is your domain.  
   - Document Sol vs Terra vs Luna routing rules in your team’s runbook.

4. **Harden for tenant scale**  
   - Private network publish flow if required.  
   - Evaluation suite from production traces.  
   - Opt into **agent optimizer** once you have enough runs.

5. **Workshops**  
   - [AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners)  
   - [mslearn-ai-agents](https://microsoftlearning.github.io/mslearn-ai-agents/)  
   - Hosted Agents / Foundry Toolkit labs linked above

## Conclusion

The story of Microsoft AI in July 2026 is not another isolated model drop. It is **Foundry closing the production gap**: hosted agents as a first-class runtime, toolboxes and Foundry IQ as governed action and knowledge planes, GPT-5.6 (and Claude) as selectable reasoning cores, and a publish path into Teams and Microsoft 365 Copilot so agents meet users where work already happens.

If you are still running agent demos from a laptop process, this is the moment to move the same code into a **hosted agent**, put tools behind a **toolbox**, ground with **Foundry IQ**, and measure with **tracing**. The platform work is no longer a future promise—it is documented, GA, and ready for a real pilot.

*Series: The Clearinghouse Log · Author: Jeff · Microsoft ecosystem focus for practitioners.*
