---
slug: "2026-09-27-foundry-voice-ws-resilient-isolation"
title: "A Foundry hosted session is not a conversation"
excerpt: "This week's Microsoft Foundry primaries split three lifetimes that teams keep collapsing: WebSocket voice, crash-resilient background work, and user identity versus the VM sandbox. The session ID is the filesystem, not the chat."
date: "2026-09-27"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-27-foundry-voice-ws-resilient-isolation"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Microsoft Foundry", "Hosted Agents", "Voice Agents", "invocations_ws", "Agent Framework", "session isolation", "long-running agents", "GPT-6"]
readTime: 14
image: "/images/blog/2026-09-27-foundry-voice-ws-resilient-isolation-hero.png"
---

Microsoft's Agent Framework blog published a sentence on 22 September 2026 that should sit on the first page of every hosted-agent runbook: **a Foundry hosted session is not a conversation.** A conversation is message and tool-call history. A hosted session is sandbox compute and persisted files. Two days later, Tina Schuchman's [Azure Blog](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/) put voice agents and long-running resilience on the same Foundry foundation as the GPT-6 family. If you treat those as one "session" knob, you will reconnect a voice socket to the wrong filesystem, or assume a crash replayed a workflow it only reentered.

This post is a field guide from Microsoft primaries fetched on 27 September 2026. It is not a Foundry tenant we exercised this morning. The claims below are from the Azure Blog, Microsoft Learn, and the Agent Framework DevBlog — plus a grep of this site's `content/blog` tree, which has no prior deep-dive on `invocations_ws`, `resilient_background`, or the two isolation controls.

## What actually moved this week

Schuchman's 24 September post is the umbrella. The Learn pages are the contract.

| Surface | Status in the primaries | Operator takeaway |
| --- | --- | --- |
| GPT-6 Sol and GPT-6 Luna, Claude Opus 5.5 in Foundry | Available in Foundry this week (Azure Blog, 24 Sep) | Model choice is continuous; evaluate against your traces, do not freeze architecture on one model |
| Voice agents | Public preview as a Foundry Agent Service agent type (Azure Blog); hosted path is `invocations_ws` (Learn) | Same container can also expose `/responses` and `/invocations` |
| Long-running resilience | Public preview (Azure Blog + Learn) | Background work and crash recovery are **different** opt-ins |
| Insights in Foundry | Public preview (Azure Blog) | Production traces → recurring issues, not a dashboard you already had |
| Rubric evaluator, traces-to-dataset, Agent Optimizer | "Generally available later this month" (Azure Blog, 24 Sep) | Do not write GA into a runbook yet |
| AI Gateway tier in APIM | Preview support coming in October (Azure Blog) | Hub-and-spoke model governance, not a replacement for today's APIM integration |
| Hosted-agent isolation APIs | 22 Sep Agent Framework DevBlog | User identity and `agent_session_id` are independent |

Xia Song's [22 September Copilot post](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/more-models-one-copilot/4559035) says Claude Opus 5.5 and GPT-6 Sol are rolling out across Word, Excel, PowerPoint, Chat, Cowork, and Copilot Studio, with Work IQ still grounding responses in org files, meetings, chats, and business data. Availability varies by license, access, and region.

Naomi Moneypenny's [22 September Foundry models post](https://azure.microsoft.com/en-us/blog/gpt-6-astra-sol-and-luna-for-production-agents-in-microsoft-foundry/) is the routing table: start demanding work on GPT-6 Astra; Sol for general production agents; Luna for high-volume extraction, summarization, and routing. Global Standard short-context input list prices in that post: Astra **$10**, Sol **$2**, Luna **$0.10** per 1M tokens. Standard is listed across 28 Global regions plus US and EU Data Zones; Provisioned Throughput for Astra and Sol; Priority Processing for Sol.

## Voice is a protocol, not a toggle

[Build a voice agent with hosted agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/build-voice-agent) is the how-to that matches the Azure Blog's "voice becomes a native part of the agent foundation" claim. Hosted agents support real-time voice through **`invocations_ws`**. The container exposes `GET /invocations_ws` with a WebSocket upgrade. The public URL is:

`wss://<account>.services.ai.azure.com/api/projects/<project>/agents/<agent>/endpoint/protocols/invocations_ws?api-version=v1&agent_session_id=<session-id>`

Facts from that Learn page that change design, not marketing copy:

