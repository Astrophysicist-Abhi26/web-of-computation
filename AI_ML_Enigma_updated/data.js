// ============================================================
// THE WEB OF COMPUTATION — data layer (edit me, not app.js)
// Status: found=🏛 foundational, fire=🔥 frontier, work=⚙️ workhorse,
//         obs=🪦 obsolete, rev=🧟 revived
// Every field/topic: y = birth year (drives the time scrubber)
// ============================================================

const ERAS = [
  { from: 1822, to: 1935, name: "The Mechanical Dream",   sky1: "#171009", sky2: "#3a2a12", tint: "#c9a15a" },
  { from: 1936, to: 1949, name: "Logic Becomes Machine",  sky1: "#04120b", sky2: "#0b2e1c", tint: "#5dff9e" },
  { from: 1950, to: 1973, name: "The Mainframe Age",      sky1: "#0a0f1c", sky2: "#17233d", tint: "#9fb4d8" },
  { from: 1974, to: 1980, name: "AI Winter I ❄",          sky1: "#0b1220", sky2: "#1c2b45", tint: "#cfe3ff", frost: true },
  { from: 1981, to: 1986, name: "The Micro Era",          sky1: "#0d0a1c", sky2: "#221a44", tint: "#a78bfa" },
  { from: 1987, to: 1993, name: "AI Winter II ❄",         sky1: "#0b1220", sky2: "#1c2b45", tint: "#cfe3ff", frost: true },
  { from: 1994, to: 2011, name: "The Networked World",    sky1: "#0a0a1e", sky2: "#1d1650", tint: "#818cf8" },
  { from: 2012, to: 2026, name: "The Deep Learning Era",  sky1: "#0e0618", sky2: "#2a0f45", tint: "#f5c451" }
];

// -------- DOMAINS (positions in a 1600×1000 sky) --------
const DOMAINS = [
  { id: "found", name: "Foundations of Computation", x: 300,  y: 260, r: 95, hue: 210, y0: 1847,
    blurb: "The pen-and-paper continent. Everything here was proved before it was built — logic, computability, complexity. Gödel showed the limits of formal systems; Turing turned that insight into the definition of an algorithm." },
  { id: "hard",  name: "Hardware & Architecture", x: 700, y: 150, r: 90, hue: 35, y0: 1822,
    blurb: "Where theorems grow bodies. Substrate-independence made flesh five times over: gears → relays → vacuum tubes → transistors → GPUs. Babbage began it; Shannon's 1937 thesis wired logic to electricity; CUDA made deep learning physically possible." },
  { id: "algo",  name: "Algorithms & Data Structures", x: 300, y: 620, r: 88, hue: 175, y0: 1894,
    blurb: "The verbs and nouns of programming. Divide & conquer, dynamic programming, hashing, trees. Its quietest node — matrix multiplication — is the atom every neural network is made of." },
  { id: "lang",  name: "Languages & Systems", x: 680, y: 480, r: 85, hue: 265, y0: 1952,
    blurb: "How humans instruct machines. From Hopper's first compiler to LISP, C, Unix and Python. The Curry–Howard correspondence hides here: proofs ARE programs — the deepest bridge back to the mathematics map." },
  { id: "info",  name: "Information & Cryptography", x: 1080, y: 200, r: 88, hue: 150, y0: 1918,
    blurb: "Shannon's continent — and Turing's day job. Entropy, bits, channel capacity, and the codes that won a war. Cross-entropy, its export, is the loss function that trains every modern language model." },
  { id: "data",  name: "Data Science & Databases", x: 1120, y: 560, r: 85, hue: 195, y0: 1763,
    blurb: "The overlapping ellipse: statistics ∩ computing ∩ domain knowledge. Bayes (1763) and least squares (1805) are the oldest nodes on the entire map — machine learning's ground floor was poured before Babbage's engine." },
  { id: "ai",    name: "Artificial Intelligence (symbolic)", x: 620, y: 800, r: 90, hue: 0, y0: 1950,
    blurb: "The dream, its winters, and the half history buried. Turing's 1950 question, the 1956 Dartmouth christening, expert systems' rise and collapse. Search and planning survive inside every game engine — and symbolic ideas are sneaking back into LLM agents." },
  { id: "ml",    name: "Machine Learning & Deep Learning", x: 1180, y: 830, r: 100, hue: 315, y0: 1943,
    blurb: "The dream realized — statistically, not logically. From the McCulloch–Pitts neuron through two winters to AlexNet's big bang, the Transformer, and the model rendering this map. Sutton's Bitter Lesson is carved on the border: general methods + compute win." }
];

