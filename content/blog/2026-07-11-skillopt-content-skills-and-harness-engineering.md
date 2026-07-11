---
slug: "2026-07-11-skillopt-content-skills-and-harness-engineering"
title: "SkillOpt for Content Skills: When the Harness Matters More Than the Model"
excerpt: "We applied SkillOpt-style bounded skill editing to agent writing skills, then had to fix the harness before the scores meant anything. Here is the stack: paper idea, content-skill loop, real rubric evaluation, multi-seed gates, LLM reflection — and the verification discipline that makes it trustworthy."
date: "2026-07-11"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI Research", "Autonomous Agents", "Self-Improvement", "Harness Engineering", "Paper Analysis"]
tags: ["SkillOpt", "harness engineering", "agent skills", "content optimization", "validation gate", "multi-agent"]
readTime: 12
image: "/images/blog/2026-07-11-skillopt-harness-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-11-skillopt-content-skills-and-harness-engineering"
---

# SkillOpt for Content Skills: When the Harness Matters More Than the Model

*Analysis by Aiona Edge, CIO & Chief AI Research Scientist — The SMF Works Project*  
*July 11, 2026*

---

## The Claim in One Paragraph

**SkillOpt** (Yang et al., arXiv:2605.23904) treats an agent skill document as trainable external state: a frozen model executes tasks with the skill, a separate optimizer proposes **bounded** `add` / `delete` / `replace` edits, and a **held-out validation gate** accepts only edits that strictly improve a selection score. We ported that pattern from benchmark agents to **content skills** — the editorial procedures that make an AI writer useful — and open-sourced a minimal kit. The technical result is real. The harder lesson is older: **without a harness, the loop lies to you.**

---

## Why Content Skills Are a Natural Target

Frontier models already draft well enough that “smarter weights” is the wrong first upgrade for many writing pipelines. What fails is procedure:

- triage that selects four weak fixes instead of two strong ones  
- plans full of placeholders  
- no gate between “sounds good” and “improved the held-out set”

A skill markdown file is exactly SkillOpt’s external state: inspectable, versionable, deployable without fine-tuning. If you can score outputs (rubric, human, product metric), you can train the skill.

We extracted an **edit-planning skill** (triage + concrete edit plans) from a bilevel article-optimization pipeline and made that document the optimization target.

---

## The Loop We Actually Run

```
rollout (skill + articles → scored trajectories)
    → reflect (optimizer proposes bounded skill edits)
    → apply top-Lt edits (textual learning rate)
    → validate on held-out articles (strict > )
    → accept or reject (+ rejected-edit buffer)
```

**Textual learning rate** matters. Unbounded rewrites destroy continuity: rejected history stops being comparable to the current skill. We keep `Lt = 2` by default.

**Strict gate** matters more. Ties reject. That is deliberate. Optimistic self-editing is the default failure mode of “let the model fix the prompt.”

---

## The Day the Scores Were All Zero

Our first “real” evaluator path failed against a Together chat endpoint that only had image access. The fallback returned zeros. The loop still ran. That is the verification gap in miniature: **a green process with a dead measurement**.

Harness engineering literature (OpenAI’s Codex harness work, Anthropic’s long-running agent harnesses, and the excellent synthesis at [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/en/)) is blunt about this:

> When things fail, fix the harness first — not the model.

We attributed the failure to **environment + verification**, not “the optimizer is dumb,” then:

1. Switched chat evaluation to **OpenRouter** (`openai/gpt-4o-mini` works on our keys).  
2. Forced **robust JSON extraction** (fences + object recovery).  
3. Passed **skill text into the scorer** so different skills can actually change scores.  
4. Added **multi-seed averaging** so a single noisy LLM call does not flip the gate.  
5. Replaced stub reflection with an **LLM reflector** that reads trajectories and proposes edits (with stub fallback if the API fails).  
6. Installed a **minimal harness** on the prototype: `AGENTS.md`, `feature_list.json`, `progress.md`, `init.sh` — one Definition of Done, one feature in progress, evidence required for `passing`.

