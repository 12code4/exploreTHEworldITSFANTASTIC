# ARCHITECTURE

> How Wennow Vale gets built. [WORLD.md](WORLD.md) says what the vale is;
> [PHILOSOPHY.md](PHILOSOPHY.md) says what it must never become. This file
> turns both into engineering. Architect before you sculpt: nothing here is
> a hill yet — this is the frame the hills hang on.

---

## 1. Form

**A browser game. Vanilla JavaScript, ES modules, Canvas 2D, zero build
step, zero binary assets.** `index.html` + `src/` + `world/`, runnable by
opening the page (or any static server), deployable from the repo as-is.

Why this and not an engine:

- **Every mark hand-made.** All art is drawn in code — painterly canvas
  work in the project's established language (the valley hero of the
  philosophy page is the proof of style: layered ridges, seeded detail,
  light as the protagonist). No asset pipeline means no stock anything;
  the Law of Meant Things extends to every pixel's provenance.
- **All sound synthesized.** WebAudio, no samples: wind is filtered noise,
  the river is layered noise with motion, the bell is an FM strike (with
  its flat third — the crack is in the synth), birds are grain chirps, the
  tune is ours. The vale sounds like nowhere else because it is played,
  not sampled.
- **No engine gravity.** Engines ship with quest scaffolds, minimaps,
  pickup glints — defaults that pull toward the Forbidden list. Our
  engine's defaults are the Ten Laws because we write the engine.
- **Inspectable forever.** View-source is in the spirit of the vale.

**Perspective:** top-down 3/4 (objects drawn with height), one continuous
world space, camera that breathes (see §5). Chosen over side-view (worlds
read as corridors — forbidden) and over 3D (beauty bar unreachable at our
scale without generic-asset compromise). The Law of the Horizon is served
mechanically by the overlook camera: vistas are the real world seen small,
not painted backdrops — everything visible is the actual, walkable place.

---

## 2. Repository shape

```
index.html
src/
  main.js            boot, loop, fixed-step update / rAF render
  clock.js           world time, phases, persistence   ← FIRST SYSTEM BUILT
  weather.js         states, transitions, the rare Green Evening
  schedule.js        the routine lattice (people, ferry, tides, petals)
  camera.js          follow / gaze / overlook / sketch-world states
  input.js           keys + touch; walk, hop, sit, gaze, lift, talk
  render/
    painter.js       chunked static underpaint → offscreen canvases
    scene.js         y-sorted dynamic pass (people, cats, player, water)
    light.js         light pass: time-of-day grade, lamps, glow, god-gaps
    particles.js     petals, birds, rain, mist, fireflies, chalk dust
    sketch.js        the pencil→ink renderer for beyond the doorframe
  audio/
    ambience.js      wind / river / birds / sea, mixed by place + weather
    bell.js          the hour bell (flat third), synthesis
    tune.js          the vale's one melody and its scattered fragments
  journal.js         memory, sketches, the player-drawn map; never counts
  dialogue.js        rotating lines by clock/weather/warmth-memory
  people.js          routine-following characters; warmth flags (untracked UI)
  gestures.js        emitter runtime: light, sound, motion, smoke as guidance
  save.js            localStorage: time, position, journal, name-learned
world/
  vale.js            the master layout: regions, elevations, the river
  places/            one module per authored place (see schema)
  people/            one module per person: routine, lines, warmth hooks
  LEDGER.md          the mystery ledger (human-readable, audited)
  tune.js            the melody as data; who carries which fragment, how bent
```

**Files that will never exist:** `quests.js`, `objectives.js`, `xp.js`,
`inventory.js`, `minimap.js`, `achievements.js`, `shop.js`. A
`src/FORBIDDEN.md` states this in-repo so no future session "helpfully"
adds one. The absence is the feature.

---

## 3. The world as data — and the Interrogation as a validator

Every authored thing is a data module with a **mandatory `why`**. The
loader enforces the Law of Meant Things mechanically:

```js
// world/places/saltmouth/boathouse.js
export default {
  id: 'boathouse',
  region: 'saltmouth',
  at: [1180, 4020],
  why: "Odd's late father built hulls; the upturned one is his last, " +
       "kept dry and useful. Maren patched its cracks with a spoiled " +
       "sheet of her first survey — she papered half the vale.",
  sketches: [ /* draw-calls: authored painterly primitives */ ],
  details: [
    { id: 'map-patch', at: [12, -8],
      why: "the vale drawn young; first Maren-mark; rewards leaning in",
      gaze: { journal: 'sketch', close: 'map-patch-view' } },
  ],
  gestures: [
    { kind: 'motion', what: 'gull-perch', when: 'morning' },
  ],
}
```

`loadWorld()` **refuses to load** any place, detail, person, or particle
source whose `why` is missing or shorter than a sentence. The build fails
the Interrogation exactly the way the philosophy demands: if we cannot
answer for a thing, the thing does not ship. This is the single most
important line of engineering in the project.

**Gesture emitters** are data, not scripts: `{kind: light|sound|motion|
smoke|scent-of, what, when, radius}`. The renderer and mixer interpret
them. A place's guidance budget (per the commitments) is literally the
list of its emitters — reviewable, auditable, per place.

**Schedules** are timetable data: `{who: 'sela', at: 'afternoon+0.2',
do: 'wind-gates', where: 'locks'}`. The lattice in WORLD.md §5 is one
file a human can read against the fiction.

**The Ledger** stays Markdown (`world/LEDGER.md`) — a table the build is
audited against, not runtime data. Mysteries live in the world's details;
the ledger just keeps us honest about answers and the tithe.

---

## 4. The loop and the clock

- Fixed-step simulation (60 Hz) + rAF rendering; `clock.js` owns world
  time. **A day ≈ 24 real minutes** (tunable constant, set during First
  Light). Time, weather seed, and schedules advance from the clock alone —
  never from player "progress," which does not exist as a concept.
- Time persists via `save.js`. Returning players re-enter the hour they
  left; the vale has meanwhile done whatever the lattice says it did.
- The clock is built **first**, before any geometry, per the commitments:
  life is a property of the simulation, not a coat of paint.

---

## 5. The camera that breathes

Four states, all eased, all interruptible by walking:

1. **Follow** — slightly ahead of travel, slow leash.
2. **Gaze** — hold-to-look: eases toward the gazed thing, tightens
   framing; may commit a journal sketch.
3. **Overlook** — entering a vista zone breathes the camera out until the
   region below is visible small and alive (LOD painter renders far chunks
   simplified; schedule-driven actors still move — the ferry visibly
   crosses). This is Law 1 as a mechanic and the project's signature shot.
4. **Sketch** — beyond the doorframe: hands rendering to `sketch.js`,
   which draws the world as pencil and inks it radially around the
   player's steps.

No screen-space UI exists in any state. The journal is a full-screen
place, not an overlay; sitting is the "pause menu."

---

## 6. Rendering plan

- World space in px; regions authored in **chunks** (~1024²). `painter.js`
  renders each chunk's static art once to an offscreen canvas (seeded
  painterly primitives: ridge fills, stroke grass, stone hatching), cached
  LRU ~9 chunks; dynamics composite on top y-sorted.
- **Light is a pass, not a decoration:** time-of-day grade over the frame;
  additive lamps/glow (lighthouse, windows, fireflies, the warm chimney);
  canopy gaps project moving light shapes in the Hushes. The philosophy's
  "beauty is direction" is implemented here — gesture emitters of kind
  `light` feed this pass.
- Particles carry half the life budget: petals (with the up-valley dusk
  wind vector — the famous mystery is a particle force field), birds,
  mist sheets, rain, chalk dust, eel-run shimmer.
- Internal resolution ~960×540 letterboxed, integer-ish scale to fit;
  60 fps on a mid laptop is the budget; chunk cache and pass count are
  the levers.

---

## 7. Audio plan

