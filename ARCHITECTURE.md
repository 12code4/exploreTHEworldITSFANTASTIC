# ARCHITECTURE

> How the atlas's worlds get built. [ATLAS.md](ATLAS.md) holds the book; each world's WORLD.md (see worlds/) says what that page is;
> [PHILOSOPHY.md](PHILOSOPHY.md) says what it must never become. This file
> turns both into engineering. Architect before you sculpt: nothing here is
> a hill yet — this is the frame the hills hang on.

---

## 1. Form

**A browser game. Vanilla JavaScript, ES modules, Canvas 2D, zero build
step, zero binary assets.** `index.html` + `src/` + `worlds/`, runnable by
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
  wind.js            THE one wind: global field + gusts; everything subscribes
  schedule.js        the routine lattice (people, ferry, tides, petals)
  camera.js          follow / gaze / overlook / sketch-world states
  input.js           keys + touch; walk, hop, sit, gaze, lift, talk
  render/
    painter.js       chunked static underpaint → offscreen canvases
    scene.js         y-sorted dynamic pass (people, cats, player, water)
    light.js         light pass: time-of-day grade, lamps, glow, god-gaps
    color.js         palette keys + region/hour grading (worlds/<name>/COLOR.md as data)
    particles.js     petals, butterflies, birds, rain, mist, motes, fireflies,
                     lanterns, chalk dust, eel shimmer
    showpieces.js    the Rose projection, the Glimmer shaft, wet-stone
                     reflections, moonbow, lantern water
    looker.js        the kaleidoscope lens: offscreen frame → 6-fold mirror
    sketch.js        the pencil→ink(→color) renderer for beyond the doorframe
  audio/
    ambience.js      wind / river / birds / sea, mixed by place + weather
    bell.js          the hour bell (flat third), synthesis; playable pattern
    echo.js          the Steps' doubled echo; hummable, teachable
    tune.js          plays the active world's melody from its pack
  journal.js         memory, sketches, strings, the player-drawn map; never counts
  dialogue.js        voices as grammars (DIALOGUE.md + worlds/<name>/VOICES.md), rotation, gestures
  people.js          routine-following characters; warmth flags; asks; gossip
  gestures.js        emitter runtime: light, sound, motion, smoke, COLOR as guidance
  save.js            localStorage: time, position, journal, scarf, name-learned
ATLAS.md             the book of worlds: the frame, the rules of pages
DIALOGUE.md          the Text Box Law (game-wide dialogue form)
worlds/
  <name>/            one directory per world — a WORLD PACK:
    WORLD.md         the world bible
    COLOR.md         its color script: keys, scores, its ten postcards
    VOICES.md        its voices (grammars + text-box sample banks)
    LEDGER.md        its mystery ledger, its own tithe
    layout.js        the master layout: regions, elevations, spine
    places/          one module per authored place (see schema)
    people/          one module per person: routine, grammar, asks, warmth
    clock.js         what drives time HERE (vale: sun/tides; house: the
                     Household's routine — quake, eruption, tides of the
                     Big Door, the Blue Hour, Vacuum Day)
    tune.js          this world's melody and its scattered fragments
    render.js        world-specific showpieces registered with the engine
  vale/              page I  — Wennow Vale
  house/             page II — the Great Indoors
```

**Multi-world engine contract:** the engine (`src/`) is shared and
world-blind; a world pack supplies data plus hooks — clock sources,
palette keys, gesture set, particle recipes, showpiece renderers, and
its verbs' tuning (the vale's slide is the house's banister; ant
wall-climbing is a world-supplied traversal rule, not an engine fork).
The atlas hub (the open book on the desk) is the smallest possible
scene: pages, a lamp, turn and step in. Save state is per world, except
the journal (one book, sections per world) and the scarf (stripes
travel). Rhymes between worlds ship as data coincidences, never as
code — the engine must not know the router and the lighthouse are
cousins.

**Files that will never exist:** `quests.js`, `objectives.js`, `xp.js`,
`inventory.js`, `minimap.js`, `achievements.js`, `shop.js`. A
`src/FORBIDDEN.md` states this in-repo so no future session "helpfully"
adds one. The absence is the feature.

---

## 3. The world as data — and the Interrogation as a validator

Every authored thing is a data module with a **mandatory `why`**. The
loader enforces the Law of Meant Things mechanically:

```js
// worlds/vale/places/saltmouth/boathouse.js
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

**Asks are data with preconditions, never a quest table:** `{who: 'perl',
when: 'morning', if: ['visited:locks'], ask: 'bread-round'}` — each ask
is a scene (lines + a carryable + a string), gated on context and
history, refusable, and finished by a world event, not a turn-in screen.
The loader rejects any ask whose resolution grants a countable.

**Voices are grammars in data:** each person's module declares their
syntax constraints from [DIALOGUE.md](DIALOGUE.md) and each world's VOICES.md (max
words, banned words, tics) and their line banks tagged by hour, weather,
and history. A dev-mode lint checks lines against the grammar — the
stiffness check is automated exactly like the Interrogation.

**Gossip is a token system:** deeds mint rumor tokens; tokens transfer
only when two people actually meet on the schedule lattice; each hop can
mutate the wording (data carries per-hop variants). News walks, at
walking speed, because it is literally carried.

