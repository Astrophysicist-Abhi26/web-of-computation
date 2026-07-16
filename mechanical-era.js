// THE MECHANICAL ERA — Babbage's brass engines and Lovelace's first program,
// a century before electronics. Loaded only when the "Mechanical Era" field
// opens. Same architecture as computability / automata / complexity: the WHOLE
// guide renders INTO #panel-body as one <section class="it-module"> using the
// shared it-* base classes, plus scoped #panel .mec-* widget styles. Four labs
// are REAL: a finite-difference tabulator (the Difference Engine), a working
// Analytical-Engine mini-VM (Mill / Store / operation cards, with loops), an
// exact Bernoulli-number generator (the output of Note G), and a symbol-weaving
// lab dramatizing Lovelace's leap from numbers to any symbols.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "⚙️", title: "Gears before Babbage — the dream of mechanized calculation",
    who: "Pascal 1642 · Leibniz 1673 · Jacquard 1804",
    lead: "For two centuries, inventors tried to freeze arithmetic into brass. Each got a piece of the idea; none got a computer.",
    formula: "a mechanical adder must ripple the carry:  9 + 1 → 10  (one wheel turns the next)",
    what: `Blaise Pascal's 1642 Pascaline added and subtracted through geared wheels
      that carried automatically from one column to the next. Gottfried Leibniz's 1673
      Stepped Reckoner added multiplication and division — and Leibniz, dreaming further,
      invented binary arithmetic and imagined a "calculus ratiocinator" that would let
      thinkers settle disputes by saying "let us calculate." In 1804 Joseph-Marie
      Jacquard's loom used punched cards to control the weaving of arbitrary patterns:
      information stored as holes, driving a machine. That card is the direct ancestor of
      the program.`,
    how: `These machines were special-purpose: a calculator does arithmetic, a loom weaves
      cloth. The conceptual gap to a computer is the idea that one machine, fed different
      instructions, could carry out any procedure. Pascal and Leibniz supplied the arithmetic
      organs; Jacquard supplied programmable control. Babbage's genius was to see that these
      could be fused into a single general engine.`,
    story: `The motivation was error. In the 19th century, navigation, banking, engineering
      and astronomy all depended on printed mathematical tables — logarithms, tides, star
      positions — computed and typeset by hand by human "computers." The tables were riddled
      with mistakes, and a wrong log table could sink a ship. Babbage, examining error-strewn
      astronomical tables around 1821, reportedly exclaimed, "I wish to God these calculations
      had been executed by steam." The wish became a life's work.`,
    today: `Every idea here survived. Binary is the substrate of all digital computing;
      punched cards ran data processing into the 1970s; and Leibniz's dream of mechanizing
      reasoning is exactly the ambition of automated theorem provers and, arguably, of
      machine learning.`
  },
  {
    icon: "⚙️", title: "The Difference Engine — perfect tables by addition alone",
    who: "Charles Babbage · 1822 (built 1991)",
    lead: "A machine to compute and print mathematical tables with no human error — using the one operation gears do best: addition.",
    formula: "method of differences:  the d-th differences of a degree-d polynomial are constant",
    what: `Babbage's insight (1822) was the method of finite differences: any polynomial can
      be tabulated using only repeated addition, no multiplication at all. Set up a column of
      running differences, and each new table value is produced by a cascade of additions —
      value += Δ; Δ += Δ²; and so on. Build it in the tabulator lab above and watch primes
      fall out of a machine that never multiplies. Babbage designed the Difference Engine to
      do this automatically and to print the results directly, eliminating both calculation
      and typesetting errors.`,
    how: `Difference Engine No. 1 (1822) was to have some 25,000 parts and weigh around 15
      tons. The British government funded it — the first state-funded computing project — but
      after a decade, cost overruns and a bitter split with his master engineer Joseph Clement
      stalled it. Babbage then designed the far more elegant Difference Engine No. 2
      (1847–49), needing only ~8,000 parts, and never built that either. It holds 8 numbers
      of 31 digits and tabulates 7th-degree polynomials.`,
    story: `The vindication came 120 years late. Between 1985 and 1991 the Science Museum in
      London, led by curator Doron Swade, built Difference Engine No. 2 faithfully from
      Babbage's drawings, to tolerances no better than Victorian workshops could achieve. It
      works — calculating to 31 digits — proving that achievable precision was never the
      obstacle. Babbage's failure, the project concluded, was one of politics, economics and
      personality, not of engineering.`,
    today: `The living machine stands in the Science Museum, London. Its lesson is stark: a
      correct design is not a working product. The gap between "provably buildable" and
      "actually built" — funding, management, incentives — still decides which technologies
      arrive when.`
  },
  {
    icon: "🏛", title: "The Analytical Engine — a general-purpose computer in brass",
    who: "Charles Babbage · 1837 onward",
    lead: "The leap from a calculator to a computer: one machine that could carry out any calculation, controlled by punched cards.",
    formula: "Mill  +  Store  +  Cards     ≅     CPU  +  memory  +  program (a century early)",
    what: `Around 1837 Babbage conceived something new: not a table-maker but a universal
      calculating machine. It had a Mill (the arithmetic unit — the CPU), a Store (memory,
      designed for about 1,000 numbers of 40+ decimal digits), and punched-card input
      borrowed from Jacquard, split into operation cards and variable cards. Crucially it
      supported conditional branching and loops — the cards could be "backed up" to repeat a
      group any number of times, the machine, in Babbage's phrase, "eating its own tail." Run
      a real program on a model of it in the Analytical-Engine lab above.`,
    how: `That architecture — a processor operating on a separate memory under stored
      instructions, with branching and iteration — is Turing-complete. It is, in all
      essentials, the shape of the machine you are reading this on, designed more than a
      century before von Neumann's 1945 report described the same organization for
      electronics. Babbage even anticipated microprogramming and a printer for output.`,
    story: `It was never built. The design grew ever more ambitious and complex; funding had
      already evaporated over the Difference Engine; and Babbage, brilliant but abrasive, kept
      refining rather than finishing until his death in 1871. The most complete contemporary
      account was not even his own — it came from an Italian military engineer, Luigi Menabrea
      (later a prime minister of Italy), who wrote up Babbage's Turin lectures in 1842.`,
    today: `Your laptop is a Babbage machine made of silicon: processor, memory, program-as-
      data, branches and loops. The Plan 28 project is now working to build the Analytical
      Engine at last, from Babbage's thousands of pages of notebooks.`
  },
  {
    icon: "🏛", title: "Ada Lovelace and the first program",
    who: "Ada Lovelace · 1843 · Note G",
    lead: "She translated a paper about the engine and, in her own notes, wrote the first published program — and saw further than its inventor.",
    formula: "Note G:  compute the Bernoulli numbers Bₖ  by a looped sequence of operation cards",
    what: `In 1843 Ada Lovelace translated Menabrea's sketch of the Analytical Engine from
      French and, at Babbage's suggestion, appended seven Notes (A–G) that ran three times
      the length of the original. Note G lays out a complete step-by-step program for the
      engine to compute the Bernoulli numbers — a looping sequence of operations on the
      Store's variables, widely regarded as the first published computer program. See its
      output, computed exactly, in the Bernoulli lab above.`,
    how: `Lovelace's deeper contribution was conceptual. In Note A she saw what Babbage had
      not stressed: the engine "might act upon other things besides number" — that if pitches
      or symbols could be represented, it "might compose elaborate and scientific pieces of
      music of any degree of complexity." Symbol manipulation, not mere arithmetic. That is
      the entire premise of modern computing, and you can feel it in the symbol-weaving lab.`,
    story: `Note G also contains the famous "Lovelace objection": the engine "has no
      pretensions whatever to originate anything. It can do whatever we know how to order it
      to perform." She meant it as clear-eyed caution against hype. In a July 1843 letter she
      told Babbage she wanted to show how "an implicit function may be worked out by the
      engine, without having been worked out by human head & hands first."`,
    today: `Turing answered her directly in 1950, naming "Lady Lovelace's Objection" and
      arguing that machines might yet surprise us — the opening move of the whole AI debate.
      The Ada programming language (1980) is named for her. The first programmer was a
      programmer of a machine that did not exist.`
  },
  {
    icon: "🪦", title: "Why it failed — and why that failure matters",
    who: "Babbage, Clement & the British Treasury · 1822–1871",
    lead: "A working general-purpose computer was buildable in the 1840s. It wasn't built. Understanding why is its own lesson.",
    formula: "correct design  +  no funding, no killer app, no finished machine  =  forgotten for a century",
    what: `The reasons were human, not physical. Precision machining was expensive and slow;
      the Difference Engine's decade of government money produced no finished machine, poisoning
      the well for the far grander Analytical Engine. There was no compelling application whose
      value obviously justified the enormous cost. And the ideas lived mostly in Babbage's head
      and unpublished notebooks, guarded and unfinished.`,
    how: `Babbage's perfectionism was fatal: he kept improving the design instead of shipping
      one. His famously combative personality alienated funders and allies. When he died in
      1871, no engine had ever computed a table, and the plans scattered into archives. The
      20th century reinvented nearly all of it — architecture, stored programs, conditional
      branching — largely unaware of him.`,
    story: `The counterfactual haunts the field. The 1991 reconstruction settled the
      engineering question — it would have worked — which sharpens the tragedy: the barrier was
      never the technology. It was the same tangle of money, management and timing that decides
      technological history today.`,
    today: `Every ambitious moonshot inherits Babbage's warning: being right, and even being
      buildable, is not enough. Vision must survive contact with budgets, institutions, and the
      discipline to finish.`
  },
  {
    icon: "🧟", title: "The long shadow — rediscovery, reconstruction, and substrate independence",
    who: "Aiken 1944 · Turing 1950 · Science Museum 1991 · Plan 28",
    lead: "The brass era looks obsolete — yet its ideas are the load-bearing walls of everything that followed.",
    formula: "computation is substrate-independent:  the same logic runs in brass, relays, tubes, silicon",
    what: `Howard Aiken, building Harvard's Mark I in 1944, explicitly invoked Babbage as his
      forerunner. Turing's 1950 paper engaged Lovelace by name. In 1991 the Science Museum's
      working Difference Engine No. 2 turned Babbage from a might-have-been into a proven
      pioneer, and John Graham-Cumming's Plan 28 now aims to build the Analytical Engine
      itself.`,
    how: `The deepest lesson of the era is that computation does not care what it is made of.
      The very same logical structure Babbage drew in brass gears was later realized in relays
      (Zuse), vacuum tubes (Colossus, ENIAC), transistors, and today in silicon at the scale of
      billions of switches. Change the substrate, keep the logic, and you have the same
      machine.`,
    story: `That is exactly Lovelace's point extended: if the logic is independent of the
      numbers, and the machine of the metal, then computing is about pattern and process, not
      matter. A model of it can run in your browser — as the four labs here do — which is
      itself a small proof of substrate independence.`,
    today: `This is why the Mechanical Era, though gloriously obsolete as hardware, is
      foundational as idea. Processor + memory + program, conditional branching, iteration,
      symbols standing for anything: the architecture of the 21st century was sketched in
      Victorian brass, and every other guide on this map is a descendant.`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "PRIMARY SOURCE · 1843", title: "Menabrea (trans. Lovelace) — Sketch of the Analytical Engine",
    note: "The fullest contemporary account of the Analytical Engine, translated from Menabrea's 1842 memoir. York University's full transcription.",
    url: "https://psychclassics.yorku.ca/Lovelace/menabrea.htm" },
  { type: "THE FIRST PROGRAM · 1843", title: "Ada Lovelace — Notes by the Translator (including Note G)",
    note: "Her seven Notes, 3× the length of the original — Note G is the Bernoulli-number program; Note A foresees symbol manipulation and music.",
    url: "https://psychclassics.yorku.ca/Lovelace/lovelace.htm" },
  { type: "FOUNDING PROPOSAL · 1822", title: "Babbage — Letter to Sir Humphry Davy on the Application of Machinery to Calculate Mathematical Tables",
    note: "The public birth of the Difference Engine and of state-funded computing. (Reprinted in Babbage's collected works.)",
    url: "https://www.sciencemuseum.org.uk/objects-and-stories/charles-babbages-difference-engines-and-science-museum" },
  { type: "MEMOIR · 1864", title: "Charles Babbage — Passages from the Life of a Philosopher",
    note: "Babbage's own account of the engines and his battles to build them — the only detailed description he published himself.",
    url: "https://www.gutenberg.org/ebooks/57532" },
  { type: "THE REBUTTAL · 1950", title: "Alan Turing — Computing Machinery and Intelligence",
    note: "Names and answers \u201CLady Lovelace's Objection\u201D — the opening of the modern debate on machine thought.",
    url: "https://doi.org/10.1093/mind/LIX.236.433" },
  { type: "THE RECONSTRUCTION", title: "Computer History Museum — The Babbage Engine: A Modern Sequel",
    note: "How the working Difference Engine No. 2 was built (1985–1991) and what it proved: Babbage's design would have worked.",
    url: "https://www.computerhistory.org/babbage/modernsequel/" },
  { type: "PEER-REVIEWED · 2005", title: "Doron Swade — The Construction of Charles Babbage's Difference Engine No. 2",
    note: "IEEE Annals of the History of Computing 27(3), 70–88: the definitive technical account of the reconstruction.",
    url: "https://doi.org/10.1109/MAHC.2005.45" },
  { type: "DEFINITIVE HISTORY · BOOK", title: "Doron Swade — The Difference Engine: Charles Babbage and the Quest to Build the First Computer",
    note: "The story of both the engines and the 17-year project to build one. Also published as The Cogwheel Brain.",
    url: "https://www.computerhistory.org/babbage/modernsequel/" },
  { type: "LOVELACE'S LETTERS · BOOK", title: "Betty Alexandra Toole — Ada, the Enchantress of Numbers",
    note: "A selection of Lovelace's letters, including her account of the first program in her own words.",
    url: "https://psychclassics.yorku.ca/Lovelace/lovelace.htm" },
  { type: "BUILD IT · FREE", title: "Plan 28 — the project to build Babbage's Analytical Engine",
    note: "John Graham-Cumming's ongoing effort to construct the Analytical Engine from Babbage's notebooks. Follow along or contribute.",
    url: "https://plan28.org/" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- Lab 1: Difference Engine (finite differences) ----
const POLYS = {
  square:   { name: "f(n) = n²",            deg: 2, f: n => n * n },
  cube:     { name: "f(n) = n³",            deg: 3, f: n => n * n * n },
  triangle: { name: "f(n) = n(n+1)/2",      deg: 2, f: n => n * (n + 1) / 2 },
  euler:    { name: "f(n) = n² + n + 41",   deg: 2, f: n => n * n + n + 41 }   // Euler's prime polynomial
};
// initial difference column: [f(0), Δf(0), Δ²f(0), …, Δᵈf(0)]
function initDiffs(poly) {
  const d = poly.deg;
  let row = [];
  for (let i = 0; i <= d; i++) row.push(poly.f(i));
  const diffs = [row[0]];
  for (let k = 1; k <= d; k++) {
    const next = [];
    for (let i = 0; i + 1 < row.length; i++) next.push(row[i + 1] - row[i]);
    row = next;
    diffs.push(row[0]);
  }
  return diffs; // length d+1
}
// one engine step: output diffs[0], then cascade additions upward
function stepDiffs(diffs) {
  const out = diffs[0];
  for (let i = 0; i < diffs.length - 1; i++) diffs[i] += diffs[i + 1];
  return out;
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// ---- Lab 2: Analytical Engine mini-VM ----
const AE_PROGRAMS = {
  factorial: {
    name: "n!  (a loop with a conditional)",
    vars: ["n", "acc", "one"],
    init: n => [n, 1, 1],
    result: 1,
    cards: [
      { op: "MUL", a: 1, b: 0, out: 1, txt: "V₁ ← V₁ × V₀   (acc × n)" },
      { op: "SUB", a: 0, b: 2, out: 0, txt: "V₀ ← V₀ − V₂   (n − 1)" },
      { op: "JNZ", a: 0, target: 0, txt: "if V₀ ≠ 0, back up the cards → card 0" },
      { op: "HALT", txt: "halt — result is in V₁" }
    ]
  },
  sumn: {
    name: "1 + 2 + … + n",
    vars: ["n", "sum", "one"],
    init: n => [n, 0, 1],
    result: 1,
    cards: [
      { op: "ADD", a: 1, b: 0, out: 1, txt: "V₁ ← V₁ + V₀   (sum + n)" },
      { op: "SUB", a: 0, b: 2, out: 0, txt: "V₀ ← V₀ − V₂   (n − 1)" },
      { op: "JNZ", a: 0, target: 0, txt: "if V₀ ≠ 0, back up the cards → card 0" },
      { op: "HALT", txt: "halt — result is in V₁" }
    ]
  }
};
function aeRun(progKey, n, cap) {
  const P = AE_PROGRAMS[progKey];
  const store = P.init(n);
  const trace = [{ pc: 0, store: store.slice(), note: "loaded: n = " + n }];
  let pc = 0, guard = 0;
  while (guard++ < (cap || 2000)) {
    const card = P.cards[pc];
    if (card.op === "HALT") { trace.push({ pc, store: store.slice(), note: "HALT", done: true }); break; }
    let note = "";
    if (card.op === "ADD") { store[card.out] = store[card.a] + store[card.b]; pc++; note = card.txt + "  ⇒  V" + sub(card.out) + " = " + store[card.out]; }
    else if (card.op === "SUB") { store[card.out] = store[card.a] - store[card.b]; pc++; note = card.txt + "  ⇒  V" + sub(card.out) + " = " + store[card.out]; }
    else if (card.op === "MUL") { store[card.out] = store[card.a] * store[card.b]; pc++; note = card.txt + "  ⇒  V" + sub(card.out) + " = " + store[card.out]; }
    else if (card.op === "DIV") { store[card.out] = Math.trunc(store[card.a] / store[card.b]); pc++; note = card.txt; }
    else if (card.op === "JNZ") { if (store[card.a] !== 0) { note = "V" + sub(card.a) + " = " + store[card.a] + " ≠ 0 → loop"; pc = card.target; } else { note = "V" + sub(card.a) + " = 0 → fall through"; pc++; } }
    trace.push({ pc, store: store.slice(), note });
  }
  return { trace, result: store[P.result], resultVar: P.result };
}
function sub(i) { return "₀₁₂₃₄₅₆₇₈₉".charAt(i) || ("[" + i + "]"); }

// ---- Lab 3: Bernoulli numbers (Note G's output), exact via BigInt fractions ----
function bgcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }
function fr(n, d) { if (d < 0n) { n = -n; d = -d; } const g = bgcd(n, d) || 1n; return { n: n / g, d: d / g }; }
function fAdd(x, y) { return fr(x.n * y.d + y.n * x.d, x.d * y.d); }
function fMul(x, y) { return fr(x.n * y.n, x.d * y.d); }
function binom(n, k) { // BigInt C(n,k)
  if (k < 0 || k > n) return 0n;
  let r = 1n; for (let i = 0; i < k; i++) r = r * BigInt(n - i) / BigInt(i + 1); return r;
}
function bernoulli(N) {
  const B = [fr(1n, 1n)]; // B0 = 1
  for (let m = 1; m <= N; m++) {
    let sum = fr(0n, 1n);
    for (let k = 0; k < m; k++) sum = fAdd(sum, fMul(fr(binom(m + 1, k), 1n), B[k]));
    B[m] = fMul(fr(-1n, BigInt(m + 1)), sum);
  }
  return B;
}
function fracStr(x) { return x.d === 1n ? x.n.toString() : x.n.toString() + "/" + x.d.toString(); }

// ---- Lab 4: symbol weaving (Lovelace's leap: numbers → music) ----
const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const MELODY = [0, 0, 7, 7, 9, 9, 7];         // "Twinkle, Twinkle" opening: C C G G A A G
function notesToNames(seq) { return seq.map(n => NOTE_NAMES[((n % 12) + 12) % 12]).join(" "); }
function transpose(seq, k) { return seq.map(n => ((n + k) % 12 + 12) % 12); }
function invert(seq, axis) { return seq.map(n => ((2 * axis - n) % 12 + 12) % 12); }
function retrograde(seq) { return seq.slice().reverse(); }

/* ============================================================ STYLES ======= */
const BRASS = "#d4a24e";
const MEC_CSS = `
  #panel .mec-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .mec-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#e6d3ad;
    background:rgba(212,162,78,.08);border:1px solid rgba(212,162,78,.32);border-radius:7px;
    padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .mec-chip:hover{border-color:${BRASS};color:#fff}
  #panel .mec-chip.on{background:${BRASS};color:#2a1c05;border-color:${BRASS};font-weight:700}
  #panel .mec-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .mec-regs{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0}
  #panel .mec-reg{border:1px solid rgba(212,162,78,.3);border-radius:8px;padding:.4rem .55rem;background:#120d05;min-width:3.2rem;text-align:center}
  #panel .mec-reg .lbl{display:block;font:500 .58rem/1 var(--mono,ui-monospace,monospace);letter-spacing:.1em;color:#b79a63;text-transform:uppercase}
  #panel .mec-reg .val{font:700 1rem/1.3 var(--mono,ui-monospace,monospace);color:#ffe9bf}
  #panel .mec-reg.hot{border-color:${BRASS};box-shadow:0 0 12px rgba(212,162,78,.4)}
  #panel .mec-out{font:.78rem/1.7 var(--mono,ui-monospace,monospace);color:#cde;background:#0a0f18;
    border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.6rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .mec-out .pr{color:${BRASS};font-weight:700}
  #panel .mec-cards{display:flex;flex-direction:column;gap:.28rem;margin:.5rem 0}
  #panel .mec-card{font:500 .72rem/1.4 var(--mono,ui-monospace,monospace);color:#bcd;
    border:1px solid rgba(255,255,255,.12);border-left:4px solid rgba(212,162,78,.3);border-radius:7px;padding:.4rem .55rem;background:rgba(255,255,255,.02);transition:.15s}
  #panel .mec-card.on{border-left-color:${BRASS};background:rgba(212,162,78,.12);color:#fff}
  #panel .mec-mill{font:.76rem/1.5 var(--mono,ui-monospace,monospace);color:#e6d3ad;min-height:1.5rem;margin:.4rem 0}
  #panel .mec-bern{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0}
  #panel .mec-b{font:500 .72rem/1.3 var(--mono,ui-monospace,monospace);color:#cde;border:1px solid rgba(255,255,255,.14);
    border-radius:8px;padding:.4rem .55rem;background:#0a0f18}
  #panel .mec-b.zero{opacity:.45}
  #panel .mec-b.noteG{border-color:${BRASS};color:#ffe9bf;box-shadow:0 0 12px rgba(212,162,78,.35)}
  #panel .mec-b b{color:#fff}
  #panel .mec-staff{display:flex;flex-wrap:wrap;gap:.35rem;margin:.5rem 0}
  #panel .mec-note{display:inline-flex;flex-direction:column;align-items:center;border:1px solid rgba(212,162,78,.3);
    border-radius:8px;padding:.35rem .5rem;background:#120d05;min-width:2.4rem}
  #panel .mec-note .nm{font:700 .9rem/1 var(--serif,Georgia,serif);color:#ffe9bf}
  #panel .mec-note .nn{font:500 .6rem/1.4 var(--mono,ui-monospace,monospace);color:#b79a63}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("mechanical-css")) {
    const st = document.createElement("style");
    st.id = "mechanical-css";
    st.textContent = MEC_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function diffLabHTML() {
  const chips = Object.keys(POLYS).map((k, i) =>
    `<button class="mec-chip${i===0?" on":""}" data-poly="${k}">${POLYS[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · THE DIFFERENCE ENGINE</div>
    <h3>Tabulate a polynomial using addition alone</h3>
    <p class="it-lab-intro">Babbage's trick: the d-th differences of a degree-d polynomial are constant, so every table value can be produced by a cascade of additions — no multiplication. Pick a function, then STEP the engine: it prints the current value, then adds each difference register into the one above it. Try the last one — Euler's polynomial n²+n+41 spits out primes for n = 0…39.</p>
    <div class="mec-chips" id="mec-poly">${chips}</div>
    <p class="mec-desc" id="mec-poly-desc"></p>
    <div class="mec-regs" id="mec-diff-regs"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="mec-diff-step">▶ step (print &amp; add)</button>
      <button class="it-send" id="mec-diff-run">run 10</button>
      <button class="it-send" id="mec-diff-reset" style="background:none;border:1px solid rgba(212,162,78,.5);color:${BRASS}">reset</button>
    </div>
    <div class="mec-out" id="mec-diff-out"></div>
    <p class="it-caveat">This is exactly how Difference Engine No. 2 works — and the 1991 reconstruction does it to 31 digits, in brass. A machine that only knows how to add, printing a table of primes: the whole point of the method of differences.</p>
  </section>`;
}

function aeLabHTML() {
  const chips = Object.keys(AE_PROGRAMS).map((k, i) =>
    `<button class="mec-chip${i===0?" on":""}" data-prog="${k}">${AE_PROGRAMS[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · THE ANALYTICAL ENGINE</div>
    <h3>Run a program — Mill, Store &amp; operation cards</h3>
    <p class="it-lab-intro">The Analytical Engine is a real computer: a Mill (the CPU), a Store (memory — the V registers below), and punched cards that direct it. This model runs an actual looping program with a conditional — the cards "back up" to repeat, just as Babbage described the machine "eating its own tail." Set n, then step through the cards and watch the Store change.</p>
    <div class="mec-chips" id="mec-ae-prog">${chips}</div>
    <div class="it-control">
      <label for="mec-ae-n"><span>input  n</span><output id="mec-ae-nv">5</output></label>
      <input id="mec-ae-n" type="range" min="1" max="8" step="1" value="5">
    </div>
    <div class="mec-regs" id="mec-ae-store"></div>
    <div class="mec-mill" id="mec-ae-mill"></div>
    <div class="mec-cards" id="mec-ae-cards"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="mec-ae-step">▶ feed next card</button>
      <button class="it-send" id="mec-ae-run">run to halt</button>
      <button class="it-send" id="mec-ae-reset" style="background:none;border:1px solid rgba(212,162,78,.5);color:${BRASS}">reset</button>
    </div>
    <div class="it-feasible no" id="mec-ae-verdict"></div>
    <p class="it-caveat">Processor operating on separate memory, under stored instructions, with branching and loops — that is a Turing-complete, von-Neumann-shaped computer, designed in the 1830s. Change brass for silicon and this is your laptop.</p>
  </section>`;
}

function bernLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · NOTE G · THE FIRST PROGRAM'S OUTPUT</div>
    <h3>The Bernoulli numbers — exactly</h3>
    <p class="it-lab-intro">Ada Lovelace's Note G was a program to make the Analytical Engine compute the Bernoulli numbers — a genuinely hard, looping calculation. Here they are, computed exactly as fractions (via the recurrence, in exact arithmetic). Slide n and watch them appear. Every odd Bₖ past B₁ is zero; the value Note G was written to reach is highlighted.</p>
    <div class="it-control">
      <label for="mec-bern-n"><span>compute B₀ … B</span><output id="mec-bern-nv">10</output></label>
      <input id="mec-bern-n" type="range" min="1" max="16" step="1" value="10">
    </div>
    <div class="mec-bern" id="mec-bern-list"></div>
    <p class="it-caveat">Lovelace, in her indexing of the non-zero terms, labeled her target B₇ — which is the modern B₈ = −1/30. She wanted, in her words, to show how "an implicit function may be worked out by the engine, without having been worked out by human head &amp; hands first." That is the ambition of every program since.</p>
  </section>`;
}

function symbolLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · LOVELACE'S LEAP</div>
    <h3>Numbers become any symbols — the engine composes</h3>
    <p class="it-lab-intro">Lovelace saw that the engine could "act upon other things besides number" — that if pitches were represented, it "might compose elaborate and scientific pieces of music of any degree of complexity." Here a melody is just a list of numbers (pitch classes 0–11). Apply an operation by pure arithmetic and hear a new melody fall out — the machine never knows it is making music.</p>
    <div class="mec-chips" id="mec-sym-ops">
      <button class="mec-chip on" data-op="orig">original</button>
      <button class="mec-chip" data-op="t5">transpose +5</button>
      <button class="mec-chip" data-op="t7">transpose +7</button>
      <button class="mec-chip" data-op="inv">invert (axis C)</button>
      <button class="mec-chip" data-op="retro">retrograde</button>
    </div>
    <div class="mec-out" id="mec-sym-math"></div>
    <div class="mec-staff" id="mec-sym-staff"></div>
    <p class="it-caveat">To the engine it is all arithmetic mod 12; the music lives only in how we choose to read the numbers. Swap the lookup table for letters and it writes text; for pixels and it draws. That single insight — symbols standing for anything — is the whole of modern computing, seen in 1843.</p>
  </section>`;
}

/* ============================================================ MARKUP ======= */
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

/* ============================================================ WIRING ======= */

// ---- Lab 1: Difference Engine ----
const DIFF = { key: "square", diffs: null, outputs: [], n: 0 };
function diffReset() { const p = POLYS[DIFF.key]; DIFF.diffs = initDiffs(p); DIFF.outputs = []; DIFF.n = 0; diffDraw(); }
function diffDraw() {
  const p = POLYS[DIFF.key];
  const labels = ["value", "Δ", "Δ²", "Δ³"];
  $("mec-diff-regs").innerHTML = DIFF.diffs.map((v, i) =>
    `<div class="mec-reg${i===0?" hot":""}"><span class="lbl">${labels[i] || ("Δ"+i)}</span><span class="val">${v}</span></div>`).join("");
  if (!DIFF.outputs.length) { $("mec-diff-out").innerHTML = "<span style='opacity:.55'>press step — the engine prints f(0), f(1), f(2), … using only additions.</span>"; return; }
  const showPrime = DIFF.key === "euler";
  $("mec-diff-out").innerHTML = DIFF.outputs.map(o => {
    const tag = showPrime ? (isPrime(o.v) ? " <span class='pr'>prime</span>" : " <span style='opacity:.5'>composite</span>") : "";
    return "f(" + o.n + ") = " + o.v + tag;
  }).join("\n");
}
function diffStep() {
  const v = stepDiffs(DIFF.diffs);
  DIFF.outputs.push({ n: DIFF.n, v });
  DIFF.n++;
  diffDraw();
}
function diffSelect(k) { DIFF.key = k; $("mec-poly-desc").textContent =
  k === "euler" ? "Euler's prime-generating polynomial: prime for every n from 0 to 39, then it finally fails at n = 40."
  : k === "cube" ? "A cubic — so the third differences (Δ³) are constant. The engine needs three difference registers."
  : k === "triangle" ? "The triangular numbers 0,1,3,6,10,… — second differences are constant."
  : "A quadratic — second differences (Δ²) are constant. Two difference registers suffice.";
  diffReset(); }

// ---- Lab 2: Analytical Engine ----
const AE = { key: "factorial", n: 5, run: null, step: 0 };
function aeReset() { AE.run = aeRun(AE.key, AE.n); AE.step = 0; aeDraw(); }
function aeDraw() {
  const P = AE_PROGRAMS[AE.key];
  const frame = AE.run.trace[Math.min(AE.step, AE.run.trace.length - 1)];
  // store
  $("mec-ae-store").innerHTML = frame.store.map((v, i) =>
    `<div class="mec-reg${i===P.result?" hot":""}"><span class="lbl">V${sub(i)} ${P.vars[i]}</span><span class="val">${v}</span></div>`).join("");
  // mill / note
  $("mec-ae-mill").textContent = frame.note || "";
  // cards
  $("mec-ae-cards").innerHTML = P.cards.map((c, i) =>
    `<div class="mec-card${i===frame.pc && !frame.done ? " on" : ""}">${i}. ${c.txt}</div>`).join("");
  // verdict
  const v = $("mec-ae-verdict");
  if (frame.done || AE.step >= AE.run.trace.length - 1) {
    v.className = "it-feasible yes";
    v.textContent = "✓ halted — V" + sub(AE.run.resultVar) + " = " + AE.run.result +
      (AE.key === "factorial" ? "  (" + AE.n + "! )" : "  ( 1+…+" + AE.n + " )");
  } else {
    v.className = "it-feasible no";
    v.textContent = "running — card " + frame.pc + " next";
  }
}

// ---- Lab 3: Bernoulli ----
function bernDraw(N) {
  const B = bernoulli(N);
  $("mec-bern-list").innerHTML = B.map((b, k) => {
    const zero = (b.n === 0n);
    const isG = (k === 8);
    return `<div class="mec-b${zero?" zero":""}${isG?" noteG":""}"><b>B${sub(k) || ("_"+k)}</b> = ${fracStr(b)}${isG?" ◂ Note G":""}</div>`;
  }).join("");
}

// ---- Lab 4: symbol weaving ----
function symDraw(op) {
  let seq = MELODY.slice(), label = "", math = "";
  if (op === "t5") { seq = transpose(MELODY, 5); label = "transpose +5 :  n ↦ (n + 5) mod 12"; }
  else if (op === "t7") { seq = transpose(MELODY, 7); label = "transpose +7 :  n ↦ (n + 7) mod 12"; }
  else if (op === "inv") { seq = invert(MELODY, 0); label = "invert about C :  n ↦ (−n) mod 12"; }
  else if (op === "retro") { seq = retrograde(MELODY); label = "retrograde :  reverse the list"; }
  else { label = "original melody (Twinkle, Twinkle)"; }
  math = label + "\n  in  : [" + MELODY.join(", ") + "]   → " + notesToNames(MELODY)
       + "\n  out : [" + seq.join(", ") + "]   → " + notesToNames(seq);
  $("mec-sym-math").textContent = math;
  $("mec-sym-staff").innerHTML = seq.map(n =>
    `<div class="mec-note"><span class="nm">${NOTE_NAMES[n]}</span><span class="nn">${n}</span></div>`).join("");
}

/* ============================================================ BUILD ======== */
function buildExperience() {
  ensureStyles();
  const body = $("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(t => t.remove());
  if (body.querySelector(".it-module")) return; // idempotent

  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · COMPUTATION IN BRASS · ABOUT 45 MIN</div>
    <p class="it-hook">A century before electronics, Charles Babbage designed a fully general computer out of brass gears, and Ada Lovelace wrote its first program — and saw, before anyone, that such a machine could weave symbols, not just numbers.</p>
    <p class="it-intro">This field is gloriously obsolete as hardware and load-bearing as idea. Here computation was first drawn as an architecture — a Mill, a Store, and punched cards — with conditional branching and loops, Turing-complete on paper in the 1830s. And here Ada Lovelace glimpsed the whole future: that a number machine, given the right interpretation, could manipulate any symbols at all. Four labs below: drive the Difference Engine to print a table of primes using only addition, run a real looping program on a model of the Analytical Engine, compute the exact Bernoulli numbers that Note G targeted, and watch the engine "compose music" by pure arithmetic.</p>
    <div class="it-timeline" aria-label="The Mechanical Era timeline">
      <div class="it-moment"><b>1822</b><span>Difference Engine</span></div>
      <div class="it-moment"><b>1837</b><span>Analytical Engine</span></div>
      <div class="it-moment"><b>1843</b><span>Note G · first program</span></div>
      <div class="it-moment"><b>1871</b><span>Babbage dies</span></div>
      <div class="it-moment"><b>1991</b><span>DE2 built — it works</span></div>
    </div>

    ${diffLabHTML()}
    ${aeLabHTML()}
    ${bernLabHTML()}
    ${symbolLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>Run the Difference Engine on "n² + n + 41" and step past n = 40. It has printed primes the whole way — until 40²+40+41 = 41² is the first composite. Why must any such polynomial eventually fail?</li>
      <li>Watch the difference registers, not the output. Notice Δ² never changes for a quadratic. Predict the next printed value from the registers alone before you press step.</li>
      <li>In the Analytical Engine, run n! for n = 5, then find the exact card where the loop "backs up." That single conditional card is the whole difference between a calculator and a computer.</li>
      <li>Switch the Analytical Engine to "1+…+n" without touching anything else. Same machine, different cards, different answer — that is Babbage's leap to a general-purpose engine.</li>
      <li>In the Bernoulli lab, find B₈ = −1/30 (Lovelace's B₇). Then notice every odd Bₖ after B₁ is exactly zero — the engine would have computed those too.</li>
      <li>In the symbol lab, apply "transpose +7" and read the numbers, not the notes. The engine did arithmetic; you heard music. Where did the music come from?</li>
    </ol></div>

    <h3 class="it-section-title">Primary sources, the reconstruction &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1: Difference Engine
  diffSelect("square");
  module.querySelectorAll("#mec-poly [data-poly]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#mec-poly [data-poly]").forEach(x => x.classList.toggle("on", x === b));
      diffSelect(b.dataset.poly);
    }));
  $("mec-diff-step").addEventListener("click", diffStep);
  $("mec-diff-run").addEventListener("click", () => { for (let i = 0; i < 10; i++) diffStep(); });
  $("mec-diff-reset").addEventListener("click", diffReset);

  // Lab 2: Analytical Engine
  aeReset();
  module.querySelectorAll("#mec-ae-prog [data-prog]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#mec-ae-prog [data-prog]").forEach(x => x.classList.toggle("on", x === b));
      AE.key = b.dataset.prog; aeReset();
    }));
  $("mec-ae-n").addEventListener("input", e => { AE.n = +e.target.value; $("mec-ae-nv").textContent = AE.n; aeReset(); });
  $("mec-ae-step").addEventListener("click", () => { if (AE.step < AE.run.trace.length - 1) { AE.step++; aeDraw(); } });
  $("mec-ae-run").addEventListener("click", () => { AE.step = AE.run.trace.length - 1; aeDraw(); });
  $("mec-ae-reset").addEventListener("click", aeReset);

  // Lab 3: Bernoulli
  bernDraw(10);
  $("mec-bern-n").addEventListener("input", e => { $("mec-bern-nv").textContent = e.target.value; bernDraw(+e.target.value); });

  // Lab 4: symbol weaving
  symDraw("orig");
  module.querySelectorAll("#mec-sym-ops [data-op]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#mec-sym-ops [data-op]").forEach(x => x.classList.toggle("on", x === b));
      symDraw(b.dataset.op);
    }));
}

window.openMechanicalExperience = buildExperience;

// test hook (parity with other guides)
window.__mecTest = { initDiffs, stepDiffs, POLYS, isPrime, aeRun, AE_PROGRAMS,
  bernoulli, fracStr, transpose, invert, retrograde, notesToNames, MELODY };
})();
