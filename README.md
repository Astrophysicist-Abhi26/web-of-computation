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
- **Pioneer constellation** (top): 15 portrait stars. Click Turing and the four
  continents he touched light up; each card carries dates, epitaph, and fate.
- **Status weather** on every field: 🏛 marble glow · 🔥 flickering ember ·
  ⚙️ steady teal · 🪦 dim gravestone · 🧟 pulsing back to life.
- **Gold bridges** with mediating concepts (Shannon 1937, entropy → cross-entropy,
  Bellman → RL, CUDA → AlexNet…) and **red lightning controversy edges**
  (Minsky vs Rosenblatt, Chomsky vs LLMs).

## Editing (the whole point)

All content lives in **`js/data.js`** — no code changes needed:

- Add a topic: append `{n, y, who, s, d}` to any field's `topics` array.
- Add a field: append to `FIELDS.<domain>` — it auto-orbits its domain.
- Statuses: `found` 🏛 · `fire` 🔥 · `work` ⚙️ · `obs` 🪦 · `rev` 🧟.
- Add a pioneer, a bridge, or a controversy the same way; the scrubber picks up
  every `y` automatically.

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

