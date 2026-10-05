---
slug: "2026-10-05-insight-mean-is-not-a-ship-decision"
title: "An Insight mean is not a ship decision"
excerpt: "Foundry Insights is in public preview, and the 2 October quality study already says a judge mean is not a release gate. Read mixed-traffic precision, fix specificity, and the highlighted traces before you apply a proposed diff."
date: "2026-10-05"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-05-insight-mean-is-not-a-ship-decision"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "Insights", "agent observability", "evaluation", "Application Insights"]
readTime: 11
image: "/images/blog/2026-10-05-insight-mean-is-not-a-ship-decision-hero.png"
---

An Insight mean is not a ship decision.

imatiach's 2 October Foundry post scored recurring findings, then drew a line the portal card does not draw for you. A 3.53 judge mean is an automated snapshot. Trace precision of 100% on a failure-only corpus cannot measure a false positive. If you are about to paste a proposed diff because the card looks confident, open the highlighted traces first.

This is for anyone turning on Insights in Foundry while it is still public preview. I fetched the Tech Community page and the Learn how-to this morning. I did not run a scan on this host. None of the percentages below came from an agent I operate.

The page payload's `postTime` is `2026-10-02T14:34:39.047-07:00`. On this host, `date` converts that stamp to 17:34:39 EDT on 2 October 2026. From 07:00 EDT on 5 October, that clock is 61.42 hours old. It sits inside a 72-hour window and outside 48 hours. The Foundry blog's recent list still tops out on that day. This is not the 2 October latency study. Do not import those percentages here.

## An Insight is a review queue

An Insight is a reviewable finding about recurring agent behavior. It puts an explanation, supporting traces, and a possible next step in one place so you can investigate a pattern instead of opening every execution.

Title and description give the recurring behavior and a possible cause. Linked traces are the broader group. Highlighted traces are the examples you open. Category, severity, and status are triage context, not a risk assessment. Agent version and recency say which version the finding represents and when it was created. The proposed action is an investigation path. Concrete prompt or code proposals exist only for supported agent types. Everything else is general guidance.

Learn is more specific. Concrete diffs show up for Prompt agents and for code-based Hosted agents, and only when the configuration can see editable instructions or source. If Foundry cannot see the code, you get general remediation guidance and you apply it in the system that owns the agent. A side-by-side diff is not the default shape of an Insight.

Insights reads traces from the Application Insights resource connected to the Foundry project. Observability shows what happened. Evaluations test criteria you already knew to measure. Insights is aimed at repeated behavior you did not predefine. You still review the cited traces and validate any change through your normal evaluation and deployment path.

## Preview means you still own the gate

The post says Insights is now in public preview. The live Learn page I fetched this morning marks the feature preview, says the preview has no service-level agreement, and says not to use it for production workloads. The docs source file's `ms.date` is 09/22/2026. The how-to is the operator manual. The 2 October post is the measurement design. Do not collapse those dates into one ship clock.

Learn also says Insights are not guaranteed to be real time, can miss real issues, and can combine unrelated behavior. Category, severity, ownership, likely cause, and proposed actions are decision support, not authoritative classifications. Do not use Insights as your only production monitoring, security, safety, or compliance control. Outages, quotas, and dependency incidents stay with Azure Monitor or the service owner.

Generation, including scheduled runs, uses your model deployment and can incur model charges. Neither page publishes a dollar figure. Do not invent one.

## Precision without healthy inputs cannot catch a false positive

The study uses three checks. Labeled trace evaluation asks whether Insights link inputs that reference annotations mark as failing. Unlabeled assessment asks whether an LLM judge finds the write-up grounded and useful. Controlled tests ask whether Insights identify known injected issues. A high number on one check does not answer the other two.

Trace precision is the fraction of unique linked benchmark inputs that are failure-labeled. It measures discrimination only when the dataset includes healthy inputs, and it does not validate the diagnosis. Trace recall is the percentage of failure-labeled inputs linked by at least one Insight. It does not count distinct failure modes.

