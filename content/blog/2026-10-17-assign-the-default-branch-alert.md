---
slug: "2026-10-17-assign-the-default-branch-alert"
title: "Assign the default-branch alert. Do not treat Generate Fix as the same button."
excerpt: "When agentic autofix is on, the free Generate Fix label on a code scanning alert becomes Assign to Copilot. Assign a default-branch backlog alert, and do not merge the changelog's access rule with the docs page."
date: "2026-10-17"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-17-assign-the-default-branch-alert"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "code scanning", "agentic autofix", "CodeQL"]
readTime: 11
image: "/images/blog/2026-10-17-assign-the-default-branch-alert-hero.png"
---

Assign the default-branch alert to Copilot. Do not treat Generate Fix as the same button. If you are about to click the old label on a code scanning alert, stop and read which product that click starts. I did not assign an alert, open a tenant, or call the REST API on this host. The steps below are the ones the October 15 changelog and the GitHub Docs pages actually print.

The dated primary is [Agentic autofix for code scanning alerts general availability](https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/). The page date is October 15, 2026. JSON-LD `datePublished` is `2026-10-15T13:49:20+00:00`, which matches the GitHub Changelog RSS `pubDate` of Thu, 15 Oct 2026 13:49:20 +0000. `article:modified_time` and JSON-LD `dateModified` are both `2026-10-15T14:16:31+00:00`. That publish time is still inside 48 hours of this morning.

The Foundry feed's newest item this morning is [What's new in Microsoft Foundry | September 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-september-2026/), `pubDate` Fri, 16 Oct 2026 02:04:50 +0000. That page is a September catalog, not this how-to. The changelog feed's newest item is a license-compliance title at Fri, 16 Oct 2026 14:00:32 +0000. I did not extract that page.

## Read the two products before you click

[About autofix for code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/autofix-for-code-scanning) splits the work. I did not find a last-updated date in that page's saved HTML. Cite it as the product page, not as a second news recap.

The concepts page says GitHub provides two autofix experiences. Both use large language models, data from the codebase, and code scanning analysis. They do not share a workflow. Use agentic autofix when you want Copilot to investigate and fix one or more alerts, end to end. You assign the alerts. Copilot explores the codebase, generates a fix, validates the changes, and opens a draft pull request. Use Copilot Autofix when you want a single suggested code change for one alert that you review and apply yourself.

The changelog describes the button swap. When agentic autofix is enabled, it replaces the free Generate Fix option on individual code scanning alerts with an Assign to Copilot button. "Free" is the changelog's word. Do not expand it into a price.

[Resolving code scanning alerts](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/resolve-alerts) prints the other click. If agentic autofix is not enabled, you can still use GitHub Copilot Autofix to generate a one-step suggested fix where supported. On that page the label is Generate fix, lowercase f. After the suggestion exists, Create PR with fix builds a new branch from the default branch, commits the fix, and opens a draft pull request. You test and edit it as you would any other fix.

Assign to Copilot starts an agent session. Generate fix is the suggested-change path that remains when agentic autofix is off. The concepts page says those suggested fixes don't consume AI credits. Keep that sentence on the concepts page. The changelog does not say Copilot Autofix is free of AI credits. It says the Generate Fix option is free, and that agentic autofix replaces it.

## Turn access on in the order the page you are citing uses

Do not merge the access paragraphs. The nouns do not match.

The changelog says an enterprise administrator enables access through the new "Agentic autofix" policy in Advanced Security policies. Once that policy is enabled, an organization or repository administrator turns agentic autofix on in the Code Security settings. Access also requires a Copilot billing method to be defined. The audience sentence on that page is GitHub Code Security and GitHub Advanced Security customers on GitHub Enterprise Cloud, including GitHub Enterprise Cloud with data residency.

[Managing access to agentic autofix for code scanning](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/managing-access-to-agentic-autofix-for-code-scanning) is the click path. I did not find a last-updated date in that saved HTML either. Its eligibility sentence is different. Agentic Autofix is available for public repositories on GitHub.com and for organization-owned repositories with GitHub Code Security or GitHub Advanced Security. Users don't need a GitHub Copilot license. It is not available for user-owned repositories in an enterprise that uses Enterprise Managed Users.

A billing method and a license are not the same noun. The changelog requires a Copilot billing method. The managing-access page says users don't need a GitHub Copilot license. I did not find the string "billing method" on the docs pages I fetched this run. Cite both. Do not pick one and drop the other.

Follow the managing-access cascade if you are in that page. For an enterprise-owned organization, an enterprise owner or security manager must allow organizations to configure agentic autofix. Allowing the feature does not enable it. The policy options that page prints are "All organizations: Allowed" and "All organizations: Not allowed," on the Agentic Autofix policy under Policies, then Advanced Security.

An organization owner or security manager can then enable it. The organization setting enables it for eligible repositories by default. Repository administrators can opt an individual repository out, or re-enable it, subject to the enterprise and organization settings. If you disable it at the enterprise or organization level, repository administrators cannot re-enable it.

For a standalone organization, skip the enterprise procedure. For an eligible public repository owned by a personal account, a repository administrator enables or disables it directly. Skip the enterprise and organization procedures for that repository.

If your organization used agentic autofix during the public preview, you must enable it again. That sentence is the managing-access page. The changelog does not say it. If the preview was on and the button still says Generate Fix, re-enable before you debug the alert.

The organization clicks are profile picture, Organizations, the organization, Settings, then Security and quality, Advanced Security, Global settings. Under Code scanning, set Agentic Autofix to On. The page says to coordinate opt-outs with repository administrators before you flip that setting.

