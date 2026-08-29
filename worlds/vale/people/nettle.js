// NETTLE — the bit: colors as verbs, moods and weather. Talks to the
// pools like livestock. Barters adjectives.
(function (V) {
  V.people.register({
    id: 'nettle', name: 'Nettle',
    why: "The dyer; the vale's color comes through her arms, which are stained to the elbow in every year she has ever worked. Maren still orders inks, so the pools stay steeped.",
    tint: '#8E5A9E', hair: '#3A3328',
    schedule: [
      { h: 0, node: 'yards', dx: -10, sleep: true },
      { h: 5.8, node: 'yards', dx: 20, dy: -10 },
      { h: 12, node: 'yardstop' },
      { h: 13.2, node: 'yards', dx: 6 },
      { h: 19, node: 'yards', dx: -10, sleep: true },
    ],
    lines: {
      default: [
        "Sky's doing a weld-yellow. Won't last.",
        'Nothing yellow lasts.',
        "She's on umber now. Was years of green.",
        'Umber means rock. Rock means up.',
        'Settle! You are not the sea. Nobody said you were the sea.',
        'Pick with your chest, not your eyes.',
      ],
      morning: ['Pools first. They sulk if the light beats me.', 'Madder slept badly. You can tell.'],
      dusk: ['Cloth comes in dry or not at all.', 'The wind turns beggar of an evening. It can have the smell.'],
      rain: ["You're rained on. Good. Means it counted.", 'The pools drink. Nobody panic.'],
      mist: ['Everything undyed today. Even me.', 'Weld pool still finds the butterflies. In THIS.'],
      night: ['Colors sleep. I mostly believe them.'],
      nameKnown: ['The vale said your name in madder. Suits you.'],
    },
    give: {
      pear: { boxes: ['(She weighs it like a pigment. Approves.)', 'Pear-green. Now THAT was a year.'] },
      marble: { boxes: ['Sea-glass blue. Keep it. Some colors choose.'], keeps: true },
    },
    asks: [],
  });
})(window.VALE);
