---
slug: "2026-07-17-reasoning-models-in-agent-loops-three-failure-modes"
title: "Reasoning Models in Agent Loops: Three Failure Modes and How to Fix Them"
excerpt: "Qwen3, DeepSeek-R1, Kimi, and Nemotron ship chain-of-thought in a separate field and leave content null until reasoning finishes. Agent frameworks that only read content silently fail. This post walks through the three distinct failure modes — null-content, token-budget black holes, and profile/config mismatch — with the actual code, token budgets, and config tables that fix each one."
date: "2026-07-17"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Local LLMs", "Open Source"]
tags: ["reasoning-models", "chain-of-thought", "qwen3", "deepseek-r1", "ollama", "agent-loops", "token-budget"]
readTime: 14
image: "/images/blog/2026-07-17-reasoning-models-in-agent-loops-three-failure-modes-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-17-reasoning-models-in-agent-loops-three-failure-modes"
---

The model landscape shifted in 2026. Qwen3, DeepSeek-R1, Kimi K2.7 thinking, NVIDIA Nemotron-3, and the o1-style family all do something the previous generation didn't: they emit a chain-of-thought in a **separate field** and leave `content` null until the reasoning finishes. If your agent framework's LLM client reads `message.content` and nothing else, every call against one of these models returns an empty string. The agent honest-fails on every step. It looks broken. It isn't — your parser is.

This post covers the three distinct failure modes we hit shipping reasoning-model support into Praxis (an open-source hybrid agent framework) and wiring Nemotron-3 into Hermes profiles on local Ollama. Each failure mode has a different root cause, a different fix, and a different diagnostic. I'll give you the actual code, the token budgets we validated, and the config table. Nothing here is speculative — all of it came from live dogfooding against a DGX Spark running Qwen3.6-35B-A3B-NVFP4 and a local ROCm box running Nemotron-3 Nano.

## The response shape that breaks everything

A reasoning model returns this:

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "reasoning": "Here's a thinking process:\n\n1. **Analyze the request...**\n\nThe answer is 4."
    }
  }]
}
```

A completion model returns this:

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "4"
    }
  }]
}
```

Three things change: `content` is `null` during reasoning, the chain-of-thought lives in `reasoning` (or `reasoning_content` on some providers), and the visible answer only appears once the thinking phase finishes — *if* the token budget allowed it to finish. Each of those three differences produces a distinct failure mode.

## Failure Mode 1: The null-content silent failure

### Symptom

Every LLM call in your agent loop returns an empty string. Downstream consumers honest-fail. A memory consolidation pass writes the model's chain-of-thought as the insight ("Thinking Process:\n1. **Deconstruct...**") instead of the synthesized conclusion. Tool calls never fire because the parser sees no content and no tool-call block.

### Root cause

The parser reads `data["choices"][0]["message"]["content"]` and nothing else. Against a reasoning model with `content: null`, that's an empty string every time.

### The fix: `_extract_text` with a reasoning fallback

This is the critical fix. Without it, nothing else matters. The helper checks `content` first (so normal models are unaffected), then falls back to `reasoning` / `reasoning_content`:

```python
# hybridagent/providers.py

def _extract_text(message: dict | None) -> str:
    if not isinstance(message, dict):
        return ""
    text = message.get("content")
    if isinstance(text, str) and text.strip():
        return text
    # content null/empty/missing — try reasoning fields
    for key in ("reasoning", "reasoning_content"):
        alt = message.get(key)
        if isinstance(alt, str) and alt.strip():
            return alt
    return text if isinstance(text, str) else ""
```

Wire it into both the non-streaming and streaming paths:

```python
# Non-streaming
text = _extract_text(data["choices"][0]["message"])

# Streaming — yield reasoning chunks when content is null
for chunk in stream:
    delta = chunk["choices"][0]["delta"]
    if delta.get("content"):
        yield delta["content"]
    elif delta.get("reasoning"):
        yield delta["reasoning"]  # or buffer separately if you want
```

**Why this works:** normal models are completely unaffected — `content` wins when present. Reasoning models get their chain-of-thought surfaced as text so the agent loop can proceed. The fallback is the entire fix. Everything else in this post is about making the *output* of that fallback usable.

### The CoT leak problem

`_extract_text` solves the silent failure, but it introduces a new one: now your agent sees the raw chain-of-thought. If your downstream consumer is a memory consolidator that writes an "insight" from the LLM output, you get the thinking process instead of the conclusion. The consolidator's insight pass applied a post-filter that regex-matches the common preambles and extracts the conclusion:

```python
# hybridagent/consolidation.py

import re

_REASONING_HEADERS = re.compile(
    r"^\s*(?:here(?:'s| is| are)? (?:a |the )?(?:thinking process|reasoning|"
    r"analysis|step(?:-by-step)?)|thinking process|let(?:'s| us| me) "
    r"(?:think|break this down|analyze)|reasoning|step \d+|analysis)\b[^:\n]*"
    r"[:.]?\s*\n", re.IGNORECASE)

_REASONING_STEP = re.compile(
    r"^\s*\d+\.\s+\*\*[^*\n]+\*\*\s*:?\s*\n", re.MULTILINE)

def _strip_reasoning(text: str) -> str:
    """Remove CoT preamble, keep the conclusion.
    Conservative: returns text unchanged when it can't confidently split."""
    if not _REASONING_HEADERS.match(text):
        return text
    # Cut the header + reasoning block, keep the last chunk after
    # the first blank line (the conclusion).
    parts = re.split(r"\n\s*\n", text, maxsplit=1)
    if len(parts) < 2:
        return text  # can't split safely — keep the leak over losing the insight
    return parts[1].strip() or text
```

The filter is deliberately conservative. A leaky insight is kept over a discarded one — if it can't confidently split the reasoning from the conclusion, it returns the text unchanged. You'd rather have a messy insight than no insight.

### Verification

Live smoke against the real Spark Qwen3.6 endpoint:

```python
LLMClient.complete("Return the single word PONG")
# → "\n\nPONG"  (content field, present when token budget is sufficient)
```

Live re-dogfood with `max_tokens=4096`: the consolidator wrote a clean, cross-cutting insight — *"Stratifying inference workloads by routing high-volume code generation to quantized local models for routine and background tasks, while reserving premium cloud instances for complex reasoning, directly enables the targeted 40% cost reduction without sacrificing capability"* — synthesized from 5 input memories. No CoT leak.

## Failure Mode 2: The token-budget black hole

### Symptom

The model returns `""` (empty string), `done: true`, `done_reason: "length"`. Your agent sees a blank response and either retries forever or honest-fails. It looks like a broken model. It isn't.

### Root cause

The model consumed its entire token budget writing an internal chain-of-thought and never got to emit the visible answer. This is **correct behavior** for a reasoning model — it's working as designed. The problem is your `num_predict` / `max_tokens` is too low.

### How to diagnose it

Parse the raw NDJSON response manually. Ollama's `generate` endpoint strips the thinking block from the `response` field by default but exposes the fields you need:

| Field | Meaning |
|-------|---------|
| `response` | Final answer (thinking stripped) |
| `thinking` | Recovered thought chain (some models expose this) |
| `eval_count` | Tokens actually generated |
| `eval_duration` | Generation time in nanoseconds |
| `done_reason` | `stop` = clean finish, `length` = hit limit |

```python
import json

with open('/tmp/output.json') as f:
    d = json.loads(f.read().strip().split('\n')[-1])  # last line has done=true
    print('response:', repr(d.get('response', '')))
    print('thinking:', repr(d.get('thinking', ''))[:300])
    print('eval_count:', d.get('eval_count'))
    print('done_reason:', d.get('done_reason'))
```

The pattern that confirms hidden thinking ate your budget:

- `response` is `''` (empty string)
- `thinking` contains visible reasoning text
- `eval_count` equals your `num_predict` limit
- `done_reason` is `"length"`

If you see that, increase `num_predict`. Do not file a bug.

### Token budgets that actually work

Validated on Nemotron-3 Nano 30B:

| Task | Minimum `num_predict` | Typical consumed |
|------|----------------------|-----------------|
| Simple factual Q&A | 128 | 60–100 |
| Logic puzzle (short) | 512 | 350–450 |
| Python function + docstring | 1024 | 300–400 |
| Step-by-step math proof | 1024 | 500–700 |
| Multi-step reasoning | 2048 | 800–1500 |

**Rule of thumb: budget 2× the visible answer length** to allow for the thinking phase. For an agent loop where the LLM must reason *and* emit a tool-call block, 1024 is the floor. 2048 is safer.

### The `max_tokens` threading fix

In Praxis, `complete()` gained an optional `max_tokens` parameter threaded through the routing layer:

```python
# hybridagent/providers.py

def complete(self, prompt: str, *, max_tokens: int | None = None) -> str:
    return self._route(prompt, max_tokens=max_tokens)

def _route(self, prompt, *, max_tokens=None):
    return self._complete_with_ref(prompt, max_tokens=max_tokens)

def _complete_with_ref(self, prompt, *, max_tokens=None):
    return self.chat(messages=[{"role": "user", "content": prompt}],
                     max_tokens=max_tokens)
```

Default stays 1024 so no existing caller breaks. The consolidator's insight pass opts in to `max_tokens=4096`:

```python
# hybridagent/consolidation.py
insight = self.llm.complete(synthesis_prompt, max_tokens=4096)
```

Without this, 1024 tokens of reasoning eat the whole budget and `content` stays null — which puts you back in Failure Mode 1 even after you've fixed the parser. The two failure modes compound.

### Variant behavior: not all reasoning models think the same way

The same architecture family can show dramatically different thinking discipline across parameter sizes. We benchmarked Nemotron-3 Nano at 4B and 30B:

| Property | 4B variant | 30B variant |
|----------|-----------|-------------|
| Thinking overhead | Unpredictable: 15 tokens for "hello", 512+ for a knowledge question | Predictable: 100–400 tokens, clean transition to answer |
| Blank response risk at 512 tokens | **High** — thinking spirals, consumes all tokens | Moderate — 512 usually sufficient |
| Knowledge accuracy | Weak — factual recall distracts into speculation | Strong — correct recall, brief thinking |
| Safe `num_predict` (simple) | 512 (still risky) | 512 |
| Safe `num_predict` (complex) | 1024, monitor for truncation | 1024 |

**Practical rule:** when you downgrade from a 30B to a 4B reasoning variant for speed or footprint, do **not** assume the same token budgets work. The smaller model may need *more* tokens (not fewer) because its thinking is less disciplined. Always re-benchmark with the same suite after switching variants.

### A two-test quality battery

To separate disciplined reasoning models from distracted ones, run both tests:

**Test A — Math Trap (reasoning discipline):**
> "A train travels 120 miles in 2 hours, stops 30 min, then travels 180 miles in 3 hours. What is the average speed for the ENTIRE trip?"

- **Wrong (60 mph):** Ignores the stop. Pattern-matching failure.
- **Correct (54.5 mph = 600/11):** Includes stop in total time. Genuine comprehension.

**Test B — Knowledge Trap (thinking discipline vs. hallucination):**
> "What material are the primary mirrors of the James Webb Space Telescope made of, and why was that material chosen?"

- **Pass:** Mentions beryllium, gold coating, lightweight, low thermal expansion. Thinking block is brief and transitions to answer.
- **Fail:** Thinking block spirals into speculation ("maybe tungsten? silicon? semiconductors?"), consumes entire token budget, produces **zero visible answer** even at `num_predict=512`.

The 4B Nemotron passed Test A (math) but failed Test B (knowledge). The 30B passed both. This pattern — strong at structured reasoning, weak at factual recall when thinking distracts — is a useful signal for small reasoning models. If your agent loop relies on factual recall from a small reasoning model, budget aggressively or route those queries elsewhere.

## Failure Mode 3: The profile/config mismatch

### Symptom

The model works when you test it with `ollama run` directly, but when you wire it into your agent framework, you get timeouts on the first query, truncated mid-sentence answers, or a profile that "feels broken" after the swap.

### Root cause

Reasoning models need different configuration than completion models. The defaults that work for a 7B chat model will fail for a 30B reasoning model. Specifically:

| Parameter | Default | Recommended for reasoning model | Why |
|-----------|---------|--------------------------------|-----|
| `terminal.timeout` | 180 | **300** | Cold load takes 60s+ on large models |
| `model.context_length` | varies | **8192** | Match KV cache allocation |
| `num_predict` (per-request) | 128 | **1024+** | Hidden thinking burns tokens (see Mode 2) |
| `temperature` | 0.7 | **0.2–0.3** | Reasoning is already structured; high temp adds noise |
| `agent.max_turns` | 90 | **30** | Reasoning tasks finish in fewer turns |

### The dedicated-profile pattern

**Do not mix reasoning models into general-purpose profiles.** They need distinct identity, timeouts, and token budgets. In Hermes, the pattern is:

```bash
# 1. Create from a working local profile
hermes profile create nemo --clone-from liam

# 2. Point to the reasoning model
hermes --profile nemo config set model.default nemotron-3-nano:30b
hermes --profile nemo config set model.provider ollama
hermes --profile nemo config set model.base_url http://localhost:11434/v1

# 3. CRITICAL: Increase terminal timeout for cold loads
hermes --profile nemo config set terminal.timeout 300

# 4. Increase context length to match model capability
hermes --profile nemo config set model.context_length 8192

# 5. Set persona aligned with reasoning capability
cat > ~/.hermes/profiles/nemo/SOUL.md << 'EOF'
You are Nemo, a deep reasoning specialist. You think step-by-step before answering.
You excel at mathematics, logic, code generation, and technical analysis.
You are direct, precise, and thorough. You do not rush to conclusions.
EOF
```

### The delegation-only alternative

If you don't want a full dedicated profile, use the reasoning model only for delegation — keep your existing agent hub untouched and route to the reasoning model when a subtask needs it:

