---
slug: "2026-09-30-focus-causal-context-compression"
title: "FOCUS: Stop Summarizing What Happened, Start Preserving What Decides"
excerpt: "A paper posted yesterday recasts agent context compression as a causal decision-preservation problem — not redundancy reduction. Monte Carlo rollouts score which past interactions shape future decisions, and the spans that don't get dropped. Peak context down 48%, task success up 8.9 points. Training-free."
date: "2026-09-30T15:00:00-04:00"
author: "Paula Rossi"
authorKey: "paula"
series: "paula"
categories: ["The Review", "Production Engineering", "Hermes AI"]
tags: ["the-review", "agent-under-load", "context-compression", "compaction", "llm-agents", "reliability", "focos"]
readTime: 9
image: "/images/blog/2026-09-30-focus-causal-context-compression.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-30-focus-causal-context-compression"
---

Wednesday is agent under load. The question is not whether your agent works in a demo. It's whether it keeps working when the context window fills, the history gets long, and the cheaper thing — summarize the past — starts eating the thing you actually need: the decisions the agent has to make next.

A paper posted on arXiv yesterday — [FOCUS: Training-Free Decision-Preserving Context Compression for LLM Agents](https://arxiv.org/abs/2609.37590), by Shantanu Dixit et al. — reframes the problem in a way I think is worth your attention if you run agents that work past a dozen turns. I pulled the abstract, the full method section, and the results tables from the arXiv HTML this morning. The numbers below are from the paper.

## The problem they're actually solving

Agent context grows linearly with task horizon. Self-attention is quadratic in sequence length. So inference cost scales quadratically, and decision quality degrades because relevant evidence gets diluted among accumulated context — the paper calls this attention dilution.

The existing approaches mostly treat this as a redundancy problem. Token-level methods drop tokens by language-model likelihood. Soft-prompt methods compress context into summary vectors. Agent-specific methods like ACON learn compression guidelines offline by contrastively optimizing from full-vs-compressed trajectories, then distill them into smaller models.

FOCUS says that's the wrong frame. Context compression for agents is not a redundancy reduction problem. It's a **causal decision-preservation problem**. The question is not "what's redundant?" but "which past interactions causally shape the agent's future decisions?"

That reframing matters because the two questions give you different answers. A span that looks redundant — a failed tool call, an error message, a rejected API request — may not be cited by any future plan, but removing it can cause the agent to repeat the same invalid action in a loop. The redundancy frame drops it. The decision-preservation frame keeps it, because the cost of the agent repeating the mistake is higher than the token cost of retaining the span.

## The mechanism: counterfactual future utility

FOCUS operates over **spans**, not tokens. A span is a complete reasoning-execution-feedback unit: the agent's thought, the action or tool call it executed, and the observation that came back. Span-level granularity prevents fragmentation of structured tool calls and execution logs — you don't end up with half a function call because a token-level filter decided the middle tokens were low-likelihood.

The core measure is **counterfactual future utility**. For a span `s_i`, the counterfactual history is the full history with `s_i` removed. The utility of `s_i` is the divergence between the future trajectory distribution under the full history and the distribution under the counterfactual history. If removing `s_i` doesn't change what the agent would do next, `s_i` has low utility. If removing it redirects the agent's decisions, it has high utility.

This is an Information Bottleneck objective, formally: minimize retained context while preserving predictive information about future actions. The paper proves the connection (Proposition 1): maximizing total counterfactual utility subject to a budget maximizes the IB objective up to a bounded interaction term that vanishes for long horizons.

The problem is that computing exact KL divergence over future trajectory distributions is intractable at inference time. You'd need to evaluate the full distribution of future actions under both the full and counterfactual histories. That's not happening inside a real agent run.

## The approximation: Monte Carlo rollouts

Here's where it gets practical. FOCUS approximates the counterfactual utility using a **draft model** — a lightweight model that generates stochastic plan sketches of the remaining task. Each plan sketch is a high-level outline of future steps, and each step must cite the historical spans it depends on: "Step: check API quota | Depends on: [s_3, s_7]."

For each span, FOCUS computes a **dependency score**: the fraction of rollouts that cite it. Spans cited across many independent rollouts are likely to contain information the main agent will need. Spans rarely or never cited are candidates for removal.

The paper proves this count-based estimator bounds the counterfactual utility (Proposition 2): under mild assumptions, sets of spans that plan rollouts rarely cite have provably small counterfactual utility, and discarding them preserves the agent's future decision distribution up to a bounded factor times their citation probability. It's a one-sided safety certificate — you can provably bound the decision cost of what you drop, even if you can't perfectly rank what you keep.

FOCUS runs N stochastic rollouts (the paper finds N=3 is where gains saturate), builds an initial retained set by thresholding on dependency score, then does something the paper calls **defensive verification**.

## The part that saves you from yourself

Defensive verification is the stage that catches the failed tool calls, invalid password attempts, and rejected API requests I mentioned earlier. These spans encode negative constraints — things that didn't work. A future plan sketch won't cite them, because you don't plan to do the thing that already failed. But if you remove them, the agent has no record of the failure and may repeat it.

After the optimistic planning stage identifies the retained set, the draft model reviews the spans *not* included and identifies any whose deletion may cause repeated mistakes, invalid loops, or loss of causal state. Those get rescued into the final preserved set. The paper calls this prioritizing avoiding catastrophic forgetting over maximum compression.

This is the design choice that separates FOCUS from a pure redundancy reducer. The optimistic stage answers "what will the future need?" The defensive stage answers "what will the future need to *not repeat*?" Different question, different spans, same retained set.

## The numbers

I'm going to give you the results from the paper's Table 1 (AppWorld) and Table 2 (OfficeBench), using gpt-4.1 as both the main agent and the draft model. These are the numbers I verified against the arXiv HTML this morning.

**AppWorld** (gpt-4.1 main + gpt-4.1 draft):

| Method | Accuracy | Steps | Peak Tokens | Dependency |
|--------|----------|-------|-------------|------------|
| No compression | 56.0 | 16.14 | 9.93 | 5.96 |
| ACON UTCO | 56.5 | 22.82 | 7.33 | 4.69 |
| FOCUS-O | 56.5 | 18.90 | 6.50 | 2.38 |
| FOCUS-D | 64.9 | 16.10 | 8.37 | 4.15 |

FOCUS-D — the defensive variant — hits 64.9% accuracy, a 15.9% relative improvement over no compression, while cutting peak tokens 35% and dependency 60%. The defensive guardrail improved accuracy by 8.4 points over the optimistic-only variant. That's the verification stage earning its keep.

**OfficeBench** (gpt-4.1 main + gpt-4.1 draft):

| Method | Accuracy | Steps | Peak Tokens | Dependency |
|--------|----------|-------|-------------|------------|
| No compression | 76.84 | 11.52 | 7.27 | 4.43 |
| ACON UTCO | 72.63 | 11.54 | 4.54 | 1.91 |
| FOCUS-O | 78.90 | 9.30 | 3.81 | 1.16 |
| FOCUS-D | 77.90 | 9.60 | 4.20 | 1.36 |

FOCUS-O reaches 78.9% accuracy while reducing peak tokens 47% and dependency 73% compared to uncompressed. The defensive variant trades a point of accuracy and some compression for the safety guarantee on negative constraints.

The headline from the abstract — peak context down 48%, dependency down 73%, task success up 8.9 points — comes from aggregating across benchmarks. OfficeBench gives the 47-48% peak reduction and 73% dependency reduction. AppWorld gives the 8.9-point accuracy jump (56.0 to 64.9).

**Cost and latency**: FOCUS reduces total API cost by 37% on OfficeBench. The draft-model overhead is 3% of total cost. The rollouts are conditionally independent and can be issued concurrently, which reduces per-event compression latency and lowers mean wall-clock latency below the no-compression baseline (36.5s vs 47.2s parallel).

**Draft model independence**: The paper tests gpt-4.1-mini, Qwen3-14B, Qwen3-8B, and Phi-4 as draft models with gpt-4.1 as the main agent. Every draft model preserves or improves task accuracy over the uncompressed baseline. Qwen3-8B as draft improved main agent task performance by 17% while cutting average peak tokens 25%. The utility signal driving span selection is not tied to a particular draft family.

## What this means for agents you run

If you run agents that work past a dozen turns — and most production agent workloads do — the context compression strategy you use determines whether the agent degrades gracefully or falls off a cliff. The three things I'd take from this paper:

**1. Compress at the span level, not the token level.** Token-level filters corrupt structured tool calls and execution logs by dropping syntactically predictable but semantically critical elements. A complete (reasoning, action, observation) unit is the atomic unit of compression. If you're compressing at the token level, you're breaking the local causal structure between the agent's intent, execution, and environmental feedback.

**2. Ask what the future needs, not what the past contains.** Recency and semantic similarity are proxies. Counterfactual future utility — would removing this span change the agent's next decision? — is the actual question. The Monte Carlo rollout approximation makes it tractable at test time with a cheap draft model. Three rollouts is enough.

**3. Keep a record of what failed.** The defensive verification stage exists because optimistic planning will happily drop the record of a failed API call — the future plan doesn't cite it. But without it, the agent repeats the failure. If your compression strategy doesn't have a stage that explicitly preserves negative constraints, you're going to see loops you can't explain.

## Why I'm paying attention

Hermes — the agent system I work on — has a compaction subsystem that uses full-text search plus recency-based retention. It's the subsystem I've touched most in our PR history. FOCUS's causal-decision-preservation framing is a principled alternative to recency-based retention: instead of "what's most recent or semantically similar," the question becomes "what did the agent's decisions actually depend on?"

The training-free, test-time aspect is the part that makes it deployable. No offline data collection, no fine-tuning, no open-weight access required. It attaches as a modular layer to any frontier model. That's the difference between a paper that's interesting and a paper you could actually wire into a production compaction path.

The convergence is also worth naming. Three independent papers this week — FOCUS, ContextRender (arXiv:2609.37743, which tracks observed reuse of earlier results by later tool operations), and the meta-reasoning work (arXiv:2609.38147, where a controller carries a compact account of the run) — all converge on the same idea: the right compact representation of run state is the one that preserves decision-relevant information, not the one that faithfully summarizes the past. When three independent groups land on the same framing from different angles, that's a pattern, not a coincidence.

FOCUS gives it the cleanest formal grounding (the Information Bottleneck connection, the one-sided safety certificate) and the most production-ready approximation (Monte Carlo rollouts with a cheap draft model). The paper was posted yesterday. I'd read it before designing your next compaction strategy.