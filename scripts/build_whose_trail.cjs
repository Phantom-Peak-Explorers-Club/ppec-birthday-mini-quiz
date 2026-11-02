const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const trails = JSON.parse(fs.readFileSync(path.join(root, 'source', 'trails.json'), 'utf8'));
// Only trails whose opening and closing townsfolk match are in this reviewed pool.
// mainCharacter alone is not sufficient: some archive records change hands.
const reviewedIds = JSON.parse(fs.readFileSync(path.join(root, 'source', 'whose-trail-reviewed.json'), 'utf8'));
const byId = new Map(trails.map(trail => [trail.id, trail]));
const leadAliases = {Platman: 'Rexford', 'Edgar Allan Crow': 'Halloway'};
const leadCorrections = {'2025-autumn-2': 'Lovehart'};
const questions = reviewedIds.map(id => {
  const {title, year, season, seasonTitle, mainCharacter} = byId.get(id) || {};
  if (!id || !title || !year || !season || !seasonTitle || !mainCharacter) {
    throw new Error(`Incomplete lead record: ${id || title}`);
  }
  const answer = leadCorrections[id] || leadAliases[mainCharacter] || mainCharacter;
  if (answer === 'Madame Mechanica' || answer === 'Sherlock Bones') {
    throw new Error(`Invalid lead answer: ${id} ${answer}`);
  }
  return {id, title, year, season, seasonTitle, answer};
});
if (questions.length < 50 || new Set(questions.map(question => question.id)).size !== questions.length) {
  throw new Error('Whose Trail Is It? needs at least 50 unique trail records.');
}
const names = [...new Set(questions.map(question => question.answer))].sort((a, b) => a.localeCompare(b, 'en'));
fs.writeFileSync(path.join(root, 'docs', 'whose-trail.js'),
  `// Generated from source/trails.json. Run node scripts/build_whose_trail.cjs.\n` +
  `const WHOSE_TRAILS = ${JSON.stringify(questions, null, 2)};\n` +
  `const LEAD_NAMES = ${JSON.stringify(names, null, 2)};\n`);
console.log(`${questions.length} trails, ${names.length} lead names`);
