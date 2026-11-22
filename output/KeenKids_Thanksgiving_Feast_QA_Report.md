# KeenKids Thanksgiving Feast: QA Report

Generated 2026-11-17 22:19 UTC by `src/gen_docs.js` from the build’s own test outputs.

## 1. File inventory

| File | MB | sha1 (12) |
|---|---|---|
| `output/KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3` | 0 | `27f59252b4d6` |
| `output/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pdf` | 2.9 | `3505077a84d8` |
| `output/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` | 4.53 | `83ff8e6fe661` |
| `output/KeenKids_Thanksgiving_Feast_QA_Report.md` | 0.02 | `de3adf886e84` |
| `output/KeenKids_Thanksgiving_Feast_Slide_Map.md` | 0 | `858aff82a72a` |
| `output/KeenKids_Thanksgiving_Feast_Teacher_Guide.md` | 0.03 | `130ed64cae2c` |

Plus `output/fonts/` (Literata + Figtree TTF, OFL licences), `qa/slides/slide-01…28.png` (1920×1080), `qa/KeenKids_Thanksgiving_Feast_Contact_Sheet.png`, `src/` (all build + test scripts), `assets/` (extracted starter art, engine screenshots).

## 2. Starter audit

- Targets: **Stage,Chef,Food**; code blocks: **0**; variables: **0**. Matches the spec (Stage “Feast Kitchen”, Chef at (0, -130), Food “pumpkin” at (0, 180)).
- Starter sha1 `218d711da4eed77a0dde571126a9f1993458a8f4`; unchanged after the build: **true**.
- All art in the deck is the starter’s own SVG costumes/backdrop rasterised (`assets/extracted/`), or real frames rendered by scratch-render from the built projects.

## 3. Block fidelity (deterministic)

`src/verify_code.js`: **ALL PASS** (94 checks).

- All slide code is rendered by **scratchblocks 3.7.1** (scratch3 style): true Scratch 3 shapes, category colours, round reporters, hexagon booleans, C-blocks, hats, dropdowns. Unknown/obsolete blocks: 0.
- Every block on every slide (bright and faded) is mapped onto the final program with the same words, values, nesting and stack order. Each of the final program’s 30 blocks is introduced exactly once, on a slide of its own demo, in demo order 1→11. Faded context only shows blocks already taught.
- New blocks per coding slide: s5:2 s7:1 s8:1 s9:2 s11:2 s12:2 s13:2 s14:2 s15:2 s17:2 s18:1 s19:1 s20:2 s21:1 s23:3 s24:2 s25:1 s26:1 (max 3).
- Values checked: Chef, Food, Score, x 0 / y -130, mouse x, random 1–2 s, random x -200…200, y 180, y position < -170, change y by -8, touching Chef, change Score by 1, Score > 9, say “Feast Ready!” for 2 s, stop all, two `delete this clone` (in the catch-if after the win-if; after the loop).
- Mutation test: planting `-160` on slide 19 and a wrongly highlighted `forever` on slide 9 made the verifier fail 6 checks; restoring the content returned ALL PASS.
- `Completed_Teacher.sb3` decompiles to exactly the final scripts (Chef 1 script, Food 2 scripts, one “Score” variable for all sprites).

<details><summary>Full verifier output</summary>

