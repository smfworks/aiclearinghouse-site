---
{
  "slug": "embeddinggemma-2",
  "title": "EmbeddingGemma 2",
  "excerpt": "A 740M open embedding model that maps text, images, video, and audio into one 768-d space. Google's launch blog is dated October 6, 2026. It is not a chat model, and the card has no token price.",
  "category": "Google",
  "tags": ["embedding", "multimodal", "on-device", "open-weight", "retrieval"],
  "provider": "Google DeepMind",
  "input_price": null,
  "output_price": null,
  "context_window": 8192,
  "arena": "Embedding model",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-10-07"
}
---

# EmbeddingGemma 2

## Overview

Do not send this model a chat prompt and wait for a paragraph. It returns a vector.

Google's launch blog is dated October 6, 2026. The model card on Hugging Face describes EmbeddingGemma 2 as an open multimodal embedding model that maps text, including code, plus images, video, and audio, into one 768-dimensional space. Total size on the card is 740M parameters: a 270M text stack (130M transformer plus 140M embedder), a 170M vision encoder, and a 300M audio encoder.

The Hub API record for `google/embeddinggemma-2` was created September 14, 2026 and last modified October 6, 2026. The public launch note is the October 6 blog. The repo existing earlier is not the same claim as "the card was born today."

There is no token price on the card or the blog. The price fields here are blank on purpose. You pay in disk, RAM, and whatever machine you load it on.

## What the card measures

Full-precision, 768-d, from the model card. EmbeddingGemma 1 is the comparison column where the card has one.

- MTEB multilingual v2, mean task: 61.36 versus 61.15
- MTEB code v1, NDCG@10: 78.68 versus 68.76
- MIEB lite: 64.64
- MMEB v2 image, Hit@1: 57.28
- MMEB v2 visual documents, NDCG@5: 67.84
- MMEB v2 video, Hit@1: 50.67
- MSEB retrieval, MRR@10: 69.54
- MAEB, mean task: 49.39

The blog's code line matches the table: 68.76 to 78.68. Use the table if a writeup rounds it.

Truncation on the same card, MTEB multilingual mean: 61.36 at 768-d, 61.17 at 512, 60.41 at 256, 57.89 at 128. The card says quality stays close down to 256-d, and that 128-d is for text-only checks, not a free multimodal shrink.

## Footprint

Load only the encoders you need. The card's `config_kwargs` table:

- Text only, vision and audio configs set to none: 270M
- Text and image, audio off: 440M
- Text and audio, vision off: 570M
- Full: 740M

Context is 8,192 tokens, shared across modalities. The card's default budget is 280 tokens per image, 140 per video frame, and 25 per second of audio. That is about 29 images, 58 frames, or 327 seconds if you send one modality and no extra text.

Google's blog, not this directory, says that with quantization a Pixel 11 Pro can sit near 191MB active RAM for text-only weights and near 567MB for the full model. That is Google's figure. We did not remeasure it.

## License and limits

The card's license field is `apache-2.0`. The banner also links the Gemma 4 license page. Read both before you ship a product on it. The card says the model is an embedding model: no post-training alignment, no output moderation. Safety work described there is data filtering, not a chat refusal layer.

It does not write answers. Pair it with a generative model if the next step is a sentence.

## Sources

- Launch blog, October 6, 2026: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
- Model card: https://huggingface.co/google/embeddinggemma-2
- Hub API record: created 2026-09-14, modified 2026-10-06
