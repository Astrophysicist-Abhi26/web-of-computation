// LEARNING PARADIGMS — supervised, unsupervised, reinforcement and
// self-supervised learning: ways of learning that cut ACROSS machine
// learning rather than nesting inside each other. Three real labs: a sorter
// that asks which paradigm each real system uses, a self-supervision
// "label factory" that manufactures training pairs from raw text, and
// logistic regression showing that minimising cross-entropy is maximum
// likelihood.
(function () {
"use strict";
const { register, canvas, rng, gauss, C } = GuideKit;

const CHAPTERS = [
  { icon:"🏷", title:"Supervised learning — learn from answers",
    who:"perceptron lineage · Fisher's maximum likelihood (1922)",
    lead:"Show the learner inputs together with the right outputs, and it learns the mapping. Most of the machine learning in daily use works this way.",
    formula:"minimise  −Σᵢ log p_θ(yᵢ | xᵢ)      (cross-entropy = negative log-likelihood)",
    what:`Supervised learning uses labelled pairs: an email and "spam", an X-ray and "pneumonia", a sentence and
      its translation. The model adjusts its parameters to make the correct answers more probable. Lab 3 shows
      the loss it minimises is exactly Fisher's likelihood from 1922.`,
    how:`Classification predicts a category (with cross-entropy loss); regression predicts a number (with squared
      error, which is maximum likelihood under Gaussian noise). Either way, "training" means maximum likelihood
      estimation, usually by gradient descent.`,
    story:`The bottleneck has always been labels: ImageNet needed tens of thousands of crowd workers. That cost
      is what pushed researchers toward methods that need fewer labels, or none.`,
    today:`Supervised fine-tuning is still the step that turns a pre-trained model into a specialist: a medical
      classifier, a code assistant, or the instruction-following stage of a chat model.` },
  { icon:"🔍", title:"Unsupervised learning — find structure without answers",
    who:"clustering lineage (Lloyd 1957) · autoencoders (Hinton & Salakhutdinov 2006)",
    lead:"No labels at all: just data. The learner's job is to find what is regular about it (groups, directions, a compact code, or its probability distribution).",
    formula:"model p(x) itself  ·  or compress x → z → x̂ and minimise ‖x − x̂‖²",
    what:`Unsupervised methods cluster (k-means), reduce dimension (PCA, UMAP), estimate densities, or learn codes
      (autoencoders). The Classical ML guide's k-means lab is the textbook example: groups found with no labels.`,
    how:`Without answers to check against, success is harder to define. Methods rely on assumptions, such as
      "similar things are close" or "the data can be compressed", and those assumptions decide what structure
      you find.`,
    story:`Unsupervised learning was long seen as the "holy grail": most of the world's data is unlabelled.
      Hinton and Salakhutdinov's 2006 deep autoencoder helped restart deep learning by showing deep nets could
      learn useful codes layer by layer.`,
    today:`Generative models (diffusion, language models) are the modern face of unsupervised learning: they model
      the distribution of the data itself, well enough to sample new examples.` },
  { icon:"🎮", title:"Reinforcement learning — learn from consequences",
    who:"Bellman 1957 · Sutton 1988 · Watkins 1989",
    lead:"No correct answer is given, only a reward after acting, often much later. The learner must work out which of its actions deserved the credit.",
    formula:"maximise  E[ Σₜ γᵗ rₜ ]      (expected discounted future reward)",
    what:`An agent interacts with an environment, receiving rewards. It must explore to discover good actions and
      exploit what it has learned. The Deep RL guide has three labs on it: Q-learning, bandits and tree search.`,
    how:`The hard part is credit assignment: a chess game is won by a move made 30 moves earlier. Value functions
      and temporal-difference learning spread reward backwards through time.`,
    story:`RL grew from animal-learning psychology (Thorndike's law of effect, 1898) and optimal control
      (Bellman). It was a niche until DeepMind combined it with deep networks in 2013.`,
    today:`RL trains game champions, robots and chip layouts, and now shapes language models (RLHF, and RL on
      verifiable rewards for reasoning).` },
  { icon:"🎭", title:"Self-supervised learning — labels made from the data itself",
    who:"word2vec 2013 · BERT (Devlin et al.) 2018 · SimCLR (Chen et al.) 2020",
    lead:"Hide part of each example and train the model to predict it. Every sentence on the internet becomes thousands of free training examples.",
    formula:"x = 'the cat sat on the [MASK]'  →  predict 'mat'      (the label came from x itself)",
    what:`Self-supervised learning is supervised learning where the labels are generated automatically from raw
      data: the next word, a masked word, a hidden patch of an image, or whether two crops come from the same
      photo. Lab 2 turns sentences into labelled pairs in exactly this way.`,
    how:`Because the labels are free, the amount of training data is limited only by the raw data available,
      which for text is essentially the internet. GPT's next-token prediction is self-supervised learning;
      BERT's masked-word prediction is too.`,
    story:`At NeurIPS 2016 Yann LeCun described intelligence as a cake: self-supervised learning is the cake
      itself, supervised learning the icing, and reinforcement learning the cherry on top. The analogy became a
      field-wide slogan; the map calls self-supervision the LLM unlock.`,
    today:`Almost every foundation model (for language, images, audio, proteins) is pre-trained self-supervised,
      then adapted with a little supervision and a little RL: the cake, icing and cherry in order.` },
  { icon:"🔀", title:"Why these are slices, not boxes",
    who:"the map's containment shells vs the paradigms",
    lead:"AI ⊃ ML ⊃ neural networks ⊃ deep learning is a nesting. Supervised, unsupervised and reinforcement learning are not: they are different ways of learning, and one system often uses several.",
    formula:"ChatGPT = self-supervised pre-training  +  supervised fine-tuning  +  reinforcement learning (RLHF)",
    what:`A deep network can be trained with any paradigm; so can a decision tree (well, most of them). AlphaGo
      used supervised learning on human games and then RL by self-play. A chat model uses all three in sequence.
      Lab 1 asks you to sort real systems.`,
    how:`Many hybrids exist: semi-supervised learning (a few labels, lots of unlabelled data), active learning (the
      model asks for the labels it needs), few-shot and in-context learning (examples in the prompt).`,
    story:`Textbooks draw the three paradigms as separate boxes, which is why students expect a model to "be" one
      of them. Modern systems made that picture obsolete: the paradigm describes the training signal, not the
      model.`,
    today:`When you read about a new AI system, a useful question is: what was the training signal at each
      stage, and where did it come from? That question tells you more than the architecture.` },
  { icon:"🍰", title:"LeCun's cake and the dark matter of intelligence",
    who:"Yann LeCun · NeurIPS 2016 keynote · 'dark matter' essay with Ishan Misra 2021",
    lead:"A baby learns how the world works mostly by watching, long before anyone labels anything. Self-supervision is the machine version.",
    formula:"bits of feedback per sample:  RL ≈ a few  ·  supervised ≈ 10–10,000  ·  self-supervised ≈ millions",
    what:`LeCun's argument is about information: a reward is a single number, a label a few bits, but predicting
      the missing part of an image or a video frame gives the learner millions of bits of feedback per example.
      That is where most learning must come from.`,
    how:`For text, predicting missing words worked spectacularly. For images and video, predicting raw pixels is
      wasteful, so newer methods (such as LeCun's JEPA) predict in a learned representation space instead.`,
    story:`The 2021 essay called self-supervised learning "the dark matter of intelligence": the vast unseen
      bulk of what humans and animals learn.`,
    today:`Whether next-token prediction alone is enough for human-level intelligence, or whether models must also
      learn by predicting the physical world ("world models"), is one of the field's live debates.` }
];

const SOURCES = [
  { type:"MAXIMUM LIKELIHOOD · 1922", title:"R. A. Fisher — On the Mathematical Foundations of Theoretical Statistics", note:"The principle behind every supervised loss.", url:"https://doi.org/10.1098/rsta.1922.0009" },
  { type:"THE PERCEPTRON · 1958", title:"Frank Rosenblatt — The Perceptron", note:"The first learning machine: supervised, mistake-driven.", url:"https://doi.org/10.1037/h0042519" },
  { type:"AUTOENCODERS · 2006", title:"Hinton & Salakhutdinov — Reducing the Dimensionality of Data with Neural Networks", note:"Science 313. Unsupervised deep codes.", url:"https://doi.org/10.1126/science.1127647" },
  { type:"THE RL TEXTBOOK · FREE", title:"Sutton & Barto — Reinforcement Learning: An Introduction", note:"Learning from reward, from first principles.", url:"http://incompleteideas.net/book/the-book.html" },
  { type:"BERT · 2018", title:"Devlin et al. — BERT: Pre-training of Deep Bidirectional Transformers", note:"Masked-word prediction at scale.", url:"https://arxiv.org/abs/1810.04805" },
  { type:"SimCLR · 2020", title:"Chen, Kornblith, Norouzi & Hinton — A Simple Framework for Contrastive Learning of Visual Representations", note:"Self-supervision for images: two crops, one photo.", url:"https://arxiv.org/abs/2002.05709" },
  { type:"MASKED IMAGES · 2021", title:"He et al. — Masked Autoencoders Are Scalable Vision Learners", note:"Hide 75% of an image and predict it back.", url:"https://arxiv.org/abs/2111.06377" },
  { type:"ESSAY · 2021", title:"LeCun & Misra — Self-supervised Learning: The Dark Matter of Intelligence", note:"The case for self-supervision, for a general audience.", url:"https://ai.meta.com/blog/self-supervised-learning-the-dark-matter-of-intelligence/" },
  { type:"THE TEXTBOOK · FREE", title:"Hastie, Tibshirani & Friedman — The Elements of Statistical Learning", note:"Supervised and unsupervised learning in depth.", url:"https://hastie.su.domains/ElemStatLearn/" }
];

/* ------------------------------------------------------- LAB 1: the sorter */
const CASES = [
  ["A spam filter trained on emails that users marked 'spam' or 'not spam'.", "sup", "Each email comes with a human label. Classic supervised classification."],
  ["Grouping a shop's customers into segments nobody defined in advance.", "unsup", "There are no labels; the algorithm discovers the groups (k-means is a typical choice)."],
  ["A robot dog learning to walk by trying movements and being rewarded for forward speed.", "rl", "No correct movement is given, only a reward after acting. Reinforcement learning."],
  ["GPT pre-training: predicting the next word of internet text.", "self", "The 'label' (the next word) comes from the text itself. Self-supervised."],
  ["AlphaGo Zero improving by playing millions of games against itself.", "rl", "The only signal is who won each game. Reinforcement learning by self-play."],
  ["BERT learning by filling in words hidden from sentences.", "self", "Masked-word prediction manufactures labels from raw text. Self-supervised."],
  ["A hospital model predicting diagnoses from X-rays labelled by radiologists.", "sup", "Expert labels on every image: supervised learning."],
  ["Compressing images with an autoencoder that learns to reconstruct its input.", "unsup", "No labels, just structure to capture. Usually filed under unsupervised learning (some call it self-supervised: the target is the input itself)."],
  ["ChatGPT's final training stage, where people rank pairs of answers.", "rl", "A reward model learned from rankings, then RL (RLHF). The ranking step alone is supervised learning of that reward model."],
  ["Face ID learning that two photos of you, taken at different angles, belong together.", "self", "Contrastive learning: the pairing comes from the data, not from labels. Self-supervised (then fine-tuned)."]
];
const PNAME = { sup:"supervised", unsup:"unsupervised", rl:"reinforcement", self:"self-supervised" };
const sortLab = {
  kicker:"WHICH PARADIGM?", title:"Sort ten real systems by their training signal",
  intro:`For each system, ask one question: where does the learning signal come from? Human labels (supervised), no signal but structure (unsupervised), a reward after acting (reinforcement), or labels made from the data itself (self-supervised)?`,
  html:`<div class="gk-out" data-role="q" style="font-family:Spectral,Georgia,serif;font-size:.86rem"></div>
    <div class="gk-chips" data-role="ans">${Object.entries(PNAME).map(([k, v]) => `<button class="gk-chip" data-v="${k}">${v}</button>`).join("")}</div>
    <div class="gk-out" data-role="out"></div>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="next">next system →</button><button class="gk-ghost" data-a="reset">start over</button></div>`,
  caveat:`Several of these are genuinely debatable, and the explanations say so. Real systems usually combine paradigms in stages, which is the point of the fifth chapter.`,
  init(root) {
    const q = s => root.querySelector(s); let i = 0, score = 0, answered = false;
    function show() { const [t] = CASES[i]; q('[data-role="q"]').innerHTML = `<b>${i + 1} / ${CASES.length}</b>  ${t}`; q('[data-role="out"]').innerHTML = `<span class="d">score so far: ${score}</span>`; answered = false;
      root.querySelectorAll('[data-role="ans"] .gk-chip').forEach(b => b.classList.remove("on")); }
    root.querySelectorAll('[data-role="ans"] .gk-chip').forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true; const [, k, why] = CASES[i], ok = b.dataset.v === k; if (ok) score++;
      b.classList.add("on");
      q('[data-role="out"]').innerHTML = (ok ? `<span class="t">✓ ${PNAME[k]}</span>` : `<span class="r">✗ it's ${PNAME[k]}</span>`) + `\n${why}\n<span class="d">score: ${score} / ${i + 1}</span>`;
    }));
    q('[data-a="next"]').addEventListener("click", () => { i = (i + 1) % CASES.length; if (i === 0) score = 0; show(); });
    q('[data-a="reset"]').addEventListener("click", () => { i = 0; score = 0; show(); });
    show();
  }
};

