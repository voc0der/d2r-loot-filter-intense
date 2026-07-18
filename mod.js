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
  'wms', // Thawing Potion
  'yps', // Antidote Potion
  'vps', // Stamina Potion
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

// Elite weapon bases with no popular use: not A2/A5 merc gear, not a common
// runeword base, no unique/set worth keeping. A base's ground label is ONE
// string shared by every rarity, so hiding a base hides its white, blue,
// yellow, unique and set drops alike — every unique/set on this list is
// junk-tier (verified against game data; see README for the full breakdown).
const UNPOPULAR_BASE_KEYS = [
  // Axes (1H) — Berserker Axe (Grief/BotD) and Ettin Axe (eth Oath) stay visible
  '7ha', // Tomahawk
  '7ax', // Small Crescent
  '7mp', // War Spike
  // Axes (2H)
  '7la', // Feral Axe
  '7ba', // Silver-edged Axe
  '7bt', // Decapitator
  '7ga', // Champion Axe
  '7gi', // Glorious Axe
  // Clubs / maces / hammers — Scourge (Stormlash), Legendary Mallet
  // (Schaefer's) and Ogre Maul (IK set) stay visible
  '7cl', // Truncheon
  '7sp', // Tyrant Club (hides Demon Limb — prebuff niche)
  '7gm', // Thunder Maul
  '7ma', // Reinforced Mace
  '7mt', // Devil Star
  // Daggers — Bone Knife (Wizardspike) stays visible
  '7di', // Mithral Point
  '7bl', // Legend Spike
  '7kr', // Fanged Knife
  // Throwing — Winged Knife (Warshrike) stays visible
  '7ta', // Flying Axe
  '7b8', // Winged Axe
  '7tk', // Flying Knife
  // Javelins (non-Amazon; Matriarchal class javelins are separate codes)
  '7gl', // Ghost Glaive
  '7ja', // Hyperion Javelin
  '7pi', // Stygian Pilum
  '7s7', // Balrog Spear
  '7ts', // Winged Harpoon
  // Polearms — every other elite polearm is A2 merc gear and stays visible
  '7o7', // Ogre Axe
  // Swords — Phase Blade, Colossus Blade and Colossal Sword stay visible
  '7sm', // Ataghan
  '7ss', // Falcata
  '7sb', // Elegant Blade
  '7fc', // Hydra Edge
  '7bs', // Conquest Sword
  '72h', // Legend Sword
  '7cm', // Highland Blade
  '7gs', // Balrog Blade
  '7b7', // Champion Sword
  '7wd', // Mythical Sword (hides Bul-Kathos set sword)
  '7ls', // Cryptic Sword
  // Crossbows — all elite crossbows
  '6lx', // Pellet Bow
  '6mx', // Gorgon Crossbow
  '6hx', // Colossus Crossbow
  '6rx', // Demon Crossbow
];

const enabledGroups = [
  { name: '100% Rejuv Only', enabled: config.rejuvOnly, keys: REJUV_ONLY_KEYS },
  { name: 'Hide Ammo', enabled: config.hideAmmo, keys: AMMO_KEYS },
  { name: 'Hide Throwing Potions', enabled: config.hideThrowing, keys: THROWING_KEYS },
  { name: 'Hide Unpopular Bases', enabled: config.hideUnpopularBases, keys: UNPOPULAR_BASE_KEYS },
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
