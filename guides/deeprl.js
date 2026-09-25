// DEEP RL & GAMES — learning from reward, from TD-Gammon to AlphaGo's Move 37
// and AlphaFold. Three real labs: tabular Q-learning in a gridworld (the
// Bellman update, live), the explore/exploit dilemma on a multi-armed bandit
// (ε-greedy vs UCB, with regret), and tic-tac-toe against Monte Carlo tree
// search — the planning half of AlphaGo — with an adjustable thinking budget.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"🎲", title:"Learning from reward — the Bellman equation comes alive",
    who:"Bellman 1957 · Sutton 1988 (TD) · Watkins 1989 (Q-learning)",
    lead:"No labels, just a number that says how well things went. Reinforcement learning turns that sparse signal into a policy, by letting each state learn from the estimate of the state after it.",
    formula:"Q(s,a) ← Q(s,a) + α · [ r + γ · maxₐ′ Q(s′,a′) − Q(s,a) ]",
    what:`An agent acts, the world responds with a new state and a reward, and the agent adjusts its estimate of
      how good each action is. Q-learning keeps a table of those estimates and nudges each toward "reward now
      plus the best estimate from the next state". Watch value spread backwards from the goal in Lab 1.`,
    how:`This is Bellman's 1957 equation turned into a learning rule. The difference in brackets, the
      temporal-difference error, is the same quantity Sutton introduced in 1988. Remarkably, dopamine neurons
      in the brain appear to signal something very like it.`,
    story:`Chris Watkins's 1989 PhD thesis introduced Q-learning; the convergence proof with Peter Dayan came
      in 1992. The field's textbook by Sutton and Barto (1998) trained a generation, and in 2025 the two
      received the Turing Award for it.`,
    today:`RL now fine-tunes language models (RLHF), trains reasoning models against verifiable rewards,
      controls data-centre cooling and chip layouts, and teaches robots to walk. The update in the formula is
      still at the centre.` },
  { icon:"🎰", title:"Explore or exploit?",
    who:"Robbins 1952 · Lai & Robbins 1985 · Auer et al. (UCB1) 2002",
    lead:"Keep pulling the lever that has paid best so far, or try the others in case one is better? Every learning agent faces this, and there is a mathematically good answer.",
    formula:"UCB1:  argmaxᵢ  x̄ᵢ + √(2 ln t / nᵢ)      Thompson:  θᵢ ~ Beta(1+wins, 1+losses), pull argmaxᵢ θᵢ",
    what:`A multi-armed bandit is the simplest RL problem: several slot machines with unknown payout rates.
      Pure exploitation can lock onto a mediocre arm forever; pure exploration wastes pulls. Lab 2 races two
      strategies and measures their regret (what they lost compared with always pulling the best arm).`,
    how:`ε-greedy explores at random a fixed fraction of the time. UCB adds a bonus to rarely tried arms,
      shrinking as they are tested, so exploration fades on its own. Lai and Robbins proved regret must grow at
      least logarithmically. UCB, and Thompson sampling (proposed in 1933 for clinical trials), both achieve that
      rate.`,
    story:`Bandits were studied for clinical trials long before AI; the name comes from "one-armed bandit" slot
      machines. The UCB rule later became the "UCT" formula inside Monte Carlo tree search (2006), which is in
      Lab 3 and in AlphaGo.`,
    today:`Bandit algorithms choose which headline, ad or recommendation you see, run adaptive clinical trials and
      tune hyperparameters. Exploration remains one of RL's hardest open problems in large worlds.` },
  { icon:"🎲", title:"1992 — TD-Gammon teaches itself backgammon",
    who:"Gerald Tesauro · IBM",
    lead:"A small neural network played itself hundreds of thousands of times, learning from its own temporal-difference errors, and reached the level of the world's best players.",
    formula:"value network V(s) trained by TD(λ) on self-play games  →  near world-champion play",
    what:`TD-Gammon combined a neural network (to evaluate positions) with TD learning (to improve that
      evaluation from self-play). It learned strategies that experts had not considered, some of which human
      players then adopted.`,
    how:`Backgammon's dice give natural exploration, which helped: attempts to repeat the trick in chess and Go
      in the 1990s failed. Two decades later, bigger networks, more compute and tree search made it work.`,
    story:`TD-Gammon was the first great self-play success, and quietly the ancestor of AlphaZero. Tesauro's
      program changed how professionals played certain opening moves.`,
    today:`Self-play (learning by playing against copies of yourself) is now a standard technique, from game AI
      to training agents that negotiate or write code.` },
  { icon:"👾", title:"2013 — DQN: pixels in, joystick out",
    who:"Volodymyr Mnih et al. · DeepMind · Nature 2015",
    lead:"One network, the same settings, 49 Atari games, learning only from the screen pixels and the score. On many it beat professional human testers.",
    formula:"Q-learning with a CNN for Q(s,a)  +  experience replay  +  a slowly updated target network",
    what:`The deep Q-network replaced the Q-table with a convolutional network that reads raw game frames. Two
      tricks stabilised training: experience replay (learning from a shuffled memory of past moves) and a
      separate, slowly updated target network.`,
    how:`Naively combining neural networks with Q-learning tends to diverge. Replay breaks the correlations
      between consecutive frames, and the frozen target stops the network from chasing its own tail.`,
    story:`The 2013 workshop paper helped persuade Google to buy DeepMind in 2014 (for a reported £400
      million). Its most famous clip shows the agent discovering that tunnelling behind the wall in Breakout is
      the best strategy.`,
    today:`DQN was the proof that deep learning and RL could be fused. Its descendants (Rainbow, Agent57) went
      on to beat the human benchmark on all 57 Atari games.` },
  { icon:"⚫", title:"2016 — AlphaGo and Move 37",
    who:"David Silver, Demis Hassabis et al. · DeepMind · Seoul, March 2016",
    lead:"Go was thought to be a decade away for computers: too many positions to search, too subtle to evaluate. AlphaGo beat Lee Sedol 4–1.",
    formula:"Monte Carlo tree search  guided by  a policy network (which moves?)  and  a value network (who is winning?)",
    what:`AlphaGo combined tree search (Lab 3's MCTS) with two deep networks: one suggesting promising moves,
      one judging positions. Trained first on human games and then by self-play, it searched far fewer
      positions than Deep Blue did in chess, but chose them much better.`,
    how:`In game 2, AlphaGo's 37th move was a shoulder hit on the fifth line that its own policy network
      estimated a human would play about 1 time in 10,000. Commentators thought it was a mistake; it proved
      decisive. In game 4 Lee Sedol found his own brilliant move (78) and won.`,
    story:`About 200 million people watched. Lee Sedol retired in 2019, saying AI "cannot be defeated". The
      match is the moment on this map where search-plus-rules (Deep Blue, 1997) hands over to search-plus-
      learning, the gold bridge between symbolic AI and ML.`,
    today:`AlphaGo Zero (2017) learned without any human games, AlphaZero (2017) mastered chess and shogi too,
      and MuZero (2020) did it without even being told the rules. Pro Go players now study with AI.` },
  { icon:"🧬", title:"2020 — AlphaFold: AI does real science",
    who:"John Jumper, Demis Hassabis et al. · CASP14 · Nobel Prize in Chemistry 2024",
    lead:"Predicting a protein's 3-D shape from its amino-acid sequence had been a grand challenge for 50 years. AlphaFold 2 did it at nearly experimental accuracy.",
    formula:"sequence + evolutionary alignment  →  attention over residue pairs (Evoformer)  →  3-D coordinates",
    what:`Proteins fold into shapes that determine what they do, and measuring a shape experimentally can take
      years. AlphaFold 2 predicted structures in the CASP14 competition with a median accuracy close to lab
      methods. It is not reinforcement learning, but it came from the same lab and the same scale-and-learn
      culture.`,
    how:`The model uses attention to reason about which pairs of residues sit near each other, using patterns in
      how related proteins have evolved, then builds the 3-D structure and refines it several times.`,
    story:`The organisers of CASP said the problem had been largely solved. DeepMind and EMBL-EBI released
      predicted structures for over 200 million proteins, nearly every known one, free to all. Hassabis and
      Jumper shared the 2024 Nobel Prize in Chemistry with David Baker.`,
    today:`AlphaFold is used by millions of researchers for drug design, enzymes and disease. It is the map's
      clearest node where AI does science rather than games, and the bridge toward AI for physics and
      cosmology.` },
  { icon:"🌱", title:"The era of experience",
    who:"Silver & Sutton · 2025 · RL returns to language models",
    lead:"Language models learned from human data. Their next gains, many argue, will come from RL: learning from their own experience against real feedback.",
    formula:"pre-training (imitate human text)  →  RL on verifiable rewards (solve it, check it, reinforce)",
    what:`Recent "reasoning" models are trained with reinforcement learning on problems whose answers can be
      checked (maths, code). They learn to think step by step for longer, and their performance keeps rising
      with more RL compute.`,
    how:`The ingredients are this field's: a policy, a reward, exploration, and credit assignment over long
      sequences. The environment is now a maths problem or a codebase instead of an Atari screen.`,
    story:`In 2025 David Silver and Richard Sutton published an essay arguing that AI is entering an "era of
      experience", in which agents learn mainly from their own interactions with the world. It is the Bitter
      Lesson applied to data itself.`,
    today:`Game-playing AI was once a side-show. Its methods (self-play, search, value learning) now sit at the
      centre of frontier AI.` }
];

