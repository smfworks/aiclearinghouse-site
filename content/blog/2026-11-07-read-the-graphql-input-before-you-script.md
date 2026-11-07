---
slug: "2026-11-07-read-the-graphql-input-before-you-script"
title: "Read the GraphQL input before you script code-review settings"
excerpt: "Match the mutation input the GraphQL reference lists, and leave maximum effort, billing, and approvals on the settings page."
date: "2026-11-07"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-07-read-the-graphql-input-before-you-script"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "code review", "GraphQL", "how-to"]
readTime: 8
image: "/images/blog/2026-11-07-read-the-graphql-input-before-you-script-hero.png"
---

You can change Copilot code review from code now. Read the mutation input before you type a JSON key. Maximum effort, billing, and approvals stay on the settings page.

By the end you can pick a token the changelog allows, open the input for the level you are changing, and send only the fields that input lists.

The page is [Copilot code review: API management and review overview updates](https://github.blog/changelog/2026-11-06-copilot-code-review-api-management-and-review-overview-updates/), by Allison. JSON-LD `datePublished` is `2026-11-06T16:27:19-08:00` and also `2026-11-07T00:27:19+00:00`. Those are one instant. The visible date line is November 6, 2026. The changelog feed `pubDate` is `Sat, 07 Nov 2026 00:27:19 +0000`. `article:modified_time` and JSON-LD `dateModified` are `2026-11-07T00:30:57+00:00`, 3.63 minutes later. Python put the publish stamp 11.62 hours before 7:04 AM Eastern on November 7. That clock is `2026-11-07T12:04:33Z`, from `date` this run.

The docs page the changelog links is [Configuring code review by GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review), at the heading `configuring-copilot-code-review-with-the-api`. The field list lives on the [GraphQL API reference for Copilot](https://docs.github.com/en/graphql/reference/copilot).

## Start with the token

Everyday version first. A token that can edit one repository will fail on the company-wide switch. The real names are GitHub Apps and fine-grained personal access tokens.

The changelog says the enterprise and organization settings endpoints, including the organization runner endpoint, don't support GitHub Apps or fine-grained personal access tokens. The repository settings endpoints support both, with `Administration: read` to read and `Administration: write` to update. Classic personal access tokens need repository administrator access.

That token sentence is on the changelog. The saved HTML of the docs API section has zero hits for `fine-grained`, zero for `personal access token`, and zero for `Administration`. The GraphQL reference has the same three zeros. Use the changelog for the token rule.

The changelog also says you can already request reviews, choose their effort level, and get information back through the REST API. This update adds settings management on top of that path. The saved changelog HTML has zero `/orgs/` paths and zero `/repos/` paths. The docs section points at the GraphQL reference and has no code sample. Start from the input fields below.

## Leave three switches on the page

The docs section says you can use the REST and GraphQL APIs to manage some Copilot code review settings.

Enterprise: enable or disable Copilot code review for all organizations, or let organization owners decide.

Organization: enable or disable when the enterprise lets organization owners decide, set the default review effort level, and configure the runner that Copilot code review uses.

Repository: set the review effort level, and choose whether reviews use custom instructions and MCP servers.

Then the limit, in the page's words: other settings on this page, such as maximum review effort, billing, and approvals, are not available through the API.

On the website, maximum review effort is a menu of No limit, Lite, Balanced, or Max. The organization and repository inputs list no field with that name. Leave that menu, the billing choice, and the approvals toggle on the page. On the organization page, that maximum applies to every repository. A repository can choose the selected effort or a lower one. It cannot exceed the maximum.

The changelog plans line: these updates are available to Copilot Pro, Pro+, Max, Business, and Enterprise plans.

## Open the input for the level you are changing

Five mutations. Each one takes a single `input` object. On the organization settings mutation and the repository settings mutation, omitted settings stay as they are. Send the node id the input asks for.

Enterprise policy uses `updateEnterpriseCopilotCodeReviewPolicy`. It updates an enterprise policy using the existing propagation and notification behavior. Input fields: `enterpriseId` (`ID!`) and `policyState` (`EnterpriseCopilotCodeReviewPolicyState!`). The input says standalone enterprises cannot delegate to organization administrators.

`policyState` values:

- `ENABLED_FOR_ALL_ORGANIZATIONS`. Copilot code review is enabled for all organizations.
- `DISABLED_FOR_ALL_ORGANIZATIONS`. Copilot code review is disabled for all organizations.
- `CONFIGURED_BY_ORGANIZATION_ADMINS`. Organization administrators configure Copilot code review. The enum says this value is not supported for standalone enterprises.

If the enterprise is standalone, send one of the first two. Leave `CONFIGURED_BY_ORGANIZATION_ADMINS` out.

Organization policy uses `updateOrganizationCopilotCodeReviewPolicy`. It updates an organization policy when the enterprise delegates control to organization administrators. Input fields: `organizationId` (`ID!`) and `state` (`OrganizationCopilotCodeReviewPolicyState!`). Values: `ENABLED` and `DISABLED`. The return can include `conflict`. The page says that field is null if the update succeeded. The conflict value on the reference is `POLICY_MANAGED_BY_ENTERPRISE`. The enterprise policy controls the organization's policy.

Organization effort uses `updateOrganizationCopilotCodeReviewSettings`. Input fields: `organizationId` (`ID!`) and `defaultReviewEffort` (`OrganizationCopilotCodeReviewEffortSetting`). `INHERIT` clears the organization's value so repositories inherit the default. The page says omitted settings stay as they are. The return `conflict` is null if the update succeeded. The value on the reference is `SETTING_NOT_EDITABLE`. The organization cannot change a submitted setting.

That effort enum lists `AUTO`, `BALANCED`, `LITE`, `MAX`, and `INHERIT`. `AUTO` means Copilot picks the effort for each pull request.

The runner uses `updateOrganizationCopilotCodeReviewRunnerConfiguration`. It sets the runner configuration Copilot code review uses for an organization. A `LABELED` runner requires at least one label or a runner group. Invalid input leaves the configuration as it was. Input fields: `organizationId` (`ID!`), `runnerType` (`CopilotCodeReviewRunnerType!`), `runnerLabels` (`[String!]`), `runnerGroupName` (`String`), and `allowRepositoryCustomization` (`Boolean`). When that Boolean is omitted, the current effective value is kept. `STANDARD` means standard GitHub-hosted runners. `LABELED` means runners that match the configured labels or runner group.

The repository uses `updateRepositoryCopilotCodeReviewSettings`. The settings object says these settings tune reviews. Enabling code review is the policy mutation above. Input fields: `repositoryId` (`ID!`), `reviewEffort` (`RepositoryCopilotCodeReviewEffortSetting`), `customInstructionsEnabled` (`Boolean`), `mcpEnabled` (`Boolean`), and `severityFilter` (`CopilotCodeReviewSeverityFilter`). `INHERIT` on `reviewEffort` clears the repository's value so it inherits from the organization, the enterprise, or GitHub's default. The return lists `clientMutationId` and `settings`. A `conflict` field is on the organization mutations. It is absent from this repository return.

Severity filter values:

- `NO_FILTER` keeps every comment.
- `LOW` leaves out low-severity comments.
- `LOW_AND_MEDIUM` leaves out low- and medium-severity comments.

## Read the menu, then read the enum

The configure page effort menu lists Lite, Balanced, Max, and Default (Balanced). Lite is a standard review. Balanced is deeper analysis of complex logic, security-sensitive code, and cross-service changes. Max is the highest-effort review and uses multiple high-reasoning models. Until you choose a level, the control shows the built-in default, Default (Balanced).

`CopilotCodeReviewEffort` lists `AUTO`, `BALANCED`, `LITE`, and `MAX`. The saved configure-page HTML has zero hits for `AUTO`. The changelog says the REST API accepts the same review effort levels as the web interface, and that organization and repository settings responses list the levels available to you. That sentence does not print the level names. Read `availableReviewEfforts` on the settings object before you send a value the response left out.

The changelog also says Balanced effort reviews now use three reviewer models, with another model combining their findings. Keep that next to the docs Max line, which says multiple high-reasoning models. Those are two sentences. Leave them as two sentences.

## What else landed in the same note

The review overview is more compact. The review effort used, and any surveys, move into a footer. Skipped and content-excluded files share one "Files not reviewed" section, with filenames and linked exclusion reasons. After a thumbs-down, choose Add a reason and pick the main problem.

The rule "Automatically request Copilot code review" now supports the bypass list, so exempt actors in the list will not receive an automatic review from Copilot.

You can identify Copilot's reviews and comments through explicit attribution fields, see the review effort a review used when that metadata is available, and see which skills, MCP servers, and custom instructions Copilot reported as sources for a comment. The changelog does not print those field names. Read them on the review payload before you write a parser.

## Try it on one repository

Open the [GraphQL reference](https://docs.github.com/en/graphql/reference/copilot) and find `UpdateRepositoryCopilotCodeReviewSettingsInput`. Write those fields down. If you only want to change effort, send `repositoryId` and `reviewEffort`, and leave the other fields out so the current values stay. Use a token the changelog allows for repository settings: a GitHub App or a fine-grained token with `Administration: write`, or a classic token with repository administrator access. If you are changing the enterprise, read the standalone sentence before you send `CONFIGURED_BY_ORGANIZATION_ADMINS`, and use a token the enterprise endpoint accepts.

If your enterprise is standalone, which `policyState` will you leave out, and which token type does the changelog say that endpoint will reject?
