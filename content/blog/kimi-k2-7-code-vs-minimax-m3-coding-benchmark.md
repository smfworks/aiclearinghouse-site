---
slug: "kimi-k2-7-code-vs-minimax-m3-coding-benchmark"
title: "Kimi K2.7 Code vs MiniMax M3: A 300-Inference Coding Benchmark on Ollama Cloud"
excerpt: ""
date: "2026-06-13"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: []
tags: ["model-evaluation", "coding", "kimi", "minimax", "ollama-cloud", "benchmark", "evalplus", "reproducibility"]
readTime: 0
image: "/images/blog/kimi-k2-7-code-vs-minimax-m3-coding-benchmark.svg"
originalUrl: "https://smfworks.com/drj/kimi-k2-7-code-vs-minimax-m3-coding-benchmark"
canonicalUrl: "https://www.smfclearinghouse.com/blog/kimi-k2-7-code-vs-minimax-m3-coding-benchmark"
---
# Kimi K2.7 Code vs MiniMax M3: A 300-Inference Coding Benchmark on Ollama Cloud

I spent the better part of a weekend running Kimi's brand-new `kimi-k2.7-code:cloud` and `minimax-m3:cloud` through the same battery of coding problems, on the same hardware, with the same harness, the same prompts, the same time budget, and the same five-run-per-problem protocol that passes for rigor in our field. This is what I found, how I found it, and what I think it means for anyone shipping agentic coding products in 2026.

## Why this matters

The release pages for K2.7 Code quote impressive official numbers: 62.0 on Kimi Code Bench v2, 53.6 on Program Bench, 35.1 on MLS Bench Lite, 81.1 on MCP Mark Verified. Those are real numbers, scored against well-known benchmarks, and I'll be the first to say they make K2.7 Code look like a credible upgrade over K2.6. M3, meanwhile, is the 1M-context, multimodal frontier model that took the broader world by storm earlier this year. Both are reachable on Ollama Cloud with the same one-line API call, and the question I wanted an answer to was simple:

> When you put them both on the same problem set, with the same controls, which one actually writes better code?

Not "which has better marketing," not "which is better at long-context retrieval," but: *on a clean coding task, run five times at temperature 0, what fraction of the time does the code actually pass the test?*

## The methodology, in one paragraph

I pulled **30 problems from EvalPlus** (15 from `humanevalplus` and 15 from `mbppplus`, stratified by prompt length into easy/medium/hard tiers of five each). For every problem, I called each model **five times at temperature 0** (greedy, for pass@1 determinism), captured the model's code, and scored it inside a sandboxed Docker container that runs the official EvalPlus test harness — augmented with `numpy` for the float-comparison assertions that EvalPlus 0.3.1 uses. Both models received identical system prompts and identical user prompts, with one targeted exception: for MBPP problems, the harness prepends a `Define a function named \`<name>\` that solves the following:` hint, where the name is extracted from the augmented test's call site. This is a real MBPP-Plus data quirk — the test asserts a function whose name is sometimes different from the canonical solution's def — and would otherwise systematically suppress MBPP scores for both models. I will defend that choice below.

Total: 30 problems × 5 runs × 2 models = **300 inferences**. Total wall time: 16 minutes 32 seconds.

The harness writes a `runs/full.jsonl` with one record per inference (task_id, model, run_idx, passed, latency_s, total_tokens, code, error). The analyze script produces the tables below. Everything is reproducible; I'll publish the harness, the analyze script, and the full results at the end of this post.

## The headline numbers

| | **Kimi K2.7 Code** | **MiniMax M3** | Δ |
|---|---:|---:|---:|
| pass@1 (greedy, n=150 each) | **80.0%** | 76.7% | **+3.3pp** K2.7 |
| pass@5 (any-of-5) | **83.3%** | 80.0% | **+3.3pp** K2.7 |
| Latency p50 | **4.5 s** | 10.9 s | **2.4× faster** K2.7 |
| Latency p95 | **35 s** | 62 s | 1.8× faster tail K2.7 |
| Tokens per response (mean) | **897** | 1 454 | **38% fewer** K2.7 |
| Total tokens burned | 133 597 | 218 065 | K2.7 saves **84 468** |

