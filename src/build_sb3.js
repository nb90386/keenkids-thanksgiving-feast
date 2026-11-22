// Builds Scratch projects from the untouched starter:
//  - gameplay/stages/after_demoNN.sb3 (state after each demo, used for gameplay tests and real stage screenshots)
//  - output/KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3 (state after demo 11)
// The starter file itself is only read.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const JSZip = require('jszip');
const { projectAfter, decompile, sbText, stateAfter } = require('./scripts.js');

const ROOT = path.resolve(__dirname, '..');
const STARTER = path.join(ROOT, 'Thanksgiving_Feast! (1).sb3');
const OUT_FINAL = path.join(ROOT, 'output', 'KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3');
const STAGES = path.join(__dirname, 'gameplay', 'stages');

(async () => {
  const buf = fs.readFileSync(STARTER);
  const sha = crypto.createHash('sha1').update(buf).digest('hex');
  const zip = await JSZip.loadAsync(buf);
  const starter = JSON.parse(await zip.file('project.json').async('string'));
  // audit gate: starter must be Stage/Chef/Food with zero blocks and no variables
  const names = starter.targets.map((t) => t.name).join(',');
  const blockCount = starter.targets.reduce((n, t) => n + Object.keys(t.blocks).length, 0);
  const varCount = starter.targets.reduce((n, t) => n + Object.keys(t.variables).length, 0);
  if (names !== 'Stage,Chef,Food' || blockCount !== 0 || varCount !== 0) throw new Error(`starter audit failed: ${names} blocks=${blockCount} vars=${varCount}`);
  const assets = {};
  for (const f of Object.keys(zip.files)) if (f !== 'project.json') assets[f] = await zip.file(f).async('nodebuffer');

  fs.mkdirSync(STAGES, { recursive: true });
  const report = { starterSha1: sha, starterTargets: names, starterBlocks: blockCount, starterVariables: varCount, stages: {} };
  for (let n = 1; n <= 11; n++) {
    const pj = projectAfter(starter, n);
    const z = new JSZip();
    z.file('project.json', JSON.stringify(pj));
    for (const [f, b] of Object.entries(assets)) z.file(f, b);
    const out = await z.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const file = path.join(STAGES, `after_demo${String(n).padStart(2, '0')}.sb3`);
    fs.writeFileSync(file, out);
    // round-trip check: project.json decompiles to exactly the source scripts
    const dec = decompile(pj), st = stateAfter(n);
    for (const sprite of ['Chef', 'Food']) {
      const want = (st[sprite] || []).map(sbText), got = dec[sprite];
      if (JSON.stringify(want) !== JSON.stringify(got)) throw new Error(`round-trip mismatch demo ${n} ${sprite}\nWANT\n${want.join('\n--\n')}\nGOT\n${got.join('\n--\n')}`);
    }
    report.stages[n] = { blocks: Object.fromEntries(pj.targets.map((t) => [t.name, Object.keys(t.blocks).length])), variables: n >= 3 ? ['Score (for all sprites)'] : [] };
    if (n === 11) { fs.mkdirSync(path.dirname(OUT_FINAL), { recursive: true }); fs.writeFileSync(OUT_FINAL, out); }
  }
  const after = crypto.createHash('sha1').update(fs.readFileSync(STARTER)).digest('hex');
  report.starterUnchanged = after === sha;
  report.finalScripts = decompile(projectAfter(starter, 11));
  fs.mkdirSync(path.join(__dirname, 'render'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'render', 'sb3_report.json'), JSON.stringify(report, null, 1));
  console.log('starter', names, 'blocks', blockCount, 'vars', varCount, 'sha1', sha, 'unchanged', report.starterUnchanged);
  console.log('final scripts:\n' + Object.entries(report.finalScripts).map(([k, v]) => `## ${k}\n${v.join('\n\n')}`).join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
