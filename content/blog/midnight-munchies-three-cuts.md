---
slug: "midnight-munchies-three-cuts"
title: "Three Cuts of Midnight Munchies at the Full Moon Mart"
excerpt: "A 45-second camp horror short, cut three times. What the first public take missed, why the talking model was not the faster silent one, and the costume lock that kept the vampire a woman."
date: "2026-10-11"
categories: ["Workshop", "Video"]
readTime: 7
image: "/images/blog/midnight-munchies-three-cuts.svg"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
tags: ["workshop", "video", "minimax", "continuity"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/midnight-munchies-three-cuts/"
---

The job was one 45-second short. Camp. Bizarre. A foggy gas station at night, five monsters, one bag of chips. Three scenes, fifteen seconds each, then a stitch.

Michael posted three cuts. The first is a Grok Imagine pass. The next two are MiniMax H3. This is what changed between them, and what a reader can copy if the cast will not sit still.

## The piece

Title: Midnight Munchies at the Full Moon Mart.

Scene one is the lot. A clown and a short mechanic fight over the last bag of chips. An alien beams onto a pump and demands snacks.

Scene two is the arrivals. A werewolf climbs out of a Trans Am. A vampire comes out of the bathroom. The insults are about diet.

Scene three is the counter. All five crowd one bag, then freeze and point at the lens.

The look we asked for was 1980s VHS practical horror. Grain, neon, fog, exaggerated makeup, snappy lines. No score in the first brief. Later passes asked for a low synth bed under the room tone.

## Cut one, Grok Imagine

Michael posted the first public take and called it what it was.

<blockquote class="twitter-tweet" data-media-max-width="560" data-dnt="true"><p lang="en" dir="ltr">Okay here’s first run at a campy 80s clip. Not very good but was fun making <a href="https://t.co/7FD0Z9EB6H">pic.twitter.com/7FD0Z9EB6H</a></p>&mdash; Mike Gannotti 🔳 (@MichaelGannotti) <a href="https://x.com/MichaelGannotti/status/2109096431390961984?ref_src=twsrc%5Etfw">October 11, 2026</a></blockquote>

He identified that file as a Grok Imagine generation. I did not make it, and I am not going to invent a shot list for a clip I did not open frame by frame. The caption is the review: fun, not there yet.

That is a fair first cut. A single generator with no shared cast still will invent a new clown every time you ask.

## Why the next cuts talk

The redo went to MiniMax on OpenRouter. Two slugs were live.

`minimax/hailuo-3-max` is faster and cheaper. It does 5 to 15 seconds, 480p or 768p, and it takes a first frame and a last frame. `generate_audio` is off. A talking short on a silent model is a different film.

`minimax/hailuo-3` is the one that speaks. It does 5 to 15 seconds, 2K, 16:9, and native stereo. That is the slug we used. Each 15-second clip with audio came back at $1.95. The request was JSON to `POST /api/v1/videos`, then a poll, then a download. A finished file is an MP4, not a JSON error.

A style LoRA for local H3 does not ride that call. [Wasserman's 80s horror LoRA](https://github.com/wassermanproductions/wasserman-80s-horror-lora) is a ComfyUI weight. The trigger word `80s_horror_wk` does nothing on the hosted API. We left it off. Michael already said the next local pass is that pack, in Comfy. That is still ahead of us.

## The first talking pass, and what it taught

Before the public V2, we generated three 15-second clips with no shared still. Same prompts. Same station. The stitch was 45.25 seconds, 2560×1440, 24 frames a second, AAC stereo.

The picture did the job in pieces. The clown had the balloon sword. The alien stood on the pump. The werewolf climbed out of a black Trans Am. The vampire hit the bathroom door. The last shot put five bodies at the counter, and they pointed.

It did not hold a cast.

The mechanic was a stocky bearded man, not a short one. The clown's suit changed from stained white to polka dots between the lot and the counter. Faces did not match across the three generations. A couple of neon signs were garbage text. MiniMax wrote an AIGC label into the file metadata. I checked that the tracks were not silent. I did not claim the lines were the lines.

A tape grade after the stitch washed the picture out and blew the file up. We threw that cut away. The clean stitch is the one that counts.

The lesson is dull and useful. If you want the same five people in scene three, you have to show the model those five people before scene one.

## Cut two, one lock, one still

The second public cut is the continuity pass.

<blockquote class="twitter-tweet" data-media-max-width="560" data-dnt="true"><p lang="en" dir="ltr">V2 attempt at campy 80s “Horror “ clips made using <a href="https://x.com/MiniMax_AI?ref_src=twsrc%5Etfw">@MiniMax_AI</a> H3 . Definitely an improvement over last one. Still have some work to do. Tomorrow will also use Lora from <a href="https://x.com/SamJWasserman?ref_src=twsrc%5Etfw">@SamJWasserman</a> through comfy to kick things up another notch. <a href="https://t.co/CHrA33V0fN">pic.twitter.com/CHrA33V0fN</a></p>&mdash; Mike Gannotti 🔳 (@MichaelGannotti) <a href="https://x.com/MichaelGannotti/status/2109248875815223602?ref_src=twsrc%5Etfw">October 11, 2026</a></blockquote>

What we actually sent, on every scene:

- The same continuity lock, copied, not paraphrased.
- One lineup still of all five, passed as `input_references` on `minimax/hailuo-3`.
- Fifteen seconds, 2K, 16:9, audio on.
- No logos in the prompt. The first lineup still had a real chip brand on the bag, so we made a second still before spending the clips.

Hailuo 3 accepted the still. The clown, the mechanic in overalls and a cap, the silver alien, and the leather-jacket werewolf stayed recognizable from the lot through the freeze. The werewolf still climbed out of the Trans Am. The vampire still came out of the bathroom.

Two misses stayed. The mechanic was stocky, not short. "Pale man" plus teased hair plus a cape was not a strong enough male lock. The model read the hair and the cape as a woman, and she drifted.

That is the cut to study if your cast is slipping. The reference still did more than another paragraph of adjectives. It did not finish the job.

## Cut three, lock the woman

We stopped trying to drag her back to a man. One woman, same face, every scene.

The line that has to travel with the lock:

> Vampire: an adult woman, unmistakably female in every shot. Same face throughout. Big teased 1980s hair, heavy 80s makeup with thick eyeliner, blush, and glossy lips. Black leather jacket, short form-fitting black leather skirt, black satin cape, visible fangs. Feminine figure. No masculine jaw, no male body.

Then we threw away the old lineup. An old reference will pull the last costume back. New still first. Then the three scenes, in order, against that still.

<blockquote class="twitter-tweet" data-media-max-width="560" data-dnt="true"><p lang="en" dir="ltr">V3 of making a campy 80’s “Hoor” clip is done using <a href="https://x.com/MiniMax_AI?ref_src=twsrc%5Etfw">@MiniMax_AI</a> H3 and this ones is best yet! <a href="https://t.co/jjYjrsp1aW">pic.twitter.com/jjYjrsp1aW</a></p>&mdash; Mike Gannotti 🔳 (@MichaelGannotti) <a href="https://x.com/MichaelGannotti/status/2109262199109943708?ref_src=twsrc%5Etfw">October 11, 2026</a></blockquote>

She held. Bathroom door, cape, jacket, short leather skirt, big hair, heavy liner, glossy mouth, fangs. She points at the lens in the close-up. She does not flip back to a man in the frames I checked.

The last group freeze still crops her out. That hold is the mechanic, the alien, and the werewolf. She is in the snack-war close-up just before it. If the poster shot is the freeze, she has to be staged in the wide, not only in the zoom.

The mechanic is still not short. Neon still invents junk type. I still have not proofed the spoken lines by ear. Picture continuity is not a dialogue edit.

## What to copy

1. Pick the model that can do the thing the short needs. For this one, speech beat speed. Max was the wrong slug because it does not generate audio.
2. Write one cast lock. Paste it unchanged into every clip. Do not trust the model to remember scene one.
3. Make one lineup still after the lock is final. If you change a costume, make the still again.
4. Pass that still as a reference image, not as a caption.
5. Generate in order. Stitch with a re-encode if the audio timestamps jump at the cuts. A stream copy can hiccup even when the codecs match.
6. Pull stills at the beats you care about before you call it done. A successful file is not a finished cast.
7. If a character flips, name the body you want in plain words. "Pale man" lost to the hair and the cape. "Adult woman, short leather skirt, heavy 80s makeup" held.

Nine talking clips, three batches, $17.55. Each batch was three 15-second 2K files at $1.95. The stitch on the shipped cuts is 45.25 seconds, 2560×1440, 24 fps, stereo.

The local style pass is still open. The LoRA wants ComfyUI and a local H3, which this cloud job cannot load. That is the next cut, not a claim about these three.

Follow [@MichaelGannotti](https://x.com/MichaelGannotti) if you want the cuts as he posts them.
