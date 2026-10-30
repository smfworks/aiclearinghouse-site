---
slug: "2026-10-30-store-the-sip-password-on-the-connection"
title: "Store the SIP password on the connection"
excerpt: "If a phone call should reach a Foundry voice agent, create the SipInbound connection first. The password stays there. The URL Foundry returns is what the trunk dials."
date: "2026-10-30"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-30-store-the-sip-password-on-the-connection"
categories: ["Microsoft", "Azure", "AI Agents"]
tags: ["Microsoft Foundry", "SIP", "voice agents", "how-to"]
readTime: 10
image: "/images/blog/2026-10-30-store-the-sip-password-on-the-connection-hero.png"
---

If a phone call should reach a Foundry voice agent, create the inbound connection before you bind the trunk. The password lives on that connection. The URL Foundry hands back is what the trunk dials.

I fetched the [Tech Community post](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/bring-your-own-telephony-to-voice-agents-via-sip/4562702) and the [Learn how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/voice-agent-telephony-channels-sip) this morning. The blog `postTime` is `2026-10-29T09:20:09.775-07:00`. JSON-LD `datePublished` is `10/29/2026, 4:20:09 PM` with no timezone on that string. `article:modified_time` is `2026-10-28T19:55:37.858-07:00`. JSON-LD `dateModified` is `10/29/2026, 2:55:37 AM`, also with no timezone. The footer says Updated Oct 28, 2026, Version 1.0. Keep those clocks. Do not fold them into one instant.

The Learn page is the procedure. Its `ms.date` is `2026-10-15T00:00:00Z` and `updated_at` is `2026-10-29T06:05:00Z`. That refresh is earlier the same UTC day than the blog `postTime`. Use Learn for the clicks and the field names. Use the blog as the announcement that the door is open.

SIP, the Session Initiation Protocol, is the signaling your existing phone system already uses to set up a call. Foundry's name for the inbound credential object is a `SipInbound` project connection. The binding is the later step that points one of those connections at one voice agent.

## Check the region, then save a voice agent

The blog does not print a region list. Learn does. SIP connection currently requires a Foundry resource in East US 2, France Central, Southeast Asia, Sweden Central, West US, or West US 2. If the resource is somewhere else, stop. Do not bind a trunk and hope the call finds the agent.

Learn also wants a saved voice agent in that project, one that already passes testing. For outbound calls, publish the agent first. The link text on that sentence says "Quickstart: Create a voice-first prompt agent." The [quickstart page](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-voice-agent) I opened is titled "Quickstart: Create a voice-based prompt agent." Its `ms.date` is `2026-10-06T00:00:00Z` and `updated_at` is `2026-10-21T17:17:00Z`. Follow the page you opened. Do not rename it to match the link text.

On that quickstart, the portal label is Interaction mode, and you select Voice. You can't change the interaction mode after you create the agent. A text agent does not become a voice agent on a later save. Create another agent and select Voice. The blog's words are "select Voice as the agent type." Same door, different label. Use the label on the screen you are looking at.

The trunk or session border controller has to support SIP over TLS. For outbound calls, Learn also wants non-ICE SDES-SRTP, written there as `srtp`. The blog does not print either requirement. If you are only taking inbound calls, do not add the outbound SRTP sentence to that checklist.

Direct SIP does not need an Azure Communication Services resource, a Teams resource account, a Twilio account, or an Event Grid subscription. That note is on Learn. The blog does not say it. You still need the Foundry User role on the project, plus permission to update the agent and its channels, manage project connections, and create or update telephony bindings. The role rename note on the same page is real: you might still see Azure AI User where the page now says Foundry User. The role IDs did not change.

## Put the password on SipInbound

Create the connection before you open the binding screen.

Inbound category is `SipInbound`. Outbound category is `SipOutbound`. Create both only if the agent has to receive calls and place them. Store the SIP credentials in the project connection. Do not put them on the binding, and do not put them on the call-job request. That sentence is Learn. The blog's portal step says to add the SIP trunk "using the same credentials provided by your SIP trunk provider" on the Direct SIP screen, then bind it. Those are not the same instruction. Follow Learn for where the secret sits.

