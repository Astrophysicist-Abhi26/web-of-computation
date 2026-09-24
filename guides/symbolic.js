// SYMBOLIC AI / GOFAI — intelligence as symbols, rules and search (1956–1990s).
// Four real labs, one per topic on the map: ELIZA's DOCTOR script rebuilt from
// its decomposition/reassembly rules, minimax game-tree search with alpha–beta
// pruning, a backward-chaining expert system that explains itself, and a tiny
// Prolog-style logic engine answering questions about academic family trees.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"🔣", title:"The physical symbol system hypothesis",
    who:"Allen Newell & Herbert Simon · 1976 Turing Award lecture",
    lead:"Symbolic AI's creed in one sentence: a system that manipulates symbols by rules has the necessary and sufficient means for general intelligence.",
    formula:"intelligence  =  symbols (representations)  +  rules (operations)  +  search (choosing which rules to apply)",
    what:`For symbolic AI, thinking is manipulating symbols that stand for things in the world, according to
      explicit rules: logic, plans, facts, "if–then" knowledge. Programs are written by people who make that
      knowledge explicit.`,
    how:`The approach was powerful where the world can be written down precisely: games, theorem proving,
      scheduling, configuration. It struggled where knowledge is vague, vast or perceptual (recognising a face,
      understanding a joke), exactly where neural networks later excelled.`,
    story:`The hypothesis framed forty years of research and the great argument with connectionism, which says
      intelligence emerges from many simple units learning from data. Hubert Dreyfus's "What Computers Can't
      Do" (1972) was its best-known philosophical critique.`,
    today:`The map marks this field 🪦, but its ideas persist: search runs in game engines and planners, logic in
      verification and databases, and LLM "agents" that call tools and follow plans are rebuilding symbolic
      machinery on top of neural networks.` },
  { icon:"♟", title:"Search — minimax and alpha–beta",
    who:"von Neumann 1928 · Shannon 1950 · alpha–beta (McCarthy and others, 1950s; Knuth & Moore 1975)",
    lead:"To play a game, imagine every move, every reply, every reply to that, and assume both sides play their best. Then prune the branches that can't matter.",
    formula:"value(node) = max over children (my move)  |  min over children (their move);   prune when α ≥ β",
    what:`Minimax assigns each position a value by looking ahead: on your turn take the best child, on your
      opponent's the worst. Alpha–beta pruning skips branches that provably cannot change the decision, often
      halving the depth of search you can afford. See both in Lab 2.`,
    how:`With perfect move ordering, alpha–beta examines about the square root of the nodes minimax does, which
      doubles the reachable depth. Real chess engines add evaluation functions, move ordering, transposition
      tables and years of tuning.`,
    story:`Shannon's 1950 paper "Programming a Computer for Playing Chess" laid out the plan. It culminated in Deep
      Blue's 1997 win over Kasparov (see Classic Milestones). Knuth and Moore's 1975 paper gave the definitive
      analysis of alpha–beta.`,
    today:`Alpha–beta still powers classical chess engines; Monte Carlo tree search (the Deep RL guide) replaced
      it in Go. Planning-by-search is returning in reasoning language models.` },
  { icon:"🛋", title:"ELIZA — and its horrified creator",
    who:"Joseph Weizenbaum · MIT · 1966",
    lead:"A few hundred lines of pattern-matching let a program play a psychotherapist. People confided in it. Its author spent the rest of his life warning about that.",
    formula:"decompose:  '* I am *'   →   reassemble:  'How long have you been (2)?'   (with pronouns swapped)",
    what:`ELIZA's DOCTOR script scans your sentence for keywords, splits it with a pattern and reassembles pieces
      into a reply, swapping "I" for "you". It knows nothing, but the therapeutic style (reflect the patient's
      words back) hides that very well. Talk to a rebuilt version in Lab 1.`,
    how:`Each keyword has a rank and a list of decomposition rules with several reassembly templates, used in
      rotation so replies don't repeat. With no keyword, ELIZA falls back on phrases like "Please go on".`,
    story:`Weizenbaum's secretary, who had watched him build it, asked him to leave the room so she could talk to
      it privately. Psychiatrists proposed using it for real therapy. Alarmed, Weizenbaum wrote "Computer Power
      and Human Reason" (1976), one of the first books on AI ethics. The tendency to read understanding into
      text is now called the ELIZA effect.`,
    today:`The ELIZA effect is stronger than ever with fluent chatbots, and people form real attachments to
      them. Weizenbaum's question (which decisions should never be handed to machines?) is current policy
      debate.` },
  { icon:"📜", title:"Prolog — programs as logic",
    who:"Alain Colmerauer & Philippe Roussel 1972 · Robert Kowalski",
    lead:"Instead of telling the computer how to compute, state facts and rules, and ask questions. The machine finds the answers by logical inference.",
    formula:"ancestor(X, Z) :- advisor(X, Z).      ancestor(X, Z) :- advisor(X, Y), ancestor(Y, Z).",
    what:`A Prolog program is a set of facts ("Church advised Turing") and rules ("an ancestor is an advisor, or
      an advisor's ancestor"). A query such as ancestor(X, sutskever) returns every X that makes it true. Try
      it on academic family trees in Lab 4.`,
    how:`Prolog answers queries by resolution and unification: it matches the query against rule heads, binds
      variables and works backwards. Kowalski's slogan was "algorithm = logic + control".`,
    story:`Japan's Fifth Generation Computer project (1982–1992) bet a national programme on logic programming,
      alarming the West into rival efforts. It did not deliver the intelligent machines promised, and its end
      was part of AI Winter II.`,
    today:`Its descendant Datalog runs inside program analysers, security tools and database query engines.
      Neurosymbolic research is reviving logic rules alongside neural networks (the map marks Prolog "flickering
      back").` },
  { icon:"🩺", title:"Expert systems — MYCIN and the knowledge boom",
    who:"Edward Shortliffe et al. (MYCIN) 1976 · XCON at DEC 1980",
    lead:"Interview human experts, write their know-how as hundreds of if–then rules, and let a program chain through them. For a decade, it looked like the future of AI.",
    formula:"IF organism is gram-negative AND rod-shaped AND anaerobic  THEN  (0.6)  it is Bacteroides",
    what:`MYCIN diagnosed bacterial blood infections and recommended antibiotics using about 600 rules, each with a
      certainty factor. It asked the doctor questions, chained backwards from possible diagnoses, and could
      explain its reasoning ("why are you asking?", "how did you conclude that?"). Lab 3 is a small system of
      the same kind.`,
    how:`Backward chaining starts from a hypothesis and asks only the questions needed to confirm or reject it.
      The explanation facility, replaying the rule chain, made these systems feel trustworthy in a way many
      modern models do not.`,
    story:`In a 1979 evaluation MYCIN's recommendations were rated as good as or better than infectious-disease
      experts', but it was never used clinically, for reasons of liability, integration and trust. Meanwhile
      DEC's XCON configured computer orders and saved millions, and companies rushed to build expert systems.`,
    today:`Rules still run in tax software, fraud detection and clinical decision support, often next to machine
      learning. MYCIN's explanation facility is a direct ancestor of today's work on explainable AI.` },
  { icon:"❄", title:"The knowledge bottleneck and AI Winter II",
    who:"1987 – early 1990s · the LISP machine collapse",
    lead:"Expert systems were brittle and expensive to maintain, and every rule had to be extracted by hand. When the market turned, it turned all at once.",
    formula:"hand-written rules: cost grows with every rule  ·  brittle outside their domain  ·  cannot learn",
    what:`The "knowledge acquisition bottleneck" was the fatal flaw: experts can't articulate most of what they
      know, rules conflict, and systems fail badly on cases just outside their design. Maintaining thousands of
      rules became unmanageable.`,
    how:`In 1987 the market for specialised LISP machines collapsed as cheaper desktop workstations caught up.
      Expert-system companies folded, government programmes wound down, and "AI" became a label to avoid on
      grant applications.`,
    story:`This is the second frost band on the map's timeline (1987–1993). Researchers who kept working
      rebranded as "machine learning", "knowledge systems" or "informatics", and the statistical methods that
      would eventually win grew quietly in that period.`,
    today:`The lesson that learned knowledge beats hand-coded knowledge became Sutton's Bitter Lesson (2019).
      Yet today's AI agents again combine learned models with explicit plans, tools and rules.` },
  { icon:"🧩", title:"Neurosymbolic AI — the synthesis",
    who:"2010s – now · hybrids of learning and reasoning",
    lead:"Neural networks are good at perception and fuzzy pattern; symbols are good at exact reasoning, composition and explanation. Many researchers think the future needs both.",
    formula:"neural perception  +  symbolic reasoning / search / tools  →  hybrid systems",
    what:`AlphaGo combined a neural network with symbolic search. Theorem provers pair language models with formal
      checkers such as Lean. LLM agents call calculators, code interpreters and databases, which are symbolic
      tools.`,
    how:`The designs differ in where the boundary sits: neural components that output symbols, symbolic
      structure built into networks, or a neural "controller" that calls symbolic modules.`,
    story:`The symbolic–connectionist war (see the ⚡ disputes) has cooled into collaboration. Gary Marcus and
      others argue pure scaling will not produce robust reasoning; others argue neural networks will learn to
      reason on their own. The evidence is still coming in.`,
    today:`AI systems that solve olympiad geometry and verify proofs in Lean are neurosymbolic by design: a
      learned model proposes, a symbolic system checks.` }
];

