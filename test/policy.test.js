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
const goodButCommonKeys = runMod().constants.GOOD_BUT_COMMON_KEYS;
const dangerousTwoHandedKeys = runMod().constants.DANGEROUS_TWO_HANDED_KEYS;
const catalog = catalogFixture.items;

function flattenConfig(nodes) {
  return nodes.flatMap((node) => (
    Array.isArray(node.children) ? flattenConfig(node.children) : [node]
  ));
}

test('the production base policy exactly matches the audited LoD fixture', () => {
  assert.deepEqual(productionKeys, canonicalHidden);
  assert.equal(productionKeys.length, 321);
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
      assassinClaws: 10,
      throwingWeapons: 11,
      genericJavelins: 15,
      amazonWeapons: 12,
      polearms: 13,
      spears: 12,
      swords: 30,
      bows: 20,
      crossbows: 10,
      scepters: 6,
      wands: 8,
      staves: 10,
      sorceressOrbs: 9,
      belts: 6,
      genericHelms: 15,
      barbarianHelms: 9,
      bodyArmor: 23,
      druidPelts: 9,
      necromancerHeads: 9,
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
    if (item.kind === 'weapon') {
      // Straight from d2data's 2handed/1or2handed columns; "oneOrTwo" is
      // two-handed for every class except the Barbarian.
      assert.ok(['one', 'two', 'oneOrTwo'].includes(item.handed), `${code} needs a handedness`);
    } else {
      assert.equal(item.handed, undefined, `${code} is armor and has no handedness`);
    }
    assert.equal(Number.isInteger(item.maxSockets), true);
    assert.ok(item.maxSockets >= 0);
    assert.equal(Array.isArray(item.unique), true);
    assert.equal(Array.isArray(item.set), true);
    item.unique.forEach((name) => assert.equal(typeof name, 'string'));
    item.set.forEach((name) => assert.equal(typeof name, 'string'));
  });
  [...productionKeys, ...canonicalKeeps, ...goodButCommonKeys, ...dangerousTwoHandedKeys].forEach((code) => {
    assert.ok(catalog[code], `${code} must exist in the pinned LoD catalog`);
    assert.ok(catalog[code].name, `${code} must have a localized base name`);
    assert.ok(['weapon', 'armor'].includes(catalog[code].kind));
  });

  const weaponGroups = [
    'axes', 'clubsMacesHammers', 'daggers', 'assassinClaws', 'throwingWeapons',
    'genericJavelins', 'amazonWeapons', 'polearms', 'spears', 'swords', 'bows',
    'crossbows', 'scepters', 'wands', 'staves', 'sorceressOrbs',
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
    handed: 'one', maxSockets: 0, unique: [], set: [],
  });
  assert.deepEqual(catalog['9ba'], {
    name: 'Bearded Axe', kind: 'weapon', type: 'axe', tier: 'exceptional',
    handed: 'two', maxSockets: 5, unique: ['Spellsteel'], set: [],
  });
  assert.deepEqual(catalog['6ws'], {
    name: 'Archon Staff', kind: 'weapon', type: 'staf', tier: 'elite',
    handed: 'two', maxSockets: 6, unique: ["Mang Song's Lesson"], set: [],
  });
  assert.deepEqual(catalog['7gd'], {
    name: 'Colossus Blade', kind: 'weapon', type: 'swor', tier: 'elite',
    handed: 'oneOrTwo', maxSockets: 6,
    unique: ['The Grandfather'], set: ["Bul-Kathos' Sacred Charge"],
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

test('Hide Good but Common is a separate, non-overlapping second pass', () => {
  assert.deepEqual(goodButCommonKeys, policy.goodButCommon);
  assert.equal(goodButCommonKeys.length, 13);
  assert.equal(new Set(goodButCommonKeys).size, goodButCommonKeys.length);

  // The two hide lists must stay disjoint so each group's report count is real.
  const hidden = new Set(productionKeys);
  goodButCommonKeys.forEach((code) => {
    assert.equal(hidden.has(code), false, `${code} must not also be an unpopular base`);
    assert.ok(catalog[code], `${code} must exist in the pinned LoD catalog`);
    assert.ok(['normal', 'exceptional'].includes(catalog[code].tier), `${code} must be a common tier`);
  });

  // Every one of these was an explicit Hide Unpopular Bases keep, so the keep
  // list must no longer claim them.
  const keeps = new Set(canonicalKeeps);
  goodButCommonKeys.forEach((code) => {
    assert.equal(keeps.has(code), false, `${code} moved to Hide Good but Common`);
  });

  // Bases still worth inspecting for a roll are deliberately excluded.
  ['ci0', 'ci1', 'ci2', 'ci3'].forEach((code) => {
    assert.equal(goodButCommonKeys.includes(code), false, `${code} stays visible for good rolls`);
    assert.equal(hidden.has(code), false, `${code} stays visible for good rolls`);
  });
});

test('Hide Dangerous 2H Bases hides only shieldless builds Hardcore cannot justify', () => {
  const canonicalDanger = Object.values(policy.twoHandedDanger).flat();
  assert.deepEqual(dangerousTwoHandedKeys, canonicalDanger);
  assert.equal(dangerousTwoHandedKeys.length, 21);
  assert.equal(new Set(dangerousTwoHandedKeys).size, dangerousTwoHandedKeys.length);

  // Every hidden base must actually be two-handed, and must be a caster staff
  // or a class-locked Amazon spear — nothing a mercenary could ever hold.
  dangerousTwoHandedKeys.forEach((code) => {
    assert.equal(catalog[code].handed, 'two', `${code} must be two-handed`);
    assert.ok(['staf', 'aspe'].includes(catalog[code].type), `${code} must be a staff or Amazon spear`);
  });
  assert.deepEqual(policy.twoHandedDanger.staves.map((code) => catalog[code].type), Array(15).fill('staf'));
  assert.deepEqual(policy.twoHandedDanger.amazonSpears.map((code) => catalog[code].type), Array(6).fill('aspe'));

  // Quest staves are not spawnable bases and must never appear in any group.
  policy.questStavesNeverHidden.forEach((code) => {
    assert.equal(catalog[code], undefined, `${code} is a quest item, not a spawnable base`);
    [dangerousTwoHandedKeys, productionKeys, goodButCommonKeys].forEach((group) => {
      assert.equal(group.includes(code), false, `${code} must never be hidden`);
    });
  });
});

test('the two-handed audit covers every two-handed base in the pinned catalog', () => {
  const canonicalDanger = Object.values(policy.twoHandedDanger).flat();
  const { barbarianVersatileSwords, ...trueTwoHandedKeeps } = policy.twoHandedKept;
  const kept = Object.values(trueTwoHandedKeeps).flat();
  const twoHandedCodes = Object.entries(catalog)
    .filter(([, item]) => item.handed === 'two')
    .map(([code]) => code)
    .sort();

  // Nothing two-handed may be silently unclassified: it is hidden or audited.
  assert.deepEqual([...canonicalDanger, ...kept].sort(), twoHandedCodes);
  assert.equal(twoHandedCodes.length, 117);
  canonicalDanger.forEach((code) => {
    assert.equal(kept.includes(code), false, `${code} cannot be both hidden and kept`);
  });

  // The kept groups are the audited reasons a two-hander survives this pass.
  assert.deepEqual(
    Object.fromEntries(Object.entries(policy.twoHandedKept).map(([group, codes]) => [group, codes.length])),
    {
      rangedBowsAndCrossbows: 42,
      mercenaryPolearmsAndSpears: 33,
      barbarianAxesAndMauls: 21,
      barbarianVersatileSwords: 18,
    },
  );
  policy.twoHandedKept.rangedBowsAndCrossbows.forEach((code) => {
    assert.ok(['bow', 'abow', 'xbow'].includes(catalog[code].type), `${code} must be ranged`);
  });
  policy.twoHandedKept.mercenaryPolearmsAndSpears.forEach((code) => {
    assert.ok(['pole', 'spea'].includes(catalog[code].type), `${code} must be an Act 2 mercenary base`);
  });
  policy.twoHandedKept.barbarianAxesAndMauls.forEach((code) => {
    assert.ok(['axe', 'hamm'].includes(catalog[code].type), `${code} must be a Barbarian two-hander`);
  });
  // 1or2handed swords are one-handed for a Barbarian, so they are not part of
  // the two-handed census at all — they are listed purely to record the audit.
  barbarianVersatileSwords.forEach((code) => {
    assert.equal(catalog[code].handed, 'oneOrTwo', `${code} must be a versatile sword`);
    assert.equal(twoHandedCodes.includes(code), false);
  });
});

test('every glove and boot stays visible while the belt policy is unchanged', () => {
  const hidden = new Set(productionKeys);
  const gloveAndBootCodes = Object.entries(catalog)
    .filter(([, item]) => item.type === 'glov' || item.type === 'boot')
    .map(([code]) => code)
    .sort();

  assert.deepEqual([...policy.mustStayVisible.glovesAndBoots].sort(), gloveAndBootCodes);
  gloveAndBootCodes.forEach((code) => {
    assert.equal(hidden.has(code), false, `${code} gloves/boots must stay visible for rare rolls`);
  });
  assert.deepEqual(policy.hiddenGroups.belts, ['lbl', 'vbl', 'mbl', 'tbl', 'hbl', 'uhc']);
});

test('important policy tradeoffs are recorded instead of silently masked', () => {
  assert.deepEqual(Object.keys(policy.notableAcceptedCollisions).sort(), [
    '6sw', '7p7', '7sr', '8ls', '9ba', '9bw', '9wn', 'am7',
    'am9', 'amb', 'amd', 'ba5', 'dr8', 'msk', 'tbl', 'xul',
  ]);
  Object.keys(policy.notableAcceptedCollisions).forEach((code) => {
    assert.equal(productionKeys.includes(code), true);
    assert.ok(policy.notableAcceptedCollisions[code].length > 0);
  });

  const hiddenWithCollisions = productionKeys.filter((code) => (
    catalog[code].unique.length > 0 || catalog[code].set.length > 0
  ));
  assert.equal(hiddenWithCollisions.length, 224);
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
    hideGoodButCommon: false,
    hideDangerousTwoHanded: false,
    redSuperiorItems: false,
    blackLabelsToDots: false,
    gemCrunch: false,
    muteRestInPeaceSound: false,
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
    assert.match(contents, /321 (?:aggressively filtered|low-priority)/, relativePath);
    assert.doesNotMatch(contents, /310 (?:aggressively filtered|low-priority)/, relativePath);
  });
});

test('documentation retains the dangerous runtime and collision warnings', () => {
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  [
    'Every glove and boot stays visible',
    'Superior Archon Plate',
    'Red Superior Items',
    "socketed Hunter's Guise",
    'Bloodfist',
    "Aldur's Stony Gaze",
    'Stoneraven',
    'Hydra Bow',
    "Trang-Oul's Scales",
    'Goldwrap',
    'Ribcracker',
    "Arreat's Face",
    "Titan's Revenge",
    "Mang Song's Lesson",
    'one-handed for a Barbarian',
    'shared by every rarity and quality',
  ].forEach((warning) => assert.ok(readme.includes(warning), warning));
});
