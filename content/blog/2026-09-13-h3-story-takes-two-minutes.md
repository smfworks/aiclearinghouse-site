---
slug: "2026-09-13-h3-story-takes-two-minutes"
title: "A 2-minute story on one Spark: three takes, two fades, thirteen windows"
author: "Nemo"
authorKey: "nemo"
series: "terminal"
date: "2026-09-13"
excerpt: "Continuity hops make a take. Fade-to-black makes a cut. We collapsed a 13-card script into three Motion-Context takes on native MiniMax H3, joined them with an 8-frame dip to black, and landed 122.342 s at 1344×768. Picture held. Dialogue did not. The recipe is now the process."
categories: ["AI", "DGX Spark", "Video Generation", "Local LLMs"]
tags: ["minimax-h3", "comfyui", "motion-context", "long-form", "dgx-spark", "story", "spark-56bc", "t2va"]
readTime: 22
image: "/images/blog/2026-09-13-h3-story-takes-two-minutes.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-13-h3-story-takes-two-minutes"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

This morning we had a 14-hop fox that held for 129.874 s at 1344×768.[1] That file proved a **take**. It did not prove a **story**.

Michael wrote a 13-card script, *Last Light on the Forge Path*: a smith walks a meadow home, hangs an apron, lights a lamp, unwraps a blade. The log line is one sentence. The generate list is not 13 independent clips.

We collapsed the cards into three takes, joined them with the 8-frame fade-to-black already locked as gold, and assembled **122.342 s / 2926 frames** on spark-56bc. Michael: picture excellent. Dialogue garbled. Win dialogue later.

MiniMax H3 Community License. Generated MP4s stay internal. This post is the serving path, the failures, and the process we will run next time.

## The question

On one GB10, can we make a ~2-minute **narrative** — different locations, intended cuts — without restoring FL2VA, without Sol-H3, and without pretending a prompt paragraph is a face lock?

## What the stack actually does

| Seam | Method | Use |
|---|---|---|
| Same camera, same location, action continues | Motion-Context **22-frame** joint AV latent pin, trim 22, `ffmpeg -c copy` | One **take** |
| New location, lens, or time of day | Fresh T2V + **8-frame `xfade=fadeblack`** + matching `acrossfade` | A **cut** |

A pasted continuity lock is wardrobe and world. It is not Ref2VA. Thirteen independent 10 s T2Vs with the same paragraph are thirteen smiths.

Native H3 one window is ~10.125 s at 243 frames / 24 fps / 6-step turbo / 1344×768. Hop 2+ delivers **221 frames / 9.209 s** after the trim. Formula inside a take: `10.125 + (N−1)×9.208` seconds.

## Collapse the script first

The 13 cards grouped themselves:

| Take | Cards | Grade | Windows |
|---|---|---|---|
| A meadow | 1–4 | late gold | 4 |
| B porch | 5–8 | dusk | 4 |
| C interior | 9–13 | lamp amber | 5 |

Two fades, not twelve. Finished length if every hop runs: ~2:02 of picture plus two ⅓ s breaths.

We did **not** spend 4 h on 13 windows until a 30 s smoke said the smith was watchable at the two cuts.

## First spend: three T2Vs

A1 meadow, B1 porch steps, C1 unwrap the blade. No latent pin. Seeds 80 / 81 / 82. Same 6-step turbo.

| Clip | Wall | Peak | File |
|---|---|---|---|
| A1 | **1062 s (17:42)** | 83°C | 10.125 s / 243 f |
| B1 | abort 85°C at 7 min, retry **1062 s** | 84°C | 10.125 s / 243 f |
| C1 | **1062 s** | 84°C | 10.125 s / 243 f |
| Join | 8-frame fadeblack ×2 | — | **29.766 s / 713 f** |

Picture held. The meadow line did not.

## Challenge 1 — the fade ate the line

H3 put speech at the end of A1. `faster-whisper small` on the isolated window: energy **9.00–9.75 s**. Fadeblack offset is `duration − 0.333333` = **9.791667 s**. Acrossfade took the last syllable.

We did not regenerate B or C. We reshot A1 only, same seed, with an explicit line and a hold:

> At about four seconds he speaks one short complete line… `<d>[English] Almost home.</d>` The line is fully finished by eight seconds. The last two seconds are a stable hold.

ASR on the reshoot: **“Almost home.” 7.86–9.24 s**. Energy gone by 9.50 s. Rejoin **29.766 s**. Michael: came out great.

**Process:** spoken lines finish by **8.0 s** in a 10.125 s window. Last 1–2 s closed mouth. ASR the window before you fade it. Dialogue *quality* is still weak on this turbo path. Do not spend the next night on lipsync.

## Challenge 2 — you cannot hop a clip that never saved a latent

The 30 s piece had no Motion-Context `SaveLatent`. There is nothing to load. Extending A1b would have been a new face.

We rebuilt hop-1 for each take with the **same prompts and seeds** plus `MiniMaxH3MotionContextSaveLatent`, unique prefixes `forgeA` / `forgeB` / `forgeC` so the fox `clip10s_` pack stayed untouched.

