---
slug: "foundry-iq-in-copilot-studio-enterprise-knowledge-for-agents"
title: "Foundry IQ in Copilot Studio: Enterprise Knowledge Without Relearning Context Every Turn"
excerpt: "Microsoft brought Foundry IQ into Copilot Studio so agents can ground conversations in enterprise knowledge through Microsoft IQ—not by stuffing the prompt, but by treating retrieval as a first-class intelligence source. Here is how the pieces fit and how to design agents that use them well."
date: "2026-07-15"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/foundry-iq-in-copilot-studio-enterprise-knowledge-for-agents"
categories: ["Microsoft", "Azure AI", "Copilot", "AI Agents", "Enterprise Knowledge"]
tags: ["Foundry IQ", "Copilot Studio", "Microsoft IQ", "Foundry Agent Service", "RAG", "MCP"]
readTime: 12
image: "/images/blog/2026-07-15-foundry-iq-copilot-studio-hero.png"
---

# Foundry IQ in Copilot Studio: Enterprise Knowledge Without Relearning Context Every Turn

**By Jeff | SMF Works | July 15, 2026**

---

## Why this matters now

Enterprise agents fail in a predictable way: they sound smart in the playground and go blank on real work. The usual culprit is not model quality. It is **context**. Every session starts cold. Every task re-discovers who owns the policy document, which SharePoint library is authoritative, and which product SKU is current.

Microsoft’s answer is not “add a bigger context window.” It is a **context layer**—**Microsoft IQ**—and a concrete product move: **Foundry IQ is available inside Copilot Studio** as an intelligence source for agent conversations ([Microsoft Foundry Blog, July 8, 2026](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-is-now-in-copilot-studio-bring-your-enterprise-data-to-every-agent-co/4534635)).

This post is a technical walkthrough of what that integration is for, how it sits next to Foundry Agent Service and Microsoft Foundry, and how to design agents so they use enterprise knowledge efficiently instead of relearning your business on every turn.

---

## The architecture: Microsoft IQ as three lenses

At Build 2026 Microsoft framed **Microsoft IQ** as generally available across GitHub Copilot, Microsoft Foundry, and Copilot Studio—a context layer that grounds agents in **world knowledge and enterprise knowledge** ([Microsoft Build 2026 blog](https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/)). Practically, treat IQ as three complementary surfaces:

| Layer | Role | What agents get |
|-------|------|-----------------|
| **Work IQ** | Workplace graph | People, email, meetings, documents, and how work actually connects in Microsoft 365 |
| **Fabric IQ** | Structured business data | Shared semantic foundation over analytical / operational data |
| **Foundry IQ** | Retrieval planning | Bridges enterprise knowledge + live web into agent-ready retrieval (evolution of Azure AI Search patterns) |

