// THE LOCKS — where the river is worked. Copper-green waterworks, eel
// country, a cottage with laundry out; the vale's most famous small
// mystery answers itself here every evening, on a clothesline.
(function (V) {
  const O = V.objects;

  // river x at a given y, straight off the layout spline — used to set
  // gate positions honestly and to land gate-riders clear of the water.
  function riverX(y) {
    const R = V.layout.river;
    for (let i = 0; i < R.length - 1; i++) {
      const a = R[i], b = R[i + 1];
      if (y >= a[1] && y <= b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
    }
    return 1285;
  }

  // ── Sela's cottage ────────────────────────────────────────────────────
  O.place({
    id: 'locks-sela-cottage', kind: 'house', at: [1445, 2680], home: true,
    tint: '#A8A38C', roof: '#5E6E62', door: '#5C6B7E',
    why: "Sela keeps the Locks from this cottage, close enough to hear a gate slip its ratchet in her sleep; the box of Maren's pages lives somewhere inside.",
    gaze: ['Step swept, gate oiled, kettle-smoke of an evening. Somebody runs this river properly.'],
  });

  O.place({
    id: 'locks-garden-pot-herbs', kind: 'prop', variant: 'pot', at: [1398, 2706],
    why: "Sela's kitchen pot: chives and one stubborn rosemary, watered on the gate rounds like a third lock.",
    gaze: ['Chives, rosemary, and one weed spared on merit.'],
  });

  O.place({
    id: 'locks-garden-pot-sapling', kind: 'prop', variant: 'pot', at: [1484, 2712],
    why: "A windfall pear from the hanging orchard, potted on a whim; if it takes, the survey line grows itself a new station.",
    gaze: ['A pear sapling in a pot. Leaning up-valley already.'],
  });

  // ── the laundry: the famous diagram ───────────────────────────────────
  O.place({
    id: 'locks-laundry-line', kind: 'clothline', at: [1398, 2752], len: 88, pieces: 5,
    colors: ['#EDE8DB', '#E3DECE', '#D9D3C1', '#EEEAE0', '#E6E1D2'],
    why: "Sela's line, five pieces, never dyed; the vale's famous diagram hangs here every evening for anyone who thinks to look at laundry.",
    gaze: [
      'Washing out. Five pieces, all undyed, white as the gulls that heckle them.',
      'Of an evening every piece lifts and points up-valley. The sea breathes in of an evening.',
    ],
    journal: 'the laundry knows where the petals go',
  });

  // warm window for the light pass
  V.lightpass.add({ x: 1424, y: 2660, r: 60, when: 'night', a: 0.24 });

  // ── the weirs: two gates across the river ─────────────────────────────
  // The one sanctioned exception to staying out of the water: the gates
  // span it. Center paddle of each weir is the one you can work.
  function rideGate(gate, pl) {
    const sela = V.people.byId('sela');
    if (sela && sela.warmth > 0) {
      const destY = gate.y - 140;                      // a bit upstream
      const rx = riverX(destY);
      const eastNow = pl.x >= riverX(pl.y);
      pl.x = eastNow ? rx - 82 : rx + 82;              // the other bank
      pl.y = destY;
      V.textbox.say('', ['(You ride the gate up as it winds. Passage paid in attention.)']);
    } else {
      V.textbox.say('', ['...which is why the gates stick Thursdays.']);
    }
  }

  const weirAY = 2620, weirAX = riverX(weirAY);
  const weirAWhys = [
    "West paddle of the upper weir, wound from the bank stair; it takes the river's first argument and files it downstream.",
    "Sela's upper gate. She winds it on her own hours, and knowing them is the whole fare.",
    'East paddle of the upper weir, newer oak going copper-green like everything the Wennow touches twice a day.',
  ];
  for (let i = 0; i < 3; i++) {
    O.place({
      id: 'locks-weir-a-' + ['west', 'mid', 'east'][i], kind: 'prop', variant: 'gate',
      at: [weirAX + (i - 1) * 22, weirAY],
      why: weirAWhys[i],
      use: i === 1 ? function (pl) { rideGate(this, pl); } : undefined,
    });
  }

  const weirBY = 2820, weirBX = riverX(weirBY);
  const weirBWhys = [
    'West paddle of the lower weir; the ratchet sings a thin note the eels are said to set their run by.',
    'The lower gate, older than anyone winding it. It sticks Thursdays, famously, for reasons that are one story long.',
    'East paddle of the lower weir, patched after the flood with wood off the good winch, the only part anyone saved.',
  ];
  for (let i = 0; i < 3; i++) {
    O.place({
      id: 'locks-weir-b-' + ['west', 'mid', 'east'][i], kind: 'prop', variant: 'gate',
      at: [weirBX + (i - 1) * 22, weirBY],
      why: weirBWhys[i],
      use: i === 1 ? function (pl) { rideGate(this, pl); } : undefined,
    });
  }

  // ── the eel baskets: how her pages come down ──────────────────────────
  const marenPages = [
    'Alder down. Kingfisher approves. Moved the bench accordingly.',
    'Echo answers twice. Counted. Recounted. Kept.',
    'Out of green. Umber now. (Thank her properly for the green.)',
  ];
  function readEelBasket() {
    const i = V.state.flags.locksEelPage || 0;
    V.state.flags.locksEelPage = (i + 1) % marenPages.length;
    V.textbox.say('', [
      '(Under the eels: an oilcloth packet, tied river-tight. A page, in a fast hand.)',
      marenPages[i],
    ], function () {
      V.journal.note('pages come down the river in oilcloth. she is up there, working.');
    });
  }

  O.place({
    id: 'locks-eel-basket-1', kind: 'prop', variant: 'basket', at: [1340, 2848],
    why: "First of Sela's eel baskets, withy-woven off her own willow; at dusk it takes the run, and some mornings it takes the post.",
    use() { readEelBasket(); },
  });

  O.place({
    id: 'locks-eel-basket-2', kind: 'prop', variant: 'basket', at: [1372, 2866],
    why: "The second basket, set a stride downstream because eels argue with the current in twos; Maren's oilcloth finds this one when the first is full.",
    use() { readEelBasket(); },
  });

  O.place({
    id: 'locks-eel-box', kind: 'prop', variant: 'crate', at: [1350, 2812],
    why: "Sela's eel box, scrubbed between runs and shut against gulls; the lid dents where a large grey cat conducts inspections.",
    gaze: ['The eel box, scrubbed and shut. The lid holds a cat-shaped dent nobody authorized.'],
  });

  // ── the winch stump ───────────────────────────────────────────────────
  O.place({
    id: 'locks-winch-stump', kind: 'rock', at: [1370, 2648], scale: 1.1,
    why: 'What is left of the good winch: a stump and a socket, kept as evidence for a grievance now in its second decade of active service.',
    gaze: [
      "A stump where the good winch stood. The socket wears the ghost of a filed handle.",
      'The flood took it, and you could get her started on that. People do, on purpose.',
    ],
    journal: 'the good winch went with the flood. Sela can be got started on it.',
  });

  // ── the pear station ──────────────────────────────────────────────────
  O.place({
    id: 'locks-pear-station', kind: 'tree', variant: 'pear', at: [1380, 2440],
    why: "Station pear of the survey line where it crosses the working water; Maren paid herself in trees, and the Locks got this one.",
    gaze: ['A pear tree over the lock path. Petals off it ride upstream, evenings.'],
    journal: 'pear trees seem to make a line, going up',
    emit: [{ kind: 'petals', rate: 1.4, r: 26, dy: -24 }],
  });

  // ── the banks ─────────────────────────────────────────────────────────
  O.place({
    id: 'locks-willow-flood', kind: 'tree', variant: 'willow', at: [1195, 2600],
    why: 'Planted to hold the west bank the year of the flood; the willow won on points and has leaned over the water gloating ever since.',
  });

  O.place({
    id: 'locks-willow-withy', kind: 'tree', variant: 'willow', at: [1170, 2762],
    why: 'Sela cuts withies off this one for the eel baskets; it grows them back double, which both parties call a fair arrangement.',
  });

  O.place({
    id: 'locks-eelrun-bench', kind: 'bench', at: [1336, 2902],
    why: 'Set square to the weir pool because some dusks the river boils silver, and a bench that misses the eel run is only firewood.',
  });

  O.place({
    id: 'locks-heron', kind: 'heron', at: [1225, 2878], solid: false,
    why: 'An up-valley heron who discovered the eel run years ago and has kept the secret with total success.',
    gaze: ['The heron watches the weir pool like a debt is owed. Says nothing. Waits.'],
  });

  // reeds hug both banks, thickest at the weir pools
  V.painter.addField({ x: 1210, y: 2470, r: 80, type: 'reeds', density: 0.6 });
  V.painter.addField({ x: 1355, y: 2540, r: 75, type: 'reeds', density: 0.5 });
  V.painter.addField({ x: 1215, y: 2680, r: 75, type: 'reeds', density: 0.6 });
  V.painter.addField({ x: 1350, y: 2830, r: 70, type: 'reeds', density: 0.5 });
  V.painter.addField({ x: 1200, y: 2890, r: 80, type: 'reeds', density: 0.6 });
  V.painter.addField({ x: 1345, y: 2930, r: 65, type: 'reeds', density: 0.5 });

  // the heron keeps eel-run hours
  V.hooks.push(function () {
    const h = V.clock.hour();
    const hn = O.byId('locks-heron');
    if (hn) hn.hidden = !(h > 17.2 && h < 21.5);
  });
})(window.VALE);
