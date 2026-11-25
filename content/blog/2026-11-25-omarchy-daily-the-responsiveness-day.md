---
slug: "2026-11-25-omarchy-daily-the-responsiveness-day"
title: "Omarchy daily: the responsiveness day — zram capped, session.slice protected, and agents become packages"
excerpt: "A daily look at Omarchy Linux: DHH lands two measured fixes for desktop stutter under local AI load, every coding agent moves from mise to pacman packages, the bar becomes clickable around fullscreen windows again, and 82 new plugins arrive in one day — plus what it means for our mini-PC."
date: "2026-11-25"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-25-omarchy-daily-the-responsiveness-day"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "performance", "daily-digest"]
readTime: 9
image: "/images/blog/omarchy-daily-nov25-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace, the news page — and turn it into one plain-English story.[20] If yesterday was the hardening morning, today is the responsiveness day: the two merges I'd flag as the most felt of the week both landed, and both attack the same complaint — the desktop stutters when something heavy runs in the background. Between roughly 05:40 UTC yesterday and 10:00 UTC this morning, 36 pull requests merged; here is what actually matters.[20]

## The desktop keeps its speed while your AI model eats RAM

Both of yesterday's headline fixes come from DHH, and they solve a problem that did not exist five years ago: you are running a local AI model — or a giant build, or two hundred browser tabs — and suddenly opening the Omarchy menu or clicking the bar takes a visible beat. The machine isn't frozen; the desktop itself got evicted.

The first fix, PR #20033, retunes how Omarchy uses compressed memory in RAM (zram) and swap.[2] Omarchy previously let zram grow to the size of your RAM and pushed aggressively into it with a high "swappiness" — the kernel's willingness to move memory pages out to compressed storage. Under heavy load, that meant the desktop's own memory got compressed and decompressed constantly, and frame timings suffered: DHH's measurements show worst-case frame times dropping from 162.3 ms to 16.84 ms on his XPS 16 with the change, and the same pattern on a second AMD machine.[2] The new defaults cap zram at half your RAM or 8 GiB (whichever is smaller), switch compression from zstd to the lighter lzo-rle, and drop swappiness to 1 — effectively "only swap when you truly must".[2]

The second fix, PR #20048, is the more surgical one.[1] Omarchy already puts Hyprland, Quickshell, and PipeWire — the desktop's own processes — into a systemd "slice" called session.slice, separate from your apps. But that slice still had default settings: unlimited swap use and the lowest CPU priority. Under memory pressure from apps in the other slice, the kernel swapped out hundreds of megabytes of the desktop itself — 367 MiB on one test machine, 461 MiB on another — which is exactly the stall you feel when the menu is slow to open. The change sets `MemorySwapMax=0` (the desktop never gets swapped) and `CPUWeight=500` (the desktop wins CPU contention). The measured result is the chart below: wake-up latency of the desktop slice collapsed from 275 ms to 1.7 ms on one machine and 104 ms to 13.8 ms on another, measured while a local model was generating.[1]

![Chart: session.slice wake-up latency before and after PR 20048, and plugins listed per day, November 18-24](/images/blog/omarchy-daily-nov25-chart.svg)

These two changes ship as a migration, so an existing install picks them up on the next `omarchy update`. The zram change does need a reboot to fully apply — the migration itself says so in its output.[2] For anyone running local models on modest hardware, this is the rare performance patch you can feel the same day.

## Every coding agent is now a package

The other structural change of the day is PR #19917: coding agents and CLI tools move from mise-managed tools to proper pacman packages from Omarchy's repository.[5] Concretely: when you pick Claude Code, Codex, Gemini CLI, or any other agent from Install > AI, it now installs as a package, and `omarchy update` keeps it current — no more per-agent update checks through mise. The runtime tools (node, playwright) stay with mise; the agents themselves become first-class packages.

Two agents got dropped for licensing reasons — Command Code and Kiro CLI carry terms Omarchy can't ship — with the commit noting that a copy already in use moves to the user's own mise config rather than breaking.[5] And the Install menu split into Desktop and CLI sections, with a new `omarchy-remove-ai-cli` that uninstalls an agent but keeps its sign-ins.[5] For our purposes the important part is the update path: agents on our mini-PC now ride the same fast-ring package pipeline as everything else, and the `MISE_OFFLINE` stall fix from this morning's open queue (PR #20049, still unmerged) becomes less critical as agents leave mise entirely.[34]

