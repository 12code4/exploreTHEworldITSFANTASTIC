// The one wind. Grass, cloth, petals, smoke, laundry and water chop all
// sample this field, so a gust is a visible event crossing the whole vale.
// Of an evening the sea breathes in: the wind swings up-valley (negative y)
// and the petals go upstream — the famous mystery is this force field.
(function (V) {
  const W = V.wind = {};
  let t = 0;

  W.update = (dt) => { t += dt; };

  // returns {x, y, mag} at world position; y negative = up-valley (north)
  W.at = function (x, y) {
    const h = V.clock.hour();
    // base direction: daytime light and variable; evening 17..21 pushes north
    const evening = V.util.clamp((h - 17) / 1.5, 0, 1) * V.util.clamp((21.5 - h) / 1.5, 0, 1);
    let bx = Math.sin(t * 0.05 + x * 0.0007) * 0.5;
    let by = 0.15 - evening * 1.1; // gentle south drift by day, firm north push of an evening
    // traveling gusts: a slow sine wall moving up the vale + noise
    const gustPhase = (y * 0.0016 + t * 0.55);
    const gust = Math.max(0, Math.sin(gustPhase)) ** 3;
    const n = V.util.fbm(x * 0.002 + t * 0.06, y * 0.002, 77, 2) - 0.5;
    const mag = 0.35 + gust * 0.9 + Math.abs(n) * 0.5 + evening * 0.35;
    bx += n * 0.8;
    const len = Math.hypot(bx, by) || 1;
    return { x: bx / len, y: by / len, mag };
  };

  // scalar sway for cheap consumers (grass strokes, cloth)
  W.sway = function (x, y, speed) {
    const w = W.at(x, y);
    return Math.sin(t * (speed || 2.2) + x * 0.02 + y * 0.013) * w.mag;
  };

  W.time = () => t;
})(window.VALE);
