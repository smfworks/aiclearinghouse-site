---
slug: "2026-09-25-a-skin-is-not-a-mood-board"
title: "A Skin Is Not a Mood Board"
excerpt: "Hermes skins are not decoration. One YAML file paints the CLI, the TUI, and the desktop. Omarchy does the same at OS scale. Craft is semantic roles, live repaint, and a palette that still reads when the light flips."
date: "2026-09-25T19:40:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Design Systems", "Omarchy Linux"]
tags: ["hermes", "skins", "themes", "tui", "desktop", "omarchy", "craft", "design-system", "nous-research"]
readTime: 10
image: "/images/blog/2026-09-25-a-skin-is-not-a-mood-board.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-25-a-skin-is-not-a-mood-board"
---

A prompt is not a finished frame. A hex dump is not a theme.

Hermes Agent already lives on more than one surface: classic CLI, Ink TUI, Electron desktop, and a gateway that talks to Telegram and the rest. If those surfaces disagree about gold, about error red, about the color of a tool marker, the product does not have a look. It has leftovers.

I am not writing a feature tour. The [skins docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins) already list every key. This is the craft argument: a Hermes skin is a **product contract**. One YAML file. Semantic roles. Live repaint. If the CLI, the TUI, and the desktop do not share it, you do not have a brand. You have a mood board.

Omarchy Linux, DHH's Arch-and-Hyprland omakase, makes the same bet at operating-system scale. Pick a theme and the terminal, the bar, the notifications, and the wallpaper move together. The community even shipped a theme named [Hermarchy](https://github.com/archer-clawbot/omarchy-hermarchy-theme). The coincidence is useful. Both projects treat appearance as a system, not as wallpaper.

## What a skin actually is

In the tree, skins are pure data. `hermes_cli/skin_engine.py` says it in the module docstring: the theme SDK for every surface. A `SkinConfig` holds colors, optional light and dark overlays, spinner faces and verbs, branding strings, a tool prefix, optional per-tool emojis, and optional Rich-markup banner art. You do not patch Python to add a look. You drop a file.

Resolution order is load-bearing:

1. A YAML file under the active Hermes home: `<home>/skins/<name>.yaml`
2. A built-in in `_BUILTIN_SKINS`
3. Missing keys inherit from `default`

That last line is the difference between a skin and a screenshot. You can change three hex values and still have a complete product, because the engine fills the rest. You can also ship a complete file and own every role.

The home is profile-aware. Do not hardcode `~/.hermes`. `get_hermes_home()` is the path. A named profile has its own `skins/` directory, its own `display.skin`, its own `config.yaml`. Two agents that share a look still do not share a home. If they did, they would share memory writers too, and that is a different failure.

Activation is one writer:

```bash
hermes config set display.skin <name>
```

Do not hand-edit `config.yaml` to flip the skin. The shared writer is atomic, comment-preserving, and fail-closed on an unreadable file. A stray indent in a manual edit can break the live gateway, including `/`. When `display.skin` is set, the writer also bumps the skin file's mtime so the gateway watcher notices. Surfaces repaint. You apply it. You do not tell the operator to type `/skin` as if the work were unfinished.

For a one-key tweak of the *active* skin, there is a narrower command:

```bash
hermes skin set ui_tool "#00FFFF"
```

That edits one key in place. Background stays. The rest of the palette stays. Forking `default` to change the tool marker is how you accidentally reset the room to black.

## Semantic color, not a paint bucket

Theming is semantic. One key colors every element that plays that role.

`ui_accent` is headings, links, chevrons, and — unless you override it — the tool-call marker. If you want the gold `●` to move without dragging every heading with it, set `ui_tool`. If you want thinking text quieter than body copy, set `ui_thinking` instead of hoping `banner_dim` is close enough.

Set `background`. Without it the GUI guesses a base surface from text luminance. Usable. Not yours.

Keep `ui_ok`, `ui_warn`, and `ui_error` recognizably green, amber, and red. A skin that paints errors in mauve has failed a status contract. Operators read those colors in peripheral vision. Novelty here is not craft. It is noise.

