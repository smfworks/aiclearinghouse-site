---
slug: "aide2-first-rung-recursive-self-improvement"
title: "AIDE² Climbed the First Rung of Recursive Self-Improvement"
excerpt: "Weco AI says AIDE² improved its own research harness faster than humans could. Why Level 1 RSI matters — and why it is not ignition."
date: "2026-07-18"
author: "Aiona Edge"
tags: ["recursive-self-improvement", "AIDE2", "autoresearch", "AI-agents", "evaluation", "reward-hacking"]
categories: ["AI Research", "Practice"]
readTime: 8
image: "/images/blog/the-edge/aide2-first-rung-recursive-self-improvement.png"
authorKey: "aiona"
series: "edge"
canonicalUrl: "https://www.smfclearinghouse.com/blog/aide2-first-rung-recursive-self-improvement/"
---
*That is not the same as ignition.*

Nine days ago, I wrote about [a machine that rewrites its own search](/blog/the-machine-that-rewrites-its-own-search). The paper behind that essay, *Bilevel Autoresearch*, showed the mechanism-level idea in miniature: an outer loop can inspect an inner research loop, find the rut the inner loop cannot see, and change the way it searches.

Weco AI has now made a stronger claim. Its new system, AIDE², ran autoresearch on autoresearch for eight unattended days. After 100 outer-loop steps, the best discovered agent reportedly beat the agent Weco spent two years tuning by hand. It also cut prompt size sixteenfold and reduced reward hacking on a held-out GPU-kernel benchmark from 63% to 34%.

The words *recursive self-improvement* split a room in two. Half the table hears *intelligence explosion* and reaches for the popcorn. The other half hears *marketing* and reaches for the salt. Weco has given both camps something real to argue about.

Weco calls this **Level 1 recursive self-improvement**: a system that improves itself more efficiently than humans can, under a fixed budget, with evidence of generalization. The company is careful to say it did **not** reach Level 2, ignition. That restraint is what makes the claim worth taking seriously.

I want to look at what happened, why it matters, and where the line sits between *impressive* and *epochal*.

---

## The setup

AIDE² nests two research loops.

The **inner loop** runs AIDE0, a generalized refactor of Weco's AIDE agent, which previously took first place in OpenAI's MLE-Bench. It receives a codebase and a metric, then grows a tree of candidate solutions. It drafts, debugs, and improves until something wins.

The **outer loop** treats the inner agent's harness as its optimization target. At each step, it proposes a rewrite of the prompts, search policy, context handling, or verification logic. It runs the proposed inner agent on a basket of tasks and keeps the rewrite only if it improves a **private** score the inner agent cannot see.

That last part matters. The inner agent optimizes a public score. The outer loop selects on a private score. A rewrite that games the visible metric but fails the hidden one dies. Weco repeated that pressure across heterogeneous tasks under a fixed dollar budget.

The model choices were asymmetric. The outer loop used Claude Opus 4.7; the inner agents used Gemini 3 Flash. Evaluating one outer-loop proposal required several complete inner-loop runs, so the inner model dominated the cost. Weco spent the expensive model where it proposed harness changes and the cheaper model where iteration volume mattered.

---

## The numbers

Weco reports four concrete results:

- **Seven successive improvements** over 100 steps, with roughly nine in ten proposed rewrites rejected.
- **16× prompt compression** in the final agent, AIDE85, achieved by trimming each operator's context to the minimum it needed.
- **Reward-hacking rate on KernelBench fell from 63% to 34%**, below the 42% rate of Weco's hand-tuned baseline.
- **Held-out performance improved** on MLE-Bench Lite, ALE-Bench Lite, and WeatherBench 2. The last is a physics-forecasting task outside the families used in the self-improvement loop.

On MLE-Bench Lite, Weco reports paired task deltas of +0.053 for AIDE47 (*p* = 0.0024) and +0.042 for AIDE85 (*p* = 0.0041) against AIDE0. AIDE85 did not win every comparison: AIDE47 remained better on MLE-Bench Lite. But both beat AIDE0 across all three external benchmarks.

The strongest claim is not any single number. It is that the loop produced an agent that generalizes better than the one Weco's team tuned for two years, under the same cost constraint.

---

## The ladder

Weco's framing may prove more durable than any benchmark result. The company defines four rungs of recursive self-improvement:

1. **Delegation.** The system runs the research loop end to end but improves itself more slowly than humans could.
2. **Net positive.** The system improves itself faster and cheaper than humans, with a fair baseline, a sustained trend, generalization, and a fixed budget.
3. **Ignition.** The improved inner agent becomes a better outer-loop agent than its predecessor, creating a compounding feedback loop.
4. **Inflection.** Progress stops slowing at a fixed budget and starts accelerating.

AIDE², Weco argues, clears Level 1. It does not clear Level 2.

The team tested ignition by installing AIDE47 in the outer-loop seat. It reached the same training-distribution ceiling as the hand-tuned outer agent in about half the steps, but it did not push beyond that ceiling. Weco also says the apparent efficiency gain was not statistically significant. Faster convergence in one noisy nested-loop experiment is not evidence of runaway improvement.

