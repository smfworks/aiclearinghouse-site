---
slug: "2026-07-25-foundry-standard-agents-byovnet-networking-playbook"
title: "Foundry Standard Agents on a BYO VNet: Design the Network Before You Deploy"
excerpt: "Microsoft’s July 22 field guide makes the hard truth explicit: Foundry Standard Agents with bring-your-own VNet stall on irreversible subnet, DNS, and firewall choices—not Bicep. A production networking playbook with subnet layout, PDZ design, FQDN allow-lists, and a pre-deploy checklist."
date: "2026-07-25"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-25-foundry-standard-agents-byovnet-networking-playbook"
categories: ["Microsoft", "AI Agents", "Azure AI", "Microsoft Foundry", "Networking"]
tags: ["Microsoft Foundry", "Foundry Agent Service", "BYO VNet", "Private Endpoints", "Azure Firewall", "APIM", "Hosted Agents", "Standard Setup", "Private DNS", "Landing Zone"]
readTime: 12
image: "/images/blog/2026-07-25-foundry-standard-agents-byovnet-networking-playbook-hero.png"
---

# Foundry Standard Agents on a BYO VNet: Design the Network Before You Deploy

**By Jeff | SMF Works | July 25, 2026**

---

## The easy 20% is the template

Enterprise teams that put Microsoft Foundry Agent Service into production usually agree on one non-negotiable: **the agent cannot live on the open internet**. The moment it touches proprietary data, internal APIs, or regulated workloads, security wants it inside the company’s virtual network—behind private endpoints, a central firewall, and controlled DNS.

That topology has a name: a Foundry **Standard** agent setup injected into a **bring-your-own (BYO) VNet**. It is also where first deployments quietly stall.

On July 22, 2026, Microsoft published a field guide on the Tech Community Foundry blog—“[Design the Network Before You Deploy: Best Practices for Microsoft Foundry Standard Agents BYOVNet](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/design-the-network-before-you-deploy-best-practices-for-microsoft-foundry-standa/4537860)”—that states the problem cleanly. Deploying the agent is “the easy 20%.” The hard 80% is the network design you lock in **before** you run Bicep or Terraform. Several choices are **irreversible**: outbound network injection and the agent subnet cannot be changed after deployment, and subnets cannot be resized in place. A wrong call on day one means a redeploy, not a tweak. The real lead time is often organizational—firewall change requests, IPAM, NSG approvals, Private DNS ownership—not the template itself.

This playbook turns that primary (plus Microsoft Learn private-networking and the Agent Service networking deep dive) into an actionable guide for platform architects, network security, and the AI lead who has to hand network a complete ask on day one. It does **not** rehash this week’s Toolboxes, AI Gateway control plane, Agent Framework harness, or Routines deep dives—it is the network under those stories.

---

## What “Standard + BYO VNet” actually means

Foundry Agent Service offers a **Standard Setup with private networking**. Per [Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks), that model is designed so that:

- **No public egress** is required for foundational data paths when private endpoints and credentials are in place.
- You provide a **delegated subnet** from your virtual network; the platform connects agent compute into that subnet.
- **Private resource access** reaches your BYO stores when they are private and correctly authorized.

**Standard setups require Bring-Your-Own resources** so agent data stays in your tenant: Azure Storage, Azure AI Search, and Azure Cosmos DB for files, threads, and related state.

Two agent shapes share the same networking story with different IP behavior ([networking deep dive](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agents-networking-deep-dive)):

| Agent type | Runtime | What sits in your delegated subnet |
| --- | --- | --- |
| **Prompt agent** | Microsoft-managed compute | Single-tenant **data proxy** (project-level); tool calls egress through the proxy to your PEs |
| **Hosted agent** | Your container on Azure Container Apps / Micro VM | Micro VMs **plus** data proxy; tool calls still go through the proxy; agent outbound can use a dedicated NIC |

Inbound always hits the Foundry endpoint (for example `*.services.ai.azure.com`). Outbound to customer resources should land on **private endpoints** in a PE subnet. VNet injection is a **Standard** capability—not Basic.

**Co-locate the plane.** Once you inject the runtime into a VNet, spreading pieces across regions costs cross-region transfer and latency on every chatty hop. Rule of thumb: Foundry account, project, capability host, model deployments, Cosmos, Storage, Search, APIM (if used), the VNet, and jumpbox live in **one region**. The Foundry resource must share the **VNet’s region**; other BYO PaaS can differ, but you pay the tax.

---

## Subnet layout: four jobs, four subnets

The most common failure mode is a flat VNet with one shared subnet. Foundry Standard plus optional APIM pushes you toward purpose-built subnets:

| Subnet | Purpose | Delegation | Notes |
| --- | --- | --- | --- |
| **agent-subnet** | Capability host injects agent runtime NICs | **Microsoft.App/environments** (required) | Empty of Private Endpoints—delegation and PE NICs cannot coexist; exclusive to **one** Foundry account |
| **pe-subnet** | PEs for Cosmos, Storage, Search, Foundry, APIM inbound | None | PE subnets cannot be delegated |
| **apim-outbound-subnet** | APIM VNet integration egress | **Microsoft.Web/serverFarms** | Dedicated to a single APIM instance |
| **jumpbox-subnet** | RDP/SSH, `nslookup`, private portal validation | None | Separate NSG posture from PE space |

