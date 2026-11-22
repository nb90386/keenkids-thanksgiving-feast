# KeenKids Thanksgiving Feast: Teacher Guide (Grades 1–2)

**Class length:** 48 minutes · **Students:** grades 1–2, each on their own device · **Deck:** `KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx` (28 slides, speaker notes on every slide)

Students start from the **Thanksgiving_Feast! (1).sb3** starter. It already has the Feast Kitchen backdrop, a **Chef** sprite and a **Food** sprite (pumpkin costume), and **no code at all**. In 11 demonstrations they build a catch-the-pumpkin game. Chef follows the mouse, pumpkins fall, each catch adds 1 point, and at 10 points the pumpkin says “Feast Ready!” and the game stops.

## Before class

- Put `Thanksgiving_Feast! (1).sb3` where every device can open it (shared drive, downloads folder or LMS). Students load it with **File › Load from your computer**. Do **not** start a new project.
- Keep `KeenKids_Thanksgiving_Feast_Completed_Teacher.sb3` open on your machine as a working answer key. It was built from the starter and tested in the Scratch engine (see QA Report).
- Teach the signals: **thumbs up** = it works, **hand up** = I need help.
- Every coding slide shows **who to click** (big chip, top left), **where the blocks go** (“PUT IT”), which palette categories to open (coloured dots), the **new blocks in full colour**, and blocks that are already there **faded**.

## The routine on every step

**WATCH** (you model on the projector) → **BUILD** (kids drag the 1–3 new blocks) → **TRY** (kids click the green flag / move the mouse). Before any drag, ask: *“Which sprite did we click?”*

## 48-minute cue sheet

| Segment | Min | Clock | Slides |
|---|---|---|---|
| Opening / what we are making | 2 | 0:00–2:00 | 1–3 |
| Demo 1: Open the starter | 2 | 2:00–4:00 | 4 |
| Demo 2: Chef starts at the bottom | 3 | 4:00–7:00 | 5 |
| Demo 3: Score! | 3 | 7:00–10:00 | 6–7 |
| Demo 4: Follow the mouse! | 4 | 10:00–14:00 | 8–10 |
| Demo 5: The spawner hides | 2 | 14:00–16:00 | 11 |
| Demo 6: Make clones! | 5 | 16:00–21:00 | 12–13 |
| Demo 7: Clones appear at the top | 5 | 21:00–26:00 | 14–16 |
| Demo 8: Fall! | 5 | 26:00–31:00 | 17–19 |
| Demo 9: Catch! Score +1 | 5 | 31:00–36:00 | 20–22 |
| Demo 10: Win at 10! | 4 | 36:00–40:00 | 23–24 |
| Demo 11: Delete every clone! | 5 | 40:00–45:00 | 25–27 |
| Final playtest / celebrate | 3 | 45:00–48:00 | 28 |
| **Total** | **48** | | |

If time runs short, cut talk, not code. A finished, working game matters more than the final cheer. There is **no student-facing bonus coding** in this lesson; early finishers play-test, then help a neighbour by pointing, not by touching their mouse.

## Demo by demo

### Demo 1: Open the starter (2 min · slides 4)

**Slide 4: Open the starter**

- **Say:** Our pictures are ready. Now we give them instructions. Chef, the pumpkin and the kitchen are already here. There is no code yet. Writing the code is our job today!
- **Do:** Open the starter (File › Load from your computer › Thanksgiving_Feast! (1).sb3). Do NOT click File › New and do NOT delete any sprites. Check the sprite list shows Chef and Food, and the code area is empty.
- **Done when:** I see Chef, a pumpkin and the kitchen.
- **Common error → quick fix:** Started a new project with the Cat? Close it and load the starter file again. A sprite deleted by accident? Edit › Restore Sprite.

### Demo 2: Chef starts at the bottom (3 min · slides 5)

**Slide 5: Chef starts at the bottom** · Click **Chef** · Put it: *Start a new script*

New blocks (2): `when green flag clicked`, `go to x: 0 y: -130`

On the slide (faded lines are already in the project):

```
when green flag clicked
go to x: (0) y: (-130)
```

