/* ============================================================
   THE WEB OF COMPUTATION — crack.js
   Domains crack open into their fields; fields crack open into
   their topics. Five styles:
     A walnut · B glass · C peel · D iris · E nova
   In "mix" mode each domain (and each field) uses a different
   style so all five can be compared live. A picker in the
   bottom-left toggles forces one style everywhere.

   Hooks (called from app.js):
     WOC_CRACK.domain(d)     after zoomTo(d)
     WOC_CRACK.field(f, d)   when a field is opened
     WOC_CRACK.back()        back button; true if it handled it
     WOC_CRACK.reset()       leaving the zoomed view
   ============================================================ */
(function () {
"use strict";

const NS = "http://www.w3.org/2000/svg";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const map = document.getElementById("map");
const STATUS_COL = { found:"#dfe9ff", work:"#3fd0c9", fire:"#ff7847", obs:"#9a9ab4", rev:"#57e08a" };
const STATUS_HUE = { found:215, work:178, fire:18, obs:250, rev:140 };

/* ---------- helpers ---------- */
function mk(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
};
const deg = r => r * 180 / Math.PI;
const f1 = n => Math.round(n * 100) / 100;
const pt = p => f1(p[0]) + "," + f1(p[1]);
const sp = p => f1(p[0]) + " " + f1(p[1]);
const polar = (r, a, cx, cy) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
function about(cx, cy, { dx = 0, dy = 0, rot = 0, sx = 1, sy = sx } = {}) {
  return `translate(${f1(dx)} ${f1(dy)}) translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${f1(-cx)} ${f1(-cy)})`;
}
function rngOf(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function wrap(name, max) {
  const lines = [""];
  for (const w of name.split(" ")) {
    const cur = lines[lines.length - 1];
    if (cur && (cur + " " + w).length > max) lines.push(w); else lines[lines.length - 1] = cur ? cur + " " + w : w;
  }
  if (lines.length > 2) { let l2 = lines.slice(1).join(" "); if (l2.length > max + 3) l2 = l2.slice(0, max + 1).trim() + "…"; return [lines[0], l2]; }
  return lines;
}

/* ---------- the five styles ---------- */
const STYLES = {
walnut: { tag:"A", name:"Walnut crack",
  play(st) {
    const { cx:CX, cy:CY, R, k, N, rng } = st, P = (r, a) => polar(r, a, CX, CY);
    const span = 2 * Math.PI / N, O = [CX + R * .1, CY - R * .12];
    const jag = st.ang.map(a => {
      const b = a - span / 2, Pb = P(R, b), pts = [], K = 7, nx = -Math.sin(b), ny = Math.cos(b);
      for (let q = 1; q < K; q++) { const f = q / K, j = (rng() - .5) * 16 * k * Math.sin(f * Math.PI); pts.push([lerp(O[0], Pb[0], f) + nx * j, lerp(O[1], Pb[1], f) + ny * j]); }
      return { P: Pb, pts };
    });
    const overlay = mk("circle", { cx:CX, cy:CY, r:R, fill:st.u("shell"), filter:st.u("tex"), opacity:0 }, st.Lfx1);
    const large = span > Math.PI ? 1 : 0;
    const pieces = st.ang.map((a, i) => {
      const A = jag[i], B = jag[(i + 1) % N];
      const d = `M${pt(O)} ${A.pts.map(p => "L" + pt(p)).join(" ")} L${pt(A.P)} A${f1(R)} ${f1(R)} 0 ${large} 1 ${pt(B.P)} ${B.pts.slice().reverse().map(p => "L" + pt(p)).join(" ")} Z`;
      const g = mk("g", { opacity:0 }, st.Lfx1);
      mk("path", { d, fill:st.u("shell"), filter:st.u("tex"), stroke:"rgba(20,10,5,.6)", "stroke-width":f1(k) }, g);
      const rim = mk("path", { d, fill:"none", stroke:"#ffe3a0", "stroke-width":f1(2.2 * k), "stroke-linejoin":"round", filter:st.u("glow"), opacity:0 }, g);
      return { g, rim, c:P(R * .5, a), dir:[Math.cos(a), Math.sin(a)], rot:(rng() < .5 ? -1 : 1) * (14 + rng() * 16), dist:(56 + rng() * 18) * k };
    });
    const cracks = jag.map(J => {
      const p = mk("path", { d:`M${pt(O)} ${J.pts.map(q => "L" + pt(q)).join(" ")} L${pt(J.P)}`, fill:"none", stroke:"#fff1c9", "stroke-width":f1(2.2 * k), "stroke-linecap":"round", "stroke-linejoin":"round", filter:st.u("glow") }, st.Lfx1);
      const len = p.getTotalLength(); p.setAttribute("stroke-dasharray", len); p.setAttribute("stroke-dashoffset", len);
      return { p, len };
    });
    const I = P(R * .98, -1.05);
    const spark = mk("circle", { cx:I[0], cy:I[1], r:3 * k, fill:"#fff", opacity:0, filter:st.u("glow") }, st.Lfx2);
    return st.run(2150 + 70 * N, ms => {
      const h = seg(ms, 0, 260);
      overlay.setAttribute("opacity", ms >= 900 ? 0 : h);
      st.sphere.setAttribute("opacity", ms >= 260 ? 0 : 1);
      st.halo.setAttribute("opacity", 1 - .6 * h - .4 * seg(ms, 900, 1400));
      const s = seg(ms, 200, 520);
      spark.setAttribute("r", f1((3 + 22 * E.out(s)) * k)); spark.setAttribute("opacity", s > 0 ? 1 - s : 0);
      cracks.forEach((c, q) => {
        c.p.setAttribute("stroke-dashoffset", f1(c.len * (1 - E.out(seg(ms, 260 + q * 45, 620 + q * 45)))));
        c.p.setAttribute("opacity", 1 - seg(ms, 900, 1100));
      });
      const w = seg(ms, 640, 900);
      st.Lfx1.setAttribute("transform", w > 0 && w < 1 ? `translate(${f1(Math.sin(w * Math.PI * 7) * 3.4 * k * (1 - w))} 0)` : "");
      const spl = seg(ms, 900, 1600), drift = seg(ms, 1550, 2100);
      pieces.forEach(Q => {
        Q.g.setAttribute("opacity", ms >= 900 ? 1 - drift : 0);
        const d = Q.dist * E.back(spl) + 30 * k * drift;
        Q.g.setAttribute("transform", about(Q.c[0], Q.c[1], { dx:Q.dir[0] * d, dy:Q.dir[1] * d, rot:Q.rot * E.out(spl), sx:1 - .1 * spl }));
        Q.rim.setAttribute("opacity", seg(ms, 900, 1000) * (1 - seg(ms, 1300, 1700)));
      });
      st.setKernel(lerp(R * .72, st.kr, E.io(seg(ms, 1250, 1900))), seg(ms, 820, 960));
      st.nodes.forEach((n, i) => {
        const p = seg(ms, 1200 + i * 70, 1700 + i * 70), e = E.back(p);
        st.setNode(i, lerp(CX, n.tx, e), lerp(CY, n.ty, e), clamp(p * 2.5), .6 + .4 * p);
        st.setSpoke(i, p);
      });
    });
  }},

glass: { tag:"B", name:"Glass shatter",
  play(st) {
    const { cx:CX, cy:CY, R, k, N, rng } = st, P = (r, a) => polar(r, a, CX, CY);
    const seeds = st.ang.map(a => ({ p:P(R * .5, a + (rng() - .5) * .25), main:true }));
    for (let q = 0; q < 10; q++) seeds.push({ p:P(R * (.72 + rng() * .25), rng() * Math.PI * 2), main:false });
    const disk = []; for (let q = 0; q < 72; q++) disk.push(P(R, q / 72 * Math.PI * 2));
    const clipHalf = (poly, m, n) => {
      const out = [];
      for (let q = 0; q < poly.length; q++) {
        const A = poly[q], B = poly[(q + 1) % poly.length];
        const da = (A[0] - m[0]) * n[0] + (A[1] - m[1]) * n[1], db = (B[0] - m[0]) * n[0] + (B[1] - m[1]) * n[1];
        if (da <= 0) out.push(A);
        if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); out.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); }
      }
      return out;
    };
    const grp = mk("g", {}, st.Lfx1);
    let mi = 0;
    const cells = seeds.map(s => {
      let poly = disk;
      for (const q of seeds) if (q !== s) poly = clipHalf(poly, [(s.p[0] + q.p[0]) / 2, (s.p[1] + q.p[1]) / 2], [q.p[0] - s.p[0], q.p[1] - s.p[1]]);
      const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]);
      const path = mk("path", { d:"M" + poly.map(pt).join(" L") + " Z", fill:st.u("orbU"), stroke:"#fff", "stroke-width":f1(1.1 * k), "stroke-opacity":0, "stroke-linejoin":"round" }, grp);
      const dx = c[0] - CX, dy = c[1] - CY, L = Math.hypot(dx, dy) || 1;
      return { path, c, main:s.main, i:s.main ? mi++ : -1, dir:[dx / L, dy / L], dist:(150 + rng() * 120) * k, rot:(rng() < .5 ? -1 : 1) * (90 + rng() * 140), wob:(rng() < .5 ? -1 : 1) * (25 + rng() * 25) };
    });
    const flash = mk("circle", { cx:CX, cy:CY, r:6 * k, fill:"#fff", opacity:0, filter:st.u("glow") }, st.Lfx2);
    return st.run(1500 + 45 * N, ms => {
      st.sphere.setAttribute("opacity", 0);
      st.halo.setAttribute("opacity", 1 - seg(ms, 0, 500));
      const f = seg(ms, 0, 380);
      flash.setAttribute("r", f1((6 + 70 * E.out(f)) * k)); flash.setAttribute("opacity", .95 * (1 - f));
      grp.setAttribute("transform", about(CX, CY, { sx:1 + .03 * Math.sin(seg(ms, 190, 380) * Math.PI) }));
      const so = .85 * seg(ms, 30, 190);
      cells.forEach(C => {
        C.path.setAttribute("stroke-opacity", so);
        if (!C.main) {
          const q = seg(ms, 380, 1250), e = E.out(q);
          C.path.setAttribute("transform", about(C.c[0], C.c[1], { dx:C.dir[0] * C.dist * e, dy:C.dir[1] * C.dist * e, rot:C.rot * e, sx:1 - .3 * q }));
          C.path.setAttribute("opacity", 1 - seg(ms, 700, 1250));
        } else {
          const n = st.nodes[C.i], p = seg(ms, 380 + 45 * C.i, 1350 + 45 * C.i), e = E.io(p);
          C.path.setAttribute("transform", about(C.c[0], C.c[1], { dx:(n.tx - C.c[0]) * e, dy:(n.ty - C.c[1]) * e, rot:C.wob * Math.sin(p * Math.PI), sx:1 - .88 * E.in(p) }));
          C.path.setAttribute("opacity", 1 - seg(p, .72, 1));
          const q = seg(p, .68, 1);
          st.setNode(C.i, n.tx, n.ty, q, .5 + .5 * E.back(q));
          st.setSpoke(C.i, q);
        }
      });
      st.setKernel(st.kr, seg(ms, 800, 1300));
    });
  }},

