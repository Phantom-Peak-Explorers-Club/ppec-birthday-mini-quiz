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
const PICTURES = [
  ['Copper','Copper.jpg'],['Dr Winter','Dr Winter.jpg'],['Hogwood','Hogwood.jpg'],
  ['Leadbelly','Leadbelly.jpg'],['Littlefield','Littlefield.jpg'],['Lovehart','Lovehart.jpg'],
  ['Miramaze','Miramaze.jpg'],['Nethersole','Nethersole.jpg'],['Rexford','Rexford.jpg'],
  ['Rockbolt Theatre','Rockbolt Theatre.jpg'],['Sherlock Bones','Sherlock Bones.jpg'],['Sparks','Sparks.jpg']
].map(([answer,image,contributor])=>({answer,image:`./assets/catchphrase/${encodeURIComponent(image)}`,contributor,
  aliases:answer==='Dr Winter'?['Dr. Winter','Doctor Winter','Doc Winter','Winter']:answer==='Rockbolt Theatre'?['The Rockbolt','The Rockbolt Theatre']:[]
}));
// Contributor can be added to any question as {answer:'...', contributor:'Name'}.
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
const vowelAnswers=new Set(MISSING_VOWELS.map(q=>q.answer));
MISSING_VOWELS.push(...LORE_TERMS.filter(q=>!vowelAnswers.has(q.answer)).map(q=>({answer:q.answer})));
const $=id=>document.getElementById(id);
let state={game:null,mode:null,questions:[],index:0,score:0,points:0,completed:0,openedTiles:0,tileButtons:[],answered:false,startedAt:0,elapsedMs:null,exhausted:false};
let questionTimer=null;
let questionDeadline=0;
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
  const answers=[q.answer,...(q.aliases||[])];
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
  if(PICTURES.some(other=>other!==q&&pictureAnswers(other).includes(entered)))return false;
  return variants.some(answer=>entered.length>=4&&typoDistance(entered,answer)<=(answer.length>=12?2:1));
}
function withoutVowels(s){return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[AEIOU]/g,'')}
function vowelSkeleton(answer){return normal(withoutVowels(answer))}
function vowelQuestions(){
  const allAnswers=[...MISSING_VOWELS,...ANAGRAMS,...PICTURES];
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
function show(id){if(id!=='game')stopTimer();for(const screen of document.querySelectorAll('.screen'))screen.hidden=screen.id!==id;window.scrollTo({top:0,behavior:'instant'})}
function gameName(){return state.game==='anagrams'?'Littlefield’s Letters':state.game==='vowels'?'Missing Vowels':state.game==='trails'?'What Trail?':'Picture Catchphrase'}
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
function start(game,mode){
  let source;
  if(game==='anagrams')source=[1,2,3,4].flatMap(tier=>shuffle(ANAGRAMS.filter(q=>q.tier===tier)));
  else if(game==='vowels')source=vowelQuestions();
  else if(game==='trails')source=shuffle(WHAT_TRAILS);
  else source=shuffle(PICTURES);
  if(!source.length || mode==='quiz'&&source.length<10)return;
  const questions=mode==='quiz'&&game==='anagrams'?[2,3,3,2].flatMap((count,tier)=>source.filter(q=>q.tier===tier+1).slice(0,count)):mode==='quiz'?source.slice(0,10):source;
  state={game,mode,questions,index:0,score:0,points:0,completed:0,openedTiles:0,tileButtons:[],choiceButtons:[],answered:false,startedAt:Date.now(),elapsedMs:null,exhausted:false};
  show('game');render();
}
function render(){
  stopTimer();
  const {game,mode,questions,index,score}=state;
  const q=questions[index];
  state.answered=false;
  state.openedTiles=0;
  state.tileButtons=[];
  state.choiceButtons=[];
  $('game-label').textContent=`${gameName().toUpperCase()} · ${modeName().toUpperCase()}`;
  $('question-count').textContent=`${index+1} / ${questions.length}`;
  $('score-label').textContent=game==='catchphrase'?`${state.points} POINTS`:`${score} CORRECT`;
  $('progress-line').hidden=mode==='unlimited';
  $('progress-fill').style.width=`${index/questions.length*100}%`;
  $('question-kind').textContent=game==='anagrams'?'UNSCRAMBLE THIS':game==='vowels'?'RESTORE THE VOWELS':game==='trails'?'IDENTIFY THE TRAIL':'NAME THE PICTURE CLUE';
  $('game-title').textContent=gameName();
  $('game-logo').src=`./assets/game-logos/${({anagrams:'anagrams',catchphrase:'catchphrase',vowels:'missing-vowels',trails:'what-trail'})[game]}.png`;
  $('game-console').dataset.game=game;
  $('question-card').dataset.game=game;
  $('vowel-hint').hidden=game!=='vowels';
  if(game==='vowels'){
    const count=q.answer.replace(/[^A-Za-z]/g,'').length;
    $('vowel-hint').textContent=`${count} ${count===1?'LETTER':'LETTERS'}`;
  }
  $('clue').replaceChildren();
  if(game==='catchphrase'){
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
  }else $('clue').append(game==='anagrams'?letterRow(q.scramble):letterRow(q.clue));
  $('trail-choices').replaceChildren();$('trail-choices').hidden=game!=='trails';
  if(game==='trails')shuffle(q.options).forEach((title,choiceIndex)=>{
    const button=document.createElement('button');button.type='button';button.className='trail-choice';button.dataset.answer=title;
    const letter=document.createElement('span');letter.className='choice-letter';letter.textContent='ABC'[choiceIndex];
    const label=document.createElement('span');label.textContent=title;button.append(letter,label);
    button.addEventListener('click',()=>{if(!state.answered){if(title!==q.answer)button.classList.add('wrong');finishAnswer(title===q.answer)}});
    state.choiceButtons.push(button);$('trail-choices').append(button);
  });
  const credit=game==='vowels'?(q.contributors||[]).join(', '):q.contributor;
  $('question-credit').hidden=!credit;
  $('question-credit').textContent=credit?`Question contributed by ${credit}`:'';
  $('reveal-stats').hidden=game!=='catchphrase';
  $('reveal-stats').textContent=game==='catchphrase'?'CHOOSE PANELS TO REVEAL · 24 POSSIBLE POINTS':'';
  $('answer-form').hidden=game==='trails';$('answer-input').value='';
  $('answer-input').disabled=game==='catchphrase';$('answer-submit').disabled=game==='catchphrase';
  $('feedback').hidden=true;$('feedback').className='feedback';
  $('next-button').hidden=true;$('reveal-button').hidden=false;
  $('timer-label').textContent='30s';$('timer-fill').style.width='100%';
  if(game!=='trails')$('answer-input').focus();if(game!=='catchphrase')startTimer();
}
function finishAnswer(correct,revealed=false,timedOut=false){
  if(state.answered)return;
  stopTimer();state.answered=true;
  const q=state.questions[state.index];
  state.completed=state.index+1;
  if(correct){state.score++;if(state.game==='catchphrase')state.points+=Math.max(0,24-state.openedTiles)}
  if(state.game==='catchphrase')for(const tile of state.tileButtons){tile.disabled=true;tile.classList.add('open')}
  if(state.game==='trails')for(const button of state.choiceButtons){button.disabled=true;if(button.dataset.answer===q.answer)button.classList.add('right')}
  const ends=state.mode==='unlimited'&&!correct||state.index===state.questions.length-1;
  if(ends){state.elapsedMs=Date.now()-state.startedAt;state.exhausted=state.mode==='unlimited'&&correct&&state.index===state.questions.length-1}
  $('answer-form').hidden=true;$('reveal-button').hidden=true;
  const finishReveal=()=>{
    const feedback=$('feedback');feedback.hidden=false;feedback.classList.add(correct?'correct':'incorrect');feedback.replaceChildren();
    const heading=document.createElement('strong');heading.textContent=correct?'That’s right!':timedOut?'Time’s up!':revealed?'Answer revealed':'Not quite';
    const possible=state.game==='vowels'&&q.accepted.length>1?q.accepted.join(' or '):q.answer;
    const answer=document.createElement('span');answer.textContent=(correct&&state.game==='vowels'?`Accepted: ${possible}.`:correct?`The answer is ${possible}.`:`${q.accepted?.length>1?'Possible answers were':'The answer was'} ${possible}.`)+(correct&&state.game==='catchphrase'?` ${Math.max(0,24-state.openedTiles)} points from ${state.openedTiles} panels opened.`:'');
    feedback.append(heading,answer);
    $('next-button').hidden=false;$('next-button').textContent=ends?'See your results →':'Next question →';$('next-button').focus();
  };
  if(correct&&state.game==='anagrams'){
    const animation=animateAnagram(q.answer);
    if(animation){animation.then(finishReveal);return}
  }
  finishReveal();
}
function next(){if(state.elapsedMs!==null){results()}else{state.index++;render()}}
function results(){
  $('share-game').textContent=gameName();$('share-mode').textContent=modeName();
  $('share-score').textContent=state.game==='catchphrase'?`${state.points} points`:`${state.score} right`;
  $('share-detail').textContent=`${state.score} correct · ${state.completed} ${state.completed===1?'question':'questions'} completed`;
  $('share-time').textContent=`Time ${duration(state.elapsedMs)}`;
  $('result-note').textContent=state.exhausted?'More questions coming soon. You cleared every clue currently in the game!':state.mode==='unlimited'?'Your run ended on that clue. Give it another go!':state.game==='anagrams'?'Littlefield would be proud of your letter work.':state.game==='vowels'?'The missing letters have been found.':state.game==='trails'?'Another story recovered from the archive.':'You’ve had a good look around the Peak.';
  $('results-title').textContent=state.exhausted?'You cleared the set!':state.score>=8?'A fine showing, explorer!':state.score>=5?'Nicely done, explorer!':'The Peak has more secrets…';
  $('share-status').textContent='';show('results');
}
function shareText(){const score=state.game==='catchphrase'?`${state.points} points, ${state.score} correct`:`${state.score} correct`;return `PPEC Quiz Mini App · ${gameName()} · ${modeName()} · ${score} · ${state.completed} questions completed · ${duration(state.elapsedMs)}`}
async function drawShareCard(){
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=900;
  const c=canvas.getContext('2d');
  const bg=c.createLinearGradient(0,0,1200,900);bg.addColorStop(0,'#140d27');bg.addColorStop(.55,'#32114a');bg.addColorStop(1,'#5d1c6f');
  c.fillStyle=bg;c.fillRect(0,0,1200,900);
  c.strokeStyle='#dca549';c.lineWidth=9;c.strokeRect(22,22,1156,856);c.lineWidth=2;c.strokeRect(40,40,1120,820);
  c.fillStyle='#f3c763';for(const [x,y,r] of [[102,116,7],[207,68,4],[857,97,5],[1068,183,7],[89,661,5],[1119,748,6]]){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
  c.fillStyle='#f4e6c4';c.textAlign='left';c.font='bold 26px Arial';c.fillText('✦  PPEC QUIZ MINI APP',92,112);
  c.fillStyle='#f1bc54';c.font='bold 21px Arial';c.fillText('4TH BIRTHDAY EDITION  /  '+modeName().toUpperCase(),92,158);
  c.fillStyle='#f8f0d9';c.font='bold 53px Georgia';c.fillText(gameName(),92,275);
  c.fillStyle='#e9bb58';c.fillRect(87,319,590,3);
  c.fillStyle='#f3bc51';c.font='bold 102px Georgia';c.fillText(state.game==='catchphrase'?`${state.points} PTS`:`${state.score} RIGHT`,88,468);
  c.fillStyle='#f4e6c4';c.font='bold 28px Arial';c.fillText(`${state.score} CORRECT  •  ${state.completed} COMPLETED`,92,536);
  c.fillStyle='#d9b6e9';c.font='bold 29px Arial';c.fillText(`TIME   ${duration(state.elapsedMs)}`,92,604);
  c.fillStyle='#a26cbb';c.fillRect(92,659,560,4);
  c.fillStyle='#f7d485';c.font='23px Arial';c.fillText('PHANTOM PEAK EXPLORERS’ CLUB',92,778);
  const mascot=new Image();mascot.src='./assets/jonabot-jr.png';
  try{await mascot.decode();c.drawImage(mascot,690,214,425,431)}catch{}
  c.fillStyle='#f2bf5b';c.font='52px Georgia';c.textAlign='center';c.fillText('✦',946,739);
  return canvas;
}
async function shareCard(){const canvas=await drawShareCard();const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob){$('share-status').textContent='Could not make the image. Try copying the result instead.';return}const file=new File([blob],'ppec-mini-quiz-score.png',{type:'image/png'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],text:shareText(),title:'PPEC Mini Quiz score'});$('share-status').textContent='Score card ready to share.';return}catch(error){if(error.name==='AbortError')return}}const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='ppec-mini-quiz-score.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('share-status').textContent='Score card downloaded as a PNG.'}
async function copyResult(){try{await navigator.clipboard.writeText(shareText());$('share-status').textContent='Result copied.'}catch{$('share-status').textContent='Copy is unavailable here; use the share card button to download an image.'}}
document.querySelectorAll('[data-game]').forEach(button=>button.addEventListener('click',()=>start(button.dataset.game,button.dataset.mode)));
document.querySelectorAll('[data-game]').forEach(button=>{if(button.dataset.game==='vowels')button.disabled=MISSING_VOWELS.length<(button.dataset.mode==='quiz'?10:1)});
$('vowels-soon').hidden=MISSING_VOWELS.length>0;
$('answer-form').addEventListener('submit',event=>{event.preventDefault();if(state.game==='catchphrase'&&state.openedTiles===0)return;const response=$('answer-input').value.trim();if(!response)return;const q=state.questions[state.index];finishAnswer(isCorrect(response,q))});
$('reveal-button').addEventListener('click',()=>finishAnswer(false,true));
$('next-button').addEventListener('click',next);
$('again-button').addEventListener('click',()=>start(state.game,state.mode));
$('share-button').addEventListener('click',shareCard);
$('copy-button').addEventListener('click',copyResult);
for(const id of ['home-button','back-button','other-button'])$(id).addEventListener('click',()=>show('home'));