const SOURCES = [
  { type:"THE TEXTBOOK · FREE", title:"Sutton & Barto — Reinforcement Learning: An Introduction (2nd ed.)", note:"The field's standard text, free online.", url:"http://incompleteideas.net/book/the-book.html" },
  { type:"Q-LEARNING · 1992", title:"Watkins & Dayan — Q-learning", note:"The algorithm in Lab 1, with its convergence proof.", url:"https://doi.org/10.1007/BF00992698" },
  { type:"SELF-PLAY · 1995", title:"Gerald Tesauro — Temporal Difference Learning and TD-Gammon", note:"A neural network teaches itself backgammon.", url:"https://doi.org/10.1145/203330.203343" },
  { type:"MCTS · 2006", title:"Kocsis & Szepesvári — Bandit Based Monte-Carlo Planning", note:"UCT: the UCB rule applied to tree search, as in Lab 3.", url:"https://doi.org/10.1007/11871842_29" },
  { type:"DQN · 2015", title:"Mnih et al. — Human-level Control through Deep Reinforcement Learning", note:"Nature 518. Atari from pixels (workshop version: arXiv 1312.5602).", url:"https://doi.org/10.1038/nature14236" },
  { type:"ALPHAGO · 2016", title:"Silver et al. — Mastering the Game of Go with Deep Neural Networks and Tree Search", note:"Nature 529. The system that beat Lee Sedol.", url:"https://doi.org/10.1038/nature16961" },
  { type:"ALPHAGO ZERO · 2017", title:"Silver et al. — Mastering the Game of Go without Human Knowledge", note:"Nature 550. Learning from self-play alone.", url:"https://doi.org/10.1038/nature24270" },
  { type:"ALPHAZERO · 2018", title:"Silver et al. — A General Reinforcement Learning Algorithm that Masters Chess, Shogi, and Go", note:"Science 362. One algorithm, three games.", url:"https://doi.org/10.1126/science.aar6404" },
  { type:"MUZERO · 2020", title:"Schrittwieser et al. — Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model", note:"Nature 588. Planning without knowing the rules.", url:"https://doi.org/10.1038/s41586-020-03051-4" },
  { type:"ALPHAFOLD · 2021", title:"Jumper et al. — Highly Accurate Protein Structure Prediction with AlphaFold", note:"Nature 596. Nobel Prize in Chemistry 2024.", url:"https://doi.org/10.1038/s41586-021-03819-2" }
];