peel: { tag:"C", name:"Peel & bloom",
  play(st) {
    const { cx:CX, cy:CY, R, k, N } = st, P = (r, a) => polar(r, a, CX, CY);
    const span = 2 * Math.PI / N, large = span > Math.PI ? 1 : 0;
    const petals = st.ang.map(a => {
      const P0 = P(R, a - span / 2), P1 = P(R, a + span / 2), H = P(R, a);
      const path = mk("path", { d:`M${f1(CX)},${f1(CY)} L${pt(P0)} A${f1(R)} ${f1(R)} 0 ${large} 1 ${pt(P1)} Z`, fill:st.u("orbU"), stroke:"rgba(255,255,255,.22)", "stroke-width":f1(k) }, st.Lfx1);
      return { path, H, a, inner:false };
    });
    const seams = st.ang.map(a => {
      const Q = P(R, a - span / 2);
      return mk("line", { x1:CX, y1:CY, x2:f1(Q[0]), y2:f1(Q[1]), stroke:"#ffe3a0", "stroke-width":f1(2 * k), filter:st.u("glow"), "stroke-dasharray":f1(R), "stroke-dashoffset":f1(R) }, st.Lfx1);
    });
    return st.run(1950 + 60 * N, ms => {
      st.sphere.setAttribute("opacity", 0);
      st.halo.setAttribute("opacity", 1 - seg(ms, 200, 700));
      const q = seg(ms, 0, 380);
      seams.forEach(s => { s.setAttribute("stroke-dashoffset", f1(R * (1 - E.out(q)))); s.setAttribute("opacity", 1 - seg(ms, 500, 800)); });
      petals.forEach((Q, i) => {
        const p = seg(ms, 350 + 60 * i, 1250 + 60 * i), th = Math.PI * E.io(p), c = Math.cos(th);
        const rec = seg(ms, 1300 + 60 * i, 1900 + 60 * i);
        const sx = c * (1 - .45 * E.io(rec)), lift = 1 + .12 * Math.sin(th), A = deg(Q.a);
        Q.path.setAttribute("transform", `translate(${sp(Q.H)}) rotate(${f1(A)}) scale(${sx.toFixed(3)} ${lift.toFixed(3)}) rotate(${f1(-A)}) translate(${f1(-Q.H[0])} ${f1(-Q.H[1])})`);
        Q.path.setAttribute("opacity", 1 - rec);
        const inner = c < 0;
        if (inner !== Q.inner) { Q.inner = inner; Q.path.setAttribute("fill", st.u(inner ? "inner" : "orbU")); }
      });
      st.setKernel(lerp(R * .78, st.kr, E.io(seg(ms, 1100, 1800))), seg(ms, 380, 700));
      st.nodes.forEach((n, i) => {
        const p = seg(ms, 1000 + 60 * i, 1550 + 60 * i), e = E.out(p), H = petals[i].H;
        st.setNode(i, lerp(H[0], n.tx, e), lerp(H[1], n.ty, e), clamp(p * 2), .7 + .3 * p);
        st.setSpoke(i, p);
      });
    });
  }},

