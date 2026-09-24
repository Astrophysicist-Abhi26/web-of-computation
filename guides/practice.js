// DATA ENGINEERING & PRACTICE — the honest 80%: looking at data, cleaning it,
// and not being fooled by it. Three real labs on real historical data:
// Anscombe's quartet (identical statistics, different stories), a cleaning
// pipeline on messy records, and Simpson's paradox in the 1973 UC Berkeley
// admissions data.
(function () {
"use strict";
const { register, canvas, C } = GuideKit;

const CHAPTERS = [
  { icon:"👀", title:"1977 — Tukey: look at the data first",
    who:"John Tukey · Exploratory Data Analysis · Bell Labs and Princeton",
    lead:"Before testing hypotheses, look. Tukey argued that exploring data with simple pictures was as important as confirming theories with formal tests, and invented many of the pictures.",
    formula:"'Far better an approximate answer to the right question … than an exact answer to the wrong question.' — Tukey, 1962",
    what:`Exploratory data analysis means plotting, summarising and poking at data to find patterns, errors and
      surprises before building models. Tukey invented the box plot and the stem-and-leaf plot for exactly
      that purpose.`,
    how:`His 1962 paper "The Future of Data Analysis" argued that statistics should be an empirical science of
      data, not just a branch of mathematics, and that computers would transform it.`,
    story:`Tukey also coined the word "bit" (1947, credited in Shannon's 1948 paper) and co-invented the Fast
      Fourier Transform with Cooley (1965). His work turns up in several different fields of this
      map.`,
    today:`Every good data science workflow starts with exploratory plots. Many costly modelling mistakes would have
      been caught by one honest look at the raw data.` },
  { icon:"📊", title:"Same numbers, different stories — Anscombe's quartet",
    who:"Francis Anscombe 1973 · the Datasaurus Dozen (Matejka & Fitzmaurice) 2017",
    lead:"Four small datasets share the same mean, variance, correlation and regression line to two decimal places. Plot them and they could hardly be more different.",
    formula:"mean x = 9 · mean y ≈ 7.50 · var x = 11 · var y ≈ 4.12 · correlation ≈ 0.816 · line y ≈ 3.00 + 0.500x   (all four datasets)",
    what:`Anscombe built the quartet to show that summary statistics alone can mislead: one dataset is a clean line,
      one a curve, one a line with an outlier, one a vertical stack with a single influential point. See all
      four in Lab 1.`,
    how:`Summary numbers compress data, and compression throws information away. Only a plot shows curvature,
      outliers and clusters that a correlation coefficient hides.`,
    story:`In 2017 researchers at Autodesk generated the "Datasaurus Dozen": thirteen datasets with identical
      statistics, one of which is a drawing of a dinosaur.`,
    today:`The lesson extends to machine learning: two models with the same accuracy can fail in completely
      different ways. Always look at the errors, not just the score.` },
  { icon:"🧹", title:"The honest 80% — cleaning data",
    who:"a folk statistic of every data team",
    lead:"Practitioners often say most of a data project's time goes into finding, cleaning and reshaping data, not modelling. The exact percentage is debated; the experience is universal.",
    formula:"duplicates · missing values · sentinel codes (−999) · mixed units · inconsistent spellings and date formats",
    what:`Real data arrive with duplicated rows, missing entries, codes like −999 meaning "no reading", mixed units
      (Celsius and Fahrenheit) and misspelt labels. Each problem, left in, quietly corrupts every result
      downstream. Lab 2 shows how much one average changes as each problem is fixed.`,
    how:`Hadley Wickham's "tidy data" principles (2014) gave a vocabulary for it: each variable a column, each
      observation a row, each type of observational unit a table.`,
    story:`Famous failures include NASA's Mars Climate Orbiter (1999), lost because one team used pound-force
      seconds and another newton-seconds: a unit mismatch that no one caught.`,
    today:`For training large models, data curation (filtering, de-duplicating and balancing trillions of tokens)
      is one of the most important and least glamorous parts of the work.` },
  { icon:"🔀", title:"Simpson's paradox — when every part and the whole disagree",
    who:"Edward Simpson 1951 · Bickel, Hammel & O'Connell (Berkeley) 1975",
    lead:"A trend can appear in every group of data and reverse when the groups are combined. The classic real example is graduate admissions at UC Berkeley in 1973.",
    formula:"men admitted more often overall, yet in most departments women were admitted as often or more often",
    what:`In 1973 Berkeley admitted a noticeably higher share of male applicants overall, which looked like bias
      against women. Department by department, though, women were admitted at similar or higher rates. Lab 3 has
      the real numbers for the six largest departments.`,
    how:`The explanation is a confounding variable: women applied more often to departments with low admission
      rates for everyone. The pooled number mixes "who applied where" with "who was admitted".`,
    story:`Bickel and colleagues published the analysis in Science in 1975. It has been taught ever since as a
      warning that aggregated data can point the opposite way from the truth.`,
    today:`Simpson's paradox is why causal reasoning (Judea Pearl's work, in the pioneer gallery) matters: to know
      which comparison is right, you need to know how the variables cause one another, not just how they
      correlate.` },
  { icon:"📓", title:"2008 — 'data science', and notebooks for reproducible work",
    who:"DJ Patil & Jeff Hammerbacher (the job title) · Fernando Pérez (IPython 2001, Jupyter 2014)",
    lead:"'Data science' was a new job title for an old mix: statistics, computing and knowledge of a subject. Notebooks became its working medium.",
    formula:"data science ≈ statistics ∩ computing ∩ domain knowledge",
    what:`Patil and Hammerbacher, building data teams at LinkedIn and Facebook, used the title "data scientist"
      around 2008; a 2012 Harvard Business Review article called it "the sexiest job of the 21st century".
      The map says honestly that it is a label stapled over older disciplines.`,
    how:`Jupyter notebooks mix code, results, plots and explanation in one document, so an analysis can be read,
      rerun and checked. They grew out of Fernando Pérez's IPython (2001), started while he was a physics
      graduate student.`,
    story:`Notebooks also make it easy to run cells out of order and produce results nobody can reproduce, a known
      problem studies have measured on public notebooks. Good practice (clean reruns, version control, recorded
      environments) matters as much as the tool.`,
    today:`Reproducibility is central to science's response to the replication crisis. The FAIR principles (data
      should be findable, accessible, interoperable and reusable) now guide how research data are shared.` }
];

const SOURCES = [
  { type:"THE MANIFESTO · 1962", title:"John Tukey — The Future of Data Analysis", note:"Annals of Mathematical Statistics 33(1). Data analysis as an empirical science.", url:"https://doi.org/10.1214/aoms/1177704711" },
  { type:"ANSCOMBE · 1973", title:"F. J. Anscombe — Graphs in Statistical Analysis", note:"The American Statistician 27(1). The quartet in Lab 1.", url:"https://doi.org/10.1080/00031305.1973.10478966" },
  { type:"DATASAURUS · 2017", title:"Matejka & Fitzmaurice — Same Stats, Different Graphs", note:"CHI 2017. The Datasaurus Dozen.", url:"https://doi.org/10.1145/3025453.3025912" },
  { type:"BERKELEY · 1975", title:"Bickel, Hammel & O'Connell — Sex Bias in Graduate Admissions: Data from Berkeley", note:"Science 187. The data in Lab 3.", url:"https://doi.org/10.1126/science.187.4175.398" },
  { type:"TIDY DATA · 2014", title:"Hadley Wickham — Tidy Data", note:"Journal of Statistical Software 59(10). A grammar for clean datasets.", url:"https://doi.org/10.18637/jss.v059.i10" },
  { type:"JUPYTER · 2016", title:"Kluyver et al. — Jupyter Notebooks: a publishing format for reproducible computational workflows", note:"The notebook as a scientific document.", url:"https://doi.org/10.3233/978-1-61499-649-1-87" },
  { type:"DATA SCIENCE · 2017", title:"David Donoho — 50 Years of Data Science", note:"A statistician's history of the field, from Tukey onwards.", url:"https://doi.org/10.1080/10618600.2017.1384734" },
  { type:"FAIR · 2016", title:"Wilkinson et al. — The FAIR Guiding Principles for Scientific Data Management and Stewardship", note:"Scientific Data 3. Findable, accessible, interoperable, reusable.", url:"https://doi.org/10.1038/sdata.2016.18" }
];

/* -------------------------------------------------------- LAB 1: Anscombe */
const AX = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
const ANS = {
  I:[AX, [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]],
  II:[AX, [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74]],
  III:[AX, [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]],
  IV:[[8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89]]
};
function stats(x, y) { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
  const vx = x.reduce((a, v) => a + (v - mx) ** 2, 0) / (n - 1), vy = y.reduce((a, v) => a + (v - my) ** 2, 0) / (n - 1), cxy = x.reduce((a, v, i) => a + (v - mx) * (y[i] - my), 0) / (n - 1);
  const b = cxy / vx; return { mx, my, vx, vy, r:cxy / Math.sqrt(vx * vy), a:my - b * mx, b }; }
const ansLab = {
  kicker:"LOOK AT THE DATA · ANSCOMBE 1973", title:"Four datasets, one set of statistics",
  intro:`These are Anscombe's original numbers. The table shows each dataset's mean, variance, correlation and regression line: essentially identical. Now look at the plots.`,
  html:`<canvas class="gk-canvas" data-role="cv"></canvas><table class="gk-table" data-role="tab"></table>`,
  caveat:`Only dataset I is what the statistics suggest. II is a curve, III is a line knocked askew by one outlier, and in IV a single point creates the whole 'correlation'.`,
  init(root) {
    const q = s => root.querySelector(s), { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 240); ctx.clearRect(0, 0, W, H);
    const pw = W / 2, ph = H / 2;
    Object.entries(ANS).forEach(([name, [x, y]], k) => { const ox = (k % 2) * pw, oy = Math.floor(k / 2) * ph, s = stats(x, y);
      const X = v => ox + 18 + (v - 2) / 18 * (pw - 28), Y = v => oy + ph - 14 - (v - 2) / 12 * (ph - 24);
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.strokeRect(ox + 14, oy + 6, pw - 20, ph - 16);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(2), Y(s.a + 2 * s.b)); ctx.lineTo(X(20), Y(s.a + 20 * s.b)); ctx.stroke();
      x.forEach((v, i) => { ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(X(v), Y(y[i]), 3.2, 0, 7); ctx.fill(); });
      ctx.fillStyle = C.ink; ctx.font = "11px IBM Plex Mono, monospace"; ctx.fillText(name, ox + 20, oy + 20); });
    q('[data-role="tab"]').innerHTML = `<tr><th>set</th><th>mean x</th><th>mean y</th><th>var x</th><th>var y</th><th>corr</th><th>line</th></tr>` +
      Object.entries(ANS).map(([n, [x, y]]) => { const s = stats(x, y); return `<tr><td>${n}</td><td>${s.mx.toFixed(2)}</td><td>${s.my.toFixed(2)}</td><td>${s.vx.toFixed(2)}</td><td>${s.vy.toFixed(2)}</td><td>${s.r.toFixed(3)}</td><td>${s.a.toFixed(2)} + ${s.b.toFixed(3)}x</td></tr>`; }).join("");
  }
};

/* -------------------------------------------------------- LAB 2: cleaning */
const RAW = [
  ["2024-03-01", "London", "11.2"], ["2024-03-01", "London", "11.2"], ["01/03/2024", "Paris", "12.5"], ["2024-03-01", "Lodnon", "10.8"],
  ["2024-03-02", "London", "-999"], ["2024-03-02", "Paris", "55.4F"], ["2024-03-02", "Berlin", ""], ["2024-03-03", "Berlin", "8.1"],
  ["03/03/2024", "paris", "13.0"], ["2024-03-03", "London", "12.0"], ["2024-03-04", "Berlin", "46.9F"], ["2024-03-04", "Paris", "NA"]
];
const STEPS = [
  ["dup", "remove exact duplicate rows"], ["sentinel", "treat −999 as missing"], ["units", "convert °F to °C"],
  ["names", "fix city spellings and case"], ["dates", "standardise dates to ISO (YYYY-MM-DD)"], ["drop", "drop rows with missing temperature"]
];
function clean(on) {
  let rows = RAW.map(r => r.slice());
  if (on.dup) rows = rows.filter((r, i) => rows.findIndex(s => s.join() === r.join()) === i);
  if (on.dates) rows = rows.map(([d, c, t]) => [/^\d\d\/\d\d\/\d{4}$/.test(d) ? `${d.slice(6)}-${d.slice(3, 5)}-${d.slice(0, 2)}` : d, c, t]);
  if (on.names) rows = rows.map(([d, c, t]) => [d, ({ lodnon:"London" })[c.toLowerCase()] || c[0].toUpperCase() + c.slice(1).toLowerCase(), t]);
  if (on.sentinel) rows = rows.map(([d, c, t]) => [d, c, t === "-999" ? "" : t]);
  if (on.units) rows = rows.map(([d, c, t]) => [d, c, /F$/.test(t) ? ((parseFloat(t) - 32) * 5 / 9).toFixed(1) : t]);
  if (on.drop) rows = rows.filter(([, , t]) => t !== "" && t !== "NA" && !isNaN(parseFloat(t)));
  return rows;
}
const cleanLab = {
  kicker:"THE HONEST 80% · CLEANING", title:"Clean twelve messy weather readings, one step at a time",
  intro:`Twelve temperature readings arrive from three cities: with a duplicate, a −999 'no reading' code, two values in Fahrenheit, a misspelt city, mixed date formats and missing values. Tick cleaning steps and watch the table and the headline number change. The 'average temperature' before cleaning is not just a bit off: it is nonsense.`,
  html:`<div data-role="steps">${STEPS.map(([k, t]) => `<label class="it-check" style="margin:.2rem 0"><input type="checkbox" data-k="${k}"> ${t}</label>`).join("")}</div>
    <div class="it-lab-actions"><button class="gk-ghost" data-a="all">apply all</button><button class="gk-ghost" data-a="none">undo all</button></div>
    <div style="overflow-x:auto"><table class="gk-table" data-role="tab"></table></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Order matters, too: converting Fahrenheit before treating −999 as missing would turn the code into a fake −572.8 °C reading. Real pipelines record every step so the cleaning itself can be checked and reproduced.`,
  init(root) {
    const q = s => root.querySelector(s);
    function draw() {
      const on = {}; root.querySelectorAll('[data-role="steps"] input').forEach(i => on[i.dataset.k] = i.checked);
      const rows = clean(on), nums = rows.map(r => parseFloat(r[2])).filter(v => !isNaN(v)), mean = nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length);
      q('[data-role="tab"]').innerHTML = `<tr><th>date</th><th>city</th><th>temp</th></tr>` + rows.map(([d, c, t]) => `<tr><td>${d}</td><td>${c}</td><td class="${t === "" || t === "NA" || t === "-999" || /F$/.test(t) ? "hl" : ""}">${t || "(blank)"}</td></tr>`).join("");
      const cities = [...new Set(rows.map(r => r[1]))];
      q('[data-role="out"]').innerHTML = `rows: <span class="g">${rows.length}</span>   ·   distinct cities: ${cities.length} (${cities.join(", ")})\n"average temperature" computed naively from whatever parses: <span class="${Math.abs(mean - 11) < 2 ? "t" : "r"}">${mean.toFixed(1)} °C</span>\n<span class="d">highlighted cells still need attention</span>`;
    }
    root.querySelectorAll('[data-role="steps"] input').forEach(i => i.addEventListener("change", draw));
    q('[data-a="all"]').addEventListener("click", () => { root.querySelectorAll('[data-role="steps"] input').forEach(i => i.checked = true); draw(); });
    q('[data-a="none"]').addEventListener("click", () => { root.querySelectorAll('[data-role="steps"] input').forEach(i => i.checked = false); draw(); });
    draw();
  }
};

