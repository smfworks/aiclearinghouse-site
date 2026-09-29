---
slug: "the-number-is-not-the-model"
title: "The Number Is Not the Model"
excerpt: "GPT-OSS-120B scored 10% on coding and 93.8% on agentic tasks the same day. Mixtral hit 100% agentic and 0% coding after NVFP4 compression. This week at SMF Works, the data kept saying the same thing: a single score is not a model."
date: "2026-07-10"
categories: ["AI Models", "Benchmarking"]
image: "/images/blog/the-number-is-not-the-model-hero.svg"
readTime: 7
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
tags: ["the-signal", "marketing"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-number-is-not-the-model/"
---
A single percentage is a dangerous kind of comfort. It looks like a verdict. It travels well in a headline. It lets you stop thinking.

This week at SMF Works, three different test series on the same class of hardware kept producing the same pattern: the number and the model were not the same thing.

## Two scores, one model

GPT-OSS-120B on a DGX Spark, MXFP4, full smf-bench suite:

| Suite | Pass rate | What it required |
|-------|-----------|------------------|
| Coding | **10.0%** (3/30) | Extract code, execute it |
| Agentic | **93.8%** (15/16) | Write and run working Python across multi-step tasks |

Same model. Same day. Same machine. One suite makes it look like a model that cannot code. The other shows it building working games and iterating on real output.

If you only publish the 10%, you have not reported on GPT-OSS. You have reported on a screenshot of a failure mode.

## What the 10% was actually measuring

GPT-OSS speaks Harmony — OpenAI's channel format that separates analysis from final answer and wraps code in structured tokens. That is correct model behavior.

Our coding evaluator extracted "code" from those responses and often pulled channel markers and fence artifacts along with the Python. The file handed to the interpreter was no longer Python. The failures were almost all `SyntaxError` and `IndentationError`. Not wrong algorithms. Not bad logic. Extraction contamination.

The agentic path did not use the same extractor. The model wrote working code there, because the code was allowed to be code.

So the 10% was not a measure of intelligence. It was a measure of **harness compatibility with Harmony**.

That distinction matters more than the number. A bad model fails on hard tasks. A bad harness fails on formatting.

## Compression is not free either

The second data point came from Mixtral-8x22B on the same desktop class of machine. BF16 weights that would not fit (roughly 282 GB) compressed to about 75 GB NVFP4 — a 3.5× fit that makes a 141B MoE runnable on a DGX Spark.

Results were not a single story:

- **100% agentic** — better than GPT-OSS on that suite
- **0% coding** on the same coding path that already has known extraction issues
- **Token efficiency** that looked excellent on paper (far fewer tokens than GPT-OSS) while throughput told a more expensive story about sparse MoE under aggressive quantization

"It fits" is not the same claim as "it is free." Compression buys residency. It does not automatically buy the capability profile you measured in BF16, and it does not absolve the benchmark of its own bugs.

## Speed is becoming a qualitative claim

The third lesson was not from our lab alone. Grok 4.5's launch week made a market argument that our local work keeps reinforcing: in agentic loops, latency is not a footnote under the leaderboard.

When a model iterates hundreds of times inside a tool loop, a 10× speed difference changes which jobs you start. Developers are already voting with workflows — switching daily drivers after one day of use — which is a stronger signal than another synthetic rank.

On the same week, dual DGX Sparks were running frontier open models at home. Local inference is no longer a hobbyist apology. It is a measurement environment. And measurement environments have opinions: about formats, about quant schemes, about what "pass" even means.

## How to read a model in 2026

A useful rule from this week:

1. **Never trust one suite.** If coding and agentic disagree violently, investigate the path between model output and execution before you indict the weights.
2. **Name the failure mode.** "90% failed" is marketing. "27/27 failures are SyntaxError after Harmony extraction" is science.
3. **Separate fit, speed, and capability.** NVFP4 that fits with 100% agentic and broken coding is three facts, not one grade.
4. **Watch what builders switch to.** Workflow migration is a field measurement. Leaderboards are lab measurements. You need both.

## What we are actually building

SMF Works is not a services company. We are a research project that runs models, publishes the messy numbers, and builds tools around what we learn — the Clearinghouse, the bench harness, the agent stack.

The temptation in AI discourse is always the clean score. Clean scores travel. Dirty mechanism notes do not.

But the mechanism is where the truth lives. This week the truth was simple enough to put on a slide and hard enough to keep people honest:

**The number is not the model.**

---

*Related lab notes on the Clearinghouse: [GPT-OSS coding vs agentic](https://www.smfclearinghouse.com/blog/2026-07-08-gpt-oss-120b-dgx-spark-mxfp4-baseline), [Mixtral-8x22B NVFP4](https://www.smfclearinghouse.com/blog/2026-07-09-mixtral-8x22b-dgx-spark-nvfp4-benchmark), [GLM-4.7-Flash deep dive](https://www.smfclearinghouse.com/blog/2026-07-09-glm-4.7-flash-dgx-spark-bf16-nvfp4-deep-dive).*
