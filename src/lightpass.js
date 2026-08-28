// Beauty is direction: the light pass grades the hour over everything and
// lets the warm points do the guiding. Sources register; night obeys them.
(function (V) {
  const LP = V.lightpass = {};
  LP.sources = []; // {x,y,r,color,when:'night'|'always'|fn}
  LP.add = (s) => LP.sources.push(s);

  function on(s, h, dusk) {
    if (typeof s.when === 'function') return s.when(h);
    if (s.when === 'night') return dusk > 0.25;
    return true;
  }

  LP.draw = function (ctx, cam) {
    const h = V.clock.hour();
    const g = V.palette.grade(h);
    const dusk = V.palette.duskness(h);
    const v = cam.view();

    // canopy shade deepens the wood
    // (cheap: a soft dark wash over the hushes bounds, day only)
    if (dusk < 0.8) {
      ctx.fillStyle = 'rgba(20,35,24,' + (0.16 * (1 - dusk)) + ')';
      ctx.beginPath(); ctx.ellipse(640, 3480, 560, 620, 0, 0, 6.28); ctx.fill();
    }

    // hour tint over the world
    if (g.tintA > 0.01) {
      ctx.fillStyle = g.tint;
      ctx.globalAlpha = g.tintA;
      ctx.fillRect(v.x - 8, v.y - 8, v.w + 16, v.h + 16);
      ctx.globalAlpha = 1;
    }
    // the green evening: ninety seconds, never explained
    if (V.clock.greenNow()) {
      ctx.fillStyle = V.palette.keys.night.green;
      ctx.globalAlpha = 0.24;
      ctx.fillRect(v.x - 8, v.y - 8, v.w + 16, v.h + 16);
      ctx.globalAlpha = 1;
    }
    // rain dims and cools
    if (V.clock.weatherNow() === 'rain') {
      ctx.fillStyle = 'rgba(60,74,84,0.2)';
      ctx.fillRect(v.x - 8, v.y - 8, v.w + 16, v.h + 16);
    }

    // warm sources bloom against the dark
    if (dusk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      for (const s of LP.sources) {
        if (s.x < v.x - 300 || s.x > v.x + v.w + 300 || s.y < v.y - 300 || s.y > v.y + v.h + 300) continue;
        if (!on(s, h, dusk)) continue;
        const flick = s.flicker ? 0.85 + Math.sin(V.wind.time() * 7 + s.x) * 0.15 : 1;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        grad.addColorStop(0, s.color || '#FFD97A');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = (s.a || 0.28) * dusk * flick;
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  };
})(window.VALE);
