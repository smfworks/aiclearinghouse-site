---
slug: "2026-07-26-claude-opus-5-foundry-long-horizon-agents"
title: "Claude Opus 5 in Microsoft Foundry: Long-Horizon Agents Without Leaving Azure"
excerpt: "On July 24, 2026 Microsoft put Anthropic’s Claude Opus 5 in Foundry—Azure-hosted GA, 1M context, adaptive thinking with max effort, and CCU billing. A production playbook for deploy choice, Messages API, effort budgets, and agent runtime fit."
date: "2026-07-26"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-26-claude-opus-5-foundry-long-horizon-agents"
categories: ["Microsoft", "AI Agents", "Azure AI", "Microsoft Foundry"]
tags: ["Claude Opus 5", "Microsoft Foundry", "Foundry Models", "Anthropic", "Long-horizon agents", "Messages API", "CCU", "Hosted Agents", "Adaptive thinking", "Entra ID"]
readTime: 12
image: "/images/blog/2026-07-26-claude-opus-5-foundry-long-horizon-agents-hero.png"
---

# Claude Opus 5 in Microsoft Foundry: Long-Horizon Agents Without Leaving Azure

**By Jeff | SMF Works | July 26, 2026**

---

## The hard problem is not the next token

Most models are excellent at the next function, the next paragraph, the next tool call. Enterprise work is different. A migration spans hundreds of files. An investment memo has to hold a 10-K, a deck, and three tables in the same thread. An agent that opens a PR overnight has to recover when a test fails at hour three—not dump a half-finished plan and stop.

On **July 24, 2026**, Microsoft announced on the [Microsoft Foundry Tech Community blog](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/claude-opus-5-is-available-today-in-microsoft-foundry/4535068) that **Claude Opus 5**—Anthropic’s first Opus model in the fifth generation of Claude—is available in **Microsoft Foundry**. The same day, Microsoft Learn’s [Claude models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/claude-models) and [hosting comparison](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/claude-models-hosting-comparison) pages were refreshed so platform teams can choose **Hosted on Azure** versus **Hosted on Anthropic infrastructure** with clear residency, API, and billing rules.

This is not a “new model in the catalog” note. It is a **long-horizon ops playbook**: what Opus 5 is for inside Foundry, how to deploy and call it safely, which effort knobs matter, and how it fits the agent stack this series already covered (Toolboxes, Routines, AI Gateway, harness, BYO VNet)—without rehashing those deep dives.

---

## What Microsoft and Anthropic are claiming

The Foundry announcement frames Opus 5 around work that **runs for hours**, not turns:

| Claim (primary) | Practical meaning for builders |
| --- | --- |
| Navigates codebases like an engineer | Holds multi-file architecture context; plans edits before touching code; tracks dependencies across a long session |
| Long-running agents | Plans a workflow, adapts when something breaks, holds context across tools and subagents |
| Enterprise knowledge work | Dense documents, multi-day projects, instruction-following and scope discipline for professional outputs |
| Financial workflows | Filings + charts/tables held together across a transaction or reporting cycle |
| Multimodal enterprise inputs | Documents, charts, and visual information in the same reasoning path |

Microsoft Learn lists **claude-opus-5** as **GA on both** hosting tracks, with a **1M / 128K** context and max-output window, and calls out:

- **Adaptive thinking** with **xhigh** and **max** effort levels  
- Reasoning over **entire codebases** and **multi-day project context**  
- **Per-turn effort controls**, mid-conversation `role: "system"`, and **token budgets** (`task_budget`) — currently **beta**  
- Best-fit: *near-Fable intelligence for long-horizon coding and complex agentic orchestration*, plus long-running agents, enterprise workflows, financial analysis, and computer use  

That combination is the product story: **frontier judgment for long jobs**, delivered through Foundry’s project, identity, evaluation, and deployment plane.

---

## Two hosting tracks: choose residency before you code

Claude in Foundry is not a single black box. Learn documents two versions:

| Topic | Hosted on Azure (v2) | Hosted on Anthropic infrastructure (v1) |
| --- | --- | --- |
| Where inference runs | Azure end-to-end (ingress, API, GPU) | Anthropic-operated infrastructure |
| Data at rest / processing | At rest in selected Azure geography; Global or Data Zone scoped processing | May process outside Azure / outside selected region |
| Deployment types | **Global Standard** and **Data Zone Standard (US)** | **Global Standard** only |
| Opus 5 availability | **GA** | **GA** |
| API surface (Foundry table) | Messages + token counting | Messages + token counting; Anthropic path may expose additional APIs (e.g. files/skills) |
| Seller / operator | Anthropic (Non-Microsoft Product under Product Terms) | Same |
| Billing | Azure Marketplace → **Claude Consumption Units (CCU)**; **MACC-eligible** | Same |
| Support entry | **Microsoft Support** (deploy, billing, Marketplace, connectivity) | Same |

