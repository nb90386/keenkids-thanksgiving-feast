// Gameplay tests: runs the state after each demo in real scratch-vm + scratch-render (30 fps, like the Scratch editor).
// Writes results.json and real stage screenshots (shots/*.png) used on the slides.
const fs = require('fs'), path = require('path');
const { setup } = require('./harness.js');
const S = (n) => path.join(__dirname, 'stages', `after_demo${String(n).padStart(2, '0')}.sb3`);

const results = [];
const rec = (demo, test, method, measured, pass) => { results.push({ demo, test, method, measured, status: pass === null ? 'OBSERVED' : pass ? 'PASS' : 'FAIL' }); console.log(pass === null ? 'OBS ' : pass ? 'PASS' : 'FAIL', `D${demo}`, test, '|', JSON.stringify(measured)); };

(async () => {
  const h = await setup();
  const ev = (p, fn, arg) => p.evaluate(fn, arg);

  // ---- Demo 1: starter as-is ----
  {
    const p = await h.open(path.resolve(__dirname, '../../Thanksgiving_Feast! (1).sb3'));
    const r = await ev(p, async () => { H.startNoFlag(); await H.frames(5); const c = H.info(H.T('Chef')), f = H.info(H.T('Food')); H.vm.greenFlag(); await H.frames(30); return { names: H.rt.targets.map(t => t.getName()), chef: c, food: f, threadsAfterFlag: H.rt.threads.length, chefAfter: H.info(H.T('Chef')) }; });
    rec(1, 'Starter shows Chef, pumpkin, kitchen; no code runs', 'Load starter, read sprites, click flag', r, r.names.join() === 'Stage,Chef,Food' && r.chef.visible && r.food.visible && r.chef.x === 0 && r.chef.y === -130 && r.food.y === 180 && r.threadsAfterFlag === 0);
    await h.shot(p, 'starter', { score: null });
    await h.closeAll();
  }
  // ---- Demo 2: Chef go to ----
  {
    const p = await h.open(S(2));
    const r = await ev(p, async () => { H.startNoFlag(); H.T('Chef').setXY(150, 60); await H.frames(2); const before = H.info(H.T('Chef')); H.vm.greenFlag(); await H.frames(3); const a = H.info(H.T('Chef')); H.T('Chef').setXY(-90, 20); H.vm.greenFlag(); await H.frames(3); return { before, after1: a, after2: H.info(H.T('Chef')) }; });
    rec(2, 'Every flag click returns Chef to (0, -130)', 'Move Chef away, click flag (twice)', r, r.after1.x === 0 && r.after1.y === -130 && r.after2.x === 0 && r.after2.y === -130);
    await h.closeAll();
  }
  // ---- Demo 3: Score reset ----
  {
    const p = await h.open(S(3));
    const r = await ev(p, async () => { H.startNoFlag(); H.setScore(7); await H.frames(1); const before = H.score(); H.vm.greenFlag(); await H.frames(3); return { before, after: H.score(), monitor: H.rt._monitorState ? [...H.rt._monitorState.values()].map(m => ({ opcode: m.opcode, visible: m.visible, value: m.value })) : null }; });
    rec(3, 'Score monitor reads 0 on flag', 'Set Score to 7, click flag', r, r.after === 0 || r.after === '0');
    await h.closeAll();
  }
  // ---- Demo 4: follow mouse x only ----
  {
    const p = await h.open(S(4));
    const r = await ev(p, async () => {
      H.start(); await H.frames(3);
      const pts = [];
      for (const [mx, my] of [[150, 100], [-180, -40], [60, 170], [-20, -170]]) { H.mouse(mx, my); await H.frames(3); const c = H.info(H.T('Chef')); pts.push({ mouseX: mx, mouseY: my, chefX: c.x, chefY: c.y }); }
      return { pts, score: H.score() };
    });
    rec(4, 'Chef follows mouse left/right, stays at y -130', 'Post mouse moves at 4 points (incl. top and bottom)', r, r.pts.every(q => q.chefX === q.mouseX && q.chefY === -130));
    await ev(p, async () => { H.mouse(120, 0); await H.frames(3); });
    await h.shot(p, 'chef_follow', { score: 0 });
    await h.closeAll();
  }
  // ---- Demo 5: spawner hides ----
  {
    const p = await h.open(S(5));
    const r = await ev(p, async () => { H.start(); await H.frames(60); return { food: H.info(H.T('Food')), clones: H.clones().length }; });
    rec(5, 'Original pumpkin hides on flag; no copies yet', 'Flag, wait 2 s', r, r.food.visible === false && r.clones === 0);
    await h.closeAll();
  }
  // ---- Demo 6: hidden clones every 1–2 s ----
  {
    const p = await h.open(S(6));
    const r = await ev(p, async () => {
      H.start(); const born = [];
      let last = 0; H.onFrame.push((f, ph) => { if (ph === 'post') { const n = H.clones().length; if (n > last) born.push(f); last = n; } });
      await H.frames(300);
      const cl = H.clones();
      const gaps = born.slice(1).map((f, i) => f - born[i]);
      return { clonesAfter10s: cl.length, visibleClones: cl.filter(c => c.visible).length, gapsFrames: gaps, minGapS: Math.min(...gaps) / 30, maxGapS: Math.max(...gaps) / 30 };
    });
    rec(6, 'Spawner keeps making copies every 1–2 s, and they stay hidden', 'Flag, watch 10 s (300 frames)', r, r.clonesAfter10s >= 5 && r.visibleClones === 0 && r.minGapS >= 0.95 && r.maxGapS <= 2.15);
    await h.closeAll();
  }
  // ---- Demo 7: visible clones at top, random x ----
  {
    const p = await h.open(S(7));
    const r = await ev(p, async () => { H.start(); await H.frames(240); const cl = H.clones().map(c => H.info(c)); await H.frames(30); const later = H.clones().map(c => H.info(c)); return { n: cl.length, xs: cl.map(c => c.x), ys: [...new Set(cl.map(c => c.y))], allVisible: cl.every(c => c.visible), movedAfter1s: later.slice(0, cl.length).some((c, i) => c.y !== cl[i].y) }; });
    rec(7, 'Copies show at y 180 at different x between -200 and 200', 'Flag, wait 8 s, read clones', r, r.n >= 3 && r.allVisible && r.ys.length === 1 && r.ys[0] === 180 && r.xs.every(x => x >= -200 && x <= 200) && new Set(r.xs).size > 1);
    await h.shot(p, 'clones_top', { score: 0 });
    await h.closeAll();
  }
  // ---- Demo 8: falling, stop just below -170 ----
  {
    const p = await h.open(S(8));
    const r = await ev(p, async () => {
      H.start(); H.mouse(-230, 0);
      await H.until(() => H.clones().length >= 1, 120);
      const c = H.clones()[0]; const ys = [];
      for (let i = 0; i < 52; i++) { ys.push(+c.y.toFixed(2)); await H.frames(1); }
      const steps = ys.slice(1).map((y, i) => +(y - ys[i]).toFixed(2)).filter(d => d !== 0);
      await H.frames(240);
      return { firstY: ys[0], finalY: +c.y.toFixed(2), steps: [...new Set(steps)], clonesStillThere: H.clones().length, stuckAtBottom: H.clones().filter(t => t.y < -170).length };
    });
    rec(8, 'Copies fall 8 px per frame and stop just below -170 (no cleanup yet)', 'Flag, follow first clone frame by frame', r, r.steps.length === 1 && r.steps[0] === -8 && r.finalY === -172 && r.stuckAtBottom >= 2);
    await ev(p, async () => { H.mouse(-230, 0); });
    await h.shot(p, 'falling', { score: 0 });
    await h.closeAll();
  }
  // ---- Demo 9: catch adds points (may add more than 1 per pumpkin before demo 11) ----
  {
    const p = await h.open(S(9));
    const r = await ev(p, async () => {
      H.start(); H.mouse(-230, 0);
      await H.until(() => H.clones().length >= 1, 120);
      const c = H.clones()[0]; H.mouse(Math.round(c.x), 0);
      const s0 = H.score();
      await H.until(() => c.y <= -172, 120); await H.frames(2);
      return { pointsFromOnePumpkin: H.score() - s0 };
    });
    rec(9, 'Score goes up when Chef touches food', 'Chef placed under the first pumpkin; count points from that one pumpkin', r, r.pointsFromOnePumpkin >= 1);
    rec(9, 'Known intermediate state: one pumpkin can add more than 1 point', 'Same run', { pointsFromOnePumpkin: r.pointsFromOnePumpkin }, null);
    await h.closeAll();
    // screenshot mid-catch (pumpkin overlapping Chef, Score climbing)
    const p2 = await h.open(S(9));
    const sc = await ev(p2, async () => {
      H.start(); H.mouse(-230, 0);
      await H.until(() => H.clones().length >= 1, 120);
      const c = H.clones()[0]; H.mouse(Math.round(c.x), 0);
      await H.until(() => H.score() >= 4, 120);
      return H.score();
    });
    await h.shot(p2, 'catch', { score: sc });
    await h.closeAll();
  }
  // ---- Demo 10: win message on Food clone, then stop ----
  {
    const p = await h.open(S(10));
    const r = await ev(p, async () => {
      H.start(); H.mouse(-230, 0);
      await H.until(() => H.clones().length >= 1, 120);
      const c = H.clones()[0]; H.mouse(Math.round(c.x), 0);
      await H.until(() => H.says.length > 0, 200);
      const say = H.says[0]; const scoreAtSay = H.score(); const sayFrame = H.frame;
      await H.until(() => H.events.some(e => e.ev === 'STOP_ALL' && e.frame >= sayFrame), 120); await H.frames(3);
      const stop = H.events.find(e => e.ev === 'STOP_ALL' && e.frame >= sayFrame);
      return { say, scoreAtSay, secondsSayToStop: stop ? +((stop.frame - say.frame) / 30).toFixed(2) : null, threadsAfter: H.rt.threads.length, clonesAfter: H.clones().length };
    });
    rec(10, '“Feast Ready!” appears at more than 9 points, then the game stops', 'Chef under first pumpkin until win', r, r.say && r.say.text === 'Feast Ready!' && r.say.sprite === 'Food' && r.scoreAtSay >= 10 && r.secondsSayToStop >= 1.5 && r.threadsAfter === 0);
    rec(10, 'The speech bubble belongs to a Food clone (the pumpkin), not Chef', 'SAY event source', { sprite: r.say && r.say.sprite, isClone: r.say && r.say.isClone }, r.say && r.say.sprite === 'Food' && r.say.isClone);
    await h.closeAll();
  }
  // ---- Demo 11: full game with an auto-catch "player" moving the mouse ----
  {
    const p = await h.open(S(11));
    const r = await ev(p, async () => {
      H.start();
      const seen = new Map(); let maxPerFrame = 0, prevScore = 0, caught = 0, missed = 0, maxClones = 0, shotFrame = null;
      H.onFrame.push((f, ph) => {
        if (ph !== 'post') return;
        const cl = H.clones(); maxClones = Math.max(maxClones, cl.length);
        const ids = new Set(cl.map(c => c.id));
        for (const [id, last] of seen) if (!ids.has(id)) { if (last.y < -170) missed++; else caught++; seen.delete(id); }
        for (const c of cl) seen.set(c.id, { x: c.x, y: c.y });
        const s = H.score(); maxPerFrame = Math.max(maxPerFrame, s - prevScore); prevScore = s;
        // the "player": follow the lowest pumpkin that is still above the Chef
        const target = cl.filter(c => c.visible && c.y > -120).sort((a, b) => a.y - b.y)[0];
        if (target) H.mouse(Math.round(target.x), 0);
      });
      const winSay = await H.until(() => H.says.length > 0, 1800);
      const scoreAtSay = H.score(), caughtAtSay = caught;
      const winnerStillShowing = H.clones().filter(c => (c.getCustomState('Scratch.looks') || {}).text === 'Feast Ready!').length;
      return { winnerStillShowing, framesToWin: winSay, scoreAtSay, caughtAtSay, missedAtSay: missed, maxScorePerFrame: maxPerFrame, maxClonesOnStage: maxClones, say: H.says[0] };
    });
    rec(11, 'Every catch adds exactly 1 point; caught copies vanish', 'Auto-catch: mouse follows the lowest pumpkin; Score must equal copies deleted on a catch + the 1 winning copy still showing its bubble', r, r.scoreAtSay === r.caughtAtSay + r.winnerStillShowing && r.winnerStillShowing === 1 && r.maxScorePerFrame <= 1 && r.scoreAtSay === 10);
    await h.shot(p, 'feast_ready', { score: 10 });
    const r2 = await ev(p, async () => { const sf = H.says[0].frame; await H.until(() => H.events.some(e => e.ev === 'STOP_ALL' && e.frame >= sf), 120); await H.frames(5); return { threads: H.rt.threads.length, clones: H.clones().length, score: H.score(), stoppedAfterS: +((H.events.find(e => e.ev === 'STOP_ALL' && e.frame >= sf).frame - sf) / 30).toFixed(2) }; });
    rec(11, 'Win at 10: “Feast Ready!” on the pumpkin, then stop all', 'Same run, after the bubble', { ...r2, say: r.say }, r.say.text === 'Feast Ready!' && r2.threads === 0 && r2.stoppedAfterS >= 1.5);
    rec(11, 'During the 2-second bubble the game keeps running (Score can pass 10)', 'Same run: Score after stop all', { scoreAtSay: r.scoreAtSay, scoreAfterStop: r2.score }, null);
    await h.closeAll();
  }
  {
    const p = await h.open(S(11));
    const r = await ev(p, async () => {
      H.start(); H.mouse(-235, 0); let maxClones = 0, ever = new Set();
      H.onFrame.push((f, ph) => { if (ph === 'post') { const cl = H.clones(); maxClones = Math.max(maxClones, cl.length); cl.forEach(c => ever.add(c.id)); } });
      await H.frames(600);
      return { secondsWatched: 20, copiesMade: ever.size, maxCopiesOnStageAtOnce: maxClones, copiesLeftOnFloor: H.clones().filter(c => c.y < -170).length, score: H.score(), stillSpawning: H.rt.threads.length > 0 };
    });
    rec(11, 'Missed food is deleted at the bottom; no pile-up; new copies keep falling', 'Chef parked at the far left for 20 s', r, r.copiesLeftOnFloor === 0 && r.maxCopiesOnStageAtOnce <= 4 && r.copiesMade >= 10 && r.stillSpawning);
    await h.closeAll();
  }
  // ---- screenshot for cover / mission: mid-game, Score 4 ----
  {
    const p = await h.open(S(11));
    const s = await ev(p, async () => {
      H.start();
      H.onFrame.push((f, ph) => { if (ph !== 'post') return; const cl = H.clones().filter(c => c.visible && c.y > -120).sort((a, b) => a.y - b.y)[0]; if (cl && H.score() < 4) H.mouse(Math.round(cl.x), 0); });
      await H.until(() => H.score() >= 4, 900); H.onFrame.length = 0;
      await H.until(() => H.clones().filter(c => c.y > -60 && c.y < 120).length >= 2, 240);
      const low = H.clones().sort((a, b) => a.y - b.y)[0]; if (low) H.mouse(Math.round(low.x) + 10, 0); await H.frames(1);
      H.vm.runtime.pause && 0;
      return H.score();
    });
    await h.shot(p, 'midgame', { score: s });
    await h.closeAll();
  }
  await h.close();
  const pass = results.filter(r => r.status === 'PASS').length, fail = results.filter(r => r.status === 'FAIL').length;
  fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify({ generated: new Date().toISOString(), engine: 'scratch-vm + scratch-render (UMD builds), headless Chromium + SwiftShader WebGL, compatibility mode 30 fps', pass, fail, results }, null, 1));
  console.log(`\n${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
