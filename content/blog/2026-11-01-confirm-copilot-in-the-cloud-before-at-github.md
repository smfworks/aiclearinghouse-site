---
slug: "2026-11-01-confirm-copilot-in-the-cloud-before-at-github"
title: "Confirm Copilot in the cloud before you type @GitHub"
excerpt: "The Teams announcement asks admins to enable cloud sandboxes. The page it links names the control Copilot in the cloud, and that policy is on by default. Add the app after that check, then type @GitHub help."
date: "2026-11-01"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-01-confirm-copilot-in-the-cloud-before-at-github"
categories: ["Microsoft", "GitHub", "AI Agents"]
tags: ["GitHub Copilot", "Microsoft Teams", "Copilot in the cloud", "how-to"]
readTime: 10
image: "/images/blog/2026-11-01-confirm-copilot-in-the-cloud-before-at-github-hero.png"
---

If your team wants GitHub Copilot inside a Teams thread, confirm Copilot in the cloud before anyone types `@GitHub`. The [Teams announcement](https://techcommunity.microsoft.com/blog/microsoftteamsblog/the-github-app-in-microsoft-teams-is-now-generally-available/4569136) from October 30 asks GitHub admins to enable cloud sandboxes. The [page that link opens](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/enabling-or-disabling-cloud-sandboxes-for-your-organization) names a different control, Copilot in the cloud, and says that policy is already on by default. Add the app, click Get started, then type `@GitHub help`.

I opened the announcement HTML, the admin pages it links, and [teams.github.com](https://teams.github.com) this morning. HTML `postTime` is `2026-10-30T14:12:20.741-07:00`. That instant is `2026-10-30 17:12 EDT` and `2026-10-30 21:12 UTC`. Python put it 38.79 hours before `2026-11-01 07:00` America/New_York, inside 48 hours. JSON-LD `datePublished` is `10/30/2026, 9:12:20 PM` with no timezone. Read as UTC, that matches `postTime`. `lastEditTime`, `lastPublishTime`, and `article:modified_time` are `2026-10-30T14:49:46.436-07:00`. JSON-LD `dateModified` is `10/30/2026, 9:49:46 PM` with no timezone, which matches that edit clock read as UTC. `revisionNum` is 7. The HTML `latestVersion` field is major `2`, minor `0`. The saved HTML has `article:modified_time` and no `article:published_time` meta, and it does not contain the words `Version 2.0`. Use the clocks above. Skip a footer label the HTML does not contain.

## Follow the page's own order

Under Get started today, the announcement prints three user clicks, then the admin list.

1. Add the [GitHub app](https://teams.microsoft.com/l/app/ca9e26b7-dce5-44a0-b2b7-a70a3d65ce25?source=store-item). The app id on that link is `ca9e26b7-dce5-44a0-b2b7-a70a3d65ce25`.
2. Click Get started on the welcome message. The page says the guided web onboarding signs you in through the default browser, using saved passwords or passkeys, and grants Teams access to the organizations and repositories you choose.
3. Type `@GitHub help` to see what else it can do.

The next sentence says admins should verify three enables for users to get started. If you are rolling this out, do that list before the first mention. The page lists the three enables. It does not rank which one fails first.

Microsoft 365 admins: [resource-specific consent](https://learn.microsoft.com/en-us/microsoftteams/manage-consent-app-permissions), so users can let the GitHub app use conversation context. The linked page says you define those permissions in the app manifest, not in the Microsoft Entra admin center, and that team owners can grant them when they add the app to a team or a chat. The [platform page](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent) that article points to says delegated RSC tenant controls are always on. Application RSC has separate tenant controls: Microsoft Graph for chats and meetings, and the Microsoft Entra admin center for Teams. The announcement's reason is the user grant, conversation context. Ask the Microsoft 365 admin to confirm a user can grant that when they add the app. The announcement does not name an RSC permission string.

Teams admin center admins: the [GitHub app is allowed](https://learn.microsoft.com/en-us/microsoftteams/manage-apps) for users. The page title this morning was "Overview of agent and app management and governance in Teams admin center," and the footer said last updated on 2026-07-08. To allow an app, that page says you do both org-wide app settings and app centric management. To block an app, any one of those is enough. It also says tenants are automatically migrated to app centric management starting from April 2025. The admin center page it links is [Manage apps](https://admin.teams.microsoft.com/policies/manage-apps). Have the Teams admin find GitHub there and confirm it is allowed for the people who will type `@GitHub`. The public Learn page does not show your tenant's row.

GitHub enterprise admins: Copilot cloud agent, [cloud sandboxes](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/enabling-or-disabling-cloud-sandboxes-for-your-organization), and [CLI billing](https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/creating-github-agentic-workflows#enabling-organization-billing), for each organization, plus [assign GitHub Copilot licenses](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/grant-access). Those are three links. Open each one. They do not share one checkbox.

## Select Copilot in the cloud

The sandbox page says enterprise owners and organization owners can use that feature. It also says cloud sandboxes don't have their own access setting, and you can't opt out of them separately from Copilot policies. The control it names is the Copilot in the cloud policy. That policy decides whether members can run Copilot agents in a cloud environment GitHub manages, from any Copilot client. The page says the policy is enabled by default. When it is disabled, Copilot can't create cloud sandboxes for those members. Spending sits in a budget on the same page, separate from the access policy.

The click path is on [Managing GitHub Copilot in the cloud for your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-copilot-in-the-cloud). That page points at [Managing policies and features](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies) for the dropdown, and it says: for the Copilot in the cloud policy, select Enabled.

Organization owner, one organization:

1. Click your profile picture, then Organizations.
2. Open the organization, then Settings. If Settings is hidden, open the dropdown and click Settings.
3. In the sidebar, under Code, planning, and automation, click Copilot, then Policies.
4. On the Copilot in the cloud policy, select Enabled.

That organization page says Copilot in the cloud is enabled by default for members assigned a GitHub Copilot Enterprise or Copilot Business license by the organization. If the enterprise owner has already chosen enabled everywhere, disabled everywhere, or selected organizations only, the organization page cannot override that setting. Read the dropdown. A locked value means the enterprise policy is the door.

Repository access is a second control on the same cloud page, and it is the repository list, not the sandbox switch. By default, GitHub's cloud agent is available in every repository where Copilot in the cloud is enabled. To narrow it, open Settings, then Copilot, then Cloud, and use Repository access. If you choose Selected repositories, pick them and click Select. Once the agent is enabled for a repository, any user with Copilot access and write permission on that repository can delegate work to Copilot.

The announcement's "Copilot cloud agent" and "cloud sandboxes" land on that one policy plus the repository list. Confirm Enabled. Then decide whether every repository in the organization should accept the agent.

## Use the billing policy the link names

The CLI billing anchor sits on [Creating GitHub Agentic Workflows](https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/creating-github-agentic-workflows#enabling-organization-billing). That article says GitHub Agentic Workflows are in public preview. The policy name on the anchor is "Allow use of Copilot CLI billed to the organization." If the Copilot CLI policy is already enabled, the billing policy is enabled by default.

The page's clicks for an organization administrator:

1. Profile picture, Organizations, the organization, Settings.
2. Copilot, then Policies.
3. Enable Copilot CLI, then enable Allow use of Copilot CLI billed to the organization.

The announcement uses that anchor for the words CLI billing. The section itself is about billing Copilot CLI requests from an organization-owned repository, with `copilot-requests: write` in the workflow frontmatter. Use the policy name when you talk to the GitHub admin. The settings page prints that longer name.

## Assign a seat

The license page is [Giving users GitHub Copilot in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/grant-access). Enterprise owners use it, on Copilot Business, Copilot Enterprise, or the Copilot access plan. The page says users must receive an assigned Copilot seat, regardless of billing model. The button depends on the plan.

With Copilot access: Billing and licensing, Licensing, Manage in the Copilot access section, then Assign access. With Copilot Business: Manage next to Copilot, then Assign licenses. Organization access is a separate choice on that Manage page: all organizations, or specific organizations. A Copilot Enterprise plan can assign Copilot Enterprise or Copilot Business per organization. Open the section that matches the plan printed on the page.

With Copilot access, members without a GitHub Enterprise Cloud license receive Copilot Standalone at $10 USD per month. That price is on the grant-access page. The same page says usage is metered and billed separately.

## Add the app, then type @GitHub help

After the three confirms:

1. Add the app from the store link. The same app id is on the announcement and on the Add to Teams button at teams.github.com.
2. Click Get started on the welcome message and finish the browser sign-in.
3. Type `@GitHub help` before you hand it a real bug.

In that conversation you can ask for a default repository, or ask it to switch repositories. You can also choose the model. The announcement's split is a faster model for a quick fix, and a more capable model for a larger change. The page does not name the models.

When a notification needs a fix, reply in that notification with `@GitHub`. The announcement says Copilot can investigate, make the fix, and draft a pull request in that same thread. Issues and pull requests created from Teams carry attribution, and reviewers can link back to the Teams conversation. A reply in the notification thread is the path the page describes. A fresh chat is a separate conversation.

Click Open Canvas to read the plan, the file changes, and the pull request. Canvas is the review pane on that page, beside the conversation.

If the task spans repositories, say so in that same conversation. The page calls that multi-repo support.

If you need another tool, the announcement points at [Configure MCP servers for your repository](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers). The clicks there are repository Settings, Copilot, MCP servers, then Save MCP configuration. The page says Copilot will use those tools on its own and will not ask for approval first, and it recommends an allowlist of specific read-only tools. It covers Copilot cloud agent, automations, and code review. It does not mention Teams. The organization cloud page has a separate optional policy, MCP servers on GitHub.com, which you set to Enabled. Use the repository page for the JSON. Use the policy when the organization has MCP turned off.

## The linked site still documents subscribe

The announcement's last link is `http://teams.github.com`. I opened `https://teams.github.com`. The page that came back still leads with `@github subscribe [repository name]` for commits, pull requests, issues, status updates, comments, and code reviews. It also documents opening an issue, commenting, and unfurling GitHub links. The Add to Teams button uses the same app id as the announcement. For this setup, follow the announcement: Get started, then `@GitHub help`. Use `@github subscribe` when you want the notification stream that site still documents.

## Try this before the first real bug

If you own the organization, open Copilot, then Policies, and read the Copilot in the cloud dropdown. Enabled is the value the sandbox page is talking about. If you are the person in Teams, add the app, click Get started, type `@GitHub help`, and finish that welcome path before you ask for a fix.

If Copilot in the cloud was off in your organization, which page did you use to turn it back on: the organization Policies dropdown, or an enterprise policy the organization page could not override?
