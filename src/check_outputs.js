// Structural checks on the final files: slide/page counts, notes, fonts, media, sizes, hashes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execSync } = require('child_process');
const { PDFDocument, PDFName, PDFDict } = require('pdf-lib');
const OUT = path.resolve(process.argv[2]);
const P = 'KeenKids_Thanksgiving_Feast_G1-2_FINAL';
(async () => {
  const r = {};
  const pptx = path.join(OUT, P + '.pptx');
  const list = execSync(`unzip -Z1 "${pptx}"`).toString().split('\n');
  r.pptxSlides = list.filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).length;
  r.pptxNotes = list.filter((f) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(f)).length;
  r.pptxMedia = list.filter((f) => f.startsWith('ppt/media/')).length;
  const pres = execSync(`unzip -p "${pptx}" ppt/presentation.xml`).toString();
  r.pptxSlideSize = (pres.match(/<p:sldSz[^>]*>/) || [''])[0];
  const fonts = new Set(); let emptyNotes = 0, textBoxes = 0, pictures = 0;
  for (let i = 1; i <= r.pptxSlides; i++) {
    const x = execSync(`unzip -p "${pptx}" ppt/slides/slide${i}.xml`).toString();
    (x.match(/typeface="([^"]+)"/g) || []).forEach((m) => fonts.add(m.slice(10, -1)));
    textBoxes += (x.match(/<p:txBody>/g) || []).length; pictures += (x.match(/<p:pic>/g) || []).length;
    const n = execSync(`unzip -p "${pptx}" ppt/notesSlides/notesSlide${i}.xml`).toString();
    if ((n.match(/<a:t>([^<]*)<\/a:t>/g) || []).join('').replace(/<[^>]+>/g, '').trim().length < 40) emptyNotes++;
  }
  Object.assign(r, { pptxFonts: [...fonts], pptxSlidesWithoutNotes: emptyNotes, pptxEditableTextBoxes: textBoxes, pptxPictures: pictures });
  const pdf = await PDFDocument.load(fs.readFileSync(path.join(OUT, P + '.pdf')));
  r.pdfPages = pdf.getPageCount();
  const p0 = pdf.getPage(0); r.pdfPageSizeIn = [p0.getWidth() / 72, p0.getHeight() / 72].map((v) => +v.toFixed(3));
  const fn = new Set();
  pdf.context.enumerateIndirectObjects().forEach(([, obj]) => { if (obj instanceof PDFDict) { const f = obj.get(PDFName.of('FontName')); if (f && (obj.get(PDFName.of('FontFile2')) || obj.get(PDFName.of('FontFile3')))) fn.add(f.toString().replace(/^\/[A-Z]{6}\+/, '')); } });
  r.pdfEmbeddedFonts = [...fn];
  r.files = Object.fromEntries(fs.readdirSync(OUT).filter((f) => !f.startsWith('.') && fs.statSync(path.join(OUT, f)).isFile()).map((f) => {
    const b = fs.readFileSync(path.join(OUT, f));
    return [f, { MB: +(b.length / 1e6).toFixed(2), sha1: crypto.createHash('sha1').update(b).digest('hex').slice(0, 12) }];
  }));
  fs.writeFileSync(path.join(__dirname, 'render', 'output_checks.json'), JSON.stringify(r, null, 1));
  console.log(JSON.stringify(r, null, 1));
})();
