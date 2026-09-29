---
slug: "2026-09-28-foundry-hosted-agent-egress-rai"
title: "A hosted-agent tool list is not a network boundary"
excerpt: "Foundry's 24 September egress walkthrough puts outbound FQDN rules on the RAI policy, not in your HTTP wrapper. Audit first, then enforce — and treat a 200 from an unattached policy as a miss, not a pass."
date: "2026-09-28"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-28-foundry-hosted-agent-egress-rai"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Microsoft Foundry", "Hosted Agents", "RAI", "network egress", "guardrails", "Agent Service", "Application Insights"]
readTime: 13
image: "/images/blog/2026-09-28-foundry-hosted-agent-egress-rai-hero.png"
---

A tool registration is not an outbound firewall. Muzz Imam's [24 September Foundry DevBlog](https://devblogs.microsoft.com/foundry/egress-controls-hosted-agent) puts that sentence in operator language: keep destination rules **outside** the agent code, observe real calls, then test an explicit outbound boundary. The policy lives on the Cognitive Services RAI resource. You attach it to a **hosted-agent version**. You do not sprinkle hostname checks through every `requests.get`.

This is a field guide from Microsoft primaries fetched on 28 September 2026. It is not a Foundry tenant we exercised this morning. Yesterday's Clearinghouse post already covered [voice WebSockets, crash-resilient background work, and session isolation](https://www.smfclearinghouse.com/blog/2026-09-27-foundry-voice-ws-resilient-isolation/). Egress was a one-line mention in Tina Schuchman's Azure Blog umbrella. It is the unpublished how-to.

**Preview, on the lede:** both the DevBlog and Microsoft Learn say network egress controls are **not GA**, have **no preview SLA**, and are **not intended for production**. Learn adds: hosted agents only; tooling only; you own the data-handling practices of any endpoint that receives traffic.

## What the 24 September pages actually said

The Foundry DevBlog index still lists Imam's egress post and Linda Li's routines post as the latest dated entries (both 24 Sep). No newer Foundry DevBlog showed up on this morning's fetch.

| Surface | Where it is documented | Operator takeaway |
| --- | --- | --- |
| Network egress on hosted agents | DevBlog 24 Sep + Learn [Add guardrails to a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails) | Outbound FQDN rules on the **same RAI policy** you already use for content safety |
| Content safety vs network | Learn: two kinds of guardrails, two fields | `properties.mode` is content safety. `properties.egressPolicy.mode` is network |
| Audit then Enforce | DevBlog walkthrough + Learn mode table | Audit logs would-deny. Enforce returns proxy **HTTP 403**. Transform/Rewrite still run in Audit |
| Attach | `RaiConfig(rai_policy_name=<full ARM ID>)` | Bare policy name is the wrong handle |
| Observability | Learn traces + Kusto | Span and App Insights message: `Network egress decision` |
| Sample | `foundry-samples` tree `18-egress-control` | Allow, Deny, Transform, Rewrite, Audit, wildcard, rule order |

Schuchman's [24 September Azure Blog](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/) is the product umbrella: allow/deny, header modification, redirect, audit mode, decisions emitted to Application Insights. Imam and Learn are the contract.

## Two planes, one RAI object

Learn is explicit that content safety screens **prompts and responses**. Network egress governs **outbound connections the hosted agent makes**. You store both on one RAI policy and attach that policy once.

The ARM shape Imam publishes for the walkthrough is the one to keep in the runbook:

- `basePolicyName`: `Microsoft.DefaultV2`
- `mode`: `Blocking` (content-safety setting)
- `egressPolicy.mode`: start `Audit`, later `Enforced` (Learn also writes **Enforce** in the portal table — same idea)
- `egressPolicy.defaultAction`: `Deny` for an allow list
- `rules[]`: `ruleType: Fqdn`, `match.host`, `action.actionType`

Create it with ARM API version **`2026-05-15-preview`**. Imam's Bash uses `az rest` PUT against:

`https://management.azure.com${RAI_POLICY_ID}?api-version=2026-05-15-preview`

Export the **full** ID:

`/subscriptions/.../resourceGroups/.../providers/Microsoft.CognitiveServices/accounts/<account>/raiPolicies/<policy-name>`

Then GET it back **before** you create an agent version. Imam is blunt: that GET verifies stored configuration, not runtime enforcement. The probes do.

Do **not** overwrite an existing mixed content-safety/network policy with the abbreviated invoice JSON. Use a new resource for the exercise.

## Attach is a version event

Python, from the DevBlog:

- `azure-ai-projects>=2.2.0`
- `AIProjectClient(..., allow_preview=True)`
- `HostedAgentDefinition` with `cpu="1"`, `memory="2Gi"`, container image, `ProtocolVersionRecord(protocol=AgentEndpointProtocol.RESPONSES, version="2.0.0")`
- `rai_config=RaiConfig(rai_policy_name=os.environ["RAI_POLICY_ID"])`

Learn's attach surface is the same object for azd, Python, REST, .NET, and JavaScript. azd does not expose `rai_config` in `azure.yaml`; it uses a `policies` list with `type: rai_policy` and maps it at deploy time. azd AI agent extension version on the Learn page: **1.0.0-beta.12 or later**.

Read the version back. Confirm the policy reference. Then send traffic at **that version**. An authoring API returning an object is not evidence of an outbound boundary.

Allowing a destination does not grant permission at that destination. The application still authenticates. Imam separates three questions for the invoice agent: right destination, authorized caller, appropriate data. Egress answers only the first.

## The only test that counts is two probes from inside the sandbox

Imam's diagnostic is a function registered **in the test image**, invoked through the deployed Responses endpoint. Workstation Python does not test hosted-agent egress. Managed hosted-agent containers do not give you an interactive shell for this walkthrough.

Expected results **for healthy, controlled endpoints** — the DevBlog labels this table as expected results, not captured lab output:

| Probe | Audit | Enforced |
| --- | --- | --- |
| Approved finance host | 200; request reaches the endpoint | 200; request reaches the endpoint |
| Unapproved test host | 200; would-deny evidence | Proxy **403**; **no request at the endpoint** |

A destination can also return 403 on its own. DNS or TLS failure is not a successful denial. Correlate the policy decision with the destination's receipt log.

Keep TLS verification **on**. Use the runtime CA bundle (`REQUESTS_CA_BUNDLE` in the sample probe). Do not copy that bundle into the image. Do not disable verification to make the test pass.

Create a **new** policy resource for Enforced (`invoice-egress-enforced` in the walkthrough) and a **new** agent version. Learn: running sandboxes **do not reload policy changes**. Imam: do not assume an in-place edit instantly changes every running session.

## Fail-open and fail-closed are different bugs

This is the paragraph that should sit next to the happy-path table.

**Content safety can fail open.** Learn's warning: do not rely on deploy-time validation to catch a bad policy ID. On many subscriptions an agent that references a policy that does not exist is created successfully and reports **active**, but no content filtering is applied — harmful prompts reach the agent. Confirm the policy exists on the account, then test.

Omit `rai_config` and the agent runs **without** a content-safety guardrail. Include `rai_config` but omit `rai_policy_name` and the platform applies **`Microsoft.DefaultV2`**. Always pass the full ARM ID.

**Protocol gaps for content safety** (Learn):

| Protocol | What you set | What happens if you don't |
| --- | --- | --- |
| `responses` | `rai_policy_name` | Platform knows the shapes |
| `invocations` | `rai_policy_name` **and** `invocations_moderation` | Policy without moderation is **inert**. HTTP **200**, unfiltered. Easy to miss. Needs `azure-ai-projects>=2.7.0` |
| `invocations_ws` | — | Content safety moderation **is not available** |

Yesterday's voice post is the `invocations_ws` protocol guide. Do not expect this RAI content-safety plane to screen those frames.

**Egress evaluation is fail-closed.** Learn: if the policy cannot be evaluated, the request is denied. Foundational platform domains are auto-allow-listed; a Deny default is not a claim that every runtime connection is blocked. Imam says the same.

First match wins. Wildcards such as `*.contoso.com` are supported. Maximum **480** egress rules per policy (Allow, Deny, Transform, Rewrite combined). Default `Deny` is the recommended allow-list posture.

## Audit is not a dry run for Transform and Rewrite

Learn and Imam agree: Audit changes **Deny** behavior only. Transform and Rewrite **still execute** in Audit. Header edits and redirects are live while you think you are only observing.

Rule order is load-bearing. An Allow that matches before a Transform means the later header edit does not run. Put the required behavior on the matching rule. Test what the destination actually receives.

Transform/Rewrite header ops (Learn): `Set`, `Insert`, `Remove`. Static values and **managed identity** `valueRef` are supported when the deployed agent's `instance_identity.principal_id` has RBAC on the target resource. **Secret value references are not supported during preview.** The portal still shows a Secret reference control; Learn says do not use it.

Do not put credentials in a static header.

## TLS: the proxy CA is infrastructure, not an app secret

To inspect HTTPS, the hosted-agent runtime injects the egress proxy CA into the sandbox trust bundle. Learn: it can differ across clusters and regions, and it rotates (currently about **every 30 days**). Do not pin subject, public key, thumbprint, or file contents. Do not persist it into the image, a volume, or source control. Long-running processes may need to reload TLS or restart through a rotation.

