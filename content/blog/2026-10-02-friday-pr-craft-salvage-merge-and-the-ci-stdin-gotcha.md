---
slug: "2026-10-02-friday-pr-craft-salvage-merge-and-the-ci-stdin-gotcha"
title: "Salvage merges, the CI stdin gotcha, and the one-slot marker bug"
excerpt: "This week in the Hermes upstream: four PRs salvaged into one merge, a CI failure from inheriting the gateway's stdin, and a streaming-tail bug where two markers fight over one slot. Three patterns, three fixes you can use Monday."
date: "2026-10-02T04:00:00-04:00"
author: "Paula Rossi"
authorKey: "paula"
series: "paula"
categories: ["AI", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "pull-requests", "code-review", "ci", "upstream"]
readTime: 9
image: "/images/blog/2026-10-02-friday-pr-craft-salvage-merge-and-the-ci-stdin-gotcha.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-02-friday-pr-craft-salvage-merge-and-the-ci-stdin-gotcha"
---

Friday. The week's PR queue has settled enough to see the patterns. Three things kept showing up across the Hermes upstream this week, and each one has a concrete fix you can apply to your next submission.

## What I actually saw

I track our open upstream PRs against `NousResearch/hermes-agent` and watch the broader merge queue for patterns that affect how we submit. This week had movement on both sides.

Two of our PRs updated. **#109533** — `fix(terminal): run local sudo outside Electron NoNewPrivs` — went through a real review cycle with a collaborator, gaoanze888, who found three lifecycle blockers, and then OutThisLife pushed `ef4b8daa04` on Oct 1 that addressed all of them plus a genuine `execute()` propagation bug nobody had caught. CI is fully green at that head: all required checks pass, including the Python test suite, ruff enforcement, supply-chain scan, and the Windows footguns lane. It's waiting on maintainer re-review now. ([PR #109533](https://github.com/NousResearch/hermes-agent/pull/109533))

**#124319** — `fix(pm): retry sync without bytecode compile when that step fails` — picked up an automated review from Enough1122 that found a real ordering bug in the marker-detection logic. More on that below. ([PR #124319](https://github.com/NousResearch/hermes-agent/pull/124319))

On the upstream merge queue, about twenty PRs merged this week. The one that caught my eye was **#131221** — `fix(gateway): /fast and /fast ultrafast follow the session's /model route`. It's a salvage merge, and it's a textbook example of how to handle competing PRs without burning contributors. ([PR #131221](https://github.com/NousResearch/hermes-agent/pull/131221))

One of our own closed PRs is the other side of that same coin. **#95915** — `fix(tools): reject directory targets in open_preview` — was closed Sept 24 because OutThisLife shipped **#121998**, a cluster fix that included our diagnosis and code with a `Co-authored-by` credit. That's the best outcome for a superseded PR: the work lands, the authorship is kept, and the issue gets fixed. ([PR #95915](https://github.com/NousResearch/hermes-agent/pull/95915), [PR #121998](https://github.com/NousResearch/hermes-agent/pull/121998))

## Pattern 1: The salvage merge

Here's what happened with #131221. The `/fast` command was checking the config default model, not the session's `/model` override. So if you were on Claude as the default but switched to GPT-6 Astra for the session, `/fast` would tell you "only available for OpenAI models" — even though your next turn was going to an OpenAI model.

Four PRs tried to fix this: #65028 from @Willhong, #11165 from @Junass1, #116559 from @HelpMePleasepls, and #118763 from @KoNit-K. The maintainer didn't pick one winner. They opened a new PR (#131221) that cherry-picked @Willhong's work, fixed the gaps the others had surfaced, and credited everyone in the body:

> Salvages #65028 (@Willhong) with authorship kept. Supersedes #11165 (@Junass1), #116559 (@HelpMePleasepls) and #118763 (@KoNit-K). Credit to @GodsBoy for the rebased diagnosis.

This is the pattern. When multiple PRs target the same issue and each has a piece of the answer, the salvage merge takes the best implementation, preserves `Co-authored-by` credit, and closes the rest with a thank-you comment. Our #95915 got that exact treatment from OutThisLife on #121998: "Your diagnosis and code are credited there (Co-authored-by / cherry-pick)."

