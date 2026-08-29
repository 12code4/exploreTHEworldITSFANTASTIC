// The ground is painted, not tiled: coarse color cells for tone, thousands
// of seeded dabs for texture, and a dynamic pass of wind-swayed blades and
// flower heads near the camera. Chunks bake once and cache.
(function (V) {
  const P = V.painter = {};
  const U = V.util;
  const CH = 512;
  const cache = new Map();
  let order = [];

  // flora fields: place files register drifts of growing things
  // {x, y, r, type: 'flowers'|'heather'|'reeds'|'petalfall', colors, density}
  P.fields = [];
  P.addField = (f) => P.fields.push(f);

  function groundColor(x, y) {
    const K = V.palette.keys.moss;
    const reg = V.layout.regionAt(x, y);
    const e = V.terrain.elevation(x, y);
    const m = V.terrain.moisture(x, y);
    const n = U.fbm(x * 0.008, y * 0.008, 21, 3);

    if (y > V.layout.seaY - 4) return null; // the sea paints itself
    let c = U.mix(K.landLo, K.landHi, U.clamp(0.25 + n * 0.9, 0, 1));
    c = U.mix(c, K.land, 0.4);
    c = U.mix(c, '#6E8A5A', U.clamp(m - 0.4, 0, 0.5));           // lush by water
    c = U.mix(c, '#84876A', U.clamp((e - 102) / 110, 0, 0.28));  // pale high ground, gently
    // the moor and the wood arrive gradually, the way country does
    const moorD = U.dist(x, y, 560, 2650);
    const moorF = U.clamp(1 - (moorD - 380) / 320, 0, 1);
    if (moorF > 0.02) c = U.mix(c, V.palette.keys.heather, moorF * (0.3 + n * 0.25));
    const woodD = U.dist(x, y, 640, 3550);
    const woodF = U.clamp(1 - (woodD - 380) / 280, 0, 1);
    if (woodF > 0.02) c = U.mix(c, '#3E5540', woodF * 0.38);
    if (reg === 'steps' || reg === 'head') c = U.mix(c, '#7A7668', U.clamp((e - 100) / 80, 0, 0.55));
    if (reg === 'dyeyards') c = U.mix(c, '#8A7248', 0.22);        // worked terraced earth
    if (reg === 'saltmouth' && y > 4870) c = U.mix(c, K.sand, U.clamp((y - 4870) / 280, 0, 0.8));

    // river banks go sandy
    const w = V.terrain.water(x, y);
    if (w === 1) c = U.mix(c, K.sand, 0.75);
    if (w === 2) c = U.mix('#3E5560', '#2E4450', n);              // the bed, seen through water

    // the gorge shows its bones: rock walls shouldering the river, following
    // its curve, feathered at both edges (analytic — no slope sampling)
    if (y > 1450 && y < 2430) {
      const d = V.terrain.riverDist(x, y);
      const inner = U.clamp((d - 85) / 45, 0, 1);
      const outer = U.clamp((280 - d) / 90, 0, 1);
      const band = U.clamp((y - 1450) / 120, 0, 1) * U.clamp((2430 - y) / 120, 0, 1);
      const rock = inner * outer * band;
      if (rock > 0.02) c = U.mix(c, U.mix('#8A8272', '#6E6A5E', n), rock * 0.75);
    }

    // worn ways: narrow, broken by growth, honest about feet not paving
    const pd = V.terrain.nearPath(x, y);
    if (pd < 15 && w === 0) {
      const wear = U.clamp((15 - pd) / 15, 0, 1) * (0.28 + n * 0.34);
      c = U.mix(c, K.path, U.clamp(wear, 0, 0.62));
    }

    // field bases (flower drifts tint the ground beneath them)
    for (const f of P.fields) {
      const d = U.dist(x, y, f.x, f.y);
      if (d < f.r) {
        const t = (1 - d / f.r) * (f.density || 0.5);
        if (f.type === 'heather') c = U.mix(c, V.palette.keys.heather, t * 0.5);
        else if (f.type === 'flowers') {
          c = U.mix(c, '#5E7A4E', t * 0.4);
          if (f.colors && f.colors.length) c = U.mix(c, f.colors[0], t * 0.22); // the basin blushes
        }
        else if (f.type === 'petalfall') c = U.mix(c, V.palette.keys.blossom.petal, t * 0.35);
        else if (f.type === 'reeds') c = U.mix(c, '#6E7A46', t * 0.5);
      }
    }
    return c;
  }

  function bake(cx, cy) {
    const c = document.createElement('canvas');
    c.width = CH; c.height = CH;
    const g = c.getContext('2d');
    const x0 = cx * CH, y0 = cy * CH;

    // sea base for chunks that dip below the water line
    g.fillStyle = '#39566A';
    g.fillRect(0, 0, CH, CH);

    const cell = 8;
    for (let yy = 0; yy < CH; yy += cell) {
      for (let xx = 0; xx < CH; xx += cell) {
        const wx = x0 + xx + cell / 2, wy = y0 + yy + cell / 2;
        if (wy > V.layout.seaY) continue;
        const col = groundColor(wx, wy);
        if (col) { g.fillStyle = col; g.fillRect(xx, yy, cell, cell); }
      }
    }

    // texture dabs: grass ticks, stones, sparkle of lighter growth
    const rng = U.mulberry(cx * 733 + cy * 911 + 5);
    g.lineCap = 'round';
    for (let i = 0; i < 850; i++) {
      const xx = rng() * CH, yy = rng() * CH;
      const wx = x0 + xx, wy = y0 + yy;
      if (wy > V.layout.seaY - 6 || V.terrain.water(wx, wy)) continue;
      const base = groundColor(wx, wy);
      if (!base) continue;
      const tone = rng();
      g.strokeStyle = U.shade(base, tone < 0.5 ? 0.14 + rng() * 0.1 : -(0.1 + rng() * 0.12));
      g.lineWidth = 1 + rng();
      const len = 2.5 + rng() * 4;
      const lean = (rng() - 0.5) * 2;
      g.beginPath();
      g.moveTo(xx, yy);
      g.quadraticCurveTo(xx + lean, yy - len * 0.6, xx + lean * 1.6, yy - len);
      g.stroke();
      if (rng() < 0.05) { // small stone
        g.fillStyle = U.shade(base, 0.22);
        g.beginPath(); g.ellipse(xx, yy, 1.6 + rng() * 1.6, 1.1 + rng(), 0, 0, 6.28); g.fill();
        g.fillStyle = U.shade(base, -0.18);
        g.beginPath(); g.ellipse(xx + 0.8, yy + 0.9, 1.4 + rng(), 0.8, 0, 0, 3.14); g.fill();
      }
    }

    // shoreline foam-stain along the sea edge
    if (y0 + CH > V.layout.seaY - 30) {
      g.strokeStyle = 'rgba(240,244,236,0.5)';
      g.lineWidth = 2;
      for (let i = 0; i < 40; i++) {
        const xx = rng() * CH;
        const wy = V.layout.seaY - y0 + (rng() - 0.5) * 10;
        if (wy < 0 || wy > CH) continue;
        g.beginPath();
        g.moveTo(xx, wy);
        g.quadraticCurveTo(xx + 10, wy - 2, xx + 22 + rng() * 20, wy);
        g.stroke();
      }
    }
    return c;
  }

  let bakeBudget = 0;
  P.chunk = function (cx, cy) {
    const k = cx + ',' + cy;
    if (!cache.has(k)) {
      if (bakeBudget <= 0) return null; // pop in next frame; no hitching
      bakeBudget--;
      cache.set(k, bake(cx, cy));
      order.push(k);
      if (order.length > 48) { cache.delete(order.shift()); }
    } else {
      order = order.filter((o) => o !== k); order.push(k);
    }
    return cache.get(k);
  };

  P.invalidate = () => { cache.clear(); order = []; };

  P.drawStatic = function (ctx, cam) {
    bakeBudget = 3;
    const v = cam.view();
    const cx0 = Math.floor(v.x / CH), cy0 = Math.floor(v.y / CH);
    const cx1 = Math.floor((v.x + v.w) / CH), cy1 = Math.floor((v.y + v.h) / CH);
    for (let cy = cy0; cy <= cy1; cy++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        if (cx < 0 || cy < 0 || cx * CH > V.layout.W + 1300 || cy * CH > V.layout.H) continue;
        const ch = P.chunk(cx, cy);
        if (ch) ctx.drawImage(ch, cx * CH, cy * CH);
        else { // a held-breath placeholder in the ground's own key
          ctx.fillStyle = '#5E6F50';
          ctx.fillRect(cx * CH, cy * CH, CH, CH);
        }
      }
    }
  };

  // dynamic pass: swaying blades and flower heads, deterministic per cell
  P.drawFlora = function (ctx, cam) {
    const v = cam.view();
    if (cam.zoom < 0.6) return; // pulled far out, the meadow reads as tone
    const step = 26;
    const x0 = Math.floor(v.x / step) * step, y0 = Math.floor(v.y / step) * step;
    ctx.lineCap = 'round';
    for (let wy = y0; wy < v.y + v.h + step; wy += step) {
      for (let wx = x0; wx < v.x + v.w + step; wx += step) {
        const h = U.hash2(wx / step, wy / step, 40);
        if (h > 0.4) continue;
        const jx = wx + (U.hash2(wx, wy, 41) - 0.5) * step;
        const jy = wy + (U.hash2(wx, wy, 42) - 0.5) * step;
        if (jy > V.layout.seaY - 8 || V.terrain.water(jx, jy) || V.terrain.nearPath(jx, jy) < 14) continue;
        const base = groundColor(jx, jy);
        if (!base) continue;
        const sway = V.wind.sway(jx, jy, 1.8) * 3.2;
        const len = 5 + U.hash2(wx, wy, 43) * 5;
        ctx.strokeStyle = U.shade(base, 0.2);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(jx, jy);
        ctx.quadraticCurveTo(jx + sway * 0.5, jy - len * 0.6, jx + sway, jy - len);
        ctx.stroke();

        // flower heads inside registered fields
        for (const f of P.fields) {
          const d = U.dist(jx, jy, f.x, f.y);
          if (d < f.r && U.hash2(wx, wy, 44) < (f.density || 0.5)) {
            const cols = f.colors || ['#F4C7D4'];
            const col = cols[Math.floor(U.hash2(wx, wy, 45) * cols.length)];
            const fh = len + 3 + U.hash2(wx, wy, 46) * 6;
            const tipx = jx + sway * 1.2, tipy = jy - fh;
            ctx.strokeStyle = U.shade(base, 0.1);
            ctx.beginPath(); ctx.moveTo(jx, jy); ctx.quadraticCurveTo(jx + sway * 0.6, jy - fh * 0.6, tipx, tipy); ctx.stroke();
            ctx.fillStyle = col;
            if (f.type === 'heather') {
              ctx.fillRect(tipx - 1.2, tipy - 3, 2.4, 4);
            } else {
              ctx.beginPath(); ctx.arc(tipx, tipy, 2 + U.hash2(wx, wy, 47) * 1.6, 0, 6.28); ctx.fill();
              ctx.fillStyle = 'rgba(255,250,230,0.8)';
              ctx.beginPath(); ctx.arc(tipx, tipy, 0.9, 0, 6.28); ctx.fill();
            }
            break;
          }
        }
      }
    }
  };
})(window.VALE);
