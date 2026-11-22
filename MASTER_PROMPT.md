# MASTER PROMPT — KEENKIDS THANKSGIVING FEAST (GRADES 1–2)

You are the lead early-elementary Scratch instructor, instructional designer, and slide-production engineer for KeenKids Enrichment. **Execute the work end to end, not just plan it.** Build a polished, accurate, classroom-ready, step-by-step slideshow for a **45–50-minute class** in which children in **grades 1–2** build the provided **Thanksgiving Feast!** Scratch game from a starter file. Prioritize clarity, ease of teaching, fidelity to the teacher's 11 demonstrations, and excellent visual quality over gratuitous animations.

## 0. Where to work and what to inspect

- Work in a new folder `~/Developer/keenkids-thanksgiving-feast/`. Do not overwrite the Soccer Striker materials, the starter, or the live KeenKids site.
- Find the actual starter named `Thanksgiving_Feast! (1).sb3` first in the current working directory, `~/Downloads`, `~/Desktop`, and the prior KeenKids work folders. The user will download/copy the attached starter to the Mac if necessary; if missing, report the exact missing file, but continue creating the slide deck from the exact written spec below and mark unverified asset work clearly.
- Read the `.sb3` as a ZIP archive and inspect `project.json`, SVG assets, costumes, sprite names, stage, coordinates, and initial blocks **before** authoring. The uploaded source inspected in ChatGPT has **3 targets**: Stage, Chef, Food. Stage uses the `Feast Kitchen` backdrop; Chef has a `chef` costume and begins at `x:0 y:-130`; Food has a `pumpkin` costume and begins at `x:0 y:180`; **all three targets have zero code blocks** and the starter has no variables. Verify your local copy agrees.
- Extract the actual Chef, pumpkin, and kitchen visuals from the supplied `.sb3` and use these in the lesson. No random stock art; no newly invented characters, costumes, or mechanics.
- Inspect the visual direction of `https://keenkids-storybook-preview.vercel.app/`. Also inspect the user's previous `KeenKids_Soccer_Striker_Scratch_Lesson.pptx` or `KeenKids_Soccer_Striker_Claude_Code_Kit.zip` if locally available. Use those as STYLE references, not sources of coding content. The previous Canva deck is `https://www.canva.com/d/G41PEYbF30NpdcW`; don't modify it.
- Inspect the supplied screenshot of the TurboWarp editor if available. It shows Chef selected, Food sprite, feast backdrop, and a blank code area. Do not assume the screenshot itself is present on the Mac unless you can find it.

## 1. Outcome and teaching constraints (NON-NEGOTIABLE)

- **Exactly 11 instructor demonstrations in the exact order below.** The goal is the provided catch-the-pumpkin game. Do not add a timer, sound, costume change, health bar, power-up, bonus challenge, unlock system, or any new mechanics.
- The students are **grades 1–2**. Use plain, warm language approximately grade 1–3 reading difficulty: short sentences, concrete words, friendly analogies. Explain every code block in a few words. Example: `A clone is a copy of our pumpkin.` / `Forever means: keep doing it!` / `X moves left and right.`
- **1–3 NEW Scratch blocks per coding slide**, including reporter/condition blocks where possible. A nested script can be divided across several slides. Use a small, dimmed context label or ghosted earlier stack if necessary, but never shrink an entire script into unreadable tiny text. Essential blocks must be large enough to read from the back of a classroom.
- Students follow on **their own devices**. Every slide must identify **WHO to click** (Chef / Food / Variables / Stage), **WHERE the blocks belong**, **WHAT to drag next**, **WHY it matters**, and a tiny **TRY IT / DONE WHEN** checkpoint at the right moments. Never assume a sprite selection carries over unnoticed.
- Make about **26–32 slides**, including an attractive title, 'today we will make' preview, 11 clearly numbered demos across ~2–3 slides each, periodic 'Try it' checkpoints, and a cheerful ending. Prefer breaking a tricky step over adding tiny text; the slide count is flexible if needed to retain the 1–3-new-block constraint.
- **16:9, high-contrast, projector first**. Headings generally 36–48 pt, body 25–32 pt, authentic block labels as legible as possible; generous padding. One central idea per slide. Never use a text-heavy instruction sheet or corporate bullet-point deck.
- Student-facing text should be short: usually one title (4–7 words), a 1–2-sentence explanation (ideally 8–18 words total), one big block sequence or one labeled UI action, and a small test prompt. Put detailed guidance in actual presenter notes and `Teacher_Guide.md`.