```
PASS  canonical Chef script 1: 6 rendered blocks = 6 DSL blocks, 0 unknown blocks
PASS  canonical Food script 1: 6 rendered blocks = 6 DSL blocks, 0 unknown blocks
PASS  canonical Food script 2: 18 rendered blocks = 18 DSL blocks, 0 unknown blocks
PASS  slide 5 s05_code: NEW blocks [when clicked | go to x: 0 y: -130] belong to Demo 2 and are taught here for the first time
PASS  slide 5 s05_code: faded context [—] was already taught
PASS  slide 5 s05_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 5 (Demo 2, Chef): 2 new block(s) — limit 1–3
PASS  slide 7 s07_code: NEW blocks [set Score to 0] belong to Demo 3 and are taught here for the first time
PASS  slide 7 s07_code: faded context [when clicked | go to x: 0 y: -130] was already taught
PASS  slide 7 s07_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 7 (Demo 3, Chef): 1 new block(s) — limit 1–3
PASS  slide 8 s08_code: NEW blocks [forever] belong to Demo 4 and are taught here for the first time
PASS  slide 8 s08_code: faded context [set Score to 0] was already taught
PASS  slide 8 s08_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 8 (Demo 4, Chef): 1 new block(s) — limit 1–3
PASS  slide 9 s09_code: NEW blocks [set x to | mouse x] belong to Demo 4 and are taught here for the first time
PASS  slide 9 s09_code: faded context [forever] was already taught
PASS  slide 9 s09_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 9 (Demo 4, Chef): 2 new block(s) — limit 1–3
PASS  slide 11 s11_code: NEW blocks [when clicked | hide] belong to Demo 5 and are taught here for the first time
PASS  slide 11 s11_code: faded context [—] was already taught
PASS  slide 11 s11_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 11 (Demo 5, Food): 2 new block(s) — limit 1–3
PASS  slide 12 s12_code: NEW blocks [forever | wait seconds] belong to Demo 6 and are taught here for the first time
PASS  slide 12 s12_code: faded context [hide] was already taught
PASS  slide 12 s12_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 12 (Demo 6, Food): 2 new block(s) — limit 1–3
PASS  slide 13 s13_code: NEW blocks [pick random 1 to 2 | create clone of myself] belong to Demo 6 and are taught here for the first time
PASS  slide 13 s13_code: faded context [forever | wait seconds] was already taught
PASS  slide 13 s13_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 13 (Demo 6, Food): 2 new block(s) — limit 1–3
PASS  slide 14 s14_code: NEW blocks [when I start as a clone | show] belong to Demo 7 and are taught here for the first time
PASS  slide 14 s14_code: faded context [—] was already taught
PASS  slide 14 s14_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 14 (Demo 7, Food): 2 new block(s) — limit 1–3
PASS  slide 15 s15_code: NEW blocks [go to x: y: 180 | pick random -200 to 200] belong to Demo 7 and are taught here for the first time
PASS  slide 15 s15_code: faded context [show] was already taught
PASS  slide 15 s15_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 15 (Demo 7, Food): 2 new block(s) — limit 1–3
PASS  slide 17 s17_code: NEW blocks [repeat until | < -170] belong to Demo 8 and are taught here for the first time
PASS  slide 17 s17_code: faded context [—] was already taught
PASS  slide 17 s17_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 17 s17_map: NEW blocks [repeat until | < -170] belong to Demo 8 and are taught here for the first time
PASS  slide 17 s17_map: faded context [when I start as a clone | show | go to x: y: 180 | pick random -200 to 200] was already taught
PASS  slide 17 s17_map: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 17: focus picture and map highlight the same new blocks
PASS  slide 17 (Demo 8, Food): 2 new block(s) — limit 1–3
PASS  slide 18 s18_code: NEW blocks [y position] belong to Demo 8 and are taught here for the first time
PASS  slide 18 s18_code: faded context [repeat until | < -170] was already taught
PASS  slide 18 s18_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 18 (Demo 8, Food): 1 new block(s) — limit 1–3
PASS  slide 19 s19_code: NEW blocks [change y by -8] belong to Demo 8 and are taught here for the first time
PASS  slide 19 s19_code: faded context [repeat until | < -170 | y position] was already taught
PASS  slide 19 s19_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 19 (Demo 8, Food): 1 new block(s) — limit 1–3
PASS  slide 20 s20_code: NEW blocks [if then | touching Chef ?] belong to Demo 9 and are taught here for the first time
PASS  slide 20 s20_code: faded context [change y by -8] was already taught
PASS  slide 20 s20_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 20 s20_map: NEW blocks [if then | touching Chef ?] belong to Demo 9 and are taught here for the first time
PASS  slide 20 s20_map: faded context [repeat until | < -170 | y position | change y by -8] was already taught
PASS  slide 20 s20_map: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 20: focus picture and map highlight the same new blocks
PASS  slide 20 (Demo 9, Food): 2 new block(s) — limit 1–3
PASS  slide 21 s21_code: NEW blocks [change Score by 1] belong to Demo 9 and are taught here for the first time
PASS  slide 21 s21_code: faded context [if then | touching Chef ?] was already taught
PASS  slide 21 s21_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 21 (Demo 9, Food): 1 new block(s) — limit 1–3
PASS  slide 23 s23_code: NEW blocks [if then | > 9 | Score] belong to Demo 10 and are taught here for the first time
PASS  slide 23 s23_code: faded context [change Score by 1] was already taught
PASS  slide 23 s23_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 23 s23_map: NEW blocks [if then | > 9 | Score] belong to Demo 10 and are taught here for the first time
PASS  slide 23 s23_map: faded context [if then | touching Chef ? | change Score by 1] was already taught
PASS  slide 23 s23_map: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 23: focus picture and map highlight the same new blocks
PASS  slide 23 (Demo 10, Food): 3 new block(s) — limit 1–3
PASS  slide 24 s24_code: NEW blocks [say Feast Ready! for 2 seconds | stop all] belong to Demo 10 and are taught here for the first time
PASS  slide 24 s24_code: faded context [if then | > 9 | Score] was already taught
PASS  slide 24 s24_code: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 24 (Demo 10, Food): 2 new block(s) — limit 1–3
PASS  slide 25 s25_map: NEW blocks [delete this clone] belong to Demo 11 and are taught here for the first time
PASS  slide 25 s25_map: faded context [if then | touching Chef ? | change Score by 1 | if then | > 9 | Score | say Feast Ready! for 2 seconds | stop all] was already taught
PASS  slide 25 s25_map: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 25: new-block card shows “delete this clone”
PASS  slide 25 (Demo 11, Food): 1 new block(s) — limit 1–3
PASS  slide 26 s26_map: NEW blocks [delete this clone] belong to Demo 11 and are taught here for the first time
PASS  slide 26 s26_map: faded context [repeat until | < -170 | y position | change y by -8 | if then | touching Chef ? | change Score by 1 | if then | > 9 | Score | say Feast Ready! for 2 seconds | stop all | delete this clone] was already taught
PASS  slide 26 s26_map: all blocks are real Scratch 3 blocks (unknown: 0)
PASS  slide 26: new-block card shows “delete this clone”
PASS  slide 26 (Demo 11, Food): 1 new block(s) — limit 1–3
PASS  demos appear in order 1→11 (1,2,3,4,5,6,7,8,9,10,11)
PASS  deck teaches every block of the final game: 30 / 30
PASS  Completed_Teacher.sb3 Chef code decompiles to exactly the final scripts
PASS  Completed_Teacher.sb3 Food code decompiles to exactly the final scripts
PASS  Completed_Teacher.sb3: Stage/Chef/Food, one stage variable “Score” (for all sprites)

ALL PASS
```

