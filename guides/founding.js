// FOUNDING DOCUMENTS — 1950 to 1956: Turing's question, the Dartmouth
// proposal and the Logic Theorist. Three labs: the imitation game played with
// the actual questions and "machine" answers from Turing's 1950 paper, a
// propositional theorem checker in the spirit of the Logic Theorist, and a
// scorecard of the founders' famous predictions.
(function () {
"use strict";
const { register, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"❓", title:"1950 — 'Can machines think?' replaced by a game",
    who:"Alan Turing · Computing Machinery and Intelligence · Mind 59",
    lead:"Turing thought the question 'can machines think?' was too vague to answer. So he replaced it with a test anyone could run.",
    formula:"interrogator ↔ { A: machine, B: human }  over text only  →  can the interrogator tell which is which?",
    what:`In the imitation game an interrogator exchanges typed messages with two hidden players, one human and
      one machine, and must decide which is which. If the machine is picked out no more often than chance, Turing
      argued, we have as much reason to call it intelligent as we have for other people. Play it in Lab 1.`,
    how:`Turing predicted that by about the year 2000 a machine with around 10⁹ bits of storage would play so well
      that "an average interrogator will not have more than 70 per cent chance of making the right
      identification after five minutes of questioning". He was sketching an experiment, not a pass mark.`,
    story:`The paper is playful and prophetic. Its sample dialogue has the machine decline to write a sonnet,
      and it answers an addition problem slowly and wrongly, pretending to be human. Turing understood from the
      start that passing would mean imitating human weaknesses too.`,
    today:`Critics say the test measures deception rather than intelligence, and modern chatbots show fluent
      conversation is not the same as understanding. Yet a 2025 study reported that people judged GPT-4.5 to be
      the human in most short three-way conversations. Whatever the test measures, machines can now do it.` },
  { icon:"🛡", title:"Nine objections, answered in advance",
    who:"Turing 1950 · including 'Lady Lovelace's objection'",
    lead:"Turing listed the arguments people would make against thinking machines, and replied to each one. Most of them are still being made.",
    formula:"theological · 'heads in the sand' · mathematical (Gödel) · consciousness · disabilities · Lovelace · nervous system · informality · ESP",
    what:`The objections include: machines can't be conscious; Gödel's theorem limits them; they can never do X
      (be kind, fall in love, enjoy strawberries); and Lady Lovelace's objection, that the Analytical Engine "has
      no pretensions to originate anything" and can only do what we tell it.`,
    how:`To Lovelace, Turing replied that machines surprise him constantly, and that a machine which learns could
      end up doing things its programmer never foresaw. To the consciousness objection he pointed out that we
      can't directly verify anyone else's mind either; we extend a "polite convention".`,
    story:`This is where the map's gold thread from Ada Lovelace (1843) reaches Turing: a hundred years apart, the
      two most important early thinkers about computing disagree about whether machines can originate.`,
    today:`The Lovelace objection now shapes debates about AI creativity and copyright: is a model that remixes
      its training data originating anything? The consciousness debate is a live research area.` },
  { icon:"👶", title:"The child machine — Turing predicts machine learning",
    who:"Turing 1950, section 7 · Intelligent Machinery (1948 report)",
    lead:"Rather than program an adult mind, Turing suggested, build a child's mind and educate it, with rewards and punishments.",
    formula:"child machine + education (rewards, punishments, examples) = adult mind",
    what:`In the last section of the paper Turing proposes learning machines: start with a simple machine, teach
      it, and let it change its own rules. He even suggests an element of randomness would help, and compares
      the process to evolution by natural selection.`,
    how:`His 1948 report "Intelligent Machinery" had already described randomly connected networks of neuron-like
      units that could be trained, an early sketch of neural networks. The National Physical Laboratory's
      director reportedly dismissed it as a "schoolboy essay", and it went unpublished until 1968.`,
    story:`Turing's vision of learning lost out, for decades, to the symbolic approach founded at Dartmouth.
      Seventy years later, "educate the child machine with rewards" is a fair summary of pre-training plus RLHF.`,
    today:`Read section 7 of the 1950 paper after the Deep RL and LLM guides: it anticipates reinforcement
      learning, self-play and the need for large amounts of training.` },
  { icon:"🌲", title:"1955 — the Dartmouth proposal names the field",
    who:"John McCarthy, Marvin Minsky, Nathaniel Rochester & Claude Shannon",
    lead:"A funding request for a summer workshop coined the term 'artificial intelligence' and set out the field's programme in two pages.",
    formula:"'every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it'",
    what:`The proposal asked the Rockefeller Foundation for $13,500 for a two-month, ten-person study in summer
      1956. Its topics were automatic computers, language, neuron nets, the size of a calculation, self-improvement,
      abstraction, and randomness and creativity, which is essentially the field's agenda ever since.`,
    how:`The proposal predicted that "a significant advance can be made in one or more of these problems if a
      carefully selected group of scientists work on it together for a summer". The workshop was more a series
      of visits than a joint project; nobody solved anything that summer.`,
    story:`McCarthy chose the name "artificial intelligence" partly to set the new field apart from Norbert
      Wiener's cybernetics. The workshop is still treated as AI's official birthday, and its optimism set a
      pattern of bold promises that later fed the AI winters.`,
    today:`Read the proposal (it's short): neural networks, language and self-improvement were on the list in
      1955. The 70-year gap between that list and today's systems is the whole story of this map.` },
  { icon:"📐", title:"1956 — the Logic Theorist proves Principia",
    who:"Allen Newell, Herbert Simon & Cliff Shaw · RAND and Carnegie Tech",
    lead:"Often called the first AI program: it proved 38 of the first 52 theorems in Whitehead and Russell's Principia Mathematica, one of them more elegantly than the original.",
    formula:"search backwards from the goal, using substitution, detachment (modus ponens) and chaining, pruned by heuristics",
    what:`The Logic Theorist worked like a mathematician: start from the theorem to be proved, look for axioms or
      proven theorems that could lead to it, and search, using rules of thumb to avoid trying everything. Lab 2
      checks theorems of the same kind, though by brute-force truth table rather than proof search.`,
    how:`Newell and Simon's key idea was the heuristic: a rule that usually helps without guaranteeing success.
      Search guided by heuristics became the central method of symbolic AI for 30 years.`,
    story:`Simon told his class in January 1956, "Over Christmas, Allen Newell and I invented a thinking
      machine." They tried to publish a paper co-authored by the program; the journal declined. Bertrand Russell
      was reportedly delighted by the shorter proof of theorem 2.85.`,
    today:`Automated theorem proving continues in SAT solvers, proof assistants (Lean, Coq) and now AI systems that
      prove olympiad and research problems. The Compilers & Type Theory field on this map picks up that thread.` },
  { icon:"🔮", title:"The predictions — and what they teach",
    who:"1950–2016 · the founders and their successors",
    lead:"Every generation of AI researchers has predicted the near future confidently. Some of the dates were wrong by decades, some by less than you'd think.",
    formula:"prediction + date  →  checked against history (Lab 3)",
    what:`Simon and Newell predicted a computer chess champion within ten years (1958); it took 39. Minsky told Life
      magazine in 1970 that human-level general intelligence was three to eight years away. Turing's own 1950
      estimate for his test was remarkably close. Lab 3 lets you score them.`,
    how:`The pattern is consistent: researchers underestimate how hard perception, common sense and learning are,
      and overestimate how fast hand-built methods scale. Each disappointment cut funding, producing the two AI
      winters on the timeline.`,
    story:`The Lighthill Report (1973) quoted such predictions back at the field when recommending cuts. The
      lesson people draw from this record is either "be humble" or "the doubters keep losing".`,
    today:`Today's forecasts about artificial general intelligence sound remarkably like 1970's. Judging them
      well means remembering both the misses and the surprises.` }
];

const SOURCES = [
  { type:"THE FOUNDING PAPER · 1950", title:"Alan Turing — Computing Machinery and Intelligence", note:"Mind 59(236). The imitation game, the nine objections and the child machine.", url:"https://doi.org/10.1093/mind/LIX.236.433" },
  { type:"THE PROPOSAL · 1955", title:"McCarthy, Minsky, Rochester & Shannon — A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence", note:"The two pages that named the field.", url:"http://jmc.stanford.edu/articles/dartmouth/dartmouth.pdf" },
  { type:"REPRINT · 2006", title:"The Dartmouth proposal, reprinted in AI Magazine (50th anniversary)", note:"With context on who attended.", url:"https://doi.org/10.1609/aimag.v27i4.1904" },
  { type:"THE FIRST AI PROGRAM · 1956", title:"Newell & Simon — The Logic Theory Machine", note:"IRE Transactions on Information Theory. Heuristic search for proofs.", url:"https://doi.org/10.1109/TIT.1956.1056797" },
  { type:"THE MODERN TEST · 2025", title:"Jones & Bergen — Large Language Models Pass the Turing Test", note:"A three-party imitation game with human judges.", url:"https://arxiv.org/abs/2503.23674" },
  { type:"REFERENCE", title:"Stanford Encyclopedia of Philosophy — The Turing Test", note:"The objections, the criticisms and the debate since 1950.", url:"https://plato.stanford.edu/entries/turing-test/" },
  { type:"REFERENCE", title:"Stanford Encyclopedia of Philosophy — The Chinese Room Argument", note:"Searle's 1980 challenge: can symbol manipulation ever be understanding?", url:"https://plato.stanford.edu/entries/chinese-room/" }
];

/* ------------------------------------------------ LAB 1: the imitation game */
// "machine" answers are Turing's own sample answers from the 1950 paper where he gave them.
const QS = [
  { q:"Please write me a sonnet on the subject of the Forth Bridge.", m:"Count me out on this one. I never could write poetry.", h:"Ha, a sonnet? That's fourteen lines, isn't it? I'd embarrass myself. Something about a big red bridge and trains, maybe." , turing:true },
  { q:"Add 34957 to 70764.", m:"(pause of about 30 seconds) 105621.", h:"Hang on... 105721.", turing:true, note:"34957 + 70764 = 105721. Turing's 'machine' answers slowly and gets it wrong on purpose: to pass, it must imitate human error." },
  { q:"Do you play chess?", m:"Yes.", h:"Badly. I know how the pieces move.", turing:true },
  { q:"I have K at my K1, and no other pieces. You have only K at K6 and R at R1. It is your move. What do you play?", m:"(after a pause of 15 seconds) R-R8 mate.", h:"Er... I'd need to see a board. Rook to the back rank?", turing:true },
  { q:"What did you have for breakfast?", m:"Toast and marmalade, and far too much tea.", h:"Nothing, I overslept. Coffee on the way." },
  { q:"How do you feel right now?", m:"A little nervous, to be honest. It is odd being judged.", h:"Bit tired. Why do you ask?" }
];
const imitationLab = {
  kicker:"THE IMITATION GAME · 1950", title:"Interrogate two witnesses, then name the machine",
  intro:`Witnesses X and Y answer by text. One gives the answers of Turing's own imagined machine, quoted from the 1950 paper where he wrote them; the other gives the answers a person might. Ask any three or more questions, then decide which witness is the machine.`,
  html:`<div class="gk-chips" data-role="qs">${QS.map((x, i) => `<button class="gk-chip" data-i="${i}">${x.q.length > 38 ? x.q.slice(0, 36) + "…" : x.q}</button>`).join("")}</div>
    <div class="gk-chat" data-role="chat"></div>
    <div class="it-lab-actions"><button class="it-send" data-g="X">X is the machine</button><button class="it-send" data-g="Y">Y is the machine</button><button class="gk-ghost" data-a="new">new game</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`This is a toy: the answers are fixed, not generated. The real 2025 experiment used live language models and live humans, and judges picked the model as human more often than the actual human.`,
  init(root) {
    const q = s => root.querySelector(s); let mIsX = true, asked = 0, done = false, r = rng(Date.now() % 1e6);
    function reset() { mIsX = r() < .5; asked = 0; done = false; q('[data-role="chat"]').innerHTML = ""; q('[data-role="out"]').innerHTML = "ask at least three questions, then decide.";
      root.querySelectorAll('[data-role="qs"] .gk-chip').forEach(b => b.classList.remove("on")); }
    root.querySelectorAll('[data-role="qs"] .gk-chip').forEach(b => b.addEventListener("click", () => {
      const it = QS[+b.dataset.i]; b.classList.add("on"); asked++;
      const [x, y] = mIsX ? [it.m, it.h] : [it.h, it.m];
      q('[data-role="chat"]').insertAdjacentHTML("beforeend", `<div class="gk-msg you">${it.q}</div><div class="gk-msg bot"><b>X:</b> ${x}</div><div class="gk-msg bot"><b>Y:</b> ${y}</div>`);
      q('[data-role="chat"]').scrollTop = 1e6;
    }));
    root.querySelectorAll("[data-g]").forEach(b => b.addEventListener("click", () => {
      if (asked < 3) { q('[data-role="out"]').innerHTML = `<span class="r">ask ${3 - asked} more question(s) first.</span>`; return; }
      if (done) return; done = true; const right = (b.dataset.g === "X") === mIsX;
      q('[data-role="out"]').innerHTML = (right ? `<span class="t">Correct: ${mIsX ? "X" : "Y"} was the machine.</span>` : `<span class="r">Fooled: ${mIsX ? "X" : "Y"} was the machine.</span>`) +
        `\n<span class="d">${QS[1].note}</span>`;
    }));
    q('[data-a="new"]').addEventListener("click", reset); reset();
  }
};

/* --------------------------------------------------- LAB 2: theorem checker */
function tokenize(s) { return s.replace(/<->|↔/g, " = ").replace(/->|→|⊃/g, " > ").replace(/[∨|]/g, " | ").replace(/[∧&]/g, " & ").replace(/[¬~!]/g, " ~ ").replace(/([()])/g, " $1 ").split(/\s+/).filter(Boolean); }
function parse(tokens) {
  let i = 0; const peek = () => tokens[i], eat = t => { if (tokens[i] !== t) throw new Error(`expected "${t}"`); i++; };
  function iff() { let l = imp(); while (peek() === "=") { i++; const r = imp(); l = { op:"=", l, r }; } return l; }
  function imp() { const l = or(); if (peek() === ">") { i++; return { op:">", l, r:imp() }; } return l; }
  function or() { let l = and(); while (peek() === "|") { i++; l = { op:"|", l, r:and() }; } return l; }
  function and() { let l = not(); while (peek() === "&") { i++; l = { op:"&", l, r:not() }; } return l; }
  function not() { if (peek() === "~") { i++; return { op:"~", x:not() }; } if (peek() === "(") { i++; const e = iff(); eat(")"); return e; }
    const t = tokens[i++]; if (!t || !/^[a-z]\w*$/i.test(t)) throw new Error(`unexpected "${t || "end"}"`); return { v:t }; }
  const e = iff(); if (i < tokens.length) throw new Error(`unexpected "${tokens[i]}"`); return e;
}
function evalF(e, env) { if (e.v) return env[e.v]; if (e.op === "~") return !evalF(e.x, env); const a = evalF(e.l, env), b = evalF(e.r, env);
  return e.op === "&" ? a && b : e.op === "|" ? a || b : e.op === ">" ? (!a || b) : a === b; }
function vars(e, s = new Set()) { if (e.v) s.add(e.v); else if (e.x) vars(e.x, s); else { vars(e.l, s); vars(e.r, s); } return s; }
const PM = [
  ["*2.01  (p → ~p) → ~p", "(p -> ~p) -> ~p"], ["*2.05  syllogism", "(q -> r) -> ((p -> q) -> (p -> r))"], ["*2.08  identity", "p -> p"],
  ["*2.3   permutation", "(p | (q | r)) -> (p | (r | q))"], ["contraposition", "(p -> q) -> (~q -> ~p)"], ["*2.85 (the one LT proved more neatly)", "((p | q) -> (p | r)) -> (p | (q -> r))"],
  ["a non-theorem", "(p -> q) -> (q -> p)"], ["Peirce's law", "((p -> q) -> p) -> p"]
];
const thmLab = {
  kicker:"THE LOGIC THEORIST · 1956", title:"Is it a theorem of propositional logic?",
  intro:`Pick a theorem from Principia Mathematica (the book the Logic Theorist attacked) or type your own formula using ~ (not), & (and), | (or), -> (implies) and <-> (iff). The checker tries every true/false assignment of the variables: a theorem is true in all of them. The Logic Theorist instead searched for proofs, which is far harder but works where truth tables can't.`,
  html:`<div class="gk-chips" data-role="pm">${PM.map(([n], i) => `<button class="gk-chip" data-i="${i}">${n}</button>`).join("")}</div>
    <div class="gk-row"><input class="gk-input" data-role="f" value="(p -> q) -> (~q -> ~p)" spellcheck="false"><button class="it-send" data-a="go">check</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`A truth table for n variables has 2ⁿ rows, so this brute-force check explodes quickly. Deciding satisfiability in general is the first problem ever proved NP-complete (Cook, 1971): see the Complexity Theory guide.`,
  init(root) {
    const q = s => root.querySelector(s);
    function go() {
      const src = q('[data-role="f"]').value;
      try {
        const e = parse(tokenize(src)), vs = [...vars(e)].sort(), rows = []; let all = true, any = false;
        for (let m = 0; m < 1 << vs.length; m++) { const env = {}; vs.forEach((v, i) => env[v] = !!(m >> (vs.length - 1 - i) & 1)); const val = evalF(e, env); all = all && val; any = any || val; if (rows.length < 16) rows.push([vs.map(v => env[v] ? "T" : "F").join(" "), val]); }
        q('[data-role="out"]').innerHTML = `${vs.join(" ")} │ value\n` + rows.map(([a, v]) => `${a} │ ${v ? '<span class="t">T</span>' : '<span class="r">F</span>'}`).join("\n") + (1 << vs.length > 16 ? `\n… ${(1 << vs.length) - 16} more rows` : "") +
          `\n\n${all ? '<span class="g">✓ a tautology: true under every assignment, so provable</span>' : any ? '<span class="r">✗ not a theorem: some assignment makes it false</span>' : '<span class="r">✗ a contradiction: false under every assignment</span>'}`;
      } catch (err) { q('[data-role="out"]').innerHTML = `<span class="r">couldn't read that formula: ${err.message}</span>`; }
    }
    root.querySelectorAll('[data-role="pm"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="f"]').value = PM[+b.dataset.i][1]; root.querySelectorAll('[data-role="pm"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); go(); }));
    q('[data-a="go"]').addEventListener("click", go); q('[data-role="f"]').addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    go();
  }
};

