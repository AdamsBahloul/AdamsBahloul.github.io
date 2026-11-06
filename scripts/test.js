/**
 * =============================================================================
 * AUTOMATED TEST SUITE - PORTFOLIO AUDIT & VERIFICATION
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    testsFailed++;
  }
}

console.log('\n===============================================');
console.log(' RUNNING PORTFOLIO VERIFICATION SUITE');
console.log('===============================================\n');

// 1. Data File Tests
runTest('Central data file exists and exports valid portfolioData', () => {
  const dataPath = path.join(ROOT_DIR, 'src', 'data', 'portfolio.js');
  assert.ok(fs.existsSync(dataPath), 'src/data/portfolio.js should exist');
  const { portfolioData } = require(dataPath);
  assert.ok(portfolioData, 'portfolioData object should be exported');
  assert.strictEqual(portfolioData.personal.name, 'Adam Bahloul');
  assert.ok(portfolioData.projects.length >= 3, 'Must have at least 3 featured projects');
  assert.ok(portfolioData.playground.length >= 4, 'Must have at least 4 experiments');
  assert.ok(portfolioData.skills.categories.length >= 3, 'Must have at least 3 skill categories');
});

// 2. Identity Leakage Tests
runTest('No original owner identity remains in active portfolio source files', () => {
  const activeFiles = [
    'index.html',
    'src/data/portfolio.js',
    'src/js/main.js',
    'src/css/styles.css',
  ];

  const forbiddenTerms = [
    'Roshan Sahu',
    'roshansahu',
    'roshan-sahu.com',
    'hello.roshansahu@gmail.com',
  ];

  activeFiles.forEach((file) => {
    const filePath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');

    forbiddenTerms.forEach((term) => {
      // Ignore reference stylesheet names if they contain it as directory name
      const cleanContent = content.replace(/Roshan Sahu _ Creative Developer_files/g, '');
      const hasForbidden = new RegExp(`\\b${term}\\b`, 'i').test(cleanContent);
      assert.ok(!hasForbidden, `File ${file} must not contain original owner reference "${term}"`);
    });
  });
});

// 3. TODO Placeholders Validation
runTest('All unknown personal links and files are explicitly marked TODO', () => {
  const dataPath = path.join(ROOT_DIR, 'src', 'data', 'portfolio.js');
  const { portfolioData } = require(dataPath);

  assert.ok(portfolioData.contact.email.includes('TODO'), 'Email should contain TODO marker');
  assert.ok(portfolioData.contact.linkedin.includes('TODO'), 'LinkedIn should contain TODO marker');
  assert.ok(portfolioData.contact.github.includes('TODO'), 'GitHub should contain TODO marker');
  assert.ok(portfolioData.contact.cvPath.includes('TODO'), 'CV path should contain TODO marker');

  // Check projects link
  portfolioData.projects.forEach((proj) => {
    if (proj.link && !proj.link.startsWith('http')) {
      assert.ok(proj.link.includes('TODO'), `Project ${proj.title} link should have TODO marker if unverified`);
    }
  });
});

// 4. Accessibility & Semantics
runTest('index.html contains semantic landmarks and accessibility tags', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');

  assert.ok(html.includes('<header>'), 'Should contain <header>');
  assert.ok(html.includes('<nav'), 'Should contain <nav>');
  assert.ok(html.includes('<main>'), 'Should contain <main>');
  assert.ok(html.includes('<footer'), 'Should contain <footer>');
  assert.ok(html.includes('role="dialog"'), 'Should contain accessible modal dialog');
  assert.ok(html.includes('aria-modal="true"'), 'Modal should have aria-modal="true"');
  assert.ok(html.includes('aria-label='), 'Should contain accessible aria labels');

  // Verify all img tags have alt attribute
  const imgTags = html.match(/<img[^>]*>/g) || [];
  imgTags.forEach((img) => {
    assert.ok(img.includes('alt="'), `Image tag must have alt attribute: ${img.slice(0, 50)}...`);
  });
});

// 5. Reduced Motion & Responsive Support
runTest('Reduced motion and responsive queries are implemented', () => {
  const css = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'styles.css'), 'utf-8');
  assert.ok(css.includes('prefers-reduced-motion: reduce'), 'CSS must handle prefers-reduced-motion');

  const js = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'main.js'), 'utf-8');
  assert.ok(js.includes('prefers-reduced-motion'), 'JS must check prefers-reduced-motion');
});

// 6. Project & Playground Assets
runTest('All project and experiment SVG assets exist on disk', () => {
  const dataPath = path.join(ROOT_DIR, 'src', 'data', 'portfolio.js');
  const { portfolioData } = require(dataPath);

  portfolioData.projects.forEach((proj) => {
    (proj.images || []).forEach((imgRel) => {
      const clean = imgRel.replace(/^\.\//, '');
      const full = path.join(ROOT_DIR, clean);
      assert.ok(fs.existsSync(full), `Asset for ${proj.title} must exist: ${full}`);
    });
  });

  portfolioData.playground.forEach((exp) => {
    if (exp.thumbnail) {
      const clean = exp.thumbnail.replace(/^\.\//, '');
      const full = path.join(ROOT_DIR, clean);
      assert.ok(fs.existsSync(full), `Thumbnail for ${exp.title} must exist: ${full}`);
    }
  });
});

console.log('\n===============================================');
console.log(` RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
console.log('===============================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

