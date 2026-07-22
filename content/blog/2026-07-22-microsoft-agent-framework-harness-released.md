---
slug: "2026-07-22-microsoft-agent-framework-harness-released"
title: "Microsoft Agent Framework Harness: Batteries-Included Agent Runtime for Python and .NET"
excerpt: "On July 22, 2026 Microsoft released the Agent Framework harness—a stable, opinionated runtime that wraps Foundry (or any) chat clients with planning, compaction, skills, approvals, and OpenTelemetry. Architecture, defaults, opt-ins, and a production build path."
date: "2026-07-22"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-22-microsoft-agent-framework-harness-released"
categories: ["Microsoft", "AI Agents", "Azure AI", "Microsoft Foundry", "Developer Tools"]
tags: ["Microsoft Agent Framework", "Agent Harness", "Microsoft Foundry", "Python", ".NET", "Agent Skills", "OpenTelemetry", "Tool Approval", "Hosted Agents"]
readTime: 12
image: "/images/blog/2026-07-22-microsoft-agent-framework-harness-hero.png"
---

# Microsoft Agent Framework Harness: Batteries-Included Agent Runtime for Python and .NET

**By Jeff | SMF Works | July 22, 2026**

---

## The runtime gap after “we have a chat client”

You can wire an `IChatClient` or a Foundry chat client, hang a few functions off it, and ship a demo. Then the real requirements show up: multi-step plans that survive a crash mid-run, context that does not blow the window after twenty tool calls, standing approval rules for safe tools, progressive skills instead of a 12k-token system prompt, and OpenTelemetry traces your platform team can actually query.

That scaffolding is an **agent harness**—the loop and policy layer that turns text generation into durable work. On **July 22, 2026**, Principal Software Engineer Wes Steyn announced that the **Microsoft Agent Framework harness is now released** for **Python and .NET**: a stable, batteries-included agent that wraps your chat client with a full agentic pipeline while remaining fully customizable.

This Clearinghouse deep dive is for builders who already use Agent Framework (or are choosing it after the 1.0 orchestration patterns) and need a **production-shaped default** they can dial down—not another greenfield framework.

---

## What an agent harness is (and is not)

Microsoft Learn’s *Agent Harnesses* page is unambiguous: a model alone generates text. A harness drives the agent—it runs the model/tool loop, manages history and context, applies approval and safety policies, and keeps the agent progressing toward completion. Coding assistants and long-running research agents are all “model + harness.”

Agent Framework’s ready-made harness is **opinionated but not sealed**. Internally it is still a chat-client agent (`Agent` in Python, `ChatClientAgent` / harness wrapper in .NET) with a curated set of framework features enabled by default. You supply the **chat client**, **instructions**, and **tools**; the harness supplies the pipeline.

That split matters operationally. Foundry Hosted Agents, App Service runtimes, and local CLIs can all sit on the same conceptual stack: your application identity and model choice remain yours; the harness standardizes how work is planned, compacted, approved, and observed.

---

## What shipped on July 22

### Core release: defaults you can disable

Steyn’s announcement and Learn document the same capability set. Defaults (each individually customizable or removable):

| Capability | Role in the pipeline |
|------------|----------------------|
| **Function invocation** | Automatic tool-calling loop with a configurable iteration limit |
| **Per-service-call history persistence** | Chat history saved after every model call for crash recovery and mid-run inspection |
| **Compaction** | Context-window management so long tool loops do not overflow (token budget or custom strategy) |
| **Todo provider** | Persistent todo list for multi-step work |
| **Agent-mode provider** | Plan / execute (and custom) mode tracking |
| **File memory** | Durable session notes and artifacts across turns |
| **Skills** | Progressive discovery and loading of packaged domain expertise |
| **Web search** | Hosted/inference-service web search when the backend provides it |
| **Tool approval** | “Don’t ask again” standing rules plus heuristic auto-approval for safe calls |
| **OpenTelemetry** | Built-in observability aligned with generative-AI semantic conventions |

Optional / advanced surfaces (Learn + announcement “coming soon” opt-ins) include **file access** scoped to a working directory, **shell** execution, **background agents** for concurrent sub-tasks, and **looping** until a completion condition. The July 22 post notes that some of these already work but may emit warnings until they leave the “get more customer feedback” stage—treat them as **explicit opt-ins**, not silent defaults for production.