- **Say:** The green flag starts the game. Go to puts Chef in the starting spot: x zero is the middle, y minus 130 is near the bottom.
- **Do:** Click Chef in the sprite list. Events: drag “when green flag clicked”. Motion: snap “go to x: y:” under it. Type 0 and -130.
- **Try it:** Drag Chef away. Click the green flag. **Done when:** Chef jumps back to the bottom middle.
- **Common error → quick fix:** Numbers already show 0 and -130? That is because Chef is standing there. Keep them. Blocks not snapped (a gap between them)? Drag the bottom block up until it clicks.

<details><summary>Full code after Demo 2 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
```

</details>

### Demo 3: Score! (3 min · slides 6–7)

**Slide 6: Make a Score** · Click **Variables**

- **Say:** Score counts pumpkins. A variable is a box that remembers a number.
- **Do:** Variables category › Make a Variable › type Score (capital S) › keep “For all sprites” › OK. Keep the checkbox next to Score ticked so the monitor shows on the stage.
- **Done when:** A Score box shows on the stage.
- **Common error → quick fix:** Picked “For this sprite only”? Right-click Score › delete the “Score” variable, then make it again with “For all sprites”. Food must be able to change it later.

**Slide 7: New game, zero points!** · Click **Chef** · Put it: *Under go to x: y:*

New blocks (1): `set Score to 0`

On the slide (faded lines are already in the project):

```
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
```

- **Say:** Score counts pumpkins. New game, zero points!
- **Do:** Still on Chef. Drag “set my variable to 0” — check the menu says Score — and snap it under go to.
- **Try it:** Click the green flag. **Done when:** The Score box shows 0.
- **Common error → quick fix:** Menu shows a different name? Click the little arrow and pick Score. The value must be 0.

<details><summary>Full code after Demo 3 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
```

</details>

### Demo 4: Follow the mouse! (4 min · slides 8–10)

**Slide 8: Keep going: forever** · Click **Chef** · Put it: *Under set Score to 0*

New blocks (1): `forever`

On the slide (faded lines are already in the project):

```
set [Score ▾] to (0)
forever
end
```

- **Say:** Forever means: keep doing it, again and again, until the game stops.
- **Do:** Control: drag forever and snap it under set Score to 0. The mouth stays empty for one more step.
- **Common error → quick fix:** Forever placed above set Score? Drag it to the bottom of the stack.

**Slide 9: Follow the mouse!** · Click **Chef** · Put it: *Inside forever*

New blocks (2): `set x to`, `mouse x`

On the slide (faded lines are already in the project):

```
forever
set x to (mouse x)
end
```

- **Say:** X means side to side. Forever means keep following the mouse. We only change x, so Chef stays at the bottom.
- **Do:** Motion: drag “set x to” INSIDE forever. Sensing: drag the round “mouse x” into its white circle.
- **Try it:** Click the flag. Move the mouse. **Done when:** Chef slides left and right.
- **Common error → quick fix:** Chef flies up and down? They used “go to mouse-pointer” or “set y” — swap it for set x to (mouse x). Chef does not move? mouse x is not inside the circle, or the flag was not clicked.

**Slide 10: Chef can move!**

- **Say:** Thumbs up if Chef slides side to side and stays on the floor!
- **Do:** Walk the room. Chef script now: when flag clicked › go to x: 0 y: -130 › set Score to 0 › forever { set x to (mouse x) }.
- **Checklist:** Click the green flag · Move your mouse · Chef slides, stays at the bottom
- **Stuck?** Chef jumps up? Use set x, not go to.
- **Teacher note:** The pumpkin still sits at the top of the stage: Food has no code yet. That is expected.

<details><summary>Full code after Demo 4 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end
```

</details>

### Demo 5: The spawner hides (2 min · slides 11)

**Slide 11: The first pumpkin hides** · Click **Food** · Put it: *Start a new script*

New blocks (2): `when green flag clicked`, `hide`

On the slide (faded lines are already in the project):

```
when green flag clicked
hide
```

- **Say:** Now we switch sprites! Click Food. The first pumpkin hides. It is the pumpkin maker. Its copies will fall.
- **Do:** Everyone click FOOD in the sprite list. Check: Chef’s code disappears from the code area — that is normal, each sprite has its own code. Events: when green flag clicked. Looks: hide.
- **Try it:** Click the green flag. **Done when:** The pumpkin disappears.
- **Common error → quick fix:** Blocks went onto Chef by mistake (Chef vanishes)? Drag the stack onto the Food sprite in the sprite list to copy it, then delete it from Chef.

<details><summary>Full code after Demo 5 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
```

