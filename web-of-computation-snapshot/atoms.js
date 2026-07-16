// THE WEB OF COMPUTATION — atoms.js (Part 3: playable atoms)
// Five toys, one overlay. Each atom is init-once, reset-able.

const ATOM_FOR = { computability:"turing", "classic-crypto":"enigma",
  prehistory:"perceptron", deep:"marble", llm:"attention" };
const ATOM_NAMES = { turing:"Turing machine", enigma:"Enigma", perceptron:"Perceptron vs XOR",
  marble:"Gradient descent", attention:"Attention head" };

const atomsEl = document.getElementById("atoms");
document.getElementById("toggle-atoms").addEventListener("click", () => openAtom("turing"));
document.getElementById("atoms-close").addEventListener("click", closeAtoms);
document.getElementById("atoms-close-text").addEventListener("click", closeAtoms);
atomsEl.addEventListener("click", e => { if (e.target === atomsEl) closeAtoms(); });
document.querySelectorAll(".atom-tab").forEach(b =>
  b.addEventListener("click", () => showAtom(b.dataset.atom)));

function openAtom(id) { atomsEl.hidden = false; showAtom(id); }
function closeAtoms() { atomsEl.hidden = true; stopAll(); }
function showAtom(id) {
  document.querySelectorAll(".atom-tab").forEach(b =>
    b.classList.toggle("on", b.dataset.atom === id));
  document.querySelectorAll(".atom-pane").forEach(p =>
    p.hidden = p.id !== "atom-" + id);
  stopAll(); INIT[id]();
}
let raf = { p: null, m: null };
function stopAll() { cancelAnimationFrame(raf.p); cancelAnimationFrame(raf.m); }
window.openAtomFromField = openAtom; // hook used by app.js field panels

// ============================================================
// 1) TURING MACHINE — binary increment
// ============================================================
const TM = {
  rules: { // state -> symbol -> [write, move, next]
    "→": { "0":["0",1,"→"], "1":["1",1,"→"], "_":["_",-1,"C"] },
    "C": { "1":["0",-1,"C"], "0":["1",0,"HALT"], "_":["1",0,"HALT"] }
  },
  desc: { "→":"scan right to the end of the number", "C":"carry: flip 1→0, move left; a 0 or blank becomes 1", "HALT":"done — the number is incremented" }
};
function initTuring() {
  TM.tape = "_1011_______".split(""); TM.head = 1; TM.state = "→"; TM.steps = 0;
  drawTM();
}
function stepTM() {
  if (TM.state === "HALT") return;
  const sym = TM.tape[TM.head] || "_";
  const r = TM.rules[TM.state][sym];
  TM.tape[TM.head] = r[0]; TM.head += r[1]; TM.state = r[2]; TM.steps++;
  drawTM();
}
function drawTM() {
  const t = document.getElementById("tm-tape"); t.innerHTML = "";
  TM.tape.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "cell" + (i === TM.head ? " head" : "");
    d.textContent = c === "_" ? "" : c;
    t.appendChild(d);
  });
  document.getElementById("tm-state").innerHTML =
    `state <b>${TM.state}</b> · step ${TM.steps} — <i>${TM.desc[TM.state]}</i>` +
    (TM.state === "HALT" ? " → read the tape: 1011₂ (11) became 1100₂ (12)." : "");
}
document.getElementById("tm-step").addEventListener("click", stepTM);
document.getElementById("tm-run").addEventListener("click", () => {
  (function loop(){ if (TM.state !== "HALT") { stepTM(); setTimeout(loop, 380); } })();
});
document.getElementById("tm-reset").addEventListener("click", initTuring);

