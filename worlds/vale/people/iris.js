// IRIS KELL — the bit: understatement with a delay on it.
// Grammar: two beats. The second arrives late or never. Calls the
// lighthouse "the work". Third Kell on the lamp; sevens, always sevens.
(function (V) {
  V.people.register({
    id: 'iris', name: 'Iris Kell',
    why: "The keeper. Third Kell on the lamp: her mother kept sevens and never said why, so Iris keeps the question lit along with the light. She calls all of it the work, stairs included, and understates everything except the dark.",
    tint: '#39506B', hair: '#9A9486', hat: '#2E3A46',
    schedule: [
      { h: 0, node: 'gullhead', dx: -30, sleep: true },   // the cottage by the tower
      { h: 7, node: 'gullhead', dx: -10 },                // day work: kelp, brass, weather
      { h: 17.8, node: 'gullhead', dx: 6 },               // polishing, dusk
      { h: 21, node: 'gullhead', dx: 2 },                 // the lamp is on; she stays up a while
    ],
    lines: {
      default: [
        'Sevens. Suits the water.',
        'Mother kept sevens. Somebody started it.',
        'Nobody finished it.',
        "Door's ajar means come up.",
        'Shut means come up quieter.',
        'The work keeps itself. Mostly.',
      ],
      dusk: [
        'Polish now. Shine later.',
        'Dusk. The work wakes up about now.',
        'Glass takes a cloth. The dark takes the rest.',
      ],
      night: [
        "Lamp's on. That was the whole job.",
        'Count them if you like. Seven, then the long dark.',
        'It turns all night. One of us can sit.',
        'Slow. It was never a race.',
      ],
      mist: [
        'Fog eats the light. The bell does the rest.',
        "Can't see the water. It can see us.",
        'Mist. The work earns its keep tonight.',
      ],
    },
    give: {
      pear: {
        boxes: [
          '(She looks at the pear a long time.)',
          "Her tree, this one's line. Thank you.",
        ],
      },
    },
    asks: [],
  });
})(window.VALE);
