---
slug: "2026-10-31-paste-the-picture-leave-the-draw"
title: "Paste the Picture. Leave the Draw."
excerpt: "A clipboard that is only a picture is /paste in the CLI. The badge above the input is that picture. A new picture is text, hermes tools, and image_gen. In Desktop, drop the file on the chat."
date: "2026-10-31T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "vision", "clipboard", "paste", "workshop"]
readTime: 5
image: "/images/blog/2026-10-31-paste-the-picture-leave-the-draw.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-31-paste-the-picture-leave-the-draw"
---

If the clipboard is only a picture, type `/paste` and press Enter.

Hermes checks the clipboard for an image and attaches it. The [vision page](https://hermes-agent.nousresearch.com/docs/user-guide/features/vision) calls this the safest option when the terminal rewrites Cmd+V or Ctrl+V, or when you copied only an image and there is no bracketed-paste text to inspect. I read that page this morning, and the [same file on main](https://raw.githubusercontent.com/NousResearch/hermes-agent/main/website/docs/user-guide/features/vision.md).

The attach shows as a `[📎 Image #1]` badge above the input. More than one image means more than one badge. Ctrl+C clears the attached images. The page saves those files to `~/.hermes/images/` as PNGs with timestamped names.

## Check the session first

Before you install a clipboard tool, print the session type the page prints:

```
echo $XDG_SESSION_TYPE
```

`wayland` means Wayland. `x11` means X11. `tty` means no display server.

On a Wayland desktop the compatibility table marks both `/paste` and Cmd/Ctrl+V as yes. The note says it requires `wl-paste`, and the hint in that row is `apt install wl-clipboard`. The setup block under the table splits the package. Ubuntu and Debian get `apt`. Fedora gets `dnf`. Arch gets `sudo pacman -S wl-clipboard`. Use the block that matches the machine. The table's apt hint is not the Arch line.

## Keep the warning next to the table

Ctrl+V is a layered flow on the same page. Text paste comes first. Then a native clipboard or OSC52 text fallback, if the terminal did not deliver text cleanly. Then an image attach, when the clipboard or the pasted payload resolves to an image or an image path. The next sentence names macOS screenshot temp paths and `file://` image URIs. Those can attach immediately instead of sitting in the composer as raw text.

The warning under that flow stays. If the clipboard has only an image, and no text, the terminal still cannot send binary image bytes. Use `/paste`.

A later section says why. A terminal reads the clipboard for text, wraps it in bracketed paste, and sends that through the text stream. An image-only clipboard gives it nothing to send. There is no standard escape sequence for the bytes. Hermes calls `wl-paste`, or `xclip`, or the macOS and Windows tools, in a subprocess, instead of waiting for the terminal to hand over the picture.

Read those two places together. The Wayland row marks Ctrl+V yes once `wl-paste` is there. The warning still sends a bare image to `/paste`. The path the layered flow names is a macOS temp path or a `file://` URI.

Over SSH, clipboard image paste does not fully work. Those same tools read the clipboard of the machine they run on, which is the remote host. Save the file, get it onto that machine, and reference it by path. The vision page says a `/attach <filepath>` command is planned for a future release.

## A file you already have

On the [slash commands page](https://hermes-agent.nousresearch.com/docs/reference/slash-commands), `/paste` means "Attach a clipboard image." `/image <path>` means "Attach a local image file for your next prompt." The notes list puts both commands in the CLI-only sentence, with `/skin` and `/copy`. The `/paste` row itself does not say CLI-only. The notes are where it joins `/image`.

For a file already on the machine running Hermes, use `/image`. The vision page still calls `/attach` planned.

## Drop it in Desktop

In the desktop app, drop the file anywhere in the chat area. That attaches it to the next message. The [desktop guide](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) names that drop. It does not name `/paste`.

The 16 MiB line sits in the Webapp section. Browser-selected files and pasted or dropped images are staged under the active profile before the normal attachment flow, 16 MiB per file. On a plain-HTTP address that is not loopback, browsers turn off reading the clipboard. The parenthesis is "terminal paste, pasting an image," next to the microphone and notifications. `http://localhost` and `http://127.0.0.1` still count as secure. For that clipboard read, open the Webapp over HTTPS, or tunnel to `127.0.0.1`.

If Desktop closes before an image message is acknowledged, reopen the original chat. Restore image draft, the button above the composer, puts the saved text and the image attachment back together. Press Send yourself. It never sends automatically, and it does not replace a newer draft.

## Leave the draw on its page

A paste is a picture you already have. A new picture is the [image generation page](https://hermes-agent.nousresearch.com/docs/user-guide/features/image-generation). That page opens on text prompts, via FAL.ai. You pick the model in `hermes tools`. The choice is stored under `image_gen` in `config.yaml`. The page does not mention a clipboard, and it does not mention `/paste`.

A follow-up about a picture you already attached uses a second copy. The bytes come from `cache/documents/native-inputs/` in the profile. The vision page says nothing new is stored for that. `vision.replay_recent_images` defaults to 3. Set it to `0` and earlier images are not sent again. On the gateway, a chat attach older than the media-cache age, 24 hours, comes back as `[screenshot]`. The PNG path and that profile cache are both printed on the vision page.

A vision-capable model gets the pixels. A text-only model gets a `vision_analyze` description. The page says you do not configure that split. `agent.image_input_mode` defaults to `auto`. An explicit `auxiliary.vision` backend, a provider other than `auto`, or a model or `base_url`, selects the description path even when the main model can see.

Type `/paste` for the picture on the clipboard. Drop the file in Desktop. Leave the new picture on the generation page.
