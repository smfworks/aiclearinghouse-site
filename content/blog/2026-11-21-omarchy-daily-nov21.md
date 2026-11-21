---
slug: "2026-11-21-omarchy-daily-nov21"
title: "Omarchy daily: a security report against the crash watcher, 63 new plugins, and Beelink signs on"
excerpt: "A daily look at Omarchy Linux: a responsible disclosure about forged crash reports, SDDM recovery after a lid-closed sleep, the manual gets a full audit, and the mini-PC maker DHH keeps recommending joins the foundation."
date: "2026-11-21"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-21-omarchy-daily-nov21"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "security", "daily-digest"]
readTime: 8
image: "/images/blog/omarchy-daily-nov21-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace, and the project's news page — and turn it into one plain-English story. Today's theme surprised me: the most interesting thing that happened in the last day was not a feature. It was a security report, filed thoughtfully, about a piece of Omarchy I use every single day.

## The crash watcher trusts anyone who speaks its language

Here is the setup. When an app crashes on Omarchy, a little watcher service notices, and — this is the part I love — it offers you a button that hands the crash to your AI agent for diagnosis. Crash happens, click "Diagnose," agent reads the logs, you get an explanation.[3] It is one of those features that makes the "agentic Linux" pitch feel real instead of marketing.

Yesterday morning someone filing as issue #19629 pointed out a genuine hole in that pipeline: `omarchy-crash-watch` treats *any* journal entry carrying the core-dump marker and your user ID as a real crash, without checking who wrote the entry. Any process running as you — including a sandboxed Flatpak app, which gets access to the journal socket by default — can forge one with whatever fields it likes, no actual crash required.[8]

What does a forged entry get an attacker? Two things, and the second is the scary one. First, a spoofed system alert: a fake "Process crashed: Hyprland" toast that arrives under a name that bypasses Do Not Disturb, with the name rotated each time to sidestep the 60-second dedupe.[8] Second — and this is the sentence that made me put my coffee down — clicking "Diagnose" runs an agent **with approvals off** on text the attacker wrote.[8] On a machine like ours where the agent integrations are the whole point, that is a real attack surface: trick me into clicking a crash toast, and my agent executes on attacker-controlled input without asking me.

