// CLASSICAL / STATISTICAL ML — the pre-deep toolkit that still runs most of
// the world's tabular data. Three real labs: k-NN versus k-means on the same
// points (the classic confusion, untangled), a CART decision tree and a
// bagged random forest carving the plane, and the double-descent curve from
// minimum-norm random-feature regression.
(function () {
"use strict";
const { register, canvas, rng, gauss, C } = GuideKit;

const CHAPTERS = [
  { icon:"📍", title:"k-nearest neighbours — classify by proximity",
    who:"Evelyn Fix & Joseph Hodges 1951 · Cover & Hart 1967",
    lead:"To label a new point, look at the k labelled points closest to it and take a vote. No training at all, and surprisingly hard to beat.",
    formula:"ŷ(x) = majority vote of the labels of the k training points nearest to x",
    what:`k-NN is supervised: it needs labelled examples. It simply remembers them and, when asked about a new
      point, lets its nearest neighbours vote. Small k gives jagged, noisy boundaries; large k gives smooth ones.
      Try it in Lab 1.`,
    how:`Cover and Hart proved in 1967 that with enough data, the 1-nearest-neighbour rule has at most twice the
      error of the best possible classifier. The catch is the "curse of dimensionality": in hundreds of
      dimensions every point is roughly equally far from every other, so "nearest" stops meaning much.`,
    story:`Fix and Hodges wrote the idea up in a 1951 US Air Force technical report that was not formally
      published until 1989. k-NN is constantly confused with k-means because both have a k and both use
      distances. They solve completely different problems.`,
    today:`Nearest-neighbour search is back at the centre of AI: vector databases find the embeddings nearest to
      a query, and retrieval-augmented generation feeds those neighbours to a language model.` },
  { icon:"🎯", title:"k-means — find the groups nobody labelled",
    who:"Stuart Lloyd 1957 (published 1982) · MacQueen 1967",
    lead:"Given unlabelled points and a number k, place k centres, assign every point to its nearest centre, move each centre to the middle of its points, and repeat.",
    formula:"repeat:  assign xᵢ → nearest μⱼ ;  μⱼ ← mean of its points      (minimises Σ ‖xᵢ − μ_c(i)‖²)",
    what:`k-means is unsupervised: there are no labels, only structure to discover. It splits data into k
      clusters by alternating two easy steps, and it always converges (though sometimes to a poor local
      optimum). Switch Lab 1 to k-means mode and step through it.`,
    how:`Each step can only lower the total squared distance, so the algorithm must stop. Different starting
      centres can give different answers, which is why implementations restart several times or use the
      smarter "k-means++" start (2007).`,
    story:`Stuart Lloyd devised it at Bell Labs in 1957 for quantising signals (pulse-code modulation). His
      memo circulated for 25 years before appearing in print in 1982, which is why the map marks the year with
      an exclamation.`,
    today:`k-means compresses colours in images, segments customers, builds the "codebooks" used to compress
      embeddings in vector databases, and turns audio into discrete tokens for speech models.` },
  { icon:"🌳", title:"Decision trees and random forests",
    who:"Breiman, Friedman, Olshen & Stone (CART) 1984 · Breiman 2001",
    lead:"Ask a sequence of yes/no questions about the features, each chosen to separate the classes as cleanly as possible. One tree overfits; a forest of randomised trees does not.",
    formula:"split = argmin weighted Gini impurity,  Gini = 1 − Σₖ pₖ²      forest: average many trees on bootstrap samples",
    what:`A decision tree recursively splits the data on one feature at a time ("is x > 3.2?"), choosing the
      split that makes each side purest. It is readable, but deep trees memorise noise. A random forest trains
      many trees on random resamples of the data and averages their votes. Grow both in Lab 2.`,
    how:`Averaging reduces variance: each tree makes different mistakes, and they cancel. Breiman added a
      second source of randomness, considering only a random subset of features at each split, so the trees
      disagree even more usefully.`,
    story:`Leo Breiman spent years as a consultant before returning to academia, and his 2001 essay "Statistical
      Modeling: The Two Cultures" told statisticians they were ignoring the prediction-focused algorithmic
      culture that machine learning had built. It reads as prophecy now.`,
    today:`For tabular data (spreadsheets, databases, medical records) tree ensembles are still usually better
      than deep networks, a result confirmed again by benchmarks in 2022.` },
  { icon:"⚔️", title:"Support vector machines and the kernel trick",
    who:"Boser, Guyon & Vapnik 1992 · Cortes & Vapnik 1995",
    lead:"Of all the lines that separate two classes, choose the one with the widest margin. Then use a kernel to draw that line in a space with thousands of dimensions, without ever computing it.",
    formula:"maximise margin 2/‖w‖  subject to  yᵢ(w·xᵢ + b) ≥ 1 − ξᵢ ;    k(x, x′) = φ(x)·φ(x′)",
    what:`An SVM finds the boundary that stays as far as possible from the nearest points of each class (the
      "support vectors"). The kernel trick replaces dot products with a kernel function, which lets a linear
      method draw curved boundaries.`,
    how:`Vapnik–Chervonenkis theory explained why a wide margin generalises well, independent of the number of
      dimensions. SVMs had a clean convex optimisation problem with a unique answer, which made them the
      method of choice from about 1995 to 2012.`,
    story:`SVMs beat neural networks on handwritten digits in the late 1990s and helped push neural nets into
      their second winter. Then AlexNet (2012) reversed the verdict; the map marks SVMs 🪦.`,
    today:`Kernels survive in Gaussian processes (used heavily in science for uncertainty-aware regression), and
      theory shows very wide neural networks behave like kernel machines (the "neural tangent kernel", 2018).` },
  { icon:"🚀", title:"Boosting — each new model fixes the last one's mistakes",
    who:"Freund & Schapire (AdaBoost) 1995 · Friedman 2001 · Chen & Guestrin (XGBoost) 2014",
    lead:"Train a weak model, find where it is wrong, train the next one to correct those errors, and add them all up. A committee of weak learners becomes a strong one.",
    formula:"F_m(x) = F_{m−1}(x) + η · h_m(x),   h_m fitted to the negative gradient of the loss (the residuals)",
    what:`Gradient boosting builds an ensemble of small trees in sequence, each one fitted to what the current
      ensemble still gets wrong. Where a random forest averages independent trees, boosting chains dependent
      ones.`,
    how:`Friedman showed that boosting is gradient descent in the space of functions: each new tree is a step
      downhill on the loss. XGBoost added regularisation and very efficient engineering, and LightGBM and
      CatBoost followed.`,
    story:`XGBoost won so many Kaggle competitions after 2014 that "just use XGBoost" became standard advice for
      tabular problems, which is why the map calls it Kaggle's perennial champion.`,
    today:`Gradient-boosted trees run credit scoring, fraud detection, ad ranking and much of industrial
      forecasting. They are fast, accurate and far cheaper than deep learning for this kind of data.` },
  { icon:"🗺", title:"Seeing high dimensions — PCA, t-SNE, UMAP",
    who:"Karl Pearson 1901 · van der Maaten & Hinton 2008 · McInnes et al. 2018",
    lead:"Data often lives in hundreds of dimensions. These methods squash it to two, so humans can look at it, each keeping a different kind of structure.",
    formula:"PCA: top eigenvectors of the covariance matrix  ·  t-SNE/UMAP: keep each point's nearest neighbours close",
    what:`PCA (1901, the map's second-oldest node) finds the directions of greatest variance and projects onto
      them, a linear rotation that keeps global structure. t-SNE and UMAP are nonlinear: they try to keep
      neighbours together, producing the cluster pictures familiar from single-cell biology and embedding
      plots.`,
    how:`PCA has a closed-form answer (an eigenvalue problem). t-SNE and UMAP optimise a layout, so distances
      between clusters and cluster sizes in their plots are not meaningful: a common misreading.`,
    story:`Pearson invented PCA in 1901 while fitting planes to points; Hotelling named it in 1933. t-SNE made
      beautiful maps of MNIST digits that became iconic; UMAP made the same idea faster.`,
    today:`The word-vector plot in the Deep Learning guide uses PCA. Every lab that shows "the embedding space"
      of a model is using one of these three.` },
  { icon:"〰️", title:"Bias, variance and double descent",
    who:"Geman, Bienenstock & Doursat 1992 · Belkin et al. 2019",
    lead:"Classical statistics says: too simple underfits, too complex overfits, choose the middle. Deep learning broke the picture, and theory is still catching up.",
    formula:"test error = bias² + variance + noise    →    past the interpolation threshold, error can fall again",
    what:`The classical U-curve says test error falls as models get more flexible, then rises once they start
      fitting noise. But huge networks that fit their training data perfectly still generalise well. Belkin and
      colleagues showed a "double descent": error peaks exactly where the model can just barely fit the data,
      then falls again as it grows larger. Lab 3 reproduces it.`,
    how:`Beyond the threshold there are many exact fits, and the training method picks a smooth one (the
      minimum-norm solution). More parameters mean more room to fit the data smoothly, so the peak is really
      about being forced into the one wiggly exact fit.`,
    story:`The phenomenon had been seen in the 1990s in small models and then forgotten. Its rediscovery in 2019
      helped explain why "bigger is better" kept working for neural networks.`,
    today:`The theory of generalisation in deep learning is an open frontier (marked 🔥 on the map): benign
      overfitting, implicit regularisation and scaling laws all try to explain the same puzzle.` }
];

const SOURCES = [
  { type:"k-NN · 1951 / 1989", title:"Fix & Hodges — Discriminatory Analysis: Nonparametric Discrimination", note:"The 1951 USAF report, reprinted in International Statistical Review in 1989.", url:"https://doi.org/10.2307/1403797" },
  { type:"k-NN THEORY · 1967", title:"Cover & Hart — Nearest Neighbor Pattern Classification", note:"At most twice the Bayes error, asymptotically.", url:"https://doi.org/10.1109/TIT.1967.1053964" },
  { type:"k-MEANS · 1957 / 1982", title:"Stuart Lloyd — Least Squares Quantization in PCM", note:"The Bell Labs memo, finally published 25 years later.", url:"https://doi.org/10.1109/TIT.1982.1056489" },
  { type:"KERNEL SVM · 1992", title:"Boser, Guyon & Vapnik — A Training Algorithm for Optimal Margin Classifiers", note:"The kernel trick applied to maximum-margin classifiers.", url:"https://doi.org/10.1145/130385.130401" },
  { type:"SOFT-MARGIN SVM · 1995", title:"Cortes & Vapnik — Support-Vector Networks", note:"The SVM as it was used for the next 15 years.", url:"https://doi.org/10.1007/BF00994018" },
  { type:"RANDOM FORESTS · 2001", title:"Leo Breiman — Random Forests", note:"Bagged, feature-randomised trees.", url:"https://doi.org/10.1023/A:1010933404324" },
  { type:"BOOSTING · 2001", title:"Jerome Friedman — Greedy Function Approximation: A Gradient Boosting Machine", note:"Boosting as gradient descent in function space.", url:"https://doi.org/10.1214/aos/1013203451" },
  { type:"XGBOOST · 2016", title:"Chen & Guestrin — XGBoost: A Scalable Tree Boosting System", note:"The Kaggle champion.", url:"https://arxiv.org/abs/1603.02754" },
  { type:"PCA · 1901", title:"Karl Pearson — On Lines and Planes of Closest Fit to Systems of Points in Space", note:"The second-oldest node on the map.", url:"https://doi.org/10.1080/14786440109462720" },
  { type:"t-SNE · 2008", title:"van der Maaten & Hinton — Visualizing Data using t-SNE", note:"Neighbour-preserving maps of high-dimensional data.", url:"https://jmlr.org/papers/v9/vandermaaten08a.html" },
  { type:"DOUBLE DESCENT · 2019", title:"Belkin, Hsu, Ma & Mandal — Reconciling Modern Machine-Learning Practice and the Classical Bias–Variance Trade-off", note:"PNAS 116. The curve in Lab 3.", url:"https://doi.org/10.1073/pnas.1903070116" },
  { type:"THE TEXTBOOK · FREE", title:"Hastie, Tibshirani & Friedman — The Elements of Statistical Learning", note:"The classic reference for this whole field, free as a PDF.", url:"https://hastie.su.domains/ElemStatLearn/" }
];

/* ------------------------------------------------ shared: 3-cluster dataset */
function blobs(seed, n) {
  const r = rng(seed), cs = [[-.45, .4], [.5, .35], [0, -.5]], pts = [];
  for (let i = 0; i < n; i++) { const c = i % 3; pts.push({ x:cs[c][0] + gauss(r) * .2, y:cs[c][1] + gauss(r) * .2, c }); }
  return pts;
}
const COLS = [C.gold, C.teal, C.pink, C.violet, C.green];

/* ---------------------------------------------------- LAB 1: k-NN vs k-means */
const kLab = {
  kicker:"k-NN ≠ k-MEANS", title:"Same points, two completely different jobs",
  intro:`In <b>k-NN</b> mode the points are labelled (colours). Click anywhere to classify a new point by a vote of its k nearest neighbours; the background shows the decision regions. In <b>k-means</b> mode the labels are hidden: step the algorithm and watch k centres find the clusters on their own.`,
  html:`<div class="gk-chips" data-role="mode"><button class="gk-chip on" data-v="knn">k-NN (supervised)</button><button class="gk-chip" data-v="km">k-means (unsupervised)</button></div>
    <div class="it-control"><label><span>k</span><output data-o="k">5</output></label><input type="range" data-i="k" min="1" max="15" step="1" value="5"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="step">k-means: one step</button><button class="gk-ghost" data-a="restart">k-means: new random start</button><button class="gk-ghost" data-a="data">new data</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Remember it this way. k-NN: k is how many neighbours vote, it needs labels, and it predicts. k-means: k is how many clusters you want, it needs no labels, and it describes.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'); let mode = "knn", seed = 2, pts = blobs(seed, 90), query = null, cent = [], assign = [], it = 0, r = rng(33);
    const kk = () => +q('[data-i="k"]').value;
    const knn = (x, y, k) => { const d = pts.map(p => [(p.x - x) ** 2 + (p.y - y) ** 2, p.c]).sort((a, b) => a[0] - b[0]).slice(0, k); const v = [0, 0, 0]; d.forEach(([, c]) => v[c]++); return { c:v.indexOf(Math.max(...v)), v, d }; };
    function kmInit() { const k = Math.min(kk(), 5); cent = Array.from({ length:k }, () => { const p = pts[(r() * pts.length) | 0]; return [p.x + (r() - .5) * .05, p.y + (r() - .5) * .05]; }); assign = pts.map(() => -1); it = 0; }
    function kmStep() {
      assign = pts.map(p => { let b = 0, bd = Infinity; cent.forEach((c, j) => { const d = (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2; if (d < bd) { bd = d; b = j; } }); return b; });
      cent = cent.map((c, j) => { const m = pts.filter((_, i) => assign[i] === j); return m.length ? [m.reduce((a, p) => a + p.x, 0) / m.length, m.reduce((a, p) => a + p.y, 0) / m.length] : c; }); it++;
    }
    const sse = () => pts.reduce((a, p, i) => a + (assign[i] >= 0 ? (p.x - cent[assign[i]][0]) ** 2 + (p.y - cent[assign[i]][1]) ** 2 : 0), 0);
    function draw() {
      q('[data-o="k"]').textContent = kk();
      const { ctx, w:W, h:H } = canvas(cv, 240); ctx.clearRect(0, 0, W, H);
      const sx = x => (x + 1.1) / 2.2 * W, sy = y => (1 - (y + 1.1) / 2.2) * H;
      if (mode === "knn") {
        for (let gx = 0; gx < W; gx += 8) for (let gy = 0; gy < H; gy += 8) { const x = gx / W * 2.2 - 1.1, y = 1.1 - gy / H * 2.2; const c = knn(x, y, kk()).c; ctx.fillStyle = COLS[c] + "22"; ctx.fillRect(gx, gy, 8, 8); }
        pts.forEach(p => { ctx.fillStyle = COLS[p.c]; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.5, 0, 7); ctx.fill(); });
        if (query) { const res = knn(query[0], query[1], kk());
          ctx.strokeStyle = "rgba(255,255,255,.5)"; res.d.forEach(([d]) => { ctx.beginPath(); ctx.arc(sx(query[0]), sy(query[1]), Math.sqrt(d) / 2.2 * W, 0, 7); }); ctx.stroke();
          ctx.fillStyle = COLS[res.c]; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx(query[0]), sy(query[1]), 7, 0, 7); ctx.fill(); ctx.stroke();
          q('[data-role="out"]').innerHTML = `new point → votes of its ${kk()} nearest labelled neighbours: <span class="g">${res.v.join(" / ")}</span>\npredicted class: <span class="t">${["gold", "teal", "pink"][res.c]}</span>`; }
        else q('[data-role="out"]').innerHTML = `click the plot to classify a new point.\n<span class="d">k-NN needs these labels. It never builds a model; it just remembers.</span>`;
      } else {
        pts.forEach((p, i) => { ctx.fillStyle = assign[i] >= 0 ? COLS[assign[i]] : "rgba(232,228,244,.55)"; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.5, 0, 7); ctx.fill(); });
        cent.forEach((c, j) => { ctx.strokeStyle = "#fff"; ctx.fillStyle = COLS[j]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx(c[0]) - 8, sy(c[1])); ctx.lineTo(sx(c[0]) + 8, sy(c[1])); ctx.moveTo(sx(c[0]), sy(c[1]) - 8); ctx.lineTo(sx(c[0]), sy(c[1]) + 8); ctx.stroke(); });
        q('[data-role="out"]').innerHTML = `k-means with k = ${cent.length}   ·   iterations: <span class="g">${it}</span>   ·   within-cluster squared distance: <span class="t">${it ? sse().toFixed(2) : "–"}</span>\n<span class="d">no labels used: the colours are the algorithm's own groups.</span>`;
      }
    }
    cv.addEventListener("click", e => { if (mode !== "knn") return; const b = cv.getBoundingClientRect(); query = [(e.clientX - b.left) / b.width * 2.2 - 1.1, 1.1 - (e.clientY - b.top) / b.height * 2.2]; draw(); });
    root.querySelectorAll('[data-role="mode"] .gk-chip').forEach(bt => bt.addEventListener("click", () => { mode = bt.dataset.v; root.querySelectorAll('[data-role="mode"] .gk-chip').forEach(x => x.classList.toggle("on", x === bt)); if (mode === "km") kmInit(); draw(); }));
    q('[data-i="k"]').addEventListener("input", () => { if (mode === "km") kmInit(); draw(); });
    q('[data-a="step"]').addEventListener("click", () => { if (mode !== "km") { mode = "km"; root.querySelectorAll('[data-role="mode"] .gk-chip').forEach(x => x.classList.toggle("on", x.dataset.v === "km")); kmInit(); } kmStep(); draw(); });
    q('[data-a="restart"]').addEventListener("click", () => { kmInit(); draw(); });
    q('[data-a="data"]').addEventListener("click", () => { seed++; pts = blobs(seed, 90); query = null; kmInit(); draw(); });
    kmInit(); draw();
  }
};

