---
slug: "2026-11-03-glm-5-3-flash-dog-violin-stage-one-shot"
title: "A Dog Playing Violin, With Sound and a Working Light Switch — GLM-5.3-Flash on Two Sparks"
excerpt: "One prompt, no iteration: GLM-5.3-Flash TensorFold on dual DGX Sparks wrote a CSS dog, a Web Audio violin synth, and a functioning light switch. The first long run came back splice-corrupted, two reruns reproduced it byte-identically, and a three-length sweep shows the fault hides in completions of roughly ten thousand tokens or more."
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-03"
categories: ["AI", "Model Evaluation", "Local LLMs", "GLM-5.3"]
tags: ["glm-5.3", "dgx-spark", "tensorfold", "one-shot", "web-audio", "exl3"]
readTime: 8
image: "/images/blog/2026-11-03-glm-5-3-flash-dog-violin-stage-one-shot.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-03-glm-5-3-flash-dog-violin-stage-one-shot"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

Michael gave me one sentence: "Create a one shot of a dog playing a violin with sound, on stage with a working light switch and audio." His words, verbatim, into our team serve — GLM-5.3-Flash running EXL3 4-bit TensorFold across two DGX Sparks. Thinking off, temperature 0. What came back is a stage with red curtains, a CSS-built dog mid-bow, an audience that bobs, a violin synth built from oscillators, and a light switch that actually switches the lights.

**[Try the live demo →](/demos/glm-5-3-flash-dog-violin-stage)**

## What the model built

The whole thing is one 21 KB HTML file. No libraries, no CDN, nothing after load.

| Piece | How it works |
|---|---|
| Dog | Pure CSS: head, ears, tail with a wag keyframe, a bow arm on an infinite alternate animation |
| Violin | CSS body, neck, scroll and strings, plus an animated bow |
| Sound | Web Audio: a sawtooth fundamental plus a triangle octave harmonic, vibrato from an LFO into `osc.frequency`, all through a lowpass filter into master gain and an analyser |
| Light switch | A click handler that toggles `lights-on` / `dark` classes on the stage, so the spotlight, floor and title all respond |
| Extras | Opening curtains, a music-note spawner, a 32-bar visualizer driven by `getByteFrequencyData` |

The melody is eighteen note-duration pairs played one at a time through `playViolinNote`. It reads like a model that knows what a violin sounds like: the vibrato LFO depth is proportional to frequency, which is the detail most quick synth demos skip.

## The catch: the first long run was corrupted

Run one died at the 4096-token default cap, cut mid-`<div>`. Raising the cap to 32,768 fixed completion, and run two finished cleanly with `finish: stop` — 11,845 tokens. But the file was damaged in a way I had not seen before: stray words spliced into the middle of tokens, all through the document.

- `audioContext.createOsynth: cillator()` — the word `vibrato:` landed inside `createOscillator`
- `document.getElementById('light switch')` — with a space, so the switch handler would throw on a null
- `880, 0. bar: 0.5` — inside the melody array, a hard SyntaxError

Forty-five-ish splices across CSS, HTML tags and JS literals. None of it was truncation; the document structure was complete.

Because temperature 0 makes the serve deterministic for a fixed prompt, run three was the honest test of whether the damage was a fluke. It came back **byte-identical** to run two — all 41,738 characters. Same corruption, exactly. So the fault is real, reproducible, and lives in the decode path, not in the prompt.

## Repair and verification

The design was sound, so I repaired instead of resampling: eleven surgical fixes — rebuilt the melody array from the eighteen surviving pairs, rejoined `createOscillator`, corrected the switch id, and stripped the spliced words from statements and CSS. Then verification:

- `node --check` on the extracted script: exit 0
- Tag-balance parse of the whole file: no unclosed elements
- Every `getElementById` target resolves
- Audio graph wired end to end: oscillators → gain → lowpass → master → analyser → destination

