// ADA — the bit: the vale's whole aphorism budget, half spent undercutting it.
// Grammar: stories with detours. Cats as punctuation.
// Also registers GRIM, the laziest cat in the vale, who is never lost.
(function (V) {
  const O = V.objects;

  V.people.register({
    id: 'ada', name: 'Ada',
    why: "The grandmother's cottage is hers now, and with it every stone's cat-name and the vale's entire aphorism budget — half of which she spends taking the other half back.",
    tint: '#8A5A4E', hair: '#CFC9BC',
    schedule: [
      { h: 0, node: 'cottage', sleep: true },
      { h: 8, node: 'cottage', dx: 10 },                 // the doorstep chair, sun side
      { h: 17.5, node: 'cottage', dx: -14 },             // feeding the cats at dusk
      { h: 21, node: 'cottage', sleep: true },
    ],
    lines: {
      default: [
        "Nim never forgave us for the bell. Cats keep accounts.",
        "A question you can keep is worth two you've spent.",
        "My mother said that. She also ate a wasp once.",
        "Tansy! Off the butter!",
      ],
      dusk: [
        "Grim's not lost. He's somewhere warm being magnificent.",
        "And I'm old and you have legs.",
        'Feeding hour. They allow it.',
      ],
    },
    give: {
      pear: {
        boxes: [
          '(She slices it for the cats before you finish offering.)',
          'Moss gets the stem end. He knows why.',
        ],
      },
    },
    asks: [
      {
        id: 'wheres-grim', when: 'dusk',
        cond: (st) => !st.flags['grimFound' + V.clock.day],
        boxes: [
          "Grim's off again. He is not lost. He has never once been lost.",
          'But he is somewhere warm being magnificent and I am old and you have legs.',
        ],
        declineBox: 'Fair. He will gloat home eventually.',
        stringNote: 'find Grim (he is fine)',
      },
    ],
  });

  // ---------- Grim ----------

  O.place({
    id: 'grim', kind: 'cat', at: [1420, 4162], tint: '#3A3328', solid: false,
    why: "The laziest cat in the vale and its most epic sleeper; he has never once been lost, only magnificent in venues of his own choosing. Ada sends people after him so the vale gets walked.",
    gaze: ['(Grim is asleep. Magnificently.)'],
    onGaze() {
      V.journal.grim++;
      V.state.flags['grimFound' + V.clock.day] = true;
      if (V.asks.isOpen('wheres-grim')) V.asks.resolve('wheres-grim');
    },
  });

  // Grim's circuit of absurd venues, one per day, picked by the calendar:
  // ON the seventh chimney; the bell bench; the jetty; the chalk pond;
  // the arm of Fen's watch. He is exactly where he means to be.
  const grimSpots = [
    [1420, 4162],   // on top of the seventh chimney, of course
    [1258, 4408],   // the bell bench, in the pie hour's leavings of sun
    [1040, 5040],   // the jetty, between the bench and the boards' warmth
    [668, 3600],    // the chalk pond, where the echo minds its manners
    [2116, 3585],   // the arm of Fen's watch; Fen counts around him
  ];
  let grimLastDay = -1;
  V.hooks.push(function () {
    const g = O.byId('grim');
    if (!g) return;
    const day = V.clock.day;
    const s = grimSpots[day % 5];
    g.x = s[0]; g.y = s[1];
    if (day !== grimLastDay) {
      grimLastDay = day;
      // overnight he has relocated; Ada may wonder aloud again come dusk
      if (V.asks.isDone('wheres-grim') && !V.state.flags['grimFound' + day]) {
        delete V.asks.doneIds['wheres-grim'];
      }
    }
  });
})(window.VALE);