```bash
# On the parent profile
hermes config set delegation.model nemotron-3-nano:30b
hermes config set delegation.provider ollama
hermes config set delegation.base_url http://localhost:11434/v1
hermes config set delegation.reasoning_effort high
```

**Tradeoff:** delegation summaries compress the thinking chain. Good for "verify this proof," less good for "walk me through your reasoning." If you need the full chain-of-thought visible to the user, use a dedicated profile, not delegation.

### When NOT to create a dedicated profile

| Scenario | Better approach |
|----------|----------------|
| Just testing a model once | `ollama run nemotron-3-nano:30b` directly |
| Occasional reasoning tasks | Delegation model only |
| Limited RAM / GPU memory | Alternate model on existing profile (staggered usage) |
| Quick chat comparison | `hermes chat -m nemotron-3-nano:30b --provider ollama` ad hoc |

## Detecting reasoning model architecture

Before you tune anything, confirm the model actually *is* a reasoning model. Check Ollama logs at model load time:

```bash
journalctl -u ollama --no-pager | grep -E "renderer|parser|template"
```

Signs of a reasoning model:

- `renderer_parser` includes `thinking`
- `chat_template` includes a `[thinking]` slot
- Template references tool use (`[tools]`) alongside reasoning

Example from Nemotron-3 Nano 30B:

```
renderer_parser="[completion tools thinking]"
chat_template="[tools thinking completion]"
```

If you don't see `thinking` in the parser or template, the model is a completion model and none of the fixes in this post apply. You have a different problem.

## The unified diagnostic

When your agent loop is blank-failing against a model you just swapped in, run this decision tree:

```
1. Is the model a reasoning model?
   Check: journalctl -u ollama | grep thinking
   No  → This post doesn't apply. Look elsewhere.
   Yes → continue.

2. Does your LLM client read message.reasoning when content is null?
   No  → Apply _extract_text fallback (Failure Mode 1). This is 80% of cases.
   Yes → continue.

3. Is done_reason "length" with empty response?
   Yes → Increase num_predict / max_tokens to 1024+ (Failure Mode 2).
         Re-run. If still empty at 2048, the model's thinking is undisciplined
         — run the two-test battery to confirm, consider a larger variant.
   No  → continue.

4. Is the first query timing out?
   Yes → Increase terminal.timeout to 300 (Failure Mode 3).
         Reasoning models have long cold loads.
   No  → continue.

5. Are answers truncated mid-sentence?
   Yes → max_tokens still too low for thinking + completion. Increase to 2048+.
   No  → continue.

6. Is the agent writing CoT as its output instead of the conclusion?
   Yes → Apply _strip_reasoning post-filter on insight/synthesis paths.
   No  → You're done. The loop works.
```

## Honest trade-offs

Reasoning models are not free upgrades. The thinking phase costs tokens, latency, and VRAM. The trade-offs:

| Dimension | Completion model | Reasoning model |
|-----------|-----------------|-----------------|
| Latency (first token) | Fast | Slow — thinking phase first |
| Token cost per answer | 1× | 2–4× (thinking + answer) |
| VRAM pressure | Lower | Higher — longer sequences |
| Best for | Chat, quick Q&A, creative writing, real-time voice | Math, logic, coding, tool planning, multi-step analysis |
| Worst for | Complex chain-of-thought | Casual chat, one-word answers, real-time |

If your agent loop is mostly "read tool result, decide next step, emit tool call," a completion model is often the better choice. Reasoning models shine when the decision itself is hard — multi-step planning, proof verification, complex code generation. For routine tool routing, the thinking overhead is pure latency cost with no quality gain.

The practical architecture we've converged on: **route by task difficulty.** High-volume code generation and routine tool routing go to quantized local completion models. Complex reasoning, planning, and synthesis go to a reasoning model — either a dedicated profile or a delegation target. The consolidator's insight pass uses `max_tokens=4096` because synthesis is genuinely hard and worth the thinking budget. The routine cycle steps use the default 1024 because they aren't.

That's the real lesson: reasoning models don't replace completion models in an agent loop. They complement them. The engineering work is making your framework handle both response shapes, both token budgets, and both latency profiles without breaking. The three fixes in this post are how you do that.

---

*All code and token budgets in this post come from live dogfooding of Praxis v0.28 against a DGX Spark running Qwen3.6-35B-A3B-NVFP4 and a local ROCm system running Nemotron-3 Nano. Praxis is open source at [github.com/smfworks/smf-praxis](https://github.com/smfworks/smf-praxis). The reasoning-model support shipped in `feat(reasoning)` commits across `hybridagent/providers.py` and `hybridagent/consolidation.py`.*