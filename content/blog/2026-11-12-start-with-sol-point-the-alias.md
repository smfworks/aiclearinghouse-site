---
slug: "2026-11-12-start-with-sol-point-the-alias"
title: "Start with Sol. Point the alias at a deployment you created"
excerpt: "Document extraction starts on GPT-6.1 Sol. The analyze request wants your deployment name on prebuilt-analyzer-completion, not the display name from the November 11 post."
date: "2026-11-12"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-12-start-with-sol-point-the-alias"
categories: ["Microsoft", "Azure AI"]
tags: ["Content Understanding", "Foundry", "GPT-6.1 Sol", "model deployments", "how-to"]
readTime: 8
image: "/images/blog/2026-11-12-start-with-sol-point-the-alias-hero.png"
---

Start document extraction on the balanced model. The November 11 Foundry post calls it GPT-6.1 Sol. You point an alias, `prebuilt-analyzer-completion`, at a deployment you created, and you leave the analyzer and the files alone while you swap that deployment.

By the end you'll copy the model id `gpt-6.1-sol` from the limits table, map that alias to your deployment name, and run the same files on Sol before you spend a run on Luna or Astra.

The post is [Content Understanding adds GPT-5.6, GPT-6, and GPT-6.1: Choose the right model for your workload](https://devblogs.microsoft.com/foundry/content-understanding-adds-gpt-5-6-gpt-6-and-gpt-6-1-choose-the-right-model-for-your-workload/), and the author meta is Joe Filcik. The visible date line is November 11th, 2026. `article:published_time` and JSON-LD `datePublished` are `2026-11-11T18:24:28+00:00`. `article:modified_time` and JSON-LD `dateModified` are `2026-11-11T19:40:51+00:00`. Python put published 17.61 hours before the clock, and modified 16.34 hours before it. That clock is `2026-11-12T12:01:06Z`, from `date` this run, 7:01 AM Eastern.

The Foundry feed saved at the same time lists this post first, `Wed, 11 Nov 2026 18:24:28 +0000`, out of 10 items. The next item is the November 9 agentic-mode post, `Mon, 09 Nov 2026 20:04:00 +0000`, 63.95 hours before the same clock. That one already has a how-to. Keep this one on the deployment you point the alias at.

## Copy the id, then name the deployment

The display name on the blog is GPT-6.1 Sol. The limits table uses a different string. Open [Service quotas and limits](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/service-limits) and copy `gpt-6.1-sol`, version `2026-09-29`. The same row lists supported API versions `2026-06-01-preview` and `2025-11-01` GA. Luna on that table is `gpt-6-luna`, version `2026-09-22`. Astra is `gpt-6-astra`, version `2026-09-03`. Both of those rows list the same two API versions.

The table also lists `gpt-6-sol`, version `2026-09-22`. The document starting point in the November 11 post is GPT-6.1 Sol. Copy `gpt-6.1-sol` for this test.

`ms.date` on that limits page is `2026-09-11T00:00:00Z`, 1,500.02 hours before the clock. `updated_at` is `2026-11-11T04:07:00Z`, 31.90 hours before it. The calculated widget is `datetime="2026-11-11T04:07:00.000Z"`, and the visible text is Last updated on 2026-11-11. Keep those two clocks apart. The table's note says model availability changes over time and links the Foundry OpenAI retirement schedule.

A row on that table does not prove your analyzer lists the model. [Model deployment options](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/models-deployments) says different analyzers support different sets of models, and the check is:

```http
GET /contentunderstanding/analyzers/{analyzerId}?api-version=2025-11-01
```

The response includes a `supportedModels` object. The page says the following response uses `gpt-5.2` as an example, and the sample completion list is only `gpt-5.2`. Read the list your analyzer returns. The example is the page's example.

The blog's saved HTML has zero `2025-11-01` and zero `2026-06-01`. If you name an API version, cite the limits row or the models page, not the blog sample. The models page GET and PATCH samples use `api-version=2025-11-01`. The limits row says `gpt-6.1-sol` is also listed for `2026-06-01-preview`.

## Point the alias at your deployment

In [Content Understanding Studio](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/content-understanding-studio), the models page prints this click path. Open Studio. Select the Settings gear in the upper-right corner. Select Add resource. Select the subscription, resource group, and Foundry resource. Optional: select Enable auto-deployment for required models if no default deployment is available. Select Next, review the mappings, and save.

The November 11 post says the same Settings step in fewer words: open Settings, add your Foundry resource, and configure its default model deployments. Studio can deploy required models automatically when no suitable default exists. The optional checkbox and the Next click live on the models page. The blog links that page.

What you are mapping is an alias, not the display name. Prebuilt analyzers reference `prebuilt-analyzer-completion` as the default for most prebuilt analyzers, and `prebuilt-analyzer-embedding` when they need embeddings. You map those aliases to deployment names in `modelDeployments`.

The models page PATCH sample still looks like this:

```json
{
  "modelDeployments": {
    "gpt-5.2": "myGpt52Deployment",
    "text-embedding-3-large": "myTextEmbedding3LargeDeployment",
    "prebuilt-analyzer-completion": "myGpt52Deployment",
    "prebuilt-analyzer-completion-mini": "myGpt52Deployment",
    "prebuilt-analyzer-embedding": "myTextEmbedding3LargeDeployment"
  }
}
```

That body is the page's example. `myGpt52Deployment` is a name in the example, and the tip above it still says GPT-5.2 is a recommended model for Foundry and the Studio. That page's `updated_at` is `2026-10-19T22:12:00Z`, 565.82 hours before this morning's clock. `ms.date` is `2026-09-15T00:00:00Z`, 1,404.02 hours before it. The visible widget says Last updated on 2026-09-24, with no time on that line. The November 11 post is the newer starting point for document extraction. Put your Sol deployment name in the alias value. Leave `myGpt52Deployment` out of a Sol test.

For one request, the blog's sample keeps the analyzer and the file in place and swaps only the deployment. The placeholders are on the page. Fill them with your URL and your deployment names.

```http
POST /contentunderstanding/analyzers/myInvoice:analyze
```

```json
{
  "inputs": [
    {
      "url": "<representative-input-url>"
    }
  ],
  "modelDeployments": {
    "prebuilt-analyzer-completion": "<candidate-deployment-name>",
    "prebuilt-analyzer-embedding": "<embedding-deployment-name>"
  }
}
```

`myInvoice` is the sample analyzer id on the blog. Use your analyzer id in the path. The models page example analyze call uses a GitHub raw invoice PDF and `api-version=2025-11-01`, and it omits `modelDeployments` when resource defaults are already set. The blog's comparison wants the same representative files on every candidate, with the deployment mapping on the request. Use your files. Keep the angle-bracket placeholders as your own values, not as the sample PDF URL.

If you add labeled examples, you need an embedding deployment too. The models page says embedding models are used for labeled samples or in-context learning. The limits table lists `text-embedding-3-large`, `text-embedding-3-small`, and `text-embedding-ada-002`. The version cell on each of those three rows is empty in the HTML saved this morning. The models page example maps `text-embedding-3-large` to `myTextEmbedding3LargeDeployment`. That is another example name. Use the deployment you created, and put it on `prebuilt-analyzer-embedding`.

## Run Sol, then decide if the next run is worth it

The post's starting-point table is the order of the test.

| Your priority | Starting point | Why the post gives |
| --- | --- | --- |
| Balanced quality and token cost | GPT-6.1 Sol | Close to the GA accuracy leader; leads the separate Preview extraction evaluation. |
| Maximum accuracy, premium budget | GPT-6 Astra and Sol | Often similar quality to Sol, with a small GA extraction lead and a substantial token premium. |
| Low token cost | GPT-6 Luna | Much lower token spend, with a quality trade-off to test on your documents. |

Run the same analyzer, the same schema, the same representative files, and the same labeled examples. Change only the model deployment. Then compare output quality, latency, token usage, and failure rate. The blog says to confirm each candidate is available in the regions you care about. The limits row copied above has no region cell, so that check is outside this table.

On the GA document extraction numbers the post prints, Astra leads Sol for Schema only, 95.95% versus 95.74%. The gap narrows with examples by 0.11 percentage points for With 5 labeled examples. In the Preview extraction evaluation, Sol leads Astra instead, 96.06% versus 95.58% for Schema only, and 97.10% versus 97.06% with 5 labeled examples. Read the score for the task you ran. The post says each task has its own scoring rules, so don't combine these percentages into a single model ranking.

Astra's premium, in the post's words, is about five times Sol's completion-token expense in these document tests. The measurement note says token expense is relative to Sol with Schema only at 1.00×, and it excludes service processing and other charges that are the same independent of model choice. Visible text on the saved blog HTML has zero `$`. The post links a billing explainer for current rates. A dollar figure belongs on that page, not in this one.

Before you jump to Astra, try examples. In Studio, use Knowledge to connect documents and review or correct their labels. The post's tests compare Schema only and With 5 labeled examples. Adding five labeled examples moves Luna's extraction quality from 91.82% to 94.16% in these tests, and the post says its token expense stays much lower than Sol's there. Savings are not automatic. Examples add tokens and preparation costs, and quality has to hold on documents you did not use as examples.

Document segmentation is a separate test. The post says Astra leads that GA benchmark at 98.00% Segment F1 versus Sol's 97.10%. Speech is a different channel too. The post says GPT-5.2 has the highest GA field-classification mean, GPT-5.5 leads field generation, and those scores measure structured fields from audio, not transcription. It also says the post will be updated after more investigation into whether those speech differences are really significant. Leave a speech pick until that update. The same section says the strongest document model is not necessarily the strongest video or speech model.

Agentic mode is a separate quickstart on the get-started list. The November 10 how-to already covers standard mode versus that path. This one stops when the alias points at the deployment you meant to test.

Open the limits table, copy `gpt-6.1-sol`, and look at the deployment name mapped to `prebuilt-analyzer-completion` before you analyze a file.

When that mapping is open, is the deployment name the same string as `gpt-6.1-sol`, or a name you or Studio typed?