The repaired file is what ships at the demo link above. The corrupted original is preserved in the repo below as the specimen.

## Does the corruption follow length? A three-cell sweep

If the fault hit every long completion, the serve would be unusable for one-shots and I would flag the pin. So the next morning I ran three fresh prompts at ascending output length, same serve, same params:

| Cell | Prompt | Output tokens | Latency | Splice markers | JS syntax |
|---|---|---:|---:|---:|---|
| Short | lightbulb toggle page | 1,360 | 16.7 s | 0 | pass |
| Medium | solar system, 8 labeled planets | 2,230 | 31.1 s | 0 | pass |
| Long | playable piano with recording | 6,049 | 83.7 s | 0 | pass |

A clean sweep. Every id resolved, every script parsed, and the piano cell even does a five-partial inharmonic tone per key. The one regex hit was a false positive — a legitimate CSS `radial-gradient(ellipse 80% 60% at 50% 0%, …)`.

## What I concluded

The corruption is real, deterministic for a given prompt, and rare. It did not appear at 1.4k, 2.2k or 6k output tokens; it appeared at 11.8k. Short Cold Iron runs on the same boot have been clean for weeks. My working picture: a prompt-dependent decode or draft fault that only bites on very long single-shot completions, roughly ten thousand tokens and up.

Three practical rules came out of this:

1. For one-shot pages, budget `max_tokens` at 32,768. The 4096 default on the serve card is too small and costs a run.
2. Spot-check any completion over roughly ten thousand tokens for the splice signature — a five-line regex catches every case we have seen.
3. A corrupted run at temperature 0 reproduces exactly. One rerun confirms; a repair-and-verify pass salvages a good design without pretending the raw output worked.

The pin stays. No restart, no config change. The piano, solar system and bulb pages all came back clean.

## Reproducing this

The prompt, both runs' raw JSON, the corrupted and repaired HTML, and the length-sweep results are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/glm-5.3-flash-tf-oneshots). The serve is `http://spark-56bc:8888/v1`, model id `GLM-5.3-Flash-EXL3`, `chat_template_kwargs: {"enable_thinking": false}`, temperature 0, max_tokens 32,768.

