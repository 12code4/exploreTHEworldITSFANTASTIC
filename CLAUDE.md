# exploreTHEworldITSFANTASTIC — read this first

An exploration game built on one fable: **IF A WORLD IS FANTASTIC, IT'S
EXPLORED.** The game is an **atlas of worlds** — pages in a book. Page I
is **Wennow Vale** (a sea-valley); page II is **the Great Indoors** (a
modern house at ant height).

Canon and precedence, in order:

1. **[PHILOSOPHY.md](PHILOSOPHY.md)** — the laws. Wins every argument, in
   every world. Ten Laws, the Forbidden list, the Covenant, the Tests,
   and the Amendments (I: asks & strings; II: three temptations per
   screen). Never build markers, quests-with-logs, XP, minimaps, meters,
   or counters — the absence is the feature.
2. **[ATLAS.md](ATLAS.md)** — the book: how worlds relate, what crosses
   pages (the traveler, the journal, the scarf, strings), what never
   does (portal lore, explanations).
3. **[DIALOGUE.md](DIALOGUE.md)** — the Text Box Law, game-wide: 1–2
   short sentences per box, one bit per person, declare don't perform,
   loops are honest, the chorus is deep. Every world's VOICES.md obeys
   it.
4. **worlds/<name>/** — each world's pack: `WORLD.md` (bible),
   `COLOR.md` (palette keys, detonations, ten postcards), `VOICES.md`
   (grammars + text-box samples), `LEDGER.md` (mysteries; NEVER rows
   stay unanswered forever — do not "fix" them; new mysteries get a row
   before they ship).
5. **[ARCHITECTURE.md](ARCHITECTURE.md)** — the build: vanilla JS +
   Canvas 2D, no build step, no binary assets; shared world-blind
   engine + world packs; the mandatory `why` field the loader enforces;
   milestone tracks per world (vale: First Light → The Tithe; house:
   Bag Day → The Hatch).

Working rules for any session:

- Every placed object needs a `why` that is a story. If you can't write
  it, don't place the thing.
- Guidance is diegetic only (light, sound, motion, smoke, color — gesture
  emitters in data). If a place needs finding, the place does the asking.
- Each world's clock drives everything in it; nothing keys off player
  "progress," which does not exist as a concept anywhere.
- Nobody assigns tasks through any interface; people ASK, face to face
  (Amendment I), and promises are strings on the journal.
- Density per Amendment II: every screenful holds three temptations,
  each of which still passes the Interrogation.
- Dialogue: text boxes, per the law. Read every line in two seconds
  while imagining mashing A.
- Test rituals per PHILOSOPHY.md §Tests at every milestone; playtest
  notes in `worlds/<name>/playtests/`.

Dev branch: `claude/fable-world-philosophy-gz5jeq`. Push there only.
