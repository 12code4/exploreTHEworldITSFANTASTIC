// SELA — the bit: second halves of thoughts only. The first halves
// happened privately, earlier. Homeric on exactly one subject: the winch.
(function (V) {
  V.people.register({
    id: 'sela', name: 'Sela',
    why: "The lock keeper; the river is worked and she is the working of it. Her eyes are not what they were, which is how the vale gets read to.",
    tint: '#5E6B5A', hair: '#B9B4A6',
    schedule: [
      { h: 0, node: 'locks', dx: -16, sleep: true },
      { h: 6.5, node: 'locks', dx: 10 },
      { h: 14, node: 'locks', dx: 24, dy: -8 },
      { h: 17.8, node: 'locks', dx: 6, dy: 14 },
      { h: 20.5, node: 'locks', dx: -16, sleep: true },
    ],
    lines: {
      default: [
        '...which is why the gates stick Thursdays.',
        'Page came Tuesday. Alder is down. Busy week upstream.',
        '...so the eels are early, if anything.',
        'The GOOD winch had a handle filed to fit a working hand.',
        '...and the flood took it to the sea, where fish use it badly.',
      ],
      dusk: [
        '...points up-valley, see. The sea breathes in of an evening.',
        'Baskets first. Then the socks. Order matters.',
      ],
      rain: ['...which the river calls a compliment.', 'Gates hold. They sulk, but they hold.'],
      mist: ['...can hear the weir thinking in this.', '...so stay off the middle rope till it lifts.'],
      night: ['...long past basket hours.', '...which the river reads to itself.'],
      nameKnown: ['...so the vale kept your name. It does that.'],
    },
    give: {
      loaf: {
        boxes: ["So she's still on about the crust.", "You'll want the gate in a minute. Hold the middle rope."],
        resolve: 'bread-round',
        after(p) { V.journal.note('the gate-ride up was the thank-you'); },
      },
      pear: { boxes: ['(She weighs it, nods, sets it on the winch stump like an offering.)', '...which the winch would have liked.'] },
    },
    asks: [
      {
        id: 'read-to-sela', resolveOnTalk: true,
        resolveBoxes: [
          '"Alder down. Kingfisher approves. Moved the bench accordingly."',
          '(You read at walking pace. She winds, and listens.)',
          'Alder. Like all-and-her. No d worth hearing in this whole valley.',
        ],
        after(p) { V.journal.note('read her a page, out loud, over work, at dusk'); },
      },
      {
        id: 'read-to-sela', when: 'dusk',
        cond: (st) => st.flags.met_sela && V.people.byId('sela').warmth > 0,
        boxes: ['Eyes are not what they were. Page came down Tuesday.', 'Read it out? Slower than you think. She writes at walking pace.'],
        declineBox: '(She nods. The river reads to itself.)',
        stringNote: 'a page, owed aloud',
      },
    ],
  });
})(window.VALE);
