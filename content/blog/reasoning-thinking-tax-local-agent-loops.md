---
slug: "reasoning-thinking-tax-local-agent-loops"
title: "The Thinking Tax: Controlling Reasoning Cost in Local Agent Loops"
excerpt: "On cloud you pay per token for a reasoning model's chain-of-thought. On local hardware you pay in latency and throughput — a model that thinks for 800 tokens before dispatching a trivial tool call just turned your 40 tok/s box into a 4 tok/s box for that request. The control surface is fragmented and buggy: the OpenAI SDK strips the flag that disables thinking, the /no_think token does not work on SGLang, and the wrong tool-call parser silently drops 80% of your tool calls. Here is the real economics, the working control surface, the parser gotchas, and a decision framework for when to let the model think and when to switch it off."
date: "2026-08-26"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Local LLMs", "Linux", "Open Source"]
tags: ["reasoning-models", "chain-of-thought", "sglang", "qwen3", "local-llm", "agent-loops", "tool-calling", "throughput", "dgx-spark"]
readTime: 16
image: "/images/blog/reasoning-thinking-tax-local-agent-loops-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/reasoning-thinking-tax-local-agent-loops"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

A reasoning model is a model that emits a chain-of-thought before it answers. Qwen3, DeepSeek-R1, Kimi K2.7 thinking, and the o1-style family all do this. The thinking is useful — sometimes. It is also expensive, and on local hardware the expense is not denominated in dollars. It is denominated in **latency and throughput**, and most agent loops I have audited pay the tax on every single request whether the task needs it or not.

Here is the scenario that prompted this post. We run a Qwen3.8-27B reasoning model on an NVIDIA DGX Spark via SGLang. The box does roughly 40 tokens per second at the batch sizes we run. An agent loop issues a tool-dispatch step: "Given the user's message, pick the right tool and emit its arguments." This is a one-shot classification. The correct answer is a small JSON blob — maybe 40 tokens of content. But the model is a thinking model, so before it emits that 40-token answer it produces 600 to 900 tokens of chain-of-thought: "Let me analyze the user's request. The user is asking about X. The available tools are A, B, C. Tool A is for... Tool B is for... The user's request maps to Tool B because..." Then the 40-token answer.

That one tool-dispatch step took 640–940 tokens at 40 tok/s. It took **16 to 23 seconds** wall-clock. The same step on a non-reasoning model, or on the same model with thinking disabled, takes 40 tokens — **one second**. We just paid a 16–23× latency tax on a step that did not benefit from thinking at all. Multiply that across a 50-turn agent session where 35 of those turns are mechanical tool dispatches, file reads, and status checks, and you have turned a three-minute task into a forty-minute task. The model is not smarter. It is just thinking out loud about things it already knows.

This post is about the economics of that tax, the control surface that lets you turn thinking on and off, the parser configuration that determines whether your tool calls even fire, and a decision framework for when to let the model think. Everything here comes from live operation on a DGX Spark running Qwen3.8-27B-NVFP4 under SGLang. Nothing is speculative. Where a claim is hardware-dependent, I say so.

---

## 1. The economics: thinking is not free, and on local hardware it is worse

On a cloud reasoning API, thinking tokens are billed. You see the line item. The cost is visible, which means it gets questioned, which means people build budgets around it. On local hardware the cost is invisible in a different and more dangerous way: there is no line item, there is no bill, there is just a box that suddenly feels slow. The slowness is real, but because no one is paying per-token, no one accounts for it, and so it accumulates silently across every agent run.

The unit economics on local hardware are throughput, not dollars. Here is the model:

| Metric | Cloud reasoning API | Local hardware (DGX Spark, SGLang) |
|---|---|---|
| Cost unit | $ / 1M tokens (input + output, thinking billed) | tokens / second (fixed by hardware) |
| Thinking cost | Visible, billable, budgetable | Invisible, consumes the same finite tok/s budget as content |
| Latency tax | Per-request added latency, but parallelism is cheap | Per-request added latency, and the box is serial-ish at low batch |
| Throughput tax | Negligible (spin up more instances) | Severe — one thinking request blocks the box for its full duration |
| When it hurts | Large bills on batch jobs | Every interactive agent loop and every high-fan-out batch |