- `ambience.js` mixes per place + weather + hour: wind (filtered noise,
  moor-heavy), river (noise layers, gains by proximity), sea (slow swell),
  birds (grain synthesis, converging on the Green Chapel), hush gradient
  in the wood (the quieter-deeper rule is a mixer curve).
- `bell.js`: FM strike, partials detuned so the third rings flat — the
  crack is canon, therefore it is in the synthesis.
- `tune.js`: the melody as data (world/tune.js); fragments surface exactly
  as WORLD.md §7 places them (Perl's hum, wrong chalk notes, doubled echo,
  glowworm rhythm); plays whole only beyond the doorframe.
- Everything ducks for dialogue; silence is a deliberate mixer state
  (before wonder — the philosophy's "wonder needs silence before it").

---

## 8. Saving, the journal, and what is never stored

`save.js` keeps: world time, weather seed, player position, journal
entries (sketches, names, rumors in the speaker's words, the path-memory
polyline for her bench and the journal map), warmth-memories, and whether
the vale's name has been learned (the title that learns). 

**No save field may be a counter of world content.** No
`secretsFound: 7/40` can exist even internally, because whatever exists
internally eventually leaks into a screen. The journal map draws from the
path polyline — where you walked — never from a checklist of places.

---

## 9. Build order — the milestones

Each milestone ends **playable** and ends with the Tests run (below).
Named for the vale, not numbered for a sprint board:

1. **First Light** — loop, clock, input, camera-follow; a walkable clay
   vale (grey masses, right sizes); the light pass running. The world is
   beautiful before it is full: dawn/dusk grading proves out on clay.
2. **The Crossing** — arrival playable: ferry ride in, Saltmouth built,
   the lighthouse blinking sevens, first gestures, Odd's opening lines.
3. **Noon Bell** — Wennow Cross: village art, the bell, people walking
   the lattice, dialogue system, cats with jobs, the seventh chimney
   (warm at dusk, answering nothing).
4. **The Bend** — Pear Ridge, the tree, Fen and the telescope, and the
   overlook camera: the signature breath. **Proof-of-vale gate:** if the
   Landing→Cross→Bend ten minutes aren't fantastic, we stop and fix
   before building up-valley.
5. **Hush & Stone** — the Hushes (lost-is-nice tuning), the Nine Cats,
   the Under, fireflies, the tenth-stone thread strung end to end.
6. **High Water** — the Locks, Sela, gate-riding, eel run, the laundry,
   petals-upstream force field, the Steps and the true way-marks.
7. **The Page** — the Head: hut, the map-with-you-in-it, doorframe,
   sketch renderer, the wave. The tune assembled.
8. **Inks** — journal complete (sketches, the map in your line, the
   title that learns), audio full mix, weather including the Green
   Evening, save polish.
9. **The Tithe** — ledger audit (answers reachable, nevers untouched),
   materials audit against WORLD.md §8, Forbidden sweep of the codebase,
   and the full test ritual on fresh players.

---

## 10. Running the philosophy's Tests during build

- **Postcard:** a dev key saves unstaged screenshots; every milestone
  review flips through them. Failures are place-bugs, filed as such.
- **Interrogation:** enforced by the loader (§3) — continuously.
- **Silent Walk:** we can watch real players; between sessions we also
  run a headless drift-bot that walks toward the strongest nearby
  gesture signal and logs where it stalls. The stall heatmap is our bug
  tracker, exactly as the philosophy orders. (The bot measures the
  world's pull; it is not an autoplayer and never gates anything.)
- **Rumor / Detour / Return:** human rituals at every milestone's end,
  with notes kept in the repo under `world/playtests/`.

---

## 11. The one rule about all of this

Everything above is scaffolding for a feeling. When any technical choice
here collides with the vale being beautiful, charming, detailed, alive,
mysterious, or wondrous — the tech yields, this file gets edited, and the
philosophy stays untouched. The fable is the dream; the contrapositive is
the job; the code is just the shovel.