/* ------------------------------------------------ LAB 2: trees and forests */
function twoMoons(seed) {
  const r = rng(seed), pts = [];
  for (let i = 0; i < 120; i++) { const c = i % 2, t = r() * Math.PI; const x = c ? 1 - Math.cos(t) - .5 : Math.cos(t) - .5, y = c ? .45 - Math.sin(t) * .9 + .15 : Math.sin(t) * .9 - .3;
    pts.push({ x:x * .8 + gauss(r) * .09, y:y * .8 + gauss(r) * .09, c }); }
  return pts;
}
function gini(pts) { if (!pts.length) return 0; const p = pts.filter(q => q.c).length / pts.length; return 1 - p * p - (1 - p) * (1 - p); }
function grow(pts, depth, maxD, r, featSub) {
  const ones = pts.filter(p => p.c).length, leaf = { leaf:true, p:pts.length ? ones / pts.length : .5 };
  if (depth >= maxD || pts.length < 4 || ones === 0 || ones === pts.length) return leaf;
  let best = null;
  const feats = featSub ? [r() < .5 ? "x" : "y"] : ["x", "y"];
  for (const f of feats) { const vals = pts.map(p => p[f]).sort((a, b) => a - b);
    for (let i = 1; i < vals.length; i += Math.max(1, vals.length / 40 | 0)) { const t = (vals[i - 1] + vals[i]) / 2, L = pts.filter(p => p[f] <= t), R = pts.filter(p => p[f] > t);
      if (!L.length || !R.length) continue; const g = (L.length * gini(L) + R.length * gini(R)) / pts.length; if (!best || g < best.g) best = { f, t, g, L, R }; } }
  if (!best) return leaf;
  return { f:best.f, t:best.t, l:grow(best.L, depth + 1, maxD, r, featSub), r:grow(best.R, depth + 1, maxD, r, featSub) };
}
const predict = (n, p) => n.leaf ? n.p : predict(p[n.f] <= n.t ? n.l : n.r, p);
const treeLab = {
  kicker:"TREES & FORESTS", title:"One tree overfits; a forest averages it away",
  intro:`A CART tree splits the plane with yes/no questions on x or y, each chosen to minimise Gini impurity. Raise the depth and a single tree carves out every noisy point. Switch to a forest: many trees, each trained on a bootstrap resample, vote together, and the boundary becomes smoother and more accurate on fresh test points.`,
  html:`<div class="gk-chips" data-role="m"><button class="gk-chip on" data-v="tree">single tree</button><button class="gk-chip" data-v="forest">random forest (25 trees)</button></div>
    <div class="it-control"><label><span>max depth</span><output data-o="d">4</output></label><input type="range" data-i="d" min="1" max="12" step="1" value="4"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Gradient boosting (XGBoost) uses the same trees differently: instead of averaging independent ones, it adds shallow trees one after another, each fitted to the current mistakes.`,
  init(root) {
    const q = s => root.querySelector(s); let mode = "tree"; const train = twoMoons(4), test = twoMoons(99);
    function build() {
      const D = +q('[data-i="d"]').value; q('[data-o="d"]').textContent = D; const r = rng(7);
      if (mode === "tree") return [grow(train, 0, D, r, false)];
      return Array.from({ length:25 }, () => grow(Array.from({ length:train.length }, () => train[(r() * train.length) | 0]), 0, D, r, true));
    }
    function draw() {
      const trees = build(), P = p => trees.reduce((a, t) => a + predict(t, p), 0) / trees.length;
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 230); ctx.clearRect(0, 0, W, H);
      const sx = x => (x + 1.25) / 2.5 * W, sy = y => (1 - (y + 1.1) / 2.2) * H;
      for (let gx = 0; gx < W; gx += 5) for (let gy = 0; gy < H; gy += 5) { const v = P({ x:gx / W * 2.5 - 1.25, y:1.1 - gy / H * 2.2 }); ctx.fillStyle = `rgba(${v > .5 ? "63,208,201" : "245,196,81"},${(Math.abs(v - .5) * .5).toFixed(2)})`; ctx.fillRect(gx, gy, 5, 5); }
      train.forEach(p => { ctx.fillStyle = p.c ? C.teal : C.gold; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.2, 0, 7); ctx.fill(); });
      const acc = set => set.filter(p => (P(p) > .5 ? 1 : 0) === p.c).length / set.length;
      q('[data-role="out"]').innerHTML = `${mode === "tree" ? "one tree" : "25 bagged trees"}, depth ≤ ${q('[data-i="d"]').value}\ntraining accuracy <span class="g">${(acc(train) * 100).toFixed(1)}%</span>   ·   accuracy on 120 fresh test points <span class="t">${(acc(test) * 100).toFixed(1)}%</span>`;
    }
    q('[data-i="d"]').addEventListener("input", draw);
    root.querySelectorAll('[data-role="m"] .gk-chip').forEach(bt => bt.addEventListener("click", () => { mode = bt.dataset.v; root.querySelectorAll('[data-role="m"] .gk-chip').forEach(x => x.classList.toggle("on", x === bt)); draw(); }));
    draw();
  }
};

