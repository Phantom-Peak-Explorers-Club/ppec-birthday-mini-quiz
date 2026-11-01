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
  ['2022-autumn-10', 'The Resistance', ['The Cooperative', 'The GhoulBusters', 'The JIA']],
  ['2022-autumn-11', 'Arrogoth', ['Migas', 'Pigbert', 'Omegamon']],
  ['2022-winter-6', 'Leadbelly', ['Halloway', 'Perigate', 'Stickler']],
  ['2022-winter-9', 'Pax', ['Hogwood', 'Rexford', 'Littlefield']],
  ['2023-spring-3', 'Pius', ['Brutus', 'Halloway', 'Giffard']],
  ['2023-spring-8', 'Boarbark', ['Sheldrake', 'Crow', 'Hamm']],
  ['2023-spring-10', 'RoboDJ', ['RoboDoc', 'Jonabot', 'Prostlebot']],
  ['2023-summer-7', 'Terence', ['Spectre', 'Perigate', 'Copper']],
  ['2023-autumn-6', 'Aggrogoth', ['Migas', 'Pigbert', 'Omegamon']],
  ['2023-winter-4', 'Hogwood', ['Littlefield', 'Perigate', 'Furbish']],
  ['2024-spring-2', 'Mason Briggs', ['Charles Datchery', 'Myne Bland', 'Alvin Sheldrake']],
  ['2024-spring-4', 'Pius', ['Halloway', 'Perigate', 'Spectre']],
  ['2024-spring-9', 'The Amazing Eunice', ['Bonzo the Clown', 'Beardy Hamm', 'Edgar Allan Crow']],
  ['2024-summer-3', 'Phrenograph', ['Jonagraph', 'Jonahedron', 'Videomatic']],
  ['2024-summer-4', 'Jacques the Jock', ['Sir Merrylegs', 'Captain Book', 'Sergeant Sausage']],
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
  ['2025-winter-5', 'Finn Diesel', ['Mason Briggs', 'Myne Bland', 'Alvin Sheldrake']],
  ['2025-winter-9', 'Dr Horus', ['Dr Silver', 'Dr Jorum', 'Dr Winter']],
  ['2025-winter-10', 'Rexford', ['Perigate', 'Littlefield', 'Copper']],
  ['2025-winter-11', 'Mr Blizzard', ['Mr Kim', 'Mr Feast', 'Mr Knuckles']],
  ['2026-finale-4', 'Littlefield', ['Perigate', 'Datchery', 'Cogwright']],
  ['2022-launch-1', 'Sparks', ['Copper', 'Perigate', 'Giffard']],
  ['2022-launch-3', 'Cogwright', ['Hogwood', 'Littlefield', 'Perigate']],
  ['2022-launch-5', 'Dr Winter', ['Dr Silver', 'Dr Jorum', 'Dr Horus']],
  ['2022-launch-6', 'Jonas', ['Datchery', 'Cogwright', 'Perigate']],
  ['2022-launch-7', 'Jonas', ['Pocket', 'Furbish', 'Datchery']],
  ['2022-launch-8', 'Rexford', ['Hogwood', 'Perigate', 'Nethersole']],
  ['2022-launch-10', 'Pocket', ['Hogwood', 'Rexford', 'Giffard']],
  ['2022-launch-15', 'Giffard', ['Pius', 'Cogwright', 'Perigate']],
  ['2022-launch-16', 'Narvis', ['RoboDJ', 'DojaPlat', 'Hogwood']],
  ['2022-autumn-1', 'Narvis', ['Friendly', 'Perigate', 'Copper']],
  ['2022-autumn-3', 'Halloway', ['Perigate', 'Littlefield', 'Cogwright']],
  ['2022-autumn-4', 'Rusty', ['Furbish', 'Giffard', 'Jonas']],
  ['2022-autumn-6', 'Dr Silver', ['Dr Winter', 'Dr Jorum', 'Dr Horus']],
  ['2022-autumn-7', 'Sparks', ['Copper', 'Perigate', 'Pius']],
  ['2022-autumn-8', 'Pocket', ['Perigate', 'Datchery', 'Littlefield']],
  ['2022-autumn-12', 'Madame Mechanica', ['Dr Winter', 'Lady Oinkerton', 'Father Platmas']],
  ['2022-autumn-13', 'Miramine', ['Miramaze', 'Summerhouse', 'JonaLabs']],
  ['2022-winter-1', 'Pax', ['Sparks', 'Perigate', 'Littlefield']],
  ['2022-winter-3', 'Ender', ['Pius', 'Perigate', 'Sparks']],
  ['2022-winter-4', 'Nethersole', ['Halloway', 'Giffard', 'Sparks']],
  ['2022-winter-7', 'Sparks', ['RoboDJ', 'Narvis', 'DojaPlat']],
  ['2022-winter-8', 'Madame Mechanica', ['Dr Winter', 'Lady Oinkerton', 'Father Platmas']],
  ['2022-winter-11', 'JONACO', ['JIA', 'Resistance', 'Cooperative']],
  ['2022-winter-12', 'Sparks', ['Perigate', 'Littlefield', 'Terence']],
  ['2022-winter-13', 'Nethersole', ['Littlefield', 'Perigate', 'Halloway']],
  ['2023-spring-1', 'Pax', ['Sparks', 'Copper', 'Perigate']],
  ['2023-spring-2', 'Zenia', ['Jonas', 'Winter', 'Perigate']],
  ['2023-spring-4', 'Copper', ['Sparks', 'Perigate', 'Giffard']],
  ['2023-spring-5', 'Jonapost', ['Jonagraph', 'JonaLabs', 'JonaComms']],
  ['2023-spring-6', 'JONACO', ['JIA', 'Resistance', 'Cooperative']],
  ['2023-spring-11', 'Jonas', ['Pocket', 'Furbish', 'Giffard']],
  ['2023-summer-1', 'Sparks', ['Copper', 'Perigate', 'Datchery']],
  ['2023-summer-2', 'Cogwright', ['RoboDoc', 'Perigate', 'Stickler']],
  ['2023-summer-3', 'Rexford', ['Perigate', 'Littlefield', 'Furbish']],
  ['2023-summer-4', 'Bellamy', ['Perigate', 'Pius', 'Datchery']],
  ['2023-summer-5', 'Pius', ['Halloway', 'Spectre', 'Copper']],
  ['2023-summer-6', 'Jonas', ['Pocket', 'Furbish', 'Giffard']],
  ['2023-summer-8', 'Summerhouse', ['Miramaze', 'Saloon', 'Jonagraph']],
  ['2023-summer-9', 'Terence', ['Sparks', 'Pocket', 'Perigate']],
  ['2023-summer-10', 'Spectre', ['Vox', 'Pius', 'Perigate']],
  ['2023-summer-11', 'Jonahedron', ['Jonagraph', 'Videomatic', 'Phrenograph']],
  ['2023-autumn-1', 'Perigate', ['Copper', 'Sparks', 'Littlefield']],
  ['2023-autumn-2', 'Jonas', ['Furbish', 'Giffard', 'Hogwood']],
  ['2023-autumn-4', 'Spectre', ['Halloway', 'Vox', 'Perigate']],
  ['2023-autumn-5', 'Perigate', ['Copper', 'Sparks', 'Halloway']],
  ['2023-autumn-8', 'Old Town', ['Raccoon City', 'Miramaze', 'Summerhouse']],
  ['2023-autumn-9', 'Halloway', ['Perigate', 'Pius', 'Spectre']],
  ['2023-autumn-10', 'Datchery', ['Perigate', 'Littlefield', 'Halloway']],
  ['2023-autumn-11', 'Spectre', ['Vox', 'Halloway', 'Pius']],
  ['2023-winter-1', 'Spectre', ['Halloway', 'Vox', 'Perigate']],
  ['2023-winter-2', 'Jonas', ['Pocket', 'Furbish', 'Datchery']],
  ['2023-winter-3', 'Hogwood', ['Perigate', 'Littlefield', 'Rexford']],
  ['2023-winter-5', 'Terence', ['RoboDJ', 'Pigbert', 'PeakFoot']],
  ['2023-winter-6', 'RoboDoc', ['Dr Winter', 'Dr Silver', 'Dr Horus']],
  ['2023-winter-7', 'Perigate', ['Hogwood', 'Datchery', 'Pocket']],
  ['2023-winter-8', 'JONACO', ['JIA', 'Resistance', 'Cooperative']],
  ['2023-winter-9', 'Bunk', ['Beetlemilk', 'Furbish', 'Pius']],
  ['2023-winter-10', 'Cogwright', ['Jonas', 'Littlefield', 'Perigate']],
  ['2023-winter-11', 'Terence', ['Sparks', 'Copper', 'Pius']],
  ['2023-special-1', 'Winter', ['Jorum', 'Silver', 'Horus']],
  ['2023-special-2', 'Cogwright', ['Littlefield', 'Perigate', 'Halloway']],
  ['2023-special-3', 'Cogwright', ['Littlefield', 'Perigate', 'RoboDoc']],
  ['2024-spring-1', 'Rexford', ['Hogwood', 'Perigate', 'Littlefield']],
  ['2024-spring-3', 'Dr Winter', ['Dr Silver', 'Dr Jorum', 'Dr Horus']],
  ['2024-spring-5', 'Hogwood', ['Littlefield', 'Halloway', 'Perigate']],
  ['2024-spring-6', 'Littlefield', ['Hogwood', 'Perigate', 'Datchery']],
  ['2024-spring-7', 'Spectre', ['Halloway', 'Copper', 'Pius']],
  ['2024-spring-8', 'Pocket', ['Hogwood', 'Perigate', 'Littlefield']],
  ['2024-spring-10', 'Prostlebot', ['RoboDoc', 'Jonabot', 'RoboDJ']],
  ['2024-spring-11', 'Operation Moonshot', ['Project Endless Summer', 'The Great Undoing', 'Operation Placeholder']],
  ['2024-summer-1', 'Hogwood', ['Perigate', 'Littlefield', 'Datchery']],
  ['2024-summer-2', 'Lovehart', ['Giffard', 'Perigate', 'Pocket']],
  ['2024-summer-5', 'Videomatic', ['Jonagraph', 'Phrenograph', 'Jonahedron']],
  ['2024-summer-6', 'Littlefield', ['Hogwood', 'Perigate', 'Datchery']],
  ['2024-summer-7', 'Datchery', ['Copper', 'Perigate', 'Hogwood']],
  ['2024-summer-8', 'Dr Jorum', ['Dr Winter', 'Dr Silver', 'Dr Horus']],
  ['2024-summer-9', 'Pius', ['Brutus', 'Halloway', 'Spectre']],
  ['2024-summer-10', 'Halloway', ['Spectre', 'Hogwood', 'Perigate']],
  ['2024-summer-11', 'Dr Jorum', ['Dr Winter', 'Dr Silver', 'Dr Horus']],
  ['2024-autumn-1', 'Perigate', ['Hogwood', 'Littlefield', 'Datchery']],
  ['2024-autumn-3', 'Hopscotch', ['Todrick', 'Pigbert', 'Chrono']],
  ['2024-autumn-5', 'Rexford', ['Perigate', 'Datchery', 'Littlefield']],
  ['2024-autumn-6', 'Egbert Simpsbury', ['Sherlock Bones', 'Beardy Hamm', 'Edgar Allan Crow']],
  ['2024-autumn-7', 'Dr Winter', ['Dr Jorum', 'Dr Silver', 'Dr Horus']],
  ['2024-autumn-8', 'Pocket', ['Perigate', 'Hogwood', 'Littlefield']],
  ['2024-autumn-9', 'Platman', ['PeakFoot', 'The Gronch', 'Sherlock Bones']],
  ['2024-autumn-10', 'Bread the Bounty Hunter', ['Sherlock Bones', 'Captain Book', 'Sergeant Sausage']],
  ['2024-winter-2', 'Rexford', ['Perigate', 'Hogwood', 'Littlefield']],
  ['2024-winter-3', 'Pocket', ['Perigate', 'Hogwood', 'Littlefield']],
  ['2024-winter-5', 'Halloway', ['Spectre', 'Hogwood', 'Perigate']],
  ['2024-winter-6', 'Littlefield', ['Hogwood', 'Copper', 'Datchery']],
  ['2024-winter-7', 'Jonas', ['Pocket', 'Furbish', 'Giffard']],
  ['2024-winter-8', 'Pius', ['Brutus', 'Halloway', 'Spectre']],
  ['2024-winter-9', 'RoboDoc', ['RoboDJ', 'Jonabot', 'Prostlebot']],
  ['2024-winter-10', 'Father Cola', ['Father Platmas', 'Mr Blizzard', 'Mr Kim']],
  ['2024-winter-11', 'Littlefield', ['Perigate', 'Datchery', 'Halloway']],
  ['2025-spring-1', 'Rexford', ['Perigate', 'Hogwood', 'Littlefield']],
  ['2025-spring-2', 'Alfonz Stench', ['Jacques the Jock', 'Beardy Hamm', 'Myne Bland']],
  ['2025-spring-3', 'Hogwood', ['Perigate', 'Littlefield', 'Datchery']],
  ['2025-spring-4', 'Green Diamant', ['JonaCola', 'Jonatine', 'Beetlemilk']],
  ['2025-spring-5', 'RoboDoc', ['RoboDJ', 'Jonabot', 'Prostlebot']],
  ['2025-spring-6', 'Lovehart', ['Giffard', 'Perigate', 'Pocket']],
  ['2025-spring-7', 'Littlefield', ['Hogwood', 'Perigate', 'Datchery']],
  ['2025-spring-8', 'Sherlock Bones', ['Beardy Hamm', 'Edgar Allan Crow', 'Sergeant Sausage']],
  ['2025-spring-9', 'Turbo the Hedgehog', ['Todrick the Toad', 'Sherlock Bones', 'Walter the Raccoon']],
  ['2025-spring-10', 'Perigate', ['Hogwood', 'Littlefield', 'Datchery']],
  ['2025-spring-11', 'Videomatic', ['Jonagraph', 'Phrenograph', 'Jonahedron']],
  ['2025-summer-3', 'The Silver Children', ['The GhoulBusters', 'The Resistance', 'The Cooperative']],
  ['2025-summer-5', 'The Furbo', ['The Autohatter', 'The Phrenograph', 'The Jonahedron']],
  ['2025-summer-6', 'The Resistance', ['The Cooperative', 'The GhoulBusters', 'The Silver Children']],
  ['2025-summer-7', 'Todrick the Toad', ['Sherlock Bones', 'Walter the Raccoon', 'Turbo the Hedgehog']],
  ['2025-summer-9', 'Furbish', ['Jonas', 'Pocket', 'Perigate']],
  ['2025-summer-10', 'Perigate', ['Hogwood', 'Littlefield', 'Datchery']],
  ['2025-summer-11', 'KLACKY', ['JonAssist', 'JonaLabs', 'JonaComms']],
  ['2025-summer-12', 'Mr Kim', ['Mr Blizzard', 'Mr Feast', 'Mr Knuckles']],
  ['2025-autumn-2', 'Sherlock Bones', ['Beardy Hamm', 'Edgar Allan Crow', 'Sergeant Sausage']],
  ['2025-autumn-4', 'Vox', ['Copper', 'Halloway', 'Pius']],
  ['2025-autumn-6', 'Perigate', ['Hogwood', 'Littlefield', 'Datchery']],
  ['2025-autumn-7', 'Sir Merrylegs', ['Captain Book', 'Sergeant Sausage', 'Jacques the Jock']],
  ['2025-autumn-8', 'Beardy Hamm', ['Edgar Allan Crow', 'Sherlock Bones', 'Sergeant Sausage']],
  ['2025-autumn-9', 'Marketing Bot', ['Jonabot', 'Prostlebot', 'RoboDJ']],
  ['2025-autumn-10', 'Mayor Nazabod', ['Mayor Furbish', 'King Temu', 'Father Platmas']],
  ['2025-autumn-12', 'Pius', ['Brutus', 'Halloway', 'Spectre']],
  ['2025-winter-1', 'Edgar Allan Crow', ['Beardy Hamm', 'Sherlock Bones', 'Sergeant Sausage']],
  ['2025-winter-2', 'Beardy Hamm', ['Edgar Allan Crow', 'Sherlock Bones', 'Sergeant Sausage']],
  ['2025-winter-3', 'Sir Merrylegs', ['Captain Book', 'Sergeant Sausage', 'Jacques the Jock']],
  ['2025-winter-4', 'Captain Book', ['Sir Merrylegs', 'Sergeant Sausage', 'Jacques the Jock']],
  ['2025-winter-6', 'Brutus', ['Halloway', 'Spectre', 'Kappa']],
  ['2025-winter-7', 'Marketing Bot', ['Jonabot', 'Prostlebot', 'RoboDJ']],
  ['2025-winter-8', 'Pocket', ['Perigate', 'Hogwood', 'Littlefield']],
  ['2025-winter-12', 'The Great Undoing', ['Operation Moonshot', 'Project Endless Summer', 'Operation Placeholder']],
  ['2026-finale-1', 'Giffard', ['Perigate', 'Pocket', 'Hogwood']],
  ['2026-finale-2', 'Madame Mechanica', ['Dr Winter', 'Lady Oinkerton', 'Father Platmas']],
  ['2026-finale-3', 'Project Endless Summer', ['Operation Moonshot', 'The Great Undoing', 'Operation Placeholder']],
  ['2026-finale-5', 'Vox', ['Spectre', 'Halloway', 'Pius']]
];
function occurrences(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'))];
}
const errors = [];
const questions = picks.flatMap(([id, answer, alternatives]) => {
  try {
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
    else if (sentences.length > 1 && !occurrences(sentences[1], answer).length) excerpt = `${excerpt} ${sentences[1]}`;
  }
  if (occurrences(excerpt, answer).length !== 1) throw Error(`Answer repeated in excerpt: ${id}`);
  const clue = excerpt.replace(occurrences(excerpt, answer)[0][0], '_____');
  const options = [answer, ...alternatives];
  if (options.length !== 4 || new Set(options).size !== 4) throw Error(`Invalid choices for ${id}`);
  for (const word of options) {
    if (!/^[\p{L}][\p{L}\p{N}]*(?:[ .’'-]+[\p{L}][\p{L}\p{N}]*)*$/u.test(word)) throw Error(`Invalid name: ${word}`);
    if (word !== answer && occurrences(`${trail.title} ${excerpt}`, word).length) throw Error(`Choice visible in clue: ${id}: ${word}`);
    if (!trails.some(item => occurrences(JSON.stringify(item), word).length)) throw Error(`Choice not in trail archive: ${id}: ${word}`);
  }
  return [{id, title: trail.title, clue, answer, options, season: trail.season, year: trail.year, seasonTitle: trail.seasonTitle}];
  } catch (error) {
    errors.push(error.message);
    return [];
  }
});
if (errors.length) throw Error(errors.join('\n'));
const trailOrder = new Map(trails.map((trail, index) => [trail.id, index]));
questions.sort((a, b) => trailOrder.get(a.id) - trailOrder.get(b.id));
fs.writeFileSync(path.join(root, 'docs', 'lore-gap.js'), `const LORE_GAP = ${JSON.stringify(questions, null, 2)};\n`);
const review = ['# Lost in the Lore clue review', '',
  'Each clue is an excerpt from the trail description in `source/trails.json`. One complete named character, place, group or device is removed. The three hand-picked alternatives fit the role in that sentence. All four choices appear in the trail archive; the correct name is absent from the displayed title and the rest of the excerpt.', '',
  '| Trail | Season | Missing word | Other choices | Description excerpt |', '|---|---|---|---|---|',
  ...questions.map(q => `| ${q.title} | ${q.season} ${q.year} | **${q.answer}** | ${q.options.slice(1).join(', ')} | ${q.clue.replaceAll('|', '\\|')} |`), ''];
fs.writeFileSync(path.join(root, 'LOST-IN-THE-LORE-REVIEW.md'), review.join('\n'));
console.log(`Built ${questions.length} description clues from ${trails.length} trails.`);
