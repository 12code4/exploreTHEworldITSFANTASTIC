// The first system built, per the philosophy. One world day = 24 real
// minutes; a world hour = 60 real seconds. Time persists across sessions
// and nothing anywhere keys off "progress".
(function (V) {
  const C = V.clock = {};
  const DAY = 24 * 60; // seconds per world day

  C.t = 7.4 * 60;      // world seconds since midnight; arrival is mid-morning
  C.day = 1;           // counts up forever; seeds daily variety

  C.hour = () => C.t / 60;
  C.phase = function () {
    const h = C.hour();
    if (h < 5) return 'night';
    if (h < 8) return 'dawn';
    if (h < 11.8) return 'morning';
    if (h < 12.4) return 'noon';
    if (h < 17.5) return 'afternoon';
    if (h < 20.5) return 'dusk';
    return 'night';
  };

  C.update = function (dt, sitting) {
    const rate = sitting ? 2.2 : 1;  // sitting lets the day pour past gently
    C.t += dt * rate;
    if (C.t >= DAY) { C.t -= DAY; C.day++; C.onNewDay && C.onNewDay(); }
  };

  // daily seeded facts: weather, moon, small variety. Deterministic per day.
  C.daily = function () {
    const r = V.util.mulberry(C.day * 7919 + 31);
    const roll = r();
    const d = {
      mistMorning: roll < 0.3,
      rain: roll > 0.3 && roll < 0.42,
      rainStart: 10 + r() * 6, rainLen: 1.2 + r() * 2,
      greenEvening: r() < 0.05,           // rare; never explained
      greenStart: 18.6 + r() * 1.2,
      eelRun: r() < 0.35, eelStart: 19 + r() * 1.2,
      fullMoon: C.day % 8 === 3,          // lantern nights, moonbows
      market: C.day % 6 === 2,
    };
    return d;
  };

  C.weatherNow = function () {
    const d = C.daily(), h = C.hour();
    if (d.rain && h > d.rainStart && h < d.rainStart + d.rainLen) return 'rain';
    if (d.mistMorning && h > 5.4 && h < 9.2) return 'mist';
    return 'clear';
  };

  C.greenNow = function () {
    const d = C.daily(), h = C.hour();
    return d.greenEvening && h > d.greenStart && h < d.greenStart + 0.025; // ~90s
  };

  C.save = () => ({ t: C.t, day: C.day });
  C.load = (s) => { if (s) { C.t = s.t; C.day = s.day; } };
})(window.VALE);
