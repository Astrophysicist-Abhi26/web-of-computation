// AGENTS & DECISION THEORY — von Neumann's games, Nash's equilibria, Bellman's
// Markov decision processes, Axelrod's tournaments, and the LLM agents now
// rediscovering them. Three real labs: a 2×2 game explorer that finds pure and
// mixed Nash equilibria, Axelrod's iterated prisoner's dilemma tournament with
// noise, and value iteration on a small decision process, backup by backup.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"♠", title:"1928–1944 — von Neumann turns strategy into mathematics",
    who:"John von Neumann · minimax theorem 1928 · with Oskar Morgenstern 1944",
    lead:"Games of strategy (poker, war, markets) have a precise mathematical structure. In a two-player zero-sum game, there is always a best way to play, even if it involves randomising.",
    formula:"max_p min_q  pᵀ A q  =  min_q max_p  pᵀ A q      (minimax theorem, 1928)",
    what:`Von Neumann proved that every finite two-player zero-sum game has a value and optimal (possibly random)
      strategies for both sides. With Morgenstern he then wrote "Theory of Games and Economic Behavior" (1944),
      which also axiomatised expected utility: how a rational agent should choose under uncertainty.`,
    how:`Randomising is essential: in matching pennies any predictable strategy loses, so the optimal play is to
      flip a coin. Lab 1 finds these mixed strategies for any 2×2 game you type in.`,
    story:`The book was 600 pages of dense mathematics and still became a landmark; the RAND Corporation applied it
      to Cold War nuclear strategy. The minimax idea is the same one inside game-tree search in the Symbolic AI
      guide.`,
    today:`Expected utility is still the formal definition of a rational agent in AI textbooks. Game-theoretic
      solvers now beat professionals at poker (Libratus 2017, Pluribus 2019).` },
  { icon:"⚖", title:"1950 — Nash equilibrium",
    who:"John Nash · PNAS 1950 · Nobel Prize in Economics 1994",
    lead:"In games that aren't zero-sum, a stable outcome is one where no player can do better by changing strategy alone. Nash proved one always exists.",
    formula:"(s₁*, s₂*) is a Nash equilibrium  ⇔  uᵢ(sᵢ*, s₋ᵢ*) ≥ uᵢ(sᵢ, s₋ᵢ*) for every player i and every alternative sᵢ",
    what:`A Nash equilibrium is a set of strategies, one per player, such that each is a best response to the
      others. Nash's one-page 1950 proof (using a fixed-point theorem) showed every finite game has at least one,
      possibly mixed.`,
    how:`Equilibria need not be good for everyone. In the prisoner's dilemma both players defect even though both
      would prefer mutual cooperation. That gap between individual and collective rationality is the central
      puzzle of cooperation.`,
    story:`Nash's thesis was 27 pages. His later struggle with schizophrenia and recovery were told in "A Beautiful
      Mind". He shared the 1994 Nobel Prize in Economics with John Harsanyi and Reinhard Selten.`,
    today:`GANs (Deep Learning guide) are a two-player game solved by searching for a Nash equilibrium, and
      multi-agent AI safety research asks what equilibria AI systems will settle into when they interact.` },
  { icon:"🗺", title:"1957 — Markov decision processes",
    who:"Richard Bellman · RAND · 'A Markovian Decision Process'",
    lead:"States, actions, transition probabilities and rewards: the mathematical language of sequential decisions. Everything in reinforcement learning is written in it.",
    formula:"V*(s) = maxₐ Σₛ′ P(s′ | s, a) [ R(s, a, s′) + γ V*(s′) ]      (the Bellman optimality equation)",
    what:`An MDP describes an agent that at each step observes a state, picks an action, and lands in a new state
      (perhaps at random) with a reward. The goal is a policy that maximises long-run reward. Value iteration
      solves it by applying the Bellman equation repeatedly until values settle. Watch it in Lab 3.`,
    how:`"Markov" means the future depends only on the present state, not the history. Bellman's dynamic
      programming solves MDPs exactly when the model is known; reinforcement learning (the Deep RL guide) solves
      them from experience when it isn't.`,
    story:`Bellman chose the name "dynamic programming" partly because, as he later wrote, the Secretary of Defense
      of the time was hostile to the word "research"; the map's topic note records the joke.`,
    today:`MDPs model robot control, inventory, medical treatment plans and the reinforcement learning that
      fine-tunes language models (where each generated token is an action).` },
  { icon:"🤝", title:"1980 — Axelrod's tournament and the evolution of cooperation",
    who:"Robert Axelrod · University of Michigan · with W. D. Hamilton, Science 1981",
    lead:"Axelrod invited experts to submit programs for a repeated prisoner's dilemma. The winner was the shortest one: Tit for Tat.",
    formula:"Tit for Tat:  cooperate first, then copy the opponent's previous move",
    what:`When the prisoner's dilemma is repeated, cooperation can pay because defection invites retaliation.
      Anatol Rapoport's four-line Tit for Tat won both of Axelrod's tournaments. Run your own tournament in
      Lab 2.`,
    how:`Axelrod identified what successful strategies shared: nice (never defect first), retaliatory, forgiving
      and clear. Add noise (accidental defections) and Tit for Tat can fall into endless revenge cycles;
      forgiving variants then do better.`,
    story:`"The Evolution of Cooperation" (1984) influenced biology, economics and international relations; the
      Science paper with the evolutionary biologist W. D. Hamilton won a prize for interdisciplinary research.`,
    today:`Multi-agent AI research uses the same tournaments to test whether AI agents (including LLMs) cooperate,
      exploit or collude with each other.` },
  { icon:"🤖", title:"The rational agent — AI's unifying definition",
    who:"Russell & Norvig · Artificial Intelligence: A Modern Approach · 1995",
    lead:"The standard textbook redefined AI as the study of agents that perceive and act to maximise expected performance, pulling search, logic, probability and learning into one frame.",
    formula:"agent: percepts → actions,  chosen to maximise expected utility given what it knows",
    what:`An agent perceives its environment through sensors and acts on it through actuators. A rational agent
      chooses the action with the highest expected utility. This definition covers a chess program, a
      thermostat, a trading bot and a robot.`,
    how:`Environments differ: fully or partially observable, deterministic or stochastic, single or multi-agent.
      Each combination calls for different tools: search, planning, MDPs, POMDPs, game theory.`,
    story:`AIMA became the most widely used AI textbook, taught at well over a thousand universities. Stuart
      Russell later wrote "Human Compatible" (2019), arguing that maximising a fixed objective is dangerous if
      the objective is slightly wrong.`,
    today:`Russell's alternative (agents that are uncertain about human preferences and learn them) connects
      decision theory to today's alignment research and RLHF.` },
  { icon:"🧟", title:"LLM agents — the formalism rises again",
    who:"ReAct (Yao et al.) 2022 · Generative Agents (Park et al.) 2023 · tool-using agents",
    lead:"Give a language model a goal, tools and a memory, and let it act in a loop. Suddenly every question from agent theory (planning, beliefs, cooperation, incentives) is urgent again.",
    formula:"loop:  think → act (call a tool) → observe → update → … until the goal is met",
    what:`LLM agents interleave reasoning with actions such as web searches, running code or editing files. In
      the "Generative Agents" experiment, 25 language-model characters in a simulated town planned their days,
      remembered conversations and organised a party.`,
    how:`The hard parts are the ones decision theory predicted: long-horizon planning, credit assignment when
      things go wrong, uncertainty about the world, and what happens when many agents with different goals
      interact.`,
    story:`The map marks this field 🧟 revived: multi-agent systems research from the 1980s–2000s (BDI agents,
      negotiation, mechanism design) is being re-read by people building agent swarms.`,
    today:`Agents now write and fix software, browse the web and run experiments. Their reliability, and how
      they behave in groups, are among the most active research questions in AI.` }
];

