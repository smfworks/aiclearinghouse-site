---
slug: "2026-11-24-omarchy-daily-the-hardening-morning"
title: "Omarchy daily: a hardening morning, a faster goodbye, and 107 new plugins"
excerpt: "A daily look at Omarchy Linux: six security-hardening pull requests land in one morning, shutdown gets seconds faster, a plugin-manifest spoofing hole gets closed, and the marketplace crosses 7,000 listings — plus what it means for our mini-PC."
date: "2026-11-24"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-24-omarchy-daily-the-hardening-morning"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "security", "daily-digest"]
readTime: 8
image: "/images/blog/omarchy-daily-nov24-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace, the news page — and turn it into one plain-English story.[1] If yesterday was the boot-squeeze day, today is the hardening morning: between roughly 06:37 and 09:50 UTC, six separate pull requests landed whose only job is to make Omarchy harder to misuse, and a seventh closed a hole in the plugin system specifically.[2][3]

The numbers first. The marketplace crossed a milestone worth pausing on: 7,015 plugin listings, 4,330 of them verified, after 43 new additions today on top of 64 yesterday — that's 107 in two days.[19] And in the main repo, the last 24 hours brought around 30 substantive merges once you set aside the steady stream of translation updates.[1]

## Six locks before breakfast

The morning's security batch is worth walking through, because each pull request fixes a real — if obscure — way things could go wrong.[2]

PR #19965 hardens the desktop launchers. Previously, launching a web app or TUI went through shell evaluation, which meant a URL containing an ampersand, a semicolon, or `$(...)` could execute commands it shouldn't.[3] Launchers now forward arguments directly without `eval`, and the desktop-entry installers reject path-traversal names like `..` and escape `Exec=` lines so a malicious `.desktop` name can't inject newlines into the file.[3]

PR #19961 is the one I care most about as someone who installs plugins for a living: it fixes an injection vulnerability in the plugin registry's manifest scanning.[4] A crafted third-party `manifest.json` could contain a synthetic `===firstparty::...===` line and thereby spoof itself as a first-party plugin, hijack `omarchy.*` IDs, and inherit trusted authentication capabilities.[4] Manifests are now framed by exact line count, first-party directories are containment-checked, and control characters and prototype-polluting keys are rejected.[4] In plain terms: a malicious plugin could have pretended to be Omarchy itself, and now it can't. If you install plugins from the marketplace, this is the fix that protects you.

The clipboard got its own spring cleaning across two PRs. #19966 had already fixed a startup race and capture permissions in clipboard history;[5] #20001 adds a one-time sweep at shell startup that removes image files left orphaned by older versions, crashes, or manual deletion — guarded by a lock file and refusing to delete anything if the history file looks malformed.[6] And #19999 wraps the input and audio watchers in `setpriv --pdeathsig`, so when the shell crashes hard, the kernel stops the watchers immediately instead of leaving `pactl subscribe` running forever as an orphan.[7]

The remaining two are quieter. #19998 makes lock handling paranoid in the right way: non-regular lock paths (a FIFO, a directory) are refused, and runtime directories are validated as owned, non-symlink, mode-0700 before locks are created inside them.[8] And #20002 makes the text-size, glass-theme, Sunshine, and RetroArch commands edit through `sed --follow-symlinks -i`, so if you keep your dotfiles symlinked to a dotfiles repo (as I do), those commands now update the target instead of silently replacing your symlink with a regular file.[9]

None of these are features. All of them are the difference between a distro you recommend to a friend and one you hedge about. The batch is also a snapshot of how Omarchy ships security work now — small, focused pull requests, each with regression tests, each verified by both Codex and Claude before merge.[8]

## A faster goodbye

Yesterday was about booting faster; today's batch is about leaving faster. PR #19914 re-profiled shutdown from real boot journals and made a series of cuts: the systemd user manager now escalates after 2 seconds instead of 90 (previously the user manager sat at the default 90-second timeout while PID 1 had 5), the Bluetooth agent service stops with the session rather than blocking it, and zram settings were touched up for the boot-back-up side.[10] PR #19919 found a sneaky one: the `herdr server` was started inside the graphical slice, and because systemd ordered that slice after the graphical session, every shutdown waited on it — it now runs as a transient user service that stops in parallel with Hyprland, saving about half a second per shutdown.[11] PR #19957 defers the shutdown-ramfs timer relative to userspace startup so the timing settles correctly.[12]

On the speed-of-everyday-things front, PR #19973 dropped `omarchy-capture-screenrecording-process` from ~26ms to ~5ms and the default-terminal lookup from ~15ms to ~1ms, and PR #19967 removed redundant forks, sysfs scans, and duplicate `pacman` queries from hot CLI helpers — including a single-pass hardware platform scan.[13][14]

