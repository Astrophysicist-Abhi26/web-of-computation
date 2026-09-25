// COMPILERS & TYPE THEORY — Hopper's first compiler, the pipeline every
// compiler still follows, and Curry–Howard: proofs are programs. Three real
// labs: a compiler for arithmetic (tokens → syntax tree → constant folding →
// stack-machine code → execution), a type checker for the simply typed
// λ-calculus that shows which proposition each program proves, and Grace
// Hopper's nanosecond wire.
(function () {
"use strict";
const { register, canvas, C } = GuideKit;

const CHAPTERS = [
  { icon:"🦋", title:"1952 — Grace Hopper builds the first compiler",
    who:"Grace Hopper · Remington Rand UNIVAC · the A-0 system",
    lead:"Hopper's idea sounded absurd at the time: let people write programs in something closer to their own language, and have the computer translate them into machine code.",
    formula:"source program  →  compiler  →  machine code",
    what:`The A-0 system (1952) linked together numbered subroutines from a library based on a short program
      written by the programmer, producing a machine-code program. Hopper then pushed for programming in English
      words, leading to FLOW-MATIC and, through a committee she advised, COBOL (1959).`,
    how:`Hopper later recalled that people told her computers could only do arithmetic, not write programs. Her
      reply was that a compiler is just a program whose data happens to be another program.`,
    story:`In 1947 her team on the Harvard Mark II found a moth trapped in a relay and taped it into the logbook
      with the note "First actual case of bug being found". The word "bug" was older engineering slang, but the
      moth made "debugging" famous; the logbook page is at the Smithsonian.`,
    today:`Every program you run was compiled or interpreted from a higher-level language. COBOL, which descends
      from her work, still processes a large share of banking transactions.` },
  { icon:"🏭", title:"The compiler pipeline",
    who:"Backus (Fortran) 1957 · Knuth (LR parsing) 1965 · the 'Dragon Book' 1986",
    lead:"Every compiler follows the same stages: break the text into tokens, arrange them into a tree, check and improve the tree, then generate instructions.",
    formula:"characters → tokens (lexing) → syntax tree (parsing) → checks & optimisations → code generation",
    what:`Lexing turns "2*(x+3)" into tokens; parsing builds a tree that captures precedence (multiply before
      add); optimisation simplifies the tree (for example, computing constant parts in advance); code generation
      emits instructions for a real or virtual machine. Lab 1 runs every stage.`,
    how:`Grammar theory (Chomsky's hierarchy, see the Automata guide) made parsing systematic, and tools such as
      yacc (1975) generated parsers from grammars. Modern compilers such as LLVM use a shared intermediate
      representation so many languages can target many processors.`,
    story:`The first Fortran compiler took 18 person-years. Today a student can write a small compiler in a
      semester, because the theory and tools are so well developed.`,
    today:`Deep learning has its own compilers (XLA, TVM, Triton, torch.compile) that turn a model's computation
      graph into fast GPU and TPU code: the same pipeline, new target.` },
  { icon:"🟰", title:"Types — catching mistakes before the program runs",
    who:"Russell's type theory 1908 · Church's typed λ-calculus 1940 · Milner (ML) 1978",
    lead:"A type system gives every expression a kind (number, string, function from numbers to strings…) and refuses programs where the kinds don't fit.",
    formula:"if  f : A → B  and  x : A,   then   f x : B",
    what:`Types stop you adding a number to a list or calling something that isn't a function. In a statically
      typed language the compiler checks this before the program runs. Lab 2 is a type checker for the
      simplest typed functional language.`,
    how:`Robin Milner's ML (1978) could infer types without annotations, and proved that "well-typed programs
      cannot go wrong" (in a precise sense). Type inference is now in Haskell, Rust, TypeScript and Swift.`,
    story:`Type theory began as Bertrand Russell's fix for a paradox in set theory (1908). Half a century later
      the same ideas turned out to be exactly what programming languages needed.`,
    today:`Rust's type system prevents whole classes of memory bugs that plague C. TypeScript added types to
      JavaScript, and Python now has optional type hints checked by tools.` },
  { icon:"🌉", title:"Curry–Howard — proofs are programs",
    who:"Haskell Curry 1934/1958 · William Howard 1969 (published 1980)",
    lead:"A type can be read as a logical proposition, and a program of that type as a proof of it. This is the deepest bridge on the map, between mathematics and computing.",
    formula:"A → B  (function type)  ≡  'A implies B'      ·      A × B (pair)  ≡  'A and B'",
    what:`The type (A → B) → (B → C) → (A → C) is also the logical statement "if A implies B, and B implies C, then
      A implies C". A program with that type (compose two functions) is a proof of it. Lab 2 checks a program's
      type and prints the proposition it proves.`,
    how:`Checking that a program has a type is the same as checking that a proof is valid. A proposition with no
      program of its type (such as A → B for unrelated A and B) is unprovable.`,
    story:`Curry noticed the correspondence for simple logic in the 1930s; Howard extended it in a 1969 manuscript
      that circulated for a decade before publication. The map's gold bridge "Curry–Howard: proofs = programs"
      runs from Languages back to Foundations.`,
    today:`Proof assistants built on this idea (Coq, Lean, Agda) have verified the four-colour theorem and a C
      compiler (CompCert), and mathematicians now formalise research in Lean, increasingly helped by AI.` },
  { icon:"✅", title:"Proof assistants — when the compiler checks mathematics",
    who:"Thierry Coquand (Coq) 1989 · Leonardo de Moura (Lean) 2013 · mathlib",
    lead:"If proofs are programs, a type checker can check proofs. Proof assistants let mathematicians write proofs a computer verifies completely.",
    formula:"theorem : statement  :=  proof-term      — accepted only if it type-checks",
    what:`In Lean or Coq you state a theorem as a type and build a proof term, often with automated tactics. If the
      kernel (a small, carefully checked type checker) accepts it, the proof is correct down to the axioms.`,
    how:`Large libraries such as Lean's mathlib now contain a significant part of undergraduate and graduate
      mathematics, formalised and cross-checked.`,
    story:`In 2020–2022 Peter Scholze challenged the community to formalise a hard new result of his, the "Liquid
      Tensor Experiment". Lean users did it, and the process even simplified parts of the proof.`,
    today:`AI systems now generate Lean proofs of competition and research problems, and the proof assistant checks
      them: a learned model proposes, a symbolic system verifies. The map marks this 🔥.` }
];

const SOURCES = [
  { type:"THE FIRST COMPILER · 1952", title:"Grace Hopper — The Education of a Computer", note:"Proceedings of the ACM national meeting, 1952. Her case for automatic programming.", url:"https://doi.org/10.1145/609784.609818" },
  { type:"THE BUG · 1947", title:"Smithsonian — Log book with computer bug", note:"The moth from the Harvard Mark II, taped into the logbook.", url:"https://americanhistory.si.edu/collections/object/nmah_334663" },
  { type:"THE TEXTBOOK", title:"Aho, Lam, Sethi & Ullman — Compilers: Principles, Techniques, and Tools", note:"'The Dragon Book': the pipeline in depth.", url:"https://suif.stanford.edu/dragonbook/" },
  { type:"TYPE INFERENCE · 1978", title:"Robin Milner — A Theory of Type Polymorphism in Programming", note:"'Well-typed programs cannot go wrong.'", url:"https://doi.org/10.1016/0022-0000(78)90014-4" },
  { type:"CURRY–HOWARD · 1980", title:"William Howard — The Formulae-as-Types Notion of Construction", note:"The 1969 manuscript, published in the Curry festschrift.", url:"https://www.cs.cmu.edu/~crary/819-f09/Howard80.pdf" },
  { type:"ESSAY · 2015", title:"Philip Wadler — Propositions as Types", note:"CACM 58(12). The clearest introduction to Curry–Howard.", url:"https://doi.org/10.1145/2699407" },
  { type:"LEAN · FREE", title:"Lean — Theorem Proving in Lean 4", note:"Learn to write machine-checked proofs.", url:"https://lean-lang.org/theorem_proving_in_lean4/" },
  { type:"THE BOOK · FREE", title:"Robert Nystrom — Crafting Interpreters", note:"Build a complete language implementation, free online.", url:"https://craftinginterpreters.com/" }
];

/* ----------------------------------------------------- LAB 1: the pipeline */
function lex(s) {
  const out = []; let i = 0;
  while (i < s.length) { const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ t:"num", v:parseFloat(s.slice(i, j)) }); i = j; continue; }
    if (/[a-z]/i.test(c)) { let j = i; while (j < s.length && /\w/.test(s[j])) j++; out.push({ t:"var", v:s.slice(i, j) }); i = j; continue; }
    if ("+-*/^()".includes(c)) { out.push({ t:"op", v:c }); i++; continue; }
    throw new Error(`unexpected character '${c}'`); }
  return out;
}
function parseExpr(tokens) {
  let i = 0; const peek = () => tokens[i];
  const PREC = { "+":1, "-":1, "*":2, "/":2, "^":3 };
  function primary() { const t = tokens[i++]; if (!t) throw new Error("unexpected end");
    if (t.t === "num") return { k:"num", v:t.v }; if (t.t === "var") return { k:"var", v:t.v };
    if (t.v === "(") { const e = expr(0); if (!peek() || peek().v !== ")") throw new Error("missing )"); i++; return e; }
    if (t.v === "-") return { k:"op", v:"-", l:{ k:"num", v:0 }, r:primary() };
    throw new Error(`unexpected '${t.v}'`); }
  function expr(minP) { let left = primary();
    while (peek() && peek().t === "op" && PREC[peek().v] >= minP + (0)) { const op = peek().v, p = PREC[op]; if (p < minP) break; i++;
      const right = expr(op === "^" ? p : p + 1); left = { k:"op", v:op, l:left, r:right }; }
    return left; }
  const e = expr(1); if (i < tokens.length) throw new Error(`unexpected '${tokens[i].v}'`); return e;
}
const APPLY = { "+":(a, b) => a + b, "-":(a, b) => a - b, "*":(a, b) => a * b, "/":(a, b) => a / b, "^":(a, b) => Math.pow(a, b) };
function fold(n) { if (n.k !== "op") return n; const l = fold(n.l), r = fold(n.r); if (l.k === "num" && r.k === "num") return { k:"num", v:APPLY[n.v](l.v, r.v) };
  if (n.v === "*" && ((l.k === "num" && l.v === 0) || (r.k === "num" && r.v === 0))) return { k:"num", v:0 };
  if (n.v === "*" && l.k === "num" && l.v === 1) return r; if ((n.v === "*" || n.v === "/") && r.k === "num" && r.v === 1) return l;
  if (n.v === "+" && l.k === "num" && l.v === 0) return r; if ((n.v === "+" || n.v === "-") && r.k === "num" && r.v === 0) return l;
  return { k:"op", v:n.v, l, r }; }
