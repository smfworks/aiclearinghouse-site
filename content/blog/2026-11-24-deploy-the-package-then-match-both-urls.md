---
slug: "2026-11-24-deploy-the-package-then-match-both-urls"
title: "Deploy the package, then match both endpoint URLs"
excerpt: "This morning's Microsoft 365 Developer Blog says Copilot UX components can ship as Cowork plugins. Deploy the SharePoint package first, then put the same tenant URL in both JSON files before you zip. The Cowork admin sample is a different package."
date: "2026-11-24"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-24-deploy-the-package-then-match-both-urls"
categories: ["Microsoft", "Copilot"]
tags: ["Copilot", "SPFx", "Cowork", "how-to", "plugins"]
readTime: 11
image: "/images/blog/2026-11-24-deploy-the-package-then-match-both-urls-hero.png"
---

If you want a Copilot UX component to show up in Cowork after this morning's note, deploy the SharePoint package first, then put the same tenant URL in both JSON files before you zip. The blog says you still build that package by hand. The Learn page it links is the walkthrough. The Cowork admin page it also links prints a different sample, with a tool-description file and a different sign-in type. Copy the walkthrough. Leave that sample on the admin page.

That is the job. The three pages below are the ones I fetched this morning.

## Deploy the SharePoint package first

The post is [Copilot UX components now available in Cowork with plugins](https://devblogs.microsoft.com/microsoft365dev/copilot-ux-components-now-available-in-cowork-with-plugins-spfx-roadmap-update-for-november-2026/) on the Microsoft 365 Developer Blog. The author meta is Vesa Juvonen. `article:published_time` and both JSON-LD `datePublished` values are `2026-11-24T11:21:11+00:00`. `article:modified_time` and both `dateModified` values are `2026-11-24T11:30:05+00:00`. The page returned 200, `Date: Tue, 24 Nov 2026 12:03:05 GMT`, and 266,357 bytes. That clock is 0.70 hours after publish and 0.55 hours after the edit. Against 07:00 ET the same stamps are 0.65 and 0.50 hours. The [Microsoft 365 Developer Blog feed](https://devblogs.microsoft.com/microsoft365dev/feed/) lists this post first, `Tue, 24 Nov 2026 11:21:11 +0000`, newest of 10. The saved feed is 161,493 bytes.

The opening says Copilot UX components are now supported and available in Copilot Cowork, packaged as plugins. With plugins, the components light up in standard Copilot chat and in Cowork based on what people ask, without anyone having to find and open a specific agent first. Everyday version of that sentence: once the plugin is deployed, a person can ask in the normal chat and the component can show up. The blog calls the package a plugin. The Learn title calls the same package a plug-in. Either word lands on the same doc.

The get-started paragraph is the one to follow today. It says you can start building today. At the moment, you build the plugin package manually, and the documentation walks you through each step. The next sentence says they are looking into providing build settings for this with SPFx 1.25, so plugins become a packaging option. Users need a Microsoft Copilot license. The doc link is [Manually package a Copilot UX component as a plug-in](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/package-copilot-ux-component-as-plugin).

A later note on the same blog is a different package. Automatic Sync to Teams, for solutions that combine Copilot UX components with SPFx Teams functionality, is planned as a fast follow. Until then, use a manually created Teams package for these solutions. That Teams package is a separate file from the Cowork plugin ZIP below.

Open the packaging page before you wait on 1.25. I fetched it with `Accept: text/markdown`. The response is 26,652 bytes, `Date: Tue, 24 Nov 2026 12:03:30 GMT`. `ms.date` is `2026-11-23T00:00:00.0000000Z`, 36.06 hours before that Date and 36.00 hours before 07:00 ET. `updated_at` is `2026-11-23T18:48:00.0000000Z`, 17.26 hours and 17.20 hours. The markdown `Last-Modified` is the same instant as that Date, so use `updated_at` for the content clock. The Important note says for SPFx 1.24.x, creating this plug-in package requires the manual configuration and packaging described there. Starting with the upcoming SPFx 1.25, developers can choose an opt-in option to package Copilot UX components as plug-ins. Plug-in packaging isn't mandatory for every solution. On 1.24.x, the manual steps are the path the page prints.

The same page says deploy and enable the `.sppkg` in the target tenant before testing the plug-in. The ZIP connects to that implementation. It doesn't deploy or duplicate the running SPFx components. Everyday version: the SharePoint package is the running component. The ZIP is the address Copilot uses to find it. Keep the `.sppkg` deployed and enabled for as long as the plug-in uses it. Publishing the ZIP, or copying a solution GUID, doesn't provision the implementation.

## Put the same URL in both files

Record four inputs from the table on that page. The SharePoint origin is the root URL of the tenant hosting the deployed solution, `https://[prefix].sharepoint.com`, with no trailing slash, site path, or query string. Skip the `-admin` host, a personal OneDrive host, the full App Catalog site URL, and the Copilot URL. The SPFx solution ID is `solution.id` in `config/package-solution.json`. The plug-in app ID is a new GUID. The page's PowerShell for that is `[guid]::NewGuid().ToString()`. Keep that new GUID stable when you update the same plug-in. The app version is your release version. The sample uses `1.0.0`.

The endpoint the page prints is:

```text
https://[prefix].sharepoint.com/_api/mcp/spfx?solutionId=[solution-id]
```

Use the deployed SPFx solution ID in `[solution-id]`. A component ID, the new plug-in app ID, and an agent ID belong in other fields. The sample in both JSON files uses `https://contoso.sharepoint.com` and `11111111-2222-4333-8444-555555555555`. Replace both before you zip. Those are the page's placeholders.

The package has five files at the ZIP root: `manifest.json`, `declarativeAgent.json`, `ai-plugin.json`, `color.png`, and `outline.png`. `color.png` is 192 by 192, full color. `outline.png` is 32 by 32, a white mark on a transparent background. Leave `mcp-tools.json` out of the ZIP. Tool definitions come from SPFx at runtime. A search of the saved markdown found `mcp-tools.json` three times, all in that leave-it-out guidance, and `Compress-Archive` once.

This walkthrough wants both an included declarative agent and an app-level connector. If you start from an existing SPFx declarative-agent manifest, add the top-level `agentConnectors` array and keep `copilotAgents`. The page says an agent declaration alone doesn't declare an app-level connector, and the connector doesn't replace the agent's action configuration. This package needs both.

Write the complete endpoint in two places, and make the complete URLs identical, including the tenant and the solution ID:

| File | Field |
| --- | --- |
| `manifest.json` | `agentConnectors[].toolSource.remoteMcpServer.mcpServerUrl` |
| `ai-plugin.json` | `runtimes[].spec.url` |

The first exposes the plug-in connector. The second supplies actions to the included agent. Editing one doesn't update the other. The page says these are literal package values. The assembled ZIP doesn't substitute the installing tenant or resolve placeholders for you. When you deploy to another tenant, update both, even if you reuse the same `.sppkg` and solution GUID.

In `ai-plugin.json`, leave `functions` as an empty array and set `run_for_functions` to `["*"]`. Omit `mcpToolDescription` on the app connector, and omit `mcp_tool_description` on the runtime. An empty `functions` array is how this package asks SPFx for the current tools. SPFx supplies those definitions through MCP discovery. The `$schema` on `ai-plugin.json` is the plug-in schema v2.4, with `schema_version` set to `v2.4`. Keep that schema off the outer `manifest.json`. The sample manifest uses `https://developer.microsoft.com/json-schemas/teams/vDevPreview/MicrosoftTeams.schema.json` and `manifestVersion` `devPreview`. The sample agent uses declarative-agent schema v1.8.

For this SPFx integration, keep `authorization.type` set to `None` in both samples. The page says that setting declares no separate plug-in credential flow. The same paragraph says it does not make SharePoint anonymous, grant data access, or bypass sign-in, permissions, consent, or tenant policy. Keep that setting off an unrelated protected MCP server.

The Cowork admin page is a different sample. [Manage plugins for Copilot Cowork](https://learn.microsoft.com/en-us/copilot/cowork/cowork-manage-plugins) is the link in the blog's admin paragraph. I fetched that page with `Accept: text/markdown` too. The response is 16,818 bytes, `Date: Tue, 24 Nov 2026 12:03:31 GMT`, `Last-Modified: Tue, 17 Nov 2026 01:44:59 GMT`. That header is 178.31 hours before the Date and 178.25 hours before 07:00 ET. `ms.date` is `2026-11-16T00:00:00.0000000Z`, 204.06 hours and 204.00 hours. `updated_at` is `2026-11-17T01:03:00.0000000Z`, 179.01 hours and 178.95 hours. A search of that markdown found `Registry` zero times, `Upload custom app` once, `OAuthPluginVault` twice, and `spec.url` zero times. The packaging page has `Registry` three times and `OAuthPluginVault` zero times.

The admin sample's connector sets `mcpToolDescription.file` to `./tools/contoso.json` and `authorization.type` to `OAuthPluginVault`. Its auth table lists None (anonymous), `OAuthPluginVault`, and `ApiKeyPluginVault`. The packaging page's `None` setting is the one for this SharePoint ZIP. Leave the tool-description file and the vault sign-in on the admin sample.

## Zip five files, then use the upload click the page names

From the folder that holds those five files, the packaging page's command is:

```powershell
$files = @(
    'manifest.json',
    'declarativeAgent.json',
    'ai-plugin.json',
    'color.png',
    'outline.png'
)
Compress-Archive -LiteralPath $files -DestinationPath '.\workplace-plugin.zip' -Force
```

Open the ZIP and confirm `manifest.json` sits at the root, not inside a parent folder. Recreate the ZIP after you change any JSON or PNG. Packaging doesn't deploy the `.sppkg`, publish the plug-in, or test tenant access.

The upload clicks live on more than one screen. The packaging page says, for organization distribution, an administrator opens Microsoft 365 admin center, then Agents, then Tools, then Registry, then Upload, and selects the ZIP. The blog's admin sentence is shorter. In the Microsoft 365 admin center, under Agents > Tools, admins decide which plugins are available. The saved HTML contains `Agents &gt; Tools` once, and `Registry` zero times. The three choices in that paragraph are: deploy to the entire organization or to specific users and groups; make a plugin available to all users, or only to the users and security groups you choose; block a plugin so no one in the tenant can use it. Deployed plugins are acquired automatically, so employees don't need to find or install anything.

The manage page's deploy steps are Agents, then All agents or Tools, then Installed for, then All users or Specific users/groups. Its tenant-test upload is a different click: M365 admin center, then Manage apps, then Upload custom app. Its author test is inside Cowork: open the Customize page, select the Plugins tab, select Add plugin, and choose Only you on the Share dialog. Use Registry > Upload when you are handing this SPFx ZIP to an admin for the organization and that control is on the screen. Use the Cowork Customize path when you are the author and you want the private test the manage page prints. Check the label on the screen you actually have.

After upload, the packaging page says confirm the assigned user can find the new entry in the Copilot agent gallery, then open the included agent and run each starter. If the target experience also invokes the plug-in-level connector directly, test that path separately. Success in the included agent doesn't prove the connector path. The blog's Cowork sentence runs the other way: the component can show up in a normal chat without switching to an agent. Test the chat the blog describes, and test the included agent the packaging page describes, when both are in the experience you ship.

Two more checks from the packaging page before you widen access. Dynamic tool definitions can be cached for a few minutes. Starting a new conversation doesn't bypass that cache. And this ZIP is tenant-specific, because the endpoints name a deployment tenant. The same `.sppkg` can serve more than one tenant. Rebuild the ZIP after you edit both URLs.

The blog's license sentence says a Microsoft Copilot license. The manage page says users who use Cowork plugins must have Microsoft 365 Copilot licenses assigned. Keep the string that matches the client you open.

## Try this today

1. Open `config/package-solution.json` and copy `solution.id`.
2. Build `https://[prefix].sharepoint.com/_api/mcp/spfx?solutionId=` plus that id. Use the tenant root, not the admin host.
3. Put that complete URL in `mcpServerUrl` and in `runtimes[].spec.url`. Compare them before you zip.
4. Leave `functions` as `[]`, set `run_for_functions` to `["*"]`, and leave `mcp-tools.json` out of the ZIP.
5. Zip the five files with the packaging page's `Compress-Archive` lines, then upload through Agents > Tools > Registry > Upload if that control is the one on your screen.

When you open Agents > Tools, does the upload control say Registry, or does the screen still say Manage apps > Upload custom app?
