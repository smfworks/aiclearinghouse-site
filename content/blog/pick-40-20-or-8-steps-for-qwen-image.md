---
slug: "pick-40-20-or-8-steps-for-qwen-image"
title: "How to pick 40, 20, or 8 steps for a first Qwen-Image-2.1 image"
excerpt: "The Unsloth release says Turbo makes an image in 8 steps and links a guide whose settings table still says 40 or 20. Match the file name, then match the backend, before you click Generate."
date: "2026-10-13"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local image generation", "Open Source", "Linux", "Unsloth"]
tags: ["qwen-image-2.1", "unsloth", "gguf", "stable-diffusion.cpp"]
readTime: 17
image: "/images/blog/pick-40-20-or-8-steps-for-qwen-image-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/pick-40-20-or-8-steps-for-qwen-image"
---

You can choose 40, 20, or 8 steps for a first local Qwen-Image-2.1 image. Do that before you click Generate. Those three numbers are not the same job.

The [Unsloth v0.1.906-beta release](https://github.com/unslothai/unsloth/releases/tag/v0.1.906-beta) says Qwen-Image-2.1-Turbo makes images in 8 steps, and the highlight links [the run guide](https://unsloth.ai/docs/models/qwen-image-2.1). That guide's settings table still lists 40 steps for the Unsloth GPU / Diffusers column and 20 for native stable-diffusion.cpp. The 8-step schedule is on the [Turbo GGUF card](https://huggingface.co/unsloth/Qwen-Image-2.1-Turbo-GGUF), for a file whose name contains `turbo`. Match the file name, then match the backend. I did not install Unsloth, and I did not generate an image.

This is not a prompt lesson. If you are about to put the ratio in the sentence, that split is already written down in [Describe the Picture](https://www.smfclearinghouse.com/blog/2026-10-10-describe-the-picture-leave-the-ratio). If you already have a Comfy recipe you measured on your own box, keep it. [That stand](https://www.smfclearinghouse.com/blog/2026-10-11-strix-halo-two-image-setups) is a different path. This one is the page the release linked, and the cards that page does not copy into its table.

## Read the release, then the page it links

Open the release before you open the app. The GitHub API for tag `v0.1.906-beta` returned `published_at` `2026-10-12T14:17:13Z`, `draft` false, and `prerelease` false. The tag name still says beta. `releases/latest` returned that same tag. Do not skip it because the name contains beta, and do not treat the word beta as GitHub's prerelease flag. Those two facts disagree, and both are on the API response.

The body says this:

> Qwen-Image-2.1-Turbo is here too, making images in just 8 steps.

The highlight says "images in 8 steps (2.5x faster)" and links the guide. A later bullet calls Turbo "the official 8-step version of Qwen-Image-2.1" and says to run it from the Images page, with a 4.2 GB Q4 GGUF. That bullet links the Turbo GGUF repo, not the settings table. The "2.5x faster" line is their sentence. I did not time a run.

Then open the guide they linked, not a memory of it. I fetched [the HTML](https://unsloth.ai/docs/models/qwen-image-2.1) and [the markdown sibling](https://unsloth.ai/docs/models/qwen-image-2.1.md) on 13 October 2026. I searched the saved HTML for `8 step`, `8-step`, and `8 steps`. None of those strings were in the file. `turbo` was, fourteen times, in the intro and the upload links.

The markdown intro now names both models. It says Qwen-Image-2.1 has 7B parameters and "runs locally on 11GB VRAM with GGUFs and 24GB with INT8/FP8." It links four uploads: the base [GGUF](https://huggingface.co/unsloth/Qwen-Image-2.1-GGUF) and [FP8](https://huggingface.co/unsloth/Qwen-Image-2.1-FP8), and the Turbo [GGUF](https://huggingface.co/unsloth/Qwen-Image-2.1-Turbo-GGUF) and [FP8](https://huggingface.co/unsloth/Qwen-Image-2.1-Turbo-FP8). Naming Turbo in the first paragraph is not the same as giving it a row.

The settings table, on both copies I saved, has two columns:

| Setting | Unsloth GPU / Diffusers | Native stable-diffusion.cpp |
| --- | --- | --- |
| Steps | 40, called the Qwen/Diffusers baseline | 20, called the CLI default and Unsloth's recorded test |
| Guidance / CFG | 1.0, CFG disabled | 6.0, upstream sd.cpp example |
| Negative prompt | Leave blank; set guidance to 1.0 explicitly | Leave blank to reproduce the example |
| Sampler / scheduler | Keep the model's pipeline scheduler | Euler |
| Flow shift | Keep the pipeline's scheduler configuration | Automatic; omit `--flow-shift` |
| First-run resolution | `1024×1024` | `1024×1024` |
| Batch size | 1 | 1 |
| Seed | 42, or another fixed comparison seed | 42, or another fixed comparison seed |

The sentence above that table is the rule. Use the recipe for the backend that is actually running the model, not the FP8 or GGUF extension. A Turbo file is still a GGUF or an FP8. The extension will not tell you which row you are on, and neither row is the 8-step schedule.

## Install the app the Images steps assume

The guide's first step is the Desktop app, on macOS, Windows, or Linux. The [Linux install page](https://unsloth.ai/docs/get-started/install/linux) is the one that says what a Linux install actually is. Follow that page if you want the sidebar the guide describes.

It says:

1. Download from [the Linux download link](https://unsloth.ai/download/linux).
2. Open the `.deb`, select Install, and launch the app. Wait for that install to finish.
3. Open Select model or Model hub, choose a model and a quantization, and download it.

The [download page](https://unsloth.ai/download) I opened points the Linux button at `releases/latest` and labels the Ubuntu/Debian package 44.3 MB. The API says latest is `v0.1.906-beta`. The Ubuntu asset on that tag is 27,447,820 bytes, not 44.3 MB. `curl -sI -L` on the asset URL returned HTTP 302, then HTTP 200, with `content-disposition` naming `Unsloth-Desktop-Ubuntu.deb` and `last-modified` `Mon, 12 Oct 2026 14:47:32 GMT`. I did not download the package.

If you want this tag, use the asset URL, not the size label:

https://github.com/unslothai/unsloth/releases/download/v0.1.906-beta/Unsloth-Desktop-Ubuntu.deb

After it lands, compare the byte size with 27447820. A size label on a marketing page is not a checksum. The same release also has `Unsloth-Desktop-Linux.AppImage` at 181,291,512 bytes. The Linux page's uninstall section treats a downloaded `.AppImage` as Desktop and says uninstall is to delete that file. It does not give AppImage install steps. I did not open the file.

Do not use the one-line installer if you want that Desktop app. The guide lists this under "install manually" for macOS, Linux, and WSL:

```bash
curl -fsSL https://unsloth.ai/install.sh | sh
```

The Linux page uses the same command in a different section, and it says the command installs Unsloth Studio, the browser UI. It says that command does not install the native Desktop app. I did not run it. If you already ran it, you may have Studio, and the Images steps in the guide are written for Desktop. Launch `unsloth studio -H 0.0.0.0 -p 8888` only if that is the UI you meant to install. The Linux page gives that launch line for Studio, not as a substitute for the `.deb`.

The guide's troubleshooting block says some models require you to accept their license on Hugging Face and add a token before they will download. I did not check whether these four repos are gated. If the download stops and asks, that sentence is the one to read. Both Turbo cards I opened say the weights are under the [Qwen Research License](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo/blob/main/LICENSE). Read it before you treat the file as yours to ship.

## Stay on Create, then read the file name

The guide's second step says that in this release, Qwen-Image-2.1 is available in Unsloth for text-to-image generation only. Select Images in the sidebar. Create opens by default. Open the model selector there, or go to Model hub, and search for the quant you actually want.

Search the repo name, not the family name. "Qwen-Image-2.1" will hit the base uploads and the Turbo uploads. The base GGUF card is a quant of [Qwen/Qwen-Image-2.1](https://huggingface.co/Qwen/Qwen-Image-2.1). The Turbo GGUF card is a quant of [Qwen/Qwen-Image-2.1-Turbo](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo), which that card calls the 8-step distilled checkpoint. They are not two filenames for one schedule.

Use this split:

| What you loaded | Where it runs | Steps | Guidance | What else the source says |
| --- | --- | --- | --- | --- |
| Name does not contain `turbo` | Desktop, on the guide's Diffusers column | 40 | 1.0 | Blank negative prompt. `1024×1024`. Batch 1. Seed 42 if you want their comparison seed. |
| Name does not contain `turbo` | `sd-cli`, from the base GGUF card | 20 | 6.0 | Euler. No `--flow-shift`. No sigma list. |
| Name contains `turbo` | Desktop, from the Turbo GGUF card | 8, applied by the app when it recognizes the name | CFG 1 | Do not also type 40. |
| Name contains `turbo` | `sd-cli`, from the Turbo GGUF card | 8, plus the sigma list on that card | 1.0 | Euler. `1024×1024`. The sigma list is part of the command. |

The first generation can take longer while the model downloads and loads. That wait is not a wrong step count. When the image lands, open it in the gallery. The guide says the gallery shows the prompt and the settings, and Recipe restores that setup. That is how you check which number actually ran. I did not see that gallery.

## If the name does not say turbo, use the table

Stay on the guide's table, and stay on the column for the backend you are in.

In Desktop, if the model is the base GGUF or the base FP8, the Diffusers column is the one the guide tells you to keep for a first image: 40 steps, guidance 1.0, negative prompt blank, the pipeline's own scheduler, `1024×1024`, batch 1. Seed 42 is their comparison seed. Leave it empty only if you want a random seed. The generation-settings section says an empty seed is random, and it also says more steps do not always improve the result. For the first image, do not negotiate with that sentence. Use the table, then change one thing later if you have a reason.

Forty is not an Unsloth invention. The official [Qwen-Image-2.1 card](https://huggingface.co/Qwen/Qwen-Image-2.1) text-to-image example sets `num_inference_steps=40`. It also sets `width=2048` and `height=2048`. The guide tells you not to start there. Unsloth supports up to 2048 pixels on a side, and it says to start at 1024 and go up only if memory allows. Qwen's native presets, which the guide reprints, include sides longer than that cap: `2752×1536` and `1536×2752`. A first run at a native 2K preset is how you turn a settings mismatch into an out-of-memory stop. Dimensions still have to be divisible by 32. The smaller test sizes in the guide's ratio table already are.

I am not walking the Python install on that official card. The Desktop path does not need it. If you leave Desktop and call the pipeline yourself, follow the card you opened, and do not paste its 2048 square into the Unsloth first-run box.

If you are not in the app, and you are calling stable-diffusion.cpp yourself, do not use the 40. The base GGUF card's command matches the guide's other column. I copied it from the raw README:

```bash
sd-cli --diffusion-model qwen-image-2.1-Q4_K_M.gguf \
  --vae qwen_image_2.1_vae_bf16.safetensors \
  --llm Qwen3-VL-8B-Instruct-UD-Q4_K_XL.gguf \
  -p "a cartoon sloth mascot waving, flat vector illustration, bright colours" \
  --steps 20 --cfg-scale 6.0 --sampling-method euler -W 1024 -H 1024 --diffusion-fa \
  -o out.png
```

That command has no `--flow-shift` and no `--sigmas`. The guide says to omit `--flow-shift` on this backend. The samples line under the command says those pictures were rendered at 1024, 20 steps, cfg 6.0, Euler. The prompt spelling `colours` is theirs. Keep it if you want to compare against their samples. Change the prompt if you want a different picture. Do not change the flags on the first run.

The same README says a GGUF is the denoiser only. It needs the VAE and the Qwen3-VL text encoder beside it. The VAE it names is `vae/qwen_image_2.1_vae_bf16.safetensors` from the FP8 repo. The text encoder it names is `Qwen3-VL-8B-Instruct-UD-Q4_K_XL.gguf`, and it says that is the Dynamic 2.0 4-bit rung, not a uniform `Q4_K_M`. I did not download either file. If `sd-cli` cannot find them, the command above will not get as far as a step count.

I searched that saved base README for `8 steps` and `--steps 40`. Neither string was there.

## If the name says turbo, leave the table

A Turbo file does not get the 40, and it does not get the 20. The release's 8 is this file, not a global default you paste onto the guide.

The Turbo GGUF card says Desktop recognizes `qwen-image-2.1-turbo-*.gguf` by name, uses `Qwen/Qwen-Image-2.1-Turbo` for the text encoder and VAE, and applies the 8-step schedule with CFG 1. If the app does that, do not also type 40 into the steps field. You would be overriding the schedule the card says the app already applied. I did not watch it do that. After the first image, open the gallery settings and read the number back. If it says 40, you typed the guide's row onto a Turbo file.

The card recommends `Q4_K_M` at 4.20 GB for most GPUs. That matches the release's "4.2 GB Q4 GGUF" closely enough to be the same file, and it is a file size, not a VRAM measurement. For output closer to bf16, the card says use `Q8_0` at 7.64 GB. It says the 2-bit and 3-bit files drift visibly from bf16 at 8 steps, and it prefers `Q3_K_XL` over the smaller 3-bit and 2-bit files if you must go under 4 GB. Those LPIPS numbers are theirs, measured through Desktop's Diffusers route at 1024, 8 steps, CFG 1. I did not repeat the measurement.

If you drive `sd-cli` yourself, steps alone are not the Turbo command. The card says to pass Turbo's 8-step schedule, plus the terminal 0, as custom sigmas:

```bash
sd-cli --diffusion-model qwen-image-2.1-turbo-Q4_K_M.gguf \
  --vae qwen_image_2.1_vae_bf16.safetensors \
  --llm Qwen3-VL-8B-Instruct-UD-Q4_K_XL.gguf \
  -p "a cartoon sloth mascot waving, flat vector illustration, bright colours" \
  --steps 8 --cfg-scale 1.0 --sampling-method euler -W 1024 -H 1024 --diffusion-fa \
  --sigmas "1.0,0.978453,0.95418,0.926626,0.89508,0.845148,0.704534,0.414568,0.0" \
  -o out.png
```

Copy the sigma string. Do not round it. `--steps 8` without that list is not the command on the card. I did not run it.

The [Turbo FP8 card](https://huggingface.co/unsloth/Qwen-Image-2.1-Turbo-FP8) is the other Turbo link on the guide. I opened it. It calls itself an FP8 and INT8 quant of the same 8-step distilled checkpoint. Its LPIPS note says the scores were taken at 8 steps, CFG 1, the shipped sigma schedule, and 1024. The files it lists are `Qwen-Image-2.1-Turbo-INT8-ConvRot.safetensors` at 7.26 GB (LPIPS 0.037), `Qwen-Image-2.1-Turbo-INT8.safetensors` at 7.26 GB (0.089), and `Qwen-Image-2.1-Turbo-FP8.safetensors` at 7.12 GB (0.125). That ranking is not the guide's quantization table. The guide's table says INT8 LPIPS mean 0.064 and FP8 0.112, and it does not say those rows are Turbo. Do not mix the two tables. If you picked the Turbo FP8 repo, the 8-step, CFG-1 line on that card is the one to keep. The card's Python quick start is a separate install. This how-to does not walk it.

The embedded model text on both Turbo cards says the checkpoint includes its recommended sampling schedule, so you do not configure the scheduler by hand, and generation uses CFG 1 by default. That is why the Desktop sentence and the `sd-cli` sigma list can both be right, and why the guide's 40-step row is the wrong overlay.

## Start at 1024, and treat the memory table as a guess

The guide says memory figures are estimates, not tested minimums, and that usage varies with resolution and offloading. Generate one image at the listed resolution, then increase it if memory allows. Lowering the step count speeds generation up. The same paragraph says it may not resolve a memory limit.

The intro's 11 GB line and the table's first GPU row are different sentences on the same page. The table says:

| Hardware the guide names | Starting configuration it gives |
| --- | --- |
| 12–16 GB VRAM | GGUF Q4_K_M, 1024×1024, batch 1 |
| 24 GB VRAM | INT8/FP8 at 512×512, or GGUF Q4_K_M at 1024×1024 |
| 6 GB VRAM | FP8 with offloading. Their wording is that inference will be "<2x slower." |
| CPU-only, 12–16 GB RAM | GGUF Q4_K_M with the Q4_K_XL text encoder |
| Apple Silicon, 12–16 GB or more unified memory | GGUF with a compatible native backend |

I did not measure any of those rows. Match the row they wrote. Do not invent a row for a machine they did not list. FP8 is what they recommend at 24 GB or more, and they also say it can be preferable on a GPU even with offloading, if you have RAM for the offload. GGUF is what they point at when you have CPU RAM, or a unified-memory Mac. The 4.20 GB Turbo Q4 file size does not replace this table. A small file can still miss if the encoder, the VAE, and the resolution do not fit.

If it runs out of memory, the troubleshooting block says to try a smaller GGUF or a 4-bit file, start with the size marked recommended, lower the resolution, keep batch size at 1, close other apps using the GPU, or pick a smaller model. It says a model marked TIGHT may use system memory and run more slowly, and a model marked OOM is unlikely to fit. I have not seen those badges.

The guide's own quantization paragraph says INT8 had a lower LPIPS than FP8 in their comparison, so they default to INT8. That is a quality note, not a license to ignore the 24 GB row's 512 start for INT8/FP8. File size on that table is 7.26 GB for INT8 and 7.12 GB for FP8. LPIPS mean is 0.064 and 0.112. Lower LPIPS is better, in their words. Those numbers are not the Turbo FP8 card's numbers.

## Do not open Edit for the first image

The same guide disagrees with itself about editing. Read the three sentences before you click the other tab.

The quickstart says that in this release, Qwen-Image-2.1 is available in Unsloth for text-to-image only. The Image Editing section, a few lines later, says you can edit photos with transparent backgrounds using Qwen-Image-2.1, and to select the Edit tab and write a prompt. The workflows table says instruction editing starts with Qwen-Image-Edit or FLUX.1 Kontext, not with Qwen-Image-2.1. The FAQ says Edit follows an instruction and requires a compatible editing model. Transform, it says, redraws an existing image from a prompt that describes the whole result.

The figure on that page is captioned "Image editing by FP8 Qwen-Image-1.2 via Unsloth." That caption is not a 2.1 result. Do not treat the picture as proof that the Edit tab works for this release.

I did not run the app, so I do not know which sentence the UI follows. Unsupported workflows are hidden, the guide says, which means a missing Edit tab is a documented outcome, not a broken install. The first image is Create, a prompt, Generate. If you need an edit, stop and read the workflows row for the model you loaded. Do not discover the policy by sending an edit prompt at 40 steps into a text-to-image file.

## What to do when the image does not appear

The troubleshooting block has a short list. Use it in order, and do not change the step count to "fix" a download.

If no image appears, it says update to the latest version and restart. It points at the [updating page](https://unsloth.ai/docs/get-started/install/updating). I did not open that page, so I am not giving you its steps. Follow the link if you are on that branch.

If the model will not download, it says these files are large, so check free disk and the connection, and check the license-and-token case above.

If a workflow is missing, the loaded model does not support it. That is the Edit case again.

After a successful first image, change one setting if you must. Resolution is the one the guide tells you to raise when memory allows. Steps are not a memory dial. Seed is how you compare two settings without lying to yourself. The gallery Recipe is how you get the first setup back.

## What these pages do not show

I did not install the `.deb`, did not run `install.sh`, did not download a GGUF, and did not run `sd-cli`. A 200 on the asset URL means the file is there. It does not mean the Images sidebar on your machine will apply the Turbo schedule. The gallery read-back is the check.

The release's "2.5x faster" is their claim. The guide's memory numbers are estimates. The two LPIPS tables are different experiments. A green download is not a correct step count.

Pick the file by the repo name. If it does not say turbo, use 40 in Desktop or 20 on the base `sd-cli` command. If it says turbo, use 8, and on `sd-cli` use the sigma list with it. Start at 1024, batch 1, and stay on Create until that first image is in the gallery.
