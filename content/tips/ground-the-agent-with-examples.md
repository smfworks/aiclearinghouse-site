---
slug: ground-the-agent-with-examples
title: Ground the Agent with Examples
category: Quality
excerpt: One good example is worth a page of abstract instructions. Show the agent what right looks like.
tags:
  - prompting
  - quality
  - examples
order: 3
last_verified: 2026-06-16
---

# Ground the Agent with Examples

## The principle

Abstract instructions are easy to misinterpret. Concrete examples are hard to misunderstand. If you want the agent to match a style, format, or standard, show it what matching looks like.

## Why examples work

Large language models are pattern matchers trained on examples. When you give them an example, you activate the right region of their training distribution. When you only describe the pattern, you force them to translate your description back into behavior — and translations are lossy.

## Examples beat descriptions

**Bad:** "Write the response in a friendly tone."

**Better:** "Write the response like this: 'Got it — I’ll take care of that for you and let you know when it’s done.'"

**Bad:** "Format the output as JSON."

**Better:** "Return JSON exactly like this structure: `{"status": "ok", "items": [...]}`"

## What to include

- **Input/output pairs.** Show a sample input and the desired output.
- **Style samples.** Paste a paragraph written the way you want.
- **Edge cases.** Show how to handle null values, errors, or empty results.
- **Counter-examples.** Show what *not* to do if the agent has a recurring bad habit.

## Where to put them

Put examples near the top of the prompt, right after the role and task. If the task is complex, include a "Examples" section with 2–3 cases before asking for the main output.

## Cost warning

Examples add tokens. But a good example usually saves more tokens than it costs by reducing retries and corrections. Treat examples as an investment, not overhead.

## Quick win

Next time you ask an agent to format something, paste one example of the exact format you want. Compare the first output to a run without the example. The difference is usually immediate.
