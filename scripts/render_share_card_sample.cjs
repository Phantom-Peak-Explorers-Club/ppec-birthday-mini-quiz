const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = path.resolve(__dirname, '..');
const docs = path.join(repo, 'docs');
const app = fs.readFileSync(path.join(docs, 'app.js'), 'utf8');
const themes = app.match(/const GAME_THEMES=\{[\s\S]*?\n\};/)?.[0];
const draw = app.match(/async function drawShareCard\(\)\{[\s\S]*?\n\}\n(?=function prepareShareCard)/)?.[0];
if (!themes || !draw) throw new Error('Could not locate the share card renderer in docs/app.js');

const game = process.argv[2] || 'catchphrase';
const names = {
  anagrams: 'Littlefield’s Letters', catchphrase: 'Peak-a-Boo', vowels: 'Vowel of Silence',
  trails: 'Trail and Error', platy: 'Save-A-Platy', blanks: 'Blankety Peak', lore: 'Lost in the Lore',
  timeline: 'Fun With Blue Diamant', lead: 'Whose Trail Is It Anyway?',
  jumble: 'Jonabot Jr’s Jumble Challenge'
};
if (!names[game]) throw new Error(`Unknown game: ${game}`);

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chrome)) throw new Error('Google Chrome is required for the sample render');
const output = path.join(repo, 'design-previews', `share-card-${game}-sample.png`);
const htmlPath = path.join(docs, '.share-card-sample.html');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ppec-share-preview-'));
const sample = {
  game, challenge: game === 'jumble', mode: 'unlimited', points: game === 'catchphrase' ? 47 : 0,
  score: game === 'catchphrase' ? 3 : 8, completed: 10, elapsedMs: 123000
};
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;src:url('./assets/fonts/fraunces-latin-variable.woff2') format('woff2');font-weight:100 900}
html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:#000}canvas{display:block}
</style></head><body><script>
${themes}
const state=${JSON.stringify(sample)};
function gameName(){return ${JSON.stringify(names[game])}}
function modeName(){return 'Unlimited'}
function duration(){return '2:03'}
${draw}
window.addEventListener('load',async()=>{document.body.appendChild(await drawShareCard())});
</script></body></html>`;

try {
  fs.writeFileSync(htmlPath, html);
  const url = 'file:///' + htmlPath.replaceAll('\\', '/');
  const result = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1080,1080',
    '--virtual-time-budget=5000', `--user-data-dir=${profile}`,
    `--screenshot=${output}`, url
  ], { encoding: 'utf8', timeout: 30000 });
  if (result.status !== 0 || !fs.existsSync(output)) {
    throw new Error(`Chrome render failed: ${result.stderr || result.stdout || result.error || result.status}`);
  }
  console.log(output);
} finally {
  fs.rmSync(htmlPath, { force: true });
  if (profile.startsWith(path.join(os.tmpdir(), 'ppec-share-preview-'))) {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}