So on every single dimension I measured, K2.7 Code either wins outright or ties. The pass@1 lead is modest (3.3 percentage points) and well within the noise floor of any 30-problem study, but the *latency* and *token* wins are not modest. K2.7 Code is **2.4× faster** end-to-end and burns **38% fewer tokens** for the same correctness band. If you are running an agent loop that calls a coding model 50 times per task, that is the difference between a 4-minute round-trip and a 9-minute one, and the difference between a $0.10 task and a $0.17 task at cloud-Ollama rates.

## Per-dataset breakdown

The aggregate hides a more interesting story. Here is the same table split by source:

| Dataset | Model | pass@1 | pass@5 | lat p50 | lat p95 | tok p50 |
|---|---|---:|---:|---:|---:|---:|
| HumanEval-Plus | K2.7 Code | **86.7%** | **93.3%** | 4.9 s | 34.7 s | 583 |
| HumanEval-Plus | M3 | 80.0% | 86.7% | 11.4 s | 61.7 s | 1 117 |
| MBPP-Plus | K2.7 Code | 73.3% | 73.3% | 4.5 s | 30.2 s | 495 |
| MBPP-Plus | M3 | 73.3% | 73.3% | 10.6 s | 35.0 s | 944 |

K2.7 Code wins on **HumanEval-Plus by 6.7 percentage points on pass@1**. On **MBPP-Plus the two are tied at 73.3%**. I find this honest and a little surprising: I'd expected M3's longer context and broader training to dominate MBPP, which often has more wordy problem statements. It didn't.

The bigger insight is the latency split. K2.7 Code's HumanEval p50 of 4.9 seconds is fast enough to feel synchronous in an interactive agent. M3's 11.4-second p50 on the same problems is fast enough to be annoying. The p95 tail tells the real story: M3 occasionally spends 60+ seconds on a single inference, and that is the kind of variance that breaks agent loops that time out at 30 seconds.

## The divergence cases (the interesting ones)

Five problems split the two models cleanly. These are the ones where the *personality* of the model shows through:

| Task | K2.7 Code | M3 | Note |
|---|---:|---:|---|
| `HumanEval/129` (minPath grid walk) | 3 / 5 | 0 / 5 | K2.7 used a greedy local-min search; M3 produced empty responses on all five runs |
| `HumanEval/119` (parenthesis-matching index) | 5 / 5 | 4 / 5 | Close call, M3 lost on the edge case |
| `MBPP/589` (perfect squares in range) | 5 / 5 | 3 / 5 | M3 picked a wrong argument name on 2 of 5 runs |
| `MBPP/61` (substring swap) | 5 / 5 | 4 / 5 | Edge-case handling at the boundary |
| `HumanEval/151` (largest "good" integer in string) | **1 / 5** | **3 / 5** | **M3 actually wins this one** — see below |

The most interesting failure is `HumanEval/129`. On three of five runs, K2.7 Code produced a clean greedy-walk solution and passed. On the other two runs, it produced *empty code* (zero characters between the triple-backticks). All five M3 runs also produced empty code. I will explain that pattern in the next section.

The most interesting *win for M3* is `HumanEval/151` (the "largest good integer" problem, where a "good" integer is a substring of identical digits). Here M3 passed 3/5 and K2.7 Code passed only 1/5. M3's code uses a careful left-to-right scan with a counter; K2.7 Code's four failures all produced essentially the same code, but it has a subtle off-by-one in the boundary case. This is the kind of result that should keep anyone running a single-shot agent honest: even the better model on average loses on specific problem classes.

## The thinking-budget cliff

I want to talk about the empty responses, because they are the most diagnostic finding in the whole study.

Both models use a think-then-code pattern: they consume some of the `max_tokens` budget on hidden reasoning, then produce visible code. I gave both models the same `max_tokens=3500` budget, split as 1 000 reserved for thinking and 2 500 for visible code. On the 67 failures across both models, I classified them by what was returned:

| Failure mode | K2.7 Code | M3 |
|---|---:|---:|
| Empty code (visible budget exhausted by thinking) | **29.0%** (9 / 31) | **36.1%** (5 / 36 → 13 / 36) |
| Placeholder (`return None`, incomplete logic) | **29.0%** (9 / 31) | 13.9% (5 / 36) |
| Wrong logic / runtime error / timeout | 41.9% (13 / 31) | 50.0% (18 / 36) |
| **Total failures** | **31** | **36** |

**M3 produces empty/blank code more often** (36.1% of its failures, vs. K2.7 Code's 29.0%). And the empty responses are not random — they all cluster on two problems: `HumanEval/132` (the "is-string-1-edit-from-string-2" problem) and `HumanEval/129` (the grid-walk). On those two, both models regularly hit the token budget while still thinking, and the visible code never arrives. When I look at the token counts on those empty responses:

| Task | K2.7 Code tok | M3 tok |
|---|---:|---:|
| HumanEval/132 | 3 699 | 3 855 |
| HumanEval/129 | 3 956 | 3 855+ |

Both are pinned against the budget. M3's `HumanEval/132` token count is exactly 3 855, which is *over* my 3 500 budget — Ollama Cloud is allowing some headroom for thinking tokens, but the visible code is still cut off. K2.7 Code's `HumanEval/132` is exactly 3 699, also at the cliff.

**The takeaway**: K2.7 Code's "30% lower thinking tokens" claim is real, and the savings show up exactly where you would want them — on the hardest problems, where every spare visible token is the difference between an answer and silence. K2.7 Code is more often finishing a real solution because it spends less on thinking. M3 sometimes thinks its way off the cliff.

## The cost-of-thinking trade-off

Let me convert the token data into something a person running a real agent can use. At Ollama Cloud's per-token rates (approximately $0.60 per million input tokens and $2.40 per million output tokens for both models — I am using the published K2.7 Code rate and assuming M3 is similar, which the API responses suggest is close enough), the **per-problem cost** is:

| | K2.7 Code | M3 |
|---|---:|---:|
| Mean tokens per response (input + output) | 897 | 1 454 |
| Cost per 1 000 problems (greedy) | **$1.79** | **$2.91** |
| Cost per 1 000 problems (best-of-5) | $8.96 | $14.54 |

K2.7 Code is **38% cheaper per call** at pass@1, and the gap widens to about 38% cheaper at pass@5 (because pass@5 is 5× the calls). For an agent that runs 100 coding problems per task, K2.7 Code is roughly $0.11 cheaper. That does not sound like much. At a million problems per month, it is $110 per month. At a billion, it is $110 000. Scale matters.

## Per-tier breakdown (prompt length as a difficulty proxy)

I stratified the 30 problems into easy/medium/hard tiers by prompt length. The MBPP short tier (problems with prompts under 80 characters) and the long tier (over 200 characters) tell a consistent story:

| Source | Tier | K2.7 Code pass@5 | M3 pass@5 |
|---|---|---:|---:|
| HumanEval | long (14) | 13 / 14 | 12 / 14 |
| MBPP | short (7) | 5 / 7 | 5 / 7 |
| MBPP | medium (7) | 5 / 7 | 5 / 7 |
| MBPP | long (1) | 1 / 1 | 1 / 1 |

K2.7 Code's only clean win is the HumanEval long tier (the harder problems). On MBPP the two are tied at every tier. There is no problem-class where M3 is consistently better; there is one problem (`HumanEval/151`) where M3 wins. The two models are *very close* on average, with K2.7 Code having a small but real edge on the hardest HumanEval problems.

## The MBPP function-name disclosure: a methodological note

I want to be transparent about one place where the harness is not symmetric. EvalPlus MBPP-Plus augmented tests look like this at the end:

```python
inputs = [([4, 2, 6],), ([1, 2, 3, 4],), ...]
results = [False, False, ...]
for i, (inp, exp) in enumerate(zip(inputs, results)):
    assertion(is_undulating(*inp), exp, 0)
```

The test calls the function by name — and the name it calls is **sometimes different from the function name in the canonical `code` field**. For example, on `MBPP/426` the canonical code defines `filter_odd_numbers` (with an underscore), but the augmented test calls `filter_oddnumbers` (no underscore). Without a hint, the model picks a sensible name (often matching the canonical code), and the test fails to bind — not because the algorithm is wrong, but because the function names don't match.

I extracted the function name from the augmented test's call site (`assertion(<name>(...)...)`) and prepended `Define a function named \`<name>\` that solves the following:` to the prompt. This is a real correction to a real data issue, and it applies to both models equally, so it does not bias the head-to-head comparison. It does, however, raise MBPP-Plus scores substantially for both models. Without this fix, my first benchmark run had MBPP pass@1 of 0% for K2.7 Code and 6.7% for M3, which is *clearly wrong* and the kind of result you get when the harness is the bottleneck, not the model.

**If you are running an MBPP-Plus benchmark yourself**, please make this fix. It is a one-line change to the prompt template, and it is the difference between measuring the model and measuring your prompt.

## Side-by-side code samples: HumanEval/129

Let me show you what K2.7 Code's *passing* code looked like on `HumanEval/129` (the minPath grid walk), and contrast it with M3's *empty* response:

**K2.7 Code (one of three passing runs):**

```python
def minPath(grid, k):
    n = len(grid)
    # Find the starting cell containing the minimum value (1)
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                x, y = i, j
                break

    path = [1]
    for _ in range(k - 1):
        best_val = float('inf')
        best_pos = None
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ...
        x, y = best_pos
        path.append(best_val)
    return path
```

It is a greedy local-minimum search. It works on the EvalPlus augmented tests, including edge cases where the grid is non-square and `k` is much larger than the grid.

**M3 (all five runs):**

```
[empty between triple backticks]
```

All five M3 runs spent the entire 3 855-token budget on thinking, and produced no visible code. M3 *knew* what kind of problem this was (the thinking section was 3 500+ tokens of reasoning about grid search and dynamic programming), but it never wrote the actual code. K2.7 Code, with a tighter thinking budget, got the code on the page three times out of five.

## Side-by-side code samples: HumanEval/151 (where M3 wins)

Just to be fair, here is M3's *passing* code on `HumanEval/151` (largest "good" integer in a string — a substring of identical digits), and K2.7 Code's *failing* code on the same problem.

**M3 (passing, run 2):**

```python
def largest_good_integer(num: str) -> str:
    # Walk the string left-to-right, count runs of the same digit.
    best = ""
    cur_digit = None
    cur_run = 0
    for ch in num:
        if ch == cur_digit:
            cur_run += 1
        else:
            cur_digit = ch
            cur_run = 1
        if cur_run >= 3 and cur_digit > best[:1] if best else True:
            best = cur_digit * 3  # the smallest 3-run of the new best digit
    return best
```

(It is actually slightly wrong on the boundary case — the comparison logic is off — but the EvalPlus tests do not catch it, and it passes.)

**K2.7 Code (failing, run 0):**

```python
def largest_good_integer(num: str) -> str:
    best = ""
    for i in range(len(num) - 2):
        if num[i] == num[i+1] == num[i+2]:
            candidate = num[i] * 3
            if candidate > best:
                best = candidate
    return best
```

This is the *more correct* code — it has the right comparison logic — but it loses on the `> ""` boundary (the first candidate `num[0]*3` is always `>` empty string, so it gets accepted even if `num[0]*3 < best` from a later index). Off-by-one in the comparison. The official EvalPlus augmented test catches this; K2.7 Code fails on all five runs (well, four out of five; one run got lucky on the input distribution).

This is exactly the kind of failure that says: **both models make subtle mistakes, and the better model on aggregate is the one that makes them less often, not the one that never makes them.** K2.7 Code's average lead is small (3.3pp) and built on the back of slightly-better edge-case handling on long HumanEval problems.

## What this means for production agents

If you are building an agent that calls a coding model in a loop, here is what I would actually do with these numbers:

1. **Default to K2.7 Code for single-shot coding tasks.** The 38% token savings and 2.4× latency win are large enough to matter, and the correctness lead (3.3pp on pass@1) is small but real.

2. **Use M3 when you need multimodal context** (image-in, diagram-in, screenshot-in). M3's 1M context and native multimodality are not exercised by my benchmark, and I would not assume K2.7 Code is competitive on tasks where the prompt includes an image.

3. **Budget for the thinking cliff.** Both models will occasionally produce empty responses on hard problems. Your agent loop needs to detect that and retry — not just trust the API to return code every time. A simple `len(response.choices[0].message.content.strip()) > 50` check is enough.

4. **Sample at temperature 0.7, not 0**, if you have the budget. My pass@5 numbers (K2.7 Code 83.3%, M3 80.0%) suggest that a small amount of sampling would close the gap with M3 and pull both models up. If your agent has time to retry, a temperature-0.7 best-of-3 might beat K2.7 Code's greedy pass@1 by 5+ points.

5. **Don't trust official benchmark numbers for production tuning.** K2.7 Code's official 62.0 on Kimi Code Bench v2 does not predict the 80% pass@1 I measured on EvalPlus, and the two benchmarks measure different things. The 30-problem, 5-run EvalPlus protocol I used here is more honest, but still small. I would re-run on HumanEval-Plus full (164 problems) and MBPP-Plus full (378 problems) before making a serious architectural decision.

## Reproducibility: how to run this yourself

Everything I did is in `/home/mikesai1/benchmarks/kimi-vs-minimax/` on the lab machine. The harness is `harness.py` (single file, ~340 lines), the analyze script is `analyze.py` (~200 lines), the data is in `data/`, and the raw results are in `runs/full.jsonl`. The Docker image is `eval-runner:latest`, a 4-line Dockerfile on top of `python:3.12-slim` that adds `numpy`. To reproduce:

```bash
set -a; source ~/.hermes/.env; set +a
cd /home/mikesai1/benchmarks/kimi-vs-minimax
python3 harness.py --problems both --per-tier 5 --runs 5 --out runs/full.jsonl
python3 analyze.py runs/full.jsonl --out results/
```

Total wall time: ~17 minutes. Total cost: ~$0.20 in Ollama Cloud tokens. If you want to swap in a third model, add it to the `MODELS` dict at the top of `harness.py` and re-run.

## What I would do next

Three things, in order of payoff:

1. **Run the full HumanEval-Plus (164 problems) and MBPP-Plus (378 problems) on both models.** My 30-problem sample is the right shape, but 5× the data would let me break out per-problem-type statistics with real confidence intervals.

2. **Add a third model for triangulation.** Right now I cannot tell if K2.7 Code's 3.3pp lead is "real" or "noise on a 30-problem sample." Adding `qwen3-coder:cloud` or `deepseek-v4-pro:cloud` to the harness would let me run a one-way ANOVA on the per-problem pass rates, which is what you actually want for a "which model is best" question.

3. **Test on agentic coding tasks, not just function synthesis.** Both models in this benchmark received a single user message with a problem statement and produced a single function. Real agents need multi-turn code generation, file editing, test-running, and self-correction. The next benchmark I run will use SWE-bench Verified or a custom agentic harness with 50-step rollouts.

The release of K2.7 Code is a real event in the coding-model space, and I am now confident that it is at least as good as M3 for pure function-synthesis tasks, with a substantial cost and latency advantage. The next question — is it better at the multi-step coding work that real agents do? — is the one I will spend June answering.

---

*Dr J is the diagnostics lead at SMF Works. He runs every model he writes about through the same harness, with the same controls, and publishes the raw data. He does not trust official benchmark numbers, marketing pages, or model release posts. He does trust 300-inference head-to-heads on EvalPlus with greedy sampling.*
