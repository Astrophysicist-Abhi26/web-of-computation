// MODERN CRYPTOGRAPHY — an interactive journey from public-key exchange to PQC.
// It enriches only the Modern Cryptography field panel; the main map is untouched.
(function () {
"use strict";

const CHAPTERS = [
  {
    icon:"🏛", title:"The key-distribution revolution", who:"Diffie, Hellman & Merkle · 1976",
    lead:"Two strangers create a shared secret while an eavesdropper watches every message.",
    formula:"A = gᵃ mod p  ·  B = gᵇ mod p  ·  Bᵃ ≡ Aᵇ ≡ gᵃᵇ (mod p)",
    what:`Before public-key cryptography, secret communication first required a
      secret meeting, trusted courier or pre-shared key. Diffie–Hellman replaced
      that logistical circle with a one-way mathematical operation: exponentiation
      modulo a prime is fast; reversing it—the discrete-log problem—can be hard.`,
    how:`Alice publishes gᵃ mod p and Bob publishes gᵇ mod p. Each raises the
      other public value to a private exponent and arrives at gᵃᵇ. Eve sees p, g,
      gᵃ and gᵇ, but not a or b. Authentication is still required: unauthenticated
      Diffie–Hellman is vulnerable to an active person-in-the-middle attack.`,
    story:`The 1976 paper opens with a thunderclap — “We stand today on the
      brink of a revolution in cryptography” — and it was right. Ralph Merkle had
      reached the same summit from another face: his 1974 Berkeley course project
      on “puzzles” for public key agreement was dismissed by his professor, and
      his paper languished in review for years; Hellman later insisted the scheme
      be called Diffie–Hellman–Merkle. The trio took on the NSA-dominated culture
      of secrecy and won: cryptography became an open science. The chapter below
      on GCHQ tells the eerie mirror-image of this story.`,
    today:`Ephemeral Diffie–Hellman, usually over elliptic curves, helps create
      session keys for secure web connections and messaging. The ephemeral
      secrets can provide forward secrecy: stealing tomorrow’s long-term key
      need not reveal yesterday’s recorded sessions.`
  },
  {
    icon:"🏛", title:"RSA — locks, signatures and factoring", who:"Rivest, Shamir & Adleman · 1977–78",
    lead:"Publish the lock. Keep the mathematical trapdoor that opens it.",
    formula:"n = pq  ·  c = mᵉ mod n  ·  m = cᵈ mod n  ·  ed ≡ 1 mod φ(n)",
    what:`RSA made public-key encryption and digital signatures concrete. The
      public key contains n and e; the private key is derived using the secret
      factors p and q. A signature reverses the roles: the private operation
      creates evidence that the public operation can verify.`,
    how:`Euler’s theorem explains why the exponents undo each other. Security
      depends on using large, carefully generated primes, secure padding, and
      implementations that do not leak through timing or faults. “Textbook RSA”
      shown in the toy below is educational, deterministic and unsafe in practice;
      deployed RSA uses standardized padding such as OAEP or PSS.`,
    story:`In April 1977, after a Passover dinner, Ron Rivest lay awake and by
      morning had the algorithm that had eluded the trio for a year; Adleman —
      who kept knocking down earlier attempts — judged this one sound and asked
      to be listed last. Martin Gardner’s August 1977 Scientific American column
      unveiled it with a 129-digit challenge ciphertext and a $100 prize; one
      estimate quoted for cracking it was 40 quadrillion years. It took 17: in
      1994, ~600 volunteers coordinating over the early internet factored RSA-129
      in eight months. The hidden plaintext — “The magic words are squeamish
      ossifrage” — became cryptography’s most famous nonsense sentence, and a
      standing lesson: key sizes age as algorithms and hardware improve.`,
    today:`RSA remains widely encountered for signatures and compatibility,
      though new protocols often prefer elliptic-curve or post-quantum schemes.
      Its conceptual legacy is larger than one algorithm: encryption, identity
      and trust can be built from public mathematical objects.`
  },
  {
    icon:"🏛", title:"Secret prehistory at GCHQ", who:"Ellis · Cocks · Williamson · 1969–74",
    lead:"A revolution can happen twice when one version is classified.",
    formula:"classified discovery ≠ public scientific ecosystem",
    what:`James Ellis proposed “non-secret encryption”; Clifford Cocks devised
      an RSA-like construction; Malcolm Williamson found a key-agreement method.
      Their work remained classified and therefore could not be reviewed, cited
      or developed by the open community.`,
    how:`Independent discovery is common when technology and mathematics make
      an idea newly reachable. Priority is therefore not one simple timestamp:
      invention, publication, practical deployment and community impact can
      belong to different people and institutions.`,
    story:`Ellis found the idea in 1969 in a WWII Bell Labs report about masking
      speech with receiver-added noise — proof that the recipient could take part
      in concealment — but couldn’t construct the mathematics. In 1973 Clifford
      Cocks, 22, fresh from Cambridge number theory and weeks into the job, heard
      the open problem over tea and solved it the same evening, in about half an
      hour, essentially inventing RSA four years early; being classified work, he
      couldn’t even write it down at home, so he carried it in his head overnight.
      Williamson, told of it, spent the night trying to prove it impossible and
      instead derived Diffie–Hellman. All of it stayed secret for 24 years. GCHQ
      declassified the papers in December 1997 — James Ellis had died just weeks
      earlier, knowing the reveal was coming but never seeing his name credited in
      public. The one-page 1973 Cocks note is linked below; reading it feels like
      opening a letter from a parallel universe.`,
    today:`Modern cryptography depends on open specifications, public
      competitions and adversarial review. Classification still has a role, but
      secrecy prevents the broad scrutiny on which trustworthy standards rely.`
  },
  {
    icon:"🔥", title:"Zero knowledge — prove without revealing", who:"Goldwasser, Micali & Rackoff · 1985",
    lead:"Convince me that you know the secret while teaching me nothing about it.",
    formula:"completeness + soundness + zero knowledge  ·  bluff survives k rounds with probability ≤ 2⁻ᵏ",
    what:`A zero-knowledge proof lets a prover demonstrate a statement without
      disclosing the witness—the secret that makes it true. The three goals are
      completeness for honest proofs, soundness against false claims, and a
      transcript that reveals no additional knowledge.`,
    how:`Many explanations use a cave with two entrances and a locked internal
      door. A verifier asks the hidden prover to emerge from a randomly chosen
      side. Someone who knows the password always succeeds; a bluffer guessed the
      requested side only half the time. Repetition drives the bluff probability
      down exponentially. Real protocols replace the cave with algebra.`,
    story:`Goldwasser, Micali and Rackoff reframed proof itself as an interactive
      conversation with a measurable knowledge cost — and the idea was so strange
      that their paper was famously rejected three times before STOC accepted it
      in 1985. Eight years later it shared the first Gödel Prize ever awarded. The
      cave parable you can play above comes from a real 1989 paper, “How to Explain
      Zero-Knowledge Protocols to Your Children.” The startling possibility was
      never merely hiding a message, but hiding the reason a claim is true.`,
    today:`Zero-knowledge systems support privacy-preserving credentials,
      verifiable computation and blockchain scaling. Practical families make
      different trade-offs among proof size, verification time, setup assumptions
      and resistance to quantum attacks.`
  },
  {
    icon:"🔥", title:"Quantum threat & the post-quantum migration", who:"Shor 1994 · Regev 2005 · NIST 2024–25",
    lead:"A future computer changes which mathematical problems can safely carry trust.",
    formula:"Shor: factoring & discrete log become polynomial-time  ·  LWE: b = ⟨a,s⟩ + e mod q",
    what:`Shor’s algorithm showed that a sufficiently large fault-tolerant
      quantum computer could break RSA and conventional Diffie–Hellman. It does
      not break every cipher: symmetric systems face a different, smaller
      quantum speedup and can respond with suitable key sizes.`,
    how:`Post-quantum cryptography runs on ordinary computers but relies on
      problem families not presently known to yield to classical or quantum
      attacks. Regev’s learning-with-errors work helped establish lattices:
      recover a hidden structure from equations deliberately blurred by small
      errors—a high-dimensional cousin of finding a point through fog.`,
    story:`After an eight-year international process, NIST finalized ML-KEM,
      ML-DSA and SLH-DSA in August 2024. In March 2025 it selected HQC as a backup
      encryption algorithm for future standardization. Selection and a finalized
      standard are different milestones, so the migration story is still moving.`,
    today:`Organizations are inventorying vulnerable keys and protocols because
      “harvest now, decrypt later” threatens data that must remain secret for
      years. Migration means new algorithms, formats, hardware, testing and
      operational agility—not merely swapping one library function.`
  }
];

const SOURCES = [
  {type:"FOUNDATIONAL PAPER · 1976", title:"Diffie & Hellman — New Directions in Cryptography",
   note:"Public-key distribution, authentication and the conceptual break with pre-shared secrets.", url:"https://doi.org/10.1109/TIT.1976.1055638"},
  {type:"FOUNDATIONAL PAPER · 1978", title:"Rivest, Shamir & Adleman — Digital Signatures and Public-Key Cryptosystems",
   note:"The original RSA construction and its public-key/signature applications.", url:"https://doi.org/10.1145/359340.359342"},
  {type:"DECLASSIFIED PRIMARY SOURCE · 1973", title:"Clifford Cocks — A Note on ‘Non-Secret Encryption’ (GCHQ, released 1997)",
   note:"RSA four years early, on a single typed page — classified for 24 years. Read the actual document.", url:"https://cryptocellar.org/cesg/notense.pdf"},
  {type:"DECLASSIFIED HISTORY", title:"GCHQ — The prehistory of public-key cryptography",
   note:"The official account of Ellis, Cocks and Williamson’s classified work.", url:"https://www.gchq.gov.uk/information/pioneering-public-key-cryptography"},
  {type:"FOUNDATIONAL PAPER · 1985", title:"Goldwasser, Micali & Rackoff — The Knowledge Complexity of Interactive Proof Systems",
   note:"The paper that formalized zero-knowledge interactive proofs.", url:"https://doi.org/10.1145/22145.22178"},
  {type:"FOUNDATIONAL PAPER · 1994", title:"Peter Shor — Algorithms for Quantum Computation",
   note:"Polynomial-time quantum algorithms for factoring and discrete logarithms.", url:"https://doi.org/10.1109/SFCS.1994.365700"},
  {type:"FOUNDATIONAL PAPER · 2005", title:"Oded Regev — Lattices, Learning with Errors and Cryptography",
   note:"A cornerstone of lattice-based post-quantum cryptography.", url:"https://doi.org/10.1145/1060590.1060603"},
  {type:"OFFICIAL STANDARD UPDATE · 2024", title:"NIST — First three finalized post-quantum standards",
   note:"FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) and FIPS 205 (SLH-DSA).", url:"https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards"},
  {type:"OFFICIAL SELECTION · 2025", title:"NIST — HQC selected as a backup post-quantum algorithm",
   note:"A selection for future standardization, distinct from a finalized standard.", url:"https://www.nist.gov/news-events/news/2025/03/nist-selects-hqc-fifth-algorithm-post-quantum-encryption"}
];

const MC_CSS = `
  #panel .mc-stage{display:grid;grid-template-columns:1fr .78fr 1fr;gap:.35rem;align-items:stretch;margin:.7rem 0}
  #panel .mc-party,#panel .mc-eve{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.55rem;text-align:center;background:rgba(255,255,255,.025)}
  #panel .mc-party b,#panel .mc-eve b{display:block;font:600 .72rem "IBM Plex Mono",monospace;color:var(--ink)}
  #panel .mc-party small,#panel .mc-eve small{display:block;color:var(--dim);font:400 .54rem/1.35 "IBM Plex Mono",monospace;margin:.2rem 0}
  #panel .mc-value{display:block;color:#9fe8c0;font:600 .72rem "IBM Plex Mono",monospace;word-break:break-all}
  #panel .mc-eve{border-color:rgba(255,112,112,.25)} #panel .mc-eve b{color:#ffad91}
  #panel .mc-packet{position:absolute;top:48%;width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 12px var(--gold);opacity:0}
  #panel .mc-stage.flying .mc-a{animation:mcFlyA 1.25s ease-in-out} #panel .mc-stage.flying .mc-b{animation:mcFlyB 1.25s ease-in-out}
  @keyframes mcFlyA{0%{left:12%;opacity:1}50%{left:50%;opacity:1}100%{left:88%;opacity:0}}
  @keyframes mcFlyB{0%{right:12%;opacity:1}50%{right:50%;opacity:1}100%{right:88%;opacity:0}}
  #panel .mc-equation{font:500 .62rem/1.6 "IBM Plex Mono",monospace;color:#9fe8c0;background:rgba(0,0,0,.22);border-radius:8px;padding:.5rem .6rem;margin:.55rem 0;overflow-x:auto}
  #panel .mc-log{min-height:2.6rem;color:#a9a1c2;font:400 .61rem/1.45 "IBM Plex Mono",monospace;border-left:2px solid rgba(255,112,112,.45);padding:.35rem .5rem;margin:.5rem 0}
  #panel .mc-labpane[hidden]{display:none}
  #panel .mc-lockrow{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;margin:.65rem 0}
  #panel .mc-lock{border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:.5rem;text-align:center;background:rgba(0,0,0,.16)}
  #panel .mc-lock span{display:block;font-size:1.1rem}.mc-lock small{color:var(--dim);font:400 .54rem "IBM Plex Mono",monospace}.mc-lock b{display:block;color:var(--gold);font:600 .68rem "IBM Plex Mono",monospace;margin-top:.2rem;word-break:break-all}
  #panel .mc-cave{position:relative;height:112px;border:1px solid rgba(217,139,255,.25);border-radius:60px 60px 12px 12px;background:radial-gradient(circle at 50% 100%,rgba(217,139,255,.13),rgba(0,0,0,.25) 65%);margin:.7rem 0;overflow:hidden}
  #panel .mc-door{position:absolute;left:50%;top:14px;transform:translateX(-50%);width:34px;height:43px;border:2px solid #8a73b6;border-radius:18px 18px 4px 4px;color:var(--gold);font:700 .7rem/40px "IBM Plex Mono",monospace;text-align:center}
  #panel .mc-mouth{position:absolute;bottom:8px;color:var(--dim);font:500 .58rem "IBM Plex Mono",monospace}.mc-mouth.a{left:12%}.mc-mouth.b{right:12%}
  #panel .mc-prover{position:absolute;left:18%;bottom:29px;width:13px;height:13px;border-radius:50%;background:#9fe8c0;box-shadow:0 0 11px #9fe8c0;transition:left .45s ease,top .45s ease,bottom .45s ease}
  #panel .mc-prover.at-b{left:78%} #panel .mc-prover.cross{left:49%;bottom:58px}
  #panel .mc-zkstats{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem}
  @media(max-width:420px){#panel .mc-stage{grid-template-columns:1fr}#panel .mc-lockrow{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){#panel .mc-stage.flying .mc-packet{animation:none}.mc-prover{transition:none}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("modern-crypto-css")) {
    const style=document.createElement("style"); style.id="modern-crypto-css";
    style.textContent=MC_CSS; document.head.appendChild(style);
  }
}

const $ = id => document.getElementById(id);
const gcd=(a,b)=>{a=BigInt(a);b=BigInt(b);while(b){[a,b]=[b,a%b];}return a;};
function egcd(a,b){if(!b)return[a,1n,0n];const[g,x,y]=egcd(b,a%b);return[g,y,x-(a/b)*y];}
function inverse(a,m){const[g,x]=egcd(BigInt(a),BigInt(m));if(g!==1n)throw Error("no inverse");return (x%m+m)%m;}
function modPow(base,exp,mod){base=BigInt(base)%BigInt(mod);exp=BigInt(exp);mod=BigInt(mod);let out=1n;while(exp){if(exp&1n)out=out*base%mod;base=base*base%mod;exp>>=1n;}return out;}

const DH_PRESETS=[{p:23,g:5,label:"p=23 · visible"},{p:101,g:2,label:"p=101 · classroom"},{p:467,g:2,label:"p=467 · challenge"}];
const RSA_PRESETS=[{p:11,q:17},{p:47,q:59},{p:101,q:113}];
const S={dh:0,a:6,b:15,dhTimer:null,rsa:0,message:42,rsaTimer:null,zkRounds:0,zkWins:0,zkKnows:false,zkBusy:false};

function chapterMarkup(ch,index){return `<details class="it-chapter" ${index===0?"open":""}>
  <summary><span class="it-chapter-title">${ch.icon} ${ch.title}</span><span class="it-chapter-meta">${ch.who}</span><span class="it-chapter-lead">${ch.lead}</span></summary>
  <div class="it-chapter-body"><code class="it-formula">${ch.formula}</code>
  <div class="it-tabs" role="tablist"><button class="it-tab on" data-view="what">WHAT</button><button class="it-tab" data-view="how">HOW</button><button class="it-tab" data-view="story">STORY</button><button class="it-tab" data-view="today">TODAY</button></div>
  <p class="it-copy">${ch.what}</p></div></details>`;}
function sourceMarkup(s){return `<a class="it-source" href="${s.url}" target="_blank" rel="noopener"><small>${s.type}</small><strong>${s.title}</strong><span>${s.note}</span><i aria-hidden="true">↗</i></a>`;}

function dhValues(){const x=DH_PRESETS[S.dh],p=BigInt(x.p),g=BigInt(x.g),a=BigInt(S.a),b=BigInt(S.b);const A=modPow(g,a,p),B=modPow(g,b,p);return{x,p,g,a,b,A,B,shared:modPow(B,a,p)};}
function clampDhSecrets(){const max=DH_PRESETS[S.dh].p-2;S.a=Math.min(S.a,max);S.b=Math.min(S.b,max);}
function renderDh(){
  clampDhSecrets();const v=dhValues(),max=v.x.p-2;
  $("mc-dh-prime").value=String(S.dh);$("mc-a").max=String(max);$("mc-b").max=String(max);$("mc-a").value=String(S.a);$("mc-b").value=String(S.b);
  $("mc-av").textContent=S.a;$("mc-bv").textContent=S.b;
  $("mc-A").textContent="A = "+v.A;$("mc-B").textContent="B = "+v.B;
  $("mc-public").textContent=`p=${v.p}, g=${v.g}, A=${v.A}, B=${v.B}`;
  $("mc-shared-a").textContent="secret = "+v.shared;$("mc-shared-b").textContent="secret = "+modPow(v.A,v.b,v.p);
  $("mc-dh-eq").textContent=`${v.B}^${v.a} mod ${v.p} = ${v.A}^${v.b} mod ${v.p} = ${v.shared}`;
  $("mc-dh-log").textContent="Eve has the public transcript, but not either private exponent. Use the attack button to feel why these numbers are toys.";
}
function exchangeDh(){
  const stage=$("mc-stage");stage.classList.remove("flying");void stage.offsetWidth;stage.classList.add("flying");
  $("mc-dh-log").textContent="Public values cross the exposed channel… Alice and Bob independently manufacture the same secret.";
  setTimeout(()=>stage.classList.remove("flying"),1350);
}
function attackDh(){
  if(S.dhTimer)clearInterval(S.dhTimer);const v=dhValues();let guess=0,tries=0;
  $("mc-dh-log").textContent="Eve begins discrete-log search…";
  S.dhTimer=setInterval(()=>{for(let j=0;j<8&&guess<Number(v.p);j++,guess++){tries++;if(modPow(v.g,BigInt(guess),v.p)===v.A){const secret=modPow(v.B,BigInt(guess),v.p);clearInterval(S.dhTimer);S.dhTimer=null;$("mc-dh-log").textContent=`Toy broken after ${tries} guesses: a=${guess}, shared secret=${secret}. Now scale it: this prime has ${v.p.toString(2).length} bits. A real 2048-bit group offers more possibilities than there are atoms in the observable universe — Eve’s honest search would outlast every star.`;return;}}$("mc-dh-log").textContent=`Eve searching… ${tries} candidates tested`;},55);
}

function rsaValues(){const r=RSA_PRESETS[S.rsa],p=BigInt(r.p),q=BigInt(r.q),n=p*q,phi=(p-1n)*(q-1n);let e=17n;for(const candidate of[17n,5n,3n,65537n])if(gcd(candidate,phi)===1n){e=candidate;break;}const d=inverse(e,phi);const max=Number(n-1n);S.message=Math.max(2,Math.min(S.message,Math.min(max,200)));const m=BigInt(S.message),c=modPow(m,e,n),plain=modPow(c,d,n);return{p,q,n,phi,e,d,m,c,plain};}
function renderRsa(){
  const v=rsaValues();$("mc-rsa-size").value=String(S.rsa);$("mc-message").max=String(Math.min(Number(v.n-1n),200));$("mc-message").value=String(S.message);$("mc-message-v").textContent=S.message;
  $("mc-pubkey").textContent=`(n=${v.n}, e=${v.e})`;$("mc-cipher").textContent=String(v.c);$("mc-plain").textContent=String(v.plain);
  $("mc-rsa-eq").textContent=`${v.m}^${v.e} mod ${v.n} = ${v.c}  →  ${v.c}^${v.d} mod ${v.n} = ${v.plain}`;
  $("mc-rsa-log").textContent=`Private key hidden: d. Toy modulus n=${v.n}; deployed RSA moduli are vastly larger and require secure padding.`;
}
function attackRsa(){
  if(S.rsaTimer)clearInterval(S.rsaTimer);const v=rsaValues();let d=2n,tries=0;
  S.rsaTimer=setInterval(()=>{for(let j=0;j<3;j++,d++){tries++;if(v.n%d===0n){const p=d,q=v.n/d,phi=(p-1n)*(q-1n),priv=inverse(v.e,phi);clearInterval(S.rsaTimer);S.rsaTimer=null;$("mc-rsa-log").textContent=`Factored in ${tries} trial divisions: ${v.n}=${p}×${q}. Eve reconstructs d=${priv} and decrypts ${v.c}→${modPow(v.c,priv,v.n)}. For scale: RSA-129 took 600 volunteers 8 months in 1994; a modern 617-digit RSA-2048 modulus has never been factored by anyone.`;return;}if(d*d>v.n){clearInterval(S.rsaTimer);S.rsaTimer=null;return;}}$("mc-rsa-log").textContent=`Eve testing divisors… ${tries} tried`;},65);
}

function updateZk(){
  const odds=S.zkRounds?Math.pow(.5,S.zkRounds):1;
  $("mc-zk-rounds").textContent=S.zkRounds;$("mc-zk-wins").textContent=S.zkWins;$("mc-zk-odds").textContent=S.zkRounds?"1 / "+Math.pow(2,S.zkRounds):"1 / 1";
  $("mc-zk-knows").checked=S.zkKnows;
  $("mc-zk-note").textContent=S.zkRounds?`After ${S.zkRounds} successful independent rounds, an ignorant prover’s survival chance is at most ${(odds*100).toFixed(odds<.001?4:2)}%.`:"Choose whether Peggy knows the door password, then let Victor issue a random challenge.";
}
function zkRound(done){
  if(S.zkBusy)return;S.zkBusy=true;const entry=Math.random()<.5?"A":"B",challenge=Math.random()<.5?"A":"B",success=S.zkKnows||entry===challenge,prover=$("mc-prover");
  prover.className="mc-prover "+(entry==="B"?"at-b":"");
  $("mc-zk-event").textContent=`Peggy entered ${entry}. Victor calls: “come out ${challenge}!”`;
  setTimeout(()=>{if(S.zkKnows&&entry!==challenge)prover.className="mc-prover cross";},220);
  setTimeout(()=>{prover.className="mc-prover "+(challenge==="B"?"at-b":"");S.zkRounds++;if(success)S.zkWins++;else{S.zkRounds=0;S.zkWins=0;}$("mc-zk-event").textContent=success?(S.zkKnows&&entry!==challenge?"Password used: Peggy crossed the hidden door and succeeded.":"Correct exit. The transcript reveals no password."):"Bluff caught. The requested exit was unreachable; confidence resets.";S.zkBusy=false;updateZk();if(done)done();},650);
}
function runTenZk(){let left=10;const next=()=>{if(--left>0)zkRound(next);};zkRound(next);}

function bindChapterTabs(module){module.querySelectorAll("details.it-chapter").forEach((d,i)=>d.querySelectorAll(".it-tab").forEach(btn=>btn.addEventListener("click",()=>{d.querySelectorAll(".it-tab").forEach(b=>b.classList.toggle("on",b===btn));d.querySelector(".it-copy").textContent=CHAPTERS[i][btn.dataset.view];})));}
function bindLabs(module){
  module.querySelectorAll("[data-mclab]").forEach(btn=>btn.addEventListener("click",()=>{module.querySelectorAll("[data-mclab]").forEach(b=>b.classList.toggle("on",b===btn));module.querySelectorAll(".mc-labpane").forEach(p=>p.hidden=p.id!=="mc-"+btn.dataset.mclab);}));
  $("mc-dh-prime").addEventListener("change",e=>{S.dh=+e.target.value;renderDh();});$("mc-a").addEventListener("input",e=>{S.a=+e.target.value;renderDh();});$("mc-b").addEventListener("input",e=>{S.b=+e.target.value;renderDh();});$("mc-exchange").addEventListener("click",exchangeDh);$("mc-attack-dh").addEventListener("click",attackDh);$("mc-random-dh").addEventListener("click",()=>{const m=DH_PRESETS[S.dh].p-2;S.a=2+Math.floor(Math.random()*(m-1));S.b=2+Math.floor(Math.random()*(m-1));renderDh();});
  $("mc-rsa-size").addEventListener("change",e=>{S.rsa=+e.target.value;renderRsa();});$("mc-message").addEventListener("input",e=>{S.message=+e.target.value;renderRsa();});$("mc-attack-rsa").addEventListener("click",attackRsa);
  $("mc-zk-knows").addEventListener("change",e=>{S.zkKnows=e.target.checked;S.zkRounds=0;S.zkWins=0;updateZk();});$("mc-zk-round").addEventListener("click",()=>zkRound());$("mc-zk-ten").addEventListener("click",runTenZk);$("mc-zk-reset").addEventListener("click",()=>{S.zkRounds=0;S.zkWins=0;updateZk();});
}

function buildExperience(){
  ensureStyles();if(S.dhTimer)clearInterval(S.dhTimer);if(S.rsaTimer)clearInterval(S.rsaTimer);
  const body=$("panel-body");if(!body)return;body.querySelectorAll(".topic").forEach(t=>t.remove());
  const module=document.createElement("section");module.className="it-module";module.innerHTML=`
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · ABOUT 25 MIN</div>
    <p class="it-hook">How can two strangers make the same secret in public?</p>
    <p class="it-intro">Modern cryptography turns trust into an engineered system: public locks, private trapdoors, proofs that reveal no secret, and new mathematics designed for a quantum future.</p>
    <div class="it-timeline"><div class="it-moment"><b>1976</b><span>Diffie–Hellman</span></div><div class="it-moment"><b>1978</b><span>RSA</span></div><div class="it-moment"><b>1985</b><span>Zero knowledge</span></div><div class="it-moment"><b>1994</b><span>Shor</span></div><div class="it-moment"><b>2024</b><span>NIST PQC</span></div></div>
    <section class="it-lab"><div class="it-kicker">PLAYABLE PUBLIC-KEY ARENA</div><h3>Make a secret. Then attack it.</h3><p class="it-lab-intro">The arithmetic is real; the numbers are intentionally tiny enough to break in your browser. Scale—not magic—separates the lesson from a secure deployment.</p>
      <div class="it-tabs"><button class="it-tab on" data-mclab="dh">DIFFIE–HELLMAN</button><button class="it-tab" data-mclab="rsa">RSA LOCKSMITH</button></div>
      <div class="mc-labpane" id="mc-dh">
        <div class="it-control"><label>public group <select id="mc-dh-prime">${DH_PRESETS.map((x,i)=>`<option value="${i}">${x.label}</option>`).join("")}</select></label></div>
        <div class="it-control"><label for="mc-a"><span>Alice’s private exponent a</span><output id="mc-av"></output></label><input id="mc-a" type="range" min="2" value="6"></div>
        <div class="it-control"><label for="mc-b"><span>Bob’s private exponent b</span><output id="mc-bv"></output></label><input id="mc-b" type="range" min="2" value="15"></div>
        <div class="mc-stage" id="mc-stage"><span class="mc-packet mc-a"></span><span class="mc-packet mc-b"></span><div class="mc-party"><b>ALICE</b><small id="mc-A"></small><span class="mc-value" id="mc-shared-a"></span></div><div class="mc-eve"><b>EVE</b><small>sees every public value</small><span class="mc-value" id="mc-public"></span></div><div class="mc-party"><b>BOB</b><small id="mc-B"></small><span class="mc-value" id="mc-shared-b"></span></div></div>
        <div class="mc-equation" id="mc-dh-eq"></div><div class="mc-log" id="mc-dh-log"></div><div class="it-lab-actions"><button class="it-send" id="mc-exchange">animate exchange</button><button class="it-send" id="mc-random-dh">roll new secrets</button><button class="it-send" id="mc-attack-dh">let Eve brute-force</button></div>
      </div>
      <div class="mc-labpane" id="mc-rsa" hidden>
        <div class="it-control"><label>toy key size <select id="mc-rsa-size"><option value="0">n = 187 · visible</option><option value="1">n = 2773 · classroom</option><option value="2">n = 11413 · challenge</option></select></label></div>
        <div class="it-control"><label for="mc-message"><span>message as a number</span><output id="mc-message-v"></output></label><input id="mc-message" type="range" min="2" value="42"></div>
        <div class="mc-lockrow"><div class="mc-lock"><span>🔓</span><small>PUBLIC KEY</small><b id="mc-pubkey"></b></div><div class="mc-lock"><span>📦</span><small>CIPHERTEXT</small><b id="mc-cipher"></b></div><div class="mc-lock"><span>🔐</span><small>DECRYPTED</small><b id="mc-plain"></b></div></div>
        <div class="mc-equation" id="mc-rsa-eq"></div><div class="mc-log" id="mc-rsa-log"></div><div class="it-lab-actions"><button class="it-send" id="mc-attack-rsa">factor n as Eve</button></div><p class="it-caveat">This is textbook RSA for learning. Never copy it into a real application: secure RSA requires approved key generation, padding and side-channel-resistant libraries.</p>
      </div>
    </section>
    <section class="it-lab"><div class="it-kicker">ZERO-KNOWLEDGE BLUFF CHALLENGE</div><h3>Prove you know the door—without saying the password</h3><p class="it-lab-intro">Peggy enters tunnel A or B before Victor names the exit. Knowing the secret door always works; bluffing works only when the guess matches the challenge.</p>
      <label class="it-check"><input id="mc-zk-knows" type="checkbox"> Peggy knows the secret door password</label>
      <div class="mc-cave"><span class="mc-mouth a">TUNNEL A</span><span class="mc-mouth b">TUNNEL B</span><span class="mc-door">?</span><span class="mc-prover" id="mc-prover"></span></div><p class="mc-log" id="mc-zk-event">Victor is waiting outside the cave.</p>
      <div class="mc-zkstats"><div class="it-metric"><small>ROUNDS</small><b id="mc-zk-rounds"></b></div><div class="it-metric"><small>SUCCESSES</small><b id="mc-zk-wins"></b></div><div class="it-metric"><small>BLUFF ODDS</small><b id="mc-zk-odds"></b></div></div><p class="it-result" id="mc-zk-note"></p>
      <div class="it-lab-actions"><button class="it-send" id="mc-zk-round">run one round</button><button class="it-send" id="mc-zk-ten">run 10 rounds</button><button class="it-send" id="mc-zk-reset">reset evidence</button></div><p class="it-caveat">This cave is an intuition pump, not a production protocol. Real zero-knowledge proofs replace tunnels and doors with precisely specified algebra and security assumptions.</p>
    </section>
    <h3 class="it-section-title">Open a concept</h3>${CHAPTERS.map(chapterMarkup).join("")}
    <div class="it-challenges"><b>Four missions</b><ol><li>Roll new Diffie–Hellman secrets three times. Verify that Alice and Bob always derive the same value although neither sends it.</li><li>Let Eve break each toy group. Explain why increasing a number is useful only when the underlying problem and parameters are sound.</li><li>Factor each RSA modulus, then name the missing ingredient that makes textbook RSA unsafe even with a huge key: secure padding.</li><li>Turn off Peggy’s password and survive ten cave rounds. If you manage it, calculate how unlikely that streak was.</li></ol></div>
    <h3 class="it-section-title">Landmark papers & living standards</h3>${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);bindChapterTabs(module);bindLabs(module);renderDh();renderRsa();updateZk();
}

window.openModernCryptoExperience=buildExperience;
window.__modernCryptoTest={modPow,inverse,gcd,dhValues,rsaValues};
})();
