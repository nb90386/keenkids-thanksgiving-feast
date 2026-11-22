// Verifies the deck's Scratch code against the single source of truth (scripts.js) and the built .sb3:
//  1. Renders the FINAL scripts with scratchblocks and aligns every rendered block with its DSL node (demo tag).
//  2. For every coding slide (focus picture, map, new-block card): maps each rendered block onto the final program
//     (same words/values, same nesting, same stack order) and checks NEW blocks are introduced exactly once,
//     in the slide's own demo, and FADED blocks were already taught on an earlier slide.
//  3. Checks 1–3 new blocks per coding slide and that the deck teaches every block of the final game.
//  4. Re-checks the Completed Teacher .sb3 decompiles to exactly the final scripts.
const fs = require('fs'), path = require('path');
const JSZip = require('jszip');
const { launch } = require('./browser.js');
const SLIDES = require('./content.js');
const { FINAL, sbText, decompile } = require('./scripts.js');
const MAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'blocks', 'manifest.json'), 'utf8'));
const out = []; let fails = 0;
const check = (ok, msg) => { out.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fails++; };

function dslPreorder(stack, acc = []) {
  const visit = (b) => {
    if (!b || b.lit !== undefined) return;
    acc.push(b);
    for (const v of Object.values(b.in)) visit(v);
    if (b.sub) b.sub.forEach(visit);
  };
  stack.forEach(visit); return acc;
}

