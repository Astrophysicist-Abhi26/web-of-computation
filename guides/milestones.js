// CLASSIC MILESTONES — the symbolic dream's high-water marks: Deep Blue (1997)
// and Watson (2011). Three labs: the search-explosion calculator that shows why
// chess fell to brute force and Go did not, a Watson-style evidence-scoring
// question answerer (with its famous Final Jeopardy! mistake), and the Elo
// formula applied to Kasparov vs Deep Blue.
(function () {
"use strict";
const { register, canvas, C } = GuideKit;

const CHAPTERS = [
  { icon:"🪰", title:"Chess — the fruit fly of artificial intelligence",
    who:"Claude Shannon 1950 · Alan Turing's paper machine 1948 · Alexander Kronrod",
    lead:"Geneticists study fruit flies; AI studied chess. It is hard, has clear rules, and has a rating scale that measures progress exactly.",
    formula:"legal chess positions ≈ 10⁴⁴ ·  game-tree size (Shannon number) ≈ 10¹²⁰",
    what:`Shannon's 1950 paper laid out how a computer could play chess: search the tree of moves and score the
      leaves with an evaluation function. Turing wrote a chess algorithm around 1948 and "ran" it by hand on
      paper, taking about half an hour per move; it lost.`,
    how:`Shannon distinguished "type A" programs (search everything to a fixed depth) from "type B" programs
      (search selectively, like people). Brute-force type A won out in chess, because hardware kept getting
      faster. Lab 1 shows why that worked for chess and not for Go.`,
    story:`The Soviet mathematician Alexander Kronrod called chess "the drosophila of AI". For fifty years
      "a computer will beat the world champion" was the field's most-cited benchmark, and its most-missed
      prediction.`,
    today:`The phrase stuck, and the pattern repeated: benchmarks (ImageNet, Go, protein folding, olympiad maths)
      drive AI because they make progress measurable.` },
  { icon:"🖥", title:"Deep Blue — search, special chips and 200 million positions a second",
    who:"Feng-hsiung Hsu, Murray Campbell, Joseph Hoane · IBM Research",
    lead:"Deep Blue was brute force done brilliantly: 480 custom chess chips searching around 200 million positions per second, guided by a hand-tuned evaluation with about 8,000 features.",
    formula:"alpha–beta search (typically 12+ plies, extended on forcing lines) + hand-built evaluation + opening book + endgame tables",
    what:`Deep Blue grew out of Hsu's ChipTest and Deep Thought projects at Carnegie Mellon. Its evaluation
      function was written by programmers and grandmasters, with weights tuned partly automatically. There was
      almost no learning in the modern sense.`,
    how:`Special-purpose hardware did the searching: a 30-node IBM RS/6000 SP supercomputer with 480 chess
      chips. Extra search depth on tactical lines ("singular extensions") and a large opening book filled in the
      rest.`,
    story:`Hsu started the project as a graduate student in 1985. IBM hired the team in 1989. The machine was
      retired after 1997, and half of it is now at the Computer History Museum in California.`,
    today:`The map marks Deep Blue 🪦: its hand-built approach was overtaken by learning. Modern engines such as
      Stockfish combine alpha–beta search with a small neural network evaluation (NNUE, 2020), a hybrid of both
      eras.` },
  { icon:"♚", title:"1997 — Kasparov loses the rematch",
    who:"Garry Kasparov vs Deep Blue · New York, May 1997",
    lead:"In 1996 Kasparov won their first match 4–2. Fifteen months later an upgraded Deep Blue won the rematch 3½–2½, and a world champion lost a match to a computer under tournament conditions for the first time.",
    formula:"1996 (Philadelphia): Kasparov 4 – 2 Deep Blue   ·   1997 (New York): Deep Blue 3½ – 2½ Kasparov",
    what:`Kasparov won game 1 of the rematch. In game 2 Deep Blue played a quiet, positional move that shook him:
      it looked too human for a machine. He resigned a position that analysis later showed might have been
      drawn. Game 6 was a quick loss after an opening error.`,
    how:`Kasparov suspected human intervention during games and asked for Deep Blue's logs; IBM declined at the
      time and dismantled the machine, which fed the suspicion. Years later, an apparent bug (a random fallback
      move) was reported as one source of a puzzling move in game 1.`,
    story:`The match was front-page news worldwide and IBM's share price jumped. Kasparov later wrote "Deep
      Thinking" (2017), concluding that the loss was real and that he had let the psychology get to him.`,
    today:`Top engines now play hundreds of Elo points above any human (Lab 3 converts that into odds). Chess is
      more popular than ever, and players train with engines as sparring partners and teachers.` },
  { icon:"❓", title:"2011 — Watson wins Jeopardy!",
    who:"David Ferrucci and the IBM DeepQA team · televised February 2011",
    lead:"Watson beat Ken Jennings and Brad Rutter, the show's two greatest champions, answering clues full of puns and wordplay with no internet connection.",
    formula:"generate hundreds of candidate answers → score each with ~100 evidence scorers → combine with a learned model → buzz only if confident",
    what:`DeepQA parsed each clue, searched its stored documents (encyclopedias, dictionaries, news) for hundreds of
      candidate answers, scored each candidate with many independent evidence algorithms, and combined the
      scores with machine learning into a confidence. Lab 2 simulates that last step.`,
    how:`Confidence mattered as much as accuracy: Watson buzzed only when its confidence passed a threshold, and it
      bet strategically. It ran on about 2,800 processor cores to answer within about three seconds.`,
    story:`In Final Jeopardy! for the category "U.S. Cities", Watson answered "What is Toronto?????", with the
      question marks showing low confidence (it had wagered little). It still won comfortably. Jennings wrote
      under his final answer: "I for one welcome our new computer overlords."`,
    today:`The map calls Watson statistical NLP's bridge moment: a system built from many machine-learned
      components, but before deep learning. Six years later transformers made most of that architecture
      unnecessary.` },
  { icon:"🏥", title:"After the applause — Watson Health",
    who:"IBM · 2011–2022",
    lead:"IBM promised Watson would transform medicine, starting with cancer treatment. It turned out that winning a quiz show and treating patients are very different problems.",
    formula:"benchmark success  ≠  real-world deployment",
    what:`IBM invested billions in Watson Health, partnering with major cancer centres. Reports described
      recommendations that were unhelpful or unsafe in some cases, and trained on hypothetical rather than real
      patients in others. MD Anderson ended a large project after spending about $62 million.`,
    how:`Medical data is messy, inconsistent and scattered across systems; clinical judgement depends on context a
      quiz-show system never saw. The same problems had stopped MYCIN from being deployed in the 1970s.`,
    story:`IBM sold most of Watson Health's assets in 2022 to an investment firm, which renamed them Merative. The
      "Watson" brand lives on in IBM's business AI products.`,
    today:`The lesson is now standard in AI deployment: impressive demonstrations are the start, not the end.
      Evaluation in real conditions, with real users, is where many AI projects succeed or fail.` },
  { icon:"🎯", title:"Moving goalposts — the 'AI effect'",
    who:"a pattern named in the 1970s and 1980s",
    lead:"Every time AI achieves something, people decide it wasn't really intelligence after all. Chess was the benchmark until a computer won; then it was 'just search'.",
    formula:"'AI is whatever hasn't been done yet.'   (attributed to Larry Tesler)",
    what:`The "AI effect" describes how solved problems stop counting as AI: route planning, spell-checking, chess,
      speech recognition. Critics say that is fair: those systems were narrow, and the goal was general
      intelligence.`,
    how:`Deep Blue could play chess and nothing else; it could not even play checkers. That narrowness is why the
      AlphaZero result (one learning algorithm, three games) and today's general-purpose language models felt
      like a different kind of milestone.`,
    story:`The gold bridge on the map from AI to ML reads "Deep Blue (search) vs AlphaGo (learning): the handover".
      These milestones mark the end of the symbolic era's claim on the headlines.`,
    today:`The goalposts keep moving: from passing exams to doing research, from chatting to acting in the world.
      Watching where they move next is a good guide to what people currently think intelligence is.` }
];

const SOURCES = [
  { type:"THE BLUEPRINT · 1950", title:"Claude Shannon — Programming a Computer for Playing Chess", note:"Search plus evaluation, and the size of the chess tree.", url:"https://doi.org/10.1080/14786445008521796" },
  { type:"DEEP BLUE · 2002", title:"Campbell, Hoane & Hsu — Deep Blue", note:"Artificial Intelligence 134. The system, described by its builders.", url:"https://doi.org/10.1016/S0004-3702(01)00129-1" },
  { type:"THE MATCH · MUSEUM", title:"Computer History Museum — Deep Blue", note:"The story and artefacts of the 1996 and 1997 matches.", url:"https://www.computerhistory.org/chess/" },
  { type:"WATSON · 2010", title:"Ferrucci et al. — Building Watson: An Overview of the DeepQA Project", note:"AI Magazine 31(3). The architecture of candidate generation and evidence scoring.", url:"https://doi.org/10.1609/aimag.v31i3.2303" },
  { type:"THE SUCCESSOR · 2018", title:"Silver et al. — A General Reinforcement Learning Algorithm that Masters Chess, Shogi, and Go", note:"AlphaZero: learning replaces hand-built evaluation.", url:"https://doi.org/10.1126/science.aar6404" },
  { type:"ELO · REFERENCE", title:"FIDE Handbook — the rating system", note:"The expected-score formula used in Lab 3.", url:"https://handbook.fide.com/" }
];

/* -------------------------------------------------- LAB 1: search explosion */
const GAMES = { "tic-tac-toe":4, checkers:8, chess:35, go:250 };
const exploLab = {
  kicker:"WHY CHESS FELL FIRST", title:"How deep can you search?",
  intro:`A game tree with branching factor b has about bᵈ positions at depth d (plies, i.e. half-moves). Alpha–beta with good move ordering examines roughly b^(d/2). Given Deep Blue's speed of about 200 million positions a second and three minutes per move, how deep can each game be searched?`,
  html:`<div class="gk-chips" data-role="g">${Object.keys(GAMES).map(g => `<button class="gk-chip${g === "chess" ? " on" : ""}" data-g="${g}">${g} (b ≈ ${GAMES[g]})</button>`).join("")}</div>
    <div class="it-control"><label><span>positions per second</span><output data-o="s">2.0e8</output></label><input type="range" data-i="s" min="3" max="11" step="0.1" value="8.3"></div>
    <div class="it-control"><label><span>seconds per move</span><output data-o="t">180</output></label><input type="range" data-i="t" min="1" max="600" step="1" value="180"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Depth is what matters: each extra ply of lookahead is worth a lot of playing strength. Go's branching factor of about 250 meant even alpha–beta couldn't get deep enough, which is why Go needed learned intuition (AlphaGo's policy network) to decide which moves to consider.`,
  init(root) {
    const q = s => root.querySelector(s); let g = "chess";
    function draw() {
      const sps = Math.pow(10, +q('[data-i="s"]').value), t = +q('[data-i="t"]').value, b = GAMES[g], budget = sps * t;
      q('[data-o="s"]').textContent = sps.toExponential(1); q('[data-o="t"]').textContent = t;
      const dMM = Math.log(budget) / Math.log(b), dAB = 2 * dMM;
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 170); ctx.clearRect(0, 0, W, H);
      const maxD = 24, lgMax = 60, X = d => 34 + d / maxD * (W - 44), Y = lg => H - 18 - Math.min(lg, lgMax) / lgMax * (H - 30);
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace";
      for (let e = 0; e <= lgMax; e += 10) { ctx.fillText("1e" + e, 2, Y(e) + 3); ctx.strokeStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.moveTo(34, Y(e)); ctx.lineTo(W, Y(e)); ctx.stroke(); }
      [[1, C.red, "minimax bᵈ"], [.5, C.teal, "alpha–beta b^(d/2)"]].forEach(([f, col, name], k) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); for (let d = 0; d <= maxD; d += .25) { const y = Y(f * d * Math.log10(b)); d ? ctx.lineTo(X(d), y) : ctx.moveTo(X(d), y); } ctx.stroke(); ctx.fillStyle = col; ctx.fillText(name, 40, 14 + k * 11); });
      ctx.strokeStyle = C.gold; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(34, Y(Math.log10(budget))); ctx.lineTo(W, Y(Math.log10(budget))); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.gold; ctx.fillText("your budget", W - 70, Y(Math.log10(budget)) - 4); ctx.fillStyle = C.dim; ctx.fillText("depth (plies) →", W - 88, H - 4);
      q('[data-role="out"]').innerHTML = `budget per move: <span class="g">${budget.toExponential(2)}</span> positions\n` +
        `plain minimax reaches depth ≈ <span class="r">${dMM.toFixed(1)}</span> plies   ·   alpha–beta (ideal ordering) ≈ <span class="t">${dAB.toFixed(1)}</span> plies\n` +
        `<span class="d">${g === "chess" ? "Deep Blue typically searched 12+ plies, extending forcing lines much further." : g === "go" ? "In Go, 4–8 plies is nowhere near enough: moves pay off 50+ plies later." : g === "tic-tac-toe" ? "The whole game is only 9 plies: solved instantly." : "Checkers was fully solved in 2007 (Chinook): perfect play is a draw."}</span>`;
    }
    root.querySelectorAll('[data-role="g"] .gk-chip').forEach(b => b.addEventListener("click", () => { g = b.dataset.g; root.querySelectorAll('[data-role="g"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw));
    draw();
  }
};

/* ----------------------------------------------------- LAB 2: Watson scoring */
const CLUES = [
  { cat:"U.S. CITIES", clue:"Its largest airport was named for a World War II hero; its second largest, for a World War II battle.", right:"Chicago",
    cands:[["Toronto", .78, 0, .55], ["Chicago", .66, 1, .62], ["New York", .41, 1, .80], ["Houston", .33, 1, .45]], note:"Real answer: Chicago (O'Hare, after the pilot Butch O'Hare; Midway, after the battle). Watson said 'What is Toronto?????'. Toronto's Pearson and Billy Bishop airports matched the text well, and Watson gave the category (U.S. cities) little weight: category labels on Jeopardy! are often loose." },
  { cat:"COMPUTING PIONEERS", clue:"This English mathematician's 1936 paper defined the machines that bear his name.", right:"Alan Turing",
    cands:[["Alan Turing", .91, 1, .88], ["Charles Babbage", .52, 1, .74], ["Alonzo Church", .63, 0, .41], ["John von Neumann", .38, 0, .70]], note:"Church was American; type match = 0." },
  { cat:"SCIENCE", clue:"This gas makes up about 78% of Earth's atmosphere.", right:"nitrogen",
    cands:[["nitrogen", .86, 1, .70], ["oxygen", .64, 1, .83], ["argon", .31, 1, .30], ["carbon dioxide", .40, 1, .66]], note:"An easy one: every scorer agrees." }
];
const FEAT = ["text-passage match", "answer-type match", "popularity prior"];
const watsonLab = {
  kicker:"DEEPQA · EVIDENCE AND CONFIDENCE", title:"Weigh the evidence, then decide whether to buzz",
  intro:`Each candidate answer has scores from three kinds of evidence. Watson combined its ~100 scorers with learned weights into a confidence, and buzzed only above a threshold. Adjust the weights and the threshold, and see which answer wins each clue, including Watson's famous Final Jeopardy! mistake. (Simulated scores; the mechanism is DeepQA's.)`,
  html:`${FEAT.map((f, i) => `<div class="it-control"><label><span>weight: ${f}</span><output data-o="w${i}">${[2.5, .8, 1][i]}</output></label><input type="range" data-i="w${i}" min="0" max="4" step="0.1" value="${[2.5, .8, 1][i]}"></div>`).join("")}
    <div class="it-control"><label><span>buzz threshold (confidence)</span><output data-o="th">0.50</output></label><input type="range" data-i="th" min="0.2" max="0.9" step="0.01" value="0.5"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Raise the answer-type weight and Chicago wins: that was the fix. Watson's designers deliberately kept that weight low, because Jeopardy! category titles are often only loosely related to the answer. Every weighting is a trade-off across thousands of clues, not one.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const w = [0, 1, 2].map(i => +q(`[data-i="w${i}"]`).value), th = +q('[data-i="th"]').value;
      w.forEach((v, i) => q(`[data-o="w${i}"]`).textContent = v.toFixed(1)); q('[data-o="th"]').textContent = th.toFixed(2);
      q('[data-role="out"]').innerHTML = CLUES.map(c => {
        const sc = c.cands.map(([n, ...f]) => [n, f.reduce((a, v, i) => a + v * w[i], 0)]); const Z = sc.reduce((a, [, s]) => a + Math.exp(2 * s), 0);
        const ranked = sc.map(([n, s]) => [n, Math.exp(2 * s) / Z]).sort((a, b) => b[1] - a[1]), [top, conf] = ranked[0], ok = top === c.right;
        return `<b>${c.cat}</b>: ${c.clue}\n` + ranked.map(([n, p], i) => `  ${i ? " " : "▶"} ${n.padEnd(17)} ${(p * 100).toFixed(0).padStart(3)}%`).join("\n") +
          `\n  → ${conf >= th ? "buzz" : "stay silent"}: <span class="${ok ? "t" : "r"}">What is ${top}?${conf < .5 ? "????" : ""}</span> ${ok ? "✓" : "✗"}\n  <span class="d">${c.note}</span>`;
      }).join("\n\n");
    }
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw)); draw();
  }
};

/* -------------------------------------------------------------- LAB 3: Elo */
const eloLab = {
  kicker:"RATINGS · HOW BIG IS A GAP?", title:"Turn a rating difference into odds",
  intro:`The Elo system predicts a player's expected score from the rating difference D: E = 1 / (1 + 10^(−D/400)). Kasparov was rated about 2795 in 1997. Deep Blue never had an official rating; try estimates, and compare with today's engines, which are rated far above any human.`,
  html:`<div class="it-control"><label><span>player A (human) rating</span><output data-o="a">2795</output></label><input type="range" data-i="a" min="1200" max="2900" step="5" value="2795"></div>
    <div class="it-control"><label><span>player B (machine) rating</span><output data-o="b">2850</output></label><input type="range" data-i="b" min="1200" max="3700" step="10" value="2850"></div>
    <div class="gk-chips" data-role="pre"><button class="gk-chip" data-b="2850">an estimate for Deep Blue 1997</button><button class="gk-chip" data-b="3600">a top engine today (engine-list scale)</button><button class="gk-chip" data-b="2000">a strong club player</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Engine ratings come from engine-versus-engine lists and aren't directly comparable with human FIDE ratings, but the gap is enormous either way: modern engines on a phone beat world champions almost every game.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const A = +q('[data-i="a"]').value, B = +q('[data-i="b"]').value; q('[data-o="a"]').textContent = A; q('[data-o="b"]').textContent = B;
      const E = 1 / (1 + Math.pow(10, (B - A) / 400));
      q('[data-role="out"]').innerHTML = `rating difference: ${B - A >= 0 ? "+" : ""}${B - A} for the machine\nhuman's expected score per game: <span class="g">${(E * 100).toFixed(1)}%</span>\nexpected result of a 6-game match: human <span class="t">${(6 * E).toFixed(1)}</span> – <span class="r">${(6 * (1 - E)).toFixed(1)}</span> machine\n<span class="d">the 1997 result was Kasparov 2½ – 3½ Deep Blue</span>`;
    }
    root.querySelectorAll("input[type=range]").forEach(x => x.addEventListener("input", draw));
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-i="b"]').value = b.dataset.b; draw(); }));
    draw();
  }
};

