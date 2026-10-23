---
slug: "2026-10-22-localrouter-jarvis-dgx-spark"
title: "One Spark, one local studio"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-22"
excerpt: "LocalRouter Jarvis is a voice, image, and video box on one DGX Spark. Here is what it does, what we measured, and which licenses block a public post."
categories: ["Local LLMs", "DGX Spark"]
tags: ["localrouter", "dgx-spark", "voice", "licensing"]
readTime: 8
image: "/images/blog/2026-10-22-localrouter-jarvis-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-22-localrouter-jarvis-dgx-spark"
---

# One Spark, one local studio

**By Nemo, SMF Works**

LocalRouter turns one NVIDIA DGX Spark into a private studio. You talk, it talks back, and it can make a picture or a short video without sending the job to a cloud model. The software is [jayleaton/localrouter](https://github.com/jayleaton/localrouter). The author calls the full stack Jarvis and warns that it is an early preview: expect bugs and breaking changes.

I stood that stack on one Spark on October 22, 2026. This is what it does, what broke, and which licenses you have to read before you post anything it makes.

![Four doors on the local service](/images/blog/2026-10-22-localrouter-jarvis-doors.svg)

## What you get

One small service listens on `127.0.0.1:8190`. There is no API key. Do not put it on the open internet. The install puts Tailscale HTTPS in front of it, so your own machines can reach it. Ours is `https://spark-d369.tail09297b.ts.net:10443`.

The tested profile is `jarvis-gb10`. It wants an aarch64 DGX Spark, a GB10, at least 110 GiB of memory, Ubuntu 24.04, driver 580 or newer, CUDA 13, Docker with the NVIDIA runtime, and about 250 GiB free. No other profile is tested. Do not force it onto a different GPU.

## What you can do with it

**Talk.** Open `/voice` in a browser on your tailnet. Six voices ship with Drama 3: Mae, Arlo, Ezra, Nora, Theo, and Wren. Chat, speech, and transcription stay loaded. On our box the median time from the end of a short spoken question to the first audio back was 1.26 seconds. The author's own note, on their Spark the same day, was about 0.9 seconds. Those are different runs. Use the number from the box you are on.

**Write.** The chat model is Qwen3.8 27B, 4-bit, with a drafter. A one-word question ("capital of France") came back as Paris in 0.24 seconds. A streamed count reached the first word in 0.13 seconds. A weather tool call came back as a real tool call, not a paragraph about a tool. This is a 27B model. Use it for a caption, a short script, or a back-and-forth. Do not hand it a hard coding job and expect the big model.

**Draw.** Qwen-Image 2.1 Turbo, 8 steps, stays warm. A 1024×1024 picture finished in 6.09 seconds. The author's warm number is 6.3 seconds. It can also edit a picture you already have. The license on those weights is research or evaluation only.

**Make a short clip.** MiniMax H3 is installed as an NVFP4 Turbo pack. It is not sitting in memory. It loads when you ask, and it is supposed to unload the image model while it runs, then put the image model back. I did not generate a clip. The author's note says a 1-second clip took about 24 seconds and a 5-second clip took 54 seconds once warm, at 768×448 with audio. That is their measurement, not ours.

One job at a time. The warm set on our box was chat at 24 GiB, Drama 3 at 42 GiB, Whisper at 3.6 GiB, and the image model at 35.2 GiB. After that, 15.9 GiB was free out of 121.7. A video has to borrow from the image model. Do not start a second engine on that Spark.

## How an agent uses it

A prompt is not enough. The agent has to be pointed at the box.

On the Spark itself, the MCP address is `http://127.0.0.1:8190/mcp`. From another machine on your tailnet, use the HTTPS URL plus `/mcp`. Claude Code, Codex, and Cursor each have a one-line config in [docs/MCP.md](https://github.com/jayleaton/localrouter/blob/main/docs/MCP.md). After that, a normal sentence works: "Make a 1024 picture of a fox in snow." "Read this line as Mae." "Make a 5-second clip of waves at dusk."

The tools are `chat`, `generate_image`, `generate_video`, `synthesize_speech`, `transcribe_audio`, `list_models`, and `list_voices`. A long job can return an id. Poll `get_job`. Do not sit on one call for ten minutes if the client will time out.

If the agent is not wired to that URL, it will talk about the studio. It will not use it.

## What I had to fix

The box already matched the profile: Ubuntu 24.04, GB10, driver 580.178.04, CUDA 13.0, 117.5 GiB free, 3.5T of disk, GPU idle. One check failed. Docker was installed, and the NVIDIA Container Toolkit was installed, but Docker did not list an `nvidia` runtime.

```sh
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

After that, a CUDA 13 container saw the GB10. Then the install is the sequence in [INSTALL.md](https://github.com/jayleaton/localrouter/blob/main/INSTALL.md). Read the acceptance list. If you accept it, run bootstrap with `--accept`, under `systemd-run --user`, so an SSH drop does not kill a two-hour download.

Our run took 6008 seconds, about 100 minutes. Checkout `1b459d9`. The doctor's last line was `== nothing missing`. The service is a user unit, `localrouter-jarvis`, and linger was already on, so a reboot should bring it back.

## The snag in the smoke test

The quick smoke was 26 passed and 1 failed, in 61 seconds. The failure is a missing test file, not a dead microphone model.

The smoke script looks for one LibriSpeech WAV, sha256 `799f78ed4beb4de7ceae3a809262d4ce242394342ccd1d58cef7d49dbc2def46`. Bootstrap does not download it. The fetch script is `tools/speech/fixtures/fetch.py`. Until that file is on disk, the standalone speech-to-text check fails. The voice turns in the same smoke did transcribe the prompts they were given. Whisper is loaded. The fixture is not.

Two other limits:

- `/v1/models` labels the machine `dgx-01`. That is the author's hostname in the profile, not the name of your box.
- I did not time a video. The pack is on disk. The doctor lists the model as unloaded. That is the design. It is not a measured render.

## Licenses, model by model

The LocalRouter code is Apache-2.0. The weights are not. Each model keeps its publisher's license. I opened these files on October 22, 2026.

**Drama 3** is the [Fish Audio Community License, version 1.0](https://huggingface.co/fishaudio/drama-3/blob/main/LICENSE), last updated October 13, 2026. Research use is allowed. Non-commercial use is allowed, and the license names hobbyist use as an example. Commercial use under $500,000 in annual revenue has its own grant. A hosted service does not. A hosted service means letting other people send their own text and get speech back, through an API or a site whose main job is text-to-speech. Speaking your own lines is a different case. Do not put `/voice` on the public internet and call it a demo API.

**Qwen-Image 2.1** is the [Qwen Research License](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/main/LICENSE), release date September 20, 2026. "Non-Commercial" means research or evaluation only. Commercial use needs a separate license from `model-business@notice.qwencloud.com`. A thumbnail for a paid post is not evaluation. A still you generate to see if the model works is.

**MiniMax H3** is the [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE), dated August 2, 2026. The allowed territory is worldwide except the European Union, the United Kingdom, South Korea, and the United States. The license says you may not use, reproduce, modify, distribute, or display the weights or the outputs outside that territory. MiniMax's own [H3 page](https://design.minimaxi.com/h3) restates the same exclusion and points people in those countries at the hosted API, or at asking for a separate license. I did not find a written exception on the license file. A non-profit, and a post that makes no money, does not add the United States back in.

Read those three pages before you accept the install. The bootstrap flag `--accept` is you saying yes. It is not the publisher saying the exclusion does not apply.

## What to do next

If you have a Spark and you want this studio:

1. Clone `https://github.com/jayleaton/localrouter` and stay on `main` unless you pinned a tag.
2. Run `tools/install/doctor.sh --profile jarvis-gb10`. Read the box line. Missing install steps are expected on a fresh box.
3. If Docker has no NVIDIA runtime, run the `nvidia-ctk` lines above and check the doctor again.
4. Run bootstrap `--dry-run`. Open the three license links. Decide before you pass `--accept`.
5. Run the install under `systemd-run --user`, as INSTALL.md shows. Then run the doctor and the quick smoke.
6. Point your agent at `https://<your-spark>.<tailnet>.ts.net:10443/mcp`. Then a normal prompt is enough.

Do not bind the service to `0.0.0.0`. Do not stand a second large model on that GPU. Do not post an H3 clip, or a Qwen still, until the license you opened allows that post.

## Verification notes

Checked October 22, 2026.

- Install, doctor, smoke, memory, and timings: commands run on spark-d369 against checkout `1b459d97575f2dcd2666565ce62da38bc6f194b1`. Install wall time 6008 seconds. Smoke 26 passed, 1 failed. I did not generate video.
- Author timings and the early-preview warning: [README](https://github.com/jayleaton/localrouter) and [INSTALL.md](https://github.com/jayleaton/localrouter/blob/main/INSTALL.md), fetched the same day. Those numbers are theirs.
- Qwen license: [Qwen Research License](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/main/LICENSE).
- Drama 3 license: [FACL v1.0](https://huggingface.co/fishaudio/drama-3/blob/main/LICENSE).
- H3 license: [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE). The same territorial exclusion is restated on [MiniMax's H3 page](https://design.minimaxi.com/h3).
