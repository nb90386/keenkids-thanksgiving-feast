// KeenKids Thanksgiving Feast (Grades 1–2) — single source of truth for every slide.
// Coding slides: `code` is scratchblocks (Scratch 3) syntax for the focus picture. Blocks whose signature is listed in
// `newBlocks` render bright; every other block renders faded (it is already in the student's project).
// `map` (optional) is a small "where it goes" picture with `mapNew` bright.
// Signatures = a block's own words + typed values, e.g. 'go to x: 0 y: -130', 'touching Chef ?'. 'sig@2' = 2nd match.
// Notes: say (teacher script), do (classroom move), watch (common child error → quick fix), truth (runtime caveat).

const S = []; const add = (o) => S.push(o);

add({ type: 'cover', title: 'Thanksgiving Feast!', sub: 'Catch the pumpkins. Fill the feast!', min: 0.5,
  say: 'Today we make a real game. Chef catches falling pumpkins. Ten catches and the feast is ready!',
  do: 'Students should already have the starter file Thanksgiving_Feast! (1).sb3 on their device (or a shared link). Do not open a new project.' });

add({ type: 'mission', title: 'Today we will make…', min: 1,
  items: [['Chef', 'Chef follows your mouse'], ['pumpkin', 'Pumpkins fall from the sky'], ['score', 'Catch 10. Feast ready!']],
  say: 'Three things: Chef moves with the mouse, pumpkins fall, and we count our catches up to ten.',
  do: 'No code yet. Point at each picture. Ask: “Who has played a catching game?”' });

add({ type: 'routine', title: 'How we build', min: 0.5,
  steps: [['Watch', 'I show you first.'], ['Build', 'Drag the new blocks.'], ['Try', 'Click the green flag!']],
  rule: 'Click the right sprite first!',
  say: 'Every step: first you watch me, then you build, then you try it. Before you drag a block, check: did I click the right sprite?',
  do: 'Practice the thumbs-up signal: thumbs up = it works, hand up = I need help.' });

// ---------- DEMO 1 ----------
add({ type: 'starter', demo: 1, title: 'Open the starter', explain: 'Our pictures are ready. Now we give them instructions.', min: 2,
  done: 'I see Chef, a pumpkin and the kitchen.',
  say: 'Our pictures are ready. Now we give them instructions. Chef, the pumpkin and the kitchen are already here. There is no code yet. Writing the code is our job today!',
  do: 'Open the starter (File › Load from your computer › Thanksgiving_Feast! (1).sb3). Do NOT click File › New and do NOT delete any sprites. Check the sprite list shows Chef and Food, and the code area is empty.',
  watch: 'Started a new project with the Cat? Close it and load the starter file again. A sprite deleted by accident? Edit › Restore Sprite.' });

// ---------- DEMO 2 ----------
add({ type: 'code', demo: 2, title: 'Chef starts at the bottom', explain: 'Green flag starts the game. Go to puts Chef in place.',
  sprite: 'Chef', where: 'Start a new script', cats: ['Events', 'Motion'], min: 3,
  code: 'when green flag clicked\ngo to x: (0) y: (-130)', newBlocks: ['when clicked', 'go to x: 0 y: -130'],
  try: 'Drag Chef away. Click the green flag.', done: 'Chef jumps back to the bottom middle.',
  say: 'The green flag starts the game. Go to puts Chef in the starting spot: x zero is the middle, y minus 130 is near the bottom.',
  do: 'Click Chef in the sprite list. Events: drag “when green flag clicked”. Motion: snap “go to x: y:” under it. Type 0 and -130.',
  watch: 'Numbers already show 0 and -130? That is because Chef is standing there. Keep them. Blocks not snapped (a gap between them)? Drag the bottom block up until it clicks.' });