## 2. Visual system

Follow KeenKids' premium illustrated storybook style rather than a generic STEM template. Warm cream / paper background, deep evergreen headings, pumpkin-orange and muted golden accents, simple frame lines, subtle paper texture, friendly editorial typography. Inspect the live style before choosing exact colors; if inaccessible, reuse the theme tokens and fonts from the previous Soccer Striker materials if available (Literata-style serif display heading, Figtree-style readable sans body). No neon, gradients, glass cards, crowded stickers, busy backgrounds, excessive emoji, teen/corporate aesthetics, or generic stock kids.

Use real sprite/stage graphics extracted from the starter on title, demo and checkpoint slides; show only appropriate assets. Scratch blocks should look like **actual Scratch 3** blocks, with true shapes, official category colors, menus, rounded sensing reporters, operator hexagons, C-shaped loops, event hats, and accurate text. Prefer SVG from `scratchblocks`, but validate rendering against actual Scratch/TurboWarp. Do not use fake rectangles pretending to be Scratch code. Keep one consistent layout system throughout; vary illustration placement moderately so slides feel lively while remaining predictable to young readers.

Every slide should be understandable **without a teacher squinting at a PDF**. Code is the main visual. Include a tiny category breadcrumb e.g. `Click FOOD · Control` when helpful. Highlight the NEW pieces only, and show insertion location in a small contextual inset if a new block goes **inside** a loop or condition. Use a teacher-only preview of the cumulative completed code in speaker notes or the guide rather than showing it tiny to students.

## 3. Technical stack and resources

Use a focused, safe toolchain; inspect official repositories and package versions first. Download or install only what helps:

1. `https://github.com/scratchblocks/scratchblocks` — render true Scratch 3 syntax into vector-like graphics; verify each rendered sprite name, slot, dropdown, and operator against the real editor.
2. `https://github.com/gitbrent/PptxGenJS` — build a layout-controlled, editable-text PowerPoint and speaker notes; output PPTX suitable for Canva import.
3. `https://github.com/microsoft/playwright` — render/test HTML slide previews or screenshot each deck page. Use screenshot and overflow QA.
4. Optional, only if genuinely useful: `https://github.com/zarazhangrui/frontend-slides` for slide design practices; `https://github.com/anthropics/skills` for presentation/visual craft reference. Do not install huge skill packs for no reason and don't modify global Claude skills without user approval.

Prefer local project dependencies over global installations. Check repository trust and install instructions; do not blindly pipe remote shell scripts to a shell. Do not seek unnecessary sudo or payment. No authentication bypass. If Canva access is not authenticated, **do not claim** it was uploaded.

**Target output is an editable Canva presentation**; preferred pipeline is: generate high-quality `PPTX` with real editable text/shapes where possible → render and inspect PDF and slide screenshots → **import that PPTX into Canva** using authenticated access if available. A successful verified Canva edit/view link is the preferred handoff. If Canva import is blocked, deliver Canva-ready PPTX plus clear manual import instruction. Google Slides is only a fallback if it can be created and verified with existing authorized access; do not abandon a good PPTX for a weaker Google Slides export.

## 4. EXACT 11-demo coding curriculum (do not improvise)

These are the user's official lesson steps, and this exact game is the final behavior. Every demo gets student slides, presenter notes, a checkpoint, and an entry in the teaching guide.

### DEMO 1 — Open the starter 🍂
**Sprite/action:** Load the starter; DO NOT create a new project or delete any sprites. Chef, Food sprite (pumpkin), and Feast Kitchen backdrop already exist. **The starter contains ZERO blocks** — writing the code is the lesson.
**DONE WHEN:** each child sees Chef, pumpkin, and the kitchen backdrop.
**Explain:** “Our pictures are ready. Now we give them instructions.”

