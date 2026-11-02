---
slug: "2026-11-02-deepseek-superagent-design-reference-not-dependency"
title: "DeepSeek Shipped a Super-Agent. We Read the Code Instead of Installing It."
excerpt: "The dsh-superagent prototype and DeepSeek Harness repos look like the future in the README. On disk, the governance is real and the headline modules are missing. Here is what a Hermes fleet should take, adapt, and refuse — with pinned SHAs."
date: "2026-11-02T09:30:00-05:00"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["Agent Architecture", "DeepSeek", "Hermes Agent", "Security"]
tags: ["super-agent", "observe-mode", "spill", "design-reference"]
readTime: 14
image: "/images/blog/2026-11-02-deepseek-superagent-design-reference-not-dependency-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-02-deepseek-superagent-design-reference-not-dependency"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

DeepSeek published an article on super-agent design — a router that holds context, workers that hold tasks, an event layer that lets the agent act before it is asked. The article got heavy circulation. Two repos back it: [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)[1] and [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)[2].

If you run agents, the pressure is to install the thing the article describes. This post is the alternative: we cloned both repos, read the trees instead of the landing pages, and compared every promised module against what is on disk. The result is a steal list, not an install.

**Verdict up front: design reference. Not a usable dependency.**[5] The governance is real and worth copying. The runtime should stay off your machines.

## Pins, so you can check us

We cloned shallow and re-fetched before writing. Both MIT.[1][2]

| Repo | Pinned SHA | Commit |
|---|---|---|
| dsh-superagent-prototype | `6337fc823ce20251c8de8085948165c81aaa701e` | 2026-10-31, "feat: add the dsh-superagent research prototype"[1] |
| deepseek-harness | `ce7073d51254c26cd63b22a60835b8f948deb447` | 2026-10-30, merge PR #7552[2] |

The prototype is 216 files and readable in an evening.[1] The harness is 20,233 files;[2] we read its architecture docs and the packages that matter, not all of it, and we say below where that limit bites.

## What the article promised vs. what the code ships

This is the part most coverage skips. The article describes five modules. The prototype ships a subset, and it is the boring half.

| Module from the article | In the prototype? |
|---|---|
| Router / worker split | Yes — an Engine with intake, evals, tickets, assignments, replies.[10] The router prompt forbids the orchestrator from implementing work.[13] |
| Subscription pass-through | Yes — thread messages reach a ticket's workers as context and grant no new authority.[3] |
| Observe-before-auto | Yes — accept modes `off` / `observe` (default) / `auto`. Observe records "would accept" and starts nothing, verified in `src/policy.ts`.[3] |
| Mandates with a policy version | Yes — every accepted ticket records why it was allowed, and resume re-checks that reason.[3] |
| Watchdog | **No.** Zero matches in the tree. |
| Chain of Recall | **No.** Thread and ticket IDs form an implicit graph; no recall machinery. |
| Speculative "silently reproduce and fix" | **No.** The word does not appear. Observe mode is the shipped version. |
| Cloud compute/state split | **No.** State is one SQLite file behind a directory lock. |

A team that writes honest READMEs has already told you where the bodies are buried. The prototype's own README says it is research code, not the article, and that some article designs are future work.[1] Believe it. We did, and it changed what we took.

## The four patterns worth stealing

### 1. Observe mode

The whole mechanism is three lines in `src/policy.ts`: when a candidate is inferred rather than explicitly requested, and the mode is not `auto`, the assessment still runs, a proposal is still formed, and the outcome is recorded as `would_accept: true` instead of starting work.[3] A person reviews the log and flips scopes deliberately.

This is speculative execution with the write switch off. It is also the cheapest trust-building tool in the repo: you get a week of "here is what I would have done" before the agent does anything. Their default is observe, not auto.[3] Ours should be too.

### 2. Two paths, two strengths

The admission matrix in `src/admission.ts` is 13 lines: an allowed sender addressing the agent is an explicit request; everything else defaults to inferred or ignored.[3] Follow-ups on a thread the agent already owns flow to that ticket as context — and grant no new authority.[3] Every ticket carries a mandate that records the basis it was admitted on, and resume re-validates that basis.[3]

Most agent setups (ours included, before this) have the fast path only: an allowlist. What the prototype adds is the object that remembers *why* work was allowed, and the rule that the reason is re-checked before work resumes. If you build any kind of event trigger, build this first.

### 3. The attention budget, written as prompt

The orchestrator prompt is 16 lines and contains rules like "never wait for them with sleep, polling or job waits; end the turn when nothing is left to do."[13] The philosophy doc[4] goes further: the agent "speaks only when a person must act or can use a result," "confirms a request once," "stays quiet while it works," and — our favorite — "stops by impact, not by effort."[4] A local change goes as far as a reviewable result; anything needing a design decision stops with a question.

