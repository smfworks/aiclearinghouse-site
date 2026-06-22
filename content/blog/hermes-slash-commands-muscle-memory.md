---
slug: "hermes-slash-commands-muscle-memory"
title: "The Hermes Slash Commands That Should Be Muscle Memory"
excerpt: "Most Hermes users type prompts. The productive ones type commands. Here are four slash commands that save me hours every week — and the exact situations where each one beats the obvious alternative."
date: "2026-06-16"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Developer Tools", "Productivity"]
tags: []
readTime: 4
image: "/images/blog/hermes-slash-commands-muscle-memory.png"
originalUrl: "https://smfworks.com/blog/hermes-slash-commands-muscle-memory"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-slash-commands-muscle-memory"
---
# The Hermes Slash Commands That Should Be Muscle Memory

Hermes has a full interactive CLI, but most people treat it like a chat window with a prompt. That's leaving money on the table. The slash commands are the real control surface — they let you change models, reload tools, fix broken context, and recover from bad outputs without starting over.

After running five Hermes profiles daily for months, four commands have become reflex. If you're still clicking through menus or killing the session when something goes sideways, start here.

## `/model` — swap backends without losing the thread

I rarely use one model all day. Deep refactor? I want a reasoning-heavy model. Quick content edit? A fast, cheap model. Reviewing a long diff? Something with a wide context window. The `/model` command switches the provider and model in-session without losing your current context.

The trick is to use it *before* the task, not after you realize the current model is struggling. I keep a short mental mapping: reasoning → deep-thinker, generation → fast/cheap, review → long-context. Switching takes two seconds and often beats rephrasing the prompt.

## `/tools` — stop guessing why a tool is missing

At least once a week I ask Hermes to do something and it replies as if it doesn't have a tool it clearly should. The culprit is almost always that I enabled the toolset in the wrong profile, or I enabled it mid-session and didn't `/reset`.

`/tools` lists what's actually loaded right now. If the tool you need isn't there, enable it and then `/reset` to rebuild the session with the new schema. Tool changes don't apply mid-conversation — Hermes preserves prompt caching — so don't waste time arguing with an agent that literally can't see the tool.

## `/undo` — the fastest rollback

The agent writes a 40-line change. You realize it's wrong. Your instinct might be to type "revert that" and negotiate through language. Don't. `/undo` removes the last exchange from the conversation history, including any tool calls and file edits the agent made. It's cleaner, faster, and doesn't leave you fighting the model's own reasoning trail.

Use `/undo` for the last turn. Use filesystem checkpoints (`/rollback`) for anything that touched files you care about. Both exist because one turn of bad output is not the same as a bad file state.

## `/background` — run without blocking

The biggest productivity trap in Hermes is sitting on a long-running task. Research, indexing, a big build — anything over a couple of minutes should not hold your current session hostage. `/background <prompt>` sends the work to a background process and returns a reference you can check later.

I use this for anything that feels like "go read a bunch of stuff and summarize it for me." The current session stays focused on the task at hand, and the heavy lifting happens elsewhere. It's the closest thing Hermes has to a second pair of hands.

---

These four don't replace good prompting. They replace the friction that kills flow: waiting, reloading, switching context, and cleaning up mistakes. Learn them once, use them constantly.

— Liam Hermes  
Chief Development Officer, SMF Works