(async () => {
  // ---- 1. canonical render ----
  const b = await launch();
  const page = await b.newPage();
  await page.setContent('<div id="h"></div>');
  await page.addScriptTag({ path: require.resolve('scratchblocks/build/scratchblocks.min.js') });
  const canon = {};
  for (const sprite of ['Chef', 'Food']) {
    canon[sprite] = [];
    for (const [si, script] of FINAL[sprite].entries()) {
      const r = await page.evaluate((code) => {
        const h = document.getElementById('h'); h.innerHTML = '';
        const svg = scratchblocks.newView(scratchblocks.parse(code, { languages: ['en'] }), { style: 'scratch3', scale: 1 }).render(); h.appendChild(svg);
        const CAT = /sb3-(motion|looks|sound|events|control|sensing|operators|variables|list|custom|extension|obsolete|grey|pen)\b/;
        const isShape = (el) => el && (el.tagName === 'path' || el.tagName === 'rect') && CAT.test(el.getAttribute('class') || '') && !/sb3-input/.test(el.getAttribute('class') || '');
        const isBlock = (g) => g && g.tagName === 'g' && isShape(g.firstElementChild);
        const isInput = (g) => g && g.tagName === 'g' && /sb3-input/.test((g.firstElementChild && g.firstElementChild.getAttribute('class')) || '');
        const isScript = (g) => g && g.tagName === 'g' && isBlock(g.firstElementChild);
        const blocks = []; (function walk(el) { for (const c of el.children) { if (isBlock(c)) blocks.push(c); walk(c); } })(svg);
        const sig = (g) => { const t = []; for (const c of g.children) { if (c.tagName === 'text') t.push(c.textContent); else if (isInput(c)) c.querySelectorAll('text').forEach((x) => t.push(x.textContent)); } return t.join(' ').replace(/\s+/g, ' ').trim(); };
        const ids = new Map(); let sid = 0;
        const struct = blocks.map((g) => { let p = g.parentElement, parent = -1; while (p && p !== svg) { const k = blocks.indexOf(p); if (k >= 0) { parent = k; break; } p = p.parentElement; }
          const cont = g.parentElement && isScript(g.parentElement) ? g.parentElement : null; if (cont && !ids.has(cont)) ids.set(cont, sid++);
          return { parent, stack: cont ? ids.get(cont) : null, pos: cont ? [...cont.children].filter(isBlock).indexOf(g) : null }; });
        return { sigs: blocks.map(sig), struct, bad: svg.querySelectorAll('.sb3-obsolete, .sb3-extension').length };
      }, sbText(script));
      const dsl = dslPreorder(script);
      check(r.sigs.length === dsl.length && r.bad === 0, `canonical ${sprite} script ${si + 1}: ${r.sigs.length} rendered blocks = ${dsl.length} DSL blocks, ${r.bad} unknown blocks`);
      const base = canon[sprite].length;
      r.sigs.forEach((s, k) => canon[sprite].push({ sig: s, d: dsl[k].d, op: dsl[k].op, script: si,
        parent: r.struct[k].parent >= 0 ? base + r.struct[k].parent : -1, stack: r.struct[k].stack === null ? null : `${si}:${r.struct[k].stack}`, pos: r.struct[k].pos }));
    }
  }
  await b.close();
  const total = canon.Chef.length + canon.Food.length;

  // ---- 2. slides ----
  const taught = { Chef: new Set(), Food: new Set() };
  // A snippet block matches a final block when the words/values agree. One allowance: a slot may still show its default
  // literal (e.g. “wait 1 seconds”) when the reporter that goes in it has not been taught yet (it arrives later in the demo).
  const sigMatch = (snipSig, c, C, sprite) => {
    if (C[c].sig === snipSig) return true;
    const kids = C.map((x, k) => (x.parent === c && x.stack === null ? k : -1)).filter((k) => k >= 0 && !taught[sprite].has(k));
    if (!kids.length) return false;
    const a = snipSig.split(' '), b = C[c].sig.split(' ');
    let j = 0; const extra = [];
    for (const tok of a) { if (j < b.length && tok === b[j]) j++; else extra.push(tok); }
    return j === b.length && extra.length === kids.length && extra.every((t) => /^-?\d+(\.\d+)?$/.test(t));
  };
  const mapSnippet = (id, sprite) => {
    const m = MAN[id], C = canon[sprite];
    const ok = (map) => {
      for (let k = 0; k < m.sigs.length; k++) for (let j = 0; j < m.sigs.length; j++) {
        const a = m.struct[k], bb = m.struct[j];
        if (a.stack !== null && a.stack === bb.stack && bb.pos === a.pos + 1) {
          const A = C[map[k]], B = C[map[j]];
          if (A.stack !== B.stack || B.pos !== A.pos + 1) return false;
        }
      }
      return true;
    };
    // backtracking: ordered, parent-consistent, stack-adjacent assignment
    const search = (k, from, map) => {
      if (k === m.sigs.length) return ok(map) ? map.slice() : null;
      for (let c = from; c < C.length; c++) {
        if (!sigMatch(m.sigs[k], c, C, sprite)) continue;
        const sp = m.struct[k].parent;
        if (sp >= 0 && C[c].parent !== map[sp]) continue;
        if (sp < 0 && k > 0 && m.struct[k].stack === null) continue;
        map.push(c); const r = search(k + 1, c + 1, map); map.pop();
        if (r) return r;
      }
      return null;
    };
    const map = search(0, 0, []);
    return map ? { map } : { error: `no consistent placement of [${m.sigs.join(' | ')}] in the final ${sprite} code` };
  };
  SLIDES.forEach((s, i) => {
    const n2 = String(i + 1).padStart(2, '0');
    if (!(s.type === 'code' || s.type === 'place')) return;
    const sprite = s.sprite; const C = canon[sprite];
    const ids = [s.code && `s${n2}_code`, s.map && `s${n2}_map`].filter(Boolean);
    let introduced = null;
    for (const id of ids) {
      const r = mapSnippet(id, sprite);
      if (r.error) { check(false, `slide ${i + 1} ${id}: ${r.error}`); continue; }
      const m = MAN[id];
      const newIdx = r.map.filter((_, k) => m.isNew[k]); const oldIdx = r.map.filter((_, k) => !m.isNew[k]);
      const newOK = newIdx.every((c) => C[c].d === s.demo && !taught[sprite].has(c));
      const oldOK = oldIdx.every((c) => taught[sprite].has(c));
      check(newOK, `slide ${i + 1} ${id}: NEW blocks [${newIdx.map((c) => C[c].sig).join(' | ')}] belong to Demo ${s.demo} and are taught here for the first time`);
      check(oldOK, `slide ${i + 1} ${id}: faded context [${oldIdx.map((c) => C[c].sig).join(' | ') || '—'}] was already taught`);
      check(m.unmatched.length === 0 && m.bad === 0, `slide ${i + 1} ${id}: all blocks are real Scratch 3 blocks (unknown: ${m.bad})`);
      const key = newIdx.slice().sort().join(',');
      if (introduced === null) introduced = key; else check(introduced === key, `slide ${i + 1}: focus picture and map highlight the same new blocks`);
      if (id === ids[ids.length - 1]) newIdx.forEach((c) => taught[sprite].add(c));
    }
    if (s.type === 'place') check(MAN[`s${n2}_block`].sigs[0] === s.block, `slide ${i + 1}: new-block card shows “${s.block}”`);
    const nNew = s.type === 'place' ? 1 : MAN[`s${n2}_code`].newCount;
    check(nNew >= 1 && nNew <= 3, `slide ${i + 1} (Demo ${s.demo}, ${sprite}): ${nNew} new block(s) — limit 1–3`);
  });
  // order of demos
  const demos = SLIDES.filter((s) => s.demo).map((s) => s.demo);
  check(demos.every((d, k) => k === 0 || d >= demos[k - 1]) && new Set(demos).size === 11, `demos appear in order 1→11 (${[...new Set(demos)].join(',')})`);
  const taughtN = taught.Chef.size + taught.Food.size;
  check(taughtN === total, `deck teaches every block of the final game: ${taughtN} / ${total}`);
  const missing = [...['Chef', 'Food']].flatMap((sp) => canon[sp].map((c, k) => (!taught[sp].has(k) ? `${sp}:${c.sig}` : null)).filter(Boolean));
  if (missing.length) out.push('  missing: ' + missing.join(' | '));

  // ---- 4. teacher sb3 ----
  const zip = await JSZip.loadAsync(fs.readFileSync(path.resolve(__dirname, '../output/KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3')));
  const pj = JSON.parse(await zip.file('project.json').async('string'));
  const dec = decompile(pj);
  for (const sp of ['Chef', 'Food']) check(JSON.stringify(dec[sp]) === JSON.stringify(FINAL[sp].map(sbText)), `Completed_Teacher.sb3 ${sp} code decompiles to exactly the final scripts`);
  check(pj.targets.map((t) => t.name).join() === 'Stage,Chef,Food' && Object.values(pj.targets[0].variables).map((v) => v[0]).join() === 'Score', 'Completed_Teacher.sb3: Stage/Chef/Food, one stage variable “Score” (for all sprites)');

  fs.mkdirSync(path.join(__dirname, 'render'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'render', 'code_verification.txt'), out.join('\n') + `\n\n${fails ? fails + ' FAIL' : 'ALL PASS'}\n`);
  console.log(out.join('\n')); console.log(fails ? `${fails} FAIL` : 'ALL PASS');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
