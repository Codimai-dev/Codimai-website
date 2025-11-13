// Simple env -> client env bundle generator
// Usage: node scripts/generate-env.js
// Reads .env in the repository root and writes js/env.js exporting an `ENV` object.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'js', 'env.js');

function parseEnv(src) {
  const lines = src.split(/\r?\n/);
  const obj = {};
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith('#')) continue;
    const eq = l.indexOf('=');
    if (eq === -1) continue;
    const key = l.substring(0, eq).trim();
    let val = l.substring(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    obj[key] = val;
  }
  return obj;
}

function generate(env) {
  const safe = JSON.stringify(env, null, 2);
  return `// Auto-generated from .env - do not edit by hand\nexport const ENV = ${safe};\n`;
}

try {
  const src = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const env = parseEnv(src);
  const out = generate(env);
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Wrote', outPath);
} catch (err) {
  console.error('Failed to generate env.js:', err);
  process.exit(1);
}