const SOURCES = [
  { type:"THE HYPOTHESIS · 1976", title:"Newell & Simon — Computer Science as Empirical Inquiry: Symbols and Search", note:"Turing Award lecture stating the physical symbol system hypothesis.", url:"https://doi.org/10.1145/360018.360022" },
  { type:"CHESS · 1950", title:"Claude Shannon — Programming a Computer for Playing Chess", note:"The blueprint for game-tree search.", url:"https://doi.org/10.1080/14786445008521796" },
  { type:"ALPHA–BETA · 1975", title:"Knuth & Moore — An Analysis of Alpha-Beta Pruning", note:"Artificial Intelligence 6(4). The definitive analysis.", url:"https://doi.org/10.1016/0004-3702(75)90019-3" },
  { type:"ELIZA · 1966", title:"Joseph Weizenbaum — ELIZA: A Computer Program for the Study of Natural Language Communication", note:"CACM 9(1), with the DOCTOR script.", url:"https://doi.org/10.1145/365153.365168" },
  { type:"PROLOG · 1993", title:"Colmerauer & Roussel — The Birth of Prolog", note:"The creators' own history of logic programming.", url:"https://doi.org/10.1145/154766.155362" },
  { type:"MYCIN · 1984 · FREE", title:"Buchanan & Shortliffe — Rule-Based Expert Systems: The MYCIN Experiments", note:"The full account of MYCIN, free online.", url:"https://www.shortliffe.net/Buchanan-Shortliffe-1984/MYCIN%20Book.htm" },
  { type:"THE CRITIQUE · 1973", title:"The Lighthill Report — Artificial Intelligence: A General Survey", note:"The report that cut UK AI funding.", url:"http://www.chilton-computing.org.uk/inf/literature/reports/lighthill_report/p001.htm" },
  { type:"NEUROSYMBOLIC · 2020", title:"Garcez & Lamb — Neurosymbolic AI: The 3rd Wave", note:"A survey of hybrid learning-and-reasoning systems.", url:"https://arxiv.org/abs/2012.05876" }
];

