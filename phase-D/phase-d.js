/* ============================================================
   THE WEB OF COMPUTATION — phase-d.js
   (PHASE D: the contested sky — comets, disputes, frontier fog)
   ------------------------------------------------------------
   Self-injecting, zero dependencies, cannot break Phase B/C.
   Integration = one script tag after app.js (and atoms.js).

   Three layers:
     ☄  RESEARCH COMETS — Abhishek's own papers as comet nodes,
        orbiting their parent concepts on the SVG sky. This is
        the "Abhishek layer": the map stops being a museum and
        becomes a lab notebook.
     ⚡ DISPUTES — the field's great fights as red-lightning
        cards: Minsky v Rosenblatt, symbolic v connectionist,
        Chomsky v LLMs, the attribution wars, the Lighthill
        winter, Bayesians v frequentists.
     🌫 FRONTIER FOG — 2024–26, deliberately hazy, marked
        "under observation". Frontier nodes go stale fast;
        this region admits it.

   Tunables live at the top: COMETS[].anchor are coordinates in
   the map's 1600×1000 viewBox — nudge them to sit beside the
   right field nodes on your deployed map.

   Public API:
     window.openContestedSky(tab)   — "comets" | "disputes" | "fog"
     window.openComet(cometId)      — jump straight to one paper
   ============================================================ */
