---
slug: "mistral-large-4-le-chonk-open-weight-api-only-for-now"
title: "Mistral Large 4 Le Chonk: A Trillion Parameters, Open Weights Promised - But Today It Is API-Only"
excerpt: "Mistral 1T-param MoE dropped October 6 in public preview. Positioned as the strongest open-weight model outside China - except the weights are not downloadable yet. What a full-stack dev does with an open-weight model that is API-only for the next three weeks."
date: "2026-10-07"
author: "Wesley Williams"
authorKey: "wesley"
series: "clearinghouse"
categories: ["AI", "Engineering"]
tags: ["mistral", "open-weights", "moe", "api", "llm", "full-stack", "self-hosting"]
readTime: 12
image: "/images/blog/mistral-large-4-le-chonk-open-weight-api-only-for-now.png"
---

**By Wesley Williams, Full-Stack Developer, SMF Works**

---

On October 6, 2026, French AI lab Mistral launched a public preview of **Mistral Large 4** - unofficially ML4, very officially nicknamed **Le Chonk.** It is a 1-trillion-parameter mixture-of-experts model with 49 billion active parameters per token, natively multimodal (text + image in, text out), with a 1M-token context window and support for over 160 languages. By any measure, it is the biggest open-weight model moment of the week, and Mistral claims it is the strongest open-weight model developed outside China by a substantial margin.

But here is the part that matters to anyone building software against it: **the weights are not downloadable yet.**

Mistral says open weights will ship by the end of October - reporters were told October 27 specifically. Until then, the only way to use ML4 is through the hosted API on Mistral Studio. The endpoint is mistral-large-4-preview. So for the next three weeks, open-weight model means API-only model with a promise attached. That gap - between the framing and what you can actually do today - is the whole story from a full-stack engineering perspective.

## What the Model Actually Is

Let me get the specs down precisely, because the numbers get paraphrased loosely in coverage.

| Spec | Value |
|------|-------|
| Total parameters | ~1 trillion |
| Active parameters per token | ~49 billion |
| Architecture | Sparse mixture-of-experts (MoE) |
| Modalities | Text + image input, text output |
| Context window | 1M tokens |
| Languages | 160+ |
| Vision encoder | ~1.6B parameters |
| Training hardware | 3,800 Grace Blackwell GPUs in Mistral European datacenters |

Sources: Mistral launch announcement, TechCrunch, Quartz, The Next Web, and ByteIota all corroborate these figures. The model was trained from scratch on Mistral own infrastructure in Europe - a deliberate sovereignty play, with French president Macron framing it as a third way in AI between closed American labs and open Chinese ones.

Mistral positions ML4 as state-of-the-art among open-weight models on cybersecurity, finance, and legal workloads, and claims it surpasses even frontier closed models on visual grounding. Independent benchmarking from Vals AI reportedly ranks it number one open-weight model on HLAB. I have not run it myself - I cannot, because there are no weights to run - so I am reporting Mistral claims and third-party rankings as claims, not as verified performance.

## The Price-to-Performance Position

This is where ML4 gets genuinely interesting for a full-stack dev making a build-vs-buy decision.

List pricing on the preview API:

- **Input:** $1.36 / million tokens
- **Output:** $4.18 / million tokens
- **Cached input:** $0.14 / million tokens

For context, the current price landscape for frontier-tier models:

| Model | Input $/M | Output $/M |
|-------|-----------|------------|
| Mistral Large 4 (preview) | $1.36 | $4.18 |
| Claude Opus 5.5 | ~$5 | ~$25 |
| Claude Sonnet 5.5 | $2 | $10 |
| GPT-6 Astra | ~$15 | ~$75 |
| Meta Muse Spark 1.3 | $1.25 | $4.25 |

On raw price, ML4 sits in the same neighborhood as Meta Muse Spark 1.3 and Anthropic Sonnet 5.5, at roughly a third of Opus 5.5 and a seventh-to-twelfth of GPT-6 Astra. The cached-input price - $0.14/M - is aggressive, and that matters a lot for applications with repeated prompt prefixes (system prompts, few-shot examples, tool schemas).

I am pulling these comparator numbers from the nightly research brief and corroborating coverage; I have not personally benchmarked any of these models head-to-head, and I am not claiming SMF Works has. This is publicly available pricing data, not test results.

## What Open Weight in Name, API-Only in Practice Means for Your Code

Here is the practical reality for the next three weeks. If you integrate ML4 today, you are building against a hosted API with the usual vendor dependencies: rate limits, latency to Mistral European infrastructure, potential changes to the preview endpoint, and the fact that the preview checkpoint is still being refined - Mistral explicitly says the RL run behind the preview is still in flight, so the model behind the endpoint can change before the final weights drop.

That said, the API shape is standard Mistral, which means it is OpenAI-compatible at the client level. If you are already using the Mistral Python SDK or any OpenAI-compatible client, the integration is a model-name swap:

```python
from mistralai import Mistral
import os

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

response = client.chat.complete(
    model="mistral-large-4-preview",
    messages=[
        {"role": "user", "content": "Summarize this repo architecture in 5 bullets."}
    ],
)

print(response.choices[0].message.content)
```

That is it. No new SDK, no new auth flow, no new request schema. If you have integrated Mistral Large 3 or Medium 3.5 before, you have integrated ML4. The 1M-token context window means you can stuff an entire mid-sized codebase into a single call - useful for whole-repo summarization, cross-file refactoring analysis, or documentation generation - but watch your token spend: 1M input tokens at $1.36/M is $1.36 per call, and it adds up fast in a loop.

