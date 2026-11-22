#!/bin/zsh
# Fast rebuild after content/layout edits (skips sb3 build, gameplay tests and asset rendering).
set -e
cd "$(dirname "$0")"
OUT=../output; QA=../qa
node render_blocks.js
node render_html.js $QA/render
node build_pptx.js $OUT/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pptx
cp $QA/render/deck.pdf $OUT/KeenKids_Thanksgiving_Feast_G1-2_FINAL.pdf
cp $QA/render/contact_sheet.png $QA/KeenKids_Thanksgiving_Feast_Contact_Sheet.png
rm -rf $QA/slides && cp -R $QA/render/png $QA/slides
node verify_code.js > /dev/null
node check_outputs.js $OUT > /dev/null
node gen_docs.js
