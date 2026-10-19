---
slug: "2026-10-19-create-the-workspace-before-the-toolbox"
title: "Create the Playwright workspace before you attach the toolbox"
excerpt: "Browser automation in Microsoft Foundry is generally available as of this morning. Create the Playwright workspace, publish the toolbox, and do not copy the sample's require_approval never."
date: "2026-10-19"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-19-create-the-workspace-before-the-toolbox"
categories: ["Microsoft", "Microsoft Foundry"]
tags: ["Microsoft Foundry", "browser automation", "Playwright Workspaces", "toolboxes", "agents"]
readTime: 11
image: "/images/blog/2026-10-19-create-the-workspace-before-the-toolbox-hero.png"
---

Create the Playwright workspace before you attach the toolbox. Do not copy `require_approval` set to `never` from the sample.

Browser automation in Microsoft Foundry is generally available as of this morning. The tool is not a browser you install next to the agent. Playwright Workspaces is a separate Azure resource, and the toolbox is how the agent reaches it. I fetched the Foundry post and the Learn pages on this host. I did not create a workspace, publish a toolbox, or run a sample.

The dated primary is [Browser automation tool in Microsoft Foundry is now GA](https://devblogs.microsoft.com/foundry/browser-automation-tool-ga/). `article:published_time` is `2026-10-19T10:32:13+00:00`. `article:modified_time` is `2026-10-19T10:39:25+00:00`. This host's clock at 2026-10-19 07:06 EDT put the published stamp 34 minutes earlier.

If you only read the announcement, you will miss three splits the supporting pages still print. Private website browsing is marked Public preview on the Learn tool page. The Playwright Workspaces remote MCP server page says that server is in preview and is not recommended for production. Two code samples set approval to `never`, while the announcement and the governance section say to require approval before a state-changing action. Keep those sentences on the pages that said them.

## Pick the path before you configure

The Learn page [Automate browser tasks with the Browser Automation tool](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/browser-automation) says every option uses a Playwright workspace and a Browser Automation toolbox. A prompt agent is the fastest path: instructions, a model, and tools, and Foundry runs the agent. A prompt agent with the GitHub Copilot harness is the option when you want Foundry to operate the harness. The GA post writes "Github copilot harness". Learn writes "GitHub Copilot harness". Create the prompt agent, select that harness, add the tool through a toolbox, save, and start a new chat. I did not create that agent. A hosted agent with Microsoft Agent Framework is the custom-code path with Foundry-managed hosting. The hosted quickstart says to select Agent Framework when you create the sample. Your own framework, including LangGraph, the OpenAI Agents SDK, or Semantic Kernel, connects through that framework's MCP client. Do not start by pasting the announcement's Python block. It is cut off.

The Learn page `ms.date` is `2026-10-06T00:00:00Z`. `updated_at` is `2026-10-15T11:08:00Z`. The footer says last updated on 2026-10-12. Those dates are not the news date. Use the page for the steps.

## Create the workspace in a listed region

The GA post says Playwright Workspaces has to be provisioned separately as an Azure resource. The Learn setup section says the same thing in portal language: create a Playwright Workspace resource in the Azure portal.

If the agent will be hosted, the workspace has to sit in a region that also supports hosted agents. The tool page then lists where Browser Automation is currently available, and every row says Available: australiaeast, eastasia, eastus, japaneast, switzerlandnorth, westeurope, and westus3.

I did not open the "Tool support by region and model" page the prerequisites point at. Do not treat this list as a model-compatibility table. The prerequisites say to confirm that both the model and the project region support Browser Automation, and they give `gpt-5.4` as an example, not as the only model.

The samples do not agree on a model name. The [hosted quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart) defaults to `gpt-5.4-mini` at capacity 10, on a SKU that is not Batch. The C# hosted sample falls back to `gpt-5-mini`. The TypeScript sample hard-codes `gpt-4.1-mini`. Deploy the model your project can use.

Day-to-day work needs Foundry User. Creating the connection needs Foundry Project Manager. Contributor on the resource group is only for creating the workspace. Activate it just in time through Microsoft Entra Privileged Identity Management, then deactivate it. The hosted quickstart's Owner or Contributor sentence is wider. It is not the day-to-day role. The Learn page says the Foundry role IDs did not change in the rename from the Azure AI names. You might still see the old names.

Private sites are a separate label. The GA post says the tool can reach private applications behind an Azure virtual network, and that the private network connection should be added while you provision the Playwright Workspace. The Learn tool page lists "Support for private website browsing (Public preview)" as its own bullet. Do not read the GA sentence as a promise that private browsing is generally available. If you need a private site, add the connection at provision time, and keep the preview label on that capability.

## Grant the identity the connection actually uses

The Learn page splits two identities. The project managed identity is the project-wide identity used by Foundry platform services and by Browser Automation connections. The agent identity is created when you deploy a hosted agent, and it is for that agent's runtime access to downstream resources.

When you create the connection, the recommended default for an enterprise workload is the project managed identity, when the connection supports it. API key is the prototyping path, or the path when your organization permits service access tokens. If you generate a token, copy it immediately. The page says you cannot view it again after you close the page. Store it only in the Foundry project connection. Do not put it in source, prompts, or logs.

Grant the project managed identity the minimum Playwright permissions. The page says to use a custom role that contains only those permissions. If a custom role is not available, assign Playwright Workspace Contributor at the Playwright workspace resource scope. On the Members tab, select the Foundry project managed identity, then Review + assign.

The hosted quickstart does not use that split cleanly. Its step text says to find the agent's identity object ID under Agents, then Identity. The CLI variable on the next line is `PRINCIPAL_ID="<project-managed-identity-object-id>"`. Those are not the same noun. I did not compare the two object IDs. Do not paste one into the other until you have checked they match. The example resource ID uses `Microsoft.LoadTestService/playwrightWorkspaces`. The browser endpoint it tells you to copy starts with `wss://`.

## Publish the toolbox, then read the connection ID off the tool

In the Foundry portal, the Learn page walks this path. Open Build, then Tools. Create a toolbox. Fill in the name and description. Under Tools, click Add. Select Browser Automation and click Add tool. Enter the connection name, select the Playwright Workspace, and select the auth type. Click Connect, then Publish.

After that, the project connection ID is on the tool's details page. The configuration section prints the shape: `/subscriptions/{{subscriptionID}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.CognitiveServices/accounts/{{foundryAccountName}}/projects/{{foundryProjectName}}/connections/{{foundryConnectionName}}`. The samples use the placeholder `your-browser-automation-connection-id`. That placeholder is not an ID. Use the value from the details page.

There is a CLI path too. `azd ai connection create` with `--kind PlaywrightWorkspace` requires that kind in exact PascalCase. One sentence above the command says "create a Playwrite workspace". That spelling is not a second product.

The toolbox form I read does not print an allow-list field. The GA post still says to start with navigation and page-inspection tools, then enable clicking, typing, form filling, or file upload only when the scenario requires them. I did not find the portal control that performs that enablement on the toolbox form. Do not invent one. Put the limit in the agent instructions, and keep approval on for state-changing calls. The named allow list lives on a different page.

Install `azure-ai-projects>=2.8.0` plus `python-dotenv`. The troubleshooting section prints a lower floor, `>=2.0.0`. Do not stop there. The .NET SDK is marked preview. The Java SDK does not yet expose a toolbox creation API.

## Do not copy never

The GA post says to require approval before sensitive or state-changing operations. The Learn governance section says to require human approval for consequential or state-changing actions. The remote MCP page says, while you are evaluating, to require approval for every call.

The REST example on the Learn page sets `"require_approval": "never"`. The TypeScript example sets `require_approval: "never"`. Both of those examples also send the agent to finance.yahoo.com and ask it to click. That is a state-changing prompt paired with an approval setting the governance section does not use.

Do not ship `never` as the policy. If you are still evaluating, use the MCP page's every-call rule. After that, the GA post and the governance section still want a person on state-changing actions. I did not see an approval dropdown on the toolbox form. The field the samples set is on the MCP tool attachment. Change that field.

Web content is untrusted input. Keep system policies separate from page content. The transparency note says errors in judgment, and confusing instructions on a page, can cause commands you did not intend. Live View is how you watch a session. Take control is how a person steps in. The prompt-agent sample says the Live View URL is sensitive. Do not share it. Traces can hold prompts and tool-call arguments. The GA post says routing that content to the AppGenAIContent table, with deny-by-default access and Azure RBAC, is documented as a preview. I did not walk that procedure.

## Do not run the truncated Python block

The announcement's Python sample, and the hosted-agent Python sample on the Learn page, both stop inside the `FoundryToolbox` constructor. The published text ends with a stray `, timeout=120.0)` and then continues as if the call had finished. That is not a program you can run. The announcement's endpoint placeholder is `https://.services.ai.azure.com/api/projects/`, with the account name missing. The Learn hosted sample uses `https://<account>.services.ai.azure.com/api/projects/<project>`. Use the second shape if you write your own call. I did not repair the truncated constructor, and I did not execute it.

The prompt-agent Python sample is the one that looks complete. It creates a `BrowserAutomationTool`, streams the response, and prints `remote_function_call` items after popping `browserSessionId`. Its prompt visits `https://example.com` and asks for the title and the visible description from the browser result, not prior knowledge. Send that first. I did not run it.

Do not merge the other prompts. The C# sample asks for `https://finance.yahoo.com/quote/MSFT/performance/`, says not to use the search bar or the charts, and sets `NetworkTimeout` to five minutes. The class is named `Sample_BrowserAutomotion`. The truncated sample asks for a YTD click, and the Learn page then prints `Agent: The year-to-date change for MSFT is approximately +18.4%.` while saying the output varies. That line is not a measurement. Start with example.com. Move to a click only after approval is on.

## If you open the remote MCP page, it is a different door

[Automate browsers with the Playwright Workspaces remote MCP server](https://learn.microsoft.com/en-us/azure/app-testing/playwright-cloud-browsers/how-to-playwright-workspaces-remote-mcp) says the remote MCP server is in preview, has no service-level agreement, and is not recommended for production. `ms.date` is `2026-09-11T00:00:00Z`. `updated_at` is `2026-09-30T11:34:00Z`. The Foundry tool can be generally available while this server page stays in preview. Do not collapse them.

Use this page for the named allow list the toolbox form did not print. A read-oriented list is `create_browser_session`, `browser_navigate`, `browser_snapshot`, `browser_find`, `browser_take_screenshot`, and `close_browser_session`. Add `browser_click` or `browser_type` only when the scenario requires them. Do not enable `browser_evaluate` or `browser_run_code` by default. The page says `browser_run_code` has the highest privilege.

Session rules on that page, not on the GA post: call `create_browser_session`, pass that `browserSessionId` to every later tool, and call `close_browser_session` even when the flow fails. Do not issue concurrent actions against the same session. An inactive session is cleaned up after 15 minutes. Connection loss is terminal.

Foundry nonstreaming MCP tool calls on that page have a 100-second client timeout. The C# sample's five-minute `NetworkTimeout` is a different number. Do not add them. I did not run the hosted quickstart's `azd ai agent init` path.

## Before you call the run done

Use the tool only on sites you trust. The limitations section says to avoid pages that ask for credentials, payments, or other sensitive actions. I did not open Playwright pricing. Delete the test agent version when you are done.

The question I cannot answer from these pages: on a toolbox you published this morning, where does Foundry store the allow list for click and type, if the toolbox form does not print one?