// -------- CONTAINMENT SHELLS (the §0 answer, rendered) --------
const SHELLS = {
  cx: 820, cy: 560,
  rings: [
    { label: "ARTIFICIAL INTELLIGENCE", rx: 460, ry: 210, o: 0.10 },
    { label: "MACHINE LEARNING",        rx: 340, ry: 150, o: 0.14 },
    { label: "NEURAL NETWORKS",         rx: 230, ry: 100, o: 0.18 },
    { label: "DEEP LEARNING",           rx: 130, ry: 58,  o: 0.24 }
  ]
};

// -------- GOLD BRIDGES (mediating concepts between continents) --------
const BRIDGES = [
  { a: "found", b: "hard", label: "Shannon 1937: Boolean algebra = relay circuits", y: 1937 },
  { a: "found", b: "ml",   label: "McCulloch–Pitts 1943: neurons as logic gates", y: 1943 },
  { a: "found", b: "lang", label: "λ-calculus → LISP; Curry–Howard: proofs = programs", y: 1958 },
  { a: "found", b: "ai",   label: "Turing 1950: the Imitation Game", y: 1950 },
  { a: "hard",  b: "ml",   label: "CUDA 2007 → AlexNet 2012: hardware ignites theory", y: 2007 },
  { a: "info",  b: "ml",   label: "Entropy → cross-entropy: the loss of the modern world", y: 1948 },
  { a: "info",  b: "found",label: "Kolmogorov complexity: shortest programs", y: 1965 },
  { a: "algo",  b: "ml",   label: "Bellman 1953: dynamic programming → reinforcement learning", y: 1953 },
  { a: "algo",  b: "data", label: "B-trees inside every database index", y: 1972 },
  { a: "data",  b: "ml",   label: "Maximum likelihood ⇒ every loss function", y: 1922 },
  { a: "ai",    b: "ml",   label: "Deep Blue (search) vs AlphaGo (learning): the handover", y: 2016 },
  { a: "lang",  b: "ml",   label: "Python + autodiff: the accidental language of AI", y: 1991 },
  { a: "info",  b: "data", label: "Vector databases: retrieval meets embeddings", y: 2019 }
];

// -------- CONTROVERSY EDGES (red lightning) --------
const CONTROVERSIES = [
  { a: "ai", b: "ml", label: "Minsky vs Rosenblatt, 1969: XOR and the first winter", y: 1969 },
  { a: "found", b: "ml", label: "Chomsky vs LLMs: is language learnable from data alone?", y: 2023 }
];

