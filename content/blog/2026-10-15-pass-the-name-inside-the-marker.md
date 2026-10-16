---
slug: "2026-10-15-pass-the-name-inside-the-marker"
title: "How to reload a skill after compaction: pass the name inside the marker"
excerpt: "After compaction, read the line you got. If it contains the reload call, pass that name. Don't pass the ellipsis on the docs page, and don't treat a body the pass left in place as pruned."
date: "2026-10-15T23:06:55-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "compression", "skill_view", "skills"]
readTime: 8
image: "/images/blog/2026-10-15-pass-the-name-inside-the-marker.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-15-pass-the-name-inside-the-marker"
---

After compaction, read the line you actually got. If it contains a reload call, and the name inside the quotes is a real skill name, pass that name to `skill_view`. The docs page prints an ellipsis in that spot. That character is not a name. If the skill body is still sitting there, the pass left it alone. Don't reload it as if it had been stubbed.

I did not run a compaction. I did not open a CLI. I called the functions that write the line, and I curled the page that describes it.

## Read the name inside the marker

The compression page says every `skill_view` result that a pass stubs or summarizes away, whatever its size, carries the marker, and the summary lists each such skill under `## Pruned Skills`.[1] A reload after the boundary returns the full skill again.[1]

The marker on that page looks like this, ellipsis and all:

`[SKILL_PRUNED: content lost in compression; reload with skill_view(name='…')]`

I counted that ellipsis once in the strip. Don't pass it. It is the page leaving a blank, not a skill you have installed.

I called `_skill_pruned_marker` with `pdf`. It returned `[SKILL_PRUNED: content lost in compression; reload with skill_view(name='pdf')]`. That `pdf` is the name. If your line looks like that, pass the name between the quotes. I called the function. I did not watch a live session write the line.

The safety-rule string in this checkout says to reload with `skill_view(name='...')`. Those are three ASCII dots. Not the page's ellipsis, and not a name. I printed the string. Length 441. It contains `[SKILL_PRUNED]`. It does not contain `[SKILL_PRUNED:`. The marker this checkout writes has the colon, so a search for the bracket form still hits the marker. Get the name from the marker, not from that sentence.

## A body left in place is not a prune

"Whatever its size" is about a result the pass already stubbed or summarized.[1] It does not mean every `skill_view` result in the transcript got replaced.

The page's phase 1 line says old tool results over 200 characters, outside the protected tail, are replaced with `[Old tool output cleared to save context space]`.[1] I counted that placeholder once in the strip. My call did not write it.

I called `_demote_tool_result_at` with the floor at 200. I read the skip. A body at or under that floor is left alone. Two hundred `x` characters came back unchanged. No marker. Two hundred one `x` characters came back as the size line plus the marker, name `pdf`. I did not call `_prune_old_tool_results`. I did not run `compress()`.

Calling the summarizer is a different call. I passed it the 16-character string `short skill body`, arguments name `pdf`. The return included the marker. sha256 `12584876a7808187754cace79ff5f53a9cac89d3ce4326ad1d51464dca067604`. The same call on 5,000 `x` characters included the marker too, and printed the count as `5,000`. The summarizer writes the marker on a loaded body. The demote method does not call it when the body is at or under the floor. Read the line you got. Don't blend those two calls into one rule.

## Don't pass the dots in the recovery stub

Lean-tail demotion is a separate function. The floor is 1,500 characters, and the newest six tool rounds stay. I read those constants in `context_compressor_tail.py`. I called `demote_stale_tail_tools` with seven separated rounds, so the oldest sat outside the six. Session id `sess-probe`. 1,499 `y` characters stayed. Demoted count 0. 1,500 became a stub the page does not contain, then the marker:

```
[skill_view output demoted at compaction — 1,500 chars preserved in session history. Recover with session_search(query=..., session_id='sess-probe')] [SKILL_PRUNED: content lost in compression; reload with skill_view(name='pdf')]
```

The `query=...` is three dots. Don't pass them to `session_search`. The reload is `pdf`, the name in the marker.

The page's only `1,500` is a vision-token default. Before the first vision turn a flat 1,500 default applies.[1] I counted "demoted at compaction" at 0 in the strip. Don't treat the page's 1,500 and this floor as one number.

## A failure is not a prune

I passed `{"success": false, "error": "skill not found"}` to the summarizer, arguments name `pdf`. It printed `[skill_view] name=pdf FAILED: skill not found (46 chars)`. No marker. The name is on the line because I put it in the arguments. That does not make the line a reload. The load failed. Don't call `skill_view` again as if the body had been compacted away.

Empty arguments, same 16-character body, printed `[skill_view] name=? (16 chars)`. No marker. There is no name to pass. Don't invent one.