</details>

## 4. Slide readability

- Automated layout QA (`src/render_html.js`, Chromium at 1920×1080 with the shipped fonts): **0 slides with issues** out of 28. Checks: text overflow (also at 95% width, slack for PowerPoint/Canva wrapping), off-slide text/images, stretched images (>2%), overlaps between titles, body text, code and screenshots, missing images. Fonts loaded: Literata ✓, Figtree ✓.
- Scratch label size of the main code picture on each coding slide (pt on a 13.33 in slide): min **19.8 pt**, max 32.4 pt. Headings 40–44 pt, explanations 26 pt, cards 21–25 pt.

| Slide | Layout | Code label pt | “Where it goes” map pt |
|---|---|---|---|
| 5 · Chef starts at the bottom | side | 32.4 | — |
| 7 · New game, zero points! | side | 22.6 | — |
| 8 · Keep going: forever | side | 24.9 | — |
| 9 · Follow the mouse! | side | 29.5 | — |
| 11 · The first pumpkin hides | side | 32.4 | — |
| 12 · Again and again | side | 21.6 | — |
| 13 · Make a copy! | side | 21.3 | — |
| 14 · When I start as a clone | side | 32.4 | — |
| 15 · A surprise spot | wide | 27.5 | — |
| 17 · Fall until the bottom | side | 29.3 | 9.0 |
| 18 · How high is it? | side | 24.0 | — |
| 19 · Fall down! | side | 24.0 | — |
| 20 · Did Chef catch it? | side | 23.7 | 9.9 |
| 21 · Score a point! | side | 25.9 | — |
| 23 · Ten catches yet? | side | 22.6 | 9.9 |
| 24 · Feast Ready! | side | 19.8 | — |
| 25 · Clean up a catch | place | 31.2 | 13.5 |
| 26 · Clean up a miss | place | 31.2 | 9.2 |

- Maps are small by design (an inset showing *where*, with the new block ringed in pumpkin orange). The block itself is always shown large in the main picture or the “NEW BLOCK” card.
- Contact sheet: `qa/KeenKids_Thanksgiving_Feast_Contact_Sheet.png`. Every slide PNG was reviewed visually; densest slides (13, 20, 23, 24, 25, 26, 27) were reviewed at full 1920×1080.

## 5. Gameplay: what was genuinely tested

