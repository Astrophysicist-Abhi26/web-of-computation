/* ============================================================
   THE WEB OF COMPUTATION — atoms4.js  (Wave 2)
   Eleven new playable atoms:
     Foundations  · λ-calculus reducer · Busy beaver
     Hardware     · Difference engine · Cache simulator
     Info/Crypto  · BB84 quantum key exchange · RSA from scratch
                  · Diffie–Hellman paint mixing · Birthday attack
                  · Compression shoot-out
     ML & DL      · Tiny language model · GAN tug-of-war
   The pure logic (reducer, machines, ciphers, codecs, GAN maths)
   comes first and is exposed as window.WOC_W2 for tests; the
   atoms register through WOC_ATOMS (atoms2.js).
   ============================================================ */
(function () {
"use strict";

/* ============================================================
   CORE LOGIC (no DOM)
   ============================================================ */
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function randn(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/* ---------- λ-calculus: parse, print, normal-order β-reduction ---------- */
const LAM_DEFS = {
  I: "λx.x", K: "λx y.x", S: "λx y z.x z (y z)", OMEGA: "(λx.x x)(λx.x x)", Y: "λf.(λx.f (x x))(λx.f (x x))",
  TRUE: "λt f.t", FALSE: "λt f.f", AND: "λp q.p q p", OR: "λp q.p p q", NOT: "λp.p FALSE TRUE", IF: "λb t e.b t e",
  SUCC: "λn f x.f (n f x)", PLUS: "λm n f x.m f (n f x)", MULT: "λm n f.m (n f)", POW: "λb e.e b",
  PRED: "λn f x.n (λg h.h (g f)) (λu.x) (λu.u)", ISZERO: "λn.n (λx.FALSE) TRUE",
};
function lamTokens(s) {
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "λ" || c === "\\") { out.push("λ"); i++; continue; }
    if ("().".includes(c)) { out.push(c); i++; continue; }
    const m = /^[A-Za-z0-9_']+/.exec(s.slice(i));
    if (!m) throw new Error("unexpected '" + c + "'");
    out.push(m[0]); i += m[0].length;
  }
  return out;
}
function church(n) { let b = { t:"v", n:"x" }; for (let i = 0; i < n; i++) b = { t:"a", f:{ t:"v", n:"f" }, x:b }; return { t:"l", v:"f", b:{ t:"l", v:"x", b } }; }
function lamParse(src, depth = 0) {
  if (depth > 8) throw new Error("definitions nest too deeply");
  const tk = lamTokens(src); let p = 0;
  const peek = () => tk[p], eat = t => { if (tk[p] !== t) throw new Error(`expected '${t}'`); p++; };
  function term() {
    if (peek() === "λ") {
      p++; const vs = [];
      while (peek() && peek() !== ".") vs.push(tk[p++]);
      if (!vs.length) throw new Error("λ needs a variable");
      eat(".");
      let b = term();
      for (let i = vs.length - 1; i >= 0; i--) b = { t:"l", v:vs[i], b };
      return b;
    }
    let f = atom(); if (!f) throw new Error("empty expression");
    for (;;) {
      if (peek() === "λ") { f = { t:"a", f, x:term() }; break; }
      const x = atom(); if (!x) break;
      f = { t:"a", f, x };
    }
    return f;
  }
  function atom() {
    const t = peek();
    if (t === "(") { p++; const e = term(); eat(")"); return e; }
    if (t === undefined || t === ")" || t === ".") return null;
    p++;
    if (/^\d+$/.test(t)) return church(+t);
    if (LAM_DEFS[t]) return lamParse(LAM_DEFS[t], depth + 1);
    return { t:"v", n:t };
  }
  const e = term();
  if (p < tk.length) throw new Error("unexpected '" + tk[p] + "'");
  return e;
}
function lamFree(e, s = new Set()) {
  if (e.t === "v") s.add(e.n);
  else if (e.t === "l") { const inner = lamFree(e.b); inner.delete(e.v); inner.forEach(v => s.add(v)); }
  else { lamFree(e.f, s); lamFree(e.x, s); }
  return s;
}
function fresh(v, avoid) { let n = v; while (avoid.has(n)) n += "'"; return n; }
function subst(e, v, r) {          // e[v := r], capture-avoiding
  if (e.t === "v") return e.n === v ? r : e;
  if (e.t === "a") return { t:"a", f:subst(e.f, v, r), x:subst(e.x, v, r) };
  if (e.v === v) return e;
  const fr = lamFree(r);
  if (fr.has(e.v)) {
    const nv = fresh(e.v, new Set([...fr, ...lamFree(e.b), v]));
    return { t:"l", v:nv, b:subst(subst(e.b, e.v, { t:"v", n:nv }), v, r) };
  }
  return { t:"l", v:e.v, b:subst(e.b, v, r) };
}
function lamStep(e) {              // one leftmost-outermost β-step, or null if normal
  if (e.t === "a") {
    if (e.f.t === "l") return subst(e.f.b, e.f.v, e.x);
    const f = lamStep(e.f); if (f) return { t:"a", f, x:e.x };
    const x = lamStep(e.x); if (x) return { t:"a", f:e.f, x };
    return null;
  }
  if (e.t === "l") { const b = lamStep(e.b); return b ? { t:"l", v:e.v, b } : null; }
  return null;
}
function lamShow(e) {
  if (e.t === "v") return e.n;
  if (e.t === "l") { const vs = [e.v]; let b = e.b; while (b.t === "l") { vs.push(b.v); b = b.b; } return "λ" + vs.join(" ") + "." + lamShow(b); }
  const f = e.f.t === "l" ? "(" + lamShow(e.f) + ")" : lamShow(e.f);
  const x = e.x.t === "v" ? lamShow(e.x) : "(" + lamShow(e.x) + ")";
  return f + " " + x;
}
function lamSize(e) { return e.t === "v" ? 1 : e.t === "l" ? 1 + lamSize(e.b) : lamSize(e.f) + lamSize(e.x); }
function lamReadNumber(e) {        // λf.λx.f(…(f x)) → n
  if (e.t !== "l" || e.b.t !== "l") return null;
  const f = e.v, x = e.b.v; let b = e.b.b, n = 0;
  while (b.t === "a" && b.f.t === "v" && b.f.n === f) { n++; b = b.x; }
  return b.t === "v" && b.n === x && f !== x ? n : null;
}
function lamReadBool(e) {
  if (e.t !== "l" || e.b.t !== "l" || e.b.b.t !== "v" || e.v === e.b.v) return null;
  return e.b.b.n === e.v ? true : e.b.b.n === e.b.v ? false : null;
}
function lamRun(src, max = 400) {
  let e = lamParse(src); const steps = [e];
  for (let i = 0; i < max; i++) { const n = lamStep(e); if (!n) return { steps, done:true }; e = n; steps.push(e); if (lamSize(e) > 4000) return { steps, done:false, blown:true }; }
  return { steps, done:false };
}

/* ---------- busy beaver: 2-symbol Turing machines in bbchallenge notation ---------- */
function bbParse(code) {             // "1RB1LB_1LA0LC_…"; "---" or Z/H in the next-state slot = halt
  const rows = code.trim().split("_");
  return rows.map((row, i) => {
    if (!/^([01][LR][A-Z]|---){2}$/.test(row)) throw new Error(`state ${String.fromCharCode(65 + i)}: expected like 1RB0LC`);
    return [row.slice(0, 3), row.slice(3, 6)].map(t => t === "---" ? { halt:true, w:1, d:1, s:-1 } :
      { w:+t[0], d:t[1] === "R" ? 1 : -1, s:(t[2] === "Z" || t[2] === "H") ? -1 : t.charCodeAt(2) - 65, halt:t[2] === "Z" || t[2] === "H" });
  });
}
function bbMachine(code) { return { T:bbParse(code), tape:new Map(), head:0, state:0, steps:0, halted:false, lo:0, hi:0 }; }
function bbStep(M) {
  if (M.halted) return false;
  const r = M.tape.get(M.head) || 0, tr = M.T[M.state][r];
  if (tr.w) M.tape.set(M.head, 1); else M.tape.delete(M.head);
  M.head += tr.d; M.steps++;
  if (M.head < M.lo) M.lo = M.head; if (M.head > M.hi) M.hi = M.head;
  if (tr.halt || tr.s < 0) { M.halted = true; return false; }
  if (tr.s >= M.T.length) throw new Error("jump to a state that doesn't exist");
  M.state = tr.s; return true;
}
function bbFast(code, limit) {       // tight loop on a typed array, for BB(5)'s 47 million steps
  const T = bbParse(code), N = 1 << 16, tape = new Uint8Array(N);
  const W = [], D = [], S = [];
  T.forEach((row, q) => row.forEach((t, r) => { W[q * 2 + r] = t.w; D[q * 2 + r] = t.d; S[q * 2 + r] = t.halt ? -1 : t.s; }));
  let h = N >> 1, q = 0, steps = 0;
  while (steps < limit) {
    const k = q * 2 + tape[h]; tape[h] = W[k]; h += D[k]; steps++;
    if (h < 0 || h >= N) return { steps, halted:false, ones:-1, out:true };
    q = S[k]; if (q < 0) { let ones = 0; for (let i = 0; i < N; i++) ones += tape[i]; return { steps, halted:true, ones }; }
  }
  return { steps, halted:false };
}
const BB_PRESETS = [
  { n:"BB(2) champion", code:"1RB1LB_1LA1RZ", note:"Two states: halts after 6 steps with 4 ones. Nobody can do better with two states." },
  { n:"BB(3) champion", code:"1RB1RZ_1LB0RC_1LC1LA", note:"Three states: 21 steps, the most any halting 3-state machine takes." },
  { n:"BB(4) champion", code:"1RB1LB_1LA0LC_1RZ1LD_1RD0RA", note:"Four states: 107 steps and 13 ones (Brady, 1983)." },
  { n:"BB(5) champion", code:"1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA", note:"Five states: 47,176,870 steps and 4,098 ones (Marxen & Buntrock, 1989). In 2024 the bbchallenge collaboration proved, with a proof checked in Coq, that no 5-state machine that halts runs longer." },
  { n:"a counter that never halts", code:"1RB0LA_1LA1RB", note:"This one never halts. The halting problem says no program can sort every machine into 'halts' and 'runs forever', which is why BB(n) can't be computed in general." },
];

/* ---------- RSA ---------- */
const PRIMES = []; for (let n = 11; n < 400; n++) { let p = true; for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; } if (p) PRIMES.push(n); }
function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
function modInv(a, m) { let [r0, r1, s0, s1] = [a, m, 1, 0]; while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; } return r0 === 1 ? ((s0 % m) + m) % m : null; }
function modPow(b, e, m) { let r = 1n, x = BigInt(b) % BigInt(m); let k = BigInt(e); const M = BigInt(m); while (k > 0n) { if (k & 1n) r = r * x % M; x = x * x % M; k >>= 1n; } return Number(r); }
function rsaKeys(p, q, e) {
  const n = p * q, phi = (p - 1) * (q - 1);
  let E = e; while (gcd(E, phi) !== 1) E += 2;
  return { p, q, n, phi, e:E, d:modInv(E, phi) };
}
function factorTrial(n) { let tries = 0; for (let d = 2; d * d <= n; d++) { tries++; if (n % d === 0) return { p:d, q:n / d, tries }; } return { p:n, q:1, tries }; }