## If the size line lost the marker, look for the heading

I resummarized `[skill_view] name=pdf (40 chars)`. It came back `[skill_view] name=pdf (32 chars)`. No marker. I read the branch that does this. A stub that already lost the marker does not get it back on a second summary.

The collector still returned `pdf` from the tool call. I called the reinject function with that name. It appended `## Pruned Skills`, the marker, and this parenthetical:

```
(The listed skills' instructions were pruned during context compression. Reload with the skill_view call in each marker before relying on that skill; one reload per skill is enough — ignore any older markers for the same skill.)
```

I searched the strip for "one reload". Count 0. That parenthetical is not on the page. I called those two functions. I did not run the compressor.

The page does say the summary lists each such skill under that heading.[1] The heading is not the skill. If your transcript has only the size line, look for the heading before you decide the name is gone. Pass the name inside the marker under it.

## Preloaded skills are a different slot

The page says skills preloaded with `-s` or `skills.auto_load` live in the system prompt and are never compacted.[1] In the HTML those two tokens sit in code tags, so a raw search misses the joined sentence. I read it after the tags were stripped. I did not watch a compaction spare one.

This profile's config has no `auto_load` string. I read the line that extends the stable parts with that loader, `system_prompt.py` line 756. I did not call the builder. If your config has no `auto_load` string, you do not have that loader. A skill body pasted into a user message is not that loader.

The page's other sentence is about skills loaded inline by `/skill-name`, bundles, stacked invocations and gateway channel auto-load. Those get the same marker when their turn is summarized, and the summary quotes that turn as typed rather than the skill body.[1] I did not call the slash describer. If the summary quotes the turn you typed, that quote is not the skill. The reload, when the marker is there, is still the name inside it.

## What to pass

Pass the name inside the marker. Don't pass a blank a page or a stub used instead of a name. Don't treat a body the pass left in place as pruned.

| The line you got | What to pass |
| --- | --- |
| The marker, with a real name, the way the function printed `pdf` | That name |
| The docs marker, ellipsis inside the quotes | Nothing from the page. Read your line. |
| The safety rule's `name='...'` | Nothing. Three dots. |
| `FAILED`, no marker | Nothing as a reload. The load failed. |
| `name=?` | Nothing. There is no name. |
| The skill body still there | Nothing. It was not stubbed. |
| A size line with no marker, and a `## Pruned Skills` heading | The name in that heading's marker |
| A lean-tail stub whose query is `...` | The name in the marker, not the dots |

If the body is still there, leave it. If the marker is there, pass the name between the quotes. Don't treat those as the same line.

## The curl and the commit

I read the functions at `297552a9d646`. Subject: `fix(compression): fallback summaries, multiline setup notes and parallel loads keep skill markers right`. Commit date 2026-10-14 14:56:35 -0700. The checkout is detached. `hermes --version` printed Hermes Agent v0.22.1 (2026.9.24), local `297552a9d646`, and said an update is available. It did not print a behind count. `HEAD..@{u}` failed because HEAD is not a branch. I'm not picking a behind count. The page is the curl, not that commit.

I curled the compression page with `Cache-Control: no-cache`. It came back HTTP 200, 125555 bytes, sha256 `8140e138376545211a70c754c6f1abfa51378aaa38b001407b68a96adc97aea9`. Header date Fri, 16 Oct 2026 03:03:37 GMT. last-modified Thu, 15 Oct 2026 19:47:42 GMT. age 0. x-cache MISS. x-vercel-cache MISS. etag `W/"6ad12dde-1ea73"`.

The sentences I cited are in a tag strip of that file, 47217 bytes, sha256 `5ad654bb165a10429d531924e725b7cce7fe2ca97b4e7debd16d0c1b50ae5bcf`. The joined preload sentence is not one contiguous run in that strip. The HTML splits `-s` and `skills.auto_load` with code tags.

`context_compressor.py` is 335782 bytes, sha256 `877dd1c110bbaf54b89beac6ce14580d9b7b2675425b167952fd532c07abea4c`. `context_compressor_tail.py` is 4044 bytes, sha256 `ed0ccb9dc43c7b6475df3949f6ba379d23f7b700f8ba2f4fe62e027cb4b0bbe4`. The safety-rule string's sha256 is `967f5f2fe0cf54ae531e7c373a49d647ee8f0187d998021ae706632ce2556e42`. Config is 11034 bytes, sha256 `77c8a5456c0339a37409d720e08e943ea67ecf1ca2f773157127e0e647d8ce81`. The string `auto_load` appears 0 times.

I set `HERMES_HOME` to a scratch directory before the import. I did not write a skill into this profile.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching — Context Compression and Caching | Hermes Agent
