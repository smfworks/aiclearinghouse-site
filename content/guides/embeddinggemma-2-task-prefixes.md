---
slug: embeddinggemma-2-task-prefixes
title: "Match the EmbeddingGemma 2 prefix to the task"
excerpt: "The October 6 model card uses different text prefixes for search, classification, and similarity. Skipping the prefix still runs. The card says the vectors get worse."
category: Guides
tags:
  - embedding
  - retrieval
  - rag
  - embeddinggemma
order: 99
last_verified: "2026-10-07"
---

# Match the EmbeddingGemma 2 prefix to the task

## Why the prefix is the product

EmbeddingGemma 2, on the model card behind Google's October 6, 2026 launch blog, was trained with short task prefixes on text. The card says omitting the prefix still returns a vector, and that the vector is less precise. That is the bug you will not see in a demo. Both sides embed. The ranking is just worse.

Prefixes apply to text only. Images, video, and audio go in with no prefix. A `<|image|>` placeholder marks where an image sits in an interleaved string. It is not a task prefix.

## Asymmetric versus symmetric

Retrieval is asymmetric. The query gets a query prefix. The corpus item gets a document format.

Search, from the card:

- Query prompt name `SearchQuery`: `task: search result | query: {query}`
- Document: `title: {title} | text: {content}`
- If there is no title, `prompt_name="Document"` applies `title: none`
- If there is a title, format the string yourself. The Document prompt will not insert your title.

Other asymmetric names on the card: `QuestionAnswering`, `FactChecking`, `CodeRetrieval`. Code retrieval's document side is `title: {title or filename} | text: {code}`.

Classification, clustering, and similarity are symmetric. The same prefix goes on every input you compare.

- `Classification`: `task: classification | query: {content}`
- `Clustering`: `task: clustering | query: {content}`
- `SentenceSimilarity`: `task: sentence similarity | query: {content}`

Do not embed a support ticket with `SearchQuery` and a second ticket with `SearchQuery` and call that duplicate detection. That task is `SentenceSimilarity` or `Clustering`.

## Truncation is a second contract

Native size is 768. The card allows 512, 256, and 128, if you re-normalize after the cut. `truncate_dim` plus `normalize_embeddings=True` on `encode` is the path the card shows, so you do not slice by hand and forget the norm.

Both sides of a comparison must use the same dimension. A 256-d query against a 768-d index is not a near miss. It is a different space.

The card's own table is the quality warning. Multilingual MTEB mean goes from 61.36 at 768-d to 60.41 at 256-d and 57.89 at 128-d. Multimodal means drop faster at 128. Use 128 for a text index you have checked. Do not use it as the default for mixed images and audio.

## What to do next

Pick one task. Write the prefix into the indexer and the query path in the same change. If you already embedded a corpus with `title: none` and you now have titles, re-embed. Mixing the two document formats in one index is how a good query looks broken.

The model does not write the answer. After you have the neighbors, send those passages to a generative model. EmbeddingGemma 2's card is explicit that it was not post-trained as a chat model.

## Sources

- Model card: https://huggingface.co/google/embeddinggemma-2
- Launch blog, October 6, 2026: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
