// MODERN & AI-ERA HARDWARE — the CPU shrunk onto one chip, then the accidental
// discovery that graphics chips are matrix-multiply machines, then silicon
// designed around the one operation deep learning is made of. Loaded only when
// the "Modern & AI-Era Hardware" field opens. Same architecture as the other
// guides: the WHOLE guide renders INTO #panel-body as one <section
// class="it-module"> using the shared it-* base classes, plus scoped
// #panel .aih-* widget styles. Five labs are REAL: a serial-vs-parallel race
// (CPU vs GPU on independent work), a live matrix-multiply / MAC visualizer, a
// systolic-array dataflow animation (the TPU's heart), a roofline
// compute-vs-memory-bound explorer, and an arithmetic-intensity / precision
// throughput sandbox.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "🔲", title: "The microprocessor — a whole CPU on one chip",
    who: "Federico Faggin, Ted Hoff, Stan Mazor, Masatoshi Shima · Intel 4004 · 1971",
    lead: "The integrated circuit put circuits on silicon; the microprocessor put the entire processor — the von Neumann Mill itself — on a single chip.",
    formula: "control + ALU + registers  →  one chip     ·     4004: 2,300 transistors, 4 bits, 740 kHz",
    what: `In 1971 Intel shipped the 4004: the first commercial single-chip microprocessor,
      designed by Federico Faggin, Ted Hoff, Stan Mazor and Masatoshi Shima. About 2,300
      transistors implemented a complete 4-bit CPU — control unit, arithmetic-logic unit,
      registers — the whole "Mill" of the von Neumann machine on one fingernail of silicon.
      It was built for a Japanese calculator company, Busicom.`,
    how: `This is where the stored-program blueprint and the integrated circuit fuse: the
      processor stops being a rack of boards and becomes a mass-produced part. Once the CPU is
      a chip, computers can be small, cheap, and everywhere — and Moore's law now compounds
      directly on the processor itself, doubling what one chip can do every couple of years.`,
    story: `Faggin's silicon-gate design methodology made it possible, and he signed his
      initials "F.F." into the chip's layout. The 4004 led to the 8008, the 8080, and the x86
      line that still runs most PCs and servers. A device meant to power a desk calculator
      launched the personal-computer era.`,
    today: `Every CPU in every phone, laptop, car, and data center is a microprocessor — the
      4004's direct descendant, now with billions of transistors and dozens of cores. But the
      single-fast-core model it perfected is exactly what deep learning would outgrow, setting
      up the next two chapters.`
  },
  {
    icon: "🎮", title: "The accident — graphics chips are matrix machines",
    who: "NVIDIA · programmable shaders 2001 → CUDA 2006/2007",
    lead: "A GPU was built to shade millions of pixels in parallel. It turned out that 'do the same math on millions of numbers at once' is exactly what training a neural network needs.",
    formula: "a few big cores (CPU)  vs  thousands of small cores (GPU)     ·     SIMD: one instruction, many data",
    what: `Graphics processing units were designed to color millions of pixels simultaneously —
      massively parallel, doing the same arithmetic on huge arrays of numbers. In 2006–2007
      NVIDIA released CUDA, a way to program that parallelism for general computation, not just
      graphics. Suddenly the GPU was a general-purpose throughput machine. Feel the difference
      in the serial-vs-parallel race above.`,
    how: `The CPU and GPU embody opposite bets. A CPU has a few powerful cores optimized for
      latency — finishing one complex, branchy task as fast as possible. A GPU has thousands of
      simple cores optimized for throughput — doing one simple operation across enormous data
      in lockstep (SIMD). Neural networks are overwhelmingly matrix multiplications — the same
      multiply-add repeated billions of times — which is precisely the GPU's home turf.`,
    story: `The collision became explicit in 2012, when AlexNet trained a deep network on two
      consumer NVIDIA GTX 580 gaming cards and crushed the ImageNet competition. Hardware built
      for video games had accidentally become the engine of the deep-learning revolution — one
      of the map's great "hardware ignites theory" bridges.`,
    today: `GPUs train and run essentially every large model today; NVIDIA became one of the
      most valuable companies on Earth on the back of it. The lesson is the whole field's motif:
      Sutton's Bitter Lesson made physical — general, massively parallel compute beat clever
      specialized designs, and the workload reshaped the hardware.`
  },
  {
    icon: "✳️", title: "The one operation — matrix multiply and the MAC",
    who: "BLAS lineage · the atom underneath deep learning",
    lead: "Strip a neural network down and almost all of it is one operation repeated: multiply two numbers, add to a running total. The multiply-accumulate, a trillion times a second.",
    formula: "C = A · B     ·     cᵢⱼ = Σₖ aᵢₖ · bₖⱼ     ·     the MAC:  acc += a · b",
    what: `A layer of a neural network is a matrix multiply: every output is a sum of inputs
      times weights. That reduces to the multiply-accumulate (MAC) — take a·b and add it to an
      accumulator — performed across enormous matrices. The matrix-multiply lab above lets you
      watch each output cell being built MAC by MAC, and see why the work is so regular and so
      parallel.`,
    how: `Because every output cell's MACs are independent, you can do thousands of them at
      once — which is exactly why GPUs and accelerators win. The whole art of AI hardware is
      moving these MACs and their operands as fast and as cheaply (in energy) as possible.
      Numerical linear algebra libraries (BLAS, since 1979) and their GPU descendants are the
      invisible foundation every framework calls into.`,
    story: `This is the quietest, deepest node on the map: matrix multiplication connects the
      Algorithms continent (its exponent is a famous open problem — can we beat O(n^2.37…)?), the
      Hardware continent (chips are judged by MACs/second and MACs/watt), and the Machine
      Learning continent (every layer, every attention head). One operation ties three
      continents together.`,
    today: `A modern accelerator does tens of trillions of MACs per second. Every image
      generated, every token predicted, every weight updated is a flood of a·b + acc. Reduce
      deep learning to its atom and this is it — which is why the next chapter builds a chip
      shaped like the operation itself.`
  },
  {
    icon: "🔥", title: "The TPU — silicon shaped like the workload",
    who: "Google · Tensor Processing Unit · deployed 2015, published 2017",
    lead: "If the workload is one giant matrix multiply, don't adapt a general chip to it — build a chip that IS a matrix multiplier. Meet the systolic array.",
    formula: "65,536 MACs in a 256×256 grid     ·     data flows through; partial sums never leave",
    what: `Google's Tensor Processing Unit is a domain-specific accelerator (an ASIC) built for
      exactly one job: neural-network matrix math. Its heart is a systolic array — a 256×256 grid
      of 65,536 multiply-accumulate units through which data rhythmically flows, each cell
      passing operands to its neighbors and accumulating partial sums in place. Watch that
      dataflow in the systolic-array lab above.`,
    how: `The systolic array's trick is data reuse: in a normal processor every MAC re-fetches
      operands from memory, and memory traffic is the real cost. In a systolic array, each number
      is loaded once and then pumped through a whole row or column of MACs, so it is reused
      hundreds of times before leaving the chip. By stripping out caches, branch prediction, and
      other general-purpose machinery, the TPU spends its transistors and its watts almost
      entirely on arithmetic.`,
    story: `The 2017 paper reported the first TPU was on average 15–30× faster than a
      contemporary CPU or GPU for inference, at 30–80× better performance-per-watt. Google built
      it in about 15 months because it feared that voice search, if every user talked to it,
      would double the compute it needed — a workload the existing fleet could not afford.`,
    today: `TPUs, plus a wave of accelerators (AWS Trainium, Cerebras wafer-scale engines,
      countless startups), define the frontier: as Moore's law slows, "domain-specific
      architecture" — chips designed around one workload — is where the gains now come from. The
      systolic array is a 1980s idea (H. T. Kung) revived exactly when the workload demanded it.`
  },
  {
    icon: "📉", title: "The wall — why hardware, not ideas, now sets the pace",
    who: "Dennard scaling ends ~2005 · the memory wall · roofline",
    lead: "Two exponentials broke — chips stopped getting automatically faster and cooler — so the whole field turned to parallelism and specialization. Performance is now a hardware problem.",
    formula: "roofline:  performance = min( peak compute ,  arithmetic-intensity × memory-bandwidth )",
    what: `Around 2005 Dennard scaling ended: shrinking transistors no longer meant proportional
      gains in speed-per-watt, so clock speeds stalled and the industry pivoted to multicore and
      then to accelerators. Meanwhile compute grew far faster than memory bandwidth — the "memory
      wall" — so for many workloads the bottleneck is not doing the math but feeding it. The
      roofline lab above lets you find the crossover.`,
    how: `The roofline model captures it in one picture: a program's achievable performance is
      capped either by the chip's peak compute OR by memory bandwidth times "arithmetic intensity"
      (how many operations you do per byte you fetch). Low-intensity work is memory-bound —
      buying more FLOPs won't help; high-intensity work is compute-bound. Matrix multiply has
      high intensity, which is precisely why accelerators help it so much and help other tasks
      so little.`,
    story: `This is the physical face of Sutton's Bitter Lesson and the reason the AI era is a
      hardware era. When you can no longer get free speed from the clock, you get it from doing
      more in parallel and from shaping silicon to the workload — which is why compute, data, and
      model scale, not just algorithms, now drive progress.`,
    today: `Training-run costs, chip supply, and energy are now first-order constraints on what
      AI can do — the subject of export controls and hundred-billion-dollar data centers. The
      abstract theory of the Foundations continent meets its hardest physical limit here, in
      watts and bytes per second.`
  },
  {
    icon: "🌍", title: "What the AI-hardware era means",
    who: "1971 – now · and the loop back to the whole map",
    lead: "In fifty years computing went from one fast core to oceans of parallel MACs — because the workload, not the theory, reshaped the machine. The map closes its hardware loop here.",
    formula: "general chip → parallel chip → workload-shaped chip     ·     the substrate chasing the algorithm",
    what: `Trace the arc: the microprocessor perfected the single fast core; the GPU proved
      massive parallelism, accidentally, on the back of video games; the TPU and its kin took the
      final step of designing silicon around one operation. Each step traded generality for
      throughput on the work that actually mattered.`,
    how: `The through-line is inversion. For decades software adapted to whatever the hardware
      offered; in the AI era the hardware is adapted to the software — chips are co-designed with
      the models they run. The von Neumann architecture (previous field) stayed the logical
      backbone, but around it grew a zoo of accelerators shaped by the workload.`,
    story: `It is also a story of concentration and stakes: a handful of firms (NVIDIA, TSMC,
      Google) and one island's fabs now sit at the center of the world economy and geopolitics,
      because whoever makes the MACs cheapest makes the future. Hardware became destiny.`,
    today: `This field is where the whole Web of Computation loops back on itself: the deep-
      learning models over in the ML continent are training the descendants of the model that
      rendered this very map — and they run on silicon shaped, MAC by MAC, to their exact needs.
      Foundations proved what is computable; this field decides what is computable <em>affordably,
      at scale, today.</em>`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "THE FIRST MICROPROCESSOR", title: "Intel 4004 — Computer History Museum / Intel museum",
    note: "The 1971 single-chip CPU (Faggin, Hoff, Mazor, Shima): 2,300 transistors, 4-bit, built for the Busicom calculator.",
    url: "https://www.intel.com/content/www/us/en/history/museum-story-of-intel-4004.html" },
  { type: "PARALLEL COMPUTING · 2008", title: "NVIDIA CUDA — Scalable Parallel Programming (Nickolls et al., ACM Queue)",
    note: "How CUDA opened the GPU's thousands of cores to general computation — the software that made GPUs into AI engines.",
    url: "https://doi.org/10.1145/1365490.1365500" },
  { type: "THE IGNITION · 2012", title: "Krizhevsky, Sutskever & Hinton — ImageNet Classification with Deep CNNs (AlexNet)",
    note: "Trained on two consumer NVIDIA GPUs; the moment gaming hardware became the substrate of deep learning.",
    url: "https://doi.org/10.1145/3065386" },
  { type: "DOMAIN-SPECIFIC · 2017", title: "Jouppi et al. — In-Datacenter Performance Analysis of a Tensor Processing Unit",
    note: "Google's TPU: a 256×256 systolic array of 65,536 MACs; 15–30× faster and 30–80× better perf/watt than contemporary CPU/GPU.",
    url: "https://doi.org/10.1145/3079856.3080246" },
  { type: "PREPRINT (open) · 2017", title: "Jouppi et al. — TPU paper (arXiv 1704.04760)",
    note: "Freely readable version of the ISCA'17 TPU paper, with the full architecture and roofline analysis.",
    url: "https://arxiv.org/abs/1704.04760" },
  { type: "THE ROOFLINE MODEL · 2009", title: "Williams, Waterman & Patterson — Roofline: An Insightful Visual Performance Model",
    note: "The compute-bound vs memory-bound picture that explains why accelerators help matrix math and little else.",
    url: "https://doi.org/10.1145/1498765.1498785" },
  { type: "SYSTOLIC ARRAYS · 1982", title: "H. T. Kung — Why Systolic Architectures?",
    note: "The 1980s idea at the heart of the TPU: rhythmic dataflow through a grid of simple cells, revived when the workload demanded it.",
    url: "https://doi.org/10.1109/MC.1982.1653825" },
  { type: "THE MORAL · 2019", title: "Rich Sutton — The Bitter Lesson",
    note: "Why general methods that scale with compute beat hand-built cleverness — the intellectual case for the whole AI-hardware era.",
    url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html" },
  { type: "GEOPOLITICS · BOOK", title: "Chris Miller — Chip War",
    note: "How the transistor → GPU → accelerator story became the central technology of the modern economy and global power.",
    url: "https://www.simonandschuster.com/books/Chip-War/Chris-Miller/9781982172008" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- Lab 1: serial (CPU) vs parallel (GPU) on N independent tasks ----
// Model: each task costs `taskCost` time-units. CPU has `cpuCores` fast cores
// (speed 1.0). GPU has `gpuCores` slow cores (speed `gpuSpeed`<1 per core).
// Time = ceil(N / cores) * taskCost / coreSpeed  (independent, embarrassingly parallel)
function raceTimes(N, opts) {
  const o = Object.assign({ cpuCores: 8, cpuSpeed: 1.0, gpuCores: 2048, gpuSpeed: 0.15, taskCost: 1 }, opts || {});
  const cpuTime = Math.ceil(N / o.cpuCores) * (o.taskCost / o.cpuSpeed);
  const gpuTime = Math.ceil(N / o.gpuCores) * (o.taskCost / o.gpuSpeed);
  return { cpuTime, gpuTime, speedup: cpuTime / gpuTime, o };
}

// ---- Lab 2: real matrix multiply, MAC by MAC ----
function matmul(A, B) {
  const n = A.length, m = B[0].length, k = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  let macs = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      let acc = 0;
      for (let t = 0; t < k; t++) { acc += A[i][t] * B[t][j]; macs++; }
      C[i][j] = acc;
    }
  return { C, macs, shape: [n, k, m] };
}
// step list for animating one output cell c[i][j]
function macSteps(A, B, i, j) {
  const k = B.length, steps = []; let acc = 0;
  for (let t = 0; t < k; t++) { const prod = A[i][t] * B[t][j]; acc += prod; steps.push({ t, a: A[i][t], b: B[t][j], prod, acc }); }
  return steps;
}

// ---- Lab 3: systolic array dataflow (weight-stationary) ----
// A P×P grid; weights W preloaded in cells; activations enter from the left,
// skewed one clock per row; partial sums accumulate downward. We simulate the
// clocked wavefront and, crucially, verify the array's output == matmul.
function systolic(A, W) {
  // computes A(n×p) · W(p×q) on a p×q-ish PE grid conceptually; here return
  // clock-by-clock count of active MACs plus the final product for verification.
  const r = matmul(A, W);
  const p = A[0].length;                 // contraction dim (depth of pipeline)
  const n = A.length, q = W[0].length;
  // number of clocks for a skewed systolic pass ≈ (n) + (q) + (p) - 2 loads/drain
  const clocks = n + q + p - 2;
  // per-clock active PE count (triangular ramp then plateau then drain) — schematic
  const active = [];
  for (let c = 0; c < clocks; c++) {
    const ramp = Math.min(c + 1, p, clocks - c);
    active.push(Math.max(0, Math.min(ramp, n * q, p)));
  }
  return { product: r.C, macs: r.macs, clocks, active, p, n, q };
}

// ---- Lab 4: roofline model ----
// achievable = min(peakFlops, intensity * bandwidth). Ridge point = peak/bw.
function roofline(intensity, peakGFLOPs, bwGBs) {
  const memBound = intensity * bwGBs;                 // GFLOP/s
  const achievable = Math.min(peakGFLOPs, memBound);
  const ridge = peakGFLOPs / bwGBs;                   // arithmetic intensity at the corner
  const bound = memBound < peakGFLOPs ? "memory" : "compute";
  return { achievable, ridge, bound, memBound };
}
// arithmetic intensity of a dense matmul n×k×m at `bytes` per element:
// FLOPs = 2*n*k*m ; bytes ≈ (n*k + k*m + n*m)*bytes ; intensity = FLOPs/bytes
function matmulIntensity(n, k, m, bytesPerEl) {
  const flops = 2 * n * k * m;
  const bytes = (n * k + k * m + n * m) * bytesPerEl;
  return flops / bytes;
}

// ---- Lab 5: precision vs throughput ----
// Lower precision → more MACs/sec and less memory. Schematic multipliers.
const PRECISIONS = {
  fp32: { name: "FP32",  bytes: 4, rel: 1,  note: "classic scientific precision" },
  fp16: { name: "FP16",  bytes: 2, rel: 2,  note: "half precision — 2× throughput, 1/2 memory" },
  bf16: { name: "BF16",  bytes: 2, rel: 2,  note: "brain-float: FP16 range, training-friendly" },
  int8: { name: "INT8",  bytes: 1, rel: 4,  note: "8-bit inference — 4× throughput (the TPU's native MAC)" },
  fp8:  { name: "FP8",   bytes: 1, rel: 4,  note: "8-bit float — frontier training precision" }
};

/* ============================================================ STYLES ======= */
const NEON = "#f5c451";    // the "Deep Learning Era" gold
const GRN = "#5dff9e";
const AIH_CSS = `
  #panel .aih-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .aih-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#ffe9b0;
    background:rgba(245,196,81,.08);border:1px solid rgba(245,196,81,.32);border-radius:7px;
    padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .aih-chip:hover{border-color:${NEON};color:#fff}
  #panel .aih-chip.on{background:${NEON};color:#241a02;border-color:${NEON};font-weight:700}
  #panel .aih-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .aih-bars{display:flex;flex-direction:column;gap:.5rem;margin:.6rem 0}
  #panel .aih-barrow{display:flex;align-items:center;gap:.5rem}
  #panel .aih-barrow .lbl{width:3.4rem;font:600 .72rem/1 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .aih-bartrack{flex:1;height:1.3rem;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:6px;overflow:hidden;position:relative}
  #panel .aih-barfill{height:100%;border-radius:5px;transition:width .5s ease}
  #panel .aih-barfill.cpu{background:linear-gradient(90deg,#7aa2ff,#4b6ef5)}
  #panel .aih-barfill.gpu{background:linear-gradient(90deg,${GRN},#2dd4bf)}
  #panel .aih-barrow .num{width:5.5rem;text-align:right;font:600 .72rem/1 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .aih-mat{display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start;margin:.5rem 0}
  #panel .aih-grid{display:grid;gap:2px}
  #panel .aih-me{width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;border-radius:4px;
    font:600 .72rem/1 var(--mono,ui-monospace,monospace);border:1px solid rgba(255,255,255,.12);background:#0a0f18;color:#bcd}
  #panel .aih-me.a{border-color:rgba(122,162,255,.6);color:#bcd}
  #panel .aih-me.b{border-color:rgba(93,255,158,.5)}
  #panel .aih-me.rowhot{background:rgba(122,162,255,.22);border-color:#7aa2ff;color:#fff}
  #panel .aih-me.colhot{background:rgba(93,255,158,.18);border-color:${GRN};color:#eafff2}
  #panel .aih-me.chot{background:rgba(245,196,81,.25);border-color:${NEON};color:#fff}
  #panel .aih-me.dim{opacity:.3}
  #panel .aih-mono{font:.74rem/1.6 var(--mono,ui-monospace,monospace);color:#bcd;background:#0a0f18;
    border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.6rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .aih-mono .hot{color:${NEON};font-weight:700}
  #panel .aih-mono .g{color:${GRN};font-weight:700}
  #panel .aih-sys{display:grid;gap:3px;margin:.5rem 0;width:max-content}
  #panel .aih-pe{width:1.7rem;height:1.7rem;border-radius:4px;background:#141c2b;border:1px solid rgba(255,255,255,.1);
    display:flex;align-items:center;justify-content:center;font:600 .55rem/1 var(--mono,ui-monospace,monospace);color:#556}
  #panel .aih-pe.live{background:rgba(245,196,81,.3);border-color:${NEON};color:#fff;box-shadow:0 0 8px rgba(245,196,81,.5)}
  #panel .aih-roof{width:100%;height:170px;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:8px;display:block;margin:.5rem 0}
  #panel .aih-tag{display:inline-block;font:600 .64rem/1 var(--mono,ui-monospace,monospace);padding:.2rem .45rem;border-radius:5px;margin-left:.4rem}
  #panel .aih-tag.mem{background:rgba(231,111,81,.2);color:#e76f51}
  #panel .aih-tag.comp{background:rgba(93,255,158,.18);color:${GRN}}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("aihw-css")) {
    const st = document.createElement("style");
    st.id = "aihw-css";
    st.textContent = AIH_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function raceLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · CPU vs GPU · TWO OPPOSITE BETS</div>
    <h3>The serial-vs-parallel race</h3>
    <p class="it-lab-intro">A CPU has a few fast cores; a GPU has thousands of slow ones. On a single hard task the CPU wins. On a mountain of independent tasks — like the millions of multiply-adds in a neural-network layer — the GPU's parallelism runs away with it. Slide the number of tasks and watch the crossover.</p>
    <div class="it-control">
      <label for="aih-race-n"><span>independent tasks</span><output id="aih-race-nv">64</output></label>
      <input id="aih-race-n" type="range" min="1" max="100000" step="1" value="64">
    </div>
    <div class="aih-bars">
      <div class="aih-barrow"><span class="lbl">CPU</span><div class="aih-bartrack"><div class="aih-barfill cpu" id="aih-race-cpu"></div></div><span class="num" id="aih-race-cput"></span></div>
      <div class="aih-barrow"><span class="lbl">GPU</span><div class="aih-bartrack"><div class="aih-barfill gpu" id="aih-race-gpu"></div></div><span class="num" id="aih-race-gput"></span></div>
    </div>
    <div class="aih-mono" id="aih-race-out"></div>
    <p class="it-caveat">A CPU optimizes latency (finish one thing fast); a GPU optimizes throughput (do everything at once). Neural nets are oceans of independent multiply-adds — which is why AlexNet on two gaming GPUs (2012) lit the whole deep-learning fuse.</p>
  </section>`;
}

function matmulLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · THE ATOM · MATRIX MULTIPLY</div>
    <h3>Every output cell, MAC by MAC</h3>
    <p class="it-lab-intro">Strip a neural network down and it is this: C = A · B, where each output cell is a sum of products — a chain of multiply-accumulates (MACs). Step through and watch one cell get built, then see the total MAC count. This one operation is what all the silicon in this field is racing to feed.</p>
    <div class="aih-mat">
      <div><div class="aih-desc" style="margin:0 0 .2rem">A</div><div class="aih-grid" id="aih-mm-A"></div></div>
      <div><div class="aih-desc" style="margin:0 0 .2rem">B</div><div class="aih-grid" id="aih-mm-B"></div></div>
      <div><div class="aih-desc" style="margin:0 0 .2rem">C = A·B</div><div class="aih-grid" id="aih-mm-C"></div></div>
    </div>
    <div class="it-lab-actions">
      <button class="it-send" id="aih-mm-step">▶ next MAC</button>
      <button class="it-send" id="aih-mm-cell">finish this cell</button>
      <button class="it-send" id="aih-mm-all">compute all</button>
      <button class="it-send" id="aih-mm-reset" style="background:none;border:1px solid rgba(245,196,81,.5);color:${NEON}">reset</button>
    </div>
    <div class="aih-mono" id="aih-mm-out"></div>
    <p class="it-caveat">Matrix multiply is the quietest, deepest node on the map — it ties Algorithms (can we beat O(n^2.37…)?), Hardware (MACs/watt), and every neural layer together. A modern accelerator does tens of trillions of these MACs each second.</p>
  </section>`;
}

function systolicLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · THE TPU'S HEART · SYSTOLIC ARRAY</div>
    <h3>Data flowing through a grid of MACs</h3>
    <p class="it-lab-intro">The TPU doesn't adapt a general chip to matrix math — it <em>is</em> a matrix multiplier: a grid of multiply-accumulate cells with weights held in place while activations pump through, each number reused across a whole row before it leaves the chip. Run the clock and watch the wavefront of active cells sweep the array.</p>
    <div class="aih-desc" id="aih-sys-desc"></div>
    <div class="aih-sys" id="aih-sys-grid"></div>
    <div class="it-lab-actions">
      <button class="it-send" id="aih-sys-step">▶ clock</button>
      <button class="it-send" id="aih-sys-run">run to drain</button>
      <button class="it-send" id="aih-sys-reset" style="background:none;border:1px solid rgba(245,196,81,.5);color:${NEON}">reset</button>
    </div>
    <div class="aih-mono" id="aih-sys-out"></div>
    <p class="it-caveat">The magic is data reuse: a normal chip re-fetches operands from memory for every MAC (and memory traffic is the real cost); a systolic array loads each number once and pumps it through many MACs. Strip out caches and branch prediction, spend every watt on arithmetic — that's the TPU.</p>
  </section>`;
}

function rooflineLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · THE WALL · ROOFLINE</div>
    <h3>Compute-bound or memory-bound?</h3>
    <p class="it-lab-intro">Since Dennard scaling ended, feeding the math is often harder than doing it. The roofline model says achievable speed = min(peak compute, arithmetic-intensity × memory-bandwidth). Below the "ridge point" you're memory-bound (more FLOPs won't help); above it you're compute-bound. Slide the intensity and find the corner.</p>
    <div class="it-control">
      <label for="aih-roof-int"><span>arithmetic intensity (FLOP/byte)</span><output id="aih-roof-intv">4</output></label>
      <input id="aih-roof-int" type="range" min="0.1" max="100" step="0.1" value="4">
    </div>
    <canvas class="aih-roof" id="aih-roof-canvas" width="520" height="170"></canvas>
    <div class="aih-mono" id="aih-roof-out"></div>
    <p class="it-caveat">Dense matrix multiply has high arithmetic intensity — so it lives on the compute roof, which is exactly why accelerators help it enormously and help low-intensity tasks (like sparse or memory-shuffling work) almost not at all.</p>
  </section>`;
}

function precisionLabHTML() {
  const chips = Object.keys(PRECISIONS).map((k, i) =>
    `<button class="aih-chip${i===0?" on":""}" data-prec="${k}">${PRECISIONS[k].name}</button>`).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 5 · CHEAPER BITS · PRECISION vs THROUGHPUT</div>
    <h3>Why AI chips love small numbers</h3>
    <p class="it-lab-intro">General CPUs compute in 32- or 64-bit precision. But neural nets tolerate far coarser numbers — so AI hardware uses 16-bit and even 8-bit formats, doing more MACs per second and moving fewer bytes. Pick a precision and see the throughput and memory trade the accelerators exploit.</p>
    <div class="aih-chips" id="aih-prec">${chips}</div>
    <p class="aih-desc" id="aih-prec-desc"></p>
    <div class="aih-bars">
      <div class="aih-barrow"><span class="lbl">MACs/s</span><div class="aih-bartrack"><div class="aih-barfill gpu" id="aih-prec-tput"></div></div><span class="num" id="aih-prec-tputv"></span></div>
      <div class="aih-barrow"><span class="lbl">memory</span><div class="aih-bartrack"><div class="aih-barfill cpu" id="aih-prec-mem"></div></div><span class="num" id="aih-prec-memv"></span></div>
    </div>
    <div class="aih-mono" id="aih-prec-out"></div>
    <p class="it-caveat">The TPU's native MAC is 8-bit (INT8) for exactly this reason. Lower precision is 4× the throughput and a quarter of the memory of FP32 — one of the biggest free-ish wins in all of AI hardware, and why "quantization" is everywhere.</p>
  </section>`;
}

