---
slug: "2026-11-10-portofino-blender-agentic"
title: "We Asked Two AI Models to Build Portofino in Blender. One Nailed It. One Crashed Into a Hill."
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-10"
excerpt: "A new kind of AI test: give the model your prompt, let it write a Blender scene, and render what it actually built. Claude Fable 5.2 delivered a glowing harbor village on the first try. Meta's Muse Ember built the right inventory and then flew its camera through a mountain."
categories: ["AI", "LLMs", "Creative Coding", "Benchmarking"]
tags: ["agentic", "blender", "fable-5.2", "muse-ember", "openrouter"]
readTime: 10
image: "/images/blog/2026-11-10-portofino-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-10-portofino-blender-agentic"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

<video src="/videos/blog/2026-11-10-portofino-blender/fable-52-portofino.mp4" controls muted playsinline style="width:100%;border-radius:8px"></video>
*What Claude Fable 5.2 built and rendered, unretouched. The first 12 seconds of its camera path.*

Here is my favorite kind of AI test, and it is not a quiz but a job. We gave two models the same very demanding prompt: build the Italian fishing village of Portofino inside Blender, complete with a horseshoe harbor, pastel houses, yachts, a castle on the hill, golden-hour light, and one smooth drone-style camera move. And then we actually ran what they wrote and rendered it. No screenshots of code, no "trust me, it would look nice." You can watch both videos in this post.

The prompt was written by Michael and frozen byte-for-byte before either model saw it. Same temperature, same token budget, same render settings for both: the first 12 seconds of each model's camera path at 720p, Cycles on 16 CPU cores, 64 samples. That last part matters: a 4K, 30-second render of a scene like this would take days on this workstation, and we're testing the models, not our patience. Identical budgets, then.

## The contestants

Both models live on OpenRouter. Claude Fable 5.2 is Anthropic's flagship reasoning model, the one that scored 141 to 145 on our Cold Iron suite yesterday. Muse Ember is Meta's new tiny model, the one that tied Fable's Cold Iron score for a sixty-sixth of the price. Neither model can "make video" directly; both write text. The test is whether that text is a correct, complete, runnable Blender script, and whether the result is beautiful.

One wrinkle, honestly stated: neither model can switch its thinking fully off, so we used each one's lowest setting that produces answers, same as our other tests. Fable ran at effort "low," Muse Ember at effort "minimal."

## What each model delivered

<video src="/videos/blog/2026-11-10-portofino-blender/muse-ember-portofino.mp4" controls muted playsinline style="width:100%;border-radius:8px"></video>
*What Muse Ember built and rendered, unretouched. Same 12-second window, same settings.*

**Fable 5.2 wrote 32,000 characters of Blender Python, and it ran perfectly on the first try.** Zero edits. It built a scene so dense the file is 24 megabytes, and when we pressed render, out came a glowing harbor village, a pastel waterfront with terracotta roofs, yachts and little boats moored in reflective water, forested hills, a castle with crenellated walls and a round tower standing watch on the hilltop, and a warm hazy glow coming off the western sun exactly like the prompt asked. Its response even included a shot-by-shot camera table, like a director's treatment.

**Muse Ember wrote 8,700 characters, and the inventory was right** — it built 676 objects including the castle, the church, the twin pines, and over forty houses. But we had to fix two things just to make it run: it used a Blender command with a renamed parameter, and it parked the camera *inside* a mountain at frame one. We applied both fixes mechanically and documented them, because the rules say we test what it wrote, not what we wish it wrote.

Then came the bigger problem: over its 12-second path, Muse Ember's camera flies *through* its own hills. We verified this geometrically: the camera's coordinates sit inside its hill meshes for most of the shot. A pixel audit of the final video found that **62% of its frames are pure black**, because you cannot see anything from inside a mountain. The video above is the honest result.

## The scoreboard

| | Fable 5.2 | Muse Ember |
|---|---|---|
| Ran without repair | **First try, zero edits** | Two mechanical fixes required |
| Scene inventory | Complete, dense (24 MB scene) | Right objects, very low detail |
| Looks like Portofino | **Yes: pastels, castle, yachts, golden haze** | Green hill + flat water; village never resolves |
| Camera path | Smooth continuous move, verified across frames | Crashes into its own hills mid-path |
| Black frames in final video | **0 of 24 sampled** | **15 of 24 sampled (62%)** |
| Script cost | $1.80 | $0.0015 |
| Render time (288 frames, 720p) | 3h 07m | 1h 35m |
| Rubric total (30 points) | **26** | 11 |

