---
slug: hermes-voice-mode
title: "Hermes Voice Mode"
category: Communication
excerpt: "Real-time conversational voice with wake word support, mid-sentence interruption, and TTS output — hands-free agent interaction across CLI, TUI, and desktop."
tags:
  - hermes
  - voice
  - hands-free
  - accessibility
  - tts
for: Hermes Agent
author: Nous Research
install: "Built into Hermes Agent v0.20+ (no install required)"
dependencies:
  - Hermes Agent v0.20.0+
  - Microphone (for voice input)
  - "Optional: TTS provider configured"
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent
order: 99
last_verified: "2026-08-19"
---

# Hermes Voice Mode

## Overview

Voice Mode is a built-in feature shipped with Hermes Agent v0.20 ("The Herald Release," August 3, 2026). It enables real-time conversational voice interaction with your Hermes agent — the agent speaks while generating responses and can be interrupted mid-sentence. Combined with wake word support, this makes Hermes a hands-free assistant across the CLI, TUI, and desktop app.

## What it does

- **Real-time voice conversation**: Speak to Hermes naturally; it responds with synthesized speech while generating, not after
- **Mid-sentence interruption**: Cut the agent off if it is going in the wrong direction — no need to wait for it to finish
- **Wake word activation**: Say "hey hermes" (or any configured phrase) to start a fresh voice session without touching the keyboard
- **TTS output modes**: Choose when the agent speaks — only when you send voice, or for every message
- **Cross-platform**: Works in the CLI, TUI, and desktop app with consistent behavior

## Modes

| Mode | Command | Behavior |
|------|---------|----------|
| `off` | `/voice off` | Text only (default) |
| `voice_only` | `/voice on` | Speaks reply only when you send a voice message |
| `all` | `/voice tts` | Speaks reply to every message |

Voice mode setting is persisted across gateway restarts.

## Quick start

1. Update to Hermes Agent v0.20 or later
2. Ensure a microphone is connected and a TTS provider is configured
3. Toggle voice mode: `/voice on` for voice-only responses, or `/voice tts` for all responses
4. Set a wake word in your configuration to enable hands-free session start
5. Speak naturally — interrupt by speaking while the agent is talking

## Use cases

- **Hands-free coding**: Dictate changes, ask questions, and get spoken answers while your hands are on the keyboard doing other work
- **Accessibility**: Voice interaction for users who cannot or prefer not to type
- **Mobile or remote work**: Interact with your agent from across the room or while walking
- **Pair programming**: Have Hermes narrate its analysis while you review code
- **Meeting workflows**: Ask Hermes questions during a call without switching to the keyboard

## Limitations

- **Microphone required**: Voice input needs a working microphone; quality affects transcription accuracy
- **TTS provider dependency**: Natural-sounding speech requires a configured TTS provider — system TTS works but is less natural
- **Latency**: Real-time voice adds streaming latency; not suitable for latency-critical workflows
- **Noisy environments**: Background noise degrades wake word reliability and transcription quality
- **Privacy**: Voice data is sent to speech-to-text providers — review your provider's data policies

## Related

- [Hermes Agent Documentation: Voice Mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode)
- [Talk to Hermes](/skills/grounded-citations-researcher) — pairs well with voice for hands-free research