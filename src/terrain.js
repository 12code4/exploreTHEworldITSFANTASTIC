// The ground truth: elevation, water, walkability. The geology enforces the
// Law of Gentle Ground — deep water floats you back, slopes make pace, and
// the only hard walls are the gorge's, which the stair threads.
(function (V) {
  const T = V.terrain = {};
  const U = V.util, L = () => V.layout;

  // river-distance cache on a coarse grid: tone-work tolerates 16px steps
  const rdCache = new Map();
  T.riverDist = function (x, y) {
    const kx = x >> 4, ky = y >> 4;
    const k = kx * 4096 + ky;
    let d = rdCache.get(k);
    if (d === undefined) {
      d = U.nearestOnSpline(L().river, kx * 16 + 8, ky * 16 + 8, 120).d;
      if (rdCache.size > 60000) rdCache.clear();
      rdCache.set(k, d);
    }
    return d;
  };

  T.elevation = function (x, y) {
    const l = L();
    let e = (l.H - y) / l.H * 120;                       // the vale rises north
    // pear ridge: a long rise along the east
    const rd = U.dist(x, y, 2150, 3750);
    e += Math.max(0, 46 - rd / 22) * 0.9;
    const rd2 = U.dist(x, y, 2000, 4400);
    e += Math.max(0, 30 - rd2 / 26);
    // the moor NW
    const md = U.dist(x, y, 550, 2600);
    e += Math.max(0, 40 - md / 24);
    // the gorge: high shoulders either side of the river between falls & head
    if (y > 1500 && y < 2380) {
      const d = T.riverDist(x, y);
      if (d > 60) e += Math.min(55, (d - 60) * 0.55);
    }
    // rolling texture
    e += (U.fbm(x * 0.004, y * 0.004, 5, 3) - 0.5) * 14;
    return e;
  };

  T.slope = function (x, y) {
    const s = 14;
    const dx = T.elevation(x + s, y) - T.elevation(x - s, y);
    const dy = T.elevation(x, y + s) - T.elevation(x, y - s);
    return { dx: dx / (2 * s), dy: dy / (2 * s), mag: Math.hypot(dx, dy) / (2 * s) };
  };

  // water: 0 none, 1 shallow (paddle), 2 deep (float back)
  T.water = function (x, y) {
    const l = L();
    if (y > l.seaY) return U.dist(x, y, x, l.seaY) < 40 ? 1 : 2;
    const r = U.nearestOnSpline(l.river, x, y, 200);
    const w = l.riverWidth(r.t);
    if (r.d < w * 0.45) {
      // the ford: stepping-stone shallows by the Cross
      if (y > 4240 && y < 4360) return 1;
      return 2;
    }
    if (r.d < w * 0.75) return 1;
    return 0;
  };

  T.moisture = function (x, y) {
    return U.clamp(1 - T.riverDist(x, y) / 700, 0, 1) + U.fbm(x * 0.003, y * 0.003, 9, 2) * 0.4;
  };

  // hard blockers: gorge walls (unless near the stair path), sea cliffs on Gull Head
  T.blocked = function (x, y) {
    const l = L();
    const un = l.under; // the cave band lives off-map east; its walls are its own
    if (x > un.x1 - 30) return x < un.x1 + 10 || x > un.x2 + 10 || y < un.y1 + 14 || y > un.y2 - 14;
    if (x < 20 || x > l.W - 20 || y < 40 || y > l.H - 20) return true;
    if (y > 1500 && y < 2380) {
      const r = U.nearestOnSpline(l.river, x, y, 120);
      if (r.d > 105 && r.d < 240) {
        // the stair corridor hugs the east bank
        const stair = Math.abs(x - (r.x + 78));
        if (stair > 55) return true;
      }
    }
    return false;
  };

  // objects register their own solid rects
  T.solids = [];
  T.addSolid = (x, y, w, h) => T.solids.push({ x, y, w, h });
  T.hitSolid = function (x, y) {
    for (const s of T.solids) {
      if (x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h) return true;
    }
    return false;
  };

  // worn ways, sampled from the node graph for the painter
  let segsCache = null;
  T.pathSegs = function () {
    if (!segsCache) {
      const l = L(); segsCache = [];
      for (const [a, b] of l.edges) segsCache.push([l.nodes[a], l.nodes[b]]);
    }
    return segsCache;
  };
  const npCache = new Map();
  T.nearPath = function (x, y) {
    const k = (x >> 4) * 4096 + (y >> 4);
    let best = npCache.get(k);
    if (best !== undefined) return best;
    const qx = ((x >> 4) << 4) + 8, qy = ((y >> 4) << 4) + 8;
    best = 1e9;
    for (const [a, b] of T.pathSegs()) {
      const px = b[0] - a[0], py = b[1] - a[1];
      const t = U.clamp(((qx - a[0]) * px + (qy - a[1]) * py) / (px * px + py * py || 1), 0, 1);
      const d = U.dist(qx, qy, a[0] + px * t, a[1] + py * t);
      if (d < best) best = d;
    }
    if (npCache.size > 60000) npCache.clear();
    npCache.set(k, best);
    return best;
  };
})(window.VALE);