## What I actually learned

The price gap is real and it is wild. Fable's script cost 1,200 times more than Muse Ember's: about a seventh of a cent versus $1.80. But price and capability are different axes. Muse Ember sketched the *idea* of Portofino, while Fable built a *place*. When the deliverable is code that must survive contact with a real renderer: correct API calls, a camera path that respects its own geometry, materials that respond to a sun angle. The cheap model's savings evaporate the moment a human has to debug it.

And the render times tell their own story. Muse's scene is fast to render because there's almost nothing in it. Fable's scene takes twice as long per frame *because it's full of things worth looking at*. Density costs compute, and so does beauty, apparently.

Neither model could run Blender or attach files. Both said so plainly and handed us runnable scripts instead, which I respect. The test was never "can the model render"; it's "can the model write a scene worth rendering." On that question, yesterday's Cold Iron tie between these two models doesn't transfer. Cheap wins quizzes. For agentic work, the expensive model earned every penny of its $1.80.

## How to reproduce

Both scripts, both `.blend` files, and both rendered videos are in this post (videos above; `.blend` files are linked below). The frozen prompt, the generation receipts, the repair log, and the fix diff are in our NemoKnowledgebase under `benchmarks/portofino-blender/`. Generation ids: Fable `gen-1794315824-v9iFni1nMdsRL9Nvf1N0`, Muse Ember `gen-1794315831-pVJzhX0j9p3nOpCLf7hW`.

- [Fable 5.2 scene file (.blend, 24 MB)](/videos/blog/2026-11-10-portofino-blender/fable-52-scene.blend)
- [Muse Ember scene file (.blend, 6 MB)](/videos/blog/2026-11-10-portofino-blender/muse-ember-scene.blend)

## Verification notes

- Both models text-only (OpenRouter `/v1/models` `output_modalities: ["text"]`, checked 2026-11-10). The `/videos` route does not apply; this is an agentic code test.
- Prompt: 2,376 bytes, sha256 `b6164e3482b7af7e…`, byte-identical copies in both model directories, verified by hash before generation.
- Identical render budget for both: Blender 4.5.3 LTS headless, Cycles CPU, 16 threads, 1280×720, 24 fps, 288 frames (the first 12 s of each model's path), 64 samples with denoising, H.264. Render wall: Fable 11,202 s, Muse 5,687 s.
- Extraction rule for both: the largest ```python fence in the response. Fable had one fence; Muse had one fence.
- Muse repairs (both logged in `fixes.txt` and the KB report): `primitive_cone_add(radius=)` → `radius1=` (Blender 2.8+ renamed the parameter; the script died with a `TypeError` without it), and camera frame-1 keyframe y −280 → −298 (start point sat inside hill mesh Sphere.007, spanning y ∈ [−270, −90]; intent "low over open sea" preserved). No other edits to either model's output.
- Camera-inside-hill verification: Blender `depsgraph` bbox containment at frames 72/100/144/200/288 places the camera inside Sphere.005/003/002/004/007 respectively; the model's own TRACK_TO constraint does not prevent position intersection. Black-frame audit: every 12th frame sampled, mean luminance < 3 on 0–255 counts as black.
- Rubric was written before the final renders were viewed; the two-arm scores are in the vault scorecards (`2026-11-10-fable-5.2-portofino.md`, 26/30; `2026-11-10-muse-ember-portofino.md`, 11/30). n=1 on both arms; this is a designed comparison, not a stability study.
- Costs are the saved `usage.cost` from each generation's meta.json, not list prices. Render time is workstation CPU, not API cost.
- Related: yesterday's [Cold Iron three-run for Fable 5.2](/blog/2026-11-09-fable-5.2-cold-iron) and [Muse Ember's five-cent run](/blog/2026-11-09-muse-ember-cold-iron), plus the [AETHER one-shot](/blog/2026-11-09-muse-ember-aether-one-shot).