</details>

### Demo 6: Make clones! (5 min · slides 12–13)

**Slide 12: Again and again** · Click **Food** · Put it: *Under hide*

New blocks (2): `forever`, `wait 1 seconds`

On the slide (faded lines are already in the project):

```
hide
forever
wait (1) seconds
end
```

- **Say:** Forever keeps our pumpkin maker going. Wait gives a little pause between pumpkins.
- **Do:** Still on Food. Control: forever under hide, then wait 1 seconds inside forever.
- **Common error → quick fix:** Wait outside the forever? Drag it into the mouth.

**Slide 13: Make a copy!** · Click **Food** · Put it: *Inside forever*

New blocks (2): `pick random 1 to 2`, `create clone of myself`

On the slide (faded lines are already in the project):

```
forever
wait (pick random (1) to (2)) seconds
create clone of [myself ▾]
end
```

- **Say:** A clone is a copy of our pumpkin. Pick random makes the wait 1 or 2 seconds, a surprise each time.
- **Do:** Operators: drop “pick random 1 to 10” into the wait circle, then change 10 to 2. Control: “create clone of myself” under wait, inside forever.
- **Try it:** Click the flag. Nothing shows yet! **Done when:** No errors. The copies are hiding.
- **Common error → quick fix:** Typed 1 to 10? Change the 10 to 2. Create clone outside forever? Only one copy gets made.
- **Teacher note:** Checkpoint (corrected from the original step): our spawner is ready; next we make the copies visible. Clones copy the hidden original, so NOTHING appears on the stage yet. Tested: after 10 s there were 5–6 hidden copies and 0 visible.

<details><summary>Full code after Demo 6 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end
```

</details>

### Demo 7: Clones appear at the top (5 min · slides 14–16)

**Slide 14: When I start as a clone** · Click **Food** · Put it: *A NEW script on Food*

New blocks (2): `when I start as a clone`, `show`

On the slide (faded lines are already in the project):

```
when I start as a clone
show
```

- **Say:** Every copy runs this new script. Copies start hidden, like the first pumpkin, so show makes them appear.
- **Do:** Still on Food. Drag “when I start as a clone” to an EMPTY spot in the code area (not under the flag script). Looks: show under it.
- **Try it:** Click the green flag. **Done when:** A pumpkin peeks out at the top.
- **Common error → quick fix:** Used a second “when green flag clicked” instead? Swap it for “when I start as a clone”. Show missing? Copies stay invisible.
- **Teacher note:** Copies start where the original is (x 0, y 180), so for now they all stack in the top middle, half off the stage.

**Slide 15: A surprise spot** · Click **Food** · Put it: *Under show*

New blocks (2): `go to x: y: 180`, `pick random -200 to 200`

On the slide (faded lines are already in the project):

```
show
go to x: (pick random (-200) to (200)) y: (180)
```

- **Say:** X picks a surprise spot from side to side. Y 180 is the very top of the stage.
- **Do:** Motion: “go to x: y:” under show. Operators: pick random into the x circle. Type -200 and 200. Type 180 for y.
- **Common error → quick fix:** Pick random dropped in the y circle? Move it to x. Typed 200 into y? The top is 180.

**Slide 16: Pumpkins at the top!**

- **Say:** Thumbs up if pumpkins pop up across the top! They do not fall yet. That is next.
- **Do:** Quick scan for kids with no pumpkins: check “show”, and that the clone hat is “when I start as a clone”.
- **Checklist:** Click the green flag · Pumpkins pop up at the top · Each one in a new spot
- **Stuck?** No pumpkins? Check show is under when I start as a clone.
- **Teacher note:** Tested: copies appear at y 180 with x between -200 and 200; they stay still until Demo 8.

<details><summary>Full code after Demo 7 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
```

</details>

### Demo 8: Fall! (5 min · slides 17–19)

**Slide 17: Fall until the bottom** · Click **Food** · Put it: *Under go to x: y:*

New blocks (2): `repeat until`, `< -170`

On the slide (faded lines are already in the project):

```
repeat until <() < (-170)>
end
```

