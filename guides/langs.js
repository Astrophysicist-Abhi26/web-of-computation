// LANGUAGES & PARADIGMS — Fortran's formulas, LISP's code-as-data, C's
// closeness to the machine, Python's glue. Three real labs: the same program
// in four languages, a working LISP interpreter (define, lambda, recursion,
// quote — code is data), and mark-and-sweep garbage collection, invented
// for LISP in 1959.
(function () {
"use strict";
const { register, canvas, C } = GuideKit;

const CHAPTERS = [
  { icon:"🧮", title:"1957 — Fortran: formulas the computer can translate",
    who:"John Backus and a team at IBM",
    lead:"Programmers wrote in machine code or assembly until a small IBM team showed that a compiler could turn mathematical formulas into code as fast as a human expert's.",
    formula:"Y = A*X**2 + B*X + C      →      compiled machine instructions for the IBM 704",
    what:`FORTRAN (FORmula TRANslation) let scientists write expressions and loops in something close to algebra.
      Its compiler worked hard to optimise, because Backus knew nobody would use it if it produced slower code
      than hand-written assembly.`,
    how:`The first compiler took 18 person-years to build. It introduced ideas every compiler still uses: parsing
      expressions with operator precedence, and optimising loops and register use.`,
    story:`Backus said he started the project partly out of laziness: he hated writing programs. He later received
      the Turing Award (1977) and used his lecture to criticise the style of language he had created, calling
      for functional programming instead.`,
    today:`Fortran is still used for weather forecasting, climate models and physics simulations, and much of
      NumPy and SciPy sits on top of Fortran numerical libraries (BLAS and LAPACK).` },
  { icon:"(λ)", title:"1958 — LISP: code is data",
    who:"John McCarthy · MIT",
    lead:"McCarthy wanted a language for AI research based on mathematical functions. The result was so simple that a program and the data it works on have the same shape.",
    formula:"(define (fact n) (if (< n 2) 1 (* n (fact (- n 1)))))      — a list that is also a program",
    what:`In LISP everything is a list in parentheses, including the program itself. A program can therefore
      build, inspect and rewrite other programs. LISP introduced conditional expressions, recursion as the
      normal way to loop, the read–eval–print loop, and automatic garbage collection. Lab 2 is a working LISP.`,
    how:`McCarthy described eval, a LISP function that interprets LISP, in about a page. His student Steve Russell
      noticed eval could be implemented directly in machine code, and suddenly there was an interpreter.`,
    story:`LISP was the language of AI for about 30 years, from MIT's AI Lab to the LISP machines of the 1980s whose
      market collapse helped cause AI Winter II. Its descendants include Scheme, Common Lisp, Clojure and Emacs
      Lisp.`,
    today:`LISP's ideas colonised every language: garbage collection, first-class functions, closures and REPLs are
      standard in Python and JavaScript. The map marks LISP 🧟 revived for good reason.` },
  { icon:"⚙️", title:"1972 — C: close to the machine, portable across machines",
    who:"Dennis Ritchie · Bell Labs",
    lead:"C gave programmers direct control of memory, bits and addresses, while still being portable from one computer to another. It became the language operating systems are written in.",
    formula:"int *p = &x;  *p = 42;      — pointers: variables that hold memory addresses",
    what:`C is small and sits close to the hardware: you manage memory yourself, and a pointer is just an address.
      That made it fast and flexible enough to write Unix itself, which is why Unix could move to new computers
      easily.`,
    how:`With control comes risk: forget to free memory and it leaks; write past the end of an array and you may
      corrupt other data or open a security hole. Many serious security bugs of the last 40 years are memory
      errors in C and C++.`,
    story:`Ritchie developed C from Ken Thompson's language B while they were building Unix. "The C Programming
      Language" (1978), written with Brian Kernighan, started every tutorial since with "hello, world".`,
    today:`Linux, Windows, macOS, databases, Python's main interpreter and GPU drivers are written largely in C or
      C++. Memory-safe newcomers such as Rust are now replacing it in some of those places.` },
  { icon:"🐍", title:"1991 — Python: readable glue",
    who:"Guido van Rossum · CWI, Amsterdam",
    lead:"A language designed to be easy to read, which became the accidental language of AI because it could glue fast C, Fortran and CUDA code together.",
    formula:"y = model(x)      — one Python line; billions of GPU operations underneath",
    what:`Python is slow on its own, but it doesn't need to be fast: NumPy, PyTorch and TensorFlow do their heavy
      work in compiled C, C++, Fortran and CUDA, and Python just orchestrates. Researchers get readable code and
      fast execution.`,
    how:`Automatic differentiation libraries (the gold bridge "Python + autodiff" on the map) let researchers write
      a model as ordinary Python and get gradients for free, which made experimenting with new architectures
      fast.`,
    story:`Van Rossum started Python as a hobby project over the 1989 Christmas holidays and named it after Monty
      Python's Flying Circus. He was the language's "Benevolent Dictator For Life" until he stepped down in 2018.`,
    today:`Python is the most-used language for data science and machine learning, and in several rankings the most
      popular language overall. The map marks it 🔥.` },
  { icon:"🔀", title:"Paradigms — different ways to think about a program",
    who:"imperative · functional · object-oriented · logic",
    lead:"A paradigm is a style of thinking: a sequence of commands, a composition of functions, a society of objects, or a set of logical facts.",
    formula:"imperative: do this, then this · functional: this is that function of those · OO: objects send messages · logic: these facts hold",
    what:`Imperative languages (Fortran, C) change state step by step. Functional languages (LISP, Haskell) build
      programs from functions without changing state. Object-oriented languages (Simula 1967, Smalltalk,
      Java) bundle data with behaviour. Logic languages (Prolog, in the Symbolic AI guide) state facts and let
      the system infer.`,
    how:`Most modern languages mix paradigms: Python and JavaScript are imperative, object-oriented and partly
      functional. Choosing a style for each problem is part of good programming.`,
    story:`The functional style has roots in Church's λ-calculus (1936), the same mathematics as the Turing
      machine, which the map links with the gold bridge "λ-calculus → LISP".`,
    today:`Functional ideas (immutable data, map/filter/reduce, pure functions) are central to data pipelines and to
      JAX, a machine learning library built on function transformations.` }
];

const SOURCES = [
  { type:"FORTRAN · 1957", title:"Backus et al. — The FORTRAN Automatic Coding System", note:"Proceedings of the Western Joint Computer Conference. The first optimising compiler.", url:"https://doi.org/10.1145/1455567.1455599" },
  { type:"LISP · 1960", title:"John McCarthy — Recursive Functions of Symbolic Expressions and Their Computation by Machine", note:"CACM 3(4). LISP, eval, and garbage collection.", url:"https://doi.org/10.1145/367177.367199" },
  { type:"BACKUS'S TURING LECTURE · 1978", title:"John Backus — Can Programming Be Liberated from the von Neumann Style?", note:"The creator of Fortran argues for functional programming.", url:"https://doi.org/10.1145/359576.359579" },
  { type:"C · 1993", title:"Dennis Ritchie — The Development of the C Language", note:"The creator's own history.", url:"https://doi.org/10.1145/154766.155580" },
  { type:"THE BOOK · FREE", title:"Abelson & Sussman — Structure and Interpretation of Computer Programs", note:"The classic LISP-based introduction to programming, free online.", url:"https://mitpress.mit.edu/sites/default/files/sicp/index.html" },
  { type:"PYTHON · HISTORY", title:"Guido van Rossum — The History of Python (blog)", note:"How and why Python was designed, by its creator.", url:"https://python-history.blogspot.com/" },
  { type:"TUTORIAL", title:"Peter Norvig — (How to Write a (Lisp) Interpreter (in Python))", note:"The inspiration for Lab 2: a LISP in about a hundred lines.", url:"https://norvig.com/lispy.html" }
];

/* ---------------------------------------------------- LAB 1: four languages */
const TASKS = {
  "sum of squares 1..10":{
    Fortran:`      PROGRAM SUMSQ\n      INTEGER I, S\n      S = 0\n      DO 10 I = 1, 10\n        S = S + I**2\n   10 CONTINUE\n      PRINT *, S\n      END`,
    LISP:`(define (sumsq n)\n  (if (= n 0)\n      0\n      (+ (* n n) (sumsq (- n 1)))))\n\n(sumsq 10)`,
    C:`#include <stdio.h>\n\nint main(void) {\n    int s = 0;\n    for (int i = 1; i <= 10; i++)\n        s += i * i;\n    printf("%d\\n", s);\n    return 0;\n}`,
    Python:`print(sum(i * i for i in range(1, 11)))`, result:"385",
    notes:{ Fortran:"A counted DO loop with a numeric label; I**2 is exponentiation. Fixed columns: code starts in column 7.", LISP:"No loop at all: recursion, and the program is itself a list.", C:"Explicit types, a for loop, and printf. Compiles to a handful of machine instructions.", Python:"One line: a generator expression inside sum(). Reads almost like the maths." } },
  "factorial of 10":{
    Fortran:`      INTEGER FUNCTION FACT(N)\n      INTEGER N, I\n      FACT = 1\n      DO 10 I = 2, N\n        FACT = FACT * I\n   10 CONTINUE\n      END`,
    LISP:`(define (fact n)\n  (if (< n 2)\n      1\n      (* n (fact (- n 1)))))\n\n(fact 10)`,
    C:`long fact(int n) {\n    return n < 2 ? 1 : n * fact(n - 1);\n}`,
    Python:`import math\nprint(math.factorial(10))`, result:"3628800",
    notes:{ Fortran:"Early Fortran had no recursion, so loops were the only way.", LISP:"Recursion is the natural style: the definition reads like the maths.", C:"Recursion works, with a fixed-size integer: fact(21) overflows a 64-bit long.", Python:"Batteries included; Python integers never overflow." } }
};
const polyLab = {
  kicker:"ONE PROGRAM, FOUR LANGUAGES", title:"Fortran, LISP, C and Python side by side",
  intro:`Pick a task and a language. Each version computes the same answer; the note explains what that language makes easy or hard. Sixty years of language design fit in one screen.`,
  html:`<div class="gk-chips" data-role="task">${Object.keys(TASKS).map((t, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-t="${t}">${t}</button>`).join("")}</div>
    <div class="gk-chips" data-role="lang">${["Fortran", "LISP", "C", "Python"].map((l, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-l="${l}">${l} · ${{ Fortran:1957, LISP:1958, C:1972, Python:1991 }[l]}</button>`).join("")}</div>
    <div class="gk-out" data-role="code"></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`The LISP versions run for real in Lab 2: copy one in and evaluate it.`,
  init(root) {
    const q = s => root.querySelector(s); let t = Object.keys(TASKS)[0], l = "Fortran";
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    function draw() { const T = TASKS[t]; q('[data-role="code"]').innerHTML = esc(T[l]); q('[data-role="out"]').innerHTML = `result: <span class="g">${T.result}</span>   ·   lines: ${T[l].split("\n").length}\n<span class="d">${T.notes[l]}</span>`; }
    root.querySelectorAll('[data-role="task"] .gk-chip').forEach(b => b.addEventListener("click", () => { t = b.dataset.t; root.querySelectorAll('[data-role="task"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    root.querySelectorAll('[data-role="lang"] .gk-chip').forEach(b => b.addEventListener("click", () => { l = b.dataset.l; root.querySelectorAll('[data-role="lang"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    draw();
  }
};

/* ------------------------------------------------------ LAB 2: a LISP */
function lispTokenize(s) { return s.replace(/;.*$/gm, "").replace(/\(/g, " ( ").replace(/\)/g, " ) ").replace(/'/g, " ' ").split(/\s+/).filter(Boolean); }
function lispRead(tokens) {
  if (!tokens.length) throw new Error("unexpected end of input");
  const t = tokens.shift();
  if (t === "(") { const L = []; while (tokens[0] !== ")") { if (!tokens.length) throw new Error("missing )"); L.push(lispRead(tokens)); } tokens.shift(); return L; }
  if (t === ")") throw new Error("unexpected )");
  if (t === "'") return [{ sym:"quote" }, lispRead(tokens)];
  const n = Number(t); return isNaN(n) ? (t === "#t" ? true : t === "#f" ? false : { sym:t }) : n;
}
class Env { constructor(vars, outer) { this.v = vars; this.o = outer; } find(s) { return s in this.v ? this : this.o ? this.o.find(s) : null; } }
function globalEnv(out) {
  const g = new Env({
    "+":(...a) => a.reduce((x, y) => x + y, 0), "-":(a, ...b) => b.length ? b.reduce((x, y) => x - y, a) : -a, "*":(...a) => a.reduce((x, y) => x * y, 1), "/":(a, b) => a / b,
    "<":(a, b) => a < b, ">":(a, b) => a > b, "=":(a, b) => a === b, "<=":(a, b) => a <= b, ">=":(a, b) => a >= b,
    car:l => l[0], cdr:l => l.slice(1), cons:(a, l) => [a].concat(l), list:(...a) => a, "null?":l => Array.isArray(l) && !l.length, length:l => l.length,
    map:(f, l) => l.map(x => f(x)), filter:(f, l) => l.filter(x => f(x)), apply:(f, l) => f(...l), display:x => { out.push(show(x)); return x; },
    not:x => x === false, "number?":x => typeof x === "number", "list?":x => Array.isArray(x), mod:(a, b) => a % b, sqrt:Math.sqrt
  });
  return g;
}
let steps = 0;
function lispEval(x, env) {
  if (++steps > 200000) throw new Error("too many steps (infinite recursion?)");
  if (x && x.sym !== undefined) { const e = env.find(x.sym); if (!e) throw new Error(`unbound symbol: ${x.sym}`); return e.v[x.sym]; }
  if (!Array.isArray(x)) return x;
  if (!x.length) return [];
  const [op, ...args] = x, name = op && op.sym;
  if (name === "quote") return strip(args[0]);
  if (name === "if") return lispEval(lispEval(args[0], env) !== false ? args[1] : args[2], env);
  if (name === "define") { if (Array.isArray(args[0])) { const [f, ...ps] = args[0]; env.v[f.sym] = makeLambda(ps, args.slice(1), env); return f.sym; } env.v[args[0].sym] = lispEval(args[1], env); return args[0].sym; }
  if (name === "lambda") return makeLambda(args[0], args.slice(1), env);
  if (name === "let") { const e = new Env({}, env); args[0].forEach(([s, v]) => e.v[s.sym] = lispEval(v, env)); let r; args.slice(1).forEach(b => r = lispEval(b, e)); return r; }
  if (name === "begin") { let r; args.forEach(a => r = lispEval(a, env)); return r; }
  const f = lispEval(op, env); if (typeof f !== "function") throw new Error(`${show(strip(op))} is not a function`);
  return f(...args.map(a => lispEval(a, env)));
}
function makeLambda(params, body, env) { const f = (...vals) => { const e = new Env({}, env); params.forEach((p, i) => e.v[p.sym] = vals[i]); let r; body.forEach(b => r = lispEval(b, e)); return r; }; f.lisp = true; return f; }
const strip = x => x && x.sym !== undefined ? x.sym : Array.isArray(x) ? x.map(strip) : x;
function show(x) { if (typeof x === "function") return "#<procedure>"; if (Array.isArray(x)) return "(" + x.map(show).join(" ") + ")"; if (x === true) return "#t"; if (x === false) return "#f"; return String(x); }
const EXAMPLES = {
  "factorial":"(define (fact n)\n  (if (< n 2) 1 (* n (fact (- n 1)))))\n(fact 20)",
  "map & lambda":"(map (lambda (x) (* x x)) '(1 2 3 4 5))",
  "code is data":"(define prog '(+ 1 2 3))\n(display (car prog))   ; the operator, as data\n(apply + (cdr prog))   ; …and now run it",
  "closures":"(define (make-adder n) (lambda (x) (+ x n)))\n(define add10 (make-adder 10))\n(add10 32)",
  "fibonacci":"(define (fib n) (if (< n 2) n (+ (fib (- n 1)) (fib (- n 2)))))\n(map fib '(0 1 2 3 4 5 6 7 8 9 10))"
};
const lispLab = {
  kicker:"LISP · A WORKING INTERPRETER", title:"Write LISP, and watch code turn out to be data",
  intro:`This is a real (small) LISP interpreter: numbers, lists, define, lambda, if, let, quote, recursion and closures. Pick an example or write your own, then press evaluate. The whole interpreter is about 60 lines of JavaScript, in the spirit of McCarthy's one-page eval.`,
  html:`<div class="gk-chips" data-role="ex">${Object.keys(EXAMPLES).map((k, i) => `<button class="gk-chip${i === 0 ? " on" : ""}" data-k="${k}">${k}</button>`).join("")}</div>
    <textarea class="gk-input" data-role="src" rows="6" spellcheck="false" style="width:100%;font-family:'IBM Plex Mono',monospace;resize:vertical"></textarea>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ evaluate</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Everything above, including define and lambda, is a list the interpreter reads and walks. That uniformity is why LISP was the natural language for programs that write programs, and for early AI.`,
  init(root) {
    const q = s => root.querySelector(s);
    function run() {
      const out = [], env = globalEnv(out), lines = []; steps = 0;
      try { const toks = lispTokenize(q('[data-role="src"]').value); while (toks.length) { const form = lispRead(toks); const v = lispEval(form, env); lines.push(`<span class="d">${show(strip(form)).slice(0, 60)}</span>\n  ⇒ <span class="g">${show(v)}</span>`); } }
      catch (e) { lines.push(`<span class="r">error: ${e.message}</span>`); }
      q('[data-role="out"]').innerHTML = (out.length ? `display: ${out.join(" ")}\n` : "") + lines.join("\n") + `\n<span class="d">${steps.toLocaleString()} evaluation steps</span>`;
    }
    root.querySelectorAll('[data-role="ex"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="src"]').value = EXAMPLES[b.dataset.k]; root.querySelectorAll('[data-role="ex"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); run(); }));
    q('[data-a="run"]').addEventListener("click", run);
    q('[data-role="src"]').value = EXAMPLES.factorial; run();
  }
};

/* ------------------------------------------------ LAB 3: garbage collection */
const gcLab = {
  kicker:"GARBAGE COLLECTION · LISP 1959", title:"Mark what's reachable, sweep the rest",
  intro:`Memory holds objects that point to each other. Programs reach them from 'roots' (variables currently in use). Click an arrow's object to drop its references, or add new objects, then collect: the mark phase follows pointers from the roots; the sweep phase frees everything unmarked, including cycles that point only to each other.`,
  html:`<canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="it-lab-actions"><button class="it-send" data-a="mark">1 · mark</button><button class="it-send" data-a="sweep">2 · sweep</button><button class="gk-ghost" data-a="alloc">allocate new object</button><button class="gk-ghost" data-a="reset">reset heap</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`McCarthy added garbage collection to LISP so programmers wouldn't have to free memory by hand. Java, Python, JavaScript and Go all collect garbage today; C and C++ programmers still manage memory themselves.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'); let objs, edges, roots, marked, freed = 0, geo = [];
    function reset() {
      objs = [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ id:i, alive:true })); roots = [0, 1];
      edges = [[0, 2], [2, 3], [1, 4], [4, 2], [5, 6], [6, 5], [7, 3]]; marked = new Set(); freed = 0;
    }
    function draw(msg) {
      const { ctx, w:W, h:H } = canvas(cv, 200); ctx.clearRect(0, 0, W, H); geo = [];
      const live = objs.filter(o => o.alive), cols = 5;
      live.forEach((o, i) => { geo[o.id] = [40 + (i % cols) * (W - 80) / (cols - 1), 50 + Math.floor(i / cols) * 90]; });
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; ctx.fillText("roots", 4, 12);
      roots.forEach(r => { if (!geo[r]) return; const [x, y] = geo[r]; ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, y - 16); ctx.stroke(); });
      edges.forEach(([a, b]) => { if (!geo[a] || !geo[b]) return; const [x1, y1] = geo[a], [x2, y2] = geo[b], ang = Math.atan2(y2 - y1, x2 - x1);
        ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x1 + Math.cos(ang) * 16, y1 + Math.sin(ang) * 16); const ex = x2 - Math.cos(ang) * 17, ey = y2 - Math.sin(ang) * 17; ctx.lineTo(ex, ey); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - Math.cos(ang - .4) * 7, ey - Math.sin(ang - .4) * 7); ctx.lineTo(ex - Math.cos(ang + .4) * 7, ey - Math.sin(ang + .4) * 7); ctx.fill(); });
      live.forEach(o => { const [x, y] = geo[o.id]; ctx.fillStyle = marked.has(o.id) ? "rgba(63,208,201,.85)" : "rgba(154,147,184,.35)"; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "11px IBM Plex Mono, monospace"; ctx.fillText("#" + o.id, x, y + 4); ctx.textAlign = "left"; });
      q('[data-role="out"]').innerHTML = (msg ? msg + "\n" : "") + `objects in memory: <span class="g">${live.length}</span>   marked reachable: <span class="t">${marked.size}</span>   freed so far: ${freed}\n<span class="d">click an object to delete all pointers out of it</span>`;
    }
    function mark() { marked = new Set(); const stack = roots.slice(); while (stack.length) { const x = stack.pop(); if (marked.has(x) || !objs[x].alive) continue; marked.add(x); edges.filter(e => e[0] === x).forEach(e => stack.push(e[1])); } }
    q('[data-a="mark"]').addEventListener("click", () => { mark(); draw("mark: followed every pointer from the roots"); });
    q('[data-a="sweep"]').addEventListener("click", () => { if (!marked.size) mark(); let k = 0; objs.forEach(o => { if (o.alive && !marked.has(o.id)) { o.alive = false; k++; } }); edges = edges.filter(([a, b]) => objs[a].alive && objs[b].alive); freed += k; marked = new Set(); draw(`sweep: freed ${k} unreachable object(s)`); });
    q('[data-a="alloc"]').addEventListener("click", () => { const id = objs.length; objs.push({ id, alive:true }); const live = objs.filter(o => o.alive && o.id !== id); edges.push([live[(Math.random() * live.length) | 0].id, id]); marked = new Set(); draw(`allocated #${id}, pointed to by an existing object`); });
    q('[data-a="reset"]').addEventListener("click", () => { reset(); draw("fresh heap: note #5 and #6 point only to each other"); });
    cv.addEventListener("click", e => { const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; const hit = geo.findIndex(g => g && Math.hypot(g[0] - x, g[1] - y) < 16);
      if (hit >= 0) { edges = edges.filter(([a]) => a !== hit); roots = roots.filter(r => r !== hit || false); marked = new Set(); draw(`removed every pointer out of #${hit}${hit < 2 ? " (and dropped it as a root)" : ""}`); } });
    reset(); draw("fresh heap: note #5 and #6 point only to each other");
  }
};

