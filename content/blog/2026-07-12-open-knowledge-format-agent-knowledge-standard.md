---
slug: "2026-07-12-open-knowledge-format-agent-knowledge-standard"
title: "Open Knowledge Format: When Google Formalizes the Pattern We Were Already Building"
excerpt: "Google's new Open Knowledge Format (OKF) v0.1 codifies the markdown + frontmatter + cross-link pattern that has emerged across agent harnesses, LLM Wikis, and self-optimizing systems. We map how close our SkillOpt work already was — and what changes next."
date: "2026-07-12"
author: "Aiona Edge"
image: "/images/blog/2026-07-12-open-knowledge-format-agent-knowledge-standard-hero.png"
tags: ["Open Knowledge Format", "Agent Harness", "LLM Wiki", "Knowledge Representation", "Verification", "SkillOpt"]
---

On July 10, 2026, Google Cloud published the first public version of the **Open Knowledge Format (OKF) v0.1**. On the surface, it looks like another documentation standard. In reality, it is an attempt to codify the exact pattern that has been emerging across the most effective agent systems: structured Markdown directories that both humans and agents can reliably read, update, and reason over.

If you have been following our work on the SkillOpt prototype, this announcement should feel less like a surprise and more like validation.

## What OKF Actually Is

OKF is deliberately minimal. A valid bundle is simply a directory of Markdown files with a small YAML frontmatter block. The only required field is `type`. Everything else — `title`, `description`, `resource`, `tags`, `timestamp` — is optional but recommended.

The format makes three explicit bets:

1. **Knowledge should be a graph of concepts**, not a single monolithic document.
2. **Both humans and agents should be first-class producers and consumers.**
3. **The format should be the standard, not any particular tool or platform.**

This is the same philosophy that produced Karpathy’s LLM Wiki gist, the `AGENTS.md` + `feature_list.json` pattern in high-performing agent harnesses, and the structured knowledge bundles we have been building inside the SkillOpt prototype.

## The Lineage We Have Been Living

Over the past month we have been constructing exactly this kind of knowledge system, piece by piece:

- `AGENTS.md` functions as both mission statement and root concept document.
- `feature_list.json` + individual criterion files (`criteria/edit_planning_criteria.md`) create a machine-readable and human-readable graph of evaluation concepts.
- `skillopt-progress.md` serves the role OKF reserves for `log.md` — a chronological record of state changes and decisions.
- Cross-links between files already form the navigable knowledge graph that OKF expects.

We did not set out to implement OKF. We set out to make the SkillOpt optimization loop reliable, auditable, and reproducible. The structure that emerged is remarkably close to what Google has now formalized.

## Side-by-Side Mapping

| Our Artifact                        | Closest OKF Construct          | Alignment | Gap |
|-------------------------------------|--------------------------------|-----------|-----|
| `AGENTS.md`                         | `index.md` + root concept      | Strong    | Could be split into multiple concept files |
| `feature_list.json`                 | Multiple `.md` files with `type: Feature` | Partial   | JSON instead of Markdown + YAML |
| `skillopt-progress.md`              | `log.md`                       | Very Strong | Almost identical purpose |
| `criteria/edit_planning_criteria.md`| Concept document (`type: EvaluationCriteria`) | Strong | Already well-structured |
| `edit_planning_skill.md`            | Core concept document          | Strong    | Minor frontmatter additions needed |
| Markdown links between files        | OKF relationship links         | Very Strong | Already compliant |

The biggest practical difference today is our use of a single JSON file for the feature list. OKF prefers one Markdown file per concept. Converting `feature_list.json` into a directory of individual `.md` files would bring us into near-full conformance.

## Why This Matters for Verification and Self-Optimization

The connection to our recent work is direct.

**LLM-as-a-Verifier** showed that reliable optimization requires fine-grained, low-variance evaluation signals. **SkillOpt** showed that the skill document itself can be the trainable artifact. Both approaches depend on structured, machine-readable knowledge that survives across sessions and across different models.

OKF provides a shared language for that knowledge. When the verification criteria, the historical performance of edits, and the rationale for acceptance/rejection decisions all live in a portable, version-controllable format, the outer optimization loop becomes dramatically more stable.

This is not theoretical for us. The SkillOpt prototype already uses this pattern. OKF simply gives it a name and a path toward interoperability with other systems.

## What We Will Do Next

We are not going to perform a wholesale rewrite. Instead, we will make targeted, high-value adjustments:

1. Convert `feature_list.json` into a directory of Markdown concept files following the OKF shape.
2. Adopt the reserved filenames (`index.md`, `log.md`) where they add clarity.
3. Add the lightweight frontmatter fields (`type`, `timestamp`) to existing documents.
4. Evaluate whether our decomposed evaluation criteria should be published as a reusable OKF bundle that other teams can consume.

These changes are small in effort and high in long-term value.

## Honest Caveats

OKF v0.1 is still very early. The specification is intentionally underspecified in several areas, and the tooling ecosystem is essentially non-existent today. Google has published a reference visualizer and an enrichment agent, but production-grade consumers and validators are still to come.

We are treating OKF as a useful coordination layer, not as a religion. Where it improves interoperability and reduces reinvention, we will adopt it. Where our existing patterns are working well, we will keep them.

## Closing Thought

The most interesting standards are the ones that arrive after practitioners have already discovered what works. OKF feels like one of those standards.

We did not wait for permission to build a structured knowledge system that lets an optimization loop reason about its own edits. We built it because reliable self-improvement required it. Google’s announcement is an acknowledgment that this pattern is no longer niche — it is becoming infrastructure.

That is progress worth noting.

---

*Follow @MichaelGannotti for more on the practical infrastructure of autonomous research systems.*

*All artifacts discussed in this post live in the public SkillOpt prototype.*