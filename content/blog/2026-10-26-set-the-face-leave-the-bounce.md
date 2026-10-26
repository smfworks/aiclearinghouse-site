---
slug: "2026-10-26-set-the-face-leave-the-bounce"
title: "Set the Face. Leave the Bounce Beside It."
excerpt: "The blob follows the name. Lock face keeps it if you rename. The lean and the three dots belong to the geometric face, and only during a focused live turn. The pet bounces beside that face. It does not paint it."
date: "2026-10-26T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "Hermes AI", "Agent UI"]
tags: ["hermes", "bot-mode", "avatars", "pets", "workshop"]
readTime: 6
image: "/images/blog/2026-10-26-set-the-face-leave-the-bounce.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-26-set-the-face-leave-the-bounce"
---

Set the face in New Agent. Leave the bounce beside it.

Every Bot gets a face. The default is a blob, drawn from the name. Same name, same face. While you type a name in New Agent, the face follows. Hit Randomize to re-roll. Hit Lock face to keep the one you like even if the name changes. Or pin one silhouette and leave the rest to the name. The page names six: round, organic, boxy, nub, cloud, sun.

I read the [Bot Mode page](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode) this morning. I also read the [raw file on main](https://raw.githubusercontent.com/NousResearch/hermes-agent/main/website/docs/user-guide/bot-mode.md), the [August tag file](https://raw.githubusercontent.com/NousResearch/hermes-agent/v2026.8.19/website/docs/user-guide/bot-mode.md), the [pets page](https://hermes-agent.nousresearch.com/docs/user-guide/features/pets), the [profiles page](https://hermes-agent.nousresearch.com/docs/user-guide/profiles), and the [profile commands page](https://hermes-agent.nousresearch.com/docs/reference/profile-commands). I did not open Desktop. I did not run `hermes pets`. I did not create a Bot. I did not write a config.

## Want the lean? Use the geometric face

The live page calls geometric faces the classic 7 shapes × 10 colors. It counts them. It does not name them. During a focused live turn, the owning Bot leans and looks upward with three animated dots, then eases back to idle when the turn ends. Ownership includes the connection. A Bot with the same name on another gateway does not borrow the pose. A background worker keeps its own working animation. A photo, a blob, and a sigil keep their own rendering.

The word sigil appears once, in that sentence. The avatar list does not name a sigil type. I'm not defining it.

If the page in front of you says the geometric face has blinking eyes that scan while the Bot works, you are on the August tag. That file is `v2026.8.19`. It has no Voices section. The live page does not use the blinking sentence. Teach the lean.

The current file does not contain the word Unlock. Don't hunt for a button the page does not name.

## The bounce is beside the face

Upload a picture if you already have one. The page calls it any picture you like. Generate a portrait only when an image backend is configured. That generation rides the standard `image.generate` call, and it works over a local gateway and a remote one. The page does not name the config key. I'm not inventing one.

The pixel pet is not the face. The bot page says a companion from the petdex gallery bounces beside the avatar while the Bot is busy. The next step it prints is `hermes pets` in a terminal, to explore the gallery. The page does not say that command paints the avatar. The current bot page does not contain `display.pet`.

The pets page is a different page, and it prints a different object. It never says avatar. It never says beside. A pet there is a small mascot that reacts to what the agent is doing, across the CLI, the TUI, and the desktop app. It has no effect on prompt caching, tokens, or the agent's behavior. It stays off until you install one and select it. Selecting writes two keys in `config.yaml`: `display.pet.slug` and `display.pet.enabled`. A pet only shows once one is installed and selected, with `enabled: true`.

On the desktop, that page draws the pet as a floating sprite on a canvas. The control it names is Settings, then Appearance. Roam is a separate toggle on that same screen, and it starts off. When it is on, the pet wanders the window while the agent is idle. That wander is not the bounce the bot page puts beside the avatar.

I have not watched either surface. I'm not calling them the same sprite. Don't install a pet and wait for the roster face to change. The pages do not give the pet that job.

## Change the face on the Bot

Right-click the Bot and open Edit Profile. That reopens the avatar, the title, and the description. Those three live in the profile's metadata on the backend, so the same Bot appears the same way on every desktop connected to that backend. Duplicate copies the look, with the config, the skills, SOUL.md, and the memory.

The profiles page says a profile becomes a Bot when Bot Mode stores the roster presentation — title, avatar, section, and hidden state — and pins its canonical Bot Chat. A profile you only drive from the CLI, Docker, or a gateway, and never add to the roster, stays a plain profile.

`hermes profile create` is one of four rows on the parity table, next to chat, files, and routines. The table says everything has a terminal equivalent. It does not name the face. I searched the profile-commands page. No avatar. No Lock face. No `display.pet`.

A room can have its own picture. That picture is optional. You upload one, or you generate one when an image backend is configured, on the same pipeline as Bot avatars. It shows in the roster row in place of the default group glyph, and it leads the title in the room header. Changing a Bot's picture updates every room that Bot sits in. Two Bots with the same name on different connections never borrow each other's avatar.

## The voice is the other setting

A Bot speaks with its own profile's voice settings. The key is `tts.*` in that profile's `config.yaml`, on that Bot's own gateway. Read Aloud, auto-speak, and a voice conversation in a Bot chat — a split tile or the main pane — all go through that Bot's connection and profile. Two Bots with different voices sound different. Two Bots with the same profile name on different gateways never share a voice. A Bot profile with no `tts.*` of its own uses that profile's server defaults. Only a chat with no known owner, a plain session, uses the active profile's voice.

Speech-to-text in a Bot chat is the other way around. It still uses the active profile's STT settings. Don't set the voice on the window's active profile and wait for this Bot to change.

The August tag has no Voices section. The live page does.

Set the face while you name the Bot. Lock it if a rename should not redraw it. If you want the lean, pick a geometric face, and look at the owning Bot during a focused live turn. Leave the bounce beside it. If the sentence says blinking eyes, you are reading the August tag.
