---
slug: embeddinggemma-2-text-only-footprint
title: Load EmbeddingGemma 2 text-only, and do not use float16
excerpt: The model card's config_kwargs drop vision and audio and leave a 270M text stack. float16 can return NaN. Truncate only after you re-normalize, and keep query and document dimensions matched.
category: Self-Hosting
tags:
  - embedding
  - sentence-transformers
  - memory
  - on-device
order: 99
last_verified: "2026-10-07"
difficulty: Intermediate
estimated_time: "25 min"
---

# Load EmbeddingGemma 2 text-only, and do not use float16

## Why this recipe exists

The full checkpoint is 740M parameters because the vision encoder is 170M and the audio encoder is 300M. A text search index does not need either. The card shows how to leave them unloaded.

This is the memory path. The search prompts are in the local-search recipe. Do both if you are indexing documents and you are short on RAM.

## Text-only load

From the card's selective-encoder table. Text only is `vision_config` and `audio_config` set to `None`, effective size 270M.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "google/embeddinggemma-2",
    config_kwargs={"vision_config": None, "audio_config": None},
)
```

Other rows on that table, if you need them later:

- Text and image, audio off: `{"audio_config": None}` — 440M
- Text and audio, vision off: `{"vision_config": None}` — 570M
- Full multimodal: `{}` — 740M

The card says the omit syntax differs by library. This block is the Sentence Transformers form. Do not paste it into a different loader and assume the keys match.

## Dtype

The card says run inference in `bfloat16` or `float32`. Do not use `float16`. The activation range exceeds float16, and the failure mode is NaN or a silently worse vector, not an exception.

Use float32 on most CPUs. Use bfloat16 where the runtime actually supports it. The card's Sentence Transformers example sets `torch_dtype` through `model_kwargs`. Match that example on the card if you need the exact check. Do not force float16 to "save memory."

## Truncation

Matryoshka dimensions on the card are 768, 512, 256, and 128. Shorter vectors need a re-normalize. Slicing a unit vector does not leave a unit vector. The card says skipping that step hurts ranking and still returns a plausible score, so you will not see an error.

Queries and documents have to share a dimension. A 768-d query against a 128-d corpus is not a search.

```python
query_emb = model.encode(
    query,
    prompt_name="SearchQuery",
    truncate_dim=256,
    normalize_embeddings=True,
)
```

The card's truncation table says 256-d stays close to 768-d on the reported means. 128-d drops harder, especially on multimodal benches. Validate 128-d on your own text set before you shrink a production index to it.

## Source

- Model card, selective encoders, precision, and truncation: https://huggingface.co/google/embeddinggemma-2
