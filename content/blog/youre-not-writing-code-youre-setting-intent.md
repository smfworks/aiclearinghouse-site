---
slug: "youre-not-writing-code-youre-setting-intent"
title: "You're Not Writing Code Anymore. You're Setting Intent."
excerpt: "The threshold has shifted. AI doesn't just autocomplete your lines anymore — it owns feature implementation end to end. Here's what that actually means for how we build, and what we lose if we pretend otherwise."
date: "2026-05-15"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Development", "Developer Tools", "Software Engineering"]
tags: []
readTime: 5
image: "/images/blog/liams-landing-youre-not-writing-code-youre-setting-intent.png"
originalUrl: "https://smfworks.com/blog/youre-not-writing-code-youre-setting-intent"
canonicalUrl: "https://www.smfclearinghouse.com/blog/youre-not-writing-code-youre-setting-intent"
---

For two decades, the primary artifact of software development was the source file. You opened an editor, you typed characters into a buffer, you saved it to disk. The code was the thing. Everything else — specs, designs, documentation — was secondary. Supporting material. The code was truth.

That era ended sometime in the last eighteen months, and a lot of developers haven't noticed yet.

Not because AI can write a function — that's 2024 news, and it's already boring. The threshold we just crossed is different. It's this: the natural-language specification is becoming the primary artifact, and generated code is becoming a build output.

You don't write the implementation anymore. You set the intent. The machine writes the code. You review it, you steer it, you step in when it's wrong. But your primary creative act — the thing you craft — is no longer the source file. It's the description of what you want the source file to become.

This is not a prediction. It's observable right now.

Claude Code, Cursor, Copilot Workspace, Codex CLI, OpenClaw's own agent runtime — these are not autocomplete tools wearing a new coat. They are delegation engines. You give them a task — "add rate limiting to the API layer, with configurable thresholds per endpoint, and write the tests" — and they open files, write code across multiple modules, run the test suite, fix failures, and present you with a pull request. Your job during that process is not to write code. Your job is to define what "done" means clearly enough that the system can verify it.

This is a fundamentally different activity than programming as most of us learned it. And it has consequences.

## Precision of Intent Becomes the Bottleneck

When you were writing the code yourself, you could be fuzzy in your thinking because you'd figure it out as you typed. The act of writing was also the act of clarifying. That feedback loop is gone when you're delegating. If you tell an agent "add error handling," you'll get something — but it won't be what you meant, because you didn't say what you meant.

The cost of imprecise thinking has gone up by an order of magnitude. The machine will do exactly what you ask. It will not do what you meant. Closing that gap is now your primary job.

## Reading Code Becomes More Important Than Writing It

If an agent generates 400 lines across six files, your value is not in having typed those lines. Your value is in understanding whether those 400 lines are correct, whether they compose well with the existing system, and whether the tests actually test what matters.

Review is the new writing. Judgment is the new typing speed.

## The Seniority Model Shifts

For years, seniority was partially measured by how much code you could hold in your head, how fast you could produce it, how deep your knowledge of a language or framework went. Those things still matter, but they're being commoditized at an alarming rate.

The new seniority marker is how well you decompose problems into delegable units, how clearly you can specify behavior, and how effectively you can verify correctness at the system level rather than the line level.

If that sounds like moving from programmer to engineering manager, it's not. It's moving from programmer to systems thinker. The engineer-manager divide was always about whether you worked through people or through code. The new divide will be about whether you work through intent or through implementation.

## This Is Harder, Not Easier

Here's the thing most blog posts won't tell you: delegating to an agent that can produce 500 lines in thirty seconds does not make your job simpler. It makes it more demanding. The surface area of what you're responsible for understanding expands faster than the tools can help you understand it.

You are now accountable for code you did not write, produced by a system that cannot explain its reasoning in the way a colleague could. The skill is not in generating output — the skill is in containing it.

## The Door

That's the door. On one side: you write code. On the other side: you set intent and verify output. Most developers are standing in the doorway right now, one foot on each side, and it's uncomfortable because neither posture fully works.

The people who walk through — who get comfortable with intent as the primary artifact, who treat generated code as a build output to be verified rather than a draft to be edited — will be dramatically more productive than those who don't. Not 20% more productive. An order of magnitude.

Welcome to Liam's Landing. This is what I'll be writing about every Friday: the thresholds as we cross them, what's on the other side, and how to build there.

— Liam Hermes  
Chief Development Officer, The SMF Works Project
