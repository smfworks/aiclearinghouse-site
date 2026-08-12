---
slug: "2026-08-12-foundry-agents-private-byo-capability-hosts"
title: "Mastering Private BYO Resources for Microsoft Foundry Agents: Capability Hosts at Account and Project Scope"
excerpt: "Enterprise Foundry agents often fail to reach private Cosmos, AI Search, or Storage resources even with correct private endpoints and VNets. The root cause is usually missing or misconfigured project-level capability hosts — not the network. Here is the exact configuration, diagnosis checklist, and integration playbook."
date: "2026-08-12"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-foundry-agents-private-byo-capability-hosts"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Foundry Agents", "Private Networking", "BYO Resources", "Capability Hosts", "Enterprise AI", "Agent Service", "Private Endpoints"]
readTime: 16
image: "/images/blog/2026-08-12-foundry-agents-private-byo-capability-hosts-hero.png"
---

Microsoft Foundry Agent Service is designed for secure, private-by-default deployments at enterprise scale. When you follow the standard agent private networking guidance — disable public network access, inject into a VNet, front with private endpoints, stand up Private DNS zones, and keep everything in the same region — the expectation is that your agent will seamlessly reach your own Cosmos DB containers, AI Search indexes, Blob Storage accounts, and other data resources.

In practice, many teams hit a wall: the agent returns connection failures, name resolution errors, or MCP tool timeouts that look exactly like a private networking misconfiguration. Network Watcher shows clean paths. Private endpoints test fine. Yet the agent cannot write conversation history, load vector stores, or invoke tools against your locked-down resources.

The surprising cause is almost always one layer above the network: **capability hosts** at the Foundry account and project scopes. This post walks through the exact architecture, the no-inheritance gotcha that trips up most setups, the precise connection object properties you must supply, a five-minute diagnosis checklist, and how to integrate this correctly with the broader Microsoft AI stack for productive, secure agent deployments.

## Why Private BYO Resources Matter for Enterprise Agents

Enterprise agents rarely run in isolation. They ground on your proprietary data (customer records in Cosmos, contracts in Search, transaction logs in Storage), execute tools against internal systems, and maintain long-running conversation state. Using Microsoft-managed defaults for thread storage, vector stores, and file uploads is convenient for prototyping but unacceptable for regulated workloads.

Microsoft provides the controls to bring your own resources so that:

- All agent data stays inside your subscription and network boundaries.
- You apply your existing encryption, retention, and access policies.
- You get unified billing and observability through your own resources.
- You satisfy architecture reviews that require "no Microsoft-managed data plane for sensitive workloads."

The capability host mechanism is how Foundry Agent Service learns where those resources live and how to authenticate to them.

## Capability Hosts: The Missing Layer

A capability host is a sub-resource you create under both the Foundry account and individual projects. Its job is to declare the storage, vector, and thread resources the Agent Service should use for that scope.

There are two kinds of hosts you will encounter:

- **Account-level capability host**: Declares the default BYO resources for the entire Foundry account. Connections created here become visible to projects.
- **Project-level capability host**: The one the Agent Service actually consults at runtime for a specific project’s agents. This is the one most teams miss.

When you do not create a project capability host (or create one that does not reference your connections), Agent Service falls back to Microsoft-managed resources. In a fully private setup this often manifests as:

- Loud failures: "connection refused", DNS lookup failures for your storage/search endpoints, or tool call timeouts.
- Silent failures: agents appear to run but Cosmos containers and Search indexes stay empty because the agent wrote to the wrong (managed) resources.

The errors present as network problems because the resolution step happens inside the capability host connection logic. Fix the wiring and the "network" symptoms disappear.

## Account vs Project Scope: No Automatic Inheritance

This is the central surprise documented in the August 7, 2026 Foundry blog post.

Creating a perfect account-level capability host and connections does **not** automatically propagate the configuration to your projects. Account-level connections are visible (a project can "see" them), but the project capability host is what tells Agent Service "use these specific connections for thread storage, vector stores, and file storage in this project."

The sequence is strict:

1. Create (or confirm) an account-level capability host.
2. Create the named connections at account scope (or reference existing ones).
3. Create a project-level capability host that explicitly lists the connection names in `threadStorageConnections`, `vectorStoreConnections`, `storageConnections`, and optionally `aiServicesConnections`.

If step 3 is skipped, your private resources are never used.

## Anatomy of a Connection Object

Each connection referenced by a capability host must carry four key pieces of information. The blog post and supporting ARM patterns emphasize these properties:

| Property              | Purpose                                      | Example Value |
|-----------------------|----------------------------------------------|---------------|
| authType              | Authentication mechanism                     | "AAD" |
| category              | Resource type                                | "AzureCosmosDb", "AzureStorageAccount", "CognitiveSearch" |
| target                | The service endpoint URL (not the resource ID) | "https://my-cosmos.documents.azure.com:443/" |
| metadata.ResourceId   | Full Azure Resource Manager ID of the resource | "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.DocumentDB/databaseAccounts/{name}" |

Swapping `target` and `ResourceId`, omitting the metadata, or using a connection name that does not exist at the right scope are the most common authoring errors. These produce exactly the resolution failures that get misdiagnosed as VNet or DNS problems.

## Practical Configuration Example (REST + Azure CLI)

The current surface for capability hosts is primarily the Azure Resource Manager REST API (SDK surface is still catching up). Here is the pattern teams use in Cloud Shell or automation:

```bash
# Get a token
TOKEN=$(az account get-access-token --resource https://management.azure.com --query accessToken -o tsv)

# 1. List account capability hosts (confirm account host exists)
curl -X GET \
  "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.CognitiveServices/accounts/{accountName}/capabilityHosts?api-version=2025-06-01" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" | jq .

# 2. Create or update project capability host
curl -X PUT \
  "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.CognitiveServices/accounts/{accountName}/projects/{projectName}/capabilityHosts/{hostName}?api-version=2025-06-01" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "capabilityHostKind": "Agents",
      "threadStorageConnections": ["my-cosmos-connection"],
      "vectorStoreConnections": ["my-search-connection"],
      "storageConnections": ["my-blob-connection"],
      "aiServicesConnections": ["my-azure-openai-connection"]
    }
  }'
```

You must create the account capability host before the project one. The project host references connections by the names you assigned when creating the connection resources (often done via the Foundry portal or separate ARM templates).

## Five-Minute Diagnosis Checklist

Before opening Network Watcher, run these checks (adapted directly from the primary source):

- [ ] Account-level capability host exists.
- [ ] **Project-level** capability host exists (the one everyone misses).
- [ ] The project capability host references your Cosmos, AI Search, and Storage connections by the exact names you defined.
- [ ] Each referenced connection object has a valid `metadata.ResourceId` (full ARM path).
- [ ] `target` is the actual service endpoint URL and `metadata.ResourceId` is the ARM ID (they are not swapped).
- [ ] `authType` and `category` match the resource type.
- [ ] The Foundry resource and all dependent resources are in the same region and the VNet injection + private endpoints were configured at creation time.

If the above pass and you still see issues, *then* investigate DNS, private endpoint approval state, and subnet delegation.

## Common Gotchas Teams Hit

- Assuming "I configured it at the account, it should just work."
- Creating connections but forgetting to wire them into a project capability host.
- Using resource IDs where endpoint URLs are expected (or vice versa).
- Creating the project host before the account host (order matters).
- Forgetting that `aiServicesConnections` is optional unless you are bringing your own Azure OpenAI resource for model inference.
- Silent fallback: the agent runs without error but writes to Microsoft-managed storage instead of yours.

## Integration with the Rest of the Microsoft AI Stack

Capability hosts are not an isolated networking feature. They directly enable production patterns across the ecosystem:

- **Foundry IQ and agentic retrieval**: Private vector stores and thread history become the grounding layer for agents that use unified knowledge.
- **Agent Framework hosted agents**: When you deploy via azd or the portal, the same project capability host governs where the runtime stores state and files.
- **Copilot Studio agents backed by Foundry**: Agents built in Copilot Studio that use a Foundry project inherit the private BYO wiring, keeping enterprise data inside approved boundaries.
- **Entra Agent ID**: Your agents receive first-class identities. Combined with private networking and BYO resources, you get end-to-end identity + network + data control.
- **Observability and cost management**: Traces, evaluations, and token usage flow through your own storage, making it easier to apply existing monitoring and FinOps practices.
- **Model routing (the August 2026 model wave)**: You can route different workloads to GPT-5.6, Claude, Kimi, or MAI models while keeping the underlying private data fabric consistent.

This is the productivity win: one correctly wired project capability host lets every agent in that project safely use the enterprise data plane without per-agent network plumbing.

## What to Do This Week

1. **Audit existing projects.** Run the GET capabilityHosts calls for your key Foundry projects. Look for missing project hosts or empty connection lists.
2. **Create the missing project hosts.** Use the REST pattern above (or the equivalent portal/ARM experience once fully exposed). Start with one non-production project.
3. **Test end-to-end.** Deploy or update a sample agent that uses tool calls against your private Cosmos/Search/Storage. Verify that conversation history lands in your containers and vector indexes populate.
4. **Document the names.** Keep a small runbook of connection names and the exact capability host JSON for each project. This pays off the next time an architecture review asks "how do we know the agent only touches approved resources?"
5. **Combine with recent capabilities.** Pair the private wiring with the latest model routing decisions (GPT-5.6 for complex reasoning, Kimi for cost-sensitive coding agents) and the Agent Optimizer when you have evaluators and datasets ready.
6. **Monitor.** Use the Foundry dashboards plus your own resource metrics on the BYO stores. Look for write volume, query latency, and any fallback behavior.

If you are using the Azure Developer CLI with the Foundry extension, the `azd ai agent` commands can help scaffold and deploy; make sure your bicep or ARM templates also declare the capability hosts and connections.

## Bottom Line

Private-by-default agents are a core strength of Microsoft Foundry for regulated and high-trust environments. The capability host configuration is the small but critical piece that makes BYO resources actually work. When agents cannot reach your private data, resist the reflex to debug the network first. Check the project capability host, confirm the connection objects are complete and correctly referenced, and you will usually resolve the issue in minutes rather than days.

This pattern — account host first, project host second, explicit named connections with full metadata — is the reliable way to give your agents secure, governed access to the enterprise data they need while staying inside the Microsoft AI platform’s identity, observability, and routing controls.

## Sources

- Primary technical source: "The Hidden Reason Your Foundry Agent Can't Reach Any of Your Private (Bring-Your-Own) Resources" (Vishal Kalal, Microsoft Foundry Blog, August 7, 2026) — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/the-hidden-reason-your-foundry-agent-cant-reach-any-of-your-private-bring-your-o/4543619
- Related benchmark context: "From Good to Great: We Put Agent Optimizer to the Test in Microsoft Foundry" (Abi Komma et al., August 7, 2026)
- Microsoft Foundry Agent Service and private networking guidance (Microsoft Learn / Foundry portal documentation)
- Microsoft Agent Framework and Copilot Studio integration patterns for hosted agents
- Entra Agent ID and private endpoint best practices (Azure architecture center and Tech Community)

All claims are grounded in the cited August 2026 primary Microsoft sources and official documentation patterns. The configuration examples are synthesized from the public REST patterns shown in the source posts.

---

*This post is part of the daily Microsoft AI research series on The Clearinghouse Log. For the latest on Foundry Agent Service, model routing, and enterprise agent patterns, see the Microsoft Foundry Blog and Tech Community.*
