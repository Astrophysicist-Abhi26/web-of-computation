/* ============================================================
   THE WEB OF COMPUTATION — pioneers.js
   · Constellation: a circular portrait (or monogram) for every
     pioneer across the top of the sky, in chronological order.
   · Biography panel: portrait, timeline, key works, and links
     that light up the person's fields on the map.
   · Gallery: everyone, grouped by era, with search and filters.

   Data:      PEOPLE     (pioneers-data.js)
   Portraits: PORTRAITS  (portraits/credits.js), optional per id.
   Every portrait is shown through one gold-and-purple duotone
   filter so photos from different sources look like one set.
   Hover a portrait in the panel to see the original colours.

   Public API:
     window.openPioneer(id)
     window.openPioneerGallery()
   ============================================================ */
(function () {
"use strict";

const NS = "http://www.w3.org/2000/svg";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const PORTRAITS = window.PORTRAITS || {};
const byId = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
const CHRONO = PEOPLE.slice().sort((a, b) => a.y - b.y || String(a.born).localeCompare(String(b.born)) || a.name.localeCompare(b.name));
const SHORT = { sparckjones:"Spärck Jones", feifeili:"Fei-Fei Li", kaiminghe:"Kaiming He", vonneumann:"von Neumann" };

const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const shortName = p => SHORT[p.id] || p.name.split(" ").pop();
function initials(p) {
  const w = p.name.replace(/\b[A-Z]\.\s*/g, "").split(/\s+/).filter(Boolean);
  return ((w[0] || "")[0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
}
function dates(p) {
  if (p.born == null && p.died == null) return "";
  if (p.died == null) return "b. " + p.born;
  return `${p.born}–${p.died}`;
}
function hueOf(p) { const d = DOMAINS.find(d => d.id === p.dom[0]); return d ? d.hue : 45; }
function portrait(p) { const q = PORTRAITS[p.id]; return q && q.file ? q : null; }
function fieldById(id) {
  for (const d of DOMAINS) for (const f of (FIELDS[d.id] || [])) if (f.id === id) return { f, d };
  return null;
}

/* ---------- shared defs: duotone filter + monogram gradients ---------- */
const hidden = document.createElementNS(NS, "svg");
hidden.setAttribute("width", 0); hidden.setAttribute("height", 0);
hidden.setAttribute("aria-hidden", "true");
hidden.style.position = "absolute";
hidden.innerHTML = `<defs>
  <filter id="woc-duotone" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values=".30 .59 .11 0 0  .30 .59 .11 0 0  .30 .59 .11 0 0  0 0 0 1 0"/>
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.09 0.55 1.00"/>
      <feFuncG type="table" tableValues="0.04 0.36 0.88"/>
      <feFuncB type="table" tableValues="0.20 0.42 0.60"/>
    </feComponentTransfer>
  </filter></defs>`;
document.body.appendChild(hidden);

const map = document.getElementById("map");
const mapDefs = map.querySelector("defs");
for (const d of DOMAINS) {
  const g = svgEl("radialGradient", { id:"mono-" + d.id, cx:".35", cy:".3", r:".8" }, mapDefs);
  svgEl("stop", { offset:"0", "stop-color":`hsl(${d.hue} 70% 58%)` }, g);
  svgEl("stop", { offset:"1", "stop-color":`hsl(${d.hue} 60% 20%)` }, g);
}

/* ---------- the constellation ---------- */
// Three staggered rows, left to right in order of each person's defining year.
const ROWS = [52, 80, 108], X0 = 60, X1 = 1370, TR = 10;
CHRONO.forEach((p, i) => {
  const x = X0 + i * (X1 - X0) / (CHRONO.length - 1);
  const y = ROWS[i % 3];
  const g = svgEl("g", { class:"pioneer", tabindex:-1, role:"button", "aria-label":`${p.name}, ${dates(p)}` }, Lpeople);
  svgEl("title", {}, g).textContent = `${p.name} · ${dates(p)}\n${p.epitaph}`;
  const clip = svgEl("clipPath", { id:"pc-" + p.id }, g);
  svgEl("circle", { cx:x, cy:y, r:TR }, clip);
  const pic = portrait(p);
  if (pic) {
    svgEl("image", { href:pic.file, x:x - TR, y:y - TR, width:TR * 2, height:TR * 2, preserveAspectRatio:"xMidYMid slice",
      "clip-path":`url(#pc-${p.id})`, filter:"url(#woc-duotone)" }, g);
  } else {
    svgEl("circle", { cx:x, cy:y, r:TR, fill:`url(#mono-${p.dom[0]})` }, g);
    svgEl("text", { x, y:y + 3.2, class:"mono" }, g).textContent = initials(p);
  }
  svgEl("circle", { cx:x, cy:y, r:TR, class:"pring" + (p.died == null ? " alive" : "") }, g);
  svgEl("text", { x, y:y + TR + 8.5, class:"plabel" }, g).textContent = shortName(p);
  g.addEventListener("click", () => openPioneer(p.id));
  g.addEventListener("keydown", e => { if (e.key === "Enter") openPioneer(p.id); });
  p._el = g;
});
setYear(S.year);   // sync the new constellation with the time scrubber

/* ---------- biography panel ---------- */
let pulseT = null;
function lightFields(p, on) {
  DOMAINS.forEach(d => d._el.classList.toggle("linked", on && p.dom.includes(d.id)));
  for (const id of p.fields) { const r = fieldById(id); if (r) r.f._el.classList.toggle("pio-lit", on); }
}
function portraitHTML(p, size) {
  const pic = portrait(p);
  if (pic) return `<img src="${esc(pic.file)}" alt="Portrait of ${esc(p.name)}" width="${size}" height="${size}" loading="lazy">`;
  return `<span class="pio-mono" style="--h:${hueOf(p)}">${esc(initials(p))}</span>`;
}
function creditHTML(p) {
  const pic = portrait(p);
  if (!pic) return `<figcaption>Portrait coming soon</figcaption>`;
  const lic = pic.licenseUrl ? `<a href="${esc(pic.licenseUrl)}" target="_blank" rel="noopener">${esc(pic.license)}</a>` : esc(pic.license || "");
  const src = pic.source ? ` · <a href="${esc(pic.source)}" target="_blank" rel="noopener">source</a>` : "";
  return `<figcaption>Photo: ${esc(pic.artist || "unknown")} · ${lic}${src} · duotone applied</figcaption>`;
}

function openPioneer(id) {
  const p = byId[id]; if (!p) return;
  if (S.people === false) { /* still allow opening from the gallery */ }
  lightFields(p, true);
  openPanel({ kind:"Pioneer", title:p.name, meta:dates(p), after:() => lightFields(p, false) });
  const idx = CHRONO.indexOf(p), prev = CHRONO[idx - 1], next = CHRONO[idx + 1];
  const chips = p.fields.map(fid => {
    const r = fieldById(fid); if (!r) return "";
    return `<button class="pio-chip" data-field="${fid}" style="--h:${r.d.hue}">${esc(r.f.name)}</button>`;
  }).join("");
  const life = p.life.map(([y, t, d]) => {
    const era = eraFor(y);
    return `<li style="--tint:${era.tint}"><span class="y">${y}</span><div><b>${esc(t)}</b>${d ? `<p>${esc(d)}</p>` : ""}</div></li>`;
  }).join("");
  const works = (p.works || []).map(([y, t, u]) =>
    `<li><span class="y">${y}</span>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : esc(t)}</li>`).join("");
  const status = p.died == null ? `<span class="pio-alive">living</span>` : "";
  $("panel-body").innerHTML = `
    <article class="pio">
      <figure class="pio-hero">${portraitHTML(p, 148)}${creditHTML(p)}</figure>
      <div class="meta">Pioneer · ${esc(dates(p))} ${status}</div>
      <h2>${esc(p.name)}</h2>
      <p class="pio-role">${esc(p.role)}</p>
      <p class="pio-epitaph">${esc(p.epitaph)}</p>
      ${chips ? `<h4>On the map</h4><div class="pio-chips">${chips}</div>` : ""}
      <h4>Life and work</h4>
      <ol class="pio-tl">${life}</ol>
      ${works ? `<h4>Key works</h4><ul class="pio-works">${works}</ul>` : ""}
      <h4>Legacy</h4>
      <p class="fate">${esc(p.legacy)}</p>
      <nav class="pio-nav">
        ${prev ? `<button data-go="${prev.id}">← ${esc(shortName(prev))}</button>` : "<span></span>"}
        <button data-gallery="1">▦ all ${PEOPLE.length} pioneers</button>
        ${next ? `<button data-go="${next.id}">${esc(shortName(next))} →</button>` : "<span></span>"}
      </nav>
    </article>`;
  $("panel").scrollTop = 0;
  const body = $("panel-body");
  body.querySelectorAll(".pio-chip").forEach(b => b.addEventListener("click", () => goToField(p, b.dataset.field)));
  body.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => openPioneer(b.dataset.go)));
  body.querySelector("[data-gallery]").addEventListener("click", openGallery);
}

function goToField(p, fid) {
  const r = fieldById(fid); if (!r) return;
  if (S.zoomed !== r.d) zoomTo(r.d);       // opens the domain panel …
  openPioneer(p.id);                        // … so bring the biography back
  clearTimeout(pulseT);
  document.querySelectorAll(".field.pio-pulse").forEach(e => e.classList.remove("pio-pulse"));
  pulseT = setTimeout(() => {
    r.f._el.classList.add("pio-pulse");
    setTimeout(() => r.f._el.classList.remove("pio-pulse"), 3200);
  }, REDUCED ? 0 : 1500);
}

/* ---------- gallery ---------- */
const gal = document.createElement("div");
gal.id = "pio-gallery"; gal.hidden = true;
gal.innerHTML = `
  <div class="pg-shell" role="dialog" aria-modal="true" aria-labelledby="pg-title">
    <div class="pg-head">
      <div>
        <h2 id="pg-title">Pioneers of Computation</h2>
        <p class="pg-sub"><span id="pg-count"></span> people, in order of the work that put them on the map</p>
      </div>
      <button class="pg-close" aria-label="Close gallery">✕</button>
    </div>
    <div class="pg-tools">
      <input id="pg-search" type="search" placeholder="Search names, ideas, places…" aria-label="Search pioneers">
      <div class="pg-filters" role="group" aria-label="Filter pioneers"></div>
    </div>
    <div class="pg-body"></div>
  </div>`;
document.body.appendChild(gal);
const pgBody = gal.querySelector(".pg-body"), pgFilters = gal.querySelector(".pg-filters"), pgSearch = gal.querySelector("#pg-search");
let filt = "all";
const FILTERS = [["all", "Everyone"], ["living", "Living"], ...DOMAINS.map(d => [d.id, d.name.replace(/\s*\(.*\)/, "")])];
pgFilters.innerHTML = FILTERS.map(([k, n]) => {
  const d = DOMAINS.find(d => d.id === k);
  return `<button data-f="${k}" aria-pressed="${k === "all"}"${d ? ` style="--h:${d.hue}"` : ""}>${d ? "<i></i>" : ""}${esc(n)}</button>`;
}).join("");
pgFilters.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
  filt = b.dataset.f;
  pgFilters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderGallery();
}));
pgSearch.addEventListener("input", renderGallery);

