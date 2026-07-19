const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const catalogFixture = require('./fixtures/lod-base-catalog.json');
const policy = require('./fixtures/lod-policy.json');
const {
  MOD_MANIFEST,
  ROOT,
  collectDefaults,
  runMod,
} = require('./helpers/run-mod');

const canonicalHidden = Object.values(policy.hiddenGroups).flat();
const canonicalKeeps = Object.values(policy.mustStayVisible).flat();
const productionKeys = runMod().constants.UNPOPULAR_BASE_KEYS;
const catalog = catalogFixture.items;

function flattenConfig(nodes) {
  return nodes.flatMap((node) => (
    Array.isArray(node.children) ? flattenConfig(node.children) : [node]
  ));
}

test('the production base policy exactly matches the audited LoD fixture', () => {
  assert.deepEqual(productionKeys, canonicalHidden);
  assert.equal(productionKeys.length, 247);
  assert.equal(new Set(productionKeys).size, productionKeys.length);
  assert.match(policy.source.ruleset, /Lord of Destruction/);
  assert.match(policy.source.note, /Pre-Reign-of-the-Warlock/);
  assert.equal(policy.source.d2dataCommit, catalogFixture.source.d2dataCommit);
  assert.deepEqual(
    Object.fromEntries(Object.entries(policy.hiddenGroups).map(([group, keys]) => [group, keys.length])),
    {
      axes: 27,
      clubsMacesHammers: 20,
      daggers: 9,
      assassinClaws: 6,
      throwingWeapons: 11,
      genericJavelins: 15,
      polearms: 13,
      spears: 10,
      swords: 30,
      bows: 14,
      crossbows: 10,
      gloves: 7,
      boots: 3,
      belts: 5,
      genericHelms: 15,
      bodyArmor: 23,
      druidPelts: 1,
      genericShields: 17,
      paladinShields: 11,
    },
  );
});

test('every policy code resolves in the independent pinned LoD base catalog', () => {
  assert.equal(Object.keys(catalog).length, 499);
  Object.entries(catalog).forEach(([code, item]) => {
    assert.match(code, /^[0-9a-z]{3}$/);
    assert.equal(typeof item.name, 'string');
    assert.ok(item.name.length > 0);
    assert.ok(['weapon', 'armor'].includes(item.kind));
    assert.equal(typeof item.type, 'string');
    assert.ok(['normal', 'exceptional', 'elite', 'other'].includes(item.tier));
    assert.equal(Number.isInteger(item.maxSockets), true);
    assert.ok(item.maxSockets >= 0);
    assert.equal(Array.isArray(item.unique), true);
    assert.equal(Array.isArray(item.set), true);
    item.unique.forEach((name) => assert.equal(typeof name, 'string'));
    item.set.forEach((name) => assert.equal(typeof name, 'string'));
  });
  [...productionKeys, ...canonicalKeeps].forEach((code) => {
    assert.ok(catalog[code], `${code} must exist in the pinned LoD catalog`);
    assert.ok(catalog[code].name, `${code} must have a localized base name`);
    assert.ok(['weapon', 'armor'].includes(catalog[code].kind));
  });

  const weaponGroups = [
    'axes', 'clubsMacesHammers', 'daggers', 'assassinClaws', 'throwingWeapons',
    'genericJavelins', 'polearms', 'spears', 'swords', 'bows', 'crossbows',
  ];
  weaponGroups.flatMap((group) => policy.hiddenGroups[group]).forEach((code) => {
    assert.equal(catalog[code].kind, 'weapon', `${code} must be a weapon`);
  });
  Object.keys(policy.hiddenGroups)
    .filter((group) => !weaponGroups.includes(group))
    .flatMap((group) => policy.hiddenGroups[group])
    .forEach((code) => assert.equal(catalog[code].kind, 'armor', `${code} must be armor`));

  assert.deepEqual(catalog['9s9'], {
    name: 'Simbilan', kind: 'weapon', type: 'jave', tier: 'exceptional',
    maxSockets: 0, unique: [], set: [],
  });
  assert.deepEqual(catalog['9ba'], {
    name: 'Bearded Axe', kind: 'weapon', type: 'axe', tier: 'exceptional',
    maxSockets: 5, unique: ['Spellsteel'], set: [],
  });
  assert.deepEqual(catalog.vgl, {
    name: 'Heavy Gloves', kind: 'armor', type: 'glov', tier: 'normal',
    maxSockets: 0, unique: ['Bloodfist'], set: ["McAuley's Taboo"],
  });
  assert.deepEqual(catalog.msk, {
    name: 'Mask', kind: 'armor', type: 'helm', tier: 'normal',
    maxSockets: 3, unique: ['The Face of Horror'], set: ["Cathan's Visage"],
  });
  assert.deepEqual(catalog.xul, {
    name: 'Chaos Armor', kind: 'armor', type: 'tors', tier: 'exceptional',
    maxSockets: 4, unique: ['Black Hades'], set: ["Trang-Oul's Scales"],
  });
  assert.deepEqual(catalog.dr8, {
    name: "Hunter's Guise", kind: 'armor', type: 'pelt', tier: 'exceptional',
    maxSockets: 3, unique: [], set: ["Aldur's Stony Gaze"],
  });
});