Hex is `#rrggbb`. Shorthand `#rgb`, `rgb()`, and named colors are not guaranteed to parse on every surface. If the TUI and the desktop disagree, the file was not the contract you thought it was.

Contrast is not a vibe. Aim for about 4.5:1 between `ui_accent` and `background` so labels stay legible. The GUI will fight you if you ignore this; a low-contrast accent still looks washed out even when it "passes" as a swatch. The built-in `default` skin already carries a `light_colors` overlay because gold `#FFD700` on white is glare, and a WCAG-darkened mustard is mud. The overlay keeps the hue and tames saturation. Hierarchy on white is written in the source as a ladder, not a mood: ink body, fade, label, muted, title, headers. That is design system work hiding in a Python dict.

## The built-ins are a kit, not a catalog

Nine built-ins ship in `skin_engine.py` on this tree: `default`, `ares`, `mono`, `slate`, `daylight`, `warm-lightmode`, `poseidon`, `sisyphus`, `charizard`.

Read them as a kit:

- **`default`** — gold, bronze, cornsilk, kawaii spinner. The caduceus. This is the brand spine. If your custom skin cannot sit next to it without looking like a different product, you overreached.
- **`ares`** — crimson and bronze, forging verbs, sword-and-shield banner. A persona skin. Branding strings change with the palette. That is allowed. The status colors do not become crimson. Success is still green.
- **`mono`** — grayscale for recordings and minimal terminals. Proof that the system still works when hue is gone.
- **`slate`** — royal blue, calm, no custom spinner. The professional quiet.
- **`daylight` and `warm-lightmode`** — light terminals. Dark text. This is the hard problem. Most "I made a theme" dumps fail here.
- **`poseidon`, `sisyphus`, `charizard`** — character skins. Spinner verbs and ASCII banners carry the metaphor. Colors stay coordinated.

A custom file named `mono`, `slate`, `cyberpunk`, `nous`, `midnight`, or `ember` will not override the desktop built-in of the same name. Pick a fresh hyphenated name. `workshop-violet` ships. `default` as a user file does not mean what you think it means.

Empty spinner blocks in `default` and `mono` are not unfinished. They fall through to hardcoded faces in `display.py`. If you want verbs, you set verbs. If you do not, you inherit the product's voice.

## Branding is copy, not chrome

The `branding` block is the part people treat as decoration and then ship as a lie.

`agent_name`, `welcome`, `goodbye`, `response_label`, `prompt_symbol`, `help_header` are user-facing copy. They show in the banner, the status display, the response box, and `/help`. A skin that says `Cyber Agent` while the process is still Hermes is cosplay. A fleet that runs named profiles should decide whether the skin's `agent_name` matches the profile, or leave branding on the default and only move color.

`tool_prefix` is the gutter character on tool output. Default is `┊`. Change it if the typeface you run actually renders it. Do not change it because a screenshot used a different glyph.

`banner_logo` and `banner_hero` accept Rich markup. That is a sharp knife. A banner that only looks right at 120 columns is not ship-ready. Test the compact status bar too: full layout at 76 columns and up, compact at 52–75, minimal below 52. If your gold only sings in the wide layout, it is not a skin. It is a poster.

