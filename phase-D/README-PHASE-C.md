# Phase C — the playable atoms

Five interactive toys layered onto the Web of Computation. `atoms.js` is fully
self-contained: it injects its own CSS and DOM, so it cannot break anything in
the Phase B build.

## The five atoms (all mechanisms are real, verified in Node)

| Atom | What it really does | Verified |
|---|---|---|
| Turing machine | binary increment via a 2-state rule table; step / run / reset | halts with 1011 → 1100 |
| Enigma | historical Wehrmacht rotor wirings I·II·III + reflector UKW-B, odometer stepping with double-step | `AAAAA → BDZGO` (matches the real machine); reciprocity confirmed; zero self-maps in 500 presses |
| Perceptron vs XOR | online perceptron rule (thrashes forever on XOR), then a 2-3-1 tanh MLP trained by genuine backprop | MLP solves XOR on 19/20 random inits |
| Gradient marble | x ← x − η·f′(x) on a two-valley quartic; log-scale learning-rate slider; visible divergence | converges / traps / diverges as η dictates |
| Attention head | genuine softmax(QKᵀ/√d)·V over 4 tokens with a temperature slider | rows sum to 1.000; sat→cat, cat→the, down→sat |

## Deploy — three steps

1. **Test first**: open `demo.html` locally (double-click it). Play all five atoms.
2. **Copy** `js/atoms.js` into your repo's `js/` folder.
3. **Add one line** to `index.html`, after app.js:

```html
<script src="js/data.js"></script>
<script src="js/app.js"></script>
<script src="js/atoms.js"></script>   <!-- ← Phase C -->
```

Commit, push, done — GitHub Pages picks it up like every other file.

## Optional: wire atoms into the field panels

`atoms.js` exposes two globals for app.js to use:

```js
window.ATOM_FOR              // { "computability":"turing", "classic-crypto":"enigma", ... }
window.openAtomFromField(id) // opens the atom mapped to a field id, if any
```

In app.js, wherever the glassmorphic panel body for a *field* is built, add:

```js
if (window.ATOM_FOR && window.ATOM_FOR[field.id]) {
  html += `<button class="panel-atom-btn"
             onclick="openAtomFromField('${field.id}')">⚛ play with this idea</button>`;
}
```

If a field id in your data.js differs from the keys above (open data.js and
check the FIELDS keys), just edit the `ATOM_FOR` map at the top of atoms.js —
it's the first thing in the file.

Without this wiring everything still works: the floating **⚛ playable atoms**
button opens the overlay from anywhere.

## Accessibility / behaviour notes

- Esc closes the overlay; clicking the dimmed backdrop closes it too.
- `prefers-reduced-motion` disables all transitions.
- All animation loops are cancelled on tab-switch and on close (no background CPU burn).

---

# Phase D — the contested sky (`js/phase-d.js`)

Same contract as Phase C: self-injecting, one script tag, cannot break Phase B.

```html
<script src="js/atoms.js"></script>
<script src="js/phase-d.js"></script>   <!-- ← Phase D -->
```

Three layers behind the **☄ contested sky** button:

1. **Research comets** — your papers (PIKAN, Phantom-SBI, ZTF periods, Ramanujan
   transform) drawn as animated gold comets ON the map SVG itself, each orbiting
   its parent concept, with a lab-notebook card per paper. **Nudge the
   `anchor:{x,y}` coordinates at the top of phase-d.js** (map viewBox is
   1600×1000) so each comet sits beside the right field node on your deployed
   map. Clicking a comet head or label opens its card.
2. **Disputes** — six red-lightning cards: Minsky⚡Rosenblatt,
   symbolic⚡connectionist, Chomsky⚡LLMs, the Schmidhuber attribution wars,
   the Lighthill winter, Bayesians⚡frequentists (the last one is secretly
   about Phantom-SBI).
3. **Frontier fog** — 2024–26 items deliberately left hazy and dated
   ("last surveyed july 2026"). Re-survey every few months; promote survivors
   onto the map proper.

All content lives in three plain arrays (`COMETS`, `DISPUTES`, `FOG`) at the
top of the file — editing the map's future is editing a JS array.

Public API: `openContestedSky("comets"|"disputes"|"fog")`, `openComet(id)` —
so app.js panels can deep-link (e.g. a KAN node can offer "☄ see the PIKAN
comet").

If `#map` is absent the comets simply don't draw; the overlay still works.
