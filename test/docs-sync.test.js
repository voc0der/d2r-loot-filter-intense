const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { render } = require('../scripts/render-base-policy');
const { ROOT } = require('./helpers/run-mod');

test('generated base policy documentation matches the pinned catalog and policy', () => {
  const documented = fs.readFileSync(path.join(ROOT, 'docs', 'BASE_POLICY.md'), 'utf8');
  assert.equal(documented, render());
});

test('README links to the generated authoritative policy table', () => {
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  assert.ok(readme.includes(
    '[full generated code/name/collision table](https://github.com/voc0der/d2r-loot-filter-intense/blob/main/docs/BASE_POLICY.md)',
  ));
});
