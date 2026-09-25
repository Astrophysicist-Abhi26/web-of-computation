// STATISTICS AS COMPUTATION — the oldest continent on the map: Bayes (1763),
// least squares (1805), maximum likelihood (1922), MCMC (1953) and conformal
// prediction (1999). Four real labs: Bayes' theorem as natural frequencies,
// least squares on points you place, a Metropolis sampler exploring a
// two-peaked distribution, and split-conformal intervals with checked coverage.
(function () {
"use strict";
const { register, canvas, rng, gauss, C } = GuideKit;

const CHAPTERS = [
  { icon:"⚖️", title:"1763 — Bayes: updating belief with evidence",
    who:"Thomas Bayes (published by Richard Price) 1763 · Pierre-Simon Laplace 1774–1812",
    lead:"How should evidence change what you believe? A Presbyterian minister's posthumous essay gave the rule; Laplace turned it into a working method for science.",
    formula:"P(H | E) = P(E | H) · P(H) / P(E)      posterior ∝ likelihood × prior",
    what:`Bayes' theorem combines what you believed before (the prior) with how likely the evidence is under each
      hypothesis (the likelihood) to give what you should believe now (the posterior). Lab 1 applies it to a
      medical test, where intuition usually goes badly wrong.`,
    how:`Laplace developed the method independently and used it for real problems, from the masses of planets to
      birth rates. Modern Bayesian inference computes posteriors for models with millions of parameters, which
      usually needs sampling (MCMC, chapter four).`,
    story:`Bayes never published his essay; his friend Richard Price found it among his papers and sent it to the
      Royal Society in 1763. For much of the 20th century Bayesian ideas were controversial, part of the long
      Bayesian–frequentist dispute on the map.`,
    today:`Spam filters, medical diagnosis, search-and-rescue planning and much of modern scientific inference
      (including simulation-based inference in cosmology) are Bayesian at heart.` },
  { icon:"📏", title:"1805 — least squares: the oldest machine learning",
    who:"Adrien-Marie Legendre 1805 · Carl Friedrich Gauss 1809 (used from 1795, he said)",
    lead:"Given noisy measurements, find the curve that makes the sum of squared errors as small as possible. It was the first method for fitting a model to data, and it is still everywhere.",
    formula:"minimise Σᵢ (yᵢ − (a + b·xᵢ))²   ⇒   b = cov(x, y) / var(x),   a = ȳ − b·x̄",
    what:`Least squares fits a line (or any linear model) by minimising the squared vertical distances to the
      points. The answer has a closed form. Place points and watch the fit in Lab 2.`,
    how:`Gauss showed that least squares is the maximum-likelihood answer when errors follow the normal (Gaussian)
      distribution, linking it to probability. Squaring errors makes the maths clean but lets outliers pull the
      line strongly.`,
    story:`Legendre published first (1805); Gauss claimed in 1809 he had used it since 1795, including to predict
      where the dwarf planet Ceres would reappear in 1801, a famous success. The priority dispute was bitter.`,
    today:`Linear regression is taught to every science student, and a neural network trained with squared-error
      loss is doing least squares on a very flexible model.` },
  { icon:"🎯", title:"1922 — maximum likelihood",
    who:"Ronald A. Fisher · 'On the Mathematical Foundations of Theoretical Statistics'",
    lead:"Choose the parameters that make the observed data most probable. Fisher made this the central principle of estimation, and every machine learning loss function is a version of it.",
    formula:"θ̂ = argmax_θ  Σᵢ log p(xᵢ | θ)      —  minimising cross-entropy is exactly this",
    what:`Maximum likelihood estimation picks the model that gives the data the highest probability. Under Gaussian
      noise it gives least squares; for classification it gives cross-entropy loss. The Learning Paradigms guide
      has a lab showing the two are the same number.`,
    how:`Fisher also introduced the Fisher information (how much the data tells you about a parameter), which sets
      the best possible precision of any estimate and reappears in information geometry.`,
    story:`Fisher also founded experimental design and the analysis of variance while working at an agricultural
      research station. He held views on eugenics that are now widely condemned, a reminder that scientific
      brilliance and moral judgement are separate things.`,
    today:`Training a language model maximises the likelihood of the next token over trillions of tokens: Fisher's
      principle at the largest scale ever attempted. The map's gold bridge reads "maximum likelihood ⇒ every loss
      function".` },
  { icon:"🔥", title:"1953 — MCMC: sampling the unsampleable",
    who:"Metropolis, Rosenbluth, Rosenbluth, Teller & Teller 1953 · Hastings 1970 · Gibbs sampling 1984",
    lead:"Many probability distributions are impossible to sample directly or integrate exactly. Build a random walk that visits each region in proportion to its probability, and let it run.",
    formula:"propose x′ ~ q(x′ | x);   accept with probability min(1, p(x′) / p(x))",
    what:`The Metropolis algorithm wanders randomly, always accepting moves to higher probability and sometimes
      accepting moves to lower probability. Over time, the fraction of time it spends in each region matches the
      target distribution. Watch it explore two peaks in Lab 3.`,
    how:`The step size matters: too small and the walk crawls, too large and almost every proposal is rejected.
      Hastings (1970) generalised the method to asymmetric proposals; Hamiltonian Monte Carlo (1987) uses
      gradients to take long, efficient steps.`,
    story:`The 1953 paper came from Los Alamos, computed on the MANIAC computer; the physicist Arianna Rosenbluth
      wrote much of the code. Its algorithm was later voted one of the top ten algorithms of the 20th century.`,
    today:`MCMC underlies Bayesian statistics software (Stan, PyMC), cosmological parameter estimation, and
      asteroseismology. Diffusion models (Deep Learning guide) are close cousins: sampling by following a score.` },
  { icon:"🛡", title:"1999 — conformal prediction: guarantees without assumptions",
    who:"Vladimir Vovk, Alexander Gammerman & Glenn Shafer · 1999–2005",
    lead:"Can you put error bars on any model's predictions, even a black-box neural network, and guarantee they are right 90% of the time? Conformal prediction says yes, with almost no assumptions.",
    formula:"calibrate on held-out data: q̂ = ⌈(n+1)(1−α)⌉-th smallest |yᵢ − ŷᵢ|;   interval = ŷ ± q̂   ⇒  P(y ∈ interval) ≥ 1 − α",
    what:`Split conformal prediction measures a model's errors on a calibration set, takes the right quantile of
      those errors, and uses it as the half-width of every future prediction interval. If the data are
      exchangeable (roughly, drawn from the same process), coverage is guaranteed. Lab 4 checks it empirically.`,
    how:`The guarantee holds for any model and any data distribution, which is why it is called
      distribution-free. The price is that intervals are only as tight as the model is good.`,
    story:`Vovk and colleagues developed the theory from 1999 onwards; it stayed a niche topic until about 2020,
      when the need for reliable uncertainty in machine learning made it popular.`,
    today:`Conformal prediction wraps medical, astronomical and language-model predictions in calibrated
      uncertainty. The map marks it 🔥, and notes its use in time-domain astronomy pipelines.` }
];

const SOURCES = [
  { type:"BAYES · 1763", title:"Thomas Bayes — An Essay towards Solving a Problem in the Doctrine of Chances", note:"Philosophical Transactions, published by Richard Price.", url:"https://doi.org/10.1098/rstl.1763.0053" },
  { type:"LEAST SQUARES · HISTORY", title:"Stephen Stigler — Gauss and the Invention of Least Squares", note:"Annals of Statistics 9(3), 1981. Legendre, Gauss and the priority dispute.", url:"https://doi.org/10.1214/aos/1176345451" },
  { type:"MAXIMUM LIKELIHOOD · 1922", title:"R. A. Fisher — On the Mathematical Foundations of Theoretical Statistics", note:"Likelihood, sufficiency and efficiency.", url:"https://doi.org/10.1098/rsta.1922.0009" },
  { type:"MCMC · 1953", title:"Metropolis et al. — Equation of State Calculations by Fast Computing Machines", note:"J. Chem. Phys. 21. The Metropolis algorithm.", url:"https://doi.org/10.1063/1.1699114" },
  { type:"MCMC · 1970", title:"W. K. Hastings — Monte Carlo Sampling Methods Using Markov Chains and Their Applications", note:"The Metropolis–Hastings generalisation.", url:"https://doi.org/10.1093/biomet/57.1.97" },
  { type:"CONFORMAL · 2005", title:"Vovk, Gammerman & Shafer — Algorithmic Learning in a Random World", note:"The book that set out conformal prediction.", url:"https://link.springer.com/book/10.1007/b106715" },
  { type:"CONFORMAL · TUTORIAL", title:"Angelopoulos & Bates — A Gentle Introduction to Conformal Prediction", note:"The clearest modern tutorial, with code.", url:"https://arxiv.org/abs/2107.07511" },
  { type:"BAYESIAN DATA ANALYSIS · FREE", title:"Gelman et al. — Bayesian Data Analysis (3rd ed.)", note:"The standard text, free as a PDF from the authors.", url:"http://www.stat.columbia.edu/~gelman/book/" }
];

/* ------------------------------------------------------------ LAB 1: Bayes */
const bayesLab = {
  kicker:"BAYES · NATURAL FREQUENCIES", title:"You tested positive. How likely is it that you're ill?",
  intro:`A disease affects some fraction of people. A test catches most true cases (sensitivity) and rarely flags healthy people (specificity). Each square is one of 1,000 people. The answer to 'I tested positive, am I ill?' is the share of lit squares that are truly ill, and it is often far lower than people guess.`,
  html:`<div class="it-control"><label><span>prevalence (share who are ill)</span><output data-o="p">1.0%</output></label><input type="range" data-i="p" min="0.001" max="0.3" step="0.001" value="0.01"></div>
    <div class="it-control"><label><span>sensitivity (ill → positive)</span><output data-o="s">90%</output></label><input type="range" data-i="s" min="0.5" max="1" step="0.01" value="0.9"></div>
    <div class="it-control"><label><span>specificity (healthy → negative)</span><output data-o="c">95%</output></label><input type="range" data-i="c" min="0.5" max="0.999" step="0.001" value="0.95"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`With a rare disease, even a good test produces more false alarms than true cases, because there are so many more healthy people to be wrong about. Doctors and courts have both misjudged this, and it is exactly what Bayes' theorem corrects.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const p = +q('[data-i="p"]').value, s = +q('[data-i="s"]').value, c = +q('[data-i="c"]').value;
      q('[data-o="p"]').textContent = (p * 100).toFixed(1) + "%"; q('[data-o="s"]').textContent = Math.round(s * 100) + "%"; q('[data-o="c"]').textContent = (c * 100).toFixed(1) + "%";
      const ill = Math.round(1000 * p), tp = Math.round(ill * s), fp = Math.round((1000 - ill) * (1 - c)), post = tp / Math.max(1, tp + fp);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 150); ctx.clearRect(0, 0, W, H);
      const cols = 50, cs = Math.min((W - 10) / cols, (H - 10) / 20);
      for (let i = 0; i < 1000; i++) { const x = 5 + (i % cols) * cs, y = 5 + Math.floor(i / cols) * cs;
        let col = "rgba(255,255,255,.07)"; if (i < ill) col = i < tp ? C.red : "rgba(255,120,71,.35)"; else if (i - ill < fp) col = C.gold;
        ctx.fillStyle = col; ctx.fillRect(x, y, cs - 1, cs - 1); }
      q('[data-role="out"]').innerHTML = `of 1,000 people: <span class="r">${ill}</span> ill, ${1000 - ill} healthy\npositive tests: <span class="r">${tp}</span> true (red) + <span class="g">${fp}</span> false alarms (gold) = ${tp + fp}\nP(ill | positive) = ${tp} / ${tp + fp} = <span class="t">${(post * 100).toFixed(1)}%</span>\n<span class="d">Bayes: P(ill|+) = P(+|ill)·P(ill) / P(+) = ${s.toFixed(2)} × ${p.toFixed(3)} / ${((tp + fp) / 1000).toFixed(3)}</span>`;
    }
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw)); draw();
  }
};

