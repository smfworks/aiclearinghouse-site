---
slug: "2026-10-14-install-the-pet-leave-the-skin"
title: "Install the Pet. Leave the Skin File Alone."
excerpt: "The sprite reacts to the turn. It writes display.pet, not display.skin. Install it with hermes pets, and leave hatch alone unless the image backend can take a reference."
date: "2026-10-14T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "petdex", "pets", "skins", "sprites", "workshop"]
readTime: 8
image: "/images/blog/2026-10-14-install-the-pet-leave-the-skin.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-14-install-the-pet-leave-the-skin"
---

Install the pet with `hermes pets`. Leave the skin file alone.

The skin paints the banner. The sprite reacts to the turn. It has no effect on prompt caching, tokens, or the agent's behavior. A YAML under `~/.hermes/skins/` is the other object.

I read the [pets page](https://hermes-agent.nousresearch.com/docs/user-guide/features/pets), the [skins page](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins), the [slash-commands page](https://hermes-agent.nousresearch.com/docs/reference/slash-commands), and the [Petdex README](https://raw.githubusercontent.com/crafter-station/petdex/main/README.md) this morning. I used one sentence from the [TUI page](https://hermes-agent.nousresearch.com/docs/user-guide/tui), as a boundary. I did not install a pet. I did not hatch one.

## Two keys, two folders

A skin is the CLI's look. The [skins page](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins) says skins control the visual presentation of the Hermes CLI: banner colors, spinner faces and verbs, response-box labels, branding text, and the tool activity prefix. Personality changes the tone. Skin changes the appearance. A custom skin is a YAML file under `~/.hermes/skins/`. The permanent key is `display.skin` in `~/.hermes/config.yaml`. `/skin` updates the current session. It does not stick unless you set that key.

A pet is a small mascot sprite. The [pets page](https://hermes-agent.nousresearch.com/docs/user-guide/features/pets) says it reacts to what the agent is doing, across the CLI, the TUI, and the desktop app. Pets come from the public [petdex gallery](https://github.com/crafter-station/petdex). They are cosmetic. They have no effect on prompt caching, tokens, or the agent's behavior. The feature is off by default. It stays dormant until you install a pet and select it.

Selecting writes `display.pet.slug` and `display.pet.enabled` in `config.yaml`. Nothing is stored as a secret or an env var. The folder is `<HERMES_HOME>/pets/<slug>/`, so a profile keeps its own set. That is not `~/.hermes/skins/`. The slash page lists `/skin` and `/pet` as different commands. Use the pet command for the sprite.

## Install through Hermes

The one-step the pets page prints is this:

```
hermes pets install boba --select
```

`boba` is the example slug on that page. Browse first if you want a different one.

```
hermes pets list
hermes pets list cat
```

`hermes pets list` browses the gallery. Add a substring to filter. `hermes pets list --installed` shows what is already on disk. Install can take `--select` and `--force`. `hermes pets select` with no slug opens a picker.

Preview with `hermes pets show`. Stop with Ctrl+C. Check with `hermes pets doctor`. Ready, on that page, means installed, selected, enabled, and Pillow importable. A pet only shows once one is installed and selected, with `enabled: true`.

Skip the gallery's npm installer. The pets page says that CLI installs to `~/.codex/pets`, and Hermes wants `hermes pets`. The README I read says `npx petdex install boba` should land in `~/.petdex/pets/boba/`, with `pet.json` and a spritesheet. Those two sentences name different folders. I did not run `npx`. The Hermes step is the Hermes command.

Inside a session, the pets page prints `/pet` to toggle the pet on and off. If none is active, that toggle adopts the first installed pet. `/pet <slug>` adopts a specific one. `/pet off` disables it. `/pet scale 0.5` resizes it everywhere. The list command is the one the two pages do not share. That disagreement is below.

## The turn, and the name the flag leaves out

The pets page says each surface maps the activity it already tracks to one of six animation states. The table is the map.

A tool or a turn that just failed is `failed`. A finished plan, all todos done, is `jump`. A clean finish is `wave`. A tool executing, or a turn in flight with no finer label, is `run`. Thinking or reading is `review`. Blocked on a clarify or approval prompt is `waiting`. On a legacy 8-row sheet, `waiting` falls back to `idle`. Nothing happening is `idle`.

The sentence says six. The `--state` flag on `hermes pets show` lists six: `idle`, `wave`, `run`, `failed`, `review`, `jump`. `waiting` is in the table and not in that flag list. If you preview a single state, use a name the flag prints.

The gallery README names nine rows: `idle`, `running-right`, `running-left`, `waving`, `jumping`, `failed`, `waiting`, `running`, and `review`. Hermes prints `wave`, `jump`, and `run`. The README prints `waving`, `jumping`, and `running`. I did not open a sheet, so I am not treating those as the same row.

In the terminal, Hermes renders the sprite at full fidelity on kitty, Ghostty, WezTerm, iTerm2, or sixel. Otherwise it falls back to truecolor Unicode half-blocks. Inside a pipe or a redirect there is no TTY, and terminal rendering is off on purpose.

`render_mode: off` is the other off switch. It drops the terminal sprite and keeps the pet on the desktop. The printed config is this:

```yaml
display:
  pet:
    enabled: false        # master on/off (true once you select a pet)
    slug: ""              # active pet; empty = first installed
    render_mode: auto      # auto | kitty | iterm | sixel | unicode | off
    scale: 0.33           # master size knob (relative to native 192x208 frames)
    unicode_cols: 0       # hard override for terminal width (0 = derive from scale)
```

`scale` is relative to native 192×208 frames. `hermes pets scale` and `/pet scale` clamp the factor to 0.1–3.0. The printed default is `0.33`. The same number does not look the same in half-blocks. That fallback has a legibility floor, so it cannot shrink as far as kitty or the GUI without turning to mush.

The rendering paragraph lists Ghostty and WezTerm beside kitty. The config enum has no `ghostty` value. The `--mode` flag lists `kitty`, `iterm`, `sixel`, `unicode`, and `auto`. I did not test a terminal. Use a mode the page prints.

## Leave hatch alone unless the backend can take a reference

Gallery install needs no image backend. Hatch does.

The pets page describes two steps. First, a handful of cheap, prompt-only drafts. You pick one, or remix. Then the chosen still is the reference. Hermes generates one grounded animation row per state, slices the frames, and packs an 8×9 grid of 192×208 cells. You keep that sheet. You could also `petdex submit` it.

The printed generation commands are `/hatch <description>` and the alias `/generate-pet`. The page also says `hermes pets` leads to the generate flow. It does not print a subcommand for that arrow. I will not invent one.

Reference-capable backends named on the pets page: Nous Portal, OpenRouter, OpenAI (`gpt-image-2`), and Krea. The printed order is Nous Portal, then OpenAI, then OpenRouter. `HERMES_PET_IMAGE_PROVIDER` overrides it. With no reference-capable backend, the error points at `hermes tools` and Image Generation.

The slash table's `/hatch` row names OpenRouter and Nous Portal. It does not name OpenAI or Krea. I did not generate. If you hatch, follow the pets page's backend list, not the shorter row.

The README's package is `pet.json` plus `spritesheet.webp` or `.png`. The grid is 8×9, or v2 8×11, and each cell is 192×208. That is the gallery's format. It is not the Hermes install step.

## On the desktop, it is still a pet

Cmd+K, then Pets. Or Settings, then Appearance. That screen has the gallery and a size slider. Both paths adopt, toggle, and resize the floating mascot. Size changes apply at once. Adopting a new pet lights it up within a moment.

The skins page also names Settings → Appearance. There, the desktop app lists CLI skins next to its own themes. I did not open that screen, so I am not describing how the two lists sit. The keys are already different. A skin pick is `display.skin`, or a session `/skin`. The pet pick is `display.pet`.

Roam is a separate toggle, and it starts off. When it is on, the pet wanders the window while the agent is idle. It runs only while the pet is in the window, active, and the agent is at rest. Any working or celebrating state takes over.

Hold Alt and scroll the wheel over the pet to resize it in place, in the window and on the pop-out. The scale is saved. Shift-click pops the pet into a transparent, always-on-top window. That overlay is a puppet. It carries no separate gateway, and it never appears in the dock or the app switcher. Drag moves it. A single click opens a mini composer for the most recent session. A double click toggles the app window. Shift-click again puts the pet back. The speech bubble (`working…`, `thinking…`, `your turn`) is pop-out only. In the window the pet stays quiet, because the app is the surface.

A kind sentence is a local match, not a model call. The page lists "good bot", "thank you", "ily", `<3`, and a heart emoji. Detection is a lexicon, matched on the message, with no model call. It fires on affection aimed at the agent, not on general cheer. Desktop gets floating hearts. CLI and TUI get a heart flash. I did not type one.

## The shorter row is not the feature

The pets page and the slash table do not agree about `/pet`.

The pets page says `/pet` toggles the pet on and off, and `/pet list` browses the gallery. In the TUI that list is a picker overlay. On the desktop it opens the Cmd+K pet palette.

The slash table says `/pet` toggles the pane, and `/pet list` shows installed pets. `/pet <slug>` adopts a specific one. That last clause matches.

I did not run the command. For a split the pets page actually prints, use the CLI. `hermes pets list` is the gallery. `hermes pets list --installed` is what is already installed.

The messaging notes on the slash page list `/pet` and `/hatch` among commands it calls CLI-only. That list follows the messaging command section. It does not say the TUI ignores `/pet`. The pets page still gives the TUI the overlay.

The pets page names the CLI, the TUI, and the desktop app. It does not name the web dashboard. The TUI page says the dashboard Chat tab spawns an embedded TUI. I did not open one. The chat being a TUI is not a claim that the sprite is in that pane.

Install the pet with `hermes pets`. The key is `display.pet`. The folder is `<HERMES_HOME>/pets/<slug>/`. The skin file is the other object. Leave hatch alone unless the image backend can take a reference.
