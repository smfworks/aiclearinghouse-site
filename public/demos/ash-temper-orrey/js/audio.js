/* ============================================================
   ash-temper-orrey / js/audio.js
   Tiny WebAudio synth — no assets, everything is generated.
   Must be woken by a user gesture (browsers block autoplay).
   ============================================================ */
(function () {
"use strict";

const AudioKit = {
  ctx: null, master: null, muted: false, _lastTick: 0,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  },

  _tone(freq, dur, type, vol, when) {
    if (!this.ctx || this.muted) return;
    const t = when || this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
  },

  _noise(dur, f0, f1, vol, q) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = q || 1.2;
    bp.frequency.setValueAtTime(f0, t);
    bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur);
  },

  /* pitched woodblock per station — the shop's clock */
  tick(i) {
    const now = performance.now();
    if (now - this._lastTick < 90) return;
    this._lastTick = now;
    const f = [740, 622, 523, 466, 392][i] || 523;
    this._tone(f, 0.09, "triangle", 0.16);
    this._tone(f * 2.7, 0.04, "sine", 0.05);
    this._noise(0.03, 1800, 900, 0.05, 2);
  },
  handoff() { this._noise(0.28, 500, 2400, 0.06, 1.4); },
  ship() {
    const t = this.ctx ? this.ctx.currentTime : 0;
    this._tone(523, 0.5, "sine", 0.10);
    this._tone(784, 0.7, "sine", 0.08, t + 0.09);
    this._tone(1046, 0.9, "sine", 0.04, t + 0.18);
  },
  arrive() { this._tone(140, 0.16, "sine", 0.12); this._noise(0.05, 300, 150, 0.04, 1); },
  click()  { this._tone(1600, 0.03, "sine", 0.04); },
  crackle() {
    if (Math.random() < 0.5) return;
    this._noise(0.02 + Math.random() * 0.03, 2500 + Math.random() * 2000, 1200,
                0.015 + Math.random() * 0.02, 3);
  },
  toggle() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
    return this.muted;
  }
};

window.ATO.AudioKit = AudioKit;
})();
