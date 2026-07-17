// DATA STRUCTURES — how memory is shaped so that operations become cheap. The
// arrays, hash tables, binary heaps, and B-trees that turn O(n) work into O(1)
// or O(log n). Loaded only when the "Data Structures" field opens. Same
// architecture as the other guides: the WHOLE guide renders INTO #panel-body as
// one <section class="it-module"> using the shared it-* base classes, plus
// scoped #panel .ds-* widget styles. Five labs are REAL: a hash-table with live
// collision chaining + load-factor, a binary-heap you build and sift, a
// B-tree that splits nodes as you insert, a big-O cheat-sheet cost explorer,
// and a "the right structure wins" head-to-head cost race.
(function () {
"use strict";

/* ------------------------------------------------------------------ chapters */
const CHAPTERS = [
  {
    icon: "🗃", title: "The array — memory as a ruler, and why O(1) exists at all",
    who: "the primitive under everything · random-access memory",
    lead: "Before any clever structure, one idea makes speed possible: if elements sit in a row, you can jump straight to the k-th one by arithmetic, without looking at the others.",
    formula: "address(a[k]) = base + k · elementSize   →   O(1) random access",
    what: `An array is a contiguous block of memory. Because every element is the same size and
      laid end to end, the address of element k is just base + k·size — one multiply and one add,
      no scanning. That constant-time random access is the bedrock every other structure is built
      on or measured against. It is why "look up the 1000th item" costs the same as "look up the
      1st."`,
    how: `The trade-off is rigidity: arrays are fixed-size and expensive to grow or to insert in
      the middle (you must shift everything after). The dynamic array (Python's list, C++'s
      vector) hides this by doubling capacity when full — which, by amortized analysis from the
      previous field, still costs O(1) per append on average. Structure is always a trade: fast
      here means slow there.`,
    story: `The whole discipline of data structures is the art of choosing which operations to
      make cheap at the cost of which others. A sorted array gives O(log n) search but O(n)
      insert; a linked list gives O(1) insert but O(n) search. There is no free lunch — only
      informed bargains, and knowing which bargain fits your workload is the skill.`,
    today: `Arrays underlie tensors (the n-dimensional arrays of every ML framework), image
      buffers, audio samples, and the contiguous memory that makes GPUs fast. The humble ruler of
      memory is why "vectorized" code — operating on whole arrays at once — is the difference
      between slow and fast in numerical computing.`
  },
  {
    icon: "🔑", title: "Hash tables — O(1) lookup by scrambling the key",
    who: "IBM, the Luhn era · 1953",
    lead: "What if you could compute where an item lives instead of searching for it? A hash function turns any key into an array index — and lookup becomes (almost) instant.",
    formula: "index = hash(key) mod tableSize   →   O(1) average lookup, insert, delete",
    what: `A hash table stores key–value pairs in an array, using a hash function to convert each
      key into an array index. To find a key you don't search — you compute its slot directly. The
      idea traces to IBM around 1953 (Hans Peter Luhn and colleagues). Build one and drop keys into
      it in the hash lab above, watching each land in its computed slot.`,
    how: `The catch is collisions: two different keys can hash to the same slot. The classic fix is
      chaining — each slot holds a little list of everything that landed there. As long as the load
      factor (items ÷ slots) stays low, chains stay short and operations stay O(1) on average. Let
      the table fill up and chains grow, degrading toward O(n) — which is exactly why real hash
      tables resize and rehash when they get too full.`,
    story: `Hashing is one of computing's most quietly universal ideas. It is inside every Python
      dict, JavaScript object, and database join; it powers caches, sets, deduplication, and
      content-addressed storage. Cryptographic hashes secure passwords and blockchains; hash tables
      make interpreters fast. One trick — compute the location instead of finding it — echoes
      everywhere.`,
    today: `The attention mechanism at the heart of transformers is, in effect, a soft
      associative lookup — a "key–value" store queried by similarity — and its KV-cache is a literal
      table of keys and values. The 1953 idea of addressing data by its content, not its position,
      is running inside every large language model.`
  },
  {
    icon: "⛰", title: "Heaps & priority queues — always know the smallest thing",
    who: "J. W. J. Williams · heapsort · 1964",
    lead: "Sometimes you don't need everything sorted — you just need the next-most-urgent item, again and again. A heap gives you that in O(log n), forever.",
    formula: "binary heap in an array:  parent(i) = ⌊(i−1)/2⌋   ·   min at the root, always",
    what: `A binary heap is a tree kept in an array where every parent is ≤ its children (a
      min-heap), so the smallest element is always at the root — readable in O(1). Insert or remove
      the min, and the heap "sifts" an element up or down in O(log n) to restore order. J. W. J.
      Williams introduced it in 1964 along with heapsort. Build one in the heap lab above and watch
      elements sift into place.`,
    how: `The elegance is that a tree lives inside a flat array with no pointers: the children of
      index i are at 2i+1 and 2i+2. Insert appends at the end and sifts up; extract-min swaps the
      root with the last element, shrinks, and sifts down. Both touch only one root-to-leaf path —
      O(log n) — which is why a priority queue never needs to sort the whole collection.`,
    story: `Heapsort was a milestone: an in-place O(n log n) sort with guaranteed worst-case
      performance (unlike quicksort's O(n²) worst case), built entirely on the heap. And the
      priority queue it enables is the engine of Dijkstra's shortest-path algorithm, A* search,
      Huffman coding, event simulation, and OS schedulers.`,
    today: `Every time your phone routes you around traffic, a printer picks the next job, an event
      simulator fires the next event, or a scheduler runs the highest-priority task, a heap is
      choosing "the smallest/most-urgent thing" in logarithmic time. It is the data structure of
      "what next?"`
  },
  {
    icon: "🌲", title: "B-trees — the shape that made databases possible",
    who: "Rudolf Bayer & Edward McCreight · 1972",
    lead: "Binary trees are great in memory, but disks are slow and read in big chunks. The B-tree makes each node a whole disk page — fat, shallow, and blisteringly efficient on real storage.",
    formula: "each node holds many keys & children  →  height ≈ log_k(n),  k in the hundreds",
    what: `A B-tree is a self-balancing search tree where each node holds many keys (not just one)
      and has many children, sized to fill a disk page. Because each node fans out to hundreds of
      children, the tree stays only a few levels deep even for billions of keys — so a lookup costs
      just a handful of disk reads. Insert keys in the B-tree lab above and watch nodes split as
      they overflow.`,
    how: `The magic is matching the structure to the hardware. Disk (and SSD) access is dominated
      by the cost of each read, and storage is read in fixed pages. By packing one page per node, a
      B-tree minimizes the number of page reads: height ≈ log_k(n) with k in the hundreds, so a
      billion keys is 4–5 levels. Insertions that overflow a node split it and push a key up,
      keeping the tree perfectly balanced.`,
    story: `Bayer and McCreight published "Organization and Maintenance of Large Ordered Indexes"
      in 1972; Douglas Comer's 1979 survey was literally titled "The Ubiquitous B-tree." The B+-tree
      variant, which keeps all data in the leaves linked in a list, became the standard index
      structure — and has been for half a century.`,
    today: `Virtually every relational database (PostgreSQL, MySQL, Oracle, SQLite) and every
      major filesystem (NTFS, HFS+, ext4, APFS) indexes with a B-tree or B+-tree. When a query with
      an index returns instantly from a billion-row table, a fifty-year-old data structure, shaped to
      the disk, is doing the work.`
  },
  {
    icon: "⚖️", title: "The bargain — choosing the right structure",
    who: "the cost table every engineer carries",
    lead: "There is no best data structure, only the best one for your operations. Master the cost table and half of practical performance is already decided.",
    formula: "array: O(1) access, O(n) insert   ·   hash: O(1) avg   ·   heap: O(log n) min   ·   tree: O(log n) ordered",
    what: `Every structure is a different bargain over the same operations — search, insert,
      delete, get-min, range-scan. An unsorted array inserts in O(1) but searches in O(n); a hash
      table does search/insert/delete in O(1) average but can't give you sorted order or ranges; a
      heap gives the min in O(1) but can't search; a balanced tree does everything in O(log n) and
      keeps order. The cost-explorer lab lays them side by side.`,
    how: `Choosing well means asking: which operations do I do most, and do I need order? Need
      fast membership and don't care about order? Hash set. Need "smallest so far" repeatedly?
      Heap. Need range queries or sorted iteration? Balanced tree or B-tree. Need positional
      access? Array. The right choice can turn an O(n²) program into an O(n log n) one without
      changing a single algorithm — just the container.`,
    story: `This is where analysis (previous field) meets engineering. The same problem, solved
      with the wrong structure, can be a thousand times slower — the classic "it was O(n) inside a
      loop" bug. Interview questions and real production incidents alike usually come down to: was
      the right structure chosen for the access pattern?`,
    today: `Modern systems compose these: a database uses B-trees for indexes, hash tables for
      joins, and heaps for query planning; an ML pipeline uses arrays for tensors, hash maps for
      vocabularies, and priority queues for beam search. Data structures are the vocabulary; picking
      the right word is the craft. Shape the memory, and the algorithm gets fast for free.`
  },
  {
    icon: "🌍", title: "How memory shape became everything",
    who: "1953 – now · the invisible foundation",
    lead: "Data structures are the least glamorous and most load-bearing layer of computing: nobody sees them, and nothing works without them.",
    formula: "the right shape turns impossible into instant  —  across every system ever built",
    what: `From the 1953 hash table to the 1972 B-tree, this field quietly decided what large-scale
      computing could do. Every database, search engine, compiler, operating system, and neural
      network is a careful arrangement of arrays, tables, heaps, and trees, each chosen to make the
      hot operations cheap.`,
    how: `The through-line with the rest of the map: analysis (previous field) tells you the cost
      of an operation; data structures let you change that cost by changing the shape of memory.
      They are the bridge from abstract algorithms to real, fast programs — the place where "in
      theory" becomes "in production."`,
    story: `The structures endure because they encode fundamental trade-offs, not fashions: the
      tension between fast-lookup and ordered-iteration, between memory and speed, between
      in-memory and on-disk, is permanent. A B-tree from 1972 and a hash table from 1953 are still
      optimal for their jobs because the trade-offs they resolve haven't changed.`,
    today: `Even the frontier loops back here: a transformer's attention is associative lookup; a
      vector database is a spatial data structure for nearest-neighbor search; a KV-cache is a table.
      The oldest idea in the field — arrange the data so the operation you need is cheap — is exactly
      how modern AI is made to run. Shape the memory, and everything else follows.`
  }
];

/* ------------------------------------------------------------------ sources */
const SOURCES = [
  { type: "THE MASTERWORK · 1973", title: "Donald Knuth — TAOCP Vol. 3: Sorting and Searching",
    note: "The definitive rigorous treatment of hashing, heaps, trees, and search — the field's foundational reference.",
    url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" },
  { type: "B-TREES · 1972", title: "Bayer & McCreight — Organization and Maintenance of Large Ordered Indexes",
    note: "The paper that introduced the B-tree; retrieval/insert/delete in O(log_k n) on disk. Acta Informatica 1(3), 173–189.",
    url: "https://doi.org/10.1007/BF00288683" },
  { type: "THE SURVEY · 1979", title: "Douglas Comer — The Ubiquitous B-Tree",
    note: "The classic survey (its title says it all) of B-trees and B+-trees — why they run inside every database and filesystem.",
    url: "https://doi.org/10.1145/356770.356776" },
  { type: "HEAPSORT · 1964", title: "J. W. J. Williams — Algorithm 232: Heapsort",
    note: "Introduced the binary heap and heapsort: an in-place O(n log n) sort and the original priority queue.",
    url: "https://doi.org/10.1145/512274.512284" },
  { type: "FOUNDATIONAL PAPER · 1968", title: "Hart, Nilsson & Raphael — A Formal Basis for the Heuristic Determination of Minimum Cost Paths (A*)",
    note: "A* search — one of the great applications of the priority queue; the reason heaps route your maps.",
    url: "https://doi.org/10.1109/TSSC.1968.300136" },
  { type: "THE TEXTBOOK", title: "Cormen, Leiserson, Rivest & Stein — Introduction to Algorithms (CLRS)",
    note: "The canonical modern treatment of hash tables, heaps, red-black trees, and B-trees, with proofs.",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
  { type: "MODERN CLASSIC · BOOK", title: "Sedgewick & Wayne — Algorithms (4th ed.)",
    note: "A beautifully clear, code-first treatment of data structures — pairs with the free Coursera course and booksite.",
    url: "https://algs4.cs.princeton.edu/home/" },
  { type: "REFERENCE · FREE", title: "NIST — Dictionary of Algorithms and Data Structures",
    note: "A free, authoritative encyclopedia of every structure and its complexity, maintained by NIST.",
    url: "https://xlinux.nist.gov/dads/" },
  { type: "PLAY & VISUALIZE · FREE", title: "VisuAlgo — data-structure & algorithm animations",
    note: "Watch hash tables, heaps, and B-trees animate insert/delete/search step by step; a superb free companion.",
    url: "https://visualgo.net/en" }
];

/* ============================================================ REAL LOGIC ==== */

// ---- Lab 1: hash table with chaining ----
function hashStr(key, size) {
  // simple, deterministic polynomial rolling hash (djb2-ish), then mod
  let h = 5381;
  const s = String(key);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h % size;
}
function makeHashTable(size) { return { size, slots: Array.from({ length: size }, () => []), count: 0 }; }
function htInsert(ht, key) {
  const idx = hashStr(key, ht.size);
  if (ht.slots[idx].indexOf(key) === -1) { ht.slots[idx].push(key); ht.count++; }
  return idx;
}
function htStats(ht) {
  const chains = ht.slots.map(s => s.length);
  const maxChain = Math.max(0, ...chains);
  const nonEmpty = chains.filter(c => c > 0).length;
  const load = ht.count / ht.size;
  // expected avg lookup cost with chaining ≈ 1 + load/2 (successful)
  const avgProbe = 1 + load / 2;
  return { maxChain, nonEmpty, load, avgProbe, collisions: ht.count - nonEmpty };
}

// ---- Lab 2: binary min-heap ----
function heapInsert(heap, x) {
  heap.push(x);
  let i = heap.length - 1;
  const swaps = [];
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] <= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    swaps.push([p, i]); i = p;
  }
  return { heap, swaps };
}
function heapExtractMin(heap) {
  if (!heap.length) return { min: null, heap };
  const min = heap[0];
  const last = heap.pop();
  const swaps = [];
  if (heap.length) {
    heap[0] = last; let i = 0;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2; let sm = i;
      if (l < heap.length && heap[l] < heap[sm]) sm = l;
      if (r < heap.length && heap[r] < heap[sm]) sm = r;
      if (sm === i) break;
      [heap[sm], heap[i]] = [heap[i], heap[sm]];
      swaps.push([sm, i]); i = sm;
    }
  }
  return { min, heap, swaps };
}
function isValidHeap(heap) {
  for (let i = 0; i < heap.length; i++) {
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < heap.length && heap[i] > heap[l]) return false;
    if (r < heap.length && heap[i] > heap[r]) return false;
  }
  return true;
}