/* ------------------------------------------------------------ LAB 1: Q-learning */
const GW = { w:6, h:5, start:[4, 0], goal:[0, 5], pits:[[1, 3], [3, 3]], walls:[[2, 1], [2, 2], [2, 4]] };
const ACTS = [[-1, 0], [0, 1], [1, 0], [0, -1]], ARROW = ["↑", "→", "↓", "←"];
const isIn = (list, [r, c]) => list.some(([a, b]) => a === r && b === c);
function stepEnv([r, c], a) {
  let nr = r + ACTS[a][0], nc = c + ACTS[a][1];
  if (nr < 0 || nr >= GW.h || nc < 0 || nc >= GW.w || isIn(GW.walls, [nr, nc])) { nr = r; nc = c; }
  if (nr === GW.goal[0] && nc === GW.goal[1]) return [[nr, nc], 10, true];
  if (isIn(GW.pits, [nr, nc])) return [[nr, nc], -10, true];
  return [[nr, nc], -0.2, false];
}
const qLab = {
  kicker:"Q-LEARNING · THE BELLMAN UPDATE", title:"Watch value flow backwards from the goal",
  intro:`The agent starts bottom-left and wants the gold square (+10), avoiding the red pits (−10); every move costs 0.2. It explores with probability ε and otherwise takes its best-known action, updating Q(s,a) after every step. Cells show the best Q-value and the preferred direction. Run episodes and watch the value spread outward from the goal.`,
  html:`<div class="it-control"><label><span>exploration ε</span><output data-o="e">0.20</output></label><input type="range" data-i="e" min="0" max="1" step="0.05" value="0.2"></div>
    <div class="it-control"><label><span>discount γ</span><output data-o="g">0.90</output></label><input type="range" data-i="g" min="0.5" max="0.99" step="0.01" value="0.9"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="one">run 1 episode</button><button class="it-send" data-a="fifty">run 50</button><button class="gk-ghost" data-a="greedy">show greedy path</button><button class="gk-ghost" data-a="reset">forget everything</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`A table works for 30 states. Go has about 10¹⁷⁰, which is why DQN and AlphaGo replace the table with a neural network that generalises from states it has seen to ones it hasn't.`,
  init(root) {
    const q = s => root.querySelector(s), r = rng(9); let Q = {}, eps = 0, rets = [], path = [];
    const key = ([a, b]) => a + "," + b, qv = s => Q[key(s)] || (Q[key(s)] = [0, 0, 0, 0]);
    const best = s => { const v = qv(s); let m = 0; for (let i = 1; i < 4; i++) if (v[i] > v[m]) m = i; return m; };
    function episode() {
      const e = +q('[data-i="e"]').value, g = +q('[data-i="g"]').value; let s = GW.start.slice(), tot = 0;
      for (let t = 0; t < 80; t++) { const a = r() < e ? (r() * 4) | 0 : best(s); const [s2, rw, done] = stepEnv(s, a);
        const target = rw + (done ? 0 : g * Math.max(...qv(s2))); qv(s)[a] += 0.5 * (target - qv(s)[a]); tot += rw; s = s2; if (done) break; }
      eps++; rets.push(tot);
    }
    function greedy() { let s = GW.start.slice(); path = [s]; for (let t = 0; t < 30; t++) { const [s2, , done] = stepEnv(s, best(s)); path.push(s2); s = s2; if (done) break; } }
    function draw() {
      q('[data-o="e"]').textContent = (+q('[data-i="e"]').value).toFixed(2); q('[data-o="g"]').textContent = (+q('[data-i="g"]').value).toFixed(2);
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 210); ctx.clearRect(0, 0, W, H);
      const cs = Math.min((W - 10) / GW.w, (H - 10) / GW.h), ox = (W - cs * GW.w) / 2, oy = 5;
      let vmax = 1; for (const k in Q) vmax = Math.max(vmax, ...Q[k].map(Math.abs));
      for (let rr = 0; rr < GW.h; rr++) for (let cc = 0; cc < GW.w; cc++) {
        const x = ox + cc * cs, y = oy + rr * cs, s = [rr, cc];
        let fill = "rgba(255,255,255,.04)";
        if (isIn(GW.walls, s)) fill = "rgba(154,147,184,.45)";
        else if (isIn(GW.pits, s)) fill = "rgba(255,93,108,.55)";
        else if (rr === GW.goal[0] && cc === GW.goal[1]) fill = "rgba(245,196,81,.8)";
        else if (Q[key(s)]) { const v = Math.max(...Q[key(s)]); fill = v >= 0 ? `rgba(63,208,201,${(Math.min(1, v / vmax) * .7).toFixed(2)})` : `rgba(255,120,71,${(Math.min(1, -v / vmax) * .5).toFixed(2)})`; }
        ctx.fillStyle = fill; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        if (!isIn(GW.walls, s) && !isIn(GW.pits, s) && !(rr === GW.goal[0] && cc === GW.goal[1]) && Q[key(s)]) {
          ctx.fillStyle = C.ink; ctx.font = `${Math.round(cs * .32)}px IBM Plex Mono, monospace`; ctx.textAlign = "center";
          ctx.fillText(ARROW[best(s)], x + cs / 2, y + cs * .48); ctx.font = `${Math.round(cs * .17)}px IBM Plex Mono, monospace`; ctx.fillStyle = C.dim;
          ctx.fillText(Math.max(...Q[key(s)]).toFixed(1), x + cs / 2, y + cs * .8); ctx.textAlign = "left";
        }
        if (rr === GW.start[0] && cc === GW.start[1]) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x + 3, y + 3, cs - 6, cs - 6); }
      }
      if (path.length > 1) { ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); path.forEach(([a, b], i) => { const x = ox + b * cs + cs / 2, y = oy + a * cs + cs / 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
      const last = rets.slice(-20), avg = last.length ? last.reduce((a, b) => a + b, 0) / last.length : 0;
      q('[data-role="out"]').innerHTML = `episodes: <span class="g">${eps}</span>   ·   average return (last 20): <span class="${avg > 5 ? "t" : "r"}">${avg.toFixed(2)}</span>\n<span class="d">best possible ≈ ${(10 - 0.2 * 8).toFixed(1)} (8 moves to the goal)</span>`;
    }
    q('[data-a="one"]').addEventListener("click", () => { episode(); path = []; draw(); });
    q('[data-a="fifty"]').addEventListener("click", () => { for (let i = 0; i < 50; i++) episode(); path = []; draw(); });
    q('[data-a="greedy"]').addEventListener("click", () => { greedy(); draw(); });
    q('[data-a="reset"]').addEventListener("click", () => { Q = {}; eps = 0; rets = []; path = []; draw(); });
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw));
    draw();
  }
};

