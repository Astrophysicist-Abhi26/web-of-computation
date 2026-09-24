// DATABASES — Codd's relations, SQL, transactions, and the vector databases
// that give language models a memory. Three real labs: a small SQL engine
// (SELECT, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT) over pioneer tables, the
// lost-update race that transactions prevent, and approximate nearest-neighbour
// search (an IVF index) with measured recall.
(function () {
"use strict";
const { register, canvas, rng, gauss, C } = GuideKit;

const CHAPTERS = [
  { icon:"🗄", title:"Before relations — navigating pointers",
    who:"IBM IMS (for Apollo) 1966 · CODASYL network model 1969",
    lead:"Early databases stored records linked by pointers. To answer a question you wrote a program that walked those links, and if the structure changed, the program broke.",
    formula:"hierarchical: parent → children records    network: records linked by named sets    — the query IS a navigation program",
    what:`IBM's IMS was built with North American Rockwell to track the millions of parts for the Apollo programme.
      Data lived in trees of records; the CODASYL network model generalised them to graphs. Programmers
      "navigated" from record to record.`,
    how:`Performance was good for the questions the designers anticipated and painful for anything else. Changing
      how data was stored meant rewriting the programs that read it.`,
    story:`Charles Bachman won the 1973 Turing Award for navigational databases; his lecture was titled "The
      Programmer as Navigator". IMS still runs in some banks and airlines today.`,
    today:`Graph databases (Neo4j and others) revived the linked-record idea for data that really is a network, such
      as social graphs and knowledge graphs.` },
  { icon:"📐", title:"1970 — Codd's relational model",
    who:"Edgar F. Codd · IBM San Jose",
    lead:"Codd proposed storing data as simple tables (relations) and asking questions declaratively: say what you want, not how to find it. The system works out the how.",
    formula:"π_name( σ_born<1920 ( pioneers ⋈ awards ) )      — select, project, join: relational algebra",
    what:`In the relational model all data is in tables of rows and columns, and queries are expressions in
      relational algebra: select rows, project columns, join tables on matching values. Because queries say what
      rather than how, storage can change without breaking them ("data independence").`,
    how:`A query optimiser translates the declarative request into an efficient plan, choosing indexes (B-trees,
      from the Data Structures guide) and join orders. That separation is the core of Codd's idea.`,
    story:`IBM, whose profits came from IMS, was slow to build a product on Codd's model. Oracle (founded 1977)
      shipped a commercial SQL database first. Codd received the 1981 Turing Award.`,
    today:`PostgreSQL, MySQL, SQLite (in every phone), Oracle and SQL Server all implement Codd's model. The map
      marks it 🏛 foundational.` },
  { icon:"💬", title:"1974 — SQL: a query language for everyone",
    who:"Donald Chamberlin & Raymond Boyce · IBM System R",
    lead:"SEQUEL, later renamed SQL, was designed to read like English so that non-programmers could ask questions of data. Fifty years on, it is one of the most widely used languages in computing.",
    formula:"SELECT name, born FROM pioneers WHERE country = 'britain' ORDER BY born",
    what:`SQL expresses Codd's algebra in keywords: SELECT columns, FROM tables, WHERE conditions, JOIN to combine
      tables, GROUP BY to aggregate. Lab 1 runs real queries on small tables of pioneers and awards.`,
    how:`IBM's System R project (1974–1979) proved that a relational database with SQL could be fast enough for real
      use, thanks to its cost-based query optimiser, still the model for optimisers today.`,
    story:`The name changed from SEQUEL to SQL because of a trademark conflict. People still argue whether to say
      "S-Q-L" or "sequel".`,
    today:`"Fifty years old and still hiring": SQL is used by data analysts, engineers and scientists daily, and
      language models are now routinely asked to write it.` },
  { icon:"🔒", title:"Transactions — all or nothing, even when everything happens at once",
    who:"Jim Gray (1970s–80s) · ACID named by Härder & Reuter 1983",
    lead:"When thousands of users update a database simultaneously and machines can crash at any moment, how do you keep the data correct? Treat each group of changes as a transaction.",
    formula:"ACID: Atomic (all or nothing) · Consistent · Isolated (as if alone) · Durable (survives crashes)",
    what:`A transaction is a group of reads and writes that either all happen or none do, and that behaves as if it
      ran alone. Without isolation, two simultaneous updates can overwrite each other: the "lost update" in
      Lab 2.`,
    how:`Databases enforce isolation with locks or with multi-version concurrency control, and guarantee durability
      by writing a log to disk before changing the data, so they can recover after a crash.`,
    story:`Jim Gray received the 1998 Turing Award for transaction processing. In 2007 he disappeared while sailing
      alone off San Francisco; a large volunteer search, including crowdsourced analysis of satellite images,
      failed to find him.`,
    today:`Every bank transfer, ticket booking and online purchase depends on transactions. Distributed databases
      such as Google Spanner extend them across continents using synchronised clocks.` },
  { icon:"🧭", title:"Vector databases — memory for language models",
    who:"Jégou et al. (product quantisation) 2011 · FAISS (Johnson, Douze & Jégou) 2017 · RAG (Lewis et al.) 2020",
    lead:"Instead of matching exact values, find the records whose embeddings are nearest to a query embedding. It is k-nearest-neighbours at the scale of billions.",
    formula:"query → embedding q;   return the k stored vectors with the highest cosine similarity to q",
    what:`A vector database stores embeddings (lists of numbers from a model, see the Deep Learning guide) and finds
      the nearest ones to a query. Retrieval-augmented generation (RAG) uses it to give a language model the most
      relevant documents before it answers.`,
    how:`Checking every vector is too slow for billions of items, so indexes trade a little accuracy for a lot of
      speed: cluster the vectors (k-means) and search only the nearest clusters (IVF), compress them (product
      quantisation), or navigate a graph of neighbours (HNSW). Lab 3 builds an IVF index and measures its
      recall.`,
    story:`FAISS, released by Facebook AI Research in 2017, made billion-scale similarity search practical on GPUs.
      Dozens of vector database companies followed during the LLM boom.`,
    today:`The map calls vector databases SQL's newborn sibling, marked 🔥. Many relational databases (PostgreSQL
      with pgvector, for instance) now store vectors alongside tables.` }
];

const SOURCES = [
  { type:"THE RELATIONAL MODEL · 1970", title:"E. F. Codd — A Relational Model of Data for Large Shared Data Banks", note:"CACM 13(6). Every SQL database descends from this.", url:"https://doi.org/10.1145/362384.362685" },
  { type:"SQL · 1974", title:"Chamberlin & Boyce — SEQUEL: A Structured English Query Language", note:"The first description of what became SQL.", url:"https://doi.org/10.1145/800296.811515" },
  { type:"SYSTEM R · 1976", title:"Astrahan et al. — System R: Relational Approach to Database Management", note:"Proof that relational databases could be fast.", url:"https://doi.org/10.1145/320455.320457" },
  { type:"ACID · 1983", title:"Härder & Reuter — Principles of Transaction-Oriented Database Recovery", note:"The paper that coined 'ACID'.", url:"https://doi.org/10.1145/289.291" },
  { type:"NAVIGATION · 1973", title:"Charles Bachman — The Programmer as Navigator", note:"Turing Award lecture on pre-relational databases.", url:"https://doi.org/10.1145/355611.362534" },
  { type:"VECTOR SEARCH · 2017", title:"Johnson, Douze & Jégou — Billion-scale Similarity Search with GPUs", note:"FAISS.", url:"https://arxiv.org/abs/1702.08734" },
  { type:"COMPRESSION · 2011", title:"Jégou, Douze & Schmid — Product Quantization for Nearest Neighbor Search", note:"How billions of vectors fit in memory.", url:"https://doi.org/10.1109/TPAMI.2010.57" },
  { type:"RAG · 2020", title:"Lewis et al. — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", note:"Language models that look things up first.", url:"https://arxiv.org/abs/2005.11401" },
  { type:"COURSE · FREE", title:"CMU 15-445 — Database Systems (Andy Pavlo)", note:"Lectures on storage, indexes, query optimisation and transactions.", url:"https://15445.courses.cs.cmu.edu/" }
];

/* ------------------------------------------------------------- LAB 1: SQL */
const TABLES = {
  pioneers:{ cols:["name", "born", "country", "domain"], rows:[
    ["Turing", 1912, "Britain", "found"], ["Hopper", 1906, "USA", "lang"], ["Shannon", 1916, "USA", "info"], ["Codd", 1923, "Britain", "data"],
    ["McCarthy", 1927, "USA", "ai"], ["Hinton", 1947, "Britain", "ml"], ["LeCun", 1960, "France", "ml"], ["Bengio", 1964, "France", "ml"],
    ["Knuth", 1938, "USA", "algo"], ["Hassabis", 1976, "Britain", "ml"], ["FeiFeiLi", 1976, "USA", "ml"], ["Dijkstra", 1930, "Netherlands", "algo"] ] },
  awards:{ cols:["name", "award", "year"], rows:[
    ["McCarthy", "Turing Award", 1971], ["Dijkstra", "Turing Award", 1972], ["Knuth", "Turing Award", 1974], ["Codd", "Turing Award", 1981],
    ["Hinton", "Turing Award", 2018], ["LeCun", "Turing Award", 2018], ["Bengio", "Turing Award", 2018], ["Hinton", "Nobel Prize", 2024], ["Hassabis", "Nobel Prize", 2024] ] }
};
function runSQL(src) {
  const s = src.trim().replace(/;$/, ""), m = s.match(/^select\s+(.+?)\s+from\s+(\w+)(?:\s+(?:as\s+)?(\w+))?(?:\s+join\s+(\w+)(?:\s+(?:as\s+)?(\w+))?\s+on\s+([\w.]+)\s*=\s*([\w.]+))?(?:\s+where\s+(.+?))?(?:\s+group\s+by\s+([\w.]+))?(?:\s+order\s+by\s+([\w.()*]+)(\s+desc|\s+asc)?)?(?:\s+limit\s+(\d+))?$/i);
  if (!m) throw new Error("couldn't parse. Form: SELECT cols FROM t [JOIN t2 ON a.x = b.y] [WHERE …] [GROUP BY col] [ORDER BY col [DESC]] [LIMIT n]");
  const [, sel, t1, a1, t2, a2, on1, on2, where, group, order, dir, limit] = m;
  const T1 = TABLES[t1.toLowerCase()]; if (!T1) throw new Error(`no table '${t1}' (tables: pioneers, awards)`);
  const n1 = (a1 || t1).toLowerCase();
  let rows = T1.rows.map(r => Object.fromEntries(T1.cols.flatMap((c, i) => [[c, r[i]], [n1 + "." + c, r[i]]])));
  const plan = [`scan ${t1} (${rows.length} rows)`];
  if (t2) { const T2 = TABLES[t2.toLowerCase()]; if (!T2) throw new Error(`no table '${t2}'`); const n2 = (a2 || t2).toLowerCase(), joined = [];
    const right = T2.rows.map(r => Object.fromEntries(T2.cols.flatMap((c, i) => [[n2 + "." + c, r[i]], [c, r[i]]])));
    for (const L of rows) for (const R of right) { const row = { ...R, ...L, ...Object.fromEntries(Object.entries(R).filter(([k]) => k.includes("."))) }; if (String(row[on1.toLowerCase()]) === String(row[on2.toLowerCase()])) joined.push(row); }
    rows = joined; plan.push(`join ${t2} on ${on1} = ${on2} → ${rows.length} rows`); }
  const val = (row, tok) => { tok = tok.trim(); if (/^'.*'$/.test(tok)) return tok.slice(1, -1); if (/^-?\d+(\.\d+)?$/.test(tok)) return +tok; const k = tok.toLowerCase(); if (!(k in row)) throw new Error(`unknown column '${tok}'`); return row[k]; };
  if (where) { const conds = where.split(/\s+and\s+/i); rows = rows.filter(r => conds.every(c => { const mm = c.match(/^(.+?)\s*(<=|>=|!=|<>|=|<|>|like)\s*(.+)$/i); if (!mm) throw new Error(`bad condition '${c}'`);
      const a = val(r, mm[1]), b = val(r, mm[3]), op = mm[2].toLowerCase();
      return op === "=" ? a == b : op === "!=" || op === "<>" ? a != b : op === "<" ? a < b : op === ">" ? a > b : op === "<=" ? a <= b : op === ">=" ? a >= b : new RegExp("^" + String(b).replace(/%/g, ".*") + "$", "i").test(String(a)); }));
    plan.push(`filter ${where} → ${rows.length} rows`); }
  let cols = sel.split(",").map(c => c.trim());
  if (group) { const g = {}; rows.forEach(r => { const k = val(r, group); (g[k] = g[k] || []).push(r); });
    rows = Object.entries(g).map(([k, rs]) => ({ [group.toLowerCase()]:isNaN(+k) ? k : +k, "count(*)":rs.length })); plan.push(`group by ${group} → ${rows.length} groups`); }
  if (order) { const k = order.toLowerCase(), d = dir && /desc/i.test(dir) ? -1 : 1; rows.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d); plan.push(`sort by ${order}${d < 0 ? " desc" : ""}`); }
  if (limit) { rows = rows.slice(0, +limit); plan.push(`limit ${limit}`); }
  if (cols.length === 1 && cols[0] === "*") cols = t2 ? Object.keys(rows[0] || {}).filter(k => k.includes(".")) : T1.cols;
  const out = rows.map(r => cols.map(c => { const k = c.toLowerCase(); if (!(k in r)) throw new Error(`unknown column '${c}'`); return r[k]; }));
  return { cols, out, plan };
}
const QUERIES = [
  "SELECT name, born FROM pioneers WHERE country = 'Britain' ORDER BY born",
  "SELECT p.name, a.award, a.year FROM pioneers p JOIN awards a ON p.name = a.name ORDER BY a.year",
  "SELECT domain, COUNT(*) FROM pioneers GROUP BY domain ORDER BY count(*) DESC",
  "SELECT p.name, p.born FROM pioneers p JOIN awards a ON p.name = a.name WHERE a.award = 'Nobel Prize'",
  "SELECT name FROM pioneers WHERE born > 1950 AND country != 'USA'"
];
const sqlLab = {
  kicker:"SQL · SAY WHAT, NOT HOW", title:"Query two tables of pioneers and awards",
  intro:`Two tables: pioneers(name, born, country, domain) and awards(name, award, year). Run the examples or write your own SQL. Below each result is the plan the engine followed: scan, join, filter, group, sort. You describe the answer; the engine decides the steps.`,
  html:`<div class="gk-chips" data-role="pre">${QUERIES.map((qq, i) => `<button class="gk-chip${i === 1 ? " on" : ""}" data-i="${i}">${["British pioneers", "join: who won what", "group by domain", "Nobel winners", "born after 1950, not USA"][i]}</button>`).join("")}</div>
    <textarea class="gk-input" data-role="sql" rows="3" spellcheck="false" style="width:100%;font-family:'IBM Plex Mono',monospace;resize:vertical"></textarea>
    <div class="it-lab-actions"><button class="it-send" data-a="run">▶ run query</button></div>
    <div style="overflow-x:auto"><table class="gk-table" data-role="res"></table></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`A real database would use a B-tree index to find rows without scanning, and its optimiser would compare several join strategies by estimated cost. The query you write wouldn't change at all: that is data independence.`,
  init(root) {
    const q = s => root.querySelector(s);
    function run() { try { const { cols, out, plan } = runSQL(q('[data-role="sql"]').value);
        q('[data-role="res"]').innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>` + out.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join("")}</tr>`).join("");
        q('[data-role="out"]').innerHTML = `<span class="g">${out.length} row(s)</span>\n<span class="d">plan: ${plan.join(" → ")}</span>`; }
      catch (e) { q('[data-role="res"]').innerHTML = ""; q('[data-role="out"]').innerHTML = `<span class="r">${e.message}</span>`; } }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="sql"]').value = QUERIES[+b.dataset.i]; root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); run(); }));
    q('[data-a="run"]').addEventListener("click", run); q('[data-role="sql"]').value = QUERIES[1]; run();
  }
};

