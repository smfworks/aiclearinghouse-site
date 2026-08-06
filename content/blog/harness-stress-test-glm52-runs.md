---
slug: "harness-stress-test-glm52-runs"
title: "Stress-Testing the Agent Harness: GLM5.2 Runs, Failure Recovery, and Rubric Insights (Pilot Results)"
excerpt: "Short GoalRunner trajectories and fanouts on the Praxis harness. Simulated failures via subagents. Independent evaluator rubric applied: 3/12 Block. Evidence, gaps, and what the review actually showed. Transparent pilot for the AI community."
date: "2026-08-06"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["AI Agents", "Harness Engineering", "Evaluation"]
tags: ["praxis", "goalrunner", "glm-5.2", "rubric", "stress-test", "pilot"]
readTime: 10
image: "/images/blog/harness-stress-test-glm52-runs-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/harness-stress-test-glm52-runs"
---

**Status (as of 2026-08-06):** Pilot only. Baseline `praxis eval` 30/30 green. Additional fanouts completed (0 failures). Independent reviewer rubric: **3/12 Block**. Full evidence now in repo (PROGRESS.md, `docs/harness/pilot-evidence-2026-08-06.txt`). No feature_list entry added (current WIP=HS11 verticals). This is transparent test output for the blog, not a completed feature.

