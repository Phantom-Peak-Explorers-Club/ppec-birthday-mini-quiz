const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const trails = JSON.parse(fs.readFileSync(path.join(root, 'source', 'trails.json'), 'utf8'));

// Keep the birthday quiz wording where it already exists.
const authored = {
  'The Platycurse': 'Halloway becomes convinced something is wrong with them after discovering a strange mark on their leg.',
  'Lofty Ambitions': 'Sparks becomes involved in a plan to protect a resistance group by destroying information that could expose them.',
  'The Platypus, The Wizard And The Armoire': 'Littlefield becomes trapped inside an artificial world created by Dr Winter.',
  'The Wereplatypus': 'Dr Silver and JonaLabs find Gérard and deliberately try to reproduce in him what happened to Rexford by accident, hoping to create another Platman. Gérard cannot bear the expectations and runs away to write greeting cards.',
  'Fortune Favours The Furb': 'Cogwright follows what appears to be a treasure hunt, only to discover that the treasure is somebody rather than something.',
  'Radio Killed The Video Star': 'A discarded machine leads to the discovery that voices trapped inside a rare material belong to people from Phantom Peak’s past.',
  'Spirit Of The Season': 'An apparent monster attack turns out to involve unusual side effects from a popular drink.',
  'Parent Company': 'Littlefield tries to change their family circumstances, but a bizarre process ends with them being legally treated as office supplies.',
  'Double Act': 'A Church fundraising stage performance goes wrong when one participant genuinely disappears.',
  'Off The Rails': 'Datchery’s shop faces demolition, and neither protests nor sabotage can save it.',
  'Access Denied': 'Dr Winter discovers that both they and Littlefield have been excluded from JONACO’s survival plans.',
  'The Last Resort': 'A rogue drilling machine linked to Datchery’s father is still loose underground and may be responsible for the geoquakes.',
  'The Silver Children': 'Sparks shuts down a JonaCola fan club after its members have a spooky encounter.',
  'Sleigh Queen': 'Littlefield enters a Wintermas competition, and Nethersole helps rig the result.',
  'The Gronch': 'Green fur and wreckage at the Undertaker’s lead to a cereal mascot and a strange transformation.',
  'Skytanic': 'Perigate’s parents sign them up for a water based event despite Perigate’s fear of clowns and inability to swim.',
  'The Axiomatic Zone': 'Actors vanish into an old television show, and Hogwood’s partner misses an anniversary date.',
  'The Great Undoing': 'A talking meteor leads to a Videomatic message about an axiomatic rift and a JONACO rocket.',
  'The Bright Place': 'Edgar Allan Crow asks for help protecting films whose stories are mysteriously rewriting themselves.',
  'Mayor Of The Universe': 'Pocket receives a mysterious puppet, and an error in their Jumble profile leads to interdimensional counterparts.',
  'Blobsleigh': 'Pax misses their former sleigh team, who have been caught up in a JONACO experiment and transformed into one enormous blob.',
  'The Hum Bug': 'Sparks cannot shake a tune, and a strange music video leads explorers to its performer: Terence in disguise.',
  'Horror by Hogwood': 'Hogwood’s films keep being sabotaged by a cursed camera. The investigation points toward their disapproving mother.',
  'A Special Invitation': 'After the explorers’ earlier adventures, Jonas notices them and makes his interest known.',
  "What's In The Box?!": 'Leadbelly has a box wrapped in caution tape. What first looks dangerous turns out to be a Secret Santa hard hat.',
  'Deck The Halloway’s': 'Sparks steals a diamant wand, creates a living snowman, and plays a winter prank on Halloway.',
  'The Big Day': 'A Videomatic conversation between Dr Winter and Jonas reveals that a powerful source lies beneath Phantom Peak.',
  'I Know What You Did Last Wintermas': 'Datchery receives threatening letters about last Wintermas. A handwriting investigation reveals that a memory wipe has hidden their own role in the Great Rock Fall.',
  'Chaos Reigns': 'Furbish warns that the election is a sham, while Spectre receives a piece of diamant containing a twisted soul.',
  'The Real Thing': 'Lovehart investigates strange effects among people who have been drinking JonaCola.',
  'Absnormal Abduction': 'Rexford believes aliens abducted them. An apparent alien artifact turns out to be JONACO property, and Hogwood’s strange behaviour has a more ordinary explanation.',
  'The Good, The Bad and The Milky': 'Halloway recruits you as a bounty hunter after their dynamite is stolen. A trail through Sheriff Rexford and the Milkman leads to a poker confrontation with the Banshee Bandit.',
  'The Final Question': 'Father Platmas wants to give back at Wintermas. A search for the Questioner leads to an ominous postcard and a series of tasks.',
  'Too Fast, Too Furrious': 'Dr Winter’s lab is egged by a speedy hedgehog mascot, who leaves a note written at 70mph and holds a grudge against Winter.',
  'The Graveyard Groove': 'Halloway seeks help with the Silver Children, whose walking tour and video become part of the investigation.',
  'Less Miserable': 'The Resistance stages a musical to win support, but Copper interrupts it with a competing plan for karaoke.',
  'Dead Ringer': 'A skull bought from a Greymarket seller turns out to belong to Sparks, who sends a warning from the future about the Janus 2 project.',
  'Angels And Diamant': 'Pius learns the Jonahedron may damage the town. A Videomatic says Rexford must steal the Cosmic Platypus Egg to stop it.'
};

