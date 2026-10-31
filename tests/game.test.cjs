const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'docs', 'app.js'), 'utf8');

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
  const nodes = new Map();
  const get = id => nodes.get(id) || (nodes.set(id, Object.assign(makeElement(), { id })), nodes.get(id));
  const buttons = [
    makeElement({ game: 'anagrams', mode: 'quiz' }),
    makeElement({ game: 'anagrams', mode: 'unlimited' }),
    makeElement({ game: 'catchphrase', mode: 'quiz' }),
    makeElement({ game: 'catchphrase', mode: 'unlimited' }),
    makeElement({ game: 'vowels', mode: 'quiz' }),
    makeElement({ game: 'vowels', mode: 'unlimited' })
  ];
  const screens = ['home', 'game', 'results'].map(get);
  const context = vm.createContext({
    document: {
      getElementById: get,
      querySelectorAll: selector => selector === '.screen' ? screens : buttons,
      createElement: () => makeElement(),
      body: makeElement()
    },
    window: { scrollTo() {} },
    Date: { now: () => now }, Math, String, setTimeout, URL,
    setInterval: fn => { interval = fn; return 1; },
    clearInterval: () => { interval = null; },
    navigator: {}, File: class {}
  });
  vm.runInContext(source, context);
  const state = () => vm.runInContext('state', context);
  const submit = answer => { get('answer-input').value = answer; get('answer-form').listeners.submit({ preventDefault() {} }); };
  return { get, buttons, state, submit,
    rerender: () => vm.runInContext('render()', context),
    advance: ms => { now += ms; interval?.(); },
    evaluate: code => vm.runInContext(code, context)
  };
}

test('Quiz Round uses ten questions and includes game, mode, score, and time in results', () => {
  const app = setup();
  app.buttons[0].click();
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

test('Unlimited ends on a mistake and awards the existing score', () => {
  const app = setup();
  app.buttons[1].click();
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
  app.buttons[1].click();
  app.advance(30000);
  assert.equal(app.get('feedback').children[0].textContent, 'Time’s up!');
  app.get('next-button').click();
  assert.equal(app.get('share-score').textContent, '0 right');
  assert.equal(app.get('share-time').textContent, 'Time 0:30');
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
});

test('Anagrams and Missing Vowels keep exact answer matching', () => {
  const app = setup();
  app.buttons[0].click();
  const answer = app.state().questions[0].answer;
  app.submit(answer.slice(0, -1) + 'x');
  assert.equal(app.state().score, 0);
});

test('Missing Vowels removes A E I O U while preserving word breaks', () => {
  const app = setup();
  assert.equal(app.buttons[4].disabled, false);
  assert.equal(app.evaluate("withoutVowels('PHANTOM PEAK')"), 'PHNTM PK');
  assert.equal(app.evaluate('MISSING_VOWELS.length'), 102);
  assert.equal(app.evaluate("MISSING_VOWELS.some(q => q.answer === 'TERENCE THE TALKING PLATYPUS')"), true);
  app.buttons[4].click();
  assert.equal(app.state().questions.length, 10);
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