const SOURCES = [
  { type:"THE MINIMAX THEOREM · 1928", title:"John von Neumann — Zur Theorie der Gesellschaftsspiele", note:"Mathematische Annalen 100. The founding paper of game theory.", url:"https://doi.org/10.1007/BF01448847" },
  { type:"THE BOOK · 1944", title:"von Neumann & Morgenstern — Theory of Games and Economic Behavior", note:"Game theory and expected utility.", url:"https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior" },
  { type:"NASH EQUILIBRIUM · 1950", title:"John Nash — Equilibrium Points in n-Person Games", note:"PNAS 36(1). One page that reshaped economics.", url:"https://doi.org/10.1073/pnas.36.1.48" },
  { type:"MDPs · 1957", title:"Richard Bellman — A Markovian Decision Process", note:"Journal of Mathematics and Mechanics 6(5).", url:"https://www.jstor.org/stable/24900506" },
  { type:"COOPERATION · 1981", title:"Axelrod & Hamilton — The Evolution of Cooperation", note:"Science 211. Tit for Tat and the iterated prisoner's dilemma.", url:"https://doi.org/10.1126/science.7466396" },
  { type:"THE TEXTBOOK", title:"Russell & Norvig — Artificial Intelligence: A Modern Approach", note:"AI as the study of rational agents.", url:"https://aima.cs.berkeley.edu/" },
  { type:"LECTURES · FREE", title:"David Silver — UCL Course on Reinforcement Learning", note:"MDPs and dynamic programming, beautifully explained. Lab 3's MDP is in the spirit of his 'student MDP'.", url:"https://www.davidsilver.uk/teaching/" },
  { type:"LLM AGENTS · 2022", title:"Yao et al. — ReAct: Synergizing Reasoning and Acting in Language Models", note:"Interleaving thoughts with tool calls.", url:"https://arxiv.org/abs/2210.03629" },
  { type:"GENERATIVE AGENTS · 2023", title:"Park et al. — Generative Agents: Interactive Simulacra of Human Behavior", note:"25 LLM characters living in a simulated town.", url:"https://arxiv.org/abs/2304.03442" }
];

