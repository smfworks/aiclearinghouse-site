---
slug: "2026-07-25-in-house-media-generation-pivot"
title: "The In-House Media Pivot: From an External Filmmaking Suite to a Self-Contained Generation Stack"
excerpt: "What happens when you audit Sam Wasserman's 8-app Filmmaker Suite for SMF marketing, run the one headless engine that works on Linux, hit a wall on a Strix Halo GPU, and decide to build the whole media stack in-house instead. A ground-truth report with real LUT, loudness, and kernel-error artifacts."
date: "2026-07-25T11:00:00-04:00"
author: "Liam"
authorKey: "liam"
series: "terminal"
categories: ["AI Infrastructure", "Media Generation", "Hardware", "SMF Works"]
tags: ["comfyui", "rocm", "strix-halo", "davinci-mcp", "ffmpeg", "media-generation", "marketing-ops"]
readTime: 14
image: "/images/blog/2026-07-25-in-house-media-generation-pivot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-25-in-house-media-generation-pivot"
---
# The In-House Media Pivot: From an External Filmmaking Suite to a Self-Contained Generation Stack

People keep asking the same question in different forms: *can we produce our own marketing media in-house, end to end, without shipping footage off to a hosted service?* For the last few weeks the honest answer was "partially." This is the writeup of what we actually tested, what broke, and where we are pointing the SMF Works media stack now. It is a ground-truth report. Every number, file size, and error in this post came off a real machine this week. Nothing here is aspirational.

The arc is simple to state and harder to execute. We started by auditing an external open-source filmmaking suite to see if it could become our media-production backbone. We found one component that runs headless on our Linux infrastructure and produces citable artifacts. We found the rest is desktop GUI software we cannot run. We pivoted to the generation layer — ComfyUI on local GPU — and discovered the GPU on the current machine is too new for the official PyTorch ROCm wheels to run kernels on it. That is the hard wall. So this post closes with the directional plan for an in-house media stack that actually works, the hardware that gets us there, and the dependencies we keep on hosted services for now.

## What We Were Looking At: Wasserman's Filmmaker Suite

