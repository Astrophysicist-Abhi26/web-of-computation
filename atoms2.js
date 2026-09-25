/* ============================================================
   THE WEB OF COMPUTATION — atoms2.js
   Three more playable atoms, added to the same overlay as the
   Turing machine, Enigma and friends (atoms.js):

   · Neural-net playground  — train a small network live and watch
                              the decision boundary bend (fields:
                              Neural Prehistory, Deep Learning)
   · NAND → CPU             — gates from one gate, a 4-bit ALU, and
                              a 16-byte stored-program computer
                              (fields: Stored Program, Wartime)
   · Life & Rule 110        — Conway's Game of Life and the 256
                              elementary automata (fields:
                              Computability, Automata)

   Each atom registers a tab, a pane, INIT[id] and a launch button
   on its fields' panels. atoms.js must load first.
   ============================================================ */
(function () {
"use strict";
if (typeof INIT === "undefined" || !document.getElementById("atoms-box")) return;

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function randn(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function hidpi(c, w, h) { const d = Math.min(2, devicePixelRatio || 1); c.width = w * d; c.height = h * d; const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); return x; }

/* ============================================================
   CSS
   ============================================================ */
const CSS = `
#atoms-box.wide { width: min(1060px, 96vw); }
.a2 { --o: #f59e42; --b: #4f8cff; }
.a2 .a2-sub { display: flex; gap: .35rem; flex-wrap: wrap; margin: .2rem 0 .8rem; }
.a2 .a2-sub button, .a2 .a2-chip { font: 500 .68rem "IBM Plex Mono", monospace; color: var(--dim); background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: .35rem .75rem; cursor: pointer; }
.a2 .a2-sub button.on, .a2 .a2-chip.on { color: #fff; border-color: var(--gold); background: rgba(245,196,81,.14); }
.a2 .a2-sub button:hover, .a2 .a2-chip:hover { border-color: var(--gold); }
.a2 .a2-grid { display: grid; gap: 1rem; align-items: start; }
.a2 .a2-lbl { font: 600 .6rem "IBM Plex Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: #9d96b8; margin: .7rem 0 .35rem; }
.a2 .a2-lbl:first-child { margin-top: 0; }
.a2 .a2-row { display: flex; gap: .4rem; align-items: center; flex-wrap: wrap; margin: .3rem 0; }
.a2 .a2-step { display: inline-flex; align-items: center; border: 1px solid rgba(255,255,255,.18); border-radius: 8px; overflow: hidden; }
.a2 .a2-step button { background: rgba(255,255,255,.05); border: 0; color: var(--ink); width: 1.9rem; height: 1.8rem; cursor: pointer; font: 600 .9rem "IBM Plex Mono", monospace; }
.a2 .a2-step button:hover { color: var(--gold); }
.a2 .a2-step b { min-width: 2rem; text-align: center; font: 600 .78rem "IBM Plex Mono", monospace; }
.a2 select { font: .7rem "IBM Plex Mono", monospace; color: var(--ink); background: #140c24; border: 1px solid rgba(255,255,255,.18); border-radius: 7px; padding: .3rem .4rem; }
.a2 canvas.a2-cv { display: block; width: 100%; border: 1px solid rgba(255,255,255,.12); border-radius: 10px; background: #120b22; touch-action: none; }
.a2 .a2-note { font-size: .82rem; line-height: 1.55; color: #d8d2ea; margin: .5rem 0; }
.a2 .a2-note b { color: var(--gold); font-weight: 600; }
.a2 .a2-mono { font: .7rem/1.6 "IBM Plex Mono", monospace; color: #cfc9e4; }
.a2 .a2-stats { white-space: pre-line; font: .7rem/1.6 "IBM Plex Mono", monospace; color: #cfc9e4; background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.09);
  border-radius: 8px; padding: .45rem .6rem; margin: .5rem 0; }
.a2 .a2-stats .g { color: var(--gold); font-weight: 600; } .a2 .a2-stats .t { color: #7fe3d6; font-weight: 600; } .a2 .a2-stats .r { color: #ff8f7a; font-weight: 600; } .a2 .a2-stats .d { color: #8d86a8; }
.a2 .a2-why { font-size: .8rem; line-height: 1.55; color: #bdb6d6; border-left: 2px solid var(--gold); padding: .2rem 0 .2rem .7rem; margin: .8rem 0 0; }
.a2 .a2-why a { color: #7fe3d6; }

/* neural net */
.a2-nn .a2-grid { grid-template-columns: 210px minmax(0, 1.15fr) minmax(0, 1fr); }
.a2-nn .nn-net { position: relative; height: 320px; border: 1px solid rgba(255,255,255,.1); border-radius: 10px; background: rgba(0,0,0,.2); }
.a2-nn .nn-net svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.a2-nn .nn-node { position: absolute; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.35); background: #120b22; }
.a2-nn .nn-node canvas { width: 100%; height: 100%; display: block; image-rendering: auto; }
.a2-nn .nn-node.out { width: 40px; height: 40px; margin: -20px 0 0 -20px; border-color: var(--gold); }
.a2-nn .nn-in-l { position: absolute; transform: translate(-100%, -50%); margin-left: -21px; font: .62rem "IBM Plex Mono", monospace; color: #9d96b8; }
.a2-nn .nn-col-l { position: absolute; top: 4px; transform: translateX(-50%); font: .56rem "IBM Plex Mono", monospace; color: #8d86a8; white-space: nowrap; }
.a2-nn .nn-legend { display: flex; justify-content: space-between; font: .6rem "IBM Plex Mono", monospace; color: #9d96b8; margin-top: .25rem; }
.a2-nn .nn-legend i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; vertical-align: -1px; margin-right: .25rem; }

/* cpu */
.a2-cpu .cpu-circ { width: 100%; height: auto; display: block; border: 1px solid rgba(255,255,255,.1); border-radius: 10px; background: rgba(0,0,0,.2); }
.a2-cpu .cpu-in { cursor: pointer; }
.a2-cpu .cpu-tt { border-collapse: collapse; font: .7rem "IBM Plex Mono", monospace; margin: .4rem 0; }
.a2-cpu .cpu-tt th, .a2-cpu .cpu-tt td { border: 1px solid rgba(255,255,255,.1); padding: .22rem .5rem; text-align: center; color: #d8d2ea; }
.a2-cpu .cpu-tt th { color: #9d96b8; font-weight: 500; }
.a2-cpu .cpu-tt tr.on td { background: rgba(245,196,81,.16); color: #fff; }
.a2-cpu .cpu-bits { display: inline-flex; gap: 4px; }
.a2-cpu .cpu-bit { width: 30px; height: 34px; border-radius: 6px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.04);
  color: #8d86a8; font: 600 .85rem "IBM Plex Mono", monospace; cursor: pointer; display: grid; place-items: center; padding: 0; }
.a2-cpu .cpu-bit.on { background: rgba(245,196,81,.2); border-color: var(--gold); color: #fff; box-shadow: 0 0 10px rgba(245,196,81,.35); }
.a2-cpu .cpu-bit.ro { cursor: default; }
.a2-cpu .cpu-fa { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; margin: .6rem 0; }
.a2-cpu .cpu-fab { border: 1px solid rgba(255,255,255,.15); border-radius: 9px; padding: .4rem; text-align: center; font: .64rem/1.5 "IBM Plex Mono", monospace; color: #cfc9e4; position: relative; }
.a2-cpu .cpu-fab b { color: #fff; font-size: .8rem; }
.a2-cpu .cpu-fab .cin { color: #8d86a8; } .a2-cpu .cpu-fab .cin.on { color: var(--gold); font-weight: 600; }
.a2-cpu .cpu-mem { border-collapse: collapse; width: 100%; font: .68rem "IBM Plex Mono", monospace; }
.a2-cpu .cpu-mem td { border-bottom: 1px solid rgba(255,255,255,.07); padding: .12rem .3rem; color: #cfc9e4; white-space: nowrap; }
.a2-cpu .cpu-mem td.ad { color: #8d86a8; width: 2.2rem; }
.a2-cpu .cpu-mem td.bits { letter-spacing: .06em; }
.a2-cpu .cpu-mem td.bits .hi { color: var(--gold); } .a2-cpu .cpu-mem td.bits .lo { color: #7fe3d6; }
.a2-cpu .cpu-mem input { width: 100%; min-width: 5.5rem; font: .7rem "IBM Plex Mono", monospace; color: var(--ink); background: transparent;
  border: 1px solid transparent; border-radius: 5px; padding: .12rem .3rem; }
.a2-cpu .cpu-mem input:hover { border-color: rgba(255,255,255,.18); } .a2-cpu .cpu-mem input:focus { outline: none; border-color: var(--gold); background: rgba(0,0,0,.3); }
.a2-cpu .cpu-mem input.bad { border-color: #ff8f7a; }
.a2-cpu .cpu-mem tr.pc td { background: rgba(245,196,81,.13); } .a2-cpu .cpu-mem tr.pc td.ad { color: var(--gold); }
.a2-cpu .cpu-mem tr.pc td.ad::before { content: "▶ "; }
.a2-cpu .cpu-mem tr.wr td { background: rgba(127,227,214,.12); }
.a2-cpu .cpu-mem td.as { color: #8d86a8; font-size: .62rem; }
.a2-cpu .cpu-regs { display: grid; grid-template-columns: repeat(2, 1fr); gap: .45rem; }
.a2-cpu .cpu-reg { border: 1px solid rgba(255,255,255,.14); border-radius: 9px; padding: .35rem .5rem; font: .64rem/1.45 "IBM Plex Mono", monospace; color: #9d96b8; }
.a2-cpu .cpu-reg b { display: block; color: #fff; font-size: .82rem; letter-spacing: .04em; }
.a2-cpu .cpu-flag { display: inline-block; padding: 0 .35rem; border-radius: 4px; border: 1px solid rgba(255,255,255,.2); margin-right: .25rem; }
.a2-cpu .cpu-flag.on { background: rgba(255,143,122,.25); border-color: #ff8f7a; color: #fff; }
.a2-cpu .cpu-out { font: 600 2.4rem/1 "IBM Plex Mono", monospace; color: #ff6b4a; text-shadow: 0 0 14px rgba(255,107,74,.6);
  background: #0c0612; border: 1px solid rgba(255,255,255,.12); border-radius: 9px; padding: .45rem .7rem; text-align: right; letter-spacing: .08em; }
.a2-cpu .cpu-log { font: .66rem "IBM Plex Mono", monospace; color: #cfc9e4; margin-top: .3rem; min-height: 1.2rem; word-break: break-all; }
.a2-cpu .cpu-phase { font: .66rem/1.6 "IBM Plex Mono", monospace; color: #cfc9e4; background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.09); border-radius: 8px; padding: .4rem .55rem; margin: .5rem 0; min-height: 3.2rem; }
.a2-cpu .cpu-phase .k { color: var(--gold); }
.a2-cpu .cpu-isa { font: .62rem/1.55 "IBM Plex Mono", monospace; color: #9d96b8; columns: 2; margin-top: .4rem; }
.a2-cpu .cpu-isa b { color: #d8d2ea; font-weight: 500; }

/* automata */
.a2-life .life-cv { max-width: 760px; margin: 0 auto; }
.a2-life .eca-rule { display: grid; grid-template-columns: repeat(8, 1fr); gap: .35rem; margin: .4rem 0; }
.a2-life .eca-cell { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: .25rem 0; border-radius: 7px; border: 1px solid rgba(255,255,255,.08); }
.a2-life .eca-cell:hover { border-color: var(--gold); }
.a2-life .eca-cell span { display: flex; gap: 2px; } .a2-life .eca-cell i { width: 10px; height: 10px; border: 1px solid rgba(255,255,255,.3); display: block; }
.a2-life .eca-cell i.on { background: #f5c451; border-color: #f5c451; }
.a2-life .eca-cell .res i { width: 10px; }
.a2-life input[type=number] { width: 4.2rem; font: .75rem "IBM Plex Mono", monospace; color: var(--ink); background: #140c24; border: 1px solid rgba(255,255,255,.18); border-radius: 7px; padding: .3rem .4rem; }
@media (max-width: 860px) {
  .a2-nn .a2-grid, .a2-cpu .a2-grid { grid-template-columns: 1fr !important; }
}
`;
const st = document.createElement("style"); st.id = "atoms2-css"; st.textContent = CSS; document.head.appendChild(st);

/* ============================================================
   Registration helpers
   ============================================================ */
const box = $("atoms-box"), tabsNav = box.querySelector(".atom-tabs"), footer = $("atoms-box-footer");
const STOPS = [];
function register(a) {
  const tab = document.createElement("button");
  tab.className = "atom-tab"; tab.dataset.atom = a.id; tab.textContent = a.name;
  tab.addEventListener("click", () => showAtom(a.id));
  tabsNav.appendChild(tab);
  const pane = document.createElement("section");
  pane.className = "atom-pane a2 " + a.cls; pane.id = "atom-" + a.id; pane.hidden = true;
  pane.innerHTML = a.html;
  box.insertBefore(pane, footer);
  ATOM_NAMES[a.id] = a.name;
  let built = false;
  INIT[a.id] = () => { if (!built) { built = true; a.build(pane); } a.start(pane); };
  STOPS.push(a.stop);
  for (const f of a.fields) (FIELD_ATOMS[f] = FIELD_ATOMS[f] || []).push(a.id);
}
const FIELD_ATOMS = {};
const WIDE = new Set(["nn", "cpu", "life"]);
// stopAll/showAtom are global function declarations in atoms.js; wrapping the
// global binding reaches every caller (tabs, close buttons, field launches).
const _stopAll = window.stopAll, _showAtom = window.showAtom;
window.stopAll = function () { _stopAll(); STOPS.forEach(s => { try { s(); } catch (e) {} }); };
window.showAtom = function (id) { box.classList.toggle("wide", WIDE.has(id)); return _showAtom(id); };
if (typeof window.openField === "function") {
  const orig = window.openField;
  window.openField = function (f, d) {
    const r = orig.apply(this, arguments);
    const list = FIELD_ATOMS[f.id]; const body = $("panel-body");
    if (list && body) {
      const existing = body.querySelectorAll(".atom-launch"); let after = existing[existing.length - 1] || null;
      list.forEach(id => {
        if (body.querySelector(`.atom-launch[data-a2="${id}"]`)) return;
        const btn = document.createElement("button");
        btn.className = "atom-launch"; btn.dataset.a2 = id; btn.textContent = "⚛ play: " + ATOM_NAMES[id];
        btn.addEventListener("click", () => window.openAtomFromField(id));
        if (after) after.after(btn); else body.insertBefore(btn, body.children[2] || null);
        after = btn;
      });
    }
    return r;
  };
}

/* ============================================================
   1) NEURAL-NET PLAYGROUND
   ============================================================ */
const NN = { data:"spiral", layers:2, width:6, act:"tanh", opt:"adam", lr:0.03, feats:false, speed:1,
  running:false, raf:0, epoch:0, hist:[], net:null, train:[], test:[] };
const ACT = {
  tanh:    { f: Math.tanh, d: a => 1 - a * a, lo: -1, hi: 1 },
  relu:    { f: z => z > 0 ? z : 0, d: a => a > 0 ? 1 : 0, lo: 0, hi: null },
  sigmoid: { f: z => 1 / (1 + Math.exp(-z)), d: a => a * (1 - a), lo: 0, hi: 1 },
};
const sigm = z => 1 / (1 + Math.exp(-z));
function genData(kind, n, seed) {
  const r = mulberry(seed), pts = [];
  for (let i = 0; i < n; i++) {
    let x, y, t;
    if (kind === "xor") { x = r() * 2 - 1; y = r() * 2 - 1; const pad = .08; x += x > 0 ? pad : -pad; y += y > 0 ? pad : -pad; x *= .9; y *= .9; t = x * y > 0 ? 1 : 0; }
    else if (kind === "circle") { t = i % 2; const rad = t ? r() * .42 : .62 + r() * .3, a = r() * 2 * Math.PI; x = rad * Math.cos(a) + randn(r) * .03; y = rad * Math.sin(a) + randn(r) * .03; }
    else if (kind === "gauss") { t = i % 2; const c = t ? .42 : -.42; x = c + randn(r) * .2; y = c + randn(r) * .2; }
    else { // two interleaved spirals
      t = i % 2; const k = Math.floor(i / 2) / (n / 2), rad = .06 + k * .86, a = k * 1.75 * 2 * Math.PI + (t ? Math.PI : 0);
      x = rad * Math.sin(a) + randn(r) * .025; y = rad * Math.cos(a) + randn(r) * .025;
    }
    pts.push({ x, y, t });
  }
  return pts;
}
const feat = (x, y) => NN.feats ? [x, y, x * x, y * y, x * y] : [x, y];
const FEAT_NAMES = () => NN.feats ? ["x", "y", "x²", "y²", "xy"] : ["x", "y"];
function buildNet(seed) {
  const r = mulberry(seed), sizes = [feat(0, 0).length, ...Array(NN.layers).fill(NN.width), 1];
  const L = sizes.length - 1, W = [], b = [], mW = [], vW = [], mb = [], vb = [];
  for (let l = 0; l < L; l++) {
    const fin = sizes[l], fout = sizes[l + 1], sc = Math.sqrt((NN.act === "relu" && l < L - 1 ? 2 : 1) / fin);
    W.push(Float64Array.from({ length: fin * fout }, () => randn(r) * sc)); b.push(new Float64Array(fout).fill(NN.act === "relu" ? .01 : 0));
    mW.push(new Float64Array(fin * fout)); vW.push(new Float64Array(fin * fout)); mb.push(new Float64Array(fout)); vb.push(new Float64Array(fout));
  }
  NN.net = { sizes, L, W, b, mW, vW, mb, vb, t: 0 };
}
function forward(inp) {
  const { sizes, L, W, b } = NN.net, A = [inp], act = ACT[NN.act].f;
  for (let l = 0; l < L; l++) {
    const fin = sizes[l], fout = sizes[l + 1], a = A[l], o = new Float64Array(fout), w = W[l];
    for (let j = 0; j < fout; j++) { let z = b[l][j]; for (let i = 0; i < fin; i++) z += w[j * fin + i] * a[i]; o[j] = l === L - 1 ? sigm(z) : act(z); }
    A.push(o);
  }
  return A;
}
function trainEpoch() {
  const { sizes, L, W, b } = NN.net, d = ACT[NN.act].d, data = NN.train, B = 10;
  const order = data.map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const gW = W.map(w => new Float64Array(w.length)), gb = b.map(x => new Float64Array(x.length));
  for (let s = 0; s < order.length; s += B) {
    gW.forEach(g => g.fill(0)); gb.forEach(g => g.fill(0));
    const n = Math.min(B, order.length - s);
    for (let k = 0; k < n; k++) {
      const p = data[order[s + k]], A = forward(feat(p.x, p.y));
      let delta = new Float64Array([A[L][0] - p.t]);       // BCE through a sigmoid
      for (let l = L - 1; l >= 0; l--) {
        const fin = sizes[l], fout = sizes[l + 1], a = A[l], w = W[l];
        for (let j = 0; j < fout; j++) { gb[l][j] += delta[j]; for (let i = 0; i < fin; i++) gW[l][j * fin + i] += delta[j] * a[i]; }
        if (l > 0) { const prev = new Float64Array(fin); for (let i = 0; i < fin; i++) { let sum = 0; for (let j = 0; j < fout; j++) sum += w[j * fin + i] * delta[j]; prev[i] = sum * d(a[i]); } delta = prev; }
      }
    }
    update(gW, gb, n);
  }
  NN.epoch++;
}
function update(gW, gb, n) {
  const N = NN.net; N.t++;
  const lr = NN.lr, b1 = .9, b2 = .999, c1 = 1 - Math.pow(b1, N.t), c2 = 1 - Math.pow(b2, N.t);
  const upd = (w, g, m, v) => { for (let i = 0; i < w.length; i++) { const gi = g[i] / n;
    if (NN.opt === "sgd") { w[i] -= lr * gi; continue; }
    m[i] = b1 * m[i] + (1 - b1) * gi; v[i] = b2 * v[i] + (1 - b2) * gi * gi; w[i] -= lr * (m[i] / c1) / (Math.sqrt(v[i] / c2) + 1e-8); } };
  for (let l = 0; l < N.L; l++) { upd(N.W[l], gW[l], N.mW[l], N.vW[l]); upd(N.b[l], gb[l], N.mb[l], N.vb[l]); }
}
function evalSet(set) {
  let loss = 0, ok = 0;
  for (const p of set) { const o = forward(feat(p.x, p.y))[NN.net.L][0], q = Math.min(1 - 1e-7, Math.max(1e-7, o)); loss -= p.t ? Math.log(q) : Math.log(1 - q); if ((o > .5) === !!p.t) ok++; }
  return { loss: loss / set.length, acc: ok / set.length };
}
const nParams = () => NN.net.W.reduce((s, w) => s + w.length, 0) + NN.net.b.reduce((s, x) => s + x.length, 0);
// colour helpers: value in [0,1] → blue … background … orange
const BG = [18, 11, 34], OR = [245, 158, 66], BL = [79, 140, 255];
function shade(v, out, i, strength) {
  const s = Math.min(1, Math.abs(v - .5) * 2) * strength, c = v > .5 ? OR : BL;
  out[i] = BG[0] + (c[0] - BG[0]) * s; out[i + 1] = BG[1] + (c[1] - BG[1]) * s; out[i + 2] = BG[2] + (c[2] - BG[2]) * s; out[i + 3] = 255;
}
const G = 64, MG = 22;
let nnOff, nnOffCtx;

const NN_HTML = `
  <h3>Neural-net playground · 1986 → today — watch a network learn</h3>
  <p class="ahint">Orange dots are class 1, blue dots class 0. Press ▶ and the network adjusts its weights by backpropagation; the background shows what it currently predicts everywhere. Each small square is one neuron: the picture of the plane it has learned to detect.</p>
  <div class="a2-grid">
    <div>
      <div class="a2-lbl">Data</div>
      <div class="a2-row nn-data">
        <button class="a2-chip" data-d="gauss">two blobs</button><button class="a2-chip" data-d="xor">XOR</button>
        <button class="a2-chip" data-d="circle">circle</button><button class="a2-chip" data-d="spiral">spiral</button></div>
      <div class="a2-lbl">Network</div>
      <div class="a2-row"><span class="a2-mono">hidden layers</span><span class="a2-step"><button data-k="layers" data-v="-1">−</button><b class="nn-layers"></b><button data-k="layers" data-v="1">+</button></span></div>
      <div class="a2-row"><span class="a2-mono">neurons each</span><span class="a2-step"><button data-k="width" data-v="-1">−</button><b class="nn-width"></b><button data-k="width" data-v="1">+</button></span></div>
      <div class="a2-row"><span class="a2-mono">activation</span><select class="nn-act"><option value="tanh">tanh</option><option value="relu">ReLU</option><option value="sigmoid">sigmoid</option></select></div>
      <label class="achk"><input type="checkbox" class="nn-feats"> hand-made features x², y², xy</label>
      <div class="a2-lbl">Training</div>
      <div class="a2-row"><span class="a2-mono">optimizer</span><select class="nn-opt"><option value="adam">Adam</option><option value="sgd">plain SGD</option></select></div>
      <div class="a2-row"><span class="a2-mono">learning rate</span><select class="nn-lr">${[0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3].map(v => `<option value="${v}">${v}</option>`).join("")}</select></div>
      <div class="a2-row"><span class="a2-mono">speed</span><select class="nn-speed"><option value="1">1 epoch / frame</option><option value="5">5 epochs / frame</option></select></div>
      <div class="a2-row"><button class="abtn nn-play">▶ train</button><button class="abtn nn-stepb">step</button><button class="abtn nn-reset">↺ new weights</button></div>
    </div>
    <div>
      <div class="nn-net"><svg></svg></div>
      <div class="nn-legend"><span><i style="background:#4f8cff"></i>negative weight / low</span><span>line width = weight size</span><span><i style="background:#f59e42"></i>positive / high</span></div>
    </div>
    <div>
      <canvas class="a2-cv nn-main" aria-label="decision boundary"></canvas>
      <canvas class="a2-cv nn-loss" style="margin-top:.5rem" aria-label="loss curve"></canvas>
      <div class="a2-stats nn-stats"></div>
      <label class="achk"><input type="checkbox" class="nn-showtest"> show test points (hollow)</label>
    </div>
  </div>
  <p class="a2-note nn-note"></p>
  <p class="a2-why">Try it: <b>spiral</b> with 0 hidden layers can only draw a straight line, which is Rosenblatt's perceptron and the wall Minsky and Papert described in 1969. Add two layers and it winds around the spiral. Or keep one layer but tick the hand-made features, which is how classical ML handled the same problem before deep learning. Backpropagation was popularised by Rumelhart, Hinton and Williams (1986); Adam by Kingma and Ba (2014). Inspired by Smilkov and Carter's <a href="https://playground.tensorflow.org" target="_blank" rel="noopener">TensorFlow Playground</a>.</p>`;

function nnBuild(root) {
  const q = s => root.querySelector(s);
  root.querySelectorAll(".nn-data .a2-chip").forEach(b => b.addEventListener("click", () => { NN.data = b.dataset.d; nnNewData(); nnReset(); }));
  root.querySelectorAll(".a2-step button").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.k, v = +b.dataset.v, lim = k === "layers" ? [0, 4] : [1, 8];
    NN[k] = Math.max(lim[0], Math.min(lim[1], NN[k] + v)); nnReset();
  }));
  q(".nn-act").addEventListener("change", e => { NN.act = e.target.value; nnReset(); });
  q(".nn-feats").addEventListener("change", e => { NN.feats = e.target.checked; nnReset(); });
  q(".nn-opt").addEventListener("change", e => { NN.opt = e.target.value; NN.lr = NN.opt === "sgd" ? 0.3 : 0.03; q(".nn-lr").value = String(NN.lr); nnReset(false); });
  q(".nn-lr").addEventListener("change", e => { NN.lr = +e.target.value; });
  q(".nn-speed").addEventListener("change", e => { NN.speed = +e.target.value; });
  q(".nn-play").addEventListener("click", () => nnRun(!NN.running));
  q(".nn-stepb").addEventListener("click", () => { nnRun(false); trainEpoch(); nnRecord(); nnDraw(); });
  q(".nn-reset").addEventListener("click", () => nnReset());
  q(".nn-showtest").addEventListener("change", nnDraw);
  nnOff = document.createElement("canvas"); nnOff.width = G; nnOff.height = G; nnOffCtx = nnOff.getContext("2d");
  q(".nn-lr").value = String(NN.lr);
  nnNewData(); nnReset();
}
function nnNewData() { NN.train = genData(NN.data, 240, 11); NN.test = genData(NN.data, 120, 97); }
function nnReset(newWeights = true) {
  const root = $("atom-nn");
  if (newWeights || !NN.net) buildNet((Math.random() * 1e9) | 0);
  NN.epoch = 0; NN.hist = []; nnRecord();
  root.querySelector(".nn-layers").textContent = NN.layers; root.querySelector(".nn-width").textContent = NN.width;
  root.querySelectorAll(".nn-data .a2-chip").forEach(b => b.classList.toggle("on", b.dataset.d === NN.data));
  nnLayout(); nnDraw();
}
function nnRecord() { const tr = evalSet(NN.train), te = evalSet(NN.test); NN.last = { tr, te }; NN.hist.push([tr.loss, te.loss]); if (NN.hist.length > 600) NN.hist.shift(); }
function nnRun(on) {
  NN.running = on; const b = $("atom-nn").querySelector(".nn-play"); b.textContent = on ? "⏸ pause" : "▶ train";
  cancelAnimationFrame(NN.raf);
  if (on) { const loop = () => { for (let i = 0; i < NN.speed; i++) trainEpoch(); nnRecord(); nnDraw(); if (NN.epoch >= 3000) { nnRun(false); return; } NN.raf = requestAnimationFrame(loop); }; NN.raf = requestAnimationFrame(loop); }
}
// network diagram: node boxes (HTML canvases) over an SVG of weights
let nnNodes = [];
function nnLayout() {
  const wrap = $("atom-nn").querySelector(".nn-net"), svg = wrap.querySelector("svg");
  wrap.querySelectorAll(".nn-node,.nn-in-l,.nn-col-l").forEach(n => n.remove());
  const { sizes } = NN.net, Wd = wrap.clientWidth || 360, H = wrap.clientHeight || 320;
  const cols = sizes.length, x0 = 46, x1 = Wd - 34;
  nnNodes = sizes.map((n, l) => {
    const x = cols === 1 ? Wd / 2 : x0 + l * (x1 - x0) / (cols - 1);
    const gap = Math.min(44, (H - 60) / Math.max(1, n - 1));
    const lab = document.createElement("div"); lab.className = "nn-col-l"; lab.style.left = x + "px";
    lab.textContent = l === 0 ? "input" : l === cols - 1 ? "output" : "layer " + l; wrap.appendChild(lab);
    return Array.from({ length: n }, (_, i) => {
      const y = H / 2 + (i - (n - 1) / 2) * gap + 8;
      const d = document.createElement("div"); d.className = "nn-node" + (l === cols - 1 ? " out" : "");
      d.style.left = x + "px"; d.style.top = y + "px";
      const c = document.createElement("canvas"); c.width = MG; c.height = MG; d.appendChild(c); wrap.appendChild(d);
      if (l === 0) { const t = document.createElement("div"); t.className = "nn-in-l"; t.style.left = x + "px"; t.style.top = y + "px"; t.textContent = FEAT_NAMES()[i]; wrap.appendChild(t); }
      return { x, y, c };
    });
  });
  svg.setAttribute("viewBox", `0 0 ${Wd} ${H}`);
}
function nnDraw() {
  const root = $("atom-nn"); if (!root || root.hidden || !NN.net) return;
  const { L, W, sizes } = NN.net, act = ACT[NN.act];
  // main canvas: prediction everywhere
  const main = root.querySelector(".nn-main"), cw = main.clientWidth || 320, ctx = hidpi(main, cw, cw);
  const img = nnOffCtx.createImageData(G, G);
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) { const x = -1 + 2 * (i + .5) / G, y = 1 - 2 * (j + .5) / G; shade(forward(feat(x, y))[L][0], img.data, (j * G + i) * 4, .8); }
  nnOffCtx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(nnOff, 0, 0, cw, cw);
  const P = (x, y) => [(x + 1) / 2 * cw, (1 - y) / 2 * cw];
  const dot = (p, hollow) => { const [px, py] = P(p.x, p.y); ctx.beginPath(); ctx.arc(px, py, 3.2, 0, 7);
    if (hollow) { ctx.strokeStyle = p.t ? "#f59e42" : "#4f8cff"; ctx.lineWidth = 1.6; ctx.stroke(); } else { ctx.fillStyle = p.t ? "#f59e42" : "#4f8cff"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1; ctx.stroke(); } };
  NN.train.forEach(p => dot(p, false));
  if (root.querySelector(".nn-showtest").checked) NN.test.forEach(p => dot(p, true));
  // loss curve
  const lc = root.querySelector(".nn-loss"), lw = lc.clientWidth || 320, lh = 70, lx = hidpi(lc, lw, lh);
  const hist = NN.hist, mx = Math.max(.75, ...hist.map(h => Math.max(h[0], h[1])));
  lx.strokeStyle = "rgba(255,255,255,.1)"; lx.beginPath(); lx.moveTo(0, lh - 12); lx.lineTo(lw, lh - 12); lx.stroke();
  [[0, "#f5c451"], [1, "#7fe3d6"]].forEach(([k, col]) => { lx.strokeStyle = col; lx.lineWidth = 1.5; lx.beginPath();
    hist.forEach((h, i) => { const x = hist.length < 2 ? 0 : i / (hist.length - 1) * lw, y = 6 + (1 - Math.min(h[k], mx) / mx) * (lh - 20); i ? lx.lineTo(x, y) : lx.moveTo(x, y); }); lx.stroke(); });
  lx.fillStyle = "#9d96b8"; lx.font = "10px IBM Plex Mono, monospace"; lx.fillText("loss: train", 4, lh - 1); lx.fillStyle = "#7fe3d6"; lx.fillText("test", 80, lh - 1);
  // node pictures: every neuron's activation over the plane
  const acts = nnNodes.map(col => col.map(() => new Float64Array(MG * MG)));
  const range = nnNodes.map(col => col.map(() => [Infinity, -Infinity]));
  for (let j = 0; j < MG; j++) for (let i = 0; i < MG; i++) {
    const x = -1 + 2 * (i + .5) / MG, y = 1 - 2 * (j + .5) / MG, A = forward(feat(x, y));
    A.forEach((a, l) => a.forEach((v, n) => { acts[l][n][j * MG + i] = v; const r = range[l][n]; if (v < r[0]) r[0] = v; if (v > r[1]) r[1] = v; }));
  }
  nnNodes.forEach((col, l) => col.forEach((nd, n) => {
    const c = nd.c.getContext("2d"), im = c.createImageData(MG, MG), a = acts[l][n];
    let lo, hi;
    if (l === 0) { lo = range[l][n][0]; hi = range[l][n][1]; }
    else if (l === L) { lo = 0; hi = 1; }
    else { lo = act.lo; hi = act.hi === null ? Math.max(1e-6, range[l][n][1]) : act.hi; }
    for (let k = 0; k < MG * MG; k++) shade(hi > lo ? (a[k] - lo) / (hi - lo) : .5, im.data, k * 4, .95);
    c.putImageData(im, 0, 0);
  }));
  // weights
  const svg = root.querySelector(".nn-net svg"); let s = "";
  for (let l = 0; l < L; l++) { const fin = sizes[l], w = W[l], mw = Math.max(...w.map(Math.abs), 1e-6);
    for (let j = 0; j < sizes[l + 1]; j++) for (let i = 0; i < fin; i++) {
      const a = nnNodes[l][i], b = nnNodes[l + 1][j], v = w[j * fin + i], k = Math.abs(v) / mw;
      s += `<line x1="${a.x + 17}" y1="${a.y}" x2="${b.x - 17}" y2="${b.y}" stroke="${v > 0 ? "#f59e42" : "#4f8cff"}" stroke-opacity="${(.25 + .6 * k).toFixed(2)}" stroke-width="${(.4 + 3.4 * k).toFixed(2)}"/>`;
    } }
  svg.innerHTML = s;
  // numbers + commentary
  const { tr, te } = NN.last;
  root.querySelector(".nn-stats").innerHTML = `epoch <span class="g">${NN.epoch}</span> · ${nParams()} parameters\ntrain loss <span class="g">${tr.loss.toFixed(3)}</span> · test loss <span class="t">${te.loss.toFixed(3)}</span> · test accuracy <span class="${te.acc > .95 ? "t" : te.acc > .8 ? "g" : "r"}">${(100 * te.acc).toFixed(0)}%</span>`;
  const note = root.querySelector(".nn-note");
  if (NN.layers === 0 && !NN.feats && NN.data !== "gauss") note.innerHTML = `<b>No hidden layer:</b> this is a perceptron, and its boundary can only ever be a straight line. ${NN.data === "xor" ? "XOR" : NN.data === "circle" ? "A circle" : "A spiral"} can't be split by a line, however long you train. Add a hidden layer.`;
  else if (NN.layers === 0 && NN.feats) note.innerHTML = `<b>No hidden layer, but hand-made features.</b> With x², y² and xy as inputs, a single neuron can draw a circle or split XOR. Someone had to know which features to add; a hidden layer learns its own.`;
  else if (NN.opt === "sgd" && NN.lr >= 1) note.innerHTML = `<b>Plain SGD with a large learning rate:</b> watch for the loss jumping around, where steps overshoot the valley.`;
  else if (te.acc > .97 && NN.epoch > 0) note.innerHTML = `<b>Solved.</b> Can you solve it with fewer neurons? Watch the small squares: the first layer detects straight edges, and later layers combine them into curves.`;
  else note.innerHTML = `Each hidden neuron starts as a random straight edge. Training rotates and shifts those edges until their combination fits the data.`;
}
function nnStart() { nnLayout(); nnDraw(); }
function nnStop() { nnRun(false); }
window.WOC_NN = { NN, trainEpoch, evalSet, buildNet, genData, nnRecord };   // for tests