// ---------- DEMO 3 ----------
add({ type: 'variable', demo: 3, title: 'Make a Score', explain: 'Score counts pumpkins.', sprite: 'Variables', min: 1.5,
  steps: ['Click Variables', 'Make a Variable', 'Type Score', 'For all sprites → OK'],
  done: 'A Score box shows on the stage.',
  say: 'Score counts pumpkins. A variable is a box that remembers a number.',
  do: 'Variables category › Make a Variable › type Score (capital S) › keep “For all sprites” › OK. Keep the checkbox next to Score ticked so the monitor shows on the stage.',
  watch: 'Picked “For this sprite only”? Right-click Score › delete the “Score” variable, then make it again with “For all sprites”. Food must be able to change it later.' });

add({ type: 'code', demo: 3, title: 'New game, zero points!', explain: 'Set Score to 0 starts every game at zero.',
  sprite: 'Chef', where: 'Under go to x: y:', cats: ['Variables'], min: 1.5,
  code: 'when green flag clicked\ngo to x: (0) y: (-130)\nset [Score v] to (0)', newBlocks: ['set Score to 0'],
  try: 'Click the green flag.', done: 'The Score box shows 0.',
  say: 'Score counts pumpkins. New game, zero points!',
  do: 'Still on Chef. Drag “set my variable to 0” — check the menu says Score — and snap it under go to.',
  watch: 'Menu shows a different name? Click the little arrow and pick Score. The value must be 0.' });

// ---------- DEMO 4 ----------
add({ type: 'code', demo: 4, title: 'Keep going: forever', explain: 'Forever means: keep doing it!',
  sprite: 'Chef', where: 'Under set Score to 0', cats: ['Control'], min: 1,
  code: 'set [Score v] to (0)\nforever\nend', newBlocks: ['forever'],
  note: 'Empty for now. We fill it next!',
  say: 'Forever means: keep doing it, again and again, until the game stops.',
  do: 'Control: drag forever and snap it under set Score to 0. The mouth stays empty for one more step.',
  watch: 'Forever placed above set Score? Drag it to the bottom of the stack.' });

add({ type: 'code', demo: 4, title: 'Follow the mouse!', explain: 'X means side to side. Chef follows the mouse.',
  sprite: 'Chef', where: 'Inside forever', cats: ['Motion', 'Sensing'], min: 2,
  code: 'forever\nset x to (mouse x)\nend', newBlocks: ['set x to', 'mouse x'],
  tip: 'Drop mouse x into the white circle.',
  try: 'Click the flag. Move the mouse.', done: 'Chef slides left and right.',
  say: 'X means side to side. Forever means keep following the mouse. We only change x, so Chef stays at the bottom.',
  do: 'Motion: drag “set x to” INSIDE forever. Sensing: drag the round “mouse x” into its white circle.',
  watch: 'Chef flies up and down? They used “go to mouse-pointer” or “set y” — swap it for set x to (mouse x). Chef does not move? mouse x is not inside the circle, or the flag was not clicked.' });

add({ type: 'check', demo: 4, title: 'Chef can move!', shot: 'chef_follow', min: 1,
  checks: ['Click the green flag', 'Move your mouse', 'Chef slides, stays at the bottom'],
  fix: 'Chef jumps up? Use set x, not go to.',
  say: 'Thumbs up if Chef slides side to side and stays on the floor!',
  do: 'Walk the room. Chef script now: when flag clicked › go to x: 0 y: -130 › set Score to 0 › forever { set x to (mouse x) }.',
  truth: 'The pumpkin still sits at the top of the stage: Food has no code yet. That is expected.' });

