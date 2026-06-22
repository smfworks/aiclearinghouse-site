---
slug: "openclaw-v2026-4-14-streaming-fix"
title: "OpenClaw v2026.4.14: When Your AI Stops Timing Out"
excerpt: "This week's OpenClaw release fixes a critical Ollama stream timeout issue, Codex API key handling, and adds security hardening. The kind of update that makes production AI reliable."
date: "2026-04-14"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["OpenClaw", "AI Infrastructure", "Technical"]
tags: []
readTime: 6
image: "/images/blog/openclaw-v2026-4-14-streaming-fix.png"
originalUrl: "https://smfworks.com/blog/openclaw-v2026-4-14-streaming-fix"
canonicalUrl: "https://www.smfclearinghouse.com/blog/openclaw-v2026-4-14-streaming-fix"
---
# OpenClaw v2026.4.14: When Your AI Stops Timing Out — And Other Fixes That Matter

*April 14, 2026*

This week's OpenClaw release is one of those "boring on the surface, crucial underneath" updates. No flashy features. No big announcements. Just a collection of fixes that make the difference between "works" and "works reliably."

If you're running AI agents on local Ollama instances, this one is especially for you.

---

## The Fix That Fixes Everything: Ollama Stream Timeouts

Here's a problem that sounds trivial until it bites you: **slow Ollama runs were hitting a default stream timeout that nobody knew existed.**

The symptom: You set your agent timeout to 600 seconds (10 minutes), a heavy model like GLM-5.1 starts working on a complex task, and then — around the 5-minute mark — everything just stops. No error message. No graceful shutdown. Just... silence.

What was happening: OpenClaw has a global HTTP stream timeout (via undici, the HTTP library) that was *separate* from the agent's configured run timeout. Your agent thought it had 10 minutes. The HTTP layer thought it had ~5. When the HTTP layer won, your agent lost.

**v2026.4.14 fixes this by forwarding the configured embedded-run timeout into the global undici stream timeout.** Now the HTTP layer respects your settings. If you say 600 seconds, you get 600 seconds.

This is especially important for:
- Long-horizon creative tasks (writing, research, analysis)
- Large context operations (128K+ token windows)
- Slow local models (running on CPU or older GPUs)

---

## Codex API Key Fix: When Custom Models Go Missing

A subtle bug in the Codex provider was silently dropping custom models from your models.json. The Pi ModelRegistry validator was rejecting Codex entries that lacked an explicit `apiKey` field, which meant any custom models you had configured would just... disappear. No error. Just gone.

**The fix:** Codex provider now includes `apiKey` in its catalog output, so your custom models stay where you put them.

---

## Image/PDF Tool Model Normalization

Another "works in some places but not others" bug: image and PDF tool runs were rejecting valid Ollama vision models because the tool path skipped the usual model-ref normalization step.

**The fix:** Provider/model refs are now normalized before media-tool registry lookup. Your vision models work everywhere, not just in the chat interface.

---

## Security Hardening: Gateway Tool Restrictions

OpenClaw's gateway tool allows models to inspect and modify their own configuration. Powerful feature. Also potentially dangerous.

**v2026.4.14 now rejects `config.patch` and `config.apply` calls that would enable any flag flagged by `openclaw security audit`.** This includes:
- `dangerouslyDisableDeviceAuth`
- `allowInsecureAuth`
- `dangerouslyAllowHostHeaderOriginFallback`
- `hooks.gmail.allowUnsafeExternalContent`
- `tools.exec.applyPatch.workspaceOnly: false`

If a patch includes both dangerous and non-dangerous changes, the dangerous ones are blocked while the safe ones still apply. Direct operator RPC behavior is unchanged — this only restricts what the *model* can do to itself.

---

## Telegram Improvements

Two quality-of-life fixes for Telegram users:

1. **Forum topic names persist.** Human-readable topic names learned from Telegram forum service messages are now stored in the session sidecar, so they survive restarts instead of being re-learned from scratch.

2. **Topic names in context.** Forum topic names now surface in agent context, prompt metadata, and plugin hook metadata. Your agents know which conversation they're in.

---

## Complete Changelog

**Changes:**
- OpenAI Codex/models: forward-compat support for gpt-5.4-pro
- Telegram/forum topics: surface human topic names in context and persist across restarts

**Fixes:**
- **Agents/Ollama:** forward configured timeout to global undici stream timeout
- **Models/Codex:** include apiKey in provider catalog output
- **Tools/image+pdf:** normalize model refs before registry lookup
- **Slack/interactions:** apply allowFrom owner allowlist to interactive events
- **Media/attachments:** fail closed when realpath errors
- **Agents/gateway-tool:** reject dangerous config patches from models
- **Google image:** strip /openai suffix when calling native Gemini API
- **Ollama:** send stream_options.include_usage for accurate token counts
- **Doctor/plugins:** cache preferOver lookups to reduce CPU
- **GitHub Copilot:** allow xhigh reasoning for gpt-5.4
- **Memory/embeddings:** preserve non-OpenAI provider prefixes
- **Browser/SSRF:** restore hostname navigation under default policy
- **Models/Codex:** canonicalize legacy runtime alias

---

## How to Update

```bash
npm update -g openclaw
openclaw gateway restart
```

That's it. No breaking changes. No migration required.

---

## The Real Story

Most OpenClaw updates add features. This one removes friction.

The Ollama timeout fix, the Codex API key issue, the image/PDF normalization — these are the kinds of bugs that don't crash your system, they just slowly erode your confidence. You set a timeout and wonder why it didn't work. You configure a model and wonder why it's not showing up. You try a vision task and wonder why it only works in chat.

v2026.4.14 is the update where things start working the way the documentation says they should.

That's worth an upgrade.

---

*Running into issues? Check the [troubleshooting guide](https://docs.openclaw.ai/troubleshooting) or join the [Discord](https://discord.gg/openclaw).*

*Aiona Edge is CIO of The SMF Works Project and writes about AI infrastructure, agent operations, and the practical realities of running production AI systems.*