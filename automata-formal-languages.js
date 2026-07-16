/* ============================================================================
   THE WEB OF COMPUTATION  —  Field Guide: AUTOMATA & FORMAL LANGUAGES
   Foundations of Computation · the sixth and final Foundations guide
   ----------------------------------------------------------------------------
   Self-contained module. Exposes window.openAutomataExperience().
   Hook in app.js:  if (f.id === "automata") { openAutomataExperience(); return; }
   Load order: after computability-theory.js in index.html.
   Shares the it-* base styles via window.__ensureLearningBaseStyles when present;
   otherwise injects its own scoped fallback so it renders standalone.
   ========================================================================== */
(function () {
  "use strict";
  if (window.openAutomataExperience) return; // idempotent

  var ACCENT   = "#2dd4bf";   // teal — matches the Automata node on the map
  var ACCENT2  = "#7dd3fc";   // sky
  var GOLD     = "#e9c46a";
  var RED      = "#e76f51";

  /* ------------------------------------------------------------------ *
   * 0.  STYLES  (scoped under #aflOverlay to avoid any collision)      *
   * ------------------------------------------------------------------ */
  function ensureStyles() {
    if (typeof window.__ensureLearningBaseStyles === "function") {
      try { window.__ensureLearningBaseStyles(); } catch (e) {}
    }
    if (document.getElementById("afl-styles")) return;
    var css = ""
      + "#aflOverlay{position:fixed;inset:0;z-index:99999;overflow-y:auto;"
      + "background:radial-gradient(1200px 800px at 70% -10%,rgba(45,212,191,.10),transparent 60%),"
      + "radial-gradient(900px 700px at 10% 110%,rgba(125,211,252,.08),transparent 55%),#05070d;"
      + "color:#e8edf2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"
      + "-webkit-font-smoothing:antialiased;animation:aflFade .4s ease;}"
      + "@keyframes aflFade{from{opacity:0}to{opacity:1}}"
      + "#aflOverlay *{box-sizing:border-box}"
      + ".afl-wrap{max-width:1060px;margin:0 auto;padding:34px 22px 120px;}"
      + ".afl-close{position:fixed;top:16px;right:18px;z-index:5;background:rgba(20,26,36,.85);"
      + "border:1px solid rgba(45,212,191,.35);color:#cfeee7;border-radius:999px;width:44px;height:44px;"
      + "font-size:20px;cursor:pointer;backdrop-filter:blur(6px);transition:.2s}"
      + ".afl-close:hover{background:rgba(45,212,191,.18);transform:rotate(90deg)}"
      + ".afl-kicker{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.32em;"
      + "text-transform:uppercase;font-size:12px;color:" + ACCENT + ";opacity:.9}"
      + ".afl-title{font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:clamp(30px,5vw,52px);"
      + "line-height:1.05;margin:8px 0 6px;background:linear-gradient(120deg,#fff,#9feee0 60%," + ACCENT + ");"
      + "-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}"
      + ".afl-sub{color:#9fb0bf;font-size:16px;max-width:760px;line-height:1.6}"
      + ".afl-nav{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 8px;position:sticky;top:0;"
      + "padding:12px 0;background:linear-gradient(#05070d 70%,transparent);z-index:4}"
      + ".afl-navbtn{font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:#bcd;"
      + "background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);border-radius:999px;"
      + "padding:7px 13px;cursor:pointer;transition:.18s;white-space:nowrap}"
      + ".afl-navbtn:hover{border-color:" + ACCENT + ";color:#fff}"
      + ".afl-navbtn.on{background:" + ACCENT + ";color:#04201c;border-color:" + ACCENT + ";font-weight:700}"
      + ".afl-ch{display:none;animation:aflFade .35s ease}"
      + ".afl-ch.on{display:block}"
      + ".afl-chhead{display:flex;align-items:baseline;gap:14px;margin:22px 0 4px;flex-wrap:wrap}"
      + ".afl-chnum{font-family:Georgia,serif;font-size:44px;color:" + ACCENT + ";opacity:.5;line-height:1}"
      + ".afl-chtitle{font-family:Georgia,serif;font-size:clamp(22px,3.4vw,32px);font-weight:700}"
      + ".afl-era{font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.2em;color:#8aa;opacity:.8}"
      + ".afl-body{font-size:16.5px;line-height:1.72;color:#d6dee6;max-width:820px}"
      + ".afl-body p{margin:14px 0}"
      + ".afl-body b,.afl-body strong{color:#fff}"
      + ".afl-body em{color:" + ACCENT2 + ";font-style:italic}"
      + ".afl-body .yr{font-family:ui-monospace,monospace;color:" + GOLD + ";font-size:.92em}"
      + ".afl-body a{color:" + ACCENT + ";text-decoration:none;border-bottom:1px dotted " + ACCENT + "}"
      + ".afl-card{background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.02));"
      + "border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:20px 22px;margin:20px 0}"
      + ".afl-card.accent{border-color:rgba(45,212,191,.4);box-shadow:0 0 40px rgba(45,212,191,.08) inset}"
      + ".afl-labtag{display:inline-flex;align-items:center;gap:8px;font-family:ui-monospace,monospace;"
      + "font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#04201c;background:" + ACCENT + ";"
      + "padding:5px 11px;border-radius:999px;font-weight:700}"
      + ".afl-labname{font-family:Georgia,serif;font-size:22px;margin:12px 0 4px;color:#fff}"
      + ".afl-lab-desc{color:#9fb0bf;font-size:14.5px;margin-bottom:14px;line-height:1.6}"
      + ".afl-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:10px 0}"
      + ".afl-input{font-family:ui-monospace,monospace;font-size:16px;letter-spacing:.15em;background:#0a0f18;"
      + "border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#eafff9;padding:10px 12px;min-width:180px}"
      + ".afl-input:focus{outline:none;border-color:" + ACCENT + "}"
      + ".afl-btn{font-family:ui-monospace,monospace;font-size:13px;letter-spacing:.08em;cursor:pointer;"
      + "background:" + ACCENT + ";color:#04201c;border:none;border-radius:10px;padding:10px 16px;font-weight:700;transition:.16s}"
      + ".afl-btn:hover{filter:brightness(1.12);transform:translateY(-1px)}"
      + ".afl-btn.ghost{background:rgba(255,255,255,.05);color:#cde;border:1px solid rgba(255,255,255,.16)}"
      + ".afl-btn.ghost:hover{border-color:" + ACCENT + ";color:#fff}"
      + ".afl-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}"
      + ".afl-chip{font-family:ui-monospace,monospace;font-size:12px;padding:5px 10px;border-radius:8px;"
      + "background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);cursor:pointer;color:#cde}"
      + ".afl-chip:hover{border-color:" + ACCENT + "}"
      + ".afl-chip.on{background:" + ACCENT + ";color:#04201c;border-color:" + ACCENT + ";font-weight:700}"
      + ".afl-verdict{font-family:ui-monospace,monospace;font-weight:700;letter-spacing:.06em;padding:6px 12px;"
      + "border-radius:8px;display:inline-block;margin-top:6px}"
      + ".afl-acc{background:rgba(45,212,191,.18);color:" + ACCENT + ";border:1px solid " + ACCENT + "}"
      + ".afl-rej{background:rgba(231,111,81,.16);color:" + RED + ";border:1px solid " + RED + "}"
      + ".afl-state{display:inline-flex;align-items:center;justify-content:center;min-width:52px;height:52px;"
      + "padding:0 8px;border-radius:50%;border:2px solid rgba(255,255,255,.28);font-family:ui-monospace,monospace;"
      + "font-size:13px;margin:4px;background:#0a0f18;transition:.2s}"
      + ".afl-state.active{border-color:" + ACCENT + ";background:rgba(45,212,191,.18);color:#eafff9;box-shadow:0 0 18px rgba(45,212,191,.4)}"
      + ".afl-state.accept{border-style:double;border-width:4px}"
      + ".afl-tape{font-family:ui-monospace,monospace;font-size:20px;letter-spacing:.35em;margin:10px 0;color:#cde}"
      + ".afl-tape .cur{color:#04201c;background:" + ACCENT + ";border-radius:5px;padding:1px 6px}"
      + ".afl-tape .done{opacity:.4}"
      + ".afl-stack{display:flex;flex-direction:column-reverse;gap:4px;min-height:120px;justify-content:flex-start;"
      + "padding:8px;border:1px dashed rgba(255,255,255,.18);border-radius:10px;width:80px;margin:8px 0}"
      + ".afl-cell{background:" + ACCENT + ";color:#04201c;text-align:center;border-radius:6px;padding:6px 0;"
      + "font-family:ui-monospace,monospace;font-weight:700;animation:aflPop .2s ease}"
      + "@keyframes aflPop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}"
      + ".afl-mono{font-family:ui-monospace,monospace;font-size:13.5px;color:#bcd;background:#0a0f18;"
      + "border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:12px 14px;overflow-x:auto;margin:8px 0;white-space:pre}"
      + ".afl-subset{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0}"
      + ".afl-subnode{font-family:ui-monospace,monospace;font-size:12px;padding:8px 12px;border-radius:10px;"
      + "border:1px solid rgba(255,255,255,.16);background:#0a0f18;animation:aflPop .3s ease}"
      + ".afl-subnode.acc{border-color:" + ACCENT + ";color:" + ACCENT + ";box-shadow:0 0 14px rgba(45,212,191,.25)}"
      + ".afl-rings{position:relative;height:340px;margin:14px auto;max-width:560px}"
      + ".afl-ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;"
      + "border:2px solid rgba(255,255,255,.18);display:flex;align-items:flex-start;justify-content:center;"
      + "cursor:pointer;transition:.22s;padding-top:8px}"
      + ".afl-ring:hover{border-color:" + ACCENT + "}"
      + ".afl-ring.sel{border-color:" + ACCENT + ";box-shadow:0 0 26px rgba(45,212,191,.28)}"
      + ".afl-ringlbl{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.12em;color:#cde;pointer-events:none}"
      + ".afl-src{display:flex;gap:14px;padding:15px 0;border-top:1px solid rgba(255,255,255,.08);align-items:flex-start}"
      + ".afl-srctag{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;"
      + "color:" + GOLD + ";white-space:nowrap;padding-top:3px;min-width:118px}"
      + ".afl-srcbody a{color:#eafff9;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(45,212,191,.5)}"
      + ".afl-srcbody p{margin:3px 0 0;color:#9fb0bf;font-size:13.5px;line-height:1.5}"
      + ".afl-note{color:#8aa;font-size:13px;font-style:italic;margin-top:8px}"
      + ".afl-flag{color:" + GOLD + "}"
      + "@media(max-width:640px){.afl-chnum{font-size:34px}.afl-rings{height:280px}}"
      // ---- panel teaser (rendered INSIDE the site side panel, so NOT scoped to #aflOverlay) ----
      + ".afl-teaser{margin:14px 0 4px}"
      + ".afl-kick{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;"
      + "text-transform:uppercase;font-size:11px;line-height:1.5;color:" + GOLD + ";margin:2px 0 10px}"
      + ".afl-teaser-blurb{font-size:14.5px;line-height:1.62;color:#d6dee6;margin:10px 0}"
      + ".afl-teaser-blurb b{color:#fff}.afl-teaser-blurb em{color:" + ACCENT2 + ";font-style:italic}"
      + ".afl-tl{display:flex;flex-wrap:wrap;gap:14px 18px;margin:16px 0 6px;padding-top:12px;"
      + "border-top:1px solid rgba(255,255,255,.10)}"
      + ".afl-tl-item{font-size:11.5px;line-height:1.35;color:#9fb0bf;max-width:92px}"
      + ".afl-tl-y{display:block;font-family:ui-monospace,monospace;font-weight:600;color:" + GOLD + ";font-size:12.5px}"
      + ".afl-launch{display:inline-flex;align-items:center;margin:16px 0 6px;cursor:pointer;"
      + "font-family:ui-monospace,monospace;font-size:13.5px;letter-spacing:.04em;font-weight:700;"
      + "color:#04201c;background:" + ACCENT + ";border:none;border-radius:10px;padding:11px 18px;transition:.16s}"
      + ".afl-launch:hover{filter:brightness(1.12);transform:translateY(-1px)}";
    var s = document.createElement("style");
    s.id = "afl-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ *
   * 1.  AUTOMATA LOGIC  (all real — no fakery)                         *
   * ------------------------------------------------------------------ */

  var DFAS = {
    evenA: {
      name: "Even number of a's",
      alphabet: ["a", "b"],
      start: "q0", accept: ["q0"],
      delta: { q0: { a: "q1", b: "q0" }, q1: { a: "q0", b: "q1" } },
      desc: "q0 = even count seen, q1 = odd. Every 'a' flips parity; 'b' is ignored."
    },
    div3: {
      name: "Binary value divisible by 3",
      alphabet: ["0", "1"],
      start: "r0", accept: ["r0"],
      delta: { r0: { "0": "r0", "1": "r1" }, r1: { "0": "r2", "1": "r0" }, r2: { "0": "r1", "1": "r2" } },
      desc: "Read MSB-first. State = value mod 3. On bit b: new = (2·old + b) mod 3. Try 110 (=6) or 1001 (=9)."
    },
    endsAB: {
      name: "Ends with 'ab'",
      alphabet: ["a", "b"],
      start: "s0", accept: ["s2"],
      delta: { s0: { a: "s1", b: "s0" }, s1: { a: "s1", b: "s2" }, s2: { a: "s1", b: "s0" } },
      desc: "s1 = last symbol was 'a'; s2 = just completed '…ab' (accept)."
    },
    containsAA: {
      name: "Contains 'aa'",
      alphabet: ["a", "b"],
      start: "t0", accept: ["t2"],
      delta: { t0: { a: "t1", b: "t0" }, t1: { a: "t2", b: "t0" }, t2: { a: "t2", b: "t2" } },
      desc: "t2 is an absorbing accept trap: once 'aa' appears, nothing can undo it."
    }
  };

  function runDFA(dfa, input) {
    var trace = [{ state: dfa.start, read: "", idx: -1 }];
    var st = dfa.start;
    for (var i = 0; i < input.length; i++) {
      var c = input[i];
      if (dfa.alphabet.indexOf(c) === -1) {
        return { trace: trace, accepted: false, error: "symbol '" + c + "' ∉ alphabet {" + dfa.alphabet.join(",") + "}" };
      }
      st = dfa.delta[st][c];
      trace.push({ state: st, read: c, idx: i });
    }
    return { trace: trace, accepted: dfa.accept.indexOf(st) !== -1 };
  }

  // NFA for the subset-construction lab: strings over {a,b} ending in "ab".
  var NFA_endsAB = {
    start: "n0",
    alphabet: ["a", "b"],
    accept: ["n2"],
    delta: {
      n0: { a: ["n0", "n1"], b: ["n0"] },   // n0 loops, and nondeterministically guesses the final 'a'
      n1: { a: [], b: ["n2"] },
      n2: { a: [], b: [] }
    }
  };

  function nfaMove(nfa, set, sym) {
    var out = {};
    set.forEach(function (s) {
      var t = (nfa.delta[s] || {})[sym] || [];
      t.forEach(function (x) { out[x] = true; });
    });
    return Object.keys(out).sort();
  }

  function subsetConstruct(nfa) {
    var order = [], seen = {}, queue = [[nfa.start]];
    while (queue.length) {
      var set = queue.shift();
      var key = set.length ? set.join(",") : "∅";
      if (seen[key]) continue;
      var node = { set: set, key: key, tr: {}, accept: set.some(function (s) { return nfa.accept.indexOf(s) !== -1; }) };
      seen[key] = node; order.push(node);
      nfa.alphabet.forEach(function (sym) {
        var dest = nfaMove(nfa, set, sym);
        var dkey = dest.length ? dest.join(",") : "∅";
        node.tr[sym] = dkey;
        if (!seen[dkey] && queue.indexOf(dest) === -1) queue.push(dest);
      });
    }
    return order;
  }

  // PDA recognizers (real stack simulation), returns step trace.
  function runPDA(input, mode) {
    // mode "anbn": push on a, pop on b, a's must precede b's.
    // mode "paren": push on '(' , pop on ')'.
    var stack = [], trace = [], ok = true, err = "", phaseB = false;
    var openSym = mode === "paren" ? "(" : "a";
    var closeSym = mode === "paren" ? ")" : "b";
    for (var i = 0; i < input.length; i++) {
      var c = input[i];
      if (c === openSym) {
        if (mode === "anbn" && phaseB) { ok = false; err = "an 'a' after a 'b' — not of the form aⁿbⁿ"; trace.push({ read: c, act: "reject", stack: stack.slice() }); break; }
        stack.push("▮");
        trace.push({ read: c, act: "push", stack: stack.slice() });
      } else if (c === closeSym) {
        if (mode === "anbn") phaseB = true;
        if (stack.length === 0) { ok = false; err = "pop on empty stack — too many " + (mode === "paren" ? "')'" : "b's"); trace.push({ read: c, act: "underflow", stack: stack.slice() }); break; }
        stack.pop();
        trace.push({ read: c, act: "pop", stack: stack.slice() });
      } else {
        ok = false; err = "symbol '" + c + "' not in alphabet {" + openSym + "," + closeSym + "}";
        trace.push({ read: c, act: "reject", stack: stack.slice() }); break;
      }
    }
    var accepted = ok && stack.length === 0;
    return { trace: trace, accepted: accepted, err: err, leftover: stack.length };
  }

  // Pumping-lemma engine for L = { aⁿbⁿ }.
  function pumpAnBn(p, yStart, yLen, i) {
    var s = "a".repeat(p) + "b".repeat(p);
    // x = s[0..yStart), y = s[yStart..yStart+yLen), z = rest
    var x = s.slice(0, yStart), y = s.slice(yStart, yStart + yLen), z = s.slice(yStart + yLen);
    var pumped = x + y.repeat(i) + z;
    var na = (pumped.match(/a/g) || []).length, nb = (pumped.match(/b/g) || []).length;
    var inL = (na === nb) && /^a*b*$/.test(pumped) && pumped === "a".repeat(na) + "b".repeat(nb);
    return { s: s, x: x, y: y, z: z, pumped: pumped, na: na, nb: nb, inL: inL };
  }

  /* ------------------------------------------------------------------ *
   * 2.  CONTENT — chapters, labs, sources                              *
   * ------------------------------------------------------------------ */
  function esc(t) { return t; } // content is trusted authored HTML

  var CHAPTERS = [
    {
      id: "nerves", num: "I", title: "Nerve Nets & the First Machines", era: "1936 – 1948",
      html:
        "<p>Before a single computer existed, the question was already alive: <em>what can a machine with finitely many internal states compute?</em> The story starts not in engineering but in the brain. In <span class='yr'>1943</span>, neurophysiologist <b>Warren McCulloch</b> and the self-taught logician <b>Walter Pitts</b> published <i>A Logical Calculus of the Ideas Immanent in Nervous Activity</i>. They modeled a neuron as a simple threshold device — it fires or it doesn't — and showed that networks of these all-or-nothing units could compute logical propositions. In doing so they built, without naming it, the first <b>finite-state machine</b>: a system whose entire future depends only on which of finitely many states it currently occupies.</p>"
        + "<p>The intellectual ground had been prepared. <b>Claude Shannon</b>'s <span class='yr'>1937</span> MIT master's thesis had already shown that <em>Boolean algebra</em> exactly described relay switching circuits — logic made physical. And <b>Alan Turing</b>'s <span class='yr'>1936</span> machine gave the ceiling: a device with an <em>unbounded</em> tape. The natural question between Shannon's finite circuits and Turing's infinite tape became the founding tension of this whole field: <b>how much can you do with only finite memory — and what does adding a little structured memory buy you?</b></p>"
        + "<div class='afl-card'><p style='margin:0'><b>The one idea to carry through every chapter:</b> a <em>language</em> is just a set of strings, and a <em>machine</em> or <em>grammar</em> is a finite object that decides membership in — or generates — that possibly-infinite set. Automata theory is the map of exactly which languages which machines can handle.</p></div>"
        + "<p>McCulloch–Pitts nets were soon recognized as equivalent to what we now call finite automata, and the race was on to pin down precisely what they could and could not recognize.</p>",
      lab: null
    },
    {
      id: "finite", num: "II", title: "Finite Automata & Regular Languages", era: "1951 – 1961",
      html:
        "<p>The definitive answer came from <b>Stephen Cole Kleene</b>. In a <span class='yr'>1951</span> RAND memorandum, published in the landmark <span class='yr'>1956</span> volume <i>Automata Studies</i>, Kleene proved what is now called <b>Kleene's Theorem</b>: the languages recognized by finite automata are <em>exactly</em> the languages describable by <b>regular expressions</b> — built from single symbols using union, concatenation, and his new <em>star</em> operation (zero-or-more repetition). Two utterly different formalisms — one a machine, one an algebra of patterns — describe the identical class. That class earned the name <b>regular languages</b>, and the equivalence is why every <code>grep</code>, lexer, and validation pattern you have ever used rests on this chapter.</p>"
        + "<p>Machine models multiplied. <b>Edward Moore</b>'s <span class='yr'>1956</span> <i>Gedanken-experiments on Sequential Machines</i> and <b>George Mealy</b>'s <span class='yr'>1955</span> work gave the two standard output conventions still taught today. But the deepest jolt came in <span class='yr'>1959</span>, when <b>Michael Rabin</b> and <b>Dana Scott</b> published <i>Finite Automata and Their Decision Problems</i> and introduced the <b>nondeterministic finite automaton</b> — a machine allowed to be in many states at once, guessing its way forward. It looks vastly more powerful. It is not. Their <b>subset (powerset) construction</b> converts any NFA into an equivalent DFA. Nondeterminism, here, is a convenience, not a capability. The result won Rabin and Scott the <span class='yr'>1976</span> Turing Award.</p>"
        + "<p>Two theorems complete the anatomy of regular languages. The <b>Myhill–Nerode theorem</b> (<span class='yr'>1957–58</span>) characterizes them <em>exactly</em> by counting the equivalence classes their strings induce — and hands you the provably <em>minimal</em> DFA as a bonus. And the <b>pumping lemma</b> (Bar-Hillel, Perles &amp; Shamir, <span class='yr'>1961</span>) gives the field's favorite weapon: every long enough string in a regular language has a middle you can repeat forever and stay inside. Find a string that can't survive pumping, and you have <em>proven</em> the language is not regular. This is how we know <b>{ aⁿbⁿ }</b> — equal counts of a's then b's — lies beyond finite memory.</p>",
      lab: "dfa"
    },
    {
      id: "chomsky", num: "III", title: "Chomsky & the Great Hierarchy", era: "1956 – 1959",
      html:
        "<p>A twenty-seven-year-old linguist was about to reorganize the whole subject. In <span class='yr'>1956</span> <b>Noam Chomsky</b> published <i>Three Models for the Description of Language</i>, arguing that finite-state machines are <em>fundamentally inadequate</em> to describe the nested, recursive structure of human language — you cannot track arbitrarily deep clause embedding with finite memory. He proposed <b>phrase-structure grammars</b> instead: sets of rewrite rules that <em>generate</em> strings.</p>"
        + "<p>Then, in <span class='yr'>1959</span>'s <i>On Certain Formal Properties of Grammars</i>, he laid down the structure that organizes this entire field to this day — the <b>Chomsky Hierarchy</b>, four nested classes of ever-more-permissive grammars:</p>"
        + "<div class='afl-card accent'><div class='afl-mono'>"
        + "Type 3  Regular            A → aB | a          ⟺  Finite automaton     (no memory)\n"
        + "Type 2  Context-free       A → γ               ⟺  Pushdown automaton   (a stack)\n"
        + "Type 1  Context-sensitive  αAβ → αγβ           ⟺  Linear-bounded aut.  (bounded tape)\n"
        + "Type 0  Unrestricted       α → β               ⟺  Turing machine       (infinite tape)"
        + "</div></div>"
        + "<p>This is one of the great unifications in all of computer science. On one side sit <b>grammars</b> — generators that <em>produce</em> strings. On the other sit <b>automata</b> — recognizers that <em>accept or reject</em> strings. Chomsky's hierarchy pairs them off exactly: each rung of grammatical power corresponds to precisely one class of machine, distinguished by <em>how much memory</em> it may use. Add a stack to a finite automaton and you climb from regular to context-free. Bound the tape and you reach context-sensitive. Unbound it and you are back at Turing — and at the top rung, undecidability lives, tying automata theory directly to <a href='#'>computability</a>.</p>"
        + "<p>The witness languages that separate the rungs are famous: <b>{ aⁿbⁿ }</b> is context-free but not regular (a stack beats no-memory); <b>{ aⁿbⁿcⁿ }</b> is context-sensitive but not context-free (a stack is not enough for <em>three</em> matched counts).</p>",
      lab: "hierarchy"
    },
    {
      id: "cfg", num: "IV", title: "Grammars, Stacks & the Birth of the Compiler", era: "1959 – 1972",
      html:
        "<p>Chomsky's <b>context-free grammars</b> did not stay in linguistics — they became the backbone of every programming language. In <span class='yr'>1959</span> <b>John Backus</b> proposed a notation for the syntax of <b>ALGOL</b>; <b>Peter Naur</b> refined it for the <span class='yr'>1960</span> ALGOL 60 report. The result — <b>Backus–Naur Form (BNF)</b> — is quite literally context-free grammar in disguise, and it is how language syntax has been specified ever since. When you read a language's grammar in its reference manual, you are reading this chapter.</p>"
        + "<p>The matching machine is the <b>pushdown automaton</b>: a finite automaton with a single stack. Work by <b>Chomsky</b>, <b>Anthony Oettinger</b> (<span class='yr'>1961</span>), and <b>Marcel-Paul Schützenberger</b> established that PDAs recognize <em>exactly</em> the context-free languages — the stack is precisely the memory needed to match nested brackets and balanced structure. The <b>Chomsky–Schützenberger theorem</b> even characterizes every context-free language algebraically in terms of balanced parentheses.</p>"
        + "<p>To <em>use</em> a grammar you must <b>parse</b> — recover the tree that produced a string. The algorithms of this era still run inside your compiler:</p>"
        + "<div class='afl-card'><p style='margin:6px 0'><b>CYK</b> (Cocke–Younger–Kasami, ~<span class='yr'>1965–67</span>) — parses any context-free grammar in O(n³) via dynamic programming.</p>"
        + "<p style='margin:6px 0'><b>Earley's algorithm</b> (<span class='yr'>1968</span>) — general context-free parsing, efficient on typical inputs.</p>"
        + "<p style='margin:6px 0'><b>LR parsing</b> — <b>Donald Knuth</b>'s <span class='yr'>1965</span> <i>On the Translation of Languages from Left to Right</i> introduced the deterministic bottom-up parsing that <code>yacc</code>, <code>bison</code>, and countless compilers are built on.</p></div>"
        + "<p>The limits matter too. The <b>pumping lemma for context-free languages</b> (Bar-Hillel et al., <span class='yr'>1961</span>) proves <b>{ aⁿbⁿcⁿ }</b> escapes even a stack. And there is a sobering wall: whether an arbitrary context-free grammar is <em>ambiguous</em>, and whether two CFGs generate the same language, are both <b>undecidable</b> — proven by reduction from the <b>Post Correspondence Problem</b>. Even down here among the tidy grammars, the shadow of the halting problem falls.</p>",
      lab: "pda"
    },
    {
      id: "climb", num: "V", title: "Climbing Higher — Context-Sensitivity & the Limits of Decision", era: "1960 – 1988",
      html:
        "<p>Between the stack and the infinite tape sits the <b>context-sensitive</b> rung. Its machine, the <b>linear-bounded automaton (LBA)</b> — a Turing machine whose tape is limited to the length of its input — was studied by <b>John Myhill</b> (<span class='yr'>1960</span>) and <b>Sige-Yuki Kuroda</b> (<span class='yr'>1964</span>), who proved LBAs recognize exactly the context-sensitive languages. Kuroda then posed two deceptively simple questions that stood open for over two decades: are nondeterministic LBAs more powerful than deterministic ones, and is the class closed under complement?</p>"
        + "<p>The second question was answered spectacularly in <span class='yr'>1987</span> — independently by <b>Neil Immerman</b> and <b>Róbert Szelepcsényi</b> — by proving that nondeterministic space is closed under complement (<b>NSPACE(s) = co-NSPACE(s)</b>). Context-sensitive languages are closed under complement. This is a moment where automata theory hands the baton directly to <a href='#'>complexity theory</a>: the same theorem is a cornerstone of the space-complexity hierarchy.</p>"
        + "<p>At the very top, <b>Type-0</b> grammars generate exactly the <b>Turing-recognizable</b> languages, and here the decidability picture completes itself. Reading down the hierarchy:</p>"
        + "<div class='afl-card'><p style='margin:6px 0'><span class='afl-flag'>◆</span> <b>Emptiness &amp; finiteness</b>: decidable for regular and context-free languages.</p>"
        + "<p style='margin:6px 0'><span class='afl-flag'>◆</span> <b>Equivalence</b>: decidable for DFAs — but <em>undecidable</em> for context-free grammars.</p>"
        + "<p style='margin:6px 0'><span class='afl-flag'>◆</span> <b>Membership</b>: decidable everywhere up to context-sensitive; only at Type-0 does it become merely semi-decidable — the halting problem in disguise.</p></div>"
        + "<p>The engine behind nearly every undecidability proof in this territory is <b>Emil Post</b>'s <b>Correspondence Problem</b> (<span class='yr'>1946</span>): given a set of domino pairs, can you line up a sequence so the tops spell the same string as the bottoms? Simple to state, and undecidable — which makes it the perfect crowbar for prying open every harder question.</p>",
      lab: null
    },
    {
      id: "legacy", num: "VI", title: "Automata Everywhere — The Living Legacy", era: "1962 – today",
      html:
        "<p>Nothing in this field became a museum piece. Regular languages returned as infrastructure: <b>Ken Thompson</b>'s <span class='yr'>1968</span> <i>Regular Expression Search Algorithm</i> compiled patterns into NFAs on the fly, birthing <code>grep</code>, the Unix text-processing tradition, and the regex engines running in every language today. His construction — one small automaton fragment per operator, glued together — is still called <b>Thompson's construction</b>.</p>"
        + "<p>Then automata learned to run <em>forever</em>. <b>J. Richard Büchi</b> (<span class='yr'>1962</span>) invented automata on <em>infinite</em> words and used them to prove a whole logic (S1S) decidable. <b>Michael Rabin</b>'s <span class='yr'>1969</span> masterwork extended this to infinite <em>trees</em>, proving the decidability of S2S — one of the deepest results in the field. These ω-automata became the machinery of <b>formal verification</b>: in the <span class='yr'>1980s</span> <b>Moshe Vardi</b> and <b>Pierre Wolper</b> showed that checking whether a system satisfies a temporal-logic specification reduces to an automaton emptiness test. Every time a chip or protocol is <b>model-checked</b> before shipping, Chapter III's ideas are doing the work — a line of research recognized by the <span class='yr'>2007</span> Turing Award to Clarke, Emerson &amp; Sifakis.</p>"
        + "<p>Automata even learned to be <em>learned</em>. <b>Dana Angluin</b>'s <span class='yr'>1987</span> <b>L\u2605 algorithm</b> shows how to infer an unknown regular language from membership and equivalence queries — a foundational result now central to automata learning and system inference. And <b>weighted</b> and <b>probabilistic</b> automata and <b>finite-state transducers</b> (championed by <b>Mehryar Mohri</b>) quietly power speech recognition, morphology, and large-scale NLP pipelines.</p>"
        + "<div class='afl-card accent'><p style='margin:0'><b>Why it is foundational — the honest answer.</b> Automata theory is the <em>floor</em> of computer science. It is the first place the field drew a precise line between the possible and the impossible, gave us the memory hierarchy (none → stack → bounded → infinite), and unified the two great ways of describing infinite sets of strings — generating them with grammars and recognizing them with machines. Remove it and lexers, parsers, compilers, regular expressions, model checkers, and the very definition of <em>computation</em> lose their foundation. Every other guide in this constellation — logic, computability, complexity, quantum — connects back through here.</p></div>",
      lab: "subset"
    }
  ];

  var SOURCES = [
    { tag: "Founding paper · 1943", name: "McCulloch & Pitts — A Logical Calculus of the Ideas Immanent in Nervous Activity", url: "https://doi.org/10.1007/BF02478259", note: "Neurons as threshold units; the first finite-state machines, hidden inside a neurophysiology paper." },
    { tag: "Landmark · 1956", name: "Kleene — Representation of Events in Nerve Nets and Finite Automata", url: "https://www.rand.org/pubs/research_memoranda/RM704.html", note: "Kleene's Theorem: finite automata = regular expressions. Introduces the star operation. (RAND RM-704, 1951; in Automata Studies, 1956.)" },
    { tag: "Turing-award work · 1959", name: "Rabin & Scott — Finite Automata and Their Decision Problems", url: "https://doi.org/10.1147/rd.32.0114", note: "Nondeterministic automata and the subset construction: NFA = DFA in power. 1976 Turing Award." },
    { tag: "Founding paper · 1956", name: "Chomsky — Three Models for the Description of Language", url: "https://doi.org/10.1109/TIT.1956.1056813", note: "The argument that finite-state machines cannot capture natural language — and the case for phrase-structure grammars." },
    { tag: "Founding paper · 1959", name: "Chomsky — On Certain Formal Properties of Grammars", url: "https://doi.org/10.1016/S0019-9958(59)90362-6", note: "The Chomsky Hierarchy itself: Types 0–3 and the grammar↔automaton correspondence." },
    { tag: "Historic report · 1960", name: "Naur (ed.) — Report on the Algorithmic Language ALGOL 60", url: "https://doi.org/10.1145/367236.367262", note: "Backus–Naur Form: context-free grammar as the standard way to specify programming-language syntax." },
    { tag: "Deep result · 1969", name: "Rabin — Decidability of Second-Order Theories and Automata on Infinite Trees", url: "https://doi.org/10.2307/1995086", note: "Automata on infinite trees; the decidability of S2S — the theoretical root of modern model checking." },
    { tag: "Legendary book", name: "Hopcroft, Motwani & Ullman — Introduction to Automata Theory, Languages, and Computation", url: "https://www.pearson.com/en-us/subject-catalog/p/introduction-to-automata-theory-languages-and-computation/P200000003517", note: "\u201CThe Cinderella book.\u201D The standard reference for two generations of students." },
    { tag: "Open textbook · free", name: "Sipser — Introduction to the Theory of Computation (Part One) + MIT 6.045 / 18.404", url: "https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/", note: "The other standard text; Sipser's MIT OpenCourseWare lectures are freely available and superb." },
    { tag: "Play to learn · free", name: "JFLAP — build and run automata, grammars & Turing machines", url: "https://www.jflap.org/", note: "The classic free visual laboratory: draw a DFA/NFA/PDA/grammar, run strings, watch conversions happen." }
  ];

  /* ------------------------------------------------------------------ *
   * 3.  BUILD OVERLAY                                                  *
   * ------------------------------------------------------------------ */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function launchGuide() {
    ensureStyles();
    var old = document.getElementById("aflOverlay");
    if (old) old.remove();

    var ov = el("div"); ov.id = "aflOverlay";
    var close = el("button", "afl-close", "\u2715");
    close.setAttribute("aria-label", "Close");
    close.onclick = function () { ov.remove(); document.body.style.overflow = ""; };
    ov.appendChild(close);
    document.body.style.overflow = "hidden";

    var wrap = el("div", "afl-wrap");
    wrap.appendChild(el("div", "afl-kicker", "Foundations of Computation · Field Guide VI"));
    wrap.appendChild(el("div", "afl-title", "Automata &amp; Formal Languages"));
    wrap.appendChild(el("div", "afl-sub",
      "The floor of computer science: where machines with finite memory meet the languages they can recognize. "
      + "From McCulloch–Pitts nerve nets to Chomsky's hierarchy to the model checkers verifying today's chips — "
      + "told as a chronology, and learned by doing. Six chapters, five laboratories."));

    // nav
    var nav = el("div", "afl-nav");
    var chapEls = [];
    CHAPTERS.forEach(function (ch, i) {
      var b = el("button", "afl-navbtn" + (i === 0 ? " on" : ""), ch.num + " · " + ch.title);
      b.onclick = function () { show(i); };
      nav.appendChild(b);
    });
    var srcBtn = el("button", "afl-navbtn", "\uD83D\uDCDA Sources");
    srcBtn.onclick = function () { show(CHAPTERS.length); };
    nav.appendChild(srcBtn);
    wrap.appendChild(nav);

    // chapters
    CHAPTERS.forEach(function (ch, i) {
      var c = el("div", "afl-ch" + (i === 0 ? " on" : ""));
      var head = el("div", "afl-chhead");
      head.appendChild(el("div", "afl-chnum", ch.num));
      head.appendChild(el("div", "afl-chtitle", ch.title));
      head.appendChild(el("div", "afl-era", ch.era));
      c.appendChild(head);
      c.appendChild(el("div", "afl-body", ch.html));
      if (ch.lab) c.appendChild(buildLab(ch.lab));
      chapEls.push(c);
      wrap.appendChild(c);
    });

    // sources chapter
    var srcCh = el("div", "afl-ch");
    srcCh.appendChild(el("div", "afl-chhead",
      "<div class='afl-chnum'>\uD83D\uDCDA</div><div class='afl-chtitle'>Landmark Papers, Legendary Books &amp; Free Labs</div>"));
    srcCh.appendChild(el("div", "afl-body",
      "<p>The primary sources — read the originals. Papers link to DOIs; books and free courses are where this field is best learned deeply.</p>"));
    var srcWrap = el("div", "afl-card");
    SOURCES.forEach(function (s) {
      var row = el("div", "afl-src");
      row.appendChild(el("div", "afl-srctag", s.tag));
      var body = el("div", "afl-srcbody");
      body.innerHTML = "<a href='" + s.url + "' target='_blank' rel='noopener'>" + s.name + "</a><p>" + s.note + "</p>";
      row.appendChild(body);
      srcWrap.appendChild(row);
    });
    srcCh.appendChild(srcWrap);
    chapEls.push(srcCh);
    wrap.appendChild(srcCh);

    ov.appendChild(wrap);
    document.body.appendChild(ov);
    ov.scrollTop = 0;

    function show(n) {
      chapEls.forEach(function (c, k) { c.classList.toggle("on", k === n); });
      var btns = nav.querySelectorAll(".afl-navbtn");
      btns.forEach(function (b, k) { b.classList.toggle("on", k === n); });
      ov.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* ------------------------------------------------------------------ *
   * 3b. PANEL TEASER  — what the OTHER guides do: enrich the side       *
   *     panel, put the immersive guide behind a launch button.         *
   *     (This is what app.js calls when the Automata node is clicked.)  *
   * ------------------------------------------------------------------ */
  var TIMELINE = [
    { y: "1943", n: "McCulloch\u2013Pitts" },
    { y: "1951", n: "Kleene / regex" },
    { y: "1956", n: "Chomsky hierarchy" },
    { y: "1959", n: "Rabin\u2013Scott NFA" },
    { y: "1968", n: "Thompson / grep" }
  ];

  window.openAutomataExperience = function () {
    ensureStyles();
    var body = document.getElementById("panel-body");
    if (!body) { launchGuide(); return; }              // fallback: no panel found
    if (body.querySelector(".afl-teaser")) return;      // idempotent

    var teaser = el("div", "afl-teaser");

    teaser.appendChild(el("div", "afl-kick",
      "Interactive Field Guide \u00B7 Machines, Grammars &amp; the Hierarchy \u00B7 about 45 min"));

    teaser.appendChild(el("p", "afl-teaser-blurb",
      "In 1943 two scientists modeled the brain as logic gates and, without meaning to, built the first machine "
      + "with a <b>finite memory</b>. This is the field that drew computer science's first precise line between "
      + "what a machine <em>can</em> and <em>cannot</em> recognize \u2014 and then unified two ways of describing "
      + "infinite sets of strings: <b>grammars</b> that generate them and <b>automata</b> that accept them."));

    teaser.appendChild(el("p", "afl-teaser-blurb",
      "Five hands-on labs: run a real DFA, watch an NFA collapse into a DFA by the subset construction, push a "
      + "stack machine past the ceiling of regular languages, <em>break</em> a language with the pumping lemma, "
      + "and climb the four rings of the Chomsky hierarchy by hand."));

    var tl = el("div", "afl-tl");
    TIMELINE.forEach(function (m) {
      tl.appendChild(el("div", "afl-tl-item", "<span class='afl-tl-y'>" + m.y + "</span>" + m.n));
    });
    teaser.appendChild(tl);

    var launch = el("button", "afl-launch", "\u25B6 &nbsp;enter the field guide");
    launch.onclick = launchGuide;
    teaser.appendChild(launch);

    // Insert the teaser right after the field's blurb, ahead of the raw topic list.
    var firstTopic = body.querySelector(".topic");
    if (firstTopic) body.insertBefore(teaser, firstTopic);
    else body.appendChild(teaser);
  };

  /* ------------------------------------------------------------------ *
   * 4.  LABS                                                           *
   * ------------------------------------------------------------------ */
  function buildLab(kind) {
    if (kind === "dfa") return labDFA();
    if (kind === "subset") return labSubset();
    if (kind === "pda") return labPDA();
    if (kind === "hierarchy") return labHierarchy();
    return el("div");
  }

  // ---- LAB: DFA Playground ----
  function labDFA() {
    var card = el("div", "afl-card accent");
    card.appendChild(el("span", "afl-labtag", "\u2699 Lab 1 · run the machine"));
    card.appendChild(el("div", "afl-labname", "The DFA Playground"));
    card.appendChild(el("div", "afl-lab-desc",
      "A deterministic finite automaton is a finite set of states, a start, some accepting states, and one transition per symbol. "
      + "Pick a machine, feed it a string, and step through the execution. This is a <em>real</em> transition function running — no smoke."));

    var pick = el("div", "afl-row");
    var keys = Object.keys(DFAS), current = keys[0];
    keys.forEach(function (k) {
      var chip = el("button", "afl-chip" + (k === current ? " on" : ""), DFAS[k].name);
      chip.onclick = function () { current = k; render(); pick.querySelectorAll(".afl-chip").forEach(function (c, i) { c.classList.toggle("on", keys[i] === k); }); };
      pick.appendChild(chip);
    });
    card.appendChild(pick);

    var descLine = el("div", "afl-note");
    card.appendChild(descLine);

    var row = el("div", "afl-row");
    var input = el("input", "afl-input"); input.value = "abba"; input.setAttribute("spellcheck", "false");
    var runBtn = el("button", "afl-btn", "\u25B6 run");
    var stepBtn = el("button", "afl-btn ghost", "step");
    var resetBtn = el("button", "afl-btn ghost", "reset");
    row.appendChild(input); row.appendChild(runBtn); row.appendChild(stepBtn); row.appendChild(resetBtn);
    card.appendChild(row);

    var tape = el("div", "afl-tape");
    var statesBox = el("div", "afl-row");
    var verdict = el("div");
    card.appendChild(tape); card.appendChild(statesBox); card.appendChild(verdict);

    var result = null, step = 0;

    function render() {
      var dfa = DFAS[current];
      descLine.textContent = dfa.desc;
      // default sample string per machine
      if (current === "div3" && !/^[01]*$/.test(input.value)) input.value = "110";
      if ((current === "evenA" || current === "endsAB" || current === "containsAA") && !/^[ab]*$/.test(input.value)) input.value = "abba";
      compute();
    }
    function compute() {
      result = runDFA(DFAS[current], input.value.trim());
      step = 0;
      draw();
    }
    function draw() {
      var dfa = DFAS[current];
      var s = input.value.trim();
      // tape
      var t = "";
      for (var i = 0; i < s.length; i++) {
        var cls = i < step ? "done" : (i === step ? "cur" : "");
        t += "<span class='" + cls + "'>" + s[i] + "</span> ";
      }
      tape.innerHTML = t || "<span style='opacity:.4'>(empty string \u03B5)</span>";
      // states
      statesBox.innerHTML = "";
      var stateList = Object.keys(dfa.delta);
      var cur = result.trace[Math.min(step, result.trace.length - 1)].state;
      stateList.forEach(function (st) {
        var e = el("div", "afl-state" + (st === cur ? " active" : "") + (dfa.accept.indexOf(st) !== -1 ? " accept" : ""), st);
        statesBox.appendChild(e);
      });
      // verdict
      if (result.error) {
        verdict.innerHTML = "<span class='afl-verdict afl-rej'>ERROR — " + result.error + "</span>";
      } else if (step >= s.length) {
        verdict.innerHTML = result.accepted
          ? "<span class='afl-verdict afl-acc'>ACCEPTED \u2713 &nbsp;halted in " + result.trace[result.trace.length - 1].state + "</span>"
          : "<span class='afl-verdict afl-rej'>REJECTED \u2717 &nbsp;halted in " + result.trace[result.trace.length - 1].state + "</span>";
      } else {
        verdict.innerHTML = "<span class='afl-note'>step " + step + " / " + s.length + " \u2014 currently in " + cur + "</span>";
      }
    }
    runBtn.onclick = function () { compute(); step = input.value.trim().length; draw(); };
    stepBtn.onclick = function () { if (!result || result.error) compute(); if (step < input.value.trim().length) { step++; draw(); } };
    resetBtn.onclick = function () { step = 0; draw(); };
    input.oninput = function () { compute(); };
    render();
    return card;
  }

  // ---- LAB: Subset Construction ----
  function labSubset() {
    var card = el("div", "afl-card accent");
    card.appendChild(el("span", "afl-labtag", "\u269B Lab 5 · Rabin\u2013Scott by hand"));
    card.appendChild(el("div", "afl-labname", "The Subset Construction Engine"));
    card.appendChild(el("div", "afl-lab-desc",
      "An NFA can be in many states at once. Rabin & Scott's trick: make each <em>set</em> of NFA states a single DFA state. "
      + "Watch it build here. The NFA below recognizes strings over {a,b} that <b>end in \u201Cab\u201D</b> \u2014 it nondeterministically <em>guesses</em> where the final \u201Cab\u201D begins."));

    card.appendChild(el("div", "afl-mono",
      "NFA  (start n0, accept n2)\n"
      + "  n0 --a--> {n0, n1}     n0 --b--> {n0}\n"
      + "  n1 --b--> {n2}\n"
      + "  n2  (accepting, no moves)"));

    var row = el("div", "afl-row");
    var buildBtn = el("button", "afl-btn", "\u25B6 build DFA, one subset at a time");
    var allBtn = el("button", "afl-btn ghost", "reveal all");
    var resetBtn = el("button", "afl-btn ghost", "reset");
    row.appendChild(buildBtn); row.appendChild(allBtn); row.appendChild(resetBtn);
    card.appendChild(row);

    var box = el("div", "afl-subset");
    var log = el("div", "afl-mono"); log.style.display = "none";
    card.appendChild(box); card.appendChild(log);

    var order = subsetConstruct(NFA_endsAB);
    var shown = 0;

    function drawOne() {
      if (shown >= order.length) return;
      var n = order[shown];
      var lbl = "{" + n.set.join(",") + "}";
      if (n.key === "\u2205") lbl = "\u2205 (dead)";
      var node = el("div", "afl-subnode" + (n.accept ? " acc" : ""),
        "<b>" + lbl + "</b><br><span style='opacity:.7'>a\u2192{" + n.tr.a.replace(/,/g, ",") + "}  b\u2192{" + n.tr.b + "}</span>");
      box.appendChild(node);
      shown++;
      if (shown === order.length) {
        log.style.display = "";
        var acc = order.filter(function (o) { return o.accept; }).map(function (o) { return "{" + o.set.join(",") + "}"; });
        log.textContent = "Done. " + order.length + " reachable subsets \u2192 " + order.length + "-state DFA.\n"
          + "Accepting DFA states (those containing n2): " + acc.join(", ") + "\n"
          + "This DFA is exactly the \u201Cends with ab\u201D machine from Lab 1 \u2014 nondeterminism bought us nothing but convenience.";
      }
    }
    buildBtn.onclick = drawOne;
    allBtn.onclick = function () { while (shown < order.length) drawOne(); };
    resetBtn.onclick = function () { box.innerHTML = ""; log.style.display = "none"; shown = 0; };
    return card;
  }

  // ---- LAB: PDA Stack Machine ----
  function labPDA() {
    var card = el("div", "afl-card accent");
    card.appendChild(el("span", "afl-labtag", "\u2699 Lab 3 · a stack changes everything"));
    card.appendChild(el("div", "afl-labname", "The Pushdown Stack Machine"));
    card.appendChild(el("div", "afl-lab-desc",
      "No finite automaton can recognize <b>{ a\u207Fb\u207F }</b> \u2014 it can't count without bound. Give it a single <em>stack</em> and it can. "
      + "Push on the way up, pop on the way down; accept iff the stack empties exactly. Watch the memory that regular languages don't have."));

    var pick = el("div", "afl-row");
    var mode = "anbn";
    var chip1 = el("button", "afl-chip on", "L = a\u207Fb\u207F");
    var chip2 = el("button", "afl-chip", "L = balanced ( )");
    pick.appendChild(chip1); pick.appendChild(chip2);
    card.appendChild(pick);

    var row = el("div", "afl-row");
    var input = el("input", "afl-input"); input.value = "aaabbb"; input.setAttribute("spellcheck", "false");
    var runBtn = el("button", "afl-btn", "\u25B6 run");
    var stepBtn = el("button", "afl-btn ghost", "step");
    var resetBtn = el("button", "afl-btn ghost", "reset");
    row.appendChild(input); row.appendChild(runBtn); row.appendChild(stepBtn); row.appendChild(resetBtn);
    card.appendChild(row);

    var flex = el("div"); flex.style.display = "flex"; flex.style.gap = "24px"; flex.style.alignItems = "flex-start"; flex.style.flexWrap = "wrap";
    var left = el("div"); left.style.flex = "1"; left.style.minWidth = "240px";
    var tape = el("div", "afl-tape");
    var verdict = el("div");
    left.appendChild(tape); left.appendChild(verdict);
    var right = el("div");
    right.appendChild(el("div", "afl-note", "stack"));
    var stack = el("div", "afl-stack");
    right.appendChild(stack);
    flex.appendChild(left); flex.appendChild(right);
    card.appendChild(flex);

    var result = null, step = 0;

    function setMode(m) {
      mode = m;
      chip1.classList.toggle("on", m === "anbn");
      chip2.classList.toggle("on", m === "paren");
      input.value = m === "anbn" ? "aaabbb" : "(()())";
      compute();
    }
    chip1.onclick = function () { setMode("anbn"); };
    chip2.onclick = function () { setMode("paren"); };

    function compute() { result = runPDA(input.value.trim(), mode); step = 0; draw(); }
    function draw() {
      var s = input.value.trim();
      // how many chars consumed at this step
      var consumed = Math.min(step, result.trace.length);
      var t = "";
      for (var i = 0; i < s.length; i++) {
        var cls = i < consumed ? "done" : (i === consumed ? "cur" : "");
        t += "<span class='" + cls + "'>" + s[i] + "</span> ";
      }
      tape.innerHTML = t || "<span style='opacity:.4'>(empty string \u03B5)</span>";
      // stack at this step
      var stk = consumed > 0 && result.trace[consumed - 1] ? result.trace[consumed - 1].stack : [];
      stack.innerHTML = "";
      stk.forEach(function () { stack.appendChild(el("div", "afl-cell", "\u25AE")); });
      if (step >= result.trace.length || step >= s.length) {
        if (result.err) verdict.innerHTML = "<span class='afl-verdict afl-rej'>REJECTED \u2717 &nbsp;" + result.err + "</span>";
        else if (result.accepted) verdict.innerHTML = "<span class='afl-verdict afl-acc'>ACCEPTED \u2713 &nbsp;stack emptied exactly</span>";
        else verdict.innerHTML = "<span class='afl-verdict afl-rej'>REJECTED \u2717 &nbsp;" + result.leftover + " symbol(s) left on the stack</span>";
      } else {
        var act = result.trace[consumed] ? result.trace[consumed].act : "";
        verdict.innerHTML = "<span class='afl-note'>next: read '" + (s[consumed] || "") + "' \u2192 " + act + "</span>";
      }
    }
    runBtn.onclick = function () { compute(); step = input.value.trim().length; draw(); };
    stepBtn.onclick = function () { if (!result) compute(); if (step < input.value.trim().length) { step++; draw(); } };
    resetBtn.onclick = function () { step = 0; draw(); };
    input.oninput = compute;
    compute();
    return card;
  }

  // ---- LAB: Chomsky Hierarchy Explorer ----
  function labHierarchy() {
    var card = el("div", "afl-card accent");
    card.appendChild(el("span", "afl-labtag", "\u25CE Lab 2 · the four rings"));
    card.appendChild(el("div", "afl-labname", "The Chomsky Hierarchy Explorer"));
    card.appendChild(el("div", "afl-lab-desc",
      "Four nested classes of language, each strictly larger than the one inside it. Click a ring to see its grammar, its machine, "
      + "how much memory it gets, and the <b>witness language</b> that proves it's genuinely more powerful than the ring within."));

    var RINGS = [
      { k: "RE", lbl: "Type 0 · Recursively Enumerable", size: 320, color: "#e76f51",
        grammar: "\u03B1 \u2192 \u03B2  (unrestricted rewriting)", machine: "Turing machine", mem: "unbounded tape",
        ex: "{ \u27E8M,w\u27E9 : M halts on w }", witness: "the Halting problem \u2014 separates RE from context-sensitive; membership here is only semi-decidable." },
      { k: "CS", lbl: "Type 1 · Context-Sensitive", size: 250, color: "#e9c46a",
        grammar: "\u03B1A\u03B2 \u2192 \u03B1\u03B3\u03B2  (rewrite A only in context)", machine: "Linear-bounded automaton", mem: "tape = input length",
        ex: "{ a\u207Fb\u207Fc\u207F : n \u2265 1 }", witness: "a\u207Fb\u207Fc\u207F \u2014 three matched counts defeat a single stack; separates CS from context-free." },
      { k: "CF", lbl: "Type 2 · Context-Free", size: 180, color: "#2dd4bf",
        grammar: "A \u2192 \u03B3  (single nonterminal on the left)", machine: "Pushdown automaton", mem: "one stack",
        ex: "{ a\u207Fb\u207F : n \u2265 0 }", witness: "a\u207Fb\u207F \u2014 balanced nesting needs a stack; separates CF from regular. This is BNF / every language grammar." },
      { k: "REG", lbl: "Type 3 · Regular", size: 110, color: "#7dd3fc",
        grammar: "A \u2192 aB | a  (right-linear)", machine: "Finite automaton", mem: "no memory",
        ex: "{ strings ending in \u201Cab\u201D }", witness: "the innermost ring \u2014 regex, lexers, grep. Everything a finite machine can recognize." }
    ];

    var rings = el("div", "afl-rings");
    var info = el("div", "afl-card");
    info.style.marginTop = "8px";

    RINGS.forEach(function (r, i) {
      var d = el("div", "afl-ring");
      d.style.width = r.size + "px"; d.style.height = r.size + "px";
      d.style.borderColor = r.color;
      d.style.zIndex = i + 1;
      var lab = el("div", "afl-ringlbl", r.k);
      lab.style.color = r.color;
      d.appendChild(lab);
      d.onclick = function (e) { e.stopPropagation(); select(i); };
      rings.appendChild(d);
    });
    card.appendChild(rings);
    card.appendChild(info);

    function select(i) {
      var r = RINGS[i];
      rings.querySelectorAll(".afl-ring").forEach(function (d, k) { d.classList.toggle("sel", k === i); });
      info.innerHTML =
        "<div style='font-family:Georgia,serif;font-size:20px;color:" + r.color + ";margin-bottom:6px'>" + r.lbl + "</div>"
        + "<div class='afl-mono'>grammar rule form :  " + r.grammar + "\n"
        + "recognizing machine:  " + r.machine + "\n"
        + "memory it gets     :  " + r.mem + "\n"
        + "example language   :  " + r.ex + "</div>"
        + "<p style='color:#cde;margin:8px 0 0'><b>Witness / boundary:</b> " + r.witness + "</p>";
    }
    select(3); // start on Regular, the innermost
    return card;
  }

})();