/* ------------------------------------------------------------ LAB 1: ELIZA */
const REFLECT = { i:"you", me:"you", my:"your", am:"are", "i'm":"you're", "i've":"you've", "i'll":"you'll", mine:"yours", you:"I", your:"my", yours:"mine", are:"am", myself:"yourself" };
const reflect = s => s.split(/\s+/).map(w => REFLECT[w] || w).join(" ");
const RULES = [
  [/\b(?:sorry)\b/, ["Please don't apologise.", "Apologies are not necessary."]],
  [/\bi remember (.*)/, ["Do you often think of %1?", "Does thinking of %1 bring anything else to mind?", "Why do you recall %1 right now?"]],
  [/\bi dreamt? (.*)/, ["Really, %1?", "Have you ever fantasized %1 while you were awake?", "What does that dream suggest to you?"]],
  [/\b(?:computer|machine|ai|robot)s?\b/, ["Do computers worry you?", "Why do you mention computers?", "What do you think machines have to do with your problem?"]],
  [/\bi am (.*)/, ["Is it because you are %1 that you came to me?", "How long have you been %1?", "Do you believe it is normal to be %1?"]],
  [/\bi'?m (.*)/, ["How long have you been %1?", "Why do you tell me you're %1?"]],
  [/\bi (?:feel|felt) (.*)/, ["Tell me more about such feelings.", "Do you often feel %1?", "When do you usually feel %1?"]],
  [/\bi (?:want|need) (.*)/, ["What would it mean to you if you got %1?", "Why do you want %1?", "Suppose you got %1 soon."]],
  [/\bmy (mother|father|mom|dad|sister|brother|family|wife|husband|partner)\b(.*)/, ["Tell me more about your family.", "Who else in your family %2?", "Your %1?"]],
  [/\bmy (.*)/, ["Your %1?", "Why do you say your %1?", "Does that suggest anything else which belongs to you?"]],
  [/\bbecause (.*)/, ["Is that the real reason?", "Don't any other reasons come to mind?", "What other reasons might there be?"]],
  [/\byou (?:are|'re) (.*)/, ["What makes you think I am %1?", "Does it please you to believe I am %1?"]],
  [/\b(?:yes)\b/, ["You seem quite positive.", "You are sure.", "I see."]],
  [/\b(?:no|never)\b/, ["Are you saying no just to be negative?", "Why not?", "You are being a bit negative."]],
  [/\b(?:always)\b/, ["Can you think of a specific example?", "When?", "Really, always?"]],
  [/\bcan you (.*)/, ["You believe I can %1, don't you?", "Whether or not I can %1 depends on you more than me."]],
  [/(.*)\?$/, ["Why do you ask?", "What is it you really want to know?", "What do you think?"]]
];
const FALLBACK = ["Please go on.", "I'm not sure I understand you fully.", "What does that suggest to you?", "Do you feel strongly about discussing such things?", "Tell me more."];
const elizaLab = {
  kicker:"ELIZA · 1966", title:"Talk to the DOCTOR",
  intro:`This is a rebuild of the core of Weizenbaum's DOCTOR script: keyword patterns, pronoun reflection ("my" becomes "your") and reassembly templates used in rotation. It understands nothing. Notice how quickly it can still feel like it is listening. Tick "show the machinery" to see which rule fired.`,
  html:`<div class="gk-chat" data-role="chat"><div class="gk-msg bot">How do you do. Please tell me your problem.</div></div>
    <div class="gk-row"><input class="gk-input" data-role="in" placeholder="type and press Enter…" spellcheck="false"><button class="it-send" data-a="send">send</button></div>
    <div class="it-lab-actions"><label class="it-check"><input type="checkbox" data-role="dbg"> show the machinery</label></div>`,
  caveat:`Try "I remember my mother", "I am worried about computers", "you are not listening". Then try something it has no rule for, and watch the illusion break.`,
  init(root) {
    const q = s => root.querySelector(s), used = {};
    function reply(txt) {
      const t = txt.toLowerCase().replace(/[.!,;]/g, "").trim();
      for (let i = 0; i < RULES.length; i++) { const m = t.match(RULES[i][0]); if (m) { const opts = RULES[i][1], k = (used[i] = (used[i] || 0) + 1) - 1;
        return [opts[k % opts.length].replace(/%(\d)/g, (_, n) => reflect((m[+n] || "").trim())).replace(/\s+\?/, "?"), `rule ${i + 1}: ${RULES[i][0].source}`]; } }
      used.f = (used.f || 0) + 1; return [FALLBACK[(used.f - 1) % FALLBACK.length], "no keyword matched: fallback"];
    }
    function send() {
      const v = q('[data-role="in"]').value.trim(); if (!v) return; q('[data-role="in"]').value = "";
      const [r, why] = reply(v), dbg = q('[data-role="dbg"]').checked;
      q('[data-role="chat"]').insertAdjacentHTML("beforeend", `<div class="gk-msg you"></div><div class="gk-msg bot"></div>`);
      const msgs = q('[data-role="chat"]').querySelectorAll(".gk-msg"); msgs[msgs.length - 2].textContent = v; msgs[msgs.length - 1].textContent = r + (dbg ? `   [${why}]` : "");
      q('[data-role="chat"]').scrollTop = 1e6;
    }
    q('[data-a="send"]').addEventListener("click", send); q('[data-role="in"]').addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  }
};

/* --------------------------------------------------------- LAB 2: alpha–beta */
function makeTree(seed, depth, br) { const r = rng(seed); const mk = d => d === 0 ? { v:Math.round(r() * 18 - 9) } : { k:Array.from({ length:br }, () => mk(d - 1)) }; return mk(depth); }
function minimax(n, max, stats) { stats.n++; if (n.v !== undefined) { n.val = n.v; return n.v; } const vs = n.k.map(c => minimax(c, !max, stats)); n.val = max ? Math.max(...vs) : Math.min(...vs); return n.val; }
function alphabeta(n, max, a, b, stats) {
  stats.n++; n.seen = true; if (n.v !== undefined) { n.val = n.v; return n.v; }
  let v = max ? -Infinity : Infinity;
  for (let i = 0; i < n.k.length; i++) { const c = n.k[i]; const cv = alphabeta(c, !max, a, b, stats);
    if (max) { v = Math.max(v, cv); a = Math.max(a, v); } else { v = Math.min(v, cv); b = Math.min(b, v); }
    if (a >= b) { for (let j = i + 1; j < n.k.length; j++) n.k[j].pruned = true; break; } }
  n.val = v; return v;
}
const clear = n => { delete n.val; delete n.seen; delete n.pruned; (n.k || []).forEach(clear); };
const abLab = {
  kicker:"GAME-TREE SEARCH", title:"Minimax, then prune it with alpha–beta",
  intro:`You (MAX, top) choose a move, the opponent (MIN) replies, you move again, and the bottom row scores the final positions. Minimax fills in every value from the bottom up. Alpha–beta reaches the same answer while skipping branches (greyed) that cannot change it. Compare the number of positions each one examines.`,
  html:`<div class="gk-chips" data-role="m"><button class="gk-chip on" data-v="mm">plain minimax</button><button class="gk-chip" data-v="ab">alpha–beta</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="new">new random tree</button><label class="it-check"><input type="checkbox" data-role="ord"> good move ordering (best-first)</label></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`With perfect ordering, alpha–beta examines roughly the square root of what minimax does, which lets a chess engine search about twice as deep in the same time. Tick 'good move ordering' to see the effect.`,
  init(root) {
    const q = s => root.querySelector(s); let mode = "mm", seed = 4;
    function orderTree(n, max) { if (n.v !== undefined) return n.v; const vals = n.k.map(c => orderTree(c, !max)); const idx = vals.map((v, i) => i).sort((a, b) => max ? vals[b] - vals[a] : vals[a] - vals[b]); n.k = idx.map(i => n.k[i]); return max ? Math.max(...vals) : Math.min(...vals); }
    function draw() {
      const T = makeTree(seed, 3, 3); if (q('[data-role="ord"]').checked) orderTree(T, true);
      const st = { n:0 }, other = { n:0 }; clear(T);
      if (mode === "mm") { minimax(T, true, st); const T2 = JSON.parse(JSON.stringify(T)); clear(T2); alphabeta(T2, true, -Infinity, Infinity, other); }
      else { alphabeta(T, true, -Infinity, Infinity, st); const T2 = JSON.parse(JSON.stringify(T)); clear(T2); minimax(T2, true, other); }
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 220); ctx.clearRect(0, 0, W, H);
      const levels = [[T]]; for (let d = 0; d < 3; d++) levels.push(levels[d].flatMap(n => n.k));
      const pos = new Map(); levels.forEach((row, d) => row.forEach((n, i) => pos.set(n, [(i + .5) / row.length * W, 18 + d * (H - 36) / 3])));
      const isPruned = n => { let p = false; levels.forEach(row => row.forEach(m => { if (m.pruned) { const stack = [m]; while (stack.length) { const x = stack.pop(); if (x === n) p = true; (x.k || []).forEach(c => stack.push(c)); } } })); return p; };
      levels.forEach((row, d) => row.forEach(n => (n.k || []).forEach(c => { const [x1, y1] = pos.get(n), [x2, y2] = pos.get(c); ctx.strokeStyle = mode === "ab" && isPruned(c) ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.3)"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); })));
      levels.forEach((row, d) => row.forEach(n => { const [x, y] = pos.get(n), pr = mode === "ab" && isPruned(n), known = n.val !== undefined && !pr;
        ctx.fillStyle = pr ? "rgba(255,255,255,.06)" : d % 2 === 0 ? "rgba(245,196,81,.25)" : "rgba(63,208,201,.22)";
        ctx.beginPath(); d === 3 ? ctx.rect(x - 9, y - 9, 18, 18) : ctx.arc(x, y, 11, 0, 7); ctx.fill();
        ctx.fillStyle = pr ? "rgba(255,255,255,.25)" : C.ink; ctx.font = "10px IBM Plex Mono, monospace"; ctx.textAlign = "center";
        ctx.fillText(d === 3 ? n.v : known ? n.val : "?", x, y + 3.5); ctx.textAlign = "left"; }));
      ctx.fillStyle = C.gold; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText("MAX", 2, 21); ctx.fillStyle = C.teal; ctx.fillText("MIN", 2, 21 + (H - 36) / 3); ctx.fillStyle = C.gold; ctx.fillText("MAX", 2, 21 + 2 * (H - 36) / 3);
      const best = T.k.findIndex(c => c.val === T.val);
      q('[data-role="out"]').innerHTML = `value of the game for MAX: <span class="g">${T.val}</span>   best first move: <span class="t">${["left", "middle", "right"][best]}</span>\n` +
        `positions examined: <span class="g">${st.n}</span> (${mode === "mm" ? "minimax" : "alpha–beta"})   vs   ${other.n} (${mode === "mm" ? "alpha–beta" : "minimax"})`;
    }
    root.querySelectorAll('[data-role="m"] .gk-chip').forEach(b => b.addEventListener("click", () => { mode = b.dataset.v; root.querySelectorAll('[data-role="m"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    q('[data-a="new"]').addEventListener("click", () => { seed++; draw(); }); q('[data-role="ord"]').addEventListener("change", draw);
    draw();
  }
};

/* ---------------------------------------------------- LAB 3: expert system */
const XR = [
  { id:"R1", if:["has hair"], then:"mammal" }, { id:"R2", if:["gives milk"], then:"mammal" },
  { id:"R3", if:["has feathers"], then:"bird" }, { id:"R4", if:["flies", "lays eggs"], then:"bird" },
  { id:"R5", if:["mammal", "eats meat"], then:"carnivore" },
  { id:"R6", if:["mammal", "has hooves"], then:"ungulate" },
  { id:"R7", if:["carnivore", "tawny colour", "dark spots"], then:"cheetah" },
  { id:"R8", if:["carnivore", "tawny colour", "black stripes"], then:"tiger" },
  { id:"R9", if:["ungulate", "long neck", "dark spots"], then:"giraffe" },
  { id:"R10", if:["ungulate", "black stripes"], then:"zebra" },
  { id:"R11", if:["bird", "does not fly", "long neck"], then:"ostrich" },
  { id:"R12", if:["bird", "does not fly", "swims"], then:"penguin" },
  { id:"R13", if:["bird", "flies well"], then:"albatross" }
];
const GOALS = ["cheetah", "tiger", "giraffe", "zebra", "ostrich", "penguin", "albatross"];
const expertLab = {
  kicker:"EXPERT SYSTEMS · BACKWARD CHAINING", title:"A rule-based system that asks, concludes, and explains",
  intro:`Think of one of these animals: cheetah, tiger, giraffe, zebra, ostrich, penguin or albatross. The system tries each hypothesis in turn and works backwards through its 13 if–then rules, asking only the questions it needs. At the end, it explains exactly which rules led to its answer, as MYCIN did.`,
  html:`<div class="gk-out" data-role="q" style="font-family:Spectral,Georgia,serif;font-size:.9rem"></div>
    <div class="it-lab-actions"><button class="it-send" data-a="yes">yes</button><button class="it-send" data-a="no">no</button><button class="gk-ghost" data-a="restart">start again</button></div>
    <div class="gk-out" data-role="trace"></div>`,
  caveat:`This is the textbook 'zookeeper' rule base. MYCIN worked the same way with about 600 rules and certainty factors instead of yes/no. Every new animal needs new rules written by hand: the knowledge bottleneck in miniature.`,
  init(root) {
    const q = s => root.querySelector(s); let facts, asked, trace, gen, pending;
    function* prove(goal) { // yields questions; returns true/false
      if (goal in facts) return facts[goal];
      const rules = XR.filter(r => r.then === goal);
      if (!rules.length) { const ans = yield goal; facts[goal] = ans; asked.push(`${goal}? ${ans ? "yes" : "no"}`); return ans; }
      for (const r of rules) { let ok = true; for (const c of r.if) { if (!(yield* prove(c))) { ok = false; break; } }
        if (ok) { facts[goal] = true; trace.push(`${r.id}: IF ${r.if.join(" AND ")} THEN ${goal}`); return true; } }
      facts[goal] = false; return false;
    }
    function* run() { for (const g of GOALS) { if (yield* prove(g)) return g; } return null; }
    function advance(ans) {
      const res = gen.next(ans);
      if (res.done) {
        q('[data-role="q"]').innerHTML = res.value ? `It's a <b style="color:${C.gold}">${res.value}</b>.` : "No rule matches: that animal is outside my knowledge base.";
        q('[data-role="trace"]').innerHTML = `<span class="g">how I concluded:</span>\n${trace.join("\n") || "(no rule fired)"}\n\n<span class="d">questions asked (${asked.length}): ${asked.join(" · ")}</span>`;
        pending = false; return;
      }
      pending = true; q('[data-role="q"]').innerHTML = `Does your animal: <b>${res.value}</b>?`;
      q('[data-role="trace"]').innerHTML = `<span class="d">asked so far: ${asked.join(" · ") || "nothing"}</span>`;
    }
    function start() { facts = {}; asked = []; trace = []; gen = run(); advance(); }
    q('[data-a="yes"]').addEventListener("click", () => { if (pending) advance(true); });
    q('[data-a="no"]').addEventListener("click", () => { if (pending) advance(false); });
    q('[data-a="restart"]').addEventListener("click", start);
    start();
  }
};