(function () {
"use strict";

/* ============================================================
   DATA — edit freely; this is the part meant to grow with you
   ============================================================ */

const COMETS = [
  {
    id: "pikan", tag: "☄ PIKAN", year: "2026 · near submission",
    title: "Physics-informed Kolmogorov–Arnold networks for cosmic expansion",
    anchor: { x: 1180, y: 400 },            // ← nudge to sit by KAN / PINN nodes
    parents: "Kolmogorov–Arnold theorem → KANs → PINNs",
    story: `A structurally monotonic PIKAN reconstructs the expansion history E(z)
      directly from Pantheon+ supernovae (N=1580), cosmic chronometers, and DESI DR2
      BAO. The headline is a controlled failure: trained on SN+CC alone the
      reconstruction breaks decisively against BAO (a &gt;12σ Lyα pull) — and joint
      training repairs it, landing H₀ ≈ 67.9 km/s/Mpc with 100% monotonicity across
      50 seeds. A 1957 representation theorem, wearing 2026 clothes, doing cosmology.`,
    thread: `Why it lives here: KANs exist because of a pure-math theorem — the same
      Kolmogorov–Arnold result this map files under approximation theory.`
  },
  {
    id: "phantom-sbi", tag: "☄ Phantom-SBI", year: "2026 · phase 3 of 4",
    title: "Simulation-based inference for evolving dark energy",
    anchor: { x: 1020, y: 610 },            // ← nudge to sit by SBI / normalizing flows
    parents: "Bayes → normalizing flows → neural posterior estimation",
    story: `Nine dark-energy models fight over DESI DR2 BAO + compressed Planck CMB.
      The fit says evolving dark energy (Δχ² ≈ 8.6); the Bayesian evidence shrugs
      (|ΔlnZ| &lt; 1, inconclusive) — and that tension between fit and evidence is
      the whole point. Phase 3 calibrates the machinery itself: train an NPE flow,
      then interrogate it with SBC and TARP until you know its false-positive rate
      before you let it near real data.`,
    thread: `Why it lives here: this is the map's 'probabilistic ML' continent doing
      real work — flows as posteriors, calibration as the price of trusting them.`
  },
  {
    id: "ztf-periods", tag: "☄ ZTF periods", year: "2026 · write-up",
    title: "When classical methods beat deep learning: period recovery at real cadence",
    anchor: { x: 760, y: 700 },             // ← nudge to sit by classical-ML / spectral
    parents: "Fourier → Lomb–Scargle → the classical-vs-deep question",
    story: `A cautionary tale the deep-learning continent needs: at genuine ZTF
      sampling, a 1976-vintage Lomb–Scargle periodogram solves the period-recovery
      problem, and the neural pipeline's apparent wins dissolve into a cadence
      lock-in artifact — the network memorising the survey's observing rhythm, not
      the stars. The write-up frames it as a conditional recoverability result:
      when ML is ruled out, rule it out *rigorously*.`,
    thread: `Why it lives here: it's the map's 🪦/🧟 status system as lived
      experience — sometimes the 'obsolete' tool is the right one.`
  },
  {
    id: "grt-qpp", tag: "☄ Ramanujan transform", year: "long-running thread",
    title: "Generalized Ramanujan Transform for quasi-periodic pulsations",
    anchor: { x: 640, y: 770 },             // ← nudge to sit by signal-processing
    parents: "Ramanujan sums (1918) → GRT → solar flare time series",
    story: `Ramanujan's arithmetical sums c_q(n), repurposed a century later as a
      period-detection basis for solar flare pulsations across GOES, AIA, Fermi/GBM
      — including first applications to Aditya-L1 HEL1OS data. The oldest
      mathematics on this map (older than the map: 1918 predates Babbage's node
      only in spirit) meeting India's newest solar observatory.`,
    thread: `Why it lives here: the gold bridge from pure number theory into signal
      processing, made personal.`
  }
];

const DISPUTES = [
  {
    id: "minsky", sides: ["Minsky & Papert", "Rosenblatt"], year: "1969",
    heat: "resolved — both were right",
    story: `Perceptrons (1969) proved a single-layer perceptron cannot compute XOR
      — mathematically airtight, and it helped freeze neural-network funding for a
      decade. Rosenblatt drowned in 1971, before multilayer networks plus backprop
      (1986) dissolved the objection. The theorem was correct; the inference drawn
      from it was not. You can replay this entire fight in the Perceptron atom.`,
    verdict: "The proof stood; the pessimism didn't. 🧟"
  },
  {
    id: "symbolic", sides: ["Symbolic AI (GOFAI)", "Connectionism"], year: "1956 → ongoing",
    heat: "connectionists hold the field; hybrids returning",
    story: `Forty years of civil war over whether intelligence is rules and symbols
      (McCarthy, Newell & Simon, expert systems) or weights and gradients (Rosenblatt,
      Rumelhart, Hinton). The deep-learning decade settled the practical question —
      then LLMs blurred it, since a transformer trained on text ends up doing
      strangely symbolic-looking things. Neurosymbolic hybrids are the current
      peace negotiations.`,
    verdict: "Won by connectionism on points; symbols keep filing appeals."
  },
  {
    id: "chomsky", sides: ["Chomsky & the linguists", "the LLM builders"], year: "2023 → ongoing",
    heat: "🔥 open",
    story: `Chomsky's charge: LLMs are stochastic pattern-matchers that learn
      impossible languages as easily as real ones, so they explain nothing about
      the human faculty. The reply: models acquire grammatical structure from raw
      text at scales that at least pressure the poverty-of-the-stimulus argument,
      and probing finds genuine syntax inside. Both camps claim the attention
      atom's little grammar head as evidence.`,
    verdict: "Unresolved — the map keeps this edge red on purpose."
  },
  {
    id: "schmidhuber", sides: ["Schmidhuber", "'the deep learning conspiracy'"], year: "1991 → forever",
    heat: "cultural, perennial",
    story: `The attribution wars: LSTM (Hochreiter & Schmidhuber, 1997) is
      undisputed, but Schmidhuber also claims priority threads for GAN-style
      adversarial training (his 1990s artificial-curiosity work), very deep
      learning (Ivakhnenko 1965!), and more — pressed loudly enough at conferences
      to become its own genre. Credit in science is a graph, not a point; this map
      literally agrees.`,
    verdict: "Everyone cites; nobody concedes."
  },
  {
    id: "lighthill", sides: ["Sir James Lighthill", "the AI establishment"], year: "1973",
    heat: "resolved — the winters were real",
    story: `The Lighthill Report told the UK government that AI's grand promises
      had failed against combinatorial explosion, and funding collapsed — the
      televised Lighthill–McCarthy debate is the field's first great public
      reckoning. The pattern he named (promise, hype, disappointment, winter) has
      since repeated once more in full, which is why this map has two literal
      winters on its timeline.`,
    verdict: "The critique aged well; the timing of the thaw surprised everyone."
  },
  {
    id: "bayes", sides: ["Bayesians", "Frequentists"], year: "1763 → armistice",
    heat: "productive stalemate",
    story: `Statistics' oldest fight runs straight through modern ML: is probability
      a degree of belief (priors, posteriors, evidence) or long-run frequency
      (p-values, coverage, calibration)? Simulation-based inference is where the
      armistice gets signed daily — Bayesian machinery (neural posteriors) held to
      frequentist standards (coverage tests, false-positive rates). One comet on
      this map is doing exactly that right now.`,
    verdict: "Modern practice: pray Bayesian, audit frequentist."
  }
];

const FOG = [
  { t: "Inference-time reasoning", n: "Models that 'think longer' on hard problems — a new scaling axis whose limits are genuinely unknown." },
  { t: "Agents", n: "LLMs given tools, memory, and goals. Demos dazzle; reliability numbers lag. History has not voted." },
  { t: "State-space models", n: "Mamba and kin: sub-quadratic challengers to attention. Coexistence or succession — unclear." },
  { t: "Mechanistic interpretability", n: "Opening the black box circuit by circuit. Young enough that its central claims are still under construction." },
  { t: "World models", n: "Video-and-simulation-native models that predict environments, not just text. Promising, unproven at scale." },
  { t: "The data wall", n: "Whether high-quality text runs out before compute does — an empirical question with an expiry date." },
  { t: "AI for science", n: "SBI, weather emulators, protein and materials models. The comets on this map live here; so does its author." }
];

/* ============================================================
   CSS
   ============================================================ */
const css = `
#csky-launch{position:fixed;right:18px;bottom:136px;z-index:60;
  font-family:"IBM Plex Mono",monospace;font-size:12.5px;letter-spacing:.04em;
  color:#eaf0ff;background:linear-gradient(135deg,rgba(255,93,108,.9),rgba(160,60,120,.9));
  border:none;border-radius:999px;padding:10px 16px;cursor:pointer;
  box-shadow:0 0 18px rgba(255,93,108,.4),0 4px 14px rgba(0,0,0,.5);
  transition:transform .18s ease}
#csky-launch:hover{transform:translateY(-2px)}
#csky{position:fixed;inset:0;z-index:71;display:flex;align-items:center;justify-content:center;
  background:rgba(4,7,16,.74);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
#csky[hidden]{display:none}
#csky .shell{width:min(880px,94vw);max-height:92vh;overflow:auto;position:relative;
  background:linear-gradient(160deg,rgba(20,16,34,.97),rgba(10,9,22,.97));
  border:1px solid rgba(255,93,108,.25);border-radius:18px;
  box-shadow:0 0 60px rgba(255,93,108,.10),0 24px 60px rgba(0,0,0,.6);
  padding:22px 26px 26px;color:#dfe6f5}
#csky h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:24px;margin:0 0 2px;color:#f3ecdc}
#csky .sub{font-family:"IBM Plex Mono",monospace;font-size:11.5px;color:#8fa0c9;margin:0 0 14px}
#csky .tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
#csky .csky-tab{font-family:"IBM Plex Mono",monospace;font-size:11.5px;color:#aab6d8;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);
  border-radius:999px;padding:6px 13px;cursor:pointer;transition:all .15s}
#csky .csky-tab:hover{border-color:rgba(255,93,108,.6);color:#ff8f9c}
#csky .csky-tab.on{background:rgba(255,93,108,.15);border-color:#ff5d6c;color:#ff8f9c}
#csky-close{position:absolute;top:14px;right:14px;font-size:18px;color:#8fa0c9;
  background:none;border:none;cursor:pointer;padding:4px 8px}
#csky-close:hover{color:#ff8f9c}
#csky .pane[hidden]{display:none}
#csky .card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.09);
  border-radius:14px;padding:16px 18px;margin:0 0 14px}
#csky .card h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:17px;margin:0 0 2px;color:#f3ecdc}
#csky .meta{font-family:"IBM Plex Mono",monospace;font-size:11px;color:#8fa0c9;margin:0 0 8px}
#csky .meta .hot{color:#ff8f9c}
#csky .meta .gold{color:#f5c86b}
#csky p.body{font-family:Spectral,Georgia,serif;font-size:14px;line-height:1.55;color:#c4cde4;margin:0 0 8px}
#csky .verdict{font-family:"IBM Plex Mono",monospace;font-size:11.5px;color:#9fe8c0;
  border-top:1px dashed rgba(255,255,255,.14);padding-top:8px}
#csky .thread{font-family:Spectral,Georgia,serif;font-style:italic;font-size:13px;color:#a9b6da}
#csky .vs{display:flex;align-items:center;gap:10px;margin:0 0 8px;font-family:Fraunces,Georgia,serif;font-size:15px;color:#f3ecdc}
#csky .vs .bolt{color:#ff5d6c;text-shadow:0 0 10px rgba(255,93,108,.8);font-size:18px}
#csky .comet-card{border-color:rgba(245,200,107,.28)}
#csky .comet-card h3{color:#f5e6c0}
#csky .fog-item{opacity:.85}
#csky .fog-item h3{color:#cfd6ea;filter:blur(.2px)}
#csky .fogband{font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.14em;
  color:#8fa0c9;text-transform:uppercase;margin:2px 0 14px}
/* --- comets drawn on the map SVG --- */
.comet-head{cursor:pointer}
.comet-label{font-family:"IBM Plex Mono",monospace;font-size:13px;fill:#f5c86b;
  paint-order:stroke;stroke:#05070f;stroke-width:3px;cursor:pointer;opacity:.92}
@media (prefers-reduced-motion: reduce){
  #csky *,#csky-launch{transition:none !important;animation:none !important}}
`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

/* ============================================================
   OVERLAY SHELL
   ============================================================ */
const wrap = document.createElement("div");
wrap.id = "csky"; wrap.hidden = true;
wrap.innerHTML = `
<div class="shell" role="dialog" aria-label="The contested sky">
  <button id="csky-close" aria-label="Close">✕</button>
  <h2>The contested sky</h2>
  <p class="sub">your research, the field's fights, and the fog where history hasn't settled</p>
  <div class="tabs">
    <button class="csky-tab" data-tab="comets">☄ research comets</button>
    <button class="csky-tab" data-tab="disputes">⚡ disputes</button>
    <button class="csky-tab" data-tab="fog">🌫 frontier fog</button>
  </div>
  <section class="pane" id="csky-comets" hidden></section>
  <section class="pane" id="csky-disputes" hidden></section>
  <section class="pane" id="csky-fog" hidden></section>
</div>`;
document.body.appendChild(wrap);

const launch = document.createElement("button");
launch.id = "csky-launch";
launch.textContent = "☄ contested sky";
document.body.appendChild(launch);

const $ = id => document.getElementById(id);

function fillPanes(){
  $("csky-comets").innerHTML =
    `<p class="body" style="margin-bottom:14px">Papers as comets: not fixed stars yet —
     bright, moving, on eccentric orbits around the concepts that spawned them.
     Update these cards as the work lands; that's the point of a lab-notebook sky.</p>` +
    COMETS.map(c => `
    <div class="card comet-card" id="comet-card-${c.id}">
      <h3>${c.tag} — ${c.title}</h3>
      <p class="meta"><span class="gold">${c.year}</span> · orbiting: ${c.parents}</p>
      <p class="body">${c.story}</p>
      <p class="thread">${c.thread}</p>
    </div>`).join("");

  $("csky-disputes").innerHTML = DISPUTES.map(d => `
    <div class="card">
      <div class="vs">${d.sides[0]} <span class="bolt">⚡</span> ${d.sides[1]}</div>
      <p class="meta">${d.year} · <span class="hot">${d.heat}</span></p>
      <p class="body">${d.story}</p>
      <p class="verdict">${d.verdict}</p>
    </div>`).join("");

  $("csky-fog").innerHTML =
    `<p class="fogband">· · · under observation — last surveyed july 2026 · · ·</p>
     <p class="body" style="margin-bottom:14px">Frontier nodes go stale fast, so this
     region is hazy on purpose. Nothing here gets a status glyph until history votes.
     Re-survey it every few months and promote what survives onto the map proper.</p>` +
    FOG.map(f => `
    <div class="card fog-item">
      <h3>${f.t}</h3>
      <p class="body">${f.n}</p>
    </div>`).join("");
}
fillPanes();

function showTab(t){
  document.querySelectorAll("#csky .csky-tab").forEach(b =>
    b.classList.toggle("on", b.dataset.tab === t));
  ["comets","disputes","fog"].forEach(k =>
    $("csky-" + k).hidden = (k !== t));
}
function openSky(tab){ wrap.hidden = false; showTab(tab || "comets"); }
function closeSky(){ wrap.hidden = true; }

launch.addEventListener("click", () => openSky("comets"));
$("csky-close").addEventListener("click", closeSky);
wrap.addEventListener("click", e => { if (e.target === wrap) closeSky(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !wrap.hidden) closeSky(); });
document.querySelectorAll("#csky .csky-tab").forEach(b =>
  b.addEventListener("click", () => showTab(b.dataset.tab)));

window.openContestedSky = openSky;
window.openComet = id => {
  openSky("comets");
  const el = $("comet-card-" + id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
};

/* ============================================================
   COMETS ON THE SVG SKY
   Drawn into #map (viewBox 1600×1000) if it exists, so they
   inherit the map's own pan/zoom. Each comet loops a slow
   elliptical orbit around its anchor, trailing a fading tail.
   ============================================================ */
const svg = document.getElementById("map");
if (svg) {
  const NS = "http://www.w3.org/2000/svg";
  const layer = document.createElementNS(NS, "g");
  layer.setAttribute("id", "comets-layer");
  svg.appendChild(layer);

  // soft glow filter for comet heads
  let defs = svg.querySelector("defs");
  if (!defs) { defs = document.createElementNS(NS, "defs"); svg.insertBefore(defs, svg.firstChild); }
  defs.insertAdjacentHTML("beforeend",
    `<filter id="comet-glow" x="-80%" y="-80%" width="260%" height="260%">
       <feGaussianBlur stdDeviation="3.2" result="b"/>
       <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
     </filter>`);

  const bodies = COMETS.map((c, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "comet");
    // faint orbit ellipse
    const orbit = document.createElementNS(NS, "ellipse");
    const rx = 46 + i * 6, ry = 20 + i * 4;
    orbit.setAttribute("cx", c.anchor.x); orbit.setAttribute("cy", c.anchor.y);
    orbit.setAttribute("rx", rx); orbit.setAttribute("ry", ry);
    orbit.setAttribute("fill", "none");
    orbit.setAttribute("stroke", "rgba(245,200,107,.14)");
    orbit.setAttribute("stroke-dasharray", "2 5");
    g.appendChild(orbit);
    // tail (polyline of recent positions)
    const tail = document.createElementNS(NS, "polyline");
    tail.setAttribute("fill", "none");
    tail.setAttribute("stroke", "rgba(245,200,107,.45)");
    tail.setAttribute("stroke-width", "1.6");
    tail.setAttribute("stroke-linecap", "round");
    g.appendChild(tail);
    // head
    const head = document.createElementNS(NS, "circle");
    head.setAttribute("r", "5");
    head.setAttribute("fill", "#f5c86b");
    head.setAttribute("filter", "url(#comet-glow)");
    head.setAttribute("class", "comet-head");
    head.addEventListener("click", () => window.openComet(c.id));
    g.appendChild(head);
    // label
    const label = document.createElementNS(NS, "text");
    label.setAttribute("class", "comet-label");
    label.textContent = c.tag;
    label.addEventListener("click", () => window.openComet(c.id));
    g.appendChild(label);

    layer.appendChild(g);
    return { c, head, tail, label, rx, ry,
             phase: Math.random() * Math.PI * 2,
             speed: 0.00022 + 0.00006 * i,
             tilt: (i % 2 ? 1 : -1) * (0.3 + 0.15 * i),
             pts: [] };
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick(t){
    for (const b of bodies){
      const a = reduced ? b.phase : b.phase + t * b.speed;
      const ex = Math.cos(a) * b.rx, ey = Math.sin(a) * b.ry;
      const x = b.c.anchor.x + ex * Math.cos(b.tilt) - ey * Math.sin(b.tilt);
      const y = b.c.anchor.y + ex * Math.sin(b.tilt) + ey * Math.cos(b.tilt);
      b.head.setAttribute("cx", x); b.head.setAttribute("cy", y);
      b.label.setAttribute("x", x + 9); b.label.setAttribute("y", y - 8);
      b.pts.push([x, y]); if (b.pts.length > 26) b.pts.shift();
      b.tail.setAttribute("points", b.pts.map(p => p.join(",")).join(" "));
    }
    if (!reduced) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
})(); /* end module */