- **Say:** Repeat until means: keep going until this is true. We want to stop when the pumpkin is low, near the bottom.
- **Do:** Control: repeat until under go to x: y:. Operators: drop the green “less than” into its pointy slot. Type -170 on the right side.
- **Common error → quick fix:** Picked the “greater than” or “equals” block? Swap it for the one that shows <. Repeat until placed in the flag script? Move it to the clone script.

**Slide 18: How high is it?** · Click **Food** · Put it: *Left circle of the < block*

New blocks (1): `y position`

On the slide (faded lines are already in the project):

```
repeat until <(y position) < (-170)>
end
```

- **Say:** Y position tells how high the pumpkin is. When it is less than -170, the pumpkin is at the bottom.
- **Do:** Motion (bottom of the list): drag “y position” into the LEFT circle of the < block.
- **Common error → quick fix:** Grabbed x position? It must be y position.

**Slide 19: Fall down!** · Click **Food** · Put it: *Inside repeat until*

New blocks (1): `change y by -8`

On the slide (faded lines are already in the project):

```
repeat until <(y position) < (-170)>
change y by (-8)
end
```

- **Say:** Y means up and down. Minus 8 makes the food fall a little bit, again and again.
- **Do:** Motion: “change y by” INSIDE repeat until. Type -8 (minus 8).
- **Try it:** Click the green flag. **Done when:** Pumpkins fall to the bottom.
- **Common error → quick fix:** Pumpkins go UP? They typed 8, not -8. Pumpkins fall and stay at the bottom? That is correct for now.
- **Teacher note:** Tested: each copy moves -8 per frame and stops at y -172. Copies stay on the floor and pile up until Demo 11 deletes them.

<details><summary>Full code after Demo 8 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
repeat until <(y position) < (-170)>
  change y by (-8)
end
```

</details>

### Demo 9: Catch! Score +1 (5 min · slides 20–22)

**Slide 20: Did Chef catch it?** · Click **Food** · Put it: *In repeat until, under change y*

New blocks (2): `if then`, `touching Chef?`

On the slide (faded lines are already in the project):

```
change y by (-8)
if <touching [Chef ▾]?> then
end
```

- **Say:** “If” asks a question. Is the pumpkin touching Chef?
- **Do:** Control: “if then” INSIDE repeat until, under change y by -8. Sensing: “touching mouse-pointer?” into the if, then pick Chef from its menu.
- **Common error → quick fix:** If placed under the loop (outside it)? Drag it inside, under change y. Menu still says mouse-pointer? Pick Chef.

**Slide 21: Score a point!** · Click **Food** · Put it: *Inside the if*

New blocks (1): `change Score by 1`

On the slide (faded lines are already in the project):

```
if <touching [Chef ▾]?> then
change [Score ▾] by (1)
end
```

- **Say:** If the pumpkin touches Chef, we get a point. It starts counting catches; we will make each pumpkin count once in Demo 11.
- **Do:** Variables: “change my variable by 1” INSIDE the if. Pick Score in its menu.
- **Try it:** Catch a pumpkin. **Done when:** Score goes up!
- **Common error → quick fix:** Score did not move? Check the menu says Score and the if says touching Chef.
- **Teacher note:** Expected for now: one pumpkin adds MANY points (tested: 13 points from a single pumpkin), because it keeps touching Chef while it falls through. Demo 11 fixes this. Do not promise “one point per pumpkin” yet.

**Slide 22: Catch!**

- **Say:** Catch a pumpkin. Does Score go up? It jumps a lot, because the pumpkin keeps touching Chef. We fix that in Demo 11.
- **Do:** Celebrate any score going up. Point out the pumpkin falls right through Chef: that is the clue for Demo 11.
- **Checklist:** Move Chef under a pumpkin · Score goes up · Big jumps are OK for now
- **Stuck?** No points? Check touching says Chef.
- **Teacher note:** Before Demo 11 a single pumpkin can add 10+ points.

<details><summary>Full code after Demo 9 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
repeat until <(y position) < (-170)>
  change y by (-8)
  if <touching [Chef ▾]?> then
    change [Score ▾] by (1)
  end
end
```

</details>

### Demo 10: Win at 10! (4 min · slides 23–24)

**Slide 23: Ten catches yet?** · Click **Food** · Put it: *In the catch if, under change Score*

