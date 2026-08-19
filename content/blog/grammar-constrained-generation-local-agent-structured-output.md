---
slug: "grammar-constrained-generation-local-agent-structured-output"
title: "Grammar-Constrained Generation: Making Local Models Emit Valid JSON on the First Try"
excerpt: "Tool-calling agents need machine-parseable output every time, but local models still emit malformed JSON often enough to matter. Constrained decoding closes that gap at the sampler level instead of hoping the model cooperates — here is how it works, when to use it, and where it silently breaks."
date: "2026-08-19"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Local LLMs", "AI Agents", "Linux", "Open Source"]
tags: ["constrained-decoding", "gbnf", "llama.cpp", "ollama", "structured-output", "json-schema", "agent-architecture", "reliability"]
readTime: 14
image: "/images/blog/grammar-constrained-generation-local-agent-structured-output-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/grammar-constrained-generation-local-agent-structured-output"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

A coding agent calls the model and asks for a tool invocation. The response is 99% valid JSON — but the field that was supposed to be a boolean contains the string `"true"`. The tool dispatcher tries `bool(...)`, gets `True` for any non-empty string, and executes the wrong branch. Nothing threw an exception. The failure is silent.

This is the underlying reliability problem in agentic systems: the model almost always does the right thing, and the small fraction of the time it does not is exactly when damage compounds. Retry loops mask it until the model drifts enough that retries stack into a failed trajectory. Validation catches it after the fact but cannot make the model produce valid output — it can only reject and ask again, spending another round-trip and more of the user's latency.

**Constrained decoding** fixes this at the source. Instead of validating the model's output after it is generated, you alter the sampling distribution so the model cannot emit tokens that violate a grammar. The post-processing check becomes a near-formality rather than the load-bearing reliability mechanism.

This post is the practical version: how the technique works, the three implementations worth using on local hardware (llama.cpp's GBNF, Ollama's structured-output field, and the outlines/xgrammar library layer), where each one fits, and — most importantly — the ways they silently fail and what to do about it. I am writing from the perspective of someone who runs Hermes agents on Linux with local Ollama and llama.cpp backends on AMD GPUs, but the technique is tool-agnostic and the pitfalls travel.

---

## 1. Why "ask politely and validate" does not scale

The standard pattern for getting structured output from an LLM looks like this:

1. Put "respond in JSON" in the system prompt.
2. Show a couple of JSON examples.
3. Parse the response. If it fails, retry, possibly with the error message appended.

This works well enough on hosted frontier models with large contexts, instruction-tuned to follow format instructions, and enough parameter mass that format drift is rare. It works materially less well on the 7B–32B local models most of us actually run at home and in the lab. The failure rate is low — call it 0.5% to 3% on a clean prompt with a well-trained model — but an agent loop that makes fifty tool calls in a session turns a 1% per-call error into a ~40% chance of at least one parse failure per session. At higher temperatures or with smaller models, the number gets worse fast.

Three things compound the problem:

| Source of drift | Symptom | Why retry does not save you |
|---|---|---|
| Field that should be a bool comes back as `"true"`/`"yes"` | Wrong branch in tool dispatcher | Retry often produces a *different* malformed shape; you draw from the same bad distribution |
| Number comes back as `"1,234.56"` (locale-formatted) or with surrounding text | `float(...)` raises `ValueError` | The model "knows" it should be a number; it just rendered it wrong |
| String field contains a trailing explanation: `"success — the file was written."` | Either parses to a weird string or breaks a downstream consumer expecting a bare token | Extra verbiage is a *feature* of instruction-tuned prose, not a bug the model knew to suppress |

Retry-and-repair works as a safety net. It is not a reliability strategy. A reliability strategy is one where the *rate of malformed output* is driven as close to zero as the implementation allows, with retry as a defense in depth.

Constrained decoding does that by construction: the malformed output is not generated in the first place.

---

## 2. How constrained decoding actually works

This is the part that gets hand-waved. The mechanism is worth understanding because it explains every failure mode in section 5.

A causal language model produces a probability distribution over the next token. Sampling (greedy, temperature, top-p, etc.) picks from that distribution. Constrained decoding sits between the distribution and the sampler: before the sampler runs, it zeroes out the logits of any token that, if appended to the current decoded sequence, would make the sequence *unparseable* under the grammar.

