// THE WEB OF COMPUTATION — app.js
// Layers: starfield canvas → SVG sky (shells, bridges, domains, fields, pioneers)
// One state object; render functions are idempotent updates.

const S = { year: 2026, zoomed: null, people: false, playing: false };
const SVGNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("map");
const $ = id => document.getElementById(id);

// ---------- starfield ----------
(function starfield() {
  const c = $("stars"), ctx = c.getContext("2d");
  let stars = [];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    c.width = innerWidth; c.height = innerHeight;
    stars = Array.from({ length: 190 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.3 + 0.3, p: Math.random() * Math.PI * 2,
      v: 0.4 + Math.random() * 1.2
    }));
  }
  function tick(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of stars) {
      const a = reduced ? 0.7 : 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(s.p + t * 0.001 * s.v));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    if (!reduced) requestAnimationFrame(tick);
  }
  addEventListener("resize", resize);
  resize(); requestAnimationFrame(tick);
})();

// ---------- svg helpers ----------
function el(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const D = id => DOMAINS.find(d => d.id === id);

// ---------- build defs (nebula gradients) ----------
const defs = el("defs", {}, svg);
for (const d of DOMAINS) {
  const g = el("radialGradient", { id: "neb-" + d.id }, defs);
  el("stop", { offset: "0%",  "stop-color": `hsl(${d.hue} 85% 72% / 0.85)` }, g);
  el("stop", { offset: "45%", "stop-color": `hsl(${d.hue} 75% 55% / 0.34)` }, g);
  el("stop", { offset: "100%","stop-color": `hsl(${d.hue} 75% 45% / 0)` }, g);
}

// ---------- layers ----------
const Lshell  = el("g", {}, svg);
const Ledge   = el("g", {}, svg);
const Ldomain = el("g", {}, svg);
const Lfield  = el("g", {}, svg);
const Lpeople = el("g", {}, svg);

// ---------- containment shells ----------
SHELLS.rings.forEach((r, i) => {
  el("ellipse", { class: "shell", cx: SHELLS.cx, cy: SHELLS.cy, rx: r.rx, ry: r.ry }, Lshell);
  el("text", {
    class: "shell-label", x: SHELLS.cx, y: SHELLS.cy - r.ry - 6, "text-anchor": "middle"
  }, Lshell).textContent = r.label;
});

// ---------- bridges & controversies ----------
function curve(a, b) {
  const A = D(a), B = D(b);
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
  const cx = mx - dy / L * 70, cy = my + dx / L * 70;
  return `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
}
function makeEdge(e, cls) {
  const d = curve(e.a, e.b);
  const vis = el("path", { class: cls, d }, Ledge);
  const hit = el("path", { class: "bridge-hit", d }, Ledge);
  hit.addEventListener("click", () => openPanel({
    kind: cls === "bridge" ? "Gold bridge" : "Controversy ⚡",
    title: e.label, meta: `${D(e.a).name} ↔ ${D(e.b).name} · ${e.y}`,
    blurb: cls === "bridge"
      ? "A mediating concept: the idea that lets one continent's results flow into the other."
      : "A live dispute — the field's best stories are its arguments."
  }));
  e._el = vis;
}
BRIDGES.forEach(b => makeEdge(b, "bridge"));
CONTROVERSIES.forEach(c => makeEdge(c, "controversy"));

// ---------- domains ----------
for (const d of DOMAINS) {
  const g = el("g", { class: "domain", tabindex: 0, role: "button", "aria-label": d.name }, Ldomain);
  el("circle", { class: "neb", cx: d.x, cy: d.y, r: d.r * 1.55, fill: `url(#neb-${d.id})` }, g);
  el("circle", { class: "ring", cx: d.x, cy: d.y, r: d.r * 1.1,
    stroke: `hsl(${d.hue} 80% 70%)`, "stroke-dasharray": "2 10" }, g);
  const t = el("text", { x: d.x, y: d.y - 4 }, g);
  // wrap long names on two lines
  const words = d.name.split(" ");
  const half = Math.ceil(words.length / 2);
  el("tspan", { x: d.x, dy: 0 }, t).textContent = words.slice(0, half).join(" ");
  el("tspan", { x: d.x, dy: 20 }, t).textContent = words.slice(half).join(" ");
  el("tspan", { class: "yr", x: d.x, dy: 20 }, t).textContent = "b. " + d.y0;
  g.addEventListener("click", () => zoomTo(d));
  g.addEventListener("keydown", ev => { if (ev.key === "Enter") zoomTo(d); });
  d._el = g;
}

// ---------- fields (orbiting each domain, revealed on zoom) ----------
for (const d of DOMAINS) {
  const fields = FIELDS[d.id] || [];
  fields.forEach((f, i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / fields.length);
    const R = d.r * 1.05 + 55;
    f._x = d.x + R * Math.cos(ang);
    f._y = d.y + R * Math.sin(ang);
    const g = el("g", { class: `field s-${f.s}`, "data-dom": d.id, tabindex: -1 }, Lfield);
    el("circle", { class: "core", cx: f._x, cy: f._y, r: 11 }, g);
    const t = el("text", { x: f._x, y: f._y + 24 }, g);
    const w = f.name.split(" ");
    if (w.length > 2) {
      const h = Math.ceil(w.length / 2);
      el("tspan", { x: f._x, dy: 0 }, t).textContent = w.slice(0, h).join(" ");
      el("tspan", { x: f._x, dy: 12 }, t).textContent = w.slice(h).join(" ");
    } else t.textContent = f.name;
    g.addEventListener("click", ev => { ev.stopPropagation(); openField(f, d); });
    f._el = g;
  });
}

// ---------- pioneers (constellation arc across the top) ----------
function starPath(x, y, r) {
  let p = "";
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    p += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(1) + " " + (y + rr * Math.sin(a)).toFixed(1);
  }
  return p + "Z";
}
PEOPLE.forEach((p, i) => {
  const x = 120 + i * (1360 / (PEOPLE.length - 1));
  const y = 62 + (i % 2) * 26;
  const g = el("g", { class: "pioneer", tabindex: -1, role: "button", "aria-label": p.name }, Lpeople);
  el("path", { d: starPath(x, y, 7) }, g);
  el("text", { x, y: y + 20 }, g).textContent = p.name.split(" ").pop();
  g.addEventListener("click", () => {
    DOMAINS.forEach(d => d._el.classList.toggle("linked", p.domains.includes(d.id)));
    openPanel({
      kind: "Pioneer", title: p.name, meta: p.dates,
      blurb: p.epitaph, fate: p.fate,
      after: () => DOMAINS.forEach(d => d._el.classList.remove("linked"))
    });
  });
  p._el = g;
});