// ---------- DEMO 5 ----------
add({ type: 'code', demo: 5, title: 'The first pumpkin hides', explain: 'The first pumpkin hides. Its copies will fall.',
  sprite: 'Food', switchSprite: true, where: 'Start a new script', cats: ['Events', 'Looks'], min: 2,
  code: 'when green flag clicked\nhide', newBlocks: ['when clicked', 'hide'],
  try: 'Click the green flag.', done: 'The pumpkin disappears.',
  say: 'Now we switch sprites! Click Food. The first pumpkin hides. It is the pumpkin maker. Its copies will fall.',
  do: 'Everyone click FOOD in the sprite list. Check: Chef’s code disappears from the code area — that is normal, each sprite has its own code. Events: when green flag clicked. Looks: hide.',
  watch: 'Blocks went onto Chef by mistake (Chef vanishes)? Drag the stack onto the Food sprite in the sprite list to copy it, then delete it from Chef.' });

// ---------- DEMO 6 ----------
add({ type: 'code', demo: 6, title: 'Again and again', explain: 'Forever keeps the pumpkin maker going. Wait slows it down.',
  sprite: 'Food', where: 'Under hide', cats: ['Control'], min: 2,
  code: 'hide\nforever\nwait (1) seconds\nend', newBlocks: ['forever', 'wait 1 seconds'],
  say: 'Forever keeps our pumpkin maker going. Wait gives a little pause between pumpkins.',
  do: 'Still on Food. Control: forever under hide, then wait 1 seconds inside forever.',
  watch: 'Wait outside the forever? Drag it into the mouth.' });

add({ type: 'code', demo: 6, title: 'Make a copy!', explain: 'A clone is a copy. Every 1 or 2 seconds, make a new pumpkin.',
  sprite: 'Food', where: 'Inside forever', cats: ['Operators', 'Control'], min: 3,
  code: 'forever\nwait (pick random (1) to (2)) seconds\ncreate clone of (myself v)\nend', newBlocks: ['pick random 1 to 2', 'create clone of myself'],
  tip: 'Pick random goes in the wait circle.',
  try: 'Click the flag. Nothing shows yet!', done: 'No errors. The copies are hiding.',
  say: 'A clone is a copy of our pumpkin. Pick random makes the wait 1 or 2 seconds, a surprise each time.',
  do: 'Operators: drop “pick random 1 to 10” into the wait circle, then change 10 to 2. Control: “create clone of myself” under wait, inside forever.',
  watch: 'Typed 1 to 10? Change the 10 to 2. Create clone outside forever? Only one copy gets made.',
  truth: 'Checkpoint (corrected from the original step): our spawner is ready; next we make the copies visible. Clones copy the hidden original, so NOTHING appears on the stage yet. Tested: after 10 s there were 5–6 hidden copies and 0 visible.' });

// ---------- DEMO 7 ----------
add({ type: 'code', demo: 7, title: 'When I start as a clone', explain: 'Each copy runs this new script. Show makes it appear.',
  sprite: 'Food', where: 'A NEW script on Food', cats: ['Control', 'Looks'], min: 1.5,
  code: 'when I start as a clone\nshow', newBlocks: ['when I start as a clone', 'show'],
  try: 'Click the green flag.', done: 'A pumpkin peeks out at the top.',
  say: 'Every copy runs this new script. Copies start hidden, like the first pumpkin, so show makes them appear.',
  do: 'Still on Food. Drag “when I start as a clone” to an EMPTY spot in the code area (not under the flag script). Looks: show under it.',
  watch: 'Used a second “when green flag clicked” instead? Swap it for “when I start as a clone”. Show missing? Copies stay invisible.',
  truth: 'Copies start where the original is (x 0, y 180), so for now they all stack in the top middle, half off the stage.' });

add({ type: 'code', demo: 7, title: 'A surprise spot', explain: 'Each copy shows up at a surprise spot across the top.',
  sprite: 'Food', where: 'Under show', cats: ['Motion', 'Operators'], min: 2,
  code: 'show\ngo to x: (pick random (-200) to (200)) y: (180)', newBlocks: ['go to x: y: 180', 'pick random -200 to 200'],
  tip: 'Type -200 and 200. Y is 180: the top!',
  say: 'X picks a surprise spot from side to side. Y 180 is the very top of the stage.',
  do: 'Motion: “go to x: y:” under show. Operators: pick random into the x circle. Type -200 and 200. Type 180 for y.',
  watch: 'Pick random dropped in the y circle? Move it to x. Typed 200 into y? The top is 180.' });

