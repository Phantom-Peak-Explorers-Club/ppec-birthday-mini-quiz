const ANAGRAMS = [
  {scramble:'JCNOOA',answer:'JONACO',tier:1},
  {scramble:'PYPASTUL',answer:'PLATYPUS',tier:1},
  {scramble:'HOLYLAWA',answer:'HALLOWAY',tier:1},
  {scramble:'COOBORD',answer:'ROBODOC',tier:1},
  {scramble:'DLTITEIFLLE',answer:'LITTLEFIELD',tier:2},
  {scramble:'IRGCHOWTG',answer:'COGWRIGHT',tier:2},
  {scramble:'MYRAO EKCTOP',answer:'MAYOR POCKET',tier:2},
  {scramble:'LNBOJSAA',answer:'JONALABS',tier:2},
  {scramble:'HALWODLE AEKP',answer:'HALLOWED PEAK',tier:3},
  {scramble:'TRFHEA ASTLMPA',answer:'FATHER PLATMAS',tier:3},
  {scramble:'EADMAM AECMNIAHC',answer:'MADAME MECHANICA',tier:3},
  {scramble:'OKROTBCL HTERAET',answer:'ROCKBOLT THEATRE',tier:3},
  {scramble:'IRECTCEL MEEUGSOAH',answer:'ELECTRIC GAMEHOUSE',tier:3},
  {scramble:'MHHCAI EC UHU TOORSY TFCPPLSC',answer:'CHURCH OF THE COSMIC PLATYPUS',tier:4},
  {scramble:'LSSYHIP FO UASPYTLP OCKR',answer:'PHYLISS OF PLATYPUS ROCK',tier:4},
  {scramble:'HEERT WSA ON ABTO EDRI',answer:'THERE WAS NO BOAT RIDE',tier:4},
  {scramble:'ECENETR ETH KTGNALI PALPUTYS',answer:'TERENCE THE TALKING PLATYPUS',tier:4}
];
// Curated from the PPEC Trail Notes index and Phantom Peak's published maps.
// Keeping the answer here lets future terms join both letter games consistently.
const LORE_TERMS = [
  {answer:'JONAS',tier:1},{answer:'PIUS',tier:1},{answer:'PAX',tier:1},{answer:'ZENIA',tier:1},
  {answer:'BRUTUS',tier:1},{answer:'HOGWOOD',tier:1},{answer:'REXFORD',tier:1},{answer:'PLATMAN',tier:1},
  {answer:'KLACKY',tier:1},{answer:'DATCHERY',tier:1},{answer:'BELLAMY',tier:1},{answer:'PERIGATE',tier:1},
  {answer:'NARVIS',tier:1},{answer:'FURBISH',tier:1},{answer:'SPECTRE',tier:1},{answer:'LEADBELLY',tier:1},
  {answer:'STICKLER',tier:1},{answer:'ROBO DJ',tier:1},{answer:'JONACO',tier:1},{answer:'JONASSIST',tier:1},
  {answer:'DIAMANT',tier:1},{answer:'JONACOIN',tier:1},{answer:'MIRAMINE',tier:1},{answer:'PLATYHOOKS',tier:1},
  {answer:'ALEX ZANE',tier:2},{answer:'BIG IGGY',tier:2},{answer:'CAPTAIN BOOK',tier:2},
  {answer:'CHONKY CHUCK',tier:2},{answer:'DOGTOR WATSON',tier:2},{answer:'DR HORUS',tier:2},
  {answer:'FINN DIESEL',tier:2},{answer:'KING TEMU IV',tier:2},{answer:'MR FEAST',tier:2},
  {answer:'LADY OINKERTON',tier:2},{answer:'SIR MERRYLEGS',tier:2},
  {answer:'THE QUESTIONER',tier:2},{answer:'THE CALCULATOR',tier:2},
  {answer:'PHANTOM DEEPS',tier:2},{answer:'GILDED LAKE',tier:2},
  {answer:'CANAL STREET',tier:2},{answer:'GENERAL STORE',tier:2},
  {answer:'COPPER CAULDRON',tier:2},{answer:'THE HALL OF ART',tier:2},
  {answer:'CARNIVAL TENT',tier:2},{answer:'BLIMP WRECKAGE',tier:2},
  {answer:'THE COOPERATIVE',tier:2},{answer:'THE RESISTANCE',tier:2},
  {answer:'VIDEOMATIC',tier:2},{answer:'JONACO ARCHIVE',tier:2},
  {answer:'BONZO THE CLOWN',tier:3},{answer:'EDGAR ALLAN CROW',tier:3},
  {answer:'FRIENDLY THE POSTIE',tier:3},{answer:'MARKETING BOT',tier:3},
  {answer:'SENSUALITY DAVIS',tier:3},{answer:'WALTER THE RACCOON',tier:3},
  {answer:'GARDEN OF INSPIRATION',tier:3},{answer:'PHANTOM SPRINGS',tier:3},
  {answer:'THE UNDERTAKER',tier:3},{answer:'SPARKS SQUAT',tier:3},
  {answer:'THE AUTOHATTER',tier:3},{answer:'THE PLATYPARTY SPACE',tier:3},
  {answer:'THE AXIOMATIC CLOCK',tier:3},{answer:'THE JONAHEDRON',tier:3},
  {answer:'FROZEN SPRINTERS',tier:3},{answer:'VANISHING KIT',tier:3},
  {answer:'HUSTLEPUS UNIVERSITY',tier:4},{answer:'THE COUNCIL OF POCKETS',tier:4},
  {answer:'THE MAGICIANS GUILD',tier:4},{answer:'JONALABS RESEARCH FACILITY',tier:4},
  {answer:'THE THIRSTY FRONTIER SALOON',tier:4},
  {answer:'ADOPT A PLATYPUS CENTRE',tier:4},
  {answer:'SCHRODINGERS CURSE',tier:4},{answer:'THE SILVER CHILDREN',tier:4}
];
function scrambleTerm(answer){
  let seed=[...answer].reduce((value,character)=>((value*33)+character.charCodeAt(0))>>>0,5381);
  return answer.split(' ').map(word=>{
    const letters=[...word];
    for(let index=letters.length-1;index>0;index--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const other=seed%(index+1);[letters[index],letters[other]]=[letters[other],letters[index]]}
    if(letters.join('')===word&&letters.length>2)letters.push(letters.shift());
    return letters.join('');
  }).join(' ');
}
const anagramAnswers=new Set(ANAGRAMS.map(q=>q.answer));
ANAGRAMS.push(...LORE_TERMS.filter(q=>q.answer.replace(/[^A-Z]/g,'').length>=5&&!anagramAnswers.has(q.answer)).map(q=>({...q,scramble:scrambleTerm(q.answer)})));
// Short, recent titles checked against the PPEC Trail Notes archive.
const RECENT_TRAIL_ANAGRAMS = [
  ['Wild Card',1],['Double Act',1],['Pocket Change',2],['Off The Rails',2],
  ['Access Denied',2],['Homeward Bound',2],['Over and Over',2]
].map(([title,tier])=>{
  const trail=WHAT_TRAILS.find(question=>question.answer===title);
  const answer=trail.answer.toUpperCase();
  return {answer,scramble:scrambleTerm(answer),tier,source:trail.source,year:trail.year,season:trail.season};
});
ANAGRAMS.push(...RECENT_TRAIL_ANAGRAMS);
const PICTURES = [
  ['Copper','Copper.jpg'],['Dr Winter','Dr Winter.jpg'],['Hogwood','Hogwood.jpg'],
  ['Leadbelly','Leadbelly.jpg'],['Littlefield','Littlefield.jpg'],['Lovehart','Lovehart.jpg'],
  ['Miramaze','Miramaze.jpg'],['Nethersole','Nethersole.jpg'],['Rexford','Rexford.jpg'],
  ['Rockbolt Theatre','Rockbolt Theatre.jpg'],['Sherlock Bones','Sherlock Bones.jpg'],['Sparks','Sparks.jpg'],
  ['Jaspin','Jaspin.jpg','TomB_90',['Jazz Pin','Jazzpin']],
  ['Perigate','Perigate.jpg','TomB_90',['Perry Gate','Perrygate']],
  ['Vesper','Vesper.jpg','TomB_90',['Vespa']],
  ['Bellamy','Bellamy.jpg',undefined,['Bell Army']],
  ['Captain Book','Captain Book.jpg'],
  ['Dungeons and Dirigibles','Dungeons and Dirigibles.jpg',undefined,['Dungeons & Dirigibles']],
  ['Finn Diesel','Finn Diesel.jpg',undefined,['Fin Diesel']],
  ['General Store','General Store.jpg'],
  ['Halloway','Halloway.jpg',undefined,['Halloween Way','Hallow Way']],
  ['Mayor Pocket','Mayor Pocket.jpg',undefined,['Pocket']],
  ['Perigate','Perigate Pear Gate.jpg',undefined,['Pear Gate','Peargate']],
  ['Platman','Platman.jpg',undefined,['Plat Man','Platypus Man']],
  ['RoboDoc','RoboDoc.jpg',undefined,['Robo Doc','Robot Doctor']],
  ['The Autohatter','The Autohatter.jpg',undefined,['Auto Hatter']],
  ['Beardy Hamm','Beardy Hamm.jpg',undefined,['Beardy Ham']],
  ['Cogwright','Cogwright.jpg',undefined,['Cog Right']],
  ['Edgar Allan Crow','Edgar Allan Crow.jpg',undefined,['Edgar Allen Crow']],
  ['Electric Gamehouse','Electric Gamehouse.jpg'],
  ['Meowiarty','Meowiarty.jpg'],
  ['Sir Merrylegs','Sir Merrylegs.jpg'],
  ['Spectre','Spectre.jpg',undefined,['Specter']],
  ['Stickler','Stickler.jpg'],
  ['Furbish','Furbish.jpg'],
  ['Phantom Deeps','Phantom Deeps.jpg',undefined,['Phantom Deep']],
  ['The Picture House','The Picture House.jpg']
].map(([answer,image,contributor,aliases=[]])=>({answer,image:`./assets/catchphrase/${encodeURIComponent(image)}`,contributor,
  aliases:[...aliases,...(answer==='Dr Winter'?['Dr. Winter','Doctor Winter','Doc Winter','Winter']:answer==='Rockbolt Theatre'?['The Rockbolt','The Rockbolt Theatre']:[])]
}));
// Contributor can be added to any question as {answer:'...', contributor:'Name'}.
function pictureQuestions(){
  const byAnswer=new Map();
  for(const question of PICTURES){
    const key=normal(question.answer);
    if(!byAnswer.has(key))byAnswer.set(key,[]);
    byAnswer.get(key).push(question);
  }
  return shuffle([...byAnswer.values()].map(variants=>shuffle(variants)[0]));
}
const MISSING_VOWELS = [
  {answer:'MAYOR POCKET'},{answer:'HALLOWAY'},{answer:'LOVEHART'},{answer:'SHERLOCK BONES'},
  {answer:'GIFFARD'},{answer:'COPPER'},{answer:'CROCHET DATCHERY'},{answer:'NETHERSOLE'},
  {answer:'SPARKS'},{answer:'LITTLEFIELD'},{answer:'DR WINTER'},{answer:'TERENCE THE TALKING PLATYPUS'},
  {answer:'ROCKBOLT THEATRE'},{answer:'JONALABS'},{answer:'ROBODOC'},{answer:'ELECTRIC GAMEHOUSE'},
  {answer:'JONAGRAPH'},{answer:'THE SUMMERHOUSE'},{answer:'THE PICTURE HOUSE'},{answer:'PHANTOM TOURS'},
  {answer:'JONACOMMS'},{answer:'JONAPOST'},{answer:'DIAMANT'},{answer:'DIGITAL DOLLAR'},
  {answer:'JONACOIN'},{answer:'JONACON'},
  {answer:'JONACOIN EXCHANGE'},{answer:'DUNGEONS AND DIRIGIBLES'},{answer:'PINKERTON AND BRUTUS'},
  {answer:'THE CODEX MAGNIFICUS'},{answer:'CHURCH OF THE COSMIC PLATYPUS'},{answer:'FATHER PLATMAS'}
];
// Familiar phrases stay solvable even for players who have not played these trails.
const ACCESSIBLE_TRAIL_VOWELS = [
  'Wild Card','Double Act','Pocket Change','Off The Rails','Access Denied',
  'Homeward Bound','Over and Over','No Strings Attached','Time After Time',
  'Death and Taxes','Love Is Blind','Failure to Launch','The Final Question'
].map(title=>{
  const trail=WHAT_TRAILS.find(question=>question.answer===title);
  return {answer:trail.answer.toUpperCase(),source:trail.source,year:trail.year,season:trail.season};
});
MISSING_VOWELS.push(...ACCESSIBLE_TRAIL_VOWELS);
const vowelAnswers=new Set(MISSING_VOWELS.map(q=>q.answer));
MISSING_VOWELS.push(...LORE_TERMS.filter(q=>!vowelAnswers.has(q.answer)).map(q=>({answer:q.answer})));
const $=id=>document.getElementById(id);
let state={game:null,mode:null,questions:[],index:0,score:0,points:0,completed:0,openedTiles:0,tileButtons:[],answered:false,startedAt:0,elapsedMs:null,exhausted:false,platyMisses:0,platyGuessed:new Set()};
let questionTimer=null;
let questionDeadline=0;
let countdownTimer=null;
let countdownGoTimer=null;
let shareBlobPromise=null;
let sharePreviewUrl=null;
const GAME_THEMES={
  anagrams:{accent:'#f2c56d',dark:'#392415',light:'#fff0c8',shareBg:'#704313'},
  catchphrase:{accent:'#65ddd0',dark:'#103c43',light:'#ddfff7',shareBg:'#07525b'},
  vowels:{accent:'#bea7ff',dark:'#342453',light:'#f0e9ff',shareBg:'#3e276b'},
  trails:{accent:'#f48f7b',dark:'#4b2931',light:'#ffe8dd',shareBg:'#762b35'},
  platy:{accent:'#a8df6e',dark:'#173b2a',light:'#ecffdc',shareBg:'#275832'},
  blanks:{accent:'#ffad87',dark:'#4a283b',light:'#fff0e6',shareBg:'#71344b'}
};
function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function normal(s){return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function typoDistance(a,b){
  if(Math.abs(a.length-b.length)>2)return 3;
  const rows=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)rows[i][0]=i;
  for(let j=0;j<=b.length;j++)rows[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
    rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])rows[i][j]=Math.min(rows[i][j],rows[i-2][j-2]+1);
  }
  return rows[a.length][b.length];
}
function pictureAnswers(q){
  const answers=[q.answer,...(q.aliases||[]),...PICTURES.filter(other=>normal(other.answer)===normal(q.answer))
    .flatMap(other=>[other.answer,...(other.aliases||[])])];
  for(const answer of [...answers]){
    if(/^the /i.test(answer))answers.push(answer.replace(/^the /i,''));
    if(/^dr\.? /i.test(answer))answers.push(answer.replace(/^dr\.? /i,'Doctor '));
    if(/ theatre$/i.test(answer))answers.push(answer.replace(/ theatre$/i,''));
  }
  return [...new Set(answers.map(normal))];
}
function isCorrect(response,q){
  const entered=normal(response);
  const exact=[q.answer,...(q.aliases||[])].some(answer=>entered===normal(answer));
  if(state.game==='vowels')return q.accepted.some(answer=>entered===normal(answer));
  if(state.game!=='catchphrase')return exact;
  if(!entered)return false;
  const variants=pictureAnswers(q);
  if(variants.includes(entered))return true;
  if(PICTURES.some(other=>normal(other.answer)!==normal(q.answer)&&pictureAnswers(other).includes(entered)))return false;
  return variants.some(answer=>entered.length>=4&&typoDistance(entered,answer)<=(answer.length>=12?2:1));
}
function withoutVowels(s){return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[AEIOU]/g,'')}
function vowelSkeleton(answer){return normal(withoutVowels(answer))}
function vowelQuestions(){
  const allAnswers=[...MISSING_VOWELS,...ANAGRAMS,...PICTURES,...WHAT_TRAILS];
  const byClue=new Map();
  for(const question of MISSING_VOWELS){
    const clue=vowelSkeleton(question.answer);
    if(!byClue.has(clue))byClue.set(clue,{...question,clue:withoutVowels(question.answer),accepted:[],contributors:[]});
    if(question.contributor&&!byClue.get(clue).contributors.includes(question.contributor))byClue.get(clue).contributors.push(question.contributor);
  }
  for(const answer of allAnswers){
    const group=byClue.get(vowelSkeleton(answer.answer));
    if(group&&!group.accepted.some(value=>normal(value)===normal(answer.answer)))group.accepted.push(answer.answer);
  }
  return shuffle([...byClue.values()]);
}
function stopTimer(){if(questionTimer!==null){clearInterval(questionTimer);questionTimer=null}}
function tickTimer(){
  if(state.answered)return;
  const remaining=Math.max(0,questionDeadline-Date.now());
  $('timer-label').textContent=`${Math.ceil(remaining/1000)}s`;
  $('timer-fill').style.width=`${remaining/30000*100}%`;
  $('timer-fill').classList.toggle('urgent',remaining<=10000);
  if(remaining===0)finishAnswer(false,false,true);
}
function startTimer(){stopTimer();questionDeadline=Date.now()+30000;tickTimer();questionTimer=setInterval(tickTimer,200)}
function stopCountdown(){
  if(countdownTimer!==null){clearInterval(countdownTimer);countdownTimer=null}
  if(countdownGoTimer!==null){clearTimeout(countdownGoTimer);countdownGoTimer=null}
  $('start-countdown').hidden=true;
}
function finishCountdown(){
  if(!state.countingDown)return;
  stopCountdown();state.countingDown=false;state.startedAt=Date.now();
  $('answer-input').focus();startTimer();
}
function startCountdown(){
  stopCountdown();state.countingDown=true;
  const overlay=$('start-countdown');const number=$('countdown-number');
  const showNumber=value=>{
    number.textContent=value;overlay.classList.toggle('go',value==='GO!');
    number.animate?.([{transform:'translateY(-14px) scale(.85)',opacity:.3},{transform:'translateY(0) scale(1)',opacity:1}],{duration:290,easing:'cubic-bezier(.2,.8,.2,1)'});
  };
  overlay.hidden=false;showNumber('3');
  const deadline=Date.now()+3000;
  countdownTimer=setInterval(()=>{
    const remaining=Math.ceil((deadline-Date.now())/1000);
    if(remaining>0){if(number.textContent!==String(remaining))showNumber(String(remaining));return}
    clearInterval(countdownTimer);countdownTimer=null;
    showNumber('GO!');countdownGoTimer=setTimeout(finishCountdown,650);
  },100);
}
function show(id,updateHistory=true){
  const previous=['home','game','results'].find(screen=>!$(screen).hidden);
  if(id!=='game'){stopTimer();stopCountdown()}
  for(const screen of document.querySelectorAll('.screen'))screen.hidden=screen.id!==id;
  if(updateHistory&&previous!==id&&window.history?.pushState)window.history.pushState({ppecScreen:id,runId:state.runId},'',`#${id}`);
  window.scrollTo({top:0,behavior:'instant'});
}
function gameName(){return state.game==='anagrams'?'Littlefield’s Letters':state.game==='vowels'?'Missing Vowels':state.game==='trails'?'What Trail?':state.game==='platy'?'Save-A-Platy':state.game==='blanks'?'Mind the Gap!':'Say What You See?'}
function modeName(){return state.mode==='quiz'?'Quiz Round':'Unlimited'}
function duration(ms){const seconds=Math.floor(ms/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function letterRow(value){
  const row=document.createElement('div');row.className='scramble';
  for(const character of value){
    const letter=document.createElement('span');letter.className=character===' '?'scramble-space':'scramble-letter';
    letter.textContent=character===' '? '\u00a0':character;row.append(letter);
  }
  return row;
}
function animateAnagram(answer){
  const row=$('clue').children[0];
  if(!row || !row.children || !row.children[0]?.getBoundingClientRect || !row.children[0]?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
    $('clue').replaceChildren(letterRow(answer));$('clue').children[0].classList.add('solved');return null;
  }
  const letters=[...row.children];
  const slots=[...answer];
  const positions=letters.map(letter=>letter.getBoundingClientRect());
  const targets=new Map();
  slots.forEach((character,index)=>{if(character!==' '){if(!targets.has(character))targets.set(character,[]);targets.get(character).push(index)}});
  const animations=[];
  for(let index=0;index<letters.length;index++){
    const character=letters[index].textContent;
    if(character==='\u00a0')continue;
    const target=targets.get(character)?.shift();
    if(target===undefined)continue;
    const dx=positions[target].left-positions[index].left;
    const dy=positions[target].top-positions[index].top;
    animations.push(letters[index].animate([
      {transform:'translate(0, 0)',color:'#f0d890'},
      {transform:`translate(${dx}px, ${dy}px)`,color:'#a5f4d0'}
    ],{duration:1000,easing:'cubic-bezier(.22, 1, .36, 1)',fill:'forwards'}).finished.catch(()=>{}));
  }
  return Promise.all(animations).then(()=>{$('clue').replaceChildren(letterRow(answer));$('clue').children[0].classList.add('solved')});
}
function animateVowels(answer){
  const row=letterRow(answer);
  row.classList.add('vowel-solution');
  const vowels=[...row.children].filter(letter=>/[AEIOU]/.test(letter.textContent));
  vowels.forEach(letter=>letter.classList.add('vowel-insert'));
  $('clue').replaceChildren(row);
  if(!vowels.length || !vowels[0].animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
    row.classList.add('solved');return null;
  }
  return Promise.all(vowels.map(letter=>letter.animate([
    {transform:'translate3d(0,-90px,0) scale(.72)',opacity:0,filter:'blur(7px)'},
    {offset:.76,transform:'translate3d(0,7px,0) scale(1.08)',opacity:1,filter:'blur(0)'},
    {transform:'translate3d(0,0,0) scale(1)',opacity:1,filter:'blur(0)'}
  ],{duration:900,easing:'cubic-bezier(.22, 1, .36, 1)',fill:'both'}).finished.catch(()=>{})))
    .then(()=>row.classList.add('solved'));
}
function showTrailVerdict(correct,timedOut){
  const verdict=document.createElement('div');
  verdict.className=`trail-verdict ${correct?'right':'wrong'}`;
  verdict.setAttribute('aria-hidden','true');
  const symbol=document.createElement('span');symbol.className='trail-verdict-symbol';symbol.textContent=correct?'✓':'×';
  const label=document.createElement('strong');label.textContent=correct?'TRAIL FOUND':timedOut?'TIME UP':'WRONG TRAIL';
  verdict.append(symbol,label);$('clue').append(verdict);
}
function renderPlatyName(answer,reveal=false){
  const row=document.createElement('div');row.className='platy-name';
  for(const word of answer.split(' ')){
    const group=document.createElement('div');group.className='platy-word';
    for(const character of word){
      const tile=document.createElement('span');tile.className='platy-letter';
      const letter=character.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
      if(/^[A-Z]$/.test(letter)){
        const visible=reveal||state.platyGuessed.has(letter);
        tile.textContent=visible?character:'\u00a0';
        tile.classList.add(visible?'found':'blank');
      }else{tile.textContent=character;tile.classList.add('punctuation')}
      group.append(tile);
    }
    row.append(group);
  }
  $('clue').replaceChildren(row);
}
function renderPlatyLives(){
  const holder=$('platy-lives');holder.replaceChildren();
  const label=document.createElement('strong');label.textContent=`${6-state.platyMisses} / 6 SAVED`;holder.append(label);
  const icons=document.createElement('div');icons.className='platy-life-icons';
  for(let index=0;index<6;index++){
    const icon=document.createElement('img');icon.src='./assets/platy-life.png';icon.alt='';
    if(index>=6-state.platyMisses)icon.classList.add('lost');
    icons.append(icon);
  }
  holder.append(icons);holder.setAttribute('aria-label',`${6-state.platyMisses} of 6 platypuses saved`);
}
function renderPlatyKeyboard(){
  const holder=$('platy-keyboard');holder.replaceChildren();
  const answer=state.questions[state.index].answer.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  for(const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
    const key=document.createElement('button');key.type='button';key.className='platy-key';key.textContent=letter;
    key.setAttribute('aria-label',`Guess ${letter}`);
    if(state.platyGuessed.has(letter)){
      key.disabled=true;key.classList.add(answer.includes(letter)?'used':'missed');
    }else if(state.answered){key.disabled=true;key.classList.add('locked')}
    key.addEventListener('click',()=>guessPlatyLetter(letter));holder.append(key);
  }
}
function animatePlatySave(saved){
  const panel=$('platy-reveal');
  const count=$('platy-reveal-count');
  const icons=$('platy-reveal-icons');
  icons.replaceChildren();count.textContent='0';
  for(let index=0;index<6;index++){
    const icon=document.createElement('img');icon.src='./assets/platy-life.png';icon.alt='';
    icon.className=index<saved?'waiting':'lost';icons.append(icon);
  }
  const row=$('clue').children[0];
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const revealTotal=()=>{
    $('platy-keyboard').hidden=true;panel.hidden=false;count.textContent=String(saved);
    [...icons.children].forEach((icon,index)=>{if(index<saved)icon.className='counted'});
    $('score-label').textContent=`${state.points} SAVED`;
  };
  if(!row?.animate||reduced){revealTotal();return null}
  row.classList.add('solving');
  [...row.children].flatMap(word=>[...word.children]).forEach((tile,index)=>{tile.style.animationDelay=`${Math.min(index,12)*15}ms`});
  const runId=state.runId,questionIndex=state.index;
  return row.animate([
    {transform:'translateX(0) scale(1)',filter:'brightness(1)'},
    {offset:.28,transform:'translateX(-3px) scale(1.025)',filter:'brightness(1.35)'},
    {offset:.52,transform:'translateX(3px) scale(1.035)',filter:'brightness(1.65)'},
    {transform:'translateX(0) scale(1)',filter:'brightness(1.1)'}
  ],{duration:880,easing:'cubic-bezier(.2,.8,.2,1)'}).finished.catch(()=>{}).then(async()=>{
    if(state.runId!==runId||state.index!==questionIndex)return;
    row.classList.remove('solving');
    $('platy-keyboard').hidden=true;panel.hidden=false;
    for(let index=0;index<saved;index++){
      await new Promise(resolve=>setTimeout(resolve,135));
      if(state.runId!==runId||state.index!==questionIndex)return;
      icons.children[index].className='counted';
      count.textContent=String(index+1);
    }
    $('score-label').textContent=`${state.points} SAVED`;
  });
}
function guessPlatyLetter(letter){
  if(state.game!=='platy'||state.answered||state.countingDown||state.platyGuessed.has(letter))return;
  state.platyGuessed.add(letter);
  const answer=state.questions[state.index].answer.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  if(!answer.includes(letter))state.platyMisses++;
  renderPlatyName(state.questions[state.index].answer);renderPlatyLives();renderPlatyKeyboard();
  const remaining=[...answer].filter(character=>/^[A-Z]$/.test(character)&&!state.platyGuessed.has(character));
  if(!remaining.length)finishAnswer(true);
  else if(state.platyMisses>=6)finishAnswer(false);
}
function start(game,mode){
  let source;
  if(game==='anagrams')source=[1,2,3,4].flatMap(tier=>shuffle(ANAGRAMS.filter(q=>q.tier===tier)));
  else if(game==='vowels')source=vowelQuestions();
  else if(game==='trails'||game==='platy')source=shuffle(WHAT_TRAILS);
  else if(game==='blanks')source=shuffle(FILL_BLANKS);
  else source=pictureQuestions();
  if(!source.length || mode==='quiz'&&source.length<10)return;
  const questions=mode==='quiz'&&game==='anagrams'?[2,3,3,2].flatMap((count,tier)=>source.filter(q=>q.tier===tier+1).slice(0,count)):mode==='quiz'?source.slice(0,10):source;
  shareBlobPromise=null;
  if(sharePreviewUrl){URL.revokeObjectURL(sharePreviewUrl);sharePreviewUrl=null}
  $('share-preview-image').hidden=true;
  $('share-preview').classList.remove('is-rendered');
  state={game,mode,questions,index:0,score:0,points:0,completed:0,openedTiles:0,tileButtons:[],choiceButtons:[],answered:false,countingDown:game==='anagrams'||game==='vowels'||game==='blanks',startedAt:Date.now(),elapsedMs:null,exhausted:false,platyMisses:0,platyGuessed:new Set(),runId:Date.now()+Math.random()};
  show('game');render();if(state.countingDown)startCountdown();
}
function render(){
  stopTimer();
  const {game,mode,questions,index,score}=state;
  const q=questions[index];
  state.answered=false;
  state.openedTiles=0;
  state.tileButtons=[];
  state.choiceButtons=[];
  $('question-count').textContent=`${index+1} / ${questions.length}`;
  $('score-label').textContent=game==='catchphrase'?`${state.points} POINTS`:game==='platy'?`${state.points} SAVED`:`${score} CORRECT`;
  $('progress-line').hidden=mode==='unlimited';
  $('progress-fill').style.width=`${index/questions.length*100}%`;
  $('question-kind').textContent=game==='anagrams'?'UNSCRAMBLE THIS':game==='vowels'?'RESTORE THE VOWELS':game==='trails'?'IDENTIFY THE TRAIL':game==='platy'?'SAVE THE PLATYPUSES':game==='blanks'?'COMPLETE THE TRAIL TITLE':'NAME THE PICTURE CLUE';
  $('game-title').textContent=gameName();
  $('game-logo').src=`./assets/game-logos/${({anagrams:'anagrams',catchphrase:'catchphrase',vowels:'missing-vowels',trails:'what-trail',platy:'save-a-platy',blanks:'fill-the-blanks'})[game]}.${game==='blanks'?'svg':'png'}${game==='blanks'?'':'?v=2'}`;
  $('game-console').dataset.game=game;
  $('question-card').dataset.game=game;
  $('vowel-hint').hidden=game!=='vowels';
  $('blank-hint').hidden=game!=='blanks';
  if(game==='vowels'){
    const count=q.answer.replace(/[^A-Za-z]/g,'').length;
    $('vowel-hint').textContent=`${count} ${count===1?'LETTER':'LETTERS'}`;
  }
  if(game==='blanks')$('blank-hint').textContent=`${q.answer.replace(/[^\p{L}\p{N}]/gu,'').length} LETTERS · TYPE THE MISSING WORD`;
  $('clue').replaceChildren();
  $('platy-lives').hidden=game!=='platy';$('platy-keyboard').hidden=game!=='platy';$('platy-reveal').hidden=true;
  if(game==='platy'){
    state.platyMisses=0;state.platyGuessed=new Set();
    renderPlatyName(q.answer);renderPlatyLives();renderPlatyKeyboard();
  }else if(game==='catchphrase'){
    const stage=document.createElement('div');stage.className='picture-stage';
    const img=document.createElement('img');img.src=q.image;img.alt=`Picture clue ${index+1}`;
    img.onerror=()=>{$('clue').textContent='This image could not be loaded.'};
    const cover=document.createElement('div');cover.className='picture-cover';cover.setAttribute('aria-label','Choose panels to reveal');
    for(let tileIndex=0;tileIndex<24;tileIndex++){
      const tile=document.createElement('button');tile.type='button';tile.className='picture-tile';
      tile.setAttribute('aria-label',`Reveal panel ${tileIndex+1}`);
      tile.addEventListener('click',()=>{
        if(state.answered||tile.disabled)return;
        tile.disabled=true;tile.classList.add('open');state.openedTiles++;
        $('answer-input').disabled=false;$('answer-submit').disabled=false;
        $('reveal-stats').textContent=`${state.openedTiles} / 24 PANELS OPEN · ${Math.max(0,24-state.openedTiles)} POSSIBLE POINTS`;
      });
      state.tileButtons.push(tile);cover.append(tile);
    }
    stage.append(img,cover);$('clue').append(stage);
  }else if(game==='trails'){
    const recap=document.createElement('p');recap.className='trail-recap';recap.textContent=q.clue;$('clue').append(recap);
  }else if(game==='blanks'){
    const title=document.createElement('p');title.className='blank-title';
    const [before,after]=q.clue.split('_____');
    const prefix=document.createElement('span');prefix.textContent=before;
    const gap=document.createElement('strong');gap.className='blank-space';gap.textContent='?';
    gap.setAttribute('role','img');gap.setAttribute('aria-label','missing word');
    const suffix=document.createElement('span');suffix.textContent=after;
    title.append(prefix,gap,suffix);$('clue').append(title);
  }else $('clue').append(game==='anagrams'?letterRow(q.scramble):letterRow(q.clue));
  $('trail-choices').replaceChildren();$('trail-choices').hidden=game!=='trails';
  if(game==='trails')shuffle(q.options).forEach((title,choiceIndex)=>{
    const button=document.createElement('button');button.type='button';button.className='trail-choice';button.dataset.answer=title;
    const letter=document.createElement('span');letter.className='choice-letter';letter.textContent='ABC'[choiceIndex];
    const label=document.createElement('span');label.textContent=title;button.append(letter,label);
    button.addEventListener('click',()=>{if(!state.answered&&!state.countingDown){if(title!==q.answer)button.classList.add('wrong');finishAnswer(title===q.answer)}});
    state.choiceButtons.push(button);$('trail-choices').append(button);
  });
  const credit=game==='vowels'?(q.contributors||[]).join(', '):q.contributor;
  const creditLine=$('question-credit');creditLine.hidden=!credit;creditLine.replaceChildren();
  creditLine.textContent=credit?'The idea for this question came from ':'';
  if(credit){
    const name=document.createElement('strong');name.textContent=credit;
    const invitation=document.createElement('span');invitation.textContent=' - DM Smarty if you want your idea to be included next!';
    creditLine.append(name,invitation);
  }
  $('reveal-stats').hidden=game!=='catchphrase';
  $('reveal-stats').textContent=game==='catchphrase'?'CHOOSE PANELS TO REVEAL · 24 POSSIBLE POINTS':'';
  $('answer-form').hidden=game==='trails'||game==='platy';$('answer-input').value='';
  $('answer-label').textContent=game==='blanks'?'Missing word':'Your answer';
  $('answer-input').placeholder=game==='blanks'?'Type the missing word':'Type your answer';
  $('answer-input').disabled=game==='catchphrase';$('answer-submit').disabled=game==='catchphrase';
  $('feedback').hidden=true;$('feedback').className='answer-reveal';
  $('next-button').hidden=true;$('reveal-button').hidden=false;
  $('timer-label').textContent='30s';$('timer-fill').style.width='100%';
  if(game!=='trails'&&game!=='platy'&&!state.countingDown)$('answer-input').focus();
  if((game==='anagrams'||game==='vowels'||game==='blanks')&&!state.countingDown)startTimer();
}
function finishAnswer(correct,revealed=false,timedOut=false,response=''){
  if(state.answered||state.countingDown)return;
  stopTimer();state.answered=true;
  const q=state.questions[state.index];
  state.completed=state.index+1;
  if(correct){state.score++;if(state.game==='catchphrase')state.points+=Math.max(0,24-state.openedTiles);if(state.game==='platy')state.points+=6-state.platyMisses}
  if(state.game==='platy'){
    if(revealed)state.platyMisses=6;
    renderPlatyName(q.answer,true);renderPlatyLives();renderPlatyKeyboard();
    if(!correct)$('clue').children[0].classList.add('failed');
    if(!correct)$('score-label').textContent=`${state.points} SAVED`;
  }
  if(state.game==='catchphrase'){
    for(const tile of state.tileButtons){tile.disabled=true;tile.classList.add('open')}
    $('score-label').textContent=`${state.points} POINTS`;
    $('reveal-stats').textContent=`${state.openedTiles} / 24 PANELS USED · ${correct?Math.max(0,24-state.openedTiles):0} POINTS AWARDED`;
  }
  if(state.game==='blanks'){
    const title=$('clue').children[0];title.textContent=q.title;title.classList.add(correct?'solved':'failed');
  }
  if(state.game==='trails'){
    for(const button of state.choiceButtons){button.disabled=true;if(button.dataset.answer===q.answer)button.classList.add('right')}
    showTrailVerdict(correct,timedOut);
  }
  const ends=state.mode==='unlimited'&&!correct||state.index===state.questions.length-1;
  if(ends){state.elapsedMs=Date.now()-state.startedAt;state.exhausted=state.mode==='unlimited'&&correct&&state.index===state.questions.length-1;prepareShareCard()}
  $('answer-form').hidden=true;$('reveal-button').hidden=true;
  const finishReveal=()=>{
    const feedback=$('feedback');
    if(state.game==='platy'){
      feedback.hidden=true;feedback.replaceChildren();
      $('next-button').hidden=false;$('next-button').textContent=ends?'See your results →':'Next question →';$('next-button').focus();return;
    }
    feedback.hidden=false;feedback.className=`answer-reveal ${correct?'correct':'incorrect'}`;feedback.replaceChildren();
    const main=document.createElement('div');main.className='answer-reveal-main';
    const kicker=document.createElement('span');kicker.className='answer-reveal-kicker';
    kicker.textContent=correct?({anagrams:'UNSCRAMBLED',vowels:'VOWELS FOUND',catchphrase:'YOU SAW IT!',trails:'TRAIL FOUND',blanks:'WORD FOUND'}[state.game]||'CORRECT'):timedOut?'TIME’S UP':revealed?'ANSWER REVEALED':'NOT QUITE';
    const hero=document.createElement('strong');hero.className='answer-reveal-answer';
    const shownAnswer=state.game==='vowels'&&correct?q.accepted.find(answer=>normal(answer)===normal(response))||q.answer:q.answer;
    hero.textContent=shownAnswer;main.append(kicker,hero);
    if(state.game==='blanks'){const complete=document.createElement('span');complete.className='blank-complete';complete.textContent=q.title;main.append(complete)}
    if(state.game==='vowels'&&q.accepted.length>1){
      const others=q.accepted.filter(answer=>normal(answer)!==normal(shownAnswer));
      if(others.length){const alternatives=document.createElement('span');alternatives.className='answer-reveal-alternatives';alternatives.textContent=`Also accepted: ${others.join(' · ')}`;main.append(alternatives)}
    }
    const scoreBox=document.createElement('div');scoreBox.className='answer-reveal-score';
    const points=document.createElement('strong');points.textContent=state.game==='catchphrase'?`+${correct?Math.max(0,24-state.openedTiles):0}`:correct?'+1':'+0';
    const detail=document.createElement('span');detail.textContent=state.game==='catchphrase'?`POINTS · ${state.openedTiles} / 24 PANELS`:`${state.score} RIGHT THIS RUN`;
    scoreBox.append(points,detail);feedback.append(main,scoreBox);
    $('next-button').hidden=false;$('next-button').textContent=ends?'See your results →':'Next question →';$('next-button').focus();
  };
  if(state.game==='anagrams'){
    const animation=animateAnagram(q.answer);
    if(animation){animation.then(finishReveal);return}
  }
  if(state.game==='vowels'){
    const accepted=correct?q.accepted.find(answer=>normal(answer)===normal(response)):null;
    const animation=animateVowels(accepted||q.answer);
    if(animation){animation.then(finishReveal);return}
  }
  if(state.game==='platy'&&correct){
    const animation=animatePlatySave(6-state.platyMisses);
    if(animation){const runId=state.runId,questionIndex=state.index;animation.then(()=>{if(state.runId===runId&&state.index===questionIndex)finishReveal()});return}
  }
  finishReveal();
}
function next(){if(state.elapsedMs!==null){results()}else{state.index++;render()}}
function results(){
  $('share-preview').dataset.game=state.game;
  $('share-game').textContent=gameName();$('share-mode').textContent=modeName();
  $('share-score').textContent=state.game==='catchphrase'?`${state.points} points`:state.game==='platy'?`${state.points} platypuses saved`:`${state.score} right`;
  $('share-detail').textContent=state.game==='platy'?`${state.score} ${state.score===1?'trail':'trails'} solved · ${state.completed} ${state.completed===1?'question':'questions'} completed`:`${state.score} correct · ${state.completed} ${state.completed===1?'question':'questions'} completed`;
  $('share-time').textContent=`Time ${duration(state.elapsedMs)}`;
  $('result-note').textContent=state.exhausted?'More questions coming soon. You cleared every clue currently in the game!':state.mode==='unlimited'?'Your run ended on that clue. Give it another go!':state.game==='anagrams'?'Littlefield would be proud of your letter work.':state.game==='vowels'?'The missing letters have been found.':state.game==='trails'?'Another story recovered from the archive.':state.game==='blanks'?'You restored the missing trail words.':'You’ve had a good look around the Peak.';
  $('results-title').textContent=state.exhausted?'You cleared the set!':state.score>=8?'A fine showing, explorer!':state.score>=5?'Nicely done, explorer!':'The Peak has more secrets…';
  $('share-status').textContent='';show('results');
}
function shareText(){const score=state.game==='catchphrase'?`${state.points} points, ${state.score} correct`:state.game==='platy'?`${state.points} platypuses saved, ${state.score} trails solved`:`${state.score} correct`;return `PPEC Quiz · ${gameName()} · ${modeName()} · ${score} · ${state.completed} questions completed · ${duration(state.elapsedMs)}`}
async function drawShareCard(){
  await document.fonts?.load('700 72px Fraunces');
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;
  const c=canvas.getContext('2d');
  const theme=GAME_THEMES[state.game]||GAME_THEMES.anagrams;
  const logoName=({anagrams:'anagrams',catchphrase:'catchphrase',vowels:'missing-vowels',trails:'what-trail',platy:'save-a-platy',blanks:'fill-the-blanks'})[state.game]||'anagrams';
  const frame=new Image();frame.src='./assets/share-card-frame.jpg';
  const logo=new Image();logo.src=`./assets/game-logos/${logoName}.${state.game==='blanks'?'svg':'png'}`;
  const avatar=new Image();avatar.src='./assets/jonabot-avatar.png';
  const [frameReady,logoReady,avatarReady]=await Promise.all([frame,logo,avatar].map(image=>image.decode().then(()=>true).catch(()=>false)));
  if(frameReady)c.drawImage(frame,0,0,1080,1080);
  else{
    c.fillStyle='#230e2a';c.fillRect(0,0,1080,1080);
    c.strokeStyle='#e4ad57';c.lineWidth=15;c.strokeRect(24,24,1032,1032);
  }
  c.globalAlpha=.64;c.fillStyle=theme.shareBg;c.fillRect(0,0,1080,1080);c.globalAlpha=1;
  if(frameReady){c.globalCompositeOperation='screen';c.globalAlpha=.34;c.drawImage(frame,0,0,1080,1080);c.globalCompositeOperation='source-over';c.globalAlpha=1}
  if(avatarReady)c.drawImage(avatar,788,35,235,235);
  c.textAlign='left';
  c.fillStyle='#fff0cc';c.font='700 46px Fraunces, Georgia, serif';c.fillText('PPEC QUIZ',88,105);
  c.fillStyle=theme.accent;c.font='700 27px DM Sans, Arial, sans-serif';c.fillText(modeName().toUpperCase(),89,150);
  c.fillStyle='#fff0cc';c.font='700 72px Fraunces, Georgia, serif';c.fillText(gameName(),86,250,680);
  c.fillStyle=theme.accent;c.fillRect(66,283,948,4);
  c.fillStyle=theme.accent;c.beginPath();c.arc(540,285,10,0,Math.PI*2);c.fill();
  c.fillStyle='#fff0cc';c.font='700 250px Fraunces, Georgia, serif';c.fillText(String(state.game==='catchphrase'||state.game==='platy'?state.points:state.score),91,566,435);
  c.fillStyle=theme.accent;c.font=`700 ${state.game==='platy'?58:88}px Fraunces, Georgia, serif`;c.fillText(state.game==='catchphrase'?'POINTS':state.game==='platy'?'PLATYPUSES':'RIGHT',95,662,450);
  if(state.game==='catchphrase'||state.game==='platy'){
    c.fillStyle='#fff0cc';c.font='700 29px DM Sans, Arial, sans-serif';c.fillText(state.game==='platy'?`SAVED · ${state.score} ${state.score===1?'TRAIL':'TRAILS'} SOLVED`:`${state.score} CORRECT`,102,713,435);
  }
  if(logoReady)c.drawImage(logo,555,312,430,430);
  c.fillStyle=theme.accent;c.fillRect(66,756,948,4);
  c.fillStyle=theme.accent;c.beginPath();c.arc(540,757,10,0,Math.PI*2);c.fill();
  c.textAlign='center';c.fillStyle='#fff0cc';c.font='700 91px Fraunces, Georgia, serif';
  c.fillText(String(state.completed),300,858);c.fillText(duration(state.elapsedMs),770,858);
  c.fillStyle=theme.accent;c.font='700 25px DM Sans, Arial, sans-serif';
  c.fillText(state.completed===1?'QUESTION COMPLETED':'QUESTIONS COMPLETED',300,898);
  c.fillText('TIME',770,898);
  c.fillStyle='#fff0cc';c.font='700 26px Fraunces, Georgia, serif';c.fillText('PHANTOM PEAK EXPLORERS’ CLUB',540,1019,530);
  return canvas;
}
function prepareShareCard(){
  const runId=state.runId;
  shareBlobPromise=drawShareCard().then(canvas=>new Promise(resolve=>canvas.toBlob(resolve,'image/png'))).then(blob=>{
    if(blob&&runId===state.runId){
      if(sharePreviewUrl)URL.revokeObjectURL(sharePreviewUrl);
      sharePreviewUrl=URL.createObjectURL(blob);
      const preview=$('share-preview-image');
      preview.onload=()=>{if(runId===state.runId)$('share-preview').classList.add('is-rendered')};
      preview.src=sharePreviewUrl;
      preview.hidden=false;
    }
    return blob;
  }).catch(()=>null);
  return shareBlobPromise;
}
async function shareCard(preferNative=true){
  const status=$('share-status');status.textContent='Preparing your score card…';
  const blob=await (shareBlobPromise||prepareShareCard());
  if(!blob){status.textContent='Could not make the image. Try copying the result instead.';return}
  if(preferNative&&window.matchMedia?.('(pointer: fine)').matches){
    if(await copyShareImage(blob))return;
    downloadShareImage(blob);return;
  }
  if(preferNative&&navigator.share&&navigator.canShare&&typeof File==='function'){
    try{
      const file=new File([blob],'ppec-quiz-score.png',{type:'image/png'});
      if(navigator.canShare({files:[file]})){
        status.textContent='Opening your share options…';
        await navigator.share({files:[file],text:shareText(),title:'PPEC Quiz score'});
        status.textContent='Score card ready to share.';return;
      }
    }catch(error){
      if(error.name==='AbortError'){status.textContent='Sharing cancelled. Use Save PNG to download the card.';return}
    }
  }
  if(preferNative&&await copyShareImage(blob))return;
  downloadShareImage(blob);
}
async function copyShareImage(blob){
  if(typeof ClipboardItem!=='function'||!navigator.clipboard?.write)return false;
  try{
    await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
    $('share-status').textContent='Image copied. Paste it into Discord or a post.';
    return true;
  }catch{return false}
}
async function copyImage(){
  const status=$('share-status');status.textContent='Preparing image to copy…';
  const blob=await (shareBlobPromise||prepareShareCard());
  if(!blob){status.textContent='Could not make the image. Try Save PNG.';return}
  if(!await copyShareImage(blob))status.textContent='Image copying is unavailable here. Use Save PNG.';
}
function downloadShareImage(blob){
  const status=$('share-status');
  try{
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download='ppec-quiz-score.png';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Score card saved to Downloads as ppec-quiz-score.png.';
  }catch{status.textContent='Download unavailable here. Try Copy result or open the quiz in your browser.'}
}
async function copyResult(){try{await navigator.clipboard.writeText(shareText());$('share-status').textContent='Result copied.'}catch{$('share-status').textContent='Copy is unavailable here; use the share card button to download an image.'}}
document.querySelectorAll('[data-game]').forEach(button=>button.addEventListener('click',()=>start(button.dataset.game,button.dataset.mode)));
document.querySelectorAll('[data-game]').forEach(button=>{if(button.dataset.game==='vowels')button.disabled=MISSING_VOWELS.length<(button.dataset.mode==='quiz'?10:1)});
$('vowels-soon').hidden=MISSING_VOWELS.length>0;
$('answer-form').addEventListener('submit',event=>{event.preventDefault();if(state.countingDown||state.game==='catchphrase'&&state.openedTiles===0)return;const response=$('answer-input').value.trim();if(!response)return;const q=state.questions[state.index];finishAnswer(isCorrect(response,q),false,false,response)});
$('reveal-button').addEventListener('click',()=>finishAnswer(false,true));
document.addEventListener?.('keydown',event=>{
  if(state.game!=='platy'||$('game').hidden||event.altKey||event.ctrlKey||event.metaKey||event.repeat||!(/^[a-z]$/i.test(event.key)))return;
  if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  guessPlatyLetter(event.key.toUpperCase());
});
$('next-button').addEventListener('click',next);
$('again-button').addEventListener('click',()=>start(state.game,state.mode));
$('share-button').addEventListener('click',()=>shareCard());
$('share-preview').addEventListener('click',()=>shareCard());
$('download-button').addEventListener('click',()=>shareCard(false));
$('copy-image-button').addEventListener('click',copyImage);
$('copy-button').addEventListener('click',copyResult);
for(const id of ['back-button','other-button'])$(id).addEventListener('click',()=>show('home'));
if(window.history?.replaceState)window.history.replaceState({ppecScreen:'home'},'',window.location?window.location.pathname+window.location.search:undefined);
window.addEventListener?.('popstate',event=>{
  const {ppecScreen,runId}=event.state||{};
  if(ppecScreen==='game'&&runId===state.runId){
    show('game',false);
    if(state.countingDown)startCountdown();
    else if(!state.answered&&(state.game==='anagrams'||state.game==='vowels'||state.game==='blanks')){
      if(Date.now()>=questionDeadline)finishAnswer(false,false,true);
      else{tickTimer();questionTimer=setInterval(tickTimer,200)}
    }
  }else if(ppecScreen==='results'&&runId===state.runId&&state.elapsedMs!==null)show('results',false);
  else show('home',false);
});
let installPrompt=null;
window.addEventListener?.('beforeinstallprompt',event=>{
  event.preventDefault();installPrompt=event;$('install-button').hidden=false;
});
$('install-button').addEventListener('click',async()=>{
  if(!installPrompt)return;
  installPrompt.prompt();await installPrompt.userChoice;
  installPrompt=null;$('install-button').hidden=true;
});
window.addEventListener?.('appinstalled',()=>{installPrompt=null;$('install-button').hidden=true});
if(navigator.serviceWorker&&window.addEventListener)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
