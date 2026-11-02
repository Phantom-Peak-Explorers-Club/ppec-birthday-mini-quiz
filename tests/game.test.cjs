const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'docs', 'what-trail.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'fill-blanks.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'lore-gap.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'timeline.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'app.js'), 'utf8');

test('PPEC Quiz is the installed app name and the banner names Jonabot Jr', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'manifest.webmanifest'), 'utf8'));
  const html = fs.readFileSync(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8');
  assert.equal(manifest.name, 'PPEC Quiz');
  assert.equal(manifest.short_name, 'PPEC Quiz');
  assert.match(html, /<title>PPEC Quiz<\/title>/);
  assert.match(html, /<h1 id="home-title">Jonabot&nbsp;Jr’s <em>Quiz App<\/em><\/h1>/);
  assert.doesNotMatch(html, /portal-banner-kicker/);
  assert.match(html, /jonabot-quiz-hero\.png/);
  assert.match(html, /jonabot-countdown-card\.png/);
  assert.match(html, /jonabot-avatar\.png/);
  assert.doesNotMatch(html, /class="topbar"/);
  assert.doesNotMatch(html, /30 SECONDS \/ LETTER GAMES|<footer>/);
  const app = setup();
  assert.match(app.evaluate('shareText.toString()'), /PPEC Quiz/);
});

function makeElement(dataset = {}) {
  return {
    dataset, hidden: false, value: '', textContent: '', style: {}, children: [],
    listeners: {}, classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    setAttribute() {},
    replaceChildren(...children) { this.children = children; },
    append(...children) { this.children.push(...children); },
    focus() {}, remove() {}, click() { if (!this.disabled) return this.listeners.click?.(); }
  };
}

function setup() {
  let now = 100000;
  let interval = null;
  const listeners = {};
  const historyEntries = [{}];
  let historyIndex = 0;
  const canvasText = [];
  const canvasImages = [];
  const canvasFills = [];
  const objectUrls = [];
  let downloadClicked = false;
  const nodes = new Map();
  const get = id => nodes.get(id) || (nodes.set(id, Object.assign(makeElement(), { id })), nodes.get(id));
  get('start-countdown').hidden = true;
  const buttons = [
    makeElement({ game: 'anagrams', mode: 'quiz' }),
    makeElement({ game: 'anagrams', mode: 'unlimited' }),
    makeElement({ game: 'catchphrase', mode: 'quiz' }),
    makeElement({ game: 'catchphrase', mode: 'unlimited' }),
    makeElement({ game: 'vowels', mode: 'quiz' }),
    makeElement({ game: 'vowels', mode: 'unlimited' }),
    makeElement({ game: 'trails', mode: 'quiz' }),
    makeElement({ game: 'trails', mode: 'unlimited' }),
    makeElement({ game: 'platy', mode: 'quiz' }),
    makeElement({ game: 'platy', mode: 'unlimited' }),
    makeElement({ game: 'blanks', mode: 'quiz' }),
    makeElement({ game: 'blanks', mode: 'unlimited' }),
    makeElement({ game: 'lore', mode: 'quiz' }),
    makeElement({ game: 'lore', mode: 'unlimited' }),
    makeElement({ game: 'timeline', mode: 'quiz' }),
    makeElement({ game: 'timeline', mode: 'unlimited' })
  ];
  const screens = ['home', 'game', 'results'].map(get);
  const context = vm.createContext({
    document: {
      addEventListener(type, handler) { listeners[`document-${type}`] = handler; },
      getElementById: get,
      querySelectorAll: selector => selector === '.screen' ? screens : buttons,
      createElement: tag => {
        if (tag === 'canvas') return {
          width: 0, height: 0,
          getContext: () => ({
            createLinearGradient: () => ({ addColorStop() {} }),
            fillRect(...args) { canvasFills.push({ color: this.fillStyle, args }); }, strokeRect() {}, beginPath() {}, arc() {}, fill() {},
            drawImage(image, ...args) { canvasImages.push({ src: image.src, args }); },
            fillText(text) { canvasText.push(text); }
          }),
          toBlob(callback) { callback({ type: 'image/png' }); }
        };
        const element = makeElement();
        if (tag === 'a') element.click = () => { downloadClicked = true; };
        return element;
      },
      body: makeElement()
    },
    window: {
      scrollTo() {}, location: { pathname: '/ppec-birthday-mini-quiz/', search: '' },
      addEventListener(type, handler) { listeners[type] = handler; },
      history: {
        replaceState(state) { historyEntries[historyIndex] = state; },
        pushState(state) { historyEntries.splice(historyIndex + 1); historyEntries.push(state); historyIndex++; },
        back() { if (historyIndex > 0) listeners.popstate?.({ state: historyEntries[--historyIndex] }); },
        forward() { if (historyIndex < historyEntries.length - 1) listeners.popstate?.({ state: historyEntries[++historyIndex] }); }
      }
    },
    Date: { now: () => now }, Math, String, setTimeout, clearTimeout, URL,
    setInterval: fn => { interval = fn; return 1; },
    clearInterval: () => { interval = null; },
    navigator: {}, File: class {}, Image: class { decode() { return Promise.resolve(); } }
  });
  context.URL = { createObjectURL: blob => { const url = `blob:test-${objectUrls.length + 1}`; objectUrls.push({ blob, url }); return url; }, revokeObjectURL() {} };
  vm.runInContext(source, context);
  const state = () => vm.runInContext('state', context);
  const submit = answer => { get('answer-input').value = answer; get('answer-form').listeners.submit({ preventDefault() {} }); };
  return { get, buttons, state, submit, canvasText, canvasImages, canvasFills, objectUrls, wasDownloaded: () => downloadClicked,
    keydown: key => listeners['document-keydown']?.({key,repeat:false,altKey:false,ctrlKey:false,metaKey:false}),
    rerender: () => vm.runInContext('render()', context),
    startTimed: index => { buttons[index].click(); vm.runInContext('finishCountdown()', context); },
    advance: ms => { now += ms; interval?.(); },
    evaluate: code => vm.runInContext(code, context)
  };
}

