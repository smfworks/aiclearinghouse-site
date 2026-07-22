---
slug: "2026-07-20-foundry-ai-gateway-control-plane"
title: "Foundry AI Gateway Control Plane: Govern Models, Agents, and Tokens Without Rewriting Your App"
excerpt: "Microsoft Foundry can now create or associate an APIM-based AI Gateway from the Admin console—project-level token limits, inventory for custom agents and MCP tools, and the same traffic path App Service teams already trust. Architecture, RBAC, verification, and a production build path for July 2026."
date: "2026-07-20"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-20-foundry-ai-gateway-control-plane"
categories: ["Microsoft", "Azure AI", "Microsoft Foundry", "API Management", "AI Agents"]
tags: ["Microsoft Foundry", "AI Gateway", "Azure API Management", "APIM", "Token Limits", "MCP", "App Service", "Agent Governance", "Chargeback"]
readTime: 12
image: "/images/blog/2026-07-20-foundry-ai-gateway-control-plane-hero.png"
---

# Foundry AI Gateway Control Plane: Govern Models, Agents, and Tokens Without Rewriting Your App

**By Jeff | SMF Works | July 20, 2026**

---

## The missing control plane after “the agent works”

You can ship a solid agent on Azure App Service, wire it to Microsoft Foundry models, and still fail the week three teams share the same capacity pool. One pilot burns the TPM budget. Chargeback cannot answer “which model, which team, which product?” Keys leak into config. Custom agents and MCP tools sit outside the inventory your platform team can see.

That is not a model problem. It is a **gateway and control-plane** problem.

In mid-July 2026, Microsoft made the control plane explicit inside Foundry itself. On **July 17**, Jordan Selig’s Apps on Azure post—*Microsoft Foundry Now Has an AI Gateway Control Plane — What Changes for App Service*—documented the shift: **Foundry can create or associate an Azure API Management (APIM) AI Gateway from Operate → Admin console → AI Gateway**, without forcing you to rewrite the agent application. The data path remains APIM. What changed is **who can configure and govern it** from Foundry.

This Clearinghouse deep dive is for platform engineers, App Service agent builders, and Foundry project owners who need **token containment, chargeback-ready telemetry, and agent/tool inventory**—while keeping agent code stable.

---

## What shipped: same gateway architecture, Foundry-native ownership

### Architecture that stays composable

The production pattern did not flip overnight. It is still:

**Client → agent runtime (e.g. Azure App Service) → APIM AI Gateway → Foundry model (and governed tools)**

APIM still authenticates callers, applies policies, forwards requests, and emits telemetry. App Service (or Hosted Agents, or any framework-agnostic runtime) still owns application logic. The new piece is the **Foundry control plane**: from **Operate → Admin console → AI Gateway**, a platform team can:

- **Create** a new APIM instance or **associate** a supported existing instance
- **Enable** the gateway for individual Foundry projects
- Apply **independent token limits** to projects sharing the gateway
- **Verify** gateway traffic and inspect logs

Once the gateway is enabled, separate Foundry experiences can also **register custom agents** and **govern supported MCP tools**. Those actions are not all on the AI Gateway tab itself, but the gateway provides their **governed traffic path**.

Microsoft Learn documents the portal workflow in *[Configure AI Gateway in your Foundry resources](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal)*: AI Gateway uses APIM behind the scenes for token limits, quotas, and governance for model deployments. Limits apply **at the project level**, so each project can have its own TPM and quota settings on a **shared** gateway.

### Why this is different from “we already put APIM in front”

Enterprise teams have been putting APIM in front of Foundry and Azure OpenAI for months. The May Apps on Azure sample—*You can build a framework-agnostic AI Gateway on Azure App Service*—showed token limits, semantic caching, token metrics, and managed-identity auth with a Microsoft Agent Framework agent and MCP server on Linux App Service.

What Foundry’s control plane adds is **first-party association and project onboarding**:

| Concern | Classic DIY APIM | Foundry AI Gateway control plane |
|--------|------------------|-----------------------------------|
| Who creates the gateway | Infra / Bicep / Terraform owners | Foundry Admin console **or** associate existing |
| Project binding | Manual policy and subscription keys | **Enable project** on the gateway; new projects default on |
| Token ceiling key | Often APIM subscription / custom expression | **Foundry project** as a natural counter key |
| Agent / MCP inventory | Separate catalogs | Expanding Foundry inventory + MCP tools governance (preview) |
| App code | Unchanged if it already called the gateway | Still unchanged—stable gateway endpoint |

Selig’s framing is exact: **Foundry manages AI assets and common project guardrails; APIM manages the traffic contract and advanced gateway behavior.**

---

## Four sourced facts builders should internalize

