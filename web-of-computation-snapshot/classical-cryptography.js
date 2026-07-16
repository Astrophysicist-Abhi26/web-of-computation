// CLASSICAL CRYPTOGRAPHY — one deep, self-contained learning experience.
// Loaded only when the Classical Cryptography field is opened. The map and
// the site's global interface remain untouched. Companion to
// information-theory.js and modern-cryptography.js (same visual language).
(function () {
"use strict";

// ---------------------------------------------------------------- chapters
const CHAPTERS = [
  {
    icon: "🏛", title: "Frequency analysis — the first codebreak", who: "Al-Kindi · Baghdad · c. 850",
    lead: "A cipher can scramble which symbol stands for which letter — but not how often each letter occurs.",
    formula: "English: E≈12.7% T≈9.1% A≈8.2% … Z≈0.07%  ·  the fingerprint no substitution can erase",
    what: `A substitution cipher swaps every letter for another symbol. For centuries
      that felt impenetrable. Al-Kindi's insight: language has a statistical
      fingerprint. Count the symbols in the ciphertext, count the letters in any
      long plaintext of the same language, and compare the rankings. In a long
      English message, a frequent cipher symbol may be E—but digraphs, word shapes
      and context are needed because natural samples vary.`,
    how: `This is arguably the earliest recorded use of statistical inference to
      solve a real problem — a thousand years before the word "statistics"
      existed. It works because substitution preserves the frequency profile of
      the language while only relabeling it. The longer the ciphertext, the more
      the counts converge and the faster the cipher falls.`,
    story: `Al-Kindi — "the philosopher of the Arabs" — worked at Baghdad's House
      of Wisdom and wrote across philosophy, mathematics and science. His treatise
      on deciphering messages, often discussed alongside early study of Arabic
      letter frequencies, then vanished from wider view for a
      millennium: it was rediscovered in Istanbul's Sulaimaniyya archive and
      published only in 1987. A later landmark came in 1586–87: Thomas Phelippes
      cryptanalyzed Mary Queen of Scots' substitution cipher, helping expose the
      Babington Plot and providing evidence used at her trial.`,
    today: `Frequency analysis is the ancestor of every statistical attack — and
      of statistical NLP itself. Counting symbol frequencies to model language is
      exactly how n-gram models began, and in spirit it is what a language model's
      training objective still does: exploit the fact that language is not random.`
  },
  {
    icon: "🪦", title: "Vigenère — 300 years of 'unbreakable'", who: "Bellaso 1553 · broken by Babbage ~1854 & Kasiski 1863",
    lead: "Use many Caesar alphabets in rotation and the frequency fingerprint smears flat. For three centuries, that was enough.",
    formula: "cᵢ = (mᵢ + k[i mod L]) mod 26  ·  IoC ≈ 0.067 (English) → ≈ 0.045 (short-key Vigenère)",
    what: `The Vigenère cipher enciphers with a repeating keyword: each key letter
      selects a different Caesar shift. A ciphertext E might be a shifted A in one
      position and a shifted T in another, so single-letter counting fails and the
      histogram flattens. Europe called it le chiffre indéchiffrable — the
      indecipherable cipher.`,
    how: `Its weakness is the repetition of the key. If the keyword has length L,
      then every L-th letter is enciphered with the SAME Caesar shift. Guess L
      (Kasiski: repeated ciphertext fragments tend to sit a multiple of L apart;
      Friedman later: estimate L from the index of coincidence), slice the text
      into L columns, and each column falls to plain Al-Kindi frequency analysis.`,
    story: `Giovan Battista Bellaso published the scheme in 1553; history
      misfiled the credit under Blaise de Vigenère. It resisted every attack for
      ~300 years. Charles Babbage — the same Babbage whose engine opens this map —
      cracked it around 1854 but never published; one theory holds British
      intelligence kept it quiet during the Crimean War. Friedrich Kasiski
      published the method independently in 1863, and William Friedman's 1920
      index of coincidence turned the attack into routine statistics.`,
    today: `The lesson outlived the cipher: a big keyspace is not security.
      Vigenère has 26^L keys, yet structure — the repeating key — betrays it.
      Modern cryptanalysis still hunts exactly this: any statistical structure
      that leaks from ciphertext, from stream-cipher biases to side channels.`
  },
  {
    icon: "🏛", title: "Kerckhoffs' principle", who: "Auguste Kerckhoffs · 1883",
    lead: "Assume the enemy has captured your machine. Security must live in the key alone.",
    formula: "Security(system) = Security(key) — even when everything else is public",
    what: `In La Cryptographie Militaire, Kerckhoffs laid down the rule that
      defines modern practice: a cipher must remain secure even if everything
      about it — the algorithm, the machine, the procedure — is known to the
      enemy. Only the key may be assumed secret, because only the key can be
      changed after a compromise.`,
    how: `The reasoning is operational, not mathematical: machines are captured,
      staff defect, procedures leak. A system whose safety depends on its own
      secrecy fails permanently the first time it is exposed. A system whose
      safety depends only on the key survives capture — you just change keys.
      Shannon restated it bluntly: "the enemy knows the system."`,
    story: `The Germans in WWII arguably trusted the opposite instinct: Enigma's
      design was effectively known to the Allies (the Poles had reconstructed it
      mathematically, and machines were captured), yet German operators kept
      assuming the traffic was safe. Bletchley read it anyway. Kerckhoffs had
      predicted the failure mode sixty years in advance.`,
    today: `Every serious cipher today is public — AES, RSA, the lattice schemes —
      and survives years of open attack before deployment. "Security through
      obscurity" is now the name of an anti-pattern. Open scrutiny is not a
      weakness of modern cryptography; it is the mechanism of its strength.`
  },
  {
    icon: "🪦", title: "Enigma & the Bombe — permutations win a war", who: "Scherbius 1918 · Rejewski 1932 · Turing–Welchman 1940",
    lead: "An astronomical keyspace, defeated by mathematics, engineering, cribs and operational mistakes—not blind brute force.",
    formula: "Each keypress applies a fresh permutation — but reflector ⇒ no letter ever encrypts to itself",
    what: `Enigma enciphered each letter through a plugboard, three stepping
      rotors and a reflector, changing the substitution alphabet with every
      keypress. Its keyspace was astronomically large — far beyond any search.
      The reflector imposed a useful constraint: no letter could encrypt to
      itself. That constraint helped reject guesses, but it was one ingredient
      among captured material, cribs, operator habits and changing procedures.`,
    how: `Marian Rejewski's 1932 attack modeled the machine as permutation
      compositions and exploited a protocol blunder (the doubled message key) —
      pure group theory recovering wiring he had never seen. Turing and Welchman's
      Bombe (1940) mechanized deduction: assume a crib (a guessed plaintext like a
      weather report), wire the implications as circuits, and let contradictions
      eliminate thousands of rotor settings per second. Logic, electrified.`,
    story: `Weeks before the 1939 invasion, Polish intelligence handed France and
      Britain reconstructed Enigma doubles and their methods — one of history's
      great intellectual gifts. At Bletchley Park, decrypts codenamed Ultra fed
      Allied command for the rest of the war and materially aided Allied operations;
      any exact claim about how many years it shortened the war is necessarily
      counterfactual. It is also this map's founding story: the
      same Turing of the 1936 paper, turning pen-and-paper logic into machinery.
      Play with the full simulator in this field's ⚛ atom — press a key twice and
      watch the same letter come out different.`,
    today: `Enigma is the standard cautionary tale taught to every cryptography
      student: keyspace ≠ security, protocol discipline matters as much as the
      machine, and structural regularities such as the self-encryption ban become
      powerful when combined with cribs, protocol weaknesses and disciplined analysis.`
  },
  {
    icon: "🏛", title: "Perfect secrecy — the one-time pad", who: "Vernam 1917 · Mauborgne · Shannon's proof 1949",
    lead: "One cipher is provably unbreakable. The proof also tells you exactly why it is impractical.",
    formula: "c = m ⊕ k, k truly random, |k| ≥ |m|, never reused  ⇒  I(M;C) = 0",
    what: `XOR the message with a truly random key at least as long as the
      message, use the key once, and destroy it. Shannon proved the ciphertext
      then carries zero information about the message: for every candidate
      plaintext there exists a key producing the observed ciphertext, all equally
      likely. There is literally nothing for a cryptanalyst to find.`,
    how: `Shannon's 1949 paper (worked out in classified form by 1945) founded
      the mathematics of secrecy and proved two directions: the one-time pad
      achieves perfect secrecy, and NO cipher can achieve it with a key shorter
      than the message. Perfection is possible — and its price is a key-delivery
      problem as heavy as the message itself.`,
    story: `Gilbert Vernam patented the XOR teleprinter cipher in 1917; Joseph
      Mauborgne added the crucial rule: the key must be random and never reused.
      The Soviets learned the cost of breaking that rule — wartime pad reuse let
      the US VENONA project read parts of their most secret traffic for years.
      The Moscow–Washington hotline of 1963 ran on one-time tapes: when nothing
      less than provable secrecy would do, this was the cipher chosen.`,
    today: `The one-time pad marks the boundary of the classical world: perfect
      but impractical. All of modern cryptography lives on the other side of that
      trade — computational security, where breaking is possible in principle but
      infeasible in practice. That story continues in Modern Cryptography, one
      node to the west.`
  }
];

// ---------------------------------------------------------------- sources
const SOURCES = [
  {
    type: "HISTORY OF THE MANUSCRIPT · 1992",
    title: "Ibrahim A. Al-Kadi — Origins of Cryptology: The Arab Contributions",
    note: "The scholarly account of Al-Kindi's c. 850 treatise, rediscovered in Istanbul and published 1987.",
    url: "https://doi.org/10.1080/0161-119291866801"
  },
  {
    type: "FOUNDATIONAL PAPER · 1883",
    title: "Auguste Kerckhoffs — La Cryptographie Militaire",
    note: "The principle that security must reside in the key alone (full scanned text + translation).",
    url: "https://www.petitcolas.net/kerckhoffs/index.html"
  },
  {
    type: "FOUNDATIONAL PAPER · 1926",
    title: "Gilbert S. Vernam — Cipher Printing Telegraph Systems",
    note: "The XOR stream cipher that became the one-time pad.",
    url: "https://doi.org/10.1109/T-AIEE.1926.5061224"
  },
  {
    type: "FIRST-PERSON ACCOUNT · 1981",
    title: "Marian Rejewski — How Polish Mathematicians Broke the Enigma Cipher",
    note: "The 1932 permutation-theory attack, told by the man who did it.",
    url: "https://doi.org/10.1109/MAHC.1981.10033"
  },
  {
    type: "FOUNDATIONAL PAPER · 1949",
    title: "Claude E. Shannon — Communication Theory of Secrecy Systems",
    note: "Perfect secrecy defined and proved; cryptography becomes mathematics.",
    url: "https://doi.org/10.1002/j.1538-7305.1949.tb00928.x"
  }
];

// ------------------------------------------------------------ shared style
// Same base classes as information-theory.js; inject only if absent so the
// two modules share one stylesheet whichever loads first.
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

const CC_CSS = `
  #panel .cc-hist{display:flex;gap:2px;align-items:flex-end;height:92px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(0,0,0,.2);padding:8px 6px 17px;margin:.7rem 0}
  #panel .cc-col{flex:1 1 0;position:relative;height:100%;min-width:0}
  #panel .cc-eng{position:absolute;bottom:0;left:0;right:0;background:rgba(77,208,201,.22);border-top:1px solid rgba(77,208,201,.85);border-radius:2px 2px 0 0}
  #panel .cc-obs{position:absolute;bottom:0;left:20%;right:20%;background:var(--gold);border-radius:2px 2px 0 0;opacity:.92;transition:height .18s ease}
  #panel .cc-col b{position:absolute;bottom:-14px;left:-2px;right:-2px;text-align:center;font:400 6.5px "IBM Plex Mono",monospace;color:#817a9d}
  #panel .cc-legend{display:flex;gap:1rem;font:400 .58rem "IBM Plex Mono",monospace;color:var(--dim);margin:-.3rem 0 .4rem}
  #panel .cc-legend i{font-style:normal}
  #panel .cc-legend .g{color:var(--gold)} #panel .cc-legend .t{color:#73ddd8}
  #panel .cc-text{font:500 .63rem/1.75 "IBM Plex Mono",monospace;word-break:break-all;letter-spacing:.1em;color:#c9c4dc;background:rgba(0,0,0,.22);border-radius:8px;padding:.5rem .6rem;margin:.4rem 0}
  #panel .cc-text.plain{color:#9fe8c0}
  #panel .cc-rowlabel{color:var(--dim);font:400 .55rem "IBM Plex Mono",monospace;text-transform:uppercase;margin:.5rem 0 0}
  #panel .cc-keyline{font:500 .68rem "IBM Plex Mono",monospace;color:var(--dim);margin:.45rem 0 0}
  #panel .cc-keyline em{font-style:normal;color:var(--gold);letter-spacing:.25em}
  #panel .cc-attacklog{font:400 .6rem/1.6 "IBM Plex Mono",monospace;color:#817a9d;margin:.35rem 0 0}
`;

function ensureStyles() {
  if (!document.getElementById("information-theory-css") &&
      !document.getElementById("it-base-css")) {
    const base = document.createElement("style");
    base.id = "it-base-css";
    base.textContent = BASE_CSS;
    document.head.appendChild(base);
  }
  if (!document.getElementById("classical-crypto-css")) {
    const own = document.createElement("style");
    own.id = "classical-crypto-css";
    own.textContent = CC_CSS;
    document.head.appendChild(own);
  }
}
window.__ensureLearningBaseStyles = ensureStyles;

// -------------------------------------------------------------- cipher core
const A = 65;
const ENGLISH = [8.17,1.49,2.78,4.25,12.70,2.23,2.02,6.09,6.97,0.15,0.77,4.03,
  2.41,6.75,7.51,1.93,0.10,5.99,6.33,9.06,2.76,0.98,2.36,0.15,1.97,0.07]; // %

const MESSAGES = [
  "THE ENEMY KNOWS THE SYSTEM BUT NOT THE KEY MEET AT DAWN BY THE OLD BRIDGE AND BRING THE SEALED ORDERS TO THE NORTH TOWER BEFORE THE BELLS RING TWICE",
  "IF YOU CAN READ THIS THE COURIER WAS CAPTURED CHANGE EVERY KEY AT MIDNIGHT AND TRUST NO SIGNAL FROM THE HARBOR STATION UNTIL FURTHER NOTICE ARRIVES",
  "THE SUPPLY CONVOY LEAVES AT FIRST LIGHT UNDER FULL RADIO SILENCE EVERY STATION MUST CONFIRM THE NEW CODEBOOK PAGE SEVEN BEFORE THE SUN GOES DOWN"
];
const VIG_KEYS = ["LUNA", "NOVA", "GOLD", "IRIS", "ECHO"];

const lettersOnly = s => s.toUpperCase().replace(/[^A-Z]/g, "");
const caesarEnc = (txt, k) =>
  txt.replace(/[A-Z]/g, ch => String.fromCharCode(A + (ch.charCodeAt(0) - A + k) % 26));
const vigenereEnc = (txt, key) => {
  let j = 0;
  return txt.replace(/[A-Z]/g, ch => {
    const k = key.charCodeAt(j++ % key.length) - A;
    return String.fromCharCode(A + (ch.charCodeAt(0) - A + k) % 26);
  });
};
const otpEnc = (txt, key) => {
  let j = 0;
  return txt.replace(/[A-Z]/g, ch =>
    String.fromCharCode(A + (ch.charCodeAt(0) - A + key[j++]) % 26));
};

function counts26(txt) {
  const c = new Array(26).fill(0);
  for (const ch of txt) if (ch >= "A" && ch <= "Z") c[ch.charCodeAt(0) - A]++;
  return c;
}
function chi2VsEnglish(txt) {
  const c = counts26(txt), n = c.reduce((a, b) => a + b, 0);
  if (!n) return 0;
  let x = 0;
  for (let i = 0; i < 26; i++) {
    const exp = n * ENGLISH[i] / 100;
    x += (c[i] - exp) * (c[i] - exp) / (exp || 1e-9);
  }
  return x;
}
function indexOfCoincidence(txt) {
  const c = counts26(txt), n = c.reduce((a, b) => a + b, 0);
  if (n < 2) return 0;
  let s = 0;
  for (let i = 0; i < 26; i++) s += c[i] * (c[i] - 1);
  return s / (n * (n - 1));
}
function friedmanKeyLen(txt) {
  const n = lettersOnly(txt).length, ioc = indexOfCoincidence(txt);
  const k = 0.0265 * n / ((0.065 - 0.0385) + n * (ioc - 0.0385));
  return Math.max(1, Math.min(20, k));
}
function bestCaesarShift(txt) { // shift that was APPLIED (decrypt by -shift)
  let best = 0, bestChi = Infinity;
  for (let s = 0; s < 26; s++) {
    const chi = chi2VsEnglish(caesarEnc(txt, (26 - s) % 26));
    if (chi < bestChi) { bestChi = chi; best = s; }
  }
  return { shift: best, chi: bestChi };
}
function crackVigenere(cipher, keyLen) {
  const flat = lettersOnly(cipher);
  let key = "";
  for (let col = 0; col < keyLen; col++) {
    let colTxt = "";
    for (let i = col; i < flat.length; i += keyLen) colTxt += flat[i];
    key += String.fromCharCode(A + bestCaesarShift(colTxt).shift);
  }
  return key;
}
const vigenereDec = (txt, key) => {
  let j = 0;
  return txt.replace(/[A-Z]/g, ch => {
    const k = key.charCodeAt(j++ % key.length) - A;
    return String.fromCharCode(A + (ch.charCodeAt(0) - A + 26 - k) % 26);
  });
};

// ------------------------------------------------------------------- state
const S = { mode: "caesar", msg: "", shift: 3, guess: 0, vigKey: "LUNA",
            otpKey: [], cracked: false, timer: null };

function newMessage() {
  if (S.timer) { clearInterval(S.timer); S.timer = null; }
  S.msg = lettersOnly(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  S.shift = 1 + Math.floor(Math.random() * 25);
  S.vigKey = VIG_KEYS[Math.floor(Math.random() * VIG_KEYS.length)];
  S.otpKey = Array.from(S.msg, () => Math.floor(Math.random() * 26));
  S.guess = 0;
  S.cracked = false;
}
function cipherText() {
  if (S.mode === "caesar") return caesarEnc(S.msg, S.shift);
  if (S.mode === "vig") return vigenereEnc(S.msg, S.vigKey);
  return otpEnc(S.msg, S.otpKey);
}
function attemptText() {
  const c = cipherText();
  if (S.mode === "caesar") return caesarEnc(c, (26 - S.guess) % 26);
  return caesarEnc(c, (26 - bestCaesarShift(c).shift) % 26); // best single shift
}

// --------------------------------------------------------------- rendering
const $ = id => document.getElementById(id);
function renderHist(txt) {
  const host = $("cc-hist");
  if (!host) return;
  const c = counts26(txt), n = c.reduce((a, b) => a + b, 0) || 1;
  const maxPct = 14;
  host.innerHTML = c.map((k, i) => {
    const obs = Math.min(100, (100 * k / n) / maxPct * 100);
    const eng = Math.min(100, ENGLISH[i] / maxPct * 100);
    return `<div class="cc-col">
      <div class="cc-eng" style="height:${eng}%"></div>
      <div class="cc-obs" style="height:${obs}%"></div>
      <b>${String.fromCharCode(A + i)}</b></div>`;
  }).join("");
}

function render() {
  const cipher = cipherText();
  const attempt = attemptText();
  $("cc-cipher").textContent = cipher;
  const chi = chi2VsEnglish(attempt);
  const ioc = indexOfCoincidence(cipher);

  // controls visibility
  $("cc-shift-wrap").style.display = S.mode === "caesar" ? "" : "none";
  $("cc-vigline").style.display = S.mode === "vig" ? "" : "none";
  $("cc-attacklog").textContent = "";

  if (S.mode === "caesar") {
    $("cc-attempt").textContent = attempt;
    $("cc-attempt").classList.toggle("plain", S.guess === S.shift);
    $("cc-guess-v").textContent = String(S.guess);
    renderHist(attempt);
    const ok = S.guess === S.shift;
    setStatus(ok, ok
      ? "✓ Cracked — the E-spike snapped onto the teal fingerprint. Shift = " + S.shift + "."
      : "Drag the shift until the gold bars line up with the teal English fingerprint.");
    $("cc-crack").textContent = "auto-crack (try all 26)";
  } else if (S.mode === "vig") {
    if (S.cracked) {
      const key = crackVigenere(cipher, S.vigKey.length);
      $("cc-attempt").textContent = vigenereDec(cipher, key);
      $("cc-attempt").classList.add("plain");
      $("cc-keyfound").innerHTML = "recovered key: <em>" + key + "</em>";
      renderHist(vigenereDec(cipher, key));
      setStatus(true, "✓ Key \u201C" + key + "\u201D recovered — each column fell to plain frequency analysis.");
    } else {
      $("cc-attempt").textContent = attempt;
      $("cc-attempt").classList.remove("plain");
      $("cc-keyfound").innerHTML = "recovered key: <em>????</em>";
      renderHist(cipher);
      setStatus(false, "✕ Single-alphabet attack fails — the histogram is smeared flat. IoC ≈ " + ioc.toFixed(3) + ".");
    }
    $("cc-vigest").textContent = "Friedman key-length estimate ≈ " + friedmanKeyLen(cipher).toFixed(1) +
      "  (true length " + S.vigKey.length + ")";
    $("cc-crack").textContent = "split into " + S.vigKey.length + " columns & attack each";
  } else { // otp
    $("cc-attempt").textContent = attempt;
    $("cc-attempt").classList.remove("plain");
    renderHist(cipher);
    setStatus(false, "✕ Nothing to find. Every possible plaintext has a key that produces this exact ciphertext — Shannon, 1949.");
    $("cc-crack").textContent = "try to crack it anyway";
  }

  $("cc-ioc").textContent = ioc.toFixed(3);
  $("cc-chi").textContent = chi.toFixed(0);
  $("cc-keyspace").textContent =
    S.mode === "caesar" ? "26" :
    S.mode === "vig" ? "26^" + S.vigKey.length + " ≈ " + Math.round(Math.pow(26, S.vigKey.length) / 1000) + "k"
    : "26^" + S.msg.length;
}
function setStatus(ok, text) {
  const el = $("cc-status");
  el.className = "it-feasible " + (ok ? "yes" : "no");
  el.textContent = text;
}

function autoCrack() {
  if (S.timer) { clearInterval(S.timer); S.timer = null; }
  if (S.mode === "caesar") {
    let s = 0;
    const target = S.shift;
    S.timer = setInterval(() => {
      S.guess = s;
      $("cc-guess").value = String(s);
      render();
      $("cc-attacklog").textContent = "trying shift " + s + " … χ² = " +
        chi2VsEnglish(caesarEnc(cipherText(), (26 - s) % 26)).toFixed(0);
      if (s === target) { clearInterval(S.timer); S.timer = null;
        $("cc-attacklog").textContent = "χ² minimum found at shift " + s + " — 26 keys, milliseconds."; }
      s++;
      if (s > 25 && S.timer) { clearInterval(S.timer); S.timer = null; }
    }, 90);
  } else if (S.mode === "vig") {
    const cipher = cipherText(), L = S.vigKey.length, flat = lettersOnly(cipher);
    let col = 0, found = "";
    S.timer = setInterval(() => {
      let colTxt = "";
      for (let i = col; i < flat.length; i += L) colTxt += flat[i];
      const sh = bestCaesarShift(colTxt).shift;
      found += String.fromCharCode(A + sh);
      $("cc-keyfound").innerHTML = "recovered key: <em>" +
        found + "?".repeat(L - found.length) + "</em>";
      $("cc-attacklog").textContent = "column " + (col + 1) + "/" + L +
        " → best shift " + sh + " → key letter \u201C" + String.fromCharCode(A + sh) + "\u201D";
      col++;
      if (col >= L) {
        clearInterval(S.timer); S.timer = null;
        S.cracked = true; render();
        $("cc-attacklog").textContent = "every " + L + "th letter shares one Caesar shift — Al-Kindi, resurrected by Kasiski.";
      }
    }, 620);
  } else {
    const best = bestCaesarShift(cipherText());
    $("cc-attacklog").textContent = "best single shift gives χ² = " + best.chi.toFixed(0) +
      " — gibberish. No column trick works either: the key never repeats.";
  }
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
  const body = document.getElementById("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(topic => topic.remove());
  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · ABOUT 20 MIN</div>
    <p class="it-hook">Every message hides. Every language leaks.</p>
    <p class="it-intro">Classical cryptography is a 3,000-year arms race between concealment and statistics — from Baghdad's House of Wisdom to Bletchley Park. It ends with Shannon proving exactly where the race can and cannot be won.</p>
    <div class="it-timeline" aria-label="Classical cryptography timeline">
      <div class="it-moment"><b>c. 850</b><span>Al-Kindi</span></div>
      <div class="it-moment"><b>1553</b><span>Vigenère</span></div>
      <div class="it-moment"><b>1883</b><span>Kerckhoffs</span></div>
      <div class="it-moment"><b>1940</b><span>The Bombe</span></div>
      <div class="it-moment"><b>1949</b><span>Shannon</span></div>
    </div>

    <section class="it-lab" aria-labelledby="cc-lab-title">
      <div class="it-kicker">PLAYABLE ATOM</div><h3 id="cc-lab-title">The frequency observatory</h3>
      <p class="it-lab-intro">Crack real ciphers with Al-Kindi's 1,200-year-old telescope: letter counting. Gold bars are the ciphertext under your current guess; teal is English's fingerprint. Make them match and the message surrenders.</p>
      <div class="it-tabs">
        <button class="it-tab on" data-cc="caesar">CAESAR</button>
        <button class="it-tab" data-cc="vig">VIGENÈRE</button>
        <button class="it-tab" data-cc="otp">ONE-TIME PAD</button>
      </div>
      <p class="cc-rowlabel">intercepted ciphertext</p>
      <div class="cc-text" id="cc-cipher"></div>
      <div id="cc-shift-wrap" class="it-control">
        <label for="cc-guess"><span>your shift guess</span><output id="cc-guess-v">0</output></label>
        <input id="cc-guess" type="range" min="0" max="25" step="1" value="0">
      </div>
      <p class="cc-keyline" id="cc-vigline" style="display:none">
        <span id="cc-vigest"></span><br><span id="cc-keyfound"></span></p>
      <p class="cc-rowlabel">decryption attempt</p>
      <div class="cc-text" id="cc-attempt"></div>
      <div class="cc-hist" id="cc-hist" aria-label="Letter frequency histogram"></div>
      <p class="cc-legend"><i class="g">▮ observed</i><i class="t">▮ English fingerprint</i></p>
      <div class="it-metrics">
        <div class="it-metric"><small>INDEX OF COINCIDENCE</small><b id="cc-ioc"></b></div>
        <div class="it-metric"><small>χ² VS ENGLISH</small><b id="cc-chi"></b></div>
        <div class="it-metric"><small>KEYSPACE</small><b id="cc-keyspace"></b></div>
      </div>
      <div id="cc-status" class="it-feasible"></div>
      <div class="it-lab-actions">
        <button class="it-send" id="cc-crack">auto-crack</button>
        <button class="it-send" id="cc-new" style="background:none;border:1px solid rgba(245,196,81,.5);color:var(--gold)">new intercept</button>
      </div>
      <p class="cc-attacklog" id="cc-attacklog"></p>
      <p class="it-caveat">English IoC ≈ 0.067; random text ≈ 0.038. Watch it collapse as the cipher improves — until the one-time pad, where there is provably nothing left to see.</p>
    </section>

    <section class="it-lab">
      <div class="it-kicker">FULL MACHINE COMPANION</div><h3>Step inside the Enigma</h3>
      <p class="it-lab-intro">After learning why statistical attacks work, operate the historically wired three-rotor machine: set rotors and rings, connect plugboard pairs, press keys, and watch the reciprocal lampboard transformation.</p>
      <button class="it-send" id="cc-open-enigma">open the functional Enigma atom</button>
      <p class="it-caveat">The simulator demonstrates rotor stepping and the reflector’s no-self-encryption constraint. The historical breaks also depended on procedures, cribs, intelligence and large-scale electromechanical search.</p>
    </section>

    <h3 class="it-section-title">Open a concept</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Three things to try</b><ol>
      <li>Crack the Caesar by hand — find the tallest gold bar and drag it onto E — before pressing auto-crack.</li>
      <li>Switch to Vigenère: same message, same attack fails. Watch the IoC fall from ≈0.067 toward ≈0.045. Why does splitting into columns resurrect the attack?</li>
      <li>On the one-time pad, press \u201Ctry to crack it anyway.\u201D Then explain to yourself why longer intercepts make Caesar WEAKER but the pad no weaker at all.</li>
    </ol></div>
    <h3 class="it-section-title">Papers & further study</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  newMessage();
  module.querySelectorAll("[data-cc]").forEach(btn => btn.addEventListener("click", () => {
    module.querySelectorAll("[data-cc]").forEach(b => b.classList.toggle("on", b === btn));
    S.mode = btn.dataset.cc;
    S.cracked = false; S.guess = 0;
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
    const g = $("cc-guess"); if (g) g.value = "0";
    render();
  }));
  $("cc-guess").addEventListener("input", e => { S.guess = +e.target.value; render(); });
  $("cc-crack").addEventListener("click", autoCrack);
  $("cc-new").addEventListener("click", () => { newMessage(); $("cc-guess").value = "0"; render(); });
  $("cc-open-enigma").addEventListener("click", () => {
    if (window.openAtomFromField) window.openAtomFromField("enigma");
  });
  render();
}

window.openClassicalCryptoExperience = buildExperience;
// test hook (harmless in production)
window.__ccTest = { lettersOnly, caesarEnc, vigenereEnc, vigenereDec, otpEnc,
  chi2VsEnglish, indexOfCoincidence, friedmanKeyLen, bestCaesarShift, crackVigenere };
})();
