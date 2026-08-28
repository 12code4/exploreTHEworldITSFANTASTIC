// The camera that breathes: follow, gaze, and the overlook — standing at a
// vista eases the whole world into view, small and alive. Law 1 as a lens.
(function (V) {
  const C = V.camera = {};
  const U = V.util;

  C.x = 0; C.y = 0; C.zoom = 1;
  let tx = 0, ty = 0, tzoom = 1;
  C.SW = 960; C.SH = 540;

  C.jump = function (x, y) { C.x = tx = x; C.y = ty = y; };

  C.update = function (dt, player) {
    const ahead = 46;
    tx = player.x + player.fx * ahead;
    ty = player.y + player.fy * ahead - 24;
    tzoom = 1;

    for (const o of V.layout.overlooks) {
      const d = U.dist(player.x, player.y, o.x, o.y);
      if (d < o.r) {
        const t = 1 - d / o.r;
        tzoom = U.lerp(1, o.zoom, U.ease(t));
        // look out over the vale below (south), not at your feet
        ty = U.lerp(ty, o.y + 520 * t, t * 0.8);
      }
    }
    if (player.sitting) { tzoom = Math.min(tzoom, 0.72); }
    if (player.gazing && player.gazeAt) {
      tx = U.lerp(tx, player.gazeAt.x, 0.6);
      ty = U.lerp(ty, player.gazeAt.y, 0.6);
      tzoom = 1.35;
    }

    const k = 1 - Math.pow(0.0018, dt);
    C.x += (tx - C.x) * k;
    C.y += (ty - C.y) * k;
    C.zoom += (tzoom - C.zoom) * (1 - Math.pow(0.006, dt));

    const hw = C.SW / 2 / C.zoom, hh = C.SH / 2 / C.zoom;
    C.x = U.clamp(C.x, hw - 100, V.layout.W - hw + 100);
    C.y = U.clamp(C.y, hh, V.layout.H - hh + 60);
  };

  C.view = function () {
    const w = C.SW / C.zoom, h = C.SH / C.zoom;
    return { x: C.x - w / 2, y: C.y - h / 2, w, h };
  };

  C.apply = function (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(C.zoom * C.dpr, C.zoom * C.dpr);
    ctx.translate(C.SW / 2 / C.zoom - C.x, C.SH / 2 / C.zoom - C.y);
  };
  C.dpr = 1;
})(window.VALE);
