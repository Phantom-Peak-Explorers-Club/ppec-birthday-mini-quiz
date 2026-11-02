const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');
const htmlPath = path.join(docs, '.timeline-preview.html');
const mobile = process.argv.includes('--mobile');
const game = process.argv.find(arg => arg.startsWith('--game='))?.slice(7) || 'timeline';
const tutorial = process.argv.find(arg => arg.startsWith('--tutorial='))?.slice(11);
const tutorialSteps = Number(process.argv.find(arg => arg.startsWith('--step='))?.slice(7) || 0);
const portal = process.argv.includes('--portal');
if (!['timeline', 'blanks'].includes(game) && !tutorial) throw new Error(`Unsupported preview game: ${game}`);
if (tutorial && !['anagrams', 'catchphrase', 'vowels', 'trails', 'platy', 'blanks', 'lore', 'timeline'].includes(tutorial)) throw new Error(`Unsupported tutorial: ${tutorial}`);
if (!Number.isInteger(tutorialSteps) || tutorialSteps < 0 || tutorialSteps > 2) throw new Error('Preview step must be 0, 1 or 2');
const answer = process.argv.find(arg => arg.startsWith('--answer='))?.slice(9);
if (answer && (game !== 'timeline' || tutorial || portal || !['correct', 'incorrect'].includes(answer))) throw new Error('Feedback preview requires timeline and correct or incorrect');
const name = game === 'timeline' ? 'fun-with-blue-diamant' : 'blankety-peak';
const output = path.join(root, 'design-previews', portal ? `tutorial-portal-${mobile ? 'mobile' : 'desktop'}.png` : tutorial ? `tutorial-${tutorial}${tutorialSteps ? `-step-${tutorialSteps + 1}` : ''}-${mobile ? 'mobile' : 'desktop'}.png` : `${name}-${answer ? `${answer}-feedback` : mobile ? 'mobile' : 'game'}-preview.png`);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ppec-timeline-preview-'));
const startScript = portal ? '' : tutorial ? `document.querySelector('[data-tutorial="${tutorial}"]').click();for(let i=0;i<${tutorialSteps};i++)document.querySelector('#tutorial-next').click()` : answer
  ? `start('timeline','quiz');const right=state.questions[0].answer;[...document.querySelectorAll('#timeline-choices button')].find(button=>button.dataset.answer${answer === 'correct' ? '===' : '!=='}right).click()`
  : `start('${game}','quiz')`;
const html = fs.readFileSync(path.join(docs, 'index.html'), 'utf8').replace('</body>',
  `<script>window.addEventListener('load',()=>{${startScript}})</script></body>`);

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
