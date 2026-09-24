/* ============================================================
   THE WEB OF COMPUTATION — avatars.js
   One illustrated avatar per pioneer, all drawn in the same flat
   style from a few traits, so the set reads as one family:

     skin   1–5            hair   style + colour
     beard  stubble | beard | goatee | mustache | sideburns
     specs  round | rect   outfit suit | sweater | tee | shirt |
                                  victorian | gown | navy | leather

   Avatars are original drawings (no photos), so they are safe to
   publish. A licensed photo in portraits/credits.js takes over
   automatically when one is added.

   API: AVATAR.svg(person, hue) → an <svg> string (viewBox 0 0 100 100)
   ============================================================ */
(function () {
"use strict";

const SKIN = { 1:["#f3d5c0","#d9b29a"], 2:["#ecc9a4","#cfa47e"], 3:["#d6a784","#b5845f"], 4:["#ae7a55","#8d5d3d"], 5:["#7b4b31","#5e3521"] };
const HAIR = { black:"#1c181d", dark:"#3b2a21", brown:"#6d4a2f", auburn:"#8a4a2b", blond:"#c7a466", grey:"#9d9aa3", white:"#e7e3ea" };
const OUT  = { suit:"#2a3350", sweater:"#4b5f7a", tee:"#3f4a57", shirt:"#e8e6ee", victorian:"#1f1c26", gown:"#3a2346", navy:"#1c2440", leather:"#141216" };

// traits: [skin, hairStyle, hairColour, beard, specs, outfit]
const T = {
  babbage:[1,"receding","grey","sideburns","","victorian"], lovelace:[1,"ringlets","dark","","","gown"],
  boole:[1,"side","dark","sideburns","","victorian"], godel:[1,"swept","dark","","round","suit"],
  turing:[1,"side","dark","","","suit"], shannon:[1,"wavy","brown","","","suit"],
  mcculloch:[1,"receding","white","beard","","suit"], pitts:[1,"side","dark","","round","suit"],
  vonneumann:[1,"receding","dark","","","suit"], wiener:[1,"receding","grey","goatee","round","suit"],
  hopper:[1,"bob","grey","","","navy"], bellman:[1,"receding","dark","","rect","suit"],
  mccarthy:[1,"receding","grey","beard","rect","sweater"], minsky:[1,"bald","grey","","rect","sweater"],
  newell:[1,"side","dark","","rect","suit"], simon:[1,"side","grey","","rect","suit"],
  rosenblatt:[1,"side","dark","","","suit"], samuel:[1,"bald","grey","","round","suit"],
  ivakhnenko:[1,"swept","grey","","","suit"], amari:[2,"side","grey","","rect","suit"],
  dijkstra:[1,"receding","grey","beard","round","sweater"], knuth:[1,"bald","grey","","rect","sweater"],
  codd:[1,"receding","grey","","rect","suit"], ritchie:[1,"wavy","dark","beard","","sweater"],
  sparckjones:[1,"bob","grey","","","sweater"], vapnik:[1,"receding","white","","","suit"],
  diffie:[1,"long","white","beard","","suit"], hellman:[1,"receding","grey","beard","","suit"],
  reddy:[4,"receding","grey","mustache","rect","suit"], fukushima:[2,"receding","grey","","rect","suit"],
  hopfield:[1,"receding","white","","","suit"], pearl:[1,"receding","grey","beard","rect","sweater"],
  rumelhart:[1,"side","brown","beard","round","sweater"], hinton:[1,"receding","grey","","","sweater"],
  sutton:[1,"long","grey","beard","","sweater"], barto:[1,"receding","grey","beard","rect","sweater"],
  lecun:[1,"short","grey","","rect","suit"], schmidhuber:[1,"crop","grey","","","suit"],
  hochreiter:[1,"crop","dark","","","suit"], breiman:[1,"bald","grey","beard","rect","sweater"],
  bengio:[1,"curly","grey","","","sweater"], koller:[1,"long","brown","","","sweater"],
  feifeili:[2,"long","black","","","shirt"], ng:[2,"side","black","","","sweater"],
  huang:[2,"swept","dark","","","leather"], dean:[1,"crop","dark","","","sweater"],
  krizhevsky:[1,"short","dark","","","tee"], sutskever:[1,"receding","dark","","","tee"],
  hassabis:[3,"bald","dark","stubble","rect","sweater"], silver:[1,"short","brown","","","sweater"],
  jumper:[1,"short","brown","stubble","","shirt"], goodfellow:[1,"short","dark","stubble","","tee"],
  kingma:[1,"short","blond","","","tee"], vinyals:[1,"short","dark","stubble","","tee"],
  kaiminghe:[2,"short","black","","rect","shirt"], abbeel:[1,"short","blond","","","shirt"],
  vaswani:[4,"short","black","beard","","shirt"], shazeer:[1,"receding","dark","beard","","shirt"],
  radford:[1,"short","brown","","","tee"], karpathy:[1,"short","dark","","","tee"],
  olah:[1,"short","brown","","","tee"], amodei:[1,"curly","dark","","round","shirt"],
  altman:[1,"short","brown","","","sweater"], gebru:[5,"curly","black","","","sweater"],
  buolamwini:[5,"long","black","","","shirt"]
};

/* ---------- parts ---------- */
const HEAD = "M33 44 Q33 25 50 24 Q67 25 67 44 Q67 58 58 63 Q50 67 42 63 Q33 58 33 44Z";

function hairBack(style, c) {
  switch (style) {
    case "long": return `<path d="M31 42 Q29 17 50 17 Q71 17 69 42 L71 78 Q65 82 61 76 L61 50 L39 50 L39 76 Q35 82 29 78Z" fill="${c}"/>`;
    case "bob": return `<path d="M31 44 Q29 19 50 18 Q71 19 69 44 L70 58 Q65 63 62 57 L62 42 L38 42 L38 57 Q35 63 30 58Z" fill="${c}"/>`;
    case "ringlets": return `<path d="M31 42 Q29 18 50 18 Q71 18 69 42 L66 52 L34 52Z" fill="${c}"/>` +
      [[31,50],[30,57],[32,64],[69,50],[70,57],[68,64]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="4.3" fill="${c}"/>`).join("");
    default: return "";
  }
}
function hairFront(style, c) {
  switch (style) {
    case "short":    return `<path d="M33 42 Q31 21 50 20 Q69 21 67 42 Q65 31 58 29 Q50 32 42 29 Q35 31 33 42Z" fill="${c}"/>`;
    case "side":     return `<path d="M33 43 Q30 21 50 19.5 Q70 21 67 42 Q66 31 60 28.5 Q48 34 37 30.5 Q34 36 33 43Z" fill="${c}"/>`;
    case "crop":     return `<path d="M34 38 Q35 23 50 22.5 Q65 23 66 38 Q60 28.5 50 28.5 Q40 28.5 34 38Z" fill="${c}"/>`;
    case "swept":    return `<path d="M33 41 Q31 19 51 18.5 Q70 20.5 67 41 Q64 27 50 26.5 Q39 27 33 41Z" fill="${c}"/>`;
    case "wavy":     return `<path d="M32 44 Q29 21 50 18.5 Q71 20 68 44 Q66 33 62 30 Q58 34 52 30 Q46 34 40 30 Q35 33 32 44Z" fill="${c}"/>`;
    case "long":     return `<path d="M33 44 Q31 21 50 20.5 Q69 21 67 44 Q63 30 50 29 Q41 30 33 44Z" fill="${c}"/>`;
    case "bob":      return `<path d="M33 43 Q31 21 50 20.5 Q69 21 67 43 Q60 29 47 31 Q39 33 33 43Z" fill="${c}"/>`;
    case "ringlets": return `<path d="M33 44 Q31 20 50 20 Q69 20 67 44 Q63 29 51 28 L50 31 L49 28 Q37 29 33 44Z" fill="${c}"/>`;
    case "receding": return `<path d="M33 45 Q32 34 37.5 29.5 Q36 38 36.5 46Z M67 45 Q68 34 62.5 29.5 Q64 38 63.5 46Z" fill="${c}"/>`;
    case "curly": {
      let s = "";
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * (1.02 + i * 0.096);
        s += `<circle cx="${(50 + 18.5 * Math.cos(a)).toFixed(1)}" cy="${(40 + 19 * Math.sin(a)).toFixed(1)}" r="5.6" fill="${c}"/>`;
      }
      return s + `<path d="M34 38 Q36 25 50 24 Q64 25 66 38 Q58 30 50 30.5 Q42 30 34 38Z" fill="${c}"/>`;
    }
    case "bald": return `<path d="M41 28.5 Q46 26 52 26.5" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    default: return "";
  }
}
function facial(kind, c) {
  switch (kind) {
    case "stubble":  return `<path d="M34 48 Q35 64 50 66.5 Q65 64 66 48 Q63 60 50 61.5 Q37 60 34 48Z" fill="${c}" opacity=".38"/>`;
    case "beard":    return `<path d="M33 46 Q33 71 50 73 Q67 71 67 46 Q64 57 57 58.5 Q50 60.5 43 58.5 Q36 57 33 46Z" fill="${c}"/>` +
                            `<path d="M44 54.2 Q50 52 56 54.2 Q50 55.8 44 54.2Z" fill="${c}"/>`;
    case "goatee":   return `<path d="M45.5 58.6 Q50 67 54.5 58.6 Q50 60.6 45.5 58.6Z M44.5 54.4 Q50 52.4 55.5 54.4 Q50 55.8 44.5 54.4Z" fill="${c}"/>`;
    case "mustache": return `<path d="M43.5 54.6 Q50 51.8 56.5 54.6 Q50 56.4 43.5 54.6Z" fill="${c}"/>`;
    case "sideburns":return `<path d="M33.2 40 L36.5 40 L37 55 Q34.5 54 33.5 50Z M66.8 40 L63.5 40 L63 55 Q65.5 54 66.5 50Z" fill="${c}"/>`;
    default: return "";
  }
}
function glasses(kind) {
  const st = `stroke="#16131c" stroke-width="1.5" fill="rgba(255,255,255,.12)"`;
  if (kind === "round") return `<circle cx="43.5" cy="45" r="4.9" ${st}/><circle cx="56.5" cy="45" r="4.9" ${st}/><path d="M48.4 45 Q50 43.6 51.6 45" stroke="#16131c" stroke-width="1.3" fill="none"/>`;
  if (kind === "rect")  return `<rect x="37.6" y="41.2" width="11" height="7.6" rx="2.2" ${st}/><rect x="51.4" y="41.2" width="11" height="7.6" rx="2.2" ${st}/><path d="M48.6 44.6 L51.4 44.6" stroke="#16131c" stroke-width="1.3"/>`;
  return "";
}
function outfit(kind, skinShade) {
  const base = OUT[kind] || OUT.sweater;
  const body = `<path d="M13 101 C15 79 30 70.5 50 70.5 C70 70.5 85 79 87 101Z" fill="${base}"/>`;
  switch (kind) {
    case "suit": return body + `<path d="M43 71 L50 86 L57 71Z" fill="#f1eef6"/><path d="M48.8 74 L51.2 74 L52.6 87 L50 91 L47.4 87Z" fill="#8a2f3c"/>` +
      `<path d="M43 71 L50 86 M57 71 L50 86" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`;
    case "sweater": return body + `<path d="M40 71.5 Q50 80 60 71.5" stroke="rgba(0,0,0,.28)" stroke-width="2.4" fill="none"/>`;
    case "tee": return body + `<path d="M41 71.2 Q50 78 59 71.2" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>`;
    case "shirt": return body + `<path d="M42 71 L47 79 L50 74 L53 79 L58 71" stroke="#bdb8c9" stroke-width="1.4" fill="none"/><path d="M50 74 L50 100" stroke="#cfcadb" stroke-width="1"/>`;
    case "victorian": return body + `<path d="M42 69 L50 82 L58 69Z" fill="#f4f0f7"/><path d="M45 75 Q50 72 55 75 Q50 79 45 75Z" fill="#2c2433"/>`;
    case "gown": return body + `<path d="M36 74 Q50 88 64 74" stroke="#efe7f2" stroke-width="2.4" fill="none" stroke-dasharray="2.2 1.6"/>`;
    case "navy": return body + `<path d="M43 71 L50 85 L57 71Z" fill="#f1eef6"/><path d="M20 90 L32 86 M68 86 L80 90" stroke="#e2b84a" stroke-width="2.2"/>`;
    case "leather": return body + `<path d="M43 71 L50 88 L57 71Z" fill="#2a2830"/><path d="M43 71 L38 84 L50 90 M57 71 L62 84 L50 90" stroke="#3a3742" stroke-width="1.6" fill="none"/>`;
    default: return body;
  }
}

function svg(p, hue) {
  const t = T[p.id] || [1, "short", "dark", "", "", "sweater"];
  const [sk, hs, hc, beard, specs, out] = t;
  const [skin, shade] = SKIN[sk] || SKIN[1];
  const hcol = HAIR[hc] || HAIR.dark;
  const h = hue == null ? 45 : hue;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated portrait of ${p.name.replace(/"/g, "")}">` +
    `<circle cx="50" cy="50" r="50" fill="hsl(${h} 42% 24%)"/>` +
    `<circle cx="50" cy="50" r="41" fill="hsl(${h} 46% 32%)"/>` +
    hairBack(hs, hcol) +
    outfit(out, shade) +
    `<rect x="43.5" y="58" width="13" height="15" rx="5" fill="${shade}"/>` +
    `<ellipse cx="33" cy="46.5" rx="2.6" ry="4" fill="${shade}"/><ellipse cx="67" cy="46.5" rx="2.6" ry="4" fill="${shade}"/>` +
    `<path d="${HEAD}" fill="${skin}"/>` +
    facial(beard, hcol) +
    `<path d="M39.8 40.4 Q43.5 38.6 47 40.2 M53 40.2 Q56.5 38.6 60.2 40.4" stroke="${hc === "white" ? "#b9b4bf" : hcol}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="43.5" cy="45.3" rx="1.55" ry="1.75" fill="#241a19"/><ellipse cx="56.5" cy="45.3" rx="1.55" ry="1.75" fill="#241a19"/>` +
    `<path d="M50 46 Q48.3 51 50.6 52" stroke="${shade}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<path d="M45.3 56.6 Q50 59.6 54.7 56.6" stroke="${beard === "beard" ? "#e9d4cc" : "#8b4a3f"}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    hairFront(hs, hcol) +
    glasses(specs) +
    `</svg>`;
}

window.AVATAR = { svg, traits:T };
})();
