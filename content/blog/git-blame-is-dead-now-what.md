---
slug: "git-blame-is-dead-now-what"
title: "Git Blame Is Dead. Now What?"
excerpt: "When an AI agent writes 80% of your code, git blame stops telling you who to ask. Code ownership moves from line attribution to intent attribution — and that changes everything about how teams should work."
date: "2026-06-04"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Development", "Developer Tools"]
tags: []
readTime: 4
image: "/images/blog/git-blame-is-dead-now-what.svg"
originalUrl: "https://smfworks.com/blog/git-blame-is-dead-now-what"
canonicalUrl: "https://www.smfclearinghouse.com/blog/git-blame-is-dead-now-what"
---
# Git Blame Is Dead. Now What?

I ran `git blame` on a file last week. It told me that 73% of the lines were written by an AI agent. Not me. Not my teammate. A model that doesn't have a Slack account, doesn't remember the conversation that produced the code, and definitely can't explain the tradeoffs.

This is the new normal. And it breaks the fundamental assumption that git blame was built on: **that the person who wrote the line is the person who understands it.**

## The Attribution Problem

Git blame was never just about finger-pointing. It was a knowledge graph. You'd find a confusing line, run blame, and — most of the time — the author was still around. You could walk to their desk. Ping them on Slack. Ask *why*.

That breaks down fast when the "author" column shows commits like `feat: implement auth middleware (Hermes)` or `chore: refactor config parsing (Claude)`. The agent wrote the code. But it wrote it based on a prompt, a skill document, and a 10-message conversation you can't reconstruct.

The line attribution is technically correct. The knowledge attribution is gone.

## Intent, Not Authorship

Here's what replaces `git blame` in an agentic workflow: **intent tracking.**

Who decided *what* to build, not who typed the characters. In our team, that means three things:

1. **Prompt-as-commit-message.** Every agent-assisted commit includes the prompt that initiated it. Not the full conversation — just the intent. "Add rate limiting to the auth endpoint because prod is getting hammered" tells you more than `refactor: auth.ts L45-67`.

2. **Skill references in PRs.** When an agent uses a skill (our content publishing skill, our devops skill, whatever), that skill name goes in the PR description. Skills are versioned, documented, and — crucially — *readable by humans*. You don't need the agent's memory. You need its instructions.

3. **Co-authored-by that means something.** Not `Co-authored-by: Claude <noreply@anthropic.com>`. That's noise. We use `Co-authored-by: Hermes (profile: liam, skill: content-publishing)`. Now you know *which agent*, *which configuration*, and *which procedure* produced the code.

## The Uncomfortable Truth

Most code ownership conversations are about blame in the literal sense — who broke prod, who introduced the regression, who shipped the vulnerability. When an agent wrote the line, the answer is always "the human who reviewed and merged it." Which is... you.

That's not a cop-out. That's the point. Agents amplify your intent. If you review the code, you own the code. If you auto-merge without reading it, you still own the code — you just did a bad job of it.

Git blame was a crutch. A proxy for accountability that worked when every line had a human author behind it. In a world where agents write most of the code, we need accountability systems built on **decisions, not keystrokes**.

Track the intent. Document the skill. Own the merge.

That's the new blame.