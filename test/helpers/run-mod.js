const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');
const MOD_SOURCE = fs.readFileSync(path.join(ROOT, 'mod.js'), 'utf8');
const MOD_MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'mod.json'), 'utf8'));
const ITEM_NAMES_PATH = 'local/lng/strings/item-names.json';
const ITEM_NAME_AFFIXES_PATH = 'local/lng/strings/item-nameaffixes.json';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function collectDefaults(nodes, defaults = {}) {
  nodes.forEach((node) => {
    if (Array.isArray(node.children)) {
      collectDefaults(node.children, defaults);
    } else if (Object.prototype.hasOwnProperty.call(node, 'defaultValue')) {
      defaults[node.id] = node.defaultValue;
    }
  });
  return defaults;
}

function localeEntry(key, value, extras = {}) {
  return {
    id: 1,
    Key: key,
    enUS: value,
    deDE: `DE:${value}`,
    frFR: `FR:${value}`,
    ...extras,
  };
}

function runMod(configOverrides = {}, inputFiles = {}) {
  const config = {
    ...collectDefaults(MOD_MANIFEST.config),
    ...configOverrides,
  };
  const files = {
    [ITEM_NAMES_PATH]: [],
    [ITEM_NAME_AFFIXES_PATH]: [],
    ...clone(inputFiles),
  };
  const reads = [];
  const writes = [];
  const logs = [];
  const warnings = [];

  const context = vm.createContext({
    config,
    D2RMM: {
      readJson(filePath) {
        reads.push(filePath);
        return clone(files[filePath]);
      },
      writeJson(filePath, value) {
        files[filePath] = clone(value);
        writes.push(filePath);
      },
    },
    console: {
      log(message) {
        logs.push(String(message));
      },
      warn(message) {
        warnings.push(String(message));
      },
    },
  });

  vm.runInContext(MOD_SOURCE, context, { filename: 'mod.js' });
  const constants = JSON.parse(vm.runInContext(`JSON.stringify({
    ITEM_NAMES_PATH,
    ITEM_NAME_AFFIXES_PATH,
    SUPERIOR_PREFIX_KEYS,
    HIDE_STYLES,
    GOLD_LABELS,
    REJUV_ONLY_KEYS,
    AMMO_KEYS,
    LARGE_CHARM_KEYS,
    THROWING_KEYS,
    UNPOPULAR_BASE_KEYS,
    GEM_TIER_LABELS,
    GEM_CRUNCH,
  })`, context));

  return {
    config,
    constants,
    files,
    reads,
    writes,
    logs,
    warnings,
  };
}

module.exports = {
  ITEM_NAMES_PATH,
  ITEM_NAME_AFFIXES_PATH,
  MOD_MANIFEST,
  ROOT,
  collectDefaults,
  localeEntry,
  runMod,
};