/* ---------- compression ---------- */
function huffLengths(bytes) {
  const f = new Map(); bytes.forEach(b => f.set(b, (f.get(b) || 0) + 1));
  let nodes = [...f].map(([s, c]) => ({ c, s }));
  if (nodes.length === 1) return new Map([[nodes[0].s, 1]]);
  while (nodes.length > 1) { nodes.sort((a, b) => a.c - b.c); const a = nodes.shift(), b = nodes.shift(); nodes.push({ c:a.c + b.c, l:a, r:b }); }
  const L = new Map(); (function walk(n, d) { if (n.s !== undefined) { L.set(n.s, d); return; } walk(n.l, d + 1); walk(n.r, d + 1); })(nodes[0], 0);
  return L;
}
function cmpAll(text) {
  const bytes = [...new TextEncoder().encode(text)], N = bytes.length;
  const f = new Map(); bytes.forEach(b => f.set(b, (f.get(b) || 0) + 1));
  let H = 0; for (const c of f.values()) { const p = c / N; H -= p * Math.log2(p); }
  // run-length: each run costs one byte for the value and one for the count (runs over 255 split)
  let runs = 0; for (let i = 0; i < N;) { let j = i; while (j < N && bytes[j] === bytes[i] && j - i < 255) j++; runs++; i = j; }
  const L = huffLengths(bytes); let huff = 0; bytes.forEach(b => huff += L.get(b));
  const table = f.size * 16;   // cost of sending the code table: roughly a symbol and a length per entry
  // LZW with 12-bit ceiling: dictionary starts with the 256 bytes, codes grow from 9 bits
  const dict = new Map(); for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);
  let w = "", lzw = 0, next = 256, codes = 0;
  const width = () => Math.max(9, Math.ceil(Math.log2(next + 1)));
  for (const b of bytes) { const c = String.fromCharCode(b), wc = w + c;
    if (dict.has(wc)) w = wc; else { lzw += width(); codes++; if (next < 4096) dict.set(wc, next++); w = c; } }
  if (w) { lzw += width(); codes++; }
  return { N, raw:N * 8, rle:runs * 16, huff:huff + table, lzw, entropy:H * N, H, runs, codes, symbols:f.size };
}

/* ---------- BB84 ---------- */
function bb84(n, eve, noise, rng) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const a = rng() < .5 ? 1 : 0, ab = rng() < .5 ? "+" : "×";
    let bit = a, basis = ab, eb = null, ebit = null;
    if (eve) { eb = rng() < .5 ? "+" : "×"; ebit = eb === basis ? bit : (rng() < .5 ? 1 : 0); bit = ebit; basis = eb; }
    const bb = rng() < .5 ? "+" : "×";
    let bob = bb === basis ? bit : (rng() < .5 ? 1 : 0);
    if (rng() < noise) bob ^= 1;
    rows.push({ a, ab, eb, ebit, bb, bob, keep:ab === bb });
  }
  const kept = rows.filter(r => r.keep), sample = kept.filter((r, i) => i % 2 === 0);
  const errors = sample.filter(r => r.a !== r.bob).length;
  return { rows, kept:kept.length, sample:sample.length, errors, qber:sample.length ? errors / sample.length : 0, key:kept.filter((r, i) => i % 2 === 1).map(r => r.bob) };
}

/* ---------- GAN (1-D): G(z) = a·z + b, D(x) = σ(w2·x² + w1·x + w0) ---------- */
const sig = z => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, z))));
function ganInit(seed) { return { a:1.2, b:-2.5, w:[0, 0, 0], it:0, r:mulberry(seed || 7), mu:3, sd:.6, hist:[] }; }
function ganStep(G, lrD, lrG, kD) {
  const B = 64, r = G.r, D = x => sig(G.w[0] * x * x + G.w[1] * x + G.w[2]);
  for (let k = 0; k < kD; k++) {
    const g = [0, 0, 0];
    for (let i = 0; i < B; i++) {
      const xr = G.mu + G.sd * randn(r), xf = G.a * randn(r) + G.b, dr = 1 - D(xr), df = -D(xf);
      g[0] += dr * xr * xr + df * xf * xf; g[1] += dr * xr + df * xf; g[2] += dr + df;
    }
    for (let j = 0; j < 3; j++) G.w[j] = G.w[j] * (1 - 1e-3) + lrD * g[j] / B;
  }
  let ga = 0, gb = 0;
  for (let i = 0; i < B; i++) { const z = randn(r), x = G.a * z + G.b, s = (1 - D(x)) * (2 * G.w[0] * x + G.w[1]); ga += s * z; gb += s; }
  G.a += lrG * ga / B; G.b += lrG * gb / B; G.it++;
  if (G.it % 5 === 0) { G.hist.push([G.b, Math.abs(G.a)]); if (G.hist.length > 400) G.hist.shift(); }
}

/* ---------- tiny n-gram language model ---------- */
const CORPORA = {
  alice: { n:"Alice (Carroll, 1865)", t:"Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?' So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!'" },
  austen: { n:"Pride and Prejudice (Austen, 1813)", t:"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters. 'My dear Mr. Bennet,' said his lady to him one day, 'have you heard that Netherfield Park is let at last?' Mr. Bennet replied that he had not. 'But it is,' returned she; 'for Mrs. Long has just been here, and she told me all about it.' Mr. Bennet made no answer." },
  code: { n:"Python-ish code", t:"def add(a, b):\n    return a + b\n\ndef mul(a, b):\n    return a * b\n\nfor i in range(10):\n    if i % 2 == 0:\n        print(add(i, i))\n    else:\n        print(mul(i, i))\n\ndef square(x):\n    return mul(x, x)\n\nfor x in range(5):\n    print(square(x))\n" },
};
function ngramTrain(text, k) {
  const M = new Map();
  for (let ord = 0; ord <= k; ord++) for (let i = ord; i < text.length; i++) {
    const ctx = text.slice(i - ord, i), c = text[i];
    let m = M.get(ctx); if (!m) M.set(ctx, m = new Map());
    m.set(c, (m.get(c) || 0) + 1);
  }
  return M;
}
function ngramDist(M, text, k, T, topk) {        // backs off to shorter contexts it has never seen
  let ctx = text.slice(Math.max(0, text.length - k)), m;
  while (!(m = M.get(ctx))) ctx = ctx.slice(1);
  let arr = [...m].map(([c, n]) => [c, Math.pow(n, 1 / Math.max(.05, T))]);
  arr.sort((a, b) => b[1] - a[1]); if (topk > 0) arr = arr.slice(0, topk);
  const Z = arr.reduce((s, x) => s + x[1], 0);
  return { ctx, dist:arr.map(([c, w]) => [c, w / Z]), options:m.size };
}
function ngramSample(dist, r) { let u = r(); for (const [c, p] of dist) { u -= p; if (u <= 0) return c; } return dist[dist.length - 1][0]; }

/* ---------- difference engine ---------- */
function deInit(coef) {                  // coefficients c0 + c1 x + … ; registers from f(0), Δf(0), Δ²f(0) …
  const deg = coef.length - 1, f = x => coef.reduce((s, c, i) => s + c * x ** i, 0);
  let row = Array.from({ length:deg + 1 }, (_, x) => f(x)); const reg = [];
  for (let k = 0; k <= deg; k++) { reg.push(row[0]); row = row.slice(1).map((v, i) => v - row[i]); }
  return { reg, x:0, f, coef };
}
function deCrank(E) { for (let k = 0; k < E.reg.length - 1; k++) E.reg[k] += E.reg[k + 1]; E.x++; }

/* ---------- cache ---------- */
function cacheSim(cfg, addrs) {
  const sets = Math.max(1, cfg.lines / cfg.ways), S = Array.from({ length:sets }, () => []);
  let t = 0; const log = [];
  for (const a of addrs) {
    const block = Math.floor(a / cfg.lineWords), set = block % sets, tag = Math.floor(block / sets), ways = S[set];
    const hit = ways.find(w => w.tag === tag); t++;
    if (hit) { hit.used = t; log.push({ a, set, tag, hit:true }); continue; }
    let victim = null;
    if (ways.length >= cfg.ways) { victim = ways.reduce((m, w) => w.used < m.used ? w : m); ways.splice(ways.indexOf(victim), 1); }
    ways.push({ tag, used:t, block }); log.push({ a, set, tag, hit:false, evicted:victim && victim.block });
  }
  return { S, log, hits:log.filter(l => l.hit).length };
}
const CACHE_PATTERNS = {
  seq:   { n:"sum an array", make:() => Array.from({ length:64 }, (_, i) => i) },
  twice: { n:"loop over a small array twice", make:() => [...Array(24).keys(), ...Array(24).keys()] },
  row:   { n:"8×8 matrix, row by row", make:() => { const a = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) a.push(i * 64 + j); return a; } },
  col:   { n:"8×8 matrix, column by column", make:() => { const a = []; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) a.push(i * 64 + j); return a; } },
  rand:  { n:"random addresses", make:() => { const r = mulberry(5); return Array.from({ length:64 }, () => Math.floor(r() * 256)); } },
};

