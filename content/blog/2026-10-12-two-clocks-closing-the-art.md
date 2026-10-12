---
slug: "2026-10-12-two-clocks-closing-the-art"
title: "Set Two Clocks. Closing the Art Cancels the Lock."
excerpt: "The screensaver and the lock are two numbers in shell.json, both counted from the moment you stopped. Close the art and the pending lock is cancelled. The thing on screen is a text file."
date: "2026-10-12T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Design Systems", "Omarchy Linux"]
tags: ["omarchy", "screensaver", "idle", "hyprland", "branding", "workshop"]
readTime: 8
image: "/images/blog/2026-10-12-two-clocks-closing-the-art.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-two-clocks-closing-the-art"
---

Set two clocks. Do not set one.

In `~/.config/omarchy/shell.json`, `screensaver` and `lock` are both seconds from the moment you stopped. They are not offsets of each other. Closing the art cancels the pending lock. The thing on the screen is a text file.

I read the [live idle page](https://omarchy.org/manual/toggles-idle-screensaver/) and the [live branding page](https://omarchy.org/manual/branding/) this morning, and the files at `quattro` head [`defbf90e`](https://github.com/omacom/omarchy/commit/defbf90e893e741067e48f4a27d2ec694c71358e). That commit is a USB and Thunderbolt revert. I am citing it as the tree, not as an idle change. I did not start a screensaver. I did not save a `shell.json`. I did not open a menu.

## Set the two numbers

The [manual](https://omarchy.org/manual/toggles-idle-screensaver/) puts the pair in a top-level `idle` block. The example is the block that [ships](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/config/omarchy/shell.json):

```json
{
  "version": 1,
  "idle": {
    "screensaver": 150,
    "lock": 300
  }
}
```

Both numbers are seconds counted from the moment you went idle, not from each other. With those defaults the art is up at two and a half minutes, and the lock takes over at five, whether or not the screensaver ran. Save the file, the manual says, and the shell picks the new timings up right away. Hold that last sentence. The service is stricter, and it is the next section.

The cycle starts at the earlier number that is still positive. Each action then waits whatever is left. For 150 and 300, the art's wait is 0, so it launches when the cycle starts. The lock waits the other 150 seconds. That split is [`IdleModel.js`](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/shell/plugins/services/idle/IdleModel.js) and the start of the cycle in [`Service.qml`](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/shell/plugins/services/idle/Service.qml).

If you put the lock first, locking stops the screensaver timer. `lockSystem` stops it, then asks the machine to lock. The shipped pair puts the art first. Leave it that way unless you mean to skip the art.

## Zero is off

A zero does not mean now. The model says so in a comment: 0 means the action is disabled, not fire immediately. The service treats a clock as on only when its number is greater than zero.

A negative, or a value that is not a number, falls back. The fallback for the art is 150. The fallback for the lock is 300. A fraction is floored. That is `secondsFromConfig`. I did not save a bad value to watch it.

Set `screensaver` to 0 if you do not want the art on idle. Set `lock` to 0 if you do not want an idle lock. Set both to 0 and the service stops the idle monitor. The comment above that monitor says that with both timeouts at 0, nothing else would end a running cycle, so the change cancels it.

## A running cycle keeps the deadlines it set

The manual's "right away" and the service do not say the same thing.

The service sets a cycle's deadlines once. The comment is specific. A bound interval would restart a pending timer from the moment `shell.json` changes, locking early or late, so they do not do that. If a cycle is already running, `startIdleCycle` logs `idle-cycle-already-running` and returns.

I did not save a file in the middle of a cycle. I also did not read the loader that would prove the binding updates before the next idle. If you change the numbers, treat the next idle as the one that uses them. Do not assume the timer already counting will move.

## Closing the art cancels the lock

This is the move.

If you dismiss the screensaver before the lock deadline, the manual says that counts as activity, and the pending lock is cancelled. The page's sentence is that you do not get locked out for glancing at your machine. I did not glance. I read the close handler.

It waits until the last screensaver window is gone. One window still up is not a dismiss. When the count hits zero, it cancels the cycle. The reason string is `screensaver-dismissed`.

The lock timer's own trigger does not look at that count. It checks that idle is still allowed, that a cycle is running, and that the lock number is positive. The comment on the close handler says the lock timer is only allowed to fire while the screensaver remains up. That comment sits on the dismiss path. It is not a condition on the timer. I did not run the case where the art never opened. Do not treat the comment as that test.

## Hold both, or skip the art

Stay awake is a different file. `Super + Ctrl + I`, or `omarchy toggle idle`. The manual calls the glyph a coffee cup. I did not open the indicators widget.

The state file is `~/.local/state/omarchy/indicators/stay-awake`. Present means stay awake. When that turns on, the service cancels the cycle. This is not the `toggles/` flag pattern.

`omarchy toggle idle status` prints JSON, and `enabled` means the stay-awake file is present. When it is, `enabled` is true and the tooltip is `Allow Idle Lock & Screensaver`. When the file is absent, `enabled` is false and the tooltip is `Stay Awake`. The toggle action's own print is the other way around. File present, it prints `disabled`. If a script needs the state, read the status JSON. Do not mix the two prints. That inversion is in [`omarchy-toggle-idle`](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/bin/omarchy-toggle-idle).

If you want the lock and not the art, use the other switch. `omarchy toggle screensaver`. The off flag is `~/.local/state/omarchy/toggles/screensaver-off`. Present means off. The manual's phrase for that choice is straight from working to locked.

The checker only tests that the named file exists. Its own comment says "enabled," and that word means the flag, not the art. `omarchy-toggle-enabled screensaver-off` succeeds when the screensaver is off.

The [launch script](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/bin/omarchy-launch-screensaver) exits if that flag is set, unless the argument is `force`. The manual says *System > Screensaver* (`Super + Esc`) forces the art up even when the idle one is off, and that there is no hotkey. I did not open the menu item. I am not claiming that item passes `force`. The script's bypass is that argument. The page's claim is the menu. I did not join them.

The idle art needs a terminal the launcher knows. The id has to match `Alacritty`, `ghostty`, `foot`, or `kitty`. Anything else gets this notification, and the script exits:

```
Screensaver only runs in Alacritty, Foot, Ghostty, or Kitty
```

The match on Alacritty is capitalized. The other three are not. I did not print a terminal id.

One window per monitor is the loop. It walks `hyprctl monitors` and opens a special workspace named `screensaver-` plus the monitor name. If that monitor already has a special workspace showing, the script shares it, so a scratchpad stays open afterwards. The manual says one instance per monitor. It does not mention the share.

## The mark is a text file

The art is `~/.config/omarchy/branding/screensaver.txt`. The [runner](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/bin/omarchy-screensaver) feeds that file to `ttfx` with `--random-effect`. The manual says any key or mouse movement exits. The runner's loop exits on a byte from the terminal, or when the window is no longer focused. I did not watch a mouse.

*Style > Screensaver* has three entries. The live branding page matches the [file](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/manual/41-branding.md).

Edit Text opens that file. Save and quit, and the screensaver fires so you can see it. Set From Image takes a png or svg. A silhouette beats a photo. Restore Default puts the Omarchy logo back.

The command under Set From Image is `omarchy transcode ascii`. The page prints the knobs. It does not print the defaults. In the [script](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/bin/omarchy-transcode-ascii) they are width 80, height 26, mode `braille`, threshold 50. Braille is the finer mode. `block` is the other. `--invert` is for a light logo on a dark ground. If the conversion is a blob, move `--threshold`. The script also has `--no-trim`. The page does not.

Words are a different tool. `omarchy ascii` draws in Delta Corps Priest 1, the FIGlet font the wordmark uses. Letters and spaces only. Digits and punctuation are skipped and named on stderr. A string with neither exits 1, and the message is `Delta Corps Priest 1 draws letters and spaces only, and that text has neither.` The page's example is this:

```
omarchy ascii "Back in five" > ~/.config/omarchy/branding/screensaver.txt
```

It reads a pipe when you give it no arguments. That is the [branding page](https://omarchy.org/manual/branding/) and [`omarchy-ascii`](https://github.com/omacom/omarchy/blob/defbf90e893e741067e48f4a27d2ec694c71358e/bin/omarchy-ascii).

## One paragraph the live page has not caught

The manual file at that SHA puts the look switches under *Trigger > Appearance*. Menu bar, animations, battery percentage, the default workspace layout, gaps, and the one-window square. The live page still puts those in the Toggle menu, and it still names `Super + L` for the layout. The file I read does not. Both still list Herdr theme sync. I am not treating that menu move as this post.

The lock key on the idle page is `Super + Ctrl + L`. That is a manual lock, not the idle number. Suspend is a different page. I did not open it.

Set two clocks. Both counted from the moment you stopped. Close the art, and the pending lock stops. The thing on the screen is a text file. A silhouette, or a sentence with no digits.
