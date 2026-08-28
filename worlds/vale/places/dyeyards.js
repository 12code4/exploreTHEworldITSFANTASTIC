// THE DYE YARDS — where the vale keeps its color. Pigment terraces on
// the east bank: five steeped pools, cloth in flags, and the answer to
// where her inks come from. The one always-saturated place, and it earns it.
(function (V) {
  const O = V.objects;

  // the stripe no pool owns
  const IMPOSSIBLE = '#5AE8C8';

  // one pool, one stripe: the scarf keeps your colors in your order
  function dip(tint, name, note) {
    const s = V.journal.scarf;
    if (s.length && s[s.length - 1] === tint) {
      V.textbox.say('', ['The scarf already ends in ' + name + '. The pool declines to repeat itself.']);
      return;
    }
    if (Math.random() < 0.04) {
      s.push(IMPOSSIBLE);
      V.textbox.say('', ['The pool gives a color that is in no pool. It did that on its own.']);
      V.journal.note('the impossible stripe');
      return;
    }
    s.push(tint);
    V.state.toast('the scarf takes ' + name);
    V.journal.note(note);
  }

  // ---- the five pools, stepped up the slope, lowest first ----

  O.place({
    id: 'dyeyards-pool-madder', kind: 'pool', at: [1720, 3330], tint: '#D4586B',
    why: "The madder vat, lowest and oldest, fed on riverbank roots; it dyes the curtain-red half the Cross hangs, and Perl orders a bolt each spring so the bakery windows agree with the crust.",
    use(pl) { dip('#D4586B', 'madder', 'madder on the scarf — the same red as the bakery curtains'); },
  });

  O.place({
    id: 'dyeyards-pool-woad', kind: 'pool', at: [1795, 3245], tint: '#4A6FA5',
    why: "The woad vat, stirred sunwise only; it dyed Odd a sail once — he ordered it with a nod, collected it with a nod, and flies it still.",
    use(pl) { dip('#4A6FA5', 'woad', 'woad on the scarf — sail-blue, nod-approved'); },
  });

  const weldGaze = [
    'Butterflies, every one of them, and only ever on the yellow. Nobody knows why.',
    'Nettle has asked them. They answered by mobbing the yellow.',
  ];
  O.place({
    id: 'dyeyards-pool-weld', kind: 'pool', at: [1875, 3155], tint: '#E3B93E',
    why: "The weld vat, yellow from a weed that asks permission of nobody; Wick ordered one hair ribbon from it and paid in two marbles, which Nettle banked in a pot.",
    gaze: weldGaze,
    emit: [{ kind: 'butterflies', rate: 2, r: 60, colors: ['#E3B93E', '#F2D848'] }],
    use(pl) {
      // the butterflies get noticed before the pool gets used
      if (!V.state.flags.dyeyards_weld_seen) {
        V.state.flags.dyeyards_weld_seen = true;
        V.textbox.say('', weldGaze);
        V.journal.note('the butterflies only ever mob the yellow');
        return;
      }
      dip('#E3B93E', 'weld', 'weld on the scarf — the butterflies noticed');
    },
  });

  O.place({
    id: 'dyeyards-pool-orchil', kind: 'pool', at: [1965, 3075], tint: '#8E5A9E',
    why: "The orchil vat, lichen-steeped and slow as gossip; violet was her order but one, and Nettle keeps it living because orders have a way of coming back around.",
    use(pl) { dip('#8E5A9E', 'orchil', 'orchil on the scarf — her order but one'); },
  });

  O.place({
    id: 'dyeyards-pool-walnut', kind: 'pool', at: [2055, 3000], tint: '#6B4A32',
    why: "The walnut vat, umber from the tree's own husks, on order now: two bottles, when convenient, for a mapmaker gone up where the country runs to rock.",
    use(pl) { dip('#6B4A32', 'walnut', 'walnut umber on the scarf — what she is on now'); },
  });

  // ---- the lines: a hillside dressed in flags, waving at the Overlook ----

  O.place({
    id: 'dyeyards-line-low', kind: 'clothline', at: [1670, 3135], len: 110, pieces: 5,
    colors: ['#D4586B', '#4A6FA5', '#E3B93E', '#8E5A9E', '#F6EFE2'],
    why: "The low line, hung where the wind off the river hits first; if the flags ripple here, Nettle knows the weather before the sky has decided.",
    gaze: ['Cloth in every color the vale owns, waving at the whole valley.', 'From the Bend, they say, this line shows first.'],
    journal: 'the yards wave their colors at the whole vale',
  });

  O.place({
    id: 'dyeyards-line-mid', kind: 'clothline', at: [1895, 3240], len: 120, pieces: 5,
    colors: ['#4A6FA5', '#F6EFE2', '#D4586B', '#6B4A32', '#E3B93E'],
    why: "The long middle line, five sheets wide, where a whole woad order dries at once; when rain comes, this is the line that takes two pairs of hands.",
  });

  O.place({
    id: 'dyeyards-line-high', kind: 'clothline', at: [2090, 3105], len: 95, pieces: 4,
    colors: ['#8E5A9E', '#E3B93E', '#F6EFE2', '#4A6FA5'],
    why: "The high line catches the last sun, so whatever dries here dries truest; disagreements between dye and daylight get settled at this altitude.",
  });

  // ---- Nettle's shed and its small honest clutter ----

  O.place({
    id: 'dyeyards-shed', kind: 'shed', at: [2190, 2990], tint: '#6E5A42',
    why: "Nettle's work shed: pots, mordants, and a kettle at the almost-boil. The doorframe wears a wiped stripe of every color she has ever made.",
    gaze: ['The doorframe is striped with wiped fingers. Every color she ever made, in the order she made them.'],
    journal: 'the shed doorframe is a ledger of colors, wiped on in order',
  });

  O.place({
    id: 'dyeyards-kettle', kind: 'prop', variant: 'kettle', at: [2200, 3015],
    why: "The kettle. Dye waits on water and water waits on nobody, so it sits at the almost-boil from first light to last.",
    emit: [{ kind: 'steam', rate: 1.2, r: 6, dy: -14 }],
  });

  O.place({
    id: 'dyeyards-pot-spoons', kind: 'prop', variant: 'pot', at: [2168, 3012],
    why: "A madder pot with its rim burned rosy; retired from steeping, promoted to holding the good stirring spoons.",
  });

  O.place({
    id: 'dyeyards-pot-pinks', kind: 'prop', variant: 'pot', at: [2216, 3010],
    why: "A pot of Hollow pinks — foxglove and campion carried over the whole vale from the west bank, for a pink Nettle could almost grow here. Almost.",
    gaze: ['Foxglove and campion, a little wilted from the walk. Somebody crosses the river for this pink.'],
  });

  O.place({
    id: 'dyeyards-order-slip', kind: 'sign', at: [2158, 3020],
    why: "The latest order down from upstream, weighted with a river pebble the way all her slips arrive; Nettle keeps each one posted until the bottles go.",
    talkName: 'a color-order slip, weighted with a pebble',
    talkLines: [
      'Umber, two bottles, when convenient. — M.',
      'Underneath, older, crossed out: green, green, green, years of green.',
    ],
  });

  // ---- terrace bones: fences, trees, the judging bench ----

  O.place({
    id: 'dyeyards-fence-low', kind: 'fence', at: [1655, 3295], n: 8, dx: 16, dy: -7,
    why: "Terrace edging, driven in by whoever dug the step it holds; each generation of dyers re-drives the same posts a hand higher.",
  });

  O.place({
    id: 'dyeyards-fence-high', kind: 'fence', at: [1830, 3210], n: 8, dx: 16, dy: -7,
    why: "The second terrace line, leaning downhill in defiance of its job; it has held the step for sixty years of being about to fall.",
  });

  O.place({
    id: 'dyeyards-walnut-tree', kind: 'tree', variant: 'oak', at: [2125, 3040],
    why: "The walnut tree the umber vat drinks from; its husks stain everything they touch, which is the whole job description.",
    gaze: ['A walnut tree above the umber vat. The ground under it is stained the exact color of her order.'],
  });

  O.place({
    id: 'dyeyards-pear-station', kind: 'tree', variant: 'pear', at: [1730, 3000],
    why: "A pear of Maren's line, planted the year the yards mixed her first greens; the survey went up the east bank here, and the blossom still says so.",
    gaze: ['A pear tree among the vats, blossoming on schedule. The line of them keeps going up.'],
    journal: 'the pear line passes through the yards',
    emit: [{ kind: 'petals', rate: 1.4, r: 26, dy: -26 }],
  });

  O.place({
    id: 'dyeyards-judging-bench', kind: 'bench', at: [2120, 3140],
    why: "Ten steps back from the high line: the judging bench. Colors lie close up, so Nettle sits here and the cloth passes or steeps again.",
  });

  // dyer's rows gone half-wild: weld yellow and madder bloom below the vats
  V.painter.addField({ x: 1810, y: 3310, r: 130, type: 'flowers', colors: ['#E3B93E', '#D4586B'], density: 0.35 });

  // the shed window keeps late hours when an order is on
  V.lightpass.add({ x: 2190, y: 3000, r: 55, when: 'night', a: 0.22 });
})(window.VALE);
