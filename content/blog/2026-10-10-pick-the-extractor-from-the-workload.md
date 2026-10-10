---
slug: "2026-10-10-pick-the-extractor-from-the-workload"
title: "How to pick the extractor from the workload"
excerpt: "Chu Lahlou's 7 October Foundry guide is the comparison the series promised. Keep a Document Intelligence workload that already meets production requirements, then shortlist the next packet from the workload, not the file name."
date: "2026-10-10"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-10-pick-the-extractor-from-the-workload"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Document Intelligence", "Content Understanding", "Microsoft Foundry", "extraction", "OCR"]
readTime: 11
image: "/images/blog/2026-10-10-pick-the-extractor-from-the-workload-hero.png"
---

If a new packet just landed, do not name the file and then pick a service. Ask whether the Document Intelligence workload you already run still meets its production requirements. If it does, leave it. Chu Lahlou published that order on 7 October, and it is the comparison the 29 September series said was still coming.

The Foundry Blog RSS item is [Azure Document Intelligence and Azure Content Understanding: a practical guide](https://devblogs.microsoft.com/foundry/choosing-azure-document-intelligence-and-content-understanding/), `published` `2026-10-07T18:45:01+00:00`. That is 14:45 EDT the same day, about 64 hours before this post. The page date is October 7th, 2026. The byline is Microsoft CoreAI Principle Product Manager, which is how the page spells the title. This how-to is from that page, fetched this morning. I did not open the Foundry playground, Content Understanding Studio, or a pricing page, and I did not analyze a file.

The [30 September post](https://www.smfclearinghouse.com/blog/2026-09-30-foundry-extraction-layer-not-a-migration/) stopped on purpose. The series opener said the comparison was next, and that post told you not to invent it. This page is that comparison. It is not a cutover notice, and it does not print the benchmark numbers behind its recommendations.

## Do this before you name the document

Run the six steps in the order the page gives them.

1. Keep a Document Intelligence workload that already meets production requirements. Revisit it when the workload or the requirement changes, not because another Microsoft service can also read a PDF.
2. Check for a prebuilt that covers the document population and the schema you need. Prefer that prebuilt when it does.
3. Shortlist from the workload, not the category name. Structure, variation, labels, inference, modality, deployment, latency, and cost are the questions. "Invoice" is not a question.
4. Prototype on representative inputs. Include the common files, the hard cases, and the variation you expect in production.
5. Score business outcomes. Downstream validation, exceptions, human review, reliability, and total operating cost beat an exact string match.
6. Pick a different extractor per document type when the eval says so. One architecture for every attachment is a preference, not a requirement.

Current guidance does not require a working Document Intelligence pipeline to migrate. APIs, endpoints, SDKs, and billing stay separate. You add Content Understanding when a new scenario needs it. You do not rip out the endpoint that is already clearing the bar.

Before you pick a row, answer the page's eight questions. Is the content structured, semi-structured, or unstructured? Are the fields written on the page, or inferred? Does a prebuilt cover the type and the schema? Do you have representative labeled examples? How much do layouts, languages, and sources vary? Is the input documents only, or also images, audio, and video? Do you need cloud, containers, or air-gapped? What quality, latency, cost, and human-review thresholds have to be hit? If you cannot answer the last one, you do not have a ship decision. You have a demo.

## Where the page says to start

This table is the page's starting point, not a scoreboard. It says the recommendations reflect internal benchmarks on the latest APIs at publication. It does not print those numbers. Do not fill in an accuracy delta or a price. Validate on your own files and on the thresholds you just wrote down.

| Workload | Start here | What the page is protecting |
| --- | --- | --- |
| Document Intelligence already meets production requirements | Stay on Document Intelligence | Do not change a workflow that is already clearing the bar |
| New cloud OCR or Layout | Content Understanding `prebuilt-read` or `prebuilt-layout` | Richer structural output, sync and async APIs, plus the page's claim of higher accuracy, lower latency, and lower per-page Layout pricing |
| Standard structured document with a mature prebuilt: invoice, receipt, ID, tax, mortgage | Document Intelligence prebuilt, or Content Understanding `2026-06-01-preview` | Specialized prebuilts still have a cost advantage at similar accuracy. Preview users can try Advanced Contextualization |
| Custom extraction, no labeled examples | Content Understanding custom analyzer | Zero-shot fields from a schema, using generative models |
| Highly structured custom forms, and you have representative labels | Document Intelligence custom model | Purpose-trained models on text plus layout |
| High-variation or unstructured custom extraction | Content Understanding custom analyzer | Generative extraction when the layout is not stable |
| Inference, reconciliation, calculations, or multistep reasoning | Content Understanding custom analyzer | Generative and agentic analysis over document evidence |
| RAG-ready preprocessing | Content Understanding RAG analyzer | Structure-aware Markdown and retrieval-oriented output |
| Images, audio, video, or mixed media | Content Understanding | One analyzer family across those modalities |
| On-premises or air-gapped | Document Intelligence containers | The container deployment option |

Two rows differ from the June Learn quick reference the 30 September post already printed. That older table sent a standard invoice, receipt, ID, tax form, or mortgage form to a Document Intelligence prebuilt only. This page keeps that door and adds Content Understanding `2026-06-01-preview`, with Advanced Contextualization if you are willing to use preview. It does not print the cost gap. The RAG analyzer row is also new relative to that June table. Do not treat either row as a measured price cut.

`prebuilt-read` and `prebuilt-layout` are not a chat-model call in disguise. The page says they use specialized OCR and layout models. They do not require a language model or an embedding model, and they produce deterministic results. `prebuilt-read` is foundational OCR. `prebuilt-layout` adds the richer structure. A new cloud OCR job starts there, not on whichever chat model is newest in the catalog.

## The file name is the wrong key

Both services can do OCR, layout analysis, and field extraction. Invoices, receipts, identity documents, tax documents, and mortgage documents show up in both portfolios. Overlap is not identity. When both can do the job, pick from the fields you need, the operating constraints, and an evaluation on the same files.

The page's invoice split is the one to keep next to the keyboard. Use a Document Intelligence prebuilt invoice model when its established schema and quality meet the business need. Consider a Content Understanding analyzer when you need a substantially custom schema, more variation across inputs, inferred values, or reasoning past direct extraction. If either looks fine, run both on the same representative set. "Either looks fine" is the start of the eval, not the end of it.

A claims packet can keep the standardized receipt on Document Intelligence and send the narrative note to Content Understanding. Content Understanding also exposes confidence and source grounding on document fields, including generative fields. You can start from a schema and add labels or knowledge sources later. The page's pattern list is the same shortlist in prose. Stable forms with a matching prebuilt stay on Document Intelligence. Known variants are a tie: labels and bounded layouts favor Document Intelligence, fast schema changes favor Content Understanding. High variation does not get decided from the word invoice. If a prebuilt covers the schema and holds across the full distribution, it can stay. If the schema is yours, variation is high, or labels are missing, start with a Content Understanding custom analyzer. Prose, contracts, and inferred fields generally start on Content Understanding, and the page names a prebuilt contract analyzer for legal agreements. Mixed media and RAG use Content Understanding's image, audio, and video analyzers, plus RAG analyzers that emit layout-aware Markdown, figure analysis, summaries, and chunks.

## When Layout stays on Document Intelligence

Read and Layout are where the two services look most alike. For a new cloud OCR or Layout workload, begin by evaluating Content Understanding `prebuilt-read` and `prebuilt-layout`. Layout output there can include words, paragraphs, sections, formulas, tables, figures, signatures, hyperlinks, barcodes, QR codes, annotations, metadata, and page-level information. Document output can also include structure-preserving Markdown with that family of elements. The page says the list of elements and supported file types is still growing.

Document Intelligence Layout can still be the right cloud choice. The page lists five cases. It is already deployed and meeting requirements. A required response or integration is specific to it. The workload depends on Document Intelligence operational characteristics you already run. You need containers. Service limits or supported inputs favor it for this particular job.

Published prices, limits, supported elements, and preview capabilities can change. The page does not print them. It points at the Document Intelligence Layout docs and pricing page, and at the Content Understanding Layout concept page and pricing page. I did not fetch those four URLs this morning. Do not paste a dollar figure from memory into the design review. The page's "higher accuracy," "lower latency," and "lower per-page pricing for Layout" are its adjectives. They are a reason to measure, not a percentage for a steering deck.

## Score the business value, not the string

Repeatability is useful. It is not accuracy. A system can return the same wrong value every time. Two correct dates can also fail a string compare.

The page's example belongs in the eval harness. The same date can show up as January 1, 2025, as 1/1/2025, or as 2025-01-01. Exact-string scoring marks those as misses. Content Understanding normalizes supported typed fields, including dates and numbers, to canonical forms. If your scorer still does character equality on a date field, you are measuring formatting, not extraction.

Score these, not the raw string:

- Field-level semantic accuracy
- Whether normalization and validation actually ran
- Error and exception rates
- Human-review rate
- Straight-through-processing rate
- Classification and routing accuracy
- Latency
- Total cost
- Operational reliability
- Effort to build the solution and keep it running

An invoice workflow succeeds when amounts reconcile and the document routes correctly. A contract workflow succeeds when parties, dates, obligations, and jurisdiction are identified. Do not reuse the invoice harness on the contract packet and call it the same eval. Average accuracy can hide a failure on one document type or one subpopulation. Include the hard cases. The page does not print a mean. Do not invent one.

## One process, more than one extractor

FinHero is the customer the page names. It is a Malaysia-based fintech working on financial infrastructure, document intelligence, and alternative data. The page says they use both services and pick by document type and business requirement. Standardized receipts can stay on a Document Intelligence prebuilt. A trained custom model can cover known variants. A Content Understanding custom analyzer can hold a schema for embedded discounts, nested add-ons, rounding adjustments, and service charges. The page says that pairing, with a cost-efficient model configuration, got them the balance they needed. It does not give FinHero's accuracy or cost numbers.

The quote is from Top Lim, CEO and Co-Founder. He credits both services for extraction and structuring, and Azure's broader platform for scale, security, and reliability in regulated financial services. That is a customer statement on a Microsoft blog. It is not a benchmark, and it is not a result from this host. The lesson that belongs in the design doc is the page's: different document types inside one process can justify different extractors.

## What to run before you write the client

The page's try-it list is four steps. I did not execute them this morning, so this is not a playground report.

1. Upload representative content in the Content Understanding playground in [Microsoft Foundry](https://ai.azure.com/) or in [Content Understanding Studio](https://contentunderstanding.ai.azure.com/), and read the output before you write integration code.
2. Use [Choose the right AI tool for document processing](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool) to shortlist analyzers and models. That is the page's pointer. I did not re-fetch that Learn article this morning, so I am not restating its table as if it changed today.
3. Read the [document elements reference](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/elements) so the application knows which response elements exist. Same caveat. The link is the guide's.
4. Run both shortlisted approaches on the same evaluation set. Compare business outcomes, not raw string matches.

If you already need Document Intelligence containers, the playground is not a migration. Air-gapped and on-premises work still starts there, on this page. The [13 August sync-ops post](https://www.smfclearinghouse.com/blog/2026-08-13-content-understanding-sync-ops-foundry-agents/) already covered `analyzeInline` and `analyzeBinaryInline`. This guide does not replace that contract. It tells you when a new cloud Read or Layout job should start on the Content Understanding analyzers, and when an existing Document Intelligence Layout deployment should stay.

Agentic mode is in preview, and the page defers advanced contextualization and that mode to later posts. Do not make agentic mode the default for a field you can copy off the page. It is the iterative loop for reconciling totals, calculating an unstated value, checking consistency, or combining tables, figures, and text. Wait for those posts before you write that runbook.

Write the production threshold. If the current workload meets it, stop. If the packet is new, answer the eight questions, pick the row, and prototype both shortlisted approaches on the same hard cases when the row is a tie.

If both services can extract the same invoice schema, which outcome are you actually scoring, and did the hard-case set include the vendor layout that already fails in production?
