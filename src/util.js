// The shared namespace. Everything in the vale hangs off VALE so the whole
// game concatenates into one file with zero build tooling.
window.VALE = { data: { places: [], people: [], chorus: [] }, hooks: [] };

(function (V) {
  const U = V.util = {};

  U.mulberry = function (a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  // deterministic hash noise: same (x, y, seed) forever — the world holds still
  U.hash2 = function (x, y, seed) {
    let h = (x * 374761393 + y * 668265263 + (seed || 0) * 1442695041) | 0;
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  };

  // smooth value noise built on hash2
  U.noise2 = function (x, y, seed) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const s = (t) => t * t * (3 - 2 * t);
    const a = U.hash2(xi, yi, seed), b = U.hash2(xi + 1, yi, seed);
    const c = U.hash2(xi, yi + 1, seed), d = U.hash2(xi + 1, yi + 1, seed);
    return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
  };

  U.fbm = function (x, y, seed, oct) {
    let v = 0, amp = 0.5, f = 1;
    for (let i = 0; i < (oct || 3); i++) { v += amp * U.noise2(x * f, y * f, seed + i); amp *= 0.5; f *= 2; }
    return v;
  };

  U.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
  U.ease = (t) => t * t * (3 - 2 * t);

  // color helpers: hex <-> rgb, mix in rgb space
  U.rgb = function (hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  U.hex = (r, g, b) => '#' + ((1 << 24) + (U.clamp(r | 0, 0, 255) << 16) + (U.clamp(g | 0, 0, 255) << 8) + U.clamp(b | 0, 0, 255)).toString(16).slice(1);
  U.mix = function (h1, h2, t) {
    const a = U.rgb(h1), b = U.rgb(h2);
    return U.hex(U.lerp(a[0], b[0], t), U.lerp(a[1], b[1], t), U.lerp(a[2], b[2], t));
  };
  U.shade = function (hex, amt) { // amt -1..1
    const c = U.rgb(hex);
    return amt >= 0 ? U.hex(c[0] + (255 - c[0]) * amt, c[1] + (255 - c[1]) * amt, c[2] + (255 - c[2]) * amt)
      : U.hex(c[0] * (1 + amt), c[1] * (1 + amt), c[2] * (1 + amt));
  };

  // catmull-rom sample along a point list, t in 0..1 over whole spline
  U.spline = function (pts, t) {
    const n = pts.length - 1;
    const f = U.clamp(t, 0, 0.9999) * n;
    const i = Math.floor(f), u = f - i;
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[Math.min(n, i + 1)], p3 = pts[Math.min(n, i + 2)];
    const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  };

  U.nearestOnSpline = function (pts, x, y, samples) {
    let best = 1e9, bt = 0, bx = 0, by = 0;
    const n = samples || 160;
    for (let i = 0; i <= n; i++) {
      const p = U.spline(pts, i / n);
      const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y);
      if (d < best) { best = d; bt = i / n; bx = p[0]; by = p[1]; }
    }
    return { d: Math.sqrt(best), t: bt, x: bx, y: by };
  };
})(window.VALE);
