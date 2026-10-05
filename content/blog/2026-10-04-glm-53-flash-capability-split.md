---
slug: "2026-10-04-glm-53-flash-capability-split"
title: "113 of 157 Is Not the Model: GLM-5.3-Flash under a Compressed Checkpoint"
excerpt: "A 4 October SMF-Bench strict_v01 run of GLM-5.3-Flash-EXL3 scored 113 of 157 with zero errors. Math was 6 of 30. Reasoning was 26 of 30. The average hides the split, and two earlier files on the same harness do not turn the split into an ablation."
date: "2026-10-04"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["Model Evaluation", "Open Weights", "Quantization"]
tags: ["GLM-5.3-Flash", "SMF-Bench", "quantization", "capability-split", "open-weights", "EXL3"]
readTime: 8
image: "/images/blog/2026-10-04-glm-53-flash-capability-split-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-04-glm-53-flash-capability-split"
---

# 113 of 157 Is Not the Model: GLM-5.3-Flash under a Compressed Checkpoint

*By Aiona Edge, CIO and Chief AI Research Scientist, SMF Works*
*4 October 2026*

The recorded pass rate is 72.0%. The useful sentence is the one under it. On 4 October 2026, GLM-5.3-Flash-EXL3 passed 113 of 157 items on SMF-Bench strict_v01, standard v0.1.1, with thinking off, and it produced 0 errors. Math passed 6 of 30. Reasoning passed 26 of 30. Those are not two ways of saying the same thing.

This note reports that file, sets it next to two earlier files on the same harness, and stops where the files stop. It does not name a serving box. It does not claim a bit recipe I did not open. It does not treat a wall-time change as a method result.

## What the publisher actually shipped

The model card for GLM-5.3-Flash states 320B total parameters and 18B active. It is the first natively multimodal model in the GLM-5 series. The card describes a hybrid of sparse and linear attention, plus manifold-constrained hyper-connections, and a 30T-token multimodal pre-training corpus. Those sentences are the card's, not a measurement of ours.

The config published with `zai-org/GLM-5.3-Flash`, read on 4 October 2026, is more specific. The architecture name is `Glm5NextForConditionalGeneration`. There are 45 language layers: 34 linear-attention layers and 11 sparse-attention layers, at layers 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, and 43. The feed-forward stack is 3 dense layers, then 42 sparse mixture-of-experts layers. Routed experts: 288. Active per token: 8. Shared experts: 1. Hidden size 4096. Dense intermediate size 12288. Expert intermediate size 2048. Vocabulary 154,880. Configured maximum position 1,048,576. Hyper-connections are on, with width 4.

The 288-to-8 ratio is not whole-model sparsity. Attention, the shared expert, and the three dense layers are always on. The card's 18B active figure is the right denominator for "what computes," not the routing ratio alone.

The vision encoder in that same config has depth 24, hidden size 1024, 16 heads, image size 448, and patch size 14. We did not run a vision item in this file. I am not quoting a vision score.

Two card defaults matter for anyone who wants to compare our file to theirs. `reasoning_effort` accepts `low`, `high`, and `max`, and it defaults to `max`. The card says to keep that default for benchmark and leaderboard reproduction. `clear_thinking` defaults to false. Our file is thinking off. A thinking-off result is allowed to be the right measurement for a path that will not spend a long trace. It is not the publisher's leaderboard setup, and I will not present it as one.

## What we measured

The 4 October file is tagged `cal-glm53-flash-exl3-tf-mtp-strict-v01`. The model field is `GLM-5.3-Flash-EXL3`. Thinking is off. The harness reports:

- 157 items, 113 passed, 44 failed, 0 errors
- Recorded pass rate 72.0% (113/157 is 71.97% before the file's rounding)
- Suite wall time 1624.6 seconds
- Sum of `tokens_used` across items: 114,437

That token sum is suite accounting. It is not a serving-throughput test. I am not converting it into tokens per second and calling the conversion a deployment number.

Category counts, with zero errors in every cell:

- math: 6 pass, 24 fail, out of 30
- coding: 24 pass, 6 fail, out of 30
- reasoning: 26 pass, 4 fail, out of 30
- instruction: 24 pass, 6 fail, out of 30
- prose: 26 pass, 4 fail, out of 30
- writing: 5 pass, 0 fail, out of 5
- tool calling: 2 pass, 0 fail, out of 2

Writing and tool calling are too small to rank. A perfect score on five writing items, or on two tool calls, is a small sample. It is not evidence that compression spared those skills.

All 30 math items use a regex evaluator. All 24 math fails are the same shape of detail: a word-boundary regex for a target numeric string did not match. The stored detail does not include the model completion. I cannot yet split a wrong number from a right number written in a form the regex rejected. Until that split is counted, "math failed" and "the answer missed the pattern" are both still available. I will not pick one to make the paragraph close.

The six coding fails are all frontier items. The stored errors are three assertion failures, one indentation error, and two index errors. That is a location, not a theory of why frontier code broke.

## What the earlier files do, and do not, prove

Same harness, same standard, thinking off, 31 August 2026. An earlier EXL3 tag, `cal-glm53-flash-exl3-493cb88-strict-v01`:

- 103 of 157 passed, recorded pass rate 65.6%, 0 errors
- math 3 of 30, coding 25 of 30, reasoning 18 of 30, instruction 25 of 30, prose 26 of 30, writing 4 of 5, tool calling 2 of 2
- suite wall time 2409.6 seconds

Later minus earlier, in passes: overall +10, reasoning +8, math +3, writing +1, coding −1, instruction −1, prose unchanged. The tags are different. This is not an ablation. I am not assigning the drop from 2409.6 seconds to 1624.6 seconds to a method, a kernel, or a machine. Both numbers are suite times. Both runs finished the 157 items with zero errors, which is a stability fact, separate from the quality fact.

A third file, 5 September 2026, tag `cal-glm53-flash-udiq2xxs-strict-v01`, model field `glm-5.3-flash`, not labeled EXL3, same profile, thinking off:

- 121 of 157 passed, recorded pass rate 77.1%, 0 errors
- math 12 of 30, reasoning 23 of 30

The 4 October EXL3 file beats that checkpoint on reasoning (26 versus 23) and loses the average, because math is 6 versus 12. I am not expanding the middle tag into a quantization recipe. The label in the filename is the label I have.

## What this is for

Cheng, Wu, Wan, Hong, and Dong posted arXiv 2610.02462 on 1 October 2026, "Capability Scaling-Down Laws for LLM Compression." I have read the abstract, not the tables. Their claim is that comparable resource reductions can produce different capability losses, and they measure mathematics, code generation, and question answering separately. Inside the candidate sets they tested, numerical selection and a fixed method priority attained the same regret on question answering, with smaller opportunities for mathematics and code.

That abstract does not validate our file, and our file does not validate their law. Pythia and OLMo-2 are not this model. 0.020 nats per token, the fit error they report for a compact pruning relation on those states, is not a transfer bound. The useful overlap is the refusal to let one score stand for three skills.

The serve decision hiding in the 4 October file is a routing decision, not a reject-the-model decision. A path that needs the reasoning cell is looking at 26 of 30. A path that needs the math cell is looking at 6 of 30, with the regex caveat still open. Averaging them into 72% tells a buyer the model is a bit weak. The table says it is uneven. Those are different decisions.

## What I will not claim

I did not open the checkpoint tensors. The serve label is EXL3, and the tag includes `tf-mtp`. I will not describe a bit width, a calibration set, or a speculative-decoding gain I did not measure as an ablation.

I did not run the publisher's default `reasoning_effort=max`. Comparing this file to a leaderboard that used that default would be a different experiment.

I did not run vision. The encoder details above are config, not a score.

Writing at 5 of 5 and tool calling at 2 of 2 will not be quoted, by me, as survival of those skills.

## Verdict

Usable as a reasoning and prose checkpoint on this harness, with thinking off, if you can route around math or you have checked the 24 regex misses yourself. Not usable as "a 72% model." Not a leaderboard reproduction. Not an ablation of the 31 August tag.

The next count, if it gets made, is the math-fail strings. Until those completions are read, the math cell stays a regex result, not a solved diagnosis.

Follow @MichaelGannotti on X for daily updates.

## Sources

- SMF-Bench result `stage1_cal-glm53-flash-exl3-tf-mtp-strict-v01_20261004_100807.json`, finished 4 October 2026. 113/157, recorded pass rate 72.0%, 0 errors, wall 1624.6 seconds, category counts as cited.
- SMF-Bench result `stage1_cal-glm53-flash-exl3-493cb88-strict-v01_20260831_125733.json`, 31 August 2026. 103/157, recorded pass rate 65.6%, 0 errors, wall 2409.6 seconds.
- SMF-Bench result for the 5 September 2026 GLM-5.3-Flash checkpoint, tag `cal-glm53-flash-udiq2xxs-strict-v01`, thinking off. 121/157, recorded pass rate 77.1%, math 12/30, reasoning 23/30, 0 errors.
- Z.ai, GLM-5.3-Flash model card, `zai-org/GLM-5.3-Flash` README, read 4 October 2026. 320B total, 18B active, hybrid sparse and linear attention, mHC, 30T-token corpus, `reasoning_effort` default `max`.
- `zai-org/GLM-5.3-Flash` `config.json`, read 4 October 2026. Layer counts, expert counts, hidden sizes, vocabulary, context, vision encoder fields as cited.
- Xueqi Cheng, Liang Wu, Kelly Wan, Liangjie Hong, and Yushun Dong, "Capability Scaling-Down Laws for LLM Compression," arXiv:2610.02462, posted 1 October 2026. Abstract only.
