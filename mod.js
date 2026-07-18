/**
 * D2R Loot Filter — Intense
 *
 * Hides trash drops by renaming their ground labels in item-names.json to a
 * tiny dot. Runs after any base loot filter in D2RMM load order: readJson sees
 * the output of earlier mods, so writing the same Key again overrides them.
 */

const ITEM_NAMES_PATH = 'local/lng/strings/item-names.json';

// Item codes per filter group. Add codes here to hide more items.
const REJUV_ONLY_KEYS = [
  'rvs', // Rejuvenation Potion (35%) — 'rvl' (Full Rejuvenation) stays visible
  'hp1', // Minor Healing Potion
  'hp2', // Light Healing Potion
  'hp3', // Healing Potion
  'hp4', // Greater Healing Potion
  'hp5', // Super Healing Potion
  'mp1', // Minor Mana Potion
  'mp2', // Light Mana Potion
  'mp3', // Mana Potion
  'mp4', // Greater Mana Potion
  'mp5', // Super Mana Potion
];

const AMMO_KEYS = [
  'aqv', // Arrows
  'cqv', // Bolts
];

const THROWING_KEYS = [
  'gpl', // Rancid Gas Potion
  'gpm', // Choking Gas Potion
  'gps', // Strangling Gas Potion
  'opl', // Oil Potion
  'opm', // Exploding Potion
  'ops', // Fulminating Potion
];

const enabledGroups = [
  { name: '100% Rejuv Only', enabled: config.rejuvOnly, keys: REJUV_ONLY_KEYS },
  { name: 'Hide Ammo', enabled: config.hideAmmo, keys: AMMO_KEYS },
  { name: 'Hide Throwing Potions', enabled: config.hideThrowing, keys: THROWING_KEYS },
].filter((group) => group.enabled);

const hideString = config.hideStyle;

if (enabledGroups.length === 0) {
  console.log('No filter groups enabled — nothing to do.');
} else {
  // Combined key set from all enabled groups so item-names.json is read and
  // written exactly once no matter how many groups are on.
  const keysToHide = {};
  enabledGroups.forEach((group) => {
    group.keys.forEach((key) => {
      keysToHide[key] = true;
    });
  });

  const itemNames = D2RMM.readJson(ITEM_NAMES_PATH);

  if (!Array.isArray(itemNames)) {
    console.warn(`${ITEM_NAMES_PATH} did not parse as an array — skipping, no changes written.`);
  } else {
    const renamedKeys = {};
    itemNames.forEach((entry) => {
      if (entry != null && keysToHide[entry.Key] === true) {
        entry.enUS = hideString;
        renamedKeys[entry.Key] = true;
      }
    });

    let totalHidden = 0;
    enabledGroups.forEach((group) => {
      let hidden = 0;
      group.keys.forEach((key) => {
        if (renamedKeys[key] === true) {
          hidden += 1;
        } else {
          console.warn(`${group.name}: key "${key}" not found in ${ITEM_NAMES_PATH} — skipped.`);
        }
      });
      totalHidden += hidden;
      console.log(`${group.name}: hid ${hidden} of ${group.keys.length} item names.`);
    });

    D2RMM.writeJson(ITEM_NAMES_PATH, itemNames);
    console.log(`Done: ${totalHidden} item name(s) hidden in total.`);
  }
}
