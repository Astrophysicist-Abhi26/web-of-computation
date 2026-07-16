// COMPLEXITY THEORY — not "can we compute it?" but "can we AFFORD to?"
// Loaded only when the Complexity Theory field opens. Same visual language as
// math-logic.js / quantum-computation.js. The four labs are real: an honest
// growth-rate race, a real SHA-style verify-vs-solve gap on graph coloring, a
// working 3-SAT solver + a live reduction, and a P-vs-NP landscape map.
(function () {
"use strict";

// ---------------------------------------------------------------- chapters
const CHAPTERS = [
  {
    icon: "🏛", title: "Before P: the asymptotic idea", who: "Cobham 1965 · Edmonds 1965 · Hartmanis–Stearns 1965",
    lead: "The founding leap: don't count seconds, count how the cost GROWS. Polynomial = tractable; exponential = doomed.",
    formula: "P = ⋃ₖ TIME(nᵏ)   ·   \"good algorithm\" ≝ runtime bounded by a polynomial in input size",
    what: `Complexity theory begins with a decision about what to measure. Not
      "how many steps on THIS machine for THIS input" — that changes with
      hardware and luck — but how the step count grows as inputs get large.
      Cobham and Edmonds independently proposed the now-universal dividing line:
      an algorithm is efficient ("good", Edmonds' word) if its running time is
      bounded by a polynomial nᵏ in the input size. Everything exponential —
      2ⁿ, n! — is, past modest sizes, physically hopeless. The growth-race lab
      above makes that gap visceral: watch n! lap the universe.`,
    how: `The same year, Hartmanis and Stearns founded the machine-independent
      theory in "On the Computational Complexity of Algorithms" — the paper that
      coined the very term and won them the 1993 Turing Award. Their hierarchy
      theorems proved something reassuring and deep: strictly more time buys
      strictly more computing power (TIME(n²) can do things TIME(n) cannot).
      Complexity has genuine internal structure, provable from first principles —
      unlike the field's most famous question, which we cannot answer at all.`,
    story: `The polynomial/exponential line was almost folklore made rigorous.
      Von Neumann had gestured at it; Gödel, in a now-legendary 1956 letter to
      the dying von Neumann (lost for decades, rediscovered in the 1980s), asked
      essentially the P-vs-NP question twenty years before it had a name —
      wondering whether a certain search could be done in linear or quadratic
      steps rather than by brute force, and noting how consequential it would be
      for mathematics if so. He was asking whether creativity itself could be
      mechanized. The field spent the next half-century formalizing his
      intuition — and still cannot resolve it.`,
    today: `The polynomial-time thesis is the daily working definition of
      "efficient" across all of computer science. It has honest critics — an
      n¹⁰⁰ algorithm is polynomial yet useless, and a 2^(0.0001 n) is exponential
      yet fine for a while — but as a robust, machine-independent, composable
      boundary it has no rival. Every "is there a fast algorithm?" question you
      will ever meet lives downstream of Cobham and Edmonds, 1965.`
  },
  {
    icon: "🔥", title: "P vs NP — the question worth a civilization", who: "Cook 1971 · Levin 1973 (independently, USSR)",
    lead: "If a solution is easy to CHECK, must it be easy to FIND? The most important open question in computer science — maybe in mathematics.",
    formula: "P: solvable in poly time · NP: checkable in poly time · P = NP ?  ($1,000,000)",
    what: `NP is the class of problems whose solutions can be VERIFIED quickly,
      even if finding them seems to require searching an exponential haystack. A
      completed Sudoku, a valid travel route under budget, a graph coloring — all
      trivial to check, apparently brutal to solve. P vs NP asks: is checking
      genuinely easier than finding, or is our sense of "brutal" just ignorance?
      The verify-vs-solve lab above lets you feel the asymmetry directly: check a
      coloring in a blink; try to FIND one and drown.`,
    how: `Stephen Cook's 1971 paper "The Complexity of Theorem-Proving
      Procedures" defined NP-completeness and proved the Cook–Levin theorem:
      Boolean satisfiability (SAT) is NP-complete — every NP problem reduces to
      it in polynomial time. So SAT is a universal key: a fast algorithm for it
      would collapse ALL of NP into P at once. Leonid Levin, in the USSR, proved
      the same thing independently and near-simultaneously; Cold War isolation
      and slow translation meant they didn't know of each other. Hence
      "Cook–Levin."`,
    story: `The stakes are almost theological. If P = NP (and the proof were
      constructive and practical), then finding is as easy as checking
      everywhere: mathematical proofs could be found by machine, most modern
      cryptography would collapse overnight (see Modern Cryptography — RSA's
      hardness is an NP-flavored bet), logistics and protein folding and circuit
      design would fall to fast optimization. Scott Aaronson's line captures it:
      if P = NP, then "everyone who could appreciate a symphony would be
      Mozart." It is one of the seven Clay Millennium Prize Problems — a million
      dollars for an answer. A famous 2002 poll of experts found the large
      majority believe P ≠ NP — but belief is not proof, and after 50+ years we
      have neither.`,
    today: `Thousands of NP-complete problems are now known across every
      discipline — all secretly the same problem in disguise, all standing or
      falling together. In practice, engineers don't surrender: SAT/SMT solvers
      routinely crack instances with millions of variables (the solver lab above
      is a baby version), and approximation algorithms trade exactness for
      speed. But the wall itself has never moved. P vs NP remains open, and every
      known proof technique has been shown to be, provably, not enough.`
  },
  {
    icon: "🏛", title: "The great catalog — Karp's 21 problems", who: "Richard Karp · 1972",
    lead: "One year after Cook, the floodgates open: the same brutal problem is found hiding everywhere.",
    formula: "reduction: A ≤ₚ B  ·  \"solve B fast ⇒ solve A fast\"  ·  the web of equivalence",
    what: `Cook proved ONE problem NP-complete. Karp's 1972 paper "Reducibility
      Among Combinatorial Problems" proved 21 more — packing, covering,
      partitioning, routing, scheduling, coloring — showing they are all
      polynomial-time reducible to one another. Solve any one efficiently and you
      solve them all. The reduction forge lab above lets you build one of these
      bridges by hand: turn a graph 3-coloring into a SAT formula and watch the
      solver crack it, proving the two problems are secretly identical.`,
    how: `A polynomial-time reduction A ≤ₚ B is a fast translator: it rewrites any
      instance of A as an instance of B, preserving the yes/no answer. It is the
      single most important tool in the field. To prove a NEW problem is as hard
      as the rest, you don't start from scratch — you reduce a KNOWN hard problem
      to it. Karp turned this into an industry: a spreading web of equivalences
      where cracking any node cracks the whole web. Hardness became contagious,
      and provably so.`,
    story: `Karp's paper is one of the most cited in all of computer science and
      won him the 1985 Turing Award. It transformed NP-completeness from a
      curiosity about logic (SAT) into a practical alarm bell ringing across
      every applied field: the moment your scheduling or routing or layout
      problem is shown NP-complete, you STOP hunting for a guaranteed-fast exact
      algorithm and switch strategy — heuristics, approximation, special cases.
      Karp handed working scientists a way to know, in an afternoon, whether a
      problem is a tar pit. Garey & Johnson's 1979 book then cataloged hundreds
      more; it remains the field's most-thumbed volume.`,
    today: `"Prove it's NP-complete, then stop looking for a perfect fast
      algorithm" is a standard professional move in operations research,
      bioinformatics, chip design, and machine learning. Reductions also power
      hardness-of-approximation (some problems are hard even to solve
      approximately) and underlie modern cryptography's security reductions —
      "breaking my scheme is at least as hard as this famous problem."`
  },
  {
    icon: "🏛", title: "Space, hierarchy & the surprises", who: "Savitch 1970 · Immerman–Szelepcsényi 1987 · Ladner 1975",
    lead: "Memory is a resource too — and it behaves strangely. Some 'obvious' conjectures turned out flat wrong.",
    formula: "PSPACE ⊇ NP ⊇ P · Savitch: NPSPACE = PSPACE · L ⊆ NL ⊆ P",
    what: `Time is not the only cost — MEMORY (space) is its own resource, with
      classes L (logarithmic space), PSPACE (polynomial space), and more. And
      space behaves counterintuitively. Savitch's theorem (1970): nondeterministic
      space is barely more powerful than deterministic space — NPSPACE = PSPACE,
      a collapse with no known time analogue. The field is full of these
      humbling reversals, where careful proof overturns "obvious" intuition.`,
    how: `Two landmark surprises. Ladner's theorem (1975): if P ≠ NP, there must
      exist "NP-intermediate" problems — neither in P nor NP-complete, stranded
      in between (graph isomorphism and factoring are suspected residents). So
      the NP world is not cleanly two-tiered. And Immerman–Szelepcsényi (1987):
      nondeterministic space is closed under complement (NL = co-NL) — proved
      independently on two sides of the Iron Curtain, resolving a 25-year-old
      open problem and sharing the 1995 Gödel Prize. Intuition loses; proof
      wins.`,
    story: `These results are the field's connoisseur pleasures. Ladner's
      construction is a delicate "diagonalization by blowing holes" that builds a
      problem deliberately too irregular to be complete yet too hard to be easy.
      The Immerman–Szelepcsényi story is a Cold War echo of Cook–Levin: Neil
      Immerman in the US and Róbert Szelepcsényi in Czechoslovakia solved the
      same famous open problem at essentially the same moment, unaware of each
      other — the field's second great simultaneous discovery, and a reminder
      that good problems are "in the air."`,
    today: `Space complexity underpins streaming algorithms (tiny memory, huge
      data), database theory, and the analysis of what can be computed under
      severe memory limits. PSPACE-completeness is the natural home of two-player
      games and planning problems — the reason perfect play in generalized chess
      or Go is believed intractable in a sense even deeper than NP.`
  },
  {
    icon: "🔥", title: "Randomness & interaction — computation gets social", who: "Solovay–Strassen 1977 · GMR 1985 · IP=PSPACE 1990",
    lead: "Let a computer flip coins, or argue with a prover. Two ideas that rewired what 'proof' and 'efficient' mean.",
    formula: "BPP: efficient WITH coins · IP = PSPACE (Shamir 1990) · PCP: proofs checkable in O(1) bits",
    what: `Two resources beyond time and space reshaped the field. RANDOMNESS:
      allow coin flips and accept a tiny error probability, and some problems get
      dramatically easier (BPP). INTERACTION: replace a static written proof with
      a conversation — a skeptical Verifier interrogating a powerful Prover.
      Goldwasser, Micali and Rackoff's interactive and zero-knowledge proofs
      (1985) — the same paper you met in Modern Cryptography's ZK cave — grew
      into one of the most surprising theorems in the field.`,
    how: `Two shockers. IP = PSPACE (Shamir, 1990): interactive proofs, with a
      randomized verifier asking questions, can verify an ENORMOUS class —
      everything in polynomial space — far beyond what NP's static proofs reach.
      And the PCP theorem (1992, "the hardest theorem in complexity"): every
      proof can be rewritten so a verifier who reads only a CONSTANT number of
      randomly chosen bits catches any error with high probability. This sounds
      impossible; it is true; and it is the engine behind modern
      hardness-of-approximation and today's cryptographic zk-SNARKs.`,
    story: `The 1977 randomized primality test (Solovay–Strassen) was a
      watershed: for the first time, coin-flipping made a real, wanted problem
      practical, and RSA depended on exactly such tests to find big primes.
      (Primality was later shown to be in P outright — the 2002 AKS algorithm, by
      Agrawal and two undergraduate students Kayal and Saxena in India, a result
      so clean it stunned the field.) The IP = PSPACE breakthrough famously
      spread across the theory community by email in late 1989 in a matter of
      days — the field watching a wall fall in real time.`,
    today: `Randomized algorithms are everywhere (hashing, cryptography, Monte
      Carlo, primality). Whether randomness is FUNDAMENTALLY necessary — the
      P = BPP question — is now widely conjectured FALSE (derandomization: coins
      may be dispensable), the opposite of the 1980s expectation. And the
      interactive-proof lineage runs straight to the zk-SNARKs and verifiable
      computation securing modern blockchains and privacy systems.`
  },
  {
    icon: "🔥", title: "Why P vs NP is so hard — the barriers", who: "Relativization 1975 · Natural Proofs 1994 · Algebrization 2008",
    lead: "The deepest result may be about our own powerlessness: three proofs that our proof techniques cannot work.",
    formula: "Barriers: Relativization (BGS'75) · Natural Proofs (RR'94) · Algebrization (AW'08)",
    what: `Half a century of failure on P vs NP produced something rare and
      profound: theorems explaining WHY it's hard — meta-results showing entire
      families of techniques are provably incapable of settling it. This is the
      field turning its own weapons on itself, and it is why P vs NP is not
      "just a hard problem" but a wall guarded by proven no-go theorems.`,
    how: `Three barriers. RELATIVIZATION (Baker–Gill–Solovay, 1975): there are
      oracle worlds where P = NP and others where P ≠ NP, so any proof that would
      work relative to every oracle (most classical techniques, including
      diagonalization) CANNOT decide the real question. NATURAL PROOFS
      (Razborov–Rudich, 1994): a broad class of "natural" circuit-lower-bound
      arguments would, if they worked, break the very cryptography they'd imply
      exists — self-defeating. ALGEBRIZATION (Aaronson–Wigderson, 2008): even
      clever algebraic extensions that dodge the first barrier hit a new one. To
      solve P vs NP, you must evade all three.`,
    story: `Razborov and Rudich received the 2007 Gödel Prize for, in essence,
      proving a large chunk of the community's collective strategy was doomed —
      a startling act of mathematical honesty. The barriers reframed the whole
      enterprise: progress now requires "non-naturalizing, non-relativizing,
      non-algebrizing" techniques, and the rare recent advances (like Ryan
      Williams' 2011 circuit lower bounds) are celebrated precisely because they
      thread these needles. The field has mapped the walls of its own prison in
      exquisite detail.`,
    today: `The barriers are the working researcher's compass: any claimed P-vs-NP
      proof is checked against them first, and thousands of amateur "proofs" are
      dismissed in seconds because they obviously relativize. Geometric
      complexity theory (Mulmuley) is one serious, decades-long program explicitly
      designed to evade the barriers using deep algebraic geometry — a bet that
      resolving P vs NP may require mathematics not yet invented.`
  }
];

// ---------------------------------------------------------------- sources
const SOURCES = [
  {
    type: "FOUNDATIONAL PAPER · 1965",
    title: "Hartmanis & Stearns — On the Computational Complexity of Algorithms",
    note: "Coined \u201Ccomputational complexity\u201D; the time-hierarchy theorems. 1993 Turing Award.",
    url: "https://doi.org/10.1090/S0002-9947-1965-0170805-7"
  },
  {
    type: "FOUNDATIONAL PAPER · 1971",
    title: "Stephen Cook — The Complexity of Theorem-Proving Procedures",
    note: "Defines NP-completeness; proves SAT is NP-complete (the Cook–Levin theorem).",
    url: "https://doi.org/10.1145/800157.805047"
  },
  {
    type: "FOUNDATIONAL PAPER · 1972",
    title: "Richard Karp — Reducibility Among Combinatorial Problems",
    note: "The 21 NP-complete problems — hardness is everywhere, and contagious. 1985 Turing Award.",
    url: "https://doi.org/10.1007/978-1-4684-2001-2_9"
  },
  {
    type: "PROBLEM STATEMENT · CLAY $1M",
    title: "Clay Mathematics Institute — The P vs NP Problem (official)",
    note: "The Millennium Prize problem itself, with Cook's authoritative problem description (PDF).",
    url: "https://www.claymath.org/millennium/p-vs-np/"
  },
  {
    type: "SURVEY · MUST-READ",
    title: "Lance Fortnow — The Status of the P versus NP Problem (CACM 2009)",
    note: "The definitive modern popular-yet-rigorous survey of where the question stands and why it's hard.",
    url: "https://doi.org/10.1145/1562164.1562186"
  },
  {
    type: "LEGENDARY BOOK",
    title: "Garey & Johnson — Computers and Intractability: A Guide to NP-Completeness (1979)",
    note: "The field's most-thumbed book; its NP-complete catalog is still a working reference.",
    url: "https://en.wikipedia.org/wiki/Computers_and_Intractability"
  },
  {
    type: "OPEN TEXTBOOK · FREE DRAFT",
    title: "Arora & Barak — Computational Complexity: A Modern Approach",
    note: "The standard graduate text; the full draft is free from the authors' Princeton page.",
    url: "https://theory.cs.princeton.edu/complexity/"
  },
  {
    type: "PLAY TO LEARN · FREE",
    title: "Complexity Zoo — the encyclopedia of 500+ complexity classes",
    note: "The field's beloved, slightly unhinged catalog of every class ever defined. Fall in and wander.",
    url: "https://complexityzoo.net"
  }
];

// ------------------------------------------------------------------- style
const CX_CSS = `
  #panel .cx-race{margin:.6rem 0}
  #panel .cx-rrow{display:flex;align-items:center;gap:.4rem;margin:.32rem 0}
  #panel .cx-rrow > i{width:4.7rem;flex:none;font:500 .62rem "IBM Plex Mono",monospace;font-style:normal;text-align:right;color:#c9c4dc}
  #panel .cx-track{flex:1;height:15px;border-radius:999px;background:rgba(0,0,0,.3);overflow:hidden;position:relative;min-width:0}
  #panel .cx-bar{position:absolute;left:0;top:0;bottom:0;border-radius:999px;transition:width .5s ease}
  #panel .cx-val{width:6.6rem;flex:none;font:500 .58rem "IBM Plex Mono",monospace;color:#a9a1c2;text-align:left}
  #panel .cx-bar.p1{background:#57e08a}#panel .cx-bar.p2{background:#4dd0c9}#panel .cx-bar.p3{background:var(--gold)}
  #panel .cx-bar.e1{background:#ff9d5c}#panel .cx-bar.e2{background:#ff5d6c}
  #panel .cx-verdict{font:500 .62rem "IBM Plex Mono",monospace;color:#ffad91;margin:.4rem 0 0;line-height:1.5}
  #panel .cx-graph{position:relative;height:210px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:rgba(0,0,0,.2);margin:.6rem 0;touch-action:manipulation}
  #panel .cx-node{position:absolute;width:34px;height:34px;border-radius:50%;transform:translate(-50%,-50%);border:2px solid rgba(255,255,255,.5);cursor:pointer;display:flex;align-items:center;justify-content:center;font:600 .7rem "IBM Plex Mono",monospace;color:#0a0710;transition:background .15s,box-shadow .15s;background:#3a3550}
  #panel .cx-node.c0{background:#57e08a}#panel .cx-node.c1{background:#f5c451}#panel .cx-node.c2{background:#6ba8ff}
  #panel .cx-node.bad{box-shadow:0 0 0 3px #ff5d6c}
  #panel .cx-edge{position:absolute;height:2px;background:rgba(255,255,255,.22);transform-origin:0 50%;pointer-events:none}
  #panel .cx-edge.clash{background:#ff5d6c;height:3px}
  #panel .cx-palette{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap;margin:.4rem 0}
  #panel .cx-swatch{width:1.5rem;height:1.5rem;border-radius:50%;border:2px solid transparent;cursor:pointer}
  #panel .cx-swatch.sel{border-color:#fff}
  #panel .cx-swatch.c0{background:#57e08a}#panel .cx-swatch.c1{background:#f5c451}#panel .cx-swatch.c2{background:#6ba8ff}
  #panel .cx-cnf{font:500 .66rem/1.9 "IBM Plex Mono",monospace;color:#c9c4dc;background:rgba(0,0,0,.22);border-radius:8px;padding:.5rem .6rem;margin:.4rem 0;word-break:break-word}
  #panel .cx-cnf b{color:var(--gold)}
  #panel .cx-lit{display:inline-block;padding:.05rem .3rem;border-radius:4px;background:rgba(255,255,255,.06)}
  #panel .cx-lit.t{color:#9fe8c0}#panel .cx-lit.f{color:#ff9db0}
  #panel .cx-assign{display:flex;flex-wrap:wrap;gap:.35rem;margin:.4rem 0}
  #panel .cx-assign button{border:1px solid rgba(255,255,255,.16);border-radius:7px;background:rgba(0,0,0,.2);color:#c9c4dc;font:600 .74rem "IBM Plex Mono",monospace;padding:.3rem .5rem;cursor:pointer;min-width:2.6rem}
  #panel .cx-assign button.t{color:#0a0710;background:#57e08a;border-color:#57e08a}
  #panel .cx-assign button.f{color:#fff;background:#43384f}
  #panel .cx-map{position:relative;width:100%;height:250px;border:1px solid rgba(255,255,255,.09);border-radius:10px;overflow:hidden;margin:.6rem 0;background:radial-gradient(circle at 50% 120%,rgba(120,90,200,.18),rgba(0,0,0,.25))}
  #panel .cx-ring{position:absolute;border:1px dashed rgba(255,255,255,.16);border-radius:50%;transform:translate(-50%,-50%);left:50%}
  #panel .cx-lbl{position:absolute;transform:translate(-50%,-50%);font:500 .6rem "IBM Plex Mono",monospace;color:#c9c4dc;background:rgba(10,7,16,.7);padding:.1rem .35rem;border-radius:5px;cursor:help;white-space:nowrap}
  #panel .cx-lbl.cls{color:var(--gold);border:1px solid rgba(245,196,81,.4)}
  #panel .cx-lbl.prob{color:#9fe8c0;font-size:.55rem}
  #panel .cx-info{min-height:2.4rem;font:400 .68rem/1.5 "IBM Plex Mono",monospace;color:var(--dim);border-left:2px solid rgba(245,196,81,.4);padding:.3rem .55rem;margin:.3rem 0}
  #panel .cx-toggle{display:flex;gap:.4rem;margin:.4rem 0}
  #panel .cx-toggle button{flex:1;border:1px solid rgba(255,255,255,.16);border-radius:8px;background:rgba(255,255,255,.02);color:var(--ink);font:500 .64rem "IBM Plex Mono",monospace;padding:.45rem;cursor:pointer}
  #panel .cx-toggle button.on{color:var(--gold);border-color:rgba(245,196,81,.55);background:rgba(245,196,81,.06)}
  @media(prefers-reduced-motion:reduce){#panel .cx-bar,#panel .cx-node{transition:none}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("complexity-css")) {
    const style = document.createElement("style");
    style.id = "complexity-css";
    style.textContent = CX_CSS;
    document.head.appendChild(style);
  }
}

const $ = id => document.getElementById(id);
const fmtBig = x => {
  if (!isFinite(x)) return "∞ (overflow)";
  if (x < 1e4) return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const e = Math.floor(Math.log10(x));
  return (x / 10 ** e).toFixed(1) + "×10^" + e;
};
const AGE_UNIVERSE_OPS = 4.35e17 * 1e12; // ~age of universe (s) × 1e12 ops/s

// ================================================= LAB 1: GROWTH-RATE RACE
const GROWTHS = [
  { key: "log n",  cls: "p1", f: n => Math.log2(Math.max(2, n)) },
  { key: "n",      cls: "p2", f: n => n },
  { key: "n²",     cls: "p3", f: n => n * n },
  { key: "2ⁿ",     cls: "e1", f: n => Math.pow(2, n) },
  { key: "n!",     cls: "e2", f: n => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; } }
];
function renderRace(n) {
  const host = $("cx-race");
  if (!host) return;
  const vals = GROWTHS.map(g => g.f(n));
  const logmax = Math.max(...vals.map(v => Math.log10(Math.max(1, Math.min(v, 1e308))))) || 1;
  host.innerHTML = GROWTHS.map((g, i) => {
    const v = vals[i];
    const w = Math.min(100, 100 * Math.log10(Math.max(1, Math.min(v, 1e308))) / logmax);
    let note = "";
    if (v > AGE_UNIVERSE_OPS) note = " ⚠ > age of universe";
    return `<div class="cx-rrow"><i>${g.key}</i>
      <div class="cx-track"><div class="cx-bar ${g.cls}" style="width:${Math.max(2, w)}%"></div></div>
      <div class="cx-val">${fmtBig(v)}${note}</div></div>`;
  }).join("");
  const nf = GROWTHS[4].f(n), twon = Math.pow(2, n);
  const secs = nf / 1e12;
  $("cx-race-verdict").innerHTML =
    `At n=${n}: a billion-ops/ms machine finishes n² in ${fmtBig(n*n/1e12)} s, ` +
    `but n! takes ${secs > AGE_UNIVERSE_OPS/1e12 ? "longer than the universe has existed" : fmtBig(secs)+" s"}. ` +
    `This gap — polynomial vs exponential — is the entire reason the field exists.`;
}

// ======================================= LAB 2 & 3: GRAPH COLORING + SAT
// A fixed 3-colorable graph (Petersen-ish small instance). Nodes + edges.
const GNODES = [
  { x: 50, y: 22 }, { x: 78, y: 42 }, { x: 68, y: 76 },
  { x: 32, y: 76 }, { x: 22, y: 42 }, { x: 50, y: 50 }
];
const GEDGES = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[2,5],[4,5],[1,3]];
const COLORS = ["c0", "c1", "c2"];
const CG = { colors: new Array(6).fill(-1), sel: 0, solveTimer: null, tries: 0 };

function edgeClashes(colors) {
  return GEDGES.filter(([a, b]) => colors[a] !== -1 && colors[a] === colors[b]);
}
function isProper(colors) {
  return colors.every(c => c !== -1) && edgeClashes(colors).length === 0;
}
function renderGraph() {
  const host = $("cx-graph");
  if (!host) return;
  const W = host.clientWidth || 300, H = 210;
  const clash = edgeClashes(CG.colors);
  const clashSet = new Set(clash.flat());
  let html = "";
  for (const [a, b] of GEDGES) {
    const x1 = GNODES[a].x/100*W, y1 = GNODES[a].y/100*H;
    const x2 = GNODES[b].x/100*W, y2 = GNODES[b].y/100*H;
    const len = Math.hypot(x2-x1, y2-y1), ang = Math.atan2(y2-y1, x2-x1)*180/Math.PI;
    const bad = clash.some(([c,d]) => (c===a&&d===b)||(c===b&&d===a));
    html += `<div class="cx-edge${bad?" clash":""}" style="left:${x1}px;top:${y1}px;width:${len}px;transform:rotate(${ang}deg)"></div>`;
  }
  GNODES.forEach((nd, i) => {
    const c = CG.colors[i];
    html += `<div class="cx-node ${c>=0?COLORS[c]:""}${clashSet.has(i)&&c>=0?" bad":""}"
      data-node="${i}" style="left:${nd.x/100*W}px;top:${nd.y/100*H}px">${i+1}</div>`;
  });
  host.innerHTML = html;
  host.querySelectorAll("[data-node]").forEach(el =>
    el.addEventListener("click", () => {
      CG.colors[+el.dataset.node] = CG.sel; renderGraph(); updateColorStatus();
    }));
}
function updateColorStatus() {
  const st = $("cx-color-status");
  const clash = edgeClashes(CG.colors);
  const filled = CG.colors.filter(c => c !== -1).length;
  if (isProper(CG.colors)) {
    st.className = "it-feasible yes";
    st.textContent = "✓ Proper 3-coloring! Every edge joins two different colors. Notice: I could VERIFY that in one glance across 9 edges — but FINDING it made you think. That asymmetry is NP.";
  } else if (clash.length) {
    st.className = "it-feasible no";
    st.textContent = "✕ " + clash.length + " edge" + (clash.length>1?"s":"") + " joins same-colored nodes (glowing red). Checking is instant; the search is the hard part.";
  } else {
    st.className = "it-feasible no";
    st.textContent = filled + "/6 colored. Adjacent nodes must differ. Verifying a finished coloring is trivial — that's the whole point of NP.";
  }
}
function autoSolveColoring() {
  if (CG.solveTimer) { clearInterval(CG.solveTimer); CG.solveTimer = null; $("cx-color-solve").textContent = "watch brute force search"; return; }
  // honest backtracking search, animated
  const order = [0,1,2,3,4,5];
  let stack = [{ i: 0, c: 0 }];
  CG.colors = new Array(6).fill(-1); CG.tries = 0;
  $("cx-color-solve").textContent = "⏸ stop";
  CG.solveTimer = setInterval(() => {
    if (!stack.length) { clearInterval(CG.solveTimer); CG.solveTimer=null; return; }
    const top = stack[stack.length-1];
    CG.tries++;
    if (top.c > 2) { CG.colors[order[top.i]] = -1; stack.pop(); if (stack.length) stack[stack.length-1].c++; renderGraph(); return; }
    CG.colors[order[top.i]] = top.c;
    const ok = !edgeClashes(CG.colors.map((c,idx)=> order.slice(0,top.i+1).includes(idx)?c:-1)).length;
    renderGraph();
    if (ok) {
      if (top.i === 5) { clearInterval(CG.solveTimer); CG.solveTimer=null;
        $("cx-color-solve").textContent = "watch brute force search";
        const st=$("cx-color-status"); st.className="it-feasible yes";
        st.textContent="✓ Backtracking found it in "+CG.tries+" steps. Small here — but colorings, SAT, routing all explode exponentially as the graph grows. That explosion is the wall.";
        return; }
      stack.push({ i: top.i+1, c: 0 });
    } else { top.c++; }
  }, 180);
}

// ---- 3-SAT solver (real DPLL-ish exhaustive) + reduction from coloring ----
// Reduction: each node i gets 3 booleans x_{i,0..2} (node i has color c).
// Clauses: (has some color) ∧ (not two colors) ∧ (edge endpoints differ).
function buildCnfFromGraph() {
  const varOf = (i, c) => i * 3 + c + 1; // 1-indexed DIMACS-style
  const clauses = [];
  for (let i = 0; i < 6; i++) {
    clauses.push([varOf(i,0), varOf(i,1), varOf(i,2)]);            // at least one
    clauses.push([-varOf(i,0), -varOf(i,1)]);                       // at most one (pairwise)
    clauses.push([-varOf(i,0), -varOf(i,2)]);
    clauses.push([-varOf(i,1), -varOf(i,2)]);
  }
  for (const [a, b] of GEDGES)
    for (let c = 0; c < 3; c++) clauses.push([-varOf(a,c), -varOf(b,c)]); // not same color
  return clauses;
}
function solveSat(clauses, nVars) {
  const assign = new Array(nVars + 1).fill(null);
  function dpll(i) {
    if (i > nVars) return clauses.every(cl => cl.some(l => assign[Math.abs(l)] === (l > 0)));
    for (const val of [true, false]) {
      assign[i] = val;
      const dead = clauses.some(cl =>
        cl.every(l => assign[Math.abs(l)] !== null && assign[Math.abs(l)] !== (l > 0)));
      if (!dead && dpll(i + 1)) return true;
    }
    assign[i] = null; return false;
  }
  return dpll(1) ? assign : null;
}
const SATV = { showCnf: false };
function renderReduction() {
  const clauses = buildCnfFromGraph();
  const nVars = 18;
  $("cx-cnf-count").textContent = clauses.length;
  if (SATV.showCnf) {
    const lit = l => {
      const v = Math.abs(l)-1, node = Math.floor(v/3)+1, col = v%3;
      return `<span class="cx-lit ${l>0?'t':'f'}">${l>0?'':'¬'}x${node},${['G','Y','B'][col]}</span>`;
    };
    $("cx-cnf").innerHTML = clauses.slice(0, 12).map(cl =>
      "(" + cl.map(lit).join(" ∨ ") + ")").join(" <b>∧</b> ") + " <b>∧</b> … (" + (clauses.length-12) + " more)";
  } else {
    $("cx-cnf").innerHTML = "<span style='color:#817a9d'>SAT formula hidden — press \u201Cshow the formula\u201D to see the 3-coloring rewritten as pure Boolean logic (" + clauses.length + " clauses over 18 variables).</span>";
  }
}
function runReduction() {
  const clauses = buildCnfFromGraph();
  const sol = solveSat(clauses, 18);
  const st = $("cx-sat-status");
  if (sol) {
    for (let i = 0; i < 6; i++)
      for (let c = 0; c < 3; c++) if (sol[i*3+c+1]) CG.colors[i] = c;
    renderGraph(); updateColorStatus();
    st.className = "it-feasible yes";
    st.textContent = "✓ The SAT solver found a satisfying assignment — and I painted it back onto the graph above. You just watched graph-coloring and Boolean-SAT be THE SAME PROBLEM. That equivalence is Karp's reduction, by hand.";
  } else {
    st.className = "it-feasible no";
    st.textContent = "UNSAT — no assignment works (shouldn't happen for this graph).";
  }
}

// ================================================= LAB 4: P vs NP LANDSCAPE
const ZOO = {
  pnp: [ // if P ≠ NP (the believed world)
    { r: 18, lbl: "P", cls: "cls", x: 50, y: 78, info: "P — solvable in polynomial time. Sorting, shortest paths, linear programming, primality (AKS 2002)." },
    { r: 40, lbl: "NP", cls: "cls", x: 50, y: 62, info: "NP — solutions checkable in polynomial time. Contains P. If P≠NP, strictly bigger." },
    { lbl: "NP-complete", cls: "prob", x: 50, y: 30, info: "NP-complete — the hardest in NP; all of NP reduces to them. SAT, 3-coloring, TSP, Clique, Hamiltonian cycle, Subset-sum." },
    { lbl: "NP-intermediate", cls: "prob", x: 78, y: 55, info: "Ladner 1975: if P≠NP, problems stranded between P and NP-complete. Suspected: factoring, graph isomorphism." },
    { lbl: "PSPACE", cls: "cls", r: 56, x: 50, y: 52, info: "PSPACE — polynomial memory. Contains NP. Home of games (generalized chess/Go) and IP (=PSPACE, Shamir 1990)." }
  ],
  probs: [
    { lbl: "SAT", x: 50, y: 30 }, { lbl: "3-Color", x: 40, y: 26 }, { lbl: "TSP", x: 60, y: 26 },
    { lbl: "sorting", x: 50, y: 82 }, { lbl: "shortest path", x: 38, y: 80 },
    { lbl: "factoring?", x: 78, y: 50 }
  ]
};
function renderLandscape(collapsed) {
  const host = $("cx-map");
  if (!host) return;
  const W = host.clientWidth || 300, H = 250;
  let html = "";
  if (collapsed) {
    html += `<div class="cx-ring" style="width:${W*0.8}px;height:${H*0.8}px;top:50%"></div>`;
    html += `<div class="cx-lbl cls" style="left:50%;top:50%">P = NP = NP-complete</div>`;
    ["SAT","3-Color","TSP","sorting","factoring"].forEach((p,i)=>{
      const a = -Math.PI/2 + i*(2*Math.PI/5), rx=W*0.28, ry=H*0.28;
      html += `<div class="cx-lbl prob" style="left:${50+Math.cos(a)*28}%;top:${50+Math.sin(a)*28}%">${p}</div>`;
    });
    host.innerHTML = html;
    $("cx-map-info").textContent = "The collapsed world (P = NP): finding is as easy as checking. Cryptography dies, optimization is trivial, machines find proofs. Almost nobody believes we live here — but nobody can prove we don't.";
    return;
  }
  // nested ellipses for classes
  const rings = [ [0.9,"PSPACE",64], [0.62,"NP",42], [0.30,"P",76] ];
  rings.forEach(([f,lbl,yc])=>{
    html += `<div class="cx-ring" style="width:${W*f}px;height:${H*f*0.62}px;top:${yc}%"></div>`;
  });
  ZOO.pnp.forEach(z => {
    html += `<div class="cx-lbl ${z.cls}" data-info="${z.info||''}" style="left:${z.x}%;top:${z.y}%">${z.lbl}</div>`;
  });
  ZOO.probs.forEach(p => {
    html += `<div class="cx-lbl prob" style="left:${p.x}%;top:${p.y}%">${p.lbl}</div>`;
  });
  host.innerHTML = html;
  host.querySelectorAll("[data-info]").forEach(el =>
    el.addEventListener("click", () => { $("cx-map-info").textContent = el.dataset.info; }));
  $("cx-map-info").textContent = "The believed world (P ≠ NP). Tap any class label to learn what lives there. Note NP-intermediate — Ladner's stranded problems — off to the side.";
}

// -------------------------------------------------------------- chapter UI
function chapterMarkup(chapter, index) {
  return `<details class="it-chapter" ${index === 0 ? "open" : ""}>
    <summary>
      <span class="it-chapter-title">${chapter.icon} ${chapter.title}</span>
      <span class="it-chapter-meta">${chapter.who}</span>
      <span class="it-chapter-lead">${chapter.lead}</span>
    </summary>
    <div class="it-chapter-body">
      <code class="it-formula">${chapter.formula}</code>
      <div class="it-tabs" role="tablist" aria-label="${chapter.title} perspectives">
        <button class="it-tab on" data-view="what">WHAT</button>
        <button class="it-tab" data-view="how">HOW</button>
        <button class="it-tab" data-view="story">STORY</button>
        <button class="it-tab" data-view="today">TODAY</button>
      </div>
      <p class="it-copy">${chapter.what}</p>
    </div>
  </details>`;
}
function sourceMarkup(source) {
  return `<a class="it-source" href="${source.url}" target="_blank" rel="noopener">
    <small>${source.type}</small><strong>${source.title}</strong>
    <span>${source.note}</span><i aria-hidden="true">↗</i></a>`;
}
function bindChapterTabs(module) {
  module.querySelectorAll("details.it-chapter").forEach((details, index) => {
    details.querySelectorAll(".it-tab").forEach(button => button.addEventListener("click", () => {
      details.querySelectorAll(".it-tab").forEach(b => b.classList.toggle("on", b === button));
      details.querySelector(".it-copy").textContent = CHAPTERS[index][button.dataset.view];
    }));
  });
}

// ------------------------------------------------------------------- build
function buildExperience() {
  ensureStyles();
  const body = $("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(t => t.remove());
  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · THE ECONOMICS OF THOUGHT · ABOUT 40 MIN</div>
    <p class="it-hook">Turing asked what can be computed. Complexity theory asks the crueler question: what can be computed before the sun burns out?</p>
    <p class="it-intro">Computability draws the line between possible and impossible. Complexity draws the line — often far more consequential — between possible and AFFORDABLE. Its central question, P vs NP, carries a million-dollar prize and would, if answered one way, dissolve modern cryptography and mechanize mathematical creativity itself. This is the field where "it exists" and "you can have it" part ways. Four labs below: feel the exponential wall, feel the check-vs-find gap, turn one hard problem into another with your hands, and map the landscape of P vs NP.</p>
    <div class="it-timeline" aria-label="Complexity theory timeline">
      <div class="it-moment"><b>1965</b><span>P defined</span></div>
      <div class="it-moment"><b>1971</b><span>Cook: NP-complete</span></div>
      <div class="it-moment"><b>1972</b><span>Karp's 21</span></div>
      <div class="it-moment"><b>1990</b><span>IP=PSPACE</span></div>
      <div class="it-moment"><b>1994</b><span>Barriers</span></div>
    </div>

    <section class="it-lab" aria-labelledby="cx-race-title">
      <div class="it-kicker">PLAYABLE ATOM 1 · WHY THE LINE IS POLYNOMIAL</div>
      <h3 id="cx-race-title">The growth-rate race</h3>
      <p class="it-lab-intro">Five algorithms, same problem, different growth. Drag the input size and watch polynomial curves (green/teal/gold) stay sane while exponentials (orange/red) detonate. The bars are log-scaled — the honest numbers on the right are the real story.</p>
      <div class="it-control">
        <label for="cx-n"><span>input size n</span><output id="cx-nv">12</output></label>
        <input id="cx-n" type="range" min="1" max="25" step="1" value="12">
      </div>
      <div class="cx-race" id="cx-race"></div>
      <p class="cx-verdict" id="cx-race-verdict"></p>
      <p class="it-caveat">A modern machine does ~10¹² operations/second. n! at n=25 is ~1.5×10²⁵ — over 400 years. At n=60, longer than the universe has existed. THIS is why "polynomial vs exponential", not "fast vs slow", is the field's dividing line.</p>
    </section>

    <section class="it-lab" aria-labelledby="cx-color-title">
      <div class="it-kicker">PLAYABLE ATOM 2 · NP, FELT IN THE HANDS</div>
      <h3 id="cx-color-title">Verify vs solve — the 3-coloring bench</h3>
      <p class="it-lab-intro">Color all 6 nodes so no edge joins two of the same color (3 colors allowed). Checking a finished coloring takes one glance; FINDING one makes your brain sweat. That gap — trivial to verify, apparently hard to solve — is the definition of NP, and you're about to feel it, not read it.</p>
      <div class="cx-palette">
        <span style="color:#817a9d;font:400 .6rem monospace">paint with:</span>
        <div class="cx-swatch c0 sel" data-c="0"></div>
        <div class="cx-swatch c1" data-c="1"></div>
        <div class="cx-swatch c2" data-c="2"></div>
        <span style="color:#817a9d;font:400 .58rem monospace">tap a node to color it</span>
      </div>
      <div class="cx-graph" id="cx-graph"></div>
      <div id="cx-color-status" class="it-feasible no"></div>
      <div class="it-lab-actions">
        <button class="it-send" id="cx-color-solve">watch brute force search</button>
        <button class="it-send" id="cx-color-clear" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">clear</button>
      </div>
      <p class="it-caveat">The "watch brute force" button runs a real backtracking search — for 6 nodes it's instant, but the step count explodes as 3ⁿ. Sudoku, class scheduling, seating charts, map coloring: all the same NP wall, all secretly the next lab.</p>
    </section>

    <section class="it-lab" aria-labelledby="cx-sat-title">
      <div class="it-kicker">PLAYABLE ATOM 3 · KARP'S REDUCTION, BY HAND · COOK–LEVIN</div>
      <h3 id="cx-sat-title">The reduction forge — coloring becomes SAT</h3>
      <p class="it-lab-intro">Here is the field's superpower. Watch the exact 3-coloring graph above get rewritten as a pure Boolean satisfiability formula — 18 variables ("node i has color c"), a pile of clauses enforcing the rules — then let a real SAT solver crack it and paint the answer back onto the graph. Two problems that look nothing alike, proven identical before your eyes.</p>
      <div class="cx-toggle">
        <button id="cx-cnf-toggle">show the formula (<span id="cx-cnf-count">?</span> clauses)</button>
        <button id="cx-run-reduction" class="on">solve via SAT → paint graph</button>
      </div>
      <div class="cx-cnf" id="cx-cnf"></div>
      <div id="cx-sat-status" class="it-feasible no">Press \u201Csolve via SAT\u201D — the solver's answer becomes a graph coloring. That round-trip IS the Cook–Levin theorem in miniature.</div>
      <p class="it-caveat">Every one of the thousands of NP-complete problems can be translated into SAT like this, and back. That's what "complete" means: SAT is a master key. Crack it fast and all of NP falls — which is exactly why a fast SAT algorithm would win the million dollars.</p>
    </section>

    <section class="it-lab" aria-labelledby="cx-map-title">
      <div class="it-kicker">PLAYABLE ATOM 4 · THE MAP OF HARDNESS</div>
      <h3 id="cx-map-title">Two possible universes</h3>
      <p class="it-lab-intro">The whole drama on one map. Flip between the world almost everyone believes (P ≠ NP, a rich hierarchy) and the world that would end cryptography (P = NP, everything collapses to one blob). Tap any class in the P≠NP view to see what lives there.</p>
      <div class="cx-toggle">
        <button id="cx-world-pnp" class="on">P ≠ NP (believed)</button>
        <button id="cx-world-collapse">P = NP (collapse)</button>
      </div>
      <div class="cx-map" id="cx-map"></div>
      <p class="cx-info" id="cx-map-info"></p>
      <p class="it-caveat">A 2002 and 2012 poll of theorists found ~80–90% believe P ≠ NP — but a belief held by everyone for 50 years is still not a proof. That, precisely, is the scandal and the beauty of this field.</p>
    </section>

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>In the race, find the n where n! first exceeds "age of the universe" ops. Then 2ⁿ. The distance between those two n's is why even exponentials differ wildly.</li>
      <li>Solve the 3-coloring by hand, then hit brute force and count its steps. You beat the machine on 6 nodes. Now imagine 600.</li>
      <li>Show the SAT formula. Find the three clauses that encode "node 1 has exactly one color." Why does at-most-one need three pairwise clauses, not one?</li>
      <li>Run the reduction and watch SAT paint the graph. Explain to a friend why this proves 3-coloring is "no harder than" SAT.</li>
      <li>In the map, tap NP-intermediate. Name the two famous suspected residents, and say why factoring living there would matter for RSA.</li>
      <li>Read Fortnow's survey (sources). Then state, in one sentence, why diagonalization — the hero of Gödel and Turing next door — provably CANNOT settle P vs NP. (Hint: relativization.)</li>
    </ol></div>
    <h3 class="it-section-title">Landmark papers, legendary books & free resources</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1
  const nEl = $("cx-n");
  renderRace(+nEl.value);
  nEl.addEventListener("input", e => { $("cx-nv").textContent = e.target.value; renderRace(+e.target.value); });

  // Lab 2
  CG.colors = new Array(6).fill(-1); CG.sel = 0;
  renderGraph(); updateColorStatus();
  module.querySelectorAll(".cx-swatch").forEach(sw =>
    sw.addEventListener("click", () => {
      CG.sel = +sw.dataset.c;
      module.querySelectorAll(".cx-swatch").forEach(s => s.classList.toggle("sel", s === sw));
    }));
  $("cx-color-solve").addEventListener("click", autoSolveColoring);
  $("cx-color-clear").addEventListener("click", () => {
    if (CG.solveTimer) { clearInterval(CG.solveTimer); CG.solveTimer = null; $("cx-color-solve").textContent = "watch brute force search"; }
    CG.colors = new Array(6).fill(-1); renderGraph(); updateColorStatus();
  });

  // Lab 3
  SATV.showCnf = false; renderReduction();
  $("cx-cnf-toggle").addEventListener("click", () => {
    SATV.showCnf = !SATV.showCnf;
    $("cx-cnf-toggle").classList.toggle("on", SATV.showCnf);
    renderReduction();
  });
  $("cx-run-reduction").addEventListener("click", runReduction);

  // Lab 4
  let collapsed = false;
  renderLandscape(false);
  $("cx-world-pnp").addEventListener("click", () => {
    collapsed = false; $("cx-world-pnp").classList.add("on"); $("cx-world-collapse").classList.remove("on"); renderLandscape(false);
  });
  $("cx-world-collapse").addEventListener("click", () => {
    collapsed = true; $("cx-world-collapse").classList.add("on"); $("cx-world-pnp").classList.remove("on"); renderLandscape(true);
  });

  // redraw graph/map on resize (positions are % based)
  if (!window.__cxResizeBound) {
    window.__cxResizeBound = true;
    window.addEventListener("resize", () => {
      if ($("cx-graph")) renderGraph();
      if ($("cx-map")) renderLandscape(document.querySelector("#cx-world-collapse.on") ? true : false);
    });
  }
}

window.openComplexityExperience = buildExperience;
// test hook
window.__cxTest = { buildCnfFromGraph, solveSat, isProper, edgeClashes, GEDGES,
  growths: GROWTHS.map(g => g.key) };
})();