add({ type: 'check', demo: 7, title: 'Pumpkins at the top!', shot: 'clones_top', min: 1.5,
  checks: ['Click the green flag', 'Pumpkins pop up at the top', 'Each one in a new spot'],
  fix: 'No pumpkins? Check show is under when I start as a clone.',
  say: 'Thumbs up if pumpkins pop up across the top! They do not fall yet. That is next.',
  do: 'Quick scan for kids with no pumpkins: check “show”, and that the clone hat is “when I start as a clone”.',
  truth: 'Tested: copies appear at y 180 with x between -200 and 200; they stay still until Demo 8.' });

// ---------- DEMO 8 ----------
add({ type: 'code', demo: 8, title: 'Fall until the bottom', explain: 'Repeat until means: keep going until this is true.',
  sprite: 'Food', where: 'Under go to x: y:', cats: ['Control', 'Operators'], min: 2,
  code: 'repeat until <() < (-170)>\nend', newBlocks: ['repeat until', '< -170'],
  map: 'when I start as a clone\nshow\ngo to x: (pick random (-200) to (200)) y: (180)\nrepeat until <() < (-170)>\nend', mapNew: ['repeat until', '< -170'],
  tip: 'Type -170 in the right circle.',
  say: 'Repeat until means: keep going until this is true. We want to stop when the pumpkin is low, near the bottom.',
  do: 'Control: repeat until under go to x: y:. Operators: drop the green “less than” into its pointy slot. Type -170 on the right side.',
  watch: 'Picked the “greater than” or “equals” block? Swap it for the one that shows <. Repeat until placed in the flag script? Move it to the clone script.' });

add({ type: 'code', demo: 8, title: 'How high is it?', explain: 'Y position tells how high the pumpkin is.',
  sprite: 'Food', where: 'Left circle of the < block', cats: ['Motion'], min: 1,
  code: 'repeat until <(y position) < (-170)>\nend', newBlocks: ['y position'],
  tip: 'Scroll down to the end of Motion.',
  say: 'Y position tells how high the pumpkin is. When it is less than -170, the pumpkin is at the bottom.',
  do: 'Motion (bottom of the list): drag “y position” into the LEFT circle of the < block.',
  watch: 'Grabbed x position? It must be y position.' });

add({ type: 'code', demo: 8, title: 'Fall down!', explain: 'Y means up and down. Minus 8 makes food fall.',
  sprite: 'Food', where: 'Inside repeat until', cats: ['Motion'], min: 2, shot: 'falling',
  code: 'repeat until <(y position) < (-170)>\nchange y by (-8)\nend', newBlocks: ['change y by -8'],
  try: 'Click the green flag.', done: 'Pumpkins fall to the bottom.',
  say: 'Y means up and down. Minus 8 makes the food fall a little bit, again and again.',
  do: 'Motion: “change y by” INSIDE repeat until. Type -8 (minus 8).',
  watch: 'Pumpkins go UP? They typed 8, not -8. Pumpkins fall and stay at the bottom? That is correct for now.',
  truth: 'Tested: each copy moves -8 per frame and stops at y -172. Copies stay on the floor and pile up until Demo 11 deletes them.' });