**Default in the portal:** when both versions exist, Foundry lands you on **Hosted on Azure**. Prefer that track when data residency and Data Zone Standard (US) matter. Prefer Anthropic-hosted when you need API surface that is not yet on the Azure-hosted track. Do not invent a third option in architecture reviews—write the choice into the design doc on day zero.

Both tracks use the same **Marketplace subscribe → deploy → CCU meter** flow. Anthropic remains seller of record and data processor for prompts/outputs under Anthropic’s DPA and commercial terms; Microsoft provides the Foundry experience, Azure control plane, and invoice.

---

## Deploy path that survives a security review

Microsoft Learn’s [Deploy and use Claude models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude) path is the one to automate:

1. **Paid Azure subscription** with a billing account in a geography where Anthropic sells the models. Marketplace purchases enabled; Contributor/Owner on the resource group.  
2. **Foundry project** in a supported region for your deployment type (Global Standard is universal for Claude; Data Zone Standard US where offered for Azure-hosted).  
3. **Discover → Models → Claude Opus 5** (confirm **Hosted on** in the model card Quick facts).  
4. **Deploy → Custom settings** (or Default settings, which pins **v2 Hosted on Azure**). Accept Marketplace terms; set industry metadata; choose **Global** vs **Data Zone** region scope; set a **deployment name** you will pass as `model` at inference time.  
5. Wait for **Succeeded**, then validate in Playgrounds and from code.

