// QUANTUM COMPUTATION — the youngest nebula on the map; its story is unfinished.
// Loaded only when the Quantum Computation field opens. Same visual language
// as math-logic.js and the cryptography guides. All three labs are EXACT
// simulations (real-amplitude quantum mechanics), not cartoons.
(function () {
"use strict";

// ---------------------------------------------------------------- chapters
const CHAPTERS = [
  {
    icon: "🏛", title: "Feynman — nature refuses to be classical", who: "Manin 1980 · Benioff 1980 · Feynman 1981–82",
    lead: "Simulating a quantum system on a classical computer costs exponentially. So build a quantum one.",
    formula: "n particles ⇒ 2ⁿ amplitudes · 300 qubits ⇒ more amplitudes than atoms in the universe",
    what: `The founding observation is embarrassingly simple. A quantum system of
      n particles is described by roughly 2ⁿ complex numbers — double the system,
      square the bookkeeping. A classical computer simulating 300 electrons must
      track more amplitudes than there are atoms in the observable universe.
      Feynman's proposal: stop fighting it. Let a controllable quantum system do
      the bookkeeping natively — a computer whose transistor-equivalents ARE
      quantum. Physics itself becomes the processor.`,
    how: `Paul Benioff had shown in 1980 that a quantum-mechanical system could
      implement a Turing machine — quantum mechanics can compute. Yuri Manin the
      same year, in Russian, sketched the exponential-state argument. Feynman's
      1981 keynote fused it into a challenge: no classical computer can
      EFFICIENTLY simulate quantum physics, so a quantum computer is not a
      luxury but the only honest simulator of nature. Quantum simulation — his
      original use case — is still expected to be the first deeply useful one:
      molecules, materials, superconductors.`,
    story: `The field has a birthday: May 1981, a physics-of-computation
      conference at MIT's Endicott House, co-hosted by MIT and IBM. Feynman —
      Nobel laureate, bongo player, safecracker of Los Alamos — delivered the
      keynote with his trademark impatience: "Nature isn't classical, dammit."
      The talk became the 1982 paper Simulating Physics with Computers, and its
      closing line became the field's motto: if you want to simulate nature,
      you'd better make it quantum mechanical — and by golly it's a wonderful
      problem, because it doesn't look so easy. He died in 1988, six years
      before Shor showed just how wonderful.`,
    today: `Feynman's original program — quantum simulation of chemistry and
      materials — is the application experts still bet on first: catalysts,
      batteries, nitrogen fixation, high-temperature superconductivity. The
      exponential bookkeeping argument you just read is also why classically
      simulating a quantum computer breaks down around ~50 honest qubits — the
      threshold the 2019 "supremacy" experiments were designed to cross.`
  },
  {
    icon: "🏛", title: "Deutsch — the universal quantum computer", who: "David Deutsch · Oxford · 1985",
    lead: "Turing's 1936 machine gets a quantum upgrade — and the first algorithm that beats every classical one.",
    formula: "|ψ⟩ = α|0⟩ + β|1⟩,  |α|²+|β|² = 1 · amplitudes are signed — that is the whole secret",
    what: `Deutsch did for quantum computing what Turing did for classical: he
      defined the machine. His 1985 paper constructs a universal quantum
      computer and states the Church–Turing–Deutsch principle: every physical
      process can be simulated by a universal computing device — provided the
      device is quantum. A qubit holds not 0 or 1 but a weighted blend of both;
      the weights (amplitudes) can be NEGATIVE, so computational paths can
      cancel. Play with exactly this in the interference machine above.`,
    how: `Deutsch's toy problem is the "hello world" of the field. Given a
      black-box function on one bit, decide whether it's constant or balanced.
      Classically you must query twice. Deutsch's algorithm queries ONCE: put
      the input in superposition, let both function evaluations happen in the
      same physical pass, then interfere the paths so the answer you don't want
      cancels out. One question, both answers consulted, wrong one deleted.
      Every quantum speedup since — Shor, Grover, all of them — is this trick
      scaled up: choreograph interference so wrong answers annihilate.`,
    story: `Deutsch is one of science's great eccentrics: he rarely leaves his
      Oxford home, where he has worked for decades surrounded by teetering
      paper; students attend his legendary lectures remotely. He came to
      quantum computing from quantum foundations — he wanted the many-worlds
      interpretation taken literally, and asked what computational work those
      worlds could do. The 1985 paper was barely noticed for years. Between
      1985 and 1994 quantum computing was a hobby shared by perhaps a few dozen
      people on Earth. Then came Shor.`,
    today: `The Deutsch–Jozsa, Bernstein–Vazirani and Simon algorithms — the
      1990s children of Deutsch's toy — are now the first week of every quantum
      computing course, and Simon's problem was the direct inspiration for
      Shor's period-finding. Deutsch received the Breakthrough Prize (2023)
      and continues to argue, in The Fabric of Reality and constructor theory,
      that computation is not a branch of physics — it is its foundation.`
  },
  {
    icon: "🏛", title: "Entanglement — spooky action goes to court", who: "EPR 1935 · Bell 1964 · Aspect 1982 · Nobel 2022",
    lead: "Einstein called it spooky and meant it as an insult. Bell turned the insult into an experiment. The experiment sided with the spooks.",
    formula: "|Φ⁺⟩ = (|00⟩+|11⟩)/√2 · CHSH: classical ≤ 75% · quantum → cos²(π/8) ≈ 85.4%",
    what: `Entangle two qubits and they form one object with a single shared
      state: measure one and the other's outcome is instantly fixed, however far
      away. Einstein, Podolsky and Rosen (1935) argued this "spooky action at a
      distance" proved quantum mechanics incomplete — surely the particles carry
      hidden instructions from birth. The CHSH bench above stages the courtroom:
      any hidden-instruction theory caps the game's win rate at 75%; entangled
      qubits reach 85.4%. Nature, tested, breaks the classical ceiling.`,
    how: `John Bell's 1964 theorem is the hinge: he derived an inequality every
      local hidden-variable theory must obey and quantum mechanics must violate.
      That moved a metaphysical quarrel into the laboratory. One honesty clause
      matters enormously: entanglement wins correlation games but transmits NO
      information — the no-communication theorem. Nothing outruns light. What
      entanglement provides is correlation stronger than any classical resource,
      and that is precisely the fuel multi-qubit algorithms burn.`,
    story: `Bell was a CERN particle physicist who did foundations as a
      self-described hobby; he published the greatest theorem about reality in
      an obscure journal that died after four issues. Alain Aspect's 1982 Paris
      experiments made the violation stark; 2015 brought three loophole-free
      tests within months (Delft, NIST, Vienna); and in 2022 Aspect, Clauser and
      Zeilinger received the Nobel Prize — 58 years after Bell's paper, 87 after
      Einstein's complaint. Bell himself died in 1990, Nobel-less, having been
      nominated the year of his death. The moral the field draws: the "spooky"
      correlations are not a bug in nature. They are a computational resource.`,
    today: `Entanglement is the working capital of every quantum computer —
      algorithms that never entangle can be simulated classically. It also
      underwrites quantum key distribution (detect eavesdroppers by the damage
      measurement does), quantum teleportation of states, and the planned
      quantum internet. Loophole-free CHSH is now a calibration routine.`
  },
  {
    icon: "🔥", title: "Shor & Grover — the detonation", who: "Peter Shor 1994 · Lov Grover 1996 · Bell Labs",
    lead: "One algorithm threatens all public-key cryptography; another speeds up every brute-force search. The hobby becomes an arms race.",
    formula: "Shor: factoring in poly(log N) — RSA falls · Grover: unstructured search in O(√N)",
    what: `Shor's 1994 algorithm factors integers and takes discrete logarithms
      in polynomial time on a quantum computer — dissolving the hardness
      assumptions beneath RSA and Diffie–Hellman (see Modern Cryptography, one
      nebula east: this is why post-quantum standards exist). Grover's 1996
      algorithm finds a needle among N haystacks in ~√N queries instead of ~N/2
      — provably optimal, and playable above. Together they answered the
      skeptics' question "but what would it be FOR?" with: everything you
      encrypt, and everything you search.`,
    how: `Shor's engine is period-finding: factoring reduces to finding the
      period of a modular sequence, and the quantum Fourier transform reads a
      period out of a superposition the way an ear picks a pitch from a chord —
      globally, in one pass. Grover's engine is the amplitude dance you can
      watch above: flip the marked item's sign (a phase kick the oracle
      delivers), reflect all amplitudes about their mean, and the needle grows
      while the haystack shrinks — for exactly ~(π/4)√N steps, after which it
      shrinks again. Interference, choreographed.`,
    story: `Both bombs were built at Bell Labs — the same institution where
      Shannon founded information theory and the transistor was born. Shor,
      inspired by Simon's problem, announced factoring in 1994; the result tore
      through the community in days and reached the NSA within weeks. Funding
      that had been a trickle became a flood: the field's entire modern
      existence — the labs, the companies, the national programs — dates from
      that single paper. Shor collected the Nevanlinna Prize, and decades later
      the Breakthrough Prize; Grover's √N, modest beside Shor's exponential,
      quietly became the more broadly applicable of the two.`,
    today: `No machine yet built can run Shor's algorithm on cryptographically
      relevant numbers — record quantum factorizations remain toy-sized — but
      "harvest now, decrypt later" makes the threat present-tense: adversaries
      store today's ciphertext for tomorrow's machine. That is why NIST
      finalized post-quantum standards in 2024 and the migration has already
      begun. Grover, meanwhile, halves the effective key length of symmetric
      ciphers — AES-128 becomes 64-bit-hard — which is why AES-256 is the
      quantum-era default.`
  },
  {
    icon: "🏛", title: "No-cloning & error correction — the impossible rescue", who: "Wootters–Zurek 1982 · Shor 1995 · threshold theorems 1996–97",
    lead: "You cannot copy a qubit, and looking at one disturbs it. So how can you possibly protect it? The answer saved the field.",
    formula: "no-cloning: ∄U with U|ψ⟩|0⟩ = |ψ⟩|ψ⟩ · threshold: error rate < p_th ⇒ compute forever",
    what: `Two quantum facts seem to doom the whole enterprise. The no-cloning
      theorem: an unknown quantum state cannot be copied — so no backups. And
      measurement disturbs — so no peeking to check for errors. Meanwhile
      decoherence (the environment "measuring" your qubits uninvited) corrupts
      everything within microseconds. Mid-1990s skeptics published careful
      arguments that scalable quantum computing was therefore a physical
      impossibility. They were wrong, and the reason is one of the most
      beautiful ideas in the field.`,
    how: `Shor's 1995 nine-qubit code spreads one logical qubit's identity
      across the ENTANGLEMENT of nine physical qubits, so that no single
      particle carries the secret. Cleverly chosen collective measurements then
      reveal WHICH error occurred while revealing NOTHING about the encoded
      state — the disturbance lands on the error, not the data. The threshold
      theorems (1996–97) completed the rescue: if physical error rates sit
      below a fixed threshold, layered codes suppress logical errors
      exponentially. Quantum computing is fragile, but not fatally — it is
      merely an engineering problem. A monstrous one.`,
    story: `The no-cloning theorem itself has a comic origin: it was proved in
      1982 partly to debunk a physicist's design for a faster-than-light
      telegraph (clone entangled qubits and you could signal instantly; since
      you can't, relativity survives). Thirteen years later the "fatal"
      no-cloning constraint became the design constraint of Shor's code —
      the obstacle turned load-bearing. When Shor presented quantum error
      correction, disbelief was the standard first reaction: protecting what
      you may neither copy nor inspect sounded like alchemy. It is now the
      central engineering discipline of the entire industry.`,
    today: `Every serious roadmap is an error-correction roadmap. The surface
      code (Kitaev's lattice construction) dominates superconducting plans;
      logical qubits crossed the long-awaited break-even line when Google's
      Willow chip (December 2024) demonstrated below-threshold scaling —
      bigger code, FEWER logical errors. The brutal exchange rate stands:
      one good logical qubit still costs hundreds to thousands of physical
      ones, which is why "how many qubits?" is the wrong question and "how
      many LOGICAL qubits?" is the right one.`
  },
  {
    icon: "🔥", title: "NISQ to logical — the era you are living in", who: "Preskill 2018 · supremacy 2019 · Willow 2024 · now",
    lead: "The frontier chapter has no ending yet. You are inside it; this node will be rewritten.",
    formula: "NISQ: 50–1000 noisy qubits, no correction · goal: thousands of LOGICAL qubits · status: early climb",
    what: `John Preskill named our decade in 2018: NISQ — Noisy
      Intermediate-Scale Quantum. Machines of 50–1000 physical qubits, powerful
      enough that classical computers cannot always imitate them, too noisy to
      run deep algorithms like Shor's. The 2019 Google "supremacy" experiment
      (53 qubits sampling a task claimed to need 10,000 classical years),
      IBM's immediate rebuttal (days, not millennia, with smarter classical
      methods), and the subsequent seesaw of quantum claims and classical
      counter-algorithms are exactly what a healthy frontier looks like:
      contested, fast, unfinished.`,
    how: `The field's honest scoreboard has three lines. Physical qubits:
      growing steadily across superconducting, trapped-ion, neutral-atom and
      photonic platforms. Logical qubits: the number that matters — dozens
      demonstrated, with below-threshold error correction achieved (Willow,
      2024); useful algorithms want thousands. Cryptographically relevant
      machines: none exist as of this writing, and credible estimates for
      breaking RSA-2048 require millions of physical qubits running for hours.
      Any specific number in this paragraph may be obsolete by the time you
      read it — that is what 🔥 means on this map.`,
    story: `The best story of this chapter is that it is being written in
      public, with receipts: supremacy claims met by classical-algorithm
      counterattacks (a genuine scientific duel, not a scandal), record
      announcements followed by peer review in real time, and a decades-long
      bet quietly resolving — the skeptics who said error correction would
      never work below threshold have, as of 2024, lost. What remains genuinely
      open: when logical-qubit counts reach the thousands, whether any pre-Shor
      application (chemistry, materials, optimization) delivers value first,
      and which hardware platform wins. Place your bets; the map will wait.`,
    today: `For you, the practical consequences are two. First: post-quantum
      migration is already policy — data encrypted today with RSA must be
      considered readable by a future machine (see Modern Cryptography's final
      chapter). Second: quantum simulation of nature — Feynman's original 1981
      goal — is quietly the least hyped and most likely first triumph. The
      field's founding motivation may also be its first payoff. Sixty years
      of story, and the ending loops back to the opening line.`
  }
];

// ---------------------------------------------------------------- sources
const SOURCES = [
  {
    type: "FOUNDATIONAL PAPER · 1982",
    title: "Richard Feynman — Simulating Physics with Computers",
    note: "The keynote that founded the field: nature isn't classical, so the simulator can't be either.",
    url: "https://doi.org/10.1007/BF02650179"
  },
  {
    type: "FOUNDATIONAL PAPER · 1985",
    title: "David Deutsch — Quantum Theory, the Church–Turing Principle and the Universal Quantum Computer",
    note: "The machine defined, the first quantum algorithm, the Church–Turing–Deutsch principle.",
    url: "https://doi.org/10.1098/rspa.1985.0070"
  },
  {
    type: "FOUNDATIONAL PAPER · 1964",
    title: "John S. Bell — On the Einstein Podolsky Rosen Paradox",
    note: "Six pages in a journal that died after four issues; the theorem that put reality on trial.",
    url: "https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195"
  },
  {
    type: "FOUNDATIONAL PAPER · 1997",
    title: "Peter Shor — Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms",
    note: "The paper that turned a hobby into an arms race — and made post-quantum cryptography necessary.",
    url: "https://doi.org/10.1137/S0097539795293172"
  },
  {
    type: "FOUNDATIONAL PAPER · 1996",
    title: "Lov Grover — A Fast Quantum Mechanical Algorithm for Database Search",
    note: "√N search, provably optimal — the amplitude dance you played above.",
    url: "https://doi.org/10.1145/237814.237866"
  },
  {
    type: "FIELD-DEFINING ESSAY · 2018",
    title: "John Preskill — Quantum Computing in the NISQ Era and Beyond",
    note: "The paper that named our decade and set its honest expectations. Free to read (open-access journal Quantum).",
    url: "https://doi.org/10.22331/q-2018-08-06-79"
  },
  {
    type: "LANDMARK EXPERIMENT · 2019",
    title: "Arute et al. (Google) — Quantum Supremacy Using a Programmable Superconducting Processor",
    note: "53 qubits cross the classical-simulation frontier — and ignite a healthy, ongoing duel.",
    url: "https://doi.org/10.1038/s41586-019-1666-5"
  },
  {
    type: "LEGENDARY BOOK",
    title: "Nielsen & Chuang — Quantum Computation and Quantum Information (2000)",
    note: "\u201CMike & Ike\u201D: the bible of the field, on every quantum scientist's shelf for 25 years.",
    url: "https://en.wikipedia.org/wiki/Quantum_Computation_and_Quantum_Information"
  },
  {
    type: "LEARN FREE · MNEMONIC ESSAYS",
    title: "Quantum Country — by Michael Nielsen & Andy Matuschak",
    note: "A free \u201Cbook\u201D built on spaced repetition: it teaches qubits and Grover so you remember them months later.",
    url: "https://quantum.country"
  }
];

// ------------------------------------------------------------------- style
const QC_CSS = `
  #panel .qc-bars{display:flex;gap:3px;align-items:center;height:120px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(0,0,0,.2);padding:8px;margin:.6rem 0;position:relative}
  #panel .qc-bars:before{content:"";position:absolute;left:6px;right:6px;top:50%;border-top:1px dashed rgba(255,255,255,.18)}
  #panel .qc-bcol{flex:1;position:relative;height:100%;min-width:0}
  #panel .qc-amp{position:absolute;left:22%;right:22%;background:var(--gold);border-radius:2px;transition:all .3s ease}
  #panel .qc-amp.neg{background:#ff7a8a}
  #panel .qc-bcol b{position:absolute;bottom:-2px;left:0;right:0;text-align:center;font:400 .56rem "IBM Plex Mono",monospace;color:#817a9d}
  #panel .qc-bcol.marked b{color:var(--gold)}
  #panel .qc-probrow{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin:.4rem 0}
  #panel .qc-gates{display:flex;flex-wrap:wrap;gap:.3rem;margin:.5rem 0}
  #panel .qc-gates button{border:1px solid rgba(255,255,255,.14);border-radius:8px;background:rgba(0,0,0,.2);color:#c9c4dc;font:600 .78rem "IBM Plex Mono",monospace;min-width:2.4rem;padding:.4rem .5rem;cursor:pointer}
  #panel .qc-gates button:hover{color:var(--gold);border-color:rgba(245,196,81,.55)}
  #panel .qc-gates button.aux{color:#817a9d;font-size:.6rem;font-weight:400}
  #panel .qc-hist{font:400 .62rem/1.6 "IBM Plex Mono",monospace;color:#a9a1c2;min-height:1rem;margin:.35rem 0;word-break:break-all}
  #panel .qc-race{display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin:.6rem 0}
  #panel .qc-lane{border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.55rem;background:rgba(255,255,255,.02)}
  #panel .qc-lane h4{margin:0 0 .3rem;font:600 .68rem "IBM Plex Mono",monospace;color:var(--ink)}
  #panel .qc-meter{position:relative;height:14px;border-radius:999px;background:rgba(0,0,0,.3);overflow:hidden;margin:.3rem 0}
  #panel .qc-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--gold);transition:width .4s ease}
  #panel .qc-fill.teal{background:#4dd0c9}
  #panel .qc-ceiling{position:absolute;top:-3px;bottom:-3px;width:2px;background:#ff5d6c}
  #panel .qc-lane small{display:block;color:var(--dim);font:400 .56rem/1.4 "IBM Plex Mono",monospace}
  #panel .qc-lane .pct{font:600 .9rem "IBM Plex Mono",monospace;color:var(--gold)}
  @media(prefers-reduced-motion:reduce){#panel .qc-amp,#panel .qc-fill{transition:none}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("quantum-css")) {
    const style = document.createElement("style");
    style.id = "quantum-css";
    style.textContent = QC_CSS;
    document.head.appendChild(style);
  }
}

const $ = id => document.getElementById(id);
const SQ = Math.SQRT1_2;

// ====================================================== LAB 1: INTERFERENCE
// Exact single-qubit simulation. H, X, Z keep amplitudes real — no cartoons.
const Q1 = { a: [1, 0], ops: [], counts: [0, 0] };

const applyH = s => [SQ * (s[0] + s[1]), SQ * (s[0] - s[1])];
const applyX = s => [s[1], s[0]];
const applyZ = s => [s[0], -s[1]];

function q1Reset() { Q1.a = [1, 0]; Q1.ops = []; }
function q1Gate(g) {
  Q1.a = (g === "H" ? applyH : g === "X" ? applyX : applyZ)(Q1.a);
  Q1.ops.push(g);
}
function q1Measure() {
  const p0 = Q1.a[0] * Q1.a[0];
  const out = Math.random() < p0 ? 0 : 1;
  Q1.a = out === 0 ? [1, 0] : [0, 1];
  Q1.ops.push("M→" + out);
  Q1.counts[out]++;
  return out;
}

function fmt(x) { return (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(3); }

function renderQ1(msg) {
  const host = $("qc-q1bars");
  if (!host) return;
  host.innerHTML = ["|0⟩", "|1⟩"].map((lab, i) => {
    const a = Q1.a[i], h = Math.abs(a) * 46;
    const top = a >= 0 ? (50 - h) : 50;
    return `<div class="qc-bcol"><div class="qc-amp${a < 0 ? " neg" : ""}"
      style="top:${top}%;height:${h}%"></div><b>${lab}</b></div>`;
  }).join("");
  $("qc-q1amps").textContent =
    "α = " + fmt(Q1.a[0]) + "   β = " + fmt(Q1.a[1]) +
    "   ·   P(0) = " + (Q1.a[0] ** 2 * 100).toFixed(1) + "%   P(1) = " + (Q1.a[1] ** 2 * 100).toFixed(1) + "%";
  $("qc-q1hist").textContent = "circuit: " + (Q1.ops.length ? Q1.ops.join(" · ") : "—") +
    "     measured so far: 0×" + Q1.counts[0] + "  1×" + Q1.counts[1];
  const st = $("qc-q1status");
  const n = Q1.ops.length;
  if (msg) { st.className = "it-feasible yes"; st.textContent = msg; return; }
  if (n >= 2 && Q1.ops[n-1] === "H" && Q1.ops[n-2] === "H" && Math.abs(Q1.a[0]) > 0.999) {
    st.className = "it-feasible yes";
    st.textContent = "✓ H then H returned |0⟩ WITH CERTAINTY. Inside, the |1⟩ paths carried +½ and −½ — they annihilated. Negative amplitudes are the entire secret of quantum computing.";
  } else if (Math.abs(Math.abs(Q1.a[0]) - SQ) < 1e-9) {
    st.className = "it-feasible no";
    st.textContent = "Both outcomes now carry amplitude — a fair coin if you measure. But DON'T. Apply H again and watch the paths interfere instead.";
  } else {
    st.className = "it-feasible no";
    st.textContent = "Apply gates. Try H · H with no measurement in between — then try H · measure · H and compare.";
  }
}

// ============================================================ LAB 2: CHSH
// Bell pair measured at angles; P(same outcome) = cos²(Δθ). Exact quantum stats.
const CH = { q: { n: 0, w: 0 }, c: { n: 0, w: 0 } };
const A_ANG = [0, Math.PI / 4], B_ANG = [Math.PI / 8, -Math.PI / 8];

function chshRound(strategy) {
  const x = Math.random() < 0.5 ? 1 : 0, y = Math.random() < 0.5 ? 1 : 0;
  let a, b;
  if (strategy === "q") {
    const d = A_ANG[x] - B_ANG[y];
    a = Math.random() < 0.5 ? 0 : 1;
    b = Math.random() < Math.cos(d) ** 2 ? a : 1 - a;
  } else { a = 0; b = 0; } // best deterministic classical strategy
  return ((a ^ b) === (x & y)) ? 1 : 0;
}
function chshPlay(strategy, rounds) {
  const s = CH[strategy];
  for (let i = 0; i < rounds; i++) s.w += chshRound(strategy), s.n++;
}
function renderChsh() {
  for (const k of ["q", "c"]) {
    const s = CH[k], pct = s.n ? 100 * s.w / s.n : 0;
    $("qc-" + k + "fill").style.width = pct + "%";
    $("qc-" + k + "pct").textContent = s.n ? pct.toFixed(1) + "%  (" + s.w + "/" + s.n + ")" : "— play →";
  }
  const st = $("qc-chshstatus"), q = CH.q, pct = q.n ? 100 * q.w / q.n : 0;
  if (q.n >= 300 && pct > 78) {
    st.className = "it-feasible yes";
    st.textContent = "✓ " + pct.toFixed(1) + "% — above every classical ceiling. No hidden-instruction theory of reality can explain your own data. This is Bell's theorem, and the 2022 Nobel, on your screen.";
  } else {
    st.className = "it-feasible no";
    st.textContent = "Classical physics — ANY classical strategy, however clever — caps at 75%. Entangled qubits reach cos²(π/8) ≈ 85.4%. Collect a few hundred rounds and see.";
  }
}

// ========================================================== LAB 3: GROVER
// Exact Grover on N=16: oracle sign-flip + inversion about the mean.
const GR = { N: 16, amps: [], marked: 0, iters: 0, found: null };

function grNew() {
  GR.amps = new Array(GR.N).fill(1 / Math.sqrt(GR.N));
  GR.marked = Math.floor(Math.random() * GR.N);
  GR.iters = 0; GR.found = null;
}
function grIterate(amps, marked) {
  const a = amps.slice();
  a[marked] = -a[marked];                       // oracle: phase-kick the needle
  const mean = a.reduce((s, x) => s + x, 0) / a.length;
  return a.map(x => 2 * mean - x);              // diffusion: invert about mean
}
function grMeasure() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < GR.N; i++) { acc += GR.amps[i] ** 2; if (r < acc) return i; }
  return GR.N - 1;
}
function renderGrover(msg) {
  const host = $("qc-grbars");
  if (!host) return;
  host.innerHTML = GR.amps.map((a, i) => {
    const h = Math.abs(a) * 92, top = a >= 0 ? (50 - h / 2) - (h / 2) + 0 : 50;
    return `<div class="qc-bcol${GR.found === i ? " marked" : ""}">
      <div class="qc-amp${a < 0 ? " neg" : ""}" style="top:${a >= 0 ? 50 - h : 50}%;height:${h}%"></div>
      <b>${GR.found !== null && i === GR.marked ? "★" : i.toString(16).toUpperCase()}</b></div>`;
  }).join("");
  const p = GR.amps[GR.marked] ** 2;
  $("qc-grmetrics").innerHTML =
    `<div class="it-metric"><small>GROVER QUERIES</small><b>${GR.iters}</b></div>
     <div class="it-metric"><small>P(FIND NEEDLE)</small><b>${(p * 100).toFixed(1)}%</b></div>
     <div class="it-metric"><small>CLASSICAL EXPECTED</small><b>8 of 16</b></div>`;
  const st = $("qc-grstatus");
  if (msg) { st.className = msg.startsWith("✓") ? "it-feasible yes" : "it-feasible no"; st.textContent = msg; return; }
  if (GR.iters === 0) { st.className = "it-feasible no"; st.textContent = "16 boxes, one hidden needle, all amplitudes equal. Iterate: each step sign-flips the needle, then reflects everything about the mean."; }
  else if (GR.iters === 3) { st.className = "it-feasible yes"; st.textContent = "✓ Three queries and the needle carries " + (p * 100).toFixed(1) + "% of the probability — the optimum for N=16 (≈ (π/4)√N). Measure now. Or iterate again and watch success FADE: the rotation overshoots."; }
  else { st.className = "it-feasible no"; st.textContent = "P(needle) = " + (p * 100).toFixed(1) + "% after " + GR.iters + (GR.iters === 1 ? " query." : " queries.") + (GR.iters > 3 ? " Past the optimum — amplitude is rotating AWAY from the needle. Grover is a dial, not a ratchet." : ""); }
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
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · THE UNFINISHED FRONTIER · ABOUT 35 MIN</div>
    <p class="it-hook">A bit is 0 or 1. A qubit is a wave — and waves can cancel. All of quantum computing is the art of making wrong answers annihilate.</p>
    <p class="it-intro">The youngest nebula on this map, and the only one whose story has no ending yet. A physicist's complaint (1981) becomes a machine definition (1985), detonates into an arms race (1994), survives its own impossibility proofs (1995–97), and is now a public engineering duel you are living inside. The three labs below are exact quantum simulations — the same arithmetic real machines obey — sized to fit in your browser.</p>
    <div class="it-timeline" aria-label="Quantum computation timeline">
      <div class="it-moment"><b>1964</b><span>Bell</span></div>
      <div class="it-moment"><b>1981</b><span>Feynman</span></div>
      <div class="it-moment"><b>1985</b><span>Deutsch</span></div>
      <div class="it-moment"><b>1994</b><span>Shor</span></div>
      <div class="it-moment"><b>2019</b><span>Supremacy</span></div>
    </div>

    <section class="it-lab" aria-labelledby="qc-q1-title">
      <div class="it-kicker">PLAYABLE ATOM 1 · THE HEART OF IT ALL</div>
      <h3 id="qc-q1-title">The interference machine</h3>
      <p class="it-lab-intro">One qubit, exact simulation. Gold bars point up for positive amplitude, red down for negative — and probability is the SQUARE of the bar. The experiment that defines the field: H·H returns |0⟩ with certainty, but H·measure·H is a coin flip. Looking destroys the cancellation.</p>
      <div class="qc-bars" id="qc-q1bars" aria-label="Qubit amplitudes"></div>
      <p class="qc-hist" id="qc-q1amps"></p>
      <div class="qc-gates">
        <button id="qc-gh">H</button><button id="qc-gx">X</button><button id="qc-gz">Z</button>
        <button id="qc-gm">measure</button>
        <button class="aux" id="qc-greset">reset to |0⟩</button>
      </div>
      <p class="qc-hist" id="qc-q1hist"></p>
      <div id="qc-q1status" class="it-feasible no"></div>
      <p class="it-caveat">H is the Hadamard gate: it splits one path into two. X flips |0⟩↔|1⟩. Z flips the SIGN of |1⟩'s amplitude — invisible to measurement alone, decisive under interference. Every quantum algorithm ever devised is choreography for these cancellations.</p>
    </section>

    <section class="it-lab" aria-labelledby="qc-chsh-title">
      <div class="it-kicker">PLAYABLE ATOM 2 · BELL'S THEOREM AS A GAME · NOBEL 2022</div>
      <h3 id="qc-chsh-title">The CHSH bench — break the classical ceiling</h3>
      <p class="it-lab-intro">Alice and Bob each receive a random bit (x, y) and must answer with bits (a, b) such that a⊕b = x∧y — WITHOUT communicating. Einstein's worldview says no strategy beats 75%. A shared entangled pair, measured at cunning angles, says otherwise. This exact game, run with photons across laboratories, is what the 2022 Nobel Prize certified.</p>
      <div class="qc-race">
        <div class="qc-lane"><h4>BEST CLASSICAL (a=b=0)</h4>
          <div class="qc-meter"><div class="qc-fill teal" id="qc-cfill"></div><div class="qc-ceiling" style="left:75%"></div></div>
          <span class="pct" id="qc-cpct">— play →</span><small>provable ceiling: 75%</small></div>
        <div class="qc-lane"><h4>ENTANGLED QUBITS</h4>
          <div class="qc-meter"><div class="qc-fill" id="qc-qfill"></div><div class="qc-ceiling" style="left:75%"></div></div>
          <span class="pct" id="qc-qpct">— play →</span><small>quantum limit: cos²(π/8) ≈ 85.4%</small></div>
      </div>
      <div id="qc-chshstatus" class="it-feasible no"></div>
      <div class="it-lab-actions">
        <button class="it-send" id="qc-playq">play 100 rounds · quantum</button>
        <button class="it-send" id="qc-playc">play 100 rounds · classical</button>
        <button class="it-send" id="qc-chshreset" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">reset</button>
      </div>
      <p class="it-caveat">Honesty clause: the correlations carry no message — neither player learns the other's bit (the no-communication theorem). Entanglement is not a telegraph; it is a resource stronger than any classical coordination. That resource is what multi-qubit algorithms burn as fuel.</p>
    </section>

    <section class="it-lab" aria-labelledby="qc-gr-title">
      <div class="it-kicker">PLAYABLE ATOM 3 · GROVER 1996</div>
      <h3 id="qc-gr-title">Grover's needle — search 16 boxes in 3 looks</h3>
      <p class="it-lab-intro">One of 16 boxes hides the needle; classically you'd open 8 on average. Grover's dance: the oracle flips the needle's SIGN (watch one bar dip red), then everything reflects about the mean — and the needle grows. Exact simulation; the bars are the real amplitudes.</p>
      <div class="qc-bars" id="qc-grbars" aria-label="Sixteen amplitudes"></div>
      <div class="it-metrics" id="qc-grmetrics"></div>
      <div id="qc-grstatus" class="it-feasible no"></div>
      <div class="it-lab-actions">
        <button class="it-send" id="qc-groracle">iterate (oracle + diffusion)</button>
        <button class="it-send" id="qc-grmeasure">measure</button>
        <button class="it-send" id="qc-grnew" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">hide a new needle</button>
      </div>
      <p class="it-caveat">The √N speedup is provably the best possible for unstructured search — and it is why AES-128 is "only" 64-bit-hard to a quantum adversary, and AES-256 is the quantum-era default. For structured problems (periods, factors), Shor's exponential shortcut takes over — that story is in the chapters below and in Modern Cryptography, one nebula east.</p>
    </section>

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Five things to try</b><ol>
      <li>Run H·H and get certainty; then H·measure·H and get a coin. State in one sentence what the measurement destroyed. (The word you want is "interference.")</li>
      <li>Use Z between two H's: H·Z·H. It lands on |1⟩ with certainty — a sign no measurement could see steered the outcome completely. Explain to yourself why Z is invisible alone but decisive between H's.</li>
      <li>Before playing quantum CHSH, spend two minutes genuinely trying to design ANY classical rule beating 75%. Failing personally is the point — then let entanglement do it.</li>
      <li>In Grover, iterate to 3 (peak), then keep going to 6 and watch the needle fade. Grover is a rotation, not a ratchet — compute where it peaks for N=64. (Answer: ~6.)</li>
      <li>Read the NISQ essay in the sources, then reread this guide's final chapter in 2027 and note what changed. The 🔥 tag is a promise that something will.</li>
    </ol></div>
    <h3 class="it-section-title">Landmark papers, legendary books & free resources</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1
  q1Reset(); Q1.counts = [0, 0]; renderQ1();
  $("qc-gh").addEventListener("click", () => { q1Gate("H"); renderQ1(); });
  $("qc-gx").addEventListener("click", () => { q1Gate("X"); renderQ1(); });
  $("qc-gz").addEventListener("click", () => { q1Gate("Z"); renderQ1(); });
  $("qc-gm").addEventListener("click", () => {
    const hadSuper = Math.abs(Q1.a[0]) > 1e-9 && Math.abs(Q1.a[1]) > 1e-9;
    const out = q1Measure();
    renderQ1(hadSuper
      ? undefined
      : "Measured " + out + " — the state was already definite; nothing collapsed.");
    if (hadSuper) {
      const st = $("qc-q1status");
      st.className = "it-feasible no";
      st.textContent = "Collapse! The wave became the definite outcome " + out + ". Whatever interference you were building is gone — now try H again and see only a fair coin remains.";
    }
  });
  $("qc-greset").addEventListener("click", () => { q1Reset(); renderQ1(); });

  // Lab 2
  CH.q = { n: 0, w: 0 }; CH.c = { n: 0, w: 0 }; renderChsh();
  $("qc-playq").addEventListener("click", () => { chshPlay("q", 100); renderChsh(); });
  $("qc-playc").addEventListener("click", () => { chshPlay("c", 100); renderChsh(); });
  $("qc-chshreset").addEventListener("click", () => { CH.q = { n: 0, w: 0 }; CH.c = { n: 0, w: 0 }; renderChsh(); });

  // Lab 3
  grNew(); renderGrover();
  $("qc-groracle").addEventListener("click", () => {
    GR.amps = grIterate(GR.amps, GR.marked); GR.iters++; GR.found = null; renderGrover();
  });
  $("qc-grmeasure").addEventListener("click", () => {
    const out = grMeasure(); GR.found = out;
    renderGrover(out === GR.marked
      ? "✓ Measured box " + out.toString(16).toUpperCase() + " — the needle! Found in " + GR.iters + " quantum queries; classical expectation was 8. That gap, at scale, is √N."
      : "Measured box " + out.toString(16).toUpperCase() + " — miss (the needle was " + GR.marked.toString(16).toUpperCase() + "). Probability is honest: at the peak you had ~96%, not 100%. Hide a new needle and time your measurement better.");
  });
  $("qc-grnew").addEventListener("click", () => { grNew(); renderGrover(); });
}

window.openQuantumExperience = buildExperience;
// test hook
window.__qcTest = { applyH, applyX, applyZ, grIterate, chshRound, SQ };
})();
