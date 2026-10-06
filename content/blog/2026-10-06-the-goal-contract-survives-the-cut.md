---
slug: "2026-10-06-the-goal-contract-survives-the-cut"
title: "The /goal contract survives the cut"
excerpt: "Hermes PR #133692 re-folds the /goal contract through every compaction boundary, mirroring the todo-list fold that already worked. The mechanism is small. The pattern it follows is the one worth knowing: any state that must survive a lossy boundary has to be structurally pinned, not paraphrased into a summary."
date: "2026-10-06T15:00:00-04:00"
author: "Paula Rossi"
authorKey: "paula"
series: "paula"
categories: ["The Review", "Production Engineering", "Hermes AI"]
tags: ["the-review", "review-craft", "compaction", "goal-contract", "structural-pinning", "upstream", "hermes"]
readTime: 9
image: "/images/blog/2026-10-06-the-goal-contract-survives-the-cut.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-06-the-goal-contract-survives-the-cut"
---

Tuesday is review craft. One mechanism, one pattern, and how you'd catch it before it bit you.

The mechanism is a single open PR on Hermes main: [**#133692**](https://github.com/NousResearch/hermes-agent/pull/133692), "re-fold /goal + contract at compaction boundary," authored by **33hodl**. State: `OPEN`, `+408 / −16`, four files. I pulled the diff this morning with `gh pr diff`. The numbers and code below are from that diff, not a summary.

The pattern underneath it is the one I keep circling this week: a contract that lives inside a lossy medium will erode at the boundary unless you pin it structurally.

## The bug: a contract that only the model could see

Hermes has two pieces of state that live outside the transcript but have to survive a compaction: the **todo list** and the **/goal contract**. The todo list is the work queue. The `/goal` contract is the judge's brief — it carries the goal, the **Verification** steps, the **Constraints**, and the **Stop condition** that decide whether a long-running turn keeps going or declares done.

The todo list already had a fold. On every compaction boundary, `_fold_todo_snapshot` re-injects the live todo list into the trailing transcript row, verbatim, flagged as synthetic so it never gets mistaken for human intent. After a compaction the model still sees the real, current todo list — not a paraphrase of it.

The goal did not have that fold. Its state lived in `state_meta`, and the model saw it two ways: the kickoff message at the start, and a `[Continuing toward your standing goal]` prompt queued between turns. If a compaction cut landed between those two — say, mid-turn, after a `/heartbeat` tick or a real user interjection opened the turn instead of the continuation prompt — then the goal and its contract existed *only* inside the compressor's free-text `## Goal` summary section.

That section is model-authored prose. The compressor asks the summarizer "what the user is trying to accomplish overall," and the summarizer writes what it writes. The Verification steps, the Constraints, the Stop condition — the exact fields the judge later enforces — get paraphrased, or dropped, for the rest of the turn.

This is not a cosmetic loss. The judge enforces the contract. If the contract eroded into a paraphrase, the agent drifts from the boundaries that decide continuation, and there's no record that they moved. The failure is silent.

The PR body names the reported issue: [#133643](https://github.com/NousResearch/hermes-agent/issues/133643). The author's framing is exactly right — "whether the goal and its completion contract survive a compaction depends on where the goal text happens to sit when the cut lands." Location-dependent survival is the smell. State that survives only when the cut is friendly is state you can't depend on.

## The fix: give /goal the todo list's own machinery

The fix is deliberately small, and that's the reviewable part. The author didn't invent a new mechanism. They gave `/goal` the todo list's *existing* machinery.

The change touches four files:

- **`agent/conversation_compression.py`** — the compaction commit boundary used to call `_fold_todo_snapshot(agent, compressed)`. It now calls `fold_state_snapshots(agent, compressed)`, which runs the todo fold *and* the new goal fold. The new entry point is imported lazily so the facade stays under its line cap. A new synthetic-user prefix, `[Your standing /goal was preserved across context compression]`, and a new synthetic flag, `_goal_snapshot_synthetic`, are registered in the same tuples the todo snapshot already uses — so provenance and scaffolding classification from [#69292](https://github.com/NousResearch/hermes-agent/pull/69292) are unchanged. The folded row is never treated as human intent.

- **`agent/conversation_compression_goal_fold.py`** (new, 127 lines) — `fold_goal_snapshot()` mirrors `_fold_todo_snapshot`. It strips any earlier preserved-goal block (refresh, never stack — repeated compactions don't accumulate copies), folds the live active-goal block into the trailing user row the todo fold already produced (so two synthetic user rows never sit adjacent), and appends a flagged row only when the tail isn't a user row.

- **`hermes_cli/goals.py`** — the goal + contract body is factored out of `GoalManager.next_continuation_prompt` into a shared `_goal_body_block()`, so the continuation prompt and the preserved block render the same contract fields from one source. The continuation prompt's output is byte-for-byte unchanged; only the shared rendering path is new. A `render_preserved_goal_block()` (active + not parked only) and `goal_is_parked()` are added.

- **`tests/agent/test_goal_snapshot_fold.py`** (new, 11 tests) — the reviewable claim.

The header is deliberately non-imperative: `[Your standing /goal was preserved across context compression]` reminds the model what its goal and contract *are*, not to keep working. The judge decides continuation. That distinction matters — a preserved block that nags "continue" would bias the continuation decision it's supposed to feed.

## How to catch this class of bug

This is the part I want you to take into your next review. The bug is not "compaction drops the goal." The bug is "state that must survive a boundary was stored in a medium that paraphrases."

Three questions that would have surfaced it before a user reported [#133643](https://github.com/NousResearch/hermes-agent/issues/133643):

**1. Is there state the system enforces that lives only in model-authored free text?** The todo list got a fold because someone recognized it as enforceable state. The goal contract is the same class of state — the judge reads it — but it was treated as conversational context. Walk the enforcement surface (the judge, the verifier, the stop condition) and ask, for each field it reads: *where does this field live after a compaction?* If the answer is "in the summary's `## Goal` prose," that field is unprotected.

**2. Does survival depend on where the cut lands?** The PR body's own test for this is sharp. A turn opened by the continuation prompt survives, because the active request is kept in the tail. A turn opened by anything else doesn't. If your state's survival is conditional on the boundary's position, you have location-dependent survival — and the boundary's position is not something you control. The fix is to make survival unconditional, by re-folding from the authoritative store on every boundary.

**3. Does the existing code already solve this for a sibling state?** This is the highest-leverage question, and it's the one the author asked. The todo fold is the proven path. Reusing it means one code path, one set of provenance flags, one set of tests to extend. A new mechanism would have meant a new failure mode. When you find a boundary-survival bug, look first for the sibling that already survives correctly, and copy its mechanism — don't invent a parallel one.

## What the tests actually prove

The test file is `tests/agent/test_goal_snapshot_fold.py`. Eleven tests. I read the names and assertions from the diff. They cover the things you'd want proven before you trust a fold:

- The contract is carried **verbatim** and flagged synthetic (`test_fold_goal_snapshot_carries_contract_and_is_synthetic`).
- Repeated compactions **refresh, not stack** — two boundaries don't leave two copies (`test_fold_goal_snapshot_refreshes_rather_than_stacks_across_boundaries`).
- The block merges into a trailing real user row, and that row keeps its real provenance (`test_fold_goal_snapshot_merges_into_trailing_real_user_row`).
- A goal the judge marked **done**, or that's **paused** or **cleared**, folds nothing — no resurrection of a finished goal ([#34197](https://github.com/NousResearch/hermes-agent/pull/34197), the prior "don't resurrect" carve-out, is respected).
- A **parked** goal (waiting on a pid, waiting on CI) folds nothing (`test_fold_goal_snapshot_ignores_a_parked_goal`).
- A continuation-opened turn doesn't get a duplicate block (`test_fold_goal_snapshot_does_not_duplicate_a_continuation_turn`).
- When the goal store is unavailable, the existing snapshot is **preserved rather than risk deleting the only copy** (`test_fold_goal_snapshot_preserves_a_snapshot_when_no_goal_is_loadable`) — mirrors the un-rehydrated todo store behavior.
- The header literal stays in sync between the fold module and the goals module (`test_header_literal_stays_in_sync_with_goals_module`).
- An **end-to-end** run through `compress_context` asserts the active goal + contract survives a compaction exactly once (`test_compress_context_refolds_an_active_goal`).

That last one is the test I'd ask for in review. Unit tests on the fold prove the fold works; the end-to-end through `compress_context` proves the boundary actually calls it. The assertion `len(rows) == 1` — "the active goal + contract must survive compaction exactly once" — is the right shape: it catches both loss (zero) and stacking (two).

## Why I'd merge this

The change is small, the mechanism is reused not invented, the carve-outs (done/paused/cleared/parked fold nothing, continuation turns don't duplicate, unavailable store preserves) are all correct, and the test that proves the boundary calls the fold is present. The lazy import keeps the facade under its line cap without hiding the call site. The header is non-imperative so it doesn't bias the continuation decision.

The one thing I'd watch in review is the interaction with third-party context engines. The PR body notes that any engine which doesn't reproduce the built-in active-request anchor drops the goal — and this fold only runs inside Hermes's own `compress_context`. That's a known limitation, not a regression, but it's worth a line in the docs so an operator swapping a context engine doesn't assume the goal contract is portable. It isn't. The contract survives because the fold runs at *this* boundary, in *this* code. Move the boundary, re-verify the fold.

## The pattern, restated

Any state that must survive a lossy boundary has to be structurally pinned, not paraphrased into the summary. The todo list was pinned. The goal contract wasn't. The fix pins it the same way.

When you're reviewing a compaction, a serialization, a handoff between agents — ask where the enforced contract lives after the cut. If it lives in free text that someone (or some model) wrote about it, it's already eroding. If it lives in a re-folded, flagged, verbatim block from the authoritative store, it'll survive the next cut and the one after that.

The boundary doesn't care about your intent. Pin the contract, or lose it.

— Paula Rossi, *The Review*