/* --------------------------------------------------- LAB 2: label factory */
const TEXT = [
  "the cat sat on the mat", "the dog sat on the rug", "the cat chased the dog", "a dog chased the ball",
  "the child threw the ball", "the cat slept on the rug", "a child fed the cat", "the dog slept on the mat",
  "the child sat on the rug", "a cat chased a mouse"
];
const factoryLab = {
  kicker:"SELF-SUPERVISION · FREE LABELS", title:"Turn raw sentences into labelled training data",
  intro:`Nobody labelled these ten sentences. Choose a task and the factory manufactures (input → answer) pairs from the text itself. Then a tiny model trained only on those pairs fills in a blank you choose: it learned from labels nobody wrote.`,
  html:`<div class="gk-chips" data-role="task"><button class="gk-chip on" data-v="next">next-word prediction (GPT-style)</button><button class="gk-chip" data-v="mask">masked word (BERT-style)</button></div>
    <div class="gk-out" data-role="pairs"></div>
    <div class="gk-row"><input class="gk-input" data-role="probe" value="the dog slept on the ___" spellcheck="false"><button class="it-send" data-a="fill">predict ___</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Ten sentences give dozens of examples. The internet gives trillions, which is why self-supervised pre-training can use so much data: nobody has to label any of it.`,
  init(root) {
    const q = s => root.querySelector(s); let task = "next";
    function pairs() {
      const out = [];
      TEXT.forEach(s => { const w = s.split(" ");
        if (task === "next") for (let i = 1; i < w.length; i++) out.push([w.slice(0, i).join(" ") + " →", w[i]]);
        else for (let i = 0; i < w.length; i++) out.push([w.map((x, j) => j === i ? "[MASK]" : x).join(" "), w[i]]); });
      return out;
    }
    function show() {
      const P = pairs();
      q('[data-role="pairs"]').innerHTML = `<span class="g">${P.length}</span> labelled examples made from ${TEXT.length} unlabelled sentences. A few of them:\n` +
        P.filter((_, i) => i % Math.ceil(P.length / 7) === 0).map(([x, y]) => `<span class="d">${x}</span>  ⇒  <span class="t">${y}</span>`).join("\n");
      fill();
    }
    function fill() {
      const raw = q('[data-role="probe"]').value.trim().toLowerCase().split(/\s+/), bi = raw.indexOf("___");
      if (bi < 0) { q('[data-role="out"]').innerHTML = "put ___ where the missing word should go."; return; }
      const prev = raw[bi - 1], next = raw[bi + 1], counts = {};
      TEXT.forEach(s => { const w = s.split(" "); w.forEach((x, i) => {
        const okPrev = prev === undefined || w[i - 1] === prev, okNext = task === "next" || next === undefined || w[i + 1] === next;
        if (okPrev && okNext) counts[x] = (counts[x] || 0) + 1; }); });
      const tot = Object.values(counts).reduce((a, b) => a + b, 0), top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
      q('[data-role="out"]').innerHTML = tot ? `model uses ${task === "next" ? `the word before ("${prev || "start"}")` : `the words on both sides ("${prev || "start"}" … "${next || "end"}")`}\n` +
        top.map(([w, c]) => `${w.padEnd(7)} ${(c / tot * 100).toFixed(0).padStart(3)}%`).join("\n") : `<span class="r">never seen that context: this tiny model has no idea</span>`;
    }
    root.querySelectorAll('[data-role="task"] .gk-chip').forEach(b => b.addEventListener("click", () => { task = b.dataset.v; root.querySelectorAll('[data-role="task"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); show(); }));
    q('[data-a="fill"]').addEventListener("click", fill); q('[data-role="probe"]').addEventListener("keydown", e => { if (e.key === "Enter") fill(); });
    show();
  }
};

/* ------------------------------------------------------- LAB 3: loss = MLE */
const mleLab = {
  kicker:"LOSS = MAXIMUM LIKELIHOOD", title:"Fit a probability, and watch cross-entropy equal −log-likelihood",
  intro:`Hours studied (x) and pass/fail (dots at the top or bottom) for 30 students. A logistic model p(pass | x) = σ(w·x + b) draws the curve. The panel shows the likelihood of the observed data under the model, and the cross-entropy loss: they are the same number in different clothes (loss = −log(likelihood) / n). Drag the sliders, or let gradient descent find the maximum-likelihood fit.`,
  html:`<div class="it-control"><label><span>slope w</span><output data-o="w">0.5</output></label><input type="range" data-i="w" min="-1" max="4" step="0.05" value="0.5"></div>
    <div class="it-control"><label><span>offset b</span><output data-o="b">0.0</output></label><input type="range" data-i="b" min="-12" max="4" step="0.1" value="0"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="fit">▶ gradient descent to the best fit</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Training a language model is this, at scale: its loss is the average −log p of each actual next token, so lowering the loss means raising the probability the model gives to real text.`,
  init(root) {
    const q = s => root.querySelector(s), r = rng(8);
    const data = Array.from({ length:30 }, () => { const x = r() * 8; const p = 1 / (1 + Math.exp(-(1.3 * x - 5.2))); return [x, r() < p ? 1 : 0]; });
    const sig = z => 1 / (1 + Math.exp(-z)); let timer = null;
    function stats(w, b) { let ll = 0; data.forEach(([x, y]) => { const p = Math.min(1 - 1e-12, Math.max(1e-12, sig(w * x + b))); ll += y ? Math.log(p) : Math.log(1 - p); }); return { ll, ce:-ll / data.length }; }
    function draw() {
      const w = +q('[data-i="w"]').value, b = +q('[data-i="b"]').value; q('[data-o="w"]').textContent = w.toFixed(2); q('[data-o="b"]').textContent = b.toFixed(1);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 170); ctx.clearRect(0, 0, W, H);
      const X = x => 20 + x / 8 * (W - 30), Y = p => H - 16 - p * (H - 30);
      ctx.strokeStyle = "rgba(255,255,255,.12)"; [0, .5, 1].forEach(p => { ctx.beginPath(); ctx.moveTo(20, Y(p)); ctx.lineTo(W - 10, Y(p)); ctx.stroke(); });
      ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const x = i / 100 * 8; i ? ctx.lineTo(X(x), Y(sig(w * x + b))) : ctx.moveTo(X(x), Y(sig(w * x + b))); } ctx.stroke();
      data.forEach(([x, y]) => { ctx.fillStyle = y ? C.teal : C.red; ctx.beginPath(); ctx.arc(X(x), Y(y) + (y ? 5 : -5), 3.5, 0, 7); ctx.fill(); });
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText("pass", 2, Y(1) + 3); ctx.fillText("fail", 2, Y(0) + 3); ctx.fillText("hours studied →", W - 90, H - 3);
      const s = stats(w, b);
      q('[data-role="out"]').innerHTML = `likelihood of the observed data  L = ∏ p(yᵢ | xᵢ) = <span class="g">${Math.exp(s.ll).toExponential(2)}</span>\nlog-likelihood = ${s.ll.toFixed(3)}\ncross-entropy loss = −log L / n = <span class="t">${s.ce.toFixed(4)}</span>   <span class="d">(same number, rescaled)</span>`;
      return { w, b };
    }
    q('[data-a="fit"]').addEventListener("click", () => { clearInterval(timer); let k = 0;
      timer = setInterval(() => { let { w, b } = draw(); let gw = 0, gb = 0; data.forEach(([x, y]) => { const e = sig(w * x + b) - y; gw += e * x; gb += e; });
        for (let j = 0; j < 40; j++) { w -= 0.02 * gw / data.length * 4; b -= 0.02 * gb / data.length * 4; gw = 0; gb = 0; data.forEach(([x, y]) => { const e = sig(w * x + b) - y; gw += e * x; gb += e; }); }
        q('[data-i="w"]').value = Math.max(-1, Math.min(4, w)); q('[data-i="b"]').value = Math.max(-12, Math.min(4, b)); draw(); if (++k > 60) clearInterval(timer); }, 40); });
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", () => { clearInterval(timer); draw(); }));
    draw();
  }
};

register("paradigms-ml", {
  kicker:"LEARNING PARADIGMS · 1958–NOW · ABOUT 35 MIN",
  hook:"GPT was never shown a single labelled example during pre-training. It manufactured its own labels from raw text, trillions of them. That trick is why this field sits at the centre of modern AI.",
  intro:`Machine learning is often taught as three boxes: supervised, unsupervised and reinforcement learning. They are better understood as kinds of training signal: answers, structure, and consequences. A fourth, self-supervision, makes labels from the data itself, and it is what unlocked large language models. Three labs below: sort real systems by their signal, run a label factory on raw sentences, and see that a loss function is a likelihood in disguise.`,
  timeline:[[1922, "maximum likelihood"], [1957, "unsupervised (k-means)"], [1958, "supervised (perceptron)"], [1988, "reinforcement (TD)"], [2018, "self-supervised (BERT)"]],
  labs:[sortLab, factoryLab, mleLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, score yourself on all ten. The ones you get 'wrong' are usually the interesting hybrids.",
    "In Lab 2, switch between next-word and masked-word tasks and count the examples. Masking makes more pairs from the same text, and the masked model can use context on both sides.",
    "Still in Lab 2, try 'a child ___ the cat' with both tasks. Which one guesses better, and why?",
    "In Lab 3, set w and b by hand to make the curve fit well, and note the loss. Then press gradient descent: it finds the maximum-likelihood fit, and the loss is lower.",
    "Pick any AI system in the news and name the training signal at each stage. You will usually find at least two paradigms."
  ],
  sources:SOURCES
});
})();
