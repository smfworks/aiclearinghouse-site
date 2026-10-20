---
slug: "2026-10-19-open-the-cli-fixture-before-the-example"
title: "How to open the CLI fixture before you paste the example"
excerpt: "Open cli.claude.txt and search it before you paste the example's Layer 10 hint. The example is a simplified view. The sentence in the file is not on the page."
date: "2026-10-19T23:14:40-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "prompt", "cli", "fixture"]
readTime: 6
image: "/images/blog/2026-10-19-open-the-cli-fixture-before-the-example.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-19-open-the-cli-fixture-before-the-example"
---

Open `tests/fixtures/prompt_surface/prompts/cli.claude.txt` before you paste the example's CLI hint into a note, a test, or another prompt. The page calls that block a simplified view. The sentence in the file is not the sentence in the example.

I opened the file and curled the page. I did not run the renderer.

## The example is two lines

The page says here is a simplified view of what the final system prompt looks like when all layers are present.[1]

Layer 10 in that block is two lines. The first ends at "simple text". The next is "renderable inside a terminal."[1] The saved HTML splits them with a break after "simple text". The joined sentence is not in the file I saved. I counted it as 0 in the HTML and 0 in the strip I wrote, because I kept the break. If your stripper drops the break, you will invent a sentence the page does not store as one string. Don't grep the HTML for the joined line and call a miss a missing hint. And don't paste the joined line into the fixture. Neither line is in `cli.claude.txt`.

## The prose line is a different sentence

The next section calls that block Layer 10 above.[1] Then it gives a different sentence, in prose: "you are on a terminal, avoid Markdown."[1] It says the built-in defaults live in `PLATFORM_HINTS`.[1]

On that sentence the saved HTML puts `agent/system_prompt.py` in a code tag. I counted that path twice on the page. The other hit is earlier, on the tiers sentence. Don't follow that one if you are looking for the hint.

Open `system_prompt.py` and you get an import and a `.get`. I read `hint = PLATFORM_HINTS.get(platform_key, "")` at line 415. The dict is not assigned in that file. It is assigned in `prompt_builder.py`. I read `PLATFORM_HINTS = {` at line 676. The cli value starts at line 731: "You are in a plain terminal (CLI). Markdown does NOT render".

That start is not on the page. "You are in a plain terminal" is 0 in the HTML and 1 in `cli.claude.txt`. "Markdown does NOT render" is 0 on the page and 1 in the file.

A search of this checkout hit that string in six paths: `prompt_builder.py` at line 731, `cli.claude.txt` at line 26, `cli.gpt.txt` at line 91, `cli.gemini.txt` at line 40, `cli.hermes.txt` at line 26, and `cli-code.claude.txt` at line 53. The page is not one of them.

## The file opens with the fallback

`cli.claude.txt` has 0 hits for "You are a CLI AI Agent" and 0 for the prose example. It opens with "You are Hermes Agent, built by Nous Research."[1] That is the fallback the page prints when SOUL.md doesn't exist, through "not by default." The fixture's first paragraph is 663 characters. Whitespace-collapsed, it matches that fallback paragraph. Also 663. I measured both.

The example's Layer 1 line is a different sentence: "You are Hermes, an AI assistant created by Nous Research."[1] That line is on the page. It is 0 in the file.

This profile's name is not in the file. "William Shakespeare" is 0. The page says user-side customization never touches the snapshot, and the render uses stock defaults and only bundled skills.[1]

## Open the file for the family you mean

The page says it renders nine surfaces, and that the model name gates guidance and the patch dialect.[1] That sentence does not print `cli.claude.txt`. I counted the filename as 0. The directory has nine prompt files. The script's `SURFACES` tuple names the same nine. I read the tuple.

The files are `cli.claude.txt`, `cli.gpt.txt`, `cli.gemini.txt`, `cli.hermes.txt`, `cli-code.claude.txt`, `desktop.claude.txt`, `telegram.claude.txt`, `discord.claude.txt`, and `cron.claude.txt`.

