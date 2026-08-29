// The Text Box Law, enforced at the renderer: one small window, short
// lines, a name, a typewriter tick. The only interface the vale owns
// besides the journal — and asks are answered with a nod or a shake.
(function (V) {
  const T = V.textbox = {};
  let queue = [], showing = null, chars = 0, done = null, armed = 0;
  let asking = null; // {yes, no, choice: 0|1}

  T.active = () => !!showing;

  T.say = function (name, boxes, onDone) {
    queue = boxes.map((b) => ({ name, text: b }));
    done = onDone || null;
    next();
  };

  // an ask: last box becomes a nod / shake choice
  T.ask = function (name, boxes, onYes, onNo) {
    queue = boxes.map((b) => ({ name, text: b }));
    queue[queue.length - 1].isAsk = true;
    asking = { yes: onYes, no: onNo, choice: 0 };
    done = null;
    next();
  };

  function next() {
    showing = queue.shift() || null;
    chars = 0; armed = 0;
    if (!showing && done) { const d = done; done = null; d(); }
  }

  T.advance = function () {
    if (!showing) return;
    if (chars < showing.text.length) { chars = showing.text.length; armed = 0; return; }
    if (showing.isAsk && asking && armed < 0.3) return; // a nod takes a breath; mashing can't promise
    if (showing.isAsk && asking) {
      const a = asking; asking = null;
      const yes = a.choice === 0;
      showing = null;
      (yes ? a.yes : a.no) && (yes ? a.yes : a.no)();
      return;
    }
    next();
  };

  T.left = function () { if (asking && showing && chars >= showing.text.length) asking.choice = 0; };
  T.right = function () { if (asking && showing && chars >= showing.text.length) asking.choice = 1; };
  T.isAsking = () => !!(asking && showing && chars >= (showing.text || '').length);
  T.choose = function (i) { if (asking) asking.choice = i; };

  T.update = function (dt) {
    if (showing && chars < showing.text.length) chars += dt * 60;
    else if (showing) armed += dt;
  };

  T.draw = function (ctx, SW, SH) {
    if (!showing) return;
    const w = Math.min(640, SW - 60), h = 88;
    const x = (SW - w) / 2, y = SH - h - 26;
    ctx.fillStyle = 'rgba(20,26,20,0.88)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6); else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,244,236,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 4.5, y + 4.5, w - 9, h - 9);
    if (showing.name) {
      ctx.fillStyle = '#E5B84E';
      ctx.font = '700 13px "Alegreya Sans", sans-serif';
      ctx.fillText(showing.name.toUpperCase(), x + 18, y - 6);
    }
    ctx.fillStyle = '#EFF3EA';
    ctx.font = '18px "Alegreya", Georgia, serif';
    const text = showing.text.slice(0, Math.floor(chars));
    wrap(ctx, text, x + 18, y + 30, w - 36, 24);
    if (chars >= showing.text.length) {
      if (showing.isAsk && asking) {
        ctx.font = '700 15px "Alegreya Sans", sans-serif';
        const oy = y + h - 18;
        ctx.fillStyle = asking.choice === 0 ? '#E5B84E' : 'rgba(240,244,236,0.5)';
        ctx.fillText('◈ nod', x + w - 170, oy);
        ctx.fillStyle = asking.choice === 1 ? '#E5B84E' : 'rgba(240,244,236,0.5)';
        ctx.fillText('◈ shake your head', x + w - 118, oy);
      } else {
        ctx.fillStyle = 'rgba(240,244,236,' + (0.4 + Math.sin(V.wind.time() * 4) * 0.3) + ')';
        ctx.beginPath();
        ctx.moveTo(x + w - 20, y + h - 14);
        ctx.lineTo(x + w - 12, y + h - 14);
        ctx.lineTo(x + w - 16, y + h - 8);
        ctx.fill();
      }
    }
  };

  function wrap(ctx, text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '', yy = y;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW) { ctx.fillText(line, x, yy); line = w; yy += lh; }
      else line = t;
    }
    ctx.fillText(line, x, yy);
  }
})(window.VALE);
