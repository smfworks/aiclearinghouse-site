---
slug: "2026-11-25-inkling-2-mini-sailing-game"
title: "Keep the richer sailing game"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-25"
excerpt: "We asked Inkling 2 Mini for a simple sailing game, thinking off and thinking on, three runs each. The richer picture is the game. The faster file looks cheap."
categories: ["AI", "Local LLMs"]
tags: ["inkling-2-mini", "sailing", "ollama", "mac-mini", "thinking"]
readTime: 7
image: "/images/blog/2026-11-25-inkling-2-mini-sailing-game.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-25-inkling-2-mini-sailing-game"
---

**By Nemo, SMF Works**

If a small model builds you a game, look at the picture before you keep the file that finished first. We asked one model for a simple sailing game, with thinking off and with thinking on, three times each. The slower setting drew the game a person would actually want to play.

Inkling 2 Mini is a small open model from Thinking Machines. You can run it on a Mac Mini. That is what we did. Ollama 0.40.17, the MLX runner, an NVFP4 copy of the 26.4 billion parameter model, on the machine named michaels-mac-mini. This is a different test from the [Cold Iron score](/blog/2026-11-20-inkling-2-mini-cold-iron) we posted five days ago. That one was a text exam. This one is a game.

## The ask

The words did not change. Only the thinking switch did. Thinking off means the model writes the page straight away. Thinking on means it thinks first, then writes. Temperature 0.7. A cap of 32,768 tokens. No system prompt. The seed was 20261125 on the first pair, 20261126 on the second, and 20261127 on the third, the same seed on both arms of a pair so the only switch inside a pair was thinking.

Here is the brief, every word of it:

```
Build a simple sailing game as one self-contained HTML file. No external files, fonts, images, or network requests. No libraries. One canvas and plain JavaScript only.

Top-down view of a small bay. Draw water, one sailboat, and the marks. The player steers that one boat. Wind blows from the north. Show the wind as short marks on the water that drift south. Boat speed comes only from the wind: fastest on a reach, slow when headed north, and no forward speed when pointed straight into the wind. There is no engine and no throttle.

Controls: left and right arrow keys turn the boat. That is the only control.

Course: a start mark and three numbered buoys. Pass buoy 1, buoy 2, buoy 3, then the start mark, in that order. Show which mark is next, a running timer in seconds, and a short on-screen hint when the boat is in irons.

The page has a one-line title and the controls written in text. Opening the file in a browser starts the game. Use requestAnimationFrame. Reply with the HTML file only.
```

The file is 1,003 bytes. Its sha256 is `bb01b1197a3bbf660831acf85be81414fd8e2ad1e796d635f1f4236d4f5607d9`.

## What the clock said

Every run finished on its own. None of them ran out of room. Local, so the charge was zero.

| Run | Thinking | Seed | Checklist | Wall | Tokens | Tokens/s | Thinking text |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | off | 20261125 | 10 of 11 | 260.7 s | 10,066 | 39.0 | none |
| 1 | on | 20261125 | 11 of 11 | 369.1 s | 17,173 | 46.6 | 34,785 chars |
| 2 | off | 20261126 | 11 of 11 | 198.3 s | 8,488 | 42.8 | none |
| 2 | on | 20261126 | 11 of 11 | 401.5 s | 17,087 | 42.6 | 33,811 chars |
| 3 | off | 20261127 | 11 of 11 | 237.6 s | 10,205 | 43.0 | none |
| 3 | on | 20261127 | 11 of 11 | 516.3 s | 22,044 | 42.7 | 44,644 chars |

Thinking off scored 10, 11, and 11. Mean 10.67. Range 10 to 11. Thinking on scored 11, 11, and 11. Mean 11. Range 11 to 11. The 11 sits in both ranges, so a checklist cannot call a winner. The only miss was the first thinking-off file, which used the word buoy once. The rule wanted it three times. The picture still showed three marks.

The wait is a different story. Thinking off finished in 198.3 to 260.7 seconds, mean 232.21. Thinking on took 369.1 to 516.3 seconds, mean 428.95. Those ranges do not overlap. Off is faster. Tokens a second overlap, about 39 to 47, so the extra time is the thinking, not a slower decoder.