They ran the production pipeline on the same 746 benchmark inputs, 653 of them failure-labeled, on 15, 16, and 17 September 2026. Repeating those inputs does not create 2,238 distinct examples. The six slices are selected, normalized inputs from public agent-trace datasets with human reference annotations. They are not a representative sample of customer production traffic.

| Dataset | Inputs/day | Failure-labeled/day | Linked/day | Mean trace precision | Mean trace recall |
| --- | --- | --- | --- | --- | --- |
| AgentRx (Tau-bench retail) | 102 | 29 | 43–45 | 37.8% | 57.5% |
| AgentRx Magentic-One | 58 | 44 | 54–57 | 75.3% | 94.7% |
| TRAIL | 148 | 143 | 139–140 | 96.9% | 94.6% |
| AgentErrorBench | 200 | 200 | 194–196 | 100.0% | 97.3% |
| TraceElephant | 220 | 220 | 218–220 | 100.0% | 99.7% |
| MAST-Data (human subset) | 18 | 17 | 14–16 | 93.3% | 82.4% |

The post marks the two 100.0% precision cells. When every input is failure-labeled, 100% trace precision cannot measure false-positive control. AgentErrorBench and TraceElephant are built that way. TRAIL, AgentRx Magentic-One, and the MAST subset are mostly failures too, so their precision sits near the failure-label rate. Read precision beside recall and beside how many inputs were already labeled failing.

## AgentRx is the mixed-traffic number

AgentRx Tau-bench retail is the mixed-traffic stress test. Only 29 of 102 inputs were failure-labeled. Across the three days, trace precision was 43.2%, 37.8%, and 32.6%, averaging 37.8%. Trace recall was 65.5%, 58.6%, and 48.3%, averaging 57.5%. Daily linked counts were 44, 45, and 43, including 19, 17, and 14 labeled failures. Those daily rates were averaged before rounding.

Some linked inputs without failure labels might contain issues outside the reference labels, such as cost or latency. The benchmark cannot confirm that. You cannot rescue 37.8% by assuming the unlabeled links were secret true positives. You also cannot treat 57.5% recall as proof the explanation is right. Precision and recall only say whether the link landed on an input the annotations marked as failing.

If your traffic looks more like AgentRx than like TraceElephant, expect a modest precision card. That row can show false-positive pressure. The 100% rows cannot.

## A judge mean is not a human rating

The unlabeled evaluation uses a separate LLM judge against the supplied evidence. It does not use reference failure labels. The scores are not human ratings, and they do not establish that a proposed action will improve the agent.

Each Insight gets a 1-to-5 score on eight dimensions: actionability, specificity, novelty, correctness, severity calibration, impact, fix specificity, and fix applicability. The fix is not executed as part of the score. Severity calibration and impact are separate. A minor issue can be well labeled and still not be high-impact. Novelty is an estimate, not a measurement of what your team already knows.

The snapshots cover 4,496 inputs and 40 generated Insights. Each Insight's overall score is the mean of its eight dimensions. The table averages those overall scores inside each dataset. The post does not combine datasets into one quality score. Do not do that in a status meeting.

| Dataset | Inputs | Insights scored | Mean judge score (1–5) |
| --- | --- | --- | --- |
| PUPA | 901 | 5 | 3.53 |
| FailSafeQA | 1,101 | 11 | 3.57 |
| Monitoring dashboard agent (internal) | 1,342 | 4 | 3.88 |
| tau2-bench | 1,112 | 16 | 2.84 |
| Synthetic scenarios | 40 | 4 | 3.81 |

Small Insight counts, and choices such as grouped versus individual judging, make these protocol-specific diagnostics. A 3.53 on five PUPA Insights is not a fleet quality score.

Fix specificity was the lowest-scoring dimension in four of the five snapshots, with means from 2.00 to 2.64. That dimension asks whether the proposed fix names an exact asset or behavior to change. On tau2-bench, correctness was the low dimension, at 2.25. A vague next step and an unsupported claim are not the same bug. The public examples are selected illustrations, not a sample of all 40 Insights, and the post says a proposed intervention still needs evaluation.

## Ten of eleven is an illustration

