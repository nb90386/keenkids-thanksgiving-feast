#!/bin/zsh
# Full rebuild: sb3 states → gameplay tests + engine screenshots → assets → blocks → slides (PNG/PDF/QA) → PPTX → code verification → docs.
# Chromium steps must run outside the macOS sandbox (mach-port restriction).
set -e
cd "$(dirname "$0")"
OUT=../output; QA=../qa
mkdir -p $OUT $QA render
node build_sb3.js
(cd gameplay && rm -f shots/shots.json && node run_tests.js)
node assets.js
node render_blocks.js
node render_html.js $QA/render
node build_pptx.js $OUT/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx
cp $QA/render/deck.pdf $OUT/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pdf
cp $QA/render/contact_sheet.png $QA/KeenKids_Thanksgiving_Feast_Contact_Sheet.png
rm -rf $QA/slides && cp -R $QA/render/png $QA/slides
node verify_code.js > /dev/null
rm -rf $OUT/fonts && mkdir -p $OUT/fonts && cp fonts/static/*.ttf fonts/OFL-*.txt $OUT/fonts/
node check_outputs.js $OUT > /dev/null
node gen_docs.js
echo "build complete"