/* ------------------------------------------------------ LAB 1: 2×2 games */
const PRESETS = {
  "prisoner's dilemma":[[[3, 3], [0, 5]], [[5, 0], [1, 1]]], "stag hunt":[[[4, 4], [0, 3]], [[3, 0], [3, 3]]],
  "matching pennies":[[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]], "chicken":[[[0, 0], [-1, 1]], [[1, -1], [-10, -10]]],
  "battle of the sexes":[[[3, 2], [0, 0]], [[0, 0], [2, 3]]]
};
function nash(P) {
  const pure = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (P[i][j][0] >= P[1 - i][j][0] && P[i][j][1] >= P[i][1 - j][1]) pure.push([i, j]);
  // mixed: row mixes p on row 0 to make column indifferent; column mixes q to make row indifferent
  const dq = (P[0][0][0] - P[0][1][0]) - (P[1][0][0] - P[1][1][0]), dp = (P[0][0][1] - P[1][0][1]) - (P[0][1][1] - P[1][1][1]);
  let mixed = null;
  if (Math.abs(dq) > 1e-9 && Math.abs(dp) > 1e-9) { const q = (P[1][1][0] - P[0][1][0]) / dq, p = (P[1][1][1] - P[1][0][1]) / dp; if (p > 1e-9 && p < 1 - 1e-9 && q > 1e-9 && q < 1 - 1e-9) mixed = [p, q]; }
  return { pure, mixed };
}
const gameLab = {
  kicker:"GAME THEORY · FIND THE EQUILIBRIA", title:"Edit a 2×2 game and find its Nash equilibria",
  intro:`Two players each choose one of two actions; each cell shows (row player's payoff, column player's payoff). Pick a classic game or edit the payoffs. The lab finds every pure Nash equilibrium (no one gains by switching alone) and the mixed one, if it exists, where each player randomises to leave the other indifferent.`,
  html:`<div class="gk-chips" data-role="pre">${Object.keys(PRESETS).map((k, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-k="${k}">${k}</button>`).join("")}</div>
    <table class="gk-table" data-role="tab"></table>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`In the prisoner's dilemma the only equilibrium is (defect, defect), even though (cooperate, cooperate) is better for both. That gap between what is individually rational and what is collectively best is exactly what Lab 2's repeated game can close.`,
  init(root) {
    const q = s => root.querySelector(s); let P = JSON.parse(JSON.stringify(PRESETS["prisoner's dilemma"])), labels = [["cooperate", "defect"], ["cooperate", "defect"]];
    const LBL = { "prisoner's dilemma":["cooperate", "defect"], "stag hunt":["stag", "hare"], "matching pennies":["heads", "tails"], "chicken":["swerve", "straight"], "battle of the sexes":["opera", "football"] };
    function draw() {
      const N = nash(P), isEq = (i, j) => N.pure.some(([a, b]) => a === i && b === j);
      q('[data-role="tab"]').innerHTML = `<tr><th></th><th>${labels[1][0]}</th><th>${labels[1][1]}</th></tr>` + [0, 1].map(i => `<tr><th>${labels[0][i]}</th>` + [0, 1].map(j =>
        `<td class="${isEq(i, j) ? "hl" : ""}"><input class="gk-input" style="width:2.6rem;text-align:center;padding:.2rem" data-c="${i}${j}0" value="${P[i][j][0]}"> , <input class="gk-input" style="width:2.6rem;text-align:center;padding:.2rem" data-c="${i}${j}1" value="${P[i][j][1]}"></td>`).join("") + "</tr>").join("");
      q('[data-role="tab"]').querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => { const [i, j, k] = inp.dataset.c.split("").map(Number); P[i][j][k] = +inp.value || 0; draw(); }));
      q('[data-role="out"]').innerHTML = (N.pure.length ? `pure Nash equilibria: ${N.pure.map(([i, j]) => `<span class="g">(${labels[0][i]}, ${labels[1][j]})</span> → payoffs ${P[i][j].join(", ")}`).join("\n                      ")}` : `<span class="r">no pure equilibrium</span>`) +
        `\n` + (N.mixed ? `mixed equilibrium: row plays ${labels[0][0]} with p = <span class="t">${N.mixed[0].toFixed(2)}</span>, column plays ${labels[1][0]} with q = <span class="t">${N.mixed[1].toFixed(2)}</span>` : `<span class="d">no fully mixed equilibrium</span>`);
    }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { P = JSON.parse(JSON.stringify(PRESETS[b.dataset.k])); labels = [LBL[b.dataset.k], LBL[b.dataset.k]]; root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    draw();
  }
};

