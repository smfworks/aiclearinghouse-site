---
slug: "forking-the-swarm-product-line-verticals-from-an-open-source-agent-platform"
title: "Forking the Swarm: Building Product-Line Verticals from an Open-Source Agent Platform"
excerpt: "How we took SMF Swarm 2.0 — a governance-first, multi-persona predictive analysis engine — from a single open-source codebase to a private vertical fork in one day. The mechanics of product-line seeding, upstream sync strategy, domain-specific schema engineering, and the model comparison that decided which LLM backend ships first."
date: "2026-07-14"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Software Architecture", "Open Source", "Agent Systems"]
tags: ["multi-agent", "product-line-architecture", "open-source", "LLM", "governance"]
readTime: 18
image: "/images/blog/forking-the-swarm-product-line-verticals.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/forking-the-swarm-product-line-verticals-from-an-open-source-agent-platform"
---

There's a pattern in software engineering that most teams discover the hard way: you build a general-purpose platform, it works, and then someone asks "can we use this for [specific industry]?" That question is where architecture meets reality. Today I want to walk through exactly how we answered it — not in theory, but in a single day of actual engineering on SMF Swarm 2.0.

We took our open-source governance-first predictive analysis platform and built a private vertical fork for forensic engineering. In one day. With tests passing, a model comparison run, deployment collateral written, and the base repo opened to the public. This is the full technical story.

## The Starting Point: What SMF Swarm 2.0 Actually Is

SMF Swarm 2.0 is a predictive analysis application built around a simple but powerful idea: instead of asking one model one question, you run a multi-persona analysis where different agent perspectives — Scout, Mechanisms Analyst, Skeptic, Forecaster — each examine the problem from their own angle, then synthesize into a structured decision brief.

The architecture has four core layers:

1. **Analysis engine** — multi-persona LLM pipeline with mock and real LLM modes
2. **Governance layer** — identity, audit trails, chain validation, language guard
3. **Application layer** — FastAPI server with static UI, API endpoints, history
4. **CLI** — headless `smf-swarm analyze` for automation and CI

The platform runs on any OpenAI-compatible LLM endpoint. Mock mode provides offline heuristics for testing. The whole thing is a Python package installable with `pip install -e ".[app]"` and serves a web UI on localhost in under a minute.

Version 0.5.0 had a working engine, governance audit, UI with file attachment, history with signed share links, and 46 passing tests. It was general-purpose by design — no domain-specific logic, no industry assumptions, no specialized prompts.

That generality was the point. It was also the problem.

## The Architecture Decision: Fork vs. Module vs. Config

When you need industry-specific behavior, there are three common approaches:

**Option A: Configuration files.** Ship domain configs as JSON/YAML packs. The core engine reads them and adjusts prompts, schema, and outputs. Pros: single codebase. Cons: domain logic bleeds into core, config format becomes a DSL, testing gets complex, and every new vertical adds surface area to the shared code.

**Option B: Plugin modules.** Define extension points in the core. Verticals ship as installable packages that register handlers. Pros: clean separation. Cons: plugin API becomes a stable contract you can't refactor freely, and the orchestration overhead grows with each plugin.

**Option C: Product-line fork.** Seed a new repo from the core. The vertical owns its entire codebase — schema, prompts, playbooks, UI. The core remains a clean general-purpose platform. The vertical pulls upstream changes deliberately.

We chose **Option C**, and the reasoning is worth explaining because it's not the default choice in 2026's "everything is a plugin" culture.

### Why Product-Line Forking Won

The key insight is about **change velocity and ownership**. A vertical serving a specific industry has different needs than a general-purpose platform:

- **Different change cadence.** The platform core evolves on its own schedule. A vertical needs to move fast on domain-specific features without waiting for core releases or worrying about breaking other verticals.
- **Different quality bar.** The platform core needs broad correctness. A vertical needs domain-specific validation — in our case, a language guard that catches PE-opinion language before it reaches a client.
- **Different privacy.** The platform core is open source. A vertical may contain proprietary playbooks, domain schemas, and client-facing logic that should stay private.
- **Different deployment surface.** The platform runs anywhere. A vertical may have specific security requirements — in our case, secure mode defaults, public share disabled, API token required.

A product-line fork gives each vertical full ownership of its codebase while maintaining a deliberate upstream relationship. It's the approach used by Linux distributions, by Red Hat from upstream kernel, by every vendor fork of Kubernetes. It's battle-tested.

The tradeoff: you carry some duplicate code, and upstream sync is manual. We accepted both because the alternative — a plugin API that constrains core evolution and a config format that becomes an accidental DSL — costs more over time.

## The Seeding Process: How We Forked

We didn't use GitHub's fork button. GitHub forks create a network-linked copy that can't be made private independently and carries constraints around issues, actions, and visibility. Instead, we did a **product-line seed**: a clean clone with reset history that establishes an `upstream` remote for deliberate sync.

Here's the exact sequence:

```bash
# 1. Clone the base
git clone git@github.com:smfworks/smf-swarm-2.0.git smf-swarm-2.0-fe
cd smf-swarm-2.0-fe

# 2. Cut history, keep files
git checkout --orphan vertical-fe
git add -A
git commit -m "seed: product-line fork from smf-swarm-2.0 v0.5.0"

# 3. Replace main, push to a new private repo
git branch -M main
git remote set-url origin git@github.com:smfworks/smf-swarm-2.0-fe.git
git push -u origin main

# 4. Keep upstream for deliberate sync
git remote add upstream git@github.com:smfworks/smf-swarm-2.0.git
```

The result: a private repo with a clean starting point, full ownership of the codebase, and an `upstream` remote pointing at the public core. **Base changes never auto-flow.** When we want them, we `git fetch upstream && git merge upstream/main --no-ff`, resolve conflicts, and run tests. Deliberate, auditable, and safe.

This is documented in the FE repo's `docs/UPSTREAM_SYNC.md` so anyone touching the repo knows the procedure.

## The Vertical: What We Built on Top

The forensic engineering vertical adds five layers of domain-specific logic on top of the platform core. None of this exists in the base. All of it is private.

### 1. Analysis Profiles

The base engine has one mode: analyze. The FE vertical introduces four named profiles that map to real forensic engineering workflows:

| Profile | Use Case | What It Does |
|---------|----------|--------------|
| `triage` | UC-1: Early case assessment | Rapid retain/decline signal, top gaps, ranked first actions |
| `investigate` | UC-2: Active investigation | Hypothesis development, evidence accounting, scenario building |
| `depo_prep` | UC-3: Deposition preparation | Question generation, weakness surfacing, adversarial testing |
| `general` | Fallback | Standard multi-persona brief |

Each profile gets its own system prompt, persona weighting, and output schema emphasis. The `triage` profile prioritizes speed and decision signal — confidence, key gaps, retain/decline recommendation. The `investigate` profile prioritizes depth — full hypothesis matrix, evidence cross-reference, scenario analysis.

### 2. FE Brief Schema

The base engine returns a general predictive report. The FE vertical extends this with a forensic-specific schema:

```
analysis_profile: triage | investigate | depo_prep | general
matter_type: mv | buildings | fire | biomechanics | general
pe_gates: [string]        # Professional engineering guardrail statements
information_gaps: [string] # Evidence gaps ranked by uncertainty reduction
key_drivers: [string]     # Factors most likely to influence outcome
recommended_actions: [string] # Ranked, gap-linked next steps
hypotheses: [{id, statement, support, gaps, status}]
scenarios: [string]       # Alternative outcome scenarios
time_horizon: string      # How far out the prediction extends
```

Every field maps to something a forensic engineer actually uses in case work. The schema isn't academic — it's shaped by how decisions get made in practice.

### 3. Language Guard

This is the most critical piece. Forensic engineering is a licensed profession. In North Carolina, for example, engineering opinions are regulated under G.S. 89C and NCBELS. An AI system that casually states "the cause of failure was X" isn't just wrong — it's practicing engineering without a license.

The language guard is a post-processing layer that scans every LLM output for PE-opinion language and either rewrites or flags it:

- "cause of failure was X" → "evidence is consistent with X as a contributing factor"
- "defect in the design" → "apparent deviation from design intent"
- "code nonconformance" → "potential code issue requiring PE verification"
- "expert opinion" → "decision support analysis"

The guard runs after every LLM call, before the report is stored or displayed. It's not optional. It's baked into the engine pipeline.

### 4. Domain Playbooks

Each matter type has a playbook — a markdown file that injects domain context into the system prompt:

- **Motor vehicle (mv):** EDR data, photogrammetry, skid analysis, visibility factors
- **Buildings:** Flashing, WRB, sealant, moisture intrusion, construction documents
- **Fire:** Origin analysis, fuel load, ventilation, fire dynamics
- **Biomechanics:** Injury mechanics, force analysis, biomechanical thresholds

Playbooks are loaded by the engine based on the `matter_type` field. They give the LLM domain vocabulary and investigation patterns without hardcoding domain logic into the engine itself.

### 5. Demo Packets

For testing and dogfooding, we created two synthetic case packets:

**MV Night Pedestrian:** A nighttime pedestrian collision with incomplete police report, pending witness statement, and no EDR data extracted yet. The triage profile should surface evidence gaps (EDR, lighting, scene photos) and recommend a retain/decline decision signal.

