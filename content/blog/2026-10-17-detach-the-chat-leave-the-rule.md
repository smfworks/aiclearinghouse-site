---
slug: "2026-10-17-detach-the-chat-leave-the-rule"
title: "Detach the Chat. Leave the Window Rule Alone."
excerpt: "Ctrl+Shift+H steps the app window aside and leaves the live conversation as a bar. On Hyprland, including Omarchy, Hermes pins that bar after it maps. A window rule is the wrong fix."
date: "2026-10-17T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "desktop", "hud", "hyprland", "omarchy", "wayland", "workshop"]
readTime: 5
image: "/images/blog/2026-10-17-detach-the-chat-leave-the-rule.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-17-detach-the-chat-leave-the-rule"
---

Detach the chat. Leave the window rule alone.

⌘/Ctrl+Shift+H steps the app window aside and leaves the conversation as a bar. On Hyprland, including Omarchy, Hermes pins that bar after the window maps. A rule you write to float it is the wrong fix.

I read the [desktop page](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) this morning, including the [HUD section](https://hermes-agent.nousresearch.com/docs/user-guide/desktop#hud-mode). The [docs source](https://raw.githubusercontent.com/NousResearch/hermes-agent/main/website/docs/user-guide/desktop.md) prints the same section, including the two-space indent on the YAML key. I did not open the bar. I did not write a window rule.

## Open the app you already have

If Hermes is already installed, run this:

```bash
hermes desktop
```

That uses the config, keys, sessions, and skills you already have.

The page splits the front ends at the top. Desktop is the native app. CLI and TUI are the terminal. The web dashboard is the browser panel, and its Chat tab embeds the TUI. They share state. You can start a session in one and resume it in another.

The HUD lives on the desktop page. It is not a dashboard theme, and it is not a CLI skin.

## The shortcut

The chord is ⌘/Ctrl+Shift+H. The titlebar button does the same thing. The chat detaches into a chrome-free, always-on-top floating bar that sits over whatever you are working in. The window steps aside. The bar keeps the live conversation and a composer.

There is a smaller composer on the same page, and it is not this. Quick Entry's default chord is Ctrl/Cmd+Shift+Space. You turn it on under Settings → Advanced → Quick Entry. That one fires a prompt without switching to the main window. The HUD is the session you are already in.

Park the bar where the work is. The page says the position tells Hermes which app and screen you are asking about, so "this", "here", and "that page" resolve to what is underneath. It does not name a window title, a screenshot, or an active window. Leave that as the page's word.

## On Wayland, drag the composer

Native Wayland will not let the app place its own window. The composer is a compositor drag handle, and it is the only way to move the bar.

Snap to pointer is ⌘/Ctrl+Shift+G. It is a global hotkey, and on other platforms it jumps the bar to the cursor. On native Wayland it is a no-op. The compositor owns placement.

Tap to summon is off by default, and it is saved only on this device. The control is Tap to summon HUD, under Settings → Keyboard Shortcuts → HUD gesture. Linux Wayland does not expose it. Keep the in-app shortcut. Where the tap exists, it opens or focuses the HUD. It does not close it, record audio, or send a message.

Resize from an edge or a corner. The opposite edge stays put. Native Wayland only exposes the right and bottom edges, because the compositor does not let an app position a top-level window itself. The discard control on the bar restores the default size. On X11, macOS, and Windows it also restores position. Use it if a saved size leaves the bar unusable.

macOS and Windows: press and hold anywhere on the composer, then drag. Linux/X11: hold Ctrl and drag with the primary button. Press-and-hold works there too. Keep the grab held while you hit the desktop-switch shortcut if you want the bar on another virtual desktop.

## Do not write the rule

On Hyprland, including Omarchy, the HUD is floated and pinned through the compositor's IPC after it maps. Without that pin, Hyprland tiles it like any other window, `always-on-top` is ignored, and compositor drag does nothing. No extra window rule is required.

Detach. Let the window map. Hermes pins it.

The page does not say an old tile rule loses, and it does not name the socket. The pin sentence sits in the Linux / Wayland section. It does not say the pin runs if you forced the XWayland hint. What it does say is that you do not add a rule to float this bar.

Snap stays a no-op on native Wayland. The pin sentence does not override that.

## The hint is for COSMIC

The compositor the page names is COSMIC, not Hyprland. A few compositors ignore `always-on-top` for native Wayland windows. COSMIC is the one it names. To restore pinning there, run the app under XWayland:

```yaml
desktop:
  ozone_platform_hint: x11
```

That bridges to `ELECTRON_OZONE_PLATFORM_HINT` at launch. An explicit env var still wins. The trade is a solid bar. X11 cannot restore a window that has ignored the mouse, so the HUD stays solid instead of click-through. Some KDE setups also report keyboard breakage with the X11 ozone backend. Leave the hint on `auto` unless you need always-on-top.

On a local Wayland session, if `XDG_SESSION_TYPE=wayland` or `WAYLAND_DISPLAY` is set, Hermes launches with `--ozone-platform=wayland` so Electron does not fall back to XWayland. The flag has to be on the command line before application JavaScript loads. An explicit `--ozone-platform`, the x11 hint above, or an ozone platform in `desktop.electron_flags` still wins. On that native path, drag, click-through, and resize work. The page does not draw the hit region.

## Come back

Exit is the button on the bar, the same shortcut again, or ⌘/Ctrl+W while the HUD has focus. The app window comes back in front, with the session, and the caret in its composer.

Detach with Ctrl+Shift+H. On Omarchy, leave the window rule alone.
