---
slug: "2026-10-04-foundry-latency-lab-wont-add-the-percentages"
title: "The Foundry latency lab will not let you add the percentages"
excerpt: "Yassine El Ghali's 2 October Foundry study cut median AI-path latency 23% to 50% only when optimized software and verified Priority Processing were compared as one configuration. Adding the one-lever wins invents a number the lab refused to publish."
date: "2026-10-04"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-04-foundry-latency-lab-wont-add-the-percentages"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "latency", "Priority Processing", "prompt caching", "tool search"]
readTime: 11
image: "/images/blog/2026-10-04-foundry-latency-lab-wont-add-the-percentages-hero.png"
---

The Foundry latency lab will not let you add the percentages.

Yassine El Ghali's 2 October post measured 2,040 executions and still refused to stack the wins. Comparing complete configurations — optimized software plus verified Priority Processing — cut median AI-path latency by 23% to 50%, depending on the workload, versus non-optimized Standard pay-as-you-go. The same paragraph says that result does not isolate Priority Processing. If you add the one-lever percentages on top of that range, you invent a speedup the lab did not publish.

This is for anyone about to turn on a faster tier because a chart looked slow. Shorten the path first. Then read `service_tier` on the response. I fetched the post, the Foundry blog index, and the Learn pages it points at on the morning of 4 October 2026. I did not run the benchmark. None of the milliseconds below came from this host.

The Foundry blog index card and the article byline both say Oct 02, 2026. The page footer says Updated Sep 26, 2026, Version 1.0. A direct curl of that URL from this host returned HTTP 403, so I do not have a schema `datePublished`. The dates here are the visible byline and footer.

## Start with the timer, not the model name

The post's short version is the sequence worth keeping. Remove unnecessary output, visual processing, and tool definitions. Reuse stable prompt prefixes and app-managed MCP sessions. Remove serial waits and extra model rounds. Then test Priority Processing on the work that remains. Measure correctness with latency. A fast wrong answer is not a performance improvement.

Automated scorers checked required fields, facts, tool calls, and arguments. Failed and incorrect runs stay in the reliability count. Latency percentiles come only from correct completions. There is no silent retry.

AI-path latency starts immediately before a model request, or an orchestrated model-and-tool workflow, and stops when that response or workflow completes. Validation time is outside the timer. So is networking to the app, UI rendering, and preprocessing such as resizing, PDF generation, text extraction, or OCR.

If the wait a user feels is the OCR step, this lab did not time it. Sending already-extracted text was 17.2% faster on the AI path. Extraction happened before the timer. Do not quote that as an end-to-end document speedup.

## What 2,040 actually counts

Each measurement is one execution of a scenario, variant, and fixture. Each case produced 30 observations across five deterministic fixtures, in a seeded randomized schedule. Treatment and control were paired on the same fixture and round.

The analyzed set is 2,040 measurements. The audit trail has 2,160 executions from the publication campaign, excluding cloud preflight. One hundred twenty earlier client-lifecycle runs were dropped after the timing boundary was corrected.

One Azure account, resources in East US 2, cases one at a time except where a treatment tested fan-out. The combined benchmark used Azure OpenAI Global Standard. East US 2 is the resource region, not a guarantee that inference stayed there. Individual tests used `gpt-4.1-mini`. The combined run used `gpt-4.1`, version `2025-04-14`. This was not a load test. Do not combine the two percentage sets.

Fixtures were synthetic, and the combined run reused them, so this is not a held-out production replication. Median effects used 5,000-sample bootstrap intervals, not adjusted for multiple comparisons. A result was labelled faster only when that interval excluded zero. A p95 from 30 observations is descriptive.