/* ------------------------------------------------------- LAB 3: Simpson */
const BERK = [["A", 825, .62, 108, .82], ["B", 560, .63, 25, .68], ["C", 325, .37, 593, .34], ["D", 417, .33, 375, .35], ["E", 191, .28, 393, .24], ["F", 373, .06, 341, .07]];
const simpLab = {
  kicker:"SIMPSON'S PARADOX · BERKELEY 1973", title:"Is there a bias, and in which direction?",
  intro:`These are the real 1973 figures for Berkeley's six largest graduate departments (Bickel et al., 1975). Look at the pooled admission rates, then at each department. Toggle the view to see what drives the reversal: where men and women applied.`,
  html:`<div class="gk-chips" data-role="v"><button class="gk-chip on" data-v="rate">admission rates</button><button class="gk-chip" data-v="apps">where people applied</button></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Neither the pooled nor the per-department view is automatically 'right'. Which comparison answers your question depends on the causal story, for instance whether the choice of department is itself shaped by discrimination. That is where Judea Pearl's causal diagrams come in.`,
  init(root) {
    const q = s => root.querySelector(s); let view = "rate";
    const menA = BERK.reduce((a, d) => a + d[1] * d[2], 0), menN = BERK.reduce((a, d) => a + d[1], 0), womA = BERK.reduce((a, d) => a + d[3] * d[4], 0), womN = BERK.reduce((a, d) => a + d[3], 0);
    function draw() {
      const { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 200); ctx.clearRect(0, 0, W, H);
      const groups = BERK.length + 1, gw = (W - 20) / groups, bw = gw * .32;
      const data = view === "rate" ? BERK.map(d => [d[0], d[2], d[4]]).concat([["all", menA / menN, womA / womN]]) : BERK.map(d => [d[0], d[1] / menN, d[3] / womN]);
      const mx = view === "rate" ? 1 : .35;
      data.forEach(([n, m, w], i) => { const x = 14 + i * gw, Y = v => H - 22 - v / mx * (H - 40);
        ctx.fillStyle = C.blue; ctx.fillRect(x, Y(m), bw, H - 22 - Y(m)); ctx.fillStyle = C.pink; ctx.fillRect(x + bw + 2, Y(w), bw, H - 22 - Y(w));
        ctx.fillStyle = C.ink; ctx.font = "10px IBM Plex Mono, monospace"; ctx.fillText(n, x + bw - 3, H - 8);
        ctx.fillStyle = C.dim; ctx.font = "8px IBM Plex Mono, monospace"; ctx.fillText(Math.round(m * 100), x, Y(m) - 3); ctx.fillText(Math.round(w * 100), x + bw + 2, Y(w) - 3); });
      ctx.fillStyle = C.blue; ctx.fillText("men", W - 60, 12); ctx.fillStyle = C.pink; ctx.fillText("women", W - 60, 24);
      q('[data-role="out"]').innerHTML = view === "rate"
        ? `pooled over six departments: men <span class="g">${(menA / menN * 100).toFixed(1)}%</span> admitted, women <span class="g">${(womA / womN * 100).toFixed(1)}%</span>\nbut women's rate is higher in <span class="t">${BERK.filter(d => d[4] > d[2]).length} of 6</span> departments (A, B, D, F), and lower only in C and E, by small margins`
        : `share of each group's applications going to each department\nmost men applied to A and B (admission rates above 60%); most women applied to C–F (rates of 6–35%)\n<span class="d">department choice is the confounder that flips the pooled comparison</span>`;
    }
    root.querySelectorAll('[data-role="v"] .gk-chip').forEach(b => b.addEventListener("click", () => { view = b.dataset.v; root.querySelectorAll('[data-role="v"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    draw();
  }
};

register("practice", {
  kicker:"DATA ENGINEERING & PRACTICE · 1962–NOW · ABOUT 30 MIN",
  hook:"A spacecraft was lost because two teams used different units. Four datasets with identical statistics tell four different stories. Most of working with data is making sure you are not fooled.",
  intro:`This field is the part of data work that rarely makes headlines: looking at data before modelling it, cleaning it, keeping analyses reproducible, and spotting when aggregated numbers mislead. 'Data science' is a 2008 job title stapled over these older disciplines, and the map says so honestly. Three labs below, on real historical data: Anscombe's quartet, a cleaning pipeline, and Simpson's paradox in Berkeley's 1973 admissions.`,
  timeline:[[1962, "Tukey: Future of Data Analysis"], [1973, "Anscombe's quartet"], [1975, "Berkeley & Simpson"], [2008, "'data scientist'"], [2014, "Jupyter · tidy data"]],
  labs:[ansLab, cleanLab, simpLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, before looking at the plots, read the table and guess what the data look like. Then look. That gap is Tukey's whole argument.",
    "In Lab 2, apply the steps one at a time and note which single step changes the average the most.",
    "Still in Lab 2, the pipeline always handles −999 before converting units. Why would the opposite order be dangerous? (Read the caveat.)",
    "In Lab 3, switch between the two views and explain the reversal in one sentence, as if to a newspaper editor.",
    "Find a chart in today's news that pools groups together, and ask what a per-group breakdown might show."
  ],
  sources:SOURCES
});
})();
