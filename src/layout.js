// Layout engine: content.js → positioned elements per slide (inches on a 13.333 × 7.5 canvas).
// One element list feeds BOTH build_pptx.js (editable PowerPoint) and render_html.js (PNG/PDF/QA), so they share geometry.
const fs = require('fs'), path = require('path');
const SLIDES = require('./content.js');
const ROOT = path.resolve(__dirname, '..');
const A = (f) => path.join(ROOT, 'assets', f);
const BLK = (f) => path.join(__dirname, 'blocks', f);

const W = 13.333, H = 7.5, MX = 0.6;
// KeenKids storybook tokens (keenkids-storybook-preview DESIGN.md) + a pumpkin accent taken from the starter's own pumpkin.
const C = {
  paper: 'F7F3E9', card: 'FFFCF5', parch: 'EFE9DA', rule: 'DDD7CB', ruleStrong: 'C9C1B1',
  ever: '254638', everDeep: '1B3429', everSoft: '3C5E4F', ink: '282C26', inkSoft: '4F554C', inkFaint: '6B7067',
  gold: 'D5A65D', goldSoft: 'E7C993', goldWash: 'F5E8CC', goldInk: '7A5A1E',
  pumpkin: 'C8641E', pumpkinInk: '9A4A14', pumpkinWash: 'F7E4D2', sage: 'D8DFD2', cream: 'FFFCF5', onCloth: 'D7E0D3',
};
const CAT = { Motion: '4C97FF', Looks: '9966FF', Events: 'FFBF00', Control: 'FFAB19', Sensing: '5CB1D6', Operators: '59C059', Variables: 'FF8C1A' };
const SERIF = 'Literata', SANS = 'Figtree';
const SPRITE_AR = { Chef: 70 / 90, Food: 1, pumpkin: 1 };
const spriteImg = (n) => (n === 'Chef' ? A('sprite_chef.png') : A('sprite_pumpkin.png'));
const DEMOS = 11;
const man = () => JSON.parse(fs.readFileSync(BLK('manifest.json'), 'utf8'));
const textW = (t, sz, k = 0.56) => (t.length * sz * k) / 72; // rough Figtree width estimate (inches); QA measures the real thing

