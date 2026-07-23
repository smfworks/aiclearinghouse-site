---
slug: "2026-07-23-foundry-toolboxes-user-delegation"
title: "Foundry Toolboxes and User Delegation: Auth-Free Agents That Act on Your Behalf"
excerpt: "On July 22, 2026 Microsoft showed how Foundry Toolboxes move OAuth, token isolation, and consent off the agent and onto a versioned MCP endpoint—so hosted agents can call private MCP servers and Work IQ as the signed-in user. Architecture, auth matrix, approval gates, and a production build path."
date: "2026-07-23"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-23-foundry-toolboxes-user-delegation"
categories: ["Microsoft", "AI Agents", "Azure AI", "Microsoft Foundry", "Identity"]
tags: ["Microsoft Foundry", "Toolboxes", "MCP", "User Delegation", "OAuth", "Work IQ", "Hosted Agents", "On-Behalf-Of", "Agent Identity", "RAI Guardrails"]
readTime: 14
image: "/images/blog/2026-07-23-foundry-toolboxes-user-delegation-hero.png"
---

# Foundry Toolboxes and User Delegation: Auth-Free Agents That Act on Your Behalf

**By Jeff | SMF Works | July 23, 2026**

---

## The moment the agent stops answering and starts acting

Most agent demos die the same way: the model is fine, the tools work in Postman, and then someone asks the production question—*whose identity is this call using?*

An internal employee agent that can summarize mail, check calendar, and hit a private orders MCP server cannot run as a shared service principal if you care about Microsoft 365 permissions, sensitivity labels, or per-user audit. It has to act as the **signed-in user**. That means On-Behalf-Of (OBO) token exchange, per-user token isolation, consent, refresh, and retries—for every tool, in every agent.

On **July 22, 2026**, Linda and Maria on the Microsoft Foundry Blog published *Building Agents that Act on Your Behalf with Toolboxes in Foundry*. The post is short and sharp: put auth on the **toolbox connection**, not in agent code; let Foundry acquire, exchange, and refresh tokens server-side; expose one **versioned MCP endpoint** that any compatible harness can consume. Combined with the Microsoft Learn guide *Create, test, and deploy a toolbox in Foundry* and the Hosted Agents / Work IQ docs, that is enough surface for a full production deep dive.

This Clearinghouse article is the field guide: why DIY user delegation fails at scale, how Toolboxes collapse that surface, the auth matrix, consumer vs developer endpoints, approval and RAI guardrails, and a concrete build path for hosted agents.

---

## Why DIY user delegation burns weeks before business logic

The July 22 post walks a realistic employee-agent scenario: private Entra-protected MCP for orders **plus** Microsoft’s managed **Work IQ** surface for Microsoft 365 context. Both require **user delegation**. If you implement that yourself, you typically rebuild three classes of infrastructure before the first line of domain logic lands:

| Failure mode | What goes wrong in practice |
| --- | --- |
| **Token isolation** | Cache keys must partition by user and tenant. A wrong key silently leases User A’s downstream access to User B. |
| **Consent and refresh** | Every API has its own consent failure shape, refresh path, and retry semantics. Agents that “sometimes work after login” are usually broken here. |
| **Duplication across agents** | Each new tool adds scopes, exchange paths, headers, and brokers. Hundreds of tools × many agents becomes a second product. |

That is not a model-quality problem. It is an **identity and tool lifecycle** problem. Enterprises already own gateways, vaults, and policy engines. What was missing was a developer experience that packages those controls into something **reusable, discoverable, and governed by default**.

---

## What a Foundry Toolbox is

Per Microsoft Learn, a toolbox is a **curated, centrally managed set of tools** exposed through a single **MCP-compatible endpoint**. Agents do not embed credentials. They connect to the endpoint; Foundry injects credentials, refreshes tokens, and enforces policy at runtime.

**Build** and **Consume** are available today:

| Pillar | Status | What it enables |
| --- | --- | --- |
| **Build** | Available | Select tools, configure authentication centrally, publish a reusable toolbox. |
| **Consume** | Available | Any MCP-compatible agent runtime, IDE, or custom client discovers and invokes tools through one endpoint. |

Important operational properties:

- **Single stable consumer URL** — agents keep one endpoint; tools behind it can change.
- **Versioning** — create and test a new version, then **promote** it to `default_version`. Agents on the consumer endpoint pick up the promotion without redeploy.
- **Open consumption surface** — Microsoft Agent Framework, LangGraph, Copilot SDK, hosted agents, and custom MCP clients all work against the same contract.
- **Hosted-agent guidance** — Learn’s Hosted Agents concept page is explicit: adding tools directly on the hosted agent definition is **not** supported; use toolboxes and connect via MCP client libraries.

That last point matters for production architecture. Hosted agents bring your container, Entra **agent identity**, sandbox, and protocols (Responses, Invocations, A2A). Toolboxes bring the **tool plane**. Keep those planes separate.

---

## Three steps: connection → toolbox version → agent

### Step 1 — Put auth on the connection (never in agent code)

Auth type is chosen when the project connection is created—portal, `azd`, or REST. For end-user delegation, the Foundry Blog shows OAuth2 on a remote-tool connection:

```bash
azd ai connection create <name-of-connection> \
  --kind remote-tool --target <tool-endpoint> \
  --auth-type oauth2 \
  --authorization-url <auth-url> \
  --token-url <token-url> \
  --client-id <oauth-client-id> \
  --client-secret <oauth-client-secret> \
  --scopes "<scope1> <scope2>"
```

The unified Foundry `azd` extension documents a broader `--auth-type` set, including `none`, `custom-keys`, `api-key`, `oauth2`, `user-entra-token`, `project-managed-identity`, and `agentic-identity`. Connections hold secrets; toolbox YAML/SDK references connections **by name**.

### Step 2 — Build the toolbox once

The July 22 sample composes a private MCP tool and Work IQ behind one version:

```python
version = project.toolboxes.create_version(
    name="employee-toolbox",
    description="Private orders MCP and Work IQ connected via user delegation auth",
    tools=[
        MCPToolboxTool(
            server_label="orders",
            server_url="https://orders-mcp.example.com/mcp",
            require_approval="never",
            project_connection_id="orders-mcp",
        ),
        WorkIQPreviewToolboxTool(
            name="work_iq",
            description="Reason over the caller's M365 mail, chats, meetings, docs.",
            project_connection_id="workiq-conn",
        ),
    ],
)
```

Learn’s Python path uses `AIProjectClient` and `create_toolbox_version` with typed tools (`MCPTool`, `WebSearchTool`, `ToolboxSearchPreviewTool`, and peers). Same idea: tools are declarations + connection IDs, not runtime secret loaders.

### Step 3 — Consume from a hosted agent (auth-free agent code)

```python
PROJECT_ENDPOINT = "<project-endpoint>"
CONSUMER_URL = f"{PROJECT_ENDPOINT}/toolboxes/employee-toolbox/mcp?api-version=v1"
toolbox = MCPStreamableHTTPTool(
    name="employee_toolbox",
    url=CONSUMER_URL,
)
agent = Agent(
    client=FoundryChatClient(project_endpoint=PROJECT_ENDPOINT, credential=credential),
    tools=[toolbox],
)
```

One user request can fan out to **both** the private MCP and Work IQ **on the end user’s behalf**. Adding a third tool is a new connection plus one toolbox line—the agent binary does not change.

Official samples walk Agent Framework **and** LangGraph consumption in one place:  
`https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/bring-your-own/responses/langgraph-toolbox-user-identity`

---

## Auth matrix: whose identity reaches the tool?

The July 22 post’s table is the control surface every platform team should pin:

| Auth type | Whose identity reaches the tool | Use it for |
| --- | --- | --- |
| **agentic-identity** | The agent’s own Entra identity | Service-to-service with **per-agent** audit |
| **project-managed-identity** | The project’s managed identity | Service-to-service without user context |
| **oauth2** | The end user (delegation, consent-once) | Work IQ, GitHub, and other user-context tools |
| **custom-keys** | A stored API key/header | Key-based SaaS; agent never sees the secret |
| **none** | Anonymous | Public servers (for example Microsoft Learn MCP) |

Hosted Agents docs reinforce the dual-mode story at the runtime boundary:

- **User-invoked / interactive** — when a user token is present, the platform supports OAuth 2.0 OBO so downstream calls can use the user’s delegated permissions under tenant policy.
- **Autonomous / background** — without a user token, the agent uses its dedicated Entra **agent identity**.

Toolboxes let you **choose per tool** which path applies, instead of forcing one identity model on the whole agent.

### Work IQ specifics (preview)

Work IQ is the intelligence layer that grounds agents in real-time Microsoft 365 context (mail, meetings, files, chats) with semantic understanding, honoring M365 permissions. In Foundry it is typically reached via A2A as a peer agent; authentication uses **OBO** so requests run as the signed-in user. Learn notes that **Bring your own Entra app** (OBO) is the supported path for Work IQ connections, and that callers need appropriate Microsoft 365 Copilot licensing. Treat Work IQ as a **delegation-class** tool: put it behind oauth2 / user Entra token connections, not a shared app-only key.

---

## Consumer endpoint vs developer endpoint

Learn documents two MCP URL patterns:

| Endpoint role | Behavior | When to use |
| --- | --- | --- |
| **Consumer** | Always serves `default_version` | Production agents; promote versions without redeploy |
| **Developer / version-specific** | Pins an explicit toolbox version | Pre-promotion testing and canaries |

Tip from Learn: connect agents to the **consumer** endpoint in production. Reserve version-specific URLs for validation. The first version of a new toolbox is auto-promoted to default; later promotions are an explicit platform operation.

That pairs cleanly with Hosted Agents lifecycle: you can ship a new toolbox version, validate on a developer URL from a non-prod agent, then promote—without rebuilding containers.

---

## Tool Search, skills, and the tool catalog problem

As toolboxes grow, stuffing every tool into the model context fails. Foundry’s **Tool Search** (`toolbox_search_preview`) supports **intent-based routing**: the agent discovers tools dynamically instead of loading the entire catalog every turn. Learn’s feature matrix marks Tool Search available across Python, REST, .NET, JavaScript, `azd`, and Foundry Toolkit.

Toolbox versions can also attach **skill references** (project skills as MCP resources), and can mix first-party tools: Web Search, Azure AI Search, Code Interpreter, File Search, OpenAPI, A2A, Fabric IQ, Browser Automation, and Work IQ (subject to region/model compatibility).

Practical rule: every tool gets a clear **description**; MCP tools use `server_label` namespacing (`{server_label}.{tool_name}`); unnamed duplicates of the same built-in type are rejected—name instances when you need more than one.

---

## Governance at the boundary: approvals, RAI, gateways

Because Foundry sits on the tool call path, policy can live **outside** agent code.

### `require_approval`

Toolbox MCP `tools/list` responses include `_meta.tool_configuration.require_approval`:

| Value | Expected agent behavior |
| --- | --- |
| `"always"` | Confirm with the user before every invocation |
| `"never"` | Invoke freely |

Critical detail from Learn: the MCP endpoint **does not** block `tools/call` for you. Enforcement is the **agent runtime’s** job. Production harnesses should build an approval map at startup from `tools/list` and constrain the loop (and system prompt) accordingly. That matches the Agent Framework harness model of standing approval policy—toolbox metadata is the catalog; the harness is the enforcer.

### RAI guardrails

Apply a guardrail (RAI policy) to a toolbox version so inputs and outputs are screened at the tool boundary. The Foundry Blog calls out the high-value case: untrusted MCP content should not smuggle prompt-injection back into the agent unfiltered.

### Bring-your-own gateway

Front MCP servers with a gateway (for example Azure API Management) for rate limits, logging, and network policy. That complements—not replaces—the Foundry AI Gateway control plane story for **model** traffic. Tools and models both need governed edges; Toolboxes are the tool edge.

### RBAC triad

Learn’s prerequisites are the identity checklist:

1. **Developer** — Foundry User (create/manage toolbox versions).  
2. **Agent identity** — Foundry User when a hosted agent calls tools at runtime.  
3. **End user** — Foundry User when OAuth / UserEntraToken flows proxy that user.

Miss any leg and “it works in my tenant admin account” becomes “it fails for everyone else.”

---