// ============================================================
// 2) ENIGMA — full machine: 5 rotors, reflectors B/C, plugboard,
//    double-stepping, live lampboard + keyboard + rotor discs.
//    Cipher core verified: AAAAA->BDZGO, reciprocal, zero self-maps.
// ============================================================
let initEnigma; // entry point, assigned by the IIFE below
(function () {
"use strict";

const CI = c => c.charCodeAt(0) - 65;
const CH = i => String.fromCharCode(65 + ((i % 26) + 26) % 26);

const WIRING = {
  I:"EKMFLGDQVZNTOWYHXUSPAIBRCJ", II:"AJDKSIRUXBLHWTMCQGZNPYFVOE",
  III:"BDFHJLCPRTXVZNYEIWGAKMUSQO", IV:"ESOVPZJAYQUIRHXLNFTGKDCMWB",
  V:"VZBRGITYUPSDNHLXAWMJQOFECK"
};
const NOTCH = { I:"Q", II:"E", III:"V", IV:"J", V:"Z" };
const REFLECTOR = { B:"YRUHQSLDPXNGOKMIEBFZCWVJAT", C:"FVPJIAOYEDRZXWGCTKUQSBNMHL" };
const inverse = w => { const inv = Array(26); for (let i=0;i<26;i++) inv[CI(w[i])]=i; return inv; };

// German QWERTZ physical layout (keys, lamps, plugboard sockets)
const ROWS = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
const PLUG_PALETTE = ["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7",
  "#ec4899","#14b8a6","#eab308","#f97316","#06b6d4","#8b5cf6","#84cc16","#f43f5e"];

const EG = {
  order:["I","II","III"], refl:"B",
  pos:[0,0,0], ring:[0,0,0],     // [left, middle, right]
  plug:{}, pending:null,
  msg:"", cipher:"", selfMaps:0, lastPath:null
};

function fwdRotor(w, pos, ring, c){
  const s = (((pos-ring)%26)+26)%26; return (((CI(w[(c+s)%26])-s)%26)+26)%26;
}
function bwdRotor(inv, pos, ring, c){
  const s = (((pos-ring)%26)+26)%26; return (((inv[(c+s)%26]-s)%26)+26)%26;
}
function plugOf(c){ const s=CH(c); return EG.plug[s]!==undefined ? CI(EG.plug[s]) : c; }

function stepRotors(){
  const R = EG.order.map(n => CI(NOTCH[n]));
  const rightNotch = EG.pos[2] === R[2];
  const midNotch   = EG.pos[1] === R[1];
  if (midNotch){ EG.pos[0]=(EG.pos[0]+1)%26; EG.pos[1]=(EG.pos[1]+1)%26; }
  else if (rightNotch){ EG.pos[1]=(EG.pos[1]+1)%26; }
  EG.pos[2]=(EG.pos[2]+1)%26;
}

function encipher(c){
  stepRotors();
  const W = EG.order.map(n => WIRING[n]);
  const IV = W.map(inverse);
  const R = REFLECTOR[EG.refl];
  const path = [];
  let x = c;                            path.push(["key", CH(c)]);
  x = plugOf(x);                        path.push(["plug", CH(x)]);
  x = fwdRotor(W[2],EG.pos[2],EG.ring[2],x); path.push([EG.order[2], CH(x)]);
  x = fwdRotor(W[1],EG.pos[1],EG.ring[1],x); path.push([EG.order[1], CH(x)]);
  x = fwdRotor(W[0],EG.pos[0],EG.ring[0],x); path.push([EG.order[0], CH(x)]);
  x = CI(R[x]);                         path.push(["UKW-"+EG.refl, CH(x)]);
  x = bwdRotor(IV[0],EG.pos[0],EG.ring[0],x); path.push([EG.order[0]+"'", CH(x)]);
  x = bwdRotor(IV[1],EG.pos[1],EG.ring[1],x); path.push([EG.order[1]+"'", CH(x)]);
  x = bwdRotor(IV[2],EG.pos[2],EG.ring[2],x); path.push([EG.order[2]+"'", CH(x)]);
  x = plugOf(x);                        path.push(["plug", CH(x)]);
  path.push(["lamp", CH(x)]);
  EG.lastPath = path;
  return x;
}

// ---------- CSS (self-injected once) ----------
function injectCSS(){
  if (document.getElementById("enigma-css")) return;
  const s = document.createElement("style"); s.id = "enigma-css";
  s.textContent = `
  #en-stage{--amber:#f5c451;--amber-dim:#7a642b;--panel:#15130e;--metal:#26221a;
    color:#e8e2d0;font-family:'IBM Plex Mono',ui-monospace,monospace}
  #en-stage .en-wrap{background:linear-gradient(#1a1712,#100e0a);
    border:3px solid #4a3a24;border-radius:14px;padding:14px 16px;
    box-shadow:inset 0 0 40px rgba(0,0,0,.6),0 8px 30px rgba(0,0,0,.5)}
  #en-stage .en-controls{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;
    margin-bottom:12px;font-size:12px}
  #en-stage .en-controls label{display:flex;align-items:center;gap:5px;color:#b8ad90}
  #en-stage select{background:#0c0a07;color:var(--amber);border:1px solid #4a3a24;
    border-radius:6px;padding:3px 6px;font-family:inherit;font-size:12px}
  #en-stage .en-rotors{display:flex;gap:14px;justify-content:center;align-items:center;
    flex-wrap:wrap;margin:6px 0 14px}
  #en-stage .en-rotor{text-align:center}
  #en-stage .en-rotor svg{display:block}
  #en-stage .en-rotor .rname{font-size:11px;color:var(--amber);margin-top:2px;letter-spacing:1px}
  #en-stage .en-rotor .rstep{font-size:10px;color:#8a7f62}
  #en-stage .en-stepbtn{cursor:pointer;user-select:none;color:#9a8f70;font-size:14px;
    padding:0 4px}
  #en-stage .en-stepbtn:hover{color:var(--amber)}
  #en-stage .en-ukw{width:64px;height:64px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%,#3a2f1c,#0e0b07);
    border:2px solid #5a4526;display:flex;align-items:center;justify-content:center;
    flex-direction:column;color:var(--amber);font-size:11px;box-shadow:inset 0 0 12px #000}
  #en-stage .en-board-label{font-size:10px;letter-spacing:2px;color:#7a6f52;
    text-align:center;margin:8px 0 4px}
  #en-stage .en-row{display:flex;justify-content:center;gap:6px;margin:5px 0}
  #en-stage .lamp{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;font-size:15px;font-weight:600;
    background:radial-gradient(circle at 40% 35%,#2a2620,#141210);
    border:1px solid #332d22;color:#5a5347;transition:all .12s}
  #en-stage .lamp.lit{color:#1a1204;
    background:radial-gradient(circle at 40% 35%,#fff2c0,var(--amber));
    border-color:var(--amber);box-shadow:0 0 22px 4px rgba(245,196,81,.75),
    inset 0 0 8px rgba(255,255,255,.6);transform:scale(1.06)}
  #en-stage .key{width:40px;height:40px;border-radius:50%;font-size:15px;font-weight:600;
    cursor:pointer;color:#d8cfb4;
    background:radial-gradient(circle at 40% 30%,#3d3830,#1c1912);
    border:2px solid #0a0806;box-shadow:0 3px 0 #0a0806,inset 0 1px 2px rgba(255,255,255,.15);
    transition:transform .05s}
  #en-stage .key:hover{border-color:var(--amber-dim)}
  #en-stage .key.down{transform:translateY(3px);box-shadow:0 0 0 #0a0806,
    inset 0 0 10px rgba(245,196,81,.5);border-color:var(--amber)}
  #en-stage .en-plug-wrap{position:relative;margin:4px auto 0;width:max-content}
  #en-stage .en-plug-wrap svg{position:absolute;left:0;top:0;pointer-events:none;z-index:0}
  #en-stage .socket{position:absolute;width:34px;height:34px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;
    background:radial-gradient(circle at 40% 35%,#241f18,#0d0b08);
    border:2px solid #3a3226;color:#b8ad90;z-index:1;transition:all .12s}
  #en-stage .socket:hover{border-color:var(--amber)}
  #en-stage .socket.pending{border-color:var(--amber);box-shadow:0 0 12px rgba(245,196,81,.7)}
  #en-stage .en-io{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0 6px;font-size:12px}
  #en-stage .en-io .box{flex:1;min-width:160px;background:#0a0806;border:1px solid #33291a;
    border-radius:6px;padding:6px 9px}
  #en-stage .en-io .lbl{color:#7a6f52;font-size:10px;letter-spacing:1px}
  #en-stage .en-io .val{color:var(--amber);word-break:break-all;min-height:16px;letter-spacing:2px}
  #en-stage .en-path{font-size:11px;color:#a99e80;margin:8px 0;line-height:1.7;text-align:center}
  #en-stage .en-path b{color:var(--amber)}
  #en-stage .en-note{font-size:11px;color:#8a7f62;text-align:center;margin-top:8px;
    border-top:1px solid #2a2318;padding-top:8px}
  #en-stage .en-note b{color:#e08a5a}
  #en-stage .en-buttons{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px}
  #en-stage .en-btn{background:#1c1710;color:var(--amber);border:1px solid #4a3a24;
    border-radius:6px;padding:5px 12px;font-family:inherit;font-size:12px;cursor:pointer}
  #en-stage .en-btn:hover{background:#2a2115}`;
  document.head.appendChild(s);
}

// ---------- rotor disc SVG ----------
function rotorDisc(slot){
  const name = EG.order[slot], pos = EG.pos[slot], notch = CI(NOTCH[name]);
  const R=30, cx=36, cy=36, rr=22;
  let ticks="";
  for (let i=0;i<26;i++){
    const ang = (i - pos) * (360/26) - 90;   // current pos -> top
    const a = ang*Math.PI/180;
    const tx = cx + rr*Math.cos(a), ty = cy + rr*Math.sin(a);
    const isCur = i===pos, isNotch = i===notch;
    ticks += `<text x="${tx.toFixed(1)}" y="${(ty+3).toFixed(1)}" text-anchor="middle"
      font-size="${isCur?9:6}" fill="${isCur?'#f5c451':isNotch?'#ef4444':'#6a6150'}"
      font-weight="${isCur?'700':'400'}">${CH(i)}</text>`;
  }
  return `<svg width="72" height="72" viewBox="0 0 72 72">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#rg${slot})" stroke="#5a4526" stroke-width="2"/>
    <defs><radialGradient id="rg${slot}" cx="38%" cy="32%">
      <stop offset="0" stop-color="#3a2f1c"/><stop offset="1" stop-color="#0e0b07"/>
    </radialGradient></defs>
    ${ticks}
    <polygon points="36,4 32,12 40,12" fill="#f5c451"/>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#0a0806" stroke="#5a4526"/>
    <text x="36" y="40" text-anchor="middle" font-size="12" fill="#f5c451" font-weight="700">${CH(pos)}</text>
  </svg>`;
}

// ---------- render ----------
function render(){
  const st = document.getElementById("en-stage");
  const opt = sel => ["I","II","III","IV","V"].map(r =>
    `<option ${EG.order[sel]===r?"selected":""}>${r}</option>`).join("");
  const lampRow = (letters,slot) => `<div class="en-row">` +
    letters.split("").map(l=>`<div class="lamp" data-l="${l}">${l}</div>`).join("") + `</div>`;
  const keyRow = letters => `<div class="en-row">` +
    letters.split("").map(l=>`<button class="key" data-k="${l}">${l}</button>`).join("") + `</div>`;

  st.innerHTML = `
  <div class="en-wrap">
    <div class="en-controls">
      <label>left <select data-slot="0">${opt(0)}</select></label>
      <label>middle <select data-slot="1">${opt(1)}</select></label>
      <label>right <select data-slot="2">${opt(2)}</select></label>
      <label>reflector <select id="en-refl">
        <option ${EG.refl==="B"?"selected":""}>B</option>
        <option ${EG.refl==="C"?"selected":""}>C</option></select></label>
      <span style="color:#7a6f52">rings AAA · click ▲▼ to set start position</span>
    </div>

    <div class="en-rotors" id="en-rotor-bank"></div>

    <div class="en-board-label">◆ LAMPBOARD ◆</div>
    <div id="en-lamps">${lampRow(ROWS[0])}${lampRow(ROWS[1])}${lampRow(ROWS[2])}</div>

    <div class="en-board-label">◆ KEYBOARD — press a key (or type) ◆</div>
    <div id="en-keyboard">${keyRow(ROWS[0])}${keyRow(ROWS[1])}${keyRow(ROWS[2])}</div>

    <div class="en-board-label">◆ PLUGBOARD (Steckerbrett) — click two letters to wire a pair ◆</div>
    <div class="en-plug-wrap" id="en-plug"></div>

    <div class="en-io">
      <div class="box"><div class="lbl">MESSAGE (plaintext in)</div><div class="val" id="en-msg">—</div></div>
      <div class="box"><div class="lbl">CIPHER (lamp out)</div><div class="val" id="en-cipher">—</div></div>
    </div>
    <div class="en-path" id="en-path">press a key — the current flows plug → right → mid → left → reflector → back → lamp</div>
    <div class="en-note" id="en-note"><b>The flaw:</b> because of the reflector, no letter ever lights its own lamp.
      That guarantee is exactly what Turing's Bombe exploited to crack the daily key.</div>
    <div class="en-buttons">
      <button class="en-btn" id="en-reset">reset rotors → AAA</button>
      <button class="en-btn" id="en-clearmsg">clear message</button>
      <button class="en-btn" id="en-clearplug">clear plugboard</button>
    </div>
  </div>`;

  renderRotorBank();
  renderPlugboard();
  document.getElementById("en-msg").textContent = EG.msg || "—";
  document.getElementById("en-cipher").textContent = EG.cipher || "—";

  // wire controls
  st.querySelectorAll("select[data-slot]").forEach(sel =>
    sel.addEventListener("change", () => { EG.order[+sel.dataset.slot]=sel.value; render(); }));
  document.getElementById("en-refl").addEventListener("change", e => { EG.refl=e.target.value; });
  st.querySelectorAll(".key").forEach(k =>
    k.addEventListener("click", () => press(k.dataset.k)));
  document.getElementById("en-reset").addEventListener("click", () => {
    EG.pos=[0,0,0]; renderRotorBank(); });
  document.getElementById("en-clearmsg").addEventListener("click", () => {
    EG.msg=""; EG.cipher=""; EG.selfMaps=0;
    document.getElementById("en-msg").textContent="—";
    document.getElementById("en-cipher").textContent="—"; clearLamps(); });
  document.getElementById("en-clearplug").addEventListener("click", () => {
    EG.plug={}; EG.pending=null; renderPlugboard(); });
}

function renderRotorBank(){
  const bank = document.getElementById("en-rotor-bank");
  const stepper = slot => `
    <div class="en-rotor">
      <div class="en-stepbtn" data-up="${slot}">▲</div>
      ${rotorDisc(slot)}
      <div class="en-stepbtn" data-dn="${slot}">▼</div>
      <div class="rname">rotor ${EG.order[slot]}</div>
      <div class="rstep">${slot===2?"steps every key":slot===1?"steps on notch":"slowest"}</div>
    </div>`;
  bank.innerHTML = stepper(0)+stepper(1)+stepper(2)+
    `<div style="text-align:center">
       <div class="en-ukw"><span style="font-size:9px">reflector</span><b>UKW-${EG.refl}</b></div>
       <div class="rname" style="margin-top:4px">bounces back</div></div>`;
  bank.querySelectorAll("[data-up]").forEach(b => b.addEventListener("click", ()=>{
    const s=+b.dataset.up; EG.pos[s]=(EG.pos[s]+1)%26; renderRotorBank(); }));
  bank.querySelectorAll("[data-dn]").forEach(b => b.addEventListener("click", ()=>{
    const s=+b.dataset.dn; EG.pos[s]=(EG.pos[s]+25)%26; renderRotorBank(); }));
}

function renderPlugboard(){
  const wrap = document.getElementById("en-plug");
  const cell=44, sr=17, W=9*cell, H=3*cell;
  const centers = {};
  let sockets="";
  ROWS.forEach((row,ri) => {
    const indent = ri===1 ? cell/2 : 0;
    row.split("").forEach((l,ci2) => {
      const x = ci2*cell + indent, y = ri*cell;
      centers[l] = {x:x+sr, y:y+sr};
      const partner = EG.plug[l];
      let ring = "";
      if (partner){ const idx = pairIndex(l); ring = `border-color:${PLUG_PALETTE[idx%PLUG_PALETTE.length]}`; }
      const pend = EG.pending===l ? " pending" : "";
      sockets += `<div class="socket${pend}" data-s="${l}" style="left:${x}px;top:${y}px;${ring}">${l}</div>`;
    });
  });
  // wires
  let lines=""; const done={};
  Object.keys(EG.plug).forEach(a => {
    const b=EG.plug[a]; if(done[a]||done[b])return; done[a]=done[b]=1;
    const idx=pairIndex(a), col=PLUG_PALETTE[idx%PLUG_PALETTE.length];
    const p=centers[a], q=centers[b];
    const mx=(p.x+q.x)/2, my=(p.y+q.y)/2 + 26;
    lines += `<path d="M${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}" stroke="${col}"
      stroke-width="2.5" fill="none" opacity=".85"/>`;
  });
  wrap.style.width=W+"px"; wrap.style.height=H+"px";
  wrap.innerHTML = `<svg width="${W}" height="${H+30}">${lines}</svg>` + sockets;
  wrap.querySelectorAll(".socket").forEach(s =>
    s.addEventListener("click", () => plugClick(s.dataset.s)));
}
function pairIndex(letter){
  const keys = Object.keys(EG.plug).filter(k => k < EG.plug[k]).sort();
  const norm = letter < EG.plug[letter] ? letter : EG.plug[letter];
  return keys.indexOf(norm);
}
function plugClick(l){
  if (EG.plug[l]){ const p=EG.plug[l]; delete EG.plug[l]; delete EG.plug[p]; EG.pending=null; renderPlugboard(); return; }
  if (EG.pending===null){ EG.pending=l; renderPlugboard(); return; }
  if (EG.pending===l){ EG.pending=null; renderPlugboard(); return; }
  if (Object.keys(EG.plug).length>=26){ EG.pending=null; renderPlugboard(); return; }
  EG.plug[EG.pending]=l; EG.plug[l]=EG.pending; EG.pending=null; renderPlugboard();
}

function clearLamps(){ document.querySelectorAll("#en-lamps .lamp").forEach(x=>x.classList.remove("lit")); }
let lampTimer=null;
function press(letter){
  const c = CI(letter), out = encipher(c), outL = CH(out);
  EG.msg += letter; EG.cipher += outL;
  if (letter===outL) EG.selfMaps++;   // will always stay 0
  // key press animation
  const kbtn = document.querySelector(`#en-keyboard .key[data-k="${letter}"]`);
  if (kbtn){ kbtn.classList.add("down"); setTimeout(()=>kbtn.classList.remove("down"),120); }
  // lamp
  clearLamps();
  const lamp = document.querySelector(`#en-lamps .lamp[data-l="${outL}"]`);
  if (lamp) lamp.classList.add("lit");
  clearTimeout(lampTimer); lampTimer = setTimeout(clearLamps, 650);
  // readouts
  renderRotorBank();
  document.getElementById("en-msg").textContent = EG.msg;
  document.getElementById("en-cipher").textContent = EG.cipher;
  const p = EG.lastPath;
  document.getElementById("en-path").innerHTML =
    p.map(([stage,ltr],i)=> (i===0?"":"→ ") +
      `<span title="${stage}"><b>${ltr}</b><sub style="color:#6a6150;font-size:9px">${stage}</sub></span>`
    ).join(" ");
}

// physical keyboard (attached once, guarded by pane visibility)
document.addEventListener("keydown", e => {
  const pane = document.getElementById("atom-enigma");
  if (!pane || pane.hidden) return;
  const k = e.key.toUpperCase();
  if (/^[A-Z]$/.test(k)){ e.preventDefault(); press(k); }
});

initEnigma = function(){ injectCSS(); render(); };
})();

