---
slug: "pick-pocket-tts-voice-on-llama-cpp-v090"
title: "How to pick a Pocket TTS predefined voice on llama.cpp v0.9.0"
excerpt: "v0.9.0 is the Latest stable. Convert one languages/ directory from kyutai/pocket-tts-without-voice-cloning, then run llama-tts with --tts-voice giovanni. That pack rejects a speaker wav. GET /props lists the voices."
date: "2026-11-05"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["llama.cpp", "TTS", "Open Source", "Linux"]
tags: ["llama.cpp", "pocket-tts", "tts", "v0.9.0", "gguf"]
readTime: 7
image: "/images/blog/pick-pocket-tts-voice-on-llama-cpp-v090-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/pick-pocket-tts-voice-on-llama-cpp-v090"
---

You can convert Pocket TTS, pass a speaker wav because the common note still says that file is required, and watch the request fail because this pack has no voice encoder. [llama.cpp v0.9.0](https://github.com/ggml-org/llama.cpp/releases/tag/v0.9.0) is the current Latest stable. Its body says Pocket TTS now supports predefined voices without voice cloning, in [PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429). By the end of this you can tell that tag from a nightly, convert one language directory from the without-cloning repo, and run the `--tts-voice giovanni` command the tagged README prints.

I fetched the GitHub release API for [v0.9.0](https://api.github.com/repos/ggml-org/llama.cpp/releases/tags/v0.9.0) this morning. `prerelease` is false. `published_at` is `2026-11-04T13:08:06Z`. `target_commitish` is `cd959bae99ff4bed22bef2604f45241c09bbb8c8`. `/releases/latest` returned the same tag. `command -v llama-tts` printed nothing on this host. The commands below are from the tagged files I opened, plus the Hugging Face model API.

## Open the stable tag, then the TTS page at that tag

Start with the [v0.9.0 release](https://github.com/ggml-org/llama.cpp/releases/tag/v0.9.0). The overview says audio generation expands with Chatterbox TTS, Nemotron 3.5 Transcribe, and predefined Pocket TTS voices. Under Multi-modality changes, the Pocket TTS line is: support predefined voices without voice cloning, citing [PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429). Under API changes, `GET /props` reports the model's predefined TTS `voices`, and the TTS endpoint accepts predefined voice names, citing [PR #30993](https://github.com/ggml-org/llama.cpp/pull/30993). Those two PRs are the ones to keep open while you convert.

[v0.8.0](https://github.com/ggml-org/llama.cpp/releases/tag/v0.8.0) is also `prerelease` false. The API `published_at` is `2026-10-28T12:47:51Z`. That body added `POST /tts`. The predefined Pocket TTS voice path is the v0.9.0 line.

The v0.9.0 asset `nightly-tag.txt` is seven bytes. I downloaded it from [the release asset](https://github.com/ggml-org/llama.cpp/releases/download/v0.9.0/nightly-tag.txt). The text is `b12110`. The GitHub API for [b12110](https://api.github.com/repos/ggml-org/llama.cpp/releases/tags/b12110) has `prerelease` true, `published_at` `2026-11-04T12:52:04Z`, and the same `target_commitish` as v0.9.0. [b12121](https://api.github.com/repos/ggml-org/llama.cpp/releases/tags/b12121) is a later nightly: `prerelease` true, `published_at` `2026-11-05T03:00:07Z`, `target_commitish` `e56f006ed6b416ae8b7ccb5243b204743f09df1e`. Pin `v0.9.0` when you want the stable. A `b` tag is a different channel.

Then open the TTS README at the tag, not at `master`: [tools/tts/README.md at v0.9.0](https://raw.githubusercontent.com/ggml-org/llama.cpp/v0.9.0/tools/tts/README.md). The Pocket TTS section is the procedure. The page also documents Qwen3-TTS, Soprano, LFM3-Audio, and Chatterbox. Stay in the Pocket TTS section for this how-to.

## Convert one language directory from the without-cloning pack

[PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429) names the voice repo: [kyutai/pocket-tts-without-voice-cloning](https://huggingface.co/kyutai/pocket-tts-without-voice-cloning). I fetched `https://huggingface.co/api/models/kyutai/pocket-tts-without-voice-cloning`. `id` is that repo. `sha` is `a7056f505a4a8ca72d8b5fb1440071d6f1a35739`. `lastModified` is `2026-10-21T12:37:23.000Z`. `siblings` is 853. Tags include `license:cc-by-4.0` and language tags `en`, `fr`, `de`, `pt`, `it`, `es`.

The v0.9.0 TTS README says the upstream repository holds one complete model per language under `languages/`, next to shared files at the root, and that you convert one of the `languages/` directories, not the root. The Hugging Face API listing matches that shape. Under `languages/` I counted 27 directories, including `english`, `italian`, and `french`. `languages/english/` has `model.safetensors`, `tokenizer.json`, `tokenizer.model`, and an `embeddings/` directory.

`languages/english/embeddings/` has 27 `.safetensors` files. The stems, sorted, are alba, anna, azelma, bill_boerst, caro_davy, charles, cosette, daan, eponine, estelle, eve, fantine, george, giovanni, jane, javert, jean, juergen, lola, marius, mary, michael, paul, peter_yearsley, rafael, stuart_bell, and vera. `giovanni.safetensors` is in that list. The README uses `giovanni` as the example voice name.

Convert from a llama.cpp checkout at v0.9.0, with the without-cloning tree on disk. The tagged README prints:

```sh
python convert_hf_to_gguf.py path/to/pocket-tts/languages/english --outfile pocket-tts.gguf
python convert_hf_to_gguf.py path/to/pocket-tts/languages/english --mmproj --outfile mmproj-pocket-tts.gguf
```

Point `path/to/pocket-tts` at the without-cloning clone, and point `languages/english` at the directory whose language matches the text you will speak. The same README says `lang` is unused for Pocket TTS because the language is a property of the weights. This host has no GGUF from that convert pair to attach.

The README says the without-cloning weights ship predefined voices as `embeddings/*.safetensors` next to each language. The converter stores them in the mmproj as voice prompt embeddings and leaves out the zeroed voice encoder. After that conversion, `--tts-speaker-file` is rejected, and a voice is selected with `--tts-voice`. If you omit `--tts-voice`, the first voice is used.

[PR #31429](https://github.com/ggml-org/llama.cpp/pull/31429) also says an unknown voice is a bad request. A review on that PR, after the follow-up commits, says llama-tts and llama-server behave as expected: without a voice the model uses the first one, an unknown voice or a speaker file on a model without a voice encoder gets a clear error, and `/props` lists the voices. That is a review of the PR, not a run on this host.

## Run llama-tts with --tts-voice

The tagged README still documents the cloning path first. For a model that still has a voice encoder, it says `--tts-speaker-file` should point at a wav or mp3, that the file is required, and that the model produces almost no audio without it:

```sh
llama-tts -m pocket-tts.gguf \
-mm mmproj-pocket-tts.gguf \
-p "Hello world" \
--tts-speaker-file speaker.mp3 \
--output out.wav
```

Keep that block for the cloning pack. For the without-cloning pack you just converted, the same page prints this instead:

```sh
llama-tts -m pocket-tts.gguf \
-mm mmproj-pocket-tts.gguf \
-p "Ciao a tutti" \
--tts-voice giovanni \
--output out.wav
```

`--tts-voice` selects one of the predefined voices shipped with the weights. The README's example name is `giovanni`. The converter reads those voices from `embeddings/*.safetensors` next to the weights, of both repositories, and logs how closely each one is reproduced. It warns above 5%, and it skips a voice only when the voice does not belong to the model at all.

If you converted `languages/english`, `giovanni` is still a legal name because `languages/english/embeddings/giovanni.safetensors` is in the API listing. Change `-p` to the English sentence you want. The README's printed prompt is Italian. Match the language directory to the text. `out.wav` is the filename that README prints.

The common usage note at the top of that README still says it is highly recommended to provide a speaker reference via `--tts-speaker-file`. That sentence sits above every model. For this pack, the Pocket TTS section is the one that applies: the speaker file is rejected, and `--tts-voice` is the selector.

## List voices from GET /props, then POST /tts

If you serve the same GGUF pair with `llama-server`, read [tools/server/README.md at v0.9.0](https://raw.githubusercontent.com/ggml-org/llama.cpp/v0.9.0/tools/server/README.md) before you copy a curl line.

`POST /tts` returns raw audio bytes, `audio/wav` by default. The `voice` field is one of the `voices` listed by `GET /props`. It is optional: a model with predefined voices speaks with the first of them when neither `voice` nor `speaker_ref` is given. It rejects any other name. A predefined voice cannot be combined with `speaker_ref`. `speaker_ref_b64` and an uploaded `speaker_ref` file are rejected when the model has no voice encoder. The parenthetical on that line is Pocket TTS without voice cloning.

`GET /props` is read-only unless you started the server with `--props`. In the field list under that heading, `voices` is the predefined voices of an audio generation model, to pass as `voice` to `/tts`. The README says that field is only present when the model has some, and it names LFM3-Audio and Pocket TTS without voice cloning as examples.

The JSON example on that page does not include a `voices` array. The field is documented in the bullet list under the example, not inside the sample object. After the server is up with this mmproj, print the live document:

```sh
curl -s http://127.0.0.1:9931/props
```

Look for `voices`. Then speak with a name from that list. The README's JSON example for `/tts` has no `voice` key, so it takes the first voice:

```sh
curl -X POST http://127.0.0.1:9931/tts \
    -H "Content-Type: application/json" \
    -d '{"input": "Hello, this is a test."}' \
    -o output.wav
```

To pick `giovanni`, put that name in the JSON. The server README says `voice` is the field `/props` lists. There is no `llama-server` on PATH here, so there is no live `/props` body from this host to paste.

The multipart example on the same page uploads `speaker_ref`. Skip that example on the without-cloning pack. The option text says that file is rejected when there is no voice encoder.

The same `/tts` heading still has the generic note that a speaker reference is highly recommended. Read it next to the Pocket TTS rejection line. For this pack, the name in `voices` is the handle you pass.

Today, fetch `https://api.github.com/repos/ggml-org/llama.cpp/releases/latest` and print `tag_name` and `prerelease`. Open [tools/tts/README.md at v0.9.0](https://raw.githubusercontent.com/ggml-org/llama.cpp/v0.9.0/tools/tts/README.md) and read the Pocket TTS section through the `giovanni` command. If you already have the without-cloning GGUFs from that convert pair, run the `llama-tts` block with `--tts-voice giovanni` and listen to `out.wav`. If `command -v llama-tts` is empty, install from the v0.9.0 tag first, then run the same block.
