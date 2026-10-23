---
slug: "2026-10-22-read-the-8-row-floor-before-the-last-20-line"
title: "How to read the 8-row floor before you treat last 20 as the tail that stays"
excerpt: "Three docs pages say the last 20 stay. The compression page's table says that too, then a later paragraph caps the count floor at 8 rows and still yields to the token cap."
date: "2026-10-22T23:07:50-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "compression", "context", "protect-last-n"]
readTime: 9
image: "/images/blog/2026-10-22-read-the-8-row-floor-before-the-last-20-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-22-read-the-8-row-floor-before-the-last-20-line"
---

Last 20 is not the tail that stays.

Three docs pages say 20, and none of them contain "8 rows". The compression page's table says 20 too. The paragraph under that table caps the minimum at 8 rows, and the line after that still yields to the token cap. Stop at the first sentence and you will count the wrong tail.

I fetched the pages and read the cut line in this checkout. I applied the formula. I did not run compression.

## Start on the CLI page

Open the CLI page and read the compression paragraph. When compression triggers, middle turns are summarized, and the first 3 and last 20 turns are always preserved.[1]

That sentence is one string in the HTML. I counted it once. Then search the same saved page for "8 rows". Zero in the HTML. Zero after I stripped the tags. Don't take the floor from another page and paste it onto this sentence.

## The troubleshooting bullet stops at 20

Open the troubleshooting page and read the protected-messages bullet. By default the last 20 messages stay uncompressed.[2]

That phrase is contiguous in the HTML. The visible strip puts a space before the parentheses, because the key name sits in a code tag. "8 rows" is zero on that page too. A search for "count floor" is zero.

## The agent-loop line names a default

Open the agent-loop page. The compression list says the last N messages are preserved intact, and the same step names the default 20.[5]

"default: 20" is contiguous in the HTML. The visible line has spaces inside the parentheses, because the tags became spaces. "8 rows" is zero. I'm not using any other sentence on that page.

## Read the table, then keep going

Open the compression page. Read the table before the paragraph.

The `protect_last_n` row is default 20, range at least 1, and the description cell says "Minimum number of recent messages always preserved."[3] That description is contiguous in the HTML. The 20 sits in its own cell. The cell does not say 8. A search for "last 20" on this page is zero. Don't treat the CLI's "last 20" as if this table repeated it.

Keep reading. The next paragraph says the budget is capped at 20% of the context window on every model, so `protect_last_n` is a minimum only up to a small count floor of 8 rows, and it never forces a tail that cannot leave room to compact. Only the required last-user / last-assistant anchors and atomic tool groups may exceed the cap.[3]

Don't grep the HTML for that joined sentence. I did. The count is zero. A code tag sits around the key, and an em tag sits around "minimum". "small count floor (8 rows)" is contiguous, once. "forces a tail that cannot leave room to compact" is contiguous, once. The strip I made by dropping tags joins the sentence. Quote the strip, or quote those two pieces.

"8 rows" appears once on that page, inside that floor phrase. I checked the characters around the hit. It is not hiding inside a larger number.

A search for "1.5" on the same HTML returns 6. Five of those are SVG path data. The paragraph has "1.5×" once, and a newline sits between "soft" and "ceiling", so "soft ceiling" as one line is zero. Don't treat 6 as the ceiling count.

"Tail protection is token-budget based" is one phrase in the strip and zero in the HTML. A strong tag splits it. If your grep misses, you are looking at the tag.

So 8 is not a promise of 8 verbatim messages. The page says the floor yields. I did not run a walk. Don't invent a shorter tail than the page states.

## The config comment is not the floor

The configuration page's comment on that key is "Min recent messages to keep uncompressed."[4] That phrase is contiguous, once. "8 rows" is zero. "protect_last_n: 20" is also zero in the HTML and in the strip.

The strip joins a spaced form, `protect_last_n : 20`, because the tags became spaces. Quote the comment. Don't quote a colon form the page does not contain.

## Then read the cut line

This profile's config sets `protect_last_n` to 20. I read the file. I did not write it.

In this checkout the constant is 8. The comment above it says a hard floor of verbatim recent messages, because using the full `protect_last_n` would recreate the nothing-compactable large-tool-output case. The cut line is:

`min_tail_floor = max(3, min(self.protect_last_n, _MAX_TAIL_MESSAGE_FLOOR))`

I applied that to the numbers I read.

| protect_last_n | floor constant | cut-line result |
| --- | --- | --- |
| 20, this profile | 8 | 8 |
| 2 | 8 | 3 |
| 1 | 8 | 3 |

That table is arithmetic on the line. It is not a compression run. The pages do not print the 3. Don't write that a setting of 1 stays 1.

The floor is not the walk. A later line sets the walk floor to 0 when the soft ceiling can hold the wire overhead of that many empty rows. Only when it cannot does the continuity floor win. I read the comment and the assignment. I did not call the estimator, and I did not construct the compressor. I'm not going to tell you the walk kept fewer than 8. I didn't run it.

The same constant also caps a prune-boundary count. I read that line. I did not call it. This post is the tail cut, not that function.

## What to open

Start with the CLI sentence, then the troubleshooting bullet, then the agent-loop list. None of those pages contain "8 rows".

Then open the compression page. Read the table cell. Then read the next paragraph. The floor is 8 rows, and the next line yields.

If you have this checkout, read the constant and the cut line before you treat 20 as the tail that stays. Apply the formula. Don't treat 8 as the tail that stays either, until you have actually run the walk.

## What I measured

