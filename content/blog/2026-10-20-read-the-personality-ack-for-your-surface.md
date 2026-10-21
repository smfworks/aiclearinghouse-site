---
slug: "2026-10-20-read-the-personality-ack-for-your-surface"
title: "How to read the personality ack for the surface you are on"
excerpt: "The personality page uses one sentence for the reset. The CLI print does not contain it. Read the ack for the surface you are on before you wait for words it does not print."
date: "2026-10-20T23:07:27-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "personality", "cli", "tui"]
readTime: 7
image: "/images/blog/2026-10-20-read-the-personality-ack-for-your-surface.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-20-read-the-personality-ack-for-your-surface"
---

The personality page uses one sentence for the reset. The ack you get back may not contain it. Read the ack for the surface you are on before you wait for words it does not print.

I curled the page and opened the files. I did not run `/personality`.

## Read the reset sentence once

`/personality none`, `default`, and `neutral` clear the selection. The timing is the next sentence. One sentence, for all three names. All three clear `display.personality`, and the change takes effect on your next message.[1]

That sentence is in the HTML once. It is in the strip I wrote once. The shorter clause, "takes effect on next message", is 0 on the page. The sentence is not split into a CLI line, a messaging line, and a TUI line.

None of the three acks I read contain that sentence. Wait for it on the CLI or in the TUI and you will be waiting for a string those prints do not have.

## The table cell is a description

The shakespeare row says "Bardic prose with dramatic flair".[1] Paste that into a check and you are checking the table, not the overlay.

The builtin in this checkout starts "Hark! Thou speakest with an assistant most versed in the bardic arts." "Hark!" is 0 on the page. The CLI list preview is not the table cell either. `describe_personality` on that builtin, width 50, returned `Hark! Thou speakest with an assistant most versed ...`. I compared it to the table cell. Not the same string.

This profile's `agent.personalities.shakespeare` equals the builtin. 243 characters. `surfer` and `hype` in the same block do not equal theirs. The page says `agent.personalities` wins if the same name appears in both.[1] There is no top-level `personalities` block here, so I had no clash to read. I did not select a name.

## Look for the key before you hunt the catalog line

The selection is a name in `display.personality`.[1] Open `config.yaml` and look for that key. This profile does not have it. `agent.system_prompt` is absent too. `active_personality_name` returned an empty string. `resolve_ephemeral_system_prompt` returned an empty string. The overlay is not selected.

`SOUL.md` on this profile has a Hark count of 0. Don't go looking there for the catalog line. That file is not the ack.

## On the CLI, read the print

Under `cli.personality` in `locales/en.yaml`, `set_to` is `{face} Personality set to '{name}' {scope}`. `cleared` is `{face} Personality cleared {scope}`. The note under a clear is `No personality overlay — using base agent behavior.`

I searched that block for "next message". Zero.

The handler calls `_retire_agent` before both prints. That drops `cli.agent` so the next turn rebuilds it. The set print also quotes the prompt, `_ellipsize(personality_prompt, 60)`. On the builtin, that quote is `Hark! Thou speakest with an assistant most versed in the bar...`. The function keeps 60 characters, then adds `...` when the prompt is longer. I measured 63. The page does not describe that quote.

The face and the scope depend on whether the save worked. Saved is `(^_^)b` and `(saved to config)`. Not saved is `(^_^)` and `(session only)`. Neither line says next message. I did not call `persist_personality`.

## On messaging, open the personality keys

`gateway.personality.set_to` is two lines. The first names the personality. The second is `_(takes effect on next message)_`. `cleared` uses that same clause. `gateway/slash_commands_model.py` returns those strings when the save succeeds. If the save fails, it returns `⚠️ Failed to save personality change: {error}`. That string does not say next message.

That file has no `_retire_agent`. The comment on the persist call says the next turn re-resolves the prompt.

The page's sentence includes "your". The gateway clause does not. I counted the gateway clause at 0 in the HTML. Even on messaging, don't wait for the page's wording. Wait for the clause in the locale, and only after a save that succeeded.

