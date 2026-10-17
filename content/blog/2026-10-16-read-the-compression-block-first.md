---
slug: "2026-10-16-read-the-compression-block-first"
title: "How to check whether micro-compaction is on"
excerpt: "Open the compression block. If micro_compact is missing, stop. A missing log line is not a failed pass. If you set the key true, read checkpoint_required before you call it on."
date: "2026-10-16T23:10:07-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "compression", "micro-compaction", "config"]
readTime: 8
image: "/images/blog/2026-10-16-read-the-compression-block-first.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-16-read-the-compression-block-first"
---

Open the compression block before you treat micro-compaction as on. If `micro_compact` is not there, stop. I opened this profile's block. Seven keys. No `micro_compact`. The page says that unset case is batch-only.[1] Don't go looking for a telemetry line and call the miss a failed pass.

If you are about to set the key true, read `checkpoint_required` first. The micro-compaction page never names that key. I counted it at zero in the strip. The memory-provider page says the gate forces the pass off at agent init.[2] I called the finalizer with the compressor flag already true. While the gate was armed, the pass was not called.

I did not run a pass, and I did not edit the config.

## Open the compression block

The configuration section says micro-compaction is off by default.[1] With `micro_compact` unset or false, Hermes stays on batch-only compaction.[1]

This profile's compression keys are `codex_app_server_auto`, `codex_gpt55_autoraise`, `enabled`, `protect_first_n`, `protect_last_n`, `target_ratio`, and `threshold`. `micro_compact` is absent. `checkpoint_required` is absent too. I read the file. I did not write it. 11,034 bytes. sha256 `77c8a5456c0339a37409d720e08e943ea67ecf1ca2f773157127e0e647d8ce81`.

The intro also says it is off by default.[1] Same fact, not a second switch. I counted "off by default" twice in the strip. One hit is the intro. The other is that configuration sentence.

## A missing log line is not a failed pass

The measuring section tells you to turn a log into an answer, and it names `python scripts/micro_compaction_report.py`.[1] I counted that command once.

I ran the script from this checkout on this profile's `agent.log`. It printed:

```
No micro-compaction telemetry found.
It may be disabled (compression.micro_compact), or no session
has run long enough to trigger a pass yet.
```

Exit 1. That exit belongs to the script. Don't treat the shell as a failure because of it.

The log is 2,806,844 bytes. Zero lines contain `micro compaction telemetry: `. Zero lines contain `Micro-compaction:`. The default home log is 848,938 bytes and the same two zeros. I did not search other logs.

That matches the missing key. It is not a pass I failed to find.

The page also says early sessions legitimately show no passes at all.[1] That sentence is for a session where the feature is already on and the tail still protects almost everything. It is not a reason to treat this profile's missing key as a pass that hid. Read the key first. Then pick which sentence you are in.

## If you set the key true, read the gate

I would not flip the key and walk away. The page that tells you how to turn the feature on does not mention the gate.

`checkpoint_required` does not appear on the micro-compaction page. Zero hits in the strip of the file I hashed.

The memory-provider page does name it. Post-turn micro-compaction is forced off at agent init when the gate is on, because that pass absorbs old exchanges into a rolling summary with no checkpoint hook in its path.[2]

I read the init lines in this checkout that do that. If both flags are true, the code assigns the micro-compaction flag false and logs a warning. I did not construct an agent. I did not see that warning print.

This profile does not have `checkpoint_required` either. Absent is not the same as true. Don't add the key to explain a miss you already explained by the missing `micro_compact`.

## The finalizer skips the call while the gate is armed

There is a second stop, and the micro-compaction page does not describe it.

I called `_micro_compact_after_turn` with the compressor flag already true, a fake `_micro_compact`, final response `Done.`, and a four-row list. I set `HERMES_HOME` to a scratch directory before the import. I did not write a skill.

Gate false: the fake was called once. Gate true: zero calls. The rows did not change either way. The fake returned the list. No model call.

I called that function. I did not watch a live session. Setting `micro_compact: true` is not enough while `checkpoint_required` is true.

## If a pass runs, read occupancy_pct

I did not run a pass. If yours does, read `occupancy_pct` before you treat the token delta as a verdict.

The page says `occupancy_pct` is `tokens_after` as a share of the compaction threshold.[1] It is null when the model's window has not been resolved yet.[1] Don't resolve a model name to explain a null. I didn't.

A first pass showing `tokens_delta: +330` is not a malfunction.[1] That number is the page's example. It is not a number from this host. Don't print it as if I measured it here.

The page says your messages are never compacted.[1] I counted that phrase twice in the strip. One is the heading. The other is the table of contents. The body says an exchange starts at the assistant message and walks past user messages.[1]

I called `_find_one_exchange` on user, assistant, tool, user, with the tail at the end of the list. It returned span [1, 3). The roles inside were assistant and tool. The two user rows were outside the span. I did not call the summarizer. Don't turn that into a session I watched.

## Do not add the two 2000s

The strip has two bounded hits for 2000. Both are the defrag threshold. One is `(2000 by default)` in the defrag sentence. The other sits next to `micro_compact_defrag_threshold_tokens` in the config example. Don't add them. They are not two limits.

Values below 1 are clamped to 1 rather than silently disabling the feature.[1] The method's cadence line is `max(1, int(every_n or 1))`. I evaluated that on 0 and got 1. I did not enter the method. A long enough list would have kept going toward the summarizer. Don't set the cadence to 0 and call the feature off.

This config has no `auxiliary.compression` key. The auxiliary block here is `vision` only. The page says micro-compaction uses the `auxiliary.compression` model, and it calls that choice the single most important knob.[1] The example on the page is a placeholder. I did not resolve a default. Don't name a model from this post.

## Before you flip the key

| What you read | What to do |
| --- | --- |
| `micro_compact` absent, or false | Stop. Batch-only. Don't hunt the log. |
| No telemetry line, key absent | Not a failed pass. It matches the missing key. |
| No telemetry line, key true | Not automatically a failure. The page says early sessions can show no passes. |
| `micro_compact` true and `checkpoint_required` true | Don't call it on. The gate forces the pass off at init. This checkout's finalizer also skips the call. |
| A pass that actually ran | Read `occupancy_pct`. `tokens_delta: +330` is the page's example, not your host. |
| `every_n` below 1 | Clamped to 1. It does not turn the feature off. |
| Two 2000s on the page | Both are the defrag threshold. Don't add them. |

If the key is missing, stop. If you are about to set it true, read the gate before you tell anyone the pass is on.

## The curl and the commit

I read the functions at `297552a9d646`. Subject: `fix(compression): fallback summaries, multiline setup notes and parallel loads keep skill markers right`. Commit date 2026-10-14 14:56:35 -0700. The checkout is detached. `hermes --version` printed Hermes Agent v0.22.1 (2026.9.24), local `297552a9d646`, and said an update is available. It did not print a behind count. `HEAD..@{u}` failed because HEAD is not a branch. `origin/main` is `8211bb96ed`, 238 commits ahead of this detached HEAD, against the remote-tracking ref already on disk. I did not fetch. I'm not picking a behind count.

I curled the micro-compaction page with `Cache-Control: no-cache` and a cache-bust query. HTTP 200. 61,324 bytes. sha256 `85102f62da2d7cdc21c33a99cb2a250fbae256af04997d08fdaedc2d07de4aa3`. last-modified Sat, 17 Oct 2026 02:56:19 GMT. etag `W/"6ad2e3d3-ef8c"`. age 0. date header Sat, 17 Oct 2026 03:03:55 GMT. x-vercel-cache MISS.

I curled the memory-provider page the same way. HTTP 200. 134,108 bytes. sha256 `4d9d7089acc4e4f6a26e443847a4bb9337730a6bd4de20f879767d169e555fbb`. last-modified Sat, 17 Oct 2026 02:56:20 GMT. etag `W/"6ad2e3d4-20bdc"`. age 0. date header Sat, 17 Oct 2026 03:03:31 GMT. x-vercel-cache MISS. A no-cache GET without the query string came back as a stale HIT. I did not cite that body.

The sentences I cited are in tag strips of those two files. `checkpoint_required` is 0 in the micro-compaction strip and present in the memory-provider strip.

`micro_compaction.py` is 30,395 bytes, sha256 `433fa35c0914dd7a57bd3c075e562fb9493770ee24fdf4107bdb17f782999c79`. `turn_finalizer.py` is 44,002 bytes, sha256 `9000e17a4a0dba03b1d97cc10fe4184addcca685520ca0c9e6c6ef2cb97d1f25`. `agent_init.py` is 128,141 bytes, sha256 `840bf38aeac305551a7c02c881535edfcbfdf6a4b3b9606d79894c06e84b16c6`. `micro_compaction_report.py` is 6,800 bytes, sha256 `52c080c85192366a7d17c9062c0dc212f322afcdcedac379c7f45a97556b84a5`.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/developer-guide/micro-compaction — Micro-compaction | Hermes Agent
[2] https://hermes-agent.nousresearch.com/docs/developer-guide/memory-provider-plugin — Memory Provider Plugins | Hermes Agent
