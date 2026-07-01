---
slug: google
title: Google
excerpt: Recent updates to Google's Gemini models, Vertex AI, and the Gemini API.
category: Model / API
tags:
  - Google
  - Gemini
  - Gemini 2.5
  - Vertex AI
  - changelog
last_updated: 2026-07-01
last_verified: 2026-07-01
---

# Google Changelog

## 2026-07

### Gemini 2.5 Flash pricing cut and context upgrade
Google reduced input pricing for Gemini 2.5 Flash and increased the default context window to 1.5M tokens for select API tiers. The move makes Flash a stronger default for high-volume agent workflows that previously defaulted to GPT-4o-mini or Claude Haiku.

### Vertex AI Agent Engine GA
Vertex AI Agent Engine reached general availability, giving enterprises a managed environment for building, deploying, and monitoring agent workflows on Gemini models with built-in tool use and grounding.

## 2026-06

### Gemini 2.0 models shut down
Google shut down the Gemini 2.0 Flash, Flash-001, Flash-Lite, and Flash-Lite-001 models on June 1, 2026. The recommended replacements are Gemini 3.5 Flash and Gemini 3.1 Flash-Lite. If you have older integrations, now is the time to migrate.

## 2026-05

### Gemini 2.5 Flash and Pro GA on Vertex AI
Gemini 2.5 Flash and Pro reached general availability on Vertex AI, with 2.5 Flash-Lite joining the lineup. Google emphasizes cost efficiency and lower latency for Flash-Lite, making it a candidate for high-volume agent workflows.

### SFT and enterprise features
Google added supervised fine-tuning (SFT) support and deeper enterprise controls on Vertex AI. This matters for teams that want to specialize a Gemini model on internal data without managing the training infrastructure themselves.

## What this means for users

Google's Gemini stack is maturing into a credible enterprise alternative to OpenAI and Anthropic. The shutdown of 2.0 models is a reminder that Google moves fast and does not keep legacy models alive indefinitely. If you are on Gemini, pin versions and monitor deprecation notices.

## What to watch

- Gemini 3.x pricing and whether Flash-Lite can undercut GPT-4o-mini and Claude Haiku.
- Multimodal capabilities and how they compare to OpenAI's image search.
- Enterprise adoption and whether Google can make Vertex AI feel as easy as the OpenAI API.

Source: [Gemini API changelog](https://ai.google.dev/gemini-api/docs/changelog.md.txt)