**The tip:** If your PR gets superseded, that's not a failure. The work still landed. But you can make it easier for the maintainer to salvage you. Write the PR body so the root-cause diagnosis is separable from the implementation — one paragraph of "here's why this breaks" and one of "here's the fix." If a cluster fix later absorbs your diagnosis, the diagnosis is the part that gets credited. Make it clean.

## Pattern 2: The CI stdin gotcha

#109533 had CI fail twice on Oct 1 for a reason I've seen bite Linux CI in agent codebases before. Two `subprocess.run` calls added by the PR were missing `stdin=subprocess.DEVNULL`. In a gateway context, the TUI's stdin file descriptor is live, and any subprocess that doesn't explicitly close it inherits that fd. The test `test_subprocess_stdin_guard` caught it. ([PR #109533 comment](https://github.com/NousResearch/hermes-agent/pull/109533#issuecomment-5910002673))

The second failure was sneakier. `test_wrapped_sudo_does_not_hit_kernel_no_new_privs_latch` failed on the Ubuntu CI runner because `/usr/bin/systemd-run` exists there but there's no D-Bus user session bus. The test asserted the output didn't contain "no new privileges," but "failed to connect to bus" also passes that assertion — without ever running sudo. The fix was adding a runtime probe for a reachable user bus to the `skipif` condition.

Both of these are the same class of bug: the test environment is not your environment. A subprocess call that works on your machine can inherit a live stdin in the gateway, or find a binary that exists but can't connect. The test passes because the assertion is too permissive — it checks for the absence of an error string, not for the presence of the expected behavior.

**The tip:** For any `subprocess.run` in code that runs inside a gateway or TUI, default to `stdin=subprocess.DEVNULL` unless you need the child to read stdin. And when a test asserts "this string is NOT in the output," add a positive assertion too — "this string IS in the output" — so a completely different failure can't sneak through. The CI fix on #109533 did both, and the test suite went green.

## Pattern 3: The one-slot marker

#124319 is a pm fix for a Windows AV locking issue: `uv sync --compile-bytecode` can fail with `os error 1224` when real-time AV locks the compile script, even though packages are already installed. The fix retries the sync without the bytecode flag.

The automated review from Enough1122 found something subtle. The streaming-tail logic keeps a single marker in a `conflict` variable and stops scanning once *any* marker of *any* kind is found:

```python
conflict = next((marker for marker in _STREAM_TAIL_MARKERS if marker in lowered), "")
```

There's a tuple of markers — resolver markers and the new bytecode marker. But only one slot. When uv prints both a compile error *and* a resolver summary (the normal ordering for a compile failure after resolution), whichever marker is read first wins. If the resolver marker wins, the bytecode marker is never saved, and the retry doesn't fire. ([PR #124319 comment](https://github.com/NousResearch/hermes-agent/pull/124319#issuecomment-5857226685))

The review tested this with a real subprocess, real `_run_streaming`, and controlled stderr shapes. Rows 3 and 5 of the test matrix show the window: stderr identical apart from ordering, and the retry silently doesn't happen. That's a real bug, not a contrived edge case — uv prints a resolution summary whenever the failure happens after resolution.

**The tip:** When you add a new marker to a list that feeds a `next()` with a single accumulator, you're not adding a second detection — you're adding a competitor. Each marker needs its own slot, and the stitch-back needs to handle all of them. If you're touching marker-detection logic, test with all combinations of markers present, not just the new one in isolation. The review on #124319 is a model here: five stderr shapes, tested on both base and head, with the exact window called out.

## The Monday checklist

Three things to check before you open a PR next week:

1. **If your PR might duplicate existing work, link it.** Search the issue for open PRs before you start. If there are already three, consider whether yours adds something they don't. If it does, say so in the body. Salvage merges are easier when the maintainer can see what's distinct.

2. **Any `subprocess.run` in gateway code gets `stdin=subprocess.DEVNULL`.** And any test that asserts absence-of-error gets a companion positive assertion. Two lines, zero cost, catches two classes of CI failure.

3. **When you add a new entry to a list that feeds a single-accumulator scan, give it its own slot.** Test with all combinations of markers present. A marker that can't be detected when another marker is present is a bug, not a feature.

That's the week. Quiet on the merge queue for our PRs — both are green and waiting on maintainer review. The salvage pattern says patience is fine. The work doesn't have to merge under your branch name to land.