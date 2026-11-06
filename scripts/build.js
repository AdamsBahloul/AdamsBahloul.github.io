/**
 * =============================================================================
 * BUILD & ASSET VERIFICATION SCRIPT
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('--- Starting Portfolio Build & Verification ---');

let errors = 0;
let warnings = 0;

// 1. Validate data file
const dataPath = path.join(ROOT_DIR, 'src', 'data', 'portfolio.js');
if (!fs.existsSync(dataPath)) {
  console.error('FAIL: Missing central data file:', dataPath);
  errors++;
} else {
  try {
    const { portfolioData } = require(dataPath);
    if (!portfolioData || !portfolioData.personal || !portfolioData.projects) {
      console.error('FAIL: Central data file missing core schema properties.');
      errors++;
    } else {
      console.log(`PASS: Central data loaded successfully (${portfolioData.projects.length} projects, ${portfolioData.playground.length} experiments).`);
    }
  } catch (e) {
    console.error('FAIL: Error requiring src/data/portfolio.js:', e.message);
    errors++;
  }
}

// 2. Validate index.html
const htmlPath = path.join(ROOT_DIR, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error('FAIL: Missing index.html in project root.');
  errors++;
} else {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  console.log(`PASS: index.html located (${html.length} bytes).`);

  // Check required landmarks
  const requiredTags = ['<nav', '<header', '<main', '<footer', '<section', 'id="hero"', 'id="work"', 'id="playground"', 'id="about"', 'id="skills"', 'id="contact"'];
  requiredTags.forEach((tag) => {
    if (!html.includes(tag)) {
      console.error(`FAIL: index.html missing required landmark/section: ${tag}`);
      errors++;
    }
  });

  // Check local assets referenced in index.html
  const linkMatches = [...html.matchAll(/(?:src|href)=["'](\.[^"']+)["']/g)];
  console.log(`Found ${linkMatches.length} local asset references in index.html.`);
  
  let checkedAssets = 0;
  linkMatches.forEach((match) => {
    const ref = match[1];
    // Ignore internal anchor links
    if (ref.startsWith('#') || ref.includes('TODO:')) return;

    // Remove query params
    const cleanRef = ref.split('?')[0].split('#')[0];
    const assetPath = path.join(ROOT_DIR, cleanRef);

    if (!fs.existsSync(assetPath)) {
      console.error(`FAIL: Asset not found: ${cleanRef} (resolved: ${assetPath})`);
      errors++;
    } else {
      checkedAssets++;
    }
  });
  console.log(`PASS: Verified ${checkedAssets} local asset files on disk.`);
}

console.log('\n-----------------------------------------------');
if (errors === 0) {
  console.log('BUILD SUCCESS: All validation checks passed cleanly.');
  process.exit(0);
} else {
  console.error(`BUILD FAILED: ${errors} errors found.`);
  process.exit(1);
}

