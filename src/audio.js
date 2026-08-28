// Everything synthesized, nothing sampled: wind is filtered noise, the
// river is noise with motion, the bell is an FM strike with its flat third,
// and the vale's one tune assembles from fragments until the last page.
(function (V) {
  const A = V.audio = {};
  let ac = null, master = null, started = false, muted = false;
  let windGain, riverGain, seaGain, windFilter;
  let lastBellHour = -1;

  A.start = function () {
    if (started) return;
    started = true;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);

    const noise = (len) => {
      const b = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return b;
    };
    const loopNoise = () => {
      const s = ac.createBufferSource();
      s.buffer = noise(3); s.loop = true; s.start();
      return s;
    };

    // wind
    const w = loopNoise();
    windFilter = ac.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 300; windFilter.Q.value = 0.6;
    windGain = ac.createGain(); windGain.gain.value = 0.05;
    w.connect(windFilter); windFilter.connect(windGain); windGain.connect(master);

    // river
    const r = loopNoise();
    const rf = ac.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 1400;
    riverGain = ac.createGain(); riverGain.gain.value = 0;
    r.connect(rf); rf.connect(riverGain); riverGain.connect(master);

    // sea
    const s = loopNoise();
    const sf = ac.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 340;
    seaGain = ac.createGain(); seaGain.gain.value = 0;
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.11;
    const lfoG = ac.createGain(); lfoG.gain.value = 0.05;
    lfo.connect(lfoG); lfoG.connect(seaGain.gain); lfo.start();
    s.connect(sf); sf.connect(seaGain); seaGain.connect(master);
  };

  A.mute = function () { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.5; return muted; };

  function ping(freq, t0, dur, gain, type) {
    const o = ac.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.1);
  }

  // the hour bell: struck once per hour count; its third rings flat (the crack)
  A.bell = function (count) {
    if (!ac || muted) return;
    const base = 392; // G
    for (let i = 0; i < count; i++) {
      const t0 = ac.currentTime + i * 0.9;
      const flat = (i % 8 === 2) ? 0.972 : 1; // the third of each phrase sags
      ping(base * flat, t0, 2.2, 0.16, 'sine');
      ping(base * 2.02 * flat, t0, 1.1, 0.05, 'sine');
      ping(base * 2.94, t0, 0.5, 0.03, 'triangle');
    }
  };

  // the tune: one melody, surfacing in fragments; whole only past the frame
  const TUNE = [0, 3, 5, 7, 5, 3, 0, -2, 0, 7, 8, 7, 5, 3, 5, 0];
  A.tuneFragment = function (from, n, tempo) {
    if (!ac || muted) return;
    const base = 330;
    for (let i = 0; i < n; i++) {
      const semi = TUNE[(from + i) % TUNE.length];
      ping(base * Math.pow(2, semi / 12), ac.currentTime + i * (tempo || 0.32), 0.5, 0.06, 'triangle');
    }
  };
  A.tuneWhole = function () {
    if (!ac || muted) return;
    const base = 330;
    for (let i = 0; i < TUNE.length; i++) {
      ping(base * Math.pow(2, TUNE[i] / 12), ac.currentTime + i * 0.34, 0.7, 0.08, 'triangle');
      if (i % 4 === 0) ping(base / 2 * Math.pow(2, TUNE[i] / 12), ac.currentTime + i * 0.34, 1.2, 0.04, 'sine');
    }
  };

  // birdsong: little grain chirps, denser in the wood by day
  let birdT = 0;
  A.update = function (dt) {
    if (!ac || muted) return;
    const p = V.player, h = V.clock.hour();
    const w = V.wind.at(p.x, p.y);
    windGain.gain.value = 0.03 + w.mag * 0.05;
    windFilter.frequency.value = 260 + w.mag * 320;
    const rd = V.util.nearestOnSpline(V.layout.river, p.x, p.y, 60).d;
    riverGain.gain.value = Math.max(0, 0.11 - rd / 2600);
    seaGain.gain.value = Math.max(0, (p.y - 4300) / 900) * 0.1;

    // bell on the hour, struck by whoever is nearest (usually the vale itself)
    const hourNow = Math.floor(h);
    if (hourNow !== lastBellHour && hourNow >= 6 && hourNow <= 20) {
      lastBellHour = hourNow;
      const strikes = ((hourNow + 11) % 12) + 1;
      if (V.state.flags.longNoon && hourNow === 12) A.bell(13); else A.bell(Math.min(strikes, 8));
    }

    birdT -= dt;
    if (birdT <= 0 && h > 5.5 && h < 20 && V.clock.weatherNow() !== 'rain') {
      const inWood = V.layout.regionAt(p.x, p.y) === 'hushes';
      birdT = (inWood ? 1.2 : 3.5) + Math.random() * 4;
      const f = 2200 + Math.random() * 2200;
      ping(f, ac.currentTime, 0.09, 0.03, 'sine');
      ping(f * 1.3, ac.currentTime + 0.09, 0.07, 0.025, 'sine');
      if (Math.random() < 0.3) ping(f * 0.8, ac.currentTime + 0.18, 0.1, 0.02, 'sine');
    }
  };
})(window.VALE);
