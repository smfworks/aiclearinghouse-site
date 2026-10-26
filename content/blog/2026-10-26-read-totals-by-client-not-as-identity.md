---
slug: "2026-10-26-read-totals-by-client-not-as-identity"
title: "Read totals_by_client. Do not treat client as identity."
excerpt: "Download the Copilot usage report and read totals_by_client from the October 23 changelog. The reference pages fetched this morning do not print that field name. Do not treat client as a person, or request_count as a prompt count."
date: "2026-10-26"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-26-read-totals-by-client-not-as-identity"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "usage metrics", "totals_by_client", "how-to"]
readTime: 9
image: "/images/blog/2026-10-26-read-totals-by-client-not-as-identity-hero.png"
---

Download the Copilot usage report, then read `totals_by_client`. Do not treat the `client` string as a person, and do not treat `request_count` as a prompt count. If you administer GitHub Copilot and someone asks which tools are calling the model, that is the job. The [changelog](https://github.blog/changelog/2026-10-23-usage-metrics-api-adds-usage-from-tools-like-opencode) posted the field on October 23. I fetched that page, the REST page, the reference index, the data page, and the example schema on the morning of 2026-10-26. I did not call the API, and I did not download a report.

This is not yesterday's sharing post. That one was Agent feedback. This one is the usage-metrics field still sitting at the top of the GitHub changelog feed.

## Do this in this order

1. Read both policy sentences before you click. The changelog says "The Copilot usage metrics policy must be enabled." The [REST page](https://docs.github.com/en/rest/copilot/copilot-usage-metrics) says the "Copilot usage metrics" policy must be set to **Enabled everywhere** for the enterprise. The [enterprise policy how-to](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) and the [policies concept page](https://docs.github.com/en/copilot/concepts/enterprise/policies), fetched this morning, do not print those two phrases, and they do not show a dropdown named Copilot usage metrics. If your admin screen does not make "enabled" and "Enabled everywhere" the same control, stop. I did not open an admin UI.

2. Call the report endpoint for the scope you administer. The first response is download links, not the array. For an enterprise day, the REST page prints `GET /enterprises/{enterprise}/copilot/metrics/reports/enterprise-1-day` with a required `day` query in `YYYY-MM-DD`. The curl samples on that page send `X-GitHub-Api-Version: 2026-03-10`. The changelog does not print that header. The sample response on that section is `download_links` to `example.com` and `"report_day": "2025-07-01"`. That is the docs sample of the envelope. It is not your report.

3. Open the file you downloaded and look for `totals_by_client`. Read that name from the changelog. The REST page, the [reference index](https://docs.github.com/en/copilot/reference/copilot-usage-metrics), the [data page](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics), and the [example schema](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/example-schema), fetched this morning, do not contain the string `totals_by_client`.

4. Treat `client` as a best-effort grouping. The changelog says clients are identified by the integration ID they send with each request. It says treat `client` as a best-effort grouping, not a verified identity. Unrecognized clients are grouped under `other`.

5. Read `request_count` as model calls, not prompts. The changelog says one prompt can trigger several model calls, so do not compare this field directly with prompt or interaction counts.

6. An empty array means nothing to report. The changelog says the change is additive, existing fields are unchanged, and `totals_by_client` is an empty array when there is no usage to report. Do not treat `[]` as a failed download.

## Read the clock, then the field list

The changelog HTML I fetched has JSON `datePublished` `2026-10-23T16:42:03-07:00` and `2026-10-23T23:42:03+00:00`. `article:modified_time` and JSON `dateModified` are `2026-10-23T23:43:37+00:00`. The feed item I fetched is `Fri, 23 Oct 2026 23:42:03 +0000`. This morning's clock, before that fetch, was `2026-10-26 07:00:57 EDT`. That published UTC timestamp is 59.3 hours earlier. Inside 72 hours. Outside 48 hours. I did not open a byline page. Do not print an author name from this post.

Each `totals_by_client` entry, as the changelog prints it, has:

- `client`: the tool that sent the requests. Examples on the page: `opencode`, `claude_code`, `codex`, `zed`, `copilot_cli`, `github_app`, `cloud_agent`, `code_review`, `vscode`, or `jetbrains`. Unrecognized clients go under `other`.
- `request_count`: the number of successful model requests from the client.
- `session_count`: the number of distinct sessions from the client.
- `token_usage`: prompt tokens, output tokens, and average tokens per request. The changelog does not print JSON keys for those three. Do not copy `prompt_tokens_sum` off the schema page onto this field.
- `totals_by_model`: the same request and token metrics broken down by model, with a `model_selection_mode` of `user_selected` (requested directly), `auto` (chosen by auto), or `product_selected` (chosen by the product). Modes that are not reported individually yet appear as `other`. Values that cannot be normalized appear as `unknown`.

I did not see a live array. Do not paste a JSON sample from this page as if I downloaded one.

## Where the changelog says the array sits

Enterprise, organization, enterprise-user, and organization-user reports, in both 1-day and 28-day versions. In the aggregated 28-day reports, `totals_by_client` appears in each `day_totals` entry.

The REST page names these paths. It does not name `totals_by_client` on any of them:

- `GET /enterprises/{enterprise}/copilot/metrics/reports/enterprise-1-day`
- `GET /enterprises/{enterprise}/copilot/metrics/reports/enterprise-28-day/latest`
- `GET /enterprises/{enterprise}/copilot/metrics/reports/users-1-day`
- `GET /enterprises/{enterprise}/copilot/metrics/reports/users-28-day/latest`
- `GET /orgs/{org}/copilot/metrics/reports/organization-1-day`
- `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest`
- `GET /orgs/{org}/copilot/metrics/reports/users-1-day`
- `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest`

The changelog says "enterprise-user" and "organization-user." The REST page says `users-1-day` and `users-28-day/latest`. I did not prove those are the same file. Use the path the REST page prints, then look for the field the changelog names.

The REST page also documents `repos-1-day` under both enterprise and organization. The changelog does not put `totals_by_client` on repository reports. Do not look there for this array.

The enterprise 1-day section says reports are available starting from October 10, 2025, and historical data can be accessed for up to 1 year from the current date. That sentence is on that section. I did not check whether every other section repeats it.

The 28-day sample on the REST page returns `report_start_day` and `report_end_day`, plus download links. It does not return `day_totals` inline. The data page says 28-day aggregate reports wrap daily records in `day_totals`. Read the downloaded file for the array. Do not expect it in the first JSON.

## Do not rename a field the data page already has

The data page lists these `totals_by_*` names and does not list `totals_by_client`: `totals_by_3rd_party_agent`, `totals_by_ai_adoption_phase`, `totals_by_cli`, `totals_by_copilot_app`, `totals_by_custom_agent`, `totals_by_feature`, `totals_by_ide`, `totals_by_language_feature`, `totals_by_language_model`, `totals_by_mcp`, `totals_by_model_feature`, `totals_by_plugin`, `totals_by_skill`, `totals_by_slash_cmd`, `totals_by_vscode_agent`. The example schema, fetched the same morning, has the same fifteen names.

The data page does have breakdowns. It just does not have this name. One sentence on that page: "The `totals_by_*` fields are arrays of breakdown objects. The array is always present but can be empty." The same page types `totals_by_cli`, `totals_by_copilot_app`, and `totals_by_vscode_agent` as objects, not arrays. Do not use that sentence to invent the shape of `totals_by_client`. The changelog is the page that names it, and the changelog calls it an array.

`totals_by_cli` is not this field. On the data page it is an object, omitted when the user had no Copilot CLI usage that day. Its `request_count` is requests made to Copilot via the CLI, including user-initiated prompts and automated agentic follow-up calls. Its `prompt_count` is user prompts, commands, or queries executed within a session. The changelog's `totals_by_client` is an array, and `copilot_cli` is one example `client` value among others. The pages I fetched do not say those two numbers are the same. Do not add them.

The data page also says CLI usage is not reflected in `totals_by_ide` or `totals_by_feature`. The changelog says tools outside the IDE often do not send editor telemetry, so their usage was missing from `totals_by_ide`. Those two sentences agree for CLI. They do not give you a join rule for `opencode`, `claude_code`, `codex`, or `zed`. Do not add `totals_by_ide` to `totals_by_client` and call it one total.

## Do not answer this with the August job count

The changelog says this is different from [agent app activity](https://github.blog/changelog/2026-08-06-copilot-usage-metrics-api-adds-agent-app-activity/), which counts jobs started by agent apps such as Claude and Codex on GitHub. `totals_by_client` measures model traffic, meaning requests and tokens, from any tool that uses Copilot. I did not re-fetch the August 6 page this morning. Use the split the October 23 page states. Do not answer a model-traffic question with a jobs-started chart.

## Keep the permission strings apart

The changelog says access is for enterprise owners and billing managers, organization owners, and anyone with a custom organization or enterprise role that grants `View Copilot Metrics`.

On the enterprise 1-day section, the REST page says enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics." OAuth app tokens and personal access tokens (classic) need `manage_billing:copilot` or `read:enterprise`. The fine-grained token permission on that section is "Enterprise Copilot metrics" (read).

On the organization users 28-day section, the REST page says organization owners and authorized users with fine-grained "View Organization Copilot Metrics." Classic tokens there need `read:org`. The fine-grained permission is "Organization Copilot metrics" (read).

The data page's who-can-use line says enterprise owners, enterprise billing managers, organization owners, and a custom role with "View Organization Copilot Metrics" or "View Enterprise Copilot Metrics."

Those are not one string. `View Copilot Metrics` is the changelog's words. The docs pages fetched this morning do not contain that exact string. If your token was granted one of the docs names, do not assume the changelog's shorter name is the same role. I did not create a token.

## Code review and cloud agent pick the model

Requests from Copilot code review and Copilot cloud agent report `product_selected`, because the product chooses the model. Copilot code review models are reported as `unknown`. Do not replace `unknown` with a model name the changelog did not print.

## What I did not do

I did not call the usage metrics API. I did not download an NDJSON file. I did not open the enterprise AI controls screen, so I cannot tell you whether "enabled" and "Enabled everywhere" are the same dropdown. I did not prove the reference pages will stay without `totals_by_client`. I proved they do not contain that string in the HTML I fetched this morning.

If your report already has both `totals_by_ide` and `totals_by_client` for the same day, which requests are you willing to leave uncounted until a page prints the overlap?