// ============================================================
// 3) PERCEPTRON vs XOR — Minsky's objection and its resolution
// ============================================================
const P = {};
function initPerceptron() {
  P.hidden = document.getElementById("pc-hidden").checked;
  P.data = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]]; // XOR
  const rnd = () => (Math.random()*2-1);
  P.w1 = [[rnd(),rnd()],[rnd(),rnd()]]; P.b1 = [rnd(),rnd()];
  P.w2 = [rnd(),rnd()]; P.b2 = rnd(); P.epoch = 0;
  cancelAnimationFrame(raf.p); trainLoop();
}
const sig = z => 1/(1+Math.exp(-z));
function fwd(x, y) {
  if (!P.hidden) return { o: sig(P.w2[0]*x + P.w2[1]*y + P.b2) };
  const h = [sig(P.w1[0][0]*x + P.w1[0][1]*y + P.b1[0]),
             sig(P.w1[1][0]*x + P.w1[1][1]*y + P.b1[1])];
  return { h, o: sig(P.w2[0]*h[0] + P.w2[1]*h[1] + P.b2) };
}
function trainLoop() {
  const lr = 2.5;
  for (let k = 0; k < 40; k++) {           // 40 epochs per frame
    for (const [x,y,t] of P.data) {
      const f = fwd(x,y), o = f.o, dO = (o - t) * o * (1-o);
      if (P.hidden) {
        for (let j = 0; j < 2; j++) {
          const dH = dO * P.w2[j] * f.h[j] * (1 - f.h[j]);
          P.w2[j] -= lr * dO * f.h[j];
          P.w1[j][0] -= lr * dH * x; P.w1[j][1] -= lr * dH * y; P.b1[j] -= lr * dH;
        }
      } else { P.w2[0] -= lr * dO * x; P.w2[1] -= lr * dO * y; }
      P.b2 -= lr * dO;
    }
    P.epoch++;
  }
  drawPerceptron();
  raf.p = requestAnimationFrame(trainLoop);
}
function drawPerceptron() {
  const c = document.getElementById("pc-canvas"), ctx = c.getContext("2d"), Wd = c.width, H = c.height;
  const img = ctx.createImageData(Wd, H);
  for (let py = 0; py < H; py += 2) for (let px = 0; px < Wd; px += 2) {
    const o = fwd(px/Wd*1.4-0.2, 1.2-py/H*1.4).o;
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
      const i = ((py+dy)*Wd + px+dx) * 4;
      img.data[i]=o*255; img.data[i+1]=60; img.data[i+2]=(1-o)*255; img.data[i+3]=68;
    }
  }
  ctx.putImageData(img,0,0);
  let loss = 0;
  for (const [x,y,t] of P.data) {
    const o = fwd(x,y).o; loss += (o-t)*(o-t);
    const px=(x+0.2)/1.4*Wd, py=(1.2-y)/1.4*H;
    ctx.beginPath(); ctx.arc(px,py,9,0,7);
    ctx.fillStyle = t ? "#ff7847" : "#4d9fff"; ctx.fill();
    ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.stroke();
  }
  const solved = loss < 0.05;
  document.getElementById("pc-status").innerHTML =
    `epoch ${P.epoch} · loss ${loss.toFixed(3)} — ` + (P.hidden
      ? (solved ? "<b>solved.</b> One hidden layer bends the boundary — Minsky's objection, resolved (1986)."
                : "hidden layer learning…")
      : "a single layer draws one straight line — XOR needs two regions. <b>It will thrash forever (Minsky & Papert, 1969).</b>");
}
document.getElementById("pc-hidden").addEventListener("change", initPerceptron);
document.getElementById("pc-reset").addEventListener("click", initPerceptron);