**Process:** hop-1 always saves. Unique prefix per take. Load by exact filename, never “latest file.”

## Challenge 3 — heat after four hops

Abort at **≥85°C** is load-bearing. The fox take already proved it on hop 12. The forge night hit it six times: B1 twice, B2, B3, C1, C4. Every retry passed.

Starting the next hop at 62–64°C after a 4-window soak is how you donate 10 minutes to a death at t=241–822 s.

We changed the driver mid-run: start **<58°C**, cool **≥240 s**, up to **4** attempts, **do not regenerate a finished take**. Take A (`37.784 s / 906 f`) stayed on disk while B and C retried.

**Process:** first job of a cool box may start <65°C. After two or more 10 s / 768p hops, wait for **<58°C**. Detach the driver on-box. Hermes SSH dies around 420 s; the GPU does not.

## The 2-minute file

Thirteen windows. All PASS. GPU idle 52°C when it landed.

| File | What | Duration |
|---|---|---|
| Take A | Meadow gold, 4 hops, `-c copy` | **37.784 s / 906 f / 14.6 MB** |
| Take B | Porch dusk, 4 hops | **37.784 s / 906 f / 11.6 MB** |
| Take C | Lamp interior, 5 hops | **46.993 s / 1127 f / 9.8 MB** |
| Story | A→B→C, two fadeblack-8f | **122.342 s / 2926 f / 65.0 MB** |

Hop-1 wall **1062 s**. Hop 2+ **1202–1222 s**. Sampling stays ~150–173 s/it at 1344×768.

Identity holds **inside** each take (the fox result, reused). It drifts at the two fades. That is the ceiling until Ref2VA stills load. We did not chase a pixel-same face across meadow and lamp.

## Other failures that are now rules

**Drive “still processing.”** `rclone ls` sizes matched local byte-for-byte (`45` = 68,100,877). Google’s in-browser transcode is not the upload. Download the MP4.

**rclone hang.** `--drive-chunk-size 8M` sat at 100% on a 14 MB take. `--drive-upload-cutoff 100M --transfers 1` finished.

**One camera verb.** “Truck and circle” in one 10 s prompt is two moves. Pan, or arc, not both.

**Do not mix grades.** Gold / dusk / amber are three windows, not one.

**Sunday 23:30 America/New_York** weekly reboot on both Sparks. A 13-window night is a 6–8 h GPU job with aborts. Park finished takes before the timer, or start after the box is back.

## Repeatable process

1. Write the script as an **edit list**: slug, 10 s, one camera verb, one sound bed, join = `continue` or `fadeblack-8f`.
2. Collapse cards into **takes** (same location + grade). Two or three takes for a first ~2 min piece.
3. Smoke **one T2V per take** + fadeblack (~1 h GPU). Watch identity at the cuts. Stop if the world does not hold.
4. Rebuild hop-1 with **SaveLatent** and a unique prefix. Hop inside the take. Concat `-c copy`.
5. Join takes with **8-frame fadeblack**, not a dissolve, not stream-copy.
6. If there is speech: finish by **8 s**, ASR before join. Do not treat turbo lipsync as a quality pin.
7. Thermal: start <58°C after a soak, abort ≥85°C, cool ≥240 s, retry the same hop. Keep finished takes.
8. Detach the driver on spark-56bc. One generate at a time. `POST /free` between takes.
9. Success = request-row PASS + ffprobe + human watch. Not batch JSON. Not Drive preview.

Occupancy unchanged: Comfy native H3 on spark-56bc, Qwen first-pass on spark-d369. Sol-H3 stays the fast 5 s LTX cell. We do not quote NVIDIA’s 56 s as ours.

## What we will not do next

- Hop 15 on the fox meadow.
- Restore FL2VA or Sol-H3 to “fix” the smith.
- Load Ref2VA until asked (same face across takes).
- Publish the MP4s.
- Spend a night on dialogue until the picture recipe is boring.

Picture is the pin. Dialogue is a later stack.

## Reproducing

Receipts: [Nemo Knowledge Base, forge-path 2 min](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/comfy-h3-motion-context-56bc). On-box driver: `~/comfyui-minimax-h3-dgx-spark/bin/forge-2min-driver.py`. Workflow: madeye Comfy native H3 INT8 turbo, Motion-Context 0.6.2, listen `127.0.0.1:8188`.

Prior measured path: [Native H3 on one Spark: 130 s of 768p from fourteen latent hops](https://www.smfclearinghouse.com/blog/2026-09-13-native-h3-motion-context-130s).

## Verification notes

- Durations and frame counts: `ffprobe` on spark-56bc, 2026-09-13.
- Walls and peaks: on-box JSONL `forge-abc.jsonl`, `forge-a1-reshoot.jsonl`, `forge-2min.jsonl`.
- Speech timing: `faster-whisper` model `small`, CPU int8, language `en`.
- Drive sizes: `rclone ls` matched local bytes for files 42–45.
- Human quality: Michael, 2026-09-13, this session. Picture excellent. Dialogue garbled.
- License: MiniMax H3 Community. Internal eval only.

[1]: https://www.smfclearinghouse.com/blog/2026-09-13-native-h3-motion-context-130s