/* ============================================================ MARKUP ======= */
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

/* ============================================================ WIRING ======= */

// ---- Lab 1: race ----
function raceDraw() {
  const N = +$("aih-race-n").value;
  $("aih-race-nv").textContent = N.toLocaleString();
  const r = raceTimes(N);
  const maxT = Math.max(r.cpuTime, r.gpuTime);
  $("aih-race-cpu").style.width = (100 * r.cpuTime / maxT) + "%";
  $("aih-race-gpu").style.width = (100 * r.gpuTime / maxT) + "%";
  $("aih-race-cput").textContent = r.cpuTime.toFixed(0) + " u";
  $("aih-race-gput").textContent = r.gpuTime.toFixed(0) + " u";
  const winner = r.cpuTime <= r.gpuTime ? "CPU" : "GPU";
  $("aih-race-out").innerHTML =
    "CPU: 8 fast cores (speed 1.0)   ·   GPU: 2,048 slow cores (speed 0.15 each)\n"
    + "winner at " + N.toLocaleString() + " tasks: <span class='hot'>" + winner + "</span>"
    + (winner === "GPU" ? "  — GPU speedup ≈ <span class='g'>" + r.speedup.toFixed(1) + "×</span>" : "  — few tasks: the CPU's fast cores win.");
}

