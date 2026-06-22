---
slug: "structured-outputs-llm"
title: "Structured Outputs from LLMs: The Complete Engineering Guide"
excerpt: "Raw text from language models is unreliable. Structured outputs — JSON schemas, typed responses, validated data — are the bridge between AI experimentation and production reliability. Here's every technique that actually works, from prompt engineering to function calling to native structured output APIs."
date: "2026-06-01"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Software Architecture"]
tags: []
readTime: 12
image: "/images/blog/structured-outputs-llm.png"
originalUrl: "https://smfworks.com/blog/structured-outputs-llm"
canonicalUrl: "https://www.smfclearinghouse.com/blog/structured-outputs-llm"
---
# Structured Outputs from LLMs: The Complete Engineering Guide

You've built the prototype. The LLM generates beautiful prose. Your demo impressed the stakeholders. Then you pushed to production and everything fell apart — because the model sometimes returns JSON, sometimes returns markdown-wrapped JSON, sometimes adds a chatty preamble before the JSON, and sometimes just... doesn't.

This is the structured output problem, and it's the single biggest engineering challenge between "AI works in a notebook" and "AI works in production."

Here's every technique that actually works, ordered from least to most reliable.

## The Problem: Why Raw LLM Output Is Production-Hostile

Language models generate tokens. They're optimized to produce plausible continuations, not valid data structures. When you ask an LLM for JSON, you're asking a text completion engine to be a data serialization format. The mismatch is fundamental:

- **Format drift**: The model adds conversational wrappers ("Here's the JSON you requested:")
- **Schema violations**: Fields appear or disappear across calls
- **Type instability**: Numbers become strings, arrays become single values
- **Edge case failures**: Empty results produce `null` or free-text apologies instead of valid structures

Every production AI system hits these. The question isn't whether you'll encounter them — it's how you engineer around them.

## Technique 1: Prompt Engineering (Last Resort)

```text
You MUST respond with ONLY valid JSON. No markdown. No explanation.
No code fences. No preamble. Start with { and end with }.
```

This is what everyone tries first. It works... most of the time. Maybe 85-90% with GPT-4 class models, significantly less with smaller or open models. The 10-15% failure rate is still too high for production.

**When to use it**: Prototyping, one-off scripts, internal tools where occasional failures are acceptable.

**Why it fails**: The model's training data contains far more JSON-in-markdown than bare JSON. Every code fence example, every tutorial, every documentation snippet teaches the model to wrap JSON in explanations. Your prompt is fighting the entire training distribution.