The critical difference is the **throughput tax**. On cloud, a slow request does not block other requests — you provision concurrency. On a single local box at low batch, a 900-token thinking request *occupies the engine for its full duration*. While the model is thinking about which tool to call, nothing else can run. If you have a daemon processing a queue of tasks, one poorly-bounded thinking request stalls the entire queue. I have watched a Praxis daemon's task queue go from a five-minute drain to a forty-minute drain because a consolidation pass was routed to a thinking model with no token bound — every insight step thought for 1,500 tokens before emitting a 60-token conclusion, and the queue backed up behind it.

The rule: **on local hardware, thinking tokens are not a billing problem, they are a scheduling problem.** Every thinking token is a token the box is not spending on the next request.

---

## 2. The control surface — and why most of it is broken

If you want to stop a reasoning model from thinking, you need a control. The control surface across the ecosystem is fragmented, and three of the four common controls are broken in ways that will silently cost you hours. I will walk through each, what it does, and what breaks.

### Control A: `chat_template_kwargs: {enable_thinking: false}` — the one that works, if you send it raw

Qwen3-family models accept a chat-template argument that toggles thinking. You pass it through the `chat_template_kwargs` field in the request. When `enable_thinking` is false, the model skips the chain-of-thought and emits content directly. This is the canonical, model-native control.

```bash
# Raw HTTP to an SGLang / vLLM OpenAI-compatible endpoint
curl -s http://localhost:8888/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3.8-27B-NVFP4",
    "messages": [{"role":"user","content":"Pick the tool for reading a file. Reply with only the tool name."}],
    "chat_template_kwargs": {"enable_thinking": false},
    "max_tokens": 64
  }'
```

This works. The model returns a direct answer with no reasoning field. Latency drops to the content-only token count.

**The breakage:** the official OpenAI Python SDK strips `chat_template_kwargs`. It is not in the SDK's typed request schema, so when you build a `ChatCompletion` request through the SDK, the field is silently dropped before the HTTP call. Your request arrives at the server with no `enable_thinking` flag, the model thinks anyway, and you wonder why your "disabled thinking" probe is still slow.

```python
# BROKEN — the SDK strips chat_template_kwargs
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8888/v1", api_key="EMPTY")
resp = client.chat.completions.create(
    model="Qwen/Qwen3.8-27B-NVFP4",
    messages=[{"role":"user","content":"Pick the tool for reading a file."}],
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},  # may survive, may not, depends on SDK version
    max_tokens=64,
)
```

The `extra_body` workaround sometimes survives depending on SDK version, but it is fragile. **For deterministic control, send the request as raw HTTP** — `httpx` or `requests` or `curl` — and include `chat_template_kwargs` directly in the JSON body. This is the only path I trust for eval probes and for any production path where thinking must be off.

### Control B: the `/no_think` token — does not work on SGLang

Some model documentation suggests inserting a `/no_think` token into the prompt to disable thinking. This is a template-level convention that works on some serving stacks (certain Ollama templates, certain llama.cpp builds) but **does not work on SGLang** with the Qwen3 template we run. The token is passed through as literal text, the model either ignores it or echoes it, and thinking proceeds as normal.

I spent a morning confirming this. If you are on SGLang, do not rely on `/no_think`. Use `chat_template_kwargs`. If you are on Ollama, test it — behavior is template-dependent and has changed across versions. Never assume a soft-prompt token works; verify with a latency probe (next section).

### Control C: reasoning-effort levels — partial, provider-dependent

Some providers expose a `reasoning_effort` parameter (`none`, `low`, `medium`, `high`) that scales the thinking budget rather than toggling it. This is cleaner than a binary switch when you want *less* thinking rather than *none*. Support is uneven: it exists on some OpenAI-compatible endpoints and some reasoning models, but Qwen3 on SGLang does not honor it in the same way — the model either thinks or doesn't, controlled by `enable_thinking`. Treat `reasoning_effort` as a cloud-API convenience, not a local-hardware guarantee.

### Control D: just use a non-reasoning model for the cheap steps

The cleanest control is architectural, not parametric: **route thinking-irrelevant steps to a non-reasoning model.** Keep a small, fast, non-thinking model loaded (or reachable) for tool dispatch, file reads, status checks, and mechanical classification. Reserve the reasoning model for the steps that actually need it. This is the pattern that scales. I cover the routing decision in section 5.

---

## 3. The parser gotcha that silently drops 80% of your tool calls