### DEMO 2 — Chef starts at the bottom 🎩
**Click:** Chef sprite.
```
when green flag clicked
go to x: (0) y: (-130)
```
**DONE WHEN:** every flag click returns Chef to bottom center.
**Explain:** “The green flag starts the game. Go to puts Chef in his starting spot.”

### DEMO 3 — Score! ⭐
**Click:** Variables → Make a Variable → `Score` → **For all sprites**.
Add on the same Chef flag stack, before the movement loop:
```
set [Score v] to (0)
```
**DONE WHEN:** Score monitor displays zero on flag.
**Explain:** “Score counts pumpkins. New game, zero points!”

### DEMO 4 — Follow the mouse! 🖱️
**Click:** Chef. Under the existing setup blocks:
```
forever
  set x to (mouse x)
end
```
The `mouse x` reporter comes from Sensing, dropped into the Motion `set x to` block. DO NOT change Chef's y in the loop.
**DONE WHEN:** Chef slides LEFT/RIGHT when mouse moves and stays at the bottom.
**Explain:** “X means side to side. Forever means keep following the mouse.”

### DEMO 5 — The spawner hides 🎃
**Click:** Food. New stack:
```
when green flag clicked
hide
```
The original Food sprite remains hidden, making **clones** (copies).
**DONE WHEN:** original pumpkin disappears when flag clicked.
**Explain:** “The first pumpkin hides. Its copies will fall.”

### DEMO 6 — Make clones! 👯
**Click:** Food. Extend the same flag stack after `hide`:
```
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself v]
end
```
Explain the Operators `pick random` number inside the wait block. The spawner should continue creating clones. At this point they will be hidden, so **DO NOT claim visible pumpkins will appear yet** — the visible falling copies only arrive when DEMO 7 adds `show` on clone start. In the original supplied step, the "DONE WHEN" says new pumpkins appear in Demo 6; correct the **checkpoint wording in teacher notes** without changing the mechanics: "Our spawner is ready; next we'll make the copies visible."
**Explain:** “Every 1 or 2 seconds, make a new pumpkin copy.”

### DEMO 7 — Clones appear at the top 🌧️
**Click:** Food. NEW SEPARATE stack:
```
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
```
This must be **the clone event**, not a second green flag. The clone copies its hidden parent's visibility; it MUST have `show` to become visible.
**DONE WHEN:** visible pumpkins appear near the top, at different horizontal positions.
**Explain:** “Each copy shows up at a surprise spot across the top.”

