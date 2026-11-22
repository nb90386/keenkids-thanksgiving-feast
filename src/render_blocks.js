// Renders every slide's Scratch 3 blocks with scratchblocks (official renderer, scratch3 style) in headless Chromium.
// Blocks listed as NEW stay full colour; all other blocks are faded (already in the project). Output: blocks/<id>.png
// (transparent, 5× density), blocks/<id>.svg, blocks/manifest.json with size, signatures, new-block matches, unknown-block count.
const fs = require('fs'), path = require('path');
const { launch } = require('./browser.js');
const SLIDES = require('./content.js');
const OUT = path.join(__dirname, 'blocks');
const DPR = 5, GHOST = 0.58;

const items = [];
SLIDES.forEach((s, i) => {
  const n = String(i + 1).padStart(2, '0');
  if (s.code) items.push({ id: `s${n}_code`, code: s.code, newBlocks: s.newBlocks });
  if (s.map) items.push({ id: `s${n}_map`, code: s.map, newBlocks: s.mapNew });
  if (s.block) items.push({ id: `s${n}_block`, code: s.block, newBlocks: [s.block] });
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch();
  const page = await b.newPage({ deviceScaleFactor: DPR, viewport: { width: 1400, height: 1400 } });
  await page.setContent('<!doctype html><html><body style="margin:0;background:transparent"><div id="host"></div></body></html>');
  await page.addScriptTag({ path: require.resolve('scratchblocks/build/scratchblocks.min.js') });
  const manifest = {}; let problems = 0;
  for (const it of items) {
    const info = await page.evaluate(({ code, newBlocks, GHOST }) => {
      const host = document.getElementById('host'); host.innerHTML = '';
      const doc = scratchblocks.parse(code, { languages: ['en'] });
      const svg = scratchblocks.newView(doc, { style: 'scratch3', scale: 1 }).render();
      svg.id = 'out'; host.appendChild(svg);
      const CAT = /sb3-(motion|looks|sound|events|control|sensing|operators|variables|list|custom|extension|obsolete|grey|pen)\b/;
      const isShape = (el) => el && (el.tagName === 'path' || el.tagName === 'rect') && CAT.test(el.getAttribute('class') || '') && !/sb3-input/.test(el.getAttribute('class') || '');
      const isBlock = (g) => g && g.tagName === 'g' && isShape(g.firstElementChild);
      const isInput = (g) => g && g.tagName === 'g' && /sb3-input/.test((g.firstElementChild && g.firstElementChild.getAttribute('class')) || '');
      const isScript = (g) => g && g.tagName === 'g' && isBlock(g.firstElementChild);
      const blocks = [];
      (function walk(el) { for (const c of el.children) { if (isBlock(c)) blocks.push(c); walk(c); } })(svg);
      const sig = (g) => {
        const t = [];
        for (const c of g.children) {
          if (c.tagName === 'text') t.push(c.textContent);
          else if (isInput(c)) c.querySelectorAll('text').forEach((x) => t.push(x.textContent));
        }
        return t.join(' ').replace(/\s+/g, ' ').trim();
      };
      const sigs = blocks.map(sig);
      const cats = blocks.map((g) => (g.firstElementChild.getAttribute('class').match(CAT) || [])[1]);
      // resolve NEW list: 'sig' = every match, 'sig@k' = k-th match
      const isNew = new Array(blocks.length).fill(false); const unmatched = [];
      for (const spec of newBlocks) {
        const [want, k] = spec.split('@');
        const hits = sigs.map((s, i) => (s === want ? i : -1)).filter((i) => i >= 0);
        if (!hits.length) { unmatched.push(spec); continue; }
        if (k) { if (hits[+k - 1] === undefined) unmatched.push(spec); else isNew[hits[+k - 1]] = true; }
        else hits.forEach((i) => (isNew[i] = true));
      }
      // Faded = opaque colours blended toward the card colour (no see-through layering), labels in a dark tint of the
      // block's own category colour so the context stays readable.
      const BG = [255, 252, 245];
      const rgb = (s) => { const m = (s || '').match(/\d+(\.\d+)?/g); return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null; };
      const mix = (c, t, a) => `rgb(${c.map((v, k) => Math.round(v * (1 - a) + t[k] * a)).join(',')})`;
      const fadeEl = (el, cat) => {
        const cs = getComputedStyle(el);
        if (el.tagName === 'text') {
          const f = rgb(cs.fill);
          const white = f && f.every((v) => v > 240);
          el.style.fill = white ? mix(cat, [30, 30, 30], 0.42) : mix(f || [87, 94, 117], BG, 0.35);
          return;
        }
        if (el.tagName === 'use' || el.tagName === 'image') { el.setAttribute('opacity', '0.5'); return; }
        const f = rgb(cs.fill), s = rgb(cs.stroke);
        if (f && cs.fill !== 'none') el.style.fill = mix(f, BG, GHOST);
        if (s && cs.stroke !== 'none') el.style.stroke = mix(s, BG, GHOST);
        for (const c of el.children) fadeEl(c, cat);
      };
      blocks.forEach((g, i) => {
        g.setAttribute('data-new', isNew[i] ? '1' : '0');
        if (isNew[i]) return;
        const cat = rgb(getComputedStyle(g.firstElementChild).fill) || [128, 128, 128];
        for (const c of g.children) if (!isBlock(c) && !isScript(c)) fadeEl(c, cat);
      });
      // union box of the NEW blocks' own shapes (svg px) so the layout can ring them on small maps
      const sr = svg.getBoundingClientRect(); let nb = null;
      blocks.forEach((g, i) => { if (!isNew[i]) return; const r = g.firstElementChild.getBoundingClientRect();
        const bx = { x0: r.left - sr.left, y0: r.top - sr.top, x1: r.right - sr.left, y1: r.bottom - sr.top };
        nb = nb ? { x0: Math.min(nb.x0, bx.x0), y0: Math.min(nb.y0, bx.y0), x1: Math.max(nb.x1, bx.x1), y1: Math.max(nb.y1, bx.y1) } : bx; });
      // structure for verification: parent block, the script (stack) a block sits in, and its position in that stack
      const scriptIds = new Map(); let sid = 0;
      const struct = blocks.map((g) => {
        let p = g.parentElement, parent = -1;
        while (p && p !== svg) { const k = blocks.indexOf(p); if (k >= 0) { parent = k; break; } p = p.parentElement; }
        const cont = g.parentElement && isScript(g.parentElement) ? g.parentElement : null;
        if (cont && !scriptIds.has(cont)) scriptIds.set(cont, sid++);
        return { parent, stack: cont ? scriptIds.get(cont) : null, pos: cont ? [...cont.children].filter(isBlock).indexOf(g) : null };
      });
      const bad = svg.querySelectorAll('.sb3-obsolete, .sb3-extension').length;
      return { w: parseFloat(svg.getAttribute('width')), h: parseFloat(svg.getAttribute('height')), sigs, cats, isNew, unmatched, bad,
        newCount: isNew.filter(Boolean).length, newBox: nb, struct, ser: new XMLSerializer().serializeToString(svg) };
    }, { code: it.code, newBlocks: it.newBlocks, GHOST });
    fs.writeFileSync(path.join(OUT, it.id + '.svg'), info.ser);
    await (await page.$('#out')).screenshot({ path: path.join(OUT, it.id + '.png'), omitBackground: true });
    const { ser, ...rest } = info;
    manifest[it.id] = { code: it.code, newSpec: it.newBlocks, ...rest };
    const flag = info.unmatched.length || info.bad || info.newCount !== it.newBlocks.length;
    if (flag) problems++;
    console.log(flag ? '!!' : 'ok', it.id.padEnd(10), `${info.w}x${info.h}`, 'new', info.newCount, info.unmatched.length ? 'UNMATCHED ' + info.unmatched : '', info.bad ? 'BAD ' + info.bad : '', '|', info.sigs.map((s, i) => (info.isNew[i] ? `*${s}*` : s) + `{${info.cats[i]}}`).join(' · '));
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
  await b.close();
  console.log('rendered', items.length, 'problems', problems);
  if (problems) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });
