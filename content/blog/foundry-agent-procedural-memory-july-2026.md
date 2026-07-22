---
slug: "foundry-agent-procedural-memory-july-2026"
title: "Foundry Agents That Learn How: Procedural Memory in Microsoft Foundry Agent Service"
excerpt: "Microsoft Foundry Agent Service memory now captures procedural learnings—Context + Action patterns distilled from real runs—so agents stop repeating the same failures. Here is the architecture, API surface, benchmark signal, and a build path for production teams."
date: "2026-07-17"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/foundry-agent-procedural-memory-july-2026"
categories: ["Microsoft", "Azure AI", "AI Agents", "Microsoft Foundry"]
tags: ["Microsoft Foundry", "Foundry Agent Service", "Procedural Memory", "Memory Store", "STATE-Bench", "Agent Reliability", "Azure AI"]
readTime: 12
image: "/images/blog/foundry-agent-procedural-memory-july-2026-hero.png"
---

# Foundry Agents That Learn How: Procedural Memory in Microsoft Foundry Agent Service

Enterprise agents do not usually fail because the model cannot answer a question once. They fail because they **rediscover the same workflow every Monday**.

Your agent runs `python main.py`, hits `ModuleNotFoundError` in a `uv`-managed project, flails through retries, eventually lands on `uv run python main.py`—and next week burns the same tokens again. That pattern is expensive, noisy, and completely avoidable if the platform can store **how work gets done**, not only **what the user said**.