register("langs", {
  kicker:"LANGUAGES & PARADIGMS · 1957–NOW · ABOUT 40 MIN",
  hook:"The language most AI research is written in was started as a hobby over a Christmas holiday and named after a comedy show. The ideas it runs on (garbage collection, first-class functions, the interactive prompt) came from a 1958 language for AI.",
  intro:`A programming language is an agreement between people and machines about how to describe computation. Fortran made formulas translatable, LISP made code into data, C made systems portable, and Python made everything glue together. Three labs below: read one program in four languages, run a working LISP interpreter, and watch a garbage collector find and free unreachable memory.`,
  timeline:[[1957, "Fortran"], [1958, "LISP"], [1967, "Simula (objects)"], [1972, "C"], [1991, "Python"]],
  labs:[polyLab, lispLab, gcLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, compare the Fortran and Python versions of the sum of squares: count what each makes you write that the other doesn't.",
    "In Lab 2, run 'code is data', then write (define (square x) (* x x)) and (map square '(1 2 3)).",
    "Still in Lab 2, try (fact 200). JavaScript numbers overflow to Infinity here; real LISPs have exact big integers, as Python does.",
    "In Lab 3, press mark then sweep on the fresh heap: #5 and #6 are freed even though they point to each other. Simple reference counting would leak them.",
    "Click root #0 in Lab 3 to drop its pointers, then collect: watch how much of the heap becomes garbage at once."
  ],
  sources:SOURCES
});
})();
