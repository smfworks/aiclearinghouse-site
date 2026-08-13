---
slug: "2026-08-13-stockfish-packet-production"
title: "Stockfish Packets 1.1.0: Citation Integrity Is Not a License to Write /etc"
excerpt: "hermes-plugin-stockfish-packet validated claims well and wrote files anywhere you pointed it. The production pass adds path guards, atomic saves, a 2MB cap, and tests that actually try to write /etc."
date: "2026-08-13"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Hermes", "Plugins", "Production", "SMF Works"]
tags: ["stockfish", "research", "citations", "production", "hardening", "lofoten"]
readTime: 4
image: "/images/blog/2026-08-13-stockfish-packet-production.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-stockfish-packet-production"
---

# Stockfish Packets 1.1.0: Citation Integrity Is Not a License to Write /etc

**By William (Skald + Shipwright), SMF Works**  
**Repo:** [smfworks/hermes-plugin-stockfish-packet](https://github.com/smfworks/hermes-plugin-stockfish-packet)  
**Release:** [v1.1.0](https://github.com/smfworks/hermes-plugin-stockfish-packet/releases/tag/v1.1.0)  
**PR:** [#1](https://github.com/smfworks/hermes-plugin-stockfish-packet/pull/1) (merged)

Named for torrfisk, not chess. A claim without a source is wet fish in the hold. Yesterday’s plugin already enforced that. Today’s pass is about the other failure mode: a research tool that will `open(path, "w")` wherever an agent string points.

## Original state

- Schema `smf.stockfish_packet.v1`, grades `rotten | wet | curing | stockfish`.
- Four tests. They covered empty validate, broken support, a clean two-source claim, and weasel opposition. They passed.
- README was sixteen lines. No CLI examples. No grade table. No mention that `path` writes the filesystem.
- `load_packet` / `save_packet` used raw `open()`. No size cap. No atomic replace. No blocked prefixes.
- `init_packet("", "")` succeeded. An empty title is not a packet.
- `oppose_claims` could throw on a non-numeric `confidence` (`float("nope")`).
- Same abbreviated MIT as Fjord (`NOASSERTION` on GitHub). No CI.

The validator itself was the strongest part of the Lofoten trio. Production work here is **I/O discipline**.

## Decisions

1. **Keep the schema and tool names.** `stockfish_validate`, `stockfish_init_packet`, `stockfish_oppose_claims` are already in Hermes deferred tool catalogs.
2. **Path is operator input, but not a suicide pact.** Reject null bytes and writes under `/etc`, `/proc`, `/sys`, `/dev`, `/root`, `/boot`. Do not invent a chroot.
3. **Saves are atomic.** `mkstemp` in the destination directory, then `os.replace`. A crash mid-write should not leave half a packet as the real file.
4. **2MB load cap.** Research packets are JSON objects, not log dumps.
5. **Handlers never raise.** `{ok: false, error, version}`.
6. **Tests must attempt the protected write.** If we only document the guard, we did not test it.

## What changed

**Code**

- `safe_user_path()` on every load/save.
- `save_packet` returns the resolved path; init handler reports it.
- `init_packet` requires non-empty title and topic.
- `oppose_claims` treats bad confidence as 0.0 instead of exploding.
- Validate/oppose payloads carry `version`.

**Tests** — 4 → **12**.

New cases: empty title, duplicate source ids + `ftp://` URL, orphan + contested warnings, single-domain opposition, `/etc/passwd` reject, save/load roundtrip, non-object JSON, handler refuse of `/etc/stockfish-should-fail.json`.

Local: `12 passed`. CI 3.10–3.12 green. GitGuardian green.

**Docs:** full MIT, CI, Dependabot, SECURITY (guards named), ARCHITECTURE, CONTRIBUTING, CHANGELOG, a README a stranger can run.

## Architecture

```
init_packet → validate_packet → oppose_claims
load_packet / save_packet   (guarded I/O)
```

Opposition is still **heuristic-v1**. Weasel phrases, absolute wording plus high confidence, single source, single domain, over-long claims, missing confidence. It is not an LLM judge and we do not advertise it as one.

## Lessons

- Citation integrity and filesystem integrity are different jobs. The sprint nailed the first and ignored the second.
- A test that never aims at `/etc` is not a path-guard test.
- Atomic replace is three extra lines. Half-written JSON in a research packet is a week of confusion.
- Empty required fields should fail at init, not show up later as a “wet” grade that looks like progress.

## Remaining limits

- Path guards are prefix-based, not a sandbox. Home-directory overwrites are still allowed; that is the feature.
- Opposition will not catch a well-written falsehood.
- No packet store or locking across processes.

Sibling posts: Fjord 1.1.0, Maelstrom 1.1.0, Harbor 1.1.1.
