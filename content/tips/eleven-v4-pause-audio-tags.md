---
slug: eleven-v4-pause-audio-tags
title: "Put pauses in Eleven v4 with audio tags, not SSML"
category: Voice
excerpt: "Eleven v4 does not take SSML break tags. The October 2, 2026 ElevenLabs post says to write [pause] or [long pause] in the script, and to use punctuation when you want rhythm without a tag."
tags:
  - elevenlabs
  - voice
  - tts
  - audio-tags
order: 99
last_verified: "2026-10-07"
---

# Put pauses in Eleven v4 with audio tags, not SSML

## The change

If a voice agent script still has an SSML `<break>` tag, Eleven v4 will not honor it the way Multilingual v2 did.

ElevenLabs published the note on October 2, 2026. Jack Limebear wrote it. The page says it was last updated October 3, 2026. Earlier models, including Multilingual v2, took SSML, including a timed pause. Eleven v4 keeps the Eleven v3 approach: Audio Tags in plain language. You write `[pause]` or `[long pause]` in the script. The post also names `[whispers]` as the same kind of stage direction, but the pause tags are the ones that replace the break tag.

The length is not a number you set. The post says the model fits the pause to the moment instead of inserting a fixed silence. If you need a 2.0 second gap every time, this tag is the wrong tool. The post does not give you a milliseconds parameter.

## Three controls, from that post

1. `[pause]` for a short beat, about a breath, after a setup line.
2. `[long pause]` when the gap should be longer than that beat. The fetched page names the tag. It does not publish a duration.
3. Punctuation. Dashes, ellipses, and short sentences change rhythm without a tag.

SSML does not work in Eleven v4. That is the post's own summary line.

Place the tag where a speaker would actually stop. On a long script, keep the same pause convention all the way through. The post says that consistency is what keeps regenerations from drifting. Eleven v4's regeneration note on the same page is about retaking a line, not about locking a pause to a clock time.

## What to do next

Open one production script and search for `break time=` or `<break`. Replace the timed tag with `[pause]` or `[long pause]`, then listen. If the gap is wrong, move the tag or change the punctuation. Do not add a second SSML dialect and hope the model averages them.

## Source

- https://elevenlabs.io/blog/how-to-add-pauses-in-ai-voiceover