// ---------- panel ----------
const panel = $("panel");
let panelCleanup = null;
function openPanel(o) {
  if (panelCleanup) { panelCleanup(); panelCleanup = null; }
  $("panel-body").innerHTML = "";
  const b = $("panel-body");
  const meta1 = document.createElement("div");
  meta1.className = "meta"; meta1.textContent = o.kind + (o.meta ? " · " + o.meta : "");
  const h = document.createElement("h2"); h.textContent = o.title;
  b.append(h, meta1);
  if (o.blurb) { const p = document.createElement("p"); p.className = "blurb"; p.textContent = o.blurb; b.append(p); }
  if (o.fate) { const f = document.createElement("p"); f.className = "fate"; f.textContent = o.fate; b.append(f); }
  if (o.topics) for (const t of o.topics) {
    const div = document.createElement("div");
    div.className = "topic" + (t.y > S.year ? " unborn" : "");
    div.innerHTML = `<h3>${statusMark(t.s)} ${t.n}</h3>
      <div class="tmeta">${t.who} · ${t.y}</div><p>${t.d}</p>`;
    b.append(div);
  }
  panel.classList.add("open");
  panelCleanup = o.after || null;
}
function statusMark(s) {
  return { found: "🏛", fire: "🔥", work: "⚙️", obs: "🪦", rev: "🧟" }[s] || "";
}
function openField(f, d) {
  openPanel({
    kind: statusMark(f.s) + " Field of " + d.name, title: f.name,
    meta: "b. " + f.y, blurb: f.d, topics: f.topics
  });
  // Part 3: if this field has a playable atom, offer it at the top of the panel
  if (window.ATOM_FOR && ATOM_FOR[f.id]) {
    const btn = document.createElement("button");
    btn.className = "atom-launch";
    btn.textContent = "⚛ play: " + ATOM_NAMES[ATOM_FOR[f.id]];
    btn.addEventListener("click", () => window.openAtomFromField(ATOM_FOR[f.id]));
    const body = $("panel-body");
    body.insertBefore(btn, body.children[2] || null);
  }
  if (f.id === "infotheory" && window.openInformationTheoryExperience) {
    window.openInformationTheoryExperience();
  }
  if (f.id === "classic-crypto" && window.openClassicalCryptoExperience) {
    window.openClassicalCryptoExperience();
  }
  if (f.id === "modern-crypto" && window.openModernCryptoExperience) {
    window.openModernCryptoExperience();
  }
  if (f.id === "logic" && window.openMathLogicExperience) {
    window.openMathLogicExperience();
  }
  if (f.id === "quantum" && window.openQuantumExperience) {
    window.openQuantumExperience();
  }
  if (f.id === "complexity" && window.openComplexityExperience) {
    window.openComplexityExperience();
  }
  if (f.id === "computability" && window.openComputabilityExperience) {
    window.openComputabilityExperience();
  }
  if (f.id === "automata" && window.openAutomataExperience) {
    window.openAutomataExperience();
    return;
  }
  if (f.id === "mech" && window.openMechanicalExperience) {
    window.openMechanicalExperience();
    return;
  }
  if (f.id === "wartime" && window.openWartimeExperience) {
    window.openWartimeExperience();
    return;
  }
  if (f.id === "stored" && window.openStoredProgramExperience) {
    window.openStoredProgramExperience();
    return;
  }
  if (f.id === "aihw" && window.openAIHardwareExperience) {
    window.openAIHardwareExperience();
    return;
  }
  if (f.id === "structs" && window.openDataStructuresExperience) {
    window.openDataStructuresExperience();
    return;
  }
}
$("panel-close").addEventListener("click", () => {
  panel.classList.remove("open");
  if (panelCleanup) { panelCleanup(); panelCleanup = null; }
});

