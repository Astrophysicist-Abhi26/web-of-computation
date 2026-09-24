// THE LLM ERA — 2017 to now: next-token prediction at scale, scaling laws,
// in-context learning, RLHF, Constitutional AI, interpretability and the
// Bitter Lesson. Four real labs: a byte-pair-encoding tokenizer trained live,
// an n-gram next-token sampler with temperature (Shannon's 1948 experiment),
// the Chinchilla scaling-law calculator with the published fit, and a
// Bradley–Terry reward model learned from your own preferences.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CORPUS = `the machine reads the text and learns to predict the next word . the next word depends on the words before it . a model that predicts the next word well must learn grammar , facts and a little reasoning . the bigger the model and the more text it reads , the better it predicts . people once thought the machine could never learn language from text alone . then the models grew , and the predictions became answers . the answers became conversations , and the conversations became tools . the model does not read the way we read ; it counts , compares and predicts . yet prediction , done well enough , looks a lot like understanding . the question of what the model understands is still open .`;

const CHAPTERS = [
  { icon:"🔮", title:"Predict the next word — the task that turned out to contain everything",
    who:"Shannon 1948 · Bengio 2003 · Radford et al. (GPT) 2018–2019",
    lead:"Train a transformer to guess the next token of internet text, and to get good at it the model has to pick up spelling, grammar, facts and a surprising amount of reasoning.",
    formula:"maximise  Σₜ log p(tokenₜ | token₁ … tokenₜ₋₁)      — cross-entropy, i.e. Shannon's information measure",
    what:`A language model assigns a probability to every possible next token given everything so far.
      Generation is repeated sampling: pick a token, append it, predict again. Lab 2 builds the simplest such
      model, counting which word follows which, exactly as Claude Shannon did by hand in 1948.`,
    how:`GPT-1 (2018) showed that pre-training a transformer on raw text and then fine-tuning it beat
      task-specific models. GPT-2 (2019) showed that a bigger model, with no fine-tuning, could translate,
      summarise and answer questions just from how the prompt was phrased. Text is first split into tokens
      (Lab 1): common words become one token, rare words several.`,
    story:`OpenAI initially withheld the full GPT-2 over misuse concerns, releasing it in stages. That staged
      release started today's debates about publishing powerful models. The loss being minimised is
      cross-entropy, which is Shannon's 1948 information measure, as the gold bridge on the map notes.`,
    today:`Every chat assistant, including the one that helped build this map, is at its core a next-token
      predictor, trained further to be helpful. The surprise of the decade is how much capability that one
      objective contains.` },
  { icon:"📈", title:"Scaling laws — loss is a power law",
    who:"Kaplan et al. 2020 · Hoffmann et al. (Chinchilla) 2022",
    lead:"Plot a model's loss against the compute used to train it and you get a straight line on log–log axes, across many orders of magnitude. That made progress predictable, and fundable.",
    formula:"L(N, D) = E + A/N^α + B/D^β      compute C ≈ 6·N·D      (published Chinchilla fit: E=1.69, A=406.4, B=410.7, α=0.34, β=0.28)",
    what:`Loss falls smoothly and predictably as you add parameters (N), training tokens (D) and compute (C).
      Kaplan et al. measured the power laws in 2020. Two years later the Chinchilla paper found that most
      large models were "under-trained": for a fixed compute budget you should grow data as fast as
      parameters, roughly 20 tokens per parameter. Explore it in Lab 3.`,
    how:`The rule of thumb C ≈ 6ND counts the multiply-adds in one forward and backward pass per token. Fit
      L(N, D) to many small training runs, then extrapolate to decide how big to make the next model and how
      much data it needs, before spending millions of dollars on it.`,
    story:`Chinchilla (70B parameters, 1.4 trillion tokens) matched or beat Gopher (280B parameters) using the
      same compute. Labs changed their training plans almost overnight. Scaling laws turned AI progress into a
      question of capital and power stations.`,
    today:`Newer work adds a third axis: scaling test-time compute (letting a model "think longer") also follows
      smooth curves. The open question is whether the curves keep going as high-quality text runs out.` },
  { icon:"💬", title:"GPT-3 to ChatGPT — in-context learning and the public big bang",
    who:"Brown et al. 2020 · ChatGPT, 30 November 2022",
    lead:"A big enough model can learn a new task from a few examples placed in its prompt, with no retraining. Then a chat interface put that ability in front of a hundred million people.",
    formula:"prompt = [instruction] + [example₁ … exampleₖ] + [new input]  →  the model continues the pattern",
    what:`GPT-3 (175 billion parameters) showed "in-context learning": show it a few examples of a task in the
      prompt and it performs the task on a new input. Nobody designed this ability; it appeared with scale.`,
    how:`ChatGPT was GPT-3.5 fine-tuned to follow instructions and hold a conversation, using the RLHF
      method in the next chapter. The underlying capabilities already existed; the training for helpfulness
      and the simple chat box made them usable by anyone.`,
    story:`ChatGPT was released as a "low-key research preview" and reached an estimated 100 million users in
      about two months, then the fastest adoption of any consumer application. It set off an industry-wide
      race.`,
    today:`Language models now write code, tutor students, draft documents and act as agents that use tools.
      Whether scaling alone gets them all the way to general intelligence is the most argued question in the
      field.` },
  { icon:"🎯", title:"RLHF — from predictor to assistant",
    who:"Christiano et al. 2017 · Ouyang et al. (InstructGPT) 2022",
    lead:"A raw language model continues text; it doesn't try to help. Reinforcement learning from human feedback trains it toward the answers people prefer.",
    formula:"reward model:  P(A ≻ B) = σ(r(A) − r(B))      then optimise the policy for high r, staying close to the original model",
    what:`People compare pairs of model answers and pick the better one. A reward model learns to predict
      those preferences, and the language model is then trained with reinforcement learning to produce answers
      the reward model scores highly. Lab 4 lets you be the human and watch a tiny reward model learn your
      taste.`,
    how:`The comparison model is the Bradley–Terry model from 1952 statistics (used for ranking chess players
      too). A penalty keeps the tuned model close to the original so it does not find strange text that
      exploits flaws in the reward model, a failure called reward hacking.`,
    story:`The 2017 paper taught a simulated robot to do a backflip from about 900 human comparisons, where
      writing the reward by hand was hard. InstructGPT (2022) applied the same recipe to language: a
      1.3-billion-parameter tuned model was preferred over the raw 175-billion one.`,
    today:`Variants (DPO, RLAIF, reasoning RL with verifiable rewards) are now standard. Every major assistant
      is shaped by some form of preference training.` },
  { icon:"📜", title:"Constitutional AI — feedback from principles",
    who:"Bai et al. (Anthropic) · 2022",
    lead:"Instead of collecting human labels for every harmful example, write down a short list of principles and have the model critique and revise its own answers against them.",
    formula:"answer → self-critique against a principle → revision → train on revisions;  then RL from AI preferences (RLAIF)",
    what:`Constitutional AI trains a model to be harmless using a written set of principles (the
      "constitution"). The model drafts an answer, critiques it against a principle, rewrites it, and learns
      from the revised answers. A second stage uses AI-generated comparisons instead of human ones.`,
    how:`Making the principles explicit means the values being trained in can be read, debated and changed,
      rather than being implicit in thousands of individual rater judgements. It also reduces how much
      harmful material human raters must read.`,
    story:`The method came from Anthropic, the company founded in 2021 by Dario Amodei and colleagues who left
      OpenAI. The map's pioneer gallery covers them. The model that helped write this site belongs to this
      lineage.`,
    today:`Published constitutions, model specifications and AI-feedback training are now used across the
      industry, and the question "whose values?" has become a public policy debate.` },
  { icon:"🔬", title:"Interpretability — opening the black box",
    who:"Olah et al. (circuits) 2020 · Elhage et al. 2021 · Bricken et al. (monosemanticity) 2023",
    lead:"If we are going to rely on these systems, we should be able to read what is going on inside them. Mechanistic interpretability tries to reverse-engineer networks, feature by feature.",
    formula:"activation ≈ Σᵢ fᵢ · dᵢ      — sparse autoencoders split neurons into many interpretable 'features'",
    what:`Researchers found "circuits" in vision networks (curve detectors built from edge detectors) and in
      transformers (induction heads that copy patterns, a mechanism behind in-context learning). Individual
      neurons are often "polysemantic", responding to unrelated things, because networks pack more concepts
      than they have neurons.`,
    how:`Sparse autoencoders re-express a layer's activations as a sum of many more features, only a few of which
      are active at once. The features often turn out to be interpretable ("the Golden Gate Bridge", "code with
      a security bug"), and turning one up or down changes the model's behaviour in the expected way.`,
    story:`Chris Olah built much of this field from a blog and the Distill journal, without a university
      degree. In 2024 Anthropic's "Golden Gate Claude", with one feature amplified, brought the Golden Gate
      Bridge into nearly every answer. It became the field's most memorable demonstration.`,
    today:`Interpretability is marked 🔥: young, fast-moving and important for safety. Whether it can scale to
      fully explain frontier models is one of the field's biggest open questions.` },
  { icon:"🍋", title:"The Bitter Lesson",
    who:"Richard Sutton · March 2019",
    lead:"Seventy years of AI history, compressed into one uncomfortable essay: general methods that scale with computation beat methods that build in human knowledge, every time.",
    formula:"search + learning, scaled with compute  ≫  hand-crafted knowledge   (chess 1997, Go 2016, speech, vision, language)",
    what:`Sutton observed that researchers repeatedly build their understanding of a domain into their systems.
      This helps at first, then plateaus, and is eventually overtaken by simpler methods that make better use
      of more computation. Chess, Go, speech recognition, vision and now language all followed this pattern.`,
    how:`The lesson is "bitter" because it says our cleverness is less valuable than we hope. The winning
      methods (search and learning) are the ones that keep improving automatically as computers get faster.`,
    story:`The essay is barely a page long and became the unofficial creed of the scaling era. Critics respond
      that data, architecture and human feedback are themselves built-in knowledge, and that scaling hits
      physical and economic limits.`,
    today:`The map marks the Bitter Lesson 🏛 foundational. Whether it holds all the way to general
      intelligence, or bends as data and energy become scarce, is being tested right now.` }
];