/* ---------------------------------------------------- LAB 3: double descent */
function solve(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c] || 1e-12; for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / d; if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
  return M.map((r, i) => r[n] / (r[i] || 1e-12));
}
// Linear regression on Gaussian features, fitting only the first p of D (Belkin, Hsu & Xu 2019):
// minimum-norm least squares, test error computed exactly as ‖β̂ − β‖² + σ².
function ddCurve(n, sigma, seed) {
  const D = 5 * n, out = [];
  for (let p = 1; p <= D; p++) {
    let e = 0;
    for (let rep = 0; rep < 8; rep++) {
      const r = rng(seed + rep * 101);
      const beta = Array.from({ length:D }, (_, j) => gauss(r) * Math.pow(j + 1, -0.6)), nb = Math.hypot(...beta);
      for (let j = 0; j < D; j++) beta[j] /= nb;
      const X = Array.from({ length:n }, () => Array.from({ length:D }, () => gauss(r)));
      const y = X.map(row => row.reduce((a, v, j) => a + v * beta[j], 0) + sigma * gauss(r));
      const Xp = X.map(row => row.slice(0, p)), lam = 1e-10; let w;
      if (p <= n) { const A = Array.from({ length:p }, (_, i) => Array.from({ length:p }, (_, j) => Xp.reduce((a, row) => a + row[i] * row[j], 0) + (i === j ? lam : 0)));
        w = solve(A, Array.from({ length:p }, (_, i) => Xp.reduce((a, row, k) => a + row[i] * y[k], 0))); }
      else { const K = Array.from({ length:n }, (_, i) => Array.from({ length:n }, (_, j) => Xp[i].reduce((a, v, k) => a + v * Xp[j][k], 0) + (i === j ? lam : 0)));
        const al = solve(K, y); w = Array.from({ length:p }, (_, k) => Xp.reduce((a, row, i) => a + row[k] * al[i], 0)); }
      let err = sigma * sigma; for (let j = 0; j < D; j++) { const d = (j < p ? w[j] : 0) - beta[j]; err += d * d; } e += err;
    }
    out.push([p, e / 8]);
  }
  return out;
}
const ddLab = {
  kicker:"BIAS–VARIANCE → DOUBLE DESCENT", title:"Add parameters past the point of fitting every data point",
  intro:`A linear model sees n training examples, each with many Gaussian features, and uses only the first p of them; earlier features carry more of the signal. It is fitted by minimum-norm least squares (what gradient descent finds), and test error is computed exactly. As p grows, error first follows the classical U-curve, spikes when p = n (the model can only just thread through every point), then falls again as p keeps growing.`,
  html:`<div class="it-control"><label><span>training points n</span><output data-o="n">20</output></label><input type="range" data-i="n" min="10" max="30" step="2" value="20"></div>
    <div class="it-control"><label><span>label noise</span><output data-o="s">0.20</output></label><input type="range" data-i="s" min="0" max="0.6" step="0.05" value="0.2"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="go">▶ compute the curve</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out">press compute.</div>`,
  caveat:`The peak is not bad luck: at p = n there is exactly one way to fit every point, and it is wildly wiggly. With many more parameters there are infinitely many fits, and the minimum-norm one is smooth. That "implicit regularisation" is part of why huge networks generalise.`,
  init(root) {
    const q = s => root.querySelector(s);
    const lbl = () => { q('[data-o="n"]').textContent = q('[data-i="n"]').value; q('[data-o="s"]').textContent = (+q('[data-i="s"]').value).toFixed(2); };
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", lbl)); lbl();
    q('[data-a="go"]').addEventListener("click", () => {
      const n = +q('[data-i="n"]').value, s = +q('[data-i="s"]').value;
      const cur = ddCurve(n, s, 5);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 190); ctx.clearRect(0, 0, W, H);
      const lg = v => Math.log10(Math.max(v, 1e-3)), ys = cur.map(c => lg(c[1])), lo = Math.min(...ys), hi = Math.min(Math.max(...ys), lo + 4);
      const X = p => 34 + (p - 1) / (n * 5 - 1) * (W - 44), Y = v => H - 20 - (Math.min(lg(v), hi) - lo) / (hi - lo || 1) * (H - 34);
      ctx.strokeStyle = "rgba(255,93,108,.6)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(n), 8); ctx.lineTo(X(n), H - 20); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.beginPath(); cur.forEach(([p, e], i) => i ? ctx.lineTo(X(p), Y(e)) : ctx.moveTo(X(p), Y(e))); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText("test error (log)", 4, 10); ctx.fillText("features p →", W - 70, H - 6); ctx.fillStyle = C.red; ctx.fillText("p = n", X(n) + 4, 18);
      const peak = cur.reduce((a, b) => b[1] > a[1] ? b : a), under = cur.filter(c => c[0] < n).reduce((a, b) => b[1] < a[1] ? b : a), over = cur[cur.length - 1];
      q('[data-role="out"]').innerHTML = `best classical fit: p = ${under[0]}, error <span class="t">${under[1].toFixed(3)}</span>\npeak at p = <span class="r">${peak[0]}</span>, error ${peak[1].toFixed(2)}\nfar past the threshold, p = ${over[0]}: error <span class="g">${over[1].toFixed(3)}</span>   <span class="d">(best overall past it: ${cur.filter(c => c[0] > 2 * n).reduce((a, b) => b[1] < a[1] ? b : a)[1].toFixed(3)})</span>`;
    });
  }
};

