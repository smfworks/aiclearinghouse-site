---
slug: "2026-11-27-test-the-version-address-then-leave-both-agents"
title: "Test the version address, then leave both agents on the consumer address"
excerpt: "Two agents can share one Foundry toolbox. Test a later version on the address that names that version. Leave both agents on the address that follows the default, so a promotion does not mean a redeploy."
date: "2026-11-27"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-27-test-the-version-address-then-leave-both-agents"
categories: ["Microsoft", "Azure AI Foundry"]
tags: ["Foundry", "Toolbox", "MCP", "hosted agents", "how-to"]
readTime: 10
image: "/images/blog/2026-11-27-test-the-version-address-then-leave-both-agents-hero.png"
---

Two agents can share one box of tools and still miss each other if you paste the wrong address into either one. Test a later version on the address that names that version. Leave both agents on the address that follows the default. After you promote, they pick up the new default without a redeploy.

The shared box is a Toolbox in Microsoft Foundry. The walkthrough is [From inline tools to a shared Toolbox in Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/from-inline-tools-to-a-shared-toolbox-in-microsoft-foundry/4575475), by SriAishwaryaMasina. The addresses you copy are on the Learn pages updated yesterday.

## Start with one tool both agents already need

Everyday version: stop copying the same weather call, the same search, the same file tool onto every agent. Put that one tool in the shared box. Point both agents at the box. Confirm each one can call it.

The community post calls the box a centrally managed, versioned collection of tools, exposed through one Model Context Protocol endpoint. After that, MCP is enough. The services behind the box do not all have to speak MCP. One box can combine an OpenAPI service, a remote MCP server, and built-in Foundry tools.

The travel demo on that page is the picture. The collection is written `travel-toolbox`. It holds OpenAPI tools for weather, geocoding, forecasts, and currency, next to the Microsoft Learn MCP server and Code Interpreter. The Playground agent that uses the box references a connection written `travel_toolbox`. Keep `travel-toolbox` and `travel_toolbox` as two spellings. One uses a hyphen. The other is written with `_`. In that comparison both agents got the same request, the current temperature in Paris. The page says the Toolbox-backed agent used fewer input tokens than the agent with inline tools. It does not print a token count, so leave the number off.

The closing step on that post is the one to try: pick a read-only tool that two agents already need, put it in a Toolbox, connect both agents to the stable endpoint, and confirm a successful call from each. That is the baseline. Two agents, one integration to maintain.

Before you share the box, configure downstream authentication on the project connections. The hosted-agent page says the same thing in operational words. The agent authenticates to the toolbox endpoint with its Microsoft Entra identity and the `https://ai.azure.com/.default` scope. The connection on each tool decides which identity reaches the downstream service. Leave API keys and OAuth tokens off the agent code. Put those credentials on the project connection the tool references. That page is [Use a toolbox with a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent).

Toolbox and Tool Search are two jobs on the community post. Toolbox lets agents share integrations. Tool Search is optional, and it changes which tool definitions the model sees up front. Add Tool Search when the collection grows. The address split below is the step for today.

## Copy the address with no version in the path

The address the agents keep has no version segment. Learn calls it the toolbox consumer endpoint. It always serves `default_version`, the version marked as the current default.

On the hosted-agent page the sample is:

```http
https://<account>.services.ai.azure.com/api/projects/<project>/toolboxes/<toolbox-name>/mcp?api-version=v1
```

When you promote another toolbox version to default, an agent that uses this endpoint gets the new version without an endpoint change or redeployment. That sentence is the reason both agents stay on this address.

The create-and-manage page prints the same split as a two-row table. [Create and manage a toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox) calls the test role Toolbox developer and the agent role Toolbox consumer.

| Role on that page | Path after the project endpoint | When you use it |
| --- | --- | --- |
| Toolbox consumer | `/toolboxes/{toolbox_name}/mcp?api-version=v1` | Connect agents. Always serves `default_version`. |
| Toolbox developer | `/toolboxes/{toolbox_name}/versions/{version}/mcp?api-version=v1` | Test one version before you promote it. |

