// THE CHORUS — one great line each, two at most. Density of people is
// density of world; the knowable cast stays ten, and these are the vale
// around them.
(function (V) {
  function stander(def) {
    def.static = true;
    def.schedule = [{ h: 0, at: def.at }];
    delete def.at;
    V.people.register(def);
  }

  stander({
    id: 'ch-post', name: 'the post', at: [1216, 4452], tint: '#4A5A6E', hat: '#38434E',
    why: "The vale's letters walk on one good knee and one honest one; the knee is the weather service.",
    lines: { default: ['The knee knows rain. The knee is never wrong.'], rain: ['Knee called it at dawn. Nobody listens.'] },
  });

  stander({
    id: 'ch-curate', name: 'the curate', at: [1078, 4468], tint: '#3A3E44',
    why: "Wept at the loaf once, famously; has been living it down with great dignity ever since.",
    lines: { default: ['I wept at the loaf once. We don’t discuss it.', 'The window does the sermons, frankly.'] },
  });

  stander({
    id: 'ch-granny-window', name: 'granny at her window', at: [1042, 4404], tint: '#7A6252', hair: '#D8D2C4',
    why: "Has watched the ridge road from this sill for sixty years and considers it hers by attendance.",
    lines: { default: ['That’s Maren’s tree, that one. And that one. And that one.', 'You walk like somebody who’ll be back.'] },
  });

  stander({
    id: 'ch-kid-stones', name: 'kid on the stones', at: [1296, 4318], tint: '#B9524A',
    why: "Guards the ford by self-appointment; the river has counted her brother once and it stuck.",
    lines: { default: ['Step wrong and the river COUNTS it!', 'It counted my brother! He’s still weird!'] },
  });

  stander({
    id: 'ch-kid-two', name: 'second kid', at: [1330, 4326], tint: '#4A6FA5',
    why: "The counted brother. He is fine. Mostly. He watches the water more than most.",
    lines: { default: ['It’s true. It counted me.', 'I don’t mind. We’re even now.'] },
  });

  stander({
    id: 'ch-fisherman', name: 'old fisherman', at: [1005, 5052], tint: '#3E4A52', hat: '#2A3238',
    why: "Retired from the sea into watching it, which he insists is the harder job done properly.",
    lines: { default: ['The sea’s fine. It’s the land I watch.', 'Boats behave. People, now.'] },
  });

  stander({
    id: 'ch-fens-rival', name: 'Fen’s rival (self-declared)', at: [1700, 4080], tint: '#6B5A42',
    why: "Counts the stars out of spite and love in equal measure; Fen has never once noticed the rivalry, which fuels it.",
    lines: { default: ['I count the STARS. Anyone can count a lighthouse.', 'Six thousand nights of sevens. I have INFINITY.'] },
  });

  stander({
    id: 'ch-ferry-regular', name: 'ferry regular', at: [1085, 5028], tint: '#5E6B5A',
    why: "Rides the noon run for no reason anyone has established, including her; the cat approves of her.",
    lines: { default: ['The cat’s fare is a sardine. Mine’s a nod. Fair’s fair.', 'Odd said four words once. Big day.'] },
  });

  stander({
    id: 'ch-basket-woman', name: 'woman with a basket', at: [1188, 4368], tint: '#8E6E5E',
    why: "Carries the vale's gossip between the bakery and the locks at a strict domestic pace.",
    lines: { default: ['Petals went up again last night. UP.', 'Perl says the crust’s on purpose. Sela says. Well.'] },
  });

  stander({
    id: 'ch-jar-boy', name: 'boy with a jar', at: [682, 3648], tint: '#4E8A73',
    why: "Collecting fog for reasons that are airtight at his age; the jar has nearly had some twice.",
    lines: { default: ['I’m collecting fog. Nearly got some.'], mist: ['THIS IS THE DAY. Hold the lid.'] },
  });

  stander({
    id: 'ch-chapel-man', name: 'man outside the chapel', at: [1112, 4462], tint: '#5A544A',
    why: "Attends the window rather than the service and considers the distinction theological.",
    lines: { default: ['I only go for the window. Don’t tell the curate.'] },
  });

  stander({
    id: 'ch-yards-aunt', name: 'aunt of the yards', at: [1830, 3086], tint: '#D4586B', hair: '#B9B4A6',
    why: "Nettle's aunt by argument rather than blood; comes up for the cloth-bringing and stays for the wind.",
    lines: { default: ['A hillside in flags. My washing never waves at ME.', 'The butterflies only love the yellow. Snobs.'] },
  });

  // market morning doubles the Cross
  const marketFolk = [
    { id: 'ch-granny-stall', name: 'market granny', at: [1262, 4436], tint: '#7A5242', hair: '#D8D2C4',
      why: "Sixty years at the same stall; the pears ripen out of respect.",
      lines: { default: ['Sixty years at this stall. The pears fear me.', 'Feel that one. FEEL it. That’s a Tuesday pear.'] } },
    { id: 'ch-plum-man', name: 'the plum man', at: [1228, 4446], tint: '#6E4A6E',
      why: "Sells plums and one strong opinion about plums, refreshed weekly.",
      lines: { default: ['Plums are just patient cherries. Quote me.'] } },
  ];
  for (const f of marketFolk) stander(f);
  V.hooks.push(function () {
    const market = V.clock.daily().market;
    for (const f of marketFolk) {
      const p = V.people.byId(f.id);
      if (p) p.hiddenNow = !market || V.clock.hour() < 7 || V.clock.hour() > 14;
    }
  });
})(window.VALE);
