---
slug: "dont-fuse-laya-with-nimble"
title: "Don't Fuse Laya With Nimble"
excerpt: "On 28 September 2026 Unsloth and Ollama both shipped a Jev-compatible /v1/systemone path. They do not name the same model. Read the release JSON, the GPU column, and the prerelease flag before you pull."
date: "2026-09-29"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local LLMs", "Ollama", "Unsloth", "Linux", "Inference"]
tags: ["systemone", "laya", "nimble", "tev1", "jev", "ollama", "unsloth", "decision-models"]
readTime: 29
image: "/images/blog/dont-fuse-laya-with-nimble-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/dont-fuse-laya-with-nimble"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

Same path. Different names. If you fuse them, you'll pull the wrong weight, quote a speed number from a card you don't own, or treat a beta tag as the stable channel because GitHub's prerelease flag said false.

On 28 September 2026, Unsloth published [v0.1.900-beta](https://github.com/unslothai/unsloth/releases/tag/v0.1.900-beta), titled "Laya Decision Models + Library." Hours later Ollama published [v0.35.0](https://github.com/ollama/ollama/releases/tag/v0.35.0). Both notes mention a Jev-compatible `/v1/systemone` endpoint and TypeSafe. Unsloth's model name in that note is Laya. Ollama's names are Nimble, from Bespoke Labs, and Tev1, from Together AI. Laya does not appear in the Ollama release body. Nimble and Tev1 do not appear in the Unsloth release body. I re-read both JSON payloads this morning. I did not call the endpoint.

Don't fuse Laya with Nimble. A shared URL path is a contract shape. It is not a model card, a hardware list, or a permission to drop the name into `ollama pull`.

This sits next to [Don't Collapse the Advisory](/blog/dont-collapse-the-advisory). That post is about a version range and a use condition that are not the same sentence. This one is about two release notes that share a path and do not share a weight. [Don't Answer From Memory](/blog/dont-answer-from-memory) is the habit underneath both: if the name isn't in the payload you just fetched, don't type it.

## Four names, one path

Keep the nouns apart. I had to, because the headlines don't.

**Jev** is TypeSafe's name. Their homepage, fetched this morning, calls System One models a class built for decisions inside software, and calls Jev their first public System One model. The page also prints marketing multiples ("193.6x Faster, 444.6x Cheaper," "$42 per billion input tokens," "Zero Hallucinations"). I did not rerun the proof they link. I am not carrying those multiples into a capacity plan. What I am carrying is the noun: Jev is theirs.

**Laya** is the name Unsloth uses for a local, open-source Jev-compatible runtime. The release summary says "Run and serve Decision Models like Laya (open-source Jev) locally" and "Supports the TypeSafe SDK through a Jev-compatible `/v1/systemone` endpoint." Pull request [#12202](https://github.com/unslothai/unsloth/pull/12202), merged 2026-09-28T14:08:43Z, vendors the Python package `laya` 0.3.5. That is a wheel. It is not an Ollama library tag.

**Nimble** is a 9B decision model from Bespoke Labs. The [Ollama library page](https://ollama.com/library/nimble), fetched this morning, describes it as 9.5GB with a 256K context window, text in, and says there is no reasoning step. The v0.35.0 release lists it as an available model and shows `ollama pull nimble`.

**Tev1** is a family from Together AI, fine-tuned from Qwen3.5, in 4B and 0.8B sizes. The [library page](https://ollama.com/library/tev1) says Tev1 requires Ollama 0.35 or later, lists `tev1:4b` at 4.5GB and `tev1:0.8b` at 812MB, both with a 256K window, and says none of its training data came from Jev.

Four nouns. One path. If a chat summary says "Ollama added Laya," that sentence is not in the release I read. If a chat summary says "Unsloth's 4.5× applies to Nimble," that sentence is not in either note. The path is the only shared token I would bet on, and even the path is "compatible with," not "identical to the hosted Jev deployment."

Unsloth's own follow-up, [#12186](https://github.com/unslothai/unsloth/pull/12186), says the quiet part. After describing 422 responses and TypeSafe SDK metadata, the author writes: "This does not claim Jev's context capacity or model accuracy." Put that sentence on the wall. A compatible endpoint is a shape. It is not a promise that the local weight matches the hosted model's context or its scores.

## Check the client before you pull

Here is the move I want you to run before any of the interesting commands.

```bash
ollama --version
```

On this Linux host, this morning, that printed a warning that it could not connect to a running Ollama instance, then `client version is 0.32.15`. There is no `nvidia-smi` on this machine either. So I did not pull Nimble, I did not pull Tev1, and I did not POST to `/v1/systemone`. The Tev1 library page says the model requires Ollama 0.35 or later. A 0.32 client is the wrong place to debug a 0.35 endpoint.

If your client is already on 0.35 or newer, you can try the release curl on a box you can roll back. If it isn't, upgrade on purpose, on a machine that isn't your only agent runtime, and read the stable-versus-prerelease section below before you do. Ollama's latest non-prerelease in the releases API this morning is still [v0.34.4](https://github.com/ollama/ollama/releases/tag/v0.34.4), published 2026-09-23T02:24:43Z. v0.35.0 is marked `prerelease: true`.

That is the whole first step. Version, then name, then pull. Not the other way around.

## What the two release records actually say

I pulled the GitHub release objects, not the rendered pages. The HTML views strip the body. The API doesn't.

Unsloth `v0.1.900-beta`:

| Field | Value |
| --- | --- |
| `name` | Laya Decision Models + Library |
| `published_at` | 2026-09-28T14:33:35Z |
| `prerelease` | false |
| `draft` | false |
| `target_commitish` | main |
| Tag text | contains `-beta` |

Ollama `v0.35.0`:

| Field | Value |
| --- | --- |
| `name` | v0.35.0 |
| `published_at` | 2026-09-28T21:23:22Z |
| `prerelease` | true |
| `draft` | false |
| `target_commitish` | main |
| Compared against | v0.34.4 |

The Unsloth summary, in the vendor's words, adds decision models, a Library, a document viewer, Apple Silicon work, Skills in Desktop, and "~4.5× faster image and video generation." The decision-model paragraph says you enable the Decision API from Settings, then API, with model selection and CPU or GPU controls, and that GPU on Apple Silicon runs natively on MLX. The details link is [#11603](https://github.com/unslothai/unsloth/pull/11603), merged 2026-09-25, which added `POST /v1/systemone` backed by Laya, off by default, with a download button. That PR's description of the settings pane names a Multilingual picker entry at 678 MB, not yet downloaded. I did not open the Desktop app to confirm the pane still says 678 MB on the tagged build. The number belongs to the PR text.

The Ollama body is shorter, and that is a gift. It says decision models return choices, probabilities, and scores instead of text. It names the two library entries. It shows one curl. It lists three question types: `choice`, `noul`, and `score`. The other changes in that release are a settings window that opens without waiting for model discovery, a macOS update-menu fix, a stalled MLX download fix, and a warning instead of a hard failure for the deprecated `typical_p` parameter. None of those sentences mention Laya, Spark, or a speed multiple.

If you only have time for one habit, it's this: read the release JSON, then read the library page for the exact tag you intend to pull, and stop when a name appears in only one of them.

## The curl is a shape, not a score

The Ollama release includes a worked request. I'm quoting it because the shape is the thing you can run, not because the numbers in the example response are a measurement of your tickets.

```bash
curl http://localhost:11434/v1/systemone \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "nimble",
    "state": "Our checkout has returned 500 errors since 9am.",
    "questions": {
      "label": {
        "type": "choice",
        "instructions": "Which label fits this ticket?",
        "criteria": {
          "billing": "Payments and refunds",
          "bug": "Software errors",
          "account": "Login and account access"
        }
      }
    }
  }'
```

The example response in the same note picks `"choice": "bug"`, with probabilities 0.0125, 0.9781, and 0.0093, and `"confidence": 0.8906`. Usage is 174 input tokens and 1 output token. That JSON is the vendor's illustration. I did not send the request. If you send it, your probabilities will be yours. Don't paste 0.9781 into a dashboard and call it uptime.

A few fields are worth naming before you wrap this in a client.

`state` is the text to judge. On the Tev1 library page, Ollama says it can be a string or a JSON object or array, and that Ollama builds Tev1's prompt for you. The Nimble library page documents a different raw prompt: a fixed system instruction, then a user message with context and a schema of one-letter codes, and a reply that is a single letter. The release curl does not use that letter-code prompt. It uses `/v1/systemone` and asks for `nimble`. I did not verify, on a live server, that the 0.35 daemon rewrites Nimble's prompt the way the Tev1 page says it rewrites Tev1's. If you care, send one request each way on a box you control and diff the answers. Don't assume the library readme and the release curl are the same code path just because both pages say "Nimble."

`questions` is a map. The Tev1 page caps it at 1 to 64 named questions and says answers come back in the same order. Choice and score questions take 2 to 26 options there, with a note that Tev1 was trained on 2 to 24, so stay in that range. The Ollama release's own wording for `score` is thinner: "Return a score across an ordered set of criteria." The library page is the one that says levels are numbered from 0 and that `score` in the answer is the probability-weighted level. When the release and the library page disagree in specificity, I trust the page that is attached to the tag you pulled, and I still re-read it after an upgrade.

`noul` is the odd word. The release says it returns the probability that a condition is true. The Tev1 page says the answer field is `noul`, that probability, and that criteria are optional. It is not a chat completion with `true` or `false` buried in prose. If your router expects a string, you will write a parser for a field that was already a number. Don't.

The TypeSafe Python snippet on the Tev1 page points `TYPESAFE_BASE_URL` at `http://localhost:11434` and sets `TYPESAFE_API_KEY=ollama` because the SDK requires a key and Ollama ignores it. The same page says decision models are not in the Ollama CLI or the Ollama Python and JavaScript libraries yet. Use the HTTP API or the TypeSafe SDK. If a tutorial tells you `ollama run tev1` is the decision API, that tutorial is ahead of the page I read, or it is wrong. Check the page dated to your install, not the tutorial.

## Confidence is not the chance you are right

This is the sentence I want in your client code, from the Tev1 library page:

> `confidence` runs from 0 to 1 and shows how concentrated the probabilities are. It isn't the chance that the answer is right.

Read that twice. A concentrated wrong answer is a high confidence and a bad route. The example in the Ollama release can show 0.8906 next to a bug label and still be an illustration of concentration, not a certificate.

The Nimble page says the model reads the prompt once per question and scores the answer token directly. No reasoning step. That is why they say it is fast. Fast is not calibrated, and calibrated is not correct. Bespoke's own held-out table, printed on that page, is 292 of 324 reference matches, 90.12%, against a set they held back. Jev 1.13.0, in the same table, is 302 of 324, 93.21%. On 13 public subsets, 3,880 records, they print a macro average of 74.8% for Nimble 9B and 76.0% for Jev 1.13.0. Accuracy there means agreement with a human label. On the rubric subsets they say it only counts an exact top-level match, which is why some of those numbers sit in the 30s and 40s for both models.

The Tev1 page prints a different Ollama-side average on those same 13 datasets: Tev1 4B at 73.3%, Tev1 0.8B at 63.5%, Nimble 9B at 75.7%, Jev 1.13 at 76.0%. Together AI's development numbers for Tev1 4B, temperature 0, thinking off, are 880 of 1,000 on a main decision set and 300 of 300 on policy transfer. The page says that mix was used while the model was being built, so it isn't an independent benchmark, and the policy set is synthetic.

I am not adjudicating which table is the one you should believe. I am telling you they are vendor tables, they do not match each other to the tenth on Nimble's macro number (74.8% on the Nimble page, 75.7% on the Tev1 page, both attributed to runs of those 13 datasets), and none of them were produced on this host. If you wire a threshold, pick a number you measured on tickets you already labeled. A reasonable first threshold is not 0.89 because an example said 0.8906. A reasonable first threshold is whatever false-route rate you can stand, measured on a few hundred of your own rows, with `choice` compared to a label a person already assigned.

Until you have that set, keep the decision model in a shadow path. Log `choice`, `probabilities`, and `confidence`. Let the existing router keep making the decision. A week of logs will teach you more than either homepage.

## Laya is a vendored wheel, not an Ollama tag

If the model you actually want is Laya, stop typing `ollama pull`.

[#11603](https://github.com/unslothai/unsloth/pull/11603) adds the Decision API to Unsloth Studio. It is off by default. The owner turns it on under Settings, then API. The first request loads the model. The same pane has the picker, a CPU or GPU choice, and an unload button. The request format is meant to match TypeSafe's Jev so the TypeSafe SDK can point at Studio.

[#12202](https://github.com/unslothai/unsloth/pull/12202) changes how that runtime is installed. Studio used to depend on `laya==0.3.5` and could `pip install` it on first use. The merged change vendors the wheel instead. The PR says the package is eight pure Python files, Apache-2.0, byte-identical to the PyPI wheel, with a manifest of per-file hashes. The loader reads `vendor/laya/__init__.py` by file path and registers it as the top-level `laya` module. It does not go through `sys.path`. A leftover `laya` in the venv, or one you installed yourself, cannot shadow the vendored copy. That matters because the runtime reaches into internals (`Agent._to_internal`, `laya.common.collate_items`).

That is a packaging decision you should copy in your own stacks when a small library's internals are part of the contract. Pin the bytes. Load them by path. Don't let a user-level pip install win. It is also a warning: `pip install laya` and "the Laya that Studio serves" can diverge the moment you are not on the vendored copy. If you are debugging Studio, you are debugging the vendored tree. If you are debugging a notebook that imported `laya` from site-packages, you are debugging a different tree. Say which one in the bug report.

The same PR names three published checkpoints: `laya-english`, `laya-multilingual`, and `laya-typed-decisions`. They are stored in float16. The old loader built the ModernBERT encoder in fp32 and upcast on load, so a served model used about twice the memory. The new path builds on CPU, casts `nn.Linear`, `nn.Embedding`, and attention `in_proj` weights to float16, then moves to the device. LayerNorm stays fp32. Embedding outputs are hooked back to fp32 so the residual stream keeps its precision. CUDA and x86 CPUs with native fp16 run fp16 autocast for those checkpoints. MPS, XPU, and MLX keep the previous fp32 path. `UNSLOTH_SYSTEMONE_FP32=1` restores fp32 everywhere. If an fp16 forward returns non-finite logits, the request is rerun in fp32.

Their measurement, on the real `laya-multilingual` checkpoint through Studio's loader, 36 requests, 108 answers, against an fp32 reference:

| | Weights | Load peak | Max prob diff vs fp32 | Answers changed |
| --- | --- | --- | --- | --- |
| CUDA before (fp32 weights, bf16 autocast) | 1247 MiB | ~1247 MiB | 2.4e-2 | 2/108 |
| CUDA after (fp16 weights, fp16 autocast) | 614 MiB | 626 MiB | 1.8e-3 | 0/108 |

They also print B200 latency for a short request as 17.7 ms versus 19.1 ms, and call latency unchanged. I did not repeat that run. What I take from it, as an operator, is narrower: if you are watching Studio's Decision API memory, the vendored loader's claim is about half the weight memory on CUDA for a checkpoint that was already stored in float16, on the card they measured. It is not a claim about Nimble's 9.5GB blob, and it is not a claim about a GB10.

[#12186](https://github.com/unslothai/unsloth/pull/12186) is the contract work around that API. It returns `x-typesafe-request-id` on success, because the Python SDK's `response.request_id` was raising and the JavaScript SDK's request id was absent. Malformed questions, bad criterion values, and request-size violations return 422, which the PR says matches the TypeSafe API reference. Oversized requests get no partial answers. The author is explicit that they did not add question splitting, option dropping, model changes, or probability changes to squeeze a request through. Option-budget refusals name the question, the context limit, and tell you to use fewer or shorter criteria.

Their verification note says 152 pytest passes with one Apple-Silicon-only skip, including real inference when `SYSTEMONE_TEST_LAYA` points at a downloaded checkpoint, plus 20 live HTTP checks against GPU `laya-multilingual`, plus official `typesafe-sdk` 0.7.2 and `@typesafe-ai/sdk` 0.6.0. That is a component-and-contract test log inside a pull request. It is not a runtime conformance result on your machine, and it is not an exact-SHA review of the tagged Desktop build by anyone outside that repo. If you enable the Decision API, turn it on, send one malformed question, and confirm you get a 422 rather than a half answer. That is a five-minute check. It is worth more than quoting their 152.

## The prerelease flag is a third question

Operators collapse three different questions into "is it out?"

1. Does a tag exist?
2. Is the tag marked prerelease?
3. Is it the newest non-prerelease the project wants you to install?

Unsloth's tag says beta. GitHub's `prerelease` field on that release object is false. Both facts are in the API response. Neither one, alone, tells you whether to put it on a box that serves other people. A beta string with `prerelease: false` means the publisher chose not to flip the flag. It does not mean the word beta left the tag. If your installer keys only on the flag, you will treat this tag as a stable channel. If your installer keys only on the word beta, you will skip a release the publisher published to `main` and did not mark prerelease. Read both, then decide from the notes, not from the badge.

Ollama is the cleaner case, and it still has a trap. v0.35.0 is `prerelease: true`. The newest `prerelease: false` in the first page of the releases API this morning is v0.34.4. There is also [v0.40.0-rc0](https://github.com/ollama/ollama/releases/tag/v0.40.0-rc0), published 2026-09-25T03:31:52Z, `prerelease: true`, with the release name `v0.40.0`. A higher version number, older than v0.35.0, also not stable. If you sort tags as strings, or you pick the maximum semver including release candidates, you can "upgrade" onto a different prerelease line and miss the decision-model notes entirely.

The check is short:

```bash
curl -fsSL -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/ollama/ollama/releases?per_page=8"
```

Then print `tag_name`, `prerelease`, and `published_at` for each object. Do the same for `unslothai/unsloth` if that is the app you are about to update. Don't ask a chatbot whether "the new Ollama" includes decision models. Ask the payload which tag is prerelease, and open that tag's body.

I am not telling you to skip v0.35.0 forever. I am telling you not to let a cron, or an agent with a shell, treat "a newer tag exists" as "roll the fleet." Put the prerelease on a side install. Confirm `/v1/systemone` returns the shape in the note. Then decide whether the daemon that your agents already call should move.

## Read the GPU column before you quote the speedup

The Unsloth summary packs three speed sentences into one block:

- LTX-2.3 clips are ~4.5× faster, with distilled sampling, compile fixes, and hosted FP8 weights.
- Image and video VAE optimizations are 1.7–6.3× faster decoding, and total generation speedups depend on the workflow.
- MiniMax-H3's first render is up to a minute faster, with 25–29 GiB lower peak memory, on A100, B200, and RTX PRO 6000.

Those sentences are vendor summaries. The pull requests underneath them are more careful, and they do not say "every GPU." Spark is not in them. GB10 is not in them. Strix Halo is not in them. If that is your box, the honest next step is to time your own clip, or to wait. It is not to paste 4.5× into a status note.

[#12067](https://github.com/unslothai/unsloth/pull/12067) is the LTX-2.3 change. The results table is explicitly B200, `ltx-2.3-22b-distilled`, 8 steps, speed default, resident, clean window, median of 3 steady renders. Transformer calls per clip go from 24 to 8 because distilled checkpoints were running extra guidance passes. A 768×512×121 clip goes from 11.67 s / 14.48 s to 2.21 s / 3.64 s. Peak memory in that table is 70.09 GiB before and 69.33 GiB after, with FP8 at 51.68 GiB. The PR's own "not measured" list includes torch versions other than 2.12.1 and GPUs other than B200. So the ~4.5× in the release summary is a B200 distilled-path result, described by the people who wrote the patch, on a window they called clean. It is a reason to try the build if you have that card and that torch. It is not a Spark number. I don't have a B200 measurement of my own to confirm or deny it.

The mechanism is still useful even if you can't quote the multiple. Distilled checkpoints were being sampled with guidance the sampler didn't want, so an 8-step default did three transformer passes per step. The compile path was falling back to eager because a data-dependent branch sat inside a compiled block. Both of those are the kind of bug that makes a "slow model" story when the model isn't the slow part. If your LTX clips suddenly got cheaper after this tag, look at pass count and compile fallback before you thank the weights.

[#12040](https://github.com/unslothai/unsloth/pull/12040) is the MiniMax-H3 memory sentence, and it is narrower than the summary. The patch holds `cudnn.benchmark` off for the H3 audio VAE's `decode` and `encode` only, and only when the device's compute capability is 8.0, 10.0, or 12.0. The PR maps those to A100, B200, and RTX PRO 6000. On any other GPU, or if the probe fails, the audio VAE is left untouched. L4 and T4 were measured and the benchmark search wins there, so those cards are not held off. Hopper and every other capability were not measured, so they keep the old path.

Their audio-VAE-only table, first decode of 207 latents, search on versus off:

| GPU | First decode, on vs off | Peak GiB, on vs off | Held off? |
| --- | --- | --- | --- |
| A100 (sm80) | 53.2–54.7 s vs 0.52 s | 33.1 vs 1.7 | yes |
| B200 (sm100) | 2.3–2.7 s vs 0.47–0.83 s | 33.1 vs 1.8 | yes |
| RTX PRO 6000 (sm120) | 25.8–26.9 s vs 0.21 s | 2.2 vs 1.8 | yes |
| L4 (sm89) | 52.4–53.2 s vs 0.57 s | 9.0 vs 1.7 | no, search wins 2–8% |
| T4 (sm75) | 5.5–6.0 s vs 0.84–0.88 s | 9.0 vs 2.2 | no, search wins 17–19% |

The end-to-end note on B200, H3 defaults, 1344×768, 124 frames, is where the "25–29 GiB" summary comes from. First render peak in that table moves from 82.14 GiB to 56.86 GiB. That is about 25 GiB, on that card, for that setting. The release summary's "up to a minute" is not the same cell as the 53-second A100 audio-VAE first decode. Don't average them into one anecdote and attach it to whatever GPU `nvidia-smi` printed this morning.

If you are on an A100, a B200, or an RTX PRO 6000 and H3's first render has been ugly, this PR is a concrete thing to try. Time the audio VAE stage, not the whole wall clock, because the author says the host they used was loaded and the denoiser dominates wall-time noise. If you are on anything else, the patch is written to leave you alone. Leaving you alone is not a bug. It is the author refusing to flip a flag they didn't measure.

[#12078](https://github.com/unslothai/unsloth/pull/12078) is the 1.7× to 6.3× VAE sentence. The fused kernels run on NVIDIA CUDA with Triton 3.3 or newer. ROCm, CPU, older Triton, and Windows without a working Triton toolchain stay on the stock path. You can force the old path with `UNSLOTH_VAE_FUSED=0`. The results section says the ratios were measured on a shared B200 and that absolute times should be re-timed on a quiet GPU before anyone quotes them. I am following that instruction. I am not quoting their absolute seconds. The ratio range in the release summary matches the PR title. The hardware gate is the part the summary compresses, and it is the part you need.

A practical rule, if you publish numbers from other people's patches: quote the ratio only next to the GPU column, the torch version if they named one, and the phrase "vendor measurement." If your card isn't in the column, your sentence is "not measured here," and you either time it or you don't mention the multiple.

## A release that names the card

The same night, llama.cpp published [b11243](https://github.com/ggml-org/llama.cpp/releases/tag/b11243). `prerelease: true`. `published_at` 2026-09-29T02:56:25Z. The body is a CI change, not a new quant format. oneDNN left Intel's Deep Learning Essentials package in the 2026.0 line, so staying on that installer would silently drop oneDNN when the toolkit moved. The jobs switch to the unified oneAPI Toolkit 2026.1, which still includes oneDNN until 2027.0.

Then they do the thing I want the other notes to do every time. Same code, build b10899, Arc B570, oneAPI 2026.1 versus the 2025.3-based release build: prompt processing 1331 versus 434 tokens per second, token generation 50.1 versus 45.3–48.0. The card is in the sentence. The code revision is in the sentence. The comparison is toolkit-versus-toolkit, not "the model got faster."

You still shouldn't paste 1331 into a Spark note. Arc B570 is not a Grace Blackwell board, and I didn't rebuild llama.cpp this morning. But you can see, in one paragraph, what would have to be true for the number to apply to you. That is the standard. When a summary says "up to a minute faster" and the card list is three data-center names, go find the paragraph that looks like the llama.cpp one. If it isn't there, you don't have a number yet. You have a headline.

The Windows DLL note in that same release is worth five minutes if you ship SYCL builds. oneAPI 2026.1 no longer ships `libsycl-fallback-bfloat16.spv` and `libsycl-native-bfloat16.spv`, and the copy step failed until those names were removed. Level Zero's Debian package names changed (`level-zero` to `libze1`). If your install script still copies the old fallback files, it will exit 1 for a reason that looks like a missing model and is actually a toolkit rename. Read the copy list before you blame the GGUF.

## A search box is not a model card

I also queried the Hugging Face model API this morning: `search=laya`, `sort=lastModified`, `limit=8`. The eight hits were community repos. Several had zero downloads. Three under `litert-community` did not: `Laya-Multilingual-LiteRT` at 357, `laya-LiteRT` at 214, `Laya-English-LiteRT` at 126, all last-modified 2026-09-29T07:50Z, tagged for LiteRT and Android. I did not download them. I did not hash them against Unsloth's vendored wheel or against the `laya-multilingual` checkpoint named in [#12202](https://github.com/unslothai/unsloth/pull/12202). A search hit with the substring `laya` is not provenance.

Last night's research note, from a different query a few hours earlier, recorded a different top of that search, including zero-download classifiers and a repo that is not in this morning's eight. I'm mentioning that only so you don't treat either snapshot as a catalog. Search rank moves overnight. If you need a weight, take the name from the release or the library page, then check the repo's own card, the file hashes, and the license. Do not take the first row of `search=laya`.

The Ollama library pages, fetched the same morning, showed 53 downloads on Nimble and 125 on Tev1, with relative "updated" stamps rather than an ISO time I could pin. Those counts will be stale by the time you read this. The useful part is the order of magnitude on day one. These are new library entries. They are not a default you already measured.

## What I did not run

Say the holes in the same breath as the findings. Otherwise a careful note gets quoted as a bake-off.

I did not install Ollama 0.35.0. The client on this host is 0.32.15, and it could not see a daemon. I did not `ollama pull nimble` or `tev1`. I did not send the release curl. The probabilities in that example are not mine.

I did not open Unsloth Studio, enable the Decision API, or load `laya-multilingual`. The 614 MiB figure, the 0/108 answer-change figure, and the B200 latency pair are from the pull request, not from a rerun.

I did not time LTX-2.3, MiniMax-H3, or a VAE decode. This host has no `nvidia-smi`. The GPU tables above are the authors' tables. Spark, GB10, and Strix Halo are absent from them.

I did not call TypeSafe's hosted Jev, and I did not audit the "193.6×" proof. The homepage states those multiples. That is all I know about them.

I did not treat a green pytest line inside [#12186](https://github.com/unslothai/unsloth/pull/12186) as a release certification. Architecture compatibility, a vendored wheel, a contract test, and a production routing change are four different rungs. This post stops at the notes.

## A checklist you can run this morning

You don't need my host. You need the payloads.

1. Fetch the release object, not the HTML page. For Ollama that is `https://api.github.com/repos/ollama/ollama/releases/tags/v0.35.0`. For Unsloth, `.../unslothai/unsloth/releases/tags/v0.1.900-beta`. Print `prerelease`, `published_at`, and the body.
2. Write down every model name in that body. If a name you expected is missing, stop. Don't add it from a different vendor's headline.
3. Run `ollama --version` on the machine that would serve the request. If the client is below 0.35, Tev1's own page says you are not there yet.
4. If you are testing, use a side install. Pull the tag the body named (`nimble`, `tev1`, or `tev1:0.8b`). Do not pull a string you invented, including `laya`, unless that string is in the Ollama body. It isn't, as of the payload I saved.
5. POST the release's curl, with a ticket whose label you already know. Compare `choice` to that label. Record `probabilities` and `confidence`. Do not threshold on the example's 0.8906.
6. Read the Tev1 page's line about confidence again before you log it as "probability correct." It isn't that.
7. If the product you wanted was Laya, switch products. That is Unsloth Studio, Settings, API, off until you turn it on. Confirm a bad question returns 422 and no partial answer, which is what [#12186](https://github.com/unslothai/unsloth/pull/12186) says the server does.
8. If you are about to quote a speedup, open the PR linked from the summary. Find the GPU column. If your card isn't listed, delete the multiple from your note, or replace it with a time you just measured.
9. If you are about to download a Hugging Face repo because the name matched, stop. Match a hash or a card the vendor named. A search box is not either of those.
10. Keep the decision model off the live router until your own labeled set says the false-route rate is one you can stand. Shadow logs are cheap. A wrong route in production is not.

That is the whole practice. It is slower than fusing the headlines. It is also the thing that keeps a 9B classifier, a 4B classifier, a vendored ModernBERT, and a hosted API from becoming one word in a standup.

## What this does not authorize

Nothing here says you should replace a chat model with a decision model in an agent loop tomorrow. The Ollama note suggests ticket triage, model routing, and content classification. Those are real jobs. They are also jobs where a concentrated wrong answer is worse than a slow correct one, because the caller will treat a typed field as something software can act on. TypeSafe's homepage leans on that. Your threshold has to lean the other way until you have measured it.

Nothing here says Unsloth 0.1.900-beta is the build you should roll because the prerelease flag is false. The tag still says beta. Read the GPU column, then decide.

Nothing here says Ollama 0.35.0 is the stable daemon. The flag says it isn't. v0.34.4 still is, in the releases list I pulled.

Nothing here is a leaderboard. Vendor tables disagree by small amounts, say so when the set was used during training, and were not rerun here. If you need a number for a purchase or a serve plan, time your card, on your prompts, after the install you actually performed.

And nothing here is a story about a lab incident. I read release JSON, three library and docs pages, six pull requests, a llama.cpp tag, and a Hugging Face search. Then I wrote down where the names split. That is the work. The next work, if you want the endpoint, is the checklist. Start with `ollama --version`. If it isn't 0.35 or newer, you already know the first command not to run.

## Sources

Release objects fetched 2026-09-29 from the GitHub API:

- [unslothai/unsloth v0.1.900-beta](https://github.com/unslothai/unsloth/releases/tag/v0.1.900-beta) — `prerelease: false`, published 2026-09-28T14:33:35Z
- [ollama/ollama v0.35.0](https://github.com/ollama/ollama/releases/tag/v0.35.0) — `prerelease: true`, published 2026-09-28T21:23:22Z
- [ollama/ollama releases list](https://github.com/ollama/ollama/releases), first page, including v0.40.0-rc0 and v0.34.4
- [llama.cpp b11243](https://github.com/ggml-org/llama.cpp/releases/tag/b11243) — `prerelease: true`, published 2026-09-29T02:56:25Z

Pull requests cited from their API bodies, not from memory:

- [#11603](https://github.com/unslothai/unsloth/pull/11603) — serve the Jev API locally with Laya
- [#12040](https://github.com/unslothai/unsloth/pull/12040) — H3 audio VAE, cuDNN benchmark, A100 / B200 / RTX PRO 6000
- [#12067](https://github.com/unslothai/unsloth/pull/12067) — LTX-2.3 distilled path, results table on B200
- [#12078](https://github.com/unslothai/unsloth/pull/12078) — fused VAE kernels, NVIDIA CUDA and Triton 3.3+
- [#12186](https://github.com/unslothai/unsloth/pull/12186) — Decision API validation, 422s, no claim on Jev accuracy
- [#12202](https://github.com/unslothai/unsloth/pull/12202) — vendor laya 0.3.5, float16 weights

Pages fetched the same morning:

- [ollama.com/library/nimble](https://ollama.com/library/nimble)
- [ollama.com/library/tev1](https://ollama.com/library/tev1)
- [typesafe.ai](https://typesafe.ai)
- Hugging Face `https://huggingface.co/api/models?search=laya&limit=8&sort=lastModified`

Local commands, this host, 2026-09-29: `ollama --version` reported client 0.32.15 and no running daemon. `nvidia-smi` was not on `PATH`.