/* ------------------------------------------------------ LAB 2: tournament */
const STRATS = {
  "Tit for Tat":(me, op) => op.length ? op[op.length - 1] : "C",
  "Always defect":() => "D", "Always cooperate":() => "C",
  "Grim trigger":(me, op) => op.includes("D") ? "D" : "C",
  "Generous TfT":(me, op, r) => !op.length || op[op.length - 1] === "C" ? "C" : (r() < .3 ? "C" : "D"),
  "Pavlov (win-stay)":(me, op) => !me.length ? "C" : (me[me.length - 1] === op[op.length - 1] ? "C" : "D"),
  "Random":(me, op, r) => r() < .5 ? "C" : "D",
  "Tit for two Tats":(me, op) => op.length >= 2 && op[op.length - 1] === "D" && op[op.length - 2] === "D" ? "D" : "C"
};
const PAY = { CC:[3, 3], CD:[0, 5], DC:[5, 0], DD:[1, 1] };
const tourLab = {
  kicker:"AXELROD'S TOURNAMENT · 1980", title:"Run a round-robin of the repeated prisoner's dilemma",
  intro:`Every strategy plays every other (and a copy of itself) for 200 rounds; payoffs are 3 each for mutual cooperation, 1 each for mutual defection, and 5 vs 0 when one defects on a cooperator. Add noise (a chance that any move is flipped by mistake) and see which strategies stay on top.`,
  html:`<div class="it-control"><label><span>noise (chance a move is flipped)</span><output data-o="n">0%</output></label><input type="range" data-i="n" min="0" max="0.15" step="0.01" value="0"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ run the tournament</button></div>
    <div class="gk-bars" data-role="bars"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Winning a tournament depends on who else enters: Always-defect does well against suckers and badly against retaliators. Axelrod's point was that 'nice, retaliatory, forgiving and clear' strategies do well across many different populations.`,
  init(root) {
    const q = s => root.querySelector(s);
    function run() {
      const noise = +q('[data-i="n"]').value; q('[data-o="n"]').textContent = Math.round(noise * 100) + "%";
      const names = Object.keys(STRATS), score = Object.fromEntries(names.map(n => [n, 0])), r = rng(42); let cc = 0, tot = 0;
      for (let a = 0; a < names.length; a++) for (let b = a; b < names.length; b++) {
        const ha = [], hb = [];
        for (let t = 0; t < 200; t++) {
          let x = STRATS[names[a]](ha, hb, r), y = STRATS[names[b]](hb, ha, r);
          if (r() < noise) x = x === "C" ? "D" : "C"; if (r() < noise) y = y === "C" ? "D" : "C";
          ha.push(x); hb.push(y); const [pa, pb] = PAY[x + y]; score[names[a]] += pa; if (a !== b) score[names[b]] += pb; if (x === "C" && y === "C") cc++; tot++;
        }
      }
      const ranked = names.map(n => [n, score[n] / names.length / 200]).sort((a, b) => b[1] - a[1]);
      q('[data-role="bars"]').innerHTML = ranked.map(([n, s], i) => `<div class="gk-bar"><span>${n}</span><span class="trk"><span class="fill" style="display:block;width:${(s / 5 * 100).toFixed(0)}%;background:${i === 0 ? C.gold : C.teal}"></span></span><span class="v">${s.toFixed(2)}</span></div>`).join("");
      q('[data-role="out"]').innerHTML = `winner: <span class="g">${ranked[0][0]}</span> (average ${ranked[0][1].toFixed(2)} points per round; 3.00 = constant mutual cooperation)\nmutual cooperation happened in <span class="t">${(cc / tot * 100).toFixed(0)}%</span> of all rounds`;
    }
    q('[data-a="run"]').addEventListener("click", run); q('[data-i="n"]').addEventListener("input", run); run();
  }
};

