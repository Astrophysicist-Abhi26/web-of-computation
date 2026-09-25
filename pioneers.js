/* ============================================================
   THE WEB OF COMPUTATION — pioneers.js
   · Constellation: a circular portrait (or monogram) for every
     pioneer across the top of the sky, in chronological order.
   · Biography panel: portrait, timeline, key works, and links
     that light up the person's fields on the map.
   · Gallery: everyone, grouped by era, with search and filters.

   Data:      PEOPLE     (pioneers-data.js)
   Portraits: a photo at portraits/<id>.jpg is picked up automatically;
   its credit line comes from PORTRAITS (portraits/credits.js). Photos
   are shown in their natural colours in a thin gold ring. Anyone
   without a photo gets a quiet dark medallion with their initials.

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
// A credits entry wins; otherwise portraits/<id>.jpg is used if it exists.
const FOUND = {};
function portrait(p) { const q = PORTRAITS[p.id]; return q && q.file ? q : (FOUND[p.id] || null); }
function fieldById(id) {
  for (const d of DOMAINS) for (const f of (FIELDS[d.id] || [])) if (f.id === id) return { f, d };
  return null;
}

/* ---------- the portrait ---------- */
// One markup function for the map, the panel and the gallery.
// Returns SVG children centred on (cx, cy) with portrait radius R.
let UID = 0;
function portraitMarkup(p, cx, cy, R) {
  const id = "pc" + (++UID), pic = portrait(p), g = R / 40;
  const inner = pic
    ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#1a1230"/>
       <image href="${esc(pic.file)}" x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" preserveAspectRatio="xMidYMin slice"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#woc-medal)"/>
       <circle cx="${cx}" cy="${cy}" r="${(R * .84).toFixed(1)}" fill="none" stroke="rgba(245,196,81,.22)" stroke-width="${.8 * g}"/>
       <text x="${cx}" y="${cy}" dy=".36em" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="400"
         font-size="${(R * .6).toFixed(1)}" fill="#e6d9b8" fill-opacity=".82" letter-spacing="${(R * .03).toFixed(2)}">${esc(initials(p))}</text>`;
  return `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    <g clip-path="url(#${id})">${inner}</g>
    <circle class="pt-ring" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(245,196,81,.75)" stroke-width="${1.6 * g}"/>`;
}
// A standalone <svg> for HTML contexts (panel, gallery)
function portraitSVG(p, R, label) {
  const pad = Math.round(R * .08) + 2, S = 2 * (R + pad);
  return `<svg class="pt${portrait(p) ? " has-photo" : ""}" data-pid="${p.id}" data-r="${R}" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"
    style="width:${S}px;height:${S}px" role="img" aria-label="${esc(label || p.name)}">${portraitMarkup(p, S / 2, S / 2, R)}</svg>`;
}
const hidden = document.createElementNS(NS, "svg");
hidden.setAttribute("width", 0); hidden.setAttribute("height", 0);
hidden.setAttribute("aria-hidden", "true");
hidden.style.position = "absolute";
hidden.innerHTML = `<defs><radialGradient id="woc-medal" cx="38%" cy="32%" r="75%">
  <stop offset="0" stop-color="#3a2d58"/><stop offset=".6" stop-color="#231a3b"/><stop offset="1" stop-color="#150e26"/></radialGradient></defs>`;
document.body.appendChild(hidden);

// Look for portraits/<id>.jpg for everyone without a credits entry, and
// swap the photo in wherever that person is already drawn.
function probePhotos() {
  for (const p of PEOPLE) {
    if (PORTRAITS[p.id] && PORTRAITS[p.id].file) continue;
    const img = new Image();
    img.onload = () => { FOUND[p.id] = { file: `portraits/${p.id}.jpg` }; refreshPortrait(p); };
    img.src = `portraits/${p.id}.jpg`;
  }
}
function refreshPortrait(p) {
  if (p._holder) p._holder.innerHTML = portraitMarkup(p, p._x, p._y, TR);
  document.querySelectorAll(`svg.pt[data-pid="${p.id}"]`).forEach(svg => {
    svg.outerHTML = portraitSVG(p, +svg.dataset.r, svg.getAttribute("aria-label"));
  });
  const cap = document.querySelector(`.pio-hero[data-pid="${p.id}"] figcaption`);
  if (cap) cap.outerHTML = creditHTML(p);
}

/* ---------- the constellation ---------- */
// Twelve featured pioneers sit on the map in one row under the title, left
// to right in order of their defining year, large enough to recognise.
// Everyone (all of PEOPLE) is in the gallery.
const FEATURED = ["babbage","lovelace","turing","vonneumann","shannon","hopper","mccarthy",
  "hinton","feifeili","sutskever","hassabis","amodei"];