/* -------------------------------------------------------------- LAB 2: bandit */
function gammaSample(k, r) {            // Marsaglia–Tsang, k ≥ 1
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) { let x, v; do { x = GuideKit.gauss(r); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = r();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
}
const betaSample = (a, b, r) => { const x = gammaSample(a, r), y = gammaSample(b, r); return x / (x + y); };
function banditRun(alg, probs, T, eps, seed) {
  const r = rng(seed), K = probs.length, n = Array(K).fill(0), s = Array(K).fill(0), bestP = Math.max(...probs), reg = new Float64Array(T); let R = 0;
  for (let t = 1; t <= T; t++) {
    let a = 0;
    if (alg === "eg") { if (t <= K) a = t - 1; else if (r() < eps) a = (r() * K) | 0; else for (let i = 1; i < K; i++) if (s[i] / n[i] > s[a] / n[a]) a = i; }
    else if (alg === "ucb") { if (t <= K) a = t - 1; else { let bv = -1; for (let i = 0; i < K; i++) { const v = s[i] / n[i] + Math.sqrt(2 * Math.log(t) / n[i]); if (v > bv) { bv = v; a = i; } } } }
    else { let bv = -1; for (let i = 0; i < K; i++) { const v = betaSample(1 + s[i], 1 + n[i] - s[i], r); if (v > bv) { bv = v; a = i; } } }
    n[a]++; s[a] += r() < probs[a] ? 1 : 0; R += bestP - probs[a]; reg[t - 1] = R;
  }
  return { reg, n };
}
const banditLab = {
  kicker:"EXPLORE OR EXPLOIT", title:"Five slot machines, three strategies",
  intro:`Each arm pays 1 with a hidden probability. ε-greedy mostly pulls its current favourite and explores at random a fraction ε of the time. UCB1 pulls the arm with the highest optimistic estimate. Thompson sampling (proposed in 1933) draws a plausible payout rate for each arm from its posterior and pulls the best draw. The curves show regret (reward lost compared with always pulling the best arm), averaged over 20 runs.`,
  html:`<div class="it-control"><label><span>ε for ε-greedy</span><output data-o="e">0.10</output></label><input type="range" data-i="e" min="0" max="0.5" step="0.01" value="0.1"></div>
    <div class="it-control"><label><span>pulls per run</span><output data-o="t">3000</output></label><input type="range" data-i="t" min="200" max="6000" step="100" value="3000"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ race again</button><button class="gk-ghost" data-a="new">new machines</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`What the curves show honestly: ε-greedy's regret grows in a straight line forever, because it never stops exploring bad arms. UCB1 and Thompson grow only logarithmically, but UCB1 explores heavily early on, so over short runs a well-tuned ε-greedy can beat it. Thompson sampling is usually best in practice.`,
  init(root) {
    const q = s => root.querySelector(s); let seed = 3, probs = [];
    const newArms = () => { const r = rng(seed * 97); probs = Array.from({ length:5 }, () => +(0.15 + r() * 0.7).toFixed(2)); };
    const ALGS = [["eg", "ε-greedy", C.red], ["ucb", "UCB1", C.teal], ["ts", "Thompson", C.gold]];
    function race() {
      const eps = +q('[data-i="e"]').value, T = +q('[data-i="t"]').value; q('[data-o="e"]').textContent = eps.toFixed(2); q('[data-o="t"]').textContent = T;
      const res = {};
      for (const [k] of ALGS) { const avg = new Float64Array(T), nsum = Array(5).fill(0);
        for (let run = 0; run < 20; run++) { const o = banditRun(k, probs, T, eps, seed * 1000 + run * 7 + k.length); o.reg.forEach((v, i) => avg[i] += v / 20); o.n.forEach((v, i) => nsum[i] += v / 20); }
        res[k] = { reg:avg, n:nsum }; }
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 170); ctx.clearRect(0, 0, W, H);
      const mx = Math.max(1, ...ALGS.map(([k]) => res[k].reg[T - 1]));
      const stride = Math.max(1, Math.floor(T / 400));
      ALGS.forEach(([k, , col]) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < T; i += stride) { const x = 30 + i / T * (W - 40), y = H - 18 - res[k].reg[i] / mx * (H - 30); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); });
      ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillStyle = C.dim; ctx.fillText("average cumulative regret", 4, 12); ctx.fillText("pulls →", W - 50, H - 4);
      ALGS.forEach(([, name, col], i) => { ctx.fillStyle = col; ctx.fillText(name, 36, 26 + i * 12); });
      const bi = probs.indexOf(Math.max(...probs));
      q('[data-role="out"]').innerHTML = `hidden payout rates: ${probs.map((p, i) => i === bi ? `<span class="g">${p}</span>` : p).join("  ")}\n` +
        ALGS.map(([k, name]) => `${name.padEnd(9)} regret <span class="${k === "eg" ? "r" : "t"}">${res[k].reg[T - 1].toFixed(1).padStart(6)}</span>   pulls on the best arm ${(res[k].n[bi] / T * 100).toFixed(0)}%`).join("\n");
    }
    q('[data-a="run"]').addEventListener("click", () => { seed++; race(); });
    q('[data-i="e"]').addEventListener("change", race); q('[data-i="t"]').addEventListener("change", race);
    q('[data-i="e"]').addEventListener("input", () => { q('[data-o="e"]').textContent = (+q('[data-i="e"]').value).toFixed(2); });
    q('[data-i="t"]').addEventListener("input", () => { q('[data-o="t"]').textContent = q('[data-i="t"]').value; });
    q('[data-a="new"]').addEventListener("click", () => { seed += 17; newArms(); race(); });
    newArms(); race();
  }
};