For our mini-PC, the shutdown work is invisible until you power off, and then it's obvious: the difference between a machine that lingers on "stopping user session" and one that's just gone. The same journals that motivated the 2-second user-manager timeout are ones any of us can read with `journalctl -b -1` on our own machines.[10]

## Hardware, honestly

A few merges caught my eye for specific machines rather than the whole fleet — the kind of fixes that only matter if they're your machine, and matter a lot then:[15]

| Fix | PR | Who it helps |
|---|---|---|
| Stereo speaker routing on the Dell XPS 16 | [#19309](https://github.com/omacom/omarchy/pull/19309) | One laptop, but a real one — music finally comes out of both sides.[15] |
| MediaTek MT7925 Bluetooth unloads cleanly at shutdown | [#19939](https://github.com/omacom/omarchy/pull/19939) | Anyone with that Wi-Fi/BT chip who wondered why reboots dragged.[16] |
| Batched hardware package installs + cleaner setup logs | [#19929](https://github.com/omacom/omarchy/pull/19929) | Fresh installs: fewer sequential pacman passes, no more "up to date — skipping" noise.[17] |
| First-run Wi-Fi spin loop and duplicate `xkbcli` spawns fixed | [#19963](https://github.com/omacom/omarchy/pull/19963) | New machines on day one, and keyboard-layout handling everywhere.[18] |
| Globbing bugs in restart, channel, and hardware-check routers | [#19964](https://github.com/omacom/omarchy/pull/19964) | Edge-case machines the checks used to misread.[36] |

And on the *open* side, a cluster of issues and PRs from early this morning addresses a genuine foot-gun: tooling built for newer x86-64 levels failing on older CPUs — think dictation tools or boot utilities that SIGILL on a CPU below x86-64-v3.[28] Issue #20006 ("No pre-update check that the boot tooling runs on this CPU") and PR #20013 (stop an update the boot tooling cannot rebuild) propose checking before breaking an install; PR #20010 goes further, adding an `omarchy cpu isa` command and gating AVX2-only tools — including the dictation installer's Vulkan backend, which would now warn on a host without AVX2 rather than installing something that crashes.[29] Nothing there is merged as I write this, but the direction is right: measure the CPU, warn before the update, never apply something the machine can't rebuild.

One open PR I hope merges: #20018 adds a proper auto-hide for the Omarchy menu bar, revealing when the pointer touches the screen edge — the kind of small luxury bar-widget hoarders like me appreciate, and it exposes the same setting as a scriptable `omarchy bar autohide on|off`.[20] Two more open PRs round out the picture: #19981 would tile every managed window in Tiling and Scrolling workspaces (dialogs and float-rule apps included), and #19980 would let you pick which workspace layouts are enabled at all — both aimed at the same complaint, that Omarchy's tiling sometimes surprises you by not tiling.[26][27]

## The marketplace crossed 7,000 — what's actually new

The catalog now counts 7,015 listings, 4,330 verified — and the daily inflow keeps rising: 31 on the 22nd, 64 on the 23rd, 43 this morning. It is still overwhelmingly a bar-widget ecosystem: 5,901 of 7,015 listings are bar widgets, with 429 services and 411 overlays behind them.[21]

![Chart: new plugins added to the Omarchy marketplace per day, November 17 to 24](/images/blog/omarchy-daily-nov24-chart.svg)

My picks from the last two days, each verified in the catalog before I mention it — with the marketplace's own verification snapshots as the source:[21]

- **Alison** (Productivity, verified) — a desktop assistant for Omarchy's default agent with local voice and wake word and click-to-approve actions, from lugio, at version 0.17.5 and maintained-reviewed as of this morning. The description — "self-organizing memory" — is ambitious, and the verification snapshot was re-checked today at 00:19 UTC.[22]
- **Catch** (Productivity, verified) — a native download manager with a Rust backend and browser handoff, maintainer-reviewed today at 00:57 UTC. (No relation to the instant-replay Catch from August — same name, different plugin, which is worth knowing before you `omarchy-plugin-add`.)[21]
- **OmaWheel** (Desktop, verified) — a weapon-wheel style radial menu that auto-populates from your `omarchy-menu.jsonc`, reviewed at 02:26 UTC. For launching the same five apps all day, this could be the fastest path in Omarchy.[23]
- **Displays** (System, verified) — callumau's monitor-layout plugin that arranges monitors, sets resolution and refresh rate, and restores layouts automatically per connected set — reviewed at 06:52 UTC today. On a mini-PC with a monitor-switching habit, this is the one I'd install first.[24]
- **Notification Center** (System, verified) — wicky14's bar panel for notification history with search, unread marks, and Do Not Disturb, reviewed at 06:31 UTC. There are now at least five plugins with this exact name in the marketplace; the verification snapshot is what tells them apart, so check before installing.[21]

A pattern I noticed while reading the review timestamps: nearly every plugin added in the last two days went through "maintainer-reviewed" verification within hours of listing. The marketplace's human layer is keeping up with the machine layer, which is not a given at 40+ plugins a day — and PR #19961 means the shell now enforces the boundary technically too.[4]

## What I'd do with this morning's news

For our Omarchy instance — the mini-PC on the stable channel, AMD Ryzen 7 8845HS with the Radeon 780M — today's merges are upstream work that arrives through the normal update path. Nothing here demands action today. The shutdown-speed work and the manifest-scan fix are the two I'm most looking forward to on stable: the first is a felt improvement every time the machine powers off, and the second protects every plugin install from here on.[10][4]

On the install-now side, callumau's **Displays** plugin is the strongest candidate — verified today, and monitor-layout restore is a real itch when you move a mini-PC between screens. **Alison** is the intriguing one, but a desktop assistant that talks to an agent deserves a slower look at its repo before it gets a slot in our bar.[22][24]

The other thing worth noticing: a morning where six of thirty-odd merges are security fixes, and one of them closes a plugin-spoofing vector, tells you what Omarchy's maintainers think the risks are right now. With 7,000+ community plugins and 1.38 million ISO downloads a year in, the attack surface is the ecosystem — and this morning, it got fences.[10][21]

That's the day. Tomorrow: the CPU-ISA gating PRs are still open, the auto-hide bar is still open, and I'll be watching whether either lands before the next daily — the full open-PR list is the same place I'll be reading it.[1]

## Sources

[1] https://github.com/omacom/omarchy — omacom/omarchy — recent commits (gh API)
[2] https://github.com/omacom/omarchy/pull/19973 — Speed up screenrecording status, default-terminal lookup, tmux theme sync
[3] https://github.com/omacom/omarchy/pull/19965 — Harden desktop launchers, installers, protocol handlers, temp files
[4] https://github.com/omacom/omarchy/pull/19961 — Harden plugin manifest scan framing and fix plugin lifecycle races
[5] https://github.com/omacom/omarchy/pull/20000 — Clean up stale hibernation resume drop-ins
[6] https://github.com/omacom/omarchy/pull/20002 — Preserve symlinked user configs
[7] https://github.com/omacom/omarchy/pull/19999 — Stop input and pactl watchers on shell crash
[8] https://github.com/omacom/omarchy/pull/20001 — Sweep orphaned clipboard image files
[9] https://github.com/omacom/omarchy/pull/19998 — Refuse non-regular lock paths, validate runtime dir
[10] https://github.com/omacom/omarchy/pull/19967 — Avoid redundant forks, sysfs scans, pacman queries in CLI helpers
[11] https://github.com/omacom/omarchy/pull/19929 — Speed up hardware setup, batch pacman installs
[12] https://github.com/omacom/omarchy/pull/19919 — Stop herdr server in parallel with Hyprland on shutdown
[13] https://github.com/omacom/omarchy/pull/19914 — Speed up shutdown and reboot
[14] https://github.com/omacom/omarchy-pkgs — omacom/omarchy-pkgs — package sync commits
[15] https://github.com/omacom/omarchy-plugin-marketplace — omacom/omarchy-plugin-marketplace — new plugins
[16] https://raw.githubusercontent.com/omacom/omarchy-plugin-marketplace/main/site/catalog.json — Omarchy Plugin Marketplace catalog.json (fetched 2026-11-24)
[17] https://omarchy.org/news — Omarchy News
[18] https://omarchy.org/news/2026/11/marcelo-alcantara-and-birk-skyum-join-omarchy-core — Marcelo Alcantara and Birk Skyum join Omarchy Core
[19] https://plugins.omarchy.org — Omarchy Plugin Marketplace
[20] https://x.com/komagata/status/2124666869806444781 — Masaki Komagata on X: Today's Omarchy Upstream — November 23, 2026
[21] https://hypr.land/news — Hyprland News (0.57 released Nov 3, 2026)
[22] https://github.com/hyprwm/Hyprland/releases — Hyprland Releases (0.57.1, Nov 3 2026)
[23] https://github.com/omacom/omarchy/pull/20018 — Add autohide for the Omarchy menu bar (open PR)
[24] https://github.com/omacom/omarchy/pull/19994 — Expose encoder/codec/CPU-fallback toggles in screen recording (open PR)
[26] https://github.com/omacom/omarchy/pull/19981 — Tile every managed window in Tiling and Scrolling workspaces (open PR)
[27] https://github.com/omacom/omarchy/pull/19980 — Let users choose which workspace layouts are enabled (open PR)
[28] https://github.com/omacom/omarchy/pull/20013 — Stop an update that boot tooling cannot rebuild on this CPU (open PR)
[29] https://github.com/omacom/omarchy/pull/20010 — Add omarchy-cpu-isa and gate AVX2-only tool installs (open PR)
[36] https://github.com/omacom/omarchy/pull/19964 — Fix router globbing and edge-case bugs in restart, channel, and hardware checks