test('Wereplatypus clue distinguishes Gérard from Rexford without calling him a clone', () => {
  const questions = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'what-trail.js'), 'utf8') + '\nWHAT_TRAILS');
  const clue = questions.find(question => question.answer === 'The Wereplatypus').clue;
  assert.match(clue, /find Gérard.*reproduce in him what happened to Rexford by accident/);
  assert.match(clue, /Gérard.*expectations.*runs away to write greeting cards/);
  assert.doesNotMatch(clue, /clon(?:e|ed|ing)|Rexford now goes by/);
});

test('Quiz Round uses ten questions and includes game, mode, score, and time in results', () => {
  const app = setup();
  app.startTimed(0);
  assert.equal(app.state().questions.length, 10);
  assert.equal(app.state().questions.filter(q => q.tier === 1).length, 2);
  assert.equal(app.state().questions.filter(q => q.tier === 2).length, 3);
  assert.equal(app.state().questions.filter(q => q.tier === 3).length, 3);
  assert.equal(app.state().questions.filter(q => q.tier === 4).length, 2);
  for (let i = 0; i < 10; i++) {
    app.submit(app.state().questions[i].answer);
    app.get('next-button').click();
  }
  assert.equal(app.get('share-score').textContent, '10 right');
  assert.equal(app.get('share-detail').textContent, '10 correct · 10 questions completed');
  assert.equal(app.get('share-game').textContent, 'Littlefield’s Letters');
  assert.equal(app.get('share-mode').textContent, 'Quiz Round');
  assert.match(app.get('share-time').textContent, /^Time \d+:\d\d$/);
});

test('Graphical share card renders game, mode, score, question count, and time and downloads a PNG', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'catchphrase',mode:'unlimited',points:47,score:3,completed:4,elapsedMs:123000})");
  const canvas = await app.evaluate('drawShareCard()');
  assert.equal(canvas.width, 1080);
  assert.equal(canvas.height, 1080);
  await app.evaluate('shareCard()');
  assert.equal(app.wasDownloaded(), true);
  assert.match(app.get('share-status').textContent, /ppec-quiz-score\.png/);
  assert.ok(app.canvasText.some(text => text.includes('Peak-a-Boo')));
  assert.ok(app.canvasText.some(text => text.includes('UNLIMITED')));
  assert.ok(app.canvasText.includes('47'));
  assert.ok(app.canvasText.includes('POINTS'));
  assert.ok(app.canvasText.includes('4'));
  assert.ok(app.canvasText.includes('QUESTIONS COMPLETED'));
  assert.ok(app.canvasText.some(text => text.includes('2:03')));
});

test('The on-screen tile previews the same PNG blob used by Save PNG', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'trails',mode:'quiz',score:7,completed:10,elapsedMs:91000})");
  const blob = await app.evaluate('prepareShareCard()');
  assert.equal(app.get('share-preview-image').src, 'blob:test-1');
  assert.equal(app.get('share-preview-image').hidden, false);
  assert.strictEqual(app.objectUrls[0].blob, blob);
  await app.get('download-button').click();
  assert.strictEqual(app.objectUrls[1].blob, blob);
});

test('Letter and trail share cards use correct-answer scores', async () => {
  for (const [game, label] of [['anagrams', 'Littlefield’s Letters'], ['vowels', 'Vowel of Silence'], ['trails', 'Trail and Error'], ['blanks', 'Blankety Peak'], ['lore', 'Lost in the Lore']]) {
    const app = setup();
    app.evaluate(`Object.assign(state,{game:'${game}',mode:'quiz',score:8,completed:10,elapsedMs:91000})`);
    await app.evaluate('drawShareCard()');
    assert.ok(app.canvasText.some(text => text.includes(label)));
    assert.ok(app.canvasText.some(text => text.includes('QUIZ ROUND')));
    assert.ok(app.canvasText.includes('8'));
    assert.ok(app.canvasText.includes('RIGHT'));
    assert.ok(app.canvasText.includes('10'));
    assert.ok(app.canvasText.includes('QUESTIONS COMPLETED'));
    assert.ok(app.canvasText.some(text => text.includes('1:31')));
  }
});

test('Each share card shows its game art between the dividers and a Jonabot avatar', async () => {
  const backgrounds = new Set();
  for (const game of ['anagrams', 'catchphrase', 'vowels', 'trails', 'platy', 'blanks', 'lore', 'timeline']) {
    const app = setup();
    app.evaluate(`Object.assign(state,{game:'${game}',mode:'quiz',score:4,completed:10,elapsedMs:91000})`);
    await app.evaluate('drawShareCard()');
    const art = app.canvasImages.find(image => image.src.includes('/game-logos/'));
    assert.ok(art, `${game} art missing`);
    assert.ok(art.args[1] > 283 && art.args[1] + art.args[3] < 756, `${game} art crossed a divider`);
    assert.ok(app.canvasImages.some(image => image.src.includes('jonabot-avatar.png')));
    assert.ok(app.canvasImages.some(image => image.src.includes('share-card-master.jpg')), `${game} detailed master missing`);
    const background = app.canvasFills.find(fill => fill.args.join(',') === '0,0,1080,1080');
    assert.ok(background, `${game} background missing`);
    assert.equal(background.color, app.evaluate(`GAME_THEMES.${game}.shareBg`), `${game} share colour differs from its theme`);
    backgrounds.add(background.color);
  }
  assert.equal(backgrounds.size, 8, 'Every game needs its own share card background colour');
});