function matches(p, q) {
  if (filt === "living" && p.died != null) return false;
  if (filt !== "all" && filt !== "living" && !p.dom.includes(filt)) return false;
  if (!q) return true;
  const hay = [p.name, p.role, p.epitaph, p.legacy, ...p.life.map(l => l[1] + " " + l[2])].join(" ").toLowerCase();
  return q.split(/\s+/).every(w => hay.includes(w));
}
function renderGallery() {
  const q = pgSearch.value.trim().toLowerCase();
  const list = CHRONO.filter(p => matches(p, q));
  gal.querySelector("#pg-count").textContent = list.length === PEOPLE.length ? PEOPLE.length : `${list.length} of ${PEOPLE.length}`;
  if (!list.length) { pgBody.innerHTML = `<p class="pg-empty">Nobody matches that search. Try a surname, a place, or an idea such as “Transformer”.</p>`; return; }
  let html = "", era = null;
  for (const p of list) {
    const e = eraFor(p.y);
    if (e !== era) {
      if (era) html += "</div></section>";
      era = e;
      html += `<section class="pg-era" style="--tint:${e.tint}"><h3>${esc(e.name)}<span>${e.from}–${e.to}</span></h3><div class="pg-grid">`;
    }
    const dots = p.dom.map(id => { const d = DOMAINS.find(d => d.id === id); return d ? `<i style="--h:${d.hue}" title="${esc(d.name)}"></i>` : ""; }).join("");
    html += `<button class="pg-card${p.y > S.year ? " later" : ""}" data-id="${p.id}">
        <span class="pg-pic">${portraitHTML(p, 64)}</span>
        <span class="pg-txt">
          <b>${esc(p.name)}</b>
          <span class="pg-dates">${esc(dates(p))}${p.died == null ? " · living" : ""}</span>
          <span class="pg-ep">${esc(p.epitaph)}</span>
          <span class="pg-dots"><span class="pg-y">${p.y}</span>${dots}</span>
        </span>
      </button>`;
  }
  html += "</div></section>";
  pgBody.innerHTML = html;
  pgBody.querySelectorAll(".pg-card").forEach(c => c.addEventListener("click", () => { closeGallery(); openPioneer(c.dataset.id); }));
}
let lastFocus = null;
function openGallery() {
  lastFocus = document.activeElement;
  renderGallery();
  gal.hidden = false;
  document.body.classList.add("pg-open");
  pgSearch.focus({ preventScroll:true });
}
function closeGallery() {
  gal.hidden = true;
  document.body.classList.remove("pg-open");
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll:true });
}
gal.querySelector(".pg-close").addEventListener("click", closeGallery);
gal.addEventListener("click", e => { if (e.target === gal) closeGallery(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !gal.hidden) closeGallery(); });