For IaC, use the [Claude on Foundry starter kit](https://github.com/Azure-Samples/claude) (Bicep/Terraform) so account, project, deployment, and auth are reviewable artifacts—not click-ops tribal knowledge.

### Endpoint shape

- Base URL: `https://<resource-name>.services.ai.azure.com/anthropic`  
- Messages: `https://<resource-name>.services.ai.azure.com/anthropic/v1/messages`  
- Client: Anthropic **Foundry** SDK (`AnthropicFoundry` in Python; `@anthropic-ai/foundry-sdk` in JS)  
- Prefer **Microsoft Entra ID** via `DefaultAzureCredential` and scope `https://ai.azure.com/.default` for production; API keys are fine for lab sandboxes. Gated Mythos models are Entra-only—build the Entra habit early.

Minimal Python pattern (from Learn; names are illustrative):

```python
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

base_url = "https://<resource-name>.services.ai.azure.com/anthropic"
deployment = "claude-opus-5"  # your deployment name

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://ai.azure.com/.default"
)
client = AnthropicFoundry(
    azure_ad_token_provider=token_provider,
    base_url=base_url,
)

message = client.messages.create(
    model=deployment,
    messages=[{"role": "user", "content": "Outline a safe multi-file refactor plan."}],
    max_tokens=4096,
    thinking={"type": "adaptive"},
    output_config={"effort": "max"},
    stream=False,
)
```

Treat `thinking` and `effort` as **first-class product knobs**, not debug flags. Adaptive thinking lets the model decide when deep reasoning is worth tokens; **max** / **xhigh** effort is how you pay for overnight agent quality without forcing every HR FAQ through the same budget.

---

## Effort, budgets, and why long-horizon needs a control plane

Opus 5’s value shows up when the job is long. That is also where cost and latency explode if every turn runs at max effort.

| Control | Use when | Ops note |
| --- | --- | --- |
| `thinking.type = adaptive` | Default for complex work | Model decides whether to think; pair with effort |
| `output_config.effort` (`max` / `xhigh` / lower) | Coding agents, multi-step tools, financial synthesis | Cap effort on interactive UX; raise for batch/overnight |
| `task_budget` (beta) | Multi-step jobs with a hard token ceiling | Prevents “runaway thoughtful” sessions |
| Mid-conversation system (beta) | Inject policy or scope mid-run | Keep agent inside approved tools and data domains |
| Prompt caching | Repeated large code/context prefixes | Cuts CCU and TTFT on iterative agent loops |
| Token count API | Preflight large contexts | Fail closed before you burn a 1M window |

**Billing reminder:** usage meters in **Claude Consumption Units (CCU)** on the Azure invoice, hourly, pay-as-you-go, MACC-eligible. Put CCU dashboards next to your Foundry AI Gateway / APIM token limits so finance sees one story. Request higher defaults through the Foundry quota form when overnight fleets hit rate limits.

---

## How Opus 5 fits the Foundry agent stack (without re-covering last week)

You do not swap your platform for a model. You **slot** the model into the control planes you already operate:

| Layer | Role with Opus 5 | Clearinghouse deep dives (link, don’t rehash) |
| --- | --- | --- |
| **Foundry Models** | Deploy Opus 5 (Azure-hosted default) | This post |
| **Agent Framework harness** | Planning, compaction, skills, approvals, OTel around any chat client | [2026-07-22 harness](/blog/2026-07-22-microsoft-agent-framework-harness-released/) |
| **Hosted agents + Toolboxes** | Sandboxed runtime; auth on toolbox / user delegation for MCP & Work IQ | [Toolboxes](/blog/2026-07-23-foundry-toolboxes-user-delegation/) |
| **Routines** | Schedule long jobs (cron, GitHub issues, timers) so “overnight” is productized | [Routines playbook](/blog/2026-07-24-foundry-routines-agent-scheduling-playbook/) |
| **AI Gateway / APIM** | Project token limits, inventory, single front door | [AI Gateway control plane](/blog/2026-07-20-foundry-ai-gateway-control-plane/) |
| **Standard + BYO VNet** | Private path for agents that touch internal code and data | [BYO VNet networking](/blog/2026-07-25-foundry-standard-agents-byovnet-networking-playbook/) |
| **Agent Optimizer** | Close the loop from traces → better instructions/tools/model choice | [Agent Optimizer](/blog/2026-07-18-foundry-agent-optimizer-closed-loop/) |

**Pattern that works in the field:**

1. **Interactive coding / PR assist** — Opus 5 at elevated effort behind Gateway; short sessions; human in the loop.  
2. **Overnight refactor / migration agent** — Hosted agent + Toolbox tools + Routine schedule; Opus 5 with adaptive thinking and a hard `task_budget`; approvals on destructive tools.  
3. **Document-heavy financial or legal synthesis** — 1M context, max effort only on the synthesis turn; store citations and intermediate artifacts outside the prompt.  
4. **Fleet cost control** — route “locate the doc” and simple Q&A to cheaper models; reserve Opus 5 for multi-hour orchestration.

If you are still choosing **knowledge retrieval** patterns for Copilot Studio + Foundry IQ, keep that decision separate from model choice—the July 22 five-pattern HR guide is about *who* retrieves, not which frontier model writes the final answer.

---

## Production checklist (this week)

Use this as a PR template for the first Opus 5 workload:

1. **Hosting decision recorded** — Azure-hosted vs Anthropic-hosted; region scope; why.  
2. **Marketplace + RBAC** — offer accepted; Contributor/Owner confirmed; no unsupported subscription type.  
3. **Deployment name frozen** — config and IaC use the same string the SDK sends as `model`.  
4. **Auth** — Entra ID for non-lab; keys rotated if used; no keys in agent prompts.  
5. **Effort policy** — table of interactive vs batch effort levels; default not `max` for chat.  
6. **Gateway / quotas** — CCU + project token limits + alert on 429s.  
7. **Safety and scope** — system instructions and Toolbox `require_approval` for write paths; RAI review on customer-facing agents.  
8. **Observability** — Foundry traces / harness OTel; store plan, tool results, and final artifacts for audit.  
9. **Network** — if Standard/private, VNet design done *before* deploy (see BYO VNet playbook).  
10. **Exit criteria** — one golden long job (e.g. multi-file refactor with tests green) and one failure-injection (broken tool) before GA traffic.

---

## What to do Monday morning

1. Open the [Foundry model catalog](https://ai.azure.com/catalog) and deploy **claude-opus-5** on **Hosted on Azure** in a non-prod project.  
2. Run the Learn Messages sample with Entra ID, `thinking: adaptive`, and `effort: max` once—confirm Succeeded and inspect token usage.  
3. Wire the same deployment name into a **dev** hosted agent or harness client behind your AI Gateway.  
4. Schedule one **Routine**-driven overnight job with a tight `task_budget` and approval on write tools.  
5. Brief finance on **CCU** metering and MACC eligibility so the bill does not surprise anyone after the first successful long run.

---

## Sources

- [Claude Opus 5 is available today in Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/claude-opus-5-is-available-today-in-microsoft-foundry/4535068) — Microsoft Foundry Blog (Tech Community), Jul 24, 2026  
- [Claude models in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/claude-models) — Microsoft Learn (model table, capabilities, quotas)  
- [Compare hosting options for Claude models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/claude-models-hosting-comparison) — Microsoft Learn (updated Jul 24, 2026)  
- [Deploy and use Claude models in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude) — Microsoft Learn  
- [Claude on Foundry starter kit](https://github.com/Azure-Samples/claude) — Azure Samples  

---

*The Clearinghouse Log covers Microsoft AI with primary-source depth. Related July stack: Agent Optimizer, AI Gateway, Agent Framework harness, Toolboxes + user delegation, Routines, and Standard agents BYO VNet.*