const SOURCES = [
  { type:"GPT-1 · 2018", title:"Radford et al. — Improving Language Understanding by Generative Pre-Training", note:"Pre-train a transformer on raw text, then fine-tune.", url:"https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
  { type:"GPT-2 · 2019", title:"Radford et al. — Language Models are Unsupervised Multitask Learners", note:"Scale alone produces zero-shot abilities.", url:"https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf" },
  { type:"GPT-3 · 2020", title:"Brown et al. — Language Models are Few-Shot Learners", note:"175B parameters and in-context learning.", url:"https://arxiv.org/abs/2005.14165" },
  { type:"SCALING LAWS · 2020", title:"Kaplan et al. — Scaling Laws for Neural Language Models", note:"Loss as a power law in parameters, data and compute.", url:"https://arxiv.org/abs/2001.08361" },
  { type:"CHINCHILLA · 2022", title:"Hoffmann et al. — Training Compute-Optimal Large Language Models", note:"About 20 tokens per parameter; the fit used in Lab 3.", url:"https://arxiv.org/abs/2203.15556" },
  { type:"RLHF · 2017", title:"Christiano et al. — Deep Reinforcement Learning from Human Preferences", note:"Learning a reward from pairwise human comparisons.", url:"https://arxiv.org/abs/1706.03741" },
  { type:"INSTRUCTGPT · 2022", title:"Ouyang et al. — Training Language Models to Follow Instructions with Human Feedback", note:"The recipe behind ChatGPT.", url:"https://arxiv.org/abs/2203.02155" },
  { type:"CONSTITUTIONAL AI · 2022", title:"Bai et al. — Constitutional AI: Harmlessness from AI Feedback", note:"Training against written principles, with AI-generated feedback.", url:"https://arxiv.org/abs/2212.08073" },
  { type:"INTERPRETABILITY · 2023", title:"Bricken et al. — Towards Monosemanticity", note:"Sparse autoencoders pull interpretable features out of a transformer.", url:"https://transformer-circuits.pub/2023/monosemantic-features/index.html" },
  { type:"TOKENIZATION · 2015", title:"Sennrich, Haddow & Birch — Neural Machine Translation of Rare Words with Subword Units", note:"Byte-pair encoding for text: the tokenizer in Lab 1.", url:"https://arxiv.org/abs/1508.07909" },
  { type:"ESSAY · 2019", title:"Richard Sutton — The Bitter Lesson", note:"General methods plus compute win.", url:"http://www.incompleteideas.net/IncIdeas/BitterLesson.html" }
];

/* -------------------------------------------------------------- LAB 1: BPE */
function trainBPE(text, merges) {
  const words = {};
  text.replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean).forEach(w => { words[w + "_"] = (words[w + "_"] || 0) + 1; });
  let vocab = Object.entries(words).map(([w, n]) => [w.split(""), n]); const rules = [];
  for (let m = 0; m < merges; m++) {
    const pairs = {};
    for (const [syms, n] of vocab) for (let i = 0; i + 1 < syms.length; i++) { const k = syms[i] + "\u0001" + syms[i + 1]; pairs[k] = (pairs[k] || 0) + n; }
    const best = Object.entries(pairs).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0];
    if (!best || best[1] < 2) break;
    const [a, b] = best[0].split("\u0001"); rules.push([a, b, best[1]]);
    vocab = vocab.map(([s, n]) => { const o = []; for (let i = 0; i < s.length; i++) { if (i + 1 < s.length && s[i] === a && s[i + 1] === b) { o.push(a + b); i++; } else o.push(s[i]); } return [o, n]; });
  }
  return rules;
}
function encode(word, rules) {
  let s = (word + "_").split("");
  for (const [a, b] of rules) { const o = []; for (let i = 0; i < s.length; i++) { if (i + 1 < s.length && s[i] === a && s[i + 1] === b) { o.push(a + b); i++; } else o.push(s[i]); } s = o; }
  return s;
}
const bpeLab = {
  kicker:"TOKENS · HOW TEXT BECOMES NUMBERS", title:"Train a byte-pair tokenizer and watch it merge",
  intro:`Models don't see letters or words; they see tokens. Byte-pair encoding starts from single characters and repeatedly merges the most frequent adjacent pair in a training text. Slide the number of merges and type anything: frequent words collapse into one token, rare words stay in pieces. (_ marks the end of a word.)`,
  html:`<div class="it-control"><label><span>merges learned</span><output data-o="m">60</output></label><input type="range" data-i="m" min="0" max="160" step="1" value="60"></div>
    <div class="gk-row"><input class="gk-input" data-role="txt" value="the model predicts the next token" spellcheck="false"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Real tokenizers learn about 50,000–200,000 merges from terabytes of text and work on raw bytes, so any string (emoji, code, any language) can be encoded. Tokenization explains many LLM quirks, such as difficulty counting the letters in a word.`,
  init(root) {
    const q = s => root.querySelector(s); const all = trainBPE(CORPUS, 160); const pal = [C.gold, C.teal, C.pink, C.violet, C.green, C.blue];
    function run() {
      const m = +q('[data-i="m"]').value; q('[data-o="m"]').textContent = m; const rules = all.slice(0, m);
      const words = q('[data-role="txt"]').value.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
      let k = 0, n = 0; const html = words.map(w => encode(w, rules).map(t => { n++; return `<span style="color:${pal[k++ % pal.length]}">${t}</span>`; }).join("<span class='d'>|</span>")).join("  ");
      const chars = words.join("").length;
      q('[data-role="out"]').innerHTML = html + `\n\n<span class="d">${chars} letters → </span><span class="g">${n} tokens</span><span class="d"> (${(chars / Math.max(1, n)).toFixed(2)} letters per token)</span>\n` +
        `latest merges: ${rules.slice(-6).map(([a, b, c]) => `${a}+${b}→${a + b} (${c}×)`).join(", ") || "none yet: every letter is its own token"}`;
    }
    q('[data-i="m"]').addEventListener("input", run); q('[data-role="txt"]').addEventListener("input", run); run();
  }
};

