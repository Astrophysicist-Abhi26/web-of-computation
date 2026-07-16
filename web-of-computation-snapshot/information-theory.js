// INFORMATION THEORY — one deep, self-contained learning experience.
// Loaded only when the Information Theory field is opened. The map and the
// site's global interface remain untouched.
(function () {
"use strict";

const CHAPTERS = [
  {
    icon: "🏛", title: "Entropy & the bit", who: "Claude Shannon · 1948",
    lead: "Information is surprise made measurable.",
    formula: "I(x) = −log₂ p(x)   ·   H(X) = −Σ p(x) log₂ p(x)",
    what: `An event carries more information when it was less expected. A fair
      coin has one bit of entropy because either result resolves one equally
      plausible alternative. A heavily biased coin has less average uncertainty,
      even though its rare outcome is individually very surprising.`,
    how: `The logarithm turns independent surprises into sums: learning two
      independent facts worth 2 and 3 bits gives 5 bits. Entropy is the expected
      surprise across a distribution and sets the ideal average compression limit
      for a source.`,
    story: `Shannon's 1948 paper deliberately ignored a message's meaning. That
      abstraction was the breakthrough: telegraph pulses, English letters, DNA,
      images and model tokens can all be treated as choices drawn from a source.`,
    today: `Lossless compression, communication systems, decision trees,
      uncertainty estimates and token prediction all inherit this definition. A
      model that assigns high probability to the observed next token pays fewer bits.`
  },
  {
    icon: "🏛", title: "KL divergence & cross-entropy", who: "Kullback & Leibler · 1951",
    lead: "How expensive is it to believe the wrong distribution?",
    formula: "Dₖₗ(p ∥ q) = Σ p(x) log₂[p(x)/q(x)]   ·   H(p,q) = H(p) + Dₖₗ(p ∥ q)",
    what: `KL divergence measures the extra coding cost paid when data really
      follows p but we use a code optimized for q. Cross-entropy is the total
      expected cost under that mismatched model.`,
    how: `Dₖₗ is never negative, and it is zero only when the distributions agree
      wherever p has probability. It is directional: confusing p for q usually
      costs a different amount from confusing q for p, so it is not a distance
      metric.`,
    story: `Kullback and Leibler introduced their divergence through statistical
      sufficiency. Machine learning later made cross-entropy one of the world's
      most frequently evaluated functions.`,
    today: `Maximum-likelihood classification, language-model training, knowledge
      distillation, variational inference and parts of reinforcement learning use
      these quantities. “Lower loss” means the model needs fewer bits, on average,
      to explain what actually occurred.`
  },
  {
    icon: "🔥", title: "Kolmogorov complexity", who: "Solomonoff · Kolmogorov · Chaitin · 1960s",
    lead: "The shortest program that prints an object is its ultimate description.",
    formula: "K(x) = length of the shortest program U that outputs x",
    what: `A string such as 010101… has a short generating rule; an equally long
      patternless string may be incompressible. Kolmogorov complexity turns that
      intuition into a definition based on program length.`,
    how: `The chosen universal language changes K(x) only by an additive constant,
      but exact Kolmogorov complexity is uncomputable: a general solver would also
      solve the halting problem. Real compressors provide useful upper bounds, not
      the unknowable exact value.`,
    story: `Solomonoff, Kolmogorov and Chaitin arrived at closely related ideas
      independently. The result connects probability, computation and Occam's
      razor: prefer the explanation that describes the observations most compactly.`,
    today: `Minimum-description-length methods, algorithmic randomness, anomaly
      detection and compression-based similarity carry this idea into practice.
      It is a conceptual north star—not a loss function we can compute exactly.`
  },
  {
    icon: "⚙️", title: "Error-correcting codes", who: "Richard Hamming · 1950",
    lead: "Add carefully designed redundancy so a damaged message can heal itself.",
    formula: "Binary symmetric channel capacity: C = 1 − H₂(ε) bits/use",
    what: `Noise flips bits. A code maps a message to a longer codeword whose
      valid patterns are separated. The receiver can use that geometric distance
      to detect—and sometimes correct—corruption.`,
    how: `Repeating each bit three times is an intuitive but inefficient code:
      majority vote corrects one flip per triplet. Hamming codes place parity bits
      strategically; modern LDPC and polar codes approach Shannon's channel limit
      much more efficiently.`,
    story: `Frustrated by relay-computer errors that ruined weekend calculations,
      Hamming asked why a machine could detect an error but not repair it. Shannon's
      coding theorem had already shown that reliable communication below channel
      capacity was possible in principle.`,
    today: `QR codes, SSDs, deep-space links, mobile networks and data centres all
      trade extra symbols for reliability. Quantum error correction extends the
      same ambition to fragile quantum states, with very different constraints.`
  }
];

const SOURCES = [
  {
    type: "FOUNDATIONAL PAPER · 1948",
    title: "Claude E. Shannon — A Mathematical Theory of Communication",
    note: "Entropy, source coding, channel capacity and the noisy-channel theorem.",
    url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x"
  },
  {
    type: "FOUNDATIONAL PAPER · 1950",
    title: "Richard W. Hamming — Error Detecting and Error Correcting Codes",
    note: "The construction and logic of Hamming codes.",
    url: "https://doi.org/10.1002/j.1538-7305.1950.tb00463.x"
  },
  {
    type: "FOUNDATIONAL PAPER · 1951",
    title: "Solomon Kullback & Richard Leibler — On Information and Sufficiency",
    note: "The statistical divergence now written Dₖₗ.",
    url: "https://doi.org/10.1214/aoms/1177729694"
  },
  {
    type: "FOUNDATIONAL PAPER · 1965",
    title: "A. N. Kolmogorov — Three Approaches to the Quantitative Definition of Information",
    note: "Algorithmic information and description length.",
    url: "https://www.mathnet.ru/eng/ppi68"
  },
  {
    type: "OPEN TEXTBOOK",
    title: "David MacKay — Information Theory, Inference, and Learning Algorithms",
    note: "A bridge from Shannon's theory to coding and machine learning.",
    url: "https://www.inference.org.uk/mackay/itila/book.html"
  }
];

function injectStyles() {
  if (document.getElementById("information-theory-css")) return;
  const style = document.createElement("style");
  style.id = "information-theory-css";
  style.textContent = `
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
  #panel #it-entropy-plot{display:block;width:100%;height:150px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(0,0,0,.2);margin:.7rem 0}
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
  #panel .it-transmission{border-top:1px solid rgba(255,255,255,.09);padding-top:.6rem;margin-top:.6rem}
  #panel .it-bitrow{display:grid;grid-template-columns:4.4rem 1fr;gap:.35rem;margin:.35rem 0;align-items:start}
  #panel .it-bitrow>span{color:var(--dim);font:400 .55rem "IBM Plex Mono",monospace;text-transform:uppercase;padding-top:.16rem}
  #panel .it-bits{font:500 .64rem/1.7 "IBM Plex Mono",monospace;word-break:break-all;color:#c9c4dc;letter-spacing:.08em}
  #panel .it-bits i{display:inline-block;width:.24rem}
  #panel .it-bits em{font-style:normal}.it-bits em.flipped{color:#ff786b;text-shadow:0 0 5px rgba(255,93,108,.6)}
  #panel .it-bits em.repaired{color:#9fe8c0;text-shadow:0 0 5px rgba(87,224,138,.45)}
  #panel .it-transmission.pulse{animation:itPulse .42s ease-out}
  @keyframes itPulse{0%{transform:translateX(-4px);opacity:.45}100%{transform:none;opacity:1}}
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
  @media(prefers-reduced-motion:reduce){#panel .it-transmission.pulse{animation:none}}
  `;
  document.head.appendChild(style);
}

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

function binaryEntropy(p) {
  if (p <= 0 || p >= 1) return 0;
  return -p * Math.log2(p) - (1-p) * Math.log2(1-p);
}

function renderPlot(p, noise) {
  const canvas = document.getElementById("it-entropy-plot");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(260, Math.round(rect.width * scale));
  const height = Math.round(150 * scale);
  if (canvas.width !== width || canvas.height !== height) { canvas.width=width; canvas.height=height; }
  const ctx=canvas.getContext("2d"), pad={l:34*scale,r:12*scale,t:13*scale,b:27*scale};
  const W=width-pad.l-pad.r,H=height-pad.t-pad.b;
  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle="rgba(255,255,255,.12)";ctx.lineWidth=1*scale;
  ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,pad.t+H);ctx.lineTo(pad.l+W,pad.t+H);ctx.stroke();
  ctx.font=`${9*scale}px IBM Plex Mono`;ctx.fillStyle="#817a9d";ctx.textAlign="center";
  ctx.fillText("0",pad.l,pad.t+H+16*scale);ctx.fillText("p(1)",pad.l+W/2,pad.t+H+21*scale);ctx.fillText("1",pad.l+W,pad.t+H+16*scale);
  ctx.textAlign="right";ctx.fillText("1 bit",pad.l-5*scale,pad.t+4*scale);ctx.fillText("0",pad.l-5*scale,pad.t+H+3*scale);
  ctx.beginPath();
  for(let i=0;i<=120;i++){const x=i/120,y=binaryEntropy(x),px=pad.l+x*W,py=pad.t+(1-y)*H;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
  ctx.strokeStyle="#f5c451";ctx.lineWidth=2*scale;ctx.stroke();
  const entropy=binaryEntropy(p),x=pad.l+p*W,y=pad.t+(1-entropy)*H;
  ctx.beginPath();ctx.arc(x,y,5*scale,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#f5c451";ctx.lineWidth=2*scale;ctx.stroke();
  const capacity=1-binaryEntropy(noise);
  const cy=pad.t+(1-capacity)*H;
  ctx.setLineDash([4*scale,4*scale]);ctx.beginPath();ctx.moveTo(pad.l,cy);ctx.lineTo(pad.l+W,cy);ctx.strokeStyle="rgba(77,208,201,.75)";ctx.lineWidth=1*scale;ctx.stroke();ctx.setLineDash([]);
  ctx.textAlign="right";ctx.fillStyle="#73ddd8";ctx.fillText("channel C",pad.l+W-3*scale,cy-4*scale);
}

function updateNumbers() {
  const p=+document.getElementById("it-source-p").value;
  const noise=+document.getElementById("it-noise").value;
  const H=binaryEntropy(p),C=1-binaryEntropy(noise);
  document.getElementById("it-source-pv").textContent=p.toFixed(2);
  document.getElementById("it-noise-v").textContent=Math.round(noise*100)+"%";
  document.getElementById("it-h").textContent=H.toFixed(3)+" bits";
  document.getElementById("it-rare").textContent=(-Math.log2(Math.min(p,1-p))).toFixed(2)+" bits";
  document.getElementById("it-capacity").textContent=C.toFixed(3)+" bits";
  const status=document.getElementById("it-feasible"),ok=H<=C;
  status.className="it-feasible "+(ok?"yes":"no");
  status.textContent=ok
    ? "✓ In principle: one channel use per source symbol can carry this source."
    : "✕ One channel use per symbol is insufficient; compress further or use more channel uses.";
  renderPlot(p,noise);
}

function bitMarkup(bits, reference, group, repaired) {
  return bits.map((bit,i)=>{
    const changed=reference && bit!==reference[i];
    const cls=changed?(repaired?"repaired":"flipped"):"";
    const spacer=group && i%group===group-1&&i<bits.length-1?"<i></i>":"";
    return `<em class="${cls}">${bit}</em>${spacer}`;
  }).join("");
}

function transmit() {
  const p=+document.getElementById("it-source-p").value;
  const noise=+document.getElementById("it-noise").value;
  const repeat=document.getElementById("it-repeat").checked;
  const source=Array.from({length:24},()=>Math.random()<p?1:0);
  const encoded=repeat?source.flatMap(b=>[b,b,b]):source.slice();
  const received=encoded.map(b=>Math.random()<noise?1-b:b);
  const decoded=repeat?source.map((_,i)=>{
    const tri=received.slice(i*3,i*3+3);return tri[0]+tri[1]+tri[2]>=2?1:0;
  }):received.slice();
  const channelErrors=received.reduce((n,b,i)=>n+(b!==encoded[i]),0);
  const decodedErrors=decoded.reduce((n,b,i)=>n+(b!==source[i]),0);
  document.getElementById("it-original").innerHTML=bitMarkup(source);
  document.getElementById("it-channel").innerHTML=bitMarkup(received,encoded,repeat?3:0,false);
  document.getElementById("it-recovered").innerHTML=decoded.map((b,i)=>{
    let repaired=false;
    if(repeat&&b===source[i]) repaired=received.slice(i*3,i*3+3).some(x=>x!==source[i]);
    return `<em class="${b!==source[i]?"flipped":repaired?"repaired":""}">${b}</em>`;
  }).join("");
  document.getElementById("it-result").innerHTML=repeat
    ? `<b>${channelErrors}</b> of ${encoded.length} transmitted bits flipped; majority vote left <b>${decodedErrors}</b> wrong source bits.`
    : `<b>${channelErrors}</b> of ${encoded.length} bits flipped; with no redundancy, all ${decodedErrors} remain wrong.`;
  const box=document.getElementById("it-transmission");box.classList.remove("pulse");void box.offsetWidth;box.classList.add("pulse");
}

function bindChapterTabs(module) {
  module.querySelectorAll("details.it-chapter").forEach((details,index)=>{
    details.querySelectorAll(".it-tab").forEach(button=>button.addEventListener("click",()=>{
      details.querySelectorAll(".it-tab").forEach(b=>b.classList.toggle("on",b===button));
      details.querySelector(".it-copy").textContent=CHAPTERS[index][button.dataset.view];
    }));
  });
}

function buildExperience() {
  injectStyles();
  const body=document.getElementById("panel-body");
  if(!body) return;
  body.querySelectorAll(".topic").forEach(topic=>topic.remove());
  const module=document.createElement("section");module.className="it-module";
  module.innerHTML=`
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · ABOUT 20 MIN</div>
    <p class="it-hook">How many yes/no questions does reality owe you?</p>
    <p class="it-intro">Information theory answers without asking what a message means. It measures uncertainty, the cost of describing outcomes, the limits of communication, and the redundancy needed to survive noise.</p>
    <div class="it-timeline" aria-label="Information theory timeline">
      <div class="it-moment"><b>1928</b><span>Hartley</span></div><div class="it-moment"><b>1948</b><span>Shannon</span></div>
      <div class="it-moment"><b>1950</b><span>Hamming</span></div><div class="it-moment"><b>1951</b><span>K–L</span></div>
      <div class="it-moment"><b>1965</b><span>Kolmogorov</span></div>
    </div>

    <section class="it-lab" aria-labelledby="it-lab-title">
      <div class="it-kicker">PLAYABLE ATOM</div><h3 id="it-lab-title">Noise & redundancy laboratory</h3>
      <p class="it-lab-intro">Shape a binary source, damage its channel, then add the simplest error-correcting code. Gold is entropy; teal is channel capacity.</p>
      <div class="it-control"><label for="it-source-p"><span>Probability of a 1</span><output id="it-source-pv">0.50</output></label><input id="it-source-p" type="range" min="0.01" max="0.99" step="0.01" value="0.50"></div>
      <div class="it-control"><label for="it-noise"><span>Bit-flip probability ε</span><output id="it-noise-v">8%</output></label><input id="it-noise" type="range" min="0" max="0.49" step="0.01" value="0.08"></div>
      <canvas id="it-entropy-plot" aria-label="Binary entropy curve and channel capacity"></canvas>
      <div class="it-metrics"><div class="it-metric"><small>SOURCE ENTROPY</small><b id="it-h"></b></div><div class="it-metric"><small>RARE EVENT SURPRISE</small><b id="it-rare"></b></div><div class="it-metric"><small>CHANNEL CAPACITY</small><b id="it-capacity"></b></div></div>
      <div id="it-feasible" class="it-feasible"></div>
      <div class="it-lab-actions"><button class="it-send" id="it-send">send 24 source bits</button><label class="it-check"><input id="it-repeat" type="checkbox"> repeat each bit 3× + majority vote</label></div>
      <div class="it-transmission" id="it-transmission"><div class="it-bitrow"><span>original</span><div class="it-bits" id="it-original">—</div></div><div class="it-bitrow"><span>channel</span><div class="it-bits" id="it-channel">—</div></div><div class="it-bitrow"><span>recovered</span><div class="it-bits" id="it-recovered">—</div></div><p class="it-result" id="it-result">Press send. Red bits were flipped; green bits were repaired by a majority.</p></div>
      <p class="it-caveat">The 3× repetition code is deliberately simple, not efficient. Real codes approach capacity with far less redundancy.</p>
    </section>

    <h3 class="it-section-title">Open a concept</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Three things to try</b><ol><li>Set p(1)=0.50, then 0.95. Why does average entropy fall while the rare event's surprise rises?</li><li>Increase channel noise until the teal capacity line falls below the gold source marker.</li><li>At ε≈20%, send repeatedly with and without 3× repetition. Reliability improves—but what price did you pay?</li></ol></div>
    <h3 class="it-section-title">Papers & further study</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);
  document.getElementById("it-source-p").addEventListener("input",updateNumbers);
  document.getElementById("it-noise").addEventListener("input",updateNumbers);
  document.getElementById("it-send").addEventListener("click",transmit);
  document.getElementById("it-repeat").addEventListener("change",transmit);
  updateNumbers();transmit();
}

window.openInformationTheoryExperience=buildExperience;
})();