### DEMO 8 — Fall! ⬇️
**Click:** Food. Extend the CLONE stack:
```
repeat until <(y position) < (-170)>
  change y by (-8)
end
```
Use Motion `y position` reporter within an Operators `<` comparison inside Control `repeat until`. Place loop under `go to` on the clone stack. Negative y makes the pumpkin go DOWN. The repeat test stops the falling sequence just below the bottom.
**DONE WHEN:** clones fall smoothly and reach the bottom. (They won't yet disappear; cleanup comes in Demo 11.)
**Explain:** “Y means up and down. Minus 8 makes food fall.”

### DEMO 9 — Catch! Score +1 🎯
**Click:** Food. INSIDE the `repeat until`, BELOW `change y by -8`:
```
if <touching [Chef v]?> then
  change [Score v] by (1)
end
```
The `touching Chef?` reporter comes from Sensing. Keep the IF inside the falling loop. **NOTE:** until Demo 11 adds `delete this clone` inside the catch, a single pumpkin might award **more than one point** because it stays touching Chef for multiple loop iterations. DO NOT misrepresent this intermediate state as reliably one point per pumpkin. Say in teacher notes: "It starts counting catches; we'll make each pumpkin count once in Demo 11." Do not add the clone deletion early unless explicitly reflected in the demo progression.
**DONE WHEN:** Score goes up after Chef touches food (the exactly-once rule is finalized in Demo 11).
**Explain:** “If the pumpkin touches Chef, we get a point.”

### DEMO 10 — Win at 10! 🏆
**Click:** Food. INSIDE the catch IF, immediately after `change Score by 1`:
```
if <(Score) > (9)> then
  say [Feast Ready!] for (2) seconds
  stop [all v]
end
```
`>` comes from Operators, Score is a Variables reporter. Use `Score > 9`, **not** `Score = 10`.
**DONE WHEN:** at 10 or more points, `Feast Ready!` appears, then the game stops.
**TECHNICAL TRUTH:** Because this script belongs to a **Food clone**, the `say` bubble is on the **pumpkin**, not Chef. The user's text describes "Chef says" but that would require additional Chef-specific messaging. Honor the exact prescribed code and explain this distinction in teacher notes; student slide can simply say "Feast Ready! appears" rather than attributing it to Chef. Do not silently add a broadcast or extra blocks.
**Explain:** “Ten catches means the feast is ready!”

### DEMO 11 — Delete every clone! 🗑️
**Click:** Food. Add `delete this clone` in **TWO** places:
A. INSIDE the catch IF, AFTER the win IF, for normal successful catches.
B. AFTER the entire `repeat until` loop, for food that reaches the bottom without being caught.
**DONE WHEN:** fallen pumpkins don't pile up; every normal catch adds exactly one point; new copies keep falling; winning stops game.
**Explain:** “Delete means the copy goes away. We clean up catches AND misses!”
Include a diagram/insertion guidance so students don't put either deletion inside the wrong nest. The `stop all` branch naturally ends execution on the winning catch and does not need clone deletion first.

### Complete final teacher-only script map (must match the final game)
**Chef:** `when flag` → `go to (0,-130)` → `set Score to 0` → `forever { set x to (mouse x) }`.
**Food / spawner:** `when flag` → `hide` → `forever { wait (pick random 1 to 2) seconds; create clone of myself }`.
**Food / clones:** `when I start as a clone` → `show` → `go to x random(-200,200), y 180` → `repeat until (y position < -170) { change y by -8; if touching Chef { change Score by 1; if Score > 9 { say Feast Ready! for 2 sec; stop all }; delete this clone } }` → `delete this clone`.
No unrelated mechanics. A single clone can never add two points after Demo 11.

## 5. Slide rhythm and practical class timing

Build enough slides for 1–3 new blocks per slide. Use this **48-minute** teaching route, and put it in a 1-page teacher cue sheet:
- Opening / what we are making: 2 min
- Demo 1: 2 min
- Demo 2: 3 min
- Demo 3: 3 min
- Demo 4: 4 min
- Demo 5: 2 min
- Demo 6: 5 min
- Demo 7: 5 min
- Demo 8: 5 min
- Demo 9: 5 min
- Demo 10: 4 min
- Demo 11: 5 min
- Final playtest / celebrate: 3 min
**Total: 48 min.**

Plan extra help in presenter notes but no student-facing bonus coding. Prioritize complete, successful game over a fancy outro if class runs short. Make a simple recurring pattern: **WATCH** (teacher models) → **BUILD** (kids place 1–3 new blocks) → **TRY** (kids click flag/move mouse). Keep the page number/demo count visible but subtle. At key checkpoints, let students raise a hand or give a thumbs-up instead of adding paragraphs to slides.

Suggested slide structure (adapt count to maintain readability):
1. Cover / actual feast art.
2. Today's mission: move Chef; catch food; count to ten (no code).
3–5. Demos 1–2 (load starter, green flag, go-to).
6–7. Demo 3 (variable, reset).
8–10. Demo 4 (forever, mouse x, test).
11–12. Demo 5 (Food, hide).
13–15. Demo 6 (forever/wait/random/clone: split new blocks).
16–18. Demo 7 (clone event/show/top/random x).
19–21. Demo 8 (repeat until / comparison / fall).
22–24. Demo 9 (touch Chef / score, test).
25–27. Demo 10 (Score > 9 / say / stop).
28–30. Demo 11 (deletion inside catch / deletion after loop / final check).
31. Play your game / final cheer (optional; can combine).

The above ranges are only a scaffold. Adjust to ~26–32 slides without losing any content or enlarging beyond 3 new blocks. No slide should use a full-screen wall of code.

## 6. Deliverables and correctness

Create all of these in `~/Developer/keenkids-thanksgiving-feast/output/`:
1. `KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` — editable PowerPoint, 16:9, complete slides, speaker notes.
2. `KeenKids_Thanksgiving_Feast_G1-2_FINAL.pdf` — visually identical PDF.
3. `KeenKids_Thanksgiving_Feast_Teacher_Guide.md` — 48-minute plan; every demo's exact blocks; slide-by-slide 1–2 sentence teaching script; common child errors and quick fixes; key caveats in Demos 6, 9, 10.
4. `KeenKids_Thanksgiving_Feast_Slide_Map.md` — slide # → demo # → sprite → 1–3 *new* blocks → checkpoint.
5. `KeenKids_Thanksgiving_Feast_QA_Report.md` — file inventory, verified block fidelity, slide readability checks, screenshots/contact sheet, what was genuinely playtested, and any known limitations.
6. `KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3` — a working **copy** of the starter with exact completed scripts, if you can reliably generate, validate, and test it. Preserve the starter as-is. If you can't produce a trustworthy completed Scratch file, don't fake one; document the blocker and keep the presentation accurate.
7. A verified Canva **edit link** only if you actually imported the deck under authenticated access; otherwise provide the PPTX and concise Canva import instructions.
8. Keep source scripts/assets in `src/`, extracted art in `assets/`, and rendered slide PNG/contact sheet in `qa/`.

## 7. QA gates (must pass before saying done)

- Confirm starter has only Stage/Chef/Food, and all initially have **zero code**. Do not base slides on a precompleted game.
- Every demo 1 through 11 appears in order, no extra mechanics, no challenge unlocks.
- Every coding slide introduces **at most 3 new Scratch blocks** (prefer fewer for hard concepts). Nested reporter/condition placement must be clear.
- All exact positions, names, values, loop positions, block categories and dropdowns are correct: `Chef`, `Food`, `Score`, x 0 / y -130, mouse x, random 1–2 seconds, random x -200 to 200, top y 180, `y position < -170`, move y -8, `touching Chef`, change Score by 1, `Score > 9`, say 2 sec, `stop all`, both clone deletions.
- Check all slide headings and explanations at 1920x1080 and projector-like scale. No missing fonts, impossible tiny SVG labels, text overflows, incorrect drop shadows, broken masks, stretched sprite art, clipped nested C-blocks, or overlapping shapes. Render every slide and examine a contact sheet, and personally review the densest slides.
- Audit explanations against Scratch runtime: before Demo 7 hidden clones aren't visible; before Demo 11 repeated scores may occur; Food's win speech belongs to Food, not Chef. Document these in teacher notes without changing supplied step order.
- Load the completed exemplar into Scratch/TurboWarp if built. Test reset, mouse x only, hidden spawner, random clone appearance, falling, score once, disappearance on catch/miss, win at ten. Separate **tested** from **inferred** in QA report. Do not claim gameplay verification merely because you parsed JSON.
- If using Canva, confirm import succeeded, design type is presentation, page count matches exported deck, and pages are actually readable. No invented link.

## 8. Execution sequence — do it now

1. Audit the actual starter and extract actual art.
2. Audit the existing KeenKids visual design and relevant previous slide style; select design tokens.
3. Install only necessary trusted packages/skills locally.
4. Author precise slide content and teacher notes using the 11 steps above.
5. Generate the editable PPTX and PDF. Render ALL slides and fix legibility/overflow/Scratch syntax issues.
6. Produce teacher guide, map, QA report, and completed teacher `.sb3` if reliably possible.
7. Import and verify in Canva if your session has authenticated access; otherwise provide the PowerPoint ready for import.
8. Report final exact file paths, actual slide count, actual Canva link if applicable, and objective pass/fail test status. **Do not stop after a plan. Do not claim success for untested items.**

SUCCESS = A first/second-grade teacher can open the slide deck and guide a class from the 0-block pumpkin starter to a working 10-point Thanksgiving catch game in 48 minutes, with one small, accurate, readable block change per screen and no need to invent missing instruction steps.