**The Ledger** stays Markdown (`worlds/<name>/LEDGER.md`) — a table the build is
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
- **Color is a graded system, not paint** (`render/color.js`, data from
  each world's [COLOR.md](worlds/vale/COLOR.md)): each region carries a palette key;
  the renderer crossfades keys by position and hour. The detonation
  places (the Hollow, the Yards, the Rose, the Glimmer) are where the
  grade opens up — and every detonation has a physical source drawn in
  the world, because color without a source is forbidden by the script.
- **The wind is one system** (`wind.js`): a single global field with
  traveling gusts. Grass blades, cloth lines, petals, smoke, laundry,
  water chop, and lantern drift all sample the same field, so a gust is
  a visible event crossing the whole vale. This is the cheapest large
  purchase of "alive" in the whole engine.
- Particles carry half the life budget: petals (with the up-valley dusk
  wind vector — the famous mystery is literally a force field),
  butterflies (biased toward weld-yellow, per the ledger), birds, mist
  sheets, rain, pollen motes, fireflies, floating lanterns, chalk dust,
  eel-run shimmer.
- **Showpiece renderers** (`render/showpieces.js`) implement the ten
  postcards: the Rose's colored-light projection (polygon light lying on
  floor/pews/cat/player + motes in the shafts), the Glimmer's noon shaft
  (clock-keyed, clear-weather-keyed), wet flagstone reflections (the
  vale upside-down after rain), the moonbow, and Lantern Night's water
  (additive glows with wind-drifted paths).
- **The Looker** (`render/looker.js`): raise it and the frame renders
  through a six-fold mirrored-sector composite, slowly rotating with
  movement — any view becomes a mandala. A rendering mode as a toy,
  because we are a video game and can do that.
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
- `tune.js`: each melody as data (worlds/<name>/tune.js); fragments surface exactly
  as WORLD.md §7 places them (Perl's hum, wrong chalk notes, doubled echo,
  glowworm rhythm); plays whole only beyond the doorframe.
- Everything ducks for dialogue; silence is a deliberate mixer state
  (before wonder — the philosophy's "wonder needs silence before it").

---

## 8. Saving, the journal, and what is never stored

`save.js` keeps: world time, weather seed, player position, journal
entries (sketches, names, rumors in the speaker's words, the path-memory
polyline for her bench and the journal map), **strings** (open promises,
each just an asker-id and a sketch — no text, no status field beyond
tied/untied), the scarf's stripe history (colors in dip order — the
player's palette autobiography), warmth-memories, gossip state (which
rumor tokens have reached whom), and whether the vale's name has been
learned (the title that learns). 

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
   materials audit against WORLD.md, Forbidden sweep of the codebase,
   and the full test ritual on fresh players.

Where the population pass lands in the milestones: the wind system and
color grading are **First Light** work (they are the light pass's
siblings); the Rose, chalk, bell-ringing, asks/strings, and gossip land
in **Noon Bell**; the Hollow, the Glimmer, and the Looker in **Hush &
Stone**; the Dye Yards, the scarf, and the rain rush in **High Water**;
Lantern Night, the echo game, and the moonbow in **Inks**. No milestone
count changes; the vale got denser, not longer.

**The House's track** (begins after the vale's proof-of-vale gate
passes, sharing every engine system the vale forced into existence):

1. **Bag Day** — arrival playable: the strawberry bag, the forage line,
   Skirting Town's fairy-light main street, Rule 3 on the slate.
2. **The 7:38 Run** — the Household clock end to end (Quake → Big
   Dark), the toaster eruption, forage lines, Marm.
3. **Big Smooth** — the Roomba ferry, the hallway tides, the Meteor,
   envelope sledding, the key bowl.
4. **The Blue Hour** — living room: carpet savanna, Couch Mountains and
   the Under-Couch digs, the Screen, the Bright's migration, the LED
   constellation. *Proof-of-house gate here.*
5. **Upstairs** — study and bathroom: bookshelf city, Sylvia, Vesper
   and the lamp, the Blinkbox vigil, steam jungle, the Backwards Town.
6. **Vacuum Day** — the Storm, its omens, its aftermath postcard; the
   Dog's crumb, wink, and stairs.
7. **The Hatch** — the attic, the Dollhouse, the knot-hole, the wave.
   The tune assembled from fridge-hum up.

**House-specific engineering** (registered via the world pack, not
forked into the engine): wall/ceiling traversal (gravity is a
world-supplied rule; camera rolls gently on wall transitions, and the
lampshade Overlook is the vista state upside-down); the Bright as a
scheduled projected-light entity (the one light source that MOVES on
the clock — engine light pass already supports it); Big Smooth as a
scheduled vehicle (the ferry code, re-skinned, plus a stuck state and a
distress note); the LED constellation as night point-lights with per-
appliance colors; muffled-Human audio (voices as filtered melody, never
words); dust-bunny herds as drifting soft-body particle flocks; scale
FX (depth-of-field fake via layer blur at mesa edges, giant-object
parallax so a countertop reads as terrain).

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
  with notes kept in the repo under `worlds/<name>/playtests/`.

---

## 11. The one rule about all of this

Everything above is scaffolding for a feeling. When any technical choice
here collides with the vale being beautiful, charming, detailed, alive,
mysterious, or wondrous — the tech yields, this file gets edited, and the
philosophy stays untouched. The fable is the dream; the contrapositive is
the job; the code is just the shovel.
