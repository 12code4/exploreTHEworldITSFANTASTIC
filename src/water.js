// Living water: the river drawn as a ribbon over its baked bed, the sea as
// slow swell. Both sample the one wind for chop.
(function (V) {
  const W = V.water = {};
  const U = V.util;

  W.draw = function (ctx, cam) {
    const t = V.wind.time();
    const v = cam.view();
    const l = V.layout;
    const h = V.clock.hour();
    const g = V.palette.grade(h);
    const dusk = V.palette.duskness(h);

    // --- the river ---
    const riverCol = U.mix(U.mix('#7C94A0', '#8FA6B0', 0.3), '#1A2A32', dusk * 0.8);
    const glint = U.mix('#EFF3EA', g.horizon, 0.5);
    ctx.lineCap = 'round';
    const n = 130;
    for (let i = 0; i < n; i++) {
      const p = U.spline(l.river, i / n);
      const q = U.spline(l.river, (i + 1) / n);
      const midY = (p[1] + q[1]) / 2;
      if (midY < v.y - 80 || midY > v.y + v.h + 80) continue;
      const wdt = l.riverWidth(i / n);
      ctx.strokeStyle = riverCol;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = wdt;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      // moving glints
      const gph = Math.sin(t * 2 + i * 0.9);
      if (gph > 0.55) {
        ctx.globalAlpha = (gph - 0.55) * 0.9 * (1 - dusk * 0.5);
        ctx.strokeStyle = glint;
        ctx.lineWidth = 1.6;
        const off = Math.sin(i * 3.1) * wdt * 0.28;
        ctx.beginPath();
        ctx.moveTo(p[0] + off, p[1]);
        ctx.lineTo(q[0] + off, q[1]);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // stepping stones at the ford
    const stones = [[1288, 4300], [1310, 4296], [1332, 4300], [1354, 4295], [1376, 4300]];
    for (let i = 0; i < stones.length; i++) {
      const s = stones[i];
      if (s[1] < v.y - 40 || s[1] > v.y + v.h + 40) continue;
      ctx.fillStyle = '#8A8A7A';
      ctx.beginPath(); ctx.ellipse(s[0], s[1], 9, 6, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#A8A896';
      ctx.beginPath(); ctx.ellipse(s[0] - 1, s[1] - 2, 7, 4, 0, 0, 6.28); ctx.fill();
      if (i === 2) { // M + T, carved small and old
        ctx.fillStyle = 'rgba(60,60,50,0.5)';
        ctx.fillRect(s[0] - 3, s[1] - 2, 1.5, 1.5); ctx.fillRect(s[0] + 1, s[1] - 2, 1.5, 1.5);
      }
    }

    // --- the sea ---
    if (v.y + v.h > l.seaY - 60) {
      const seaTop = U.mix('#5C7C8E', '#101C24', dusk * 0.85);
      const seaDeep = U.mix('#39566A', '#0A141A', dusk * 0.85);
      const grad = ctx.createLinearGradient(0, l.seaY, 0, l.seaY + 460);
      grad.addColorStop(0, seaTop); grad.addColorStop(1, seaDeep);
      ctx.fillStyle = grad;
      ctx.fillRect(v.x - 10, l.seaY, v.w + 20, v.y + v.h - l.seaY + 20);
      // swell lines rolling in
      ctx.strokeStyle = 'rgba(230,238,228,0.35)';
      for (let r = 0; r < 7; r++) {
        const wy = l.seaY + 24 + r * 52 + Math.sin(t * 0.7 + r * 1.7) * 8;
        if (wy > v.y + v.h + 20) break;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let x = v.x - 20; x < v.x + v.w + 20; x += 26) {
          const yy = wy + Math.sin(x * 0.02 + t * 1.1 + r) * 4;
          x === v.x - 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      // foam at the strand
      ctx.strokeStyle = 'rgba(246,244,236,0.7)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let x = v.x - 20; x < v.x + v.w + 20; x += 18) {
        const yy = l.seaY + Math.sin(x * 0.03 + t * 1.6) * 4 + Math.sin(x * 0.011 - t) * 3;
        x === v.x - 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  };
})(window.VALE);
