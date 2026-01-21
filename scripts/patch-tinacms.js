#!/usr/bin/env node

/**
 * Patch TinaCMS to fix CommonJS/ESM interop issue with color-string
 * 
 * This script patches the tinacms package to use default import instead of named imports
 * for the color-string module, which is a CommonJS module that doesn't properly support
 * named exports in ESM contexts.
 */

const fs = require('fs');
const path = require('path');

// Find all possible tinacms locations in node_modules
const possiblePaths = [
  'node_modules/tinacms/dist/index.js',
  'node_modules/.pnpm/tinacms@3.2.0/node_modules/tinacms/dist/index.js',
];

// Also search for any tinacms installation in .pnpm directory
const pnpmDir = 'node_modules/.pnpm';
if (fs.existsSync(pnpmDir)) {
  const pnpmContents = fs.readdirSync(pnpmDir);
  pnpmContents.forEach(dir => {
    if (dir.startsWith('tinacms@')) {
      possiblePaths.push(path.join(pnpmDir, dir, 'node_modules/tinacms/dist/index.js'));
    }
  });
}

let patched = false;

possiblePaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if already patched
      if (content.includes('import colorString from "color-string"')) {
        console.log(`✓ ${filePath} already patched`);
        patched = true;
        return;
      }
      
      // Check if needs patching
      if (content.includes('import { get as get$6, to as to$1 } from "color-string"')) {
        // Apply the patch
        content = content.replace(
          /import \{ get as get\$6, to as to\$1 \} from "color-string";/g,
          'import colorString from "color-string"; const get$6 = colorString.get; const to$1 = colorString.to;'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Patched ${filePath}`);
        patched = true;
      }
    } catch (err) {
      console.error(`Failed to patch ${filePath}:`, err.message);
    }
  }
});

if (!patched) {
  console.log('⚠ TinaCMS not found or already patched');
}