/* ============================================================
   2) NAND → CPU
   ============================================================ */
const nand = (a, b) => (a && b) ? 0 : 1;
const CIRC = {
  NOT:  { ins:["A"], gates:[["n1","A","A"]], outs:[["Q","n1"]], note:"NOT A = A NAND A. Tie both inputs together." },
  AND:  { ins:["A","B"], gates:[["n1","A","B"],["n2","n1","n1"]], outs:[["Q","n2"]], note:"AND = NOT(NAND): a NAND followed by a NAND used as NOT." },
  OR:   { ins:["A","B"], gates:[["n1","A","A"],["n2","B","B"],["n3","n1","n2"]], outs:[["Q","n3"]], note:"OR = NAND of the two inverted inputs (De Morgan: A + B = ¬(¬A · ¬B))." },
  XOR:  { ins:["A","B"], gates:[["n1","A","B"],["n2","A","n1"],["n3","B","n1"],["n4","n2","n3"]], outs:[["Q","n4"]], note:"XOR in four NANDs: the 1 only when the inputs differ. This is the sum bit of binary addition." },
  "HALF ADDER": { ins:["A","B"], gates:[["n1","A","B"],["n2","A","n1"],["n3","B","n1"],["s","n2","n3"],["c","n1","n1"]], outs:[["S","s"],["C","c"]], note:"Add two bits: S = A XOR B, C = A AND B. 1 + 1 = 10₂, so S = 0 and carry C = 1." },
  "FULL ADDER": { ins:["A","B","Cin"], gates:[["n1","A","B"],["n2","A","n1"],["n3","B","n1"],["x","n2","n3"],["n5","x","Cin"],["n6","x","n5"],["n7","Cin","n5"],["s","n6","n7"],["co","n1","n5"]],
    outs:[["S","s"],["Cout","co"]], note:"Add three bits (A, B and a carry in) with nine NANDs. Chain four of these and you have a 4-bit adder: the next tab." },
};
function evalCirc(c, vals) { const v = { ...vals }; for (const [id, a, b] of c.gates) v[id] = nand(v[a], v[b]); return v; }
const FA = (a, b, cin) => { const v = evalCirc(CIRC["FULL ADDER"], { A:a, B:b, Cin:cin }); return [v.s, v.co]; };
const gXOR = (a, b) => evalCirc(CIRC.XOR, { A:a, B:b }).n4, gAND = (a, b) => evalCirc(CIRC.AND, { A:a, B:b }).n2, gOR = (a, b) => evalCirc(CIRC.OR, { A:a, B:b }).n3;