// ---------- DEMO 9 ----------
add({ type: 'code', demo: 9, title: 'Did Chef catch it?', explain: 'If the pumpkin touches Chef…',
  sprite: 'Food', where: 'In repeat until, under change y', cats: ['Control', 'Sensing'], min: 2,
  code: 'change y by (-8)\nif <touching (Chef v)?> then\nend', newBlocks: ['if then', 'touching Chef ?'],
  map: 'repeat until <(y position) < (-170)>\nchange y by (-8)\nif <touching (Chef v)?> then\nend\nend', mapNew: ['if then', 'touching Chef ?'],
  tip: 'Pick Chef in the touching menu.',
  say: '“If” asks a question. Is the pumpkin touching Chef?',
  do: 'Control: “if then” INSIDE repeat until, under change y by -8. Sensing: “touching mouse-pointer?” into the if, then pick Chef from its menu.',
  watch: 'If placed under the loop (outside it)? Drag it inside, under change y. Menu still says mouse-pointer? Pick Chef.' });

add({ type: 'code', demo: 9, title: 'Score a point!', explain: 'If the pumpkin touches Chef, we get a point.',
  sprite: 'Food', where: 'Inside the if', cats: ['Variables'], min: 2,
  code: 'if <touching (Chef v)?> then\nchange [Score v] by (1)\nend', newBlocks: ['change Score by 1'],
  try: 'Catch a pumpkin.', done: 'Score goes up!',
  say: 'If the pumpkin touches Chef, we get a point. It starts counting catches; we will make each pumpkin count once in Demo 11.',
  do: 'Variables: “change my variable by 1” INSIDE the if. Pick Score in its menu.',
  watch: 'Score did not move? Check the menu says Score and the if says touching Chef.',
  truth: 'Expected for now: one pumpkin adds MANY points (tested: 13 points from a single pumpkin), because it keeps touching Chef while it falls through. Demo 11 fixes this. Do not promise “one point per pumpkin” yet.' });

add({ type: 'check', demo: 9, title: 'Catch!', shot: 'catch', min: 1,
  checks: ['Move Chef under a pumpkin', 'Score goes up', 'Big jumps are OK for now'],
  fix: 'No points? Check touching says Chef.',
  say: 'Catch a pumpkin. Does Score go up? It jumps a lot, because the pumpkin keeps touching Chef. We fix that in Demo 11.',
  do: 'Celebrate any score going up. Point out the pumpkin falls right through Chef: that is the clue for Demo 11.',
  truth: 'Before Demo 11 a single pumpkin can add 10+ points.' });

// ---------- DEMO 10 ----------
add({ type: 'code', demo: 10, title: 'Ten catches yet?', explain: 'More than 9 means we have 10!',
  sprite: 'Food', where: 'In the catch if, under change Score', cats: ['Control', 'Operators', 'Variables'], min: 2,
  code: 'change [Score v] by (1)\nif <(Score) > (9)> then\nend', newBlocks: ['if then', '> 9', 'Score'],
  map: 'if <touching (Chef v)?> then\nchange [Score v] by (1)\nif <(Score) > (9)> then\nend\nend', mapNew: ['if then@2', '> 9', 'Score'],
  tip: 'Use > (more than), not =.',
  say: 'More than 9 means we have 10 or more. Ten catches means the feast is ready!',
  do: 'Control: a second “if then” under change Score by 1, still inside the touching if. Operators: the “greater than” block into it. Variables: the round Score into the left side. Type 9 on the right.',
  watch: 'Used “= 10”? Swap it for “> 9”. Put the new if outside the touching if? Drag it back inside, under change Score.' });

add({ type: 'code', demo: 10, title: 'Feast Ready!', explain: 'Ten catches means the feast is ready!',
  sprite: 'Food', where: 'Inside the Score > 9 if', cats: ['Looks', 'Control'], min: 2,
  code: 'if <(Score) > (9)> then\nsay [Feast Ready!] for (2) seconds\nstop [all v]\nend', newBlocks: ['say Feast Ready! for 2 seconds', 'stop all'],
  shot: 'feast_ready',
  try: 'Catch pumpkins.', done: '“Feast Ready!” pops up. The game stops.',
  say: 'Ten catches means the feast is ready! The pumpkin says Feast Ready! and then stop all ends the game.',
  do: 'Looks: “say Hello! for 2 seconds” inside the Score > 9 if; type Feast Ready!. Control: “stop all” under it.',
  watch: 'Picked “say” without “for 2 seconds”? The game would stop with no time to read. Use the one with seconds.',
  truth: 'This script belongs to a Food clone, so the “Feast Ready!” bubble appears on the PUMPKIN, not on Chef (tested). Do not add a broadcast. Before Demo 11 one catch can pass 9 points by itself, so Feast Ready! may appear on the very first catch.' });

