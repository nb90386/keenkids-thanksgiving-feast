// Builds raster art for the deck from the REAL starter assets (extracted from the .sb3) and real engine screenshots.
// Output → ../assets/*.png|jpg. Sprite art is never redrawn: it is the starter's own SVG, rasterised.
const fs = require('fs'), path = require('path');
const JSZip = require('jszip');
const { launch } = require('./browser.js');
const ROOT = path.resolve(__dirname, '..');
const A = path.join(ROOT, 'assets');
const SHOTS = path.join(__dirname, 'gameplay', 'shots');

const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const FONT = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif";
const FF = (f) => `url('file://${__dirname}/fonts/static/${f}.ttf')`;
const FONT_CSS = `@font-face{font-family:Literata;src:${FF('Literata-Regular')};font-weight:400}@font-face{font-family:Literata;src:${FF('Literata-Italic')};font-style:italic}@font-face{font-family:Literata;src:${FF('Literata-Bold')};font-weight:700}@font-face{font-family:Figtree;src:${FF('Figtree-Regular')};font-weight:400}@font-face{font-family:Figtree;src:${FF('Figtree-Bold')};font-weight:700}`;

// Scratch 3 variable monitor (default mode), at stage scale k
const monitor = (value, k) => `<div style="position:absolute;left:${5 * k}px;top:${5 * k}px;display:flex;align-items:center;background:#E5F0FF;border:${k}px solid rgba(0,0,0,0.15);border-radius:${4 * k}px;padding:${3 * k}px ${5 * k}px;${FONT};font-size:${12 * k}px;font-weight:700;color:#575E75">
  Score<span style="margin-left:${5 * k}px;min-width:${40 * k}px;box-sizing:border-box;text-align:center;background:#FF8C1A;color:#fff;border-radius:${4 * k}px;padding:0 ${2 * k}px;line-height:${17 * k}px">${value}</span></div>`;

const flagSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><path d="M9 6v30" stroke="#45993D" stroke-width="3.2" stroke-linecap="round"/><path d="M10.5 7.5c6-3.4 10.4 2.6 17.6-.6v14.4c-7.2 3.2-11.6-2.8-17.6.6z" fill="#4CBF56" stroke="#45993D" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><path d="M14 5h12l9 9v12l-9 9H14l-9-9V14z" fill="#EC5959" stroke="#B84848" stroke-width="2.4" stroke-linejoin="round"/></svg>`;

(async () => {
  fs.mkdirSync(path.join(A, 'extracted'), { recursive: true });
  // 1) extract the starter's real art
  const zip = await JSZip.loadAsync(fs.readFileSync(path.join(ROOT, 'Thanksgiving_Feast! (1).sb3')));
  const pj = JSON.parse(await zip.file('project.json').async('string'));
  const art = {};
  for (const t of pj.targets) {
    const c = t.costumes[0];
    const svg = await zip.file(c.md5ext).async('string');
    const name = { Stage: 'feast_kitchen', Chef: 'chef', Food: 'pumpkin' }[t.name];
    fs.writeFileSync(path.join(A, 'extracted', name + '.svg'), svg);
    const [, , w, h] = svg.match(/viewBox="([\d.\s-]+)"/)[1].split(/\s+/).map(Number);
    art[name] = { svg, w, h, cx: c.rotationCenterX, cy: c.rotationCenterY, x: t.x, y: t.y };
  }
  const b = await launch();
  const page = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 2400, height: 1600 } });
  const shot = async (html, out, { transparent = true, type = 'png', quality } = {}) => {
    await page.setContent(`<!doctype html><html><head><style>${FONT_CSS}*{box-sizing:border-box}</style></head><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(60);
    await (await page.$('#root')).screenshot({ path: path.join(A, out), omitBackground: transparent, type, quality });
  };
  // 2) sprite + backdrop rasters (8× sprites, 4× backdrop)
  for (const n of ['chef', 'pumpkin']) await shot(`<img id="root" src="${uri(art[n].svg)}" style="display:block;width:${art[n].w * 8}px;height:${art[n].h * 8}px">`, `sprite_${n}.png`);
  await shot(`<img id="root" src="${uri(art.feast_kitchen.svg)}" style="display:block;width:1920px;height:1440px">`, 'feast_kitchen.png', { transparent: false });
  for (const [n, s] of [['flag', flagSVG], ['stop', stopSVG]]) await shot(`<img id="root" src="${uri(s)}" style="display:block;width:320px;height:320px">`, `icon_${n}.png`);

  // 3) real engine screenshots (960×720) + Scratch 3 Score monitor where the variable exists
  const meta = JSON.parse(fs.readFileSync(path.join(SHOTS, 'shots.json'), 'utf8'));
  for (const [name, m] of Object.entries(meta)) {
    await shot(`<div id="root" style="position:relative;width:960px;height:720px;overflow:hidden"><img src="${png(path.join(SHOTS, name + '.png'))}" style="display:block;width:960px;height:720px">${m.score !== null && m.score !== undefined ? monitor(m.score, 2) : ''}</div>`, `scene_${name}.png`, { transparent: false });
  }

  // 3b) storybook arches (cover / finish) from the raw engine frames (no GUI overlay)
  const shotMeta = JSON.parse(fs.readFileSync(path.join(SHOTS, 'shots.json'), 'utf8'));
  for (const [shotName, out] of [['midgame', 'cover_arch.png'], ['feast_ready', 'finish_arch.png']]) {
    // the image is scaled to 1364 px tall (×1.894 of the 720-px frame); centre the arch window on Chef (+ a little right for the bubble)
    const k = 1364 / 720, imgW = 960 * k, chefPx = ((shotMeta[shotName].chefX || 0) + 240) * 2 * k;
    const left = Math.max(0, Math.min(imgW - 1300, chefPx + 90 - 650));
    await shot(`<div id="root" style="width:1300px;height:1364px;border-radius:50% 50% 24px 24px / 30% 30% 24px 24px;overflow:hidden;background:url(${png(path.join(SHOTS, shotName + '.png'))}) ${-left}px 0/auto 100% no-repeat"></div>`, out);
  }
  // 4) paper + cloth textures (subtle grain / woven crosshatch)
  await shot(`<div id="root" style="width:1920px;height:1080px;background:#F7F3E9;position:relative"><svg width="1920" height="1080" style="position:absolute;inset:0"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.07 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg></div>`, 'paper.jpg', { transparent: false, type: 'jpeg', quality: 88 });
  await shot(`<div id="root" style="width:1920px;height:1080px;background:#254638;position:relative"><svg width="1920" height="1080" style="position:absolute;inset:0"><defs><pattern id="w" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0L6 6M6 0L0 6" stroke="#1b3429" stroke-width="0.7" opacity="0.55"/></pattern><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.035 0"/></filter></defs><rect width="100%" height="100%" fill="url(#w)"/><rect width="100%" height="100%" filter="url(#n)"/></svg></div>`, 'cloth.jpg', { transparent: false, type: 'jpeg', quality: 88 });

  // 5) Editor map for Demo 1 (schematic of the Scratch/TurboWarp editor with the REAL starter stage and sprites)
  const starterScene = png(path.join(A, 'scene_starter.png'));
  const cats = [['Motion', '#4C97FF'], ['Looks', '#9966FF'], ['Sound', '#CF63CF'], ['Events', '#FFBF00'], ['Control', '#FFAB19'], ['Sensing', '#5CB1D6'], ['Operators', '#59C059'], ['Variables', '#FF8C1A']];
  const badge = (n, x, y) => `<div style="position:absolute;left:${x}px;top:${y}px;width:64px;height:64px;border-radius:50%;background:#C8641E;color:#fff;font:700 38px Figtree,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px #FFFCF5">${n}</div>`;
  const tile = (img, ar, label, sel, w = 190) => `<div style="width:${w}px;height:${w + 30}px;border-radius:14px;background:#fff;border:${sel ? '5px solid #4C97FF' : '2px solid #D9E3F2'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;${sel ? 'box-shadow:0 0 0 6px rgba(76,151,255,.22)' : ''}"><img src="${img}" style="height:${w * 0.58}px;width:${w * 0.58 * ar}px"><div style="${FONT};font-size:26px;font-weight:700;color:#575E75">${label}</div></div>`;
  const chefPng = png(path.join(A, 'sprite_chef.png')), pumpkinPng = png(path.join(A, 'sprite_pumpkin.png')), kitchenPng = png(path.join(A, 'feast_kitchen.png'));
  const flagPng = png(path.join(A, 'icon_flag.png')), stopPng = png(path.join(A, 'icon_stop.png'));
  const editor = `<div id="root" style="position:relative;width:2000px;height:1160px;background:#E8EDF1;border-radius:22px;overflow:hidden;border:3px solid #C9D3DD">
    <div style="height:70px;background:#D5DEE6;display:flex;align-items:center;gap:36px;padding-left:34px;${FONT};font-size:28px;font-weight:700;color:#4F5B6B">File <span>Edit</span></div>
    <div style="position:absolute;left:0;top:70px;width:150px;bottom:0;background:#fff;border-right:2px solid #D9E3F2;padding-top:20px">${cats.map(([n, c]) => `<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:16px"><div style="width:38px;height:38px;border-radius:50%;background:${c};border:2px solid rgba(0,0,0,.12)"></div><div style="${FONT};font-size:17px;color:#575E75;margin-top:4px">${n}</div></div>`).join('')}</div>
    <div style="position:absolute;left:150px;top:70px;width:300px;bottom:0;background:#F9F9F9;border-right:2px solid #D9E3F2"></div>
    <div style="position:absolute;left:450px;top:70px;width:810px;bottom:0;background:#fff;background-image:radial-gradient(#DDE3EA 2px,transparent 2px);background-size:40px 40px;display:flex;align-items:center;justify-content:center">
      <div style="font:italic 400 44px Literata,Georgia,serif;color:#8A93A3;text-align:center;line-height:1.3">Code area<br><b style="font-style:normal;font-family:Figtree,sans-serif;color:#C8641E;font-size:46px">No blocks yet!</b></div></div>
    <div style="position:absolute;left:1290px;top:84px;display:flex;gap:22px"><img src="${flagPng}" style="width:54px;height:54px"><img src="${stopPng}" style="width:54px;height:54px"></div>
    <img src="${starterScene}" style="position:absolute;left:1290px;top:152px;width:680px;height:510px;border:2px solid #C9D3DD;border-radius:10px">
    <div style="position:absolute;left:1290px;top:690px;width:680px;height:440px;background:#fff;border:2px solid #C9D3DD;border-radius:14px;padding:26px;display:flex;gap:26px;align-items:flex-start">
      ${tile(chefPng, 70 / 90, 'Chef', true)}${tile(pumpkinPng, 1, 'Food', false)}
      <div style="margin-left:auto;display:flex;flex-direction:column;align-items:center;gap:8px;border-left:2px solid #D9E3F2;padding-left:22px"><div style="${FONT};font-size:22px;font-weight:700;color:#575E75">Stage</div><img src="${kitchenPng}" style="width:150px;height:112px;border-radius:8px;border:2px solid #D9E3F2"></div>
    </div>
    ${badge(1, 1255, 120)}${badge(2, 1255, 700)}${badge(3, 640, 560)}
  </div>`;
  await shot(editor, 'editor_starter.png');

  // 6) "Make a Variable" for Demo 3 (Variables palette button + New Variable dialog + Score monitor)
  const dialog = `<div id="root" style="position:relative;width:1500px;height:1000px">
    <div style="position:absolute;left:0;top:30px;width:430px;height:600px;background:#F9F9F9;border:2px solid #D9E3F2;border-radius:16px;padding:30px 28px">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px"><div style="width:44px;height:44px;border-radius:50%;background:#FF8C1A;border:2px solid #DB6E00"></div><div style="${FONT};font-size:34px;font-weight:700;color:#575E75">Variables</div></div>
      <div style="border:3px solid #C8641E;background:#fff;border-radius:12px;padding:20px 10px;text-align:center;${FONT};font-size:30px;font-weight:700;color:#575E75;box-shadow:0 0 0 7px rgba(200,100,30,.18)">Make a Variable</div>
    </div>
    <div style="position:absolute;left:530px;top:0;width:960px;height:640px;background:#fff;border-radius:18px;border:3px solid #C9D3DD;overflow:hidden;box-shadow:0 18px 40px rgba(40,44,38,.18)">
      <div style="height:96px;background:#855CD6;color:#fff;${FONT};font-size:36px;font-weight:700;display:flex;align-items:center;justify-content:center">New Variable</div>
      <div style="padding:40px 56px">
        <div style="${FONT};font-size:30px;color:#575E75;margin-bottom:16px">New variable name:</div>
        <div style="border:3px solid #C8641E;border-radius:12px;height:82px;display:flex;align-items:center;padding-left:26px;${FONT};font-size:40px;font-weight:700;color:#575E75;box-shadow:0 0 0 7px rgba(200,100,30,.18)">Score</div>
        <div style="display:flex;gap:46px;margin-top:40px;${FONT};font-size:30px;color:#575E75;align-items:center">
          <div style="display:flex;align-items:center;gap:14px;font-weight:700;padding:10px 16px;border:3px solid #C8641E;border-radius:12px"><div style="width:34px;height:34px;border-radius:50%;border:3px solid #855CD6;display:flex;align-items:center;justify-content:center"><div style="width:18px;height:18px;border-radius:50%;background:#855CD6"></div></div>For all sprites</div>
          <div style="display:flex;align-items:center;gap:14px;opacity:.75"><div style="width:34px;height:34px;border-radius:50%;border:3px solid #C1C7D0"></div>For this sprite only</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:22px;margin-top:52px">
          <div style="padding:16px 34px;border-radius:40px;border:2px solid #D9E3F2;${FONT};font-size:30px;font-weight:700;color:#575E75">Cancel</div>
          <div style="padding:16px 46px;border-radius:40px;background:#855CD6;${FONT};font-size:30px;font-weight:700;color:#fff;box-shadow:0 0 0 7px rgba(200,100,30,.25)">OK</div>
        </div>
      </div>
    </div>
    <div style="position:absolute;left:0;top:700px;width:430px;height:300px"><div style="${FONT};font-size:26px;font-weight:700;color:#7A7F73;letter-spacing:2px;margin-bottom:16px">ON THE STAGE</div>
      <div style="position:relative;width:430px;height:230px;border-radius:12px;overflow:hidden;border:2px solid #C9D3DD"><img src="${kitchenPng}" style="width:430px;height:323px;display:block">${monitor(0, 3).replace('position:absolute', 'position:absolute')}</div></div>
    ${badge(1, 400, 40)}${badge(2, 400, 175)}${badge(3, 1440, 196)}${badge(4, 1440, 430)}
  </div>`;
  await shot(dialog, 'variable_dialog.png');
  await b.close();
  console.log('assets:', fs.readdirSync(A).filter((f) => /\.(png|jpg)$/.test(f)).join(', '));
})().catch((e) => { console.error(e); process.exit(1); });