Engine: scratch-vm + scratch-render (UMD builds), headless Chromium + SwiftShader WebGL, compatibility mode 30 fps. Each row ran the project **as it is after that demo** (built from the starter by `src/build_sb3.js`). Mouse movement was sent with `vm.postIOData('mouse', …)`. Result: **14 PASS, 0 FAIL**, plus observations.

| Demo | Test | Method | Status | Measured |
|---|---|---|---|---|
| 1 | Starter shows Chef, pumpkin, kitchen; no code runs | Load starter, read sprites, click flag | PASS | `{"names":["Stage","Chef","Food"],"chef":{"x":0,"y":-130,"visible":true,"bubble":""},"food":{"x":0,"y":180,"visible":true,"bubble":""},"threadsAfterFlag":0,"chefAfter":{"x":0,"y":-130,"visible":true,"bubble":""}}` |
| 2 | Every flag click returns Chef to (0, -130) | Move Chef away, click flag (twice) | PASS | `{"before":{"x":150,"y":60,"visible":true,"bubble":""},"after1":{"x":0,"y":-130,"visible":true,"bubble":""},"after2":{"x":0,"y":-130,"visible":true,"bubble":""}}` |
| 3 | Score monitor reads 0 on flag | Set Score to 7, click flag | PASS | `{"before":7,"after":"0","monitor":[{"opcode":"data_variable","visible":true,"value":"0"}]}` |
| 4 | Chef follows mouse left/right, stays at y -130 | Post mouse moves at 4 points (incl. top and bottom) | PASS | `{"pts":[{"mouseX":150,"mouseY":100,"chefX":150,"chefY":-130},{"mouseX":-180,"mouseY":-40,"chefX":-180,"chefY":-130},{"mouseX":60,"mouseY":170,"chefX":60,"chefY":-130},{"mouseX":-20,"mouseY":-170,"chefX":-20,"chefY":-130}` |
| 5 | Original pumpkin hides on flag; no copies yet | Flag, wait 2 s | PASS | `{"food":{"x":0,"y":180,"visible":false,"bubble":""},"clones":0}` |
| 6 | Spawner keeps making copies every 1–2 s, and they stay hidden | Flag, watch 10 s (300 frames) | PASS | `{"clonesAfter10s":5,"visibleClones":0,"gapsFrames":[32,32,62,62],"minGapS":1.0666666666666667,"maxGapS":2.066666666666667}` |
| 7 | Copies show at y 180 at different x between -200 and 200 | Flag, wait 8 s, read clones | PASS | `{"n":6,"xs":[175,56,-101,191,92,-76],"ys":[180],"allVisible":true,"movedAfter1s":false}` |
| 8 | Copies fall 8 px per frame and stop just below -170 (no cleanup yet) | Flag, follow first clone frame by frame | PASS | `{"firstY":172,"finalY":-172,"steps":[-8],"clonesStillThere":7,"stuckAtBottom":5}` |
| 9 | Score goes up when Chef touches food | Chef placed under the first pumpkin; count points from that one pumpkin | PASS | `{"pointsFromOnePumpkin":13}` |
| 9 | Known intermediate state: one pumpkin can add more than 1 point | Same run | OBSERVED | `{"pointsFromOnePumpkin":13}` |
| 10 | “Feast Ready!” appears at more than 9 points, then the game stops | Chef under first pumpkin until win | PASS | `{"say":{"frame":101,"sprite":"Food","isClone":true,"type":"say","text":"Feast Ready!"},"scoreAtSay":10,"secondsSayToStop":1.93,"threadsAfter":0,"clonesAfter":0}` |
| 10 | The speech bubble belongs to a Food clone (the pumpkin), not Chef | SAY event source | PASS | `{"sprite":"Food","isClone":true}` |
| 11 | Every catch adds exactly 1 point; caught copies vanish | Auto-catch: mouse follows the lowest pumpkin; Score must equal copies deleted on a catch + the 1 winning copy still showing its bubble | PASS | `{"winnerStillShowing":1,"framesToWin":471,"scoreAtSay":10,"caughtAtSay":9,"missedAtSay":0,"maxScorePerFrame":1,"maxClonesOnStage":1,"say":{"frame":470,"sprite":"Food","isClone":true,"type":"say","text":"Feast Ready!"}}` |
| 11 | Win at 10: “Feast Ready!” on the pumpkin, then stop all | Same run, after the bubble | PASS | `{"threads":0,"clones":0,"score":10,"stoppedAfterS":2.03,"say":{"frame":470,"sprite":"Food","isClone":true,"type":"say","text":"Feast Ready!"}}` |
| 11 | During the 2-second bubble the game keeps running (Score can pass 10) | Same run: Score after stop all | OBSERVED | `{"scoreAtSay":10,"scoreAfterStop":10}` |
| 11 | Missed food is deleted at the bottom; no pile-up; new copies keep falling | Chef parked at the far left for 20 s | PASS | `{"secondsWatched":20,"copiesMade":12,"maxCopiesOnStageAtOnce":2,"copiesLeftOnFloor":0,"score":1,"stillSpawning":true}` |

