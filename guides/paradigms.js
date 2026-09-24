// DESIGN PARADIGMS — the recurring shapes of good algorithms: split and merge,
// remember sub-answers, expand the cheapest frontier, or flip coins. Four real
// labs: merge sort vs insertion sort (divide & conquer), an edit-distance table
// with traceback (dynamic programming), Dijkstra vs A* on a grid you can draw
// walls on, and Monte Carlo estimation of π with its 1/√n error.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"✂️", title:"Divide and conquer — split, solve, merge",
    who:"John von Neumann (merge sort) 1945 · Cooley & Tukey (FFT) 1965 · Gauss c. 1805",
    lead:"Break a problem into smaller copies of itself, solve those, and combine the answers. When the combining is cheap, the whole thing becomes dramatically faster.",
    formula:"T(n) = 2·T(n/2) + O(n)   ⇒   T(n) = O(n log n)",
    what:`Merge sort splits a list in half, sorts each half the same way, and merges the two sorted halves in one
      pass. Because the list is halved log₂ n times and each level does n work, the total is n log n, instead of
      the n² of simple methods. Race them in Lab 1.`,
    how:`The Master Theorem (see the Analysis of Algorithms guide) gives the running time of any divide-and-conquer
      recurrence. Quicksort, binary search, Karatsuba multiplication and Strassen's matrix multiplication are all
      the same idea with different split and merge steps.`,
    story:`Von Neumann wrote merge sort in 1945 for the EDVAC, one of the first programs for a stored-program
      computer. The Fast Fourier Transform (1965) turned an n² computation into n log n and made digital signal
      processing possible; historians later found Gauss had used the trick around 1805, unpublished.`,
    today:`The FFT runs in every phone, audio codec, MRI scanner and radio telescope. Divide and conquer is also
      how work is split across thousands of GPUs and machines.` },
  { icon:"🧠", title:"Dynamic programming — never solve the same subproblem twice",
    who:"Richard Bellman · RAND · 1953",
    lead:"Many problems contain the same smaller problems over and over. Solve each once, store the answer in a table, and build up to the full solution.",
    formula:"edit(i, j) = min( edit(i−1, j) + 1,  edit(i, j−1) + 1,  edit(i−1, j−1) + [aᵢ ≠ bⱼ] )",
    what:`Edit distance (how many insertions, deletions and substitutions turn one word into another) can be
      computed by filling a table where each cell depends only on three neighbours. A naive recursion would
      take exponential time; the table takes length × length. Fill it and trace the alignment in Lab 2.`,
    how:`The recipe: define the answer in terms of answers to smaller problems (optimal substructure), notice
      those smaller problems overlap, and store them. Shortest paths, sequence alignment, the knapsack problem
      and parsing are all solved this way.`,
    story:`Bellman said he chose the name "dynamic programming" because it sounded impressive and could not be
      used in a negative sense, which protected the work from a research-averse Secretary of Defense. His
      principle of optimality became the Bellman equation of reinforcement learning.`,
    today:`DNA sequence alignment (Needleman–Wunsch, Smith–Waterman), spell checkers, diff tools and speech
      recognition (the Viterbi algorithm) all run dynamic programs.` },
  { icon:"🧭", title:"Greedy search — Dijkstra and A*",
    who:"Edsger Dijkstra 1956 (published 1959) · Hart, Nilsson & Raphael (A*) 1968",
    lead:"To find a shortest path, always expand the closest unexplored place next. Add a good guess of the remaining distance, and you can ignore most of the map.",
    formula:"Dijkstra: expand min g(n)      A*: expand min g(n) + h(n),   h ≤ true remaining cost  ⇒  still optimal",
    what:`Dijkstra's algorithm grows a frontier outwards from the start in order of distance, like a ripple, and is
      guaranteed to find the shortest path. A* adds a heuristic estimate h(n) of the distance still to go, so
      the search leans toward the goal. Draw walls and compare them in Lab 3.`,
    how:`Both use a priority queue (a heap; see the Data Structures guide) to pick the next node. As long as the
      heuristic never overestimates, A* still finds the shortest path while exploring far fewer nodes.`,
    story:`Dijkstra designed his algorithm in about twenty minutes at a café in Amsterdam, without pencil and
      paper, to demonstrate a new computer. A* was invented for Shakey, the first mobile robot that reasoned
      about its own actions, at SRI in 1968.`,
    today:`Route planners, network routing protocols (OSPF), game AI and robot navigation all use Dijkstra or A*.
      AlphaGo's tree search is a distant cousin: expand what looks most promising first.` },
  { icon:"🎲", title:"Monte Carlo — randomness as a solver",
    who:"Stanislaw Ulam & John von Neumann · Los Alamos · 1946",
    lead:"When a problem is too complicated to solve exactly, simulate it many times at random and average. The error shrinks like one over the square root of the number of samples, whatever the dimension.",
    formula:"estimate = (1/n) Σ f(Xᵢ),   error ∝ 1/√n      (e.g. π ≈ 4 × fraction of random darts inside the quarter circle)",
    what:`Monte Carlo methods answer questions by random sampling: throw darts to estimate π, simulate neutrons to
      design a reactor, sample paths to price an option. Lab 4 throws darts and plots how the error falls.`,
    how:`The √n law is both the strength and the weakness: halving the error needs four times the samples, but the
      rate doesn't depend on the number of dimensions, which is why Monte Carlo wins for high-dimensional
      integrals where grids are hopeless.`,
    story:`Ulam had the idea while playing solitaire during an illness in 1946, wondering about the odds of
      winning. Von Neumann programmed it on ENIAC for neutron diffusion; Nicholas Metropolis named it after the
      Monaco casino. Metropolis's 1953 sampling algorithm is the ancestor of MCMC (see Statistics).`,
    today:`Monte Carlo tree search (AlphaGo), Monte Carlo dropout and MCMC in Bayesian inference, particle
      physics, finance and rendering in films all rely on it. Cosmologists use it to explore parameter spaces.` },
  { icon:"🧩", title:"Choosing a paradigm",
    who:"the working algorithm designer's first question",
    lead:"Faced with a new problem, experienced designers ask a short list of questions. The answers point to a paradigm.",
    formula:"splits into independent halves → divide & conquer ·  overlapping subproblems → DP ·  a safe local choice → greedy ·  too hard exactly → randomise",
    what:`Divide and conquer fits when subproblems are independent; dynamic programming when they overlap; greedy
      when a local best choice is provably safe; randomisation when exact answers are too expensive or an
      adversary could exploit a fixed strategy.`,
    how:`Many great algorithms combine them: quicksort is divide and conquer with random pivots; A* is greedy
      search with a heuristic; Viterbi is dynamic programming over a probabilistic model.`,
    story:`These four ideas were largely in place by the 1960s. Much of the later history of algorithms is about
      proving what they can't do (the Complexity Theory guide) and adapting them to new hardware.`,
    today:`Machine learning adds a fifth answer: when the rules are unknown, learn them from data. Even then, the
      training loop runs on these four paradigms (gradient descent is greedy; backprop is dynamic programming).` }
];