test('Share card uses native file sharing when the browser supports it', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'vowels',mode:'unlimited',score:2,completed:3,elapsedMs:42000})");
  app.evaluate("navigator.canShare=() => true; navigator.share=async payload => { if (!payload.files?.length) throw Error('No score card'); }");
  await app.evaluate('shareCard()');
  assert.equal(app.wasDownloaded(), false);
  assert.equal(app.get('share-status').textContent, 'Score card ready to share.');
});

test('Desktop Share copies the PNG when native file sharing is unavailable', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'trails',mode:'quiz',score:4,completed:10,elapsedMs:80000})");
  app.evaluate("globalThis.ClipboardItem=class { constructor(data){this.data=data} }; navigator.clipboard={write:async items=>{globalThis.copiedImage=items[0].data['image/png']}};");
  await app.get('share-button').click();
  assert.equal(app.wasDownloaded(), false);
  assert.strictEqual(app.evaluate('copiedImage'), app.objectUrls[0].blob);
  assert.match(app.get('share-status').textContent, /Image copied/);
  await app.get('copy-image-button').click();
  assert.match(app.get('share-status').textContent, /Image copied/);
});

test('Desktop Share copies the image instead of invoking a silent system share', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'trails',mode:'quiz',score:4,completed:10,elapsedMs:80000})");
  app.evaluate("window.matchMedia=()=>({matches:true});globalThis.ClipboardItem=class { constructor(data){this.data=data} };navigator.clipboard={write:async items=>{globalThis.copiedImage=items[0].data['image/png']}};navigator.canShare=()=>true;navigator.share=async()=>{throw Error('System share should not run on desktop')};");
  await app.get('share-button').click();
  assert.equal(app.wasDownloaded(), false);
  assert.strictEqual(app.evaluate('copiedImage'), app.objectUrls[0].blob);
  assert.match(app.get('share-status').textContent, /Image copied/);
});

test('The result tile itself shares and Save PNG bypasses native sharing', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'trails',mode:'quiz',score:4,completed:10,elapsedMs:80000})");
  await app.get('share-preview').click();
  assert.equal(app.wasDownloaded(), true);
  assert.match(app.get('share-status').textContent, /saved to Downloads/);
  const direct = setup();
  direct.evaluate("Object.assign(state,{game:'vowels',mode:'quiz',score:4,completed:10,elapsedMs:80000})");
  direct.evaluate('navigator.canShare=() => true; navigator.share=async () => { throw Error("Native share should not run"); }');
  await direct.get('download-button').click();
  assert.equal(direct.wasDownloaded(), true);
});

test('Unlimited ends on a mistake and awards the existing score', () => {
  const app = setup();
  app.startTimed(1);
  app.submit(app.state().questions[0].answer);
  app.get('next-button').click();
  app.submit('wrong answer');
  app.get('next-button').click();
  assert.equal(app.get('share-score').textContent, '1 right');
  assert.equal(app.get('share-detail').textContent, '1 correct · 2 questions completed');
  assert.equal(app.get('share-mode').textContent, 'Unlimited');
  assert.equal(app.get('results').hidden, false);
});

test('Unlimited pictures ends after every distinct answer and credits future contributors', () => {
  const app = setup();
  app.buttons[3].click();
  assert.equal(app.state().questions.length, 39);
  app.state().questions[0].contributor = 'Example Explorer';
  app.rerender();
  assert.equal(app.get('question-credit').textContent, 'The idea for this question came from ');
  assert.equal(app.get('question-credit').children[0].textContent, 'Example Explorer');
  assert.equal(app.get('question-credit').children[1].textContent, ' - DM Smarty if you want your idea to be included next!');
  app.state().tileButtons[0].click();
  app.submit(app.state().questions[0].answer);
  app.get('next-button').click();
  assert.equal(app.get('question-credit').hidden, !app.state().questions[1].contributor);
  for (let i = 1; i < 39; i++) {
    app.state().tileButtons[0].click();
    app.submit(app.state().questions[i].answer);
    app.get('next-button').click();
  }
  assert.equal(app.get('share-score').textContent, '897 points');
  assert.equal(app.get('share-detail').textContent, '39 correct · 39 questions completed');
  assert.match(app.get('result-note').textContent, /More questions coming soon/);
});

test('A 30-second timeout ends an Unlimited run', () => {
  const app = setup();
  app.startTimed(1);
  app.advance(30000);
  assert.equal(app.get('feedback').children[0].children[0].textContent, 'TIME’S UP');
  app.get('next-button').click();
  assert.equal(app.get('share-score').textContent, '0 right');
  assert.equal(app.get('share-time').textContent, 'Time 0:30');
});

test('Timed games count down before accepting answers or starting the clock', () => {
  const app = setup();
  app.buttons[0].click();
  assert.equal(app.get('start-countdown').hidden, false);
  assert.equal(app.get('countdown-number').textContent, '3');
  app.submit(app.state().questions[0].answer);
  assert.equal(app.state().answered, false);
  app.advance(1000);
  assert.equal(app.get('countdown-number').textContent, '2');
  app.advance(1000);
  assert.equal(app.get('countdown-number').textContent, '1');
  app.advance(1000);
  assert.equal(app.get('countdown-number').textContent, 'GO!');
  app.evaluate('finishCountdown()');
  assert.equal(app.get('start-countdown').hidden, true);
  app.advance(29000);
  assert.equal(app.state().answered, false);
  app.advance(1000);
  assert.equal(app.get('feedback').children[0].children[0].textContent, 'TIME’S UP');
  const picture = setup();
  picture.buttons[2].click();
  assert.equal(picture.get('start-countdown').hidden, true);
});