The September 23 hosted-agent report is a controlled illustration, not a product-wide detection rate. Of 12 expected issues, 11 were scorable and 10 were detected. Three scorable healthy baselines had no confirmed unsupported findings. One additional issue was unscored. Incomplete evidence stays unscored. It is not a pass and it is not a miss. That framework is separate from the 40-input synthetic row. Do not add 10/11 to 3.81 and call it a grade.

Daily scores are not automatically an improvement trend, and these results do not establish recurrence across runs.

## What to do before you change the agent

Start with one agent that has an owner, both successful and unsuccessful traffic, stable version identity, and enough repetition for a pattern. Missing spans, tool arguments, or tool results will thin the grouping and the fix.

The judge is a GPT model. Learn says GPT-5 or newer. Mini and nano are supported. A larger variant is better for Insight quality. The project's managed identity needs access to that deployment.

A Prompt agent needs the interactive user to have Foundry User on the project. A Hosted agent needs Foundry Project Manager. Both that user and the project's managed identity need Monitoring Reader on the connected Application Insights resource. If `AppGenAIContent` is protected, each identity that reads it also needs Privileged Monitoring Data Reader. Those Foundry role names were previously Azure AI User and Azure AI Project Manager. You may still see the old names. The role IDs did not change.

In the portal: Build, Agents, the agent, Insights. Pick the judge and select Run scan now. The scan is asynchronous. You can leave the page. Scheduled generation is under Settings, then Insights. The first analysis uses a 7-day lookback. History can show token usage, traces analyzed, and new or updated Insights. Severity is High, Medium, or Low. A large linked-trace count does not prove business impact. An empty result does not prove the agent is healthy.

Before anyone edits a prompt, use the review sequence the post attributes to Learn:

1. Confirm the workflow, agent version, category, severity, and time.
2. Open the highlighted traces and verify the cited behavior is there.
3. Compare those examples with healthy traces.
4. Decide whether the issue belongs to the agent, a tool, a model endpoint, a data source, or the platform.
5. Turn a confirmed pattern into evaluation coverage, an optimization objective, owner routing, or a monitored decision to take no action.

If the evidence points at a tool, endpoint, MCP server, data source, or the platform, route it there. Do not apply an agent-side prompt change for a failure the agent does not control.

## Three parameter traps

I did not run the Python samples. Learn's examples use `azure-ai-projects` 2.6.1 or later, `allow_preview=True`, and `beta.agent_insight_monitors`. Three parameters are easy to misread.

The on-demand example uses `lookback_hours=3` and expects traces already ingested in that window. The first portal analysis uses seven days. A quiet three-hour run does not prove the seven-day history is clean. A successful run also does not guarantee new Insights.

If a monitor already exists, get it. Do not delete it to rerun a sample. Deleting a monitor removes its runs, Insights, and state. The schedule example sets `enabled=True` and `run_interval_hours=6`. Enabling it can start a run immediately, the schedule survives the Python session, and it can incur model charges. Disabling the schedule does not cancel a run that is already active. Setting status to resolved records your review. It does not apply the fix.

`agent_insights_get` only reads an existing monitor. It does not start a scan or change the agent. Pass the project endpoint and the exact agent name, not a monitor ID and not a name plus a version. If `has_more` is true, pass that page's `last_id` as `after`. An empty result means nothing matched. If the tool says the monitor does not exist, run a portal scan before you retry.

A 404 from the preview API can mean Insights is not enabled for that subscription context. A 403 means the caller is not authorized. Do not retry a 403 as if it were a cold start.

If your mixed-traffic links look like the AgentRx row, and fix specificity is the dimension that scored lowest, do you still hand the proposed diff to the agent owner, or do you open the highlighted traces and name the owner first?

Sources: [Beyond the Trace: The Science of Insight Quality](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/beyond-the-trace-the-science-of-insight-quality/4559981), 2 October 2026, `postTime` `2026-10-02T14:34:39.047-07:00`. [Use Insights in Foundry](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/agent-insights), live page fetched 5 October 2026; docs source `ms.date` 09/22/2026.
