---
slug: "what-the-gpt-oss-120b-coding-failure-actually-means"
title: "What the GPT-OSS-120B Coding Failure Actually Means"
excerpt: "The 10% coding pass rate looks damning. But the same model scored 93.8% on agentic tasks that require writing working code. The real story is about benchmark harnesses, not model intelligence."
date: "2026-07-08"
categories: ["AI Models", "Benchmarking"]
image: "/images/blog/gpt-oss-coding-failure-hero.svg"
readTime: 8
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
tags: ["the-signal", "marketing"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/what-the-gpt-oss-120b-coding-failure-actually-means/"
---
Ten percent. Three out of thirty coding tests passed. Twenty-seven failures, every single one a SyntaxError or IndentationError. If you stopped there — and most people will — GPT-OSS-120B looks like a model that cannot code. The number is damning enough to end the conversation.

But you should not stop there. Because the same model, running on the same hardware in the same benchmark suite on the same day, scored 93.8% — fifteen out of sixteen — on agentic tasks that require writing and executing working Python code. Not multiple choice. Not text generation. Working Python. The agentic suite includes building Pong and Snake from scratch. The model wrote them, the harness ran them, and they worked.

A model that cannot code does not build a playable Pong game. Something else is going on, and the something else is not about the model. It is about the harness.

## The Two Numbers

The benchmark in question is Nemo's "Beyond the Leaderboard" suite, run through smf-bench against GPT-OSS-120B on a DGX Spark in MXFP4 quantization. The full results were published this week at smfclearinghouse.com. Here are the two numbers that matter:

| Suite | Pass Rate | Tasks | Failure Mode |
|-------|-----------|-------|-------------|
| Coding | 10.0% (3/30) | Code generation, extraction, execution | 27/27 failures are SyntaxError or IndentationError |
| Agentic | 93.8% (15/16) | Multi-step tasks requiring working Python output | 1 failure, task complexity related |

Read those two rows together. The same model that fails 90% of coding tests passes 93.8% of tasks that are strictly harder — tasks that require the model to plan, write code, execute it, read the output, and iterate. The agentic suite is not easier than the coding suite. It is a superset of it. Writing a Snake game requires writing Python. The agentic suite just happens to execute the code through a different path — one that does not pass through the coding evaluator's extraction layer.

That is the clue.

## What GPT-OSS Does Differently

GPT-OSS uses OpenAI's Harmony response format. This is not a quirk. It is the model's native output protocol. Harmony structures responses into channels — analysis, commentary, final — and wraps each section in special tokens. A typical response looks something like this in its raw form:

```
<|channel|analysis|>
Let me work through the algorithm...
<|channel|final|>
```python
def solve(arr):
    result = []
    for item in arr:
        result.append(item * 2)
    return result
```
```

The model is doing exactly what it was trained to do: separating its reasoning into an analysis channel and presenting the finished code in a final channel wrapped in markdown fences. This is correct behavior for a Harmony-native model. The output is structured, legible, and machine-parseable — if the parser knows what to look for.

The problem is that smf-bench's coding evaluator does not know what to look for.

## The Extraction Bug

The coding suite works as follows: the model generates a response containing code, the evaluator extracts the code block from the response text, and the extracted code is written to a file and executed with Python. If extraction succeeds, the code runs and the test passes or fails on its merits. If extraction fails — if the extracted text is not valid Python — the test fails before the code ever reaches the interpreter.

Here is what happens when the evaluator extracts code from a Harmony-formatted response. The extraction is designed to pull code from markdown fences. But when the response contains channel tokens interleaved with code fences, the extraction can capture more than the Python. It can capture the `<|channel|...|>` tokens. It can capture the outer markdown fences themselves. And the moment any of that non-Python text ends up in the extracted string, the file that gets handed to the Python interpreter is not Python. It is Python mixed with markup.

Python's response to that is immediate and unforgiving:

```
SyntaxError: invalid syntax
```

Or, when the extraction includes line artifacts that misalign indentation:

```
IndentationError: expected an indented block
```

These are not code bugs. The model did not write bad Python. The harness extracted bad Python — Python contaminated with the model's native output formatting. Every one of the 27 coding failures is a SyntaxError or IndentationError. Not a logic error. Not a runtime error. Not a wrong answer. The code never executed at all, because it was never valid Python by the time it reached the interpreter.

## The Agentic Suite Tells the Truth

The agentic suite does not have this problem because it does not extract code the same way. The agentic harness executes the model's output through a different path — one that either strips formatting more aggressively or runs the code in a context where the Harmony tokens are handled before execution. The result is that the same model, producing the same quality of Python, scores 93.8% instead of 10%.

This is the evidence that closes the case. If the model could not code, it would fail in the agentic suite too. The agentic tasks are harder. They require the model to write code that actually compiles, runs, and produces a working game or a correct result — and then to observe the output and iterate. GPT-OSS does this reliably. It writes working Python. It builds games that run. It reads output and adjusts.

The coding suite's 10% is not measuring GPT-OSS's coding ability. It is measuring the coding evaluator's compatibility with the Harmony format. The number tells you about the harness, not the model.

## What the Adjusted Numbers Show

Nemo made the right call in the original analysis. Rather than treating the 27 coding failures as legitimate model failures, the report recategorizes them as inconclusive — tests where the harness could not produce a valid measurement because of format incompatibility. Here is what the adjusted picture looks like:

| Metric | Value |
|--------|-------|
| Total tasks across all suites | 154 |
| Conclusive passes | 108 |
| Coding failures recategorized as inconclusive | 27 |
| Adjusted pass rate | 108 / 154 = 70.1% |

Seventy percent. That is a very different model from the one the 10% number describes. It is not a frontier leader — the same benchmark suite shows models like Claude Opus 4.8 Fast and Kimi K2.6 scoring higher. But it is a competent model that can reason, write code, and execute multi-step tasks. The 10% number was never the model's score. It was the harness's score, attributed to the model.

In Nemo's own words from the benchmark report: "This is a benchmark harness compatibility issue, not a model deficiency. The model writes working code in the agentic suite."

## Why This Matters Beyond GPT-OSS

The instinct when a model scores poorly is to blame the model. That instinct is usually right — most models that score badly on coding benchmarks do so because they write bad code. But the instinct is only right when the harness is correct. And the assumption that the harness is correct is exactly the assumption that should never go unexamined.

Benchmark harnesses are software. They have parsers, extractors, evaluators, and execution environments. They make assumptions about the format of the data they receive. When a model produces output in a format the harness was not designed to expect — a different response protocol, a different code fence convention, a different tokenization scheme — the harness can fail silently. It does not throw an error saying "unrecognized format." It extracts what it can, hands the result to the interpreter, and records a SyntaxError as a model failure. The failure looks exactly like a model failure. It has the same error type. It shows up in the same column. And unless someone asks the question "why are all 27 failures SyntaxErrors?" nobody notices that the harness is the one that is broken.

This will happen more, not less, as the model ecosystem diversifies. GPT-OSS uses Harmony. Other models use other response formats — raw text, structured XML, custom channel schemas, tool-call protocols that wrap output in JSON. Every new format is a potential incompatibility with a harness that was built and validated against a different format. The assumption that a benchmark built for one generation of models will correctly measure the next generation is an assumption that needs to be tested, not trusted.

## The Fix

The fix for smf-bench is straightforward, and the original report identifies it: update the coding evaluator's extraction logic to strip Harmony channel tokens and markdown fences before parsing. The extraction should recognize the Harmony format as a known output protocol, strip the channel markers, and pull only the content between code fences — not the fences themselves. This is not a research problem. It is an engineering task. A regex or a small parser that handles the Harmony token schema would resolve it.

More broadly, benchmark harnesses need to treat response format as a first-class compatibility concern. When a new model is added to a benchmark suite, the harness should validate that it can correctly parse that model's output format before recording results. A simple pre-check — generate a known response in the model's native format, run it through the extractor, confirm the output is valid Python — would have caught this issue before a single coding test ran. Instead, the 27 failures were recorded, the 10% was published, and it took a human reading the failure types to realize something was wrong.

## The Lesson

The lesson is not that GPT-OSS is a good coding model. That is a separate question, and the 70.1% adjusted rate — while respectable — does not put it at the top of the leaderboard. The lesson is that benchmark numbers are only as trustworthy as the harness that produces them, and harnesses are not neutral instruments. They encode assumptions about how models communicate, and those assumptions can break silently when a model communicates differently.

The 10% coding pass rate for GPT-OSS-120B was reported. It was read. And for a moment, it looked like a story about a model that cannot code. It was actually a story about a harness that cannot parse. The difference matters — not just for GPT-OSS, but for every model that will be measured against a benchmark built for a different format. If the harness cannot read the output, the score tells you nothing about the model. It tells you about the gap between the harness and the model's native protocol.

Benchmark frameworks matter as much as models. The next time a model posts a surprisingly low score on a specific suite, the first question should not be "what is wrong with the model?" It should be "what does the harness expect, and does the model produce that?"

At SMF Works, that is the question we will be asking before we publish any benchmark result going forward. The alternative is publishing numbers that measure our tools instead of our models — and that is a mistake we only make if we refuse to learn from this one.

---

*The Signal publishes evidence-based analysis on AI models, benchmarks, and deployment. Benchmark data cited from Nemo's "Beyond the Leaderboard" GPT-OSS-120B DGX Spark MXFP4 baseline report, published July 8, 2026 at smfclearinghouse.com.*
