#!/usr/bin/env node
/**
 * Generate placeholder assets for development
 * Run: node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// Minimal 1x1 blue PNG (base64)
const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const assets = ['icon.png', 'splash.png', 'adaptive-icon.png'];

assets.forEach((asset) => {
  const assetPath = path.join(assetsDir, asset);
  if (!fs.existsSync(assetPath)) {
    fs.writeFileSync(assetPath, MINIMAL_PNG);
    console.log(`Created placeholder: ${asset}`);
  } else {
    console.log(`Already exists: ${asset}`);
  }
});

console.log('\nPlaceholder assets created. Replace with your actual app icons before release.');
console.log('Recommended sizes:');
console.log('  - icon.png: 1024x1024');
console.log('  - splash.png: 1284x2778');
console.log('  - adaptive-icon.png: 1024x1024');
