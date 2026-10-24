---
slug: "2026-10-24-name-the-open-leave-the-switch"
title: "Name the Open. Leave the Switch Commented."
excerpt: "Window open is windowsIn, not the commented animations switch. Speed is deciseconds. The 0.56 page says curve in the signature and bezier in the examples. The file this compositor already took uses bezier."
date: "2026-10-24T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Omarchy", "Hyprland"]
tags: ["hyprland", "omarchy", "animations", "bezier", "windowsIn", "workshop"]
readTime: 8
image: "/images/blog/2026-10-24-name-the-open-leave-the-switch.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-24-name-the-open-leave-the-switch"
---

Name the leaf that opens the window. Leave the switch commented.

The comment in the user file turns animations off. It does not name a curve. Window open is `windowsIn`. On this machine that leaf is already set, and it points at a bezier.

I read the [0.56 animations page](https://wiki.hypr.land/0.56.0/Configuring/Advanced-and-Cool/Animations/) this morning. Last updated June 24, 2026. I also read the [core animations page](https://wiki.hypr.land/configuring/core/animations), last updated October 22, 2026, the [0.56 Variables page](https://wiki.hypr.land/0.56.0/Configuring/Basics/Variables/), the [unversioned Variables page](https://wiki.hypr.land/Configuring/Basics/Variables/), and the [0.54 animations page](https://wiki.hypr.land/0.54.0/Configuring/Animations/). I read the look files on this box. I ran `hyprctl version` and `hyprctl animations`. I did not reload Hyprland. I did not write a config. I did not send a spring, a `curve =` line, or the old keyword.

## Read the page for the line you are on

`hyprctl version` printed Hyprland 0.56.2, tag `v0.56.2`, commit `efb50993780079460b0cbed1363e2166a2de1d9f`, date Wed Aug 5 14:13:21 2026.

The short 0.56 animations URL is a 404.

https://wiki.hypr.land/0.56.0/Configuring/Animations/

A 0.56.2 animations URL is a 404 too.

https://wiki.hypr.land/0.56.2/Configuring/Advanced-and-Cool/Animations/

The page that exists says Hyprland 0.55 deprecated hyprlang in favor of lua, and points at the 0.54 wiki for the old syntax. The method it prints is `hl.animation()`.

If the snippet you are copying is the old syntax, say so. The 0.54 page, last updated October 29, 2025, is the keyword:

```
animation = NAME, ONOFF, SPEED, CURVE [,STYLE]
bezier = NAME, X0, Y0, X1, Y1
```

Speed is the same unit. No `hl.curve`. No spring. I did not send that keyword to 0.56.2. I am not calling it the syntax this box is running.

## The comment is a switch

`~/.config/hypr/looknfeel.lua` is comments. The animations block points at `https://wiki.hypr.land/Configuring/Basics/Variables/#animations` and shows this, commented:

```lua
hl.config({
  animations = {
    -- Disable all animations.
    enabled = false,
  },
})
```

That is the off switch. It does not name a leaf, a speed, or a curve.

The table behind that comment is two bools, on both Variables pages I fetched. `enabled`, default true. `workspace_wraparound`, default false. "More about Animations" links to the curves page. It is not a third syntax.

The 0.56 Variables page has `id="animations"`. The unversioned page the comment uses does not, in the HTML I fetched. I did not open a browser, so I am not calling the fragment a landing.

The Variables page also says each `hl.config()` updates just what you pass. This user file loads after Omarchy's defaults. Uncommenting that block is how you turn motion off. I did not uncomment it.

On this session, `hyprctl getoption animations:enabled` printed `bool: true` and `set: true`. `animations:workspace_wraparound` printed `bool: false` and `set: false`. I did not find `workspace_wraparound` in the installed look file. I am not calling that false a line Omarchy wrote.

The switch that is on lives in the package file:

```lua
animations = {
  enabled = true,
},
```

That is `/usr/share/omarchy/default/hypr/looknfeel.lua`. Leave the user-file block commented if you still want the open.

## Speed is deciseconds

The 0.56 page says speed is the amount of ds the animation takes. 1ds = 100ms. `speed = 1` is 100ms. A 4 is not four milliseconds. I did not time a window.

## Point the leaf at a bezier

The signature line on the 0.56 page says `curve = STRING`. The examples on that same page do not use `curve`. They pass `bezier = "my_epic_bezier"` or `spring = "my_epic_spring"`. One example sets `enabled = 0` on the fade leaf. The prose says `true` or `false`, and that a false leaf can omit the rest. The extras switch back to `curve = "default"` for `popin 80%`, `slidefade 20%`, and `slide left`.

Do not merge those into one key and call it tested. This session's running config uses `bezier =`. I did not send `curve =`.

The bezier form the page prints:

```lua
hl.curve(NAME, { type = "bezier", points = { {X0, Y0}, {X1, Y1} } })
```

The installed file names five curves that way, and points leaves at them with `bezier =`, not `curve =`. No spring. The comment above those curves points at the [unversioned Advanced-and-Cool page](https://wiki.hypr.land/Configuring/Advanced-and-Cool/Animations/), last updated August 26, 2026. That page still spells the spring `dampening`. The file does not set one.

`hyprctl animations` printed the names the file wrote. `easeOutQuint` came back as X0 0.23, Y0 1.00, X1 0.32, Y1 1.00. That is the points line in the file.

## The open is windowsIn

The animations are a tree. If a leaf is unset, it inherits its parent. On the 0.56 tree, window open is `windowsIn`, under `windows`. Styles for windows are slide, popin, gnomed. `windowsIn` uses the same styles.

The installed file sets the parent and the open as two lines:

```lua
hl.animation({ leaf = "windows", enabled = true, speed = 3.79, bezier = "easeOutQuint" })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 4.1, bezier = "easeOutQuint", style = "popin 87%" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 1.49, bezier = "linear", style = "popin 87%" })
```

`hyprctl` matched those three. `windows` had no style. `windowsIn` was overridden, enabled, speed 4.10, bezier `easeOutQuint`, style `popin 87%`. The file writes `4.1`. The printer added a zero. Same leaf.

The child is set. Changing `windows` does not replace it, because inheritance is for an unset leaf. That is the sentence on the page. I did not edit the file to watch it.

The page's popin extra is a minimum percentage. The example is `popin 80%`, on the `windows` leaf, with `curve = "default"`. This file uses `popin 87%` on `windowsIn`, with `bezier =`. I am not calling 87 a wiki default, and I am not calling those two lines the same key.

If you want a different open, change `windowsIn`. Not the parent. Not the commented switch. Keep the speed in deciseconds. A 4.1 on that page's rule is 410ms. I did not measure the frame.

## Workspace slides are off. The special workspace is not.

Same installed file:

```lua
hl.animation({ leaf = "workspaces", enabled = false })
hl.animation({ leaf = "specialWorkspace", enabled = true, speed = 3, bezier = "easeOutQuint", style = "slidevert" })
```

`hyprctl` printed `workspaces` enabled 0, bezier `default`, speed 1.00. The file did not write those last two. The page says a false leaf can omit the rest.

`specialWorkspace` sits under `workspaces` in the tree. Its styles are the same as workspaces, and that list includes `slidevert`. This leaf is set, so it does not inherit the disabled parent. `hyprctl` matched the line: enabled, speed 3.00, bezier `easeOutQuint`, style `slidevert`.

The raw file at quattro sha [`14987189695a8ae1f2270262fdf77446fafb1ba3`](https://github.com/omacom/omarchy/commit/14987189695a8ae1f2270262fdf77446fafb1ba3) disables `workspaces` and does not have a `specialWorkspace` line. Committer date 2026-10-11T06:20:45Z. Subject starts "Add a floating mode with titlebars." I fetched that [raw file](https://raw.githubusercontent.com/omacom/omarchy/14987189695a8ae1f2270262fdf77446fafb1ba3/default/hypr/looknfeel.lua). I did not load it. Do not copy it onto this desktop and call the motion the same.

## Do not merge the spring

The 0.56 page spells the field `dampening`:

```lua
hl.curve(NAME, { type = "spring", mass = MASS, stiffness = STIFF, dampening = DAMP })
```

More stiffness is more speed. More dampening is less bounce. It says to keep mass at 1 and adjust the other two. The rubber example on that page is `dampening = 10`.

The page the shipped comment cites, last updated August 26, 2026, spells it the same way. `dampening = DAMP`.

The core page, updated October 22, 2026, spells it `damping`. The rubber example there is `mass = 1, stiffness = 70, damping = 10`. The same page says you probably want damping around 0.6 to 0.8. I am not folding that range into the 0.56 page. That page does not print it. I am also not picking between 10 and 0.6. Both are printed on the core page. They are not the same number.

The core article does not print the 0.55 hyprlang note. The word shows up in the nav, as a toolkit name. That is not the deprecation sentence.

Omarchy does not set a spring. I did not send one. I do not know whether 0.56.2 reads `dampening` or `damping`. That is a question. It is not a step.

## Where the line already lives

`~/.config/hypr/hyprland.lua` loads Omarchy's defaults, then the user file. The comment says package updates can improve the defaults without rewriting the files under `~/.config/hypr`. `default/hypr/omarchy.lua` requires `default.hypr.looknfeel` before that user file is reached. The current theme file sets border colors. It does not set a leaf.

So the open you already have is the package line, not a comment you forgot to turn on. If a package update replaces that file, read `windowsIn` again before you assume the motion stayed. I did not write a second `windowsIn` into the user file, and I did not reload, so I am not calling a later call an override.

The comment is a switch. The open is a leaf. If the page says `curve` and the file says `bezier`, the file is what this compositor already took.
