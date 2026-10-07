---
slug: aleph-alpha-inference
title: aleph-alpha-inference
category: Tooling
excerpt: vLLM plugin that serves Kolibri 1. PyPI 1.0.0 landed October 3, 2026 and pins vLLM to the 0.29 line.
tags:
  - vllm
  - kolibri
  - aleph-alpha
  - inference
  - tool-calling
for: vLLM 0.29
author: Aleph Alpha
install: pip install aleph-alpha-inference
dependencies:
  - Python 3.10+
  - vLLM >=0.29.0,<0.30.0
  - torch >=2.9.0
  - transformers >=5.5.3
image: /images/skills/tooling.svg
source: https://pypi.org/project/aleph-alpha-inference/
order: 114
last_verified: "2026-10-07"
---

# aleph-alpha-inference

## What it is

`aleph-alpha-inference` is Aleph Alpha's vLLM plugin for Kolibri 1. It is not a Hermes hub skill. Do not run `hermes skill install` for it. PyPI is the install.

Version 1.0.0 was uploaded October 3, 2026, the same day as the Kolibri launch post. An 0.0.1 upload exists from September 29, 2026. Use 1.0.0. The package summary is "vLLM plugin for Aleph Alpha models." License on the PyPI record is Apache-2.0.

vLLM discovers it through the `vllm.general_plugins` entry point. Installing the package is the setup the project documents. The plugin registers architecture `Kolibri1ForCausalLM`, reasoning parser `kolibri1`, and tool-call parser `kolibri1`.

## Who it targets

People serving `Aleph-Alpha/Kolibri-1` on vLLM 0.29. If you are not serving that model, you do not need this package.

## What it does

- Pulls in the supported vLLM when you install it normally.
- Adds the Kolibri reasoning and tool-call parsers so a stock serve command can split `reasoning` from `content` and emit structured tool calls.
- Documents a `--no-deps` install for an image that already has vLLM 0.29, so you do not replace that image's torch or transformers.

## Dependencies

From the 1.0.0 `requires_dist` on PyPI: `vllm>=0.29.0,<0.30.0`, `torch>=2.9.0`, `transformers>=5.5.3`, Python `>=3.10`. The project text says each release supports one vLLM minor, currently 0.29. A 0.30 install is outside that pin.

## How to install

Published commands, copied from the PyPI description. They were not run for this entry.

```bash
pip install aleph-alpha-inference
```

If the machine already has vLLM 0.29 and you must not touch torch or transformers:

```bash
pip install --no-deps aleph-alpha-inference
```

Serve, from the same page:

```bash
vllm serve Aleph-Alpha/Kolibri-1 \
  --kv-cache-dtype fp8 \
  --reasoning-parser kolibri1 \
  --tool-call-parser kolibri1 \
  --enable-auto-tool-choice
```

For the BF16 weights, the page says serve `Aleph-Alpha/Kolibri-1-BF16` and drop `--kv-cache-dtype fp8`.

Thinking is on by default. The documented off switch for a request is `reasoning_effort: "none"` or `enable_thinking: false` inside `chat_template_kwargs`.

## Limitations

- This is a plugin pin, not a general Kolibri installer. Wrong vLLM minor and the package is out of its stated support.
- `--no-deps` will not save you if the existing vLLM is not 0.29.
- The model card's serving recommendation is still 262,144 tokens for complex work, even after the plugin loads. The plugin does not change that.
- No serve test was run for this directory entry. If the command fails, the next check is the plugin changelog, not a guessed flag.

## Sources

- PyPI 1.0.0: https://pypi.org/project/aleph-alpha-inference/
- Model card serve command: https://huggingface.co/Aleph-Alpha/Kolibri-1
- Repo linked from PyPI: https://github.com/Aleph-Alpha/aleph-alpha-inference