```text
model forward pass
       │
       ▼
   logits over vocab                       valid token?
       │                                   ┌──────────┐
       ▼                              ┌───▶│  keep    │───▶ sampler → token
┌────────────┐   next token candidate │     └──────────┘
│  context   │─────────────────────────┤
│  so far   │                         │     ┌──────────┐
│ `"name": ` │                         └───▶│  mask →  │───▶ cannot be chosen
└────────────┘                              │ -inf    │
       ▲                                    └──────────┘
       │
   grammar parser state
   (current rule: expecting a string literal)
```

The grammar is a state machine. After every emitted token, the parser advances its state. From that state, the set of *allowed next tokens* is computable. Tokens outside that set get their logits set to negative infinity (or equivalent mask), so the sampler can never pick them.

The critical property: this guarantees the *prefix* is always parseable up to the current point, but it does not guarantee the sequence is *complete and valid* when the model decides to stop. That distinction is where a lot of the real-world bugs live, and it is where the implementation choice starts to matter.

The grammar can be expressed as:

- **GBNF** (llama.cpp GGML BNF) — a BNF-style grammar language tied to llama.cpp.
- **JSON Schema** — pass a JSON Schema, and a library derives the grammar from it.
- **Regular expression** — for constrained string formats (dates, uuids, code identifiers).

Of these, JSON Schema is the one you will use most often in agent systems because your tool schemas probably already are JSON Schemas. The conversion from schema to grammar is non-trivial — the tool does it for you — and the quality of that conversion is one of the things that varies between implementations.

---

## 3. The three implementations worth using

### 3.1 llama.cpp GBNF — the most control, the most work

llama.cpp has supported GBNF grammars for a long time. You write a `.gbnf` file, pass it to the server with `--grammar-file` or pass the grammar string on the request.

A small grammar that emits a JSON object with a `command` string and an `args` array:

```text
# tool-call.gbnf
root        ::= "{" ws "\"command\"" ws ":" ws string ws "," ws "\"args\"" ws ":" ws array ws "}"
string      ::= "\"" ( [^"\\\n] | "\\" .)* "\""
array       ::= "[" ws (string (ws "," ws string)*)? ws "]"
ws          ::= [ \t\n]*
```

Run the server with the grammar available and request it on the call:

```bash
# start the server with the grammar file staged
./llama-server \
  -m ~/models/qwen3-8b-instruct-q4_k_m.gguf \
  --grammar-file ./grammars/tool-call.gbnf \
  -c 8192 --port 8080 --n-gpu-layers 99
```

```bash
# request using the grammar inline
curl -s http://127.0.0.1:8080/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a shell tool router. Output a JSON object."},
      {"role": "user", "content": "List files in /var/log that changed today."}
    ],
    "grammar": "{\"root\": \"...the same gbnf...\"}",
    "temperature": 0.2,
    "max_tokens": 200
  }'
```

GBNF is the most expressive option — you can express things JSON Schema cannot (capitalized alphabetic-only fields, exact string enums, custom number formats). It is also the most manual. You write the grammar, you keep it in sync with the schema, you test it. For a tool dispatcher with three tools that never change, GBNF is the right call. For a registry of forty tools that evolves weekly, write a generator.

### 3.2 Ollama — the least work, the most common fit

Ollama wraps llama.cpp and exposes structured output through a `format` field on the generate/chat API. You pass either `"json"` (constrain to any valid JSON) or a JSON Schema object (constrain to *that shape*). Ollama derives the GBNF for you under the hood.

```bash
# constrain to a specific shape via the chat API
curl -s http://127.0.0.1:11434/api/chat -d '{
  "model": "qwen3:8b-instruct-q4_K_M",
  "stream": false,
  "messages": [
    {"role": "system", "content": "You route user intent to a shell tool."},
    {"role": "user", "content": "free space on the root filesystem"}
  ],
  "format": {
    "type": "object",
    "properties": {
      "command": {"type": "string", "enum": ["df", "du", "ls", "find"]},
      "args": {"type": "array", "items": {"type": "string"}, "maxItems": 6}
    },
    "required": ["command", "args"]
  },
  "options": {"temperature": 0.2}
}' | jq -r '.message.content'
```

For the unconstrained-but-valid-JSON case, `"format": "json"` is one field. That alone collapses the malformed-JSON rate to near zero on most models — which is often enough for the case where you just need *a* JSON object and you trust the model's field choice.