test('Every game has a distinct colour and results use that game colour', () => {
  const app = setup();
  const themes = app.evaluate('GAME_THEMES');
  assert.equal(new Set(Object.values(themes).map(theme => theme.accent)).size, 8);
  app.buttons[6].click();
  app.get('reveal-button').click();
  app.get('next-button').click();
  app.evaluate('results()');
  assert.equal(app.get('share-preview').dataset.game, 'trails');
});

test('Catchphrase has no timer and accepts a small typo after a panel is opened', () => {
  const app = setup();
  app.buttons[3].click();
  app.advance(60000);
  assert.equal(app.state().answered, false);
  const q = app.state().questions[0];
  app.state().tileButtons[0].click();
  const typo = q.answer.slice(0, -1) + 'x';
  app.submit(typo);
  assert.equal(app.state().score, 1);
  assert.equal(app.state().points, 23);
  assert.equal(app.get('game-title').textContent, 'Peak-a-Boo');
  assert.equal(app.get('feedback').children[0].children[1].textContent, q.answer);
  assert.equal(app.get('feedback').children[1].children[0].textContent, '+23');
  assert.match(app.get('feedback').children[1].children[1].textContent, /1 \/ 24 PANELS/);
});

test('Picture clues include the approved set, TomB_90 ideas, and one Perigate per run', () => {
  const app = setup();
  assert.equal(app.evaluate('PICTURES.length'), 40);
  assert.equal(app.evaluate('pictureQuestions().length'), 39);
  assert.equal(app.evaluate('new Set(pictureQuestions().map(q=>normal(q.answer))).size'), 39);
  assert.equal(app.evaluate("PICTURES.filter(q=>q.contributor==='TomB_90').map(q=>q.answer).sort().join(',')"), 'Jaspin,Perigate,Vesper');
  assert.equal(app.evaluate("PICTURES.find(q=>q.image.includes('Perigate%20Pear%20Gate')).contributor"), undefined);
  for (const image of ['Jaspin','Perigate','Vesper','Bellamy','Captain Book','Dungeons and Dirigibles','Finn Diesel','General Store','Halloway','Mayor Pocket','Perigate Pear Gate','Platman','RoboDoc','The Autohatter','Beardy Hamm','Cogwright','Edgar Allan Crow','Electric Gamehouse','Meowiarty','Sir Merrylegs','Spectre','Stickler','Furbish','Phantom Deeps','The Picture House','Gilded Lake','The Council of Pockets','The Silver Children']) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'docs', 'assets', 'catchphrase', `${image}.jpg`)), `${image} image missing`);
  }
});

test('All picture clues accept case, spaces, punctuation, and minor typos plus intended aliases', () => {
  const app = setup();
  app.buttons[3].click();
  assert.equal(app.evaluate("PICTURES.every(q=>isCorrect('  '+q.answer.toLowerCase().replaceAll(' ','-')+'  ',q))"), true);
  assert.equal(app.evaluate("PICTURES.every(q=>isCorrect(q.answer+'x',q))"), true);
  assert.equal(app.evaluate("isCorrect('Pocket',PICTURES.find(q=>q.answer==='Mayor Pocket'))"), true);
  assert.equal(app.evaluate("isCorrect('Vespa',PICTURES.find(q=>q.answer==='Vesper'))"), true);
  assert.equal(app.evaluate("isCorrect('Dungeons & Dirigibles',PICTURES.find(q=>q.answer==='Dungeons and Dirigibles'))"), true);
  assert.equal(app.evaluate("isCorrect('beardy-ham',PICTURES.find(q=>q.answer==='Beardy Hamm'))"), true);
  assert.equal(app.evaluate("isCorrect('cog right',PICTURES.find(q=>q.answer==='Cogwright'))"), true);
  assert.equal(app.evaluate("isCorrect('Edgar Allen Crow',PICTURES.find(q=>q.answer==='Edgar Allan Crow'))"), true);
  assert.equal(app.evaluate("isCorrect('specter',PICTURES.find(q=>q.answer==='Spectre'))"), true);
  assert.equal(app.evaluate("isCorrect('Phantom Deep',PICTURES.find(q=>q.answer==='Phantom Deeps'))"), true);
  assert.equal(app.evaluate("PICTURES.filter(q=>q.answer==='Perigate').every(q=>isCorrect('Pear Gate',q)&&isCorrect('Perry Gate',q))"), true);
});

test('Blankety Peak uses one meaningful hidden word in 152 distinct trail titles', () => {
  const trails = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'source', 'trails.json'), 'utf8'));
  const questions = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'fill-blanks.js'), 'utf8') + '\nFILL_BLANKS');
  const titles = new Map(trails.map(trail => [trail.id, trail]));
  const stop = new Set('the at if a an and are as be but by do for from had has have he her him his how i in is it its la let me my no not of oh on or our she so than that them there this to up was we what when where who why with ye you your'.split(' '));
  assert.equal(trails.length, 187);
  assert.equal(questions.length, 152);
  assert.equal(new Set(questions.map(q => q.id)).size, 152);
  assert.equal(new Set(questions.map(q => q.clue.toLowerCase())).size, 152);
  for (const q of questions) {
    const trail = titles.get(q.id);
    assert.equal(q.title, trail.title);
    assert.equal(q.season, trail.season);
    assert.equal(q.year, trail.year);
    assert.equal(q.seasonTitle, trail.seasonTitle);
    assert.equal(q.clue.split('_____').length, 2, q.title);
    assert.equal(q.clue.replace('_____', q.answer), q.title);
    assert.ok(!stop.has(q.answer.toLowerCase()), q.title);
    assert.ok(q.answer.length >= 3, q.title);
  }
  assert.equal(questions.find(q => q.title === 'The Great Rank Glitch').answer, 'Glitch');
  assert.equal(questions.find(q => q.title === 'No “I” In Conspiracy').answer, 'Conspiracy');
  assert.ok(!questions.some(q => q.title === 'Time After Time'));
});

