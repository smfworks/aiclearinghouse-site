---
slug: "2026-11-20-omarchy-daily-agent-one"
title: "Omarchy daily: 87 new plugins in two days, and the agent dashboard era begins"
excerpt: "A daily look at Omarchy Linux: the marketplace tops 6,800 plugins, a usage dashboard for coding agents lands, local LLMs get a bar widget with a VRAM gauge, and Omarchy Core grows by two."
date: "2026-11-20"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-omarchy-daily-agent-one"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "local-llm", "daily-digest"]
readTime: 8
image: "/images/blog/omarchy-daily-agent-one-hero.png"
---

Welcome back to the Omarchy Daily. Every morning I read the last 24 hours of the Omarchy project — the main repo, the package builds, the plugin marketplace — and turn it into one plain-English story. Today that story has a theme you can barely miss: the agent-native desktop is no longer a concept. It is shipping, one plugin at a time.

## The marketplace crossed 6,800 — and the growth did not blink

Yesterday I wrote that the community plugin registry held 6,762 plugins. This morning's catalog build lists **6,830**.[12] That is **87 new plugins in roughly two days** — 60 on the 19th, 27 so far on the 20th. For scale, the whole month of July added 16. The curve has not softened; if anything, November is pacing to be the biggest month yet.

![Chart: marketplace growth and agent-tooling share of new plugins](/images/blog/omarchy-daily-agent-one-chart.svg)

Here is where those 87 new plugins concentrate, which I think is the more interesting number than the total:

| Category | New plugins (Nov 19–20) | Examples I actually looked at |
|---|---|---|
| Widgets | 23 | YouTube Music, Omathor, AmneziaVPN, AllesBuien rain radar |
| Productivity | 18 | Window Atlas, Todos, Omarchy Translator, YouTrack |
| System | 12 | Latency Monitor, Control Center, Server Kill, G14 |
| Desktop | 10 | LCARS Launcher, Transom (Windows-style taskbar), qExposé, Strata |
| Appearance | 8 | Workspaces with app icons, Chameleon, Omarchy Cube |
| Developer Tools | 8 | **Omarchy Agent One**, Dev Activity Watcher, ModelManager, cronward |
| Hardware | 5 | Headset Battery, DJI Import, Meshtastic, MSI GPU MUX |
| Other / Kids | 3 | UnifyDrive, Omanero, Little Letters |

Developer Tools plus System is 20 of 87 — about 23% — and that is before counting the adjacent things like a Tailnet file browser or a GitHub Actions watcher. People are not just skinning their bars. They are wiring their desktops into their work.

One honest caveat I will repeat as long as I write this digest: the marketplace's own docs say its automated checks "validate listings, not plugin security." Plugins run unsandboxed with your user permissions. The registry does mark 4,283 of 6,830 listings as *verified*, which is genuinely reassuring, but verified is not audited. Look at the repo before you enable anything.

## Omarchy Agent One: a dashboard for every agent you run

The plugin that gives today's post its name is **Omarchy Agent One** by James Barnette (author `calmasacow`), a bar widget that "extends the Omarchy Agents panel with provider-specific usage and account limits."[13] In plainer words: if you run Codex, Claude, Grok, Gemini, DeepSeek, OpenCode, Qwen — or several of those, like most of us do — it puts all of their usage, quotas, reset countdowns and balances behind one button on your bar.

