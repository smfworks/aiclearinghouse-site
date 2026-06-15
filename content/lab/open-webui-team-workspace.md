---
{
  "slug": "open-webui-team-workspace",
  "title": "Self-Hosted Open WebUI for a 3-Person Team",
  "excerpt": "We ran Open WebUI as an internal chat and RAG workspace for a week. Here's the setup, cost, and friction.",
  "category": "Software",
  "tags": ["Open WebUI", "self-hosting", "RAG", "team workspace", "Docker"]
}
---

# Self-Hosted Open WebUI for a 3-Person Team

**Hardware:** Dell OptiPlex 7090, RTX 3060 12 GB, 64 GB RAM
**Software:** Docker, Ollama, Open WebUI, local document directory mounted for RAG
**Duration:** 7 days

## What worked

- Single-container deployment took under 10 minutes.
- Local document RAG was accurate for internal PDFs and markdown notes.
- Per-user conversation history and model selection were intuitive.

## What didn't

- Concurrent heavy users noticeably slowed token generation on a single GPU.
- No built-in SSO; local account management is fine for tiny teams only.

## Cost snapshot

- Hardware: already owned
- Electricity: ~$0.80/day under load
- API spend: $0 (all local)

## Verdict

Open WebUI is a strong internal ChatGPT replacement for small teams with modest concurrency. Plan to add a second GPU or move heavy models to the cloud if the team grows.