iris: { tag:"D", name:"Aperture iris",
  play(st) {
    const { cx:CX, cy:CY, R, k, N } = st, P = (r, a) => polar(r, a, CX, CY);
    const span = 2 * Math.PI / N, ov = Math.min(.55, span * .35);
    const chamber = mk("circle", { cx:CX, cy:CY, r:R, fill:st.u("chamber"), opacity:0 }, st.Lfx0);
    const clipG = mk("g", { "clip-path":st.u("clip") }, st.Lfx1);
    const blades = st.ang.map(a => {
      const s0 = a - span / 2 - ov, e = a + span / 2, Ps = P(R, s0), Pe = P(R, e), ctrl = P(R * .62, s0 + (e - s0) * .28);
      const path = mk("path", { d:`M${f1(CX)},${f1(CY)} Q${pt(ctrl)} ${pt(Ps)} A${f1(R)} ${f1(R)} 0 ${(e - s0) > Math.PI ? 1 : 0} 1 ${pt(Pe)} Z`, fill:st.u("orbU"), stroke:"#fff", "stroke-width":f1(1.2 * k), "stroke-opacity":0, "stroke-linejoin":"round" }, clipG);
      return { path, Pe };
    });
    const rim = mk("circle", { cx:CX, cy:CY, r:R, fill:"none", stroke:"#f5c451", "stroke-width":f1(2.5 * k), opacity:0, filter:st.u("glow") }, st.Lfx1);
    return st.run(1600 + 50 * N, ms => {
      st.sphere.setAttribute("opacity", 0);
      st.halo.setAttribute("opacity", 1 - .7 * seg(ms, 0, 600));
      const phi = 100 * E.io(seg(ms, 250, 1000));
      blades.forEach(B => {
        B.path.setAttribute("stroke-opacity", .6 * seg(ms, 0, 250));
        B.path.setAttribute("transform", `rotate(${f1(phi)} ${sp(B.Pe)})`);
        B.path.setAttribute("opacity", 1 - seg(ms, 850, 1050));
      });
      chamber.setAttribute("opacity", seg(ms, 200, 300) * (1 - seg(ms, 1100, 1500)));
      const ex = seg(ms, 1050, 1450);
      rim.setAttribute("opacity", seg(ms, 150, 350) * (1 - ex));
      rim.setAttribute("r", f1(R * (1 + .25 * E.out(ex))));
      st.setKernel(st.kr, seg(ms, 300, 700));
      st.nodes.forEach((n, i) => {
        const inner = P(R * .58, st.ang[i]), p = seg(ms, 1000 + 50 * i, 1500 + 50 * i), e = E.back(p);
        st.setNode(i, lerp(inner[0], n.tx, e), lerp(inner[1], n.ty, e), seg(ms, 600, 900), .65 + .35 * p);
        st.setSpoke(i, p);
      });
    });
  }},

