---
slug: "check-lfm25-paren-before-trl-1-17-1"
title: "How to check a parenthesis inside an LFM2.5 tool-call argument before you pin TRL 1.17.1"
excerpt: "On 1.17.0, the LFM2.5 close pattern matched the first parenthesis, so city='Paris (FR)' truncated. 1.17.1 keeps that parenthesis. A string that contains ), name( still splits. Run the close pattern before you pin it."
date: "2026-11-03"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "Fine-Tuning", "Open Source", "Tool Calling"]
tags: ["trl", "lfm2.5", "tool-calling", "huggingface"]
readTime: 9
image: "/images/blog/check-lfm25-paren-before-trl-1-17-1-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/check-lfm25-paren-before-trl-1-17-1"
---

You can parse an LFM2.5 tool call and still be holding `Paris (FR` with the closing parenthesis gone. On TRL 1.17.0, the close pattern for those templates matched the first `)`. [v1.17.1](https://github.com/huggingface/trl/releases/tag/v1.17.1) keeps a parenthesis inside the argument. A string that itself contains `), name(` still splits there. By the end of this you can print the close pattern on the pin you have, run the pull request's example string, and decide whether 1.17.1 is the pin.

If you are bumping Axolotl and only need the process-reward ceiling, that check is a different TRL number. It is written up at [Read the Floor Before You Bump Axolotl](https://www.smfclearinghouse.com/blog/read-the-floor-before-you-bump-axolotl). I read that file in the site repo. This post is the 1.17.1 close pattern.

## The first parenthesis closed the call

[v1.17.1](https://github.com/huggingface/trl/releases/tag/v1.17.1) was published `2026-10-30T14:15:28Z`. The release API field `prerelease` is false. The GitHub page marks it Latest. The annotated tag `v1.17.1` points at commit `44809ba3f3a136f3d62859ee981fee2506bce5c9`, message `Release: 1.17.1`. The body has one change: keep a parenthesis inside an LFM2.5 tool-call argument from closing the call, in [PR #7942](https://github.com/huggingface/trl/pull/7942).

The [compare](https://github.com/huggingface/trl/compare/v1.17.0...v1.17.1) API returned `ahead_by` 2, `behind_by` 0. Three files changed: `VERSION`, `tests/test_chat_template_utils.py` (2), `trl/chat_template_utils.py` (6).

[PR #7942](https://github.com/huggingface/trl/pull/7942) is `state` closed, `merged` true, `merged_at` `2026-10-30T12:11:10Z`, merge commit `fe422f7a79c8613e98504cd4d0d45e3a1ba96909`. The motivation says the LFM2.5 response templates closed a tool call at its first `)`, so a `)` inside an argument ended the call early: `f(city="Paris (FR)")` came back as `{"city": "\"Paris (FR"}`. It says this affected every LFM2 and LFM2.5 template TRL recognizes, as they all use `lfm2_2_5_template` or `lfm2_2_5_v3_template`.

The tagged source matches that. I fetched [chat_template_utils.py at v1.17.0](https://raw.githubusercontent.com/huggingface/trl/v1.17.0/trl/chat_template_utils.py) and [the same file at v1.17.1](https://raw.githubusercontent.com/huggingface/trl/v1.17.1/trl/chat_template_utils.py). On 1.17.0 both templates used:

```python
"close_pattern": r"\)(?:\]<\|tool_call_end\|>)?\s*"
```

On 1.17.1 both used:

```python
"close_pattern": r"\)(?:\]<\|tool_call_end\|>|(?=,\s*\w+\())\s*"
```

The 1.17.0 pattern matches a `)` and, optionally, the block closer `]<|tool_call_end|>`. The first `)` is enough. The 1.17.1 pattern still matches that block closer. It also matches a `)` only when the next call follows, `(?=,\s*\w+\()`. A `)` inside `Paris (FR)` has neither of those after it, so it stays in the argument.

The 1.17.1 comment above `lfm2_2_5_template` says LFM2.5 renders every tool call of a turn into a single `<|tool_call_start|>[...]<|tool_call_end|>` block, as a comma-separated list of Python-style calls. The example there is `[get_weather(city='Paris', days=3), ping()]`. Argument strings are single-quoted.

## Confirm the pin and the two templates

[PyPI](https://pypi.org/pypi/trl/json) `info.version` is `1.17.1`. `yanked` is false. `requires_python` is `>=3.11`. The wheel is `trl-1.17.1-py3-none-any.whl`, uploaded `2026-10-30T14:12:57.578243Z`, sha256 `be0b4117e4442801f1e0ba2052ef2c813d2b5a5ca351a5d82bc0e9cffc30e3ed`. The [installation page](https://huggingface.co/docs/trl/en/installation) says you can install TRL from PyPI or from source, with pip or uv. The HTML for that page includes `pip install trl`. The 1.17.1 release body has no pip line. For a lockfile, pin `trl==1.17.1` after the check, on a runtime that satisfies `>=3.11`. Python on this host is 3.14.9.

[v1.17.0](https://github.com/huggingface/trl/releases/tag/v1.17.0) was published `2026-10-29T15:51:15Z`, `prerelease` false. That tag is the before-pin. It is the release the patch missed, per the pull request thread. Leave it on the 1.17.0 line until you have run the string below.

`add_response_schema` in the 1.17.1 file maps chat templates onto those two close patterns. `lfm2_2_5_template` is used when the chat template is `lfm2_v2`, `lfm2_2_5`, `lfm2_2_5_v2`, or `lfm2_2_5_vl_v2`. `lfm2_2_5_v3_template` is used when the chat template is `lfm2_2_5_v3`, `lfm2_2_5_v4`, or `lfm2_2_5_vl`. Both close patterns changed in the same way. If your tokenizer is one of those LFM2 or LFM2.5 templates, you are on this pin.

The public test that moved with the patch is in [tests/test_chat_template_utils.py at v1.17.1](https://raw.githubusercontent.com/huggingface/trl/v1.17.1/tests/test_chat_template_utils.py). `test_add_response_schema_template_revision` now round-trips `get_weather` with `{"city": "Paris (FR), France"}`. On 1.17.0 that city was `"Paris, France"`. The test still skips unless transformers is 5.13 or later, because LFM2.5 ships a new-style response template. The close pattern itself is in `chat_template_utils.py`. You can run that pattern with Python's `re` and see the split without loading a tokenizer.

## Run the close pattern on the string you already have

Open the two tagged files, or the copy in your env. Pull the `tool_calls` `close_pattern` out of `lfm2_2_5_template`. Then:

```python
import re

open_pat = re.compile(r"(?:<\|tool_call_start\|>\[|,\s*)(?P<name>\w+)\(")
close_1170 = re.compile(r"\)(?:\]<\|tool_call_end\|>)?\s*")
close_1171 = re.compile(r"\)(?:\]<\|tool_call_end\|>|(?=,\s*\w+\())\s*")

text = "<|tool_call_start|>[get_weather(city='Paris (FR)')]<|tool_call_end|>"

def parse_calls(text, close):
    pos = 0
    out = []
    while True:
        m = open_pat.search(text, pos)
        if not m:
            return out
        start = m.end()
        c = close.search(text, start)
        if not c:
            out.append((m.group("name"), text[start:], None))
            return out
        out.append((m.group("name"), text[start:c.start()], c.group(0)))
        pos = c.end()

print(parse_calls(text, close_1170))
print(parse_calls(text, close_1171))
```

On this host, Python 3.14.9, against the two tagged files, that printed:

```
[('get_weather', "city='Paris (FR", ')')]
[('get_weather', "city='Paris (FR)'", ')]<|tool_call_end|>')]
```

The 1.17.0 close ate the `)` in `(FR)`. The argument stopped at `city='Paris (FR`. The 1.17.1 close waited for `)]<|tool_call_end|>`. The argument kept `city='Paris (FR)'`.

The pull request's double-quoted form, wrapped the same way, `<|tool_call_start|>[get_weather(city="Paris (FR)")]<|tool_call_end|>`, did the same split. 1.17.0 captured `city="Paris (FR`. 1.17.1 captured `city="Paris (FR)"`. That is the truncation the pull request wrote as `{"city": "\"Paris (FR"}`.

A city with no inner parenthesis still closes on both pins. `<|tool_call_start|>[get_weather(city='Paris')]<|tool_call_end|>` captured `city='Paris'` and `)]<|tool_call_end|>` on 1.17.0 and on 1.17.1.

Two calls in one block, with the test city's inner parenthesis, also moved. The string was `<|tool_call_start|>[multiply(a=3, b=4), get_weather(city='Paris (FR), France')]<|tool_call_end|>`. On 1.17.0, `multiply` captured `a=3, b=4`, then `get_weather` captured `city='Paris (FR`. On 1.17.1, `multiply` still captured `a=3, b=4`, and `get_weather` captured `city='Paris (FR), France'`. The inner `)` in `(FR)` stayed in the city. The comma in `, France` stayed in the city too, because it is not `, name(`.

If your installed file still has `r"\)(?:\]<\|tool_call_end\|>)?\s*"`, you are on the 1.17.0 close. The first inner `)` will end the call. If it has the lookahead for `, name(`, you are on the 1.17.1 close.

## Watch for a comma-name split inside the string

The same pull request states the leftover split. A `)` now closes the call only when it ends the tool-call block (`)]<|tool_call_end|>`) or is followed by the next call (`, name(`). A string argument that itself contains `), name(` is still split there, since the parser cannot tell it is inside quotes.

I ran that sequence as `<|tool_call_start|>[get_weather(city='Paris (FR), name(x=1)')]<|tool_call_end|>`. On 1.17.1 the close still fired at the `)` before `, name(`. The parse returned two calls: `get_weather` with `city='Paris (FR`, then `name` with `x=1)'`. The city string was cut. A second function named `name` appeared. That is the limit the pull request left in place. 1.17.1 does not fix a `), name(` inside quotes.

If a tool argument can contain that exact character sequence, keep the string out of the Python-style call, or accept that the parser will split there. The patch is the inner parenthesis in `Paris (FR)` and in `Paris (FR), France`. It is the close pattern in those two templates. It is not a quoted-string parser.

## Try one response today

Search the env you actually train or parse with:

```bash
rg -n 'lfm2_2_5_template|close_pattern.: r"\\\\)' -g 'chat_template_utils.py'
```

A hit in `trl/chat_template_utils.py` is the file to open. Print `trl` from that env if the package imports. Then paste the `Paris (FR)` snippet above and run it against the close pattern you just read.

If the first call returns `city='Paris (FR` and a close of `)`, you are on the 1.17.0 path I saw. Read [v1.17.1](https://github.com/huggingface/trl/releases/tag/v1.17.1) before you change the pin. If callers send cities, product names, or other values with parentheses, that is the string to keep.

If the first call already returns `city='Paris (FR)'` and `)]<|tool_call_end|>`, the inner parenthesis is staying. Run the leftover `), name(` string next, so you see the split the pull request still documents.

Confirm the index before you write the pin. This run's PyPI JSON said `1.17.1`, `yanked` false. The install line on the [installation page](https://huggingface.co/docs/trl/en/installation) is `pip install trl`. For a lockfile, pin `trl==1.17.1` after the check.
