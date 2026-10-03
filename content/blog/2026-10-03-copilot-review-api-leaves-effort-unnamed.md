---
slug: "2026-10-03-copilot-review-api-leaves-effort-unnamed"
title: "GitHub says the review API sets effort. The published request body does not."
excerpt: "The 2 October changelog says you can set Copilot code-review effort on a REST or GraphQL request. The published request bodies still do not name that field. Request the bot, and set effort in the product until the schema does."
date: "2026-10-03"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-03-copilot-review-api-leaves-effort-unnamed"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "code review", "REST API", "GraphQL"]
readTime: 11
image: "/images/blog/2026-10-03-copilot-review-api-leaves-effort-unnamed-hero.png"
---

GitHub says you can set the effort on a Copilot code review from the API. The published request body still does not name that field.

On 2 October 2026 the GitHub Changelog said you can request a Copilot code review through the REST and GraphQL APIs and set the review effort level for that request. I opened those request schemas the next morning. The REST body lists reviewers and team reviewers. The GraphQL inputs list bot logins, bot IDs, users, and teams. None of them contain the word effort. If you are wiring this into a script today, request the bot. Set the effort in the product until a field name ships.

I fetched the changelog, the how-to, the concept page, the configure page, the REST review-request reference, and the GraphQL pulls reference on the morning of 3 October 2026. I did not request a review. `command -v copilot` printed no path and exited 1. `gh` on this host is `/snap/bin/gh`, version `2.86.0-112-gc30647b78` (2026-02-14). `gh pr edit --help` on that binary lists `@copilot` and does not list an effort flag. Nothing below is a timed review from this machine.

## What the changelog actually dated