// -------- FIELDS & TOPICS --------
// s: found|fire|work|obs|rev   y: birth year   who: discoverer
const FIELDS = {
found: [
  { id:"logic", name:"Mathematical Logic", y:1847, s:"found",
    d:"Logic as algebra — the alphabet of circuits. Inherited from the mathematics map; this node is the wormhole between the two webs.",
    topics:[
      {n:"Boolean algebra", y:1847, who:"George Boole", s:"found", d:"True/false as algebra. Every chip is applied Boole."},
      {n:"Predicate logic", y:1879, who:"Gottlob Frege", s:"found", d:"Quantifiers and relations — the language proofs are written in."},
      {n:"Gödel incompleteness", y:1931, who:"Kurt Gödel", s:"found", d:"Consistent formal systems can't prove all truths. Direct ancestor of undecidability."},
      {n:"λ-calculus", y:1932, who:"Alonzo Church", s:"found", d:"Computation as function rewriting. Ancestor of every functional language."}
    ]},
  { id:"computability", name:"Computability Theory", y:1936, s:"found",
    d:"What can be computed at all. Turing's 1936 paper defined 'algorithm' and proved the first impossible problem in the same stroke.",
    topics:[
      {n:"Turing machine", y:1936, who:"Alan Turing", s:"found", d:"Tape + head + states: the mathematical definition of mechanical procedure."},
      {n:"Universal Turing machine", y:1936, who:"Alan Turing", s:"found", d:"One machine simulates all others — the theorem that justifies software."},
      {n:"Halting problem", y:1936, who:"Alan Turing", s:"found", d:"No algorithm decides whether programs halt. The first provably unsolvable problem."},
      {n:"Church–Turing thesis", y:1936, who:"Church & Turing", s:"found", d:"Everything effectively computable is Turing-computable. Substrate independence."}
    ]},
  { id:"automata", name:"Automata & Formal Languages", y:1943, s:"work",
    d:"Machines ordered by power, languages ordered by grammar. Born in logic and linguistics; lives inside every compiler and regex.",
    topics:[
      {n:"McCulloch–Pitts neuron", y:1943, who:"McCulloch & Pitts", s:"rev", d:"Neurons as boolean gates — a LOGIC paper that seeded neural networks."},
      {n:"Finite automata / regex", y:1951, who:"Stephen Kleene", s:"work", d:"The simplest machines; the pattern-matchers in your shell."},
      {n:"Chomsky hierarchy", y:1956, who:"Noam Chomsky", s:"found", d:"Regular ⊂ context-free ⊂ context-sensitive ⊂ r.e. Born in linguistics, became CS bedrock — and LLMs reopened the fight."}
    ]},
  { id:"complexity", name:"Complexity Theory", y:1971, s:"fire",
    d:"Not what CAN be computed but what can be computed AFFORDABLY. Home of the field's biggest open problem.",
    topics:[
      {n:"P vs NP", y:1971, who:"Cook & Levin", s:"fire", d:"Is verifying as hard as solving? $1M Clay prize, still open."},
      {n:"NP-completeness", y:1972, who:"Richard Karp", s:"found", d:"21 problems, one fate: solve any, solve all."},
      {n:"Randomized complexity", y:1977, who:"Solovay–Strassen era", s:"work", d:"Coin flips as a computational resource."}
    ]},
  { id:"quantum", name:"Quantum Computation", y:1982, s:"fire",
    d:"Computing with superposition and entanglement. Feynman's proposal, Shor's earthquake.",
    topics:[
      {n:"Qubits & gates", y:1985, who:"David Deutsch", s:"fire", d:"The quantum Turing machine."},
      {n:"Shor's algorithm", y:1994, who:"Peter Shor", s:"fire", d:"Factoring in polynomial time — the reason post-quantum crypto exists."},
      {n:"Quantum error correction", y:1995, who:"Shor & Steane", s:"fire", d:"Protecting fragile qubits; the engineering frontier."}
    ]}
],
hard: [
  { id:"mech", name:"The Mechanical Era", y:1822, s:"obs",
    d:"Gloriously obsolete. Babbage designed a Turing-complete computer in brass, a century early; Lovelace wrote its first program and saw, before anyone, that it could weave symbols, not just numbers.",
    topics:[
      {n:"Difference Engine", y:1822, who:"Charles Babbage", s:"obs", d:"Polynomial tables by finite differences. Finally built in 1991 — it works."},
      {n:"Analytical Engine", y:1837, who:"Charles Babbage", s:"obs", d:"Mill (CPU), store (memory), punched cards (I/O). Never built; fully general on paper."},
      {n:"Note G — the first program", y:1843, who:"Ada Lovelace", s:"found", d:"Bernoulli numbers on the Analytical Engine — and the 'Lovelace objection' Turing would rebut 107 years later."}
    ]},
  { id:"wartime", name:"Electromechanical & Wartime", y:1937, s:"obs",
    d:"Logic gets wired. Shannon's thesis is the translation dictionary between mathematics and electricity; the Bombe and Colossus are deduction at machine speed.",
    topics:[
      {n:"Shannon's master's thesis", y:1937, who:"Claude Shannon", s:"found", d:"Boolean algebra = switching circuits. Often called the most important master's thesis ever written."},
      {n:"Zuse Z3", y:1941, who:"Konrad Zuse", s:"obs", d:"First working programmable computer — relays, in Berlin."},
      {n:"The Bombe", y:1940, who:"Turing & Welchman", s:"obs", d:"Electromechanical Enigma-hypothesis eliminator, built on Rejewski's Polish bomba (1938)."},
      {n:"Colossus", y:1943, who:"Tommy Flowers", s:"obs", d:"First electronic digital computer (Lorenz cipher). Secret until the 1970s — it warped the history books."},
      {n:"ENIAC", y:1945, who:"Eckert & Mauchly", s:"obs", d:"Programmed by six women history nearly erased."}
    ]},
  { id:"stored", name:"The Stored-Program Revolution", y:1945, s:"found",
    d:"The universal Turing machine as an engineering blueprint. Program stored as data — your laptop still works this way.",
    topics:[
      {n:"von Neumann architecture", y:1945, who:"John von Neumann", s:"found", d:"CPU + memory + program-as-data. The EDVAC report."},
      {n:"The transistor", y:1947, who:"Bardeen, Brattain, Shockley", s:"found", d:"Bell Labs. The atom of the information age."},
      {n:"Integrated circuit", y:1958, who:"Kilby & Noyce", s:"found", d:"Whole circuits on one chip."},
      {n:"Moore's law", y:1965, who:"Gordon Moore", s:"fire", d:"Transistor count doubles ~2 years — now bending, which is WHY AI accelerators exist."}
    ]},
  { id:"aihw", name:"Modern & AI-Era Hardware", y:1971, s:"fire",
    d:"Graphics chips accidentally perfect for matrix math. No CUDA, no deep-learning revolution.",
    topics:[
      {n:"Microprocessor (Intel 4004)", y:1971, who:"Federico Faggin et al.", s:"found", d:"A CPU on a chip."},
      {n:"GPU + CUDA", y:2007, who:"NVIDIA", s:"fire", d:"General-purpose computing on graphics cards. The hardware that ignited AlexNet — and trains your PIKANs."},
      {n:"TPUs & accelerators", y:2016, who:"Google", s:"fire", d:"Silicon designed around matrix multiplication."}
    ]}
],
algo: [
  { id:"paradigms", name:"Design Paradigms", y:1945, s:"found",
    d:"The recurring shapes of good algorithms: split, remember, choose greedily, or flip coins.",
    topics:[
      {n:"Divide & conquer", y:1945, who:"von Neumann (mergesort)", s:"found", d:"Split, solve, merge. The FFT (Cooley–Tukey 1965; Gauss 1805!) is its masterpiece."},
      {n:"Dynamic programming", y:1953, who:"Richard Bellman", s:"found", d:"Named to sound harmless to a research-hating Defense Secretary. Ancestor of RL's Bellman equation."},
      {n:"Dijkstra / A* search", y:1956, who:"Edsger Dijkstra; Hart et al.", s:"work", d:"Shortest paths; A* still runs game AI."},
      {n:"Monte Carlo methods", y:1946, who:"Ulam & von Neumann", s:"work", d:"Randomness as a solver — your MCMC ancestry."}
    ]},
  { id:"structs", name:"Data Structures", y:1953, s:"work",
    d:"How memory is shaped. A hash table hides in every Python dict — and in every attention KV-cache.",
    topics:[
      {n:"Hash tables", y:1953, who:"IBM (Luhn era)", s:"work", d:"O(1) lookup by scrambling keys."},
      {n:"B-trees", y:1972, who:"Bayer & McCreight", s:"work", d:"Inside virtually every database index."},
      {n:"Heaps & priority queues", y:1964, who:"J.W.J. Williams", s:"work", d:"Always know the smallest thing."}
    ]},
  { id:"analysis", name:"Analysis of Algorithms", y:1894, s:"found",
    d:"Counting cost before running. Big-O came from number theory; Knuth made it the field's grammar.",
    topics:[
      {n:"Big-O notation", y:1894, who:"Bachmann → Knuth", s:"found", d:"Growth rates as the honest currency of speed."},
      {n:"The Art of Computer Programming", y:1968, who:"Donald Knuth", s:"found", d:"Still being written. Knuth also built TeX — which typesets your papers."},
      {n:"Numerical linear algebra (BLAS)", y:1979, who:"Lawson et al.", s:"work", d:"Matrix multiply: the invisible atom of ALL deep learning."}
    ]}
],
lang: [
  { id:"langs", name:"Languages & Paradigms", y:1957, s:"work",
    d:"From Fortran's formulas to Python's glue. LISP made λ-calculus runnable and its ideas colonized everything.",
    topics:[
      {n:"Fortran", y:1957, who:"John Backus", s:"work", d:"First high-level language; scientific computing's mother tongue."},
      {n:"LISP", y:1958, who:"John McCarthy", s:"rev", d:"Code as data, garbage collection, the REPL. THE AI language for 30 years."},
      {n:"C", y:1972, who:"Dennis Ritchie", s:"found", d:"The language operating systems speak."},
      {n:"Python", y:1991, who:"Guido van Rossum", s:"fire", d:"The accidental language of AI: readable glue over C and CUDA."}
    ]},
  { id:"compilers", name:"Compilers & Type Theory", y:1952, s:"found",
    d:"Hopper's insight: program for people, translate for machines. Underneath: Curry–Howard, where proofs and programs are the same thing.",
    topics:[
      {n:"The first compiler (A-0)", y:1952, who:"Grace Hopper", s:"found", d:"'Programming for people, not machines.' Also popularized 'debugging' — an actual moth, 1947."},
      {n:"Curry–Howard correspondence", y:1969, who:"Curry & Howard", s:"found", d:"Proofs ARE programs. The deepest bridge to the mathematics map."},
      {n:"Proof assistants (Lean, Coq)", y:1989, who:"Coquand; de Moura", s:"fire", d:"Lean is digesting research mathematics right now. AI + Lean is a live frontier."}
    ]},
  { id:"systems", name:"Operating & Distributed Systems", y:1969, s:"work",
    d:"Unix begat Linux begat your GPU workstation, every server, and Android.",
    topics:[
      {n:"Unix", y:1969, who:"Thompson & Ritchie", s:"found", d:"Small tools, composed. Its philosophy outlived its hardware."},
      {n:"Linux + git", y:1991, who:"Linus Torvalds", s:"work", d:"One person, two pillars of modern infrastructure (git: 2005)."},
      {n:"MapReduce → Spark", y:2004, who:"Dean & Ghemawat", s:"work", d:"The big-data era's engine, then its successor."}
    ]}
],
info: [
  { id:"infotheory", name:"Information Theory", y:1948, s:"found",
    d:"Entropy, bits, channel capacity — arguably the most important single paper of the 20th century. Its export, cross-entropy, trains every LLM.",
    topics:[
      {n:"Entropy & the bit", y:1948, who:"Claude Shannon", s:"found", d:"Information as resolved uncertainty, measured in bits."},
      {n:"KL divergence / cross-entropy", y:1951, who:"Kullback & Leibler", s:"found", d:"The loss function of the modern world; regularizes RLHF too."},
      {n:"Kolmogorov complexity", y:1965, who:"Solomonoff, Kolmogorov, Chaitin", s:"fire", d:"Shortest-program length. Solomonoff induction is the ideal ML approximates."},
      {n:"Error-correcting codes", y:1950, who:"Richard Hamming", s:"work", d:"In QR codes, spacecraft, and quantum error correction."}
    ]},
  { id:"classic-crypto", name:"Classical Cryptography", y:1918, s:"obs",
    d:"Enigma and its breaking: permutation-group theory won a war. Turing's day job, and the map's best proof that pure math turns real.",
    topics:[
      {n:"Enigma", y:1918, who:"Arthur Scherbius", s:"obs", d:"Rotor cipher; 10^114 keyspace, defeated by structure not brute force."},
      {n:"Breaking Enigma", y:1932, who:"Rejewski → Turing–Welchman", s:"obs", d:"Group theory (1932, Poland) + the Bombe (1940, Bletchley)."},
      {n:"Perfect secrecy", y:1949, who:"Claude Shannon", s:"found", d:"The one-time pad is unbreakable — provably."}
    ]},
  { id:"modern-crypto", name:"Modern Cryptography", y:1976, s:"work",
    d:"Security from number theory: Ramanujan's playground now guards your bank account.",
    topics:[
      {n:"Public-key cryptography", y:1976, who:"Diffie & Hellman", s:"found", d:"Agree on a secret in public. Changed everything."},
      {n:"RSA", y:1977, who:"Rivest, Shamir, Adleman", s:"work", d:"Factoring as a lock. Shor's algorithm is the storm on its horizon."},
      {n:"Zero-knowledge proofs", y:1985, who:"Goldwasser, Micali, Rackoff", s:"fire", d:"Prove you know, reveal nothing."},
      {n:"Post-quantum (lattices)", y:2005, who:"Regev (LWE)", s:"fire", d:"Cryptography rebuilt against quantum attack."}
    ]}
],
data: [
  { id:"databases", name:"Databases", y:1970, s:"work",
    d:"Codd's idea: data as relations, queried declaratively. SQL is immortal; vector databases are its newborn sibling.",
    topics:[
      {n:"Relational model", y:1970, who:"E. F. Codd", s:"found", d:"Tables + algebra = every serious datastore since."},
      {n:"SQL", y:1974, who:"Chamberlin & Boyce", s:"work", d:"Fifty years old and still hiring."},
      {n:"Vector databases", y:2019, who:"FAISS lineage", s:"fire", d:"Embedding search — RAG's memory."}
    ]},
  { id:"stats", name:"Statistics as Computation", y:1763, s:"found",
    d:"The oldest continent on the map. Bayes 1763 and least squares 1805 poured ML's ground floor before Babbage cut a gear.",
    topics:[
      {n:"Bayes' theorem", y:1763, who:"Thomas Bayes / Laplace", s:"found", d:"Belief updated by evidence — the spine of your entire SBI pipeline."},
      {n:"Least squares", y:1805, who:"Legendre / Gauss", s:"found", d:"The oldest machine learning: fit a function to data."},
      {n:"Maximum likelihood", y:1922, who:"R. A. Fisher", s:"found", d:"Training with cross-entropy IS maximum likelihood."},
      {n:"MCMC", y:1953, who:"Metropolis; Hastings 1970", s:"work", d:"Sampling the unsampleable — your asteroseismology past."},
      {n:"Conformal prediction", y:1999, who:"Vladimir Vovk", s:"fire", d:"Distribution-free coverage guarantees — your ZTF pipeline."}
    ]},
  { id:"practice", name:"Data Engineering & Practice", y:1977, s:"work",
    d:"The honest 80%: cleaning, pipelines, plots, reproducibility. 'Data science' is a 2008 job title stapled over old disciplines — the map says so honestly.",
    topics:[
      {n:"Exploratory data analysis", y:1977, who:"John Tukey", s:"found", d:"Look at the data before modeling it."},
      {n:"Notebooks (Jupyter)", y:2014, who:"Fernando Pérez lineage", s:"work", d:"Literate, runnable science."},
      {n:"'Data science' coined", y:2008, who:"Patil & Hammerbacher", s:"work", d:"A label for statistics ∩ computing ∩ domain knowledge."}
    ]}
],
ai: [
  { id:"founding", name:"Founding Documents", y:1950, s:"found",
    d:"Turing asked 'can machines think?' and replaced the question with an experiment. Six years later Dartmouth gave the dream its name.",
    topics:[
      {n:"Computing Machinery and Intelligence", y:1950, who:"Alan Turing", s:"found", d:"The Imitation Game; anticipates learning machines; rebuts Lovelace's objection."},
      {n:"Dartmouth workshop", y:1956, who:"McCarthy, Minsky, Shannon, Rochester", s:"found", d:"'Artificial intelligence' coined. The field's official birthday."},
      {n:"Logic Theorist", y:1956, who:"Newell & Simon", s:"obs", d:"Proved Principia theorems — symbolic AI's opening move."}
    ]},
  { id:"symbolic", name:"Symbolic AI / GOFAI", y:1956, s:"obs",
    d:"Intelligence as rules and search. Expert systems boomed, then the rule bottleneck broke them — but search still runs your chess engine, and symbolic ideas haunt LLM agents.",
    topics:[
      {n:"Minimax & alpha-beta", y:1956, who:"von Neumann lineage", s:"work", d:"Adversarial search; still inside game engines."},
      {n:"Expert systems (MYCIN)", y:1976, who:"Shortliffe et al.", s:"obs", d:"Rules from experts. Outperformed doctors, never deployed, then the market collapsed — Winter II."},
      {n:"Prolog", y:1972, who:"Alain Colmerauer", s:"obs", d:"Programs as logic. Flickers back in neurosymbolic work."},
      {n:"ELIZA", y:1966, who:"Joseph Weizenbaum", s:"obs", d:"Pattern-matching 'therapist'. People confided in it; its horrified creator wrote the first AI-ethics book — eerily current."}
    ]},
  { id:"milestones", name:"Classic Milestones", y:1997, s:"work",
    d:"The symbolic dream's high-water marks, before the statistical tide.",
    topics:[
      {n:"Deep Blue beats Kasparov", y:1997, who:"IBM (Hsu, Campbell)", s:"obs", d:"Search + hand-crafted evaluation, almost no learning."},
      {n:"Watson wins Jeopardy!", y:2011, who:"IBM", s:"obs", d:"Statistical NLP's bridge moment."}
    ]},
  { id:"decision", name:"Agents & Decision Theory", y:1944, s:"rev",
    d:"Von Neumann's game theory and Bellman's MDPs — dusty formalism that LLM agents are rediscovering right now.",
    topics:[
      {n:"Game theory", y:1944, who:"von Neumann & Morgenstern", s:"found", d:"Strategic interaction, formalized."},
      {n:"Markov decision processes", y:1957, who:"Richard Bellman", s:"found", d:"States, actions, rewards — the substrate of reinforcement learning."},
      {n:"Multi-agent systems", y:1986, who:"distributed-AI lineage", s:"rev", d:"Undead: LLM agent swarms are re-reading this literature."}
    ]}
],
ml: [
  { id:"prehistory", name:"Neural Prehistory", y:1943, s:"rev",
    d:"A logic paper, a psychology book, and a machine the NYT said would become conscious. Then Minsky's XOR proof froze it all for 15 years.",
    topics:[
      {n:"McCulloch–Pitts neuron", y:1943, who:"McCulloch & Pitts", s:"found", d:"Shared root with Foundations: neurons as boolean gates."},
      {n:"Hebbian learning", y:1949, who:"Donald Hebb", s:"found", d:"Fire together, wire together."},
      {n:"Perceptron", y:1958, who:"Frank Rosenblatt", s:"rev", d:"1958's hype reads exactly like 2026's. Rosenblatt died in 1971, before vindication."},
      {n:"Perceptrons (the book)", y:1969, who:"Minsky & Papert", s:"obs", d:"Single layers can't do XOR. True — and it froze the field anyway."},
      {n:"Backpropagation", y:1986, who:"Rumelhart, Hinton, Williams (roots: Werbos '74, Linnainmaa '70)", s:"found", d:"Reverse-mode chain rule. The algorithm that trains everything; attribution genuinely contested."}
    ]},
  { id:"classical", name:"Classical / Statistical ML", y:1951, s:"work",
    d:"The buzzword-disambiguation shelf: k-NN classifies by proximity, k-means clusters — they are NOT the same thing. Gradient boosting still wins Kaggle.",
    topics:[
      {n:"k-nearest neighbors", y:1951, who:"Fix & Hodges", s:"work", d:"CLASSIFICATION by proximity. Commonly confused with k-means."},
      {n:"k-means", y:1957, who:"Lloyd (published 1982!)", s:"work", d:"CLUSTERING into k groups. Commonly confused with k-NN."},
      {n:"Decision trees & random forests", y:1984, who:"Leo Breiman (forests 2001)", s:"work", d:"Bagged trees: still king of tabular data."},
      {n:"SVMs & kernel methods", y:1995, who:"Vapnik & Cortes", s:"obs", d:"Ruled 1995–2012, dethroned by deep nets. VC theory remains foundational."},
      {n:"Gradient boosting / XGBoost", y:2001, who:"Friedman; Chen 2014", s:"work", d:"Sequential error-fixing trees. Kaggle's perennial champion."},
      {n:"PCA / t-SNE / UMAP", y:1901, who:"Pearson; van der Maaten 2008", s:"work", d:"Seeing high dimensions. PCA is the map's second-oldest node."},
      {n:"Bias–variance → double descent", y:1992, who:"Geman et al.; Belkin 2019", s:"fire", d:"Deep nets break the classical U-curve — open theory frontier."}
    ]},
  { id:"paradigms-ml", name:"Learning Paradigms", y:1958, s:"found",
    d:"Supervised, unsupervised, reinforcement: paradigms that slice ACROSS ML, not nested sets. Self-supervision — labels manufactured from the data itself — is the trick that unlocked LLMs.",
    topics:[
      {n:"Supervised learning", y:1958, who:"perceptron lineage", s:"work", d:"Learn from labels; loss = MLE in disguise."},
      {n:"Unsupervised learning", y:1957, who:"clustering lineage", s:"work", d:"Structure without labels."},
      {n:"Reinforcement learning", y:1988, who:"Sutton (TD); Watkins (Q, 1989)", s:"fire", d:"Learn from reward. Bellman's equation, alive."},
      {n:"Self-supervised learning", y:2018, who:"BERT/SimCLR lineage", s:"fire", d:"Mask a word, predict it back. 'The cake' (LeCun) — the LLM unlock."}
    ]},
  { id:"deep", name:"Deep Learning Architectures", y:1980, s:"fire",
    d:"From Fukushima's Neocognitron to the Transformer. AlexNet 2012 is the big bang: CUDA + backprop + ImageNet fused on two gamer GPUs.",
    topics:[
      {n:"CNNs (Neocognitron → LeNet)", y:1980, who:"Fukushima; LeCun 1989", s:"work", d:"Convolution = learned local filters. First job: reading ZIP codes."},
      {n:"AlexNet", y:2012, who:"Krizhevsky, Sutskever, Hinton", s:"found", d:"ImageNet error 26%→16%. The modern era's opening bell."},
      {n:"LSTM", y:1997, who:"Hochreiter & Schmidhuber", s:"obs", d:"Memory cells for sequences; mostly displaced by attention."},
      {n:"word2vec", y:2013, who:"Tomas Mikolov", s:"found", d:"king − man + woman ≈ queen. Meaning as geometry."},
      {n:"GANs", y:2014, who:"Ian Goodfellow", s:"obs", d:"Forger vs detective. Dethroned by diffusion."},
      {n:"Transformer — 'Attention Is All You Need'", y:2017, who:"Vaswani et al.", s:"fire", d:"Attention = differentiable dictionary lookup. Parallelizable ⇒ scalable ⇒ everything since."},
      {n:"Diffusion models", y:2020, who:"Sohl-Dickstein 2015; Ho 2020", s:"fire", d:"Images from noise, via thermodynamics — a physics bridge."},
      {n:"KANs", y:2024, who:"Liu et al.", s:"fire", d:"Learnable activations via the Kolmogorov–Arnold theorem. Your PIKAN lives on this node."}
    ]},
  { id:"llm", name:"The LLM Era", y:2019, s:"fire",
    d:"Scaling laws made loss a power law in compute; RLHF turned predictors into assistants. Interpretability is the field's conscience; the Bitter Lesson is its moral.",
    topics:[
      {n:"Scaling laws", y:2020, who:"Kaplan; Chinchilla 2022", s:"fire", d:"Loss falls as a power law in compute, data, parameters."},
      {n:"GPT-3 → ChatGPT", y:2020, who:"OpenAI (ChatGPT Nov 2022)", s:"fire", d:"In-context learning emerges; then the public's big bang."},
      {n:"RLHF", y:2017, who:"Christiano et al.", s:"fire", d:"Reinforcement learning from human preference — raw predictor to assistant."},
      {n:"Constitutional AI", y:2022, who:"Anthropic", s:"fire", d:"The lineage of the model that rendered this map."},
      {n:"Interpretability (circuits, SAEs)", y:2020, who:"Olah et al.", s:"fire", d:"Opening the black box, feature by feature."},
      {n:"The Bitter Lesson", y:2019, who:"Rich Sutton", s:"found", d:"70 years of evidence: general methods + compute beat built-in human knowledge. Every time."}
    ]},
  { id:"deeprl", name:"Deep RL & Games", y:2013, s:"fire",
    d:"Atari from pixels, then move 37. AlphaFold is the clearest 'AI does real science' node — the bridge toward your own cosmology work.",
    topics:[
      {n:"DQN (Atari)", y:2013, who:"DeepMind (Mnih et al.)", s:"work", d:"Pixels in, joystick out, superhuman scores."},
      {n:"AlphaGo", y:2016, who:"DeepMind (Silver et al.)", s:"found", d:"Beat Lee Sedol. Move 37: the machine's first famous idea."},
      {n:"AlphaFold", y:2020, who:"DeepMind (Jumper et al.)", s:"fire", d:"Protein folding, solved-ish. Nobel Chemistry 2024."}
    ]}
]
};

