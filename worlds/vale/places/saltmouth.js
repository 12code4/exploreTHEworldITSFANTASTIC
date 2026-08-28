// SALTMOUTH — the mouth of the world. Arrival country: the densest
// guidance budget in the vale and none of it is interface.
(function (V) {
  const O = V.objects;

  O.place({
    id: 'jetty', kind: 'jetty', at: [1065, 5062], len: 76,
    why: "The landing the whole vale steps ashore at; its piles wear tide marks like rings in a tree, one ring per winter anyone remembers.",
    gaze: ['Tide marks climb the piles. Somebody has inked a little line beside the highest and written: THAT year.'],
    journal: 'the jetty remembers THAT year',
  });

  O.place({
    id: 'landing-bench', kind: 'bench', at: [1020, 5028],
    why: "Where you wait for the ferry, or don't wait for anything, which the bench considers equally honorable work.",
  });

  O.place({
    id: 'lighthouse', kind: 'lighthouse', at: [1950, 5040],
    why: "Iris Kell keeps the light her mother kept and her mother's mother kept. It blinks in sevens. It has always blinked in sevens.",
    gaze: ['The lamp turns. Sevens, with a long dark after.', 'Somebody has counted these flashes for six thousand nights and lives up the ridge.'],
    journal: 'the lighthouse blinks in sevens. always sevens.',
  });

  O.place({
    id: 'boathouse-hull', kind: 'boat', at: [878, 4952], patched: true, scale: 1.1,
    why: "Odd's father built hulls; this upturned one is his last, kept dry and useful. Maren patched its cracks with a spoiled sheet of her first survey — she papered half the vale.",
    gaze: ['The hull is patched with old paper. Lean closer: it is a MAP. The vale, drawn young, in a quick hand.'],
    journal: 'the boathouse hull is patched with a map of the vale, drawn young',
  });

  O.place({
    id: 'good-rock', kind: 'rock', at: [1420, 5195], scale: 1.6, solid: false,
    why: "The best rock in the harbor by heron consensus, contested every morning against the gulls, who file complaints.",
    gaze: ['A good rock. THE good rock, by the look of the droppings ledger.', 'The herons hold it at dawn. By midmorning, politics.'],
    journal: 'the good rock has a schedule like everyone else',
  });

  O.place({
    id: 'tidepool-1', kind: 'prop', variant: 'tidepool', at: [1560, 5122],
    why: "The tide restocks these twice a day: shells, sea glass, and — some days — a marble, because a child up the vale trades marbles with the sea.",
    use(pl) {
      const day = V.clock.day;
      if (day % 3 === 1 && !V.state.flags['marble_' + day] && !pl.carry) {
        V.state.flags['marble_' + day] = true;
        pl.carry = 'marble';
        V.textbox.say('', ['A marble, sea-rolled and patient, sitting in the pool like it was posted to you.']);
        V.journal.note('the sea gave back a marble');
      } else {
        V.textbox.say('', ['Shells. Sea glass throwing small prisms. A crab with somewhere to be.']);
      }
    },
  });

  O.place({
    id: 'tidepool-2', kind: 'prop', variant: 'tidepool', at: [1650, 5100],
    why: "A second pool, because pools come in archipelagos; this one specializes in very small crabs with very large opinions.",
    gaze: ['A very small crab squares up to you, wins, and leaves.'],
  });

  O.place({
    id: 'crab-pots', kind: 'prop', variant: 'crate', at: [1110, 5010],
    why: "Odd's pots, stacked in the order he will not explain and will not change; the harbor's one filing system.",
    gaze: ['Crab pots, stacked in an order that is clearly an order. No two people agree on what kind.'],
  });

  O.place({
    id: 'net-posts', kind: 'fence', at: [960, 5075], n: 5, dx: 14,
    why: "Net-drying posts, leaning the way forty years of the same evening wind has asked them to.",
  });

  O.place({
    id: 'salt-shed', kind: 'shed', at: [990, 4915], tint: '#6E6A5A',
    why: "The salt shed: barrels, rope, and the cool smell of low tide made architecture. The door sticks; everyone knows the shoulder trick.",
    gaze: ['The door sticks. There is a polished patch at shoulder height where the whole vale has hit it.'],
  });

  O.place({
    id: 'coast-sign', kind: 'sign', at: [1180, 4800],
    why: "The coast road fork wants a sign the way all forks do; this one was painted by whoever had paint, which shows.",
    talkLines: ['WENNOW CROSS — ½ bell, up the way.', 'THE SEA — you have found it. Well done.'],
    talkName: 'a leaning sign',
  });

  O.place({
    id: 'gullhead-hollies', kind: 'prop', variant: 'basket', at: [1870, 5010], hidden: false,
    why: "Iris's kelp basket, set where she drops it every dusk on her way up to polish, exactly one stride from the door.",
    gaze: ["A basket of kelp. Still wet. Somebody's dusk routine passes through here like clockwork made of seaweed."],
  });

  // pear tree at the landing: the first station of Maren's survey line
  O.place({
    id: 'pear-landing', kind: 'tree', variant: 'pear', at: [1130, 4880],
    why: "The first pear of Maren's line — she paid herself in trees, one per survey station, Landing to Head. The blossom points the way she went.",
    gaze: ['A pear tree, blossoming over the coast road. Up the vale — is that another?'],
    journal: 'pear trees seem to make a line, going up',
    emit: [{ kind: 'petals', rate: 1.6, r: 26, dy: -26 }],
  });

  O.place({
    id: 'heron-1', kind: 'heron', at: [1408, 5178], solid: false,
    why: "The senior heron, who has held the good rock through eleven administrations of gulls.",
    gaze: ['The heron regards you with the patience of a creature that has already won today.'],
  });

  // sea holly softens the strand
  V.painter.addField({ x: 1500, y: 5060, r: 160, type: 'flowers', colors: ['#B9AEDC', '#CFE3C0'], density: 0.3 });

  // warm points for the light pass
  V.lightpass.add({ x: 990, y: 4925, r: 60, when: 'night', a: 0.2 });   // salt shed window
  V.lightpass.add({ x: 1950, y: 4975, r: 90, when: 'night', a: 0.3 });  // lighthouse door

  // the herons keep office hours on the rock
  V.hooks.push(function () {
    const h = V.clock.hour();
    const heron = O.byId('heron-1');
    if (heron) heron.hidden = !(h > 5 && h < 10.5);
  });
})(window.VALE);
