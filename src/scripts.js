// Single source of truth for the Thanksgiving Feast game code.
// Every block is tagged with the demo (d) that introduces it, so the state "after demo N" is just a filter.
// The same tree emits (a) scratchblocks text for docs/verification and (b) Scratch 3 project.json blocks.

const VAR_ID = 'kkScoreVar';

// ---- tiny DSL -------------------------------------------------------------
const lit = (v) => ({ lit: String(v) });
const B = (op, d, o = {}) => ({ op, d, in: o.in || {}, sub: o.sub || null });
const DSL = {
  whenFlag: (d) => B('event_whenflagclicked', d),
  goToXY: (d, x, y) => B('motion_gotoxy', d, { in: { X: x, Y: y } }),
  setScore: (d, v) => B('data_setvariableto', d, { in: { VALUE: v } }),
  forever: (d, sub) => B('control_forever', d, { sub }),
  setX: (d, x) => B('motion_setx', d, { in: { X: x } }),
  mouseX: (d) => B('sensing_mousex', d),
  hide: (d) => B('looks_hide', d),
  show: (d) => B('looks_show', d),
  wait: (d, s) => B('control_wait', d, { in: { DURATION: s } }),
  random: (d, a, b) => B('operator_random', d, { in: { FROM: a, TO: b } }),
  createClone: (d) => B('control_create_clone_of', d),
  whenClone: (d) => B('control_start_as_clone', d),
  repeatUntil: (d, cond, sub) => B('control_repeat_until', d, { in: { CONDITION: cond }, sub }),
  lt: (d, a, b) => B('operator_lt', d, { in: { OPERAND1: a, OPERAND2: b } }),
  gt: (d, a, b) => B('operator_gt', d, { in: { OPERAND1: a, OPERAND2: b } }),
  yPos: (d) => B('motion_yposition', d),
  changeY: (d, v) => B('motion_changeyby', d, { in: { DY: v } }),
  if: (d, cond, sub) => B('control_if', d, { in: { CONDITION: cond }, sub }),
  touching: (d, who) => ({ ...B('sensing_touchingobject', d), menu: who }),
  changeScore: (d, v) => B('data_changevariableby', d, { in: { VALUE: v } }),
  score: (d) => B('data_variable', d),
  sayFor: (d, msg, s) => B('looks_sayforsecs', d, { in: { MESSAGE: msg, SECS: s } }),
  stopAll: (d) => B('control_stop', d),
  deleteClone: (d) => B('control_delete_this_clone', d),
};
const D = DSL;

// ---- the final game (MASTER_PROMPT §4) -------------------------------------
// Inputs that are reporters carry their own demo tag; literals are typed in the demo of their block.
const FINAL = {
  Chef: [[
    D.whenFlag(2),
    D.goToXY(2, lit(0), lit(-130)),
    D.setScore(3, lit(0)),
    D.forever(4, [D.setX(4, D.mouseX(4))]),
  ]],
  Food: [
    [
      D.whenFlag(5),
      D.hide(5),
      D.forever(6, [
        D.wait(6, D.random(6, lit(1), lit(2))),
        D.createClone(6),
      ]),
    ],
    [
      D.whenClone(7),
      D.show(7),
      D.goToXY(7, D.random(7, lit(-200), lit(200)), lit(180)),
      D.repeatUntil(8, D.lt(8, D.yPos(8), lit(-170)), [
        D.changeY(8, lit(-8)),
        D.if(9, D.touching(9, 'Chef'), [
          D.changeScore(9, lit(1)),
          D.if(10, D.gt(10, D.score(10), lit(9)), [
            D.sayFor(10, lit('Feast Ready!'), lit(2)),
            D.stopAll(10),
          ]),
          D.deleteClone(11),
        ]),
      ]),
      D.deleteClone(11),
    ],
  ],
  Stage: [],
};

// Literal value a slot shows while its reporter has not been dropped in yet (Scratch defaults).
const SLOT_DEFAULT = { 'motion_setx.X': '0', 'control_wait.DURATION': '1', 'motion_gotoxy.X': '0', 'operator_lt.OPERAND1': '', 'operator_gt.OPERAND1': '' };

