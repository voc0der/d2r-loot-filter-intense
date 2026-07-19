const fs = require('node:fs');
const path = require('node:path');

const { render } = require('./render-base-policy');

const outputPath = path.resolve(__dirname, '..', 'docs', 'BASE_POLICY.md');
fs.writeFileSync(outputPath, render());
console.log(`Wrote ${outputPath}`);
