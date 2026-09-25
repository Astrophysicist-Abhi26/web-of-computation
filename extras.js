/* ============================================================
   THE WEB OF COMPUTATION — extras.js
   The depth layer that sits on top of every field guide:

   1. Topic drawers. Every topic card in the side panel gets a
      "deeper" drawer (idea · story · why now · source · people),
      fed by TOPIC_DETAIL in topics-data.js. Guides that replace
      the raw topic list get it appended back at the end, so each
      field lists its map topics. Clicking a topic node on the map
      (crack.js) scrolls to its card and opens the drawer.
   2. Bridges and controversies. The gold bridges and red ⚡ edges
      open a full story: what flows across, who, the evidence,
      and (for controversies) both sides.
   3. Extra labs for the thinner hand-built guides:
      Information Theory: Huffman coding and Hamming(7,4);
      Modern Cryptography: the SHA-256 avalanche.
   ============================================================ */
(function () {
"use strict";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const body = () => document.getElementById("panel-body");
// data files declare top-level consts, which are globals but not window properties
const DETAIL = () => (typeof TOPIC_DETAIL !== "undefined" ? TOPIC_DETAIL : null);
const PPL = () => (typeof PEOPLE !== "undefined" ? PEOPLE : []);

const CSS = `
  #panel .tp-more{font:500 .6rem "IBM Plex Mono",monospace;color:var(--gold);background:none;border:1px solid rgba(245,196,81,.4);
    border-radius:999px;padding:.22rem .55rem;margin-top:.35rem;cursor:pointer;letter-spacing:.04em}
  #panel .tp-more:hover{background:rgba(245,196,81,.08)}
  #panel .topic.tp-open .tp-more{background:rgba(245,196,81,.14);color:#fff}
  #panel .tp-drawer{display:none;margin:.55rem 0 .2rem;padding:.6rem .7rem;border-left:2px solid var(--gold);
    background:rgba(245,196,81,.045);border-radius:0 8px 8px 0}
  #panel .topic.tp-open .tp-drawer{display:block;animation:tpIn .25s ease}
  @keyframes tpIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
  #panel .tp-drawer h4,#panel .ed-sec h4{font:600 .58rem "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;
    color:#9d96b8;margin:.55rem 0 .15rem}
  #panel .tp-drawer h4:first-child{margin-top:0}
  #panel .tp-drawer p{font-size:.82rem;line-height:1.55;color:#ddd7ef;margin:0}
  #panel .tp-src{display:inline-block;margin-top:.55rem;font:500 .64rem "IBM Plex Mono",monospace;color:#7fe3d6;text-decoration:none;
    border-bottom:1px dotted rgba(127,227,214,.5)}
  #panel .tp-src:hover{color:#fff}
  #panel .tp-people{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.5rem}
  #panel .tp-person{font:500 .6rem "IBM Plex Mono",monospace;color:#d9d3ee;background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:.25rem .55rem;cursor:pointer}
  #panel .tp-person:hover{border-color:var(--gold);color:#fff}
  #panel .tp-list-head{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}
  #panel .tp-all{font:500 .6rem "IBM Plex Mono",monospace;color:#9d96b8;background:none;border:none;cursor:pointer;text-decoration:underline}

  #panel .ed-flow{display:grid;grid-template-columns:1fr auto 1fr;gap:.45rem;align-items:center;margin:.7rem 0}
  #panel .ed-end{border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:.5rem .55rem;text-align:center;cursor:pointer;
    font:500 .66rem/1.35 "IBM Plex Mono",monospace;color:#e8e2f8;background:rgba(255,255,255,.03)}
  #panel .ed-end:hover{border-color:var(--gold)}
  #panel .ed-end small{display:block;color:#9d96b8;font-size:.56rem;margin-top:.2rem}
  #panel .ed-arrow{font:600 .9rem "IBM Plex Mono",monospace;color:var(--gold)}
  #panel .ed-arrow.hot{color:#ff8f7a}
  #panel .ed-sec p{font-size:.84rem;line-height:1.6;color:#ddd7ef;margin:0 0 .4rem}
  #panel .ed-sides{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:.4rem 0}
  #panel .ed-side{border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:.55rem .6rem}
  #panel .ed-side b{display:block;font:600 .62rem "IBM Plex Mono",monospace;letter-spacing:.06em;margin-bottom:.3rem}
  #panel .ed-side p{font-size:.78rem;line-height:1.5;margin:0;color:#d8d2ea}
  #panel .ed-side.a b{color:var(--gold)} #panel .ed-side.b b{color:#7fe3d6}
  #panel .ed-verdict{border:1px dashed rgba(255,143,122,.5);border-radius:9px;padding:.55rem .65rem;font-size:.8rem;line-height:1.55;color:#f1dcd6;margin:.5rem 0}
  #panel .ed-vote{display:flex;gap:.4rem;margin:.4rem 0}
  #panel .ed-vote button{flex:1}
  #panel .ed-tally{font:500 .64rem "IBM Plex Mono",monospace;color:#9d96b8}
  @media (max-width:520px){#panel .ed-sides{grid-template-columns:1fr}}

  #panel .hf-tree{display:block;width:100%;margin:.5rem 0;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(0,0,0,.25)}
  #panel .hf-stream{word-break:break-all}
  #panel .hm-word{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:.35rem 0}
  #panel .hm-bit{border-radius:6px;padding:.35rem 0;text-align:center;font:600 .8rem "IBM Plex Mono",monospace;cursor:pointer;user-select:none;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#fff}
  #panel .hm-bit small{display:block;font-size:.5rem;font-weight:500;color:#9d96b8;margin-top:.1rem}
  #panel .hm-bit.p{background:rgba(127,227,214,.1);border-color:rgba(127,227,214,.4)}
  #panel .hm-bit.d{background:rgba(245,196,81,.1);border-color:rgba(245,196,81,.4)}
  #panel .hm-bit.flip{background:rgba(255,143,122,.25);border-color:#ff8f7a}
  #panel .hm-bit.fix{outline:2px solid #7fe3d6;outline-offset:1px}
  #panel .hm-lbl{font:500 .6rem "IBM Plex Mono",monospace;color:#9d96b8;letter-spacing:.08em;margin-top:.5rem}
  #panel .av-grid{display:grid;grid-template-columns:repeat(32,1fr);gap:1px;margin:.5rem 0}
  #panel .av-grid i{aspect-ratio:1;background:rgba(255,255,255,.07);border-radius:1px}
  #panel .av-grid i.x{background:#ff8f7a}
  #panel .av-hex{font:500 .62rem/1.5 "IBM Plex Mono",monospace;word-break:break-all;color:#cfc9e4}
  #panel .av-hex b{color:#ff8f7a;font-weight:600}
`;
function ensureCSS() {
  if (window.GuideKit && GuideKit.ensureStyles) GuideKit.ensureStyles();
  else if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("extras-css")) {
    const st = document.createElement("style"); st.id = "extras-css"; st.textContent = CSS; document.head.appendChild(st);
  }
}

/* ------------------------------------------------------------
   1. TOPIC DRAWERS
   ------------------------------------------------------------ */
let CUR = null;                       // the field whose panel is open
const MARK = { found:"🏛", fire:"🔥", work:"⚙️", obs:"🪦", rev:"🧟" };

// People on the map whose surname appears in a topic's "who" line
function peopleIn(who) {
  if (!who) return [];
  const out = [];
  for (const p of PPL()) {
    const sur = p.name.split(" ").pop();
    if (sur.length < 4) continue;
    if (new RegExp("(^|[^A-Za-zÀ-ÿ])" + sur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^A-Za-zÀ-ÿ])").test(who)) out.push(p);
  }
  return out;
}

function drawerHTML(f, t) {
  const x = DETAIL() && DETAIL()[f.id + "|" + t.n];
  if (!x) return "";
  const ppl = peopleIn(t.who);
  return `<div class="tp-drawer">
    <h4>The idea</h4><p>${x.i}</p>
    <h4>The story</h4><p>${x.s}</p>
    <h4>Why it matters now</h4><p>${x.n}</p>
    ${x.src ? `<a class="tp-src" href="${esc(x.src[1])}" target="_blank" rel="noopener">↗ ${esc(x.src[0])}</a>` : ""}
    ${ppl.length ? `<div class="tp-people">${ppl.map(p => `<button class="tp-person" data-pid="${p.id}">◉ ${esc(p.name)}</button>`).join("")}</div>` : ""}
  </div>`;
}

function decorate(f) {
  const b = body();
  if (!b || !f || !f.topics) return;
  const cards = b.querySelectorAll(".topic");
  cards.forEach((c, i) => {
    if (c.dataset.tp) return;
    const t = f.topics[i];
    if (!t) return;
    const html = drawerHTML(f, t);
    c.dataset.tp = "1";
    if (!html) return;
    const btn = document.createElement("button");
    btn.className = "tp-more"; btn.type = "button"; btn.textContent = "deeper ▾";
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", ev => { ev.stopPropagation(); toggle(c); });
    c.appendChild(btn);
    c.insertAdjacentHTML("beforeend", html);
    c.querySelectorAll(".tp-person").forEach(p =>
      p.addEventListener("click", ev => { ev.stopPropagation(); if (window.openPioneer) openPioneer(p.dataset.pid); }));
  });
}
function toggle(c, force) {
  const on = force === undefined ? !c.classList.contains("tp-open") : force;
  c.classList.toggle("tp-open", on);
  const btn = c.querySelector(".tp-more");
  if (btn) { btn.textContent = on ? "less ▴" : "deeper ▾"; btn.setAttribute("aria-expanded", String(on)); }
}
// crack.js calls this when a topic node on the map is clicked
window.WOC_TOPIC_OPEN = function (card) {
  document.querySelectorAll("#panel-body .topic.tp-open").forEach(c => { if (c !== card) toggle(c, false); });
  toggle(card, true);
};

// Guides that removed the raw topic list get it back, at the end
function ensureTopicList(f) {
  const b = body();
  if (!b || !f || !f.topics || !f.topics.length) return;
  if (b.querySelector(".topic")) return;
  const host = b.querySelector(".it-module") || b;
  const wrap = document.createElement("div");
  wrap.className = "tp-appended";
  wrap.innerHTML = `<div class="tp-list-head"><h3 class="it-section-title">The ${f.topics.length} topics on the map</h3>
      <button class="tp-all" type="button">open all</button></div>
    <div class="gk-topics">${f.topics.map(t => `<div class="topic${t.y > S.year ? " unborn" : ""}">
      <h3>${MARK[t.s] || ""} ${esc(t.n)}</h3><div class="tmeta">${esc(t.who)} · ${t.y}</div><p>${t.d}</p></div>`).join("")}</div>`;
  host.appendChild(wrap);
}
function addOpenAll() {
  const b = body();
  if (!b) return;
  const heads = [...b.querySelectorAll(".it-section-title")].filter(h => /topics on the map/.test(h.textContent));
  for (const h of heads) {
    if (h.parentElement.classList.contains("tp-list-head")) continue;
    const row = document.createElement("div"); row.className = "tp-list-head";
    h.replaceWith(row); row.appendChild(h);
    const btn = document.createElement("button"); btn.className = "tp-all"; btn.type = "button"; btn.textContent = "open all";
    row.appendChild(btn);
  }
  b.querySelectorAll(".tp-all").forEach(btn => {
    if (btn.dataset.wired) return; btn.dataset.wired = "1";
    btn.addEventListener("click", () => {
      const cards = [...b.querySelectorAll(".topic")].filter(c => c.querySelector(".tp-drawer"));
      const open = !cards.every(c => c.classList.contains("tp-open"));
      cards.forEach(c => toggle(c, open));
      btn.textContent = open ? "close all" : "open all";
    });
  });
}

/* ------------------------------------------------------------
   3. EXTRA LABS (defined below, inserted after a guide's labs)
   ------------------------------------------------------------ */
const EXTRA_LABS = {};
function insertExtraLabs(f) {
  const labs = EXTRA_LABS[f.id];
  const b = body();
  if (!labs || !b) return;
  const mod = b.querySelector(".it-module");
  if (!mod || mod.querySelector(".x-lab")) return;
  const all = mod.querySelectorAll(".it-lab");
  const anchor = all.length ? all[all.length - 1] : null;
  let after = anchor;
  labs.forEach(l => {
    const sec = document.createElement("section");
    sec.className = "it-lab x-lab";
    sec.innerHTML = `<div class="it-kicker">${l.kicker}</div><h3>${l.title}</h3>
      <p class="it-lab-intro">${l.intro}</p>${l.html}${l.caveat ? `<p class="it-caveat">${l.caveat}</p>` : ""}`;
    if (after) after.after(sec); else {
      const first = mod.querySelector(".it-section-title");
      if (first) mod.insertBefore(sec, first); else mod.appendChild(sec);
    }
    after = sec;
    try { l.init(sec); } catch (e) { console.error("extra lab", l.title, e); }
  });
}

/* ------------------------------------------------------------
   Hook into app.js: openField is a global function declaration,
   so every caller (map, crack.js, pioneer panel) goes through
   window.openField and picks up this wrapper.
   ------------------------------------------------------------ */
if (typeof window.openField === "function") {
  const orig = window.openField;
  window.openField = function (f, d) {
    CUR = f;
    const r = orig.apply(this, arguments);
    ensureCSS();
    try {
      insertExtraLabs(f);
      ensureTopicList(f);
      decorate(f);
      addOpenAll();
    } catch (e) { console.error("extras", e); }
    return r;
  };
}

/* ------------------------------------------------------------
   2. BRIDGES & CONTROVERSIES
   ------------------------------------------------------------ */
const EDGE_DETAIL = {
"Shannon 1937: Boolean algebra = relay circuits": {
  flows: ["Boole's algebra of thought", "The design of switching circuits"],
  story: "In 1937 a 21-year-old MIT master's student who had worked on Vannevar Bush's differential analyzer noticed that relay circuits obey Boole's laws exactly: switches in series behave like AND, switches in parallel like OR, and a normally-closed contact is NOT. His thesis, <i>A Symbolic Analysis of Relay and Switching Circuits</i> (published 1938), turned circuit design from folk craft into algebra: simplify the expression and you simplify the hardware.",
  flow: "Algebraic identities became cheaper circuits; De Morgan's laws became gate substitutions; binary addition became a Boolean formula you could wire. Going the other way, circuits gave logic a physical body that could run at electrical speed.",
  today: "Every logic-synthesis tool that turns Verilog into a chip layout is Shannon's thesis at industrial scale. It is often called the most important master's thesis of the twentieth century.",
  people: ["boole", "shannon"],
  src: [["Shannon — A Symbolic Analysis of Relay and Switching Circuits (MIT thesis)", "https://dspace.mit.edu/handle/1721.1/11173"]] },

"McCulloch–Pitts 1943: neurons as logic gates": {
  flows: ["Logic and computability", "Neural networks"],
  story: "Warren McCulloch, a neurophysiologist, and Walter Pitts, a teenage runaway logician, modelled the neuron as a threshold unit: it fires if enough excitatory inputs are on and no inhibitory one is. In <i>A Logical Calculus of the Ideas Immanent in Nervous Activity</i> (1943) they showed networks of such units can compute any Boolean function, and with memory they match the power of Turing machines.",
  flow: "Logic handed biology a formal model of the brain; the model then flowed back into computing. Von Neumann cited it in the 1945 EDVAC report to describe computer components, and Kleene's 1951 study of these nets gave us regular expressions.",
  today: "Every artificial neuron (weighted sum, then a nonlinearity) descends from this paper. What it lacked was learning; Hebb (1949) and Rosenblatt (1958) supplied that.",
  people: ["mcculloch", "pitts", "vonneumann"],
  src: [["McCulloch & Pitts (1943), Bulletin of Mathematical Biophysics", "https://doi.org/10.1007/BF02478259"]] },

"λ-calculus → LISP; Curry–Howard: proofs = programs": {
  flows: ["Church's λ-calculus (1936)", "Programming languages"],
  story: "Alonzo Church built the λ-calculus as a foundation for logic; it became a model of computation equal in power to Turing's machines. In 1958–60 John McCarthy borrowed its λ notation for LISP, a language where programs are lists that other programs can build and evaluate. Meanwhile Haskell Curry (1934, 1958) and William Howard (1969 manuscript, published 1980) noticed something deeper: a type is a proposition, and a program of that type is a proof of it.",
  flow: "Logic supplied the grammar of functional programming: anonymous functions, closures, higher-order functions, type inference. The Curry–Howard view flows the other way too: type checkers became proof checkers.",
  today: "Lambdas are in Python, JavaScript, Java and C++. Proof assistants such as Lean, Coq (now Rocq) and Agda run on Curry–Howard, and Lean's mathlib is formalising large parts of modern mathematics.",
  people: ["turing", "mccarthy"],
  src: [["McCarthy (1960) — Recursive Functions of Symbolic Expressions", "http://www-formal.stanford.edu/jmc/recursive.pdf"],
        ["Wadler — Propositions as Types (2015)", "https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf"]] },

"Turing 1950: the Imitation Game": {
  flows: ["The theory of computation", "Artificial intelligence"],
  story: "In <i>Computing Machinery and Intelligence</i> (Mind, 1950) Turing replaced the unanswerable \"Can machines think?\" with a game: can an interrogator, chatting by teleprinter, tell the machine from a person? He then took on nine objections one by one, including \"Lady Lovelace's objection\" that machines only do what we tell them, and suggested that the way to build such a machine might be to educate a child-machine.",
  flow: "The universal machine of 1936 meant any describable mind-process could in principle be run on one device. The 1950 paper turned that possibility into a research programme; the name \"artificial intelligence\" followed at Dartmouth in 1956.",
  today: "Large language models have made the test's weak form routine. In 2025 a UC San Diego study reported GPT-4.5, told to adopt a persona, being judged human more often than the real humans in a three-party test. The argument has moved on to whether imitation is understanding.",
  people: ["turing", "lovelace", "mccarthy"],
  src: [["Turing (1950) — Computing Machinery and Intelligence", "https://doi.org/10.1093/mind/LIX.236.433"]] },

"CUDA 2007 → AlexNet 2012: hardware ignites theory": {
  flows: ["Graphics hardware", "Deep learning"],
  story: "GPUs were built to shade millions of pixels in parallel. NVIDIA's CUDA (2007) let ordinary C programmers use them for general computation. Researchers noticed that neural-network training is mostly matrix multiplication, which is exactly what GPUs do well; Raina, Madhavan and Ng reported large speed-ups in 2009. In 2012 Krizhevsky, Sutskever and Hinton trained AlexNet on two consumer GTX 580 cards and won ImageNet with 15.3% top-5 error against 26.2% for the runner-up.",
  flow: "Cheap parallel FLOPs made decades-old ideas (backprop 1986, convolutional nets 1989) practical at scale. In return, AI's hunger reshaped chip design: tensor cores, lower precision, high-bandwidth memory and TPUs.",
  today: "Training frontier models now uses tens of thousands of accelerators, and NVIDIA became one of the most valuable companies in the world. Compute budgets are a central variable in AI forecasting and policy.",
  people: ["huang", "krizhevsky", "sutskever", "hinton", "ng"],
  src: [["Krizhevsky, Sutskever & Hinton (2012) — ImageNet Classification with Deep CNNs", "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html"]] },

"Entropy → cross-entropy: the loss of the modern world": {
  flows: ["Shannon's information theory", "Machine-learning training"],
  story: "Shannon's 1948 entropy H(p) = −Σ p log p measures the bits you need per symbol with the best code for p. If you code with the wrong model q you pay the cross-entropy H(p, q) instead, and the overhead is Kullback and Leibler's divergence (1951). Minimising cross-entropy is therefore the same as making your model's code as short as the truth's.",
  flow: "Classifiers and language models are trained by minimising cross-entropy against the data. That is the same as maximising likelihood, and the same as building a better compressor: prediction and compression are one problem.",
  today: "Every LLM pre-training run minimises next-token cross-entropy, and perplexity (2 to the cross-entropy in bits) is how progress is reported. DeepMind's 2023 paper \"Language Modeling Is Compression\" used an LLM with arithmetic coding to compress images and audio better than PNG and FLAC.",
  people: ["shannon"],
  src: [["Shannon (1948) — A Mathematical Theory of Communication", "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf"],
        ["Delétang et al. (2023) — Language Modeling Is Compression", "https://arxiv.org/abs/2309.10668"]] },

"Kolmogorov complexity: shortest programs": {
  flows: ["Information theory", "Computability"],
  story: "Ray Solomonoff (1964), Andrey Kolmogorov (1965) and Gregory Chaitin (1966) independently defined the information in a single string as the length of the shortest program that prints it. \"0101…01\" a million times is simple; a million coin flips is not. The definition barely depends on the programming language, which changes it by at most a constant.",
  flow: "Shannon measured information across a probability distribution; this measures it in one object, using programs. The price comes from computability: the shortest program can't be computed, because deciding it would solve the halting problem. Chaitin turned this into a version of Gödel's incompleteness theorem.",
  today: "It underlies Occam's razor in learning theory (minimum description length), Solomonoff induction as an ideal of prediction, and the argument that good models are good compressors.",
  people: ["turing", "godel"],
  src: [["Li & Vitányi — An Introduction to Kolmogorov Complexity (Springer)", "https://doi.org/10.1007/978-3-030-11298-1"]] },

"Bellman 1953: dynamic programming → reinforcement learning": {
  flows: ["Algorithms and optimisation", "Reinforcement learning"],
  story: "At RAND in the early 1950s Richard Bellman studied multistage decision problems. His principle of optimality says an optimal plan's remainder is optimal from wherever you land, so the value of a state equals the best immediate reward plus the discounted value of the next state. He picked the name \"dynamic programming\" partly because it sounded too impressive for the funders to object to.",
  flow: "The Bellman equation became the target that learning agents chase when they don't know the environment's rules: temporal-difference learning (Sutton, 1988) and Q-learning (Watkins, 1989) are sampled, incremental Bellman updates.",
  today: "Deep Q-networks, AlphaGo's value network and robot control policies all bootstrap from Bellman targets. The same recursion powers shortest paths, sequence alignment in genomics and the Viterbi decoder in your phone.",
  people: ["bellman", "sutton", "barto", "silver"],
  src: [["Sutton & Barto — Reinforcement Learning: An Introduction (2nd ed., free)", "http://incompleteideas.net/book/the-book-2nd.html"]] },

"B-trees inside every database index": {
  flows: ["Data structures", "Data management"],
  story: "In 1970 at Boeing, Rudolf Bayer and Edward McCreight designed a search tree for disks, where one read fetches a whole block. Each node holds hundreds of sorted keys, so the tree stays very shallow: a billion keys need about four levels. Their paper appeared in Acta Informatica in 1972; by 1979 Douglas Comer called it \"The Ubiquitous B-Tree\".",
  flow: "A structure designed around disk blocks made Codd's relational model (1970) fast enough to use: indexes, range queries, ORDER BY and joins all lean on B+-trees.",
  today: "PostgreSQL, MySQL/InnoDB, SQLite, SQL Server and most file systems (NTFS, APFS, Btrfs) use B-tree variants. Write-heavy systems (Cassandra, RocksDB) use LSM-trees instead, which is the main live alternative.",
  people: ["codd"],
  src: [["Bayer & McCreight (1972) — Organization and Maintenance of Large Ordered Indexes", "https://doi.org/10.1007/BF00288683"]] },

"Maximum likelihood ⇒ every loss function": {
  flows: ["Statistics", "Machine learning"],
  story: "In 1922 R. A. Fisher's <i>On the Mathematical Foundations of Theoretical Statistics</i> proposed estimating a model's parameters by making the observed data as probable as possible. He argued such estimators are consistent and, in large samples, as efficient as any estimator can be; rigorous proofs came later (Cramér, Wald).",
  flow: "Most ML losses are negative log-likelihoods in disguise. Squared error is Gaussian noise; cross-entropy is a categorical distribution; L2 weight decay is a Gaussian prior (MAP). Choosing a loss is choosing a noise model.",
  today: "Pre-training LLMs is maximum likelihood on text. The known limits are statistical too: likelihood rewards covering every mode, which is one reason post-training (RLHF, preference optimisation) steers models beyond pure likelihood.",
  people: [],
  src: [["Fisher (1922), Philosophical Transactions of the Royal Society A", "https://doi.org/10.1098/rsta.1922.0009"]] },

"Deep Blue (search) vs AlphaGo (learning): the handover": {
  flows: ["Symbolic AI (search + hand-written knowledge)", "Machine learning (learned judgement)"],
  story: "In 1997 IBM's Deep Blue beat world champion Garry Kasparov 3½–2½. It used custom chips searching about 200 million positions a second with an evaluation function tuned by grandmasters. Go resisted that approach because its branching factor is around 250 and position values are hard to write down. In March 2016 DeepMind's AlphaGo beat Lee Sedol 4–1, using neural networks trained on human games and self-play to guide Monte Carlo tree search.",
  flow: "The handover was not total. AlphaGo still searched; it learned where to look (policy) and how good a position is (value). AlphaZero (2017) then dropped human games entirely.",
  today: "The hybrid won: Stockfish added a small neural evaluator (NNUE) in 2020, and LLM \"reasoning\" models combine learned intuition with search over chains of thought. Sutton's 2019 essay <i>The Bitter Lesson</i> argues that general methods that scale with compute beat built-in knowledge.",
  people: ["hassabis", "silver", "sutton"],
  src: [["Campbell, Hoane & Hsu (2002) — Deep Blue", "https://doi.org/10.1016/S0004-3702(01)00129-1"],
        ["Silver et al. (2016) — Mastering the game of Go", "https://doi.org/10.1038/nature16961"],
        ["Sutton (2019) — The Bitter Lesson", "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"]] },

"Python + autodiff: the accidental language of AI": {
  flows: ["Programming languages", "Machine learning"],
  story: "Guido van Rossum released Python in 1991 as a readable scripting language. It became AI's language by accident: NumPy (2006) gave it fast arrays backed by C and Fortran, and Theano (2007), TensorFlow (2015), PyTorch (2016) and JAX (2018) put reverse-mode automatic differentiation (Linnainmaa, 1970) under a Python front end.",
  flow: "Autodiff means you write only the forward computation and gradients come free, exactly. That turned deep learning from a derivation exercise into experimentation, and Python's gentle syntax let scientists who weren't programmers join in.",
  today: "Nearly all research code and model training is driven from Python, while the heavy lifting runs in CUDA and C++ kernels. Compiler work such as Triton, XLA and torch.compile aims to keep Python's ease while fixing its speed.",
  people: ["karpathy"],
  src: [["Baydin et al. (2018) — Automatic Differentiation in Machine Learning: a Survey", "https://jmlr.org/papers/v18/17-468.html"]] },

"Vector databases: retrieval meets embeddings": {
  flows: ["Information retrieval and embeddings", "Data management"],
  story: "Neural encoders map text, images and code to vectors where closeness means similarity. Finding nearest neighbours among a billion vectors needs approximate indexes: product quantization (Jégou, Douze and Schmid, 2011), graph indexes such as HNSW (Malkov and Yashunin, 2016) and Facebook's FAISS library (2017).",
  flow: "The old IR idea of ranking by similarity (Salton's vector-space model, Spärck Jones's IDF) met learned embeddings and database engineering: sharding, filtering, replication and transactions for vectors.",
  today: "Retrieval-augmented generation (Lewis et al., 2020) gives LLMs fresh or private knowledge by fetching relevant chunks first. Postgres (pgvector), Elasticsearch and dedicated engines now all ship vector indexes.",
  people: ["sparckjones"],
  src: [["Malkov & Yashunin — HNSW (arXiv 1603.09320)", "https://arxiv.org/abs/1603.09320"],
        ["Lewis et al. (2020) — Retrieval-Augmented Generation", "https://arxiv.org/abs/2005.11401"]] },

// ---------------- controversies ----------------
"Minsky vs Rosenblatt, 1969: XOR and the first winter": {
  hot: true,
  flows: ["Symbolic AI (Minsky & Papert)", "Connectionism (Rosenblatt)"],
  story: "Rosenblatt's perceptron (1958) learned from examples, and the press promised machines that would walk, talk and be conscious of their existence. Minsky and Papert's book <i>Perceptrons</i> (1969) proved hard limits for single-layer perceptrons: they can't compute XOR or parity, and they can't decide connectedness with bounded local features. Funding and students drifted to symbolic AI. Rosenblatt died in a boating accident in 1971, and neural-network research stayed marginal until backpropagation was popularised in 1986.",
  sideA: ["The case for the critique", "The theorems were correct, and the hype was real. Nobody then knew how to train multi-layer networks. Minsky and Papert said plainly that multi-layer nets could compute XOR; their doubt was whether they could be trained. That took 17 years to answer."],
  sideB: ["The case against", "The book's reputation outran its content: many read it as \"neural nets are a dead end\", and the authors did little to correct that. Multilayer learning rules already existed (Ivakhnenko's 1965 GMDH, Amari's 1967 stochastic gradient descent for multilayer nets). The field lost a decade."],
  verdict: "Historians disagree on how much the book caused. Olazaran (1996) argues it was part of a wider settlement in AI's favour of symbolic methods. The bigger funding collapse came with the Lighthill Report (1973) and DARPA cuts, which hit symbolic AI too. In the 1988 edition's epilogue Minsky and Papert stood by their analysis.",
  people: ["minsky", "rosenblatt", "rumelhart", "hinton", "ivakhnenko", "amari"],
  src: [["Olazaran (1996) — A Sociological Study of the Official History of the Perceptrons Controversy", "https://doi.org/10.1177/030631296026003005"],
        ["Minsky & Papert — Perceptrons (MIT Press, 2017 reissue)", "https://mitpress.mit.edu/9780262534772/perceptrons/"]] },

"Chomsky vs LLMs: is language learnable from data alone?": {
  hot: true,
  flows: ["Generative linguistics (innate grammar)", "Statistical learning (LLMs)"],
  story: "Since the 1960s Chomsky has argued that children acquire grammar from too little evidence to learn it purely from data (the \"poverty of the stimulus\"), so humans must have a rich innate language faculty. In March 2023, in a New York Times essay titled \"The False Promise of ChatGPT\", he, Ian Roberts and Jeffrey Watumull argued LLMs are statistical engines that describe and predict but do not explain, and would learn impossible languages as easily as possible ones.",
  sideA: ["Chomsky's side", "LLMs see trillions of tokens; a child hears perhaps 10–100 million words by age ten, so success at LLM scale says little about children. Fluent text is not an explanation of why language has the structure it has."],
  sideB: ["The LLM side", "Steven Piantadosi (2023) argues LLMs refute the claim that grammar can't be learned from data without built-in structure: they acquire syntax, long-distance agreement and recursion from exposure alone. The BabyLM challenge (2023–) trains models on child-scale data (10–100M words) to test the poverty-of-stimulus argument directly."],
  verdict: "The evidence is mixed. Kallini et al. (ACL 2024 best paper, \"Mission: Impossible Language Models\") found GPT-2 learns synthetic impossible languages clearly worse than natural ones, which contradicts one of Chomsky's claims. BabyLM results show small-data models still trail humans. Whether LLMs model human language faculty, or only its outputs, is still an open question.",
  people: ["vaswani", "radford"],
  src: [["Chomsky, Roberts & Watumull — The False Promise of ChatGPT (NYT, 2023)", "https://www.nytimes.com/2023/03/08/opinion/noam-chomsky-chatgpt-ai.html"],
        ["Piantadosi (2023) — Modern language models refute Chomsky's approach to language", "https://lingbuzz.net/lingbuzz/007180"],
        ["Kallini et al. (2024) — Mission: Impossible Language Models", "https://arxiv.org/abs/2401.06416"]] }
};

function tally(key) { try { return JSON.parse(localStorage.getItem("woc-vote-" + key) || "null"); } catch (e) { return null; } }
function saveVote(key, v) { try { localStorage.setItem("woc-vote-" + key, JSON.stringify(v)); } catch (e) {} }

window.openEdgeDetail = function (e, cls) {
  const x = EDGE_DETAIL[e.label];
  const A = DOMAINS.find(d => d.id === e.a), B = DOMAINS.find(d => d.id === e.b);
  const hot = cls !== "bridge";
  openPanel({
    kind: hot ? "Controversy ⚡" : "Gold bridge",
    title: e.label, meta: `${A.name} ↔ ${B.name} · ${e.y}`,
    blurb: x ? "" : (hot ? "A live dispute — the field's best stories are its arguments."
                         : "A mediating concept: the idea that lets one continent's results flow into the other.")
  });
  if (!x) return;
  ensureCSS();
  const b = body();
  b.querySelector(".blurb") && b.querySelector(".blurb").remove();
  const ppl = (x.people || []).map(id => PPL().find(p => p.id === id)).filter(Boolean);
  const sec = document.createElement("section");
  sec.className = "it-module";
  sec.innerHTML = `
    <div class="ed-flow">
      <div class="ed-end" data-dom="${A.id}">${esc(x.flows[0])}<small>${esc(A.name)}</small></div>
      <div class="ed-arrow${hot ? " hot" : ""}">${hot ? "⚡" : "⇄"}</div>
      <div class="ed-end" data-dom="${B.id}">${esc(x.flows[1])}<small>${esc(B.name)}</small></div>
    </div>
    <div class="ed-sec"><h4>The story</h4><p>${x.story}</p></div>
    ${x.flow ? `<div class="ed-sec"><h4>What flows across</h4><p>${x.flow}</p></div>` : ""}
    ${x.sideA ? `<div class="ed-sec"><h4>Both sides</h4><div class="ed-sides">
        <div class="ed-side a"><b>${esc(x.sideA[0])}</b><p>${x.sideA[1]}</p></div>
        <div class="ed-side b"><b>${esc(x.sideB[0])}</b><p>${x.sideB[1]}</p></div></div>
      <div class="ed-verdict"><b>Where it stands.</b> ${x.verdict}</div>
      <h4>Your call</h4>
      <div class="ed-vote"><button class="gk-ghost" data-v="0">${esc(x.sideA[0])}</button><button class="gk-ghost" data-v="1">${esc(x.sideB[0])}</button></div>
      <div class="ed-tally"></div></div>` : ""}
    ${x.today ? `<div class="ed-sec"><h4>Today</h4><p>${x.today}</p></div>` : ""}
    ${ppl.length ? `<div class="ed-sec"><h4>People</h4><div class="tp-people">${ppl.map(p => `<button class="tp-person" data-pid="${p.id}">◉ ${esc(p.name)}</button>`).join("")}</div></div>` : ""}
    <h3 class="it-section-title">Read the source</h3>
    ${x.src.map(s => `<a class="it-source" href="${esc(s[1])}" target="_blank" rel="noopener"><small>SOURCE</small><strong>${esc(s[0])}</strong><span>${esc(s[1].replace(/^https?:\/\//, "").split("/")[0])}</span><i aria-hidden="true">↗</i></a>`).join("")}`;
  b.appendChild(sec);
  sec.querySelectorAll(".tp-person").forEach(p => p.addEventListener("click", () => window.openPioneer && openPioneer(p.dataset.pid)));
  sec.querySelectorAll(".ed-end").forEach(n => n.addEventListener("click", () => {
    const d = DOMAINS.find(q => q.id === n.dataset.dom); if (d && window.zoomTo) zoomTo(d);
  }));
  if (x.sideA) {
    const out = sec.querySelector(".ed-tally");
    const show = v => { out.textContent = v === null ? "Pick a side. Your vote stays in this browser; change it any time."
      : `You sided with: ${[x.sideA[0], x.sideB[0]][v]}. The verdict box above is the current state of evidence.`;
      sec.querySelectorAll(".ed-vote button").forEach(bt => bt.classList.toggle("on", +bt.dataset.v === v)); };
    show(tally(e.label));
    sec.querySelectorAll(".ed-vote button").forEach(bt => bt.addEventListener("click", () => { saveVote(e.label, +bt.dataset.v); show(+bt.dataset.v); }));
  }
};

/* ------------------------------------------------------------
   3a. HUFFMAN CODING (Information Theory)
   ------------------------------------------------------------ */
function huffman(text) {
  const counts = new Map();
  for (const ch of text) counts.set(ch, (counts.get(ch) || 0) + 1);
  let nodes = [...counts].map(([s, c], k) => ({ s, c, k }));
  let uid = nodes.length;
  if (nodes.length === 1) return { counts, codes: new Map([[nodes[0].s, "0"]]), root: { c: nodes[0].c, l: nodes[0] } };
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.c - b.c || a.k - b.k);
    const a = nodes.shift(), b = nodes.shift();
    nodes.push({ c: a.c + b.c, l: a, r: b, k: uid++ });
  }
  const codes = new Map();
  (function walk(n, pre) {
    if (n.s !== undefined) { codes.set(n.s, pre || "0"); return; }
    walk(n.l, pre + "0"); walk(n.r, pre + "1");
  })(nodes[0], "");
  return { counts, codes, root: nodes[0] };
}
const showCh = s => s === " " ? "␣" : s === "\n" ? "↵" : s;

EXTRA_LABS.infotheory = [{
  kicker: "LAB 2 · HUFFMAN 1952 · THE OPTIMAL PREFIX CODE",
  title: "Squeeze a sentence",
  intro: "David Huffman found this as an MIT term paper in 1952, to get out of a final exam. Repeatedly merge the two rarest symbols; the tree that emerges gives common letters short codes and rare letters long ones. Nothing beats it among codes that spend a whole number of bits per symbol.",
  html: `<div class="gk-row"><input class="gk-input hf-in" value="she sells sea shells by the sea shore" maxlength="400" aria-label="text to compress"></div>
    <div class="gk-chips hf-pre">
      <button class="gk-chip" data-t="she sells sea shells by the sea shore">tongue twister</button>
      <button class="gk-chip" data-t="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab">one dull symbol</button>
      <button class="gk-chip" data-t="abcdefghijklmnopqrstuvwxyz">every letter once</button>
      <button class="gk-chip" data-t="to be or not to be that is the question">Hamlet</button></div>
    <svg class="hf-tree" aria-label="Huffman tree"></svg>
    <div class="gk-bars hf-bars"></div>
    <table class="gk-table hf-tab"></table>
    <div class="gk-out hf-stream"></div>`,
  caveat: "Huffman is optimal per symbol, so it can waste up to almost 1 bit per symbol relative to entropy (watch the \"one dull symbol\" preset). Arithmetic coding and ANS close that gap, and are used in modern compressors such as zstd and AV1.",
  init(root) {
    const inp = root.querySelector(".hf-in"), svg = root.querySelector(".hf-tree");
    const run = () => {
      const text = inp.value || " ";
      const { counts, codes, root: tree } = huffman(text);
      const N = [...text].length, k = counts.size;
      let H = 0; for (const c of counts.values()) { const p = c / N; H -= p * Math.log2(p); }
      let huff = 0; for (const [s, c] of counts) huff += c * codes.get(s).length;
      const fixed = N * Math.max(1, Math.ceil(Math.log2(k)));
      const rows = [["8-bit ASCII", 8 * N, "#8d86a8"], ["fixed-length", fixed, "#7fe3d6"], ["Huffman", huff, "#f5c451"], ["entropy bound", H * N, "#ff8f7a"]];
      root.querySelector(".hf-bars").innerHTML = rows.map(([n, v, col]) => `<div class="gk-bar"><span>${n}</span><span class="trk"><span class="fill" style="width:${(100 * v / (8 * N)).toFixed(1)}%;background:${col}"></span></span><span class="v">${Math.round(v)} b</span></div>`).join("");
      const sorted = [...counts].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
      root.querySelector(".hf-tab").innerHTML = `<tr><th>symbol</th><th>count</th><th>p</th><th>code</th><th>−log₂p</th></tr>` +
        sorted.slice(0, 14).map(([s, c]) => `<tr><td>${esc(showCh(s))}</td><td>${c}</td><td>${(c / N).toFixed(3)}</td><td class="hl">${codes.get(s)}</td><td>${(-Math.log2(c / N)).toFixed(2)}</td></tr>`).join("") +
        (sorted.length > 14 ? `<tr><td colspan="5" class="tl">… ${sorted.length - 14} more symbols</td></tr>` : "");
      const bits = [...text].map((ch, i) => `<span class="${i % 2 ? "t" : "g"}">${codes.get(ch)}</span>`).join("");
      root.querySelector(".hf-stream").innerHTML = `<span class="d">${N} symbols · ${(huff / N).toFixed(3)} bits/symbol (entropy ${H.toFixed(3)}) · ${(100 - 100 * huff / (8 * N)).toFixed(1)}% smaller than ASCII</span>\n${bits}`;
      drawTree(svg, tree);
    };
    root.querySelectorAll(".hf-pre .gk-chip").forEach(c => c.addEventListener("click", () => { inp.value = c.dataset.t; run(); }));
    inp.addEventListener("input", run);
    run();
  }
}, {
  kicker: "LAB 3 · HAMMING 1950 · THE CODE THAT FIXES ITSELF",
  title: "Hamming(7,4): corrupt a bit, watch it heal",
  intro: "At Bell Labs, Richard Hamming's weekend jobs kept failing on single bit errors, and he asked why the machine couldn't fix them itself. His answer: add 3 parity bits to every 4 data bits, each parity bit checking an overlapping group. When one bit flips, the pattern of failed checks spells out, in binary, which position is wrong.",
  html: `<div class="hm-lbl">1 · YOUR 4 DATA BITS (click to toggle)</div><div class="gk-row hm-data"></div>
    <div class="hm-lbl">2 · SENT CODEWORD (click a bit to let noise flip it)</div><div class="hm-word hm-sent"></div>
    <div class="hm-lbl">3 · DECODER'S VERDICT</div><div class="gk-out hm-out"></div>
    <div class="gk-row"><button class="gk-ghost hm-clear">clear noise</button><button class="gk-ghost hm-rand">random single flip</button></div>
    <div class="hm-lbl">4 · A NOISY CHANNEL, 20,000 BLOCKS</div>
    <div class="it-control"><label><span>bit-flip probability p</span><output class="hm-pv"></output></label><input class="hm-p" type="range" min="0.001" max="0.2" step="0.001" value="0.03"></div>
    <div class="gk-bars hm-bars"></div><div class="gk-out hm-sim"></div>`,
  caveat: "With two flips the syndrome points at an innocent bit and the decoder makes things worse; try it. Real memory adds an 8th overall-parity bit (SECDED) to detect, though not fix, double errors. Rate 4/7 is costly; modern links use LDPC and polar codes that approach Shannon's limit.",
  init(root) {
    const data = [1, 0, 1, 1]; let noise = new Set();
    const NAMES = ["p1", "p2", "d1", "p3", "d2", "d3", "d4"];
    const encode = d => { const [d1, d2, d3, d4] = d; return [d1 ^ d2 ^ d4, d1 ^ d3 ^ d4, d1, d2 ^ d3 ^ d4, d2, d3, d4]; };
    const syndrome = w => {
      const s1 = w[0] ^ w[2] ^ w[4] ^ w[6], s2 = w[1] ^ w[2] ^ w[5] ^ w[6], s3 = w[3] ^ w[4] ^ w[5] ^ w[6];
      return { s1, s2, s3, pos: s1 + 2 * s2 + 4 * s3 };
    };
    const dataRow = root.querySelector(".hm-data"), sent = root.querySelector(".hm-sent"), out = root.querySelector(".hm-out");
    const draw = () => {
      dataRow.innerHTML = data.map((b, i) => `<button class="gk-chip${b ? " on" : ""}" data-i="${i}">d${i + 1} = ${b}</button>`).join("");
      dataRow.querySelectorAll("button").forEach(bt => bt.addEventListener("click", () => { data[+bt.dataset.i] ^= 1; noise.clear(); draw(); }));
      const code = encode(data), recv = code.map((b, i) => noise.has(i) ? b ^ 1 : b);
      const s = syndrome(recv);
      const fixed = recv.slice(); if (s.pos) fixed[s.pos - 1] ^= 1;
      const dec = [fixed[2], fixed[4], fixed[5], fixed[6]];
      const ok = dec.every((b, i) => b === data[i]);
      sent.innerHTML = recv.map((b, i) => `<div class="hm-bit ${NAMES[i][0]}${noise.has(i) ? " flip" : ""}${s.pos === i + 1 ? " fix" : ""}" data-i="${i}">${b}<small>${i + 1} · ${NAMES[i]}</small></div>`).join("");
      sent.querySelectorAll(".hm-bit").forEach(c => c.addEventListener("click", () => { const i = +c.dataset.i; noise.has(i) ? noise.delete(i) : noise.add(i); draw(); }));
      out.innerHTML =
        `checks: p1 covers 1,3,5,7 → <span class="${s.s1 ? "r" : "t"}">${s.s1 ? "FAIL" : "ok"}</span> · p2 covers 2,3,6,7 → <span class="${s.s2 ? "r" : "t"}">${s.s2 ? "FAIL" : "ok"}</span> · p3 covers 4,5,6,7 → <span class="${s.s3 ? "r" : "t"}">${s.s3 ? "FAIL" : "ok"}</span>\n` +
        `syndrome (p3 p2 p1) = ${s.s3}${s.s2}${s.s1}₂ = <span class="g">${s.pos}</span> → ${s.pos ? `flip bit ${s.pos}` : "no error seen"}\n` +
        `decoded data ${dec.join("")} vs sent ${data.join("")}: ` +
        (noise.size === 0 ? `<span class="t">clean ✓</span>` : ok ? `<span class="t">repaired ✓</span>` :
          `<span class="r">WRONG ✗ — ${noise.size} flips exceed what the code can fix${noise.size === 2 ? "; it “corrected” an innocent bit" : ""}</span>`);
    };
    root.querySelector(".hm-clear").addEventListener("click", () => { noise.clear(); draw(); });
    root.querySelector(".hm-rand").addEventListener("click", () => { noise = new Set([Math.floor(Math.random() * 7)]); draw(); });
    draw();
    const pIn = root.querySelector(".hm-p");
    const sim = () => {
      const p = +pIn.value, T = 20000; root.querySelector(".hm-pv").textContent = p.toFixed(3);
      const r = GuideKit.rng(7);
      let rawFail = 0, hamFail = 0;
      for (let t = 0; t < T; t++) {
        let raw = false; for (let i = 0; i < 4; i++) if (r() < p) raw = true;
        if (raw) rawFail++;
        let flips = 0; for (let i = 0; i < 7; i++) if (r() < p) flips++;
        if (flips >= 2) hamFail++;
      }
      const exactRaw = 1 - Math.pow(1 - p, 4), exactHam = 1 - Math.pow(1 - p, 7) - 7 * p * Math.pow(1 - p, 6);
      const mx = Math.max(rawFail, hamFail, 1);
      root.querySelector(".hm-bars").innerHTML =
        `<div class="gk-bar"><span>4 raw bits</span><span class="trk"><span class="fill" style="width:${100 * rawFail / mx}%;background:#ff8f7a"></span></span><span class="v">${(100 * rawFail / T).toFixed(2)}%</span></div>` +
        `<div class="gk-bar"><span>Hamming(7,4)</span><span class="trk"><span class="fill" style="width:${100 * hamFail / mx}%;background:#7fe3d6"></span></span><span class="v">${(100 * hamFail / T).toFixed(2)}%</span></div>`;
      root.querySelector(".hm-sim").innerHTML = `<span class="d">blocks lost, simulated vs exact:</span>\nraw 4 bits    ${(100 * rawFail / T).toFixed(2)}%  (exact 1−(1−p)⁴ = ${(100 * exactRaw).toFixed(2)}%)\nHamming(7,4)  ${(100 * hamFail / T).toFixed(2)}%  (exact P[≥2 of 7 flip] = ${(100 * exactHam).toFixed(2)}%)\n` +
        (exactHam < exactRaw ? `<span class="t">${(exactRaw / exactHam).toFixed(1)}× fewer lost blocks</span>, paid for with 75% more bits.` : `<span class="r">At this noise level the extra bits hurt: too many double flips.</span>`);
    };
    pIn.addEventListener("input", sim); sim();
  }
}];

function drawTree(svg, tree) {
  // leaves spaced evenly left→right in DFS order; internal nodes centred over children
  let leaves = 0, depth = 0;
  (function lay(n, d) {
    n.d = d; depth = Math.max(depth, d);
    if (n.s !== undefined) { n.x = leaves++; return; }
    lay(n.l, d + 1); if (n.r) { lay(n.r, d + 1); n.x = (n.l.x + n.r.x) / 2; } else n.x = n.l.x;
  })(tree, 0);
  const W = 560, rowH = 34, H = Math.min(34 + depth * rowH + 28, 360), pad = 18;
  const dy = Math.min(rowH, (H - 50) / Math.max(depth, 1));
  const X = x => pad + (leaves <= 1 ? (W - 2 * pad) / 2 : x * (W - 2 * pad) / (leaves - 1));
  const Y = d => 18 + d * dy;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.style.height = "auto";
  let s = "";
  (function edges(n) {
    for (const [c, bit] of [[n.l, 0], [n.r, 1]]) {
      if (!c) continue;
      s += `<line x1="${X(n.x)}" y1="${Y(n.d)}" x2="${X(c.x)}" y2="${Y(c.d)}" stroke="${bit ? "#7fe3d6" : "#f5c451"}" stroke-opacity=".55" stroke-width="1.4"/>`;
      if (depth < 9) s += `<text x="${(X(n.x) + X(c.x)) / 2 + (bit ? 5 : -9)}" y="${(Y(n.d) + Y(c.d)) / 2}" font-size="9" fill="#9d96b8" font-family="IBM Plex Mono,monospace">${bit}</text>`;
      edges(c);
    }
  })(tree);
  (function nodes(n) {
    if (n.s !== undefined) {
      s += `<circle cx="${X(n.x)}" cy="${Y(n.d)}" r="9" fill="#2a1f45" stroke="#f5c451"/><text x="${X(n.x)}" y="${Y(n.d) + 3.5}" font-size="10" text-anchor="middle" fill="#fff" font-family="IBM Plex Mono,monospace">${esc(showCh(n.s))}</text>` +
        `<text x="${X(n.x)}" y="${Y(n.d) + 21}" font-size="8" text-anchor="middle" fill="#9d96b8" font-family="IBM Plex Mono,monospace">${n.c}</text>`;
      return;
    }
    s += `<circle cx="${X(n.x)}" cy="${Y(n.d)}" r="4" fill="#8d86a8"/>`;
    nodes(n.l); if (n.r) nodes(n.r);
  })(tree);
  svg.innerHTML = s;
}

/* ------------------------------------------------------------
   3b. SHA-256 AVALANCHE (Modern Cryptography)
   Pure-JS SHA-256 (FIPS 180-4), so it also works from file://
   ------------------------------------------------------------ */
const K256 = new Uint32Array([
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
  0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
  0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
  0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sha256(bytes) {
  const len = bytes.length, total = ((len + 9 + 63) >> 6) << 6;
  const m = new Uint8Array(total); m.set(bytes); m[len] = 0x80;
  const bitLen = len * 8;
  m[total - 4] = bitLen >>> 24; m[total - 3] = bitLen >>> 16; m[total - 2] = bitLen >>> 8; m[total - 1] = bitLen;
  m[total - 5] = Math.floor(bitLen / 2 ** 32);
  const h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < total; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K256[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + mj) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 8; i++) { out[4 * i] = h[i] >>> 24; out[4 * i + 1] = h[i] >>> 16; out[4 * i + 2] = h[i] >>> 8; out[4 * i + 3] = h[i]; }
  return out;
}
window.WOC_SHA256 = sha256;   // exposed for tests
const hex = u => [...u].map(x => x.toString(16).padStart(2, "0")).join("");
const bitDiff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) { let x = a[i] ^ b[i]; while (x) { n += x & 1; x >>= 1; } } return n; };

EXTRA_LABS["modern-crypto"] = [{
  kicker: "HASH LAB · SHA-256 · THE AVALANCHE",
  title: "Change one bit. Change everything.",
  intro: "A cryptographic hash is a fingerprint: any input, 256 bits out. It must be one-way and collision-resistant, and it must avalanche: flipping a single input bit should flip each output bit with probability ½, so about 128 of 256. This is SHA-256 (NSA/NIST, 2001), computed in your browser, the same function that chains Bitcoin blocks and signs your software updates.",
  html: `<div class="gk-row"><input class="gk-input av-in" value="Pay Bob 100 dollars" maxlength="200" aria-label="message"></div>
    <div class="gk-row"><button class="gk-ghost av-flip">flip one random bit</button><button class="gk-ghost av-many">run 500 random flips</button></div>
    <div class="gk-out av-msgs"></div>
    <div class="av-grid"></div>
    <div class="gk-out av-hex"></div>
    <canvas class="gk-canvas av-hist" aria-label="distribution of flipped bits"></canvas>
    <div class="gk-out av-stat">Run 500 flips to see the distribution.</div>`,
  caveat: "The avalanche is necessary, not sufficient: many broken hashes (MD5, SHA-1) avalanche beautifully. Their failures were found by cryptanalysis: practical MD5 collisions in 2004 and the SHAttered SHA-1 collision in 2017. SHA-256 has no known practical attack.",
  init(root) {
    const inp = root.querySelector(".av-in"), enc = new TextEncoder();
    let flipped = null;   // { bytes, pos }
    const render = () => {
      const a = enc.encode(inp.value);
      const b = flipped ? flipped.bytes : a;
      const ha = sha256(a), hb = sha256(b);
      const n = bitDiff(ha, hb);
      const shown = u => { const s = new TextDecoder("utf-8", { fatal: false }).decode(u); return esc(s); };
      root.querySelector(".av-msgs").innerHTML = flipped
        ? `original  <span class="g">${esc(inp.value)}</span>\nflipped   <span class="t">${shown(b)}</span>  <span class="d">(bit ${flipped.pos % 8} of byte ${Math.floor(flipped.pos / 8)})</span>\n<span class="${n > 90 ? "r" : "t"}">${n} of 256 output bits changed (${(100 * n / 256).toFixed(1)}%)</span>`
        : `<span class="g">${esc(inp.value)}</span>\n<span class="d">press "flip one random bit" to change a single input bit</span>`;
      let g = "";
      for (let i = 0; i < 256; i++) { const bit = 7 - (i % 8), by = i >> 3; g += `<i class="${((ha[by] ^ hb[by]) >> bit) & 1 ? "x" : ""}"></i>`; }
      root.querySelector(".av-grid").innerHTML = g;
      const hA = hex(ha), hB = hex(hb);
      root.querySelector(".av-hex").innerHTML = `SHA-256(original)\n${hA}` + (flipped ? `\nSHA-256(flipped)\n${[...hB].map((c, i) => c === hA[i] ? c : `<b>${c}</b>`).join("")}` : "");
    };
    const flipOne = base => { const bytes = base.slice(); const pos = Math.floor(Math.random() * bytes.length * 8); bytes[pos >> 3] ^= 1 << (pos % 8); return { bytes, pos }; };
    inp.addEventListener("input", () => { flipped = null; render(); });
    root.querySelector(".av-flip").addEventListener("click", () => { const a = enc.encode(inp.value); if (!a.length) return; flipped = flipOne(a); render(); });
    root.querySelector(".av-many").addEventListener("click", () => {
      const a = enc.encode(inp.value); if (!a.length) return;
      const ha = sha256(a), hist = new Array(257).fill(0); let sum = 0, sq = 0, lo = 256, hi = 0; const T = 500;
      for (let t = 0; t < T; t++) { const n = bitDiff(ha, sha256(flipOne(a).bytes)); hist[n]++; sum += n; sq += n * n; lo = Math.min(lo, n); hi = Math.max(hi, n); }
      const mean = sum / T, sd = Math.sqrt(sq / T - mean * mean);
      const { ctx, w, h } = GuideKit.canvas(root.querySelector(".av-hist"), 150);
      const x0 = 88, x1 = 168, mx = Math.max(...hist);
      ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.beginPath(); ctx.moveTo(10, h - 20); ctx.lineTo(w - 10, h - 20); ctx.stroke();
      const X = v => 10 + (v - x0) / (x1 - x0) * (w - 20);
      const bw = (w - 20) / (x1 - x0);
      for (let v = x0; v <= x1; v++) if (hist[v]) { ctx.fillStyle = "#f5c451"; const bh = (h - 40) * hist[v] / mx; ctx.fillRect(X(v) - bw / 2 + .5, h - 20 - bh, bw - 1, bh); }
      // Binomial(256, 1/2) curve for comparison
      ctx.strokeStyle = "#7fe3d6"; ctx.lineWidth = 1.5; ctx.beginPath();
      let lg = [0]; for (let i = 1; i <= 256; i++) lg[i] = lg[i - 1] + Math.log(i);
      for (let v = x0; v <= x1; v++) { const pr = Math.exp(lg[256] - lg[v] - lg[256 - v] - 256 * Math.log(2)); const y = h - 20 - (h - 40) * pr * T / mx; v === x0 ? ctx.moveTo(X(v), y) : ctx.lineTo(X(v), y); }
      ctx.stroke();
      ctx.fillStyle = "#9d96b8"; ctx.font = "10px IBM Plex Mono, monospace"; ctx.textAlign = "center";
      for (const v of [96, 112, 128, 144, 160]) ctx.fillText(v, X(v), h - 6);
      root.querySelector(".av-stat").innerHTML = `${T} single-bit flips of this message:\nmean <span class="g">${mean.toFixed(1)}</span> bits changed · spread ±${sd.toFixed(1)} · range ${lo}–${hi}\n<span class="t">teal curve</span> = ideal coin flips, Binomial(256, ½): mean 128, ±8.0`;
    });
    render();
  }
}];

})();