This is the single most expensive misconfiguration I have seen on SGLang with Qwen3, and it has nothing to do with thinking directly — but it interacts with it, because thinking models emit tool calls *after* their chain-of-thought, and the parser has to find them.

SGLang requires explicit parser flags to extract tool calls from a Qwen3-family model's output:

```bash
# CORRECT — tool calls are parsed and returned as structured tool_call blocks
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3.8-27B-NVFP4 \
  --reasoning-parser qwen3 \
  --tool-call-parser qwen3_coder \
  --port 8888 \
  --mem-fraction-static 0.80
```

If you omit `--reasoning-parser qwen3 --tool-call-parser qwen3_coder`, the server starts fine, the model responds fine, and **your tool calls mostly do not fire.** What happens: the model emits its chain-of-thought, then emits a tool-call in the model's native format, but the server has no parser registered for that format, so the tool-call block is not extracted into the structured `tool_calls` field of the response. Your agent loop sees `content` (possibly including the raw tool-call text) and no `tool_calls` array. The agent either proceeds without calling the tool, or hallucinates that it called the tool, or loops.

In our eval harness, omitting these two flags produced an **80% false-success simulation rate** — the model appeared to complete tasks 80% of the time by narrating the tool call in content rather than actually emitting a structured tool call the harness could execute. The number looked great. The behavior was fictional. This is the reasoning-model equivalent of the truncation problem: the request looks right, the response looks right, the measurement is a lie.

The diagnostic is simple: send a request that should produce a tool call and inspect the raw response. If `choices[0].message.tool_calls` is present and populated, the parser is working. If it is absent and the tool call is sitting inside `content` as text, your parser flags are missing or wrong.

```bash
# Diagnostic: does the structured tool_calls field populate?
curl -s http://localhost:8888/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3.8-27B-NVFP4",
    "messages": [{"role":"user","content":"Read the file /etc/hostname using the read_file tool."}],
    "tools": [{"type":"function","function":{"name":"read_file","description":"Read a file","parameters":{"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}}}],
    "tool_choice": "auto",
    "chat_template_kwargs": {"enable_thinking": false},
    "max_tokens": 256
  }' | python3 -m json.tool
```

If you see `"tool_calls": [{"id": "...", "function": {"name": "read_file", "arguments": "{\"path\": \"/etc/hostname\"}"}}]`, you are good. If you see the tool call as a string inside `content`, fix the parser flags and restart the server.

---

## 4. A latency probe to verify your control surface

Never trust that a control worked. Measure it. The probe below sends the same prompt twice — once with thinking on, once with thinking off — and compares wall-clock time and token counts. Run it against your own endpoint before you believe any claim in this post, including mine.

```python
import time, json, urllib.request

URL = "http://localhost:8888/v1/chat/completions"
MODEL = "Qwen/Qwen3.8-27B-NVFP4"
PROMPT = "You have tools: read_file, write_file, list_dir. The user wants to see what is in /tmp. Pick one tool and emit its arguments as JSON. Reply with only the JSON."

def call(enable_thinking):
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": PROMPT}],
        "tools": [
            {"type": "function", "function": {"name": "read_file", "description": "Read a file", "parameters": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}}},
            {"type": "function", "function": {"name": "list_dir", "description": "List a directory", "parameters": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}}}
        ],
        "tool_choice": "auto",
        "chat_template_kwargs": {"enable_thinking": enable_thinking},
        "max_tokens": 1024,
    }).encode()
    req = urllib.request.Request(URL, data=body, headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=120).read())
    dt = time.time() - t0
    msg = resp["choices"][0]["message"]
    usage = resp.get("usage", {})
    has_tool_call = bool(msg.get("tool_calls"))
    content_len = len(msg.get("content") or "")
    reasoning_len = len(msg.get("reasoning") or msg.get("reasoning_content") or "")
    return {
        "enable_thinking": enable_thinking,
        "wall_seconds": round(dt, 2),
        "completion_tokens": usage.get("completion_tokens"),
        "reasoning_tokens": usage.get("completion_tokens_details", {}).get("reasoning_tokens", "n/a"),
        "content_chars": content_len,
        "reasoning_chars": reasoning_len,
        "tool_call_emitted": has_tool_call,
    }

print(json.dumps(call(True), indent=2))   # thinking ON
print(json.dumps(call(False), indent=2))  # thinking OFF
```

On our DGX Spark, this probe returns something like:

```
thinking ON:  wall_seconds 18.4, completion_tokens 712, reasoning_tokens 670, tool_call_emitted true
thinking OFF: wall_seconds 1.1, completion_tokens 38,  reasoning_tokens 0,   tool_call_emitted true
```

That is the tax, measured: **18.4s vs 1.1s** for the same tool-dispatch step, with the same correct tool call emitted in both cases. The thinking added 670 tokens of chain-of-thought and 17 seconds of wall-clock, and changed nothing about the answer. If your probe does not show a comparable gap, either your control is not actually toggling thinking (check the SDK-stripping issue), or your model is not a thinking model, or your serving stack is ignoring `chat_template_kwargs`.

---

## 5. The decision framework: when to think, when not to

Not every step in an agent loop benefits from thinking, and not every step that benefits needs the *maximum* thinking budget. The mistake is treating the reasoning model as the default and paying the tax everywhere. The fix is routing: think when the step is genuinely uncertain or multi-step, and switch off (or switch models) when the step is mechanical.

| Step type | Example | Thinking? | Why |
|---|---|---|---|
| Tool dispatch / classification | "Which tool fits this request?" | **Off** | One-shot mapping; the model already knows its tools. Thinking adds latency, not accuracy. |
| File read / status check | "Read /tmp/x and summarize" | **Off** | Mechanical retrieval. No reasoning needed to fetch. |
| Structured extraction | "Pull the date and amount from this text" | **Off** (or small model) | Pattern match, not inference. |
| Multi-step planning | "Design a 5-step approach to migrate this service" | **On** | Genuine decomposition with dependencies. |
| Debugging / root-cause | "The test passes locally but fails in CI — why?" | **On** | Hypothesis generation over evidence. |
| Math / logic / constraint satisfaction | "Does this schedule violate the 2-day ceiling?" | **On** | Reasoning is the value. |
| Code generation (non-trivial) | "Write the auth middleware with rate limiting" | **On** | Design trade-offs require deliberation. |
| Code generation (boilerplate) | "Write a getter for this field" | **Off** | Mechanical. |
| Memory consolidation / insight synthesis | "What is the cross-cutting theme across these 5 notes?" | **On** (with a token bound) | Synthesis is the point — but bound it or it runs away. |

The pattern: **thinking is for steps where the model does not already know the answer and must derive it.** Tool dispatch, retrieval, and extraction are not those steps. Planning, debugging, and synthesis are.

The implementation is a routing layer in your agent loop that tags each step with a `needs_reasoning` flag and either toggles `enable_thinking` on the same model or routes to a different model entirely. In Praxis, this is the planner: the heuristic planner classifies a step's intent and the LLM client gets the flag. You do not need a full planner to get the benefit — a simple intent classifier on the step description is enough to route 80% of the tax away.

---

## 6. Bounding the thinking you keep: `max_tokens` as a spending limit

For the steps where you *do* want thinking, you still need a bound. An unbounded reasoning model on a synthesis step will happily think for 2,000 tokens, and on local hardware that is 50 seconds of box-occupation per step. The bound is `max_tokens` — but you have to set it high enough that the thinking can *finish* and the content can still be emitted, or you get the null-content failure (the model spent the whole budget thinking and never produced an answer).

The failure looks like this: you set `max_tokens=1024` on a synthesis step. The model thinks for 1,020 tokens, hits the limit, and `content` is null because it never got to the conclusion. Your agent loop sees an empty response and honest-fails. The fix is to raise `max_tokens` for reasoning steps specifically — we use 4096 for consolidation/insight passes — so the model has room to think *and* answer:

```python
# Reasoning step: give it room to think AND conclude
body = {
    "model": MODEL,
    "messages": msgs,
    "chat_template_kwargs": {"enable_thinking": True},
    "max_tokens": 4096,   # was 1024 — too small, content came back null
}
```

The principle: **`max_tokens` for a reasoning step must cover (expected thinking) + (expected answer) + (margin).** For a synthesis step, that is roughly 2048 + 512 + 512. For a planning step, similar. For a tool-dispatch step with thinking off, 64–128 is plenty. The number is not a quality dial — it is a spending limit, and setting it too low is worse than setting it too high because it produces a silent null-content failure rather than a slow success.

---

## 7. The full serving configuration, annotated

Here is the SGLang launch line we run on the DGX Spark for Qwen3.8-27B-NVFP4, with every flag that matters for an agent loop annotated. If you are deploying a reasoning model for agentic use, this is the baseline:

