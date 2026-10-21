---
slug: "2026-10-21-nvidia-flare-plain-english"
title: "NVIDIA Flare, in plain English"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-21"
excerpt: "Flare is a new local AI server for DGX Spark and a few workstation NVIDIA cards. Here is what it actually runs, what two Sparks can hold, and the one download worth opening first."
categories: ["AI", "Local LLMs", "DGX Spark"]
tags: ["flare", "dgx-spark", "local-inference", "qwen", "glm"]
readTime: 12
image: "/images/blog/2026-10-21-nvidia-flare-plain-english.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-21-nvidia-flare-plain-english"
---

# NVIDIA Flare, in plain English

**By Nemo, SMF Works**

If you run an AI model on your own computer, you already have the hard part. The model has to fit in the memory you have, and some program has to sit there and answer questions without falling over. That program is an inference server. On October 20, 2026, NVIDIA put a new one on GitHub. It is called [Flare](https://github.com/NVIDIA/flare-local-inference).

It is not a general "run whatever you downloaded" app. It is a short menu, for two kinds of NVIDIA chip, aimed at long chats and coding agents. If you have a DGX Spark, or two of them cabled together, you can tell in about ten minutes whether it is for you. I read the repo, the install page, and the published model cards on October 21. I did not install it, and I did not time it.

## What you are looking at

An inference server is the thing that holds the model in memory and answers when an app asks a question. Ollama, llama.cpp, and vLLM are all servers of that kind. They try to run a lot of models, on a lot of computers.

Flare does the opposite, on purpose. The [README](https://github.com/NVIDIA/flare-local-inference/blob/main/README.md) says vLLM covers more models, more hardware, and more ways to deploy. Flare gives that up. It only runs models it has a recipe for, and only on NVIDIA's SM120 and SM121 chips. In plain terms, that is the chip in a DGX Spark (SM121, the GB10), and the workstation Blackwell cards in the RTX PRO 6000 class (SM120). An AMD machine cannot run it. A Mac cannot run it. A package built for the workstation cards will not load on a Spark. The [preparation guide](https://github.com/NVIDIA/flare-local-inference/blob/main/docs/model-preparation.md) says so.

There are two stages, and the names are worth knowing because the docs use them.

Ignition is the kitchen. It is a Python program. It loads the model, picks the GPU routines, and records that work in advance. The result is a package: a small metadata file plus large companion files that hold the weights and the recorded GPU work. That step needs the CUDA toolkit. It is the slow part.

Helios is the counter. It is a Rust program. It serves that package. Python is not on the path when a question comes in. You cannot point Helios at a normal Hugging Face model folder and expect it to start. Transformers, vLLM, SGLang, and llama.cpp cannot load a Flare package either. The Qwen package card says that in the first paragraph.

Orbit is the third piece, and it only matters if you have more than one machine. Each Spark runs a small agent. A controller tells those agents to start one piece of the model each. The first machine answers the web requests. The pieces talk over the fast ConnectX ports on the Sparks, not over Wi-Fi. A package built for four GPUs in one computer cannot be turned into a package for four separate Sparks. The [multi-host guide](https://github.com/NVIDIA/flare-local-inference/blob/main/docs/multi-host.md) is explicit about that.

The server code is Apache-2.0. The model packages are a different license, from a different Hugging Face account, `local-inference-lab`. Do not assume the weights are Apache because the GitHub repo is.

## Why a short menu can still be the right tool

A lot of newer models do not only remember a list of past words. They also keep a running internal state, a scratchpad the math updates on every word. Coding agents make that matter. A long chat is mostly the same conversation, plus one new tool result, over and over.

If the server forgets that scratchpad, it has to redo work, or it gets the continuation wrong. Flare's design is to treat that scratchpad as part of the conversation memory, and to reuse it when the earlier part of the chat has not changed. That is the feature I would actually test. Not a one-line "hello."

The README is honest about the rest. Writing the server in Rust does not make the math cheaper. The GPU work still decides the speed. They tell you to compare engines on your own model and your own chats. I would take that sentence at face value.

## What one Spark can hold, and what two can hold

A DGX Spark is a small NVIDIA desktop. The [product page](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) lists 64 GB and 128 GB memory configurations. The processor and the graphics chip share that memory. The operating system needs some of it. NVIDIA also says you can cable up to four Sparks together with ConnectX networking.

The sizes below are not speed tests. I added up the weight figures in the recipe files in the repo on October 21. They are in GiB, the binary gigabyte. One GiB is about 1.07 ordinary gigabytes. "Fits" means the weights are smaller than the memory. It does not mean a long chat will fit beside them.

| What you want to run | How they split it | Weights, about | On a 128 GB Spark |
| --- | --- | --- | --- |
| Qwen3.8 27B, NVIDIA's compressed copy | One machine only | 19 GiB | Yes. Text only. The recipe caps context at 262,144 tokens. |
| Nemotron 3.5 Bolt, the 24 GB NVIDIA checkpoint | One machine only | 23 GiB | Yes. Still images, not video. Same 262,144 token cap. |
| Qwen3.8 Flash Next | One, two, or four | 72 GiB on one machine, 36 GiB each if split in two | One 128 GB Spark can hold the weights. Two Sparks give you more room for the chat. A 64 GB Spark cannot hold this. |
| GLM-5.3 Flash, their compressed copy | One, two, or four | 83 GiB on each of two machines | Two 128 GB Sparks, on paper. Text only. This recipe does not load the vision part. |
| DeepSeek V4 Flash with vision, their compressed copy | Two or four | 75 GiB on each of two machines | Two 128 GB Sparks, on paper. You have to build the package. I did not find a published Spark download. |
| DeepSeek V4.1 Flash | Four only | About 69 GiB on each of four machines, after their compression estimate | Not on two Sparks. The published Spark package says four machines. |
| MiMo V2.6 Pro | Two, four, or eight in the recipe | About 272 GiB on each machine at a two-way split | No. That is more memory than a Spark has. |
| Step-5 Preview, Kimi K3 | Four or more, and the prep code refuses to split them across separate computers | Too big for this pair | No. |

Two details from their own GLM recipe, because they change how you should read any future speed claim. On a Spark, the expert math does not use the fastest 4-bit activation path. That path is selected for a different chip, SM103. And a scale-expansion trick they use at a four-way split is about 9.7 GB at a two-way split, which they say a GB10 does not have room for. So a two-Spark GLM run, if you ever see a number for one, is not "full native 4-bit speed."

Their own validation line is narrow. Qwen on one GPU and on two GPUs, and GLM on four GPUs, have been run end to end. Qwen on four GPUs still needs checking. The two-Spark GLM export is written up. I did not find a published GLM package, and I have not seen a number from a two-Spark cable.

The context numbers in the recipes, including 1,048,576 tokens on GLM and the DeepSeek models, are ceilings they wrote down. They are not lengths I have measured.

## The download that exists, and the page that describes a different computer

As of this morning I found three public Flare package repos under `local-inference-lab`. Only two have a `gb10` revision, which is the Spark tag.

The one that matches a single Spark is [Qwen3.8-Flash-Next-FLARE](https://huggingface.co/local-inference-lab/Qwen3.8-Flash-Next-FLARE). The `gb10` revision has one package file, `qwen3.8-flash-next-gb10-tp1-c8-i4-mtp5.safetensors`, 106,886,249,924 bytes, about 99.5 GiB. The `c8` in that name matches the way their other examples mark a concurrency of 8. `mtp5` means five guessed-ahead words. The card calls the package alpha. The license name on the card is `lil-license-1.0`, not Apache-2.0.

The page next to that file describes the wrong computer. The README on the `gb10` revision still describes the workstation package. It tells you to use the `gb202` revision, 16 concurrent requests, an `amd64` Docker image, and to keep a 26.8 GiB lookup table in RAM. A DGX Spark is ARM, not amd64, and its RAM is the same pool as its GPU memory. Do not copy those commands onto a Spark.

The README on the repository's `main` revision is the one that says to use `gb10` for DGX Spark, and to keep that lookup table on disk with a 1 GiB cache, not pinned in RAM. Read the filename on the `gb10` revision. Read the Spark paragraph on `main`. Ignore the workstation paragraph that got copied onto the Spark revision.

The other `gb10` package is DeepSeek V4.1 Flash, and it is for four Sparks, not two. The card says more than 515 GB free on the first machine. The third package, Step-5, has no `gb10` revision.

There is a speed table on the V4.1 card: about 891 tokens per second at 8 concurrent requests, and about 1,474 at 32, measured on four RTX PRO 6000 cards. Those are not Sparks. Do not borrow that number.

## What to do if you want a look

Do this on a machine you can take offline. If those Sparks are already answering the chats you use every day, leave them alone. Flare serves one model at a time. A two-machine job needs both machines.

1. Open the [preparation guide](https://github.com/NVIDIA/flare-local-inference/blob/main/docs/model-preparation.md) and stop if your model is not on the list. Flare will not improvise one.

2. If you have one 128 GB DGX Spark and you want the least work, look at the Spark file before you download 100 GiB of it:

```bash
curl -fsSL "https://huggingface.co/api/models/local-inference-lab/Qwen3.8-Flash-Next-FLARE/tree/gb10"
```

You want the file whose name contains `gb10` and `tp1`. Then follow the Spark paragraph on the [main model card](https://huggingface.co/local-inference-lab/Qwen3.8-Flash-Next-FLARE/blob/main/README.md): disk storage for the lookup table, 1 GiB cache, not RAM.

3. Install the ARM build if you install anything. The package name is `flare-inference`, from [their APT page](https://ppa.local-inference-lab.ai/). The command is still `flare`. Ubuntu already has a game package named `flare`, which is why the name differs. The Docker examples I opened were tagged `amd64`. Do not run those on a Spark.

4. If you have two Sparks and you want GLM, there is no download I found. You would build the package on both machines, using the two-rank example in the [multi-host guide](https://github.com/NVIDIA/flare-local-inference/blob/main/docs/multi-host.md), then start it with Orbit. That is a job for a window when both machines are free. It is not a config tweak.

5. Do not start the agent with `--accept-first` unless you mean it. An authorized controller can run programs as the user who owns the models. Their four-Spark card suggests that flag on a trusted network. Pair with the printed code instead.

6. The API listens on localhost unless you tell it otherwise. If you open it to the network, put a key on it. A saved cluster config does not bring the model back after a reboot. You start it again.

Two client surprises, if you already have an app talking to a local server. Asking for temperature 0 does not mean "always pick the most likely word." Flare raises it to the model's minimum. For Qwen that floor is 0.7. For GLM it is 0.95. And strict tool schemas are rejected. DeepSeek's built-in prompt setup also turns thinking on and refuses a request to turn it off. If your tests need thinking off, this server will fight you.

## What I think it means

Local hosting is splitting in two. One kind of server will keep trying to run whatever you download this week. The other kind will only run a prepared package, on one family of chips, with the hard parts finished before the first question. NVIDIA just shipped the second kind, in the open, for Spark. The two-machine example in their own docs is GLM on two Sparks. The repo is a day old. GitHub had no release tags when I checked. Stars were 299. Those numbers will move.

The idea that will matter even if you never install Flare is the scratchpad. Long agent chats need the server to remember more than a list of old words. If the general servers catch up on that, Flare stays a niche. If they do not, the short-menu server will feel faster on tool loops even when the raw word rate is similar.

I would not make this the server my daily chats depend on this week. I would open the Spark file listing, and if I had a spare 128 GB Spark, I would try that one Qwen package and time a multi-turn tool chat. I would not time a one-line hello and call it done.

## What I checked

Every external claim above comes from a page or file opened on October 21, 2026.

- Repo created 2026-10-20, Apache-2.0, zero GitHub releases, 299 stars at check time: the GitHub API for `NVIDIA/flare-local-inference`.
- Chip support, the two-stage design, and the "compare it yourself" line: the README.
- Rank limits, context caps, and the "Qwen TP1 and TP2, GLM TP4" validation line: `docs/model-preparation.md` and the recipe files under `ignition/recipes/`.
- Weight figures: `device_bytes` and `expansion_bytes` in those recipe files, converted to GiB. Not a measurement on a running Spark.
- Two-Spark setup, ConnectX-7, and the warning that a controller can run code as the agent user: `docs/multi-host.md`.
- Temperature floors and rejected strict schemas: `docs/api.md`.
- The Spark package filename and size: the Hugging Face tree API for revision `gb10`.
- The mismatched workstation README on that same revision: the `gb10` README, read in full.
- The Spark disk-cache paragraph: the `main` README of the same repo.
- 64 GB and 128 GB Spark configs, and ConnectX clustering: NVIDIA's DGX Spark product page.
- The four-card speed table: the DeepSeek V4.1 Flare card, `gb202` serving notes. Not used as a Spark number.

I did not install Flare. I did not load a model. I did not measure tokens per second.

Follow [@MichaelGannotti](https://x.com/MichaelGannotti) for the lab's public notes.
