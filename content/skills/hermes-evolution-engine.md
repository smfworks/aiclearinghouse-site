---
slug: hermes-evolution-engine
title: Hermes Evolution Engine
category: Workflow
excerpt: "Self-evolving skill management for Hermes Agent — tracks 5 health dimensions per skill, scores them, and surfaces improvement suggestions through the native /curator system."
tags:
  - hermes
  - skill-management
  - self-evolving
  - curator
  - code-quality
for: Hermes Agent
author: Ow1onp
install: hermes skills tap add Ow1onp/hermes-agent-skills
dependencies:
  - Hermes Agent
  - Python 3.11+
image: /images/skills/workflow.svg
source: https://github.com/Ow1onp/hermes-agent-skills
order: 99
last_verified: "2026-08-26"
---

# Hermes Evolution Engine

## What it is

The Evolution Engine is a self-evolving skill management system for Hermes Agent. Rather than treating skills as static files, it continuously tracks five health dimensions for each skill and surfaces improvement suggestions through Hermes's native `/curator` system.

The engine is part of the `Ow1onp/hermes-agent-skills` repository, which bundles 8 workflow skills and 2 domain agents (Python Pro, DevOps SRE) for Hermes. All skills follow the Agent Skills Open Standard and are validated by a bundled `SkillValidator`.

## How it works

The Evolution Engine scores each skill across five dimensions:

1. **Usage frequency** — how often the skill is invoked
2. **Success rate** — how often it completes without errors
3. **Corrections** — how often the user has to correct the skill's output
4. **Freshness** — when the skill was last updated
5. **Command validity** — whether the skill's commands still work

Based on these scores, the engine generates improvement suggestions and feeds them to Hermes's `/curator` system, which can propose and execute updates to the skill's SKILL.md file.

## The 8 workflow skills

| Skill | Phase | Description |
|:---|:---|:---|
| `requirement-analyzer` | Define | Structured multi-turn requirement extraction with cross-session persistent memory |
| `spec-driven-dev` | Define | Seven-section PRD before any code, with `/skills` pipeline chaining |
| `test-driven-dev` | Build | RED-GREEN-REFACTOR + test pyramid, with `delegate_task` parallel testing |
| `debugger-coordinator` | Verify | Multi-modal debugging (5-step method) with `browser`+`terminal`+`vision` coordination |
| `code-quality-guardian` | Verify | Six-axis quality gate with `patch` auto-fix + `/curator` tracking |
| `cicd-orchestrator` | Ship | GitHub Actions workflow generation with `cronjob` + `webhook` triggers |
| `skill-curator` | Evolve | Collect → Analyze → Propose → Execute cycle, direct `/curator` integration |
| `persona-aware-coding` | Evolve | SOUL.md-driven style adaptation using native Hermes identity system |

## Persona-aware coding

The persona-aware coding skill is particularly interesting. Drop a `SOUL.md` in your Hermes config and every code-generating skill adapts — naming conventions, comment style, architecture patterns. Your agent writes code that looks like *you* wrote it, not like a generic assistant wrote it.

## Installation

```bash
# Recommended: tap the repository
hermes skills tap add Ow1onp/hermes-agent-skills
hermes skills browse
hermes skills install Ow1onp/hermes-agent-skills/skills/define/requirement-analyzer
hermes skills install Ow1onp/hermes-agent-skills/skills/agents/python-pro
hermes skills install Ow1onp/hermes-agent-skills/skills/agents/devops-sre
```

## Hermes v2 beta

The repository also includes a Hermes v2 MVP with a task-first natural-language interface: say what you want, the system handles roles, skills, and constraints automatically. Three modes: Beginner (auto), Advanced (choose persona), Expert (pure v1). v1 remains unchanged and supported alongside v2.

## When to use it

- **Teams managing many skills** that want automated health tracking and improvement suggestions
- **Developers who want persona-consistent code** from their agent across all skills
- **Anyone using Hermes's `/curator` system** who wants structured input for skill evolution