New blocks (3): `if then`, `> 9`, `Score`

On the slide (faded lines are already in the project):

```
change [Score ▾] by (1)
if <(Score) > (9)> then
end
```

- **Say:** More than 9 means we have 10 or more. Ten catches means the feast is ready!
- **Do:** Control: a second “if then” under change Score by 1, still inside the touching if. Operators: the “greater than” block into it. Variables: the round Score into the left side. Type 9 on the right.
- **Common error → quick fix:** Used “= 10”? Swap it for “> 9”. Put the new if outside the touching if? Drag it back inside, under change Score.

**Slide 24: Feast Ready!** · Click **Food** · Put it: *Inside the Score > 9 if*

New blocks (2): `say Feast Ready! for 2 seconds`, `stop all`

On the slide (faded lines are already in the project):

```
if <(Score) > (9)> then
say [Feast Ready!] for (2) seconds
stop [all ▾]
end
```

- **Say:** Ten catches means the feast is ready! The pumpkin says Feast Ready! and then stop all ends the game.
- **Do:** Looks: “say Hello! for 2 seconds” inside the Score > 9 if; type Feast Ready!. Control: “stop all” under it.
- **Try it:** Catch pumpkins. **Done when:** “Feast Ready!” pops up. The game stops.
- **Common error → quick fix:** Picked “say” without “for 2 seconds”? The game would stop with no time to read. Use the one with seconds.
- **Teacher note:** This script belongs to a Food clone, so the “Feast Ready!” bubble appears on the PUMPKIN, not on Chef (tested). Do not add a broadcast. Before Demo 11 one catch can pass 9 points by itself, so Feast Ready! may appear on the very first catch.

<details><summary>Full code after Demo 10 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
repeat until <(y position) < (-170)>
  change y by (-8)
  if <touching [Chef ▾]?> then
    change [Score ▾] by (1)
    if <(Score) > (9)> then
      say [Feast Ready!] for (2) seconds
      stop [all ▾]
    end
  end
end
```

</details>

### Demo 11: Delete every clone! (5 min · slides 25–27)

**Slide 25: Clean up a catch** · Click **Food** · Put it: *Inside the touching if, AFTER the Score > 9 if*

New blocks (1): `delete this clone`

Where it goes:

```
if <touching [Chef ▾]?> then
change [Score ▾] by (1)
if <(Score) > (9)> then
say [Feast Ready!] for (2) seconds
stop [all ▾]
end
delete this clone
end
```

- **Say:** Delete means the copy goes away. A caught pumpkin disappears, so it can only give one point.
- **Do:** Control (bottom of the list): “delete this clone” under the whole Score > 9 if, still inside the touching if. Point at the gap between the two bottom arms.
- **Common error → quick fix:** Dropped inside the Score > 9 if (under stop all)? It will not snap there; stop all has no bottom bump. Dropped under the touching if? Move it up inside.
- **Teacher note:** The winning catch ends at stop all, so it never needs to reach delete this clone.

**Slide 26: Clean up a miss** · Click **Food** · Put it: *At the very bottom, AFTER repeat until*

New blocks (1): `delete this clone`

Where it goes:

```
repeat until <(y position) < (-170)>
change y by (-8)
if <touching [Chef ▾]?> then
change [Score ▾] by (1)
if <(Score) > (9)> then
say [Feast Ready!] for (2) seconds
stop [all ▾]
end
delete this clone
end
end
delete this clone
```

- **Say:** We clean up catches AND misses! A pumpkin that reaches the floor goes away too.
- **Do:** Control: a second “delete this clone” at the very bottom of the clone script, under the repeat until’s bottom arm.
- **Common error → quick fix:** Dropped inside repeat until? The pumpkin vanishes right away after one step. Drag it below the loop.

**Slide 27: Play the whole game!**

- **Say:** Play! Each catch adds one point. Ten catches: Feast Ready!
- **Do:** Final check of the Food clone script against the Teacher Guide. Hands up for help; thumbs up when you hit 10.
- **Checklist:** Caught pumpkins vanish · Each catch: +1 point · Missed pumpkins vanish · At 10: Feast Ready!
- **Stuck?** Pumpkins pile up? Check the last delete.
- **Teacher note:** Tested in the Scratch engine: Score equals pumpkins caught (+1 each); missed pumpkins are deleted at the floor (never more than 2 copies on stage); at 10 the pumpkin says Feast Ready! for 2 s, then stop all. The game keeps running during those 2 s, so a quick player can reach 11 before it stops.

<details><summary>Full code after Demo 11 (teacher only)</summary>

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
repeat until <(y position) < (-170)>
  change y by (-8)
  if <touching [Chef ▾]?> then
    change [Score ▾] by (1)
    if <(Score) > (9)> then
      say [Feast Ready!] for (2) seconds
      stop [all ▾]
    end
    delete this clone
  end
end
delete this clone
```

