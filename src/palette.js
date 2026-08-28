// The color script, as data — worlds/vale/COLOR.md is the authority.
// Keys are named; the light pass grades between them by hour and weather.
(function (V) {
  const P = V.palette = {};

  P.keys = {
    moss:    { land: '#5E6F50', landHi: '#7C8F66', landLo: '#46543E', ink: '#2A3328', milk: '#EFF3EA', water: '#7C94A0', waterDeep: '#5C7482', lamp: '#E5B84E', bark: '#4A3E2E', path: '#B9A97C', sand: '#D8C9A0' },
    blossom: { petal: '#F4C7D4', campion: '#E7A9C4', foxglove: '#C9A0DC', lavender: '#B9AEDC', cream: '#FBF1DC', butter: '#F6E19A', leafmilk: '#CFE3C0' },
    fair:    { madder: '#D4586B', woad: '#4A6FA5', weld: '#E3B93E', orchil: '#8E5A9E', walnut: '#6B4A32', verdigris: '#4E8A73', undyed: '#F6EFE2' },
    prismDay:  ['#FF9AA2', '#FFC48C', '#FFF3A0', '#B8E8A0', '#9AD8E8', '#A8B4F0', '#D8A8E8'],
    prismDeep: ['#E84E6A', '#F0A03C', '#F2D848', '#58B87A', '#4A9AD8', '#7A6AE0', '#B858C8'],
    night:   { ground: '#131A16', teal: '#16302E', violet: '#2A2440', lamp: '#FFD97A', firefly: '#BFF0C8', green: '#A8C878' },
    heather: '#8E6E9E',
  };

  // hour -> sky/grade stops. Hours are world hours 0..24.
  const GRADES = [
    { h: 0,    sky: '#0A1014', top: '#080E14', horizon: '#121E1A', tint: '#0A1018', tintA: 0.58, warm: 0 },
    { h: 4.5,  sky: '#0E181A', top: '#0B141A', horizon: '#1A2822', tint: '#0C161E', tintA: 0.52, warm: 0 },
    { h: 6,    sky: '#C7CFC2', top: '#9FB4B8', horizon: '#F4CBA8', tint: '#F4CBA8', tintA: 0.16, warm: 0.35 },
    { h: 8,    sky: '#DCE7DC', top: '#BFD3D6', horizon: '#F2E3B6', tint: '#F6EFD8', tintA: 0.07, warm: 0.15 },
    { h: 12,   sky: '#E8EFE4', top: '#CFE0E4', horizon: '#EFF3EA', tint: '#FFFFFF', tintA: 0.0,  warm: 0 },
    { h: 16,   sky: '#E2EAD8', top: '#C9DBD8', horizon: '#F2E7C4', tint: '#F6E8C0', tintA: 0.06, warm: 0.12 },
    { h: 18.5, sky: '#D8C9B0', top: '#A8B2B8', horizon: '#F0C482', tint: '#E8B978', tintA: 0.20, warm: 0.55 },
    { h: 20,   sky: '#5C6470', top: '#3A4450', horizon: '#8E6E5E', tint: '#4A4258', tintA: 0.30, warm: 0.1 },
    { h: 21.5, sky: '#141C22', top: '#0E161E', horizon: '#20282A', tint: '#0E161E', tintA: 0.55, warm: 0 },
    { h: 24,   sky: '#0A1014', top: '#080E14', horizon: '#121E1A', tint: '#0A1018', tintA: 0.58, warm: 0 },
  ];

  P.grade = function (hour) {
    let a = GRADES[0], b = GRADES[GRADES.length - 1];
    for (let i = 0; i < GRADES.length - 1; i++) {
      if (hour >= GRADES[i].h && hour <= GRADES[i + 1].h) { a = GRADES[i]; b = GRADES[i + 1]; break; }
    }
    const t = V.util.ease((hour - a.h) / Math.max(0.001, b.h - a.h));
    const mix = V.util.mix;
    return {
      sky: mix(a.sky, b.sky, t), top: mix(a.top, b.top, t), horizon: mix(a.horizon, b.horizon, t),
      tint: mix(a.tint, b.tint, t), tintA: V.util.lerp(a.tintA, b.tintA, t), warm: V.util.lerp(a.warm, b.warm, t),
    };
  };

  P.isNightHour = (h) => h < 5.2 || h > 20.6;
  P.duskness = function (h) { // 0 by day, 1 deep night, soft ramps
    if (h >= 6.5 && h <= 18.5) return 0;
    if (h > 18.5 && h < 21) return (h - 18.5) / 2.5;
    if (h >= 21 || h < 4.5) return 1;
    return 1 - (h - 4.5) / 2;
  };
})(window.VALE);
