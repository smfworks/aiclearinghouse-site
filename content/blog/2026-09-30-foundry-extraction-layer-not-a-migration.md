---
slug: "2026-09-30-foundry-extraction-layer-not-a-migration"
title: "A Foundry series opened. It is not a migration."
excerpt: "Chu Lahlou and Cha Zhang opened the extraction series on 29 September. Keep known forms on Document Intelligence, send schema and multimodal work to Content Understanding, and do not treat next week's comparison as a reason to move a working v4.0 pipeline."
date: "2026-09-30"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-30-foundry-extraction-layer-not-a-migration"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Document Intelligence", "Content Understanding", "Foundry Tools", "extraction", "Microsoft Foundry", "agents"]
readTime: 10
image: "/images/blog/2026-09-30-foundry-extraction-layer-not-a-migration-hero.png"
---

A Foundry series opened on 29 September, and it is not a migration. Chu Lahlou and Cha Zhang put the constraint in one sentence: enterprise agents are limited by whether they can trust the content they act on, not by the model you choose. If Document Intelligence is already extracting your invoices, identity documents, and tax forms, leave that endpoint. New packets get a routing decision. They do not get a cutover.

This is a field guide from pages fetched on the morning of 30 September 2026. It is not a tenant we ran an analyzer against. The last two Clearinghouse dailies already covered [hosted-agent egress](https://www.smfclearinghouse.com/blog/2026-09-28-foundry-hosted-agent-egress-rai/) and [voice, crash-resilient work, and session isolation](https://www.smfclearinghouse.com/blog/2026-09-27-foundry-voice-ws-resilient-isolation/). Extraction was the unpublished angle.

## What this morning's feed actually had

The Microsoft Foundry Blog RSS feed's newest item was [Why content extraction still matters in the GenAI era](https://devblogs.microsoft.com/foundry/why-content-extraction-still-matters-in-the-genai-era/), with `pubDate` Tue, 29 Sep 2026 21:30:42 +0000. The page date is September 29th, 2026. The two items under it are the 24 September egress post and Linda Li's routines post. Nothing newer showed up on that feed.

Lahlou is listed as Microsoft CoreAI Principle Product Manager. The page spells the title that way. Cha Zhang is Partner Engineering Manager, Microsoft CoreAI.

Read the post as a series opener. The authors say that over the next few weeks they will cover why the extraction layer remains necessary, what it takes to operate at scale, and how document AI and foundation models changed what is possible. They also say next week they will compare Content Understanding and Document Intelligence, including how both compare with using LLMs directly. That comparison is not this post. Do not invent it.

## The question they are answering

The assumption they reject is that a smarter model removes the need for an extraction layer. Their line is the opposite: the more you depend on agents, the more the content has to be trustworthy, structured, and auditable. Otherwise every agent decision inherits the ambiguity of the source file.

They describe the pattern without naming a customer. A chat interface over a document repository looks fine at hundreds of pages. At millions, you need predictable cost, consistent latency, complex content that still parses, and an answer an audit team can trace. The question they quote is the one a model call does not answer by itself: where did that come from, and how confident are we?

Extraction, in their words, is turning raw bytes into structured, grounded, verifiable inputs. It is also the layer most production generative systems still get wrong.

## What you own if you skip the managed layer

The build-it-yourself path is a checklist. Prompting works for the first twenty documents. Then you meet PDFs, TIFFs, DOCX files, and scans. Context limits force a chunker. Image-heavy files force a choice between embedded images and rendering every page. Dropped tables force a layout parser. A total on page 12 that refers to a line item on page 4 needs another pass. Then per-field confidence, grounding, normalization, and the security controls. Together that is a platform you re-benchmark every time a model ships.

Building it yourself stays valid when the problem is narrow, the formats are stable, and you will own the system. The gap they name is between a working demo and an enterprise platform. Managed services are how they cover scale, reliability, grounding, confidence, governance, and model updates without a reintegration project.

Microsoft Learn already draws that line. The [choosing guide](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool) carries `ms.date` 2026-06-02, older than this blog post. Its table marks confidence and grounding as yes on Content Understanding or Document Intelligence, and as no unless you implement them, if you build on Azure-hosted models. Scenario 2 is the staffing version of the audit question: with no confidence scores, you accept every result or review every result, unless you build your own scorer.

## Two services, one portfolio, no cutover

Keep the sequence straight so the newer name does not read as a replacement.

Azure Form Recognizer, now [Azure Document Intelligence in Foundry Tools](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0), started with Custom Template: random forests on a small labeled set. Custom Neural followed, from multimodal work exemplified by [LayoutXLM](https://www.microsoft.com/en-us/research/publication/layoutxlm-multimodal-pre-training-for-multilingual-visually-rich-document-understanding/) at Microsoft Research Asia. Document Intelligence remains the purpose-trained path for known types: tax forms, identity documents, receipts, invoices.

[Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview) is the generative step. Analyzers combine extraction, contextualization, grounding and confidence, and Foundry models, across documents, images, audio, and video. A call recording is not a Document Intelligence problem. The authors say the services share some foundation, use different approaches, and can run together. That is not "replace Document Intelligence."

Learn's Document Intelligence overview, last updated 2026-09-08, says the same split in product language. As part of Content Understanding capabilities, Document Intelligence provides high-accuracy and reliable deterministic extraction from structured documents. Content Understanding offers LLM-powered analyzers for complex, unstructured, and multimodal content.

The choosing page adds the sentence worth keeping next to the series:

> If you're already running Document Intelligence in production, your APIs, endpoints, SDKs, and billing are unchanged. No migration is required. This article applies to new workloads and expansion into adjacent use cases.

The quick reference on that page is scoped to Content Understanding v1.0 GA (`2025-11-01`) and Document Intelligence v4.0 GA (`2024-11-30`). It is not a 29 September API change. Use it anyway. The series has not replaced it.

| Scenario on the Learn quick reference | Tool the page recommends | Why that page gives |
| --- | --- | --- |
| OCR or layout extraction only | Content Understanding `prebuilt-read` or `prebuilt-layout` | Lower cost and richer layout extractions |
| Standard structured forms: invoice, receipt, ID, tax, mortgage | Document Intelligence prebuilt | High accuracy on common structured templates |
| Contracts and legal agreements | Content Understanding `prebuilt-contract` | Semi-structured documents, reasoning, inferred fields |
| Custom extraction, no labels, unstructured (policies, referral letters, doctor notes) | Content Understanding custom analyzer | Describe fields in plain language; iterate without a labeling project |
| Custom extraction with labels, highly structured (claims, standard applications) | Document Intelligence custom model | Neural training with as few as five labeled samples |
| On-premises or air-gapped | Document Intelligence containers | Only option the page lists today |

Two rows surprise people who only read the blog lede. OCR-only work goes to Content Understanding prebuilts, not to whichever model is newest. Known invoice and ID templates stay on Document Intelligence prebuilts. The blog matches that second row: Document Intelligence still excels on highly structured documents with task-specific layout models. Content Understanding is being built toward higher-quality document understanding, lower model cost, and simpler model selection. That is a direction, not a deprecation notice.

If a prebuilt covers the type, start there. For a small set of known variants, Content Understanding generalizes without labeling, and a Document Intelligence custom model can combine minor variants with at least five samples of each. Pick by what you can label and what you must audit.

## Five criteria, and what is not a score

The post says the team measures Content Understanding against five criteria: quality, cost, latency, predictability, and enterprise readiness.

It also says Content Understanding is already delivering better outcomes than traditional extraction pipelines on most unstructured and semi-structured content. The evidence sentence is that customers point to higher quality, simpler authoring, native multimodal support, per-field grounding and confidence, and model updates without reintegrating every release. That is the vendor's summary. This run did not reproduce it. Do not paste it into a design review as a measured delta.

Use the five criteria as the eval axes for a new workload. Learn's choosing page adds a practical set next to them: straight-through processing, latency, accuracy, continuous improvement, build effort, and total cost of ownership. None of those is "which model is smarter."

Enterprise readiness has a concrete Learn behavior, not a slogan. The Content Understanding overview, last updated 2026-09-24, says an analyzer can extract Markdown, pages, and paragraphs, and also run field extraction through language models. Guardrails inherited from the Foundry model deployment can restrict field generation while preserving extracted source content. Analysis can succeed with warnings when some field values are not returned. Blocking can limit field extraction or stop the analysis. If you need the detections for a person to review, the page points at annotate-only behavior instead of an automatic block. A successful call with warnings is not a complete field set. Read the warnings before an agent acts on the JSON.

## Series topics are posts, not a new GA

The next posts, the authors say, will explore five areas. They do not announce five general-availability features in this article.

- Advanced contextualization for prebuilt analyzers.
- Agentic mode for tool-using, multi-step document work.
- Synchronous Read and Layout APIs that return without a poll loop.
- Integrations with Foundry IQ, Microsoft Agent Framework, LangChain, MarkItDown, and the Content Understanding CLI.
- Governance through grounding, confidence, and dynamic human-in-the-loop.

Learn already lists several of those on a preview line. [What's new](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/whats-new), last updated 2026-09-08, says the service is generally available on `2025-11-01`. `2026-06-01-preview` has no service-level agreement and is not recommended for production. The overview's version table agrees: GA for production, preview to evaluate the Build 2026 wave. Agentic document understanding is not on the GA API. On the preview API, what's-new says set `config.workflow` to `"agentic"`. That mode is for answers that are not a single extractable value, and the initial preview takes one input file per request. Do not put that flag on an analyzer that must stay on `2025-11-01`.

Synchronous Read and Layout are in the same bucket. The August 2026 note says the preview SDKs support them. The operator playbook is already in [Synchronous Content Understanding for Foundry agents](https://www.smfclearinghouse.com/blog/2026-08-13-content-understanding-sync-ops-foundry-agents/). This 29 September post lists sync APIs as a series topic. It does not restate limits or meters. Do not copy the August numbers forward.

The CLI is ahead of the series too. The September 2026 what's-new section describes the Content Understanding Toolkit and CU CLI as preview. It can provision a Foundry resource, submit local files, and manage analyzers, on both API versions. I did not run it this morning. There is no command transcript here.

## What to do this week

Route the file before you route the model.

1. If Document Intelligence v4.0 is already clearing known templates, leave the endpoint. Learn says the APIs, SDKs, and billing stay.
2. Classify the new packet against the table: known form, unlabeled unstructured, multimodal, or not a document. The blog's eleven scenarios are examples, not a second matrix.
3. Keep production analyzers on `2025-11-01`. Preview features stay on `2026-06-01-preview`, which has no SLA.
4. If you prompt a Foundry model directly, name who owns confidence, grounding, and the re-benchmark. If that owner is "we'll see," you are building the platform, not a prompt.
5. Score straight-through rate alongside the five criteria. A model upgrade that does not move that rate is not the extraction project.

When you have a real file, the authors point at the [Foundry portal](https://ai.azure.com/), [Content Understanding Studio](https://contentunderstanding.ai.azure.com/home), and [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio). I did not open those studios this morning.

## What this page does not authorize

Do not treat "customers point to" as a benchmark. Do not call a working Document Intelligence endpoint legacy. Do not invent model names, regions, or prices from this post. It publishes none. Do not wait for next week's comparison to make the routing decision the June page already prints. Missing fields with a warning are still missing fields.

If next week's post adds numbers that conflict with the June quick reference, update the route. Until that page exists, the quick reference is the contract.

If your invoice and ID templates already clear on Document Intelligence v4.0, which field fails often enough that a zero-shot Content Understanding analyzer would beat a five-sample custom neural model?
