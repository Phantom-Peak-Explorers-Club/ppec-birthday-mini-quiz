# PPEC Quiz

A static birthday quiz with eight games: Littlefield’s Letters, Peak-a-Boo, Vowel of Silence, Trail and Error, Save-A-Platy, Blankety Peak, Lost in the Lore, and Fun With Blue Diamant. The portal and game screen are styled as a compact game console featuring Jonabot Jr.

Each game offers a ten-question Quiz Round or Unlimited. Unlimited ends at the first incorrect or revealed answer, or when the question pool runs out. A cleared pool displays “More questions coming soon.” Littlefield’s Letters and Vowel of Silence start with a 3–2–1–Go countdown, then give 30 seconds per clue. The other six games are untimed. In the picture game, players choose squares from a 6×4 cover and earn `24 - panels opened` points for a correct answer. It accepts punctuation/spacing variants, a few natural short forms, and minor typing errors. The word games require the intended answer.

Anagram answers animate the scrambled letters into the solved order, and Vowel of Silence drops the restored vowels into place, including after a wrong guess. Results show the game, mode, score, questions completed, and elapsed time. Players can share a square 1080 × 1080 PNG card or copy a text result. Each game has its own bold colour on the portal, console, result preview, and exported card.

Question data is in `docs/app.js`: 87 anagrams and 103 Vowel of Silence answers (102 distinct consonant clues). Anagrams have a difficulty `tier` (1–4); Quiz Round draws 2/3/3/2 questions by tier. Vowel of Silence terms are stored as `{answer:'PHANTOM PEAK'}`; the displayed clue removes A, E, I, O, and U. Terms with identical consonants form one question, show only the primary answer length, and accept any matching answer in the full bank (including JONACOIN and JONACON for JNCN). Any question can include `contributor:'Name'`, shown as a credit on the question screen. The [letter clue list](CLUE-BANK.md) records the selected pool and source notes; regenerate it with `node scripts/build_clue_bank.cjs` after editing questions.

Trail and Error and Save-A-Platy draw from a snapshot of all 187 public Trail Notes records in `source/trails.json`. Trail and Error shows three shuffled choices. The [complete question sheet](WHAT-TRAIL-QUESTIONS.md) shows all clues, options, and correct answers for review. Regenerate it and `docs/what-trail.js` with `node scripts/build_what_trail.cjs` after refreshing the source snapshot.

Blankety Peak removes one meaningful word from 152 of those trail titles. Players type that word; each clue shows its season and year, and the reveal shows the complete title. Single-word titles, repeated-word clues, and weak or ambiguous titles are excluded. The [title-by-title review](FILL-THE-BLANKS-REVIEW.md) lists all 187 decisions. Regenerate the review and `docs/fill-blanks.js` with `node scripts/build_fill_blanks.cjs` after refreshing the trail snapshot.

Lost in the Lore shows the trail title, season and year above an excerpt from its description. One complete named character, place, group or device is blanked; players choose from four context-matched names. The [clue review](LOST-IN-THE-LORE-REVIEW.md) lists all 168 curated clues and choices. Regenerate it and `docs/lore-gap.js` with `node scripts/build_lore_gap.cjs` after refreshing the trail snapshot.

Fun With Blue Diamant starts with one trail and asks whether each next trail happened before, in the same season, or after it. The offered trail becomes the reference for the following question. Trails in one year and season are simultaneous; the 2023 special-event trails are excluded because their precise order is not established. The game uses 183 trails across 16 seasons. Regenerate `docs/timeline.js` with `node scripts/build_timeline.cjs` after refreshing the trail snapshot.

Run `node --test tests/game.test.cjs` to check the game rules. Serve `docs/` over HTTPS or localhost to test web app installation and offline caching; simply opening `docs/index.html` also works for the quiz itself. The manifest, service worker, and icons live in `docs/`. Browser Back and Forward move between portal, game, and results screens. No account, build step, or backend is required.

Source references: `Backup Quiz PPT.pptx`, the XP Studio quiz export, the images in `Catchphrase Round`, [PPEC Trail Notes](https://ppec.club/trail-notes/), and the linked official map/guide in `CLUE-BANK.md`. Original Desktop source files were left untouched.

# Share card background

The seven share cards use `docs/assets/share-card-master.jpg`, a neutral version of the detailed frame and skyline. `drawShareCard()` applies each game's `GAME_THEMES.shareBg` to that master, preserving its light, shadow, and texture. Set `shareBg` and `accent` for a new game to colour its background and frame without making another image. Regenerate the master from the protected art source with `powershell -File scripts/build_share_card_master.ps1` if the artwork changes.
