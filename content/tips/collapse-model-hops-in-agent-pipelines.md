---
slug: collapse-model-hops-in-agent-pipelines
title: Collapse Model Hops — Don't Chain Specialists When One Model Can Do Both
category: Architecture
excerpt: Every model hop in a multi-model pipeline is a place where context gets translated, latency stacks, and errors propagate. Collapse perception and action into a single call when the model supports it.
tags:
  - architecture
  - latency
  - multimodal
  - context
  - agents
order: 99
last_verified: "2026-09-27"
---

# Collapse Model Hops — Don't Chain Specialists When One Model Can Do Both

## The pattern

A common agent architecture chains specialist models: a vision model reads a screen, passes a text description to a reasoning model, which passes a plan to an action model. Each hop is a place where context gets translated (losing fidelity), latency stacks (each call adds round-trip time), and errors propagate (a misread in hop 1 becomes a wrong plan in hop 2).

## The fix

When a single model can handle multiple modalities and capabilities natively, collapse the hops. A model with native vision, search grounding, and tool use in one call can look at a screen, ground a fact against live search, and pull a location — without handing context between three specialized models.

## When this applies

- **Computer-use agents:** A model with native screen understanding + action generation (e.g., Gemini 3.5 Flash with computer use) replaces a vision-OCR → text-reasoning → action-execution chain
- **RAG + reasoning:** A model with native search grounding + reasoning (e.g., Gemini with Google Search grounding) replaces a retrieve → summarize → reason chain
- **Multimodal analysis:** A model with native image + text input replaces an image-caption → text-analysis pipeline
- **Tool use + planning:** A model with native function calling + reasoning replaces a planner → executor split when the task doesn't require them to be separate

## When not to collapse

- **Cost separation:** If the specialist model is dramatically cheaper for its sub-task, chaining may be more cost-effective than calling a larger multimodal model for everything
- **Quality separation:** If a specialist model is meaningfully better at its sub-task than the generalist, keep the hop — the fidelity gain is worth the latency
- **Independent scaling:** If different hops have different load patterns, separate models let you scale them independently
- **Vendor lock-in risk:** Collapsing into one model's native capabilities ties you to that model's feature set

## The trade-off

Collapsing hops trades flexibility for reliability. Fewer moving parts means fewer failure points, lower latency, and less context loss — but it ties your agent's capability surface to what one model supports natively. The right answer is usually: collapse where a single model is good enough at both sub-tasks, keep the hop where a specialist clearly outperforms.

## Signal from recent releases

Models shipping in September 2026 are converging on this. Gemini 3.5 Flash ships computer use, search grounding, and tool use in a single call. Claude Opus 5.5 targets long-running agentic coding where the same context persists across many turns. The trend is toward fewer, more capable calls rather than more, narrower ones.