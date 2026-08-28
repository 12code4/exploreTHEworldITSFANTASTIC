// FEN — the bit: numbers out loud, one swerve per conversation.
// Grammar: precise, then suddenly not. Tea ends feelings. He is the
// traveler from the fable — came up for one night, stayed years,
// counting the sevens from the watch. He does not leave. Neither
// does the letter, in the end.
(function (V) {
  V.people.register({
    id: 'fen', name: 'Fen',
    static: true,
    why: "The traveler from the fable who came up for one night and stayed years to count the sevens. Six thousand and forty-one nights on slate, a kettle kept one swallow ahead of every feeling, and one letter that has never once made it down to the lighthouse.",
    tint: '#5E6B52', hair: '#8E8A7A', hat: '#5A5346',
    schedule: [
      { h: 0, node: 'watch', dx: 4, dy: 4 }, // one stop. He does not leave; the count does not either.
    ],
    lines: {
      default: [
        'Six thousand and forty-one nights. All sevens.',
        'Tea?',
        'Stand here. No — here. Now wait.',
        'There! Nobody builds that. It just happens.',
        'Six thousand and forty-two tomorrow. Weather permitting.',
        'Kettle handles the feelings. I handle the sevens.',
      ],
      night: [
        'Once I dreamt it did eight. Never told the lighthouse.',
        'Told the kettle about the eight. Kettle keeps a confidence.',
        'Now — watch. Seven. You saw. Witnessed.',
        'Seven, then the long dark. The dark is part of the count.',
      ],
      mist: [
        "Can't see her tower. The count goes on regardless.",
        'Mist. I count the glow. The glow keeps sevens too.',
        'Tea. Mist gets into the feelings.',
      ],
      longNoon: ['Thirteen bells. Recorded. Filed under weather.'],
      nameKnown: ['Your name came up the ridge. I tallied it.'],
    },
    give: {
      pear: {
        boxes: [
          '(He goes quiet.)',
          'She used to bring me these.',
        ],
      },
    },
    asks: [
      {
        id: 'fens-letter', when: 'morning',
        cond: (st) => st.flags.met_iris, // "to the keeper" should mean someone you have met
        boxes: [
          'To the keeper. Direct. Steady hands.',
          'Yours are steady? Fine. Fine.',
        ],
        declineBox: 'Wise. Wise. Forget it. (He does not mean forget it.)',
        stringNote: 'his letter, going down',
        onAccept(p, pl) {
          pl.carry = 'letter';
          V.textbox.say('Fen', ['Go before I—', '(He stops himself. Pours tea.)']);
        },
        // no resolve anywhere down-valley: the letter never arrives. See below.
      },
    ],
  });

  // He has done this to everyone in the vale. Everyone knows. Iris knows.
  // Carry the letter to within sight of her door and he has already run
  // you down the ridge. Flag-guarded so the catch fires once per open ask.
  V.hooks.push(function () {
    if (V.state.flags.fen_letter_caught) return;
    if (!V.asks.isOpen('fens-letter')) return;
    const pl = V.player;
    if (!pl || pl.carry !== 'letter') return;
    if (V.textbox.active()) return;
    const g = V.layout.nodes.gullhead;
    if (V.util.dist(pl.x, pl.y, g[0], g[1]) >= 150) return;
    V.state.flags.fen_letter_caught = true;
    V.textbox.say('Fen, out of breath', [
      'Changed the wording! One word! Give it —',
      '(He takes it back.)',
      'Nothing personal. It is a comma, really, at root.',
    ], function () {
      pl.carry = null;
      V.asks.resolve('fens-letter');
      V.journal.note('some asks are kept by failing them far enough. everyone knows. Iris knows.');
    });
  });
})(window.VALE);