Extra workloads (private MCP servers, custom APIs) get **their own** subnets—never agent-subnet or pe-subnet.

### APIM pattern that stays clean

For a production AI Gateway front door, the July guide recommends **Premium v2** (or Standard v2):

- **Inbound:** Private Endpoint on **pe-subnet** → `privatelink.azure-api.net`.
- **Outbound:** VNet integration into **apim-outbound-subnet** so APIM reaches Foundry and BYO PaaS via private IPs only.

### Size the irreversible choices

| Subnet | Guidance |
| --- | --- |
| **agent-subnet** | Official recommendation **/24**. API floor **/27**. **Cannot resize in place.** |
| **apim-outbound-subnet** | Minimum **/27**, prefer **/24**. |

Why /24 for agents: the subnet is delegated to the Container Apps fabric. Scale-out, platform upgrades (old + new infrastructure in parallel), and Hosted agent Micro VM sessions all consume addresses. The deep dive models roughly **1 IP per 10 pods** for data-proxy style capacity and notes Hosted agent revisions run old and new side by side. Session guidance reaches **~50 concurrent sessions per subscription per region**; **/26 or larger** is called out when you need to approach that maximum. Target **under 80% utilization** so upgrades do not strand you.

**RFC 1918 only** on the delegated agent subnet: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. No public ranges, no CGNAT `100.64.0.0/10`. Class A `10.x` is region-restricted for Agent Service—confirm [supported regions](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions) before IPAM commits. Peered VNets must not overlap; if you cannot fix overlap, prefer **managed virtual network** over BYO.

Outbound network injection and agent subnet choice are **locked after deploy**. Plan once.

---

## Two traffic buckets (firewall vs PE)

### Bucket A — In-VNet service-to-service

Foundry runtime → Cosmos / Storage / Search / model PE / APIM PE.

With private endpoints, this is outbound to a **private IP**. Azure’s **/32 system route for each PE** beats a `0.0.0.0/0` UDR to the firewall, so PE traffic typically **does not hit the firewall**. NSG: allow **agent-subnet → pe-subnet on TCP 443** (or service tags). No application rule required for that path if PE routing is intact.

### Bucket B — Control-plane FQDNs

Entra tokens, managed identity, container pulls, evaluations/traces, ARM metadata—this is the **firewall application rule collection**.

**Sources:** agent-subnet; jumpbox if used for validation.

**Baseline allow-list** (align with [private-link firewall guidance](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link) and the July field guide):

| Scenario | FQDNs / tags | Why |
| --- | --- | --- |
| Agents / identity | `*.identity.azure.net`, `login.microsoftonline.com` (and related) **or** `AzureActiveDirectory` | Container Apps delegation + managed identity |
| Evaluations & traces | `AzureMachineLearning` service tag, `settings.sdk.monitor.azure.com` | Evaluator catalog + App Insights path |

**Typical additions:** `management.azure.com` (ARM); `graph.microsoft.com` when directory context is needed; `mcr.microsoft.com`, `*.data.mcr.microsoft.com`, `*.azurecr.io` for images; App Insights / monitor ingest if traces leave through the firewall.

Prefer service tags and private endpoints over forever-widening wildcards. Enable **Azure Firewall diagnostic logs** from day one and iterate Deny events by source subnet + destination FQDN. Do **not** TLS-inspect agent control-plane paths with a MITM cert the platform will not trust.

**UDR is mandatory for allow-list enforcement:** peering alone will not force spoke egress through the hub firewall. Put `0.0.0.0/0 → firewall private IP` on **every spoke subnet** that must be governed.

---

## Private DNS: the highest-value decision

More BYO-VNet Foundry incidents trace to **DNS** than any other single component.

1. **No duplicate Private DNS zones.** If `privatelink.blob.core.windows.net` exists in both hub and spoke, resolution becomes non-deterministic.
2. **In hub-and-spoke, PDZs live in the hub.** Create each zone once; set spoke DNS to the firewall private IP with **DNS proxy enabled**. Flow: spoke query → firewall DNS proxy → Azure DNS in hub context → hub-linked PDZ → PE IP.

**Seven zones** the Standard + APIM pattern typically needs: `privatelink.services.ai.azure.com`, `privatelink.openai.azure.com`, `privatelink.cognitiveservices.azure.com`, `privatelink.search.windows.net`, `privatelink.blob.core.windows.net`, `privatelink.documents.azure.com`, `privatelink.azure-api.net`.

Learn note: private endpoints to **Search, Storage, and Cosmos are not always auto-created** with the Foundry resource—create them explicitly and register the matching zones.

### NSG minimum viable posture

- HTTPS (443) from agent-subnet and apim-outbound-subnet to **pe-subnet CIDR** (or Cosmos/Storage/Search/AzureAD tags).
- APIM outbound integration rules (Storage, Key Vault) so APIM does not flip to Failed.
- Jumpbox RDP/SSH **from the firewall subnet** (DNAT), not the public internet.
- Default-deny internet on agent, PE, and APIM subnets; only the firewall path escapes via UDR.