nova: { tag:"E", name:"Supernova",
  play(st) {
    const { cx:CX, cy:CY, R, k, N, rng } = st;
    const white = mk("circle", { cx:CX, cy:CY, r:R * .55, fill:"#fff", opacity:0, filter:st.u("glow") }, st.Lfx1);
    const flash = mk("circle", { cx:CX, cy:CY, r:R * .5, fill:"#fff", opacity:0 }, st.Lfx2);
    const ring = mk("circle", { cx:CX, cy:CY, r:R * .4, fill:"none", stroke:st.hueCol(80, 75), "stroke-width":f1(3.5 * k), opacity:0 }, st.Lfx2);
    const cols = ["#fff", st.hueCol(90, 78), st.hueCol(85, 66), "#ffe3a0"];
    const parts = [];
    for (let q = 0; q < 170; q++) {
      const a = rng() * Math.PI * 2, j = polar(rng() * 12 * k, rng() * Math.PI * 2, 0, 0), sz = (.8 + rng() * 1.8) * k;
      parts.push({ c:mk("circle", { cx:CX, cy:CY, r:sz, fill:cols[q % 4], opacity:0 }, st.Lfx2), dir:[Math.cos(a), Math.sin(a)], sp:(80 + rng() * 240) * k, k:q % N, j, sz, s2:950 + rng() * 300 });
    }
    const flares = st.nodes.map(n => mk("circle", { cx:n.tx, cy:n.ty, r:6 * k, fill:"none", stroke:"#fff", "stroke-width":f1(1.5 * k), opacity:0 }, st.Lfx2));
    return st.run(1950 + 40 * N, ms => {
      const q = seg(ms, 0, 380), boom = ms >= 380;
      st.Lorb.setAttribute("transform", about(CX, CY, { sx:1 - .28 * E.in(q) }));
      st.Lorb.setAttribute("opacity", boom ? 0 : 1);
      white.setAttribute("opacity", boom ? 0 : .75 * q);
      const f = seg(ms, 380, 820);
      flash.setAttribute("r", f1(R * .5 * (.3 + 2.3 * E.out(f)))); flash.setAttribute("opacity", boom ? 1 - f : 0);
      const g = seg(ms, 380, 1100);
      ring.setAttribute("r", f1(R * (.4 + 2.4 * E.out(g)))); ring.setAttribute("opacity", boom ? .9 * (1 - g) : 0); ring.setAttribute("stroke-width", f1((3.5 * (1 - g) + .4) * k));
      const p1 = E.out(seg(ms, 380, 1000));
      parts.forEach(Q => {
        const n = st.nodes[Q.k], p2 = seg(ms, Q.s2, Q.s2 + 650), e = E.io(p2);
        const x1 = CX + Q.dir[0] * Q.sp * p1, y1 = CY + Q.dir[1] * Q.sp * p1;
        Q.c.setAttribute("cx", f1(lerp(x1, n.tx + Q.j[0], e))); Q.c.setAttribute("cy", f1(lerp(y1, n.ty + Q.j[1], e)));
        Q.c.setAttribute("r", f1(Q.sz * (1 - .5 * p2)));
        Q.c.setAttribute("opacity", boom ? 1 - seg(p2, .8, 1) : 0);
      });
      st.nodes.forEach((n, i) => {
        const p = seg(ms, 1450 + 40 * i, 1850 + 40 * i);
        st.setNode(i, n.tx, n.ty, clamp(p * 2), .2 + .8 * E.back(p));
        st.setSpoke(i, p);
        flares[i].setAttribute("r", f1((6 + 26 * p) * k)); flares[i].setAttribute("opacity", p > 0 ? .8 * (1 - p) : 0);
      });
      st.setKernel(st.kr * (1 + .25 * Math.sin(ms / 60) * (1 - seg(ms, 700, 1600))), seg(ms, 700, 1000));
    });
  }}
};
const ORDER = ["walnut", "glass", "peel", "iris", "nova"];