/* ------------------------------------------------------- LAB 2: lost update */
const txLab = {
  kicker:"TRANSACTIONS · THE LOST UPDATE", title:"Two deposits at the same moment",
  intro:`An account holds £100. Two cash machines each deposit £50 at the same time. Each one reads the balance, adds 50 and writes it back. Step through the interleaving without isolation and one deposit vanishes. Turn on locking and the second machine must wait, so both deposits count.`,
  html:`<div class="it-lab-actions"><label class="it-check"><input type="checkbox" data-role="lock"> transactions with locking</label><button class="it-send" data-a="step">next step</button><button class="gk-ghost" data-a="reset">reset</button></div>
    <table class="gk-table" data-role="tab"></table>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Real databases offer several isolation levels, trading safety for speed. Even with isolation, the 'read, add, write' pattern should be a single atomic statement (UPDATE accounts SET balance = balance + 50) so the database can do it safely.`,
  init(root) {
    const q = s => root.querySelector(s); let k = 0, steps = [];
    function build() {
      const lock = q('[data-role="lock"]').checked;
      steps = lock ? [["A", "lock account", null], ["B", "wants the lock: waits", null], ["A", "read balance", "readA"], ["A", "write read + 50", "writeA"], ["A", "commit, release lock", null], ["B", "gets the lock", null], ["B", "read balance", "readB"], ["B", "write read + 50", "writeB"], ["B", "commit, release lock", null]]
        : [["A", "read balance", "readA"], ["B", "read balance", "readB"], ["A", "write read + 50", "writeA"], ["B", "write read + 50", "writeB"]];
    }
    function draw() {
      let bal = 100, rA = null, rB = null;
      const rows = steps.slice(0, k).map(([who, what, op]) => { if (op === "readA") rA = bal; if (op === "readB") rB = bal; if (op === "writeA") bal = rA + 50; if (op === "writeB") bal = rB + 50; return [who, what, bal, who === "A" ? rA : rB]; });
      q('[data-role="tab"]').innerHTML = `<tr><th>step</th><th>machine A</th><th>machine B</th><th>its local copy</th><th>balance in database</th></tr>` +
        rows.map(([who, what, b, loc], i) => `<tr><td>${i + 1}</td><td class="tl">${who === "A" ? what : ""}</td><td class="tl">${who === "B" ? what : ""}</td><td>${loc === null ? "" : "£" + loc}</td><td class="${i === rows.length - 1 ? "hl" : ""}">£${b}</td></tr>`).join("");
      const done = k >= steps.length;
      q('[data-role="out"]').innerHTML = done ? (bal === 200 ? `<span class="t">final balance £${bal}: both deposits counted ✓</span>` : `<span class="r">final balance £${bal}: £50 vanished. B overwrote A's update with a stale value.</span>`) : `step ${k} of ${steps.length}`;
    }
    q('[data-a="step"]').addEventListener("click", () => { if (k < steps.length) k++; draw(); });
    q('[data-a="reset"]').addEventListener("click", () => { k = 0; build(); draw(); });
    q('[data-role="lock"]').addEventListener("change", () => { k = 0; build(); draw(); });
    build(); draw();
  }
};