// ============================================================
// 4) GRADIENT MARBLE — nonconvex loss, learning-rate slider
// ============================================================
const M = { f: x => x*x*x*x/20 - x*x + x/2 + 3.2, df: x => x*x*x/5 - 2*x + 0.5 };
function initMarble() { M.x = -3.6; M.trail = []; cancelAnimationFrame(raf.m); marbleLoop(); }
function marbleLoop() {
  const lr = +document.getElementById("mb-lr").value;
  document.getElementById("mb-lrv").textContent = lr.toFixed(2);
  M.x -= lr * M.df(M.x);
  if (!isFinite(M.x) || Math.abs(M.x) > 40) { M.x = -3.6; M.trail = []; } // diverged — respawn
  M.trail.push(M.x); if (M.trail.length > 60) M.trail.shift();
  const c = document.getElementById("mb-canvas"), ctx = c.getContext("2d"), Wd=c.width, H=c.height;
  ctx.clearRect(0,0,Wd,H);
  const X = x => (x+4.2)/8.4*Wd, Y = y => H - (y/7)*H;
  ctx.beginPath(); ctx.strokeStyle="#9a93b8"; ctx.lineWidth=2;
  for (let px = 0; px <= Wd; px++) { const x = px/Wd*8.4-4.2, y = M.f(x);
    px ? ctx.lineTo(px, Y(y)) : ctx.moveTo(px, Y(y)); }
  ctx.stroke();
  M.trail.forEach((x,i) => { ctx.globalAlpha = i/M.trail.length*0.5;
    ctx.beginPath(); ctx.arc(X(x), Y(M.f(x)), 4, 0, 7); ctx.fillStyle="#f5c451"; ctx.fill(); });
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(X(M.x), Y(M.f(M.x)), 9, 0, 7);
  ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle="#f5c451"; ctx.lineWidth=3; ctx.stroke();
  document.getElementById("mb-status").textContent =
    lr > 0.9 ? "too hot: the marble overshoots and rattles — this is training divergence" :
    lr < 0.03 ? "too cold: convergence by geological epoch" :
    "each step: x ← x − η·∇f(x). Notice it settles in whichever valley it reaches first — a local minimum.";
  raf.m = requestAnimationFrame(marbleLoop);
}
document.getElementById("mb-reset").addEventListener("click", initMarble);