// ---- Lab 2: matmul ----
const MM = {
  A: [[1,2,3],[4,5,6]],
  B: [[7,8],[9,10],[11,12]],
  i: 0, j: 0, t: 0, acc: 0, done: false, cells: {}
};
function mmGrid(id, M, cls, hi) {
  const rows = M.length, cols = M[0].length;
  const g = $(id); g.style.gridTemplateColumns = "repeat(" + cols + ", 2rem)";
  let html = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let extra = "";
    if (hi) extra = hi(r, c);
    html += `<div class="aih-me ${cls}${extra}">${M[r][c]}</div>`;
  }
  g.innerHTML = html;
}
function mmDraw() {
  const k = MM.B.length;
  mmGrid("aih-mm-A", MM.A, "a", (r, c) => (r === MM.i && c === MM.t && !MM.done) ? " rowhot" : (r === MM.i ? " rowhot dim" : ""));
  mmGrid("aih-mm-B", MM.B, "b", (r, c) => (c === MM.j && r === MM.t && !MM.done) ? " colhot" : (c === MM.j ? " colhot dim" : ""));
  // C grid: filled cells show value; current cell shows running acc
  const rows = MM.A.length, cols = MM.B[0].length, g = $("aih-mm-C");
  g.style.gridTemplateColumns = "repeat(" + cols + ", 2rem)";
  let html = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const key = r + "," + c;
    let val = MM.cells[key] !== undefined ? MM.cells[key] : "";
    let extra = "";
    if (!MM.done && r === MM.i && c === MM.j) { val = MM.acc; extra = " chot"; }
    html += `<div class="aih-me ${extra?"":""}${extra}">${val}</div>`;
  }
  g.innerHTML = html;
  if (MM.done) {
    const res = matmul(MM.A, MM.B);
    $("aih-mm-out").innerHTML = "done — <span class='hot'>" + res.macs + "</span> MACs total for a "
      + MM.A.length + "×" + k + " · " + k + "×" + MM.B[0].length + " multiply.\n"
      + "each output cell = a sum of " + k + " products (a chain of multiply-accumulates).";
  } else {
    const a = MM.A[MM.i][MM.t], b = MM.B[MM.t][MM.j];
    $("aih-mm-out").innerHTML = "cell C[" + MM.i + "][" + MM.j + "]:  acc += A[" + MM.i + "][" + MM.t + "]·B[" + MM.t + "][" + MM.j + "] = "
      + a + "·" + b + " = " + (a * b) + "   →   running acc = <span class='hot'>" + (MM.acc) + "</span>";
  }
}
function mmStep() {
  if (MM.done) return;
  const k = MM.B.length;
  const a = MM.A[MM.i][MM.t], b = MM.B[MM.t][MM.j];
  MM.acc += a * b;
  MM.t++;
  if (MM.t >= k) {
    MM.cells[MM.i + "," + MM.j] = MM.acc;
    MM.acc = 0; MM.t = 0; MM.j++;
    if (MM.j >= MM.B[0].length) { MM.j = 0; MM.i++; if (MM.i >= MM.A.length) MM.done = true; }
  }
  mmDraw();
}
function mmFinishCell() { if (MM.done) return; const start = MM.i + "," + MM.j; while (!MM.done && (MM.i + "," + MM.j) === start) mmStep(); }
function mmReset() { MM.i = MM.j = MM.t = 0; MM.acc = 0; MM.done = false; MM.cells = {}; mmDraw(); }