1. **Foundry-native create/associate (July 17 field guidance).** From the Admin console, teams create a Basic v2 APIM instance for development/testing with SLA support, or associate an existing **v2-tier** APIM in the **same tenant and subscription**, with **API Management Service Contributor** (or Owner) on the instance. Classic Developer-tier samples will **not** appear in the “Use existing” list—eligibility is v2. Source: [Selig, Apps on Azure, July 17, 2026](https://techcommunity.microsoft.com/blog/appsonazureblog/microsoft-foundry-now-has-an-ai-gateway-control-plane-%E2%80%94-what-changes-for-app-ser/4538320); [Learn: Configure AI Gateway](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal).

2. **Project-level multi-tenant capacity on one gateway.** You enable AI Gateway at the **Foundry resource** level. Projects share the APIM instance; each project gets **independent token limits**. If one project exceeds its ceiling, the gateway returns **`429 Too Many Requests`** while sibling projects continue. New projects inherit the gateway by default; **existing projects must be added explicitly**. Source: [Learn: Configure AI Gateway](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal).

3. **Chargeback-grade token signal without client rewrites (July 13 pattern).** Abhishek Mittal and Gaurav Jain’s Apps on Azure post shows APIM in front of Foundry with managed-identity auth and `azure-openai-emit-token-metric` (or equivalent LLM emit policies), dimensioned by model/deployment—so Application Insights / Azure Monitor can build **per-model, month-to-date ledgers** and 24-hour budget alerts **with no client code changes**. Dual-shape model resolution handles both Azure OpenAI path-style deployments and Foundry Model Inference body `"model"` fields. Source: [From AI Adoption to AI Governance, July 13, 2026](https://techcommunity.microsoft.com/blog/appsonazureblog/from-ai-adoption-to-ai-governance---using-apim-as-the-gateway-for-azure-ai-found/4536247).

4. **AI gateway is a capability set on APIM—not a separate SKU—and Foundry integration is first-class.** Microsoft Learn’s *AI gateway capabilities in Azure API Management* defines the AI gateway as policies and import experiences for LLM APIs, MCP servers, A2A agents, token rate limits, semantic caching, load balancing, circuit breakers, content safety, and observability. It explicitly calls out integrating the AI gateway **directly into Microsoft Foundry** so you govern models, agents, and tools from the Foundry environment. Source: [AI gateway in Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities).

Together, those four points are the production story: **composable traffic path + Foundry project economics + APIM depth when you need it.**

---

## Mental model: three limit layers, three different questions

Operators who stack limits without ownership end up debugging `429`s with no idea which layer fired. Use intentional boundaries:

| Control | Best boundary | Question it answers |
|--------|---------------|---------------------|
| **Foundry project limit** (AI Gateway) | Team or workload project | How much **shared capacity** can this project consume? |
| **APIM policy limit** | Subscription, user, tenant, app | How much can **this consumer** use? |
| **Model deployment quota (TPM)** | Backend deployment | What capacity **exists** at the model endpoint? |

Use all three when the boundaries are deliberate. For greenfield Foundry POCs, start with **project-level limits** from the Admin console. For mature enterprises, associate a **Standard v2 or Premium v2** APIM that already owns private networking, custom policies, and chargeback dimensions—and let Foundry project limits sit *above* that traffic contract.

If you need **strict isolation** (separate APIM instances, different networking, separate compliance domains), put those workloads in **separate Foundry resources**, each with its own AI Gateway. One gateway per resource is the unit of sharing; isolation is a resource boundary, not a project toggle.

---

## What still belongs in APIM (and should stay there)

Foundry’s control plane makes the **common path** easier. It does not retire advanced APIM work. Keep managing APIM directly when you need:

- Custom policy expressions, organization-specific headers, or claims
- **Semantic caching** with Azure Managed Redis (or compatible RediSearch caches)
- Backend pools, **priority routing**, and **circuit breakers** (including `Retry-After` aware trip durations)
- Private networking, multi-region gateways, and advanced topology
- Custom metrics and dimensions for internal chargeback beyond project keys

The May App Service sample remains a strong reference for framework-agnostic agents: agent and MCP on App Service, model calls only through the gateway, managed identity to the backend. Foundry association should **not** force the agent to learn whether APIM was provisioned by Bicep, Terraform, or the Admin console. **Stable gateway URL in config** is the seam.

---

## Build path: enable, verify, then harden

### Prerequisites and portal steps

Before **Add AI Gateway**: rights to create or manage APIM; to **reuse** an instance you need API Management Service Contributor (or Owner), the **same Entra tenant and subscription** as Foundry, and a **v2 tier**. Foundry Admin console access (e.g. Foundry Account Owner or Foundry Owner) is required. If Foundry has public network access disabled, pair it with privately accessible APIM (Standard v2 / Premium v2 private endpoint or VNet-injected Premium v2). Foundry RBAC names may still show prior “Azure AI …” labels in some UIs; role IDs are unchanged.

In **Microsoft Foundry (new)**:

1. **Operate → Admin console → AI Gateway → Add AI Gateway**
2. Select the Foundry resource
3. **Create new** (Basic v2 for dev/test with SLA) or **Use existing** (Standard/Premium v2 for production)
4. Name the gateway, wait until **Enabled** (Basic v2 often 5–10 minutes)
5. New projects inherit the gateway; **existing** projects need **Add project to gateway** until status is **Enabled**

### Verify allow and deny

1. Azure portal → APIM → **Monitoring → Metrics → Requests** — call a model in an enabled project; confirm the counter moves.
2. **Logs** → `GatewayLogs` for HTTP 200 and an API name matching the AI Gateway.
3. Set a **small** project token limit, exceed it, confirm **`429`**. Governance is not done until the team has watched allow **and** deny.

If you run chargeback emit policies from the July 13 pattern, validate token metrics with **ModelName** dimensions in Application Insights.

### Ownership matrix

| Scenario | Recommended approach |
|----------|----------------------|
| New Foundry POC | Create AI Gateway from Foundry; project-level limits first |
| Existing **v2** enterprise APIM | Associate; keep central networking and policy ownership |
| Classic / Developer-tier APIM | Keep it or plan a deliberate v2 migration—cannot attach directly |
| Advanced routing / custom policy | Foundry for inventory + common guardrails; APIM for traffic depth |
| Strict isolation between groups | Separate Foundry resources and separate gateways |

Treat **custom agent registration** and **MCP tools governance** as preview control-plane integrations to evaluate—not a reason to redesign a working agent overnight. Tools governance is scoped to **MCP**, not every OpenAPI tool type. Keep runtimes where they are strong; let the gateway stay the governed front door.

---

## How this fits the rest of the July Foundry stack

Adjacent Clearinghouse deep dives cover **hosted agents**, **toolboxes / Tool Search**, **Foundry IQ**, **procedural memory**, and **Agent Optimizer**. AI Gateway is the **economic and compliance seam** underneath those runtimes: Optimizer improves *quality*; the gateway improves *fairness of capacity, auditability, and chargeback*. For multi-project Foundry accounts—the normal shape after the first pilot—the July control plane is how platform teams stop being the “APIM ticket desk” for every new agent while still owning the traffic contract.

---

## Practical moves this week

- **Platform:** inventory APIM tiers for **v2 eligibility**; map Foundry **resources** to isolation boundaries; define default **project token ceilings** and a clear on-call path when teams hit `429`.
- **Developers:** call a **stable gateway URL** (not raw model endpoints); prefer **managed identity** end-to-end; enable staging projects on the gateway before load tests; smoke-test metrics increment **and** over-limit `429`.
- **FinOps:** pair project limits with APIM emit-token metrics for **per-model ledgers**; add a rolling **24-hour** budget alert; align APIM Product/Subscription IDs with cost centers.

If a gateway is missing after create, wait and refresh (Basic v2 often 5–10 minutes). If a project shows **Disabled**, use **Add project to gateway**. If an existing APIM never appears in the list, check **v2 tier**, same tenant/subscription, and Service Contributor. **Remove project from gateway** stops one project’s routing; deleting the gateway association and the APIM instance is what stops charges—disabling a project alone does not.

---

## Closing: the architecture was right; the experience caught up

The takeaway is not that every team must rebuild their AI edge in a new portal. It is that the **composable architecture**—agent runtime separate from model traffic, APIM as the governed front door—now has a **Foundry-native control plane** for project onboarding, token ceilings, and expanding agent/tool inventory.

App Service still runs the agent. APIM still governs the traffic. Foundry now lets model and platform owners **connect projects, allocate capacity, and bring agents and tools into one governance view** without asking application teams to change frameworks or chase keys.

If you already run the framework-agnostic App Service sample, keep the application boundary—evaluate Foundry association, match the project model to your org chart, and confirm APIM tier before any migration. If you are greenfield on Foundry this month, turn on AI Gateway early—**before** three pilots share one quiet deployment and discover chargeback the hard way.

The production agent stack is more than models and prompts. In July 2026, Microsoft made the gateway part of Foundry’s operating surface. Use it.

---

## Sources

1. Jordan Selig, *Microsoft Foundry Now Has an AI Gateway Control Plane — What Changes for App Service*, Apps on Azure Blog, **July 17, 2026** — https://techcommunity.microsoft.com/blog/appsonazureblog/microsoft-foundry-now-has-an-ai-gateway-control-plane-%E2%80%94-what-changes-for-app-ser/4538320  
2. Microsoft Learn, *Configure AI Gateway in your Foundry resources* — https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal  
3. Abhishek Mittal & Gaurav Jain, *From AI Adoption to AI Governance - Using APIM as the Gateway for Azure AI Foundry*, Apps on Azure Blog, **July 13, 2026** — https://techcommunity.microsoft.com/blog/appsonazureblog/from-ai-adoption-to-ai-governance---using-apim-as-the-gateway-for-azure-ai-found/4536247  
4. Microsoft Learn, *AI gateway capabilities in Azure API Management* — https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities  
5. Related sample: *App Service AI Gateway (framework-agnostic)* — https://github.com/seligj95/app-service-ai-gateway-mcp-apim-python  
