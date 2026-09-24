// NEURAL PREHISTORY — 1943 to 1986: the logic neuron, Hebb's rule, the
// perceptron's rise and fall, and the backprop revival. Four real labs:
// a McCulloch–Pitts threshold unit (with an exhaustive search proving XOR
// impossible), a Hebbian associative memory that repairs corrupted letters,
// Rosenblatt's learning rule in the plane, and backprop done by hand.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

/* ---------------------------------------------------------------- chapters */
const CHAPTERS = [
  { icon:"⚡", title:"1943 — the neuron as a logic gate",
    who:"Warren McCulloch & Walter Pitts · Bulletin of Mathematical Biophysics",
    lead:"A neurophysiologist and a self-taught teenage logician asked what a brain could compute if each neuron simply added its inputs and fired above a threshold.",
    formula:"y = 1  if  Σ wᵢ·xᵢ ≥ θ   else 0      (binary inputs, fixed weights, one threshold)",
    what:`McCulloch and Pitts modelled a neuron as an all-or-nothing switch: it sums its excitatory inputs,
      and fires if the total reaches a threshold (an inhibitory input can veto it). With the right weights a
      single unit is an AND, an OR or a NOT gate, and networks of them can compute any logical function.
      Set the weights yourself in Lab 1.`,
    how:`Because every Boolean function can be built from AND, OR and NOT, a big enough net of these units is
      as powerful as any logic circuit. They also showed that nets with loops can hold state, which makes
      them finite automata. There was no learning at all: the weights were designed, like wiring a circuit.`,
    story:`Pitts was a runaway who had taught himself logic in a Detroit library; at 18 he was living with the
      McCulloch family in Chicago. Their paper was read by John von Neumann, who borrowed its neuron notation
      for the 1945 EDVAC report, and by Stephen Kleene, who turned its looping nets into regular expressions.
      The same paper is the root of both neural networks and automata theory.`,
    today:`Every artificial neuron since is a descendant: a weighted sum followed by a nonlinearity. The hard
      threshold became the sigmoid, then the ReLU, but the shape of the idea (add up evidence, then decide)
      is unchanged inside every layer of a modern network.` },
  { icon:"🔗", title:"1949 — cells that fire together wire together",
    who:"Donald Hebb · The Organization of Behavior",
    lead:"McCulloch and Pitts had fixed wiring. A Canadian psychologist proposed how wiring could change with experience, and so gave neural networks their first learning rule.",
    formula:"Δwᵢⱼ = η · xᵢ · xⱼ      (strengthen a connection when both ends are active together)",
    what:`Hebb suggested that when one neuron repeatedly helps fire another, the connection between them
      grows stronger. The slogan "cells that fire together wire together" came later, but the idea is his.
      Learning becomes a local, unsupervised process: no teacher, just correlations in activity.`,
    how:`Store a pattern by adding the outer product of the pattern with itself to the weight matrix. Later,
      a partial or noisy version of that pattern pulls the network back to the stored one. Lab 2 is exactly
      this: an associative memory built with Hebb's rule, recalling letters from corrupted copies.`,
    story:`Hebb wrote as a psychologist, with no equations. His rule found its mathematical form in the
      associative memories of the 1970s (Amari, Kohonen) and famously in John Hopfield's 1982 network, which
      recast memory recall as a ball rolling downhill on an energy landscape. Hopfield shared the 2024 Nobel
      Prize in Physics for it.`,
    today:`Neuroscience confirmed versions of Hebb's rule (long-term potentiation, spike-timing plasticity).
      In machine learning, Hebbian ideas returned in modern Hopfield networks, whose update rule turns out to
      be mathematically close to transformer attention.` },
  { icon:"👁", title:"1958 — the perceptron and the first AI hype",
    who:"Frank Rosenblatt · Cornell Aeronautical Laboratory",
    lead:"Rosenblatt combined the threshold neuron with a learning rule that provably works, built it in hardware, and told the press it was the embryo of a thinking machine.",
    formula:"if misclassified:  w ← w + η·y·x      (y = ±1 label)     converges if the classes are separable",
    what:`The perceptron adjusts its weights only when it makes a mistake, nudging the decision line toward
      the misclassified point. If a straight line can separate the two classes, the perceptron convergence
      theorem guarantees it will find one in a finite number of steps. Watch it happen in Lab 3.`,
    how:`The Mark I Perceptron was built from 400 photocells, potentiometers for weights, and electric motors
      that turned them during learning. It learned to tell simple shapes apart. Rosenblatt's 1962 book
      explored multilayer perceptrons too, but nobody yet knew how to train the hidden layers.`,
    story:`On 8 July 1958 the New York Times reported that the Navy had revealed "the embryo of an electronic
      computer that it expects will be able to walk, talk, see, write, reproduce itself and be conscious of
      its existence." The hype, the funding and the backlash that followed rehearse, almost word for word,
      every AI boom since.`,
    today:`The perceptron update is still the first learning algorithm most students meet, and its geometric
      picture (a linear boundary, a margin, a mistake-driven update) runs through support vector machines and
      the final layer of every classifier.` },
  { icon:"❄", title:"1969 — Perceptrons, XOR, and the first winter",
    who:"Marvin Minsky & Seymour Papert · MIT Press",
    lead:"A rigorous book proved what single-layer perceptrons can't do. It was correct, and it helped freeze neural network research for more than a decade.",
    formula:"XOR: no w₁, w₂, θ satisfies  0<θ,  w₁≥θ,  w₂≥θ,  w₁+w₂<θ   (add the middle two: w₁+w₂ ≥ 2θ > θ)",
    what:`Minsky and Papert analysed exactly which patterns a single-layer perceptron can recognise. The
      famous example is XOR (output 1 when exactly one input is on): no straight line separates its
      positives from its negatives. More damaging were results about "connectedness" and other global
      properties that local perceptrons cannot compute.`,
    how:`The XOR proof is four lines of algebra, shown in the formula above, and Lab 1 confirms it by brute
      force over every small integer setting. The fix was already known: add a hidden layer. What nobody had
      was a practical way to train one.`,
    story:`Funding agencies read the book as a verdict against the whole approach, and money moved to
      symbolic AI. Rosenblatt died in a boating accident in 1971, before his ideas were vindicated. The
      Lighthill Report (1973) then cut AI funding in Britain across the board. Historians still argue about
      how much the book caused the winter and how much it simply rode it.`,
    today:`The lesson people draw depends on the camp: a correct theorem about a limited model is not a
      verdict on the whole approach. The same argument now plays out over what language models can and
      cannot do in principle.` },
  { icon:"↩", title:"1970–1986 — backpropagation, invented several times",
    who:"Linnainmaa 1970 · Werbos 1974 · Rumelhart, Hinton & Williams 1986",
    lead:"The chain rule, applied backwards through a network, gives every weight its share of the blame. It was discovered, forgotten and rediscovered before it finally caught on.",
    formula:"∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w      — one backward sweep computes all gradients at the cost of about one forward pass",
    what:`Backpropagation computes how much each weight contributed to the error, by passing derivatives
      backward from the output through each layer. With those gradients you can train hidden layers by
      gradient descent. Do one step by hand in Lab 4.`,
    how:`Seppo Linnainmaa described reverse-mode automatic differentiation in his 1970 master's thesis. Paul
      Werbos applied it to neural networks in his 1974 PhD thesis. Shun-ichi Amari had trained multilayer
      nets by stochastic gradient descent in 1967. The 1986 Nature paper by Rumelhart, Hinton and Williams
      showed convincingly that hidden units learn useful internal representations, and that is when the
      field took notice.`,
    story:`Who deserves credit is still argued about loudly (Jürgen Schmidhuber has written at length on it).
      The honest summary is that the mathematics is old, the application to networks came in the 1970s, and
      the 1986 demonstration made the world care.`,
    today:`Every neural network you have heard of is trained by backpropagation. PyTorch and JAX compute it
      automatically; "autograd" is Linnainmaa's reverse mode, running billions of times a second on GPUs.` },
  { icon:"🧟", title:"Why this field is marked 'revived'",
    who:"1943 – now · the idea that would not stay dead",
    lead:"Neural networks were declared dead in 1969 and again in the 1990s. Each time the same few ideas came back, stronger.",
    formula:"threshold unit (1943) + learning rule (1949/58) + hidden layers + backprop (1986) + data + GPUs (2012) = deep learning",
    what:`Nothing in this field was wrong; it was early. The neuron model, Hebbian memory, the perceptron and
      backprop are all still in use. What was missing was data, computing power and a few engineering tricks,
      which arrived in the 2000s and 2010s.`,
    how:`Trace any modern network back and you find these parts: weighted sums, nonlinearities, learning from
      error, and gradients sent backwards. Deep learning is this field, scaled up by a factor of a billion.`,
    story:`The people involved had very different fates. Rosenblatt died unvindicated; Minsky lived to see deep
      networks win; Hinton, who kept working through both winters, shared the 2024 Nobel Prize in Physics
      with Hopfield.`,
    today:`The 1958 newspaper coverage reads eerily like 2020s coverage of AI. Knowing this field's history
      is the best protection against both the hype and the premature obituaries.` }
];