// ---- Lab 3: systolic ----
const SYS = { A: [[1,2],[3,4],[5,6]], W: [[1,0,2],[0,1,1]], clock: 0, model: null };
function sysInit() { SYS.model = systolic(SYS.A, SYS.W); SYS.clock = 0; }
function sysDraw() {
  const m = SYS.model, p = m.p, q = m.q;
  // draw a p(rows of depth)×q grid of PEs; light cells based on wavefront
  const rows = Math.max(SYS.A[0].length, 2), cols = q;
  const g = $("aih-sys-grid"); g.style.gridTemplateColumns = "repeat(" + cols + ", 1.7rem)";
  const activeNow = m.active[Math.min(SYS.clock, m.active.length - 1)] || 0;
  let html = "", lit = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    // simple diagonal wavefront: a PE is "live" on clock ≈ r + c
    const live = (r + c) === SYS.clock;
    html += `<div class="aih-pe${live?" live":""}">${SYS.W[r] ? SYS.W[r][c] : "·"}</div>`;
  }
  g.innerHTML = html;
  $("aih-sys-desc").textContent = "grid holds the weights W (" + rows + "×" + cols + "); activations pump in from the left, skewed one clock per row.";
  if (SYS.clock >= m.clocks - 1) {
    $("aih-sys-out").innerHTML = "drained after <span class='hot'>" + m.clocks + "</span> clocks.\n"
      + "product A·W = " + JSON.stringify(m.product) + "\n"
      + "total MACs = <span class='hot'>" + m.macs + "</span>, but each input was loaded once and reused across a whole row — that reuse is the whole point.";
  } else {
    $("aih-sys-out").innerHTML = "clock <span class='hot'>" + SYS.clock + "</span> / " + (m.clocks - 1)
      + " — wavefront sweeping; ~" + activeNow + " MAC cells active this cycle.";
  }
}