function gen(n, out = []) { if (n.k === "num") out.push(`PUSH ${n.v}`); else if (n.k === "var") out.push(`LOAD ${n.v}`); else { gen(n.l, out); gen(n.r, out); out.push({ "+":"ADD", "-":"SUB", "*":"MUL", "/":"DIV", "^":"POW" }[n.v]); } return out; }
function execute(code, env) { const st = [], trace = []; for (const ins of code) { const [op, arg] = ins.split(" ");
  if (op === "PUSH") st.push(+arg); else if (op === "LOAD") { if (!(arg in env)) throw new Error(`no value for ${arg}`); st.push(env[arg]); }
  else { const b = st.pop(), a = st.pop(); st.push(APPLY[{ ADD:"+", SUB:"-", MUL:"*", DIV:"/", POW:"^" }[op]](a, b)); }
  trace.push(`${ins.padEnd(9)} stack: [${st.map(v => +v.toFixed(4)).join(", ")}]`); } return { v:st[0], trace }; }
const showTree = (n, pre = "", last = true) => { const lbl = n.k === "op" ? n.v : String(n.v), line = pre + (pre ? (last ? "└─ " : "├─ ") : "") + lbl + "\n";
  if (n.k !== "op") return line; const np = pre + (pre ? (last ? "   " : "│  ") : ""); return line + showTree(n.l, np || " ", false) + showTree(n.r, np || " ", true); };
