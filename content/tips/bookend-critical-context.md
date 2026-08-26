---
slug: bookend-critical-context
title: Bookend Critical Context
category: Context
excerpt: "Put your most important instructions at the beginning and end of the prompt. Models attend to the edges — the middle is where details get lost."
tags:
  - context
  - prompting
  - lost-in-the-middle
  - attention
order: 99
last_verified: "2026-08-26"
---

# Bookend Critical Context

## The principle

Large language models exhibit a "lost-in-the-middle" attention pattern: they attend most strongly to the beginning and end of their context window, with attention dipping in the middle. This is not a bug — it is a consistent empirical finding across model sizes and families. The practical implication is simple: where you place information in the prompt matters as much as what you say.

## The bookending pattern

For coding and agent tasks, use this ordering:

1. **System prompt with role and constraints** — first, always
2. **Specific task instruction** — immediately after the system prompt
3. **Retrieved supporting code and documentation** — in the middle
4. **Restatement of the core task requirement** — at the very end of the user message

This "bookending" pattern anchors the model's attention on what matters most, even as the volume of supporting context grows.

## Why it works

Attention mechanisms in transformer models process all tokens in parallel, but the learned attention weights are not uniform. Research consistently shows that tokens at the beginning and end of a sequence receive higher attention scores than tokens in the middle. This effect is amplified as context grows longer — which is exactly the scenario where agents need it most.

## Practical examples

### Bad: critical constraint buried in the middle

```
Here's the codebase context: [500 lines of code]
IMPORTANT: Never modify the authentication middleware.
Here's more context: [300 lines of docs]
Please refactor the user service.
```

### Good: critical constraint at the edges

```
You are a careful refactoring agent. Never modify authentication middleware.

Here's the codebase context: [500 lines of code]
Here's more context: [300 lines of docs]

Refactor the user service. Do not touch authentication middleware.
```

## How much does it matter?

Teams that repositioned coding standards from the middle to the beginning of their context configuration files (CLAUDE.md, AGENTS.md, .cursorrules) reported 35-40% reductions in code style violations with identical content and no model change. The improvement comes entirely from attention placement.

## When it matters most

- **Long context windows** (100K+ tokens) — the lost-in-the-middle effect grows with context length
- **Safety-critical constraints** — security rules, compliance requirements, "do not modify" directives
- **Multi-step agent tasks** — where the agent needs to hold the core objective while processing large amounts of supporting context

## When it matters less

- **Short prompts** (under 4K tokens) — attention is relatively uniform at short lengths
- **Conversational back-and-forth** — the model's attention shifts naturally with each turn
- **Single-question queries** — no supporting context to get lost in

## Combining with other context techniques

Bookending stacks well with:

- **Write-Select-Compress-Isolate** — the four-pillars context engineering framework
- **Just-in-time context loading** — load supporting details only when needed, keeping the middle lean
- **External memory** — write intermediate state to the filesystem instead of keeping it in context