## Production build path (copy this checklist)

1. **Stand up the Foundry project** in a supported region; confirm tool-type region/model compatibility for MCP, Work IQ, Tool Search, etc.  
2. **Create project connections** with the correct auth type per downstream system—oauth2 / user-entra-token for user-context tools; agentic-identity or project-managed-identity for service paths; custom-keys for SaaS keys. Never embed secrets in agent images.  
3. **Publish toolbox v1** with descriptions, Tool Search if the catalog will grow, and explicit `require_approval` on high-blast tools. Auto-default is fine for first publish.  
4. **Validate on the developer (version) MCP URL** — `tools/list` shape, namespacing, approval meta, and a live `tools/call` for each auth class.  
5. **Wire the hosted agent** to the **consumer** MCP URL via `MCPStreamableHTTPTool` (Agent Framework) or equivalent MCP client. Prefer Responses protocol for conversational agents.  
6. **RBAC** — assign Foundry User to developer, agent identity, and OAuth end-user principals as required.  
7. **Guardrails** — attach RAI policy to the toolbox version; front untrusted MCP with APIM where needed.  
8. **Promote** new toolbox versions after canary; leave agent code and consumer URL unchanged.  
9. **Observe** — Hosted Agents + Application Insights agents view for runs; pair with Azure Monitor for stack-wide latency and dependency failures.  
10. **License and data boundary review** — Work IQ and third-party MCP may cross compliance boundaries; document approvals and M365 Copilot license requirements.

---

## How this fits the rest of the July Foundry stack

Toolboxes are not a replacement for the other production pieces you have been shipping against this month—they are the **tool plane** that makes those pieces usable with real identity:

| Capability | Role next to Toolboxes |
| --- | --- |
| **Hosted Agents** | Runtime/sandbox + agent identity; tools come from toolbox MCP, not inline definition |
| **Agent Framework harness** (2026-07-22) | Planning, compaction, skills, approvals, OTel—consume toolbox as MCP tools |
| **AI Gateway control plane** (2026-07-20) | Govern **model** TPM/routing via APIM; toolbox + APIM-fronted MCP govern **tools** |
| **Agent Optimizer** (2026-07-18) | Closed-loop quality on agent behavior once tools are stable and observable |
| **Work IQ** | First-class M365 grounding tool under user delegation |
| **Foundry IQ / knowledge** | Knowledge plane; still connect through governed tool patterns |

If last week’s question was “how do we run the loop?”, this week’s question is “how do we call enterprise tools **as the right principal** without rewriting every agent?” Toolboxes are Microsoft’s answer.

---

## What to do this week

1. Pick one agent that already needs **user context** (mail, calendar, or a private Entra MCP).  
2. Move its tools into a toolbox with **oauth2 / user-entra-token** connections—leave agent code auth-free.  
3. Point a non-prod hosted agent at the **developer** MCP URL; verify isolation with two test users.  
4. Promote to consumer default only after approval maps and RAI policy are in place.  
5. Add Tool Search before the catalog exceeds what you want in the system prompt.

Primary sources to keep open while you build:

- [Building Agents that Act on Your Behalf with Toolboxes in Foundry](https://devblogs.microsoft.com/foundry/building-agents-that-act-on-your-behalf-with-toolboxes-in-foundry/) (July 22, 2026)  
- [Create, test, and deploy a toolbox in Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox)  
- [Hosted agents in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)  
- [Connect agents to Microsoft 365 with Work IQ (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/work-iq)  
- [Entra On-Behalf-Of flow](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-on-behalf-of-flow)  
- [Foundry samples — toolbox user identity](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/bring-your-own/responses/langgraph-toolbox-user-identity)

---

## Bottom line

Production agents that **act** need identity discipline as much as model quality. Foundry Toolboxes move OAuth, OBO, token isolation, and consent onto a **versioned MCP control plane**, so hosted agents and open harnesses stay auth-free while still calling private MCP servers and Work IQ **as the signed-in user**. Build connections once, version the toolbox, enforce approvals and RAI at the boundary, and promote without redeploying agents.

That is how you scale from a working demo to an enterprise tool fabric—inside the Microsoft Foundry ecosystem, with identity you can audit.