</details>

## Key caveats (read before teaching)

- **Demo 6: nothing appears yet.** Clones copy the hidden original, so after Demo 6 the stage stays empty. The original step text said new pumpkins appear here; the corrected checkpoint is *“Our spawner is ready; next we make the copies visible.”* Visible pumpkins arrive in Demo 7 with `show`. Tested: 5–6 hidden copies after 10 s, 0 visible.
- **Demo 7: clones need their own hat.** It must be `when I start as a clone`, not a second green flag. Right after slide 14 (before the `go to`), every copy appears in the same spot, top middle, half off the stage.
- **Demo 8: pumpkins pile up.** Until Demo 11 the copies stop just below y = -170 (tested: they stop at -172) and stay on the floor.
- **Demo 9: one pumpkin gives many points.** The `if touching Chef` check runs every frame while the pumpkin falls through Chef. Tested: **13 points from one pumpkin**. Say *“It starts counting catches; we’ll make each pumpkin count once in Demo 11.”* Do not promise one point per pumpkin yet.
- **Demo 10: the pumpkin talks, not Chef.** The win check runs inside a Food clone, so “Feast Ready!” appears on the **pumpkin** (tested). The lesson uses the exact prescribed code; no broadcast is added. Because of the Demo 9 behaviour, the first catch alone can pass 9 points, so “Feast Ready!” may appear on the first catch until Demo 11. Use `Score > 9`, not `Score = 10`.
- **Demo 11: two deletes, two places.** (A) inside the touching-if, *after* the whole `if Score > 9` block, and (B) after the `repeat until` loop. `stop all` is a cap block (nothing snaps under it), so the winning catch ends there. Tested after Demo 11: Score equals pumpkins caught, missed pumpkins vanish at the floor, never more than 2 copies on stage.
- **Win timing:** “Feast Ready!” shows for 2 seconds while the game keeps running, then `stop all`. A quick player can catch one more pumpkin in those 2 seconds (Score 11). This is how the prescribed code behaves.

## Common errors and quick fixes

| Symptom | Likely cause | Quick fix |
|---|---|---|
| Blocks “disappeared” | A different sprite is selected | Click the sprite named on the slide’s chip; each sprite has its own code |
| Chef moves up and down | Used `go to mouse-pointer` or `set y` | Use `set x to (mouse x)` only |
| Nothing happens on flag | Hat block missing or blocks not snapped | Snap under `when green flag clicked`; look for gaps |
| Pumpkin never hides | `hide` went onto Chef | Click Food; move the script there |
| No pumpkins after Demo 7 | No `show`, or a second green flag instead of `when I start as a clone` | Fix the clone hat; add `show` |
| Pumpkins float up | Typed `8` instead of `-8` | Change y by **-8** |
| Pumpkins vanish instantly | `delete this clone` placed inside the loop above `change y` | Move it to the very bottom, after the loop |
| Score never changes | Menu still says `my variable` / `mouse-pointer` | Pick **Score** / **Chef** in the menus |
| Score not shared | Variable made “For this sprite only” | Delete it and remake **Score** “For all sprites” |
| Game never ends | Used `= 10` or `if` outside the touching-if | Use `Score > 9` inside the touching-if |

## Complete final code (teacher only)

```
[Chef]
when green flag clicked
go to x: (0) y: (-130)
set [Score ▾] to (0)
forever
  set x to (mouse x)
end

[Food]
when green flag clicked
hide
forever
  wait (pick random (1) to (2)) seconds
  create clone of [myself ▾]
end

[Food]
when I start as a clone
show
go to x: (pick random (-200) to (200)) y: (180)
repeat until <(y position) < (-170)>
  change y by (-8)
  if <touching [Chef ▾]?> then
    change [Score ▾] by (1)
    if <(Score) > (9)> then
      say [Feast Ready!] for (2) seconds
      stop [all ▾]
    end
    delete this clone
  end
end
delete this clone
```

