// WENNOW CROSS — the village at the ford. Seven chimneys, six hearths,
// one bell anybody may ring, and every front door a color somebody
// argued for. The vale's palette in miniature, one door per story.
(function (V) {
  const O = V.objects;

  // ---------- the bell ----------

  O.place({
    id: 'cross-bell', kind: 'bellpost', at: [1240, 4392],
    why: "The Cross bell: rung on the hour by whoever is nearest, you included. It rang thirteen once, famously, and the vale kept the mistake.",
    use(pl) {
      const F = V.state.flags;
      const now = Date.now();
      if (now - (F.crossRingT || 0) < 4000) F.crossRingN = (F.crossRingN || 0) + 1;
      else F.crossRingN = 1;
      F.crossRingT = now;
      V.audio.bell(((Math.floor(V.clock.hour()) + 11) % 12) + 1);
      V.journal.note('rang the hour, being nearest');
      if (F.crossRingN >= 13 && !F.longNoon) {
        F.longNoon = true;
        V.state.toast('the long noon begins');
      }
    },
  });

  O.place({
    id: 'cross-bell-bench', kind: 'bench', at: [1222, 4404],
    why: "The bell bench. Odd's pie lands on it at noon sharp, and the system, as he says, works.",
  });

  O.place({
    id: 'cross-notice-board', kind: 'sign', at: [1212, 4422],
    why: "The notice board by the bell: losses, rumors, and ferry times live here, pinned crooked. Objectives never have.",
    talkName: 'the notice board',
    talkLines: [
      'LOST: one glove, green, left hand. Answers to the other one.',
      'FERRY: dawn, midmorning, noon-ish, dusk-ish. The ish is old.',
      'PETALS GOING UP AGAIN. Underneath, another hand: they do that.',
      'A slip, fast and sure: orchil, two bottles, when convenient. — M.',
    ],
  });

  O.place({
    id: 'cross-chalk-map', kind: 'prop', variant: 'chalk', at: [1196, 4380],
    why: "Wick chalked this after lunch and will defend every wrong line of it; the villagers step around it, which is the correct review.",
    gaze: [
      "Wick's chalk map of the vale. The ridge is a dragon and the Locks are upside down.",
      'Everything is wrong except a pond in the wood, drawn sure, exactly once.',
    ],
    journal: "Wick's maps are wrong except the pond",
  });

  // ---------- the bakery ----------

  O.place({
    id: 'cross-bakery', kind: 'house', at: [1096, 4310], tint: '#D8C7A8', roof: '#8A6A50', door: '#E3B93E',
    why: "Perl's bakery: the oven is older than the door, and the door has been butter-yellow since Perl won the argument with her mother by repainting it at night.",
    gaze: ['The oven never quite cools. Somewhere in the flour-light, Perl is telling the dough the news.'],
    emit: [{ kind: 'smoke', when: 'dawn', rate: 1.4, r: 6, dx: 14, dy: -52 }],
  });

  O.place({
    id: 'cross-sill-loaf', kind: 'prop', variant: 'basket', at: [1074, 4316],
    why: "Perl's sill basket: the traveler's loaf goes out at first light, no ceremony, and the vale judges you kindly for taking it.",
    lift: 'loaf',
    liftNote: 'took the sill loaf, as is the custom',
    gaze: ["The traveler's loaf, out on the sill at first light. Take it. No ceremony."],
  });

  O.place({
    id: 'cross-bakery-cat', kind: 'cat', at: [1136, 4316], tint: '#B9985E',
    why: "The bakery cat sleeps in the proof baskets and is not to be moved; Perl counts it among the equipment.",
    gaze: ['Asleep in a proof basket, rising slightly, like the dough. Not to be moved.'],
  });

  // ---------- the chapel and the Rose ----------

  O.place({
    id: 'cross-chapel', kind: 'chapel', at: [1080, 4420], chimney: false,
    why: "The fishing families leaded the Rose from wreck-glass and bottle-bottoms, one pane per boat, and built the chapel around the window rather than the other way about.",
    gaze: [
      'The Rose over the altar: wreck-glass and bottle-bottoms, no two panes alike. The chapel book says which is whose.',
      'At clear noon the whole window fires, and color leaks out the door onto the step.',
    ],
    journal: 'the chapel leaks color at clear noon',
  });

  O.place({
    id: 'cross-chapel-doorstep', kind: 'rock', at: [1080, 4432], solid: false,
    why: "One long stone, oddly shaped for a doorstep, brought down for luck the year the bell cracked; the wear of boots has nearly finished what a carver started.",
    gaze: [
      'The doorstep is a single long stone, oddly shaped, worn smooth by generations of boots.',
      'Under the wear, faint, a carving. A name.',
    ],
    learnName: 'Old Nim',
    journal: 'the chapel doorstep is a stone with a name',
  });

  O.place({
    id: 'cross-chapel-cat', kind: 'cat', at: [1090, 4434], tint: '#4A4238', hidden: true,
    why: "The chapel cat attends the noon service because the Rose lays colored light on the front pew, and the cat knows exactly what that light is for.",
    gaze: ['The chapel cat, sat square in the colored light. This is why it attends.'],
  });

  // flowers by the chapel wall, where the bees hold their own service
  V.painter.addField({ x: 1030, y: 4482, r: 130, type: 'flowers', colors: ['#B9AEDC', '#E8B7C4', '#CFE3C0'], density: 0.4 });

  // ---------- grandmother's cottage ----------

  O.place({
    id: 'cross-cottage', kind: 'house', at: [1156, 4192], tint: '#D8CBB2', roof: '#7A6A50', door: '#D88A9C',
    why: "Grandmother's cottage, Ada's now; the door is foxglove-pink because the grandmother argued a door should look like a flower, and nobody in that family ever lost an argument to a fact.",
    gaze: ['Saucers by the step outnumber the cats, which takes doing. Ada is ready for opinions at dusk.'],
  });

  // ---------- the six other hearths (and the one that is not) ----------

  O.place({
    id: 'cross-house-woad', kind: 'house', at: [1020, 4360], tint: '#D8CBB2', roof: '#8A6A50', door: '#3E5A7A',
    why: "Tam's door: woad blue, argued for through a whole winter against his mother, who wanted green. The vale calls it the blue that won.",
  });

  O.place({
    id: 'cross-house-madder', kind: 'house', at: [1190, 4450], tint: '#CFC0A4', roof: '#7A5A44', door: '#A8433A',
    why: "Hessa painted her door madder red so her husband could find home in sea-mist. He says he never once got lost, which is what the door is for.",
  });

  O.place({
    id: 'cross-house-weld', kind: 'house', at: [1150, 4530], tint: '#D8CBB2', roof: '#8A6A50', door: '#D9B23E',
    why: "The twins argued yellow against yellow for a month and, both having won, painted the door in the one weld batch Nettle had going.",
  });

  O.place({
    id: 'cross-house-green', kind: 'house', at: [980, 4470], tint: '#D2C9B8', roof: '#7A756A', door: '#3F5A44',
    why: "The curate argued for bottle-green after the sea glass in the Rose, in the one sermon everyone remembers. The door was repainted by Friday.",
  });

  O.place({
    id: 'cross-house-orchil', kind: 'house', at: [1060, 4240], tint: '#D8CBB2', roof: '#8A6A50', door: '#7A5A8A', chimney: false,
    why: "Bett argued for orchil violet so the missing smoke would not be the first thing you notice; her hearth fell in the flood year and Perl's oven has warmed her since.",
  });

  O.place({
    id: 'cross-house-dark', kind: 'house', at: [1225, 4245], tint: '#CFC7B4', roof: '#8A8578', door: '#8A8578', home: false, chimney: false,
    why: "The Marrow house, swept and kept but never lit since that family walked to Across; the vale airs it Tuesdays and argues gently over whether grey counts as a color.",
    gaze: ['Swept step, clean windows, no light behind them. Somebody keeps this house without living in it.'],
  });

  // ---------- the seventh chimney ----------

  O.place({
    id: 'cross-seventh-chimney', kind: 'chimney', at: [1420, 4180],
    why: "A chimney with no house, alone in the yew hedge; warm at dusk, soot-door without a keyhole. The vale's unopenable door, load-bearing, and a favorite bed of Grim's.",
    gaze: [
      'A chimney alone in the yew hedge, belonging to no house. The brick is warm at dusk.',
      'A little iron soot-door, no keyhole. It does not open. It never has.',
    ],
    journal: 'the seventh chimney answers nothing',
  });

  // the yew hedge the chimney stands in
  const yewAt = [[1388, 4156], [1452, 4162], [1400, 4208], [1446, 4202], [1430, 4140]];
  const yewWhys = [
    "Planted the year the bell cracked, to keep the chimney company, some say. The yews are not saying.",
    "Grown from a cutting of a churchyard yew, which makes this hedge older than it looks and knows it.",
    "The birds planted this one and the hedge kept it, because hedges take what winters offer.",
    "Bent up-valley like everything here; even the hedge leans toward where the maps stop.",
    "The gap-filler, set in after a sheep proved the hedge had a sheep-sized hole in it.",
  ];
  for (let i = 0; i < yewAt.length; i++) {
    O.place({ id: 'cross-yew-' + i, kind: 'tree', variant: 'yew', at: yewAt[i], why: yewWhys[i] });
  }

  // ---------- the edges of the village ----------

  O.place({
    id: 'cross-pear-north', kind: 'tree', variant: 'pear', at: [1224, 4184],
    why: "Another of Maren's survey pears, one per station; this one marks where the lane leaves the Cross and starts to climb.",
    gaze: ['Another pear, blossoming over the lane north. The line keeps going up the vale.'],
    emit: [{ kind: 'petals', rate: 1.6, r: 26, dy: -26 }],
  });

  O.place({
    id: 'cross-wishing-stump', kind: 'rock', at: [1002, 4548], scale: 1.3, solid: false,
    why: "An oak stump older than the bakery, ringed with coins hammered edge-on for wishes; nobody starts the custom, nobody stops it, and nobody counts.",
    gaze: [
      'Coins hammered edge-on into old wood, years of them, green with wishing.',
      'Nobody starts this custom. Nobody stops it either.',
    ],
    journal: 'coins go edge-on into the wishing stump',
  });

  O.place({
    id: 'cross-ford-willow', kind: 'tree', variant: 'willow', at: [1168, 4610],
    why: "A willow the river planted for itself below the ford; the fox crosses under it at night, which the willow does not report.",
  });

  // ---------- market morning ----------

  O.place({
    id: 'cross-stall-plums', kind: 'stall', at: [1165, 4368], tint: '#B9524A', solid: false, hidden: true,
    why: "The market granny's stall, sixty years standing; the flagstones remember its feet, and the pears, famously, fear her.",
    talkName: 'the plum stall',
    talkLines: [
      'Sixty years at this stall. The pears fear me.',
      'Plums travel worse than gossip. Eat it before the bell.',
    ],
  });

  O.place({
    id: 'cross-stall-wool', kind: 'stall', at: [1120, 4394], tint: '#7A8AA0', solid: false, hidden: true,
    why: "The wool stall where every scarf in the vale started undyed, including the traveler's; the seller knows her own knots on sight.",
    talkName: 'the wool stall',
    talkLines: [
      'Undyed, dyed, and one skein the pool did on its own. Not for trade, that one.',
      'That scarf you wear started on this table. They all did.',
    ],
  });

  // ---------- night windows ----------

  V.lightpass.add({ x: 1078, y: 4292, r: 60, a: 0.25, when: function (h) { return (h > 3 && h < 7.5) || h > 20.5; } }); // Perl fires the oven before dawn
  V.lightpass.add({ x: 1146, y: 4174, r: 55, a: 0.22, when: 'night' }); // Ada, up with the cats
  V.lightpass.add({ x: 1176, y: 4432, r: 50, a: 0.2, when: 'night' });  // Hessa's window, lit for the fog

  // ---------- hooks: the clock runs the village ----------

  // the chapel cat attends the noon light, else it is elsewhere on business
  V.hooks.push(function () {
    const cat = O.byId('cross-chapel-cat');
    if (!cat) return;
    const h = V.clock.hour();
    const attending = h > 11.7 && h < 12.7;
    cat.hidden = !attending;
    if (attending) { cat.x = 1090; cat.y = 4434; }
  });

  // market stalls stand on market mornings only
  V.hooks.push(function () {
    const d = V.clock.daily(), h = V.clock.hour();
    const on = d.market && h > 5.5 && h < 14.5;
    const s1 = O.byId('cross-stall-plums'), s2 = O.byId('cross-stall-wool');
    if (s1) s1.hidden = !on;
    if (s2) s2.hidden = !on;
  });
})(window.VALE);