/* -------------------------------------------------------- LAB 4: mini Prolog */
const FACTS = [
  ["lennardjones", "coulson"], ["coulson", "longuethiggins"], ["longuethiggins", "hinton"], ["hinton", "sutskever"], ["hinton", "krizhevsky"],
  ["church", "turing"], ["church", "kleene"], ["church", "rabin"], ["church", "scott"], ["tucker", "minsky"], ["tucker", "nash"],
  ["lefschetz", "mccarthy"], ["barto", "sutton"], ["bengio", "goodfellow"], ["feifeili", "karpathy"]
];
const QUERIES = ["ancestor(X, sutskever)", "advisor(church, X)", "ancestor(lennardjones, X)", "sibling(sutskever, X)", "ancestor(X, turing)"];
function derive() {
  const adv = FACTS.map(([a, b]) => ["advisor", a, b]);
  let anc = FACTS.map(([a, b]) => ["ancestor", a, b]), grew = true, rounds = 0;
  while (grew) { grew = false; rounds++; const add = [];
    for (const [, x, y] of adv) for (const [, y2, z] of anc) if (y === y2 && !anc.some(f => f[1] === x && f[2] === z) && !add.some(f => f[1] === x && f[2] === z)) add.push(["ancestor", x, z]);
    if (add.length) { anc = anc.concat(add); grew = true; } }
  const sib = []; for (const [, a, b] of adv) for (const [, a2, c] of adv) if (a === a2 && b !== c) sib.push(["sibling", b, c]);
  return { all:adv.concat(anc, sib), rounds };
}
const prologLab = {
  kicker:"LOGIC PROGRAMMING · PROLOG / DATALOG", title:"Ask questions of an academic family tree",
  intro:`The program is 15 facts, advisor(Advisor, Student), taken from real PhD lineages, plus three rules. Type a query with a capitalised variable, such as ancestor(X, sutskever), and the engine lists every value of X that makes it true. It never follows a procedure you wrote; it infers.`,
  html:`<div class="gk-out"><span class="d">% rules</span>
ancestor(X, Z) :- advisor(X, Z).
ancestor(X, Z) :- advisor(X, Y), ancestor(Y, Z).
sibling(A, B)  :- advisor(P, A), advisor(P, B), A ≠ B.</div>
    <div class="gk-chips" data-role="pre">${QUERIES.map(x => `<button class="gk-chip">${x}</button>`).join("")}</div>
    <div class="gk-row"><input class="gk-input" data-role="qin" value="ancestor(X, sutskever)" spellcheck="false"><button class="it-send" data-a="ask">?-</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Lineage: Lennard-Jones supervised Coulson, who supervised Longuet-Higgins, who supervised Hinton. Church's students include Turing, Kleene, Rabin and Scott. Real Prolog solves queries top-down by resolution; this engine computes all consequences bottom-up (as Datalog does), which gives the same answers here.`,
  init(root) {
    const q = s => root.querySelector(s); const D = derive();
    function ask() {
      const src = q('[data-role="qin"]').value.trim(), m = src.match(/^(\w+)\(\s*(\w+)\s*,\s*(\w+)\s*\)\.?$/);
      if (!m) { q('[data-role="out"]').innerHTML = `<span class="r">write a query like ancestor(X, hinton)</span>`; return; }
      const [, pred, a, b] = m, isVar = t => /^[A-Z_]/.test(t);
      const hits = D.all.filter(f => f[0] === pred && (isVar(a) || f[1] === a.toLowerCase()) && (isVar(b) || f[2] === b.toLowerCase()));
      if (!isVar(a) && !isVar(b)) { q('[data-role="out"]').innerHTML = hits.length ? `<span class="t">true.</span>` : `<span class="r">false.</span>`; return; }
      const uniq = [...new Set(hits.map(f => [isVar(a) ? `${a} = ${f[1]}` : "", isVar(b) ? `${b} = ${f[2]}` : ""].filter(Boolean).join(", ")))];
      q('[data-role="out"]').innerHTML = uniq.length ? uniq.map(x => `<span class="g">${x}</span>`).join(" ;\n") + " .\n" + `<span class="d">${uniq.length} solution(s) · derived from ${FACTS.length} facts in ${D.rounds} rounds of inference</span>` : `<span class="r">false.</span>`;
    }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="qin"]').value = b.textContent; ask(); }));
    q('[data-a="ask"]').addEventListener("click", ask); q('[data-role="qin"]').addEventListener("keydown", e => { if (e.key === "Enter") ask(); });
    ask();
  }
};