## Slide-by-slide teaching script

1. **Thanksgiving Feast!** (0.5 min, 0:00): Today we make a real game. Chef catches falling pumpkins. Ten catches and the feast is ready!
2. **Today we will make…** (1 min, 0:30): Three things: Chef moves with the mouse, pumpkins fall, and we count our catches up to ten.
3. **How we build** (0.5 min, 1:30): Every step: first you watch me, then you build, then you try it. Before you drag a block, check: did I click the right sprite?
4. **Open the starter** (2 min, 2:00): Our pictures are ready. Now we give them instructions. Chef, the pumpkin and the kitchen are already here. There is no code yet. Writing the code is our job today!
5. **Chef starts at the bottom** (3 min, 4:00): The green flag starts the game. Go to puts Chef in the starting spot: x zero is the middle, y minus 130 is near the bottom.
6. **Make a Score** (1.5 min, 7:00): Score counts pumpkins. A variable is a box that remembers a number.
7. **New game, zero points!** (1.5 min, 8:30): Score counts pumpkins. New game, zero points!
8. **Keep going: forever** (1 min, 10:00): Forever means: keep doing it, again and again, until the game stops.
9. **Follow the mouse!** (2 min, 11:00): X means side to side. Forever means keep following the mouse. We only change x, so Chef stays at the bottom.
10. **Chef can move!** (1 min, 13:00): Thumbs up if Chef slides side to side and stays on the floor!
11. **The first pumpkin hides** (2 min, 14:00): Now we switch sprites! Click Food. The first pumpkin hides. It is the pumpkin maker. Its copies will fall.
12. **Again and again** (2 min, 16:00): Forever keeps our pumpkin maker going. Wait gives a little pause between pumpkins.
13. **Make a copy!** (3 min, 18:00): A clone is a copy of our pumpkin. Pick random makes the wait 1 or 2 seconds, a surprise each time.
14. **When I start as a clone** (1.5 min, 21:00): Every copy runs this new script. Copies start hidden, like the first pumpkin, so show makes them appear.
15. **A surprise spot** (2 min, 22:30): X picks a surprise spot from side to side. Y 180 is the very top of the stage.
16. **Pumpkins at the top!** (1.5 min, 24:30): Thumbs up if pumpkins pop up across the top! They do not fall yet. That is next.
17. **Fall until the bottom** (2 min, 26:00): Repeat until means: keep going until this is true. We want to stop when the pumpkin is low, near the bottom.
18. **How high is it?** (1 min, 28:00): Y position tells how high the pumpkin is. When it is less than -170, the pumpkin is at the bottom.
19. **Fall down!** (2 min, 29:00): Y means up and down. Minus 8 makes the food fall a little bit, again and again.
20. **Did Chef catch it?** (2 min, 31:00): “If” asks a question. Is the pumpkin touching Chef?
21. **Score a point!** (2 min, 33:00): If the pumpkin touches Chef, we get a point. It starts counting catches; we will make each pumpkin count once in Demo 11.
22. **Catch!** (1 min, 35:00): Catch a pumpkin. Does Score go up? It jumps a lot, because the pumpkin keeps touching Chef. We fix that in Demo 11.
23. **Ten catches yet?** (2 min, 36:00): More than 9 means we have 10 or more. Ten catches means the feast is ready!
24. **Feast Ready!** (2 min, 38:00): Ten catches means the feast is ready! The pumpkin says Feast Ready! and then stop all ends the game.
25. **Clean up a catch** (2 min, 40:00): Delete means the copy goes away. A caught pumpkin disappears, so it can only give one point.
26. **Clean up a miss** (2 min, 42:00): We clean up catches AND misses! A pumpkin that reaches the floor goes away too.
27. **Play the whole game!** (1 min, 44:00): Play! Each catch adds one point. Ten catches: Feast Ready!
28. **Feast ready!** (3 min, 45:00): You made a real game! Chef moves, pumpkins fall, and you counted to ten. Give yourself a big cheer!