// ---- Lab 3: B-tree (order t: each node has t-1..2t-1 keys) ----
function makeBTree(t) { return { t, root: { keys: [], children: [], leaf: true } }; }
function btSearch(node, key) {
  let i = 0;
  while (i < node.keys.length && key > node.keys[i]) i++;
  if (i < node.keys.length && node.keys[i] === key) return true;
  if (node.leaf) return false;
  return btSearch(node.children[i], key);
}
function btSplitChild(parent, i, t) {
  const child = parent.children[i];
  const mid = t - 1;
  const right = { keys: child.keys.slice(mid + 1), children: [], leaf: child.leaf };
  const upKey = child.keys[mid];
  if (!child.leaf) { right.children = child.children.slice(mid + 1); child.children = child.children.slice(0, mid + 1); }
  child.keys = child.keys.slice(0, mid);
  parent.keys.splice(i, 0, upKey);
  parent.children.splice(i + 1, 0, right);
}
function btInsertNonFull(node, key, t) {
  let i = node.keys.length - 1;
  if (node.leaf) {
    node.keys.push(0);
    while (i >= 0 && node.keys[i] > key) { node.keys[i + 1] = node.keys[i]; i--; }
    node.keys[i + 1] = key;
  } else {
    while (i >= 0 && node.keys[i] > key) i--;
    i++;
    if (node.children[i].keys.length === 2 * t - 1) {
      btSplitChild(node, i, t);
      if (key > node.keys[i]) i++;
    }
    btInsertNonFull(node.children[i], key, t);
  }
}
function btInsert(tree, key) {
  const t = tree.t, r = tree.root;
  if (r.keys.length === 2 * t - 1) {
    const s = { keys: [], children: [r], leaf: false };
    tree.root = s;
    btSplitChild(s, 0, t);
    btInsertNonFull(s, key, t);
  } else btInsertNonFull(r, key, t);
}
function btHeight(node) { return node.leaf ? 1 : 1 + btHeight(node.children[0]); }
function btCountKeys(node) { let c = node.keys.length; if (!node.leaf) node.children.forEach(ch => c += btCountKeys(ch)); return c; }
function btInOrder(node, out) { for (let i = 0; i < node.keys.length; i++) { if (!node.leaf) btInOrder(node.children[i], out); out.push(node.keys[i]); } if (!node.leaf) btInOrder(node.children[node.keys.length], out); return out; }

