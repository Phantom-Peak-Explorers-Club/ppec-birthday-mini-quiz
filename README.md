# PPEC 4th Birthday Mini Quiz

A static birthday quiz with three games: Littlefield’s Letters, Picture Catchphrase, and Missing Vowels. The portal and game screen are styled as a compact steampunk console featuring Jonabot Jr.

Each game offers a ten-question Quiz Round or Unlimited. Unlimited ends at the first incorrect or revealed answer, or when the question pool runs out. A cleared pool displays “More questions coming soon.” Anagrams and Missing Vowels give 30 seconds per clue. Catchphrase has no timer: players choose squares from a 6×4 cover and earn `24 - panels opened` points for a correct answer. Catchphrase accepts punctuation/spacing variants, a few natural short forms, and minor typing errors. The letter games require the intended answer.

Correct anagram answers animate the scrambled letters into the solved order. Results show the game, mode, score, questions completed, and elapsed time. Players can share a graphical PNG card or copy a text result.

Question data is in `docs/app.js`: 87 anagrams and 102 Missing Vowels terms. Anagrams have a difficulty `tier` (1–4); Quiz Round draws 2/3/3/2 questions by tier. Missing Vowels terms are stored as `{answer:'PHANTOM PEAK'}`; the displayed clue removes A, E, I, O, and U. Any question can include `contributor:'Name'`, shown as a credit on the question screen. The [clue list](CLUE-BANK.md) records the selected pool and source notes; regenerate it with `node scripts/build_clue_bank.cjs` after editing questions.

Run `node --test tests/game.test.cjs` to check the game rules. Open `docs/index.html` in a browser, or unzip `PPEC-4th-Birthday-Mini-Quiz.zip`. No account, build step, or backend is required.

Source references: `Backup Quiz PPT.pptx`, the XP Studio quiz export, the images in `Catchphrase Round`, and the linked official map/guide in `CLUE-BANK.md`. Original Desktop source files were left untouched.
