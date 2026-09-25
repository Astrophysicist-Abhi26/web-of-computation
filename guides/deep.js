// DEEP LEARNING ARCHITECTURES — 1980 to now: convolution, memory cells, the
// 2012 big bang, embeddings, GANs, the Transformer, diffusion and KANs.
// Four real labs: convolution + ReLU + pooling on a drawing, gradient flow
// through a deep random net (vanishing gradients and the residual fix),
// word-vector arithmetic in a small hand-built embedding, and a diffusion
// model that pulls a shape out of pure noise using the exact score.
(function () {
"use strict";
const { register, canvas, rng, gauss, C } = GuideKit;

const CHAPTERS = [
  { icon:"🔲", title:"Convolution — learned filters that slide across an image",
    who:"Kunihiko Fukushima 1980 · Yann LeCun 1989 · LeNet-5 1998",
    lead:"Instead of connecting every pixel to every neuron, reuse one small filter everywhere. Fewer weights, and a cat in the corner looks the same as a cat in the middle.",
    formula:"feature[i,j] = Σₘ Σₙ image[i+m, j+n] · kernel[m,n]    →  ReLU  →  max-pool",
    what:`A convolutional layer slides a small grid of weights (a kernel) across the image and records how
      strongly each patch matches it. Early layers learn edge and texture detectors; deeper layers combine
      them into parts and objects. Pooling shrinks the map so later layers see a wider area. Try it in Lab 1.`,
    how:`Weight sharing is the key: one 3×3 kernel has 9 weights no matter how big the image is, and it
      detects its feature anywhere. Fukushima's 1980 Neocognitron already stacked convolution and pooling, but
      trained it without gradients. LeCun trained the same shape with backpropagation at Bell Labs in 1989.`,
    story:`LeCun's networks read handwritten zip codes for the US Postal Service and, by the late 1990s, a
      large share of cheques deposited in American banks. Then SVMs looked better on benchmarks, and CNNs sat
      mostly unused for a decade, waiting for data and GPUs.`,
    today:`Convolutions still run phone cameras, medical scanners and self-driving perception, and the idea of
      a small shared filter survives inside vision transformers' patch embeddings.` },
  { icon:"🧵", title:"Vanishing gradients and the LSTM",
    who:"Sepp Hochreiter 1991 · Hochreiter & Schmidhuber 1997",
    lead:"Stack many layers, or unroll a recurrent net over many time steps, and the error signal fades to nothing before it reaches the start. A student thesis explained why.",
    formula:"∂L/∂h₀ = ∏ₜ Wᵀ·diag(f′(zₜ)) · ∂L/∂h_T      — a product of many small factors shrinks exponentially",
    what:`Backpropagation multiplies one derivative per layer. If those factors are mostly below 1 (as with
      sigmoid units), the gradient shrinks exponentially with depth; if above 1, it explodes. Either way, deep
      and recurrent nets stop learning. Lab 2 measures the gradient layer by layer.`,
    how:`The LSTM (long short-term memory) adds a memory cell whose content is carried forward by addition,
      with learned gates deciding what to write, keep and read. Because the cell is updated additively, the
      gradient can flow back through hundreds of steps. ReLU activations, careful initialisation and residual
      connections (2015) later solved the same problem for very deep feed-forward nets.`,
    story:`Hochreiter diagnosed the problem in his 1991 diploma thesis, written in German, under Schmidhuber.
      The LSTM paper appeared in 1997 and waited years for its moment; from about 2015 it powered speech
      recognition and Google Translate on billions of devices.`,
    today:`Transformers largely replaced LSTMs for language, but residual connections (the same "carry it
      forward by adding" trick) run through every transformer layer, and recurrent ideas are returning in
      state-space models and xLSTM.` },
  { icon:"💥", title:"2012 — AlexNet, the big bang",
    who:"Alex Krizhevsky, Ilya Sutskever & Geoffrey Hinton · ImageNet challenge",
    lead:"Three ingredients met at once: a huge labelled dataset, gaming GPUs, and a deep CNN with a few new tricks. The error rate dropped so far that the field changed direction within a year.",
    formula:"ImageNet top-5 error:  ~26% (best 2011 method)  →  15.3% (AlexNet, 2012)",
    what:`AlexNet was a CNN with five convolutional and three fully connected layers, about 60 million
      weights, trained on 1.2 million ImageNet photos. It won the 2012 challenge by more than 10 percentage
      points, a margin nobody had seen.`,
    how:`The tricks were mostly engineering: ReLU activations instead of sigmoids, dropout against
      overfitting, data augmentation, and above all training on two NVIDIA GTX 580 gaming cards with CUDA,
      which made the whole thing feasible in about a week.`,
    story:`Krizhevsky wrote the GPU code largely on his own; Hinton's small lab had kept faith in neural
      networks through the lean years. Within months Google bought their company, and computer vision labs
      everywhere switched to deep learning.`,
    today:`This is where the "hardware ignites theory" bridge on the map lands: CUDA (2007) plus backprop
      (1986) plus ImageNet (2009). Every later scaling story repeats the recipe: more data, more compute,
      simpler methods.` },
  { icon:"🧭", title:"Embeddings — meaning as geometry",
    who:"Yoshua Bengio 2003 · Tomas Mikolov et al. (word2vec) 2013",
    lead:"Represent each word as a point in space, arranged so that words used in similar contexts sit close together. Then relationships become directions.",
    formula:"vec(king) − vec(man) + vec(woman)  ≈  vec(queen)",
    what:`An embedding maps each word (or image, or protein) to a list of numbers. Trained to predict
      neighbouring words, word2vec learned vectors where directions carry meaning: the step from "man" to
      "woman" is roughly the step from "king" to "queen". Lab 3 lets you do the arithmetic.`,
    how:`word2vec was deliberately shallow: a single layer trained on billions of words, fast enough to run on a
      laptop. Its success showed that the distributional idea ("you shall know a word by the company it
      keeps", J. R. Firth, 1957) could be learned directly from raw text.`,
    story:`Bengio's 2003 neural language model introduced learned word vectors; Mikolov's 2013 papers made
      them cheap and famous. Researchers soon found the geometry also encoded human biases (such as
      occupation–gender associations), which started a whole subfield on bias in embeddings.`,
    today:`Every language model starts with an embedding table, and vector databases store embeddings to
      search documents by meaning. Retrieval-augmented generation (RAG) is word2vec's idea at a much larger
      scale.` },
  { icon:"🎭", title:"GANs — the forger and the detective",
    who:"Ian Goodfellow et al. · 2014",
    lead:"Train two networks against each other: one makes fakes, the other tries to catch them. Each improves until the fakes are hard to tell from real data.",
    formula:"min_G max_D  E[log D(x)] + E[log(1 − D(G(z)))]",
    what:`A generative adversarial network pairs a generator (turns random noise into, say, an image) with a
      discriminator (guesses real or fake). The generator learns only from the discriminator's feedback, and
      the contest drives both to improve.`,
    how:`GANs are notoriously hard to train: the two players can oscillate, or the generator can "collapse" to
      a few outputs. A decade of tricks (DCGAN, Wasserstein loss, StyleGAN) made them produce strikingly
      realistic faces by 2019.`,
    story:`Goodfellow says he came up with the idea during an argument in a Montreal bar and coded it that
      night. Yann LeCun called adversarial training "the most interesting idea in the last 10 years in ML".
      "Deepfakes" entered the language soon after.`,
    today:`For images, diffusion models have mostly replaced GANs (the map marks GANs 🪦), but adversarial
      losses survive in super-resolution, audio synthesis and as a component of other models.` },
  { icon:"🔭", title:"2017 — the Transformer: attention is all you need",
    who:"Ashish Vaswani, Noam Shazeer, Niki Parmar et al. · Google",
    lead:"Drop recurrence entirely. Let every word look at every other word in one step, weighted by relevance. The result trains in parallel, and it scaled into everything.",
    formula:"Attention(Q, K, V) = softmax(Q·Kᵀ / √d) · V",
    what:`In self-attention, each token asks a question (query), advertises what it contains (key) and offers
      information (value). Each token's new representation is an average of all values, weighted by how well
      its query matches each key. Stack attention with small feed-forward layers and residual connections,
      and you have a transformer. The attention atom lets you play with one head.`,
    how:`Because attention processes the whole sequence at once, it uses GPUs far better than an LSTM, which
      must go step by step. That parallelism is what allowed models to grow from millions to hundreds of
      billions of parameters.`,
    story:`The eight authors were listed in random order with a note that all contributed equally. The paper
      was about machine translation; few guessed it would become the basis of GPT, BERT, AlphaFold 2, image
      models and speech models. Every author later left Google, most to found companies.`,
    today:`Almost every frontier model (language, vision, audio, protein) is a transformer or a close
      relative. Its main weakness, cost that grows with the square of sequence length, drives research into
      state-space models and linear attention.` },
  { icon:"🌫", title:"Diffusion and KANs — physics and mathematics return",
    who:"Sohl-Dickstein et al. 2015 · Ho, Jain & Abbeel 2020 · Liu et al. (KAN) 2024",
    lead:"Diffusion models learn to reverse a process that slowly turns data into noise, borrowing directly from thermodynamics. KANs put a 1957 theorem inside a network.",
    formula:"generate by integrating  dx/dσ = −σ · ∇ₓ log p_σ(x)   from pure noise down to data",
    what:`A diffusion model is trained to remove a little noise at a time. To generate, start from pure noise
      and denoise step by step until an image appears. In Lab 4 the "score" (the direction toward more
      likely data) is computed exactly for a simple shape, so you can watch noise condense into it.`,
    how:`The network learns the score ∇log p at every noise level; generation then follows it downhill, much
      like particles settling in a potential. The approach came from non-equilibrium statistical physics
      (Sohl-Dickstein, 2015) and became practical with DDPM (2020) and latent diffusion (Stable Diffusion,
      2022).`,
    story:`Kolmogorov–Arnold networks (2024) replace fixed activations with learnable one-dimensional
      functions on the edges, inspired by the Kolmogorov–Arnold representation theorem (1957): any
      continuous multivariate function is a sum of compositions of one-variable functions. They are easier to
      interpret, and physicists have adopted them quickly.`,
    today:`Diffusion generates most AI images and video today and is being used for molecules and weather.
      KANs are young and hotly debated, marked 🔥 on the map: promising for scientific modelling (including
      physics-informed variants), unproven at scale.` }
];

const SOURCES = [
  { type:"THE NEOCOGNITRON · 1980", title:"Kunihiko Fukushima — Neocognitron", note:"Stacked convolution and pooling layers: the ancestor of the CNN.", url:"https://doi.org/10.1007/BF00344251" },
  { type:"CNNs + BACKPROP · 1989", title:"LeCun et al. — Backpropagation Applied to Handwritten Zip Code Recognition", note:"The first convolutional network trained end to end with backprop.", url:"https://doi.org/10.1162/neco.1989.1.4.541" },
  { type:"LSTM · 1997", title:"Hochreiter & Schmidhuber — Long Short-Term Memory", note:"Gated memory cells that let gradients flow across long sequences.", url:"https://doi.org/10.1162/neco.1997.9.8.1735" },
  { type:"THE BIG BANG · 2012", title:"Krizhevsky, Sutskever & Hinton — ImageNet Classification with Deep CNNs", note:"AlexNet (republished in CACM 2017).", url:"https://doi.org/10.1145/3065386" },
  { type:"EMBEDDINGS · 2013", title:"Mikolov et al. — Efficient Estimation of Word Representations in Vector Space", note:"word2vec: fast, shallow, and full of geometry.", url:"https://arxiv.org/abs/1301.3781" },
  { type:"GANs · 2014", title:"Goodfellow et al. — Generative Adversarial Networks", note:"The forger-versus-detective game.", url:"https://arxiv.org/abs/1406.2661" },
  { type:"RESIDUALS · 2015", title:"He, Zhang, Ren & Sun — Deep Residual Learning for Image Recognition", note:"Skip connections that let networks go 152 layers deep.", url:"https://arxiv.org/abs/1512.03385" },
  { type:"THE TRANSFORMER · 2017", title:"Vaswani et al. — Attention Is All You Need", note:"Self-attention replaces recurrence; the architecture behind modern AI.", url:"https://arxiv.org/abs/1706.03762" },
  { type:"DIFFUSION · 2015 / 2020", title:"Ho, Jain & Abbeel — Denoising Diffusion Probabilistic Models", note:"The paper that made diffusion practical (roots: Sohl-Dickstein et al. 2015, arXiv 1503.03585).", url:"https://arxiv.org/abs/2006.11239" },
  { type:"KANs · 2024", title:"Liu et al. — KAN: Kolmogorov–Arnold Networks", note:"Learnable activation functions on edges, from a 1957 theorem.", url:"https://arxiv.org/abs/2404.19756" },
  { type:"THE TEXTBOOK · FREE", title:"Goodfellow, Bengio & Courville — Deep Learning", note:"The standard textbook, free to read online.", url:"https://www.deeplearningbook.org/" }
];

/* ------------------------------------------------------------ LAB 1: convolution */
const KERNELS = {
  "vertical edge":[[-1,0,1],[-2,0,2],[-1,0,1]], "horizontal edge":[[-1,-2,-1],[0,0,0],[1,2,1]],
  "blur":[[1,1,1],[1,1,1],[1,1,1]].map(r => r.map(v => v / 9)), "sharpen":[[0,-1,0],[-1,5,-1],[0,-1,0]],
  "diagonal":[[2,-1,-1],[-1,2,-1],[-1,-1,2]]
};
function conv(img, k) {
  const n = img.length, m = n - 2, out = [];
  for (let i = 0; i < m; i++) { out.push([]); for (let j = 0; j < m; j++) { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += img[i + a][j + b] * k[a][b]; out[i].push(s); } }
  return out;
}
function pool(fm) { const out = []; for (let i = 0; i + 1 < fm.length; i += 2) { out.push([]); for (let j = 0; j + 1 < fm.length; j += 2) out[out.length - 1].push(Math.max(fm[i][j], fm[i + 1][j], fm[i][j + 1], fm[i + 1][j + 1])); } return out; }
const convLab = {
  kicker:"CNNs · FILTERS THAT SLIDE", title:"Draw something, then convolve, rectify and pool it",
  intro:`Paint on the 12×12 input (click and drag). A 3×3 kernel slides over every position and produces the 10×10 feature map: bright where the patch matches the filter. ReLU keeps only positive responses, and 2×2 max-pooling shrinks the map to 5×5. Change the kernel to see what each one "looks for".`,
  html:`<div class="gk-chips" data-role="k">${Object.keys(KERNELS).map((k, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-k="${k}">${k}</button>`).join("")}</div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><label class="it-check"><input type="checkbox" data-role="relu" checked> apply ReLU</label>
      <button class="gk-ghost" data-a="clear">clear</button><button class="gk-ghost" data-a="demo">draw a 7</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`In a trained CNN nobody chooses these kernels: backpropagation learns them. The first layer of almost every image network ends up with edge and colour-blob detectors much like these.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'), N = 12;
    let img = Array.from({ length:N }, () => Array(N).fill(0)), kname = "vertical edge", painting = 0;
    const demo = () => { img = Array.from({ length:N }, () => Array(N).fill(0)); for (let j = 2; j < 10; j++) img[2][j] = 1; for (let i = 3; i < 11; i++) img[i][Math.round(9 - (i - 3) * 0.7)] = 1; img[6][4] = img[6][5] = img[6][6] = 1; };
    demo();
    let geo = null;
    function draw() {
      const k = KERNELS[kname], relu = q('[data-role="relu"]').checked;
      let fm = conv(img, k); if (relu) fm = fm.map(r => r.map(v => Math.max(0, v)));
      const pm = pool(fm);
      const { ctx, w:W, h:H } = canvas(cv, 190);
      ctx.clearRect(0, 0, W, H);
      const cell = Math.min((W - 30) / (N + 10 + 10), 13), gap = 12, y0 = 22;
      const x1 = 6, x2 = x1 + N * cell + gap, x3 = x2 + 10 * cell + gap;
      geo = { x1, y0, cell };
      const mx = Math.max(1e-9, ...fm.flat().map(Math.abs)), pmx = Math.max(1e-9, ...pm.flat().map(Math.abs));
      ctx.font = "10px IBM Plex Mono, monospace"; ctx.fillStyle = C.dim;
      ctx.fillText("input 12×12", x1, 12); ctx.fillText("feature map 10×10", x2, 12); ctx.fillText("pooled 5×5", x3, 12);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ctx.fillStyle = img[i][j] ? C.gold : "rgba(255,255,255,.05)"; ctx.fillRect(x1 + j * cell, y0 + i * cell, cell - 1, cell - 1); }
      const shade = (v, m) => v >= 0 ? `rgba(63,208,201,${(v / m).toFixed(3)})` : `rgba(255,120,71,${(-v / m).toFixed(3)})`;
      fm.forEach((r, i) => r.forEach((v, j) => { ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fillRect(x2 + j * cell, y0 + i * cell, cell - 1, cell - 1); ctx.fillStyle = shade(v, mx); ctx.fillRect(x2 + j * cell, y0 + i * cell, cell - 1, cell - 1); }));
      const pc = cell * 2;
      pm.forEach((r, i) => r.forEach((v, j) => { ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fillRect(x3 + j * pc, y0 + i * pc, pc - 1, pc - 1); ctx.fillStyle = shade(v, pmx); ctx.fillRect(x3 + j * pc, y0 + i * pc, pc - 1, pc - 1); }));
      q('[data-role="out"]').innerHTML = `kernel "${kname}":\n` + k.map(r => r.map(v => (v >= 0 ? " " : "") + v.toFixed(2)).join("  ")).join("\n") +
        `\n<span class="d">teal = strong positive match · orange = negative${relu ? " (removed by ReLU)" : ""}</span>\nweights in this layer: <span class="g">9</span>, whatever the image size`;
    }
    function paintAt(e) {
      if (!geo) return; const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      const j = Math.floor((x - geo.x1) / geo.cell), i = Math.floor((y - geo.y0) / geo.cell);
      if (i >= 0 && i < N && j >= 0 && j < N) { img[i][j] = painting > 0 ? 1 : 0; draw(); }
    }
    cv.addEventListener("pointerdown", e => { if (!geo) return; const b = cv.getBoundingClientRect(); const j = Math.floor((e.clientX - b.left - geo.x1) / geo.cell), i = Math.floor((e.clientY - b.top - geo.y0) / geo.cell);
      painting = (i >= 0 && i < N && j >= 0 && j < N && img[i][j]) ? -1 : 1; paintAt(e); });
    cv.addEventListener("pointermove", e => { if (painting) paintAt(e); });
    addEventListener("pointerup", () => { painting = 0; });
    root.querySelectorAll('[data-role="k"] .gk-chip').forEach(b => b.addEventListener("click", () => { kname = b.dataset.k; root.querySelectorAll('[data-role="k"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    q('[data-role="relu"]').addEventListener("change", draw);
    q('[data-a="clear"]').addEventListener("click", () => { img = Array.from({ length:N }, () => Array(N).fill(0)); draw(); });
    q('[data-a="demo"]').addEventListener("click", () => { demo(); draw(); });
    draw();
  }
};

/* ---------------------------------------------------- LAB 2: vanishing gradients */
function gradFlow(depth, act, residual, seed) {
  const r = rng(seed), W = 24, layers = [];
  const f = { sigmoid:z => 1 / (1 + Math.exp(-z)), tanh:Math.tanh, relu:z => Math.max(0, z) }[act];
  const fp = { sigmoid:z => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }, tanh:z => 1 - Math.tanh(z) ** 2, relu:z => z > 0 ? 1 : 0 }[act];
  const gain = act === "relu" ? 2 : 1;
  let h = Array.from({ length:W }, () => gauss(r));
  for (let l = 0; l < depth; l++) {
    const M = Array.from({ length:W }, () => Array.from({ length:W }, () => gauss(r) * Math.sqrt(gain / W)));
    const z = M.map(row => row.reduce((a, v, j) => a + v * h[j], 0));
    const out = z.map((v, i) => f(v) + (residual ? h[i] : 0));
    layers.push({ M, z }); h = residual ? out.map(v => v / Math.SQRT2) : out;
  }
  let g = Array.from({ length:W }, () => gauss(r)); const n0 = Math.hypot(...g); g = g.map(v => v / n0);
  const norms = [];
  for (let l = depth - 1; l >= 0; l--) {
    const { M, z } = layers[l];
    const gz = g.map((v, i) => v * fp(z[i]));
    let gh = Array.from({ length:W }, (_, j) => M.reduce((a, row, i) => a + row[j] * gz[i], 0));
    if (residual) gh = gh.map((v, i) => (v + g[i]) / Math.SQRT2);
    g = gh; norms.unshift(Math.hypot(...g));
  }
  return norms;
}
const gradLab = {
  kicker:"WHY DEPTH WAS HARD", title:"Send a gradient backwards through a deep random network",
  intro:`This builds a real random network (width 24, standard initialisation) and backpropagates a unit-sized error from the top. Each bar is the gradient's size at that layer, on a log scale. With sigmoid units it vanishes long before the bottom layers. Switch to ReLU, or add residual connections, and it survives.`,
  html:`<div class="it-control"><label><span>depth (layers)</span><output data-o="d">30</output></label><input type="range" data-i="d" min="2" max="60" step="1" value="30"></div>
    <div class="gk-chips" data-role="act"><button class="gk-chip on" data-v="sigmoid">sigmoid</button><button class="gk-chip" data-v="tanh">tanh</button><button class="gk-chip" data-v="relu">ReLU</button></div>
    <div class="it-lab-actions"><label class="it-check"><input type="checkbox" data-role="res"> residual connections (x + f(x))</label><button class="gk-ghost" data-a="seed">new random network</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Sigmoid's derivative is at most 0.25, so every layer can shrink the signal. That single fact explains a decade of failed attempts to train deep nets, and why ReLU, careful initialisation, LSTM gates and residual connections mattered so much.`,
  init(root) {
    const q = s => root.querySelector(s); let act = "sigmoid", seed = 11;
    function draw() {
      const depth = +q('[data-i="d"]').value, res = q('[data-role="res"]').checked;
      q('[data-o="d"]').textContent = depth;
      const norms = gradFlow(depth, act, res, seed);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 170);
      ctx.clearRect(0, 0, W, H);
      const lg = norms.map(v => Math.log10(Math.max(v, 1e-30))), lo = -12, hi = 2, bw = (W - 44) / norms.length;
      const yv = v => H - 18 - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (H - 30);
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace";
      for (let e = lo; e <= hi; e += 2) { ctx.beginPath(); ctx.moveTo(34, yv(e)); ctx.lineTo(W, yv(e)); ctx.stroke(); ctx.fillText("1e" + e, 2, yv(e) + 3); }
      lg.forEach((v, i) => { ctx.fillStyle = v < -4 ? C.red : v < -1.5 ? C.gold : C.teal; const y = yv(v); ctx.fillRect(38 + i * bw, y, Math.max(1, bw - 1.5), H - 18 - y); });
      ctx.fillStyle = C.dim; ctx.fillText("layer 1 (input side)", 38, H - 4); ctx.textAlign = "right"; ctx.fillText(`layer ${depth} (output)`, W - 2, H - 4); ctx.textAlign = "left";
      const ratio = norms[0] / norms[norms.length - 1];
      q('[data-role="out"]').innerHTML = `gradient size at layer 1: <span class="${norms[0] < 1e-4 ? "r" : "t"}">${norms[0].toExponential(2)}</span>   at layer ${depth}: ${norms[norms.length - 1].toExponential(2)}\n` +
        `the first layer's updates are <span class="g">${ratio < 1 ? (1 / ratio).toExponential(1) + "× smaller" : ratio.toExponential(1) + "× larger"}</span> than the last layer's\n` +
        (norms[0] < 1e-6 ? `<span class="r">vanished: the early layers effectively stop learning</span>` : `<span class="t">the signal reaches the bottom layers</span>`);
    }
    q('[data-i="d"]').addEventListener("input", draw); q('[data-role="res"]').addEventListener("change", draw);
    q('[data-a="seed"]').addEventListener("click", () => { seed++; draw(); });
    root.querySelectorAll('[data-role="act"] .gk-chip').forEach(b => b.addEventListener("click", () => { act = b.dataset.v; root.querySelectorAll('[data-role="act"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    draw();
  }
};

/* ------------------------------------------------------ LAB 3: word arithmetic */
// dims: royal, male(+)/female(−), young, person, plural, capital, France, Italy, Japan, Germany, cat, dog
const V = {
  king:[1,1,0,1,0,0,0,0,0,0,0,0], queen:[1,-1,0,1,0,0,0,0,0,0,0,0], man:[0,1,0,1,0,0,0,0,0,0,0,0], woman:[0,-1,0,1,0,0,0,0,0,0,0,0],
  prince:[1,1,1,1,0,0,0,0,0,0,0,0], princess:[1,-1,1,1,0,0,0,0,0,0,0,0], boy:[0,1,1,1,0,0,0,0,0,0,0,0], girl:[0,-1,1,1,0,0,0,0,0,0,0,0],
  paris:[0,0,0,0,0,1,1,0,0,0,0,0], france:[0,0,0,0,0,0,1,0,0,0,0,0], rome:[0,0,0,0,0,1,0,1,0,0,0,0], italy:[0,0,0,0,0,0,0,1,0,0,0,0],
  tokyo:[0,0,0,0,0,1,0,0,1,0,0,0], japan:[0,0,0,0,0,0,0,0,1,0,0,0], berlin:[0,0,0,0,0,1,0,0,0,1,0,0], germany:[0,0,0,0,0,0,0,0,0,1,0,0],
  cat:[0,0,0,0,0,0,0,0,0,0,1,0], cats:[0,0,0,0,1,0,0,0,0,0,1,0], dog:[0,0,0,0,0,0,0,0,0,0,0,1], dogs:[0,0,0,0,1,0,0,0,0,0,0,1],
  kitten:[0,0,1,0,0,0,0,0,0,0,1,0], puppy:[0,0,1,0,0,0,0,0,0,0,0,1]
};
(function jitter() { const r = rng(5); for (const k in V) V[k] = V[k].map(v => v + (r() - .5) * 0.18); })();
const cos = (a, b) => { let d = 0, na = 0, nb = 0; for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } return d / Math.sqrt(na * nb); };
function pca2(vecs) {
  const n = vecs.length, dim = vecs[0].length, mean = Array(dim).fill(0);
  vecs.forEach(v => v.forEach((x, i) => mean[i] += x / n));
  const X = vecs.map(v => v.map((x, i) => x - mean[i])), comps = [];
  for (let c = 0; c < 2; c++) {
    let u = Array.from({ length:dim }, (_, i) => Math.sin(i * 1.7 + c * 3.1) + 0.3);
    for (let it = 0; it < 80; it++) {
      const s = X.map(x => x.reduce((a, v, i) => a + v * u[i], 0));
      let nu = Array(dim).fill(0); X.forEach((x, k) => x.forEach((v, i) => nu[i] += v * s[k]));
      comps.forEach(p => { const d = nu.reduce((a, v, i) => a + v * p[i], 0); nu = nu.map((v, i) => v - d * p[i]); });
      const nn = Math.hypot(...nu) || 1; u = nu.map(v => v / nn);
    }
    comps.push(u);
  }
  return { proj:v => comps.map(p => v.reduce((a, x, i) => a + (x - mean[i]) * p[i], 0)) };
}
const PRESETS = [["king","man","woman"],["paris","france","italy"],["tokyo","japan","germany"],["cats","cat","dog"],["prince","boy","girl"],["puppy","dog","cat"]];
const w2vLab = {
  kicker:"EMBEDDINGS · MEANING AS GEOMETRY", title:"king − man + woman = ?",
  intro:`Each word is a point in a 12-dimensional space. Pick an analogy "A is to B as ? is to C": the lab computes A − B + C and finds the nearest word by cosine similarity (leaving out A, B and C, as the word2vec evaluation did). The plot projects all the words onto their two main directions.`,
  html:`<div class="gk-chips" data-role="pre">${PRESETS.map((p, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-i="${i}">${p[0]} − ${p[1]} + ${p[2]}</button>`).join("")}</div>
    <div class="gk-row">${["a","b","c"].map((k, i) => `<select class="gk-select" data-s="${k}">${Object.keys(V).map(w => `<option>${w}</option>`).join("")}</select>${i < 2 ? `<span class="gk-pill">${i === 0 ? "−" : "+"}</span>` : ""}`).join("")}</div>
    <div class="gk-out" data-role="out"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>`,
  caveat:`Honest note: these 22 vectors are hand-built with interpretable dimensions (royal, gender, capital city…) so the lab runs instantly. Real word2vec learns 300 unnamed dimensions from billions of words, and its analogies are messier; the arithmetic is the same.`,
  init(root) {
    const q = s => root.querySelector(s); const P = pca2(Object.values(V));
    const set = p => { ["a","b","c"].forEach((k, i) => q(`[data-s="${k}"]`).value = p[i]); };
    function run() {
      const a = q('[data-s="a"]').value, b = q('[data-s="b"]').value, c = q('[data-s="c"]').value;
      const t = V[a].map((v, i) => v - V[b][i] + V[c][i]);
      const ranked = Object.keys(V).filter(w => ![a, b, c].includes(w)).map(w => [w, cos(t, V[w])]).sort((x, y) => y[1] - x[1]);
      q('[data-role="out"]').innerHTML = `${a} − ${b} + ${c}  ≈  <span class="g">${ranked[0][0]}</span>\n` +
        ranked.slice(0, 4).map(([w, s], i) => `${i + 1}. ${w.padEnd(9)} cosine ${s.toFixed(3)}`).join("\n");
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 220);
      ctx.clearRect(0, 0, W, H);
      const pts = Object.keys(V).map(w => [w, P.proj(V[w])]); const tp = P.proj(t);
      const xs = pts.map(p => p[1][0]).concat(tp[0]), ys = pts.map(p => p[1][1]).concat(tp[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const sx = x => 20 + (x - x0) / (x1 - x0 || 1) * (W - 70), sy = y => 14 + (1 - (y - y0) / (y1 - y0 || 1)) * (H - 28);
      const pos = w => pts.find(p => p[0] === w)[1];
      ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(245,196,81,.55)"; ctx.lineWidth = 1.2;
      [[a, b], [c, ranked[0][0]]].forEach(([u, v]) => { ctx.beginPath(); ctx.moveTo(sx(pos(u)[0]), sy(pos(u)[1])); ctx.lineTo(sx(pos(v)[0]), sy(pos(v)[1])); ctx.stroke(); });
      ctx.setLineDash([]);
      ctx.font = "10px IBM Plex Mono, monospace";
      pts.forEach(([w, p]) => { const hot = [a, b, c].includes(w), ans = w === ranked[0][0];
        ctx.fillStyle = ans ? C.gold : hot ? C.teal : "rgba(232,228,244,.45)"; ctx.beginPath(); ctx.arc(sx(p[0]), sy(p[1]), ans || hot ? 4 : 2.6, 0, 7); ctx.fill();
        ctx.fillText(w, sx(p[0]) + 5, sy(p[1]) + 3); });
      ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.arc(sx(tp[0]), sy(tp[1]), 7, 0, 7); ctx.stroke();
    }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(bt => bt.addEventListener("click", () => { set(PRESETS[+bt.dataset.i]); root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.toggle("on", x === bt)); run(); }));
    root.querySelectorAll("select").forEach(s => s.addEventListener("change", () => { root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.remove("on")); run(); }));
    set(PRESETS[0]); run();
  }
};

/* ------------------------------------------------------------ LAB 4: diffusion */
function shapePoints(kind) {
  const pts = [];
  if (kind === "heart") for (let i = 0; i < 70; i++) { const t = i / 70 * Math.PI * 2; pts.push([16 * Math.sin(t) ** 3 / 17, (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17]); }
  else if (kind === "spiral") for (let i = 0; i < 70; i++) { const t = i / 70 * 3.2 * Math.PI, r = .12 + t / (3.2 * Math.PI) * .85; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
  else { const ring = (cx, cy, r, n) => { for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } }; ring(0, 0, .9, 40); ring(-.33, .28, .1, 10); ring(.33, .28, .1, 10); for (let i = 0; i < 14; i++) { const t = Math.PI * (1.15 + i / 14 * .7); pts.push([.5 * Math.cos(t), .05 + .5 * Math.sin(t)]); } }
  return pts;
}
function score(x, y, mus, s2) {
  let mx = -Infinity; const lw = mus.map(([a, b]) => { const v = -((x - a) ** 2 + (y - b) ** 2) / (2 * s2); if (v > mx) mx = v; return v; });
  let Z = 0, gx = 0, gy = 0;
  lw.forEach((v, k) => { const w = Math.exp(v - mx); Z += w; gx += w * (mus[k][0] - x); gy += w * (mus[k][1] - y); });
  return [gx / Z / s2, gy / Z / s2];
}
const diffLab = {
  kicker:"DIFFUSION · IMAGES FROM NOISE", title:"Watch noise condense into a shape",
  intro:`"Add noise" blurs the data into a cloud, the way training data is corrupted. "Denoise" starts 500 particles from pure noise and moves each one along the score ∇log p (the direction toward more likely data), a little at a time as the noise level σ falls. Here the score is computed exactly for the target shape; in a real model a neural network learns it.`,
  html:`<div class="gk-chips" data-role="shape"><button class="gk-chip on" data-v="heart">heart</button><button class="gk-chip" data-v="spiral">spiral</button><button class="gk-chip" data-v="face">face</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="rev">▶ denoise from pure noise</button><button class="it-send" data-a="fwd">add noise</button>
      <label class="it-check"><input type="checkbox" data-role="stoch"> stochastic sampler (adds fresh noise each step)</label></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Real image models do this in a space of millions of pixels (or a compressed "latent" space), with a network trained to predict the noise at every level. The sampler is the same idea: start from static and follow the learned score home.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]');
    let kind = "heart", mus = shapePoints(kind), parts = [], timer = null, sigma = 0.02; const s0 = 0.035, SMAX = 1.6, r = rng(21);
    const reset = () => { parts = Array.from({ length:500 }, (_, i) => { const m = mus[i % mus.length]; return [m[0] + gauss(r) * s0, m[1] + gauss(r) * s0]; }); sigma = 0; };
    function draw(msg) {
      const { ctx, w:W, h:H } = canvas(cv, 240); ctx.clearRect(0, 0, W, H);
      const S = Math.min(W, H) / 3.6, sx = x => W / 2 + x * S, sy = y => H / 2 - y * S;
      ctx.fillStyle = "rgba(245,196,81,.12)"; mus.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(sx(x), sy(y), 5, 0, 7); ctx.fill(); });
      ctx.fillStyle = C.teal; parts.forEach(([x, y]) => ctx.fillRect(sx(x) - 1, sy(y) - 1, 2.2, 2.2));
      q('[data-role="out"]').innerHTML = (msg ? msg + "\n" : "") + `noise level σ = <span class="g">${sigma.toFixed(3)}</span>`;
    }
    function forward() {
      clearInterval(timer); reset(); const base = parts.map(p => p.slice()), eps = parts.map(() => [gauss(r), gauss(r)]); let k = 0;
      timer = setInterval(() => { k++; sigma = SMAX * (k / 40) ** 1.5; parts = base.map((p, i) => [p[0] + sigma * eps[i][0], p[1] + sigma * eps[i][1]]); draw("forward process: data → noise"); if (k >= 40) clearInterval(timer); }, 45);
    }
    function reverse() {
      clearInterval(timer); const steps = 70, stoch = q('[data-role="stoch"]').checked;
      parts = Array.from({ length:500 }, () => [gauss(r) * SMAX, gauss(r) * SMAX]);
      const sig = i => SMAX * Math.pow(0.01 / SMAX, i / steps); let i = 0;
      timer = setInterval(() => {
        const a = sig(i), b = sig(i + 1), s2 = s0 * s0 + a * a;
        parts = parts.map(([x, y]) => { const [gx, gy] = score(x, y, mus, s2);
          if (!stoch) { const d = (a * a - b * b) / 2; return [x + d * gx, y + d * gy]; }
          const d = a * a - b * b, n = Math.sqrt(Math.max(0, d)); return [x + d * gx + n * gauss(r), y + d * gy + n * gauss(r)]; });
        sigma = b; i++; draw(`reverse process, step ${i}/${steps}${stoch ? " (stochastic)" : " (deterministic ODE)"}`);
        if (i >= steps) { clearInterval(timer); draw(`done: ${steps} small denoising steps turned static into the ${kind}`); }
      }, 40);
    }
    root.querySelectorAll('[data-role="shape"] .gk-chip').forEach(b => b.addEventListener("click", () => { clearInterval(timer); kind = b.dataset.v; mus = shapePoints(kind); root.querySelectorAll('[data-role="shape"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); reset(); draw("target shape: " + kind); }));
    q('[data-a="rev"]').addEventListener("click", reverse); q('[data-a="fwd"]').addEventListener("click", forward);
    reset(); draw("clean data");
  }
};

register("deep", {
  kicker:"DEEP LEARNING ARCHITECTURES · 1980–NOW · ABOUT 60 MIN",
  hook:"In 2012 two gaming graphics cards trained a network that cut the ImageNet error rate by almost half. Everything in today's AI grew from the architectures in this field.",
  intro:`An architecture is the shape of a network: which neurons connect to which, and how information flows. Each breakthrough here solved a specific problem. Convolution handled images, gated memory handled long sequences, residual connections allowed depth, attention allowed parallel training at scale, and diffusion made generation stable. Four labs below: convolve a drawing, watch gradients vanish and then survive, do arithmetic with word vectors, and pull a shape out of pure noise.`,
  timeline:[[1980, "Neocognitron"], [1997, "LSTM"], [2012, "AlexNet"], [2013, "word2vec"], [2017, "Transformer"], [2020, "diffusion"]],
  labs:[convLab, gradLab, w2vLab, diffLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, draw a vertical bar and switch between the vertical-edge and horizontal-edge kernels. The same image lights up completely differently: each filter asks one question.",
    "In Lab 2, set depth to 60 with sigmoid: the first layer's gradient is many orders of magnitude smaller than the last. Tick 'residual connections' and watch it recover.",
    "In Lab 3, try tokyo − japan + germany, then build your own: kitten − cat + dog.",
    "In Lab 4, denoise with the deterministic sampler, then again with the stochastic one. Both reach the shape; the stochastic one gives a slightly different sample each time.",
    "Open the attention atom from the ⚛ button and compare it with the Transformer chapter: softmax(QKᵀ/√d)·V is the whole mechanism.",
    "Read the ResNet abstract in the sources and connect it to Lab 2: 'x + f(x)' is the trick that made 152 layers trainable."
  ],
  sources:SOURCES
});
})();