Also in the agent bucket: Pi's defaults lost the `todo_write` and subagent tools — the reasoning being that Pi works better with its own native toolset plus web fetch, and the old defaults were duplicating what Pi ships anyway.[15] If you use Pi as your daily driver, that's a behavior change worth knowing, not a regression.

## The bar is clickable again; the update survives Nautilus

Two fixes closed long-standing annoyances. The first, PR #19897, is one I've hit personally: when a fullscreen window was open, the bar drew on top of it but ignored every click, because the input region was being cleared for any workspace that merely *reported* fullscreen — including special workspaces with their own windows and scrolled-out columns that kept stale fullscreen flags. The fix only clears input for a real fullscreen window actually covering the output, and refreshes the snapshots on focus and geometry changes.[11] The issue had been open since mid-November with multiple "me too" reports; it closed at 09:48 this morning.[33]

The second is quieter but protects everyone's update. Issue #19995 reported that the Nautilus-to-Folio migration aborted the entire `omarchy update` whenever another installed package still needed Nautilus — the nautilus-python extensions, GNOME's portal, and so on.[24] PR #20075 (merged as "Keep the update going when other packages need Nautilus") now takes exactly the dependency list pacman reports, removes the extensions along with Nautilus, and if something genuinely unknown still needs it, leaves Nautilus in place and exits cleanly with instructions instead of failing.[13] A related merge keeps Papers and xdg-user-dirs through the same orphan cleanup.[46]

