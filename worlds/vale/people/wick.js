// LITTLE WICK — the bit: kid-certainty, rules invented mid-sentence and
// binding immediately. The only one allowed the banned words, wrongly.
(function (V) {
  const O = V.objects;

  V.people.register({
    id: 'wick', name: 'Little Wick',
    why: "The chalker. She maps the vale wrong on the flagstones with total confidence — except the pond, which is right — and she trades marbles with the sea, which pays its debts slowly.",
    tint: '#C46A54', hair: '#8A5A32',
    schedule: [
      { h: 0, node: 'cottage', dy: 30, sleep: true },
      { h: 9, node: 'bell', dx: -30 },       // the flags: chalk, marbles, jurisdiction
      { h: 13, node: 'ford', dx: -20 },      // paddling allowed. encouraged, honestly
      { h: 16, node: 'bell', dx: -24 },
      { h: 19.5, node: 'cottage', dy: 30, sleep: true },
    ],
    lines: {
      // the Looker changes what is true, so the loop is honest about it
      get default() {
        return V.state.flags.wick_looker
          ? [
              "Everyone says there's no pond. Everyone hasn't been!",
              'I drew Odd’s boat with legs and he looked at it for AGES.'.replace('’', "'"),
              'Did you look at the bell yet? It goes mysterious.',
              'The sea and me are square now. It knows what it did.',
              "I explored under the bench. It's fantastic under there.",
              'Lend means forever if I said forever. I said forever.',
            ]
          : [
              "It's not lost! The sea is HOLDING it. That's different.",
              "You owe me a green one now. It's the rules. I just made them.",
              "Everyone says there's no pond. Everyone hasn't been!",
              "The Looker makes everything go church windows. You can't have it.",
              '...One marble. Tell the sea it owes me.',
              "I drew Odd's boat with legs and he looked at it for AGES.",
              "I explored under the bench. It's fantastic under there.",
            ];
      },
      morning: [
        "Chalk before the bell is practice. Practice doesn't count.",
        'Cold flags eat chalk. Everyone knows that.',
      ],
      noon: [
        'Watching the pie is allowed. Asking is not.',
        'Stand in the church colors and you count as glass. New rule.',
      ],
      afternoon: [
        "Step around the dragon. It isn't finished being a ridge.",
        "The Locks aren't upside down. The river is.",
      ],
      dusk: [
        'Ada counts me with the cats if I sit still. I sit STILL.',
        'Petals go UP at dusk. I reported it first.',
      ],
      rain: [
        "Rain doesn't beat chalk. It only borrows it.",
        'The rain took my dragon. Now it owes me a dragon.',
      ],
      mist: [
        'The fog is the sea, come up to look at my map. Obviously.',
      ],
      longNoon: [
        'THIRTEEN! Whoever rang that is my favorite now.',
      ],
      nameKnown: [
        'I knew your name first. Knowing quietly counts double.',
      ],
    },
    give: {
      // the marble trade: no formal ask — the tide pools made the ask already
      marble: {
        get boxes() {
          return V.state.flags.wick_looker
            ? [
                'ANOTHER one? The sea is showing off now.',
                'It goes in the bank. The bank is my pocket.',
              ]
            : [
                "Deal's a deal. The sea paid up.",
                '(She hands over a brass-and-tin tube: the Looker.)',
                'Look at the bell with it first! The bell goes mysterious!',
              ];
        },
        after(p, pl) {
          if (V.state.flags.wick_looker) return;
          V.state.flags.wick_looker = true;
          pl.looker = true;
          V.state.toast('the Looker is yours. L raises it.');
          V.journal.note("traded the sea's marble for the Looker");
        },
      },
      pear: {
        boxes: ['(She eats it in nine bites, narrating each. Pockets the stem, which is lucky now.)'],
      },
    },
    asks: [],
  });

  // ---------- her jurisdiction, in chalk ----------

  O.place({
    id: 'wick-marble-ring', kind: 'prop', variant: 'marbles', at: [1186, 4360],
    why: "Wick's marble court on the flags: the rules are chalked beside the ring and amended mid-game, and the amendments are binding, even on the sea.",
    gaze: [
      'A chalk ring and three marbles mid-game. The rules are chalked beside it, twice amended.',
      'The green one is missing. The sea is HOLDING it.',
    ],
    journal: 'the sea is holding the green one',
  });

  O.place({
    id: 'wick-chalk-boat', kind: 'prop', variant: 'chalk', at: [1243, 4330],
    why: "She chalked Odd's boat here with legs, so it can walk up the vale on days the sea is busy; Odd looked at it for ages, which under her rules is a commission.",
    gaze: [
      "Odd's boat, in chalk, with legs. It is walking up the vale.",
      'Somebody stood and looked at this for ages. The chalk can tell.',
    ],
    journal: "Odd's boat has legs now, in chalk",
  });

  // chalk stays until the rain; she redraws on her ford hours
  V.hooks.push(function () {
    const boat = O.byId('wick-chalk-boat');
    if (!boat) return;
    const F = V.state.flags;
    if (V.clock.weatherNow() === 'rain') F.wickBoatWashed = true;
    const h = V.clock.hour();
    if (F.wickBoatWashed && h >= 13 && h < 16) F.wickBoatWashed = false;
    boat.hidden = !!F.wickBoatWashed;
  });
})(window.VALE);