/* ---------- one crack in progress ---------- */
let uid = 0;
class Crack {
  constructor(o) {
    Object.assign(this, o);
    this.id = "ck" + (++uid);
    this.k = this.R / 104;
    this.kr = this.kr || 26 * this.k;
    this.N = this.kids.length;
    this.rng = rngOf(this.seed);
    this.token = 0;
    this.ang = this.kids.map(n => Math.atan2(n.ty - this.cy, n.tx - this.cx));
    this.nodes = this.kids;
    const root = this.root = mk("g", { class:"crack-root " + (this.cls || "") }, this.layer);
    this.gdefs = mk("defs", {}, root);
    const sd = mk("defs", {}, root), p = this.id, k = this.k;
    sd.innerHTML = `
      <filter id="${p}-tex" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="${f1(.035 / k * 100) / 100} ${f1(.09 / k * 100) / 100}" numOctaves="3" seed="7" result="n"/>
        <feDiffuseLighting in="n" surfaceScale="3" lighting-color="#ffffff" result="l"><feDistantLight azimuth="235" elevation="52"/></feDiffuseLighting>
        <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.35" k2="0" k3="0" k4="0" result="t"/>
        <feComposite in="t" in2="SourceAlpha" operator="in"/>
      </filter>
      <filter id="${p}-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="${f1(2.6 * k)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <clipPath id="${p}-clip"><circle cx="${this.cx}" cy="${this.cy}" r="${f1(this.R + .5)}"/></clipPath>`;
    this.setHue(this.hue);
    this.Lspokes = mk("g", { class:"crack-spokes" }, root);
    this.spokes = this.kids.map(n => mk("line", { x1:f1(this.cx), y1:f1(this.cy), x2:f1(n.tx), y2:f1(n.ty), class:"crack-spoke", opacity:0 }, this.Lspokes));
    this.Lfx0 = mk("g", {}, root);
    this.Lkernel = mk("g", {}, root);
    this.kHalo = mk("circle", { cx:this.cx, cy:this.cy, r:1, fill:this.u("halo"), opacity:0 }, this.Lkernel);
    this.kCore = mk("circle", { cx:this.cx, cy:this.cy, r:1, fill:this.u("kern"), opacity:0 }, this.Lkernel);
    this.Lfx1 = mk("g", {}, root);
    this.Lorb = mk("g", {}, root);
    this.halo = mk("circle", { cx:this.cx, cy:this.cy, r:f1(this.R * 1.75), fill:this.u("halo"), opacity:0 }, this.Lorb);
    this.sphere = mk("circle", { cx:this.cx, cy:this.cy, r:f1(this.R), fill:this.u("orbU"), opacity:0 }, this.Lorb);
    this.Lfx2 = mk("g", {}, root);
  }
  u(n) { return `url(#${this.id}-${n})`; }
  hueCol(s, l) { return `hsl(${this.hue} ${s}% ${l}%)`; }
  setHue(h) {
    const p = this.id, CX = this.cx, CY = this.cy, R = this.R;
    const stops = `<stop offset="0" stop-color="hsl(${h} 88% 70%)"/><stop offset=".38" stop-color="hsl(${h} 78% 52%)"/><stop offset=".78" stop-color="hsl(${h} 70% 33%)"/><stop offset="1" stop-color="hsl(${h} 66% 22%)"/>`;
    this.gdefs.innerHTML = `
      <radialGradient id="${p}-orbU" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R}" fx="${f1(CX - R * .35)}" fy="${f1(CY - R * .4)}">${stops}</radialGradient>
      <radialGradient id="${p}-halo"><stop offset="0" stop-color="hsl(${h} 85% 62%)" stop-opacity=".5"/><stop offset=".55" stop-color="hsl(${h} 80% 50%)" stop-opacity=".14"/><stop offset="1" stop-color="hsl(${h} 80% 50%)" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-kern"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="hsl(${h} 95% 80%)"/><stop offset=".7" stop-color="hsl(${h} 90% 58%)" stop-opacity=".55"/><stop offset="1" stop-color="hsl(${h} 90% 50%)" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-shell" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R}" fx="${f1(CX - R * .3)}" fy="${f1(CY - R * .35)}"><stop offset="0" stop-color="hsl(${(h + 30) % 360} 38% 60%)"/><stop offset=".6" stop-color="hsl(${(h + 20) % 360} 40% 36%)"/><stop offset="1" stop-color="hsl(${(h + 10) % 360} 45% 20%)"/></radialGradient>
      <radialGradient id="${p}-inner" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R}"><stop offset="0" stop-color="hsl(${h} 70% 90%)"/><stop offset=".7" stop-color="hsl(${h} 80% 72%)"/><stop offset="1" stop-color="hsl(${h} 70% 55%)"/></radialGradient>
      <radialGradient id="${p}-chamber"><stop offset="0" stop-color="hsl(${h} 45% 16%)"/><stop offset="1" stop-color="#07030f"/></radialGradient>`;
  }
  setKernel(r, op) {
    this.kCore.setAttribute("r", f1(r)); this.kCore.setAttribute("opacity", op.toFixed(3));
    this.kHalo.setAttribute("r", f1(r * 2.3)); this.kHalo.setAttribute("opacity", (op * .8).toFixed(3));
  }
  setNode(i, x, y, op, s = 1) { this.place(i, x, y, op, s); }
  setSpoke(i, op) { this.spokes[i].setAttribute("opacity", op.toFixed(3)); }
  run(total, frame) {
    const tok = this.token;
    return new Promise(res => {
      let ms = 0, last = null;
      const step = now => {
        if (tok !== this.token) return;
        if (last !== null) ms += Math.min(50, now - last);
        last = now;
        frame(Math.min(ms, total));
        if (ms < total) this.raf = requestAnimationFrame(step); else res(true);
      };
      this.raf = requestAnimationFrame(step);
    });
  }
  // the nebula (or a field dot) condenses into a solid orb before cracking
  condense(fromR, hideSource) {
    return this.run(280, ms => {
      const p = E.out(seg(ms, 0, 280));
      this.sphere.setAttribute("r", f1(lerp(fromR, this.R, p)));
      this.sphere.setAttribute("opacity", Math.min(1, p * 1.4).toFixed(3));
      this.halo.setAttribute("opacity", p.toFixed(3));
      hideSource(1 - p);
    });
  }
  async play(style, fromR, hideSource) {
    const tok = this.token;
    await this.condense(fromR, hideSource);
    if (tok !== this.token) return false;
    await style.play(this);
    return tok === this.token;
  }
  // drop the effects, keep the spokes as a faint constellation
  settle() {
    for (const L of [this.Lfx0, this.Lfx1, this.Lfx2, this.Lorb, this.Lkernel]) L.remove();
    this.spokes.forEach(s => s.setAttribute("opacity", 1));
  }
  cancel() { this.token++; cancelAnimationFrame(this.raf); }
  destroy() { this.cancel(); this.root.remove(); }
}

