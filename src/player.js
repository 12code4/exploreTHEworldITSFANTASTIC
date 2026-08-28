// The traveler: silent, curious, hands for an inventory, a scarf for a
// history. Slopes set the pace, deep water floats you gently back, and
// falling into anything is arriving somewhere.
(function (V) {
  const PL = V.player = {};
  const U = V.util;

  PL.x = 0; PL.y = 0; PL.fx = 0; PL.fy = 1;
  PL.vx = 0; PL.vy = 0;
  PL.carry = null;          // one thing, in your hands
  PL.sitting = false;
  PL.gazing = false; PL.gazeAt = null;
  PL.sliding = false;
  PL.wet = 0;
  PL.looker = false;        // wick's kaleidoscope, once earned
  PL.lookerOn = false;
  let floatBack = null;

  PL.update = function (dt, input) {
    if (V.textbox.active() || V.journal.open) { PL.vx = PL.vy = 0; return; }

    if (floatBack) { // gasping happily back to the shallows
      PL.x = U.lerp(PL.x, floatBack[0], 0.06);
      PL.y = U.lerp(PL.y, floatBack[1], 0.06);
      if (U.dist(PL.x, PL.y, floatBack[0], floatBack[1]) < 6) floatBack = null;
      return;
    }

    let ix = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    let iy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    if (input.tap) {
      const dx = input.tap.x - PL.x, dy = input.tap.y - PL.y;
      const d = Math.hypot(dx, dy);
      if (d > 14) { ix = dx / d; iy = dy / d; } else input.tap = null;
    }
    const moving = ix || iy;
    if (moving) {
      PL.sitting = false;
      const len = Math.hypot(ix, iy);
      ix /= len; iy /= len;
      PL.fx = ix; PL.fy = iy;
    }

    // slide faces: enter one moving downhill and the hill takes over
    PL.sliding = false;
    for (const s of V.layout.slides) {
      if (PL.x > s.x1 && PL.x < s.x2 && PL.y > s.y1 && PL.y < s.y2) {
        PL.sliding = true;
        PL.vx = U.lerp(PL.vx, s.dir[0] * 300, 0.06);
        PL.vy = U.lerp(PL.vy, s.dir[1] * 300, 0.06);
      }
    }

    if (!PL.sliding) {
      const sl = V.terrain.slope(PL.x, PL.y);
      const uphill = (sl.dx * ix + sl.dy * iy); // elevation grows against dy sign; slope dot motion
      let speed = 150 - U.clamp(uphill, -0.6, 0.6) * -70; // uphill slows to amble, downhill trots
      speed = U.clamp(speed, 96, 208);
      const wat = V.terrain.water(PL.x, PL.y);
      if (wat === 1) { speed *= 0.55; PL.wet = 1; }
      PL.vx = moving ? ix * speed : PL.vx * Math.pow(0.0001, dt);
      PL.vy = moving ? iy * speed : PL.vy * Math.pow(0.0001, dt);
    }

    let nx = PL.x + PL.vx * dt, ny = PL.y + PL.vy * dt;

    // deep water: a moment of cold, then the vale hands you back
    if (V.terrain.water(nx, ny) === 2) {
      let bx = PL.x, by = PL.y;
      for (let r = 10; r < 90; r += 10) {
        for (let a = 0; a < 6.28; a += 0.5) {
          const tx = nx + Math.cos(a) * r, ty = ny + Math.sin(a) * r;
          if (!V.terrain.water(tx, ty) && !V.terrain.blocked(tx, ty)) { bx = tx; by = ty; r = 99; break; }
        }
      }
      floatBack = [bx, by];
      PL.wet = 1;
      V.state.toast('the water hands you back');
      return;
    }
    if (!V.terrain.blocked(nx, PL.y) && !V.terrain.hitSolid(nx, PL.y)) PL.x = nx; else PL.vx = 0;
    if (!V.terrain.blocked(PL.x, ny) && !V.terrain.hitSolid(PL.x, ny)) PL.y = ny; else PL.vy = 0;

    PL.wet = Math.max(0, PL.wet - dt * 0.1);
    if (input.tap && U.dist(PL.x, PL.y, input.tap.x, input.tap.y) < 16) input.tap = null;

    // the Under: fall into the fold, come out at the locks
    const un = V.layout.under;
    if (U.dist(PL.x, PL.y, un.enter.x, un.enter.y) < un.enter.r) {
      PL.x = un.inStart[0]; PL.y = un.inStart[1];
      V.state.toast('falling into a cave is discovering a cave');
      V.journal.note('the fold on the moor goes somewhere');
    }
    if (PL.x > un.x2 - 40 && PL.y > un.y1 && PL.y < un.y2) {
      PL.x = un.exitAt[0]; PL.y = un.exitAt[1];
      V.journal.note('the long dark comes out at the Locks, blinking');
    }
  };

  PL.interact = function () {
    if (V.journal.open) return;
    if (V.textbox.active()) { V.textbox.advance(); return; }
    const p = V.people.nearest(PL.x, PL.y, 44);
    if (p) { V.people.talk(p, PL); return; }
    const o = V.objects.nearest(PL.x, PL.y, 46);
    if (o) {
      if (o.use) { o.use(PL); return; }
      if (o.lift && !PL.carry) {
        PL.carry = o.lift;
        if (o.liftOnce) o.hidden = true;
        V.state.toast('carrying: ' + o.lift);
        if (o.liftNote) V.journal.note(o.liftNote);
        return;
      }
      if (o.talkLines) { V.textbox.say(o.talkName || '', o.talkLines); return; }
      if (o.gaze) {
        PL.gazing = true; PL.gazeAt = o;
        V.textbox.say(o.gazeName || '', Array.isArray(o.gaze) ? o.gaze : o.gaze.text, () => {
          PL.gazing = false; PL.gazeAt = null;
          if (o.journal) V.journal.note(o.journal);
          if (o.learnName) V.journal.learnName(o.learnName);
          if (o.onGaze) o.onGaze(PL);
        });
        return;
      }
    }
    // nothing near: set the carried thing down, or just sit a moment
    if (PL.carry) { V.state.toast('set down: ' + PL.carry); PL.carry = null; return; }
    const b = V.objects.list.find((ob) => ob.kind === 'bench' && U.dist(ob.x, ob.y, PL.x, PL.y) < 30);
    if (b) { PL.sitting = true; if (b.onSit) b.onSit(PL); }
  };

  PL.draw = function (ctx) {
    const t = V.wind.time();
    const walking = Math.hypot(PL.vx, PL.vy) > 12;
    const bob = walking ? Math.sin(t * 12) * 1.6 : Math.sin(t * 1.6) * 0.5;
    const x = PL.x, y = PL.y - (PL.sitting ? -2 : 0);
    ctx.fillStyle = 'rgba(30,40,30,0.25)';
    ctx.beginPath(); ctx.ellipse(x, PL.y + 2, 8, 3, 0, 0, 6.28); ctx.fill();
    // coat
    ctx.fillStyle = '#4E5A64';
    ctx.beginPath();
    ctx.moveTo(x - 5.4, y);
    ctx.quadraticCurveTo(x - 6.4, y - 13 - bob * 0.4, x, y - 15 - bob * 0.5);
    ctx.quadraticCurveTo(x + 6.4, y - 13 - bob * 0.4, x + 5.4, y);
    ctx.closePath(); ctx.fill();
    // the scarf: your color history, worn
    const stripes = V.journal.scarf.length ? V.journal.scarf : ['#F6EFE2'];
    for (let i = 0; i < Math.min(stripes.length, 5); i++) {
      ctx.fillStyle = stripes[stripes.length - 1 - i];
      ctx.fillRect(x - 4.6, y - 13.6 + i * 1.7 - bob * 0.4, 9.2, 1.7);
    }
    // a scarf end rides the one wind
    const w = V.wind.at(x, y);
    ctx.strokeStyle = stripes[stripes.length - 1];
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x + 3, y - 12 - bob * 0.4);
    ctx.quadraticCurveTo(x + 3 + w.x * 7 * w.mag, y - 10 + w.y * 4 * w.mag, x + 4 + w.x * 12 * w.mag, y - 7 + w.y * 7 * w.mag);
    ctx.stroke();
    // head
    ctx.fillStyle = '#E8C9A8';
    ctx.beginPath(); ctx.arc(x, y - 18 - bob * 0.5, 4.6, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#5A4632';
    ctx.beginPath(); ctx.arc(x, y - 19.4 - bob * 0.5, 4, 3.3, 6.2); ctx.fill();
    // carried thing, held up in both hands
    if (PL.carry) {
      ctx.save(); ctx.translate(x + PL.fx * 7, y - 10 + PL.fy * 3);
      const drawProp = { pear: 'pear', loaf: 'basket', marble: 'marbles', letter: 'crate', bread: 'basket' }[PL.carry];
      ctx.translate(0, -4);
      if (PL.carry === 'pear') { ctx.fillStyle = '#C9C25E'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.28); ctx.arc(0, -2.8, 2, 0, 6.28); ctx.fill(); }
      else if (PL.carry === 'marble') { ctx.fillStyle = '#9AD8E8'; ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, 6.28); ctx.fill(); }
      else if (PL.carry === 'letter') { ctx.fillStyle = '#F6F2E6'; ctx.fillRect(-4, -3, 8, 6); }
      else { ctx.fillStyle = '#C9A05A'; ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, 6.28); ctx.fill(); }
      ctx.restore();
    }
  };

  PL.save = () => ({ x: PL.x, y: PL.y, carry: PL.carry, looker: PL.looker });
  PL.load = (s) => { if (s) { PL.x = s.x; PL.y = s.y; PL.carry = s.carry; PL.looker = !!s.looker; } };
})(window.VALE);
