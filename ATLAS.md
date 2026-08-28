# THE ATLAS

> There are different worlds in this fantastic game. This is the book they
> live in.

The game is an **atlas of fantastic worlds** — a book of pages, each page a
world being drawn. The title screen is the book itself, open on a desk:
lamp, tea ring, pages. Turn to a page and step in.

This was always the structure; we just hadn't said it out loud. Wennow
Vale's ending is walking into "the next page" — a world that inks itself in
as you go. Every world in the atlas ends the same way: at its far edge, a
sketch, and someone up ahead who waved once. Every page has its mapmaker,
and every mapmaker walked deeper.

## The rules of the book

1. **The philosophy binds every page.** The Ten Laws, the Forbidden list,
   the Covenant, the Tests, and the Amendments apply wholesale to every
   world, always. A page that needs a quest log to be fun is a page we
   tear out.
2. **Each world is complete in itself:** its own clock (whatever drives
   time there — a sun, a Household), its own color script with its own
   detonations, its own voices, its own tune, its own mystery ledger with
   its own tithe, its own title-that-learns.
3. **The traveler is the same traveler.** Silent, gesturing, curious. The
   page decides what shape you arrive in — in the vale you walk on two
   legs; in the Great Indoors you are an ant. Two things cross every
   threshold with you: **the journal** (one book, growing new sections per
   world) and **the scarf** (your dyed stripes come along, whatever size
   you are — nobody in any world comments on this, which is itself the
   joke).
4. **Strings are universal.** Every world ties promises the same way. It
   is the atlas's one shared custom, and no world remembers inventing it.
5. **Worlds do not explain each other.** No portal lore, no multiverse
   speeches. You turn a page. That's it. Rhymes between worlds (a light
   that blinks in a pattern, a mapmaker gone on ahead) are for the player
   to notice and the game to never mention.

## The pages so far

| page | world | you are | its clock is | its mapmaker |
|---|---|---|---|---|
| I | **Wennow Vale** — a sea-valley, bells and blossom | a traveler off the ferry | the sun and the tides | Maren, up past the Steps |
| II | **The Great Indoors** — a modern house, ant-high | an ant, bagged in with the shopping | the Household's routine | Rove, up in the attic |

Later pages earn their place the same way these did: philosophy first,
world bible second, sculpting third. The atlas grows at the speed of
fantastic and no faster.

## Engineering note

Each world is a data pack under `worlds/<name>/` (bible, color script,
voices, ledger, and eventually its `places/` and `people/`). The engine is
shared; a world supplies its clock sources, palette keys, gesture set, and
any world-specific renderers (see ARCHITECTURE.md §Worlds). The journal
and scarf are atlas-level save state; everything else is per page.