/* ---------------------------------------------------------------- LAB 3: MCTS */
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b) { for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.every(Boolean) ? "draw" : null; }
function mcts(board, me, iters, r) {
  const other = p => p === "X" ? "O" : "X";
  const root = { b:board.slice(), turn:me, n:0, w:0, kids:null, move:-1, parent:null };
  const expand = nd => { nd.kids = []; nd.b.forEach((v, i) => { if (!v) { const b = nd.b.slice(); b[i] = nd.turn; nd.kids.push({ b, turn:other(nd.turn), n:0, w:0, kids:null, move:i, parent:nd }); } }); };
  for (let it = 0; it < iters; it++) {
    let nd = root;
    while (nd.kids && nd.kids.length && !winner(nd.b)) {
      let best = null, bv = -Infinity;
      for (const k of nd.kids) { const v = k.n === 0 ? Infinity : k.w / k.n + 1.4 * Math.sqrt(Math.log(nd.n) / k.n); if (v > bv) { bv = v; best = k; } }
      nd = best;
    }
    if (!winner(nd.b) && !nd.kids) { expand(nd); if (nd.kids.length) nd = nd.kids[(r() * nd.kids.length) | 0]; }
    const b = nd.b.slice(); let t = nd.turn, w = winner(b);
    while (!w) { const free = b.map((v, i) => v ? -1 : i).filter(i => i >= 0); b[free[(r() * free.length) | 0]] = t; t = other(t); w = winner(b); }
    while (nd) { nd.n++; const mover = nd.parent ? nd.parent.turn : null; if (mover) nd.w += w === "draw" ? 0.5 : (w === mover ? 1 : 0); nd = nd.parent; }
  }
  return root.kids.map(k => ({ move:k.move, n:k.n, v:k.n ? k.w / k.n : 0 })).sort((a, b) => b.n - a.n);
}
const mctsLab = {
  kicker:"MONTE CARLO TREE SEARCH · ALPHAGO'S ENGINE", title:"Play tic-tac-toe against tree search",
  intro:`You are X. The computer (O) runs Monte Carlo tree search: it grows a tree of possible continuations, finishes each with random play, and steers future simulations toward moves that won more often (the UCB rule from Lab 2). Set its thinking budget: with 10 simulations it blunders; with a few thousand it never loses. The numbers on the board show how often it visited each move.`,
  html:`<div class="it-control"><label><span>simulations per move</span><output data-o="s">400</output></label><input type="range" data-i="s" min="10" max="4000" step="10" value="400"></div>
    <div class="gk-cells" data-role="board" style="grid-template-columns:repeat(3,1fr);max-width:210px"></div>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="new">new game</button><button class="gk-ghost" data-a="first">let the computer start</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`AlphaGo used exactly this search, with two changes: a policy network decides which moves are worth expanding, and a value network replaces the random playouts. That made search in Go (about 250 legal moves per turn) practical.`,
  init(root) {
    const q = s => root.querySelector(s), r = rng(12); let board = Array(9).fill(null), stats = [], score = { you:0, ai:0, draw:0 };
    const grid = q('[data-role="board"]'); grid.innerHTML = Array.from({ length:9 }, (_, i) => `<div class="gk-cell" data-c="${i}" style="font-size:1.4rem"></div>`).join("");
    const cells = [...grid.children];
    function draw(msg) {
      const w = winner(board);
      cells.forEach((c, i) => { const st = stats.find(s => s.move === i);
        c.innerHTML = board[i] ? `<span style="color:${board[i] === "X" ? C.gold : C.teal}">${board[i]}</span>` : st ? `<span style="font-size:.6rem;color:${C.dim}">${st.n}</span>` : ""; });
      q('[data-o="s"]').textContent = q('[data-i="s"]').value;
      q('[data-role="out"]').innerHTML = (msg || (w ? (w === "draw" ? "draw." : w === "X" ? "<span class='g'>you win!</span>" : "<span class='t'>the search wins.</span>") : "your move (X).")) +
        (stats.length ? `\nlast search: best move visited ${stats[0].n} times, estimated win rate ${(stats[0].v * 100).toFixed(0)}%` : "") +
        `\n<span class="d">score: you ${score.you} · search ${score.ai} · draws ${score.draw}</span>`;
    }
    function tally() { const w = winner(board); if (w === "X") score.you++; else if (w === "O") score.ai++; else if (w === "draw") score.draw++; }
    function aiMove() { stats = mcts(board, "O", +q('[data-i="s"]').value, r); board[stats[0].move] = "O"; if (winner(board)) tally(); }
    cells.forEach((c, i) => c.addEventListener("click", () => {
      if (board[i] || winner(board)) return; board[i] = "X";
      if (winner(board)) { tally(); stats = []; draw(); return; }
      aiMove(); draw();
    }));
    q('[data-i="s"]').addEventListener("input", () => draw(" "));
    q('[data-a="new"]').addEventListener("click", () => { board = Array(9).fill(null); stats = []; draw(); });
    q('[data-a="first"]').addEventListener("click", () => { board = Array(9).fill(null); aiMove(); draw(); });
    draw();
  }
};

register("deeprl", {
  kicker:"DEEP RL & GAMES · 1989–NOW · ABOUT 50 MIN",
  hook:"In game 2 against Lee Sedol, AlphaGo played a move its own network judged a human would choose once in ten thousand times. It won the game, and Go players have studied that move ever since.",
  intro:`Reinforcement learning learns from reward instead of labels: act, see what happens, do more of what worked. Games were its proving ground, from backgammon to Atari to Go, and the same methods then folded proteins and now train reasoning in language models. Three labs below: watch Q-learning spread value from a goal, race two strategies on a slot-machine problem, and play tic-tac-toe against the tree search inside AlphaGo.`,
  timeline:[[1989, "Q-learning"], [1992, "TD-Gammon"], [2013, "DQN plays Atari"], [2016, "AlphaGo · Move 37"], [2020, "AlphaFold 2"]],
  labs:[qLab, banditLab, mctsLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, run one episode at a time and watch the first non-zero values appear next to the goal, then spread backwards. That spreading is the Bellman equation at work.",
    "Still in Lab 1, set ε to 0 before any training. The agent never explores, and often never finds the goal at all.",
    "In Lab 2, set ε to 0 and race a few times: pure greed often locks onto the wrong arm. Then set pulls to 6000 and compare the shapes: ε-greedy climbs in a straight line while the other two flatten.",
    "In Lab 3, set simulations to 10 and try to win. Then set 4000 and try again: more search makes it unbeatable (tic-tac-toe is a draw with perfect play).",
    "Watch the numbers on the board in Lab 3: the search concentrates its visits on a few promising moves, exactly as AlphaGo concentrated on Move 37.",
    "Read the AlphaFold abstract in the sources, and follow the map's gold bridge from here to the Bellman node in Algorithms."
  ],
  sources:SOURCES
});
})();