Runtime env vars already in the sandbox:

| Variable | Clients |
| --- | --- |
| `SSL_CERT_FILE` | OpenSSL-style |
| `REQUESTS_CA_BUNDLE` | Python `requests` |
| `GRPC_DEFAULT_SSL_ROOTS_FILE_PATH` | gRPC |
| `NODE_EXTRA_CA_CERTS` | Node, read at process start |

If you must merge enterprise roots, Learn's pattern is build a **temporary** bundle at process start from the current `$SSL_CERT_FILE`.

## Proof is a span named Network egress decision

Playground path (Learn): Operate the invocation → Trajectories → expand until the span **Network egress decision**. Fields: Decision, Reason, Matched rule, Rule source, Enforcement, Destination, Default action. Allowed = success status; denied = failure status.

Application Insights (Learn):

```kusto
traces
| where timestamp > ago(1h)
| where message == "Network egress decision"
```

Imam: do not treat a **missing** event as proof that a call was allowed.

A blocked call is HTTP 403 to the agent's network client. Policy internals are not exposed to end users. The agent handles the error with its own logic.

## How this fits the rest of the stack

This is **not** the July BYO VNet playbook. [Standard Agents on a BYO VNet](https://www.smfclearinghouse.com/blog/2026-07-25-foundry-standard-agents-byovnet-networking-playbook/) is inbound private networking, private DNS, subnet math. Egress RAI is outbound FQDN policy **inside the Foundry-managed sandbox**. Learn: it complements Azure Firewall; it does not replace it; it does not delegate to a customer-managed firewall; it is not centrally enforced through Azure Policy.

This is **not** Toolbox user-delegation. Imam points at the Toolbox article for **who** the agent acts as. Egress is **where** the process may connect. Verify both.

This is **not** Insights (Rothney, Tech Community, 24 Sep). Complementary observability. Schuchman's October AI Gateway APIM tier is preview-coming, not shipped in these pages.

Learn lists as not available yet: Azure service tags, IP ranges, MCP tool policies, PII/DLP inspection, custom webhook hooks. Scope the walkthrough to hosted-agent HTTP/HTTPS. Do not extrapolate to prompt-based agents.

## What to do with one agent this week

If you have a test hosted agent and permission to write account-level RAI policies:

1. Create a **new** RAI policy in **Audit** / default **Deny** with two exact hostnames you own. Leave the unapproved probe host off the list.
2. GET the policy. Confirm `egressPolicy.mode`, `defaultAction`, and both hosts.
3. Attach the **full ARM ID** on a new hosted-agent version (`responses` 2.0.0). Read the version back.
4. Probe **from the sandbox**: allowed URL and blocked URL, `allow_redirects=False`, TLS verify via `REQUESTS_CA_BUNDLE`.
5. Confirm App Insights / Trajectories shows `Network egress decision` for both. Do not pass on a missing span.
6. Clone the policy to **Enforced**, new version, new session. Approved host still 200 **and** hits the endpoint. Unapproved host is proxy 403 **and** the endpoint log is empty.
7. If you use Transform or Rewrite, test them in Audit knowing they **already mutate** traffic.

No tenant this week: keep the runbook — three questions, two policy fields, two versions, two probes, one Kusto line. Sample both pages point at: [foundry-samples `18-egress-control`](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/18-egress-control). Follow current Learn TLS guidance.

Imam's release check: finance lookups keep working, and the test upload endpoint receives nothing. Stronger than the model saying it followed an instruction.

## Sources

Fetched 28 September 2026 (America/New_York):

- [Control where your hosted agent connects with network egress in Foundry Agent Service](https://devblogs.microsoft.com/foundry/egress-controls-hosted-agent) — Muzz Imam, 24 Sep 2026
- [Add guardrails to a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails) — Microsoft Learn
- [Ship agents faster with expanded model choice, voice agents, and continuous optimization](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/) — Tina Schuchman, 24 Sep 2026
- [Insights in Foundry Turns Agent Traces into Action](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/insights-in-foundry-turns-agent-traces-into-action/4559634) — katelynrothney, 24 Sep 2026
- [Use Insights in Foundry (preview)](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/agent-insights) — Microsoft Learn
- [Microsoft Foundry Blog index](https://devblogs.microsoft.com/foundry/) — latest dated posts still 24 Sep
- [Hosted-agent egress control sample](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/18-egress-control)

Not claimed this run: no RAI policy created, no Audit/Enforced probes captured, no App Insights query executed against a live project. DevBlog probe table is the author's expected results. Routines "GA" vs Learn preview is a different post.
