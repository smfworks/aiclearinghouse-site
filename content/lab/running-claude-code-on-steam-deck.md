---
{
  "slug": "running-claude-code-on-steam-deck",
  "title": "Running Claude Code on a Steam Deck",
  "excerpt": "An experiment in portable agent development: Anthropic's terminal agent on Valve's handheld.",
  "category": "Devices",
  "tags": ["Claude Code", "Steam Deck", "portable", "Linux", "experiment"]
}
---

# Running Claude Code on a Steam Deck

**Device:** Steam Deck LCD 512 GB
**OS:** SteamOS 3.x (Arch-based) with desktop mode
**Stack:** Claude Code, tmux, Neovim, Tailscale for remote repo access

## Why try this?

We wanted to see whether a handheld Linux device could serve as a viable mobile dev environment with an agent doing most of the typing.

## Setup notes

- Installed Node.js 20 via nvm.
- Anthropic API key stored in 1Password CLI.
- Used Tailscale to reach a home server for git remotes and Ollama fallback.

## Results

- On-screen keyboard is usable for prompts, not for coding.
- Battery life dropped to ~3 hours under constant agent usage.
- Surprisingly usable for quick reviews and small edits on the couch.

## Takeaway

The Steam Deck is a fun proof-of-concept for agentic mobility, but a proper laptop or docking station is still the practical choice.
