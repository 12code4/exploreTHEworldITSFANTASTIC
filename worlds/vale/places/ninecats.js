// THE NINE CATS — the stones on the moor. Wind always; heather that burns
// violet-rose at dusk; nine names carved small, and a tenth hollow that
// keeps its mouth shut. Nothing up here is awarded. It is only found.
(function (V) {
  const O = V.objects;

  // ── the court ─────────────────────────────────────────────────────────
  // Nine stones in rough court around the stones node [620, 2650],
  // radius ~90–120. At the base of each, carved small: a cat.

  O.place({
    id: 'ninecats-stone-moss', kind: 'stone', at: [615, 2545], scale: 1.3,
    why: "The first stone the grandmother named, for the cat who sat on cold things as a service to the household.",
    gaze: ['Carved at the base, small and old: MOSS.', 'Lichen has taken the whole north face. Fitting.'],
    learnName: 'Moss',
  });

  O.place({
    id: 'ninecats-stone-tansy', kind: 'stone', at: [690, 2568], scale: 1.2,
    why: "Named for the cat who crossed the ford dry-pawed all her life; somebody carved her initial twice, once up here and once mid-river.",
    gaze: ['Carved at the base: TANSY.', 'Same small hand as the third stepping stone at the ford. Same T.'],
    journal: 'the T on the third stepping stone matches the Tansy stone. same hand.',
    learnName: 'Tansy',
  });

  O.place({
    id: 'ninecats-stone-grim', kind: 'stone', at: [730, 2632], scale: 1.5,
    why: "The heaviest stone got the laziest cat, which the grandmother called balance and everyone else called a joke that stuck.",
    gaze: ['Carved at the base: GRIM.', 'The biggest stone of the nine. It leans like something slept on it for years.'],
    learnName: 'Grim',
  });

  O.place({
    id: 'ninecats-stone-puck', kind: 'stone', at: [712, 2705], scale: 1.1,
    why: "Named for the mouser who left tributes on the doorstep in strict rotation; the carved mouse underneath is the accounting.",
    gaze: ['Carved at the base: PUCK.', 'Scratched under the name, smaller: a mouse. Score kept.'],
    learnName: 'Puck',
  });

  O.place({
    id: 'ninecats-stone-fern', kind: 'stone', at: [648, 2758], scale: 1.2,
    why: "Named for the cat who hid in bracken so well the family twice held a funeral; the bracken still grows here, loyal.",
    gaze: ['Carved at the base: FERN.', 'Bracken grows against this stone and no other. Coincidence, says nobody.'],
    learnName: 'Fern',
  });

  O.place({
    id: 'ninecats-stone-soot', kind: 'stone', at: [572, 2748], scale: 1.4,
    why: "Named for the cat who slept in the cold hearth every summer and came out grey until the first rain.",
    gaze: ['Carved at the base: SOOT.', 'The darkest stone of the nine. Rain never seems to lighten it.'],
    learnName: 'Soot',
  });

  O.place({
    id: 'ninecats-stone-dab', kind: 'stone', at: [518, 2695], scale: 1.1,
    why: "Named for the kitten who put one paw in the grandmother's paint and signed the kitchen floor forever.",
    gaze: ['Carved at the base: DAB.', 'One little paw print carved beside the name. Just one.'],
    learnName: 'Dab',
  });

  O.place({
    id: 'ninecats-stone-whisk', kind: 'stone', at: [512, 2622], scale: 1.2,
    why: "Named for the cat who was mostly tail; the thinnest stone hums in a hard wind, which the family swore was purring.",
    gaze: ['Carved at the base: WHISK.', 'The thinnest stone. In a hard wind it hums.'],
    learnName: 'Whisk',
  });

  O.place({
    id: 'ninecats-stone-worn', kind: 'stone', at: [555, 2560], scale: 1.3,
    why: "Whatever name it carried, the moor sheep long ago elected it the best scratching post in the vale and rubbed the letters into rumor.",
    gaze: ['Worn nearly blank. Too worn to read.', 'The base is polished to a shine, at about sheep height.'],
  });

  // when all eight readable names are learned, the journal pays curiosity
  // its wage: no award, just a page. once.
  V.hooks.push(function () {
    if (V.state.flags.ninecatsPage) return;
    const names = V.journal.names;
    if (names.length < 8) return;
    const cats = ['Moss', 'Tansy', 'Grim', 'Puck', 'Fern', 'Soot', 'Dab', 'Whisk'];
    if (cats.every(function (n) { return names.includes(n); })) {
      V.state.flags.ninecatsPage = true;
      V.journal.note('the journal drew the cats, curled together, on one page');
    }
  });

  // ── the tenth ─────────────────────────────────────────────────────────
  O.place({
    id: 'ninecats-tenth-socket', kind: 'prop', variant: 'socket', at: [700, 2760],
    why: "Something stood here and was dragged off downhill the year the bell cracked; the heather never grew back over the shape of its absence.",
    gaze: ['A socket-shaped hollow in the heather. Empty a long time.'],
    journal: 'a tenth hollow on the moor, socket-shaped, empty a long time',
  });

  // ── the way-mark ──────────────────────────────────────────────────────
  O.place({
    id: 'ninecats-waymark-count', kind: 'waymark', at: [640, 2790],
    why: "Maren counted the court twice on a survey morning and left the arithmetic where the next counter would need it.",
    gaze: ['Slate, in a fast hand: nine. count again — nine.'],
  });

  // ── the heather ───────────────────────────────────────────────────────
  // three overlapping fields; at dusk the whole moor burns violet-rose,
  // the vale's biggest cheap firework, free every clear evening.
  V.painter.addField({ x: 620, y: 2650, r: 300, type: 'heather', colors: ['#8E6E9E', '#A87DA8'], density: 0.7 });
  V.painter.addField({ x: 850, y: 2900, r: 280, type: 'heather', colors: ['#8E6E9E', '#B07A9E'], density: 0.7 });
  V.painter.addField({ x: 540, y: 3050, r: 270, type: 'heather', colors: ['#8E6E9E', '#C08AA0'], density: 0.7 });

  // ── the wind, written in bushes ───────────────────────────────────────
  // five wind-bent yews, every one leaning up-valley. the wind is a
  // signpost that does not know it.
  const yewAt = [[430, 2500], [740, 2950], [520, 2930], [900, 2700], [640, 3120]];
  const yewWhy = [
    "Leans up-valley because the wind asks the same question every day and yews are terrible at saying no.",
    "Forty years of the same sea wind, one degree at a time; the yew calls it agreement.",
    "Every bush on the moor points at the Head like it knows something; this one leans hardest.",
    "Seeded by a thrush, raised by the wind, bent up-valley like everything else the moor teaches.",
    "The grandmother said even the bushes here face the way the maps stop; the yew has no comment.",
  ];
  for (let i = 0; i < yewAt.length; i++) {
    O.place({
      id: 'ninecats-yew-' + (i + 1), kind: 'tree', variant: 'yew',
      at: yewAt[i], scale: 0.6, why: yewWhy[i],
    });
  }

  // ── the fold ──────────────────────────────────────────────────────────
  // a ring of four rocks around the slip-down at [862, 2452]; falling in
  // IS the discovery, but the moor rings its one drop out of manners.
  O.place({
    id: 'ninecats-fold-rock-n', kind: 'rock', at: [860, 2406], scale: 1.1,
    why: "Rolled here by shepherds so nobody finds the drop the fast way; the ring is the moor's one written warning.",
    gaze: ['The fold breathes cool air. Mind the drop.', 'Worth it.'],
  });

  O.place({
    id: 'ninecats-fold-rock-w', kind: 'rock', at: [816, 2452], scale: 0.9,
    why: "The second warning rock; the first was judged too subtle by a shepherd who had recently fallen in.",
  });

  O.place({
    id: 'ninecats-fold-rock-e', kind: 'rock', at: [908, 2456], scale: 1.0,
    why: "Ring rock number three, set by someone who climbed back out of the dark grinning and would not say why.",
  });

  O.place({
    id: 'ninecats-fold-rock-s', kind: 'rock', at: [864, 2498], scale: 0.9,
    why: "The youngest ring rock, added after a ewe went down and came up at the Locks a fortnight later, unbothered.",
  });

  // ── the sheep road ────────────────────────────────────────────────────
  O.place({
    id: 'ninecats-wool-rock', kind: 'rock', at: [500, 3120], scale: 1.2,
    why: "A rubbing rock on the sheep road south; the wool snagged round it could knit half a scarf, and some year somebody will.",
    gaze: ['Grey wool snagged all round, at sheep height. The moor keeps flocks you rarely see.'],
  });
})(window.VALE);
