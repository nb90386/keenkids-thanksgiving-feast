// Generates Teacher Guide, Slide Map and QA Report (Markdown) from the same sources as the deck + real test outputs.
const fs = require('fs'), path = require('path');
const SLIDES = require('./content.js');
const notes = require('./notes.js');
const { FINAL, stateAfter, sbText } = require('./scripts.js');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'output');
const J = (f, d = null) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')); } catch { return d; } };
const MAN = J('blocks/manifest.json');
const GP = J('gameplay/results.json');
const SB3 = J('render/sb3_report.json');
const CHK = J('render/output_checks.json', {});
const LQA = J('../qa/render/layout_qa.json');
const CANVA = J('render/canva.json');
const VER = fs.readFileSync(path.join(__dirname, 'render', 'code_verification.txt'), 'utf8');
const { clock, fmt, pretty, newList } = notes;
const n2 = (i) => String(i + 1).padStart(2, '0');
const code = (t) => '```\n' + t + '\n```';
const DEMO_NAMES = { 1: 'Open the starter', 2: 'Chef starts at the bottom', 3: 'Score!', 4: 'Follow the mouse!', 5: 'The spawner hides', 6: 'Make clones!', 7: 'Clones appear at the top', 8: 'Fall!', 9: 'Catch! Score +1', 10: 'Win at 10!', 11: 'Delete every clone!' };
const segMin = (pred) => SLIDES.reduce((a, s, i) => a + (pred(s, i) ? s.min : 0), 0);
const slidesOf = (pred) => SLIDES.map((s, i) => (pred(s, i) ? i + 1 : null)).filter(Boolean);
const range = (a) => (a.length > 1 ? `${a[0]}–${a[a.length - 1]}` : String(a[0]));
const finalText = ['Chef', 'Food'].flatMap((sp) => FINAL[sp].map((sc) => `[${sp}]\n${pretty(sbText(sc))}`)).join('\n\n');

// ---------- cue sheet rows ----------
const segs = [['Opening / what we are making', (s) => ['cover', 'mission', 'routine'].includes(s.type)]];
for (let d = 1; d <= 11; d++) segs.push([`Demo ${d}: ${DEMO_NAMES[d]}`, (s) => s.demo === d]);
segs.push(['Final playtest / celebrate', (s) => s.type === 'finish']);
let tAcc = 0;
const cueRows = segs.map(([name, pred]) => { const m = segMin(pred); const row = `| ${name} | ${m} | ${fmt(tAcc)}–${fmt(tAcc + m)} | ${range(slidesOf(pred))} |`; tAcc += m; return row; });

// ---------- TEACHER GUIDE ----------
const G = [];
G.push('# KeenKids Thanksgiving Feast: Teacher Guide (Grades 1–2)', '');
G.push('**Class length:** 48 minutes · **Students:** grades 1–2, each on their own device · **Deck:** `KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` (28 slides, speaker notes on every slide)', '');
G.push('Students start from the **Thanksgiving_Feast! (1).sb3** starter. It already has the Feast Kitchen backdrop, a **Chef** sprite and a **Food** sprite (pumpkin costume), and **no code at all**. In 11 demonstrations they build a catch-the-pumpkin game. Chef follows the mouse, pumpkins fall, each catch adds 1 point, and at 10 points the pumpkin says “Feast Ready!” and the game stops.', '');
G.push('## Before class', '');
G.push('- Put `Thanksgiving_Feast! (1).sb3` where every device can open it (shared drive, downloads folder or LMS). Students load it with **File › Load from your computer**. Do **not** start a new project.',
  '- Keep `KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3` open on your machine as a working answer key. It was built from the starter and tested in the Scratch engine (see QA Report).',
  '- Teach the signals: **thumbs up** = it works, **hand up** = I need help.',
  '- Every coding slide shows **who to click** (big chip, top left), **where the blocks go** (“PUT IT”), which palette categories to open (coloured dots), the **new blocks in full colour**, and blocks that are already there **faded**.', '');
