# Third-party code in this folder

These files are unmodified webpack builds of the Scratch engine. They are vendored only so the headless gameplay tests can run the lesson projects in the real Scratch runtime. They are not part of this project's own code.

| File | Package | Version | License |
|---|---|---|---|
| `scratch-vm.js`, `chunks/` | scratch-vm (Scratch Foundation / MIT) | 5.0.299 (embedded `package.json`) | **AGPL-3.0-only**, as declared in the bundle's embedded `package.json` |
| `scratch-render.js` | scratch-render (Scratch Foundation) | 2.2.84 | See the package's published LICENSE |
| `scratch-storage.js` | scratch-storage (Scratch Foundation) | 6.2.1 | See the package's published LICENSE |

Source code for all three: https://github.com/scratchfoundation (the `scratch-editor` monorepo and the `scratch-storage` repository) and the corresponding npm packages. The bundles also include third-party code under its own notices (MIT, BSD-3-Clause), which are preserved inline.

Secret scanners (gitleaks) report `aws-access-token` matches in `scratch-vm.js` and `scratch-render.js`. These are false positives: the matched strings are inside base64-encoded font data embedded in the bundles, not credentials.
