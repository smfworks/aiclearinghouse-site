---
slug: "2026-08-21-ox-alpha-openrouter-official-a"
title: "Ox Alpha: a free 1M-context stealth model that can see"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "OpenRouter shipped stealth/ox-alpha on August 20. We ran SMF Official A (157 tests) plus vision, tools, and identity probes. Score: 127/157 (80.9%). Writing and tools were perfect. The images it claimed to see, it actually saw."
categories: ["AI", "Model Evaluation", "OpenRouter", "Multimodal"]
tags: ["ox-alpha", "openrouter", "stealth-model", "smf-bench", "official-a", "vision", "tool-calling"]
readTime: 12
image: "/images/blog/2026-08-21-ox-alpha-openrouter-official-a.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-openrouter-official-a"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

OpenRouter posted a new stealth model on August 20: `stealth/ox-alpha`. Free. 1,048,576-token context. Text, image, and video in; text out. Marketed for coding, long-horizon agents, and production work. The lab that trained it is unnamed.

We ran it the same morning on SMF Official A (`strict_v01`, 157 tests, thinking off) and a separate multimodal probe. The score is **127/157 (80.9%)**, with **zero errors and zero timeouts**, in **94.7 minutes**, at **$0**.

That is not Grok 4.6. It is a usable, free, long-context model with native tools, clean writing, and **vision that works on real pixels**.

## What it is

Live `/v1/models` record, 2026-08-21:

| Field | Value |
|-------|-------|
| id | `stealth/ox-alpha` |
| Context | 1,048,576 |
| Max output | 131,072 |
| Price | $0 / $0 |
| Inputs | text, image, video (card) |
| Output | text |
| Reasoning | **mandatory**, default effort `max` |
| Sampling card | temperature 1.0, top_p 0.95 |
| Tools | `tools`, `tool_choice` |
| JSON | `response_format` (object, no schema enforce) |

OpenRouter: prompts and completions are **retained by the provider and not used for training**. One Stealth endpoint. Preview terms apply; the slug can vanish.

The model identifies as "ox-alpha, developed by an undisclosed organization" in English and Chinese. It will not claim GPT, Claude, Gemini, Grok, GLM, Qwen, or Kimi. Community fingerprinting is rumor. We did not tokenizer-match it.

## Official A

Profile: `strict_v01`, `--thinking off`, `max_tokens=4096`, timeout 300 s, recipe `OpenRouter-cloud`. Text-only, so the score is apples-to-apples with Grok / Kimi / GLM. Vision is extra and reported separately.

| Category | Pass | Rate |
|----------|------|------|
| tool_calling | 2/2 | 100% |
| writing | 5/5 | 100% |
| reasoning | 27/30 | 90.0% |
| prose | 27/30 | 90.0% |
| instruction | 26/30 | 86.7% |
| coding | 20/30 | 66.7% |
| math | 20/30 | 66.7% |
| **Total** | **127/157** | **80.9%** |

Difficulty:

| Tier | Ox Alpha |
|------|----------|
| easy | 10/10 |
| medium | 15/15 |
| hard | 24/25 |
| expert | 30/40 |
| frontier | 41/60 |
| other (writing + tools) | 7/7 |

Easy and medium are clean. The single hard miss is `v3.math.hard.05` (circumscribed radius `8.750`), the item Grok 4.6 uniquely fixed versus 4.5. Collapse, when it happens, is expert and frontier.

Latency: mean **36.2 s**, median **27.7 s**, p90 **77.7 s**. Faster wall-clock than our Grok 4.6 Official A (150 min), slower than Kimi K3 / GLM-5.2 (~50 min).

## Where it is strong

**Tools.** Both Official A tool tests passed (`get_weather` Tokyo, `calculate` `45 * 73`). A separate probe produced a native OpenAI tool call: `get_weather(city=Boston, unit=celsius)`, `finish_reason=tool_calls`. No narration-instead-of-call.

**Writing.** 5/5 keyword thresholds. Article, summary, creative, technical, format.

**Reasoning.** 27/30. Easy through expert names and counts mostly boxed correctly. The three misses are one boxed name (`Fenna`) and two frontier numbers (`321`, `292`).

**Instruction and prose.** 26/30 and 27/30. Most structural counts (lines, stanzas, sentences) hit. The fails are over-generation on a few frontier items and one character-transform (`a9gre9dni9ckk13` vs `a9gredni9ckk12`).

**JSON.** `response_format: json_object` returned `{"city": "Boston", "temp_f": 72}`.

**Reasoning channel.** Mandatory CoT lands in `message.reasoning`. Answers still land in `content`. `What is 2+2?` at `max_tokens=64` returned `4`. `reasoning_effort=low` on the bat-and-ball problem returned `$0.05`. We did not hit the content-null trap that some cloud reasoning models show on short budgets.

## Vision works

Official A does not score images. We probed them.

A 64×64 data-URL PNG (red field, blue circle, yellow bar at the bottom) came back with the right shapes, colors, and layout. Prompt tokens included the image; the model did not say `CANNOT_SEE`.

