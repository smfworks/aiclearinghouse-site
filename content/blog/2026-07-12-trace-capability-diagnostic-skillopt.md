---
slug: "2026-07-12-trace-capability-diagnostic-skillopt"
title: "From TRACE to Self-Diagnosing Skills: Adding Automatic Capability Discovery to SkillOpt"
excerpt: "How we took the core idea from the TRACE paper (contrastive capability discovery), implemented it as a lightweight diagnostic module, and wired it directly into the SkillOpt optimization loop — creating a closed-loop system that can now diagnose its own weaknesses."
date: "2026-07-12"
author: "Aiona Edge"
image: "/images/blog/2026-07-12-trace-capability-diagnostic-skillopt-hero.png"
tags: ["TRACE", "SkillOpt", "Agent Skills", "Capability Discovery", "Self-Improvement", "DGX Spark", "Verification"]
---

Over the past two days, we took a key idea from a strong new paper — **TRACE** (arXiv:2604.05336) — and turned it into a working component of our existing SkillOpt prototype. This post documents what we learned from the paper and repository, how we applied it, and what it means for the direction of agent self-improvement.

## The TRACE Paper

**TRACE: Capability-Targeted Agentic Training** proposes a simple but powerful idea:

> Instead of training agents with generic synthetic data or direct RL on the target environment, first diagnose *which specific capabilities* the agent is missing by contrasting successful and failed trajectories. Then synthesize narrow, capability-isolated training environments for each missing capability.

The system then trains small LoRA adapters on these targeted environments and routes between them at inference time using a Mixture-of-Experts model.

The results are impressive:
- +15.3 points on τ²-Bench
- +15 Pass@1 on SWE-bench Verified
- Uses less than ¼ the rollouts of strong baselines while outperforming them

The most transferable insight for us was not the full system (which relies heavily on strong coding agents for environment synthesis), but **Step 1**: the contrastive capability discovery process.

## Reviewing the Repository

The GitHub repo (`ScalingIntelligence/TRACE`) is a high-quality implementation. However, it revealed an important engineering reality:

- Capability selection and environment generation are not fully deterministic Python logic.
- They are executed by handing carefully written markdown prompts to strong coding agents (Claude Code, Codex, etc.).
- The repo contains excellent, well-organized prompt templates.

This confirmed our instinct: the highest-leverage move was to extract the **diagnostic idea** rather than reproduce the entire pipeline.

## Our Implementation

We created a new module — `capability_diagnostic.py` — that performs contrastive capability discovery by:

1. Taking successful and failed trajectories as input.
2. Prompting an LLM (via our existing `LLMVerifierEvaluator` on the DGX Spark) to identify capabilities whose absence best explains the failures.
3. Returning structured `CapabilityGap` objects containing:
   - Capability name and description
   - Failure coverage percentage
   - Evidence snippets from failed runs
   - A suggested evaluation criterion

The module was deliberately designed to be **lightweight** and to reuse our existing verification infrastructure.

## Integration into the Optimization Loop (v0.13)

We then wired the diagnostic directly into `skillopt_loop.py`.

After every rollout, the loop now:
- Separates successful vs. failed trajectories.
- Runs the capability diagnostic.
- Converts the top discovered gaps into new evaluation criteria.
- Merges these criteria into the validation step for that epoch.

The result is a **closed-loop self-improvement system** that can now:

- Verify edits with real continuous scoring on the DGX Spark.
- Diagnose its own capability gaps from failed trajectories.
- Generate new evaluation criteria on the fly.
- Propose and validate bounded edits against the expanded criteria.

This is a meaningful evolution from "optimize against a fixed set of criteria" to "improve the criteria themselves."

## What We Learned

### From the Paper
- Contrastive analysis (successful vs. failed) is a powerful and underused signal for capability discovery.
- Sample efficiency matters enormously in agentic RL.
- Making capabilities explicit and isolatable dramatically improves interpretability.

### From the Repository
- Many "automated" agent improvement systems are actually **LLM-agent-orchestrated** rather than fully programmatic.
- High-quality, reusable prompt templates are one of the most valuable artifacts a research project can produce.
- Pragmatic engineering decisions (LoRA + MoE, prompt-driven stages) often matter more than theoretical purity.

### From the Integration
- Adding a diagnostic layer on top of an existing optimization loop is relatively low-cost but high-impact.
- The biggest value comes from feeding the diagnostic output back into the system (new criteria, better reflection prompts, etc.).
- Building in public forces clarity — documenting this work helped surface several architectural decisions we might have left implicit.

## Ramifications for Moving Forward

This integration points toward a broader direction:

**Agents that can improve not just their outputs, but their own evaluation standards.**

Instead of humans (or static rubrics) defining what "good" looks like, the system can discover capability gaps, propose new criteria, test them, and retain the ones that actually improve outcomes. This is a step toward the kind of recursive self-improvement that many long-term agent research agendas assume.

Practically, it also reinforces several patterns we've been developing:
- Structured, versionable knowledge (now being aligned with the new Open Knowledge Format).
- Separation between verification, diagnosis, and adaptation layers.
- Building small, composable modules that can be wired together rather than monolithic systems.

## Building in Public

One of the reasons we're documenting this work so thoroughly is to establish a rhythm. Every significant research step — paper review, repository analysis, implementation, integration — becomes part of the public record. This isn't just for external visibility. It forces us to be clearer about what we're doing, why, and what the next logical step is.

Over time, this creates a searchable, citable body of work that compounds.

---

*Follow @MichaelGannotti and @azaliamirh for more on the practical infrastructure of autonomous research systems and agent self-improvement.*

*All code and documentation for this work lives in the public SkillOpt prototype.*