// ---------- semantic zoom ----------
const HOME = "0 0 1600 1000";
function zoomTo(d) {
  S.zoomed = d;
  document.body.classList.add("zoomed");
  const w = 620, h = 420;
  animateViewBox(`${d.x - w / 2} ${d.y - h / 2} ${w} ${h}`);
  document.querySelectorAll(".field").forEach(f =>
    f.classList.toggle("active", f.dataset.dom === d.id));
  openPanel({ kind: "Domain", title: d.name, meta: "b. " + d.y0, blurb: d.blurb });
}
$("back-btn").addEventListener("click", () => {
  S.zoomed = null;
  document.body.classList.remove("zoomed");
  animateViewBox(HOME);
  panel.classList.remove("open");
});
let vbAnim = null;
function animateViewBox(target) {
  const from = svg.getAttribute("viewBox").split(" ").map(Number);
  const to = target.split(" ").map(Number);
  const t0 = performance.now(), dur = 650;
  cancelAnimationFrame(vbAnim);
  (function step(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    svg.setAttribute("viewBox", from.map((v, i) => v + (to[i] - v) * e).join(" "));
    if (k < 1) vbAnim = requestAnimationFrame(step);
  })(t0);
}
svg.setAttribute("viewBox", HOME);

// ---------- the era engine (signature) ----------
function eraFor(y) { return ERAS.find(e => y >= e.from && y <= e.to) || ERAS[ERAS.length - 1]; }
function setYear(y) {
  S.year = y;
  $("year-readout").textContent = y;
  $("year-slider").value = y;
  const era = eraFor(y);
  const root = document.documentElement.style;
  root.setProperty("--sky1", era.sky1);
  root.setProperty("--sky2", era.sky2);
  root.setProperty("--tint", era.tint);
  $("era-label").textContent = era.name;
  document.body.classList.toggle("winter", !!era.frost);

  // ignite / extinguish nodes
  for (const d of DOMAINS) d._el.classList.toggle("unborn", d.y0 > y);
  for (const id in FIELDS) for (const f of FIELDS[id]) f._el.classList.toggle("unborn", f.y > y);
  for (const b of BRIDGES) b._el.classList.toggle("unborn", b.y > y);
  for (const c of CONTROVERSIES) c._el.classList.toggle("unborn", c.y > y);
  for (const p of PEOPLE) p._el.classList.toggle("unborn", p.y > y);
}
$("year-slider").addEventListener("input", e => { stopPlay(); setYear(+e.target.value); });

// play through history
let playRAF = null;
function stopPlay() { S.playing = false; $("play-btn").textContent = "▶"; cancelAnimationFrame(playRAF); }
$("play-btn").addEventListener("click", () => {
  if (S.playing) return stopPlay();
  S.playing = true; $("play-btn").textContent = "⏸";
  let y = S.year >= 2026 ? 1822 : S.year;
  const t0 = performance.now(), y0 = y, span = 2026 - y0, dur = span * 160; // ~slow burn
  (function step(t) {
    if (!S.playing) return;
    const k = Math.min(1, (t - t0) / dur);
    setYear(Math.round(y0 + span * k));
    if (k < 1) playRAF = requestAnimationFrame(step);
    else stopPlay();
  })(t0);
});

// timeline load-bearing stars
const wrap = document.querySelector(".tl-stars");
TIMELINE_STARS.forEach(y => {
  const s = document.createElement("span");
  s.style.left = ((y - 1822) / (2026 - 1822) * 100) + "%";
  s.title = y;
  wrap.appendChild(s);
});

// ---------- toggles ----------
$("toggle-people").addEventListener("click", e => {
  S.people = !S.people;
  document.body.classList.toggle("people", S.people);
  e.currentTarget.classList.toggle("on", S.people);
});
$("toggle-shells").addEventListener("click", e => {
  const on = Lshell.style.display !== "none";
  Lshell.style.display = on ? "none" : "";
  e.currentTarget.classList.toggle("on", !on);
});

// ---------- boot ----------
document.body.classList.add("people"); // pioneers visible by default
$("toggle-people").classList.add("on");
S.people = true;
setYear(2026);
