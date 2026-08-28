// Bundles the vale into one HTML file for hosting anywhere a single page
// can live. No build step was harmed: this is literal concatenation in the
// index.html script order, which the namespace design exists to allow.
// Run: node tools/bundle.js [outPath]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

let js = '';
for (const s of srcs) {
  js += '\n// ==== ' + s + ' ====\n' + fs.readFileSync(path.join(ROOT, s), 'utf8');
}

const out = `<title>somewhere</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..800;1,400..800&family=Vollkorn:ital,wght@0,400..900;1,400..900&display=swap">
<style>
  html, body { margin: 0; height: 100%; background: #10150f; overflow: hidden; }
  #stage { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
  canvas { image-rendering: auto; touch-action: none; }
</style>
<div id="stage"><canvas id="game"></canvas></div>
<script>
${js}
</script>
`;

const dest = process.argv[2] || path.join(ROOT, 'dist-somewhere.html');
fs.writeFileSync(dest, out);
console.log('bundled ' + srcs.length + ' files -> ' + dest + ' (' + Math.round(out.length / 1024) + ' KB)');
