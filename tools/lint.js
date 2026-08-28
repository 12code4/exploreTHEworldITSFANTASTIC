// The Interrogation, runnable: loads the world's content files against a
// stub engine and audits them. Run: node tools/lint.js
// Fails loudly on: missing whys, apostrophe-broken strings (syntax), lines
// that break the Text Box Law, banned theme words, duplicate ids.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BANNED = /\b(fantastic|wonder|wondrous|mysterious|mystery|magical|explore|exploring)\b/i;

const problems = [];
const objects = [];
const people = [];

// --- stub engine ---
const V = {
  util: { mulberry: (a) => () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }, dist: (a,b,c,d)=>Math.hypot(c-a,d-b), hash2: () => 0.5, clamp:(v,a,b)=>v, lerp:(a)=>a },
  layout: null, // filled by real layout below
  hooks: [],
  data: {},
  objects: {
    place(def) {
      if (!def.why || typeof def.why !== 'string' || def.why.length < 24) {
        problems.push('WHY MISSING/THIN: object "' + (def.id || def.kind) + '"');
      }
      def.x = def.at ? def.at[0] : 0; def.y = def.at ? def.at[1] : 0;
      objects.push(def); return def;
    },
    byId: (id) => objects.find((o) => o.id === id),
    list: objects,
    nearest: () => null,
  },
  people: {
    register(def) {
      if (!def.why || def.why.length < 24) problems.push('WHY MISSING/THIN: person "' + def.id + '"');
      people.push(def);
    },
    byId: (id) => people.find((p) => p.id === id),
    list: people,
    nearest: () => null,
    talk: () => {}, draw: () => {}, update: () => {}, newDay: () => {},
  },
  painter: { addField: () => {}, fields: [] },
  particles: { add: () => {}, emitters: [] },
  lightpass: { add: () => {}, sources: [] },
  terrain: { addSolid: () => {}, solids: [], nearPath: () => 99, water: () => 0, blocked: () => false, elevation: () => 0, slope: () => ({dx:0,dy:0,mag:0}), riverDist: () => 999, hitSolid: () => false },
  clock: { hour: () => 12, day: 1, phase: () => 'noon', daily: () => ({}), weatherNow: () => 'clear', greenNow: () => false, t: 0 },
  wind: { time: () => 0, at: () => ({x:0,y:0,mag:0}), sway: () => 0, update: () => {} },
  palette: { keys: { moss:{}, blossom:{}, fair:{}, night:{}, prismDay:[], prismDeep:[], heather:'#8E6E9E' }, grade: () => ({}), duskness: () => 0, isNightHour: () => false },
  journal: { note: () => {}, learnName: () => {}, tie: () => {}, untie: () => {}, scarf: [], names: [], grim: 0, mapSeen: false, trackPath: () => {}, notes: [] },
  textbox: { say: () => {}, ask: () => {}, active: () => false },
  state: { flags: {}, toast: () => {} },
  asks: { open: () => {}, resolve: () => {}, isOpen: () => false, isDone: () => false },
  audio: { bell: () => {}, tuneFragment: () => {}, tuneWhole: () => {}, start: () => {}, update: () => {} },
  showpieces: { lampOn: () => false },
  player: { x: 0, y: 0 },
  camera: { view: () => ({x:0,y:0,w:0,h:0}) },
};

const sandbox = { window: { VALE: V }, document: { createElement: () => ({ getContext: () => new Proxy({}, { get: () => () => {} }), width: 0, height: 0 }) }, Math, console };
vm.createContext(sandbox);

function run(file) {
  const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
  try { vm.runInContext(code, sandbox, { filename: file }); }
  catch (e) { problems.push('LOAD FAILED: ' + file + ' — ' + e.message); }
}

// layout first (real one), then content
run('worlds/vale/layout.js');
V.layout = sandbox.window.VALE.layout;
const placeFiles = fs.readdirSync(path.join(ROOT, 'worlds/vale/places')).filter((f) => f.endsWith('.js'));
const peopleFiles = fs.readdirSync(path.join(ROOT, 'worlds/vale/people')).filter((f) => f.endsWith('.js'));
for (const f of placeFiles) run('worlds/vale/places/' + f);
for (const f of peopleFiles) run('worlds/vale/people/' + f);

// --- audits ---
const ids = new Set();
for (const o of objects) {
  if (o.id) { if (ids.has(o.id)) problems.push('DUPLICATE ID: ' + o.id); ids.add(o.id); }
  const texts = [].concat(o.gaze || []).concat(o.talkLines || []);
  for (const t of texts) auditLine(t, 'object ' + (o.id || o.kind));
  // river check: object dead-center in the channel (allow gates & offshore)
  if (o.at && o.kind !== 'heron' && !/gate|stone|rock/.test(o.kind || '') && o.variant !== 'gate') {
    const y = o.at[1];
    if (y < 5150) {
      const L = V.layout;
      let best = 1e9, bt = 0;
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const idx = t * (L.river.length - 1);
        const a = L.river[Math.floor(idx)], b = L.river[Math.min(L.river.length - 1, Math.floor(idx) + 1)];
        const f = idx - Math.floor(idx);
        const px = a[0] + (b[0] - a[0]) * f, py = a[1] + (b[1] - a[1]) * f;
        const d = Math.hypot(px - o.at[0], py - o.at[1]);
        if (d < best) { best = d; bt = t; }
      }
      if (best < L.riverWidth(bt) * 0.4) problems.push('IN THE RIVER: ' + (o.id || o.kind) + ' at ' + o.at);
    }
  }
}
for (const p of people) {
  if (p.id) { if (ids.has(p.id)) problems.push('DUPLICATE ID: ' + p.id); ids.add(p.id); }
  const banks = p.lines || {};
  for (const k in banks) for (const l of banks[k]) auditLine(l, p.id + '.' + k);
  for (const a of p.asks || []) {
    for (const b of a.boxes || []) auditLine(b, p.id + '.ask.' + a.id);
    for (const b of a.resolveBoxes || []) auditLine(b, p.id + '.resolve.' + a.id);
  }
}

function auditLine(t, whoWhere) {
  if (typeof t !== 'string') return;
  const isStage = t.startsWith('(') && t.endsWith(')');
  const sentences = t.split(/[.!?]+\s/).filter((s) => s.trim().length);
  if (!isStage && sentences.length > 3 && t.length > 90) problems.push('TEXT BOX TOO FULL (' + sentences.length + ' sentences): [' + whoWhere + '] "' + t.slice(0, 60) + '..."');
  if (t.length > 160) problems.push('TEXT BOX TOO LONG (' + t.length + ' chars): [' + whoWhere + ']');
  if (BANNED.test(t) && !whoWhere.startsWith('wick')) problems.push('BANNED WORD: [' + whoWhere + '] "' + t.slice(0, 70) + '"');
}

console.log('objects: ' + objects.length + '   people: ' + people.length + '   hooks: ' + V.hooks.length);
if (problems.length) {
  console.log('\nTHE INTERROGATION FOUND ' + problems.length + ' PROBLEM(S):');
  for (const p of problems) console.log('  ✕ ' + p);
  process.exit(1);
} else {
  console.log('The Interrogation is satisfied. Everything can say why it is here.');
}
