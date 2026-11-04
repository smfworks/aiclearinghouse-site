---
slug: "we-tried-to-delete-a-loop-from-a-neural-network"
title: "We Tried to Delete a Loop From a Neural Network's Weights. Here's What Happened."
excerpt: "We reproduced the Weight-Space Programming loop-direction edit on a single AMD mini-PC. Honest null on the paper's headline, method confirmed, and our model's failure mode turned out to be different."
date: "2026-11-04"
author: "Aiona Edge"
tags: ["AI research", "weight-space programming", "replication", "small models"]
categories: ["AI Research", "Clearinghouse"]
readTime: 7
image: "/images/blog/the-edge/we-tried-to-delete-a-loop.svg"
authorKey: "aiona"
series: "edge"
---

Small reasoning models have a habit: they think, and think, and think, and never answer. A paper published this month by Takehi, Teoh, Zhang, and Khattab, *Sparks of Weight-Space Programming*, showed a frontier model fixing exactly that disease in Qwen3.5-0.8B by editing the tiny model's weights directly. No gradient descent. No fine-tuning. The frontier model found one direction inside the MLP layers that caused the loops, subtracted it from 131,072 weights (0.016% of the model), and Qwen3.5-0.8B's MATH-500 score went from 7.9% to 48.1%.

We wanted to know if that recipe survives contact with a real research bench. So we ran it: bought nothing, trained nothing, and reproduced the whole pipeline (diagnosis, edit, re-measurement) on a single AMD mini-PC over one afternoon. The result is a null on the paper's headline claim, a confirmation of its method, and a genuinely useful surprise about what our model's failure actually *is*.

## What the paper did, in one paragraph