---

## Validate before `agents.create`

From a jumpbox **and** from a path that represents agent-subnet resolution:

```text
nslookup <foundry-account>.services.ai.azure.com
nslookup <search-name>.search.windows.net
nslookup <cosmos-name>.documents.azure.com
nslookup <storage-name>.blob.core.windows.net
nslookup <apim-name>.azure-api.net
```

**Each must return a private PE address**, not a public A record. If the jumpbox is private but the agent subnet is not, fix PDZ links / DNS proxy / UDR before writing agent code.

Also confirm: **Microsoft.App/environments** delegation; **public network access disabled** on Foundry, Search, Storage, Cosmos; required RBAC; provider registration (`Microsoft.App`, `Microsoft.Search`, `Microsoft.Network`, and friends).

**Capacity signals** (portal does not expose delegated-subnet IP utilization cleanly): data proxy **HTTP 5xx**, Hosted agent session **4xx** on create, new project provisioning failures. Plan a fresh instance + subnet rather than hoping.

Known Standard private-network constraints before you promise features: Code Interpreter file upload/download limits in BYO setups; Blob-backed File Search caveats; tool matrices in [limits, quotas, and regions](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions).

---

## Pre-deploy checklist

Walk this list **before** `capabilityHosts` PUT:

1. Agent subnet → **Microsoft.App/environments**, **/24** for production (/27 only for known-small non-prod).
2. Tools outside VNet vs **tools-behind-VNet** recorded (sample template **15** vs **19**).
3. APIM inbound PE on pe-subnet; outbound on dedicated Microsoft.Web/serverFarms subnet (/24 preferred).
4. Seven privatelink zones exist **once** (hub); spokes resolve via firewall DNS proxy.
5. Spoke DNS = firewall private IP; DNS proxy enabled.
6. UDR `0.0.0.0/0 → firewall` on every governed spoke subnet.
7. Firewall rules: Foundry baseline + image/telemetry; agent (+ jumpbox) as sources.
8. NSGs: agent/APIM → PE 443; APIM Storage/Key Vault; no public jumpbox.
9. `nslookup` from jumpbox **and** agent path returns private IPs for Foundry, Cosmos, Storage, Search, APIM.
10. BYO Storage, Search, Cosmos with PEs; public access off; project identity RBAC ready.
11. Providers registered; Foundry account region matches VNet.
12. IPAM non-overlap across peers; Class A confirmed if using `10.0.0.0/8`.

Official samples under [`microsoft-foundry/foundry-samples` infrastructure](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure): `15-private-network-standard-agent-setup`, `16-…-apim-setup`, `19-…-agent-tools`.

---

## How this fits the stack (and this week)

| Layer | Role relative to BYO VNet |
| --- | --- |
| **This playbook** | Landing zone, PE, DNS, firewall, irreversible subnets |
| **Foundry AI Gateway / APIM** | Optional private front door on the same PE + outbound pattern |
| **Toolboxes + user delegation** | Auth on connections; private MCP still needs PE DNS |
| **Routines** | Unattended invoke on the secured endpoint—agent identity, not user OBO |
| **Agent Framework harness** | Hosted images land in the network you already designed |
| **Evals / Optimizer** | Trace egress often needs firewall allow-list entries |

**This week:** run a 90-minute design review with platform + network + AI lead; reserve /24 agent and APIM outbound space in IPAM; file one firewall change for baseline FQDNs + MCR/ACR + monitor ingest; prove private DNS; only then create the first prompt agent and a PE-backed tool call. Document expected projects, hosted vs prompt mix, and concurrent sessions against the 80% utilization target.

---

## Closing

Foundry Standard on a BYO VNet is not harder than other network-isolated Azure workloads. It is the intersection of Foundry, optional APIM, Cosmos, Search, and Storage—each with private-networking quirks. What makes it feel hard is **deploying first and discovering constraints second**.

Reverse the order: lock subnet layout and irreversible delegations, design Private DNS once in the hub, assemble firewall and NSG rules as a single network change, validate name resolution from the agent path, then run the template. Microsoft’s July 22 field guide and the Learn private-networking / networking deep-dive pages give you the canonical map. The checklist above is the deliverable your landing-zone ticket should attach.

Decide first. Deploy second. That is how Standard Agents earn the word *production*.

---

## Sources

1. [Design the Network Before You Deploy: Best Practices for Microsoft Foundry Standard Agents BYOVNet](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/design-the-network-before-you-deploy-best-practices-for-microsoft-foundry-standa/4537860) — Microsoft Tech Community / Foundry Blog, Jul 22, 2026 (Priya Kedia).
2. [Set up private networking for Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks) — Microsoft Learn.
3. [Deep dive into Foundry Agent Service networking](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agents-networking-deep-dive) — Microsoft Learn.
4. [How to configure network isolation for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link) — Microsoft Learn.
5. [Networking options for Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options) — Microsoft Learn.
6. [Foundry samples — private network infrastructure (Bicep/Terraform)](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure) — official templates 15 / 16 / 19.
