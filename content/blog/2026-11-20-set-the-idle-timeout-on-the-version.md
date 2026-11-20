---
slug: "2026-11-20-set-the-idle-timeout-on-the-version"
title: "Set the idle timeout on the version, then leave four hours as the sample"
excerpt: "A quiet hosted-agent session still holds a computer until the wait runs out. Set that wait on the version. The four-hour number in the sample is an example. Leave the block out and the service uses fifteen minutes."
date: "2026-11-20"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-set-the-idle-timeout-on-the-version"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "Foundry Agent Service", "hosted agents", "idle timeout", "how-to"]
readTime: 8
image: "/images/blog/2026-11-20-set-the-idle-timeout-on-the-version-hero.png"
---

Set how long a quiet session keeps its computer. That wait is the idle timeout. You set it on the agent version when you create the version. The four-hour number in the sample is an example. Leave the setting out and the service uses fifteen minutes.

A quiet session is still holding compute until that wait runs out. By the end you will have the property name, the sample that sets four hours, and the install line for the extension that accepts a wait longer than an hour.

## Set the wait when you create the version

The page is [Hosted agents in Foundry Agent Service at Ignite 2026](https://devblogs.microsoft.com/foundry/hosted-agents-foundry-agent-service-ignite-2026/), by Muzz Imam. I fetched that URL this morning. HTTP 200. The Date header was `Fri, 20 Nov 2026 12:02:56 GMT`. The saved HTML is 241,519 bytes.

The meta `article:published_time` is `2026-11-18T17:00:54+00:00`. The graph JSON-LD `datePublished` is the same instant. `article:modified_time` and JSON-LD `dateModified` are `2026-11-19T07:43:50+00:00`. The author meta is `Muzz Imam`. The JSON-LD author name is the same.

The Foundry feed item for this title is `Wed, 18 Nov 2026 17:00:54 +0000`, the same instant as `datePublished`. I saved that feed at the same fetch. It is 220,255 bytes and ten items. This post is the newest item.

Python, against the fetch clock `2026-11-20T12:02:55Z` (7:02 AM Eastern), put the publish instant 43.03 hours earlier and the modified instant 28.32 hours earlier. Against 07:00 ET (`2026-11-20T12:00:00Z`) those ages are 42.98 hours and 28.27 hours. Both sit inside 48 hours.

## Read the glance row, then the later sentence

The glance row says configurable idle timeout. Sessions can wait from 2 minutes to 4 hours between requests. The status on that row is generally available.

A later sentence on the same page says you can set the idle timeout per agent version from 2 minutes to 4 hours (15 minutes by default). The words "set the idle timeout" are a link to `https://learn.microsoft.com/azure/foundry/agents/how-to/manage-hosted-sessions`.

The 15-minute default lives in that later sentence. A search of the stripped article text, 17,848 characters, found one `15 minutes by default`, zero `900`, and zero `idle_timeout`. The raw HTML has five `900` strings. They sit in a color token, a session URL, and SVG path data. They do not sit in the idle-timeout sentences.

That same later sentence says that without memory snapshots, session files survive idle periods, and a session is deleted after 30 days of inactivity. Keep that clause on this page. The status line under the section says resilient execution and configurable idle timeout are generally available, and the anchor text is Resilience for long-running hosted agents. The href is `https://learn.microsoft.com/azure/foundry/agents/concepts/long-running-agent-resilience`.

## Open the session guide the blog links

I requested the blog's href with `Accept: text/markdown`. The first response was HTTP 302 to `/en-us/azure/foundry/agents/how-to/manage-hosted-sessions`, then HTTP 200. The Date header was `Fri, 20 Nov 2026 12:06:36 GMT`. The saved markdown is 53,431 bytes. `wc -l` reported 1,390 lines. The title is Manage hosted agent sessions.

A direct request of the `/en-us/` URL, a few minutes earlier, returned HTTP 200 with Date `Fri, 20 Nov 2026 12:02:56 GMT` and the same 53,431 bytes. `ms.date` is `2026-11-13T00:00:00.0000000Z`. `updated_at` is `2026-11-20T10:13:00.0000000Z`. Both copies print those stamps.

Python, against the fetch clock `2026-11-20T12:02:55Z`, put `ms.date` 180.05 hours earlier and `updated_at` 1.83 hours earlier. Against 07:00 ET those ages are 180.00 hours and 1.78 hours. The `ms.date` sits outside 72 hours. The `updated_at` sits inside 48 hours, and it is later than the blog's modified stamp. The steps below are from this morning's markdown.

The opening paragraph says the agent version's idle timeout can be 2 through 240 minutes (4 hours) and defaults to 15 minutes. The idleness section says set `idle_timeout_seconds` from 120 through 14,400 seconds (2 minutes through 4 hours). If you omit the setting, the server default is 900 seconds (15 minutes). Those two sentences agree with each other on the range and on 15 minutes. They agree with the blog's later sentence on that range and that default. They add the property name, the 900-second omit path, and the minute form the blog leaves off the page.

The same opening says sessions persist for up to 30 days. That is its own sentence. The blog's "deleted after 30 days of inactivity" clause stays on the blog.

## Put 14400 in the sample, or leave the block out

The guide says the following examples configure a 4-hour idle timeout. In `azure.yaml`, add `sessionConfiguration` under the hosted agent service:

```yaml
services:
  my-agent:
    host: azure.ai.agent
    kind: hosted
    sessionConfiguration:
      idleTimeoutSeconds: 14400
```

Then the page says deploy with `azd deploy`.

The `azure.ai.agents` extension validates the value and maps `sessionConfiguration.idleTimeoutSeconds` to the version's `session_configuration.idle_timeout_seconds` property. The service key in the sample is `azure.ai.agent`. The extension name on the next sentence is `azure.ai.agents`. Read the name on the line you are typing.

If you omit `sessionConfiguration`, the extension omits the property from the request, and the service uses the 900-second default. Leave the block out when fifteen minutes is the wait you want. Put `14400` in when the sample's four hours is the wait you want.

The Python sample sets the same number on `SessionConfiguration(idle_timeout_seconds=14400)` inside `HostedAgentDefinition`. The REST sample sets `"idle_timeout_seconds": 14400` inside `session_configuration`. A search of this morning's markdown found four `idle_timeout_seconds`, two `idleTimeoutSeconds`, and three `14400`.

## Check the extension floor before a long wait

Values above 3,600 seconds require `azure.ai.agents` extension version `1.0.0-beta.19` or later. The 120-second minimum requires version `1.0.0-beta.14` or later. The install line on that note is `azd ext install azure.ai.agents`.

The sample uses `14400`. The page's own range calls 14,400 seconds 4 hours, and the same note says values above 3,600 seconds need `1.0.0-beta.19` or later. Install or update the extension before you deploy that sample. If you shorten the wait to the 2-minute floor, the other line on that note is the one to read: `1.0.0-beta.14` or later.

The .NET tab says the .NET SDK's `HostedAgentDefinition` doesn't expose a session configuration property yet, so set the idle timeout with the REST API or the Python SDK. The JavaScript tab says set the idle timeout with the REST API or the Python SDK, and it points at the REST tab for the request body. Use the tab for the language you are shipping.

## Change the version if you want a new baseline

The setting applies to sessions created for that version. To change the baseline timeout, create another version with the new value.

In an enabled session-compute preview environment, the guide also links an override for the running instance's idle timeout. That override isn't persisted on the session, and it doesn't change the agent version's baseline. A new wait for later sessions belongs on a new version.

Idle compute remains billable until the platform suspends the sandbox, normally after the configured idle timeout. A long timeout keeps sessions ready for follow-up requests, and it adds that idle time to the cost of every session. Farther down, the same page says stopping a session also ends its compute billing. Stop the session when the work is done if you want the bill to end before the wait runs out.

For ordinary volume-backed sessions, the guide says the platform persists the session's filesystem, `$HOME` and uploaded files, across turns and idle periods. It points memory-snapshot sessions at a different persistence note. The blog's clause is the one that says session files survive idle periods without memory snapshots. Read the snapshot sentence on the page you have open before you count on files after a long pause.

Try this on the version you are about to create. If follow-up requests usually land inside fifteen minutes, leave `sessionConfiguration` out and let the service use 900 seconds. If people come back hours later and you want the sandbox still warm, put `idleTimeoutSeconds: 14400` on the version, and install `azure.ai.agents` at `1.0.0-beta.19` or later first.

If your quiet sessions usually come back after fifteen minutes and before four hours, which number are you putting on the version?
