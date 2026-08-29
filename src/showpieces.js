// The postcards, rendered: sevens from the lighthouse, the Rose spilling
// color out the chapel door at clear noon, the Glimmer, the moonbow, and
// the Looker — a toy that re-renders the entire world.
(function (V) {
  const S = V.showpieces = {};
  const U = V.util;

  // --- the lighthouse blinks in sevens; nobody will ever say why ---
  const UNIT = 0.56, ON = 0.3, COUNT = 7, REST = 2.7;
  const PERIOD = COUNT * UNIT + REST;
  S.lampOn = function () {
    const m = V.wind.time() % PERIOD;
    return m < COUNT * UNIT && (m % UNIT) < ON;
  };

  S.drawLighthouse = function (ctx, cam) {
    const lh = V.objects.byId('lighthouse');
    if (!lh || !lh._lamp) return;
    const [x, y] = lh._lamp;
    const v = cam.view();
    if (x < v.x - 400 || x > v.x + v.w + 400 || y < v.y - 400 || y > v.y + v.h + 400) return;
    if (!S.lampOn()) return;
    const dusk = V.palette.duskness(V.clock.hour());
    const a = 0.35 + dusk * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 46);
    g.addColorStop(0, '#FFE9A0'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 46, 0, 6.28); ctx.fill();
    // the beam sweeps seaward
    ctx.globalAlpha = a * 0.3;
    ctx.fillStyle = '#FFE9A0';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 60, y + 220);
    ctx.lineTo(x + 130, y + 240);
    ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  // --- the Rose: at clear noon the chapel leaks color onto its step ---
  S.roseOn = function () {
    const h = V.clock.hour();
    return h > 11.7 && h < 12.7 && V.clock.weatherNow() === 'clear';
  };
  S.drawRose = function (ctx) {
    if (!S.roseOn()) return;
    const c = V.layout.nodes.chapel;
    const x = c[0], y = c[1] + 26;
    const cols = V.palette.keys.prismDay;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < cols.length; i++) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = cols[i];
      ctx.beginPath();
      ctx.ellipse(x - 12 + i * 4, y + 6, 6, 14, 0.3, 0, 6.28);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // standing in it gets you sketched in color, once a day
    if (U.dist(V.player.x, V.player.y, x, y + 6) < 20 && !V.state.flags['rose_' + V.clock.day]) {
      V.state.flags['rose_' + V.clock.day] = true;
      V.journal.note('stood in the Rose at noon; came out in colors');
    }
  };

  // --- the Under, and the Glimmer at clear noon ---
  S.drawUnder = function (ctx, cam) {
    const un = V.layout.under;
    const p = V.player;
    if (p.x < un.x1 - 100) return;
    // the dark, kindly
    const v = cam.view();
    ctx.fillStyle = 'rgba(6,10,10,0.86)';
    ctx.fillRect(v.x - 8, v.y - 8, v.w + 16, v.h + 16);
    // your small lamp of attention
    ctx.globalCompositeOperation = 'lighter';
    let g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 120);
    g.addColorStop(0, 'rgba(120,140,120,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, 120, 0, 6.28); ctx.fill();
    // the black stream
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#0E1A1E';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(un.x1, (un.y1 + un.y2) / 2 + 30);
    ctx.quadraticCurveTo((un.x1 + un.x2) / 2, (un.y1 + un.y2) / 2 - 20, un.x2, (un.y1 + un.y2) / 2 + 10);
    ctx.stroke();
    // the Glimmer: one noon shaft, split light walking every wall
    const h = V.clock.hour();
    const mid = [(un.x1 + un.x2) / 2 + 60, (un.y1 + un.y2) / 2];
    if (h > 11.7 && h < 12.6 && V.clock.weatherNow() === 'clear') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#FFF6D8';
      ctx.beginPath();
      ctx.moveTo(mid[0] - 14, un.y1 - 40);
      ctx.lineTo(mid[0] + 20, un.y1 - 40);
      ctx.lineTo(mid[0] + 44, mid[1] + 40);
      ctx.lineTo(mid[0] - 30, mid[1] + 40);
      ctx.closePath(); ctx.fill();
      const cols = V.palette.keys.prismDeep;
      for (let i = 0; i < cols.length; i++) {
        const a = (i / cols.length) * 6.28 + V.wind.time() * 0.2;
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = cols[i];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(mid[0], mid[1]);
        ctx.lineTo(mid[0] + Math.cos(a) * 150, mid[1] + Math.sin(a) * 90);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (U.dist(p.x, p.y, mid[0], mid[1]) < 130) V.journal.note('the Glimmer, at noon, after the long dark');
    } else {
      // glowworm constellations hold the dark together
      for (let i = 0; i < 40; i++) {
        const gx = un.x1 + U.hash2(i, 1, 9) * (un.x2 - un.x1);
        const gy = un.y1 + U.hash2(i, 2, 9) * (un.y2 - un.y1);
        const bl = Math.max(0, Math.sin(V.wind.time() * 0.5 + i));
        ctx.globalAlpha = bl * 0.8;
        ctx.fillStyle = V.palette.keys.night.firefly;
        ctx.fillRect(gx, gy, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
    }
  };

  // --- moonbow: mist + full moon at the falls; her way-mark says yes ---
  S.drawMoonbow = function (ctx) {
    const d = V.clock.daily(), h = V.clock.hour();
    if (!d.fullMoon || !(h > 21 || h < 4) || V.clock.weatherNow() !== 'mist') return;
    const f = V.layout.nodes.falls;
    const cols = V.palette.keys.prismDay;
    for (let i = 0; i < cols.length; i++) {
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = cols[i];
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(f[0], f[1] + 30, 60 + i * 5, 3.34, 6.08);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  // --- the Looker: any view becomes a church window ---
  S.drawLooker = function (ctx, canvas, SW, SH) {
    if (!V.player.lookerOn) return;
    const off = S._off || (S._off = document.createElement('canvas'));
    if (off.width !== canvas.width || off.height !== canvas.height) { off.width = canvas.width; off.height = canvas.height; }
    off.getContext('2d').drawImage(canvas, 0, 0);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const rot = V.wind.time() * 0.1;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0A0E0A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot + i * Math.PI / 3);
      if (i % 2) ctx.scale(-1, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(cx, cy), -Math.PI / 6, Math.PI / 6);
      ctx.closePath();
      ctx.clip();
      ctx.rotate(-rot * 2);
      ctx.drawImage(off, -cx, -cy);
      ctx.restore();
    }
    ctx.restore();
  };
})(window.VALE);