const CPU = { tab:"gates", circ:"XOR", ins:{ A:1, B:0, Cin:0 }, A:[0,1,1,0], B:[0,0,1,1], op:"ADD", prog:"multiply", M:null, src:[], timer:0, running:false, speed:4, lastW:-1, phase:"" };
const OPS = { NOP:0, LDA:1, ADD:2, SUB:3, STA:4, LDI:5, JMP:6, JC:7, JZ:8, OUT:14, HLT:15 };
const OPN = Object.fromEntries(Object.entries(OPS).map(([k, v]) => [v, k]));
const PROGS = {
  countdown: { name:"count down", src:["LDA 15","OUT","JZ 6","SUB 14","JMP 1","","HLT","","","","","","","","1","9"],
    about:"Prints 9, 8, … 0. Address 15 holds the start value and 14 holds the constant 1. JZ jumps when the last subtraction gave zero." },
  multiply: { name:"multiply 3 × 4", src:["LDA 13","ADD 14","STA 13","LDA 15","SUB 12","STA 15","JZ 8","JMP 0","LDA 13","OUT","HLT","","1","0","3","4"],
    about:"No multiply instruction, so it adds 3 four times. Address 13 is the running total, 15 counts down. Change 14 and 15 to multiply other numbers." },
  fibonacci: { name:"Fibonacci", src:["LDI 1","STA 14","LDI 0","OUT","ADD 14","STA 15","LDA 14","STA 13","LDA 15","STA 14","LDA 13","JC 0","JMP 3","","",""],
    about:"0, 1, 1, 2, 3, 5 … 144. When the next sum no longer fits in 8 bits the carry flag is set and JC restarts the program." },
  blank: { name:"write your own", src:Array(16).fill(""), about:"Type instructions (e.g. LDI 7, OUT, HLT) or plain numbers into memory, then step." },
};
function asm(line) {
  const s = String(line).replace(/;.*/, "").trim().toUpperCase();
  if (!s) return 0;
  if (/^\d+$/.test(s)) { if (+s > 255) throw new Error("numbers are 0–255"); return +s; }
  const [m, a, extra] = s.split(/\s+/);
  if (!(m in OPS) || extra !== undefined) throw new Error("unknown instruction");
  const needs = !["NOP", "OUT", "HLT"].includes(m);
  if (needs && (a === undefined || !/^\d+$/.test(a) || +a > 15)) throw new Error(m + " needs a value 0–15");
  return (OPS[m] << 4) | (needs ? +a : 0);
}
const dis = v => { const op = OPN[v >> 4]; return op ? (["NOP", "OUT", "HLT"].includes(op) ? op : `${op} ${v & 15}`) : "—"; };
const bits = (v, n = 8) => v.toString(2).padStart(n, "0");
// CPU.base is the program as loaded or edited; CPU.src is what memory shows now
// (STA writes change it). Reset goes back to CPU.base, keeping your edits.
function cpuLoad(name) { CPU.prog = name; CPU.base = PROGS[name].src.slice(); cpuReset(); }
function cpuReset() {
  CPU.src = CPU.base.slice();
  CPU.M = { mem: CPU.src.map(asm), pc:0, a:0, ir:0, c:false, z:false, out:[], halted:false, steps:0 };
  CPU.lastW = -1; CPU.phase = "Press <b>step</b> to run one fetch–decode–execute cycle.";
}
function cpuStep() {
  const M = CPU.M; if (M.halted) return;
  const at = M.pc, ir = M.mem[at], op = ir >> 4, arg = ir & 15, name = OPN[op] || "NOP";
  M.ir = ir; M.pc = (M.pc + 1) & 15; M.steps++; CPU.lastW = -1;
  let ex = "";
  switch (op) {
    case 1: ex = `A ← mem[${arg}] = ${M.mem[arg]}`; M.a = M.mem[arg]; break;
    case 2: { const r = M.a + M.mem[arg]; ex = `A ← ${M.a} + mem[${arg}] (${M.mem[arg]}) = ${r}${r > 255 ? ` → ${r & 255}, carry` : ""}`; M.c = r > 255; M.a = r & 255; M.z = M.a === 0; break; }
    case 3: { const r = M.a + ((~M.mem[arg]) & 255) + 1; ex = `A ← ${M.a} − mem[${arg}] (${M.mem[arg]}) = ${r & 255}  (done as A + NOT B + 1)`; M.c = r > 255; M.a = r & 255; M.z = M.a === 0; break; }
    case 4: ex = `mem[${arg}] ← A = ${M.a}`; M.mem[arg] = M.a; CPU.lastW = arg; CPU.src[arg] = String(M.a); break;
    case 5: ex = `A ← ${arg}`; M.a = arg; break;
    case 6: ex = `PC ← ${arg}`; M.pc = arg; break;
    case 7: ex = M.c ? `carry set: PC ← ${arg}` : "carry clear: no jump"; if (M.c) M.pc = arg; break;
    case 8: ex = M.z ? `zero set: PC ← ${arg}` : "zero clear: no jump"; if (M.z) M.pc = arg; break;
    case 14: ex = `OUT ← A = ${M.a}`; M.out.push(M.a); break;
    case 15: ex = "halt"; M.halted = true; M.pc = at; break;
    default: ex = "no operation";
  }
  CPU.phase = `<span class="k">fetch</span>   IR ← mem[${at}] = ${bits(ir)}\n<span class="k">decode</span>  ${bits(op, 4)} = ${name}${["NOP", "OUT", "HLT"].includes(name) ? "" : `, operand ${bits(arg, 4)} = ${arg}`}\n<span class="k">execute</span> ${ex}`;
}
const CPU_HTML = `
  <h3>NAND → CPU · 1913 → 1945 → today — build a computer from one gate</h3>
  <p class="ahint">Every digital computer can be built from a single kind of gate. Start with NAND, build the other gates, add numbers with them, then run programs on a 16-byte stored-program computer.</p>
  <div class="a2-sub cpu-tabs"><button data-t="gates">1 · gates from NAND</button><button data-t="alu">2 · a 4-bit ALU</button><button data-t="comp">3 · the computer</button></div>
  <div class="cpu-pane" data-p="gates">
    <div class="a2-row cpu-circs">${Object.keys(CIRC).map(k => `<button class="a2-chip" data-c="${k}">${k}</button>`).join("")}</div>
    <div class="a2-grid" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr)">
      <div><svg class="cpu-circ" viewBox="0 0 560 240"></svg><p class="a2-note cpu-cnote"></p></div>
      <div><div class="a2-lbl">Truth table</div><table class="cpu-tt"></table><div class="a2-stats cpu-gcount"></div></div>
    </div>
  </div>
  <div class="cpu-pane" data-p="alu" hidden>
    <div class="a2-grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div>
        <div class="a2-lbl">A (click bits)</div><div class="a2-row"><span class="cpu-bits cpu-A"></span><span class="a2-mono cpu-Ad"></span></div>
        <div class="a2-lbl">B</div><div class="a2-row"><span class="cpu-bits cpu-B"></span><span class="a2-mono cpu-Bd"></span></div>
        <div class="a2-lbl">Operation</div>
        <div class="a2-row cpu-ops">${["ADD", "SUB", "AND", "OR", "XOR"].map(o => `<button class="a2-chip" data-o="${o}">${o}</button>`).join("")}</div>
      </div>
      <div>
        <div class="a2-lbl">Result</div><div class="a2-row"><span class="cpu-bits cpu-R"></span><span class="a2-mono cpu-Rd"></span></div>
        <div class="a2-lbl">Flags</div><div class="a2-mono cpu-flags"></div>
        <div class="a2-stats cpu-acount"></div>
      </div>
    </div>
    <div class="a2-lbl">Ripple-carry adder: four full adders, carry flowing right to left</div>
    <div class="cpu-fa"></div>
    <p class="a2-note cpu-anote"></p>
  </div>
  <div class="cpu-pane" data-p="comp" hidden>
    <div class="a2-row cpu-progs">${Object.entries(PROGS).map(([k, p]) => `<button class="a2-chip" data-g="${k}">${p.name}</button>`).join("")}</div>
    <div class="a2-grid" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)">
      <div>
        <div class="a2-lbl">Memory · 16 bytes · the program and its data share it</div>
        <table class="cpu-mem"></table>
      </div>
      <div>
        <div class="a2-lbl">Output</div><div class="cpu-out">0</div><div class="cpu-log"></div>
        <div class="a2-lbl">Registers</div><div class="cpu-regs"></div>
        <div class="cpu-phase"></div>
        <div class="a2-row"><button class="abtn cpu-step">step</button><button class="abtn cpu-run">▶ run</button><button class="abtn cpu-reset">↺ reset</button>
          <select class="cpu-speed"><option value="2">slow</option><option value="4" selected>medium</option><option value="12">fast</option></select></div>
        <p class="a2-note cpu-about"></p>
        <div class="a2-lbl">Instruction set (high 4 bits = opcode, low 4 bits = address or value)</div>
        <div class="cpu-isa"><b>LDA a</b> A ← mem[a]<br><b>ADD a</b> A ← A + mem[a]<br><b>SUB a</b> A ← A − mem[a]<br><b>STA a</b> mem[a] ← A<br><b>LDI n</b> A ← n<br><b>JMP a</b> PC ← a<br><b>JC a</b> jump if carry<br><b>JZ a</b> jump if zero<br><b>OUT</b> show A<br><b>HLT</b> stop</div>
      </div>
    </div>
  </div>
  <p class="a2-why">NAND is <i>functionally complete</i>: Henry Sheffer published this in 1913 (Charles Peirce had noticed it around 1880). Shannon's 1937 thesis turned such gates into circuit design, and von Neumann's 1945 EDVAC report put program and data in one memory. The Apollo Guidance Computer was built almost entirely from NOR gates, the other universal gate. This computer's design follows the SAP-1 teaching machine from Malvino's <i>Digital Computer Electronics</i>, popularised by Ben Eater's breadboard computer.</p>`;

