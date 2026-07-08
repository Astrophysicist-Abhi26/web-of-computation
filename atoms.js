// THE WEB OF COMPUTATION — atoms.js (Part 3: playable atoms)
// Five toys, one overlay. Each atom is init-once, reset-able.

const ATOM_FOR = { computability:"turing", "classic-crypto":"enigma",
  prehistory:"perceptron", deep:"marble", llm:"attention" };
const ATOM_NAMES = { turing:"Turing machine", enigma:"Enigma", perceptron:"Perceptron vs XOR",
  marble:"Gradient descent", attention:"Attention head" };

const atomsEl = document.getElementById("atoms");
document.getElementById("toggle-atoms").addEventListener("click", () => openAtom("turing"));
document.getElementById("atoms-close").addEventListener("click", closeAtoms);
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
// 2) ENIGMA — 3 historical rotors + reflector B (single-step, simplified)
// ============================================================
const A = 65, N = 26;
const ROTORS = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ",   // I
                "AJDKSIRUXBLHWTMCQGZNPYFVOE",   // II
                "BDFHJLCPRTXVZNYEIWGAKMUSQO"];  // III
const REFL = "YRUHQSLDPXNGOKMIEBFZCWVJAT";      // reflector B
const INV = ROTORS.map(w => { const inv = Array(N);
  for (let i = 0; i < N; i++) inv[w.charCodeAt(i) - A] = String.fromCharCode(A + i);
  return inv.join(""); });
const EN = { pos: [0,0,0], log: "" };
function encipher(c) {
  EN.pos[2] = (EN.pos[2] + 1) % N;                 // right rotor steps first (simplified: no double-step)
  let x = c, path = [String.fromCharCode(A + c)];
  const fwd = (w,p,x) => ((w.charCodeAt((x + p) % N) - A) - p + N) % N;
  for (let r = 2; r >= 0; r--) { x = fwd(ROTORS[r], EN.pos[r], x); path.push(String.fromCharCode(A+x)); }
  x = REFL.charCodeAt(x) - A; path.push(String.fromCharCode(A+x));
  for (let r = 0; r < 3; r++)  { x = fwd(INV[r], EN.pos[r], x); path.push(String.fromCharCode(A+x)); }
  return { out: x, path };
}
function initEnigma() {
  EN.pos = [0,0,0]; EN.log = "";
  const kb = document.getElementById("en-keys"); kb.innerHTML = "";
  for (let i = 0; i < N; i++) {
    const b = document.createElement("button");
    b.className = "key"; b.textContent = String.fromCharCode(A + i);
    b.addEventListener("click", () => {
      const { out, path } = encipher(i);
      EN.log += String.fromCharCode(A + out);
      document.getElementById("en-lamp").textContent = String.fromCharCode(A + out);
      document.getElementById("en-path").textContent =
        "path  " + path.join(" → ") + "   (in → III → II → I → reflector → I → II → III → out)";
      drawEnigma();
    });
    kb.appendChild(b);
  }
  document.getElementById("en-lamp").textContent = "·";
  document.getElementById("en-path").textContent = "press a key — the signal snakes through three rotors and bounces off the reflector";
  drawEnigma();
}
function drawEnigma() {
  document.getElementById("en-rotors").textContent =
    "rotor windows  " + EN.pos.map(p => String.fromCharCode(A + p)).join(" · ") +
    "   (right rotor steps every keypress — why the same letter encrypts differently each time)";
  document.getElementById("en-out").textContent = "ciphertext  " + (EN.log || "—");
}
document.getElementById("en-reset").addEventListener("click", initEnigma);

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