window.WOC_W2 = { lamParse, lamRun, lamShow, lamReadNumber, lamReadBool, bbMachine, bbStep, bbFast, BB_PRESETS, rsaKeys, modPow, factorTrial,
  cmpAll, bb84, ganInit, ganStep, ngramTrain, ngramDist, deInit, deCrank, cacheSim, CACHE_PATTERNS, mulberry };

/* ============================================================
   UI
   ============================================================ */
if (typeof document === "undefined" || !window.WOC_ATOMS) return;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
function hidpi(c, w, h) { const d = Math.min(2, devicePixelRatio || 1); c.width = w * d; c.height = h * d; c.style.height = h + "px"; const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); return x; }
const scale = () => window.WOC_ATOM_SCALE || 1;
const fmt = n => n.toLocaleString("en-US");

const CSS = `
.w2 .w2-tape { display: flex; gap: 2px; justify-content: center; margin: .5rem 0; flex-wrap: nowrap; overflow: hidden; }
.w2 .w2-tape span { width: 22px; height: 26px; flex: none; display: grid; place-items: center; font: 600 .75rem "IBM Plex Mono", monospace;
  border: 1px solid rgba(255,255,255,.14); border-radius: 4px; color: #6b6488; }
.w2 .w2-tape span.one { background: rgba(245,196,81,.22); color: #fff; border-color: rgba(245,196,81,.6); }
.w2 .w2-tape span.head { outline: 2px solid #7fe3d6; outline-offset: 1px; }
.w2 .w2-steps { font: .7rem/1.7 "IBM Plex Mono", monospace; color: #cfc9e4; background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.09);
  border-radius: 8px; padding: .5rem .65rem; max-height: 22rem; overflow: auto; white-space: pre-wrap; word-break: break-all; }
.w2 .w2-steps b { color: var(--gold); font-weight: 500; }
.w2 input.w2-in, .w2 textarea.w2-in { width: 100%; font: .78rem "IBM Plex Mono", monospace; color: var(--ink); background: rgba(0,0,0,.3);
  border: 1px solid rgba(255,255,255,.16); border-radius: 7px; padding: .45rem .55rem; }
.w2 input.w2-in:focus, .w2 textarea.w2-in:focus { outline: none; border-color: var(--gold); }
.w2 .w2-err { color: #ff8f7a; }
.w2 table.w2-t { border-collapse: collapse; width: 100%; font: .68rem "IBM Plex Mono", monospace; margin: .4rem 0; }
.w2 table.w2-t th, .w2 table.w2-t td { border: 1px solid rgba(255,255,255,.09); padding: .22rem .35rem; text-align: center; color: #d8d2ea; }
.w2 table.w2-t th { color: #9d96b8; font-weight: 500; }
.w2 table.w2-t td.bad { background: rgba(255,143,122,.2); color: #fff; }
.w2 table.w2-t td.ok { background: rgba(127,227,214,.12); }
.w2 table.w2-t td.dim { color: #5d5678; }
.w2 table.w2-t td.hl { background: rgba(245,196,81,.16); color: #fff; }
.w2 .w2-bars { display: grid; gap: .3rem; margin: .5rem 0; }
.w2 .w2-bar { display: grid; grid-template-columns: 9.5rem 1fr 5.5rem; gap: .5rem; align-items: center; font: .68rem "IBM Plex Mono", monospace; color: #d8d2ea; }
.w2 .w2-bar .trk { height: 1rem; background: rgba(0,0,0,.3); border-radius: 5px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); }
.w2 .w2-bar .fill { height: 100%; border-radius: 4px; transition: width .35s ease; }
.w2 .w2-bar .v { text-align: right; }
.w2 .w2-reg { display: flex; gap: .5rem; flex-wrap: wrap; margin: .5rem 0; }
.w2 .w2-reg div { border: 1px solid rgba(245,196,81,.35); border-radius: 10px; padding: .45rem .6rem; min-width: 6.5rem; text-align: center;
  font: .62rem "IBM Plex Mono", monospace; color: #9d96b8; background: rgba(245,196,81,.05); }
.w2 .w2-reg div b { display: block; font-size: 1.05rem; color: #fff; font-weight: 600; letter-spacing: .05em; margin-top: .15rem; }
.w2 .w2-reg div.flash b { color: var(--gold); }
.w2 .w2-sets { display: grid; gap: 3px; margin: .5rem 0; }
.w2 .w2-set { display: grid; grid-template-columns: 3.2rem repeat(var(--w), 1fr); gap: 3px; font: .66rem "IBM Plex Mono", monospace; }
.w2 .w2-set > span:first-child { color: #9d96b8; align-self: center; }
.w2 .w2-line { border: 1px solid rgba(255,255,255,.12); border-radius: 5px; padding: .25rem .35rem; color: #cfc9e4; min-height: 1.6rem; }
.w2 .w2-line.hit { background: rgba(127,227,214,.2); border-color: #7fe3d6; color: #fff; }
.w2 .w2-line.miss { background: rgba(255,143,122,.2); border-color: #ff8f7a; color: #fff; }
.w2 .w2-strip { display: flex; flex-wrap: wrap; gap: 2px; margin: .4rem 0; }
.w2 .w2-strip i { width: 11px; height: 11px; border-radius: 2px; background: rgba(255,255,255,.08); }
.w2 .w2-strip i.h { background: #7fe3d6; } .w2 .w2-strip i.m { background: #ff8f7a; } .w2 .w2-strip i.now { outline: 2px solid #fff; }
.w2 .w2-pots { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin: .6rem 0; text-align: center; font: .64rem/1.4 "IBM Plex Mono", monospace; color: #9d96b8; }
.w2 .w2-pot { border-radius: 50%; width: 64px; height: 64px; margin: .2rem auto .3rem; border: 2px solid rgba(255,255,255,.35); box-shadow: inset 0 -8px 16px rgba(0,0,0,.35); }
.w2 .w2-pots b { color: #fff; font-weight: 500; }
.w2 input[type=color] { width: 2.4rem; height: 1.8rem; border: 1px solid rgba(255,255,255,.2); border-radius: 6px; background: none; padding: 0; cursor: pointer; }
.w2 .w2-cal { display: grid; grid-template-columns: repeat(31, 1fr); gap: 2px; margin: .5rem 0; }
.w2 .w2-cal i { aspect-ratio: 1; border-radius: 2px; background: rgba(255,255,255,.06); }
.w2 .w2-cal i.one { background: #7fe3d6; } .w2 .w2-cal i.two { background: #ff8f7a; }
.w2 .w2-gen { font: .82rem/1.6 "IBM Plex Mono", monospace; color: #eee8ff; background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; padding: .6rem .7rem; min-height: 6rem; white-space: pre-wrap; word-break: break-word; }
.w2 .w2-gen .seed { color: #9d96b8; } .w2 .w2-gen .new { color: var(--gold); }
`;
const st = document.createElement("style"); st.id = "atoms4-css"; st.dataset.atomsMirror = "self"; st.textContent = CSS; document.head.appendChild(st);

function bars(el, rows, max) {
  el.innerHTML = rows.map(([n, v, col, label]) => `<div class="w2-bar"><span>${n}</span><span class="trk"><span class="fill" style="width:${(100 * Math.min(1, v / max)).toFixed(1)}%;background:${col}"></span></span><span class="v">${label}</span></div>`).join("");
}
function reg(o) { WOC_ATOMS.register(Object.assign({ cls:"w2 " + (o.cls || ""), build(){}, start(){}, stop(){} }, o)); }

/* ============================================================
   FOUNDATIONS · λ-calculus
   ============================================================ */