G.push('## The routine on every step', '', '**WATCH** (you model on the projector) → **BUILD** (kids drag the 1–3 new blocks) → **TRY** (kids click the green flag / move the mouse). Before any drag, ask: *“Which sprite did we click?”*', '');
G.push('## 48-minute cue sheet', '', '| Segment | Min | Clock | Slides |', '|---|---|---|---|', ...cueRows, `| **Total** | **${tAcc}** | | |`, '');
G.push('If time runs short, cut talk, not code. A finished, working game matters more than the final cheer. There is **no student-facing bonus coding** in this lesson; early finishers play-test, then help a neighbour by pointing, not by touching their mouse.', '');
G.push('## Demo by demo', '');
for (let d = 1; d <= 11; d++) {
  const idx = SLIDES.map((s, i) => (s.demo === d ? i : -1)).filter((i) => i >= 0);
  G.push(`### Demo ${d}: ${DEMO_NAMES[d]} (${segMin((s) => s.demo === d)} min · slides ${range(idx.map((i) => i + 1))})`, '');
  for (const i of idx) {
    const s = SLIDES[i];
    G.push(`**Slide ${i + 1}: ${s.title}**${s.sprite ? ` · Click **${s.sprite}**` : ''}${s.where ? ` · Put it: *${s.where}*` : ''}`, '');
    if (s.code || s.block) {
      G.push(`New blocks (${newList(s).length}): ${newList(s).map((b) => '`' + b + '`').join(', ')}`, '');
      if (s.code) G.push('On the slide (faded lines are already in the project):', '', code(pretty(s.code)), '');
      if (s.type === 'place') G.push('Where it goes:', '', code(pretty(s.map)), '');
    }
    G.push(`- **Say:** ${s.say}`);
    if (s.do) G.push(`- **Do:** ${s.do}`);
    if (s.try) G.push(`- **Try it:** ${s.try} **Done when:** ${s.done}`);
    else if (s.done) G.push(`- **Done when:** ${s.done}`);
    if (s.checks) G.push(`- **Checklist:** ${s.checks.join(' · ')}`);
    if (s.watch) G.push(`- **Common error → quick fix:** ${s.watch}`);
    if (s.fix) G.push(`- **Stuck?** ${s.fix}`);
    if (s.truth) G.push(`- **Teacher note:** ${s.truth}`);
    G.push('');
  }
  if (d >= 2) G.push(`<details><summary>Full code after Demo ${d} (teacher only)</summary>`, '', code(['Chef', 'Food'].flatMap((sp) => (stateAfter(d)[sp] || []).map((sc) => `[${sp}]\n${pretty(sbText(sc))}`)).join('\n\n')), '', '</details>', '');
}
G.push('## Key caveats (read before teaching)', '',
  '- **Demo 6: nothing appears yet.** Clones copy the hidden original, so after Demo 6 the stage stays empty. The original step text said new pumpkins appear here; the corrected checkpoint is *“Our spawner is ready; next we make the copies visible.”* Visible pumpkins arrive in Demo 7 with `show`. Tested: 5–6 hidden copies after 10 s, 0 visible.',
  '- **Demo 7: clones need their own hat.** It must be `when I start as a clone`, not a second green flag. Right after slide 14 (before the `go to`), every copy appears in the same spot, top middle, half off the stage.',
  '- **Demo 8: pumpkins pile up.** Until Demo 11 the copies stop just below y = -170 (tested: they stop at -172) and stay on the floor.',
  '- **Demo 9: one pumpkin gives many points.** The `if touching Chef` check runs every frame while the pumpkin falls through Chef. Tested: **13 points from one pumpkin**. Say *“It starts counting catches; we’ll make each pumpkin count once in Demo 11.”* Do not promise one point per pumpkin yet.',
  '- **Demo 10: the pumpkin talks, not Chef.** The win check runs inside a Food clone, so “Feast Ready!” appears on the **pumpkin** (tested). The lesson uses the exact prescribed code; no broadcast is added. Because of the Demo 9 behaviour, the first catch alone can pass 9 points, so “Feast Ready!” may appear on the first catch until Demo 11. Use `Score > 9`, not `Score = 10`.',
  '- **Demo 11: two deletes, two places.** (A) inside the touching-if, *after* the whole `if Score > 9` block, and (B) after the `repeat until` loop. `stop all` is a cap block (nothing snaps under it), so the winning catch ends there. Tested after Demo 11: Score equals pumpkins caught, missed pumpkins vanish at the floor, never more than 2 copies on stage.',
  '- **Win timing:** “Feast Ready!” shows for 2 seconds while the game keeps running, then `stop all`. A quick player can catch one more pumpkin in those 2 seconds (Score 11). This is how the prescribed code behaves.', '');