Set `authType` to `CustomKeys`. The mode is `metadata.sip_auth_type`, and that name is case-insensitive. If you omit it, the connection uses Digest authentication. Digest means username and password. Put nonempty values in `credentials.keys.username` and `credentials.keys.password`.

A credential key named `sip_auth_type` does not select the mode. I want that one to be easy to repeat. The mode lives in metadata. A key with the same name, sitting next to the password, is ignored for this choice.

Source IP access control is the other mode. Set `metadata.sip_auth_type` to `ip_acl` and put up to 64 IPv4 or IPv6 addresses or CIDR ranges in `credentials.keys.source_cidrs`, comma-separated. Foundry trims each entry. An empty `source_cidrs` string allows traffic from all source IP addresses. Leave it empty only when that is the access you want. Whitespace-only values, empty entries, leading or trailing commas, scoped IPv6 addresses, and IPv4-mapped IPv6 addresses are not supported.

When you update a connection, include its current `target`. If you leave `target` off, the client can replace it with a default.

For a `SipOutbound` connection you can also set `metadata.enabled_codecs` to an ordered list. Supported names are `g722`, `pcmu`, `pcma`, `opus`, and `amr-wb`. If you omit the setting or leave it blank, the runtime uses `g722,pcmu,pcma`. That codec sentence is on the connection, not on the binding.

## Bind the trunk, then copy the URL

Both pages print the same inbound path. The caller hits your telephony provider or enterprise phone system, then the SIP trunk or SBC, then the Foundry SIP endpoint, then the telephony binding, then the voice agent. The binding is the hop that picks the agent. It is not the place you type the password.

Portal clicks, from Learn, in this order:

1. Open Build, then Agents.
2. Select the voice agent.
3. Open Channels.
4. Under Phone numbers, select Add a number.
5. Select Direct SIP.
6. Select a compatible `SipInbound` connection. You are picking a connection that already exists.
7. Enter an optional label and display phone number.
8. Optionally add allowed caller numbers. Up to 64 patterns, each up to 256 characters. The supported form is anchored E.164 with ASCII digits, digit ranges, and bounded quantifiers. Arbitrary regular expressions are not supported on this screen.
9. Review the connection and the access restrictions.
10. Create the binding.
11. Copy the generated SIP or SIPS ingress URI.
12. Point the trunk or SBC at that URI.

The blog's shorter path is Channels, then Phone numbers, then Direct SIP, then add the trunk with the provider's credentials and bind it. It does not print Add a number, and it does not say you select an existing `SipInbound` connection. If the screen in front of you has Add a number, you are on the Learn path. Use that one for the clicks. Use the blog when you need to tell someone the feature shipped on October 29.

The display phone number is not the route. Learn says it is optional display metadata, and it is not used as the SIP routing key. The thing you copy is `incoming_call_url` in the SDK, or the SIP or SIPS ingress URI in the portal. The blog calls that string the SIP binding URL and does not say SIPS. Copy whatever the screen or the response actually returned. Do not rewrite `sips` down to `sip`.

The blog's Python sample starts here, and it assumes `telephony` already exists:

```python
from azure.ai.projects.models import CreateSipTelephonyBindingRequest

binding_request = CreateSipTelephonyBindingRequest(
    connection_name="my-sip-inbound-connection",
    phone_number="+12065550123",
    label="Support SIP trunk",
    allowed_calling_numbers=[
        "+14255550123",
        r"^\+1425[0-9]{7}$",
    ],
)

binding = telephony.create_binding(
    agent_name=agent_name,
    telephony_binding=binding_request,
)

print(binding.incoming_call_url)
```

Those two phone numbers are on the blog. Learn's prose, under its own sample, says `phone_number` does not determine SIP routing. The Learn sample also prints `binding.id`. The blog sample does not. If you only paste the blog block, you still need the client the Learn page shows:

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

