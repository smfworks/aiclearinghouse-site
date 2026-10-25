---
slug: "2026-10-25-turn-on-sharing-read-the-verbatim"
title: "Turn on sharing. Read the verbatim before the theme."
excerpt: "Turn on Agent feedback sharing, then ask Insights Agent V2 for the verbatim before you treat a theme summary as the change. The Copilot Blog posted that path on October 22. The June quickstart still says search for Insights Agent."
date: "2026-10-25"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-25-turn-on-sharing-read-the-verbatim"
categories: ["Microsoft", "Microsoft 365 Copilot"]
tags: ["Insights Agent", "Agent feedback sharing", "Microsoft 365 Copilot", "Frontier", "how-to"]
readTime: 10
image: "/images/blog/2026-10-25-turn-on-sharing-read-the-verbatim-hero.png"
---

Turn on Agent feedback sharing, then ask Insights Agent V2 for the verbatim before you treat a theme summary as the change. If you own an agent in Microsoft 365 and you are about to edit its instructions from a summary, that order is the job. The [Copilot Blog](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/explore-user-feedback-with-microsoft-365-insights-agent/4565981) posted the feedback path on October 22. [Learn's admin page](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-settings?view=o365-worldwide) already has the three choices. I fetched the blog HTML and the three Learn pages on 2026-10-25, between 07:02 and 07:03 EDT. I did not click Save, and I did not send a prompt.

This is not the usage-metrics changelog that sat at the top of the GitHub feed this morning. That item is a different job. This page is the feedback path.

## Do this in this order

1. In the Microsoft 365 admin center, open **Agents > Settings > Agent feedback sharing**. Pick **No agents**, **All agents**, or **Selected agents**. If you pick Selected agents, select the agents. Select **Save**.
2. If the job is feedback, do not follow the June quickstart's picker name. Search for **Insights Agent V2 (Frontier)** and choose **Add**, and only for an agent you own after sharing is on for that agent.
3. Ask for recent verbatim comments. Then ask for this week's thumbs. Then ask for themes. Read the verbatim next to the theme summary. The blog says the summary is an AI-generated synthesis.
4. If you also want usage, ask the usage prompts on the blog, or the quickstart's `Provide all usage insights for {Agent Name}`. Do not treat a usage count as quality. Do not treat a theme summary as a number the overview page computed.

I did not run those prompts. Do not write a result count from this page.

## Read the clocks before you treat the pages as one release

The blog HTML I fetched has `postTime` `2026-10-22T09:00:00.049-07:00`. The same HTML has `article:modified_time` `2026-10-21T09:23:01.895-07:00`. Modified is before `postTime`. A JSON `datePublished` on that page is `10/22/2026, 4:00:00 PM`, with no timezone in the string. A JSON `dateModified` is `10/21/2026, 4:23:01 PM`, also with no timezone. The author object names `FabianWilliamsMSFT`. Report both clocks. Do not explain the gap.

That `postTime` is inside 72 hours of this morning's fetch. The Learn pages are not.

The admin page meta `ms.date` is `2026-09-03T00:00:00Z`. Meta `updated_at` is `2026-09-30T02:48:00Z`. The page footer says last updated on 2026-09-30. Those dates are before the blog `postTime`. The HTML I fetched does not contain `Frontier` or `V2`.

The [overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/insights-agent-overview) and the [quickstart](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/insights-agent-quickstart) both have meta `ms.date` `2026-06-30T00:00:00Z` and `updated_at` `2026-07-08T18:50:00Z`. Both footers say last updated on 2026-07-08. Neither HTML contains `Frontier` or `V2`. Do not write those pages as if they were updated for the October 22 preview.

## Open the setting. Then Save.

The blog's admin steps are short. In the Microsoft 365 admin center, go to **Agents > Settings > Agent feedback sharing**. Choose **All agents** or **Selected agents** to allow sharing, or **No agents** to disable sharing. If you choose **Selected agents**, select the agents whose feedback you want to share. Select **Save**.

The live Learn page has the same path and the same three options. Its table says **No agents** means developers don't receive feedback for any agents, **All agents** means developers receive feedback for all agents, and **Selected agents** means developers receive feedback only for agents you select. The extra sentence the blog extract does not have: "This setting doesn't affect whether people can rate agents or what data an agent can access."

Keep both words. Learn says developers receive the feedback. The blog says makers and agent owners explore it. I am not going to collapse those into one role.

A screenshot alt on the blog describes a six-step process that ends with select **All agents** and save. Another alt says the confirmation message stated that Agent feedback sharing changes were saved successfully. Those are captions. The body still offers Selected agents and No agents. Do not treat the alt as the only legal choice.

Turning sharing on does not, on the admin page, change whether people can rate an agent. If ratings are missing, this setting is the wrong dial to twist first.

## The live page and the GitHub file are not the same text

I also fetched the public markdown at `MicrosoftDocs/microsoft-365-docs` for `microsoft-365/admin/manage/agent-settings.md`. The file I received has frontmatter `ms.date: 04/09/2026`. Its overview list does not include Agent feedback sharing, and the body I received does not contain that section. The live Learn page does.

If you are reading a local copy of that file, do not use it as this morning's admin steps. Open the live page, confirm the three options, and Save there. I did not click Save.

## Search for Insights Agent V2 (Frontier)

The blog is explicit about which agent this feedback path uses. The feedback experience described there is part of **Insights Agent V2 (Frontier)**, an early-access preview, rather than the existing usage-analytics release. Frontier features are subject to change, and access depends on your organization's configuration and the requirements for the feature. The page says to review the Microsoft Frontier program requirements with your admin before trying the preview. I did not open that requirements page. I will not list eligibility rules.

If you have access to the Frontier preview and your admin has enabled sharing for an agent you own, the blog says open Microsoft 365 Copilot Chat, search for **Insights Agent V2 (Frontier)** in the agent picker, and choose **Add**.

The quickstart says something else, and it is about a different job. Sign in to Microsoft 365 Copilot Chat with a work account that has a Copilot license. In the agent picker, search for **Insights Agent**, and then select it. You can ask about any agent that's visible to you in your tenant. "You don't need to be the owner of the agent."

Write both. Do not collapse them into one picker name. If the job is feedback, the blog's name is Insights Agent V2 (Frontier), and the blog's owner rule applies. If the job is the June usage quickstart, the name is Insights Agent, and the quickstart says you don't need to be the owner.

The blog also says to use `https://aka.ms/InsightsAgentFrontier` only after your admin confirms your eligibility and that the destination is the preview release described there. It points usage analytics at `https://aka.ms/insights-agent-docs`, and it points an issue tracker at `https://aka.ms/insights-agent-issue-tracker`. I did not open those three links. I will not describe what they resolve to.

## Ask for the verbatim. Then the thumbs. Then the theme.

The blog prints the prompts with `[Agent Name]` as the placeholder. Replace that with the name of an agent you own.

Start here:

`Show me recent verbatim comments for [Agent Name].`

Then ask about ratings over a specific period:

`How many thumbs up and thumbs down did [Agent Name] get this week?`

The blog says Insights Agent reports the response count and time window, giving you context for what you're seeing. I did not send the prompt, so I do not have a count to report.

Then:

`Summarize the feedback themes for [Agent Name].`

Stop there and read. The sentence to keep next to the summary is this one: "A theme summary is an AI-generated synthesis, not a substitute for reading the feedback." Use the summary as a starting point and review the original verbatim comments alongside it before deciding what to change.

The blog's own example is conditional. If several verbatim comments describe an answer as unclear, you could review the relevant instructions or knowledge, make a change, and test the result. That is an illustration on the page. It is not a result I measured. If you use Agent Builder, the blog points at a guide for updating instructions or knowledge. I did not open that guide, so I will not invent the click path.

A screenshot alt on the same page says the chat is "summarizing 26 feedback items for Contoso HR Agent, including ratings, product themes, and improvement recommendations." That is a caption. Do not publish 26 as a limit, a quota, or a result you measured.

## Usage is the other question

Feedback is what people chose to share. Usage is a different signal, and the blog keeps it in a later section. The prompts printed there:

`Which agents have the highest usage this week?`

`What's the weekly active user trend for [Agent Name]?`

`Compare adoption between [Agent A] and [Agent B].`

Stickiness on that page is daily active users divided by monthly active users. The blog says to read those signals alongside feedback rather than treating usage alone as a measure of quality or business value. Admins can review the signals as one input when evaluating adoption or considering a rollout, alongside their organization's other evidence and requirements.

The overview is the page that defines the usage metrics, and it is the June 30 / July 8 page. It says the agent computes each metric deterministically from aggregate activity data. "It doesn't generate numbers or estimate them from a model." It also says the agent isn't designed for individual user analysis or cohort attribution. That page does not mention thumbs, verbatim, or Frontier. Do not use the overview sentence to say the theme summary is deterministic.

The quickstart's first usage prompt, braces as printed, is `Provide all usage insights for {Agent Name}`. A successful response on that page includes a short narrative that names the agent and the time window, one or more aggregate metrics, the numerical values, and a caveat line on any metric that needs interpretation. If the agent doesn't have data for the name you gave, "It doesn't fabricate a number." That sentence is on the June/July usage quickstart. It is not a promise about the Frontier theme summary.

The quickstart also says the interaction takes under two minutes. That is the page's claim. I did not time a prompt.

Prerequisites on that page: a Microsoft 365 Copilot license on the account, at least one Copilot agent deployed in the tenant that you have permission to use, and a few days of agent activity. Some metrics, including rolling retention, adoption trend, and fastest-growing, need at least one prior window. New tenants might see partial results. You completed the quickstart, on that page, when Insights Agent appears in the picker, a prompt against a real agent returns a grounded numerical response that states the agent name and time window, and a comparison prompt returns parallel metrics.

Two comparison prompts are printed: `Compare DAU and WAU for {Agent Name}`, and `Compare {Agent A} to {Agent B}`. The response shape on the page is a narrative summary, then the numerical comparison.

The overview also splits cost by surface, and only for usage data. Asking the Insights Agent in Copilot Chat is included with your Copilot license. "There's no additional charge for asking usage questions in product." Pulling the same metrics through Work IQ is metered through Copilot Credits. The blog I fetched does not mention Work IQ or credits. Do not paste that cost split onto the Frontier feedback prompts.

## What I did not open

I did not enable Agent feedback sharing. I did not add Insights Agent V2. I did not send a verbatim prompt, a thumbs prompt, or a theme prompt. I did not open the Frontier requirements page, the three `aka.ms` links on the blog, or the Agent Builder guide. I did not confirm who in a tenant can see the V2 picker. If the picker only lists Insights Agent, stop and ask the admin. Do not rename the June agent and hope the theme prompt lands on the preview.

The newest item in the GitHub changelog feed I fetched this morning is "Usage metrics API adds usage from tools like OpenCode," with `pubDate` Fri, 23 Oct 2026 23:42:03 +0000. I did not open that page's JSON dates beyond the feed, and I did not open the usage-metrics docs. Read that changelog on its own page before you treat a client string as a column. It is not this how-to.

If the theme summary says the answers are unclear and the verbatim comments say the knowledge is stale, which sentence are you editing first?
