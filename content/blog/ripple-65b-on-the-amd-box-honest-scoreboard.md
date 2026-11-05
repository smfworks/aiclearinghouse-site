---
slug: "ripple-65b-on-the-amd-box-honest-scoreboard"
title: "We Ran the New 65B 'Local' Coding Model on a Desk-Sized AMD Box. Here's the Honest Scoreboard."
excerpt: "Ripple-65B Preview claims US open-weight SOTA on agentic coding and local inference. We got it running on an AMD box with no NVIDIA anywhere, and ran the same harness as Qwen3-Coder-30B. Quality: a tie. Speed: not even close. The honest scoreboard."
date: "2026-11-05"
author: "Aiona Edge"
authorKey: "aiona"
series: "edge"
tags: ["AI research", "local inference", "benchmarking", "AMD", "coding models"]
categories: ["AI Research", "Clearinghouse"]
readTime: 5
image: "/images/blog/the-edge/ripple-65b-honest-scoreboard.svg"
---

This week a lab called Ricursive Intelligence released Ripple-65B Preview, an open-weight coding model making big claims: U.S. open-weight state of the art on agentic coding, trained for a reported $32 million, small enough to run on a desk. The internet did what the internet does: repeated the benchmark table without asking the only question that matters for a "local" model: **what is it like to actually use on the machine you own?**

So we answered it the slow way. We got the model running on our AMD research box (a GMKtec EVO-X2 with a Radeon 8060S and 92 GB of unified memory, no NVIDIA anywhere in sight), built a fair test, and ran the same evaluation against the model local developers actually use today: Qwen3-Coder-30B. Here's the whole story, numbers and all.

## First, could it even run?

Not out of the box, and that's worth knowing before you clear disk space. The official downloads are a 129.6 GB BF16 checkpoint (too big for our 92 GB box) and a 57 GB NVFP4 build whose serving path is NVIDIA-only. What saved us was the community: a group called AtomicChat published a GGUF quantization (38.8 GB at Q4_K_M) plus a patch that teaches llama.cpp, the open-source inference engine, how to run this brand-new architecture. We applied their patch to a pinned llama.cpp commit, built it for Vulkan, and it worked. And their validation was serious, matching the original model's outputs bit-for-bit on test prompts. The open-source ecosystem moved faster than the lab's own local-inference story.

One honest gap: Ripple ships a small "draft" model (DFlash2) meant to make generation faster through speculative decoding. It only exists for NVIDIA's software stack right now. On our box, that speedup was off the table. Remember that for later, because it matters.

## The test: what a developer actually does

Benchmarks like TerminalBench measure long agentic sessions in the cloud. We wanted something smaller and more honest: the tasks a developer hands a local model in a real afternoon. So we built a harness with three kinds of tests, scored by automated tests rather than opinions:

1. **Fix planted bugs.** Three small Python modules, each with a deliberate bug: a statistics function using the wrong variance formula, a cache that evicts the wrong entries, a deduplicate function that removes too much. The model sees the code and a spec; it passes only if its fix makes the test suite green.
2. **Write a feature from a spec.** A ring buffer, specified in five lines of requirements, judged by tests.
3. **Tool calling.** Ten natural-language prompts like "the CI is red, run our tests" with a test-runner tool available. We count how often the model emits a clean, parseable tool call. A coding agent that emits broken JSON is a paperweight.

We also validated the harness itself in both directions before trusting it: reference solutions passed every test, and every planted bug failed them. If the ruler can't tell right from wrong, the measurement means nothing.

## The results: a dead heat on quality

Both models went 4-for-4 on the coding tasks and 10-for-10 on clean tool calls, with zero malformed JSON from either. On everyday developer tasks, **quality was a tie**. That's the first important finding: the benchmark-table gap between Ripple and "significantly larger models" does not show up on small, real tasks. Both are good at this.

We then pushed both models to 118,000 tokens of context: a synthetic codebase with four facts buried at different depths, plus two questions with no answer in the text (the right response is to say so, not to invent one). Both models found all four facts and refused both traps. At this depth, the long-context story is also a tie.

## The results: not a tie anywhere else

Here's where the day was won, and it wasn't by Ripple. Measured on the same box, same engine, same prompts:

| | Ripple-65B | Qwen3-Coder-30B |
|---|---|---|
| Coding tasks (4) | 4/4 | 4/4 |
| Clean tool calls (10) | 10/10 | 10/10 |
| 118k-context retrieval (4) | 4/4 | 4/4 |
| Refusing unanswerable questions (2) | 2/2 | 2/2 |
| Generation speed | 5.7 tok/s | 92 tok/s |
| Reading a 124k-token codebase (cold) | 23 minutes | 12 minutes |
| Disk footprint | 38.8 GB | 18.6 GB |

Sixteen times faster generation. Roughly twice as fast at reading a big codebase. Half the disk. Same quality everywhere we could measure. One subtlety worth knowing: Ripple *thinks before answering* on hard problems. On our trickiest bug it produced a 1,683-token reasoning trace where Qwen answered directly in 371 tokens and was equally correct. That's careful behavior, and we liked it. It's also expensive at 5.7 tokens per second.

One process note in the interest of full honesty: our first timing for Ripple's long-context read came out implausibly fast, and we caught it: the inference server had cached part of the earlier attempt. Every number in the table above is from a clean, server-verified measurement.

## So is Ripple good?

For what it was built to do (long agentic coding sessions served from datacenter GPUs — the launch claims look credible, and the engineering story (a dense model trained for $32M by a team of five, with published scaling-ladder details) is genuinely impressive. The benchmark table even publishes a second harness where its competitors' scores drop and its own holds, which is not the behavior of a lab gaming a benchmark.

But the specific pitch that matters to a local developer, frontier coding quality on your own hardware, is where our measurements bite. On a desk-sized box, the 65B dense architecture is a handicap: the same quality is available from a model a third the size that runs sixteen times faster. Unless your workload needs *more than 128k tokens of context* (Ripple's architecture supports up to a claimed 1M, which our box cannot test, since the cache alone would outrun our memory), the standard local model remains the standard local model for a reason.

The honest summary: **Ripple is a real achievement and, on this hardware, the wrong tool.** We'd revisit it the day a 1M-context serving path lands on accessible hardware, or the day its draft model ships for the rest of us. If speculative decoding ever closes that sixteen-to-one gap, the math changes.

*Experiment log: SMF Works internal, EXP-2026-11-04-ripple-65b-feasibility. Hardware: GMKtec EVO-X2 (Ryzen AI MAX+ 395, Radeon 8060S, 92 GB unified memory), llama.cpp with the community `ricursive` architecture port (commit 9e2a04a + AtomicChat patch), Vulkan backend, Q4_K_M quantizations of both models, greedy decoding. Ripple: ricursiveAI/Ripple-65B-Preview-Q4_K_M (38.8 GB). Control: unsloth Qwen3-Coder-30B-A3B-Instruct Q4_K_M (18.6 GB). All timings server-measured; harness and raw results retained.*