/* ---------------------------------------------------- LAB 3: predictions */
const PRED = [
  { who:"Alan Turing", y:1950, said:"By about 2000, an average interrogator will have no more than a 70% chance of identifying the machine after five minutes.", due:2000, met:2025, verdict:"roughly right, 25 years late", note:"A 2025 three-party study reported judges choosing GPT-4.5 as the human 73% of the time." },
  { who:"Dartmouth proposal", y:1955, said:"A significant advance can be made on these problems by a carefully selected group working together for a summer.", due:1956, met:null, verdict:"far too optimistic", note:"The problems listed (language, learning, abstraction) took 60+ years." },
  { who:"Simon & Newell", y:1958, said:"Within ten years a digital computer will be the world's chess champion.", due:1968, met:1997, verdict:"right, 29 years late", note:"Deep Blue beat Kasparov in 1997." },
  { who:"Herbert Simon", y:1965, said:"Machines will be capable, within twenty years, of doing any work a man can do.", due:1985, met:null, verdict:"not yet", note:"Still the open question of AGI." },
  { who:"Marvin Minsky", y:1970, said:"In from three to eight years we will have a machine with the general intelligence of an average human being.", due:1978, met:null, verdict:"not yet", note:"As quoted by Life magazine (Minsky later said he was misquoted). The first AI winter began within five years." },
  { who:"Geoffrey Hinton", y:2016, said:"We should stop training radiologists now; within about five years deep learning will do better.", due:2021, met:null, verdict:"wrong on the timeline", note:"AI now assists radiologists, and demand for them has grown." }
];
const predLab = {
  kicker:"THE FORECASTS", title:"Score the founders' predictions against history",
  intro:`Slide to any year to see which famous predictions had come true by then. Each card shows who said it, when, the date they gave, and what actually happened.`,
  html:`<div class="it-control"><label><span>the year is</span><output data-o="y">2026</output></label><input type="range" data-i="y" min="1950" max="2026" step="1" value="2026"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The misses are famous; the surprises (such as chatbots passing Turing's test years after most researchers had stopped caring about it) are less so. Both belong in any honest forecast.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const Y = +q('[data-i="y"]').value; q('[data-o="y"]').textContent = Y;
      q('[data-role="out"]').innerHTML = PRED.filter(p => p.y <= Y).map(p => {
        const status = p.met && p.met <= Y ? `<span class="t">came true in ${p.met}</span>` : Y > p.due ? `<span class="r">overdue by ${Y - p.due} year(s)</span>` : `<span class="g">still in the future (due ${p.due})</span>`;
        return `<b>${p.who}, ${p.y}</b>: "${p.said}"\n  → ${status}${Y >= 2025 ? `  <span class="d">· ${p.verdict}. ${p.note}</span>` : ""}`;
      }).join("\n\n") || "no predictions made yet.";
    }
    q('[data-i="y"]').addEventListener("input", draw); draw();
  }
};

register("founding", {
  kicker:"FOUNDING DOCUMENTS · 1950–1956 · ABOUT 35 MIN",
  hook:"In 1950 Alan Turing asked whether machines can think, then replaced the question with a game. Six years later a summer workshop named the field. Nearly everything since answers one of these two documents.",
  intro:`Artificial intelligence began as writing: a philosophical paper in a journal, a funding proposal to a foundation, and a program that proved theorems. Together they set the field's ambitions, its methods and its habit of over-promising. Three labs below: play Turing's imitation game with his own sample answers, check theorems from Principia Mathematica, and score the founders' predictions against what happened.`,
  timeline:[[1948, "Turing: Intelligent Machinery"], [1950, "the imitation game"], [1955, "Dartmouth proposal"], [1956, "workshop · Logic Theorist"], [2025, "an LLM passes the game"]],
  labs:[imitationLab, thmLab, predLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, ask the addition question. The machine's answer is wrong, and slow, on purpose. Why would Turing design it that way?",
    "Play Lab 1 twice and try to decide using only the chess question. Then only the breakfast question. Which questions are actually informative?",
    "In Lab 2, check theorem *2.85, then the 'non-theorem'. Then type a formula with five variables and count the rows the checker had to try.",
    "In Lab 3, slide the year to 1973 (the Lighthill Report) and read the overdue predictions as a funding committee would.",
    "Read the Dartmouth proposal (two pages). Find the item on 'neuron nets' and connect it to the Neural Prehistory guide."
  ],
  sources:SOURCES
});
})();
