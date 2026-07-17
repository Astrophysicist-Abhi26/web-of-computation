// ELECTROMECHANICAL & WARTIME — the moment logic got wired into metal, and
// deduction ran at machine speed. Loaded only when the "Electromechanical &
// Wartime" field opens. Same architecture as the other guides: the WHOLE guide
// renders INTO #panel-body as one <section class="it-module"> using the shared
// it-* base classes, plus scoped #panel .war-* widget styles. Five labs are
// REAL: a relay-logic gate bench, a binary adder built from those gates, an
// Enigma rotor + the Bombe's contradiction test, a Colossus-style bit counter
// against a Bernoulli threshold, and an ENIAC decimal ring-counter/accumulator.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "🔌", title: "Shannon wires logic to electricity",
    who: "Claude Shannon · 1937 (published 1938)",
    lead: "A 21-year-old master's student proved that Boole's algebra of true/false IS the algebra of on/off switches — the translation dictionary the whole industry runs on.",
    formula: "AND = switches in series   ·   OR = switches in parallel   ·   NOT = a normally-closed relay",
    what: `While servicing the hundred-relay control circuit of MIT's Bush differential
      analyzer, Claude Shannon noticed something nobody had formalized: a relay is a physical
      truth value. In his 1937 master's thesis, "A Symbolic Analysis of Relay and Switching
      Circuits," he showed that George Boole's 1847 two-valued algebra is EXACTLY the
      mathematics of switching networks — series is AND, parallel is OR, a normally-closed
      contact is NOT. You can build every one of those gates from relays in the first lab
      above.`,
    how: `This turned circuit design from an art into a science. Instead of tinkering, an
      engineer could now write down a Boolean expression, simplify it algebraically, and read
      off the minimal circuit. Complex logic — adders, comparators, controllers — became a
      matter of algebra, not intuition. It is the reason a chip with billions of transistors
      can be designed at all.`,
    story: `Herman Goldstine called it "surely one of the most important master's theses ever
      written"; Scientific American later dubbed it "the Magna Carta of the Information Age."
      Remarkably, the philosopher Charles Sanders Peirce had sketched electrical logic circuits
      as early as 1886, but never pursued it — so the idea waited fifty years for Shannon to
      make it rigorous and general.`,
    today: `Every logic gate, every ALU, every processor is applied Shannon. When you write
      \`a && b\` in code or draw an AND gate in a schematic, you are standing on this thesis.
      It is the hinge between the Foundations continent (pure logic) and the Hardware continent
      (real switches).`
  },
  {
    icon: "⚙️", title: "Zuse builds the first working programmable computer",
    who: "Konrad Zuse · Z1 1938 → Z3 1941 · Berlin",
    lead: "In his parents' Berlin living room, a civil engineer who hated hand-calculation built the first program-controlled, fully automatic computer — out of relays.",
    formula: "binary floating-point   ·   program on punched film   ·   ~2,600 relays",
    what: `Konrad Zuse, sick of the tedious calculations of civil engineering, set out to
      automate them. The mechanical Z1 (1938) proved the logic but jammed constantly; the Z3
      (completed 1941) replaced the mechanics with about 2,600 electrical relays and worked.
      It was binary, used floating-point numbers, and read its program from punched film — the
      first fully automatic, program-controlled, working digital computer.`,
    how: `Zuse worked in near-total isolation from the Anglo-American effort, and even from
      German academia. He independently arrived at binary arithmetic and floating-point
      representation — decisions modern computers still make. The Z3 could not do conditional
      branching in the way the Analytical Engine's design allowed, but for straight-line
      numerical work it was general enough to be shown (much later) to be Turing-complete in
      principle.`,
    story: `The original Z3 was destroyed in a 1943 Allied bombing raid on Berlin; a working
      replica was built in the 1960s and stands in the Deutsches Museum, Munich. Zuse also
      designed Plankalkül, arguably the first high-level programming language, around 1945 —
      though it went unpublished and unimplemented for decades.`,
    today: `Relays gave way to tubes, then transistors, but Zuse's core choices — binary,
      floating-point, program-controlled, automatic — are the DNA of every machine since. He is
      the clearest proof that the computer had many independent inventors, converging on the
      same design because the logic demanded it.`
  },
  {
    icon: "🔐", title: "The Bombe — deduction at machine speed",
    who: "Rejewski (1938) · Turing & Welchman · Bletchley Park 1940",
    lead: "To break Enigma you could not try 158 million million million keys. You had to make a machine that reasoned — testing a guess and detecting its own contradictions.",
    formula: "assume a plugboard link  →  follow the wiring  →  if it contradicts itself, the guess is wrong",
    what: `Enigma's daily settings gave about 1.5 × 10²³ possibilities — brute force was
      hopeless. The Polish mathematician Marian Rejewski first attacked it with group theory and
      built the electromechanical "bomba" (1938). At Bletchley Park, Alan Turing and Gordon
      Welchman generalized it into the Bombe (1940): a machine that took a "crib" (a guessed
      plaintext) and rapidly tested rotor positions, using the Enigma's own wiring to detect
      logical contradictions. The Enigma-plus-Bombe lab above lets you run that contradiction
      test yourself.`,
    how: `The key idea is proof by contradiction, mechanized. Welchman's "diagonal board"
      exploited the fact that Enigma's plugboard is reciprocal (if A links to B, then B links
      to A). The Bombe assumed one plugboard hypothesis, propagated its consequences through a
      chain of connected Enigmas, and if that led to a self-contradiction, the whole rotor
      position was eliminated at electrical speed — collapsing the search from impossible to
      tractable.`,
    story: `A crucial, poignant flaw made it possible: no Enigma letter ever encrypts to
      itself. That single constraint let codebreakers line up cribs and gave the Bombe its
      foothold. The intelligence it produced ("Ultra") is widely credited with shortening the
      war by years and saving countless lives — while Turing's own fate afterward was
      persecution and an early death.`,
    today: `The Bombe is the ancestor of every constraint solver and SAT solver: state a
      hypothesis, propagate constraints, backtrack on contradiction. That loop runs today inside
      chip verification, logistics optimizers, and theorem provers. Deduction-as-search was born
      here, in oak and brass and wire.`
  },
  {
    icon: "🔥", title: "Colossus — the first electronic computer, kept secret",
    who: "Tommy Flowers · Bletchley Park · December 1943",
    lead: "A telephone engineer bet that 1,600 unreliable vacuum tubes could be reliable if you never switched them off — and built the first large-scale electronic digital computer.",
    formula: "count coincidences between cipher tape & a generated key-stream, per wheel setting",
    what: `The Lorenz cipher ("Tunny") that encrypted Hitler's high command was far more
      complex than Enigma. To break it, Tommy Flowers of the Post Office Research Station built
      Colossus (operational December 1943): 1,600 vacuum tubes (2,400 in the Mark 2), reading a
      paper tape at 5,000 characters per second and performing Boolean counting operations to
      find the Lorenz wheel settings statistically. The Colossus lab above runs a bitstream
      through a live coincidence counter.`,
    how: `Flowers's radical bet was on reliability: colleagues thought thousands of tubes would
      fail constantly, but Flowers knew from telephone-exchange work that tubes are reliable if
      kept powered continuously and never thermally cycled. Colossus was programmed with switches
      and plugboards (not stored programs) and had no memory in the modern sense — but it was
      electronic, digital, and programmable, and it was fast.`,
    story: `Because of its secrecy, Colossus was dismantled and its existence hidden until the
      1970s — so for decades the history books credited ENIAC as the first electronic computer,
      and Flowers received little recognition in his lifetime. A working Mark 2 was rebuilt by
      Tony Sale's team (1994–2008) and runs today at The National Museum of Computing, Bletchley
      Park.`,
    today: `Colossus proved electronics could compute at scale, directly informing the
      post-war British machines. Its erasure from the record is also a lesson: secrecy warps
      history, and "firsts" depend on what has been declassified. The vacuum tube it vindicated
      ruled computing until the transistor.`
  },
  {
    icon: "🧮", title: "ENIAC — general-purpose electronic computing, and the women who ran it",
    who: "Eckert & Mauchly · Penn · 1945 · programmed by six women",
    lead: "Eighteen thousand tubes, thirty tons, and a machine you programmed by physically rewiring it — the first general-purpose electronic computer, publicly known.",
    formula: "decimal ring-counters accumulate; plugboard cables + switches ARE the program",
    what: `ENIAC (Electronic Numerical Integrator and Computer), built at the University of
      Pennsylvania by J. Presper Eckert and John Mauchly and unveiled in 1946, used about 18,000
      vacuum tubes and could do 5,000 additions per second — a thousand times faster than the
      electromechanical machines. Unlike Colossus it was general-purpose and decimal, storing
      numbers in ten-state "ring counters." Build one of those accumulators in the ENIAC lab
      above.`,
    how: `ENIAC had no stored program: you programmed it by setting switches and plugging
      hundreds of cables to route numbers between accumulators — a job that could take days. It
      was this very awkwardness that motivated the next revolution: von Neumann's 1945 EDVAC
      report proposing the stored-program architecture, where the program lives in the same
      memory as the data (the subject of the next field over).`,
    story: `ENIAC was programmed by six women — Kay McNulty, Betty Jennings, Betty Snyder,
      Marlyn Meltzer, Fran Bilas, and Ruth Lichterman — mathematicians who figured out how to
      wire the machine for each problem, often from logical diagrams alone. For decades they
      were miscaptioned as "models" or left out entirely; their recognition came only recently.`,
    today: `ENIAC is the bridge from the wartime one-off machines to the commercial computer
      age — its designers went on to build UNIVAC. And the awkwardness of rewiring it is the
      direct reason your computer stores its program as data. The wartime era ends here, handing
      the baton to the stored-program revolution.`
  },
  {
    icon: "🌍", title: "What the wartime era decided",
    who: "1937 – 1946 · and its long shadow",
    lead: "In under a decade, computing crossed three thresholds at once — logic became circuitry, mechanics became electronics, and theory became a war-winning weapon.",
    formula: "gears → relays → vacuum tubes   ·   art → science   ·   secrecy → distorted history",
    what: `Compress the decade and three permanent shifts stand out. Shannon made logic
      designable. Zuse, Flowers, and the Penn team proved that general computation could be
      physically built — first in relays, then in tubes. And the codebreaking effort showed that
      abstract mathematics (group theory, statistics, proof-by-contradiction) could be
      mechanized into decisive real-world power.`,
    how: `These machines were special-purpose, un-stored-program, and often secret — so none of
      them is quite "the first modern computer." That title needs the stored-program idea, which
      arrived in 1945 precisely as a response to ENIAC's rewiring nightmare. The wartime era is
      the hinge: it delivered the electronics and the ambition, and posed the problem the next
      era solved.`,
    story: `It is also a chapter about people and cost. Turing was prosecuted and died at 41;
      Flowers was sworn to secrecy and under-credited for life; the ENIAC women were erased from
      their own photographs; Zuse worked amid the rubble of Berlin. The romance of "the machines
      that won the war" sits alongside real injustice.`,
    today: `Substrate-independence — the idea that the same logic runs in any medium — got its
      loudest proof here: the identical Boolean structure ran in Zuse's relays, Flowers's tubes,
      and today's silicon. Every constraint solver, every logic-synthesis tool, every claim that
      software is separable from hardware traces back to this wired decade.`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "FOUNDATIONAL THESIS · 1937", title: "Claude Shannon — A Symbolic Analysis of Relay and Switching Circuits",
    note: "\u201CThe most significant master's thesis of the 20th century.\u201D Boolean algebra = switching circuits. Full PDF (U. Virginia mirror).",
    url: "https://www.cs.virginia.edu/~robins/Shannon_MS_Thesis.pdf" },
  { type: "PUBLISHED PAPER · 1938", title: "Shannon — A Symbolic Analysis of Relay and Switching Circuits (Trans. AIEE)",
    note: "The journal version. Series = product, parallel = sum; a full calculus of \u201Chindrance\u201D functions.",
    url: "https://doi.org/10.1109/T-AIEE.1938.5057767" },
  { type: "ORIGINS · GROUP THEORY", title: "Marian Rejewski — How Polish Mathematicians Broke the Enigma Cipher",
    note: "The permutation-group attack (1932) and the Polish \u201Cbomba\u201D (1938) the British Bombe was built upon.",
    url: "https://doi.org/10.1109/MAHC.1981.10033" },
  { type: "THE MACHINE · REBUILD", title: "The National Museum of Computing — Colossus",
    note: "Tommy Flowers's electronic codebreaker; the working Mark 2 rebuild (1994–2008) at Bletchley Park, with its full story.",
    url: "https://www.tnmoc.org/colossus" },
  { type: "PRIMARY REPORT · 1945", title: "John von Neumann — First Draft of a Report on the EDVAC",
    note: "Written in direct response to ENIAC's rewiring problem: the stored-program architecture that ended this era.",
    url: "https://doi.org/10.1109/85.238389" },
  { type: "THE ENIAC PROGRAMMERS", title: "ENIAC and its six women programmers — IEEE Annals / ENIAC Programmers Project",
    note: "McNulty, Jennings, Snyder, Meltzer, Bilas & Lichterman — the mathematicians who wired ENIAC, long uncredited.",
    url: "https://doi.org/10.1109/85.511940" },
  { type: "DEFINITIVE HISTORY · BOOK", title: "B. Jack Copeland (ed.) — Colossus: The Secrets of Bletchley Park's Codebreaking Computers",
    note: "The authoritative account of Colossus and the Lorenz attack, drawing on declassified records and the engineers' own testimony.",
    url: "https://global.oup.com/academic/product/colossus-9780199578146" },
  { type: "ZUSE · MUSEUM", title: "Deutsches Museum — Konrad Zuse's Z3 (replica)",
    note: "The first working program-controlled computer (relays, binary, floating-point, 1941); replica on display in Munich.",
    url: "https://www.deutsches-museum.de/en/exhibitions/computers" },
  { type: "GENERAL HISTORY · BOOK", title: "Walter Isaacson — The Innovators",
    note: "Readable narrative tying Shannon, the Bombe, Colossus, ENIAC and its women programmers into one story.",
    url: "https://www.simonandschuster.com/books/The-Innovators/Walter-Isaacson/9781476708706" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- Lab 1 & 2 primitives: Boolean gates + a ripple-carry adder ----
const GATES = {
  AND:  { name: "AND", sym: "a · b", relay: "two switches in SERIES — both must close",     f: (a, b) => a & b },
  OR:   { name: "OR",  sym: "a + b", relay: "two switches in PARALLEL — either closes",     f: (a, b) => a | b },
  NAND: { name: "NAND",sym: "(a·b)'",relay: "series switches on a normally-CLOSED relay",   f: (a, b) => (a & b) ? 0 : 1 },
  NOR:  { name: "NOR", sym: "(a+b)'",relay: "parallel switches on a normally-CLOSED relay", f: (a, b) => (a | b) ? 0 : 1 },
  XOR:  { name: "XOR", sym: "a⊕b",   relay: "the 'not equal' circuit — a half-adder's sum", f: (a, b) => a ^ b }
};
function gateOut(g, a, b) { return GATES[g].f(a & 1, b & 1); }

// full-adder from AND/OR/XOR, then ripple across n bits (real binary addition)
function fullAdder(a, b, cin) {
  const s1 = a ^ b;
  const sum = s1 ^ cin;
  const cout = (a & b) | (s1 & cin);
  return { sum, cout };
}
function rippleAdd(aBits, bBits) {
  const n = Math.max(aBits.length, bBits.length);
  const A = padL(aBits, n), B = padL(bBits, n);
  const out = new Array(n).fill(0);
  const carries = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const { sum, cout } = fullAdder(A[i], B[i], carries[i + 1] || 0);
    // note: index carries from LSB; store so we can show them
    out[i] = sum; carries[i] = cout;
  }
  // recompute cleanly LSB->MSB to be unambiguous
  let carry = 0; const bits = new Array(n).fill(0); const cShow = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const { sum, cout } = fullAdder(A[i], B[i], carry);
    bits[i] = sum; carry = cout; cShow[i] = cout;
  }
  return { bits, carryOut: carry };
}
function padL(arr, n) { const c = arr.slice(); while (c.length < n) c.unshift(0); return c; }
function toBits(x, n) { const b = []; for (let i = 0; i < n; i++) { b.unshift(x & 1); x >>= 1; } return b; }
function fromBits(b) { return b.reduce((v, x) => v * 2 + x, 0); }

