---
slug: "2026-11-09-read-the-chart-before-you-count-chat"
title: "Read the chart before you count chat as an adoption phase"
excerpt: "Open the Copilot impact dashboard after the usage metrics policy is on, then read Chat and the VS Code Agents window as feature engagement. The API value is still No Cohort."
date: "2026-11-09"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-09-read-the-chart-before-you-count-chat"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "impact dashboard", "usage metrics", "how-to"]
readTime: 7
image: "/images/blog/2026-11-09-read-the-chart-before-you-count-chat-hero.png"
---

You can see Copilot Chat on the impact dashboard chart now. Read that row as feature engagement on a 28-day report. The adoption phase stays on the qualifying-feature rule.

By the end you'll open the dashboard, keep Chat-first and `No Cohort` as two names for one cohort, and copy `chat` and `vscode_agent` from the feature array before you script a report.

The page is [Copilot impact dashboard adds chat and VS Code agent usage](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/), by Allison. The visible date line is November 6, 2026. JSON-LD `datePublished` is `2026-11-06T14:17:28-08:00` and also `2026-11-06T22:17:28+00:00`. Python compared those two stamps and they are the same instant. `article:modified_time` and JSON-LD `dateModified` are `2026-11-06T22:20:22+00:00`, 174 seconds later. Python put the publish stamp 61.80 hours before 7:05 AM Eastern on November 9. That clock is `2026-11-09T12:05:27Z`, from `date` this run.

