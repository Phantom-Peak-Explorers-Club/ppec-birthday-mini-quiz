const fs = require('node:fs');
const path = require('node:path');

// Red, orange, yellow, green, jade, cyan, blue, violet, then magenta.
const order = [
  'picture-game-card', 'trail-game-card', 'anagram-game-card',
  'platy-game-card', 'lead-game-card', 'blanks-game-card',
  'timeline-game-card', 'vowel-game-card', 'lore-game-card'
];
const file = path.join(__dirname, '..', 'docs', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const grid = /(<div class="game-grid">\r?\n)([\s\S]*?)(\r?\n        <\/div>\r?\n      <\/div>\r?\n    <\/section>)/;
const match = html.match(grid);
if (!match) throw new Error('Portal game grid not found');
const cards = [...match[2].matchAll(/<article class="game-card ([^"]+)">[\s\S]*?<\/article>/g)];
if (cards.length !== order.length) throw new Error(`Expected ${order.length} game cards, found ${cards.length}`);
const byClass = new Map(cards.map(card => [card[1], card[0]]));
if (byClass.size !== order.length || order.some(key => !byClass.has(key))) {
  throw new Error('The game card classes have changed; review the colour order');
}
const newline = html.includes('\r\n') ? '\r\n' : '\n';
const sorted = order.map(key => `        ${byClass.get(key)}`).join(newline);
fs.writeFileSync(file, html.replace(grid, (_, start, _cards, end) => start + sorted + end));
console.log(order.join(' -> '));