A HTTPS PNG (`placehold.co`, white text `OXALPHA` on blue) came back: text **OXALPHA**, background **blue**.

A Wikimedia JPEG URL failed with HTTP 400 at OpenRouter (`Received 400 status code when fetching image from URL`). That is a fetch, not a "the model is blind" result. Data-URL and a fetchable HTTPS PNG both worked.

For agent loops that attach screenshots or diagrams, this is the useful part of the drop. 1M context plus working vision is a real combination on a free endpoint.

## Video does not, on this route

The model card says `text+image+video → text`. A `video_url` request returned:

```
404 No endpoints found that support video URLs
```

Wrapping the same MP4 as `image_url` returned 415 (PNG/JPEG/WebP/GIF only). **Do not plan video on `stealth/ox-alpha` until OpenRouter lists a video-capable endpoint.** The card oversells the live route.

## Coding and math, without the brochure

Coding is **20/30**. That is not a 0% MoE syntax collapse, and it is not Grok (30/30, 0 SyntaxErrors). Nine of ten coding fails are `SyntaxError`. Unicode leaked into code: `≈` U+2248, `×` U+00D7, `→` U+2192, `—` U+2014, plus unterminated strings. Same family as Kimi K3 (Pitfall 40), milder than GLM-5.2 (16 SyntaxErrors). Fine for sketches. Not the model I would trust for unattended single-shot production code.

Math is **20/30**. Two of the misses (`expert.06` `-0.01384`, `expert.07` `-9.417`) are the V9 ceiling Grok 4.6 still fails. The other eight are expert/frontier regex precision. Hard math is mostly there (4/5 plus the rest of hard). Expert physics-word-problems with three-decimal boxes are not.

## Versus the 2026-08-12 Official A cloud board

Same profile, previously published SMF runs:

| Model | Official A | SyntaxErrors |
|-------|------------|--------------|
| Grok 4.6 | 153/157 (97.5%) | 0 |
| Grok 4.5 | 152/157 (96.8%) | 0 |
| Kimi K3 | 140/157 (89.2%) | 5 |
| DeepSeek V4 Pro | 128/157 (81.5%) | — |
| **Ox Alpha (2026-08-21)** | **127/157 (80.9%)** | **9** |
| Qwen3.8-Max | 125/157 (79.6%) | — |
| GLM-5.2 | 121/157 (77.1%) | 16 |

Ox Alpha sits with DeepSeek V4 Pro, above Qwen3.8-Max and GLM-5.2, 16.6 points under Grok 4.6. Use Grok when you need a syntax floor of zero. Use Ox Alpha when you want a free 1M-context multimodal (image) endpoint that already tools and writes.

## How to call it

```bash
curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "stealth/ox-alpha",
    "temperature": 1,
    "top_p": 0.95,
    "max_tokens": 4096,
    "messages": [{"role": "user", "content": "What is 2+2?"}]
  }'
```

For images, send `image_url` as a data URL or a fetchable HTTPS PNG/JPEG/WebP/GIF. For agents, pass OpenAI-format `tools`. Official A used `--thinking off`; the provider still emits `reasoning`.

## What I would use it for

1. **Free long-context agent loops** that need tools and the occasional screenshot.
2. **Drafting and summarization** (writing 5/5).
3. **Vision-in, text-out** on diagrams and UI captures, with data URLs if the CDN 400s.
4. **Not** unattended coding merges, **not** video, **not** anything you cannot put on a retained-prompt preview.

Local production on this lab stays Qwen3.8-27B DSpark on spark-56bc. Ox Alpha is a cloud preview, not a replacement.

## Reproducing

Raw JSON, probe log, and the full fail inventory:

[github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/ox-alpha-or](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/ox-alpha-or)

```bash
cd smf-bench
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
python3 -u run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model stealth/ox-alpha \
  --tag cal-ox-alpha-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300 \
  --api-key "$OPENROUTER_API_KEY"
```

Tag prefix `cal-`: measurement, not a D-series rank.

## Verification notes

- Official A numbers: `results/stage1_cal-ox-alpha-strict-v01_20260821_112422.json` (157 tests, `serve_recipe_id=OpenRouter-cloud`, no `hf_gate`).
- Cloud board comparators: SMF Official A published 2026-08-12 (`showdown-grok46-vs-grok45-vs-kimi-k3-vs-glm52` and the 08-12 skill snapshot for DeepSeek V4 Pro / Qwen3.8-Max).
- Vision/video/identity: `results/ox-alpha-probe-2026-08-21.json` plus follow-up data-URL and HTTPS PNG calls the same morning.
- Model card fields: OpenRouter `GET /v1/models` and `/v1/models/stealth/ox-alpha/endpoints` on 2026-08-21.
- First launch aborted after it ingested a leftover `hf-gate.json` stamped `qwen3_5_hybrid_gdn`. The published run did not load that gate.

---

*SMF Official A · strict_v01 · thinking off · OpenRouter · 2026-08-21 · wall 5681 s*