const LAM_PRESETS = [
  ["SUCC 2", "the successor of 2"], ["PLUS 2 3", "2 + 3"], ["MULT 2 3", "2 × 3"], ["POW 2 3", "2³"], ["PRED 3", "the predecessor of 3 (Kleene's trick)"],
  ["AND TRUE FALSE", "logic from functions"], ["NOT (ISZERO 0)", "is zero zero?"], ["S K K a", "S K K is the identity"],
  ["K a OMEGA", "normal order dodges an infinite loop"], ["OMEGA", "a term that never finishes"],
];
reg({ id:"w2-lambda", name:"λ-calculus reducer", domain:"found", fields:["computability", "logic"],
  html:`<h3>λ-calculus · Church 1936 — computing with nothing but functions</h3>
  <p class="ahint">Every value here is a function: numbers, true and false, even addition. Type a term (use λ or \\), or pick one, and watch it reduce one β-step at a time: <i>(λx.body) arg</i> becomes <i>body</i> with <i>arg</i> put in for <i>x</i>. Names in capitals are shorthands; digits are Church numerals (3 = λf x.f (f (f x))).</p>
  <div class="a2-row lam-pre">${LAM_PRESETS.map(([t, d]) => `<button class="a2-chip" data-t="${esc(t)}" title="${esc(d)}">${esc(t)}</button>`).join("")}</div>
  <div class="a2-row"><input class="w2-in lam-in" value="PLUS 2 3" spellcheck="false" aria-label="λ term"></div>
  <div class="a2-row"><button class="abtn lam-go">reduce</button><button class="abtn lam-one">one step</button><span class="a2-mono lam-stat"></span></div>
  <div class="w2-steps lam-out"></div>
  <p class="a2-note lam-note"></p>
  <p class="a2-why">Shorthands: ${Object.keys(LAM_DEFS).join(", ")}. Alonzo Church's λ-calculus (1936) and Turing's machines (1936) turned out to compute exactly the same functions, the start of the Church–Turing thesis. LISP (1958) borrowed its λ; every lambda in Python or JavaScript is its descendant. Reduction here is leftmost-outermost ("normal order"), which finds an answer whenever one exists.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let cur = null, n = 0;
    const show = (run, stepwise) => {
      const out = q(".lam-out"), steps = run.steps, last = steps[steps.length - 1];
      out.innerHTML = steps.map((e, i) => `<b>${i === 0 ? "   " : "→β "}</b>${esc(lamShow(e).slice(0, 700))}${lamShow(e).length > 700 ? " …" : ""}`).join("\n");
      out.scrollTop = out.scrollHeight;
      const num = lamReadNumber(last), bool = lamReadBool(last);
      q(".lam-stat").textContent = `${steps.length - 1} step${steps.length === 2 ? "" : "s"}${run.done ? " · normal form" : stepwise ? "" : " · stopped"}`;
      q(".lam-note").innerHTML = run.done ? (num === 0 && bool === false ? "The result is <b>FALSE</b> (λt f.f), which is the very same term as the Church numeral <b>0</b>." : num !== null ? `The result is the Church numeral <b>${num}</b>.` : bool !== null ? `The result is <b>${bool ? "TRUE" : "FALSE"}</b> (λt f.${bool ? "t" : "f"}).` : "No more β-steps: this is the normal form.")
        : stepwise ? "Press again for the next step." : run.blown ? "The term keeps growing; stopped to keep your browser responsive." : `Still reducing after ${steps.length - 1} steps: some terms never reach a normal form, and no program can always tell which (the halting problem again).`;
    };
    const go = () => { try { const r = lamRun(q(".lam-in").value, 400); cur = null; show(r, false); } catch (e) { q(".lam-out").innerHTML = `<span class="w2-err">${esc(e.message)}</span>`; q(".lam-stat").textContent = ""; q(".lam-note").textContent = ""; } };
    q(".lam-go").addEventListener("click", go);
    q(".lam-in").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    q(".lam-in").addEventListener("input", () => { cur = null; });
    q(".lam-one").addEventListener("click", () => {
      try {
        if (!cur) cur = { steps:[lamParse(q(".lam-in").value)] };
        else if (!cur.done) { const nx = lamStep(cur.steps[cur.steps.length - 1]); if (nx) cur.steps.push(nx); }
        cur.done = !lamStep(cur.steps[cur.steps.length - 1]);
        show({ steps:cur.steps, done:cur.done }, true);
      } catch (e) { q(".lam-out").innerHTML = `<span class="w2-err">${esc(e.message)}</span>`; }
    });
    pane.querySelectorAll(".lam-pre .a2-chip").forEach(b => b.addEventListener("click", () => { q(".lam-in").value = b.dataset.t; go(); }));
    go();
  },
});

/* ============================================================
   FOUNDATIONS · busy beaver
   ============================================================ */
reg({ id:"w2-bb", name:"Busy beaver", domain:"found", fields:["computability"],
  html:`<h3>Busy beaver · Radó 1962 — the fastest-growing thing you can define</h3>
  <p class="ahint">Among all Turing machines with <i>n</i> states that eventually halt, which runs longest? That count, BB(<i>n</i>), is well defined but grows faster than any function a computer can calculate. Run the record-holders: each row of the table says, for the symbol under the head, what to write, which way to move and which state to enter (Z = halt).</p>
  <div class="a2-row bb-pre">${BB_PRESETS.map((p, i) => `<button class="a2-chip" data-i="${i}">${p.n}</button>`).join("")}</div>
  <div class="a2-row"><input class="w2-in bb-code" spellcheck="false" aria-label="machine in bbchallenge notation"></div>
  <table class="w2-t bb-table"></table>
  <div class="w2-tape bb-tape"></div>
  <div class="a2-row"><button class="abtn bb-step">step</button><button class="abtn bb-run">▶ run</button><button class="abtn bb-fast">⚡ run to the end</button><button class="abtn bb-reset">↺ reset</button><span class="a2-mono bb-stat"></span></div>
  <p class="a2-note bb-note"></p>
  <p class="a2-why">Tibor Radó defined the busy beaver in 1962. BB(1)=1, BB(2)=6, BB(3)=21, BB(4)=107 and BB(5)=47,176,870 steps; the last was only proved in 2024, by the online bbchallenge collaboration with a computer-checked proof. BB(6) is known to be unimaginably larger. Beyond some small <i>n</i>, the value can't even be proved within standard mathematics, because a machine can be built that halts exactly if a set-theory contradiction exists.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let M = null, timer = 0, preset = 0;
    const table = () => {
      const T = M.T; q(".bb-table").innerHTML = `<tr><th>state</th><th>reads 0</th><th>reads 1</th></tr>` + T.map((row, s) => `<tr><td>${String.fromCharCode(65 + s)}</td>${row.map((t, r) =>
        `<td class="${!M.halted && M.state === s && ((M.tape.get(M.head) || 0) === r) ? "hl" : ""}">${t.w} ${t.d > 0 ? "R" : "L"} ${t.halt ? "halt" : String.fromCharCode(65 + t.s)}</td>`).join("")}</tr>`).join("");
    };
    const draw = () => {
      const W = 31, cells = []; for (let i = M.head - 15; i < M.head - 15 + W; i++) cells.push(`<span class="${M.tape.get(i) ? "one" : ""}${i === M.head ? " head" : ""}">${M.tape.get(i) ? 1 : 0}</span>`);
      q(".bb-tape").innerHTML = cells.join(""); table();
      q(".bb-stat").textContent = `steps ${fmt(M.steps)} · ones on tape ${fmt(M.tape.size)}${M.halted ? " · halted" : " · state " + String.fromCharCode(65 + M.state)}`;
    };
    const load = code => { stop(); try { M = bbMachine(code); q(".bb-code").classList.remove("w2-err"); draw(); } catch (e) { q(".bb-stat").textContent = e.message; } };
    const stop = () => { clearInterval(timer); timer = 0; q(".bb-run").textContent = "▶ run"; };
    q(".bb-step").addEventListener("click", () => { stop(); if (M) { try { bbStep(M); } catch (e) { q(".bb-stat").textContent = e.message; } draw(); } });
    q(".bb-run").addEventListener("click", () => { if (timer) return stop(); q(".bb-run").textContent = "⏸ pause";
      timer = setInterval(() => { try { for (let i = 0; i < 3; i++) bbStep(M); } catch (e) { stop(); } draw(); if (M.halted || M.steps > 50000) stop(); }, 60); });
    q(".bb-fast").addEventListener("click", () => {
      stop(); const code = q(".bb-code").value; q(".bb-stat").textContent = "running…";
      setTimeout(() => { try { const t0 = performance.now(), r = bbFast(code, 60000000), ms = Math.round(performance.now() - t0);
        q(".bb-stat").textContent = r.halted ? `halted after ${fmt(r.steps)} steps with ${fmt(r.ones)} ones on the tape (${fmt(ms)} ms)` : r.out ? `ran off the simulated tape after ${fmt(r.steps)} steps` : `still running after ${fmt(r.steps)} steps: gave up`;
      } catch (e) { q(".bb-stat").textContent = e.message; } }, 30);
    });
    q(".bb-reset").addEventListener("click", () => load(q(".bb-code").value));
    q(".bb-code").addEventListener("change", () => load(q(".bb-code").value));
    pane.querySelectorAll(".bb-pre .a2-chip").forEach(b => b.addEventListener("click", () => {
      preset = +b.dataset.i; pane.querySelectorAll(".bb-pre .a2-chip").forEach(x => x.classList.toggle("on", x === b));
      q(".bb-code").value = BB_PRESETS[preset].code; q(".bb-note").textContent = BB_PRESETS[preset].note; load(BB_PRESETS[preset].code);
    }));
    pane.querySelector(".bb-pre .a2-chip").click();
    pane._stop = stop;
  },
  stop(pane) { if (pane._stop) pane._stop(); },
});

/* ============================================================
   HARDWARE · difference engine
   ============================================================ */
const DE_PRESETS = [["x² + x + 41", [41, 1, 1]], ["x²", [0, 0, 1]], ["x³", [0, 0, 0, 1]], ["2x³ − 3x + 7", [7, -3, 0, 2]], ["x⁴ − x", [0, -1, 0, 0, 1]]];
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
reg({ id:"w2-diffengine", name:"Difference engine", domain:"hard", fields:["mech"],
  html:`<h3>Babbage's Difference Engine · 1822 — tabulating polynomials by adding</h3>
  <p class="ahint">Any polynomial of degree <i>n</i> has a constant <i>n</i>-th difference. So a table of its values can be produced with nothing but addition: each turn of the crank adds every column into the one to its left. No multiplication, no mistakes from a tired human computer.</p>
  <div class="a2-row de-pre">${DE_PRESETS.map(([n], i) => `<button class="a2-chip" data-i="${i}">${n}</button>`).join("")}</div>
  <div class="w2-reg de-reg"></div>
  <div class="a2-row"><button class="abtn de-crank">⟳ turn the crank</button><button class="abtn de-run">▶ crank 10</button><button class="abtn de-reset">↺ reset</button></div>
  <table class="w2-t de-out"></table>
  <p class="a2-note de-note"></p>
  <p class="a2-why">Babbage demonstrated a working section of Difference Engine No. 1 in 1832, often computing x² + x + 41, Euler's prime-generating polynomial. The full machine was never finished. London's Science Museum built his Difference Engine No. 2 to the original drawings and completed its calculating section in 1991: seven orders of difference, 31-digit numbers, and it works.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let E, rows, name, timer = 0;
    const draw = flash => {
      q(".de-reg").innerHTML = E.reg.map((v, k) => `<div class="${flash ? "flash" : ""}">${k === 0 ? "value f(x)" : k === 1 ? "1st difference" : k + (k === 2 ? "nd" : k === 3 ? "rd" : "th") + " difference"}<b>${fmt(v)}</b></div>`).join("");
      q(".de-out").innerHTML = `<tr><th>x</th><th>engine output</th><th>direct f(x)</th>${name.includes("41") ? "<th>prime?</th>" : ""}</tr>` +
        rows.slice(-12).map(([x, v]) => `<tr><td>${x}</td><td class="${v === E.f(x) ? "ok" : "bad"}">${fmt(v)}</td><td>${fmt(E.f(x))}</td>${name.includes("41") ? `<td class="${isPrime(v) ? "ok" : "bad"}">${isPrime(v) ? "prime" : "no: " + fmt(v) + " = 41 × " + (v / 41)}</td>` : ""}</tr>`).join("");
      q(".de-note").innerHTML = name.includes("41") ? (E.x >= 40 ? `At x = 40 Euler's run of primes ends: 40² + 40 + 41 = 1681 = 41². The engine doesn't care; it just adds.` : `Every value so far is prime. Keep cranking: Euler's polynomial gives primes for x = 0 … 39.`)
        : `The ${E.reg.length - 1}${E.reg.length - 1 === 1 ? "st" : E.reg.length - 1 === 2 ? "nd" : E.reg.length - 1 === 3 ? "rd" : "th"} difference never changes: that constant is the whole secret.`;
    };
    const load = i => { stop(); name = DE_PRESETS[i][0]; E = deInit(DE_PRESETS[i][1]); rows = [[0, E.reg[0]]]; pane.querySelectorAll(".de-pre .a2-chip").forEach((b, k) => b.classList.toggle("on", k === i)); draw(); };
    const crank = () => { deCrank(E); rows.push([E.x, E.reg[0]]); draw(true); };
    const stop = () => { clearInterval(timer); timer = 0; };
    q(".de-crank").addEventListener("click", () => { stop(); crank(); });
    q(".de-run").addEventListener("click", () => { stop(); let k = 0; timer = setInterval(() => { crank(); if (++k >= 10) stop(); }, 180); });
    q(".de-reset").addEventListener("click", () => load(DE_PRESETS.findIndex(d => d[0] === name)));
    pane.querySelectorAll(".de-pre .a2-chip").forEach(b => b.addEventListener("click", () => load(+b.dataset.i)));
    load(0); pane._stop = stop;
  },
  stop(pane) { if (pane._stop) pane._stop(); },
});