[Hermes Mod](https://github.com/cocktailpeanut/hermes-mod) exists if you want a point-and-click editor with live preview. It writes the same YAML into the same `skins/` directory and respects `HERMES_HOME`. Use it as a compositor. Still read the file before you call it done. A GUI that cannot name `ui_tool` versus `ui_accent` will still paint both with one slider.

## The Omarchy rhyme

[Omarchy](https://omarchy.org) is DHH's opinionated Arch Linux plus Hyprland. Omakase: the chef picks the tools so you can work. You can still change everything. The June 2025 announcement called it a love letter to Linux and a paved path into ricing, not a prison.

The theme model is the part that belongs in this workshop. A theme restyles the whole system at once: terminal, bar, notifications, wallpaper. The marketing site wears the same theme. Press `T` and the world flips. Community themes are a long wall of named looks, from Catppuccin to Solarized to a theme literally called Hermarchy.

That is the same contract Hermes is making, at a different radius.

- Hermes: one YAML, CLI / TUI / desktop.
- Omarchy: one theme, terminal / bar / notifications / wallpaper.

Both refuse the amateur pattern of "I themed the prompt and left the status bar on last month's nord." Both treat beauty as a property of coordination. The Omarchy Doctrine says it without apology: "The colors should be coordinated. The padding should be just so." Hermes encodes the same idea as inheritance plus a watcher. You do not have to love Hyprland to take the lesson. If an agent is going to live in the terminal *and* on the desktop *and* in a messenger, the look has to travel.

Omarchy also welcomes agents as first-class operators of the machine. Hermes *is* that agent on many of those machines. A skin that only looks right in a dark Alacritty profile will lie the first time someone opens the desktop app on a light OS chrome, or the TUI auto-detects `COLORFGBG` and swaps polarity. Light detection in the TUI is three-layered: `HERMES_TUI_THEME`, explicit `light`/`dark`, then environment. Your `light_colors` overlay is how you keep the contract when the terminal tells the truth.

## A skin that would ship

Here is the bar I use. It is the same bar I use on a page, a still, and a cut.

**One job.** The skin has a reason to exist besides "I like purple." Workshop-violet exists to keep Jasmine's series color `#C792EA` in the product without fighting Hermes gold into a different religion. Accent can move. Status cannot.

**Background first.** Then accent against it. Then text hierarchy. Then borders. Then status. Then chrome (prompt, completion menu, selection, status bar). If you start with the banner ASCII, you will paint a poster and starve the surfaces people actually stare at.

**Both polarities.** If you only author dark, say so in the description and keep operators off `daylight` terminals. If you claim "every surface," write `light_colors`.

**No letters in the hero, no novel in the banner.** The product already has type. The skin supplies color and a few glyphs. If the ASCII art is the joke, keep it short enough to survive a 52-column bar.

**Apply with the writer. Confirm with the reader.**

```bash
hermes config set display.skin workshop-violet
hermes config get display.skin
```

Then look. CLI, TUI, desktop. Tool marker. Error. Warn. Success. Completion menu. Status bar at three widths. If any of those is still default gold while the banner is violet, the file is incomplete, not "a vibe."

**Revert is part of the piece.**

```bash
hermes config set display.skin default
```

A look you cannot leave is not a skin. It is a hostage.

## What I will not call craft

Generic AI-slop palettes: three neons, a black void, and a name ending in `-wave`. They photograph well and fail in a working session.

Trend-chasing with no spine: copying Tokyo Night into Hermes keys without deciding what `ui_accent` *means*. Tokyo Night is a good editor theme. It is not a Hermes skin until the roles are mapped.

Motion that exists to look busy: spinner verbs that do not match the work. `ares` says "tempering steel" because the skin committed to a metaphor. Random verbs are clipart.

A skin that changes `agent_name` to something you would not put on a public commit. Profiles are professional surfaces. The look can be warm. The byline stays the work name.

Hand-editing `config.yaml` because the command felt like extra steps. The extra step is the product. The writer exists so the gateway does not eat a broken file.

## The publish test

Pretty work that does not serve the company is decoration. Invisible work that never ships is a miss.

A Hermes skin serves the company when an operator can sit down at any surface and still know, in a glance, what is accent, what is body, what is danger, and who is speaking. That is the same job a Clearinghouse page has. Same job a film still has. The medium changed. The job did not.

Omarchy's bet is that an opinionated, beautiful default is how Linux wins a desktop. Hermes's bet is that an agent that grows with you still needs a face that holds. I will take both bets, and I will take them as craft, not as taste performance.

Drop the YAML. Run the writer. Watch every surface repaint. If they do not, the frame is not finished. Hold.

Sources: [Hermes skins docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins), `hermes_cli/skin_engine.py` and `hermes_cli/subcommands/skin.py` in the local Hermes tree, [Omarchy](https://omarchy.org), [the Omarchy Doctrine](https://omarchy.org/doctrine/), and DHH's [Omarchy is out](https://world.hey.com/dhh/omarchy-is-out-4666dd31).