const SOURCES = [
  { type:"THE FFT · 1965", title:"Cooley & Tukey — An Algorithm for the Machine Calculation of Complex Fourier Series", note:"Divide and conquer at its most influential.", url:"https://doi.org/10.1090/S0025-5718-1965-0178586-1" },
  { type:"GAUSS AND THE FFT · 1984", title:"Heideman, Johnson & Burrus — Gauss and the History of the Fast Fourier Transform", note:"The discovery that Gauss had it first.", url:"https://doi.org/10.1109/MASSP.1984.1162257" },
  { type:"DYNAMIC PROGRAMMING · 1957", title:"Richard Bellman — Dynamic Programming", note:"The book that named and systematised the method.", url:"https://press.princeton.edu/books/paperback/9780691146683/dynamic-programming" },
  { type:"EDIT DISTANCE · 1974", title:"Wagner & Fischer — The String-to-String Correction Problem", note:"The dynamic program in Lab 2.", url:"https://doi.org/10.1145/321796.321811" },
  { type:"SHORTEST PATHS · 1959", title:"Edsger Dijkstra — A Note on Two Problems in Connexion with Graphs", note:"Three pages that route the world.", url:"https://doi.org/10.1007/BF01386390" },
  { type:"A* · 1968", title:"Hart, Nilsson & Raphael — A Formal Basis for the Heuristic Determination of Minimum Cost Paths", note:"Heuristic search, invented for the robot Shakey.", url:"https://doi.org/10.1109/TSSC.1968.300136" },
  { type:"MONTE CARLO · 1949", title:"Metropolis & Ulam — The Monte Carlo Method", note:"Journal of the American Statistical Association. The method's public debut.", url:"https://doi.org/10.1080/01621459.1949.10483310" },
  { type:"THE TEXTBOOK", title:"Cormen, Leiserson, Rivest & Stein — Introduction to Algorithms", note:"Every paradigm here, with proofs.", url:"https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
];

/* ------------------------------------------------------ LAB 1: merge sort */
function mergeSortCount(a) { let c = 0; const ms = x => { if (x.length < 2) return x; const m = x.length >> 1, L = ms(x.slice(0, m)), R = ms(x.slice(m)), o = []; let i = 0, j = 0; while (i < L.length && j < R.length) { c++; o.push(L[i] <= R[j] ? L[i++] : R[j++]); } return o.concat(L.slice(i), R.slice(j)); }; const s = ms(a); return { s, c }; }
function insertionCount(a) { const x = a.slice(); let c = 0; for (let i = 1; i < x.length; i++) { const v = x[i]; let j = i - 1; while (j >= 0) { c++; if (x[j] > v) { x[j + 1] = x[j]; j--; } else break; } x[j + 1] = v; } return { s:x, c }; }
const sortLab = {
  kicker:"DIVIDE & CONQUER", title:"Merge sort versus insertion sort",
  intro:`Both sort the same random list; the lab counts the comparisons each makes. Insertion sort (the way many people sort playing cards) makes about n²/4. Merge sort (split in half, sort each half, merge) makes about n log₂ n. Watch merge sort's levels of merging below, then slide n up.`,
  html:`<div class="it-control"><label><span>list length n</span><output data-o="n">16</output></label><input type="range" data-i="n" min="4" max="4096" step="4" value="16"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`For n = 1,000,000 the difference is about 250 billion comparisons versus about 20 million. That gap is why the choice of algorithm usually matters more than the speed of the computer.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const n = +q('[data-i="n"]').value; q('[data-o="n"]').textContent = n; const r = rng(n * 7), a = Array.from({ length:n }, () => (r() * 1000) | 0);
      const m = mergeSortCount(a), ins = insertionCount(a);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 150); ctx.clearRect(0, 0, W, H);
      const show = a.slice(0, 16), lv = []; let cur = show.map(v => [v]); lv.push(cur);
      while (cur.length > 1) { const nx = []; for (let i = 0; i < cur.length; i += 2) nx.push(cur[i + 1] ? cur[i].concat(cur[i + 1]).sort((x, y) => x - y) : cur[i]); lv.push(nx); cur = nx; }
      const rowH = (H - 10) / lv.length, cw = (W - 20) / show.length;
      lv.forEach((row, d) => { let x = 10; row.forEach(g => { ctx.fillStyle = "rgba(245,196,81,.08)"; ctx.fillRect(x + 1, 5 + d * rowH, g.length * cw - 2, rowH - 4); g.forEach((v, k) => { const h = v / 1000 * (rowH - 8); ctx.fillStyle = d === lv.length - 1 ? C.teal : C.gold; ctx.fillRect(x + k * cw + 2, 5 + d * rowH + (rowH - 4 - h), cw - 4, h); }); x += g.length * cw; }); });
      q('[data-role="out"]').innerHTML = `${n < show.length ? "" : "(the picture shows the first 16 items, merged level by level)\n"}insertion sort: <span class="r">${ins.c.toLocaleString()}</span> comparisons   <span class="d">(≈ n²/4 = ${Math.round(n * n / 4).toLocaleString()})</span>\nmerge sort:     <span class="t">${m.c.toLocaleString()}</span> comparisons   <span class="d">(≈ n log₂ n = ${Math.round(n * Math.log2(n)).toLocaleString()})</span>\nmerge sort needs <span class="g">${(ins.c / Math.max(1, m.c)).toFixed(1)}×</span> fewer`;
    }
    q('[data-i="n"]').addEventListener("input", draw); draw();
  }
};