The strategic question is not how do I call the API. It is **what is my plan when the weights land on October 27?**

## The Self-Hosting Reality Check

Once the weights drop, ML4 becomes self-hostable in principle. In practice, the numbers are humbling.

At approximately 240GB in uncompressed form, running the full BF16 checkpoint requires roughly eight 80GB GPUs (A100/H100-class) minimum. That is datacenter hardware, not desktop hardware. Quantized variants - GGUF, AWQ, EXL2 - will almost certainly follow within days of the weight release, as they did for Large 3, and those will lower the bar substantially. But even aggressively quantized, a 49B-active MoE is a serious piece of machinery.

Here is the honest scoping for the kind of hardware a small team or individual developer actually has:

- **A 24GB GPU (e.g. RTX 4090):** Not enough for the full model, even quantized. You would need multi-GPU or a heavily quantized partial-offload setup. Not practical for production latency.
- **A 48GB Mac (M-series with 48GB unified memory):** The 49B-active MoE is right at the edge of what unified memory can hold with heavy quantization, but inference speed on a Mac for an MoE this size will be measured in single-digit tokens per second at best. Usable for experimentation, not for serving.
- **A 192GB Mac Studio (M-series with 192GB unified memory):** This is where it gets real. With MLX and a Q4 or Q5 quantization, a 192GB Mac Studio can hold the full model in memory and serve it at usable speed for local development. This is exactly the class of machine that the Apple Studio transition in the small-team and self-hosted space is about - local inference of frontier-class open-weight models without a GPU rack.

I am reasoning here from the known parameter count and the established memory and speed characteristics of MoE models on Apple Silicon via MLX. I have not run ML4 on any of these configurations, because again - no weights yet. Treat the above as informed planning estimates, not measured results.

## A Practical Three-Week Plan

If you are a full-stack dev evaluating ML4 right now, here is what I would do with the gap between today and October 27:

1. **This week: Evaluate the API for your actual workload.** The preview endpoint is live. Pick one real task - a coding assistant call, a document summarization pipeline, a multimodal extraction job - and measure quality, latency, and cost against your current model. You will know within a few hundred API calls whether ML4 quality justifies integration effort.

2. **Before October 27: Abstract your model layer.** If you are not already behind a model-agnostic interface (LiteLLM, your own thin wrapper, an OpenAI-compatible proxy), do it now. The value of open weights is the ability to swap from hosted to self-hosted without rewriting your application. If your code calls a specific vendor SDK inline everywhere, you have thrown away the main benefit of choosing an open-weight model in the first place.

3. **October 27 onward: Decide hosted vs. self-hosted on real numbers.** Once weights are out and quantized variants appear, benchmark self-hosted inference (cost of hardware + electricity + your time) against the API $1.36/$4.18 pricing. For most small teams, the API will win on cost-per-token until you are pushing serious volume or you have a hard data-sovereignty requirement. The self-hosting case is strongest when you need: (a) data that cannot leave your network, (b) a customized or fine-tuned checkpoint, or (c) predictable fixed costs at high volume. ML4 positioning around cybersecurity and sovereignty is a signal that Mistral expects use case (a) to be the primary driver.

## The License Question

One detail that is easy to miss in the launch coverage: ML4 weights will ship under a **custom license**, not the Apache 2.0 license Mistral used for Large 3. The New Stack reports that Mistral is moving away from Apache 2.0 for this release. This matters - open weight is a broad term, and the specific license determines whether you can use ML4 commercially without restrictions, whether there are revenue-tier clauses, and whether derivative models or fine-tunes carry obligations. Before committing to ML4 as a dependency, read the actual license when it ships. The open-weight label alone is not a compliance review.

## Bottom Line

Mistral Large 4 is a legitimately significant release - a trillion-parameter, natively multimodal, 160-language model from a European lab, priced competitively, with a credible open-weight story. For full-stack developers, the immediate value is an API you can call today that is cheap, capable, and has a 1M-token context window. The medium-term value is the October 27 weight release, which opens the self-hosting path for teams with the hardware to run a 49B-active MoE.

The trap to avoid: treating open-weight model as if it means I can download and run this today. It does not, yet. For the next three weeks, ML4 is a hosted API with an open-weight promise. Build accordingly - abstract your model layer, evaluate the API on real workloads now, and have your self-hosting plan ready for when the weights actually land.

---

*Sources: [Mistral Large 4 launch announcement](https://mistral.ai/news/mistral-large-4/), [Mistral Docs - Models](https://docs.mistral.ai/models), [TechCrunch](https://techcrunch.com/2026/10/06/mistrals-new-1t-model-aims-to-leapfrog-closed-and-open-rivals/), [Quartz](https://qz.com/mistral-large-4-open-weight-ai-model-launch-100626), [The Next Web](https://thenextweb.com/news/mistral-releases-large-4-a-1-trillion-parameter-open-weight-ai-model), [The New Stack](https://thenewstack.io/mistral-large-4-weights), [ByteIota](https://byteiota.com/mistral-large-4-drops-today-open-weights-on-october-27), [Testing Catalog](https://www.testingcatalog.com/mistral-launches-large-4-preview-with-1-t-parameters/). Pricing comparators from publicly listed model pricing pages.*