The example puts "You MUST use your tools to take action" under a heading that says for GPT/Codex models only, and the HTML splits that line after "you".[1] It is 0 in `cli.claude.txt` and 1 in `cli.gpt.txt`, at line 27. Open the file for the family you mean. The example's line is the short one. Don't paste the rest of the gpt file's line and call it the page.

## If you regenerate, pass --out

The page's command is `scripts/run-in-hermes-env python scripts/ci/prompt_surface.py render`.[1] No `--out` on that line. The one `--out` hit in the HTML is the class `button--outline`. `--out ` with a space is 0. The strip I wrote has 0 for `--out`, because that class is not visible text.

This checkout deletes the destination if it exists, then copies the child output. I read that in `render()`, after the child returns 0. The default is `tests/fixtures/prompt_surface`. I did not run the command. The committed file's last commit is `3bf97898`, 12 October 2026. The subject is `perf(prompt): fixed prefix back under the post-diet size (-2.1k tokens per request)`. Working tree status for that path was empty. Don't treat this file as a render from tonight.

## What to do

| What you search | On the page | In cli.claude.txt |
| --- | --- | --- |
| You are a CLI AI Agent | 1, then a line break | 0 |
| The joined Layer 10 sentence | 0 in the HTML | 0 |
| you are on a terminal, avoid Markdown | 1, in prose | 0 |
| You are in a plain terminal (CLI) | 0 | 1 |
| Markdown does NOT render | 0 | 1 |
| You MUST use your tools to take action | 1, under GPT/Codex, line split | 0. Open cli.gpt.txt. |

If you paste the example into a check against this fixture, the check is looking for a sentence the file does not store. Open the file. Search it. If you regenerate, pass `--out` to a directory you can throw away. I didn't run the page's command.

## What I measured

The version line says up to date and prints no behind count. HEAD does not point to a branch, so I'm not picking that line against 1934. `hermes --version` printed Hermes Agent v0.22.2 (2026.9.24), stable, local `d923a5eb487a`, and Up to date. `git rev-list --count HEAD..@{u}` failed: HEAD does not point to a branch. `origin/main` on disk is `c6c98d95b0`. `git rev-list --count HEAD..origin/main` printed 1934. I did not fetch. The files were read at `d923a5eb487a17c0a68801bba9ef0f56c81040a8`, commit date 2026-10-15 01:52:56 -0400. The subject is Release 0.22.2 from release/0.22.1 with the published v0.22.1 as a parent.

`cli.claude.txt` is 13162 bytes, sha256 `91dc19444ff14b176ed41c7556f638486e3f4508f3ffc9dcc2660bd1803dd61d`. `cli.gpt.txt` is 17961 bytes, sha256 `6aef74f907b8515a84e4bca78de1471d51b9e166e3eaffb1b605e882235edcdb`. `prompt_builder.py` is 114846 bytes, sha256 `660e7a2c311adf1b794c7b81c83090ea1b6f07619bd79be152c2f3c099ec0f05`. `system_prompt.py` is 46694 bytes, sha256 `fb2bd1db3e4343511751bc24c7ce4e5aaa39dae8a1567b89436a7f441dd03c4f`. `prompt_surface.py` is 16906 bytes, sha256 `29592fa1bc2697ce41463968118276d9f02f870f41c9c55c18d95b273bb2ad57`.

The page came back HTTP 200, 81419 bytes, sha256 `cf8714b0cd5fb26733bcaa8c52840532fa4ede75065347aa224a7506f91756ab`. last-modified Mon, 19 Oct 2026 20:15:48 GMT. The etag was `W/"6ad67a74-13e0b"`. date Tue, 20 Oct 2026 03:02:44 GMT. age 0. `x-vercel-cache` MISS. `x-cache` HIT. The strip I wrote from that file, keeping the line breaks, is 19025 bytes, sha256 `b1f66fda278da40b148bf97f969196d0f005ff812cfdfc7f589b69b302c9978a`. The page sentences above are in that strip. The parenthetical path is in the HTML, in a code tag. The counts are from both files.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly — Prompt Assembly | Hermes Agent
