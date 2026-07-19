const assert = require('node:assert/strict');
const test = require('node:test');

const qualityFormats = require('./fixtures/lod-quality-formats.json');
const policy = require('./fixtures/lod-policy.json');
const {
  ITEM_NAMES_PATH,
  ITEM_NAME_AFFIXES_PATH,
  localeEntry,
  runMod,
} = require('./helpers/run-mod');

const hiddenKeys = Object.values(policy.hiddenGroups).flat();
const keepKeys = Object.values(policy.mustStayVisible).flat();

function entryByKey(entries, key) {
  return entries.find((entry) => entry.Key === key);
}

function applyQualityFormat(format, prefix, base) {
  const visibleFormat = format.includes(':') ? format.slice(format.indexOf(':') + 1) : format;
  return visibleFormat.replace('%0', prefix).replace('%1', base);
}

test('all options off performs no file reads or writes', () => {
  const result = runMod();
  assert.deepEqual(result.reads, []);
  assert.deepEqual(result.writes, []);
  assert.deepEqual(result.logs, ['No filter groups enabled — nothing to do.']);
});

test('each simple hide group changes exactly its configured keys', async (t) => {
  const constants = runMod().constants;
  const specs = [
    ['rejuvOnly', constants.REJUV_ONLY_KEYS],
    ['hideAmmo', constants.AMMO_KEYS],
    ['hideLargeCharms', constants.LARGE_CHARM_KEYS],
    ['hideThrowing', constants.THROWING_KEYS],
  ];

  for (const [configId, keys] of specs) {
    await t.test(configId, () => {
      const sentinels = ['rvl', 'cm1', 'cm3', 'sentinel'];
      const entries = [...new Set([...keys, ...sentinels])]
        .map((key) => localeEntry(key, `Original ${key}`));
      const result = runMod(
        { [configId]: true },
        { [ITEM_NAMES_PATH]: entries },
      );

      keys.forEach((key) => {
        assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], key).enUS, 'ÿc5.');
      });
      sentinels.filter((key) => !keys.includes(key)).forEach((key) => {
        assert.equal(
          entryByKey(result.files[ITEM_NAMES_PATH], key).enUS,
          `Original ${key}`,
        );
      });
    });
  }
});

test('combined hide groups still read and write item names only once', () => {
  const constants = runMod().constants;
  const keys = [
    ...constants.REJUV_ONLY_KEYS,
    ...constants.AMMO_KEYS,
    ...constants.LARGE_CHARM_KEYS,
    ...constants.THROWING_KEYS,
    ...hiddenKeys,
  ];
  const result = runMod(
    {
      rejuvOnly: true,
      hideAmmo: true,
      hideLargeCharms: true,
      hideThrowing: true,
      hideUnpopularBases: true,
    },
    { [ITEM_NAMES_PATH]: keys.map((key) => localeEntry(key, key)) },
  );
  assert.deepEqual(result.reads, [ITEM_NAMES_PATH]);
  assert.deepEqual(result.writes, [ITEM_NAMES_PATH]);
  assert.equal(result.warnings.length, 0);
});

test('missing string keys are skipped with a precise warning', () => {
  const result = runMod(
    { hideAmmo: true },
    { [ITEM_NAMES_PATH]: [localeEntry('aqv', 'Arrows')] },
  );
  assert.deepEqual(result.warnings, [
    'Hide Ammo: key "cqv" not found in the D2R string files — skipped.',
  ]);
  assert.ok(result.logs.includes('Hide Ammo: hid 1 of 2 item names.'));
});