- The platform **does not parse, transform, or buffer frames** at the application layer. Text and binary frames are raw-byte relay. 20 ms PCM at 16 kHz mono is about 640 bytes. The proxy **rejects frames over 1 MB** with close code `1009`.
- Callers present a **Microsoft Entra bearer token** on `Authorization` during the upgrade. APIM and Agent Service validate it. **The container does not see that header.** Do not accept an `authorization` query parameter.
- Individual WebSocket connections are capped at about **30 minutes**. Platform drain sends close code **`1001` (going away)**. Clients must reconnect with the **same `agent_session_id`**. The sandbox persists; **the platform does not replay missed frames**.
- Session resolution inside the container: `FOUNDRY_AGENT_SESSION_ID`, else the query parameter, else generate a UUID.
- Declare the protocol on the agent version with `ProtocolVersionRecord(protocol=AgentEndpointProtocol.INVOCATIONS_WS, version="2.0.0")`. You can declare it alone or with `responses` and `invocations`.
- Voice recommendation: at least **1 vCPU / 2 GiB**; sandboxes go up to **2 vCPU / 4 GiB**.
- Validated sample frameworks: Microsoft Voice Live, Pipecat, LiveKit Agents. Hosted agents do **not** provide a managed WebRTC media service, TURN, or SFU. Use `invocations_ws` as authenticated signaling if you run WebRTC yourself.
- Idle timeout for the sandbox is **2–60 minutes, 15-minute default** on this page's limits table (hosted-agents concepts also documents **5–60 minutes**, same default). Compute deprovisions; session state persists.
- Python handler surface: `@app.ws_handler` on `InvocationsAgentServerHost`, same host as `@app.invocation_handler` for HTTP `/invocations`.

Telephony is a bridge, not a Foundry SIP stack. Learn says use a provider such as Azure Communication Services or Twilio to bridge PSTN onto `invocations_ws`.

If you already shipped GPT-transcribe / GPT-live-transcribe as a speech endpoint, that is a different product surface. This week's voice agent is **your container on the hosted-agent protocol**, with Entra on the upgrade and session identity on the query string.

## Crash recovery is off until you opt in

[Resilience for long-running hosted agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/long-running-agent-resilience) (preview) splits three capabilities that product language often mashes together:

| Capability | What it provides | What it does not provide |
| --- | --- | --- |
| Background execution | Work continues after the original HTTP connection closes; clients poll or reconnect | Recovery after the **process** that owns the work stops |
| Resilient execution | Durable work identity, persisted input, lease-based recovery, handler reentry | Automatic preservation of every intermediate app state or side effect |
| Stream replay | Retained events from a cursor for reconnecting clients | A checkpoint of the agent's internal workflow |

Recovery **reenters the handler from the beginning**. It is not deterministic replay. It does not restore local variables. Your handler must use durable checkpoints or watermarks.

The how-to [Recover long-running work after a crash](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/recover-long-running-work) is explicit that crash recovery is **off by default**:

```python
from azure.ai.agentserver.responses import ResponsesAgentServerHost, ResponsesServerOptions
app = ResponsesAgentServerHost(
    options=ResponsesServerOptions(resilient_background=True),
)
```

Recovery applies only to Responses that are **stored and background**: `store=true` and `background=true`. Without the opt-in, a crashed background response is marked `failed` with `error.code="server_error"` and the handler is **not** reinvoked. Foreground (`background=false`) responses are always marked failed on crash because the client connection is already gone.

On the Invocations / task path, declaring `@task` is not enough. Call `set_resilient_tasks_enabled(True)` **before host startup**. On reentry, branch on `context.is_recovery` (Responses) or `ctx.entry_mode == "recovered"` (tasks). Fence non-idempotent side effects by flushing a watermark **before** the email or charge, then clearing it after commit. If shutdown cannot finish, `exit_for_recovery()` leaves the record in progress instead of writing a terminal state.

Learn marks this preview: no SLA, not recommended for production workloads. That is the honest ship status.

## Two isolation knobs, not one

Roger Barreto and Tao Chen's [22 September Agent Framework post](https://devblogs.microsoft.com/agent-framework/foundry-hosted-agent-isolation-with-microsoft-agent-framework/) is the missing control-plane diagram.

| Control | Represents | Choices |
| --- | --- | --- |
| User isolation | Whose data may be used | Caller's Microsoft Entra identity, or a delegated identity from a trusted middle tier |
| Foundry hosted session isolation | Where code and files live | Session created on first request, or an `agent_session_id` the application supplies |