test('Blankety Peak is untimed and shows the instruction, season, year, reveal and round rules', () => {
  const app = setup();
  app.buttons[10].click();
  assert.equal(app.state().questions.length, 10);
  assert.equal(app.state().countingDown, false);
  assert.equal(app.get('start-countdown').hidden, true);
  assert.equal(app.get('game-title').textContent, 'Blankety Peak');
  assert.equal(app.get('blank-instruction').textContent, 'Fill in the blank in the trail name below');
  assert.equal(app.get('blank-instruction').hidden, false);
  assert.equal(app.get('answer-label').textContent, 'Missing word');
  assert.match(app.get('blank-hint').textContent, /LETTERS · TYPE THE MISSING WORD/);
  const q = app.state().questions[0];
  assert.equal(app.get('blank-source').textContent, `${q.season} ${q.year} · ${q.seasonTitle}`);
  assert.equal(app.get('clue').children[0].children[1].textContent, '?');
  app.advance(60000);
  assert.equal(app.state().answered, false);
  app.submit(q.answer.toLowerCase());
  assert.equal(app.state().score, 1);
  assert.equal(app.get('score-label').textContent, '1 CORRECT');
  assert.equal(app.get('clue').children[0].textContent, q.title);
  assert.equal(app.get('feedback').children[0].children[1].textContent, q.answer);
  assert.equal(app.get('feedback').children[0].children[2].textContent, q.title);
  app.get('next-button').click();
  app.get('reveal-button').click();
  assert.equal(app.state().score, 1);
  assert.equal(app.get('clue').children[0].textContent, app.state().questions[1].title);
  const unlimited = setup();
  unlimited.buttons[11].click();
  assert.equal(unlimited.state().questions.length, 152);
  unlimited.advance(60000);
  assert.equal(unlimited.state().answered, false);
  unlimited.submit('a completely wrong word');
  assert.equal(unlimited.state().elapsedMs !== null, true);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'docs', 'style.css'), 'utf8'), /data-game="blanks"\] \.timer-instrument,[^\n]*\.timer-track\{display:none\}/);
});

test('Lost in the Lore uses description words and four contextual choices, separate from Blankety Peak', () => {
  const trails = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'source', 'trails.json'), 'utf8'));
  const questions = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'lore-gap.js'), 'utf8') + '\nLORE_GAP');
  const byId = new Map(trails.map(trail => [trail.id, trail]));
  assert.equal(questions.length, 168);
  assert.equal(new Set(questions.map(q => q.id)).size, 168);
  for (const q of questions) {
    const trail = byId.get(q.id);
    assert.equal(q.title, trail.title);
    assert.equal(q.season, trail.season);
    assert.equal(q.year, trail.year);
    assert.equal(q.seasonTitle, trail.seasonTitle);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.options.includes(q.answer));
    assert.equal(q.clue.split('_____').length, 2);
    assert.ok(trail.searchText.toLowerCase().includes(q.clue.replace('_____', q.answer).toLowerCase()), q.title);
    assert.ok(!trail.title.toLowerCase().includes(q.answer.toLowerCase()), q.title);
    assert.ok(!q.clue.toLowerCase().includes(q.answer.toLowerCase()), q.title);
    for (const option of q.options.slice(1)) assert.ok(!`${q.title} ${q.clue}`.toLowerCase().includes(option.toLowerCase()), `${q.title}: ${option}`);
  }
  assert.equal(questions.find(q => q.title === 'Question Me This').answer, 'Cogwright');
  assert.equal(questions.find(q => q.title === 'Mayor Of The Universe').answer, 'Hogwood');
  assert.deepEqual(Array.from(questions.find(q => q.answer === 'Arrogoth').options), ['Arrogoth', 'Migas', 'Pigbert', 'Omegamon']);
  assert.deepEqual(Array.from(questions.find(q => q.answer === 'Aggrogoth').options), ['Aggrogoth', 'Migas', 'Pigbert', 'Omegamon']);
  assert.deepEqual(Array.from(questions.find(q => q.answer === 'Dr Horus').options), ['Dr Horus', 'Dr Silver', 'Dr Jorum', 'Dr Winter']);
  assert.deepEqual(Array.from(questions.find(q => q.answer === 'Finn Diesel').options), ['Finn Diesel', 'Mason Briggs', 'Myne Bland', 'Alvin Sheldrake']);
  assert.deepEqual(Array.from(questions.find(q => q.answer === 'RoboDJ').options), ['RoboDJ', 'RoboDoc', 'Jonabot', 'Prostlebot']);
  assert.equal(vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'fill-blanks.js'), 'utf8') + '\nFILL_BLANKS.length'), 152);
});

