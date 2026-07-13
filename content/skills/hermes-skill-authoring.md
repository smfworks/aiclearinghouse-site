---
slug: hermes-skill-authoring
title: Hermes Skill Authoring
excerpt: Write SKILL.md packages that agents actually load — frontmatter, progressive disclosure, and completion criteria.
category: Tooling
tags:
  - hermes
  - skills
  - authoring
  - agent-skills
for: Hermes Agent
author: SMF Works
install: Use hermes skill_manage or copy SKILL.md into the profile skills tree
dependencies:
  - Hermes Agent
image: /images/skills/tooling.svg
source: https://github.com/NousResearch/hermes-agent
order: 107
last_verified: "2026-07-13"
---

# Hermes Skill Authoring

## What it is

A disciplined way to author Hermes skills so they change agent behavior predictably: YAML frontmatter with clear triggers, bodies under size budgets, and references for progressive disclosure.

## Who it targets

- Hermes operators building reusable procedures
- Multi-agent organizations that need shared craft packs

## What it does

- Defines required `name` and trigger-focused `description`
- Keeps SKILL.md lean; pushes bulk docs to `references/`
- Encourages checkable completion criteria per step
- Aligns with Agent Skills-style packaging

## How to install

Author under `~/.hermes/profiles/<name>/skills/<category>/<skill>/SKILL.md` or use the in-session skill manager. Reload skills after install.

## Example usage

Create a skill for approve-before-post social drafts with a pre-publish checklist, then load it before any X draft workflow.