/* ============================================================
   HARDWARE · cache simulator
   ============================================================ */
reg({ id:"w2-cache", name:"Cache simulator", domain:"hard", fields:["stored", "aihw"],
  html:`<h3>Memory caches — why the order of your loops matters</h3>
  <p class="ahint">Main memory is ~100× slower than the processor, so chips keep recently used memory in a small, fast cache. Memory moves in lines of 4 words; each address maps to one set, and a set holds as many lines as its associativity. Step through an access pattern and watch hits (teal) and misses (red).</p>
  <div class="a2-row cc-pat">${Object.entries(CACHE_PATTERNS).map(([k, p]) => `<button class="a2-chip" data-p="${k}">${p.n}</button>`).join("")}</div>
  <div class="a2-row"><span class="a2-mono">cache lines</span><select class="cc-lines"><option>4</option><option selected>8</option><option>16</option></select>
    <span class="a2-mono">associativity</span><select class="cc-ways"><option value="1">direct-mapped</option><option value="2" selected>2-way</option><option value="4">4-way</option><option value="0">fully associative</option></select></div>
  <div class="w2-strip cc-strip"></div>
  <div class="w2-sets cc-sets"></div>
  <div class="a2-row"><button class="abtn cc-step">step</button><button class="abtn cc-run">▶ run</button><button class="abtn cc-all">run all</button><button class="abtn cc-reset">↺ reset</button></div>
  <div class="a2-stats cc-stats"></div>
  <p class="a2-why">The idea goes back to Maurice Wilkes's "slave memory" (1965); IBM's System/360 Model 85 (1968) shipped the first commercial cache. Today's chips stack three levels of cache. The column-by-column matrix walk is the classic trap: same work, same data, several times slower, because each access lands in a different line.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let pat = "seq", addrs, k = 0, timer = 0;
    const cfg = () => { const lines = +q(".cc-lines").value, w = +q(".cc-ways").value; return { lines, ways:w === 0 ? lines : Math.min(w, lines), lineWords:4 }; };
    const draw = () => {
      const c = cfg(), sim = cacheSim(c, addrs.slice(0, k)), last = sim.log[k - 1];
      q(".cc-strip").innerHTML = addrs.map((a, i) => `<i class="${i < k ? (sim.log[i].hit ? "h" : "m") : ""}${i === k - 1 ? " now" : ""}" title="address ${a}"></i>`).join("");
      q(".cc-sets").innerHTML = sim.S.map((ways, s) => `<div class="w2-set" style="--w:${c.ways}"><span>set ${s}</span>${Array.from({ length:c.ways }, (_, j) => {
        const w = ways[j]; const hot = last && last.set === s && w && w.tag === last.tag;
        return `<span class="w2-line${hot ? (last.hit ? " hit" : " miss") : ""}">${w ? `tag ${w.tag} · addr ${w.block * 4}–${w.block * 4 + 3}` : "empty"}</span>`; }).join("")}</div>`).join("");
      const h = sim.hits, m = k - h, t = k ? (h * 1 + m * 100) / k : 0;
      q(".cc-stats").innerHTML = k ? `access ${k}/${addrs.length}${last ? ` · address <span class="g">${last.a}</span> → set ${last.set}, tag ${last.tag}: <span class="${last.hit ? "t" : "r"}">${last.hit ? "HIT" : "MISS"}</span>${last.evicted != null ? ` (evicted addr ${last.evicted * 4}–${last.evicted * 4 + 3})` : ""}` : ""}
hit rate <span class="${h / k > .7 ? "t" : "r"}">${(100 * h / k).toFixed(0)}%</span> · average access ≈ <span class="g">${t.toFixed(1)}</span> cycles (hit 1, miss 100)` : `${addrs.length} accesses queued. Press step or run.`;
    };
    const load = p => { stop(); pat = p; addrs = CACHE_PATTERNS[p].make(); k = 0; pane.querySelectorAll(".cc-pat .a2-chip").forEach(b => b.classList.toggle("on", b.dataset.p === p)); draw(); };
    const stop = () => { clearInterval(timer); timer = 0; q(".cc-run").textContent = "▶ run"; };
    q(".cc-step").addEventListener("click", () => { stop(); if (k < addrs.length) k++; draw(); });
    q(".cc-run").addEventListener("click", () => { if (timer) return stop(); q(".cc-run").textContent = "⏸ pause"; timer = setInterval(() => { if (k < addrs.length) { k++; draw(); } else stop(); }, 140); });
    q(".cc-all").addEventListener("click", () => { stop(); k = addrs.length; draw(); });
    q(".cc-reset").addEventListener("click", () => load(pat));
    [".cc-lines", ".cc-ways"].forEach(s => q(s).addEventListener("change", () => draw()));
    pane.querySelectorAll(".cc-pat .a2-chip").forEach(b => b.addEventListener("click", () => load(b.dataset.p)));
    load("seq"); pane._stop = stop;
  },
  stop(pane) { if (pane._stop) pane._stop(); },
});

/* ============================================================
   INFORMATION & CRYPTO · BB84
   ============================================================ */
const PH = { "+0":"→", "+1":"↑", "×0":"↗", "×1":"↖" };
reg({ id:"w2-bb84", name:"BB84 quantum key", domain:"info", fields:["quantum", "modern-crypto"],
  html:`<h3>BB84 · Bennett & Brassard 1984 — a key that reveals eavesdroppers</h3>
  <p class="ahint">Alice sends single photons, each polarised in one of two bases: + (→ = 0, ↑ = 1) or × (↗ = 0, ↖ = 1). Bob measures each in a basis he picks at random. Measuring in the wrong basis gives a random bit and disturbs the photon. Afterwards they compare bases (not bits) in public and keep only the matches. Then they sacrifice half of those bits to check for errors.</p>
  <div class="a2-row"><span class="a2-mono">photons</span><select class="q-n"><option>16</option><option selected>64</option><option>256</option><option>1024</option></select>
    <label class="achk"><input type="checkbox" class="q-eve"> Eve intercepts and re-sends</label>
    <span class="a2-mono">channel noise</span><select class="q-noise"><option value="0">none</option><option value="0.02">2%</option><option value="0.05">5%</option></select>
    <button class="abtn q-go">send</button></div>
  <table class="w2-t q-table"></table>
  <div class="a2-stats q-stats"></div>
  <p class="a2-note q-note"></p>
  <p class="a2-why">Its security comes from physics rather than hard maths: you can't copy an unknown quantum state (the no-cloning theorem, 1982), and measuring disturbs it. An intercept-and-resend Eve guesses the wrong basis half the time, which corrupts about 25% of the checked bits. BB84 runs today over fibre and, since China's Micius satellite in 2017, between ground stations over 1,000 km apart.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let seed = 1;
    const go = () => {
      const eve = q(".q-eve").checked, R = bb84(+q(".q-n").value, eve, +q(".q-noise").value, mulberry(seed++));
      const show = R.rows.slice(0, 16);
      const row = (label, f) => `<tr><th>${label}</th>${show.map(f).join("")}</tr>`;
      q(".q-table").innerHTML = row("Alice's bit", r => `<td>${r.a}</td>`) + row("Alice's basis", r => `<td>${r.ab}</td>`) + row("photon", r => `<td>${PH[r.ab + r.a]}</td>`) +
        (eve ? row("Eve measures in", r => `<td class="${r.eb === r.ab ? "" : "bad"}">${r.eb}</td>`) : "") +
        row("Bob measures in", r => `<td>${r.bb}</td>`) + row("Bob's bit", r => `<td class="${r.keep ? (r.bob === r.a ? "ok" : "bad") : "dim"}">${r.bob}</td>`) +
        row("bases match?", r => `<td class="${r.keep ? "ok" : "dim"}">${r.keep ? "keep" : "drop"}</td>`);
      const abort = R.qber > .11;
      q(".q-stats").innerHTML = `${R.rows.length} photons → <span class="g">${R.kept}</span> kept after comparing bases (≈ half)\nchecked ${R.sample} of them in public: <span class="${R.errors ? "r" : "t"}">${R.errors} errors = ${(100 * R.qber).toFixed(1)}%</span>\nsecret key left: <span class="g">${R.key.length}</span> bits ${R.key.slice(0, 32).join("")}${R.key.length > 32 ? "…" : ""}`;
      q(".q-note").innerHTML = abort ? `<b>Abort.</b> An error rate above about 11% means someone may be listening, so Alice and Bob throw this key away. ${eve ? "Eve's guesses in the wrong basis show up as errors (red above)." : "Here it's just a noisy channel, but they can't tell the difference."}`
        : eve ? `Eve got lucky this round; send more photons and her ~25% error rate becomes impossible to hide.` : `No eavesdropper: the checked bits agree${R.errors ? " up to the channel noise" : " perfectly"}, so the remaining bits are a shared secret key.`;
    };
    q(".q-go").addEventListener("click", go); [".q-eve", ".q-n", ".q-noise"].forEach(s => q(s).addEventListener("change", go));
    go();
  },
});