G.push('## Common errors and quick fixes', '', '| Symptom | Likely cause | Quick fix |', '|---|---|---|',
  '| Blocks “disappeared” | A different sprite is selected | Click the sprite named on the slide’s chip; each sprite has its own code |',
  '| Chef moves up and down | Used `go to mouse-pointer` or `set y` | Use `set x to (mouse x)` only |',
  '| Nothing happens on flag | Hat block missing or blocks not snapped | Snap under `when green flag clicked`; look for gaps |',
  '| Pumpkin never hides | `hide` went onto Chef | Click Food; move the script there |',
  '| No pumpkins after Demo 7 | No `show`, or a second green flag instead of `when I start as a clone` | Fix the clone hat; add `show` |',
  '| Pumpkins float up | Typed `8` instead of `-8` | Change y by **-8** |',
  '| Pumpkins vanish instantly | `delete this clone` placed inside the loop above `change y` | Move it to the very bottom, after the loop |',
  '| Score never changes | Menu still says `my variable` / `mouse-pointer` | Pick **Score** / **Chef** in the menus |',
  '| Score not shared | Variable made “For this sprite only” | Delete it and remake **Score** “For all sprites” |',
  '| Game never ends | Used `= 10` or `if` outside the touching-if | Use `Score > 9` inside the touching-if |', '');
G.push('## Complete final code (teacher only)', '', code(finalText), '');
G.push('## Slide-by-slide teaching script', '', ...SLIDES.map((s, i) => `${i + 1}. **${s.title}** (${s.min} min, ${fmt(clock[i][0])}): ${s.say}`), '');
fs.writeFileSync(path.join(OUT, 'KeenKids_Thanksgiving_Feast_Teacher_Guide.md'), G.join('\n'));

// ---------- SLIDE MAP ----------
const M = ['# KeenKids Thanksgiving Feast: Slide Map', '', `${SLIDES.length} slides · 16:9 · each coding slide introduces 1–3 new Scratch blocks.`, '', '| Slide | Demo | Sprite | New blocks (1–3) | Checkpoint |', '|---|---|---|---|---|'];
SLIDES.forEach((s, i) => {
  const nb = s.code || s.block ? newList(s).map((b) => '`' + b + '`').join(', ') : s.type === 'variable' ? '(no blocks) Make a Variable: Score, for all sprites' : '—';
  const cp = s.try ? `${s.try} ✓ ${s.done}` : s.checks ? s.checks.join(' · ') : s.done || '—';
  M.push(`| ${i + 1} · ${s.title} | ${s.demo || '—'} | ${s.sprite || (s.type === 'starter' ? 'Open starter' : '—')} | ${nb} | ${cp} |`);
});
fs.writeFileSync(path.join(OUT, 'KeenKids_Thanksgiving_Feast_Slide_Map.md'), M.join('\n') + '\n');