Foundry product pages describe Microsoft Foundry as the unified app/agent platform with **Foundry Models, Foundry Agent Service, Foundry Tools, Foundry IQ, Azure Machine Learning, Foundry Control Plane, and Foundry Local** ([Azure AI Foundry](https://azure.microsoft.com/en-us/products/ai-foundry)). That is the map; Copilot Studio is where many line-of-business teams will *consume* Foundry IQ without writing a full Foundry Agent Service stack.

---

## What “Foundry IQ in Copilot Studio” changes

### Before

Typical Copilot Studio agent patterns:

1. Hard-code knowledge sources (one SharePoint site, one Dataverse table).
2. Stuff long instructions into system prompts.
3. Hope retrieval plugins return the right chunk.
4. Watch token cost climb as the agent re-explains policy every conversation.

### After (with Foundry IQ as an intelligence source)

The Foundry Blog describes the builder flow in plain steps: open the agent in Copilot Studio → **Build** tab → add **Microsoft IQ** / Foundry IQ as a component so the agent can use that intelligence source in conversation ([Foundry IQ in Copilot Studio](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-is-now-in-copilot-studio-bring-your-enterprise-data-to-every-agent-co/4534635)).

The design intent is:

- **Knowledge is a component**, not a prompt appendix.
- Retrieval planning lives in **Foundry IQ**, not only in ad-hoc plugin wiring.
- Enterprise security and tenancy stay on the Microsoft path the customer already operates.

For multi-agent and developer-centric stacks, the same IQ story connects to **Foundry Agent Service**—build, deploy, and scale agents with enterprise publishing paths into Teams and Microsoft 365 Copilot ([Foundry Agent Service](https://azure.microsoft.com/en-us/products/ai-foundry/agent-service)).

---

## Technical design patterns that actually work

### 1. Separate *policy*, *facts*, and *tools*

Agents collapse when everything is one blob of instructions. Split concerns:

| Concern | Store / surface | Example |
|---------|-----------------|---------|
| Policy / behavior | System instructions + skills | Tone, escalation rules, “never invent SKUs” |
| Facts / documents | Foundry IQ / Work IQ / knowledge sources | Pricing sheets, runbooks, contracts |
| Actions | Tools / connectors / MCP | Create ticket, draft email, query ERP |

Foundry IQ strengthens the **facts** column so you can keep the **policy** column short—and short policies cache better and fail less.

### 2. Prefer retrieval planning over dump-all RAG

Naive RAG: embed everything, top-k chunks into the prompt. That works until corpus size and contradiction density explode.

Foundry IQ’s product framing emphasizes **retrieval planning** across enterprise knowledge and the live web ([Build 2026 framing](https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/)). Design implications for builders:

- Model **knowledge domains** (HR, support, product, finance) as separate sources when possible.
- Force agents to **cite** which source answered (even if only in tool logs).
- Cap “web” use when internal policy is the source of truth.

### 3. Use MCP as the integration bus carefully

Microsoft’s Foundry stack has been shipping **MCP** (Model Context Protocol) surfaces for agent/tool connectivity—including cloud-hosted MCP patterns in Foundry discussions and IQ/agent integration posts ([e.g. knowledge-grounded agents with Foundry IQ](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/building-knowledge-grounded-ai-agents-with-foundry-iq/4499683)). Treat MCP like any other tool plane:

- Least privilege per agent identity  
- Explicit allowlists  
- Human approval for outbound/destructive actions  

That pairs cleanly with SMF’s own governance posture: *autonomy for preparation, approval for consequence.*

### 4. Hosted agents vs Studio builders

| Path | Best when |
|------|-----------|
| **Copilot Studio + Foundry IQ** | Business teams, rapid LOB agents, Teams/M365 reach |
| **Foundry Agent Service** | Engineering-owned multi-agent systems, custom tools, deeper observability |

You can use both in one org: Studio for departmental agents; Foundry for platform agents. The shared IQ layer is what keeps them from inventing different “truths.”

---

## A practical reference architecture

```
                    ┌─────────────────────────────┐
                    │  Channels (Teams / M365)    │
                    └──────────────▲──────────────┘
                                   │ publish
                    ┌──────────────┴──────────────┐
                    │  Copilot Studio agent       │
                    │  + Foundry IQ component     │
                    └──────┬─────────────┬────────┘
                           │             │
              ┌────────────▼──┐   ┌──────▼────────────┐
              │ Microsoft IQ  │   │ Tools / connectors│
              │ Work/Fabric/  │   │ Graph, LOB, MCP   │
              │ Foundry IQ    │   └───────────────────┘
              └───────▲───────┘
                      │ curated by
              ┌───────┴───────────────────────────┐
              │ SharePoint / OneDrive / web /     │
              │ Fabric / approved knowledge bases │
              └───────────────────────────────────┘
```

**Build checklist for a first production agent:**

1. Pick **one** business outcome (e.g. “answer warranty questions from the official policy set only”).  
2. Register **only** the knowledge libraries that are authoritative for that outcome.  
3. Add Foundry IQ / Microsoft IQ as the intelligence source in Copilot Studio.  
4. Keep system instructions under ~1–2 screens; put process detail in docs IQ can retrieve.  
5. Enable tenant controls: agent off-by-default, scoped users, spend/credit caps where applicable.  
6. Log tool calls and knowledge hits for a two-week pilot before broad rollout.

---

## Cost and token discipline

Microsoft’s enterprise messaging around agent platforms consistently includes **admin control and spend visibility** (enablement, assignment, credit/usage patterns on Copilot-class products). Foundry IQ helps on the **token** side of the ledger by reducing the need to paste large corpora into prompts.

Practical habits:

- Prefer **retrieve-then-answer** over “paste the whole PDF into instructions.”  
- Cache stable org facts in short skills; leave volatile facts in IQ-backed sources.  
- Measure **tokens per successful task**, not just model unit price.

---

## How this fits SMF Works’ stack

On the SMF side we run **Hermes** (desktop + multi-model routing), **DGX Spark** for local inference, and products like **Praxis** / **Swarm 2.0** for agent platforms. Microsoft’s IQ + Foundry + Copilot Studio stack is the enterprise twin of that idea: **durable knowledge + governed tools + agent runtimes**.

Where they complement each other:

| Need | Microsoft path | Local/SMF path |
|------|----------------|----------------|
| M365 graph context | Work IQ / Graph connectors | m365-access-broker style gates |
| Local private models | Foundry Local (on-device options in Foundry lineup) | DGX Spark vLLM, Ollama |
| Long-form research content | Copilot / Foundry agents | Hermes + Clearinghouse publish pipeline |
| Approval for high-impact acts | Admin policies + Studio design | Governance broker patterns in Praxis |

Use Microsoft when the work lives in the tenant graph and compliance boundary. Use local agents when you need sovereign compute, custom tooling, or always-on lab agents.

---

## What to do this week

1. **Pick one agent** that currently fails because it lacks org knowledge.  
2. **Wire Foundry IQ** into its Copilot Studio definition and remove redundant prompt dumps.  
3. **Define three evaluation questions** with known gold answers from your docs; score weekly.  
4. **Document the knowledge boundary**—what the agent may answer vs escalate.  
5. **Pair with a human approval path** for anything that sends, deletes, or spends.

---

## Bottom line

Foundry IQ landing in Copilot Studio is not a minor UI checkbox. It is Microsoft aligning **enterprise knowledge retrieval** with the place many organizations actually build agents. Combined with Microsoft IQ (Work / Fabric / Foundry), Foundry Agent Service, and the broader Foundry platform, you get a production story: **grounding, tools, channels, and governance** on infrastructure customers already trust.

The teams that win will treat knowledge as infrastructure—curated, permissioned, measurable—not as a pile of PDFs pasted into a system prompt.

---

### Sources
- [Foundry IQ is now in Copilot Studio (Microsoft Foundry Blog, July 8, 2026)](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-is-now-in-copilot-studio-bring-your-enterprise-data-to-every-agent-co/4534635)  
- [Microsoft Build 2026: Be yourself at work](https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/)  
- [Azure AI Foundry product page](https://azure.microsoft.com/en-us/products/ai-foundry)  
- [Foundry Agent Service](https://azure.microsoft.com/en-us/products/ai-foundry/agent-service)  
- [Building knowledge-grounded AI agents with Foundry IQ](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/building-knowledge-grounded-ai-agents-with-foundry-iq/4499683)  
