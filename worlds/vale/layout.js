// The lay of the vale. One river, one road that climbs; the sea at the
// bottom of the world, the unmapped at the top. All coordinates in world px.
(function (V) {
  const L = V.layout = {};

  L.W = 2600;             // world width
  L.H = 5600;             // world height; north (the head) is low y
  L.seaY = 5150;          // south of this line is the sea
  L.sketchY = 1310;       // north of this line is the next page, in pencil

  // the Wennow, head to sea
  L.river = [
    [1215, 1180], [1250, 1500], [1210, 1780], [1265, 2050], [1230, 2330],
    [1300, 2620], [1260, 2950], [1350, 3300], [1290, 3650], [1360, 4000],
    [1300, 4350], [1240, 4650], [1210, 4900], [1180, 5160],
  ];
  L.riverWidth = function (t) { return 26 + t * 66; }; // narrow gorge -> broad mouth

  // where the world holds its regions (bands + sides; lookup below)
  L.regions = {
    saltmouth: { label: 'Saltmouth' },
    cross: { label: 'Wennow Cross' },
    ridge: { label: 'Pear Ridge' },
    hushes: { label: 'the Hushes' },
    ninecats: { label: 'the Nine Cats' },
    dyeyards: { label: 'the Dye Yards' },
    locks: { label: 'the Locks' },
    steps: { label: 'the Steps' },
    head: { label: 'the Head' },
    under: { label: 'the Under' },
    sea: { label: 'the sea' },
    page: { label: 'the next page' },
  };

  L.regionAt = function (x, y) {
    if (y > L.seaY) return 'sea';
    if (y < L.sketchY) return 'page';
    if (x > 2750) return 'under';                 // the cave lives off-map east
    if (y < 1750) return 'head';
    if (y < 2380) return 'steps';
    if (y < 2950) return x > 1620 ? 'dyeyards' : 'locks';
    if (y < 3950) { if (x < 1050) return y < 3050 ? 'ninecats' : 'hushes'; return x > 1620 ? 'ridge' : 'locks'; }
    if (y < 4180 && x < 1050) return 'hushes';
    if (y < 4750) return x > 1750 ? 'ridge' : 'cross';
    return 'saltmouth';
  };
  // the moor sits NW above the wood
  const _regionAt = L.regionAt;
  L.regionAt = function (x, y) {
    if (y >= 2380 && y < 3250 && x < 1050) return 'ninecats';
    return _regionAt(x, y);
  };

  // path graph: nodes the worn ways run between; people route along these
  L.nodes = {
    landing:   [1065, 5010],
    gullhead:  [1950, 5075],
    boathouse: [880, 4960],
    coastfork: [1180, 4770],
    bell:      [1245, 4395],
    bakery:    [1140, 4330],
    ford:      [1315, 4300],
    chapel:    [1095, 4440],
    cottage:   [1170, 4210],
    ridgegate: [1560, 4240],
    milestone: [1780, 4020],
    bend:      [1985, 3745],
    watch:     [2120, 3560],
    hollowgate:[905, 3900],
    pond:      [660, 3620],
    hollow:    [520, 3310],
    greenchapel:[820, 3390],
    stones:    [620, 2650],
    fold:      [860, 2470],
    yards:     [1850, 3050],
    yardstop:  [2010, 2820],
    locks:     [1345, 2740],
    stepsfoot: [1290, 2360],
    falls:     [1235, 2085],
    herbench:  [1260, 1830],
    hut:       [1215, 1560],
    doorframe: [1225, 1395],
  };

  L.edges = [
    ['landing', 'coastfork'], ['landing', 'boathouse'], ['landing', 'gullhead'],
    ['coastfork', 'bell'], ['bell', 'bakery'], ['bell', 'ford'], ['bell', 'chapel'],
    ['bakery', 'cottage'], ['chapel', 'cottage'], ['ford', 'ridgegate'],
    ['ridgegate', 'milestone'], ['milestone', 'bend'], ['bend', 'watch'],
    ['bakery', 'hollowgate'], ['hollowgate', 'pond'], ['pond', 'hollow'],
    ['pond', 'greenchapel'], ['greenchapel', 'stones'], ['stones', 'fold'],
    ['cottage', 'locks'], ['locks', 'yards'], ['yards', 'yardstop'],
    ['bend', 'yardstop'], ['yardstop', 'locks'],
    ['locks', 'stepsfoot'], ['fold', 'locks'],
    ['stepsfoot', 'falls'], ['falls', 'herbench'], ['herbench', 'hut'], ['hut', 'doorframe'],
  ];

  // camera breath zones: stand here and the world shows itself small
  L.overlooks = [
    { x: 1985, y: 3800, r: 130, zoom: 0.34, name: 'the Bend' },
    { x: 1260, y: 1855, r: 100, zoom: 0.30, name: 'her bench' },
    { x: 620, y: 2560, r: 120, zoom: 0.5, name: 'the moor court' },
  ];

  // grassy slide faces: enter moving downhill and the hill does the rest
  L.slides = [
    { x1: 1700, y1: 3800, x2: 1990, y2: 4180, dir: [-0.45, 1] },
    { x1: 700, y1: 2950, x2: 980, y2: 3200, dir: [0.3, 1] },
  ];

  // the Under: an off-map cave band; enter at the fold, surface at the locks
  L.under = { x1: 2800, y1: 2350, x2: 3650, y2: 2760,
    enter: { x: 862, y: 2452, r: 26 }, exitAt: [1395, 2790],
    inStart: [2850, 2550], inEnd: [3600, 2560] };

  L.spawn = [1065, 5045];

  // routing: BFS over the node graph, then straight walks node to node
  L.route = function (fromId, toId) {
    if (fromId === toId) return [toId];
    const adj = {};
    for (const [a, b] of L.edges) { (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); }
    const prev = { [fromId]: null }, q = [fromId];
    while (q.length) {
      const n = q.shift();
      if (n === toId) break;
      for (const m of adj[n] || []) if (!(m in prev)) { prev[m] = n; q.push(m); }
    }
    if (!(toId in prev)) return [toId];
    const path = [];
    for (let n = toId; n; n = prev[n]) path.unshift(n);
    return path;
  };

  L.nearestNode = function (x, y) {
    let best = null, bd = 1e9;
    for (const id in L.nodes) {
      const d = V.util.dist(x, y, L.nodes[id][0], L.nodes[id][1]);
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  };
})(window.VALE);
