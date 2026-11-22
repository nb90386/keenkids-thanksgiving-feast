// Node-side harness: static server + headless Chromium page running real scratch-vm/scratch-render.
const http = require('http'), fs = require('fs'), path = require('path');
const { launch } = require('../browser.js');
const ROOT = __dirname;
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.sb3': 'application/octet-stream' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
async function setup() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const contexts = [];
  async function open(sb3AbsPath) {
    const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 520, height: 400 } });
    contexts.push(ctx);
    const page = await ctx.newPage();
    page.errors = [];
    page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
    page.on('pageerror', e => page.errors.push('pageerror: ' + e.message));
    // copy into served dir
    const rel = 'tmp_' + path.basename(sb3AbsPath);
    fs.copyFileSync(sb3AbsPath, path.join(ROOT, rel));
    await page.goto(base + '/harness.html');
    page.names = await page.evaluate(u => H.load(u), '/' + rel);
    fs.unlinkSync(path.join(ROOT, rel));
    return page;
  }
  async function shot(page, name, meta = {}) {
    meta.chefX = await page.evaluate(() => H.T('Chef').x);
    const x2 = await page.evaluate(() => H.capture());
    const dir = path.join(__dirname, 'shots'); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name + '.png'), Buffer.from(x2.split(',')[1], 'base64'));
    const mf = path.join(dir, 'shots.json');
    const all = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf)) : {};
    all[name] = meta; fs.writeFileSync(mf, JSON.stringify(all, null, 1));
  }
  async function closeAll() { while (contexts.length) await contexts.pop().close(); }
  async function close() { await browser.close(); srv.close(); }
  return { open, shot, close, closeAll };
}
module.exports = { setup };