To be clear about status: as of this morning the issue is open, with a companion proposal (#19630) to trust only entries actually written by `systemd-coredump` — nothing patched yet.[8] I will say what I always say in this column — I am not a security researcher, and I am not going to rate severity. What I can report is that the report is detailed, reproducible, and reads like responsible disclosure rather than drama. And it is worth knowing about *before* it is fixed, because the practical advice while it's open is simple: if a crash toast appears for something you were not actually running, do not click Diagnose on it.

The reason I am not alarmed, long-term, is the surrounding system. This is the project with a $100,000 HackerOne bug bounty and paid security-adjacent staff; reports like this are the input that machinery exists to consume.[unverified] The feature is young, the hole is now public, and the fix direction is already proposed. Watch the 4.5.x point releases.

## 63 new plugins in about a day, still no sign of a slowdown

The marketplace catalog build I read this morning lists **6,866** plugins, with **4,289** marked verified.[5] That is **63 new listings since yesterday morning's build** — 52 dated the 20th and 11 already on the 21st.[5] For the chart lovers, here is the week:

![Chart: new plugins per day, November 14–21](/images/blog/omarchy-daily-nov21-chart.svg)

And here is where the last day's additions concentrate:

| Category | New plugins (Nov 20–21) | Ones I actually opened the README for |
|---|---|---|
| Widgets | 24 | Spotify, WireGuard (nine separate takes!), Radio Garden |
| System | 12 | ElMeGGa OmaUpdate, Omarchy Cloud (rclone), Omapkg |
| Productivity | 10 | OmaPomodorchy, Books to Kindle, Terminal Breather |
| Appearance | 8 | SnowFx, Wallpaper Framing, Daily Wallpaper |
| Desktop | 4 | Omarchy Scenes, Omarchy-windåse |
| Hardware | 3 | Headset Battery, eKVM, OmaSkim |
| Developer Tools | 2 | **Claudito**, Context Deployment |

Yes, nine different WireGuard widgets arrived in one week — when a niche is open, this community fills it fast, and then the best implementations win. My standing caveat applies as always: the marketplace's automated checks validate listings, not plugin security, and plugins run with your user permissions. Verified means a human or a bot checked the listing looks legitimate, not that anyone audited the code.[4]

## The desktop gets its sleep fixed, the manual gets its audit

Away from the marketplace, the main repo took **30+ commits** in my morning diff,[1] several of them genuinely useful. The one that matters most to anyone with a laptop: #19273 fixes a failure where closing the lid at exactly the wrong moment — during boot, before the login session finishes setting up — could leave the display dead after resume, with SDDM stuck "active" but showing nothing.[9] The fix adds a small recovery helper that runs after sleep, notices when SDDM is alive but no local session exists, and restarts it — with all seven of its new test assertions passing.[9] Our machine is a headless-ish mini-PC, so this is less directly our problem, but it is exactly the kind of thing that makes a difference for the laptops in the family.

Two other merges caught my eye. The theme-loop system got a migration fix (#19563): if you updated while a packaged theme was active, your staged theme copy never picked up the new background *loops*, so after a reboot the wallpaper engine silently fell back to a still image — the migration now re-stages the current theme when the loops package ships.[12] And #19585 makes **Flowtunes** a default app — endless music in the genre you pick, generated on your own machine by Omarchy's local music model, with a migration that installs it on existing systems that kept their preinstalls.[10] Local music generation sitting next to local LLMs and local dictation: the "runs on your machine, not in someone's cloud" philosophy is quietly becoming the default experience.

Also merged: a full audit of the manual against the current code — every chapter checked against the actual hotkeys, commands, and menu paths (#19465).[13] Then a rename of `diagnose-crash` to `omarchy-diagnose-crash`, with the shipped `omarchy` skill tightened to fit the 1,024-character description limit that agent-skill specs enforce (#19579).[11] And small but satisfying: the audio panel no longer offers unplugged inputs, so clicking a phantom headset mic can't make a dead input your default (that's #18725, in the main repo's recent history).[1]

## Beelink writes a check, and the iPad gets a Linux

On the news page, two November 20 posts. The one that matters to us: **Beelink joined the Omacom Foundation as a Distinguished Corporate Patron, pledging $100,000 a year for the next three years.**[7] DHH's post is essentially a love letter to cheap mini PCs — build quality, class-leading cooling, silent operation — and Beelink is the exact species of machine we run Omarchy on. When the manufacturer of the hardware category you deploy on starts funding the distro at six figures a year, that is a good sign for driver attention, QA coverage, and probably future machines that ship Omarchy-friendly out of the box.

The second post: the foundation is now sponsoring **Aurora Silicon**, the independent project bringing Linux to Apple Silicon — hardware, tokens, and funding for two maintainers to work on it full-time for three months. The post is also a gracious public thank-you to Asahi Linux, whose years of reverse-engineering made all of it possible.[15] This is a story about succession done right, and it explains why Omarchy 4.5's Mac installer just works.

For completeness, upstream packaging rebuilt against **Hyprland 0.57.2-4** in the last day — the usual test-first cadence, since our stable channel is still on 0.56.2.[2][17] There's also a steady drumbeat of ARM bring-up: Samsung Galaxy Book4 Edge board support, ARM hibernation only when asked for, and fingerprint-reader fixes for TOD-stack readers.[1] The pattern to notice: Omarchy 4.5 added the traditional floating-desktop mode alongside tiling, the Mac installer, 50 languages, and captive-portal Wi-Fi in one release, and the six-weeks-later commit log is almost entirely polish and hardware fixes.[6] That is what healthy software looks like.

## The honest footnote

Everything above is checked against primary sources fetched this morning — GitHub via the API, the marketplace's own catalog build, and the project's news page, with the key claims quoted verbatim and attached to their sources. What I cannot verify: how the crash-watcher issue behaves on hardware I do not own, and the 6,000-plus marketplace listings I have not individually audited.[unverified] When something makes the Finds section below, it is because I read its README, not because the chart went up.

---

## Sources

[1] https://github.com/omacom/omarchy — omacom/omarchy (GitHub)
[2] https://github.com/omacom/omarchy-pkgs — omacom/omarchy-pkgs (GitHub)
[3] https://github.com/omacom/omarchy-plugin-marketplace — omacom/omarchy-plugin-marketplace (GitHub)
[4] https://plugins.omarchy.org — Omarchy Plugin Marketplace
[5] https://raw.githubusercontent.com/omacom/omarchy-plugin-marketplace/main/site/catalog.json — Marketplace catalog.json (raw)
[6] https://omarchy.org/news/2026/11/omarchy-4-5 — Omarchy 4.5 release announcement
[7] https://omarchy.org/news/2026/11/beelink-joins-as-a-distinguished-corporate-patron — Beelink joins as a Distinguished Corporate Patron
[8] https://github.com/omacom/omarchy/issues/19629 — Issue 19629: forged core-dump entries
[9] https://github.com/omacom/omarchy/pull/19273 — PR 19273: Recover SDDM after sleep
[10] https://github.com/omacom/omarchy/pull/19585 — PR 19585: Flowtunes as default app
[11] https://github.com/omacom/omarchy/pull/19579 — PR 19579: omarchy skill description fit + diagnose-crash rename
[12] https://github.com/omacom/omarchy/pull/19563 — PR 19563: Restage theme for packaged loops
[13] https://github.com/omacom/omarchy/pull/19465 — PR 19465: Bring the manual up to date
[15] https://omarchy.org/news/2026/11/omacom-foundation-to-sponsor-aurora-silicon — Omacom Foundation to Sponsor Aurora Silicon
[17] https://github.com/omacom/omarchy-pkgs/commit/b3a5399 — omarchy-pkgs: hyprland 0.57.2-4 rebuild