// ---------- DEMO 11 ----------
add({ type: 'place', demo: 11, title: 'Clean up a catch', explain: 'Delete means the copy goes away.',
  sprite: 'Food', where: 'Inside the touching if, AFTER the Score > 9 if', cats: ['Control'], min: 2,
  block: 'delete this clone',
  map: 'if <touching (Chef v)?> then\nchange [Score v] by (1)\nif <(Score) > (9)> then\nsay [Feast Ready!] for (2) seconds\nstop [all v]\nend\ndelete this clone\nend', mapNew: ['delete this clone'],
  tip: 'Under the Score > 9 if. Not inside it!',
  say: 'Delete means the copy goes away. A caught pumpkin disappears, so it can only give one point.',
  do: 'Control (bottom of the list): “delete this clone” under the whole Score > 9 if, still inside the touching if. Point at the gap between the two bottom arms.',
  watch: 'Dropped inside the Score > 9 if (under stop all)? It will not snap there; stop all has no bottom bump. Dropped under the touching if? Move it up inside.',
  truth: 'The winning catch ends at stop all, so it never needs to reach delete this clone.' });

add({ type: 'place', demo: 11, title: 'Clean up a miss', explain: 'Pumpkins that reach the bottom go away too.',
  sprite: 'Food', where: 'At the very bottom, AFTER repeat until', cats: ['Control'], min: 2,
  block: 'delete this clone',
  map: 'repeat until <(y position) < (-170)>\nchange y by (-8)\nif <touching (Chef v)?> then\nchange [Score v] by (1)\nif <(Score) > (9)> then\nsay [Feast Ready!] for (2) seconds\nstop [all v]\nend\ndelete this clone\nend\nend\ndelete this clone', mapNew: ['delete this clone@2'],
  tip: 'The very last block. Outside the loop!',
  say: 'We clean up catches AND misses! A pumpkin that reaches the floor goes away too.',
  do: 'Control: a second “delete this clone” at the very bottom of the clone script, under the repeat until’s bottom arm.',
  watch: 'Dropped inside repeat until? The pumpkin vanishes right away after one step. Drag it below the loop.' });

add({ type: 'check', demo: 11, title: 'Play the whole game!', shot: 'feast_ready', min: 1, final: true,
  checks: ['Caught pumpkins vanish', 'Each catch: +1 point', 'Missed pumpkins vanish', 'At 10: Feast Ready!'],
  fix: 'Pumpkins pile up? Check the last delete.',
  say: 'Play! Each catch adds one point. Ten catches: Feast Ready!',
  do: 'Final check of the Food clone script against the Teacher Guide. Hands up for help; thumbs up when you hit 10.',
  truth: 'Tested in the Scratch engine: Score equals pumpkins caught (+1 each); missed pumpkins are deleted at the floor (never more than 2 copies on stage); at 10 the pumpkin says Feast Ready! for 2 s, then stop all. The game keeps running during those 2 s, so a quick player can reach 11 before it stops.' });

add({ type: 'finish', title: 'Feast ready!', sub: 'You coded a real game.', min: 3,
  items: ['Play 3 rounds', 'Save: File › Save to your computer', 'Show a friend'],
  say: 'You made a real game! Chef moves, pumpkins fall, and you counted to ten. Give yourself a big cheer!',
  do: 'Final playtest and save. If time is short, skip the extra rounds: a saved, working game comes first. No new code today.' });

module.exports = S;
