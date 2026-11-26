---
slug: "2026-11-26-select-member-before-december-30"
title: "Select Member before December 30"
excerpt: "If nobody saved who pays for Copilot code review, that choice flips to the organization on December 30. Select Member on the policy screen if you want the member's allowance to keep paying."
date: "2026-11-26"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-26-select-member-before-december-30"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "code review", "billing", "Copilot Business", "how-to"]
readTime: 8
image: "/images/blog/2026-11-26-select-member-before-december-30-hero.png"
---

If nobody saved who pays for Copilot code review, that unpaid choice flips on December 30, 2026. Reviews by members who already have a paid Copilot license start billing the organization that owns the repository. Select Member before then if you want those reviews to keep drawing on the member's Copilot allowance. Until that date, unset settings show Default (Member). Selecting Member is the choice that stays after the default changes. The changelog calls that allowance the member's Copilot entitlement.

The date lives on the changelog. The clicks live on the docs page. Read both before you save, because they print different sentences for Default.

## Select Member if you want the allowance to keep paying

Everyday version: nobody picked a payer, so the member's Copilot allowance is covering the review today. On December 30 that same unset state starts charging the organization. Member keeps the allowance. Organization moves the charge.

The changelog is [Copilot code review billing will default to the organization](https://github.blog/changelog/2026-11-25-copilot-code-review-billing-will-default-to-the-organization/). The bare path returned 301 to the trailing slash, then 200. Saved HTML is 100,231 bytes. The 200 response `Date` is `Thu, 26 Nov 2026 19:45:37 GMT`. There is no `article:published_time` meta. JSON-LD prints `datePublished` as `2026-11-25T14:18:03-08:00` and as `2026-11-25T22:18:03+00:00`. Those two stamps are the same instant. The author on that JSON-LD is Allison. `article:modified_time` and the graph `dateModified` are both `2026-11-25T22:19:23+00:00`. The visible line is November 25, 2026. The [changelog feed](https://github.blog/changelog/feed/) lists this item first of 10, at `Wed, 25 Nov 2026 22:18:03 +0000`, the same instant as `datePublished`.

That publish stamp is 21.46 hours before the response `Date`, and 13.70 hours before 07:00 ET on November 26. The modified stamp is 21.44 hours before the response `Date`, and 13.68 hours before that 07:00 ET clock. Use the response `Date` as the fetch clock. The 07:00 ET figure is the age at the morning window, computed from the same stamps.

This change applies to organizations and enterprises with Copilot Business or Copilot Enterprise.

The opening sentence says those reviews will be billed to your organization starting December 30, 2026. To keep billing unchanged, select Member before then. The later sentence is more specific: today, when no billing choice is saved, reviews by members who have a paid Copilot license use the member's Copilot entitlement. Starting December 30, 2026, those reviews will be billed to the organization that owns the repository. Keep both sentences. "Your organization" and "the organization that owns the repository" are two phrases on the same page.

The saved HTML prints `December 30` five times, all of them `December 30, 2026`. It prints `Default (Member)` once. It prints `AI Credits` twice and `AI credits` zero times. It prints `billing lock` once and `billable customer` once.

If you already chose Member or Organization, your choice stays in effect. The separate setting for members without a Copilot license doesn't change. Accounts that don't have AI Credits paid usage enabled, have a billing lock, or have no billable customer will be set to Member instead. Organization billing requires AI Credits paid usage and can increase your organization's spending. If your enterprise manages this setting, an enterprise owner makes this choice.

## Open the organization menu, or the enterprise menu

The docs page is [Configuring code review by GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review). The changelog's link text is that title. Its href is `https://docs.github.com/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review`, which returned 302 to the `/en/` path, then 200. One page. I fetched the markdown with `Accept: text/markdown`. That file is 46,000 bytes, `Date: Thu, 26 Nov 2026 19:45:37 GMT`. The HTML of the same URL is 789,677 bytes. The clicks below are the markdown.

The markdown has zero `December 30`, zero `Default (Member)`, zero `AI Credits`, zero `billing lock`, and zero `billable customer`. The HTML matches those zeros. The markdown prints `AI credits` five times. The HTML prints `AI credits` 17 times. Leave the changelog's `AI Credits` and the docs' `AI credits` as two spellings.

The billing control is step 7 on the organization list and step 8 on the enterprise list. The phrase `Choose how members with a Copilot license are billed` appears twice in the markdown, once in each of those lists. The repository customizing section does not contain it. A ruleset path on the same organization page goes to Repository, then Rulesets, and turns automatic review on. That path is a different job. Today you want Copilot, then Code review.

Organization clicks, when you can still change the choice:

1. In the upper-right corner of GitHub, click your profile picture, then click Organizations.
2. Select the organization by clicking it.
3. Under the organization name, click Settings. If you cannot see the Settings tab, select the More dropdown, then click Settings. The icon's `aria-label` on that step is `More`.
4. In the sidebar, under "Code, planning, and automation", click Copilot, then Code review.
5. Skip the effort-level controls above the bill. Step 7 is the one you want. Next to **Choose how members with a Copilot license are billed**, select an option.

The page's words for that step: choose how AI credits usage associated with members who have paid Copilot licenses is billed.

If your enterprise enforces a billing choice, you cannot override it at the organization level. In that case the enterprise owner makes the choice. Send them the December 30 date and the Member row.

Enterprise clicks, from the same markdown:

1. Navigate to your enterprise. The page's example is the [Enterprises](https://github.com/settings/enterprises?ref_product=ghec&ref_type=engagement&ref_style=text) page on GitHub.com.
2. At the top of the page, click AI controls.
3. In the sidebar, click Copilot.
4. Under "Features & clients", click Configure features & clients.
5. Step 5 on that page sits next to "Copilot code review" and is a different policy. Keep going. Step 8 is the bill. Next to "Choose how members with a Copilot license are billed," select a policy.

The enterprise sentence is its own line: choose who is billed for Copilot code review usage by members with a paid Copilot license. Don't paste the organization sentence into that step.

## Read each row, then save Member

The organization list has three names.

Default: Bill the organization that owns the repository. This option appears when an administrator has not saved a billing choice.

Member: Use the member's Copilot entitlement. If the member's quota is exhausted, the code review fails.

Organization: Bill the organization that owns the repository.

The enterprise list has those three, plus a fourth. Its Member row says use the member's Copilot entitlement for organizations in the enterprise. That bullet stops there. The quota-fail sentence is on the organization Member row, once in the markdown. The fourth name is Let organizations decide: organization owners can choose how to bill usage associated with members who have paid Copilot licenses. The organization billing list does not print that fourth name. The changelog HTML has zero `Let organizations decide`.

The docs Default row bills the organization. The changelog says unset settings show Default (Member) until December 30, and that those reviews use the member's entitlement today. Use the changelog for the date and for the unset label. Use the docs page for the clicks. Select Member if you want the allowance to keep paying after December 30.

On the organization page, this choice applies to both manually requested and automatic code reviews, and changes billing only. It does not grant access to Copilot code review or enable reviews for members without a license. To use Organization, AI credits paid usage must be enabled for the organization. Setting a budget is optional.

On the enterprise page, this policy changes billing only and does not enable reviews for members without a license. Organizations billed must have AI credits paid usage enabled. Setting a budget is optional. The "does not grant access" clause sits on the organization section. Leave it there.

## Save it this afternoon

Open the organization Copilot code review page if you can change the choice. If the control still shows Default (Member), select Member. The changelog says that choice stays in effect after the default changes. If Member or Organization is already saved, leave it unless you mean to change who pays. Organization can increase spending, and the changelog says it requires AI Credits paid usage.

If an enterprise owner has to make the choice, send the December 30 date, the Member row, and the enterprise step 8. Step 5 on that page is a different switch.

If you pick Member on the organization list, the docs say the code review fails once the member's quota is exhausted. That sentence is the organization row. Budget for it, or pick Organization only when AI credits paid usage is already on and you accept the extra spend.

If the enterprise policy is already Let organizations decide, does the organization screen still show Default (Member), or has an owner already saved a row?
