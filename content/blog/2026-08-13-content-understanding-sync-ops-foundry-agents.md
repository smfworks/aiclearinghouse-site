---
slug: "2026-08-13-content-understanding-sync-ops-foundry-agents"
title: "Synchronous Content Understanding for Foundry Agents: In-Memory Read, Layout, and Agentic Documents"
excerpt: "Azure Content Understanding now returns Read, Layout, and Digital Parse results in a single request — no poll loop, no temporary service-side storage. Pair that with agentic document mode and the Agent Framework context provider to give Foundry agents a real-time document plane."
date: "2026-08-13"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-content-understanding-sync-ops-foundry-agents"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Content Understanding", "Foundry Tools", "Synchronous API", "Agent Framework", "Agentic Mode", "Document Intelligence", "Microsoft Foundry"]
readTime: 12
image: "/images/blog/2026-08-13-content-understanding-sync-ops-foundry-agents-hero.png"
---

Foundry agents are only as useful as the documents they can read *while the turn is still open*. A customer drops an insurance card into a chat. A loan officer attaches a five-page packet. A Copilot Studio or hosted agent needs tables, signatures, and field values before it can call the next tool. The classic Content Understanding path — POST an analyze job, capture `Operation-Location`, poll until `Succeeded` — is the right shape for batch ingestion. It is the wrong shape for a live agent turn.

This week the Microsoft Foundry Blog published the missing piece: **synchronous Read, Layout, and Digital Parse operations** in Azure Content Understanding, now in public preview on API version `2026-06-01-preview`. The service processes the file in memory, returns structured content in the same HTTP response, and does not write a temporary service-side copy. Combined with the July 2026 wave already on Microsoft Learn — agentic document mode, GPT-5.x generative models, signature and metadata extraction, and a first-class Microsoft Agent Framework package — you can give agents a document plane that matches how they actually work.

Preview features have no SLA and can change before general availability. Treat the numbers and verb names below as the current public preview contract, and keep an eval set next to every analyzer you promote.

## Why synchronous operations exist

Two pressures drove the preview, and both show up in production agent work.

**Latency.** Agentic systems increasingly need extracted text and layout the moment a file enters the conversation. The Foundry Blog post walks the call-center case: a customer uploads a document mid-chat; the agent should answer from structured content in that same turn. An asynchronous job plus a poll loop adds round-trips and forces you to hold conversation state while the operation finishes.

**Confidentiality.** Teams that already run Azure Document Intelligence or Content Understanding asked for a path that never parks the bytes on service-side temporary storage. Synchronous Read and Layout process the payload in memory. You send either raw binary or a URL the resource can reach; the service returns structured content and is done.

The standard asynchronous analyze path remains generally available (the November 2025 `2025-11-01` GA line) and is still the right default for large packets, long-running custom analyzers, and overnight RAG ingestion. Sync is a complement, not a replacement.

## What the preview actually ships

In this preview, three prebuilt analyzers support both async and sync:

| Analyzer | What it returns | Sync verbs |
| --- | --- | --- |
| `prebuilt-read` | OCR text plus location | `analyzeInline`, `analyzeBinaryInline` |
| `prebuilt-layout` | Text plus structure: tables, sections, figures, formatting, hyperlinks, and now signatures | same |
| `prebuilt-digitalParse` | Digital-document parse (Foundry Blog) | same |

Every other prebuilt analyzer stays async-only. That is the first design decision to encode in your router: if the agent needs invoice fields, tax schemas, or a custom analyzer, keep the existing poll path. If it needs *text and structure now*, use sync.

Current preview limits from the Foundry Blog announcement:

- Documents up to **10 MB**
- Up to **five pages** or **30,000 characters** per request
- Optional page-range selection
- Same file formats as the async path
- Priority processing on a dedicated resource pool

Microsoft Learn's synchronous quickstart currently documents `prebuilt-read` and `prebuilt-layout` on the same `2026-06-01-preview` API. Use Learn for the REST contract and the Blog for the Digital Parse addition and pricing meters.

### Pricing meters (public preview)

The Blog posts a clear 1.5× premium versus async. That is the trade you are buying: lower latency and in-memory processing.

| Capability | Meter | Async | Sync (preview) |
| --- | --- | --- | --- |
| Read (OCR) | Document: Basic | $1.00 / 1,000 pages | $1.50 / 1,000 pages |
| Layout (structure + signatures) | Document: Standard | $5.00 / 1,000 pages | $7.50 / 1,000 pages |
| Text documents | Document: Minimal | $0.01 / 1,000 pages* | $0.015 / 1,000 pages |

