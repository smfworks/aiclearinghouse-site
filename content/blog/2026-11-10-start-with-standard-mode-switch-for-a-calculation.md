---
slug: "2026-11-10-start-with-standard-mode-switch-for-a-calculation"
title: "Start with standard mode. Switch the workflow only for a calculation"
excerpt: "If the total is already in one cell, leave the Content Understanding analyzer on standard mode. Switch Workflow kind to Agentic Extraction only when the field is a calculation you have to build."
date: "2026-11-10"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-10-start-with-standard-mode-switch-for-a-calculation"
categories: ["Microsoft", "AI Agents"]
tags: ["Azure Content Understanding", "agentic mode", "Foundry", "how-to"]
readTime: 7
image: "/images/blog/2026-11-10-start-with-standard-mode-switch-for-a-calculation-hero.png"
---

You have a field that looks like a total. If that number is already sitting in one cell, leave the analyzer on standard mode. Switch the workflow kind only when the answer is a calculation, a reconciliation, or a value you have to build from more than one place in the file.

By the end you'll set API version `2026-06-01-preview`, put `"workflow": "agentic"` under `config`, mark every field method `generate`, and read the stored workflow string back before you treat the short word as the saved value.

The page is [When one pass isn't enough: agentic mode in Azure Content Understanding](https://devblogs.microsoft.com/foundry/when-one-pass-isnt-enough-agentic-mode-in-azure-content-understanding/), by Joe Filcik, Principal Product Manager. The visible date line is November 9th, 2026. `article:published_time` and JSON-LD `datePublished` are `2026-11-09T20:04:00+00:00`. The Foundry DevBlog feed `pubDate` is the same instant, `Mon, 09 Nov 2026 20:04:00 +0000`. Python put that stamp 15.95 hours before 7:01 AM Eastern on November 10. That clock is `2026-11-10T12:01:10Z`, from `date` this run.

The blog points at the [agentic mode quickstart](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/agentic-mode). I opened that page the same morning. `ms.date` is `2026-09-16T00:00:00Z`. `updated_at` is `2026-10-19T22:12:00Z`. Python put that update 517.82 hours before the same clock. The clicks agree with the November 9 blog. The quickstart adds the Generate rule, the resolved workflow family, and the preview limits.

## Leave the easy field on standard mode

Everyday version first. Most documents can be read in one pass. A few have to be worked, like a total that has to be built from several cells. The real name is agentic mode in Azure Content Understanding. The blog says it is in preview.

Filcik's post says to start with standard mode. It is the best default when it meets your accuracy requirements. Standard mode remains the faster, lower-cost starting point. The two modes are two points on a price-performance curve. Agentic mode spends more compute where that extra work can improve the result. It uses more model tokens and typically takes longer for the same document.

Switch when the task needs evidence from more than one place, a calculation or reconciliation, a long document, a rule, or a chart. The post's Treasury walkthrough is the calculation case. The schema asks for January 2003 agency outlays, with exclusions, across a table that spans two pages of a 137-page bulletin. A revision mark comes off. A minus sign stays. The calculator on that page produces 180,681 million dollars. That number is the page's example.

The same post has two more cases. Four economic charts in a 20-page excerpt fill seven fields: a value and a year for GDP growth, payroll change, and unemployment, plus the year short-term interest rates began trending down. The plotted value needs the subtitle, the axes, and the surrounding prose. A network log keeps one table across 19 pages. The first and last event IDs have gaps, so the count comes from the rows, not from the ID span.

Compare both modes on files that look like yours. Choose agentic mode when the quality change is worth the extra cost and latency.

## Turn on Agentic Extraction in Studio

Open Content Understanding Studio, create a project, and select `2026-06-01 (Preview)` for API version. Under Workflow kind, choose Agentic Extraction. Define the fields you want back, then test the project with your own document. Those clicks are the ones the November 9 blog prints.

The quickstart prints the setup that has to happen first. You need an Azure subscription, a Microsoft Foundry resource in a supported region, and the Contributor role or higher on the subscription or resource group. Connect that resource on the Content Understanding settings page. The button on the page is `+ Add resource`. Select the resource, then Next, then Save. Leave the checkbox `Enable autodeployment for required models if no defaults are available` checked. The page says that checkbox lets Studio deploy a standard model, a mini model, and an embeddings model. The current model list is on the supported-generative-models page the quickstart links.

The quickstart's Studio example names the project `agentic-contracts`. API version is the same `2026-06-01 (Preview)`. Workflow kind is Agentic Extraction. Then it says to use Generate for each field. The agentic preview doesn't support Extract fields yet. That Generate rule is on the quickstart. The November 9 blog does not print it.

## Put the calculation in the analyzer file

In code, use API version `2026-06-01-preview`. Add `"workflow": "agentic"` under `config`. Replace `{your-completion-model}` with the catalog name, not the deployment name. The blog's minimal example sets `baseAnalyzerId` to `prebuilt-document`.

The quickstart prints a complete file for an invoice check. Save it as `agentic-invoice.json`. Every field method is `generate`.

```json
{
  "description": "Calculate and validate totals in an invoice",
  "baseAnalyzerId": "prebuilt-document",
  "models": {
    "completion": "{your-completion-model}"
  },
  "config": {
    "workflow": "agentic"
  },
  "fieldSchema": {
    "fields": {
      "CalculatedLineItemTotal": {
        "type": "number",
        "method": "generate",
        "description": "Calculate the sum of all line-item amounts in the invoice."
      },
      "ReportedInvoiceTotal": {
        "type": "number",
        "method": "generate",
        "description": "Return the final total reported by the invoice."
      },
      "TotalsMatch": {
        "type": "boolean",
        "method": "generate",
        "description": "Return true when the calculated line-item total equals the reported invoice total. Otherwise, return false."
      },
      "ValidationSummary": {
        "type": "string",
        "method": "generate",
        "description": "Briefly explain whether the totals match and identify any discrepancy."
      }
    }
  }
}
```

The `"agentic"` request value enables agentic mode. Use `"default"`, or omit `workflow`, when you want the service to pick a standard workflow from the analyzer configuration. That sentence is on the quickstart.

Replace `{endpoint}`, `{key}`, and `{analyzerId}`, then create the analyzer:

```bash
curl -i -X PUT \
  "{endpoint}/contentunderstanding/analyzers/{analyzerId}?api-version=2026-06-01-preview" \
  -H "Ocp-Apim-Subscription-Key: {key}" \
  -H "Content-Type: application/json" \
  -d @agentic-invoice.json
```

The 201 Created response includes an `Operation-Location` header. Copy that URL and poll it:

```bash
curl -i -X GET "{operation-location}" \
  -H "Ocp-Apim-Subscription-Key: {key}"
```

Repeat until the body says `"status": "Succeeded"`. Wait at least one second between those requests.

## Read the stored workflow back

When you retrieve the created analyzer, `config.workflow` is `"agentic.2026-06-01-preview"`. The service resolves the creation-time selector to that versioned family. The agentic family uses the advanced contextualization rate.

The November 9 blog does not print that resolved name. Read it off the analyzer you just created, or off the quickstart, before you script against the short string `"agentic"`.

## Set the token rate before the first run

The November 9 blog does not print a tokens-per-minute number. The quickstart prerequisite does. Configure at least 400,000 tokens per minute on the Foundry model deployment so an agentic job is less likely to hit a 429. The [agentic mode overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/agentic-mode) says the same figure, about 400,000 TPM per analyzer job, and it carries the same `updated_at` of `2026-10-19T22:12:00Z`. Quote that capacity number from the October 19 overview, alongside the November 9 blog.

The quickstart marks API version `2026-06-01-preview` as public preview, with no service-level agreement, and it tells you to keep that preview off production workloads.

Preview limits on that page, and only these:

- Each analysis request supports one input file.
- Agentic mode supports document analyzers only.
- Fields that use the extract method aren't supported.
- Using labeled samples to improve the analyzer isn't supported.

The concept page adds that the one file can hold several logically related documents, such as a contract and an appendix. The limit is one input file per request.

If you still have an analyzer on the retired `2025-05-01-preview` pro mode, the concept page says to move to `2026-06-01-preview` and set `config.workflow` to `"agentic"`. Read the field schema against the agentic docs first. The old pro-mode configuration does not carry over as-is, and that preview still allows one input file per request.

## Try one invoice today

Submit one document. The quickstart's sample URL is the invoice PDF in the Azure samples repo.

```bash
curl -i -X POST \
  "{endpoint}/contentunderstanding/analyzers/{analyzerId}:analyze?api-version=2026-06-01-preview" \
  -H "Ocp-Apim-Subscription-Key: {key}" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": [
      {
        "url": "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf"
      }
    ]
  }'
```

A 202 Accepted response includes another `Operation-Location`. GET it the same way as the create poll. If the status is `Running` or `NotStarted`, wait one or two seconds and ask again. When the status is `Succeeded`, the schema-shaped output sits under `result.contents[].fields`. You should see the calculated total, the reported total, the comparison, and the validation summary from the file above.

In Studio, the same check is Test, then Run analysis, then Test, then Fields. The quickstart says agentic analysis can take a few minutes. Each run incurs Content Understanding and model usage charges. The pricing page is the one the quickstart links.

Review those fields before you use them in a high-impact workflow. That review line is on the quickstart.

Today, open Studio and leave Workflow kind alone if the number is already in one cell. If the field is a sum or a match between two totals, select `2026-06-01 (Preview)`, choose Agentic Extraction, and set the method to Generate. Then GET the analyzer and look for `agentic.2026-06-01-preview` before you call analyze.

If the printed invoice total and the line-item sum disagree on your files, which workflow string was on the analyzer when you first noticed it?
