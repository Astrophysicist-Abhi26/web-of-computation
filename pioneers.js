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
       <image href="${esc(pic.file)}" x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" preserveAspectRatio="xMidYMin slice" image-rendering="optimizeQuality" decoding="sync"/>`
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
  <stop offset="0" stop-color="#3a2d58"/><stop offset=".6" stop-color="#231a3b"/><stop offset="1" stop-color="#150e26"/></radialGradient>
  <radialGradient id="woc-shade"><stop offset=".62" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <radialGradient id="woc-glow"><stop offset=".6" stop-color="#ffe296" stop-opacity=".32"/><stop offset="1" stop-color="#ffe296" stop-opacity="0"/></radialGradient></defs>`;
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
  if (p._holder) p._holder.innerHTML = portraitMarkup(p, p._x, p._y, p._R);
  document.querySelectorAll(`svg.pt[data-pid="${p.id}"]`).forEach(svg => {
    svg.outerHTML = portraitSVG(p, +svg.dataset.r, svg.getAttribute("aria-label"));
  });
  const cap = document.querySelector(`.pio-hero[data-pid="${p.id}"] figcaption`);
  if (cap) cap.outerHTML = creditHTML(p);
}

/* ---------- arrangements on the map ---------- */
// Six ways to show pioneers on the map, switchable live from the
// "✦ pioneer layout" picker (remembered in this browser). Everyone is
// always in the gallery; FEATURED is whoever the current layout shows.
const SIXTEEN = ["babbage","lovelace","boole","turing","vonneumann","shannon","hopper","mccarthy",
  "minsky","rosenblatt","hinton","lecun","feifeili","sutskever","hassabis","amodei"];
const TWELVE = ["babbage","lovelace","turing","vonneumann","shannon","hopper","mccarthy",
  "hinton","feifeili","sutskever","hassabis","amodei"];
// who sits beside which domain, and which way the group faces (degrees, 0 = right)
const HOMES = {
  found: { ids:["boole","godel","turing"], dir:-150 },
  hard:  { ids:["babbage","lovelace","vonneumann"], dir:-95 },
  algo:  { ids:["dijkstra","knuth"], dir:-140 },
  lang:  { ids:["hopper","ritchie"], dir:-150 },
  info:  { ids:["shannon","diffie"], dir:-38 },
  data:  { ids:["codd","feifeili"], dir:8 },
  ai:    { ids:["mccarthy","minsky","hassabis"], dir:200 },
  ml:    { ids:["rosenblatt","hinton","lecun","sutskever","amodei"], dir:-40 },
};
// real links between people, drawn in the constellation layout
const LINKS = [
  ["babbage","lovelace","Worked together on the Analytical Engine (1840s)"],
  ["boole","shannon","Shannon's 1937 thesis turned Boole's algebra into circuits"],
  ["turing","vonneumann","Turing studied at Princeton, where von Neumann offered him a post (1938)"],
  ["turing","shannon","Met at Bell Labs in 1943 and talked about thinking machines"],
  ["mccarthy","minsky","Founded the MIT AI Project together (1959)"],
  ["minsky","rosenblatt","Rivals: symbolic AI against the perceptron", "rival"],
  ["hinton","lecun","LeCun was a postdoc in Hinton's lab (1987–88)"],
  ["hinton","sutskever","Sutskever did his PhD with Hinton; together they built AlexNet (2012)"],
  ["feifeili","sutskever","AlexNet was trained on Li's ImageNet"],
  ["sutskever","amodei","Colleagues at OpenAI"],
];
const LAYOUTS = {
  row:    { name:"Row of portraits",     home:"0 -190 1600 1190", people:TWELVE,  hint:"12 large portraits under the title, oldest on the left." },
  sky:    { name:"Constellation",        home:"0 -190 1600 1190", people:SIXTEEN, hint:"16 people as stars across the top of the sky, joined by real links: teachers, collaborators, rivals (red). Hover a line to read it." },
  home:   { name:"Beside their domain",  home:"0 -90 1600 1090",  people:null,    hint:"22 people, each next to the domain they shaped." },
  ribbon: { name:"On the timeline",      home:"0 -90 1600 1090",  people:SIXTEEN, hint:"16 portraits above the time scrubber at their year. They light up as you scrub through history." },
  rail:   { name:"Side wall",            home:"0 -90 1600 1090",  people:TWELVE,  hint:"A column of 12 portraits with names and dates on the right, like a museum wall." },
  off:    { name:"Gallery only",         home:"0 -90 1600 1090",  people:[],      hint:"No one on the map; open ▦ pioneer gallery to see everyone." },
};
LAYOUTS.home.people = Object.values(HOMES).flatMap(h => h.ids);
let LAYOUT = "row";
try { LAYOUT = localStorage.getItem("woc-pioneer-layout") || "row"; } catch (e) {}
if (!LAYOUTS[LAYOUT]) LAYOUT = "row";
let FEATURED = [];

const htmlLayer = document.createElement("div");
htmlLayer.id = "pio-layer"; document.body.appendChild(htmlLayer);

function clearLayout() {
  Lpeople.innerHTML = ""; htmlLayer.innerHTML = ""; htmlLayer.className = "";
  document.querySelectorAll(".pio-ribbon").forEach(n => n.remove());
  for (const p of PEOPLE) { p._el = p._holder = null; }
}
// one clickable portrait in the SVG map
function svgPerson(p, x, y, R, cls) {
  const g = svgEl("g", { class:"pioneer" + (cls ? " " + cls : ""), tabindex:-1, role:"button", "aria-label":`${p.name}, ${dates(p)}` }, Lpeople);
  svgEl("title", {}, g).textContent = `${p.name} · ${dates(p)}\n${p.epitaph}`;
  svgEl("circle", { cx:x, cy:y + R * .08, r:R * 1.32, fill:`url(#${cls === "star" ? "woc-glow" : "woc-shade"})`, class:"pt-shade" }, g);
  const holder = svgEl("g", { class:"pt-hold" }, g);
  holder.innerHTML = portraitMarkup(p, x, y, R);
  Object.assign(p, { _holder:holder, _x:x, _y:y, _R:R, _el:g });
  const t = svgEl("text", { x, y:y + R + Math.max(14, R * .6), class:"plabel" }, g);
  t.textContent = shortName(p); t.style.fontSize = Math.max(11, Math.min(15, R * .42)) + "px";
  g.style.transformOrigin = `${x}px ${y}px`;
  g.addEventListener("click", () => openPioneer(p.id));
  g.addEventListener("keydown", e => { if (e.key === "Enter") openPioneer(p.id); });
  return g;
}
// one clickable portrait in an HTML layout
function htmlPerson(p, R, withText) {
  const b = document.createElement("button");
  b.className = "pio-h"; b.type = "button"; b.dataset.pid = p.id;
  b.title = `${p.name} · ${dates(p)}`;
  b.innerHTML = portraitSVG(p, R, p.name) + (withText ? `<span class="pio-h-t"><b>${esc(p.name)}</b><i>${esc(dates(p))}</i></span>` : "");
  b.addEventListener("click", () => openPioneer(p.id));
  p._el = b;
  return b;
}
const peopleOf = ids => ids.map(id => byId[id]).filter(Boolean).sort((a, b) => a.y - b.y);