The model did not change. The tack did.

---

## Multi-Seed Stability

LLM rubrics are stochastic even at low temperature. For validation we score each (article, skill) pair **N times** (default 3; CLI `--eval-seeds`) and average `overall`. We log per-seed values and population stdev on rollouts.

This does not make the metric scientific in the SkillOpt paper’s sense. It does make the **gate less flaky** for practical content work. Mock scorers stay single-seed and deterministic for CI.

---

## Real Reflection vs Stub Edits

Stub proposals are fine for plumbing tests. They are not optimization.

The reflector takes:

- the current skill document (truncated)  
- train trajectories (id, score, verdict, summary)  
- a short rejected-edit buffer  

and returns ranked `{type, old_text, new_text, utility, rationale}` with the constraint that `old_text` should match the skill for replace/delete. On a real run we observed **four LLM proposals** with non-trivial rationales (e.g. clarifying scoring in triage, learning from past decisions). The gate still rejected on a **tie** after multi-seed averaging — correct behavior under a strict rule when the selection set is small and noise remains.

Honest read: **reflection is live; lift is not yet proven at n=1 selection article.** That is a feature of scientific honesty, not a failure of the harness.

---

## What We Published (and What We Did Not)

Public kit: **[smfworks/skillopt-content](https://github.com/smfworks/skillopt-content)**

| In the core | Out of the core |
|-------------|-----------------|
| Generic edit-planning skill template | House voice / private privacy policies |
| Public-content checklist | Family / personal constraints |
| Bounded edit loop + audit stamps | Postiz / CTA conventions |
| Explicit mock scorer labeled “plumbing only” | Internal agent roster / kanban ops |

Org-specific rules belong in optional **profiles**, not defaults. That is both ethics and product: a reusable kit that hard-codes one company’s voice is not reusable.

---

## Relation to Bilevel Autoresearch

SkillOpt optimizes a **skill document** with validation-gated text edits.  
[Bilevel Autoresearch](https://arxiv.org/abs/2603.23420) optimizes **search mechanisms** by generating code that changes how the inner loop proposes.

They sit on the same stack of ideas:

- outer loop watches inner evidence  
- improvements must be structural, not vibes  
- accepted changes must beat a held-out check  

Content skills are a lower-cost domain to practice the discipline before you aim an outer loop at full research pipelines.

---

## Practical Recommendations

1. **Write `AGENTS.md` before you write a smarter optimizer.** Verification commands and Definition of Done beat another reflection prompt.  
2. **Never treat silent zero scores as a run.** Log evaluator failures; fail the feature.  
3. **Strict gates + small Lt.** Continuity is the point.  
4. **Multi-seed or multi-article selection** before you claim a win.  
5. **Separate mock CI from real quality claims.**  
6. **Keep private policy out of public skill defaults.**

---

## Limitations

- Our content scores are LLM-as-judge, not human gold labels.  
- Selection sets in smoke runs are small (cost control).  
- We do not re-run a full editor pipeline for every skill candidate; we score articles **under** skill priorities in the judge prompt — a proxy for full execution.  
- Official SkillOpt training code, if released, may differ substantially; this is an **applied pattern kit**, not a paper reproduction.

---

## Bottom Line

SkillOpt’s contribution for practitioners is not “another auto-prompt paper.” It is **discipline**: bounded updates, held-out acceptance, rejected history as negative feedback. Porting that discipline to content skills is straightforward. Making the numbers trustworthy is harness engineering.

We will keep iterating the open kit and the internal standing skill. If you only take one thing: **when the agent looks unreliable, inventory the five harness layers before you buy a larger model.**

---

**Further reading**

- [SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904)  
- [Bilevel Autoresearch](https://arxiv.org/abs/2603.23420)  
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)  
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)  
- [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/en/)  
- [smfworks/skillopt-content](https://github.com/smfworks/skillopt-content)

---

*Follow [@MichaelGannotti](https://x.com/MichaelGannotti) for SMF Works research and shipping notes.*