// ---- Lab 4/5: cost table ----
const STRUCTS = {
  array:   { name: "Unsorted array", search: "O(n)", insert: "O(1)", del: "O(n)", min: "O(n)", ordered: "no",  s: 3 },
  sorted:  { name: "Sorted array",   search: "O(log n)", insert: "O(n)", del: "O(n)", min: "O(1)", ordered: "yes", s: 3 },
  list:    { name: "Linked list",    search: "O(n)", insert: "O(1)", del: "O(1)", min: "O(n)", ordered: "no",  s: 3 },
  hash:    { name: "Hash table",     search: "O(1)*", insert: "O(1)*", del: "O(1)*", min: "O(n)", ordered: "no",  s: 1 },
  heap:    { name: "Binary heap",    search: "O(n)", insert: "O(log n)", del: "O(log n)", min: "O(1)", ordered: "partial", s: 2 },
  bst:     { name: "Balanced tree",  search: "O(log n)", insert: "O(log n)", del: "O(log n)", min: "O(log n)", ordered: "yes", s: 2 },
  btree:   { name: "B-tree",         search: "O(log n)", insert: "O(log n)", del: "O(log n)", min: "O(log n)", ordered: "yes", s: 2 }
};
// numeric cost model for the "race": ops count for an operation at size n
function opCost(kind, op, n) {
  const log = Math.max(1, Math.log2(n));
  switch (kind + ":" + op) {
    case "array:search": return n; case "array:insert": return 1;
    case "hash:search": return 1; case "hash:insert": return 1;
    case "heap:min": return 1; case "heap:insert": return log;
    case "bst:search": return log; case "bst:insert": return log;
    case "btree:search": return Math.max(1, Math.log(n) / Math.log(256)); // fat nodes
    default: return n;
  }
}