// ============================================================
// 5) ATTENTION HEAD — 4 tokens, live softmax(QKᵀ)
// ============================================================
const AT = {
  toks: ["the","cat","sat","purring"],
  Q: [[0.2,0.1],[1.4,0.2],[0.3,1.5],[1.1,1.2]],
  K: [[0.1,0.2],[1.5,0.1],[0.2,1.4],[1.2,1.1]],
  sel: 2
};
function initAttention() { drawAttention(); }
function drawAttention() {
  const T = +document.getElementById("at-temp").value;
  document.getElementById("at-tempv").textContent = T.toFixed(1);
  const W = AT.toks.map((_,i) => {
    const s = AT.K.map(k => (AT.Q[i][0]*k[0] + AT.Q[i][1]*k[1]) / T);
    const m = Math.max(...s), e = s.map(v => Math.exp(v-m)), Z = e.reduce((a,b)=>a+b);
    return e.map(v => v/Z);
  });
  // heatmap
  const c = document.getElementById("at-canvas"), ctx = c.getContext("2d");
  const cell = 52, ox = 78, oy = 34;
  ctx.clearRect(0,0,c.width,c.height);
  ctx.font = "12px 'IBM Plex Mono'"; ctx.fillStyle = "#9a93b8";
  AT.toks.forEach((t,j) => ctx.fillText(t, ox + j*cell + 6, oy - 10));
  AT.toks.forEach((t,i) => {
    ctx.fillStyle = i === AT.sel ? "#f5c451" : "#9a93b8";
    ctx.fillText(t, 6, oy + i*cell + 30);
    W[i].forEach((w,j) => {
      ctx.fillStyle = `rgba(245,196,81,${0.08 + w*0.9})`;
      ctx.fillRect(ox + j*cell, oy + i*cell, cell-4, cell-4);
      ctx.fillStyle = w > 0.5 ? "#0e0618" : "#e8e4f4";
      ctx.fillText(w.toFixed(2), ox + j*cell + 8, oy + i*cell + 30);
      if (i === AT.sel) { ctx.strokeStyle="#f5c451"; ctx.lineWidth=1.5;
        ctx.strokeRect(ox + j*cell, oy + i*cell, cell-4, cell-4); }
    });
  });
  // sentence with arcs from selected token
  const row = document.getElementById("at-tokens"); row.innerHTML = "";
  AT.toks.forEach((t,j) => {
    const b = document.createElement("button");
    b.className = "key tok" + (j === AT.sel ? " on" : "");
    b.textContent = t;
    b.style.boxShadow = `0 0 ${4 + W[AT.sel][j]*26}px rgba(245,196,81,${W[AT.sel][j]})`;
    b.addEventListener("click", () => { AT.sel = j; drawAttention(); });
    row.appendChild(b);
  });
  document.getElementById("at-status").innerHTML =
    `row = softmax(Q·Kᵀ/τ) for “<b>${AT.toks[AT.sel]}</b>” — its strongest key is ` +
    `“<b>${AT.toks[W[AT.sel].indexOf(Math.max(...W[AT.sel]))]}</b>”. ` +
    "Lower τ → sharper lookup (more like a dictionary); higher τ → blur. This soft, differentiable lookup, stacked and parallelized, is the Transformer (2017).";
}
document.getElementById("at-temp").addEventListener("input", drawAttention);

const INIT = { turing:initTuring, enigma:initEnigma, perceptron:initPerceptron,
  marble:initMarble, attention:initAttention };