### One-call construction (Foundry-first samples)

**.NET** — any `IChatClient`, then `AsHarnessAgent`:

```csharp
IChatClient chatClient =
    new AIProjectClient(new Uri(endpoint), new DefaultAzureCredential())
        .GetProjectOpenAIClient()
        .GetResponsesClient()
        .AsIChatClient(deploymentName);

AIAgent agent = chatClient.AsHarnessAgent(new HarnessAgentOptions
{
    ChatOptions = new ChatOptions
    {
        Instructions = "You are a helpful research assistant. Plan your work, then execute it.",
        Tools = [/* your AIFunction tools */],
    },
});

AgentRunResponse response = await agent.RunAsync(
    "Research the outlook for renewable energy stocks.");
```

**Python** — `create_harness_agent` with `FoundryChatClient`:

```python
from agent_framework import create_harness_agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

client = FoundryChatClient(credential=AzureCliCredential())
agent = create_harness_agent(
    client=client,
    agent_instructions="You are a helpful research assistant. Plan your work, then execute it.",
    tools=[],  # callables here
)
response = await agent.run("Research the outlook for renewable energy stocks.")
```

Environment variables such as `FOUNDRY_PROJECT_ENDPOINT` and `FOUNDRY_MODEL` keep credentials and deployment names out of code. Official samples live under `dotnet/samples/02-agents/Harness` and `python/samples/02-agents/harness` in the [microsoft/agent-framework](https://github.com/microsoft/agent-framework) repo.

---

## Four sourced facts builders should internalize

1. **Harness = stable batteries-included release (July 22, 2026).** Agents can be built on a stable harness covering the loop, planning, memory, context management, approvals, and telemetry in **both Python and .NET**. You customize what makes the agent yours; defaults cover the rest. Source: [Steyn, Agent Framework blog, July 22, 2026](https://devblogs.microsoft.com/agent-framework/the-microsoft-agent-framework-harness-is-now-released/).

2. **Feature matrix is documented on Microsoft Learn, not only in blog code.** Learn lists function invocation, per-call history persistence, compaction, todo and agent-mode providers, file memory, file access, tool approval, OpenTelemetry, web search, and optional skills, background agents, shell, and looping—with disable flags and extension points (`AIContextProviders`, custom compaction strategies, `LoopEvaluator` / `loop_should_continue`). Source: [Agent Harnesses | Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/agents/harness).

3. **Skills are first-class progressive expertise, including Foundry-managed skills.** The “Build your own claw” series (especially Part 3, July 9) shows file-based `SKILL.md` packages plus **Foundry skills** discovered via Toolbox MCP so valuation methods or governance rules update centrally without redeploying the agent. Agent Skills for Python reached a stable, non-experimental API on July 15. Source: [Scaling the claw or harness capabilities](https://devblogs.microsoft.com/agent-framework/agent-harness-scaling-the-claw-or-harness-capabilities/); [Agent Skills for Python](https://devblogs.microsoft.com/agent-framework/agent-skills-for-python-is-now-released/).

4. **Runnable samples encode research, data-processing, and finance-claw paths.** The Python harness sample README documents `harness_research.py` (plan/execute + todo loop), `harness_data_processing.py` (folder tools + approval), and `build_your_own_claw/` matching the blog series—plus security notes on background agents, external skill sources, auto-approval name collisions, and telemetry sensitivity. Source: [python/samples/02-agents/harness](https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/harness); [series hub](https://devblogs.microsoft.com/agent-framework/build-your-own-claw-and-agent-harness-with-microsoft-agent-framework/).

---

## Architecture: what you own vs what the harness owns

```
┌─────────────────────────────────────────────────────────────┐
│  Your app / CLI / Hosted Agent host                         │
│    instructions · tools · identity · model deployment       │
└───────────────────────────┬─────────────────────────────────┘
                            │ chat client (Foundry, AOAI, …)
┌───────────────────────────▼─────────────────────────────────┐
│  Agent Framework Harness                                    │
│  ┌──────────────┐ ┌─────────────┐ ┌──────────────────────┐  │
│  │ Plan / Todo  │ │ Compaction  │ │ History (per call)   │  │
│  │ Mode provider│ │ token budget│ │ mid-run inspect      │  │
│  └──────────────┘ └─────────────┘ └──────────────────────┘  │
│  ┌──────────────┐ ┌─────────────┐ ┌──────────────────────┐  │
│  │ Skills load  │ │ Approvals   │ │ OpenTelemetry        │  │
│  │ progressive  │ │ standing +  │ │ gen-AI conventions   │  │
│  │              │ │ heuristics  │ │                      │  │
│  └──────────────┘ └─────────────┘ └──────────────────────┘  │
│  Opt-in: file access · shell · background agents · looping  │
└───────────────────────────┬─────────────────────────────────┘
                            │
              tools · web search · MCP / Foundry toolbox
```

**You own:** model selection and quality bar, tool contracts, skill content and trust boundaries, approval policy for risky actions, where telemetry goes, and how the agent is hosted (local process, App Service, Foundry Hosted Agents).

**The harness owns:** wiring the loop so those pieces compose without every team re-implementing persistence, plan/execute modes, and compaction.

This complements earlier July Microsoft AI posts on this Log: **Foundry Agent Optimizer** closes the eval→rewrite loop for hosted agents; **Foundry AI Gateway** governs tokens and inventory at the traffic edge. The harness is the **in-process runtime shape** that sits between your app code and those platform controls.

---

## Production patterns that pay off immediately

### 1. Turn on compaction with real token numbers

Compaction is not magic defaults-only on every path. Learn’s guidance: supply **max context window** and **max output** tokens to enable the default token-budget strategy (for example 128_000 / 16_384). Without budgets or a custom strategy, compaction may stay off. For long research or multi-file data jobs, set budgets on day one.

### 2. Separate harness instructions from task instructions

Harness-level instructions (`HarnessInstructions` / `harness_instructions`) describe **operating guidelines** for the runtime; `ChatOptions.Instructions` / `agent_instructions` describe the **role**. Override defaults when you need stricter domain boundaries; leave them when the stock plan/execute behavior is enough.

### 3. Treat skills as progressive disclosure, not prompt stuffing

File skills advertise name + description; full `SKILL.md` (and scripts/resources) load on demand. Foundry skills flip the ops model: publish once to the project toolbox, pick up at runtime. Use that for **shared governance** (“financial-agent-rules”) and for methods that change faster than your deploy cadence.

### 4. Approval is a product surface

Default tool approval plus standing “don’t ask again” rules is how you ship unattended execute mode without opening a write shell to the world. Sample security notes are explicit: auto-approval often matches **tool names**—do not collide safe names with shell or other high-impact tools. Deny-lists on shell are a **UX pre-filter**, not a full security boundary; confine working directories and keep human approval on destructive paths.

### 5. Plan mode vs execute mode as an ops contract

Research samples use interactive **plan** (questions, todos, human OK) then autonomous **execute** (work the list, optionally loop while todos remain). That maps cleanly to enterprise change windows: humans approve the plan; agents run the checklist under telemetry and approval gates.

### 6. Opt-in power features deliberately

Background agents, file access, shell, and looping expand the trust boundary. Enable them when the scenario needs concurrency or filesystem reach—and only after you have approval policy, confined directories, and tracing destinations locked. The July 22 post’s “coming soon” framing is a gift: you can experiment, but do not treat every sample flag as GA-default for regulated workloads.

---

## Build path: from empty folder to first harness agent

1. **Prereqs** — `az login`, Foundry project + strong chat deployment, Python or .NET SDK. Set `FOUNDRY_PROJECT_ENDPOINT` and `FOUNDRY_MODEL`.
2. **Install** released Agent Framework + Foundry client packages (samples’ `uv run` / NuGet pins).
3. **Run a stock sample** (`harness_research.py` or .NET Harness) end-to-end before custom tools.
4. **Add one domain tool** with a crisp schema and recoverable errors; **set compaction budgets** to your model window.
5. **Add one skill** (`skills/…/SKILL.md` or Foundry toolbox skill) for a playbook you currently paste into prompts.
6. **Lock approval policy** for side-effect tools; reserve auto-approve for collision-free read tool names.
7. **Export OpenTelemetry**, then promote host: local CLI → App Service/container → Foundry Hosted Agents without rewriting harness construction.
8. **Close the platform loop** — Foundry AI Gateway / APIM for project token limits; Agent Optimizer when traces show instruction or tool-description drift.

---

## How this fits the rest of the Microsoft agent stack (July 2026)

| Layer | What it solves | July reference on this Log / primary |
|-------|----------------|--------------------------------------|
| **Harness (this release)** | In-process agent runtime: plan, compact, approve, skills, OTel | [Harness released](https://devblogs.microsoft.com/agent-framework/the-microsoft-agent-framework-harness-is-now-released/) |
| **Orchestration 1.0** | Multi-agent patterns at stable API | Prior Agent Framework 1.0 coverage |
| **Agent Skills** | Packaged progressive expertise (.NET + Python stable) | [Skills for Python](https://devblogs.microsoft.com/agent-framework/agent-skills-for-python-is-now-released/) |
| **Foundry Hosted Agents** | Managed execution surface | Hosted Agents GA deep dive |
| **Agent Optimizer** | Trace → better instructions/skills/tools/model | [2026-07-18 Optimizer](https://www.smfclearinghouse.com/blog/2026-07-18-foundry-agent-optimizer-closed-loop/) |
| **AI Gateway control plane** | APIM token limits, inventory, chargeback path | [2026-07-20 Gateway](https://www.smfclearinghouse.com/blog/2026-07-20-foundry-ai-gateway-control-plane/) |

Use the harness when you are writing **application-owned** agent code and want Microsoft’s default composition of Agent Framework features. Use Hosted Agents when you want Foundry to run that shape for you. Use Gateway and Optimizer when the problem is **fleet governance and continuous improvement**, not the first successful `RunAsync`.

---

## Practical checklist before you call it “done”

- Chat client uses managed identity / `DefaultAzureCredential` / `AzureCliCredential`—no keys in repo  
- Harness via `AsHarnessAgent` / `create_harness_agent` with explicit agent instructions and compaction budgets  
- Custom tool schema + skills path (file or Foundry toolbox) reviewed for trust  
- Approval rules checked; no unsafe auto-approve name collisions; shell/file/background opt-ins confined and documented  
- OpenTelemetry exported in staging; gateway project limits considered for shared capacity  

---

## Conclusion

The July 22 harness release is the moment Agent Framework stops being “a kit of excellent parts” and becomes “a default agent you can ship.” Bring a Foundry (or any) chat client, instructions, and tools; get planning, persistence, compaction, skills, approvals, web search, and OpenTelemetry without reinventing the loop. Keep the opt-in surfaces deliberate, pair the runtime with Foundry’s gateway and optimizer when you scale, and build on the official harness samples rather than a private snowflake runtime.

**Start here:** [Harness announcement](https://devblogs.microsoft.com/agent-framework/the-microsoft-agent-framework-harness-is-now-released/) · [Learn: Agent Harnesses](https://learn.microsoft.com/en-us/agent-framework/agents/harness) · [Python / .NET samples](https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/harness)

---

## Sources

1. Wes Steyn, “The Microsoft Agent Framework Harness is now released,” Microsoft Agent Framework blog, July 22, 2026. https://devblogs.microsoft.com/agent-framework/the-microsoft-agent-framework-harness-is-now-released/
2. Microsoft Learn, “Agent Harnesses.” https://learn.microsoft.com/en-us/agent-framework/agents/harness
3. Wes Steyn, “Agent Harness: Scaling the claw or harness capabilities,” July 9, 2026. https://devblogs.microsoft.com/agent-framework/agent-harness-scaling-the-claw-or-harness-capabilities/
4. Wes Steyn, “Build your own claw and agent harness with Microsoft Agent Framework” (series hub). https://devblogs.microsoft.com/agent-framework/build-your-own-claw-and-agent-harness-with-microsoft-agent-framework/
5. Giles Odigwe, “Agent Skills for Python Is Now Released,” July 15, 2026. https://devblogs.microsoft.com/agent-framework/agent-skills-for-python-is-now-released/
6. microsoft/agent-framework, Python harness samples README. https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/harness
7. microsoft/agent-framework, .NET Harness samples. https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/02-agents/Harness
