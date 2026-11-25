---
slug: "2026-11-25-confirm-the-finding-then-send-the-ones-you-believe"
title: "Confirm the finding, then send only the ones you still believe"
excerpt: "An insights scan hands you a finding to investigate. Read the traces, keep only the ones you still believe, and send those to agent optimizer. The trial can still change live systems if the tools can."
date: "2026-11-25"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-25-confirm-the-finding-then-send-the-ones-you-believe"
categories: ["Microsoft", "Foundry"]
tags: ["Microsoft Foundry", "Agent Optimizer", "Insights", "how-to"]
readTime: 9
image: "/images/blog/2026-11-25-confirm-the-finding-then-send-the-ones-you-believe-hero.png"
---

If the same miss keeps showing up, read the conversations before you send anything onward. Keep only the findings you still believe. Then ask for a trial change. That trial can still change the systems the tools can touch, even if you never accept the new version.

That is the job. The clicks below come from three pages fetched this morning.

## Start on the Insights tab

The post is [Turn Agent Insights into Improvements](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/turn-agent-insights-into-improvements/4575204) on the Microsoft Foundry community blog. The visible byline lists José Santos, Vinutha Karanth, Luffy Chen and Morteza Ziyadi. The login name on the page is jcasantos. `postTime` and `lastPublishTime` are both `2026-11-23T10:00:00.095-08:00`. The response `Date` is `Wed, 25 Nov 2026 12:02:48 GMT`, status 200, 580,122 bytes. That clock is 42.05 hours after `postTime`, and the same stamp is 42.00 hours before 07:00 ET. `lastEditTime` and `article:modified_time` are both `2026-11-20T07:56:22.368-08:00`, 116.11 hours before that Date and 116.06 hours before 07:00 ET. The edit is older than the publish. The saved HTML has zero `article:published_time`. JSON-LD `datePublished` is `11/23/2026, 6:00:00 PM` with no timezone, and `dateModified` is `11/20/2026, 3:56:22 PM` with no timezone. The stripped page shows Nov 23, 2026. The footer says Published Nov 20, 2026, Version 1.0. `revisionNum` is 4. `latestVersion` is major 1, minor 0. Leave the footer date and the `postTime` as two clocks.

