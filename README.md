# The Web of Computation

An interactive deep-space map of computing history — Babbage (1822) to the LLM era (2026).
Companion to the Web of Mathematics. Pure HTML/CSS/JS, no build step, GitHub-Pages ready.

## Deploy (same as differential-geometry-lab / web-of-mathematics)

```bash
git init && git add . && git commit -m "Web of Computation v1"
git branch -M main
git remote add origin https://github.com/<you>/web-of-computation.git
git push -u origin main
# GitHub → Settings → Pages → Source: main / root
```

Or preview locally: `python3 -m http.server` then open http://localhost:8000

For an existing clone of this repository, deploy an update with:

```bash
git add app.js index.html information-theory.js classical-cryptography.js modern-cryptography.js README.md
git commit -m "Add interactive cryptography field guides"
git push origin main
```

## What's on the map

- **8 domain nebulae** (Foundations, Hardware, Algorithms, Languages, Information,
  Data, Symbolic AI, ML/DL) — click to zoom into their **31 fields**, click a field
  for its **119 topics** (discoverer · year · one-line definition).
- **The time scrubber** (bottom): drag 1822 → 2026 or press ▶. The sky tints by era
  (brass → phosphor green → mainframe silver → frost during the two AI winters →
  nebula gold), and every node ignites at its birth year. Gold dots on the track
  are the nine load-bearing moments.
- **Containment shells**: AI ⊃ ML ⊃ Neural Networks ⊃ Deep Learning, drawn as
  nested orbits — the buzzword hierarchy, resolved.
- **Pioneer constellation** (top): 20 featured pioneers as illustrated avatars,
  in chronological order. Click one for a full biography; all 65 are in the
  pioneer gallery (see below).
- **Status weather** on every field: 🏛 marble glow · 🔥 flickering ember ·
  ⚙️ steady teal · 🪦 dim gravestone · 🧟 pulsing back to life.
- **Gold bridges** with mediating concepts (Shannon 1937, entropy → cross-entropy,
  Bellman → RL, CUDA → AlexNet…) and **red lightning controversy edges**
(Minsky vs Rosenblatt, Chomsky vs LLMs).

## Crack-open animations (`crack.js`)

Clicking a domain cracks it open into exactly as many pieces as it has fields;
clicking a field cracks it into its topics, which then orbit it (click a topic
to jump to its card in the panel). Five styles are built in, so they can be
compared live before one is chosen:

| | Style | Used by default on |
|---|---|---|
| A | Walnut crack | Foundations, ML & Deep Learning |
| B | Glass shatter | Hardware, Data Science |
| C | Peel & bloom | Algorithms |
| D | Aperture iris | Languages, Symbolic AI |
| E | Supernova | Information & Cryptography |

At field level the styles rotate, so every domain shows several of them. The
**✦ crack style** picker (bottom-left) forces one style everywhere and replays
it immediately; the choice is remembered in the browser. To settle on one style
for good, edit `DOMAIN_STYLE` / `styleForField` in `crack.js`. Visitors who
prefer reduced motion get the final layout without animation.

## Pioneers (`pioneers-data.js`, `pioneers.js`)

- **65 pioneers**, from Babbage to today's frontier labs: each has a role line,
  an epitaph, a year-by-year timeline, key papers with links, a legacy note,
  and links to their fields on the map ("On the map" lights them up).
- **Biography panel**: click any portrait in the constellation. Arrows step to
  the previous/next pioneer in time.
- **Gallery**: the **▦ pioneer gallery** button lists everyone grouped by era,
  with search and filters (by domain, or living only).
- **Avatars and portraits**: every pioneer has an original illustrated avatar
  in one consistent style (`avatars.js`, traits per person). A freely licensed
  photo added in `portraits/` replaces it automatically (see
  `portraits/README.md`); photos are shown through one gold-and-purple duotone
  so the set looks consistent.
  `tools/fetch_portraits.py` can fetch licensed photos from Wikimedia Commons
  and write the credits automatically.
- To add a person: append an entry to `PEOPLE` in `pioneers-data.js` (the
  header comment lists the fields). Dates marked "c." are approximate.

## Field guides for every field