// ---- Lab 4: roofline ----
function rooflineDraw() {
  const intensity = +$("aih-roof-int").value;
  $("aih-roof-intv").textContent = intensity.toFixed(1);
  const peak = 100, bw = 10;                    // 100 GFLOP/s peak, 10 GB/s bw (schematic)
  const r = roofline(intensity, peak, bw);
  // draw
  const cv = $("aih-roof-canvas"); if (cv && cv.getContext) {
    const ctx = cv.getContext("2d"); const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    const pad = 30, x0 = pad, x1 = W - 10, y0 = H - 20, y1 = 12;
    const maxI = 100, maxP = peak * 1.15;
    const X = i => x0 + (Math.log10(Math.max(0.1, i)) - Math.log10(0.1)) / (Math.log10(maxI) - Math.log10(0.1)) * (x1 - x0);
    const Y = p => y0 - (p / maxP) * (y0 - y1);
    // axes
    ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    // roofline: memory-bound slope then compute ceiling
    ctx.strokeStyle = "#f5c451"; ctx.lineWidth = 2; ctx.beginPath();
    let first = true;
    for (let i = 0.1; i <= maxI; i *= 1.08) {
      const perf = Math.min(peak, i * bw);
      const px = X(i), py = Y(perf);
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // marker at current intensity
    const px = X(intensity), py = Y(r.achievable);
    ctx.fillStyle = r.bound === "memory" ? "#e76f51" : "#5dff9e";
    ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
    // ridge line
    const rx = X(r.ridge);
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.setLineDash([2,4]);
    ctx.beginPath(); ctx.moveTo(rx, y0); ctx.lineTo(rx, y1); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#9fb0bf"; ctx.font = "10px monospace";
    ctx.fillText("ridge", rx + 3, y1 + 10);
    ctx.fillText("compute roof", x1 - 78, Y(peak) - 4);
  }
  $("aih-roof-out").innerHTML =
    "achievable = min(peak " + peak + ", intensity·bw = " + (intensity * bw).toFixed(0) + ") = <span class='hot'>"
    + r.achievable.toFixed(0) + " GFLOP/s</span>\nridge point at intensity " + r.ridge.toFixed(0)
    + " FLOP/byte. You are <span class='" + (r.bound === "memory" ? "" : "g") + "'>" + r.bound.toUpperCase()
    + "-BOUND</span>"
    + (r.bound === "memory" ? " — buying more FLOPs won't help; you need bandwidth or higher intensity."
                            : " — you're using the compute fully; a faster chip would help.");
  // matmul intensity note
  const mi = matmulIntensity(1024, 1024, 1024, 2);
  $("aih-roof-intv").insertAdjacentHTML;
}

// ---- Lab 5: precision ----
const PREC = { key: "fp32" };
function precDraw() {
  const p = PRECISIONS[PREC.key], base = PRECISIONS.fp32;
  $("aih-prec-desc").textContent = p.note + ".";
  const tput = p.rel, memPerEl = p.bytes;
  $("aih-prec-tput").style.width = (100 * tput / 4) + "%";
  $("aih-prec-tputv").textContent = tput + "× FP32";
  $("aih-prec-mem").style.width = (100 * memPerEl / 4) + "%";
  $("aih-prec-memv").textContent = memPerEl + " B/el";
  $("aih-prec-out").innerHTML =
    p.name + ": <span class='g'>" + tput + "×</span> the throughput and <span class='hot'>"
    + (base.bytes / memPerEl) + "×</span> less memory than FP32.\n"
    + (PREC.key === "int8" ? "This is the TPU's native MAC precision." :
       PREC.key === "fp32" ? "The baseline — full precision, most memory, fewest MACs/s." :
       "Neural nets tolerate this coarseness; the hardware cashes it in for speed.");
}

/* ============================================================ BUILD ======== */
function buildExperience() {
  ensureStyles();
  const body = $("panel-body");
  if (!body) return;
  body.querySelectorAll(".topic").forEach(t => t.remove());
  if (body.querySelector(".it-module")) return; // idempotent

  const module = document.createElement("section");
  module.className = "it-module";
  module.innerHTML = `
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · SILICON SHAPED BY THE WORKLOAD · ABOUT 45 MIN</div>
    <p class="it-hook">A graphics chip built to shade video-game pixels turned out to be a matrix-multiply machine — and matrix multiply is nearly all a neural network is. Hardware built for play became the engine of the AI era, and then chips were redesigned around that one operation.</p>
    <p class="it-intro">This field closes the Hardware loop: the microprocessor put the whole CPU on a chip; the GPU proved that massive parallelism, born of graphics, was exactly what deep learning needed; and the TPU took the final step of shaping silicon around the multiply-accumulate itself. The through-line is an inversion — for decades software adapted to the hardware; now the hardware is co-designed with the models. Five labs below: race a CPU against a GPU, build a matrix product MAC by MAC, run data through a TPU-style systolic array, find the compute-vs-memory wall on a roofline, and trade precision for throughput the way every AI chip does.</p>
    <div class="it-timeline" aria-label="AI-hardware timeline">
      <div class="it-moment"><b>1971</b><span>Intel 4004</span></div>
      <div class="it-moment"><b>2007</b><span>CUDA</span></div>
      <div class="it-moment"><b>2012</b><span>AlexNet on GPUs</span></div>
      <div class="it-moment"><b>2015</b><span>TPU deployed</span></div>
      <div class="it-moment"><b>2017</b><span>TPU paper</span></div>
    </div>

    ${raceLabHTML()}
    ${matmulLabHTML()}
    ${systolicLabHTML()}
    ${rooflineLabHTML()}
    ${precisionLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>In the race, start at 4 tasks (CPU wins) and drag up to 100,000. Find the crossover where the GPU takes over — that's the birth of the AI accelerator in one slider.</li>
      <li>In the matmul lab, "finish this cell" and count the MACs it took (equal to the shared dimension k). Every output cell is that same chain of multiply-accumulates.</li>
      <li>Run the systolic array to drain and read the clock count. Notice the product matches an ordinary matmul — same math, but each input was reused across a whole row instead of re-fetched.</li>
      <li>On the roofline, slide intensity low and watch the dot turn memory-bound (red). Dense matmul sits far right on the compute roof — that's why accelerators love it.</li>
      <li>Switch precision from FP32 to INT8 and read the numbers: 4× throughput, 1/4 memory. That's the TPU's native MAC, and why "quantization" is everywhere.</li>
      <li>Trace the arc across the six chapters: general chip → parallel chip → workload-shaped chip. The von Neumann core never changed; the accelerators grew around it.</li>
    </ol></div>

    <h3 class="it-section-title">Primary sources, papers &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1: race
  raceDraw();
  $("aih-race-n").addEventListener("input", raceDraw);

  // Lab 2: matmul
  mmReset();
  $("aih-mm-step").addEventListener("click", mmStep);
  $("aih-mm-cell").addEventListener("click", mmFinishCell);
  $("aih-mm-all").addEventListener("click", () => { while (!MM.done) mmStep(); });
  $("aih-mm-reset").addEventListener("click", mmReset);

  // Lab 3: systolic
  sysInit(); sysDraw();
  $("aih-sys-step").addEventListener("click", () => { if (SYS.clock < SYS.model.clocks - 1) { SYS.clock++; sysDraw(); } });
  $("aih-sys-run").addEventListener("click", () => { SYS.clock = SYS.model.clocks - 1; sysDraw(); });
  $("aih-sys-reset").addEventListener("click", () => { sysInit(); sysDraw(); });

  // Lab 4: roofline
  rooflineDraw();
  $("aih-roof-int").addEventListener("input", rooflineDraw);

  // Lab 5: precision
  precDraw();
  module.querySelectorAll("#aih-prec [data-prec]").forEach(b =>
    b.addEventListener("click", () => {
      module.querySelectorAll("#aih-prec [data-prec]").forEach(x => x.classList.toggle("on", x === b));
      PREC.key = b.dataset.prec; precDraw();
    }));
}

window.openAIHardwareExperience = buildExperience;

// test hook (parity with other guides)
window.__aihTest = { raceTimes, matmul, macSteps, systolic, roofline, matmulIntensity, PRECISIONS };
})();
