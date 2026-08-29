/* ============================================================
   ash-temper-orrey / js/orrey.js
   Simulation + canvas rendering. No dependencies.
   Exposes window.ATO.{Orrey, STATIONS, WOODS, ...}
   ============================================================ */
(function () {
"use strict";

const TAU = Math.PI * 2;
const SECONDS_PER_DAY = 6;   // real seconds per shop day at 1×
const MAX_LOAD = 16;

const STATIONS = [
  { name: "Layout Bench",   numeral: "I",   period: 1.0, color: "#c9a85c", blurb: "Where timber becomes a plan, and plans become cut lists." },
  { name: "The Saw",        numeral: "II",  period: 1.6, color: "#c97e4a", blurb: "Rip, cross, repeat. Mind the fence." },
  { name: "Joinery Bench",  numeral: "III", period: 2.6, color: "#b08a52", blurb: "Mortise meets tenon. Hide glue and patience." },
  { name: "Assembly",       numeral: "IV",  period: 3.8, color: "#7a9484", blurb: "Clamps, cauls, and quiet optimism." },
  { name: "Finishing Room", numeral: "V",   period: 5.2, color: "#9a4a3c", blurb: "Oil, wax, dust-free air. No rushing allowed in here." }
];
const PHASES = [0.15, 0.55, 0.35, 0.80, 0.60]; // stagger starting positions

const WOODS = [
  { name: "Ash",    color: "#d9ccb2" },
  { name: "Oak",    color: "#b08a52" },
  { name: "Walnut", color: "#5d452e" },
  { name: "Cherry", color: "#9c4f2e" },
  { name: "Elm",    color: "#7a6a3d" }
];
const PIECES = ["Writing Desk", "Hall Chair", "Wall Cabinet", "Keepsake Box", "Garden Bench",
                "Cutting Board", "Bookcase", "Three-Legged Stool", "Side Table", "Lidded Bowl"];
const CLIENTS = ["M. Okafor", "R. Whitfield", "T. Nakamura", "A. Duval", "S. Herrera",
                 "J. Lindqvist", "P. Okonkwo", "E. Marsh", "C. Beaumont", "H. Aldridge"];

const shortestDelta = a => ((a % TAU) + TAU + Math.PI) % TAU - Math.PI;
const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const qbez = (p0, c, p1, t) => {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
           y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y };
};

class Orrey {
  constructor(cb) {
    this.cb = cb || {};
    this.canvas = document.getElementById("orrery");
    this.ctx = this.canvas.getContext("2d");
    this.speed = 1;
    this.running = true;
    this.selection = null;          // {kind:'station'|'commission', id}
    this.hover = null;
    this.w = 0; this.h = 0;
    this._hits = [];
    this._reset();
    this._bindPointer();
  }

  _reset() {
    this.shopTime = 0.4;
    this.stations = STATIONS.map((s, i) => {
      const phase = s.period * PHASES[i];
      return { phase, queue: [], wraps: Math.floor((this.shopTime - phase) / s.period), processed: 0 };
    });
    this.commissions = new Map();
    this.transfers = [];
    this.sparks = [];
    this.motes = [];
    for (let i = 0; i < 44; i++) this.motes.push({
      x: Math.random(), y: Math.random(),
      v: 0.004 + Math.random() * 0.012, dx: (Math.random() - 0.5) * 0.008,
      s: 0.6 + Math.random() * 1.3, a: 0.04 + Math.random() * 0.09
    });
    this.jobNo = 36;
    this.shipped = 0;
    this.nextArrival = 1.4;
  }

  resize(w, h, dpr) {
    this.w = w; this.h = h;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- geometry ---------- */
  _geom() {
    const m = Math.min(this.w, this.h);
    return { cx: this.w * 0.5, cy: this.h * 0.5, m,
             orbit: i => m * (0.145 + i * 0.070),
             pr: Math.max(9, m * 0.023) };
  }
  _angle(i) {
    const st = this.stations[i], per = STATIONS[i].period;
    const frac = (((this.shopTime - st.phase) / per) % 1 + 1) % 1;
    return -Math.PI / 2 + frac * TAU;   // cycles close exactly at the gnomon
  }
  _planetPos(i) {
    const g = this._geom(), r = g.orbit(i), a = this._angle(i);
    return { x: g.cx + Math.cos(a) * r, y: g.cy + Math.sin(a) * r };
  }

  /* ---------- simulation ---------- */
  spawnCommission() {
    if (this.commissions.size >= MAX_LOAD) {
      this.cb.toast("The bench is full — let something ship first.");
      return null;
    }
    this.jobNo += 1;
    const wood = WOODS[(Math.random() * WOODS.length) | 0];
    const c = {
      id: "c" + this.jobNo, no: this.jobNo,
      piece: PIECES[(Math.random() * PIECES.length) | 0],
      client: CLIENTS[(Math.random() * CLIENTS.length) | 0],
      wood: wood.name, woodColor: wood.color,
      station: 0, moonAngle: Math.random() * TAU, moonPop: 0,
      bornDay: this.shopTime, log: []
    };
    c.log.push({ day: this.shopTime, text: "Commissioned for " + c.client + " — queued at the Layout Bench." });
    this.commissions.set(c.id, c);
    this.transfers.push({
      cid: c.id, from: -1, to: 0, t: 0, dur: 1.15, seed: Math.random() * 2 - 1,
      fixedFrom: { x: -40, y: this.h * (0.15 + Math.random() * 0.55) }
    });
    this.cb.event("spawn", c);
    return c;
  }

  _onCycle(i) {
    const st = this.stations[i];
    this.cb.event("cycle", { i, empty: st.queue.length === 0 });
    if (!st.queue.length) return;
    const cid = st.queue.shift();
    const c = this.commissions.get(cid);
    st.processed += 1;
    if (i < 4) {
      c.log.push({ day: this.shopTime, text: "Done at " + STATIONS[i].name + ". Sent onward." });
      this.transfers.push({ cid, from: i, to: i + 1, t: 0, dur: 1.0, seed: Math.random() * 2 - 1 });
      this.cb.event("handoff", { c, from: i, to: i + 1 });
    } else {
      const p = this._planetPos(4);
      c.log.push({ day: this.shopTime, text: "Finished, waxed, and shipped. Onwards." });
      this.transfers.push({ cid, from: 4, to: -2, t: 0, dur: 1.25, seed: Math.random() * 2 - 1,
        fixedTo: { x: p.x + this.w * 0.28, y: p.y - this.h * 0.5 } });
      this.cb.event("handoff", { c, from: i, to: -2 });
    }
  }

  _arrive(tr) {
    const c = this.commissions.get(tr.cid);
    if (!c) return;
    if (tr.to >= 0) {
      c.station = tr.to;
      c.moonPop = 0;
      this.stations[tr.to].queue.push(c.id);
      c.log.push({ day: this.shopTime, text: "Arrived at " + STATIONS[tr.to].name + "." });
      this.cb.event("arrive", { c, to: tr.to });
    } else {                       // shipped off the bench
      this.commissions.delete(c.id);
      this.shipped += 1;
      if (this.selection && this.selection.kind === "commission" && this.selection.id === c.id) this.selection = null;
      this.cb.event("ship", c);
    }
  }

  etaDays(c) {
    let t = this.shopTime;
    let i = c.station, pos = this.stations[i].queue.indexOf(c.id);
    const tr = this.transfers.find(tr => tr.cid === c.id);
    if (tr && tr.to >= 0) { i = tr.to; pos = this.stations[i].queue.length; }
    else if (tr) return 0;         // already leaving the shop
    if (pos < 0) pos = 0;
    for (; i < 5; i++) {
      const st = this.stations[i], per = STATIONS[i].period;
      let k = st.wraps + 1 + pos;
      while (st.phase + k * per <= t) k += 1;
      t = st.phase + k * per;
      if (i < 4) pos = this.stations[i + 1].queue.length;
    }
    return Math.max(0, t - this.shopTime);
  }

  update(dt) {
    this._stepAmbient(dt);         // the forge breathes even when time is halted
    if (!this.running) return;
    const d = dt * this.speed / SECONDS_PER_DAY;
    this.shopTime += d;

    this.stations.forEach((st, i) => {
      const k = Math.floor((this.shopTime - st.phase) / STATIONS[i].period);
      if (k > st.wraps) { st.wraps = k; this._onCycle(i); }
    });

    this.nextArrival -= d;
    if (this.nextArrival <= 0) {
      this.nextArrival = 2.4 + Math.random() * 2.6;
      this.spawnCommission();
    }

    // moons drift toward their queue slot (slot 0 = next out)
    this.stations.forEach((st, i) => {
      const pa = this._angle(i);
      st.queue.forEach((cid, q) => {
        const c = this.commissions.get(cid);
        if (!c) return;
        const spread = TAU / Math.max(st.queue.length, 5);
        const target = q * spread + pa * 0.25 + Math.sin(this.shopTime * 1.6 + q * 2.1) * 0.06;
        c.moonAngle += shortestDelta(target - c.moonAngle) * Math.min(1, dt * 3.5);
        c.moonPop = Math.min(1, c.moonPop + dt * 3);
      });
    });

    for (let i = this.transfers.length - 1; i >= 0; i--) {
      const tr = this.transfers[i];
      tr.t += dt / tr.dur;
      if (tr.t >= 1) { this.transfers.splice(i, 1); this._arrive(tr); }
    }
  }

  _stepAmbient(dt) {
    for (const m of this.motes) {
      m.y -= m.v * dt; m.x += m.dx * dt;
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
      if (m.x < -0.02) m.x = 1.02; else if (m.x > 1.02) m.x = -0.02;
    }
    if (Math.random() < dt * 7) {
      this.sparks.push({ x: (Math.random() - 0.5) * 10, y: -2,
        vx: (Math.random() - 0.5) * 14, vy: -(18 + Math.random() * 26),
        life: 1, decay: 0.5 + Math.random() * 0.6 });
    }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= s.decay * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 6 * dt;
      if (s.life <= 0) this.sparks.splice(i, 1);
    }
    const n = performance.now();
    this.flick = 0.82 + 0.13 * Math.sin(n * 0.0016) + 0.05 * Math.sin(n * 0.0093);
  }

  /* ---------- rendering ---------- */
  _transferPts(tr) {
    const g = this._geom();
    const p0 = tr.fixedFrom || this._planetPos(tr.from);
    const p2 = tr.fixedTo || this._planetPos(tr.to);
    const mx = (p0.x + p2.x) / 2, my = (p0.y + p2.y) / 2;
    let dx = mx - g.cx, dy = my - g.cy;
    const dl = Math.hypot(dx, dy) || 1;
    dx /= dl; dy /= dl;
    const bow = g.m * 0.16 * (tr.seed || 0);
    return { p0, p2,
      cx: mx + dx * g.m * 0.10 - dy * bow,
      cy: my + dy * g.m * 0.10 + dx * bow };
  }

  _isSel(kind, id)  { return !!this.selection && this.selection.kind === kind && this.selection.id === id; }
  _isHover(kind, id){ return !!this.hover && this.hover.kind === kind && this.hover.id === id; }

  render() {
    const ctx = this.ctx, w = this.w, h = this.h, g = this._geom();
    const fl = this.flick || 1;
    this._hits = [];
    ctx.clearRect(0, 0, w, h);

    // drifting ash
    ctx.fillStyle = "#e8dcc6";
    for (const m of this.motes) {
      ctx.globalAlpha = m.a;
      ctx.fillRect(m.x * w, m.y * h, m.s, m.s);
    }
    ctx.globalAlpha = 1;

    // forge glow — the one light source in the room
    const gr = g.m * 0.17;
    const glow = ctx.createRadialGradient(g.cx, g.cy, 2, g.cx, g.cy, gr);
    glow.addColorStop(0, "rgba(224,122,52," + (0.34 * fl).toFixed(3) + ")");
    glow.addColorStop(0.55, "rgba(160,72,28," + (0.12 * fl).toFixed(3) + ")");
    glow.addColorStop(1, "rgba(160,72,28,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(g.cx - gr, g.cy - gr, gr * 2, gr * 2);

    // orbit rings
    ctx.setLineDash([2, 6]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(232,220,198,0.10)";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.orbit(i), 0, TAU); ctx.stroke();
    }
    ctx.setLineDash([]);

    // gnomon — today's meridian
    const gy0 = g.cy - g.m * 0.075, gy1 = g.cy - g.m * 0.452;
    ctx.strokeStyle = "rgba(194,161,95,0.5)";
    ctx.beginPath(); ctx.moveTo(g.cx, gy0); ctx.lineTo(g.cx, gy1); ctx.stroke();
    ctx.fillStyle = "rgba(194,161,95,0.85)";
    ctx.beginPath();
    ctx.moveTo(g.cx - 4, gy1); ctx.lineTo(g.cx + 4, gy1); ctx.lineTo(g.cx, gy1 - 6);
    ctx.closePath(); ctx.fill();
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(194,161,95,0.55)";
    ctx.fillText("T O D A Y", g.cx, gy1 - 11);

    // the forge
    const fr = g.m * 0.045;
    const core = ctx.createRadialGradient(g.cx - fr * 0.25, g.cy - fr * 0.3, 1, g.cx, g.cy, fr);
    core.addColorStop(0, "#f6c289");
    core.addColorStop(0.45, "#d4763b");
    core.addColorStop(1, "#4a2a18");
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(g.cx, g.cy, fr * (0.94 + 0.06 * fl), 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(232,220,198,0.18)";
    ctx.beginPath(); ctx.arc(g.cx, g.cy, fr + 5, 0, TAU); ctx.stroke();

    // sparks
    ctx.fillStyle = "#f0a35c";
    for (const s of this.sparks) {
      ctx.globalAlpha = Math.max(0, s.life) * 0.8;
      ctx.fillRect(g.cx + s.x, g.cy + s.y, 1.6, 1.6);
    }
    ctx.globalAlpha = 1;

    // planets
    ctx.textBaseline = "middle";
    for (let i = 0; i < 5; i++) {
      const st = this.stations[i], S = STATIONS[i];
      const p = this._planetPos(i);
      const frac = (((this.shopTime - st.phase) / S.period) % 1 + 1) % 1;
      ctx.strokeStyle = S.color;             // cycle arc, opens/closes at gnomon
      ctx.globalAlpha = 0.85; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, g.pr + 5, -Math.PI / 2, -Math.PI / 2 + frac * TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#1c1815";             // disc
      ctx.beginPath(); ctx.arc(p.x, p.y, g.pr, 0, TAU); ctx.fill();
      ctx.strokeStyle = S.color; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.fillStyle = S.color;
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillText(S.numeral, p.x, p.y + 0.5);
      if (this._isSel("station", i) || this._isHover("station", i)) {
        ctx.strokeStyle = "#c2a15f";
        ctx.globalAlpha = this._isSel("station", i) ? 0.95 : 0.45;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, g.pr + 8.5, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      this._hits.push({ x: p.x, y: p.y, r: g.pr + 6, kind: "station", id: i });
    }

    // moons — commissions in queue order around each planet
    for (let i = 0; i < 5; i++) {
      const st = this.stations[i], pp = this._planetPos(i), mr = g.pr + 14;
      st.queue.forEach((cid, q) => {
        const c = this.commissions.get(cid);
        if (!c) return;
        const a = c.moonAngle;
        const x = pp.x + Math.cos(a) * mr, y = pp.y + Math.sin(a) * mr;
        const r = 4.2 * (0.4 + 0.6 * c.moonPop);
        ctx.fillStyle = c.woodColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = q === 0 ? "rgba(194,161,95,0.95)" : "rgba(232,220,198,0.35)";
        ctx.stroke();
        const sel = this._isSel("commission", cid), hov = this._isHover("commission", cid);
        if (sel || hov) {
          ctx.strokeStyle = "#c2a15f";
          ctx.globalAlpha = sel ? 0.95 : 0.45;
          ctx.beginPath(); ctx.arc(x, y, r + 3.5, 0, TAU); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        if (sel) {                           // leader line + job number
          ctx.strokeStyle = "rgba(194,161,95,0.7)";
          ctx.beginPath();
          ctx.moveTo(x + r + 2, y - r - 2);
          ctx.lineTo(x + r + 12, y - r - 12);
          ctx.lineTo(x + r + 40, y - r - 12);
          ctx.stroke();
          ctx.fillStyle = "#e8dcc6";
          ctx.font = '9.5px "IBM Plex Mono", monospace';
          ctx.textAlign = "left";
          ctx.fillText("№ " + c.no, x + r + 14, y - r - 17);
          ctx.textAlign = "center";
        }
        this._hits.push({ x, y, r: r + 5, kind: "commission", id: cid });
      });
    }

    // transfers in flight — ember motes arcing between benches
    for (const tr of this.transfers) {
      const P = this._transferPts(tr);
      const k = easeInOut(Math.min(1, tr.t));
      const pos = qbez(P.p0, { x: P.cx, y: P.cy }, P.p2, k);
      if (!tr.trail) tr.trail = [];
      if (this.running) { tr.trail.push(pos); if (tr.trail.length > 12) tr.trail.shift(); }
      ctx.setLineDash([1, 5]);               // faint route hint
      ctx.strokeStyle = "rgba(212,118,59,0.22)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(P.p0.x, P.p0.y);
      ctx.quadraticCurveTo(P.cx, P.cy, P.p2.x, P.p2.y);
      ctx.stroke();
      ctx.setLineDash([]);
      tr.trail.forEach((pt, idx) => {
        ctx.globalAlpha = (idx / tr.trail.length) * 0.5;
        ctx.fillStyle = "#d4763b";
        ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
      });
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.shadowColor = "rgba(240,163,92,0.9)";
      ctx.shadowBlur = 9;
      ctx.fillStyle = "#f0a35c";
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 2.6, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- pointer ---------- */
  pick(x, y) {
    let best = null, bd = 1e9;
    for (const t of this._hits) {
      const d = Math.hypot(x - t.x, y - t.y);
      if (d <= t.r && d < bd) { bd = d; best = { kind: t.kind, id: t.id }; }
    }
    return best;
  }
  _bindPointer() {
    const cv = this.canvas;
    cv.addEventListener("mousemove", e => {
      this.hover = this.pick(e.clientX, e.clientY);
      cv.style.cursor = this.hover ? "pointer" : "default";
    });
    cv.addEventListener("mouseleave", () => { this.hover = null; });
    cv.addEventListener("click", e => this.cb.pick(this.pick(e.clientX, e.clientY)));
  }
}

window.ATO = { Orrey, STATIONS, WOODS, PIECES, CLIENTS, SECONDS_PER_DAY, TAU };
})();
