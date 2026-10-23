---
slug: "2026-10-23-read-both-pages-before-the-feature-default"
title: "Read both pages before you treat the feature default as flipped."
excerpt: "The October 22 changelog rolls Copilot feature-default enforcement through October 26. The docs page still says that policy is not currently active, and its markdown marks those sentences as expiring October 22. Read both before you change a setting."
date: "2026-10-23"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-23-read-both-pages-before-the-feature-default"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "Copilot Enterprise", "Copilot Business", "default availability", "AI Controls"]
readTime: 10
image: "/images/blog/2026-10-23-read-both-pages-before-the-feature-default-hero.png"
---

Read both pages before you treat the feature default as flipped. If you administer GitHub Copilot Business or Copilot Enterprise, do not mark October 23 as the day unconfigured features turned on. Open the October 22 changelog and the default-availability docs page in the same sitting. They do not share a clock, a state name, or a scope list.

This run started at 2026-10-23 07:00 EDT. I fetched the [changelog](https://github.blog/changelog/2026-10-22-global-default-for-copilot-features-generally-available), the [docs HTML](https://docs.github.com/en/copilot/concepts/enterprise/default-availability), and the [docs markdown](https://docs.github.com/en/copilot/concepts/enterprise/default-availability.md). The changelog's own docs href, without `/en/`, returned the same HTML bytes as the `/en/` URL. I did not sign in to GitHub. I did not open AI Controls. I did not count a banner, and I did not change a policy.

The model-availability PATCH is a different control. We already walked that table on [October 20](https://www.smfclearinghouse.com/blog/2026-10-20-read-todays-table-before-you-patch/). Do not reuse it here.

## Open the path the changelog names

The changelog says you can review the setting under **AI Controls → Copilot → Default policy for new features**. That is the path it prints. Do not invent a second menu.

The docs page prints an enterprise Features and clients URL: `github.com/enterprises/ENTERPRISE/ai-controls/copilot/features`. That string is a template. I did not substitute an enterprise slug, and I did not load that page.

The changelog cover image is a JPEG. Its alt text says the Features and clients page shows Default policy for new features set to Enabled, and a banner that starting October 22, eligible unconfigured Copilot features will gradually be set to this default policy. That alt text is the changelog describing its own screenshot. It is not a reading from a tenant I opened. Do not copy a banner count out of an image I did not inspect beyond that alt string.

Who the pages name: the changelog says the September announcement covered generally available GitHub Copilot features and supported client capabilities on Copilot Business and Copilot Enterprise plans. The docs page says the same two plans in its "Who can use this feature?" line, and again in the opening paragraph about the two policies. I did not check a third plan.

## Keep the two clocks apart

The changelog page displays October 22, 2026. Its saved HTML `article:modified_time` is `2026-10-22T20:56:27+00:00`. That is the stamp on the file I downloaded. Do not convert it into a tenant rollout time.

The body says: "Starting today, we're gradually rolling out enforcement of the policy through October 26, so it may take effect at different times for different enterprises and organizations." "Today" on that page is the displayed October 22. The end of the window it names is October 26. It also says the timing can differ by enterprise and organization. Do not write October 22 and October 26 as the same moment. Do not write "your enterprise has it" because the calendar moved.

The docs page, fetched this morning, still prints three sentences the changelog does not:

- "The models policy is already active. The feature policy will become active soon."
- "The **Default policy for new features** policy is available to configure but is **not** currently active. Starting from October 22, 2026, the value you have defined for this policy will be the default setting: it will apply to any new or existing GA feature that you have not explicitly configured."
- "This policy is enabled by default. If you don't take action, unconfigured features will be enabled on October 22."

Those three sit in the rendered HTML as ordinary paragraphs. The markdown download wraps the first sentence, and the "not currently active" block, in `<!-- expires 2026-10-22 -->` … `<!-- end expires 2026-10-22 -->`. The HTML download does not contain the string `expires 2026-10-22`. I did not find a last-updated stamp in the docs HTML. Do not invent one. Do not pick one page and throw the other away. The HTML I saved on October 23 still shows the October 22 sentences. The changelog still names October 26.

The docs page also says you will see a banner showing how many eligible policies are currently unconfigured, so you can configure individual policies before October 22. I did not see that banner. If your tenant shows a number, that number is yours. Do not borrow one from this post.

## Do not merge the state names

Once the policy takes effect, the changelog says eligible generally available features and capabilities left **Unconfigured** will be set according to the selected global default of **Enabled**, **Disabled**, or **Let organizations decide**.

The docs enterprise table uses different strings:

| Policy state on the docs page | Outcome the docs page prints |
|---|---|
| Let organizations decide | Any unconfigured GA feature is automatically available for organizations to enable or disable. The default state in each of those organizations comes from the organization-level Default policy for new features policy. |
| Enabled everywhere | Any unconfigured GA feature is automatically enabled for all your Copilot users, and organizations cannot disable it. |
| Disabled everywhere | Any unconfigured GA feature is automatically disabled for all your Copilot users, and organizations cannot enable it. |

**Enabled** is not **Enabled everywhere**. **Disabled** is not **Disabled everywhere**. Let organizations decide is the one string both pages print. Copy the string from the page you are following, and name the page.

The docs page also says where each level applies. At the enterprise level, the policy applies to features labeled **Unconfigured**. At the organization level, it applies to features an enterprise owner has set to **Let organizations decide**, but that an organization owner has not explicitly configured. That organization sentence is on the docs page. It is not in the changelog's "What's changing" list. Do not add it to the changelog.

There is a second policy on the same docs page, and it uses the shorter names. Under **Default availability of models**, the enterprise states are **Enabled**, **Disabled**, and **Let organizations decide**. That table is about models labeled **Delegate to Default Policy**. It is not the feature table. Do not paste Enabled from the model table into a feature runbook and call it the changelog's word. They happen to match. They are still different controls.

The October 20 post already covered the model-policy API enums. Leave that PATCH alone. "The models policy is already active" sits inside the markdown expiry block. A later heading, outside that block, says the **Default availability for released models** policy is active and affects new and unconfigured GA models. Do not merge those two sentences. Do not tell a reader the model default and the feature default flipped on the same day.

## Read the one-time rule before you change the default again

The changelog says the rollout is a one-time change. Subsequent changes to the default policy will not change feature policies that are already set. If you have enabled or disabled an individual feature, the rollout will not change that setting. Administrators can still make explicit choices for individual features at any time. That last sentence is in the opening, before "What's changing." Keep it. A one-time fill of Unconfigured rows is not a lock on the settings you set by hand.

The docs page says the same idea in its prevention section, which is outside the expiry comments. To disable default enablement entirely, disable the default policies in your enterprise or organization settings. You can set a policy for the entire enterprise, or disable the policy only in organizations with stricter compliance requirements. If you keep the default availability policies enabled, you can explicitly disable individual features and models so they are not eligible for automatic enablement.

Do not treat a later edit of the global default as a rewrite of rows the rollout already filled. If you need a feature off after that fill, the docs page points you at an explicit disable. I did not test that sequence in a tenant.

The docs "when does the policy apply" section is outside the expiry comments. It says the feature policy determines the default for newly released GA features, and for existing GA features that are **Unconfigured**. The "not currently active" sentence above it is inside the expiry comments. The HTML still shows both. They are not one paragraph.

## Leave preview on the sentence that printed it

Both pages keep preview out of the automatic fill. They do not use the same sentence. Do not merge them.

The changelog says preview features remain opt-in. If you opted into a preview that later becomes generally available, your choice will be preserved. Otherwise, the default policy will apply when it becomes eligible.

The docs page says the policy does not apply to features in preview. That sentence is outside the expiry block.

"Does not apply to preview" is the docs sentence. The GA-boundary rule is the changelog sentence. Cite the page you are following. Do not invent a third rule that combines them into a date.

## Do not smooth the scope list

The changelog says the policy applies to eligible settings on "Features & clients" and "MCP servers in Copilot." It then says to see the docs page for eligibility and exceptions. Follow that link. Do not stop at the two quoted labels.

The docs page says a "feature," for this policy, is any policy configured on an enterprise's Features and clients page, plus:

- The **Copilot code review** policy on the "Agents" page
- The **MCP servers in Copilot** policy on the "MCP" page

The Agents page is on the docs list. It is not in the changelog sentence. Do not add "Agents" to a quote from the changelog. If your runbook includes Copilot code review, the citation is the docs page, not the changelog's two-item sentence.

The docs page also names exceptions that are not affected:

- Restrictive model policies on GHE.com: **Restrict Copilot to data residency models** and **Restrict Copilot to FedRAMP models**
- **Store local sessions in the Cloud** for Copilot CLI and VS Code

Those exception names are not in the changelog body I saved. Use the docs page for the names. Do not invent a fourth exception. The cover-image alt text does not list Agents, MCP, or the exceptions. Do not treat that alt text as the scope list.

## Stop before you invent a banner

I did not confirm which enterprises have received the rollout. The changelog says the timing can differ. A missing banner on one tenant is not a reading I took, and a filled row on another tenant is not one either. I only have the two pages.

If your Features page still shows Unconfigured rows on October 26, which sentence are you going to put in the incident note: the changelog's through-October-26 rollout, or the docs page's October 22 enablement line that its own markdown marked to expire?

## Sources

- [Global default for Copilot features generally available](https://github.blog/changelog/2026-10-22-global-default-for-copilot-features-generally-available), GitHub Changelog, displayed October 22, 2026, `article:modified_time` `2026-10-22T20:56:27+00:00`. Fetched this run.
- [About default availability of Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability), GitHub Docs HTML. The changelog href without `/en/` matched these bytes. Fetched this run. No last-updated stamp in the saved HTML.
- [Same page, markdown](https://docs.github.com/en/copilot/concepts/enterprise/default-availability.md). The `expires 2026-10-22` comments are in this file. They are not in the HTML download.