test('Hide Unpopular Bases rewrites all 247 audited keys across locales', () => {
  const entries = [
    ...hiddenKeys.map((key, index) => localeEntry(key, `Hidden ${key}`, { id: index + 1 })),
    ...keepKeys.map((key, index) => localeEntry(key, `Keep ${key}`, { id: 1000 + index })),
  ];
  const result = runMod(
    { hideUnpopularBases: true, hideStyle: 'ÿc5.' },
    { [ITEM_NAMES_PATH]: entries },
  );
  const output = result.files[ITEM_NAMES_PATH];

  hiddenKeys.forEach((key, index) => {
    const entry = entryByKey(output, key);
    assert.equal(entry.id, index + 1);
    assert.equal(entry.Key, key);
    assert.equal(entry.enUS, 'ÿc5.');
    assert.equal(entry.deDE, 'ÿc5.');
    assert.equal(entry.frFR, 'ÿc5.');
  });
  keepKeys.forEach((key) => {
    const entry = entryByKey(output, key);
    assert.equal(entry.enUS, `Keep ${key}`);
    assert.equal(entry.deDE, `DE:Keep ${key}`);
    assert.equal(entry.frFR, `FR:Keep ${key}`);
  });
  assert.deepEqual(result.reads, [ITEM_NAMES_PATH]);
  assert.deepEqual(result.writes, [ITEM_NAMES_PATH]);
  assert.deepEqual(result.warnings, []);
  assert.ok(result.logs.includes('Hide Unpopular Bases: hid 247 of 247 item names.'));
});

test('legacy or malformed hide styles safely fall back to the gray dot', () => {
  const result = runMod(
    { hideAmmo: true, hideStyle: undefined },
    {
      [ITEM_NAMES_PATH]: [
        localeEntry('aqv', 'Arrows'),
        localeEntry('cqv', 'Bolts'),
      ],
    },
  );
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'aqv').enUS, 'ÿc5.');
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'cqv').enUS, 'ÿc5.');
});

test('a saved legacy removeSuperiorPrefix value is ignored', () => {
  const superior = localeEntry('Hiquality', 'Superior');
  const result = runMod(
    { removeSuperiorPrefix: true },
    { [ITEM_NAME_AFFIXES_PATH]: [superior] },
  );

  assert.deepEqual(entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'Hiquality'), superior);
  assert.deepEqual(result.reads, []);
  assert.deepEqual(result.writes, []);
  assert.deepEqual(result.logs, ['No filter groups enabled — nothing to do.']);
});

test('Hide Unpopular Bases preserves Superior while composing hidden bases as Superior dots', () => {
  const superior = localeEntry('Hiquality', 'Superior');
  const result = runMod(
    { hideUnpopularBases: true },
    {
      [ITEM_NAMES_PATH]: [
        ...hiddenKeys.map((key) => localeEntry(key, key)),
        localeEntry('xtp', 'Mage Plate'),
      ],
      [ITEM_NAME_AFFIXES_PATH]: [superior],
    },
  );

  const prefix = entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'Hiquality');
  const hiddenBase = entryByKey(result.files[ITEM_NAMES_PATH], 'vgl');
  const visibleBase = entryByKey(result.files[ITEM_NAMES_PATH], 'xtp');
  ['enUS', 'deDE', 'frFR'].forEach((locale) => {
    assert.equal(prefix[locale], superior[locale]);
    assert.equal(hiddenBase[locale], 'ÿc5.');
  });
  assert.equal(visibleBase.enUS, 'Mage Plate');
  assert.equal(applyQualityFormat(qualityFormats.formats.enUS, prefix.enUS, hiddenBase.enUS), 'Superior ÿc5.');
  assert.equal(applyQualityFormat(qualityFormats.formats.enUS, prefix.enUS, visibleBase.enUS), 'Superior Mage Plate');
  assert.deepEqual(result.reads, [ITEM_NAMES_PATH]);
  assert.deepEqual(result.writes, [ITEM_NAMES_PATH]);
});

test('socketed gray is runtime state and Black Labels to Dots cannot infer it', () => {
  const plainEntries = [
    localeEntry('92a', 'Twin Axe'),
    localeEntry('mpi', 'Military Pick'),
    localeEntry('dr8', "Hunter's Guise"),
  ];
  const blackOnly = runMod(
    { blackLabelsToDots: true },
    { [ITEM_NAMES_PATH]: plainEntries },
  );
  plainEntries.forEach((original) => {
    assert.equal(entryByKey(blackOnly.files[ITEM_NAMES_PATH], original.Key).enUS, original.enUS);
  });

  const withBasePolicy = runMod(
    { hideUnpopularBases: true },
    { [ITEM_NAMES_PATH]: plainEntries },
  );
  plainEntries.forEach((original) => {
    assert.equal(entryByKey(withBasePolicy.files[ITEM_NAMES_PATH], original.Key).enUS, 'ÿc5.');
  });
  assert.equal(blackOnly.reads.some((filePath) => filePath.includes('_profile')), false);
});

