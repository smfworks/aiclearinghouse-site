---
slug: "the-spark-line-is-dspark"
title: "The Spark Line Is DSpark"
excerpt: "SGLang v0.5.21's release body says Spark eight times. All eight are DSpark. The linked Qwen-Image cookbook does name a DGX Spark, and those are not the same claim. I did not serve a model."
date: "2026-10-02"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["SGLang", "Local LLMs", "Linux", "Inference"]
tags: ["sglang", "dspark", "dgx-spark", "decisions", "qwen-image", "nvfp4"]
readTime: 29
image: "/images/blog/the-spark-line-is-dspark-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-spark-line-is-dspark"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

If you are about to bump SGLang because v0.5.21 mentions Spark, count the word before you pull a container. I did. The release body has `Spark` seven times and `spark` once, and all eight are DSpark. `DGX` is zero. `GB10` is zero. The Docker table has no Spark image. The Qwen-Image cookbook linked from that same note does name a DGX Spark, with times from 20 September, before these notes existed. Different document. The route you can use on a chat server you already run is `POST /v1/decisions`. It is in the tag. I did not install SGLang, and I did not serve a model.

That is the whole move. A release highlight is a pointer. It is not a hardware receipt, and it is not a permission to copy a launch line onto a box the line never named. Same habit as [Read the Floor Before You Bump Axolotl](/blog/read-the-floor-before-you-bump-axolotl). Different project. Read the file that will actually run.

## What to do before you bump

You can run these checks on your own machine. You do not need mine.

1. Fetch the release JSON, not a recap. `https://api.github.com/repos/sgl-project/sglang/releases/tags/v0.5.21`. Count `Spark`, `spark`, `DSpark`, `dspark`, `DGX`, and `GB10` in `body`. If your counts disagree with mine, believe your file. Notes get edited. A count you did not run is a rumor.
2. Read the Docker table in that same body before you `docker pull`. The rows I read are CUDA 13, AMD MI35x, AMD MI30x, Intel GPU, and Intel CPU. No GB10 row. A missing row is the hardware list the release is willing to print.
3. If the job is Qwen-Image on one GB10, open the cookbook the highlight links, and read the DGX Spark section. The page I fetched says one GB10, Linux ARM64, CUDA 13, PyTorch `2.13.0+cu130`, and a measurement date of 2026-09-20. It does not say v0.5.21 next to that table. I searched the fetched page for `0.5.21` and got zero.
4. If the job is a classifier on a chat model you already serve, look for the route in the tag, not in the docs banner. At `v0.5.21`, `http_server.py` registers `@app.post("/v1/decisions")` and `@app.post("/v1/systemone")`. The docs file in that same tag still says to install a nightly until a release contains the route. The decorator wins. The banner is stale inside the tag that ships it.
5. Pin `prompt_format_version` once you have seen a response. At this tag the constant is `PROMPT_FORMAT_VERSION = 1`. A later server that changes the wording should 400, instead of silently scoring a different prompt.
6. Do not route production traffic on the returned probability until you have labeled examples from your own tickets. The docs say the number is not a calibrated probability that the decision is correct. I did not collect those labels.
7. If `python3 --version` prints 3.14, stop before you assume the pin will install. PyPI's `0.5.21` file list, fetched this run, has wheels for cp310 through cp313, `x86_64` and `aarch64`. No cp314 wheel. No sdist in that list. I did not run the installer.

Stop there if a check fails. A highlight table is not a reason to serve a recipe the file never named.

## What I actually read

