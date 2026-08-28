// ODD BOLE — the bit: rates everything, spends no words.
// Grammar: seven words or fewer. Weather first. Drops pronouns.
(function (V) {
  V.people.register({
    id: 'odd', name: 'Odd Bole',
    why: "The ferryman; the vale's front door has a person and it is him. He rates stone skims because standards matter and words don't.",
    tint: '#4E5A64', hair: '#6E6A5A', hat: '#3A3E44',
    schedule: [
      { h: 0, node: 'landing', dx: -20 },
      { h: 5.5, node: 'landing', dx: 8, dy: -6 },
      { h: 11.9, node: 'bell', dx: 14, dy: 4 },      // pie on the bell bench, noon sharp
      { h: 12.8, node: 'landing', dx: 8, dy: -6 },
      { h: 20.5, node: 'landing', dx: -20 },
    ],
    lines: {
      default: [
        "Wind's gone round. Sit middle.",
        'Herons had the rock by six.',
        "Noon run. Was noon when I said it.",
        'Boat needs nothing. Rare day.',
        "Tide's thinking about it.",
      ],
      morning: ["First run's done. Sea behaved.", 'Gulls filed a complaint. Noted.'],
      noon: ['Pie.', 'Bench. Pie. Noon. System works.'],
      dusk: ["Last run's gone. Walk or stay.", "Lamp's up. Iris is on."],
      night: ['Boat sleeps. Should you.', "Sea's talking to itself. Let it."],
      rain: ['Rain. Boat fills. I empty.', 'Wet rope weighs double. Fact.'],
      mist: ['Fog. Bell day, if crossing.', 'Can hear the lamp today. Almost.'],
      longNoon: ['Thirteen bells. Bold.', 'Long noon. Pie went long. Thanks.'],
      nameKnown: ['Vale suits you. Somewhat.'],
    },
    give: {
      pear: { boxes: ['(He takes the pear and holds it up like a toast. Says nothing. Eats it in four.)'], },
      marble: { boxes: ["Not mine. Wick's. Sea's. Complicated."], keeps: true },
    },
    asks: [],
  });
})(window.VALE);
