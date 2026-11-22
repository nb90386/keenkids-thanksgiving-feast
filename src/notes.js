// Speaker notes for one slide (PPTX notes + teacher guide). Pure text, no formatting.
const SLIDES = require('./content.js');
const { stateAfter, sbText } = require('./scripts.js');

// cumulative clock (minutes) from each slide's `min`
const clock = []; let t = 0;
SLIDES.forEach((s) => { clock.push([t, t + s.min]); t += s.min; });
const fmt = (m) => `${Math.floor(m)}:${String(Math.round((m % 1) * 60)).padStart(2, '0')}`;
const lastOfDemo = {}; SLIDES.forEach((s, i) => { if (s.demo) lastOfDemo[s.demo] = i; });

// readable one-line form of a scratchblocks script
const plain = (code) => code.split('\n').map((l) => l.trim()).filter((l) => l !== 'end')
  .map((l) => l.replace(/\(([^()]*?) v\)/g, '[$1]').replace(/\[([^\]]*?) v\]/g, '[$1]').replace(/[()<>]/g, (c) => (c === '<' || c === '>' ? c : '')).replace(/\s+/g, ' ').trim()).join('  →  ');
// indented, readable script text (nesting preserved; 'end' closes a C-block)
const pretty = (code) => code.split('\n').map((l) => l.replace(/\(([^()]*?) v\)/g, '[$1 ▾]').replace(/\[([^\]]*?) v\]/g, '[$1 ▾]')).join('\n');
const newList = (s) => (s.block ? [s.block] : s.newBlocks || []).map((b) => b.replace(/@\d+$/, '').replace(/ \?$/, '?').replace('when clicked', 'when green flag clicked'));

function notesFor(s, i) {
  const L = [];
  const [a, b] = clock[i];
  L.push(`TIME: ${s.min} min (clock ${fmt(a)}–${fmt(b)} of 48:00)${s.demo ? ` · DEMO ${s.demo} of 11` : ''}`);
  if (s.sprite) L.push(`CLICK: ${s.sprite}${s.switchSprite ? ' (SWITCH SPRITES NOW: everyone clicks Food in the sprite list)' : ''}${s.where ? `. PUT IT: ${s.where}.` : ''}`);
  if (s.code || s.block) L.push(`NEW BLOCKS (${newList(s).length}): ${newList(s).join(' | ')}`);
  if (s.say) L.push(`SAY: ${s.say}`);
  if (s.do) L.push(`DO: ${s.do}`);
  if (s.try) L.push(`TRY IT: ${s.try}  DONE WHEN: ${s.done}`);
  else if (s.done) L.push(`DONE WHEN: ${s.done}`);
  if (s.watch) L.push(`WATCH FOR: ${s.watch}`);
  if (s.truth) L.push(`TEACHER NOTE (runtime truth): ${s.truth}`);
  if (s.demo && lastOfDemo[s.demo] === i && s.demo >= 2) {
    const st = stateAfter(s.demo);
    const parts = [];
    for (const sp of ['Chef', 'Food']) (st[sp] || []).forEach((sc) => parts.push(`[${sp}]\n${pretty(sbText(sc))}`));
    L.push(`TEACHER-ONLY: FULL CODE AFTER DEMO ${s.demo}\n${parts.join('\n\n')}`);
  }
  return L.join('\n\n');
}
module.exports = notesFor;
module.exports.clock = clock; module.exports.fmt = fmt; module.exports.plain = plain; module.exports.newList = newList; module.exports.pretty = pretty;
