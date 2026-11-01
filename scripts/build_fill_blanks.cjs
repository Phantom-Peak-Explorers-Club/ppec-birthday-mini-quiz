const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const trails = JSON.parse(fs.readFileSync(path.join(root, 'source', 'trails.json'), 'utf8'));
const words = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
const stop = new Set('a after all an and are as at be but by do for from had has have he her him his how i if in into is it its la let me my no not of off oh on or our out over she so some than that the them there this to up was we what when where who why with ye you your'.split(' '));
const skip = new Map([
  ['Question Me This', 'Too many possible missing words'],
  ['The Plat-Man', 'Only one meaningful word after the hyphen'],
  ['What Do You Think You Are', 'Too many possible missing words'],
  ['Where Are You?', 'No useful identifying word to hide'],
  ['Mum\'s The Word', 'The possessive is awkward as a typed answer'],
  ['Time After Time', 'The missing word would also be visible'],
  ['Over and Over', 'The missing word would also be visible'],
  ['Hat on a Hat', 'The missing word would also be visible'],
  ['The Very Best', 'Too generic without the missing word'],
  ['The Real Thing', 'Too generic without the missing word'],
  ['The End Is Just The Beginning', 'Too generic without the missing word'],
  ['Nothing But The Truth', 'Too generic without the missing word'],
  ['The Perfect Subject', 'Too generic without the missing word'],
  ['The Last Resort', 'Same displayed clue as The Last Laugh'],
  ['Deck The Halloway’s', 'The possessive is awkward as a typed answer'],
  ['Five Nights at RoboDJ’s', 'The possessive is awkward as a typed answer'],
  ["Littlefield's Little Package", 'Same displayed clue as Littlefield’s Little Friend'],
  ['Two and a Half Perigate’s', 'The possessive is awkward as a typed answer'],
  ['The Good, The Bad and The Milky', 'Too many plausible missing words'],
  ['A Ring To Roll Them All', 'Too many plausible missing words'],
  ['The Hero We Deserve', 'Too many plausible missing words'],
  ['You Didn\'t Account For This', 'Too many plausible missing words']
]);
const selected = new Map([
  ['The Great Rank Glitch', 'Glitch'],
  ['Blimp Fuel Melts Wooden Beams', 'Blimp'],
  ['No “I” In Conspiracy', 'Conspiracy'],
  ['The Wolf And The Platypus', 'Wolf'],
  ['Gnome Stone Unturned', 'Gnome'],
  ['The Numbers Of The Beast', 'Numbers'],
  ['Medium At Large', 'Medium'],
  ['A Special Invitation', 'Invitation'],
  ['The Big Day', 'Big'],
  ['Platman Beyond', 'Platman'],
  ['Cosmic Conjurations', 'Cosmic'],
  ['Pocket Change', 'Pocket'],
  ['Keep Your Friends Close', 'Friends'],
  ['Unlucky For Some', 'Unlucky'],
  ['Winner Takes It All', 'Winner'],
  ['Happily Never After', 'Happily'],
  ['Ghouls Night Out', 'Ghouls'],
  ['Ghost with the Most', 'Ghost'],
  ['The Man With The Bowler Hat', 'Bowler'],
  ['Off The Rails', 'Rails'],
  ['Some Body To Love', 'Body'],
  ['The Devil You Know', 'Devil'],
  ['The Last Laugh', 'Laugh'],
  ['Straight To The Moon', 'Moon'],
  ['The Final Question', 'Question'],
  ['The Axiomatic Zone', 'Axiomatic'],
  ['The Bright Place', 'Bright'],
  ['Final Countdown', 'Countdown']
]);

const questions = [];
const review = ['# Fill the Blanks trail review', '',
  'Built from all 187 titles in `source/trails.json`. A clue hides one meaningful word and shows its letter count. Single-word titles, repeated-word clues, and titles that leave too little context are excluded.', '',
  '| Trail title | Hidden word | Displayed clue / reason |', '|---|---|---|'];
const seen = new Map();
for (const trail of trails) {
  const tokens = [...trail.title.matchAll(words)].map(match => ({text:match[0], index:match.index}));
  const content = tokens.filter(token => !stop.has(token.text.toLowerCase()) && /\p{L}/u.test(token.text));
  let reason = skip.get(trail.title);
  if (!reason && content.length < 2 && !selected.has(trail.title)) reason = 'Only one meaningful word';
  if (!reason && tokens.length < 2) reason = 'Single-word title';
  if (reason) { review.push(`| ${trail.title} | — | ${reason} |`); continue; }
  const chosen = selected.get(trail.title);
  const token = chosen ? tokens.find(part => part.text.toLowerCase() === chosen.toLowerCase()) : content.at(-1);
  if (!token || stop.has(token.text.toLowerCase())) throw Error(`Invalid hidden word for ${trail.title}`);
  const clue = trail.title.slice(0, token.index) + '_____' + trail.title.slice(token.index + token.text.length);
  const answer = token.text;
  const normalized = clue.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (seen.has(normalized)) throw Error(`Duplicate clue: ${trail.title} and ${seen.get(normalized)}`);
  seen.set(normalized, trail.title);
  if (tokens.some(part => part.index !== token.index && part.text.toLowerCase() === answer.toLowerCase())) throw Error(`Answer visible in ${trail.title}`);
  questions.push({id:trail.id, title:trail.title, clue, answer, year:trail.year, season:trail.season, seasonTitle:trail.seasonTitle,
    ...(trail.contributor ? {contributor:trail.contributor} : {})});
  review.push(`| ${trail.title} | **${answer}** | ${clue} |`);
}
review.splice(2, 0, `${questions.length} selected; ${trails.length - questions.length} excluded.`);
for (const title of [...skip.keys(), ...selected.keys()]) {
  if (!trails.some(trail => trail.title === title)) throw Error(`Review decision does not match a trail title: ${title}`);
}
fs.writeFileSync(path.join(root, 'docs', 'fill-blanks.js'), `const FILL_BLANKS = ${JSON.stringify(questions, null, 2)};\n`);
fs.writeFileSync(path.join(root, 'FILL-THE-BLANKS-REVIEW.md'), review.join('\n') + '\n');
console.log(`Built ${questions.length} fill-the-blank questions from ${trails.length} trail titles.`);
