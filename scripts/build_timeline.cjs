const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const trails = require(path.join(root, 'source', 'trails.json'));
const seasonOrder = { Launch: 0, Spring: 1, Summer: 2, Autumn: 3, Winter: 4, Finale: 5 };
const dated = trails.filter(trail => trail.season !== 'Special');
if (dated.some(trail => !Number.isInteger(trail.year) || seasonOrder[trail.season] === undefined)) {
  throw new Error('Timeline source contains an unknown season');
}
const seasonKeys = [...new Set(dated.map(trail => `${trail.year}:${trail.season}`))]
  .sort((a, b) => {
    const [yearA, seasonA] = a.split(':');
    const [yearB, seasonB] = b.split(':');
    return Number(yearA) - Number(yearB) || seasonOrder[seasonA] - seasonOrder[seasonB];
  });
const timeline = dated.map(trail => ({
  id: trail.id,
  title: trail.title,
  summary: trail.summary,
  searchText: trail.searchText,
  year: trail.year,
  season: trail.season,
  seasonTitle: trail.seasonTitle,
  rank: seasonKeys.indexOf(`${trail.year}:${trail.season}`)
}));

if (timeline.length < 11 || timeline.some(trail => trail.rank < 0)) throw new Error('Invalid timeline source');
const output = `// Generated from source/trails.json by scripts/build_timeline.cjs.\n` +
  `// Special event trails are excluded because their order within 2023 is not established.\n` +
  `const TIME_TRAILS=${JSON.stringify(timeline, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'docs', 'timeline.js'), output);
console.log(`Wrote ${timeline.length} season-dated trails across ${seasonKeys.length} seasons.`);