Every one of the 31 fields now opens an interactive field guide in the side
panel: a timeline, working labs, WHAT · HOW · STORY · TODAY chapters, things to
try, the field's topics, and landmark sources. The 17 newest guides live in
`guides/` and share `guide-kit.js`, so each file holds only its content and
labs:

| Domain | Guides (labs) |
|---|---|
| ML & Deep Learning | Neural Prehistory · Classical / Statistical ML · Learning Paradigms · Deep Learning Architectures · The LLM Era · Deep RL & Games |
| AI (symbolic) | Founding Documents · Symbolic AI / GOFAI · Classic Milestones · Agents & Decision Theory |
| Algorithms | Design Paradigms |
| Languages & Systems | Languages & Paradigms · Compilers & Type Theory · Operating & Distributed Systems |
| Data | Databases · Statistics as Computation · Data Engineering & Practice |

To add a guide: create `guides/<field-id>.js` that calls
`GuideKit.register("<field-id>", { … })` (copy any existing guide as a
template) and add its `<script>` tag to `index.html`.

## Information & Cryptography field guides

The three fields in this domain now open long-form, playable learning experiences
without changing the main map:

- **Information Theory** — entropy/capacity controls, noisy-channel transmission,
  expandable WHAT · HOW · STORY · TODAY chapters, and foundational sources.
- **Classical Cryptography** — Caesar, Vigenère and one-time-pad experiments,
  animated frequency analysis, guided cracking, an Enigma companion launch, five
  historical chapters, and primary/foundational sources.
- **Modern Cryptography** — animated Diffie–Hellman exchange and attack, a working
  toy RSA locksmith and factoring attack, a zero-knowledge cave challenge, five
  conceptual chapters, and links from the 1976 public-key paper through NIST's
  current post-quantum standards work.

## Going deeper (`topics-data.js`, `extras.js`)

- **Every topic has a "deeper" drawer.** All 119 topic cards, in every field,
  open to *the idea · the story · why it matters now*, a primary source, and
  chips for any pioneer involved. Clicking a topic node on the map scrolls to
  its card and opens the drawer. "open all" expands a whole field at once.
  Guides that replace the raw topic list get it added back at the end.
- **Bridges and controversies are full stories.** Each gold bridge shows what
  flows between the two continents, the history, where it stands today, the
  people and the sources. The two ⚡ controversies (Minsky vs Rosenblatt,
  Chomsky vs LLMs) set out both sides and the current evidence, and let you
  pick a side (saved only in your browser).
- **Extra labs** for the thinner guides: Huffman coding with a live tree and
  Hamming(7,4) error correction (Information Theory), and the SHA-256
  avalanche with a 500-flip histogram (Modern Cryptography; pure-JS SHA-256,
  checked against Node's `crypto`).

To edit a topic's depth, find its `"fieldId|topic name"` key in
`topics-data.js`. Bridge and controversy stories live in `EDGE_DETAIL` in
`extras.js`, keyed by the edge's label in `data.js`.

## Editing (the whole point)

All content lives in **`js/data.js`** — no code changes needed:

- Add a topic: append `{n, y, who, s, d}` to any field's `topics` array
  (and optionally its `"fieldId|name"` entry in `topics-data.js`).
- Add a field: append to `FIELDS.<domain>` — it auto-orbits its domain.
- Statuses: `found` 🏛 · `fire` 🔥 · `work` ⚙️ · `obs` 🪦 · `rev` 🧟.
- Add a bridge or a controversy the same way; the scrubber picks up every `y`
  automatically. Pioneers live in `pioneers-data.js`.

## Playable atoms (Part 3 — done)

Open via the **⚛ playable atoms** button, or from the gold launch button inside
Computability, Classical Cryptography, Neural Prehistory, Deep Learning, and
LLM Era field panels:

1. **Turing machine** — step/run a binary increment on a live tape.
2. **Enigma** — historical rotor I·II·III wirings + reflector B; watch the
   signal path and the rotors step (why the same key gives different letters).
3. **Perceptron vs XOR** — 1958→1969→1986 in one toy: a single layer thrashes
   forever; tick “hidden layer” and backprop bends the boundary.
4. **Gradient descent marble** — one η slider: too hot diverges, too cold crawls.
5. **Attention head** — live softmax(Q·Kᵀ/τ) heatmap over four tokens with a
   temperature slider.