/* ---------- layers on the live map ---------- */
const firstField = map.querySelector(".field");
const Lfield = firstField ? firstField.parentNode : map;
const OV = mk("g", { class:"crack-ov" });
map.insertBefore(OV, Lfield);                       // above domains, below fields
const Ltopics = mk("g", { class:"topic-layer" });
map.insertBefore(Ltopics, Lfield.nextSibling);      // above fields

/* ---------- style choice: mix, or one forced style ---------- */
let forced = "mix";
try { forced = localStorage.getItem("woc-crack-style") || "mix"; } catch (e) {}
if (forced !== "mix" && !STYLES[forced]) forced = "mix";
const DOMAIN_STYLE = { found:"walnut", hard:"glass", algo:"peel", lang:"iris", info:"nova", data:"glass", ai:"iris", ml:"walnut" };
function styleForDomain(d) { return forced !== "mix" ? forced : (DOMAIN_STYLE[d.id] || "walnut"); }
function styleForField(f, d) {
  if (forced !== "mix") return forced;
  const di = DOMAINS.indexOf(d), fi = (FIELDS[d.id] || []).indexOf(f);
  return ORDER[(di + fi + 1) % ORDER.length];
}

/* ---------- a small chip that names the style you just saw ---------- */
const chip = document.createElement("div");
chip.id = "crack-chip"; chip.setAttribute("aria-live", "polite");
document.body.appendChild(chip);
let chipT = null;
function showChip(key, what) {
  const s = STYLES[key];
  chip.innerHTML = `<b>${s.tag}</b> ${s.name}<span>${what}</span>`;
  chip.classList.add("on");
  clearTimeout(chipT); chipT = setTimeout(() => chip.classList.remove("on"), 3200);
}

/* ---------- picker in the toggles column ---------- */
const toggles = document.getElementById("toggles");
if (toggles) {
  const wrapEl = document.createElement("label");
  wrapEl.id = "crack-pick";
  wrapEl.innerHTML = `<span>✦ crack style</span><select id="crack-style" aria-label="Crack-open animation style">
    <option value="mix">Mix: each domain differs</option>
    ${ORDER.map(k => `<option value="${k}">${STYLES[k].tag} · ${STYLES[k].name}</option>`).join("")}
  </select>`;
  toggles.appendChild(wrapEl);
  const sel = wrapEl.querySelector("select");
  sel.value = forced;
  sel.addEventListener("change", () => {
    forced = sel.value;
    try { localStorage.setItem("woc-crack-style", forced); } catch (e) {}
    // replay straight away so the change is visible
    if (topic) { const t = topic; exitTopics(true); crackField(t.f, t.d); }
    else if (S.zoomed) crackDomain(S.zoomed);
  });
}

