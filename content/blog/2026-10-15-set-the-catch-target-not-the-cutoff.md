---
slug: "2026-10-15-set-the-catch-target-not-the-cutoff"
title: "Set the catch target. Do not ship 0.8 as the policy."
excerpt: "Turn on field confidence and grounding, agree on an error-catch target, then save a per-field table. A single 0.8 cutoff is a comparison on the public receipt lab, not a rule to paste into production."
date: "2026-10-15"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-15-set-the-catch-target-not-the-cutoff"
categories: ["Microsoft", "Azure AI Foundry"]
tags: ["Content Understanding", "confidence", "human in the loop", "Microsoft Foundry"]
readTime: 11
image: "/images/blog/2026-10-15-set-the-catch-target-not-the-cutoff-hero.png"
---

If you are about to paste 0.8 into a review rule, stop. Set the catch target first. Then let each field earn its own cutoff, or stay in review. Joe Filcik and Colin Murphy's October 14 Foundry post is the how-to. I did not open Foundry, run the notebook, or measure a threshold on this host. The steps below are the ones that page, the public lab it links, and the analyzer reference actually print.

The dated primary is [From extraction to action: Using grounding and confidence to build reliable document workflows](https://devblogs.microsoft.com/foundry/content-understanding-confidence-grounding-hitl/). The visible date is October 14th, 2026. `article:published_time` is `2026-10-14T15:38:56+00:00`, which matches the Foundry RSS `pubDate` of Wed, 14 Oct 2026 15:38:56 +0000. `article:modified_time` is `2026-10-14T21:07:02+00:00`. The author meta is Joe Filcik, Principal Product Manager. The byline also names Colin Murphy, Senior Data Scientist on Microsoft's Forward Deployed Engineering team.

That post is the newest item in the Foundry feed I fetched this morning. The next item is yesterday's prebuilt-analyzers post, already covered as [Send the file to the family analyzer. Then read confidence and grounding.](https://www.smfclearinghouse.com/blog/2026-10-14-send-the-file-to-the-family-analyzer/) Link that one if the intake is mixed forms. Do not retell it here. This post starts after you can already see a value, a score, and a source box.

## Turn the scores on before you argue about a cutoff

Confidence is opt-in. The public notebook says documents can enable confidence scores and grounding with `estimateFieldSourceAndConfidence`. A score from 0 to 1 estimates an extracted value's accuracy. Higher means more confidence. Grounding shows where on the page the value came from, so a reviewer can check it.

The [analyzer reference](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference) is the knob page the notebook links. It is not an October 14 refresh. Its `ms.date` is `2026-09-15T00:00:00Z`. `updated_at` is `2026-09-24T22:18:00Z`. The visible last-updated line is 2026-09-24. Cite it as the current property page, not as today's news.

On that page, `estimateFieldSourceAndConfidence` returns source location (page number and bounding box) and a confidence score for each extracted field value. The default is false, and it varies by analyzer. Document analyzers support it for `extract`, `classify`, and `generate`. The field-level property is `estimateSourceAndConfidence`. Its default is also false. It overrides the analyzer-level flag. A field whose `method` is `extract` requires the field-level property to be true.

If the analyzer never asks for the score, the notebook says extractions come back without a `confidence` and there is nothing to calibrate. Turn the flag on before you pick a number.

## Read the score as a ranking signal, not a feeling

The October 14 post is blunt about what the score is. A confidence score is a learned estimate of how reliable a specific field result is. For supported extracted fields, it is a value between 0 and 1. The latest refresh improved confidence score accuracy, measured by AUROC, by up to 14%.

It is not the language model reporting how sure it feels. Content Understanding uses a separate confidence model, trained on Microsoft-curated data, not customer data. Customers share that service-level model. They do not train one per analyzer, and they do not retrain it. They score it against checked examples from their own workflow, then choose thresholds. Calibration changes how the workflow reads the scores. It does not retrain the service model.

The same value can get a different score as a top-level field than it does inside a table or object, because the surrounding signals and the typical error patterns are different. That is why one cutoff cannot be the policy.

Grounding is the other half. If Content Understanding returns an Invoice Total of $14,228.02, grounding links that structured value back to the content that supports it. That figure is the post's illustration, not a document I processed. The latest release merged grounding deeper into the extraction flow. The post says that cut average inference token usage by up to 28% and improved accuracy. Use the link three ways: show the evidence with the result, validate the value together with that evidence, and keep an audit trail from the business record back to the page.

## Classify first if the intake is mixed forms

The insurance workflow in the post did not start with a threshold. Content Understanding classified and segmented incoming pages by form type. Each in-scope segment then went to a form-type-specific classifier for the version, then to the matching field extractor.

Classification was split across multiple analyzers in two tiers. Segmentation was enabled only in the first tier. Content Understanding v1 does not return confidence scores for classifications, so all classifications still required human review. Do not invent a classification confidence field. It is not on this page.

Where a valid calibration existed for the document type and the extraction configuration, field-level confidence rules populated priority labels in the human-in-the-loop review tool. Other results stayed in standard human review. Because the data was sensitive, people still checked every field. The labels directed attention. They did not authorize straight-through processing. In a less sensitive workflow, the same calibrated rules could send unflagged values straight through. That is a different decision. Do not borrow the insurance outcome and call it automation.

## Set a catch target. Then find the cutoff that meets it.

The post's line to keep is this: "0.8 feels safe" isn't a policy. The example business target is that review must catch at least 80% of known errors. That is a business decision, based on the value of catching errors in this workflow. It is not a number to paste into code.

Do the six steps in the order the page gives them.

1. Collect checked examples. Real production documents from each document type, version, and source in scope, with answers confirmed by people. Include handwriting, scan quality, and missing values. Synthetic examples are not a substitute.

2. Measure each document type and field. Record accuracy, and check whether confidence actually separates right answers from wrong ones.

3. Set the target. The 80% catch line is the post's example, not a default you inherit.

4. Find the cutoff that meets the target while sending the fewest values to review. If no cutoff meets it, that field stays in review.

5. Validate on held-out documents. Results on the calibration set can be too optimistic.

6. Keep an outer loop. Reviewed results become the next checked examples. Sample results that were not flagged. A confidence distribution by itself cannot prove correctness.

A threshold that works for a policy number may be a poor choice for a handwritten address or a table row. High overall accuracy does not justify a looser cutoff. A stricter cutoff cannot rescue a score that does not separate errors.

Empty fields need their own rule. In this workflow, confidence on empty results did not reliably separate a true blank from a miss. Empty values got a separate policy, based on how often "nothing" was actually the right answer for that field.

Calibration applies only to the document types, sources, analyzer configuration, field schema, and extraction model you evaluated. It is not a portable guarantee. Revalidate when those change. You are updating your reading of the scores. You are not retraining the service model.

## Keep the number sets apart

The October 14 page prints several figures. They are not one measurement. Do not put them in the same sentence.

| Set | What the page says | What it is not |
| --- | --- | --- |
| Customer narrative | Nearly a 50% reduction in human review burden and 75% faster form onboarding, enabled by 97%+ page-level classification accuracy and confidence- and grounding-based routing. | Not a license for straight-through processing. People still checked every field. |
| Customer held-out eval | More than 22,000 field values across more than 1,000 production documents. Policies learned on one set and tested on a held-out set. On that held-out set, 41% fewer field values were selected for targeted review, and that smaller selection still included more than 80% of known extraction errors, compared with reviewing every field value. | Not 41% less staff time. Not error-free automation. Some errors stayed outside the targeted set. |
| Blog lab highlight | On the calibration set, a policy that sends 77% of mistakes to review automatically approves about 11% of all values from filled-in fields and about 13% from empty fields, leaving 77% for a person to check. | Illustrative. Not customer outcomes. Not the notebook's test-set line. |
| Public receipt lab, test set | 1,000 CORD v2 receipts, 800 to tune and 200 to test. With the dial at 80%, the policy approves 25% of the test values without review, catches 87% of the mistakes, and 10% of what it approves is wrong. | Not the insurer. Not the 77% / 11% / 13% highlight. |

The notebook's comparison section prints a tighter rounding of that same test-set contrast: 29.6% auto-approved against 25.1%, 70.5% of mistakes caught against 86.6%, and a straight-through error rate of 18.0% against 9.6%. The opening line rounds the shared cutoff to 30%, 71%, and 18%. Keep both. Do not average them.

## If you cannot use customer documents, open the public lab and say so

The post prints two short links: [aka.ms/cu-dynamic-hitl-lab-explainer](https://aka.ms/cu-dynamic-hitl-lab-explainer) and [aka.ms/cu-dynamic-hitl-lab](https://aka.ms/cu-dynamic-hitl-lab). This morning I followed both with `curl -I`. The lab link redirected to the Forgebook notebook and returned HTTP 200. The explainer link redirected to `dynamic-hitl-explainer.html` and returned HTTP 200. I did not extract charts from that explainer. Do not invent them.

Steps 1 through 6 run on bundled output and need no Azure credentials. Optional step 7 needs a Foundry resource, the Cognitive Services User role, default model deployments, and `CONTENTUNDERSTANDING_ENDPOINT`. I did not run the notebook.

What you ship is a CSV with one row per field. Routing a new value is a dictionary lookup and a comparison. The production path needs `field_name`, `extracted_value`, and `confidence`. It does not need ground truth to route. A filled-in value with no confidence goes to review. Blanks ignore the score and use the table's per-field blank decision.

On this receipt data, confidence is a useful guide for `total_price`. For `tax_price` it is not reliably better than chance. Five of the eight fields carry usable signal. `menu.quantity`, `other_adjustment`, and `tax_price` do not: their AUC interval reaches below 0.5, so filled-in values in those fields stay in full review no matter where you set the dial. The page does not list the other five in the span I used. I am not naming them.

Blanks get a placeholder score, so no cutoff can sort them. In this data those placeholders are 0.855 for line-item fields and 0.614 for single-value fields. At 0.80, every line-item blank is auto-approved: 112 of 615 held-out blanks, and 27 of those 112 are wrong. Every single-value blank goes to review. That is why a shared raw-confidence threshold is a comparison baseline, not a routing policy.

The blank track is an on/off switch. Even when every training blank is genuinely blank, a field needs blanks on 16 receipts to clear 0.80 and on 73 to clear 0.95. `menu.name`, with blanks on only 8 receipts, sends its blanks to review. More than half the saving comes from handling blanks. `service_price` and `other_adjustment` are blank on most receipts, and those blanks are reliable, so most of their values never need a person. That does not promote `other_adjustment`'s filled-in values. Those still stay in review.

Each cutoff has to meet the dial with 95% confidence on the training documents. A field can still land short on unseen documents. Here `menu.price` catches 78.6% at the 80% dial. If one field must hold the target, raise that field's target. The notebook's example mapping sets `total_price` to 0.95 and leaves the rest on the shared dial.

When the training split was re-sampled smaller, the blank track qualified with 15 to 30 blanks per field. The filled-in track needed a few hundred values. Below a few hundred documents, which fields qualify is mostly noise. Fields that do not qualify stay in full review. Re-fit as labels accumulate.

The question worth answering is not whether 0.8 feels safe. It is which catch target the people who own the queue will sign, and which of your fields fail the signal gate the way `tax_price` does on the receipt lab.
