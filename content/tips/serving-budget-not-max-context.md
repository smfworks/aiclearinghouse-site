---
slug: serving-budget-not-max-context
title: Put the serving budget in the config, not the headline context
category: Performance
excerpt: A validated maximum context is not the length the vendor told you to serve. Read both numbers before you set max model length.
tags:
  - context
  - serving
  - agents
  - cost
order: 115
last_verified: "2026-10-07"
---

# Put the serving budget in the config, not the headline context

## The principle

When a model card prints two context numbers, the smaller one is usually the serving budget. The larger one is the length they validated, or the length a flag can force. Agents inherit whichever number you put in the gateway. If you copy the headline, every long task pays for context the vendor already told you to avoid.

## Why it matters

Kolibri 1 is the clean example from this week's card, not a lab story. Aleph Alpha says the model was validated to 1,048,576 tokens. The same card says to keep latency-sensitive deployments and complex tasks at or under 262,144. Training lengths on that card are shorter still: 16,384 pretrain, 65,536 mid-train, 262,144 in the long-context phase. The 1M figure is an extension. Positional encoding sits only in the sliding-window layers, which is why they say the context can extend without position scaling. "Can extend" is not "serve every request at the max."

Clef has a quieter version of the same split. Workers AI lists a 65,536-token context window. The Hugging Face usage note says `encode_record` accepts `max_length` with a default of 16,384. A local copy that never sets `max_length` is not on the hosted budget.

## How to apply it

1. Copy both numbers into the model record: validated maximum, and the vendor's serving recommendation. If the card has only one, write "one number published" instead of inventing the other.
2. Set the gateway default to the serving recommendation. Make the maximum an explicit override with a reason, the way Kolibri's card documents `--max-model-len 1048576` plus an `max_position_embeddings` override.
3. For agent runs, log the input length you actually sent. A 1M window that you never fill is not evidence the agent can use 1M.
4. When a second surface disagrees, keep both. Hosted context and the local helper default are allowed to differ. Collapse them only after you have read both pages.

## Red flags

- A directory row with a single context field and no note about the serving cap.
- A deploy snippet that sets the maximum because the README led with it.
- A comparison that ranks models by the largest printed window and ignores the length they were trained at.
- A decision-model helper whose default `max_length` is a quarter of the hosted window, used as if it were the hosted window.

## Quick win

Open the Kolibri card and write two numbers in the runbook: serve at 262,144, extend to 1,048,576 only with the documented flags. Then check the next model you added this month for the same pair. If the second number is missing, say so. Do not fill it in.

## Sources

- https://huggingface.co/Aleph-Alpha/Kolibri-1
- https://developers.cloudflare.com/workers-ai/models/clef/
- https://huggingface.co/Cloudflare/clef
