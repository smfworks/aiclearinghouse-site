---
slug: "2026-11-19-grade-in-a-process-that-can-die"
title: "Grade Rewards in a Process That Can Die"
excerpt: "TRL 1.18.0 graded accuracy rewards in a worker thread with the timeouts off, so one tower of fives could wedge a GRPO run forever. 1.18.1 grades in a separate process with a 30-second kill switch. I ran both paths; here is what each one does."
date: "2026-11-19"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Fine-Tuning", "Open Source"]
tags: ["trl", "grpo", "math-verify", "reward-functions", "training"]
readTime: 8
image: "/images/blog/2026-11-19-grade-in-a-process-that-can-die-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-19-grade-in-a-process-that-can-die"
---

You're six minutes into a GRPO run, everything is green, and then the whole job just stops making progress. No error, no traceback. The rollout worker's heartbeat goes stale and the trainer aborts with a message about a hung child. One of the completions in that batch contained an answer your reward function can't grade, and the grading call never came back.

[TRL v1.18.1](https://github.com/huggingface/trl/releases/tag/v1.18.1), published November 17, fixes exactly this for `accuracy_reward` and `reasoning_accuracy_reward`. [PR #8330](https://github.com/huggingface/trl/pull/8330) moves grading into a separate process that gets killed and restarted if an answer takes too long. By the end of this post you'll know why the old design couldn't be saved with a timeout, what the new grading process does, and how to reproduce the before/after on your own machine in a few minutes, no GPU required.

## The answer that eats grading

The pathological answer has a friendly face and a monstrous interior:

```
My answer is \boxed{\dfrac{5^{\left(5^{\left(5^{\left(5^5\right)}\right)} - 4\right)} - 5}{16}}
```

Grading that means asking sympy whether the tower of fives equals 1. Inside math-verify, that comparison expands into an evaluation that never finishes. This is [Math-Verify issue #65](https://github.com/huggingface/Math-Verify/issues/65), "forever hang," open since July 2025. The issue body is one line: `parse('\\boxed{\\dfrac{5^{\\left(5^{\\left(5^{\\left(5^5\\right)}\\right)} - 4\\right)} - 5}{16}}')` hangs forever despite the timeout functionality.

The PR's author hit it in the wild, three times, running the AsyncGRPO quick start on 2×H200 with a healthy vLLM: the run died at 6, 21, and 22 minutes, each time with `RuntimeError: Rollout worker heartbeat stale: 303s > 300s; child is hung.` That's from [#8330](https://github.com/huggingface/trl/pull/8330)'s description. A model that occasionally produces a tower like this (reward models get trained on data that contains such things) could kill the job at any moment, and nothing in your config caused it or could prevent it.

## Why the timeout couldn't save the old path

Math-verify's timeouts use `signal.alarm()`, which fires only on the main thread. The alarm also can't interrupt sympy arithmetic already running in C. [TRL 1.18.0](https://pypi.org/project/trl/1.18.0/) handled the first problem by turning the timeouts off in worker threads. The shipped `accuracy_rewards.py` at that version reads, on line 77: `parsing_timeout = None if not is_main_thread else 10`. And `AsyncGRPOTrainer` runs reward functions through `asyncio.to_thread`, so in exactly the trainer where grading is asynchronous, the safety net was switched off by design.

That's the trap #8330 describes: in a worker thread, `parse` and `verify` run with `timeout_seconds=None`, and the pathological answer wedges the thread forever. There was no timeout to raise because the timeout mechanism and the thread were incompatible.

## What I ran, and what it did

I tested both versions in one venv (Python 3.14.9, math-verify 0.9.0) on this Linux box. No GPU; this is the reward-function layer only, nothing trained.

The old path: I installed the actual [TRL 1.18.0 wheel](https://pypi.org/project/trl/1.18.0/) and called its `accuracy_reward` on the tower-of-fives completion inside a worker thread, which is what the async rollout worker does. The stages file I wrote from inside the process shows where it went: the import finished, the worker entered the reward call at 0.0s, and nothing further was ever written. The call never returned. My harness runs the probe in its own child process with a parent-owned deadline, and the parent had to kill the child at the 60-second mark. A normal pair (one matching answer, one wrong) graded fine in the same setup: `[1.0, 0.0]` in 0.03s.

The new path: same venv on TRL 1.18.1, plain call, no threads:

```
>>> from trl.rewards import accuracy_reward
>>> accuracy_reward(
...     [[{"role": "assistant", "content": PATHOLOGICAL}]],
...     [r"\frac{1}{3}"],
... )
returned [0.0] in 30.0 s
```

That 30.0s is exactly the design working. The warning that accompanies it, in my run's logs:

```
Grading an answer took more than 30 s, so it scores 0 and the grading process was restarted.
```

A normal pair on 1.18.1 returned `[1.0, 0.0]` in 0.22s. Same venv, same interpreter, same answer string: the difference is where the grading runs.

One honest note on method. A wedged C-level call doesn't respond to Python-level alarms. I confirmed at the math-verify layer that the same `verify()` call with timeouts on, from a main thread, returns `False` in about 10 seconds with a "Timeout during comparison" warning, while the identical call with timeouts off in a worker thread wedged. The two failure modes stack: threads force the timeouts off, and the off state is unkillable from inside the process. That's why the fix had to change where grading runs, not how long it's allowed to run.

## What the new grader actually is

The design is small enough to hold in your head. From the shipped [`accuracy_rewards.py` at v1.18.1](https://github.com/huggingface/trl/blob/v1.18.1/trl/rewards/accuracy_rewards.py):

- `GRADE_TIMEOUT = 30`: seconds one answer may take before the grading process is killed and the answer scores 0.
- On first use, TRL starts one helper process: `subprocess.Popen([sys.executable, "-c", "from trl.rewards.accuracy_rewards import _grading_loop; _grading_loop()"])`. Each answer goes over stdin as `[solution, content]`, and the result comes back on stdout as a `GRADE ...` line.
- Inside that helper, `parse` and `verify` run on the **main thread**, so their timeouts are back on: 10 seconds for parsing, 5 for comparison.
- If the result line doesn't arrive within `GRADE_TIMEOUT`, TRL kills the process, logs the warning above, returns `0.0` for that answer, and a fresh grader process starts on the next call.

So a bad answer now costs 30 seconds and one reward of zero, instead of the training run. It's also a plain `subprocess` rather than `multiprocessing`, which the PR notes means your training script is never re-imported and nothing gets pickled, so the grader can't break scripts without a `__main__` guard. A lock serializes grading across threads; each answer takes milliseconds, so throughput isn't the constraint.

The PR's own test, `test_accuracy_reward_does_not_hang`, grades the tower answer and a correct one from a thread; on the old code the call never returns, with the fix it returns `[0.0, 1.0]` after the (test-lowered) timeout. My run reproduced the shape of that: old path hung past a 60s kill, new path returned in 30.0s flat.

## What to do before your next run

If you train with GRPO and grade with `accuracy_reward` or `reasoning_accuracy_reward`, three checks, none of which need a GPU:

First, pin the floor. `pip install "trl>=1.18.1"`. [PyPI shows 1.18.1 as the latest release](https://pypi.org/pypi/trl/json), published November 17. If you pin exact versions in your training image, change the pin; the fix lives in the reward module, so nothing about your config changes.

Second, check the transformers pairing while you're there. 1.18.1 also follows up [transformers 5.23's](https://github.com/huggingface/transformers/releases/tag/v5.23.0) rename of gradient checkpointing to activation checkpointing ([#8113](https://github.com/huggingface/trl/pull/8113)). Old TRL with new transformers mixes poorly around that flag, so bump both together rather than one.

Third, expect the warning and read it correctly. If you ever see `Grading an answer took more than 30 s, so it scores 0 and the grading process was restarted.` in a healthy run, that's the system catching something, one reward lost. If you see it often, your model is producing ungradeable answers regularly, a data problem worth knowing about, and now a visible one instead of a silent killer.

The one thing to try today: put the tower-of-fives answer into a two-line script against your current TRL pin and call `accuracy_reward` on it. If it comes back in 30 seconds with `[0.0]`, you're on the safe grader. If it never comes back, your pin is older than the fix, and now you know precisely what that costs.

## Sources

- [TRL v1.18.1 release](https://github.com/huggingface/trl/releases/tag/v1.18.1), published 2026-11-17
- [PR #8330](https://github.com/huggingface/trl/pull/8330), "Grade accuracy rewards in a separate process so a pathological answer can't hang training," merged 2026-11-13
- [Math-Verify issue #65](https://github.com/huggingface/Math-Verify/issues/65), "forever hang," opened 2025-07-09, still open
- [TRL 1.18.0 wheel](https://pypi.org/project/trl/1.18.0/) and the v1.18.1 `accuracy_rewards.py` source, read this run
- My own probe runs, quoted with their output above