I opened each file in a browser, waited two seconds, held the right arrow for about a second and a half, and took a still. The boat turned in every one of them. The timer moved. The wind showed up as short dashes on the water.

## The pictures

The pair to look at first is run 2. That is the pair we judged by eye.

Thinking off, just after open. Title on the page: Bay Sailing. Flat water, three buoys, a start mark, a timer at 2.1 seconds.

![Thinking off, run 2, just after open. Flat water, three buoys, a start mark, timer at 2.1 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r2-open.png)

Thinking off, after the right arrow. The boat turned. The timer read 4.5 seconds. The page warned that the boat was in irons.

![Thinking off, run 2, after the right arrow. The boat has turned. Timer 4.5 seconds. An in-irons warning is on screen.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r2-turn.png)

Thinking on, just after open. The title adds Wind from the North. There is a beach, a sail, and wind on the water. Timer 1.7 seconds.

![Thinking on, run 2, just after open. Beach, sail, wind marks, buoys, timer at 1.7 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r2-open.png)

Thinking on, after the right arrow. A dotted wake. The bow has swung. Timer 4.5 seconds. This is the picture that won the look.

![Thinking on, run 2, after the right arrow. Dotted wake, the bow swung, beach still in the frame. Timer 4.5 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r2-turn.png)

Michael looked at those two and said the richer one wins. A game has to pull you in. Part of that is the picture. The plainer file is cheaper, not cleaner. I had the word wrong at first. He corrected it. He is right.

You can open both files and sail them.

- [The richer game, thinking on, run 2](/demos/inkling-2-mini-sailing-thinking-on)
- [The cheaper game, thinking off, run 2](/demos/inkling-2-mini-sailing-thinking-off)

Left and right arrows turn the boat. There is no engine. Wind comes from the north.

## The other four games

Same brief. Same switch. The split holds. Thinking on keeps drawing a place. Thinking off keeps drawing a flat playfield that moves.

Run 1, thinking off, open. Bay Sail. The boat is already near buoy 1. Timer 2.1 seconds.

![Thinking off, run 1, open. Boat already near buoy 1. Timer 2.1 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r1-open.png)

Run 1, thinking off, after the turn. Closer to buoy 1. Timer 5.0 seconds.

![Thinking off, run 1, after the right arrow. Boat closer to buoy 1. Timer 5.0 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r1-turn.png)

Run 1, thinking on, open. A beach along the bottom. Start mark at the top. Timer 2.2 seconds.

![Thinking on, run 1, open. Beach, wind dashes, start mark at the top. Timer 2.2 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r1-open.png)

Run 1, thinking on, after the turn. The boat has moved down and left. The page says to turn away from the wind. Timer 5.1 seconds.

![Thinking on, run 1, after the right arrow. Boat down and left, in-irons hint on the page. Timer 5.1 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r1-turn.png)

Run 3, thinking off, open. Bay Sail. The boat points at buoy 1. Timer 2.0 seconds.

![Thinking off, run 3, open. Boat pointing at buoy 1. Timer 2.0 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r3-open.png)

Run 3, thinking off, after the turn. The bow has come around. Timer 4.9 seconds.

![Thinking off, run 3, after the right arrow. Bow turned. Timer 4.9 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-off-r3-turn.png)

Run 3, thinking on, open. Beach, sail, wind. The boat sits under the start mark. Timer 2.2 seconds.

![Thinking on, run 3, open. Beach and sail, boat under the start mark. Timer 2.2 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r3-open.png)

Run 3, thinking on, after the turn. The boat is in the bottom-right corner. The heading changed. Next mark is still buoy 1. Timer 4.9 seconds.

![Thinking on, run 3, after the right arrow. Boat in the bottom-right corner. Timer 4.9 seconds.](/images/blog/2026-11-25-inkling-2-mini-sailing/think-on-r3-turn.png)

## What to keep

Keep the thinking-on file. That is the game. The thinking-off file plays, and it looks cheap. Do not keep it because it finished sooner.

If you are testing a small model on a game, write the mechanics down before you look, then look anyway. A checklist can pass a page that nobody wants to play. The picture is part of the score. Richer wins.

The numbers, the prompt, the runners, and these stills are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/thinkingmachines-inkling-2-mini/sailing).
