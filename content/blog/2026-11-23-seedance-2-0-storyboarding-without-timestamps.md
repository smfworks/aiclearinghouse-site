---
title: "Storyboarding for a Model That Can't Read Timestamps: Writing Multi-Shot Prompts for Seedance 2.0"
description: "Seedance 2.0 ignores precise timing and only reads shot order. Here is how to structure a multi-shot prompt the way its own prompt guide wants it: Shot N blocks, one camera move each, emotions as actions, and the 4–5 asset stack."
author: "Jasmine Naderi"
authorKey: jasmine
series: jasmine
categories:
  - "Jasmine's Workshop"
date: "2026-11-23T07:00:00-05:00"
canonicalUrl: https://www.smfclearinghouse.com/blog/2026-11-23-seedance-2-0-storyboarding-without-timestamps
image: /images/blog/2026-11-23-seedance-2-0-storyboarding-without-timestamps.svg
---

Most video models let you write like an editor: "at 0–3 seconds, push in; at 4 seconds, cut." Seedance 2.0 is not that model. BytePlus's own prompt guide says the quiet part plainly: "The model's support for precise timing (such as 0–3 seconds) is unstable, and forcibly limiting duration may lead to abnormal generation results." So you storyboard by shot number instead, and you order the details inside each shot the way the guide asks. Here is that structure, in one pass.

## Why shot order instead of timestamps

Seedance 2.0 is what the guide calls "essentially a multimodal AI director": it reads your text, images, video, and audio together, and splits them into a spatial layer (what's in frame) and a temporal layer (how things change). The temporal layer on the 2.0 series doesn't respond to timestamps — the Seedance 2.5 guide states the difference outright: "Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps."

So the timeline you write has to be event order, not clock time. The guide's recipe: write a simple "Shot 1 / Shot 2 / Shot 3" storyboard for each segment, ordered by when events happen — primary events first, secondary later — and let the model set the pacing. Don't put a duration on each shot.

## The four beats inside every shot

Each shot gets its details in a fixed order: camera move first, then subject actions and expressions, then position or spatial changes, then audio. The guide's own example shows the shape:

- **Shot 1:** Side shot of a street alley; the man slowly starts running, with a sense of rapid breathing.
- **Shot 2:** The man knocks over a fruit stand; the camera shakes quickly and gives a close-up of the man's frightened face.
- **Shot 3:** The man climbs over a low wall and disappears; the camera slowly pulls back and freezes on the empty street.

Notice the camera move sits at the front of each line — "side shot," "camera shakes quickly," "camera slowly pulls back." That's the pattern to copy.

One more rule from the camera section: one move per shot. "Try to specify only 1 type of camera movement in a single shot. Do not require push, pull, pan, and move at the same time, as this will increase image instability." If a shot needs two moves, it's two shots.

## Write emotions as actions

Abstract emotion words give the model nothing to render. The guide keeps a conversion table — sadness becomes "lowering the head, shoulders trembling slightly, eyes reddening"; anger becomes "both fists clenched, jawline tense, chest heaving violently." Write the physical detail, skip the adjective.

Same discipline for the actions themselves: name the body part, then quantify range, speed, and force. "Slowly raise a hand," "push hard off the ground," "slightly lower the head." The guide also prefers slow, continuous small movements over high-burst ones — sprints and big jumps are where image stability suffers.

## The symbols mean something

Four kinds of information get their own delimiters in the prompt:

| Information | Symbol | Example |
|---|---|---|
| Music | `()` | (fast-paced rock music is playing in the background) |
| Sound effect | `<>` | < dog barking can be heard in the distance > |
| Dialogue | `{}` | {Hello, world} |
| Subtitles | `[]` | [Chapter One: Departure] |

Dialogue language has to stay consistent — the guide says not to mix Chinese and English except for proper nouns, and to mark the language for anything that isn't Chinese or English.

## The asset stack: four roles, four to five files

Seedance 2.0 takes references alongside the prompt — on the 2.0 series that's 1–9 images, up to 3 videos (each 2–15 s, 15 s total), and 3 audio clips (2–15 s each, 15 MB each), with the whole request body capped at 64 MB. The guide sorts assets into four roles — character anchoring, scene tone, camera-movement reference, and rhythmic atmosphere — and recommends 4–5 total: 1–2 character images, 1 scene image, 1 camera-movement video, 1 audio clip. Don't max the limit; the guide warns that too many assets cause style conflicts and blurry subject identification.

For the character images specifically, the FAQ's fix for face drift is a pair, not one file: a close-up headshot with only the face (no expression, minimal shoulders and background) plus the full-body photo, referenced explicitly in the prompt — "Subject 1 facial features reference image 1 (headshot), makeup and styling reference image 2 (full-body photo)." And place the assets that need precise reference earliest in the prompt. One trap to skip: multi-view character sheets. The guide says the model reads the different angles as multiple people, which makes identity drift worse, not better.

## When it still goes wrong

Three failure modes the guide addresses directly, with its own fixes:

- **Unexpected subtitles.** You can't fully suppress them — the guide says so — only lower the odds. Add constraint lines like "Keep it subtitle-free," scrub any text off your reference assets before upload, and prefer landscape: portrait generates subtitles at a significantly higher rate, and you can crop to portrait afterward.
- **Face changes mid-video.** Usually a mixed reference image (face, pose, and outfit in one file) or a face that's too small in frame. Split into the headshot-plus-full-body pair above.
- **Jump cuts at extension joins.** Trim 6 frames off the tail of the outgoing clip and 1 frame off the head of the incoming one, at every join, in an editor. Then export and check the seam.

## The spec you're storyboard fits inside

The 2.0 series generates 4–15 second clips (integer seconds) at 24 fps, mp4, in six fixed aspect ratios: 21:9, 16:9, 4:3, 1:1, 3:4, 9:16. Resolution tops out at 1080p (8-bit) and 4K (10-bit) on the flagship `dreamina-seedance-2-0-260128`; fast and mini stop at 720p. Draft mode is not on the 2.0 series at all — that's a 2.5 feature.

One boundary worth knowing before you plan a shoot: the guide's portrait section notes that Seedance 2.0 series models don't support direct uploads of reference images or videos containing real human faces — ModelArk routes portrait work through trusted model outputs, a preset digital-character library, or authorized real-person assets instead. Plan character work around that from the start.

The whole method fits in one sentence: shots in event order, camera move first in each, one move per shot, emotions as visible actions, delimiters doing their jobs, and a lean reference stack with the face-critical assets up front. The model can't read your timeline — so write it the way a director calls a scene.