**Buildings Water Intrusion:** A multi-floor water intrusion case with permit drawings, daily reports, and interior photos. The investigate profile should develop hypotheses about installation vs. design vs. maintenance causes and identify what evidence would discriminate between them.

These packets are synthetic — no real case data. They exist to prove the engine produces domain-specific output, not generic templates.

## The Engine Fix: Making Reasoning Models Return JSON

During the dogfood run, we hit a real bug that's worth sharing because it's a common issue with reasoning-mode LLMs.

The DGX endpoint runs `unsloth/Qwen3.6-35B-A3B-NVFP4` via vLLM. Qwen3.6 supports a thinking mode where the model produces extended reasoning in a `reasoning` field and the actual answer in `content`. When `enable_thinking` defaults to `true`, the model spends all its tokens on reasoning and returns an empty `content` field.

Our engine was reading `content` first and falling back to `reasoning` — but the reasoning text is chain-of-thought, not structured JSON. The parser couldn't find a JSON object and the engine returned an inconclusive fallback.

The fix had two parts:

```python
# 1. Tell vLLM to disable thinking so JSON lands in content
body = {
    "model": self.model,
    "messages": [...],
    "chat_template_kwargs": {"enable_thinking": False},
    "max_tokens": 4500,
}

# 2. Try content first, then reasoning, then concatenated
content = (msg.get("content") or "").strip()
reasoning = (msg.get("reasoning") or "").strip()
candidates = [t for t in (content, reasoning) if t]
for text in candidates:
    try:
        return _parse_llm_report(text)
    except Exception:
        continue
```

The system prompt also got a nudge: "Put the final answer as a single JSON object in the assistant content field." This is important because reasoning models will sometimes put their "final answer" at the end of a long reasoning chain, which may get truncated by `max_tokens`.

After the fix, DGX went from returning empty FE fields to producing structured briefs with correct gaps, hypotheses, and ranked actions.

This is the kind of integration bug that only surfaces when you actually run the system against a real endpoint. Mock mode doesn't catch it. Unit tests don't catch it. You have to dogfood.

## The Model Comparison: DGX vs. Ollama vs. Mock

We built a comparison script that runs both demo packets through three backends and produces a side-by-side table. The results were clear and instructive.

### Results

| Packet | Backend | Time | Confidence | Gaps | Hypotheses | Actions |
|--------|---------|------|-------------|------|------------|---------|
| MV triage | Mock | ~0s | 77% | 4 | 2 | 4 |
| MV triage | Ollama | 59s | 60% | 5 | 3 | 5 |
| MV triage | DGX | 24s | 30% | 7 | 3 | 5 |
| Buildings | Mock | ~0s | 77% | 4 | 2 | 4 |
| Buildings | Ollama | 58s | 62% | 5 | 3 | 5 |
| Buildings | DGX | 30s | 65% | 5 | 3 | 5 |

### What the Numbers Say

**Mock is fast but generic.** It returns the same gaps and actions regardless of matter type. "Primary source completeness unknown" and "Matter-specific tests not yet scheduled" aren't wrong, but they're not useful to a forensic engineer who needs to know whether to image EDR data or request shop drawings.

**Ollama (gpt-oss:20b) is solid but slow.** It produces matter-specific gaps (EDR data, nighttime lighting, window shop drawings, as-built verification) and ranked actions. At ~58-59 seconds per analysis, it's usable but feels like a batch job, not an interactive tool.

**DGX (Qwen3.6-35B) is faster and more specific.** ~24-30 seconds per analysis with deeper domain reasoning. The MV triage returned "High Risk Retain: Evidence Gap Critical" with 7 gaps — more than Ollama's 5 — and the gaps were more specific (EDR speed/braking/throttle status, street lighting illuminance levels). The buildings investigation correctly framed the hypothesis space as "Design-Install Gap or Sealant Deficiency" with gap-linked actions referencing specific documents.

**The confidence numbers tell a story.** Mock returns 77% always — it's a heuristic, not an assessment. Ollama returns 60-62% — moderate confidence. DGX returns 30% on MV triage and 65% on buildings. The 30% on MV isn't a bug — it's the model correctly identifying that the evidence packet is critically incomplete. A 30% confidence on a triage with missing EDR data and no witness statement is honest. A 77% from the mock is not.

### The Decision

DGX is the primary backend for the pilot. Ollama is the backup. Mock is for CI and offline demos only. This isn't a model benchmark — it's a domain-specific evaluation that matters because the results go into real decision workflows.

## Open-Sourcing the Base

With the vertical fork built and tested, we opened the platform core to the public.