/* ---------------------------------------------------- LAB 2: edit distance */
function editDP(a, b) {
  const D = Array.from({ length:a.length + 1 }, (_, i) => Array.from({ length:b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const path = new Set(), ops = []; let i = a.length, j = b.length; path.add(i + "," + j);
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { ops.unshift(a[i - 1] === b[j - 1] ? `keep ${a[i - 1]}` : `swap ${a[i - 1]}→${b[j - 1]}`); i--; j--; }
    else if (i > 0 && D[i][j] === D[i - 1][j] + 1) { ops.unshift(`delete ${a[i - 1]}`); i--; } else { ops.unshift(`insert ${b[j - 1]}`); j--; }
    path.add(i + "," + j);
  }
  return { D, path, ops };
}
const dpLab = {
  kicker:"DYNAMIC PROGRAMMING", title:"Fill the edit-distance table and trace the answer",
  intro:`How many single-letter edits turn one word into another? Each cell holds the answer for the first i letters of the top word and the first j of the side word, computed from three neighbours. The highlighted path traces back the cheapest sequence of edits. Try the presets or your own words.`,
  html:`<div class="gk-chips" data-role="pre"><button class="gk-chip on" data-a="kitten" data-b="sitting">kitten → sitting</button><button class="gk-chip" data-a="intention" data-b="execution">intention → execution</button><button class="gk-chip" data-a="GATTACA" data-b="GCATGCU">DNA: GATTACA → GCATGCU</button></div>
    <div class="gk-row"><input class="gk-input" data-role="a" value="kitten" spellcheck="false"><input class="gk-input" data-role="b" value="sitting" spellcheck="false"></div>
    <div style="overflow-x:auto"><table class="gk-table" data-role="tab"></table></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The table has about m × n cells, each computed once. A plain recursion without the table would recompute the same cells exponentially many times: that saving is the whole of dynamic programming.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const a = q('[data-role="a"]').value.slice(0, 12), b = q('[data-role="b"]').value.slice(0, 12), { D, path, ops } = editDP(a, b);
      q('[data-role="tab"]').innerHTML = `<tr><th></th><th>ε</th>${[...a].map(c => `<th>${c}</th>`).join("")}</tr>` +
        Array.from({ length:b.length + 1 }, (_, j) => `<tr><th>${j ? b[j - 1] : "ε"}</th>` + Array.from({ length:a.length + 1 }, (_, i) => `<td class="${path.has(i + "," + j) ? "hl" : ""}">${D[i][j]}</td>`).join("") + "</tr>").join("");
      q('[data-role="out"]').innerHTML = `edit distance = <span class="g">${D[a.length][b.length]}</span>\n${ops.map(o => o.startsWith("keep") ? `<span class="d">${o}</span>` : `<span class="t">${o}</span>`).join(" · ")}\n<span class="d">${(a.length + 1) * (b.length + 1)} cells computed once each</span>`;
    }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(bt => bt.addEventListener("click", () => { q('[data-role="a"]').value = bt.dataset.a; q('[data-role="b"]').value = bt.dataset.b; root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.toggle("on", x === bt)); draw(); }));
    root.querySelectorAll("input.gk-input").forEach(x => x.addEventListener("input", draw)); draw();
  }
};

/* ----------------------------------------------------- LAB 3: Dijkstra vs A* */
const GR = 14, GC = 22;
const pathLab = {
  kicker:"DIJKSTRA & A*", title:"Find the shortest path, and count what each search explored",
  intro:`Click or drag on the grid to draw walls. Dijkstra expands squares in order of distance from the start (a ripple in every direction). A* adds the straight-line distance still to go, so it leans toward the goal. Both find a shortest path; compare how many squares each explored.`,
  html:`<div class="gk-chips" data-role="alg"><button class="gk-chip on" data-v="dij">Dijkstra</button><button class="gk-chip" data-v="astar">A*</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ search</button><button class="gk-ghost" data-a="clear">clear walls</button><button class="gk-ghost" data-a="maze">random walls</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`A* is only as good as its heuristic. With h = 0 it becomes Dijkstra; with an overestimating h it becomes faster but can return a path that isn't shortest.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'); let alg = "dij", walls = new Set(), seen = [], path = [], timer = null, drawing = 0; const S = [7, 2], T = [7, 19];
    const k = (r, c) => r * GC + c;
    [[3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10]].forEach(([r, c]) => walls.add(k(r, c)));
    function search() {
      const dist = new Map([[k(...S), 0]]), prev = new Map(), open = [[0, ...S]], done = new Set(); seen = [];
      const h = (r, c) => alg === "astar" ? Math.hypot(r - T[0], c - T[1]) : 0;
      while (open.length) {
        open.sort((a, b) => a[0] - b[0]); const [, r, c] = open.shift(), key = k(r, c); if (done.has(key)) continue; done.add(key); seen.push([r, c]);
        if (r === T[0] && c === T[1]) break;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc, nk = k(nr, nc);
          if (nr < 0 || nr >= GR || nc < 0 || nc >= GC || walls.has(nk)) continue; const nd = dist.get(key) + 1;
          if (nd < (dist.has(nk) ? dist.get(nk) : Infinity)) { dist.set(nk, nd); prev.set(nk, [r, c]); open.push([nd + h(nr, nc), nr, nc]); } }
      }
      path = []; let cur = T; if (prev.has(k(...T))) { while (cur) { path.unshift(cur); cur = prev.get(k(...cur)); } }
      return dist.get(k(...T));
    }
    let geo = null;
    function draw(nShow, msg) {
      const { ctx, w:W, h:H } = canvas(cv, 200); ctx.clearRect(0, 0, W, H); const cs = Math.min(W / GC, H / GR), ox = (W - cs * GC) / 2; geo = { cs, ox };
      for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) { ctx.fillStyle = walls.has(k(r, c)) ? "rgba(154,147,184,.6)" : "rgba(255,255,255,.04)"; ctx.fillRect(ox + c * cs + .5, r * cs + .5, cs - 1, cs - 1); }
      seen.slice(0, nShow).forEach(([r, c]) => { ctx.fillStyle = "rgba(63,208,201,.28)"; ctx.fillRect(ox + c * cs + .5, r * cs + .5, cs - 1, cs - 1); });
      if (nShow >= seen.length) path.forEach(([r, c]) => { ctx.fillStyle = C.gold; ctx.fillRect(ox + c * cs + cs * .25, r * cs + cs * .25, cs * .5, cs * .5); });
      [[S, C.green], [T, C.red]].forEach(([[r, c], col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ox + c * cs + cs / 2, r * cs + cs / 2, cs * .38, 0, 7); ctx.fill(); });
      if (msg) q('[data-role="out"]').innerHTML = msg;
    }
    function run() {
      clearInterval(timer); const d = search(); let n = 0;
      const msg = () => d === undefined ? `<span class="r">no path: the goal is walled off</span>` : `${alg === "dij" ? "Dijkstra" : "A*"}: shortest path length <span class="g">${d}</span> · squares explored <span class="t">${seen.length}</span>`;
      timer = setInterval(() => { n += 6; draw(n, n >= seen.length ? msg() : `exploring… ${Math.min(n, seen.length)}`); if (n >= seen.length) clearInterval(timer); }, 30);
    }
    function paint(e, first) { if (!geo) return; const b = cv.getBoundingClientRect(), c = Math.floor((e.clientX - b.left - geo.ox) / geo.cs), r = Math.floor((e.clientY - b.top) / geo.cs);
      if (r < 0 || r >= GR || c < 0 || c >= GC || (r === S[0] && c === S[1]) || (r === T[0] && c === T[1])) return;
      if (first) drawing = walls.has(k(r, c)) ? -1 : 1; drawing > 0 ? walls.add(k(r, c)) : walls.delete(k(r, c)); seen = []; path = []; draw(0); }
    cv.addEventListener("pointerdown", e => paint(e, true)); cv.addEventListener("pointermove", e => { if (drawing) paint(e, false); }); addEventListener("pointerup", () => { drawing = 0; });
    root.querySelectorAll('[data-role="alg"] .gk-chip').forEach(b => b.addEventListener("click", () => { alg = b.dataset.v; root.querySelectorAll('[data-role="alg"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); run(); }));
    q('[data-a="run"]').addEventListener("click", run);
    q('[data-a="clear"]').addEventListener("click", () => { walls.clear(); seen = []; path = []; draw(0, "walls cleared"); });
    q('[data-a="maze"]').addEventListener("click", () => { const r = rng(Date.now() % 1e6); walls.clear(); for (let i = 0; i < GR * GC * .28; i++) walls.add(k((r() * GR) | 0, (r() * GC) | 0)); walls.delete(k(...S)); walls.delete(k(...T)); seen = []; path = []; draw(0, "random walls"); });
    draw(0, "press search, or draw walls first");
  }
};

/* ------------------------------------------------------ LAB 4: Monte Carlo π */
const mcLab = {
  kicker:"MONTE CARLO", title:"Estimate π by throwing darts",
  intro:`Throw random darts at a square with a quarter circle inside it. The fraction landing inside approaches π/4. The right-hand plot tracks the error as darts accumulate: it falls like 1/√n (the dashed line), so each extra correct digit costs a hundred times more darts.`,
  html:`<canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="d100">throw 100</button><button class="it-send" data-a="d10k">throw 10,000</button><button class="gk-ghost" data-a="reset">reset</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The 1/√n rate doesn't depend on dimension. That's why Monte Carlo beats grid-based integration in high dimensions, and why it underpins Bayesian statistics, particle physics and film rendering.`,
  init(root) {
    const q = s => root.querySelector(s); let inside = 0, n = 0, pts = [], errs = [], r = rng(99);
    function throwN(k) { for (let i = 0; i < k; i++) { const x = r(), y = r(), hit = x * x + y * y <= 1; if (hit) inside++; n++; if (pts.length < 4000) pts.push([x, y, hit]); if (Number.isInteger(Math.log2(n))) errs.push([n, Math.abs(4 * inside / n - Math.PI)]); } draw(); }
    function draw() {
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 190); ctx.clearRect(0, 0, W, H);
      const S = H - 20, ox = 10, oy = 10;
      ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.strokeRect(ox, oy, S, S); ctx.beginPath(); ctx.arc(ox, oy + S, S, -Math.PI / 2, 0); ctx.stroke();
      pts.forEach(([x, y, h]) => { ctx.fillStyle = h ? "rgba(245,196,81,.8)" : "rgba(122,168,255,.7)"; ctx.fillRect(ox + x * S - 1, oy + (1 - y) * S - 1, 2, 2); });
      const px = ox + S + 20, pw = W - px - 8;
      if (errs.length) { const lx = v => px + Math.log10(v) / 6 * pw, ly = e => oy + (1 - (Math.log10(Math.max(e, 1e-5)) + 5) / 5) * S;
        ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(lx(1), ly(1.6)); ctx.lineTo(lx(1e6), ly(1.6 / 1000)); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5; ctx.beginPath(); errs.forEach(([k, e], i) => i ? ctx.lineTo(lx(k), ly(e)) : ctx.moveTo(lx(k), ly(e))); ctx.stroke();
        ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText("|error| vs darts (log–log)", px, oy + 8); }
      const est = n ? 4 * inside / n : 0;
      q('[data-role="out"]').innerHTML = `darts: <span class="g">${n.toLocaleString()}</span>   inside: ${inside.toLocaleString()}\nπ ≈ 4 × ${inside}/${n || 1} = <span class="t">${est.toFixed(6)}</span>   error ${n ? Math.abs(est - Math.PI).toExponential(2) : "–"}   <span class="d">(true π = 3.141593)</span>`;
    }
    q('[data-a="d100"]').addEventListener("click", () => throwN(100)); q('[data-a="d10k"]').addEventListener("click", () => throwN(10000));
    q('[data-a="reset"]').addEventListener("click", () => { inside = 0; n = 0; pts = []; errs = []; draw(); });
    draw();
  }
};

register("paradigms", {
  kicker:"DESIGN PARADIGMS · 1945–NOW · ABOUT 40 MIN",
  hook:"Dijkstra designed the shortest-path algorithm that routes your phone's maps in about twenty minutes at a café, without pencil or paper. The best algorithms often come from recognising which of a few shapes a problem has.",
  intro:`Most great algorithms are variations on four ideas: split the problem and merge the answers, remember answers to subproblems, always take the most promising next step, or use randomness when exact answers are too costly. Four labs below: race merge sort against insertion sort, fill an edit-distance table, watch Dijkstra and A* search a grid you design, and estimate π with random darts.`,
  timeline:[[1945, "merge sort"], [1946, "Monte Carlo"], [1953, "dynamic programming"], [1959, "Dijkstra"], [1965, "FFT"], [1968, "A*"]],
  labs:[sortLab, dpLab, pathLab, mcLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, find the smallest n where merge sort makes fewer comparisons than insertion sort. (For tiny lists, the simple method can win: real libraries switch to insertion sort for short pieces.)",
    "In Lab 2, compute GATTACA → GCATGCU: this is how DNA sequences are aligned. Then try your own name against a friend's.",
    "In Lab 3, draw a U-shaped wall around the goal, open away from the start. A* is lured into the U; Dijkstra isn't fooled, but explores everything.",
    "In Lab 4, throw 100 darts, then 10,000. You gain roughly one extra correct digit for 100 times the effort: the 1/√n law.",
    "Connect Lab 2 to the Deep RL guide: the Bellman equation in Q-learning is the same dynamic-programming idea, applied to decisions."
  ],
  sources:SOURCES
});
})();
