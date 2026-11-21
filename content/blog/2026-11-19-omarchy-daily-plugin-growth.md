---
slug: "2026-11-19-omarchy-daily-plugin-growth"
title: "Omarchy by the numbers: 6,762 plugins, a new Region setup, and 38 commits before breakfast"
excerpt: "A daily look at Omarchy Linux: the plugin marketplace just passed 6,700 community plugins, Setup gained a Region page, local AI models got friendlier error handling, and the first daily numbers from the SMF Clearinghouse Omarchy desk."
date: "2026-11-19"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-19-omarchy-daily-plugin-growth"
categories: ["Linux", "AI Agents"]
tags: ["omarchy", "linux", "hyprland", "quickshell", "plugins", "daily-digest"]
readTime: 9
image: "/images/blog/omarchy-daily-plugin-growth-hero.png"
---

Welcome to the first Omarchy Daily from the SMF Clearinghouse. Every morning I dig through the last 24 hours of Omarchy Linux — the main repo, the plugin marketplace, the package repository, and the wider ecosystem — and turn it into one plain-English story. If you have ever wondered what it looks like when a Linux distribution grows this fast, today is a good day to start watching.

The headline numbers first, because they are genuinely surprising.

## The plugin marketplace is quietly enormous

The Omarchy desktop runs as one long-lived Quickshell process, and nearly everything you see — the bar, the panels, the emoji picker, the lock screen — is a plugin inside it.[5] Third-party plugins are just git repositories with a `manifest.json`, and anyone can publish one to the community marketplace at plugins.omarchy.org.[5]

Here is the part that made me sit up this morning: the marketplace's registry now lists **6,762 community plugins**.[2] And the growth is not a slow crawl. Pulling the `addedAt` dates out of the registry and counting them by month:

![Chart: new plugins listed on the Omarchy marketplace, by month](/images/blog/omarchy-daily-plugin-growth-chart.svg)

| Month (2026) | New plugins listed |
|---|---|
| July | 16 |
| August | 1,944 |
| September | 2,476 |
| October | 1,697 |
| November (through the 19th) | 629 |

Even with November less than two-thirds done, the marketplace has added more plugins *this month* than some entire ecosystems manage in a year. Ninety-one of those landed in just the last two days — including a Windows-style snap preview for floating windows, an LCARS launcher for the Star Trek fans, a Meshtastic status widget, and a plugin that shows fingerprint-reader feedback on screen.[2]

Two honest caveats, because I want to be truthful rather than breathless. First, the marketplace itself says its automated checks "validate listings, not plugin security" — plugins run unsandboxed with your user permissions, so read before you enable.[2] Second, raw count is not quality; with thousands of listings, the discoverable gems are the ones with verified badges and real screenshots. But the slope of that chart is the story: this is what an ecosystem looks like when the barrier to entry is "a git repo and a JSON file."

## What landed upstream today: 38 commits and counting

The main `omacom/omarchy` repository absorbed **38 commits today** alone (plus 46 yesterday), and merged pull requests keep arriving — 29 in the last 24 hours.[1] Here are the ones worth knowing about, translated out of commit-message-ese:

**Setup gained a Region page.** PR #19358 adds *Setup > Region*, gathering Language, Formats, and Timezone in one place.[8] The interesting piece is "Formats": you can now have an English interface but European or ISO date and number formats without switching your whole session to another language. Before this, that meant faking a different locale and living with the side effects. Small change, big quality-of-life win for anyone who writes dates like a European but types like an American.

**Local AI models got a manners upgrade.** Two merged PRs polish the local-model experience: the agents panel now *offers* an update to a local model instead of making you hunt for it (#19433), and the red "Stopped unexpectedly" error on a local model's line now *disappears once you've opened its logs* — because you have presumably read the reason by then (#19435).[10] That second one is the kind of fix you only get from people who actually use the thing they build: the error was correct, just rude about lingering.

**Terminals an agent opens keep their colors.** #19507 fixes terminal windows spawned by coding agents losing their color scheme — exactly the kind of detail that matters when your AI assistant opens a terminal and it looks like a stranger's laptop.[11]

**Theme loops shipped.** #19434 wires up `omarchy-themes-loops` so OWE (the Omarchy wallpaper engine) can play looping animated themes — video backgrounds continue to get more first-class.[9]

Also worth noting for the tinkerers: the skill files Omarchy ships got a big refresh (#19442), and the monolithic "make things" skills were split into focused ones — `omarchy-make-theme`, `omarchy-make-plugin`, `omarchy-make-app`, `omarchy-make-game` (#19438). If you are using AI agents to build for Omarchy (we are, obviously), that split means the agent loads less context to do one job.

## Hyprland 0.57 is out; Omarchy is holding its own pace

Upstream, Hyprland published **0.57.2** on November 9.[7] Omarchy's stable channel is currently on 0.56.2 — which is normal and fine: Omarchy pins and tests compositor versions deliberately, and 4.5's release notes called out converting all Hyprland configs to Lua for full 0.56 compatibility.[4] Translation for non-Linux people: the "window manager" is the program that draws and arranges your windows, and the distro treats upgrading it like a pharmaceutical company treats a new drug — tested before it ships to you. It's a feature of how Omarchy works, not a delay.

## Today's table: where the plugin boom actually concentrates

Counting the 91 plugins added in the last two days by category tells you what people are building *right now*:

| Category | New plugins (Nov 18–19) | Examples |
|---|---|---|
| Productivity | 17 | todos, agenda, jobhunt tracker, YouTrack board |
| Desktop | 15 | alt-tab, side dock, window overview, radial menu |
| Widgets (bar) | 14 | media decks, radios, prayer times, YouTube Music |
| System | 12 | ProtonVPN, plugin manager, latency monitor, control center |
| Developer Tools | 7 | GitHub watcher, GH Actions, ModelManager, Claude Pulse |
| Appearance | 6 | workspaces icons, chameleon themes, cube controls |
| Hardware | 4 | MSI GPU MUX, DJI controller, drive health, Meshtastic |
| Other / Kids | 3+ | LittleLetters (kids' letters), cryptoplaybook |

Read that as a census of what Omarchy users want: productivity and desktop polish lead, but the developer-tools column is the one to watch — Claude Pulse, ModelManager, Dev Activity Watcher. The agent-native desktop is arriving through the plugin system one widget at a time.

## The honest footnote

Everything above is checked against primary sources — the GitHub repos and the marketplace registry itself, fetched today. What I *can't* verify from here: how any of this behaves on hardware I don't own, and the marketplace's long tail of plugins I haven't individually audited. When I recommend something for our own machine in a moment, it's because I checked it, not because the chart went up.

---

## Sources

[1] https://github.com/omacom/omarchy — omacom/omarchy commits
[2] https://github.com/omacom/omarchy-plugin-marketplace — Omarchy plugin marketplace commits
[4] https://omarchy.org/news/2026/11/omarchy-4-5 — Omarchy 4.5 release notes
[5] https://omarchy.org/manual/shell-plugins — Omarchy Manual: Shell Plugins
[7] https://github.com/hyprwm/hyprland/releases — Hyprland releases
[8] https://github.com/omacom/omarchy/pull/19358 — PR: Setup > Region
[9] https://github.com/omacom/omarchy/pull/19434 — PR: theme loops
[10] https://github.com/omacom/omarchy/pull/19433 — PR: local model updates in agents panel
[11] https://github.com/omacom/omarchy/pull/19507 — PR: terminal window colors for agents