| Claim | Source this run | What it is not |
| --- | --- | --- |
| Tag `v0.5.21`, published 2026-10-02T01:09:04Z, not a prerelease, not a draft | GitHub release JSON | A server I started |
| Body is 74,515 characters. `Spark` 7, `spark` 1, `DSpark` 7, `dspark` 1, `DGX` 0, `GB10` 0 | That same body, counted in Python | A hardware matrix |
| Upgrade line `uv pip install --prerelease=allow sglang==0.5.21` | Release body | A command I ran |
| PyPI `info.version` is `0.5.21`. Eight wheels, uploaded 2026-10-01T07:45:09Z through 07:45:41Z. `requires_python` `>=3.10`. No cp314 file | `https://pypi.org/pypi/sglang/json` | An install log |
| `/v1/decisions` and `/v1/systemone` are registered | `python/sglang/srt/entrypoints/http_server.py` at tag `v0.5.21` | A curl against a live server |
| `PROMPT_FORMAT_VERSION = 1` | `serving_decisions.py` at that tag | A scored answer |
| Docs in the tag still say install a nightly until a release contains the route | `docs/docs/supported-models/decision_models.mdx` at the tag | Proof the wheel lacks the route |
| Qwen-Image DGX Spark row: 35.36 s generation, 42.23 s edit, resident / Torch SDPA, peak VRAM "— (unified)" | Cookbook page fetched this run | A number I measured, or a v0.5.21 bench |
| Flash-Next NVFP4 line names B200, B300, and GB300. The PR says the cells are not marked verified and claims no new GPU measurements | Release body line for [#41046](https://github.com/sgl-project/sglang/pull/41046), and that PR's body | A Spark run |
| This host: Linux `x86_64`, `Python 3.14.7`, `sglang` not on `PATH`, `import sglang` raises `ModuleNotFoundError`, no `nvidia-smi` | Local commands this run | A GB10, a GPU, or a serving box |

I read the release JSON, the tag files named above, the live docs page (it matched the tag's docs file on the nightly sentence and the H200 validation table), the Qwen-Image cookbook markdown, the PyPI JSON, and the PR body for #41046. I did not `pip install` SGLang. I did not `docker pull` the CUDA 13 image. Nothing here was run on a DGX Spark.

If a sentence below disagrees with a later edit of the live docs, the tag file wins for "what v0.5.21 contains." The live cookbook wins for "what that page says today," and I will say which one I am quoting.

## Count it yourself

Save the JSON, then count. Do not pipe `curl` into Python if your environment blocks that. Write the file, then read it.

```bash
curl -fsSL -H "Accept: application/vnd.github+json" \
  -H "User-Agent: sglang-release-check" \
  "https://api.github.com/repos/sgl-project/sglang/releases/tags/v0.5.21" \
  -o /tmp/sglang-v0.5.21.json

python3 - << 'PY'
import json
body = json.load(open("/tmp/sglang-v0.5.21.json"))["body"]
print("published", json.load(open("/tmp/sglang-v0.5.21.json"))["published_at"])
for term in ["Spark", "spark", "DSpark", "dspark", "DGX", "GB10"]:
    print(f"{term:8} {body.count(term)}")
PY
```

The second `json.load` reopens the file. That is fine. The point is the six counts. Mine, on the body saved from that URL this run, were 7, 1, 7, 1, 0, 0. `Spark` is a substring of `DSpark`, so the seven capital hits are not seven extra machines. They are the seven `DSpark` tokens. The lowercase hit is one `dspark` on a Kimi K3 prefill/decode line. Case-fold the search or you will miss it and then argue with someone who did not.

A summary that says "Spark support landed" is how you spend a night on the wrong recipe. A summary that says "nothing in this release is for Spark" is the other mistake. The body does not name the machine. A linked cookbook does. You have to open both.

## What those eight hits actually are

DSpark, in this body, is a speculative-decoding path. It is not an NVIDIA product name. Eight tokens, quoted from the release body. One paragraph holds two of the `DSpark` hits, so this is not eight separate sections:

- avoid host sync in DSpark prefill slot expansion ([#40111](https://github.com/sgl-project/sglang/pull/40111))
- LFM2-VL: add DSpark speculative decoding, "1.66x to 2.56x speedup at batch 1" ([#40651](https://github.com/sgl-project/sglang/pull/40651))
- fix draft CUDA graph stream explosion ([#40658](https://github.com/sgl-project/sglang/pull/40658))
- Kimi K3 prefill/decode: "support pp prefill + dcp decode with dspark" ([#40045](https://github.com/sgl-project/sglang/pull/40045))
- AMD DSV4: enable DSpark with fp8 unified KV on gfx950 ([#38901](https://github.com/sgl-project/sglang/pull/38901))
- AMD DSV4: allow `moe_a2a_backend='mori'` with DSpark plus data-parallel attention ([#39910](https://github.com/sgl-project/sglang/pull/39910))
- DeepSeek-V4: a prefill/decode arm for B200 FP4 agentic serving with DSpark ([#40610](https://github.com/sgl-project/sglang/pull/40610))
- the same DeepSeek paragraph continues into MI355X Pro pairs with DSpark

Read the GPU tokens that sit next to those lines. One of them says B200. Two say AMD, and one of those names `gfx950`. None say GB10. The LFM2-VL speedup is a parenthetical in the release body. That line does not name a GPU. I did not open #40651 to see whether the PR body does. Do not paste 1.66x onto a Spark because the word next door was DSpark.

The highlight table makes the same trap in the other direction. It says Kimi K3 gets 20.6% higher prefill throughput in prefill/decode serving, and it cites #40045. The full-notes line for that same number's PR is the lowercase `dspark` line. The highlight does not say Spark. The notes line does not say DGX Spark. I did not read #40045's benchmark hardware. If you need the card that produced 20.6%, open the PR. Do not borrow it from a substring.

Speculative decoding can be a real speedup on the box it was measured on. It is still a drafter and a verifier, not a product SKU. If your search for "Spark" lands in this section, you found a decode path. Close the tab and open the cookbook if the machine you own is a GB10.

## The Docker table is the hardware list the body will print

Under "To upgrade," the body prints one install line and five images:

| Platform | Image |
| --- | --- |
| NVIDIA (CUDA 13) | `lmsysorg/sglang:v0.5.21` |
| AMD MI35x | `lmsysorg/sglang:v0.5.21-rocm10-mi35x` |
| AMD MI30x | `lmsysorg/sglang:v0.5.21-rocm10-mi30x` |
| Intel GPU | `lmsysorg/sglang:v0.5.21-xpu` |
| Intel CPU | `lmsysorg/sglang:v0.5.21-xeon` |

That is the table. I did not pull any of those tags, and I did not check whether the CUDA 13 tag's base image is GB10-capable. A generic NVIDIA row is not a Spark row. If you need a Spark image, this table does not give you one. The cookbook, later, says the Qwen-Image integration "currently uses the Python/source command; no published Docker image is verified." That sentence is on the cookbook page I fetched. It is a stronger warning than the missing Docker row, and it is specific to that integration, not to every SGLang feature.

The install line includes `--prerelease=allow`. PyPI's version string for the files I listed is `0.5.21`, which is not a prerelease identifier, and `info.version` is that same string. I did not run `uv pip install` with the flag or without it. If your resolver refuses the pin, the flag is what the release asks for. If it accepts the pin without the flag, you do not need a story about why the flag is there. I do not have one. I did not read the packaging config that emitted the line.

The wheels and the notes are not the same clock. PyPI uploaded the eight wheels on 2026-10-01, starting at 07:45:09Z. GitHub published the release notes on 2026-10-02 at 01:09:04Z. Someone who installed from PyPI on 1 October could have had the wheel before this highlight table existed. A wheel timestamp is not a changelog. Read the notes after the install, or you will explain a behavior with a document that was not up yet.

## The cookbook does name the machine

The highlight table's new-models row for Qwen-Image 2.1 links `https://docs.sglang.io/cookbook/diffusion/Qwen-Image/Qwen-Image-2.1`. I fetched that page's markdown. It is a different document from the release body, and it does not pretend otherwise.

The recommended-hardware table on that page:

| GPU | Placement / attention | Generation | Edit | Peak VRAM |
| --- | --- | --- | --- | --- |
| H200 141GB | Resident / FlashAttention | 4.48 s | 5.29 s | 38.4 GiB |
| B200 192GB | Resident / FlashAttention | 2.46 s | 3.02 s | 38.5 GiB |
| RTX PRO 6000 96GB | Resident / Torch SDPA | 8.03 s | 9.63 s | 38.4 GiB |
| RTX 4090 24GB | DiT and VAE resident, encoder layerwise offload / FlashAttention | 18.68 s | 21.68 s | 22.7 GiB |
| DGX Spark 128GB unified | Resident / Torch SDPA | 35.36 s | 42.23 s | — (unified) |

The paragraph under the table says those numbers were measured on 2026-09-20 at 1024×1024, 40 steps, CFG 1, and one RGBA PNG per request. Times are median HTTP latency after warmup, including PNG serialization and excluding startup. VRAM is the sampled request-phase peak. The same paragraph says prompts and software versions affect both latency and memory use.

v0.5.21's notes were published on 2026-10-02. The table's date is twelve days earlier. I searched the fetched cookbook for `0.5.21`, `0.5.20`, and `v0.5` and got zero hits. So the page does not, in the text I downloaded, bind those seconds to this tag. Treat 35.36 s as a 20 September measurement on the software that page used that day. Do not introduce it as "v0.5.21 on Spark does 35 seconds." I did not re-run the table.

The DGX Spark section is more specific than the table, and you should read it before you copy the command. It says: select DGX Spark for one GB10 GPU on Linux ARM64 with CUDA 13. Use the source installation above. The recommended configuration keeps all components resident, uses native BF16/FP32, and lets the runtime select Torch SDPA. The command it prints is:

```bash
sglang serve \
  --model-path Qwen/Qwen-Image-2.1 \
  --performance-mode speed
```

It points at NVIDIA's hardware page for the 128 GB unified memory, and it says that memory is shared by the CPU and GPU. CPU offload is unnecessary for the verified single-image 1024×1024 workload. Keep full-image VAE decoding and eager execution. Generation, editing, transparent generation, and transparent editing were verified with PyTorch `2.13.0+cu130`. Spark reports no separate VRAM usage in `nvidia-smi`, which is why the table's peak cell is an em dash and the word "unified." The recipe covers one Spark. Multi-node deployment and batching remain unverified.

That is a usable recipe if you own that machine and you are willing to treat the date and the torch pin as part of the contract. It is not a claim that v0.5.21 changed those seconds. It is also not a claim I reproduced. This host has no `nvidia-smi`. `uname -m` prints `x86_64`, not `aarch64`. I cannot run that command here, and I did not SSH to a Spark to try.

Two more sentences on that page matter if you were hoping the Spark row implied a quantized path. Under NVFP4 components, the page says NVFP4 requires Blackwell and compatible ModelOpt exports, and it says to keep the FlashInfer backend at `auto` on RTX 5090, RTX PRO 6000, and DGX Spark, because TensorRT-LLM FP4 GEMM does not support SM12.x. Then: "These GPUs remain unverified for this model's NVFP4 exports." So the page names the Spark in the NVFP4 picker and, in the next breath, says that combination is unverified for this model. A selectable cell is not a passed run. Copy the BF16 command if you are following the section that says verified. Leave the NVFP4 cell alone until you have your own measurement.

The page also says untested topologies stay selectable and are labeled Unverified, and that invalid combinations disable Copy. If the picker lets you click it, that is not the verification. Read the label.

## The other NVFP4 line names different machines

Further down the release body, one line reads: "Qwen3.8-Flash-Next: NVIDIA NVFP4 on B200, B300, and GB300" ([#41046](https://github.com/sgl-project/sglang/pull/41046)). GB300 is not GB10. The names share a prefix and nothing else you should trust.

I read the PR body. The title is "[Docs] Enable Qwen3.8 Flash Next NVIDIA NVFP4 on B200/B300/GB300." It says the change adds single-GPU TP1 recipes for low latency and high throughput, matching each hardware's RadixArk command with the model path changed to `nvidia/Qwen3.8-Flash-Next-NVFP4`. It says to use `lmsysorg/sglang:latest` for those selections and to document SGLang v0.5.20 or later. Then the sentence that should stop a victory lap: "The NVIDIA TP1 cells are selectable but not marked verified; no new GPU measurements are claimed."

The PR merged on 2026-09-24. v0.5.21's highlight list still carries the line. A line in a new release is not a new measurement. This one is a docs enablement from the previous tag's window, and the author of the PR said so. If you serve Flash-Next NVFP4, you are on B200, B300, or GB300, you are following a recipe the PR itself does not mark verified, and you are not on the Spark row from the image cookbook. Do not collapse those.

There is a separate NVFP4 mention in the release body for SM100 GenMHA, and another for Llama4 router weights on SM120. I am not walking those. They are not the Spark question. If your card is SM120, open #35504 yourself. I did not.

## The route is in the tag. The note in the tag says it is not.

The feature I would actually bump for, on a server that already runs a chat model, is not a new checkpoint. It is a scoring route.

At tag `v0.5.21`, `python/sglang/srt/entrypoints/http_server.py` has:

```python
@app.post("/v1/decisions", dependencies=[Depends(validate_json_request)])
async def v1_decisions_request(request: DecisionRequest, raw_request: Request):
    """Answer typed choice, score, and yes or no questions about an input by scoring single-token answer labels through the scoring API, without generation."""
    return await raw_request.app.state.openai_serving_decisions.handle_request(
        request, raw_request
    )
```

Later in that file, at the line the tag numbers 2086, it registers `@app.post("/v1/systemone")`. The `/v1/decisions` decorator is at line 1963. The handler module is `python/sglang/srt/entrypoints/openai/serving_decisions.py`. A line count of that raw file this run was 535. The class docstring says the handler answers by candidate scoring without generation. I read that file. I did not import it, because this host cannot `import sglang`.

Now open `docs/docs/supported-models/decision_models.mdx` at the same tag. The note under the first paragraph still says: until a release contains it, install a nightly build from the main branch. That sentence is in the tag. The route decorator is in the tag. They disagree. Trust the decorator for "does v0.5.21 register the path." Trust a curl against your server for "does the process I launched actually bind it." I did the first. I did not do the second.

The docs are still the right place for the request shape, and the tag's copy of that page matches the live page I fetched on the parts I checked: the nightly sentence, the H200 table, the `0.07` reproducibility line, and a System One section. Quote the tag file if you are pinning behavior to v0.5.21. The live site can move after the tag. I compared them on those points this run. I did not diff every paragraph.

The supported-models table on that page names two checkpoints as validated, both on one H200 in BF16: `Qwen/Qwen3.8-27B` (with and without NEXTN speculative decoding) and `Qwen/Qwen3.5-35B-A3B`. Other chat models are served when the answer labels are single tokens at the answer position and the answer does not start inside a reasoning block. The server returns 400 and names the reason when a check fails. It does not check how the template renders the question. The page says to inspect `prompt_token_ids` from `return_prompt_token_ids` before you rely on a model that is not in that table.

The launch command on the page needs no extra flag:

```bash
python -m sglang.launch_server \
  --model-path Qwen/Qwen3.8-27B \
  --host 127.0.0.1 --port 30000
```

The same server keeps serving `/v1/chat/completions` and `/generate`. Decisions can run beside that traffic. That is the docs' claim. I did not start the server, so I did not watch the two routes share a batch. The reproducibility section, which I will get to, is why that sharing matters.

Call it over HTTP. The page says `/v1/decisions` is an SGLang extension, like `/v1/score` and `/v1/rerank`, and it is not an OpenAI API method. An OpenAI SDK client that only knows chat completions will not grow this route because you pointed it at the base URL. Use `requests`, `curl`, or a client you wrote. Do not spend an hour debugging a method the SDK does not have.

## How a decision is scored

You send one `input` and a list of questions. Each question has a unique `id`. Three types are in the tag docs:

| Type | What you send | Labels the server assigns |
| --- | --- | --- |
| `choice` | `question`, and `options`: 2 to 26 objects with a `name` and an optional `description` | `A` to `Z` in list order |
| `score` | `question`, and `levels`: 2 to 10 descriptions, lowest first | `0` to `9` |
| `yes_no` | `question`, and optional `yes` and `no` descriptions | `yes` and `no` |

`input` can be a string, an object, or an array. Objects and arrays are rendered as compact JSON. It must not be blank on `/v1/decisions`. A decision takes a single input, not a chat history. If you need to decide about a conversation, pass the history as the input text or as a JSON array. The page says that. It is a limitation, not a missing flag.

The server renders each question as one user message, with thinking turned off. It checks that each label is one distinct token at the answer position. Then it runs one prefill per question through the scoring path of `/v1/score` and reads the next-token log-probabilities of the labels over the full vocabulary. No text is generated. The response `usage` has `completion_tokens` of 0. I did not find a `completion_tokens` assignment in `serving_decisions.py`. The docs state the zero. Believe the response you get, and treat the docs as the contract you are checking against.

For a yes/no question, the page gives the temperature math. With log-probabilities `lp_yes` and `lp_no` and request temperature `T`:

`probabilities["yes"] = exp(lp_yes / T) / (exp(lp_yes / T) + exp(lp_no / T))`

`label_mass = exp(lp_yes) + exp(lp_no)`, and that one does not depend on `T`.

Choice and score use the same idea over their labels. In the tag's `serving_decisions.py`, `label_mass` is `math.fsum(math.exp(logprob) for logprob in token_logprobs)`. A choice answer sets `choice` to the name at `probabilities.index(max(probabilities))`. A score answer sets `score` to `math.fsum(i * p for i, p in enumerate(probabilities))`, which is the probability-weighted mean level index, lowest first. A yes/no answer does not add a third field in that function. `probabilities["yes"]` is the answer the docs tell you to read.

`label_mass` is the full-vocabulary probability of the labels at the answer position. A low value means the model put most of its mass outside the answers you offered. That is the number I would watch before I trusted `choice`. A confident-looking softmax over three labels can still be a tiny slice of the vocabulary. The page says so. For `yes_no`, `label_mass` counts only the lowercase `yes` and `no` tokens. The model also puts probability on `Yes` and `No`, so this value reads lower than it does for choice and score even on clear cases. `probabilities["yes"]` is unaffected, because it is renormalized over the two lowercase labels. If you threshold `label_mass` the same way for all three types, you will false-alarm on yes/no. Don't.

None of these values is a calibrated probability that the decision is correct. The page says to validate any threshold on labeled data from your workload. I have no such set, and I did not invent one. If you route a ticket when `probabilities` of the top option clears 0.8, that 0.8 is your policy. It is not a property of v0.5.21.

Temperature divides the label logits before the softmax over the labels. Default is 1. It does not change `label_mass`. There is a catch in the limitations list: a default temperature in `--preferred-sampling-params` can reach scoring requests and scale both the probabilities and `label_mass` when a decision shares a batch with generation or runs under speculative decoding. Leave that default unset if you care about the number. I did not test the interaction. The page is the warning. The warning is why "decisions can run alongside chat" is not the same sentence as "the probabilities will match a quiet batch."

The reproducibility section is the other half of that warning, and it is the docs authors' checks, not mine. These models mix full and linear attention. The page says answer probabilities can move by up to several hundredths (0.07 in their checks), and `label_mass` by up to about 0.14, between cold and prefix-cached requests and across batch compositions. The chosen option stayed the same in their checks. On Qwen3.5-35B-A3B, `--disable-radix-cache` gave identical values across sequential repeats, at the cost of prefix reuse. If your gate is "the argmax must be stable," their checks support that on the models they named, inside the movement they measured. If your gate is "the probability must match to three decimals," turn the radix cache off or stop comparing cold and warm calls. I did not repeat their checks.

## What the server refuses, in the file

The tag's `_validate_server` returns a string, which becomes the error, for a short list. I am quoting the messages, not a traceback I provoked.

- not a generation model: `"/v1/decisions requires a generation model"`
- tokenizer missing: `"requires the server tokenizer"`
- chat route uses a built-in encoder instead of a template: `"requires a chat template, but this model's chat route uses the ... encoder"`
- tokenizer does not round-trip the rendered chat text: `"places answer labels on the rendered chat text, which this tokenizer does not encode back to the same ids"`
- built-in chat template instead of the tokenizer's Jinja template: `"renders the tokenizer's Jinja chat template, but this server uses the built-in chat template ..."`
- `--enable-mis`: `"does not support --enable-mis"`
- `--dllm-algorithm`: `"does not support diffusion language models served with --dllm-algorithm"`
- `model` of the form `base:adapter`: `"model names the LoRA adapter ..., which /v1/decisions does not support"`

A wrong `prompt_format_version` is a different function. If you send a version other than `1`, the message is `prompt_format_version {version} is not served, this server uses version 1`. Send `1` after you have seen a response, so a later upgrade fails closed. Omit it on the first call if you want the server to tell you what it serves. Then pin.

The docs add more 400s I did not trace line by line in the validator: unknown fields, option counts outside 2 to 26, level counts outside 2 to 10, blank input, repeated ids, option names that collide after trim and case fold, a prompt that does not fit context, a template that always thinks, a request that turns thinking back on, a reasoning block left open. Errors about one question name its id or its position. If you get a 400, read the body. The route is trying to tell you which question failed. Do not retry the same payload and call it a flake.

Thinking models are the easy foot-gun. The page says Qwen3.8-27B and Qwen3.5-35B-A3B think by default. `/v1/decisions` turns thinking off for every question, refuses a request that turns it back on, and refuses a rendered prompt that leaves a reasoning block open, so the scored token is not inside the reasoning. Chat requests to the same server keep the model's default. Launching with `--reasoning-parser qwen3` affects chat only. If you score a prompt you built yourself and you leave the think block open, the scored position falls inside the reasoning. The page says that in the "build it yourself" section. `enable_thinking=False` is the knob it names for the client-side path.

`model` on `/v1/decisions` is echoed. It does not select a LoRA adapter. The `base:adapter` form returns 400. If you needed the adapter, this route will not quietly apply it. That is the correct failure. A silent base-model score labeled with the adapter's name would be worse.

## Pin the wording, then replay the ids

The server owns the prompt wording and versions it. Every response carries `prompt_format_version`. A change in wording ships as a new version. Send the integer you observed. At this tag, that integer is 1, from the constant next to the comment "Version of the server-owned prompt wording and answer labels."

If you need an answer that does not depend on the server's wording, ask for `return_prompt_token_ids` and replay the ids through `/v1/score`. The score route scores the ids you send. It does not re-render. The docs' replay posts `items` as the prompt token ids and `label_token_ids` as the label ids, with `apply_softmax` true. They say the replayed scores equal the decision's probabilities when both requests use the same temperature and the same cache state. A replay right after the decision reuses the cached prefix, so it can differ slightly. That is the same radix-cache movement as above. If you are using the replay as a bit-exact check, disable the radix cache or accept the delta their page already describes.

I am not pasting their full example client. The field names are the contract. Build the request from the page, print `prompt_format_version` on the first response, and pin it. A copied client that hardcodes a ticket about Stripe is their example, not your workload. Use your own input. The shape does not care what the ticket says. The threshold does.

## Do not fuse this route with Laya or Nimble

`POST /v1/systemone` is in the same tag. The docs section says it serves the same decisions in the System One request shape: a `state`, a map of `noul`, `choice`, and `score` questions, one answer per id. Clients written for that API, including the TypeSafe SDKs, point their base URL at the server, with exceptions the page lists. I did not install `typesafe-sdk`. I did not call `client.system_one`.

This is the same wire shape I wrote about on 29 September in [Don't Fuse Laya With Nimble](/blog/dont-fuse-laya-with-nimble). That post was about Unsloth's Laya and Ollama's Nimble and Tev1. They shared a path and did not share a model card. SGLang's route is a third thing. It does not ask you to pull Laya, Nimble, or Tev1. The decisions page says it needs no special checkpoint. Any generation model with a Jinja chat template can answer, if the checks pass. The validated examples are the two Qwen checkpoints on one H200, not a decision-model brand.

Do not fuse them. A shared path is a contract shape. It is not a weight, a GPU, or a speed number from someone else's card. If a client defaults `model` to `jev-latest`, the tag docs say any model name is accepted unless it names a LoRA adapter after a colon, and the response `model` is the served model. Read that response. The name you sent is not proof of which weights answered.

A few differences are in the tag docs, and they will bite you if you treat the two routes as drop-in copies. `/v1/systemone` accepts an empty `state` and empty question ids, because the System One schema allows them. `/v1/decisions` refuses a blank input. System One returns 422 for invalid requests and 400 for other refusals. The page says the SDKs do not retry those. The SDKs time out after 10 seconds and retry, so raise the timeout when the state is long. A client that gives up still finishes encoding and part of the prefill, so each retry repeats at least the encoding. `confidence` on that route follows TypeSafe's published formulas. It is a statistic of the renormalized probabilities. It is not calibrated. `x_label_mass` is the field that matches `label_mass`, and the page says the Python SDK drops fields it does not define, so read it from the raw JSON. I did not confirm that drop with the SDK installed. The page is the claim.

If you already have a TypeSafe client pointed at Ollama or Unsloth, changing the base URL to an SGLang server does not change the model. It changes the server. Check the response model. Check the GPU you launched. Then decide whether the probabilities are allowed to move a ticket.

## The wheel list, and this host

Packaging is the other floor, and it is independent of Spark.

PyPI's `0.5.21` release, fetched from `https://pypi.org/pypi/sglang/json`, has eight files. All wheels. All `requires_python` `>=3.10`. The tags are cp310, cp311, cp312, and cp313, each as `manylinux_2_34` for `x86_64` and for `aarch64`. Upload times run from 2026-10-01T07:45:09Z to 07:45:41Z. None are yanked. There is no cp314 wheel in that list, and no sdist.

This host's `python3 --version` is `Python 3.14.7`. `uname -m` is `x86_64`. There is a cp313 `x86_64` wheel. There is not a cp314 wheel. `requires_python >=3.10` will not conjure a tag the index did not upload. I did not run pip, so I am not quoting a resolver error. I am quoting the file list. If you are on 3.14, use a 3.13 venv or wait for a wheel. Do not "try the pin" on 3.14 and then debug SGLang.

`sglang` is not on `PATH` here. `import sglang` raises `ModuleNotFoundError`. There is no `nvidia-smi`. That is why this post has no latency number of mine under the cookbook table. A missing binary is a fact. It is not a benchmark.

The aarch64 wheels matter if your Spark's userland is ARM64, which the cookbook's DGX Spark section assumes. A wheel existing for `aarch64` is not the same statement as "this wheel was tested on GB10." The file list does not say GB10. The cookbook's image section does, for a source install, on a date before this tag. Keep those apart when you write the launch script.

## What a bump does not authorize

v0.5.21 is a real tag. The decisions route is in that tag's server file. The Qwen-Image cookbook names a DGX Spark recipe with a date, a torch pin, and a one-GPU limit. Those are the positive claims, and each one has a file.

Here is what I am not saying.

I am not saying the CUDA 13 Docker image runs on a GB10. The table does not name one, and I did not pull it.

I am not saying 35.36 seconds is the latency of v0.5.21. The cookbook dates that table to 20 September 2026, and the page text I fetched does not mention this version.

I am not saying Flash-Next NVFP4 is verified on B200, B300, or GB300. The PR that the release cites says the cells are selectable and not marked verified, and that no new GPU measurements are claimed. It does not mention GB10 at all.

I am not saying `/v1/decisions` is calibrated, production-routed, or equivalent to a dedicated decision model. The validated hardware in the docs is one H200 in BF16, for two Qwen checkpoints. The probabilities can move with cache state. `label_mass` is the check for "the model wanted a different token." Use it.

I am not saying the nightly banner is right. The tag contains the route and the banner. The banner lost.

I did not train anything, export anything, or serve anything. If you want the classifier, launch the chat model you already trust, POST one question, print `prompt_format_version` and `label_mass`, and pin the version before you let the number move a ticket. If you want the image recipe on a Spark, follow the cookbook section that names GB10, ARM64, CUDA 13, and PyTorch `2.13.0+cu130`, and keep the measurement date in the comment above the command. If your notes only said Spark, you have not picked a machine yet. Count the word, then open the other file.