const ROW_Y = -20, X0 = 74, X1 = 1316, TR = 40;
const ONMAP = CHRONO.filter(p => FEATURED.includes(p.id));
ONMAP.forEach((p, i) => {
  const x = X0 + i * (X1 - X0) / (ONMAP.length - 1);
  const y = ROW_Y;
  const g = svgEl("g", { class:"pioneer", tabindex:-1, role:"button", "aria-label":`${p.name}, ${dates(p)}` }, Lpeople);
  svgEl("title", {}, g).textContent = `${p.name} · ${dates(p)}\n${p.epitaph}`;
  const holder = svgEl("g", {}, g);
  holder.innerHTML = portraitMarkup(p, x, y, TR);
  p._holder = holder; p._x = x; p._y = y;
  svgEl("text", { x, y:y + TR + 30, class:"plabel" }, g).textContent = shortName(p);
  g.addEventListener("click", () => openPioneer(p.id));
  g.addEventListener("keydown", e => { if (e.key === "Enter") openPioneer(p.id); });
  p._el = g;
});
setYear(S.year);   // sync the new constellation with the time scrubber
probePhotos();

/* ---------- biography panel ---------- */
let pulseT = null;
function lightFields(p, on) {
  DOMAINS.forEach(d => d._el.classList.toggle("linked", on && p.dom.includes(d.id)));
  for (const id of p.fields) { const r = fieldById(id); if (r) r.f._el.classList.toggle("pio-lit", on); }
}
function portraitHTML(p, R) { return portraitSVG(p, R, "Portrait of " + p.name); }
function creditHTML(p) {
  const pic = portrait(p);
  if (!pic) return `<figcaption>Photo not added yet</figcaption>`;
  if (!pic.artist && !pic.license) return `<figcaption>Photo credit not recorded yet (portraits/credits.js)</figcaption>`;
  const lic = pic.licenseUrl ? `<a href="${esc(pic.licenseUrl)}" target="_blank" rel="noopener">${esc(pic.license)}</a>` : esc(pic.license || "");
  const src = pic.source ? ` · <a href="${esc(pic.source)}" target="_blank" rel="noopener">source</a>` : "";
  return `<figcaption>Photo: ${esc(pic.artist || "unknown")} · ${lic}${src}</figcaption>`;
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
      <figure class="pio-hero" data-pid="${p.id}">${portraitHTML(p, 76)}${creditHTML(p)}</figure>
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
        <p class="pg-sub"><span id="pg-count"></span> people, in order of the work that put them on the map. Those marked ✦ also appear in the sky.</p>
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
        <span class="pg-pic">${portraitHTML(p, 32)}</span>
        <span class="pg-txt">
          <b>${esc(p.name)}${FEATURED.includes(p.id) ? ' <span class="pg-star" title="In the sky">✦</span>' : ""}</b>
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
.pioneer .plabel { font-family: "IBM Plex Mono", monospace; font-size: 15px; font-weight: 500; fill: #ffe9a8; text-anchor: middle;
  paint-order: stroke; stroke: rgba(0,0,0,.75); stroke-width: 3px; letter-spacing: .02em; }
.pioneer .pt-ring { transition: stroke .2s, stroke-width .2s; }
.pioneer:hover .pt-ring, .pioneer:focus-visible .pt-ring { stroke: #ffe39a; stroke-width: 2.6; }
.pioneer:hover .plabel { fill: #fff; }
.pioneer { filter: drop-shadow(0 4px 10px rgba(0,0,0,.55)); }
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
.pt { display: block; overflow: visible; }
.pio-hero .pt { filter: drop-shadow(0 6px 22px rgba(0,0,0,.5)); }
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
.pg-card { display: grid; grid-template-columns: 68px 1fr; gap: .7rem; align-items: start; text-align: left; cursor: pointer;
  background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.09); border-radius: 14px; padding: .75rem;
  color: var(--ink); font: inherit; transition: border-color .15s, background .15s; }
.pg-card:hover, .pg-card:focus-visible { border-color: var(--gold); background: rgba(245,196,81,.07); outline: none; }
.pg-card.later { opacity: .55; }
.pg-pic { width: 68px; height: 68px; display: grid; place-items: center; }
.pg-pic .pt { width: 68px !important; height: 68px !important; }
.pg-txt { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.pg-txt b { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 1rem; }
.pg-dates { font-family: "IBM Plex Mono", monospace; font-size: .66rem; color: var(--gold); }
.pg-ep { font-size: .82rem; line-height: 1.4; color: var(--dim); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.pg-dots { display: flex; gap: .3rem; align-items: center; margin-top: .25rem; }
.pg-dots i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); }
.pg-y { font-family: "IBM Plex Mono", monospace; font-size: .62rem; color: var(--dim); margin-right: .2rem; }
.pg-empty { color: var(--dim); padding: 2rem 0; }
.pg-star { color: var(--gold); font-size: .8rem; }
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