## What we tested
Crew vote winner (#1, 7 votes) + GLM5.2:cloud request (Morgan). Execute GoalRunner (Level 1 autonomous loop) trajectories, inject simulated failures (bad tool output, planning/verifier issues), measure recovery, apply official evaluator rubric from `smf-praxis/docs/harness/evaluator-rubric.md`.

- **Model:** GLM5.2:cloud via ollama-cloud (intent; observed kimi fallback in some routing).
- **Harness:** smf-praxis (H01–H10 marked passing in feature_list; current active WIP HS11 Homeschool vertical).
- **Method:** Short-named goals + `praxis fanout` for parallel subagent runs (researcher/drafter roles). Failures via goal design.
- **Constraints:** No DGX Spark (offline until ~Aug 15). Host-only (cloud aliases + local ollama). Time-bound pilot.

## Execution evidence (now in repo)
- **Baseline verification:** `praxis eval` 30/30 passed (a2a, approval, browser, context, debate, mcp, orchestration, planning, reasoning, reflexion, retrieval, routing, safety×7, schema, skills, tool_use, verification, voice).
- **pytest:** `tests/test_goal_runner.py` 9/9 passed.
- **CLI:** `praxis goal` and `fanout` available with `--max-turns`, `--threshold`, etc.
- **Fanout runs (multiple, post-review included):** 4+ subagent trajectories (e.g., recovery from bad tool output, verifier on drafts, error messages/self-correction, clean-state after failure). All completed; 0 failures. Parallel execution worked.
- **GoalRunner pilots:** Short runs (e.g., "HStressGLM", "HStressRev1/2"). Progress=1.000 on approved paths. Some hit FS name-length (fixed by shortening goals). Recovery observed in approved cases.
- **Evidence artifacts (added for handoff):**
  - `PROGRESS.md` detailed entry with verification block, fanout results, GLM routing notes, rubric reference.
  - `docs/harness/pilot-evidence-2026-08-06.txt` (full `praxis eval` tail, pytest, CLI snippets, date-stamped).
  - Delegation transcript and subagent summary for the rubric review.

No long-horizon waves (5-10 missions), no durable checkpoint/restart under sustained injection, no token/turn cost tables captured beyond short runs. Host model routing not locked 100% to GLM5.2.

## Independent evaluator rubric (exact from delegation)
Independent subagent (different session, nitpicky, per `docs/harness/evaluator-rubric.md`; maker-checker separation). Reviewed plan + actual recorded execution vs. repo artifacts.

- **Correctness: 1/2** — Trivial "no crash" on shorts works. Does not match detailed plan (waves/missions, full recovery/pivots, restart tests, concrete injection mechanics, GLM5.2+host config, Argus-style metrics). No match to feature_list user_visible_behavior for a stress feature. H10 GoalRunner evidence ancient.
- **Verification: 0/2** — No executable AGENTS.md block (full pytest/eval/ruff/mypy/demo) attached to this pilot in repo. "Baseline green" was assertion only. No evidence fields updated in feature_list, no metrics/logs in artifacts. "Metrics to be captured in blog" = deferred.
- **Scope discipline: 1/2** — Nominally on #1. Minor creep (PROGRESS note while HS11 vertical WIP active). Short trajectories vs. ambitious plan = under-delivery.
- **Reliability: 1/2** — Works once on shorts. No evidence of restart/re-run survival, durable checkpointing, idempotency, or repeated runs under injection.
- **Maintainability: 0/2** — PROGRESS entry terse/incomplete. No traces, no injection method details, no GLM+host config, no docs/harness updates. Violates "evidence before done", repo as record.
- **Handoff readiness: 0/2** — Fresh session cannot answer from repo alone: exact commands, failure types, GLM setup, metrics, unfinished items, next steps. Substance in chat/delegation logs, not artifacts.

**Total: 3/12 — Block**

**Specific feedback (paraphrased from subagent):** Plan/execution mismatch severe. No real failure injection logged or demonstrated in artifacts. Evidence capture never landed in repo. Baseline claims un-backed for this pilot. Prior self-review (10/12) over-generous; independent stricter as required. Positives: GoalRunner primitives exist and are green; baseline was already strong; intent for evidence aligns with harness principles.

Full scorecard in delegation subagent-summary (cached).

## What actually broke (and what didn't)
- **Broke/friction:** Long goal strings → FS path errors (harness artifact naming). Model set for GLM5.2:cloud syntax picky (routing fallback). No 8-turn+ stress in one go. Evidence not persisted to feature_list or harness docs during pilot.
- **Didn't break:** Subagent fanout parallelism (multiple concurrent, 0 failures). Recovery on approved short paths. Baseline evals held. Agent-oriented errors visible in logs.
- **GLM5.2 observations:** Intent via ollama-cloud; handled summaries/recovery where routed. Occasional non-GLM fallback.

## Limitations (evidence ladder, honest)
- Pilot only (short trajectories; FS/name limits prevented deeper runs).
- No Spark → no heavy local eval or long soaks.
- Verification block executed post-facto for this update (not live in every trajectory).
- Rubric applied to plan + limited execution; no re-score after these evidence additions yet.
- No feature_list entry or H-feature extension (WIP discipline on verticals).
- State partially in delegation logs/transcripts rather than pure repo artifacts at time of review.

## Next steps
- Re-execute full plan (longer trajectories, explicit GLM5.2 wiring, real failure injection scripts, metrics tables, restart tests) with artifacts *before* claiming done.
- Update feature_list.json + PROGRESS with concrete evidence + verification commands.
- Re-apply rubric (independent) after fixes.
- When Spark returns: scale to multi-wave, Argus-style.
- If green post-re-execution: add to feature_list, expand blog with full data.

This post is the transparent record of the pilot + independent review. The harness primitives are real and green for bounded use; stress testing exposed the gaps between plan and recorded execution. Building in the open means showing the 3/12 Block too.

*Primary evidence:* `smf-praxis/PROGRESS.md`, `docs/harness/pilot-evidence-2026-08-06.txt`, delegation subagent summary (cached), fanout logs, this post + hero.

---

**Hero image prompt (for generation):** Abstract tech illustration, dark navy background with gold and teal circuit-like lines forming a resilient loop (GoalRunner trajectory), one broken segment being repaired by small agent icons, no text, modern minimalist, 1200x630.

(Generated and placed at public/images/blog/harness-stress-test-glm52-runs-hero.png. Publish via aiclearinghouse-site: frontmatter + hero in place, `npm run build`, push, curl-verify 200/308.)


## VideoForge Pilot Execution (2026-08-06, post-approval)
- Ollama (glm-5.2:cloud): Valid 3-shot JSON storyboard generated in 18s (1354 tokens eval).
- Praxis fanout: VideoForge orchestration subagent completed (2 parallel runs, 0 failures).
- Script: videoforge_pipeline.py executed; report.json produced with storyboard + mock artifacts + harness score 0.85.
- Artifacts: Existing blacksmith-flux3.mp4, civilwar-minimax.mp4 referenced; new /tmp/videoforge-evidence/run-001.log and report.json.
- Mage Flow: Framework inspected (prompt following, resolution, editing categories); real outputs from prior runs available.
- Next immediate: Wire real OpenRouter calls (when key available), integrate Prime Intellect for distributed gen, run full rubric verification.

Evidence: /tmp/videoforge-evidence/, PROGRESS.md, feature_list.json (VF01 in_progress).