register("classical", {
  kicker:"CLASSICAL / STATISTICAL ML · 1901–NOW · ABOUT 45 MIN",
  hook:"Before deep learning there was a toolkit of nearest neighbours, clusters, trees, margins and boosting. It still runs most of the world's spreadsheets, and it wins on most tabular data.",
  intro:`This field is the practical core of machine learning outside images and text: k-NN and k-means (constantly confused, and utterly different), decision trees and random forests, support vector machines, gradient boosting, the dimension-reduction maps, and the bias–variance picture that deep learning overturned. Three labs below: untangle k-NN from k-means on the same points, grow a tree and then a forest, and reproduce double descent.`,
  timeline:[[1901, "PCA"], [1951, "k-NN"], [1957, "k-means"], [1984, "CART trees"], [1995, "SVMs"], [2019, "double descent"]],
  labs:[kLab, treeLab, ddLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, classify a point near a cluster boundary with k = 1, then k = 15. The vote, and sometimes the answer, changes.",
    "Switch Lab 1 to k-means, set k = 5 and step to convergence. It still finds five 'clusters' in data that has three: k-means always gives you the k you ask for.",
    "In Lab 2, push a single tree to depth 12: training accuracy reaches 100% while test accuracy falls. Then switch to the forest at the same depth.",
    "In Lab 3, compute the curve for n = 10 and then n = 30. The peak moves with n: it sits exactly where parameters equal data points.",
    "Read Breiman's 'Two Cultures' essay (linked from his pioneer card) and decide which culture each lab belongs to.",
    "Compare Lab 1 with the word-vector plot in the Deep Learning guide: nearest-neighbour search in embedding space is how modern retrieval works."
  ],
  sources:SOURCES
});
})();
