const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'docs', 'app.js'), 'utf8');
const { ANAGRAMS, MISSING_VOWELS } = vm.runInNewContext(source.split('const $=')[0] + ';({ANAGRAMS,MISSING_VOWELS})');
const vowels = answer => answer.replace(/[AEIOU]/g, '');
const distinctClues = new Set(MISSING_VOWELS.map(q => vowels(q.answer).replace(/[^A-Z]/g, ''))).size;

const lines = [
  '# Phantom Peak clue bank',
  '',
  `The app currently has **${ANAGRAMS.length} anagrams** and **${MISSING_VOWELS.length} Vowel of Silence answers** forming **${distinctClues} distinct clues**. The first ten anagrams below are the exact PPEC 4th Birthday quiz questions; the other scrambles are generated from selected names, places, and lore terms. A ten-question anagram round draws 2 easy, 3 medium, 3 hard, and 2 expert clues.`,
  '',
  'The source pool includes the supplied `Backup Quiz PPT.pptx`, [PPEC Trail Notes](https://ppec.club/trail-notes/) (`trails.json` in the local checkout), and [Phantom Peak’s published map](https://www.phantompeak.com/media/daghhwvt/phantom-peak-map-jonacon.pdf). These sources cover characters, places, organizations, objects, currency, and named concepts. Check any new Discord submission for spelling and attribution before adding it.',
  '',
  'The user and PPEC Trail Notes spell the talking platypus **Terence**. Phantom Peak’s [bookings deck](https://www.phantompeak.com/media/q52ll0ty/phantom-peak-corp-bookings-deck.pdf) spells it **Terrence**. The letter games use **Terence** so their clue letters match the requested and archive spelling.',
  '',
  '## Anagrams',
  ''
];
for (const [tier, label] of [[1, 'Easy'], [2, 'Medium'], [3, 'Hard'], [4, 'Expert']]) {
  lines.push(`### ${label} (tier ${tier})`, '', '| Scramble | Answer |', '|---|---|');
  for (const q of ANAGRAMS.filter(q => q.tier === tier)) lines.push(`| ${q.scramble} | ${q.answer} |`);
  lines.push('');
}
lines.push('## Vowel of Silence', '', 'Answers with the same consonants share one question. The game shows only the primary answer’s letter count while accepting any matching answer in its full answer bank. For example, `JNCN` shows **8 letters** for the primary answer **JONACOIN**, but also accepts **JONACON**.', '', '| Clue | Answer |', '|---|---|');
for (const q of MISSING_VOWELS) lines.push(`| ${vowels(q.answer)} | ${q.answer} |`);
lines.push('', 'Add an optional `contributor` field to any question in `docs/app.js` when the contributor agrees to be credited. Catchphrase answer leniency applies automatically to all future picture clues; letter game answers remain exact.');
fs.writeFileSync(path.join(root, 'CLUE-BANK.md'), lines.join('\n') + '\n');
