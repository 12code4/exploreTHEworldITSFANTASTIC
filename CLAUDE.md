# exploreTHEworldITSFANTASTIC — read this first

An exploration game built on one fable: **IF A WORLD IS FANTASTIC, IT'S
EXPLORED.** The world is **Wennow Vale**, the second mapmaker's valley.

Canon and precedence, in order:

1. **[PHILOSOPHY.md](PHILOSOPHY.md)** — the laws. Wins every argument.
   Ten Laws, the Forbidden list, the Covenant, the Tests. Never build
   markers, quests, XP, minimaps, meters, or counters — the absence is
   the feature.
2. **[WORLD.md](WORLD.md)** — the vale: regions, people, clock, verbs,
   the Maren throughline, the tune, the ending.
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** — the build: vanilla JS + Canvas
   2D, no build step, no binary assets (all art drawn in code, all sound
   synthesized), world-as-data with a **mandatory `why` field the loader
   enforces**, milestones named First Light → The Tithe.
4. **[world/COLOR.md](world/COLOR.md)** — the color script. Palette keys,
   region scores, the ten postcards. Color always has a source; the vale
   is naturalistic and holds detonations — never evenly colorful.
5. **[world/DIALOGUE.md](world/DIALOGUE.md)** — the voice bible. Voices
   are grammars; nobody says the theme; read every line aloud. The
   stiffness rules are checked like the Interrogation is.
6. **[world/LEDGER.md](world/LEDGER.md)** — the mystery ledger. Rows
   marked NEVER stay unanswered forever; do not "fix" them. New mysteries
   get a row before they ship.

Working rules for any session:

- Every placed object needs a `why` that is a story. If you can't write
  it, don't place the thing.
- Guidance is diegetic only (light, sound, motion, smoke — gesture
  emitters in data). If a place needs finding, the place does the asking.
- The world clock drives everything; nothing keys off player "progress,"
  which does not exist as a concept anywhere in the code or save data.
- Keep the vale's voice: warm, specific, a little crooked. Distances in
  bells. No money — customs. Nobody assigns tasks through any interface;
  people ASK, face to face (PHILOSOPHY.md Amendment I), and promises are
  strings on the journal — never a log, never a tracker, never a reward
  tab.
- Test rituals per PHILOSOPHY.md §Tests at every milestone; playtest
  notes go in `world/playtests/`.

Dev branch: `claude/fable-world-philosophy-gz5jeq`. Push there only.