The changelog links the impact dashboard how-to and the REST usage metrics page. I read the `/en/` copies: [Viewing the Copilot impact dashboard](https://docs.github.com/en/copilot/how-tos/administer-copilot/view-impact-dashboard) and [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/rest/copilot/copilot-usage-metrics). The how-to also links the concepts page and the reference pages below.

## Turn the policy on, then open the dashboard

Everyday version first. The chart stays blank until the company allows usage numbers. The real name is the Copilot usage metrics policy.

The changelog says the policy must be enabled. Access on that page is enterprise owners and billing managers, organization owners, and anyone with a custom organization or enterprise role that grants the `View Copilot Metrics` permission.

The how-to page uses a longer permission string: `View Organization Copilot Metrics` or `View Enterprise Copilot Metrics`. The who-can-use line there is enterprise owners, enterprise billing managers, organization owners, and people with a custom organization or enterprise role that carries one of those two permissions. Write down both permission names. The changelog string and the how-to string are two labels on the same door.

The how-to prerequisite says to access Copilot usage metrics, the "Copilot usage metrics" policy must be enabled. It links the enterprise policy article and the organization policy article.

The REST page is tighter. To enable these endpoints, the policy must be set to Enabled everywhere for the enterprise. Open the dashboard with the how-to sentence. Call the API with the REST sentence.

The click path the how-to prints starts at the enterprise:

- Navigate to your enterprise. The example is the Enterprises page on GitHub.com.
- Click the Insights tab.
- In the left sidebar, click Copilot impact.

Organization owners are on the who-can-use line. Follow the path the page prints.

Same page, different switch. The Copilot metrics industry comparison policy is disabled by default. When it is on, your enterprise or organization contributes aggregated metrics to peer cohorts and can view comparisons. When it is off, you don't contribute data or see comparisons. Leave that switch unless you came for the peer widget.

## Read the new rows as engagement

The changelog says the Agent adoption chart now includes Copilot Chat and the VS Code Agents window, so you can see engagement across nine Copilot experiences. The cohort called Passive users is now Chat-first users. Those users are active in Copilot but haven't used a qualifying feature on at least two days in the 28-day period, so they don't qualify for an adoption phase.

Adoption phases are unchanged. Chat and the VS Code Agents window are reported as feature engagement. They don't count toward adoption phases. Chat-first users are still the `No Cohort` value in the API, and cohort sizes don't change.

A user is engaged when they used the feature on at least two days in the 28-day period. One person can sit under more than one feature. Chat covers Copilot Chat use captured by usage metrics, including agent mode, so users who make agent edits are also counted under chat. Like the other seven features, these two show up only on enterprise and organization 28-day reports. Reports for periods before this change only include the original seven features.

The concepts page, [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/billing-and-usage/copilot-usage-metrics/copilot-metrics), already uses Chat-first users and says that phase is labeled `No Cohort` in the API. Its example is a person asking questions in Copilot Chat or agent mode without applying any code edits. Phase 1, Code first, is engagement with code completions and/or agent edits, where Copilot writes changes directly into files in the IDE. Using Copilot Chat or agent mode without producing code completion or agent edit activity does not qualify on its own.

The saved concepts text has no `VS Code Agents` string and no `vscode` string. The nine-row chart sentence lives on the changelog. The phase definitions live on the concepts page.

## Copy the feature array, then leave the other Agents fields alone

The field the changelog names is `copilot_feature_engagement.totals_by_feature`. It adds `chat` and `vscode_agent` entries to enterprise and organization 28-day reports.

Copy the names from [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics). `copilot_feature_engagement` is rolling feature engagement for the 28-day window, included only in enterprise and organization aggregate reports. It is null or absent when the optional calculation is unavailable, or when the report predates the field.

The array is sorted alphabetically by `feature`. It contains exactly one entry for each of these values: `agent_edit`, `chat`, `cloud_agent`, `code_completion`, `code_review_active`, `code_review_passive`, `copilot_cli`, `github_app`, and `vscode_agent`. A valid zero-user report includes all nine entries with `engaged_user_count` set to 0. A missing object means the calculation was unavailable or the report predates the field. A zero-user report still lists all nine.

`chat` and `vscode_agent` are reported for engagement only. Adoption phases stay on the other features. `chat` covers Copilot Chat use captured by usage metrics, including agent mode. Users counted under `agent_edit` are also counted under `chat`. Keep those counts separate. One person can engage with more than one feature, so a sum would count that person twice.

`vscode_agent` in this object is the dedicated VS Code Agents window. Agent mode in the editor sits under `chat`.

`github_app` in this object represents the Copilot app. Activity breakdown arrays such as `totals_by_feature` use `copilot_app` instead. Copy the name from the object you are reading.

The example schema, [Example schema for Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/example-schema), prints that same nine-entry array, including `"feature": "chat"` and `"feature": "vscode_agent"`, under `copilot_feature_engagement.totals_by_feature`.

That schema page also prints two other Agents-window fields, and they are a different job. `used_vscode_agent` and `totals_by_vscode_agent` sit at the top level of enterprise and organization per-user reports, in both 1-day and 28-day reports. `totals_by_vscode_agent` carries `session_count` and `total_user_messages`. Those fields are omitted when no dedicated Agents-window data is available, and `totals_by_vscode_agent` is omitted unless both counts are available. The chart row is the feature array. Sessions and user messages for one person are the top-level pair.

The REST endpoints page I saved this morning has zero hits for `totals_by_feature`, zero for `vscode_agent`, zero for `copilot_feature_engagement`, and zero for `chat`. The page header says API Version: 2026-03-10 (latest). Copy the names from the reference page and the example schema. Open the live REST page before you write a client that expects those keys in an endpoint sample. That count is of the file I saved.

## Leave the ROI card on the label it prints

The how-to page's "Transition your developers to be agent-first" card still says to compare "Phase 0-1 Passive and Code First Users" with "Phase 2-3 Agent First Users". Treat the figures as directional estimates rather than exact financial results.

The concepts page's Potential return on investment section uses that same Passive and Code First label. The cohort table above it already says Chat-first users.

The reference page says Chat-first users correspond to the `No Cohort` value in the API, and that `No Cohort` is displayed as "Chat-first users" in the impact dashboard. A user in this group can still be using Copilot regularly and consuming premium requests. The bar is a qualifying feature on at least two distinct days in the trailing 28-day window.

When you talk about the chart or the cohort table, say Chat-first. When you talk about that card, use the Passive label the card still prints. The changelog covers the cohort name and the chart. The card I saved still prints Passive.

## Try it on one 28-day report

Confirm the usage metrics policy is enabled. If the next step is an API call, read the REST page's Enabled everywhere sentence first.

Open the enterprise, then Insights, then Copilot impact.

On the Agent adoption chart, read Copilot Chat and the VS Code Agents window as engagement. Leave the adoption phase on the two-day qualifying-feature rule.

If you export a report, look for `chat` and `vscode_agent` inside `copilot_feature_engagement.totals_by_feature` on an enterprise or organization 28-day aggregate. A missing object means the calculation was unavailable or the report predates the field. A zero-user report still lists all nine entries. Older windows can still have the original seven.

On the return-on-investment card, read the label that is actually there.

When you open that card, does it still say Passive, or has the label caught up with Chat-first?
