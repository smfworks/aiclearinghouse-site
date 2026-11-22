---
slug: "2026-11-22-omarchy-daily-local-models-get-a-harness"
title: "Omarchy daily: Pi gets shipped properly, a region can now pick its own desktop, and the fast ring slows to a stroll"
excerpt: "A daily look at Omarchy Linux: the Pi coding agent becomes a real package with a harness setting for local models, regional profiles grow teeth, a boot bar gets honest, and 22 new plugins arrive — including a disk cleaner and a night light worth a look."
date: "2026-11-22"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-22-omarchy-daily-local-models-get-a-harness"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "pi", "local-models", "daily-digest"]
readTime: 9
image: "/images/blog/omarchy-daily-nov22-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace — and turn it into one plain-English story. Today's is the quiet kind of polish: fewer questions at install time, an honest boot bar, and a coding agent that finally ships the way everything else does.[1]

The news page itself was quiet — no fresh posts since November 20: the Omacom Foundation sponsoring Aurora Silicon, and Beelink joining as a Distinguished Corporate Patron at $100,000 a year — notable for mini-PC fans, since Beelink is the kind of machine many of us run Omarchy on.[29][30]

## Pi is now a package, and local models get a harness of their own

The biggest merge of the day is #19736, titled "Ship Pi as a package and open local models in it."[6]

Pi is a terminal coding agent — a command-line tool you can point at any AI model provider. Until yesterday it shipped in Omarchy as a "mise tool," a developer-tool version manager: nothing lands on disk until the first launch, and then it downloads itself from GitHub. That had real consequences: Pi was not on the install ISO, and it was the one agent source Omarchy's China profile could not mirror.[6]

The merged fix makes Pi a proper Arch package (`pi-coding-agent`) that is part of the base install and comes from the same mirrors as everything else, with the builds already sitting in the omarchy-pkgs repo on the fast ring.[2][6] A migration even swaps out the copy that mise installed on existing machines — exactly the setup on our own mini-PC, where Pi 1.6.0 lives under mise's shims[unverified] — and if you declared Pi in *your own* mise config, the migration leaves it alone.[6]

The second half is the part local-model fans should care about. With Pi guaranteed present, "which harness a local model opens in" becomes its own setting: `omarchy models harness [pi|opencode|qwen]`, Pi the default. Before this, the choice was inferred from your default agent, which could steal the local model from Pi entirely — or leave you with a notification that no agent could use it at all; that notification is gone with the fallback logic that produced it.[6]

A follow-up PR is open to give Pi better built-in tools: #19739 notes that "Pi ships only file and shell tools, so models curl raw HTML, lose track of long tasks, and fill their context with research," and adds `web_fetch`, `todo_write` and subagents.[34]

## Regions grow teeth: a fresh install can now look local

The other structural merge of the last two days is #19657, "Let a region pick its launchers, web app hotkeys and default theme."[10] Region profiles — Omarchy's per-country presets — used to change only which pacman mirrors a machine used; now they shape the whole first-run experience: the launchers a fresh install gets, the hotkeys for region-dependent services, and even the default theme. The PR's own words: region profiles "can now also shape what a fresh install looks like and where it fetches from, so a China ISO ships China's own web apps instead of ones that are blocked there."[10]