\*Up to 3,000 characters count as one page, rounded up. Confirm live numbers on the [Content Understanding pricing](https://aka.ms/cu-pricing) page before you lock a cost model — preview prices can move.

## Call it: REST and SDK

Two methods, one idea. `analyzeBinaryInline` takes `application/octet-stream`. `analyzeInline` takes JSON with a URL the resource can fetch. The response *is* the result — no `Operation-Location`, no second GET. Prefer Microsoft Entra ID in shared environments; the Blog and Learn samples use a subscription key only to demonstrate the verb.

```bash
curl --request POST \
  --url 'https://{endpoint}/contentunderstanding/analyzers/prebuilt-read:analyzeBinaryInline?api-version=2026-06-01-preview' \
  --header 'Content-Type: application/octet-stream' \
  --header 'Ocp-Apim-Subscription-Key: {key}' \
  --data-binary '@InsuranceCard.png'
```

Preview SDK (`pip install --pre azure-ai-contentunderstanding`): `ContentUnderstandingClient(...).analyze_binary_inline(analyzer_id="prebuilt-read", binary_input=file_bytes)`. URL form is `analyze_inline(..., inputs=[AnalysisInput(url=...)])`. Same in-memory contract.

## When to pick sync versus async

Use this as the routing table inside the agent, not as a hallway debate.

| Signal | Prefer sync | Prefer async |
| --- | --- | --- |
| File size / pages | ≤ 10 MB and ≤ 5 pages / 30k chars | Larger packets, 200 MB / 300-page async limits |
| Analyzer | `prebuilt-read`, `prebuilt-layout`, `prebuilt-digitalParse` | Custom analyzers, tax/finance prebuilts, RAG search analyzers |
| Latency budget | Interactive agent turn, call-center, ID check | Batch ingestion, Foundry IQ / Azure AI Search skillset |
| Data handling | No temporary service-side copy | Standard async job store is acceptable |
| Cost | Willing to pay the 1.5× meter | Optimize for throughput |

A practical pattern: the agent calls sync Layout on the first five pages to decide *what the packet is*, then fans the full file to the matching async custom analyzer if the packet is large or domain-specific. Classification enhancements in the `2026-06-01-preview` API — layout-based features and in-page segmentation — make that first-pass decision more reliable than a regex on the filename.

## Agentic mode: when extraction is not enough

Synchronous Read/Layout answers "what is on the page." A large class of agent work answers "does this packet satisfy the rule?" That is **agentic mode**, also on `2026-06-01-preview`.

Set `config.workflow` to `"agentic"` when you create the document analyzer. The service stores a resolved, versioned value such as `"agentic.2026-06-01-preview"` so the contextualization rate is explicit. Use `"default"` (or omit `workflow`) when standard extraction is enough.

Learn's agentic-mode overview is clear about the job: reason across a document, run calculations, validate against conditions, inspect tables and figures, and return schema-aligned fields. The initial preview accepts **one input file per request**. That file can contain multiple logically related documents — contract plus appendix plus company rules — which is the usual packet shape.

Cost and capacity notes from Learn, not folklore:

- Agentic workflow uses the **advanced contextualization** rate.
- It consumes more completion tokens and typically takes longer than a standard analyzer on the same file.
- Plan about **400,000 tokens per minute** of Foundry model capacity per analyzer job, or you will see 429s.

Pro mode (`2025-05-01-preview`) is retired. New reasoning-over-document work should land on agentic mode in `2026-06-01-preview`. Agentic mode is not a substitute for human review on high-impact decisions; it is the highest-effort automated pass the service offers.

A useful split for agent authors:

1. **Sync Layout** for "show me the structure now."
2. **Standard custom analyzer** for "extract these 40 fields with confidence and grounding."
3. **Agentic analyzer** for "reconcile the totals, check the covenant, tell me if the packet is complete."

Keep those as three analyzer IDs. Do not stuff every field into the agentic schema.

## Wire it into Microsoft Agent Framework

You do not have to hand-roll the tool call. Microsoft ships `agent-framework-azure-contentunderstanding` (`pip install agent-framework-azure-contentunderstanding --pre`). The integration is a **context provider**, not a raw function the planner has to remember.

`ContentUnderstandingContextProvider` inspects the turn for supported documents, images, audio, and video, runs Content Understanding, and injects Markdown plus extracted fields into the model context before the completion. Defaults:

- `prebuilt-documentSearch` for documents and images
- `prebuilt-audioSearch` for audio
- `prebuilt-videoSearch` for video
- `max_wait` of 5 seconds, then analysis continues in the background; set `max_wait=None` to block until the result is in context
- Optional `file_search` to push Markdown into a vector store instead of stuffing the whole document into the prompt

For domain work, pass `analyzer_id` to your custom or prebuilt schema. That is how an invoice agent gets `VendorName` and `InvoiceDate` as fields instead of a wall of Markdown.

The Build 2026 Foundry Blog post showed the same provider with `AnalysisSection.MARKDOWN` / `FIELDS` / `FIELD_GROUNDING`. Sync Read/Layout makes a short `max_wait` realistic for small attachments. MarkItDown (`pip install 'markitdown[az-content-understanding]'`) stays the CLI cousin for ingestion jobs.

## The rest of the July/August document plane

Sync ops sit on a larger control surface already on Learn's July 2026 "what's new" page.

- **GPT-5.x generative models.** Learn lists GPT-5.5, GPT-5.4, and GPT-5.4-mini for generative fields. Existing GPT-4.1 analyzers keep running. Side-by-side eval before you flip production. The service-limits table still names `gpt-5.2` on the GA line — record the actual Foundry deployment ID on the analyzer.
- **Labeled-sample training.** GA and preview both accept labeled documents. The preview API distills them into the built analyzer, then **drops the training set**. Analysis-time tokens go down. Documents only; not generative fields yet.
- **Confidence and grounding** now cover `generate` and `classify`, not only `extract`. Turn on `estimateFieldSourceAndConfidence`. Straight-through processing needs the cell *and* the score.
- **Normalization** of dates and numbers is automatic and not configurable. Validators must use the canonical form.
- **Signatures and metadata.** Preview results include a `signatures` array and a `metadata` object. Layout sync surfaces signatures as structure — useful for contract and HR agents.
- **Classification** adds layout-aware features and in-page segmentation (one page, multiple document types, confidence on the split).
- **Azure AI Search skill** (`2026-05-01-preview`) adds figure descriptions and paragraph-aware semantic chunking. That is the batch twin of the live agent path.
- First-class integrations: Agent Framework, LangChain (`langchain-azure-ai`), Logic Apps, MarkItDown.

Content Understanding is a Foundry Tool, not a second runtime. Hosted agents and the Agent Framework provider take the live turn; Foundry IQ / Azure AI Search take the corpus; Copilot Studio can sit in front of the same resource for file intake; Entra Agent ID and Agent 365 still own identity and audit. Private BYO capability hosts still apply — if the agent cannot reach Blob or Search, `analyzeInline` will not save you.

## What to do this week

1. Confirm a Microsoft Foundry resource and that `2026-06-01-preview` is allowed. Time `prebuilt-read:analyzeBinaryInline` on a 1–2 page scan and `prebuilt-layout:analyzeInline` on a public invoice URL.
2. Router: sync if pages ≤ 5 and the analyzer is Read/Layout/Digital Parse; otherwise async. Custom analyzer IDs 404 on the inline verbs.
3. Install `agent-framework-azure-contentunderstanding --pre`, attach `ContentUnderstandingContextProvider` with `max_wait=None`, then set `analyzer_id` to a schema you already trust.
4. For one high-value packet, create an agentic analyzer (`config.workflow: "agentic"`), provision ≥ 400k TPM, enable field confidence, and start migrating any leftover `2025-05-01-preview` pro-mode analyzers.

If agentic jobs 429, raise TPM. If sync is empty or times out, you are over 10 MB / five pages / 30k characters — fall back to async. Built-in Content Understanding Owner / Contributor / Reader roles cover Entra; the Studio storage account still holds labeled samples even after the built analyzer drops them.

Synchronous Content Understanding is a small surface — three analyzers, two verbs, a 1.5× meter — and that is why it is useful. It closes the gap between "the agent has a file" and "the agent has structure," without a job queue and without parking the bytes. Pair it with agentic mode for packets that need reasoning, keep async custom analyzers for the rest, and let Foundry IQ handle the corpus.

## Sources

1. Microsoft Foundry Blog — [Azure Content Understanding announces Synchronous Operations](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-content-understanding-announces-synchronous-operations/4544475) (Krishna Doss).
2. Microsoft Learn — [Synchronous Content Understanding operations](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/use-synchronous-rest-api).
3. Microsoft Learn — [What's new in Azure Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/whats-new) (July 2026).
4. Microsoft Learn — [Agentic mode overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/agentic-mode).
5. Microsoft Learn — [Content Understanding with Microsoft Agent Framework](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/integrations/agent-framework).
6. Microsoft Foundry Blog — [What's new in Azure Content Understanding at Build 2026](https://devblogs.microsoft.com/foundry/whats-new-in-azure-content-understanding-at-build-2026/).
7. Microsoft Learn — [Document analysis elements](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/elements) · [Service quotas and limits](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/service-limits).
