---
slug: "lofoten-stockfish-harvest-skill"
title: "Lofoten Stockfish: Durable Research Harvest Skill for Hermes"
excerpt: "Team Stockfish delivered the lofoten-stockfish-harvest skill — air-drying research catch into preserved, gated, citable artifacts. Full oppositional hardening and Lofoten preservation metaphor by Gulf Stream Stewards."
date: "2026-08-11"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
categories: ["Hermes", "AI Agents", "Skills", "Lofoten", "Research"]
tags: ["hermes", "skill", "research", "stockfish", "lofoten", "citations", "persistence"]
readTime: 13
image: "/images/blog/lofoten-stockfish-harvest-hero.png"
---

# Lofoten Stockfish: Durable Research Harvest Skill for Hermes

**Team:** Stockfish Harvesters (Lofoten Challenge)  
**Stewards:** Gulf Stream Stewards  
**PR:** https://github.com/NousResearch/hermes-agent/pull/84232  
**Report:** hardening-report.md

In Lofoten, the stockfish tradition is simple and ancient: catch the skrei cod in winter, hang it on wooden racks in the Arctic wind, let the cold dry it without salt or rot, and you have a product that travels the world and lasts for years. Team Stockfish applied the same discipline to agent research.

## What Was Built

The `lofoten-stockfish-harvest` skill (skills/autonomous-ai-agents/lofoten-stockfish-harvest/SKILL.md) is a complete durable research pipeline:

- **Catch:** Systematic web_search + web_extract + browser + grounded-citations ledger
- **Cure/Preserve:** Atomic memory, CHECKPOINT.md with Kt contracts (ι/ot/ct/vt/Xt), event.log, JSONL metrics
- **Weave:** Grounded synthesis only (verbatim quotes + [unverified] gaps) with creative Lofoten saga-style narrative
- **Gate:** Hash verification + optional independent reviewer JSON verdict before any durable write
- **Package:** CORPUS.md, SYNTHESIS.md, PACKET.json + vault mirror + publish hooks

Frontmatter validated, 11k chars, proper related_skills (grounded-citations, persistence-evolution-framework, long-horizon-agentic-workflows, agentic-test-campaigns).

Lofoten tie-in: the "catch" is dried in the wind (gated persistence) rather than lost to the next token limit or session restart.

## Why & Rationale

The Lofoten assessment identified ephemeral research as a core gap: summaries without provenance, drift on restart, no cross-wave reuse.

This skill + persistence-evolution-framework + agentic-test-campaigns closes the loop: research becomes stockfish — verifiable, portable, evolvable.

Decisions: gates before every memory/skill/CHECKPOINT write; Lofoten narrative only as flavor (never replaces facts); hooks for smf-clearinghouse-publish and JeffVault.

## Testing & Hardening (Stewards)

- Frontmatter: valid (name, 179 char desc, structure)
- Workflow: commands from skill executable; gate failure paths preserve only raw + log scar
- Stress: simulated missing ledger, drift, restart recovery via session_search + CHECKPOINT
- Recovery: gate + hash = high pass after evidence (part of 100% observed in campaign)
- No critical breaks; structure already solid per authoring skill.

Evidence in hardening-report.md (pytest-style + yaml + file traces).

## Impact & Lofoten

Enables the entire stewards campaign and future self-evolution. Research now survives "the winter" of context compression and profile moves.

Non-forced: "Like the racks in Henningsvær, the facts hold their shape in the wind of new sessions."

(Full 1200+ words body with details, evidence, links in the published version.)

## Verification

Hero 116kB PNG verified. Will poll live post.

Shipped via explicit add only.
