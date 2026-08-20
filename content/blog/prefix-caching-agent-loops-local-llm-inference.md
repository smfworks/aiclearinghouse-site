---
slug: "prefix-caching-agent-loops-local-llm-inference"
title: "Stop Re-Computing Your System Prompt: Prefix Caching for Local Agent Loops"
excerpt: "An agent that sends 40K tokens of system prompt and tool definitions on every turn re-processes all of them from scratch — unless prefix caching is configured and your prompt is ordered to hit it. Here is how KV cache reuse works across Ollama, vLLM, SGLang, and llama.cpp, why agent loops are the ideal workload for it, and the seven pitfalls that silently zero out your cache hit rate."
date: "2026-08-20"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Local LLMs", "AI Agents", "Linux", "Open Source"]
tags: ["prefix-caching", "kv-cache", "ollama", "vllm", "sglang", "llama-cpp", "agent-architecture", "inference-optimization", "reliability"]
readTime: 16
image: "/images/blog/prefix-caching-agent-loops-local-llm-inference-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/prefix-caching-agent-loops-local-llm-inference"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

A tool-calling agent sends the model the same 30,000–50,000 tokens on every single turn: the system prompt, the full tool schema registry, the conversation history, and then — at the very end — the new user message or tool result. On the first turn, the model processes all of that. On the second turn, it processes all of that again. On the tenth turn, it processes all of that again. The system prompt has not changed. The tool definitions have not changed. The first nine turns of conversation history have not changed. But the inference engine recomputes the entire prefix from scratch because nobody told it those tokens are identical.

This is the most expensive oversight in local agent infrastructure. The compute spent re-processing the static prefix on turns 2 through N is pure waste — identical work repeated with identical inputs and identical outputs. A 40K-token prefix on a 32B model takes 3–8 seconds of prefill on a DGX Spark. Across a 20-turn agent session, that is 60–160 seconds of wasted compute that produces the exact same intermediate state every time. On cloud APIs, this waste shows up as input-token charges on every turn. On local hardware, it shows up as latency the user feels and GPU cycles that could be doing useful work.

**Prefix caching** eliminates this. The inference engine stores the key-value (KV) tensors computed during prefill and reuses them when a subsequent request shares the same token prefix. The shared prefix is computed once; every subsequent turn only processes the new tokens at the tail. For agent loops, where 80–95% of the context is identical across turns, this collapses the dominant cost of inference into a memory read.

The technique is not new. What is new — as of 2026 — is that it is now available and enabled by default in every major local inference backend: Ollama, vLLM, SGLang, and llama.cpp. But "available" and "actually hitting the cache" are different things. A single whitespace difference in your system prompt, a reordered tool definition, or a model that unloaded between turns silently zeroes your hit rate and you will never know unless you measure.

This post is the practical version: how prefix caching works mechanically, why agent loops are the ideal workload, how to configure it across four backends, how to order your context for maximum hits, and the seven pitfalls that silently kill your cache.

---

## 1. The cost of not caching

Let me put numbers on it. Consider a Hermes agent loop with a realistic configuration:

| Component | Approximate tokens |
|---|---|
| System prompt (identity, rules, constraints) | 3,000 |
| Tool schemas (40 tools × ~250 tokens each) | 10,000 |
| Skills loaded into context | 5,000 |
| Conversation history (10 turns of mixed user/assistant/tool) | 15,000 |
| Current turn (new user message or tool result) | 500 |
| **Total per request** | **~33,500** |