test('Lost in the Lore shows title and season, accepts a choice, and has no timer', () => {
  const app = setup();
  app.buttons[12].click();
  assert.equal(app.state().questions.length, 10);
  assert.equal(app.state().countingDown, false);
  assert.equal(app.get('game-title').textContent, 'Lost in the Lore');
  assert.equal(app.get('blank-instruction').hidden, true);
  assert.equal(app.get('lore-heading').hidden, false);
  assert.equal(app.get('lore-choices').hidden, false);
  assert.equal(app.get('answer-form').hidden, true);
  const q = app.state().questions[0];
  assert.equal(app.get('lore-title').textContent, q.title);
  assert.equal(app.get('lore-source').textContent, `${q.season} ${q.year} · ${q.seasonTitle}`);
  assert.equal(app.get('clue').children[0].children[1].textContent, '?');
  assert.equal(app.state().choiceButtons.length, 4);
  app.advance(60000);
  assert.equal(app.state().answered, false);
  app.state().choiceButtons.find(button => button.dataset.answer === q.answer).click();
  assert.equal(app.state().score, 1);
  assert.equal(app.get('clue').children[0].textContent, q.clue.replace('_____', q.answer));
  assert.equal(app.state().choiceButtons.every(button => button.disabled), true);
  app.get('next-button').click();
  app.get('reveal-button').click();
  assert.equal(app.state().score, 1);
  const unlimited = setup();
  unlimited.buttons[13].click();
  assert.equal(unlimited.state().questions.length, 168);
  const wrong = unlimited.state().choiceButtons.find(button => button.dataset.answer !== unlimited.state().questions[0].answer);
  wrong.click();
  assert.equal(unlimited.state().elapsedMs !== null, true);
  unlimited.get('next-button').click();
  assert.equal(unlimited.get('share-game').textContent, 'Lost in the Lore');
});

test('Browser Back returns from a game to the portal and Forward restores the run', () => {
  const app = setup();
  app.startTimed(0);
  assert.equal(app.get('game').hidden, false);
  app.evaluate('window.history.back()');
  assert.equal(app.get('home').hidden, false);
  app.evaluate('window.history.forward()');
  assert.equal(app.get('game').hidden, false);
  assert.equal(app.state().answered, false);
});

test('Anagrams and Missing Vowels keep exact answer matching', () => {
  const app = setup();
  app.startTimed(0);
  const answer = app.state().questions[0].answer;
  app.submit(answer.slice(0, -1) + 'x');
  assert.equal(app.state().score, 0);
  assert.equal(app.get('clue').children[0].children.map(letter => letter.textContent).join('').replaceAll('\u00a0', ' '), answer);
  assert.equal(app.get('feedback').children[0].children[0].textContent, 'NOT QUITE');
});

test('A wrong Missing Vowels answer still reveals the completed word', () => {
  const app = setup();
  app.startTimed(4);
  const answer = app.state().questions[0].answer;
  app.submit('WRONG ANSWER');
  assert.equal(app.state().score, 0);
  assert.equal(app.get('clue').children[0].children.map(letter => letter.textContent).join('').replaceAll('\u00a0', ' '), answer);
});

test('Missing Vowels removes A E I O U while preserving word breaks', () => {
  const app = setup();
  assert.equal(app.buttons[4].disabled, false);
  assert.equal(app.evaluate("withoutVowels('PHANTOM PEAK')"), 'PHNTM PK');
  assert.equal(app.evaluate('MISSING_VOWELS.length'), 116);
  assert.ok(app.evaluate('vowelQuestions().length') >= 115);
  assert.equal(app.evaluate("MISSING_VOWELS.some(q => q.answer === 'TERENCE THE TALKING PLATYPUS')"), true);
  app.startTimed(4);
  assert.equal(app.state().questions.length, 10);
});

test('Missing Vowels accepts every bank answer with the displayed consonants', () => {
  const app = setup();
  app.startTimed(5);
  const group = app.evaluate("vowelQuestions().find(q => q.clue === 'JNCN')");
  assert.equal(group.answer, 'JONACOIN');
  assert.deepEqual(Array.from(group.accepted).sort(), ['JONACOIN', 'JONACON']);
  app.state().questions[0] = group;
  app.rerender();
  assert.equal(app.get('vowel-hint').textContent, '8 LETTERS');
  assert.equal(app.evaluate("isCorrect('JONACON', vowelQuestions().find(q => q.clue === 'JNCN'))"), true);
  assert.equal(app.evaluate("isCorrect('JONACOIN', vowelQuestions().find(q => q.clue === 'JNCN'))"), true);
  assert.equal(app.evaluate("isCorrect('JONACO', vowelQuestions().find(q => q.clue === 'JNCN'))"), false);
  app.submit('JONACON');
  assert.equal(app.get('clue').children[0].children.map(letter => letter.textContent).join(''), 'JONACON');
});

test('Missing Vowels drops every vowel at once before showing feedback', async () => {
  const app = setup();
  app.startTimed(5);
  const group = app.evaluate("vowelQuestions().find(q => q.clue === 'JNCN')");
  app.state().questions[0] = group;
  app.rerender();
  app.evaluate("window.dropCalls=[]; const create=document.createElement.bind(document); document.createElement=tag=>{const el=create(tag); if(tag==='span')el.animate=(frames,options)=>{window.dropCalls.push({letter:el.textContent,delay:options.delay||0});return {finished:Promise.resolve()}}; return el}");
  app.submit('JONACON');
  assert.deepEqual(Array.from(app.evaluate('window.dropCalls.map(call=>call.letter)')), ['O', 'A', 'O']);
  assert.equal(app.evaluate('window.dropCalls.every(call=>call.delay===0)'), true);
  await app.evaluate('new Promise(resolve=>setTimeout(resolve,0))');
  assert.equal(app.get('feedback').hidden, false);
});