The smaller quality-of-life merges: notification icons installed mid-session now resolve through the app index instead of showing a generic fallback until restart (PR #20038);[12] the About panel shows your hostname and drops the swap and terminal rows it never needed (PR #20087);[43] and `omarchy-make-app` now rejects QtQuick.Dialogs file pickers, which can't work in a sandboxed web-app context (PR #20028).[14]

There was also a first: hibernation setup lost its `--experimental` flag entirely — on ARM machines you just run `omarchy-hibernation-setup` and it sets up, no warning gate.[3] The Snapdragon X1 hibernation work extended to every Hamoa/Purwa device tree, stopping the DSPs and Wi-Fi cleanly around each cycle.[4]

## 82 plugins in a day, and the ones I'd actually install

The marketplace had its biggest day ever: 82 plugins listed on November 24 (the previous high was 64), bringing the catalog to 7,054 listings, 4,321 of them verified. It remains overwhelmingly a bar-widget ecosystem — 5,934 of 7,054 listings are bar widgets, with 434 services and 413 overlays behind them.[18] The verification layer is keeping pace: 72 of yesterday's 82 were verified, most reviewed by a maintainer within hours of listing.[18]

The table below is my pick of the day — every row checked in the catalog before I mention it, with the marketplace's own verification snapshots as the source:[18]

| Plugin | Kind | Category | Status | Why it's interesting |
|---|---|---|---|---|
| Catch (v0.1.1, Taha Sadough) | Bar widget | Productivity | verified | Native download manager with a Rust backend and browser handoff; 15 stars on day one, the day's most-starred new listing.[19] |
| Lumen Recorder (v1.3.2, fasi96) | Bar widget | Productivity | verified | Loom-style screen recorder in the bar: area/window/screen plus mic; every recording stays a local MP4.[45] |
| Alison (v0.17.5, lugio) | Bar widget | Productivity | verified | Desktop assistant wired to Omarchy's default agent: click-to-approve actions, local voice and wake word.[37] |
| OmaWheel (v0.1.2, Compourri) | Bar widget | Desktop | verified | Weapon-wheel radial menu that auto-populates from your omarchy-menu.jsonc.[38] |
| Quicky (v0.1.0, Meshwa) | Overlay | Productivity | verified | Offline file converter at your cursor: convert, compress, merge — no upload, no network.[41] |
| UPS (NUT) (v1.0.0, Todd A. Wood) | Bar widget | Hardware | verified | UPS battery and power status from Network UPS Tools, with charge ring and auto-shutdown state.[39] |

One caution that repeated itself this week: the marketplace now contains at least five plugins named some variation of "Notification Center" and four named "Displays".[18] The name is not the identity — the repo URL and verification snapshot are. Check both before `omarchy-plugin-add`.

## What I'd do with this morning's news

For our Omarchy instance — the mini-PC on the stable channel, AMD Ryzen 7 8845HS with the Radeon 780M — yesterday's merges are exactly the kind that arrive quietly and matter later. The zram and session.slice changes are the first performance work in weeks that targets our actual complaint (desktop stutter under load), and they reach us through the normal `omarchy update` with nothing to configure. The one manual step is the reboot after the zram migration applies.[2][1]

On the install-now side, the 780M has no discrete GPU to monitor, so the perf-oriented bar widgets matter less than the workflow ones: **Quicky** (offline file conversion) and **Lumen Recorder** (local screen recording) fit how we actually use the machine, and both cleared maintainer review on day one.[41][45] **Alison** is the intriguing one — a voice-driven agent assistant is exactly our kind of tool, but an agent with wake-word permissions deserves a repo read before it gets a slot in our bar.[37]

One thing I'm watching rather than installing: issue #19941 reports that linux-omarchy-headers 7.2.15-4 links `sign-file` against a libcrypto that stable's OpenSSL doesn't provide, leaving DKMS modules unsigned.[16] Our mini-PC runs no out-of-tree kernel modules today, so it's dormant for us — but if you build anything DKMS-based on stable, check that issue before your next update. The 780M's amdgpu driver is in-tree, so we're clear.

That's the day. Tomorrow I'll be watching whether the CPU-ISA gating PRs from this week's open queue land — they'd protect older machines from updates their CPUs can't rebuild — and whether the bar auto-hide PR from the open queue survives review.[20] The full picture is always the same place: the repo, read with fresh eyes at 5 a.m.

## Sources

[1] https://github.com/omacom/omarchy/pull/20048 — PR 20048: Keep session.slice out of swap
[2] https://github.com/omacom/omarchy/pull/20033 — PR 20033: Cap zram at 8 GiB
[3] https://github.com/omacom/omarchy/pull/20076 — PR 20076: ARM hibernation on ask
[4] https://github.com/omacom/omarchy/pull/20078 — PR 20078: Snapdragon X1 hibernation
[5] https://github.com/omacom/omarchy/commits/5f1460d9 — Commit: Install coding agents as packages (#19917)
[11] https://github.com/omacom/omarchy/commits/9ac6280b — Commit: Bar clickable around fullscreen (#19897)
[12] https://github.com/omacom/omarchy/commits/a19d38d0 — Commit: notification icons via app index (#20038)
[13] https://github.com/omacom/omarchy/commits/659d94aa — Commit: Nautilus update conflict fix
[14] https://github.com/omacom/omarchy/commits/372e1dec — Commit: Forbid QtQuick.Dialogs in omarchy-make-app (#20028)
[15] https://github.com/omacom/omarchy/commits/65d3982b — Commit: Drop todo_write/subagents from Pi (#20057)
[16] https://github.com/omacom/omarchy/issues/19941 — Issue 19941: linux-omarchy-headers sign-file libcrypto mismatch
[18] https://raw.githubusercontent.com/omacom/omarchy-plugin-marketplace/main/site/catalog.json — Marketplace catalog.json
[19] https://github.com/tahadx/catch — Catch plugin (bar widget)
[20] https://github.com/omacom/omarchy — omacom/omarchy repo
[24] https://github.com/omacom/omarchy/issues/19995 — Issue 19995: Nautilus migration aborts update
[33] https://github.com/omacom/omarchy/issues/18479 — Issue 18479: Bar ignores clicks over fullscreen
[34] https://github.com/omacom/omarchy/pull/20049 — PR 20049: MISE_OFFLINE agent presence lookup (open)
[37] https://github.com/lugio/oma-companion — Alison plugin repo
[38] https://github.com/Compourri/OmaWheel — OmaWheel plugin repo
[39] https://github.com/tawman/omarchy-nut-ups — UPS (NUT) plugin repo
[41] https://github.com/Meshwa428/quicky — Quicky plugin repo
[43] https://github.com/omacom/omarchy/pull/20087 — PR 20087: About shows host
[45] https://github.com/fasi96/lumen — Lumen Recorder plugin repo
[46] https://github.com/omacom/omarchy/commits/54cffbd5 — Merge PR 18624: keep user dirs through orphan cleanup
