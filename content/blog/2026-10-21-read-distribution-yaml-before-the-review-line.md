---
slug: "2026-10-21-read-distribution-yaml-before-the-review-line"
title: "How to read distribution.yaml before you treat the review line as proof"
excerpt: "The review line is the listing. If distribution.yaml sits next to SOUL.md, that line can still say review the file while the loader blocked the body."
date: "2026-10-21T23:05:52-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "soul", "distribution", "context"]
readTime: 7
image: "/images/blog/2026-10-21-read-distribution-yaml-before-the-review-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-21-read-distribution-yaml-before-the-review-line"
---

The review line is the listing. It is not the loader.

If you see `loaded — matched prompt-injection pattern(s); review the file` and you have not opened distribution.yaml, you do not know whether SOUL.md entered the prompt. The listing in this checkout always marks that row as yours. The loader does not.

I curled four docs pages and called both functions on temp homes. I did not run `/context` in a chat. I did not install a profile.

## Read the scanner paragraph on the SOUL guide

Open the SOUL guide. Read the paragraph under How Hermes uses it. A scanner hit does not block the way it blocks a project AGENTS.md. The file still loads, Hermes logs a warning naming the matched pattern, and `/context` marks the file `⚠ … review the file`.[1]

That page's visible text contains "distribution" zero times. The HTML does too. Don't borrow the owns sentence from another page and paste it onto this paragraph. It is not there.

The raw HTML does not contain "does not block" as one string. Tags split it. The strip I wrote has it once. If you grep the HTML and get zero, you are looking at the tags.

## Then read the owns sentence

Open the context-files page and read past the sentence about your own file. Your own SOUL.md does not block. The exception does not extend to a SOUL.md shipped by a profile distribution. When distribution.yaml owns the file, a scanner hit still blocks it.[2]

The security page has that same owns-and-blocks sentence.[3]

The context-files page also prints the `/context` line as `⚠ SOUL.md … loaded — matched prompt-injection pattern(s); review the file`.[2] Once in the HTML. Once in the strip. That is the page's line. This checkout did not print it.

## Look for the file

distribution.yaml sits next to SOUL.md, or it doesn't. If it is absent, you are in the guide's case.

This profile has no such file. `read_manifest` returned None. `load_soul_md` returned 14774 characters and did not start with `[BLOCKED:`. It started with `# SOUL.md`. I did not quote the rest. I did not put a scanner phrase in this profile's file, so this is the absent-file case, not a hit.

## If the file is there, don't stop at the note

The note is the listing. In this checkout, `list_context_file_sources` passes `user_authored` true for the SOUL row it finds. Every time. `load_soul_md` does not.

The check is a boolean in `load_soul_md`. No manifest means the file is yours. An empty `distribution_owned` list means it is not. So does a list that names SOUL.md. A non-empty list that leaves SOUL.md out means it is yours again. I read that, then I called it.

I wrote the guidance line from this checkout's test into four temp homes. The line contains "telling you to ignore previous instructions". 164 characters. `estimate_tokens_rough` on that string returned 42. I did not write this profile.

| What sat next to SOUL.md | Loader | Listing |
| --- | --- | --- |
| No distribution.yaml | the body | flagged, `loaded` true, review note, 42 tokens |
| Name and version only. No `distribution_owned` key | `[BLOCKED: SOUL.md contained potential prompt injection (prompt_injection). Content not loaded.]` | flagged, `loaded` true, same note, 42 tokens |
| A list that names SOUL.md | the same BLOCKED string | flagged, `loaded` true, same note, 42 tokens |
| A list that names `skills/` and omits SOUL.md | the body | flagged, `loaded` true, same note, 42 tokens |

The dict's `loaded` flag is true for `flagged`. That flag is not the prompt. In the two owned cases the prompt return was the BLOCKED string, 95 characters, and the flag was still true.

I rendered the SOUL row alone. All four lines were:

`⚠ SOUL.md ~       42 tokens  (loaded — matched prompt-injection pattern(s); review the file)`

None of them contained `…`. The pages use an ellipsis. The print uses a token count and parentheses. Search the printout for the parenthetical note, not for `⚠ … review the file`. If other files are in the listing, the spaces before the number change. The note does not.

## Read the verb in the warning

Both paths logged a warning. The load warning was `Context file SOUL.md matched injection pattern(s) prompt_injection; loaded anyway because it is the user's own file in HERMES_HOME — review it if you did not write that text`. The block warning was `Context file SOUL.md blocked: prompt_injection`.

A warning is not the verb. Read `blocked` versus `loaded anyway`.

## A missing key is not "not owned"

The distributions page is the update table, not the scanner. It says when the list is omitted, the defaults above apply.[4] The Distribution-owned row on that page names SOUL.md, config.yaml, mcp.json, skills/, cron/jobs.json, and distribution.yaml.[4]

The name-only file I wrote is that omitted-list shape. The loader blocked. Do not read a missing key as "SOUL.md is not owned."