const SOURCES = [
  { type:"THE FOUNDING PAPER · 1943", title:"McCulloch & Pitts — A Logical Calculus of the Ideas Immanent in Nervous Activity",
    note:"Neurons as threshold logic; networks as circuits and automata.", url:"https://doi.org/10.1007/BF02478259" },
  { type:"THE LEARNING RULE · 1949", title:"Donald Hebb — The Organization of Behavior",
    note:"The book that proposed learning by strengthening co-active connections.", url:"https://doi.org/10.4324/9781410612403" },
  { type:"THE PERCEPTRON · 1958", title:"Frank Rosenblatt — The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain",
    note:"Psychological Review 65(6). The learning machine, and its theory.", url:"https://doi.org/10.1037/h0042519" },
  { type:"THE HYPE · 1958", title:"New York Times — 'New Navy Device Learns By Doing'",
    note:"The famous report of a machine expected to 'walk, talk, see, write, reproduce itself and be conscious'.", url:"https://www.nytimes.com/1958/07/08/archives/new-navy-device-learns-by-doing-psychologist-shows-embryo-of.html" },
  { type:"THE CRITIQUE · 1969", title:"Minsky & Papert — Perceptrons: An Introduction to Computational Geometry",
    note:"The book that proved the limits of single-layer perceptrons (expanded edition 1988).", url:"https://mitpress.mit.edu/9780262630221/perceptrons/" },
  { type:"REVERSE-MODE AD · 1976", title:"Seppo Linnainmaa — Taylor Expansion of the Accumulated Rounding Error",
    note:"The journal version of his 1970 thesis: reverse-mode automatic differentiation, the mathematics of backprop.", url:"https://doi.org/10.1007/BF01931367" },
  { type:"THE REVIVAL · 1986", title:"Rumelhart, Hinton & Williams — Learning Representations by Back-propagating Errors",
    note:"Nature 323. Hidden layers learn internal representations; the paper that made backprop famous.", url:"https://doi.org/10.1038/323533a0" },
  { type:"MEMORY AS ENERGY · 1982", title:"John Hopfield — Neural Networks and Physical Systems with Emergent Collective Computational Abilities",
    note:"Hebbian associative memory as energy minimisation. Nobel Prize in Physics 2024.", url:"https://doi.org/10.1073/pnas.79.8.2554" },
  { type:"HISTORY · 1996", title:"Mikel Olazaran — A Sociological Study of the Official History of the Perceptrons Controversy",
    note:"How the XOR story became the official explanation for the first neural winter, and what it leaves out.", url:"https://doi.org/10.1177/030631296026003005" },
  { type:"HISTORY · 2015", title:"Jürgen Schmidhuber — Deep Learning in Neural Networks: An Overview",
    note:"A detailed (and opinionated) history, with 888 references, including backprop's many inventors.", url:"https://arxiv.org/abs/1404.7828" }
];

