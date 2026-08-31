---
slug: "narrow-waist-progressive-tool-disclosure"
title: "The Narrow Waist: Progressive Tool Disclosure and the Death of the Mega-Prompt"
excerpt: "Every tool you add to an agent ships its full JSON schema on every API call for the life of the conversation. One Cloudflare MCP surface is 39 tools and 12,800 tokens of schema. The fix is not better prompts — it is a three-tool bridge that collapses the catalog on demand, keeps the core always-loaded, and never breaks prompt caching. Here is the architecture, the real numbers from a live box, the four failure modes it creates, and the config that actually hits the cache."
date: "2026-08-31"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Local LLMs", "Linux", "Open Source"]
tags: ["progressive-disclosure", "tool-search", "mcp", "prompt-caching", "narrow-waist", "agent-architecture", "context-budget", "reliability"]
readTime: 16
image: "/images/blog/narrow-waist-progressive-tool-disclosure-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/narrow-waist-progressive-tool-disclosure"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

There is a design rule in the Hermes codebase that shows up in the contributor guide as four words: **the core is a narrow waist.** Every model tool you add to the core ships on every API call, for the entire life of the conversation, because it has to be present in the `tools` array from turn one or prompt caching breaks. That makes the bar for a new core tool high. Most new capability should arrive at the edges — as a CLI command, a skill, a service-gated tool, an MCP server in the catalog — not as another entry in the central tool list.

This is not a stylistic preference. It is a direct consequence of how tool-calling APIs and prefix caching interact, and if you are running an agent with a growing MCP catalog — or you are about to — the same rule applies to your stack. This post is about what actually happens when you ignore it, how progressive tool disclosure fixes it, and the four new failure modes the fix introduces. Everything here comes from running Hermes with a live MCP configuration on local and cloud models. Where a number is specific to my hardware, I say so.

---

## 1. The cost you do not see on the bill

A tool-calling agent does not just send the model your messages. On every turn it sends the model the full JSON schema of every tool it is allowed to call. This is the `tools` array in the OpenAI-compatible request, and it is part of the prompt prefix that the inference engine must process (and, on cloud, bill) before it ever looks at your new user message.

Here is the part most people miss: **the tools array is prefix.** It is byte-stable for the life of the conversation, because changing it mid-conversation invalidates the KV cache / prompt cache the provider built for you. That means the cost of the catalog is not paid once. It is paid on every turn — input tokens on cloud, prefill compute on local — for as long as the conversation runs. A 20-turn debugging session pays the tool-schema tax twenty times.

I measured the catalog on my own running Hermes profile. The MCP cache at `~/.hermes/profiles/liam/cache/mcp_schema_cache.json` holds three live servers:

| MCP server | Tools | Schema size (est. tokens) | Per-tool mean (tokens) |
|---|---:|---:|---:|
| `agentmail` | 26 | 1,426 | ~55 |
| `x-docs` | 3 | 960 | ~320 |
| `comfy` | 39 | 12,819 | ~329 |
| **Total** | **68** | **~15,200** | **~223** |

(Per-tool token estimate at 4 chars/token, serialized compactly. Real tokenizers vary, but this is within 10% for English+JSON, and the direction is what matters.)

Fifteen thousand tokens is not catastrophic by itself. But it is pure fixed overhead on every turn before the model reads a single character of your actual problem. On a 1M-context local model it is 1.5% of the window — tolerable. On a 128K cloud model it is 12% of the window, gone before you type a word. And this is three servers. The Cloudflare MCP surface, which the Hermes tool-search design notes call out as the motivating case, is roughly **3,300 tools whose names alone are ~32K tokens**. At that scale the catalog is not overhead; it is the dominant consumer of context, and it crowds out the conversation it is supposed to serve.

The cost is worst precisely where people put the most tools: cloud providers with large context windows. "I have a 1M context window, I can afford to ship 50 tools." You can afford the bytes. You cannot afford the attention. Every tool schema is a candidate the model evaluates against the user's request before it picks one. Larger catalogs measurably degrade tool-selection accuracy on smaller and quantized local models — the model has to reason over more candidates, and the probability mass on the right one thins out. I have watched a 32B NVFP4 model pick the wrong tool more often once the catalog passed ~40 entries, even when the correct tool's description was a near-exact match for the request. The model is not confused about the task. It is drowning in options.

---

## 2. Why you cannot just "load tools lazily"

The obvious answer is to load tools on demand: only put the tool the user actually needs in the array. This does not work, for three reasons that all reduce to the same root cause.

