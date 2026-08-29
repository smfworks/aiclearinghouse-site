/* ============================================================
   ash-temper-orrey / js/main.js
   Bootstrap, resize handling, main loop, wiring.
   ============================================================ */
(function () {
"use strict";
const A = window.ATO;

const app = { orrey: null };

function resize() {
  const c = app.orrey.canvas;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth, h = window.innerHeight;
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  c.style.width = w + "px";
  c.style.height = h + "px";
  app.orrey.resize(w, h, dpr);
}

app.orrey = new A.Orrey({
  pick: hit => A.UI.select(hit),          // null click = deselect
  event: (t, d) => A.UI.onEvent(t, d),
  toast: msg => A.UI.toast(msg)
});
A.UI.init(app);
resize();
window.addEventListener("resize", resize);

// Audio needs a user gesture; nudge it on any interaction.
const wake = () => A.AudioKit.ensure();
window.addEventListener("pointerdown", wake);
window.addEventListener("keydown", wake);

// Respect users who prefer less motion: start with time halted.
if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
  app.orrey.running = false;
  A.UI.syncPlay();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  app.orrey.update(dt);
  app.orrey.render();
  A.UI.update();
  if (!A.AudioKit.muted && Math.random() < 0.015) A.AudioKit.crackle(); // sparse ember pops
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
