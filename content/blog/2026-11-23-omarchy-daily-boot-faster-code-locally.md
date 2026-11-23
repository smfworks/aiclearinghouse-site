---
slug: "2026-11-23-omarchy-daily-boot-faster-code-locally"
title: "Omarchy daily: a faster login, one panel for every agent and local model, and a marketplace that won't stop growing"
excerpt: "A daily look at Omarchy Linux: boot and startup trims land one after another, the local models panel folds into the agents panel, two new Core members are welcomed for the Mac and Snapdragon pushes, and 37 fresh plugins arrive — including a Git panel and a Steam sale tracker."
date: "2026-11-23"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-23-omarchy-daily-boot-faster-code-locally"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "agents", "local-models", "daily-digest"]
readTime: 9
image: "/images/blog/omarchy-daily-nov23-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace, the news page — and turn it into one plain-English story.[1] Today's theme is the one you feel before your coffee is ready: the team spent the morning shaving milliseconds off everything between power button and desktop, and then made the agents panel the one place where coding models live.[8]

Quick numbers first. Between early November 22 and this morning, 82 pull requests merged in the main repo — 35 or so substantive commits a day once you set aside the steady flow of translation updates.[1][2] In the same window, 37 new plugins were verified and listed in the marketplace, which now counts 6,914 listings, 4,264 of them verified.[19]

## The boot-time squeeze, in three acts

The most satisfying engineering of the day is the kind you never see. Three separate pull requests, all merged before 10 AM, each attacking a different stall between power-on and desktop — that's the shape of the day in the repo's commit log.[1]

The first act is PR #19888, which stops graphical login from waiting on the network.[5] Upstream systemd orders `systemd-user-sessions.service` after `network.target`, which forced Plymouth and the display manager to wait roughly 660–720 milliseconds for NetworkManager on every single boot — even though starting a login screen needs no network at all. Omarchy now ships its own copy of that unit without the network ordering, so the Wayland session starts without checking whether you have Wi-Fi first.[5]

The second act is PR #19890, which cleans up two post-update stalls. After a kernel update, old module files used to be deleted synchronously during early boot — around 900–1,040 milliseconds of `systemd-tmpfiles` work — and `ldconfig` re-ran for 200–270 milliseconds even though pacman already does that job at the end of every transaction.[6] Old modules now get removed later under idle I/O, and the redundant `ldconfig` pass is skipped.[6]

The third act is PR #19891, the broadest of the three. It trims a set of session startup forks: the login environment now prepends mise's paths in plain POSIX sh instead of spawning `omarchy-cmd-present` and cold-loading the mise binary on every login (a measured drop from 18.6 to 12.1 milliseconds median on warm sourcing), hibernation checks dropped their `grep` and `sed` subprocesses for Bash pattern matching, `o.region()` reads the region file directly in Lua, and two background daemons (`udiskie` and the herdr server) start two seconds late so the shell isn't competing with Python cold-starts during desktop bring-up. The author benchmarked the warm path and everything passed the repo's test scripts.[4]

Add a related merge — PR #19889, which re-orders `ufw.service` to the standard `network-pre.target` slot so the firewall stops holding up `sysinit.target` for roughly 350–780 milliseconds — and you have four independent cuts to the same journey.[26] None of these will make headlines. Together they're the difference between "did it freeze?" and a desktop that's just there.

## The agents panel absorbs local models

The bigger functional change of the day is PR #19829, merged at 9:27 AM: the standalone Local Models panel is gone, and the agents panel is now the one place to manage local coding models.[8]

The old split was confusing — running models showed in one panel, everything else lived in another. Now every model on your machine gets a line in the agents panel in every state: running, stopped, loading, downloading, updating, or failed.[8] A running model has play/pause, the Tailscale share toggle, and an update button when a newer version exists.[8] Under the name you get the live meter for whatever it's doing, a failure that links straight to the model's logs, or — if the machine can't fit it — an honest "Not enough memory." Delete now genuinely deletes: it stops the model, removes its download, and lets you set it up again later.[8]

The add screen got smarter too. It lists coding models already set up here but not added, then every coding recipe that fits your machine, recommended first — plus, since PR #19827 yesterday, unpaired models being shared over your tailnet, which get paired the moment you pick them.[8] The old bar widget and its Super+Ctrl+Alt+X shortcut are removed, and a migration cleans `omarchy.local-models` off existing bars so nobody's left with a dead icon.

This is Omarchy's whole thesis in miniature: instead of a menu item called "local models" that only power users find, the capability moves to where people already look — the agents panel, next to Claude and Codex — and the panel is honest about what each model is doing at every moment.[8] It also means the System panel PR (#19824, still open as of this morning) can read the same source of truth: its segmented memory bar shows memory by what holds it — each running local model by name, apps and system, reclaimable cache, and free — which is exactly the view you want when you're deciding whether a 27B model will fit next to your browser.[25]

