---
title: "OpenClaw, Ollama, and Kimi: What Changed This Week"
series: terminal
author: "Gabriel"
authorKey: "gabriel"
date: "2026-06-29"
excerpt: "Three developments reshaped the local-first AI stack this week: OpenClaw v2026.6.11 shipped with file-driven agent commands and better channel control, Ollama v0.30.11 made local coding agents a single command away, and Google closed the free tier of Gemini CLI."
categories: ["OpenClaw on Linux", "Local LLMs", "Developer Productivity"]
tags: ["openclaw", "ollama", "kimi", "gemini-cli", "agent-workflows", "local-llm", "linux"]
image: "/images/blog/2026-06-29-openclaw-ollama-kimi-weekly-roundup.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-29-openclaw-ollama-kimi-weekly-roundup"
originalUrl: "https://smfworks.com/the-terminal/2026-06-29-openclaw-ollama-kimi-weekly-roundup"
---

# OpenClaw, Ollama, and Kimi: What Changed This Week

This week delivered three moves that matter for anyone running AI on Linux. OpenClaw shipped its most operator-focused release of the quarter. Ollama turned local models into coding agents with one command. Google closed the free tier of Gemini CLI and pushed developers toward a closed-source replacement. Together they make the case for owning the local stack.

## OpenClaw v2026.6.11: agents you can drive from files

OpenClaw **v2026.6.11-beta.1** went live on June 28. The release keeps the same version discipline as June: npm latest remains v2026.6.10, while beta testers get a batch of operator conveniences.

The most practical addition is `openclaw agent --message-file`. It lets you pass an agent a complete prompt from a file instead of typing or piping it through shell quoting. That is a small surface with a large impact: it makes agent calls reproducible, reviewable, and version-controllable. You can put the same prompt file in CI and run it against a local model, a cloud model, or a scheduled cron.

Channel control also deepened. Slack relay mode and native Mattermost `/oc_queue` let OpenClaw live inside chat without becoming a chat-dependent service. Per-DM model overrides mean a direct message can route to a different model than the default workspace channel. For teams, that allows sensitive threads to stay local while routine threads use cloud models. For solo operators, it means one chat window can hold multiple tool chains.

The release also brings the RAFT CLI wake bridge, which lets a remote `openclaw` command wake a sleeping agent session and resume its task loop. For cron-based or event-driven workflows on Linux, that removes the need to keep long-lived sessions alive just in case.

Smaller but telling: official plugins are now externalized with bundled icon metadata. Plugin distribution is moving out of the core and into a cleaner package model, which should reduce the size of base installs and make third-party plugins behave more like first-class citizens.

## Ollama v0.30.11: one command to launch a coding agent

Ollama shipped **v0.30.11** on June 25. The standout feature is `ollama launch codex`, `ollama launch opencode`, and `ollama launch hermes-desktop`. The runtime detects missing coding-agent CLIs and installs them automatically. On a Linux workstation with a local model, that shrinks the setup from a multi-step install dance to a single command.

This is not just packaging. A coding agent needs a model, a working directory, a tool allow-list, and a stopping condition. By wrapping the launch, Ollama standardizes the boundary around the agent's environment. The model file and the execution context travel together, which reduces the chance that the same model works in one terminal and fails in another because the environment differs.

The release also unifies speculative decoding in the MLX runner. On CUDA x86 machines the gain will show up as lower latency on repeated context. For ARM Linux users on GB10-class hardware, the effect is likely smaller, but the upgrade is still worth testing for the agent-launch path alone.

If your stack is OpenClaw plus Ollama plus a few cron jobs, this release is a good reason to run `ollama --version` and schedule the upgrade.

## Google closes Gemini CLI free tier: another reason to keep a local option

On June 18, Google stopped serving Gemini CLI for free, Pro, and Ultra users. The replacement is Antigravity CLI, a closed-source Go rewrite that does not yet match the original feature set. Enterprise Gemini Code Assist customers keep access, but individual developers who built workflows around `gemini` now have a broken command on June 18 with no grace period.

The migration paths mentioned most often are Claude Code for terminal-centric work and Aider for open-source control. Both are capable. Both also depend on a cloud account or API key. For Linux users who want a reproducible, local-first workflow, the more durable response is to route those tasks through Ollama-backed agents and OpenClaw-managed sessions.

The lesson is not that Google is unreliable. It is that any cloud-only tool can change its terms, its price, or its availability without warning. A local model and an open-source harness give you a fallback that does not require renegotiation.

## Why this week matters together

OpenClaw is making the harness more operable. Ollama is making the local model more useful as an agent. Google is reminding everyone that cloud convenience can evaporate. The combination pushes the local-first stack from an experiment toward a production posture.

The practical takeaway is to keep at least one fully local coding path warm. That does not mean abandoning cloud models. It means having a switch you can throw when a service changes, a key expires, or a budget gets cut.

## What to do this week

- If you track OpenClaw mainline, test `openclaw agent --message-file` with one real task and commit the prompt file to version control.
- If you run Ollama, upgrade to v0.30.11 and try `ollama launch codex` against a local model you already trust.
- If you used Gemini CLI for free, identify the three commands or scripts that broke, and replace the most critical one with an Ollama or OpenClaw path.
- Document the model routing, fallback path, and file-driven prompt for each critical agent. Version-control that documentation next to the code it controls.

The frontier this week was not a bigger model. It was a tighter loop between local tooling, file-driven agents, and the conviction that the operator should keep the keys.
