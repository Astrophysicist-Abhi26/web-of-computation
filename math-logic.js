// MATHEMATICAL LOGIC — the deepest field guide on the map, deliberately.
// This is the bedrock: remove set theory and logic, and everything else on
// this map collapses. Loaded only when the Mathematical Logic field opens.
// Same visual language as information-theory.js / the cryptography guides.
(function () {
"use strict";

// ---------------------------------------------------------------- chapters
const CHAPTERS = [
  {
    icon: "🏛", title: "Boole — thought becomes algebra", who: "George Boole · 1847–1854",
    lead: "A self-taught schoolmaster proposes that reasoning itself obeys equations.",
    formula: "AND: x·y   ·   OR: x + y − x·y   ·   NOT: 1 − x   ·   truth ∈ {0, 1}",
    what: `Boole's move was outrageous for its time: treat TRUE and FALSE as the
      numbers 1 and 0, and logical connectives as arithmetic on them. Suddenly a
      syllogism is a calculation. An argument is valid exactly when the algebra
      says so — no intuition, no Latin, no Aristotle. Logic had been philosophy
      for two millennia; Boole made it mathematics.`,
    how: `In Boolean algebra every variable satisfies x² = x — the "law of
      thought" that only 0 and 1 obey. From a handful of axioms (commutativity,
      distributivity, complements) every tautology follows mechanically. That
      mechanical character is the point: if validity is computable by rules, a
      MACHINE could in principle check reasoning. Nobody said that aloud in 1847.
      It took ninety years for the hint to detonate.`,
    story: `Boole was a shoemaker's son from Lincoln who left school at 16,
      taught himself Latin, Greek and the Continental mathematics England
      ignored, and never held a degree — yet won the Royal Society's first gold
      medal for mathematics and a professorship in Cork. He died at 49 after
      walking three miles through freezing rain to lecture in soaked clothes.
      The tragic coda: his wife, devoted to the doctrine that a cure must
      resemble its cause, reportedly wrapped him in wet sheets. His algebra lay
      dormant for decades — a curiosity for philosophers — until a master's
      student named Claude Shannon noticed in 1937 that it was a wiring diagram.`,
    today: `Every logic gate in every chip on Earth is Boole's algebra cast in
      silicon: billions of x·y and 1−x operations per nanosecond. The AND, OR,
      NOT you write in every programming language, the WHERE clause in every
      database query, the branch predicate in every if-statement — all of it is
      the 1847 book, running.`
  },
  {
    icon: "🏛", title: "Cantor — set theory & the sizes of infinity", who: "Georg Cantor · 1874–1891",
    lead: "The bedrock question: what is a collection? The shocking answer: some infinities are bigger than others.",
    formula: "Cantor's theorem: |2^S| > |S| for EVERY set S   ·   ℵ₀ = |ℕ| < 2^ℵ₀ = |ℝ|",
    what: `Set theory begins with the humblest possible object — a bare
      collection of things — and discovers it is enough to build all of
      mathematics. Numbers? Sets. Functions? Sets of pairs. Geometry, analysis,
      probability? Sets, sets, sets. This is why the field matters so much: it
      is the single foundation every other structure rests on. Cantor then asked
      the forbidden question — can one infinite set be BIGGER than another? —
      and proved yes: the real numbers cannot be listed, ever, by anyone.`,
    how: `The diagonal argument (playable above) is perhaps the most powerful
      three-line proof in mathematics. Suppose someone claims a complete list of
      all infinite binary sequences. Walk down the diagonal, flip every bit, and
      you hold a sequence that differs from row n at position n — so it is on no
      row. The "complete" list was not complete, and no list can be. The same
      diagonal, re-aimed, later powers Gödel's incompleteness and Turing's
      halting problem: three of the deepest results in human thought are one
      trick, refracted.`,
    story: `Cantor paid dearly for paradise. His own teacher Kronecker called
      the work corruption of youth and blocked his appointments; the depression
      that shadowed his life deepened, and he died in a sanatorium in 1918. Of
      one of his own results he wrote to Dedekind: "I see it, but I don't
      believe it." Hilbert declared that no one would expel mathematicians from
      the paradise Cantor created. The sharpest twist came later: Cantor's
      continuum hypothesis — is there a size strictly between ℕ and ℝ? — was
      proved UNDECIDABLE from the standard axioms (Gödel 1940, Cohen 1963). Set
      theory's own deepest question is one its axioms cannot answer: the first
      great specimen of incompleteness in the wild.`,
    today: `ZFC set theory is the constitution of mathematics — the agreed axioms
      under which proofs are checked, including by machines: proof assistants
      like Lean and Coq verify real theorems down to the axioms. Cantor's
      hierarchy of infinities became descriptive set theory and large-cardinal
      research, an active frontier where the axioms themselves are on trial.`
  },
  {
    icon: "🏛", title: "Frege, Russell's paradox & the ZFC rescue", who: "Frege 1879 · Russell 1901 · Zermelo 1908",
    lead: "One innocent question — does the set of all sets that don't contain themselves contain itself? — and the foundations crack.",
    formula: "R = {x : x ∉ x}   ⇒   R ∈ R ⇔ R ∉ R   ·   repair: ZFC's nine axioms",
    what: `Frege's 1879 Begriffsschrift invented modern logic in one book:
      quantifiers (∀, ∃), predicates, formal proof — the notation this whole map
      runs on. He then spent decades deriving arithmetic from pure logic. The
      system had one generous assumption: any property defines a set. Russell
      found the property that detonates it. The set of all sets that do not
      contain themselves belongs to itself exactly when it doesn't — try both
      answers in the paradox switch above and watch each one explode.`,
    how: `The repair took a generation. Zermelo (1908), sharpened by Fraenkel
      and Skolem (1922), rebuilt set theory on explicit axioms — ZFC — that
      never grant "any property is a set." Sets are built cumulatively, from ∅
      upward, stage by stage, so no set can contain itself and Russell's R is
      simply never constructed. The lesson became permanent mathematical
      culture: foundations are not free; you must legislate what exists.`,
    story: `The timing was surgically cruel. Russell's short letter reached
      Frege in June 1902 while volume II of his life's work was literally at the
      printer. Frege added an appendix conceding that a scientist can face
      nothing worse than having his foundation collapse just as the building is
      finished — one of the most honest sentences ever printed in mathematics —
      and never fully recovered. Russell, with Whitehead, spent a decade on
      Principia Mathematica, whose proof that 1+1=2 arrives after hundreds of
      pages. The heroic overkill made the question unavoidable: can we PROVE the
      repaired foundations are safe? That question is Hilbert's program — the
      next chapter.`,
    today: `Russell's paradox never really left. It reappears as the barber who
      shaves exactly those who don't shave themselves, in the type systems of
      programming languages (which stratify values precisely to dodge it), and
      in every proof assistant's universe hierarchy. ZFC remains the default
      constitution; alternatives like type theory power Lean and Coq — the tools
      now formalizing frontier mathematics.`
  },
  {
    icon: "🏛", title: "Hilbert's program — the dream of certainty", who: "David Hilbert · 1900–1928",
    lead: "Prove mathematics consistent, complete, and decidable — by finite, mechanical means. What could go wrong?",
    formula: "The 1928 wishlist: ① Consistency  ② Completeness  ③ Decidability (Entscheidungsproblem)",
    what: `After the paradoxes, Hilbert — the most powerful mathematician alive —
      proposed the ultimate insurance policy. Formalize all of mathematics as a
      symbol game with explicit rules, then prove three things ABOUT the game:
      it never derives a contradiction (consistency); every true statement is
      derivable (completeness); and there is a mechanical procedure deciding, for
      any statement, provable or not (the Entscheidungsproblem). Achieve that,
      and mathematics is certain forever.`,
    how: `The genius move was metamathematics: treat proofs themselves as
      finite strings of symbols — mathematical objects — and reason about them
      with elementary, indisputable means. This is exactly the move that made
      the dream refutable: once proofs are objects, someone can prove theorems
      about what proofs can never do. Hilbert built the arena in which Gödel
      would defeat him.`,
    story: `Hilbert had form: his 1900 Paris address set 23 problems that
      steered a century of mathematics. His faith was carved into his tombstone
      in Königsberg — "Wir müssen wissen. Wir werden wissen." (We must know, we
      will know.) History's timing was merciless: he recorded that credo in a
      radio address in Königsberg in September 1930 — in the very days, in the
      very city, where an unknown 24-year-old at a logic conference quietly
      announced, in a single sentence during a discussion session, that
      completeness was impossible. Only one person in the room reacted
      immediately: John von Neumann, who cornered Gödel afterward.`,
    today: `Hilbert lost the war but his weapons won: formal systems,
      metamathematics, and the demand for mechanical checkability became proof
      theory, model theory, and ultimately software verification. When a
      compiler type-checks your code or a proof assistant certifies a theorem,
      you are watching Hilbert's program run — inside the boundaries Gödel drew.`
  },
  {
    icon: "🏛", title: "Gödel — incompleteness", who: "Kurt Gödel · 1931",
    lead: "Any consistent system rich enough for arithmetic contains true statements it can never prove — including its own consistency.",
    formula: "G ↔ ¬Provable(⌜G⌝)   ·   ⌜φ⌝ = 2^c₁ · 3^c₂ · 5^c₃ · …  (arithmetization)",
    what: `Gödel's first theorem: in any consistent formal system strong enough
      to express arithmetic, there are true statements that the system cannot
      prove. The second is crueler: such a system can never prove its own
      consistency. Hilbert's wishes ① and ② died in one 25-page paper written by
      a 25-year-old. Truth and provability — assumed identical since Euclid —
      came apart, permanently.`,
    how: `The engine is the Gödel machine you played with above. Assign every
      symbol a number; encode any formula as a single integer via prime powers
      (unique factorization makes it reversible); then "x is a proof of y"
      becomes ordinary arithmetic about numbers. Arithmetic can now talk about
      itself. Gödel then built, with a fixed-point trick, a sentence G that
      says "G is not provable." If the system proves G, it proves a falsehood —
      inconsistent. If it cannot, then G is TRUE and unprovable. Notice the
      family resemblance: it is Cantor's diagonal, aimed at proof itself.`,
    story: `Gödel announced the result on 7 September 1930, the day before
      Hilbert's "we will know" address in the same city. Von Neumann went home,
      derived the second theorem, and wrote to Gödel — who had it already. The
      rest of the life is legend and tragedy: walks at Princeton with Einstein,
      who said he came to the Institute mainly for the privilege of walking home
      with Gödel; the citizenship hearing where Gödel tried to explain a logical
      loophole he'd found by which the US Constitution permits dictatorship
      (Einstein and Morgenstern steered him off it); and the end — convinced his
      food was poisoned, he ate only what his wife tested, and when she was
      hospitalized in 1977 he starved. He weighed 65 pounds. The clearest mind
      of the century died of reasoning it could not escape.`,
    today: `Incompleteness is a load-bearing wall of computer science: it is why
      no program can verify all programs, why every sufficiently rich type
      system rejects some correct code, why mathematics needs an endless ladder
      of stronger axioms. Concrete Gödel sentences are now known in ordinary
      combinatorics (Paris–Harrington, Goodstein sequences): natural statements
      about numbers, true, and unprovable in Peano arithmetic.`
  },
  {
    icon: "🏛", title: "Church & Turing — logic becomes machine", who: "Alonzo Church · Alan Turing · 1936",
    lead: "Hilbert's last wish — decidability — falls twice in one year, and the refutation accidentally defines the computer.",
    formula: "Halting problem: undecidable   ·   λ-calculus ≡ Turing machines ≡ recursive functions",
    what: `One Hilbert wish remained: a mechanical procedure to decide any
      mathematical statement. To refute it you must first define "mechanical
      procedure" — and that definition is the birth certificate of computer
      science. Church answered with the λ-calculus; Turing, independently and
      weeks later, with an imagined machine: a tape, a head, a table of rules.
      Both proved the Entscheidungsproblem unsolvable. Hilbert's program was now
      0 for 3 — and the consolation prize was the computer.`,
    how: `Turing's paper does three immortal things. It defines computation so
      convincingly that "computable" still means "Turing-computable" (the
      Church–Turing thesis). It constructs the UNIVERSAL machine — one machine
      that, fed a description of any other, simulates it: software, foreshadowed.
      And it proves undecidability by — look closely — Cantor's diagonal again,
      aimed at machines: a program that asks "what would the halting-decider say
      about me?" and does the opposite. Diagonalization strikes for the third
      time: uncountability, incompleteness, undecidability. One trick. Three
      revolutions.`,
    story: `Turing was a 23-year-old Cambridge fellow who learned, on finishing,
      that Church had beaten him to the result by months — Newman had to fight
      for the paper's publication on the grounds that the METHOD was itself a
      discovery. It was: Church gave an answer; Turing gave an answer containing
      a machine. Within four years the machine had a body at Bletchley Park (see
      Classical Cryptography, one nebula east), and within ten, von Neumann —
      who knew both this paper and the hardware — drafted the architecture your
      device uses to render this sentence. From this node, the rest of the map
      unfolds: everything else here is a consequence.`,
    today: `The boundary Turing drew is patrolled daily: compilers cannot
      perfectly detect infinite loops (Rice's theorem generalizes the ban),
      static analyzers approximate, and whole industries live inside decidable
      fragments (model checking, SMT solvers). The λ-calculus quietly became
      Lisp, ML, Haskell — and the type theories inside modern proof assistants.
      The 1936 paper is the hinge of this entire map: pen-and-paper logic on one
      side, every machine ever built on the other.`
  }
];

// ---------------------------------------------------------------- sources
const SOURCES = [
  {
    type: "FOUNDATIONAL PAPER · 1931",
    title: "Kurt Gödel — Über formal unentscheidbare Sätze der Principia Mathematica…",
    note: "The incompleteness paper itself (Monatshefte für Mathematik und Physik).",
    url: "https://doi.org/10.1007/BF01700692"
  },
  {
    type: "FOUNDATIONAL PAPER · 1936",
    title: "Alan M. Turing — On Computable Numbers, with an Application to the Entscheidungsproblem",
    note: "The machine, the universal machine, undecidability — computer science's birth certificate.",
    url: "https://doi.org/10.1112/plms/s2-42.1.230"
  },
  {
    type: "REFERENCE · STANFORD",
    title: "Stanford Encyclopedia of Philosophy — Gödel's Incompleteness Theorems",
    note: "The definitive free scholarly exposition: exact statements, proofs, misconceptions corrected.",
    url: "https://plato.stanford.edu/entries/goedel-incompleteness/"
  },
  {
    type: "REFERENCE · STANFORD",
    title: "Stanford Encyclopedia of Philosophy — Russell's Paradox",
    note: "The paradox, Frege's reaction, and the century of repairs, rigorously told.",
    url: "https://plato.stanford.edu/entries/russell-paradox/"
  },
  {
    type: "REFERENCE · STANFORD",
    title: "Stanford Encyclopedia of Philosophy — Set Theory",
    note: "From Cantor to ZFC to large cardinals — the free authoritative survey.",
    url: "https://plato.stanford.edu/entries/set-theory/"
  },
  {
    type: "OPEN TEXTBOOK · FREE",
    title: "The Open Logic Project — a fully open-source mathematical logic text",
    note: "University-built, remixable, covers everything on this page with full proofs.",
    url: "https://openlogicproject.org"
  },
  {
    type: "PLAY TO LEARN · FREE",
    title: "The Natural Number Game (Lean) — build ℕ from the Peano axioms yourself",
    note: "The famously addictive university-built game: prove 2+2=4 from nothing, level by level.",
    url: "https://adam.math.hhu.de/#/g/leanprover-community/nng4"
  },
  {
    type: "LEGENDARY BOOK",
    title: "Douglas Hofstadter — Gödel, Escher, Bach: an Eternal Golden Braid (1979)",
    note: "The Pulitzer-winning labyrinth that has seduced two generations into logic.",
    url: "https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach"
  }
];

// ------------------------------------------------------------ shared style
const BASE_CSS = `
  #panel .it-module{margin-top:.15rem;padding-bottom:1.5rem}
  #panel .it-kicker{font:500 .63rem "IBM Plex Mono",monospace;letter-spacing:.13em;color:var(--gold);margin:.2rem 0 .55rem}
  #panel .it-hook{font-family:"Fraunces",Georgia,serif;font-size:1.13rem;line-height:1.35;color:var(--ink);margin:0 0 .65rem}
  #panel .it-intro{font-size:.84rem;line-height:1.55;color:var(--dim);margin:0 0 1rem}
  #panel .it-timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin:.9rem 0 1.1rem}
  #panel .it-moment{min-width:0;text-align:center;border-top:1px solid rgba(245,196,81,.38);padding-top:.45rem}
  #panel .it-moment b{display:block;color:var(--gold);font:500 .62rem "IBM Plex Mono",monospace}
  #panel .it-moment span{display:block;color:var(--dim);font-size:.62rem;line-height:1.2;margin-top:.2rem}
  #panel .it-lab{border:1px solid rgba(245,196,81,.3);border-radius:12px;background:rgba(7,5,15,.36);padding:.85rem;margin:0 0 1rem}
  #panel .it-lab h3,#panel .it-section-title{font-family:"Fraunces",Georgia,serif;font-size:1.03rem;margin:0 0 .28rem}
  #panel .it-lab-intro{font-size:.77rem;line-height:1.45;color:var(--dim);margin:0 0 .75rem}
  #panel .it-control{margin:.65rem 0}
  #panel .it-control label{display:flex;justify-content:space-between;gap:.6rem;color:var(--ink);font:500 .66rem "IBM Plex Mono",monospace;margin-bottom:.28rem}
  #panel .it-control output{color:var(--gold)}
  #panel .it-control input[type=range]{width:100%;accent-color:var(--gold);cursor:pointer}
  #panel .it-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;margin:.65rem 0}
  #panel .it-metric{border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:.45rem;text-align:center;background:rgba(255,255,255,.025)}
  #panel .it-metric small{display:block;color:var(--dim);font:400 .56rem "IBM Plex Mono",monospace;line-height:1.2}
  #panel .it-metric b{display:block;color:var(--ink);font:500 .84rem "IBM Plex Mono",monospace;margin-top:.25rem}
  #panel .it-feasible{font:500 .62rem "IBM Plex Mono",monospace;border-radius:999px;padding:.38rem .65rem;text-align:center;margin:.55rem 0}
  #panel .it-feasible.yes{color:#9fe8c0;border:1px solid rgba(87,224,138,.35);background:rgba(87,224,138,.08)}
  #panel .it-feasible.no{color:#ffad91;border:1px solid rgba(255,120,71,.35);background:rgba(255,120,71,.08)}
  #panel .it-lab-actions{display:flex;gap:.45rem;align-items:center;flex-wrap:wrap;margin:.6rem 0}
  #panel .it-send{font:500 .67rem "IBM Plex Mono",monospace;color:#120b18;background:var(--gold);border:0;border-radius:8px;padding:.5rem .75rem;cursor:pointer}
  #panel .it-send:hover{filter:brightness(1.1)}
  #panel .it-check{display:flex;align-items:center;gap:.35rem;color:var(--dim);font:400 .62rem "IBM Plex Mono",monospace;cursor:pointer}
  #panel .it-result{color:var(--dim);font-size:.72rem;line-height:1.4;margin:.5rem 0 0}
  #panel .it-caveat{color:#817a9d;font-size:.66rem;line-height:1.4;margin:.5rem 0 0}
  #panel .it-section-title{margin:1.2rem 0 .55rem}
  #panel details.it-chapter{border-top:1px solid rgba(255,255,255,.1)}
  #panel details.it-chapter:last-of-type{border-bottom:1px solid rgba(255,255,255,.1)}
  #panel details.it-chapter summary{list-style:none;cursor:pointer;padding:.78rem 1.25rem .78rem 0;position:relative}
  #panel details.it-chapter summary::-webkit-details-marker{display:none}
  #panel details.it-chapter summary:after{content:"+";position:absolute;right:.1rem;top:.78rem;color:var(--gold);font:500 1rem "IBM Plex Mono",monospace}
  #panel details.it-chapter[open] summary:after{content:"−"}
  #panel .it-chapter-title{display:block;font-family:"Spectral",Georgia,serif;font-size:.94rem;font-weight:600;color:var(--ink)}
  #panel .it-chapter-meta{display:block;font:400 .59rem "IBM Plex Mono",monospace;color:var(--dim);margin-top:.18rem}
  #panel .it-chapter-lead{display:block;font-size:.72rem;color:#b8b1ce;margin-top:.28rem}
  #panel .it-chapter-body{padding:0 0 .9rem}
  #panel .it-formula{display:block;overflow-x:auto;white-space:nowrap;background:rgba(0,0,0,.25);border-left:2px solid var(--gold);padding:.55rem .65rem;color:#9fe8c0;font:400 .61rem "IBM Plex Mono",monospace;margin:0 0 .7rem}
  #panel .it-tabs{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.55rem}
  #panel .it-tab{border:1px solid rgba(255,255,255,.13);border-radius:999px;background:none;color:var(--dim);padding:.3rem .55rem;cursor:pointer;font:400 .58rem "IBM Plex Mono",monospace}
  #panel .it-tab.on{color:var(--gold);border-color:rgba(245,196,81,.55);background:rgba(245,196,81,.06)}
  #panel .it-copy{color:var(--dim);font-size:.79rem;line-height:1.55;min-height:5.1rem}
  #panel .it-copy b{color:var(--ink)}
  #panel .it-challenges{margin:.9rem 0;padding:.75rem;border-left:2px solid #d98bff;background:rgba(217,139,255,.045)}
  #panel .it-challenges b{font-family:"Fraunces",Georgia,serif}.it-challenges ol{padding-left:1.1rem;margin-top:.35rem}
  #panel .it-challenges li{color:var(--dim);font-size:.74rem;line-height:1.45;margin:.28rem 0}
  #panel .it-source{display:grid;grid-template-columns:1fr auto;gap:.15rem .45rem;padding:.65rem 0;border-top:1px solid rgba(255,255,255,.09);text-decoration:none}
  #panel .it-source small{grid-column:1;color:var(--gold);font:500 .56rem "IBM Plex Mono",monospace;letter-spacing:.06em}
  #panel .it-source strong{grid-column:1;color:var(--ink);font-family:"Spectral",Georgia,serif;font-size:.8rem;line-height:1.25}
  #panel .it-source span{grid-column:1;color:var(--dim);font-size:.68rem;line-height:1.35}
  #panel .it-source i{grid-column:2;grid-row:1/4;align-self:center;color:var(--gold);font-style:normal}
  @media(max-width:420px){#panel .it-metrics{grid-template-columns:1fr}.it-timeline{font-size:90%}}
`;

const ML_CSS = `
  #panel .ml-grid{display:grid;gap:2px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:.5rem;margin:.6rem 0;font:500 .68rem "IBM Plex Mono",monospace}
  #panel .ml-row{display:flex;gap:2px;align-items:center}
  #panel .ml-row>i{width:1.6rem;color:#817a9d;font-style:normal;font-size:.58rem;text-align:right;padding-right:.3rem;flex:none}
  #panel .ml-cell{flex:1;text-align:center;color:#c9c4dc;background:rgba(255,255,255,.03);border-radius:3px;padding:.14rem 0;transition:background .25s,color .25s}
  #panel .ml-cell.diag{color:#120b18;background:var(--gold);font-weight:700}
  #panel .ml-cell.newbit{color:#9fe8c0;background:rgba(87,224,138,.14);font-weight:700}
  #panel .ml-cell.clash{color:#ffad91;background:rgba(255,120,71,.16)}
  #panel .ml-drow{border-top:1px dashed rgba(245,196,81,.4);margin-top:.25rem;padding-top:.3rem}
  #panel .ml-switch{display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin:.6rem 0}
  #panel .ml-switch button{border:1px solid rgba(255,255,255,.14);border-radius:9px;background:rgba(255,255,255,.02);color:var(--ink);font:500 .68rem "IBM Plex Mono",monospace;padding:.6rem;cursor:pointer}
  #panel .ml-switch button:hover{border-color:rgba(245,196,81,.55)}
  #panel .ml-boom{border-left:2px solid #ff5d6c;background:rgba(255,93,108,.06);color:#ffad91;font:400 .66rem/1.5 "IBM Plex Mono",monospace;padding:.5rem .6rem;margin:.45rem 0;border-radius:0 8px 8px 0;min-height:2.2rem}
  #panel .ml-pal{display:flex;flex-wrap:wrap;gap:.3rem;margin:.5rem 0}
  #panel .ml-pal button{border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(0,0,0,.2);color:#c9c4dc;font:500 .8rem "IBM Plex Mono",monospace;min-width:2rem;padding:.32rem .4rem;cursor:pointer}
  #panel .ml-pal button:hover{color:var(--gold);border-color:rgba(245,196,81,.55)}
  #panel .ml-pal button.aux{color:#817a9d;font-size:.62rem}
  #panel .ml-formula{font:600 1rem "IBM Plex Mono",monospace;color:#9fe8c0;background:rgba(0,0,0,.25);border-radius:8px;padding:.5rem .6rem;min-height:1.4rem;letter-spacing:.12em;margin:.4rem 0;word-break:break-all}
  #panel .ml-codes{font:400 .62rem/1.6 "IBM Plex Mono",monospace;color:#a9a1c2;margin:.3rem 0;word-break:break-all}
  #panel .ml-num{font:500 .68rem/1.5 "IBM Plex Mono",monospace;color:var(--gold);background:rgba(245,196,81,.05);border:1px dashed rgba(245,196,81,.4);border-radius:8px;padding:.45rem .55rem;margin:.4rem 0;word-break:break-all}
  #panel .ml-step{border-top:1px solid rgba(255,255,255,.09);padding:.55rem 0}
  #panel .ml-step b{display:block;color:var(--ink);font:600 .7rem "IBM Plex Mono",monospace;margin-bottom:.2rem}
  #panel .ml-step p{color:var(--dim);font-size:.73rem;line-height:1.5;margin:0}
  @media(prefers-reduced-motion:reduce){#panel .ml-cell{transition:none}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) {
    window.__ensureLearningBaseStyles();
  } else if (!document.getElementById("information-theory-css") &&
             !document.getElementById("it-base-css")) {
    const base = document.createElement("style");
    base.id = "it-base-css";
    base.textContent = BASE_CSS;
    document.head.appendChild(base);
  }
  if (!document.getElementById("math-logic-css")) {
    const own = document.createElement("style");
    own.id = "math-logic-css";
    own.textContent = ML_CSS;
    document.head.appendChild(own);
  }
}

const $ = id => document.getElementById(id);

// ============================================================ LAB 1: CANTOR
const DIAG_N = 8;
const DG = { rows: [], d: null, escapes: 0 };

function diagNewList() {
  DG.rows = Array.from({ length: DIAG_N }, () =>
    Array.from({ length: DIAG_N }, () => Math.random() < 0.5 ? 1 : 0));
  DG.d = null;
}
function diagFlip(rows) { return rows.map((r, i) => 1 - r[i]); }

function renderDiag(showClash) {
  const host = $("ml-diag-grid");
  if (!host) return;
  let html = "";
  DG.rows.forEach((r, i) => {
    html += `<div class="ml-row"><i>s${i + 1} =</i>` + r.map((b, j) =>
      `<span class="ml-cell${j === i ? " diag" : ""}${showClash && DG.d && j === i ? " clash" : ""}">${b}</span>`
    ).join("") + `</div>`;
  });
  if (DG.d) {
    html += `<div class="ml-row ml-drow"><i>d =</i>` + DG.d.map(b =>
      `<span class="ml-cell newbit">${b}</span>`).join("") + `</div>`;
  }
  host.innerHTML = html;
  $("ml-escapes").textContent = String(DG.escapes);
  $("ml-add").disabled = !DG.d;
}
function diagStatus(ok, text) {
  const el = $("ml-diag-status");
  el.className = "it-feasible " + (ok ? "yes" : "no");
  el.textContent = text;
}

// ========================================================= LAB 2: RUSSELL
let paradoxTries = 0;
function paradoxAnswer(yes) {
  paradoxTries++;
  $("ml-boom").textContent = yes
    ? "You said R ∈ R. But R contains only sets that do NOT contain themselves — so R must NOT be in R. Contradiction. 💥"
    : "You said R ∉ R. Then R fails to contain itself — which is exactly the membership rule — so R MUST be in R. Contradiction. 💥";
  $("ml-paradox-status").className = "it-feasible no";
  $("ml-paradox-status").textContent =
    "✕ Both answers explode (" + paradoxTries + " attempt" + (paradoxTries > 1 ? "s" : "") +
    "). The set R cannot exist — naive set theory is inconsistent. This is what ZFC's axioms were built to prevent.";
}

// ============================================================ LAB 3: GÖDEL
const SYMS = [
  ["0", 1], ["S", 2], ["=", 3], ["+", 4], ["·", 5], ["(", 6], [")", 7],
  ["¬", 8], ["∀", 9], ["→", 10], ["x", 11], ["y", 12]
];
const SYM_CODE = Object.fromEntries(SYMS);
const CODE_SYM = Object.fromEntries(SYMS.map(([s, c]) => [c, s]));
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
const MAX_LEN = PRIMES.length;

let FORMULA = [];

function godelNumber(symbols) {
  let n = 1n;
  symbols.forEach((s, i) => { n *= PRIMES[i] ** BigInt(SYM_CODE[s]); });
  return n;
}
function godelDecode(n) { // honest trial factorization, to prove reversibility
  const out = [];
  for (const p of PRIMES) {
    if (n === 1n) break;
    let e = 0;
    while (n % p === 0n) { n /= p; e++; }
    if (e === 0) break;
    out.push(CODE_SYM[e] || "?");
  }
  return out.join("");
}

function renderGodel() {
  $("ml-formula").textContent = FORMULA.length ? FORMULA.join("") : "—";
  if (!FORMULA.length) {
    $("ml-codes").textContent = "press symbols to build a formula (max " + MAX_LEN + ")";
    $("ml-num").textContent = "⌜φ⌝ = —";
    $("ml-decode").textContent = "";
    return;
  }
  const codes = FORMULA.map(s => SYM_CODE[s]);
  $("ml-codes").textContent = "symbol codes: " + FORMULA.map((s, i) => s + "→" + codes[i]).join("  ");
  const parts = codes.map((c, i) => PRIMES[i] + "^" + c);
  const n = godelNumber(FORMULA);
  const dec = n.toString();
  $("ml-num").textContent = "⌜φ⌝ = " + parts.join(" · ") + " = " +
    (dec.length > 44 ? dec.slice(0, 22) + "…" + dec.slice(-14) : dec) +
    "   (" + dec.length + " digit" + (dec.length > 1 ? "s" : "") + ")";
  $("ml-decode").textContent = "";
}
function pushSym(s) {
  if (FORMULA.length >= MAX_LEN) {
    $("ml-decode").textContent = "Ten symbols is this toy's tape limit — Gödel had no such limit, only bigger primes.";
    return;
  }
  FORMULA.push(s); renderGodel();
}

const G_STEPS = [
  ["STEP 1 — Formulas become numbers.",
   "You just did it above: every statement of arithmetic IS a number, via prime powers. Unique factorization guarantees nothing is lost — press decode and watch the number confess its formula."],
  ["STEP 2 — 'Provable' becomes arithmetic.",
   "A proof is a finite sequence of formulas, so it too is a number. 'p is a proof of φ' is then a purely arithmetical relation between two numbers — checkable, in principle, by pure calculation. Arithmetic can now discuss what arithmetic can prove."],
  ["STEP 3 — The diagonal strikes.",
   "By a fixed-point construction, Gödel builds a sentence G whose content is: 'G is not provable.' If the system proves G, it has proved a falsehood — inconsistency. If it cannot prove G, then G is true and unprovable. Either way, Hilbert's dream of completeness is dead. Truth ≠ provability, forever."]
];
let gStep = 0;
function renderGStep() {
  $("ml-gstep").innerHTML = G_STEPS.slice(0, gStep + 1).map(([b, p]) =>
    `<div class="ml-step"><b>${b}</b><p>${p}</p></div>`).join("");
  $("ml-gnext").textContent = gStep < G_STEPS.length - 1 ? "next step →" : "again ↺";
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
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · THE BEDROCK · ABOUT 40 MIN</div>
    <p class="it-hook">What are numbers made of? Sets. What are proofs made of? Symbols. What are symbols made of? Numbers. That loop changes everything.</p>
    <p class="it-intro">This is the foundation the whole map stands on — remove set theory and logic and everything else collapses. Ninety years, 1847–1936: reasoning becomes algebra, infinity gets sizes, the foundations crack, the greatest repair program in mathematics is launched — and its magnificent failure accidentally invents the computer. Three of the deepest results ever found (uncountability, incompleteness, undecidability) turn out to be one trick, used three times. You will perform that trick yourself, below.</p>
    <div class="it-timeline" aria-label="Mathematical logic timeline">
      <div class="it-moment"><b>1847</b><span>Boole</span></div>
      <div class="it-moment"><b>1874</b><span>Cantor</span></div>
      <div class="it-moment"><b>1901</b><span>Russell</span></div>
      <div class="it-moment"><b>1931</b><span>Gödel</span></div>
      <div class="it-moment"><b>1936</b><span>Turing</span></div>
    </div>

    <section class="it-lab" aria-labelledby="ml-diag-title">
      <div class="it-kicker">PLAYABLE ATOM 1 · CANTOR 1891</div>
      <h3 id="ml-diag-title">The diagonal engine</h3>
      <p class="it-lab-intro">Below is a claimed "complete" list of infinite binary sequences (you see the first 8 digits of the first 8). The gold diagonal is the trap. Flip it, and you create a sequence that differs from row n at position n — so it is on NO row. Try to repair the list by adding your escape artist. Try forever.</p>
      <div class="ml-grid" id="ml-diag-grid"></div>
      <div class="it-metrics">
        <div class="it-metric"><small>SIZE OF ℕ</small><b>ℵ₀</b></div>
        <div class="it-metric"><small>SIZE OF ℝ</small><b>2^ℵ₀ &gt; ℵ₀</b></div>
        <div class="it-metric"><small>DIAGONAL ESCAPES</small><b id="ml-escapes">0</b></div>
      </div>
      <div id="ml-diag-status" class="it-feasible no">Flip the diagonal and watch a sequence escape the "complete" list.</div>
      <div class="it-lab-actions">
        <button class="it-send" id="ml-flip">flip the diagonal</button>
        <button class="it-send" id="ml-add" disabled>add d to the list &amp; retry</button>
        <button class="it-send" id="ml-newlist" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">new list</button>
      </div>
      <p class="it-caveat">The list will never win: whatever it contains, its own diagonal betrays it. This exact maneuver returns in 1931 aimed at proofs, and in 1936 aimed at machines. Same blade, three revolutions.</p>
    </section>

    <section class="it-lab" aria-labelledby="ml-paradox-title">
      <div class="it-kicker">PLAYABLE ATOM 2 · RUSSELL 1901</div>
      <h3 id="ml-paradox-title">The paradox switch</h3>
      <p class="it-lab-intro">Let R be the set of all sets that do not contain themselves. One question destroyed the foundations of mathematics. Your turn — there are only two possible answers, and you are free to pick either:</p>
      <div class="ml-switch">
        <button id="ml-yes">R ∈ R &nbsp;(R contains itself)</button>
        <button id="ml-no">R ∉ R &nbsp;(R does not)</button>
      </div>
      <div class="ml-boom" id="ml-boom">Choose an answer. Any answer.</div>
      <div id="ml-paradox-status" class="it-feasible no">The village barber shaves exactly those who don't shave themselves. Who shaves the barber?</div>
      <p class="it-caveat">This is the question Russell mailed to Frege in June 1902, while volume II of Frege's life's work sat at the printer. The repair — ZFC's axioms, where sets are built stage by stage and R is simply never constructed — is the constitution mathematics runs on today.</p>
    </section>

    <section class="it-lab" aria-labelledby="ml-godel-title">
      <div class="it-kicker">PLAYABLE ATOM 3 · GÖDEL 1931</div>
      <h3 id="ml-godel-title">The Gödel machine — arithmetic learns to talk about itself</h3>
      <p class="it-lab-intro">Build a formula of arithmetic from the palette. Watch it become a single number via prime powers — reversibly, thanks to unique factorization. This innocent-looking encoder is the engine of the incompleteness theorem.</p>
      <div class="ml-pal" id="ml-pal">
        ${SYMS.map(([s]) => `<button data-sym="${s}">${s}</button>`).join("")}
        <button class="aux" id="ml-back">⌫</button>
        <button class="aux" id="ml-clear">clear</button>
        <button class="aux" id="ml-ex1">try: 0=0</button>
        <button class="aux" id="ml-ex2">try: ¬(0=S0)</button>
        <button class="aux" id="ml-ex3">try: ∀x(x=x)</button>
      </div>
      <div class="ml-formula" id="ml-formula">—</div>
      <p class="ml-codes" id="ml-codes"></p>
      <div class="ml-num" id="ml-num">⌜φ⌝ = —</div>
      <div class="it-lab-actions">
        <button class="it-send" id="ml-dec">decode the number back (factorize)</button>
      </div>
      <p class="it-result" id="ml-decode"></p>
      <h3 style="margin-top:1rem">…and then the trap springs</h3>
      <div id="ml-gstep"></div>
      <div class="it-lab-actions"><button class="it-send" id="ml-gnext">next step →</button></div>
      <div class="it-feasible yes" style="margin-top:.6rem">🏛 Any consistent system rich enough for arithmetic contains true statements it cannot prove — and cannot prove its own consistency. Gödel, 1931. Twenty-five pages, age twenty-five.</div>
    </section>

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Five things to try</b><ol>
      <li>Beat the diagonal five times in a row. Then explain — out loud, to nobody — why you never will, and why that IS the proof that ℝ outnumbers ℕ.</li>
      <li>Flip the paradox switch both ways. Then restate it as the barber. Then find the third version hiding in "this sentence is false."</li>
      <li>Encode 0=0 and ∀x(x=x) in the Gödel machine. Could two different formulas ever share one Gödel number? What theorem from antiquity forbids it?</li>
      <li>Trace the one trick through all three labs: list→diagonal→escape, set→membership→contradiction, proof→self-reference→unprovable truth. Write the pattern in one sentence.</li>
      <li>Play the Natural Number Game (sources below) and prove 2+2=4 from the Peano axioms — the axioms this whole page is about. Warning: genuinely addictive.</li>
    </ol></div>
    <h3 class="it-section-title">Landmark papers, legendary books & free university resources</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1 wiring
  diagNewList(); DG.escapes = 0; renderDiag(false);
  $("ml-flip").addEventListener("click", () => {
    DG.d = diagFlip(DG.rows); DG.escapes++;
    renderDiag(true);
    diagStatus(false, "✕ d differs from s1 at digit 1, from s2 at digit 2… from s8 at digit 8. It is on no row — the list was never complete.");
  });
  $("ml-add").addEventListener("click", () => {
    DG.rows = [DG.d, ...DG.rows.slice(0, DIAG_N - 1)];
    DG.d = null;
    renderDiag(false);
    diagStatus(false, "You added the escapee. A NEW diagonal now runs through the updated list — flip it. This never ends; that unending is the theorem.");
  });
  $("ml-newlist").addEventListener("click", () => {
    diagNewList(); renderDiag(false);
    diagStatus(false, "Fresh 'complete' list. Same doom.");
  });

  // Lab 2 wiring
  paradoxTries = 0;
  $("ml-yes").addEventListener("click", () => paradoxAnswer(true));
  $("ml-no").addEventListener("click", () => paradoxAnswer(false));

  // Lab 3 wiring
  FORMULA = []; renderGodel();
  module.querySelectorAll("#ml-pal [data-sym]").forEach(b =>
    b.addEventListener("click", () => pushSym(b.dataset.sym)));
  $("ml-back").addEventListener("click", () => { FORMULA.pop(); renderGodel(); });
  $("ml-clear").addEventListener("click", () => { FORMULA = []; renderGodel(); });
  $("ml-ex1").addEventListener("click", () => { FORMULA = ["0", "=", "0"]; renderGodel(); });
  $("ml-ex2").addEventListener("click", () => { FORMULA = ["¬", "(", "0", "=", "S", "0", ")"]; renderGodel(); });
  $("ml-ex3").addEventListener("click", () => { FORMULA = ["∀", "x", "(", "x", "=", "x", ")"]; renderGodel(); });
  $("ml-dec").addEventListener("click", () => {
    if (!FORMULA.length) { $("ml-decode").textContent = "Build a formula first."; return; }
    const n = godelNumber(FORMULA);
    const back = godelDecode(n);
    $("ml-decode").textContent = "Factorizing ⌜φ⌝ … exponent of 2 is " + SYM_CODE[FORMULA[0]] +
      ", of 3 is " + (FORMULA[1] ? SYM_CODE[FORMULA[1]] : "—") + ", … recovered: " + back +
      (back === FORMULA.join("") ? "  ✓ nothing was lost. The number IS the formula." : "");
  });
  gStep = 0; renderGStep();
  $("ml-gnext").addEventListener("click", () => {
    gStep = (gStep + 1) % G_STEPS.length;
    if (gStep === 0) $("ml-gstep").innerHTML = "";
    renderGStep();
  });
}

window.openMathLogicExperience = buildExperience;
// test hook
window.__mlTest = { godelNumber, godelDecode, diagFlip, SYMS, PRIMES,
  diagNewList: () => { diagNewList(); return DG.rows; } };
})();