/* ------------------------------------------------------------- LAB 1: MP neuron */
const GATES = { AND:[0,0,0,1], OR:[0,1,1,1], NAND:[1,1,1,0], NOR:[1,0,0,0], XOR:[0,1,1,0], XNOR:[1,0,0,1] };
const INPUTS = [[0,0],[0,1],[1,0],[1,1]];
const THETAS = []; for (let t = -2; t <= 3; t += 0.5) THETAS.push(t);
function mp(w1, w2, th, x1, x2) { return (w1 * x1 + w2 * x2 >= th) ? 1 : 0; }
function solutions(target) {
  let n = 0, first = null;
  for (let w1 = -2; w1 <= 2; w1++) for (let w2 = -2; w2 <= 2; w2++) for (const th of THETAS) {
    if (INPUTS.every(([a, b], i) => mp(w1, w2, th, a, b) === target[i])) { n++; if (!first) first = [w1, w2, th]; }
  }
  return { n, first };
}
const mpLab = {
  kicker:"1943 · THE THRESHOLD NEURON", title:"Wire a neuron into a logic gate",
  intro:`A McCulloch–Pitts unit adds its weighted inputs and fires if the sum reaches the threshold θ. Pick a target gate, then set w₁, w₂ and θ until the truth table matches. AND, OR and NAND are easy. Then try XOR.`,
  html:`<div class="gk-chips" data-role="gates">${Object.keys(GATES).map((g, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-g="${g}">${g}</button>`).join("")}</div>
    <div class="it-control"><label><span>weight w₁</span><output data-o="w1">1</output></label><input type="range" data-i="w1" min="-2" max="2" step="1" value="1"></div>
    <div class="it-control"><label><span>weight w₂</span><output data-o="w2">1</output></label><input type="range" data-i="w2" min="-2" max="2" step="1" value="1"></div>
    <div class="it-control"><label><span>threshold θ</span><output data-o="th">1.0</output></label><input type="range" data-i="th" min="-2" max="3" step="0.5" value="1"></div>
    <table class="gk-table" data-role="tt"></table>
    <div class="it-lab-actions"><button class="it-send" data-a="search">search every setting (5 × 5 × 11)</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The original 1943 model also had absolute inhibitory inputs and no negative weights; this lab uses the modern weighted form, which is equivalent for these gates.`,
  init(root) {
    let gate = "AND";
    const q = s => root.querySelector(s);
    const val = k => +q(`[data-i="${k}"]`).value;
    function draw(extra) {
      const w1 = val("w1"), w2 = val("w2"), th = val("th");
      q('[data-o="w1"]').textContent = w1; q('[data-o="w2"]').textContent = w2; q('[data-o="th"]').textContent = th.toFixed(1);
      const tgt = GATES[gate];
      let ok = 0;
      q('[data-role="tt"]').innerHTML = `<tr><th>x₁</th><th>x₂</th><th>w₁x₁+w₂x₂</th><th>fires?</th><th>${gate}</th></tr>` +
        INPUTS.map(([a, b], i) => { const s = w1 * a + w2 * b, y = mp(w1, w2, th, a, b); if (y === tgt[i]) ok++;
          return `<tr><td>${a}</td><td>${b}</td><td>${s}</td><td class="${y === tgt[i] ? "hl" : ""}">${y}</td><td>${tgt[i]}</td></tr>`; }).join("");
      q('[data-role="out"]').innerHTML = (ok === 4 ? `<span class="t">✓ this neuron computes ${gate}</span>` : `${ok}/4 rows match ${gate}`) + (extra ? "\n" + extra : "");
    }
    root.querySelectorAll("input[type=range]").forEach(r => r.addEventListener("input", () => draw()));
    root.querySelectorAll('[data-role="gates"] .gk-chip').forEach(b => b.addEventListener("click", () => {
      gate = b.dataset.g; root.querySelectorAll('[data-role="gates"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw();
    }));
    q('[data-a="search"]').addEventListener("click", () => {
      const lines = Object.keys(GATES).map(g => { const s = solutions(GATES[g]);
        return `${g.padEnd(5)} ${String(s.n).padStart(3)} settings ${s.first ? `<span class="d">e.g. w₁=${s.first[0]}, w₂=${s.first[1]}, θ=${s.first[2]}</span>` : `<span class="r">none: not linearly separable</span>`}`; });
      draw(`Checked all 275 settings:\n` + lines.join("\n"));
    });
    draw();
  }
};

/* ------------------------------------------------------ LAB 2: Hebbian memory */
const N = 5;
const PAT = {
  T:"11111 00100 00100 00100 00100", O:"01110 10001 10001 10001 01110", X:"10001 01010 00100 01010 10001", L:"10000 10000 10000 10000 11111"
};
const toVec = s => s.replace(/ /g, "").split("").map(c => c === "1" ? 1 : -1);
function hebbWeights(pats) {
  const n = N * N, W = Array.from({ length:n }, () => new Float64Array(n));
  for (const p of pats) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) W[i][j] += p[i] * p[j] / n;
  return W;
}
function energy(W, s) { let e = 0; for (let i = 0; i < s.length; i++) for (let j = 0; j < s.length; j++) e -= 0.5 * W[i][j] * s[i] * s[j]; return e; }
const hebbLab = {
  kicker:"1949 → 1982 · HEBBIAN MEMORY", title:"Store letters, then recall them from damaged copies",
  intro:`Each stored letter is added to the weights with Hebb's rule (strengthen links between pixels that are on together). Load a letter, damage it with noise or by clicking pixels, then press recall: each pixel follows the weighted vote of the others, and the pattern slides back to the nearest memory. The energy only ever goes down.`,
  html:`<div class="gk-row"><span class="gk-pill">stored:</span><span data-role="stored"></span></div>
    <div class="gk-chips" data-role="pats">${Object.keys(PAT).map(k => `<button class="gk-chip" data-p="${k}">${k}</button>`).join("")}</div>
    <div class="gk-cells" data-role="grid" style="grid-template-columns:repeat(5,1fr);max-width:190px"></div>
    <div class="it-lab-actions">
      <button class="it-send" data-a="recall">▶ recall</button>
      <button class="it-send" data-a="noise">add 20% noise</button>
      <button class="gk-ghost" data-a="store">store this pattern</button>
      <button class="gk-ghost" data-a="reset">reset memory</button>
    </div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Store too many letters and recall starts landing on mixtures ("spurious memories"). Hopfield estimated the capacity at about 0.14 patterns per neuron, which is roughly 3 letters for this 25-pixel net.`,
  init(root) {
    const q = s => root.querySelector(s);
    let stored = ["T", "O"], W = hebbWeights(stored.map(k => toVec(PAT[k]))), s = toVec(PAT.T), timer = null, r = rng(7);
    const grid = q('[data-role="grid"]');
    grid.innerHTML = Array.from({ length:N * N }, (_, i) => `<div class="gk-cell" data-c="${i}"></div>`).join("");
    const cells = [...grid.children];
    function nearest() {
      let best = null, bo = -2;
      for (const k of stored) { const p = toVec(PAT[k]) || []; const o = p.reduce((a, v, i) => a + v * s[i], 0) / (N * N);
        if (Math.abs(o) > bo) { bo = Math.abs(o); best = (o < 0 ? "inverse of " : "") + k; } }
      return [best, bo];
    }
    function draw(msg) {
      cells.forEach((c, i) => { c.style.background = s[i] > 0 ? C.gold : "rgba(255,255,255,.05)"; });
      q('[data-role="stored"]').innerHTML = stored.map(k => `<span class="gk-pill">${k}</span>`).join("") || "<span class='gk-pill'>nothing</span>";
      const [nk, ov] = nearest();
      q('[data-role="out"]').innerHTML = (msg ? msg + "\n" : "") + `energy E = −½ sᵀWs = <span class="g">${energy(W, s).toFixed(3)}</span>\n` +
        (nk ? `closest memory: <span class="t">${nk}</span>  (overlap ${(ov * 100).toFixed(0)}%)` : "");
    }
    cells.forEach((c, i) => c.addEventListener("click", () => { s[i] = -s[i]; draw("flipped a pixel"); }));
    root.querySelectorAll('[data-role="pats"] .gk-chip').forEach(b => b.addEventListener("click", () => { s = toVec(PAT[b.dataset.p]); draw(`loaded ${b.dataset.p}`); }));
    q('[data-a="noise"]').addEventListener("click", () => { let k = 0; for (let i = 0; i < s.length; i++) if (r() < 0.2) { s[i] = -s[i]; k++; } draw(`flipped ${k} pixels at random`); });
    q('[data-a="store"]').addEventListener("click", () => {
      const key = Object.keys(PAT).find(k => toVec(PAT[k]).every((v, i) => v === s[i]));
      if (!key) { draw("store works on the clean letters: load one first"); return; }
      if (!stored.includes(key)) stored.push(key);
      W = hebbWeights(stored.map(k => toVec(PAT[k]))); draw(`stored ${key}; weights now hold ${stored.length} pattern(s)`);
    });
    q('[data-a="reset"]').addEventListener("click", () => { stored = []; W = hebbWeights([]); draw("memory cleared"); });
    q('[data-a="recall"]').addEventListener("click", () => {
      clearInterval(timer); let sweeps = 0, changed = true;
      const order = [...Array(N * N).keys()];
      timer = setInterval(() => {
        changed = false;
        for (let i = order.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
        for (const i of order) { let h = 0; for (let j = 0; j < s.length; j++) h += W[i][j] * s[j]; const ns = h >= 0 ? 1 : -1; if (ns !== s[i]) { s[i] = ns; changed = true; } }
        sweeps++; draw(`sweep ${sweeps}` + (changed ? "" : ": stable"));
        if (!changed || sweeps > 10) clearInterval(timer);
      }, 380);
    });
    draw();
  }
};