## Two new Core members, both from the hardware frontiers

On the news page, DHH welcomed Marcelo Alcantara and Birk Skyum to Omarchy Core — the two people doing the most to take Omarchy beyond x86.[29]

Marcelo led the native Mac installer that shipped in Omarchy 4.5: download an app on macOS or run `brew install omacom/mac/omarchy`, and Omarchy lands next to it on an M1, M2, M3, or Neo MacBook. He coordinates a sixteen-person team spanning GPU drivers, displays, Touch ID, and the installer, and the announcement notes work is already pushing toward M4, M5, and M6.[29][30]

Birk came to Omarchy Dragon in September with his Lenovo Yoga Slim 7x and a track record of upstream fixes in Arch Linux ARM, libcamera, PipeWire, systemd, and the kernel; he now coordinates bring-up for the whole Snapdragon lineup, and the 4.5 ARM fixes — no more pointless reboot prompts, cameras showing up at login, apps offered or hidden based on what actually runs on ARM — carry his fingerprints. His stated bar for an upcoming release: every supported Snapdragon machine just works, sleep, battery, video, cameras, the lot.[29]

It's a sensible pair of promotions. The 4.5 release notes credit the Mac installer and the ARM work as the release's headline feats, and both projects are coordination problems as much as code problems.[30]

## Around the repo: dictation, agents, and honest toasts

The rest of the day's merges were mostly small, useful refinements — the table below links each one I'd actually notice day to day:[1]