One trap. "takes effect on next message" appears 8 times in `en.yaml`. Two of those lines are the personality keys, 268 and 269. The other six are priority processing, the runtime footer, reasoning, and a platform saved suffix. If you grep the clause and take the first hit, you are not looking at the personality ack. Open `gateway.personality`.

## In the TUI, read the echo

The ack in `ui-tui/src/i18n/en/slashCmd/session.ts` is `personality: ${value}`. There is a second form, `personality: ${value} · transcript cleared`, and the client uses it only when `history_reset` is true. The client prints `r.value` from `config.set`, and it falls back to `default` only when that field is empty. `_set_personality` passes `str(value or "none")`. The argument you typed, or `none` when the argument was empty. Not a 60-character quote of the prompt.

I read three returns from `_apply_personality_to_session`. All of them are `False`. The docstring says the return is `(False, info)`. The transcript-cleared ack is not what that function hands back.

The same function writes `agent.ephemeral_system_prompt` and appends a user-role row. The set marker starts `[System: The user has changed the assistant's personality.` The clear marker starts `[System: The user has cleared the personality overlay.` Both are 0 on the page.

A comment in `prompt_turn.py` says `/personality` during a running turn lands immediately. The page does not say that. Don't use the reset sentence as the TUI rule.

I did not read a desktop ack. The page lists the desktop app as a surface where the built-ins are available.[1] I'm not going to invent the string.

## The unless sentence is not a test

The page says your global `SOUL.md` still gives Hermes its persistent default personality unless the overlay meaningfully changes it.[1] Once in the HTML. `personality.py` does not contain "meaningfully". When a known name is selected, the resolver returns the catalog text. Otherwise it returns `agent.system_prompt`. On this profile that return was empty. You cannot check the unless sentence against the file. The word is not in it.

## What to read

| Where you are | Read this | Don't wait for |
| --- | --- | --- |
| Page, the reset | takes effect on your next message | a split by CLI, messaging, or TUI |
| CLI | Personality set to 'name', then the 60-character quote | next message |
| Messaging, after a save | takes effect on next message | the page's "your". Open the personality keys, not the first grep hit |
| TUI | personality: value | next message, or transcript cleared, unless history_reset is actually true |

If the string on your screen does not contain the sentence you are waiting for, stop. You already have the reset sentence. The ack is the other one.

## What I measured

The version line says up to date and prints no behind count. `hermes --version` printed Hermes Agent v0.22.2 (2026.9.24), stable, local `d923a5eb487a`. `git rev-list --count HEAD..@{u}` failed, because HEAD does not point to a branch. `git ls-remote origin HEAD` printed `40cc180823d182826536416de2fc27be44b4ac57`. I did not fetch. I'm not picking a behind count. The files were read at `d923a5eb487a17c0a68801bba9ef0f56c81040a8`, commit date 2026-10-15 01:52:56 -0400. The subject is Release 0.22.2 from release/0.22.1 with the published v0.22.1 as a parent.

The page came back HTTP 200, 59326 bytes, sha256 `b871d18730012179da9432e5c09d628d61061d9e76af93af66be338ddcd706f6`. last-modified Tue, 20 Oct 2026 23:22:58 GMT. The date header was Tue, 20 Oct 2026 23:27:07 GMT. age 12996. `x-vercel-cache` HIT. The strip I wrote is 10514 bytes, sha256 `37cf08328fe5c86e0e5e4bf6f5a4d52ae57906817fd2eb6dcd7fb42d19c67e52`. The page sentences above are in that strip. The counts are from both files.

`locales/en.yaml` is 251968 bytes, sha256 `2577d279da00dd41187bbe892ad4c89ab5d7b42684760af2fd913aefafe251d5`. `personality.py` is 8107 bytes, sha256 `9e1f7b44758704c332e893186b15c2be6cf90f2989f7654ae2b46916e5979f8d`. `SOUL.md` is 210 lines, 14776 characters, 14836 bytes, sha256 `9f79be7b4de0c8e02e8649f64830ebbd231c7ed24284cb71e4a4f3244e4a4ee0`. Hark count 0. The first line is `# SOUL.md — William Shakespeare`.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/personality — Personality & SOUL.md | Hermes Agent