```bash
curl -s http://127.0.0.1:11434/api/chat -d '{
  "model": "qwen3:8b-instruct-q4_K_M",
  "stream": false,
  "messages": [{"role": "user", "content": "Summarize this issue as one JSON object with keys title and severity."}],
  "format": "json"
}'
```

The trade-off: Ollama's JSON Schema support covers the core subset. `oneOf`, `$ref`, advanced `pattern` constraints, and union types support varies between Ollama versions — check the version you are on, do not assume the latest syntax works. For Hermes, the agent's tool schemas are JSON Schemas and we hand most of them to Ollama's `format` field directly; the schemas that use features Ollama does not implement get rewritten to a simpler equivalent before the call.

### 3.3 outlines / xgrammar — when you need cross-runtime consistency

[Outlines](https://github.com/dottxt-ai/outlines) and [xgrammar](https://github.com/mlc-ai/xgrammar) are library layers that compile JSON Schema (or regex, or Python type annotations) to a grammar and apply it to a model's logits at generation time. Outlines works with HF Transformers, vLLM, and llama-cpp-python; xgrammar is the structured-output engine behind the latest vLLM releases.

The reason to reach for one of these instead of just using Ollama's `format` field is **cross-runtime consistency**. If you are writing a library that has to produce the same constrained behavior whether the user points it at Ollama, a vLLM server, or a local Transformers model, the runtime-native grammar support is not portable. A library that holds the grammar compiles once and applies it whatever the backend.

```python
# outlines: compile a JSON Schema to a generator once, reuse
import outlines

# a typed generator compiles its own schema from the type signature
@outlines.generate.json(model)
def route_intent(goal: str):
    """Return command + args; types define the schema."""
    # model is an already-loaded outlines model wrapper
    ...
# route_intent("free space on root fs") -> {"command": "df", "args": [...]}
```

For agent systems where the backend is swappable, this is the layer you want. For a single-Ollama deployment, it is overkill — the native `format` field is doing the same job with less glue.

### Decision tree — which one do I reach for?

```text
Need constrained output?
│
├─ one Ollama backend, mostly JSON+Schema ───▶ Ollama format field. Done.
│
├─ one llama.cpp server, custom grammar
│   or fields JSON Schema cannot describe ──▶ write GBNF, pass --grammar
│
├─ multiple runtimes, or it is a library
│   that other people will plug their backend into ─▶ outlines / xgrammar
│
└─ none of the above; you just cannot rely on the model
    to be clean today ─▶ add structured-output validation + retry,
    plan to add constrained decoding in the next release, do not skip it
```

---

## 4. Where this changes the agent architecture

The interesting effect of constrained decoding is not "fewer parse errors." It is that it lets you delete code.

A tool-calling loop without constrained decoding needs, per tool call:

- A format prompt (system message)
- A retry-on-parse-failure loop (1–3 attempts)
- A validator that distinguishes "structurally wrong" from "semantically plausible but wrong"
- A repair strategy (re-ask, or try to coerce the bad field)

With constrained decoding that enforces the tool's JSON Schema, the first three collapse into a single post-generation validation pass that almost never rejects. The retry loop can be dropped, or kept as a one-shot safety net that rarely fires. The repair strategy becomes unnecessary if the schema was strict enough that any parseable output is also semantically valid; if it was not strict enough, no amount of decoding control rescues it.

A before/after sketch:

```python
# before — the validation-and-retry loop you wrote by hand
def call_tool(model, tool_schema, goal, retries=3):
    for attempt in range(retries):
        raw = model.chat(messages=[system_prompt(tool_schema), user(goal)])
        try:
            parsed = json.loads(raw)
            validate(parsed, tool_schema)        # jsonschema
            return parsed
        except (json.JSONDecodeError, ValidationError) as e:
            last_err = e
            goal = f"{goal}\n\nPrevious output was invalid: {e}. Fix it."
    raise ToolCallFailed(f"could not produce valid output after {retries} tries: {last_err}")
```

```python
# after — schema is enforced by the sampler; validation is defense in depth
def call_tool(model_client, tool_schema, goal):
    # ollama example; the schema is handed to the runtime as `format`
    resp = model_client.chat(
        messages=[system_prompt(tool_schema), user(goal)],
        format=tool_schema,                     # constrained at the sampler
        options={"temperature": 0.2},
    )
    parsed = json.loads(resp["message"]["content"])  # parses by construction
    validate(parsed, tool_schema)               # defense in depth; ~never fires
    return parsed
```

The second version is shorter, is faster (no retries), and is more honest: the reliability mechanism is the sampler, not a prayer. The validation is still there because defense in depth is the right posture — but you stop treating it as the primary mechanism.

The architectural consequence: tool dispatchers get simpler, retry paths get rarer, and the conversations that used to grow fat with "your last output was invalid: <error>" repair exchanges stop doing that. That matters more than it sounds — those repair exchanges consume context window. Bounded tool outputs (a topic I wrote about in *Your Agent's Context Window Is Not a Log Sink*) get a lot easier to enforce when the output shape is guaranteed by the grammar rather than asking the model to behave.

---

## 5. The failure modes nobody warns you about

This is the part that sells the technique back to reality. Constrained decoding is genuinely reliable for *structure* and it is surprisingly easy to misuse for *content*. The silent failures are real.

### 5.1 "Valid JSON, wrong answer"

The grammar guarantees shape. It does not guarantee that the string *value* is the right one. A field constrained to `{"type": "string", "enum": ["df", "du", "ls", "find"]}` will always be one of those four values — but the model can still pick `find` when the user wanted `df`. Constrained decoding cannot fix a model that does not understand the task. It only stops it from producing output the downstream code refuses to accept.

The corollary: if your schema is too loose, you have moved the failure from "JSON parse error" to "valid JSON that does the wrong thing." The urgency of fixing it is lower; the visibility is also lower. Add semantic validation (a small check that `command` is a sane choice for the request) at the boundary, even when the parser is satisfied.

### 5.2 Reasoning models and the masked "thinking" budget

Reasoning models like Qwen3-thinking, DeepSeek-R1, and Kimi reasoning models interleave chain-of-thought with the answer. Constrained decoding applied to the *entire* generation blocks the model from producing its reasoning strings because CoT is not valid JSON. The two standard fixes:

- **Mask only the final answer segment.** Use an end-of-reasoning delimiter (Qwen3 uses ``); only switch the grammar on after the delimiter is emitted. Ollama does this for some models but it is model- and version-specific; check, do not assume.
- **Disable thinking.** For tool routing, dispatch decisions are not improved enough by long CoT to justify the cost. Many models accept a `/no_think` or equivalent control token in the prompt; Qwen3 honors it. For pure structured-output tool dispatch, turning reasoning off and routing on a smaller/faster model is usually the better trade.

If you see a reasoning model "produce shorter, dumber answers" under a `format: json` constraint, suspect that the constraint is silently chopping off the CoT the model was relying on, rather than that constrained decoding itself degrades reasoning.

### 5.3 Truncation silently produces invalid output

The grammar guarantees the *prefix* is parseable. If `max_tokens` cuts the generation mid-object — `"command": "df", "args": ["-h", "/", "—` — the parser rejects it. With aggressive `max_tokens` budgets (which you should use, per the bounded-output principle), truncation is the single most common cause of parse failure *even with constrained decoding*. The fix is not to raise the budget to infinity:

- Set `max_tokens` to a value slightly above the *realistic* length of the smallest acceptable output for the schema, plus a margin.
- Treat truncation as a *distinct* failure mode from a real parse error. Re-ask with a higher ceiling; do not just retry with the same budget and hope the model is terser this time.
- Where the runtime supports it, add an "end-of-grammar" check: the grammar parser exposes whether the current state is an *accept* state. If the model emitted its EOS token but the parser is not in an accept state, the output is incomplete; do not parse it as success.

### 5.4 The schema that compiles to a different grammar than you expect

This is the most subtle one. JSON Schema → grammar conversion is not uniquely defined. `additionalProperties: false` is honored by some compilers and ignored by others. `oneOf`/`anyOf` support varies. Default values, `$defs`/`$ref` resolution, and `pattern` constraints behave differently across Ollama, llama.cpp, outlines, and xgrammar.

The practical consequence: **your schema is not your contract; the compiled grammar is your contract.** When you change runtimes or upgrade, re-run your evals. Constrained output that worked on Ollama 0.5 can silently stop constraining a field you relied on after an Ollama update that rewrote the schema-to-grammar path. Trust the *observed* output, not the schema you passed in.

A 30-line eval harness that runs your real tool schemas against the runtime and checks that the constraint actually holds — invalid-value rejection, truncation rejection, enum enforcement — is the only way to know. The technique is reliable *when the implementation matches the schema*. The implementation is the part that drifts.

### 5.5 Quantized models can refuse to produce *some* valid grammars

A heavily quantized model (Q3/Q4) sometimes has a token probability distribution so flat in the constrained space that it cycles — emitting the same closing token, or repeating a key, because the grammar keeps allowing it and the model has nothing better to offer. The output is valid per the grammar but is nonsense. Symptoms: repeated keys in the same object, `"args": []` when args were expected, or a model that emits a single quote and then a single unquote and stops.

Mitigations:

- Prefer Q4_K_M / Q5_K_M over Q3 for any model doing structured dispatch. The quality gap on tool-calling tasks between Q4 and Q3 is disproportionate to the size gap.
- Lower temperature for routing decisions (the typical agent pattern is 0.1–0.3 for dispatch, higher for creative tasks the same model does in other calls). Constrained decoding and low temperature together make a model very deterministic and usually solve the cycling.
- If a specific model cycles on a specific grammar, the grammar is often the issue — narrow `minItems`, `minLength`, or an explicit enum and the cycling stops.

---

## 6. A note on cost and latency

Constrained decoding is not free. Computing the allowed-token mask per step is extra work per token, and the cost grows with grammar complexity. On local hardware the overhead is usually a single-digit-percent latency cost on the generation step and is dwarfed by the savings from not retrying. On hosted servers billing per token, the mask computation is amortized at the engine layer (vLLM, SGLang) so it is essentially free per request. It is not a reason to avoid the technique.

The cost that actually matters is *where* you apply it. Constraining every model call in an agent loop — including free-text reasoning, summarization, memory writes — is wasteful and sometimes harmful. Apply it where the consumer of the output is *code*. Free-form prose that is read by humans or fed back into the model should not be constrained; doing so makes the output worse and the model slower for no reliability gain.

Rule of thumb:

```text
output is consumed by      │ constraint?
───────────────────────────┼──────────────────────
code (tool dispatcher)     │ yes — JSON Schema, strict
code (validator, parser)    │ yes — JSON or regex grammar
code (function signature)   │ yes — typed enum/schema
human, or fed back as text  │ no
memory write (prose)       │ no — validate shape after, do not constrain
creative / exploration      │ definitely no
```

---

## 7. What I would do tomorrow if I were starting today

For a Hermes or any tool-calling agent on local Linux hardware, the priority order I would apply is:

1. **Move every tool-call path to Ollama's `format` field (JSON Schema).** One API field, no library, no grammar authoring. You delete the retry loop for ~all tool schemas today.
2. **Keep a `validate()` call after the generation.** Defense in depth. It fires essentially never, but when it fires you want to know, because it means the runtime drifted.
3. **Write a tiny eval harness** (one script, a dozen tool schemas, assertions on the constraint actually holding) and run it on every model and runtime upgrade. The technique is reliable when the implementation matches the schema — verify that it does.
4. **Handle truncation as a distinct failure mode.** Incomplete-and-constrained is not the same bug as malformed-but-unconstrained; treat and re-ask differently.
5. **Turn off reasoning for dispatch calls** where the reasoning adds cost more than quality. Routing decisions are not improved enough by long CoT to justify the latency and the CoT-vs-grammar interaction.
6. **Do not constrain free-text outputs.** Memory writes, summaries, and reasoning should be validated for shape after the fact if needed, but constraining them at the sampler actively degrades the output.

That sequence gets you most of the reliability benefit with the least engineering surface area. The GBNF and outlines paths exist for when the simple path is not enough — and most of the time, for tool routing, it is enough.

---

Structured output is the rare agentic-systems technique that gives you a large reliability improvement for a small implementation cost. The reason most teams have not adopted it broadly is the same reason most teams have not adopted deterministic fallbacks and bounded tool outputs: it requires understanding that the model is a component with failure modes, and that the right place to fix those failure modes is the boundary you control — the sampler, the tool result size, the routing policy — not the prompt you beg the model with.

The model is going to hallucinate a wrong-but-valid JSON field eventually. Constrained decoding cannot stop that. What it does is stop the much larger class of failures where the output was never going to be usable in the first place — and that class is most of them. Fix the boundary first. Then worry about the model.

---

*This is part of an ongoing series on building production-grade local AI agent systems at SMF Works. Earlier posts in the same line: [model routing with deterministic fallback](/blog/model-routing-agent-systems-deterministic-fallback), [bounded tool outputs](/blog/bounded-tool-output-local-ai-agents), and [tool governance by risk class](/blog/agent-tool-governance-risk-classes-approval-gates).*
