---
slug: "2026-10-14-send-the-file-to-the-family-analyzer"
title: "Send the file to the family analyzer. Then read confidence and grounding."
excerpt: "If the intake is mixed forms, send the file to the family analyzer instead of trusting a filename. Read the value, the confidence, and the grounding before you treat a schema-valid number as the amount."
date: "2026-10-14"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-14-send-the-file-to-the-family-analyzer"
categories: ["Microsoft", "Azure AI Foundry"]
tags: ["Content Understanding", "prebuilt analyzers", "Microsoft Foundry", "document AI"]
readTime: 11
image: "/images/blog/2026-10-14-send-the-file-to-the-family-analyzer-hero.png"
---

If the packet is mixed forms, don't start with a blank schema and don't trust the filename. Send the file to the family analyzer, then read the value, the confidence, and the grounding before you treat the number as the amount. A schema can accept a number and still attach it to the wrong line. I did not open Content Understanding Studio, upload an invoice, or call the analyze API this morning. The steps below are the ones Chu Lahlou's October 13 Foundry post and the Learn pages it links actually print.

The dated primary is [Azure Content Understanding Prebuilt Analyzers: packaging domain knowledge for document AI](https://devblogs.microsoft.com/foundry/more-than-a-schema-content-understanding-prebuilt-analyzers/). The page says October 13th, 2026. Its `article:published_time` is `2026-10-13T14:20:35+00:00`, which matches the Foundry RSS `pubDate` of Tue, 13 Oct 2026 14:20:35 +0000. `article:modified_time` is `2026-10-13T14:22:08+00:00`. I did not diff that two-minute edit. The author meta is Chu Lahlou. That post is still the newest item in the Foundry feed I fetched this morning. The next item is the October 7 Document Intelligence guide, already covered as [How to pick the extractor from the workload](https://www.smfclearinghouse.com/blog/2026-10-10-pick-the-extractor-from-the-workload/). This is the next step, not that table again.

The phrase "previous post" on the October 13 page links to the September 29 extraction essay, not to the October 7 guide. Don't call the October 7 post the previous post.

## Start from the family, not a blank schema

A schema is the output contract. Field names, types, required properties, nested objects, allowed values. It is not the extraction. A schema can require `totalAmount` to be a number. It cannot tell you whether a minus sign was dropped, a date was read with the wrong locale, or a value came from the wrong line item. The sentence to keep is the one on the page: a result can satisfy the schema and still cause costly business errors.

A custom analyzer is still the right start when no family fits. You describe fields in natural language, test representative documents, add labeled examples, and refine the definitions. The post does not say that work disappears. A domain-specific prebuilt is a different starting point. It packages a maintained schema with learned knowledge of the family: how fields are expressed, where they tend to appear, which representations are equivalent, and which ambiguities usually cause errors. You spend the time on which fields matter, which business rules apply, and which cases need a person.

The catalog the post names covers procurement documents, US tax forms, identity documents, financial statements, mortgage documents, contracts, and personal records. Start with the family closest to the workflow. If nothing is close, the same page points at a custom-analyzer tutorial. Don't force a mortgage packet through an invoice analyzer because the catalog is nearby.

## If the packet is mixed, send the file to the family analyzer

A workflow that receives more than one document type has to know what it is holding before it extracts. The post says the catalog includes composed solutions for procurement, US tax, and US mortgage intake. A composed prebuilt classifies the document's segments and routes them to the extractor and schema that fit.

The mortgage example is the one to copy. A mortgage intake service can submit each incoming file to `prebuilt-mortgage.us` rather than relying on filenames or maintaining its own form classifier. Recognized forms go to their specialized analyzers. The application validates the results and handles exceptions.

That ID is on the blog. The concept page the blog links, [Prebuilt analyzers](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers), lists composed IDs of its own. `prebuilt-procurement` routes a procurement document. `prebuilt-tax.us` routes a US tax form. `prebuilt-mortgage.us` routes a mortgage document. A search of the saved October 13 blog text did not find the string `prebuilt-tax.us`. Don't paste the concept-page ID onto the blog sentence.

The concept page's `ms.date` is `2026-01-29T00:00:00Z`. The extract footer said last updated on 09/09/2026. Neither clock is October 13. Use that page as the catalog the blog links, not as today's news.

If you already know the file is one invoice, you don't need the family router. The post's accounts-payable example uses `prebuilt-invoice` for P.O. numbers and itemized amounts, then validates against business rules and routes uncertain results to a reviewer. Family analyzer when the packet is mixed. Single-form analyzer when you already know the form.

## Open Studio before you analyze your own files

The post's first practical step is the [Content Understanding Studio quickstart](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/content-understanding-studio). Connect a Foundry resource before you analyze your own documents. I did not sign in. These are the clicks that page prints.

1. Go to the [Content Understanding settings page](https://contentunderstanding.ai.azure.com/settings).
2. Select **+ Add resource**, pick the Foundry resource, then **Next** and **Save**.
3. Leave **Enable autodeployment for required models if no defaults are available** selected. The page says that lets Studio deploy a standard model, a mini model, and an embeddings model. Different analyzers need different models. I did not open the supported-models page, so I am not naming them.

Then try a prebuilt in the order the quickstart gives:

1. Browse prebuilt analyzers from the Studio home page and select one that matches the scenario.
2. Test it on the sample data first.
3. Try your own files only after you have selected a chat completion deployment and an embeddings deployment. The page says both.
4. Read the results pane. You should see extracted fields or other structured data, depending on the analyzer. A clean sample is not a production sign-off.

Foundry has a playground too. The same quickstart says Foundry supports the Read and Layout analyzers and a subset of prebuilt analyzers. The dropdown shows what is currently available. Don't tell a teammate that every catalog ID is in that dropdown. If the family you need is missing, use Studio, or follow the REST quickstart the blog links. I did not open that REST page, so I am not printing a request.

The Studio page's `ms.date` is `2026-07-16T00:00:00Z`. Its extract footer said last updated on 08/10/2026. That is the current how-to the blog points at. It is not an October 13 docs refresh.

## Keep the two API versions apart

The blog and the Studio page do not say the same thing in the same sentence. Don't collapse them.

The blog says to use the preview API version for preview-only analyzers. The 1099 Combo example later on that page is explicitly "in 2.0 Preview." If the analyzer you selected is preview-only, follow that sentence.

The Studio page says the default is GA `2025-11-01`. Use `2026-06-01-preview` only when you need preview features. The same page says that preview has no service-level agreement and is not recommended for production workloads. That is a reason to label the run, not a reason to skip a preview-only analyzer you actually need. Don't turn the two sentences into "always call the preview."

For repeatable comparisons, the blog says to use the same API version and the same analyzer configuration across runs, and to record both next to the results. A mixed-version score is not a comparison.

## Read three fields, not one

For supported document fields, a prebuilt can return three things. Read all three before you trust the number.

| Signal | What the October 13 post says it is |
| --- | --- |
| Value | The typed result. Supported dates and numbers are normalized to a canonical format. |
| Confidence | A score that estimates certainty. It can inform straight-through processing or a human-review threshold. |
| Grounding | The source span, page, and coordinates that connect the result to evidence in the document. |

The post does not print a numeric confidence cutoff. Don't invent one. Set the review line from business risk after you have seen your own files.

The invoice illustration is why the three signals exist. An invoice can carry a subtotal, tax, an invoice total, an outstanding balance, and nested line items. Finding a number is not the hard part. A simpler parser can attach a valid number to the wrong amount. `prebuilt-invoice`, the post says, distinguishes the requested field, normalizes it from the detected locale, and returns it with a confidence score and grounding. I did not upload that invoice.

The same section has the comma trap. If OCR substitutes a period for a thousands-separating comma, `$1,000` may be read as `$1.000`. Parsing the latter as a decimal changes the value by a factor of 1,000. Grounding is how you check that correction against the page, instead of trusting a typed number that already passed the schema.

Two more illustrations stay on the page that printed them. The post says the W-2 prebuilt separates the employer's name and address in box c even when the text spans lines. A Czech invoice example says a simpler tool can mix up `Číslo účtu` (account number) and `IČO` (ID number). I did not open those schema files, and I did not run either document.

## Treat the tax table as a modeled benchmark

The measurement on the page is a tax-form benchmark across 19 US tax-form categories. It compares Azure Document Intelligence, Azure Content Understanding 1.0 GA, and Azure Content Understanding 2.0 Preview with Advanced Contextualization. The means are equal-weight means of the 19 reported category values. The latency column is an index where Content Understanding 1.0 GA is 10. Don't convert that index into seconds. The page does not.

| System | Mean F1 | Mean modeled cost per 1,000 pages | Mean latency index (ACU 1.0 GA = 10) |
| --- | --- | --- | --- |
| Azure Document Intelligence | 96.71% | $10 | 4.4 |
| Azure Content Understanding 1.0 GA | 97.41% | $16.23 | 10 |
| Azure Content Understanding 2.0 Preview | 99.32% | $8 | 4.9 |

Against 1.0 GA, 2.0 Preview improved mean F1 by 1.91 percentage points, cut mean modeled cost by 51%, and lowered mean latency by 51%. Against Document Intelligence, mean F1 was 2.61 percentage points higher, modeled cost was 20% lower, and mean latency was 10% higher. Category by category, 2.0 Preview had higher F1 than 1.0 GA in 17 categories, was faster in 18, and had a lower modeled cost in all 19.

Read the caveat before you put any of those dollars in a budget. Those cost figures are modeled benchmark estimates. Actual cost depends on the content-extraction and contextualization meters, Foundry model usage, and current rates. Use the API's `usage` values with current pricing guidance. I did not open the pricing page, and I did not read a `usage` payload. Don't turn `$8` per 1,000 pages into your invoice.

The page does not name the 19 categories. The concept page lists many US tax form IDs. Don't copy that list into the blank and call it the benchmark. The blog's complex example is a consolidated 1099, which it calls 1099 Combo, and it links `tax.us/tax.us.1099Combo.md`. The concept page lists `prebuilt-tax.us.1099Combo` as combined 1099 forms. I did not prove those two names are the same analyzer. Leave each name on the page that prints it.

Advanced Contextualization is not on every prebuilt. The post says they are just getting started enabling it for prebuilt solutions, and it points at [What's new in Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/whats-new). That page's `ms.date` is `2026-09-08T00:00:00Z`. A search of the extract I saved this morning found no `Advanced Contextualization` and no `2026-10`. Don't cite What's New as the ship notice for this benchmark. Cite the October 13 post.

## Copy the prebuilt before you call it production

The concept page adds a warning the blog does not print. Prebuilt analyzer definitions can change across API versions. Make a copy of the prebuilt instead of relying on the prebuilt version directly in production.

The page shows the shape, not a full script. `GET /analyzers/prebuilt-idDocument` returns a JSON definition you can edit. `PUT /analyzers/prebuilt-myIdDocument` creates your analyzer from the modified body. The ID in that example is an identity-document template, not a mortgage ID. Swap in the analyzer you actually retrieved. I did not call either route. Record the API version next to the copy.

## What to record before you set a review line

Do this on the family you will actually run.

1. Select the prebuilt for that family in [Azure Content Understanding Studio](https://aka.ms/cu-studio).
2. Run a mix of clean digital files, scans, and layout variants.
3. Compare each value with the expected result. Inspect grounding and confidence. Apply your business rules.
4. Record field-level quality, completion rate, latency, and the API's `usage` values for contextualization and model tokens.
5. Repeat the same files. Then set validation and human-review thresholds from business risk.

Use the same API version and the same analyzer configuration across those runs. If a value is schema-valid and the grounding box sits on a different total, don't ship it straight through.

One question worth answering from a real packet, not from this page: when a schema-valid amount and the grounding span disagree, do you hold the document for a person, or do you let confidence alone decide?