The [Foundry Tech Community feed](https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=azure-ai-foundry-blog) lists this post at `Mon, 23 Nov 2026 18:00:00 GMT`. The saved response is gzip, 124,280 bytes, and it decompresses to 532,533. The [Foundry DevBlog feed](https://devblogs.microsoft.com/foundry/feed) does not carry this post. Its newest item this morning is the Ignite wrap, `Tue, 24 Nov 2026 16:00:51 +0000`, in a saved feed of 247,920 bytes.

The blog calls the path Insights Optimization, and it calls that path a public preview. An insight, in the blog's sentence, is an AI-generated finding to investigate. Read the description, the affected agent version, and the linked conversations before you choose what to send. Some findings point at unclear instructions. Others point at an unavailable service, missing data, or a broken tool. Those need their own fix. Changing the agent's wording cannot repair a broken dependency.

The public procedure is [Fix insights with agent optimizer (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/optimize-agents-from-insights). I fetched it with `Accept: text/markdown`. The file is 8,871 bytes, `Date: Wed, 25 Nov 2026 12:02:07 GMT`, `Last-Modified: Tue, 24 Nov 2026 21:23:17 GMT`. `updated_at` is `2026-11-24T15:07:00.0000000Z`, 20.92 hours before that Date and 20.88 hours before 07:00 ET. `ms.date` is still `2026-11-11T00:00:00.0000000Z`, 348.04 hours and 348.00 hours. Use `updated_at` for the content clock. `git_commit_id` is `bec04d9a19ca4c8fd9799cccf4aa6494938bcc1b`. Teach the clicks from this public page. The blog's docs links go to `review.learn.microsoft.com`, including `optimize-agents-from-insights?branch=main` and the insights how-to with `branch=release-ignite26-foundry-2026-10`. Those are branch URLs. The steps below are the public page.

## Read the finding, then decide who owns it

Everyday version: a finding is a note that the same miss kept showing up. You still decide whether the note is right.

The scan page is [Find recurring issues with insights](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/agent-insights). Same kind of fetch, 39,130 bytes, `Date: Wed, 25 Nov 2026 12:02:07 GMT`, `Last-Modified: Tue, 17 Nov 2026 20:51:57 GMT`. `updated_at` is `2026-11-17T19:54:00.0000000Z`, 184.14 hours before that Date and 184.10 hours before 07:00 ET. `ms.date` is `2026-11-10T00:00:00.0000000Z`, 372.04 hours and 372.00 hours. `git_commit_id` is `9f569454df894e4187555a2587a75fe1a2afcde5`. Use this page for the scan. Use the procedure page for the optimizer clicks.

If the Insights tab is empty, run the scan before you look for a checkbox.

Open the project in the [Foundry portal](https://ai.azure.com/?cid=learnDocs). Select Build, then Agents, then the agent, then the Insights tab. Select Settings, then Insights under Monitor settings. Select the supported Judge model. The page says Foundry supports only GPT models for that job, and it says to use GPT-5 or a newer GPT model. Mini and nano variants are supported. For better insight quality, it says to use a larger model variant. Under Priorities, select Add priority and pick the built-in categories that match the miss you care about. Under Instructions, add any extra guidance, then select Save.

Back on the Insights tab, select Run now. The first analysis uses a 7-day lookback. The scan starts asynchronously. Leave the page and come back. The same page says not to reset or repeatedly reenable the monitor while a run is active.

There is a toggle labeled `Scheduled analysis paused`. Turn it on if you want analysis every six hours. Leave it off if you only want Run now. The label says paused. The instruction says turn it on to schedule. Follow the instruction, and read the label so you know which control you touched.

When findings appear, open the linked traces. If the evidence points at a tool, a model endpoint, an MCP server, a data source, the network, or the Foundry platform, route that insight to the person who owns that piece. The page says not to apply an agent-side prompt or code change when the agent does not control the failing behavior.

## Check the boxes you still believe

This portal path is for prompt agents. The procedure page says it currently supports prompt agents that don't use the Microsoft Copilot harness, and that hosted agents use Foundry Toolkit or Azure Developer CLI workflows instead. The scan page uses the same harness sentence, then says "workflow," singular, for that other path. The blog says the portal workflow currently only supports prompt agents that do not use the Microsoft Copilot harness, and that hosted agents use separate toolkit or CLI workflows. The blog's stripped text has zero `Foundry Toolkit`. Keep the three wordings. If the agent uses the Microsoft Copilot harness, stop on this portal path and follow the hosted-agent workflow the public page names.

A [July post on this site](/blog/2026-07-18-foundry-agent-optimizer-closed-loop) walked a hosted-agent loop. These pages start on the Insights tab.

Before you create a run, read the warning on the procedure page. If the agent's tools can modify production systems, the run can cause unintended or irreversible changes. The example on the page is an order-deletion tool deleting an order from the connected production database during evaluation. That risk applies even if you never promote a candidate. Isolate the resources and permissions the tools use, not just their execution environment. The blog puts the same boundary in its own words: isolating the execution environment alone does not isolate a production database. Tool calls during evaluation can also incur charges or trigger rate limits. The blog also says evaluation executes the agent's tools. Manual promotion controls whether you adopt a candidate. It does not undo a tool call the trial already made.

Then do this:

1. On the Insights tab, review the descriptions, the linked traces, and the proposed fixes. Select `Select insights`.
2. Check each insight you still want addressed. Select `Fix insights`.
3. In Create optimization run, confirm Agent, Version, Optimization model, Max candidates, and Evaluation model. The current agent version is the baseline.
4. Select Create.

The numbered step says `Fix insights`. A screenshot alt on the same page says `Fix insight`, singular, in the details pane. Searching that markdown, `Fix insights` appears 4 times and `Fix insight` appears 5 times, so one hit is the singular alt. Use the list action the step names.

The blog's link text is "Fix insights with agent optimizer (preview)," and that link goes to the review branch. The stripped blog text has one `Fix insights` and zero `Select insights`. The button names for these steps are on the public procedure page.

## Read Insights improved before you promote

When the run finishes, start with Insights improved. That view is how many selected insights the candidate improves. View evaluation is the general-quality rubric, used here as a regression check. It counts a different thing from the improved insights. View overall score details can show more candidates than the main results view.

The procedure page says a candidate can pass the general-quality check with up to 2% regression if it addresses at least one selected insight. That markdown has one `2%` and zero `0.02`. The blog says the team set a tolerance of 0.02 on the normalized quality-score scale, two points on a 0-100 presentation, and that the guard still allows some regression. The blog's stripped text has two `0.02` strings and zero `2%`. The second `0.02` sits in the internal snapshot, next to a broader-quality change of about 0.003. Leave that snapshot out of a capacity plan. The figure caption includes the words "not production results," and the usage paragraph says those token measurements should not be read as expected customer usage or cost.

Candidates can change agent instructions and descriptions for function-calling tools, but not the model or skills. Review the text changes and both results. Promote a candidate only after you confirm it improves the selected behaviors without a regression you will not accept. The procedure page says an optimization run doesn't change your active agent unless you review and promote a candidate. The blog says keeping the current agent is a valid outcome when the run does not find a qualifying improvement. The blog also says developers should not read "evaluated" as automatically meaning "independently tested." That sentence is on the blog. It is absent from the procedure page fetched this morning.

Try this on one prompt agent today. Confirm the traces, send one finding you still believe, and point the tools at a read-only or isolated resource before you select Create. If Insights improved and the quality check disagree, keep the current version.

If a finding points at a broken tool rather than a missing instruction, who on your team gets that insight before anyone presses Fix insights?