// State of the scripts after demo n (blocks introduced later are removed; a removed reporter leaves its slot default).
function stateAfter(n) {
  const cut = (b, parentOp, key) => {
    if (!b) return null;
    if (b.lit !== undefined) return b;
    if (b.d > n) return key ? { lit: SLOT_DEFAULT[`${parentOp}.${key}`] ?? '' } : null;
    const inn = {};
    for (const [k, v] of Object.entries(b.in)) inn[k] = cut(v, b.op, k);
    return { ...b, in: inn, sub: b.sub ? b.sub.map((x) => cut(x)).filter(Boolean) : null };
  };
  const out = {};
  for (const [sprite, scripts] of Object.entries(FINAL)) {
    out[sprite] = scripts.map((s) => s.map((b) => cut(b)).filter(Boolean)).filter((s) => s.length && s[0].d <= n);
  }
  return out;
}

// ---- scratchblocks text ----------------------------------------------------
function sbIn(v) {
  if (!v) return '()';
  if (v.lit !== undefined) return `(${v.lit})`;
  return sbExpr(v);
}
function sbExpr(b) {
  switch (b.op) {
    case 'sensing_mousex': return '(mouse x)';
    case 'motion_yposition': return '(y position)';
    case 'data_variable': return '(Score)';
    case 'operator_random': return `(pick random ${sbIn(b.in.FROM)} to ${sbIn(b.in.TO)})`;
    case 'operator_lt': return `<${sbIn(b.in.OPERAND1)} < ${sbIn(b.in.OPERAND2)}>`;
    case 'operator_gt': return `<${sbIn(b.in.OPERAND1)} > ${sbIn(b.in.OPERAND2)}>`;
    case 'sensing_touchingobject': return `<touching (${b.menu} v)?>`;
    default: throw new Error('no expr for ' + b.op);
  }
}
function sbStack(stack, ind = '') {
  const L = [];
  for (const b of stack) {
    const I = b.in;
    switch (b.op) {
      case 'event_whenflagclicked': L.push('when green flag clicked'); break;
      case 'control_start_as_clone': L.push('when I start as a clone'); break;
      case 'motion_gotoxy': L.push(`go to x: ${sbIn(I.X)} y: ${sbIn(I.Y)}`); break;
      case 'data_setvariableto': L.push(`set [Score v] to ${sbIn(I.VALUE)}`); break;
      case 'data_changevariableby': L.push(`change [Score v] by ${sbIn(I.VALUE)}`); break;
      case 'motion_setx': L.push(`set x to ${sbIn(I.X)}`); break;
      case 'motion_changeyby': L.push(`change y by ${sbIn(I.DY)}`); break;
      case 'looks_hide': L.push('hide'); break;
      case 'looks_show': L.push('show'); break;
      case 'control_wait': L.push(`wait ${sbIn(I.DURATION)} seconds`); break;
      case 'control_create_clone_of': L.push('create clone of (myself v)'); break;
      case 'looks_sayforsecs': L.push(`say [${I.MESSAGE.lit}] for ${sbIn(I.SECS)} seconds`); break;
      case 'control_stop': L.push('stop [all v]'); break;
      case 'control_delete_this_clone': L.push('delete this clone'); break;
      case 'control_forever': L.push('forever'); break;
      case 'control_repeat_until': L.push(`repeat until ${I.CONDITION ? sbExpr(I.CONDITION) : '<>'}`); break;
      case 'control_if': L.push(`if ${I.CONDITION ? sbExpr(I.CONDITION) : '<>'} then`); break;
      default: throw new Error('no stmt for ' + b.op);
    }
    const last = L.length - 1; L[last] = ind + L[last];
    if (b.sub) { L.push(...sbStack(b.sub, ind + '  ')); L.push(ind + 'end'); }
  }
  return L;
}
const sbText = (stack) => sbStack(stack).join('\n');