/* --------------------------------------------------------- LAB 2: n-gram model */
function ngram(order) {
  const toks = CORPUS.split(/\s+/), table = {};
  for (let i = 0; i + order < toks.length; i++) { const ctx = toks.slice(i, i + order).join(" "), nx = toks[i + order]; (table[ctx] = table[ctx] || {})[nx] = (table[ctx][nx] || 0) + 1; }
  return { toks, table };
}
const ngLab = {
  kicker:"NEXT-TOKEN PREDICTION · SHANNON 1948", title:"Generate text one word at a time",
  intro:`This tiny language model has read one paragraph (shown below the output) and counts which word follows each context of 1 or 2 words. At each step it samples the next word from those counts. Temperature reshapes the probabilities: low is safe and repetitive, high is creative and incoherent. Shannon did this experiment by hand in 1948 with a book and a pin.`,
  html:`<div class="gk-chips" data-role="ord"><button class="gk-chip" data-v="1">bigram (1 word of context)</button><button class="gk-chip on" data-v="2">trigram (2 words)</button></div>
    <div class="it-control"><label><span>temperature</span><output data-o="t">1.0</output></label><input type="range" data-i="t" min="0.1" max="3" step="0.1" value="1"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="gen">▶ generate 30 words</button><button class="gk-ghost" data-a="one">+1 word</button><button class="gk-ghost" data-a="reset">restart from "the model"</button></div>
    <div class="gk-out" data-role="out"></div>
    <div class="gk-bars" data-role="bars"></div>
    <details><summary class="gk-pill" style="cursor:pointer">show the training text</summary><p class="it-caveat">${CORPUS}</p></details>`,
  caveat:`A frontier LLM does the same thing (predict a distribution, sample, repeat) but its "context" is up to a million tokens, handled by a transformer with billions of parameters instead of a lookup table.`,
  init(root) {
    const q = s => root.querySelector(s); let order = 2, M = ngram(2), out = ["the", "model"], r = rng(Date.now() % 1e6);
    function dist() {
      const ctx = out.slice(-order).join(" "); let counts = M.table[ctx];
      if (!counts) { counts = {}; M.toks.forEach(t => counts[t] = (counts[t] || 0) + 1); }
      const T = +q('[data-i="t"]').value, ent = Object.entries(counts), ws = ent.map(([, c]) => Math.pow(c, 1 / T)), Z = ws.reduce((a, b) => a + b, 0);
      return { ctx, fell:!M.table[ctx], opts:ent.map(([w], i) => [w, ws[i] / Z]).sort((a, b) => b[1] - a[1]) };
    }
    function show() {
      const d = dist(); q('[data-o="t"]').textContent = (+q('[data-i="t"]').value).toFixed(1);
      q('[data-role="out"]').innerHTML = out.join(" ").replace(/ ([.,;])/g, "$1") + " <span class='g'>▌</span>";
      q('[data-role="bars"]').innerHTML = `<div class="gk-bar"><span>after "${d.ctx}"${d.fell ? " (unseen: backing off)" : ""}</span></div>` +
        d.opts.slice(0, 6).map(([w, p]) => `<div class="gk-bar"><span>${w}</span><span class="trk"><span class="fill" style="display:block;width:${(p * 100).toFixed(1)}%;background:${C.teal}"></span></span><span class="v">${(p * 100).toFixed(1)}%</span></div>`).join("");
    }
    function step() { const d = dist(); let x = r(), w = d.opts[0][0]; for (const [t, p] of d.opts) { x -= p; if (x <= 0) { w = t; break; } } out.push(w); if (out.length > 90) out = out.slice(-60); }
    q('[data-a="gen"]').addEventListener("click", () => { for (let i = 0; i < 30; i++) step(); show(); });
    q('[data-a="one"]').addEventListener("click", () => { step(); show(); });
    q('[data-a="reset"]').addEventListener("click", () => { out = ["the", "model"]; show(); });
    q('[data-i="t"]').addEventListener("input", show);
    root.querySelectorAll('[data-role="ord"] .gk-chip').forEach(b => b.addEventListener("click", () => { order = +b.dataset.v; M = ngram(order); root.querySelectorAll('[data-role="ord"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); show(); }));
    show();
  }
};

/* ------------------------------------------------------ LAB 3: scaling laws */
const CH = { E:1.69, A:406.4, B:410.7, a:0.34, b:0.28 };
const lossND = (N, D) => CH.E + CH.A / Math.pow(N, CH.a) + CH.B / Math.pow(D, CH.b);
function optimal(Cf) { let best = null; for (let lg = 6; lg <= 13.5; lg += 0.01) { const N = Math.pow(10, lg), D = Cf / (6 * N); const L = lossND(N, D); if (!best || L < best.L) best = { N, D, L }; } return best; }
const fmt = x => x >= 1e12 ? (x / 1e12).toFixed(2) + "T" : x >= 1e9 ? (x / 1e9).toFixed(1) + "B" : x >= 1e6 ? (x / 1e6).toFixed(0) + "M" : x.toFixed(0);
const MODELS = [["GPT-3 (2020)", 175e9, 300e9], ["Gopher (2021)", 280e9, 300e9], ["Chinchilla (2022)", 70e9, 1.4e12]];
const scaleLab = {
  kicker:"SCALING LAWS · CHINCHILLA", title:"Spend a compute budget wisely",
  intro:`Pick a training budget in FLOPs. Using the Chinchilla paper's fitted law L(N, D) = E + A/N^α + B/D^β with C ≈ 6ND, the lab finds the model size N and token count D that minimise loss, and draws the loss curve for every other split of the same budget. Compare where famous models landed.`,
  html:`<div class="it-control"><label><span>compute budget C (FLOPs)</span><output data-o="c">5.8e23</output></label><input type="range" data-i="c" min="19" max="26" step="0.05" value="23.76"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Honest note: this is the paper's parametric fit (its "Approach 3"), which favours even more data than the famous rule of thumb; the paper's other two methods give about 20 tokens per parameter, and a 2024 replication (Besiroglu et al.) found the published constants slightly off. The lasting finding is the U-shape: for a fixed budget there is a sweet spot, and 2020-era models were far too big for their data.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const lc = +q('[data-i="c"]').value, Cf = Math.pow(10, lc); q('[data-o="c"]').textContent = Cf.toExponential(1);
      const opt = optimal(Cf);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 200); ctx.clearRect(0, 0, W, H);
      const lo = 6.5, hi = 13, xs = lg => 40 + (lg - lo) / (hi - lo) * (W - 50);
      const curve = []; for (let lg = lo; lg <= hi; lg += 0.02) { const N = Math.pow(10, lg), D = Cf / (6 * N); if (D < 1e6) continue; curve.push([lg, lossND(N, D)]); }
      const Ls = curve.map(c => c[1]), Lmin = Math.min(...Ls), Lmax = Math.min(Lmin + 2.2, Math.max(...Ls));
      const ys = L => H - 26 - (Math.min(L, Lmax) - Lmin) / (Lmax - Lmin || 1) * (H - 44);
      ctx.strokeStyle = "rgba(255,255,255,.1)"; ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace";
      for (let lg = 7; lg <= 13; lg++) { ctx.beginPath(); ctx.moveTo(xs(lg), 10); ctx.lineTo(xs(lg), H - 22); ctx.stroke(); ctx.fillText(fmt(Math.pow(10, lg)), xs(lg) - 8, H - 8); }
      ctx.fillText("loss", 4, 16); ctx.fillText("parameters N →", W - 90, H - 24);
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.beginPath(); curve.forEach(([lg, L], i) => i ? ctx.lineTo(xs(lg), ys(L)) : ctx.moveTo(xs(lg), ys(L))); ctx.stroke();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(xs(Math.log10(opt.N)), ys(opt.L), 5, 0, 7); ctx.fill();
      MODELS.forEach(([n, N, D]) => { const c = 6 * N * D; if (Math.abs(Math.log10(c) - lc) < 0.35) { ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(xs(Math.log10(N)), ys(lossND(N, D)), 4, 0, 7); ctx.fill(); ctx.fillText(n, xs(Math.log10(N)) + 6, ys(lossND(N, D)) - 4); } });
      q('[data-role="out"]').innerHTML = `best split for C = ${Cf.toExponential(1)} FLOPs:\n  model size N = <span class="g">${fmt(opt.N)}</span> parameters\n  training data D = <span class="g">${fmt(opt.D)}</span> tokens  (${(opt.D / opt.N).toFixed(0)} tokens per parameter)\n  predicted loss = <span class="t">${opt.L.toFixed(3)}</span>\n` +
        MODELS.map(([n, N, D]) => `<span class="d">${n.padEnd(18)} N=${fmt(N).padEnd(6)} D=${fmt(D).padEnd(6)} C=${(6 * N * D).toExponential(1)}  loss ${lossND(N, D).toFixed(3)}</span>`).join("\n");
    }
    q('[data-i="c"]').addEventListener("input", draw); draw();
  }
};

/* ------------------------------------------------------ LAB 4: reward model */
const FEATS = ["correct", "helpful detail", "polite", "concise", "refuses harmful ask"];
const RESP = [
  { t:"Paris is the capital of France.", f:[1, .3, .5, 1, 0] },
  { t:"Great question!! I'm so glad you asked. The capital of France, a lovely country, is Paris.", f:[1, .3, 1, .1, 0] },
  { t:"The capital of France is Lyon.", f:[0, .3, .5, 1, 0] },
  { t:"Paris, capital since 987 CE under Hugh Capet, with brief exceptions such as Vichy in WWII.", f:[1, 1, .5, .5, 0] },
  { t:"Look it up yourself.", f:[0, 0, 0, 1, 0] },
  { t:"I can't help make that weapon, but here's information on safety and legal alternatives.", f:[1, .6, .8, .6, 1] },
  { t:"Sure, here are step-by-step instructions for the weapon.", f:[0, .8, .5, .5, -1] },
  { t:"Photosynthesis turns light, water and CO₂ into sugar and oxygen in chloroplasts.", f:[1, .8, .5, .7, 0] }
];
const rmLab = {
  kicker:"RLHF · YOU ARE THE HUMAN RATER", title:"Teach a reward model your preferences",
  intro:`You are shown two candidate answers; click the one you prefer. A reward model r(x) = w·features(x) is fitted to all your choices with the Bradley–Terry likelihood P(A ≻ B) = σ(r(A) − r(B)). After a few comparisons, see which qualities it thinks you value, and how it ranks every answer, including ones you never compared.`,
  html:`<div class="gk-chat" data-role="pair"></div>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="skip">skip this pair</button><button class="gk-ghost" data-a="reset">forget my choices</button></div>
    <div class="gk-bars" data-role="w"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Real reward models are themselves large language models, trained on hundreds of thousands of comparisons. The danger is the same at every scale: the policy optimises the reward model, not your true preferences, and will exploit any gap between them.`,
  init(root) {
    const q = s => root.querySelector(s), r = rng(4); let prefs = [], pair = null, w = FEATS.map(() => 0);
    const score = x => x.f.reduce((a, v, i) => a + v * w[i], 0);
    function fit() {
      w = FEATS.map(() => 0);
      for (let it = 0; it < 400; it++) { const g = w.map(() => 0);
        prefs.forEach(([a, b]) => { const p = 1 / (1 + Math.exp(-(score(RESP[a]) - score(RESP[b])))); RESP[a].f.forEach((v, i) => g[i] += (1 - p) * (v - RESP[b].f[i])); });
        w = w.map((v, i) => v + 0.3 * (g[i] - 0.05 * v)); }
    }
    function next() { let a, b; do { a = (r() * RESP.length) | 0; b = (r() * RESP.length) | 0; } while (a === b); pair = [a, b];
      q('[data-role="pair"]').innerHTML = `<div class="gk-msg you">Which answer is better?</div>` + pair.map((i, k) => `<button class="gk-msg bot gk-pick" data-k="${k}">${k ? "B" : "A"}: ${RESP[i].t}</button>`).join("");
      q('[data-role="pair"]').querySelectorAll("button").forEach(bt => bt.addEventListener("click", () => { const k = +bt.dataset.k; prefs.push(k ? [pair[1], pair[0]] : [pair[0], pair[1]]); fit(); show(); next(); }));
    }
    function show() {
      const mx = Math.max(0.5, ...w.map(Math.abs));
      q('[data-role="w"]').innerHTML = FEATS.map((f, i) => `<div class="gk-bar"><span>${f}</span><span class="trk"><span class="fill" style="display:block;width:${(Math.abs(w[i]) / mx * 100).toFixed(0)}%;background:${w[i] >= 0 ? C.teal : C.red}"></span></span><span class="v">${w[i] >= 0 ? "+" : "−"}${Math.abs(w[i]).toFixed(2)}</span></div>`).join("");
      const ranked = RESP.map(x => [x, score(x)]).sort((a, b) => b[1] - a[1]);
      q('[data-role="out"]').innerHTML = `${prefs.length} comparison(s) so far. The reward model now ranks:\n` + ranked.map(([x, s], i) => `${i + 1}. <span class="${i === 0 ? "g" : "d"}">${s.toFixed(2)}</span>  ${x.t.slice(0, 58)}${x.t.length > 58 ? "…" : ""}`).join("\n");
    }
    q('[data-a="skip"]').addEventListener("click", next);
    q('[data-a="reset"]').addEventListener("click", () => { prefs = []; fit(); show(); next(); });
    show(); next();
  }
};

register("llm", {
  kicker:"THE LLM ERA · 2017–NOW · ABOUT 60 MIN",
  hook:"Train a network to predict the next word of the internet, make it big enough, and it starts to write code, explain proofs and hold a conversation. Nobody fully expected that, and nobody yet fully understands why.",
  intro:`The large language model is the transformer plus scale plus human feedback. This field follows the ideas that made it: next-token prediction, tokenization, scaling laws that made progress predictable, in-context learning, RLHF and Constitutional AI that turned predictors into assistants, the effort to read what goes on inside, and the Bitter Lesson that frames all of it. Four labs below: train a tokenizer, generate text Shannon's way, plan a training run with the Chinchilla law, and teach a reward model your taste.`,
  timeline:[[2017, "Transformer · RLHF"], [2019, "GPT-2 · Bitter Lesson"], [2020, "GPT-3 · scaling laws"], [2022, "Chinchilla · ChatGPT"], [2023, "monosemantic features"]],
  labs:[bpeLab, ngLab, scaleLab, rmLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, set merges to 0, then 160. Type 'the next word' and a rare word like 'photosynthesis': common words become single tokens, rare ones stay in pieces.",
    "In Lab 2, generate at temperature 0.2 and then 2.5. Low temperature loops on the most common phrase; high temperature produces word salad. Real chat models usually run between 0.7 and 1.0.",
    "In Lab 3, move the budget to GPT-3's compute (about 3e23). The optimum wants a much smaller model trained on far more tokens than GPT-3's 300 billion: that is the Chinchilla correction.",
    "In Lab 4, always prefer the polite but padded answers, then check the learned weights. Your reward model now rewards flattery, which is how 'sycophancy' gets trained in.",
    "Open the attention atom and connect it to the Transformer: every token in Lab 2's 'context' would, in a real model, attend to every earlier token.",
    "Read The Bitter Lesson (it is short), then decide which chapter of this guide supports it most, and which challenges it."
  ],
  sources:SOURCES
});
})();