**First, you do not know which tool is needed until the model has read the user's message.** And the model cannot read the user's message until the API call is made. And the API call must contain the tools array. So the selection of which tools to include has to happen *before* the model sees the request, based only on static information (the user's previous turn, a heuristic, a cheap classifier). That is a worse problem than the one you started with: you are now guessing the tool set with less information than the model would have had.

**Second, prompt caching.** If the tools array changes between turn 1 and turn 2, the provider's cache for the turn-1 prefix is invalidated and must be recomputed. On cloud this turns a cache hit (cheap) into a cache miss (full input-token price) on the turn the catalog changes, and on every subsequent turn until the new prefix stabilizes. On local hardware (vLLM, SGLang, llama.cpp) the same logic applies to the KV cache: a changed prefix means a full re-prefill of the system prompt + tools + history, which is exactly the 3–8 seconds of wasted prefill I wrote about in the prefix-caching post. Mutating the tools array mid-conversation is the most expensive thing you can do to a cached agent loop.

**Third, the model needs to know what is possible before it can ask for it.** If a tool is not in the array, the model does not know it exists, so it will never ask for it, so your lazy loader will never load it. You have to surface the *existence* of capabilities even when you defer their schemas. This is the core insight that makes progressive disclosure work.

---

## 3. The bridge pattern: three tools replace a catalog

The solution Hermes ships is a three-tool bridge that replaces the deferred (MCP + non-core plugin) tools in the model-facing array. The catalog is not deleted — it is still registered in the tool registry, still reachable — but it is hidden from the `tools` array and surfaced on demand through three meta-tools:

```
tool_search  →  "I need a tool that does X"   →  returns matching tool names + short descriptions
tool_describe → "Show me the schema for Y"   →  returns the full inputSchema of the named tool(s)
tool_call    →  "Execute tool Y with these args" → routes through the normal dispatch path
```

The architecture:

```
┌─────────────────────────────────────────────────────────┐
│  Model-facing tools array (every API call)              │
│                                                         │
│  [ core tools, always loaded ]   [ bridge, if deferred ] │
│   read_file, terminal,            tool_search           │
│   web_search, patch, ...          tool_describe         │
│                                   tool_call             │
│                                                         │
│  ── NOT in the array ──────────────────────────────────  │
│   mcp_agentmail_create_draft                            │
│   mcp_comfy_generate_image                              │
│   mcp_xdocs_search_x                                    │
│   ... (68 tools, ~15K tokens, deferred)                 │
└─────────────────────────────────────────────────────────┘
            │  tool_search("email draft")
            ▼
┌─────────────────────────────────────────────────────────┐
│  Tool registry (full catalog, in-process, not in prompt)│
│   All 68 MCP tools + all plugin tools, schemas on demand │
│   Bridge routes through the same dispatch path as direct │
│   calls — guardrails, hooks, approval, truncation fire  │
└─────────────────────────────────────────────────────────┘
```

The critical property: **core tools are never deferred.** In Hermes this is enforced as a hard rule in `tool_search.py`: the list in `toolsets._HERMES_CORE_TOOLS` (53 entries on my build — `read_file`, `terminal`, `web_search`, `patch`, `search_files`, `vision_analyze`, `delegate_task`, `session_search`, etc.) is always in the array, always. No exceptions. The bridge is only for MCP and non-core plugin tools. This is deliberate: the core tools *define* the session's surface. If you deferred `terminal` behind `tool_search`, the model would have to search before it could run a command, adding a round trip to every shell action and breaking the muscle memory of the agent loop. The narrow waist stays narrow; the fat catalog hides behind the bridge.

The bridge tools route through the exact same `handle_function_call` dispatch path as a direct tool call. That means plugin pre/post hooks, approval gates, risk-class governance, tool-result truncation, and the retry/idempotency layer I described in the dispatch-layer post all fire identically whether the model called `read_file` directly or reached it via `tool_call`. There is no second-class execution path for bridge-discovered tools. This is the part that most "lazy tool" implementations get wrong — they build a parallel dispatch path for discovered tools that quietly skips the guardrails, and then the first `SEND`-class tool reached through the bridge does something the governance layer would have blocked.

---

## 4. Tiered disclosure: what scales is the listing, not the decision

A naive bridge would activate only when the deferred catalog exceeds a threshold. The Hermes design is subtler: **the moment any deferrable tool is present, the bridge activates.** What scales with catalog size is not whether the bridge is on, but how much of the catalog listing gets embedded in the `tool_search` description so capabilities stay discoverable.

This produces a three-tier degradation:

| Tier | Condition | What the model sees |
|---|---|---|
| **0** | No MCP/plugin tools | Pure passthrough — all tools eager, no bridge |
| **1** | Deferred tools, listing fits budget | Bridge + skills-style listing (name + one-line description per tool) |
| **2** | Listing over budget even names-only (e.g. 3,300-tool Cloudflare surface) | Bare bridge + one-line-per-server summary ("comfy: 39 tools, image generation") |

The listing budget is `min(threshold_pct of context, listing_max_tokens)`. On my profile that is `min(10% of context, default cap)`. When the full per-tool listing exceeds the budget, it degrades to names-only. When names-only still exceeds it (the Cloudflare case), it degrades to a per-server summary — the model still knows *which domains are reachable* (so it can `tool_search` inside them) but individual tool names are discoverable only via search.

This is the right tradeoff. The model always knows the *shape* of the available capability surface. It never has to guess whether "email" is possible — the server summary says `agentmail: 26 tools, email management`. It only pays the schema token cost for the tool it is about to call, via `tool_describe`, and that result is a tool output (transient, not prefix) so it does not lock into the cached prefix.

---

## 5. The four failure modes the bridge introduces

Progressive disclosure is a net win, but it is not free. It creates four new failure classes that a naive "just lazy-load tools" implementation will hit and never diagnose.

### 5.1 The cold-start discovery tax

The bridge adds a round trip. On the first turn that needs a deferred tool, the model must call `tool_search`, read the results, call `tool_describe` for the schema, then call `tool_call`. That is three model turns where a direct-call agent would have taken one. On a local model at 40 tok/s, `tool_search` + `tool_describe` together can add 5–10 seconds of wall-clock before the actual work starts.

This is acceptable for tools used rarely (you do not send email every turn). It is unacceptable for tools used every turn — which is exactly why core tools are never deferred. The decision rule: **defer tools that are used occasionally; never defer tools that are used constantly.** If you find yourself wanting to defer `read_file` or `terminal`, your problem is not catalog size — it is that you have too many tools enabled, and you should curate the toolset, not bridge the core.

### 5.2 The stale-catalog regression

The catalog must be rebuilt from the live tool registry on every assembly. The Hermes design notes flag this explicitly as the lesson from an OpenClaw cron regression: a session-keyed catalog that drifted out of sync with the live registry produced silent tool dropouts — the model would `tool_call` a tool that the registry had already removed, or fail to find a tool that had just been added, because the cached catalog was stale.

The fix is to make the catalog stateless across turns: rebuild it from the current tool-defs list every time the tools array is assembled. This costs a little CPU per turn and saves you from the worst class of bug — an agent that confidently calls a tool that no longer exists, or that cannot find a tool it should be able to see. If you are building your own bridge, do not cache the catalog per-session. Rebuild it.

### 5.3 The cache-break on reconfigure

The bridge tools are part of the prefix. If the set of *deferred* tools changes mid-conversation (you add an MCP server, a plugin loads, a tool's `check_fn` flips it on because an env var got set), the tools array changes, the prefix changes, and the cache breaks. This is correct behavior — the capability surface genuinely changed — but it is invisible to the user and it will show up as a sudden latency spike or a cloud bill anomaly on the turn it happens.

The mitigation is to keep the deferred set stable for the life of a conversation. Configure MCP servers and plugins at startup, not mid-session. The Hermes config has `mcp_reload_confirm: true` for exactly this reason — reloading MCP servers is a conscious act, not something that happens behind your back, so you know you are about to break the cache.

### 5.4 The discoverability gap on small models

The bridge assumes the model is smart enough to use it. A model has to recognize that its current tools are insufficient, decide to call `tool_search`, phrase a useful query, and synthesize the results. Large cloud models do this reliably. A quantized 7B local model will frequently *not* do this — it will attempt the task with the core tools it can see, fail, and stop, never realizing there is a whole catalog it could search.

This is a real limitation, not a bug. Progressive disclosure shifts a cognitive load from "pick the right tool from 68" to "decide to search, then pick from 5 results." The second is easier, but only if the model clears the bar of *deciding to search at all*. On small local models, pair the bridge with explicit system-prompt guidance: "If the available tools do not cover the request, call `tool_search` with a description of what you need." On models below ~13B, consider not using the bridge at all and instead curating a small, always-loaded toolset — the discovery tax is not worth paying when the model will not reliably pay it.

---

## 6. The config that actually hits the cache

Here is the working configuration from my profile (`~/.hermes/profiles/liam/config.yaml`), trimmed to the parts that matter:

```yaml
tools:
  tool_search:
    enabled: auto          # "auto"|"on"|"off" — auto is an alias of on today
    threshold_pct: 10       # listing budget = 10% of context window
    search_default_limit: 5 # default results per tool_search call
    max_search_limit: 20    # hard cap, clamped to [1, 50]
    # listing: auto         # auto = include catalog listing when it fits
    # listing_max_tokens: 4000  # absolute cap on the embedded listing
```

The three settings that actually matter:

1. **`enabled: auto`** — turns the bridge on the moment any deferrable tool exists, off when there are none. You almost never want `off` unless you are debugging selection. You almost never want to force `on` on a session with zero MCP tools (it adds three useless bridge tools to the prefix for nothing).

2. **`threshold_pct`** — this bounds the *listing*, not the activation. Set it to the fraction of context you are willing to spend on discoverability before the listing degrades to names-only, then to a per-server summary. 10% is generous. On a 128K window that is 12,800 tokens of listing budget — enough for the full per-tool listing of most catalogs, and the point at which the comfy surface (12,819 tokens of full schema) starts to degrade to names-only (~239 tokens) rather than ship the whole schema.

3. **`search_default_limit` and `max_search_limit`** — bound the work one `tool_search` call can request (max 10 queries per call, max 10 names per `tool_describe`). These are DOS guards, not tuning knobs. Leave them near defaults unless you have a reason.

The one setting I see misconfigured most often is `threshold_pct` left at a tiny value (1–2%) because someone read "threshold" and thought "activate the bridge above this." That is the old semantics. Under tiered disclosure the bridge activates on *any* deferrable tool; the threshold only controls how much listing context the model gets before it degrades. Set it too low and the model sees a bare bridge with no listing, has to search blind, and the discovery tax compounds. Set it to 5–10% and the model gets a usable map of the catalog for free, in the prefix, cached.

---

## 7. When to use the bridge, and when not to

| Situation | Use progressive disclosure? | Why |
|---|---|---|
| Cloud model, large MCP catalog (20+ tools) | **Yes** | The catalog is the dominant context consumer; the discovery tax is cheap relative to per-turn schema cost |
| Cloud model, small curated toolset (<10 tools) | **No** | The bridge adds three tools and a round trip for a catalog that fits comfortably. Ship it eager. |
| Local 27B+ model, medium catalog | **Yes, with guidance** | Pays for itself once the catalog exceeds ~15 tools. Add system-prompt nudge to search. |
| Local 7–13B model, any catalog | **No — curate instead** | The model will not reliably decide to search. Ship a small always-loaded toolset and skip the bridge. |
| Cloudflare-class surface (3,000+ tools) | **Yes, mandatory** | This is the case the bridge was built for. Without it the catalog is unservable. |
| Single-purpose agent (one job, three tools) | **No** | You have no catalog bloat. The bridge is pure overhead. |

The rule of thumb I use: if the deferred catalog exceeds ~10 tools or ~2,000 tokens of schema, the bridge pays for itself. Below that, ship eager and keep the prefix stable.

---

## 8. What this means for how you build agents

The narrow-waist principle reframes how you think about agent extensibility. The question stops being "what tools should the agent have?" and becomes "what tools must be in the prefix, what tools can be deferred, and what tools should not be tools at all?"

Most capability should not be a core tool. It should be a skill (a procedure the agent loads on demand, never in the prefix), an MCP server (deferred behind the bridge), or a CLI command the agent shells out to via the `terminal` core tool (which is always loaded). The core tools are the small, stable set of primitives — file I/O, shell, web, search, delegation — that the agent uses to reach everything else. Everything else is an edge.

This is why the Hermes contributor guide is militant about not adding core tools and equally militant about expanding at the edges. A new messaging platform adapter is wanted work — it adds reach without touching the waist. A new core model tool is the expensive exception, because it is paid for on every API call, by every conversation, forever. The same logic applies to your stack: prefer adding capability as a deferred, discoverable surface (MCP server, plugin, skill) over growing the always-loaded toolset. Your context budget — and your tool-selection accuracy — will thank you.

---

## Summary

| Concern | Pattern | Failure if skipped |
|---|---|---|
| Catalog bloat | Defer MCP/plugin tools behind a `tool_search` / `tool_describe` / `tool_call` bridge | 15K–32K tokens of schema on every turn, cache locked to a fat prefix |
| Core stability | Core tools (`read_file`, `terminal`, `web_search`...) are never deferred, always in the array | Discovery tax on every-turn tools; broken agent muscle memory |
| Cache integrity | Tools array is byte-stable for the conversation; rebuild catalog statelessly per assembly | Mid-conversation cache break; stale-catalog silent tool dropouts |
| Discoverability | Tier the listing: full → names-only → per-server summary as budget degrades | Model cannot find capabilities it has; blind searching compounds the discovery tax |
| Small-model honesty | Do not use the bridge below ~13B; curate a small always-loaded toolset instead | Model never decides to search, fails with visible tools, stops |
| Guardrail parity | Bridge calls route through the same dispatch path as direct calls | SEND/DESTRUCTIVE tools reached via bridge skip approval gates |

The narrow waist is not a limitation. It is the discipline that keeps an agent composable as the catalog grows — the difference between a system that stays fast and selective at 5 tools and one that collapses under its own option set at 500. Build the bridge. Keep the core small. Defer everything else. And measure the catalog before you assume it is fine, because the one thing nobody notices is the tax they pay on every turn.

---