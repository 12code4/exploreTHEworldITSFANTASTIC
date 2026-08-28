// Half the life budget: petals riding the evening wind upstream, smoke,
// fireflies, mist, rain, bees, butterflies, gulls, lanterns on full moons.
// Emitters are data; places register them; the clock decides who flies.
(function (V) {
  const PS = V.particles = {};
  const U = V.util;
  const pool = [];
  PS.emitters = []; // {x,y,kind,rate,r, colors?}
  PS.add = (e) => PS.emitters.push(e);

  function spawn(p) { if (pool.length < 900) pool.push(p); }

  function emitterOn(e) {
    const h = V.clock.hour(), ph = V.clock.phase(), wx = V.clock.weatherNow();
    switch (e.kind) {
      case 'smoke': return e.when === 'dawn' ? (h > 4.6 && h < 9) : true;
      case 'fireflies': return ph === 'night' || h > 20.2;
      case 'bees': return h > 8 && h < 18 && wx !== 'rain';
      case 'butterflies': return h > 9 && h < 18 && wx !== 'rain';
      case 'petals': return true;
      case 'glowworms': return true;
      case 'motes': return h > 9 && h < 16;
      case 'steam': return true;
      default: return true;
    }
  }

  PS.update = function (dt, cam) {
    const v = cam.view();
    const h = V.clock.hour();
    const daily = V.clock.daily();
    const weather = V.clock.weatherNow();

    // place emitters
    for (const e of PS.emitters) {
      if (e.x < v.x - 300 || e.x > v.x + v.w + 300 || e.y < v.y - 300 || e.y > v.y + v.h + 300) continue;
      if (!emitterOn(e)) continue;
      if (Math.random() < (e.rate || 0.5) * dt) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * (e.r || 20);
        const px = e.x + Math.cos(a) * r, py = e.y + Math.sin(a) * r;
        if (e.kind === 'smoke') spawn({ k: 'smoke', x: px, y: py, vx: 0, vy: -14, life: 5 + Math.random() * 3, age: 0, s: 2 + Math.random() * 2 });
        if (e.kind === 'fireflies') spawn({ k: 'fly', x: px, y: py, ph: Math.random() * 6.28, life: 9, age: 0, cx: px, cy: py });
        if (e.kind === 'glowworms') spawn({ k: 'worm', x: px, y: py, life: 7, age: 0, ph: Math.random() * 6.28 });
        if (e.kind === 'bees') spawn({ k: 'bee', x: px, y: py, cx: e.x, cy: e.y, r: e.r, ph: Math.random() * 6.28, life: 7, age: 0 });
        if (e.kind === 'butterflies') spawn({ k: 'butter', x: px, y: py, cx: e.x, cy: e.y, r: e.r, ph: Math.random() * 6.28, life: 8, age: 0, col: (e.colors || ['#F2D848'])[Math.floor(Math.random() * (e.colors || [1]).length)] });
        if (e.kind === 'petals') spawn({ k: 'petal', x: px, y: py, vx: 0, vy: 0, life: 7 + Math.random() * 4, age: 0, ph: Math.random() * 6.28 });
        if (e.kind === 'motes') spawn({ k: 'mote', x: px, y: py, life: 5, age: 0, ph: Math.random() * 6.28 });
        if (e.kind === 'steam') spawn({ k: 'smoke', x: px, y: py, vx: 0, vy: -8, life: 3, age: 0, s: 1.5 });
      }
    }

    // ambient systems in view
    if (weather === 'rain' && Math.random() < 60 * dt) {
      spawn({ k: 'rain', x: v.x + Math.random() * v.w, y: v.y - 20, life: 1.4, age: 0 });
    }
    if (weather === 'mist' && Math.random() < 1.2 * dt) {
      spawn({ k: 'mist', x: v.x - 200, y: v.y + Math.random() * v.h, life: 22, age: 0, s: 120 + Math.random() * 180 });
    }
    // gulls near the sea by day
    if (h > 6 && h < 20 && v.y + v.h > 4500 && Math.random() < 0.25 * dt) {
      spawn({ k: 'gull', x: v.x + Math.random() * v.w, y: v.y + Math.random() * v.h * 0.5, vx: 20 + Math.random() * 22, life: 20, age: 0, ph: Math.random() * 6.28 });
    }
    // lanterns down the river on full-moon nights
    if (daily.fullMoon && (h > 20.4 || h < 1) && Math.random() < 0.5 * dt) {
      const p = U.spline(V.layout.river, 0.62 + Math.random() * 0.05);
      spawn({ k: 'lantern', x: p[0], y: p[1], t: 0.62, life: 60, age: 0, col: ['#FFD97A', '#F4B8C8', '#B8E8B0'][Math.floor(Math.random() * 3)] });
    }
    // eel run: the river boils silver at certain dusks
    if (daily.eelRun && h > daily.eelStart && h < daily.eelStart + 0.12 && Math.random() < 24 * dt) {
      const p = U.spline(V.layout.river, 0.32 + Math.random() * 0.1);
      spawn({ k: 'eel', x: p[0] + (Math.random() - 0.5) * 20, y: p[1], life: 0.8, age: 0 });
    }

    // integrate
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.age += dt;
      if (p.age > p.life) { pool.splice(i, 1); continue; }
      const w = V.wind.at(p.x, p.y);
      switch (p.k) {
        case 'petal':
          p.vx = U.lerp(p.vx, w.x * 26 * w.mag + Math.sin(p.age * 3 + p.ph) * 8, 0.1);
          p.vy = U.lerp(p.vy, w.y * 30 * w.mag + 6 + Math.sin(p.age * 2.2 + p.ph) * 5, 0.1);
          p.x += p.vx * dt; p.y += p.vy * dt; break;
        case 'smoke':
          p.x += (w.x * 10 * w.mag) * dt; p.y += p.vy * dt; p.s += dt * 2.4; break;
        case 'fly':
          p.x = p.cx + Math.cos(p.age * 0.7 + p.ph) * 24; p.y = p.cy + Math.sin(p.age * 0.9 + p.ph) * 16; break;
        case 'worm': break;
        case 'bee':
          p.x += Math.cos(p.age * 5 + p.ph) * 60 * dt; p.y += Math.sin(p.age * 6.3 + p.ph) * 44 * dt;
          if (U.dist(p.x, p.y, p.cx, p.cy) > p.r) { p.x = U.lerp(p.x, p.cx, 0.06); p.y = U.lerp(p.y, p.cy, 0.06); }
          break;
        case 'butter':
          p.x += Math.cos(p.age * 2.1 + p.ph) * 34 * dt; p.y += Math.sin(p.age * 3.3 + p.ph) * 26 * dt - 6 * dt;
          if (U.dist(p.x, p.y, p.cx, p.cy) > p.r * 1.3) { p.x = U.lerp(p.x, p.cx, 0.05); p.y = U.lerp(p.y, p.cy, 0.05); }
          break;
        case 'rain': p.y += 520 * dt; p.x += w.x * 40 * dt; break;
        case 'mist': p.x += 26 * dt * (0.5 + w.mag * 0.5); break;
        case 'gull': p.x += p.vx * dt; p.y += Math.sin(p.age * 2 + p.ph) * 10 * dt; break;
        case 'lantern': p.t += dt * 0.004; { const q = U.spline(V.layout.river, Math.min(0.99, p.t)); p.x = U.lerp(p.x, q[0] + Math.sin(p.age + p.x) * 6, 0.05); p.y = q[1]; } break;
        case 'eel': break;
        case 'mote': p.x += Math.sin(p.age * 1.2 + p.ph) * 6 * dt; p.y -= 3 * dt; break;
      }
    }
  };

  PS.draw = function (ctx, cam) {
    const dusk = V.palette.duskness(V.clock.hour());
    for (const p of pool) {
      const t = p.age / p.life;
      switch (p.k) {
        case 'petal': {
          ctx.globalAlpha = (1 - t) * 0.9;
          ctx.fillStyle = V.palette.keys.blossom.petal;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, 2.4, 1.4, p.age * 2 + p.ph, 0, 6.28);
          ctx.fill(); break;
        }
        case 'smoke':
          ctx.globalAlpha = (1 - t) * 0.16;
          ctx.fillStyle = dusk > 0.5 ? '#B9BFB4' : '#6E7568';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); break;
        case 'fly': case 'worm': {
          const bl = Math.max(0, Math.sin(p.age * (p.k === 'fly' ? 1.6 : 0.7) + p.ph));
          ctx.globalAlpha = bl * 0.9;
          ctx.fillStyle = V.palette.keys.night.firefly;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 6.28); ctx.fill();
          ctx.globalAlpha = bl * 0.25;
          ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 6.28); ctx.fill();
          break;
        }
        case 'bee':
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = '#3A3328';
          ctx.beginPath(); ctx.ellipse(p.x, p.y, 2, 1.4, 0, 0, 6.28); ctx.fill();
          ctx.fillStyle = '#F2D848';
          ctx.fillRect(p.x - 0.8, p.y - 1.2, 1.4, 2.2); break;
        case 'butter': {
          const fl = Math.sin(p.age * 14);
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = p.col;
          ctx.beginPath();
          ctx.ellipse(p.x - 1.6 * Math.abs(fl), p.y, 2.2 * Math.abs(fl) + 0.5, 1.8, 0.4, 0, 6.28);
          ctx.ellipse(p.x + 1.6 * Math.abs(fl), p.y, 2.2 * Math.abs(fl) + 0.5, 1.8, -0.4, 0, 6.28);
          ctx.fill(); break;
        }
        case 'rain':
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = '#AFC4CC';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 1.4, p.y + 9); ctx.stroke(); break;
        case 'mist':
          ctx.globalAlpha = Math.sin(Math.min(1, t * 3) * 3.14) * 0.14;
          ctx.fillStyle = '#DCE7DC';
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.s, p.s * 0.32, 0, 0, 6.28); ctx.fill(); break;
        case 'gull': {
          const f = Math.sin(p.age * 6 + p.ph);
          ctx.globalAlpha = 0.85;
          ctx.strokeStyle = dusk > 0.5 ? '#5A6462' : '#F6F4EC';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(p.x - 5, p.y - f * 3);
          ctx.quadraticCurveTo(p.x, p.y + 2, p.x, p.y);
          ctx.quadraticCurveTo(p.x, p.y + 2, p.x + 5, p.y - f * 3);
          ctx.stroke(); break;
        }
        case 'lantern':
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = p.col;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, 6.28); ctx.fill();
          ctx.globalAlpha = 0.22;
          ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, 6.28); ctx.fill(); break;
        case 'eel':
          ctx.globalAlpha = (1 - t) * 0.9;
          ctx.strokeStyle = '#D8E4E8';
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x + 4, p.y - 4, p.x + 8, p.y); ctx.stroke(); break;
        case 'mote':
          ctx.globalAlpha = Math.sin(Math.min(1, t * 2) * 3.14) * 0.7;
          ctx.fillStyle = V.palette.keys.blossom.butter;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, 6.28); ctx.fill(); break;
      }
    }
    ctx.globalAlpha = 1;
  };
})(window.VALE);