In mid-July 2026, the Microsoft Foundry team published a clear product answer: **Memory in Foundry Agent Service now supports procedural memory**—learnings shaped as **Context → Action** patterns, extracted with LLM-as-a-judge signals, stored in a managed memory store, and re-injected when similar work appears. The announcement post is *[Agents can learn with Memory in Microsoft Foundry Agent Service](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/agents-can-learn-with-memory-in-microsoft-foundry-agent-service/4535431)* (July 16, 2026), backed by Microsoft Learn guidance for the Memory Store API and by open benchmarks such as [STATE-Bench](https://github.com/microsoft/STATE-Bench).

This Clearinghouse Log deep dive is for builders who already run agents on Microsoft Foundry and want reliability that compounds across runs—not another prompt paste into system instructions.

## Why “memory” was not enough

Most production agent stacks already ship something called memory:

| Kind | Typical contents | What it optimizes | Gap for operators |
| --- | --- | --- | --- |
| Short-term / session | Current thread, tool results in-flight | Continuity *inside* one conversation | Dies when the session ends |
| User profile | Preferences, identity facts | Personalization | Does not teach *workflows* |
| Chat summary | Distilled prior topics | Continuity *across* sessions | Describes history; rarely encodes *policy for the next action* |
| Enterprise knowledge (Foundry IQ, RAG) | Documents, policies, structured data | Grounded answers | Grounding ≠ procedure |

Microsoft Learn frames Foundry memory as **long-term** memory: extract → consolidate → retrieve across sessions ([What is Memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)). The product already supported **user profile** and **chat summary** memory types. Those are necessary—and still insufficient when the failure mode is “the agent keeps choosing the wrong tool path under the same enterprise constraints.”

**Procedural memory** fills the missing third bucket: reusable **how-to routines and operating patterns** inferred from prior interactions. Learn’s guidance is explicit on retrieval intent: pull procedural memory when the user asks for a recurring workflow or a task the agent has handled before ([memory types table](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)).

The Foundry blog’s shopping-assistant example makes the shape concrete:

```json
{
  "Context": "when a user wants to exchange a product for a different variant",
  "Action": "check variants for availability and only present variants that are currently available"
}
```

That is not a fact about the user. It is a **policy fragment for future decisions**—exactly what reduces wasted tool calls and user-visible thrash.

## What shipped: procedural memory on the managed Memory Store

### Product claim (July 2026)

Per the Foundry Blog post:

1. Memory in Foundry Agent Service **supports procedural memory**.
2. Learning signals are captured with **LLM-as-a-judge**.
3. The system produces **actionable learnings** and stores them in a **database** (managed memory store).
4. On similar tasks, learnings are **retrieved and injected into the agent’s working context**.
5. Evaluation on **STATE-Bench** (enterprise workflows) and **τ-Bench / Tau-Bench** (tool-agent-user domains) shows **consistent gains** in both best-effort success and multi-attempt reliability.

Reported deltas from the announcement:

| Benchmark | Metric | Without PM | With PM | Δ |
| --- | --- | --- | --- | --- |
| STATE-Bench | Pass¹ | 53.3% | 58.3% | +5.0% |
| STATE-Bench | Pass⁵ | 32.7% | 37.3% | +4.6% |
| Tau-Bench | Pass¹ | 75.1% | 79.8% | +4.7% |
| Tau-Bench | Pass⁵ | 49.1% | 55.4% | +6.3% |

Pass¹ averages success when each task may be attempted up to five times (capability under retries). Pass⁵ requires success on **all five** attempts (stability). The larger Pass⁵ lifts matter for ops: **consistency** is what turns a demo into a service level objective.

STATE-Bench itself is positioned as a Microsoft open-source benchmark for **AI agent memory on enterprise workflows** ([Introducing STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/), [github.com/microsoft/STATE-Bench](https://github.com/microsoft/STATE-Bench)). That gives teams a shared yardstick instead of private anecdote.

### Research framing that matches production pain

The blog names three hard truths: learning signal is **uneven** (failures and near-failures often teach more than easy wins); production traces lack clean labels; and profile/chat memory under-serve **procedure**. Procedural memory productizes that gap inside **Foundry Agent Service**—not as a third-party sidecar you operate yourself.

## Architecture: three memory types, one store, two access paths

### Memory types in Foundry Agent Service

From Microsoft Learn ([What is Memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)):

| Memory type | Description | Retrieval guidance |
| --- | --- | --- |
| **User profile** | Durable preferences and personal context | Early in the conversation for personalization |
| **Chat summary** | Distilled prior conversation topics | Per turn for continuity |
| **Procedural** | Reusable how-to routines and operating patterns | When recurring workflows / prior task shapes appear |

Lifecycle phases:

1. **Extraction** — key information is pulled from interactions (preferences, facts, relevant context; for procedures, decision patterns).
2. **Consolidation** — LLMs merge duplicates and resolve conflicts so the store stays efficient.
3. **Retrieval** — relevant memories surface into the agent’s context for the current turn.

### Scope: multi-tenant isolation by design

The `scope` parameter partitions memory inside a store. For customer-facing agents, each customer (or each end user) should typically get an isolated collection. When you attach the **memory search tool** to a prompt agent, you can set `scope` to `{{$userId}}` and let the platform resolve identity from:

- the `x-memory-user-id` request header (proxy / backend on behalf of a user), or
- the caller’s Microsoft Entra token (TID + OID) when the header is absent.

Low-level Memory Store APIs require you to pass `scope` explicitly on each call ([Create and use memory](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage)).

### Two ways to work with memory

1. **Memory search tool on a prompt agent** — attach the tool; the agent reads and writes memory during conversations. Best default for conversational agents.
2. **Memory Store APIs** — create/update/list/delete stores and items; remember/forget style commands; item-level CRUD. Best when you need explicit lifecycle control, offline curation, or non-conversational pipelines.

Latest preview capabilities called out on Learn include item-level memory CRUD, **store-level default TTL**, and synchronized remember/forget behavior.

### Enabling procedural memory at store creation

Learn’s Python path (preview packages) shows procedural memory as a **store option**, alongside chat summary, user profile, and retention:

```python
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import MemoryStoreDefaultDefinition, MemoryStoreDefaultOptions
from azure.identity import DefaultAzureCredential
import os

project_client = AIProjectClient(
    endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

options = MemoryStoreDefaultOptions(
    chat_summary_enabled=True,
    user_profile_enabled=True,
    procedural_memory_enabled=True,
    default_ttl_seconds=30 * 24 * 60 * 60,  # 30 days
    user_profile_details=(
        "Avoid irrelevant or sensitive data, such as age, financials, "
        "precise location, and credentials"
    ),
)

definition = MemoryStoreDefaultDefinition(
    chat_model=os.environ["MEMORY_STORE_CHAT_MODEL_DEPLOYMENT_NAME"],
    embedding_model=os.environ["MEMORY_STORE_EMBEDDING_MODEL_DEPLOYMENT_NAME"],
    options=options,
)

memory_store = project_client.beta.memory_stores.create(
    name="ops_runbook_memory",
    definition=definition,
    description="Procedural memory for internal ops agents",
)
print(f"Created memory store: {memory_store.name}")
```

Then attach `MemorySearchPreviewTool` to a prompt agent with `memory_store_name`, a `scope` (static team scope or `"{{$userId}}"`), and an `update_delay` so writes settle after inactivity. Learn documents the full tool + agent creation samples for Python, C#, TypeScript, Java, and REST.

**Prerequisites:** Foundry project with RBAC (or keys), a **chat** deployment, an **embedding** deployment (for example `text-embedding-3-small`), and current `azure-ai-projects` packages. Memory uses those deployments for extraction and retrieval; underlying model usage is billed while memory remains under public preview terms.

### Limits you should design for

Learn documents practical quotas and constraints ([What is Memory?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)):

- Max **100 scopes** per memory store  
- Max **10,000 memories** per scope  
- Search / update rates on the order of **1,000 RPM** each  
- Compatible Azure OpenAI chat + embedding deployments  
- **VNet integration not supported** for memory stores in the current doc set  
- Broad regional availability (US, Europe, Asia-Pacific, and other listed regions)

Those numbers are plenty for many departmental agents; multi-tenant SaaS products should **plan scope cardinality and TTL** early so stores do not become ungoverned scrapbooks.

## How this fits the rest of the Foundry agent factory

Procedural memory is not a standalone product. It sits next to pieces the Clearinghouse Log has already covered:

- **Hosted agents GA** — containerized, session-isolated runtimes with filesystem persistence for bring-your-own frameworks ([Foundry Hosted Agents Are GA](https://www.smfclearinghouse.com/blog/foundry-hosted-agents-ga-production-stack-july-2026)).
- **Foundry IQ in Copilot Studio** — enterprise knowledge as an intelligence source, not a stuffed prompt ([Foundry IQ in Copilot Studio](https://www.smfclearinghouse.com/blog/foundry-iq-in-copilot-studio-enterprise-knowledge-for-agents)).
- **Microsoft Agent Framework 1.0** — multi-agent orchestration patterns for Python and .NET ([Agent Framework 1.0 guide](https://www.smfclearinghouse.com/blog/microsoft-agent-framework-1-0-developer-guide)).
- **Publish paths** to Microsoft 365 Copilot and Teams so a reliable agent actually reaches workers ([Publish agents docs](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot); June Foundry digest).

A clean mental model:

| Layer | Job | Example surface |
| --- | --- | --- |
| Knowledge | *What is true* in the enterprise | Foundry IQ / Work IQ / Fabric IQ |
| Memory (profile + summary) | *Who this user is* and *what we discussed* | Memory Store user profile + chat summary |
| Memory (procedural) | *How we successfully operate* under constraints | Procedural memory learnings |
| Runtime | *Where code runs safely* | Hosted agents / Agent Service |
| Distribution | *Where humans meet the agent* | Teams, Microsoft 365 Copilot, custom apps |

Do not collapse these. Putting SOPs only in RAG forces the model to re-interpret prose every time. Putting procedures only in system prompts freezes learning. **Procedural memory is the closed loop**: experience → distilled action policy → better next run.

Microsoft’s June Foundry digest already listed Memory among the production-oriented capabilities maturing after Build 2026 ([What’s New in Microsoft Foundry | June 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/)). The July procedural-memory write-up is the **how-to learn** chapter of that story.

## Design patterns that work in real orgs

**1. Split shared procedure from personal preference.** Use a static scope for department runbooks distilled across incidents; use `{{$userId}}` for preferences and private exceptions. Mixing both into one bag makes retrieval noisy and compliance reviews harder.

**2. Promote failure-rich trajectories.** Tag runs that exhausted retries or needed human takeover; feed those into eval + memory update; review Context/Action pairs like runbooks. Microsoft’s research stance is that near-misses often teach more than easy wins.

**3. Secure the write path.** Learn warns about prompt injection and memory corruption—bad data stored once biases many future turns. Use Azure AI Content Safety / injection detection, adversarial tests on memory-writing agents, and `user_profile_details` that exclude sensitive categories. Pair with Foundry tracing and evaluation so you can see whether a learning improved Pass⁵-style stability or taught a bad shortcut.

**4. Treat TTL as product policy.** Document what becomes procedural memory, how long it lives, who can demote or delete it, and how users trigger remember/forget. The blog’s future directions—promotion/demotion, continuous feedback, and procedural consolidation—are the ops muscles you will need as volume grows.

**5. Measure both capability and consistency.** Track Pass¹-style “can it ever succeed?” and Pass⁵-style “does it succeed every time?” The latter is what finance and SRE care about when agents touch tickets, PRs, or customer messages.

## Implementation checklist

1. Foundry project with chat + embedding deployments in a [supported region](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory).  
2. Identity: managed identity + **Foundry User** (Azure AI User rename is rolling out; role IDs unchanged).  
3. Memory store with `procedural_memory_enabled=True` and intentional TTL.  
4. Memory search tool on the prompt agent, or Memory Store APIs from hosted agent code.  
5. Scope strategy (team static vs `{{$userId}}` + header).  
6. Instrument retrieval and tool-choice changes; evaluate on your workflows (optionally STATE-Bench-style tasks).  
7. Publish to Teams / Microsoft 365 Copilot after critical-path reliability improves.

Bookmarks: [Create and Use Memory](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage?pivots=python) · [BetaMemoryStoresOperations](https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.operations.betamemorystoresoperations?view=azure-python-preview) · [Foundry discussions](https://github.com/orgs/microsoft-foundry/discussions)

## Microsoft-ecosystem productivity

If you already live in Azure, Microsoft 365, and GitHub, procedural memory compounds those investments: Agent Framework + Foundry agents stop treating every shift as day one; **Foundry IQ** answers “what does policy say?” while procedural memory answers “how did we execute last time?”; publishing into **Teams** and **Microsoft 365 Copilot** multiplies every learning. The win is fewer repeated failures, less token waste on rediscovery, and runbooks that form from operational truth—inside the same governed Foundry project that already holds models, tools, and evaluation.

## Bottom line

Microsoft Foundry Agent Service memory is no longer only about remembering users and chat. With **procedural memory**, agents can accumulate **Context → Action** policies from real trajectories, inject them when work rhymes with the past, and show measurable reliability gains on enterprise-oriented benchmarks.

Treat it as infrastructure:

- Enable it deliberately on the Memory Store.  
- Scope it carefully.  
- Secure the write path.  
- Measure consistency, not only one-shot success.  
- Keep knowledge (Foundry IQ) and procedure (procedural memory) as complementary layers.

Agents that only recall **what** was said will keep relearning **how** to work. Foundry’s procedural memory is the platform move that lets learning stick.

---

### Primary sources

1. [Agents can learn with Memory in Microsoft Foundry Agent Service](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/agents-can-learn-with-memory-in-microsoft-foundry-agent-service/4535431) — Microsoft Foundry Blog, July 16, 2026  
2. [Create and use memory in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage) — Microsoft Learn  
3. [Memory in Microsoft Foundry Agent Service (concepts)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory) — Microsoft Learn  
4. [STATE-Bench](https://github.com/microsoft/STATE-Bench) and [Introducing STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/) — Microsoft open source  
5. [What’s New in Microsoft Foundry | June 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/) — Foundry DevBlog  
6. [Publish agents to Microsoft 365 Copilot and Microsoft Teams](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot) — Microsoft Learn  