// ---- Lab 3: a tiny reciprocal Enigma + the Bombe's contradiction test ----
// A one-rotor toy Enigma: plugboard-free monoalphabetic-with-rotation, reciprocal
// via a reflector, and — like the real thing — NO letter maps to itself.
const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// a fixed reflector permutation (an involution with no fixed points) on 26 letters
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; // standard Enigma reflector B
function reflect(i) { return AZ.indexOf(REFLECTOR[i]); }
// toy single rotor wiring (a permutation); we rotate it by `pos`
const ROTOR = "EKMFLGDQVZNTOWYHXUSPAIBRCJ"; // Enigma rotor I wiring
function rotorFwd(i, pos) { return (AZ.indexOf(ROTOR[(i + pos) % 26]) - pos + 26) % 26; }
function rotorInv(i, pos) {
  // inverse of rotorFwd
  const t = (i + pos) % 26;
  return (ROTOR.indexOf(AZ[t]) - pos + 26) % 26; // ROTOR index gives pre-image
}
// encrypt one letter at rotor start `pos` (rotor advances each key like real Enigma)
function enigmaChar(ci, pos) {
  const p = pos % 26;
  const a = rotorFwd(ci, p);
  const b = reflect(a);
  const c = rotorInv(b, p);
  return c;
}
function enigmaEncrypt(text, startPos) {
  let out = "";
  for (let k = 0; k < text.length; k++) {
    const ch = text[k].toUpperCase();
    const ci = AZ.indexOf(ch);
    if (ci < 0) { out += text[k]; continue; }
    out += AZ[enigmaChar(ci, startPos + k)];
  }
  return out;
}
// Bombe-style crib attack: find the start position(s) where plaintext crib
// encrypts to the observed ciphertext — eliminating all positions that contradict.
function bombeAttack(crib, cipher) {
  const tried = [];
  let found = [];
  for (let pos = 0; pos < 26; pos++) {
    let ok = crib.length > 0;
    let contradictionAt = -1;
    for (let k = 0; k < crib.length; k++) {
      const ci = AZ.indexOf(crib[k].toUpperCase());
      const want = AZ.indexOf(cipher[k].toUpperCase());
      if (ci < 0 || want < 0) { ok = false; break; }
      // self-encryption is impossible in Enigma — an instant contradiction
      if (enigmaChar(ci, pos + k) !== want) { ok = false; contradictionAt = k; break; }
    }
    tried.push({ pos, ok, contradictionAt });
    if (ok) found.push(pos);
  }
  return { tried, found };
}

