---
slug: "2026-11-04-read-the-local-key-row-before-hosted-spend"
title: "Read the local-key row before you add it to hosted spend"
excerpt: "Download one finished day's Copilot user report and read the local-key columns before you fold those requests into the hosted bill."
date: "2026-11-04"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-04-read-the-local-key-row-before-hosted-spend"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "usage metrics", "BYOK", "how-to"]
readTime: 8
image: "/images/blog/2026-11-04-read-the-local-key-row-before-hosted-spend-hero.png"
---

Your Copilot cost-per-user number still mixes two bills. One is the model GitHub hosts. The other is a key the developer brought, or a model running on their own machine. Download one finished day's user report and read the local-key row before you add those requests to the hosted total.

The page I used is the [GitHub Changelog note on BYOK and enterprise custom models](https://github.blog/changelog/2026-11-03-byok-and-enterprise-custom-models-in-the-copilot-usage-api). JSON-LD `datePublished` is `2026-11-03T16:32:19-08:00`, the same instant as `2026-11-04T00:32:19+00:00`. Python put that at 11.46 hours before 7:00 AM Eastern on November 4. `article:modified_time` is `2026-11-04T00:34:01+00:00`, 11.43 hours before the same clock. The changelog RSS item is `Wed, 04 Nov 2026 00:32:19 +0000`.

By the end you can call the user report, find `used_local_byok`, and leave those counts out of the hosted bill.

## Call the user report for one finished day

The changelog says both kinds of bring-your-own-key usage show up in enterprise and organization reports, at the user and aggregate level, in 1-day and 28-day reports. The field you want first, `used_local_byok`, appears in user-level reports. The [REST page](https://docs.github.com/en/rest/copilot/copilot-usage-metrics) I opened this morning serves that report as download links, not as the rows themselves.

Start with one finished day. On the enterprise 1-day endpoint, the parameter table says the `day` query takes `YYYY-MM-DD`: "The day to request data for, in `YYYY-MM-DD` format." The user-report sample uses that same query name. The 28-day sample I read returns `report_start_day` and `report_end_day` instead of one `report_day`. Read one day first, so you are holding one calendar day.

This is the curl in the static HTML I saved for "Get Copilot users usage metrics for a specific day."

```bash
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YO...uot" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/users-1-day?day=DAY"
```

The token placeholder in that saved HTML is cut off at `<YO...uot`. Copy the sample from the docs page in a browser, then put a token that can read the report in that header. `ENTERPRISE` and `DAY` are the page's placeholders. The `X-GitHub-Api-Version` value on the sample is `2026-03-10`.

The sample response on that same section is:

```json
{
  "download_links": [
    "https://example.com/copilot-usage-report-1.ndjson",
    "https://example.com/copilot-usage-report-2.ndjson"
  ],
  "report_day": "2025-07-01"
}
```

Those links are the docs sample, including the `2025-07-01` date. Open the signed URLs your own call returns. The page says this endpoint retrieves download links for the Copilot user usage metrics report for a specific day, with user-specific metrics for that day.

Organization owners have a twin on the same page. The curl I saved uses the same three header lines and this path:

`https://api.github.com/orgs/ORG/copilot/metrics/reports/users-1-day?day=DAY`

Two policy sentences sit on two pages. Keep them apart. The changelog says the Copilot usage metrics policy must be enabled. The REST intro says the policy must be set to Enabled everywhere for the enterprise. Follow the sentence on the page you are using.

Who can call, from the changelog: enterprise owners, enterprise billing managers, organization owners, and anyone with a custom organization or enterprise role that grants `View Copilot Metrics`.

## Read the local-key row first

A developer's own key, or a model on their machine, belongs in its own column. The changelog name for that first kind is local BYOK. Say the everyday version to a colleague, then use the field name once: your own key, then `used_local_byok`.

The page says local BYOK is configured by the developer in the client. The request goes from Copilot CLI or the GitHub Copilot app straight to that person's provider key or local model. The examples it prints are Ollama, Foundry Local, LM Studio, and llama-server. On this page, Foundry Local sits in that local-model list.

In the user file, read `used_local_byok` first. The changelog says it records whether that user made at least one local BYOK request in Copilot CLI or the Copilot app that day.

Then read `totals_by_local_byok`. That breakout holds session, request, prompt, and token counts, split by `byok_kind` and `surface`. The kind names on the page are `local_managed`, `local_user`, `local_auto`, and `remote_user`. The surface names are `copilot_cli` and `copilot_app`. The page prints those four kind names and leaves their meanings off this note. Copy them as printed. This field appears in user-level and aggregate reports.

Aggregate reports also carry three user counts: `daily_active_local_byok_users`, `weekly_active_local_byok_users`, and `monthly_active_local_byok_users`. The changelog calls those distinct users with local BYOK activity for the day, the calendar week, and the calendar month.

Leave the local counts beside the hosted totals. The changelog says existing totals are unchanged. Local BYOK is a subset of `totals_by_cli` and `totals_by_copilot_app`. Adding the local row on top of those totals counts the same requests twice.

Treat the local numbers as a lower bound. The page says the fields rely on client telemetry, so they undercount when telemetry is disabled. Token counts can also undercount, because some local providers skip token usage. The changelog also says local BYOK usage has no model-name breakout. You can see that a person used a local key. You cannot see which local model name from these fields.

The reason to split the column is the spend line on the page: separate Copilot-hosted usage from usage billed by your own provider or run on free local models, so cost per user reflects what Copilot actually serves.

## Keep the custom-model flag on its own entry

The second kind is an enterprise custom model. An admin sets it in GitHub settings, and the request still routes through GitHub to your provider. Find it with `is_custom_enterprise_model` inside `totals_by_client`.

The changelog adds that flag as a boolean on each `totals_by_client[].totals_by_model[]` entry. True means the request used a custom model configured for your enterprise or organization. GitHub observes those requests server-side, so the field covers every client, including IDEs. Custom model entries include real request and token counts.

A model used both as a Copilot-hosted model and as a custom model appears as two entries, so the counts stay separate. Read the flag, then keep the true entry in its own column. Custom model usage is already inside `totals_by_client`. Adding that true row on top of the client total counts the same requests twice, the same mistake as the local-key row.

The [data-available page](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) I opened still defines `totals_by_client` as a per-client breakdown of successful model requests that went through the Copilot API, counted server-side. A search of that saved HTML found 57 hits for `totals_by_client` and zero hits for `is_custom_enterprise_model`. Use the array as the place the new boolean sits. Copy the boolean's name from the changelog.

Unrecognized custom model names appear as `unknown`. Report days before this release don't include `is_custom_enterprise_model`. Leave last month's file out of that comparison. On the day you just downloaded, look for the key on each `totals_by_model` entry. The page doesn't say every later row prints the key when the value is false.

Enterprise custom model counts are observed server-side. The changelog says they don't have the telemetry limitation that sits on the local fields. Keep the two kinds in two columns. One can undercount. The other is the server's count.

## Copy the names from the changelog

I searched the REST HTML, the data-available HTML, and the [example-schema HTML](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/example-schema) I saved this morning. `used_local_byok`, `totals_by_local_byok`, and `is_custom_enterprise_model` were absent from all three. On the reference pages, the string BYOK was a sidebar link to the Copilot SDK auth article at `/en/copilot/how-tos/copilot-sdk/auth/byok`. That is a different URL from the usage report. Copy the field names from the changelog until those docs rows show up.

Try this today. Call the user 1-day report for one finished day, open the ndjson behind `download_links`, and search for `used_local_byok` before you add any of those counts to hosted spend. Leave last month's file out of the custom-model comparison. The changelog says report days before this release don't include `is_custom_enterprise_model`.

When a local provider skips token counts, which count that you do have, sessions or requests, are you willing to use as the lower bound for that person this week?
