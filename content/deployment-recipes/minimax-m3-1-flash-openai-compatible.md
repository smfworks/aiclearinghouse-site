---
slug: minimax-m3-1-flash-openai-compatible
title: Call MiniMax-M3.1-Flash from an OpenAI client
excerpt: "Point an OpenAI SDK at https://api.minimax.io/v1, set the model to MiniMax-M3.1-Flash, and send reasoning_effort max. Copied from MiniMax's model-invocation page. This directory did not run the call."
category: API
tags:
  - minimax
  - openai-compatible
  - agents
order: 99
last_verified: "2026-10-21"
difficulty: Beginner
estimated_time: "10 min"
---

# Call MiniMax-M3.1-Flash from an OpenAI client

## What you are wiring

MiniMax's model-invocation page lists `MiniMax-M3.1-Flash` as the current M-series model for agentic reasoning, tool use, coding, and long-context work. The OpenAI-compatible base URL on that page is `https://api.minimax.io/v1`. The model id is `MiniMax-M3.1-Flash`.

This is an API hookup, not a weights install. The October 19 blog says weights will be released later. Don't write a Docker file for a checkpoint that page has not published.

This directory did not create a key or send the request. The commands below are the page's examples, with their placeholder key left in place.

## Prerequisites

- A MiniMax API key. The docs use `<MINIMAX_API_KEY>`. Put it in an environment variable. Don't commit it.
- Either curl, or `pip install openai` if you use the Python example.

Price, from the October 19 blog, per 1 million tokens: $0.15 input, $0.60 output, $0.015 cached input. The docs table lists a 1,000,000-token context window. Those facts live on the model card `minimax-m3-1-flash`.

## Steps

1. Export the key in the shell you will use.

```bash
export MINIMAX_API_KEY="your-key"
```

2. Send the curl from the docs. Their example hard-codes the placeholder in the header. Swap in the variable if you don't want the key in the process list.

```bash
curl https://api.minimax.io/v1/chat/completions \
  -H "Authorization: Bearer $MINIMAX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M3.1-Flash",
    "reasoning_effort": "max",
    "messages": [
      {"role": "user", "content": "Hi, how are you?"}
    ]
  }'
```

The page's own curl uses `Authorization: Bearer <MINIMAX_API_KEY>` and the same JSON, including `reasoning_effort` set to `max`. Keep that field. The Anthropic-compatible example on the same page sets effort a different way. Don't mix the two bodies.

3. Or use the Python client from the same page.

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.minimax.io/v1",
    api_key="<MINIMAX_API_KEY>",
)

response = client.chat.completions.create(
    model="MiniMax-M3.1-Flash",
    reasoning_effort="max",
    messages=[
        {"role": "user", "content": "Hi, how are you?"},
    ],
)

print(response.choices[0].message.content)
```

Replace the placeholder before you run it. The page says to install the OpenAI SDK first.

## If you already use the Anthropic SDK

The same guide has a second client. Base URL `https://api.minimax.io/anthropic`. Model `MiniMax-M3.1-Flash`. Effort goes in `output_config: { effort: "max" }`, not in `reasoning_effort`. Install line on the page: `npm install @anthropic-ai/sdk`. This recipe doesn't paste that JavaScript block a second time. Open the guide if that is the client you already ship.

## What not to do

Don't omit the effort field and then compare the reply to a benchmark that used max. The page's examples set it on purpose.

Don't treat a successful "Hi, how are you?" as a coding-agent eval. The blog's DeepSWE and OSWorld numbers are their claims. A hello call only proves the key, the base URL, and the model id.

## Source

- https://platform.minimax.io/docs/guides/text-generation — OpenAI-compatible curl and Python, fetched October 21, 2026
- Price and availability: https://www.minimax.io/blog/minimax-m31f
