// COMPUTABILITY THEORY — the field Turing invented in 1936, on pen and paper,
// before a single computer existed. Loaded only when the Computability field
// opens. Same visual language as math-logic / quantum / complexity guides.
// The four labs are REAL: a fully programmable multi-rule Turing machine, an
// honest halting-paradox tracer, a Church–Turing translator (unary λ vs TM on
// the same inputs), and a clickable undecidability web driven by reductions.
(function () {
"use strict";

// ---------------------------------------------------------------- chapters
const CHAPTERS = [
  {
    icon: "🏛", title: "The Entscheidungsproblem — the question that started it", who: "Leibniz 1680s · Hilbert–Ackermann 1928",
    lead: "Is there a mechanical procedure that decides, for any mathematical statement, whether it is provable? Answering it required inventing the computer.",
    formula: "Entscheidungsproblem: ∃ algorithm A. ∀ statement φ. A(φ) = (is φ provable?) ?",
    what: `Hilbert's 1928 challenge (the "decision problem") asked for a definite
      method — a finite, mechanical recipe — that takes any first-order logical
      statement and outputs whether it is provable. Leibniz had dreamed the same
      dream centuries earlier: a calculus ratiocinator that would let disputants
      "calculate" who was right. To answer Hilbert you first had to pin down the
      slippery word "mechanical procedure." That definition — not the answer —
      is the birth of computer science.`,
    how: `The problem is the hinge between two eras. Before it: "algorithm" was
      an informal, intuitive notion (a recipe, a method). After it: three people
      independently gave "algorithm" a precise mathematical definition within a
      few years — Church's λ-calculus (1936), Turing's machines (1936), Gödel and
      Kleene's recursive functions (1936). All three turned out to define exactly
      the same class of computable functions. That astonishing convergence is the
      evidence for the Church–Turing thesis, four chapters on.`,
    story: `Hilbert believed the answer would be YES — that mathematics was, in
      principle, mechanically decidable. He had already been wounded once: in
      1931 Gödel's incompleteness theorems (see Mathematical Logic, next door)
      killed his dreams of completeness and self-proved consistency. The
      Entscheidungsproblem was the last pillar standing. Within five years it
      too fell — and the rubble contained a blueprint for a machine that could
      compute anything computable. Hilbert asked for a decision procedure and
      accidentally commissioned the computer.`,
    today: `Every time a compiler reports it "cannot determine" whether your loop
      terminates, every time a static analyzer gives an approximate answer
      instead of a perfect one, you are meeting the Entscheidungsproblem's ghost.
      The question was answered NO — and that "no" defines the permanent
      boundary of what software can ever promise about software.`
  },
  {
    icon: "🏛", title: "The Turing machine — a definition of 'algorithm'", who: "Alan Turing · 1936 (age 23)",
    lead: "A tape, a head, a table of rules. The simplest imaginable device — and it captures everything any computer can ever do.",
    formula: "M = (Q, Γ, δ, q₀, F)   ·   δ : Q × Γ → Q × Γ × {L, R}",
    what: `Turing's genius was to model not a machine but a HUMAN computer — a
      clerk following rules. Strip that clerk to essentials: a strip of paper
      (the tape) divided into cells; an eye reading one cell (the head); a
      finite list of mental states; and a rulebook: "in state q reading symbol s,
      write s′, move left/right, switch to state q′." That is the entire
      apparatus. Build one yourself in the lab above — three rules suffice to add
      1 to a binary number. Nothing more is needed to define computation.`,
    how: `The formal object is a 5-tuple (states, alphabet, transition function,
      start, accept). Its power comes from the unbounded tape (memory you never
      run out of) and the deterministic rule table. Turing argued — with a
      careful analysis of what a human calculator actually does — that ANY
      effective procedure can be carried out by such a machine. Not "some"
      procedures. Any. The audacity of that claim is the reason the field
      exists, and 90 years of searching has never found a counterexample.`,
    story: `Turing wrote "On Computable Numbers" as a 23-year-old Cambridge
      fellow, submitting it in 1936. His analysis was so novel that his mentor
      Max Newman initially doubted such a simple gadget could be so universal.
      Then came the deflation: Alonzo Church had published an equivalent answer
      (via λ-calculus) months earlier. Newman fought for Turing's paper on the
      grounds that the MACHINE was a distinct and deeper contribution — it made
      "computation" visible, tangible, mechanical. He was right: Church gave an
      answer, Turing gave an answer you could build. Four years later he was
      building one at Bletchley Park (see Classical Cryptography, one nebula
      east).`,
    today: `The Turing machine is the yardstick of computation. "Turing-complete"
      — able to simulate a Turing machine — is the certificate every real
      programming language, and a shocking number of accidental systems (Conway's
      Game of Life, Magic: The Gathering, some spreadsheet formulas, even certain
      CSS + HTML setups) proudly or embarrassingly earn. Your laptop is, at heart,
      a fast Turing machine with a finite (but enormous) tape.`
  },
  {
    icon: "🏛", title: "The Universal Machine — software is born", who: "Alan Turing · 1936",
    lead: "One machine that, given a description of any other machine, becomes it. This is the idea your entire device is built on.",
    formula: "∃ U. ∀ M, x.   U(⟨M⟩, x) = M(x)   ·   programs are data",
    what: `Turing's second bombshell: you don't need a different machine for each
      task. There is a single UNIVERSAL machine U that takes as input a
      description ⟨M⟩ of any machine M plus M's input x, and faithfully simulates
      what M would do. One fixed piece of hardware; infinitely many behaviors,
      selected by the program you feed it. This is the stored-program computer,
      described in 1936 — a decade before any existed.`,
    how: `The key move is that a machine's rule-table can itself be written on
      the tape as data — encoded as a string of symbols, exactly the way the
      Gödel machine (Mathematical Logic) encoded formulas as numbers. Once
      program and data live in the same medium, one interpreter can read any
      program and run it. Every operating system, every app store, every
      interpreter and virtual machine and emulator is Turing's U, industrialized.
      The distinction between "hardware" and "software" is this paragraph.`,
    story: `Von Neumann knew Turing's 1936 paper intimately, and when he drafted
      the 1945 architecture that every modern computer follows — the famous
      "stored-program" design where instructions and data share one memory — he
      was building U in electronics. He repeatedly credited the fundamental
      conception to Turing. So the lineage is clean and astonishing: a 1936
      thought experiment about a clerk with a paper tape → von Neumann's 1945
      blueprint → the device rendering this sentence. The universal machine is
      arguably the single most consequential idea on this entire map.`,
    today: `Universality is why one phone can be a camera, a piano, a map, and a
      terminal to a language model — all by loading different programs into the
      same universal hardware. It is also why viruses, interpreters, and app
      ecosystems are possible at all. When you install software, you are choosing
      which machine your universal machine will pretend to be.`
  },
  {
    icon: "🏛", title: "The Halting Problem — the first thing computers can't do", who: "Alan Turing · 1936",
    lead: "No program can decide, for all programs, whether they eventually stop. The diagonal argument, aimed at machines.",
    formula: "HALT(⟨M⟩, x) undecidable   ·   build H, then D(⟨M⟩)=loop if M halts — run D on itself 💥",
    what: `Suppose a perfect halt-detector H exists: feed it any program and input,
      and it always correctly answers "halts" or "runs forever." Turing proved H
      cannot exist. Build a troublemaker D that calls H on its OWN description and
      then does the opposite: if H says "D halts," D loops forever; if H says "D
      loops," D halts. Now ask: does D halt? Either answer makes H wrong. The
      halting-paradox lab above lets you run exactly this self-devouring machine
      and watch it corner H.`,
    how: `Look closely and you'll recognize the move: it is Cantor's diagonal
      (Mathematical Logic) and Gödel's self-reference, now aimed at programs. D
      is built to differ from every possible verdict of H, exactly as Cantor's
      diagonal sequence differs from every row of the list. Three of the deepest
      results in human thought — the uncountability of the reals (1891), the
      incompleteness of arithmetic (1931), and the undecidability of halting
      (1936) — are ONE argument, refracted through three lenses. Learn it once;
      own all three.`,
    story: `Turing didn't frame it as "the halting problem" — that name came
      later — but the argument is his, and it settled the Entscheidungsproblem:
      NO, there is no mechanical decision procedure for mathematics, because you
      could use one to solve halting, which is impossible. The proof is barely
      half a page. A 23-year-old ended a 250-year-old dream of Leibniz and a
      direct challenge from the most powerful mathematician of the age, with a
      paragraph about a machine that contradicts itself.`,
    today: `Halting's undecidability is not academic — it is why perfect bug
      detectors, perfect virus scanners, and perfect "will this code ever crash?"
      analyzers are mathematically impossible. Rice's theorem (next chapter)
      generalizes it to essentially EVERY interesting property of programs. The
      entire discipline of program verification lives in the shadow of this
      half-page proof, building clever approximations to a question that has no
      exact answer.`
  },
  {
    icon: "🏛", title: "The Church–Turing Thesis — what 'computable' means", who: "Church · Turing · Kleene · Post · 1936",
    lead: "Every reasonable definition of 'algorithm' turns out equivalent. Bold claim: THIS is all computation, forever.",
    formula: "λ-calculus  ≡  Turing machines  ≡  μ-recursive functions  ≡  Post systems  ≡  … ≝ COMPUTABLE",
    what: `In the mid-1930s several people, working separately, tried to
      formalize "effectively calculable." Church built the λ-calculus (functions
      and substitution, nothing else). Turing built his machines. Gödel and
      Kleene defined μ-recursive functions (arithmetic built from basic
      operations plus a search). Post defined rewriting systems. Then the miracle:
      every one of these defines EXACTLY the same class of functions. The
      Church–Turing thesis asserts this class IS the intuitive notion of
      "computable" — no physically realizable process can compute more.`,
    how: `Note what kind of claim this is: not a theorem (you can't prove a
      formal statement equals an informal intuition), but an empirical, almost
      scientific hypothesis. Its evidence is the relentless convergence: every
      new model of computation ever proposed — cellular automata, quantum
      computers, DNA computing, your laptop — computes the same set of functions
      (quantum computers change the SPEED, never the boundary of the possible).
      Ninety years of attempts to exceed it have all failed. Play with the
      translator lab above: watch a λ-term and a Turing machine compute the same
      answer by utterly different means.`,
    story: `Church and Turing arrived at the same summit from opposite faces and
      became linked forever in the thesis's name — though Turing then went to
      Princeton to do his PhD UNDER Church, an almost poetic convergence. The
      deep reason the thesis feels true: Turing's original argument wasn't about
      machines at all, but about the limits of what a human clerk following fixed
      rules can do. Computation, he showed, is not a fact about silicon or
      brains — it is a fact about symbols and rules. That is why the same
      boundary keeps reappearing no matter what substrate you try.`,
    today: `The thesis is the bedrock assumption of computer science: when we say
      a problem is "computable" or "uncomputable," we mean Turing-computable, and
      we trust that captures every possible notion. The "extended" thesis (about
      efficiency, not just possibility) is where quantum computing pushes — but
      even quantum machines compute exactly the same FUNCTIONS, just some of them
      faster. The wall of the possible, drawn in 1936, has never moved.`
  },
  {
    icon: "🔥", title: "The undecidable universe — Rice, degrees & busy beavers", who: "Post 1944 · Rice 1951 · Radó 1962",
    lead: "Halting was just the first. There is an infinite hierarchy of the unsolvable — and some uncomputable numbers you can almost touch.",
    formula: "Rice: every non-trivial semantic property is undecidable · BB(6) is unknowable · 0 <ᴛ 0′ <ᴛ 0″ …",
    what: `Once you have ONE undecidable problem, reductions spread the disease
      (exactly as in Complexity Theory, but for possibility, not speed). Rice's
      theorem (1951) is the sweeping generalization: ANY non-trivial property of
      the FUNCTION a program computes is undecidable. Not just halting — "does
      this program ever output 7?", "are these two programs equivalent?", "is
      this code a virus?" — all undecidable, by one theorem. The undecidability
      web lab above lets you drag reductions and watch hardness propagate.`,
    how: `The unsolvable has STRUCTURE. Post asked whether there are problems
      strictly between decidable and as-hard-as-halting; the theory of Turing
      degrees answers yes — an infinite hierarchy 0 <ᴛ 0′ <ᴛ 0″ … where each
      "jump" is a strictly harder halting problem for machines with an oracle for
      the last. And the Busy Beaver function BB(n) — the most steps an n-state
      machine can run before halting — grows faster than ANY computable function
      and is itself uncomputable. BB(5) was only pinned down in 2024 (47,176,870
      by a massive collaborative proof); BB(6) is astronomically, provably beyond
      reach.`,
    story: `Tibor Radó introduced the Busy Beaver game in 1962 as the friendliest
      possible face of uncomputability: a concrete integer, BB(n), that no
      algorithm can compute. It became a beloved sport — a decades-long hunt where
      amateurs and researchers race tiny machines, and where BB(5)'s 2024
      resolution (via the open online "bbchallenge" collaboration) made headlines.
      Emil Post, meanwhile, developed much of degree theory while battling severe
      bipolar illness, and died in 1954 shortly after electroshock treatment — one
      more tragic life among this field's founders, alongside Turing and Gödel.`,
    today: `Rice's theorem is why every antivirus, every linter, every optimizing
      compiler is fundamentally an approximation racket — perfect answers are
      impossible, so the art is in useful heuristics. The Busy Beaver frontier
      connects uncomputability to open mathematics: specific small Turing machines
      have been built whose halting is equivalent to famous conjectures (Goldbach,
      the Riemann Hypothesis), so knowing certain BB values would settle them.
      Uncomputability isn't a locked door — it's an infinite staircase.`
  }
];

// ---------------------------------------------------------------- sources
const SOURCES = [
  {
    type: "FOUNDATIONAL PAPER · 1936",
    title: "Alan Turing — On Computable Numbers, with an Application to the Entscheidungsproblem",
    note: "The machine, the universal machine, the halting argument, the answer to Hilbert. The birth certificate.",
    url: "https://doi.org/10.1112/plms/s2-42.1.230"
  },
  {
    type: "FOUNDATIONAL PAPER · 1936",
    title: "Alonzo Church — An Unsolvable Problem of Elementary Number Theory",
    note: "The λ-calculus answer to the Entscheidungsproblem, months before Turing — the other half of the thesis.",
    url: "https://doi.org/10.2307/2371045"
  },
  {
    type: "FOUNDATIONAL PAPER · 1951",
    title: "H. G. Rice — Classes of Recursively Enumerable Sets and Their Decision Problems",
    note: "Rice's theorem: every non-trivial property of a program's behavior is undecidable.",
    url: "https://doi.org/10.2307/1990888"
  },
  {
    type: "FOUNDATIONAL PAPER · 1944",
    title: "Emil Post — Recursively Enumerable Sets of Positive Integers and Their Decision Problems",
    note: "Founds the theory of Turing degrees — the hierarchy of the unsolvable. Poses Post's problem.",
    url: "https://doi.org/10.1090/S0002-9904-1944-08111-1"
  },
  {
    type: "THE BUSY BEAVER · 2024",
    title: "The Busy Beaver Challenge — BB(5) = 47,176,870, proven",
    note: "The collaborative online proof that pinned the 5-state busy beaver — uncomputability you can watch being hunted.",
    url: "https://bbchallenge.org"
  },
  {
    type: "LEGENDARY TEXTBOOK",
    title: "Michael Sipser — Introduction to the Theory of Computation",
    note: "The universally beloved textbook: Turing machines, decidability, reducibility, made genuinely clear.",
    url: "https://en.wikipedia.org/wiki/Introduction_to_the_Theory_of_Computation"
  },
  {
    type: "REFERENCE · STANFORD",
    title: "Stanford Encyclopedia of Philosophy — The Church–Turing Thesis",
    note: "The definitive free scholarly account: what the thesis does and does not claim, and its many misreadings.",
    url: "https://plato.stanford.edu/entries/church-turing/"
  },
  {
    type: "PLAY TO LEARN · FREE",
    title: "turingmachine.io — a beautiful visual Turing machine simulator",
    note: "Write transition tables in a clean notation and watch the tape run. The deep end, after this lab's shallow one.",
    url: "https://turingmachine.io"
  }
];

// ------------------------------------------------------------------- style
const CO_CSS = `
  #panel .co-tape{display:flex;gap:3px;justify-content:center;margin:.7rem 0 .4rem;overflow-x:auto;padding:.2rem}
  #panel .co-cell{flex:none;width:30px;height:38px;border:1px solid rgba(255,255,255,.16);border-radius:5px;display:flex;align-items:center;justify-content:center;font:600 .9rem "IBM Plex Mono",monospace;color:#c9c4dc;background:rgba(0,0,0,.22);position:relative;transition:background .15s}
  #panel .co-cell.head{border-color:var(--gold);background:rgba(245,196,81,.14);color:var(--gold);box-shadow:0 0 10px rgba(245,196,81,.35)}
  #panel .co-cell.head:after{content:"▲";position:absolute;bottom:-15px;left:50%;transform:translateX(-50%);color:var(--gold);font-size:.6rem}
  #panel .co-state{font:600 .72rem "IBM Plex Mono",monospace;color:var(--ink);text-align:center;margin:.7rem 0 .3rem}
  #panel .co-state b{color:var(--gold)}
  #panel .co-rules{width:100%;border-collapse:collapse;font:400 .64rem "IBM Plex Mono",monospace;margin:.5rem 0}
  #panel .co-rules th{color:#817a9d;font-weight:500;text-align:center;padding:.25rem;border-bottom:1px solid rgba(255,255,255,.12)}
  #panel .co-rules td{text-align:center;padding:.22rem;border-bottom:1px solid rgba(255,255,255,.05);color:#c9c4dc}
  #panel .co-rules tr.active td{background:rgba(245,196,81,.1);color:var(--gold)}
  #panel .co-prog{display:flex;flex-wrap:wrap;gap:.3rem;margin:.4rem 0}
  #panel .co-prog button{border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(0,0,0,.2);color:#c9c4dc;font:500 .62rem "IBM Plex Mono",monospace;padding:.35rem .5rem;cursor:pointer}
  #panel .co-prog button:hover{color:var(--gold);border-color:rgba(245,196,81,.5)}
  #panel .co-prog button.on{color:var(--gold);border-color:rgba(245,196,81,.6);background:rgba(245,196,81,.07)}
  #panel .co-halt{display:flex;flex-direction:column;gap:.5rem;margin:.5rem 0}
  #panel .co-box{border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:.6rem;background:rgba(255,255,255,.02);position:relative}
  #panel .co-box h4{margin:0 0 .3rem;font:600 .68rem "IBM Plex Mono",monospace;color:var(--ink)}
  #panel .co-box code{display:block;font:400 .64rem/1.6 "IBM Plex Mono",monospace;color:#9fe8c0;white-space:pre-wrap}
  #panel .co-arrow{text-align:center;color:var(--gold);font-size:1rem;margin:-.2rem 0}
  #panel .co-verdict{font:600 .8rem "IBM Plex Mono",monospace;text-align:center;padding:.5rem;border-radius:8px;transition:all .2s}
  #panel .co-verdict.halts{color:#9fe8c0;background:rgba(87,224,138,.1)}
  #panel .co-verdict.loops{color:#8fd4ff;background:rgba(90,160,255,.1)}
  #panel .co-verdict.boom{color:#ffad91;background:rgba(255,120,71,.12);border:1px solid rgba(255,120,71,.4)}
  #panel .co-trans{display:grid;grid-template-columns:1fr auto 1fr;gap:.5rem;align-items:center;margin:.5rem 0}
  #panel .co-trans .co-box code{font-size:.6rem}
  #panel .co-eq{text-align:center;font:600 1.1rem "IBM Plex Mono",monospace;color:var(--gold)}
  #panel .co-web{position:relative;width:100%;height:250px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:radial-gradient(circle at 50% 20%,rgba(120,90,200,.14),rgba(0,0,0,.25));overflow:hidden;margin:.5rem 0}
  #panel .co-wnode{position:absolute;transform:translate(-50%,-50%);padding:.3rem .5rem;border-radius:8px;font:500 .6rem "IBM Plex Mono",monospace;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:rgba(20,14,30,.85);color:#c9c4dc;text-align:center;max-width:8rem;transition:box-shadow .2s,color .2s}
  #panel .co-wnode.root{border-color:#ff5d6c;color:#ff9db0}
  #panel .co-wnode.infected{border-color:var(--gold);color:var(--gold);box-shadow:0 0 12px rgba(245,196,81,.35)}
  #panel .co-wedge{position:absolute;height:2px;background:rgba(245,196,81,.35);transform-origin:0 50%;pointer-events:none;opacity:0;transition:opacity .3s}
  #panel .co-wedge.on{opacity:1}
  #panel .co-abar{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;margin:.5rem 0}
  @media(prefers-reduced-motion:reduce){#panel .co-cell,#panel .co-wnode,#panel .co-wedge{transition:none}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("computability-css")) {
    const style = document.createElement("style");
    style.id = "computability-css";
    style.textContent = CO_CSS;
    document.head.appendChild(style);
  }
}
const $ = id => document.getElementById(id);

// =============================================== LAB 1: PROGRAMMABLE TM
// Real Turing machine interpreter. Programs are rule tables; the tape is live.
const PROGRAMS = {
  increment: {
    name: "binary +1", blank: "_", input: "1011", startState: "r",
    note: "Move right to the blank end, then ripple a carry leftward. 1011₂ → 1100₂.",
    rules: [
      // seek right end (tape is _-delimited, so the blank marks the end)
      ["r", "0", "0", "R", "r"], ["r", "1", "1", "R", "r"], ["r", "_", "_", "L", "c"],
      // carry: flip trailing 1s to 0, first 0 (or leading blank) to 1 then halt
      ["c", "1", "0", "L", "c"], ["c", "0", "1", "L", "h"], ["c", "_", "1", "L", "h"]
    ]
  },
  invert: {
    name: "flip bits", blank: "_", input: "10110", startState: "f",
    note: "Walk right, flipping every 0↔1, until the blank. A one-state transducer.",
    rules: [
      ["f", "0", "1", "R", "f"], ["f", "1", "0", "R", "f"], ["f", "_", "_", "R", "h"]
    ]
  },
  palindrome: {
    name: "double the 1s (unary ×2)", blank: "_", input: "111", startState: "s",
    note: "A tiny multiplier: appends a copy. Watch state cycle — computation is choreography.",
    rules: [
      ["s","1","X","R","g"], ["s","_","_","R","h"],
      ["g","1","1","R","g"], ["g","_","_","R","p"], ["g","Y","Y","R","g"],
      ["p","1","1","R","p"], ["p","_","Y","L","b"], ["p","Y","Y","R","p"],
      ["b","1","1","L","b"], ["b","Y","Y","L","b"], ["b","X","X","R","s"]
    ]
  },
  loop: {
    name: "runs forever ∞", blank: "_", input: "1", startState: "a",
    note: "Two states bouncing eternally — the simplest non-halting machine. Watch the step counter never stop.",
    rules: [ ["a","1","1","R","b"], ["a","_","_","R","b"], ["b","1","1","L","a"], ["b","_","_","L","a"] ]
  }
};

const TM = { prog: null, tape: {}, head: 0, state: "", steps: 0, halted: false, timer: null, min: 0, max: 0, lastRule: -1 };

function tmLoad(key) {
  const p = PROGRAMS[key];
  TM.prog = p; TM.tape = {}; TM.head = 0; TM.state = p.startState;
  TM.steps = 0; TM.halted = false; TM.min = 0; TM.max = p.input.length - 1; TM.lastRule = -1;
  [...p.input].forEach((ch, i) => TM.tape[i] = ch);
  if (TM.timer) { clearInterval(TM.timer); TM.timer = null; }
}
function tmRead() { return TM.tape[TM.head] === undefined ? TM.prog.blank : TM.tape[TM.head]; }
function tmStep() {
  if (TM.halted) return;
  const sym = tmRead();
  const idx = TM.prog.rules.findIndex(r => r[0] === TM.state && r[1] === sym);
  TM.lastRule = idx;
  if (idx === -1 || TM.state === "h") { TM.halted = true; return; }
  const [, , write, move, next] = TM.prog.rules[idx];
  TM.tape[TM.head] = write;
  TM.head += (move === "R" ? 1 : -1);
  TM.min = Math.min(TM.min, TM.head); TM.max = Math.max(TM.max, TM.head);
  TM.state = next; TM.steps++;
  if (next === "h") TM.halted = true;
}
function renderTM() {
  const host = $("co-tape");
  if (!host) return;
  const lo = Math.min(TM.min, TM.head) - 1, hi = Math.max(TM.max, TM.head) + 1;
  let cells = "";
  for (let i = lo; i <= hi; i++) {
    const v = TM.tape[i] === undefined ? TM.prog.blank : TM.tape[i];
    cells += `<div class="co-cell${i === TM.head ? " head" : ""}">${v === "_" ? "␣" : v}</div>`;
  }
  host.innerHTML = cells;
  $("co-state").innerHTML = TM.halted
    ? `state <b>${TM.state === "h" ? "HALT ✓" : "STUCK (no rule) — halted"}</b> · ${TM.steps} steps`
    : `state <b>${TM.state}</b> · reading <b>${tmRead() === "_" ? "␣" : tmRead()}</b> · ${TM.steps} steps`;
  // rules table with active row
  const rows = TM.prog.rules.map((r, i) =>
    `<tr class="${i === TM.lastRule && !TM.halted ? "active" : ""}"><td>${r[0]}</td><td>${r[1]==="_"?"␣":r[1]}</td><td>${r[2]==="_"?"␣":r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("");
  $("co-rules").innerHTML =
    `<tr><th>state</th><th>read</th><th>write</th><th>move</th><th>→state</th></tr>` + rows;
  const st = $("co-tm-status");
  if (TM.halted) {
    const out = [];
    for (let i = TM.min; i <= TM.max; i++) { const v = TM.tape[i]; if (v && v !== "_" && v !== "X" && v !== "Y") out.push(v); }
    st.className = "it-feasible yes";
    st.textContent = TM.state === "h"
      ? "✓ Halted after " + TM.steps + " steps. This machine just computed a function with nothing but a tape and " + TM.prog.rules.length + " rules. That's all computation is."
      : "Halted (no matching rule) after " + TM.steps + " steps.";
  } else if (TM.steps > 800) {
    st.className = "it-feasible no";
    st.textContent = "800+ steps and still going… is it in an infinite loop, or just slow? YOU CAN'T ALWAYS TELL — that's the halting problem, in the next lab.";
  } else {
    st.className = "it-feasible no";
    st.textContent = TM.prog.note;
  }
}

// =============================================== LAB 2: HALTING PARADOX
const HP = { phase: 0 };
const HP_STEPS = [
  { v: "", cls: "", txt: "Assume a perfect halt-detector H exists. Press ▶ to build the machine that destroys it." },
  { v: "H exists (assumed)", cls: "halts", txt: "H(⟨M⟩, x): returns HALTS or LOOPS for ANY program M and input x. Always correct. Always terminates. This is our assumption." },
  { v: "build D", cls: "halts", txt: "Build a troublemaker D(⟨M⟩): it asks H whether M halts on its own code — then does the OPPOSITE. If H says halts, D loops. If H says loops, D halts." },
  { v: "run D(⟨D⟩)", cls: "loops", txt: "Now feed D its OWN description. D asks H: 'does D halt on D?' Whatever H answers, D is built to contradict it…" },
  { v: "CONTRADICTION", cls: "boom", txt: "If H says D halts → D loops forever → H was WRONG. If H says D loops → D halts → H was WRONG. H is wrong either way. So a perfect H cannot exist. Halting is UNDECIDABLE. 💥" }
];
function renderHalt() {
  const s = HP_STEPS[HP.phase];
  $("co-halt-verdict").className = "co-verdict " + s.cls;
  $("co-halt-verdict").textContent = s.v || "—";
  $("co-halt-desc").textContent = s.txt;
  $("co-halt-next").textContent = HP.phase >= HP_STEPS.length - 1 ? "reset ↺" : "▶ next";
  // D pseudocode reveals progressively
  $("co-dcode").innerHTML = HP.phase >= 2
    ? `D(⟨M⟩):
  if H(⟨M⟩, ⟨M⟩) == HALTS:
      loop forever   ${HP.phase>=3?'← chosen if H says halts':''}
  else:
      halt           ${HP.phase>=3?'← chosen if H says loops':''}`
    : `H(⟨M⟩, x):
  return HALTS or LOOPS   (always correct)`;
}

// =============================================== LAB 3: CHURCH vs TURING
// Same function (successor on unary) computed two ways, verified equal.
function turingSucc(n) {           // TM: append one '1' to a unary string
  let tape = "1".repeat(n), steps = 0, i = 0;
  while (i < tape.length) { i++; steps++; }   // walk to end
  tape += "1"; steps++;                         // write
  return { out: tape.length, steps, trace: "walk right " + n + " cells, write 1 → " + tape };
}
function lambdaSucc(n) {            // λ: Church numeral successor, evaluated
  // Church numeral n = λf.λx. f^n x ; succ = λn.λf.λx. f (n f x)
  // We evaluate concretely with f = (+1), x = 0 to read off the number.
  const church = k => (f) => (x) => { let r = x; for (let i = 0; i < k; i++) r = f(r); return r; };
  const succ = m => (f) => (x) => f(m(f)(x));
  const val = succ(church(n))(y => y + 1)(0);
  return { out: val, redexes: n + 1, trace: "succ (λf.λx.f^" + n + " x) → λf.λx.f^" + (n+1) + " x = " + val };
}

// =============================================== LAB 4: UNDECIDABILITY WEB
const WEB_NODES = [
  { id: "halt", lbl: "Halting Problem", x: 50, y: 16, root: true },
  { id: "empty", lbl: "Does M ever accept anything?", x: 20, y: 45 },
  { id: "equiv", lbl: "Are M₁ and M₂ equivalent?", x: 80, y: 45 },
  { id: "totality", lbl: "Does M halt on ALL inputs?", x: 30, y: 78 },
  { id: "output7", lbl: "Does M ever output 7?", x: 62, y: 74 },
  { id: "virus", lbl: "Is this program a virus?", x: 84, y: 80 }
];
const WEB_EDGES = [["halt","empty"],["halt","equiv"],["halt","totality"],["empty","output7"],["equiv","virus"],["halt","output7"]];
const WEB = { infected: new Set(["halt"]), shownEdges: new Set() };
function renderWeb() {
  const host = $("co-web");
  if (!host) return;
  const W = host.clientWidth || 300, H = 250;
  let html = "";
  WEB_EDGES.forEach(([a, b], i) => {
    const na = WEB_NODES.find(n => n.id === a), nb = WEB_NODES.find(n => n.id === b);
    const x1 = na.x/100*W, y1 = na.y/100*H, x2 = nb.x/100*W, y2 = nb.y/100*H;
    const len = Math.hypot(x2-x1, y2-y1), ang = Math.atan2(y2-y1, x2-x1)*180/Math.PI;
    html += `<div class="co-wedge${WEB.shownEdges.has(i)?" on":""}" data-e="${i}" style="left:${x1}px;top:${y1}px;width:${len}px;transform:rotate(${ang}deg)"></div>`;
  });
  WEB_NODES.forEach(n => {
    const inf = WEB.infected.has(n.id);
    html += `<div class="co-wnode${n.root?" root":""}${inf&&!n.root?" infected":""}" data-n="${n.id}" style="left:${n.x}%;top:${n.y}%">${n.lbl}</div>`;
  });
  host.innerHTML = html;
  host.querySelectorAll("[data-n]").forEach(el => el.addEventListener("click", () => infect(el.dataset.n)));
  const pct = WEB.infected.size, tot = WEB_NODES.length;
  const st = $("co-web-status");
  if (pct === tot) { st.className = "it-feasible no"; st.textContent = "Every problem here is now proven undecidable — each by a reduction from halting. Rice's theorem says this was inevitable: EVERY non-trivial property of what a program does is undecidable."; }
  else { st.className = "it-feasible no"; st.textContent = "Tap a node reachable from an already-undecidable one (gold/red). A reduction from halting proves it undecidable too — hardness spreads along the arrows. " + pct + "/" + tot + " infected."; }
}
function infect(id) {
  if (WEB.infected.has(id)) return;
  // can only infect if connected to an already-infected node
  const edgeIdx = WEB_EDGES.findIndex(([a, b], i) =>
    (b === id && WEB.infected.has(a)) || (a === id && WEB.infected.has(b)));
  if (edgeIdx === -1) {
    const st = $("co-web-status"); st.className = "it-feasible no";
    st.textContent = "No reduction path yet — that problem isn't connected to a known-undecidable one. Infect a neighbor of the red/gold nodes first.";
    return;
  }
  WEB.infected.add(id); WEB.shownEdges.add(edgeIdx); renderWeb();
}

// -------------------------------------------------------------- chapter UI
function chapterMarkup(chapter, index) {
  return `<details class="it-chapter" ${index === 0 ? "open" : ""}>
    <summary>
      <span class="it-chapter-title">${chapter.icon} ${chapter.title}</span>
      <span class="it-chapter-meta">${chapter.who}</span>
      <span class="it-chapter-lead">${chapter.lead}</span>
    </summary>
    <div class="it-chapter-body">
      <code class="it-formula">${chapter.formula}</code>
      <div class="it-tabs" role="tablist" aria-label="${chapter.title} perspectives">
        <button class="it-tab on" data-view="what">WHAT</button>
        <button class="it-tab" data-view="how">HOW</button>
        <button class="it-tab" data-view="story">STORY</button>
        <button class="it-tab" data-view="today">TODAY</button>
      </div>
      <p class="it-copy">${chapter.what}</p>
    </div>
  </details>`;
}
function sourceMarkup(source) {
  return `<a class="it-source" href="${source.url}" target="_blank" rel="noopener">
    <small>${source.type}</small><strong>${source.title}</strong>
    <span>${source.note}</span><i aria-hidden="true">↗</i></a>`;
}
function bindChapterTabs(module) {
  module.querySelectorAll("details.it-chapter").forEach((details, index) => {
    details.querySelectorAll(".it-tab").forEach(button => button.addEventListener("click", () => {
      details.querySelectorAll(".it-tab").forEach(b => b.classList.toggle("on", b === button));
      details.querySelector(".it-copy").textContent = CHAPTERS[index][button.dataset.view];
    }));
  });
}

// ------------------------------------------------------------------- build
function buildExperience() {
  ensureStyles();
  const body = $("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(t => t.remove());
  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · THE PEN-AND-PAPER MACHINE · ABOUT 40 MIN</div>
    <p class="it-hook">In 1936, before any computer existed, a 23-year-old defined exactly what a computer could ever be — and proved, in the same paper, what it could never do.</p>
    <p class="it-intro">This is the field where computation was DEFINED. A human clerk with a paper tape becomes a mathematical object; that object turns out to capture everything any machine can compute; a single universal version of it becomes the blueprint for your laptop; and one half-page argument reveals the first thing no computer can ever do. It is the purest pen-and-paper subject on the map, and its ideas are load-bearing walls for everything else. Four labs: program a real Turing machine, watch the halting paradox devour itself, see Church and Turing compute the same answer two ways, and spread undecidability across a web by hand.</p>
    <div class="it-timeline" aria-label="Computability theory timeline">
      <div class="it-moment"><b>1928</b><span>Hilbert asks</span></div>
      <div class="it-moment"><b>1936</b><span>Turing machine</span></div>
      <div class="it-moment"><b>1936</b><span>Universal + Halting</span></div>
      <div class="it-moment"><b>1944</b><span>Post degrees</span></div>
      <div class="it-moment"><b>1951</b><span>Rice</span></div>
    </div>

    <section class="it-lab" aria-labelledby="co-tm-title">
      <div class="it-kicker">PLAYABLE ATOM 1 · THE DEFINITION OF ALGORITHM</div>
      <h3 id="co-tm-title">Program a Turing machine</h3>
      <p class="it-lab-intro">A tape, a head, a rule table — the entire definition of computation. Pick a program, then STEP through it and watch the active rule light up, or RUN it. The last program never halts on purpose: your first live encounter with the halting problem.</p>
      <div class="co-prog" id="co-prog">
        <button data-prog="increment" class="on">binary +1</button>
        <button data-prog="invert">flip bits</button>
        <button data-prog="palindrome">unary ×2</button>
        <button data-prog="loop">runs forever ∞</button>
      </div>
      <div class="co-tape" id="co-tape"></div>
      <p class="co-state" id="co-state"></p>
      <div class="it-lab-actions">
        <button class="it-send" id="co-step">step</button>
        <button class="it-send" id="co-run">run</button>
        <button class="it-send" id="co-reset" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">reset</button>
      </div>
      <div id="co-tm-status" class="it-feasible no"></div>
      <table class="co-rules" id="co-rules"></table>
      <p class="it-caveat">Every rule says: "in this state, reading this symbol → write, move, change state." That's the whole language. Anything your computer does — this browser, a language model — is billions of these steps. The Turing machine isn't a model OF computation; per the Church–Turing thesis, it IS computation.</p>
    </section>

    <section class="it-lab" aria-labelledby="co-halt-title">
      <div class="it-kicker">PLAYABLE ATOM 2 · THE FIRST IMPOSSIBILITY · 1936</div>
      <h3 id="co-halt-title">The halting paradox — watch a machine eat itself</h3>
      <p class="it-lab-intro">The most beautiful impossibility proof ever written, in five steps. Assume a perfect halt-detector H. Build a machine D that asks H about ITSELF and then does the opposite. Step through and watch the contradiction close like a trap.</p>
      <div class="co-halt">
        <div class="co-box"><h4>the program in question</h4><code id="co-dcode"></code></div>
        <div class="co-verdict" id="co-halt-verdict">—</div>
        <p class="it-result" id="co-halt-desc" style="min-height:3.4rem"></p>
      </div>
      <div class="it-lab-actions">
        <button class="it-send" id="co-halt-next">▶ next</button>
      </div>
      <p class="it-caveat">This is Cantor's diagonal and Gödel's self-reference, aimed at programs. D is engineered to differ from H's verdict about D — exactly as the diagonal sequence differs from every row. Three towering theorems (uncountability 1891, incompleteness 1931, undecidability 1936): one argument, three targets.</p>
    </section>

    <section class="it-lab" aria-labelledby="co-ct-title">
      <div class="it-kicker">PLAYABLE ATOM 3 · CHURCH–TURING THESIS</div>
      <h3 id="co-ct-title">Two roads, one answer — λ-calculus vs Turing machine</h3>
      <p class="it-lab-intro">The evidence for the thesis, felt directly. Enter a number; watch a Turing machine compute its successor by crawling a tape, and Church's λ-calculus compute the SAME successor by pure function substitution. Utterly different machinery, identical answer — every time.</p>
      <div class="it-control">
        <label for="co-ct-n"><span>compute successor of n</span><output id="co-ct-nv">3</output></label>
        <input id="co-ct-n" type="range" min="0" max="9" step="1" value="3">
      </div>
      <div class="co-trans">
        <div class="co-box"><h4>🖥 Turing machine</h4><code id="co-tm-side"></code></div>
        <div class="co-eq">=</div>
        <div class="co-box"><h4>λ Church numeral</h4><code id="co-lam-side"></code></div>
      </div>
      <div id="co-ct-status" class="it-feasible yes"></div>
      <p class="it-caveat">λ-calculus became Lisp, ML, Haskell and the type systems inside proof assistants; Turing machines became the hardware model. Church and Turing proved them equivalent in 1936 — then Turing did his PhD under Church. Recursive functions, Post systems, cellular automata: all the same class. That relentless convergence IS the thesis.</p>
    </section>

    <section class="it-lab" aria-labelledby="co-web-title">
      <div class="it-kicker">PLAYABLE ATOM 4 · RICE'S THEOREM, BY HAND</div>
      <h3 id="co-web-title">The undecidability web — spread the impossible</h3>
      <p class="it-lab-intro">Halting (red) is undecidable. Every other question here can be proven undecidable by REDUCING halting to it — "if I could solve this, I could solve halting." Tap any node linked to an already-undecidable one and watch hardness travel the arrows, exactly as Karp's reductions spread NP-hardness next door in Complexity.</p>
      <div class="co-web" id="co-web"></div>
      <div id="co-web-status" class="it-feasible no"></div>
      <div class="it-lab-actions">
        <button class="it-send" id="co-web-auto">spread automatically</button>
        <button class="it-send" id="co-web-reset" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">reset</button>
      </div>
      <p class="it-caveat">Rice's theorem (1951) is the sledgehammer: ANY non-trivial property of the function a program computes is undecidable. Virus detection, equivalence checking, dead-code elimination — all provably imperfect, forever. The art of computer science is building good approximations to impossible questions.</p>
    </section>

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>Run "binary +1" one step at a time and watch which rule lights up. Predict the next active rule before you press step. When you can, you've understood a transition function.</li>
      <li>Run "runs forever ∞" and watch the step counter pass 800. There is no rule that ever reaches HALT — but could you have KNOWN that just by watching? That's the halting problem's whole point.</li>
      <li>Step the halting paradox to the end. State, in one sentence, why H is wrong in BOTH branches. Then find the same shape in "this sentence is false."</li>
      <li>In the Church–Turing lab, set n=0 and n=9. The two machines share no mechanism — one crawls a tape, one substitutes functions — yet never disagree. Why is that convergence "evidence" but not "proof"?</li>
      <li>In the web, try to infect "Is this a virus?" FIRST, before its neighbors. It refuses. Why must a reduction start from something already known undecidable?</li>
      <li>Read Turing's 1936 paper (sources) and find the universal machine. You are looking at the invention of software.</li>
    </ol></div>
    <h3 class="it-section-title">Landmark papers, legendary books & free resources</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1
  tmLoad("increment"); renderTM();
  module.querySelectorAll("#co-prog [data-prog]").forEach(b => b.addEventListener("click", () => {
    module.querySelectorAll("#co-prog [data-prog]").forEach(x => x.classList.toggle("on", x === b));
    tmLoad(b.dataset.prog); renderTM();
  }));
  $("co-step").addEventListener("click", () => { tmStep(); renderTM(); });
  $("co-run").addEventListener("click", () => {
    if (TM.timer) { clearInterval(TM.timer); TM.timer = null; $("co-run").textContent = "run"; return; }
    $("co-run").textContent = "⏸ pause";
    TM.timer = setInterval(() => {
      tmStep(); renderTM();
      if (TM.halted || TM.steps > 1200) { clearInterval(TM.timer); TM.timer = null; $("co-run").textContent = "run"; }
    }, 90);
  });
  $("co-reset").addEventListener("click", () => { tmLoad(TM.prog === PROGRAMS.increment ? "increment" : Object.keys(PROGRAMS).find(k => PROGRAMS[k] === TM.prog)); renderTM(); $("co-run").textContent = "run"; });

  // Lab 2
  HP.phase = 0; renderHalt();
  $("co-halt-next").addEventListener("click", () => {
    HP.phase = HP.phase >= HP_STEPS.length - 1 ? 0 : HP.phase + 1; renderHalt();
  });

  // Lab 3
  const ctN = $("co-ct-n");
  function renderCT(n) {
    const t = turingSucc(n), l = lambdaSucc(n);
    $("co-tm-side").textContent = "input: " + "1".repeat(n) + " (unary " + n + ")\n" + t.trace + "\n→ " + t.out + "  [" + t.steps + " tape steps]";
    $("co-lam-side").textContent = l.trace + "\n→ " + l.out + "  [" + l.redexes + " β-reductions]";
    const st = $("co-ct-status");
    st.className = "it-feasible " + (t.out === l.out ? "yes" : "no");
    st.textContent = t.out === l.out
      ? "✓ Both computed succ(" + n + ") = " + t.out + " — one by moving a head, one by substituting functions. They will NEVER disagree. That's the Church–Turing thesis you can feel."
      : "mismatch (impossible)";
  }
  renderCT(3);
  ctN.addEventListener("input", e => { $("co-ct-nv").textContent = e.target.value; renderCT(+e.target.value); });

  // Lab 4
  WEB.infected = new Set(["halt"]); WEB.shownEdges = new Set(); renderWeb();
  $("co-web-reset").addEventListener("click", () => { WEB.infected = new Set(["halt"]); WEB.shownEdges = new Set(); renderWeb(); });
  $("co-web-auto").addEventListener("click", () => {
    let guard = 0;
    const tick = () => {
      guard++;
      // infect any node reachable from an infected one
      let did = false;
      WEB_EDGES.forEach(([a, b], i) => {
        if (WEB.infected.has(a) && !WEB.infected.has(b)) { WEB.infected.add(b); WEB.shownEdges.add(i); did = true; }
        else if (WEB.infected.has(b) && !WEB.infected.has(a)) { WEB.infected.add(a); WEB.shownEdges.add(i); did = true; }
      });
      renderWeb();
      if (did && guard < 20) setTimeout(tick, 420);
    };
    tick();
  });
}

window.openComputabilityExperience = buildExperience;
// test hook
window.__coTest = { PROGRAMS, turingSucc, lambdaSucc,
  runProgram: (key, cap = 5000) => { tmLoad(key); let g = 0; while (!TM.halted && g < cap) { tmStep(); g++; }
    const out = []; for (let i = TM.min; i <= TM.max; i++) { const v = TM.tape[i]; if (v !== undefined) out.push(v); }
    return { halted: TM.halted, steps: TM.steps, tape: out.join(""), state: TM.state }; },
  webReduce: (from, to) => WEB_EDGES.some(([a,b]) => (a===from&&b===to)||(a===to&&b===from)) };
})();
