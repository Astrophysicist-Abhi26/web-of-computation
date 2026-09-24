// OPERATING & DISTRIBUTED SYSTEMS — Unix's small composable tools, how an OS
// shares one processor among many programs, Linux and git, and MapReduce's
// thousand-machine word count. Three real labs: a Unix shell with working
// pipes, a CPU scheduler comparing policies on a Gantt chart, and MapReduce
// with a worker you can crash.
(function () {
"use strict";
const { register, canvas, rng, C } = GuideKit;

const CHAPTERS = [
  { icon:"🐚", title:"1969 — Unix: small tools that do one thing well",
    who:"Ken Thompson & Dennis Ritchie · Bell Labs",
    lead:"After Bell Labs pulled out of the ambitious Multics project, two researchers built a small, elegant operating system on a cast-off minicomputer. Its ideas outlived every machine it ran on.",
    formula:"cat log.txt | grep error | sort | uniq -c | sort -rn | head      — programs composed like functions",
    what:`Unix treated everything as a file (disks, devices, even processes), kept programs small, and connected them
      with pipes: the output of one becomes the input of the next. A handful of tools combine to answer questions
      none of them was designed for. Lab 1 is a working Unix pipeline.`,
    how:`Rewriting Unix in C (1973) made it portable: move the compiler to a new machine and the whole system
      follows. Pipes, proposed by Doug McIlroy and added in 1973, made composition the heart of the design.`,
    story:`Thompson wrote the first version on a little-used PDP-7 in about a month in 1969, partly to run a game
      he had written, Space Travel. Because AT&T could not sell software at the time, it licensed Unix cheaply to
      universities, and a generation of programmers learned on it.`,
    today:`macOS and iOS are certified Unix descendants; Linux and Android follow its design. The pipe idea lives on
      in data pipelines and in the way AI agents chain tools.` },
  { icon:"⏱", title:"Sharing one processor — scheduling and time-sharing",
    who:"Fernando Corbató (CTSS) 1961 · Multics · every OS since",
    lead:"A processor can run only one program at a time, yet your computer seems to run hundreds. The scheduler switches between them so fast you never notice.",
    formula:"average waiting time depends on the order: shortest job first minimises it; round-robin keeps everyone responsive",
    what:`The scheduler decides which ready program runs next and for how long. First-come-first-served is simple
      but a long job blocks everyone behind it. Shortest-job-first minimises average waiting. Round-robin gives
      each program a short time slice in turn, so interactive programs feel instant. Compare them in Lab 2.`,
    how:`Time-sharing, pioneered by Corbató's CTSS at MIT (1961), let many users share one expensive mainframe as
      if each had their own. Modern schedulers juggle priorities, many cores and energy use.`,
    story:`Corbató received the 1990 Turing Award for time-sharing and Multics. He is also credited with the first
      computer passwords, introduced on CTSS so users' files stayed separate.`,
    today:`Your phone's scheduler balances responsiveness against battery life; cloud schedulers such as Kubernetes
      and Google's Borg place millions of jobs across data centres, the same problem at planetary scale.` },
  { icon:"🐧", title:"1991 — Linux and, in 2005, git",
    who:"Linus Torvalds",
    lead:"A Finnish student posted that he was writing a free operating system 'just a hobby, won't be big and professional'. It became the operating system of the internet. Fourteen years later he wrote git in about two weeks.",
    formula:"commit id = SHA-1 hash of (content + parent ids + metadata)      — history as a hash-linked graph",
    what:`Linux is a Unix-like kernel developed openly by thousands of contributors. Git stores every version of a
      project as snapshots identified by cryptographic hashes, each pointing to its parents, so history can't be
      changed silently and branches are cheap.`,
    how:`Linux's open model (anyone can read the code, patches reviewed in public) produced a kernel robust enough to
      run most of the world's servers. Git's design came from a crisis: the proprietary tool the kernel used,
      BitKeeper, withdrew its free licence in 2005.`,
    story:`Torvalds's 1991 Usenet post ("just a hobby, won't be big and professional like gnu") is one of computing's
      most famous understatements.`,
    today:`Linux runs nearly all servers, all of the top 500 supercomputers, and Android. Git (and GitHub) is how
      most software, including this map, is built and shared.` },
  { icon:"🗺", title:"2004 — MapReduce: a thousand machines, one simple program",
    who:"Jeffrey Dean & Sanjay Ghemawat · Google",
    lead:"Google needed to process the whole web. Dean and Ghemawat found that many big jobs fit one pattern: map each record to key–value pairs, group by key, and reduce each group.",
    formula:"map(document) → (word, 1) pairs  ·  shuffle: group by word  ·  reduce(word, [1,1,1…]) → (word, count)",
    what:`With MapReduce, a programmer writes just two small functions. The system splits the input across thousands
      of machines, runs the maps in parallel, moves each key's values to one place (the shuffle) and runs the
      reduces. Lab 3 counts words across three workers.`,
    how:`With thousands of cheap machines, some always fail. MapReduce simply re-runs the failed pieces elsewhere,
      which works because map and reduce have no side effects. Crash a worker in Lab 3 to see it.`,
    story:`The 2004 paper (and the open-source copy, Hadoop) launched the "big data" era. Spark (2010) replaced it
      for many uses by keeping data in memory between steps.`,
    today:`Training a large model is also a distributed systems problem: splitting data and model across thousands
      of GPUs, recovering from failures, and synchronising gradients. Dean, MapReduce's co-author, went on to
      co-found Google Brain.` },
  { icon:"🌐", title:"Distributed systems — agreeing when machines fail",
    who:"Lamport (clocks) 1978 · Fischer, Lynch & Paterson 1985 · Paxos 1998 · Raft 2014",
    lead:"When a system spans many machines, messages are delayed, lost or duplicated and machines crash. Getting them to agree on anything turns out to be deeply hard.",
    formula:"FLP (1985): no deterministic protocol can guarantee agreement if even one process may crash, in a fully asynchronous network",
    what:`Leslie Lamport showed in 1978 how to order events without a shared clock. Consensus protocols (Paxos, Raft)
      let a group of machines agree on a sequence of decisions as long as a majority are working. The FLP
      theorem proved that no protocol can do this perfectly in every circumstance.`,
    how:`Practical systems work around FLP with timeouts and randomness. The CAP theorem (Brewer, 2000) states a
      related trade-off: during a network split, a system must choose between consistency and availability.`,
    story:`Lamport first presented Paxos as the parliament of a fictional Greek island; reviewers found it confusing
      and it took years to be widely understood. Raft (2014) was designed specifically to be easier to learn.`,
    today:`Consensus protocols keep cloud databases, configuration systems and blockchains consistent. Lamport
      received the 2013 Turing Award.` }
];

const SOURCES = [
  { type:"UNIX · 1974", title:"Ritchie & Thompson — The UNIX Time-Sharing System", note:"CACM 17(7). The paper that introduced Unix to the world.", url:"https://doi.org/10.1145/361011.361061" },
  { type:"TIME-SHARING · 1962", title:"Corbató, Merwin-Daggett & Daley — An Experimental Time-Sharing System", note:"CTSS: many users, one computer.", url:"https://doi.org/10.1145/1460833.1460871" },
  { type:"THE TEXTBOOK · FREE", title:"Arpaci-Dusseau & Arpaci-Dusseau — Operating Systems: Three Easy Pieces", note:"Scheduling, memory and file systems, free online.", url:"https://pages.cs.wisc.edu/~remzi/OSTEP/" },
  { type:"LINUX · 1991", title:"Linus Torvalds — the first Linux announcement on comp.os.minix", note:"'Just a hobby, won't be big and professional.'", url:"https://groups.google.com/g/comp.os.minix/c/dlNtH7RRrGA/m/SwRavCzVE7gJ" },
  { type:"GIT · BOOK · FREE", title:"Chacon & Straub — Pro Git", note:"How git stores history as a hash-linked graph.", url:"https://git-scm.com/book/en/v2" },
  { type:"MAPREDUCE · 2004", title:"Dean & Ghemawat — MapReduce: Simplified Data Processing on Large Clusters", note:"The big-data engine (CACM version 2008).", url:"https://doi.org/10.1145/1327452.1327492" },
  { type:"TIME & ORDER · 1978", title:"Leslie Lamport — Time, Clocks, and the Ordering of Events in a Distributed System", note:"CACM 21(7). One of the most cited papers in computing.", url:"https://doi.org/10.1145/359545.359563" },
  { type:"RAFT · 2014", title:"Ongaro & Ousterhout — In Search of an Understandable Consensus Algorithm", note:"Consensus designed to be learnable.", url:"https://raft.github.io/raft.pdf" }
];

/* -------------------------------------------------------- LAB 1: the shell */
const FILES = {
  "access.log":`10:01 GET /index.html 200 alice
10:02 GET /map.js 200 bob
10:02 POST /login 401 carol
10:03 GET /index.html 200 carol
10:04 GET /missing.png 404 alice
10:05 POST /login 200 carol
10:05 GET /index.html 200 dave
10:06 GET /atoms.js 500 bob
10:07 GET /index.html 200 alice
10:08 GET /missing.png 404 dave
10:09 GET /map.js 200 erin
10:10 POST /login 401 erin`,
  "pioneers.txt":`turing 1912 britain\nhopper 1906 usa\nshannon 1916 usa\nlovelace 1815 britain\nhinton 1947 britain\nlecun 1960 france\nbengio 1964 france\nfeifeili 1976 usa\nhassabis 1976 britain\nkarpathy 1986 slovakia`
};
function sh(cmdline) {
  const stages = cmdline.split("|").map(s => s.trim()).filter(Boolean); let lines = null; const log = [];
  for (const st of stages) {
    const [cmd, ...args] = st.split(/\s+/), flags = args.filter(a => a.startsWith("-")), pos = args.filter(a => !a.startsWith("-"));
    const need = () => { if (lines === null) throw new Error(`${cmd}: no input`); };
    switch (cmd) {
      case "cat": if (!FILES[pos[0]]) throw new Error(`cat: ${pos[0] || "?"}: no such file (try ls)`); lines = FILES[pos[0]].split("\n"); break;
      case "ls": lines = Object.keys(FILES); break;
      case "grep": { const f = pos.length > 1 && FILES[pos[1]] ? FILES[pos[1]].split("\n") : (need(), lines); const re = new RegExp(pos[0].replace(/^["']|["']$/g, ""), flags.includes("-i") ? "i" : ""); lines = f.filter(l => flags.includes("-v") ? !re.test(l) : re.test(l)); break; }
      case "sort": need(); { const k = flags.find(f => /^-k\d/.test(f)), col = k ? +k.slice(2) - 1 : -1, num = flags.some(f => f.includes("n")), rev = flags.some(f => f.includes("r"));
        const key = l => col >= 0 ? (l.split(/\s+/)[col] || "") : l.trim(); lines = lines.slice().sort((a, b) => num ? parseFloat(key(a)) - parseFloat(key(b)) : key(a).localeCompare(key(b))); if (rev) lines.reverse(); } break;
      case "uniq": need(); { const out = []; for (const l of lines) { const last = out[out.length - 1]; if (last && last[0] === l) last[1]++; else out.push([l, 1]); } lines = flags.includes("-c") ? out.map(([l, n]) => `${String(n).padStart(4)} ${l}`) : out.map(([l]) => l); } break;
      case "wc": need(); lines = [flags.includes("-l") ? String(lines.length) : `${lines.length} lines, ${lines.join(" ").split(/\s+/).filter(Boolean).length} words`]; break;
      case "head": need(); lines = lines.slice(0, +(flags.find(f => /^-\d+/.test(f)) || "-10").slice(1)); break;
      case "tail": need(); lines = lines.slice(-(+(flags.find(f => /^-\d+/.test(f)) || "-10").slice(1))); break;
      case "cut": need(); { const fl = flags.find(f => f.startsWith("-f")); const cols = fl ? fl.slice(2).split(",").map(n => +n - 1) : [0]; lines = lines.map(l => cols.map(c => l.split(/\s+/)[c] || "").join(" ")); } break;
      case "tr": need(); { const [a, b] = pos.map(s => s.replace(/^["']|["']$/g, "")); lines = lines.map(l => a === "a-z" && b === "A-Z" ? l.toUpperCase() : a === "A-Z" && b === "a-z" ? l.toLowerCase() : l.split(a).join(b)); } break;
      default: throw new Error(`${cmd}: command not found (try cat, ls, grep, sort, uniq, wc, head, tail, cut, tr)`);
    }
    log.push(`${st.padEnd(22)} → ${lines.length} line(s)`);
  }
  return { lines, log };
}
const PIPES = ["cat access.log | grep 404", "cat access.log | cut -f5 | sort | uniq -c | sort -rn", "cat access.log | grep POST | grep 401 | wc -l", "cat access.log | cut -f3 | sort | uniq -c | sort -rn | head -3", "cat pioneers.txt | sort -k2 -n | head -3", "cat pioneers.txt | cut -f3 | sort | uniq -c"];
const shellLab = {
  kicker:"UNIX PIPES · COMPOSE SMALL TOOLS", title:"Answer questions by chaining tiny programs",
  intro:`Two files are available: access.log (a web server log) and pioneers.txt. Each command reads lines and writes lines; | pipes one into the next. Try the examples, then write your own: which user caused the most errors? Which page was requested most? Supported: cat, ls, grep (-v, -i), sort (-n, -r, -k2), uniq (-c), wc (-l), head, tail, cut (-f2), tr.`,
  html:`<div class="gk-chips" data-role="pre">${PIPES.map(p => `<button class="gk-chip">${p}</button>`).join("")}</div>
    <div class="gk-row"><span class="gk-pill">$</span><input class="gk-input" data-role="cmd" value="cat access.log | cut -f5 | sort | uniq -c | sort -rn" spellcheck="false"><button class="it-send" data-a="run">run</button></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Doug McIlroy summarised the Unix philosophy: write programs that do one thing and do it well; write programs to work together; write programs to handle text streams, because that is a universal interface.`,
  init(root) {
    const q = s => root.querySelector(s);
    function run() { try { const { lines, log } = sh(q('[data-role="cmd"]').value); q('[data-role="out"]').innerHTML = lines.map(l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;")).join("\n") + `\n\n<span class="d">${log.join("\n")}</span>`; }
      catch (e) { q('[data-role="out"]').innerHTML = `<span class="r">${e.message}</span>`; } }
    root.querySelectorAll('[data-role="pre"] .gk-chip').forEach(b => b.addEventListener("click", () => { q('[data-role="cmd"]').value = b.textContent; run(); }));
    q('[data-a="run"]').addEventListener("click", run); q('[data-role="cmd"]').addEventListener("keydown", e => { if (e.key === "Enter") run(); }); run();
  }
};

/* ------------------------------------------------------ LAB 2: scheduling */
const JOBS0 = [["A", 0, 8], ["B", 1, 4], ["C", 2, 9], ["D", 3, 2], ["E", 5, 3]];
function schedule(jobs, alg, q) {
  const J = jobs.map(([n, arr, burst]) => ({ n, arr, burst, left:burst, fin:null, start:null })), gantt = []; let t = 0, ready = [], done = 0, rrq = [];
  const admit = () => J.forEach(j => { if (j.arr <= t && !ready.includes(j) && j.left > 0 && !rrq.includes(j)) { ready.push(j); if (alg === "rr") rrq.push(j); } });
  while (done < J.length && t < 500) {
    admit();
    let j = null;
    if (alg === "fcfs") j = ready.filter(x => x.left > 0).sort((a, b) => a.arr - b.arr)[0];
    else if (alg === "sjf") j = ready.filter(x => x.left > 0).sort((a, b) => a.left - b.left || a.arr - b.arr)[0];
    else j = rrq.shift();
    if (!j) { t++; continue; }
    const run = alg === "rr" ? Math.min(q, j.left) : j.left;
    if (j.start === null) j.start = t;
    for (let k = 0; k < run; k++) { gantt.push(j.n); t++; if (alg === "rr") admit(); }
    j.left -= run;
    if (j.left === 0) { j.fin = t; done++; ready = ready.filter(x => x !== j); } else if (alg === "rr") rrq.push(j);
  }
  const wait = J.map(j => j.fin - j.arr - j.burst), resp = J.map(j => j.start - j.arr);
  return { gantt, J, avgWait:wait.reduce((a, b) => a + b, 0) / J.length, avgResp:resp.reduce((a, b) => a + b, 0) / J.length };
}
const schedLab = {
  kicker:"CPU SCHEDULING", title:"Five programs, one processor: who runs when?",
  intro:`Jobs A–E arrive at different times needing different amounts of CPU time. Compare three policies on the Gantt chart: first-come-first-served, shortest-job-first, and round-robin with a time slice you choose. Average waiting time measures efficiency; average response time (how long until a job first runs) measures how responsive the system feels.`,
  html:`<div class="gk-chips" data-role="alg"><button class="gk-chip on" data-v="fcfs">first come, first served</button><button class="gk-chip" data-v="sjf">shortest job first</button><button class="gk-chip" data-v="rr">round-robin</button></div>
    <div class="it-control"><label><span>round-robin time slice</span><output data-o="q">2</output></label><input type="range" data-i="q" min="1" max="8" step="1" value="2"></div>
    <canvas class="gk-canvas" data-role="cv"></canvas>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Shortest-job-first is provably optimal for average waiting time, but the OS rarely knows how long a job will take, and long jobs can starve. Round-robin trades some efficiency for fairness and responsiveness, which is what an interactive computer needs.`,
  init(root) {
    const q = s => root.querySelector(s); let alg = "fcfs"; const cols = { A:C.gold, B:C.teal, C:C.pink, D:C.violet, E:C.green };
    function draw() {
      const qq = +q('[data-i="q"]').value; q('[data-o="q"]').textContent = qq;
      const R = schedule(JOBS0, alg, qq), { ctx, w:W, h:H } = canvas(q('[data-role="cv"]'), 120); ctx.clearRect(0, 0, W, H);
      const T = R.gantt.length, cw = (W - 20) / T;
      R.gantt.forEach((n, i) => { ctx.fillStyle = cols[n]; ctx.fillRect(10 + i * cw, 30, cw - .5, 34); if (i === 0 || R.gantt[i - 1] !== n) { ctx.fillStyle = "#120b18"; ctx.font = "bold 11px IBM Plex Mono, monospace"; ctx.fillText(n, 10 + i * cw + 3, 52); } });
      ctx.fillStyle = C.dim; ctx.font = "9px IBM Plex Mono, monospace"; for (let t = 0; t <= T; t += 2) ctx.fillText(t, 10 + t * cw - 3, 80);
      JOBS0.forEach(([n, arr]) => { ctx.fillStyle = cols[n]; ctx.fillRect(10 + arr * cw - 1, 18, 2, 10); ctx.fillText(n, 10 + arr * cw - 3, 14); });
      ctx.fillStyle = C.dim; ctx.fillText("arrivals ↓", W - 60, 12); ctx.fillText("time →", W - 40, 96);
      q('[data-role="out"]').innerHTML = `jobs (arrival, CPU time): ${JOBS0.map(([n, a, b]) => `${n}(${a},${b})`).join("  ")}\naverage waiting time: <span class="g">${R.avgWait.toFixed(2)}</span>   ·   average response time: <span class="t">${R.avgResp.toFixed(2)}</span>\n<span class="d">finish times: ${R.J.map(j => `${j.n}=${j.fin}`).join("  ")}</span>`;
    }
    root.querySelectorAll('[data-role="alg"] .gk-chip').forEach(b => b.addEventListener("click", () => { alg = b.dataset.v; root.querySelectorAll('[data-role="alg"] .gk-chip').forEach(x => x.classList.toggle("on", x === b)); draw(); }));
    q('[data-i="q"]').addEventListener("input", draw); draw();
  }
};

/* ------------------------------------------------------- LAB 3: MapReduce */
const DOCS = ["the web of computation maps the history of computation", "turing asked whether machines can think", "machines learn from data and data grows", "the history of the web is the history of data", "can the map of the web think", "learn the history then learn the maps"];
const mrLab = {
  kicker:"MAPREDUCE · 2004", title:"Count words on three workers, and survive a crash",
  intro:`Six documents are split across three workers. Each map task emits (word, 1) for every word; the shuffle groups pairs by word; reduce tasks sum each group. Press run to step through the phases. Tick 'crash worker 2' and the master notices the failure and re-runs its map tasks on the survivors, and the final counts are unchanged.`,
  html:`<div class="it-lab-actions"><button class="it-send" data-a="run">▶ run the job</button><label class="it-check"><input type="checkbox" data-role="crash"> crash worker 2 during the map phase</label></div>
    <div class="gk-out" data-role="out"></div>`,
  caveat:`Re-running work is safe only because map and reduce have no side effects: running a map twice produces the same pairs. That design choice is what made computing on thousands of unreliable machines practical.`,
  init(root) {
    const q = s => root.querySelector(s); let timer = null;
    function run() {
      clearInterval(timer); const crash = q('[data-role="crash"]').checked, frames = [];
      const assign = DOCS.map((d, i) => i % 3); frames.push(`<span class="g">split</span>: ${DOCS.length} documents → workers 1–3\n` + DOCS.map((d, i) => `  doc ${i + 1} → worker ${assign[i] + 1}`).join("\n"));
      const pairs = []; let log = "";
      DOCS.forEach((d, i) => { const w = assign[i]; if (crash && w === 1) { log += `  worker 2: <span class="r">✗ crashed while mapping doc ${i + 1}</span>\n`; return; } d.split(" ").forEach(x => pairs.push([x, 1])); log += `  worker ${w + 1}: map(doc ${i + 1}) → ${d.split(" ").length} pairs\n`; });
      frames.push(`<span class="g">map</span>\n${log}`);
      if (crash) { let redo = ""; DOCS.forEach((d, i) => { if (assign[i] === 1) { const nw = i % 2 === 0 ? 1 : 3; d.split(" ").forEach(x => pairs.push([x, 1])); redo += `  master: re-running map(doc ${i + 1}) on worker ${nw} → ${d.split(" ").length} pairs\n`; } }); frames.push(`<span class="g">recover</span>: heartbeat from worker 2 missing\n${redo}`); }
      const groups = {}; pairs.forEach(([w, n]) => (groups[w] = groups[w] || []).push(n));
      frames.push(`<span class="g">shuffle</span>: ${pairs.length} pairs grouped into ${Object.keys(groups).length} keys, e.g.\n  "the" → [${groups.the.join(",")}]\n  "history" → [${groups.history.join(",")}]`);
      const counts = Object.entries(groups).map(([w, l]) => [w, l.reduce((a, b) => a + b, 0)]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      frames.push(`<span class="g">reduce</span>: sum each group\n` + counts.slice(0, 8).map(([w, n]) => `  ${w.padEnd(12)} <span class="t">${n}</span>`).join("\n") + `\n  <span class="d">… ${counts.length} distinct words in total${crash ? "; identical to a run without the crash" : ""}</span>`);
      let k = 0; q('[data-role="out"]').innerHTML = frames[0];
      timer = setInterval(() => { k++; q('[data-role="out"]').innerHTML = frames.slice(0, k + 1).join("\n\n"); if (k >= frames.length - 1) clearInterval(timer); }, 650);
    }
    q('[data-a="run"]').addEventListener("click", run); run();
  }
};

register("systems", {
  kicker:"OPERATING & DISTRIBUTED SYSTEMS · 1961–NOW · ABOUT 40 MIN",
  hook:"Unix began on a cast-off minicomputer in 1969, partly so its author could keep playing a space game. Its descendants now run in almost every phone, server and supercomputer on Earth.",
  intro:`An operating system shares one machine among many programs and many users; a distributed system makes many machines behave like one. From time-sharing and Unix's composable tools to Linux, git and MapReduce, these are the layers every AI system runs on. Three labs below: chain Unix tools with pipes, compare CPU schedulers, and run a MapReduce job through a machine failure.`,
  timeline:[[1961, "time-sharing (CTSS)"], [1969, "Unix"], [1978, "Lamport clocks"], [1991, "Linux"], [2004, "MapReduce"], [2005, "git"]],
  labs:[shellLab, schedLab, mrLab],
  chapters:CHAPTERS,
  challenges:[
    "In Lab 1, find which user got the most 404 errors: cat access.log | grep 404 | cut -f5 | sort | uniq -c | sort -rn.",
    "Still in Lab 1, count the countries in pioneers.txt, then list the three earliest-born pioneers.",
    "In Lab 2, compare the average waiting time of first-come-first-served and shortest-job-first. Then try round-robin with slices of 1 and 8 and watch response time change.",
    "In Lab 3, run with and without the crash and compare the final counts: fault tolerance by re-execution.",
    "Read the Unix paper (sources): its design ideas take up only a few pages, and nearly all of them are still in use."
  ],
  sources:SOURCES
});
})();
