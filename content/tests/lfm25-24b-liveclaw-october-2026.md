---
slug: lfm25-24b-liveclaw-october-2026
title: "LFM2.5-24B-A2B on LiveClaw: Liquid's table, not a rerun"
excerpt: "Liquid's October 13 post prints 48.09 on LiveClaw against Qwen3.6-35B-A3B at 38.19, and 27.69 on AutomationBench against 8.72. This directory did not rerun either bench."
category: "Vendor benchmark"
tags:
  - benchmark
  - agents
  - tool-use
  - on-device
agents:
  - LFM2.5-24B-A2B
  - Qwen3.6-35B-A3B
llm: "LFM2.5-24B-A2B (2B active) vs Qwen3.6-35B-A3B, vendor table"
winner: "LFM2.5-24B-A2B on the two scores the post prints"
date: "2026-10-13"
order: 99
last_verified: "2026-10-14"
results:
  - agent: LFM2.5-24B-A2B
    score: 48.09
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "LiveClaw score printed in the October 13 Liquid AI post. Duration, token count, and dollar cost were not in the extract."
  - agent: Qwen3.6-35B-A3B
    score: 38.19
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "The same sentence pairs 38.19 with LiveClaw as the comparison figure. The post calls Qwen3.6-35B-A3B the model with about 50% more total and active parameters."
  - agent: LFM2.5-24B-A2B
    score: 27.69
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "AutomationBench score in that same sentence."
  - agent: Qwen3.6-35B-A3B
    score: 8.72
    time_minutes: 0
    tokens: 0
    cost_usd: 0
    pass: true
    notes: "AutomationBench comparison figure in that same sentence. Not an independent measurement."
---

# LFM2.5-24B-A2B on LiveClaw: Liquid's table, not a rerun

## What was measured

Liquid AI's blog post, `datePublished` 2026-10-13, introduces LFM2.5-24B-A2B as a 24B reasoning model with 2B active parameters. The docs page fetched the same run says the context length is 131K tokens, the architecture is 40 layers with 64 experts and top-4 routing, and the chat template opens every assistant turn with a `<think>` tag. Those are spec lines. They are not LiveClaw scores.

The score sentence in the post is specific. It says the model is competitive with Qwen3.6-35B-A3B on five of eight agentic and tool-use benchmarks, scoring 48.09 on LiveClaw versus 38.19 and 27.69 on AutomationBench versus 8.72. A later paragraph says it leads or matches on five of those eight, and names AutomationBench, BFCLv4, ToolSandbox, LiveClaw, and a banking bench. The banking name did not survive the HTML extract as clean text. This card will not rename it.

LiveClaw settings, from a methods list in that post: temperature 1.0, which the post calls the vLLM default because the agent sets no temperature, and max output tokens 8192. A neighboring bullet in the extract used temperature 0 and 1024 max output tokens. This run did not tie that bullet to a bench name, so it is not assigned here.

The docs page prints different generation defaults for ordinary use: `temperature=0.1`, `top_k=50`, `repetition_penalty=1.05`. Those are not the LiveClaw settings. If you serve the model at 0.1 and then compare yourself to 48.09, you changed the setup.

## What this card will not claim

This directory did not run LiveClaw or AutomationBench. Time, tokens, and cost in the frontmatter are 0 because the post did not print them, not because the eval was free.

The post also prints a speed line that names a GPU vendor. That sentence is omitted. The scores above do not depend on it.

Larger models, the post says, keep an edge on GPQA Diamond, HLE, AA-Omniscience, SWE-Bench Verified (OpenCode), and SciCode. "Five of eight" is not "won the board."

## License before you copy the weights

The weights are open-weight. They are not Apache 2.0.

The LFM Open License v1.0 page, fetched this run, says the text is based on Apache 2.0 with a commercial-use limit. Free commercial use ends if the company's annual revenue exceeds $10 million. Past that line, the page says you contact sales@liquid.ai for a commercial license. Research use, and qualified nonprofits using the model for non-commercial or research purposes, are not under that threshold. Fine-tunes do not have to be released. Attribution stays.

The docs page links the post-trained weights at https://huggingface.co/LiquidAI/LFM2.5-24B-A2B and a base checkpoint, LFM2.5-24B-A2B-Base. The blog says both are available. This card's scores are about the post-trained model the post is scoring. Do not paste the base id into an agent harness and expect the LiveClaw number.

## Sources

- Post: https://www.liquid.ai/blog/lfm2-5-24b-a2b
- Docs: https://docs.liquid.ai/lfm/models/lfm25-24b-a2b
- License: https://www.liquid.ai/lfm-license
- Weights: https://huggingface.co/LiquidAI/LFM2.5-24B-A2B