test('All anagram scrambles use exactly the answer letters and future picture clues get typo tolerance', () => {
  const app = setup();
  assert.equal(app.evaluate('ANAGRAMS.length'), 94);
  assert.equal(app.evaluate("ANAGRAMS.every(q => [...q.scramble.replaceAll(' ','')].sort().join('') === [...q.answer.replaceAll(' ','')].sort().join(''))"), true);
  app.buttons[3].click();
  assert.equal(app.evaluate("isCorrect('Copperr', {answer:'Copper'})"), true);
  assert.equal(app.evaluate("isCorrect('Rockbolt', {answer:'Rockbolt Theatre'})"), true);
  assert.equal(app.evaluate("isCorrect('wrong place', {answer:'Rockbolt Theatre'})"), false);
});

test('What Trail? has 187 unique clues with three distinct choices and runs as a ten-question quiz', () => {
  const app = setup();
  assert.equal(app.evaluate('WHAT_TRAILS.length'), 187);
  assert.equal(app.evaluate('new Set(WHAT_TRAILS.map(q => q.id)).size'), 187);
  assert.equal(app.evaluate('WHAT_TRAILS.every(q => q.options.length === 3 && new Set(q.options).size === 3 && q.options.includes(q.answer))'), true);
  app.buttons[6].click();
  assert.equal(app.state().questions.length, 10);
  assert.equal(app.state().choiceButtons.length, 3);
  assert.equal(app.get('answer-form').hidden, true);
  const answer = app.state().questions[0].answer;
  app.state().choiceButtons.find(button => button.dataset.answer === answer).click();
  assert.equal(app.state().score, 1);
  assert.equal(app.get('clue').children.at(-1).children[1].textContent, 'TRAIL FOUND');
});

test('What Trail? Unlimited ends on a wrong choice and counts completed questions', () => {
  const app = setup();
  app.buttons[7].click();
  assert.equal(app.state().questions.length, 187);
  const answer = app.state().questions[0].answer;
  app.state().choiceButtons.find(button => button.dataset.answer !== answer).click();
  assert.equal(app.get('clue').children.at(-1).children[1].textContent, 'WRONG TRAIL');
  app.get('next-button').click();
  assert.equal(app.get('share-game').textContent, 'Trail and Error');
  assert.equal(app.get('share-score').textContent, '0 right');
  assert.equal(app.get('share-detail').textContent, '0 correct · 1 question completed');
});

test('What Trail? has no countdown or question timer', () => {
  const app = setup();
  app.buttons[7].click();
  assert.equal(app.state().countingDown, false);
  assert.equal(app.get('start-countdown').hidden, true);
  app.advance(60000);
  assert.equal(app.state().answered, false);
  const answer = app.state().questions[0].answer;
  app.state().choiceButtons.find(button => button.dataset.answer === answer).click();
  assert.equal(app.state().score, 1);
});

test('Save-A-Platy uses all 187 trail names, keeps used keys in place, and scores saved lives', async () => {
  const app = setup();
  app.buttons[8].click();
  assert.equal(app.state().questions.length, 10);
  assert.equal(app.state().countingDown, false);
  assert.equal(app.get('answer-form').hidden, true);
  assert.equal(app.get('platy-keyboard').children.length, 26);
  assert.equal(app.get('platy-lives').children[1].children.length, 6);
  app.advance(60000);
  assert.equal(app.state().answered, false);
  const answer = app.state().questions[0].answer.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const letters = [...new Set([...answer].filter(letter => /^[A-Z]$/.test(letter)))];
  const miss = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].find(letter => !answer.includes(letter));
  app.get('platy-keyboard').children.find(key => key.textContent === miss).click();
  assert.equal(app.state().platyMisses, 1);
  assert.equal(app.get('platy-keyboard').children.length, 26);
  assert.equal(app.get('platy-keyboard').children.find(key => key.textContent === miss).disabled, true);
  assert.equal(app.get('platy-lives').children[1].children.length, 6);
  for (const letter of letters) app.keydown(letter.toLowerCase());
  assert.equal(app.state().score, 1);
  assert.equal(app.state().points, 5);
  assert.equal(app.get('score-label').textContent, '5 SAVED');
  await app.evaluate('drawShareCard()');
  assert.ok(app.canvasText.includes('5'));
  assert.ok(app.canvasText.includes('PLATYPUSES'));
  assert.ok(app.canvasImages.some(image => image.src.includes('save-a-platy.png')));
});

test('Save-A-Platy Unlimited ends after six mistakes and awards the accumulated score', () => {
  const app = setup();
  app.buttons[9].click();
  assert.equal(app.state().questions.length, 187);
  const first = app.state().questions[0].answer.toUpperCase();
  for (const letter of [...new Set([...first].filter(letter => /^[A-Z]$/.test(letter)))]) app.keydown(letter);
  assert.equal(app.state().points, 6);
  app.get('next-button').click();
  const second = app.state().questions[1].answer.toUpperCase();
  const wrong = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(letter => !second.includes(letter)).slice(0, 6);
  for (const letter of wrong) app.get('platy-keyboard').children.find(key => key.textContent === letter).click();
  assert.equal(app.state().answered, true);
  app.get('next-button').click();
  assert.equal(app.get('share-score').textContent, '6 platypuses saved');
  assert.equal(app.get('share-detail').textContent, '1 trail solved · 2 questions completed');
  assert.equal(app.get('share-game').textContent, 'Save-A-Platy');
});