```bash
gh repo edit smfworks/smf-swarm-2.0 \
  --visibility public \
  --description "SMF Swarm 2.0 — open-source governance-first multi-persona 
  predictive analysis app (platform core). Commercial verticals live in private repos."
```

The base repo is now **public MIT** at [github.com/smfworks/smf-swarm-2.0](https://github.com/smfworks/smf-swarm-2.0). The forensic engineering fork stays **private** at `smfworks/smf-swarm-2.0-fe`.

This is the model that works: open core, private verticals. The community gets a governance-first predictive analysis platform they can run, extend, and contribute to. The verticals get proprietary domain logic, playbooks, and client-facing features that stay under SMF Works' control.

We ran a safety scan before flipping visibility — checking for API keys, credentials, private endpoint URLs, and anything that shouldn't be public. The scan found only documentation about environment variables (variable names, not values). No real secrets. The base was clean to open.

## The Test Bar

50 tests pass. That's the number. Here's what they cover:

- **Engine tests:** Mock analysis produces correct schema fields, confidence ranges, persona views
- **FE schema tests:** Profile normalization (uc1 → triage, UC-2 → investigate, depo → depo_prep), matter type handling
- **Language guard tests:** PE-opinion phrases get caught and rewritten
- **API tests:** Health endpoint, analyze endpoint with mock and LLM modes, history retrieval, export
- **Pilot-ready tests:** Feedback API accepts and stores thumbs + notes, CLI profile/matter flags work
- **Security tests:** API token enforcement, public share toggle, private LLM host blocking in secure mode

Tests run in under a second. `pytest -q` is the gate. If it's not green, nothing ships.

## What's Actually Shipped

Let me be precise about the state of things at the end of this day:

**Base platform (`smfworks/smf-swarm-2.0`):** Public, MIT, v0.5.0. General-purpose governance-first predictive analysis with mock and LLM modes, web UI, CLI, history with signed share links, security middleware.

**FE vertical (`smfworks/smf-swarm-2.0-fe`):** Private, v0.5.3. Four analysis profiles, five matter types, FE brief schema, language guard, four domain playbooks, two demo packets, feedback capture, CLI profile/matter flags, deploy runbook, dogfood comparison script. 50 tests passing.

**Collateral:**
- Deploy runbook (`docs/DEPLOY_RUNBOOK.md`) — token setup, serve command, TLS notes, history path, backup
- Model recommendation slide (`docs/pilots/IMPACT_WEEK1_MODEL_RECOMMENDATION.html`) — one-page comparison with decision rationale
- Dogfood comparison data (`data/dogfood_compare/COMPARE.md`) — raw results from mock vs. Ollama vs. DGX
- Upstream sync procedure (`docs/UPSTREAM_SYNC.md`) — how to pull base changes deliberately

## What We Learned

A few things crystallized during this build that are worth naming:

**Product-line forking is underrated.** The plugin ecosystem culture of 2026 pushes everything toward extension points and registries. But for verticals that need different change velocities, different privacy, and different quality bars, owning your codebase is liberating. You refactor freely. You ship domain features without coordination overhead. You keep proprietary logic private. The cost is manual upstream sync, which is a solved problem.

**Reasoning models need explicit JSON instructions.** If you're running Qwen3 or any thinking-mode LLM through vLLM for structured output, pass `chat_template_kwargs: {enable_thinking: false}` and explicitly tell the model to put the answer in the content field. Otherwise you'll get beautiful reasoning and an empty response.

**Mock mode is necessary but insufficient.** Mock proves the pipeline works. It doesn't prove the output is useful. You have to run real LLM passes against real packets before you put the system in front of users. The gap between "46 tests pass" and "the output is actually domain-specific" is where dogfooding lives.

**Confidence numbers are signals, not scores.** A 30% confidence on an incomplete evidence packet is more honest than a 77% from a heuristic. Don't optimize for high confidence — optimize for confidence that reflects the evidence quality.

**Open core / private vertical is a clean split.** The community gets the platform. The business gets the verticals. Neither constrains the other. The upstream relationship is deliberate and documented.

## What's Next

The vertical is built and tested. The base is open. The model comparison is done. What comes next is the part that can't be done in code: putting the system in front of people who do this work for a living and listening to what they say.

The engine is ready. The feedback loop is wired. The playbooks are loaded. Now we find out what we got wrong.

That's the point of building in public — not to claim we got it right, but to show the work and let reality correct us.

---

*SMF Swarm 2.0 (platform core) is open source under MIT at [github.com/smfworks/smf-swarm-2.0](https://github.com/smfworks/smf-swarm-2.0). The Forensic Engineering vertical is a private commercial fork. If you're interested in the platform or in exploring a vertical for your domain, follow along — we're building in public.*