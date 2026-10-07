---
{
  "slug": "kolibri-1",
  "title": "Kolibri 1",
  "excerpt": "Aleph Alpha's Apache 2.0 German-English MoE, 78B total and 3.46B active, with a validated 1M context and a serving recommendation of 262K.",
  "category": "Aleph Alpha",
  "tags": ["open-weight", "moe", "german", "reasoning", "tool-calling", "long-context"],
  "provider": "Aleph Alpha",
  "input_price": null,
  "output_price": null,
  "context_window": 1048576,
  "arena": "Open weights",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 110,
  "last_verified": "2026-10-07"
}
---

# Kolibri 1

## Overview

Download the weights before you quote the slogan. Aleph Alpha published Kolibri 1 on October 3, 2026: an English-German mixture-of-experts model, 78,103,074,560 total parameters, 3,457,573,120 active per token. The Hugging Face repo was created October 2, 2026. The weights are Apache 2.0. There is no public token price on the model card or the launch post, so the directory leaves the price blank rather than calling a self-hosted model free.

The useful split is the context line. The card says quality and serving were validated up to 1,048,576 tokens. It also says to keep latency-sensitive and complex work at or under 262,144. That second number is the one to put in a serving config. The model was pretrained at 16,384, mid-trained at 65,536, and extended to a native 262,144. Longer contexts are an extension, not the training length.

## Pricing

No hosted rate card was on the pages fetched for this entry. The blog points enterprise deployment and specialization to a sales form. If you serve it yourself, the cost is the hardware that can hold the published footprint: about 78 GB for the FP8 weights. The card publishes a minimum accelerator list. Read that list on the model card before you plan a box. This entry does not repeat it, and it does not claim a local run.

## Benchmarks

These numbers are Aleph Alpha's, from the October 3, 2026 blog table. They are not an independent run. Higher is better on that table. Qwen3.6-35B-A3B and Mistral Small 4 119B-A6B are the two comparators copied here.

| Benchmark | Kolibri | Qwen3.6-35B-A3B | Mistral Small 4 |
| --- | --- | --- | --- |
| AIME 2025 | 96.9 | 84.6 | 79.8 |
| AIME 2025 (DE) | 87.5 | 82.9 | 72.3 |
| GPQA Diamond | 84.3 | 83.4 | 74.7 |
| AA-Omniscience Index | -32.8 | -15.3 | -24.0 |
| τ³-bench banking | 38.1 | 10.6 | 5.7 |
| τ²-bench telecom | 94.7 | 99.1 | 41.5 |
| BFCL v4 overall | 61.4 | 67.2 | 58.0 |
| LiveCodeBench v6 | 85.9 | 82.5 | 71.2 |
| HumanEval+ | 92.7 | 92.8 | 92.8 |
| LongBench Pro | 64.5 | 70.8 | 56.4 |

The vendor summary says Kolibri matches models with up to four times its active parameter count. The same table does not support that on every row. Omniscience, BFCL v4, LongBench Pro, and telecom are losses to Qwen3.6 on the numbers above. Banking and the German AIME row are the other direction. Treat the Pareto-frontier sentence as their claim, then read the row.

The blog also plots internal customer-proxy scores for five verticals. Those suites are not on the public table. Do not brief them as a benchmark you can rerun from the card.

## Key capabilities

- German and English, on purpose. The card says two languages is a depth choice, not a missing feature.
- Explicit reasoning effort: `low`, `medium`, `high`, or off with `none` / `enable_thinking=false`.
- Tool calling through the `kolibri1` parser, combinable with reasoning. The published serve command is `vllm serve Aleph-Alpha/Kolibri-1` with `--kv-cache-dtype fp8`, `--reasoning-parser kolibri1`, `--tool-call-parser kolibri1`, and `--enable-auto-tool-choice`.
- Recommended sampling on the card: temperature 1.0, top_p 0.97, top_k 128.
- Knowledge cutoff June 18, 2026 for both languages. The card says tool use can bring in newer facts. Without tools, it cannot.

## Limitations

- The Apache 2.0 grant on the card covers the published weights and config files. It does not extend to the underlying code, architecture, parameter settings, or training method. Aleph Alpha says it keeps those rights.
- The card's intended use is a person reviewing the output. It says the model is not meant to be the deciding component, and not for unreviewed autonomous action.
- Headline context is 1,048,576. The serving recommendation is 262,144. Setting `--max-model-len 1048576` is a separate, documented override, not the default advice.
- Serving needs the `aleph-alpha-inference` plugin. PyPI 1.0.0, uploaded October 3, 2026, pins vLLM to 0.29.x. A stock vLLM install is not enough.
- Omniscience on their own table is negative, and worse than the Qwen3.6 row they published beside it.
- No public API price was on the card or the launch post.

## When to pick it

Pick it when the work is German and English, you can hold the weights, and a human still reviews the result. Use 262,144 as the serving budget unless you have a reason to take the documented extension. If you need a hosted token price before you commit, this release does not give you one.

## Sources

- Model card: https://huggingface.co/Aleph-Alpha/Kolibri-1
- Launch post, October 3, 2026: https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/
- Hub record created October 2, 2026: https://huggingface.co/api/models/Aleph-Alpha/Kolibri-1
- Plugin: https://pypi.org/project/aleph-alpha-inference/
