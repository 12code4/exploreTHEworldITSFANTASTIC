# exploreTHEworldITSFANTASTIC

> **IF A WORLD IS FANTASTIC, IT'S EXPLORED.**

An exploration game built on one fable and nothing else. The game is an
**atlas of worlds** — pages in a book — and page I is now walkable:

### ▶ Play Wennow Vale

Open `index.html` in a browser (or any static server: `python3 -m
http.server` and visit the port). No build step, no assets, no install.
You arrive on the morning ferry with a journal, an undyed scarf, and
time. Nobody will tell you where to go. That's the whole point.

**Keys:** arrows/WASD walk · E/Space touch, talk, advance · J journal ·
M sound · L the Looker (once you've earned it). Tap works too.

The vale runs on a 24-minute day that keeps going without you: the bell
rings the hours (you can ring it; ring thirteen and see), the lighthouse
blinks in sevens, petals go upstream of an evening, the moor burns
violet at dusk, and the mysteries in [worlds/vale/LEDGER.md](worlds/vale/LEDGER.md)
marked NEVER are never coming. Some things only happen at clear noon.
Some only on full-moon nights. Sit on benches.

### The book

- **[PHILOSOPHY.md](PHILOSOPHY.md)** — the laws every page obeys.
- **[ATLAS.md](ATLAS.md)** — how worlds relate; what crosses pages.
- **[DIALOGUE.md](DIALOGUE.md)** — the Text Box Law.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — the world-blind engine +
  world packs; the `why` validator (`tools/lint.js` runs it standalone).
- **worlds/vale/** — page I: bible, color script, voices, mystery
  ledger, and all placed content. **worlds/house/** — page II, planned:
  the Great Indoors, a modern house at ant height. Sculpting next.

Every object in the vale carries a `why` that is a story, and the loader
refuses to boot anything that can't say why it's here.