/* ---------- domain → fields ---------- */
let dom = null;      // { d, ctx, fields }
let topic = null;    // { f, d, ctx, nodes }
let startT = null;

function clearFieldStyles(list) {
  for (const f of list) { f._el.removeAttribute("transform"); f._el.style.opacity = ""; }
}
function resetDomain() {
  clearTimeout(startT);
  if (!dom) return;
  dom.ctx.destroy();
  clearFieldStyles(dom.fields);
  dom.d._el.style.opacity = "";
  document.body.classList.remove("cracking");
  dom = null;
}

function crackDomain(d) {
  exitTopics(true);
  resetDomain();
  const fields = FIELDS[d.id] || [];
  if (REDUCED || !fields.length) return;
  const key = styleForDomain(d);
  const R = d.r * .82;
  const kids = fields.map((f, i) => ({ tx:f._x, ty:f._y }));
  const ctx = new Crack({ layer:OV, cx:d.x, cy:d.y, R, hue:d.hue, kids, seed:hash(d.id + key),
    place(i, x, y, op, s) {
      const n = kids[i], el = fields[i]._el;
      el.setAttribute("transform", `translate(${f1(x)} ${f1(y)}) scale(${s.toFixed(3)}) translate(${f1(-n.tx)} ${f1(-n.ty)})`);
      el.style.opacity = op.toFixed(3);
    } });
  dom = { d, ctx, fields };
  document.body.classList.add("cracking");
  fields.forEach(f => { f._el.style.opacity = 0; });
  showChip(key, "opening " + d.name);
  startT = setTimeout(async () => {
    const done = await ctx.play(STYLES[key], R * .55, v => { d._el.style.opacity = v.toFixed(3); });
    if (!done || !dom || dom.ctx !== ctx) return;
    ctx.settle();
    clearFieldStyles(fields);
    d._el.style.transition = "opacity .5s ease";
    d._el.style.opacity = "";
    setTimeout(() => { d._el.style.transition = ""; }, 600);
    document.body.classList.remove("cracking");
  }, 220);
}

/* ---------- field → topics ---------- */
function exitTopics(silent) {
  if (!topic) return false;
  const t = topic; topic = null;
  t.ctx.destroy();
  Ltopics.innerHTML = "";
  t.f._el.classList.remove("focus");
  t.f._el.style.opacity = "";
  document.body.classList.remove("topic-focus");
  if (!silent && S.zoomed && window.animateViewBox) animateViewBox(domainBox(S.zoomed));
  return true;
}
function domainBox(d) {
  return window.domainBox ? window.domainBox(d) : `${d.x - 310} ${d.y - 210} 620 420`;
}

function focusTopicCard(i) {
  const cards = document.querySelectorAll("#panel-body .topic");
  const c = cards[i];
  if (!c) return;
  if (!document.getElementById("panel").classList.contains("open")) return;
  c.scrollIntoView({ behavior:REDUCED ? "auto" : "smooth", block:"center" });
  c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash");
  if (window.WOC_TOPIC_OPEN) WOC_TOPIC_OPEN(c);   // extras.js: open its "deeper" drawer
}