I did not open the lab repository. The post points at [yelghali/foundy-ai-perf-testing](https://github.com/yelghali/foundy-ai-perf-testing). That spelling is the published URL. These numbers are the blog's results, not a second audit.

## Do not shop from the one-lever table

These are workload-specific findings, not service guarantees.

| Change | Workload | Median result | What still has to be true |
| --- | --- | --- | --- |
| Concise text answer | Text | 26.0% faster | 29/30 correct; one stream ended early |
| Concise JSON | Image | 24.9% faster | 30/30 correct |
| Reuse a cacheable prefix | Text / image | 14.9% / 23.6% faster | Requests reported cached tokens |
| Low image detail | Image | 17.8% faster | Fine text is still accurate |
| Extracted text instead of a PDF | File | 17.2% faster AI path | OCR sat outside the timer |
| Three pages at once | File | 56.8% faster | Same three model requests |
| Two functions in one response | Function tools | 28.2% faster | Mostly one fewer model request |
| Five tools instead of 20 | Function tools | 16.8% faster | The required tool stays available |
| Minimal tool descriptions | Function tools | 14.4% faster | Selection and arguments stay correct |
| Cold MCP session | MCP | 34.1% slower than reuse | Lifecycle and recovery stay safe |
| Tool search, 50-tool Toolbox | Toolbox / MCP | 43.0% slower p50 | Input tokens fell 26% |

The post's rule is to test compatible winners together. Adding the left column is how you invent a number.

## Shorten the output contract

Concise text fell from 2,078 ms to 1,537 ms median, 26.0% among correct completions, 29 of 30 correct. Concise JSON on the image task fell from 1,646 ms to 1,237 ms, 24.9%, 30 of 30 correct. Ask for the fields the next step keeps. Then check that the shorter response still meets the requirement.

Removing 12 irrelevant history turns lowered the observed text median by 12.7%. The interval included zero, so that cut is inconclusive for latency. It can still reduce token cost. The lab does not claim a latency win for it.

`gpt-4.1-nano` was not consistently faster than `gpt-4.1-mini`. On the tested image task it was 25.0% slower. Test the task. The name is not the evidence.

The post says `detail: "low"` is not a file resize. The full image is still sent, and low detail asks for a 512 by 512 representation instead of tiled high-resolution inspection. The Learn vision page I opened documents `detail` as `low`, `high`, or `auto`. The section I read did not repeat the 512-pixel sentence, so that size stays a blog claim. Image resizing lowered the median 12.8% and raised descriptive p95 from 5.1 seconds to 8.8 seconds. Local resize time was outside the timer. A faster median with a slower tail is not an SLO.

## Prefix first, then cached_tokens

[Learn's prompt-caching page](https://learn.microsoft.com/azure/foundry/openai/how-to/prompt-caching) says caching reduces latency and cost when longer prompts share identical content at the beginning, and that it does not change the output beyond that. Hits show up as `cached_tokens`. One different character in the first 1,024 tokens is a miss. Caching is on by default for supported models.

The lab's `gpt-4.1` requests needed at least 1,024 input tokens, and the first 1,024 had to match. The service reuses the prefix only until the first change. A timestamp or request ID at the front breaks the match before the stable instructions can help.

Warm-prefix caching cut text median latency 14.9% and image median latency 23.6%. Average text time to first token fell from 991 ms to 602 ms. Roughly 93% to 100% of repeated requests reported a hit. Controls that changed a leading value reported no cached tokens. Caching was inconclusive for the file and function-tool tasks. When document processing or tool selection dominates, the prefix is not the wait.

If the deployment is GPT-5.6 or later, Learn says cache writes can incur charges on top of discounted reads. Earlier families do not charge extra to write the cache. The lab did not test GPT-5.6. I am not quoting a rate. On those responses, also read `cache_write_tokens`. Learn's 128-token increment after the first 1,024 tokens is a GPT-5.5-and-earlier rule, not a result from these 2,040 runs.

## Same requests, less waiting

A reused app-managed MCP session completed in 2,283 ms at p50. A cold session that rediscovered tools every task rose to 3,061 ms, 34.1% slower. Setup and discovery averaged 1,016 ms. The local tool stayed under 5 ms. That is lifecycle, not model speed, and the post says it does not automatically apply to service-managed MCP. Scope reuse by identity and tenant, and plan for expiry and reconnect.

Three independent pages, started together, fell from 2,811 ms to 1,216 ms median, 56.8%. Both arms made the same three model requests. This holds only when the requests are independent and quota can take the burst.

The function task needed weather and local time. Letting one model response request both, then answering once, cut p50 from 3,646 ms to 2,617 ms, 28.2%. Handlers finished in under 5 ms, so the win was mostly one fewer model round. `parallel_tool_calls=True` permits multiple calls. It does not guarantee every required tool is selected. Do not copy the 28.2% onto service-managed MCP or Foundry Agent Service without traces from that runtime.

Cutting 20 function tools to five lowered p50 16.8%. Minimal descriptions lowered it 14.4%. Exposing 50 tools, complex schemas, ambiguous descriptions, and reordered definitions did not clear the median interval at this sample size.

[Learn's tool-search page](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/tool-search) says enabling search replaces the initial listing with `tool_search` and `call_tool`, ranked by BM25, with `limit` defaulting to 5 and maxing at 10. That is how Foundry keeps a large catalog from landing in every prompt. In the lab's synthetic 50-tool test, search cut average input tokens 26% and scored 30 of 30 correct, versus 29 of 30 for direct MCP. p50 rose from 2,528 ms to 3,614 ms, 43.0% slower. The post does not claim Toolbox generally improves accuracy. If you already know the five tools the turn needs, expose those five. Use search when catalog size or selection is the failure. The [23 July](/blog/2026-07-23-foundry-toolboxes-user-delegation) and [2 August](/blog/2026-08-02-toolboxes-microsoft-foundry-user-delegation) notes on this log do not publish this comparison.

## Priority Processing is a response field

The lab's first priority-labelled requests reported `service_tier=default` because the selected model did not support the tier. Those rows stayed in the audit trail and were excluded as Priority Processing evidence.

[Learn](https://learn.microsoft.com/azure/foundry/openai/concepts/priority-processing) says a priority-processed request returns `service_tier=priority`. A standard-processed request returns `service_tier=default` and is billed at the standard rate. The service may re-route some priority requests. Priority uses the same quota as standard. It can be enabled on Global Standard or Data Zone Standard (US). Regional Standard and EU Data Zone Standard are not in that supported set.

The combined benchmark used supported `gpt-4.1` `2025-04-14`. Every successful priority response reported `service_tier=priority`.

| Workload | Non-optimized Standard | Optimized Standard | Optimized + Priority | Combined vs non-optimized |
| --- | --- | --- | --- | --- |
| Text | 2,070 ms | 2,125 ms | 1,222 ms | 41.0% faster |
| Image | 2,872 ms | 2,234 ms | 1,448 ms | 49.6% faster |
| File | 1,512 ms | 1,245 ms | 1,165 ms | 23.0% faster |
| Function tools | 3,817 ms | 2,824 ms | 2,393 ms | 37.3% faster |

Those medians are the 23% to 50% range. They are not an isolated tier effect. Software alone clearly improved image, file, and function tools. Optimized text was inconclusive on `gpt-4.1`. Adding Priority Processing lowered observed p50 in all four workloads. The interval excluded zero for text and image, and crossed zero for file and function tools, so the incremental effect is inconclusive there.

Standard was correct 240 of 240 times. Priority Processing was correct 119 of 120, with one function-tool failure. Descriptive p95 was slower under Priority Processing than under optimized Standard for file and function tools in this run. Thirty attempts are a reason to collect more tail data before an SLO, not a tail verdict.

Learn's target for this `gpt-4.1` version is 99% of requests above 80 tokens per second, as p50 latency on a 5-minute basis. That is not the lab's AI-path timer. Do not convert one into the other. Requests estimated above 128,000 prompt tokens on that model are downgraded to standard and charged at the standard rate. The lab published neither a long-context arm nor a currency figure. Provisioned Throughput was outside the comparison. Check regional pricing. I will not invent a dollar amount.

Before the next paid round, name the timer, pair control and treatment, keep failures in the reliability count, and read `service_tier` on the response. Confirm `cached_tokens` after the stable prefix. Replace the synthetic fixtures with your own approved examples before you set an SLO.

If the slowest thing a user feels sits outside the AI-path timer, which stage would you clock before you pay for Priority Processing?

## Sources

- [How to make AI responses faster on Microsoft Foundry: lessons from 2,040 measurements](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/how-to-make-ai-responses-faster-on-microsoft-foundry-lessons-from-2040-measureme/4560073), Yassine El Ghali, Microsoft Foundry Blog, byline Oct 02, 2026.
- [Prompt caching](https://learn.microsoft.com/azure/foundry/openai/how-to/prompt-caching), Microsoft Learn, fetched 4 October 2026.
- [Enable priority processing for Microsoft Foundry models](https://learn.microsoft.com/azure/foundry/openai/concepts/priority-processing), Microsoft Learn, fetched 4 October 2026.
- [Enable tool search in a toolbox](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/tool-search), Microsoft Learn, fetched 4 October 2026.
- [Use vision-enabled chat models](https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision), Microsoft Learn, fetched 4 October 2026.