`{project_endpoint}` is `https://<your-foundry-account>.services.ai.azure.com/api/projects/<your-project>`. Copy it from the Overview page of the project in the [Foundry portal](https://ai.azure.com), or from the Endpoint URL column in the Toolboxes view of the Microsoft Foundry Toolkit for Visual Studio Code.

If you already have the toolbox in that extension, the page's copy path is four clicks:

1. Select Foundry Toolkit in the Activity Bar.
2. Under My Resources, expand Your project name, then Tools. That label is the page's placeholder for the project.
3. On the Toolboxes tab, locate your toolbox.
4. In the Endpoint URL column, copy the endpoint.

That copied value is the consumer endpoint. The page says so in the next sentence. To build the test address, use the developer pattern in the table. Insert `/versions/<version>` before `/mcp`. Do not paste that longer address onto the agents you want to follow the default.

The first version of a new toolbox is automatically promoted to `default_version` (v1). So the first confirm-a-call can go through the consumer address. A later version sits beside that default until you promote it.

The overview page, [What is Toolbox in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview), describes a toolbox as tools packaged behind a single managed MCP endpoint. It does not print these two addresses. Use the how-to pages when you are copying a URL.

## Test the version address, then promote

A later version needs a test before it becomes the default. The community post says to test changes at the version-specific endpoint before promoting them. Agents using the stable consumer endpoint then pick up the new default without redeployment. The hosted-agent page uses a longer name for that test address: version-specific developer endpoint. Use it only when you need to test an immutable version before promotion. Its sample adds `/versions/<version>` before `/mcp`:

```http
https://<account>.services.ai.azure.com/api/projects/<project>/toolboxes/<toolbox-name>/versions/<version>/mcp?api-version=v1
```

The quick path on that page puts the consumer copy before the verify. Step 3 is copy the toolbox consumer endpoint into the agent. Step 4 is use the version-specific endpoint to list the available tools, then run one agent request that calls an expected tool. The verify section says to confirm the toolbox loads the expected tools with an MCP client, and to use the version-specific endpoint before promoting. Its Python sample points `url` at that version path, takes a token for `https://ai.azure.com/.default`, and calls `session.list_tools()` after `session.initialize()`. The install line above the sample is `pip install mcp`.

The community post calls the shared address the stable consumer endpoint, and later the stable endpoint. Those are the two visible uses of stable on that article. The three Learn files I saved this morning, the hosted how-to, the create-and-manage how-to, and the overview, print stable zero times. When you write the ticket, use the Learn name, consumer endpoint, for the address the agents keep. Use the community post's stable when you are quoting that post.

Promotion is a field update, not a new paste into the agents. The create-and-manage page says the MCP endpoint always serves `default_version`, and that you switch the active version by updating the toolbox. The Python sample is:

```python
toolbox = project.toolboxes.update(
    toolbox_name="<toolbox-name>",
    default_version="<version_id>",
)
print(f"Active version: {toolbox.default_version}")
```

The same section has a REST `PATCH` to `{project_endpoint}/toolboxes/<toolbox-name>?api-version=v1` with a JSON body of `"default_version": "<version_id>"`. `default_version` can't be empty. The Azure Developer CLI path on that page is `azd ai toolbox publish <toolbox-name> <version_id> --no-prompt`. The Visual Studio Code pivot does not add a Promote click. It says to use the Python, .NET, JavaScript, or REST tab.

After that update, leave both agents on the consumer address. The hosted-agent page's sentence is the check: no endpoint change, no redeployment. Confirm a successful call from each, which is the community post's baseline, now against the new default.

The page also says the Toolbox Monitor dashboard can show usage and errors by version when Application Insights is connected. That is the look after both calls succeed, not a substitute for the version-address test.

## Which clock is which

The community post's `postTime` and `lastPublishTime` are `2026-11-25T10:00:00.107-08:00`. The [Foundry feed](https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=azure-ai-foundry-blog) lists that item first, at `Wed, 25 Nov 2026 18:00:00 GMT`, the same instant. The visible line is Nov 25, 2026. The tooltip is November 25, 2026 at 10:00 AM, and that tooltip does not print a timezone. JSON-LD `datePublished` is `11/25/2026, 6:00:00 PM`, also with no timezone. Keep those three lines. Do not fold them into one clock.

The footer says Published Nov 21, 2026, Version 1.0. Its tooltip is November 21, 2026 at 1:46 PM. `article:modified_time` and `lastEditTime` are `2026-11-21T13:46:28.532-08:00`. JSON-LD `dateModified` is `11/21/2026, 9:46:28 PM`, with no timezone. The footer and the November 25 `postTime` are different stamps. `revisionNum` on the saved page is 2.

I requested that URL this morning. It returned 200 after gzip, saved HTML 537,209 bytes, response `Date` `Fri, 27 Nov 2026 12:03:48 GMT`. The `postTime` is 42.06 hours before that `Date`, and 42.00 hours before 07:00 Eastern on November 27. The edit stamp is 134.29 hours before that `Date`, and 134.23 hours before that 07:00 clock.

The hosted-agent markdown, requested with `Accept: text/markdown`, is 16,670 bytes, same response `Date`, `Last-Modified` `Thu, 26 Nov 2026 16:05:50 GMT`. `ms.date` is `2026-11-20T00:00:00.0000000Z`. `updated_at` is `2026-11-26T15:04:00.0000000Z`, 21.00 hours before the response `Date` and 20.93 hours before 07:00 Eastern. Author on that file is sdgilley. The create-and-manage markdown is 88,332 bytes, `Date` `Fri, 27 Nov 2026 12:03:49 GMT`, `Last-Modified` `Thu, 26 Nov 2026 15:39:00 GMT`, and the same `ms.date` and `updated_at`. The overview markdown is 13,544 bytes, `updated_at` `2026-11-24T15:07:00.0000000Z`, `Last-Modified` `Tue, 24 Nov 2026 15:22:45 GMT`. The address samples above are the two how-to files, not the overview.

## Try the baseline today

Pick the read-only tool both agents already call. Create the toolbox version if you do not have one yet. The first version becomes `default_version` on its own. Copy the consumer endpoint from the Endpoint URL column, or build the hosted-agent sample with your account, project, and toolbox name. Put that same address on both agents. Confirm one successful call from each.

When the next version is ready, list tools on the version-specific address, run one request that calls an expected tool, then promote with `project.toolboxes.update` or `azd ai toolbox publish`. Leave the agents where they are. The next call should hit the new default because the address never named a version.

If one agent still misses the tool after that promote, check whether its saved address still has `/versions/` in it.

Which of the two agents still has a version segment in the address it saved?
