---
slug: "2026-11-21-filter-the-catalog-then-start-with-one"
title: "Filter the catalog for Managed Compute, then start with one instance"
excerpt: "An open model still needs a name your app can send. Filter the Foundry catalog for Managed Compute, start with one instance, and call the deployment name you typed. The hourly-cost look is on the announcement. The 10-to-15-minute wait is on the deploy guide."
date: "2026-11-21"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-21-filter-the-catalog-then-start-with-one"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "Managed Compute", "open models", "how-to"]
readTime: 9
image: "/images/blog/2026-11-21-filter-the-catalog-then-start-with-one-hero.png"
---

Filter the Foundry catalog for Managed Compute. Start with one instance. When the deployment comes up, call it by the name you typed.

That name is what the app puts in the model field. The catalog id in the sample is the registry path for that example. By the end you will have the filter from this morning's announcement, the wizard clicks from the deploy guide, and a place to stop the hourly bill if the test is done.

## Open the announcement, then the guide

The announcement is [Serve open models in production with Foundry Managed Compute](https://devblogs.microsoft.com/foundry/managed-compute-ga/), by Manoj Bableshwar. I fetched that URL this morning. HTTP 200. The Date header was `Sat, 21 Nov 2026 12:02:31 GMT`. The saved HTML is 237,064 bytes.

The meta `article:published_time` is `2026-11-20T15:00:44+00:00`. JSON-LD `datePublished` is the same instant, twice. `article:modified_time` and both JSON-LD `dateModified` values are `2026-11-20T20:09:34+00:00`. The author meta is `Manoj Bableshwar`. The JSON-LD author name is the same. The visible date sits in a span: November 20th, 2026.

The Foundry feed item for this title is `Fri, 20 Nov 2026 15:00:44 +0000`, the same instant as `datePublished`. I saved that feed this morning. It is 212,041 bytes and ten items. This post is the newest item.

Python, against the fetch clock `2026-11-21T12:02:31Z` (7:02 AM Eastern), put the publish instant 21.03 hours earlier and the modified instant 15.88 hours earlier. Against 07:00 ET (`2026-11-21T12:00:00Z`) those ages are 20.99 hours and 15.84 hours. Both sit inside 48 hours.

The opening paragraph announces the general availability of Managed Compute in Microsoft Foundry. A search of the saved HTML found one `general availability`, in that sentence. A search for `generally available` found one hit, in the banner image alt text. Keep those two strings apart. I also fetched the deploy guide and the overview as markdown, the same morning. A search of each file for `general availability` and for `generally available` returned zero hits. Teach the announcement from the blog.

The deploy guide is [Deploy open-source models with managed compute](https://learn.microsoft.com/en-us/azure/foundry/how-to/deploy-models-managed). HTTP 200. Date `Sat, 21 Nov 2026 12:02:31 GMT`. The saved markdown is 22,158 bytes. `ms.date` is `2026-11-10T00:00:00.0000000Z`. `updated_at` is `2026-11-17T19:54:00.0000000Z`. HTTP `last-modified` is `Wed, 18 Nov 2026 23:40:05 GMT`.

Python put `ms.date` 276.00 hours before 07:00 ET and `updated_at` 88.10 hours before that clock. The `last-modified` header is 60.33 hours before 07:00 ET. The frontmatter stamps sit outside 72 hours. The header sits inside 72 hours and outside 48 hours. Say which stamp you mean. The steps can still be the steps. This morning's announcement has its own clock.

## Filter, then name the deployment

Sign in to the Foundry portal. On the announcement, open the model catalog and filter by "Managed Compute" under "Deployment options". That is how the page says you discover the 150+ open models. The 150+ figure is the blog's figure. A search of the deploy guide for `Deployment options` returned zero hits. A search of the blog HTML for `Collections` and for `New Foundry` returned zero hits.

If you are on the deploy guide, turn the New Foundry toggle on. The guide says these steps refer to Foundry (new). Select your subscription and Foundry resource. Go to Build, then Catalog, then Model Catalog. Filter by Collections and choose Hugging Face. Then open a model card.

Pick a template. The announcement says the template defines the context length, the serving runtime, and the GPU configuration. The same sentence says that, depending on the model, you can choose NVIDIA GPUs (A100, H100, or H200) or AMD MI300X GPUs. Leave that list on that sentence.

In the wizard, type a deployment name the app can keep. The guide says that name is what your application passes in the `model` field at inference time. Its example name is `nemotron-3-nano-30b`. The announcement's Python sample uses `deepseek-1017-demo`. Those are two examples. Send the name you typed.

The wizard preselects Global Managed Compute. Select Data Zone Managed Compute when processing has to stay in the supported US or EU data zone derived from the account's region. The guide says there is no separate zone selector beyond that choice. A search of the announcement HTML for `DataZoneManagedCompute` returned zero hits. The SKU name for the data-zone choice lives on the guide: `DataZoneManagedCompute`. The broad choice on both the announcement sample and the guide sample is `GlobalManagedCompute`.

## Start with one instance

Set Model instances to 1. The guide says Model instances is the `capacity` value on the deployment SKU. Each instance consumes the accelerator count the template already defined. The guide's example is a template that specifies one H100 per instance, with capacity 2, which uses two H100 accelerators in total. The announcement's sample sets capacity to 1 and says that example creates one billable instance on four MI300X GPUs. One instance means one copy of the template. Read the template before you trust the hourly cost.

The announcement says start with one instance and review the hourly cost in the deployment wizard. A search of the guide for `hourly cost` returned zero hits. The guide says select the checkbox to acknowledge the cost, then select Deploy. Provisioning typically takes 10 to 15 minutes. A search of the announcement HTML for `10 to 15` and for `10-15` returned zero hits. The wait is the guide's sentence. The hourly-cost look is the announcement's sentence.

The details page moves from `Creating` to `Succeeded` when the model is live. Then select the Playground tab on the Details page and send a prompt. The announcement says test a few prompts in the Playground once the deployment is ready.

You need Cognitive Services Contributor, or Foundry Owner, or Foundry Account Owner, on the Foundry account to create the deployment. You need Foundry User to call it with Microsoft Entra ID from the Playground, the SDK, or REST. Managed compute quota is separate from Azure VM quota. The guide also says existing Azure VM quota can't be applied to a managed compute deployment. If you need more, open Manage, then Quota, then the Managed compute tab, and select Request quota. An approved change can take up to 15 minutes to show on that page.

If you deploy from Python, the guide's install line is `pip install "azure-mgmt-cognitiveservices==15.0.0b2" azure-identity openai requests`, then `az login`. It asks for Azure CLI 2.60 or later.

## Call the name you typed

The announcement's chat sample sets `model` to `deployment_name` after the state is Succeeded. The SKU in that sample is `GlobalManagedCompute` with capacity 1. The accelerator type on that sample is `MI300_192GB`. The model path and the template path on that sample are the DeepSeek V4.1 Flash (1017) example.

The guide's SDK sample uses a different deployment name, a different model path, a different template, and `H100_80GB`. It also sets `versionUpgradeOption` to `OnceNewDefaultVersionAvailable`. A search of the announcement HTML for `versionUpgradeOption` and for `nemotron-3-nano-30b` returned zero hits. Copy the sample you are running. Keep the other sample's ids on their own page.

The overview says that after you deploy, your application code is the same as any other Foundry model, and only the deployment name changes. I fetched [Managed compute in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/managed-compute-overview) the same morning. HTTP 200. Date `Sat, 21 Nov 2026 12:02:32 GMT`. The saved markdown is 20,136 bytes. `ms.date` and `updated_at` match the deploy guide. HTTP `last-modified` is `Tue, 17 Nov 2026 19:56:22 GMT`, 88.06 hours before 07:00 ET. That stamp sits outside 72 hours. The billing line on that page still reads.

The overview table says Managed compute bills hourly per accelerator family. The announcement says you pay hourly for each accelerator. Read the phrase on the page you are quoting.

Both Learn pages say built-in Azure AI Content Safety filters aren't part of the managed compute data path. If you need request-level or response-level filtering, call the Azure AI Content Safety APIs from your application.

## Leave the adapter heading for a later pass

The announcement's later heading is custom model serving in preview. LoRA adapters from Foundry post-training, and Bring Your Own Weights as limited public preview, sit under that heading. The overview's preview note says Microsoft doesn't recommend that preview for production workloads. Do the catalog filter and the one-instance deploy first. Read that note before you follow the adapter heading.

## Stop the bill when the test is done

Deleting a deployment releases its accelerator allocation and stops billing immediately. The guide's portal path is Build, then Models, the radio button next to the deployment name, then Delete in the right pane.

If you are sizing past one instance, the announcement says changing capacity from one to five on the DeepSeek 1017 template takes the deployment from 4 to 20 GPUs. The same paragraph says the larger deployment processed about five times as many tokens and returned fewer HTTP 429 responses. That is the announcement's load sentence. The next sentence says to run a representative workload and compare token throughput, request status codes, and streaming latency in Azure Monitor.

Sign in, apply the filter on the page you are following, and read the hourly cost on a one-instance template before you raise capacity. If the prompts share a long prefix, the announcement says you can pass `prompt_cache_key` as an affinity hint. When the runtime reports cache usage, `usage.prompt_tokens_details.cached_tokens` shows how many input tokens were reused.

When you open the wizard on the template you actually want, does the hourly cost match one accelerator, or does that template already place several accelerators under the single instance?
