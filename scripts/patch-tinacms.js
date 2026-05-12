#!/usr/bin/env node

/**
 * Patch TinaCMS to fix CommonJS/ESM interop issue with color-string.
 *
 * Idempotent: skips when already patched, no-ops when neither signature is
 * present (TinaCMS may have fixed it upstream), and only fails when the
 * target file is missing entirely (meaning the package layout changed).
 */

const fs = require("fs");

const FILE_PATH = "node_modules/tinacms/dist/index.js";

const PATCHED_SIGIL = 'import colorString from "color-string"';
const UNPATCHED_PATTERN =
  /import \{ get as get\$6, to as to\$1 \} from "color-string";/g;

if (!fs.existsSync(FILE_PATH)) {
  console.error(
    `✗ TinaCMS not found at ${FILE_PATH}. Has the package layout changed? Investigate before continuing.`
  );
  process.exit(1);
}

const content = fs.readFileSync(FILE_PATH, "utf8");

if (content.includes(PATCHED_SIGIL)) {
  console.log(`✓ ${FILE_PATH} already patched`);
  process.exit(0);
}

if (UNPATCHED_PATTERN.test(content)) {
  const next = content.replace(
    UNPATCHED_PATTERN,
    'import colorString from "color-string"; const get$6 = colorString.get; const to$1 = colorString.to;'
  );
  fs.writeFileSync(FILE_PATH, next, "utf8");
  console.log(`✓ Patched ${FILE_PATH}`);
  process.exit(0);
}

console.log(
  `ℹ ${FILE_PATH} has neither known signature — assuming TinaCMS fixed the color-string interop upstream and skipping.`
);
process.exit(0);