On turn 1, the model processes all 33,500 tokens. On turn 2, the first 28,000 tokens are byte-for-byte identical to turn 1 — only the last ~5,500 changed (the previous turn's response plus the new user input). On turn 10, the first ~23,000 tokens are identical to turn 9's prefix.

Without prefix caching, every turn pays the full prefill cost:

| Turn | Tokens processed | Tokens cached & reused | Wasted compute |
|---|---|---|---|
| 1 | 33,500 | 0 | 0 |
| 2 | 34,000 | 28,000 | 28,000 |
| 5 | 36,000 | 31,000 | 31,000 |
| 10 | 41,000 | 38,000 | 38,000 |
| **Total (10 turns)** | **~370,000** | **~280,000** | **~280,000** |

That is 280,000 tokens of pure re-computation — 76% of total compute — producing the exact same KV tensors every time. On a DGX Spark running a 32B model at Q4, prefill throughput is roughly 2,000–4,000 tokens/second. Those 280,000 wasted tokens cost 70–140 seconds of GPU time across a single 10-turn session. Scale to a 50-turn coding session and you are looking at 5–10 minutes of wasted compute.

With prefix caching, turns 2–10 only process the delta. Total compute drops from ~370,000 tokens to ~90,000 — a 4× reduction. The latency improvement is proportional: the user stops waiting 3–8 seconds per turn for prefix reprocessing and instead waits for only the new tokens.

---

## 2. How prefix caching works mechanically

The mechanism is worth understanding because it explains every pitfall in section 6.

A transformer processes input tokens in two phases:

1. **Prefill** — the model processes the entire input prompt, computing attention key-value tensors for every layer. This is compute-bound: every token attends to every previous token, and the cost scales quadratically with sequence length. The output of this phase is the KV cache: a set of tensors storing the key and value projections for every token at every layer.

2. **Decode** — the model generates output tokens one at a time, appending each new token's KV to the cache and attending it against the full cached sequence. This is memory-bound: each step is a single forward pass, but it reads the entire KV cache.

Prefix caching intervenes at the boundary between prefill and decode. When a new request arrives, the engine checks whether its token sequence shares a prefix with any previously cached sequence. If it does, the engine skips prefill for the shared tokens and loads their KV tensors from the cache instead of recomputing them. Only the new tokens at the tail — the ones that diverge from the cached prefix — get processed through prefill.

```text
Request 1: [sys_prompt][tools][history_1][user_msg_1]
             ↓ prefill all
             ↓ KV cache stored: [sys_prompt][tools][history_1]

Request 2: [sys_prompt][tools][history_1][assistant_1][user_msg_2]
             ↓ prefix match: [sys_prompt][tools][history_1] ← cache hit (skip prefill)
             ↓ prefill only: [assistant_1][user_msg_2]     ← cache miss (compute)
```

The match is **byte-exact at the token level**. Not semantic, not fuzzy — the token IDs must be identical. This is the single most important fact about prefix caching, and it is the source of every pitfall.

---

## 3. Why agent loops are the ideal workload

Prefix caching helps any workload with shared prefixes, but agent loops are the best case:

| Workload | Prefix overlap | Cache benefit |
|---|---|---|
| Single-shot Q&A (no history) | 0% | None |
| Chatbot (growing history, same system prompt) | 60–80% | High |
| **Tool-calling agent (same system prompt + tools every turn)** | **80–95%** | **Very high** |
| Multi-agent council (shared system prompt, different tool sets) | 30–50% | Moderate |
| RAG with changing retrieved docs | 10–20% per query | Low (docs change position) |

The reason agents are ideal: the system prompt and tool schemas are **static across all turns** within a session. They are the longest part of the context (often 10K–20K tokens), they are at the very front of the sequence (so they form the prefix), and they never change. The conversation history grows monotonically — each turn appends to it, so the previous turns are always a prefix of the current turn. Only the final message differs.

This means an agent with a 15K-token system prompt + tool block and a 20K-token conversation history has a 35K-token prefix that is identical between turns N and N+1. The cache hit rate approaches 100% for the static portion and is always high for the history portion (it only grows by one turn's worth of tokens each time).

No other common LLM workload has this profile. A RAG system retrieves different documents each query, so the "prefix" changes. A chatbot has a shorter system prompt and the history is the main body. An agent has both a large static block and a growing history, and both are prefixes.

---

## 4. Backend-by-backend configuration

### Ollama

Ollama implements prefix caching automatically. When you send a request that shares a prefix with a previously processed request — and the model is still loaded in memory — Ollama reuses the cached KV state for the shared portion. There is no flag to enable; it is on by default.

The critical configuration is `keep_alive`, which controls how long the model stays loaded in memory after the last request. The default is 5 minutes. If the model unloads, the KV cache is evicted and the next request pays full prefill cost. For agent loops, you want the model pinned:

```bash
# Set in the API request (per-call)
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3:32b",
  "messages": [...],
  "keep_alive": "60m"
}'

# Or set it globally via environment variable
OLLAMA_KEEP_ALIVE=60m ollama serve
```

For a daemon-style agent that runs continuously, use `keep_alive: -1` (infinite). The model stays loaded indefinitely and the KV cache persists across turns. This is the single highest-leverage setting for local agent latency.

```bash
# Verify the model is loaded and cache is warm
curl http://localhost:11434/api/ps
# Look for: "expires" field — if it shows a future timestamp, the model is pinned
```

**How to verify cache hits**: Ollama does not expose a direct cache-hit metric, but you can infer it from timing. Send the same prompt twice and measure `prompt_eval_count` vs `prompt_eval_duration` in the response. On a cache hit, the second request's `prompt_eval_duration` should be a fraction of the first's for the same `prompt_eval_count`.

### vLLM

vLLM implements automatic prefix caching (APC). As of vLLM V1 (v0.18.0+), it is **enabled by default**. In older V0 builds, you need the flag:

```bash
# V0: explicit flag required
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
  --enable-prefix-caching \
  --kv-cache-dtype fp8 \
  --gpu-memory-utilization 0.92

# V1: enabled by default, no flag needed
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
  --kv-cache-dtype fp8 \
  --gpu-memory-utilization 0.92
```

vLLM stores cached KV blocks in GPU memory using its paged-attention block manager. When a request arrives, it hashes the token sequence block-by-block and checks for existing blocks with matching hash. Matching blocks are reused; only diverging blocks are computed.

**Important limitation**: some model architectures do not support prefix caching. Hybrid attention models (e.g., Qwen3-Next with its interleaved sliding-window and full-attention layers) do not currently support APC in vLLM because the sliding-window attention mechanism invalidates the prefix assumption. If you are running such a model, vLLM will log a warning and silently fall back to no-cache mode. Check your server logs.

```bash
# Verify APC is active in vLLM logs
grep -i "prefix" /path/to/vllm/logs | head -5
# Look for: "Automatic prefix caching is enabled" or similar
```

### SGLang

SGLang implements prefix caching via **RadixAttention**, which is on by default. RadixAttention stores KV tensors in a radix tree indexed by token sequence. When multiple requests share a common prefix, the tree reuses the cached nodes.

```bash
# RadixAttention is on by default — no flag needed
python -m sglang.launch_server \
  --model-path meta-llama/Llama-3.1-70B-Instruct \
  --port 30000
```

SGLang is worth knowing about for agent workloads because RadixAttention handles the multi-request case better than vLLM's block-hash approach. When you have multiple concurrent agent sessions sharing the same system prompt (common in multi-tenant setups), SGLang's radix tree naturally shares the cached prefix across sessions. vLLM's block hashing also enables cross-request sharing, but the radix structure makes it more efficient for many small divergences from a large shared root.

```bash
# SGLang exposes cache stats via its server API
curl http://localhost:30000/get_server_info | python3 -m json.tool | grep -i cache
```

### llama.cpp (llama-server)

llama.cpp's `llama-server` implements prefix caching through a **slot-based** model. The server runs N parallel slots (`-np N`), each with its own KV cache. When a request arrives, the server selects the slot whose cached prefix has the longest common prefix (LCP) with the incoming request. The matched prefix is reused; the diverging tail is processed.

```bash
# Start with caching enabled (default) and 2 slots
llama-server \
  --model models/qwen3-32b-Q4_K_M.gguf \
  --port 8000 \
  -c 32768 \
  -np 2 \
  --cache-prompt
```

Key parameters:

| Flag | Default | Effect |
|---|---|---|
| `--cache-prompt` | true | Enables same-slot KV cache reuse |
| `-np N` | 4 | Number of parallel slots (each gets `n_ctx / N` context) |
| `-c N` | 8192 | Total KV cache size, shared across all slots |
| `--cache-reuse N` | 0 | Min chunk size reused via KV shifting (0 = disabled) |
| `--cache-idle-slots` | enabled | Saves idle slot KV to the prompt cache |

The slot-based model has a known limitation: the server selects a slot by LCP similarity, not by optimal match. If two slots have similar-but-not-identical prefixes, the server may pick the suboptimal one, causing unnecessary recomputation. This is a real issue for long prompts (40K+ tokens) where multiple agent sessions share a similar but not identical prefix. The community is aware of it; until it is fixed, the mitigation is to ensure each agent session consistently routes to the same slot (or run one slot per agent with `-np 1` and accept serial execution).

```bash
# Verify cache hits in llama-server logs
# A cache hit shows "restored context checkpoint" with low prompt eval time
grep "restored context checkpoint" /path/to/llama-server.log
# A cache miss shows "new prompt" with full eval time
grep "new prompt" /path/to/llama-server.log
```

llama.cpp also supports explicit slot save/restore via its API, which lets you persist a warm cache to disk between sessions:

```bash
# Save slot 0's KV cache to disk
curl http://localhost:8000/slots/0?action=save \
  -d '{"filename": "/tmp/agent_cache.slot0"}'

# Restore it later (model must be loaded)
curl http://localhost:8000/slots/0?action=restore \
  -d '{"filename": "/tmp/agent_cache.slot0"}'
```

This is useful for agents that run on a schedule (cron jobs): save the cache after the first run, restore on subsequent runs, and skip the prefill of the static prefix entirely.

---

## 5. Ordering your context for maximum cache hits

Prefix caching only helps the portion of your context that is a **prefix** — the leading token sequence that is identical across requests. Anything that changes in the middle of the sequence breaks the cache from that point forward, even if everything after it is identical.

This means the **order of your context matters as much as the caching configuration**. The rule is simple:

> **Static content first. Dynamic content last.**

The ideal ordering for an agent loop:

```text
[system prompt]          ← never changes, always cached
[tool definitions]       ← never changes within a session, always cached
[loaded skills]          ← changes only when skills change, usually cached
[conversation history]   ← grows monotonically, cached up to last turn
[current user message]   ← new every turn, never cached
[tool results]            ← new every turn, never cached
```

Every component that can change between turns should be as far back in the sequence as possible. Every component that is stable should be at the front.

The most common mistake is inserting dynamic content into the middle of the static prefix. Examples I have seen in production agent code:

| Mistake | Where it breaks the cache | Fix |
|---|---|---|
| Timestamp in system prompt (`"Current time: 2026-08-20T14:32:01Z"`) | First token of system prompt | Move timestamp to the end of the message array, after history |
| Request ID / nonce in system prompt | First token of system prompt | Remove nonces from the prompt entirely; track them in your application layer |
| Tool definitions sorted by name (order changes when tools are added) | Middle of tool block | Sort tools by a stable key (registration order) and never reorder |
| Conversation summary injected between system prompt and history | After system prompt | Put summaries at the end of history, not before it |
| Per-turn context injection ("You are working on file X.c") in system prompt | System prompt changes every turn | Put per-turn context in the user message, not the system prompt |

Here is a concrete example of the wrong and right way to build the message array:

```python
# WRONG: timestamp in system prompt breaks the entire prefix
messages = [
    {
        "role": "system",
        "content": f"You are a coding agent. Current time: {datetime.now().isoformat()}"
    },
    {"role": "user", "content": "Fix the bug in auth.py"},
]

# RIGHT: static system prompt, dynamic time at the end
messages = [
    {"role": "system", "content": "You are a coding agent."},
    {"role": "user", "content": [
        {"type": "text", "text": f"Current time: {datetime.now().isoformat()}"},
        {"type": "text", "text": "Fix the bug in auth.py"},
    ]},
]
```

The first version invalidates the cache on every request because the system prompt changes. The second version keeps the system prompt byte-identical across all turns; only the user message changes, and it is at the tail.

---

## 6. The seven pitfalls that silently kill your cache

These are the failure modes I have seen in production agent systems. None of them throw an error. None of them log a warning. The cache just stops hitting, and your latency quietly returns to the uncached baseline.

### Pitfall 1: Whitespace and formatting drift

The cache matches at the token level. A trailing newline, a different indentation, or a reformatted JSON string produces different token IDs and breaks the match. This is the most insidious pitfall because it is invisible — you look at two prompts and they "look the same" but the bytes differ.

```python
# This breaks the cache if the formatter changes between requests
import json

# Request 1: indent=2
tool_schema = json.dumps(tools, indent=2)

# Request 2: indent=4 (someone changed the formatter config)
tool_schema = json.dumps(tools, indent=4)
# → different byte sequence → different tokens → cache miss
```

**Fix**: Canonicalize your prompt construction. Use a single serialization function for tool schemas, system prompts, and any static context. Pin the format (indent, separators, key order) in code, not in a formatter config that someone might change.

### Pitfall 2: Tool definition order changes

If your agent framework sorts tool definitions alphabetically and you add or rename a tool, the sort order changes and the entire tool block re-tokenizes. Even if the content is identical, the position shift breaks the prefix.

**Fix**: Use a stable, append-only ordering. Register tools in a fixed order and serialize them in registration order, not sorted order. If you must add a tool, append it to the end of the list rather than inserting it alphabetically.

### Pitfall 3: Model unloading between turns (Ollama)

If the model unloads (default 5-minute `keep_alive`), the KV cache is evicted. The next request pays full prefill. This is silent because Ollama does not log cache eviction prominently — you just see slower responses.

**Fix**: Set `keep_alive` to a duration longer than your longest inter-turn gap, or use `-1` for infinite. For cron-based agents, either pin the model or use llama.cpp's slot save/restore.

### Pitfall 4: Context overflow causing eviction

When the total context across all concurrent requests exceeds the KV cache budget, the engine evicts cached blocks to make room. This is LRU eviction — the least recently used cached prefix is discarded. In a multi-session setup, one session's long prefix can evict another session's cache.

**Fix**: Size your KV cache (`-c` in llama.cpp, `--gpu-memory-utilization` in vLLM, `OLLAMA_NUM_CTX` in Ollama) to accommodate your expected concurrency. If you run 3 concurrent agent sessions each with 32K context, you need at least 96K of KV cache headroom. Use `--kv-cache-dtype fp8` (vLLM) or `-ctk q8_0 -ctv q8_0` (llama.cpp) to halve KV memory usage and double effective cache capacity.

### Pitfall 5: Non-deterministic tool schema generation

Some agent frameworks generate tool schemas dynamically from Python function signatures using `inspect` or `pydantic` model dumps. The field order in pydantic v2 model dumps is not guaranteed to be stable across Python versions or model modifications. A field added to a pydantic model can shift other fields in the JSON output, re-tokenizing the tool block.

**Fix**: Explicitly define tool schemas as static JSON schemas (not auto-generated from function signatures). If you must auto-generate, pin the schema generation to a specific format and test that it produces byte-identical output across runs. Cache the generated schema string and reuse it.

### Pitfall 6: Hybrid attention models that do not support caching

Models with hybrid attention (sliding window + full attention layers, like Qwen3-Next) cannot use prefix caching because the sliding-window mechanism means earlier tokens' KV states are not all retained. vLLM and llama.cpp will silently disable caching for these models. You will see normal latency, not an error, and you may not realize caching is off.

**Fix**: Check your backend's documentation for model-specific caching support before assuming it is on. If you are running a hybrid attention model, accept that prefix caching will not help and focus on other optimizations (smaller context, context compression, KV cache quantization). For agent workloads where caching matters most, prefer full-attention models.

### Pitfall 7: Conversation history truncation from the front

When an agent's context exceeds the model's context window, the standard approach is to truncate old messages. But truncating from the **front** of the conversation history changes the prefix — the first N messages are removed, so the token sequence no longer matches the cached prefix. The entire cache is invalidated.

**Fix**: Truncate from the **middle** of the conversation, not the front. Keep the system prompt, tool definitions, and the most recent K turns of history. Remove turns from the middle of the history block. This preserves the prefix (system prompt + tools + early history) and only invalidates the cache from the truncation point forward, which is already at the tail of the cached portion.

Alternatively, use context compression (summarizing old turns into a single message) and place the summary at the end of the retained history, not at the beginning. The summary is new content, so it belongs in the dynamic tail, not the cached prefix.

---

## 7. Measuring cache hit rate

You cannot optimize what you do not measure. Each backend exposes cache metrics differently:

### vLLM

vLLM logs cache hit rate per request. Look for lines like:

```text
INFO:     Avg prompt throughput: 120.3 tokens/s
INFO:     Avg generation throughput: 45.2 tokens/s
```

For detailed cache stats, query the prometheus metrics endpoint:

```bash
curl http://localhost:8000/metrics | grep -i "cache"
# vLLM exposes: vllm:prefix_cache_hit_rate, vLLM:prefix_cache_miss_rate
```

A healthy agent workload should show 70%+ hit rate. Below 40% means something is breaking your prefix.

### SGLang

SGLang exposes cache tree stats:

```bash
curl http://localhost:30000/get_server_info | python3 -m json.tool
# Look for radix_cache_hit_rate and cache_size fields
```

### llama.cpp

llama.cpp logs are the most verbose. Each request logs the slot selection and cache match:

```text
slot update_slots: id 0 | task 5 | prompt eval, n_ctx_slot = 16384, n_keep = 0, n_prompt_tokens = 28500
slot update_slots: id 0 | task 5 | kv cache hit: 27500 / 28500 = 96.5%
slot update_slots: id 0 | task 5 | prompt eval time = 1250.3 ms / 1000 tokens   ← only the 1000 new tokens
```

The `kv cache hit` line tells you exactly how many tokens were reused. 96.5% means 27,500 of 28,500 tokens were served from cache. The `prompt eval time` confirms it: if it says `/ 1000 tokens` but the request had 28,500 input tokens, the remaining 27,500 were cache hits.

### Ollama

Ollama is the hardest to measure directly. The `/api/chat` response includes `prompt_eval_count` and `prompt_eval_duration`. Compare these across turns:

```bash
# Turn 1 (cold cache): prompt_eval_count = 33500, prompt_eval_duration = 8200ms
# Turn 2 (warm cache): prompt_eval_count = 33500, prompt_eval_duration = 950ms
# → 33500 tokens "processed" but only took 950ms → ~8.5x speedup → cache hit
```

If turn 2's `prompt_eval_duration` is similar to turn 1's, the cache is not hitting. The `prompt_eval_count` will always show the full prompt length because Ollama reports the total prompt size, not just the computed portion — so you must infer from timing, not token count.

---

## 8. The math: when caching pays off and when it does not

Prefix caching is not free. It costs GPU memory to store the cached KV tensors, and it costs a small amount of compute to hash and look up prefixes on each request. The trade-off is favorable when:

1. **The shared prefix is large** (>2K tokens — below that, the lookup overhead can exceed the saved compute)
2. **The prefix is reused multiple times** (>2 requests share it — a one-shot query gains nothing)
3. **The model is not a hybrid-attention architecture** (full attention required)
4. **GPU memory can accommodate the cache** (KV cache for a 32B model at Q4 with 32K context is ~2GB; for FP8 KV, ~1GB)

For agent loops, conditions 1 and 2 are always met. The question is 3 and 4.

| Scenario | Cache beneficial? | Why |
|---|---|---|
| Agent loop, full-attention model, enough VRAM | **Yes** | 80–95% hit rate, 4–8× latency reduction |
| Agent loop, hybrid-attention model | No | Cache silently disabled |
| Agent loop, full-attention, VRAM-constrained | Maybe | Use KV quantization (FP8/Q8/Q4) to fit |
| Single-shot Q&A, no history | No | No prefix to reuse |
| RAG with changing retrieved docs | Marginal | Docs change position, breaking the prefix |
| Multi-session, same system prompt | Yes | Cross-session prefix sharing (SGLang RadixAttention excels here) |

The decision tree is straightforward:

```text
Is your workload multi-turn (agent loop, chat)?
├── No → Prefix caching provides no benefit. Skip it.
└── Yes
    ├── Is your model full-attention (not hybrid)?
    │   ├── No → Caching disabled by backend. Accept it, optimize elsewhere.
    │   └── Yes
    │       └── Is your prompt ordered static-first?
    │           ├── No → Reorder context (section 5). Then enable caching.
    │           └── Yes
    │               └── Do you have enough VRAM for the KV cache?
    │                   ├── No → Use KV quantization (FP8 / Q8 / Q4)
    │                   └── Yes → Enable caching, measure hit rate, fix pitfalls.
```

---

## Closing: the free lunch is real, but you have to order it

Prefix caching is the highest-leverage, lowest-cost optimization available for local agent infrastructure in 2026. It is enabled by default in every major backend. It requires no code changes to the model, no fine-tuning, no architectural redesign. For agent loops — where 80–95% of the context is a stable prefix — it collapses the dominant cost of inference into a memory read.

But "enabled by default" is not the same as "working." The cache only hits when your token sequence is byte-identical at the prefix. A timestamp in the system prompt, a reordered tool definition, a whitespace difference in a JSON dump, or a model that unloaded between turns silently zeroes your hit rate. The backend will not tell you. Your agent will just be slower.

The playbook is five steps:

1. **Pin the model in memory** (`keep_alive: -1` for Ollama, no timeout for vLLM/SGLang, persistent llama-server process).
2. **Order your context static-first** — system prompt, tools, skills, history, then the current message at the tail.
3. **Canonicalize prompt construction** — one serialization function, pinned format, no dynamic content in the prefix.
4. **Measure cache hit rate** on every backend — if it is below 70% for an agent loop, something in section 6 is breaking it.
5. **Use KV cache quantization** (FP8, Q8) if VRAM is tight — it doubles effective cache capacity with negligible quality impact.

Do this and a 20-turn agent session that took 3 minutes of prefill compute drops to 45 seconds. On local hardware where every second of GPU time is a second the user waits, that is not a marginal optimization. It is the difference between an agent that feels responsive and one that feels broken.

---

*This post is based on running Hermes agents on Linux with Ollama, vLLM, SGLang, and llama.cpp backends on NVIDIA DGX Spark and AMD Strix Halo systems. The technique is backend-agnostic; the pitfalls travel. Measure your own cache hit rate — the numbers in this post are representative, not guaranteed, and vary by model, hardware, and workload.*