// -------- PIONEERS (constellation) --------
const PEOPLE = [
  { name:"Charles Babbage", dates:"1791–1871", y:1822, domains:["hard"],
    epitaph:"Designed the computer a century early.",
    fate:"Died embittered, engine unbuilt. A working Difference Engine was finally constructed in 1991 — it works." },
  { name:"Ada Lovelace", dates:"1815–1852", y:1843, domains:["hard","found"],
    epitaph:"First programmer; first to see computers as symbol machines.",
    fate:"Died at 36 of uterine cancer. Her 'objection' — machines only do what we order — was named and rebutted by Turing in 1950." },
  { name:"George Boole", dates:"1815–1864", y:1847, domains:["found"],
    epitaph:"Turned logic into algebra.",
    fate:"Died of pneumonia after lecturing in rain-soaked clothes." },
  { name:"Alan Turing", dates:"1912–1954", y:1936, domains:["found","hard","info","ai"],
    epitaph:"Defined computation, helped break Enigma, asked if machines can think.",
    fate:"Prosecuted in 1952 for homosexuality and chemically castrated. Died of cyanide poisoning at 41, ruled suicide. Royal pardon 2013; now on the UK £50 note. He touches four continents of this map — more than anyone." },
  { name:"John von Neumann", dates:"1903–1957", y:1944, domains:["hard","algo","ai"],
    epitaph:"Architecture, game theory, Monte Carlo, self-replication.",
    fate:"Died at 53 of cancer, possibly from atomic-test exposure — working on 'The Computer and the Brain' to the end." },
  { name:"Claude Shannon", dates:"1916–2001", y:1937, domains:["info","hard","ai"],
    epitaph:"Invented the bit — and twice bridged logic to reality (1937, 1948).",
    fate:"Lived to 84 juggling and building maze-solving mice; Alzheimer's took his memory as the internet he enabled bloomed." },
  { name:"Grace Hopper", dates:"1906–1992", y:1952, domains:["lang"],
    epitaph:"Compilers: made programming human.",
    fate:"Rear Admiral, US Navy. Worked until 85. Kept a clock running counterclockwise to remind people conventions are choices." },
  { name:"John McCarthy", dates:"1927–2011", y:1956, domains:["ai","lang"],
    epitaph:"Coined 'artificial intelligence'; created LISP.",
    fate:"Lived just long enough to see the deep-learning dawn he was skeptical of." },
  { name:"Frank Rosenblatt", dates:"1928–1971", y:1958, domains:["ml"],
    epitaph:"The perceptron.",
    fate:"Died in a boating accident at 43, in the depth of his field's rejection. Vindicated fifteen years posthumously by backprop." },
  { name:"Marvin Minsky", dates:"1927–2016", y:1956, domains:["ai","ml"],
    epitaph:"Symbolic AI's champion; the perceptron's prosecutor.",
    fate:"Lived to 88 — long enough to watch deep networks conquer everything he doubted." },
  { name:"Dennis Ritchie", dates:"1941–2011", y:1972, domains:["lang"],
    epitaph:"C and Unix.",
    fate:"Died the same week as Steve Jobs; hackers say the world mourned the wrong one." },
  { name:"E. F. Codd", dates:"1923–2003", y:1970, domains:["data"],
    epitaph:"Data as relations.",
    fate:"IBM resisted his relational model — it threatened their existing products. It won anyway." },
  { name:"Geoffrey Hinton", dates:"1947–", y:1986, domains:["ml"],
    epitaph:"Carried backprop through two winters.",
    fate:"Nobel Prize (Physics!) 2024. Quit Google in 2023 to warn about the risks of what he built — the field's Oppenheimer arc." },
  { name:"Fei-Fei Li", dates:"1976–", y:2009, domains:["ml","data"],
    epitaph:"ImageNet: proved data is the third pillar.",
    fate:"Active — human-centered AI at Stanford." },
  { name:"Rich Sutton", dates:"1947–", y:1988, domains:["ml","ai"],
    epitaph:"Reinforcement learning; the Bitter Lesson.",
    fate:"Turing Award 2024 (with Andrew Barto). Still betting on general methods + compute." }
];

const TIMELINE_STARS = [1936, 1937, 1945, 1948, 1956, 2007, 2012, 2017, 2022];
