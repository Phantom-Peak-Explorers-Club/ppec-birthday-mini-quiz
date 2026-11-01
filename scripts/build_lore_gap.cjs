const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const trails = JSON.parse(fs.readFileSync(path.join(root, 'source', 'trails.json'), 'utf8'));
// Each answer and alternative is a named person, place, group or device from the archive.
// Alternatives are hand-picked to fit the specific role in the displayed sentence.
const picks = [
  ['2022-launch-2', 'Jonas', ['Giffard', 'Perigate', 'Furbish']],
  ['2022-launch-4', 'Cogwright', ['Jonas', 'Littlefield', 'Perigate']],
  ['2022-launch-9', 'Miramine', ['Miramaze', 'Summerhouse', 'JonaLabs']],
  ['2022-autumn-10', 'Resistance', ['Cooperative', 'GhoulBusters', 'JIA']],
  ['2022-autumn-11', 'Arrogoth', ['Migas', 'Pigbert', 'Omegamon']],
  ['2022-winter-6', 'Leadbelly', ['Halloway', 'Perigate', 'Stickler']],
  ['2022-winter-9', 'Pax', ['Hogwood', 'Rexford', 'Littlefield']],
  ['2023-spring-3', 'Pius', ['Brutus', 'Halloway', 'Giffard']],
  ['2023-spring-8', 'Boarbark', ['Sheldrake', 'Crow', 'Hamm']],
  ['2023-spring-10', 'RoboDJ', ['RoboDoc', 'Jonabot', 'Prostlebot']],
  ['2023-summer-7', 'Terence', ['Spectre', 'Perigate', 'Copper']],
  ['2023-autumn-6', 'Aggrogoth', ['Migas', 'Pigbert', 'Omegamon']],
  ['2023-winter-4', 'Hogwood', ['Littlefield', 'Perigate', 'Furbish']],
  ['2024-spring-2', 'Mason', ['Charles', 'Horus', 'Myne']],
  ['2024-spring-4', 'Pius', ['Halloway', 'Perigate', 'Spectre']],
  ['2024-spring-9', 'Eunice', ['Bonzo', 'Beardy', 'Boarbark']],
  ['2024-summer-3', 'Phrenograph', ['Jonagraph', 'Jonahedron', 'Videomatic']],
  ['2024-summer-4', 'Jacques', ['Rexford', 'Giffard', 'Perigate']],
  ['2024-autumn-2', 'Alfonse', ['Furbish', 'Lovehart', 'Perigate']],
  ['2024-autumn-4', 'Datchery', ['Halloway', 'Littlefield', 'Pocket']],
  ['2024-winter-1', 'DojaPlat', ['RoboDJ', 'Narvis', 'Sparks']],
  ['2024-winter-4', 'Hogwood', ['Spectre', 'Halloway', 'Perigate']],
  ['2025-summer-1', 'Kappa', ['Pius', 'Halloway', 'Brutus']],
  ['2025-summer-4', 'PeakFoot', ['Gronch', 'Wereplatypus', 'Bureausaur']],
  ['2025-summer-8', 'Pigbert', ['Chrono', 'Walter', 'Todrick']],
  ['2025-autumn-1', 'Halloway', ['Spectre', 'Datchery', 'Perigate']],
  ['2025-autumn-3', 'Copper', ['Sparks', 'Furbish', 'Perigate']],
  ['2025-autumn-5', 'Stickler', ['Copper', 'Sparks', 'Perigate']],
  ['2025-winter-5', 'Finn', ['Giffard', 'Stickler', 'Jacques']],
  ['2025-winter-9', 'Horus', ['Silver', 'Jorum', 'Winter']],
  ['2025-winter-10', 'Rexford', ['Perigate', 'Littlefield', 'Copper']],
  ['2025-winter-11', 'Blizzard', ['Kim', 'Feast', 'Knuckles']],
  ['2026-finale-4', 'Littlefield', ['Perigate', 'Datchery', 'Cogwright']]
];
function occurrences(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'))];
}
const questions = picks.map(([id, answer, alternatives]) => {
  const trail = trails.find(item => item.id === id);
  if (!trail) throw Error(`Unknown trail ${id}`);
  if (occurrences(trail.title, answer).length) throw Error(`Answer visible in title: ${id}`);
  const sentences = trail.searchText.split(/(?<=[.!?])\s+/u);
  const matches = sentences.filter(sentence => occurrences(sentence, answer).length > 0);
  let excerpt = matches[0];
  if (!excerpt || occurrences(excerpt, answer).length !== 1) throw Error(`No single hidden mention for ${id}: ${answer}`);
  if (excerpt.length < 55) {
    const index = sentences.indexOf(excerpt);
    if (index > 0) excerpt = `${sentences[index - 1]} ${excerpt}`;
  }
  if (occurrences(excerpt, answer).length !== 1) throw Error(`Answer repeated in excerpt: ${id}`);
  const clue = excerpt.replace(occurrences(excerpt, answer)[0][0], '_____');
  const options = [answer, ...alternatives];
  if (options.length !== 4 || new Set(options).size !== 4) throw Error(`Invalid choices for ${id}`);
  for (const word of options) {
    if (!/^[\p{L}][\p{L}\p{N}]*$/u.test(word)) throw Error(`Choice must be one word: ${word}`);
    if (word !== answer && occurrences(`${trail.title} ${excerpt}`, word).length) throw Error(`Choice visible in clue: ${id}: ${word}`);
    if (!trails.some(item => occurrences(JSON.stringify(item), word).length)) throw Error(`Choice not in trail archive: ${id}: ${word}`);
  }
  return {id, title: trail.title, clue, answer, options, season: trail.season, year: trail.year, seasonTitle: trail.seasonTitle};
});
fs.writeFileSync(path.join(root, 'docs', 'lore-gap.js'), `const LORE_GAP = ${JSON.stringify(questions, null, 2)};\n`);
const review = ['# Lost in the Lore! clue review', '',
  'Each clue is an excerpt from the trail description in `source/trails.json`. One named character, place, group or device is removed. The three hand-picked alternatives fit the role in that sentence. All four words appear in the trail archive; the correct word is absent from the displayed title and the rest of the excerpt.', '',
  '| Trail | Season | Missing word | Other choices | Description excerpt |', '|---|---|---|---|---|',
  ...questions.map(q => `| ${q.title} | ${q.season} ${q.year} | **${q.answer}** | ${q.options.slice(1).join(', ')} | ${q.clue.replaceAll('|', '\\|')} |`), ''];
fs.writeFileSync(path.join(root, 'LOST-IN-THE-LORE-REVIEW.md'), review.join('\n'));
console.log(`Built ${questions.length} description clues from ${trails.length} trails.`);