function build() {
  const M = man();
  return SLIDES.map((s, i) => {
    const E = []; const meta = {};
    const n2 = String(i + 1).padStart(2, '0');
    const R = (x, y, w, h, fill, o = {}) => E.push({ k: 'rect', x, y, w, h, fill, ...o });
    const O = (x, y, w, h, fill, o = {}) => E.push({ k: 'ellipse', x, y, w, h, fill, ...o });
    const T = (x, y, w, h, runs, o = {}) => E.push({ k: 'text', x, y, w, h, runs: typeof runs === 'string' ? [{ t: runs }] : runs, ...o });
    const I = (x, y, w, h, src, o = {}) => E.push({ k: 'img', x, y, w, h, src, ...o });
    const L = (x, y, w, h, color, lw = 1) => E.push({ k: 'line', x, y, w, h, color, lw });
    const dark = ['cover', 'finish'].includes(s.type);
    const bg = dark ? 'cloth' : 'paper';

    // ---------- shared chrome ----------
    const pill = (x, y, text, fill, color, o = {}) => {
      const sz = o.sz || 14, h = o.h || 0.44;
      const w = o.w || textW(text, sz, 0.62) + 0.5 + (text.length * (o.cs || 1.5)) / 72;
      R(x, y, w, h, fill, { r: h / 2, line: o.line, lw: o.lw });
      T(x, y + (h - sz * 1.25 / 72) / 2, w, sz * 1.3 / 72, text, { sz, b: true, color, cs: o.cs ?? 1.5, align: 'center', ls: sz * 1.25, role: 'meta' });
      return x + w + 0.16;
    };
    const progress = (demo, usedX = 0) => {
      // "Demo 4 of 11" + 11 dots, top right
      const dx = 0.26, x0 = W - MX - DEMOS * dx + 0.06, y = 0.52;
      for (let d = 1; d <= DEMOS; d++) {
        const cur = d === demo, done = d < demo;
        const sz = cur ? 0.2 : 0.13;
        O(x0 + (d - 1) * dx + (0.2 - sz) / 2, y + (0.2 - sz) / 2, sz, sz, cur ? C.pumpkin : done ? C.ever : C.cream, { line: cur || done ? undefined : C.ruleStrong, lw: 1 });
      }
      if (usedX < x0 - 1.6) T(x0 - 2.05, y - 0.04, 1.9, 0.3, [{ t: 'Demo ' }, { t: String(demo), b: true }, { t: ' / 11' }], { sz: 15, color: C.inkSoft, align: 'right', ls: 18, role: 'meta' });
    };
    const footer = () => {
      const col = dark ? '9DB5A4' : C.inkFaint;
      T(MX, 7.08, 5, 0.25, [{ t: 'KeenKids', f: SERIF, b: true }, { t: '   Thanksgiving Feast · Grades 1–2' }], { sz: 11, color: col, ls: 14 });
      T(W - MX - 1.5, 7.08, 1.5, 0.25, `${i + 1} / ${SLIDES.length}`, { sz: 11, color: col, align: 'right', ls: 14 });
    };
    const topBand = () => { R(0, 0, W, 0.09, C.ever); R(0, 0.09, W, 0.025, C.gold); };
    const clickChip = (x, y, sprite, sw) => {
      // WHO to click: big, unmistakable
      const label = sprite === 'Variables' ? 'Variables' : sprite;
      const pre = sw ? 'Switch to ' : 'Click ';
      const sz = 20, h = 0.56;
      const w = textW(pre + label.toUpperCase(), sz, 0.6) + 1.05;
      R(x, y - 0.04, w, h, sw ? C.pumpkin : C.goldWash, { r: 0.12, line: sw ? C.pumpkinInk : C.gold, lw: 1.5 });
      if (sprite === 'Variables') O(x + 0.2, y + 0.08, 0.32, 0.32, CAT.Variables, { line: 'DB6E00', lw: 1 });
      else { O(x + 0.12, y + 0.0, 0.48, 0.48, C.cream, { line: sw ? C.cream : C.goldSoft, lw: 1 }); const ih = 0.38; I(x + 0.36 - ih * SPRITE_AR[sprite] / 2, y + 0.05, ih * SPRITE_AR[sprite], ih, spriteImg(sprite), { alt: sprite + ' sprite' }); }
      T(x + 0.72, y + 0.06, w - 0.8, 0.4, [{ t: pre }, { t: label.toUpperCase(), b: true }], { sz, color: sw ? C.cream : C.ink, ls: 24, role: 'meta' });
      return x + w + 0.18;
    };
    const header = (o) => {
      let x = MX;
      x = pill(x, 0.4, o.kicker, o.kfill || C.ever, o.kcolor || C.cream);
      if (o.sprite) x = clickChip(x, 0.4, o.sprite, o.switchSprite);
      if (o.cats) x = catRow(x + 0.08, 0.5, o.cats);
      if (o.demo) progress(o.demo, x);
    };
    const title = (x, y, w, text, sz = 40) => T(x, y, w, sz > 42 ? 0.8 : 0.68, text, { f: SERIF, sz, color: C.ink, ls: sz * 1.12, role: 'title' });
    const lines = (t, sz, w, k = 0.5) => Math.max(1, Math.ceil((t.length * sz * k) / 72 / w));
    const explain = (x, y, w, text, h = 0.55) => T(x, y, w, h, text, { sz: 26, color: C.ever, ls: 32, role: 'body' });
    const catRow = (x, y, cats, align = 'left', w = 4) => {
      // tiny Scratch category breadcrumb: ● Control ● Sensing
      const parts = cats.map((c) => ({ c, w: 0.26 + textW(c, 14, 0.55) + 0.2 }));
      let cx = align === 'right' ? x + w - parts.reduce((a, p) => a + p.w, 0) : x;
      for (const p of parts) { O(cx, y + 0.045, 0.2, 0.2, CAT[p.c], { line: 'FFFFFF', lw: 0.75 }); T(cx + 0.26, y + 0.01, p.w - 0.26, 0.3, p.c, { sz: 14, b: true, color: C.inkSoft, ls: 17, role: 'meta' }); cx += p.w; }
      return cx;
    };
    const card = (x, y, w, h, fill = C.card, o = {}) => R(x, y, w, h, fill, { line: o.line || C.rule, lw: o.lw || 1, r: 0.12 });
    const label = (x, y, w, text, color = C.inkFaint) => T(x, y, w, 0.28, text, { sz: 13, b: true, color, cs: 2, ls: 16 });
    const codeImg = (id, x, y, maxW, maxH, cap, o = {}) => {
      const bi = M[id]; const sc = Math.min(cap, (maxW * 96) / bi.w, (maxH * 96) / bi.h);
      const w = (bi.w * sc) / 96, h = (bi.h * sc) / 96;
      const ix = o.center ? x + (maxW - w) / 2 : x, iy = o.top ? y : y + (maxH - h) / 2;
      I(ix, iy, w, h, BLK(id + '.png'), { alt: 'Scratch blocks: ' + bi.code.replace(/\n/g, ' / '), role: o.role || 'code' });
      if (o.ring && bi.newBox) {
        const p = 0.07, b = bi.newBox;
        R(ix + (b.x0 * sc) / 96 - p, iy + (b.y0 * sc) / 96 - p, ((b.x1 - b.x0) * sc) / 96 + 2 * p, ((b.y1 - b.y0) * sc) / 96 + 2 * p, null, { line: C.pumpkin, lw: 3, r: 0.1, noFill: true });
      }
      return { sc, w, h, x: ix, y: iy, pt: 12 * sc };
    };
    const tryH = (w, tryText, done) => 0.78 + lines(tryText, 24, w - 0.55) * 0.41 + 0.2 + lines('✓  ' + done, 22, w - 0.55) * 0.375 + 0.22;
    const tryCard = (x, y, w, h, tryText, done) => {
      card(x, y, w, h, C.pumpkinWash, { line: 'EBC7A6' });
      I(x + 0.26, y + 0.22, 0.4, 0.4, A('icon_flag.png'), { alt: 'Green flag' });
      label(x + 0.74, y + 0.3, w - 1, 'TRY IT', C.pumpkinInk);
      let yy = y + 0.75;
      const th = lines(tryText, 24, w - 0.55) * 0.41;
      T(x + 0.28, yy, w - 0.5, th + 0.04, tryText, { sz: 24, b: true, color: C.ink, ls: 29, role: 'body' }); yy += th + 0.12;
      L(x + 0.28, yy, w - 0.56, 0, 'EBC7A6', 1);
      T(x + 0.28, yy + 0.1, w - 0.5, y + h - yy - 0.15, [{ t: '✓  ', b: true, c: C.ever }, { t: done }], { sz: 22, color: C.ever, ls: 27, role: 'body' });
    };
    const noteH = (w, text) => 0.62 + lines(text, 21, w - 0.55) * 0.35 + 0.2;
    const noteCard = (x, y, w, h, text, kind = 'TIP') => {
      card(x, y, w, h, C.goldWash, { line: 'E5D3AC' });
      label(x + 0.28, y + 0.2, w - 0.5, kind, C.goldInk);
      T(x + 0.28, y + 0.55, w - 0.5, h - 0.62, text, { sz: 21, b: true, color: C.ink, ls: 25, role: 'body' });
    };
    const tipBox = (x, y, w, text) => {
      R(x, y, w, 0.6, C.goldWash, { r: 0.3 });
      T(x + 0.28, y + 0.13, w - 0.5, 0.36, [{ t: 'Tip  ', b: true, c: C.goldInk }, { t: text, c: C.ink }], { sz: 20, ls: 24, role: 'body' });
    };
    const plate = (x, y, w, src, alt) => {
      // mounted storybook plate: paper mat + hairline + image (4:3 stage)
      const h = w * 0.75, m = 0.12;
      R(x - m, y - m, w + 2 * m, h + 2 * m, C.card, { line: C.rule, lw: 1, r: 0.06, shadow: true });
      I(x, y, w, h, src, { alt, role: 'shot' });
      R(x, y, w, h, null, { line: C.ruleStrong, lw: 0.75, noFill: true });
      return h;
    };
    const artDisc = (x, y, w, h, sprite) => {
      const d = Math.min(w, h) - 0.1; const cx = x + w / 2, cy = y + h / 2;
      O(cx - d / 2, cy - d / 2, d, d, C.parch, { line: C.rule, lw: 1 });
      const ih = d * 0.62, iw = ih * SPRITE_AR[sprite];
      I(cx - iw / 2, cy - ih / 2, iw, ih, spriteImg(sprite), { alt: sprite + ' sprite from the starter' });
    };
    const notesLines = [];

    // ======================= slide types =======================
    if (s.type === 'cover') {
      T(MX, 0.62, 7, 0.4, [{ t: 'KeenKids', f: SERIF, b: true, sz: 18, c: C.cream }, { t: '    SCRATCH CODING CLUB', sz: 12.5, b: true, c: C.gold, cs: 2 }], { ls: 22 });
      T(MX, 1.45, 6.4, 2.1, s.title, { f: SERIF, sz: 62, color: C.cream, ls: 68, role: 'title' });
      T(MX, 3.8, 6.2, 1.0, s.sub, { sz: 28, color: C.onCloth, ls: 34, role: 'body' });
      L(MX, 4.95, 1.1, 0, C.gold, 2.5);
      T(MX, 5.2, 6.4, 0.4, [{ t: 'Grades 1–2', b: true }, { t: '   ·   11 demos   ·   48 minutes' }], { sz: 18, color: C.goldSoft, ls: 22 });
      // arched plate with the real game (engine screenshot)
      R(7.25, 0.95, 5.5, 5.75, '2E5545', { r: 0.12 });
      I(7.45, 1.15, 5.1, 5.35, A('cover_arch.png'), { alt: 'The finished Thanksgiving Feast game: Chef catching a falling pumpkin, Score 4', role: 'shot' });
      T(7.25, 6.78, 5.5, 0.28, 'The real game you will build today', { sz: 13, i: true, color: '9DB5A4', align: 'center', ls: 16 });
    }
    else if (s.type === 'mission') {
      header({ kicker: "TODAY’S MISSION" });
      title(MX, 1.0, 8, s.title, 44);
      const rowY = [2.2, 3.72, 5.24];
      s.items.forEach(([icon, text], k) => {
        const y = rowY[k];
        card(MX, y, 6.8, 1.28);
        R(MX + 0.22, y + 0.2, 0.88, 0.88, C.parch, { r: 0.44 });
        if (icon === 'Chef') I(MX + 0.66 - 0.34 * 70 / 90, y + 0.3, 0.68 * 70 / 90, 0.68, A('sprite_chef.png'), { alt: 'Chef' });
        if (icon === 'pumpkin') I(MX + 0.36, y + 0.34, 0.6, 0.6, A('sprite_pumpkin.png'), { alt: 'Pumpkin' });
        if (icon === 'score') { R(MX + 0.27, y + 0.47, 0.78, 0.34, 'FF8C1A', { r: 0.08 }); T(MX + 0.27, y + 0.51, 0.78, 0.28, '10', { sz: 17, b: true, color: 'FFFFFF', align: 'center', ls: 20 }); }
        T(MX + 1.35, y + 0.38, 5.35, 0.55, text, { sz: 28, b: true, color: C.ink, ls: 33, role: 'body' });
      });
      plate(7.85, 2.32, 4.83, A('scene_midgame.png'), 'Thanksgiving Feast mid-game: Chef, a falling pumpkin, Score 4');
      T(7.6, 6.25, 5.2, 0.3, 'Chef · Food · Feast Kitchen', { sz: 14, i: true, color: C.inkFaint, align: 'center', ls: 17 });
    }
    else if (s.type === 'routine') {
      header({ kicker: 'HOW WE WORK' });
      title(MX, 1.0, 8, s.title, 44);
      const cw = 3.85, gap = 0.29;
      s.steps.forEach(([word, line], k) => {
        const x = MX + k * (cw + gap), y = 2.15;
        card(x, y, cw, 2.75);
        O(x + 0.32, y + 0.32, 0.8, 0.8, k === 2 ? C.pumpkin : C.ever);
        T(x + 0.32, y + 0.46, 0.8, 0.55, String(k + 1), { f: SERIF, sz: 30, b: true, color: C.cream, align: 'center', ls: 34 });
        if (k === 2) I(x + cw - 0.95, y + 0.36, 0.62, 0.62, A('icon_flag.png'), { alt: 'Green flag' });
        T(x + 0.32, y + 1.25, cw - 0.6, 0.66, word, { f: SERIF, sz: 40, color: C.ink, ls: 44, role: 'title2' });
        T(x + 0.32, y + 1.98, cw - 0.5, 0.5, line, { sz: 24, color: C.ever, ls: 30, role: 'body' });
        if (k < 2) T(x + cw - 0.02, y + 1.0, gap + 0.04, 0.62, '›', { f: SERIF, sz: 36, color: C.gold, align: 'center', ls: 42 });
      });
      // golden rule band
      R(MX, 5.25, W - 2 * MX, 1.55, C.ever, { r: 0.14 });
      T(MX + 0.45, 5.42, 5, 0.3, 'GOLDEN RULE', { sz: 13, b: true, color: C.gold, cs: 2, ls: 16 });
      T(MX + 0.45, 5.78, 7.2, 0.7, s.rule, { f: SERIF, sz: 34, color: C.cream, ls: 38, role: 'body' });
      [['Chef', 9.05], ['Food', 10.85]].forEach(([n, x]) => {
        R(x, 5.43, 1.55, 1.2, C.cream, { r: 0.1, line: n === 'Chef' ? '4C97FF' : C.rule, lw: n === 'Chef' ? 2.5 : 1 });
        const ih = 0.66; I(x + 0.775 - ih * SPRITE_AR[n] / 2, 5.52, ih * SPRITE_AR[n], ih, spriteImg(n), { alt: n });
        T(x, 6.22, 1.55, 0.3, n, { sz: 16, b: true, color: '575E75', align: 'center', ls: 19 });
      });
    }
    else if (s.type === 'starter') {
      header({ kicker: 'DEMO 1', demo: 1 });
      title(MX, 0.97, 8.6, s.title);
      explain(MX, 1.74, W - 2 * MX, s.explain);
      const iw = 7.5, ih = iw * 1160 / 2000;
      I(MX, 2.6, iw, ih, A('editor_starter.png'), { alt: 'The starter open in the editor: kitchen stage with Chef and pumpkin, sprites Chef and Food, empty code area', role: 'shot' });
      const x = MX + iw + 0.35, w = W - MX - x;
      const items = [['1', 'The kitchen stage'], ['2', 'Chef and Food'], ['3', 'No code yet!']];
      items.forEach(([nn, t], k) => {
        const y = 2.68 + k * 0.78;
        O(x, y, 0.5, 0.5, C.pumpkin);
        T(x, y + 0.08, 0.5, 0.34, nn, { sz: 20, b: true, color: C.cream, align: 'center', ls: 24 });
        T(x + 0.68, y + 0.04, w - 0.68, 0.45, t, { sz: 24, b: true, color: C.ink, ls: 28, role: 'body' });
      });
      card(x, 5.2, w, 1.5, C.sage, { line: 'C3CDBB' });
      label(x + 0.28, 5.36, w - 0.5, 'DONE WHEN', C.ever);
      T(x + 0.28, 5.68, w - 0.5, 0.95, s.done, { sz: 23, b: true, color: C.ever, ls: 28, role: 'body' });
    }
    else if (s.type === 'variable') {
      header({ kicker: 'DEMO 3', demo: 3, sprite: 'Variables' });
      title(MX, 0.97, 8.6, s.title);
      explain(MX, 1.74, W - 2 * MX, s.explain);
      const iw = 7.0, ih = iw * 1000 / 1500;
      I(MX, 2.55, iw, ih, A('variable_dialog.png'), { alt: 'Variables category, Make a Variable button, New Variable dialog with Score and For all sprites, Score monitor on the stage', role: 'shot' });
      const x = MX + iw + 0.45, w = W - MX - x;
      s.steps.forEach((t, k) => {
        const y = 2.6 + k * 0.72;
        O(x, y, 0.5, 0.5, C.pumpkin);
        T(x, y + 0.08, 0.5, 0.34, String(k + 1), { sz: 20, b: true, color: C.cream, align: 'center', ls: 24 });
        T(x + 0.68, y + 0.05, w - 0.68, 0.45, t, { sz: 24, b: true, color: C.ink, ls: 28, role: 'body' });
      });
      card(x, 5.5, w, 1.5, C.sage, { line: 'C3CDBB' });
      label(x + 0.28, 5.66, w - 0.5, 'DONE WHEN', C.ever);
      T(x + 0.28, 5.98, w - 0.5, 0.95, s.done, { sz: 22, b: true, color: C.ever, ls: 27, role: 'body' });
    }
    else if (s.type === 'code') {
      header({ kicker: `DEMO ${s.demo}`, demo: s.demo, sprite: s.sprite, switchSprite: s.switchSprite, cats: s.cats });
      title(MX, 0.97, W - 2 * MX, s.title);
      explain(MX, 1.74, W - 2 * MX, s.explain);
      const bi = M[`s${n2}_code`];
      const BY = 2.42, BH = 7.0 - BY, HD = 0.8;
      const sideW = 7.75, fullW = W - 2 * MX;
      const sx = MX + sideW + 0.28, sw = W - MX - sx;
      const sc = (w, h) => Math.min(2.7, (w * 96) / bi.w, (h * 96) / bi.h);
      const sSide = sc(sideW - 0.84, BH - HD - 0.25);
      const sWide = sc(fullW - 0.84, BH - HD - 0.25 - (s.tip || s.note ? 0.8 : 0));
      const wide = !s.map && !s.shot && !s.try && sWide > sSide * 1.25;
      const cw = wide ? fullW : sideW, ch = BH;
      card(MX, BY, cw, ch);
      T(MX + 0.35, BY + 0.22, cw - 0.7, 0.36, [{ t: 'PUT IT  ', b: true, c: C.inkFaint, sz: 13, cs: 2 }, { t: s.where, b: true, c: C.ever }], { sz: 20, ls: 24, role: 'meta' });
      const ghosted = bi.isNew.some((v) => !v);
      if (ghosted) {
        const lx = MX + cw - 3.0, ly = BY + ch - 0.42;
        R(lx, ly + 0.07, 0.34, 0.17, CAT.Control, { r: 0.05 }); T(lx + 0.42, ly, 0.7, 0.3, 'New', { sz: 14, b: true, color: C.inkSoft, ls: 17 });
        R(lx + 1.05, ly + 0.07, 0.34, 0.17, 'FFE3B3', { r: 0.05 }); T(lx + 1.47, ly, 1.6, 0.3, 'Already there', { sz: 14, color: C.inkFaint, ls: 17 });
      }
      L(MX + 0.35, BY + 0.72, cw - 0.7, 0, C.rule, 0.75);
      const inCardNote = wide && (s.tip || s.note);
      const ci = codeImg(`s${n2}_code`, MX + 0.42, BY + HD + 0.08, cw - 0.84, ch - HD - (ghosted ? 0.45 : 0.25) - (inCardNote ? 0.8 : 0), 2.7);
      meta.codePt = ci.pt; meta.layout = wide ? 'wide' : 'side';
      if (inCardNote) tipBox(MX + 0.35, BY + ch - 0.76, Math.min(cw - 0.7, textW(s.tip || s.note, 20, 0.5) + 1.3), s.tip || s.note);
      if (!wide) {
        // side column stack: [map | shot | art] + [tip/note] + [try]
        const gap = 0.2;
        const tH = s.try ? tryH(sw, s.try, s.done) : 0;
        const nText = s.tip || s.note;
        const nH = nText ? noteH(sw, nText) : 0;
        let yb = BY + BH;
        if (s.try) { tryCard(sx, yb - tH, sw, tH, s.try, s.done); yb -= tH + gap; }
        if (nText) { noteCard(sx, yb - nH, sw, nH, nText, s.tip ? 'TIP' : 'NOTE'); yb -= nH + gap; }
        const topH = yb + gap - BY - gap;
        if (s.map) {
          card(sx, BY, sw, topH);
          label(sx + 0.25, BY + 0.2, sw - 0.4, 'WHERE IT GOES');
          const mi = codeImg(`s${n2}_map`, sx + 0.25, BY + 0.55, sw - 0.5, topH - 0.72, 1.2, { center: true, ring: true, role: 'map' });
          meta.mapPt = mi.pt;
        } else if (s.shot) {
          const pw = Math.min(sw - 0.24, (topH - 0.55) / 0.75); const ph = pw * 0.75;
          const px = sx + (sw - pw) / 2;
          plate(px, BY + 0.12, pw, A(`scene_${s.shot}.png`), 'What you should see: real game screenshot');
          T(sx, BY + ph + 0.3, sw, 0.28, 'What you should see', { sz: 14, i: true, color: C.inkFaint, align: 'center', ls: 17 });
        } else if (topH > 1.3) {
          artDisc(sx, BY, sw, Math.min(topH, 3.0), s.sprite);
        }
      }
    }
    else if (s.type === 'place') {
      header({ kicker: `DEMO ${s.demo}`, demo: s.demo, sprite: s.sprite, cats: s.cats });
      const mx = MX, my = 1.08, mw = 7.0, mh = 7.0 - my;
      card(mx, my, mw, mh);
      label(mx + 0.3, my + 0.22, mw - 0.6, 'WHERE IT GOES');
      T(mx + 0.3, my + 0.5, mw - 0.6, 0.72, s.where, { sz: 21, b: true, color: C.ever, ls: 25, role: 'meta' });
      L(mx + 0.3, my + 1.28, mw - 0.6, 0, C.rule, 0.75);
      const mi = codeImg(`s${n2}_map`, mx + 0.35, my + 1.42, mw - 0.7, mh - 1.58, 1.6, { center: true, ring: true, role: 'map' });
      meta.mapPt = mi.pt;
      const x = mx + mw + 0.4, w = W - MX - x;
      title(x, 1.0, w, s.title, 40);
      explain(x, 1.8, w, s.explain, 1.0);
      card(x, 3.0, w, 2.25);
      label(x + 0.28, 3.18, w - 0.5, 'NEW BLOCK');
      const ci = codeImg(`s${n2}_block`, x + 0.3, 3.62, w - 0.6, 1.4, 2.6);
      meta.codePt = ci.pt; meta.layout = 'place';
      R(x, 5.48, w, 1.52, C.pumpkinWash, { r: 0.12, line: 'EBC7A6' });
      T(x + 0.3, 5.64, w - 0.55, 0.3, 'CAREFUL', { sz: 13, b: true, color: C.pumpkinInk, cs: 2, ls: 16 });
      T(x + 0.3, 5.98, w - 0.55, 0.9, s.tip, { sz: 24, b: true, color: C.ink, ls: 29, role: 'body' });
    }
    else if (s.type === 'check') {
      header({ kicker: s.final ? 'FINAL CHECK' : 'CHECKPOINT', kfill: C.pumpkin, demo: s.demo });
      title(MX, 0.95, 7, s.title, 42);
      const pw = 5.95;
      const ph = plate(MX + 0.12, 1.98, pw, A(`scene_${s.shot}.png`), 'Real game screenshot: what students should see');
      T(MX, 1.98 + ph + 0.2, pw + 0.24, 0.3, 'What you should see', { sz: 14, i: true, color: C.inkFaint, align: 'center', ls: 17 });
      const x = MX + pw + 0.7, w = W - MX - x;
      I(x, 1.9, 0.42, 0.42, A('icon_flag.png'), { alt: 'Green flag' });
      label(x + 0.55, 1.99, 3, 'TRY IT', C.pumpkinInk);
      const sz = 25; let y = 2.55;
      s.checks.forEach((t) => {
        const nl = lines(t, sz, w - 0.6, 0.44);
        R(x, y + 0.06, 0.38, 0.38, 'FFFFFF', { line: C.ever, lw: 1.75, r: 0.07 });
        T(x + 0.6, y, w - 0.6, nl * 0.42 + 0.04, t, { sz, b: true, color: C.ink, ls: 30, role: 'body' });
        y += nl * 0.42 + 0.3;
      });
      const fh = 0.42 + lines('Stuck?  ' + s.fix, 20, w - 0.5, 0.5) * 0.34;
      const fy = 6.28 - fh;
      R(x, fy, w, fh, C.goldWash, { r: 0.14 });
      T(x + 0.28, fy + 0.2, w - 0.45, fh - 0.25, [{ t: 'Stuck?  ', b: true, c: C.goldInk }, { t: s.fix, c: C.ink }], { sz: 20, ls: 24, role: 'body' });
      T(x, 6.48, w, 0.4, 'Thumbs up when it works!', { sz: 21, b: true, color: C.ever, ls: 26, role: 'body' });
      meta.checksBottom = y;
    }
    else if (s.type === 'finish') {
      T(MX, 0.62, 7, 0.4, [{ t: 'KeenKids', f: SERIF, b: true, sz: 18, c: C.cream }, { t: '    SCRATCH CODING CLUB', sz: 12.5, b: true, c: C.gold, cs: 2 }], { ls: 22 });
      T(MX, 1.6, 6, 0.35, 'YOU DID IT!', { sz: 17, b: true, color: C.gold, cs: 3, ls: 20 });
      T(MX, 2.05, 6.9, 1.0, s.title, { f: SERIF, sz: 58, color: C.cream, ls: 64, role: 'title' });
      T(MX, 3.12, 6.8, 0.6, s.sub, { sz: 28, color: C.onCloth, ls: 34, role: 'body' });
      s.items.forEach((t, k) => {
        const y = 4.1 + k * 0.86;
        R(MX, y, 6.5, 0.7, '2E5545', { r: 0.1 });
        T(MX + 0.25, y + 0.13, 0.5, 0.45, String(k + 1), { f: SERIF, sz: 24, b: true, color: C.gold, ls: 28 });
        T(MX + 0.75, y + 0.15, 5.6, 0.42, t, { sz: 23, color: C.cream, b: true, ls: 27, role: 'body' });
      });
      R(7.55, 1.05, 5.2, 5.55, '2E5545', { r: 0.12 });
      I(7.7, 1.25, 4.9, 5.14, A('finish_arch.png'), { alt: 'Feast Ready! speech bubble on the pumpkin above Chef', role: 'shot' });
    }
    footer();
    if (s.type !== 'cover' && s.type !== 'finish' && !['mission', 'routine'].includes(s.type)) topBand();
    if (['mission', 'routine'].includes(s.type)) topBand();
    return { i, s, bg, E, meta };
  });
}

module.exports = { build, W, H, C, SLIDES };