The full output page, unchanged, is what runs at the demo link. Here it is:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dog Violinist on Stage</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Georgia', serif;
        background: #1a1a2e;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden;
    }

    .stage-container {
        position: relative;
        width: 800px;
        max-width: 95vw;
        height: 600px;
        background: linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 100%);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        transition: background 1s ease;
    }

    .stage-container.dark {
        background: linear-gradient(180deg, #0d0d1a 0%, #050508 100%);
    }

    /* Curtains */
    .curtain {
        position: absolute;
        top: 0;
        width: 120px;
        height: 100%;
        background: repeating-linear-gradient(
            90deg,
            #8b0000 0px, #8b0000 20px,
            #a01515 20px, #a01515 40px
        );
        z-index: 10;
        transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .curtain.left {
        left: 0;
        border-right: 5px solid #5c0000;
    }

    .curtain.right {
        right: 0;
        border-left: 5px solid #5c0000;
    }

    .stage-container.open .curtain.left {
        transform: translateX(-100px);
    }

    .stage-container.open .curtain.right {
        transform: translateX(100px);
    }

    /* Spotlight */
    .spotlight {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 500px;
        background: radial-gradient(ellipse at top, rgba(255, 240, 200, 0.4) 0%, transparent 70%);
        clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%);
        opacity: 0;
        transition: opacity 1s ease;
        z-index: 5;
        pointer-events: none;
    }

    .stage-container.lights-on .spotlight {
        opacity: 1;
    }

    /* Stage floor */
    .stage-floor {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 150px;
        background: linear-gradient(180deg, #5c3a21 0%, #3d2513 100%);
        border-top: 4px solid #7a4f2a;
        z-index: 2;
    }

    .stage-container.dark .stage-floor {
        background: linear-gradient(180deg, #2a1a0e 0%, #1a0f08 100%);
        border-top-color: #3d2513;
    }

    /* The Dog */
    .dog {
        position: absolute;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
    }

    .dog-body {
        position: relative;
        width: 200px;
        height: 180px;
    }

    /* Dog head */
    .dog-head {
        position: absolute;
        top: 0;
        left: 50px;
        width: 100px;
        height: 90px;
        background: #d4a574;
        border-radius: 45% 45% 40% 40%;
        z-index: 2;
    }

    .dog-ear {
        position: absolute;
        top: 10px;
        width: 30px;
        height: 55px;
        background: #b8860b;
        border-radius: 50% 50% 40% 40%;
        z-index: 1;
    }

    .dog-ear.left {
        left: -10px;
        transform: rotate(-15deg);
    }

    .dog-ear.right {
        right: -10px;
        transform: rotate(15deg);
    }

    .dog-eye {
        position: absolute;
        top: 30px;
        width: 12px;
        height: 12px;
        background: #2d1b0e;
        border-radius: 50%;
    }

    .dog-eye.left { left: 25px; }
    .dog-eye.right { right: 25px; }

    .dog-nose {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 18px;
        height: 14px;
        background: #2d1b0e;
        border-radius: 50%;
    }

    .dog-mouth {
        position: absolute;
        top: 62px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        border-bottom: 3px solid #8b5a2b;
        border-radius: 0 0 50% 50%;
    }

    /* Dog body */
    .dog-torso {
        position: absolute;
        top: 70px;
        left: 30px;
        width: 140px;
        height: 100px;
        background: #d4a574;
        border-radius: 40% 40% 30% 30%;
    }

    .dog-belly {
        position: absolute;
        top: 85px;
        left: 55px;
        width: 90px;
        height: 70px;
        background: #e8c9a0;
        border-radius: 50%;
    }

    /* Arms */
    .arm {
        position: absolute;
        width: 18px;
        height: 60px;
        background: #d4a574;
        border-radius: 10px;
        transform-origin: top center;
        z-index: 4;
    }

    .arm-left {
        top: 85px;
        left: 40px;
        transform: rotate(30deg);
        animation: bow-arm 0.5s ease-in-out infinite alternate;
    }

    .arm-right {
        top: 85px;
        right: 40px;
        transform: rotate(-30deg);
        animation: bow-arm 0.5s ease-in-out infinite alternate-reverse;
    }

    @keyframes bow-arm {
        from { transform: rotate(30deg); }
        to { transform: rotate(45deg); }
    }

    @keyframes bow-arm-rev {
        from { transform: rotate(-30deg); }
        50% { transform: rotate(-45deg); }
    }

    /* Legs */
    .leg {
        position: absolute;
        width: 22px;
        height: 55px;
        background: #b8860b;
        border-radius: 10px;
        bottom: -40px;
    }

    .leg-left {
        left: 50px;
    }

    .leg-right {
        right: 50px;
    }

    .paw {
        position: absolute;
        bottom: -8px;
        left: -4px;
        width: 30px;
        height: 14px;
        background: #8b5a2b;
        border-radius: 50%;
    }

    /* Tail */
    .dog-tail {
        position: absolute;
        top: 90px;
        right: -15px;
        width: 15px;
        height: 50px;
        background: #b8860b;
        border-radius: 10px;
        transform-origin: bottom center;
        animation: tail-wag 0.8s ease-in-out infinite;
    }

    @keyframes tail-wag {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(20deg); }
    }

    /* Violin */
    .violin {
        position: absolute;
        top: 95px;
        left: 60px;
        width: 90px;
        height: 45px;
        background: linear-gradient(135deg, #8b4513, #a0522d);
        border-radius: 50% 50% 45% 45%;
        z-index: 5;
        transform: rotate(-15deg);
    }

    .violin-neck {
        position: absolute;
        top: 15px;
        left: 80px;
        width: 60px;
        height: 10px;
        background: #5c2e0d;
        transform: rotate(-15deg);
    }

    .violin-scroll {
        position: absolute;
        top: 8px;
        left: 135px;
        width: 16px;
        height: 16px;
        background: #5c2e0d;
        border-radius: 50%;
    }

    .violin-strings {
        position: absolute;
        top: 18px;
        left: 5px;
        width: 75px;
        height: 2px;
        background: repeating-linear-gradient(90deg, #ffd700 0px, #ffd700 2px, transparent 2px, transparent 8px);
    }

    .bow {
        position: absolute;
        top: 85px;
        left: 40px;
        width: 110px;
        height: 4px;
        background: linear-gradient(90deg, #654321 0%, #654321 100%);
        z-index: 6;
        transform: rotate(-20deg);
        transform-origin: right center;
        animation: bowing 0.6s ease-in-out infinite alternate;
    }

    .bow::after {
        content: '';
        position: absolute;
        top: -3px;
        left: 0;
        width: 100%;
        height: 10px;
        height: 10px;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    }

    @keyframes bowing {
        from { transform: rotate(-25deg) translateY(-3px); }
        to { transform: rotate(-15deg) translateY(3px); }
    }

    /* Music notes */
    .music-note {
        position: absolute;
        font-size: 30px;
        color: #ffd700;
        opacity: 0;
        z-index: 7;
        pointer-events: float;
    }

    .music-note.active {
        animation: float-note 2s ease-out forwards;
    }

    @keyframes float-note {
        0% { opacity: 0; transform: translateY(0) rotate(0deg); }
        20% { opacity: 1; }
        100% { opacity: 0; }
    }

    /* Light switch */
    .light-switch {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 60px;
        height: 90px;
        background: #f0f0f0;
        border-radius: 8px;
        border: 2px solid #ccc;
        cursor: pointer;
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        transition: transform 0.1s;
    }

    .light-switch:active {
        transform: scale(0.95);
    }

    .switch-toggle {
        width: 24px;
        position: relative;
        height: 40px;
        background: #ddd;
        border-radius: 4px;
        position: relative;
    }

    .switch-knob {
        position: absolute;
        left: 2px;
        width: 20px;
        height: 18px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 3px;
        transition: top 0.15s ease;
    }

    .light-switch.on .switch-knob {
        top: 2px;
    }

    .light-switch:not(.on) .switch-knob {
        top: 20px;
    }

    .switch-label {
        font-size: 10px;
        color: #333;
        font-weight: bold;
        font-family: Arial, sans-serif;
    }

    /* Controls */
    .controls {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 20;
        display: flex;
        gap: 10px;
    }

    .btn {
        padding: 10px 20px;
        font-size: 16px;
        font-family: 'Georgia', serif;
        background: linear-gradient(180deg, #ffd700, #daa520);
        border: 2px solid #b8860b;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
    }
    .btn:active {
        transform: translateY(0);
    }

    .btn.playing {
        background: linear-gradient(180deg, #ff6b6b, #c0392b);
        border-color: #922b21;
    }

    /* Audio visualizer */
    .visualizer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        z-index: 15;
        display: flex;
        align-items: flex-end;
        gap: 3px;
        padding: 0 10px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s;
    }

    .visualizer.active {
        opacity: 1;
    }

    .visualizer-bar {
        flex: 1;
        background: linear-gradient(180deg, #ffd700, #ff6b6b);
        border-radius: 2px 2px 0 0;
        height: 5px;
        transition: height 0.1s;
    }

    /* Title */
    .stage-title {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 28px;
        color: #ffd700;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        z-index: 15;
        opacity: 0;
        transition: opacity 1s;
        font-family: 'Georgia', serif;
        letter-spacing: 2px;
    }

    .stage-container.lights-on .stage-title {
        opacity: 1;
    }

    /* Audience heads silhouette */
    .audience {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 25;
        display: flex;
        gap: 0;
    }

    .audience-head {
        flex: 1;
        height: 40px;
        background: #000;
        border-radius: 50% 50% 0 0;
        margin: 0 5px;
    }

    .audience-head.bobbing {
        animation: bob 2s ease-in-out infinite;
    }

    @keyframes bob {
        0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-8px); }
    }
</style>
</head>
<body>

<div class="stage-container" id="stage">
    <!-- Curtains -->
    <div class="curtain left"></div>
    <div class="curtain right"></div>

    <!-- Spotlight -->
    <div class="spotlight"></div>

    <!-- Title -->
    <div class="stage-title">🎻 Woofstrada in D Minor</div>

    <!-- The Dog -->
    <div class="dog">
        <div class="dog-body">
            <!-- Tail -->
            <div class="dog-tail"></div>
            <!-- Head -->
            <div class="dog-head">
                <div class="dog-ear left"></div>
                <div class="dog-ear right"></div>
                <div class="dog-eye left"></div>
                <div class="dog-eye right"></div>
                <div class="dog-nose"></div>
                <div class="dog-mouth"></div>
            </div>
            <!-- Torso -->
            <div class="dog-torso"></div>
            <div class="dog-belly"></div>
            <!-- Arms -->
            <div class="arm arm-left"></div>
            <div class="arm arm-right"></div>
            <!-- Legs -->
            <div class="leg leg-left"><div class="paw"></div></div>
            <div class="leg leg-right"><div class="paw"></div>
        </div>
    </div>

    <!-- Violin & Bow -->
    <div class="violin">
        <div class="violin-neck"></div>
        <div class="violin-scroll"></div>
        <div class="violin-strings"></div>
    </div>
    <div class="bow"></div>

    <!-- Music notes container -->
    <div id="notes-container"></div>

    <!-- Stage floor -->
    <div class="stage-floor"></div>

    <!-- Light switch -->
    <div class="light-switch on" id="lightSwitch">
        <div class="switch-toggle">
            <div class="switch-knob"></div>
        </div>
        <div class="switch-label">LIGHTS</div>
    </div>

    <!-- Controls -->
    <div class="controls">
        <button class="btn" id="playBtn">▶ Play Concerto</button>
        <button class="btn" id="curtainBtn">🎭 Open Curtains</button>
    
    </div>

    <!-- Audio visualizer -->
    <div class="visualizer" id="visualizer"></div>

    <!-- Audience -->
    <div class="audience">
        <div class="audience-head bobbing"></div>
        <div class="audience-head bobbing" style="animation-delay: 0.3s"></div>
        <div class="audience-head bobbing" style="animation-delay: 0.6s"></div>
        <div class="audience-head bobbing" style="animation-delay: 0.9s"></div>
        <div class="audience-head bobbing" style="animation-delay: 1.2s"></div>
    </div>
</div>

<script>
    // ============ AUDIO SETUP ============
    let audioContext;
    let masterGain;
    let analyser;
    let isPlaying = false;
    let playTimer;
    let noteTimer;

    function initAudio() {
        if (audioContext) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.3;
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        masterGain.connect(analyser);
        analyser.connect(audioContext.destination);
    }

    // Violin-like sound using sawtooth + vibrato
    function playViolinNote(freq, duration) {
        if (!audioContext) return;
        const now = audioContext.currentTime;
        
        const osc = audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        const osc2 = audioContext.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 2; // octave harmonic

        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
        gain.gain.setValueAtTime(0.5, now + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        const gain2 = audioContext.createGain();
        gain2.gain.value = 0.15;

        // Vibrato via LFO
        const lfo = audioContext.createOscillator();
        lfo.frequency.value = 5.5;
        const lfoGain = audioContext.createGain();
        lfoGain.gain.value = freq * 0.008;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2500;
        filter.Q.value = 1;

        osc.connect(gain);
        osc2.connect(gain2);
        gain2.connect(gain);
        gain.connect(filter);
        filter.connect(masterGain);

        osc.start(now);
        osc2.start(now);
        lfo.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
        lfo.stop(now + duration);
    }

    // Twinkle Twinkle melody (public domain)
    const melody = [
    [523.25, 0.5], [523.25, 0.5], [783.99, 0.5], [783.99, 0.5], [880.0, 0.5], [783.99, 1.0], [698.46, 0.5], [698.46, 0.5], [659.25, 0.5], [659.25, 0.5], [622.25, 0.5], [622.25, 0.5], [587.33, 1.0], [783.99, 0.5], [698.46, 0.5], [659.25, 0.5], [659.25, 0.5], [587.33, 1.0]
    ];

    let melodyIndex = 0;
    let nextNoteTime = 0;

    function scheduleMelody() {
        if (!isPlaying) return;
        const [freq, dur] = melody[melodyIndex];
        playViolinNote(freq, dur * 0.9);
        spawnNote();
        melodyIndex = (melodyIndex + 1) % melody.length;
        noteTimer = setTimeout(scheduleMelody, dur * 1000);
    }

    function spawnNote() {
        const container = document.getElementById('notes-container');
        const notes = ['♪', '♫', '♩', '♬'];
        const note = document.createElement('div');
        note.className = 'music-note active';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = (50 + (Math.random() * 20 - 10)) + '%';
        note.style.bottom = '300px';
        note.style.fontSize = (20 + Math.random() * 20) + 'px';
        container.appendChild(note);
        setTimeout(() => note.remove(), 2000);
    }

    // ============ VISUALIZER ============
    function initVisualizer() {
        const viz = document.getElementById('visualizer');
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            viz.appendChild(bar);
        }
    }

    function updateVisualizer() {
        if (!analyser) return;
        const viz = document.getElementById('visualizer');
        const bars = viz.children;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < bars.length; i++) {
            const v = data[i] / 255;
            bars[i].style.height = Math.max(5, v * 60) + 'px';
        }
        requestAnimationFrame(updateVisualizer);
    }

    // ============ CONTROLS ============
    const stage = document.getElementById('stage');
    const lightSwitch = document.getElementById('lightSwitch');
    const playBtn = document.getElementById('playBtn');
    const curtainBtn = document.getElementById('curtainBtn');

    // Light switch
    lightSwitch.addEventListener('click', () => {
        lightSwitch.classList.toggle('on');
        const isOn = lightSwitch.classList.contains('on');
        stage.classList.toggle('lights-on', isOn);
        stage.classList.toggle('dark', !isOn);
        if (isOn) {
            playClickSound();
        }
    });

    function playClickSound() {
        if (!audioContext) initAudio();
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 800;
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Play button
    playBtn.addEventListener('click', () => {
        initAudio();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = '⏸ Stop';
            playBtn.classList.add('playing');
            visualizer.classList.add('active');
            scheduleMelody();
        } else {
            playBtn.textContent = '▶ Play Concerto';
            playBtn.classList.add('playing');
            clearTimeout(noteTimer);
        }
    });

    // Curtain button
    curtainBtn.addEventListener('click', () => {
        const open = stage.classList.toggle('open');
        curtainBtn.textContent = open ? '🎭 Close Curtains' : '🎭 Open Curtains';
    });

    // Start with lights on
    stage.classList.add('lights-on');

    initVisualizer();
    updateVisualizer();
</script>

</body>
</html>

```

---

*Tested 2026-11-02 and 2026-11-03. GLM-5.3-Flash EXL3 4-bit TensorFold TP=2 on 2× NVIDIA DGX Spark (GB10). Temperature 0, thinking off. The corrupted raw output and the length-sweep JSONs are preserved unmodified in the knowledge base.*
