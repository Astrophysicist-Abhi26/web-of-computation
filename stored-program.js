// THE STORED-PROGRAM REVOLUTION — the universal Turing machine turned into an
// engineering blueprint: program stored as data, in the same memory. Then the
// physical substrate that made it explode: transistor → integrated circuit →
// Moore's law. Loaded only when the "Stored-Program Revolution" field opens.
// Same architecture as the other guides: the WHOLE guide renders INTO
// #panel-body as one <section class="it-module"> using the shared it-* base
// classes, plus scoped #panel .spr-* widget styles. Five labs are REAL: a tiny
// stored-program "von Neumann machine" that runs a fetch–decode–execute loop, a
// program-is-data self-modifying demo, a transistor/NAND logic bench, an
// integrated-circuit yield calculator, and a Moore's-law doubling engine.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "🏛", title: "The stored-program idea — the blueprint that ended the wiring",
    who: "von Neumann · EDVAC report · June 1945",
    lead: "ENIAC took days to reprogram by rewiring. The fix was radical: put the program in the same memory as the data, so changing software means changing numbers, not cables.",
    formula: "program  =  data     ·     memory holds BOTH instructions and operands",
    what: `Turing's 1936 Universal Machine already proved that one machine, fed a description
      of any other, could imitate it. The 1945 "First Draft of a Report on the EDVAC" turned
      that theorem into an engineering plan: a single read/write memory holding both the data
      AND the instructions, a control unit that fetches instructions one after another, and an
      arithmetic unit that executes them. Run exactly this loop in the von-Neumann-machine lab
      above.`,
    how: `This is the fetch–decode–execute cycle every processor still runs: read the next
      instruction from memory, work out what it means, do it, advance, repeat. Because
      instructions are just numbers in the same store as the data, a program can be loaded,
      swapped, or even rewrite itself — reprogramming becomes a matter of writing memory, not
      moving wires. That is the whole difference between ENIAC and your laptop.`,
    story: `The report was written by hand on a train and circulated with only von Neumann's
      name on it — so he got the credit, though Eckert and Mauchly (ENIAC's engineers) argued
      the stored-program idea was a group result and partly theirs. Its unauthorized
      distribution counted as public disclosure and later helped invalidate their patent. The
      name "von Neumann architecture" has been quietly contested ever since.`,
    today: `Every mainstream CPU is a von Neumann machine: program counter, memory, ALU,
      fetch–decode–execute. The one famous side-effect — instructions and data sharing one
      bus — is the "von Neumann bottleneck," the very reason caches, and today's GPUs and
      dataflow accelerators, exist. The blueprint is 80 years old and still the default.`
  },
  {
    icon: "💾", title: "Program as data — the deepest consequence",
    who: "Turing 1936 → EDSAC 1949 → the software industry",
    lead: "If code is just numbers in memory, then programs can read, write, generate, and transform other programs. Almost everything in software follows from this one fact.",
    formula: "a program can take a program as input, and produce a program as output",
    what: `The stored-program principle collapses a distinction people had assumed was
      fundamental: the difference between the machine and what it does. Once instructions live
      in writable memory as ordinary numbers, a program is data that other programs can
      manipulate. The self-modifying-program lab above shows a running program editing its own
      instructions mid-execution — startling the first time you see it.`,
    how: `From this single idea flow: compilers (programs that read source code and write
      machine code), interpreters, operating systems that load and schedule other programs,
      linkers, just-in-time compilers, and — at the far end — code that writes code. The first
      practical stored-program machines (Manchester Baby 1948, Cambridge's EDSAC 1949) made it
      real, and the software profession was born.`,
    story: `It is also the root of the field's deepest limits. Turing's Halting Problem and
      Gödel's incompleteness both rely on exactly this move — feeding a program its own
      description. The power to treat code as data and the impossibility of deciding what
      arbitrary code will do are two sides of one coin.`,
    today: `Every compiler, every interpreter, every operating system, every virtual machine,
      and every model that generates code is a program manipulating programs. When an LLM
      writes a function, it is the stored-program principle taken to its logical extreme: the
      program and the data have become the same substance all the way down.`
  },
  {
    icon: "🔬", title: "The transistor — the atom of the information age",
    who: "Bardeen, Brattain & Shockley · Bell Labs · December 1947",
    lead: "Vacuum tubes were hot, huge, and fragile. A sliver of semiconductor did the same switching — smaller, cooler, and eventually a billion to a chip.",
    formula: "a transistor is a voltage-controlled switch  →  one gate, one bit, one Shannon truth-value",
    what: `On 23 December 1947 at Bell Labs, John Bardeen and Walter Brattain demonstrated the
      first point-contact transistor; William Shockley soon developed the more manufacturable
      junction transistor. It does what a vacuum tube or relay does — switch and amplify — but
      as a tiny, cool, durable piece of semiconductor. That switch is exactly Shannon's
      truth-value made minuscule. Build logic from transistors in the NAND lab above.`,
    how: `A transistor is a switch controlled by a voltage: a small signal on the gate turns a
      larger current on or off. Wire a few together and you get a NAND gate — and NAND alone is
      "functionally complete," meaning every Boolean function, and therefore every computation,
      can be built from NANDs. The whole edifice of digital logic reduces to copies of this one
      part.`,
    story: `The three shared the 1956 Nobel Prize in Physics. Shockley's later move to
      California to found Shockley Semiconductor, and the "traitorous eight" who left him to
      start Fairchild Semiconductor, seeded the entire region that became Silicon Valley — the
      transistor didn't just change computers, it created an industry and a place.`,
    today: `Every logic gate in every processor is transistors. A modern chip packs tens of
      billions of them, each a Shannon switch, each a descendant of that 1947 sliver of
      germanium. It is the clearest case on the whole map of a pure physics result becoming the
      physical basis of civilization.`
  },
  {
    icon: "🔲", title: "The integrated circuit — a whole circuit on one chip",
    who: "Jack Kilby (TI, 1958) & Robert Noyce (Fairchild, 1959)",
    lead: "Wiring transistors by hand didn't scale. The leap was to fabricate many components — and their connections — together on a single slice of silicon.",
    formula: "many transistors + their wiring, printed together on one monolithic chip",
    what: `In 1958 Jack Kilby at Texas Instruments built the first working integrated circuit;
      months later Robert Noyce at Fairchild devised the planar process that made ICs mass-
      producible, printing components and their interconnections together on silicon. Instead
      of soldering discrete parts, you photolithograph an entire circuit at once. The yield lab
      above shows why making that slice bigger is a gamble.`,
    how: `The planar process is essentially photographic: pattern the silicon with light through
      a mask, dope regions to make transistors, lay down metal to wire them — all in parallel
      across the whole wafer. This is what makes cost per transistor plummet as you shrink
      features: you get more devices from the same photographic step. It is the manufacturing
      engine behind everything that follows.`,
    story: `Kilby received the 2000 Nobel Prize in Physics (Noyce had died in 1990 and Nobels
      are not awarded posthumously). Noyce co-founded Intel in 1968 with Gordon Moore. The two
      inventions are usually credited jointly — Kilby for the concept, Noyce for the process
      that made it practical.`,
    today: `Every chip is an integrated circuit; the entire semiconductor industry is the art
      of putting more, smaller, cheaper transistors on one slice of silicon. Kilby and Noyce's
      leap is why a computer shrank from a room to a fleck of sand — and why one now fits in a
      earbud.`
  },
  {
    icon: "🔥", title: "Moore's law — the exponential that scheduled the future",
    who: "Gordon Moore · Electronics magazine · 1965",
    lead: "Not a law of nature but an observation that became a self-fulfilling industry roadmap: transistor counts double roughly every two years.",
    formula: "transistors per chip  ≈  2 ^ (years / 2)     →     exponential, for six decades",
    what: `In 1965 Gordon Moore noticed that the number of components on a chip had been
      doubling about every year (later revised to ~two years) and predicted it would continue.
      It did — for over fifty years, one of the most sustained exponential trends in the history
      of technology. Drive the doubling yourself in the Moore's-law lab above and feel how fast
      exponentials run away.`,
    how: `Moore's law was never physics; it was economics and coordination. It became a
      self-fulfilling roadmap: the whole industry planned R&D, capital, and product cycles
      around hitting the next node on schedule, so the prophecy delivered itself. Dennard
      scaling (performance-per-watt improving with shrinking) rode alongside it until it broke
      around 2005, forcing the pivot to multicore.`,
    story: `The exponential is now bending. Transistors are approaching atomic dimensions,
      costs per node are soaring, and Dennard scaling is dead. That slowdown is precisely WHY
      specialized accelerators — GPUs, TPUs — took over: if you can't make general chips much
      faster, you make chips shaped for one job, like matrix multiplication.`,
    today: `Moore's law scheduled the entire information age: it is why the phone in your pocket
      dwarfs the room-sized machines of this era. Its slowing is the hinge to the next field —
      Modern & AI-Era Hardware — where the answer to "no more free speed" is silicon designed
      around the workload itself. The stored-program blueprint stayed constant; only the
      transistor budget exploded, then plateaued.`
  },
  {
    icon: "🌍", title: "What the revolution settled",
    who: "1945 – today · the architecture that stuck",
    lead: "One logical blueprint plus one physical part, scaled a billion-fold: that combination is essentially every computer you have ever used.",
    formula: "stored-program logic (constant)  ×  transistors (exponential)  =  the modern computer",
    what: `Two independent threads met here and never separated. The logical thread — program
      stored as data, fetched and executed in a loop — was fixed by 1945 and has barely changed.
      The physical thread — relay to tube to transistor to integrated circuit — kept shrinking
      and multiplying under Moore's law. The computer is their product.`,
    how: `Crucially, the blueprint is substrate-independent: the same von Neumann architecture
      ran on tubes (EDVAC-era), on discrete transistors, on small ICs, and on billion-transistor
      chips, without changing its logic. That separation — stable architecture, exploding
      implementation — is what let software become an industry decoupled from any particular
      machine.`,
    story: `It is a story of credit and contest as much as invention: von Neumann's name on a
      group idea, Kilby and Noyce's parallel breakthroughs, Shockley's toxic brilliance seeding
      Silicon Valley. The clean textbook arc hides a messier human one, as these eras usually
      do.`,
    today: `You are reading this on the direct output of this revolution: a stored-program
      machine of tens of billions of transistors, running a program that is just data in
      memory. The next field asks what happens when the transistor exponential slows — and the
      answer, GPUs and accelerators, is where the whole map has been heading.`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "PRIMARY REPORT · 1945", title: "John von Neumann — First Draft of a Report on the EDVAC",
    note: "The first published description of the stored-program architecture. Full scanned document (Internet Archive).",
    url: "https://archive.org/details/firstdraftofrepo00vonn" },
  { type: "EDITED REPRINT · 1993", title: "von Neumann (ed. M. D. Godfrey) — First Draft… (IEEE Annals)",
    note: "A carefully proofread modern edition with an introduction; IEEE Annals of the History of Computing 15(4), 27–75.",
    url: "https://doi.org/10.1109/85.238389" },
  { type: "FOUNDING THEOREM · 1936", title: "Alan Turing — On Computable Numbers (the Universal Machine)",
    note: "The theorem the EDVAC report engineered: one machine, given a program, imitates any other. The stored program's ancestor.",
    url: "https://doi.org/10.1112/plms/s2-42.1.230" },
  { type: "NOBEL · TRANSISTOR", title: "Bardeen, Brattain & Shockley — the transistor (Nobel Prize 1956)",
    note: "The 1947 Bell Labs invention and the physics behind it; official Nobel background on the semiconductor switch.",
    url: "https://www.nobelprize.org/prizes/physics/1956/summary/" },
  { type: "PATENT · IC · 1959", title: "Robert Noyce — Semiconductor Device-and-Lead Structure (US 2,981,877)",
    note: "The planar integrated-circuit patent that made ICs mass-producible — the manufacturing basis of every chip.",
    url: "https://patents.google.com/patent/US2981877A/en" },
  { type: "NOBEL · IC · 2000", title: "Jack Kilby — the integrated circuit (Nobel Prize 2000)",
    note: "The 1958 first working IC; Kilby's Nobel lecture and background on the birth of the microchip.",
    url: "https://www.nobelprize.org/prizes/physics/2000/kilby/facts/" },
  { type: "THE PREDICTION · 1965", title: "Gordon Moore — Cramming More Components onto Integrated Circuits",
    note: "The original Electronics magazine article that became \u201CMoore's law.\u201D Re-hosted by IEEE / Intel.",
    url: "https://doi.org/10.1109/JPROC.1998.658762" },
  { type: "DEFINITIVE HISTORY · BOOK", title: "Paul Ceruzzi — A History of Modern Computing",
    note: "The standard scholarly history from EDVAC and the stored program through the transistor, IC, and microprocessor eras.",
    url: "https://mitpress.mit.edu/9780262532037/a-history-of-modern-computing/" },
  { type: "CHIP-BY-CHIP · BOOK", title: "Chris Miller — Chip War",
    note: "How the transistor → IC → Moore's-law story became the central technology of the modern economy and geopolitics.",
    url: "https://www.simonandschuster.com/books/Chip-War/Chris-Miller/9781982172008" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- Lab 1 & 2: a tiny stored-program "von Neumann machine" ----
// A single memory array holds BOTH instructions and data. Instructions are
// numbers: [opcode, operand]. One accumulator (ACC), one program counter (PC).
// Opcodes:
//  0 HLT        stop
//  1 LDA addr   ACC = mem[addr].val (load data word's value)
//  2 STA addr   mem[addr] = value ACC   (store ACC into a data word)
//  3 ADD addr   ACC += mem[addr].val
//  4 SUB addr   ACC -= mem[addr].val
//  5 JMP addr   PC = addr
//  6 JZ  addr   if ACC==0, PC = addr
//  7 OUT        emit ACC
//  8 INC addr   mem[addr] instruction operand += 1  (self-modification demo)
const OPS = { 0:"HLT",1:"LDA",2:"STA",3:"ADD",4:"SUB",5:"JMP",6:"JZ",7:"OUT",8:"INC" };

const VN_PROGRAMS = {
  countdown: {
    name: "count down 3→0 (a loop)",
    // words: instructions then data. Each word: {op,arg} for code; {val} for data.
    // loop(0): LDA N ; OUT ; JZ end ; SUB one ; STA N ; JMP loop ; end(6): HLT
    mem: [
      {op:1,arg:7}, // 0: LDA 7   ACC = N
      {op:7,arg:0}, // 1: OUT     print ACC
      {op:6,arg:6}, // 2: JZ 6    if ACC==0 goto 6 (HLT)
      {op:4,arg:8}, // 3: SUB 8   ACC -= 1
      {op:2,arg:7}, // 4: STA 7   N = ACC
      {op:5,arg:0}, // 5: JMP 0   loop back to top
      {op:0,arg:0}, // 6: HLT
      {val:3},      // 7: N = 3   (data)
      {val:1}       // 8: one = 1 (data)
    ],
    note: "loads N, prints it, halts if zero, else subtracts 1, stores it back, and loops."
  },
  selfmod: {
    name: "self-modifying: a program that edits its own code",
    mem: [
      {op:1,arg:5}, // 0: LDA 5   ACC = data (starts 0)
      {op:7,arg:0}, // 1: OUT     print ACC
      {op:8,arg:0}, // 2: INC 0   *** rewrite instruction 0's operand: 5 → 6 → 7 ...
      {op:3,arg:6}, // 3: ADD 6   ACC += 1  (just to vary output)
      {op:0,arg:0}, // 4: HLT
      {val:10},     // 5: data A
      {val:1}       // 6: constant 1 / also becomes a target
    ],
    note: "instruction 2 rewrites the operand of instruction 0 — code editing itself, live."
  }
};
// fix countdown loop: replace word 5 with JMP 1 (loop back to OUT)
VN_PROGRAMS.countdown.mem[5] = {op:5,arg:1};

function vnRun(progKey, cap) {
  const P = VN_PROGRAMS[progKey];
  const mem = P.mem.map(w => Object.assign({}, w));
  let ACC = 0, PC = 0, out = [], halted = false;
  const trace = [{ PC, ACC, mem: snap(mem), out: [], note: "loaded" }];
  let guard = 0;
  while (guard++ < (cap || 200) && !halted) {
    const w = mem[PC];
    const op = w.op | 0, arg = w.arg | 0;
    let note = OPS[op] + (op>=1&&op<=6||op===8 ? " " + arg : "");
    const here = PC;
    switch (op) {
      case 0: halted = true; note = "HLT"; break;
      case 1: ACC = (mem[arg].val !== undefined ? mem[arg].val : mem[arg].arg) | 0; PC++; break;
      case 2: mem[arg] = { val: ACC }; PC++; break;
      case 3: ACC += (mem[arg].val !== undefined ? mem[arg].val : mem[arg].arg) | 0; PC++; break;
      case 4: ACC -= (mem[arg].val !== undefined ? mem[arg].val : mem[arg].arg) | 0; PC++; break;
      case 5: PC = arg; break;
      case 6: if (ACC === 0) PC = arg; else PC++; break;
      case 7: out = out.concat([ACC]); PC++; note = "OUT → " + ACC; break;
      case 8: mem[arg] = Object.assign({}, mem[arg], { arg: ((mem[arg].arg|0) + 1) }); PC++; note = "INC code[" + arg + "].operand → " + mem[arg].arg; break;
      default: halted = true; note = "bad op"; break;
    }
    trace.push({ PC, ACC, mem: snap(mem), out: out.slice(), note, here });
    if (op === 7 && out.length > 30) break;
  }
  return { trace, out, halted };
}
function snap(mem) { return mem.map(w => Object.assign({}, w)); }

// ---- Lab 3: transistor / NAND logic (NAND is functionally complete) ----
function nand(a, b) { return (a & b) ? 0 : 1; }
// derive the standard gates from NAND only
function notN(a) { return nand(a, a); }
function andN(a, b) { return notN(nand(a, b)); }
function orN(a, b) { return nand(notN(a), notN(b)); }
function xorN(a, b) { const c = nand(a, b); return nand(nand(a, c), nand(b, c)); }
const NAND_GATES = {
  NOT: { arity: 1, build: "NAND(a,a)", f: (a) => notN(a) },
  AND: { arity: 2, build: "NOT(NAND(a,b))", f: (a, b) => andN(a, b) },
  OR:  { arity: 2, build: "NAND(NOT a, NOT b)", f: (a, b) => orN(a, b) },
  XOR: { arity: 2, build: "4 NANDs", f: (a, b) => xorN(a, b) },
  NAND:{ arity: 2, build: "the primitive itself", f: (a, b) => nand(a, b) }
};

// ---- Lab 4: IC wafer yield ----
// Poisson/Murphy-style yield model: yield ≈ e^(-A·D) for defect density D.
function waferYield(dieAreaCm2, defectPerCm2, waferDiaMm) {
  const y = Math.exp(-dieAreaCm2 * defectPerCm2);
  const waferAreaCm2 = Math.PI * Math.pow(waferDiaMm / 20, 2); // (d/2 in mm)→cm: /10 then /2 ⇒ /20
  const grossDies = Math.floor(waferAreaCm2 / dieAreaCm2);
  const goodDies = Math.round(grossDies * y);
  return { y, grossDies, goodDies, waferAreaCm2 };
}

// ---- Lab 5: Moore's law doubling ----
function mooreCount(startTransistors, startYear, targetYear, doublingYears) {
  const dt = targetYear - startYear;
  const doublings = dt / doublingYears;
  return { count: startTransistors * Math.pow(2, doublings), doublings };
}

/* ============================================================ STYLES ======= */
const STEEL = "#9fb4d8";   // the "Mainframe Age" blue
const HOT = "#f5a15a";
const SPR_CSS = `
  #panel .spr-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .spr-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#cdd9ef;
    background:rgba(159,180,216,.08);border:1px solid rgba(159,180,216,.32);border-radius:7px;
    padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .spr-chip:hover{border-color:${STEEL};color:#fff}
  #panel .spr-chip.on{background:${STEEL};color:#0a1220;border-color:${STEEL};font-weight:700}
  #panel .spr-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .spr-mem{display:flex;flex-direction:column;gap:2px;margin:.5rem 0;font:500 .72rem/1.3 var(--mono,ui-monospace,monospace)}
  #panel .spr-word{display:flex;align-items:center;gap:.5rem;padding:.28rem .45rem;border-radius:6px;
    border:1px solid rgba(255,255,255,.09);background:#0a0f18;color:#bcd}
  #panel .spr-word .adr{color:#6b7a90;width:1.6rem;text-align:right}
  #panel .spr-word .kind{width:2.4rem;color:#8aa;font-size:.62rem;text-transform:uppercase;letter-spacing:.06em}
  #panel .spr-word.pc{border-color:${STEEL};background:rgba(159,180,216,.14);color:#eaf1ff;box-shadow:0 0 10px rgba(159,180,216,.3)}
  #panel .spr-word.data{border-style:dashed}
  #panel .spr-word.edited{border-color:${HOT};color:#ffe3c9}
  #panel .spr-regs{display:flex;gap:.6rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .spr-reg{border:1px solid rgba(159,180,216,.3);border-radius:8px;padding:.35rem .6rem;background:#0a0f18;text-align:center;min-width:3rem}
  #panel .spr-reg .l{display:block;font:500 .55rem/1 var(--mono,ui-monospace,monospace);letter-spacing:.1em;color:#8aa;text-transform:uppercase}
  #panel .spr-reg .v{font:700 1.05rem/1.3 var(--mono,ui-monospace,monospace);color:#eaf1ff}
  #panel .spr-out{font:.78rem/1.6 var(--mono,ui-monospace,monospace);color:#bcd;background:#0a0f18;
    border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.55rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .spr-out .hot{color:${STEEL};font-weight:700}
  #panel .spr-out .amp{color:${HOT};font-weight:700}
  #panel .spr-sw{display:inline-flex;align-items:center;justify-content:center;width:2.4rem;height:2.4rem;border-radius:8px;
    border:2px solid rgba(255,255,255,.25);background:#0a0f18;cursor:pointer;font:700 1rem/1 var(--mono,ui-monospace,monospace);color:#9fb0bf;transition:.15s}
  #panel .spr-sw.on{border-color:${STEEL};background:rgba(159,180,216,.16);color:#eaf1ff;box-shadow:0 0 12px rgba(159,180,216,.35)}
  #panel .spr-lamp{display:inline-flex;align-items:center;justify-content:center;width:2.4rem;height:2.4rem;border-radius:50%;
    border:2px solid rgba(255,255,255,.25);background:#0a0f18;font:700 1rem/1 var(--mono,ui-monospace,monospace);color:#556}
  #panel .spr-lamp.lit{border-color:${HOT};background:rgba(245,161,90,.22);color:#fff;box-shadow:0 0 16px rgba(245,161,90,.5)}
  #panel .spr-wafer{display:grid;gap:2px;margin:.5rem 0;width:max-content}
  #panel .spr-die{width:.85rem;height:.85rem;border-radius:2px;background:#26324a}
  #panel .spr-die.good{background:${STEEL}}
  #panel .spr-die.bad{background:#5a2a2a}
  #panel .spr-die.off{background:transparent}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("stored-css")) {
    const st = document.createElement("style");
    st.id = "stored-css";
    st.textContent = SPR_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function vnLabHTML() {
  const chips = Object.keys(VN_PROGRAMS).map((k, i) =>
    `<button class="spr-chip${i===0?" on":""}" data-prog="${k}">${VN_PROGRAMS[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · THE VON NEUMANN MACHINE</div>
    <h3>Run a stored program — fetch, decode, execute</h3>
    <p class="it-lab-intro">One memory holds BOTH the instructions and the data. A program counter (PC) points at the next instruction; the machine fetches it, decodes the opcode, executes it on the accumulator (ACC), and advances. Step through the loop and watch the PC walk the memory — this cycle is inside every processor ever made.</p>
    <div class="spr-chips" id="spr-vn-prog">${chips}</div>
    <p class="spr-desc" id="spr-vn-desc"></p>
    <div class="spr-regs">
      <div class="spr-reg"><span class="l">PC</span><span class="v" id="spr-vn-pc">0</span></div>
      <div class="spr-reg"><span class="l">ACC</span><span class="v" id="spr-vn-acc">0</span></div>
      <div class="spr-reg"><span class="l">output</span><span class="v" id="spr-vn-outv">–</span></div>
    </div>
    <div class="spr-mem" id="spr-vn-mem"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="spr-vn-step">▶ step</button>
      <button class="it-send" id="spr-vn-run">run to halt</button>
      <button class="it-send" id="spr-vn-reset" style="background:none;border:1px solid rgba(159,180,216,.5);color:${STEEL}">reset</button>
    </div>
    <div class="spr-out" id="spr-vn-note"></div>
    <p class="it-caveat">This is the whole idea von Neumann's 1945 report turned into a blueprint: instructions are just numbers in the same store as the data. Change software = change memory, not cables. That is the leap from ENIAC to your laptop.</p>
  </section>`;
}

function selfmodLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · PROGRAM = DATA</div>
    <h3>A program that edits its own code</h3>
    <p class="it-lab-intro">Because instructions live in writable memory as ordinary numbers, a running program can rewrite its own instructions. Load the self-modifying program and step: watch instruction 2 reach back and change the operand of instruction 0 (highlighted). Startling — and the seed of compilers, interpreters, and code that writes code.</p>
    <div class="it-lab-actions">
      <button class="it-send" id="spr-sm-load">load the self-modifying program</button>
      <button class="it-send" id="spr-sm-step">▶ step</button>
      <button class="it-send" id="spr-sm-run">run</button>
    </div>
    <div class="spr-regs">
      <div class="spr-reg"><span class="l">PC</span><span class="v" id="spr-sm-pc">0</span></div>
      <div class="spr-reg"><span class="l">ACC</span><span class="v" id="spr-sm-acc">0</span></div>
    </div>
    <div class="spr-mem" id="spr-sm-mem"></div>
    <div class="spr-out" id="spr-sm-note"></div>
    <p class="it-caveat">The same move — feed a program its own description — is the engine of compilers AND of Turing's Halting Problem. The power to treat code as data and the impossibility of predicting arbitrary code are two faces of one coin.</p>
  </section>`;
}

function nandLabHTML() {
  const chips = Object.keys(NAND_GATES).map((k, i) =>
    `<button class="spr-chip${i===0?" on":""}" data-ng="${k}">${k}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · THE TRANSISTOR · NAND IS ENOUGH</div>
    <h3>Every gate from one part</h3>
    <p class="it-lab-intro">A transistor is a voltage-controlled switch — Shannon's truth-value, shrunk. Wire a few into a NAND, and NAND alone is <em>functionally complete</em>: every Boolean function, and therefore every computation, can be built from copies of it. Pick a gate, flip the inputs, and see it constructed purely from NANDs.</p>
    <div class="spr-chips" id="spr-ng">${chips}</div>
    <p class="spr-desc" id="spr-ng-build"></p>
    <div class="spr-regs" style="align-items:center">
      <span>a</span><span class="spr-sw" id="spr-ng-a">0</span>
      <span id="spr-ng-bwrap">b <span class="spr-sw" id="spr-ng-b">0</span></span>
      <span style="opacity:.6">→</span>
      <span class="spr-lamp" id="spr-ng-lamp">0</span>
    </div>
    <div class="spr-out" id="spr-ng-truth"></div>
    <p class="it-caveat">Tens of billions of these switches sit on a modern chip, each one a 1947 Bell Labs invention shrunk to a few atoms. It is the map's clearest case of pure physics becoming the physical basis of everything.</p>
  </section>`;
}

function yieldLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · THE INTEGRATED CIRCUIT · YIELD</div>
    <h3>Why bigger chips are a gamble</h3>
    <p class="it-lab-intro">The IC prints a whole circuit on one slice of silicon — but random defects mean not every die works. Yield falls exponentially with die area (yield ≈ e<sup>−A·D</sup>). Shrink the die or clean up defects and good chips soar; grow the die and yield collapses. Play with both and watch the wafer.</p>
    <div class="it-control">
      <label for="spr-yield-area"><span>die area (mm²)</span><output id="spr-yield-areav">100</output></label>
      <input id="spr-yield-area" type="range" min="10" max="600" step="10" value="100">
    </div>
    <div class="it-control">
      <label for="spr-yield-def"><span>defect density (per cm²)</span><output id="spr-yield-defv">0.5</output></label>
      <input id="spr-yield-def" type="range" min="0.1" max="3" step="0.1" value="0.5">
    </div>
    <div class="spr-wafer" id="spr-yield-wafer"></div>
    <div class="spr-out" id="spr-yield-out"></div>
    <p class="it-caveat">This single curve drives the whole industry: it is why chips are shrunk relentlessly, why defect control is worth billions, and why a fab is one of the most expensive objects humans build.</p>
  </section>`;
}

function mooreLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 5 · MOORE'S LAW · THE EXPONENTIAL</div>
    <h3>Double it, and double it again</h3>
    <p class="it-lab-intro">In 1965 Moore predicted transistor counts would double roughly every two years. Set a start (the Intel 4004 had 2,300 transistors in 1971) and a target year, and watch the exponential run away — from thousands to tens of billions. Exponentials are almost impossible to feel until you drive one.</p>
    <div class="it-control">
      <label for="spr-moore-year"><span>target year</span><output id="spr-moore-yearv">2023</output></label>
      <input id="spr-moore-year" type="range" min="1971" max="2035" step="1" value="2023">
    </div>
    <div class="it-control">
      <label for="spr-moore-dbl"><span>doubling period (years)</span><output id="spr-moore-dblv">2</output></label>
      <input id="spr-moore-dbl" type="range" min="1" max="3" step="0.5" value="2">
    </div>
    <div class="spr-out" id="spr-moore-out"></div>
    <p class="it-caveat">Never a law of physics — an economic roadmap the whole industry planned itself around, so the prophecy delivered itself. Now it's bending, and that slowdown is exactly why the next field exists: chips designed around the workload, not general speed.</p>
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

// ---- Lab 1: von Neumann machine ----
const VN = { key: "countdown", run: null, step: 0 };
function memWord(w, addr, isPC, edited) {
  const data = (w.val !== undefined);
  const body = data ? ("DATA  " + w.val) : (OPS[w.op|0] + (w.arg!==undefined && (w.op>=1&&w.op<=6||w.op===8) ? " " + w.arg : ""));
  return `<div class="spr-word${isPC?" pc":""}${data?" data":""}${edited?" edited":""}">`
    + `<span class="adr">${addr}</span><span class="kind">${data?"data":"instr"}</span><span>${body}</span></div>`;
}
function vnDraw(prevMem) {
  const fr = VN.run.trace[Math.min(VN.step, VN.run.trace.length - 1)];
  $("spr-vn-pc").textContent = fr.PC;
  $("spr-vn-acc").textContent = fr.ACC;
  $("spr-vn-outv").textContent = fr.out.length ? fr.out.join(" ") : "–";
  $("spr-vn-mem").innerHTML = fr.mem.map((w, i) => {
    const edited = prevMem && JSON.stringify(prevMem[i]) !== JSON.stringify(w);
    return memWord(w, i, i === fr.PC && VN.step < VN.run.trace.length - 1, edited);
  }).join("");
  $("spr-vn-note").innerHTML = "step " + VN.step + ": <span class='hot'>" + fr.note + "</span>"
    + (VN.run.trace[VN.step] && VN.step === VN.run.trace.length - 1 && VN.run.halted ? "  — halted." : "");
}
function vnReset() { VN.run = vnRun(VN.key); VN.step = 0; $("spr-vn-desc").textContent = VN_PROGRAMS[VN.key].note; vnDraw(null); }

// ---- Lab 2: self-modifying (reuses vnRun on 'selfmod') ----
const SM = { run: null, step: 0 };
function smWord(w, addr, isPC, edited) {
  const data = (w.val !== undefined);
  const body = data ? ("DATA  " + w.val) : (OPS[w.op|0] + (w.arg!==undefined && (w.op>=1&&w.op<=6||w.op===8) ? " " + w.arg : ""));
  return `<div class="spr-word${isPC?" pc":""}${data?" data":""}${edited?" edited":""}">`
    + `<span class="adr">${addr}</span><span class="kind">${data?"data":"instr"}</span><span>${body}</span></div>`;
}
function smDraw() {
  if (!SM.run) { $("spr-sm-mem").innerHTML = "<span style='opacity:.6'>press load.</span>"; return; }
  const fr = SM.run.trace[Math.min(SM.step, SM.run.trace.length - 1)];
  const prev = SM.step > 0 ? SM.run.trace[SM.step - 1].mem : null;
  $("spr-sm-pc").textContent = fr.PC; $("spr-sm-acc").textContent = fr.ACC;
  $("spr-sm-mem").innerHTML = fr.mem.map((w, i) => {
    const edited = prev && JSON.stringify(prev[i]) !== JSON.stringify(w);
    return smWord(w, i, i === fr.PC && SM.step < SM.run.trace.length - 1, edited);
  }).join("");
  $("spr-sm-note").innerHTML = "step " + SM.step + ": <span class='amp'>" + fr.note + "</span>";
}

// ---- Lab 3: NAND gates ----
const NG = { key: "NOT", a: 0, b: 0 };
function ngDraw() {
  const g = NAND_GATES[NG.key];
  $("spr-ng-build").textContent = NG.key + " built from " + g.build + ".";
  $("spr-ng-bwrap").style.display = g.arity === 1 ? "none" : "";
  $("spr-ng-a").classList.toggle("on", !!NG.a); $("spr-ng-a").textContent = NG.a;
  $("spr-ng-b").classList.toggle("on", !!NG.b); $("spr-ng-b").textContent = NG.b;
  const out = g.arity === 1 ? g.f(NG.a) : g.f(NG.a, NG.b);
  const lamp = $("spr-ng-lamp"); lamp.classList.toggle("lit", !!out); lamp.textContent = out;
  let t;
  if (g.arity === 1) {
    t = "a │ " + NG.key + "\n───┼────\n";
    [0,1].forEach(a => { const o = g.f(a); t += (a===NG.a?"▸":" ") + a + " │ " + (a===NG.a?"<span class='hot'>"+o+"</span>":o) + "\n"; });
  } else {
    t = "a b │ " + NG.key + "\n──────┼─────\n";
    [[0,0],[0,1],[1,0],[1,1]].forEach(([a,b]) => { const o = g.f(a,b); const cur=(a===NG.a&&b===NG.b); t += (cur?"▸":" ") + a + " " + b + " │  " + (cur?"<span class='hot'>"+o+"</span>":o) + "\n"; });
  }
  $("spr-ng-truth").innerHTML = t;
}

// ---- Lab 4: yield ----
function yieldDraw() {
  const area = +$("spr-yield-area").value;         // mm^2
  const def = +$("spr-yield-def").value;           // per cm^2
  const areaCm2 = area / 100;                       // mm^2 → cm^2
  const r = waferYield(areaCm2, def, 300);          // 300mm wafer
  $("spr-yield-areav").textContent = area;
  $("spr-yield-defv").textContent = def.toFixed(1);
  // draw a representative grid (cap dies shown)
  const shown = Math.min(r.grossDies, 120);
  const cols = Math.ceil(Math.sqrt(shown * 1.3));
  const goodShown = Math.round(shown * r.y);
  let cells = "";
  // build a roughly circular mask
  const rows = Math.ceil(shown / cols);
  let placed = 0, good = 0;
  const grid = $("spr-yield-wafer");
  grid.style.gridTemplateColumns = "repeat(" + cols + ", .85rem)";
  const cx = (cols-1)/2, cy = (rows-1)/2, rad = Math.min(cx, cy) + 0.6;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const inCircle = Math.hypot(x - cx, y - cy) <= rad;
    if (!inCircle) { cells += `<div class="spr-die off"></div>`; continue; }
    const isGood = good < goodShown;
    if (isGood) good++;
    placed++;
    cells += `<div class="spr-die ${isGood?"good":"bad"}"></div>`;
  }
  grid.innerHTML = cells;
  $("spr-yield-out").innerHTML =
    "yield ≈ e^(−A·D) = e^(−" + areaCm2.toFixed(2) + "·" + def.toFixed(1) + ") = <span class='hot'>"
    + (r.y*100).toFixed(1) + "%</span>\non a 300mm wafer: ~" + r.grossDies + " candidate dies → <span class='hot'>~"
    + r.goodDies + " good</span> chips.";
}

// ---- Lab 5: Moore's law ----
function mooreDraw() {
  const yr = +$("spr-moore-year").value;
  const dbl = +$("spr-moore-dbl").value;
  $("spr-moore-yearv").textContent = yr;
  $("spr-moore-dblv").textContent = dbl;
  const r = mooreCount(2300, 1971, yr, dbl);
  const c = r.count;
  const human = c >= 1e9 ? (c/1e9).toFixed(1) + " billion" : c >= 1e6 ? (c/1e6).toFixed(1) + " million" : Math.round(c).toLocaleString();
  $("spr-moore-out").innerHTML =
    "start: Intel 4004, 2,300 transistors, 1971.\n" + (yr-1971) + " years = <span class='hot'>"
    + r.doublings.toFixed(1) + "</span> doublings.\npredicted transistors/chip ≈ <span class='hot'>" + human + "</span>."
    + (yr >= 2020 ? "\n\n(reality check: high-end chips in the 2020s do hold tens of billions — the trend held remarkably well, and is only now bending.)" : "");
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
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · PROGRAM BECOMES DATA · ABOUT 45 MIN</div>
    <p class="it-hook">ENIAC took days to reprogram by rewiring. The fix — put the program in the same memory as the data — was so total that your laptop still works exactly this way, only with tens of billions of transistors instead of tubes.</p>
    <p class="it-intro">This field is where Turing's Universal Machine became an engineering blueprint, and where the physical substrate to run it — transistor, integrated circuit, Moore's law — arrived to make it explode. Two threads meet here and never part: the logical architecture (program stored as data, fetched and executed in a loop) has barely changed since 1945, while the transistor budget grew a billion-fold. Five labs below: run a real stored program on a von Neumann machine, watch a program edit its own code, build every logic gate from a single NAND, play the integrated-circuit yield gamble, and drive Moore's-law exponential yourself.</p>
    <div class="it-timeline" aria-label="Stored-program era timeline">
      <div class="it-moment"><b>1945</b><span>EDVAC report</span></div>
      <div class="it-moment"><b>1947</b><span>transistor</span></div>
      <div class="it-moment"><b>1949</b><span>EDSAC runs</span></div>
      <div class="it-moment"><b>1958</b><span>integrated circuit</span></div>
      <div class="it-moment"><b>1965</b><span>Moore's law</span></div>
    </div>

    ${vnLabHTML()}
    ${selfmodLabHTML()}
    ${nandLabHTML()}
    ${yieldLabHTML()}
    ${mooreLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>Step the countdown program and watch the PC jump backward at the JMP — that backward jump is a loop, the thing ENIAC needed rewiring to do.</li>
      <li>In the self-modifying lab, keep your eye on instruction 0 while you step. Watch its operand change because instruction 2 wrote to it. Code editing code, live.</li>
      <li>Build XOR in the NAND lab and count: it takes four NANDs. Convince yourself every gate here comes from that one part — that's "functionally complete."</li>
      <li>In the yield lab, set defect density low and grow the die to 600 mm². Watch yield collapse. This one exponential is why chips are shrunk relentlessly.</li>
      <li>Set Moore's law to 2023 with a 2-year doubling. Compare the prediction to reality (tens of billions). Then set it to 2035 and feel the exponential.</li>
      <li>Notice the through-line: the von Neumann machine in Lab 1 doesn't change as transistors multiply. Stable architecture, exploding implementation — the whole era in one sentence.</li>
    </ol></div>

    <h3 class="it-section-title">Primary sources, patents &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1: von Neumann machine
  vnReset();
  module.querySelectorAll("#spr-vn-prog [data-prog]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#spr-vn-prog [data-prog]").forEach(x => x.classList.toggle("on", x === b));
      VN.key = b.dataset.prog; vnReset();
    }));
  $("spr-vn-step").addEventListener("click", () => {
    if (VN.step < VN.run.trace.length - 1) { const prev = VN.run.trace[VN.step].mem; VN.step++; vnDraw(prev); }
  });
  $("spr-vn-run").addEventListener("click", () => { VN.step = VN.run.trace.length - 1; vnDraw(null); });
  $("spr-vn-reset").addEventListener("click", vnReset);

  // Lab 2: self-modifying
  smDraw();
  $("spr-sm-load").addEventListener("click", () => { SM.run = vnRun("selfmod"); SM.step = 0; smDraw(); });
  $("spr-sm-step").addEventListener("click", () => { if (SM.run && SM.step < SM.run.trace.length - 1) { SM.step++; smDraw(); } });
  $("spr-sm-run").addEventListener("click", () => { if (SM.run) { SM.step = SM.run.trace.length - 1; smDraw(); } });

  // Lab 3: NAND gates
  ngDraw();
  module.querySelectorAll("#spr-ng [data-ng]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#spr-ng [data-ng]").forEach(x => x.classList.toggle("on", x === b));
      NG.key = b.dataset.ng; ngDraw();
    }));
  $("spr-ng-a").addEventListener("click", () => { NG.a ^= 1; ngDraw(); });
  $("spr-ng-b").addEventListener("click", () => { NG.b ^= 1; ngDraw(); });

  // Lab 4: yield
  yieldDraw();
  $("spr-yield-area").addEventListener("input", yieldDraw);
  $("spr-yield-def").addEventListener("input", yieldDraw);

  // Lab 5: Moore's law
  mooreDraw();
  $("spr-moore-year").addEventListener("input", mooreDraw);
  $("spr-moore-dbl").addEventListener("input", mooreDraw);
}

window.openStoredProgramExperience = buildExperience;

// test hook (parity with other guides)
window.__sprTest = { vnRun, VN_PROGRAMS, OPS, nand, notN, andN, orN, xorN, NAND_GATES,
  waferYield, mooreCount };
})();
