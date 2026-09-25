/* ============================================================
   THE WEB OF COMPUTATION — guide-kit.js
   Shared scaffolding for the interactive field guides, so each
   guide file only has to hold its content and its labs. Renders
   exactly like the hand-built guides (information-theory.js,
   data-structures.js …): one <section class="it-module"> in the
   side panel using the shared it-* classes.

   A guide registers itself with:
     GuideKit.register("fieldId", {
       kicker, hook, intro,
       timeline: [[year, label], …],
       labs: [{ kicker, title, intro, html, caveat, init(root) }],
       chapters: [{ icon, title, who, lead, formula, what, how, story, today }],
       challenges: ["…"],
       sources: [{ type, title, note, url }],
       css: "…"                       // optional, scoped to #panel
     });
   app.js opens it via GUIDES[field.id]() when the field is clicked.
   ============================================================ */
(function () {
"use strict";

window.GUIDES = window.GUIDES || {};

const KIT_CSS = `
  #panel .gk-out{font:.72rem/1.6 "IBM Plex Mono",monospace;color:#cfc9e4;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.09);
    border-radius:8px;padding:.55rem .65rem;margin:.55rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .gk-out .g{color:var(--gold);font-weight:600}
  #panel .gk-out .t{color:#7fe3d6;font-weight:600}
  #panel .gk-out .r{color:#ff8f7a;font-weight:600}
  #panel .gk-out .d{color:#8d86a8}
  #panel .gk-chips{display:flex;gap:.3rem;flex-wrap:wrap;margin:.45rem 0}
  #panel .gk-chip{font:500 .64rem/1 "IBM Plex Mono",monospace;color:#d9d3ee;background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:.38rem .6rem;cursor:pointer}
  #panel .gk-chip:hover{border-color:rgba(245,196,81,.6)}
  #panel .gk-chip.on{background:rgba(245,196,81,.16);border-color:var(--gold);color:#fff}
  #panel .gk-ghost{font:500 .67rem "IBM Plex Mono",monospace;color:var(--gold);background:none;border:1px solid rgba(245,196,81,.5);
    border-radius:8px;padding:.48rem .7rem;cursor:pointer}
  #panel .gk-ghost:hover{background:rgba(245,196,81,.08)}
  #panel .gk-send:disabled,#panel .it-send:disabled{opacity:.4;cursor:default}
  #panel .gk-canvas{display:block;width:100%;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(0,0,0,.25);margin:.55rem 0;touch-action:none}
  #panel .gk-input{font:.72rem "IBM Plex Mono",monospace;color:var(--ink);background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.16);
    border-radius:7px;padding:.45rem .55rem;min-width:0;flex:1}
  #panel .gk-input:focus,#panel .gk-select:focus{outline:none;border-color:var(--gold)}
  #panel .gk-select{font:.68rem "IBM Plex Mono",monospace;color:var(--ink);background:#140c24;border:1px solid rgba(255,255,255,.16);border-radius:7px;padding:.4rem .5rem}
  #panel .gk-table{width:100%;border-collapse:collapse;margin:.5rem 0;font:500 .64rem/1.35 "IBM Plex Mono",monospace}
  #panel .gk-table th,#panel .gk-table td{border:1px solid rgba(255,255,255,.1);padding:.3rem .35rem;text-align:center;color:#d8d2ea}
  #panel .gk-table th{color:#9d96b8;font-weight:500}
  #panel .gk-table td.hl{background:rgba(245,196,81,.14);color:#fff}
  #panel .gk-table td.tl{text-align:left}
  #panel .gk-bars{display:flex;flex-direction:column;gap:.32rem;margin:.5rem 0}
  #panel .gk-bar{display:grid;grid-template-columns:6.4rem 1fr 3.6rem;gap:.45rem;align-items:center;font:500 .64rem "IBM Plex Mono",monospace;color:#d8d2ea}
  #panel .gk-bar .trk{height:.95rem;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.08);border-radius:5px;overflow:hidden}
  #panel .gk-bar .fill{height:100%;border-radius:4px;transition:width .35s ease}
  #panel .gk-bar .v{text-align:right}
  #panel .gk-cells{display:grid;gap:3px;margin:.5rem 0}
  #panel .gk-cell{aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;
    font:600 .62rem "IBM Plex Mono",monospace;color:#fff;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer;user-select:none}
  #panel .gk-row{display:flex;gap:.45rem;align-items:center;flex-wrap:wrap;margin:.45rem 0}
  #panel .gk-pill{display:inline-block;font:500 .6rem "IBM Plex Mono",monospace;border-radius:999px;padding:.12rem .45rem;margin:0 .15rem .15rem 0;
    border:1px solid rgba(255,255,255,.16);color:#d8d2ea}
  #panel .gk-chat{display:flex;flex-direction:column;gap:.35rem;margin:.5rem 0;max-height:15rem;overflow-y:auto;padding-right:.2rem}
  #panel .gk-msg{font-size:.76rem;line-height:1.45;padding:.45rem .6rem;border-radius:10px;max-width:88%}
  #panel .gk-msg.you{align-self:flex-end;background:rgba(245,196,81,.14);border:1px solid rgba(245,196,81,.35)}
  #panel .gk-msg.bot{align-self:flex-start;background:rgba(127,227,214,.08);border:1px solid rgba(127,227,214,.3);font-family:"IBM Plex Mono",monospace;font-size:.7rem}
  #panel button.gk-pick{color:var(--ink);text-align:left;cursor:pointer;font-family:inherit}
  #panel button.gk-pick:hover{border-color:var(--gold);background:rgba(245,196,81,.08)}
  #panel .gk-topics .topic{padding:.55rem 0}
  #panel .gk-topics .topic h3{font-size:.86rem}
  #panel .it-timeline.gk-tl{grid-template-columns:repeat(var(--n,5),1fr)}
`;

function ensureStyles(extra, id) {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("guide-kit-css")) {
    const st = document.createElement("style"); st.id = "guide-kit-css"; st.textContent = KIT_CSS; document.head.appendChild(st);
  }
  if (extra && !document.getElementById(id)) {
    const st = document.createElement("style"); st.id = id; st.textContent = extra; document.head.appendChild(st);
  }
}

function fieldById(id) {
  for (const d in FIELDS) for (const f of FIELDS[d]) if (f.id === id) return f;
  return null;
}
const MARK = { found:"🏛", fire:"🔥", work:"⚙️", obs:"🪦", rev:"🧟" };

function chapterMarkup(c, i) {
  return `<details class="it-chapter" ${i === 0 ? "open" : ""}>
    <summary>
      <span class="it-chapter-title">${c.icon} ${c.title}</span>
      <span class="it-chapter-meta">${c.who}</span>
      <span class="it-chapter-lead">${c.lead}</span>
    </summary>
    <div class="it-chapter-body">
      <code class="it-formula">${c.formula}</code>
      <div class="it-tabs" role="tablist" aria-label="${c.title.replace(/"/g, "")} perspectives">
        <button class="it-tab on" data-view="what">WHAT</button>
        <button class="it-tab" data-view="how">HOW</button>
        <button class="it-tab" data-view="story">STORY</button>
        <button class="it-tab" data-view="today">TODAY</button>
      </div>
      <p class="it-copy">${c.what}</p>
    </div>
  </details>`;
}
function sourceMarkup(s) {
  return `<a class="it-source" href="${s.url}" target="_blank" rel="noopener">
    <small>${s.type}</small><strong>${s.title}</strong><span>${s.note}</span><i aria-hidden="true">↗</i></a>`;
}
function labMarkup(l, i) {
  return `<section class="it-lab">
    <div class="it-kicker">LAB ${i + 1} · ${l.kicker}</div>
    <h3>${l.title}</h3>
    <p class="it-lab-intro">${l.intro}</p>
    ${l.html}
    ${l.caveat ? `<p class="it-caveat">${l.caveat}</p>` : ""}
  </section>`;
}
function topicsMarkup(f) {
  if (!f || !f.topics || !f.topics.length) return "";
  return `<h3 class="it-section-title">The ${f.topics.length} topics on the map</h3>
    <div class="gk-topics">${f.topics.map(t => `<div class="topic${t.y > S.year ? " unborn" : ""}">
      <h3>${MARK[t.s] || ""} ${t.n}</h3><div class="tmeta">${t.who} · ${t.y}</div><p>${t.d}</p></div>`).join("")}</div>`;
}

function register(fieldId, spec) {
  window.GUIDES[fieldId] = function open() {
    ensureStyles(spec.css, "gk-css-" + fieldId);
    const body = document.getElementById("panel-body");
    if (!body) return;
    if (body.querySelector(".it-module")) return;           // already built for this open
    body.querySelectorAll(":scope > .topic").forEach(t => t.remove());
    const f = fieldById(fieldId);
    const mod = document.createElement("section");
    mod.className = "it-module";
    mod.innerHTML = `
      <div class="it-kicker">INTERACTIVE FIELD GUIDE · ${spec.kicker}</div>
      <p class="it-hook">${spec.hook}</p>
      <p class="it-intro">${spec.intro}</p>
      <div class="it-timeline gk-tl" style="--n:${spec.timeline.length}" aria-label="Timeline">
        ${spec.timeline.map(([y, l]) => `<div class="it-moment"><b>${y}</b><span>${l}</span></div>`).join("")}
      </div>
      ${spec.labs.map(labMarkup).join("")}
      <h3 class="it-section-title">The story, in ${["zero","one","two","three","four","five","six","seven","eight"][spec.chapters.length] || spec.chapters.length} movements</h3>
      ${spec.chapters.map(chapterMarkup).join("")}
      <div class="it-challenges"><b>${spec.challenges.length === 3 ? "Three" : spec.challenges.length === 4 ? "Four" : spec.challenges.length === 5 ? "Five" : "Six"} things to try</b><ol>
        ${spec.challenges.map(c => `<li>${c}</li>`).join("")}
      </ol></div>
      ${topicsMarkup(f)}
      <h3 class="it-section-title">Landmark papers, books &amp; where to go deeper</h3>
      ${spec.sources.map(sourceMarkup).join("")}`;
    body.appendChild(mod);
    mod.querySelectorAll("details.it-chapter").forEach((d, i) => {
      d.querySelectorAll(".it-tab").forEach(btn => btn.addEventListener("click", () => {
        d.querySelectorAll(".it-tab").forEach(b => b.classList.toggle("on", b === btn));
        d.querySelector(".it-copy").innerHTML = spec.chapters[i][btn.dataset.view];
      }));
    });
    const labs = mod.querySelectorAll(":scope > .it-lab");
    spec.labs.forEach((l, i) => { if (l.init) { try { l.init(labs[i]); } catch (e) { console.error("guide lab", fieldId, i, e); } } });
  };
}

/* ---------- small helpers shared by the labs ---------- */
function canvas(el, height) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = el.clientWidth || 360, h = height || 200;
  el.width = Math.round(w * dpr); el.height = Math.round(h * dpr); el.style.height = h + "px";
  const ctx = el.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const C = { gold:"#f5c451", teal:"#3fd0c9", red:"#ff7847", green:"#57e08a", violet:"#b48cff", ink:"#e8e4f4", dim:"#9a93b8", blue:"#7aa8ff", pink:"#ff7ac8" };

window.GuideKit = { register, canvas, rng, gauss, C, fieldById, ensureStyles };
})();