// ---- Lab 4: Colossus-style coincidence counter ----
// Count positions where two 0/1 streams agree (the statistical test Colossus ran),
// then compare against a threshold — "significant" vs "chance".
function coincidenceCount(streamA, streamB) {
  const n = Math.min(streamA.length, streamB.length);
  let agree = 0;
  const marks = [];
  for (let i = 0; i < n; i++) {
    const m = streamA[i] === streamB[i];
    if (m) agree++;
    marks.push(m);
  }
  return { n, agree, frac: n ? agree / n : 0, marks };
}

// ---- Lab 5: ENIAC decimal ring-counter accumulator ----
// A 10-state ring counter per digit; pulses advance it; a carry pulse ripples.
function accumulate(startDigits, addend) {
  // startDigits: array of decimal digits (MSB..LSB); addend: integer to add by pulses
  const digits = startDigits.slice();
  const steps = [];
  for (let p = 0; p < addend; p++) {
    // add one pulse to least-significant digit, ripple carries
    let i = digits.length - 1, carry = 1;
    while (i >= 0 && carry) {
      const v = digits[i] + carry;
      digits[i] = v % 10;
      carry = v >= 10 ? 1 : 0;
      i--;
    }
    steps.push(digits.slice());
  }
  return { digits, steps, value: parseInt(digits.join(""), 10) };
}

