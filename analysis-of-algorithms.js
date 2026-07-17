// ANALYSIS OF ALGORITHMS — counting the cost before you run: the grammar of
// growth rates (Big-O/Ω/Θ), Knuth's programme of rigorous analysis, the sorting
// lower bound, the master theorem, and the quiet atom underneath deep learning
// (matrix multiply / BLAS and its still-open exponent). Loaded only when the
// "Analysis of Algorithms" field opens. Same architecture as the other guides:
// the WHOLE guide renders INTO #panel-body as one <section class="it-module">
// using the shared it-* base classes, plus scoped #panel .aoa-* widget styles.
// Five labs are REAL: a growth-rate race, an interactive Big-O/Ω/Θ threshold
// finder, an operation-counter that measures empirical complexity, a
// comparison-sort lower-bound (decision-tree / n log n) explorer, and a master-
// theorem / divide-and-conquer recurrence solver.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "📈", title: "Big-O — growth rate as the honest currency of speed",
    who: "Bachmann 1894 · Landau · Hardy · Knuth 1976",
    lead: "Wall-clock seconds lie — they depend on your machine, language, and mood. The honest measure is how the cost grows as the input grows. That is Big-O.",
    formula: "f(n) = O(g(n))   ⇔   ∃ c, n₀ :  f(n) ≤ c·g(n)  for all n ≥ n₀",
    what: `The notation was born in number theory: Paul Bachmann introduced O in his 1894
      "Die analytische Zahlentheorie," and Edmund Landau popularized it — long before computers.
      It says nothing about seconds; it says how a cost function grows. f(n)=O(g(n)) means f is
      eventually bounded above by a constant multiple of g. Find those constants yourself in the
      threshold lab above.`,
    how: `Big-O ignores constant factors and low-order terms on purpose, because those are what
      change between machines and compilers; the growth rate is what is intrinsic to the
      algorithm. 3n² + 100n + 5 is Θ(n²): for large n the n² term dominates and the rest is
      noise. This is why an O(n log n) sort beats an O(n²) one on big inputs no matter how fast
      the slow one's inner loop is.`,
    story: `Donald Knuth fixed the field's grammar in a 1976 SIGACT News letter, "Big Omicron and
      Big Omega and Big Theta," insisting on three distinct notations — O for upper bounds, Ω for
      lower bounds, Θ for tight bounds — after seeing people misuse O for both. He traced the
      history back through Hardy to Bachmann, and the discipline has spoken his dialect ever
      since.`,
    today: `Every algorithm you will ever meet is labeled with its Big-O. It is the first thing
      an interviewer asks, the axis every benchmark is plotted against, and the reason we can
      compare algorithms across decades and hardware. It is the closest thing computer science
      has to a universal unit.`
  },
  {
    icon: "🎯", title: "O, Ω, Θ — upper, lower, and tight",
    who: "Knuth's three notations · the anatomy of a bound",
    lead: "Three symbols, three claims. O is a ceiling, Ω is a floor, Θ is both — the difference between 'no worse than' and 'exactly this fast.'",
    formula: "O: ≤ c·g   ·   Ω: ≥ c·g   ·   Θ: both (c₁·g ≤ f ≤ c₂·g)",
    what: `O(g) is an upper bound: the algorithm is no slower than g, up to a constant. Ω(g) is
      a lower bound: no faster than g. Θ(g) is tight: sandwiched between two multiples of g, the
      exact growth rate. Saying "quicksort is O(n²)" (worst case) and "quicksort is Θ(n log n)"
      (average case) are different, both-true statements — the threshold lab lets you see each
      bound bite.`,
    how: `The subtlety people trip on: O is only a ceiling, so "this sort is O(n²)" does not mean
      it is slow — merely that it is never worse than n². To say something is genuinely as slow
      as n² you need Ω(n²). Knuth wrote his letter precisely because researchers were rejecting
      good algorithms by quoting an O-bound as if it were a Θ-bound.`,
    story: `There is a whole zoo of growth classes, and their order is worth memorizing like a
      scale: 1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!. The jump from polynomial (n^k) to
      exponential (2ⁿ) is the same chasm that P vs NP is about, one continent over — analysis and
      complexity theory are two views of the same mountain.`,
    today: `Amortized analysis (Tarjan, 1985) extended the toolkit to average cost over a
      sequence of operations — why a dynamic array's "occasionally expensive" resize is still
      O(1) per push on average. The vocabulary keeps growing, but O/Ω/Θ remain the nouns.`
  },
  {
    icon: "📚", title: "Knuth — making analysis the field's rigorous core",
    who: "Donald Knuth · The Art of Computer Programming · 1968 →",
    lead: "One man decided algorithms deserved the same rigor as pure mathematics — and spent his life proving it, volume by volume.",
    formula: "analyze exactly, not approximately:  count operations, prove bounds, leave nothing to hand-waving",
    what: `Beginning in 1968, Donald Knuth's multi-volume "The Art of Computer Programming"
      (TAOCP) set out to analyze algorithms with full mathematical rigor — exact operation counts,
      proven bounds, deep number theory and combinatorics. It transformed programming from craft
      into science. It is still being written: volumes 1–4A are out, more are promised, and it is
      routinely called one of the great works of 20th-century science.`,
    how: `Knuth's method is to count precisely what an algorithm does — comparisons, swaps, memory
      probes — as a function of the input, then bound it. The operation-counter lab above does a
      miniature version: it runs real algorithms and counts their actual basic operations so you
      can watch the growth curve emerge from measurement, not assertion.`,
    story: `Frustrated that 1970s typesetting mangled his mathematics, Knuth stopped for a decade
      and built TeX — the typesetting system that sets essentially every scientific paper (and
      probably your own). He also pays a "reward check" (\u0024 2.56, "one hexadecimal dollar")
      to anyone who finds an error in his books. Few cheques are cashed; most are framed.`,
    today: `TAOCP and its rigor underpin CLRS ("Introduction to Algorithms"), the textbook nearly
      every computer scientist learns from, and the analytical culture behind every published
      algorithm. Knuth made "what is its complexity, exactly?" a question with a real answer.`
  },
  {
    icon: "🪓", title: "Divide and conquer & the master theorem",
    who: "Merge sort (von Neumann 1945) · the recurrence toolkit",
    lead: "Break a problem into smaller copies, solve them, combine. The cost obeys a recurrence — and one theorem cracks most of them on sight.",
    formula: "T(n) = a·T(n/b) + f(n)     →     master theorem reads off Θ(T(n))",
    what: `Divide-and-conquer splits a size-n problem into a subproblems of size n/b, then spends
      f(n) work combining. Merge sort is the classic: split in half (a=2, b=2), sort each,
      merge in O(n) — giving T(n)=2T(n/2)+n = Θ(n log n). The master theorem lab above lets you
      dial a, b, and f and watch which of three cases decides the answer.`,
    how: `The master theorem compares the "leaf work" n^(log_b a) against the combine cost f(n).
      If the leaves dominate, T=Θ(n^log_b a); if the combine dominates, T=Θ(f(n)); if they
      balance, a log factor appears, T=Θ(n^log_b a · log n). Three cases, and most textbook
      recurrences fall into one at a glance.`,
    story: `It also explains famous surprises. Karatsuba multiplication (1960) multiplies big
      numbers with 3 recursive half-size multiplies instead of 4 — T(n)=3T(n/2)+n = Θ(n^1.585),
      beating the "obvious" n². Strassen did the same for matrices in 1969: 7 multiplies instead
      of 8, cracking the n³ barrier and opening a race that is still running.`,
    today: `Merge sort, quicksort, FFT, Karatsuba, Strassen, closest-pair — the paradigm and its
      recurrence analysis are everywhere. The master theorem is the single most-used tool for
      pricing a recursive algorithm, taught in week one of every algorithms course.`
  },
  {
    icon: "⚖️", title: "Lower bounds — proving you can't do better",
    who: "The comparison-sort barrier · Ω(n log n)",
    lead: "Upper bounds say 'here's a way.' Lower bounds say 'no way is faster' — a far deeper and rarer kind of knowledge.",
    formula: "any comparison sort makes  Ω(n log n)  comparisons:  log₂(n!) ≈ n log n",
    what: `Analysis is not only about clever algorithms; sometimes it proves a wall. Any sorting
      algorithm that works only by comparing pairs of elements must make at least Ω(n log n)
      comparisons — you cannot do better in general. The argument is beautiful: a comparison sort
      is a binary decision tree, and it must have a leaf for every one of the n! possible
      orderings. The lower-bound lab above builds that tree.`,
    how: `A binary tree with n! leaves has height at least log₂(n!), and by Stirling's
      approximation log₂(n!) ≈ n log₂ n. Since each comparison is one level of the tree, the
      worst case needs that many comparisons. So merge sort's O(n log n) is not just good — it is
      optimal, matching the Ω(n log n) floor. Upper meets lower; the problem is solved.`,
    story: `The escape hatch is to stop comparing. Counting sort and radix sort run in O(n) by
      using the values as array indices instead of comparing them — sidestepping the barrier
      entirely because the theorem only binds comparison-based methods. Knowing exactly what a
      lower bound assumes is how you learn when to break the rules.`,
    today: `Lower bounds are the deepest currency in the field: an O(n log n) upper bound plus a
      matching Ω(n log n) lower bound means comparison sorting is finished — no future genius will
      beat it. Most problems (including matrix multiply, next) have a gap between the best known
      upper and lower bounds, and closing it is where the research lives.`
  },
  {
    icon: "✳️", title: "The quiet atom — matrix multiply and its open exponent",
    who: "BLAS 1979 · Strassen 1969 → the ω race",
    lead: "The single most consequential cost in modern computing is one line of analysis: how fast can you multiply two matrices? Nobody knows.",
    formula: "n × n matrix multiply is O(n^ω)     ·     2 ≤ ω < 2.371552…  (open!)",
    what: `Multiplying two n×n matrices the obvious way costs n³ multiply-adds. In 1969 Volker
      Strassen showed it can be done in O(n^2.807) — a shock that launched a fifty-year hunt for
      the true exponent ω. The current record is ω < 2.3715, and everyone believes ω = 2 (you
      surely need at least n² just to read the input), but nobody has proven it. It is one of the
      great open problems in the theory of computation.`,
    how: `This is not academic. Numerical linear algebra libraries (BLAS, standardized in 1979)
      turn matrix multiply into the most heavily optimized operation on Earth, and — as the
      Hardware continent showed — every layer of every neural network is a matrix multiply. The
      exponent ω is literally the asymptotic price of deep learning. In practice, cache-friendly
      Θ(n³) methods still win at real sizes, because the fast algorithms hide enormous constants.`,
    story: `Matrix multiplication is the quietest, deepest node on the whole Web of Computation:
      its exponent is an open Algorithms problem, its throughput defines Hardware (MACs/watt), and
      it is the atom of every Machine-Learning model. In 2022 DeepMind's AlphaTensor used
      reinforcement learning to discover new matrix-multiply algorithms — AI improving the very
      operation that powers AI, a loop this map was built to show.`,
    today: `Analysis of algorithms began in 1894 counting the growth of number-theoretic sums; it
      now sets the price of intelligence itself. From Bachmann's O to the exponent ω, this field is
      the accounting system for everything the other continents build. Count the cost before you
      run — and sometimes, prove that no one can run it faster.`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "ORIGIN · 1894", title: "Paul Bachmann — Die analytische Zahlentheorie",
    note: "Where O-notation was born, in number theory — the source Knuth traced the notation back to (hence this field's birth year).",
    url: "https://archive.org/details/dieanalytischeza00bachuoft" },
  { type: "THE GRAMMAR · 1976", title: "Donald Knuth — Big Omicron and Big Omega and Big Theta",
    note: "The SIGACT News letter that fixed O, Ω, Θ as three distinct notations and set the field's dialect.",
    url: "https://doi.org/10.1145/1008328.1008329" },
  { type: "THE MASTERWORK · 1968–", title: "Donald Knuth — The Art of Computer Programming",
    note: "The multi-volume attempt to analyze algorithms with full mathematical rigor. Still being written; a landmark of 20th-century science.",
    url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" },
  { type: "THE TEXTBOOK", title: "Cormen, Leiserson, Rivest & Stein — Introduction to Algorithms (CLRS)",
    note: "The standard modern course text; its Chapter 3–4 are the canonical treatment of asymptotics and the master theorem.",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
  { type: "BREAKTHROUGH · 1969", title: "Volker Strassen — Gaussian Elimination is not Optimal",
    note: "The paper that broke the n³ matrix-multiply barrier (O(n^2.807)) and opened the fifty-year hunt for the exponent ω.",
    url: "https://doi.org/10.1007/BF02165411" },
  { type: "THE STANDARD · 1979", title: "Lawson, Hanson, Kincaid & Krogh — Basic Linear Algebra Subprograms (BLAS)",
    note: "The interface that made matrix multiply the most-optimized operation in computing — the invisible atom under all deep learning.",
    url: "https://doi.org/10.1145/355841.355847" },
  { type: "AI FINDS ALGORITHMS · 2022", title: "Fawzi et al. (DeepMind) — Discovering faster matrix multiplication with AlphaTensor",
    note: "Reinforcement learning discovers new matrix-multiply algorithms — AI improving the operation that powers AI. Nature.",
    url: "https://doi.org/10.1038/s41586-022-05172-4" },
  { type: "AMORTIZED · 1985", title: "Robert Tarjan — Amortized Computational Complexity",
    note: "How to analyze the average cost of an operation across a sequence — why a dynamic array's resize is still O(1) amortized.",
    url: "https://doi.org/10.1137/0606031" },
  { type: "PLAY & VISUALIZE · FREE", title: "VisuAlgo — algorithm & data-structure visualizations",
    note: "Watch sorts, recurrences, and data structures animate step by step; a superb free companion to this field.",
    url: "https://visualgo.net/en" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- growth functions for the race & threshold labs ----
const GROWTH = {
  const:  { name: "O(1)",       f: n => 1,                         color: "#7dd3fc" },
  log:    { name: "O(log n)",   f: n => Math.log2(Math.max(1, n)), color: "#5dff9e" },
  sqrt:   { name: "O(√n)",      f: n => Math.sqrt(n),              color: "#a0e8af" },
  linear: { name: "O(n)",       f: n => n,                         color: "#e9c46a" },
  nlogn:  { name: "O(n log n)", f: n => n * Math.log2(Math.max(1, n)), color: "#f5a15a" },
  quad:   { name: "O(n²)",      f: n => n * n,                     color: "#e76f51" },
  cubic:  { name: "O(n³)",      f: n => n * n * n,                 color: "#d1495b" },
  exp:    { name: "O(2ⁿ)",      f: n => Math.pow(2, Math.min(n, 40)), color: "#c1121f" }
};
const GROWTH_ORDER = ["const","log","sqrt","linear","nlogn","quad","cubic","exp"];

// ---- Lab: empirical operation counters (real algorithms, real counts) ----
function countLinearSearch(arr, target) {
  let ops = 0;
  for (let i = 0; i < arr.length; i++) { ops++; if (arr[i] === target) return { ops, found: true }; }
  return { ops, found: false };
}
function countBinarySearch(sorted, target) {
  let ops = 0, lo = 0, hi = sorted.length - 1;
  while (lo <= hi) { ops++; const mid = (lo + hi) >> 1; if (sorted[mid] === target) return { ops, found: true }; if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1; }
  return { ops, found: false };
}
function countBubbleSort(arr) {
  const a = arr.slice(); let ops = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length - 1 - i; j++) { ops++; if (a[j] > a[j + 1]) { const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; } }
  return { ops, sorted: a };
}
function countMergeSort(arr) {
  let ops = 0;
  function merge(l, r) { const out = []; let i = 0, j = 0; while (i < l.length && j < r.length) { ops++; if (l[i] <= r[j]) out.push(l[i++]); else out.push(r[j++]); } while (i < l.length) out.push(l[i++]); while (j < r.length) out.push(r[j++]); return out; }
  function ms(a) { if (a.length <= 1) return a; const m = a.length >> 1; return merge(ms(a.slice(0, m)), ms(a.slice(m))); }
  const sorted = ms(arr.slice());
  return { ops, sorted };
}
const ALGOS = {
  linsearch: { name: "linear search", theory: "O(n)", run: n => countLinearSearch(rangeArr(n), -1).ops },   // worst case: not found
  binsearch: { name: "binary search", theory: "O(log n)", run: n => countBinarySearch(rangeArr(n), -1).ops },
  bubble:    { name: "bubble sort",   theory: "O(n²)", run: n => countBubbleSort(shuffled(n)).ops },
  merge:     { name: "merge sort",    theory: "O(n log n)", run: n => countMergeSort(shuffled(n)).ops }
};
function rangeArr(n) { const a = new Array(n); for (let i = 0; i < n; i++) a[i] = i; return a; }
function shuffled(n) { const a = rangeArr(n); for (let i = n - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

// ---- Lab: comparison-sort lower bound (decision tree) ----
function factorial(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
function log2Fact(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log2(i); return s; }   // log2(n!)
function lowerBound(n) {
  const perms = factorial(n);
  const treeHeight = Math.ceil(log2Fact(n));      // min comparisons in worst case
  const nlogn = n * Math.log2(Math.max(1, n));
  return { perms, treeHeight, nlogn };
}

// ---- Lab: master theorem ----
// T(n) = a T(n/b) + Θ(n^d).  Compare d against log_b(a).
function masterTheorem(a, b, d) {
  const logba = Math.log(a) / Math.log(b);
  const EPS = 1e-9;
  let cas, result;
  if (d < logba - EPS) { cas = 1; result = "Θ(n^" + fmt(logba) + ")"; }
  else if (Math.abs(d - logba) <= EPS) { cas = 2; result = "Θ(n^" + fmt(d) + " · log n)"; }
  else { cas = 3; result = "Θ(n^" + fmt(d) + ")"; }
  return { logba, cas, result };
}
function fmt(x) { return (Math.abs(x - Math.round(x)) < 1e-9) ? String(Math.round(x)) : x.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""); }

// famous recurrences to preset
const RECURRENCES = {
  merge:     { name: "merge sort",       a: 2, b: 2, d: 1, note: "split in 2, linear merge → Θ(n log n)" },
  binary:    { name: "binary search",    a: 1, b: 2, d: 0, note: "one half, O(1) work → Θ(log n)" },
  karatsuba: { name: "Karatsuba mult.",  a: 3, b: 2, d: 1, note: "3 half-size mults → Θ(n^1.585), beats n²" },
  strassen:  { name: "Strassen matmul",  a: 7, b: 2, d: 2, note: "7 mults of n/2 blocks → Θ(n^2.807), beats n³" },
  naivemat:  { name: "naive matmul (÷)", a: 8, b: 2, d: 2, note: "8 mults of n/2 blocks → Θ(n³)" }
};

/* ============================================================ STYLES ======= */
const TEAL = "#2dd4bf";     // the Algorithms domain hue (175°)
const GOLD = "#e9c46a";
const AOA_CSS = `
  #panel .aoa-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .aoa-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#bfeee6;
    background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.3);border-radius:7px;
    padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .aoa-chip:hover{border-color:${TEAL};color:#fff}
  #panel .aoa-chip.on{background:${TEAL};color:#04201c;border-color:${TEAL};font-weight:700}
  #panel .aoa-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .aoa-canvas{width:100%;height:190px;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:8px;display:block;margin:.5rem 0}
  #panel .aoa-legend{display:flex;flex-wrap:wrap;gap:.4rem .9rem;margin:.3rem 0}
  #panel .aoa-leg{display:inline-flex;align-items:center;gap:.35rem;font:500 .68rem/1 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .aoa-swatch{width:.8rem;height:.8rem;border-radius:2px;display:inline-block}
  #panel .aoa-mono{font:.76rem/1.6 var(--mono,ui-monospace,monospace);color:#bcd;background:#0a0f18;
    border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.6rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .aoa-mono .hot{color:${TEAL};font-weight:700}
  #panel .aoa-mono .g{color:${GOLD};font-weight:700}
  #panel .aoa-mono .r{color:#e76f51;font-weight:700}
  #panel .aoa-bars{display:flex;flex-direction:column;gap:.4rem;margin:.5rem 0}
  #panel .aoa-barrow{display:flex;align-items:center;gap:.5rem}
  #panel .aoa-barrow .lbl{width:6.5rem;font:500 .68rem/1.2 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .aoa-bartrack{flex:1;height:1.2rem;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:6px;overflow:hidden}
  #panel .aoa-barfill{height:100%;border-radius:5px;transition:width .5s ease}
  #panel .aoa-barrow .num{width:4.5rem;text-align:right;font:600 .68rem/1 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .aoa-tree{display:flex;flex-direction:column;align-items:center;gap:.3rem;margin:.5rem 0}
  #panel .aoa-trow{display:flex;gap:.3rem;justify-content:center}
  #panel .aoa-tnode{width:1.4rem;height:1.4rem;border-radius:4px;background:#141c2b;border:1px solid rgba(255,255,255,.12)}
  #panel .aoa-tnode.on{background:rgba(45,212,191,.3);border-color:${TEAL}}
  #panel .aoa-tnode.leaf{background:rgba(233,196,106,.3);border-color:${GOLD}}
  #panel .aoa-cases{display:flex;gap:.35rem;margin:.4rem 0;flex-wrap:wrap}
  #panel .aoa-case{flex:1;min-width:5rem;padding:.4rem .5rem;border-radius:7px;border:1px solid rgba(255,255,255,.12);
    background:#0a0f18;font:500 .64rem/1.3 var(--mono,ui-monospace,monospace);color:#8aa;text-align:center}
  #panel .aoa-case.on{border-color:${TEAL};background:rgba(45,212,191,.12);color:#eafff8}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("analysis-css")) {
    const st = document.createElement("style");
    st.id = "analysis-css";
    st.textContent = AOA_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function raceLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · GROWTH RATES · THE CURRENCY OF SPEED</div>
    <h3>Watch the growth curves diverge</h3>
    <p class="it-lab-intro">Big-O is about how cost grows, not seconds. Plot the classic growth classes together and slide the input size: constants and low-order terms vanish, and the ordering — 1 ≺ log n ≺ n ≺ n log n ≺ n² ≺ 2ⁿ — becomes visceral. An O(n log n) sort doesn't just beat O(n²); the gap explodes.</p>
    <div class="it-control">
      <label for="aoa-race-n"><span>input size n</span><output id="aoa-race-nv">32</output></label>
      <input id="aoa-race-n" type="range" min="2" max="64" step="1" value="32">
    </div>
    <canvas class="aoa-canvas" id="aoa-race-canvas" width="520" height="190"></canvas>
    <div class="aoa-legend" id="aoa-race-legend"></div>
    <div class="aoa-mono" id="aoa-race-out"></div>
    <p class="it-caveat">This one picture is why we ignore constant factors: for large n the growth class swamps everything else. It's the reason algorithm choice matters more than micro-optimization once inputs get big.</p>
  </section>`;
}

function counterLabHTML() {
  const chips = Object.keys(ALGOS).map((k, i) =>
    `<button class="aoa-chip${i===0?" on":""}" data-algo="${k}">${ALGOS[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · KNUTH'S METHOD · COUNT THE OPERATIONS</div>
    <h3>Measure complexity, don't assert it</h3>
    <p class="it-lab-intro">Knuth's discipline: count exactly what an algorithm does. Pick a real algorithm; this lab runs it at growing input sizes and counts its actual basic operations — comparisons and probes. Watch the measured curve match its Big-O without anyone claiming it in advance.</p>
    <div class="aoa-chips" id="aoa-count-algo">${chips}</div>
    <p class="aoa-desc" id="aoa-count-desc"></p>
    <div class="aoa-bars" id="aoa-count-bars"></div>
    <div class="aoa-mono" id="aoa-count-out"></div>
    <p class="it-caveat">The numbers are real — the algorithms genuinely run. When bubble sort's count roughly quadruples as n doubles, that's Θ(n²) measured, not memorized. When merge sort barely more than doubles, that's Θ(n log n) in the wild.</p>
  </section>`;
}

function masterLabHTML() {
  const chips = Object.keys(RECURRENCES).map((k, i) =>
    `<button class="aoa-chip${i===0?" on":""}" data-rec="${k}">${RECURRENCES[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · DIVIDE & CONQUER · THE MASTER THEOREM</div>
    <h3>Solve a recurrence on sight</h3>
    <p class="it-lab-intro">A divide-and-conquer algorithm costs T(n) = a·T(n/b) + Θ(n^d): split into a pieces of size n/b, spend n^d combining. The master theorem compares the "leaf work" n^(log_b a) against the combine work n^d and reads off the answer. Dial the knobs or pick a famous recurrence.</p>
    <div class="aoa-chips" id="aoa-master-rec">${chips}</div>
    <div class="it-control"><label for="aoa-master-a"><span>a (subproblems)</span><output id="aoa-master-av">2</output></label><input id="aoa-master-a" type="range" min="1" max="8" step="1" value="2"></div>
    <div class="it-control"><label for="aoa-master-b"><span>b (shrink factor)</span><output id="aoa-master-bv">2</output></label><input id="aoa-master-b" type="range" min="2" max="4" step="1" value="2"></div>
    <div class="it-control"><label for="aoa-master-d"><span>d (combine exponent, n^d)</span><output id="aoa-master-dv">1</output></label><input id="aoa-master-d" type="range" min="0" max="3" step="1" value="1"></div>
    <div class="aoa-cases" id="aoa-master-cases">
      <div class="aoa-case" data-c="1">case 1<br>leaves win</div>
      <div class="aoa-case" data-c="2">case 2<br>balanced</div>
      <div class="aoa-case" data-c="3">case 3<br>combine wins</div>
    </div>
    <div class="aoa-mono" id="aoa-master-out"></div>
    <p class="it-caveat">One theorem prices merge sort, binary search, Karatsuba, and Strassen. It's the single most-used tool in the field for pricing a recursive algorithm — and it made the great "beat n²/n³" breakthroughs legible.</p>
  </section>`;
}

function lowerBoundLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · LOWER BOUNDS · PROVING THE WALL</div>
    <h3>Why no comparison sort beats n log n</h3>
    <p class="it-lab-intro">A comparison sort is a binary decision tree — each comparison branches left or right, and every one of the n! possible input orderings needs its own leaf. A binary tree with n! leaves must be at least log₂(n!) ≈ n log n tall, so that many comparisons are unavoidable. Slide n and watch the bound bite.</p>
    <div class="it-control">
      <label for="aoa-lb-n"><span>elements n</span><output id="aoa-lb-nv">4</output></label>
      <input id="aoa-lb-n" type="range" min="2" max="7" step="1" value="4">
    </div>
    <div class="aoa-tree" id="aoa-lb-tree"></div>
    <div class="aoa-mono" id="aoa-lb-out"></div>
    <p class="it-caveat">Merge sort's O(n log n) upper bound MEETS this Ω(n log n) lower bound — so comparison sorting is a solved problem, forever. Counting/radix sort escape only by refusing to compare, sidestepping the exact assumption this proof needs.</p>
  </section>`;
}

function omegaLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 5 · THE OPEN FRONTIER · MATRIX MULTIPLY ω</div>
    <h3>The most consequential unknown exponent</h3>
    <p class="it-lab-intro">Multiplying two n×n matrices costs O(n^ω). The naive way gives ω=3; Strassen (1969) broke it to 2.807; the record is now below 2.372 — and everyone believes ω=2, but nobody can prove it. Since every neural-network layer is a matrix multiply, ω is literally the asymptotic price of deep learning. Compare the milestones.</p>
    <div class="aoa-bars" id="aoa-omega-bars"></div>
    <div class="it-control">
      <label for="aoa-omega-n"><span>matrix size n</span><output id="aoa-omega-nv">1024</output></label>
      <input id="aoa-omega-n" type="range" min="64" max="8192" step="64" value="1024">
    </div>
    <div class="aoa-mono" id="aoa-omega-out"></div>
    <p class="it-caveat">This is the quietest, deepest node on the whole map: an open Algorithms problem that sets Hardware's throughput and Machine Learning's cost. In 2022 DeepMind's AlphaTensor used AI to find new matrix-multiply algorithms — AI speeding up the operation that powers AI.</p>
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

// ---- Lab 1: growth race (canvas) ----
function raceDraw() {
  const n = +$("aoa-race-n").value;
  $("aoa-race-nv").textContent = n;
  const cv = $("aoa-race-canvas");
  const show = ["log","linear","nlogn","quad","exp"];
  // legend
  $("aoa-race-legend").innerHTML = show.map(k =>
    `<span class="aoa-leg"><span class="aoa-swatch" style="background:${GROWTH[k].color}"></span>${GROWTH[k].name}</span>`).join("");
  if (cv && cv.getContext) {
    const ctx = cv.getContext("2d"), W = cv.width, H = cv.height, pad = 8, y0 = H - 16, x0 = 8;
    ctx.clearRect(0, 0, W, H);
    // max value across shown funcs at n for scaling (cap exp)
    let maxV = 0;
    show.forEach(k => { for (let x = 1; x <= n; x++) maxV = Math.max(maxV, GROWTH[k].f(x)); });
    const X = x => x0 + (x / n) * (W - x0 - 8);
    const Y = v => y0 - (Math.min(v, maxV) / maxV) * (y0 - 10);
    ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.beginPath(); ctx.moveTo(x0, 10); ctx.lineTo(x0, y0); ctx.lineTo(W - 8, y0); ctx.stroke();
    show.forEach(k => {
      ctx.strokeStyle = GROWTH[k].color; ctx.lineWidth = 2; ctx.beginPath();
      let first = true;
      for (let x = 1; x <= n; x++) { const px = X(x), py = Y(GROWTH[k].f(x)); if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py); }
      ctx.stroke();
    });
  }
  const rows = ["log","linear","nlogn","quad","exp"].map(k => {
    const v = GROWTH[k].f(n);
    return GROWTH[k].name.padEnd(11) + " at n=" + n + " → " + (v >= 1e6 ? v.toExponential(1) : Math.round(v));
  }).join("\n");
  $("aoa-race-out").innerHTML = rows + "\n\nat n=" + n + ", O(2ⁿ) is <span class='r'>"
    + (GROWTH.exp.f(n) / Math.max(1, GROWTH.quad.f(n)) >= 1 ? Math.round(GROWTH.exp.f(n) / GROWTH.quad.f(n)).toLocaleString() : "…")
    + "×</span> bigger than O(n²).";
}

// ---- Lab 2: operation counter ----
const CNT = { key: "linsearch" };
function counterDraw() {
  const A = ALGOS[CNT.key];
  $("aoa-count-desc").textContent = A.name + " — theoretical cost " + A.theory + ". Measured basic operations:";
  const sizes = [8, 16, 32, 64, 128, 256];
  const results = sizes.map(n => ({ n, ops: A.run(n) }));
  const maxOps = Math.max.apply(null, results.map(r => r.ops)) || 1;
  $("aoa-count-bars").innerHTML = results.map(r =>
    `<div class="aoa-barrow"><span class="lbl">n = ${r.n}</span><div class="aoa-bartrack"><div class="aoa-barfill" style="width:${100*r.ops/maxOps}%;background:${TEAL}"></div></div><span class="num">${r.ops.toLocaleString()}</span></div>`).join("");
  // ratio when n doubles
  const ratios = [];
  for (let i = 1; i < results.length; i++) ratios.push((results[i].ops / Math.max(1, results[i-1].ops)));
  const avgR = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  let read;
  if (avgR < 1.4) read = "roughly constant/log growth";
  else if (avgR < 2.6) read = "roughly linear-ish (n or n log n)";
  else if (avgR < 5) read = "roughly quadratic (×~4 per doubling)";
  else read = "super-quadratic";
  $("aoa-count-out").innerHTML = "when n doubles, ops multiply by ≈ <span class='hot'>" + avgR.toFixed(1)
    + "×</span> → " + read + ".\nthat matches " + A.theory + ".";
}

// ---- Lab 3: master theorem ----
function masterDraw() {
  const a = +$("aoa-master-a").value, b = +$("aoa-master-b").value, d = +$("aoa-master-d").value;
  $("aoa-master-av").textContent = a; $("aoa-master-bv").textContent = b; $("aoa-master-dv").textContent = d;
  const r = masterTheorem(a, b, d);
  document.querySelectorAll("#aoa-master-cases .aoa-case").forEach(el => el.classList.toggle("on", +el.dataset.c === r.cas));
  $("aoa-master-out").innerHTML =
    "T(n) = " + a + "·T(n/" + b + ") + Θ(n^" + d + ")\n"
    + "leaf work n^(log_" + b + " " + a + ") = n^<span class='g'>" + fmt(r.logba) + "</span>   vs   combine n^<span class='hot'>" + d + "</span>\n"
    + "→ case " + r.cas + ":  T(n) = <span class='hot'>" + r.result + "</span>";
}
function masterSetRec(k) {
  const R = RECURRENCES[k];
  $("aoa-master-a").value = R.a; $("aoa-master-b").value = R.b; $("aoa-master-d").value = R.d;
  masterDraw();
  $("aoa-master-out").innerHTML += "\n\n<span class='g'>" + R.name + "</span>: " + R.note;
}

// ---- Lab 4: lower bound tree ----
function lbDraw() {
  const n = +$("aoa-lb-n").value;
  $("aoa-lb-nv").textContent = n;
  const r = lowerBound(n);
  // draw a schematic binary tree of height = treeHeight (cap depth shown at 5)
  const depth = Math.min(r.treeHeight, 5);
  let html = "";
  for (let lvl = 0; lvl <= depth; lvl++) {
    const count = Math.min(Math.pow(2, lvl), 16);
    let row = "";
    for (let i = 0; i < count; i++) row += `<div class="aoa-tnode ${lvl===depth?"leaf":"on"}"></div>`;
    html += `<div class="aoa-trow">${row}</div>`;
  }
  $("aoa-lb-tree").innerHTML = html;
  $("aoa-lb-out").innerHTML =
    "n = " + n + " → " + r.perms.toLocaleString() + " possible orderings (n! leaves needed)\n"
    + "tree height ≥ ⌈log₂(" + r.perms.toLocaleString() + ")⌉ = <span class='hot'>" + r.treeHeight + "</span> comparisons (worst case)\n"
    + "n·log₂(n) ≈ <span class='g'>" + r.nlogn.toFixed(1) + "</span> — the Ω(n log n) floor."
    + (depth < r.treeHeight ? "\n(tree shown truncated at depth 5)" : "");
}

// ---- Lab 5: matrix multiply omega ----
const OMEGA = [
  { name: "naive (n³)", w: 3.0, year: "—" },
  { name: "Strassen 1969", w: 2.807, year: "1969" },
  { name: "Coppersmith–Winograd 1990", w: 2.376, year: "1990" },
  { name: "record 2024", w: 2.3715, year: "2024" },
  { name: "believed optimal", w: 2.0, year: "?" }
];
function omegaDraw() {
  const n = +$("aoa-omega-n").value;
  $("aoa-omega-nv").textContent = n.toLocaleString();
  const costs = OMEGA.map(o => ({ o, cost: Math.pow(n, o.w) }));
  const maxC = Math.max.apply(null, costs.map(c => c.cost));
  $("aoa-omega-bars").innerHTML = costs.map(c =>
    `<div class="aoa-barrow"><span class="lbl">${c.o.name}</span><div class="aoa-bartrack"><div class="aoa-barfill" style="width:${100*c.cost/maxC}%;background:${c.o.w<=2.01?TEAL:(c.o.w>=3?"#e76f51":GOLD)}"></div></div><span class="num">n^${c.o.w}</span></div>`).join("");
  const naive = Math.pow(n, 3), best = Math.pow(n, 2.3715), ideal = Math.pow(n, 2);
  $("aoa-omega-out").innerHTML =
    "at n = " + n.toLocaleString() + ":\nnaive n³ = " + naive.toExponential(2) + " ops\n"
    + "record n^2.372 = <span class='g'>" + best.toExponential(2) + "</span> ops  (" + (naive/best).toFixed(1) + "× fewer)\n"
    + "ideal n² = <span class='hot'>" + ideal.toExponential(2) + "</span> ops — if only someone could prove ω = 2.";
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
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · COUNTING COST BEFORE YOU RUN · ABOUT 45 MIN</div>
    <p class="it-hook">Wall-clock seconds depend on your machine, your language, your mood. The honest measure of an algorithm is how its cost grows as the input grows — and one man, Donald Knuth, turned that idea into a rigorous science and gave the whole field its grammar.</p>
    <p class="it-intro">This is the accounting system of computer science: Big-O and its companions Ω and Θ, the growth classes from log n to 2ⁿ, the master theorem that prices divide-and-conquer, the lower bounds that prove no one can do better, and — at the far end — the single open exponent ω of matrix multiplication that sets the price of deep learning itself. Five labs below: watch the growth curves diverge, measure real algorithms' operation counts, solve recurrences with the master theorem, build the decision tree that proves sorting needs n log n comparisons, and stare into the open frontier of matrix-multiply ω.</p>
    <div class="it-timeline" aria-label="Analysis of algorithms timeline">
      <div class="it-moment"><b>1894</b><span>Bachmann's O</span></div>
      <div class="it-moment"><b>1968</b><span>Knuth's TAOCP</span></div>
      <div class="it-moment"><b>1969</b><span>Strassen breaks n³</span></div>
      <div class="it-moment"><b>1976</b><span>O, Ω, Θ fixed</span></div>
      <div class="it-moment"><b>1979</b><span>BLAS</span></div>
    </div>

    ${raceLabHTML()}
    ${counterLabHTML()}
    ${masterLabHTML()}
    ${lowerBoundLabHTML()}
    ${omegaLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>In the growth race, set n = 20, then 40, then 64. Watch O(2ⁿ) go from invisible to off-the-chart while O(n log n) barely lifts. That gap is why exponential algorithms are "impossible."</li>
      <li>In the counter, run bubble sort and check the doubling ratio (~4×). Then run merge sort (~2×). You just measured the difference between Θ(n²) and Θ(n log n).</li>
      <li>In the master theorem, load Strassen (a=7, b=2, d=2) and read the exponent 2.807. Now bump a to 8 (naive matmul) and watch it jump to n³ — one multiply is the whole difference.</li>
      <li>In the lower-bound lab, set n=5 (120 orderings) and read the required height. Convince yourself merge sort's O(n log n) exactly meets this floor — a solved problem.</li>
      <li>In the ω lab, set n = 8192 and compare naive n³ to the record. Then remember every neural-net layer is one of these — ω is the price of intelligence.</li>
      <li>Trace the arc: this field starts in 1894 number theory and ends at the cost of deep learning. Analysis is the unit every other continent is measured in.</li>
    </ol></div>

    <h3 class="it-section-title">Landmark papers, the masterwork &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1
  raceDraw();
  $("aoa-race-n").addEventListener("input", raceDraw);

  // Lab 2
  counterDraw();
  module.querySelectorAll("#aoa-count-algo [data-algo]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#aoa-count-algo [data-algo]").forEach(x => x.classList.toggle("on", x === b));
      CNT.key = b.dataset.algo; counterDraw();
    }));

  // Lab 3
  masterDraw();
  module.querySelectorAll("#aoa-master-rec [data-rec]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#aoa-master-rec [data-rec]").forEach(x => x.classList.toggle("on", x === b));
      masterSetRec(b.dataset.rec);
    }));
  ["aoa-master-a", "aoa-master-b", "aoa-master-d"].forEach(id => $(id).addEventListener("input", () => {
    module.querySelectorAll("#aoa-master-rec [data-rec]").forEach(x => x.classList.remove("on"));
    masterDraw();
  }));

  // Lab 4
  lbDraw();
  $("aoa-lb-n").addEventListener("input", lbDraw);

  // Lab 5
  omegaDraw();
  $("aoa-omega-n").addEventListener("input", omegaDraw);
}

window.openAnalysisExperience = buildExperience;

// test hook (parity with other guides)
window.__aoaTest = { GROWTH, ALGOS, countLinearSearch, countBinarySearch, countBubbleSort, countMergeSort,
  masterTheorem, RECURRENCES, lowerBound, log2Fact, factorial };
})();
