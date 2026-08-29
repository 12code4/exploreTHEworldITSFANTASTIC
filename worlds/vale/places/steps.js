// THE STEPS — her stair through the gorge. Maren cut it, slated it with
// true things, and paid herself in pear trees rooted in the ledges. The
// corridor hugs the east bank; the river does the talking on the west.
(function (V) {
  const O = V.objects;

  // ---- the five waymark slates: not directions. observations. all true.

  O.place({
    id: 'steps-waymark-kestrel', kind: 'waymark', at: [1320, 2325],
    why: "She set a slate at every truth worth stopping for. This one has been right every May since she cut it.",
    gaze: ['A slate at the stair foot, cut in a quick hand: "kestrel nests here in May."', 'High in the gorge wall: a notch, whitewashed below. Checked every year — not by people.'],
    journal: 'her slates are not directions. kestrel nests here in May.',
  });

  O.place({
    id: 'steps-waymark-echo', kind: 'waymark', at: [1330, 2210],
    why: "Cut the day she counted the echo and got two; she recounted for a week before she let the slate say so.",
    gaze: ['A slate, her hand: "echo answers twice."', 'Underneath, smaller: counted. recounted. kept.'],
    journal: 'a slate says the echo answers twice',
  });

  O.place({
    id: 'steps-waymark-moon', kind: 'waymark', at: [1358, 2092],
    why: "The shortest slate she ever cut, because the moonbow needs no more words than it needs nights.",
    gaze: ['A slate beside the falls: "moon + mist = yes."', 'No more words on it. The spray stands ready either way.'],
    journal: 'moon + mist = yes. a slate promises it.',
  });

  O.place({
    id: 'steps-waymark-thirdstep', kind: 'waymark', at: [1338, 1955],
    why: "She could have fixed the rocking step in an hour. She wrote it down instead, and the stair kept its one note.",
    gaze: ['A slate near the top: "third step from the top rocks. left it. it sings."', 'You try the step. It rocks. It sings. A little.'],
    journal: 'the third step from the top rocks. she left it. it sings.',
  });

  O.place({
    id: 'steps-waymark-wind', kind: 'waymark', at: [1330, 1775],
    why: "The last slate, set where the evening wind swings uphill; she followed it up more evenings than she wrote down.",
    gaze: ['The last slate: "the wind turns here of an evening. so do I."', 'Come evening, the petals here climb the vale. So did she.'],
    journal: 'the wind turns at the top of an evening. so did she.',
  });

  // ---- the hanging orchard: four pears rooted in the ledges.
  // blossom act two, fortissimo. two of them carry the petal supply.

  O.place({
    id: 'steps-pear-1', kind: 'tree', variant: 'pear', at: [1395, 2270], scale: 0.85,
    why: "A survey station wage: she paid herself in pear trees, and this one took root in a crack no wider than her hand.",
    gaze: ['A pear tree growing out of the gorge wall itself. The stair bends politely around its roots.'],
    journal: 'the orchard up the gorge hangs. pear trees in the ledges.',
    fields: [{ type: 'petalfall', r: 80, density: 0.6 }],
  });

  O.place({
    id: 'steps-pear-2', kind: 'tree', variant: 'pear', at: [1420, 2140], scale: 0.9,
    why: "Planted the day the stair reached this ledge; it leans out over the water like it wants to see the sea it will never walk to.",
    fields: [{ type: 'petalfall', r: 85, density: 0.6 }],
    emit: [{ kind: 'petals', rate: 2.5, r: 36, dy: -28 }],
  });

  O.place({
    id: 'steps-pear-3', kind: 'tree', variant: 'pear', at: [1405, 2010], scale: 0.8,
    why: "The petals off this one ride the evening wind up the gorge; half the famous upstream petals start on this ledge.",
    fields: [{ type: 'petalfall', r: 80, density: 0.55 }],
  });

  O.place({
    id: 'steps-pear-4', kind: 'tree', variant: 'pear', at: [1380, 1890], scale: 1,
    why: "The last pear before her bench; its windfalls roll down three steps and wait where a walker cannot miss them.",
    fields: [{ type: 'petalfall', r: 90, density: 0.65 }],
    emit: [{ kind: 'petals', rate: 2.5, r: 36, dy: -28 }],
  });

  O.place({
    id: 'steps-windfall-pear', kind: 'prop', variant: 'pear', at: [1362, 1902],
    why: "A windfall from the last tree, rolled to the stair edge and waiting; the orchard has always paid walkers directly.",
    lift: 'pear', liftOnce: true,
    liftNote: 'a pear from the hanging orchard, carried down the stair',
  });

  // petal drift where the stair and the spray share weather
  V.painter.addField({ x: 1332, y: 2075, r: 140, type: 'petalfall', density: 0.4 });

  // ---- the echo stone, opposite the narrows by the falls

  O.place({
    id: 'steps-echo-stone', kind: 'stone', at: [1378, 2062],
    why: "A flat-faced stone opposite the narrows, set there or found there, she never said, exactly where the gorge listens best.",
    use(pl) {
      V.audio.tuneFragment(0, 4);
      setTimeout(function () { V.audio.tuneFragment(0, 4, 0.22); }, 1650);
      setTimeout(function () { V.audio.tuneFragment(0, 4, 0.22); }, 2650);
      V.textbox.say('', ['(You hum. The gorge hums it back. Twice.)']);
      V.journal.note('the echo answers twice. nobody will ever say why.');
    },
  });

  // ---- the falls: a rock cluster wearing the spray, breathing mist

  O.place({
    id: 'steps-falls-rock-a', kind: 'rock', at: [1310, 2078], scale: 1.5,
    why: "The falls have leaned on this cluster since before the stair; the spray keeps it dark and the mist is its weather.",
    gaze: ['The falls comb the river white through the narrows. The spray climbs back up as mist, unhurried.'],
    journal: 'the falls keep their own weather',
    emit: [{ kind: 'steam', rate: 2, r: 30 }],
  });

  O.place({
    id: 'steps-falls-rock-b', kind: 'rock', at: [1307, 2112], scale: 1.1,
    why: "Split by some old winter and wedged where it landed; the falls have been rounding off the argument ever since.",
  });

  O.place({
    id: 'steps-falls-rock-c', kind: 'rock', at: [1332, 2046], scale: 0.9,
    why: "The dipper birds use it as a doorstep to the water; there is always one wet footprint on it somewhere.",
  });

  // ---- her bench, and the rock the whole vale fits on

  O.place({
    id: 'steps-her-bench', kind: 'bench', at: [1264, 1832],
    why: "The last bench before the top. She built it facing back down the vale, because the way you came is also a country.",
    onSit(pl) {
      V.journal.mapSeen = true;
      V.journal.note('from her bench the whole vale is your whole walk. the journal drew its map.');
    },
  });

  O.place({
    id: 'steps-view-rock', kind: 'rock', at: [1340, 1870], scale: 1.2,
    why: "The gorge lip opens here and forgets to close; from this rock the vale lays itself out the way it lay in her surveys.",
    gaze: ['From here, the whole vale at once: the smoke, the dye lines waving, the lamp far off at the sea.', 'Every place you have been is down there, holding still, all at the same time.'],
    journal: 'the view from her bench holds every place at once',
  });

  // ---- gorge rocks along the corridor edges: stair spoil and old falls

  const gorgeRocks = [
    { x: 1285, y: 2345, s: 0.9, why: "Stair spoil, barrowed exactly this far and no farther; even her leavings kept a line." },
    { x: 1372, y: 2295, s: 1.1, why: "A slab that cracked wrong for a step, kept anyway; the gorge does not do waste." },
    { x: 1290, y: 2232, s: 0.8, why: "The kestrels use this one as a plucking post; the feathers on it change with the month." },
    { x: 1392, y: 2168, s: 1.2, why: "Rolled off a ledge the winter of THAT year, and nobody in the vale ever rolled it back." },
    { x: 1302, y: 1990, s: 1.0, why: "Fell in her lifetime; she chalked a small tick on it, and the rain kept the tick longer than seems fair." },
    { x: 1368, y: 1930, s: 0.85, why: "The mist off the falls keeps this one green on its north face, and only its north face." },
    { x: 1284, y: 1772, s: 1.0, why: "A resting rock at knee height, polished by every carrier who ever set a load down at the top." },
  ];
  for (let i = 0; i < gorgeRocks.length; i++) {
    const g = gorgeRocks[i];
    O.place({ id: 'steps-gorge-rock-' + (i + 1), kind: 'rock', at: [g.x, g.y], scale: g.s, why: g.why });
  }
})(window.VALE);
