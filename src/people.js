// People with routines on the clock, voices with grammars, warmth that is
// remembered and never displayed, and asks made face to face. Nobody here
// issues a task through an interface; strings live on the journal.
(function (V) {
  const P = V.people = {};
  const U = V.util;
  P.list = [];

  // def: {id, name, tint, home, schedule: [{h, node|at, act}], lines: {...},
  //       asks: [...], give: {itemId: [boxes]}, bit}
  P.register = function (def) {
    if (!def.why) throw new Error('INTERROGATION FAILED: person "' + def.id + '" has no why.');
    def.x = 0; def.y = 0; def.fx = 0; def.fy = 1;
    def.route = null; def.routeI = 0; def.walking = false;
    def.saidToday = [];
    def.warmth = 0;
    P.list.push(def);
  };

  P.byId = (id) => P.list.find((p) => p.id === id);

  function currentStop(p) {
    const h = V.clock.hour();
    let stop = p.schedule[p.schedule.length - 1];
    for (const s of p.schedule) { if (h >= s.h) stop = s; }
    return stop;
  }

  function stopPos(s) {
    if (s.at) return s.at;
    const n = V.layout.nodes[s.node];
    return [n[0] + (s.dx || 0), n[1] + (s.dy || 0)];
  }

  P.update = function (dt) {
    for (const p of P.list) {
      if (p.static) continue;
      const stop = currentStop(p);
      const dest = stopPos(stop);
      if (!p.placed) { p.x = dest[0]; p.y = dest[1]; p.placed = true; p.curStop = stop; }
      if (p.curStop !== stop) {
        // walk the node graph to the new stop
        const from = V.layout.nearestNode(p.x, p.y);
        const to = stop.node || V.layout.nearestNode(dest[0], dest[1]);
        p.route = V.layout.route(from, to).map((id) => V.layout.nodes[id]).concat([dest]);
        p.routeI = 0; p.curStop = stop;
      }
      if (p.route) {
        const tgt = p.route[p.routeI];
        const d = U.dist(p.x, p.y, tgt[0], tgt[1]);
        if (d < 6) { p.routeI++; if (p.routeI >= p.route.length) { p.route = null; p.walking = false; } }
        else {
          const sp = 62;
          p.fx = (tgt[0] - p.x) / d; p.fy = (tgt[1] - p.y) / d;
          p.x += p.fx * sp * dt; p.y += p.fy * sp * dt;
          p.walking = true;
        }
      } else p.walking = false;
    }
  };

  // --- talk ---
  // choose a bank: event flags first, then weather, then phase, then default
  P.lineFor = function (p) {
    const flags = V.state.flags;
    const banks = p.lines;
    const tryBank = (name) => {
      const bank = banks[name];
      if (!bank || !bank.length) return null;
      const fresh = bank.filter((l) => !p.saidToday.includes(l));
      const pick = (fresh.length ? fresh : bank)[Math.floor(Math.random() * (fresh.length ? fresh.length : bank.length))];
      return pick;
    };
    for (const ev of ['longNoon', 'nameKnown']) {
      if (flags[ev] && banks[ev]) { const l = tryBank(ev); if (l) return l; }
    }
    const wx = V.clock.weatherNow();
    if (banks[wx]) { const l = tryBank(wx); if (l && Math.random() < 0.6) return l; }
    const ph = V.clock.phase();
    if (banks[ph]) { const l = tryBank(ph); if (l && Math.random() < 0.7) return l; }
    return tryBank('default') || '...';
  };

  P.talk = function (p, player) {
    // giving beats talking: your hands speak first
    if (player.carry && p.give && p.give[player.carry]) {
      const boxes = p.give[player.carry];
      const item = player.carry;
      V.textbox.say(p.name, Array.isArray(boxes) ? boxes : boxes.boxes, () => {
        if (!boxes.keeps) player.carry = null;
        p.warmth++;
        if (boxes.resolve) V.asks.resolve(boxes.resolve);
        if (boxes.after) boxes.after(p, player);
        V.journal.note('gave ' + item + ' — ' + p.name);
      });
      return;
    }
    // an open ask resolves in person
    for (const a of p.asks || []) {
      if (V.asks.isOpen(a.id) && a.resolveOnTalk && (!a.needs || player.carry === a.needs)) {
        V.textbox.say(p.name, a.resolveBoxes, () => {
          if (a.needs) player.carry = null;
          V.asks.resolve(a.id);
          p.warmth += 2;
          if (a.after) a.after(p, player);
        });
        return;
      }
    }
    // a new ask offered at its hour, refusable with a shake of the head
    for (const a of p.asks || []) {
      if (V.asks.isOpen(a.id) || V.asks.isDone(a.id)) continue;
      if (a.when && V.clock.phase() !== a.when) continue;
      if (a.cond && !a.cond(V.state, player)) continue;
      V.textbox.ask(p.name, a.boxes, () => {
        V.asks.open(a.id, p.id, a.stringNote || a.id);
        if (a.onAccept) a.onAccept(p, player);
      }, () => {
        if (a.declineBox) V.textbox.say(p.name, [a.declineBox]);
      });
      return;
    }
    const line = P.lineFor(p);
    p.saidToday.push(line);
    if (p.saidToday.length > 40) p.saidToday.shift();
    V.textbox.say(p.name, [line]);
    if (!V.state.flags['met_' + p.id]) {
      V.state.flags['met_' + p.id] = true;
      V.journal.note('met ' + p.name);
    }
  };

  P.nearest = function (x, y, r) {
    let best = null, bd = r || 40;
    for (const p of P.list) {
      const d = U.dist(x, y, p.x, p.y);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  };

  P.draw = function (ctx, p) {
    const bob = p.walking ? Math.sin(V.wind.time() * 11 + p.x) * 1.4 : 0;
    const x = p.x, y = p.y + bob * 0.3;
    ctx.fillStyle = 'rgba(30,40,30,0.22)';
    ctx.beginPath(); ctx.ellipse(x, p.y + 2, 8, 3, 0, 0, 6.28); ctx.fill();
    // body: a warm little person, tinted their own way
    ctx.fillStyle = p.tint || '#8A6844';
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x - 6, y - 13, x, y - 14);
    ctx.quadraticCurveTo(x + 6, y - 13, x + 5, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#E8C9A8';
    ctx.beginPath(); ctx.arc(x, y - 17 + bob * 0.4, 4.4, 0, 6.28); ctx.fill();
    ctx.fillStyle = p.hair || '#4A4238';
    ctx.beginPath(); ctx.arc(x, y - 18.4 + bob * 0.4, 3.8, 3.4, 6.1); ctx.fill();
    if (p.hat) { ctx.fillStyle = p.hat; ctx.fillRect(x - 5, y - 21.4, 10, 2.4); ctx.fillRect(x - 3, y - 24, 6, 3); }
  };

  P.newDay = function () { for (const p of P.list) p.saidToday = []; };
})(window.VALE);
