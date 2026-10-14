---
slug: allow-the-sprite-before-the-curl
title: "Allow the Sprite before you curl Ollama"
excerpt: "New Ollama connectors block every Sprite until you allow one. The October 13 post's curl has no Authorization header because the gateway adds the key."
category: Guides
tags:
  - ollama
  - sprites
  - secrets
  - agents
order: 99
last_verified: "2026-10-14"
---

# Allow the Sprite before you curl Ollama

A Sprite can call Ollama without holding your API key. Fly.io's gateway adds the key after it checks which Sprite is calling. New connectors block every Sprite until you allow one. The October 13, 2026 Ollama post prints the curl with no `Authorization` header. If your first test fails, check the allow list before you paste the key into the VM.

That is the whole decision. The rest is how the post says to make it.

## Do this before the curl

You need an Ollama API key and at least one Sprite. In the Fly.io dashboard, open Sprites, then Connectors, and add an Ollama connector with the key. Under Access Configuration, choose the Sprites that may use it. The post's three choices are by label, by name prefix, or all of them. Save. Then use Test reachability on the Sprite you intend to curl.

"All of them" is a real option. It is also the one that makes every current and future Sprite on that org a client of the key. If the org is shared, label or prefix is the narrower reading of the same control. The post does not rank them. You should, before you save.

## What the Sprite is allowed to know

The post says the Sprite knows a gateway URL and a connection id. The curl host is `https://api.sprites.dev/v1/gateway/ollama/<connection_id>/v1/chat/completions`. The Python example sets `api_key="unused"`. Calls only work from inside a Sprite. An agent that copies the key into a prompt, a dotenv, or shell history has left the design.

The connector page is supposed to show the curl with your connection id filled in. Copy that. Don't rebuild the URL from memory and then debug a 404 you typed.

## What a failure means

This directory did not run the curl, so this is the post's logic, not a log.

- No allow rule: the connector blocks the Sprite. That is the default for a new connector, not a revoked key.
- Curl from your laptop: the post says calls only work from inside a Sprite. A laptop test does not tell you the connector is down.
- An `Authorization` header you added yourself: you are no longer on the documented path. Remove it before you conclude the gateway is broken.
- Wrong model id: the post's examples are `kimi-k3`, `glm-5.3`, and `deepseek-v4.1-flash`. A different id may be a plan limit. The pricing page says Free includes a starter set, and buying usage credits unlocks all models. It does not list the starter ids on the page this run saved.

Reachability passing and a chat completion failing are different checks. The button does not prove the model id is on your plan.

## What not to add

Don't put the Ollama key in the agent's skill file, even if Sprites ship a skill that mentions Ollama. The post says that skill tells Claude Code, Cursor, Codex, and Gemini CLI about Ollama when the Sprite has access. It does not say the skill contains the key. This directory did not open that skill.

Don't treat Sprite CPU price and Ollama token price as one number. They are two vendors. Rates are on https://sprites.dev and https://ollama.com/pricing.

## Sources

- https://ollama.com/blog/fly-io-sprites
- https://sprites.dev
- https://ollama.com/pricing
