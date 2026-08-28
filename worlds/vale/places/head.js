// THE HEAD — the hut, the doorframe, the last page's doorstep.
// Sparse on purpose: the whole vale has been one long gesture, and this
// is the hand opening. ~8 placed things, each meant.
(function (V) {
  const O = V.objects;

  // Maren's hut, west of the path so the door faces the way you came.
  O.place({
    id: 'head-hut', kind: 'hut', at: [1150, 1545], home: true,
    door: '#5C6B50',
    why: "Maren's one-room hut at the head of her line; the window stays warm every night she is out on the page, because gone was never the plan.",
    gaze: [
      'The door is on the latch. One lamp, one chair pushed back mid-thought, a blanket thrown open.',
      'A house held at the exact temperature of somebody coming back.',
    ],
  });

  // the kettle on the doorstep stone
  O.place({
    id: 'head-kettle', kind: 'prop', variant: 'kettle', at: [1168, 1554],
    why: "Filled and set warm before every walk out onto the page, so that coming home is a thing already half done.",
    gaze: ['The kettle, on its stone by the door.', 'Still warm. Just stepped out.'],
    emit: [{ kind: 'steam', rate: 0.5, r: 4, dy: -10 }],
  });

  // THE MAP, out on the crate she calls a table
  O.place({
    id: 'head-map-crate', kind: 'prop', variant: 'crate', at: [1196, 1532],
    why: "Her drawing table is a crate because a table would mean stopping; the newest map sits out in the weather, which is how she proofs them.",
    gaze: [
      'On the crate, weighted with a river stone: her newest map. THIS vale, finished except one edge.',
      'The paths are inked darkest where they are worn darkest. On the darkest ones, drawn small, walking: a figure.',
      'It is you.',
    ],
    journal: 'her map has been recording you. the world explored back.',
  });

  // the cat that was waiting
  O.place({
    id: 'head-cat', kind: 'cat', at: [1180, 1582], tint: '#C9A05A',
    why: "It walked up with Maren years ago, decided the head of the vale wanted keeping, and has been expecting you, specifically, for some time.",
    gaze: ['(The cat looks at you like you are late, pleasantly. It starts up the path.)'],
    onGaze() {
      if (V.state.flags.headCatLed) return;
      V.state.flags.headCatLed = true;
      const c = O.byId('head-cat');
      if (c) {
        c.x = 1198; c.y = 1444; // ahead of you, nearer the doorframe
        c.gaze = ['(Ahead of you again, sitting where the grass meets the doorframe. Patient at you.)'];
      }
    },
  });

  // THE DOORFRAME — nudged just west of the node, out of the water
  O.place({
    id: 'head-doorframe', kind: 'doorframe', at: [1210, 1395],
    why: "Older than her survey and standing when she first got here; she mapped around it the way you map around weather. It was not hers to explain.",
    gaze: [
      'A doorframe, standing alone in the grass. No wall, no hinges, no door.',
      'Walk through it or around it. Same thing.',
    ],
  });

  // the LAST pear tree: the line's end
  O.place({
    id: 'head-last-pear', kind: 'tree', variant: 'pear', at: [1168, 1680],
    why: "The last tree of the line Maren paid herself in, one per survey station, Landing to Head; past this one she stopped counting and kept walking.",
    gaze: [
      'A pear tree. The line comes up the whole vale, station by station, and ends here.',
      'The last station. Past here she stopped counting.',
    ],
    journal: 'the pear line ends here. past this tree she stopped counting.',
    emit: [{ kind: 'petals', rate: 1.2, r: 24, dy: -24 }],
  });

  // one bench, the only one in the vale that faces DOWN it
  O.place({
    id: 'head-bench', kind: 'bench', at: [1146, 1716],
    why: "The one bench in the vale that faces back down it; she built it last, because the final thing a survey should measure is how it all looks from the top.",
    onSit() {
      V.journal.note('dusk falls; the lights of the vale come on below; you could live here.');
    },
  });

  // her doorstep garden, gone gently feral: cream and butter, low and few
  V.painter.addField({ x: 1104, y: 1608, r: 85, type: 'flowers', colors: ['#EFE6C8', '#F2E4A6', '#E9D8B4'], density: 0.25 });

  // the hut window: always warm at night
  V.lightpass.add({ x: 1132, y: 1528, r: 70, when: 'night', a: 0.35 });
})(window.VALE);