// ---------- QA REPORT ----------
const Q = ['# KeenKids Thanksgiving Feast: QA Report', '', `Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC by \`src/gen_docs.js\` from the build’s own test outputs.`, ''];
Q.push('## 1. File inventory', '', '| File | MB | sha1 (12) |', '|---|---|---|', ...Object.entries(CHK.files || {}).map(([f, v]) => `| \`output/${f}\` | ${v.MB} | \`${v.sha1}\` |`), '',
  'Plus `output/fonts/` (Literata + Figtree TTF, OFL licences), `qa/slides/slide-01…28.png` (1920×1080), `qa/KeenKids_Thanksgiving_Feast_Contact_Sheet.png`, `src/` (all build + test scripts), `assets/` (extracted starter art, engine screenshots).', '');
Q.push('## 2. Starter audit', '', `- Targets: **${SB3.starterTargets}**; code blocks: **${SB3.starterBlocks}**; variables: **${SB3.starterVariables}**. Matches the spec (Stage “Feast Kitchen”, Chef at (0, -130), Food “pumpkin” at (0, 180)).`,
  `- Starter sha1 \`${SB3.starterSha1}\`; unchanged after the build: **${SB3.starterUnchanged}**.`,
  '- All art in the deck is the starter’s own SVG costumes/backdrop rasterised (`assets/extracted/`), or real frames rendered by scratch-render from the built projects.', '');
const verLines = VER.trim().split('\n');
Q.push('## 3. Block fidelity (deterministic)', '', `\`src/verify_code.js\`: **${verLines[verLines.length - 1]}** (${verLines.filter((l) => l.startsWith('PASS')).length} checks).`, '',
  '- All slide code is rendered by **scratchblocks 3.7.1** (scratch3 style): true Scratch 3 shapes, category colours, round reporters, hexagon booleans, C-blocks, hats, dropdowns. Unknown/obsolete blocks: 0.',
  '- Every block on every slide (bright and faded) is mapped onto the final program with the same words, values, nesting and stack order. Each of the final program’s 30 blocks is introduced exactly once, on a slide of its own demo, in demo order 1→11. Faded context only shows blocks already taught.',
  '- New blocks per coding slide: ' + SLIDES.map((s, i) => (s.code || s.block ? `s${i + 1}:${newList(s).length}` : null)).filter(Boolean).join(' ') + ' (max 3).',
  '- Values checked: Chef, Food, Score, x 0 / y -130, mouse x, random 1–2 s, random x -200…200, y 180, y position < -170, change y by -8, touching Chef, change Score by 1, Score > 9, say “Feast Ready!” for 2 s, stop all, two `delete this clone` (in the catch-if after the win-if; after the loop).',
  '- Mutation test: planting `-160` on slide 19 and a wrongly highlighted `forever` on slide 9 made the verifier fail 6 checks; restoring the content returned ALL PASS.',
  '- `Completed_Teacher.sb3` decompiles to exactly the final scripts (Chef 1 script, Food 2 scripts, one “Score” variable for all sprites).', '',
  '<details><summary>Full verifier output</summary>', '', code(VER.trim()), '', '</details>', '');
const meta = LQA.meta.filter((m) => m.codePt);
Q.push('## 4. Slide readability', '', `- Automated layout QA (\`src/render_html.js\`, Chromium at 1920×1080 with the shipped fonts): **${LQA.qa.filter((q) => q.issues.length).length} slides with issues** out of ${LQA.qa.length}. Checks: text overflow (also at 95% width, slack for PowerPoint/Canva wrapping), off-slide text/images, stretched images (>2%), overlaps between titles, body text, code and screenshots, missing images. Fonts loaded: ${LQA.fontsOK.map(([f, ok]) => `${f} ${ok ? '✓' : '✗'}`).join(', ')}.`,
  `- Scratch label size of the main code picture on each coding slide (pt on a 13.33 in slide): min **${Math.min(...meta.map((m) => m.codePt)).toFixed(1)} pt**, max ${Math.max(...meta.map((m) => m.codePt)).toFixed(1)} pt. Headings 40–44 pt, explanations 26 pt, cards 21–25 pt.`,
  '', '| Slide | Layout | Code label pt | “Where it goes” map pt |', '|---|---|---|---|', ...meta.map((m) => `| ${m.slide} · ${m.title} | ${m.layout} | ${m.codePt.toFixed(1)} | ${m.mapPt ? m.mapPt.toFixed(1) : '—'} |`), '',
  '- Maps are small by design (an inset showing *where*, with the new block ringed in pumpkin orange). The block itself is always shown large in the main picture or the “NEW BLOCK” card.',
  '- Contact sheet: `qa/KeenKids_Thanksgiving_Feast_Contact_Sheet.png`. Every slide PNG was reviewed visually; densest slides (13, 20, 23, 24, 25, 26, 27) were reviewed at full 1920×1080.', '');
