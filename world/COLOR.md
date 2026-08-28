# THE COLOR SCRIPT

How Wennow Vale is colored, and why it is not colored evenly.

The engine of wonder is contrast and withholding (PHILOSOPHY.md §Wonder).
If everywhere is a rainbow, nowhere is. So the vale is a **naturalistic
world that holds detonations**: long passages in moss and milk, and then a
basin of pastel that takes the breath, a hillside of saturated flags, two
places and two only where light goes full prism — both on the clock, both
earned. The player's chromatic journey is scored like music, in **keys**.

Two laws govern every color decision:

1. **Color always has a source.** Pigment, petal, glass, spar, mist,
   flame, sky. Nothing is "a colorful area" by fiat; something in the
   world is MAKING that color, and finding the maker is half the charm.
   (The kaleidoscope needs a lens. The rainbow needs a splitter. The pink
   hillside needs ten thousand actual foxgloves.)
2. **Saturation is a gesture.** A hue spike on any horizon is a promise
   the place must keep. Color intensity is part of the guidance budget —
   the vale points with pigment the way it points with light.

---

## The keys

Palettes are named, hexed, and scored to regions and hours. These are the
authoritative swatches; the renderer's palette-grade system (see
ARCHITECTURE.md §Color) crossfades between them by region and hour.

### Key of Moss — the vale's ground truth
The base world. Green country, warm and specific, never grey.

| swatch | name | use |
|---|---|---|
| `#5E6F50` | moss | living green, the default land |
| `#2A3328` | fir ink | line, shadow, night edges |
| `#EFF3EA` | morning milk | sky-light, paper, plaster |
| `#7C94A0` | river slate | the Wennow at work |
| `#E5B84E` | lamplight | every warm point: windows, lamp, ember |
| `#4A3E2E` | bark | trunks, beams, tools |

### Key of Milk — mist, dawn, the sea's bleach
Saltmouth's register, and any morning the mist walks in.

| swatch | name | use |
|---|---|---|
| `#F4CBA8` | apricot dawn | first light on water and plaster |
| `#C9D8DC` | milk blue | sea haze, mist bodies |
| `#F2E3B6` | pale gold | sun through mist |
| `#F6F4EC` | gull | whitewash, wings, foam |
| `#BFD9CD` | seafoam | shallows, sea glass |

### Key of Blossom — the pastel detonations
The Foxglove Hollow, the hanging orchard, blossom drift anywhere.
Pastel is daytime softness with a pulse in it.

| swatch | name | use |
|---|---|---|
| `#F4C7D4` | petal | pear blossom mass |
| `#E7A9C4` | campion | the Hollow's pink riot |
| `#C9A0DC` | foxglove | spires, floor-to-canopy |
| `#B9AEDC` | lavender | shade-side pastels |
| `#FBF1DC` | cream | cow-parsley froth |
| `#F6E19A` | butter | pollen motes, catch-lights |
| `#CFE3C0` | leaf-milk | leaves seen against sun |

### Key of the Fair — the Dye Yards, Lantern Night
The one register where the vale goes SATURATED — pigment straight from
the vat, lantern flame through paper. Earned by rarity: one hillside,
one night a month.

| swatch | name | use |
|---|---|---|
| `#D4586B` | madder | the rose vat, madder cloth |
| `#4A6FA5` | woad | the blue vat and its flags |
| `#E3B93E` | weld | the yellow the butterflies love |
| `#8E5A9E` | orchil | violet — her current order but one |
| `#6B4A32` | walnut | umber — what she's on now |
| `#4E8A73` | verdigris | copper greens, lock gates |
| `#F6EFE2` | undyed | wool before its history |

### Key of the Prism — the Rose, the Glimmer, the Looker
Full spectrum, split light. Appears in exactly three circumstances: noon
sun through the Sea-Glass Rose; noon shaft on the Glimmer's spar; any
time the player raises Wick's Looker. Two sets:

**Day prism (pastel-spectral — the vale's rainbow is soft):**
`#FF9AA2 · #FFC48C · #FFF3A0 · #B8E8A0 · #9AD8E8 · #A8B4F0 · #D8A8E8`

**Deep prism (jewel — the Glimmer underground, lantern water at night):**
`#E84E6A · #F0A03C · #F2D848 · #58B87A · #4A9AD8 · #7A6AE0 · #B858C8`

### Key of Night — dark is a color, not an absence
| swatch | name | use |
|---|---|---|
| `#131A16` | spruce night | the ground of dark |
| `#16302E` | deep teal | water and wood at night |
| `#2A2440` | night violet | far hills, high sky |
| `#FFD97A` | lamp gold | every lit point |
| `#BFF0C8` | firefly mint | the Hushes' slow lanes |
| `#A8C878` | green evening | the flood color of the ◆ event |

---

## The score, region by region

| region | home key | modifiers |
|---|---|---|
| Saltmouth | Milk | apricot at dawn; prism glints in pools at low sun |
| Wennow Cross | Moss | painted doors as accents; the Rose fires Prism at clear noon |
| Pear Ridge | Moss | Blossom act I at the Bend; gold hour lies longest here |
| The Hushes | Moss, deepened | the Hollow detonates Blossom; firefly mint at night |
| The Nine Cats | Moss → heather | the moor burns violet-rose every clear dusk |
| The Dye Yards | THE FAIR | the one always-saturated place; earns it with a why |
| The Locks | Moss + verdigris | eel-run silver at dusk; laundry white pointing up-valley |
| The Steps | Blossom act II | petal-fall fortissimo; moonbow (Prism, pale) on mist + moon |
| The Head | — | the script runs backwards: pencil greys inking to full palette |

**Hour grading (over everything):** dawn = Milk washed over Moss; noon =
clean and true (the two Prism events depend on this); dusk = lamplight
wash, shadows long and violet; night = Key of Night, never grey. The
Green Evening replaces the entire grade with `#A8C878` for ninety seconds
and is never explained.

---

## The ten postcards

The showpiece renders the vale is built to produce — each one a standing
target of the Postcard Test, each one a place-plus-hour the player can
learn (the Only Key) and return to on purpose:

1. **Mist morning, Saltmouth** — the vale half-erased, lighthouse blinking
   through white, herons as grey ghosts.
2. **The Rose at noon** — the nave kaleidoscopic, colored light on the
   floor, the pews, the cat, and you.
3. **The Hollow, first entry** — a green wood exhaling pink; pollen motes
   gold in the shafts; the sound of drunk bees.
4. **The moor at dusk** — heather burning violet-rose horizon to horizon,
   nine stones black against it.
5. **The Glimmer at clear noon** — the long dark paying out into standing
   rainbows on black water.
6. **The Dye Yards on a wind day** — a hillside dressed in flags, every
   color the vale owns, waving at everything.
7. **The eel run** — dark water boiling silver for one held minute.
8. **Wet flagstones after rain** — Wennow Cross hanging upside-down in
   its own street.
9. **Lantern Night from the Overlook** — the river a ribbon of drifting
   gold-and-pastel lights, Landing to sea, Odd's ferry a black shape
   herding stars.
10. **The moonbow at the falls** — mist + moon = yes.

(The eleventh postcard is the sketch-world blooming, and it is not listed,
because the last page keeps its own counsel.)

---

## What color never does here

- Never a filter slapped over a region without a source in the world.
- Never neon; even the rainbow is the vale's rainbow (pastel-spectral by
  day, jewel underground). If a color could belong to a slot machine, it
  doesn't belong to the vale.
- Never grey nights, never brown "realism," never desaturation as
  seriousness. The vale takes beauty seriously instead.
- Never a colorful place without a reason to walk into it — pigment is a
  promise, and every promise here is kept.
