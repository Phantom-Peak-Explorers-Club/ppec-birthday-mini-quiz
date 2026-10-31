const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'docs', 'what-trail.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'app.js'), 'utf8');

function makeElement(dataset = {}) {
  return {
    dataset, hidden: false, value: '', textContent: '', style: {}, children: [],
    listeners: {}, classList: { add() {}, toggle() {} },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    setAttribute() {},
    replaceChildren(...children) { this.children = children; },
    append(...children) { this.children.push(...children); },
    focus() {}, remove() {}, click() { if (!this.disabled) this.listeners.click?.(); }
  };
}

function setup() {
  let now = 100000;
  let interval = null;
  const listeners = {};
  const historyEntries = [{}];
  let historyIndex = 0;
  const canvasText = [];
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
    makeElement({ game: 'trails', mode: 'unlimited' })
  ];
  const screens = ['home', 'game', 'results'].map(get);
  const context = vm.createContext({
    document: {
      getElementById: get,
      querySelectorAll: selector => selector === '.screen' ? screens : buttons,
      createElement: tag => {
        if (tag === 'canvas') return {
          width: 0, height: 0,
          getContext: () => ({
            createLinearGradient: () => ({ addColorStop() {} }),
            fillRect() {}, strokeRect() {}, beginPath() {}, arc() {}, fill() {}, drawImage() {},
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
  context.URL = { createObjectURL: () => 'blob:test', revokeObjectURL() {} };
  vm.runInContext(source, context);
  const state = () => vm.runInContext('state', context);
  const submit = answer => { get('answer-input').value = answer; get('answer-form').listeners.submit({ preventDefault() {} }); };
  return { get, buttons, state, submit, canvasText, wasDownloaded: () => downloadClicked,
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
  await app.evaluate('shareCard()');
  assert.equal(app.wasDownloaded(), true);
  assert.match(app.get('share-status').textContent, /PNG/);
  assert.ok(app.canvasText.some(text => text.includes('Say What You See?')));
  assert.ok(app.canvasText.some(text => text.includes('UNLIMITED')));
  assert.ok(app.canvasText.some(text => text.includes('47 PTS')));
  assert.ok(app.canvasText.some(text => text.includes('4 COMPLETED')));
  assert.ok(app.canvasText.some(text => text.includes('2:03')));
});

test('Letter and trail share cards use correct-answer scores', async () => {
  for (const [game, label] of [['anagrams', 'Littlefield’s Letters'], ['vowels', 'Missing Vowels'], ['trails', 'What Trail?']]) {
    const app = setup();
    app.evaluate(`Object.assign(state,{game:'${game}',mode:'quiz',score:8,completed:10,elapsedMs:91000})`);
    await app.evaluate('drawShareCard()');
    assert.ok(app.canvasText.some(text => text.includes(label)));
    assert.ok(app.canvasText.some(text => text.includes('QUIZ ROUND')));
    assert.ok(app.canvasText.some(text => text.includes('8 RIGHT')));
    assert.ok(app.canvasText.some(text => text.includes('10 COMPLETED')));
    assert.ok(app.canvasText.some(text => text.includes('1:31')));
  }
});

test('Share card uses native file sharing when the browser supports it', async () => {
  const app = setup();
  app.evaluate("Object.assign(state,{game:'vowels',mode:'unlimited',score:2,completed:3,elapsedMs:42000})");
  app.evaluate("navigator.canShare=() => true; navigator.share=async payload => { if (!payload.files?.length) throw Error('No score card'); }");
  await app.evaluate('shareCard()');
  assert.equal(app.wasDownloaded(), false);
  assert.equal(app.get('share-status').textContent, 'Score card ready to share.');
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

test('Unlimited pictures ends after all twelve clues and credits future contributors', () => {
  const app = setup();
  app.buttons[3].click();
  assert.equal(app.state().questions.length, 12);
  app.state().questions[0].contributor = 'Example Explorer';
  app.rerender();
  assert.equal(app.get('question-credit').textContent, 'Question contributed by Example Explorer');
  app.state().tileButtons[0].click();
  app.submit(app.state().questions[0].answer);
  app.get('next-button').click();
  assert.equal(app.get('question-credit').hidden, true);
  for (let i = 1; i < 12; i++) {
    app.state().tileButtons[0].click();
    app.submit(app.state().questions[i].answer);
    app.get('next-button').click();
  }
  assert.equal(app.get('share-score').textContent, '276 points');
  assert.equal(app.get('share-detail').textContent, '12 correct · 12 questions completed');
  assert.match(app.get('result-note').textContent, /More questions coming soon/);
});

test('A 30-second timeout ends an Unlimited run', () => {
  const app = setup();
  app.startTimed(1);
  app.advance(30000);
  assert.equal(app.get('feedback').children[0].textContent, 'Time’s up!');
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
  assert.equal(app.get('feedback').children[0].textContent, 'Time’s up!');
  const picture = setup();
  picture.buttons[2].click();
  assert.equal(picture.get('start-countdown').hidden, true);
});

test('Every game has a distinct colour and results use that game colour', () => {
  const app = setup();
  const themes = app.evaluate('GAME_THEMES');
  assert.equal(new Set(Object.values(themes).map(theme => theme.accent)).size, 4);
  app.startTimed(6);
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
  assert.equal(app.get('game-title').textContent, 'Say What You See?');
  assert.equal(app.get('feedback').children[1].textContent, q.answer);
  assert.equal(app.get('feedback').children[2].children[0].textContent, '+23 POINTS');
  assert.match(app.get('feedback').children[2].children[1].textContent, /1 OF 24 PANELS USED/);
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
});

test('Missing Vowels removes A E I O U while preserving word breaks', () => {
  const app = setup();
  assert.equal(app.buttons[4].disabled, false);
  assert.equal(app.evaluate("withoutVowels('PHANTOM PEAK')"), 'PHNTM PK');
  assert.equal(app.evaluate('MISSING_VOWELS.length'), 103);
  assert.equal(app.evaluate('vowelQuestions().length'), 102);
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
  assert.equal(app.evaluate('ANAGRAMS.length'), 87);
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
  app.startTimed(6);
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
  app.startTimed(7);
  assert.equal(app.state().questions.length, 187);
  const answer = app.state().questions[0].answer;
  app.state().choiceButtons.find(button => button.dataset.answer !== answer).click();
  assert.equal(app.get('clue').children.at(-1).children[1].textContent, 'WRONG TRAIL');
  app.get('next-button').click();
  assert.equal(app.get('share-game').textContent, 'What Trail?');
  assert.equal(app.get('share-score').textContent, '0 right');
  assert.equal(app.get('share-detail').textContent, '0 correct · 1 question completed');
});

test('What Trail? uses the 30-second question timer', () => {
  const app = setup();
  app.startTimed(7);
  app.advance(30000);
  assert.equal(app.get('feedback').children[0].textContent, 'Time’s up!');
  app.get('next-button').click();
  assert.equal(app.get('share-detail').textContent, '0 correct · 1 question completed');
});