/* ============================================================
   INFORMATION & CRYPTO · RSA
   ============================================================ */
reg({ id:"w2-rsa", name:"RSA from scratch", domain:"info", fields:["modern-crypto"],
  html:`<h3>RSA · Rivest, Shamir & Adleman 1977 — build a key, send a message, break it</h3>
  <p class="ahint">Pick two primes. Their product <i>n</i> is public; the primes stay secret. Encrypting is <i>c = mᵉ mod n</i>, decrypting is <i>m = cᵈ mod n</i>, and finding <i>d</i> needs φ(n) = (p−1)(q−1), which needs the factors.</p>
  <div class="a2-row"><span class="a2-mono">p</span><select class="rsa-p"></select><span class="a2-mono">q</span><select class="rsa-q"></select><span class="a2-mono">e</span><select class="rsa-e"><option>3</option><option>5</option><option selected>17</option><option>257</option><option>65537</option></select></div>
  <div class="a2-stats rsa-keys"></div>
  <div class="a2-row"><input class="w2-in rsa-msg" value="MEET AT NOON" maxlength="40" aria-label="message"></div>
  <div class="a2-stats rsa-out"></div>
  <div class="a2-row"><button class="abtn rsa-crack">Eve: factor n</button><span class="a2-mono rsa-crackout"></span></div>
  <p class="a2-note rsa-note"></p>
  <p class="a2-why">Clifford Cocks found the same scheme at GCHQ in 1973, but it stayed secret until 1997. Real keys use primes of about 300 digits each. The largest RSA number factored so far, RSA-250 (829 bits), took about 2,700 CPU-core-years in 2020; a 2048-bit key is far beyond that. A large quantum computer running Shor's algorithm would break it, which is why post-quantum standards were published in 2024. Encrypting letter by letter, as here, is insecure (see the repeated numbers); real RSA pads each message with randomness.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s);
    const opts = (sel, v) => { q(sel).innerHTML = PRIMES.map(p => `<option${p === v ? " selected" : ""}>${p}</option>`).join(""); };
    opts(".rsa-p", 61); opts(".rsa-q", 53);
    const run = () => {
      const p = +q(".rsa-p").value, qq = +q(".rsa-q").value;
      if (p === qq) { q(".rsa-keys").innerHTML = `<span class="r">p and q must be different primes.</span>`; return; }
      const K = rsaKeys(p, qq, +q(".rsa-e").value);
      q(".rsa-keys").innerHTML = `n = p × q = ${p} × ${qq} = <span class="g">${fmt(K.n)}</span>   φ(n) = (p−1)(q−1) = ${fmt(K.phi)}\npublic key (e, n) = (<span class="t">${K.e}</span>, ${fmt(K.n)})${K.e !== +q(".rsa-e").value ? ` (e bumped to ${K.e} to share no factor with φ)` : ""}\nprivate key d = e⁻¹ mod φ = <span class="r">${fmt(K.d)}</span>   check: e·d mod φ = ${(K.e * K.d) % K.phi}`;
      const msg = [...q(".rsa-msg").value.toUpperCase()].map(c => c.charCodeAt(0)).filter(m => m < K.n);
      const c = msg.map(m => modPow(m, K.e, K.n)), back = c.map(x => modPow(x, K.d, K.n));
      const seen = {}; c.forEach(x => seen[x] = (seen[x] || 0) + 1);
      q(".rsa-out").innerHTML = `message as numbers  ${msg.join(" ")}\nciphertext mᵉ mod n  ${c.map(x => seen[x] > 1 ? `<span class="r">${x}</span>` : x).join(" ")}\ndecrypted cᵈ mod n   ${back.join(" ")} → <span class="t">${esc(String.fromCharCode(...back))}</span>`;
      q(".rsa-note").innerHTML = Object.values(seen).some(v => v > 1) ? `Red numbers repeat because the same letter always encrypts the same way: a frequency-analysis gift. That's why real RSA adds random padding (OAEP).` : "";
      q(".rsa-crackout").textContent = "";
      pane._K = K;
    };
    ["change", "input"].forEach(ev => [".rsa-p", ".rsa-q", ".rsa-e", ".rsa-msg"].forEach(s => q(s).addEventListener(ev, run)));
    q(".rsa-crack").addEventListener("click", () => { const K = pane._K; if (!K) return; const f = factorTrial(K.n), d = modInv(K.e, (f.p - 1) * (f.q - 1));
      q(".rsa-crackout").textContent = `found ${f.p} × ${f.q} after ${f.tries} trial divisions → d = ${d}. Toy key broken. Each extra digit of n multiplies this work by about 3; a 617-digit n is out of reach.`; });
    run();
  },
});

/* ============================================================
   INFORMATION & CRYPTO · Diffie–Hellman paint mixing
   ============================================================ */
const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb = c => `rgb(${c.map(Math.round).join(",")})`;
const mix = (parts) => { const W = parts.reduce((s, [, w]) => s + w, 0); return [0, 1, 2].map(k => parts.reduce((s, [c, w]) => s + c[k] * w, 0) / W); };
reg({ id:"w2-dh", name:"Diffie–Hellman paint", domain:"info", fields:["modern-crypto"],
  html:`<h3>Diffie–Hellman · 1976 — agree on a secret while everyone listens</h3>
  <p class="ahint">The paint version: mixing is easy, un-mixing is practically impossible. Alice and Bob share a public colour, each adds a secret colour, and they swap the mixtures in public. Each then adds their own secret to what they received. Both end with the same colour; Eve, who saw every message, can't separate the secrets out.</p>
  <div class="a2-row"><span class="a2-mono">public</span><input type="color" class="dh-pub" value="#f5d142"><span class="a2-mono">Alice's secret</span><input type="color" class="dh-a" value="#d6336c"><span class="a2-mono">Bob's secret</span><input type="color" class="dh-b" value="#1f7ae0"></div>
  <div class="w2-pots dh-pots"></div>
  <div class="a2-lbl">The real arithmetic: g<sup>ab</sup> mod p</div>
  <div class="a2-row"><span class="a2-mono">p</span><select class="dh-p"><option value="23">23 (classroom)</option><option value="2147483647">2 147 483 647 (a Mersenne prime)</option></select><span class="a2-mono">g = 5 · Alice's a</span><input class="w2-in dh-na" style="width:7rem" value="6"><span class="a2-mono">Bob's b</span><input class="w2-in dh-nb" style="width:7rem" value="15"></div>
  <div class="a2-stats dh-math"></div>
  <p class="a2-why">Whitfield Diffie and Martin Hellman published "New Directions in Cryptography" in 1976 (Ralph Merkle had a related idea; GCHQ's Malcolm Williamson found it privately in 1974). Its descendant, elliptic-curve Diffie–Hellman, sets up the key for nearly every HTTPS connection you make. In the paint version, each person adds their secret to two equal parts of what they received, so both end with equal thirds of all three colours.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s);
    const pots = () => {
      const P = hex2(q(".dh-pub").value), A = hex2(q(".dh-a").value), B = hex2(q(".dh-b").value);
      const mA = mix([[P, 1], [A, 1]]), mB = mix([[P, 1], [B, 1]]);
      const sA = mix([[mB, 2], [A, 1]]), sB = mix([[mA, 2], [B, 1]]);
      const pot = (c, t, s) => `<div><div class="w2-pot" style="background:${rgb(c)}"></div><b>${t}</b><br>${s}</div>`;
      q(".dh-pots").innerHTML = pot(mA, "Alice sends", "public + Alice's secret") + pot(P, "Eve sees", "the public colour and both mixtures") + pot(mB, "Bob sends", "public + Bob's secret") +
        pot(sA, "Alice's result", "Bob's mixture + her secret") + `<div style="align-self:center;color:#7fe3d6">same colour ✓<br>${sA.every((v, i) => Math.abs(v - sB[i]) < .5) ? "identical" : "differs"}</div>` + pot(sB, "Bob's result", "Alice's mixture + his secret");
    };
    const math = () => {
      const p = BigInt(q(".dh-p").value), g = 5n, a = BigInt(Math.max(1, parseInt(q(".dh-na").value) || 1)), b = BigInt(Math.max(1, parseInt(q(".dh-nb").value) || 1));
      const pw = (x, e) => { let r = 1n, y = x % p, k = e; while (k > 0n) { if (k & 1n) r = r * y % p; y = y * y % p; k >>= 1n; } return r; };
      const A = pw(g, a), B = pw(g, b), s1 = pw(B, a), s2 = pw(A, b);
      let eve = "";
      if (p < 100000n) { let x = 1n, k = 0n; do { x = x * g % p; k++; } while (x !== A && k < p); eve = `Eve tries powers of g until one gives A: a = ${k} after ${k} tries, so she has the key too. With p this small it's instant.`; }
      else eve = `To find a from A, Eve would have to try up to ~2 billion powers here; real systems use p with 600+ digits (or elliptic curves), where no known method finishes.`;
      q(".dh-math").innerHTML = `Alice sends A = gᵃ mod p = <span class="g">${A}</span>   Bob sends B = gᵇ mod p = <span class="g">${B}</span>\nAlice computes Bᵃ mod p = <span class="t">${s1}</span>   Bob computes Aᵇ mod p = <span class="t">${s2}</span>   ${s1 === s2 ? "the same secret ✓" : ""}\n${eve}`;
    };
    [".dh-pub", ".dh-a", ".dh-b"].forEach(s => q(s).addEventListener("input", pots));
    [".dh-p", ".dh-na", ".dh-nb"].forEach(s => q(s).addEventListener("input", math));
    q(".dh-p").addEventListener("change", math);
    pots(); math();
  },
});

/* ============================================================
   INFORMATION & CRYPTO · birthday attack
   ============================================================ */
