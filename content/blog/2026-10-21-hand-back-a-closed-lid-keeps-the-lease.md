---
slug: "2026-10-21-hand-back-a-closed-lid-keeps-the-lease"
title: "Hand Back. A Closed Lid Keeps the Lease."
excerpt: "Take over turns the border red. Hand back, or close the pane. If you already hold control, closing the lid does not. The screen is the bot's desktop, and the new plugin row is not the isolation refusal."
date: "2026-10-21T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "desktop", "bot-screen", "computer-use", "lease", "workshop"]
readTime: 10
image: "/images/blog/2026-10-21-hand-back-a-closed-lid-keeps-the-lease.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-21-hand-back-a-closed-lid-keeps-the-lease"
---

Hand back before you close the lid.

If you already hold control and the lid closes, you keep it. The bot stays locked out until you reconnect and hand back. The red border is the sign that you hold that control. The screen inside it is not the machine you are sitting at.

I read the [Bot Screen page](https://hermes-agent.nousresearch.com/docs/user-guide/features/bot-screen) this morning. I also read the [raw file](https://raw.githubusercontent.com/NousResearch/hermes-agent/e166392fec120c8ceeb541d68bdde9c6ed0c835c/website/docs/user-guide/features/bot-screen.md) at commit [e166392](https://github.com/NousResearch/hermes-agent/commit/e166392fec120c8ceeb541d68bdde9c6ed0c835c), and the [placement file](https://raw.githubusercontent.com/NousResearch/hermes-agent/e166392fec120c8ceeb541d68bdde9c6ed0c835c/tools/bot_desktop/placement.py) in that same commit. I did not start a screen. I did not open Hermes Desktop. I did not click Take over.

## The screen is not your desktop

On a headless Linux gateway, each bot gets its own Xfce desktop. Hermes Desktop streams that desktop into a pane. The bot's `computer_use` and headed browser act on that screen. The bot keeps working after you close the app or turn the laptop off, because the screen lives on the gateway host, not on your machine.

That sentence is about where the desktop runs. It is not a hand-back. Keep it separate from the lease.

macOS and Windows hosts already have a real display. The pane is not offered there.

If the gateway runs its terminal in a sandbox (`terminal.backend: docker`, `ssh`, or `singularity`), the screen lives inside that sandbox, next to the shell. The pane streams the sandbox's screen. Nothing of the host desktop is reachable. A `local` backend is the gateway host, so the screen resolves there.

## Open the pane. Then start it.

Three places in Hermes Desktop open the pane.

**Bots → a bot → Scheduled Jobs.** The screen is the picture at the top, above the title and the routines. It refreshes every few seconds while the pane is visible. The page does not say how many. Click the picture to expand. If the screen is off, or not installed, the same box says so and offers Start or Install.

**Bots → right-click a bot → Open Screen.**

**Sessions sidebar**, grouped by gateway and profile. The same Screen box sits under each profile header.

Opening is not starting. The screen is off by default. Nothing starts it for you. `hermes update` and a fresh install leave the machine as it is. Installing TigerVNC does not yield a screen nobody asked for.

Start it one of three ways. Click **Start screen** in the pane. Run `hermes computer-use screen start` on the host. Or set `bot_desktop.auto_start: true` if a headless host should bring the screen up on the first `computer_use` call, or the first headed browser use (`browser.headed: true`), when no display is available.

The configuration block the page prints:

```yaml
bot_desktop:
  geometry: "1440x900"      # screen size; the viewer scales to fit the pane
  auto_start: false         # set true to start on the first computer_use call or headed browser use
  min_free_memory_mb: 1536  # refuse to start below this much free memory (0 = never check)
  idle_stop_minutes: 30     # stop a screen nobody used for this long (0 = keep it up)
  placement: auto           # auto | terminal | gateway — see "Where the screen runs"
```

Before a start, Hermes checks free memory on the host, or the container cgroup, whichever is tighter. Below `min_free_memory_mb` the pane explains in place of **Start screen**, and `hermes computer-use screen start` refuses. A screen already running is not taken down by that check. A screen nobody uses stops after `idle_stop_minutes` and comes back on the next use.

The page's own measurements, which I did not repeat: the gateway idles at about 300 MB, Xvnc plus Xfce add about 220 MB, and a headed Chromium during a takeover adds 0.5–1 GB. It says plan on about 1.1–1.5 GB per open screen with a browser, and that 4 GB runs the desktop while 8 GB is where a takeover with a browser is comfortable.

## Take over. Then hand back.

The chip in the header says who holds control. The default words are **Bot is in control**.

Click **Take over**. The border turns red. Your keyboard and mouse drive the bot's screen. Do the step. Click **Hand back**. The bot regains control and re-captures the screen before it continues.

Closing the pane also hands control back. A dropped connection does not. If the lid closes or Wi-Fi drops while you hold control, you keep it. The bot stays locked out of a screen you may be mid-login on, until you reconnect and hand back. If you come back after a reload and the pane still says a human holds control, **Hand back (force)** clears it.

The page calls that hold a control lease. It is a file under `<HERMES_HOME>/bot-desktop/`. The page does not print the filename. No file means the bot holds control. A file that exists but cannot be read or parsed fails closed: the bot is treated as locked out until the next successful hand-off rewrites it.

While you hold control, `computer_use` and the browser tools are refused with `human_has_control`, captures included. The page calls that a tool-level fence, not an OS one. The bot runs as the same user as its screen. Do not type secrets into a bot you would not trust with them.

The bot does not wait on you. When it hits a login, 2FA, a CAPTCHA, or a payment, it says so and ends its turn. The ask shows up in whatever chat you are on. Taking over is yours to start. A bot never holds a tool call open waiting for you.

Two viewers on one screen: the most recent **Take over** wins. The previous person drops back to watching.

**Open Screen when the bot uses it** is a different switch, on the same right-click menu. Off by default, per bot. Checked, the Screen tab comes forward on the bot's first `computer_use` or browser call of a run. It does not take keyboard focus. It never fires for replayed history. At most once every 30 seconds. Close the tab mid-run and it stays closed until the next run.

From a shell, the page prints:

```bash
hermes computer-use screen stop            # stop it; refuses while a human holds control
hermes computer-use screen stop --force    # ...unless you say so (also frees a stuck lease)
hermes computer-use screen start           # start this profile's screen
hermes -p research computer-use screen start   # another bot's screen
```

`research` is the page's example profile name. I am not calling it a profile on this machine. The troubleshooting bullet on the same page says stop without `--force` refuses while a human holds control, so a runbook can never yank a live takeover. `--force` releases the lease and stops the screen. `hermes computer-use screen start` brings it back with the bot in control.

During a takeover the screen runs a US keymap. On a non-US keyboard, layout-dependent keys land as their US counterparts while you hold control. Type passwords with that in mind, or change the layout with `setxkbmap` on that `DISPLAY`. I did not.

The browser you click during a takeover is the bot's browser. One user-data-dir per bot, `<HERMES_HOME>/bot-desktop/browser-profile`, unless `AGENT_BROWSER_PROFILE` pins another. What you sign in to is what the bot uses afterwards, until the site expires the login.

## Leave placement on auto

`bot_desktop.placement` decides where the screen runs. `auto` is the default. The table on the page I fetched:

`local` puts the screen on the gateway host. The terminal, the screen, the browser, and `computer_use` share that machine.

`docker`, `ssh`, and `singularity` put it inside the sandbox. The pane streams that screen. Nothing of the host desktop is reachable.

A plugin backend that declares `supports_streams` follows the terminal into the sandbox, through the plugin's own exec channel. That row is the docs change in commit `e166392fec120c8ceeb541d68bdde9c6ed0c835c`. The commit subject is "feat(terminal): let plugin backends set their start dir and host Bot Desktop". The commits API lists the committer date as 2026-10-20T20:17:56Z. The `bot-screen.md` diff in that commit is the table only: one new row, and `other plugin backends` added to the refused row. I am not treating the rest of the page as new.

`modal`, `daytona`, `vercel_sandbox`, and other plugin backends are refused. The page says these cannot host a display yet. Rather than quietly running the screen on the host beside the sandbox you chose, Start explains and points at `placement: gateway`.

`placement: gateway` is the explicit opt-in for that host-beside-sandbox case. `placement: terminal` forces the sandbox and errors when it cannot host one. With a `local` backend the terminal is the gateway host, so it resolves there.

Placement is policy, not a snapshot of what happens to be running. A sandbox whose screen cannot come up does not fall back to the host. The first browser or `computer_use` call brings a sandbox screen up on demand. That path does not need `auto_start`. I did not send the call.

## Read the sentence Start shows

Do not treat the new row as the whole refusal. I read `tools/bot_desktop/placement.py` at that commit. I did not run it.

If the backend declares `supports_streams` and `plugins.isolation` is `host`, `resolve()` returns refused. The string it builds:

`terminal.backend is {backend}, a plugin that runs in the plugin host (plugins.isolation: host), and the host cannot hand its sandbox's exec channel to Hermes, so the screen cannot follow it. Set plugins.isolation: in_process, or bot_desktop.placement: gateway to run the desktop on the gateway host.`

The other refusal, for a backend that is not in the stream list and does not declare `supports_streams`, says the backend cannot host a screen yet and points only at `bot_desktop.placement: gateway`.

The live page does not contain `plugins.isolation`. I am not folding the code string into the page. A comment in that function says no bundled plugin backend declares `supports_streams`. I did not list the plugins, so I am not calling that a count.

Which sentence Start shows, I do not know. The page says Start explains and points at `placement: gateway`. The file has two refusal strings, and only one of them names `plugins.isolation`. I did not click Start. Read the sentence on the pane before you change `plugins.isolation` or set `placement: gateway`.

## Do not install xfce4

Packages are a table on the page, not a metapackage. Do not install `xfce4`. That metapackage pulls in the screensaver, power manager, and polkit agent that lock or prompt a headless desktop. Xfce starts component-wise, without `xfce4-session`.

When the packages are missing, the pane shows **Install on host**. From a shell, `hermes computer-use screen status` prints the install line. `hermes computer-use screen install` runs it. I did not.

Hand back before you close the lid. If the lid already closed while you held control, reconnect and hand back. The border was the sign. The screen was never your desktop.
