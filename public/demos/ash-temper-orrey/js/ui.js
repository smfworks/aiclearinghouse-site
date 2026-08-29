/* ============================================================
   ash-temper-orrey / js/ui.js
   DOM layer: ledger, detail panel, transport, help, toasts, keys.
   ============================================================ */
(function () {
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ICONS = {
  play:  '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3h2v10H5zM9 3h2v10H9z" fill="currentColor"/></svg>',
  sndOn: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2.5 6v4h2.8L9 13V3L5.3 6z" fill="currentColor"/><path d="M11 5.5a3.4 3.4 0 010 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  sndOff:'<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2.5 6v4h2.8L9 13V3L5.3 6z" fill="currentColor"/><path d="M11 6l3.5 4M14.5 6L11 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  plus:  '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  close: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

let app = null, els = {}, rows = [], toastTimer = null, lastDetail = 0;

const UI = {
  init(a) {
    app = a;
    els = {
      ledgerList: $("#station-list"), ledgerDay: $("#ledger-day"), shipped: $("#shipped-ct"),
      ticker: $("#ticker"), detail: $("#detail"), dayBig: $("#day-big"),
      btnPlay: $("#btn-play"), btnMute: $("#btn-mute"), btnNew: $("#btn-new"),
      speed: document.querySelectorAll(".speed-btn"),
      help: $("#help"), toast: $("#toast")
    };
    this.buildLedger();
    this.bindTransport();
    this.bindKeys();
    this.syncPlay();
    this.syncMute();
    els.btnNew.innerHTML = ICONS.plus + "<span>New commission</span>";
    document.querySelectorAll(".js-close").forEach(b => { b.innerHTML = ICONS.close; });
  },

  buildLedger() {
    rows = [];
    els.ledgerList.innerHTML = "";
    window.ATO.STATIONS.forEach((S, i) => {
      const li = document.createElement("li");
      li.innerHTML = '<span class="num">' + S.numeral + '</span>' +
        '<span class="nm">' + S.name + '</span>' +
        '<span class="ct">0 pcs</span><span class="nx">idle</span>';
      li.addEventListener("click", () => this.select({ kind: "station", id: i }));
      els.ledgerList.appendChild(li);
      rows.push({ li, ct: li.querySelector(".ct"), nx: li.querySelector(".nx"), lastCt: "", lastNx: "" });
    });
  },

  /* per-frame DOM updates, guarded so nothing is written needlessly */
  update() {
    const o = app.orrey, A = window.ATO;
    const day = Math.floor(o.shopTime) + 1;
    const dd = "DAY " + String(day).padStart(2, "0");
    if (els.dayBig.textContent !== dd) els.dayBig.textContent = dd;
    const ld = "Day " + day;
    if (els.ledgerDay.textContent !== ld) els.ledgerDay.textContent = ld;

    o.stations.forEach((st, i) => {
      const n = st.queue.length;
      const nx = n ? ((st.phase + (st.wraps + 1) * A.STATIONS[i].period) - o.shopTime).toFixed(1) + "d" : "idle";
      const ct = n + (n === 1 ? " pc" : " pcs");
      if (rows[i].lastCt !== ct) { rows[i].lastCt = ct; rows[i].ct.textContent = ct; }
      if (rows[i].lastNx !== nx) { rows[i].lastNx = nx; rows[i].nx.textContent = n ? "out " + nx : "idle"; }
      rows[i].li.classList.toggle("sel",
        !!(o.selection && o.selection.kind === "station" && o.selection.id === i));
    });
    const sc = o.shipped + (o.shipped === 1 ? " pc" : " pcs");
    if (els.shipped.textContent !== sc) els.shipped.textContent = sc;

    if (!els.detail.classList.contains("hidden") && performance.now() - lastDetail > 900) {
      this.renderDetail();   // keep ETAs fresh
    }
  },

  select(sel) {
    app.orrey.selection = sel;
    if (sel) window.ATO.AudioKit.click();
    this.renderDetail();
  },

  renderDetail() {
    lastDetail = performance.now();
    const o = app.orrey, sel = o.selection, D = els.detail;
    if (!sel) { D.classList.add("hidden"); D.innerHTML = ""; return; }
    if (sel.kind === "commission" && !o.commissions.get(sel.id)) { this.select(null); return; }
    D.classList.remove("hidden");
    const keep = D.scrollTop;
    D.innerHTML = sel.kind === "station" ? this._stationHTML(sel.id) : this._commissionHTML(o.commissions.get(sel.id));
    D.scrollTop = keep;
    D.querySelectorAll("[data-cid]").forEach(el =>
      el.addEventListener("click", () => this.select({ kind: "commission", id: el.dataset.cid })));
    const x = D.querySelector(".detail-close");
    if (x) x.addEventListener("click", () => this.select(null));
  },

  _stationHTML(i) {
    const o = app.orrey, st = o.stations[i], S = window.ATO.STATIONS[i];
    const q = st.queue.length
      ? '<ol class="queue">' + st.queue.map(cid => {
          const c = o.commissions.get(cid);
          return '<li data-cid="' + c.id + '">' +
            '<span class="swatch" style="background:' + c.woodColor + '"></span>' +
            '<span class="q-no">№ ' + c.no + '</span>' +
            '<span class="q-piece">' + esc(c.piece) + '</span>' +
            '<span class="q-eta">≈ ' + o.etaDays(c).toFixed(1) + 'd</span></li>';
        }).join("") + '</ol>'
      : '<p class="empty">Idle — nothing on the bench.</p>';
    return '<div class="detail-head"><span class="detail-numeral">' + S.numeral + '</span>' +
      '<h3>' + S.name + '</h3>' +
      '<button class="icon-btn detail-close" title="Close (Esc)" aria-label="Close">' + ICONS.close + '</button></div>' +
      '<p class="blurb">' + S.blurb + '</p>' +
      '<div class="stat-row"><span>Cycle ' + S.period.toFixed(1) + ' d</span>' +
      '<span>Processed ' + st.processed + '</span><span>In queue ' + st.queue.length + '</span></div>' +
      '<h4 class="sect">Queue — next out first</h4>' + q;
  },

  _commissionHTML(c) {
    const o = app.orrey, S = window.ATO.STATIONS;
    const tr = o.transfers.find(t => t.cid === c.id);
    const cur = tr && tr.to >= 0 ? tr.to : c.station;
    const at = tr ? (tr.to >= 0 ? "In transit → " + S[tr.to].name : "Leaving the shop")
                  : "At: " + S[c.station].name;
    const shipTxt = tr && tr.to < 0 ? "Shipping now" : "Ships in ≈ " + o.etaDays(c).toFixed(1) + " d";
    const stages = S.map((s, i) => {
      const done = i < cur, now = i === cur;
      return '<span class="stage-dot' + (done ? " done" : "") + (now ? " now" : "") +
             '" title="' + s.name + '"></span>' +
             (i < 4 ? '<span class="stage-link' + (done ? " done" : "") + '"></span>' : "");
    }).join("");
    const log = c.log.map(e =>
      '<li><span class="l-day">D' + e.day.toFixed(0) + '</span>' + esc(e.text) + '</li>').join("");
    return '<div class="detail-head"><span class="detail-numeral">№ ' + c.no + '</span>' +
      '<button class="icon-btn detail-close" title="Close (Esc)" aria-label="Close">' + ICONS.close + '</button></div>' +
      '<h3 class="job-piece">' + esc(c.piece) + '</h3>' +
      '<p class="job-meta"><span class="swatch" style="background:' + c.woodColor + '"></span>' +
      esc(c.wood) + ' · for ' + esc(c.client) + '</p>' +
      '<div class="stages">' + stages + '</div>' +
      '<div class="stat-row"><span>' + at + '</span><span>' + shipTxt + '</span></div>' +
      '<h4 class="sect">Journey</h4><ul class="journey">' + log + '</ul>';
  },

  bindTransport() {
    els.btnPlay.addEventListener("click", () => this.togglePlay());
    els.btnMute.addEventListener("click", () => this.toggleMute());
    els.btnNew.addEventListener("click", () => this.newCommission());
    els.speed.forEach(b => b.addEventListener("click", () => this.setSpeed(+b.dataset.speed)));
    $("#help-close").addEventListener("click", () => this.toggleHelp(false));
    els.help.addEventListener("click", e => { if (e.target === els.help) this.toggleHelp(false); });
  },

  togglePlay() { app.orrey.running = !app.orrey.running; this.syncPlay(); window.ATO.AudioKit.click(); },
  syncPlay() {
    const r = app.orrey.running;
    els.btnPlay.innerHTML = r ? ICONS.pause : ICONS.play;
    els.btnPlay.title = r ? "Pause (Space)" : "Play (Space)";
  },
  setSpeed(v) {
    app.orrey.speed = v;
    els.speed.forEach(b => b.classList.toggle("active", +b.dataset.speed === v));
    window.ATO.AudioKit.click();
  },
  toggleMute() { window.ATO.AudioKit.toggle(); this.syncMute(); },
  syncMute() {
    const m = window.ATO.AudioKit.muted;
    els.btnMute.innerHTML = m ? ICONS.sndOff : ICONS.sndOn;
    els.btnMute.title = m ? "Unmute (M)" : "Mute (M)";
  },
  newCommission() { app.orrey.spawnCommission(); },

  onEvent(type, d) {
    const A = window.ATO.AudioKit;
    switch (type) {
      case "cycle":
        if (!d.empty) A.tick(d.i);
        break;
      case "handoff":
        A.handoff();
        this.ticker("№ " + d.c.no + " left " + window.ATO.STATIONS[d.from].name +
          (d.to >= 0 ? " → " + window.ATO.STATIONS[d.to].name : " → the world"));
        this.renderDetail();
        break;
      case "arrive":
        A.arrive();
        this.renderDetail();
        break;
      case "ship":
        A.ship();
        this.toast("№ " + d.no + " " + d.piece + " shipped. Invoice in the post.");
        this.ticker("№ " + d.no + " shipped — " + d.wood + " " + d.piece);
        this.renderDetail();
        break;
      case "spawn":
        this.toast("№ " + d.no + " — " + d.wood + " " + d.piece + " for " + d.client + ".");
        this.ticker("№ " + d.no + " commissioned for " + d.client);
        this.renderDetail();
        break;
    }
  },

  ticker(msg) { els.ticker.textContent = msg; },
  toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3000);
  },
  toggleHelp(force) {
    const show = force !== undefined ? force : els.help.classList.contains("hidden");
    els.help.classList.toggle("hidden", !show);
  },

  bindKeys() {
    window.addEventListener("keydown", e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const o = app.orrey;
      switch (e.key) {
        case " ":
          if (document.activeElement && document.activeElement.tagName === "BUTTON") return;
          e.preventDefault(); this.togglePlay(); break;
        case "1": case "2": case "3":
          this.setSpeed([1, 4, 16][+e.key - 1]); break;
        case "ArrowRight": case "ArrowLeft": {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          let i;
          if (o.selection && o.selection.kind === "station") i = o.selection.id;
          else if (o.selection && o.selection.kind === "commission") {
            const c = o.commissions.get(o.selection.id);
            i = c ? c.station : 0;
          } else i = dir > 0 ? -1 : 0;
          this.select({ kind: "station", id: (i + dir + 5) % 5 });
          break;
        }
        case "n": case "N": this.newCommission(); break;
        case "m": case "M": this.toggleMute(); break;
        case "h": case "H": case "?": this.toggleHelp(); break;
        case "Escape":
          if (!els.help.classList.contains("hidden")) this.toggleHelp(false);
          else this.select(null);
          break;
      }
    });
  }
};

window.ATO.UI = UI;
})();