/* ------------------------------------------------------- LAB 2: least squares */
const lsLab = {
  kicker:"LEAST SQUARES · 1805", title:"Place points and fit the line",
  intro:`Click to add points; click near an existing point to remove it. The line minimises the sum of the squared vertical distances (the red segments). Add one far-away point and watch how strongly a single outlier can pull a least-squares fit.`,
  html:`<canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="noisy">random noisy data</button><button class="gk-ghost" data-a="clear">clear</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Squaring the errors makes the maths neat (a closed-form answer) and matches Gaussian noise, but it also gives outliers enormous influence. Robust alternatives minimise absolute errors or down-weight outliers.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'); let pts = [];
    const noisy = () => { const r = rng(Date.now() % 1e6); pts = Array.from({ length:14 }, () => { const x = r() * 8 + 1; return [x, 1 + .7 * x + gauss(r) * .8]; }); };
    function draw() {
      const { ctx, w:W, h:H } = canvas(cv, 210); ctx.clearRect(0, 0, W, H);
      const X = x => 20 + x / 10 * (W - 30), Y = y => H - 16 - y / 10 * (H - 26);
      ctx.strokeStyle = "rgba(255,255,255,.1)"; for (let v = 0; v <= 10; v += 2) { ctx.beginPath(); ctx.moveTo(X(v), Y(0)); ctx.lineTo(X(v), Y(10)); ctx.moveTo(X(0), Y(v)); ctx.lineTo(X(10), Y(v)); ctx.stroke(); }
      let msg = "click to add at least two points";
      if (pts.length >= 2) {
        const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
        const sxy = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0), sxx = pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0), b = sxx ? sxy / sxx : 0, a = my - b * mx;
        const sse = pts.reduce((s, p) => s + (p[1] - (a + b * p[0])) ** 2, 0), sst = pts.reduce((s, p) => s + (p[1] - my) ** 2, 0);
        pts.forEach(p => { ctx.strokeStyle = "rgba(255,93,108,.7)"; ctx.beginPath(); ctx.moveTo(X(p[0]), Y(p[1])); ctx.lineTo(X(p[0]), Y(a + b * p[0])); ctx.stroke(); });
        ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(a)); ctx.lineTo(X(10), Y(a + 10 * b)); ctx.stroke();
        msg = `fitted line: y = <span class="g">${a.toFixed(3)}</span> + <span class="g">${b.toFixed(3)}</span>·x\nsum of squared errors = <span class="r">${sse.toFixed(3)}</span>   ·   R² = <span class="t">${sst ? (1 - sse / sst).toFixed(3) : "–"}</span>   ·   ${n} points`;
      }
      pts.forEach(p => { ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 4, 0, 7); ctx.fill(); });
      q('[data-role="out"]').innerHTML = msg;
    }
    cv.addEventListener("click", e => { const b = cv.getBoundingClientRect(), W = b.width, H = b.height, x = (e.clientX - b.left - 20) / (W - 30) * 10, y = (H - 16 - (e.clientY - b.top)) / (H - 26) * 10;
      const near = pts.findIndex(p => Math.hypot(p[0] - x, p[1] - y) < .3); if (near >= 0) pts.splice(near, 1); else pts.push([x, y]); draw(); });
    q('[data-a="noisy"]').addEventListener("click", () => { noisy(); draw(); }); q('[data-a="clear"]').addEventListener("click", () => { pts = []; draw(); });
    noisy(); draw();
  }
};

/* -------------------------------------------------------------- LAB 3: MCMC */
const logp = (x, y) => { const a = Math.exp(-((x + 1.2) ** 2 + (y - .3) ** 2) / (2 * .35 ** 2)), b = 0.7 * Math.exp(-((x - 1.3) ** 2 + (y + .5) ** 2) / (2 * .5 ** 2)); return Math.log(a + b + 1e-300); };
const mcmcLab = {
  kicker:"MCMC · METROPOLIS 1953", title:"A random walk that learns the shape of a distribution",
  intro:`The target has two peaks (the contour lines). The Metropolis walker proposes a random step; it always moves uphill in probability and sometimes moves downhill. Its path samples the distribution. Try a tiny step (it crawls and may never find the second peak), a huge step (almost everything is rejected), and something in between.`,
  html:`<div class="it-control"><label><span>proposal step size</span><output data-o="s">0.50</output></label><input type="range" data-i="s" min="0.02" max="4" step="0.01" value="0.5"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ run 2,000 steps</button><button class="gk-ghost" data-a="reset">restart from the left peak</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`A rule of thumb for random-walk Metropolis is to aim for an acceptance rate of roughly 20–50%. Real samplers such as Stan's Hamiltonian Monte Carlo use gradients to move much further per step.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'); let chain = [[-1.2, .3]], acc = 0, tries = 0, r = rng(3), bg = null;
    function draw() {
      const { ctx, w:W, h:H } = canvas(cv, 220); ctx.clearRect(0, 0, W, H);
      const sx = x => (x + 3) / 6 * W, sy = y => (1 - (y + 2) / 4) * H;
      for (let gx = 0; gx < W; gx += 6) for (let gy = 0; gy < H; gy += 6) { const v = Math.exp(logp(gx / W * 6 - 3, 2 - gy / H * 4)); ctx.fillStyle = `rgba(245,196,81,${(v * .35).toFixed(3)})`; ctx.fillRect(gx, gy, 6, 6); }
      ctx.strokeStyle = "rgba(63,208,201,.35)"; ctx.lineWidth = 1; ctx.beginPath(); chain.slice(-600).forEach(([x, y], i) => i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y))); ctx.stroke();
      ctx.fillStyle = C.teal; chain.forEach(([x, y]) => ctx.fillRect(sx(x) - 1, sy(y) - 1, 2, 2));
      const [lx, ly] = chain[chain.length - 1]; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(sx(lx), sy(ly), 4, 0, 7); ctx.fill();
      const right = chain.filter(([x]) => x > 0).length / chain.length;
      q('[data-role="out"]').innerHTML = `samples: <span class="g">${chain.length}</span>   ·   acceptance rate: <span class="${tries && acc / tries > .15 && acc / tries < .7 ? "t" : "r"}">${tries ? (acc / tries * 100).toFixed(0) + "%" : "–"}</span>\nshare of time on the right-hand peak: <span class="t">${(right * 100).toFixed(0)}%</span>   <span class="d">(the true share is about 59%)</span>`;
    }
    q('[data-a="run"]').addEventListener("click", () => { const s = +q('[data-i="s"]').value; let [x, y] = chain[chain.length - 1];
      for (let i = 0; i < 2000; i++) { const nx = x + gauss(r) * s, ny = y + gauss(r) * s; tries++; if (Math.log(r()) < logp(nx, ny) - logp(x, y)) { x = nx; y = ny; acc++; } chain.push([x, y]); }
      if (chain.length > 20000) chain = chain.slice(-20000); draw(); });
    q('[data-a="reset"]').addEventListener("click", () => { chain = [[-1.2, .3]]; acc = 0; tries = 0; draw(); });
    q('[data-i="s"]').addEventListener("input", () => { q('[data-o="s"]').textContent = (+q('[data-i="s"]').value).toFixed(2); });
    draw();
  }
};

/* --------------------------------------------------------- LAB 4: conformal */
const confLab = {
  kicker:"CONFORMAL PREDICTION", title:"Error bars with a guarantee",
  intro:`A deliberately imperfect model (a straight line) predicts noisy, curved data. Split conformal prediction takes its absolute errors on a calibration set, picks the (1 − α) quantile, and puts that margin around every new prediction. The lab then checks coverage on 2,000 fresh points: it lands at or just above the promised 1 − α, whatever the model.`,
  html:`<div class="it-control"><label><span>target coverage 1 − α</span><output data-o="a">90%</output></label><input type="range" data-i="a" min="0.5" max="0.99" step="0.01" value="0.9"></div>
    <div class="it-control"><label><span>calibration set size n</span><output data-o="n">100</output></label><input type="range" data-i="n" min="10" max="1000" step="10" value="100"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="again">redraw with new data</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The guarantee is about average coverage over many predictions, and it assumes future data resemble the calibration data. A better model gives narrower intervals; the guarantee holds either way.`,
  init(root) {
    const q = s => root.querySelector(s); let seed = 5;
    const f = x => Math.sin(x) * 1.5 + .3 * x, model = x => .3 * x + .2;
    function draw() {
      const alpha = 1 - +q('[data-i="a"]').value, n = +q('[data-i="n"]').value; q('[data-o="a"]').textContent = Math.round((1 - alpha) * 100) + "%"; q('[data-o="n"]').textContent = n;
      const r = rng(seed), sample = m => Array.from({ length:m }, () => { const x = r() * 8 - 4; return [x, f(x) + gauss(r) * .5]; });
      const cal = sample(n), scores = cal.map(([x, y]) => Math.abs(y - model(x))).sort((a, b) => a - b);
      const kq = Math.min(n, Math.ceil((n + 1) * (1 - alpha))), qhat = kq > n ? Infinity : scores[kq - 1];
      const test = sample(2000), cover = test.filter(([x, y]) => Math.abs(y - model(x)) <= qhat).length / test.length;
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 200); ctx.clearRect(0, 0, W, H);
      const X = x => (x + 4) / 8 * W, Y = y => H / 2 - y / 7 * H;
      if (isFinite(qhat)) { ctx.fillStyle = "rgba(63,208,201,.14)"; ctx.beginPath(); ctx.moveTo(X(-4), Y(model(-4) + qhat)); ctx.lineTo(X(4), Y(model(4) + qhat)); ctx.lineTo(X(4), Y(model(4) - qhat)); ctx.lineTo(X(-4), Y(model(-4) - qhat)); ctx.fill(); }
      test.slice(0, 400).forEach(([x, y]) => { ctx.fillStyle = Math.abs(y - model(x)) <= qhat ? "rgba(232,228,244,.5)" : C.red; ctx.fillRect(X(x) - 1, Y(y) - 1, 2.2, 2.2); });
      ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(-4), Y(model(-4))); ctx.lineTo(X(4), Y(model(4))); ctx.stroke();
      q('[data-role="out"]').innerHTML = `margin q̂ = ${kq}-th smallest of ${n} calibration errors = <span class="g">${isFinite(qhat) ? qhat.toFixed(3) : "∞ (n too small for this α)"}</span>\ncoverage on 2,000 new points: <span class="${cover >= 1 - alpha - .02 ? "t" : "r"}">${(cover * 100).toFixed(1)}%</span>   (promised ≥ ${((1 - alpha) * 100).toFixed(0)}%)\n<span class="d">red dots: the points outside the band, about α of them</span>`;
    }
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw)); q('[data-a="again"]').addEventListener("click", () => { seed++; draw(); }); draw();
  }
};

register("stats", {
  kicker:"STATISTICS AS COMPUTATION · 1763–NOW · ABOUT 50 MIN",
  hook:"Machine learning's ground floor was poured before Babbage cut a single gear: Bayes' theorem in 1763 and least squares in 1805 are the oldest nodes on this map.",
  intro:`Statistics is the science of learning from data under uncertainty, and much of machine learning is statistics with more computing power. This field follows five ideas that remain central: updating beliefs with Bayes' theorem, fitting models by least squares and maximum likelihood, sampling hard distributions with MCMC, and attaching guaranteed error bars with conformal prediction. Four labs below: see why a positive test can still mean you're probably healthy, fit a line to your own points, watch a Metropolis walker explore two peaks, and check conformal coverage.`,
  timeline:[[1763, "Bayes' theorem"], [1805, "least squares"], [1922, "maximum likelihood"], [1953, "MCMC"], [1999, "conformal prediction"]],
  labs:[bayesLab, lsLab, mcmcLab, confLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, with 1% prevalence, 90% sensitivity and 95% specificity, guess P(ill | positive) before reading it. Then raise prevalence to 20% and watch the answer jump.",
    "In Lab 2, fit a clean line, then add one point far above it on the right: see how much the slope moves.",
    "In Lab 3, run 2,000 steps with step size 0.05, then 3.5, then 0.8. Compare the acceptance rates and whether the walker ever finds the right-hand peak.",
    "In Lab 4, set coverage to 95% with n = 10: the margin becomes infinite, because 10 calibration points can't certify 95%. Raise n until it's finite.",
    "Connect Lab 3 to the Deep Learning guide's diffusion lab: both generate samples by following probabilities, one by random walk, one by the score."
  ],
  sources:SOURCES
});
})();