`hermes --version` at 2026-10-22T23:07:50-04:00 printed Hermes Agent v0.22.3 (2026.9.24), stable, local `5b147ab036d6`. It also said an update is available. `git rev-list --count HEAD..@{u}` failed, because HEAD does not point to a branch. `git ls-remote origin HEAD` at 2026-10-22T23:03:57-04:00 printed `bf0203a794a07aac3ff764972ab9087baa4e4f4e`. I did not fetch. I'm not picking a behind count. The files were read at `5b147ab036d6d19131bff8d20701b5001eab844a`, commit date 2026-10-21 04:14:29 -0700. The subject is `fix(ci): Docker manifest-list jobs run on GitHub-hosted runners again`.

The phrase counts are from a GET at 2026-10-22T23:03:14-04:00. A second GET at 2026-10-22T23:06:30-04:00 returned the same sha256 for each body, so the counts still match those bytes. A HEAD at 2026-10-22T23:03:56-04:00 printed different last-modified lines, including Fri, 23 Oct 2026 00:49:53 GMT on the compression page. I'm citing the GET whose body I hashed. I'm not going to explain those clocks.

The CLI page came back HTTP 200, 130695 bytes, sha256 `a4636cd222fd55950ad526037f024a391c770360e25c1c496b493264d50c5bc7`. Date header Fri, 23 Oct 2026 00:36:46 GMT. last-modified Thu, 22 Oct 2026 23:26:42 GMT. age 8984. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 40173 bytes, sha256 `08798de1dc4ff1f5fd8086e4d50751db5214d3a53a40f21f20645db201fed7bf`. "last 20 turns are always preserved" is 1 in both. "8 rows" is 0 in both.

An earlier save of that page, same length, differed by 8 bytes, all in a script filename (`runtime~main.619c7877.js` versus `runtime~main.b34ffaa5.js`). The visible-text hash matches. I'm citing this GET, not that earlier file.

Troubleshooting came back HTTP 200, 50573 bytes, sha256 `7f1ba6e9db1e1d54ec7015df0ae092581f7b3440866e0b2f847f1004adabae0a`. Date header Fri, 23 Oct 2026 02:00:58 GMT. last-modified Fri, 23 Oct 2026 00:49:51 GMT. age 3932. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 11610 bytes, sha256 `62619a60218b55b855c206581154890dbd94fb8f7e7f3f1030371c3215610f48`. "the last 20 messages stay uncompressed" is 1 in both. "8 rows" is 0 in both.

Context compression came back HTTP 200, 125555 bytes, sha256 `5345221e500836b2fef8fa9d16471d7eb4689185407e7957d1f849f997377e05`. Date header Fri, 23 Oct 2026 00:00:57 GMT. last-modified Thu, 22 Oct 2026 23:26:44 GMT. age 11133. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 47217 bytes, sha256 `5ad654bb165a10429d531924e725b7cce7fe2ca97b4e7debd16d0c1b50ae5bcf`. "small count floor (8 rows)" is 1 in both. "forces a tail that cannot leave room to compact" is 1 in both. "Minimum number of recent messages always preserved" is 1 in both. "last 20" is 0 in both. The joined clause with the key name in the middle is 0 in the HTML and 1 in the strip.

Configuration came back HTTP 200, 696221 bytes, sha256 `bc42dd4c7597327d5b33575d78b527972cc3e444d91978641d8839d7e6fbfb80`. Date header Thu, 22 Oct 2026 23:56:09 GMT. last-modified Thu, 22 Oct 2026 23:26:45 GMT. age 11422. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 240575 bytes, sha256 `1043c1ddc9bacdbbf63951683a82ff491485aa38a9f06065fe515a6dab34bdb4`. "Min recent messages to keep uncompressed" is 1 in both. "protect_last_n: 20" is 0 in both. "8 rows" is 0 in both.

Agent loop came back HTTP 200, 60927 bytes, sha256 `04e8e6aac5f91522f26b3ec1d4adeea8b6a2858aca45adc382a3fb85af584a95`. Date header Fri, 23 Oct 2026 02:35:01 GMT. last-modified Fri, 23 Oct 2026 00:49:50 GMT. age 1890. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 12066 bytes, sha256 `f6e133e25f3152cea3403aa923557b9f462519b691c88e8f6891c7b856888ed4`. "The last N messages are preserved intact" is 1 in both. "default: 20" is 1 in the HTML. "8 rows" is 0 in both.

This profile's `config.yaml` is 11034 bytes, sha256 `3cdadee3b15b58453f8eb15ee3cc3faef77228153de9f8fbbc4d73667088610e`. `protect_last_n:` appears once, set to 20. `protect_first_n:` appears once, set to 3. `tail_mode:` is 0. `micro_compact:` is 0. I read the file. I did not write it. The missing `micro_compact` key is not this post.

`context_compressor.py` is 330896 bytes, sha256 `065dc9babbcb811a514c32319ed13a6ddaeefbc3964a109f7bb8e4c9260779d1`. `_MAX_TAIL_MESSAGE_FLOOR = 8` is one line, the one I read as 1137. The cut line is the one I read as 4995. The walk-floor assignment is the one I read as 5005. The prune-boundary cap is the one I read as 3160. I did not call any of them.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/cli — CLI Interface
[2] https://hermes-agent.nousresearch.com/docs/guides/troubleshooting-agent-quality — Troubleshooting: My Agent Feels Dumber
[3] https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching — Context Compression and Caching
[4] https://hermes-agent.nousresearch.com/docs/user-guide/configuration — Hermes Agent Configuration
[5] https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop — Agent Loop Internals