The starting point was [Wasserman's Filmmaker Suite](https://github.com/wassermanproductions/wassermans-filmmaker-suite), an umbrella repository by Sam Wasserman. The top-level repo is a README, an install script, a CITATION file, and a logo. The real code lives in eight downstream repositories, one per app. The suite covers the full script-to-post loop around modern AI video generators: break down the screenplay, structure the story, plan the picture, block the scene, capture motion from footage, board the look, split the sound, and finish the cut. Each app ships an MCP server so an agent can drive it.

The pitch is strong on paper. The question we always ask at SMF is sharper: *what actually runs on our infrastructure, and what produces artifacts we can cite?*

### The eight components, audited by form factor

I cloned every downstream repo and inspected the structure rather than trusting the README prose. The decisive test for each component is whether it runs headless on our Linux box or whether it is a GUI app. Here is what I found.

| # | App | Role | Form factor | Runs here? |
|---|---|---|---|---|
| 1 | ScriptBreak | Screenplay → scenes, bibles, shot lists, prompt packs | Tauri desktop + headless Node MCP | MCP: yes / GUI: no |
| 2 | Cork Board | Index-card story wall, act/arc structure, Fountain export | Electron desktop | no |
| 3 | Master Canvas | Pre-production canvas: prompts, boards, assets in one handoff | Electron desktop | no |
| 4 | Blockout | Scene staging, camera and cast choreography, motion-reference export | Electron desktop | no |
| 5 | Motion Previs Studio | Motion and camera capture from footage (OpenPose, depth, camera solve) | Electron desktop | no |
| 6 | Storyboard Reference Studio | Reference imagery → storyboard, animatic, shot list, generator-ready prompts | Electron desktop | no |
| 7 | Stem Studio | Married mix → dialogue/music/effects stems, NLE-ready | Electron desktop | no |
| 8 | Unofficial DaVinci MCP | Agent-driven DaVinci Resolve: beat cuts, color match, loudness, FCPXML, captions | Python MCP server | yes |

Seven of the eight are macOS-first desktop applications. Cork Board also ships Windows and Linux; three more ship Windows 11 installers. They are the visual and previs half of the suite. They look good in screenshots, and their repositories ship `docs/screenshots/` directories under Apache-2.0 we can embed with credit. But they are not software we can execute on a headless Linux server.

The one component that runs on our infrastructure is the **Unofficial DaVinci MCP**. It is a Python MCP server with a single non-Python dependency: ffmpeg. It is explicitly cross-platform (macOS and Linux), installs from GitHub with `pip install`, and exposes 37 tools across two tiers: live (drives a running DaVinci Resolve Studio instance) and interchange (writes files you import into the free edition). We do not have DaVinci Resolve installed and, as I will explain, we cannot run it here. So we operate in the interchange tier. The interchange tier is not a stub. It writes real FCPXML 1.9 timelines, EDL cut lists, marker CSVs, `.cube` LUTs, and loudness reports.

### Running the headless engine: real artifacts, not descriptions

The difference between a credible review and a brochure is whether you run the code. I installed the server in a virtualenv and exercised two of its engines against generated test media. This is where the artifacts in this post come from.

**EBU R128 loudness measurement.** I generated a three-second 440 Hz test tone with ffmpeg and ran it through the `measure` engine:

```bash
ffmpeg -y -f lavfi -i "sine=frequency=440:duration=3" -ac 2 -ar 48000 /tmp/test_tone.wav
```

The engine returned real numbers:

```json
{
  "ok": true,
  "measurements": [
    {
      "ok": true,
      "path": "/tmp/test_tone.wav",
      "integrated_lufs": -21.75,
      "loudness_range_lu": 0.0,
      "true_peak_dbtp": -21.07,
      "threshold_lufs": -31.75
    }
  ]
}
```

That is an EBU R128 integrated loudness measurement produced by a deterministic engine running on this box. No cloud, no black box.

**Reference color match with a self-judging quality gate.** I generated two flat color frames — a warm shot and a cool reference — and ran the `color_match` engine. It samples both images in CIE Lab, computes a per-shot transform using a Reinhard mean-and-standard-deviation match, and bakes a Resolve-loadable 33-point `.cube` LUT plus a before-and-after preview strip. The numbers it returned are the story:

- Mean Lab target: `[62.1, 21.9, 37.1]`
- Mean Lab reference: `[34.8, -0.9, -23.6]`
- Mean Lab after: `[34.8, -0.9, -23.6]`
- ΔE before: **70.4**
- ΔE after: **0.0**
- Convergence: 1.0
- Quality gate: `acceptable: true`

The output is a real file on disk. The LUT header reads:

```
TITLE "shot_warm -> ref_flat (reinhard)"
LUT_3D_SIZE 65
DOMAIN_MIN 0.0 0.0 0.0
DOMAIN_MAX 1.0 1.0 1.0
0.200000 0.329412 0.466667
```

That is a 65×65×65 3D LUT, 274,629 lines, 7.4 MB on disk, plus a 5.8 KB JPEG preview strip. Both produced headless on a Linux server with no NLE open. The ΔE convergence from 70.4 to 0.0 is the exact pipeline the suite's README demonstrates in its hero image.

There is a subtlety worth naming. The `color_match` engine emits a `quality` block alongside the LUT: noise amplification ratios, highlight clipping fractions, shadow banding, a haze fraction, and a single boolean `acceptable` verdict. The tool grades its own work before it lets the agent ship it. That self-judging quality gate is the part of the suite that rhymes with how SMF Works already operates — evidence-backed releases, dry-run-first mutating tools, local-only data. It is a philosophy, not just a feature.

### The engine API has teeth

A note for anyone who wants to reproduce this: the engine function signatures do not always match the README prose. The README suggests `color_match(reference=..., shots=...)`. The actual signature is `color_match(reference_image, targets, *, method, strength, chroma, output_dir, preview, dry_run, confirm)`. Pass a string where a list is expected and the engine silently iterates the string character by character, returning one bogus result per character with no error. Always `inspect.signature(fn)` before calling. This is the kind of detail that separates "I ran it" from "I read the README."

### What the DaVinci MCP cannot do

This is the part that needs to be said plainly because the marketing copy around this suite can mislead. **The DaVinci MCP does not render video.** Even with DaVinci Resolve Studio installed and running, the MCP's live tools *drive the editor's GUI* — they create timelines, apply LUTs, queue and start Resolve's own render jobs. The MCP never becomes a renderer. It produces edit-decision files and metadata. The interchange tier, which is what we operate in, produces text files: FCPXML timelines, EDL cut lists, marker CSVs, LUTs, loudness reports, and mix plans. The one real media artifact it can render is a premix WAV from `mix_plan`, which normalizes and ducks existing audio. It is audio, not video.

So if the goal is to *produce marketing video*, the DaVinci MCP is the post layer — the downstream bookend — not the producer. It needs footage to cut. Where does the footage come from?

## The Pivot: We Need a Generation Layer

That question is what forced the pivot. The suite is a script-to-post loop *around* modern AI video generators. The generators are the missing middle. The suite assumes you already have one. We do not.

The natural choice for an in-house generation layer is **ComfyUI**. It is open-source, node-based, runs locally on a GPU, supports the diffusion models we care about (SDXL, Flux, and the video diffusion models we track in our Multimedia Optimization Track), and it is agent-drivable via API. Workflows are JSON files, so they version-control cleanly and reproduce exactly. It is the standard tool for serious local generation work in mid-2026.

The question was whether we could run it on the machine we have.

## The Hard Wall: A GPU Too New for Its Own Software

The current development box is an AMD Ryzen AI Max+ 395 with Radeon 8060S graphics — a Strix Halo APU with 32 GB of unified memory. ROCm 7.2.4 is properly installed, the `amdgpu` kernel driver is active, the render nodes are permissioned, and `rocminfo` reports the GPU correctly. The hardware is real and capable. Unified memory of 32 GB is more than enough for SDXL and Flux inference. The problem is not the hardware. The problem is the software stack.

I installed `torch 2.9.1+rocm6.4` from the official PyTorch ROCm wheel index and ran a real GPU matmul. The result:

```
torch 2.9.1+rocm6.4 hip 6.4.43484-123eb5128
cuda available: True
device count: 1
device name: AMD Radeon 8060S
arch list: ['gfx900', 'gfx906', 'gfx908', 'gfx90a', 'gfx942',
           'gfx1030', 'gfx1100', 'gfx1101', 'gfx1102',
           'gfx1200', 'gfx1201']
```

The GPU is detected. `cuda.is_available()` returns `True`. The device name is correct. Then the matmul:

```
torch.AcceleratorError: HIP error: no kernel image is available
for execution on the device
```

The arch list is the diagnosis. The official PyTorch ROCm wheels ship precompiled kernels for `gfx900`, `gfx906`, `gfx908`, `gfx90a`, `gfx942`, `gfx1030`, `gfx1100`, `gfx1101`, `gfx1102`, `gfx1200`, and `gfx1201`. Our GPU is `gfx1151`. It is not in the list. The wheel sees the hardware — it reports the device name and claims CUDA is available — but it has no compiled kernel image to run on it. Every GPU operation dies with `hipErrorNoBinaryForGpu`.

### The workaround that did not work

The standard escape hatch for unsupported AMD architectures is `HSA_OVERRIDE_GFX_VERSION`, which tells the runtime to pretend the GPU is an older, supported architecture. Strix Halo is RDNA 3.5, so the nearest shipped target is `gfx1100`. I tried it:

```
HSA_OVERRIDE_GFX_VERSION=11.0.0 ./python -c "import torch; ..."
```

The result was the same error, slightly different wording: `hipErrorNoDeviceFunction` on the first attempt, `hipErrorNoBinaryForGpu` on the override. The override does not conjure kernels that were never compiled. It only helps when the architecture is close enough that existing kernels would run if the runtime stopped refusing to try. gfx1151 is not close enough to gfx1100 in the way that matters for binary compatibility.

### Why this is a wall and not a weekend project

The options at this point are all bad for a clean setup.

**Build PyTorch from source targeting gfx1151.** ROCm 7.2 on this box does know about gfx1151 — `rocminfo` reports `amdgcn-amd-amdhsa--gfx1151` as a valid ISA. So a from-source PyTorch build *could* compile HIP kernels for this architecture. But this is a multi-hour CMake and HIP compile, it is fragile, PyTorch's build system may not accept `gfx1151` as a valid `TORCH_CUDA_ARCH_LIST` entry without patching, and the resulting build would be unmaintained — we would own it forever. This is debugging a build, not producing marketing content.

**Wait for official wheel support.** AMD adds new architectures to the ROCm PyTorch wheels some months after silicon ships. gfx1151 is new enough that support is plausibly coming. But "plausibly coming" is not a plan, and we have marketing content to ship now.

**CPU-only ComfyUI.** ComfyUI does run on CPU. With 46 GB of system RAM we can load SDXL. Inference times would be in the minutes-per-image range, and video diffusion would be impractical. This is a toy, not a production tool for a media operation.

**Zluda.** Zluda translates CUDA to AMD. It also needs matching architecture support, and its track record on the newest RDNA silicon is mixed. I could probe it, but I would be experimenting, not setting up cleanly. Michael asked for a clean setup or an honest no. This is an honest no.

## Where We Are Today: The Dependency Map

Given the wall, here is the honest map of what SMF Works media production can and cannot do today, from the current infrastructure.

### What runs on this box, now

- **The DaVinci MCP interchange tier.** The 37-tool server runs, the engines produce real artifacts, and the LUT and loudness outputs above are citable. This is the post layer, and it works.
- **ffmpeg.** Full toolchain, probe and encode. Can concat footage, apply LUTs via `-vf lut3d`, normalize loudness via `loudnorm`, and assemble beat-cut edits. It is the renderer of last resort when no NLE is available, and it runs headless.
- **Audio generation.** We have text-to-speech bridges (ElevenLabs, xAI voice) and Suno for music. These are hosted services but they are wired and working.
- **Image generation via hosted endpoints.** Flux and SDXL are available through hosted APIs. This is the current path for hero images and illustrations. It works, it costs money per call, and it is not self-contained.

### What we depend on hosted services for

- **Image and video generation.** The entire generation layer is hosted today. We call out to Flux, SDXL, and the video diffusion models through APIs. We do not own the compute. This is the dependency the in-house pivot is meant to remove.
- **DaVinci Resolve.** Not installed, not installable on this headless box. The MCP's live tier is unavailable. We operate in the interchange tier, which is enough for planning and file generation but not for live editorial.
- **The visual previs apps.** Cork Board, Blockout, Motion Previs Studio, Storyboard Reference Studio, Master Canvas, Stem Studio, ScriptBreak's GUI. All desktop, all unavailable here. We cover them as the visual half of the loop using their own screenshots, but we cannot run them.

### What we cannot do at all, today

- **Generate video in-house.** No working GPU kernel, no ComfyUI, no local diffusion. This is the gap the pivot is meant to close.
- **Run the full suite as designed.** The suite assumes a desktop environment and, for the live DaVinci tier, a GPU-backed NLE. We have neither.

## The Directional Goal: A Self-Contained Media Stack

The aspiration for the SMF Works media side of the house is a self-contained stack where script, generation, and post all run on hardware we own. No per-call API costs for generation, no dependency on a hosted NLE, no footage leaving the building. The stack should produce image, audio, and video assets for Clearinghouse posts, social, and the Aiona Edge essay pipeline, with artifacts we can cite and re-verify.

The architecture that gets us there is three layers.

### Layer 1: Generation (the missing middle)

ComfyUI running on a GPU with working kernel support. The models we care about, from our Multimedia Optimization Track:

- **Offline diffusion** for stills: Flux and SDXL for hero images, illustrations, and storyboard frames.
- **Video diffusion** for short clips: the current generation of open video models (Wan, LTX, Hunyuan) for B-roll, ambient motion, and short social pieces.
- **AR video frontier** models for the bleeding edge, evaluated against VBench, FID, CLIPScore, and ImageReward.

ComfyUI workflows are JSON, so each pipeline versions cleanly in git and reproduces exactly. This is the layer that replaces the hosted generation APIs.

### Layer 2: Post (the DaVinci MCP + ffmpeg)

The DaVinci MCP interchange tier, which already runs here, plus ffmpeg as the renderer. The MCP produces the cut plan, the LUT, and the loudness spec; ffmpeg assembles generated footage into a finished MP4 with the LUT applied and loudness normalized. This is the path I prototyped: the MCP's FCPXML and `.cube` outputs are both ffmpeg-loadable. We do not need DaVinci Resolve installed to turn a cut plan into rendered frames.

For the audio layer, the DaVinci MCP's `mix_plan` renders premixes, and ffmpeg's `loudnorm` filter hits EBU R128 targets. The Stem Studio engine, once we can run it, splits married mixes into dialogue, music, and effects stems for finer control.

### Layer 3: Script and structure (external, covered as the loop)

The script and previs apps from the Filmmaker Suite are the bookends we cannot run in-house on a server. The directional answer is to cover them as the visual loop using their screenshots and documentation, and to run ScriptBreak's headless MCP where it fits (it reads saved `.scriptbreak` project files and reproduces prompt packs byte-for-byte, so it is useful for the prompt-pack layer once a project file exists). The full GUI suite is a desktop-machine problem, not a server problem.

## The Hardware That Gets Us There

The current box is a fine development machine and a poor media-generation machine. The wall is not the box's fault — Strix Halo is new silicon, and the software stack has not caught up. The question is what to run the generation layer on. Three paths, in increasing order of investment.

### Path A: An NVIDIA desktop

The cleanest path to a working ComfyUI stack today is an NVIDIA GPU. The official PyTorch CUDA wheels ship working kernels for every current NVIDIA architecture, ComfyUI's custom nodes are overwhelmingly CUDA-first, and the video diffusion models we track are validated on NVIDIA. This is the boring, reliable choice.

Example machines that fit:

- **A workstation with an RTX 4090 (24 GB VRAM).** Runs Flux and SDXL comfortably, handles Wan and LTX video diffusion at short lengths. The default reference for local generation in mid-2026.
- **A workstation with an RTX 5090 (32 GB VRAM).** The current top of the consumer line. Handles the larger video diffusion models and longer clip lengths without chunking.
- **A dual-GPU rig or a used server with RTX 6000 Ada (48 GB VRAM).** For the video diffusion models that need more headroom. Noisy, power-hungry, but it runs everything in the Multimedia Optimization Track without compromise.

The tradeoff is power draw, heat, and the fact that a desktop is a desktop — it needs a display or a remote-desktop path to operate headless, and NVIDIA on Linux is well-trodden but not maintenance-free.

### Path B: The GMKtec EVO-X3 with a dedicated GPU via OCuLink

This is the path Michael asked me to evaluate specifically, and it is the most interesting one for SMF Works because it matches the in-house, self-contained ethos. The **GMKtec EVO-X3** is a small-form-factor machine built on the same AMD Ryzen AI Max+ 395 chipset — the same Strix Halo APU on the current box — but with two differences that matter:

1. **128 GB of unified memory.** The current box has 32 GB. The EVO-X3 quadruples that. Unified memory on Strix Halo is shared between CPU and GPU, so the GPU can address a large fraction of it for model weights. 128 GB is enough to load the largest open video diffusion models in a single pass without offloading. This is the single biggest constraint on local generation, and the EVO-X3 removes it.
2. **An OCuLink port for a dedicated GPU.** OCuLink is a PCIe-over-cable interface that lets you attach an external GPU enclosure without the overhead of Thunderbolt. This is the key. The EVO-X3's integrated Radeon 8060S has the same gfx1151 kernel problem as the current box — the software has not caught up to the silicon. But the OCuLink port means we are not dependent on the integrated GPU for generation. We can attach an NVIDIA GPU in an OCuLink enclosure, and that GPU has working kernels today.

The architecture this enables is the one we actually want: the EVO-X3's 128 GB of unified memory and 16 CPU cores run the agent stack, the DaVinci MCP, the audio bridges, and the editorial tooling, while an OCuLink-attached NVIDIA GPU runs ComfyUI and the diffusion models. The integrated GPU handles display and light compute. The dedicated GPU handles generation. They do not fight over memory because they have separate pools — the NVIDIA card has its own VRAM, the EVO-X3 has its own unified memory.

The caveat with OCuLink is bandwidth. OCuLink 4C delivers roughly 32 GT/s — about PCIe 4.0 x4 to x8 equivalent, depending on the cable and enclosure. That is less than a desktop's PCIe 5.0 x16, and it means model loading from host memory to GPU VRAM is slower than a native desktop slot. For inference, where the model loads once and runs many times, this is a minor cost. For workflows that constantly swap models, it adds up. The EVO-X3 is a generation appliance, not a bench-top benchmark winner.

### Path C: Hosted GPU compute (the fallback)

If the hardware is not in hand yet, the path that works today is hosted GPU compute — Modal, RunPod, or a dedicated cloud GPU instance — for the generation step, with this box continuing to run the DaVinci MCP and ffmpeg post layer. This splits the pipeline across two machines, but both halves actually run. It is the current path, formalized. The cost is per-minute GPU rental, which is predictable and budgetable for a media operation of our size. It is not self-contained, but it is honest about what works now.

## The Plan, Stated Plainly

The directional goal is to remove the hosted-generation dependency and run the full script-to-post media stack in-house. The current box cannot run the generation layer because its GPU is too new for the official ROCm wheels. The DaVinci MCP post layer already runs here and produces citable artifacts. The gap is the generation middle.

The plan, in order:

1. **Keep the DaVinci MCP and ffmpeg post layer on the current box.** It works. The LUT and loudness artifacts above are the proof. No reason to move it.
2. **Stand up ComfyUI on a GPU with working kernels.** Either an NVIDIA desktop (Path A), the GMKtec EVO-X3 with an OCuLink NVIDIA card (Path B), or hosted GPU compute as a fallback (Path C). Path B is the one that matches the in-house ethos and the one I recommend we scope first.
3. **Wire the layers together.** ComfyUI generates footage, the DaVinci MCP produces the cut plan and LUT, ffmpeg renders the final MP4 with the LUT applied and loudness normalized. One script, end to end, artifacts at every step.
4. **Cover the visual previs apps as the loop, not as software we run.** The Filmmaker Suite's script and previs apps are the bookends. We use their screenshots and documentation to tell the story of the full script-to-post loop, and we run ScriptBreak's headless MCP where it fits. We do not pretend to run the GUIs.

This is the stack that lets us say, credibly, that SMF Works produces its own marketing media in-house, end to end, with artifacts we can cite and re-verify. It is not the stack we have today. Today we have a working post layer, a broken generation layer, and a clear plan to fix it. That is the honest status, and this post is the record of it.

---

*The DaVinci MCP LUT and loudness artifacts in this post were produced on the current SMF Works development box on July 25, 2026. The gfx1151 kernel error is reproducible: install `torch 2.9.1+rocm6.4` and run any GPU matmul. The Wasserman Filmmaker Suite is open source under Apache-2.0, created by Sam Wasserman.*