const BUILD = {
  row() {
    const list = peopleOf(TWELVE), X0 = 74, X1 = 1316;
    list.forEach((p, i) => svgPerson(p, X0 + i * (X1 - X0) / (list.length - 1), -20, 40));
  },
  sky() {
    const list = peopleOf(SIXTEEN), pos = {};
    list.forEach((p, i) => {
      const x = 80 + i * (1300 / (list.length - 1));
      const y = -28 + 50 * Math.sin(i * 1.9 + .6) + 12 * Math.cos(i * 3.3);   // stays below the title band
      pos[p.id] = [x, y];
    });
    const lines = svgEl("g", { class:"pio-links" }, Lpeople);
    for (const [a, b, why, kind] of LINKS) {
      if (!pos[a] || !pos[b]) continue;
      const [x1, y1] = pos[a], [x2, y2] = pos[b], mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 26 - Math.abs(x2 - x1) * .06;
      const path = svgEl("path", { d:`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, class:"pio-link" + (kind ? " " + kind : "") }, lines);
      svgEl("title", {}, path).textContent = why;
      const hit = svgEl("path", { d:path.getAttribute("d"), class:"pio-link-hit" }, lines);
      svgEl("title", {}, hit).textContent = why;
    }
    list.forEach(p => { const [x, y] = pos[p.id]; svgPerson(p, x, y, 30, "star"); });
  },
  home() {
    const R = 22;
    for (const d of DOMAINS) {
      const h = HOMES[d.id]; if (!h) continue;
      const list = peopleOf(h.ids), rad = d.r + 64, step = (2 * R + 34) / rad, a0 = h.dir * Math.PI / 180;
      list.forEach((p, k) => {
        const a = a0 + (k - (list.length - 1) / 2) * step;
        svgPerson(p, d.x + rad * Math.cos(a), d.y + rad * Math.sin(a), R, "near");
      });
    }
  },
  ribbon() {
    // one even row of portraits above the scrubber, each with a thin line down to its year
    const wrap = document.querySelector("#timebar .slider-wrap"); if (!wrap) return;
    const rib = document.createElement("div"); rib.className = "pio-ribbon"; wrap.appendChild(rib);
    const list = peopleOf(SIXTEEN), W = wrap.clientWidth || 580, H = 74, n = list.length;
    const slot = W / n, R = Math.max(11, Math.min(16, slot / 2 - 3));
    let lines = "";
    list.forEach((p, i) => {
      const cx = slot * (i + .5), yx = (p.y - 1822) / (2026 - 1822) * W;
      lines += `<path data-pid="${p.id}" d="M${cx.toFixed(1)} ${2 * R + 8} C${cx.toFixed(1)} ${H - 18} ${yx.toFixed(1)} ${H - 22} ${yx.toFixed(1)} ${H}"/>`;
      const b = htmlPerson(p, R, false);
      b.style.left = cx + "px";
      b.insertAdjacentHTML("beforeend", `<span class="pio-rb-n">${esc(p.name)} · ${p.y}</span>`);
      rib.appendChild(b);
    });
    rib.insertAdjacentHTML("afterbegin", `<svg class="pio-rb-lines" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">${lines}</svg>`);
    rib.style.height = H + "px";
  },
  rail() {
    htmlLayer.className = "rail";
    htmlLayer.innerHTML = `<div class="pio-rail-h">Pioneers <button type="button">all ${PEOPLE.length} ▸</button></div>`;
    htmlLayer.querySelector("button").addEventListener("click", openGallery);
    peopleOf(TWELVE).forEach(p => htmlLayer.appendChild(htmlPerson(p, 19, true)));
  },
  off() {},
};
function applyLayout(name, animate) {
  LAYOUT = name; clearLayout();
  const L = LAYOUTS[name];
  FEATURED = L.people.slice();
  BUILD[name]();
  document.body.dataset.pioLayout = name;
  if (window.setHome) setHome(L.home); 
  setYear(S.year);   // dim anyone not born yet on the scrubber
  const hint = document.getElementById("pio-pick-hint"); if (hint) hint.textContent = L.hint;
}
applyLayout(LAYOUT);
probePhotos();
addEventListener("resize", () => { if (LAYOUT === "ribbon") applyLayout("ribbon"); });

// the picker, next to the crack-style picker
{
  const toggles = document.getElementById("toggles");
  if (toggles) {
    const lab = document.createElement("label");
    lab.id = "pio-pick";
    lab.innerHTML = `<span>✦ pioneer layout</span><select aria-label="How pioneers are arranged on the map">
      ${Object.entries(LAYOUTS).map(([k, l], i) => `<option value="${k}">${String.fromCharCode(65 + i)} · ${l.name}</option>`).join("")}</select>
      <small id="pio-pick-hint"></small>`;
    const crack = document.getElementById("crack-pick");
    toggles.insertBefore(lab, crack || null);
    const sel = lab.querySelector("select"); sel.value = LAYOUT;
    document.getElementById("pio-pick-hint").textContent = LAYOUTS[LAYOUT].hint;
    sel.addEventListener("change", () => {
      try { localStorage.setItem("woc-pioneer-layout", sel.value); } catch (e) {}
      if (!S.people) document.getElementById("toggle-people").click();   // make sure they're visible
      applyLayout(sel.value);
    });
  }
}

/* ---------- biography panel ---------- */
let pulseT = null;
function lightFields(p, on) {
  DOMAINS.forEach(d => d._el.classList.toggle("linked", on && p.dom.includes(d.id)));
  for (const id of p.fields) { const r = fieldById(id); if (r) r.f._el.classList.toggle("pio-lit", on); }
}
function portraitHTML(p, R) { return portraitSVG(p, R, "Portrait of " + p.name); }
// One credit line per photo: who took it, the licence or permission, and where it came from.
function creditText(pic) {
  const lic = pic.licenseUrl ? `<a href="${esc(pic.licenseUrl)}" target="_blank" rel="noopener">${esc(pic.license)}</a>` : esc(pic.license || "");
  const src = pic.source ? `<a href="${esc(pic.source)}" target="_blank" rel="noopener">source</a>` : "";
  return [pic.artist ? "Photo: " + esc(pic.artist) : "", lic, pic.note ? esc(pic.note) : "", src].filter(Boolean).join(" · ");
}
function creditHTML(p) {
  const pic = portrait(p);
  if (!pic) return `<figcaption>Photo not added yet</figcaption>`;
  if (!pic.artist && !pic.license && !pic.note) return `<figcaption>Photo credit not recorded yet (portraits/credits.js)</figcaption>`;
  return `<figcaption>${creditText(pic)}</figcaption>`;
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
        <p class="pg-sub"><span id="pg-count"></span> people, in order of the work that put them on the map. Those marked ✦ also appear in the sky. <a href="#pg-credits" class="pg-credlink">Photo credits ↓</a></p>
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
gal.querySelector(".pg-credlink").addEventListener("click", e => {
  e.preventDefault(); const c = gal.querySelector("#pg-credits"); if (c) c.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
});

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
          <span class="pg-dates">${esc([dates(p), p.died == null ? "living" : ""].filter(Boolean).join(" · "))}</span>
          <span class="pg-ep">${esc(p.epitaph)}</span>
          <span class="pg-dots"><span class="pg-y">${p.y}</span>${dots}</span>
        </span>
      </button>`;
  }
  html += "</div></section>";
  pgBody.innerHTML = html + creditsSection();
  pgBody.querySelectorAll(".pg-card").forEach(c => c.addEventListener("click", () => { closeGallery(); openPioneer(c.dataset.id); }));
}
// Every photo in use, with its credit: the site's image-credits page.
function creditsSection() {
  const withPic = CHRONO.filter(p => portrait(p));
  const rows = withPic.map(p => { const pic = portrait(p);
    return `<li><b>${esc(p.name)}</b> — ${pic.artist || pic.license || pic.note ? creditText(pic) : "credit not recorded yet"}</li>`; }).join("");
  return `<section class="pg-credits" id="pg-credits"><h3>Photo credits</h3>
    <p>${withPic.length ? `${withPic.length} of ${PEOPLE.length} pioneers have a photo. Each one is listed with its photographer, its licence or permission, and its source.`
      : "No photos have been added yet. Every photo added to the site will be listed here with its photographer, its licence or permission, and its source."}
      Photos stay the property of their owners.</p>${rows ? `<ul>${rows}</ul>` : ""}</section>`;
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
/* no CSS filters on portraits: browsers rasterise filtered SVG at low resolution and the photo blurs */
body.zoomed .pioneer { opacity: .08 !important; pointer-events: none !important; }
body.topic-focus .pioneer { opacity: 0 !important; }
.field.pio-lit circle.core { stroke: var(--gold); stroke-width: 3; }
.field.pio-pulse circle.core { animation: pioPulse 1s ease-in-out 3 !important; }
@keyframes pioPulse { 0%,100% { filter: drop-shadow(0 0 4px #f5c451); } 50% { filter: drop-shadow(0 0 18px #f5c451) brightness(1.6); } }

/* layouts */
.pioneer.star .pt-hold, .pioneer.near .pt-hold { transition: transform .25s ease; transform-box: fill-box; transform-origin: center; will-change: auto; }
.pioneer.star:hover .pt-hold, .pioneer.near:hover .pt-hold, .pioneer.star:focus-visible .pt-hold { transform: scale(1.35); }
.pio-links { pointer-events: none; transition: opacity .5s; }
body:not(.people) .pio-links, body.zoomed .pio-links, body.topic-focus .pio-links { opacity: 0; }
.pio-link { fill: none; stroke: rgba(255,226,150,.38); stroke-width: 1.2; stroke-dasharray: 3 5; }
.pio-link.rival { stroke: rgba(255,120,100,.55); }
.pio-link-hit { fill: none; stroke: transparent; stroke-width: 12; pointer-events: stroke; cursor: help; }
body:not(.people) .pio-link-hit, body.zoomed .pio-link-hit { pointer-events: none; }
.pioneer.unborn { opacity: .12 !important; }
#pio-layer { display: none; }
body.people #pio-layer.rail { display: flex; flex-direction: column; gap: .15rem; position: fixed; right: 1.2rem; top: 12.8rem; bottom: 1.2rem;
  z-index: 14; width: 13rem; overflow-y: auto; padding: .55rem .5rem; background: var(--glass); border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); scrollbar-width: thin; }
body.zoomed #pio-layer.rail, body:has(#panel.open) #pio-layer.rail { display: none; }
.pio-rail-h { display: flex; justify-content: space-between; align-items: baseline; font: 500 .64rem "IBM Plex Mono", monospace;
  letter-spacing: .12em; text-transform: uppercase; color: var(--gold); padding: .1rem .35rem .35rem; }
.pio-rail-h button { font: inherit; letter-spacing: .04em; text-transform: none; color: var(--dim); background: none; border: 0; cursor: pointer; }
.pio-rail-h button:hover { color: var(--gold); }
.pio-h { display: flex; align-items: center; gap: .55rem; background: none; border: 0; border-radius: 10px; padding: .2rem .35rem;
  color: var(--ink); cursor: pointer; text-align: left; font: inherit; transition: background .15s, opacity .3s; }
.pio-h:hover, .pio-h:focus-visible { background: rgba(245,196,81,.09); outline: none; }
.pio-h .pt { flex: none; }
.pio-h-t { display: flex; flex-direction: column; min-width: 0; }
.pio-h-t b { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: .86rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pio-h-t i { font: normal .62rem "IBM Plex Mono", monospace; color: var(--gold); }
.pio-h.unborn { opacity: .25; }
.pio-ribbon { position: absolute; left: 0; right: 0; bottom: 100%; pointer-events: none; }
body:not(.people) .pio-ribbon { display: none; }
.pio-rb-lines { position: absolute; left: 0; top: 0; width: 100%; overflow: visible; }
.pio-rb-lines path { fill: none; stroke: rgba(245,196,81,.4); stroke-width: 1; }
.pio-ribbon .pio-h { position: absolute; top: 0; transform: translateX(-50%); padding: 0; border-radius: 50%; pointer-events: auto; }
.pio-ribbon .pio-h:hover { background: none; z-index: 2; }
.pio-ribbon .pio-h .pt { transition: transform .2s; transform-origin: 50% 100%; }
.pio-ribbon .pio-h:hover .pt, .pio-ribbon .pio-h:focus-visible .pt { transform: scale(1.7); }
body[data-pio-layout="ribbon"] #timebar { padding-top: 5.4rem; }
.pio-rb-n { position: absolute; bottom: calc(100% + 30px); left: 50%; transform: translateX(-50%); white-space: nowrap; font: .62rem "IBM Plex Mono", monospace;
  color: #fff; background: rgba(14,6,24,.92); border: 1px solid rgba(245,196,81,.4); border-radius: 6px; padding: .15rem .4rem; opacity: 0; transition: opacity .15s; pointer-events: none; }
.pio-ribbon .pio-h:hover .pio-rb-n, .pio-ribbon .pio-h:focus-visible .pio-rb-n { opacity: 1; }
.pio-ribbon .pio-h.unborn { opacity: .22; }
#pio-pick { display: flex; flex-direction: column; gap: .25rem; font-family: "IBM Plex Mono", monospace; max-width: 13.5rem;
  font-size: .64rem; letter-spacing: .06em; color: var(--dim); background: var(--glass);
  border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: .45rem .7rem; }
#pio-pick select { font-family: inherit; font-size: .7rem; color: var(--gold); background: transparent; border: 0; outline: none; cursor: pointer; padding: 0; }
#pio-pick select option { background: #140c24; color: var(--ink); }
#pio-pick small { font-size: .58rem; line-height: 1.45; letter-spacing: .02em; color: var(--dim); }
#pio-pick:focus-within { border-color: var(--gold); }
@media (max-width: 700px) { body.people #pio-layer.rail { display: none; } #pio-pick small { display: none; } }

/* biography */
.pio h2 { margin-top: .1rem; }
.pio .meta { margin-bottom: .2rem !important; }
.pio-alive { color: #9fe8c0; border: 1px solid rgba(159,232,192,.5); border-radius: 999px; padding: 0 .45rem; margin-left: .3rem; }
.pio-hero { margin: 0 0 1rem; display: flex; flex-direction: column; align-items: center; gap: .45rem; }
.pt { display: block; overflow: visible; }
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
.pg-credlink { color: var(--gold); }
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
.pg-credits { margin-top: 1.6rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,.1); font-size: .82rem; color: var(--dim); line-height: 1.55; }
.pg-credits h3 { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 1rem; color: var(--ink); margin-bottom: .35rem; }
.pg-credits ul { margin: .5rem 0 0; padding-left: 1.1rem; display: grid; gap: .25rem; }
.pg-credits b { color: var(--ink); font-weight: 600; }
.pg-credits a { color: #7fe3d6; }
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