**Inferred, not tested:** behaviour inside the real Scratch 3 / TurboWarp *editor GUI* (palette, drag-and-drop, sprite list), which the slides illustrate with a schematic plus the real stage. Mouse input came from the VM API, not a physical mouse. Classroom devices, tablets and touch input were not tested. Frame timing ran under software WebGL (`say for 2 seconds` measured 1.8–2.0 s of frames).

## 6. Output structure

```
{
 "pptxSlides": 28,
 "pptxNotes": 28,
 "pptxMedia": 99,
 "pptxSlideSize": "<p:sldSz cx=\"12192000\" cy=\"6858000\"/>",
 "pptxFonts": [
  "Literata",
  "Figtree"
 ],
 "pptxSlidesWithoutNotes": 0,
 "pptxEditableTextBoxes": 378,
 "pptxPictures": 78,
 "pdfPages": 28,
 "pdfPageSizeIn": [
  13.333,
  7.5
 ],
 "pdfEmbeddedFonts": [
  "Literata-Bold",
  "Figtree-Bold",
  "Literata-Regular",
  "Figtree-Regular",
  "Figtree-Italic",
  "LucidaGrande-Bold"
 ]
}
```

- The PDF is printed from the same positioned layout that generates the PPTX (one geometry → `render_html.js` and `build_pptx.js`), with Literata/Figtree embedded, so it is a faithful twin. PowerPoint is not installed on this Mac. A Keynote render of the .pptx was attempted (AppleScript open + export) but timed out before the document opened, most likely on a font or permission dialog. So **the .pptx itself was not visually rendered by an office app**; it was checked structurally (above).

## 7. Canva

**Status: NOT imported. No Canva link exists for this deck; none is claimed.**

What was attempted (authenticated Canva connector, 2026-11-17):
1. `create-upload-url` → POST of `KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` → **HTTP 400 `Unsupported file format ZIP`**. The agent upload endpoint sniffs the .pptx container as ZIP and refuses it.
2. `create-upload-url` → POST of the PDF twin → HTTP 201, `fileId oAHbNh-dk_8`. The PDF now sits in the account's Canva uploads, but **no design was created** (checked with `search-designs`, newest first).
3. Not used: `import-design-from-url` needs a public HTTPS URL, and its rules forbid hosting a generated file publicly to create one. `create-design` with the file as a reference is an AI generator that re-lays-out content, so it would not be a faithful import of this deck.

**Manual import (about 1 minute, keeps everything editable):**
1. Canva home page › **Uploads** › **Upload files** › choose `output/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` (per Canva Help Center, checked 2026-11-17).
2. When the upload finishes, click the file. It opens in the editor as an editable presentation.
3. Check: 28 pages, 16:9. Scratch blocks and stage pictures come in as images; the rest is editable text. Fonts Canva lacks are swapped for similar ones.
4. **Speaker notes are NOT imported** (Canva Help Center). Teach from the Teacher Guide, present from PowerPoint/Keynote to keep the notes, or paste them into each slide’s **Notes** panel in Canva.

## 8. Known limitations

- **Fonts:** the PPTX names Literata and Figtree. Machines without them substitute fonts, and line breaks may shift. Install `output/fonts/*.ttf` before presenting from PowerPoint/Keynote.
- **Scratch blocks are pictures** (high-resolution PNG from scratchblocks) so they keep exact Scratch shapes in PowerPoint and Canva. All other text is editable.
- **Editor illustrations** on slides 4 and 6 are schematics of the Scratch/TurboWarp editor built around the real stage and sprites, not screenshots of a specific editor version.
- Demo 9/10 intermediate behaviour (many points per pumpkin; win on the first catch) is real and documented in notes; it is resolved by Demo 11 exactly as the prescribed step order intends.
