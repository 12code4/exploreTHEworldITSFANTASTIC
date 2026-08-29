// The loop. Also the small shared state: flags, strings, toasts, saving,
// and the arrival — because every game here opens mid-crossing, with the
// lighthouse already blinking and no goal issued, ever.
(function (V) {
  const U = V.util;

  // ---------- shared state ----------
  const ST = V.state = { flags: {}, toasts: [] };
  ST.toast = function (t) { ST.toasts.push({ t, age: 0 }); if (ST.toasts.length > 3) ST.toasts.shift(); };

  const AS = V.asks = { openIds: {}, doneIds: {} };
  AS.open = function (id, who, note) { AS.openIds[id] = true; V.journal.tie(id, who, note); };
  AS.isOpen = (id) => !!AS.openIds[id];
  AS.isDone = (id) => !!AS.doneIds[id];
  AS.resolve = function (id) { delete AS.openIds[id]; AS.doneIds[id] = true; V.journal.untie(id); };

  // ---------- canvas ----------
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const CAM = V.camera;
  function fit() {
    const scale = Math.min(innerWidth / CAM.SW, innerHeight / CAM.SH);
    canvas.style.width = CAM.SW * scale + 'px';
    canvas.style.height = CAM.SH * scale + 'px';
    CAM.dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = CAM.SW * CAM.dpr;
    canvas.height = CAM.SH * CAM.dpr;
  }
  addEventListener('resize', fit); fit();

  // ---------- input ----------
  const input = { up: 0, down: 0, left: 0, right: 0, tap: null };
  const KEYS = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
  addEventListener('keydown', (e) => {
    V.audio.start();
    if (mode === 'title') { mode = hasSave ? 'resume' : 'intro'; return; }
    if (KEYS[e.code] && !V.journal.open) {
      if (V.textbox.active()) { if (e.code === 'ArrowLeft' || e.code === 'KeyA') V.textbox.left(); if (e.code === 'ArrowRight' || e.code === 'KeyD') V.textbox.right(); }
      else input[KEYS[e.code]] = 1;
    }
    if (V.journal.open && (e.code === 'ArrowLeft' || e.code === 'KeyA')) V.journal.flip(-1);
    if (V.journal.open && (e.code === 'ArrowRight' || e.code === 'KeyD')) V.journal.flip(1);
    if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
      e.preventDefault();
      if (V.textbox.active()) V.textbox.advance();       // any mode: the box always answers the button
      else if (mode === 'play') V.player.interact();
    }
    if (e.code === 'KeyJ') V.journal.toggle();
    if (e.code === 'KeyM') V.audio.mute();
    if (e.code === 'KeyL' && V.player.looker) { V.player.lookerOn = !V.player.lookerOn; }
  });
  addEventListener('keyup', (e) => { if (KEYS[e.code]) input[KEYS[e.code]] = 0; });
  canvas.addEventListener('pointerdown', (e) => {
    V.audio.start();
    if (mode === 'title') { mode = hasSave ? 'resume' : 'intro'; return; }
    if (V.textbox.active()) {
      if (V.textbox.isAsking()) {
        const rr = canvas.getBoundingClientRect();
        V.textbox.choose((e.clientX - rr.left) / rr.width < 0.5 ? 0 : 1);
      }
      V.textbox.advance(); return;
    }
    if (V.journal.open) { V.journal.toggle(); return; }
    const r = canvas.getBoundingClientRect();
    const sx = (e.clientX - r.left) / r.width * CAM.SW;
    const sy = (e.clientY - r.top) / r.height * CAM.SH;
    const v = CAM.view();
    const wx = v.x + sx / CAM.zoom * (CAM.zoom), wy = v.y + sy / CAM.zoom * (CAM.zoom);
    // convert screen to world properly
    const wxx = CAM.x + (sx - CAM.SW / 2) / CAM.zoom;
    const wyy = CAM.y + (sy - CAM.SH / 2) / CAM.zoom;
    const near = V.people.nearest(wxx, wyy, 30) || V.objects.nearest(wxx, wyy, 30);
    if (near && U.dist(V.player.x, V.player.y, near.x, near.y) < 52) { V.player.interact(); input.tap = null; }
    else input.tap = { x: wxx, y: wyy };
  });

  // ---------- save ----------
  const SAVEKEY = 'wennow-vale';
  function save() {
    if (mode !== 'play') return; // never persist mid-crossing or mid-title
    try {
      const warmth = {};
      for (const p of V.people.list) if (p.warmth) warmth[p.id] = p.warmth;
      localStorage.setItem(SAVEKEY, JSON.stringify({
        clock: V.clock.save(), player: V.player.save(), journal: V.journal.save(),
        flags: ST.flags, asks: { open: AS.openIds, done: AS.doneIds }, sketch: V.sketchworld.save(),
        warmth,
      }));
    } catch (e) {}
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVEKEY) || 'null');
      if (!s) return false;
      V.clock.load(s.clock); V.player.load(s.player); V.journal.load(s.journal);
      ST.flags = s.flags || {}; AS.openIds = (s.asks || {}).open || {}; AS.doneIds = (s.asks || {}).done || {};
      V.sketchworld.load(s.sketch);
      if (s.warmth) for (const id in s.warmth) { const p = V.people.byId(id); if (p) p.warmth = s.warmth[id]; }
      // a save should never wake you in deep water or inside a wall
      if (V.player.x && (V.terrain.water(V.player.x, V.player.y) === 2 || V.terrain.blocked(V.player.x, V.player.y))) {
        V.player.x = V.layout.spawn[0]; V.player.y = V.layout.spawn[1];
      }
      return true;
    } catch (e) { return false; }
  }

  // ---------- modes: title (always) -> intro (first time) or play ----------
  let mode = 'title';
  let introT = 0;
  const hasSave = load() && !!V.player.x;

  // debug affordances for the postcard ritual (dev only, harmless)
  const q = new URLSearchParams(location.search);
  if (q.get('t')) { V.clock.t = parseFloat(q.get('t')) * 60; }
  if (q.get('at') && V.layout.nodes[q.get('at')]) {
    const n = V.layout.nodes[q.get('at')];
    V.player.x = n[0]; V.player.y = n[1] + 20;
    mode = 'play';
    CAM.jump(V.player.x, V.player.y);
  }
  if (q.get('day')) V.clock.day = parseInt(q.get('day'));
  const DBG = !!q.get('dbg');
  // the Silent Walk bot: drive the traveler node-to-node with no UI and
  // watch where walking dies. The heatmap of abandoned walks is our bug
  // tracker — this is that, in one URL param. ?at=a&walkto=b
  let walkRoute = null;
  if (q.get('walkto') && V.layout.nodes[q.get('walkto')]) {
    const from = q.get('at') || 'landing';
    walkRoute = V.layout.route(from, q.get('walkto')).map((id) => V.layout.nodes[id]);
  }
  function driveWalk() {
    if (!walkRoute || !walkRoute.length) return;
    const t = walkRoute[0];
    const d = U.dist(V.player.x, V.player.y, t[0], t[1]);
    if (d < 14) { walkRoute.shift(); return; }
    input.tap = { x: t[0], y: t[1] };
    if (V.textbox.active()) V.textbox.advance();
  }

  V.clock.onNewDay = function () { V.people.newDay(); };

  function startIntro() {
    introT = 0;
    V.player.x = 1065; V.player.y = 5385;
    CAM.jump(1065, 5300);
  }

  function startPlay() {
    mode = 'play';
    if (!V.player.x) { V.player.x = V.layout.spawn[0]; V.player.y = V.layout.spawn[1]; }
    CAM.jump(V.player.x, V.player.y);
  }

  // ---------- loop ----------
  let last = 0, acc = 0;
  const STEP = 1 / 60;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016);
    last = now;

    if (mode === 'resume') { startPlay(); }
    if (mode === 'intro' && introT === 0) startIntro();

    // update
    V.wind.update(dt);
    V.clock.update(dt, V.player.sitting);
    V.textbox.update(dt);

    if (mode === 'intro') {
      introT += dt;
      const t = Math.min(1, introT / 13);
      V.player.x = 1065; V.player.y = U.lerp(5385, 5062, U.ease(t));
      CAM.x = 1065; CAM.y = V.player.y - 60; CAM.zoom = 0.9;
      if (introT > 4 && !ST.flags.introOdd) {
        ST.flags.introOdd = true;
        V.textbox.say('the ferryman', ['Mind the step.', "Noon run's from the bell."]);
      }
      if (t >= 1 && !V.textbox.active()) { startPlay(); V.journal.note('came in on the morning ferry'); }
    } else if (mode === 'play') {
      driveWalk();
      V.player.update(dt, input);
      V.people.update(dt);
      V.camera.update(dt, V.player);
      V.journal.trackPath(dt, V.player.x, V.player.y);
      V.sketchworld.update(dt);
      // the vale learns your presence; the title learns the vale
      if (!ST.flags.nameKnown && V.journal.names.includes('Wennow Vale')) ST.flags.nameKnown = true;
    }
    V.particles.update(dt, CAM);
    V.audio.update(dt);

    // hooks registered by places (schedules with eyes)
    for (const h of V.hooks || []) h(dt);

    // draw
    ctx.setTransform(CAM.dpr, 0, 0, CAM.dpr, 0, 0);
    const g = V.palette.grade(V.clock.hour());
    ctx.fillStyle = g.top;
    ctx.fillRect(0, 0, CAM.SW, CAM.SH);

    if (mode === 'title') { drawTitle(); return; }

    CAM.apply(ctx);
    V.painter.drawStatic(ctx, CAM);
    V.water.draw(ctx, CAM);
    V.painter.drawFlora(ctx, CAM);

    const extra = [];
    for (const p of V.people.list) {
      const v = CAM.view();
      if (p.hiddenNow) continue;
      if (p.x < v.x - 80 || p.x > v.x + v.w + 80 || p.y < v.y - 80 || p.y > v.y + v.h + 80) continue;
      extra.push({ y: p.y, draw: () => V.people.draw(ctx, p) });
    }
    if (mode === 'intro') {
      extra.push({ y: V.player.y + 1, draw: () => drawFerry(ctx, V.player.x, V.player.y + 8) });
    }
    extra.push({ y: V.player.y, draw: () => V.player.draw(ctx) });
    V.objects.drawAll(ctx, CAM, extra);

    V.particles.draw(ctx, CAM);
    V.showpieces.drawRose(ctx);
    V.showpieces.drawMoonbow(ctx);
    V.showpieces.drawLighthouse(ctx, CAM);
    V.lightpass.draw(ctx, CAM);
    V.showpieces.drawUnder(ctx, CAM);
    V.sketchworld.draw(ctx, CAM);

    // the nearest touchable thing shimmers, faintly, in the world itself
    if (mode === 'play' && !V.textbox.active() && !V.journal.open) {
      const p = V.people.nearest(V.player.x, V.player.y, 44);
      const o = p || V.objects.nearest(V.player.x, V.player.y, 46);
      if (o) {
        ctx.globalAlpha = 0.35 + Math.sin(V.wind.time() * 3.4) * 0.2;
        ctx.strokeStyle = '#F6EFD8';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(o.x, o.y + 2, 12, 5, 0, 0, 6.28); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // screen-space
    ctx.setTransform(CAM.dpr, 0, 0, CAM.dpr, 0, 0);
    // a breath of vignette so every frame composes like a picture
    const vg = ctx.createRadialGradient(CAM.SW / 2, CAM.SH / 2, CAM.SH * 0.45, CAM.SW / 2, CAM.SH / 2, CAM.SH * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(10,16,12,0.28)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, CAM.SW, CAM.SH);
    V.showpieces.drawLooker(ctx, canvas, CAM.SW, CAM.SH);
    V.textbox.draw(ctx, CAM.SW, CAM.SH);
    V.journal.draw(ctx, CAM.SW, CAM.SH);
    drawToasts();
    if (DBG) {
      const v2 = CAM.view();
      ctx.fillStyle = '#FF6060';
      ctx.font = '700 16px monospace';
      ctx.fillText('m=' + mode + ' p=' + (V.player.x | 0) + ',' + (V.player.y | 0) + ' c=' + (CAM.x | 0) + ',' + (CAM.y | 0) + ' z=' + CAM.zoom.toFixed(2) + ' vy=' + (v2.y | 0), 14, CAM.SH - 14);
    }
    V.showpieces.drawLooker(ctx, canvas, CAM.SW, CAM.SH);
  }

  function drawFerry(c, x, y) {
    c.fillStyle = '#5A4A34';
    c.beginPath();
    c.moveTo(x - 30, y - 6);
    c.quadraticCurveTo(x, y + 10, x + 30, y - 6);
    c.lineTo(x + 22, y - 14); c.lineTo(x - 22, y - 14);
    c.closePath(); c.fill();
    c.fillStyle = '#6E5A40';
    c.fillRect(x - 22, y - 16, 44, 3);
    // the ferry cat rides the prow like this is all routine
    V.objects.list.length; // (the cat is painted simply here)
    c.fillStyle = '#3A3328';
    c.beginPath(); c.ellipse(x, y - 20, 5, 3, 0, 0, 6.28); c.fill();
  }

  function drawToasts() {
    ctx.font = 'italic 14px "Alegreya", Georgia, serif';
    for (let i = 0; i < ST.toasts.length; i++) {
      const t = ST.toasts[i];
      t.age += 0.016;
      if (t.age > 4) { ST.toasts.splice(i, 1); i--; continue; }
      ctx.globalAlpha = Math.min(1, 4 - t.age) * 0.8;
      ctx.fillStyle = '#EFF3EA';
      ctx.fillText(t.t, 20, 30 + i * 22);
    }
    ctx.globalAlpha = 1;
  }

  function drawTitle() {
    const named = ST.flags.nameKnown;
    ctx.fillStyle = '#10150F';
    ctx.fillRect(0, 0, CAM.SW, CAM.SH);
    // a slow lamp blinking sevens over dark water, before you know anything
    const on = V.showpieces.lampOn();
    if (on) {
      const g2 = ctx.createRadialGradient(CAM.SW * 0.78, CAM.SH * 0.36, 0, CAM.SW * 0.78, CAM.SH * 0.36, 90);
      g2.addColorStop(0, 'rgba(255,233,160,0.8)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(CAM.SW * 0.78, CAM.SH * 0.36, 90, 0, 6.28); ctx.fill();
    }
    ctx.fillStyle = 'rgba(239,243,234,0.9)';
    ctx.font = named ? '900 44px "Vollkorn", serif' : 'italic 26px "Vollkorn", serif';
    ctx.textAlign = 'center';
    ctx.fillText(named ? 'WENNOW VALE' : 'somewhere', CAM.SW / 2, CAM.SH / 2);
    ctx.font = '14px "Alegreya Sans", sans-serif';
    ctx.fillStyle = 'rgba(239,243,234,0.45)';
    ctx.fillText('press any key', CAM.SW / 2, CAM.SH / 2 + 40);
    ctx.textAlign = 'left';
  }

  setInterval(save, 5000);
  addEventListener('beforeunload', save);
  requestAnimationFrame(frame);
})(window.VALE);
