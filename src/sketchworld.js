// Beyond the doorframe the next valley exists only in pencil, and it inks
// itself in with every step you take. Far off, a small figure waves. Once.
(function (V) {
  const SK = V.sketchworld = {};
  const U = V.util;
  SK.inked = [];        // cells [cx, cy] the traveler has brought color to
  const CELL = 90;
  let waved = false, waveT = 0;

  SK.active = () => V.player.y < V.layout.sketchY + 40;

  SK.update = function (dt) {
    if (V.player.y > V.layout.sketchY) return;
    const cx = Math.floor(V.player.x / CELL), cy = Math.floor(V.player.y / CELL);
    if (!SK.inked.some((c) => c[0] === cx && c[1] === cy)) {
      SK.inked.push([cx, cy]);
      if (SK.inked.length === 1) {
        V.journal.note('the world here is pencil. it inks where you walk.');
        V.audio && V.audio.tuneWhole && V.audio.tuneWhole();
      }
    }
    // the figure, one hill further, straightens up — and waves. once.
    if (!waved && V.player.y < 900) {
      waved = true; waveT = 3.4;
      V.state.flags.theWave = true;
      V.journal.note('someone far ahead waved. once. the last sketch.');
    }
    if (waveT > 0) waveT -= dt;
  };

  // pencil veil over everything north of the line, minus inked breaths.
  // built on its own layer so the erased holes reveal the WORLD, never the
  // page behind the canvas.
  SK.draw = function (mainCtx, cam) {
    const v = cam.view();
    if (v.y > V.layout.sketchY) return;
    const clipH = Math.min(V.layout.sketchY, v.y + v.h) - v.y + 16;
    if (clipH <= 0) return;
    const off = SK._off || (SK._off = document.createElement('canvas'));
    const ow = Math.ceil(v.w + 16), oh = Math.ceil(clipH);
    if (off.width !== ow || off.height !== oh) { off.width = ow; off.height = oh; }
    const ctx = off.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ow, oh);
    ctx.translate(-(v.x - 8), -(v.y - 8));
    ctx.save();
    ctx.beginPath();
    ctx.rect(v.x - 8, v.y - 8, v.w + 16, clipH);
    ctx.clip();
    // grey wash + pencil hatching
    ctx.fillStyle = 'rgba(226,224,214,0.82)';
    ctx.fillRect(v.x - 8, v.y - 8, v.w + 16, V.layout.sketchY - v.y + 16);
    ctx.strokeStyle = 'rgba(120,118,108,0.5)';
    ctx.lineWidth = 1;
    for (let yy = Math.floor(v.y / 22) * 22; yy < V.layout.sketchY; yy += 22) {
      ctx.beginPath();
      for (let x = v.x - 20; x < v.x + v.w + 20; x += 30) {
        const jy = yy + U.hash2(x | 0, yy, 3) * 8;
        x === v.x - 20 ? ctx.moveTo(x, jy) : ctx.lineTo(x + 18, jy + (U.hash2(x, yy, 4) - 0.5) * 6);
      }
      ctx.stroke();
    }
    // sketched hills of the next page
    ctx.strokeStyle = 'rgba(90,88,80,0.7)';
    ctx.lineWidth = 1.6;
    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      for (let x = v.x - 20; x < v.x + v.w + 20; x += 24) {
        const yy = 700 + r * 160 + Math.sin(x * 0.004 + r * 2) * 60 + U.hash2(x | 0, r, 5) * 10;
        x === v.x - 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    // color breathes back in where you have walked
    ctx.globalCompositeOperation = 'destination-out';
    for (const c of SK.inked) {
      const g = ctx.createRadialGradient(c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2, 0, c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2, CELL);
      g.addColorStop(0, 'rgba(0,0,0,0.95)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2, CELL, 0, 6.28); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    // the small figure who is always one hill further
    const fx = 1240, fy = 640;
    ctx.strokeStyle = '#4A4842';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 10);
    ctx.moveTo(fx - 3, fy - 3); ctx.lineTo(fx, fy - 7); ctx.lineTo(fx + 3, fy - 3);
    ctx.stroke();
    ctx.fillStyle = '#4A4842';
    ctx.beginPath(); ctx.arc(fx, fy - 12, 2.2, 0, 6.28); ctx.fill();
    if (waveT > 0) {
      const a = Math.sin(waveT * 6) * 0.5;
      ctx.strokeStyle = '#4A4842';
      ctx.beginPath();
      ctx.moveTo(fx + 1, fy - 9);
      ctx.lineTo(fx + 5, fy - 15 + a * 3);
      ctx.stroke();
    }
    ctx.restore();
    // composite the finished veil over the world
    mainCtx.drawImage(off, v.x - 8, v.y - 8);
  };

  SK.save = () => ({ inked: SK.inked.slice(0, 400), waved });
  SK.load = (s) => { if (s) { SK.inked = s.inked || []; waved = !!s.waved; } };
})(window.VALE);