/* ============================================================ STYLES ======= */
const SPARK = "#5dff9e";   // the "Logic Becomes Machine" era green
const AMBER = "#e9c46a";
const WAR_CSS = `
  #panel .war-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .war-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#bff3d3;
    background:rgba(93,255,158,.08);border:1px solid rgba(93,255,158,.3);border-radius:7px;
    padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .war-chip:hover{border-color:${SPARK};color:#fff}
  #panel .war-chip.on{background:${SPARK};color:#03251a;border-color:${SPARK};font-weight:700}
  #panel .war-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .war-relay{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin:.55rem 0;
    font:600 1rem/1 var(--mono,ui-monospace,monospace)}
  #panel .war-sw{display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;
    border-radius:8px;border:2px solid rgba(255,255,255,.25);background:#0a0f18;cursor:pointer;
    font:700 1rem/1 var(--mono,ui-monospace,monospace);color:#9fb0bf;transition:.15s;user-select:none}
  #panel .war-sw.on{border-color:${SPARK};background:rgba(93,255,158,.16);color:#eafff2;box-shadow:0 0 12px rgba(93,255,158,.35)}
  #panel .war-lamp{display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;
    border-radius:50%;border:2px solid rgba(255,255,255,.25);background:#0a0f18;font:700 1rem/1 var(--mono,ui-monospace,monospace);color:#556}
  #panel .war-lamp.lit{border-color:${AMBER};background:rgba(233,196,106,.2);color:#fff;box-shadow:0 0 16px rgba(233,196,106,.5)}
  #panel .war-bits{display:flex;gap:.3rem;flex-wrap:wrap;margin:.4rem 0;font:700 .95rem/1 var(--mono,ui-monospace,monospace)}
  #panel .war-bit{display:inline-flex;align-items:center;justify-content:center;width:1.9rem;height:1.9rem;
    border-radius:6px;border:1px solid rgba(255,255,255,.2);background:#0a0f18;color:#cde;cursor:pointer}
  #panel .war-bit.one{border-color:${SPARK};color:${SPARK};background:rgba(93,255,158,.1)}
  #panel .war-bit.carry{border-color:${AMBER};color:${AMBER}}
  #panel .war-bit.ro{cursor:default;opacity:.95}
  #panel .war-mono{font:.74rem/1.6 var(--mono,ui-monospace,monospace);color:#bcd;background:#0a0f18;
    border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.6rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .war-mono .hot{color:${SPARK};font-weight:700}
  #panel .war-mono .bad{color:#e76f51;font-weight:700}
  #panel .war-grid{display:flex;flex-wrap:wrap;gap:.25rem;margin:.5rem 0}
  #panel .war-cell{width:1.5rem;height:1.5rem;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;
    font:600 .62rem/1 var(--mono,ui-monospace,monospace);border:1px solid rgba(255,255,255,.14);background:#0a0f18;color:#9fb0bf}
  #panel .war-cell.hit{border-color:${SPARK};background:rgba(93,255,158,.18);color:#eafff2}
  #panel .war-ring{display:flex;flex-wrap:wrap;gap:.5rem;margin:.5rem 0}
  #panel .war-digit{display:flex;flex-direction:column;align-items:center;border:1px solid rgba(255,255,255,.16);
    border-radius:9px;padding:.4rem .55rem;background:#0a0f18;min-width:2.6rem}
  #panel .war-digit .dv{font:700 1.4rem/1 var(--mono,ui-monospace,monospace);color:#eafff2}
  #panel .war-digit .dl{font:500 .55rem/1.3 var(--mono,ui-monospace,monospace);color:#7a8;letter-spacing:.1em;text-transform:uppercase}
  #panel .war-digit.tick{border-color:${SPARK};box-shadow:0 0 12px rgba(93,255,158,.4)}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("wartime-css")) {
    const st = document.createElement("style");
    st.id = "wartime-css";
    st.textContent = WAR_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function gateLabHTML() {
  const chips = Object.keys(GATES).map((k, i) =>
    `<button class="war-chip${i===0?" on":""}" data-gate="${k}">${GATES[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · SHANNON'S THESIS, MADE PHYSICAL</div>
    <h3>The relay-logic bench</h3>
    <p class="it-lab-intro">Shannon's discovery: a switch is a truth value. Series wiring is AND, parallel is OR, a normally-closed relay is NOT. Flip the two input switches and watch the output lamp obey Boolean algebra — the exact translation dictionary between logic and electricity.</p>
    <div class="war-chips" id="war-gate">${chips}</div>
    <p class="war-desc" id="war-gate-desc"></p>
    <div class="war-relay">
      <span>a</span><span class="war-sw" id="war-a" data-in="a">0</span>
      <span>b</span><span class="war-sw" id="war-b" data-in="b">0</span>
      <span style="opacity:.6">→</span>
      <span id="war-gate-sym" style="color:${SPARK}"></span>
      <span style="opacity:.6">=</span>
      <span class="war-lamp" id="war-lamp">0</span>
    </div>
    <div class="war-mono" id="war-gate-truth"></div>
    <p class="it-caveat">Every one of the billions of gates in a modern chip is this idea, shrunk. Shannon turned circuit design from tinkering into algebra — write the Boolean expression, simplify, read off the wiring.</p>
  </section>`;
}

function adderLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · FROM GATES TO ARITHMETIC</div>
    <h3>Build a binary adder out of those gates</h3>
    <p class="it-lab-intro">Stack XOR + AND + OR into a full adder, chain them, and you have a machine that adds — the arithmetic core of every computer since. Set two 4-bit numbers and watch the carry ripple, bit by bit, exactly as relays or tubes would propagate it.</p>
    <div class="war-desc">A =</div>
    <div class="war-bits" id="war-add-a"></div>
    <div class="war-desc">B =</div>
    <div class="war-bits" id="war-add-b"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="war-add-run">▶ add (ripple the carry)</button>
      <button class="it-send" id="war-add-rand">randomize</button>
    </div>
    <div class="war-mono" id="war-add-out"></div>
    <p class="it-caveat">A full adder is 5 gates; a 64-bit adder is a few hundred. Shannon's algebra is what lets you design that by hand — and it is the invisible atom underneath every number your computer has ever touched.</p>
  </section>`;
}

function bombeLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · THE BOMBE · DEDUCTION AT SPEED</div>
    <h3>Enigma, and breaking it by contradiction</h3>
    <p class="it-lab-intro">Type a message: the toy Enigma encrypts it — and notice no letter ever becomes itself (the flaw the codebreakers exploited). Then hand the machine a crib (a guessed word) and its ciphertext, and the Bombe tests all 26 rotor starts, eliminating every one that contradicts. Only the consistent setting survives.</p>
    <div class="it-lab-actions">
      <input id="war-en-in" class="it-inputbox" spellcheck="false" value="ATTACKATDAWN" maxlength="18" style="font-family:var(--mono,ui-monospace,monospace);letter-spacing:.1em;text-transform:uppercase;background:#0a0f18;border:1px solid rgba(255,255,255,.16);border-radius:7px;color:#eafff2;padding:.5rem .6rem;min-width:9rem">
      <button class="it-send" id="war-en-run">▶ encrypt</button>
    </div>
    <div class="war-mono" id="war-en-out"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="war-bombe-run">run the Bombe on this crib →</button>
    </div>
    <div class="war-grid" id="war-bombe-grid"></div>
    <div class="war-mono" id="war-bombe-out"></div>
    <p class="it-caveat">Assume, propagate, backtrack on contradiction — the Bombe is the ancestor of every SAT solver and constraint engine running today. Turing mechanized proof-by-contradiction, and it helped shorten the war by years.</p>
  </section>`;
}

function colossusLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · COLOSSUS · STATISTICS AT 5,000 CHARS/SEC</div>
    <h3>The coincidence counter</h3>
    <p class="it-lab-intro">Colossus broke the Lorenz cipher not by decrypting but by <em>counting</em>: for each candidate wheel setting it counted how often the cipher tape and a generated key-stream agreed, looking for a count high enough to beat chance. Generate two streams and run the count — a significant score reveals the setting.</p>
    <div class="it-lab-actions">
      <button class="it-send" id="war-col-run">▶ generate &amp; count coincidences</button>
      <button class="it-send" id="war-col-aligned">try an aligned pair</button>
    </div>
    <div class="war-grid" id="war-col-grid"></div>
    <div class="war-mono" id="war-col-out"></div>
    <p class="it-caveat">1,600 vacuum tubes, a paper tape screaming through at 30 mph, Boolean counting in parallel — the first large-scale electronic computer, kept secret for 30 years so the history books credited ENIAC instead.</p>
  </section>`;
}

function eniacLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 5 · ENIAC · DECIMAL IN ELECTRONICS</div>
    <h3>The ring-counter accumulator</h3>
    <p class="it-lab-intro">ENIAC stored numbers not in bits but in <em>decimal</em> — each digit a 10-state ring counter of tubes. Adding meant sending pulses: a digit counts 0→9, and on the tenth pulse it wraps to 0 and kicks a carry pulse to its neighbour. Add by pulses and watch the carry ripple through the rings.</p>
    <div class="war-desc">accumulator (4 decimal ring-counters):</div>
    <div class="war-ring" id="war-eniac-ring"></div>
    <div class="it-control">
      <label for="war-eniac-add"><span>send pulses (add)</span><output id="war-eniac-addv">7</output></label>
      <input id="war-eniac-add" type="range" min="1" max="99" step="1" value="7">
    </div>
    <div class="it-lab-actions">
      <button class="it-send" id="war-eniac-run">▶ pulse it</button>
      <button class="it-send" id="war-eniac-reset" style="background:none;border:1px solid rgba(93,255,158,.5);color:${SPARK}">reset to 0</button>
    </div>
    <div class="war-mono" id="war-eniac-out"></div>
    <p class="it-caveat">18,000 tubes, 30 tons, 5,000 additions a second — and reprogramming it meant days of rewiring by hand. That very awkwardness is why von Neumann's 1945 EDVAC report proposed storing the program as data — the revolution in the very next field.</p>
  </section>`;
}

/* ============================================================ MARKUP ======= */
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

/* ============================================================ WIRING ======= */

// ---- Lab 1: relay gates ----
const GATE = { key: "AND", a: 0, b: 0 };
function gateDraw() {
  const g = GATES[GATE.key];
  $("war-gate-sym").textContent = g.sym;
  $("war-a").classList.toggle("on", !!GATE.a); $("war-a").textContent = GATE.a;
  $("war-b").classList.toggle("on", !!GATE.b); $("war-b").textContent = GATE.b;
  const out = gateOut(GATE.key, GATE.a, GATE.b);
  const lamp = $("war-lamp"); lamp.classList.toggle("lit", !!out); lamp.textContent = out;
  $("war-gate-desc").textContent = g.relay + ".";
  // truth table
  let t = "a b │ " + g.name + "\n──────┼─────\n";
  [[0,0],[0,1],[1,0],[1,1]].forEach(([a,b]) => {
    const o = gateOut(GATE.key, a, b);
    const cur = (a === GATE.a && b === GATE.b);
    t += (cur ? "▸" : " ") + a + " " + b + " │  " + (cur ? "<span class='hot'>" + o + "</span>" : o) + "\n";
  });
  $("war-gate-truth").innerHTML = t;
}

// ---- Lab 2: adder ----
const ADD = { a: [0,1,0,1], b: [0,0,1,1] };  // 4-bit
function adderBits(id, arr, key) {
  $(id).innerHTML = arr.map((x, i) =>
    `<span class="war-bit${x?" one":""}" data-k="${key}" data-i="${i}">${x}</span>`).join("");
}
function adderDraw() {
  adderBits("war-add-a", ADD.a, "a");
  adderBits("war-add-b", ADD.b, "b");
  $("war-add-out").innerHTML = "<span style='opacity:.6'>click bits to flip them, then press add.</span>";
}
function adderRun() {
  const r = rippleAdd(ADD.a, ADD.b);
  const av = fromBits(ADD.a), bv = fromBits(ADD.b), sv = fromBits(r.bits) + (r.carryOut ? 16 : 0);
  let out = "  " + ADD.a.join("") + "   (" + av + ")\n+ " + ADD.b.join("") + "   (" + bv + ")\n= "
    + (r.carryOut ? "<span class='hot'>1</span>" : "") + r.bits.join("") + "   (" + sv + ")\n";
  out += r.carryOut ? "\ncarry out of the top bit → the 5th bit is <span class='hot'>1</span>." : "\nno final carry.";
  $("war-add-out").innerHTML = out;
}

// ---- Lab 3: Enigma + Bombe ----
const ENIG = { start: 0, cipher: "", crib: "" };
function enigmaRun() {
  const txt = ($("war-en-in").value || "").toUpperCase().replace(/[^A-Z]/g, "");
  $("war-en-in").value = txt;
  ENIG.start = 0;
  const cipher = enigmaEncrypt(txt, ENIG.start);
  ENIG.cipher = cipher; ENIG.crib = txt;
  let selfmap = false;
  for (let i = 0; i < txt.length; i++) if (txt[i] === cipher[i]) selfmap = true;
  $("war-en-out").innerHTML =
    "plain  : " + txt + "\ncipher : <span class='hot'>" + cipher + "</span>\nrotor start = A (pos 0)\n\n"
    + "self-encryption check: " + (selfmap ? "<span class='bad'>FOUND (should never happen!)</span>"
      : "<span class='hot'>none</span> — no letter maps to itself, exactly as in the real Enigma.");
  $("war-bombe-grid").innerHTML = "";
  $("war-bombe-out").innerHTML = "<span style='opacity:.6'>now run the Bombe: it will test all 26 rotor starts against this crib.</span>";
}
function bombeRun() {
  if (!ENIG.cipher) enigmaRun();
  const res = bombeAttack(ENIG.crib, ENIG.cipher);
  $("war-bombe-grid").innerHTML = res.tried.map(t =>
    `<span class="war-cell${t.ok?" hit":""}" title="rotor start ${AZ[t.pos]}">${AZ[t.pos]}</span>`).join("");
  const survivors = res.found.map(p => AZ[p]).join(", ");
  const eliminated = 26 - res.found.length;
  $("war-bombe-out").innerHTML =
    "tested 26 rotor starts A–Z.\n<span class='bad'>" + eliminated + "</span> eliminated by contradiction, "
    + "<span class='hot'>" + res.found.length + "</span> consistent: <span class='hot'>" + survivors + "</span>.\n\n"
    + "The Bombe assumed a setting, propagated its consequences through the wiring, and struck out every\n"
    + "position that contradicted itself — collapsing an impossible search to a handful of candidates.";
}

// ---- Lab 4: Colossus coincidence ----
function randStream(n, seed) { const s = []; let x = seed || 1; for (let i = 0; i < n; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; s.push(x & 1); } return s; }
function colossusRun(aligned) {
  const n = 40;
  const A = randStream(n, (Date.now() & 0xffff) | 1);
  let B;
  if (aligned) {
    // a genuinely correlated stream: copy A but flip ~25% — a "right wheel setting"
    B = A.map(b => (Math.random() < 0.25 ? b ^ 1 : b));
  } else {
    B = randStream(n, ((Date.now() >> 3) & 0xffff) | 1); // independent — chance level
  }
  const r = coincidenceCount(A, B);
  $("war-col-grid").innerHTML = r.marks.map((m, i) =>
    `<span class="war-cell${m?" hit":""}">${A[i]}${B[i]}</span>`).join("");
  const expected = Math.round(n * 0.5);
  const significant = r.agree >= expected + Math.ceil(0.12 * n); // > ~1σ above chance
  $("war-col-out").innerHTML =
    "compared " + n + " positions.\nagreements: <span class='hot'>" + r.agree + "</span> / " + n
    + "  (" + (r.frac * 100).toFixed(0) + "%)\nchance level ≈ " + expected + " (50%).\n\n"
    + (significant
        ? "<span class='hot'>SIGNIFICANT</span> — well above chance. Colossus would flag this wheel setting."
        : "<span style='opacity:.7'>~chance level</span> — no correlation; try again or use an aligned pair.");
}

// ---- Lab 5: ENIAC accumulator ----
const ENIAC = { digits: [0,0,0,0] };
function eniacDraw(tickIdx) {
  const labels = ["thou", "hund", "tens", "ones"];
  $("war-eniac-ring").innerHTML = ENIAC.digits.map((d, i) =>
    `<div class="war-digit${tickIdx===i?" tick":""}"><span class="dv">${d}</span><span class="dl">${labels[i]}</span></div>`).join("");
}
function eniacRun() {
  const add = +$("war-eniac-add").value;
  const before = parseInt(ENIAC.digits.join(""), 10);
  const r = accumulate(ENIAC.digits, add);
  ENIAC.digits = r.digits;
  eniacDraw();
  const overflow = (before + add) > 9999;
  $("war-eniac-out").innerHTML =
    before + " + " + add + " = <span class='hot'>" + r.value + "</span>"
    + (overflow ? "  (rolled over 9999 — the accumulator wrapped, just as the real rings did)" : "")
    + "\nEach pulse advanced the 'ones' ring by one; every 10th pulse wrapped it and kicked a carry left.";
}

/* ============================================================ BUILD ======== */
function buildExperience() {
  ensureStyles();
  const body = $("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(t => t.remove());
  if (body.querySelector(".it-module")) return; // idempotent

  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · WHEN LOGIC GOT WIRED · ABOUT 45 MIN</div>
    <p class="it-hook">In under a decade, three thresholds fell at once: Shannon proved logic <em>is</em> circuitry, Zuse and Flowers proved computers could be <em>built</em>, and Bletchley proved that abstract mathematics could win a war — deduction running at the speed of electricity.</p>
    <p class="it-intro">This is the field where the pen-and-paper continent grows a body. Shannon's 1937 thesis is the translation dictionary between Boolean algebra and switching circuits; the Bombe and Colossus are proof-by-contradiction and statistics mechanized into war-winning machines; Zuse's relays and ENIAC's tubes are computation made physical, first electromechanically, then electronically. Five labs below: wire Boolean gates from relays, build a binary adder out of them, encrypt with a toy Enigma and break it with the Bombe's contradiction test, run Colossus's coincidence counter, and add numbers on ENIAC's decimal ring-counters.</p>
    <div class="it-timeline" aria-label="Wartime computing timeline">
      <div class="it-moment"><b>1937</b><span>Shannon's thesis</span></div>
      <div class="it-moment"><b>1941</b><span>Zuse Z3</span></div>
      <div class="it-moment"><b>1940</b><span>the Bombe</span></div>
      <div class="it-moment"><b>1943</b><span>Colossus</span></div>
      <div class="it-moment"><b>1945</b><span>ENIAC</span></div>
    </div>

    ${gateLabHTML()}
    ${adderLabHTML()}
    ${bombeLabHTML()}
    ${colossusLabHTML()}
    ${eniacLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>In the relay bench, build XOR and read its truth table. It is the "not equal" circuit — and the sum bit of a half-adder. Where does the carry come from?</li>
      <li>In the adder, set A = 1111 and B = 0001 and add. Watch the carry ripple all the way up and fall out the top — that overflow is a real hardware event.</li>
      <li>Encrypt a word with the Enigma, then check the self-encryption line. Convince yourself no letter ever maps to itself — then explain why that <em>helped</em> the codebreakers.</li>
      <li>Run the Bombe and count how many rotor starts it eliminates. Each red cell is a contradiction found at electrical speed — that is proof-by-contradiction as a machine.</li>
      <li>In Colossus, run "an aligned pair" a few times vs the random one. Learn to see "significant" vs "chance" by eye — that judgement is the whole attack.</li>
      <li>On ENIAC, set the accumulator near 9999 and add enough to roll it over. That wrap is a decimal carry rippling through ten-state rings of tubes.</li>
    </ol></div>

    <h3 class="it-section-title">Primary sources, museums &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1: gates
  gateDraw();
  module.querySelectorAll("#war-gate [data-gate]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#war-gate [data-gate]").forEach(x => x.classList.toggle("on", x === b));
      GATE.key = b.dataset.gate; gateDraw();
    }));
  $("war-a").addEventListener("click", () => { GATE.a ^= 1; gateDraw(); });
  $("war-b").addEventListener("click", () => { GATE.b ^= 1; gateDraw(); });

  // Lab 2: adder
  adderDraw();
  module.addEventListener("click", e => {
    const bit = e.target.closest && e.target.closest(".war-bit[data-k]");
    if (!bit) return;
    const k = bit.dataset.k, i = +bit.dataset.i;
    ADD[k][i] ^= 1;
    adderBits(k === "a" ? "war-add-a" : "war-add-b", ADD[k], k);
  });
  $("war-add-run").addEventListener("click", adderRun);
  $("war-add-rand").addEventListener("click", () => {
    ADD.a = toBits((Math.random() * 16) | 0, 4); ADD.b = toBits((Math.random() * 16) | 0, 4);
    adderDraw(); adderRun();
  });

  // Lab 3: Enigma + Bombe
  enigmaRun();
  $("war-en-run").addEventListener("click", enigmaRun);
  $("war-bombe-run").addEventListener("click", bombeRun);

  // Lab 4: Colossus
  $("war-col-out").innerHTML = "<span style='opacity:.6'>press generate to compare two bit-streams.</span>";
  $("war-col-run").addEventListener("click", () => colossusRun(false));
  $("war-col-aligned").addEventListener("click", () => colossusRun(true));

  // Lab 5: ENIAC
  eniacDraw();
  $("war-eniac-out").innerHTML = "<span style='opacity:.6'>set the pulse count and press pulse it.</span>";
  $("war-eniac-add").addEventListener("input", e => { $("war-eniac-addv").textContent = e.target.value; });
  $("war-eniac-run").addEventListener("click", eniacRun);
  $("war-eniac-reset").addEventListener("click", () => { ENIAC.digits = [0,0,0,0]; eniacDraw(); $("war-eniac-out").innerHTML = "<span style='opacity:.6'>reset to 0000.</span>"; });
}

window.openWartimeExperience = buildExperience;

// test hook (parity with other guides)
window.__warTest = { GATES, gateOut, fullAdder, rippleAdd, toBits, fromBits,
  enigmaEncrypt, enigmaChar, bombeAttack, coincidenceCount, accumulate, AZ };
})();