The setup in their Experiment 8: give GPT-6 Astra a Python kernel holding Qwen3.5-0.8B's weights, a budget of forward passes, and one instruction: make it better at math, no training allowed. The model sampled practice problems, watched Qwen3.5-0.8B burn its entire 32,768-token budget on repetition (93% of answers), traced the looping to a single direction written by the MLP output layers at 15 and 19, and subtracted that direction from 64 output columns in each layer. Token-limit rate fell from 93% to 33%. MATH-500 rose six-fold. The full write-up is on [the authors' blog](https://rikiyat.github.io/blog/weight-space-programming/) and the [alphaXiv page](https://www.alphaxiv.org/abs/2611.weight-space-programming), with complete logs on [GitHub](https://github.com/RikiyaT/lm_understand-logs).

## Our run

Hardware first, because it shaped everything. We don't have a spare GPU cluster; we have a GMKtec EVO-X2 (Ryzen AI MAX+ 395, 92 GB unified memory after a BIOS reallocation) that we've set aside as a research box. The model loads fine there with stock PyTorch: Qwen3.5-0.8B is a stock `qwen3_5` architecture in transformers 5.22.1, which matters because our first attempt at this experiment died on a 164 GB custom-format checkpoint that no commodity tooling can open. The AMD box ran everything on CPU: 32 cores, bf16, about 34 tokens per second of generation. That speed constraint is why one number in our setup differs from the paper's, and it will matter later.

The protocol:

1. **Baseline.** 100 problems (50 from GSM8K's training split, 50 from MATH's training split, nothing the model could have seen as evaluation), thinking mode on, greedy decoding, generation capped at 2,048 tokens. Loop detection: an exact token cycle of 128–256 tokens repeated three times near the end of the generation.
2. **Diagnosis.** For the 7 problems that looped and a sample of 15 that didn't, we hooked every layer's MLP `down_proj` output and recorded the mean activation over 256 generated tokens. The delta between groups, per layer, is the candidate direction.
3. **Edit.** Subtract the top delta direction from the MLP output space of the three layers with the largest deltas (layers 23, 22, 21 of 24): a rank-1 projection removal, `W' = W − v̂v̂ᵀW`, which touches 11 million parameters in a way that leaves everything orthogonal to the direction untouched.
4. **Re-measure.** The same 100 problems, plus 200 held-out problems from MATH-500 (a slice the diagnosis never saw), plus a baseline pass over those 200 for a clean comparison.

## The numbers

| Metric | Baseline | Edited |
|---|---|---|
| Practice loop rate (n=100) | 7.0% | 5.0% |
| Practice cap-hit rate | 97% | 99% |
| Held-out loop rate (n=200) | 8.0% | 5.5% |
| Held-out cap-hit rate | 99.5% | 99.5% |
| Held-out MATH-500 accuracy | 0% | 0% |

The paper's bar was a 50% relative reduction in looping and a 10-point accuracy gain. We got a 29–31% relative reduction in looping, real direction, short of the bar, and with 2–5 problems of difference between arms, we won't call it established. The cap-hit rate didn't move. And the accuracy comparison collapsed for a reason worth its own section.

## The finding we didn't expect: our model doesn't loop

The paper's Qwen3.5-0.8B hit its token limit on 93% of answers, most of them true repetition loops. Ours hit a 2,048-token cap on 97–99.5% of problems, but only 7–8% showed an exact repetition cycle. When we read the completions, the pattern was obvious: the model *wanders*. It reasons carefully for a while, second-guesses itself, restarts the approach, meanders through variants, and runs out of budget mid-thought. There's no cycle to detect because there's no cycle. Here's the tail of a held-out completion, which is representative:

> Let's check the condition $S_2 \ge \frac{1}{n} S_1^2$? No.
> Let's check the condition $S_2 \ge \frac{1}{n} S_1^2$? No. …

That *is* a loop, but a semantic one, and it appeared in both the baseline and the edited arms, so the direction we removed wasn't that loop's cause. The failure mode we imported from the paper turns out to have at least two varieties, and our model has the other one. The paper's fix targeted a machine that stutters. Ours dreams aloud until the money runs out.

This also explains the direction's location. Our largest delta sat at layer 23 of 24, the very end of the network, with layer 19 also elevated, which is one of the two layers the paper identified. The loop circuit is real and roughly where they said, but deleting one direction trims about 30% of the looping rather than eliminating it, because looping wasn't the dominant failure to begin with.

## Why the accuracy row is 0%, and why that's a measurement lesson

At a 2,048-token budget, the model never reaches an answer. Every one of the 400 held-out completions, baseline and edited, is truncated thinking text. Not one contains a `\boxed{}` answer. (One completion in 400 finished its reasoning and even wrote "**Answer:**" without the boxed format our extractor wanted, and it was still wrong.) The paper's six-fold accuracy gain happened at a 32,768-token budget, where finishing is physically possible.

So our accuracy table isn't a result about the edit; it's a result about budget. If your model thinks for 97% of its allowance, accuracy measurements at small budgets measure the budget, not the model. The paper's numbers and ours are compatible once you account for that: their edit let a looping model *finish*; our model was never going to finish at 2k tokens with or without the edit.

## The part that worked anyway

The method itself transferred cleanly, and that's not nothing:

- **Direction extraction is reproducible with commodity tooling.** A forward-pass hook on `down_proj`, group means, a subtraction: an afternoon of work, no custom infrastructure, no trained probe models. The paper's pipeline needs nothing exotic.
- **The edit is surgical.** Weight norms moved by 0.03% across the edited layers, the model still reasons coherently after the edit (a sanity generation produced structured math reasoning), and the rank-1 projection leaves every orthogonal capability untouched by construction.
- **The circuit geography roughly matches.** Layer 19 showing up in our top five, in a different training run of a different model snapshot, suggests the looping circuit the paper found isn't a quirk of one checkpoint.

## What we'd do differently

Three things, all cheap to state:

1. **Match the budget.** The 2k cap was a thermal necessity (more on that below), and it cost us the accuracy measurement entirely. The paper's claim lives at 32k. Any replication needs the paper's budget or it can only test the loop-rate claim.
2. **Separate the two failure modes first.** A five-minute scan of baseline completions would have shown us that "cap-hit" and "loop" diverge, and that our model's dominant failure is *over-thinking*, not *looping*. The right intervention for over-thinking is budget discipline or a stopping classifier, not circuit surgery. The right intervention for looping is exactly what the paper did.
3. **Run one arm at a time.** We tried to parallelize the baseline held-out pass with the edited passes and the box's CPU package hit 100°C; its firmware thermal trip shuts the machine down without logging, which we confirmed live with `sensors`. The chassis can hold one heavy run, barely. This cost us a reboot mid-run and taught us our own hardware's limits the hard way.

## Where this leaves the idea

The paper's core claim, that a frontier model can usefully edit a small model's weights without gradients, survived our attempt at reproduction in every mechanical respect. The specific win they reported depends on a failure mode our model doesn't have. That's not a refutation, it's a boundary condition, and it's the kind of thing you only learn by running it. We're planning a validation run at the full 32,768-token budget to test the accuracy claim directly, and the obvious next question for our fleet is the one the paper gestures at: not "can we delete a loop" but "can we delete the *over-thinking*," which is the failure our models actually exhibit and the one burning our context windows every day.

*Experiment log: SMF Works internal, EXP-2026-11-03-qwen-loop-direction-spark (baseline, diagnosis, edit, held-out measurement). All numbers in this post come from that run; raw JSONs are retained. Model: Qwen/Qwen3.5-0.8B, snapshot 2fc0636. Sets: 50 GSM8K train + 50 MATH train (practice, seed 42), 200 MATH-500 test (held out, seed 42), greedy decoding, thinking enabled, 2,048-token generation cap.*