const compLab = {
  kicker:"THE COMPILER PIPELINE", title:"Compile an expression, stage by stage",
  intro:`Type an arithmetic expression with numbers, variables x and y, + − * / ^ and brackets. Watch it become tokens, a syntax tree (which captures that * binds tighter than +), an optimised tree (constant parts computed in advance), instructions for a simple stack machine, and finally a result.`,
  html:`<div class="gk-row"><input class="gk-input" data-role="src" value="2 * (x + 3) + 4 * 5 * y" spellcheck="false"></div>
    <div class="it-control"><label><span>x</span><output data-o="x">2</output></label><input type="range" data-i="x" min="-10" max="10" step="1" value="2"></div>
    <div class="it-control"><label><span>y</span><output data-o="y">1</output></label><input type="range" data-i="y" min="-10" max="10" step="1" value="1"></div>
    <div class="it-lab-actions"><label class="it-check"><input type="checkbox" data-role="opt" checked> constant folding (optimise)</label></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The stack machine here is close to the Java Virtual Machine and WebAssembly, which also compute by pushing and popping a stack. Real compilers add many more optimisation passes and then allocate processor registers.`,
  init(root) {
    const q = s => root.querySelector(s);
    function run() {
      const x = +q('[data-i="x"]').value, y = +q('[data-i="y"]').value; q('[data-o="x"]').textContent = x; q('[data-o="y"]').textContent = y;
      try {
        const toks = lex(q('[data-role="src"]').value), ast = parseExpr(toks), opt = q('[data-role="opt"]').checked ? fold(ast) : ast, code = gen(opt), plain = gen(ast), res = execute(code, { x, y });
        q('[data-role="out"]').innerHTML = `<span class="g">1 · tokens</span>\n${toks.map(t => t.t === "op" ? t.v : `${t.t}:${t.v}`).join("  ")}\n\n<span class="g">2 · syntax tree</span>\n${showTree(ast)}\n` +
          (q('[data-role="opt"]').checked ? `<span class="g">3 · after constant folding</span>\n${showTree(opt)}\n` : "") +
          `<span class="g">4 · stack-machine code</span> <span class="d">(${code.length} instructions${q('[data-role="opt"]').checked ? `, ${plain.length} without optimising` : ""})</span>\n${res.trace.join("\n")}\n\n<span class="g">5 · result</span> = <span class="t">${+res.v.toFixed(6)}</span>`;
      } catch (e) { q('[data-role="out"]').innerHTML = `<span class="r">compile error: ${e.message}</span>`; }
    }
    root.querySelectorAll("input").forEach(x => x.addEventListener("input", run)); q('[data-role="opt"]').addEventListener("change", run); run();
  }
};

