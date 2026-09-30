/* ============================================================
   THE WEB OF COMPUTATION — atoms3.js  (Wave 1)
   Promotes the most hands-on labs from the field guides into
   full playable atoms: listed in the ⚛ atoms window, filterable
   by domain, and playable full screen.

   Each atom renders its lab fresh when opened (so it always
   starts clean and fits the window) and clears it on close.
   The guides' styles are written for the side panel (#panel …);
   they are mirrored for the atoms window (#atoms …) on demand.
   Inside a guide, each promoted lab gets a "⤢ play full size"
   button that opens its atom.

   Needs: guide-kit.js (GUIDE_SPECS), the guides, extras.js
   (WOC_EXTRAS) and atoms2.js (WOC_ATOMS), loaded first.
   ============================================================ */
(function () {
"use strict";
if (!window.WOC_ATOMS || !window.GUIDE_SPECS) return;

// [domain, atom id, source ("guide field id" or "x:field" for extras.js labs), lab index, tab name]
const PROMOTE = [
  ["algo", "lab-sort",        "paradigms",       0, "Merge vs insertion sort"],
  ["algo", "lab-editdist",    "paradigms",       1, "Edit distance (DP)"],
  ["algo", "lab-astar",       "paradigms",       2, "Dijkstra & A*"],
  ["algo", "lab-mcpi",        "paradigms",       3, "Monte Carlo π"],
  ["lang", "lab-lisp",        "langs",           1, "LISP interpreter"],
  ["lang", "lab-gc",          "langs",           2, "Garbage collector"],
  ["lang", "lab-compiler",    "compilers",       0, "Compiler pipeline"],
  ["lang", "lab-curryhoward", "compilers",       1, "Curry–Howard"],
  ["lang", "lab-pipes",       "systems",         0, "Unix pipes"],
  ["lang", "lab-sched",       "systems",         1, "CPU scheduling"],
  ["lang", "lab-mapreduce",   "systems",         2, "MapReduce"],
  ["info", "lab-huffman",     "x:infotheory",    0, "Huffman coding"],
  ["info", "lab-hamming",     "x:infotheory",    1, "Hamming code"],
  ["info", "lab-sha",         "x:modern-crypto", 0, "SHA-256 avalanche"],
  ["data", "lab-sql",         "databases",       0, "SQL playground"],
  ["data", "lab-txn",         "databases",       1, "Transactions"],
  ["data", "lab-bayes",       "stats",           0, "Bayes' rule"],
  ["data", "lab-lsq",         "stats",           1, "Least squares"],
  ["data", "lab-mcmc",        "stats",           2, "MCMC random walk"],
  ["data", "lab-simpson",     "practice",        2, "Simpson's paradox"],
  ["ai",   "lab-eliza",       "symbolic",        0, "ELIZA"],
  ["ai",   "lab-minimax",     "symbolic",        1, "Minimax & alpha–beta"],
  ["ai",   "lab-expert",      "symbolic",        2, "Expert system"],
  ["ai",   "lab-prolog",      "symbolic",        3, "Prolog family tree"],
  ["ai",   "lab-turingtest",  "founding",        0, "The imitation game"],
  ["ai",   "lab-nash",        "decision",        0, "Nash equilibria"],
  ["ai",   "lab-axelrod",     "decision",        1, "Axelrod's tournament"],
  ["ml",   "lab-hebb",        "prehistory",      1, "Hebbian memory"],
  ["ml",   "lab-knn",         "classical",       0, "k-NN vs k-means"],
  ["ml",   "lab-forest",      "classical",       1, "Trees & forests"],
  ["ml",   "lab-conv",        "deep",            0, "Convolution"],
  ["ml",   "lab-embed",       "deep",            2, "Word embeddings"],
  ["ml",   "lab-diffusion",   "deep",            3, "Diffusion"],
  ["ml",   "lab-bpe",         "llm",             0, "BPE tokenizer"],
  ["ml",   "lab-nexttoken",   "llm",             1, "Next-token text"],
  ["ml",   "lab-rlhf",        "llm",             3, "RLHF rater"],
  ["ml",   "lab-qlearn",      "deeprl",          0, "Q-learning"],
  ["ml",   "lab-bandit",      "deeprl",          1, "Multi-armed bandits"],
  ["ml",   "lab-mcts",        "deeprl",          2, "Tic-tac-toe vs MCTS"],
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const fieldOf = src => { const fid = src.replace(/^x:/, ""); for (const d of DOMAINS) for (const f of FIELDS[d.id] || []) if (f.id === fid) return { f, d }; return null; };
const labOf = (src, i) => src.startsWith("x:")
  ? (window.WOC_EXTRAS && WOC_EXTRAS.EXTRA_LABS[src.slice(2)] || [])[i]
  : (GUIDE_SPECS[src] || { labs: [] }).labs[i];

/* ---------- styles: mirror the side panel's lab styles for the atoms window ---------- */
function mirrorPanelStyles() {
  document.querySelectorAll("style:not([data-atoms-mirror])").forEach(st => {
    if (st.dataset.mirrored || !st.textContent.includes("#panel")) return;
    st.dataset.mirrored = "1";
    const m = document.createElement("style");
    m.dataset.atomsMirror = st.id || "1";
    // only descendant rules (#panel .x, #panel > .x); #panel-body, #panel.open etc. are left alone
    m.textContent = st.textContent.replace(/#panel(?=[\s>])/g, "#atoms");
    document.head.appendChild(m);
  });
}
function ensureStyles(src) {
  if (src.startsWith("x:")) { if (window.WOC_EXTRAS) WOC_EXTRAS.ensureCSS(); }
  else if (window.GuideKit && GuideKit.ensureStyles) { const sp = GUIDE_SPECS[src]; GuideKit.ensureStyles(sp && sp.css, "gk-css-" + src); }
  mirrorPanelStyles();
}

const CSS = `
.lab-atom .lab-from { display: flex; justify-content: space-between; align-items: baseline; gap: .8rem; flex-wrap: wrap;
  font: .68rem "IBM Plex Mono", monospace; color: var(--dim); margin: 0 0 .6rem; }
.lab-atom .lab-from b { color: var(--ink); font-weight: 500; }
.lab-atom .lab-guide { font: inherit; color: var(--gold); background: none; border: 1px solid rgba(245,196,81,.4); border-radius: 999px; padding: .25rem .65rem; cursor: pointer; }
.lab-atom .lab-guide:hover, .lab-atom .lab-guide:focus-visible { background: rgba(245,196,81,.1); outline: none; }
.lab-atom .it-module { padding-bottom: 0; }
.lab-atom .it-lab { margin: 0; }
#atoms-box.full .lab-atom .it-lab { font-size: 1.08em; }
#panel .lab-full { display: inline-flex; align-items: center; gap: .3rem; font: 500 .62rem "IBM Plex Mono", monospace; color: var(--gold);
  background: rgba(245,196,81,.08); border: 1px solid rgba(245,196,81,.45); border-radius: 999px; padding: .28rem .65rem; margin: .1rem 0 .5rem; cursor: pointer; }
#panel .lab-full:hover, #panel .lab-full:focus-visible { background: rgba(245,196,81,.18); outline: none; }
`;
const st = document.createElement("style"); st.id = "atoms3-css"; st.dataset.atomsMirror = "self"; st.textContent = CSS; document.head.appendChild(st);

/* ---------- register every promoted lab ---------- */
const BY_SRC = {};   // "src|index" → atom id, for the buttons inside the guides
for (const [domain, id, src, i, name] of PROMOTE) {
  const lab = labOf(src, i), where = fieldOf(src);
  if (!lab || !where) { console.warn("atoms3: lab not found", src, i); continue; }
  BY_SRC[src + "|" + i] = id;
  const kicker = String(lab.kicker).replace(/^LAB \d+ · /, "");
  WOC_ATOMS.register({
    id, name, domain, cls: "lab-atom", fields: [],
    html: `<p class="lab-from"><span>From the <b>${esc(where.f.name)}</b> field guide</span><button class="lab-guide" type="button">open the guide →</button></p>
      <div class="it-module lab-host"></div>`,
    build(pane) {
      pane.querySelector(".lab-guide").addEventListener("click", () => {
        document.getElementById("atoms-close").click();
        if (window.zoomTo && S.zoomed !== where.d) zoomTo(where.d);
        setTimeout(() => openField(where.f, where.d), 300);
      });
    },
    start(pane) {
      ensureStyles(src);
      const host = pane.querySelector(".lab-host");
      host.innerHTML = `<section class="it-lab${src.startsWith("x:") ? " x-lab" : ""}">
        <div class="it-kicker">${kicker}</div><h3>${lab.title}</h3>
        <p class="it-lab-intro">${lab.intro}</p>${lab.html}${lab.caveat ? `<p class="it-caveat">${lab.caveat}</p>` : ""}</section>`;
      try { lab.init(host.querySelector(".it-lab")); } catch (e) { console.error("atom " + id, e); }
    },
    stop(pane) { const host = pane.querySelector(".lab-host"); if (host) host.innerHTML = ""; },
  });
}

/* ---------- "⤢ play full size" inside the guides ---------- */
if (typeof window.openField === "function") {
  const orig = window.openField;
  window.openField = function (f, d) {
    const r = orig.apply(this, arguments);
    const body = document.getElementById("panel-body");
    if (body) {
      const kit = [...body.querySelectorAll(".it-module > .it-lab:not(.x-lab)")];
      const extra = [...body.querySelectorAll(".it-module > .x-lab")];
      const add = (sec, id) => {
        if (!sec || sec.querySelector(".lab-full")) return;
        const b = document.createElement("button");
        b.className = "lab-full"; b.type = "button"; b.textContent = "⤢ play full size";
        b.addEventListener("click", () => window.openAtomFromField(id));
        const h = sec.querySelector("h3"); if (h) h.after(b); else sec.prepend(b);
      };
      if (GUIDE_SPECS[f.id]) kit.forEach((sec, i) => { const id = BY_SRC[f.id + "|" + i]; if (id) add(sec, id); });
      extra.forEach((sec, i) => { const id = BY_SRC["x:" + f.id + "|" + i]; if (id) add(sec, id); });
    }
    return r;
  };
}
})();