const toggles = document.getElementById("toggles");
if (toggles) {
  const b = document.createElement("button");
  b.id = "toggle-gallery"; b.textContent = "▦ pioneer gallery";
  b.addEventListener("click", openGallery);
  toggles.insertBefore(b, document.getElementById("toggle-people").nextSibling);
}

/* ---------- CSS ---------- */
const css = `
/* constellation */
.pioneer { transform-box: fill-box; }
.pioneer .pring { fill: none; stroke: rgba(255,233,168,.75); stroke-width: 1.1; filter: drop-shadow(0 0 4px rgba(255,233,168,.7)); }
.pioneer .pring.alive { stroke: #f5c451; }
.pioneer .mono { font-family: "Fraunces", Georgia, serif; font-size: 8.5px; font-weight: 600; fill: #fff4dc;
  text-anchor: middle; pointer-events: none; }
.pioneer .plabel { font-family: "IBM Plex Mono", monospace; font-size: 8px; fill: #ffe9a8; text-anchor: middle;
  paint-order: stroke; stroke: rgba(0,0,0,.7); stroke-width: 2.4px; }
.pioneer image, .pioneer circle:not(.pring) { transition: opacity .2s; }
.pioneer:hover .pring, .pioneer:focus-visible .pring { stroke: #fff; stroke-width: 2; }
.pioneer:hover .plabel { fill: #fff; }
body.zoomed .pioneer { opacity: .08 !important; pointer-events: none !important; }
body.topic-focus .pioneer { opacity: 0 !important; }
.field.pio-lit circle.core { stroke: var(--gold); stroke-width: 3; }
.field.pio-pulse circle.core { animation: pioPulse 1s ease-in-out 3 !important; }
@keyframes pioPulse { 0%,100% { filter: drop-shadow(0 0 4px #f5c451); } 50% { filter: drop-shadow(0 0 18px #f5c451) brightness(1.6); } }

/* biography */
.pio h2 { margin-top: .1rem; }
.pio .meta { margin-bottom: .2rem !important; }
.pio-alive { color: #9fe8c0; border: 1px solid rgba(159,232,192,.5); border-radius: 999px; padding: 0 .45rem; margin-left: .3rem; }
.pio-hero { margin: 0 0 1rem; display: flex; flex-direction: column; align-items: center; gap: .45rem; }
.pio-hero img, .pio-hero .pio-mono { width: 148px; height: 148px; border-radius: 50%; object-fit: cover; object-position: 50% 22%;
  box-shadow: 0 0 0 3px var(--gold), 0 0 28px rgba(245,196,81,.45); }
.pio-hero img, .pg-pic img { filter: url(#woc-duotone); }
.pio-hero img:hover { filter: none; }
.pio-mono { display: grid; place-items: center; font-family: "Fraunces", Georgia, serif; font-weight: 600; color: #fff4dc;
  background: radial-gradient(circle at 35% 30%, hsl(var(--h) 70% 58%), hsl(var(--h) 60% 18%)); letter-spacing: .02em; }
.pio-hero .pio-mono { font-size: 3rem; }
.pio-hero figcaption { font-family: "IBM Plex Mono", monospace; font-size: .62rem; color: var(--dim); text-align: center; }
.pio-hero figcaption a { color: var(--dim); }
.pio-role { font-size: .88rem; color: var(--dim); margin-bottom: .8rem; }
.pio-epitaph { font-size: 1.05rem; line-height: 1.5; font-style: italic; color: var(--ink); margin-bottom: 1.2rem; }
.pio h4 { font-family: "IBM Plex Mono", monospace; font-size: .68rem; font-weight: 500; letter-spacing: .14em;
  text-transform: uppercase; color: var(--gold); margin: 1.3rem 0 .6rem; }
.pio-chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.pio-chip { font-family: "IBM Plex Mono", monospace; font-size: .7rem; color: var(--ink); cursor: pointer;
  background: hsl(var(--h) 60% 50% / .12); border: 1px solid hsl(var(--h) 70% 65% / .55); border-radius: 999px; padding: .3rem .7rem; }
.pio-chip::before { content: "◉ "; color: hsl(var(--h) 80% 70%); }
.pio-chip:hover, .pio-chip:focus-visible { background: hsl(var(--h) 60% 50% / .28); outline: none; }
.pio-tl { list-style: none; margin: 0; padding: 0; border-left: 1px solid rgba(245,196,81,.35); margin-left: .35rem; }
.pio-tl li { position: relative; display: grid; grid-template-columns: 3rem 1fr; gap: .5rem; padding: 0 0 .85rem .9rem; }
.pio-tl li::before { content: ""; position: absolute; left: -5px; top: .35rem; width: 9px; height: 9px; border-radius: 50%;
  background: var(--tint); box-shadow: 0 0 8px var(--tint); }
.pio-tl .y, .pio-works .y { font-family: "IBM Plex Mono", monospace; font-size: .74rem; color: var(--gold); padding-top: .1rem;
  font-variant-numeric: tabular-nums; }
.pio-tl b { font-weight: 600; font-size: .92rem; }
.pio-tl p { font-size: .84rem; line-height: 1.45; color: var(--dim); margin-top: .1rem; }
.pio-works { list-style: none; padding: 0; margin: 0; display: grid; gap: .45rem; }
.pio-works li { display: grid; grid-template-columns: 3rem 1fr; gap: .5rem; font-size: .86rem; line-height: 1.4; }
.pio-works a { color: var(--ink); text-decoration-color: rgba(245,196,81,.5); text-underline-offset: 2px; }
.pio-works a:hover { color: var(--gold); }
.pio-nav { display: flex; justify-content: space-between; gap: .5rem; margin-top: 1.6rem; padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,.1); }
.pio-nav button { font-family: "IBM Plex Mono", monospace; font-size: .68rem; color: var(--ink); background: none;
  border: 1px solid rgba(255,255,255,.18); border-radius: 999px; padding: .35rem .7rem; cursor: pointer; }
.pio-nav button:hover, .pio-nav button:focus-visible { border-color: var(--gold); color: var(--gold); outline: none; }

/* gallery */
#pio-gallery { position: fixed; inset: 0; z-index: 45; background: rgba(4,4,12,.7);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; justify-content: center; padding: 3vh 16px; }
#pio-gallery[hidden] { display: none; }
.pg-shell { width: min(1180px, 100%); max-height: 94vh; display: flex; flex-direction: column;
  background: linear-gradient(160deg, rgba(26,16,46,.97), rgba(12,8,24,.97)); border: 1px solid rgba(245,196,81,.25);
  border-radius: 18px; box-shadow: 0 24px 70px rgba(0,0,0,.6); overflow: hidden; }
.pg-head { display: flex; justify-content: space-between; gap: 1rem; padding: 1.3rem 1.5rem .6rem; }
.pg-head h2 { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 1.7rem; }
.pg-sub { font-family: "IBM Plex Mono", monospace; font-size: .72rem; color: var(--dim); margin-top: .2rem; }
.pg-close { flex: none; background: none; border: 1px solid rgba(255,255,255,.2); color: var(--ink); width: 2.2rem; height: 2.2rem;
  border-radius: 50%; cursor: pointer; font-size: 1rem; }
.pg-close:hover, .pg-close:focus-visible { border-color: var(--gold); color: var(--gold); outline: none; }
.pg-tools { display: flex; flex-wrap: wrap; gap: .6rem 1rem; align-items: center; padding: .3rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.08); }
#pg-search { flex: 1 1 240px; font-family: "Spectral", Georgia, serif; font-size: .95rem; color: var(--ink);
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: .45rem .95rem; }
#pg-search:focus { outline: none; border-color: var(--gold); }
.pg-filters { display: flex; flex-wrap: wrap; gap: .35rem; }
.pg-filters button { font-family: "IBM Plex Mono", monospace; font-size: .66rem; color: var(--dim); cursor: pointer;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.12); border-radius: 999px; padding: .3rem .65rem;
  display: inline-flex; gap: .35rem; align-items: center; }
.pg-filters button i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); }
.pg-filters button[aria-pressed="true"] { color: var(--ink); border-color: var(--gold); background: rgba(245,196,81,.12); }
.pg-filters button:focus-visible { outline: 2px solid var(--gold); }
.pg-body { overflow-y: auto; padding: .4rem 1.5rem 1.6rem; }
.pg-era h3 { position: sticky; top: 0; z-index: 1; display: flex; gap: .7rem; align-items: baseline;
  font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 1.05rem; color: var(--tint);
  background: linear-gradient(rgba(18,11,34,1) 75%, rgba(18,11,34,0)); padding: .9rem 0 .6rem; }
.pg-era h3 span { font-family: "IBM Plex Mono", monospace; font-size: .68rem; font-weight: 400; color: var(--dim); }
.pg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .7rem; }
.pg-card { display: grid; grid-template-columns: 64px 1fr; gap: .8rem; align-items: start; text-align: left; cursor: pointer;
  background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.09); border-radius: 14px; padding: .75rem;
  color: var(--ink); font: inherit; transition: border-color .15s, background .15s; }
.pg-card:hover, .pg-card:focus-visible { border-color: var(--gold); background: rgba(245,196,81,.07); outline: none; }
.pg-card.later { opacity: .55; }
.pg-pic img, .pg-pic .pio-mono { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; object-position: 50% 22%;
  box-shadow: 0 0 0 2px rgba(245,196,81,.6); }
.pg-pic .pio-mono { font-size: 1.35rem; }
.pg-card:hover .pg-pic img { filter: none; }
.pg-txt { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.pg-txt b { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 1rem; }
.pg-dates { font-family: "IBM Plex Mono", monospace; font-size: .66rem; color: var(--gold); }
.pg-ep { font-size: .82rem; line-height: 1.4; color: var(--dim); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.pg-dots { display: flex; gap: .3rem; align-items: center; margin-top: .25rem; }
.pg-dots i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); }
.pg-y { font-family: "IBM Plex Mono", monospace; font-size: .62rem; color: var(--dim); margin-right: .2rem; }
.pg-empty { color: var(--dim); padding: 2rem 0; }
body.pg-open { overflow: hidden; }
@media (max-width: 700px) {
  .pg-head { padding: 1rem 1rem .5rem; } .pg-tools, .pg-body { padding-left: 1rem; padding-right: 1rem; }
  .pg-grid { grid-template-columns: 1fr; }
  .pg-filters { flex-wrap: nowrap; overflow-x: auto; padding-bottom: .2rem; }
  .pg-filters button { flex: none; }
}
@media (prefers-reduced-motion: reduce) { .field.pio-pulse circle.core { animation: none !important; } }
`;
const st = document.createElement("style");
st.textContent = css;
document.head.appendChild(st);

window.openPioneer = openPioneer;
window.openPioneerGallery = openGallery;
})();