/* ------------------------------------------------------ LAB 3: the perceptron */
function makeData(kind, seed) {
  const r = rng(seed), pts = [];
  if (kind === "xor") { for (let i = 0; i < 40; i++) { const x = r() * 2 - 1, y = r() * 2 - 1; if (Math.abs(x) < .12 || Math.abs(y) < .12) { i--; continue; } pts.push({ x, y, c:(x * y > 0) ? 1 : -1 }); } }
  else { const a = r() * Math.PI, nx = Math.cos(a), ny = Math.sin(a), b = (r() - .5) * .6;
    for (let i = 0; i < 40; i++) { const x = r() * 2 - 1, y = r() * 2 - 1, d = nx * x + ny * y - b; if (Math.abs(d) < .1) { i--; continue; } pts.push({ x, y, c:d > 0 ? 1 : -1 }); } }
  return pts;
}
const percLab = {
  kicker:"1958 · ROSENBLATT'S RULE", title:"Watch a perceptron learn, and fail",
  intro:`Orange points are class +1, blue are −1. Each step finds a misclassified point and nudges the line toward it: w ← w + η·y·x. On separable data the mistakes reach zero, as the convergence theorem promises. Switch to XOR and it thrashes forever. Click the plot to add your own points.`,
  html:`<div class="gk-chips" data-role="ds"><button class="gk-chip on" data-d="sep">separable data</button><button class="gk-chip" data-d="xor">XOR data</button><button class="gk-chip" data-d="new">new random set</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="step">one update</button><button class="it-send" data-a="run">▶ run</button><button class="gk-ghost" data-a="reset">reset weights</button>
      <span class="gk-pill" data-role="add">click adds: orange</span></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The XOR failure is what Minsky and Papert formalised in 1969. The cure (a hidden layer) is one click away in the Perceptron-vs-XOR playable atom.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]');
    let kind = "sep", seed = 3, pts = makeData(kind, seed), w = [0.1, -0.2, 0], updates = 0, timer = null, addC = 1, hot = -1;
    const mistakes = () => pts.filter(p => Math.sign(w[0] * p.x + w[1] * p.y + w[2]) !== p.c).length;
    function draw(msg) {
      const { ctx, w:W, h:H } = canvas(cv, 230);
      const sx = x => (x + 1) / 2 * W, sy = y => (1 - (y + 1) / 2) * H;
      ctx.clearRect(0, 0, W, H);
      // shaded half-planes
      for (let gx = 0; gx < W; gx += 6) for (let gy = 0; gy < H; gy += 6) {
        const x = gx / W * 2 - 1, y = 1 - gy / H * 2, v = w[0] * x + w[1] * y + w[2];
        ctx.fillStyle = v >= 0 ? "rgba(255,120,71,.07)" : "rgba(122,168,255,.07)"; ctx.fillRect(gx, gy, 6, 6);
      }
      if (Math.abs(w[1]) > 1e-9 || Math.abs(w[0]) > 1e-9) {
        ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath();
        if (Math.abs(w[1]) > Math.abs(w[0])) { const y = x => -(w[0] * x + w[2]) / w[1]; ctx.moveTo(sx(-1), sy(y(-1))); ctx.lineTo(sx(1), sy(y(1))); }
        else { const x = y => -(w[1] * y + w[2]) / w[0]; ctx.moveTo(sx(x(-1)), sy(-1)); ctx.lineTo(sx(x(1)), sy(1)); }
        ctx.stroke();
      }
      pts.forEach((p, i) => {
        const bad = Math.sign(w[0] * p.x + w[1] * p.y + w[2]) !== p.c;
        ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), i === hot ? 7 : 4.5, 0, 7);
        ctx.fillStyle = p.c > 0 ? C.red : C.blue; ctx.fill();
        if (bad) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.4; ctx.stroke(); }
      });
      const m = mistakes();
      q('[data-role="out"]').innerHTML = (msg ? msg + "\n" : "") + `updates: ${updates}   ·   misclassified: ${m === 0 ? '<span class="t">0 ✓ converged</span>' : `<span class="r">${m}</span>`}\n` +
        `w = (${w[0].toFixed(2)}, ${w[1].toFixed(2)})   bias = ${w[2].toFixed(2)}`;
    }
    function step() {
      const bad = pts.map((p, i) => i).filter(i => Math.sign(w[0] * pts[i].x + w[1] * pts[i].y + w[2]) !== pts[i].c);
      if (!bad.length) { hot = -1; draw("no mistakes left"); return false; }
      const i = bad[updates % bad.length], p = pts[i], eta = 0.5;
      w = [w[0] + eta * p.c * p.x, w[1] + eta * p.c * p.y, w[2] + eta * p.c]; updates++; hot = i;
      draw(`updated on a ${p.c > 0 ? "orange" : "blue"} point`); return true;
    }
    q('[data-a="step"]').addEventListener("click", step);
    q('[data-a="run"]').addEventListener("click", () => { clearInterval(timer); let n = 0; timer = setInterval(() => { if (!step() || ++n > 120) clearInterval(timer); }, 90); });
    q('[data-a="reset"]').addEventListener("click", () => { clearInterval(timer); w = [0.1, -0.2, 0]; updates = 0; hot = -1; draw(); });
    root.querySelectorAll('[data-role="ds"] .gk-chip').forEach(b => b.addEventListener("click", () => {
      clearInterval(timer);
      if (b.dataset.d === "new") seed++; else { kind = b.dataset.d; root.querySelectorAll('[data-role="ds"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); }
      pts = makeData(kind, seed); w = [0.1, -0.2, 0]; updates = 0; hot = -1; draw();
    }));
    q('[data-role="add"]').addEventListener("click", () => { addC = -addC; q('[data-role="add"]').textContent = "click adds: " + (addC > 0 ? "orange" : "blue"); });
    cv.addEventListener("click", e => { const b = cv.getBoundingClientRect(); pts.push({ x:(e.clientX - b.left) / b.width * 2 - 1, y:1 - (e.clientY - b.top) / b.height * 2, c:addC }); draw("added a point"); });
    draw();
  }
};

/* ------------------------------------------------------- LAB 4: backprop by hand */
const bpLab = {
  kicker:"1986 · THE CHAIN RULE BACKWARDS", title:"One neuron, one gradient step, by hand",
  intro:`A single sigmoid neuron sees x = 1.5 and should output t = 1. The forward pass computes z = w·x + b, a = σ(z) and the loss L = (a − t)². The backward pass multiplies local derivatives from the loss back to each weight. Press "step" to move w and b downhill and watch the loss fall.`,
  html:`<div class="it-control"><label><span>weight w</span><output data-o="w">−0.80</output></label><input type="range" data-i="w" min="-3" max="3" step="0.01" value="-0.8"></div>
    <div class="it-control"><label><span>bias b</span><output data-o="b">0.20</output></label><input type="range" data-i="b" min="-3" max="3" step="0.01" value="0.2"></div>
    <div class="it-control"><label><span>learning rate η</span><output data-o="eta">0.8</output></label><input type="range" data-i="eta" min="0.05" max="3" step="0.05" value="0.8"></div>
    <div class="gk-out" data-role="out"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="step">take a gradient step</button><button class="it-send" data-a="ten">10 steps</button><button class="gk-ghost" data-a="reset">reset</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>`,
  caveat:`A real network repeats exactly this bookkeeping for millions of weights at once. Frameworks such as PyTorch build the graph during the forward pass and walk it backwards automatically.`,
  init(root) {
    const q = s => root.querySelector(s), x = 1.5, t = 1, hist = [];
    const sig = z => 1 / (1 + Math.exp(-z));
    const g = k => +q(`[data-i="${k}"]`).value, set = (k, v) => { q(`[data-i="${k}"]`).value = v; };
    function draw() {
      const w = g("w"), b = g("b"), eta = g("eta");
      q('[data-o="w"]').textContent = w.toFixed(2); q('[data-o="b"]').textContent = b.toFixed(2); q('[data-o="eta"]').textContent = eta;
      const z = w * x + b, a = sig(z), L = (a - t) ** 2, dLda = 2 * (a - t), dadz = a * (1 - a), dLdz = dLda * dadz, dLdw = dLdz * x, dLdb = dLdz;
      q('[data-role="out"]').innerHTML =
        `<span class="d">forward →</span>\n z = w·x + b = ${w.toFixed(2)}·${x} + ${b.toFixed(2)} = <span class="g">${z.toFixed(3)}</span>\n a = σ(z) = <span class="g">${a.toFixed(3)}</span>\n L = (a − t)² = <span class="r">${L.toFixed(4)}</span>\n` +
        `<span class="d">← backward</span>\n ∂L/∂a = 2(a − t) = ${dLda.toFixed(3)}\n ∂a/∂z = a(1 − a) = ${dadz.toFixed(3)}\n ∂L/∂z = ${dLda.toFixed(3)} × ${dadz.toFixed(3)} = ${dLdz.toFixed(4)}\n` +
        ` ∂L/∂w = ∂L/∂z · x = <span class="t">${dLdw.toFixed(4)}</span>     ∂L/∂b = <span class="t">${dLdb.toFixed(4)}</span>`;
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 90);
      ctx.clearRect(0, 0, W, H);
      const pts = hist.concat([L]), mx = Math.max(0.3, ...pts);
      ctx.strokeStyle = C.red; ctx.lineWidth = 2; ctx.beginPath();
      pts.forEach((v, i) => { const px = 10 + i / Math.max(1, pts.length - 1) * (W - 20), py = H - 10 - v / mx * (H - 20); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.stroke(); ctx.fillStyle = C.dim; ctx.font = "10px IBM Plex Mono, monospace"; ctx.fillText("loss over your steps", 10, 12);
      return { w, b, eta, dLdw, dLdb, L };
    }
    function step() { const s = draw(); hist.push(s.L); set("w", Math.max(-3, Math.min(3, s.w - s.eta * s.dLdw))); set("b", Math.max(-3, Math.min(3, s.b - s.eta * s.dLdb))); draw(); }
    root.querySelectorAll("input[type=range]").forEach(r => r.addEventListener("input", draw));
    q('[data-a="step"]').addEventListener("click", step);
    q('[data-a="ten"]').addEventListener("click", () => { for (let i = 0; i < 10; i++) step(); });
    q('[data-a="reset"]').addEventListener("click", () => { hist.length = 0; set("w", -0.8); set("b", 0.2); draw(); });
    draw();
  }
};

register("prehistory", {
  kicker:"NEURAL PREHISTORY · 1943–1986 · ABOUT 45 MIN",
  hook:"In 1958 a newspaper said a machine would soon be conscious. Eleven years later a proof about XOR froze the field. This is the story of the idea that would not stay dead.",
  intro:`Before deep learning there was a logic paper, a psychology book, a room-sized learning machine, a devastating critique and a rule from calculus that several people discovered separately. Every piece is still inside today's networks. Four labs below: wire a neuron into a logic gate and prove XOR impossible, store letters in a Hebbian memory and recall them from damaged copies, watch Rosenblatt's perceptron succeed and then fail, and do backpropagation by hand.`,
  timeline:[[1943, "McCulloch–Pitts neuron"], [1949, "Hebb's rule"], [1958, "the perceptron"], [1969, "Perceptrons (XOR)"], [1986, "backprop revival"]],
  labs:[mpLab, hebbLab, percLab, bpLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, find weights for NAND. Since NAND alone can build every circuit, one kind of neuron is enough for any logic.",
    "Still in Lab 1, press search. AND, OR, NAND and NOR each have many solutions; XOR and XNOR have none. That empty row is the 1969 theorem.",
    "In Lab 2, load T, add noise twice and recall. Then store X and L as well and try again: with four memories, recall starts to land on blends.",
    "In Lab 3, run the perceptron on separable data and count the updates to convergence. Switch to XOR and let it run: the mistakes never reach zero.",
    "In Lab 4, set η to 3 and step. Too big a learning rate overshoots, the same lesson as the gradient-descent atom.",
    "Read the 1958 New York Times story in the sources, then any AI headline from this year. Spot the phrases that repeat."
  ],
  sources:SOURCES
});
})();
