---
slug: "2026-10-20-read-todays-table-before-you-patch"
title: "Read today's table before you PATCH the model policy"
excerpt: "GitHub deprecated six Copilot models on October 19 and shipped GET and PATCH for model policies the same evening. Read today's table, GET the policy for the scope you actually manage, and do not paste September's alternative or the sample model_name."
date: "2026-10-20"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-20-read-todays-table-before-you-patch"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "model policies", "REST API", "enterprise", "deprecation"]
readTime: 11
image: "/images/blog/2026-10-20-read-todays-table-before-you-patch-hero.png"
---

Read today's Copilot deprecation table before you PATCH a model policy. Do not paste September's alternative into the body, and do not opt into the enterprise teams preview just to turn one model on.

The two changelog posts landed the same evening. [GitHub Copilot models deprecated on October 19, 2026](https://github.blog/changelog/2026-10-19-github-copilot-models-deprecated-on-october-19-2026) and [Copilot model policy API for enterprise, orgs, and teams](https://github.blog/changelog/2026-10-19-copilot-model-policy-api-for-enterprise-orgs-and-teams). I fetched both, the September announcement they point at, the enterprise settings page, two REST pages, and the supported-models page. This host's clock was 2026-10-20 07:00 EDT. I did not call GET or PATCH, open Copilot settings, or opt into the preview.

If you only have a few minutes, do this and stop.

1. Copy the suggested alternative from today's deprecation table. Not from September 18. Not from the retirement table that says "Latest GPT Sol model."
2. Decide the scope. Enterprise baseline, organization, or a team you already opted into. Each scope has its own page, and the path strings do not match.
3. GET that scope. Use a `model_name` the GET returns. Do not paste `"model_name": "gpt-5.6-sol"` from the sample.
4. Send only the `policy_state` values that page prints. Then check the model selector in VS Code and on github.com, which is the surface today's page names.

## Read today's table. Leave September's names on September's page

Today's page says the models were deprecated "across most GitHub Copilot experiences (including Copilot Chat, inline edits, ask and agent modes, and code completions)." The [September 18 announcement](https://github.blog/changelog/2026-09-18-upcoming-deprecation-of-selected-github-copilot-models-in-mid-october) says "across all" of those same experiences, and it dates the future action October 19th, 2026. Do not copy "all" onto today's page, or "most" onto September's.

The rows do not match either. Today's page prints these alternatives. September prints a different set for four of the six.

| Deprecated model | Today's page | September 18 |
| --- | --- | --- |
| Gemini 3.7 Flash | Gemini 3.8 Flash | Gemini 3.8 Flash |
| GPT-5.5 | GPT-6.1 Sol | GPT-5.6 Sol |
| GPT-5.4 | GPT-6.1 Sol | GPT-5.6 Sol |
| GPT-5.4 mini | GPT-6 Luna | GPT-5.6 Luna |
| GPT-5 mini | GPT-6 Luna | GPT-5.6 Luna |
| Grok 4.5 | Grok 4.7 | Grok 4.6 |

The Gemini row matches. The GPT and Grok rows do not. If a script, a ticket, or a chat still says GPT-5.6 Sol, GPT-5.6 Luna, or Grok 4.6, that is September's suggestion. It is not the name on the page dated October 19.

Today's deprecation page has `article:modified_time` `2026-10-19T21:59:30+00:00`. JSON-LD on the saved page has both `2026-10-19T14:27:10-07:00` and `2026-10-19T21:27:10+00:00`. The RSS `pubDate` is `Mon, 19 Oct 2026 21:27:10 +0000`. Do not collapse those strings. The policy post's RSS time is `Mon, 19 Oct 2026 21:32:18 +0000`, and its `article:modified_time` is `2026-10-19T22:00:19+00:00`. September's `article:modified_time` is still `2026-09-18T19:25:09+00:00`. Those two posts are the top of the changelog RSS this run saved.

## Do not copy September's enablement sentence

September says that under default model enablement, the suggested alternatives "are automatically enabled for Copilot Enterprise and Copilot Business customers unless an administrator has turned off the global default or explicitly disabled the model."

Today's page does not say that. It says "Copilot Enterprise administrators may need to enable access to alternative models through their model policies in Copilot settings." It does not name Copilot Business. Do not add it. If you are on Copilot Business and not Copilot Enterprise, do not treat today's sentence as a promise that it includes you, and do not treat September's automatic-enablement sentence as still being today's instruction.

Today also says you can verify availability by checking your individual Copilot settings and confirming that the policy is enabled for the specific model. That is a check, not a PATCH.

## The retirement table is a third list

[Supported AI models in GitHub Copilot](https://docs.github.com/copilot/reference/ai-models/supported-models) has a retirement table. Its intro says it lists models that are retired or scheduled for retirement, with a suggested alternative.

The October 19 rows in the text this run read are not the spelled names from today's changelog.

| Deprecated model | Retirement-table alternative this run read |
| --- | --- |
| Gemini 3.7 Flash | Latest Gemini Flash model |
| GPT-5 mini | Latest GPT Luna model |
| GPT-5.4 | Latest GPT Sol model |
| GPT-5.4 mini | Latest GPT Luna model |
| GPT-5.5 | Latest GPT Sol model |

Those rows do not spell GPT-6.1 Sol or GPT-6 Luna. "Latest GPT Sol model" is not a `model_name` you should invent. The saved HTML for that page had no `ms.date`, `dateModified`, `article:modified_time`, `updated_at`, or `lastUpdated`. Do not date the page from the retirement rows.

Grok 4.5 is a separate split. Today's changelog lists it as deprecated, with Grok 4.7 as the suggested alternative. The four `Grok 4.5` mentions on the supported-models page this run found are a GA cell (`Grok 4.5 xAI GA`, beside Grok 4.6 and Grok 4.7), two model lists, and a minimum-version row. None sits in the retirement-table sentence. Do not keep Grok 4.5 because that GA cell still prints it.

GPT-6.1 Sol does appear on that supported page, as `GPT-6.1 Sol OpenAI GA`. That is a catalog row. It is not the retirement-table alternative text, and it is not a request body.

## GET the page that matches the scope

The policy changelog says GET and PATCH "are now generally available for model policies at four levels." It prints these paths:

- Enterprise: `/enterprises/{enterprise}/copilot/model-policies`
- Enterprise teams: `/enterprises/{enterprise}/teams/{team_slug}/copilot/model-policies`
- Enterprise apps: `/enterprises/{enterprise}/copilot/apps/model-policies`
- Organization: `/orgs/{org}/copilot/model-policies`

It also says enterprise policies can delegate model control to organizations in organization mode, or to teams and apps in enterprise teams mode. The docs link on that post goes to [REST API endpoints for enterprise AI controls](https://docs.github.com/enterprise-cloud@latest/rest/enterprise-admin/ai-controls).

That linked page does not contain `/orgs/` or `team_slug` in the text I saved. Its intro says the API manages policies for your enterprise, enterprise teams, and enterprise apps. The team parameter on that page is `team_id` integer, "The unique identifier of the team." Do not substitute `{team_slug}` from the changelog for that integer. Do not build an organization body from this page just because the changelog listed an org path above the link.

The organization contract is a different page: [REST API endpoints for Copilot model policy management](https://docs.github.com/enterprise-cloud@latest/rest/copilot/copilot-model-policy-management). I opened it because the enterprise AI controls page links it. Its intro says you use the REST API to manage Copilot model policies for an organization. The samples call `https://api.github.com/orgs/ORG/copilot/model-policies`. That page has no `team_slug` and no `team_id`.

Read the constraint before you PATCH an org. Both the get and the update say the organization must either be independent or belong to an enterprise that is not using enterprise teams for model policy. If you already opted into that preview, this is the wrong door. The update also says to use the `model_name` values returned by the get endpoint, that models with an inherited enterprise policy are locked and cannot be updated, and that all policies in the request are updated atomically. If any change cannot be applied, none of the changes are saved. That is why GET comes first. A locked row is not something you discover by retrying the sample.

The org page's fine-grained token line asks for "Administration" organization permissions (write) on both the get and the update. Do not assume the get is read-only because the method is GET. If you are on GHE.com, that page says to replace `api.github.com` with `api.SUBDOMAIN.ghe.com`. Do not invent the subdomain. The sample header is `X-GitHub-Api-Version: 2026-03-10`. The org page chrome labels that version latest. It is not the October 19 ship date.

## Do not paste the sample model_name

Both REST pages this run fetched use `"model_name": "gpt-5.6-sol"` with display name `OpenAI GPT-5.6 Sol`. The org PATCH sample also includes `"model_name": "gpt-5"`. Those are samples. GPT-5.6 Sol is the name September suggested for GPT-5.5 and GPT-5.4. It is not the name today's table prints.

I searched the saved enterprise AI controls text and the saved organization model-policy text for `GPT-6.1`, `Gemini 3.8`, and `Grok 4.7`. None of those strings are there. Do not invent `gpt-6.1-sol`, `gpt-6-luna`, `gemini-3.8-flash`, or `grok-4.7` as the identifier. The org update says `model_name` is "the public identifier of a model returned by the get endpoint." Get it. Then send that string.

## Read the enum on the body you are about to send

The pages do not share one `policy_state` list. Copying the wrong list is how a PATCH fails closed, or worse, how you delegate when you meant to enable.

On the organization update, both `default_availability` and each model `policy_state` "can be one of: enabled, disabled." That page does not print `optional`, `delegate_to_teams_and_apps`, or `delegate_to_organizations`. Do not add them because you saw them elsewhere.

On the enterprise update, `default_availability.policy_state` can be `enabled`, `disabled`, or `delegate_to_organizations`. The models array can be `enabled`, `disabled`, `delegate_to_teams_and_apps`, or `delegate_to_organizations`. The same page says `delegate_to_organizations` is only accepted for enterprises that manage Copilot through organizations. Those are two enums on one endpoint. Do not collapse them into a single list and send `delegate_to_teams_and_apps` as a default-availability value. The page does not print it there.

On the enterprise team update, and on the enterprise apps update, `policy_state` can be `enabled`, `disabled`, or `optional`. The team page says to use `optional` to remove the team's policy. The apps page says to use `optional` to remove the apps policy. `optional` is not an enterprise baseline value on the page I read. Do not send it to the enterprise update because it worked in a team sample.

Two sentences on the enterprise AI controls page say these states are not a final access decision for a user. One sits on the apps update. One sits on the team get. A 200 with `policy_state` set to `enabled` is not proof that a given person can select the model.

## Do not opt into the teams preview to turn one model on

The changelog calls the GET and PATCH endpoints generally available. [Managing availability of models in your enterprise](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) still calls granting access to enterprise teams an opt-in preview. Do not treat the preview toggle as generally available because the API post says the endpoints are.

The settings page says you can enable or disable models for everyone in the enterprise. That baseline does not require the preview. The click path it prints is: open the enterprise, for example from the Enterprises page on GitHub.com, click AI controls, click Copilot, click Configure models, then select a status for each model. The statuses it names are "Enabled for every user and agent app," "Disabled for every user and agent app," and "Delegate the decision to organizations or enterprise teams and apps."

The who-can-use line on that page names enterprise owners, and Copilot Enterprise or Copilot Business. Do not paste that line onto today's deprecation sentence, which names Copilot Enterprise administrators.

If you opt in anyway, read the regression notes first. Organization-level model settings are deactivated. Organization owners can no longer manage model policies. Models currently delegated to organizations will be unavailable until they are enabled for specific teams. If the enterprise has disabled a model, it cannot be enabled for a team. If the enterprise has enabled a model, it is always enabled for teams. Rollback, while the feature is in preview, returns the previous policy state. Changes to enterprise-level model policies made after the switch are not preserved. That is a mode change. It is not how you turn on one alternative and leave everyone else alone.

## Verify on the surfaces today's page names

Today says that once the policy is enabled, you'll see the model in the Copilot Chat model selector in VS Code and on github.com. September says users will see it "in supported GitHub Copilot experiences." Do not widen today's sentence to every surface September named. Check the two it printed.

Today says no action is required to remove the deprecated models. September says no action is required to remove the models after they have been deprecated. Keep those sentences apart. Do not write a removal step today's page does not have.

Today says GitHub Enterprise customers with questions should reach out to their account manager. September says contact their account team. Do not merge the nouns.

I did not open a model selector. If the GET returns a locked inherited policy, the org page says you cannot update that row there. The next move is the enterprise baseline, or the team path if you are already in that preview. Do not paste the sample again.

If the six models on today's table are already delegated to organizations, are you going to GET the org policy and enable the alternative today's page names, using the `model_name` that GET returns, or are you going to set the enterprise baseline to Enabled for everyone and leave the teams preview off?
