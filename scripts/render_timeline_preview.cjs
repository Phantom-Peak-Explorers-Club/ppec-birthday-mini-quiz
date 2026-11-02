const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');
const htmlPath = path.join(docs, '.timeline-preview.html');
const mobile = process.argv.includes('--mobile');
const output = path.join(root, 'design-previews', mobile ? 'fun-with-blue-diamant-mobile-preview.png' : 'fun-with-blue-diamant-game-preview.png');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ppec-timeline-preview-'));
const html = fs.readFileSync(path.join(docs, 'index.html'), 'utf8').replace('</body>',
  `<script>window.addEventListener('load',()=>start('timeline','quiz'))</script></body>`);

try {
  fs.writeFileSync(htmlPath, html);
  const url = 'file:///' + htmlPath.replaceAll('\\', '/');
  const result = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${mobile ? '500,900' : '1280,1200'}`,
    '--virtual-time-budget=5000', `--user-data-dir=${profile}`,
    `--screenshot=${output}`, url
  ], { encoding: 'utf8', timeout: 30000 });
  if (result.status !== 0 || !fs.existsSync(output)) {
    throw new Error(`Chrome render failed: ${result.stderr || result.stdout || result.error || result.status}`);
  }
  console.log(output);
} finally {
  fs.rmSync(htmlPath, { force: true });
  if (profile.startsWith(path.join(os.tmpdir(), 'ppec-timeline-preview-'))) {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}