The constant this checkout printed is not that row. `DEFAULT_DIST_OWNED` is SOUL.md, config.yaml, mcp.json, skills, cron, distribution.yaml. The page says `skills/` and `cron/jobs.json`. Don't correct one into the other. What I measured is the parsed list. An empty list blocked. A list that names SOUL.md blocked.

I did not write an unreadable manifest. The function I read sets `user_authored` false if that read raises. I did not call that branch. Don't invent the print.

## What to open

Open the directory that holds SOUL.md. If distribution.yaml is not there, the guide's case is the one you have. A review note then means the file loaded with a warning.

If the file is there, open it. No `distribution_owned` key is the omitted-list case. The loader I called blocked that case. A list that names SOUL.md blocked too. The list that named `skills/` and left SOUL.md out returned the body, and the listing still printed the review note. I did not try a second omitted name.

Then read the log. `loaded anyway` means the body went in. `blocked` means the prompt got the BLOCKED marker, even while the listing still says review the file.

If the string on your screen has the ellipsis from the docs and not a token count, you are reading the page. Not the print.

## What I measured

`hermes --version` printed Hermes Agent v0.22.3 (2026.9.24), stable, local `5b147ab036d6`. It also said an update is available. `git rev-list --count HEAD..@{u}` failed, because HEAD does not point to a branch. `git ls-remote origin HEAD` printed `4e58c721c8cf9b51c46636ea84ea6a5cb540880a`. I did not fetch. I'm not picking a behind count. The files were read at `5b147ab036d6d19131bff8d20701b5001eab844a`, commit date 2026-10-21 04:14:29 -0700. The subject is `fix(ci): Docker manifest-list jobs run on GitHub-hosted runners again`.

The probe started at 2026-10-21T23:03:54-04:00. I'm not going to explain those clocks.

The SOUL guide came back HTTP 200, 58524 bytes, sha256 `f5939974593dae1b00e6e6b48c64248cdeef1a6958d095c474be16a265342cff`. last-modified Thu, 22 Oct 2026 00:34:25 GMT. The date header was Thu, 22 Oct 2026 00:56:53 GMT. age 7621. `x-cache` HIT. `x-vercel-cache` HIT. The strip is 9000 bytes, sha256 `c11788375a92f34e97851bb4eeda9319a76e06b01dd2803a8a6541a99b254ce8`. "distribution" is 0 in both. "does not block" is 0 in the HTML and 1 in the strip.

Context files came back HTTP 200, 64543 bytes, sha256 `fc5aea24c815b2547d441e23d33ac6bfab285337370dce0a9f64dacca573d5e3`. last-modified Thu, 22 Oct 2026 00:28:22 GMT. date header Thu, 22 Oct 2026 00:40:15 GMT. age 8620. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 12975 bytes, sha256 `0419a46ab5577fbf47dd7cd5693f4759c757a2bdea0f9dda639716920655aa87`. "scanner hit still blocks" is 1. The page's ellipsis line is 1.

Security came back HTTP 200, 177211 bytes, sha256 `5ab3fbf8aab9b977de7fbf3eaa81bc72ef1f3ba75ee9eaf2fad7d2845aa6ae76`. last-modified Thu, 22 Oct 2026 00:34:31 GMT. date header Thu, 22 Oct 2026 01:21:43 GMT. age 6132. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 62212 bytes, sha256 `1a831c0b5e2a85b2ffe70177e7108894e2f8b5f70a51a0046035a2ec4dbfc796`. The owns-and-blocks sentence is 1.

Profile distributions came back HTTP 200, 151207 bytes, sha256 `0c0ed0ee069d7777d0239ea72d85217b4a2aac1b2ff3dd0aee11c528092c126a`. last-modified Thu, 22 Oct 2026 01:45:08 GMT. date header Thu, 22 Oct 2026 03:01:04 GMT. age 171. `x-cache` MISS. `x-vercel-cache` HIT. The strip is 34697 bytes, sha256 `00c1b130a6a4fc3a090856de308193799348ff463246d1daf7d61813f86d9375`. "When omitted, the defaults above apply" is 1.

`prompt_builder.py` is 106794 bytes, sha256 `f4500660b1ba9cbce98236dfe92dab3dd30f2152daac1f5750c8de26f21f7b3c`. `context_file_sources.py` is 6495 bytes, sha256 `b0ab049f4a17a1e04fc5675ca70b123d472ad9d554580a505901231b758b1933`. `profile_distribution.py` is 28703 bytes, sha256 `f184ce2ad5321c350fd60aee1e72d903851ef25552ad09e6dfe51648ab36d414`.

This profile's SOUL.md is 210 lines, 14836 bytes, sha256 `9f79be7b4de0c8e02e8649f64830ebbd231c7ed24284cb71e4a4f3244e4a4ee0`. I did not quote it. I did not explain the gap between 14836 bytes and 14774 characters.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/guides/use-soul-with-hermes — Use SOUL.md with Hermes

[2] https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files — Context Files

[3] https://hermes-agent.nousresearch.com/docs/user-guide/security — Security

[4] https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions — Profile Distributions