function clueFor(trail) {
  if (authored[trail.title]) return authored[trail.title];
  const text = trail.searchText.replace(/\s+/g, ' ').trim().replace(/\b(Dr|Mr)\./g, '$1');
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z“])/);
  let clue = '';
  for (const sentence of sentences) {
    if (clue.length >= 125 && clue.length + sentence.length > 260) break;
    clue += (clue ? ' ' : '') + sentence;
    if (clue.length >= 170) break;
  }
  if (!clue) clue = text;
  if (clue.length > 310) clue = clue.slice(0, 307).replace(/\s+\S*$/, '') + '…';
  return clue.replace(/\.\.\.$/, '…');
}

function seedFor(text) { return [...text].reduce((value, character) => (Math.imul(value, 31) + character.charCodeAt(0)) >>> 0, 2166136261); }
function rankOther(trail, other) {
  let score = 0;
  if (trail.mainCharacter && trail.mainCharacter === other.mainCharacter) score += 12;
  if (trail.year === other.year) score += 3;
  if (trail.season === other.season) score += 2;
  for (const character of trail.otherCharacters || []) if (other.otherCharacters?.includes(character) || other.mainCharacter === character) score += 2;
  for (const theme of trail.themes || []) if (other.themes?.includes(theme)) score += 2;
  return score;
}
function distractorsFor(trail) {
  const candidates = trails.filter(other => other.id !== trail.id)
    .map(other => ({ other, score: rankOther(trail, other), tie: seedFor(trail.id + other.id) }))
    .sort((a, b) => b.score - a.score || a.tie - b.tie);
  return candidates.slice(0, 2).map(item => item.other.title);
}

const questions = trails.map(trail => ({
  id: trail.id,
  answer: trail.title,
  clue: clueFor(trail),
  options: [trail.title, ...distractorsFor(trail)],
  source: `https://ppec.club/trail-notes/`,
  year: trail.year,
  season: trail.season,
  ...(trail.contributor ? {contributor:trail.contributor} : {})
}));

const normalized = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const invalid = questions.filter(question => question.options.length !== 3 || new Set(question.options).size !== 3 ||
  question.options.some(option => normalized(question.clue).includes(normalized(option))) || question.clue.length < 35);
if (questions.length !== 187 || invalid.length) throw new Error(`Invalid questions: ${invalid.map(q => q.id).join(', ')}`);

fs.writeFileSync(path.join(root, 'docs', 'what-trail.js'), `const WHAT_TRAILS = ${JSON.stringify(questions, null, 2)};\n`);
const lines = [
  '# Trail and Error! question bank', '',
  '187 questions drawn from the [PPEC Trail Notes archive](https://ppec.club/trail-notes/) (`source/trails.json` snapshot). Each has three answer choices total. The ten birthday quiz clues retain their original wording where available. The remaining clues are condensed from the archive’s trail recaps.', '',
  'The correct answer is shown in **bold** for review. The app shuffles the three choices when a question is played.', ''
];
for (const [index, question] of questions.entries()) {
  lines.push(`## ${index + 1}. ${question.answer}`, '', `**Clue:** ${question.clue}`, '',
    `**Choices:** ${question.options.map(option => option === question.answer ? `**${option}**` : option).join(' · ')}`, '');
}
fs.writeFileSync(path.join(root, 'WHAT-TRAIL-QUESTIONS.md'), lines.join('\n'));
console.log(`Generated ${questions.length} trail questions with three choices each.`);
