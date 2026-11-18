---
slug: "2026-11-18-update-the-cli-then-sign-in-with-the-organization"
title: "Update Copilot CLI, then sign in with the organization account"
excerpt: "Copilot CLI 1.0.113 adds a company Microsoft sign-in on Windows and macOS. Update first, run /login, and pick Your organization (Microsoft Entra). Then check which license that door uses."
date: "2026-11-18"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-18-update-the-cli-then-sign-in-with-the-organization"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "Copilot CLI", "Microsoft Entra", "how-to"]
readTime: 8
image: "/images/blog/2026-11-18-update-the-cli-then-sign-in-with-the-organization-hero.png"
---

Update Copilot CLI, then sign in with the organization account. Inside the session, `/login` lists that account as Your organization (Microsoft Entra). The company Microsoft sign-in can open a managed GitHub user the company owns, a Microsoft 365 Copilot license, or both, depending on what the company already turned on.

By the end you will update the CLI, pick that menu item, and know which license each door uses.

## Update to 1.0.113 or later

The news is the GitHub Changelog post [GitHub Copilot CLI adds Microsoft Entra sign-in as a preview](https://github.blog/changelog/2026-11-17-github-copilot-cli-adds-microsoft-entra-sign-in-as-a-preview). I fetched that URL this morning. HTTP 200. The saved HTML is 107,251 bytes. The person name in the page JSON-LD is Allison.

The graph JSON-LD `datePublished` is `2026-11-17T18:00:35+00:00`. The same instant is also printed as `2026-11-17T10:00:35-08:00`. `dateModified` and the meta `article:modified_time` are `2026-11-17T19:00:37+00:00`. The changelog feed `pubDate` for this item is `Tue, 17 Nov 2026 18:00:35 +0000`, the same instant as `datePublished`.

Python, against the fetch clock `2026-11-18T12:01:38Z` (7:01 AM Eastern), put `datePublished` 18.02 hours earlier and `dateModified` 17.02 hours earlier. Against 07:00 ET (`2026-11-18T12:00:00Z`) those ages are 17.99 hours and 16.99 hours. Inside 48 hours.

The newest item on that same feed is OpenAI's GPT-6.2 Astra and GPT-6.2 Sol, `Tue, 17 Nov 2026 20:20:29 +0000`. This sign-in item is eighth on the ten-item feed I saved. The sign-in page prints the menu. That is the how-to.

The page says GitHub Copilot CLI now supports Microsoft Entra authentication in public preview. You can sign in with your Microsoft Entra account to silently authenticate to a linked GitHub Enterprise Managed User account, use your Microsoft 365 Copilot license, or both, depending on your organization's entitlements.

Microsoft Entra is the company identity directory. The CLI calls that sign-in Microsoft Entra authentication. A GitHub Enterprise Managed User is the managed GitHub account the company owns. The changelog shortens that to EMU.

The same page says version `1.0.113` or later is required, and that you update with `copilot update`.

I read the GitHub release API in this run. The clock on that command was `2026-11-18T12:03:20Z`. Stable tag `v1.0.113` has `published_at` `2026-11-17T16:35:43Z` and `created_at` `2026-11-13T23:59:42Z`. Python puts the publish instant 19.46 hours before that clock and 19.40 hours before 07:00 ET. The body is one bullet: administrators can disable built-in Browser Use with the managed setting `features.browserUse`, including in running sessions. The Entra sign-in steps stay on the changelog.

Stable tag `v1.0.114` has `published_at` `2026-11-18T05:59:26Z`. Python puts that 6.07 hours before the same clock and 6.01 hours before 07:00 ET. The body is the date line and `Fixes and changes`. The Entra sentences stay on the changelog.

On this Linux host, `copilot --version` printed `GitHub Copilot CLI 1.0.114.` `uname -srm` printed `Linux 7.2.15-1-omarchy x86_64`. The installed version meets the floor the changelog names.

## Pick Your organization inside /login

The click path is [Authenticating GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli). I fetched the HTML and a markdown copy this morning. HTML HTTP 200, 703,879 bytes, final URL unchanged. The markdown request, with `Accept: text/markdown`, returned HTTP 200 and 16,810 bytes.

The organization section on that markdown says authentication with a Microsoft Entra account is supported on Windows and macOS in Copilot CLI version 1.0.113 and later. A note above that sentence says using Microsoft Entra with Copilot CLI is in public preview and subject to change.

The steps in that section are two lines. Run `/login` in Copilot CLI. Select Your organization (Microsoft Entra). The page says Copilot CLI automatically signs you in with your existing Microsoft Entra account.

The same markdown prints the `/login` account menu under the OAuth section:

```text
What account do you want to log into?
 1. GitHub.com
 2. GitHub Enterprise Cloud with data residency (*.ghe.com)
 3. Your organization (Microsoft Entra)
```

That menu's step says the same auto sign-in sentence if you select the organization item. The later clicks in that OAuth section are the browser flow, the device-code flow, SAML Authorize, and Authorize GitHub Copilot CLI. Those clicks sit in the OAuth section. The organization section stops at the automatic sign-in. Follow the organization section for this door.

`copilot login --help` on this host returned 2,786 bytes. The text says "Authenticate with Copilot via OAuth." It names a browser flow, a device-code flow, and `--host` for a GitHub Enterprise Cloud data-residency hostname. A search of that help text found zero `Entra` and zero `organization`. The organization menu is the `/login` item on the docs page.

The changelog says Microsoft Entra authentication for both EMUs and Microsoft 365 Copilot is currently supported on Windows and macOS. Linux support will follow. The docs markdown I saved has the Windows and macOS sentence. A search of that markdown found zero `Linux support will follow`. Leave that sentence on the changelog.

The changelog HTML I saved has zero `/login`. Leave that command on the docs page.

## Read the license before you trust the picker

Two doors sit on the changelog. Read them as two licenses.

The managed-user door, on the changelog: the tenant uses OpenID Connect, shortened there to OIDC. You need an assigned Copilot Business or Copilot Enterprise license, and the organization must enable the Copilot CLI policy. In that scenario the CLI uses GitHub inference, and usage is governed by the organization's GitHub Copilot plan. GitHub inference means the answers come through the company's GitHub Copilot plan. The page says you can access GitHub from the CLI using your Microsoft Entra identity without a separate GitHub sign-in. It also says this SSO experience is currently limited to GitHub Copilot CLI and VS Code, and is available only to enterprises using OIDC for EMU.

The docs markdown's managed-user prerequisite says the tenant must use OIDC to connect to GitHub Enterprise Managed Users, and it points at Enterprise-Managed Authorization. A search of that markdown found zero `Copilot Business` and zero `Copilot Enterprise`. The license sentence stays on the changelog.

The HTML page has a box the markdown copy left out. The box is titled "Who can use this feature?" It says GitHub Copilot CLI is available with all Copilot plans, and that if you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings. That box sits above the section list. Keep the policy sentence, and keep it in that box.

The Microsoft 365 door, on the changelog: if the organization is in Frontier and has a Microsoft 365 Copilot license with usage-based billing, the CLI uses Microsoft 365 inference rather than GitHub inference, and you don't need a GitHub account. Microsoft 365 inference means the answers come through that Microsoft 365 Copilot license. Model access and usage limits are managed through the organization's Microsoft 365 Copilot settings.

The docs page says this license path is for Frontier customers only. It names three admin settings in the Microsoft 365 admin center. The Microsoft Copilot Code spending policy, which a Billing Administrator or a Global Administrator can enable. The Copilot Frontier setting, which an AI Administrator or a Global Administrator can update. The GitHub Copilot access (Frontier) setting, which is disabled by default, and which a Global Administrator can update. A search of the changelog HTML found zero `disabled by default`. Those three setting names stay on the docs page.

After you sign in, the docs page says models permitted by your entitlements appear in the `/model` picker. The changelog HTML I saved has zero `/model`. Leave the picker sentence on the docs page.

The docs page also says three GitHub-hosted features need a GitHub sign-in beside the organization account: `/delegate`, the GitHub MCP server, and GitHub Code Search. You can combine the organization sign-in with a GitHub sign-in when you want those.

## Try it on Windows or macOS

Run `copilot update`. Open Copilot CLI. Run `/login`. Select Your organization (Microsoft Entra). Then run `/model` and read the names the company already permitted.

If you are on Linux, keep the changelog's sentence: Linux support will follow. The version check still works here. The organization menu is the Windows and macOS step those pages print.

If the company has both an EMU seat and a Microsoft 365 Copilot license, which name shows up first in `/model` after that sign-in?