function crackField(f, d) {
  if (topic && topic.f === f) return;
  exitTopics(true);
  const list = f.topics || [];
  if (!list.length || f._x === undefined) return;
  // settle any domain crack still running so the field is in place
  if (dom && dom.d === d) {
    dom.ctx.cancel(); dom.ctx.settle(); clearFieldStyles(dom.fields);
    d._el.style.opacity = ""; document.body.classList.remove("cracking");
  }
  const key = styleForField(f, d);
  const n = list.length, RXt = 168, RYt = 104, R = 44;
  const off = n === 2 ? 0 : -Math.PI / 2;
  const nodes = list.map((t, i) => {
    const a = off + i * 2 * Math.PI / n;
    const tx = f._x + RXt * Math.cos(a), ty = f._y + RYt * Math.sin(a);
    const g = mk("g", { class:"topic-node" + (t.y > S.year ? " unborn" : ""), tabindex:0, role:"button",
      "aria-label":`${t.n}, ${t.y}`, opacity:0, transform:`translate(${f1(tx)} ${f1(ty)})` }, Ltopics);
    mk("circle", { r:17, class:"hit" }, g);
    mk("circle", { r:10, fill:STATUS_COL[t.s] || STATUS_COL.found, opacity:.18 }, g);
    mk("circle", { r:5.5, fill:STATUS_COL[t.s] || STATUS_COL.found, stroke:"#fff", "stroke-opacity":.6, "stroke-width":.7, class:"tcore" }, g);
    const lines = wrap(t.n, 20);
    const tx1 = mk("text", { class:"tl", y:17 }, g);
    lines.forEach((ln, j) => { mk("tspan", { x:0, dy:j ? 10 : 0 }, tx1).textContent = ln; });
    mk("text", { class:"ty", y:17 + lines.length * 10 }, g).textContent = t.y;
    const open = () => focusTopicCard(i);
    g.addEventListener("click", ev => { ev.stopPropagation(); open(); });
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); } });
    return { g, tx, ty };
  });
  document.body.classList.add("topic-focus");
  f._el.classList.add("focus");
  const w = 600, h = 400;
  if (window.animateViewBox) animateViewBox(`${f1(f._x - w / 2 + w * .13)} ${f1(f._y - h / 2 + 8)} ${w} ${h}`);

  const place = (i, x, y, op, s) => {
    const q = nodes[i];
    q.g.setAttribute("transform", `translate(${f1(x)} ${f1(y)}) scale(${s.toFixed(3)})`);
    q.g.setAttribute("opacity", op.toFixed(3));
  };
  const ctx = new Crack({ layer:OV, cx:f._x, cy:f._y, R, kr:11, cls:"topic-crack", hue:STATUS_HUE[f.s] || 215, kids:nodes, seed:hash(f.id + key), place });
  topic = { f, d, ctx, nodes };
  if (REDUCED) { nodes.forEach((q, i) => place(i, q.tx, q.ty, 1, 1)); ctx.settle(); return; }
  showChip(key, "opening " + f.name);
  const done = ctx.play(STYLES[key], 11, v => { f._el.style.opacity = v.toFixed(3); });
  done.then(ok => {
    if (!ok || !topic || topic.ctx !== ctx) return;
    ctx.settle();
    nodes.forEach((q, i) => place(i, q.tx, q.ty, 1, 1));
    f._el.style.transition = "opacity .4s ease";
    f._el.style.opacity = "";
    setTimeout(() => { f._el.style.transition = ""; }, 500);
  });
}

/* ---------- CSS ---------- */
const css = `
body.cracking .field { transition: none !important; }
.crack-spoke { stroke: rgba(245,196,81,.32); stroke-width: .8; stroke-dasharray: 2 6; }
body.topic-focus .crack-root:not(.topic-crack) .crack-spoke { opacity: .12 !important; }
body.topic-focus .field.active:not(.focus) { opacity: .1 !important; }
body.topic-focus .domain { opacity: .18; transition: opacity .4s ease; }
.topic-node { cursor: pointer; outline: none; }
.topic-node .hit { fill: transparent; }
.topic-node:hover .hit, .topic-node:focus-visible .hit { fill: rgba(245,196,81,.16); }
.topic-node:focus-visible .hit { stroke: var(--gold); stroke-width: 1; }
.topic-node text.tl { font-family: "Spectral", Georgia, serif; font-size: 8.5px; fill: var(--ink);
  text-anchor: middle; paint-order: stroke; stroke: rgba(0,0,0,.8); stroke-width: 2.6px; stroke-linejoin: round; }
.topic-node text.ty { font-family: "IBM Plex Mono", monospace; font-size: 6.5px; fill: var(--dim);
  text-anchor: middle; paint-order: stroke; stroke: rgba(0,0,0,.75); stroke-width: 2px; }
.topic-node.unborn { opacity: .25 !important; }
#panel .topic.flash { animation: topicflash 1.8s ease; }
@keyframes topicflash { 0% { background: rgba(245,196,81,.28); } 100% { background: transparent; } }
#crack-chip {
  position: fixed; left: 50%; top: 3.7rem; z-index: 26; transform: translate(-50%, -6px);
  font-family: "IBM Plex Mono", monospace; font-size: .74rem; color: var(--ink);
  background: var(--glass); border: 1px solid rgba(245,196,81,.45); border-radius: 999px;
  padding: .4rem .95rem; display: flex; gap: .55rem; align-items: baseline;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  opacity: 0; pointer-events: none; transition: opacity .35s ease, transform .35s ease;
}
#crack-chip.on { opacity: 1; transform: translate(-50%, 0); }
#crack-chip b { color: #1a1206; background: var(--gold); border-radius: 4px; padding: 0 .35rem; font-weight: 500; }
#crack-chip span { color: var(--dim); }
#crack-pick { display: flex; flex-direction: column; gap: .25rem; font-family: "IBM Plex Mono", monospace;
  font-size: .64rem; letter-spacing: .06em; color: var(--dim); background: var(--glass);
  border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: .45rem .7rem; }
#crack-pick select { font-family: inherit; font-size: .7rem; color: var(--gold); background: transparent;
  border: 0; outline: none; cursor: pointer; padding: 0; }
#crack-pick select option { background: #140c24; color: var(--ink); }
#crack-pick:focus-within { border-color: var(--gold); }
@media (max-width: 700px) { #crack-chip { top: 3rem; font-size: .66rem; } }
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

/* ---------- public hooks ---------- */
window.WOC_CRACK = {
  domain: d => crackDomain(d),
  field: (f, d) => crackField(f, d),
  back: () => exitTopics(false),
  reset: () => { exitTopics(true); resetDomain(); },
  styles: STYLES
};
})();
