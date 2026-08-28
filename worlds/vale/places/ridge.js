// PEAR RIDGE — the road that shows you the world. The ridge road climbs
// out of the Cross; at the Bend stands the tree of the fable, blossom
// showing over the hill exactly as promised. Fen counts at the top.
(function (V) {
  const O = V.objects;

  // ---- THE tree at the Bend ------------------------------------------
  O.place({
    id: 'ridge-bend-pear', kind: 'tree', variant: 'pear', at: [2018, 3768], scale: 1.6,
    why: "The pear tree of the fable. The second mapmaker planted it where its blossom would show over the hill from below, and it does, every spring, exactly as promised.",
    gaze: [
      'The tree at the Bend. Its blossom shows over the hill from the Cross, exactly as promised.',
      'Somebody planted it just here so that it would. The tree has kept the promise ever since.',
    ],
    journal: 'the blossom over the hill kept its promise',
    emit: [{ kind: 'petals', rate: 3.4, r: 46, dy: -34 }],
    fields: [{ type: 'petalfall', r: 90, colors: ['#F4C7D4', '#FBF1DC'], density: 0.5, dy: 14 }],
  });

  O.place({
    id: 'ridge-bend-bench', kind: 'bench', at: [2000, 3780],
    why: "Somebody who understood the tree set a bench beneath it, facing down-valley, so the blossom falls on you while the whole vale holds still below.",
  });

  // windfalls: the tree pays out a few each day; the vale walks them to doorsteps
  O.place({
    id: 'ridge-windfall-1', kind: 'prop', variant: 'pear', at: [2034, 3786],
    lift: 'pear', liftOnce: true, liftNote: 'a pear from the Bend, for a doorstep',
    why: "A windfall from the Bend tree. A pear on a doorstep is a greeting here, and the tree keeps the whole vale supplied with hellos.",
  });

  O.place({
    id: 'ridge-windfall-2', kind: 'prop', variant: 'pear', at: [2010, 3794],
    lift: 'pear', liftOnce: true, liftNote: 'a second pear. one at a time, in the hands',
    why: "Another windfall, dropped in the night while nobody watched. The grass under the Bend tree is never empty for long and never crowded either.",
  });

  // ---- the pear LINE: one tree per survey station, going up ----------
  O.place({
    id: 'ridge-pear-line-1', kind: 'tree', variant: 'pear', at: [1628, 4118],
    why: "Maren paid herself in pear trees, one per survey station. This one stands exactly a station up the road from the gate, still on duty.",
    gaze: ['A pear tree by the ridge road. Up the way — is that another?'],
    emit: [{ kind: 'petals', rate: 1.2, r: 24, dy: -24 }],
  });

  O.place({
    id: 'ridge-pear-line-2', kind: 'tree', variant: 'pear', at: [2030, 3872],
    why: "One survey-station on from the last pear, sighted blossom to blossom. Maren measured the vale in trees she would never eat from.",
    gaze: ['Another pear, a long sight up from the last. The spacing feels deliberate. Measured, even.'],
    journal: 'the pear trees stand a station apart. somebody measured in trees',
    emit: [{ kind: 'petals', rate: 1.2, r: 24, dy: -24 }],
  });

  O.place({
    id: 'ridge-pear-line-3', kind: 'tree', variant: 'pear', at: [2082, 3652],
    why: "The last pear before the watch, a survey-station apart from its sister below. From here the line of blossom points on up the vale, the way she went.",
    gaze: ['From under this pear you can see the next blossom, and past it, more. A line, going up.'],
    emit: [{ kind: 'petals', rate: 1.2, r: 24, dy: -24 }],
  });

  // ---- the milestone -------------------------------------------------
  O.place({
    id: 'ridge-milestone', kind: 'milestone', at: [1768, 4030],
    why: "Set when the ridge road was young, it gave two distances all its life — until someone came up one night with a chisel and an opinion about Across.",
    gaze: [
      'WENNOW CROSS ½ · ACROSS —',
      'The distance to Across has been chiselled out. By someone. At some point.',
    ],
    journal: 'the milestone will not say how far Across is',
  });

  // ---- Fen's watch ---------------------------------------------------
  O.place({
    id: 'ridge-fen-telescope', kind: 'telescope', at: [2132, 3552],
    why: "Fen came up for one night years ago and stayed to count. The telescope is his, aimed wherever his wondering went last, and anyone may look.",
    use(pl) {
      const views = [
        ['The lamp room, mid-polish. The lens keeps handing Iris the sun and taking it back.'],
        ['The nine stones on the moor, in rough court. The heather leans past them, up-valley.'],
        ['The Steps, far up-valley. Blossom on the ledges, like the stair itself is flowering.'],
      ];
      const i = V.state.flags.ridgeScopeView || 0;
      V.state.flags.ridgeScopeView = (i + 1) % views.length;
      V.textbox.say('through the telescope', views[i]);
    },
  });

  O.place({
    id: 'ridge-fen-kettle', kind: 'prop', variant: 'kettle', at: [2108, 3566],
    why: "Fen's kettle. Tea ends feelings, he says, so the kettle stays one swallow ahead of every feeling on the ridge.",
    gaze: ['The kettle is just off the boil.', 'It is always just off the boil. Nobody has ever caught it cold.'],
  });

  O.place({
    id: 'ridge-fen-slates', kind: 'prop', variant: 'slates', at: [2138, 3572],
    why: "The tally slates, stacked like a book the lighthouse dictated one flash at a time. He keeps them dry and in order and will not say which order.",
    gaze: ['Slate after slate of tallies, sevens by the slate-load.', 'Six thousand nights and change. Not one eight among them.'],
    journal: 'six thousand nights of sevens, kept on slate',
  });

  O.place({
    id: 'ridge-fen-rock', kind: 'rock', at: [2158, 3512],
    why: "Fen's dusk rock. He stands on it when the lamp first lights, out of respect, though he would tell you it is for the sightline.",
    gaze: ['A flat-topped rock, worn where feet go. Somebody stands here at dusk. The grass says so.'],
  });

  // ---- the long green go ---------------------------------------------
  O.place({
    id: 'ridge-longgreengo', kind: 'rock', at: [1955, 3792],
    why: "The launch rock of the grass slide. Generations of children have set off from it and worn the top smooth as an argument for going again.",
    gaze: [
      'Below, the grass runs long and green all the way down, combed all one way.',
      'Scratched small on the rock: THE LONG GREEN GO.',
    ],
    journal: 'locals call the slope the long green go',
  });

  // ---- roadside honesty: fence, rocks --------------------------------
  O.place({
    id: 'ridge-fence-1', kind: 'fence', at: [1650, 4200], n: 8, dx: 18, dy: -14,
    why: "A fence with no flock left to argue with. It leans up-valley like everything else here and keeps at nothing, faithfully.",
  });

  O.place({
    id: 'ridge-rock-1', kind: 'rock', at: [1688, 4066],
    why: "A lean-worthy rock at the climb's half-sigh, polished at hip height by everyone who has ever stopped here to breathe and pretend to admire the view.",
    gaze: ['A good leaning rock. Polished at exactly leaning height.'],
  });

  O.place({
    id: 'ridge-rock-2', kind: 'rock', at: [2048, 3700],
    why: "A rock the road bends around rather than through. The road was moved, the rock was not, and both have been fine with it for a hundred years.",
  });

  // ---- gorse and flowers in Blossom colors along the slope -----------
  V.painter.addField({ x: 1592, y: 4188, r: 100, type: 'flowers', colors: ['#F6E19A', '#FBF1DC'], density: 0.4 });
  V.painter.addField({ x: 1850, y: 3990, r: 170, type: 'flowers', colors: ['#F6E19A', '#CFE3C0'], density: 0.35 });
  V.painter.addField({ x: 1732, y: 4088, r: 110, type: 'flowers', colors: ['#F4C7D4', '#FBF1DC'], density: 0.3 });
  V.painter.addField({ x: 2160, y: 3624, r: 110, type: 'flowers', colors: ['#B9AEDC', '#E7A9C4'], density: 0.35 });

  // Fen's small light, up late with the sevens
  V.lightpass.add({ x: 2120, y: 3560, r: 55, when: 'night', a: 0.2, flicker: true });

  // the Bend tree pays out fresh windfalls each new day
  V.hooks.push(function () {
    const day = V.clock.day;
    if (V.state.flags.ridgeWindfallDay !== day) {
      V.state.flags.ridgeWindfallDay = day;
      const a = O.byId('ridge-windfall-1');
      const b = O.byId('ridge-windfall-2');
      if (a) a.hidden = false;
      if (b) b.hidden = false;
    }
  });
})(window.VALE);
