// Meant things. Every object registers with a `why` that is a story, and
// the loader refuses anything without one — the Interrogation as code.
// Objects are composed from a fixed painterly vocabulary so the vale keeps
// one hand.
(function (V) {
  const O = V.objects = {};
  const U = V.util;
  O.list = [];

  O.place = function (def) {
    if (!def.why || typeof def.why !== 'string' || def.why.length < 24) {
      throw new Error('INTERROGATION FAILED: "' + (def.id || def.kind) + '" cannot say why it is here. It does not ship.');
    }
    def.x = def.at[0]; def.y = def.at[1];
    def.seed = (def.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 7);
    O.list.push(def);
    // solid footprints
    const S = { house: [66, 26], chapel: [58, 24], shed: [40, 18], lighthouse: [30, 16], hut: [54, 22], boat: [56, 16], stall: [40, 14] };
    if (S[def.kind] && def.solid !== false) {
      const s = S[def.kind], sc = def.scale || 1;
      V.terrain.addSolid(def.x - s[0] * sc / 2, def.y - s[1] * sc, s[0] * sc, s[1] * sc);
    }
    if (def.kind === 'tree' && def.solid !== false) V.terrain.addSolid(def.x - 5, def.y - 6, 10, 8);
    if (def.kind === 'stone') V.terrain.addSolid(def.x - 6, def.y - 5, 12, 7);
    for (const e of def.emit || []) V.particles.add({ x: def.x + (e.dx || 0), y: def.y + (e.dy || 0), ...e });
    for (const f of def.fields || []) V.painter.addField({ x: def.x + (f.dx || 0), y: def.y + (f.dy || 0), ...f });
    return def;
  };

  O.byId = (id) => O.list.find((o) => o.id === id);

  // ---------- painterly vocabulary ----------
  function shadow(ctx, x, y, w) {
    ctx.fillStyle = 'rgba(30,40,30,0.22)';
    ctx.beginPath(); ctx.ellipse(x, y + 2, w, w * 0.32, 0, 0, 6.28); ctx.fill();
  }

  const draw = {
    house(ctx, o) {
      const s = o.scale || 1, w = 62 * s, h = 44 * s;
      const x = o.x, y = o.y;
      shadow(ctx, x, y, w * 0.55);
      const wall = o.tint || '#D8CBB2';
      ctx.fillStyle = U.shade(wall, -0.16);
      ctx.fillRect(x - w / 2, y - h * 0.62, w, h * 0.62);
      ctx.fillStyle = wall;
      ctx.fillRect(x - w / 2, y - h * 0.62, w, h * 0.5);
      // roof
      ctx.fillStyle = o.roof || '#8A6A50';
      ctx.beginPath();
      ctx.moveTo(x - w / 2 - 4 * s, y - h * 0.62);
      ctx.lineTo(x, y - h * 1.12);
      ctx.lineTo(x + w / 2 + 4 * s, y - h * 0.62);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = U.shade(o.roof || '#8A6A50', -0.2);
      ctx.beginPath();
      ctx.moveTo(x, y - h * 1.12); ctx.lineTo(x + w / 2 + 4 * s, y - h * 0.62);
      ctx.lineTo(x + w / 2 - 2, y - h * 0.62); ctx.lineTo(x - 2, y - h * 1.06);
      ctx.closePath(); ctx.fill();
      // the door: a color somebody argued for
      ctx.fillStyle = o.door || '#5C6B50';
      ctx.fillRect(x - 6 * s, y - 20 * s, 12 * s, 20 * s);
      // windows: lit truthfully at night if someone's home
      const night = V.palette.duskness(V.clock.hour()) > 0.5;
      const lit = night && o.home !== false;
      ctx.fillStyle = lit ? '#FFD97A' : U.shade(wall, -0.35);
      ctx.fillRect(x - w / 2 + 8 * s, y - h * 0.5, 9 * s, 9 * s);
      if (w > 56) ctx.fillRect(x + w / 2 - 17 * s, y - h * 0.5, 9 * s, 9 * s);
      if (lit) {
        ctx.globalAlpha = 0.18; ctx.fillStyle = '#FFD97A';
        ctx.beginPath(); ctx.ellipse(x - w / 2 + 12 * s, y - h * 0.5 + 5, 14, 10, 0, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (o.chimney !== false) {
        ctx.fillStyle = '#8A8578';
        ctx.fillRect(x + w * 0.22, y - h * 1.16, 7 * s, 14 * s);
      }
    },
    chapel(ctx, o) { draw.house(ctx, { ...o, scale: (o.scale || 1) * 0.95, tint: '#E4DED2', roof: '#7A756A', door: o.door || '#6B4A32' });
      const s = o.scale || 1;
      ctx.strokeStyle = '#5A544A'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y - 62 * s); ctx.lineTo(o.x, o.y - 48 * s);
      ctx.moveTo(o.x - 4 * s, o.y - 58 * s); ctx.lineTo(o.x + 4 * s, o.y - 58 * s);
      ctx.stroke();
    },
    shed(ctx, o) {
      const s = o.scale || 1, x = o.x, y = o.y;
      shadow(ctx, x, y, 22 * s);
      ctx.fillStyle = o.tint || '#6B5A42';
      ctx.fillRect(x - 20 * s, y - 22 * s, 40 * s, 22 * s);
      ctx.fillStyle = U.shade(o.tint || '#6B5A42', -0.22);
      ctx.beginPath();
      ctx.moveTo(x - 23 * s, y - 22 * s); ctx.lineTo(x, y - 34 * s); ctx.lineTo(x + 23 * s, y - 22 * s);
      ctx.closePath(); ctx.fill();
    },
    lighthouse(ctx, o) {
      const s = o.scale || 1, x = o.x, y = o.y;
      shadow(ctx, x, y, 15 * s);
      ctx.fillStyle = '#E8E4D8';
      ctx.beginPath();
      ctx.moveTo(x - 11 * s, y); ctx.lineTo(x - 7 * s, y - 64 * s);
      ctx.lineTo(x + 7 * s, y - 64 * s); ctx.lineTo(x + 11 * s, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#B9524A';
      ctx.fillRect(x - 9.4 * s, y - 26 * s, 18.8 * s, 8 * s);
      ctx.fillRect(x - 8 * s, y - 48 * s, 16 * s, 8 * s);
      ctx.fillStyle = '#3D4A3C';
      ctx.fillRect(x - 9 * s, y - 74 * s, 18 * s, 10 * s);
      // the lamp itself: showpieces.js blinks it in sevens
      o._lamp = [x, y - 69 * s];
    },
    hut(ctx, o) { draw.house(ctx, { ...o, scale: (o.scale || 1) * 0.85, tint: o.tint || '#C9B896', roof: '#6E5A40' }); },
    tree(ctx, o) {
      const s = o.scale || 1, x = o.x, y = o.y;
      const kindC = { pear: ['#5E7A4E', '#F4C7D4'], oak: ['#4E6A42', null], willow: ['#6E8A5E', null], yew: ['#39503A', null], rowan: ['#5E7A4E', '#E86A5A'] };
      const [leaf, bloom] = kindC[o.variant || 'oak'] || kindC.oak;
      shadow(ctx, x, y, 20 * s);
      ctx.strokeStyle = V.palette.keys.moss.bark;
      ctx.lineCap = 'round';
      ctx.lineWidth = 4.5 * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - 3 * s, y - 16 * s, x + 2 * s, y - 26 * s); // crooked on purpose
      ctx.stroke();
      const rng = U.mulberry(o.seed);
      const sway = V.wind.sway(x, y, 1.4) * 2.4;
      for (let i = 0; i < 16; i++) {
        const a = rng() * 6.28, r = Math.sqrt(rng()) * 17 * s;
        const dx = Math.cos(a) * r * 1.15, dy = Math.sin(a) * r * 0.75;
        ctx.fillStyle = U.shade(leaf, (rng() - 0.45) * 0.5);
        ctx.beginPath();
        ctx.arc(x + dx + sway * (0.4 + rng() * 0.6), y - 30 * s + dy, (5.5 + rng() * 4.5) * s, 0, 6.28);
        ctx.fill();
      }
      if (bloom) {
        for (let i = 0; i < 12; i++) {
          const a = rng() * 6.28, r = Math.sqrt(rng()) * 16 * s;
          ctx.fillStyle = rng() > 0.4 ? bloom : '#FBF1DC';
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * r + sway, y - 31 * s + Math.sin(a) * r * 0.7, 1.6 + rng() * 1.4, 0, 6.28);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    },
    stone(ctx, o) {
      const s = o.scale || 1, x = o.x, y = o.y;
      const lean = ((o.seed % 7) - 3) * 0.035; // each stone stands its own way
      shadow(ctx, x, y, 10 * s);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(lean);
      // a broad grey slab with shoulders, not a spire
      ctx.fillStyle = '#8A8A80';
      ctx.beginPath();
      ctx.moveTo(-8 * s, 0);
      ctx.lineTo(-7 * s, -19 * s);
      ctx.quadraticCurveTo(-6 * s, -24 * s, -1 * s, -25 * s);
      ctx.quadraticCurveTo(4.5 * s, -24.5 * s, 5.5 * s, -20 * s);
      ctx.lineTo(7.5 * s, -2 * s);
      ctx.closePath(); ctx.fill();
      // the lit face
      ctx.fillStyle = '#A2A296';
      ctx.beginPath();
      ctx.moveTo(-6 * s, -1 * s);
      ctx.lineTo(-5.4 * s, -18 * s);
      ctx.quadraticCurveTo(-4.6 * s, -22.6 * s, -1 * s, -23.4 * s);
      ctx.lineTo(-0.4 * s, -1 * s);
      ctx.closePath(); ctx.fill();
      // weather cracks
      ctx.strokeStyle = 'rgba(70,72,66,0.5)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(1.5 * s, -21 * s); ctx.lineTo(2.6 * s, -13 * s);
      ctx.moveTo(-3 * s, -9 * s); ctx.lineTo(-1.2 * s, -6 * s);
      ctx.stroke();
      // moss cuff, low
      ctx.fillStyle = 'rgba(90,110,80,0.35)';
      ctx.beginPath(); ctx.ellipse(-2.6 * s, -3.4 * s, 3.4 * s, 2.4 * s, 0.3, 0, 6.28); ctx.fill();
      ctx.restore();
    },
    rock(ctx, o) {
      const s = o.scale || 1;
      shadow(ctx, o.x, o.y, 8 * s);
      ctx.fillStyle = '#82826E';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 3 * s, 8 * s, 5.5 * s, 0, 3.14, 0); ctx.fill();
      ctx.fillRect(o.x - 8 * s, o.y - 3 * s, 16 * s, 3 * s);
    },
    bench(ctx, o) {
      const x = o.x, y = o.y;
      ctx.fillStyle = '#6E5A40';
      ctx.fillRect(x - 12, y - 8, 24, 3);
      ctx.fillRect(x - 10, y - 5, 2.5, 5); ctx.fillRect(x + 7.5, y - 5, 2.5, 5);
    },
    boat(ctx, o) { // upturned hull
      const s = o.scale || 1, x = o.x, y = o.y;
      shadow(ctx, x, y, 26 * s);
      ctx.fillStyle = o.tint || '#7A6248';
      ctx.beginPath();
      ctx.moveTo(x - 26 * s, y);
      ctx.quadraticCurveTo(x, y - 20 * s, x + 26 * s, y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = U.shade(o.tint || '#7A6248', -0.25);
      ctx.lineWidth = 1.4;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 26 * s + i * 6, y);
        ctx.quadraticCurveTo(x, y - 20 * s + i * 4, x + 26 * s - i * 6, y);
        ctx.stroke();
      }
      if (o.patched) { // maren's spoiled survey sheet
        ctx.fillStyle = '#E8E0C8';
        ctx.fillRect(x - 6 * s, y - 14 * s, 11 * s, 8 * s);
        ctx.strokeStyle = '#8A7B5E'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - 4 * s, y - 12 * s); ctx.quadraticCurveTo(x, y - 8 * s, x + 3 * s, y - 11 * s);
        ctx.stroke();
      }
    },
    jetty(ctx, o) {
      const x = o.x, y = o.y, len = o.len || 70;
      ctx.fillStyle = '#6E5A40';
      ctx.fillRect(x - 8, y, 16, len);
      ctx.strokeStyle = '#5A4A34'; ctx.lineWidth = 1;
      for (let i = 8; i < len; i += 9) { ctx.beginPath(); ctx.moveTo(x - 8, y + i); ctx.lineTo(x + 8, y + i); ctx.stroke(); }
      ctx.fillStyle = '#4A3E2E';
      ctx.fillRect(x - 10, y + len - 4, 4, 6); ctx.fillRect(x + 6, y + len - 4, 4, 6);
    },
    bellpost(ctx, o) {
      const x = o.x, y = o.y;
      shadow(ctx, x, y, 8);
      ctx.fillStyle = '#5A4A34';
      ctx.fillRect(x - 2.5, y - 34, 5, 34);
      ctx.fillRect(x - 12, y - 36, 24, 4);
      ctx.fillStyle = '#B99B3E';
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 22); ctx.quadraticCurveTo(x, y - 34, x + 6, y - 22);
      ctx.lineTo(x + 4, y - 20); ctx.lineTo(x - 4, y - 20); ctx.closePath(); ctx.fill();
    },
    sign(ctx, o) {
      ctx.fillStyle = '#5A4A34';
      ctx.fillRect(o.x - 1.5, o.y - 22, 3, 22);
      ctx.fillStyle = '#C9B896';
      ctx.fillRect(o.x - 14, o.y - 30, 28, 9);
    },
    milestone(ctx, o) {
      shadow(ctx, o.x, o.y, 6);
      ctx.fillStyle = '#8A8A7A';
      ctx.beginPath();
      ctx.moveTo(o.x - 5, o.y); ctx.lineTo(o.x - 5, o.y - 13);
      ctx.arc(o.x, o.y - 13, 5, 3.14, 0);
      ctx.lineTo(o.x + 5, o.y); ctx.closePath(); ctx.fill();
    },
    fence(ctx, o) {
      const n = o.n || 4, dx = o.dx == null ? 12 : o.dx, dy = o.dy || 0;
      ctx.strokeStyle = '#6E5A40'; ctx.lineWidth = 2;
      for (let i = 0; i < n; i++) {
        const x = o.x + dx * i, y = o.y + dy * i;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 10); ctx.stroke();
      }
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(o.x, o.y - 8); ctx.lineTo(o.x + dx * (n - 1), o.y + dy * (n - 1) - 8); ctx.stroke();
    },
    arch(ctx, o) {
      const s = o.scale || 1;
      shadow(ctx, o.x, o.y, 14 * s);
      ctx.strokeStyle = '#6E7A62'; ctx.lineWidth = 7 * s; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(o.x, o.y - 4, 14 * s, 3.34, 6.08); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,150,100,0.6)'; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.arc(o.x, o.y - 4, 15 * s, 3.6, 4.6); ctx.stroke();
    },
    waymark(ctx, o) {
      ctx.fillStyle = '#5E6462';
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate((o.seed % 10 - 5) * 0.03);
      ctx.fillRect(-6, -16, 12, 16);
      ctx.fillStyle = '#8A9290';
      ctx.fillRect(-4.6, -14.5, 9.2, 10);
      ctx.restore();
    },
    pool(ctx, o) { // a dye pool, steeped and steaming slightly
      const s = o.scale || 1;
      ctx.fillStyle = '#6E5A42';
      ctx.beginPath(); ctx.ellipse(o.x, o.y, 20 * s, 10 * s, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = o.tint || '#4A6FA5';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 1, 17 * s, 8 * s, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = U.shade(o.tint || '#4A6FA5', 0.25);
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.ellipse(o.x - 4 * s, o.y - 3, 7 * s, 3 * s, 0.3, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1;
    },
    clothline(ctx, o) {
      const len = o.len || 90, x = o.x, y = o.y;
      ctx.strokeStyle = '#5A4A34'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + len, y); ctx.lineTo(x + len, y - 26); ctx.stroke();
      ctx.strokeStyle = '#8A8578'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y - 24); ctx.quadraticCurveTo(x + len / 2, y - 20, x + len, y - 24); ctx.stroke();
      const cols = o.colors || ['#F6EFE2'];
      const n = o.pieces || 4;
      for (let i = 0; i < n; i++) {
        const cx = x + (len / (n + 1)) * (i + 1);
        const sway = V.wind.sway(cx, y, 2.6) * 6;
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.moveTo(cx - 5, y - 23);
        ctx.lineTo(cx + 5, y - 23);
        ctx.lineTo(cx + 5 + sway, y - 8);
        ctx.lineTo(cx - 5 + sway, y - 10);
        ctx.closePath(); ctx.fill();
      }
    },
    stall(ctx, o) {
      shadow(ctx, o.x, o.y, 20);
      ctx.fillStyle = '#8A6844';
      ctx.fillRect(o.x - 18, o.y - 14, 36, 14);
      ctx.fillStyle = o.tint || '#B9524A';
      ctx.beginPath();
      ctx.moveTo(o.x - 22, o.y - 14); ctx.lineTo(o.x - 18, o.y - 28);
      ctx.lineTo(o.x + 18, o.y - 28); ctx.lineTo(o.x + 22, o.y - 14);
      ctx.closePath(); ctx.fill();
    },
    telescope(ctx, o) {
      ctx.strokeStyle = '#4A4238'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(o.x - 5, o.y); ctx.lineTo(o.x, o.y - 10);
      ctx.moveTo(o.x + 5, o.y); ctx.lineTo(o.x, o.y - 10);
      ctx.stroke();
      ctx.save(); ctx.translate(o.x, o.y - 12); ctx.rotate(-0.5);
      ctx.fillStyle = '#7A6A4E'; ctx.fillRect(-2, -2, 16, 4);
      ctx.restore();
    },
    doorframe(ctx, o) {
      shadow(ctx, o.x, o.y, 12);
      ctx.strokeStyle = '#6E5A40'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(o.x - 10, o.y); ctx.lineTo(o.x - 10, o.y - 30);
      ctx.lineTo(o.x + 10, o.y - 30); ctx.lineTo(o.x + 10, o.y);
      ctx.stroke();
    },
    chimney(ctx, o) { // the seventh, alone in the yew hedge
      const x = o.x, y = o.y;
      ctx.fillStyle = '#39503A';
      ctx.beginPath(); ctx.ellipse(x, y - 4, 26, 13, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#46603F';
      ctx.beginPath(); ctx.ellipse(x - 6, y - 8, 16, 8, 0.2, 0, 6.28); ctx.fill();
      shadow(ctx, x, y, 20);
      ctx.fillStyle = '#8A8578';
      ctx.fillRect(x - 6, y - 34, 12, 30);
      ctx.fillStyle = '#7A756A';
      ctx.fillRect(x - 8, y - 36, 16, 4);
      ctx.fillStyle = '#3A3328'; // the soot door with no keyhole
      ctx.fillRect(x - 3.4, y - 16, 6.8, 8);
      if (V.clock.phase() === 'dusk') { // warm to the touch, at dusk
        ctx.globalAlpha = 0.12 + Math.sin(V.wind.time() * 1.4) * 0.04;
        ctx.fillStyle = '#FFD97A';
        ctx.beginPath(); ctx.ellipse(x, y - 18, 14, 20, 0, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    cat(ctx, o) {
      const x = o.x, y = o.y, c = o.tint || '#4A4238';
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(x, y - 3, 7, 4.5, 0, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 6, y - 6, 3.4, 0, 6.28); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 4.4, y - 8.6); ctx.lineTo(x + 5.4, y - 11); ctx.lineTo(x + 6.6, y - 8.8);
      ctx.moveTo(x + 6.4, y - 8.8); ctx.lineTo(x + 7.6, y - 11); ctx.lineTo(x + 8.4, y - 8.4);
      ctx.fill();
      ctx.strokeStyle = c; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x - 6, y - 4); ctx.quadraticCurveTo(x - 11, y - 9, x - 9, y - 12); ctx.stroke();
    },
    heron(ctx, o) {
      const x = o.x, y = o.y;
      ctx.strokeStyle = '#6E7A7C'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 9); ctx.stroke();
      ctx.fillStyle = '#8A969A';
      ctx.beginPath(); ctx.ellipse(x + 1, y - 11, 5, 3.4, -0.2, 0, 6.28); ctx.fill();
      ctx.strokeStyle = '#8A969A';
      ctx.beginPath(); ctx.moveTo(x + 4, y - 13); ctx.quadraticCurveTo(x + 7, y - 17, x + 6, y - 18); ctx.stroke();
      ctx.fillStyle = '#E3B93E';
      ctx.beginPath(); ctx.moveTo(x + 6, y - 18); ctx.lineTo(x + 11, y - 17.4); ctx.lineTo(x + 6, y - 16.8); ctx.fill();
    },
    prop(ctx, o) { // small honest stuff: basket, crate, pot, kettle, slate...
      const x = o.x, y = o.y, v = o.variant || 'crate';
      if (v === 'crate') { ctx.fillStyle = '#8A7248'; ctx.fillRect(x - 6, y - 8, 12, 8); ctx.strokeStyle = '#6B5A42'; ctx.strokeRect(x - 6, y - 8, 12, 8); }
      if (v === 'basket') { ctx.fillStyle = '#B99B6B'; ctx.beginPath(); ctx.ellipse(x, y - 3, 7, 4, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = '#8A7248'; ctx.beginPath(); ctx.ellipse(x, y - 5, 5.5, 2.6, 0, 0, 6.28); ctx.fill(); }
      if (v === 'pot') { ctx.fillStyle = '#A85C42'; ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x - 4, y - 7); ctx.lineTo(x + 4, y - 7); ctx.lineTo(x + 5, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5B8A50'; ctx.beginPath(); ctx.arc(x, y - 9, 3.4, 0, 6.28); ctx.fill(); }
      if (v === 'kettle') { ctx.fillStyle = '#5A5A52'; ctx.beginPath(); ctx.arc(x, y - 4, 4.4, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#5A5A52'; ctx.beginPath(); ctx.arc(x, y - 7, 3, 3.4, 6); ctx.stroke(); }
      if (v === 'slates') { ctx.fillStyle = '#5E6462'; ctx.fillRect(x - 7, y - 5, 14, 5); ctx.fillRect(x - 5.6, y - 8, 11, 3); ctx.fillRect(x - 4, y - 10.4, 8, 2.6); }
      if (v === 'pear') { ctx.fillStyle = '#C9C25E'; ctx.beginPath(); ctx.arc(x, y - 3, 3.2, 0, 6.28); ctx.arc(x, y - 6.4, 2.2, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#4A3E2E'; ctx.beginPath(); ctx.moveTo(x, y - 8.4); ctx.lineTo(x + 1.4, y - 10.4); ctx.stroke(); }
      if (v === 'lantern') { ctx.fillStyle = '#E8DCC8'; ctx.fillRect(x - 3, y - 8, 6, 7); if (V.palette.duskness(V.clock.hour()) > 0.4) { ctx.fillStyle = '#FFD97A'; ctx.fillRect(x - 1.8, y - 6.6, 3.6, 4); } }
      if (v === 'marbles') { ctx.fillStyle = '#9AD8E8'; ctx.beginPath(); ctx.arc(x - 2, y - 2, 1.8, 0, 6.28); ctx.fill(); ctx.fillStyle = '#E86A5A'; ctx.beginPath(); ctx.arc(x + 2.4, y - 1.6, 1.8, 0, 6.28); ctx.fill(); }
      if (v === 'tidepool') { ctx.fillStyle = '#5C7C8E'; ctx.beginPath(); ctx.ellipse(x, y, 11, 6, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = 'rgba(240,244,236,0.5)'; ctx.beginPath(); ctx.ellipse(x - 3, y - 1.5, 4, 2, 0.4, 0, 6.28); ctx.fill(); }
      if (v === 'chalk') { ctx.strokeStyle = 'rgba(246,244,236,0.85)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.28); ctx.moveTo(x - 4, y); ctx.lineTo(x + 5, y - 3); ctx.stroke(); }
      if (v === 'socket') { ctx.strokeStyle = '#6E6E5E'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.ellipse(x, y, 9, 5, 0, 0, 6.28); ctx.stroke(); ctx.setLineDash([]); }
      if (v === 'ashring') { ctx.fillStyle = 'rgba(90,90,82,0.7)'; ctx.beginPath(); ctx.ellipse(x, y, 10, 6, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = 'rgba(40,40,36,0.8)'; ctx.beginPath(); ctx.ellipse(x, y, 6, 3.4, 0, 0, 6.28); ctx.fill(); }
      if (v === 'gate') { ctx.strokeStyle = '#4E5A50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 14, y - 2); ctx.lineTo(x + 14, y - 2); ctx.moveTo(x - 10, y - 10); ctx.lineTo(x - 10, y + 2); ctx.moveTo(x + 10, y - 10); ctx.lineTo(x + 10, y + 2); ctx.stroke(); }
    },
  };

  O.update = function (dt) {};

  O.drawAll = function (ctx, cam, extra) {
    const v = cam.view();
    const items = [];
    for (const o of O.list) {
      if (o.x < v.x - 160 || o.x > v.x + v.w + 160 || o.y < v.y - 220 || o.y > v.y + v.h + 120) continue;
      if (o.hidden) continue;
      items.push({ y: o.y, draw: () => { (draw[o.kind] || draw.prop)(ctx, o); } });
    }
    for (const e of extra) items.push(e);
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
  };

  // interaction picking: the nearest thing that can be gazed, lifted or read
  O.nearest = function (x, y, r) {
    let best = null, bd = r || 42;
    for (const o of O.list) {
      if (o.hidden) continue;
      if (!o.gaze && !o.talkLines && !o.lift && !o.use) continue;
      const d = U.dist(x, y, o.x, o.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  };
})(window.VALE);
