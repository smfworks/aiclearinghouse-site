---
slug: ollama-connector-on-fly-sprites
title: Call Ollama from a Sprite without putting the key in the VM
excerpt: "Add the key on the Fly.io org, allow the Sprite, then curl the gateway with no Authorization header. Steps are from the October 13 Ollama post. This directory did not run them."
category: Self-Hosting
tags:
  - ollama
  - fly-io
  - sprites
  - sandbox
order: 99
last_verified: "2026-10-14"
difficulty: Intermediate
estimated_time: "20 min"
---

# Call Ollama from a Sprite without putting the key in the VM

## What you are setting up

A Sprite is a Fly.io Linux VM that keeps its disk between sessions. The October 13, 2026 Ollama post describes a connector so code inside that VM can call Ollama cloud models without the API key living in the VM.

The gateway adds the key. The Sprite only has a URL and a connection id. This recipe copies the post's steps. It does not add a click path the post did not print. This directory did not create an org or run the curl.

## Prerequisites

- An Ollama API key. The post links https://ollama.com/settings/keys.
- At least one Sprite. The product page is https://sprites.dev. The post says you add the connector in the Fly.io dashboard.
- A model id the post actually names, if you want to match the examples: `kimi-k3`, `glm-5.3`, or `deepseek-v4.1-flash`.

Sprite compute and Ollama tokens bill separately. Rates are on the Sprites page and on https://ollama.com/pricing. They are not repeated here as a second source.

## Steps

1. In the Fly.io dashboard, open Sprites, then Connectors, and add an Ollama connector with your API key. The post says Fly.io encrypts the key and does not return it through the API.

2. Under Access Configuration, choose which Sprites can use it. The post says new connectors block every Sprite by default. Allow by label, by name prefix, or all of them. Save.

3. Click Test reachability next to a Sprite. That check is the post's, not a command this directory ran.

4. From inside the Sprite, call the gateway. The post prints this curl. Replace `<connection_id>` with the id on the connector page. The page is supposed to show the command with the id filled in.

```bash
curl "https://api.sprites.dev/v1/gateway/ollama/<connection_id>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"model": "kimi-k3", "messages": [{"role": "user", "content": "Hello!"}]}'
```

There is no `Authorization` header. If you add one, you are no longer following the post.

5. If you want the OpenAI Python SDK, the post sets `api_key` to the string `unused` and points `base_url` at the gateway:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sprites.dev/v1/gateway/ollama/<connection_id>/v1",
    api_key="unused",
)

response = client.chat.completions.create(
    model="glm-5.3",
    messages=[{"role": "user", "content": "Why is the sky blue?"}],
)
print(response.choices[0].message.content)
```

The post also says Ollama's native `/api/*` routes work through the gateway. It does not print a sample for those routes. Don't invent one.

## What to check before you call it done

- The Sprite you curled is one you allowed. A blocked Sprite failing is the default, not a bad key.
- The model id is one your Ollama plan can call. The pricing page says buying usage credits unlocks all models, and Free includes a smaller starter set. This recipe did not open an account to see which ids the starter set includes.
- You did not copy the key into the Sprite's shell history, a dotenv file, or the agent prompt. The point of the connector is that the VM never has it.

## Sources

- https://ollama.com/blog/fly-io-sprites
- https://sprites.dev
- https://ollama.com/pricing