Q.push('## 5. Gameplay: what was genuinely tested', '', `Engine: ${GP.engine}. Each row ran the project **as it is after that demo** (built from the starter by \`src/build_sb3.js\`). Mouse movement was sent with \`vm.postIOData('mouse', …)\`. Result: **${GP.pass} PASS, ${GP.fail} FAIL**, plus observations.`, '',
  '| Demo | Test | Method | Status | Measured |', '|---|---|---|---|---|',
  ...GP.results.map((r) => `| ${r.demo} | ${r.test} | ${r.method} | ${r.status} | \`${JSON.stringify(r.measured).replace(/"id":"[^"]*",?/g, '').replace(/\|/g, '/').slice(0, 220)}\` |`), '',
  '**Inferred, not tested:** behaviour inside the real Scratch 3 / TurboWarp *editor GUI* (palette, drag-and-drop, sprite list), which the slides illustrate with a schematic plus the real stage. Mouse input came from the VM API, not a physical mouse. Classroom devices, tablets and touch input were not tested. Frame timing ran under software WebGL (`say for 2 seconds` measured 1.8–2.0 s of frames).', '');
Q.push('## 6. Output structure', '', code(JSON.stringify({ ...CHK, files: undefined }, null, 1)), '',
  '- The PDF is printed from the same positioned layout that generates the PPTX (one geometry → `render_html.js` and `build_pptx.js`), with Literata/Figtree embedded, so it is a faithful twin. PowerPoint is not installed on this Mac. A Keynote render of the .pptx was attempted (AppleScript open + export) but timed out before the document opened, most likely on a font or permission dialog. So **the .pptx itself was not visually rendered by an office app**; it was checked structurally (above)' + (CANVA && CANVA.status === 'imported' ? '; it **was** rendered by Canva’s importer (section 7).' : '.'), '');
Q.push('## 7. Canva', '');
if (CANVA) Q.push(...CANVA.lines, '');
else Q.push('Not imported. Use the PPTX: Canva › Create a design › Import file › choose the .pptx. Install the fonts in `output/fonts/` first if Canva substitutes them.', '');
Q.push('## 8. Known limitations', '',
  '- **Fonts:** the PPTX names Literata and Figtree. Machines without them substitute fonts, and line breaks may shift. Install `output/fonts/*.ttf` before presenting from PowerPoint/Keynote.',
  '- **Scratch blocks are pictures** (high-resolution PNG from scratchblocks) so they keep exact Scratch shapes in PowerPoint and Canva. All other text is editable.',
  '- **Editor illustrations** on slides 4 and 6 are schematics of the Scratch/TurboWarp editor built around the real stage and sprites, not screenshots of a specific editor version.',
  '- Demo 9/10 intermediate behaviour (many points per pumpkin; win on the first catch) is real and documented in notes; it is resolved by Demo 11 exactly as the prescribed step order intends.', '');
fs.writeFileSync(path.join(OUT, 'KeenKids_Thanksgiving_Feast_QA_Report.md'), Q.join('\n'));
console.log('docs written; cue total', tAcc, 'min');