```bash
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3.8-27B-NVFP4 \
  --reasoning-parser qwen3 \
  --tool-call-parser qwen3_coder \
  --port 8888 \
  --host 0.0.0.0 \
  --mem-fraction-static 0.80 \
  --context-length 32768
```

| Flag | What it does | What breaks without it |
|---|---|---|
| `--reasoning-parser qwen3` | Parses the reasoning/CoT field out of Qwen3-family output | Reasoning leaks into `content`; null-content misreads; CoT written as the "answer" |
| `--tool-call-parser qwen3_coder` | Extracts structured tool calls from Qwen3 native format | ~80% of tool calls sit in `content` as text; agent loops narrate instead of executing |
| `--mem-fraction-static 0.80` | Pre-allocates 80% of GPU memory for KV cache | OOM under concurrency, or wasted memory at low batch |
| `--context-length 32768` | Sets the max context window | Default may be too small for multi-turn agent sessions with tool results |

Two notes on the model itself. First, Qwen3.8-27B is a multimodal model in this family and needs a `preprocessor_config.json` present and `ninja` installed for the build step — if the server fails to start with a preprocessor error, that is the cause, not your flags. Second, NVFP4 quantization is what fits the model in the Spark's memory budget; the throughput numbers in this post are specific to that quantization on that hardware. A BF16 build will be slower per token but more accurate; an INT4 build will be faster but may degrade tool-call adherence. Measure your own.

---

## 8. What this costs you if you ignore it

I want to be concrete about the downside of leaving the defaults in place, because the defaults are quiet. They do not throw errors. They produce responses. The responses even look correct. The cost shows up in three places:

1. **Wall-clock time per agent run.** A 50-turn session with 35 mechanical steps paying a 15× thinking tax runs 8–10 minutes longer than it needs to. At interactive cadence that is the difference between a tool that feels instant and one that feels broken.

2. **Queue depth under load.** A daemon processing a task queue stalls behind every unbounded thinking request. One consolidation pass that thinks for 1,500 tokens blocks the next task for 40 seconds. Under burst, the queue backs up and tail latency explodes.

3. **False confidence in eval numbers.** If your tool-call parser is misconfigured, your eval reports an 80% success rate that is actually a fiction. You ship the agent. It fails in production because the "tool calls" were narrated, not executed. This is the most dangerous failure because it is invisible until a real user hits it.

None of these throw an exception. All of them degrade the system silently. The discipline is to measure — run the latency probe, inspect the `tool_calls` field, account for thinking tokens in your throughput planning — and to route thinking to the steps that earn it.

---

## 9. The takeaway

Reasoning models are not uniformly better. They are better at a specific class of step — genuine decomposition, debugging, synthesis, constraint satisfaction — and they are expensive at every other step. On local hardware that expense is latency and throughput, not dollars, which makes it easy to ignore and costly to ignore.

The operational discipline is three things:

1. **Measure the tax.** Run the latency probe. Know what thinking costs you in wall-clock on your hardware for your quantization. If you cannot see the gap between thinking-on and thinking-off, you are flying blind.
2. **Control the surface.** Use `chat_template_kwargs: {enable_thinking: false}` sent as raw HTTP for deterministic control. Do not trust the OpenAI SDK to pass it through. Do not trust `/no_think` on SGLang. Verify with the probe, not with documentation.
3. **Route, do not default.** Tag each agent step with whether it needs reasoning. Switch thinking off for tool dispatch, retrieval, and extraction. Switch it on for planning, debugging, and synthesis — and bound it with a `max_tokens` that covers thinking plus answer plus margin.

And configure your parser. `--reasoning-parser qwen3 --tool-call-parser qwen3_coder` on SGLang is not optional for agentic use. Without it, your tool calls are mostly theater. The request looks right. The response looks right. The agent never actually did the work.

Thinking is a tool, not a setting. Use it where it earns its keep, switch it off where it does not, and measure the difference. On local hardware, the difference is the difference between a system your users can rely on and one that feels broken for no visible reason.

---

*Liam Hermes is Chief Development Officer at SMF Works, where he builds agent platforms on local and on-prem hardware. This post draws on live operation of Qwen3.8-27B on an NVIDIA DGX Spark under SGLang. The throughput numbers are specific to NVFP4 quantization on that hardware; measure your own before treating any figure here as a target.*