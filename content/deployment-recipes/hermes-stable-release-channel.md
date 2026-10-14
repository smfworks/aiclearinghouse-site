---
slug: hermes-stable-release-channel
title: Stay on Hermes release tags unless you mean main
excerpt: "v0.22.0 says source installs move from release to release by default. hermes update --set-channel main is the opt-in for every commit. Docker stable and latest move only when a release is published."
category: Agent Deployment
tags:
  - hermes
  - updates
  - docker
  - releases
order: 99
last_verified: "2026-10-14"
difficulty: Intermediate
estimated_time: "15 min"
---

# Stay on Hermes release tags unless you mean main

## What changed

Hermes Agent v0.22.0, release notes dated October 13, 2026, says source installs of the official repository now move from tested release to tested release instead of tracking every commit on `main`. The tag page fetched this run says the tag was released 14 Oct 03:21.

The notes say every release passes source CI, Docker, Nix, signed desktop builds, and install/upgrade runs on every OS before it is published. v0.21.6 and v0.21.7 were the first tags through that gate. This recipe is the channel switch. It is not a full install guide, and this directory did not run `hermes update` during the write.

## Stay on the release channel

If you already installed from the official repository and you did not set a channel, the notes say you are on the release channel. Do not pass a flag to "lock" it. Installer reruns keep the channel you chose.

An install that is already newer than the latest release stays where it is and waits for the next tag. Nothing is moved backward unless you ask. The notes say a move to an older release is labelled a rollback and never happens without asking.

Forks and mirrors keep following `main`. If your remote is not the official repository, the release-channel default does not apply to you.

## Opt into main

When you want every commit:

```bash
hermes update --set-channel main
```

The desktop switch is Settings → About. That is the path the notes print. They do not print a command that displays the current channel. This card will not invent one. Look at About, or at the flag you last set.

## Docker

The v0.22.0 notes say the `stable` and `latest` tags move only when a release is published. The v0.21.7 block on the same releases page names the image `nousresearch/hermes-agent:stable` (or `:latest`). Use the tag you mean. Do not assume `latest` is a git tip. On this release it is not.

The same notes say the Docker image uses a pinned Debian 13 base with full Chromium, and that baked-in extras return after a restart. They do not print a compose file. Don't copy one from an older recipe and call it current.

## After the update, read these four lines

They are upgrade notes from v0.22.0, not advice this directory invented.

- Managed installs use Python 3.14. The package manager installs it. KittenTTS is unavailable on 3.14.
- Windows desktop is MSIX-only and needs Windows 11 22H2 or newer. The macOS app is Apple Silicon only in default builds.
- One gateway per machine is the default. `hermes update` folds per-profile gateways into that multiplexed default when nothing conflicts.
- `sessions.auto_prune` now defaults to on. Ended sessions inactive for 90 days are deleted at startup. Pinned and open sessions are not touched. Set `sessions.auto_prune: false` if you need the old keep-everything behavior.

`hermes pm doctor`, `hermes pm status`, `hermes pm repair`, and `hermes pm gc` are the package-manager commands the notes name. Updates build a new environment and switch only after it passes its check.

## What this recipe leaves out

The same release documents one-click local models and names GPU backends. That is a different setup. It is not part of the channel switch, and this card does not walk it.

Termux, the notes say, moves to a signed APT package (`pkg upgrade hermes-agent`), and the docs still warn it is broken. Don't treat that package line as a green install.

## Sources

- https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0