/* ============================================================ STYLES ======= */
const TEAL = "#2dd4bf";
const GOLD = "#e9c46a";
const RED = "#e76f51";
const DS_CSS = `
  #panel .ds-chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:.5rem 0}
  #panel .ds-chip{font:500 .72rem/1 var(--mono,ui-monospace,monospace);color:#bfeee6;
    background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.3);border-radius:7px;padding:.42rem .6rem;cursor:pointer;transition:.15s}
  #panel .ds-chip:hover{border-color:${TEAL};color:#fff}
  #panel .ds-chip.on{background:${TEAL};color:#04201c;border-color:${TEAL};font-weight:700}
  #panel .ds-desc{font-size:.8rem;color:#9fb0bf;font-style:italic;margin:.35rem 0 .5rem;line-height:1.5}
  #panel .ds-slots{display:flex;flex-direction:column;gap:2px;margin:.5rem 0;font:500 .7rem/1.2 var(--mono,ui-monospace,monospace)}
  #panel .ds-slot{display:flex;align-items:center;gap:.4rem}
  #panel .ds-slot .idx{width:1.7rem;text-align:right;color:#6b7a90}
  #panel .ds-slot .bucket{flex:1;display:flex;gap:.25rem;flex-wrap:wrap;min-height:1.4rem;padding:.15rem;border-radius:5px;background:#0a0f18;border:1px solid rgba(255,255,255,.08)}
  #panel .ds-slot.hot .bucket{border-color:${TEAL};box-shadow:0 0 8px rgba(45,212,191,.3)}
  #panel .ds-key{background:rgba(45,212,191,.18);border:1px solid rgba(45,212,191,.4);border-radius:4px;padding:.1rem .35rem;color:#eafff8}
  #panel .ds-key.collide{background:rgba(231,111,81,.2);border-color:${RED};color:#ffd9cd}
  #panel .ds-heap{display:flex;flex-direction:column;align-items:center;gap:.4rem;margin:.5rem 0}
  #panel .ds-hrow{display:flex;gap:.5rem;justify-content:center}
  #panel .ds-hn{width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font:600 .72rem/1 var(--mono,ui-monospace,monospace);border:2px solid rgba(255,255,255,.2);background:#0a0f18;color:#cde;transition:.2s}
  #panel .ds-hn.root{border-color:${GOLD};background:rgba(233,196,106,.2);color:#fff;box-shadow:0 0 12px rgba(233,196,106,.4)}
  #panel .ds-hn.moved{border-color:${TEAL};background:rgba(45,212,191,.2)}
  #panel .ds-btree{display:flex;flex-direction:column;align-items:center;gap:.5rem;margin:.5rem 0}
  #panel .ds-btrow{display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap}
  #panel .ds-bnode{display:flex;gap:2px;border:1px solid rgba(45,212,191,.4);border-radius:6px;padding:2px;background:#0a0f18}
  #panel .ds-bkey{min-width:1.3rem;text-align:center;padding:.15rem .3rem;font:600 .68rem/1 var(--mono,ui-monospace,monospace);color:#eafff8;background:rgba(45,212,191,.12);border-radius:3px}
  #panel .ds-mono{font:.76rem/1.6 var(--mono,ui-monospace,monospace);color:#bcd;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.6rem .7rem;margin:.5rem 0;white-space:pre-wrap;overflow-x:auto}
  #panel .ds-mono .hot{color:${TEAL};font-weight:700}
  #panel .ds-mono .g{color:${GOLD};font-weight:700}
  #panel .ds-mono .r{color:${RED};font-weight:700}
  #panel .ds-table{width:100%;border-collapse:collapse;margin:.5rem 0;font:500 .68rem/1.3 var(--mono,ui-monospace,monospace)}
  #panel .ds-table th,#panel .ds-table td{border:1px solid rgba(255,255,255,.1);padding:.3rem .4rem;text-align:center;color:#cde}
  #panel .ds-table th{color:#8aa;font-weight:600}
  #panel .ds-table td.good{color:${TEAL}}
  #panel .ds-table td.bad{color:${RED}}
  #panel .ds-table tr.on td{background:rgba(45,212,191,.1)}
  #panel .ds-bars{display:flex;flex-direction:column;gap:.4rem;margin:.5rem 0}
  #panel .ds-barrow{display:flex;align-items:center;gap:.5rem}
  #panel .ds-barrow .lbl{width:6rem;font:500 .68rem/1.2 var(--mono,ui-monospace,monospace);color:#cde}
  #panel .ds-bartrack{flex:1;height:1.2rem;background:#0a0f18;border:1px solid rgba(255,255,255,.1);border-radius:6px;overflow:hidden}
  #panel .ds-barfill{height:100%;border-radius:5px;transition:width .5s ease}
  #panel .ds-barrow .num{width:5rem;text-align:right;font:600 .68rem/1 var(--mono,ui-monospace,monospace);color:#cde}
`;