test('reported clutter is hidden and audited endgame exceptions stay visible', () => {
  const hidden = new Set(productionKeys);

  policy.reportedHides.forEach((code) => {
    assert.equal(hidden.has(code), true, `${code} should be hidden`);
  });
  canonicalKeeps.forEach((code) => {
    assert.equal(hidden.has(code), false, `${code} is an explicit keep`);
  });
});

test('important policy tradeoffs are recorded instead of silently masked', () => {
  assert.deepEqual(Object.keys(policy.notableAcceptedCollisions).sort(), [
    '9ba', 'dr8', 'msk', 'vgl', 'xul',
  ]);
  Object.keys(policy.notableAcceptedCollisions).forEach((code) => {
    assert.equal(productionKeys.includes(code), true);
    assert.ok(policy.notableAcceptedCollisions[code].length > 0);
  });

  const hiddenWithCollisions = productionKeys.filter((code) => (
    catalog[code].unique.length > 0 || catalog[code].set.length > 0
  ));
  assert.equal(hiddenWithCollisions.length, 199);
  assert.deepEqual(hiddenWithCollisions, policy.acceptedHiddenCollisionCodes);
  policy.acceptedHiddenCollisionCodes.forEach((code) => {
    assert.ok(
      catalog[code].unique.length > 0 || catalog[code].set.length > 0,
      `${code} must have an explicit catalog collision`,
    );
  });

  policy.mustStayVisible.rareSetBases.forEach((code) => {
    assert.ok(catalog[code].set.length > 0, `${code} must protect a rare set base`);
  });
});

test('configuration defaults and option values are internally valid', () => {
  const controls = flattenConfig(MOD_MANIFEST.config);
  const constants = runMod().constants;
  const ids = controls.map((control) => control.id);
  assert.equal(new Set(ids).size, ids.length, 'config IDs must be unique');

  controls.filter((control) => control.type === 'checkbox').forEach((control) => {
    assert.equal(control.defaultValue, false, `${control.id} must default off`);
  });
  controls.filter((control) => control.type === 'select').forEach((control) => {
    assert.equal(
      control.options.some((option) => option.value === control.defaultValue),
      true,
      `${control.id} default must be one of its options`,
    );
  });

  assert.deepEqual(collectDefaults(MOD_MANIFEST.config), {
    rejuvOnly: false,
    hideAmmo: false,
    hideLargeCharms: false,
    hideThrowing: false,
    hideUnpopularBases: false,
    redSuperiorItems: false,
    blackLabelsToDots: false,
    gemCrunch: false,
    hideStyle: 'ÿc5.',
    goldLabel: 'unchanged',
  });

  const hideStyle = controls.find((control) => control.id === 'hideStyle');
  assert.deepEqual(hideStyle.options.map((option) => option.value), constants.HIDE_STYLES);

  const goldLabel = controls.find((control) => control.id === 'goldLabel');
  assert.deepEqual(
    goldLabel.options.map((option) => option.value),
    ['unchanged', ...Object.keys(constants.GOLD_LABELS)],
  );
});

test('small hide groups and gem tiers retain their canonical contracts', () => {
  const constants = runMod().constants;
  assert.deepEqual(constants.REJUV_ONLY_KEYS, [
    'rvs', 'hp1', 'hp2', 'hp3', 'hp4', 'hp5',
    'mp1', 'mp2', 'mp3', 'mp4', 'mp5', 'wms', 'yps', 'vps',
  ]);
  assert.deepEqual(constants.AMMO_KEYS, ['aqv', 'cqv']);
  assert.deepEqual(constants.LARGE_CHARM_KEYS, ['cm2']);
  assert.deepEqual(constants.THROWING_KEYS, ['gpl', 'gpm', 'gps', 'opl', 'opm', 'ops']);
  assert.equal(constants.RED_COLOR_CODE, 'ÿc1');
  assert.equal(constants.SUPERIOR_PREFIX_KEY, 'Hiquality');
  assert.equal(constants.SUPERIOR_FORMAT_KEY, 'HiqualityFormat');
  assert.deepEqual(constants.GEM_TIER_LABELS, ['1', '2', '3', '4', 'P']);

  const gemCodes = constants.GEM_CRUNCH.flatMap((gem) => gem.codes);
  assert.equal(constants.GEM_CRUNCH.length, 7);
  assert.equal(gemCodes.length, 35);
  assert.equal(new Set(gemCodes).size, 35);
});

test('published descriptions use the exact audited base count', () => {
  const files = ['mod.json', 'README.md', 'docs/NEXUS.md'];
  files.forEach((relativePath) => {
    const contents = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
    assert.match(contents, /247 (?:aggressively filtered|low-priority)/, relativePath);
    assert.doesNotMatch(contents, /91 (?:aggressively filtered|low-priority)/, relativePath);
  });
});

test('documentation retains the dangerous runtime and collision warnings', () => {
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  [
    'Superior Heavy Gloves',
    'Superior Mage Plate',
    'Red Superior Items',
    "socketed Hunter's Guise",
    'Bloodfist',
    "Aldur's Stony Gaze",
    "Trang-Oul's Scales",
    'shared by every rarity and quality',
  ].forEach((warning) => assert.ok(readme.includes(warning), warning));
});