The delegated identity is **independent** of the session ID. Separate user conversations can share a sandbox or get separate sandboxes. In a pooled design, a middle tier maps users onto a bounded set of session IDs, sends the delegated identity on each request, and Foundry keeps **response chains private by user** while the **sandbox filesystem remains shared**. Application-owned files, database rows, and caches then partition on **both** `agent_session_id` and user identity.

.NET stores the delegated identity on `AgentSession` (`CreateFoundryHostedAgentSessionAsync(..., userIdentity:)`). Python currently forwards `x-ms-user-identity` on each call. Agent Framework does **not** create the remote Foundry hosted session; it stores the ID and sends it. Hosted Agents themselves are GA; the AgentServer SDKs and Agent Framework Foundry hosting packages for .NET and Python are still pre-release — the DevBlog says so in the same post.

[Hosted agents concepts](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents) matches that split: session ID is `$HOME` and `/files`; conversation ID is message history. Idle timeout **5–60 minutes, default 15**. Permanent session delete after **30 days** of inactivity. Disk budget up to **20 GiB at 1 vCPU or larger**, about 20% reserved for the platform. Scaling is **per session, not per replica**. CPU and memory on the agent version describe one sandbox; oversizing multiplies by concurrency.

## How the three lifetimes compose

Put the three primaries on one operator table.

| If you need… | Bind | Do not assume |
| --- | --- | --- |
| Microphone in, speech out | `invocations_ws` + `agent_session_id` on the upgrade | The 30-minute socket is the session. Reconnect; sandbox stays; frames do not replay |
| A research job that outlives the HTTP client | Responses `background=true` **and** `store=true` | Background mode recovers a crashed process. It does not, unless `resilient_background=True` |
| A crash that must resume | Opt-in + watermarks / `context.is_recovery` | Recovery restores your in-memory plan. It reenters from the start |
| Per-user private chat on a shared pool | Delegated user identity **and** a chosen `agent_session_id` | One ID does both jobs |
| Files uploaded before the first model call | Application-created session via the project client | First-request auto-session is early enough for pre-upload |

Voice reconnects and crash recovery both hang on `agent_session_id`, for opposite reasons. Voice uses it so the **same sandbox** is still there after `1001`. Resilience uses durable work identity so a **later process** can reclaim a lease. Mixing those without a watermark is how you double-send an email after a voice reconnect that also restarted a handler.

## What to do this week

1. **Name three IDs:** conversation (history), `agent_session_id` (filesystem + VM), work/response id (durable attempt). If a diagram has one box labeled "session," redraw it.
2. **Voice:** declare `invocations_ws` `2.0.0`, size ≥ 1 vCPU / 2 GiB, reconnect on `1001` with the same session id. Do not put API keys in the container.
3. **Long jobs:** `resilient_background` only for stored background Responses, or `set_resilient_tasks_enabled(True)` before startup. Add a recovered-entry branch and a side-effect fence. Keep the preview disclaimer.
4. **Middle-tier auth:** use `x-ms-user-identity` / `userIdentity`; pick pooling vs per-user sandboxes as a cost decision. Billing is CPU+memory of **active** sessions.

Preview stays preview. Hosted Agents GA does not promote the voice WebSocket path, crash recovery, or the hosting SDK packages.

## Sources

- Tina Schuchman, [Ship agents faster with expanded model choice, voice agents, and continuous optimization](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/), Azure Blog, 24 September 2026
- Naomi Moneypenny, [GPT-6 Astra, Sol, and Luna for production agents in Microsoft Foundry](https://azure.microsoft.com/en-us/blog/gpt-6-astra-sol-and-luna-for-production-agents-in-microsoft-foundry/), Azure Blog, 22 September 2026
- Xia Song, [More Models, One Copilot](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/more-models-one-copilot/4559035), 22 September 2026
- Roger Barreto and Tao Chen, [Foundry hosted agent isolation with Microsoft Agent Framework](https://devblogs.microsoft.com/agent-framework/foundry-hosted-agent-isolation-with-microsoft-agent-framework/), 22 September 2026
- Microsoft Learn: [Build a voice agent with hosted agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/build-voice-agent)
- Microsoft Learn: [Resilience for long-running hosted agents (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/long-running-agent-resilience)
- Microsoft Learn: [Recover long-running work after a crash (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/recover-long-running-work)
- Microsoft Learn: [Hosted agents in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)

Which of those three IDs is your current hosted agent actually binding on reconnect — conversation, sandbox, or durable work — and what happens to a side effect if the answer is "we used one string for all three"?