function ensureStyles() {
  if (window.__ensureLearningBaseStyles) window.__ensureLearningBaseStyles();
  if (!document.getElementById("datastructs-css")) {
    const st = document.createElement("style");
    st.id = "datastructs-css";
    st.textContent = DS_CSS;
    document.head.appendChild(st);
  }
}
const $ = id => document.getElementById(id);

/* ============================================================ LAB HTML ===== */

function hashLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 1 · HASH TABLES · COMPUTE, DON'T SEARCH</div>
    <h3>Drop keys into their computed slots</h3>
    <p class="it-lab-intro">A hash function turns any key into an array index, so you jump straight to it instead of searching. But two keys can collide into the same slot — handled by chaining (a little list per slot). Add keys and watch them land; watch the load factor climb and chains grow, degrading O(1) toward O(n).</p>
    <div class="it-lab-actions">
      <input id="ds-hash-in" class="it-inputbox" spellcheck="false" placeholder="type a word" value="apple" style="font-family:var(--mono,ui-monospace,monospace);background:#0a0f18;border:1px solid rgba(255,255,255,.16);border-radius:7px;color:#eafff8;padding:.5rem .6rem;min-width:7rem">
      <button class="it-send" id="ds-hash-add">▶ hash &amp; insert</button>
      <button class="it-send" id="ds-hash-demo">add 6 sample keys</button>
      <button class="it-send" id="ds-hash-reset" style="background:none;border:1px solid rgba(45,212,191,.5);color:${TEAL}">reset</button>
    </div>
    <div class="ds-slots" id="ds-hash-slots"></div>
    <div class="ds-mono" id="ds-hash-out"></div>
    <p class="it-caveat">This one trick — compute the location instead of finding it — hides in every Python dict, database join, and cache. And a transformer's attention is a soft version of exactly this: a key–value store queried by similarity.</p>
  </section>`;
}

function heapLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 2 · HEAPS · ALWAYS KNOW THE SMALLEST</div>
    <h3>Build a min-heap, sift by sift</h3>
    <p class="it-lab-intro">A binary heap keeps the smallest element at the root at all times, using only an array (children of i live at 2i+1 and 2i+2). Insert appends and sifts <em>up</em>; extract-min swaps in the last element and sifts <em>down</em> — each touches just one root-to-leaf path, so both are O(log n). Add numbers and pull the min.</p>
    <div class="it-lab-actions">
      <button class="it-send" id="ds-heap-add">▶ insert random</button>
      <button class="it-send" id="ds-heap-min">extract min</button>
      <button class="it-send" id="ds-heap-fill">fill with 7</button>
      <button class="it-send" id="ds-heap-reset" style="background:none;border:1px solid rgba(45,212,191,.5);color:${TEAL}">reset</button>
    </div>
    <div class="ds-heap" id="ds-heap-tree"></div>
    <div class="ds-mono" id="ds-heap-out"></div>
    <p class="it-caveat">The priority queue a heap gives you is the engine of Dijkstra's routing, A* search, Huffman coding, event simulators, and OS schedulers — every "what's the most urgent thing next?" runs on this, in O(log n).</p>
  </section>`;
}

function btreeLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 3 · B-TREES · SHAPED FOR THE DISK</div>
    <h3>Insert keys and watch nodes split</h3>
    <p class="it-lab-intro">A B-tree packs many keys per node (one disk page each) so it stays shallow even for billions of keys — a lookup is just a few page reads. When a node overflows it splits and pushes its middle key up, keeping the tree perfectly balanced. Insert keys and watch the splits ripple.</p>
    <div class="it-lab-actions">
      <button class="it-send" id="ds-bt-add">▶ insert next key</button>
      <button class="it-send" id="ds-bt-add5">insert 5 more</button>
      <button class="it-send" id="ds-bt-reset" style="background:none;border:1px solid rgba(45,212,191,.5);color:${TEAL}">reset</button>
    </div>
    <div class="ds-btree" id="ds-bt-view"></div>
    <div class="ds-mono" id="ds-bt-out"></div>
    <p class="it-caveat">Virtually every database (PostgreSQL, MySQL, SQLite) and filesystem (ext4, APFS, NTFS) indexes with a B-tree or B+-tree. When an indexed query returns instantly from a billion rows, this 1972 structure — shaped to the disk — is doing it.</p>
  </section>`;
}

function tableLabHTML() {
  const rows = Object.keys(STRUCTS).map(k => {
    const s = STRUCTS[k];
    function cell(v) { const good = v.indexOf("1") >= 0 || v.indexOf("log") >= 0; return `<td class="${good?"good":(v==="O(n)"?"bad":"")}">${v}</td>`; }
    return `<tr data-struct="${k}"><td style="text-align:left;color:#eafff8">${s.name}</td>${cell(s.search)}${cell(s.insert)}${cell(s.del)}${cell(s.min)}<td>${s.ordered}</td></tr>`;
  }).join("");
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 4 · THE BARGAIN · COST CHEAT-SHEET</div>
    <h3>Every structure is a different trade</h3>
    <p class="it-lab-intro">There's no best data structure — only the best one for your operations. This is the cost table every engineer carries: which operations each structure makes cheap, and what it gives up. Green is fast, red is O(n). Read across a row to see the bargain. (* = average case for hashing.)</p>
    <table class="ds-table">
      <thead><tr><th style="text-align:left">structure</th><th>search</th><th>insert</th><th>delete</th><th>get-min</th><th>ordered?</th></tr></thead>
      <tbody id="ds-table-body">${rows}</tbody>
    </table>
    <div class="ds-mono" id="ds-table-out">tap a row for when to reach for it.</div>
    <p class="it-caveat">Choosing the right container can turn an O(n²) program into O(n log n) without touching the algorithm. Half of practical performance is just picking the structure that fits your access pattern.</p>
  </section>`;
}