test('Save-A-Platy shimmers the solved name, then counts each platypus before Next appears', async () => {
  const app = setup();
  app.evaluate("const create=document.createElement.bind(document);document.createElement=tag=>{const el=create(tag);if(tag==='div')el.animate=()=>({finished:Promise.resolve()});return el};setTimeout=fn=>{fn();return 1}");
  app.buttons[8].click();
  const counts=[];let current='';
  Object.defineProperty(app.get('platy-reveal-count'), 'textContent', {
    get(){return current},set(value){current=value;counts.push(value)}
  });
  const answer = app.state().questions[0].answer.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const miss = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].find(letter => !answer.includes(letter));
  app.get('platy-keyboard').children.find(key => key.textContent === miss).click();
  for (const letter of [...new Set([...answer].filter(letter => /^[A-Z]$/.test(letter)))]) app.keydown(letter);
  assert.equal(app.get('feedback').hidden, true);
  await new Promise(setImmediate);
  assert.deepEqual(counts, ['0','1','2','3','4','5']);
  assert.equal(app.get('platy-reveal').hidden, false);
  assert.equal(app.get('platy-keyboard').hidden, true);
  assert.equal(app.get('score-label').textContent, '5 SAVED');
  assert.equal(app.get('feedback').hidden, true);
  assert.equal(app.get('next-button').hidden, false);
});

test('Save-A-Platy shows the full saved count immediately with reduced motion', () => {
  const app = setup();
  app.evaluate('window.matchMedia=()=>({matches:true})');
  app.buttons[8].click();
  const answer = app.state().questions[0].answer.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  for (const letter of [...new Set([...answer].filter(letter => /^[A-Z]$/.test(letter)))]) app.keydown(letter);
  assert.equal(app.get('platy-reveal-count').textContent, '6');
  assert.equal(app.get('feedback').hidden, true);
  assert.equal(app.get('next-button').hidden, false);
});

test('Save-A-Platy reveals a failed trail without a redundant feedback box', () => {
  const app = setup();
  app.buttons[9].click();
  const answer = app.state().questions[0].answer.toUpperCase();
  for (const letter of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(letter => !answer.includes(letter)).slice(0, 6)) app.keydown(letter);
  assert.equal(app.get('feedback').hidden, true);
  assert.equal(app.get('next-button').hidden, false);
  assert.equal(app.get('platy-lives').children[0].textContent, '0 / 6 SAVED');
  assert.equal(app.get('platy-reveal').hidden, true);
});

test('Recent trail anagrams and guessable trail vowel clues match archived titles', () => {
  const app = setup();
  assert.equal(app.evaluate('RECENT_TRAIL_ANAGRAMS.length'), 7);
  assert.equal(app.evaluate('RECENT_TRAIL_ANAGRAMS.every(q=>q.year>=2025&&WHAT_TRAILS.some(trail=>trail.answer.toUpperCase()===q.answer))'), true);
  assert.equal(app.evaluate('ACCESSIBLE_TRAIL_VOWELS.length'), 13);
  assert.equal(app.evaluate('ACCESSIBLE_TRAIL_VOWELS.every(q=>q.year>=2024&&WHAT_TRAILS.some(trail=>trail.answer.toUpperCase()===q.answer))'), true);
  assert.equal(app.evaluate("vowelQuestions().some(q=>q.answer==='ACCESS DENIED'&&q.clue==='CCSS DND')"), true);
  assert.equal(app.evaluate("vowelQuestions().some(q=>q.answer==='NO STRINGS ATTACHED')"), true);
});

test('Blue diamant timeline chains trails and treats a season as one point in time', () => {
  const app = setup();
  app.buttons[14].click();
  const questions = app.state().questions;
  assert.equal(questions.length, 10);
  assert.equal(app.get('game-title').textContent, 'Fun With Blue Diamant');
  assert.equal(app.get('timeline-choices').children.length, 3);
  assert.equal(app.get('answer-form').hidden, true);
  assert.equal(app.get('clue').children[0].children[0].children[0].textContent, 'BASE TRAIL');
  assert.match(app.get('clue').children[0].children[0].children[2].textContent, /\d{4}/);
  assert.equal(app.get('clue').children[0].children[2].children[0].textContent, 'THIS TRAIL');
  assert.equal(app.get('clue').children[0].children[2].children[2].textContent,
    `Does this trail come before, after or during the same season as ${questions[0].anchor.title}?`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const expected = q.anchor.rank === q.candidate.rank ? 'Same Season' : q.anchor.rank > q.candidate.rank ? 'Before' : 'After';
    assert.equal(q.answer, expected);
    if (i) assert.equal(q.anchor.id, questions[i - 1].candidate.id);
  }
  assert.ok(questions.filter(q => q.answer === 'Same Season').length >= 2);
  const first = questions[0];
  app.get('timeline-choices').children.find(button => button.dataset.answer === first.answer).click();
  assert.equal(app.state().score, 1);
  assert.equal(app.get('next-button').hidden, false);
  app.get('next-button').click();
  assert.equal(app.state().index, 1);
  assert.equal(app.get('clue').children[0].children[0].children[1].textContent, first.candidate.title);
  for (let i = 1; i < questions.length; i++) {
    app.get('timeline-choices').children.find(button => button.dataset.answer === questions[i].answer).click();
    app.get('next-button').click();
  }
  assert.equal(app.state().score, 10);
  assert.equal(app.get('share-game').textContent, 'Fun With Blue Diamant');
  assert.equal(app.get('share-preview').dataset.game, 'timeline');
  const trails = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'source', 'trails.json'), 'utf8'));
  const dramatic = trails.find(trail => trail.title === 'The Dramatic Question');
  assert.match(dramatic.searchText, /blue diamant controls time, red controls space/);
});

test('Blue diamant Unlimited ends on the first incorrect placement', () => {
  const app = setup();
  app.buttons[15].click();
  const answer = app.state().questions[0].answer;
  app.get('timeline-choices').children.find(button => button.dataset.answer !== answer).click();
  assert.equal(app.state().completed, 1);
  assert.equal(app.state().score, 0);
  app.get('next-button').click();
  assert.equal(app.get('share-score').textContent, '0 right');
  assert.equal(app.get('share-detail').textContent, '0 correct · 1 question completed');
});