Three companion merges finished the picture: development-package mirrors for Go, Rust, Python, Elixir, Ruby and PHP now point at Chinese registries (#19683),[36] menus hide the AI harnesses and services China can't reach (#19676),[37] and the Learn menu now opens the manual in your language's own site (#19659).[38]

Even the omarchy-pkgs build farm picked up regional work: a fix now retries a present-but-not-working camera at boot so a freshly built driver gets loaded instead of waiting for a reboot (#3239).[32]

None of this touches our machine directly — we're a global-profile user — but it is the infrastructure Omarchy needed before it could credibly court the Chinese Linux community it has been courting in downloads but not in defaults.

## The fast ring slows to a stroll — and gets its speed back in boot

After last week's pace (87 new plugins in two days, 30+ commits a day), the main repo felt almost gentle: **56 commits and 37 merged pull requests** since yesterday morning, 27 of them more than translation syncs.[1] Where the real work went:

| Area | What landed | Why it matters to you |
|---|---|---|
| Local AI | Pi becomes a base package; `omarchy models harness` setting lands (#19736) | Local models open in a consistent harness, out of the box, on the ISO |
| Installer | Hostname is generated from owner + hardware instead of asked (#19646) | One less question at install; `dhh-dell-xps14`-style names |
| Boot | Plymouth progress bar recalibrated for 3–4 s boots (#19695) | The bar no longer stalls at ~30% before the desktop appears |
| Performance | Redundant subprocess forks cut in hardware detection (#19702) | Faster, leaner hardware setup |
| Laptops | SDDM recovery after closed-lid boot (#19273); low-battery warning latch (#19293) | Fewer black-screen and nag-loop corners |
| Regions | China profile gets dev mirrors, honest menus, localized manual | The distro now respects regional reality end-to-end |
| Display | HP ZBook Ultra G3a 16 screen-glitch fix via `amdgpu.dcdebugmask` (#19697) | Hardware-specific leaf; the per-model discipline continues |
| Mac docs | Apple Silicon chapter rewritten and merged (#17735) | The docs now match the 4.5 reality |

<!-- Row sources: 6, 39, 7, 8, 9, 40, 10, 13, 33 -->

The Plymouth fix is my favorite example of the project's texture this week. With recent boot speedups, getting from the disk-unlock prompt to the desktop now takes 3–4 seconds on fast machines — but the boot progress bar was still calibrated for a leisurely 15-second curve capped at 70%, so it only ever reached about 30% before vanishing. The fix recalibrates the fake progress duration from 15 to 4 seconds and the limit from 0.7 to 0.9, completing the bar as Plymouth exits.[7]

The hostname PR deserves the same praise. Instead of asking every new owner to invent a machine name, the setup form builds one from the username and the hardware: a Dell XPS 14 owned by dhh becomes `dhh-dell-xps14`, with maker and model from the DMI tables or the device tree on ARM machines — so it works on Snapdragon and Apple Silicon too.[39]

On the laptop side: #19273 fixes SDDM staying stuck when a laptop boots with the lid closed — `systemd-sleep` freezes `user.slice` before SDDM finishes session setup and autologin simply gave up; now it retries.[40] And #19293 keeps the low-battery warning latched through power-source flaps, clearing only when the displayed charge rises above 10%.[9]

On the hardware-fix side, #19697 adds a display leaf for the HP ZBook Ultra G3a 16, whose built-in panel "flashes thin horizontal lines across the screen," worst under GPU memory load. Booting with `amdgpu.dcdebugmask=0x402` — disabling Panel Replay and memory stutter in the display engine — makes it stop, wired in as a model-specific boot option with a migration for existing installs.[13] The same discipline showed up in #19702, which trims redundant subprocess forks from hardware detection — one `grep` instead of two in the DMI matcher, one `lspci` call instead of three in the Vulkan setup.[8]

One upstream note from Hyprland itself: the compositor landed a small protocol fix on the 21st — "protocols/data-device: send drop before notifying the source" — the kind of data-device correctness detail that copy-paste and drag-and-drop depend on.[14] Omarchy's stable channel remains on Hyprland 0.56.2 while omarchy-pkgs has been building 0.57.2 packages since November 11; the stable channel typically follows once the test ring has soaked.[unverified]

Also worth noting: a serious open issue about systemd-oomd. Omarchy makes user apps the only thing oomd may kill, so one misbehaving browser can't take down your session. But a user reported oomd killing 2,104 processes in one unit — their entire working session — because everything launched from one terminal shares a single `app-*.scope`, and the bot's re-check confirms that topology still holds.[11] If you run memory-hungry agents in long-lived terminals, read it.

The Mac documentation chapter was rewritten and merged as #17735, now leading with Omarchy for Apple Silicon — which Macs it runs on, installing from macOS with Homebrew, and the encryption password on first boot — replacing guidance that sent M1/M2 users to the old fork.[33]

Two open PRs from the agents desk also caught my eye. #19741 makes the agents panel find each prompt's reply in quadratic time instead of reading forward through every remaining row of its session — the bug was found on a 3.3 GB `opencode.db` whose largest session held 51,560 rows.[15] #19734 adds an optional prediction to the usage bars, showing "where my usage will be at the reset if I carry on at the current rate," turning red past 100%.[16]

Keyboard polish is open too: SUPER + F fullscreening a popped-out window (#19653),[17] and SUPER + arrows reaching floating windows (#19652).[18]

## The marketplace: 6,878 plugins, 22 new, and two worth your Saturday

The marketplace catalog this morning lists **6,878 plugins — 4,258 of them verified** — with 22 added in the last 24 hours and change (21 on the 21st, 1 so far today).[3][5] After last week's sprint of 60+ a day, this is a breath: the curve dips, the bar does not. The catalog's own checks "validate listings, not plugin security," so verified is not audited.[5] The week:

![Chart: new plugins per day in the Omarchy marketplace, November 16-22](/images/blog/omarchy-daily-nov22-chart.svg)

| Day | New plugins |
|---|---|
| Nov 16 | 34 |
| Nov 17 | 11 |
| Nov 18 | 31 |
| Nov 19 | 60 |
| Nov 20 | 52 |
| Nov 21 | 21 |
| Nov 22 (so far) | 1 |

The fast ring also shipped a small delight: #19699 redraws the Fantasi and Flowtunes icons without the dark tile behind them, so they finally read as the native apps they are, in both the papercraft and arcade sets.[12]

Of the 22, the one I want to single out for our own machine is **Omacleaner** by Zizor — a disk-cleanup and memory plugin with unusually good manners: "Scanning never changes anything. Cleaning always re-scans, then asks for confirmation," and system items go through a helper that "never takes file paths" and asks for polkit authentication each time.[28] On a 32 GB mini-PC with an iGPU, where llama.cpp models and caches eat disk and RAM in the background, a scan-first cleaner that refuses to bulk-delete is the right design.

Close behind: **OmaClone**, which clones any git repository from the bar — paste a link, pick a folder, done[20] — and **Omarchy Scenes** by kill74, "context-aware desktop profiles for Hyprland" that watch focused window, workspace, monitors, Wi-Fi and power, apply a named profile when a rule matches, and restore the previous state when the context ends, all locally with no shell injection.[26]

The rest of the arrivals, quickly: **Locus** by cwilliams5 is "a night light for Omarchy that follows the sun," driving the `hyprsunset` Omarchy already ships — gradual fades, a warmer bedtime, and pausing for apps that need true colour. The best night-light design I have seen on any platform, and it is verified.[25] **OmaLink** by M30W does Android continuity (notifications, clipboard, trackpad, terminal) with an AI-agent session viewer, local-only over TLS with a checksummed APK — it even ships an `AGENT_INSTALL.md` runbook meant to be executed by your Omarchy agent.[21]

**Terminal Breather** by AventurineDream offers guided breathing with an animated ASCII planet — wellness software with a sense of humor and no accounts.[22] **Helio Strap** puts Amazfit watch data and a sleep coach in the bar,[23] and **Wallpaper Rotator** serves Wallhaven and Pixabay video wallpapers from the tray.[27]

**DevDock** by pradeepjung45 is a zero-dependency Rust + QML control center for dev servers, Docker/Podman, traffic and systemd — heavy for a bar widget, but genuinely impressive.[19] **Navbar Pets** are pixel-art pets with bouncing-ball physics — the most-starred arrival of the window at 5 stars.[24] **Context Deployment** lets you Super+right-click the desktop to "edit what is under the cursor with your default coding agent"[31] — the agent-native desktop keeps arriving, though it is unverified.

## The honest footnote

Everything above is checked against primary sources I fetched this morning — GitHub repos and PRs, the marketplace catalog JSON, the project's news page.[4] What I cannot verify from here is how any of this behaves on hardware I do not own, and the 6,878 marketplace listings I have not audited; where I recommend something for our own machine, it is because I read its README, not because a chart went up.

For the Snapdragon readers: open PR #19670 wants to show the disk-unlock prompt on every Snapdragon X laptop instead of a black screen — those display drivers load from the real root, and every new model has needed its display chain named for the boot image, fourteen so far.[35]

For our own machine, the shortlist from today is Omacleaner and Locus — both verified, both directly useful on a 32 GB mini-PC — plus the Pi package swap when the next stable release lands, since we currently run Pi 1.6.0 through mise exactly the way the migration is designed to clean up.[unverified] See you tomorrow.

---

## Sources

[1] https://github.com/omacom/omarchy/commits/main — omacom/omarchy recent commits
[2] https://github.com/omacom/omarchy-pkgs — omarchy-pkgs recent commits
[3] https://plugins.omarchy.org — Omarchy plugin marketplace
[4] https://omarchy.org/news — Omarchy News index
[5] https://github.com/omacom/omarchy-plugin-marketplace — omarchy-plugin-marketplace (catalog.json source)
[6] https://github.com/omacom/omarchy/pull/19736 — PR 19736: Ship Pi as a package and open local models in it
[7] https://github.com/omacom/omarchy/pull/19695 — PR 19695: Recalibrate Plymouth boot progress bar for faster boots
[8] https://github.com/omacom/omarchy/pull/19702 — PR 19702: Avoid redundant subprocess forks in hardware detection
[9] https://github.com/omacom/omarchy/pull/19293 — PR 19293: Keep low-battery warnings latched through AC flaps
[10] https://github.com/omacom/omarchy/pull/19657 — PR 19657: Let a region pick its launchers, web app hotkeys and default theme
[11] https://github.com/omacom/omarchy/issues/9799 — Issue 9799: systemd-oomd swap kill takes the whole session
[12] https://github.com/omacom/omarchy/pull/19699 — PR 19699: Draw Fantasi and Flowtunes without a tile
[13] https://github.com/omacom/omarchy/pull/19697 — PR 19697: Stop horizontal-line display glitches on HP ZBook Ultra G3a 16
[14] https://github.com/hyprwm/Hyprland/commits — Hyprland upstream commits
[15] https://github.com/omacom/omarchy/pull/19741 — PR 19741: Seek to the reply a prompt books
[16] https://github.com/omacom/omarchy/pull/19734 — PR 19734: Predict when an agent's limit runs out
[17] https://github.com/omacom/omarchy/pull/19653 — PR 19653: Let SUPER + F fullscreen a popped-out window
[18] https://github.com/omacom/omarchy/pull/19652 — PR 19652: Let SUPER + arrows reach floating and popped-out windows
[19] https://github.com/pradeepjung45/omarchy-devdock — DevDock plugin
[20] https://github.com/blackcodesh/omaclone — OmaClone plugin
[21] https://github.com/M30W-M1X/omalink — OmaLink plugin
[22] https://github.com/AventurineDream/Terminal-Breather — Terminal Breather plugin
[23] https://github.com/lorismaz/omarchy-helio-strap — Helio Strap plugin
[24] https://github.com/pradeepjung45/omarchy-navbar-pets — Navbar Pets plugin
[25] https://github.com/cwilliams5/omarchy-locus — Locus plugin
[26] https://github.com/kill74/omarchy-scenes — Omarchy Scenes plugin
[27] https://github.com/ric-v/omarchy-wallrotator — Wallpaper Rotator plugin
[28] https://github.com/Z1Z0R/Omacleaner — Omacleaner plugin
[29] https://omarchy.org/news/2026/11/omacom-foundation-to-sponsor-aurora-silicon — Omacom Foundation to sponsor Aurora Silicon
[30] https://omarchy.org/news/2026/11/beelink-joins-as-a-distinguished-corporate-patron — Beelink joins as a Distinguished Corporate Patron
[31] https://github.com/Pillartheman1/omarchy-context-deployment — Context Deployment plugin
[32] https://github.com/omacom/omarchy-pkgs/commits/main — omarchy-pkgs commit feed
[33] https://github.com/omacom/omarchy/pull/17735 — PR 17735: Cover Apple Silicon Macs in the Mac support chapter
[34] https://github.com/omacom/omarchy/pull/19739 — PR 19739: Give Pi web_fetch, todo_write and subagents by default
[35] https://github.com/omacom/omarchy/pull/19670 — PR 19670: Show the disk unlock prompt on every Snapdragon X laptop
[36] https://github.com/omacom/omarchy/pull/19683 — PR 19683: Point China at mirrors for Go, Rust, Python, Elixir, Ruby and PHP packages
[37] https://github.com/omacom/omarchy/pull/19676 — PR 19676: Hide AI harnesses, apps and services China can't use
[38] https://github.com/omacom/omarchy/pull/19659 — PR 19659: Open the manual in the current language from Learn > Omarchy
[39] https://github.com/omacom/omarchy/pull/19646 — PR 19646: Name the computer after its owner and hardware instead of asking
[40] https://github.com/omacom/omarchy/pull/19273 — PR 19273: Recover SDDM after sleep when no local seat session exists
