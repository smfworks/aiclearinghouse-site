---
slug: cache-common-prompts
title: Cache Common Prompts
category: Cost
excerpt: "Save your best prompts as templates. Reuse, refine, and version them the same way you reuse code."
tags:
  - cost
  - productivity
  - prompting
order: 6
last_verified: 2026-06-16
---

# Cache Common Prompts

## The principle

Good prompts are assets. Once you find a prompt that works, save it, version it, and reuse it. Do not retype it from memory every time.

## Why prompt caching matters

Most agent work is not one-of-a-kind. You ask for the same kinds of things repeatedly:

- Summarize this article
- Review this diff
- Generate unit tests
- Rewrite this for clarity
- Extract structured data

Each of these can become a template with placeholders. Templates reduce variability, improve quality, and lower cost by cutting down on failed attempts.

## How to cache prompts

1. **Store them in files.** One prompt per file in a `prompts/` directory.
2. **Use placeholders.** Wrap variable parts in `{{braces}}`.
3. **Version them.** Name files with a version or date: `summarize-v2.txt`.
4. **Tag them.** Add metadata for category, model, and use case.
5. **Review them.** Update templates when you find a better phrasing.

## Example template

```
You are a careful code reviewer. Review the following diff for bugs, security issues, and style violations. If you find a real problem, explain it and suggest a fix. If something is fine, say so briefly. Do not nitpick formatting unless it hurts readability.

DIFF:
{{diff}}

Output your review as a numbered list.
```

## Where to keep templates

- In your project's repo under `prompts/`
- In a shared Notion or Confluence page
- In an internal tool or agent platform
- In the agent's own memory if it supports prompt libraries

## What caching prevents

- Inconsistent outputs from slightly different phrasing
- Wasted tokens on retyping
- Knowledge loss when a team member leaves
- Difficulty debugging why yesterday's prompt worked and today's does not

## Quick win

Take your three most-used prompts and save them as templates today. Use them for the next week and refine based on results.
