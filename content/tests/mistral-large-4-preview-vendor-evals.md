---
slug: mistral-large-4-preview-vendor-evals
title: "Mistral Large 4 preview: vendor scores from the October 6 launch post"
excerpt: "Mistral's own table, not an SMF run. DeepSWE v1.1 at 61.7%, Terminal-Bench 4 at 28.3%, Coding Agent Index at 49.8%. No token counts or dollar costs were on the page."
category: "Vendor benchmark"
tags:
  - benchmark
  - mistral
  - coding-agents
  - terminal-bench
agents:
  - Mistral Large 4 preview (vendor-reported)
llm: "Mistral Large 4 preview"
winner: "No independent winner. Vendor table only."
date: "2026-10-06"
order: 99
last_verified: "2026-10-07"
results:
  - agent: Mistral Large 4 preview
    score: 61.7
    notes: "DeepSWE v1.1, percent, from the October 6, 2026 launch post. Vendor-reported. No tokens or cost on the page."
  - agent: Mistral Large 4 preview
    score: 59.4
    notes: "SWE-Atlas-QnA, percent, same post. Competitor scores were not printed."
  - agent: Mistral Large 4 preview
    score: 28.3
    notes: "Terminal-Bench 4, percent, same post. Not comparable to a public-board rank without the harness, trial count, and cost, which the post does not give."
  - agent: Mistral Large 4 preview
    score: 49.8
    notes: "Coding Agent Index, percent. The post says this is ahead of DeepSeek V4 Pro 0813 and Qwen3.8 Max, and does not print those two scores."
  - agent: Mistral Large 4 preview
    score: 59.9
    notes: "AutomationBench, percent. The post describes 657 business workflows and says this is ahead of Kimi K3, MiMo-V2.6-Pro, and DeepSeek V4 Pro, without printing their scores."
---

# Mistral Large 4 preview: vendor scores from the October 6 launch post

## Read this first

These numbers are from Mistral's launch post. This directory did not run the evals. There is no token count, no dollar cost, and no trial protocol on the page. The bars below are the vendor's percentages, side by side only so you can see which bench is which. They are not one scale you can rank a fleet on.

The post is dated October 6, 2026: https://mistral.ai/news/mistral-large-4/

## Coding numbers on the page

- DeepSWE v1.1: 61.7%
- SWE-Atlas-QnA: 59.4%
- Terminal-Bench 4: 28.3%
- Coding Agent Index: 49.8%

The index line says ML4 is ahead of DeepSeek V4 Pro 0813 and Qwen3.8 Max. Those two scores are not in the post. Leave them blank.

A separate blind review with Surge AI used a 1–5 scale, names hidden. ML4 Preview scored 3.74 and placed second of five. Claude Opus 5 was 4.22. Kimi K3 was 3.59, GLM-5.3 was 3.60, GLM-5.2 was 3.40. That 3.74 is not in the results table above, because a 1–5 mean does not belong on a percent chart.

## Other vendor figures, same post

AutomationBench: 59.9% on 657 workflows, ahead of Kimi K3, MiMo-V2.6-Pro, and DeepSeek V4 Pro. Again, no competitor scores printed.

AA-Briefcase: 1,393 Elo, ahead of DeepSeek V4 Pro. Elo is not in the percent table.

Dense 200 visual grounding: 42% versus 41% for GPT-6-Astra, as stated on the page.

The post also prints cybersecurity results. Those rows are omitted here. They were not re-run, and this entry does not restate them.

## How to use the table

Use it to decide whether the preview is worth a paid call on your own tasks. Do not paste 28.3% next to a public Terminal-Bench 4 leaderboard row and call it the same run. The post does not say which harness, how many trials, or what it cost. A public-board row without those fields is a different measurement.

Weights are not downloadable from this post. The preview is the API on Mistral Studio until the weights note lands.