**Improvements that barely help**:
- Few-shot examples (adds ~3-5% reliability)
- "Think step by step, then output JSON" (helps reasoning, doesn't help format adherence)
- ALL CAPS threats ("NEVER add explanation") (marginal, model-dependent)

## Technique 2: Output Parsing with Fallbacks

Instead of hoping the model produces clean JSON, assume it won't and build a parsing pipeline:

```python
import json
import re

def extract_json(raw: str) -> dict:
    """Try multiple strategies to extract JSON from LLM output."""
    
    # Strategy 1: Try the raw string directly
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    
    # Strategy 2: Extract from markdown code fences
    fence_match = re.search(r'```(?:json)?\s*\n?(.*?)\n```', raw, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass
    
    # Strategy 3: Find first { to last } 
    brace_match = re.search(r'\{.*\}', raw, re.DOTALL)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass
    
    # Strategy 4: Find first [ to last ] (for array responses)
    bracket_match = re.search(r'\[.*\]', raw, re.DOTALL)
    if bracket_match:
        try:
            return json.loads(bracket_match.group(0))
        except json.JSONDecodeError:
            pass
    
    raise ValueError(f"No valid JSON found in response: {raw[:200]}...")
```

This gets you to ~95-98% success rate. The remaining 2-5% includes responses where the model produces structurally invalid JSON — missing commas, trailing commas, unquoted keys, single quotes instead of double quotes.

**Add defensive cleaning:**

```python
def clean_json_string(raw: str) -> str:
    """Fix common LLM JSON mistakes."""
    # Remove trailing commas before } or ]
    raw = re.sub(r',\s*([}\]])', r'\1', raw)
    # Replace single quotes with double quotes (outside of string values)
    # This is a heuristic — use with caution
    raw = raw.replace("'", '"')
    # Remove comments (JS-style)
    raw = re.sub(r'//.*?\n', '\n', raw)
    raw = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL)
    return raw
```

**When to use this**: Any production system that doesn't have native structured output support. This is the pragmatic default.

## Technique 3: Function Calling / Tool Use

Most modern APIs (OpenAI, Anthropic, Together, Gemini) support function calling — you define a schema, and the model returns structured arguments for a "function" rather than free-text:

```python
import openai

client = openai.OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "extract_entities",
        "description": "Extract named entities from the provided text",
        "parameters": {
            "type": "object",
            "properties": {
                "people": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "role": {"type": "string"},
                            "confidence": {"type": "number"}
                        },
                        "required": ["name"]
                    }
                },
                "organizations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "type": {"type": "string", "enum": ["company", "government", "nonprofit"]}
                        },
                        "required": ["name"]
                    }
                }
            }
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Extract entities from: Apple CEO Tim Cook announced..."}],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "extract_entities"}}
)

# Guaranteed valid JSON matching your schema
result = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
```

**Reliability**: 98-99.5%. The schema enforcement is server-side — the API won't return a response that doesn't parse against your JSON Schema definition.

**The catch**: Function calling is optimized for the "call a function" use case. If you just want structured data (not an actual tool invocation), you're bending the API's intent. This works fine in practice but creates slight semantic awkwardness.

**Key detail — `tool_choice`**: 
- `auto`: Model decides whether to use the tool (may refuse)
- `required`: Model MUST use a tool (but can choose which one)
- `{"type": "function", "function": {"name": "..."}}`: Model MUST use this specific function

Always use the third form when you need guaranteed structured output.

## Technique 4: Native Structured Output APIs

The newest and most reliable approach. OpenAI, Anthropic, and others now offer first-class structured output endpoints that guarantee response validity:

```python
from openai import OpenAI
from pydantic import BaseModel

class ExtractionResult(BaseModel):
    summary: str
    entities: list[str]
    sentiment: str  # Will be constrained below
    confidence: float

client = OpenAI()

response = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[{"role": "user", "content": "Analyze this text: ..."}],
    response_format=ExtractionResult,
)

# Direct typed access — no parsing, no validation
result: ExtractionResult = response.choices[0].message.parsed
print(result.summary, result.sentiment, result.confidence)
```

**Reliability**: 99.9%+. These APIs use constrained decoding — the model physically cannot produce tokens that violate the schema. It's not a post-hoc filter; the token probabilities are masked at generation time.

**Provider landscape (mid-2026)**:

| Provider | API | Constrained Decoding | Notes |
|----------|-----|---------------------|-------|
| OpenAI | `/chat/completions` with `response_format` | Yes | JSON Schema or Pydantic models; supports enums, unions |
| Anthropic | Tool use with `tool_choice` | Partial | High reliability via function calling, not native constrained decoding |
| Together AI | `/chat/completions` with `response_format` | Yes | FLUX-style JSON mode for multiple models |
| Gemini | `response_mime_type="application/json"` + schema | Yes | Good enum and array support |
| Ollama | Structured outputs (JSON mode + schema) | Yes | Works with local models via llama.cpp grammar |
| DeepSeek | Function calling mode | Partial | Similar to Anthropic's approach |

## Technique 5: Constrained Decoding with Local Models

If you're running models locally (via Ollama, vLLM, llama.cpp), you get the ultimate control: grammar-based constrained decoding. The model can only generate tokens that produce valid output according to a formal grammar.

```python
# With Ollama's structured output support
import ollama

class Person(BaseModel):
    name: str
    age: int
    role: str

response = ollama.chat(
    model='llama3.1',
    messages=[{'role': 'user', 'content': 'Extract the person: John is a 32-year-old engineer'}],
    format=Person.model_json_schema(),
)

person = Person.model_validate_json(response['message']['content'])
```

Under the hood, this uses GBNF (Grammar-Based Naive Bayes) or similar grammar engines that modify the logit distribution at every token step. Only tokens that would continue a valid parse are available for sampling.

**When to use this**: When you need 100% guaranteed structured output, you're running local models, and latency/timing allows it. This is the gold standard for reliability.

## The Engineering Stack I Recommend

After deploying structured output pipelines across multiple production systems, here's what I'd actually use:

### For cloud APIs (OpenAI, Anthropic, etc.)

```
Native Structured Output API → JSON Schema validation → Pydantic model
```

Use the provider's structured output endpoint. Validate the result against a Pydantic model. On the rare validation failure (<0.1%), retry once. If it fails twice, log and fall back.

### For local models (Ollama, vLLM)

```
Grammar-constrained decoding → Pydantic model validation → Retry on validation error
```

### For legacy/unstructured APIs

```
Prompt engineering → extract_json() with fallbacks → Pydantic validation → Retry up to 3 times
```

### The retry wrapper pattern

Every system needs this:

```python
from pydantic import BaseModel, ValidationError
import json

MAX_RETRIES = 3

def get_structured_output(prompt: str, model: str, schema: type[BaseModel]) -> BaseModel:
    """Get guaranteed structured output with retries and escalation."""
    errors = []
    
    for attempt in range(MAX_RETRIES):
        try:
            # Try native structured output first
            raw = call_llm(prompt, model, response_format=schema)
            return schema.model_validate_json(raw)
        except (json.JSONDecodeError, ValidationError) as e:
            errors.append(str(e))
            if attempt < MAX_RETRIES - 1:
                # Escalate: add error context to prompt
                prompt = f"{prompt}\n\nPrevious attempt failed with: {e}\nPlease respond with valid JSON."
            continue
    
    # If we get here, all retries failed
    raise RuntimeError(
        f"Failed to get valid structured output after {MAX_RETRIES} attempts. "
        f"Errors: {'; '.join(errors)}"
    )
```

## Common Pitfalls

**1. Schema complexity kills reliability.** A schema with 20 nested fields and 5 levels of depth will fail far more often than a flat schema with 5 fields. Design your schemas to be as simple as possible. Prefer multiple simple calls over one complex call.

**2. Enums are your friend.** If a field can only have certain values, constrain it. `"type": {"type": "string", "enum": ["bug", "feature", "question"]}` eliminates an entire class of validation failures.

**3. Required vs optional matters.** Mark fields as required only if they're truly required. Optional fields give the model flexibility on edge cases. But always validate required fields are present.

**4. Number precision.** LLMs sometimes return `"3.0"` for an integer field or `"0.1 + 0.2"` as an expression. Pydantic's `strict=True` catches these. Use non-strict validation for resilience, strict for precision.

**5. The "I'm sorry" response.** Sometimes the model refuses to answer and returns an apology in JSON: `{"error": "I cannot process this request..."}`. Your validation layer needs to handle this — check for known error patterns before schema validation.

**6. Streaming + structured output = pain.** Constrained decoding and streaming are fundamentally at odds. The model can't guarantee valid JSON on incomplete tokens. If you need streaming UX, consider streaming plain text and doing a single structured extraction call at the end.

## What This Looks Like in Practice: Hermes AI

At SMF Works, our Hermes agent framework handles structured output across every interaction layer. When Hermes calls an LLM for tool use, it uses function calling schemas that define exact parameter types. When it writes content to our blog pipeline, it validates frontmatter against a schema before building. When it coordinates sub-agents, it expects structured task briefs with defined fields.

The result: our content pipeline has produced ~20 blog posts with zero frontmatter failures. Our tool dispatch has near-zero parse errors. The investment in structured output engineering pays compound dividends — every new feature builds on a reliable data foundation rather than fighting format drift.

## Bottom Line

Structured output isn't a nice-to-have. It's the difference between a demo and a product. Start with whatever your provider offers natively (technique 3 or 4), wrap it in Pydantic validation, add retries with error context, and never trust raw LLM output in a pipeline.

The techniques scale from simple to robust. Use the most robust one your infrastructure supports. Your future self — debugging production at 2 AM — will thank you.