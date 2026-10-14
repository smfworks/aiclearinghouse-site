---
slug: fly-sprites
title: "Fly.io Sprites: the Ollama key stays on the org"
excerpt: "A Sprite is a persistent Linux VM. The October 13 Ollama post says the gateway adds your key. The Sprite only sees a URL and a connection id."
category: Infrastructure
tags:
  - sandbox
  - agents
  - ollama
  - fly-io
provider: Fly.io
pricing_model: Usage-based
price: "CPU $0.0385 / CPU-hour on the Sprites page fetched this run, plus Ollama token rates"
website: https://sprites.dev
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-10-14"
---

# Fly.io Sprites: the Ollama key stays on the org

## What it is

Sprites are Fly.io's persistent Linux computers for agents. The product page fetched this run says each one keeps its disk, checkpoints, answers on its own URL, sleeps when idle, and wakes with the filesystem where it was. Compute bills only while the Sprite is running. Warm and cold Sprites are not billed for compute.

This card is here because of a dated integration, not because the Sprites page printed a launch date. It did not. The new line is the Ollama connector, in an Ollama blog post dated October 13, 2026.

## When to use it

Use it when a coding agent needs a Linux machine that outlives one command, and you do not want that machine to hold an Ollama API key.

The October 13 post says Claude Code, Codex, and Gemini CLI are supported out of the box, and that Sprites can call Ollama cloud models through the connector. The examples it names are `kimi-k3`, `glm-5.3`, and `deepseek-v4.1-flash`. It also says Sprites ship a skill that tells Claude Code, Cursor, Codex, and Gemini CLI about Ollama, if the Sprite has access.

If you need a vendor to host a model you downloaded, this is the wrong row. The connector calls Ollama's cloud models. The Sprite does not become an Ollama server.

## What the connector actually does

You add the Ollama API key to the Fly.io organization. Fly.io encrypts it and does not return it through the API. When code inside a Sprite calls Ollama, the call goes to a Fly.io gateway. The gateway checks which Sprite is calling and adds the key. The Sprite knows a gateway URL and a connection id.

The post states three consequences. An agent in a Sprite can't leak the key. New connectors block every Sprite by default, and you allow access by label, by name prefix, or for all of them. Calls only work from inside a Sprite.

The curl in that post has no `Authorization` header. The Python example sets `api_key="unused"` and points `base_url` at `https://api.sprites.dev/v1/gateway/ollama/<connection_id>/v1`. The connector page is supposed to fill in the connection id. This directory did not create a Sprite or run that curl.

## Pricing reality

Two bills, and they are not the same invoice.

On https://sprites.dev, fetched this run, CPU time is $0.0385 per CPU-hour, memory is $0.021875 per GB-hour, hot storage is $0.000683 per GB-hour (about $0.50 per GB-month), and cold storage is $0.000027 per GB-hour (about $0.02 per GB-month). The sign-up line on that page says new organizations get $30 in trial credit. The same page prints two worked examples, which are Fly's arithmetic, not a measurement from this directory: a 4-hour coding session at $0.23, and a web app example at $1.05 per month. It also names a Hero plan at $100 per month with included hours, and says anything above the allowance bills at the standard rates. This run did not open https://fly.io/pricing.md, so that file is not a source here.

Ollama's pricing page, fetched the same run, bills cloud models per million tokens. For the three models the October 13 post names: `kimi-k3` is $3.00 input, $0.30 cached input, $15.00 output. `glm-5.3` is $1.40, $0.26, and $4.40. `deepseek-v4.1-flash` is $0.30, $0.006, and $1.20. The page says off-peak pricing applies outside 12:00 and 18:00 UTC on weekdays and all day on weekends. The off-peak row it prints for `deepseek-v4.1-flash` is $0.15, $0.003, and $0.60. It does not print off-peak rows for `kimi-k3` or `glm-5.3` in the table this run saved. Do not invent them.

Plan credits are separate from Sprite compute. Free includes starter credits and 1 concurrent request. Pro is $20 per month, or $200 per year, with $60 of usage credits and 3 concurrent requests. Max is $100 per month with $300 of credits and 10 concurrent requests. Team is $500 per month with $1,000 of shared credits. Those are Ollama account prices. They do not include the Sprite's CPU line.

## Honest limitations

- The Sprites marketing page did not date the product. Do not brief this as a launch week for Sprites. Brief the connector, which has a date.
- Access is deny-by-default. A Sprite you forgot to allow will not reach Ollama, and that is the documented behavior, not an outage.
- The key lives on the org. Anyone who can edit connectors on that org can point a Sprite at it. The post does not describe an audit log.
- This directory did not open the dashboard, did not run the test-reachability button, and did not confirm the skill file inside a Sprite.
- Ollama native `/api/*` routes work through the gateway too, according to the post. This run did not call them.

## Sources

- Ollama, October 13, 2026: https://ollama.com/blog/fly-io-sprites
- Sprites product page: https://sprites.dev
- Ollama pricing: https://ollama.com/pricing
