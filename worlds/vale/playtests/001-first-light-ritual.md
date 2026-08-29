# Playtest ritual 001 — the vale populated

Per PHILOSOPHY.md §Tests. Conducted with headless walks and screenshots;
the postcards are in `postcards/`. The human ritual (Silent Walk with real
players, Rumor, Detour, Return) still needs real hands and should be run
before milestone *The Tithe* is called done.

**Postcard Test** — nine unstaged captures kept: dawn at the landing (the
heron holds the rock), the ford, the Cross at morning and at night (the
windows tell the truth), the Rose firing at clear noon, the Dye Yards in
flags, the Nine Cats violet at dusk, the Bend's overlook breath, her bench
above the gorge. All send-worthy. The moor at noon under heather is the
strongest; the empty east flank of the ridge at overlook zoom is the
weakest corner noted — distance reads as tone, acceptable, revisit.

**Interrogation** — `node tools/lint.js`: 196 objects, 23 people, 11
hooks; zero missing whys. The validator threw twice during the build and
both objects were given lives or removed, which is the system working.

**Silent Walk (bot)** — `?at=locks&walkto=hut` and `?at=stepsfoot&walkto=herbench`
both arrive; the gorge stair corridor is traversable end to end. The
petals visibly ride upstream at dusk along the east bank. Full-vale walk
(landing → hut) not yet run in one take; run it with real hands.

**Known small truths** — lantern-night drifters take a real minute to
pass any given bank (correct, but don't screenshot-hunt them); the coast
road fords a shallow at the coastfork and everyone paddles (kept — the
coast road paddles); broken first-paint frames under headless virtual
time were the blocking font fetch and are fixed (non-blocking load).

**Tithe check** — content sweep found no file explaining the sevens, the
seventh chimney, the double echo, or the Green Evening. Folklore only,
as the Ledger orders.

**Addendum, after the quality gate** — four hunters (state/flow,
render/perf, content-runtime, canon) filed 18 findings; every
substantive one was verified by hand against the code and fixed: the
Sela talk crash, the keyboard intro softlock, mid-intro saves, deep
water respawn on load, the unreachable title payoff, warmth
persistence, the letter/loaf set-down strand, ask arming, cached water
math, the sketch-veil layer, Looker draw order, and three text boxes
tightened to the law. The full-spine Silent Walk verified in
overlapping halves (landing → past the Cross; locks → hut); no stalls.
