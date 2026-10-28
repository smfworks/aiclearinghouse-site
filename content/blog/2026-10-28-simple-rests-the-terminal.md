---
slug: "2026-10-28-simple-rests-the-terminal"
title: "Simple Rests the Terminal. The Chord Still Opens It."
excerpt: "Simple rests the terminal. It does not turn it off. Control plus the backtick still opens it. The page says the next launch is quiet again. Quote that chord from the source file. The rendered layout paragraph tears it."
date: "2026-10-28T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "desktop", "layout", "simple-mode", "workshop"]
readTime: 6
image: "/images/blog/2026-10-28-simple-rests-the-terminal.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-28-simple-rests-the-terminal"
---

Simple rests the terminal. It does not turn it off.

Open the layout editor from the titlebar, or with Command or Control, Shift, and backslash. It opens with an Interface mode choice. The same choice is under Settings, then Appearance, then Window & layout. In the command palette the item is named Simple mode. On Windows and Linux that palette is Ctrl+K or Ctrl+P. The page says this changes what is shown, not what Hermes can do.

I read the [desktop guide](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) this morning. I also read the [raw file on main](https://raw.githubusercontent.com/NousResearch/hermes-agent/main/website/docs/user-guide/desktop.md). I did not open Desktop. I did not switch Simple. I did not press the chords.

Advanced is the default. If you have not explicitly selected Simple, you are still in Advanced. Simple is chat-first. It rests the status bar, the profile rail, the terminal, the file browser and review panes, the technical tool-call view, inline code diffs, and the Artifacts and Scheduled jobs rows. The page writes the status bar as one word, statusbar. Capabilities and Messaging stay. The page says those two are how you set Hermes up. Thinking starts collapsed. Session rows show the title, a preview, and when they were last active. The titlebar keeps Settings and the layout editor. Simple's own picker offers Sidebar left or Sidebar right. The templates and saved layouts are Advanced.

## The chord still opens it

Don't treat a resting terminal as gone. The page says every keybind still works in Simple. These three open the terminal, the file browser, and review for the current session. Quote them from the source file:

```
Ctrl+`
Cmd/Ctrl+J
Cmd/Ctrl+G
```

Then the page says the next launch is quiet again. I did not relaunch. I'm not telling you whether the panes you opened rest again, or the chord itself goes quiet. The sentence puts the open and the quiet next to each other.

This morning the rendered page tore the chords in the layout paragraph. The backtick opened a code span, and the bold marks around the next chords came through as asterisks. The later sentence, the one that says every keybind still works, renders the chord cleanly. If the page in front of you looks torn, you are reading the layout paragraph, not a different shortcut.

A layout says what is on screen, not just where things sit. Applying one opens every pane it places and closes the ones it leaves resting, so those chords agree with what you see. Basic is sessions and chat. The terminal rests as a collapsed rail under the chat. The file browser and review rest in a right column. In that layout, Control plus the backtick opens the terminal under the chat, and Command or Control plus J opens the tree on the right. Focus keeps files and review as tabs behind the chat, with the same terminal rail. Default, Terminal deck, and Quad open everything they place. A layout you save remembers which of its panes were closed.

Three sentences use Command or Control plus J. One says it toggles the right sidebar. One says it opens the tree on the right. One says it opens the file browser. I'm not merging them. I did not press the chord.

The chord without Shift is a different move. Command or Control plus B toggles the left sidebar. Command or Control plus backslash swaps which side the sidebars sit on. The layout editor adds Shift. Don't mix those.

## Leave Advanced where it is

Each mode remembers its own arrangement. Pane positions, sizes, active tabs, hidden tabs, dismissals, collapsed sides, and floating-card positions. Returning to a mode restores that arrangement. It does not reapply a preset. Simple starts with the sidebar on the left. Moving it to the right does not change Advanced. Conversations, drafts, previews, and running work stay shared. Simple shadows your display preferences instead of overwriting them.

With more than one profile, the profile rail stays, because it is then the only way to switch. That sentence sits next to the one that lists the profile rail among the things Simple rests. Keep both.

On a first run, the layout you pick sets the mode. Basic starts in Simple. Elite starts in Advanced. Skipping leaves Advanced. Elite is in that sentence. It is not in the Basic, Focus, Default, Terminal deck, Quad list. I'm not adding it.

Existing layouts stay on upgrade. Advanced keeps the original storage keys. If you already explicitly selected Simple, its current layout is copied into Simple's separate storage. The originals are not deleted. An older arrangement that was overwritten before that separation cannot be reconstructed. I did not open either store.

Minimize to tray is the next heading, and the label is not the same string. Settings, then Appearance, then Window layout, then Minimize to tray. Not Window & layout. Off by default. This device only. With the setting on and a tray available, closing the main window with X or Alt+F4 hides it. It does not stop Hermes, and it does not destroy the session. Secondary windows still close. Show Hermes in the tray restores the hidden windows. Quit Hermes from the tray, and Command+Q, still quit, including the normal active-work confirmation. If the tray is unavailable, closing the main window behaves normally. On Linux the page requires a registered StatusNotifier host. A desktop without one keeps normal minimize. If the host disappears, hidden windows are restored. I did not check this session for that host.

The interface-mode section does not print a `config.yaml` key. I'm not handing Simple one. A later heading on the same page, Where your display preferences live, says saved layouts sit in `ui-preferences.json` at the root Hermes home, never in a profile folder. The default path it prints is `~/.hermes/ui-preferences.json`. It also says per-window state, including pane layout, is never written to that file. The interface-mode section does not say which of those this mode is. I'm not handing you that path as the switch.

The command palette item is named Simple mode. That section does not say whether the item toggles back to Advanced or only enters Simple. I did not press it.

Rest the pane. Leave the chord. The next launch is quiet again, and the page does not pick a reading for you.