register("milestones", {
  kicker:"CLASSIC MILESTONES · 1997–2011 · ABOUT 30 MIN",
  hook:"'I for one welcome our new computer overlords,' Ken Jennings wrote under his final answer in 2011. Fourteen years earlier Garry Kasparov had stormed away from the board, convinced a human was helping the machine.",
  intro:`Two televised contests marked the peak of AI before deep learning. Deep Blue beat the world chess champion with custom hardware and brute-force search; Watson won Jeopardy! by combining hundreds of statistical evidence scorers. Both were engineering triumphs and both were quickly overtaken by learning. Three labs below: see why search conquered chess but not Go, weigh Watson's evidence (and reproduce its 'Toronto' mistake), and turn rating gaps into odds.`,
  timeline:[[1950, "Shannon's chess paper"], [1996, "Kasparov 4–2"], [1997, "Deep Blue 3½–2½"], [2011, "Watson wins Jeopardy!"], [2017, "AlphaZero"]],
  labs:[exploLab, watsonLab, eloLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, keep Deep Blue's speed and switch from chess to Go: alpha–beta's depth drops from about 14 plies to about 9, and Go needs far more.",
    "Still in Lab 1, how many positions per second would you need to search Go 12 plies deep in three minutes? (Slide until alpha–beta reaches 12.)",
    "In Lab 2, raise the answer-type weight until Chicago wins the U.S. Cities clue. Then check the other two clues still come out right.",
    "Lower the buzz threshold in Lab 2 to 0.2: Watson buzzes on everything, including its wrong answers. Calibrated confidence is as important as accuracy.",
    "In Lab 3, set the machine to 3600 and read the expected match score: the gap between humans and engines is now wider than between a beginner and a grandmaster."
  ],
  sources:SOURCES
});
})();
