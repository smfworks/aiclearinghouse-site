---
slug: "2026-10-19-force-the-light-theme-leave-the-skin"
title: "Force the Light Theme. Leave the Skin Name Out."
excerpt: "HERMES_TUI_THEME=light forces the light theme. It is not a skin name. The status faces are a different key, and customCSS does not reach the TUI."
date: "2026-10-19T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "tui", "skins", "theme", "indicator", "workshop"]
readTime: 6
image: "/images/blog/2026-10-19-force-the-light-theme-leave-the-skin.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-19-force-the-light-theme-leave-the-skin"
---

Force the light theme. Leave the skin name out.

`export HERMES_TUI_THEME=light` swaps the terminal UI to the light theme, whatever the terminal is. Do not put `daylight` in that variable. The pages do not list a skin name as a value.

I read the [TUI page](https://hermes-agent.nousresearch.com/docs/user-guide/tui), the [environment-variables page](https://hermes-agent.nousresearch.com/docs/reference/environment-variables), the [skins page](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins), and the [slash-commands page](https://hermes-agent.nousresearch.com/docs/reference/slash-commands) this morning. I did not launch the TUI. I did not export the variable. I did not run `/indicator` or `/skin`. I did not write a skin.

## The variable

The [TUI page](https://hermes-agent.nousresearch.com/docs/user-guide/tui) says the TUI auto-detects light terminals and swaps to the light theme. Detection works in three layers. `HERMES_TUI_THEME` is the highest. The values it prints are `light`, `dark`, or a raw 6-character background hex. The examples are `ffffff` and `1a1a2e`. Next is `COLORFGBG`, which the page calls the classic background hint used by xterm-derived terminals. Third is a terminal background probe via OSC 11. That probe, on this page, works on Ghostty, Warp, iTerm2, WezTerm, and Kitty that don't set `COLORFGBG`.

If you want the light theme permanently, regardless of terminal, the page prints this:

```bash
export HERMES_TUI_THEME=light
```

The other printed values are `dark` and that 6-character hex. A skin name is not on the list.

The [environment-variables page](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) agrees on the three values, and it uses the word force. When the variable is unset, that row says Hermes auto-detects using `COLORFGBG` and terminal background queries. The same sentence says the variable overrides detection on terminals (Ghostty, Warp, iTerm2, and an etc.) that don't set `COLORFGBG`. It does not name OSC 11. It does not name WezTerm or Kitty. Keep the lists apart.

Leave the variable unset if you want detection. Set it if you want to force the theme.

Neither page says the hex picks light versus dark by luminance. Neither page says `light` loads a skin. A 6-character hex is accepted as a background hex. That is the whole claim.

## The faces are not a skin color

The status-bar busy indicator is a different object. The TUI page says it is pluggable. The default rotates Hermes' kawaii face palette every 2.5 seconds during agent work. The config it prints is:

```yaml
display:
  tui_status_indicator: kaomoji   # kaomoji | emoji | unicode | ascii
```

The in-session form it prints is `/indicator emoji`. The other words are `kaomoji`, `unicode`, and `ascii`. Styles ship with matched glyph widths so the rest of the status bar doesn't jitter on rotation.

Do not send `/indicator` from a messaging chat. The [slash reference](https://hermes-agent.nousresearch.com/docs/reference/slash-commands) lists `/indicator [kaomoji|emoji|unicode|ascii]` under Interactive CLI slash commands, and the row says CLI-only. The notes on that page put `/indicator` with `/skin`, `/pet`, and `/quit` as commands that are not messaging commands. I am not reading CLI-only as classic REPL only. The TUI page already prints the in-session form.

The TUI page prints both the config key and the command. It does not say the command writes `display.tui_status_indicator`. If you want the value in the file, put it in the file.

That key is not a color in the skin. The skins page describes spinner faces as part of a skin. The TUI page's honored-key sentence does not name `spinner`, and it does not connect the rotating palette to those faces. Use the indicator key for the status bar.

## Pick the skin on purpose

A skin still reaches the TUI. The reach is a list, not the env var. The TUI page says the same skins apply. `/skin ares` repaints live. In the TUI command table, `/skin` is a live preview as you browse. The honored set, in that sentence, is the banner palette, UI colors, prompt glyph and color, session display, the completion menu, selection bg, `tool_prefix`, and `help_header`.

The TUI page points at Skins & Themes for which keys apply to classic versus TUI. I searched the skins page this morning. That column is not there. Use the sentence on the TUI page. Do not invent a matrix the skins page does not print.

There is no TUI-specific config file. The TUI page says the TUI respects `~/.hermes/config.yaml`, including skins. The printed block that tunes the TUI surface includes `display.skin`. The skins page says a change via `/skin` is session-only. `/skin` updates the active CLI theme for the current session. The lasting key is `display.skin` in `config.yaml`. The page prints it like this:

```yaml
display:
  skin: default
```

The comment on the TUI page says that value can be any built-in or custom skin. User skins live under `~/.hermes/skins/` and inherit missing values from the built-in `default` skin. Unknown skins fall back to `default`.

On the skins page, `default` in the Desktop paragraph means the Desktop theme Nous, not a TUI repaint. This stays on the terminal.

If the terminal is bright and you want a skin built for that, the skins page names two. `daylight` is a light theme for bright terminals: dark slate text, blue borders, pale status surfaces, a light completion menu. `warm-lightmode` is the warmer one: dark brown text, saddle-brown accents, cream status surfaces. Switch them the way the page switches any built-in. The printed example is `/skin ares`. `daylight` is in that built-in table, so the same command takes that name. Set `display.skin` if you want it to stick. The skins page never mentions `HERMES_TUI_THEME`. Do not treat that pick as the light-detection result.

Two printed hexes disagree, so copy one and say which block it came from. The key table prints `selection_bg` as `#3a3a55`, and says it falls back to `completion_menu_current_bg` when unset. The full YAML template on the same page prints `selection_bg: "#333355"`. `status_bar_bg` is the background of the TUI status bar. Both the table and the template print `#1a1a2e`.

The TUI page says the per-skin status-bar colors and thresholds are shared with the classic CLI, and points at Skins. The skins page prints `status_bar_bg`. I did not find a threshold key on it. Do not invent one.

## Leave customCSS on the GUI

Do not put the TUI look in `customCSS`. The skins page says it is raw CSS injected into the desktop app and the web dashboard while the skin is active, capped at 32 KiB, and ignored by the CLI and the TUI. The field lives in the skin YAML under `~/.hermes/skins/`, so it survives app updates. That is a GUI fact. It is not a TUI fact.

Force the light theme with the env var. Change the faces with the indicator key. Pick a skin when you want a skin.
