# AUTHORING THE VALE — the contract for content files

You are writing ONE file of Wennow Vale. The engine is done and running;
your file registers data into it. Canon lives in `worlds/vale/WORLD.md`,
`worlds/vale/VOICES.md`, `worlds/vale/LEDGER.md`, `worlds/vale/COLOR.md`,
and the laws in `PHILOSOPHY.md` + `DIALOGUE.md`. The golden examples are
`worlds/vale/places/saltmouth.js` and `worlds/vale/people/odd.js` — match
their shape exactly.

## Hard rules

1. **Every `O.place` and `V.people.register` MUST have a `why`** — a story
   of at least one sentence (≥24 chars) or the loader throws and the game
   does not boot.
2. **Strings with apostrophes use double quotes.** `"Wind's gone round."`
   never `'Wind's...'`. This has already broken the build once.
3. **Text Box Law**: every dialogue line ≤ 2 short sentences, lands in two
   seconds, one bit per person. No stage directions except a full
   parenthetical box like `'(He salutes with the pear. Eats it in four.)'`.
4. Wrap your file in `(function (V) { ... })(window.VALE);` exactly like
   the golden files. Run `node --check <file>` before you finish.
5. Do not invent engine APIs. If you need something that doesn't exist,
   note it in your report and leave it out.
6. Unique ids everywhere (prefix with your region/person).
7. Density per Amendment II: a screenful (~960×540 world px at zoom 1)
   should hold ≥3 noticeable things — but every one still needs its why.
8. Never place markers, counters, quest text, or anything from the
   Forbidden list. Asks come only from canon (WORLD.md §asks).

## Coordinates you need

World is 2600×5600, north = low y, the river runs down the middle
(see `worlds/vale/layout.js` — the spline `L.river` and named `L.nodes`).
Region bands (approx):

- saltmouth: y 4750–5150, harbor at nodes landing/boathouse/gullhead
- cross: y 4180–4750 center/west of river; nodes bell/bakery/ford/chapel/cottage
- ridge: east band y 3300–4600; nodes ridgegate/milestone/bend/watch
- hushes: west y 3050–4180 x<1050; nodes hollowgate/pond/hollow/greenchapel
- ninecats: NW moor y 2380–3250 x<1050; nodes stones/fold
- dyeyards: east y 2950–3400 x>1620; nodes yards/yardstop
- locks: center y 2380–2950; node locks
- steps: y 1750–2380 along the gorge; nodes stepsfoot/falls/herbench
  (the walkable stair corridor hugs the EAST bank: x ≈ river.x + 78 ± 55)
- head: y 1310–1750; nodes hut/doorframe

Keep objects OUT of the river (check `L.river` x at your y ± width) and
off other regions' nodes. The sea starts at y=5150.

## Object API (V.objects.place)

```js
O.place({
  id: 'cross-bell', kind: 'bellpost', at: [x, y],
  why: "A story. Who made it, wears it, lost it. Non-negotiable.",
  // optional:
  scale: 1.2, tint: '#hex', roof: '#hex', door: '#hex',   // houses
  variant: 'pear',            // trees: pear|oak|willow|yew|rowan
                              // prop: crate|basket|pot|kettle|slates|pear|
                              //       lantern|marbles|tidepool|chalk|socket|
                              //       ashring|gate
  solid: false,               // default solids: house/chapel/shed/tree/stone...
  hidden: false,
  home: false,                // house windows stay dark at night
  gaze: ['1-2 short boxes.'], journal: 'what the journal notes',
  learnName: 'Tansy',         // adds to names learned
  talkLines: ['Box 1.', 'Box 2.'], talkName: 'a leaning sign',
  lift: 'pear', liftOnce: true, liftNote: 'journal note',
  use(pl) { /* custom interaction; V.textbox.say('', ['...']); */ },
  emit: [{ kind: 'petals'|'smoke'|'fireflies'|'bees'|'butterflies'|
           'glowworms'|'motes'|'steam', rate: 1.5, r: 30, dx: 0, dy: -20,
           when: 'dawn',        // smoke only: dawn = baking hours
           colors: ['#hex'] }], // butterflies only
  fields: [{ type: 'flowers'|'heather'|'reeds'|'petalfall', r: 160,
             colors: ['#hex'], density: 0.5, dx: 0, dy: 0 }],
});
```

Kinds available: house chapel shed lighthouse hut tree stone rock bench
boat jetty bellpost sign milestone fence arch waymark pool clothline stall
telescope doorframe chimney cat heron prop. (`pool` takes `tint` for dye
color; `clothline` takes `len`, `pieces`, `colors`; `fence` takes `n`,
`dx`, `dy`; `boat` takes `patched: true` for map-paper.)

Also available:
- `V.lightpass.add({x, y, r, color:'#FFD97A', a:0.3, when:'night'|fn(h), flicker:true})`
- `V.painter.addField({...})` for ground flora away from an object
- `V.hooks.push(fn)` — runs every frame; use for time-of-day visibility
  (see the herons in saltmouth.js) or custom checks. Keep them cheap.
- `V.state.flags` for booleans; `V.journal.note/learnName`; `V.textbox.say`.
- `V.audio.tuneFragment(startIndex, nNotes)` for the melody's fragments.

## Person API (V.people.register)

See odd.js. Fields: id, name, why, tint/hair/hat (colors), schedule
(array of {h, node, dx, dy} — h in world hours ascending, they walk the
node graph between stops), lines ({default, morning, noon, afternoon,
dusk, night, rain, mist, longNoon, nameKnown} — arrays of text boxes),
give ({itemId: {boxes:[...], keeps:true, resolve:'askId', after(p,pl){}}}),
asks (array):

```js
asks: [{
  id: 'bread-round', when: 'morning',            // phase gate (optional)
  cond: (state, pl) => state.flags.met_sela,     // optional
  boxes: ["Loaf's for the Locks. Gets stale or gets carried."],
  declineBox: 'Fair enough. Wind was wrong for favors anyway.',
  stringNote: 'a loaf, going up',
  onAccept(p, pl) { pl.carry = 'loaf'; },
  // resolution EITHER via another person's give{loaf:{resolve:'bread-round'}}
  // OR resolveOnTalk on the receiving person:
  // {id:'bread-round', resolveOnTalk:true, needs:'loaf', resolveBoxes:[...]}
}]
```

Items are plain strings: pear, loaf, marble, letter. Carried in hands,
one at a time. The player is silent; people over-read gestures.

## What already exists (don't duplicate)

Saltmouth is fully placed (see the file). Odd is registered. The engine
already handles: the lighthouse sevens, the Rose light at the chapel node
at clear noon, the Under + Glimmer cave, the moonbow at the falls, petals
upstream at dusk (wind), lantern-night drifters on the river, the eel
run, the sketch world past y=1310, stepping stones + `M + T` at the ford,
the hour bell audio. Your job is the placed, gazeable, talkable WORLD
around those bones — and the people.