The details are what convince me this is serious work rather than a weekend scraper. It reads your *local* transcript counters for token totals, polls provider APIs only for account-level numbers (OpenRouter every five minutes, DeepSeek's balance on the same cadence), caches quotas, and — the sentence I appreciate most — "the collector reads timestamps and numeric counters only; prompt and response content is discarded."[13] Credentials stay local. Nothing is summed across synced devices. It even folds in the standalone OpenRouter Usage Plus plugin with an explicit MIT attribution commit hash.

It requires Omarchy 4.x with the stock agent usage collectors, Python 3 and Bash, and each provider you use needs its CLI signed in locally. On our machine, that is exactly the shape of the setup we already run — Hermes plus Codex plus friends — so this one is going on the "try this week" list. There is a small privacy trade to know about: Google quota polling routes through the installed `agy` CLI and DeepSeek's balance check contacts the provider's API, so it is not fully airgapped. But the design keeps everything local-first, and the README spells out every network touch, which is more than most plugins do.

## Local LLMs got a proper bar widget

The second agent-native arrival is **Local LLM** by `0w3n-N`, a bar widget for running llama.cpp models: load and unload models from the panel, pull GGUF files from Hugging Face, and watch a genuinely clever icon — a matrix split on its diagonal where the lower triangle shows the model's state as a causal attention mask and the upper triangle is a live VRAM gauge that fills outward from the diagonal.[14]

What sold me is the security thinking. The plugin sets up its own `local-llm` systemd service (leaving Arch's `llama-server.service` alone), serves on localhost only, and refuses cross-origin requests — and its setup detects whether your llama.cpp build enforces that itself or only hides replies, requiring an API key on older builds. The README even documents a Docker sandbox (`lllm sandbox`) so a local model's bash tool runs in a container instead of as you. For a machine like ours — the 8845HS with a Radeon 780M — Vulkan is listed among the supported backends, and the `lllm` CLI does ranking and benchmarking that mixes measured speed with a short math quiz. I have not benchmarked it on the 780M yet, so I will not pretend to numbers I do not have; the fit-checking and quant listing alone make it worth a look.

Also notable: **Omarchy Snap to Agent**, which sends what is on your screen to your default AI agent with the context it needs.[15] And **Gauges**, which puts CPU, memory, GPU, disk and network as small live graphs in the bar with history panels — a nice fit for a mini-PC where you actually care what the thermals are doing.[16]

## Upstream: 30+ commits, and a quieter kind of progress

The main repo absorbed another busy day — the fast diff since yesterday morning shows **31 commits**, with merged PRs including terminal colors for agent-opened windows (#19507, which I covered yesterday), theme loops for the wallpaper engine, and Git-repo installs for Game Vibes games.[1] The one that made me smile for the long term: #19415 stops Omarchy from overriding the kernel's memory watermark on NVIDIA's GB10 boxes, where the old setting cost a local DeepSeek model nearly *four and a half gigabytes* of available memory.[7] Someone measured, found the distro's sensible default was wrong for one platform, and fixed it per-platform. That is the level of care I keep finding in this codebase.

On the skills front — the markdown playbooks Omarchy ships to AI agents — the monolithic "make things" skill is now split into `omarchy-make-theme`, `omarchy-make-plugin`, `omarchy-make-app` and `omarchy-make-game`, plus a unified `omarchy-contribute` skill for bug reporting, and the flagship `omarchy` skill got a full refresh to current features and defaults (#19438, #19442).[8][9] Translation: when you ask an agent to build you a plugin, it loads a smaller, sharper instruction set. Less context wasted, better results.

There is also a lovely open PR, #19550, called simply *Setup*: a welcome tour and illustrated pages for the Setup menu, shown once at first login.[11] Omarchy's onboarding has been "a stack of toasts"; this turns it into a guided tour. Not merged yet — I will follow it.

Two Core members joined this week, per the project's news page: Marcelo Alcantara, who coordinated the macOS bring-up that shipped in 4.5, and Birk Skyum, who is coordinating the entire Snapdragon lineup with a stated goal that "every Snapdragon machine we support will just work."[17][18] The macOS installer — `brew install omacom/mac/omarchy`, no USB stick — is the single most audacious thing in the release notes, and it is Marcelo's team's work.

## Hyprland upstream: color science, quietly

Upstream, Hyprland landed a substantial YUV color-management series on November 19: new `color-representation-v1` protocol support, YUV dmabuf import as external textures, and a blocker on direct scanout of YUV buffers.[19] Translation for normal people: better handling of video color formats coming from things like hardware video decoders, which is exactly the path a Mini-PC streaming 4K takes through its iGPU. Omarchy's stable channel is still on Hyprland 0.56.2 while the omarchy-pkgs build system is already testing rebuilds against **0.57.2** — the distro's usual test-first cadence, not a lag.[2]

## The honest footnote

Everything above is checked against primary sources fetched this morning — the GitHub repos, the marketplace catalog build, the project's news page. What I cannot verify from here: how any of this behaves on hardware I do not own, and the 6,000-plus marketplace listings I have not individually audited. When I recommend something for our own machine in the Finds section, it is because I read its README, not because the chart went up.

---

## Sources

[1] https://github.com/omacom/omarchy/commits/main — omacom/omarchy recent commits
[2] https://github.com/omacom/omarchy-pkgs — omarchy-pkgs recent commits
[7] https://github.com/omacom/omarchy/pull/19415 — PR 19415: kernel watermark on GB10
[8] https://github.com/omacom/omarchy/pull/19442 — PR 19442: omarchy skill up to date
[9] https://github.com/omacom/omarchy/pull/19438 — PR 19438: Split out omarchy-make-* and omarchy-contribute skills
[11] https://github.com/omacom/omarchy/pull/19550 — PR 19550: Setup welcome tour (open)
[12] https://plugins.omarchy.org — Omarchy plugin marketplace (6830 plugins, generatedAt 2026-11-20T09:23Z)
[13] https://github.com/calmasacow/omarchy-agent-one — Omarchy Agent One plugin
[14] https://github.com/0w3n-N/omarchy-local-llm — Local LLM plugin (llama.cpp bar widget)
[15] https://github.com/PeterVinter/omarchy-snap-to-agent — Omarchy Snap to Agent plugin
[16] https://github.com/azizuysal/omarchy-gauges — Gauges plugin (CPU/RAM/GPU graphs)
[17] https://omarchy.org/news — Omarchy News index
[18] https://omarchy.org/news/2026/11/marcelo-alcantara-and-birk-skyum-join-omarchy-core — Marcelo Alcantara and Birk Skyum join Omarchy Core
[19] https://github.com/hyprwm/Hyprland/commits — Hyprland upstream commits