/* ------------------------------------------------- LAB 2: Curry–Howard */
function tyTokens(s) { return s.replace(/->|→/g, " > ").replace(/λ|\\/g, " \\ ").replace(/([().:,])/g, " $1 ").split(/\s+/).filter(Boolean); }
function parseTerm(src) {
  const T = tyTokens(src); let i = 0; const peek = () => T[i], eat = t => { if (T[i] !== t) throw new Error(`expected '${t}' near '${T[i] || "end"}'`); i++; };
  function type() { let a = tatom(); if (peek() === ">") { i++; return { k:"fn", a, b:type() }; } return a; }
  function tatom() { if (peek() === "(") { i++; const t = type(); if (peek() === ",") { i++; const u = type(); eat(")"); return { k:"pair", a:t, b:u }; } eat(")"); return t; } const t = T[i++]; if (!/^[A-Z]\w*$/.test(t || "")) throw new Error(`a type like A or B was expected, got '${t || "end"}'`); return { k:"base", n:t }; }
  function term() { if (peek() === "\\") { i++; const x = T[i++]; eat(":"); const ty = type(); eat("."); return { k:"lam", x, ty, body:term() }; } let f = atom(); while (peek() && peek() !== ")" && peek() !== "," && peek() !== ".") f = { k:"app", f, a:atom() }; return f; }
  function atom() { if (peek() === "(") { i++; const t = term(); if (peek() === ",") { i++; const u = term(); eat(")"); return { k:"pair", a:t, b:u }; } eat(")"); return t; }
    if (peek() === "\\") return term(); const x = T[i++]; if (!x || !/^[a-z]\w*$/.test(x)) throw new Error(`unexpected '${x || "end"}'`); if (x === "fst" || x === "snd") return { k:x, e:atom() }; return { k:"var", x }; }
  const t = term(); if (i < T.length) throw new Error(`unexpected '${T[i]}'`); return t;
}
const tyStr = t => t.k === "base" ? t.n : t.k === "pair" ? `(${tyStr(t.a)} × ${tyStr(t.b)})` : `${t.a.k === "fn" ? `(${tyStr(t.a)})` : tyStr(t.a)} → ${tyStr(t.b)}`;
const logStr = t => t.k === "base" ? t.n : t.k === "pair" ? `(${logStr(t.a)} ∧ ${logStr(t.b)})` : `${t.a.k === "fn" ? `(${logStr(t.a)})` : logStr(t.a)} ⇒ ${logStr(t.b)}`;
const tyEq = (a, b) => a.k === b.k && (a.k === "base" ? a.n === b.n : tyEq(a.a, b.a) && tyEq(a.b, b.b));
function typeOf(t, ctx) {
  switch (t.k) {
    case "var": if (!(t.x in ctx)) throw new Error(`'${t.x}' is not in scope`); return ctx[t.x];
    case "lam": return { k:"fn", a:t.ty, b:typeOf(t.body, { ...ctx, [t.x]:t.ty }) };
    case "app": { const f = typeOf(t.f, ctx), a = typeOf(t.a, ctx); if (f.k !== "fn") throw new Error(`applying something of type ${tyStr(f)}, which is not a function`); if (!tyEq(f.a, a)) throw new Error(`function expects ${tyStr(f.a)} but got ${tyStr(a)}`); return f.b; }
    case "pair": return { k:"pair", a:typeOf(t.a, ctx), b:typeOf(t.b, ctx) };
    case "fst": case "snd": { const p = typeOf(t.e, ctx); if (p.k !== "pair") throw new Error(`${t.k} needs a pair, got ${tyStr(p)}`); return t.k === "fst" ? p.a : p.b; }
  }
}
const PROOFS = [
  ["identity: A ⇒ A", "\\x:A. x"], ["modus ponens", "\\x:A. \\f:A->B. f x"], ["transitivity (compose)", "\\f:A->B. \\g:B->C. \\x:A. g (f x)"],
  ["A ∧ B ⇒ B ∧ A (swap)", "\\p:(A,B). (snd p, fst p)"], ["currying", "\\f:(A,B)->C. \\a:A. \\b:B. f (a, b)"], ["a type error", "\\f:A->B. \\x:B. f x"]
];
const chLab = {
  kicker:"CURRY–HOWARD · PROOFS ARE PROGRAMS", title:"Type-check a program, and read the theorem it proves",
  intro:`Write a program in the simply typed λ-calculus: \\x:A. body is a function taking x of type A; f x applies f; (a, b) makes a pair, with fst and snd to take it apart. The checker computes the program's type, then reads that type as logic (→ is 'implies', × is 'and'). A program that type-checks is a proof of that proposition.`,
  html:`<div class="gk-chips" data-role="pre">${PROOFS.map(([n], i) => `<button class="gk-chip${i === 2 ? " on" : ""}" data-i="${i}">${n}</button>`).join("")}</div>
    <div class="gk-row"><input class="gk-input" data-role="src" spellcheck="false"><button class="it-send" data-a="go">check</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`There is no program of type A → B for unrelated A and B, and correspondingly 'A implies B' is unprovable. Lean and Coq are, at heart, much richer versions of this checker.`,
  init(root) {
    const q = s => root.querySelector(s);
    function go() { try { const t = parseTerm(q('[data-role="src"]').value), ty = typeOf(t, {});
        q('[data-role="out"]').innerHTML = `type:     <span class="g">${tyStr(ty)}</span>\nas logic: <span class="t">${logStr(ty)}</span>\n<span class="d">✓ this program is a proof of that proposition</span>`; }
      catch (e) { q('[data-role="out"]').innerHTML = `<span class="r">✗ does not type-check: ${e.message}</span>\n<span class="d">so it proves nothing</span>`; } }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="src"]').value = PROOFS[+b.dataset.i][1]; root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); go(); }));
    q('[data-a="go"]').addEventListener("click", go); q('[data-role="src"]').addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    q('[data-role="src"]').value = PROOFS[2][1]; go();
  }
};

/* ------------------------------------------------ LAB 3: Hopper's nanosecond */
const nanoLab = {
  kicker:"GRACE HOPPER'S NANOSECOND", title:"How far does a signal travel while a computer thinks?",
  intro:`Hopper handed out pieces of wire about 30 cm (11.8 inches) long to show admirals what a nanosecond is: the distance light travels in a billionth of a second. Slide the clock speed to see how far a signal can get in one clock cycle, which is one reason chips must be small.`,
  html:`<div class="it-control"><label><span>clock speed</span><output data-o="f">3.0 GHz</output></label><input type="range" data-i="f" min="-3" max="1" step="0.01" value="0.477"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`In real wires signals travel at roughly half to two-thirds of light speed, so the true distance per cycle is shorter still. Hopper also carried a 'microsecond': a coil of wire about 300 metres long.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const f = Math.pow(10, +q('[data-i="f"]').value) * 1e9, cyc = 1 / f, dist = 299792458 * cyc;
      q('[data-o="f"]').textContent = f >= 1e9 ? (f / 1e9).toFixed(2) + " GHz" : (f / 1e6).toFixed(1) + " MHz";
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 90); ctx.clearRect(0, 0, W, H);
      const ref = 0.3, scale = (W - 40) / Math.max(ref, Math.min(dist, 3));
      ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 34); ctx.lineTo(20 + Math.min(dist, 3) * scale, 34); ctx.stroke();
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 64); ctx.lineTo(20 + ref * scale, 64); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText(dist > 3 ? "distance per cycle (off the scale →)" : "distance per cycle", 20, 24); ctx.fillText("Hopper's nanosecond wire, 30 cm", 20, 80);
      q('[data-role="out"]').innerHTML = `one clock cycle = <span class="g">${cyc >= 1e-6 ? (cyc * 1e6).toFixed(3) + " µs" : (cyc * 1e9).toFixed(3) + " ns"}</span>\nlight travels <span class="t">${dist >= 1 ? dist.toFixed(1) + " m" : (dist * 100).toFixed(1) + " cm"}</span> in that time\n<span class="d">ENIAC ran at about 100 kHz; a modern CPU core at 3–5 GHz</span>`;
    }
    q('[data-i="f"]').addEventListener("input", draw); draw();
  }
};

register("compilers", {
  kicker:"COMPILERS & TYPE THEORY · 1952–NOW · ABOUT 40 MIN",
  hook:"People told Grace Hopper computers could only do arithmetic. She built one that wrote programs. Seventy years later, the same idea (programs that read and check other programs) is verifying mathematical proofs.",
  intro:`A compiler translates programs written for people into instructions for machines, and a type system checks, before anything runs, that the pieces fit. Underneath lies a surprise, the Curry–Howard correspondence: checking a program's type is the same as checking a logical proof. Three labs below: compile an expression through every stage, type-check programs and read the theorems they prove, and hold Hopper's nanosecond.`,
  timeline:[[1947, "the moth ('bug')"], [1952, "A-0 compiler"], [1969, "Curry–Howard"], [1978, "ML type inference"], [1989, "Coq"], [2013, "Lean"]],
  labs:[compLab, chLab, nanoLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, type 1 + 2 * 3 and check the tree: * sits below +, so it happens first. Then type (1 + 2) * 3.",
    "Toggle constant folding in Lab 1 on '2 * (x + 3) + 4 * 5 * y' and count the instructions saved. Then try 'x * 0 + y'.",
    "In Lab 2, load 'a type error' and read the message. Fix it so it proves (A → B) → A → B.",
    "Still in Lab 2, write a program of type A → (B → A). (Hint: take x, ignore y.) As logic: 'if A holds, then B implies A'.",
    "In Lab 3, set the clock to 5 GHz: a signal can't cross even a large chip and back in one cycle, which is why chip design is so hard."
  ],
  sources:SOURCES
});
})();