The repository path is Settings, Security and quality, Advanced Security, then the Code Security section. Set Agentic Autofix to On or Off. After you enable it, users with write access can assign code scanning alerts to Copilot. Write access is that page. Do not invent a security-manager exception it does not print.

The concepts page uses a different Enterprise Managed Users phrase. It says agentic autofix isn't available for repositories owned by Enterprise Managed Users. The managing-access page says it is not available for user-owned repositories in an enterprise that uses Enterprise Managed Users. Do not treat those as one sentence. The concepts page also says you don't need a Copilot license, and that an enterprise owner or security manager must allow the feature before an organization owner or security manager enables it.

Copilot Autofix is the other access story. The concepts page says it is enabled by default for any repository that uses CodeQL, unless an administrator disables it. It is available to all public repositories on GitHub.com, and to internal or private repositories owned by organizations and enterprises that have a license for GitHub Code Security. Unlike agentic autofix, it is available for repositories owned by Enterprise Managed Users. If an enterprise owner disallows it, no organization or repository in that enterprise can enable it.

The resolve page adds one more noun for the suggested-fix path. You do not need a subscription to GitHub Copilot to use GitHub Copilot Autofix. Subscription, license, and billing method stay on the pages that printed them.

## Assign only a default-branch backlog alert

The changelog says agentic autofix supports code scanning alerts on the repository's default branch. Alerts detected only on pull requests or other branches cannot be assigned to Copilot. You can assign from any code scanning alert on that default branch. In the repository list or a security campaign, you can select up to 25 alerts for one pull request.

The resolve page adds a word. Agentic Autofix is only available for backlog alerts on the default branch. Copilot Autofix is also only available for backlog alerts on the default branch. Do not drop "backlog" because the changelog said "any." If the alert exists only on a pull request, stop. If it is on the default branch but it is not a backlog alert, follow the resolve page and do not assign it.

The single-alert clicks are on the resolve page. Open the repository. Open the Security and quality tab, or the dropdown if that tab is hidden. In the left sidebar, click Code scanning. Click the alert name. Towards the top, under Assignees, click Assign to Copilot.

For several alerts, start from the code scanning alerts backlog or a security campaign. Select up to 25. Above the list, click Assign to Copilot. One assignment creates one agent session and one pull request. Do not expect 25 pull requests from one click.

I did not click either button.

The REST wording does not match, and the schema page I fetched did not print the bot name. The changelog says you use the Update a Code Scanning Alert REST API by setting `assignees` to `["copilot-swe-agent[bot]"]`. The resolve page says you set the alert's assignee to `copilot-swe-agent[bot]`. One page prints an array field. The other prints a singular assignee and does not print the brackets. I fetched the enterprise-cloud REST URL the changelog links, `apiVersion=2026-03-10`. The saved HTML does not contain `copilot-swe-agent`. The operation body may be rendered in the browser. I did not get a parameter table, and I did not call the API. Use the UI path until the rendered schema shows the field.

## Expect a draft pull request, then read what it could not confirm

The changelog says Copilot explores relevant files, generates a proposed fix, validates it by rerunning CodeQL, iterates if needed, and opens a draft pull request. The pull request includes a summary of the fix, why it closes the alert, and the validation steps. When it is ready, you can ask for further changes by commenting on the pull request, or by interacting with the session in the Agents tab. "Agents tab" is the changelog. Do not rename it.

The resolve page says Copilot typically opens a draft pull request within a few minutes. "Typically" and "a few minutes" are that page. They are not a service level. The pull request is authored by Copilot. Review the agent session log, and interact with Copilot there. You can also mention Copilot in a pull request comment. If it cannot validate a fix, or if it thinks the alert might be a false positive, it says so in the pull request. That false-positive sentence is the resolve page. The changelog does not print it.

The concepts page is the limit on "confirm." Agentic Autofix works on a best-effort basis. Copilot validates fixes by re-running CodeQL with the code scanning query suite. It can't confirm fixes for alerts from custom CodeQL queries, the security-extended CodeQL query suite, or code scanning alerts from third-party tools. Always review and test the generated changes before you merge.

If the alert came from one of those three cases, do not tell the reviewer that CodeQL confirmed the close. The session may still open a pull request. Read the validation note first.

The same page says Copilot uses the custom instructions that apply when it generates a fix, and that the session explores the codebase beyond the affected file. A one-line alert can still produce a wider diff. Review the diff. I did not read a sample instructions file this run. Open the linked topic on that page if the repository has instructions you care about. Do not invent a path for them.

## Keep the credit sentence on the page that said it

The changelog says agentic autofix consumes AI Credits from your Code Security budget and GitHub Actions minutes. Usage shows in the "AI usage" section of enterprise billing and licensing as the "Advanced Security" product. You can set SKU level budgets for Code Security AI credits. I did not open a billing page, and I do not have a credit count.

The concepts page says each agentic autofix agent session consumes AI credits and GitHub Actions minutes, while Copilot Autofix suggested fixes don't consume AI credits. The resolve page repeats the Code Security AI Credits and GitHub Actions minutes line for the agent path. The managing-access page says to review how those credits and minutes affect your costs before you enable the feature.

Do not move the suggested-fix credit sentence onto the changelog. Do not tell a finance owner that Generate Fix is free of Actions minutes. The changelog calls the replaced option free. The concepts page is the one that separates AI credits. I did not find a sentence that prices the suggested-fix path in Actions minutes.

An organization enablement turns the feature on for eligible repositories by default. Read the cost note with the person who owns the Code Security budget before you flip that setting. If you still want the one-step suggestion on a repository, leave agentic autofix off there. The changelog says turning it on replaces Generate Fix on individual alerts.

If the organization already has Code Security and no Copilot seat, which sentence matched the button: the changelog's billing-method requirement, or the docs page that says you don't need a Copilot license?