reg({ id:"w2-birthday", name:"Birthday attack", domain:"info", fields:["modern-crypto", "infotheory"],
  html:`<h3>The birthday paradox — and why hashes need 256 bits</h3>
  <p class="ahint">With 23 people in a room, two probably share a birthday. The reason: 23 people make 253 pairs. The same arithmetic finds collisions in a hash with <i>k</i> output bits after only about 2<sup>k/2</sup> tries, not 2<sup>k</sup>.</p>
  <div class="it-control"><label><span>people in the room</span><output class="bd-nv"></output></label><input class="bd-n" type="range" min="2" max="80" value="23"></div>
  <div class="w2-cal bd-cal"></div>
  <div class="a2-row"><button class="abtn bd-room">fill a room</button><button class="abtn bd-many">fill 2,000 rooms</button></div>
  <div class="a2-stats bd-stats"></div>
  <div class="a2-lbl">Collision hunt on SHA-256 cut to k bits</div>
  <div class="a2-row"><span class="a2-mono">k</span><select class="bd-k"><option>16</option><option selected>24</option><option>28</option><option>32</option></select><button class="abtn bd-hunt">hunt for a collision</button></div>
  <div class="a2-stats bd-hunt-out">Press hunt: messages "msg-1", "msg-2", … are hashed until two share their first k bits.</div>
  <p class="a2-why">This is why SHA-256 has 256 bits: finding any collision should take about 2¹²⁸ tries, beyond all the computers on Earth for longer than the age of the universe. MD5 (128 bits) and SHA-1 (160 bits) fell to cleverer attacks before brute force caught up. Birthday bounds also set nonce and ID sizes everywhere, from UUIDs to TLS.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let rs = 11;
    const exact = n => { let p = 1; for (let i = 0; i < n; i++) p *= (365 - i) / 365; return 1 - p; };
    const room = (n, r) => { const days = new Uint8Array(365); for (let i = 0; i < n; i++) days[Math.floor(r() * 365)]++; return days; };
    const draw = days => {
      const n = +q(".bd-n").value; q(".bd-nv").textContent = n;
      const d = days || new Uint8Array(365);
      q(".bd-cal").innerHTML = Array.from(d, v => `<i class="${v > 1 ? "two" : v ? "one" : ""}"></i>`).join("");
      const shared = days ? Array.from(days).filter(v => v > 1).length : null;
      q(".bd-stats").innerHTML = `${n} people · ${fmt(n * (n - 1) / 2)} pairs · chance two share a birthday: <span class="g">${(100 * exact(n)).toFixed(1)}%</span>` + (shared !== null ? `\nthis room: <span class="${shared ? "r" : "t"}">${shared ? shared + " shared birthday" + (shared > 1 ? "s" : "") + " (red)" : "no shared birthdays"}</span>` : "");
    };
    q(".bd-n").addEventListener("input", () => draw());
    q(".bd-room").addEventListener("click", () => draw(room(+q(".bd-n").value, mulberry(rs++))));
    q(".bd-many").addEventListener("click", () => { const n = +q(".bd-n").value, r = mulberry(rs++); let hit = 0; for (let t = 0; t < 2000; t++) if (room(n, r).some(v => v > 1)) hit++;
      draw(); q(".bd-stats").innerHTML += `\n2,000 random rooms: <span class="t">${(100 * hit / 2000).toFixed(1)}%</span> had a shared birthday (theory ${(100 * exact(n)).toFixed(1)}%)`; });
    q(".bd-hunt").addEventListener("click", () => {
      const k = +q(".bd-k").value, H = window.WOC_SHA256; if (!H) { q(".bd-hunt-out").textContent = "SHA-256 not loaded"; return; }
      q(".bd-hunt-out").textContent = "hashing…";
      setTimeout(() => {
        const enc = new TextEncoder(), seen = new Map(), t0 = performance.now(), base = Math.floor(Math.random() * 1e6);
        let i = 0, found = null;
        while (!found && i < 3e6) { const m = `msg-${base + i}`, h = H(enc.encode(m)); const key = ((h[0] << 24) | (h[1] << 16) | (h[2] << 8) | h[3]) >>> (32 - k);
          if (seen.has(key)) found = [seen.get(key), m, key]; else seen.set(key, m); i++; }
        const ms = Math.round(performance.now() - t0), pred = Math.sqrt(Math.PI / 2 * 2 ** k);
        q(".bd-hunt-out").innerHTML = found ? `"${found[0]}" and "${found[1]}" share their first ${k} bits (${found[2].toString(16)})\nafter <span class="g">${fmt(i)}</span> hashes in ${fmt(ms)} ms · birthday estimate √(π/2 · 2^${k}) ≈ <span class="t">${fmt(Math.round(pred))}</span> · brute force would need ~${fmt(2 ** k)}\nfull 256 bits: about 2¹²⁸ ≈ 3.4 × 10³⁸ hashes` : "no collision found";
      }, 20);
    });
    draw();
  },
});

/* ============================================================
   INFORMATION & CRYPTO · compression shoot-out
   ============================================================ */
const CMP_PRESETS = {
  english: ["English prose", CORPORA.alice.t],
  repeat: ["very repetitive", "ha".repeat(60) + " " + "tick tock ".repeat(24)],
  dna: ["DNA-like (4 letters)", (() => { const r = mulberry(3); return Array.from({ length:500 }, () => "ACGT"[Math.floor(r() * 4)]).join(""); })()],
  random: ["random characters", (() => { const r = mulberry(9), s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/"; return Array.from({ length:500 }, () => s[Math.floor(r() * 64)]).join(""); })()],
};
reg({ id:"w2-compress", name:"Compression shoot-out", domain:"info", fields:["infotheory"],
  html:`<h3>Compression shoot-out — run-length vs Huffman vs LZW</h3>
  <p class="ahint">Three classic ideas, one input. Run-length coding squeezes repeats of the same symbol. Huffman gives frequent symbols short codes. LZW builds a dictionary of phrases as it reads. Try each kind of text, or type your own, and compare against Shannon's entropy bound for symbol-by-symbol coding.</p>
  <div class="a2-row cmp-pre">${Object.entries(CMP_PRESETS).map(([k, [n]]) => `<button class="a2-chip" data-k="${k}">${n}</button>`).join("")}</div>
  <textarea class="w2-in cmp-in" rows="4" spellcheck="false" aria-label="text to compress"></textarea>
  <div class="w2-bars cmp-bars"></div>
  <div class="a2-stats cmp-stats"></div>
  <p class="a2-note cmp-note"></p>
  <p class="a2-why">Run-length coding is older than computers (fax machines use it). Huffman found the optimal symbol code in 1952; Lempel and Ziv's 1977–78 algorithms learn phrases instead, and Welch's 1984 LZW went into GIF and Unix compress. Today's zip, gzip and PNG pair LZ77 with Huffman. No method shrinks everything: there are fewer short files than long ones, so random data can't be compressed (counting argument).</p>`,
  build(pane) {
    const q = s => pane.querySelector(s);
    const run = () => {
      const t = q(".cmp-in").value || " ", R = cmpAll(t), best = Math.min(R.rle, R.huff, R.lzw);
      const pct = v => `${fmt(Math.round(v))} bits · ${(100 * v / R.raw).toFixed(0)}%`;
      bars(q(".cmp-bars"), [["plain 8-bit", R.raw, "#8d86a8", pct(R.raw)], ["run-length", R.rle, "#b48cff", pct(R.rle)], ["Huffman (+ table)", R.huff, "#f5c451", pct(R.huff)],
        ["LZW", R.lzw, "#7fe3d6", pct(R.lzw)], ["entropy bound", R.entropy, "#ff8f7a", pct(R.entropy)]], Math.max(R.raw, R.rle));
      q(".cmp-stats").innerHTML = `${fmt(R.N)} bytes · ${R.symbols} distinct symbols · ${fmt(R.runs)} runs · ${fmt(R.codes)} LZW codes · entropy ${R.H.toFixed(2)} bits/symbol`;
      const w = best === R.lzw ? "LZW" : best === R.huff ? "Huffman" : "run-length";
      q(".cmp-note").innerHTML = `<b>${w}</b> wins here. ` + (R.lzw < R.entropy ? "LZW beats the entropy bound because that bound only covers coding one symbol at a time; LZW codes whole phrases." : R.rle > R.raw ? "Run-length makes it bigger: there are hardly any runs to squeeze." : "") + (R.symbols > 50 && R.lzw > R.raw * .7 ? " Near-random text barely compresses at all." : "");
    };
    q(".cmp-in").addEventListener("input", run);
    pane.querySelectorAll(".cmp-pre .a2-chip").forEach(b => b.addEventListener("click", () => { q(".cmp-in").value = CMP_PRESETS[b.dataset.k][1]; pane.querySelectorAll(".cmp-pre .a2-chip").forEach(x => x.classList.toggle("on", x === b)); run(); }));
    pane.querySelector(".cmp-pre .a2-chip").click();
  },
});

/* ============================================================
   ML · tiny language model
   ============================================================ */
reg({ id:"w2-tinylm", name:"Tiny language model", domain:"ml", fields:["llm"],
  html:`<h3>A tiny language model — predict the next character, then sample</h3>
  <p class="ahint">This model counts which character follows each short context in a text, then writes by repeatedly sampling the next character. Real LLMs do the same job with a neural network, tokens instead of characters, and trillions of words. <b>Context length</b> sets how far back it looks, <b>temperature</b> sharpens or flattens the odds, and <b>top-k</b> keeps only the k likeliest choices.</p>
  <div class="a2-row lm-pre">${Object.entries(CORPORA).map(([k, c]) => `<button class="a2-chip" data-k="${k}">${c.n}</button>`).join("")}<button class="a2-chip" data-k="own">your own text</button></div>
  <textarea class="w2-in lm-own" rows="3" hidden placeholder="Paste at least a few sentences…"></textarea>
  <div class="a2-row"><span class="a2-mono">context</span><select class="lm-k"><option value="1">1 char</option><option value="2">2 chars</option><option value="3" selected>3 chars</option><option value="4">4 chars</option><option value="6">6 chars</option></select>
    <span class="a2-mono">temperature</span><input type="range" class="lm-t" min="0.1" max="2" step="0.05" value="0.8"><output class="lm-tv a2-mono"></output>
    <span class="a2-mono">top-k</span><select class="lm-top"><option value="0">all</option><option value="1">1 (greedy)</option><option value="3">3</option><option value="10" selected>10</option></select></div>
  <div class="a2-row"><input class="w2-in lm-seed" style="max-width:14rem" value="Alice " aria-label="prompt"><button class="abtn lm-gen">generate 200</button><button class="abtn lm-one">+1 character</button><button class="abtn lm-clear">clear</button></div>
  <div class="w2-gen lm-out"></div>
  <div class="a2-lbl lm-ctx"></div>
  <div class="w2-bars lm-bars"></div>
  <p class="a2-note lm-note"></p>
  <p class="a2-why">Shannon generated text exactly this way in 1948, with letter and word statistics from books. With a 1-character context it babbles; with 6 characters it mostly copies phrases from the source, because it has seen too little text (memorising rather than generalising). Neural language models fix that by sharing what they learn across similar contexts. Temperature and top-k are the same dials you get in LLM APIs.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let corpus = "alice", M = null, text = "", r = mulberry(21);
    const src = () => corpus === "own" ? (q(".lm-own").value.trim() || CORPORA.alice.t) : CORPORA[corpus].t;
    const retrain = () => { M = ngramTrain(src(), +q(".lm-k").value); };
    const T = () => +q(".lm-t").value;
    const showDist = () => {
      const D = ngramDist(M, text, +q(".lm-k").value, T(), +q(".lm-top").value), vis = c => c === " " ? "␣" : c === "\n" ? "↵" : c;
      q(".lm-ctx").textContent = `after "${D.ctx.replace(/\n/g, "↵")}" (${D.options} options seen in the text), the next character is…`;
      bars(q(".lm-bars"), D.dist.slice(0, 8).map(([c, p]) => [`"${vis(c)}"`, p, "#f5c451", (100 * p).toFixed(1) + "%"]), 1);
      return D;
    };
    const drawText = seedLen => { q(".lm-out").innerHTML = `<span class="seed">${esc(text.slice(0, seedLen))}</span><span class="new">${esc(text.slice(seedLen))}</span>`; };
    let seedLen = 0;
    const add = n => { for (let i = 0; i < n; i++) text += ngramSample(ngramDist(M, text, +q(".lm-k").value, T(), +q(".lm-top").value).dist, r); drawText(seedLen); showDist();
      const k = +q(".lm-k").value, s = src(); let copied = 0; for (let i = seedLen + 12; i < text.length; i += 12) if (s.includes(text.slice(i - 12, i))) copied++;
      const chunks = Math.floor((text.length - seedLen) / 12);
      q(".lm-note").innerHTML = chunks ? `${Math.round(100 * copied / Math.max(1, chunks))}% of 12-character stretches appear word for word in the source text${k >= 4 ? ": mostly memorised" : k <= 1 ? ": mostly gibberish, rarely copied" : ""}.` : ""; };
    const reset = () => { text = q(".lm-seed").value; seedLen = text.length; drawText(seedLen); showDist(); q(".lm-note").textContent = ""; };
    q(".lm-gen").addEventListener("click", () => { reset(); add(200); });
    q(".lm-one").addEventListener("click", () => { if (!text) reset(); add(1); });
    q(".lm-clear").addEventListener("click", reset);
    q(".lm-t").addEventListener("input", () => { q(".lm-tv").textContent = T().toFixed(2); showDist(); });
    q(".lm-k").addEventListener("change", () => { retrain(); showDist(); });
    q(".lm-top").addEventListener("change", showDist);
    q(".lm-own").addEventListener("change", () => { retrain(); reset(); });
    pane.querySelectorAll(".lm-pre .a2-chip").forEach(b => b.addEventListener("click", () => {
      corpus = b.dataset.k; pane.querySelectorAll(".lm-pre .a2-chip").forEach(x => x.classList.toggle("on", x === b));
      q(".lm-own").hidden = corpus !== "own"; q(".lm-seed").value = corpus === "austen" ? "It is " : corpus === "code" ? "def " : corpus === "alice" ? "Alice " : "";
      retrain(); reset(); add(200);
    }));
    q(".lm-tv").textContent = T().toFixed(2);
    pane.querySelector(".lm-pre .a2-chip").click();
  },
});