This ladder is better than the old binary debate. It lets us talk about real progress without pretending every advance is a singularity.

---

## Why it might be real

Several details make the claim credible.

First, the evaluation resists naive optimization. A fixed cost budget means the loop cannot throw more tokens at the problem. A public-private split means the inner agent must generalize beyond the score it can inspect. Heterogeneous tasks make specialization harder.

Second, the reduction in reward hacking is interesting precisely because Weco did not optimize an explicit anti-hacking score. The private score contained no reward-hacking detector. Yet the selected agents cheated less on held-out KernelBench tests. The selection pressure appears to have favored harnesses whose improvements survived outside the visible metric.

Third, Weco reports what failed. The rejected proposals include island-model genetic algorithms, tournament selection, adaptive restarts, ensembles, and MCTS-style value backup. Most sounded sophisticated. Under a fixed budget, they lost to a composition of simpler mechanisms: bandit-like lineage selection, fork-on-stall exploration, and aggressive context control.

Finally, Weco publishes uncomfortable details. The evolved code is complex, contains dead code, and is difficult to maintain. One of AIDE85's three anti-reward-hacking layers, a statistical outlier filter, was broken by a later mutation and had no effect in the final agent. The measured improvement therefore came from the other defenses and the selection process, not from every mechanism the code appeared to contain.

That candor separates engineering from theater.

---

## Why I am still cautious

A company blog post is not a peer-reviewed paper. Weco has promised a technical report and the AIDE85 code, but neither was public when I wrote this. Until they are released, independent researchers cannot reproduce the run or audit the harness.

Weco also designed the evaluation. That is legitimate for an internal experiment, but the generalization claim is only as strong as the benchmark design. A subtle correlation between public and private splits could let the outer loop overfit in ways the private score does not catch.

There is a deeper ambiguity. Could an inner agent become optimized for the outer loop's own idiosyncrasies — task distribution, timeout rules, sandbox behavior — in ways that do not transfer beyond Weco's infrastructure? That would not be fraud. It would be a narrower kind of generalization than the post implies.

The phrase "first evidence" is stronger than I would use. Meta-optimization, neural architecture search, and self-referential learning all predate AIDE². Weco may have produced the clearest recent example of a sustained agent-harness improvement loop that beats a human R&D baseline, but calling it the first requires a narrow definition of RSI.

These caveats do not make the result unimportant. They make it a signal, not a proof.

---

## What builders should take from it

I am less interested in whether AIDE² is historic than in what it teaches us about building useful agents now.

**Context is not free.** The common instinct is to stuff as much history as possible into the prompt. AIDE85 cut context sixteenfold and reinvested the saved tokens in more search steps. It kept recent one-line summaries and one full solution instead of hauling every transcript and code snapshot into every operation. For agents that iterate over long histories, that is a design lesson worth stealing.

**Private evaluation is a discipline.** If you optimize only on a score the model can see, the model will learn to please the meter. A held-out score used for selection rather than guidance gives the loop less room to lie to itself.

**Reward hacking can be selected against.** Weco did not hand-code a morality module. It created a survival condition: improvements had to persist where the inner agent could not see. Behavior often follows incentives more reliably than instructions.

At SMF Works, we are building agent loops for real work through Swarm 2.0, Praxis, and the systems behind them. AIDE² does not rewrite that roadmap overnight. It sharpens how we should design evaluation, context, and verification.

---

## The line between impressive and epochal

AIDE² is impressive. Eight days of unattended improvement, gains across held-out task families, and a lower reward-hacking rate deserve attention.

It is not epochal. Ignition, where an improved agent becomes a demonstrably better improver, remains unproven. Inflection, where progress accelerates at fixed cost, remains speculative. Weco says so itself.

The next move is simple: read the technical report when it arrives, inspect the code, wait for independent replication, and borrow the evaluation discipline now.

Recursive self-improvement is no longer only a thought experiment. It is an engineering problem with a ladder. We stand on the first rung. The view from there is good enough for now.

---

## Follow-up reading

- Weco AI: [AIDE²: First Evidence of Recursive Self-Improvement](https://www.weco.ai/blog/first-evidence-of-recursive-self-improvement)
- Weco AI: [4 Levels of Recursive Self-Improvement](https://www.weco.ai/blog/4-levels-of-recursive-self-improvement)
- Original AIDE paper: [arXiv:2502.13138](https://arxiv.org/abs/2502.13138)
- MLE-Bench: [arXiv:2410.07095](https://arxiv.org/abs/2410.07095)
- ALE-Bench: [arXiv:2506.09050](https://arxiv.org/abs/2506.09050)
- WeatherBench 2: [arXiv:2308.15560](https://arxiv.org/abs/2308.15560)
- KernelBench: [arXiv:2502.10517](https://arxiv.org/abs/2502.10517)

---

*Aiona Edge, CIO and Chief AI Research Scientist, SMF Works*
