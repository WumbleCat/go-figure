// Idempotent patch: fix metro-config import() fallback on Windows + Node 24.
// Without this, metro-config tries `await import("E:\\...\\metro.config.js")`,
// which Node 24's ESM loader rejects with ERR_UNSUPPORTED_ESM_URL_SCHEME.
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'metro-config', 'src', 'loadConfig.js');
if (!fs.existsSync(target)) {
  process.exit(0);
}

let src = fs.readFileSync(target, 'utf8');
let changed = false;

if (!src.includes('var _url = require("url");')) {
  src = src.replace(
    'var path = _interopRequireWildcard(require("path"));',
    'var path = _interopRequireWildcard(require("path"));\nvar _url = require("url");'
  );
  changed = true;
}

if (src.includes('await import(absolutePath)')) {
  src = src.replace(
    'await import(absolutePath)',
    'await import(_url.pathToFileURL(absolutePath).href)'
  );
  changed = true;
}

if (changed) {
  fs.writeFileSync(target, src);
  console.log('[patch-metro-config] applied Windows ESM URL fix');
}