/* ------------------------------------------------------ LAB 3: vector search */
const vecLab = {
  kicker:"VECTOR DATABASES · APPROXIMATE NEAREST NEIGHBOURS", title:"Exact search versus an IVF index",
  intro:`2,000 stored 'embeddings' (2-D here, so you can see them). Click anywhere to query. Exact search computes the distance to every vector. The IVF index first clusters the vectors into 24 lists with k-means, then searches only the nprobe lists whose centres are nearest to the query. Compare the work done and the recall (how many of the true 5 nearest it found).`,
  html:`<div class="it-control"><label><span>nprobe (lists searched)</span><output data-o="p">2</output></label><input type="range" data-i="p" min="1" max="24" step="1" value="2"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`With a billion vectors of 1,000 dimensions each, exact search is far too slow, so every production vector database uses an approximate index (IVF, HNSW graphs, product quantisation) and tunes this same recall-versus-speed dial.`,
  init(root) {
    const q = s => root.querySelector(s), cv = q('[data-role="cv"]'), r = rng(17), K = 24, NQ = 5;
    const centres0 = Array.from({ length:9 }, () => [r() * 2 - 1, r() * 2 - 1]);
    const V = Array.from({ length:2000 }, (_, i) => { const c = centres0[i % 9]; return [c[0] + gauss(r) * .18, c[1] + gauss(r) * .18]; });
    let C0 = V.slice(0, K).map(v => v.slice()), asg = [];
    for (let it = 0; it < 12; it++) { asg = V.map(v => { let b = 0, bd = Infinity; C0.forEach((c, j) => { const d = (v[0] - c[0]) ** 2 + (v[1] - c[1]) ** 2; if (d < bd) { bd = d; b = j; } }); return b; });
      C0 = C0.map((c, j) => { const m = V.filter((_, i) => asg[i] === j); return m.length ? [m.reduce((a, v) => a + v[0], 0) / m.length, m.reduce((a, v) => a + v[1], 0) / m.length] : c; }); }
    const lists = Array.from({ length:K }, (_, j) => V.map((v, i) => i).filter(i => asg[i] === j));
    let query = [0.2, 0.1];
    function draw() {
      const np = +q('[data-i="p"]').value; q('[data-o="p"]').textContent = np;
      const d2 = i => (V[i][0] - query[0]) ** 2 + (V[i][1] - query[1]) ** 2;
      const exact = V.map((v, i) => i).sort((a, b) => d2(a) - d2(b)).slice(0, NQ);
      const probe = C0.map((c, j) => [j, (c[0] - query[0]) ** 2 + (c[1] - query[1]) ** 2]).sort((a, b) => a[1] - b[1]).slice(0, np).map(x => x[0]);
      const cand = probe.flatMap(j => lists[j]), approx = cand.slice().sort((a, b) => d2(a) - d2(b)).slice(0, NQ), recall = approx.filter(i => exact.includes(i)).length;
      const { ctx, w:W, h:H } = canvas(cv, 230); ctx.clearRect(0, 0, W, H);
      const sx = x => (x + 1.6) / 3.2 * W, sy = y => (1 - (y + 1.6) / 3.2) * H, inProbe = new Set(cand);
      V.forEach((v, i) => { ctx.fillStyle = inProbe.has(i) ? "rgba(63,208,201,.55)" : "rgba(232,228,244,.18)"; ctx.fillRect(sx(v[0]) - 1, sy(v[1]) - 1, 2, 2); });
      C0.forEach((c, j) => { ctx.strokeStyle = probe.includes(j) ? C.teal : "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.arc(sx(c[0]), sy(c[1]), 4, 0, 7); ctx.stroke(); });
      exact.forEach(i => { ctx.strokeStyle = C.gold; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx(V[i][0]), sy(V[i][1]), 5, 0, 7); ctx.stroke(); });
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(sx(query[0]), sy(query[1]), 5, 0, 7); ctx.fill();
      q('[data-role="out"]').innerHTML = `exact search: <span class="r">2,000</span> distance computations\nIVF (nprobe ${np}): <span class="t">${K + cand.length}</span> computations (${K} centres + ${cand.length} vectors), ${(2000 / (K + cand.length)).toFixed(1)}× less work\nrecall@${NQ}: <span class="${recall === NQ ? "g" : "r"}">${recall}/${NQ}</span> of the true nearest neighbours found\n<span class="d">gold rings: true 5 nearest · teal: vectors in the probed lists</span>`;
    }
    cv.addEventListener("click", e => { const b = cv.getBoundingClientRect(); query = [(e.clientX - b.left) / b.width * 3.2 - 1.6, 1.6 - (e.clientY - b.top) / b.height * 3.2]; draw(); });
    q('[data-i="p"]').addEventListener("input", draw); draw();
  }
};

register("databases", {
  kicker:"DATABASES · 1966–NOW · ABOUT 40 MIN",
  hook:"IBM was slow to build a product on its own researcher's idea, because it threatened a bestseller. The idea, data as simple tables queried by describing what you want, now runs inside every phone, bank and website.",
  intro:`A database keeps data correct and findable while thousands of people use it at once. Codd's relational model and SQL made querying declarative; transactions kept simultaneous updates from corrupting each other; and vector databases now give language models a searchable memory. Three labs below: run SQL over tables of pioneers, watch a deposit vanish without transactions, and trade recall for speed in a vector index.`,
  timeline:[[1966, "IMS for Apollo"], [1970, "relational model"], [1974, "SQL"], [1983, "ACID named"], [2017, "FAISS"], [2020, "RAG"]],
  labs:[sqlLab, txLab, vecLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, write a query that lists every Turing Award winner born before 1935. (Hint: JOIN, then WHERE with AND.)",
    "Still in Lab 1, count pioneers per country with GROUP BY country.",
    "In Lab 2, step through without locking and find the exact step where the £50 is lost. Then switch locking on.",
    "In Lab 3, click near a cluster boundary with nprobe = 1: recall often drops, because some true neighbours sit in a list that wasn't searched. Raise nprobe until recall is 5/5.",
    "Connect Lab 3 to the Classical ML guide: an IVF index is k-means (for building) plus k-nearest-neighbours (for searching)."
  ],
  sources:SOURCES
});
})();