The page [Copilot code review: API support and new default effort level](https://github.blog/changelog/2026-10-02-copilot-code-review-api-support-and-new-default-effort-level) publishes `datePublished` `2026-10-02T19:13:50+00:00`. `TZ=America/New_York date -d` converts that to 2026-10-02 15:13 EDT. The same page text includes the dates October 2, 2026, August 28, 2026, and September 28, 2026.

The lead sentence is the API claim. You can now request a GitHub Copilot code review through the REST and GraphQL APIs and set the review effort level for each request. Balanced is also now the default review effort level. Those changes are generally available to Copilot Pro, Pro+, Max, Business, and Enterprise plans.

Read the next paragraph before you treat "now" as one event. You can optionally set the review effort level for that request. The page does not name a JSON property, a GraphQL input, or a path beyond the supported REST and GraphQL APIs. What you can do today is start the review from the tools you already run. The optional effort sentence is the part the reference pages do not spell out.

The default change is older than the API sentence. As announced on August 28, 2026, the Default review effort level now uses Balanced for new and existing repositories and organizations using Copilot code review. If you explicitly selected Lite, that selection was respected. This change took effect September 28, 2026. Do not write September 28 as if it started on October 2.

The same page gives four places to change the level from Default to Lite. I am quoting the click paths as written there. I am not collapsing them into one menu:

- Enterprise: AI controls, then Agents, then Copilot code review.
- Organization: Copilot, then Code review.
- Repository: Copilot, then Code review.
- Personal: profile picture, then Copilot settings, then Copilot, then Code review.

Each level can override the one above it. The page points the step-by-step instructions at [Configuring code review by GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review).

## Request the bot. Stop there.

The how-to, [Using GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review), has one REST sentence. You can request a review from Copilot through the GitHub REST API by requesting `copilot-pull-request-reviewer[bot]` as a reviewer. That sentence does not mention effort. It links to [REST API endpoints for review requests](https://docs.github.com/en/rest/pulls/review-requests).

That REST page describes `POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers`. The body parameters on the page I fetched are `reviewers`, an array of user logins that will be requested, and `team_reviewers`, an array of team slugs that will be requested. The sample body is `{"reviewers":["octocat","hubot","other_user"],"team_reviewers":["justice-league"]}`. It does not include the bot login. The sample sends `X-GitHub-Api-Version: 2026-03-10`. A fine-grained token needs Pull requests write. Creating content too quickly on this endpoint may hit secondary rate limiting.

I searched the saved REST page for `effort`. No matches. I also searched it for `copilot-pull-request-reviewer`. No matches. The how-to names the login. The REST page names the array. A script that puts the how-to login into `reviewers` is composing those two sentences. I did not send that request, so I am not reporting a status code for it.

GraphQL is more explicit about the bot, and still silent on effort. On the [pull requests reference](https://docs.github.com/en/graphql/reference/pulls), `requestReviewsByLogin` takes `RequestReviewsByLoginInput`. These are the fields the page lists:

| Field | What the page says |
| --- | --- |
| `botLogins` | Logins of the bots to request, including the `[bot]` suffix. The example is `copilot-pull-request-reviewer[bot]`. |
| `userLogins` | Login strings of the users to request reviews from. |
| `teamSlugs` | Team slugs, in the form `org/team-slug`. |
| `pullRequestId` | Node ID of the pull request. Required. |
| `union` | Add users to the set rather than replace. |
| `clientMutationId` | A unique identifier for the client performing the mutation. |

`requestReviews` takes `RequestReviewsInput`: `botIds`, `userIds`, `teamIds`, `pullRequestId`, `union`, and `clientMutationId`. I searched that saved pulls reference for `effort`. No matches.

The GitHub CLI how-to shows `gh pr create --reviewer @copilot` and `gh pr edit PR-NUMBER --add-reviewer @copilot`. Neither snippet has an effort flag. The help text I read on this host's `gh` 2.86.0 says `--add-reviewer` supports `@copilot` to request a review from Copilot, and that this is not supported on GitHub Enterprise Server. The example in that help is `gh pr edit 23 --add-reviewer "@copilot"`. There is no effort flag in the flag list.

So the callable surface, as published this morning, is: ask for the bot. REST uses the login inside `reviewers`. GraphQL can use `botLogins`, and the field description already prints the bot string. `gh` uses `@copilot`. Effort is a product setting and a pull-request control. It is not a parameter in those three contracts.

## Do not merge the default sentences

Three pages describe the default. They do not say the same thing. Keep the sentences apart.

The changelog says the Default review effort level now uses Balanced, the change took effect September 28, 2026, and an explicit Lite selection was respected.

The configure page shows **Default (Balanced)** until you pick a level. That setting applies to automatic reviews and to reviews you request yourself. Turning automatic review off does not clear it.

The concept page, [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review), still labels Lite as default in the bullet. Its resolution list ends on a different built-in. The order it prints is:

1. A Copilot review effort chosen when the review is requested.
2. A Copilot review effort previously used on this pull request.
3. The requestor's Copilot review effort. For a new pull request, the requestor is the author. When someone marks a draft ready for review, that person is the requestor.
4. A Copilot review effort set for the repository.
5. A Copilot review effort set for the organization, or the repository owner's Copilot review effort on a user-owned repository.
6. GitHub's built-in default, which is Lite. Some owners have Balanced as the built-in default.

Step 1 is the concept page's description of a choice made when the review is requested. It is not a field name in the REST or GraphQL inputs I fetched. Do not treat that sentence as the missing JSON key.

After a review, the pull request overview comment shows the effort level used for each review run. That comment is the receipt. If a script cannot set effort, the comment is how you learn which level ran.

The level definitions also differ by page. Do not splice them into one glossary line.

The how-to calls Lite a cost-efficient pass on glaring bugs, security issues, and style problems, and Balanced a deeper pass on complex logic, security-sensitive code, and cross-service changes, using a higher-reasoning model. The concept page calls Lite a standard review of common issues and marks that bullet as the default. It says Balanced routes the pull request to a higher-reasoning model, uses more AI credits, and may use marginally more Actions minutes. Use Balanced for security-sensitive or multi-service changes. Use Lite when you want the faster pass.

Model switching is not supported. The concept page says code review uses a tuned mix of models, prompts, and system behaviors, and that changing the model is likely to hurt reliability and comment quality. Code review may also use models that are not enabled on the organization's Models page. That page only controls Copilot Chat. I am not ranking models, and the product is not asking you to.

## What the estimate is, and what it is not

The concept page's consumption note is GitHub's estimate, not a number from this host. A review typically consumes an estimated $0.05 USD to $1 USD worth of AI credits with Lite effort, and $0.25 USD to $5 USD worth of AI credits with Balanced effort. Consumption generally increases with pull request size and with repository custom instructions. The ranges may change as models evolve. Those estimates do not include GitHub Actions minutes.

Those credits are not the whole bill. The concept page splits cost into AI credits for the review itself and GitHub Actions minutes for the agentic capabilities, including full-repo context and handing suggestions to Copilot cloud agent. The credit ranges above do not include those minutes. If Actions is unavailable, or if the workflows Copilot code review uses fail, the review is still generated. It just will not include those extra features.

Who pays depends on who caused the review. An automatic review is attributed to the pull request author. A manual request is attributed to the person who requested it. On Copilot Business and Copilot Enterprise, a user budget or an exhausted enterprise or cost center limit blocks code review along with the other features that spend AI credits. A script that only adds the bot can still stop when the budget does.

The how-to says a review on GitHub.com usually takes less than 30 seconds. That is GitHub's sentence. I did not time one.

## That parameters object is not the effort field

The GraphQL pulls reference does contain a Copilot-named input. It is the wrong one for this changelog.

`CopilotCodeReviewParameters` and `CopilotCodeReviewParametersInput` request automatic review on new pull requests, if the author has access and has not hit the premium requests quota. The fields are `reviewDraftPullRequests` and `reviewOnPush`. There is no effort field. That pair matches the ruleset switches for draft review and review on push. It is not the 2 October effort sentence.

## Shape the review without a missing parameter

You can still make the review useful while the schema is silent on effort.

Set effort where the resolution order can see it: a choice at request time, then a previous effort on that pull request, then the requestor, the repository, and the organization. The changelog paths set the last three. The how-to also lets you pick effort under Reviewers before you request Copilot. A script that only adds the bot inherits that stack. It does not create a per-request choice the schema does not expose.

Put the review rules on the head branch. The how-to says Copilot reads `.github/copilot-instructions.md`, `AGENTS.md` at the repository root, and `.github/instructions/**/*.instructions.md` for path-specific rules. It also reads `CLAUDE.md`, `GEMINI.md`, and `REVIEW.md` if those files exist. The concept page says instructions and skills are read from the head branch, not the base, so you can test a rule change in the same pull request.

By default the review is a Comment, not an Approve and not a Request changes. It does not count toward required approvals unless you turn on the approvals preview. That preview is off by default, and a later push dismisses an approval Copilot already left. Comment labels are High, Medium, or Low. Replies you leave on Copilot's comments are visible to people. They are not visible to Copilot.

## What to do this week

Request the bot from the contract that exists. Pin effort in the product. Read the receipt.

1. Start the review with `copilot-pull-request-reviewer[bot]` in the REST `reviewers` array, or with that same string in `botLogins` on `RequestReviewsByLoginInput`, or with `gh pr edit --add-reviewer @copilot` where that CLI supports it. Do not add a property the reference pages do not list.
2. Choose Lite or Balanced in settings before you automate. Treat 28 September 2026 as the date Default moved to Balanced. An explicit Lite choice was kept.
3. After the review posts, read the overview comment for the effort that actually ran.
4. If you want Balanced on security-sensitive repositories, budget GitHub's range of $0.25 to $5 in AI credits, plus Actions minutes outside that range.

The open question is the resolution order. When a named effort parameter shows up on `RequestReviewsByLoginInput` or on the REST body, does it occupy step 1, the choice made when the review is requested? Or does step 2, an effort already used on that pull request, still win? The concept page prints the order. The changelog does not say where an API value sits in it.