Zero code. Copy the discipline. It maps onto any multi-agent fleet's room rules.

### 4. Spill with a locator, and jobs as events

In the harness (not the prototype): oversized tool results keep a head and a tail inside a shared token budget, the full text goes to a file, and the result carries a path.[6] If the spill write fails, the original text stays — fail open to wasteful, never to lossy.[6] Compare with naive truncation, which drops the middle and leaves the agent guessing.

Background jobs belong to the session that started them, and completion arrives as a message rather than a poll.[8] Small patterns, both worth re-implementing in your own stack.

## What to refuse

- **The runtime.** SAFETY.md: "has not undergone a security audit and must not be treated as secure or production-ready," and "Do not rely on DeepSeek Harness as the sole security control for untrusted workloads."[5] The prototype's workers run commands without approval as the operator's OS user, and the docs admit the blocklist is a naming convention: "A worker can still execute a program by absolute path."[9]
- **Auto-merge.** The default instructions forbid the agent account from merging because "GitHub attributes the merge to whoever enabled it."[9] Their guardrails are sensible for their team. The capability is still a release decision made by software.
- **Volume.** Their own philosophy doc: "Do not use it to produce volume. Mass pull requests, broadcast messages and busywork cost the team more than they give."[4] The article's flashiest demo — a fix PR opened from an unmentioned group chat — is the behavior their own doc warns against.
- **Computer-use and browser-use.**[2] Same class of tool as the fake-keystroke incident class every desktop operator eventually meets. The harness ships several; the desktop rule does not get an exception for a fancier keystroke.
- **Cordis as a migration.** The plugin model is a good reference for seams.[2] Porting a second runtime means maintaining two plugin semantics forever.

## The privacy asterisk we owe you

The harness ships `packages/telemetry/` — "reporting infrastructure shared by product analytics and feedback-authorized Session uploads."[12] We traced the prototype (clean) but did not trace all 20,233 files of the harness to establish whether the default `dsh web` bundle mounts that reporting.[2] So the honest position is: enough to refuse install, not enough to call the default profile clean. Asymmetry on purpose — absence of evidence at that file count is not clearance, and model calls authenticate with `DEEPSEEK_API_KEY` and optionally a custom `DEEPSEEK_BASE_URL`.[2]

## What a Hermes fleet should actually do

We run a multi-agent fleet on Hermes. Reading the DeepSeek code against it, the striking thing is how much of the article's skeleton Hermes already has: a gateway that holds context across channels, delegation as the worker layer, state in SQLite, memory you can audit. The gaps are the governance objects, not the runtime.

Our change proposal, in order, each its own approval:

1. **Observe mode** — log would-have-acted candidates for a week; review; only then discuss flipping any scope to auto.
2. **Child-env scrub** — drop env vars whose names match `*KEY*`, `*SECRET*`, `*TOKEN*`, `*PASSWORD*` before spawning anything. The harness's credentials group keeps secret values out of configuration entirely: names in config, values in a private same-user file.[7] It is a day of work and it closes a live leak class.
3. **Spill** — head, tail, locator, fail-open. A couple of days including tests.

None of it installs DeepSeek. All of it is rewritable in a weekend.

## The takeaway

The article describes an architecture; the repos ship its governance layer and a lot of unshipped promise.[1][2] The governance is the valuable part, it is small, and it transfers to any fleet without adopting anyone's runtime. Read the trees. Pin the SHA. Take the observe mode. Leave the shovel in the ground.

*Analysis notes with full source links: pinned-SHA table above; all claims above were checked against the trees at those SHAs. Thanks to the DeepSeek Harness team for publishing working code with honest disclaimers — that combination is rarer than it should be.*

## Sources

[1] https://github.com/deepseek-ai/dsh-superagent-prototype — dsh-superagent-prototype
[2] https://github.com/deepseek-ai/deepseek-harness — deepseek-harness
[3] https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/002-authorization.md — 002 Authorization
[4] https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/000-philosophy.md — 000 Philosophy
[5] https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/SAFETY.md — SAFETY.md
[6] https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/spill/spill-policy/README.md — spill-policy README
[7] https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/credentials/README.md — credentials group README
[8] https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/jobs/README.md — jobs group README
[9] https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/003-execution.md — 003 Execution
[10] https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/007-architecture.md — 007 Architecture
[12] https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/telemetry/README.md — telemetry group README
[13] https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/prompts/orchestrator.md — orchestrator prompt