/* --------------------------------------------------- LAB 3: value iteration */
// A small "study" MDP in the spirit of David Silver's student MDP.
const S = ["Lecture 1", "Lecture 2", "Lecture 3", "Phone", "Done"];
const A = {
  "Lecture 1":[["study", [["Lecture 2", 1]], -2], ["scroll phone", [["Phone", 1]], -1]],
  "Lecture 2":[["study", [["Lecture 3", 1]], -2], ["sleep", [["Done", 1]], 0]],
  "Lecture 3":[["study", [["Done", 1]], 10], ["go to the pub", [["Lecture 1", .2], ["Lecture 2", .4], ["Lecture 3", .4]], 1]],
  "Phone":[["keep scrolling", [["Phone", 1]], -1], ["put it down", [["Lecture 1", 1]], 0]],
  "Done":[]
};
const viLab = {
  kicker:"MDPs · VALUE ITERATION", title:"Solve a decision process one Bellman backup at a time",
  intro:`A student can study, sleep, scroll a phone or go to the pub; each action has a reward and may lead to different states with some probability. Value iteration starts with every value at 0 and repeatedly applies V(s) ← maxₐ Σ P(s′) [R + γ V(s′)]. Step through it and watch the values and the best action in each state settle.`,
  html:`<div class="it-control"><label><span>discount γ</span><output data-o="g">1.00</output></label><input type="range" data-i="g" min="0.5" max="1" step="0.01" value="1"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="step">one sweep</button><button class="it-send" data-a="all">run to convergence</button><button class="gk-ghost" data-a="reset">reset to 0</button></div>
    <table class="gk-table" data-role="tab"></table>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`This is dynamic programming with a known model. Reinforcement learning (Q-learning in the Deep RL guide) solves the same equation without knowing the probabilities, by learning them implicitly from experience.`,
  init(root) {
    const q = s => root.querySelector(s); let V = Object.fromEntries(S.map(s => [s, 0])), sweeps = 0, delta = 0;
    const qv = (s, [, outs, r], g) => outs.reduce((a, [s2, p]) => a + p * (r + g * V[s2]), 0);
    function sweep() { const g = +q('[data-i="g"]').value, nv = {}; delta = 0;
      S.forEach(s => { nv[s] = A[s].length ? Math.max(...A[s].map(a => qv(s, a, g))) : 0; delta = Math.max(delta, Math.abs(nv[s] - V[s])); }); V = nv; sweeps++; }
    function draw() {
      const g = +q('[data-i="g"]').value; q('[data-o="g"]').textContent = g.toFixed(2);
      q('[data-role="tab"]').innerHTML = `<tr><th>state</th><th>V(s)</th><th>best action</th><th>action values</th></tr>` + S.map(s => {
        if (!A[s].length) return `<tr><td class="tl">${s}</td><td>0.00</td><td>—</td><td class="tl">terminal</td></tr>`;
        const vals = A[s].map(a => [a[0], qv(s, a, g)]), best = vals.reduce((a, b) => b[1] > a[1] ? b : a);
        return `<tr><td class="tl">${s}</td><td class="hl">${V[s].toFixed(2)}</td><td>${best[0]}</td><td class="tl">${vals.map(([n, v]) => `${n}: ${v.toFixed(2)}`).join(" · ")}</td></tr>`;
      }).join("");
      q('[data-role="out"]').innerHTML = `sweeps: <span class="g">${sweeps}</span>   ·   largest change in the last sweep: <span class="${delta < 1e-3 && sweeps ? "t" : "r"}">${sweeps ? delta.toFixed(4) : "–"}</span>${delta < 1e-3 && sweeps ? "   ✓ converged" : ""}\n<span class="d">rewards: study −2 (but +10 for finishing), scroll −1, pub +1 (and you end up back in some lecture at random)</span>`;
    }
    q('[data-a="step"]').addEventListener("click", () => { sweep(); draw(); });
    q('[data-a="all"]').addEventListener("click", () => { for (let i = 0; i < 500; i++) { sweep(); if (delta < 1e-6) break; } draw(); });
    q('[data-a="reset"]').addEventListener("click", () => { V = Object.fromEntries(S.map(s => [s, 0])); sweeps = 0; delta = 0; draw(); });
    q('[data-i="g"]').addEventListener("input", draw);
    draw();
  }
};

register("decision", {
  kicker:"AGENTS & DECISION THEORY · 1928–NOW · ABOUT 40 MIN",
  hook:"The winner of a 1980 tournament of strategy programs, submitted by experts from several fields, was four lines long: cooperate first, then do whatever your opponent did last time.",
  intro:`Before AI could build agents, mathematicians had to say what a good decision is. Von Neumann's game theory, Nash's equilibria and Bellman's Markov decision processes gave precise answers, and they became the foundations of reinforcement learning and multi-agent AI. LLM agents that plan, use tools and negotiate are now bringing that 'dusty formalism' back to the centre. Three labs below: find the equilibria of classic games, run Axelrod's tournament, and solve a decision process by value iteration.`,
  timeline:[[1928, "minimax theorem"], [1944, "Theory of Games"], [1950, "Nash equilibrium"], [1957, "MDPs"], [1980, "Axelrod's tournament"], [2023, "LLM agents"]],
  labs:[gameLab, tourLab, viLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, load matching pennies: there is no pure equilibrium, and the mixed one is exactly 50–50. Any predictable player can be exploited.",
    "Load chicken in Lab 1: it has two pure equilibria and a mixed one. Change the crash payoff from −10 to −100 and watch the mixed strategy become more cautious.",
    "In Lab 2, note the ranking with no noise (here Grim trigger narrowly leads Tit for Tat), then run with 5% and 10%. Unforgiving strategies suffer once mistakes trigger revenge cycles: watch who rises.",
    "In Lab 3, run to convergence with γ = 1 and read the best action in Lecture 3. Then set γ = 0.6: the far-off reward matters less, and the best choices change.",
    "Read the ReAct abstract (sources) and map its loop onto the MDP of Lab 3: what are the states, actions and rewards for an LLM agent?"
  ],
  sources:SOURCES
});
})();