/* ============================================================
   ML · GAN tug-of-war
   ============================================================ */
reg({ id:"w2-gan", name:"GAN tug-of-war", domain:"ml", fields:["deep"],
  html:`<h3>Generative adversarial network · Goodfellow 2014 — forger versus detective</h3>
  <p class="ahint">The generator turns random noise into samples (gold); the discriminator (white curve) scores how "real" each value looks. The discriminator learns to tell real data (teal) from fakes; the generator learns to fool it. Here both are tiny, so you can watch the tug-of-war: the generator is just <i>x = a·z + b</i>.</p>
  <canvas class="a2-cv gan-cv" aria-label="real and generated distributions"></canvas>
  <div class="a2-row"><button class="abtn gan-play">▶ train</button><button class="abtn gan-step">step</button><button class="abtn gan-reset">↺ reset</button>
    <span class="a2-mono">D learning rate</span><select class="gan-ld"><option selected>0.02</option><option>0.05</option><option>0.2</option></select>
    <span class="a2-mono">G learning rate</span><select class="gan-lg"><option>0.01</option><option selected>0.05</option><option>0.3</option></select>
    <span class="a2-mono">D steps per G step</span><select class="gan-k"><option>1</option><option selected>5</option></select></div>
  <div class="a2-stats gan-stats"></div>
  <p class="a2-why">Ian Goodfellow proposed GANs in 2014, reportedly after an argument in a Montreal bar. They powered photorealistic faces (StyleGAN, 2019) but are notoriously unstable: with the wrong learning rates the two players circle or collapse instead of settling, which you can reproduce here: set the discriminator's rate to 0.05 with one D step per G step, and the generator piles every sample onto one value ("mode collapse"). Diffusion models, which are easier to train, largely replaced them for images after 2021.</p>`,
  build(pane) {
    const q = s => pane.querySelector(s); let G = ganInit(7), raf = 0, on = false;
    const draw = () => {
      const cv = q(".gan-cv"), w = cv.clientWidth || 600, h = Math.round(Math.min(260 * scale(), innerHeight * .6)), ctx = hidpi(cv, w, h);
      const x0 = -6, x1 = 8, X = x => (x - x0) / (x1 - x0) * w, bins = 70, bw = (x1 - x0) / bins;
      const pdf = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
      const peak = Math.max(pdf(G.mu, G.mu, G.sd), pdf(G.b, G.b, Math.max(.05, Math.abs(G.a))));
      const Y = v => h - 18 - v / peak * (h - 40);
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.moveTo(0, h - 18); ctx.lineTo(w, h - 18); ctx.stroke();
      [[G.mu, G.sd, "rgba(127,227,214,.45)", "#7fe3d6"], [G.b, Math.max(.05, Math.abs(G.a)), "rgba(245,196,81,.4)", "#f5c451"]].forEach(([m, s, fill, line]) => {
        ctx.beginPath(); ctx.moveTo(X(x0), Y(0)); for (let i = 0; i <= bins; i++) { const x = x0 + i * bw; ctx.lineTo(X(x), Y(pdf(x, m, s))); } ctx.lineTo(X(x1), Y(0)); ctx.closePath();
        ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1.5; ctx.stroke(); });
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const x = x0 + i * (x1 - x0) / 200, d = sig(G.w[0] * x * x + G.w[1] * x + G.w[2]); const y = h - 18 - d * (h - 40); i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); }
      ctx.stroke();
      ctx.fillStyle = "#9d96b8"; ctx.font = "10px IBM Plex Mono, monospace"; ctx.textAlign = "center"; for (let v = -6; v <= 8; v += 2) ctx.fillText(v, X(v), h - 4);
      ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.fillText("D(x): 1 = looks real, 0 = looks fake", 8, 14);
      const gap = Math.abs(G.b - G.mu) + Math.abs(Math.abs(G.a) - G.sd);
      q(".gan-stats").innerHTML = `step ${fmt(G.it)} · real data: mean <span class="t">${G.mu.toFixed(2)}</span>, spread <span class="t">${G.sd.toFixed(2)}</span> · generator: mean <span class="g">${G.b.toFixed(2)}</span>, spread <span class="g">${Math.abs(G.a).toFixed(2)}</span>\n${G.it === 0 ? "Press ▶ train: the gold generator starts far from the real data." : gap < .15 ? `<span class="t">The fakes now match the real data: the discriminator is left guessing (its curve flattens toward ½).</span>` : Math.abs(G.a) < .1 && G.it > 300 ? `<span class="r">Mode collapse: the generator is putting every sample on nearly the same value. Try more D steps per G step, or a lower D rate.</span>` : gap > 9 ? `<span class="r">The two players have run away from each other: try lower learning rates.</span>` : "The discriminator's curve rises where real data is; the generator's gold hump follows it."}`;
    };
    const loop = () => { const ld = +q(".gan-ld").value, lg = +q(".gan-lg").value, k = +q(".gan-k").value; for (let i = 0; i < 8; i++) ganStep(G, ld, lg, k); draw(); if (on) raf = requestAnimationFrame(loop); };
    const stop = () => { on = false; cancelAnimationFrame(raf); q(".gan-play").textContent = "▶ train"; };
    q(".gan-play").addEventListener("click", () => { if (on) return stop(); on = true; q(".gan-play").textContent = "⏸ pause"; loop(); });
    q(".gan-step").addEventListener("click", () => { stop(); ganStep(G, +q(".gan-ld").value, +q(".gan-lg").value, +q(".gan-k").value); draw(); });
    q(".gan-reset").addEventListener("click", () => { stop(); G = ganInit(Math.floor(Math.random() * 1e6)); draw(); });
    pane._stop = stop; pane._draw = draw;
  },
  start(pane) { if (pane._draw) pane._draw(); },
  stop(pane) { if (pane._stop) pane._stop(); },
});
})();
