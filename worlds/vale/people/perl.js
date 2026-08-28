// PERL — the bit: never asks for help; describes situations until they're yours.
// Grammar: talks to the dough and the oven as colleagues. Counts things.
(function (V) {
  V.people.register({
    id: 'perl', name: 'Perl',
    why: "The baker; the vale's day starts when her chimney does. She never asks for help — she counts everything, talks to the dough like a colleague, and describes situations until they belong to somebody with legs.",
    tint: '#B08A5E', hair: '#5A4636', hat: '#E8DFC8',
    schedule: [
      { h: 0, node: 'bakery', dx: -8, sleep: true },
      { h: 4.2, node: 'bakery', dx: 6, dy: 16 },      // fires the oven before dawn; the sill loaf goes out at first light
      { h: 12.5, node: 'bell', dx: -12, dy: 6 },      // a breather at the bell; Odd's pie is still there to gossip at
      { h: 13.2, node: 'bakery', dx: 6, dy: 16 },
      { h: 20, node: 'bakery', dx: -8, sleep: true }, // bakers keep hen hours
    ],
    lines: {
      default: [
        "That's the third gull today with opinions.",
        "Rise or don't. We both know you will.",
        "Forty loaves, two hands, one oven. The sums stay rude.",
        "Sill's empty and the tray's not. Somebody walks it four steps.",
      ],
      morning: [
        "Eight loaves behind. Don't help. Stand somewhere useful.",
        "Sill loaf's the custom. Take it. No ceremony!",
        'The last one who made a ceremony wept.',
      ],
      dusk: [
        "Ovens banked. Tomorrow's sponge is set and muttering.",
        "Counted the cats going by. Eleven. Ada's short one.",
      ],
      rain: [
        "Sill loaf's indoors. Custom doesn't hold in weather.",
        'Flour and rain make paste. The doorstep learned that first.',
      ],
      longNoon: [
        'Thirteen bells. The dough believed every one.',
        "Meals run late all day. Not my count, not my fault.",
      ],
      nameKnown: [
        'Your name got here Tuesday. I still say bread-runner.',
      ],
    },
    give: {
      pear: {
        boxes: ['(She slices it thin without looking and sets it down for the cats. "They know Tuesdays," she says, on a Thursday.)'],
      },
    },
    asks: [
      {
        id: 'bread-round', when: 'morning',
        cond: (st) => st.flags.met_sela,
        boxes: [
          "You've been up the Locks way. Seen the state of her socks.",
          "This loaf's hers. Gets stale or gets carried, no business of mine which.",
        ],
        declineBox: 'Fair enough. Wind was wrong for favors anyway.',
        stringNote: 'a loaf, going up',
        onAccept(p, pl) {
          pl.carry = 'loaf';
          V.textbox.say('Perl', ["Cloth it or it rides wet. Crust's on purpose this time!"]);
        },
        // resolution lives with Sela: her file gives loaf {resolve: 'bread-round'}
      },
    ],
  });
})(window.VALE);
