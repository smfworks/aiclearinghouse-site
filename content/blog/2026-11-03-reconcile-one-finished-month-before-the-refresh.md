---
slug: "2026-11-03-reconcile-one-finished-month-before-the-refresh"
title: "Reconcile one finished month before you schedule the cost agent"
excerpt: "Load the three cost skills on Azure SRE Agent, paste the bootstrap prompt, and match one finished month in Cost Management before you turn on the Monday refresh."
date: "2026-11-03"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-03-reconcile-one-finished-month-before-the-refresh"
categories: ["Microsoft", "Azure", "AI Agents"]
tags: ["Azure SRE Agent", "Cost Management", "how-to"]
readTime: 10
image: "/images/blog/2026-11-03-reconcile-one-finished-month-before-the-refresh-hero.png"
---

Your Azure bill moved, and you want a sentence you can hand the person who owns the workload. Start with one subscription whose finished month you already trust, load the cost kit on Azure SRE Agent, and match that month in Cost Management before you schedule a refresh. [AsithaDeSilva's Apps on Azure post](https://techcommunity.microsoft.com/blog/appsonazureblog/why-did-our-azure-bill-change-investigating-cloud-spend-with-azure-sre-agent/4569760) is the walkthrough I opened this morning. Python put the HTML `postTime`, `2026-11-02T19:51:16.081-08:00`, at 8.16 hours before 7:00 AM Eastern on November 3. That clock is `2026-11-03 12:00:40 UTC`. The saved feed item is `Tue, 03 Nov 2026 03:51:16 GMT`, the same instant. `article:modified_time` is `2026-11-02T19:46:56.448-08:00`, 8.23 hours before the same clock. `revisionNum` is 2. `latestVersion` is major 1, minor 0. JSON-LD `datePublished` reads `11/3/2026, 3:51:16 AM` and prints no timezone.

By the end you can paste the bootstrap prompt, keep a current-month bar labeled as a projection, and leave the Monday refresh off until the finished month matches.

## Pick the subscription you already understand

The post's try-it section says to start with one subscription whose costs you already understand, so the first report is easier to reconcile before you widen the scope. The same page calls the repository a prototype: an importable dashboard template, reusable skills, and example report screenshots. Those files show the reporting approach. The post says they are not evidence of measured customer savings, verified production readiness, or a completed deployment in your environment. The prompts on the page are examples to try, not a transcript of a measured production investigation.

The product underneath the kit is [Azure SRE Agent](https://learn.microsoft.com/en-us/azure/sre-agent/overview). On the overview I fetched this morning, HTML meta `ms.date` is `2026-10-28T00:00:00Z` and `updated_at` is `2026-10-29T22:11:00Z`. Python put that update at 109.83 hours before the same 7:00 AM clock, outside the three-day window. Treat the Learn pages as the product docs, and the November 3 post as the cost walkthrough.

The overview describes three patterns. One of them is "Investigate and advise": ask a question in ordinary language and get an answer tied to sources. Another is "Automate scheduled workflows": schedule proactive health checks, compliance sweeps, and routine operational tasks. Skills, on that page, are discrete capabilities, including marketplace runbooks and Azure CLI scripts. The agent authenticates with a managed identity and operates under Azure role-based access control. Every proposed tool call passes through governance controls before it runs. Each tool can be set to allow, ask, or deny. In Review mode, an SRE Agent Administrator approves the write actions that require approval.

## Add the three skill folders, then paste prompt 01

The post says to add the three skills from the skills folder and upload the cost analysis playbook as a knowledge source. The [README the post links](https://github.com/Asithdee/Azure/blob/main/SREAgent/ConversationalCostAnalyticsAgent/README.md) names the folders:

- `skills/cost-month-to-month/SKILL.md` for cost queries, resource-level changes, projections, and a 12-month trend
- `skills/advisor-cost-optimization/SKILL.md` for rightsizing, commitment recommendations, and resources that may be orphaned
- `skills/budget-overview/SKILL.md` for month-to-date spend, previous-month actuals, forecasts, and budget utilization
- `knowledge/cost-analysis-playbook.md` as the knowledge upload

Earlier on the same post, the author groups the build as an analytical skill, a query-reference skill, and an HTML Live Report template. A template decides how findings appear. A skill decides how the agent should investigate. The folder list above is what you add. Keep the post's three-piece description and the README's three folders as two lists.

Both the post and the README call for two roles on each target subscription. `Cost Management Reader` reads subscription cost and usage. `Reader` discovers subscriptions and enriches resources through Azure Resource Graph. The post's table gives Resource Graph the role "Resource inventory and metadata enrichment, not cost data." The README says reservation, savings plan, and billing-scope visibility may require additional permissions, and that subscription `Reader` access does not automatically expose every commitment dataset. Report an unavailable dataset as unavailable.

Then paste [prompt 01](https://github.com/Asithdee/Azure/blob/main/SREAgent/ConversationalCostAnalyticsAgent/prompts/01-bootstrap-environment.md) into the agent chat, after the skills and the playbook are in. The file I fetched says to do this, in order:

1. List enabled subscriptions through Resource Graph `ResourceContainers`. If more than one comes back, the prompt tells the agent to ask which subscriptions are in scope. Answer with the one you already understand.
2. Run a `MonthToDate` Cost Management query grouped by `ServiceName`, using the `cost-month-to-month` skill. The file says that query is a POST via the write CLI tool.
3. Record the billing currency from the `Currency` column.
4. If the query returns `AuthorizationFailed` or `RBACAccessDenied`, the prompt tells the agent to print an `az role assignment create` command for Cost Management Reader on the managed identity, and wait. Read that printed command before you run it.

The post explains why a cost read shows up on a write tool. The agent sends an HTTP POST to Azure Cost Management, so the kit runs it through `RunAzCliWriteCommands`, even though the query only reads data. The same paragraph says the query does not resize, delete, or modify resources, and that you should still configure permissions and tools carefully. On the October 28 overview, Review mode is the setting where an administrator approves write actions before they run. Expect that approval on the cost POST. The [pricing page](https://learn.microsoft.com/en-us/azure/sre-agent/pricing-billing), same `ms.date` and `updated_at` as the overview, says waiting for your response is not billed as active flow.

## Read the label on the bar

Prompt 01 tells the agent to reply with subscriptions, currency, a month-to-date total, the top three services, and anything that failed. After that reply, the README's next files are prompt 02 with `reports/month-to-month-cost.html`, prompt 03 with `reports/subscription-cost-budget.html`, and prompt 04 with `reports/advisor-cost-optimization.html`. The README says the templates contain demonstration data and placeholders. Replace them with authorized data during setup. The post's try-it bullet names the first-run prompt and the HTML template together. The README puts access validation in prompt 01 and the template in prompt 02. Follow that order.

Four questions on the post are worth keeping in front of you while you read the first report.

Where spending is heading. For an in-progress month, ask for matched month-to-date periods. If the report shows a full-month run-rate projection, keep the projection label. The post says to describe it as a Cost Management forecast only when that forecast was actually retrieved. The Figure 1 caption says the current-month KPI is a projection, and that the screenshot does not establish that the partial-month trend bar uses the same basis. Reconcile those two values before you compare them.

Which resources explain the change. The post's example prompt is: "Rank the resources driving increases and decreases. Separate newly billed resources from existing resources whose costs changed." The Figure 2 caption says the screenshot's "New Resources" label means newly observed in billing. Confirm creation with inventory or deployment history. One resource can appear in several billing records for different services or meters. Add the relevant entries if you want that resource's total. The post's $800 increase, $300 decrease, and $500 net are an illustration, the page's own word.

Which recommendations deserve a conversation. The post's example is: "Show Azure Advisor cost optimization recommendations for the subscriptions in scope. Separate estimated savings from confirmed spending reductions." The Figure 3 caption says displayed savings are estimates, and that a displayed zero for reservations requires a successful, authorized query before you read it as no reservations. The post also says recommendations can overlap, so adding every displayed savings figure may overstate the opportunity, and that rightsizing can change the baseline for a reservation or savings plan. The useful next step on the page is a review with the workload owner.

What you might be paying for without using. The post's example is: "Identify potentially orphaned resources and show the evidence that makes each one a candidate for owner review." The example view covers unattached disks, stale snapshots, unassociated public IP addresses and network interfaces, and empty App Service plans. The Figure 4 caption calls an apparent orphan an investigation finding. The post says the intended configuration is read-only reporting, and that the template alone does not enforce that boundary. Any cleanup needs separate validation and explicit approval.

The README adds four limits you will feel on that first report. The subscription picker updates labels. It displays the scope populated during refresh. Month selection updates the trend and the service comparison. It leaves the current-versus-previous-month resource totals on the refresh snapshot. Cost reports use USD labels and dollar formatting by default. Reports contain saved snapshots and use `allowedTools: []`. The post says opening the report shows the data from the most recent refresh, and that the report does not automatically request updated billing data. A connector is what lets the report fetch on its own. You can start without one.

## Match one finished month, then decide on Monday

The post's validate step is the gate. Reconcile a completed month's totals against Cost Management using the same scope, currency, and cost basis. Check resource aggregation, labels, and missing-data states. The README says to do that before prompt 05, the scheduled-tasks file.

The post names a suggested Monday 07:00 UTC refresh prompt, and says to confirm scheduling support, permissions, and failure handling in your environment before you rely on it. The October 28 overview has the product path for a schedule: select Automation in the sidebar, select Create, then Scheduled task, and enter the task name, instructions, and schedule. Results from that path show up in the connected incident platform or notification channel. The kit's Monday line is the post's suggestion. The sidebar path is the overview's.

Charges are real. The post says using this workflow may incur Azure SRE Agent charges and other applicable service charges, and that the post does not describe a free service offering. The pricing page meters usage in Azure Agent Units. Always-on flow is 4 AAUs per agent-hour for as long as the agent exists, from creation until deletion. Active flow covers interactive questions, scheduled tasks, and background work. The same page says, "New customers can evaluate SRE Agent that waives the always-on cost." It also says to check the Azure pricing calculator for current pricing in your region. A misconfigured automation runs repeatedly and wastes AAUs, which is why the pricing page says to try the prompt in chat before you automate it.

If you need the agent to stop working, the pricing page splits two actions. Stop, under Settings then General, ends active flow and leaves the always-on charge in place. Delete agent, at `sre.azure.com` under Settings then General, stops all billing.

Try this on the subscription you already understand. Add the three skill folders, upload the playbook, paste prompt 01, and read the currency it records. After prompt 02 replaces the demonstration data, compare one finished month with Cost Management on the same scope, currency, and cost basis. Leave prompt 05 until that match holds.

If those two finished-month totals disagree, which label are you going to read first, the currency on the report or the cost basis on the Cost Management query?