// ---- project.json ----------------------------------------------------------
function pjBlocks(scripts, spriteIndex) {
  const blocks = {}; let uid = 0;
  const id = () => `kk${spriteIndex}_${String(++uid).padStart(3, '0')}`;
  const mk = (opcode, parent, extra = {}) => { const k = id(); blocks[k] = { opcode, next: null, parent, inputs: {}, fields: {}, shadow: false, topLevel: false, ...extra }; return k; };
  const numLit = (v, type = 4) => [type, String(v)];
  // input with possible reporter
  const input = (owner, key, v, litType) => {
    const B0 = blocks[owner];
    if (!v || v.lit !== undefined) { B0.inputs[key] = [1, numLit(v ? v.lit : '', litType)]; return; }
    if (v.op === 'data_variable') { B0.inputs[key] = [3, [12, 'Score', VAR_ID], numLit('', litType)]; return; }
    const r = expr(v, owner);
    B0.inputs[key] = [3, r, numLit(SLOT_DEFAULT[`${B0.opcode}.${key}`] ?? '', litType)];
  };
  const expr = (b, parent) => {
    const k = mk(b.op, parent);
    if (b.op === 'operator_random') { input(k, 'FROM', b.in.FROM, 4); input(k, 'TO', b.in.TO, 4); }
    if (b.op === 'operator_lt' || b.op === 'operator_gt') { input(k, 'OPERAND1', b.in.OPERAND1, 10); input(k, 'OPERAND2', b.in.OPERAND2, 10); }
    if (b.op === 'sensing_touchingobject') {
      const m = mk('sensing_touchingobjectmenu', k, { shadow: true, fields: { TOUCHINGOBJECTMENU: [b.menu, null] } });
      blocks[k].inputs.TOUCHINGOBJECTMENU = [1, m];
    }
    return k;
  };
  const stack = (list, parent, x, y) => {
    let prev = null, first = null;
    for (const b of list) {
      const k = mk(b.op, prev || parent);
      if (!first) { first = k; if (x !== undefined) Object.assign(blocks[k], { topLevel: true, parent: null, x, y }); }
      if (prev) blocks[prev].next = k;
      const I = b.in;
      switch (b.op) {
        case 'motion_gotoxy': input(k, 'X', I.X, 4); input(k, 'Y', I.Y, 4); break;
        case 'data_setvariableto': input(k, 'VALUE', I.VALUE, 10); blocks[k].fields.VARIABLE = ['Score', VAR_ID]; break;
        case 'data_changevariableby': input(k, 'VALUE', I.VALUE, 4); blocks[k].fields.VARIABLE = ['Score', VAR_ID]; break;
        case 'motion_setx': input(k, 'X', I.X, 4); break;
        case 'motion_changeyby': input(k, 'DY', I.DY, 4); break;
        case 'control_wait': input(k, 'DURATION', I.DURATION, 5); break;
        case 'looks_sayforsecs': input(k, 'MESSAGE', I.MESSAGE, 10); input(k, 'SECS', I.SECS, 4); break;
        case 'control_create_clone_of': {
          const m = mk('control_create_clone_of_menu', k, { shadow: true, fields: { CLONE_OPTION: ['_myself_', null] } });
          blocks[k].inputs.CLONE_OPTION = [1, m]; break;
        }
        case 'control_stop': blocks[k].fields.STOP_OPTION = ['all', null]; blocks[k].mutation = { tagName: 'mutation', children: [], hasnext: 'false' }; break;
        case 'control_repeat_until': case 'control_if':
          if (I.CONDITION) blocks[k].inputs.CONDITION = [2, expr(I.CONDITION, k)];
          break;
      }
      if (b.sub && b.sub.length) blocks[k].inputs.SUBSTACK = [2, stack(b.sub, k)];
      prev = k;
    }
    return first;
  };
  scripts.forEach((s, n) => stack(s, null, 40 + n * 420, 40));
  return blocks;
}

// Builds project.json for the state after demo n from the untouched starter project.json.
function projectAfter(starter, n) {
  const pj = JSON.parse(JSON.stringify(starter));
  const st = stateAfter(n);
  pj.targets.forEach((t, i) => { t.blocks = pjBlocks(st[t.name] || [], i); });
  if (n >= 3) {
    const stage = pj.targets.find((t) => t.isStage);
    stage.variables[VAR_ID] = ['Score', 0];
    pj.monitors = [{ id: VAR_ID, mode: 'default', opcode: 'data_variable', params: { VARIABLE: 'Score' }, spriteName: null,
      value: 0, width: 0, height: 0, x: 5, y: 5, visible: true, sliderMin: 0, sliderMax: 100, isDiscrete: true }];
  }
  return pj;
}

