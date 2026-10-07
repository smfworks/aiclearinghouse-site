---
slug: embeddinggemma-2-local-search
title: Run EmbeddingGemma 2 locally for text search
excerpt: Sentence Transformers quick start from the model card. One pip install, two prompt names, and a similarity call. No token price because the weights are local.
category: Self-Hosting
tags:
  - embedding
  - sentence-transformers
  - local
  - retrieval
  - on-device
order: 99
last_verified: "2026-10-07"
difficulty: Beginner
estimated_time: "20 min"
---

# Run EmbeddingGemma 2 locally for text search

## What you get

A local embedding model at `google/embeddinggemma-2` that can score a query against a document. The card's quick start is text. Images and audio are a later step, and they cost extra memory. Start with text.

The launch blog is October 6, 2026. The commands below are copied from the model card, not from a secondary tutorial.

## Prerequisites

- Python with `pip`
- Enough RAM for the text stack. The card's text-only size is 270M parameters if you disable the other encoders. This recipe loads the default checkpoint. See the text-only recipe if RAM is tight.
- No API key. There is no token price on the card.

## Install

```bash
pip install -U sentence-transformers transformers
```

## Encode a query and a document

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("google/embeddinggemma-2")

query = "What causes the northern lights?"
document = "The northern lights are caused by charged particles from the sun."

query_emb = model.encode(query, prompt_name="SearchQuery")
doc_emb = model.encode(document, prompt_name="Document")
print(model.similarity(query_emb, doc_emb))
```

`SearchQuery` applies `task: search result | query: {query}`. `prompt_name="Document"` applies `title: none`. If the document has a real title, do not use that prompt name. Format it yourself:

```python
doc_emb = model.encode(f"title: {title} | text: {document}")
```

Prefixes are for text. The card says to pass images, video, and audio with no prefix.

## Checks before you trust a score

- Query and document embeddings must use the same dimension. The native size is 768.
- A search query prefix on both sides is the wrong setup. Retrieval is asymmetric: query prefix on the query, document format on the corpus.
- Classification, clustering, and similarity are symmetric. The card's prompt names for those are `Classification`, `Clustering`, and `SentenceSimilarity`. Do not reuse `SearchQuery` for them.

## Source

- Model card quick start: https://huggingface.co/google/embeddinggemma-2
- Launch blog: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
