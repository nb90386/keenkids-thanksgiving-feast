// Shared Chromium launcher (uses already-installed Playwright Chromium 1254; no download).
const { chromium } = require('playwright-core');
const path = require('path'), os = require('os');
const EXE = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell');
module.exports.launch = (opts = {}) => chromium.launch({ executablePath: EXE, ...opts });