function raceLabHTML() {
  return `
  <section class="it-lab">
    <div class="it-kicker">LAB 5 · THE RIGHT STRUCTURE WINS</div>
    <h3>Membership test: array vs hash set</h3>
    <p class="it-lab-intro">Same task — "is this item in the collection?" — run n times. An unsorted array scans O(n) each time (O(n²) total); a hash set computes the slot in O(1) each time (O(n) total). Slide the size and watch the gap between the wrong structure and the right one explode.</p>
    <div class="it-control">
      <label for="ds-race-n"><span>collection size n</span><output id="ds-race-nv">1000</output></label>
      <input id="ds-race-n" type="range" min="10" max="100000" step="10" value="1000">
    </div>
    <div class="ds-bars" id="ds-race-bars"></div>
    <div class="ds-mono" id="ds-race-out"></div>
    <p class="it-caveat">This is the single most common real-world performance bug: an O(n) lookup inside a loop. Swap the array for a hash set — same code shape, one word changed — and it's suddenly a thousand times faster.</p>
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

// ---- Lab 1: hash ----
const HT = { table: makeHashTable(8), lastIdx: -1 };
const SAMPLE_KEYS = ["apple", "banana", "cherry", "date", "fig", "grape", "kiwi", "lemon", "mango"];
function hashDraw() {
  const ht = HT.table;
  $("ds-hash-slots").innerHTML = ht.slots.map((bucket, i) =>
    `<div class="ds-slot${i===HT.lastIdx?" hot":""}"><span class="idx">${i}</span><span class="bucket">`
    + bucket.map((k, j) => `<span class="ds-key${bucket.length>1?" collide":""}">${k}</span>`).join("") + `</span></div>`).join("");
  const st = htStats(ht);
  $("ds-hash-out").innerHTML =
    "items: " + ht.count + " / " + ht.size + " slots   →   load factor = <span class='" + (st.load>0.75?"r":"hot") + "'>" + st.load.toFixed(2) + "</span>\n"
    + "collisions: " + st.collisions + "   ·   longest chain: " + st.maxChain + "   ·   avg lookup ≈ <span class='hot'>" + st.avgProbe.toFixed(2) + "</span> probes"
    + (st.load > 0.75 ? "\n<span class='r'>load factor high — a real table would resize &amp; rehash here to keep chains short.</span>" : "");
}
function hashAdd(key) {
  if (!key) return;
  const idx = htInsert(HT.table, key);
  HT.lastIdx = idx;
  hashDraw();
}

// ---- Lab 2: heap ----
const HEAP = { arr: [], lastMoved: [] };
function heapDraw(note) {
  const h = HEAP.arr;
  // render level by level
  let html = "", level = 0, idx = 0;
  while (idx < h.length) {
    const count = Math.pow(2, level);
    let row = "";
    for (let k = 0; k < count && idx < h.length; k++, idx++) {
      const cls = idx === 0 ? " root" : (HEAP.lastMoved.indexOf(idx) >= 0 ? " moved" : "");
      row += `<div class="ds-hn${cls}">${h[idx]}</div>`;
    }
    html += `<div class="ds-hrow">${row}</div>`;
    level++;
  }
  $("ds-heap-tree").innerHTML = html || "<div class='ds-desc'>empty — insert something.</div>";
  const valid = isValidHeap(h);
  $("ds-heap-out").innerHTML = (note || "") + (note ? "\n" : "")
    + "array: [" + h.join(", ") + "]\n"
    + "min (root) = <span class='g'>" + (h.length ? h[0] : "–") + "</span>   ·   size " + h.length
    + "   ·   heap property " + (valid ? "<span class='hot'>valid ✓</span>" : "<span class='r'>broken</span>");
}

// ---- Lab 3: B-tree ----
const BT = { tree: makeBTree(2), next: 0, seq: [] };
function btInit() { BT.tree = makeBTree(2); BT.seq = shuffleSeq(20); BT.next = 0; }
function shuffleSeq(n) { const a = []; for (let i = 1; i <= n; i++) a.push(i * 5); for (let i = n - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
function btDrawNode(node) {
  return `<div class="ds-bnode">` + node.keys.map(k => `<span class="ds-bkey">${k}</span>`).join("") + `</div>`;
}
function btDraw(justInserted) {
  const t = BT.tree;
  // render up to 3 levels
  let html = "";
  const levels = [[t.root]];
  if (!t.root.leaf) levels.push(t.root.children.slice());
  if (levels[1]) { const l3 = []; levels[1].forEach(nd => { if (!nd.leaf) nd.children.forEach(c => l3.push(c)); }); if (l3.length) levels.push(l3); }
  html = levels.map(row => `<div class="ds-btrow">` + row.map(btDrawNode).join("") + `</div>`).join("");
  $("ds-bt-view").innerHTML = html;
  const keys = btInOrder(t.root, []);
  const sorted = keys.slice().sort((a, b) => a - b);
  $("ds-bt-out").innerHTML =
    (justInserted !== undefined ? "inserted <span class='hot'>" + justInserted + "</span>\n" : "")
    + "keys: " + btCountKeys(t.root) + "   ·   height: <span class='g'>" + btHeight(t.root) + "</span>   ·   order t=2 (2–3 keys/node)\n"
    + "in-order traversal: [" + keys.join(", ") + "]   " + (JSON.stringify(keys) === JSON.stringify(sorted) ? "<span class='hot'>sorted ✓</span>" : "<span class='r'>unsorted!</span>");
}

// ---- Lab 4: cost table ----
const WHENTO = {
  array: "positional access & append; you rarely search. (tensors, buffers)",
  sorted: "you build once, then binary-search many times; need order.",
  list: "constant-time insert/delete at a known spot; no random access.",
  hash: "fast membership / key→value and order doesn't matter. (dict, set, cache)",
  heap: "repeatedly need the smallest/most-urgent item. (Dijkstra, schedulers)",
  bst: "need search AND sorted iteration AND range queries, in memory.",
  btree: "same, but on disk / huge data. (database & filesystem indexes)"
};

// ---- Lab 5: race ----
function raceDraw() {
  const n = +$("ds-race-n").value;
  $("ds-race-nv").textContent = n.toLocaleString();
  const arrayOps = n * n;        // n lookups × O(n) each
  const hashOps = n * 1;         // n lookups × O(1) each
  const maxOps = arrayOps;
  $("ds-race-bars").innerHTML =
    `<div class="ds-barrow"><span class="lbl">array O(n²)</span><div class="ds-bartrack"><div class="ds-barfill" style="width:100%;background:${RED}"></div></div><span class="num">${arrayOps.toExponential(1)}</span></div>`
    + `<div class="ds-barrow"><span class="lbl">hash set O(n)</span><div class="ds-bartrack"><div class="ds-barfill" style="width:${Math.max(0.5,100*hashOps/maxOps)}%;background:${TEAL}"></div></div><span class="num">${hashOps.toExponential(1)}</span></div>`;
  $("ds-race-out").innerHTML =
    "n membership tests on n items:\narray (scan each): <span class='r'>" + arrayOps.toLocaleString() + "</span> operations\n"
    + "hash set (compute each): <span class='hot'>" + hashOps.toLocaleString() + "</span> operations\n"
    + "the right structure is <span class='g'>" + Math.round(arrayOps / hashOps).toLocaleString() + "×</span> fewer operations.";
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
    <div class="it-kicker">INTERACTIVE FIELD GUIDE · HOW MEMORY IS SHAPED · ABOUT 45 MIN</div>
    <p class="it-hook">A hash table hides in every Python dict — and in every transformer's attention cache. The least glamorous layer of computing is also the most load-bearing: shape the memory right, and the operation you need becomes instant.</p>
    <p class="it-intro">This field is the art of arranging data so that the operations you care about become cheap. Every structure is a bargain — make search fast and you may make insert slow; there is no free lunch, only informed trades. From the 1953 hash table to the 1972 B-tree, these shapes quietly decided what large-scale computing could do. Five labs below: drop keys into a live hash table and watch collisions chain, build a min-heap sift by sift, insert into a B-tree and watch nodes split, read the cost cheat-sheet every engineer carries, and race the wrong structure against the right one.</p>
    <div class="it-timeline" aria-label="Data structures timeline">
      <div class="it-moment"><b>1953</b><span>hash tables</span></div>
      <div class="it-moment"><b>1962</b><span>balanced trees (AVL)</span></div>
      <div class="it-moment"><b>1964</b><span>heaps / heapsort</span></div>
      <div class="it-moment"><b>1972</b><span>B-trees</span></div>
      <div class="it-moment"><b>now</b><span>attention KV-cache</span></div>
    </div>

    ${hashLabHTML()}
    ${heapLabHTML()}
    ${btreeLabHTML()}
    ${tableLabHTML()}
    ${raceLabHTML()}

    <h3 class="it-section-title">The story, in six movements</h3>
    ${CHAPTERS.map(chapterMarkup).join("")}

    <div class="it-challenges"><b>Six things to try</b><ol>
      <li>In the hash lab, add sample keys until the load factor passes 0.75 and watch chains grow and collisions appear — the exact moment a real table would resize and rehash.</li>
      <li>In the heap, fill with 7 random numbers, then extract-min three times. Notice the root is always the smallest, and each operation only touches one path down the tree.</li>
      <li>In the B-tree, insert keys until a node overflows (3 keys) and splits — watch the middle key jump up a level. That single rule keeps the tree perfectly balanced forever.</li>
      <li>In the cost table, find the only row that's green across search, insert, AND delete (hash), then the only one that keeps order too (balanced tree / B-tree). That's the fundamental trade.</li>
      <li>In the race, set n = 100,000 and read the multiplier. That gap is the difference between "instant" and "hangs" — usually one word of code.</li>
      <li>Read the last chapter: attention is associative lookup, a vector DB is a spatial structure, a KV-cache is a table. The oldest idea here runs inside modern AI.</li>
    </ol></div>

    <h3 class="it-section-title">Landmark papers, textbooks &amp; where to go deeper</h3>
    ${SOURCES.map(sourceMarkup).join("")}`;
  body.appendChild(module);
  bindChapterTabs(module);

  // Lab 1: hash
  hashDraw();
  $("ds-hash-add").addEventListener("click", () => { const v = ($("ds-hash-in").value || "").trim(); hashAdd(v); });
  $("ds-hash-in").addEventListener("keydown", e => { if (e.key === "Enter") { const v = ($("ds-hash-in").value || "").trim(); hashAdd(v); } });
  $("ds-hash-demo").addEventListener("click", () => { SAMPLE_KEYS.slice(0, 6).forEach(hashAdd); });
  $("ds-hash-reset").addEventListener("click", () => { HT.table = makeHashTable(8); HT.lastIdx = -1; hashDraw(); });

  // Lab 2: heap
  heapDraw();
  $("ds-heap-add").addEventListener("click", () => { const x = 1 + ((Math.random() * 99) | 0); const r = heapInsert(HEAP.arr, x); HEAP.lastMoved = r.swaps.flat(); heapDraw("inserted " + x + " — sifted up " + r.swaps.length + " level(s)"); });
  $("ds-heap-min").addEventListener("click", () => { if (!HEAP.arr.length) { heapDraw("empty"); return; } const r = heapExtractMin(HEAP.arr); HEAP.lastMoved = r.swaps.flat(); heapDraw("extracted min = " + r.min + " — sifted down " + r.swaps.length + " level(s)"); });
  $("ds-heap-fill").addEventListener("click", () => { HEAP.arr = []; for (let i = 0; i < 7; i++) heapInsert(HEAP.arr, 1 + ((Math.random() * 99) | 0)); HEAP.lastMoved = []; heapDraw("filled with 7 random values"); });
  $("ds-heap-reset").addEventListener("click", () => { HEAP.arr = []; HEAP.lastMoved = []; heapDraw(); });

  // Lab 3: B-tree
  btInit(); btDraw();
  $("ds-bt-add").addEventListener("click", () => { if (BT.next < BT.seq.length) { const k = BT.seq[BT.next++]; btInsert(BT.tree, k); btDraw(k); } });
  $("ds-bt-add5").addEventListener("click", () => { for (let i = 0; i < 5 && BT.next < BT.seq.length; i++) { const k = BT.seq[BT.next++]; btInsert(BT.tree, k); } btDraw(); });
  $("ds-bt-reset").addEventListener("click", () => { btInit(); btDraw(); });

  // Lab 4: cost table
  module.querySelectorAll("#ds-table-body tr[data-struct]").forEach(tr =>
    tr.addEventListener("click", () => {
      module.querySelectorAll("#ds-table-body tr").forEach(r => r.classList.toggle("on", r === tr));
      const k = tr.dataset.struct;
      $("ds-table-out").innerHTML = "<span class='g'>" + STRUCTS[k].name + "</span> — reach for it when: " + WHENTO[k];
    }));

  // Lab 5: race
  raceDraw();
  $("ds-race-n").addEventListener("input", raceDraw);
}

window.openDataStructuresExperience = buildExperience;

// test hook (parity with other guides)
window.__dsTest = { hashStr, makeHashTable, htInsert, htStats, heapInsert, heapExtractMin, isValidHeap,
  makeBTree, btInsert, btSearch, btHeight, btCountKeys, btInOrder, STRUCTS, opCost };
})();
