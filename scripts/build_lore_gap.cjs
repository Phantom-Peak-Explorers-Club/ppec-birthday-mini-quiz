const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const trails = JSON.parse(fs.readFileSync(path.join(root, 'source', 'trails.json'), 'utf8'));
// Every answer is one named person, place or system appearing in the archived description.
// The optional sentence index picks a later mention when the first gives the answer twice.
const picks = [
  ['2022-launch-2', 'Jonas', 'character'],
  ['2022-launch-4', 'Cogwright', 'character'],
  ['2022-launch-9', 'Miramine', 'place'],
  ['2022-autumn-10', 'Sam', 'character'],
  ['2022-autumn-11', 'Arrogoth', 'character'],
  ['2022-winter-6', 'Leadbelly', 'character'],
  ['2022-winter-9', 'Pax', 'character'],
  ['2023-spring-3', 'Pius', 'character'],
  ['2023-spring-8', 'Boarbark', 'character'],
  ['2023-spring-10', 'RoboDJ', 'character'],
  ['2023-summer-7', 'Terence', 'character'],
  ['2023-autumn-6', 'Aggrogoth', 'character'],
  ['2023-winter-4', 'Jumble', 'system'],
  ['2024-spring-2', 'Mason', 'character'],
  ['2024-spring-4', 'Pius', 'character'],
  ['2024-spring-9', 'Eunice', 'character'],
  ['2024-summer-3', 'Fritz', 'character'],
  ['2024-summer-4', 'Jacques', 'character'],
  ['2024-autumn-2', 'Alfonse', 'character'],
  ['2024-autumn-4', 'Bonka', 'character', 1],
  ['2024-winter-1', 'DojaPlat', 'character'],
  ['2024-winter-4', 'Todrick', 'character'],
  ['2025-summer-1', 'Kappa', 'character'],
  ['2025-summer-4', 'PeakFoot', 'character'],
  ['2025-summer-8', 'Pigbert', 'character'],
  ['2025-autumn-1', 'Temu', 'character'],
  ['2025-autumn-3', 'Blimpy', 'character'],
  ['2025-autumn-5', 'Walter', 'character'],
  ['2025-winter-5', 'Finn', 'character'],
  ['2025-winter-9', 'Horus', 'character'],
  ['2025-winter-10', 'Myne', 'character'],
  ['2025-winter-11', 'Blizzard', 'character'],
  ['2026-finale-4', 'Littlefield', 'character']
];
const pools = {
  character: 'Jonas Cogwright Sam Arrogoth Leadbelly Pax Pius Boarbark RoboDJ Terence Aggrogoth Mason Eunice Fritz Jacques Alfonse Bonka DojaPlat Todrick Kappa PeakFoot Pigbert Temu Blimpy Walter Finn Horus Myne Blizzard Littlefield Hogwood Perigate Rexford Nethersole Sparks Giffard Copper Spectre Vox Furbish RoboDoc Platman Lovehart Stickler Datchery Bellamy'.split(' '),
  place: ['Miramine', 'Miramaze', 'Summerhouse', 'Jarnia'],
  system: ['Jumble', 'Jonagraph', 'JonAssist', 'Jonavision']
};
function occurrences(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'))];
}
function hash(text) { return [...text].reduce((value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0, 0); }
const questions = picks.map(([id, answer, kind, mention = 0]) => {
  const trail = trails.find(item => item.id === id);
  if (!trail) throw Error(`Unknown trail ${id}`);
  if (occurrences(trail.title, answer).length) throw Error(`Answer visible in title: ${id}`);
  const sentences = trail.searchText.split(/(?<=[.!?])\s+/u);
  const matches = sentences.filter(sentence => occurrences(sentence, answer).length > 0);
  let excerpt = matches[mention];
  if (!excerpt || occurrences(excerpt, answer).length !== 1) throw Error(`No single hidden mention for ${id}: ${answer}`);
  if (excerpt.length < 55) {
    const index = sentences.indexOf(excerpt);
    if (index > 0) excerpt = `${sentences[index - 1]} ${excerpt}`;
  }
  if (occurrences(excerpt, answer).length !== 1) throw Error(`Answer repeated in excerpt: ${id}`);
  const clue = excerpt.replace(occurrences(excerpt, answer)[0][0], '_____');
  const candidates = pools[kind].filter(word => word !== answer && !occurrences(`${trail.title} ${excerpt}`, word).length);
  const seed = hash(id);
  candidates.sort((a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length) || hash(`${seed}:${a}`) - hash(`${seed}:${b}`));
  const options = [answer, ...candidates.slice(0, 3)];
  if (options.length !== 4 || new Set(options).size !== 4) throw Error(`Not enough choices for ${id}`);
  return {id, title: trail.title, clue, answer, options, season: trail.season, year: trail.year, seasonTitle: trail.seasonTitle};
});
fs.writeFileSync(path.join(root, 'docs', 'lore-gap.js'), `const LORE_GAP = ${JSON.stringify(questions, null, 2)};\n`);
const review = ['# Lost in the Lore clue review', '',
  'Each clue is an excerpt from the trail description in `source/trails.json`. One named character, place or system is removed. All four choices have the same type; the correct word is absent from the displayed title and the rest of the excerpt.', '',
  '| Trail | Season | Missing word | Other choices | Description excerpt |', '|---|---|---|---|---|',
  ...questions.map(q => `| ${q.title} | ${q.season} ${q.year} | **${q.answer}** | ${q.options.slice(1).join(', ')} | ${q.clue.replaceAll('|', '\\|')} |`), ''];
fs.writeFileSync(path.join(root, 'LOST-IN-THE-LORE-REVIEW.md'), review.join('\n'));
console.log(`Built ${questions.length} description clues from ${trails.length} trails.`);
