// HOB — grammar: none. A shape at the far edge of the clearing, already
// leaving. He waves. Once.
(function (V) {
  V.people.register({
    id: 'hob', name: '',
    why: "Perl's shy brother, who burns charcoal by night and speaks in absence; the world runs unwatched and he is how you learn that.",
    tint: '#2E2A24', hair: '#1E1A16',
    static: true,
    schedule: [{ h: 0, at: [740, 3560] }],
    lines: {
      default: ['(He is already leaving. At the far edge of the clearing, he waves. Once.)'],
    },
    give: {
      pear: { boxes: ['(He takes it so gently you are not sure it happened. He is already leaving.)'] },
    },
    asks: [],
  });

  // by day he is elsewhere, being nobody's business
  V.hooks.push(function () {
    const hob = V.people.byId('hob');
    if (!hob) return;
    const h = V.clock.hour();
    const out = h > 21.4 || h < 4.2;
    hob.x = out ? 740 : -400;
    hob.y = out ? 3560 : -400;
  });
})(window.VALE);