test('terminal inline black collapses while visible resets and literal names do not', () => {
  const result = runMod(
    { blackLabelsToDots: true },
    {
      [ITEM_NAMES_PATH]: [
        localeEntry('direct', 'ÿc6Hidden'),
        localeEntry('multi', 'ÿc1Redÿc6Hidden'),
        localeEntry('reset', 'ÿc6Blackÿc0Visible'),
        localeEntry('literal', 'Black Blade'),
        localeEntry('mixedLocales', 'Visible', { deDE: 'ÿc6Versteckt' }),
      ],
      [ITEM_NAME_AFFIXES_PATH]: [
        localeEntry('Crude', 'ÿc6Crude'),
        localeEntry('already', 'ÿc5.ÿc6'),
      ],
    },
  );

  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'direct').enUS, 'ÿc5.');
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'multi').enUS, 'ÿc5.');
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'reset').enUS, 'ÿc6Blackÿc0Visible');
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'literal').enUS, 'Black Blade');
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'mixedLocales').enUS, 'ÿc5.');
  assert.equal(entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'Crude').enUS, 'ÿc5.ÿc6');
  assert.equal(entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'already').enUS, 'ÿc5.ÿc6');
});

test('explicit base hiding wins over inherited black and supports the black dot', () => {
  const result = runMod(
    { hideUnpopularBases: true, blackLabelsToDots: true, hideStyle: 'ÿc6.' },
    {
      [ITEM_NAMES_PATH]: [localeEntry('mpi', 'ÿc6Military Pick')],
      [ITEM_NAME_AFFIXES_PATH]: [],
    },
  );
  assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'mpi').enUS, 'ÿc6.');
});

test('Gem Crunch renames all 35 gems and preserves the reported colors', () => {
  const constants = runMod().constants;
  const affixGemKeys = new Set(['gsw', 'gsg', 'gsr', 'gsb']);
  const itemEntries = [];
  const affixEntries = [];

  constants.GEM_CRUNCH.forEach((gem) => {
    gem.codes.forEach((code) => {
      const target = affixGemKeys.has(code) ? affixEntries : itemEntries;
      target.push(localeEntry(code, `Vanilla ${code}`));
    });
  });
  const result = runMod(
    { gemCrunch: true },
    {
      [ITEM_NAMES_PATH]: itemEntries,
      [ITEM_NAME_AFFIXES_PATH]: affixEntries,
    },
  );
  const allOutput = [
    ...result.files[ITEM_NAMES_PATH],
    ...result.files[ITEM_NAME_AFFIXES_PATH],
  ];

  assert.equal(allOutput.length, 35);
  assert.equal(entryByKey(allOutput, 'gfg').enUS, 'ÿc22Emerald');
  assert.equal(entryByKey(allOutput, 'glb').enUS, 'ÿc34Sapphire');
  assert.equal(entryByKey(allOutput, 'gpy').enUS, 'ÿc9PTopaz');
  assert.equal(entryByKey(allOutput, 'skc').enUS, 'ÿc51Skull');
  assert.ok(result.logs.includes('Gem Crunch: renamed 35 of 35 item names.'));
});

test('compact Gold changes only the runtime amount suffix', () => {
  const cases = [
    ['dollar', 'ÿc4$'],
    ['neutral', 'ÿc4G'],
    ['amountOnly', ''],
  ];

  cases.forEach(([goldLabel, expected]) => {
    const result = runMod(
      { goldLabel },
      {
        [ITEM_NAMES_PATH]: [localeEntry('other', 'Gold Ring')],
        [ITEM_NAME_AFFIXES_PATH]: [
          localeEntry('gld', 'ÿc4Gold'),
          localeEntry('Gold', 'Gold'),
        ],
      },
    );
    assert.equal(entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'gld').enUS, expected);
    assert.equal(entryByKey(result.files[ITEM_NAME_AFFIXES_PATH], 'Gold').enUS, 'Gold');
    assert.equal(entryByKey(result.files[ITEM_NAMES_PATH], 'other').enUS, 'Gold Ring');
  });
});
