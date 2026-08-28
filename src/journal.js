// The journal fills; it never counts. Notes in your order, strings on the
// edge for promises, the path you actually walked — and no denominator
// anywhere in this file, ever.
(function (V) {
  const J = V.journal = {};
  J.open = false;
  J.notes = [];        // strings of what you noticed, in order
  J.stringsOn = [];    // open promises: {id, who, note}
  J.path = [];         // the walked polyline, thinned
  J.scarf = [];        // dye stripes, in dip order
  J.names = [];        // names learned (stones, people, the vale itself)
  J.grim = 0;          // places Grim has been found asleep (a comic page grows)
  J.mapSeen = false;   // her bench unlocks the map page
  let pathTick = 0;

  J.note = function (t) {
    if (J.notes.includes(t)) return;
    J.notes.push(t);
    V.state.toast(t);
  };
  J.learnName = function (n) { if (!J.names.includes(n)) { J.names.push(n); V.state.toast('a name learned: ' + n); } };

  J.tie = function (id, who, note) { J.stringsOn.push({ id, who, note }); V.state.toast('a string, tied'); };
  J.untie = function (id) {
    const i = J.stringsOn.findIndex((s) => s.id === id);
    if (i >= 0) { J.stringsOn.splice(i, 1); V.state.toast('a string, untied'); }
  };

  J.trackPath = function (dt, x, y) {
    pathTick += dt;
    if (pathTick > 1.2) {
      pathTick = 0;
      const last = J.path[J.path.length - 1];
      if (!last || V.util.dist(last[0], last[1], x, y) > 40) J.path.push([Math.round(x), Math.round(y)]);
      if (J.path.length > 2600) J.path.splice(0, 200);
    }
  };

  let page = 0;
  J.toggle = function () { J.open = !J.open; page = 0; };
  J.flip = function (d) { page = Math.max(0, Math.min(J.mapSeen ? 2 : 1, page + d)); };

  J.draw = function (ctx, SW, SH) {
    if (!J.open) return;
    ctx.fillStyle = 'rgba(12,16,12,0.82)';
    ctx.fillRect(0, 0, SW, SH);
    const w = 640, h = 440, x = (SW - w) / 2, y = (SH - h) / 2;
    ctx.fillStyle = '#EFE9D8';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#E2DAC4';
    ctx.fillRect(x + w / 2 - 1, y, 2, h);
    ctx.strokeStyle = '#B9AE90';
    ctx.strokeRect(x + 6.5, y + 6.5, w - 13, h - 13);

    // strings tied along the top edge, each with who asked
    for (let i = 0; i < J.stringsOn.length; i++) {
      const sx = x + 60 + i * 46;
      ctx.strokeStyle = '#A85C42';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, y - 4);
      ctx.quadraticCurveTo(sx + 5, y + 8, sx - 3, y + 16);
      ctx.stroke();
      ctx.fillStyle = '#6B5A42';
      ctx.font = 'italic 11px "Alegreya", serif';
      ctx.fillText(J.stringsOn[i].who, sx - 12, y + 30);
    }

    ctx.fillStyle = '#4A4234';
    if (page === 0) {
      ctx.font = 'italic 700 20px "Vollkorn", serif';
      ctx.fillText('noticed', x + 30, y + 44);
      ctx.font = '15px "Alegreya", serif';
      const recent = J.notes.slice(-24);
      for (let i = 0; i < recent.length; i++) {
        const col = i < 12 ? 0 : 1;
        ctx.fillText('· ' + recent[i], x + 30 + col * (w / 2), y + 74 + (i % 12) * 28);
      }
      if (!J.notes.length) {
        ctx.font = 'italic 15px "Alegreya", serif';
        ctx.fillText('nothing yet. the vale is patient.', x + 30, y + 80);
      }
    } else if (page === 1) {
      ctx.font = 'italic 700 20px "Vollkorn", serif';
      ctx.fillText('kept', x + 30, y + 44);
      ctx.font = '15px "Alegreya", serif';
      let yy = y + 74;
      if (J.scarf.length) {
        ctx.fillText('the scarf, in your order:', x + 30, yy); yy += 26;
        for (let i = 0; i < J.scarf.length; i++) {
          ctx.fillStyle = J.scarf[i];
          ctx.fillRect(x + 30 + i * 26, yy - 12, 20, 14);
        }
        ctx.fillStyle = '#4A4234'; yy += 34;
      }
      for (const n of J.names) { ctx.fillText('a name: ' + n, x + 30, yy); yy += 24; }
      if (J.grim > 0) {
        yy += 8;
        ctx.font = 'italic 15px "Alegreya", serif';
        ctx.fillText('places Grim has been magnificent: ' + 'ᙢ'.repeat(Math.min(J.grim, 9)), x + 30, yy);
      }
    } else if (page === 2) {
      ctx.font = 'italic 700 20px "Vollkorn", serif';
      ctx.fillText('where you have walked', x + 30, y + 44);
      // your map: only the line your feet drew
      const sx = (w - 80) / V.layout.W, sy = (h - 90) / V.layout.H, sc = Math.min(sx, sy);
      const ox = x + w / 2 - (V.layout.W * sc) / 2, oy = y + 60;
      ctx.strokeStyle = '#8A7B5E';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < J.path.length; i++) {
        const p = J.path[i];
        const px = ox + p[0] * sc, py = oy + p[1] * sc;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#A85C42';
      const me = [V.player.x, V.player.y];
      ctx.beginPath(); ctx.arc(ox + me[0] * sc, oy + me[1] * sc, 3, 0, 6.28); ctx.fill();
      ctx.font = 'italic 13px "Alegreya", serif';
      ctx.fillStyle = '#8A7B5E';
      ctx.fillText('drawn by your feet. nothing else is on it.', x + 30, y + h - 26);
    }

    ctx.font = '12px "Alegreya Sans", sans-serif';
    ctx.fillStyle = '#8A7B5E';
    ctx.fillText('◂ ▸ pages   ·   J closes', x + w - 190, y + h - 16);
  };

  J.save = () => ({ notes: J.notes, strings: J.stringsOn, path: J.path, scarf: J.scarf, names: J.names, grim: J.grim, mapSeen: J.mapSeen });
  J.load = (s) => { if (!s) return; J.notes = s.notes || []; J.stringsOn = s.strings || []; J.path = s.path || []; J.scarf = s.scarf || []; J.names = s.names || []; J.grim = s.grim || 0; J.mapSeen = !!s.mapSeen; };
})(window.VALE);
