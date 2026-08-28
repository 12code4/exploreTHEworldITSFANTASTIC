// THE HUSHES — where lost is a place. The wood on the west bank: paths
// braid, the canopy closes, and the deeper in the quieter — until the
// newts plip, and you follow that. Every stream here reaches the Wennow.
(function (V) {
  const O = V.objects;
  const U = V.util;

  // ---------- the wood itself: ~28 meant trees, seeded, off the paths ----
  // Each tree carries its own one-line story. The scatter is deterministic
  // (mulberry-seeded) so the wood holds still between sessions and builds.
  const TREES = [
    { v: 'oak', why: 'Grown clean through a nurse log; the grandmother trunk is still under there, paying for everything.' },
    { v: 'willow', why: 'Leans over the runnel to hear it better; willows are terrible eavesdroppers.' },
    { v: 'yew', why: 'Old enough that the path bends around it, and nobody can prove the path was here first.' },
    { v: 'oak', why: 'Wears a lightning scar down one side and stands straighter than the rest, out of spite.' },
    { v: 'willow', why: 'The one Wick ties her chalk-string to when she surveys; the knots stay tied out of respect.' },
    { v: 'yew', why: 'The birds will not sing in it and will not say why; the wood pretends not to notice.' },
    { v: 'oak', why: 'Drops acorns on people on purpose. Everyone says trees cannot aim. The tree lets them say it.' },
    { v: 'willow', why: "Somebody's initials, cut a lifetime ago, grown shut and private again." },
    { v: 'oak', why: 'The bees rest here on the way home from the Hollow, heavy, like carts pulled onto a verge.' },
    { v: 'yew', why: 'Its shade lands square on the path at noon; Maren is said to have checked, twice.' },
    { v: 'willow', why: 'Lost half its crown in THAT winter and grew back the wrong shape, which suits it.' },
    { v: 'oak', why: 'Hob leaves his billhook in the same fork every dawn; the fork has grown to fit it.' },
    { v: 'yew', why: 'The charcoal burners never cut yew; this one has outlived all its neighbors twice over.' },
    { v: 'oak', why: 'A swing hung here once; the rope is gone but the branch still carries the polish of it.' },
    { v: 'willow', why: 'Roots in the stream, head in the weather; the newts hold their assemblies underneath.' },
    { v: 'oak', why: 'The gall on its north side houses a wasp dynasty older than any surname in the village.' },
    { v: 'yew', why: 'Planted, says Ada, by nobody — which is her word for before everybody.' },
    { v: 'willow', why: 'Every whistle in the Cross was cut from its shoots; it is robbed politely each spring.' },
    { v: 'oak', why: "Holds the woodpecker's larder: acorns hammered into the bark in rows, an honest pantry." },
    { v: 'yew', why: 'Dark all year; the fireflies use it as their between-place at the blue end of dusk.' },
    { v: 'willow', why: 'Bows to the pond whenever the wind comes up the vale, which the pond takes as its due.' },
    { v: 'oak', why: 'The stag rubs his velvet here each autumn and leaves the bark written up with the year.' },
    { v: 'yew', why: 'Hollow at the heart and alive at every edge; the owls have opinions about the vacancy.' },
    { v: 'willow', why: 'Sheds its leaves into the runnel like small boats, and some of them make the Wennow.' },
    { v: 'oak', why: 'The pheasant detonates from under it most mornings; the tree appears to enjoy this.' },
    { v: 'yew', why: 'Berries bright as beads and not for eating; every mother in the vale has said so, here.' },
    { v: 'oak', why: 'Wick says this one is the king and the others know it; the others have not been caught disagreeing.' },
    { v: 'willow', why: 'Grew from a withy fence post that decided, one wet spring, not to be a fence.' },
  ];

  // keep-out circles: the set pieces, so the wood frames them instead of
  // sitting in them. [x, y, radius]
  const KEEP = [
    [640, 3672, 110],  // the Chalk Pond
    [712, 3706, 45],   // the pond bench
    [520, 3310, 150],  // the Foxglove Hollow basin stays open to the sky
    [820, 3390, 80],   // the Green Chapel
    [780, 3560, 45],   // the charcoal ring
    [870, 3760, 45],   // the stream-stone
    [700, 4020, 40], [330, 3560, 40], [640, 3170, 40],  // firefly lanes
    [1005, 3820, 45], [450, 3080, 45],                  // light gaps
    [905, 3900, 60],   // hollowgate: the wood opens a mouth for the path
  ];

  (function scatter() {
    const rng = U.mulberry(9317);
    const put = [];
    let placed = 0, tries = 0;
    while (placed < TREES.length && tries < 8000) {
      tries++;
      const x = 130 + rng() * 890;    // x < 1050: west of the river, always
      const y = 3080 + rng() * 1060;  // the hushes band, well north of the sea
      const s = 0.8 + rng() * 0.5;
      if (V.terrain.nearPath(x, y) <= 30) continue;   // the worn ways stay open
      let ok = true;
      for (const k of KEEP) if (U.dist(x, y, k[0], k[1]) < k[2]) { ok = false; break; }
      if (!ok) continue;
      for (const p of put) if (U.dist(x, y, p[0], p[1]) < 42) { ok = false; break; }
      if (!ok) continue;
      const t = TREES[placed];
      O.place({
        id: 'hushes-tree-' + placed, kind: 'tree', variant: t.v,
        at: [Math.round(x), Math.round(y)], scale: Math.round(s * 100) / 100,
        why: t.why,
      });
      put.push([x, y]);
      placed++;
    }
  })();

  // ---------- the Chalk Pond: Wick was right ---------------------------
  const PX = 640, PY = 3672;
  const RING = [
    "Set upright by hands too small for it, which is why it took all afternoon.",
    'The white one; chalk under the moss, and the moss losing the argument slowly.',
    'A newt suns here at eleven, the same newt, on what appears to be a schedule.',
    'Rolled a stride closer to the water one winter and never owned up to it.',
    'The flat one, for standing on to look in; polished by exactly one pair of boots.',
    'Leans out over the lilies like it has been caught mid-drink for a hundred years.',
    'The gap-tooth of the ring faces the path, the way a door faces a lane.',
  ];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.28;
    O.place({
      id: 'hushes-pondring-' + i, kind: 'rock',
      at: [Math.round(PX + Math.cos(a) * 26), Math.round(PY + Math.sin(a) * 15)],
      scale: 0.8 + (i % 3) * 0.15,
      why: RING[i],
    });
  }
  O.place({
    id: 'hushes-pond', kind: 'prop', variant: 'tidepool', at: [PX, PY],
    why: 'The pond no adult remembers and one child maps: lilies, newts, and an echo that answers better than most people.',
    gaze: ['Lilies. Newts plipping in, like slow rain. Nobody grown remembers this pond.', 'The echo here is very good. It gives back more than it gets.'],
    journal: 'the pond is real. wick was right.',
  });
  O.place({
    id: 'hushes-pond-bench', kind: 'bench', at: [712, 3706],
    why: 'Dragged here by somebody who wanted to sit where no adult would look for them; child-height, and unbothered by disbelief.',
    onSit(pl) {
      if (!V.state.flags.hushes_pond_sat) {
        V.state.flags.hushes_pond_sat = true;
        V.textbox.say('', ['Sit long enough and the wood forgets you. Then it starts singing again, all parts at once.']);
      }
      V.journal.note('the birdsong at the pond, taken down in notation');
    },
  });

  // ---------- the Green Chapel -----------------------------------------
  O.place({
    id: 'hushes-greenchapel', kind: 'arch', at: [820, 3390], scale: 1.3,
    why: 'A mossy stone arch older than the village chapel; the path walks through it because the path is polite. Nobody built it recently, and nobody says who built it at all.',
    gaze: ['Older than the chapel in the village. Nobody built it recently.', 'The birdsong from every corner of the wood arrives here. It agrees about this place.'],
    journal: 'the green chapel was here before the village one',
    emit: [{ kind: 'motes', rate: 1.4, r: 30, dy: -14 }],
  });

  // ---------- THE FOXGLOVE HOLLOW: the pastel detonation ----------------
  // A plain green wood holding its breath, then this. Key of Blossom.
  O.place({
    id: 'hushes-hollow-stone', kind: 'stone', at: [540, 3345],
    why: 'The old dyers seeded the basin generations back and let it run wild; a spring underneath keeps it sweet. This stone is where Nettle stands to pick her pinks, and where everyone else just stands.',
    gaze: ['A green wood, exhaling pink. Foxglove, campion, cow-parsley, floor to canopy.', 'The bees are audibly drunk. Nobody is flying in straight lines, you included.'],
    journal: 'the hollow: the wood let its breath go, in pink',
    fields: [
      { type: 'flowers', r: 240, dx: -20, dy: -35, colors: ['#E7A9C4', '#C9A0DC', '#FBF1DC'], density: 0.85 },
      { type: 'flowers', r: 170, dx: -90, dy: -80, colors: ['#F4C7D4', '#B9AEDC', '#C9A0DC'], density: 0.85 },
      { type: 'flowers', r: 130, dx: 60, dy: 20, colors: ['#FBF1DC', '#F6E19A', '#E7A9C4'], density: 0.85 },
    ],
    emit: [
      { kind: 'bees', rate: 2.6, r: 90, dx: -60, dy: -50 },
      { kind: 'bees', rate: 2.6, r: 90, dx: 55, dy: 5 },
      { kind: 'motes', rate: 2.2, r: 120, dx: -15, dy: -30 },
    ],
  });

  // ---------- the charcoal ring, NE of the pond -------------------------
  O.place({
    id: 'hushes-ashring', kind: 'prop', variant: 'ashring', at: [780, 3560],
    why: "Hob's ring; he burns for the bakery oven by night and is over the rise before first light. The player only ever catches the leaving of him.",
    gaze: ['Warm ash, some mornings. Cold now.', 'Somebody burns here by night. The wood is not saying who.'],
  });

  // ---------- the stream-stone: the rule that keeps lost gentle ---------
  O.place({
    id: 'hushes-streamstone', kind: 'stone', at: [870, 3760],
    why: 'Set where the runnel turns downhill, by somebody who knew what a worried walker needs to hear: water knows the way out, and always did.',
    gaze: ['The stream sets off downhill, certain of its route. Every stream here reaches the Wennow.', 'You cannot be trapped in this wood. Only pleasantly misplaced.'],
    journal: 'follow any stream and the vale catches you',
  });

  // ---------- firefly lanes: three, spread through the wood -------------
  // At night the fireflies make slow mint-gold lanes of the dark; the
  // wood lighting its own corridors, no signpost anywhere.
  O.place({
    id: 'hushes-lane-south', kind: 'rock', at: [700, 4020], scale: 1.1,
    why: 'The southern mustering rock; the fireflies rise from the bracken here at dusk and open the first lane toward the gate.',
    emit: [{ kind: 'fireflies', rate: 1.3, r: 85 }],
  });
  O.place({
    id: 'hushes-lane-west', kind: 'rock', at: [330, 3560], scale: 0.9,
    why: 'Deep-wood rock, mossed on every face; the fireflies keep their westernmost court here, farthest from any window.',
    emit: [{ kind: 'fireflies', rate: 1.3, r: 85 }],
  });
  O.place({
    id: 'hushes-lane-north', kind: 'rock', at: [640, 3170], scale: 1.0,
    why: 'Where the wood thins toward the moor, the last lane of fireflies hands you over to the open sky and the stones.',
    emit: [{ kind: 'fireflies', rate: 1.3, r: 85 }],
  });

  // ---------- two light gaps: the edges, marking themselves -------------
  O.place({
    id: 'hushes-lightgap-east', kind: 'rock', at: [1005, 3820], scale: 1.2,
    why: 'A storm took the canopy here a generation ago and the wood left the wound open on purpose: light gaps always mark the edges.',
    gaze: ['The light gets in here, gold and busy with dust. Where the light gets in, the wood is ending.'],
    emit: [{ kind: 'motes', rate: 1.6, r: 46, dy: -20 }],
  });
  O.place({
    id: 'hushes-lightgap-north', kind: 'rock', at: [450, 3080], scale: 1.0,
    why: 'The moor leans its weather in at this gap and the trees gave up arguing; the north edge announces itself in plain daylight.',
    gaze: ['A shaft of day, standing in the wood like a visitor. The moor is close; you can smell the heather.'],
    emit: [{ kind: 'motes', rate: 1.6, r: 46, dy: -20 }],
  });
})(window.VALE);
