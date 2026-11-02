const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ppec-portal-preview-'));
const output = path.join(root, 'design-previews', 'portal-jumble-sample.png');
const url = 'file:///' + path.join(root, 'docs', 'index.html').replaceAll('\\', '/');
try {
  const result = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--window-size=1200,1000', '--force-device-scale-factor=1',
    '--virtual-time-budget=2500', `--user-data-dir=${profile}`,
    `--screenshot=${output}`, url
  ], { encoding: 'utf8', timeout: 30000 });
  if (result.status !== 0 || !fs.existsSync(output)) {
    throw new Error(`Chrome render failed: ${result.stderr || result.stdout || result.error || result.status}`);
  }
  console.log(output);
} finally {
  if (profile.startsWith(path.join(os.tmpdir(), 'ppec-portal-preview-'))) {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}