// project.json → scratchblocks text (independent decompiler used by verification)
function decompile(pj) {
  const out = {};
  for (const t of pj.targets) {
    const B0 = t.blocks;
    const lit = (inp) => (Array.isArray(inp[1]) ? inp[1][1] : null);
    const val = (inp) => {
      if (!inp) return '()';
      const v = inp[1];
      if (Array.isArray(v) && v[0] === 12) return `(${v[1]})`;
      if (typeof v === 'string') return ex(v);
      return `(${v[1]})`;
    };
    const ex = (k) => {
      const b = B0[k];
      switch (b.opcode) {
        case 'sensing_mousex': return '(mouse x)';
        case 'motion_yposition': return '(y position)';
        case 'operator_random': return `(pick random ${val(b.inputs.FROM)} to ${val(b.inputs.TO)})`;
        case 'operator_lt': return `<${val(b.inputs.OPERAND1)} < ${val(b.inputs.OPERAND2)}>`;
        case 'operator_gt': return `<${val(b.inputs.OPERAND1)} > ${val(b.inputs.OPERAND2)}>`;
        case 'sensing_touchingobject': return `<touching (${B0[b.inputs.TOUCHINGOBJECTMENU[1]].fields.TOUCHINGOBJECTMENU[0]} v)?>`;
      }
      return `<?${b.opcode}?>`;
    };
    const stmt = (k, ind, L) => {
      for (; k; k = B0[k].next) {
        const b = B0[k], I = b.inputs; let s;
        switch (b.opcode) {
          case 'event_whenflagclicked': s = 'when green flag clicked'; break;
          case 'control_start_as_clone': s = 'when I start as a clone'; break;
          case 'motion_gotoxy': s = `go to x: ${val(I.X)} y: ${val(I.Y)}`; break;
          case 'data_setvariableto': s = `set [${b.fields.VARIABLE[0]} v] to ${val(I.VALUE)}`; break;
          case 'data_changevariableby': s = `change [${b.fields.VARIABLE[0]} v] by ${val(I.VALUE)}`; break;
          case 'motion_setx': s = `set x to ${val(I.X)}`; break;
          case 'motion_changeyby': s = `change y by ${val(I.DY)}`; break;
          case 'looks_hide': s = 'hide'; break;
          case 'looks_show': s = 'show'; break;
          case 'control_wait': s = `wait ${val(I.DURATION)} seconds`; break;
          case 'control_create_clone_of': s = `create clone of (${B0[I.CLONE_OPTION[1]].fields.CLONE_OPTION[0].replace('_myself_', 'myself')} v)`; break;
          case 'looks_sayforsecs': s = `say [${lit(I.MESSAGE)}] for ${val(I.SECS)} seconds`; break;
          case 'control_stop': s = `stop [${b.fields.STOP_OPTION[0]} v]`; break;
          case 'control_delete_this_clone': s = 'delete this clone'; break;
          case 'control_forever': s = 'forever'; break;
          case 'control_repeat_until': s = `repeat until ${I.CONDITION ? ex(I.CONDITION[1]) : '<>'}`; break;
          case 'control_if': s = `if ${I.CONDITION ? ex(I.CONDITION[1]) : '<>'} then`; break;
          default: s = `?${b.opcode}?`;
        }
        L.push(ind + s);
        if (['control_forever', 'control_repeat_until', 'control_if'].includes(b.opcode)) {
          if (I.SUBSTACK) stmt(I.SUBSTACK[1], ind + '  ', L);
          L.push(ind + 'end');
        }
      }
      return L;
    };
    out[t.name] = Object.entries(B0).filter(([, b]) => b.topLevel).sort((a, b) => a[1].x - b[1].x).map(([k]) => stmt(k, '', []).join('\n'));
  }
  return out;
}

module.exports = { FINAL, stateAfter, sbText, projectAfter, decompile, VAR_ID };