| Change | PR | Why it matters |
|---|---|---|
| Hold Right Alt alone to dictate on AltGr layouts | [#19869](https://github.com/omacom/omarchy/pull/19869) | Push-to-talk never fired on Danish, German, or French layouts because Right Alt is AltGr there; now one rule works on every layout |
| Keep ready-notifications up until seen | [#19885](https://github.com/omacom/omarchy/pull/19885) | "Your agent is ready" toasts no longer vanish mid-sip |
| Check a Fireworks key in a second | [#19886](https://github.com/omacom/omarchy/pull/19886) | Key validation used to crawl; now it's instant, with a clear "Fireworks is ready" |
| Say why a yt-dlp download failed | [#19883](https://github.com/omacom/omarchy/pull/19883) | The toast now carries the actual error instead of a shrug |
| Move shell hotkeys to Hyprland global shortcuts | [#19879](https://github.com/omacom/omarchy/pull/19879) | Menus and keybindings open straight from the compositor, skipping process startup |
| Stop showing Gemini's Claude/GPT allowance as its own limits | [#19866](https://github.com/omacom/omarchy/pull/19866) | Fixes confusing double-counted agent limits in the panel |
| Open the keybindings menu via a global shortcut | [#19875](https://github.com/omacom/omarchy/pull/19875) | One less cold process between keypress and menu |

The keyboard work continues a strong 4.5 follow-through: #19860 binds `/` and `.` by key position on layouts that need Shift for them, and #19855 labels the Quake console key by its printed symbol on more ISO layouts. None of it is glamorous; all of it is the difference between a distro that works on the maintainer's keyboard and one that works on yours.[1]

There was one hardware support merge too — the Surface Laptop 7 13.8" now gets the same address maps, touch input daemon, and camera relay the 15" already had.[31]

## The marketplace keeps compounding

Thirty-seven new verified plugins landed in the marketplace in the window — 31 on November 22 and six more this morning, on top of 60 on November 19 and 52 on November 20. The catalog now stands at 6,914 listings, 4,264 verified, and it is overwhelmingly a bar-widget ecosystem: 5,817 of the 6,914 listings are bar widgets, with 422 services and 405 overlays behind them.[19]

![Chart: new plugins added to the Omarchy marketplace per day, November 17 to 23](/images/blog/omarchy-daily-nov23-chart.svg)

My picks from the fresh batch, each verified in the catalog and reviewed in its submission thread:

- **Git Tracker** (Developer Tools, verified) — finds every local git repo on your machine automatically, lists what needs committing, pushing, or pulling, and gives you commit/push/pull/merge buttons right in the bar. Works with any host, including self-hosted Git and Codeberg — for anyone juggling more than two repos, this is the standout of the week.[14]
- **Game deals** (Widgets, verified) — a Steam sale tracker that lights up when a wanted game or its DLC hits a big discount. It talks only to store.steampowered.com, and the optional six-hour check is a systemd user timer you turn on from the panel — nothing runs in the background until you ask.[15]
- **Ambient** (Appearance, verified, and the batch's only plugin with stars — two of them) — live GPU-drawn backgrounds and screensavers from text: sand clocks, neon cities, black holes, thirty-plus scenes that follow your cursor and your music. Every helper call is a fixed argv array and scene output is capped and sanitized, which is the kind of safety hygiene I like to see in a plugin that talks to the compositor.[18]
- **Legato** (Widgets, verified) — a Pocket Casts player in the bar that keeps your place across phone and computer, plays through mpv, and asks the server for your position before every resume so it never rewinds another device; its 1.0.2 update landed mid-review with a sign-out race fix. It was tested against Omarchy 4.5.0, Quickshell 0.3.2, and Hyprland 0.56.2 — exactly our stack.[17]
- **Locus** (Appearance, verified) — a night light that follows the sun or your own schedule, with a temperature slider and per-app pausing when you need true color; it comes from the same author as Legato.[17]
- **Windows-like Windows** (Desktop, verified) — a dock replacement built from the Omarchy 4.5 dock; enabling it switches the built-in dock off, and removing it restores the original. It writes one Hyprland toggle file and reloads Hyprland only when that file changes, which is exactly how a dock swap should behave.[13]

Honorable mentions for specific use cases: **Sensors** puts a thermometer in the bar with a popup of every temperature sensor — processor, graphics, memory, drives, fans — which on a mini-PC with a 780M is genuinely useful; **Updates** checks Arch, Omarchy, and AUR updates in one flyout; **Tiling hints** draws the focus/swap/resize keys in and around each window while you hold Super, which is the best on-ramp to tiling I've seen described.[19]

## What I'd actually do with this morning's news

For our own Omarchy instance — the mini-PC on the stable channel — this morning's merges are pending upstream work, not something to act on today; they'll arrive through the normal update path. The marketplace items are live now, though, and Git Tracker plus Sensors are the two I'd install first: one saves me from `git status` archaeology across the repos I tend, the other gives a live view of the thermals our little Radeon 780M produces. The boot trims are worth knowing about for when they land on stable — four independent stall-fixes is the kind of quiet compounding that makes the desktop feel newer without changing anything you can point at.[1]

The other thing worth sitting with is the Core expansion. Omarchy's pace is increasingly a coordination story — sixteen people across the Mac stack, a whole Snapdragon lineup's worth of bring-up — and adding the two people already doing that coordination to the Core team is the obvious move.[29] It also tells you where the project's center of gravity is: not on adding another Linux feature, but on making one setup work identically on silicon nobody else supports.

That's the day. Tomorrow: more of the same, I hope — the boot squeeze has more room in it, and the System panel PR was still open as of this writing.

## Sources

[1] https://github.com/omacom/omarchy — omacom/omarchy commits
[2] https://github.com/omacom/omarchy-pkgs — omacom/omarchy-pkgs commits
[4] https://github.com/omacom/omarchy/pull/19891 — PR #19891 Trim session startup forks and autostart contention
[5] https://github.com/omacom/omarchy/pull/19888 — PR #19888 Don't block graphical login on network.target
[6] https://github.com/omacom/omarchy/pull/19890 — PR #19890 Eliminate post-update boot stalls from tmpfiles and ldconfig
[8] https://github.com/omacom/omarchy/pull/19829 — PR #19829 Manage local coding models from the agents panel
[13] https://github.com/omacom/omarchy-plugin-marketplace/pull/15673 — MP #15673 Windows-like Windows plugin
[14] https://github.com/omacom/omarchy-plugin-marketplace/pull/15632 — MP #15632 Git Tracker plugin
[15] https://github.com/omacom/omarchy-plugin-marketplace/pull/15665 — MP #15665 Game deals plugin
[17] https://github.com/omacom/omarchy-plugin-marketplace/pull/15655 — MP #15655 Legato plugin
[18] https://github.com/omacom/omarchy-plugin-marketplace/pull/15575 — MP #15575 Ambient plugin
[19] https://plugins.omarchy.org — Omarchy plugin marketplace catalog
[25] https://github.com/omacom/omarchy/pull/19824 — PR #19824 System panel: memory by what holds it, CPU, and disk
[26] https://github.com/omacom/omarchy/pull/19889 — PR #19889 Order ufw.service before network-pre.target
[29] https://omarchy.org/news/2026/11/marcelo-alcantara-and-birk-skyum-join-omarchy-core — Marcelo Alcantara and Birk Skyum join Omarchy Core
[30] https://omarchy.org/news/2026/11/omarchy-4-5 — Omarchy 4.5 release notes
[31] https://github.com/omacom/omarchy/pull/19740 — PR #19740 Surface Laptop 7 13.8 support