function cpuBuild(root) {
  const q = s => root.querySelector(s);
  root.querySelectorAll(".cpu-tabs button").forEach(b => b.addEventListener("click", () => { CPU.tab = b.dataset.t; cpuRun(false); cpuDraw(); }));
  root.querySelectorAll(".cpu-circs .a2-chip").forEach(b => b.addEventListener("click", () => { CPU.circ = b.dataset.c; cpuDraw(); }));
  root.querySelectorAll(".cpu-ops .a2-chip").forEach(b => b.addEventListener("click", () => { CPU.op = b.dataset.o; cpuDraw(); }));
  root.querySelectorAll(".cpu-progs .a2-chip").forEach(b => b.addEventListener("click", () => { cpuRun(false); cpuLoad(b.dataset.g); cpuDraw(); }));
  q(".cpu-circ").addEventListener("click", e => { const t = e.target.closest("[data-in]"); if (t) { CPU.ins[t.dataset.in] ^= 1; cpuDraw(); } });
  q(".cpu-tt").addEventListener("click", e => { const tr = e.target.closest("tr[data-r]"); if (!tr) return; const c = CIRC[CPU.circ]; tr.dataset.r.split("").forEach((v, i) => CPU.ins[c.ins[i]] = +v); cpuDraw(); });
  ["A", "B"].forEach(k => q(".cpu-" + k).addEventListener("click", e => { const t = e.target.closest("[data-i]"); if (t) { CPU[k][+t.dataset.i] ^= 1; cpuDraw(); } }));
  q(".cpu-step").addEventListener("click", () => { cpuRun(false); cpuStep(); cpuDraw(); });
  q(".cpu-run").addEventListener("click", () => cpuRun(!CPU.running));
  q(".cpu-reset").addEventListener("click", () => { cpuRun(false); cpuReset(); cpuDraw(); });
  q(".cpu-speed").addEventListener("change", e => { CPU.speed = +e.target.value; if (CPU.running) { cpuRun(false); cpuRun(true); } });
  q(".cpu-mem").addEventListener("change", e => {
    const inp = e.target.closest("input"); if (!inp) return;
    const i = +inp.dataset.a;
    try { CPU.M.mem[i] = asm(inp.value); CPU.src[i] = CPU.base[i] = inp.value; inp.classList.remove("bad"); inp.title = ""; cpuDraw(); }
    catch (err) { inp.classList.add("bad"); inp.title = err.message; }
  });
  cpuLoad("multiply");
}
function cpuRun(on) {
  CPU.running = on; clearInterval(CPU.timer);
  const b = $("atom-cpu") && $("atom-cpu").querySelector(".cpu-run"); if (b) b.textContent = on ? "⏸ pause" : "▶ run";
  if (on) {
    if (CPU.M.halted) cpuReset();
    CPU.timer = setInterval(() => { cpuStep(); cpuDraw(); if (CPU.M.halted || CPU.M.steps > 5000) cpuRun(false); }, 1000 / CPU.speed);
  }
}
function drawCircuit(svg, c, vals) {
  // columns by depth; gates placed in order within a column
  const depth = {}; c.ins.forEach(i => depth[i] = 0);
  for (const [id, a, b] of c.gates) depth[id] = 1 + Math.max(depth[a], depth[b]);
  const maxD = Math.max(...c.gates.map(g => depth[g[0]])), W = 560, H = 240;
  const colX = d => 70 + (d - .5) * (W - 170) / maxD;
  const pos = {};
  c.ins.forEach((id, i) => pos[id] = { x: 34, y: H / 2 + (i - (c.ins.length - 1) / 2) * 62, out: [48, 0] });
  const byCol = {}; c.gates.forEach(g => (byCol[depth[g[0]]] = byCol[depth[g[0]]] || []).push(g));
  // column by column, order gates by the mean height of their inputs to reduce crossings
  for (let d = 1; d <= maxD; d++) {
    const col = (byCol[d] || []).slice().sort((g1, g2) => (pos[g1[1]].y + pos[g1[2]].y) - (pos[g2[1]].y + pos[g2[2]].y));
    col.forEach((g, i) => pos[g[0]] = { x: colX(d), y: H / 2 + (i - (col.length - 1) / 2) * 64 });
  }
  const on = v => v ? "#f5c451" : "#4b4468";
  let s = "";
  const wire = (x1, y1, x2, y2, v) => { const mx = (x1 + x2) / 2; s += `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" fill="none" stroke="${on(v)}" stroke-width="${v ? 2.6 : 1.8}"${v ? ' style="filter:drop-shadow(0 0 3px #f5c451)"' : ""}/>`; };
  const outPt = id => c.ins.includes(id) ? [pos[id].x + 14, pos[id].y] : [pos[id].x + 24, pos[id].y];
  for (const [id, a, b] of c.gates) { const p = pos[id]; [[a, -8], [b, 8]].forEach(([src, dy]) => { const [x1, y1] = outPt(src); wire(x1, y1, p.x - 16, p.y + dy, vals[src]); }); }
  c.outs.forEach(([name, src], i) => { const [x1, y1] = outPt(src); const y = H / 2 + (i - (c.outs.length - 1) / 2) * 70; wire(x1, y1, W - 60, y, vals[src]);
    s += `<circle cx="${W - 44}" cy="${y}" r="15" fill="${vals[src] ? "#f5c451" : "#1c1430"}" stroke="${vals[src] ? "#fff" : "#6b6488"}" stroke-width="1.5"${vals[src] ? ' style="filter:drop-shadow(0 0 8px #f5c451)"' : ""}/>
      <text x="${W - 44}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="600" font-family="IBM Plex Mono,monospace" fill="${vals[src] ? "#1a1024" : "#cfc9e4"}">${vals[src]}</text>
      <text x="${W - 44}" y="${y + 30}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#9d96b8">${name}</text>`; });
  for (const [id] of c.gates) { const p = pos[id], v = vals[id];
    s += `<path d="M${p.x - 16} ${p.y - 14} h14 a14 14 0 0 1 0 28 h-14 z" fill="${v ? "rgba(245,196,81,.22)" : "#1c1430"}" stroke="#cfc9e4" stroke-width="1.4"/>
      <circle cx="${p.x + 16.5}" cy="${p.y}" r="3.6" fill="#1c1430" stroke="#cfc9e4" stroke-width="1.4"/>
      <text x="${p.x - 5}" y="${p.y + 3.5}" text-anchor="middle" font-size="8.5" font-family="IBM Plex Mono,monospace" fill="#9d96b8">&amp;</text>`; }
  c.ins.forEach(id => { const p = pos[id], v = vals[id];
    s += `<g class="cpu-in" data-in="${id}"><rect x="${p.x - 24}" y="${p.y - 15}" width="38" height="30" rx="7" fill="${v ? "#f5c451" : "#1c1430"}" stroke="${v ? "#fff" : "#6b6488"}" stroke-width="1.5"/>
      <text x="${p.x - 5}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-weight="600" font-family="IBM Plex Mono,monospace" fill="${v ? "#1a1024" : "#cfc9e4"}">${v}</text>
      <text x="${p.x - 5}" y="${p.y - 21}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#9d96b8">${id}</text></g>`; });
  svg.innerHTML = s;
}
function cpuDraw() {
  const root = $("atom-cpu"); if (!root || root.hidden) return;
  const q = s => root.querySelector(s);
  root.querySelectorAll(".cpu-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === CPU.tab));
  root.querySelectorAll(".cpu-pane").forEach(p => p.hidden = p.dataset.p !== CPU.tab);
  if (CPU.tab === "gates") {
    const c = CIRC[CPU.circ]; root.querySelectorAll(".cpu-circs .a2-chip").forEach(b => b.classList.toggle("on", b.dataset.c === CPU.circ));
    const inVals = Object.fromEntries(c.ins.map(i => [i, CPU.ins[i] || 0])), vals = evalCirc(c, inVals);
    drawCircuit(q(".cpu-circ"), c, vals);
    q(".cpu-cnote").innerHTML = c.note + " Click an input to flip it.";
    const rows = []; const n = c.ins.length;
    for (let r = 0; r < (1 << n); r++) { const iv = {}; c.ins.forEach((id, i) => iv[id] = (r >> (n - 1 - i)) & 1); const v = evalCirc(c, iv); rows.push({ iv, v, key: c.ins.map(i => iv[i]).join("") }); }
    const cur = c.ins.map(i => inVals[i]).join("");
    q(".cpu-tt").innerHTML = `<tr>${c.ins.map(i => `<th>${i}</th>`).join("")}${c.outs.map(o => `<th>${o[0]}</th>`).join("")}</tr>` +
      rows.map(r => `<tr data-r="${r.key}" class="${r.key === cur ? "on" : ""}" style="cursor:pointer">${c.ins.map(i => `<td>${r.iv[i]}</td>`).join("")}${c.outs.map(o => `<td>${r.v[o[1]]}</td>`).join("")}</tr>`).join("");
    q(".cpu-gcount").innerHTML = `NAND gates used: <span class="g">${c.gates.length}</span>\n<span class="d">A modern CPU has billions of transistors; a CMOS NAND takes 4.</span>`;
  } else if (CPU.tab === "alu") {
    const drawBits = (el, arr, ro) => { el.innerHTML = arr.map((v, i) => `<button class="cpu-bit${v ? " on" : ""}${ro ? " ro" : ""}" data-i="${i}" ${ro ? "tabindex=-1" : ""}>${v}</button>`).join(""); };
    const num = arr => arr.reduce((s, v) => s * 2 + v, 0), sgn = n => n > 7 ? n - 16 : n;
    drawBits(q(".cpu-A"), CPU.A); drawBits(q(".cpu-B"), CPU.B);
    const a = num(CPU.A), b = num(CPU.B);
    q(".cpu-Ad").textContent = `= ${a} (signed ${sgn(a)})`; q(".cpu-Bd").textContent = `= ${b} (signed ${sgn(b)})`;
    root.querySelectorAll(".cpu-ops .a2-chip").forEach(x => x.classList.toggle("on", x.dataset.o === CPU.op));
    const R = [0, 0, 0, 0], carries = [0, 0, 0, 0, 0]; let nands;
    if (CPU.op === "ADD" || CPU.op === "SUB") {
      const sub = CPU.op === "SUB"; carries[4] = sub ? 1 : 0;
      for (let i = 3; i >= 0; i--) { const bb = sub ? gXOR(CPU.B[i], 1) : CPU.B[i]; const [s, co] = FA(CPU.A[i], bb, carries[i + 1]); R[i] = s; carries[i] = co; }
      nands = 36 + (sub ? 16 : 0);
    } else { const f = { AND: gAND, OR: gOR, XOR: gXOR }[CPU.op]; for (let i = 0; i < 4; i++) R[i] = f(CPU.A[i], CPU.B[i]); nands = 4 * { AND: 2, OR: 3, XOR: 4 }[CPU.op]; }
    drawBits(q(".cpu-R"), R, true);
    const r = num(R), C = carries[0], Z = r === 0 ? 1 : 0, N = R[0], arith = CPU.op === "ADD" || CPU.op === "SUB";
    const V = arith ? (CPU.op === "ADD" ? (CPU.A[0] === CPU.B[0] && R[0] !== CPU.A[0]) : (CPU.A[0] !== CPU.B[0] && R[0] !== CPU.A[0])) ? 1 : 0 : 0;
    q(".cpu-Rd").textContent = `= ${r} (signed ${sgn(r)})`;
    const fl = (n, v, t) => `<span class="cpu-flag${v ? " on" : ""}" title="${t}">${n} ${v}</span>`;
    q(".cpu-flags").innerHTML = fl("C", arith ? C : 0, "carry out of the top bit") + fl("Z", Z, "result is zero") + fl("N", N, "top bit set: negative if signed") + fl("V", V, "signed overflow");
    q(".cpu-acount").innerHTML = `NAND gates for this operation: <span class="g">${nands}</span>`;
    q(".cpu-fa").innerHTML = arith ? [0, 1, 2, 3].map(i => `<div class="cpu-fab">bit ${3 - i}<br>${CPU.A[i]} + ${CPU.op === "SUB" ? `¬${CPU.B[i]}` : CPU.B[i]} + <span class="cin${carries[i + 1] ? " on" : ""}">c${carries[i + 1]}</span><br>= <b>${R[i]}</b> · carry <span class="cin${carries[i] ? " on" : ""}">${carries[i]}</span></div>`).join("")
      : `<div class="cpu-fab" style="grid-column:1/-1">Bitwise ${CPU.op}: each bit is one ${CPU.op} gate on its own; no carries travel between bits.</div>`;
    const notes = {
      ADD: `Each full adder passes its carry to the next, like carrying a 1 in school addition. Try 0111 + 0001 (7 + 1): the carry ripples through every bit${V ? ", and here the signed result overflows" : ""}.`,
      SUB: `Subtraction reuses the adder: A − B = A + (NOT B) + 1, which is two's complement. The XOR gates invert B and the first carry-in is 1. There is no separate subtractor.`,
      AND: "AND keeps only the bits set in both: a mask.", OR: "OR sets any bit set in either.", XOR: "XOR flips the bits of A wherever B has a 1; it's also the sum bit without the carries.",
    };
    q(".cpu-anote").innerHTML = notes[CPU.op];
  } else {
    root.querySelectorAll(".cpu-progs .a2-chip").forEach(b => b.classList.toggle("on", b.dataset.g === CPU.prog));
    const M = CPU.M, mem = q(".cpu-mem"), focused = document.activeElement && mem.contains(document.activeElement) ? +document.activeElement.dataset.a : -1;
    mem.innerHTML = M.mem.map((v, i) => `<tr class="${i === M.pc ? "pc" : ""}${i === CPU.lastW ? " wr" : ""}"><td class="ad">${i}</td>
      <td class="bits"><span class="hi">${bits(v).slice(0, 4)}</span> <span class="lo">${bits(v).slice(4)}</span></td>
      <td><input data-a="${i}" value="${esc(CPU.src[i] || "")}" placeholder="0" spellcheck="false" aria-label="memory ${i}"></td>
      <td class="as">${v ? `${dis(v)} · ${v}` : "0"}</td></tr>`).join("");
    if (focused >= 0) { const inp = mem.querySelector(`input[data-a="${focused}"]`); if (inp) inp.focus(); }
    q(".cpu-out").textContent = M.out.length ? M.out[M.out.length - 1] : "–";
    q(".cpu-log").textContent = M.out.length ? "printed: " + M.out.join(", ") : "";
    q(".cpu-regs").innerHTML = `<div class="cpu-reg">PC · program counter<b>${M.pc} · ${bits(M.pc, 4)}</b></div><div class="cpu-reg">A · accumulator<b>${M.a} · ${bits(M.a)}</b></div>
      <div class="cpu-reg">IR · instruction<b>${bits(M.ir)} ${dis(M.ir)}</b></div><div class="cpu-reg">flags · steps ${M.steps}<b><span class="cpu-flag${M.c ? " on" : ""}">C</span><span class="cpu-flag${M.z ? " on" : ""}">Z</span>${M.halted ? " halted" : ""}</b></div>`;
    q(".cpu-phase").innerHTML = CPU.phase.replace(/\n/g, "<br>");
    q(".cpu-about").innerHTML = PROGS[CPU.prog].about + " Notice that instructions are just numbers: the right-hand column shows each byte read both ways.";
  }
}
function cpuStart() { cpuDraw(); }
function cpuStop() { cpuRun(false); }
window.WOC_CPU = { CPU, cpuLoad, cpuReset, cpuStep, asm, FA, CIRC, evalCirc };

/* ============================================================
   3) GAME OF LIFE & ELEMENTARY CELLULAR AUTOMATA
   ============================================================ */
const LW = 96, LH = 60;
const LIFE = { tab:"life", g:new Uint8Array(LW * LH), age:new Uint16Array(LW * LH), gen:0, running:false, timer:0, speed:12, paint:-1,
  rule:110, start:"single", rows:null };
const PAT = {
  glider:  { name:"glider", rle:"bo$2bo$3o!", about:"The glider (Richard Guy, 1970): five cells that crawl diagonally, one cell every four generations." },
  lwss:    { name:"spaceship", rle:"bo2bo$o4b$o3bo$4o!", about:"A lightweight spaceship: it flies horizontally, two cells every four generations." },
  pulsar:  { name:"pulsar", rle:"2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!", about:"The pulsar, an oscillator with period 3." },
  gun:     { name:"glider gun", rle:"24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!", at:[3, 3],
    about:"Bill Gosper's glider gun (1970) fires a glider every 30 generations. It won Conway's $50 prize by showing a finite pattern can grow forever. Streams of gliders can carry bits, which is how computers are built inside Life. This board wraps around, so the gliders eventually come back and wreck the gun." },
  rpent:   { name:"R-pentomino", rle:"b2o$2o$bo!", about:"Five cells that take 1,103 generations to settle, throwing off gliders on the way." },
  acorn:   { name:"acorn", rle:"bo5b$3bo3b$2o2b3o!", about:"Seven cells that grow for 5,206 generations. The board here wraps around at the edges, so the ending differs from an infinite board." },
};
function rle(r) { const cells = []; let x = 0, y = 0, n = "";
  for (const ch of r) { if (/\d/.test(ch)) { n += ch; continue; } const k = n ? +n : 1; n = "";
    if (ch === "b") x += k; else if (ch === "o") { for (let i = 0; i < k; i++) cells.push([x++, y]); } else if (ch === "$") { y += k; x = 0; } else if (ch === "!") break; }
  return cells; }
function lifeStep() {
  const g = LIFE.g, n = new Uint8Array(LW * LH), age = LIFE.age;
  for (let y = 0; y < LH; y++) { const ym = ((y - 1 + LH) % LH) * LW, y0 = y * LW, yp = ((y + 1) % LH) * LW;
    for (let x = 0; x < LW; x++) { const xm = (x - 1 + LW) % LW, xp = (x + 1) % LW;
      const s = g[ym + xm] + g[ym + x] + g[ym + xp] + g[y0 + xm] + g[y0 + xp] + g[yp + xm] + g[yp + x] + g[yp + xp];
      const a = g[y0 + x]; n[y0 + x] = (a && (s === 2 || s === 3)) || (!a && s === 3) ? 1 : 0; } }
  for (let i = 0; i < n.length; i++) age[i] = n[i] ? (g[i] ? Math.min(age[i] + 1, 999) : 1) : 0;
  LIFE.g = n; LIFE.gen++;
}
function lifePlace(key, cx, cy) {
  const cells = rle(PAT[key].rle), w = Math.max(...cells.map(c => c[0])) + 1, h = Math.max(...cells.map(c => c[1])) + 1;
  const [ox, oy] = PAT[key].at || [Math.round((cx === undefined ? LW / 2 : cx) - w / 2), Math.round((cy === undefined ? LH / 2 : cy) - h / 2)];
  for (const [x, y] of cells) { const i = ((y + oy + LH) % LH) * LW + (x + ox + LW) % LW; LIFE.g[i] = 1; LIFE.age[i] = 1; }
}
function eca(rule, row) { const W = row.length, n = new Uint8Array(W);
  for (let i = 0; i < W; i++) { const k = (row[(i - 1 + W) % W] << 2) | (row[i] << 1) | row[(i + 1) % W]; n[i] = (rule >> k) & 1; } return n; }
const ECA_ABOUT = {
  30: "Rule 30: from one cell, chaos. The centre column looks random enough that Wolfram used it as a random-number generator in Mathematica.",
  90: "Rule 90: each cell is the XOR of its two neighbours, and one cell grows into Sierpiński's triangle, which is Pascal's triangle mod 2.",
  110: "Rule 110: structures crawl and collide on a regular background. Matthew Cook proved it can simulate any Turing machine (published 2004), so one row of cells and an 8-entry rule are enough for universal computation.",
  184: "Rule 184: a model of traffic. Each 1 is a car that moves right if the space ahead is empty, so jams form and drift backwards. Try a random start.",
  54: "Rule 54: gliders on a periodic background, another candidate for universality.",
};
const LIFE_HTML = `
  <h3>Life & Rule 110 · 1970 / 1983 — computation from simple local rules</h3>
  <p class="ahint">No program and no processor: just cells that look at their neighbours and follow one fixed rule. Some of these rules can compute anything a computer can.</p>
  <div class="a2-sub life-tabs"><button data-t="life">Conway's Game of Life</button><button data-t="eca">Rule 110 and the 256 rules</button></div>
  <div class="life-pane" data-p="life">
    <div class="a2-row life-pats">${Object.entries(PAT).map(([k, p]) => `<button class="a2-chip" data-p="${k}">+ ${p.name}</button>`).join("")}
      <button class="a2-chip" data-p="random">random soup</button></div>
    <canvas class="a2-cv life-cv" aria-label="Game of Life board; click or drag to draw cells"></canvas>
    <div class="a2-row"><button class="abtn life-play">▶ run</button><button class="abtn life-step">step</button><button class="abtn life-clear">clear</button>
      <span class="a2-mono">speed</span><select class="life-speed"><option value="4">slow</option><option value="12" selected>medium</option><option value="30">fast</option><option value="60">max</option></select>
      <span class="a2-mono life-stat"></span></div>
    <p class="a2-note life-note">Draw on the board with the mouse or a finger, or drop in a pattern. The rules: a live cell with 2 or 3 live neighbours survives; a dead cell with exactly 3 comes alive; everything else dies or stays empty. New cells are teal and older ones turn gold.</p>
  </div>
  <div class="life-pane" data-p="eca" hidden>
    <div class="a2-row"><span class="a2-mono">rule</span><input type="number" class="eca-num" min="0" max="255" value="110">
      ${[30, 90, 110, 184, 54].map(r => `<button class="a2-chip" data-r="${r}">${r}</button>`).join("")}
      <span class="a2-mono" style="margin-left:.6rem">start</span><select class="eca-start"><option value="single">one cell</option><option value="random">random</option></select></div>
    <div class="a2-lbl">The whole rule: each 3-cell neighbourhood (top) decides the cell below. Click to flip an output.</div>
    <div class="eca-rule"></div>
    <canvas class="a2-cv eca-cv" aria-label="space-time diagram"></canvas>
    <p class="a2-note eca-note"></p>
  </div>
  <p class="a2-why">John Conway devised Life in 1970, and Martin Gardner's October 1970 <i>Scientific American</i> column made it famous. Berlekamp, Conway and Guy sketched why it is Turing-complete in <i>Winning Ways</i> (1982), and Paul Rendell built a working Turing machine in it in 2000. The idea goes back to von Neumann, who designed a 29-state cellular automaton that could build a copy of itself (published by Burks in 1966). Stephen Wolfram catalogued the 256 one-dimensional rules in 1983.</p>`;

function lifeBuild(root) {
  const q = s => root.querySelector(s);
  root.querySelectorAll(".life-tabs button").forEach(b => b.addEventListener("click", () => { LIFE.tab = b.dataset.t; lifeRun(false); lifeDraw(); }));
  root.querySelectorAll(".life-pats .a2-chip").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.p;
    if (k === "random") { const r = mulberry((Math.random() * 1e9) | 0); for (let i = 0; i < LIFE.g.length; i++) { LIFE.g[i] = r() < .28 ? 1 : 0; LIFE.age[i] = LIFE.g[i]; } LIFE.gen = 0; q(".life-note").textContent = "A random soup settles into still lifes, blinkers and escaping gliders. The most common objects in random soups are the block, the blinker and the beehive."; }
    else { lifePlace(k); q(".life-note").textContent = PAT[k].about; }
    lifeDraw();
  }));
  q(".life-play").addEventListener("click", () => lifeRun(!LIFE.running));
  q(".life-step").addEventListener("click", () => { lifeRun(false); lifeStep(); lifeDraw(); });
  q(".life-clear").addEventListener("click", () => { lifeRun(false); LIFE.g.fill(0); LIFE.age.fill(0); LIFE.gen = 0; lifeDraw(); });
  q(".life-speed").addEventListener("change", e => { LIFE.speed = +e.target.value; if (LIFE.running) { lifeRun(false); lifeRun(true); } });
  const cv = q(".life-cv");
  const cellAt = e => { const r = cv.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) / r.width * LW), Math.floor((e.clientY - r.top) / r.height * LH)]; };
  const paint = (x, y) => { if (x < 0 || y < 0 || x >= LW || y >= LH) return; const i = y * LW + x; LIFE.g[i] = LIFE.paint; LIFE.age[i] = LIFE.paint; lifeDraw(); };
  cv.addEventListener("pointerdown", e => { const [x, y] = cellAt(e); if (x < 0 || y < 0 || x >= LW || y >= LH) return; LIFE.paint = LIFE.g[y * LW + x] ? 0 : 1; cv.setPointerCapture(e.pointerId); paint(x, y); });
  cv.addEventListener("pointermove", e => { if (LIFE.paint < 0) return; const [x, y] = cellAt(e); paint(x, y); });
  const up = () => { LIFE.paint = -1; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  // ECA
  q(".eca-num").addEventListener("input", e => { const v = Math.max(0, Math.min(255, Math.floor(+e.target.value || 0))); LIFE.rule = v; lifeDraw(); });
  root.querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => { LIFE.rule = +b.dataset.r; if (LIFE.rule === 184) LIFE.start = "random"; q(".eca-start").value = LIFE.start; lifeDraw(); }));
  q(".eca-start").addEventListener("change", e => { LIFE.start = e.target.value; lifeDraw(); });
  q(".eca-rule").addEventListener("click", e => { const c = e.target.closest("[data-k]"); if (c) { LIFE.rule ^= 1 << +c.dataset.k; lifeDraw(); } });
  lifePlace("gun");
}
function lifeRun(on) {
  LIFE.running = on; clearInterval(LIFE.timer);
  const b = $("atom-life") && $("atom-life").querySelector(".life-play"); if (b) b.textContent = on ? "⏸ pause" : "▶ run";
  if (on) LIFE.timer = setInterval(() => { lifeStep(); lifeDraw(); }, 1000 / LIFE.speed);
}
function lifeDraw() {
  const root = $("atom-life"); if (!root || root.hidden) return;
  const q = s => root.querySelector(s);
  root.querySelectorAll(".life-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === LIFE.tab));
  root.querySelectorAll(".life-pane").forEach(p => p.hidden = p.dataset.p !== LIFE.tab);
  if (LIFE.tab === "life") {
    const cv = q(".life-cv"), w = cv.clientWidth || 640, h = Math.round(w * LH / LW), ctx = hidpi(cv, w, h), cs = w / LW;
    ctx.fillStyle = "#120b22"; ctx.fillRect(0, 0, w, h);
    if (cs > 5) { ctx.strokeStyle = "rgba(255,255,255,.045)"; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = 1; x < LW; x++) { ctx.moveTo(x * cs, 0); ctx.lineTo(x * cs, h); } for (let y = 1; y < LH; y++) { ctx.moveTo(0, y * cs); ctx.lineTo(w, y * cs); } ctx.stroke(); }
    let pop = 0;
    for (let i = 0; i < LIFE.g.length; i++) if (LIFE.g[i]) { pop++; const a = LIFE.age[i], x = i % LW, y = (i / LW) | 0;
      ctx.fillStyle = a <= 1 ? "#7fe3d6" : a < 8 ? "#c9e08a" : "#f5c451"; ctx.fillRect(x * cs + .5, y * cs + .5, cs - 1, cs - 1); }
    q(".life-stat").textContent = `generation ${LIFE.gen} · ${pop} alive`;
  } else {
    q(".eca-num").value = LIFE.rule;
    root.querySelectorAll("[data-r]").forEach(b => b.classList.toggle("on", +b.dataset.r === LIFE.rule));
    q(".eca-rule").innerHTML = [7, 6, 5, 4, 3, 2, 1, 0].map(k => `<div class="eca-cell" data-k="${k}" title="neighbourhood ${bits(k, 3)} → ${(LIFE.rule >> k) & 1}">
      <span>${bits(k, 3).split("").map(b => `<i class="${b === "1" ? "on" : ""}"></i>`).join("")}</span><span class="res"><i class="${(LIFE.rule >> k) & 1 ? "on" : ""}"></i></span></div>`).join("");
    const cv = q(".eca-cv"), w = cv.clientWidth || 640, cs = 2, W = Math.floor(w / cs), rows = 170, ctx = hidpi(cv, w, rows * cs);
    ctx.fillStyle = "#120b22"; ctx.fillRect(0, 0, w, rows * cs);
    let row = new Uint8Array(W);
    if (LIFE.start === "random") { const r = mulberry(LIFE.rule * 7919 + 1); for (let i = 0; i < W; i++) row[i] = r() < .5 ? 1 : 0; }
    else row[LIFE.rule === 110 ? W - 8 : Math.floor(W / 2)] = 1;
    ctx.fillStyle = "#f5c451";
    for (let t = 0; t < rows; t++) { for (let i = 0; i < W; i++) if (row[i]) ctx.fillRect(i * cs, t * cs, cs, cs); row = eca(LIFE.rule, row); }
    q(".eca-note").textContent = ECA_ABOUT[LIFE.rule] || `Rule ${LIFE.rule} = ${bits(LIFE.rule)}₂: the eight output bits above, read from left to right. Wolfram sorted the 256 rules into four classes: dying out, repeating, chaotic, and complex.`;
  }
}
function lifeStart() { lifeDraw(); }
function lifeStop() { lifeRun(false); }
window.WOC_LIFE = { LIFE, lifeStep, lifePlace, rle, eca };

/* ============================================================
   Register all three
   ============================================================ */
register({ id:"nn", name:"Neural-net playground", cls:"a2-nn", fields:["prehistory", "deep"], html:NN_HTML, build:nnBuild, start:nnStart, stop:nnStop });
register({ id:"cpu", name:"NAND → CPU", cls:"a2-cpu", fields:["stored", "wartime"], html:CPU_HTML, build:cpuBuild, start:cpuStart, stop:cpuStop });
register({ id:"life", name:"Life & Rule 110", cls:"a2-life", fields:["computability", "automata"], html:LIFE_HTML, build:lifeBuild, start:lifeStart, stop:lifeStop });
window.addEventListener("resize", () => { if (!$("atom-nn").hidden) { nnLayout(); nnDraw(); } if (!$("atom-life").hidden) lifeDraw(); });
})();