register("symbolic", {
  kicker:"SYMBOLIC AI / GOFAI · 1956–1990s · ABOUT 50 MIN",
  hook:"Weizenbaum's own secretary asked him to leave the room so she could talk to ELIZA in private. The program was a few hundred lines of pattern matching.",
  intro:`For its first three decades AI meant 'Good Old-Fashioned AI': intelligence as symbols, rules and search, written by hand. It produced chess programs, theorem provers, chatbots and expert systems that outperformed doctors, and then it hit the knowledge bottleneck and the second AI winter. Its ideas never went away. Four labs below, one for each topic on the map: talk to ELIZA, search a game tree with alpha–beta, consult an expert system that explains itself, and query a Prolog-style logic program.`,
  timeline:[[1956, "search & heuristics"], [1966, "ELIZA"], [1972, "Prolog"], [1976, "MYCIN"], [1987, "LISP machine crash"]],
  labs:[elizaLab, abLab, expertLab, prologLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, have a five-line conversation with ELIZA about something that matters to you, then tick 'show the machinery' and replay it. The ELIZA effect is the gap between those two experiences.",
    "In Lab 2, compare the positions examined by minimax and alpha–beta on five random trees. Then tick 'good move ordering' and compare again.",
    "In Lab 3, think of a cheetah and answer honestly. Then answer 'yes' to every question: the system confidently says 'cheetah' anyway. It checks only the facts it needs, never whether they are consistent, a classic brittleness failure.",
    "In Lab 4, find everyone descended from Lennard-Jones, then ask sibling(sutskever, X). Add a lineage you know by editing the idea, not the code: every new fact needs a human.",
    "Read Weizenbaum's 1966 paper (sources) and compare his worries with today's debate about AI companions."
  ],
  sources:SOURCES
});
})();