endpoint = "https://<account>.services.ai.azure.com/api/projects/<project>"
agent_name = "my-voice-agent"
credential = DefaultAzureCredential()
project_client = AIProjectClient(endpoint=endpoint, credential=credential)
telephony = project_client.beta.voice_agents.telephony
```

That client does not pass `allow_preview=True`. The quickstart says creating voice definitions through the standard `.agents` methods still requires `allow_preview=True` on `AIProjectClient`. Binding an agent you already saved is the SIP page's client. Creating the agent in code is the quickstart's flag. Do not paste the flag onto the binding client because the other page has it.

Learn's install line for this how-to is Python 3.10 or later, then `python -m pip install "azure-ai-projects>=2.7.0" azure-identity`. The quickstart says its examples target 2.8.0 or later, and its install line is `"azure-ai-projects[voice]>=2.7.0"`. The `[voice]` extra is for the live session on that page. It is not on the SIP install line. Install the extra when you are opening a WebSocket session. Do not add it because you are creating a binding.

The beta client uses `api-version=v1` and adds `Foundry-Features: VoiceAgents=V1Preview` for you. On REST you send that header yourself. A create returns `201 Created`, the binding ID, `incoming_call_url`, and an `ETag`.

Two restrictions, and they are independent. The source IP policy sits on the `SipInbound` connection. The caller-number list sits on the binding. An empty allowed-caller list allows all caller numbers. Filling one list does not fill the other.

The portal sentence and the Python sample on the same Learn page do not match. The portal says arbitrary regular expressions are not supported. The Python sample, and the blog sample, still include `r"^\+1425[0-9]{7}$"`. If you are in the portal, follow the 64-pattern, 256-character, anchored E.164 rule on that screen. If you are pasting the sample, you are pasting what the page printed. Do not silently rewrite one into the other.

To stop new inbound calls without deleting the binding, read it, take the latest `ETag`, and PATCH `status` to `suspended` with `If-Match`. Set it back to `active` when you want calls again. Do not reuse an ETag after the binding changes. Deleting the binding removes the mapping from the ingress URI to the agent. It does not delete the project connection, and it does not update the trunk. After you delete it, change the route on the trunk or SBC yourself.

The blog's last step is a test call, then built-in observability and evaluation. That is the sentence on the blog. It does not name the blade.

## Outbound is a second connection

The blog says outbound needs no binding. You configure the SIP connection through the SDK or REST API when you place the call. Learn agrees that an inbound binding is not required, and it adds three constraints the blog does not print.

`SipOutbound` connections support IP ACL authentication only. Digest is not supported on that category. You create the `SipOutbound` connection in the portal. You create and manage the call jobs in the Python SDK or REST API. An empty IP ACL allows all source IP addresses. You still pass an authorized E.164 source number and an E.164 destination you have permission to call.

The blog's outbound sample uses `connection_name="my-sip-outbound-connection"`, `source="+14255550100"`, and a destination `value="+14255550123"`, with an `idempotency_key`. It does not say the connection is IP ACL only. If you are placing the call, use Learn for the auth mode and the blog sample for the request shape.

A `409 Conflict` means that idempotency key was already used with a different request. Repeat the original request, or use a new key for a new call. An inbound binding does not turn outbound dispatch on. If creation returns a dispatch-not-configured error, Learn says outbound SIP dispatch is not configured for that service instance, and the next step on that row is to contact support.

## Do not paste the Voice Live page onto this binding

The blog's opening says voice agents in Microsoft Foundry and the Voice Live API now support SIP. That is one sentence and two doors.

The [Voice Live SIP how-to](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live-sip) is the other door. Its `ms.date` is `2026-10-20T00:00:00Z` and `updated_at` is `2026-10-27T22:15:00Z`. That page says the feature is in public preview. It uses `api-version=1.0`, not `v1`. It says there is no dedicated SDK. Digest username on that page is the resource internal ID, a 32-character hex value, not `credentials.keys.username` on a project connection. `agent_configuration.type` is `voice_live`, and `voice_first` is not currently available. Inbound provider is `generic_sip`. Calls arrive as a signed webhook, `realtime.call.incoming`.

Same six regions. Different object. If you are binding a Foundry voice agent, stay on the project connection and the telephony binding. If you are attaching a carrier to Voice Live itself, use that other page. Do not copy the webhook sample into `CreateSipTelephonyBindingRequest`.

The question I still cannot answer from these pages: if the trunk only offers digest, and the agent also has to place the call, which sentence are you treating as the outbound rule, the blog's "configure the SIP connection when you place the call," or Learn's "SipOutbound is IP ACL only"?
